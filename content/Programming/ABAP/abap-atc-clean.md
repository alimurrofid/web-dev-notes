---
title: "ABAP Test Cockpit (ATC) & Clean ABAP"
description: "Panduan lengkap standarisasi kualitas kode dan pengujian statis di SAP ABAP: pengenalan Code Inspector (SCI) dan ATC, hubungan ATC dengan engine SCI, konfigurasi Check Variant, integrasi quality gate pada Transport Request, prosedur pengajuan Exemption, serta panduan gaya penulisan Clean ABAP."
order: 13
tags:
  - sap
  - abap
  - quality-assurance
  - clean-code
  - atc
---

# ABAP Test Cockpit (ATC) & Clean ABAP

> Target: ABAP Developer (Lanjutan)  
> Prasyarat: [[abap-oop|Modul 7: ABAP Objects]], [[abap-debugging-performance|Modul 9: Debugging & Performance]]  
> Lingkungan: SAP NetWeaver 7.02+, SAP S/4HANA, SAP BTP ABAP Environment

---

## Gambaran Umum

Dalam ekosistem enterprise SAP berskala besar dengan puluhan pengembang yang bekerja bersamaan, menjaga keseragaman kualitas kode, keamanan (*security*), performa database, dan kesiapan upgrade sistem adalah tantangan raksasa. 

**ABAP Test Cockpit (ATC)** adalah platform pemeriksaan statis (*static code analysis*) resmi dari SAP yang dirancang untuk mendeteksi potensi cacat kode (*code defects*), pelanggaran performa (seperti *SELECT in LOOP*), kerentanan keamanan, serta ketidakpatuhan sintaks sebelum kode dirilis ke sistem pengujian maupun produksi. Dipadukan dengan filosofi **Clean ABAP**, developer dibekali pedoman untuk menulis kode yang mudah dibaca, mudah dirawat (*maintainable*), dan siap bertransformasi menuju arsitektur modern (*Clean Core*).

---

## Daftar Isi

### 🟢 Fundamental

1. [Mengapa Standarisasi Kualitas Kode Penting di Enterprise](#1--mengapa-standarisasi-kualitas-kode-penting-di-enterprise)
2. [Evolusi Pengujian Statis: Code Inspector (SCI) vs ABAP Test Cockpit (ATC)](#2--evolusi-pengujian-statis-code-inspector-sci-vs-abap-test-cockpit-atc)
3. [Anatomi ATC: Check Variants & Klasifikasi Temuan](#3--anatomi-atc-check-variants--klasifikasi-temuan)
4. [Menjalankan ATC di Eclipse ADT & SAP GUI](#4--menjalankan-atc-di-eclipse-adt--sap-gui)

### 🟡 Lanjutan

5. [ATC sebagai Gerbang Kualitas (Quality Gate) Transport Request](#5--atc-sebagai-gerbang-kualitas-quality-gate-transport-request)
6. [Alur Pengajuan Pembebasan Temuan (Exemption Workflow)](#6--alur-pengajuan-pembebasan-temuan-exemption-workflow)
7. [Local ATC vs Central ATC System](#7--local-atc-vs-central-atc-system)
8. [Prinsip-Prinsip Utama Clean ABAP](#8--prinsip-prinsip-utama-clean-abap)
9. [Refactoring: Mengubah Kode Legacy Menjadi Clean ABAP](#9--refactoring-mengubah-kode-legacy-menjadi-clean-abap)
10. [Perbandingan Konteks: On-Premise vs ABAP Cloud Readiness](#10--perbandingan-konteks-on-premise-vs-abap-cloud-readiness)

### 🛠️ Praktik & Rujukan

11. [Praktik: Investigasi Temuan ATC & Remediasi Kode](#11-️-praktik-investigasi-temuan-atc--remediasi-kode)
12. [Ringkasan & Kaidah Clean ABAP](#12--ringkasan--kaidah-clean-abap)
13. [Referensi Resmi](#13--referensi-resmi)

---

## 1. 🟢 Mengapa Standarisasi Kualitas Kode Penting di Enterprise

Tanpa alat pemeriksaan otomatis, kode program di lingkungan SAP sering mengalami degradasi kualitas:
* **Penurunan Performa Database**: Pengembang pemula tanpa sengaja menuliskan query `SELECT` di dalam blok `LOOP AT`, menyebabkan jutaan putaran *network roundtrip* ke database.
* **Kerentanan Keamanan**: Celah SQL Injection atau bypass otorisasi (`AUTHORITY-CHECK` yang terlewat).
* **Biaya Upgrade Sangat Mahal**: Sintaks usang (*obsolete statements*) yang tidak kompatibel dengan SAP S/4HANA atau database SAP HANA.

Pemeriksaan statis menganalisis struktur kode sumber (*Abstract Syntax Tree*) tanpa harus mengeksekusi program tersebut, mendeteksi potensi masalah sejak dini di workstation pengembang.

---

## 2. 🟢 Evolusi Pengujian Statis: Code Inspector (SCI) vs ABAP Test Cockpit (ATC)

Terdapat kesalahpahaman umum bahwa kemunculan ATC menghapus atau menggantikan **Code Inspector (`SCI`)**. Faktanya:

```text
Arsitektur Lapisan Pemeriksaan Statis SAP:
┌─────────────────────────────────────────────────────────────┐
│                 ABAP Test Cockpit (ATC)                     │
│  - Integrasi Eclipse ADT & Quick Fixes                      │
│  - Integrasi Otomatis Rilis Transport Request (CTS Gate)    │
│  - Alur Persetujuan Pembebasan (Exemption Approval Workflow) │
│  - Pengujian Terpusat (Central ATC Quality Server)          │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Memanfaatkan Engine & Aturan di Bawahnya)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Code Inspector (SCI Engine)                 │
│  - Definisi Check Classes (Algoritma Pemeriksaan)           │
│  - Manajemen Kategori Aturan & Check Variants               │
└─────────────────────────────────────────────────────────────┘
```

1. **Code Inspector (T-Code `SCI`)**: Adalah *mesin teknis* yang mendefinisikan algoritma pemeriksaan (misal: aturan spasi, nested loops, obsolete statements).
2. **ABAP Test Cockpit (ATC)**: Adalah *lapisan orkestrasi modern enterprise* yang memanfaatkan engine SCI di bawahnya, seraya menambahkan integrasi IDE modern (Eclipse ADT), otomatisasi pengecekan saat rilis Transport Request, serta sistem audit pembebasan (*Exemption*).

---

## 3. 🟢 Anatomi ATC: Check Variants & Klasifikasi Temuan

### Check Variant
**Check Variant** adalah kumpulan aturan pemeriksaan yang dipilih untuk tujuan tertentu. Beberapa Check Variant resmi yang paling umum:
* **`DEFAULT`**: Standar pemeriksaan fungsional bawaan SAP.
* **`ABAP_CLOUD_DEVELOPMENT_DEFAULT`**: Aturan ketat untuk memeriksa kepatuhan *ABAP Cloud* (larangan akses direct tables, larangan unreleased APIs).
* **Check Variant Kustom Perusahaan (misal `ZCUSTOM_STRICT`)**: Disesuaikan dengan standar arsitektur internal organisasi.

### Klasifikasi Prioritas Temuan (Severity)

| Tingkat Prioritas | Kategori | Dampak pada Governance | Contoh Kasus |
| :--- | :--- | :--- | :--- |
| **Priority 1 (Error)** | 🔴 Kritis | Umumnya memblokir rilis Transport Request. | Potensi SQL Injection, Syntax Error, SELECT tanpa WHERE pada tabel raksasa. |
| **Priority 2 (Warning)**| 🟡 Peringatan | Memerlukan perbaikan atau pengajuan pembebasan resmi (*exemption*). | `SELECT *` padahal hanya 2 field yang dipakai, `FOR ALL ENTRIES` tanpa pengecekan `IS NOT INITIAL`. |
| **Priority 3 (Info)** | 🔵 Informasi | Saran perbaikan gaya penulisan, tidak memblokir rilis. | Nama variabel tidak ekspresif, blok komentar usang. |

---

## 4. 🟢 Menjalankan ATC di Eclipse ADT & SAP GUI

### Melalui Eclipse ADT (Alur Kerja Modern)
1. Buka objek (Class, CDS View, Program, atau Package).
2. Klik kanan pada objek $\rightarrow$ **Run As** $\rightarrow$ **ABAP Test Cockpit** (atau tekan **Ctrl + Shift + F2**).
3. Panel **ATC Problems** akan menampilkan daftar temuan secara terperinci.
4. Banyak temuan ATC di ADT menyediakan **Quick Fix (Ctrl + 1)** untuk memperbaiki kode secara instan dan otomatis!

### Melalui SAP GUI (`SE80` / `ATC`)
1. Di `SE80`, klik kanan objek $\rightarrow$ **Check** $\rightarrow$ **ABAP Test Cockpit**.
2. Hasil evaluasi dapat diinvestigasi lebih lanjut melalui T-Code **`ATC`** (*ATC Administration & Display Runs*).

---

## 5. 🟡 ATC sebagai Gerbang Kualitas (Quality Gate) Transport Request

Dalam tata kelola rilis enterprise, sistem SAP dapat dikonfigurasi untuk menjalankan pemeriksaan ATC secara otomatis setiap kali seorang pengembang mencoba merilis sebuah Transport Request (*TR Release Check*).

```text
Pengembang Klik 'Release' pada Transport Request (SE09 / SE10)
                                │
                                ▼
                   [ Sistem Menjalankan ATC Check ]
                                │
                ┌───────────────┴───────────────┐
                ▼                               ▼
       Ditemukan Priority 1 / 2          Bebas Error (Clean)
                │                               │
                ▼                               ▼
       Rilis TR Dibatalkan!             TR Berhasil Dirilis
    (Developer Wajib Perbaiki           Objek Siap Ditransfer
     atau Ajukan Exemption)               ke Sistem Testing
```

> [!NOTE]
> **Kebijakan Tata Kelola (Governance Policy):**
> Pemblokiran rilis Transport Request oleh ATC bukan sifat mutlak yang aktif secara otomatis di semua sistem instalasi baru. Mekanisme ini diaktifkan dan dikonfigurasi oleh administrator Basis atau Lead Architect perusahaan melalui integrasi CTS (misal via BAdI `CTS_REQUEST_CHECK` atau konfigurasi *Transport Tool* di T-Code `ATC`).

---

## 6. 🟡 Alur Pengajuan Pembebasan Temuan (Exemption Workflow)

Ada situasi nyata di mana sebuah temuan ATC teridentifikasi, namun secara teknis memang tidak dapat dihindari (misalnya program migrasi satu kali pakai yang terpaksa membaca tabel legacy). Developer tidak boleh mengubah kode menjadi aneh hanya demi mengakali scanner.

SAP menyediakan alur resmi **Exemption Workflow**:
1. **Pengajuan (Request)**: Developer mengklik kanan temuan ATC di Eclipse ADT $\rightarrow$ **Request Exemption**. Developer menuliskan alasan teknis yang valid.
2. **Review oleh Lead Architect**: Permohonan masuk ke antrean administrator/QA di T-Code `ATC`.
3. **Persetujuan (Approve / Reject)**: Jika disetujui, temuan tersebut akan diabaikan (*suppressed*) secara resmi di sistem dan dicatat dalam audit trail.

---

## 7. 🟡 Local ATC vs Central ATC System

Pada perusahaan multinasional dengan puluhan sistem SAP (ERP, CRM, SCM, BW):
* **Local ATC**: Pengecekan dijalankan langsung di mesin lokal development tempat developer bekerja.
* **Central ATC System**: Satu server SAP khusus (biasanya berbasis release terbaru) yang bertindak sebagai *Central Check System*. Server ini terhubung melalui RFC ke seluruh sistem pengembangan satelit untuk memindai kode menggunakan aturan terpusat yang seragam.

---

## 8. 🟡 Prinsip-Prinsip Utama Clean ABAP

**Clean ABAP** adalah kumpulan pedoman gaya penulisan (*styleguide*) resmi yang diprakarsai oleh komunitas teknis SAP untuk menciptakan kode yang mudah dibaca (*readable*) dan tahan lama.

### Kaidah-Kaidah Emas Clean ABAP:
1. **Pilih Nama yang Ekspresif**:
   * Hindari singkatan misterius seperti `lv_x`, `flag1`, `tbl`.
   * Gunakan penamaan yang menjelaskan isi: `is_order_completed`, `customer_balance`.
2. **Batasi Ukuran Method**:
   * Sebuah method sebaiknya hanya melakukan **satu hal** (*Single Responsibility Principle*).
   * Idealnya panjang method tidak melebihi 20–30 baris kode.
3. **Katakan Lewat Kode, Bukan Komentar**:
   * Komentar usang yang tidak diperbarui lebih berbahaya daripada tidak ada komentar.
   * Buat method kecil dengan nama yang jelas daripada menulis komentar panjang untuk menjelaskan kode rumit.
4. **Gunakan Ekspresi Modern ABAP 7.40+**:
   * Manfaatkan string templates `|Total: { lv_total }|` daripada `CONCATENATE`.
   * Gunakan `VALUE`, `FILTER`, `COND` daripada rangkaian assignment manual yang panjang.

---

## 9. 🟡 Refactoring: Mengubah Kode Legacy Menjadi Clean ABAP

### Contoh 1: Penulisan Kondisi Logika

```abap
" KODE LEGACY (Sulit Dibaca):
IF NOT iv_status <> 'CANCELLED'.
  " blok logika...
ENDIF.

" CLEAN ABAP (Jelas & Tegas):
IF iv_status = 'CANCELLED'.
  " blok logika...
ENDIF.
```

### Contoh 2: Rangkaian Penggabungan Teks

```abap
" KODE LEGACY:
DATA: lv_msg TYPE string,
      lv_inv TYPE string VALUE 'INV-100'.
CONCATENATE 'Faktur' lv_inv 'berhasil diproses.' INTO lv_msg SEPARATED BY space.

" CLEAN ABAP:
DATA(lv_msg) = |Faktur { lv_inv } berhasil diproses.|.
```

---

## 10. 🟡 Perbandingan Konteks: On-Premise vs ABAP Cloud Readiness

| Parameter Evaluasi | SAP ECC / NetWeaver On-Premise | SAP S/4HANA (On-Premise / Private) | SAP ABAP Cloud (Clean Core) |
| :--- | :--- | :--- | :--- |
| **Tool Static Analysis** | `SCI` (Code Inspector) & ATC | **ATC Terintegrasi Penuh** | **ATC Wajib (Cloud Gatekeeper)** |
| **Check Variant Utama** | `DEFAULT` / Kustom | `S4HANA_READINESS` | `ABAP_CLOUD_DEVELOPMENT_DEFAULT` |
| **Fokus Pemeriksaan** | Performa database, sintaks dasar | Kompatibilitas tabel S/4HANA, optimasi HANA | Kepatuhan Clean Core, larangan unreleased APIs |
| **Quick Fixes di ADT** | Terbatas (bergantung versi NW) | Sangat Lengkap | **Bawaan Standar (Otomatis)** |

---

## 11. 🛠️ Praktik: Investigasi Temuan ATC & Remediasi Kode

### Skenario Masalah
Program warisan `ZLEGACY_CUSTOMER_REPORT` menunjukkan kinerja lambat dan memicu temuan prioritas tinggi saat diperiksa oleh ATC.

### Kode Bermasalah (Sebelum Perbaikan)

```abap
REPORT zlegacy_customer_report.

DATA: lt_kna1 TYPE STANDARD TABLE OF kna1,
      ls_kna1 TYPE kna1,
      lt_vbak TYPE STANDARD TABLE OF vbak,
      ls_vbak TYPE vbak.

" ATC FINDING 1 (Priority 2): SELECT * tanpa daftar field spesifik
SELECT * FROM kna1 INTO TABLE lt_kna1 UP TO 50 ROWS.

LOOP AT lt_kna1 INTO ls_kna1.
  " ATC FINDING 2 (Priority 1 Fatal): Query database di dalam perulangan LOOP (N+1 Problem)!
  SELECT * FROM vbak INTO ls_vbak
    WHERE kunnr = ls_kna1-kunnr.
    WRITE: / ls_kna1-kunnr, ls_vbak-vbeln, ls_vbak-netwr.
  ENDSELECT.
ENDLOOP.
```

### Analisis Temuan ATC
1. **Priority 2**: `SELECT *` membebani memori server karena menarik seluruh kolom fisik tabel `KNA1` yang tidak pernah ditampilkan ke pengguna.
2. **Priority 1**: `SELECT ... ENDSELECT` di dalam `LOOP AT` membuka roundtrip jaringan berulang kali ke database engine, melanggar *Golden Rules Performance*.

---

### Kode Bersih & Dioptimasi (Sesudah Remediasi Clean ABAP)

```abap
*&---------------------------------------------------------------------*
*& Report ZCLEAN_CUSTOMER_REPORT
*&---------------------------------------------------------------------*
*& Remediasi Temuan ATC Menggunakan Kaidah Modern ABAP & Join Optimal
*&---------------------------------------------------------------------*
REPORT zclean_customer_report LINE-SIZE 85.

TYPES: BEGIN OF ty_report,
         kunnr TYPE kna1-kunnr,
         name1 TYPE kna1-name1,
         vbeln TYPE vbak-vbeln,
         netwr TYPE vbak-netwr,
       END OF ty_report.

DATA lt_report TYPE STANDARD TABLE OF ty_report WITH EMPTY KEY.

START-OF-SELECTION.

  " Menggabungkan query dalam 1x penarikan optimal (Array Fetch via JOIN):
  SELECT c~kunnr,
         c~name1,
         o~vbeln,
         o~netwr
    FROM kna1 AS c
    INNER JOIN vbak AS o ON o~kunnr = c~kunnr
    ORDER BY c~kunnr, o~vbeln
    INTO TABLE @lt_report
    UP TO 50 ROWS.

  IF lt_report IS INITIAL.
    WRITE: / 'Tidak ada data transaksi yang ditemukan.'.
    RETURN.
  ENDIF.

  WRITE: / sy-uline(80).
  WRITE: / '|', (76) 'LAPORAN TRANSAKSI PELANGGAN (BERSIH DARI TEMUAN ATC)' CENTERED, '|'.
  WRITE: / sy-uline(80).

  LOOP AT lt_report INTO DATA(ls_row).
    WRITE: / '|', (12) ls_row-kunnr,
             '|', (25) ls_row-name1,
             '|', (15) ls_row-vbeln,
             '|', (16) ls_row-netwr, '|'.
  ENDLOOP.

  WRITE: / sy-uline(80).
```

### Hasil Verifikasi Ulang ATC di Eclipse ADT
Saat dijalankan ulang (**Ctrl + Shift + F2**):
```text
ATC Problems: 0 Errors, 0 Warnings, 0 Notes found.
Check Variant: DEFAULT
Status: CLEAN CODE (Ready for Transport Release)
```

---

## 12. 📚 Ringkasan & Kaidah Clean ABAP

### Peta Konsep
```text
Quality Assurance & Clean ABAP
├── 1. Engine & Platform
│   ├── SCI (Code Inspector - Penyedia algoritma & Check Variant dasar)
│   └── ATC (ABAP Test Cockpit - Orkestrasi ADT, CI/CD, & Gerbang Rilis TR)
├── 2. Klasifikasi Temuan
│   ├── Priority 1 (Error kritis - Memblokir rilis)
│   ├── Priority 2 (Warning - Harus diperbaiki / dimohonkan exemption)
│   └── Priority 3 (Info - Optimasi minor)
├── 3. Alur Kerja Tata Kelola
│   ├── Run ATC (Ctrl + Shift + F2 di ADT)
│   ├── Quick Fix (Ctrl + 1 untuk perbaikan otomatis)
│   └── Request Exemption (Permohonan pembebasan resmi jika tidak dapat dihindari)
└── 4. Pilar Clean ABAP
    ├── Nama bermakna & ekspresif
    ├── Method kecil (fokus pada 1 tugas)
    └── Manfaatkan ekspresi modern ABAP 7.40+
```

---

## 13. 🔗 Referensi Resmi

* [SAP Help Portal: ABAP Test Cockpit (ATC) User Guide](https://help.sap.com/docs/ABAP_PLATFORM_NEW/c238d694b825421f940829322fed326f/491e847c21351d8de10000000a42189c.html)
* [SAP Help Portal: Code Inspector (SCI) Architecture](https://help.sap.com/docs/SAP_NETWEAVER_700/c238d694b825421f940829322fed326f/491e847c21351d8de10000000a42189c.html)
* [Clean ABAP Official Styleguide by SAP](https://github.com/SAP/styleguides/blob/main/clean-abap/CleanABAP.md)
* [SAP Community: ABAP Test Cockpit - Remote Code Analysis in S/4HANA](https://community.sap.com/t5/technology-blogs-by-sap/abap-test-cockpit-atc-for-developers-in-eclipse/ba-p/13256038)
