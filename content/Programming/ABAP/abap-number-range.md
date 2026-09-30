---
title: "Number Range Management (SNRO & Modern APIs)"
description: "Panduan lengkap penomoran dokumen otomatis di SAP ABAP: bahaya konkurensi SELECT MAX + 1, konfigurasi Number Range Object via T-Code SNRO, penomoran internal vs eksternal, interval tahunan, buffering memori vs no buffering (gapless), pemanggilan via Function Module NUMBER_GET_NEXT di On-Premise, pemanggilan modern via class cl_numberrange_runtime di ABAP Cloud, serta integrasi numbering di framework RAP."
order: 17
tags:
  - sap
  - abap
  - number-range
  - snro
  - enterprise
  - database
---

# Number Range Management (SNRO & Modern APIs)

> Target: ABAP Developer (Lanjutan)  
> Prasyarat: [[abap-dictionary|Modul 2: ABAP Dictionary]], [[abap-modularization|Modul 5: Modularization]]  
> Lingkungan: SAP NetWeaver, SAP S/4HANA, SAP BTP ABAP Environment

---

## Gambaran Umum

Setiap dokumen transaksi bisnis di sistem SAP (seperti Sales Order `SO-2026-0001`, Faktur Pajak, atau Material Document) membutuhkan pengenal unik (*unique primary key*) berupa nomor berurutan.

Dalam arsitektur enterprise dengan ratusan pengguna atau antarmuka API yang membuat transaksi secara serentak di detik yang sama, menghasilkan nomor urut yang unik, berurutan, dan bebas dari tabrakan data (*concurrency-safe*) adalah persoalan krusial yang tidak boleh diselesaikan dengan query biasa.

**Number Range Object** adalah fasilitas resmi bawaan kernel SAP untuk mengelola dan menerbitkan nomor urut dokumen secara aman, berkinerja tinggi, dan mendukung kepatuhan hukum (*audit compliance*).

---

## Daftar Isi

### 🟢 Fundamental

1. [Mengapa Penomoran Otomatis Membutuhkan Penanganan Khusus](#1--mengapa-penomoran-otomatis-membutuhkan-penanganan-khusus)
2. [Jebakan Fatal Logika SELECT MAX + 1 (Race Condition)](#2--jebakan-fatal-logika-select-max--1-race-condition)
3. [Konsep Dasar: Penomoran Internal vs Eksternal](#3--konsep-dasar-penomoran-internal-vs-eksternal)
4. [Konfigurasi Number Range Object di T-Code SNRO](#4--konfigurasi-number-range-object-di-t-code-snro)

### 🟡 Lanjutan

5. [Konsep Buffering Memori vs No-Buffering (Gapless Numbering)](#5--konsep-buffering-memori-vs-no-buffering-gapless-numbering)
6. [Implementasi On-Premise Klasik: Function Module NUMBER_GET_NEXT](#6--implementasi-on-premise-klasik-function-module-number_get_next)
7. [Implementasi Modern di ABAP Cloud: Class CL_NUMBERRANGE_RUNTIME](#7--implementasi-modern-di-abap-cloud-class-cl_numberrange_runtime)
8. [Penomoran Dokumen pada RAP: Early vs Late Numbering](#8--penomoran-dokumen-pada-rap-early-vs-late-numbering)
9. [Penanganan Error & Exception: INTERVAL_NOT_FOUND & Batas Kritis](#9--penanganan-error--exception-interval_not_found--batas-kritis)

### 🛠️ Praktik & Rujukan

10. [Praktik: Konfigurasi Objek Penomoran Faktur & Pemanggilan Kode ABAP](#10-️-praktik-konfigurasi-objek-penomoran-faktur--pemanggilan-kode-abap)
11. [Ringkasan & Cheat Code Number Range](#11--ringkasan--cheat-code-number-range)
12. [Referensi Resmi](#12--referensi-resmi)

---

## 1. 🟢 Mengapa Penomoran Otomatis Membutuhkan Penanganan Khusus

Di luar sistem enterprise, developer pemula sering menggunakan kolom *auto-increment* bawaan database atau menghitung nilai maksimum tabel. Di lingkungan SAP, pendekatan tersebut dilarang karena:
* Mengharuskan penguncian tabel database skala penuh (*table locking*) yang memperlambat seluruh pengguna.
* Tidak mendukung pemisahan nomor per entitas bisnis (misal: penomoran faktur berbeda untuk Company Code `1000` vs `2000`).
* Tidak mendukung aturan regulasi perpajakan yang menuntut nomor urut tanpa celah (*gapless numbering*) per tahun fiskal.

---

## 2. 🟢 Jebakan Fatal Logika SELECT MAX + 1 (Race Condition)

Banyak pengembang pemula tergoda menuliskan logika seperti ini:

```abap
" KODE SALAH & SANGAT BERBAHAYA:
SELECT MAX( order_id ) FROM ztsales_order INTO @DATA(lv_max_id).
lv_new_id = lv_max_id + 1.
INSERT INTO ztsales_order VALUES @(...).
```

### Mengapa Logika di Atas Fatal? (*Race Condition*)

```text
Waktu  | Transaksi User A (Kasir 1)              | Transaksi User B (Kasir 2)
───────┼─────────────────────────────────────────┼─────────────────────────────────────────
10:00  | SELECT MAX -> Menemukan ID: 100         | 
10:01  |                                         | SELECT MAX -> Menemukan ID: 100
10:02  | lv_new_id = 100 + 1 = 101               | lv_new_id = 100 + 1 = 101
10:03  | INSERT ID: 101 (SUKSES)                 | 
10:04  |                                         | INSERT ID: 101 (CRASH DUMP DUPLICATE KEY!)
```

Jika dua pengguna atau dua request web API menekan tombol simpan secara bersamaan, keduanya membaca nilai maksimum yang sama (`100`). Akibatnya, transaksi kedua mengalami crash fatal runtime (*Short Dump `DBSQL_DUPLICATE_KEY_ERROR`*).

---

## 3. 🟢 Konsep Dasar: Penomoran Internal vs Eksternal

Saat mendefinisikan interval penomoran di SAP:

| Tipe Penomoran | Mekanisme Pembuatan | Penanda di SAP | Contoh Kasus |
| :--- | :--- | :---: | :--- |
| **Internal Numbering** | Sistem SAP secara otomatis mengambil nomor urut berikutnya dari memori tanpa input user. | Kolom `EXT` **tidak dicentang**. | Nomor Dokumen Akuntansi (`10000001`), Sales Order (`50000012`). |
| **External Numbering** | Pengguna atau sistem luar wajib mengetikkan ID secara manual, namun sistem memeriksa apakah ID berada di dalam rentang yang sah. | Kolom `EXT` **dicentang**. | Kode Material kustom (`MAT-A01`), Nomor Faktur Pajak dari kantor pajak. |

---

## 4. 🟢 Konfigurasi Number Range Object di T-Code SNRO

T-Code **`SNRO`** (atau `SNUM`) digunakan untuk membuat objek penomoran di Data Dictionary:

```text
Atribut Konfigurasi SNRO:
┌─────────────────────────────────────────────────────────────┐
│ Object Name: ZORD_NUM (Nomor Pesanan Penjualan)             │
│ Short Text : Objek Penomoran Pesanan                        │
├─────────────────────────────────────────────────────────────┤
│ • Number Length Domain : CHAR10 (Panjang digit maksimal)    │
│ • Warning Percentage   : 10% (Peringatan saat nomor sisa 10%)│
│ • Subobject Data Elem. : BUKRS (Pemisahan per Company Code) │
│ • To-year Flag         : X (Penomoran di-reset per tahun)   │
├─────────────────────────────────────────────────────────────┤
│ Tombol 'Number Ranges' (Interval):                          │
│ No | Tahun | Rentang Awal  | Rentang Akhir | Status Saat Ini│
│ 01 | 2026  | 0001000000    | 0001999999    | 0001000045     │
└─────────────────────────────────────────────────────────────┘
```

* **To-year Flag**: Jika dicentang, interval dapat didefinisikan berbeda untuk setiap tahun kalender (misal: tahun 2026 mulai dari `1`, tahun 2027 mulai dari `1` lagi).
* **Subobject**: Memungkinkan penomoran independen berdasarkan field tertentu (misal: nomor faktur mandiri per cabang/Company Code).

---

## 5. 🟡 Konsep Buffering Memori vs No-Buffering (Gapless Numbering)

Pada konfigurasi `SNRO`, pilihan mekanisme *Buffering* membawa konsekuensi arsitektural yang sangat penting:

```text
1. Main Memory Buffering (Sangat Cepat - Standar):
   Application Server meminjam 10-100 nomor sekaligus ke dalam RAM (Shared Buffer).
   [User 1: ambil 101] -> [User 2: ambil 102] -> Tidak menyentuh database disk!
   RISIKO: Jika server listrik padam atau di-restart, sisa nomor di RAM HILANG (Gaps).

2. No Buffering / Gapless (Ketat Tanpa Celah - Hukum Akuntansi):
   Setiap permintaan nomor mengunci baris tabel NRIV di database secara langsung.
   KEUNGGULAN: Dijamin 100% urut tanpa ada angka yang melompat (1, 2, 3, 4, 5).
   RISIKO: Menjadi titik kemacetan (Bottleneck) performa jika ribuan user mengakses serentak.
```

* Gunakan **No Buffering** hanya untuk nomor faktur legal atau dokumen finansial resmi yang diaudit kantor pajak.
* Gunakan **Main Memory Buffering** untuk dokumen operasional biasa (Sales Order, Purchase Requisition, IDoc log).

---

## 6. 🟡 Implementasi On-Premise Klasik: Function Module NUMBER_GET_NEXT

Pada program ABAP klasik dan S/4HANA On-Premise, penomoran diambil menggunakan Function Module resmi **`NUMBER_GET_NEXT`**:

```abap
DATA: lv_new_number TYPE c LENGTH 10,
      lv_returncode TYPE inri-returncode.

CALL FUNCTION 'NUMBER_GET_NEXT'
  EXPORTING
    nr_range_nr             = '01'         " Nomor Interval
    object                  = 'ZORD_NUM'   " Nama Objek SNRO
    subobject               = '1000'       " Company Code (jika ada)
    toyear                  = '2026'       " Tahun Fiskal (jika ada)
  IMPORTING
    number                  = lv_new_number
    returncode              = lv_returncode
  EXCEPTIONS
    interval_not_found      = 1
    number_range_not_intern = 2
    object_not_found        = 3
    quantity_is_0           = 4
    quantity_not_1          = 5
    interval_overflow       = 6
    buffer_overflow         = 7
    OTHERS                  = 8.

IF sy-subrc = 0.
  WRITE: / 'Nomor Dokumen Baru Berhasil Diterbitkan:', lv_new_number.
  IF lv_returncode = '1'.
    WRITE: / 'PERINGATAN: Nomor urut pada interval ini hampir habis!'.
  ENDIF.
ELSE.
  WRITE: / 'Gagal mengambil nomor urut. Error Code:', sy-subrc.
ENDIF.
```

---

## 7. 🟡 Implementasi Modern di ABAP Cloud: Class CL_NUMBERRANGE_RUNTIME

Pada model **ABAP Cloud** (SAP BTP ABAP Environment dan SAP S/4HANA Cloud Public Edition), Function Module klasik `NUMBER_GET_NEXT` bukan merupakan *Released API*.

SAP menyediakan kelas pengganti resmi yang berstatus Released: **`CL_NUMBERRANGE_RUNTIME`**:

```abap
" SINTAKS RESMI ABAP CLOUD:
TRY.
    cl_numberrange_runtime=>number_get(
      EXPORTING
        nr_range_nr       = '01'
        object            = 'ZORD_NUM'
        quantity          = 1
      IMPORTING
        number            = DATA(lv_number)
        returncode        = DATA(lv_retcode)
        returned_quantity = DATA(lv_qty)
    ).

    " Nomor baru siap digunakan secara type-safe
    DATA(lv_order_id) = CONV string( lv_number ).

  CATCH cx_nr_object_not_found INTO DATA(lx_obj).
    " Tangani objek SNRO tidak terdaftar
  CATCH cx_number_ranges INTO DATA(lx_nr).
    " Tangani error umum interval penuh atau terkunci
ENDTRY.
```

---

## 8. 🟡 Penomoran Dokumen pada RAP: Early vs Late Numbering

Pada kerangka kerja modern [[abap-rap-odata|SAP RAP (RESTful Application Programming)]], penomoran entitas dikelola secara deklaratif di file Behavior Definition (`.bdef`):

1. **Early Numbering**:
   * Nomor langsung diterbitkan saat pengguna mengklik tombol *Create* di layar Fiori.
   * Cocok jika pengguna perlu melihat nomor ID dokumen sebelum menekan tombol *Save*.
2. **Late Numbering**:
   * Nomor baru diterbitkan di akhir transaksi tepat saat fase *Finalize / Save* ke database.
   * Sangat direkomendasikan untuk **menghindari nomor hangus/gaps** jika pengguna membatalkan pembuatan transaksi di tengah jalan!

```cds
// Definisi pada BDEF RAP:
managed implementation in class zbp_i_order unique;
define behavior for ZI_SalesOrder_R alias Order
late numbering // Penomoran otomatis saat fase simpan permanen
persistent table ztsales_order
{
  create;
  update;
  delete;
}
```

---

## 9. 🟡 Penanganan Error & Exception: INTERVAL_NOT_FOUND & Batas Kritis

Dua insiden operasional yang paling sering terjadi pada Number Range:
1. **`INTERVAL_NOT_FOUND`**:
   * *Penyebab*: Tahun kalender berganti (misal tanggal 1 Januari 2027), namun administrator belum mendaftarkan interval untuk tahun `2027`.
   * *Solusi*: T-Code `SNRO` $\rightarrow$ Tambahkan interval untuk tahun buku baru.
2. **Interval Overflow (Nomor Habis)**:
   * *Penyebab*: Nomor status saat ini sudah mencapai rentang akhir (misal `999999`).
   * *Pencegahan*: Pantau parameter `returncode = '1'` (Warning threshold tercapai) untuk memperluas rentang digit sebelum transaksi macet total.

---

## 10. 🛠️ Praktik: Konfigurasi Objek Penomoran Faktur & Pemanggilan Kode ABAP

### Skenario Bisnis
Kita ingin membangun program pencatat pesanan `ZREP_GENERATE_ORDER_ID` yang menerbitkan nomor ID transaksi berformat otomatis `SO-2026-XXXXXX` menggunakan objek Number Range `ZORD_DEMO`.

### Langkah 1: Simulasi Konfigurasi di T-Code `SNRO`
1. Buka T-Code **`SNRO`** $\rightarrow$ Objek: `ZORD_DEMO`.
2. Domain: `CHAR8` (8 digit).
3. Klik tombol **Number Ranges** $\rightarrow$ **Change Intervals** $\rightarrow$ Tambah Interval:
   * No: `01`
   * From: `00000001`
   * To: `00099999`
   * Ext: [ ] (Kosongkan agar menjadi penomoran otomatis/Internal).
4. Simpan perubahan.

### Langkah 2: Kode Program Penerbit Nomor Dokumen

```abap
*&---------------------------------------------------------------------*
*& Report ZREP_GENERATE_ORDER_ID
*&---------------------------------------------------------------------*
*& Demonstrasi Pengambilan Nomor Dokumen Unik Menggunakan SNRO
*&---------------------------------------------------------------------*
REPORT zrep_generate_order_id LINE-SIZE 85.

DATA: lv_raw_num TYPE c LENGTH 8,
      lv_retcode TYPE inri-returncode,
      lv_full_id TYPE string.

START-OF-SELECTION.

  WRITE: / sy-uline(80).
  WRITE: / '|', (76) 'SISTEM PENERBITAN NOMOR DOKUMEN TRANSAKSI RESMI (SNRO)' CENTERED, '|'.
  WRITE: / sy-uline(80).

  " Mengambil nomor urut otomatis berikutnya yang bebas dari tabrakan konkurensi:
  CALL FUNCTION 'NUMBER_GET_NEXT'
    EXPORTING
      nr_range_nr             = '01'
      object                  = 'ZORD_DEMO'
    IMPORTING
      number                  = lv_raw_num
      returncode              = lv_retcode
    EXCEPTIONS
      interval_not_found      = 1
      number_range_not_intern = 2
      object_not_found        = 3
      OTHERS                  = 4.

  IF sy-subrc = 0.
    " Memformat nomor menjadi kode dokumen bisnis yang profesional
    lv_full_id = |SO-{ sy-datum(4) }-{ lv_raw_num }|.

    WRITE: / '| Status Pengambilan : SUKSES (Concurrency-Safe)', (38) ' ', '|',
           / '| Nomor Mentah SNRO  :', (15) lv_raw_num, (41) ' ', '|',
           / '| ID Dokumen Resmi   :', (25) lv_full_id, (31) ' ', '|'.

    IF lv_retcode = '1'.
      WRITE: / '| PERINGATAN          : Sisa kapasitas nomor interval < 10%!', (26) ' ', '|'.
    ENDIF.
  ELSE.
    WRITE: / '| STATUS : GAGAL! Nomor interval belum dikonfigurasi di T-Code SNRO.', (13) ' ', '|'.
  ENDIF.

  WRITE: / sy-uline(80).
```

### Hasil Eksekusi
```text
---------------------------------------------------------------------------------
|            SISTEM PENERBITAN NOMOR DOKUMEN TRANSAKSI RESMI (SNRO)             |
---------------------------------------------------------------------------------
| Status Pengambilan : SUKSES (Concurrency-Safe)                                |
| Nomor Mentah SNRO  : 00000105                                                 |
| ID Dokumen Resmi   : SO-2026-00000105                                         |
---------------------------------------------------------------------------------
```

---

## 11. 📚 Ringkasan & Cheat Code Number Range

### Peta Konsep
```text
Manajemen Number Range
├── 1. Bahaya Konkurensi
│   └── Hindari SELECT MAX + 1 (Memicu tabrakan duplikasi key saat multi-user)
├── 2. Karakteristik Interval (SNRO)
│   ├── Internal (Otomatis oleh sistem)
│   └── External (Diisi manual oleh user/sistem luar)
├── 3. Pilihan Buffering
│   ├── Main Memory Buffering (Cepat di RAM, nomor bisa melompat/gaps)
│   └── No Buffering (Terkunci di disk NRIV, lambat, mutlak tanpa celah)
└── 4. Konsumsi API
    ├── On-Premise Klasik : Function Module NUMBER_GET_NEXT
    ├── ABAP Cloud Modern : Class CL_NUMBERRANGE_RUNTIME=>NUMBER_GET
    └── SAP RAP           : Deklarasi 'late numbering' pada BDEF
```

### Cheat Code T-Code 10 Detik
```text
SNRO / SNUM  → Konfigurasi Number Range Object & interval batas penomoran
NRIV         → Tabel database fisik tempat seluruh interval penomoran disimpan
```

---

## 12. 🔗 Referensi Resmi

* [SAP Help Portal: Number Range Objects Architecture (BC-CST-NU)](https://help.sap.com/docs/SAP_NETWEAVER_700/c238d694b825421f940829322fed326f/491e847c21351d8de10000000a42189c.html)
* [SAP Help Portal: Class CL_NUMBERRANGE_RUNTIME in ABAP Cloud](https://help.sap.com/docs/ABAP_PLATFORM_NEW/c238d694b825421f940829322fed326f/491e847c21351d8de10000000a42189c.html)
* [SAP Community: Number Range Buffering and High-Volume Best Practices](https://community.sap.com/t5/technology-blogs-by-sap/number-range-buffering-in-sap/ba-p/13278901)
