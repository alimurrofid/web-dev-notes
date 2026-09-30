---
title: "Application Log (SLG0 / SLG1 & BALI Framework)"
description: "Panduan lengkap pencatatan log audit aplikasi di SAP ABAP: perbedaan Application Log vs Short Dump ST22 vs output visual, konfigurasi Object & Subobject di SLG0, investigasi riwayat di SLG1, API klasik Function Module BAL_* (BAL_LOG_CREATE, BAL_LOG_MSG_ADD, BAL_DB_SAVE), arsitektur modern Business Application Log Interface (BALI / CL_BALI_LOG) di ABAP Cloud, serta manajemen retensi log via SLG2."
order: 18
tags:
  - sap
  - abap
  - application-log
  - auditing
  - enterprise
  - monitoring
---

# Application Log (SLG0 / SLG1 & BALI Framework)

> Target: ABAP Developer (Lanjutan)  
> Prasyarat: [[abap-modularization|Modul 5: Modularization (BAPI & Messages)]], [[abap-reports-alv|Modul 6: Message Class (SE91)]]  
> Lingkungan: SAP NetWeaver, SAP S/4HANA, SAP BTP ABAP Environment

---

## Gambaran Umum

Ketika sebuah program ABAP berjalan tanpa antarmuka layar (seperti [[abap-background-jobs|Background Job tengah malam]], pertukaran data [[abap-idoc-ale|IDoc asinkron]], atau pemanggilan web service API), perintah `WRITE` atau pesan popup dialog tidak dapat dilihat oleh siapa pun.

Jika proses batch tersebut memproses 10.000 transaksi dan 50 di antaranya gagal validasi, bagaimana cara konsultan fungsional dan auditor mengetahui transaksi mana saja yang gagal beserta alasan spesifiknya tanpa harus mengulang proses atau mendebug program?

**Application Log (Business Application Log / BAL)** adalah infrastruktur standar resmi SAP untuk mencatat, menyimpan, mengategorikan, dan menganalisis pesan audit transaksi (*Success*, *Warning*, *Error*) secara terstruktur ke dalam database sistem.

---

## Daftar Isi

### 🟢 Fundamental

1. [Mengapa Application Log Diperlukan dalam Proses Bisnis Enterprise](#1--mengapa-application-log-diperlukan-dalam-proses-bisnis-enterprise)
2. [Application Log vs Short Dump (ST22) vs Output Dialog (WRITE)](#2--application-log-vs-short-dump-st22-vs-output-dialog-write)
3. [Struktur Data Log: Object, Subobject, & External ID](#3--struktur-data-log-object-subobject--external-id)
4. [Konfigurasi Objek Log di T-Code SLG0](#4--konfigurasi-objek-log-di-t-code-slg0)

### 🟡 Lanjutan

5. [Siklus Hidup API BAL Klasik: CREATE ──> MSG_ADD ──> DB_SAVE](#5--siklus-hidup-api-bal-klasik-create--msg_add--db_save)
6. [Monitoring & Forensik Log di T-Code SLG1](#6--monitoring--forensik-log-di-t-code-slg1)
7. [Arsitektur Modern ABAP Cloud: BALI Framework (CL_BALI_LOG)](#7--arsitektur-modern-abap-cloud-bali-framework-cl_bali_log)
8. [Integrasi Logging pada Background Jobs, RFC, & BAPI](#8--integrasi-logging-pada-background-jobs-rfc--bapi)
9. [Manajemen Retensi & Pembersihan Log Lama via T-Code SLG2](#9--manajemen-retensi--pembersihan-log-lama-via-t-code-slg2)

### 🛠️ Praktik & Rujukan

10. [Praktik: Membangun Handler Logging Transaksi Batch Penjualan](#10-️-praktik-membangun-handler-logging-transaksi-batch-penjualan)
11. [Ringkasan & Cheat Code Application Log](#11--ringkasan--cheat-code-application-log)
12. [Referensi Resmi](#12--referensi-resmi)

---

## 1. 🟢 Mengapa Application Log Diperlukan dalam Proses Bisnis Enterprise

Dalam operasional enterprise:
* **Tidak Menghentikan Proses Batch**: Jika 1 dari 1.000 pesanan gagal, program tidak boleh crash dump. Program harus mencatat error dokumen tersebut ke log, lalu melanjutkan pemrosesan 999 dokumen lainnya sampai selesai (*Fault Tolerance*).
* **Audit Trail Resmi**: Menyimpan bukti forensik mengenai siapa yang memicu batch, kapan transaksi terjadi, dan parameter apa yang digunakan.
* **Integrasi dengan Message Class (`SE91`)**: Pesan error yang disimpan mengacu pada nomor pesan resmi, sehingga mendukung multibahasa saat dibaca tim operasional di berbagai negara.

---

## 2. 🟢 Application Log vs Short Dump (ST22) vs Output Dialog (WRITE)

Penting untuk membedakan fungsi ketiga media informasi ini:

| Karakteristik | Output Dialog (`WRITE` / `MESSAGE`) | Short Dump (`ST22`) | Application Log (`SLG1`) |
| :--- | :--- | :--- | :--- |
| **Konteks Penggunaan** | Layar interaktif pengguna langsung. | Crash runtime sistem fatal yang tidak tertangani. | **Proses bisnis batch, API, & alur bertahap.** |
| **Kelanjutan Eksekusi** | Program selesai sesuai alur. | **Transaksi terputus paksa (Rollback total).** | **Program tetap berjalan melanjutkan baris lain.** |
| **Persistensi Data** | Hilang saat jendela program ditutup. | Tersimpan di database dump teknis. | **Tersimpan permanen di database log bisnis.** |
| **Konsumen Informasi** | Pengguna akhir (*End User*). | Tim Developer / Basis Administrator. | **Konsultan Fungsional, Operasional, & Auditor.** |

---

## 3. 🟢 Struktur Data Log: Object, Subobject, & External ID

Agar jutaan log transaksi tidak bercampur aduk, SAP menyusun hierarki pengelompokan:

```text
Hierarki Struktur Application Log:
┌─────────────────────────────────────────────────────────────┐
│ 1. Log Object (Didaftarkan di SLG0)                         │
│    Aplikasi Bisnis Payung (Contoh: ZSALES_APP)              │
├─────────────────────────────────────────────────────────────┤
│ 2. Subobject (Didaftarkan di SLG0)                          │
│    Modul Sub-fungsi Spesifik (Contoh: INVOICE_BATCH)        │
├─────────────────────────────────────────────────────────────┤
│ 3. External ID (Ditentukan Dinamis di Kode ABAP)            │
│    Kunci Pengenal Transaksi (Contoh: BATCH-20260930-01)     │
├─────────────────────────────────────────────────────────────┤
│ 4. Log Messages (Isi Pesan Detail)                          │
│    ├── [S] Pesanan SO-101 sukses dibukukan.                 │
│    ├── [W] Pelanggan CUST-99 memiliki batas kredit tipis.   │
│    └── [E] Pesanan SO-102 GAGAL: Material MAT-X habis!      │
└─────────────────────────────────────────────────────────────┘
```

* **Object**: Pengenal aplikasi bisnis tingkat tinggi (misal: `ZSD_ORDER`, `ZFI_PAYMENT`).
* **Subobject**: Area spesifik dalam aplikasi tersebut (misal: `VALIDATION`, `POSTING`).
* **External ID**: String bebas yang diisi saat runtime (misal nomor faktur, tanggal batch run) untuk memudahkan pencarian di `SLG1`.

---

## 4. 🟢 Konfigurasi Objek Log di T-Code SLG0

Sebelum kode ABAP dapat mencatat log, Object dan Subobject wajib didaftarkan terlebih dahulu di Data Dictionary melalui T-Code **`SLG0`**:

1. Jalankan T-Code **`SLG0`**.
2. Klik tombol **New Entries**.
3. Masukkan Object Name (misal: **`ZLOG_SALES`**) dan Deskripsi.
4. Klik dua kali pada folder **Sub-objects** di panel kiri.
5. Daftarkan sub-kategori proses:
   * Subobject **`BILLING`**: *Proses Pembuatan Faktur Massal*.
   * Subobject **`DELIVERY`**: *Proses Pengiriman Barang*.
6. Simpan konfigurasi ke dalam Transport Request.

---

## 5. 🟡 Siklus Hidup API BAL Klasik: CREATE ──> MSG_ADD ──> DB_SAVE

Pada Classic ABAP dan SAP S/4HANA On-Premise, developer mengelola log melalui rangkaian Function Module standar dari kelompok fungsi `SZXG` (*Business Application Log*):

```text
Alur Eksekusi API BAL:
        │
        ▼
[ BAL_LOG_CREATE ]    --> Membuka memori log & mendapatkan Handle Log (lv_log_handle)
        │
        ▼ (Loop Transaksi Bisnis)
[ BAL_LOG_MSG_ADD ]   --> Menyuntikkan pesan demi pesan ke dalam memori log
        │
        ▼
[ BAL_DB_SAVE ]       --> Menulis seluruh isi log dari RAM permanen ke tabel BALHDR/BALDAT
```

### 1. Inisialisasi Log (`BAL_LOG_CREATE`)
```abap
DATA: ls_log        TYPE bal_s_log,
      lv_log_handle TYPE balloghndl.

ls_log-object    = 'ZLOG_SALES'.
ls_log-subobject = 'BILLING'.
ls_log-extnumber = 'BATCH-RUN-2026'.
ls_log-aldate    = sy-datum.
ls_log-altime    = sy-uzeit.
ls_log-aluser    = sy-uname.

CALL FUNCTION 'BAL_LOG_CREATE'
  EXPORTING  i_s_log      = ls_log
  IMPORTING  e_log_handle = lv_log_handle
  EXCEPTIONS log_header_inconsistent = 1
             OTHERS                   = 2.
```

### 2. Menambahkan Pesan (`BAL_LOG_MSG_ADD`)
```abap
DATA ls_msg TYPE bal_s_msg.

ls_msg-msgty = 'E'.           " 'S'=Success, 'I'=Info, 'W'=Warning, 'E'=Error
ls_msg-msgid = 'ZMSG_SALES'.  " Message Class (SE91)
ls_msg-msgno = '005'.         " Nomor Pesan
ls_msg-msgv1 = 'MAT-990'.     " Placeholder &1
ls_msg-msgv2 = 'PLANT-10'.    " Placeholder &2

CALL FUNCTION 'BAL_LOG_MSG_ADD'
  EXPORTING  i_log_handle = lv_log_handle
             i_s_msg      = ls_msg
  EXCEPTIONS OTHERS       = 1.
```

### 3. Menyimpan Permanen ke Database (`BAL_DB_SAVE`)
```abap
DATA lt_handles TYPE bal_t_logh.
APPEND lv_log_handle TO lt_handles.

CALL FUNCTION 'BAL_DB_SAVE'
  EXPORTING  i_t_log_handle = lt_handles
  EXCEPTIONS OTHERS         = 1.
```

---

## 6. 🟡 Monitoring & Forensik Log di T-Code SLG1

T-Code **`SLG1`** (*Analyse Application Log*) adalah alat investigasi utama:

```text
Layar Investigasi SLG1:
Kriteria Filter:
Object: [ ZLOG_SALES ] Subobject: [ BILLING ] Tanggal: [ 30.09.2026 ]
                              │
                              ▼ (Execute F8)
┌─────────────────────────────────────────────────────────────┐
│ ├── ZLOG_SALES / BILLING (1 Log Header Ditemukan)           │
│ │   ├── Eksternal ID: BATCH-RUN-2026                        │
│ │   ├── Dijalankan Oleh: ALIMUR  Waktu: 10:30:15            │
│ │   ├── Ringkasan: Total 3 Pesan (1 Sukses, 1 Info, 1 Error)│
│ │   │                                                       │
│ │   ├── [S] 10:30:16 Faktur SO-001 sukses dibukukan.        │
│ │   ├── [I] 10:30:17 Memeriksa ketersediaan stok baris 2.   │
│ │   └── [E] 10:30:18 Material MAT-990 tidak aktif di PLANT-10|
└─────────────────────────────────────────────────────────────┘
```

Dengan mengklik dua kali pada baris pesan error, pengguna dapat membaca penjelasan detail teknis (*Long Text*) yang dikonfigurasi di Message Class.

---

## 7. 🟡 Arsitektur Modern ABAP Cloud: BALI Framework (CL_BALI_LOG)

Pada model **ABAP Cloud** (SAP BTP ABAP Environment dan SAP S/4HANA Cloud Public Edition), Function Module klasik `BAL_*` bukan merupakan *Released API*.

SAP memperkenalkan framework berorientasi objek modern bernama **BALI (Business Application Log Interface)** berbasis class **`CL_BALI_LOG`**:

```abap
" SINTAKS RESMI ABAP CLOUD:
TRY.
    " 1. Buat Header Log
    DATA(lo_header) = cl_bali_header_setter=>create(
      object    = 'ZLOG_SALES'
      subobject = 'BILLING'
    )->set_external_id( 'BATCH-CLOUD-01' ).

    DATA(lo_log) = cl_bali_log=>create_with_header( lo_header ).

    " 2. Tambahkan Pesan Terstruktur dari Message Class
    DATA(lo_msg) = cl_bali_message_setter=>create(
      severity = if_bali_constants=>c_severity_error
      id       = 'ZMSG_SALES'
      number   = '005'
      variable_1 = 'MAT-990'
    ).
    lo_log->add_item( lo_msg ).

    " 3. Simpan Permanen ke Database Log
    cl_bali_log_db=>get_instance( )->save_log(
      log = lo_log
      assign_to_current_appl_job = abap_true
    ).

  CATCH cx_bali_runtime INTO DATA(lx_error).
    " Penanganan kesalahan runtime logging
ENDTRY.
```

Di lingkungan Cloud, hasil log dianalisis menggunakan antarmuka modern SAP Fiori App **"Application Logs"**.

---

## 8. 🟡 Integrasi Logging pada Background Jobs, RFC, & BAPI

Kombinasi arsitektural standar enterprise:
1. **Background Job**: Mengumpulkan seluruh pesan hasil pemrosesan massal ke Application Log, lalu menyertakan ID Log pada ringkasan akhir Job Log di `SM37`.
2. **BAPI & RFC Eksternal**: Saat pihak ketiga (seperti e-commerce) memanggil BAPI SAP, seluruh parameter payload dan respons dicatat ke Application Log untuk mempermudah investigasi klaim integrasi jika terjadi perselisihan data (*non-repudiation audit*).

---

## 9. 🟡 Manajemen Retensi & Pembersihan Log Lama via T-Code SLG2

Tabel fisik database Application Log (`BALHDR`, `BALDAT`, `BALM`) dapat membengkak hingga puluhan gigabyte jika jutaan log batch disimpan tanpa batas waktu.

SAP menyediakan T-Code **`SLG2`** (*Application Log: Delete Logs*):
* Administrator atau job terjadwal berkala (program `SBAL_DELETE`) menghapus log yang telah melampaui tanggal kedaluwarsa (*Expiry Date*).
* Menjaga database tetap ramping dan memastikan performa query sistem tetap optimal.

---

## 10. 🛠️ Praktik: Membangun Handler Logging Transaksi Batch Penjualan

### Skenario Bisnis
Kita membangun program `ZREP_PROCESS_ORDERS_WITH_LOG` yang memproses sekumpulan pesanan dan mencatat seluruh status penanganan ke dalam Application Log objek `ZLOG_DEMO` subobjek `ORDER_RUN`.

### Kode Lengkap Program

```abap
*&---------------------------------------------------------------------*
*& Report ZREP_PROCESS_ORDERS_WITH_LOG
*&---------------------------------------------------------------------*
*& Demonstrasi Pencatatan Jejak Audit Transaksi via API BAL_*
*&---------------------------------------------------------------------*
REPORT zrep_process_orders_with_log LINE-SIZE 85.

TYPES: BEGIN OF ty_order,
         order_id TYPE string,
         customer TYPE string,
         amount   TYPE p LENGTH 8 DECIMALS 2,
       END OF ty_order.

DATA: lt_orders     TYPE STANDARD TABLE OF ty_order WITH EMPTY KEY,
      ls_log        TYPE bal_s_log,
      lv_log_handle TYPE balloghndl,
      ls_msg        TYPE bal_s_msg,
      lt_handles    TYPE bal_t_logh.

START-OF-SELECTION.

  WRITE: / sy-uline(80).
  WRITE: / '|', (76) 'PEMROSESAN TRANSAKSI MASSAL DENGAN PENCATATAN APPLICATION LOG' CENTERED, '|'.
  WRITE: / sy-uline(80).

  " 1. Inisialisasi Header Log di Memori
  ls_log-object    = 'ZLOG_DEMO'.
  ls_log-subobject = 'ORDER_RUN'.
  ls_log-extnumber = |BATCH-{ sy-datum }-{ sy-uzeit }|.
  ls_log-aldate    = sy-datum.
  ls_log-altime    = sy-uzeit.
  ls_log-aluser    = sy-uname.

  CALL FUNCTION 'BAL_LOG_CREATE'
    EXPORTING  i_s_log      = ls_log
    IMPORTING  e_log_handle = lv_log_handle
    EXCEPTIONS OTHERS       = 1.

  IF sy-subrc <> 0.
    WRITE: / '| Gagal menginisialisasi buffer log.', (41) ' ', '|'.
    RETURN.
  ENDIF.

  " 2. Simulasi Data Antrean Transaksi
  lt_orders = VALUE #(
    ( order_id = 'SO-001' customer = 'PT Samudera' amount = '1500000' )
    ( order_id = 'SO-002' customer = 'CV Invalid'  amount = '-50000'  ) " Error
    ( order_id = 'SO-003' customer = 'PT Perkasa'  amount = '7500000' )
  ).

  " 3. Pemrosesan & Penyuntikan Pesan ke Log
  LOOP AT lt_orders INTO DATA(ls_ord).
    CLEAR ls_msg.

    IF ls_ord-amount > 0.
      " Catat Sukses
      ls_msg-msgty = 'S'.
      ls_msg-msgid = 'BL'.
      ls_msg-msgno = '001'. " Generic text message
      ls_msg-msgv1 = |Pesanan { ls_ord-order_id } sukses diproses.|.
      WRITE: / '| [SUKSES]', ls_ord-order_id, 'Pelanggan:', (20) ls_ord-customer, (22) ' ', '|'.
    ELSE.
      " Catat Error tanpa menghentikan loop program!
      ls_msg-msgty = 'E'.
      ls_msg-msgid = 'BL'.
      ls_msg-msgno = '001'.
      ls_msg-msgv1 = |Pesanan { ls_ord-order_id } GAGAL: Nilai tidak valid!|.
      WRITE: / '| [ERROR ]', ls_ord-order_id, 'Nilai nominal pesanan minus!', (21) ' ', '|'.
    ENDIF.

    CALL FUNCTION 'BAL_LOG_MSG_ADD'
      EXPORTING  i_log_handle = lv_log_handle
                 i_s_msg      = ls_msg
      EXCEPTIONS OTHERS       = 1.
  ENDLOOP.

  " 4. Menyimpan Permanen ke Database (Tabel BALHDR / BALDAT)
  APPEND lv_log_handle TO lt_handles.

  CALL FUNCTION 'BAL_DB_SAVE'
    EXPORTING  i_t_log_handle = lt_handles
    EXCEPTIONS OTHERS         = 1.

  IF sy-subrc = 0.
    WRITE: / sy-uline(80).
    WRITE: / '| AUDIT LOG BERHASIL DISIMPAN KE DATABASE!', (38) ' ', '|',
           / '| Silakan periksa detail histori log di T-Code SLG1.', (27) ' ', '|'.
  ENDIF.

  WRITE: / sy-uline(80).
```

### Hasil Tampilan di T-Code `SLG1`
Saat analis membuka `SLG1` dengan kriteria Object `ZLOG_DEMO`:
```text
Object: ZLOG_DEMO | Subobject: ORDER_RUN | External ID: BATCH-20260930-103000
├── [S] Pesanan SO-001 sukses diproses.
├── [E] Pesanan SO-002 GAGAL: Nilai tidak valid!
└── [S] Pesanan SO-003 sukses diproses.
```

---

## 11. 📚 Ringkasan & Cheat Code Application Log

### Peta Konsep
```text
Business Application Log (BAL)
├── 1. Peran Arsitektur
│   └── Pencatatan audit trail terstruktur untuk proses batch, RFC, & BAPI
├── 2. Konfigurasi Hierarki (SLG0)
│   ├── Log Object (Kategori aplikasi payung)
│   ├── Subobject (Area sub-proses spesifik)
│   └── External ID (Pengenal transaksi dinamis saat runtime)
├── 3. Siklus Hidup API
│   ├── BAL_LOG_CREATE (Membuat handle objek log di RAM)
│   ├── BAL_LOG_MSG_ADD (Menyuntikkan pesan error/warning/info)
│   └── BAL_DB_SAVE (Menyimpan permanen ke tabel BALHDR/BALDAT)
└── 4. Evaluasi & Pembersihan
    ├── SLG1: Analisis, investigasi forensik, & filter pencarian log
    └── SLG2: Penghapusan berkala log kedaluwarsa
```

### Cheat Code T-Code 10 Detik
```text
SLG0  → Mendaftarkan Log Object & Subobject baru
SLG1  → Analisis & investigasi riwayat log transaksi bisnis
SLG2  → Penghapusan massal arsip log lama yang kedaluwarsa
BALHDR / BALDAT → Tabel fisik database tempat header & detail log disimpan
```

---

## 12. 🔗 Referensi Resmi

* [SAP Help Portal: Business Application Log (BC-SRV-BAL)](https://help.sap.com/docs/SAP_NETWEAVER_700/c238d694b825421f940829322fed326f/491e847c21351d8de10000000a42189c.html)
* [SAP Help Portal: Business Application Log Interface (BALI) in ABAP Cloud](https://help.sap.com/docs/ABAP_PLATFORM_NEW/c238d694b825421f940829322fed326f/491e847c21351d8de10000000a42189c.html)
* [SAP Community: How to use the new Business Application Log Interface (BALI)](https://community.sap.com/t5/technology-blogs-by-sap/how-to-use-the-new-business-application-log-in-abap-cloud/ba-p/13524901)
