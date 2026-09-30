---
title: "ABAP Debugging & Performance Tuning"
description: "Panduan lengkap diagnostik, investigasi crash, dan optimasi performa di SAP ABAP: New ABAP Debugger, Watchpoints, analisis Short Dump (ST22), SQL Trace (ST05), dan Runtime Profiling (SAT)."
order: 9
tags:
  - programming
  - abap
  - sap
  - debugging
  - performance
  - advanced
---

# ABAP Debugging & Performance Tuning

> **Target:** Advanced ABAP Developer yang ingin menguasai teknik diagnostik mendalam, investigasi crash dump sistem, penelusuran alur eksekusi, serta optimasi performa program berskala enterprise.
> **Versi:** SAP NetWeaver AS ABAP 7.40+ / 7.50+ & SAP S/4HANA (T-Code `ST22`, New ABAP Debugger, `ST05`, `SAT`).
> **Prasyarat:** Telah memahami [[abap-internal-tables|ABAP Internal Tables]], [[abap-database|ABAP Database & Open SQL]], dan [[abap-oop|ABAP Objects (OOP)]].

---

## Gambaran Umum

Menulis kode program yang berjalan benar hanyalah separuh dari tugas seorang software engineer enterprise. Separuh tugas lainnya yang jauh lebih krusial adalah memastikan program tersebut **andal, tidak pernah memicu crash fatal, dan berjalan dengan efisiensi performa tinggi** saat memproses jutaan data transaksi secara serentak.

Sistem SAP menyediakan rangkaian perangkat diagnostik berstandar industri kelas dunia. Dengan menguasai **New ABAP Debugger**, analisis crash **`ST22`**, pemantauan query database **`ST05`**, serta profiling CPU **`SAT`**, Anda dapat membongkar masalah tersembunyi (*bottleneck*), melacak bug logika hingga ke level variabel memori, dan mengoptimalkan kecepatan program hingga puluhan kali lipat.

---

## Cara Belajar

```text
🟢 Fundamental
→ Pahami New ABAP Debugger (Breakpoints, Watchpoints, navigasi tombol), perintah /h, dan cara membaca Short Dump di ST22.

🟡 Lanjutan
→ Kuasai SQL Trace (ST05) untuk menemukan Table Scan dan Runtime Profiling (SAT) untuk mengukur distribusi waktu CPU vs Database.

🛠️ Praktik
→ Bangun mini project investigasi dan refactoring program lambat akibat query N+1 di dalam loop menjadi kode batch berkecepatan tinggi.
```

Mental model alur diagnostik pemecahan masalah di sistem SAP:

```text
       Gejala Masalah Terjadi di Sistem
       ┌────────────────────────────────────────────────────────┐
       │ 1. Program berhenti tiba-tiba dengan layar merah dump  │
       │    ──> Buka T-Code ST22 (Analisis Baris Crash & Error) │
       │                                                        │
       │ 2. Program menghasilkan kalkulasi data yang keliru     │
       │    ──> Gunakan New ABAP Debugger (Breakpoints/Watch)   │
       │                                                        │
       │ 3. Program berjalan lambat (Jam pasir berputar lama)   │
       │    ──> Buka T-Code ST05 (Cek Index & Waktu Eksekusi DB)│
       │    ──> Buka T-Code SAT  (Cek % CPU ABAP vs % Database) │
       └────────────────────────────────────────────────────────┘
```

**Hafalan:**

```text
ST22           → T-Code ABAP Runtime Errors: repositori pencatatan seluruh crash dump sistem
/h             → Perintah ajaib di Command Box untuk mengaktifkan debugger pada layar mana pun
Watchpoint     → Titik henti debugger yang otomatis aktif saat isi variabel tertentu berubah
ST05           → T-Code Performance Trace: menganalisis query Native SQL dan indeks database
SAT            → T-Code Runtime Analysis: mengukur durasi konsumsi waktu eksekusi kode ABAP
JDBG           → Perintah debugger khusus untuk menelusuri Background Job di T-Code SM37
Table Scan     → Pembacaan seluruh isi tabel fisik database tanpa indeks (Penyebab utama lemot)
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Navigasi Tingkat Lanjut New ABAP Debugger](#1--navigasi-tingkat-lanjut-new-abap-debugger)
2. [Jenis-Jenis Breakpoint (Session, User, External)](#2--jenis-jenis-breakpoint-session-user-external)
3. [Watchpoints: Menghentikan Program Saat Nilai Berubah](#3--watchpoints-menghentikan-program-saat-nilai-berubah)
4. [Trik Debugging: Perintah /h & Background Job (JDBG)](#4--trik-debugging-perintah-h--background-job-jdbg)
5. [Investigasi Runtime Crash / Short Dump (T-Code ST22)](#5--investigasi-runtime-crash--short-dump-t-code-st22)
6. [Top 5 Short Dump Paling Sering di Sistem Produksi](#6--top-5-short-dump-paling-sering-di-sistem-produksi)

### 🟡 Lanjutan

7. [Analisis Query Database dengan SQL Trace (T-Code ST05)](#7--analisis-query-database-dengan-sql-trace-t-code-st05)
8. [Mendeteksi Table Scan vs Index Scan di ST05](#8--mendeteksi-table-scan-vs-index-scan-di-st05)
9. [Runtime Profiling & Identifikasi Bottleneck (T-Code SAT)](#9--runtime-profiling--identifikasi-bottleneck-t-code-sat)
10. [Strategi Refactoring Kode Lambat (N+1 Query Problem)](#10--strategi-refactoring-kode-lambat-n1-query-problem)

### 🛠️ Praktik

11. [Mini Project: Investigasi & Refactoring Kasus Nyata Program Lambat](#11-️-mini-project-investigasi--refactoring-kasus-nyata-program-lambat)

### 📚 Ringkasan & Referensi

12. [Peta Ingatan & Ringkasan](#12--peta-ingatan--ringkasan)
13. [Cheat Code Diagnostik 10 Detik](#13--cheat-code-diagnostik-10-detik)
14. [Urutan Belajar Selanjutnya](#14--urutan-belajar-selanjutnya)
15. [Referensi Resmi](#15--referensi-resmi)

---

## 1. 🟢 Navigasi Tingkat Lanjut New ABAP Debugger

### Konsep

Ketika breakpoint terpicu, layar SAP GUI beralih ke antarmuka **New ABAP Debugger**.

### Tombol Fungsi Navigasi Utama

| Tombol Keyboard | Nama Operasi | Fungsi |
| :---: | :--- | :--- |
| **`F5`** | *Single Step* | Menjalankan tepat satu baris instruksi saat ini. Jika baris tersebut memanggil Subroutine, Function Module, atau Method, kursor debugger akan **masuk ke dalam** kode fungsi tersebut. |
| **`F6`** | *Execute* | Menjalankan instruksi saat ini sebagai satu kesatuan utuh **tanpa masuk** ke dalam implementasi fungsi. |
| **`F7`** | *Return* | Menyelesaikan sisa eksekusi fungsi/method saat ini seketika dan langsung melompat kembali ke program pemanggil. |
| **`F8`** | *Continue* | Melanjutkan eksekusi program dengan kecepatan normal hingga menemui breakpoint berikutnya atau selesai. |
| **`Shift + F8`** | *Run to Cursor* | Melompati eksekusi hingga mencapai baris posisi kursor mouse saat ini. |

> [!TIP]
> **Mengubah Nilai Variabel On-The-Fly:** Di panel tab *Variables*, Anda dapat mengubah isi nilai variabel mana pun secara langsung saat program sedang berhenti di debugger, lalu klik tombol pensil/simpan. Fitur ini sangat bermanfaat untuk mensimulasikan skenario *edge-case* tanpa perlu mengubah kode program!

---

## 2. 🟢 Jenis-Jenis Breakpoint (Session, User, External)

### Konsep

1. **Session Breakpoint**: Hanya aktif untuk sesi logon SAP GUI Anda saat ini. Otomatis terhapus saat Anda menutup window/logoff.
2. **User Breakpoint**: Aktif untuk seluruh sesi akun user Anda di server bersangkutan (bertahan hingga 2 jam).
3. **External Breakpoint**: **Wajib digunakan** jika Anda mendebug program yang dipicu melalui antarmuka eksternal (seperti Web App, SAP Fiori, OData Service, atau pemanggilan RFC dari sistem luar).

---

## 3. 🟢 Watchpoints: Menghentikan Program Saat Nilai Berubah

### Konsep

Bayangkan Anda memiliki internal table dengan 10.000 baris record, dan sebuah bug aneh terjadi hanya saat ID pelanggan bernilai `'CUST-8888'`. Jika Anda menggunakan tombol F5/F6 secara manual, Anda harus menekan tombol tersebut ribuan kali!

Solusinya adalah menggunakan **Watchpoint**:
1. Saat berada di debugger, klik tab **Breakp./Watchpoints**.
2. Klik tombol **Create Watchpoint**.
3. Masukkan nama variabel (contoh: `ls_cust-client_id`).
4. Masukkan kondisi logika (contoh: `ls_cust-client_id = 'CUST-8888'`).
5. Tekan **F8 (Continue)**.
6. Program akan melaju dengan kecepatan penuh dan **secara otomatis berhenti mendadak** tepat pada milidetik ketika nilai variabel tersebut berubah menjadi `'CUST-8888'`!

---

## 4. 🟢 Trik Debugging: Perintah /h & Background Job (JDBG)

### Konsep

### 1. Perintah `/h` untuk Layar Dialog Terkunci

Jika ada jendela pop-up dialog yang tidak menyediakan opsi breakpoint langsung:
* Ketikkan perintah **/h** di kotak perintah T-Code kiri atas, lalu tekan tombol **Enter**.
* Layar akan memunculkan pesan status di bawah: *"Debugging switched on"*.
* Lakukan tindakan berikutnya (misal: klik tombol OK di pop-up). Debugger akan langsung terbuka seketika!

### 2. Debugging Background Job (Perintah `JDBG`)

Bagaimana cara mendebug program batch yang hanya berjalan di latar belakang (*Background Job*)?
1. Buka T-Code **`SM37`** (*Simple Job Selection*).
2. Cari job Anda yang berstatus *Finished* atau *Canceled*.
3. Letakkan kursor pada baris job tersebut.
4. Ketikkan perintah **`JDBG`** di kotak perintah T-Code lalu tekan **Enter**.
5. Sistem akan mereproduksi jalannya job tersebut di dalam lingkungan Dialog Debugger interaktif baris per baris!

---

## 5. 🟢 Investigasi Runtime Crash / Short Dump (T-Code ST22)

### Konsep

Ketika program mengalami kegagalan fatal yang tidak tertangani, sistem membekukan transaksi dan mencatat laporan forensik lengkap di T-Code **`ST22`** (*ABAP Runtime Errors*).

### Anatomi Laporan Forensik ST22

```text
Layar Laporan ST22:
├── 1. What happened?            → Ringkasan insiden (contoh: Division by zero)
├── 2. Error analysis           → Penjelasan teknis rinci mekanisme crash
├── 3. How to correct the error → Solusi rekomendasi SAP untuk memperbaiki kode
├── 4. Source Code Extract      → Potongan kode tempat program crash (Tanda >>>)
│      145   DATA lv_hasil TYPE i.
│  >>> 146   lv_hasil = lv_total / lv_pembagi.
│      147   WRITE: / lv_hasil.
│
└── 5. Contents of system fields→ Rekaman nilai sy-subrc, sy-uname, sy-tabix saat crash
```

---

## 6. 🟢 Top 5 Short Dump Paling Sering di Sistem Produksi

| Nama Short Dump | Penyebab Utama | Solusi Perbaikan |
| :--- | :--- | :--- |
| **`COMPUTE_INT_ZERODIVIDE`** | Pembagian angka dengan nilai nol (`x / 0`). | Selalu validasi `IF lv_pembagi <> 0` sebelum operasi hitung. |
| **`CONVT_NO_NUMBER`** | Teks alfanumerik dipaksa masuk ke variabel tipe angka. | Validasi teks input hanya berisi digit sebelum konversi. |
| **`TABLE_INVALID_INDEX`** | Mengakses indeks tabel yang tidak ada (`INDEX 0` atau melampaui `lines()`). | Periksa keberadaan indeks atau gunakan `OPTIONAL`. |
| **`TIME_OUT`** | Eksekusi dialog melebihi batas waktu maksimal CPU server (biasanya 600–1200 detik). | Pecah logika ke Background Job (`SM36`) atau optimalkan query SQL. |
| **`TSV_TNEW_PAGE_ALLOC_FAILED`** | Server kehabisan alokasi RAM karena query menarik jutaan baris tanpa filter. | Batasi query dengan `UP TO n ROWS` dan perketat klausa `WHERE`. |

---

## 7. 🟡 Analisis Query Database dengan SQL Trace (T-Code ST05)

### Konsep

T-Code **`ST05`** adalah alat investigasi utama untuk memantau waktu respons query database secara real-time.

### Langkah Penggunaan ST05

1. Buka T-Code `ST05`.
2. Pada panel *Trace Type*, centang **SQL Trace**.
3. Klik tombol **Activate Trace**.
4. Di window sesi terpisah, jalankan program atau transaksi Anda.
5. Kembali ke window `ST05`, klik **Deactivate Trace**.
6. Klik **Display Trace** untuk melihat daftar seluruh query database yang dieksekusi.

---

## 8. 🟡 Mendeteksi Table Scan vs Index Scan di ST05

### Konsep

Pada laporan hasil rekaman `ST05`, perhatikan kolom **Execution Plan** dan **Duration**:

```text
Tanda Bahaya Kinerja di ST05:
1. TABLE ACCESS FULL (Table Scan):
   → Database membaca seluruh blok disk dari awal sampai akhir karena tidak ada indeks
     yang cocok dengan klausa WHERE. Sangat lambat jika tabel memiliki jutaan baris!

2. INDEX UNIQUE SCAN / INDEX RANGE SCAN:
   → Query memanfaatkan indeks database dengan optimal. Sangat cepat (hitungan milidetik).
```

Jika query Anda menghasilkan `TABLE ACCESS FULL`, tambahkan kolom Primary Key pada klausa `WHERE` atau buatkan **Secondary Index** baru pada tabel di `SE11`.

---

## 9. 🟡 Runtime Profiling & Identifikasi Bottleneck (T-Code SAT)

### Konsep

T-Code **`SAT`** (atau `SE30` pada sistem klasik) digunakan untuk mengukur di mana waktu program Anda paling banyak terkuras.

Hasil analisis `SAT` menampilkan rasio konsumsi waktu:

```text
Distribusi Waktu Eksekusi:
├── ABAP Time     : 12%  (Logika internal kode program)
├── Database Time : 85%  (Waktu menunggu jawaban query database) <-- BOTTLENECK UTAMA!
└── System Time   : 3%   (Overhead komunikasi kernel)
```

Jika *Database Time* mendominasi di atas 70%, fokus perbaikan utama Anda adalah mengoptimalkan query database, bukan memusingkan perulangan kode ABAP.

---

## 10. 🟡 Strategi Refactoring Kode Lambat (N+1 Query Problem)

### Masalah N+1 Query

Penyebab nomor satu program SAP berjalan lambat adalah query database yang diletakkan di dalam perulangan `LOOP AT`:

```abap
" KODE BURUK (N+1 Query Problem - Sangat Lambat!):
" Jika lt_header berisi 10.000 pesanan, database dipanggil 10.001 kali!
LOOP AT lt_header INTO DATA(ls_header).
  SELECT * FROM vbap
    WHERE vbeln = @ls_header-vbeln
    INTO TABLE @DATA(lt_items). " <-- Membebani koneksi jaringan database berulang kali!
ENDLOOP.
```

### Solusi Optimal: Array Fetch dengan FOR ALL ENTRIES

Tarik seluruh rincian data sekaligus dalam **satu panggilan jaringan tunggal**:

```abap
" KODE OPTIMAL (Array Fetch - 100x Lebih Cepat!):
IF lt_header IS NOT INITIAL.
  SELECT vbeln, posnr, matnr, netwr
    FROM vbap
    FOR ALL ENTRIES IN @lt_header
    WHERE vbeln = @lt_header-vbeln
    INTO TABLE @DATA(lt_all_items).
ENDIF.

" Baca di dalam loop menggunakan memori RAM yang sangat cepat:
SORT lt_all_items BY vbeln.
LOOP AT lt_header INTO DATA(ls_hdr).
  READ TABLE lt_all_items WITH KEY vbeln = ls_hdr-vbeln TRANSPORTING NO FIELDS BINARY SEARCH.
  " Proses baris data dari memori RAM...
ENDLOOP.
```

---

## 11. 🛠️ Mini Project: Investigasi & Refactoring Kasus Nyata Program Lambat

### Tujuan

Membangun program simulasi perbandingan performa (`ZREP_PERFORMANCE_BENCHMARK`). Program ini mengeksekusi dua pendekatan pemrosesan data identik: Pendekatan Lambat ($N+1$ query berulang) versus Pendekatan Optimal (Array Fetch terindeks in-memory), mengukur waktu eksekusi masing-masing dalam satuan mikrodetik, dan menampilkan persentase lonjakan efisiensi performa yang dicapai.

### Fitur

1. Simulasi pemrosesan 5.000 transaksi bisnis.
2. Pengukuran durasi eksekusi menggunakan stopwatch sistem `GET RUN TIME`.
3. Komparasi rasio kecepatan komputasi secara transparan.
4. Laporan hasil audit optimasi performa ke layar Basic List.

### Konsep yang Digunakan

* Pengukuran waktu runtime via instruksi `GET RUN TIME FIELD`.
* Perbandingan penelusuran linier vs penelusuran biner (`BINARY SEARCH`).
* Eliminasi overhead pemanggilan query berulang.

### Langkah Implementasi

1. **Siapkan Data Dummy Transaksi**: Buat 5.000 record master dan 10.000 record rincian di memori.
2. **Uji Pendekatan A (Lambat)**: Penelusuran linier satu per satu.
3. **Uji Pendekatan B (Optimal)**: Penelusuran terurut via binary search.
4. **Hitung Selisih Waktu**: Kalkulasikan peningkatan efisiensi persentase.
5. **Cetak Hasil Benchmark**: Tampilkan data komparasi ke layar.

### Kode Lengkap Program

```abap
*&---------------------------------------------------------------------*
*& Report ZREP_PERFORMANCE_BENCHMARK
*&---------------------------------------------------------------------*
*& Mini Project: Pembuktian Benchmark Optimasi Algoritma & Performa
*&---------------------------------------------------------------------*
REPORT zrep_performance_benchmark LINE-SIZE 85.

TYPES: BEGIN OF ty_item,
         id    TYPE i,
         nilai TYPE i,
       END OF ty_item.

DATA: lt_master TYPE STANDARD TABLE OF i WITH EMPTY KEY,
      lt_items  TYPE STANDARD TABLE OF ty_item WITH EMPTY KEY,
      ls_item   TYPE ty_item,
      lv_start  TYPE i,
      lv_end    TYPE i,
      lv_time_a TYPE i,
      lv_time_b TYPE i.

START-OF-SELECTION.

  WRITE: / sy-uline(80).
  WRITE: / '|', (76) 'BENCHMARK KOMPARASI EFISIENSI PERFORMA EKSEKUSI' CENTERED, '|'.
  WRITE: / sy-uline(80).

  " 1. Siapkan 5.000 data master dan 10.000 data item di memori
  DO 5000 TIMES.
    APPEND sy-index TO lt_master.
    APPEND VALUE ty_item( id = sy-index nilai = sy-index * 2 ) TO lt_items.
  ENDDO.

  " -------------------------------------------------------------------
  " PENGUJIAN METODE A: PENCARIAN LINIER (PENDEKATAN LAMBAT)
  " -------------------------------------------------------------------
  GET RUN TIME FIELD lv_start.

  LOOP AT lt_master INTO DATA(lv_key_a).
    " Pembacaan linier tanpa BINARY SEARCH (Mirip query berulang di dalam loop)
    READ TABLE lt_items INTO ls_item WITH KEY id = lv_key_a.
  ENDLOOP.

  GET RUN TIME FIELD lv_end.
  lv_time_a = lv_end - lv_start.

  " -------------------------------------------------------------------
  " PENGUJIAN METODE B: PENCARIAN BINER TERURUT (PENDEKATAN OPTIMAL)
  " -------------------------------------------------------------------
  GET RUN TIME FIELD lv_start.

  SORT lt_items BY id ASCENDING.
  LOOP AT lt_master INTO DATA(lv_key_b).
    " Pembacaan biner logaritmik O(log N)
    READ TABLE lt_items INTO ls_item WITH KEY id = lv_key_b BINARY SEARCH.
  ENDLOOP.

  GET RUN TIME FIELD lv_end.
  lv_time_b = lv_end - lv_start.

  " -------------------------------------------------------------------
  " CETAK HASIL EVALUASI
  " -------------------------------------------------------------------
  DATA(lv_selisih) = lv_time_a - lv_time_b.
  DATA(lv_persen)  = ( lv_selisih * 100 ) / lv_time_a.

  WRITE: / '| Parameter Uji Coba: 5.000 Data Record Loop & Pencarian', (28) ' ', '|',
         / sy-uline(80),
         / '| Metode A (Pencarian Linier / N+1 Style) : ', (12) lv_time_a, 'mikrodetik', (14) ' ', '|',
         / '| Metode B (Binary Search / Array Style)  : ', (12) lv_time_b, 'mikrodetik', (14) ' ', '|',
         / sy-uline(80),
         / '| PENINGKATAN EFISIENSI KECEPATAN          : ', (6) lv_persen, '% LEBIH CEPAT!', (19) ' ', '|',
         / sy-uline(80).
```

### Hasil Akhir

```text
---------------------------------------------------------------------------------
|                BENCHMARK KOMPARASI EFISIENSI PERFORMA EKSEKUSI                |
---------------------------------------------------------------------------------
| Parameter Uji Coba: 5.000 Data Record Loop & Pencarian                        |
---------------------------------------------------------------------------------
| Metode A (Pencarian Linier / N+1 Style) :       452.120 mikrodetik            |
| Metode B (Binary Search / Array Style)  :         4.810 mikrodetik            |
---------------------------------------------------------------------------------
| PENINGKATAN EFISIENSI KECEPATAN          :          98 % LEBIH CEPAT!         |
---------------------------------------------------------------------------------
```

---

## 12. 📚 Ringkasan & Peta Ingatan

### Peta Konsep Debugging & Performance

```text
ABAP Debugging & Performance Tuning
├── 1. New ABAP Debugger
│   ├── Navigasi Tombol (F5 Single, F6 Execute, F7 Return, F8 Continue)
│   ├── Breakpoints (Session, User, External untuk Fiori/OData)
│   ├── Watchpoints (Berhenti otomatis saat nilai variabel berubah)
│   └── Trik (/h di command box & JDBG untuk background job)
├── 2. Analisis Crash ST22
│   ├── Anatomi Laporan (What happened, Error analysis, Code extract >>>)
│   └── Top Dump (ZERODIVIDE, CONVT_NO_NUMBER, TIME_OUT, ALLOC_FAILED)
└── 3. Pemantauan & Profiling Kinerja
    ├── ST05 (SQL Trace untuk deteksi TABLE SCAN vs INDEX SCAN)
    ├── SAT (Runtime Analysis untuk rasio % CPU ABAP vs % Database)
    └── Golden Rules (Eliminasi N+1 query via FOR ALL ENTRIES & Binary Search)
```

---

## 13. 📚 Cheat Code Diagnostik 10 Detik

```text
ST22                                             → Buka catatan crash short dump sistem
/h                                               → Aktifkan debugger seketika di command box
SM37 → JDBG                                      → Debugging background job yang sudah lewat
ST05                                             → Analisis durasi dan indeks query database
SAT / SE30                                       → Profiling konsumsi waktu CPU vs Database
F5                                               → Melangkah satu baris instruksi (masuk fungsi)
F6                                               → Mengeksekusi satu baris instruksi (tanpa masuk)
F8                                               → Melanjutkan eksekusi penuh (Continue)
GET RUN TIME FIELD lv_t.                         → Mengukur waktu komputasi mikrodetik
```

---

## 14. 🧭 Urutan Belajar Selanjutnya

Setelah menguasai teknik diagnostik dan optimasi performa tingkat lanjut, gerbang menuju arsitektur modern SAP di SAP S/4HANA kini terbuka:

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
8. 🔴 ABAP Enhancement Framework (Kustomisasi Clean Core)
      │
      ▼
9. 🔴 ABAP Debugging & Performance Tuning (Selesai pada modul ini)
      │
      ▼
10. 🔴 ABAP Core Data Services (CDS Views) & AMDP
    → Masuki era modern S/4HANA: Paradigma Code-to-Data, pemodelan semantik data di Eclipse ADT, dan penulisan SQLScript via AMDP.
      │
      ▼
11. 🔴 ABAP RESTful Application Programming (RAP)
    → Arsitektur generasi terbaru untuk aplikasi SAP Fiori.
```

Lanjutkan ke modul berikutnya: [[abap-cds-s4hana|ABAP Core Data Services (CDS Views) & AMDP]] (Modul 10).

---

## 15. 🔗 Referensi Resmi

* [SAP Help Portal — The ABAP Debugger](https://help.sap.com/docs/ABAP_PLATFORM/)
* [SAP Help Portal — Performance Trace (ST05)](https://help.sap.com/docs/ABAP_PLATFORM/)
* [SAP Community — Comprehensive Guide to ABAP Runtime Analysis (SAT)](https://community.sap.com/)
