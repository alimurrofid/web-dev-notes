---
title: "ABAP Dasar"
description: "Panduan lengkap fundamental SAP ABAP: arsitektur 3-tier, Transaction Codes, sintaksis dasar, tipe data bawaan, control flow, input interaktif, manipulasi string, modularisasi dasar, hingga sintaks modern ABAP 7.40+."
order: 1
tags:
  - programming
  - abap
  - sap
  - backend
  - fundamental
---

# ABAP Dasar

> **Target:** Pemula yang baru memulai perjalanan sebagai SAP Technical Consultant atau ABAP Developer.
> **Versi:** SAP NetWeaver AS ABAP 7.40+ / 7.50+ hingga SAP S/4HANA (kompatibel dengan sistem ECC 6.0).
> **Fokus modul pembelajaran:** Arsitektur sistem SAP $\rightarrow$ SAP GUI & Eclipse ADT $\rightarrow$ T-Code esensial $\rightarrow$ Struktur Program $\rightarrow$ Komentar & Statement $\rightarrow$ Variabel & Tipe Data $\rightarrow$ Operator & Logika $\rightarrow$ Percabangan IF & CASE $\rightarrow$ Perulangan DO & WHILE $\rightarrow$ Input Interaktif PARAMETERS $\rightarrow$ Manipulasi String $\rightarrow$ System Variables (`sy-*`) $\rightarrow$ Subroutine `FORM` $\rightarrow$ Sintaks Modern 7.40+ $\rightarrow$ Mini Project: Kalkulator Faktur Penjualan.

---

## Gambaran Umum

**ABAP (Advanced Business Application Programming)** adalah bahasa pemrograman tingkat tinggi generasi ke-4 (4GL) yang dikembangkan oleh SAP SE. Bahasa ini dirancang khusus untuk memproses data transaksi bisnis dalam skala perusahaan global (*enterprise*), mulai dari manajemen inventaris, pencatatan finansial, pengadaan barang, hingga pelaporan analitik.

Di dalam ekosistem SAP, ABAP bekerja secara terintegrasi dengan database melalui lapisan abstraksi **Open SQL** dan berjalan di dalam lingkungan **SAP NetWeaver Application Server (AS ABAP)** maupun platform modern **SAP S/4HANA**. Modul ini menyajikan fondasi esensial bahasa ABAP mulai dari mental model komputasi 3-tier hingga teknik menulis program laporan bisnis yang bersih, modular, dan bebas error.

---

## Cara Belajar

```text
🟢 Fundamental
→ Pahami arsitektur SAP, cara kerja Application Server, aturan sintaks, dan tipe data bawaan.

🟡 Lanjutan
→ Kuasai manipulasi string modern, penanganan system variables, subroutines, dan teknik debugging dasar.

🛠️ Praktik
→ Bangun mini project program laporan berbasis Selection Screen untuk mengintegrasikan seluruh konsep.
```

Mental model alur eksekusi kode ABAP pada SAP NetWeaver Application Server:

```text
       Presentation Layer (SAP GUI / Web GUI / SAP Fiori)
                         │
                         │ User menjalankan T-Code / Report
                         ▼
       Application Layer (SAP NetWeaver AS ABAP)
       ┌────────────────────────────────────────────────────────┐
       │ Dispatcher                                             │
       │   │                                                    │
       │   ▼                                                    │
       │ Dialog Work Process (DIA)                              │
       │   ├─ ABAP Interpreter (Mengeksekusi program)           │
       │   ├─ Database Interface (Menerjemahkan Open SQL)       │
       │   └─ Screen Processor (Menangani input/tampilan GUI)   │
       └────────────────────────┬───────────────────────────────┘
                                │
                                │ Native SQL Query
                                ▼
       Database Layer (SAP HANA / Oracle / DB2 / SQL Server)
```

**Hafalan:**

```text
T-Code (Transaction Code) → Pintasan 4 digit untuk membuka program/layanan (misal: SE38)
Customer Namespace        → Objek kustom buatan developer wajib diawali huruf Z atau Y
Statement                 → Setiap baris perintah wajib diakhiri tanda titik (.)
Case-Insensitive          → ABAP tidak membedakan huruf besar dan kecil dalam keyword
sy-subrc                  → Kode status eksekusi sistem (0 = sukses, bukan 0 = ada masalah)
Dialog Work Process       → Proses di Application Server yang mengeksekusi instruksi pengguna
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan SAP & Arsitektur 3-Tier](#1--pengenalan-sap--arsitektur-3-tier)
2. [Development Environment & T-Code Esensial](#2--development-environment--t-code-esensial)
3. [Struktur Program & Hello World](#3--struktur-program--hello-world)
4. [Aturan Sintaks, Statement, & Komentar](#4--aturan-sintaks-statement--komentar)
5. [Tipe Data Bawaan (Built-in Data Types)](#5--tipe-data-bawaan-built-in-data-types)
6. [Variabel, Tipe Kustom (TYPES), & Konstanta](#6--variabel-tipe-kustom-types--konstanta)
7. [Operator Aritmatika & Perhitungan Matematika](#7--operator-aritmatika--perhitungan-matematika)
8. [Operator Perbandingan & Logika Boolean](#8--operator-perbandingan--logika-boolean)
9. [Percabangan Logika (IF & CASE)](#9--percabangan-logika-if--case)
10. [Perulangan Dasar (DO & WHILE)](#10--perulangan-dasar-do--while)
11. [Input Pengguna Interaktif (PARAMETERS)](#11--input-pengguna-interaktif-parameters)
12. [Manipulasi String Klasik & Modern](#12--manipulasi-string-klasik--modern)
13. [System Variables Esensial (Struktur SYST)](#13--system-variables-esensial-struktur-syst)
14. [Subroutines Dasar (FORM & PERFORM)](#14--subroutines-dasar-form--perform)

### 🟡 Lanjutan

15. [Pengenalan Fitur Modern ABAP 7.40+](#15--pengenalan-fitur-modern-abap-740)
16. [Debugging Dasar & Analisis Error (ST22)](#16--debugging-dasar--analisis-error-st22)

### 🛠️ Praktik

17. [Mini Project: Kalkulator Faktur Penjualan](#17-️-mini-project-kalkulator-faktur-penjualan)

### 📚 Ringkasan & Referensi

18. [Peta Ingatan & Ringkasan](#18--peta-ingatan--ringkasan)
19. [Cheat Code ABAP 10 Detik](#19--cheat-code-abap-10-detik)
20. [Urutan Belajar Selanjutnya](#20--urutan-belajar-selanjutnya)
21. [Referensi Resmi](#21--referensi-resmi)

---

## 1. 🟢 Pengenalan SAP & Arsitektur 3-Tier

### Konsep

**SAP (Systeme, Anwendungen und Produkte in der Datenverarbeitung)** adalah sistem ERP (*Enterprise Resource Planning*) yang mengintegrasikan seluruh operasional bisnis mulai dari keuangan (*Finance* / FI), logistik (*Materials Management* / MM), penjualan (*Sales and Distribution* / SD), hingga produksi (*Production Planning* / PP).

Sistem SAP dibangun di atas arsitektur Client-Server 3-Tier yang kokoh:

```text
┌────────────────────────────────────────────────────────┐
│ 1. Presentation Layer (Tampilan Antarmuka)             │
│    - SAP GUI (Desktop Application)                     │
│    - SAP Fiori / WebGUI (Browser HTML5/UI5)            │
└───────────────────────────┬────────────────────────────┘
                            │ User Input / Screen Event
                            ▼
┌────────────────────────────────────────────────────────┐
│ 2. Application Layer (Logika Pemrosesan ABAP)          │
│    - SAP NetWeaver Application Server (AS ABAP)        │
│    - Menjalankan program ABAP di Work Process          │
│    - Mengatur session, caching memori, dan otorisasi   │
└───────────────────────────┬────────────────────────────┘
                            │ Open SQL (Database-Independent)
                            ▼
┌────────────────────────────────────────────────────────┐
│ 3. Database Layer (Penyimpanan Data Terpusat)          │
│    - SAP HANA (In-Memory Database modern)              │
│    - Relational DB tradisional (Oracle, DB2, MSSQL)    │
└────────────────────────────────────────────────────────┘
```

### Konsep Client / Mandant

Di dalam satu sistem SAP, terdapat isolasi data yang disebut **Client** (atau *Mandant*):
* Setiap Client memiliki kode 3 digit (misalnya: `100` untuk Development, `200` untuk Quality Assurance, `400` untuk Production).
* Data transaksi bisnis bersifat **Client-Dependent** (terisolasi hanya untuk client bersangkutan).
* Definisi tabel dan kode program ABAP umumnya bersifat **Client-Independent** (berlaku untuk semua client di sistem).

### Customer Namespace (Z & Y)

SAP memiliki jutaan baris kode standar. Agar program buatan Anda tidak tertimpa saat update sistem:

> **Aturan Emas:** Semua objek kustom (program, tabel, transaksi, struktur) **WAJIB diawali huruf `Z` atau `Y`** (contoh: `ZREP_SALES_REPORT`). Objek tanpa awalan Z atau Y adalah milik SAP standar.

---

## 2. 🟢 Development Environment & T-Code Esensial

### Konsep

Dalam sistem SAP, seluruh navigasi program dan administrasi dilakukan menggunakan **Transaction Code (T-Code)** melalui kotak perintah (*command box*) di SAP GUI.

### Perbandingan Tool Pengembangan

| Tool | Karakteristik | Lingkungan Penggunaan |
| :--- | :--- | :--- |
| **SAP GUI** | Antarmuka desktop klasik bawaan SAP. Menggunakan editor `SE38` / `SE80`. | Sangat luas digunakan pada sistem SAP ECC dan NetWeaver klasik. |
| **Eclipse ADT** | Plugin resmi SAP untuk Eclipse IDE. Mendukung modern development (CDS Views, RAP, Git, syntax highlighting modern). | Standar wajib untuk pengembangan modern di SAP S/4HANA dan ABAP Cloud. |

### T-Code Esensial untuk ABAP Developer

**Hafalan:**

```text
SE38 → ABAP Editor: membuat, mengedit, dan menjalankan program executable (Reports)
SE80 → Object Navigator: manajemen paket lengkap (Program, Class, DDIC, Screen)
SE11 → ABAP Dictionary (DDIC): membuat tabel database, data element, dan domain
SE16N → General Table Display: melihat data mentah yang tersimpan di tabel database
SE24 → Class Builder: membuat dan memelihara ABAP Objects (Classes & Interfaces)
SE37 → Function Builder: membuat dan menguji Function Modules & BAPI
ST22 → ABAP Runtime Errors: menginvestigasi dump program yang mengalami crash
/n   → Prefiks untuk berpindah ke T-Code lain dari sesi yang sama (/nSE38)
/o   → Prefiks untuk membuka T-Code di jendela/sesi baru (/oSE11)
```

---

## 3. 🟢 Struktur Program & Hello World

### Konsep

Program ABAP yang paling sering dibuat oleh pemula adalah program berjenis **Executable Program** (sering disebut sebagai **Report**). Program ini dapat dijalankan langsung tanpa konfigurasi layar kompleks.

Setiap program executable diawali dengan keyword `REPORT` diikuti nama program kustom yang valid (`Z...`).

### Contoh Program Hello World

```abap
*&---------------------------------------------------------------------*
*& Report Z_HELLO_WORLD
*&---------------------------------------------------------------------*
*& Program pertama untuk mencetak teks ke layar output
*&---------------------------------------------------------------------*
REPORT z_hello_world.

" Mencetak baris teks ke layar menggunakan perintah klasik WRITE
WRITE: / 'Halo Dunia SAP!',
       / 'Selamat datang di pembelajaran ABAP Dasar.'.
```

### Output di SAP GUI

```text
Halo Dunia SAP!
Selamat datang di pembelajaran ABAP Dasar.
```

### Cara Kerja

```text
User menekan Execute (F8)
         │
         ▼
ABAP Runtime mengalokasikan Dialog Work Process
         │
         ▼
Event INITIALIZATION / START-OF-SELECTION dipicu otomatis
         │
         ▼
Pernyataan WRITE mengisi List Processing Buffer
         │
         ▼
SAP GUI menampilkan Basic List (layar teks standar SAP)
```

> [!NOTE]
> Simbol garis miring (`/`) sebelum teks pada perintah `WRITE: / '...'` berfungsi sebagai *newline* (ganti baris).

### Pendekatan Modern: `cl_demo_output`

Pada versi modern (ABAP 7.40+), Anda dapat menggunakan utilitas class bawaan `cl_demo_output` untuk menampilkan data secara cepat tanpa bergantung pada layar Basic List klasik:

```abap
REPORT z_hello_world_modern.

cl_demo_output=>display( 'Halo dari Modern ABAP!' ).
```

---

## 4. 🟢 Aturan Sintaks, Statement, & Komentar

### Konsep

ABAP memiliki aturan sintaksis yang sangat khas:

1. **Tanda Titik di Akhir Pernyataan**: Setiap statement lengkap dalam ABAP **WAJIB diakhiri dengan tanda titik (`.`)**.
2. **Komentar**:
   * Tanda bintang (`*`) di **kolom pertama** baris menjadikan seluruh baris sebagai komentar.
   * Tanda petik ganda (`"`) membuat komentar sebaris (*inline comment*).
3. **Chained Statements**: Menggabungkan instruksi berulang dengan tanda titik dua (`:`) dan koma (`,`).
4. **Spasi Wajib**: ABAP membutuhkan spasi di sekeliling operator dan tanda kurung.

```abap
* Komentar satu baris penuh di kolom 1
DATA: lv_nama TYPE string,
      lv_umur TYPE i.

lv_nama = 'Budi'. " Inline comment
lv_umur = 25.
```

### Best Practice

- Gunakan huruf besar (*UPPERCASE*) untuk keyword ABAP (`DATA`, `TYPES`, `WRITE`, `IF`) dan huruf kecil untuk nama identifier/variabel agar kode mudah dibaca.
- Selalu gunakan chained statements (`DATA: ..., ...`) untuk mendeklarasikan beberapa variabel sekaligus daripada mengulang kata kunci `DATA` berkali-kali.
- Berikan spasi satu karakter di kiri dan kanan operator penugasan (`=`) dan operator matematika (`+`, `-`, `*`, `/`).

### Kesalahan Umum

❌ Menulis assignment tanpa spasi: `lv_total=lv_qty*lv_price.`

Karena kompiler ABAP membedakan token berdasarkan spasi, token `lv_total=lv_qty*lv_price.` dianggap sebagai satu identifier tunggal yang tidak terdefinisi.

✅ Berikan spasi yang jelas: `lv_total = lv_qty * lv_price.`

Alasannya, kompiler ABAP dapat mem-parsing setiap operand dan operator dengan benar.

---

## 5. 🟢 Tipe Data Bawaan (Built-in Data Types)

### Konsep

Tipe data bawaan di ABAP terbagi menjadi dua kelompok:
1. **Complete Data Types**: Memiliki panjang memori tetap secara baku (`I`, `F`, `D`, `T`, `STRING`).
2. **Incomplete Data Types**: Panjang memori harus didefinisikan saat deklarasi (`C`, `N`, `P`).

### Tabel Tipe Data Bawaan

| Tipe | Nama | Kategori | Ukuran Default | Nilai Awal (Initial Value) | Deskripsi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `I` | Integer | Complete | 4 bytes | `0` | Bilangan bulat (-2.147.483.648 s/d +2.147.483.647) |
| `F` | Floating Point | Complete | 8 bytes | `0.0` | Bilangan pecahan biner untuk perhitungan ilmiah |
| `D` | Date | Complete | 8 karakter | `'00000000'` | Tanggal format `YYYYMMDD` (contoh: `'20260930'`) |
| `T` | Time | Complete | 6 karakter | `'000000'` | Waktu format `HHMMSS` (contoh: `'143000'`) |
| `STRING` | Dynamic String | Complete | Dinamis | `''` (kosong) | Teks dinamis dengan alokasi memori fleksibel |
| `C` | Character | Incomplete | 1 karakter | Spasi (`' '`) | Teks alfanumerik dengan panjang tetap |
| `N` | Numeric Text | Incomplete | 1 karakter | `'0'` | Angka yang diperlakukan sebagai teks (No. Dokumen, NIK) |
| `P` | Packed Number | Incomplete | 8 bytes | `0` | Bilangan desimal presisi tinggi untuk nilai finansial |

> [!NOTE]
> **Format Internal vs Format Tampilan Tanggal (`D` / `sy-datum`):**
> * **Penyimpanan Internal (8 karakter)**: Di memori komputer, tipe `D` dan variabel sistem `sy-datum` disimpan mentah berformat `YYYYMMDD` (contoh: `'20260930'`). Hal ini memungkinkan operasi aritmatika tanggal secara langsung (misal: `sy-datum + 30` untuk jatuh tempo 30 hari).
> * **Tampilan Output (10 karakter)**: Saat dicetak ke layar (`WRITE`), sistem secara otomatis mengonversinya sesuai preferensi user (*User Profile* di `SU01`), seperti `DD.MM.YYYY` atau `MM/DD/YYYY`. Karena menyertakan pemisah titik atau garis miring, panjang output display memerlukan **10 karakter**. Penulisan pembatasan panjang yang terlalu sempit seperti `(8) sy-datum` akan menyebabkan dua digit tahun di ujung terpotong.

### Contoh Deklarasi Tipe Bawaan

```abap
REPORT z_data_types.

DATA: lv_id        TYPE i VALUE 1001,
      lv_nama      TYPE c LENGTH 20 VALUE 'Ahmad Dahlan',
      lv_no_ktp    TYPE n LENGTH 16 VALUE '3201012304950001',
      lv_tgl_lahir TYPE d VALUE '19950423',
      lv_gaji      TYPE p DECIMALS 2 VALUE '12500000.50',
      lv_catatan   TYPE string VALUE 'Karyawan tetap departemen IT.'.

WRITE: / 'ID        :', lv_id,
       / 'Nama      :', lv_nama,
       / 'No KTP    :', lv_no_ktp,
       / 'Tgl Lahir :', lv_tgl_lahir,
       / 'Gaji      :', lv_gaji,
       / 'Catatan   :', lv_catatan.
```

### Output

```text
ID        :       1001
Nama      : Ahmad Dahlan
No KTP    : 3201012304950001
Tgl Lahir : 23.04.1995
Gaji      :      12.500.000,50
Catatan   : Karyawan tetap departemen IT.
```

### Best Practice

- Gunakan tipe `P DECIMALS 2` untuk seluruh variabel yang menampung nilai mata uang atau transaksi akuntansi guna mencegah kesalahan pembulatan desimal biner pada tipe `F`.
- Gunakan tipe `N` untuk identifier numerik yang tidak pernah dihitung secara matematis (seperti nomor telepon, kode pos, nomor material) agar *leading zeros* (angka 0 di depan) tidak terpotong.

### Kesalahan Umum

❌ Menggunakan tipe `I` (Integer) untuk nomor dokumen seperti `00012345`.

Karena tipe `I` mengonversi nilai numerik secara matematis, sehingga angka nol di depan (`000`) akan otomatis dibuang menjadi `12345`.

✅ Gunakan tipe `N` dengan panjang tetap: `DATA lv_doc TYPE n LENGTH 8 VALUE '00012345'.`

Alasannya, tipe `N` menyimpan digit sebagai teks dengan padding nol otomatis.

---

## 6. 🟢 Variabel, Tipe Kustom (TYPES), & Konstanta

### Konsep

Untuk menjaga kode tetap modular dan terstruktur, ABAP menyediakan:
* `DATA`: Mendeklarasikan variabel penampung data runtime.
* `TYPES`: Mendefinisikan tipe data kustom lokal.
* `CONSTANTS`: Mendefinisikan nilai tetap yang dilarang diubah sepanjang eksekusi program.

### Konvensi Penamaan Standar (Naming Convention)

```text
lv_  → Local Variable (variabel di dalam form/method lokal)
gv_  → Global Variable (variabel di level report/program utama)
lc_  → Local Constant (konstanta lokal)
gc_  → Global Constant (konstanta global)
ty_  → User-defined Type (tipe data bentukan kustom)
p_   → Parameter (input tunggal di selection screen)
s_   → Select-Options (input rentang/filter di selection screen)
```

### Contoh Penggunaan

```abap
REPORT z_types_constants.

" Mendefinisikan tipe data kustom
TYPES: ty_kode_pos TYPE n LENGTH 5,
       ty_rupiah   TYPE p LENGTH 8 DECIMALS 2.

" Mendefinisikan konstanta global
CONSTANTS: gc_persen_pajak TYPE p DECIMALS 2 VALUE '0.11', " PPN 11%
           gc_kode_negara   TYPE c LENGTH 2  VALUE 'ID'.

DATA: lv_pos   TYPE ty_kode_pos VALUE '12340',
      lv_harga TYPE ty_rupiah VALUE '100000.00',
      lv_pajak TYPE ty_rupiah.

lv_pajak = lv_harga * gc_persen_pajak.

WRITE: / 'Kode Negara :', gc_kode_negara,
       / 'Kode Pos    :', lv_pos,
       / 'Harga Dasar :', lv_harga,
       / 'Pajak (11%) :', lv_pajak.
```

### Output

```text
Kode Negara : ID
Kode Pos    : 12340
Harga Dasar :         100.000,00
Pajak (11%) :          11.000,00
```

---

## 7. 🟢 Operator Aritmatika & Perhitungan Matematika

### Konsep

ABAP menyediakan operator matematika standar dan operator pembagian khusus:

| Operator | Fungsi | Contoh | Hasil (`lv_hasil`) |
| :--- | :--- | :--- | :--- |
| `+` | Penjumlahan | `lv_hasil = 10 + 5.` | `15` |
| `-` | Pengurangan | `lv_hasil = 10 - 5.` | `5` |
| `*` | Perkalian | `lv_hasil = 10 * 5.` | `50` |
| `/` | Pembagian pecahan desimal | `lv_hasil = 7 / 2.` | `3.5` (jika tipe desimal) |
| `DIV` | Pembagian bilangan bulat (Quotient) | `lv_hasil = 7 DIV 2.` | `3` |
| `MOD` | Sisa bagi pembagian bulat (Remainder) | `lv_hasil = 7 MOD 2.` | `1` |
| `**` | Pemangkatan eksponensial | `lv_hasil = 2 ** 3.` | `8` |

### Contoh Program Aritmatika

```abap
REPORT z_aritmatika.

DATA: lv_total_detik TYPE i VALUE 3665,
      lv_jam         TYPE i,
      lv_sisa_detik  TYPE i,
      lv_menit       TYPE i,
      lv_detik       TYPE i.

lv_jam        = lv_total_detik DIV 3600.
lv_sisa_detik = lv_total_detik MOD 3600.
lv_menit      = lv_sisa_detik DIV 60.
lv_detik      = lv_sisa_detik MOD 60.

WRITE: / 'Total Detik Awal :', lv_total_detik,
       / 'Hasil Konversi   :', lv_jam, 'Jam,', lv_menit, 'Menit,', lv_detik, 'Detik.'.
```

### Output

```text
Total Detik Awal :       3.665
Hasil Konversi   :          1 Jam,         1 Menit,         5 Detik.
```

### Kesalahan Umum

❌ Melakukan pembagian tanpa memvalidasi apakah angka pembagi bernilai nol: `lv_hasil = lv_total / lv_pembagi.`

Jika `lv_pembagi` bernilai `0`, program akan mengalami crash fatal seketika dengan pesan dump `COMPUTE_INT_ZERODIVIDE`.

✅ Selalu periksa nilai pembagi sebelum melakukan operasi hitung:
```abap
IF lv_pembagi IS NOT INITIAL AND lv_pembagi <> 0.
  lv_hasil = lv_total / lv_pembagi.
ELSE.
  lv_hasil = 0.
ENDIF.
```

---

## 8. 🟢 Operator Perbandingan & Logika Boolean

### Konsep

Dalam ABAP, operator perbandingan dapat ditulis menggunakan simbol matematika modern atau singkatan teks 2 huruf klasik.

| Simbol Modern | Singkatan Klasik | Arti |
| :---: | :---: | :--- |
| `=` | `EQ` | Equal (Sama dengan) |
| `<>` atau `><` | `NE` | Not Equal (Tidak sama dengan) |
| `<` | `LT` | Less Than (Kurang dari) |
| `<=` | `LE` | Less Than or Equal (Kurang dari atau sama dengan) |
| `>` | `GT` | Greater Than (Lebih dari) |
| `>=` | `GE` | Greater Than or Equal (Lebih dari atau sama dengan) |

### Operator Logika Tambahan

* `AND`: Bernilai true jika kedua kondisi terpenuhi.
* `OR`: Bernilai true jika salah satu kondisi terpenuhi.
* `NOT`: Membalik hasil logika.
* `BETWEEN ... AND ...`: Mengecek rentang nilai secara inklusif.
* `IS INITIAL`: Bernilai true jika variabel masih bernilai awal / default (misalnya integer `0`, atau string `''`).

```abap
REPORT z_logika.

DATA: lv_nilai TYPE i VALUE 85,
      lv_grade TYPE c LENGTH 2.

IF lv_nilai >= 85 AND lv_nilai <= 100.
  lv_grade = 'A'.
ELSEIF lv_nilai >= 70 AND lv_nilai < 85.
  lv_grade = 'B'.
ELSE.
  lv_grade = 'C'.
ENDIF.

WRITE: / 'Nilai :', lv_nilai, 'mendapatkan Grade :', lv_grade.
```

---

## 9. 🟢 Percabangan Logika (IF & CASE)

### Konsep

ABAP menyediakan dua struktur percabangan utama: `IF ... ELSEIF ... ELSE ... ENDIF` untuk evaluasi kondisi jamak dan `CASE ... WHEN ... ENDCASE` untuk evaluasi nilai diskret.

### 1. Struktur `IF`

```abap
REPORT z_branching_if.

DATA: lv_stok TYPE i VALUE 0.

IF lv_stok > 10.
  WRITE: / 'Stok barang aman.'.
ELSEIF lv_stok > 0 AND lv_stok <= 10.
  WRITE: / 'Peringatan: Stok menipis, segera restock!'.
ELSE.
  WRITE: / 'Error: Stok habis total!'.
ENDIF.
```

### 2. Struktur `CASE`

```abap
REPORT z_branching_case.

DATA: lv_kode_status TYPE c LENGTH 1 VALUE 'A'.

CASE lv_kode_status.
  WHEN 'A'.
    WRITE: / 'Status: Aktif'.
  WHEN 'I'.
    WRITE: / 'Status: Inaktif'.
  WHEN 'P'.
    WRITE: / 'Status: Menunggu Persetujuan'.
  WHEN OTHERS.
    WRITE: / 'Status: Kode status tidak dikenali'.
ENDCASE.
```

### Best Practice

- Gunakan `CASE` jika Anda mengevaluasi satu variabel yang sama terhadap banyak nilai kemungkinan konstan. Struktur ini lebih efisien dan lebih mudah dipelihara dibanding rantai `IF-ELSEIF` yang panjang.
- Selalu sertakan cabang `WHEN OTHERS` di dalam blok `CASE` sebagai penanganan cadangan (*fallback*) untuk mengantisipasi nilai tak terduga.

---

## 10. 🟢 Perulangan Dasar (DO & WHILE)

### Konsep

ABAP menyediakan dua instruksi perulangan fundamental untuk iterasi terhitung:
1. `DO ... ENDDO`: Perulangan sejumlah n-kali, atau perulangan tak berhingga yang dihentikan secara eksplisit.
2. `WHILE ... ENDWHILE`: Perulangan yang terus berjalan selama kondisi logika bernilai benar.

### System Variable `sy-index`

Di dalam blok `DO` dan `WHILE`, variabel sistem `sy-index` secara otomatis mencatat nomor iterasi saat ini (dimulai dari angka `1`).

### Contoh Program Perulangan

```abap
REPORT z_perulangan.

WRITE: / '--- Perulangan DO (5 kali) ---'.
DO 5 TIMES.
  WRITE: / 'Iterasi DO ke-', sy-index.
ENDDO.

WRITE: / '--- Perulangan WHILE dengan EXIT & CONTINUE ---'.
DATA: lv_counter TYPE i VALUE 1.

WHILE lv_counter <= 10.
  IF lv_counter = 4.
    lv_counter = lv_counter + 1.
    CONTINUE. " Melompati iterasi angka 4
  ENDIF.

  IF lv_counter = 7.
    WRITE: / 'Berhenti di angka:', lv_counter.
    EXIT. " Menghentikan perulangan sepenuhnya
  ENDIF.

  WRITE: / 'Counter WHILE:', lv_counter.
  lv_counter = lv_counter + 1.
ENDWHILE.
```

### Output

```text
--- Perulangan DO (5 kali) ---
Iterasi DO ke-          1
Iterasi DO ke-          2
Iterasi DO ke-          3
Iterasi DO ke-          4
Iterasi DO ke-          5
--- Perulangan WHILE dengan EXIT & CONTINUE ---
Counter WHILE:          1
Counter WHILE:          2
Counter WHILE:          3
Counter WHILE:          5
Counter WHILE:          6
Berhenti di angka:          7
```

---

## 11. 🟢 Input Pengguna Interaktif (PARAMETERS)

### Konsep

Layar input antarmuka pengguna pada program ABAP dibentuk secara otomatis menggunakan deklarasi `PARAMETERS`. Layar ini dinamakan **Selection Screen**.

### Opsi Parameter Esensial

* `DEFAULT <val>`: Menetapkan nilai bawaan di kolom input.
* `OBLIGATORY`: Menandai kolom tersebut wajib diisi oleh pengguna (layar akan menampilkan tanda centang merah).
* `AS CHECKBOX`: Menampilkan input berupa kotak centang (berisi `'X'` jika dicentang, atau spasi jika tidak).
* `RADIOBUTTON GROUP <grp>`: Menampilkan pilihan radio button eksklusif.

### Contoh Program Input Pengguna

```abap
REPORT z_selection_screen.

" Definisi parameter input di Selection Screen
PARAMETERS: p_nama  TYPE string DEFAULT 'Budi Santoso' OBLIGATORY,
            p_umur  TYPE i DEFAULT 25,
            p_vip   AS CHECKBOX DEFAULT 'X',
            p_rb1   RADIOBUTTON GROUP grp1 DEFAULT 'X',
            p_rb2   RADIOBUTTON GROUP grp1.

START-OF-SELECTION.
  WRITE: / '=== DATA PENGGUNA TERDAFTAR ===',
         / 'Nama        :', p_nama,
         / 'Umur        :', p_umur, 'tahun'.

  IF p_vip = 'X'.
    WRITE: / 'Tipe Akun   : Pelanggan VIP'.
  ELSE.
    WRITE: / 'Tipe Akun   : Pelanggan Reguler'.
  ENDIF.

  IF p_rb1 = 'X'.
    WRITE: / 'Metode Bayar: Transfer Bank'.
  ELSE.
    WRITE: / 'Metode Bayar: Kartu Kredit'.
  ENDIF.
```

### Tampilan di Selection Screen

```text
┌────────────────────────────────────────────────────────┐
│ Selection Screen Program Z_SELECTION_SCREEN            │
├────────────────────────────────────────────────────────┤
│ Nama          [ Budi Santoso                 ] [?]     │
│ Umur          [ 25         ]                           │
│ Tipe VIP      [X]                                      │
│                                                        │
│ (•) Transfer Bank                                      │
│ ( ) Kartu Kredit                                       │
└────────────────────────────────────────────────────────┘
```

---

## 12. 🟢 Manipulasi String Klasik & Modern

### Konsep

Pengolahan teks dalam ABAP dapat dilakukan dengan perintah klasik atau ekspresi modern:

### 1. Perintah Klasik: `CONCATENATE`, `SPLIT`, `CONDENSE`

```abap
REPORT z_string_klasik.

DATA: lv_depan   TYPE string VALUE 'John',
      lv_belakang TYPE string VALUE 'Doe',
      lv_lengkap TYPE string,
      lv_alamat  TYPE string VALUE '  Jalan  Sudirman   No  45   ',
      lv_csv     TYPE string VALUE 'INV-001;20260930;LUNAS',
      lv_no_inv  TYPE string,
      lv_tgl     TYPE string,
      lv_status  TYPE string.

CONCATENATE lv_depan lv_belakang INTO lv_lengkap SEPARATED BY space.
CONDENSE lv_alamat.
SPLIT lv_csv AT ';' INTO lv_no_inv lv_tgl lv_status.

WRITE: / 'Nama Lengkap :', lv_lengkap,
       / 'Alamat Rapi  :', lv_alamat,
       / 'No Faktur    :', lv_no_inv,
       / 'Tanggal      :', lv_tgl,
       / 'Status       :', lv_status.
```

### 2. Pendekatan Modern: String Templates `|...|` (ABAP 7.40+)

```abap
REPORT z_string_modern.

DATA: lv_nama   TYPE string VALUE 'Siti Aminah',
      lv_saldo  TYPE p DECIMALS 2 VALUE '1500000.75',
      lv_pesan  TYPE string.

lv_pesan = |Halo { lv_nama }, saldo rekening Anda adalah Rp { lv_saldo NUMBER = USER }.|.

WRITE: / lv_pesan.
```

### Output

```text
Halo Siti Aminah, saldo rekening Anda adalah Rp 1.500.000,75.
```

---

## 13. 🟢 System Variables Esensial (Struktur SYST)

### Konsep

ABAP menyediakan struktur global bawaan bernama **`SYST`** (dapat diakses langsung menggunakan alias **`sy`**) yang menyimpan data konteks lingkungan runtime sistem saat program dieksekusi.

### Tabel System Variables Paling Populer

| Variabel | Tipe | Deskripsi | Skenario Penggunaan |
| :--- | :--- | :--- | :--- |
| **`sy-subrc`** | `I` | Return Code dari operasi terakhir. `0` artinya sukses penuh. | Pengecekan setelah query database `SELECT`, pembacaan internal table `READ TABLE`, atau pemanggilan fungsi. |
| **`sy-datum`** | `D` | Tanggal sistem server saat ini (`YYYYMMDD`). | Mencatat tanggal cetak laporan atau tanggal pembuatan dokumen transaksi. |
| **`sy-uzeit`** | `T` | Waktu sistem server saat ini (`HHMMSS`). | Mencatat timestamp transaksi. |
| **`sy-uname`** | `C` | Username akun SAP yang sedang login. | Audit trail: siapa yang mencetak atau memproses dokumen. |
| **`sy-mandt`** | `C` | Nomor Client/Mandant saat ini (contoh: `'100'`). | Verifikasi isolasi client. |
| **`sy-tabix`** | `I` | Indeks baris saat ini pada Internal Table. | Nomor urut data di dalam perulangan `LOOP AT`. |
| **`sy-index`** | `I` | Nomor iterasi saat ini pada perulangan `DO` / `WHILE`. | Kontrol perulangan aritmatika. |
| **`sy-tcode`** | `C` | T-Code yang sedang dijalankan saat ini. | Pengecekan otorisasi layar. |

### Best Practice

- Selalu evaluasi nilai `sy-subrc` **langsung pada baris berikutnya** setelah mengeksekusi perintah pencarian, pemanggilan fungsi, atau query database. Memanggil perintah lain sebelum mengecek `sy-subrc` akan menimpa nilai return code tersebut.

---

## 14. 🟢 Subroutines Dasar (FORM & PERFORM)

### Konsep

**Subroutine** adalah unit modularisasi prosedural klasik di ABAP untuk memecah program panjang menjadi blok-blok fungsi yang terpisah.
* Dipanggil menggunakan keyword `PERFORM`.
* Blok implementasi didefinisikan dengan pasangan `FORM ... ENDFORM`.
* Parameter input dikirim via `USING`, parameter output via `CHANGING`.

### Contoh Program Subroutine

```abap
REPORT z_subroutine_demo.

DATA: lv_subtotal TYPE p DECIMALS 2 VALUE '500000',
      lv_tipe_pel TYPE c LENGTH 3  VALUE 'VIP',
      lv_diskon   TYPE p DECIMALS 2,
      lv_total    TYPE p DECIMALS 2.

PERFORM hitung_diskon USING    lv_subtotal
                               lv_tipe_pel
                      CHANGING lv_diskon
                               lv_total.

WRITE: / 'Subtotal Pembelian :', lv_subtotal,
       / 'Potongan Diskon    :', lv_diskon,
       / 'Total Akhir Bayar  :', lv_total.

*&---------------------------------------------------------------------*
*& Form hitung_diskon
*&---------------------------------------------------------------------*
FORM hitung_diskon USING    iv_subtotal TYPE p
                            iv_tipe     TYPE c
                   CHANGING ev_diskon   TYPE p
                            ev_total    TYPE p.

  IF iv_tipe = 'VIP'.
    ev_diskon = iv_subtotal * '0.15'.
  ELSE.
    ev_diskon = iv_subtotal * '0.05'.
  ENDIF.

  ev_total = iv_subtotal - ev_diskon.

ENDFORM.
```

### Output

```text
Subtotal Pembelian :         500.000,00
Potongan Diskon    :          75.000,00
Total Akhir Bayar  :         425.000,00
```

---

## 15. 🟡 Pengenalan Fitur Modern ABAP 7.40+

### Konsep

Mulai versi SAP NetWeaver 7.40, ABAP memperkenalkan sintaks ekspresi modern yang secara drastis mengurangi *boilerplate code*.

### 1. Deklarasi Sebaris (*Inline Declaration* `DATA(...)`)

```abap
" Cara Modern 7.40+:
DATA(lv_teks_modern) = 'Halo Dunia'.
DATA(lv_panjang)     = strlen( lv_teks_modern ).
```

### 2. Operator Kondisional `COND #( ... )`

```abap
DATA lv_poin TYPE i VALUE 80.

DATA(lv_kategori) = COND string(
  WHEN lv_poin >= 85 THEN 'Gold'
  WHEN lv_poin >= 70 THEN 'Silver'
  ELSE 'Bronze'
).

WRITE: / 'Kategori Member:', lv_kategori.
```

---

## 16. 🟡 Debugging Dasar & Analisis Error (ST22)

### Konsep

Jika terjadi kegagalan logika fatal saat runtime, sistem SAP akan memicu **Runtime Error (Short Dump)** dan mencatatnya di T-Code `ST22`.

```text
Nama Dump Populer:
1. COMPUTE_INT_ZERODIVIDE → Pembagian bilangan dengan nol (x / 0).
2. CONVT_NO_NUMBER        → Konversi teks non-angka ke variabel numerik.
3. DATA_OFFSET_LENGTH_TOO_LARGE → Substring offset melampaui panjang string.
4. TIME_OUT               → Waktu eksekusi dialog melampaui batas maksimal server.
```

### Navigasi Tombol ABAP Debugger

* **F5 (Single Step)**: Menjalankan satu baris instruksi dan masuk ke dalam blok method/subroutine.
* **F6 (Execute)**: Menjalankan satu baris instruksi tanpa masuk ke dalam method/subroutine.
* **F7 (Return)**: Keluar dari subroutine/method saat ini kembali ke pemanggil.
* **F8 (Continue)**: Melanjutkan eksekusi hingga breakpoint berikutnya atau selesai.

---

## 17. 🛠️ Mini Project: Kalkulator Faktur Penjualan

### Tujuan

Membangun program laporan executable interaktif (`ZREP_SALES_INVOICE`) untuk mencetak ringkasan faktur penjualan resmi dengan kalkulasi diskon bertingkat dan perhitungan PPN 11% secara otomatis.

### Fitur

1. Layar input interaktif Selection Screen untuk nomor faktur, nama pelanggan, kuantitas, harga satuan, dan status member (Reguler vs VIP).
2. Validasi input: memastikan nilai kuantitas dan harga satuan bernilai lebih dari nol.
3. Kalkulasi diskon: diskon 10% untuk pelanggan VIP, 0% untuk reguler.
4. Perhitungan otomatis DPP (Dasar Pengenaan Pajak) dan PPN 11%.
5. Cetak laporan tabular rapi ke layar Basic List SAP GUI lengkap dengan informasi audit server (`sy-datum`, `sy-uname`).

### Konsep yang Digunakan

* Deklarasi `PARAMETERS` dengan opsi `OBLIGATORY` dan `RADIOBUTTON GROUP`.
* Deklarasi tipe kustom menggunakan `TYPES`.
* Konstanta tarif pajak PPN (`CONSTANTS`).
* Pemanggilan subroutine modular (`PERFORM` & `FORM`) menggunakan parameter `USING` dan `CHANGING`.
* Pengecekan system variables audit (`sy-datum`, `sy-uname`).
* Format pencetakan garis dan kolom teks `WRITE: / sy-uline(...)`.

### Langkah Implementasi

1. **Definisikan Tipe Data & Konstanta**: Siapkan alias tipe data mata uang `ty_rupiah` bertipe `P DECIMALS 2` dan konstanta PPN 11%.
2. **Desain Selection Screen**: Buat dua blok layar (`SELECTION-SCREEN BEGIN OF BLOCK`) untuk data transaksi dan pilihan kategori pelanggan.
3. **Validasi Input**: Periksa kuantitas dan harga di event `START-OF-SELECTION`.
4. **Buat Subroutine Kalkulasi**: Hitung subtotal kotor, potongan diskon, DPP, PPN, dan grand total.
5. **Buat Subroutine Cetak**: Tampilkan hasil hitungan dalam format invoice tabular terpusat.

### Kode Lengkap Program

```abap
*&---------------------------------------------------------------------*
*& Report ZREP_SALES_INVOICE
*&---------------------------------------------------------------------*
*& Mini Project: Kalkulator Faktur Penjualan Sederhana
*&---------------------------------------------------------------------*
REPORT zrep_sales_invoice LINE-SIZE 80.

*----------------------------------------------------------------------*
* 1. Definisi Tipe Data & Konstanta
*----------------------------------------------------------------------*
TYPES: ty_rupiah TYPE p LENGTH 9 DECIMALS 2,
       ty_persen TYPE p LENGTH 3 DECIMALS 2.

CONSTANTS: gc_ppn_rate TYPE ty_persen VALUE '0.11'. " PPN 11%

*----------------------------------------------------------------------*
* 2. Layar Input (Selection Screen)
*----------------------------------------------------------------------*
SELECTION-SCREEN BEGIN OF BLOCK b1 WITH FRAME TITLE TEXT-001.
  PARAMETERS: p_inv    TYPE c LENGTH 10 DEFAULT 'INV-2026-1' OBLIGATORY,
              p_cust   TYPE string      DEFAULT 'PT Maju Bersama' OBLIGATORY,
              p_qty    TYPE i           DEFAULT 5 OBLIGATORY,
              p_price  TYPE ty_rupiah   DEFAULT '250000.00' OBLIGATORY.
SELECTION-SCREEN END OF BLOCK b1.

SELECTION-SCREEN BEGIN OF BLOCK b2 WITH FRAME TITLE TEXT-002.
  PARAMETERS: p_reg RADIOBUTTON GROUP grp1 DEFAULT 'X',
              p_vip RADIOBUTTON GROUP grp1.
SELECTION-SCREEN END OF BLOCK b2.

*----------------------------------------------------------------------*
* 3. Event Utama Eksekusi
*----------------------------------------------------------------------*
START-OF-SELECTION.

  DATA: lv_subtotal TYPE ty_rupiah,
        lv_diskon   TYPE ty_rupiah,
        lv_dpp      TYPE ty_rupiah,
        lv_ppn      TYPE ty_rupiah,
        lv_grandtot TYPE ty_rupiah,
        lv_tipe_str TYPE string.

  " 1. Validasi input dasar
  IF p_qty <= 0 OR p_price <= 0.
    WRITE: / 'Error: Kuantitas dan Harga Satuan wajib lebih dari 0!'.
    STOP.
  ENDIF.

  " 2. Menentukan tipe pelanggan
  IF p_vip = 'X'.
    lv_tipe_str = 'VIP (Diskon 10%)'.
  ELSE.
    lv_tipe_str = 'Reguler (Diskon 0%)'.
  ENDIF.

  " 3. Hitung kalkulasi melalui Subroutine
  PERFORM kalkulasi_faktur USING    p_qty
                                    p_price
                                    p_vip
                           CHANGING lv_subtotal
                                    lv_diskon
                                    lv_dpp
                                    lv_ppn
                                    lv_grandtot.

  " 4. Cetak Faktur ke Layar Output
  PERFORM cetak_faktur USING lv_tipe_str
                             lv_subtotal
                             lv_diskon
                             lv_dpp
                             lv_ppn
                             lv_grandtot.

*----------------------------------------------------------------------*
* 4. Subroutines (Modularisasi Logika)
*----------------------------------------------------------------------*
FORM kalkulasi_faktur USING    iv_qty      TYPE i
                               iv_price    TYPE ty_rupiah
                               iv_vip      TYPE c
                      CHANGING ev_subtotal TYPE ty_rupiah
                               ev_diskon   TYPE ty_rupiah
                               ev_dpp      TYPE ty_rupiah
                               ev_ppn      TYPE ty_rupiah
                               ev_grandtot TYPE ty_rupiah.

  ev_subtotal = iv_qty * iv_price.

  IF iv_vip = 'X'.
    ev_diskon = ev_subtotal * '0.10'.
  ELSE.
    ev_diskon = 0.
  ENDIF.

  ev_dpp      = ev_subtotal - ev_diskon.
  ev_ppn      = ev_dpp * gc_ppn_rate.
  ev_grandtot = ev_dpp + ev_ppn.

ENDFORM.

FORM cetak_faktur USING iv_tipe     TYPE string
                        iv_subtotal TYPE ty_rupiah
                        iv_diskon   TYPE ty_rupiah
                        iv_dpp      TYPE ty_rupiah
                        iv_ppn      TYPE ty_rupiah
                        iv_grandtot TYPE ty_rupiah.

  WRITE: / sy-uline(70).
  WRITE: / '|', (66) 'FAKTUR PENJUALAN RESMI (SALES INVOICE)' CENTERED, '|'.
  WRITE: / sy-uline(70).
  WRITE: / '| No. Faktur    :', (18) p_inv, (15) 'Tanggal Cetak :', (10) sy-datum, (7) ' ', '|',
         / '| Pelanggan     :', (18) p_cust, (15) 'Dicetak Oleh  :', (10) sy-uname, (7) ' ', '|',
         / '| Kategori      :', (48) iv_tipe, '|'.
  WRITE: / sy-uline(70).
  WRITE: / '| Rincian Barang:', (51) ' ', '|',
         / '| - Kuantitas   :', (12) p_qty, 'Unit', (34) ' ', '|',
         / '| - Harga Satuan:', (18) p_price, (32) ' ', '|'.
  WRITE: / sy-uline(70).
  WRITE: / '| Subtotal Kotor               : Rp', (18) iv_subtotal, (16) ' ', '|',
         / '| Potongan Diskon              : Rp', (18) iv_diskon,   (16) ' ', '|',
         / '| DPP (Dasar Pengenaan Pajak)  : Rp', (18) iv_dpp,      (16) ' ', '|',
         / '| PPN (11%)                    : Rp', (18) iv_ppn,      (16) ' ', '|'.
  WRITE: / sy-uline(70).
  WRITE: / '| GRAND TOTAL DIBAYAR          : Rp', (18) iv_grandtot, (16) ' ', '|'.
  WRITE: / sy-uline(70).

ENDFORM.
```

### Hasil Akhir

```text
----------------------------------------------------------------------
|               FAKTUR PENJUALAN RESMI (SALES INVOICE)               |
----------------------------------------------------------------------
| No. Faktur    : INV-2026-1           Tanggal Cetak : 30.09.2026    |
| Pelanggan     : PT Maju Bersama      Dicetak Oleh  : ALIMUR        |
| Kategori      : VIP (Diskon 10%)                                   |
----------------------------------------------------------------------
| Rincian Barang:                                                    |
| - Kuantitas   :           5 Unit                                   |
| - Harga Satuan:         250.000,00                                 |
----------------------------------------------------------------------
| Subtotal Kotor               : Rp       1.250.000,00               |
| Potongan Diskon              : Rp         125.000,00               |
| DPP (Dasar Pengenaan Pajak)  : Rp       1.125.000,00               |
| PPN (11%)                    : Rp         123.750,00               |
----------------------------------------------------------------------
| GRAND TOTAL DIBAYAR          : Rp       1.248.750,00               |
----------------------------------------------------------------------
```

---

## 18. 📚 Ringkasan & Peta Ingatan

### Peta Konsep ABAP Dasar

```text
ABAP Dasar
├── 1. Arsitektur
│   ├── 3-Tier (Presentation → Application AS ABAP → Database)
│   ├── Client / Mandant (Data terisolasi per nomor client)
│   └── Customer Namespace (Wajib awalan Z atau Y)
├── 2. Sintaksis & Tipe Data
│   ├── Complete Types (I, F, D, T, STRING)
│   ├── Incomplete Types (C, N, P dengan panjang LENGTH & DECIMALS)
│   └── Chained Statement (DATA: ..., ...)
├── 3. Kontrol Alur
│   ├── Percabangan (IF-ELSEIF-ELSE, CASE-WHEN)
│   └── Perulangan (DO n TIMES, WHILE condition, EXIT, CONTINUE)
├── 4. Interaktivitas & Sistem
│   ├── PARAMETERS (Layar input interaktif)
│   ├── SYST Variables (sy-subrc, sy-datum, sy-uname, sy-index)
│   └── Subroutine (PERFORM & FORM)
└── 5. Modern ABAP (7.40+)
    ├── Inline Declarations DATA(...)
    └── String Templates |Halo { lv_nama }|
```

---

## 19. 📚 Cheat Code ABAP 10 Detik

```text
REPORT z_nama.           → Judul wajib program executable report
DATA lv_val TYPE i.      → Mendeklarasikan variabel lokal integer
CONSTANTS lc_pi TYPE p.  → Mendeklarasikan nilai tetap tidak dapat diubah
WRITE: / 'Teks'.         → Menulis output di baris baru pada Basic List
PARAMETERS p_inp TYPE c. → Membuat kolom isian input di Selection Screen
IF ... ELSEIF ... ENDIF. → Percabangan logika kondisional
CASE ... WHEN ... ENDCASE→ Pencocokan nilai eksak
DO 5 TIMES ... ENDDO.    → Perulangan sebanyak 5 putaran
sy-subrc = 0             → Hasil evaluasi instruksi terakhir berhasil tanpa error
sy-datum                 → Mengambil tanggal sistem server saat ini (YYYYMMDD)
|Teks { lv_val }|        → Merangkai string modern tanpa CONCATENATE (ABAP 7.40+)
```

---

## 20. 🧭 Urutan Belajar Selanjutnya

Setelah memahami sintaks dasar bahasa ABAP, alur pembelajaran berikutnya:

```text
1. 🟢 ABAP Dasar (Selesai pada modul ini)
      │
      ▼
2. 🟢 ABAP Data Dictionary (DDIC)
   → Pelajari cara mendesain tabel database, data element, domain, dan search help di T-Code SE11.
      │
      ▼
3. 🟢 ABAP Internal Tables
   → Pelajari struktur data array dinamis di memori (Standard, Sorted, Hashed Table) dan manipulasi LOOP AT.
      │
      ▼
4. 🟡 ABAP Database & Open SQL
   → Pelajari cara membaca dan menyimpan data ke tabel database menggunakan query SELECT modern.
      │
      ▼
5. 🟡 ABAP Reports & ALV Grid
   → Pelajari visualisasi data tabel interaktif menggunakan CL_SALV_TABLE.
```

Lanjutkan ke modul berikutnya: [[abap-dictionary|ABAP Data Dictionary (DDIC)]] (Modul 2).

---

## 21. 🔗 Referensi Resmi

* [SAP Help Portal — ABAP Programming (BC-ABA)](https://help.sap.com/)
* [ABAP Keyword Documentation (Official Syntax Reference)](https://help.sap.com/doc/abapdocu_latest_index_htm/latest/en-US/index.htm)
* [openSAP — Modern ABAP Development on SAP S/4HANA](https://open.sap.com/)
