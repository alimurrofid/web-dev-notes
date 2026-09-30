---
title: "ABAP Modularization & Integration"
description: "Panduan lengkap modularisasi dan integrasi sistem di SAP ABAP: Include Programs, Function Modules (SE37), Remote Function Call (RFC via SM59), BAPI, dan Transport Management (SE09/SE10)."
order: 5
tags:
  - programming
  - abap
  - sap
  - modularization
  - rfc
  - bapi
  - intermediate
---

# ABAP Modularization & Integration

> **Target:** Developer ABAP yang ingin menstrukturkan kode program agar mudah dirawat (*maintainable*), dapat digunakan kembali (*reusable*), dan mampu berintegrasi antar sistem melalui Function Modules, RFC, dan BAPI.
> **Versi:** SAP NetWeaver AS ABAP 7.40+ / 7.50+ & SAP S/4HANA (T-Code `SE37`, `SE80`, `SM59`, `SE09`/`SE10`).
> **Prasyarat:** Telah memahami [[abap-dasar|ABAP Dasar]], [[abap-dictionary|ABAP Data Dictionary (DDIC)]], [[abap-internal-tables|ABAP Internal Tables]], dan [[abap-database|ABAP Database & Open SQL]].

---

## Gambaran Umum

Ketika aplikasi enterprise berkembang semakin besar, menulis seluruh logika program dalam satu file report tunggal akan menghasilkan kode *spaghetti* yang sulit dipelihara dan rawan bug. Sistem SAP mengatasi tantangan ini melalui konsep **Modularization**.

Modularisasi di ABAP terbagi menjadi dua ranah utama:
1. **Modularisasi Internal (Source Code Level)**: Memecah blok kode dalam program yang sama menggunakan *Include Programs* dan *Subroutines*.
2. **Modularisasi Global & Terdistribusi (System Level)**: Membungkus logika bisnis ke dalam **Function Modules** yang dapat dipanggil oleh program lain, diakses dari sistem SAP yang berbeda via **Remote Function Call (RFC)**, atau diintegrasikan dengan aplikasi pihak ketiga (seperti Web App, Java, atau .NET) menggunakan **Business Application Programming Interface (BAPI)**.

---

## Cara Belajar

```text
🟢 Fundamental
→ Pahami Include Programs (pengorganisasian report), Function Group, dan anatomi Function Module di SE37.

🟡 Lanjutan
→ Kuasai komunikasi antarsistem via Remote Function Call (RFC di SM59) dan pola pemanggilan BAPI standar dengan penanganan BAPIRET2.

🛠️ Praktik
→ Bangun mini project pemanggilan BAPI simulasi untuk pembuatan dokumen bisnis dengan validasi pesan error dan kontrol commit.
```

Mental model integrasi sistem SAP menggunakan BAPI dan RFC:

```text
       Sistem Eksternal (Web Service / Java / .NET) atau Program ABAP
                                  │
                                  │ 1. Parameter Input (Header, Items)
                                  ▼
       ┌────────────────────────────────────────────────────────┐
       │ SAP BAPI (Business Application Programming Interface)  │
       │ (T-Code SE37 / RFC-Enabled Function Module)            │
       │                                                        │
       │  ├─ Menjalankan Validasi Aturan Bisnis Standar SAP     │
       │  ├─ Memeriksa Otorisasi Pengguna (Authorization Check) │
       │  └─ Mengembalikan Hasil Transaksi via BAPIRET2         │
       └──────────────────────────┬─────────────────────────────┘
                                  │
                   ┌──────────────┴──────────────┐
                   ▼                             ▼
        Apakah Ada Error ('E')?           Semua Sukses ('S')?
                   │                             │
                   ▼                             ▼
       CALL BAPI_TRANSACTION_ROLLBACK;    CALL BAPI_TRANSACTION_COMMIT;
       (Batalkan Perubahan Data)          (Simpan Permanen ke Database)
```

**Hafalan:**

```text
SE37           → T-Code Function Builder untuk membuat, mengedit, dan menguji Function Module
Function Group → Wadah penampung sekumpulan Function Module yang saling berbagi memori
IMPORTING      → Parameter masukan dari pemanggil ke dalam Function Module
EXPORTING      → Parameter keluaran dari Function Module kembali ke pemanggil
RFC (Remote)   → Protokol komunikasi data antara SAP ke SAP atau SAP ke non-SAP (SM59)
BAPI           → Standard API bisnis resmi SAP untuk memproses data transaksi (Sales, PO, GL)
BAPIRET2       → Struktur tabel pesan standar kembalian BAPI (Status S, E, W, I)
SE09 / SE10    → Transport Organizer untuk mengelola dan merilis Transport Request (TR)
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Strategi Modularisasi Kode di SAP](#1--strategi-modularisasi-kode-di-sap)
2. [Include Programs & Standar Organisasi File Report](#2--include-programs--standar-organisasi-file-report)
3. [Function Groups & Function Modules (SE37)](#3--function-groups--function-modules-se37)
4. [Anatomi Parameter Function Module (IMPORT, EXPORT, CHANGING)](#4--anatomi-parameter-function-module-import-export-changing)
5. [Penanganan Exception Klasik pada Function Module](#5--penanganan-exception-klasik-pada-function-module)

### 🟡 Lanjutan

6. [Remote Function Call (RFC) & Konfigurasi SM59](#6--remote-function-call-rfc--konfigurasi-sm59)
7. [BAPI (Business Application Programming Interface)](#7--bapi-business-application-programming-interface)
8. [Standar Pemanggilan BAPI & Penanganan Tabel BAPIRET2](#8--standar-pemanggilan-bapi--penanganan-tabel-bapiret2)
9. [Kontrol Transaksi: BAPI_TRANSACTION_COMMIT & ROLLBACK](#9--kontrol-transaksi-bapi_transaction_commit--rollback)
10. [Packages & Transport Management (SE09 & SE10)](#10--packages--transport-management-se09--se10)

### 🛠️ Praktik

11. [Mini Project: Pemanggilan BAPI Pembuatan Dokumen](#11-️-mini-project-pemanggilan-bapi-pembuatan-dokumen)

### 📚 Ringkasan & Referensi

12. [Peta Ingatan & Ringkasan](#12--peta-ingatan--ringkasan)
13. [Cheat Code Modularization 10 Detik](#13--cheat-code-modularization-10-detik)
14. [Urutan Belajar Selanjutnya](#14--urutan-belajar-selanjutnya)
15. [Referensi Resmi](#15--referensi-resmi)

---

## 1. 🟢 Strategi Modularisasi Kode di SAP

### Konsep

Modularisasi adalah proses membagi sistem perangkat lunak menjadi unit-unit logis yang lebih kecil dan mandiri.

Tujuan utama modularisasi di ABAP:
1. **Reusabilitas (Pemberdayaan Ulang)**: Satu fungsi kalkulasi pajak atau validasi nomor NPWP cukup ditulis satu kali di Function Module dan dapat dipanggil oleh ratusan program lain.
2. **Keterbacaan & Pemeliharaan**: Program laporan utama (*Main Program*) menjadi sangat ringkas karena rincian implementasi teknis disembunyikan di dalam modul terpisah.
3. **Keamanan Integrasi**: Mengisolasi pemrosesan database melalui interface API standar (BAPI) agar aturan validasi bisnis SAP tidak dilanggar.

---

## 2. 🟢 Include Programs & Standar Organisasi File Report

### Konsep

**Include Program** adalah file kode program murni yang tidak dapat dieksekusi secara independen. Include program disisipkan ke dalam program utama menggunakan pernyataan `INCLUDE <nama_include>.`.

Saat program dikompilasi, kompiler ABAP menggabungkan seluruh teks include program tersebut ke posisi pemanggilannya layaknya satu dokumen utuh.

### Standar Struktur Organisasi Report Enterprise

```text
Program Utama: ZREP_SALES_REPORT
├── INCLUDE zrep_sales_report_top.  → Deklarasi Global Data (TABLES, TYPES, DATA, CONSTANTS)
├── INCLUDE zrep_sales_report_scr.  → Definisi Layar Input (SELECTION-SCREEN, PARAMETERS)
├── INCLUDE zrep_sales_report_f01.  → Implementasi Subroutines / Forms Logika Bisnis
├── INCLUDE zrep_sales_report_pbo.  → Process Before Output (Layar Dynpro jika ada)
└── INCLUDE zrep_sales_report_pai.  → Process After Input (Validasi Event Layar jika ada)
```

Dengan pola pemisahan include ini, beberapa developer dapat bekerja bersamaan pada komponen yang berbeda tanpa saling menimpa kode program utama.

---

## 3. 🟢 Function Groups & Function Modules (SE37)

### Konsep

**Function Module** adalah subrutin global yang disimpan secara terpusat di repositori SAP dan dikelola melalui T-Code **`SE37`** (*Function Builder*).

Setiap Function Module **wajib berada di dalam sebuah Function Group**.

```text
FUNCTION GROUP: ZFG_SALES_MANAGEMENT (T-Code SE80)
├── Global Data Area (Dapat diakses oleh seluruh function di group yang sama)
│
├── Function Module 1: Z_SALES_CALCULATE_DISCOUNT
├── Function Module 2: Z_SALES_CHECK_CREDIT_LIMIT
└── Function Module 3: Z_SALES_POST_DOCUMENT
```

> [!NOTE]
> Function Group bertindak sebagai kontainer memori runtime. Ketika satu Function Module di dalam grup dipanggil untuk pertama kali, seluruh Function Group akan dimuat ke memori kerja program (*Roll Area*) dan variabel globalnya akan tetap hidup sepanjang sesi transaksi pengguna.

---

## 4. 🟢 Anatomi Parameter Function Module (IMPORT, EXPORT, CHANGING)

### Konsep

Saat mendefinisikan Function Module di `SE37`, antarmuka parameter dibagi menjadi beberapa tab:

| Jenis Parameter | Arah Aliran Data | Karakteristik |
| :--- | :---: | :--- |
| **`IMPORTING`** | Masuk ($\rightarrow$) | Parameter yang dikirim oleh pemanggil ke dalam Function Module. Dapat diset sebagai *Optional* atau memiliki *Default Value*. |
| **`EXPORTING`** | Keluar ($\leftarrow$) | Parameter hasil pemrosesan yang dikembalikan ke pemanggil. |
| **`CHANGING`** | Dua Arah ($\leftrightarrow$) | Parameter yang dikirim masuk dengan nilai awal, nilainya dimodifikasi di dalam fungsi, lalu dikembalikan perubahannya ke pemanggil. |
| **`TABLES`** | Dua Arah ($\leftrightarrow$) | Parameter berupa Internal Table (teknik klasik; pada sistem modern lebih dianjurkan menggunakan parameter `CHANGING` bertipe Table Type). |

### Contoh Pemanggilan Function Module

```abap
REPORT z_call_function_demo.

DATA: lv_subtotal TYPE p DECIMALS 2 VALUE '1000000',
      lv_member   TYPE c LENGTH 3  VALUE 'VIP',
      lv_diskon   TYPE p DECIMALS 2,
      lv_total    TYPE p DECIMALS 2.

" Memanggil Function Module global
CALL FUNCTION 'Z_CALCULATE_DISCOUNT'
  EXPORTING
    iv_amount   = lv_subtotal
    iv_cust_typ = lv_member
  IMPORTING
    ev_discount = lv_diskon
    ev_net_amt  = lv_total
  EXCEPTIONS
    invalid_amount = 1
    OTHERS         = 2.

IF sy-subrc = 0.
  WRITE: / 'Kalkulasi Sukses! Total Bersih:', lv_total.
ELSE.
  WRITE: / 'Gagal menghitung diskon. Error code:', sy-subrc.
ENDIF.
```

---

## 5. 🟢 Penanganan Exception Klasik pada Function Module

### Konsep

Pada tab **Exceptions** di `SE37`, developer dapat mendefinisikan nama-nama error kustom (misalnya `RECORD_NOT_FOUND` atau `INVALID_INPUT`).

Di dalam kode Function Module, jika terdeteksi kesalahan logika, fungsi dihentikan dan error dipicu menggunakan instruksi `RAISE`:

```abap
" Kode di dalam Function Module:
IF iv_amount <= 0.
  RAISE invalid_amount.
ENDIF.
```

Ketika fungsi dipanggil, pemanggil memetakan nama exception tersebut ke nomor kode angka pada blok `EXCEPTIONS`. Jika error terjadi, nilai `sy-subrc` pemanggil akan terisi nomor tersebut, sehingga program pemanggil tidak mengalami crash dump.

---

## 6. 🟡 Remote Function Call (RFC) & Konfigurasi SM59

### Konsep

**RFC (Remote Function Call)** adalah protokol komunikasi milik SAP yang memungkinkan sebuah program mengeksekusi Function Module yang berada di server atau sistem SAP lain (bahkan sistem non-SAP seperti Java atau Node.js).

Untuk membuat Function Module dapat diakses melalui jaringan:
* Pada tab *Attributes* di `SE37`, ubah Processing Type menjadi **`Remote-Enabled Module`**.

```abap
" Memanggil fungsi di sistem SAP Production dari sistem Development
CALL FUNCTION 'Z_GET_STOCK_INFO'
  DESTINATION 'PRD_RFC_DEST'
  EXPORTING
    iv_matnr = 'MAT-001'
  IMPORTING
    ev_stock = lv_stock.
```

### Konfigurasi Tujuan Koneksi (T-Code `SM59`)

Setiap nama `DESTINATION` dikonfigurasi melalui T-Code **`SM59`** (*Configuration of RFC Connections*). Di `SM59`, administrator menentukan alamat IP host target, nomor sistem, client, dan kredensial login akun teknis (*system user*).

---

## 7. 🟡 BAPI (Business Application Programming Interface)

### Konsep

**BAPI** adalah metode antarmuka standar berstandar industri yang dirancang oleh SAP untuk memproses entitas bisnis (seperti membuat Pesanan Penjualan, memposting Jurnal Akuntansi, atau mengubah Master Karyawan).

### Mengapa Menggunakan BAPI Alih-Alih Mengubah Database Langsung?

> [!CRITICAL]
> **Larangan Mutlak:** DILARANG KERAS melakukan perintah SQL `INSERT`, `UPDATE`, atau `DELETE` langsung pada tabel standar transaksi SAP (seperti tabel `VBAK`, `BKPF`, `MARA`)!
> Tabel standar SAP memiliki ratusan relasi dependensi, trigger database, nomor urut dokumen otomatis (*Number Ranges*), dan aturan audit trail akuntansi. Mengubah tabel secara langsung akan merusak konsistensi data finansial perusahaan dan menghanguskan garansi dukungan resmi SAP (*invalidate support*).

Seluruh operasi bisnis **wajib dilakukan melalui BAPI** atau transaksi GUI resmi.

### Karakteristik Utama BAPI

1. Diimplementasikan sebagai Remote-Enabled Function Module berawalan `BAPI_...` (misal: `BAPI_SALESORDER_CREATEFROMDAT2`).
2. Tidak pernah memicu layar dialog visual (*No GUI screens/popups*), sehingga sepenuhnya aman untuk otomasi background job dan web service API.
3. Selalu mengembalikan hasil pemrosesan melalui parameter tabel pesan **`RETURN`** bertipe struktur **`BAPIRET2`**.

---

## 8. 🟡 Standar Pemanggilan BAPI & Penanganan Tabel BAPIRET2

### Konsep

Struktur **`BAPIRET2`** adalah format standar respons pesan di seluruh ekosistem SAP:

| Kolom `BAPIRET2` | Tipe Data | Deskripsi |
| :--- | :---: | :--- |
| **`TYPE`** | `CHAR 1` | Tingkat keparahan pesan: `'S'` (Success), `'E'` (Error), `'W'` (Warning), `'I'` (Info), `'A'` (Abort). |
| **`ID`** | `CHAR 20` | Message Class penampung pesan teks (misal: `V1`). |
| **`NUMBER`** | `NUMC 3` | Nomor ID pesan di Message Class (misal: `311`). |
| **`MESSAGE`** | `STRING` | Teks lengkap pesan yang siap dibaca oleh pengguna dalam bahasa aktif. |

### Best Practice

- Setelah memanggil BAPI, jangan hanya mengecek `sy-subrc = 0`. BAPI hampir selalu mengembalikan `sy-subrc = 0` karena fungsinya berhasil dieksekusi secara teknis. Keberhasilan bisnis yang sesungguhnya ditentukan oleh ada atau tidaknya baris bertipe `'E'` atau `'A'` di dalam tabel parameter `RETURN`.

```abap
" Memeriksa apakah terdapat kegagalan proses bisnis di dalam respons BAPI:
READ TABLE lt_return WITH KEY type = 'E' TRANSPORTING NO FIELDS.
IF sy-subrc = 0.
  " Terjadi kesalahan validasi bisnis di SAP!
ENDIF.
```

---

## 9. 🟡 Kontrol Transaksi: BAPI_TRANSACTION_COMMIT & ROLLBACK

### Konsep

BAPI tidak secara otomatis menyimpan perubahan data ke database. BAPI hanya mempersiapkan antrean pembaruan data di memori *Update Task*.

Untuk menyelesaikan transaksi:
* Jika tidak ada error: Panggil Function Module **`BAPI_TRANSACTION_COMMIT`** dengan parameter `WAIT = 'X'`.
* Jika terjadi error: Panggil Function Module **`BAPI_TRANSACTION_ROLLBACK`** untuk membersihkan memori antrean.

> [!WARNING]
> Gunakan `CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'` alih-alih perintah `COMMIT WORK` biasa saat bekerja dengan BAPI, agar seluruh siklus *Enqueue Lock* dan *Update Service* milik BAPI dilepaskan secara sempurna.

---

## 10. 🟡 Packages & Transport Management (SE09 & SE10)

### Konsep

Setiap objek pengembangan yang Anda buat di SAP (Program, Tabel, Function Module) wajib diasosiasikan ke dalam sebuah **Package** (dikelola via T-Code **`SE21`**).

```text
Package $TMP (Local Objects):
→ Objek hanya hidup di sistem saat ini dan TIDAK BISA dipindahkan ke sistem lain (hanya untuk latihan pribadi).

Package Kustom (Z...):
→ Mengharuskan pembuatan Transport Request (TR).
```

### Alur Migrasi Transport Request (Landscape SAP)

```text
       Development Server (DEV)
       - Developer membuat program di Package Z_DEV
       - Merekam perubahan ke Transport Request (TR)
                         │
                         │ Rilis TR via T-Code SE09 / SE10
                         ▼
       Quality Assurance Server (QAS)
       - Tim QA / User melakukan pengetesan integrasi data
                         │
                         │ Approval UAT
                         ▼
       Production Server (PRD)
       - Sistem operasional bisnis nyata perusahaan
```

---

## 11. 🛠️ Mini Project: Pemanggilan BAPI Pembuatan Dokumen

### Tujuan

Membangun program pemanggilan BAPI pesanan (`ZREP_CALL_BAPI_DEMO`) yang menerapkan pola pemanggilan API bisnis standar: inisialisasi data header dan item, pengiriman transaksi ke modul fungsi BAPI, evaluasi mendalam tabel respons `BAPIRET2`, eksekusi `BAPI_TRANSACTION_COMMIT` berparameter `WAIT = 'X'`, dan pencetakan log hasil eksekusi ke layar.

### Fitur

1. Menyiapkan parameter data transaksi terstruktur.
2. Penanganan tabel return `BAPIRET2` untuk mendeteksi pesan `'E'` (Error) dan `'S'` (Success).
3. Penerapan kontrol transaksi dua cabang (`COMMIT` vs `ROLLBACK`).
4. Format laporan visual status dokumen hasil kembalian BAPI.

### Konsep yang Digunakan

* Deklarasi data terstruktur menggunakan tipe bawaan SAP.
* Pemanggilan Function Module via `CALL FUNCTION ... EXPORTING ... IMPORTING ... TABLES`.
* Penelusuran pesan error via `READ TABLE itab WITH KEY type = 'E'`.
* Eksekusi konfirmasi database via `BAPI_TRANSACTION_COMMIT`.

### Langkah Implementasi

1. **Deklarasikan Struktur Return**: Siapkan tabel penampung bertipe `BAPIRET2`.
2. **Siapkan Parameter Input**: Buat data transaksi yang akan diposting.
3. **Simulasikan Eksekusi BAPI**: Panggil fungsi transaksi bisnis.
4. **Evaluasi Status Return**: Cek apakah terdapat kode error pada field `type`.
5. **Konfirmasi atau Batalkan**: Panggil commit atau rollback sesuai status.
6. **Cetak Log Output**: Tampilkan pesan resmi SAP ke layar.

### Kode Lengkap Program

```abap
*&---------------------------------------------------------------------*
*& Report ZREP_CALL_BAPI_DEMO
*&---------------------------------------------------------------------*
*& Mini Project: Pola Pemanggilan BAPI Standar & Evaluasi BAPIRET2
*&---------------------------------------------------------------------*
REPORT zrep_call_bapi_demo LINE-SIZE 85.

*----------------------------------------------------------------------*
* 1. Definisi Variabel Respons BAPI
*----------------------------------------------------------------------*
DATA: lt_return TYPE STANDARD TABLE OF bapiret2 WITH EMPTY KEY,
      ls_return TYPE bapiret2,
      lv_doc_no TYPE c LENGTH 10 VALUE 'SO-90001'.

*----------------------------------------------------------------------*
* 2. Logika Utama Program
*----------------------------------------------------------------------*
START-OF-SELECTION.

  WRITE: / sy-uline(80).
  WRITE: / '|', (76) 'LOG PEMANGGILAN INTEGRASI BAPI BISNIS' CENTERED, '|'.
  WRITE: / sy-uline(80).

  " Simulasi Respons yang dikembalikan oleh BAPI (BAPIRET2)
  lt_return = VALUE #(
    ( type = 'S' id = 'V1' number = '311' message = 'Sales Order SO-90001 berhasil dibuat.' )
    ( type = 'I' id = 'V1' number = '200' message = 'Penetapan harga menggunakan skema standar ID01.' )
  ).

  " 1. Evaluasi apakah ada error bisnis (Type 'E' atau 'A')
  READ TABLE lt_return WITH KEY type = 'E' TRANSPORTING NO FIELDS.
  DATA(lv_has_error) = COND abap_bool( WHEN sy-subrc = 0 THEN abap_true ELSE abap_false ).

  IF lv_has_error = abap_false.
    " 2. Jika sukses penuh: Konfirmasi transaksi database
    " Dalam sistem nyata: CALL FUNCTION 'BAPI_TRANSACTION_COMMIT' EXPORTING wait = 'X'.
    WRITE: / '| KESIMPULAN TRANSAKSI : SUKSES PENUH', (43) ' ', '|'.
    WRITE: / '| TINDAKAN SISTEM    : BAPI_TRANSACTION_COMMIT dijalankan (WAIT = X).', (14) ' ', '|'.
    WRITE: / '| NOMOR DOKUMEN BARU : ', lv_doc_no, (47) ' ', '|'.
  ELSE.
    " 3. Jika ada error: Batalkan seluruh perubahan
    " Dalam sistem nyata: CALL FUNCTION 'BAPI_TRANSACTION_ROLLBACK'.
    WRITE: / '| KESIMPULAN TRANSAKSI : GAGAL VALIDASI BISNIS!', (37) ' ', '|'.
    WRITE: / '| TINDAKAN SISTEM    : BAPI_TRANSACTION_ROLLBACK dijalankan.', (23) ' ', '|'.
  ENDIF.

  WRITE: / sy-uline(80).
  WRITE: / '| RINCIAN PESAN SISTEM (TABEL BAPIRET2):', (41) ' ', '|'.
  WRITE: / sy-uline(80).

  LOOP AT lt_return INTO ls_return.
    WRITE: / '| [', ls_return-type, ']', (72) ls_return-message, '|'.
  ENDLOOP.

  WRITE: / sy-uline(80).
```

### Hasil Akhir

```text
---------------------------------------------------------------------------------
|                     LOG PEMANGGILAN INTEGRASI BAPI BISNIS                     |
---------------------------------------------------------------------------------
| KESIMPULAN TRANSAKSI : SUKSES PENUH                                           |
| TINDAKAN SISTEM    : BAPI_TRANSACTION_COMMIT dijalankan (WAIT = X).           |
| NOMOR DOKUMEN BARU : SO-90001                                                 |
---------------------------------------------------------------------------------
| RINCIAN PESAN SISTEM (TABEL BAPIRET2):                                        |
---------------------------------------------------------------------------------
| [ S ] Sales Order SO-90001 berhasil dibuat.                                   |
| [ I ] Penetapan harga menggunakan skema standar ID01.                         |
---------------------------------------------------------------------------------
```

---

## 12. 📚 Ringkasan & Peta Ingatan

### Peta Konsep ABAP Modularization & Integration

```text
ABAP Modularization & Integration
├── 1. Modularisasi Internal
│   ├── Include Programs (Pemisahan file TOP, SCR, F01 dalam satu report)
│   └── Subroutines (FORM & PERFORM lokal)
├── 2. Modularisasi Global
│   ├── Function Group (Wadah penampung & shared memory di SE80)
│   └── Function Module (Unit logika global di SE37: Import, Export, Changing)
├── 3. Komunikasi Antarsistem
│   ├── RFC (Remote-Enabled Function Module untuk komunikasi lintas server)
│   └── SM59 (Konfigurasi RFC Destination & kredensial koneksi)
└── 4. Standar Bisnis & Deployment
    ├── BAPI (API resmi pemrosesan transaksi bisnis tanpa layar UI)
    ├── BAPIRET2 (Tabel standar respon pesan: S, E, W, I, A)
    ├── BAPI Commit/Rollback (Pengendali persistensi data transaksi)
    └── Transport Organizer (SE09/SE10: Migrasi objek DEV → QAS → PRD)
```

---

## 13. 📚 Cheat Code Modularization 10 Detik

```text
INCLUDE zname.                                   → Menyisipkan file include ke program
CALL FUNCTION 'Z_FUNC' EXPORTING k=v.            → Memanggil Function Module global
BAPI_...                                         → Nama standar API bisnis resmi SAP
SM59                                             → Manajemen koneksi RFC antarsistem
BAPIRET2                                         → Tabel standar penampung pesan return BAPI
BAPI_TRANSACTION_COMMIT                          → Konfirmasi permanen transaksi BAPI
BAPI_TRANSACTION_ROLLBACK                        → Pembatalan transaksi BAPI jika ada error
SE09 / SE10                                      → Manajemen dan rilis Transport Request (TR)
```

---

## 14. 🧭 Urutan Belajar Selanjutnya

Setelah menguasai pengorganisasian kode dan integrasi API bisnis, langkah berikutnya adalah mempelajari bagaimana menyajikan data ke layar pengguna akhir secara visual, interaktif, dan terformat:

```text
1. 🟢 ABAP Dasar (Fondasi bahasa & kontrol alur)
      │
      ▼
2. 🟢 ABAP Data Dictionary (Pemodelan tabel & tipe data)
      │
      ▼
3. 🟢 ABAP Internal Tables (Manipulasi array in-memory)
      │
      ▼
4. 🟡 ABAP Database & Open SQL (Akses data database)
      │
      ▼
5. 🟡 ABAP Modularization & Integration (Selesai pada modul ini)
      │
      ▼
6. 🟡 ABAP Reports & ALV Grid
   → Pelajari siklus hidup event pelaporan interaktif (Selection Screen Events) dan visualisasi data tabel menggunakan Object-Oriented ALV (CL_SALV_TABLE).
      │
      ▼
7. 🟡 ABAP Objects (OOP)
   → Pelajari konsep Object-Oriented Programming modern di ABAP.
```

Lanjutkan ke modul berikutnya: [[abap-reports-alv|ABAP Reports & ALV Grid]] (Modul 6).

---

## 15. 🔗 Referensi Resmi

* [SAP Help Portal — Function Modules and Function Builder](https://help.sap.com/docs/ABAP_PLATFORM/)
* [SAP Help Portal — BAPI User Guide](https://help.sap.com/docs/ABAP_PLATFORM/)
* [SAP Community — Best Practices for RFC and BAPI Error Handling](https://community.sap.com/)
