---
title: "Background Jobs & Batch Processing"
description: "Panduan lengkap pemrosesan batch dan background processing di SAP ABAP: dialog work process vs background work process, batasan timeout rdisp/max_wprun_time, pembuatan varian seleksi, penjadwalan job via SM36, monitoring via SM37, manajemen spool cetak SP01, teknik debugging background job dengan perintah JDBG, serta evolusi menuju Application Jobs Framework di ABAP Cloud."
order: 15
tags:
  - sap
  - abap
  - batch-processing
  - background-jobs
  - operations
---

# Background Jobs & Batch Processing

> Target: ABAP Developer (Lanjutan)  
> Prasyarat: [[abap-reports-alv|Modul 6: Reports & Selection Screen]], [[abap-debugging-performance|Modul 9: Debugging & Performance]]  
> Lingkungan: SAP NetWeaver, SAP S/4HANA (On-Premise / Private Cloud)

---

## Gambaran Umum

Dalam operasional bisnis harian, sistem SAP sering dituntut untuk memproses jutaan baris data: perhitungan depresiasi aset akhir bulan, kalkulasi penggajian ribuan karyawan, pencetakan massal faktur penagihan, hingga sinkronisasi stok antar-gudang.

Jika kalkulasi masif tersebut dijalankan secara interaktif di layar pengguna (*dialog mode*), layar SAP GUI akan membeku (*freeze*), pengguna tidak dapat melakukan pekerjaan lain, dan server aplikasi akan memutus paksa transaksi tersebut karena melanggar batas waktu eksekusi proses dialog.

**Background Jobs (Batch Processing)** adalah mekanisme komputasi asinkron milik server aplikasi SAP (*AS ABAP*) untuk menjalankan program di latar belakang tanpa keterlibatan pengguna, bebas dari batas waktu dialog, dan dapat dijadwalkan secara berkala (misal: setiap tengah malam).

---

## Daftar Isi

### 🟢 Fundamental

1. [Mengapa Background Processing Diperlukan](#1--mengapa-background-processing-diperlukan)
2. [Dialog vs Background: Parameter rdisp/max_wprun_time & Dump TIME_OUT](#2--dialog-vs-background-parameter-rdispmax_wprun_time--dump-time_out)
3. [Konfigurasi Selection Variants pada Program Pelaporan](#3--konfigurasi-selection-variants-pada-program-pelaporan)
4. [Anatomi Penjadwalan Job di T-Code SM36](#4--anatomi-penjadwalan-job-di-t-code-sm36)

### 🟡 Lanjutan

5. [Monitoring & Siklus Hidup Job di T-Code SM37](#5--monitoring--siklus-hidup-job-di-t-code-sm37)
6. [Membaca Job Log & Manajemen Spool Cetak via SP01](#6--membaca-job-log--manajemen-spool-cetak-via-sp01)
7. [Investigasi & Debugging Background Job via Perintah JDBG](#7--investigasi--debugging-background-job-via-perintah-jdbg)
8. [Penanganan Kegagalan: Analisis Crash, Pembatalan, & Rerun](#8--penanganan-kegagalan-analisis-crash-pembatalan--rerun)
9. [Evolusi Modern: Menuju Application Jobs di ABAP Cloud](#9--evolusi-modern-menuju-application-jobs-di-abap-cloud)

### 🛠️ Praktik & Rujukan

10. [Praktik: Konfigurasi, Eksekusi, & Debugging Job Batch Penjualan](#10-️-praktik-konfigurasi-eksekusi--debugging-job-batch-penjualan)
11. [Ringkasan & Cheat Code Background Processing](#11--ringkasan--cheat-code-background-processing)
12. [Referensi Resmi](#12--referensi-resmi)

---

## 1. 🟢 Mengapa Background Processing Diperlukan

Tiga alasan utama mengapa program wajib dialihkan ke Background Processing:
1. **Membebaskan Pengguna**: Pengguna tidak perlu menunggu di depan komputer selama proses penarikan data berjalan.
2. **Optimalisasi Beban Server (Off-Peak Hours)**: Komputasi berat dijadwalkan pada malam hari saat beban kerja karyawan sedang sepi (*off-peak*).
3. **Imunitas Terhadap Batas Waktu**: Background Work Process tidak memiliki batas waktu pemutusan transaksi otomatis.

---

## 2. 🟢 Dialog vs Background: Parameter rdisp/max_wprun_time & Dump TIME_OUT

Server aplikasi SAP membagi sumber daya CPU menjadi beberapa jenis *Work Process* (dapat dipantau di T-Code `SM50`):

```text
Arsitektur Work Process SAP:
┌─────────────────────────────────────────────────────────────┐
│ 1. Dialog Work Process (DIA)                                │
│    - Menangani interaksi langsung dengan user di layar GUI  │
│    - Dibatasi oleh profil timeout: rdisp/max_wprun_time     │
│    - Jika eksekusi melebihi batas --> Dump: TIME_OUT        │
├─────────────────────────────────────────────────────────────┤
│ 2. Background Work Process (BTC)                            │
│    - Menangani komputasi massal tanpa layar antarmuka       │
│    - Bebas batas waktu eksekusi dialog                      │
│    - Output layar dialihkan ke antrean Spool (SP01)         │
└─────────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **Klarifikasi Batas Waktu Dialog (`TIME_OUT`):**
> Sering beredar asumsi bahwa batas waktu proses dialog SAP selalu 60 detik. Secara teknis, angka ini **bukan nilai mutlak yang universal**, melainkan diatur oleh parameter profil sistem **`rdisp/max_wprun_time`** (dapat diperiksa melalui T-Code `RZ11`). Standar bawaan SAP umumnya berkisar antara **300 hingga 600 detik (5 s/d 10 menit)** tergantung konfigurasi tim Basis perusahaan. Jika proses dialog melampaui durasi tersebut, SAP Kernel membekukan transaksi dan memicu *short dump* `TIME_OUT`.

---

## 3. 🟢 Konfigurasi Selection Variants pada Program Pelaporan

Karena program background berjalan otomatis tanpa ada manusia yang mengisi kolom input Selection Screen, seluruh nilai filter wajib disimpan terlebih dahulu dalam bentuk **Selection Variant**:

### Langkah Membuat Variant
1. Buka program report di `SE38` $\rightarrow$ Klik **Execute** (F8).
2. Isi kolom input (misal: Tanggal Transaksi, Kode Organisasi).
3. Klik tombol **Save as Variant** (ikon disket di toolbar atas).
4. Beri nama varian (misal: `VAR_MIDNIGHT_RUN`) dan deskripsi.
5. Anda dapat mengaktifkan opsi dinamis (misal: parameter tanggal otomatis mengambil *Current Date* atau *Previous Day* dari variabel sistem).
6. Simpan. Varian ini yang nantinya dipanggil oleh scheduler job.

---

## 4. 🟢 Anatomi Penjadwalan Job di T-Code SM36

T-Code **`SM36`** (*Define Background Job*) adalah pusat pembuatan jadwal komputasi batch:

```text
Struktur Penjadwalan SM36:
┌─────────────────────────────────────────────────────────────┐
│ Job Name: ZJOB_SALES_AGGREGATION_DAILY                      │
│ Job Class: B (Medium Priority)                              │
├─────────────────────────────────────────────────────────────┤
│ 1. Steps (Langkah Eksekusi):                                │
│    ├── Step 1: Program ZREP_AGGREGATE_SALES (Varian VAR_01) │
│    └── Step 2: Program ZREP_SEND_EMAIL_NOTIFICATION         │
├─────────────────────────────────────────────────────────────┤
│ 2. Start Condition (Waktu Picu):                            │
│    ├── Immediate (Jalankan detik ini juga)                  │
│    ├── Date/Time (Setiap hari pukul 23:00:00)               │
│    ├── After Job (Berjalan otomatis setelah Job X sukses)   │
│    └── After Event (Berjalan saat ada sinyal sistem/file)   │
└─────────────────────────────────────────────────────────────┘
```

### Prioritas Job (Job Class)
* **Class A (High Priority)**: Direservasikan untuk tugas darurat atau operasi bisnis super kritis.
* **Class B (Medium Priority)**: Untuk tugas batch terjadwal reguler.
* **Class C (Low Priority)**: Prioritas standar bawaan (*default*) untuk program umum.

---

## 5. 🟡 Monitoring & Siklus Hidup Job di T-Code SM37

T-Code **`SM37`** (*Job Overview*) digunakan untuk memantau kesehatan dan riwayat eksekusi seluruh background job di sistem.

### Status-Status dalam Siklus Hidup Job

```text
[ Scheduled ]  --> Job telah didaftarkan, namun belum memiliki Start Condition
      │
      ▼
 [ Released ]  --> Job telah memiliki Start Condition dan siap dipicu scheduler
      │
      ▼
  [ Ready ]    --> Syarat waktu terpenuhi, job sedang antre menunggu Background WP kosong
      │
      ▼
  [ Active ]   --> Program sedang berjalan aktif di memori server
      │
      ├───────────────────────────────┐
      ▼                               ▼
[ Finished ] 🟢                  [ Canceled ] 🔴
Eksekusi selesai sukses        Terjadi Crash / Dump / Pembatalan
```

---

## 6. 🟡 Membaca Job Log & Manajemen Spool Cetak via SP01

### 1. Job Log
Pada layar `SM37`, pilih satu baris job $\rightarrow$ Klik tombol **Job Log**. Sistem akan menampilkan kronologi teks proses per detik, termasuk seluruh pesan `MESSAGE ... TYPE 'I'`/`'W'`/`'S'` yang dipicu oleh program.

### 2. Spool Request (`SP01`)
Instruksi seperti `WRITE: / 'Data Laporan'` pada program batch tidak hilang. Sistem otomatis mengalihkan seluruh output visual tersebut ke dalam file antrean cetak yang disebut **Spool Request**:
* Pada `SM37`, klik tombol **Spool**.
* Klik tombol **Type Representation** (kacamata) untuk membaca layout laporan visual di layar monitor Anda atau mengunduhnya ke file teks/PDF.

---

## 7. 🟡 Investigasi & Debugging Background Job via Perintah JDBG

Mendebug program dialog sangat mudah dengan perintah `/h`. Namun bagaimana cara mendebug program batch yang gagal hanya saat dijalankan di lingkungan background?

SAP menyediakan trik resmi **`JDBG`**:
1. Buka T-Code **`SM37`**.
2. Cari job Anda yang berstatus *Finished* atau *Canceled*.
3. Letakkan kursor tepat pada baris job yang ingin diinvestigasi.
4. Jangan tekan tombol apa pun pada toolbar. Langsung ketikkan perintah **`JDBG`** pada kotak input Transaction Code (kiri atas) lalu tekan **Enter**.
5. Sistem SAP akan langsung mereproduksi lingkungan background job tersebut di dalam **ABAP Debugger interaktif**, berhenti tepat di baris pertama kode program!

---

## 8. 🟡 Penanganan Kegagalan: Analisis Crash, Pembatalan, & Rerun

Jika sebuah job berstatus **Canceled (Merah)**:
1. Buka **Job Log** di `SM37` untuk melihat baris terakhir yang dieksekusi sebelum berhenti.
2. Jika penyebabnya adalah runtime fatal dump, buka T-Code **`ST22`** dan cari insiden crash pada jam dan nama user background terkait.
3. Setelah masalah diperbaiki, job dapat diulang langsung dari `SM37` dengan memilih menu: **Job** $\rightarrow$ **Repeat Run**.

---

## 9. 🟡 Evolusi Modern: Menuju Application Jobs di ABAP Cloud

| Aspek Operasional | Classic SAP GUI (NetWeaver / S/4HANA On-Premise) | SAP ABAP Cloud (S/4HANA Cloud / BTP) |
| :--- | :--- | :--- |
| **Tool Penjadwalan** | T-Code **`SM36`** | Fiori App **"Application Jobs"** |
| **Tool Monitoring** | T-Code **`SM37`** | Fiori App **"Application Job Templates"** |
| **Desain Program** | Program Report ABAP biasa (`REPORT ...`) | Class yang mengimplementasikan interface resmi |
| **Interface Runtime**| Menggunakan Event `START-OF-SELECTION` | Menggunakan interface modern seperti **`IF_APJ_RT_RUN`** *(Catatan: interface awal seperti `IF_APJ_DT_EXEC_OBJECT`/`IF_APJ_RT_EXEC_OBJECT` kini berstatus legacy di release tertentu)* |

---

## 10. 🛠️ Praktik: Konfigurasi, Eksekusi, & Debugging Job Batch Penjualan

### Skenario Bisnis
Kita memiliki program batch `ZREP_SALES_NIGHTLY` yang bertugas membaca dokumen pesanan terbuka dan mencetak ringkasan total omset harian.

### Langkah 1: Kode Program Pelaporan (`ZREP_SALES_NIGHTLY`)

```abap
*&---------------------------------------------------------------------*
*& Report ZREP_SALES_NIGHTLY
*&---------------------------------------------------------------------*
*& Program Penarikan Data Penjualan Terjadwal Harian
*&---------------------------------------------------------------------*
REPORT zrep_sales_nightly LINE-SIZE 85.

TABLES: ztsales_order.

SELECTION-SCREEN BEGIN OF BLOCK b1 WITH FRAME TITLE TEXT-001.
  SELECT-OPTIONS: s_erdat FOR sy-datum OBLIGATORY.
  PARAMETERS:     p_status TYPE c LENGTH 1 DEFAULT 'A' OBLIGATORY.
SELECTION-SCREEN END OF BLOCK b1.

START-OF-SELECTION.

  WRITE: / sy-uline(80).
  WRITE: / '|', (76) 'LAPORAN REKAPITULASI PENJUALAN HARIAN (BATCH RUN)' CENTERED, '|'.
  WRITE: / sy-uline(80).

  SELECT order_id, customer, gross_amount, order_status
    FROM ztsales_order
    WHERE order_status = @p_status
    ORDER BY order_id
    INTO TABLE @DATA(lt_orders).

  IF lt_orders IS INITIAL.
    MESSAGE 'Tidak ada data pesanan terbuka yang perlu diproses malam ini.' TYPE 'I'.
    WRITE: / '| STATUS: NIHIL. Tidak ditemukan dokumen pesanan sesuai kriteria.', (14) ' ', '|'.
    WRITE: / sy-uline(80).
    RETURN.
  ENDIF.

  DATA(lv_total) = 0.

  LOOP AT lt_orders INTO DATA(ls_ord).
    WRITE: / '| No. Pesanan:', (15) ls_ord-order_id,
             '| Pelanggan  :', (22) ls_ord-customer,
             '| Nilai: Rp', (16) ls_ord-gross_amount, '|'.
    lv_total = lv_total + ls_ord-gross_amount.
  ENDLOOP.

  WRITE: / sy-uline(80).
  WRITE: / '| TOTAL OMSET TERKUMPUL HARI INI: Rp', (18) lv_total, (23) ' ', '|'.
  WRITE: / sy-uline(80).
```

### Langkah 2: Menyimpan Varian di `SE38`
1. Jalankan program, isi `s_erdat = Current Date` dan `p_status = 'A'`.
2. Klik tombol **Save as Variant** $\rightarrow$ Beri nama `NIGHT_ACTIVE` $\rightarrow$ Simpan.

### Langkah 3: Menjadwalkan Job di `SM36`
1. Masukkan Job Name: `ZJOB_SALES_REKAP`.
2. Klik **Step**: Masukkan Program `ZREP_SALES_NIGHTLY` dan Variant `NIGHT_ACTIVE` $\rightarrow$ Simpan.
3. Klik **Start Condition** $\rightarrow$ Pilih **Immediate** (untuk simulasi pengujian sekarang) $\rightarrow$ Simpan.
4. Klik tombol **Save** utama (ikon disket). Status berubah menjadi **Released**.

### Langkah 4: Memeriksa Hasil di `SM37`
1. Buka `SM37` $\rightarrow$ Masukkan Job Name `ZJOB_SALES_REKAP` $\rightarrow$ Eksekusi.
2. Status menunjukkan **Finished (Hijau)**.
3. Klik tombol **Spool** $\rightarrow$ Klik ikon kacamata: Laporan rapi muncul di layar tanpa membebani interaksi dialog!

---

## 11. 📚 Ringkasan & Cheat Code Background Processing

### Peta Konsep
```text
Background Processing (AS ABAP)
├── 1. Karakteristik Komputasi
│   ├── Dialog WP (Terikat timeout profil rdisp/max_wprun_time)
│   └── Background WP (Bebas batas waktu, output ke Spool)
├── 2. Manajemen Penjadwalan (SM36)
│   ├── Step (Program ABAP + Varian input)
│   ├── Priority Class (A = Kritis, B = Sedang, C = Standar)
│   └── Start Condition (Immediate, Date/Time, After Job/Event)
├── 3. Siklus Hidup & Monitoring (SM37)
│   ├── Status: Scheduled ──> Released ──> Ready ──> Active ──> Finished / Canceled
│   ├── Job Log (Catatan kronologi eksekusi per detik)
│   └── Spool Request (SP01 - Arsip cetak output visual)
└── 4. Trik Investigasi
    └── Perintah JDBG (Menjalankan ulang background job di interactive debugger)
```

### Cheat Code T-Code 10 Detik
```text
SM36  → Membuat dan menjadwalkan Background Job baru
SM37  → Monitoring status, membaca Job Log, dan akses Spool
SP01  → Spool Viewer (Membaca dan mengunduh output cetak batch)
SM50  → Meninjau status Background Work Process (BTC) aktif
RZ11  → Memeriksa nilai parameter timeout sistem (rdisp/max_wprun_time)
JDBG  → Perintah sakti di SM37 untuk mendebug background job
```

---

## 12. 🔗 Referensi Resmi

* [SAP Help Portal: Background Processing (BC-CCM-BTC)](https://help.sap.com/docs/SAP_NETWEAVER_700/c238d694b825421f940829322fed326f/491e847c21351d8de10000000a42189c.html)
* [SAP Note 25528: Parameter rdisp/max_wprun_time Explanation and Configuration](https://me.sap.com/notes/25528)
* [SAP Help Portal: Application Jobs Architecture in ABAP Cloud](https://help.sap.com/docs/ABAP_PLATFORM_NEW/c238d694b825421f940829322fed326f/491e847c21351d8de10000000a42189c.html)
