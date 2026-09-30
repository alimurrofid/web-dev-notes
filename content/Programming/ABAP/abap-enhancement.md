---
title: "ABAP Enhancement Framework"
description: "Panduan lengkap kustomisasi standar SAP tanpa modifikasi core (Clean Core): User Exits, Customer Exits (CMOD/SMOD), Business Add-Ins (BAdI via SE18/SE19), serta Explicit & Implicit Enhancement Points."
order: 8
tags:
  - programming
  - abap
  - sap
  - enhancement
  - badi
  - advanced
---

# ABAP Enhancement Framework

> **Target:** Advanced ABAP Developer yang ingin menyisipkan aturan bisnis kustom ke dalam alur transaksi standar SAP tanpa melakukan modifikasi langsung pada kode bawaan (*Clean Core Principle*).
> **Versi:** SAP NetWeaver AS ABAP 7.40+ / 7.50+ & SAP S/4HANA (T-Code `SE18`, `SE19`, `CMOD`, `SMOD`).
> **Prasyarat:** Telah menguasai [[abap-dasar|ABAP Dasar]], [[abap-modularization|ABAP Modularization & Integration]], dan [[abap-oop|ABAP Objects (OOP)]].

---

## Gambaran Umum

Salah satu faktor utama kesuksesan sistem SAP di ribuan korporasi multinasional adalah fleksibilitasnya: sistem standar SAP dapat disesuaikan (*customized*) agar cocok dengan proses bisnis spesifik setiap perusahaan tanpa perlu merombak produk intinya dari awal.

Namun, mengubah kode standar SAP secara langsung (**Modification**) adalah dosa terbesar dalam rekayasa perangkat lunak enterprise. Ketika SAP merilis *Support Package* atau upgrade versi baru ke S/4HANA, seluruh kode modifikasi tersebut akan tertimpa dan memicu kekacauan sistem (*upgrade conflict*).

Untuk mengatasi dilema ini, SAP memperkenalkan **Enhancement Framework**. Framework ini menyediakan "titik-titik colokan resmi" (*hook points*) di mana developer dapat menyuntikkan logika bisnis kustom secara elegan, aman, terisolasi, dan dijamin tidak akan hilang saat sistem di-upgrade.

---

## Cara Belajar

```text
🟢 Fundamental
→ Pahami perbedaan krusial antara Modifikasi vs Enhancement, evolusi teknik kustomisasi, dan User Exits klasik.

🟡 Lanjutan
→ Kuasai Customer Exits (SMOD/CMOD), BAdI Modern (New BAdI via SE18/SE19), serta Implicit & Explicit Enhancement Points.

🛠️ Praktik
→ Bangun mini project implementasi BAdI untuk memvalidasi batas diskon maksimal pada transaksi dokumen penjualan standar.
```

Mental model perbedaan antara Modifikasi Kode vs Enhancement Framework:

```text
PENDEKATAN MODIFIKASI (BERBAHAYA & DILARANG):
Program Standar SAP: [ Kode A ] ──> [ Mengubah Kode Asli ] ──> [ Kode B ]
                                            │
                                            ▼
                          Tertimpa saat Upgrade Sistem! (Hilang)

PENDEKATAN ENHANCEMENT FRAMEWORK (AMAN & CLEAN CORE):
Program Standar SAP: [ Kode A ] ──> [ ENHANCEMENT-POINT ] ──> [ Kode B ]
                                            │
                                            │ (Memanggil Colokan Resmi)
                                            ▼
                             ┌──────────────────────────────┐
                             │ Implementasi Kustom Z...    │
                             │ (Tersimpan Terisolasi di Z) │
                             └──────────────────────────────┘
```

**Hafalan:**

```text
Modification   → Mengubah kode standar SAP secara langsung (Merusak Clean Core & dilarang)
Enhancement    → Menyisipkan logika kustom pada titik colokan resmi tanpa merusak kode asli
User Exit      → Teknik kustomisasi klasik modul SD berbasis subroutines (contoh: MV45AFZZ)
Customer Exit  → Kustomisasi berbasis Function Module EXIT_... yang dikelola via SMOD/CMOD
BAdI           → Business Add-Ins: kustomisasi modern berbasis Interface berorientasi objek
SE18           → T-Code BAdI Builder untuk melihat definisi BAdI dan Enhancement Spot
SE19           → T-Code BAdI Implementation untuk membuat implementasi logika kustom
Implicit Enh.  → Titik colokan otomatis di baris awal & akhir setiap method/form tanpa izin SAP
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Prinsip Clean Core: Modifikasi vs Enhancement](#1--prinsip-clean-core-modifikasi-vs-enhancement)
2. [Evolusi Teknologi Kustomisasi di SAP](#2--evolusi-teknologi-kustomisasi-di-sap)
3. [User Exits Klasik (Modul Sales & Distribution)](#3--user-exits-klasik-modul-sales--distribution)
4. [Customer Exits (SMOD & CMOD)](#4--customer-exits-smod--cmod)

### 🟡 Lanjutan

5. [Arsitektur BAdI Modern (New Kernel BAdI)](#5--arsitektur-badi-modern-new-kernel-badi)
6. [Single-Use vs Multiple-Use & Filter-Dependent BAdI](#6--single-use-vs-multiple-use--filter-dependent-badi)
7. [Langkah Implementasi BAdI via T-Code SE19](#7--langkah-implementasi-badi-via-t-code-se19)
8. [Explicit Enhancement Points & Enhancement Sections](#8--explicit-enhancement-points--enhancement-sections)
9. [Implicit Enhancement Options (Titik Kait Otomatis)](#9--implicit-enhancement-options-titik-kait-otomatis)
10. [Strategi Mencari Titik Enhancement di Transaksi Standar](#10--strategi-mencari-titik-enhancement-di-transaksi-standar)

### 🛠️ Praktik

11. [Mini Project: Validasi Diskon Penjualan Menggunakan BAdI](#11-️-mini-project-validasi-diskon-penjualan-menggunakan-badi)

### 📚 Ringkasan & Referensi

12. [Peta Ingatan & Ringkasan](#12--peta-ingatan--ringkasan)
13. [Cheat Code Enhancement 10 Detik](#13--cheat-code-enhancement-10-detik)
14. [Urutan Belajar Selanjutnya](#14--urutan-belajar-selanjutnya)
15. [Referensi Resmi](#15--referensi-resmi)

---

## 1. 🟢 Prinsip Clean Core: Modifikasi vs Enhancement

### Konsep

Dalam filosofi pengembangan SAP modern (khususnya SAP S/4HANA Cloud), prinsip utama yang diwajibkan adalah **Keep the Core Clean** (*Clean Core*).

| Parameter | Modifikasi (*Direct Modification*) | Enhancement Framework |
| :--- | :--- | :--- |
| **Definisi** | Mengubah baris kode asli buatan SAP menggunakan *Access Key* (SSCR). | Menyuntikkan kode kustom ke wadah terpisah yang dipanggil oleh SAP. |
| **Dampak Upgrade** | Sangat berisiko tinggi. Kode kustom akan tertimpa atau menghasilkan konflik error (*SPDD/SPAU*). | **100% Aman**. Kode kustom tersimpan di objek `Z...` terpisah dan tetap aktif pasca-upgrade. |
| **Dukungan SAP** | Menghanguskan SLA garansi sistem dari SAP SE jika memicu crash. | Didukung penuh secara resmi sebagai arsitektur standar. |

---

## 2. 🟢 Evolusi Teknologi Kustomisasi di SAP

### Kronologi Sejarah

```text
Generasi 1: User Exits (Era R/3 1990-an)
└── Berbasis Subroutine (FORM ... ENDFORM) di include program khusus kustom.

Generasi 2: Customer Exits (Era R/3 4.x)
└── Berbasis Function Module (EXIT_...), Screen Exits, dan Menu Exits di T-Code SMOD/CMOD.

Generasi 3: Classic BAdI (Era NetWeaver 6.x)
└── Berbasis ABAP Objects Interface via T-Code SE18/SE19 (Adapter Pattern).

Generasi 4: New Enhancement Framework (Era NetWeaver 7.x s/d S/4HANA)
└── Kernel-based BAdI, Enhancement Spots, Explicit Points, dan Implicit Options.
```

---

## 3. 🟢 User Exits Klasik (Modul Sales & Distribution)

### Konsep

**User Exit** adalah teknik kustomisasi tertua di SAP yang dirancang khusus untuk modul penjualan (*Sales and Distribution* / SD).

SAP menyediakan file include kosong berawalan `Z` yang dipanggil dari dalam program standar. Contoh paling legendaris adalah include **`MV45AFZZ`** pada program pembuatan Sales Order (`VA01` / `VA02`).

Di dalam file include tersebut, terdapat form-form kosong yang dipicu pada momen tertentu:

```abap
*&---------------------------------------------------------------------*
*& Form USEREXIT_SAVE_DOCUMENT_PREPARE
*&---------------------------------------------------------------------*
*& Dipanggil tepat sebelum data pesanan disimpan ke database
*&---------------------------------------------------------------------*
FORM userexit_save_document_prepare.

  " Contoh: Validasi nilai transaksi tidak boleh nol
  IF vbak-netwr <= 0.
    MESSAGE 'Total pesanan tidak boleh nol!' TYPE 'E'.
  ENDIF.

ENDFORM.
```

---

## 4. 🟢 Customer Exits (SMOD & CMOD)

### Konsep

Customer Exits membungkus titik kustomisasi ke dalam **Function Module** yang diawali dengan kata kunci `EXIT_<Program>_<Nomor>`.

Komponen Customer Exit:
1. **`SMOD`**: T-Code katalog SAP standar untuk melihat definisi Enhancement bawaan.
2. **`CMOD`**: T-Code tempat developer membuat **Enhancement Project** kustom untuk mengaktifkan Function Module exit tersebut.

Di dalam Function Module exit, SAP menyediakan include kosong berawalan `ZX...` tempat developer menuliskan kode programnya.

---

## 5. 🟡 Arsitektur BAdI Modern (New Kernel BAdI)

### Konsep

**BAdI (Business Add-Ins)** adalah mekanisme kustomisasi berbasis Object-Oriented Interface.

Pada New Enhancement Framework, BAdI dikelompokkan di dalam wadah yang disebut **Enhancement Spot**. New BAdI terintegrasi langsung pada level ABAP Kernel, sehingga waktu pemanggilannya mendekati kecepatan pemanggilan method biasa tanpa overhead pemindaian database.

```text
ENHANCEMENT SPOT: BADI_SALES_ORDER (T-Code SE18)
├── BAdI Definition: BADI_ORDER_CHECK
│   └── Interface: IF_EX_ORDER_CHECK
│       ├── Method: CHECK_BEFORE_SAVE
│       └── Method: CHECK_ITEM_STOCK
│
└── BAdI Implementation: ZIMP_ORDER_VALIDATION (T-Code SE19)
    └── Implementing Class: ZCL_IM_ORDER_VALIDATION
        └── Menuliskan kode implementasi method CHECK_BEFORE_SAVE
```

### Sintaks Pemanggilan Resmi BAdI di Program SAP (Kernel-based)

Pada program standar SAP, pemanggilan New BAdI ditangani langsung oleh ABAP Kernel menggunakan dua instruksi khusus:

```abap
" 1. Deklarasi handle BAdI:
DATA lo_badi TYPE REF TO badi_order_check.

" 2. Meminta instance implementasi aktif dari kernel (GET BADI):
GET BADI lo_badi.

" 3. Mengeksekusi logika bisnis implementasi melalui framework (CALL BADI):
CALL BADI lo_badi->check_before_save(
  EXPORTING iv_order_id = lv_order_id
  CHANGING  cv_status   = lv_status
).
```

* `GET BADI`: Meminta instance BAdI ke ABAP Kernel berdasarkan BAdI Definition dan nilai filter runtime yang sedang aktif di sistem.
* `CALL BADI`: Menjalankan method BAdI pada seluruh class implementasi aktif tanpa perlu mengetahui nama class fisiknya secara langsung.

---

## 6. 🟡 Single-Use vs Multiple-Use & Filter-Dependent BAdI

### Konsep

Saat melihat definisi BAdI di `SE18`, perhatikan properti arsitekturnya:

1. **Single-Use BAdI**: Hanya boleh memiliki tepat **satu** implementasi aktif di seluruh sistem. Cocok untuk operasi yang menghasilkan nilai balik mutlak (*Calculation*).
2. **Multiple-Use BAdI**: Boleh memiliki **banyak** implementasi aktif yang berjalan berurutan. Cocok untuk pencatatan log audit atau pengiriman notifikasi independen.
3. **Filter-Dependent BAdI**: Implementasi hanya akan dieksekusi jika nilai filter runtime cocok (misalnya: implementasi A hanya berjalan untuk Company Code `'1000'`, sedangkan implementasi B untuk `'2000'`).

---

## 7. 🟡 Langkah Implementasi BAdI via T-Code SE19

### Konsep

Prosedur mengaktifkan BAdI di sistem:
1. Buka T-Code **`SE19`**.
2. Masukkan nama BAdI Definition atau Enhancement Spot target $\rightarrow$ Klik **Create Implementation**.
3. Beri nama Implementation kustom (misal: `ZIMP_SALES_DISCOUNT`).
4. SAP akan membuatkan Class implementasi baru (misal: `ZCL_IM_SALES_DISCOUNT`).
5. Klik dua kali pada nama method yang ingin diisi logika bisnisnya.
6. Tuliskan kode ABAP Anda di dalam method tersebut.
7. Aktifkan (*Activate*) Class dan Implementation-nya (Ctrl+F3).

---

## 8. 🟡 Explicit Enhancement Points & Enhancement Sections

### Konsep

Di dalam program standar, pengembang SAP menandai posisi tertentu sebagai titik ekspansi resmi:

### 1. Enhancement-Point (Menyisipkan Kode)

Menyisipkan instruksi kustom tanpa menghapus kode standar:

```abap
" Kode program standar SAP:
SELECT * FROM mara WHERE matnr = @lv_matnr INTO @ls_mara.

ENHANCEMENT-POINT z_check_material SPOTS z_mat_spot.
" <-- Kode kustom Anda akan disuntikkan di sini

WRITE: / ls_mara-matnr.
```

### 2. Enhancement-Section (Mengganti Kode)

Menggantikan seluruh blok kode standar dengan logika kustom Anda:

```abap
ENHANCEMENT-SECTION z_calculate_price SPOTS z_pricing_spot.
  " Kode standar SAP (Akan dinonaktifkan jika enhancement kustom diaktifkan)
  lv_price = lv_base_price * '1.1'.
END-ENHANCEMENT-SECTION.
```

---

## 9. 🟡 Implicit Enhancement Options (Titik Kait Otomatis)

### Konsep

Bagaimana jika di program standar tersebut SAP sama sekali tidak menyediakan User Exit, Customer Exit, maupun BAdI?

Sistem SAP secara otomatis menyediakan **Implicit Enhancement Options** di:
* Baris pertama dan baris terakhir dari setiap Subroutine (`FORM`).
* Baris pertama dan baris terakhir dari setiap Function Module.
* Baris pertama dan baris terakhir dari setiap Method Class.
* Baris paling akhir dari setiap file Include program.

### Cara Menampilkan Implicit Options di SE38 / ADT

1. Buka kode program standar di `SE38`.
2. Klik tombol **Enhance** (ikon spiral pelangi pada toolbar).
3. Klik menu: **Edit** $\rightarrow$ **Enhancement Operations** $\rightarrow$ **Show Implicit Enhancement Options**.
4. Garis-garis kuning bertanda petik ganda akan muncul di layar menandai area yang siap disisipi kode kustom!

---

## 10. 🟡 Strategi Mencari Titik Enhancement di Transaksi Standar

### Panduan Investigasi Praktis

Jika konsultan fungsional meminta: *"Tolong tambahkan validasi pada transaksi standar VA01 saat tombol Simpan ditekan!"*, bagaimana cara menemukan titik kaitnya?

```text
Metode Pencarian Cepat:
1. Breakpoint di Class Loader BAdI:
   - Pasang breakpoint di T-Code SE24 pada class CL_EXITHANDLER, method GET_INSTANCE.
   - Jalankan transaksi standar (VA01). Setiap kali sistem memicu BAdI, debugger akan berhenti
     dan variabel 'exit_name' akan menampilkan nama BAdI yang sedang aktif!

2. Repository Information System (SE84):
   - SE84 → Enhancements → BAdI Definitions.
   - Filter berdasarkan Package modul terkait (misal: VA untuk Sales Order).

3. Pencarian Teks di Program Utama:
   - Cari kata kunci 'ENHANCEMENT-POINT' atau 'CUSTOMER-FUNCTION' di kode sumber utama transaksi.
```

---

## 11. 🛠️ Mini Project: Validasi Diskon Penjualan Menggunakan BAdI

### Tujuan

Mensimulasikan implementasi logika kustom berbasis interface BAdI (`ZIF_EX_ORDER_VALIDATION`). Program ini menerima parameter pesanan penjualan sebelum disimpan, mengevaluasi persentase diskon yang diberikan, dan jika diskon melebihi kebijakan batas maksimal perusahaan (15%), sistem membatalkan proses penyimpanan dan mengembalikan pesan error resmi.

### Fitur

1. Kontrak antarmuka kustomisasi dokumen pesanan standar.
2. Implementasi class kustom `ZCL_IM_SALES_DISCOUNT` yang mewarisi interface BAdI.
3. Validasi aturan bisnis: diskon di atas 15% ditolak secara otomatis.
4. Pengembalian pesan validasi terstruktur tanpa merusak kode inti sistem.

### Konsep yang Digunakan

* Interface kontrak enhancement `INTERFACE`.
* Class implementasi enhancement `CLASS ... IMPLEMENTATION`.
* Passing data transaksi via parameter `CHANGING`.
* Penggunaan variabel status error untuk mengontrol aliran transaksi.

### Langkah Implementasi

1. **Definisikan Kontrak Interface BAdI**: Buat interface `zif_ex_order_validation`.
2. **Definisikan Class Implementasi**: Buat class kustom `zcl_im_sales_discount`.
3. **Tuliskan Aturan Validasi**: Periksa `iv_discount_pct > 15`.
4. **Simulasikan Eksekusi Program Standar**: Panggil method BAdI dari alur program penjualan utama.

### Kode Lengkap Program

```abap
*&---------------------------------------------------------------------*
*& Report ZREP_ENHANCEMENT_DEMO
*&---------------------------------------------------------------------*
*& Mini Project: Simulasi Validasi Transaksi Menggunakan BAdI
*&---------------------------------------------------------------------*
REPORT zrep_enhancement_demo LINE-SIZE 85.

*----------------------------------------------------------------------*
* 1. Definisi Interface BAdI Standar SAP
*----------------------------------------------------------------------*
INTERFACE zif_ex_order_validation.
  METHODS check_order_discount
    IMPORTING iv_order_id     TYPE string
              iv_discount_pct TYPE p
    CHANGING  cv_allowed      TYPE abap_bool
              cv_message      TYPE string.
ENDINTERFACE.

*----------------------------------------------------------------------*
* 2. Implementasi Kustom Developer (T-Code SE19 / ZCL_IM_...)
*----------------------------------------------------------------------*
CLASS zcl_im_sales_discount DEFINITION.
  PUBLIC SECTION.
    INTERFACES zif_ex_order_validation.
ENDCLASS.

CLASS zcl_im_sales_discount IMPLEMENTATION.
  METHOD zif_ex_order_validation~check_order_discount.
    " Aturan Bisnis Kustom Perusahaan: Diskon maksimal 15%!
    IF iv_discount_pct > 15.
      cv_allowed = abap_false.
      cv_message = |Diskon { iv_discount_pct }% melanggar aturan perusahaan! Maksimal diizinkan 15%.|.
    ELSE.
      cv_allowed = abap_true.
      cv_message = 'Diskon memenuhi ketentuan kebijakan penjualan.'.
    ENDIF.
  ENDMETHOD.
ENDCLASS.

*----------------------------------------------------------------------*
* 3. Simulasi Program Transaksi Standar SAP Memanggil Enhancement
*----------------------------------------------------------------------*
START-OF-SELECTION.

  WRITE: / sy-uline(80).
  WRITE: / '|', (76) 'SIMULASI ALUR KUSTOMISASI ENHANCEMENT FRAMEWORK' CENTERED, '|'.
  WRITE: / sy-uline(80).

  DATA: lv_order_id TYPE string VALUE 'SO-2026-909',
        lv_diskon   TYPE p LENGTH 4 DECIMALS 2 VALUE '20.00', " Diskon 20% diajukan
        lv_allowed  TYPE abap_bool,
        lv_message  TYPE string.

  WRITE: / '| Data Transaksi Masuk:', (54) ' ', '|',
         / '| - No. Pesanan     :', lv_order_id, (43) ' ', '|',
         / '| - Pengajuan Diskon:', lv_diskon, '%', (48) ' ', '|'.
  WRITE: / sy-uline(80).

  " -------------------------------------------------------------------
  " CATATAN ARSITEKTUR:
  " Pada sistem SAP produksi nyata, program standar memanggil BAdI via Kernel:
  "   DATA lo_badi TYPE REF TO zif_ex_order_validation.
  "   GET BADI lo_badi.
  "   CALL BADI lo_badi->check_order_discount( ... ).
  "
  " Di bawah ini adalah SIMULASI OOP LOKAL (Mock) agar script demo dapat
  " dijalankan mandiri tanpa memerlukan konfigurasi objek SE18/SE19 di server:
  " -------------------------------------------------------------------
  DATA lo_badi TYPE REF TO zif_ex_order_validation.
  lo_badi = NEW zcl_im_sales_discount( ).

  lo_badi->check_order_discount(
    EXPORTING iv_order_id     = lv_order_id
              iv_discount_pct = lv_diskon
    CHANGING  cv_allowed      = lv_allowed
              cv_message      = lv_message
  ).

  IF lv_allowed = abap_true.
    WRITE: / '| STATUS: VALIDASI BERHASIL. Dokumen siap disimpan ke database.', (15) ' ', '|'.
  ELSE.
    WRITE: / '| STATUS: VALIDASI DITOLAK OLEH ENHANCEMENT BADI!', (30) ' ', '|'.
    WRITE: / '| PESAN ERROR : ', (62) lv_message, '|'.
  ENDIF.

  WRITE: / sy-uline(80).
```

### Hasil Akhir

```text
---------------------------------------------------------------------------------
|                SIMULASI ALUR KUSTOMISASI ENHANCEMENT FRAMEWORK                |
---------------------------------------------------------------------------------
| Data Transaksi Masuk:                                                         |
| - No. Pesanan     : SO-2026-909                                               |
| - Pengajuan Diskon:     20,00 %                                               |
---------------------------------------------------------------------------------
| STATUS: VALIDASI DITOLAK OLEH ENHANCEMENT BADI!                               |
| PESAN ERROR :  Diskon 20.00% melanggar aturan perusahaan! Maksimal diizinkan 15%.|
---------------------------------------------------------------------------------
```

---

## 12. 📚 Ringkasan & Peta Ingatan

### Peta Konsep Enhancement Framework

```text
ABAP Enhancement Framework (Clean Core)
├── 1. Prinsip Dasar
│   ├── Clean Core (Dilarang modifikasi langsung kode bawaan SAP)
│   └── Non-Invasive (Logika kustom tersimpan di objek Z terpisah)
├── 2. Teknologi Klasik
│   ├── User Exits (Include subroutines FORM di modul SD: MV45AFZZ)
│   └── Customer Exits (Function Module EXIT_... via SMOD/CMOD)
├── 3. Source Code Enhancements
│   ├── Explicit Points & Sections (Titik resmi bertanda ENHANCEMENT-POINT)
│   └── Implicit Options (Titik kait otomatis di awal & akhir method/form)
└── 4. Modern Business Add-Ins (BAdI)
    ├── Enhancement Spot (Wadah pengelompokan BAdI di SE18)
    ├── Kernel BAdI (Performa tinggi di level kernel ABAP)
    └── BAdI Implementation (Pembuatan implementasi class via SE19)
```

---

## 13. 📚 Cheat Code Enhancement 10 Detik

```text
SE18                                             → Definisi BAdI & Enhancement Spot
SE19                                             → Implementasi logika kustom BAdI
SMOD / CMOD                                      → Manajemen Customer Exits klasik
CL_EXITHANDLER=>GET_INSTANCE                     → Pasang breakpoint untuk lacak nama BAdI
ENHANCEMENT-POINT name SPOTS spot.               → Titik penyisipan kode resmi
ENHANCEMENT-SECTION name SPOTS spot.             → Titik penggantian kode resmi
Show Implicit Options                            → Memunculkan titik kait tersembunyi
Clean Core                                       → Hindari SSCR Access Key modifikasi
```

---

## 14. 🧭 Urutan Belajar Selanjutnya

Setelah menguasai teknik kustomisasi program standar SAP secara aman, materi berikutnya berfokus pada teknik pemecahan masalah (*Troubleshooting*), penelusuran crash runtime, dan optimasi performa program:

```text
1. 🟢 ABAP Dasar (Fondasi sintaks & kontrol alur)
      │
      ▼
2. 🟢 ABAP Data Dictionary (Struktur tabel & tipe data)
      │
      ▼
3. 🟢 ABAP Internal Tables (Manipulasi array in-memory)
      │
      ▼
4. 🟡 ABAP Database & Open SQL (Akses data database)
      │
      ▼
5. 🟡 ABAP Modularization & Integration (Function modules & BAPI)
      │
      ▼
6. 🟡 ABAP Reports & ALV Grid (Visualisasi data pelaporan)
      │
      ▼
7. 🟡 ABAP Objects (OOP) (Paradigma berorientasi objek)
      │
      ▼
8. 🔴 ABAP Enhancement Framework (Selesai pada modul ini)
      │
      ▼
9. 🔴 ABAP Debugging & Performance Tuning
   → Pelajari investigasi crash dump (ST22), New ABAP Debugger, SQL Trace (ST05), dan Runtime Profiling (SAT).
      │
      ▼
10. 🔴 ABAP Core Data Services (CDS Views) & AMDP
    → Masuki paradigma modern S/4HANA Code-Pushdown.
```

Lanjutkan ke modul berikutnya: [[abap-debugging-performance|ABAP Debugging & Performance Tuning]] (Modul 9).

---

## 15. 🔗 Referensi Resmi

* [SAP Help Portal — The Enhancement Framework](https://help.sap.com/docs/ABAP_PLATFORM/)
* [SAP Community — How to Find and Implement BAdIs in SAP](https://community.sap.com/)
* [openSAP — Clean Core Strategy and Extensibility Guide](https://open.sap.com/)
