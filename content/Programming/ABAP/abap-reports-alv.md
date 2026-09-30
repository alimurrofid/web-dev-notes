---
title: "ABAP Reports & ALV Grid"
description: "Panduan lengkap pelaporan bisnis dan visualisasi data tabel di SAP ABAP: Selection Screen events, SELECT-OPTIONS, dan Object-Oriented ALV Grid (CL_SALV_TABLE) dengan fitur ekspor Excel, subtotal, dan sorting."
order: 6
tags:
  - programming
  - abap
  - sap
  - reporting
  - alv
  - intermediate
---

# ABAP Reports & ALV Grid

> **Target:** Developer ABAP yang ingin membangun aplikasi pelaporan bisnis interaktif berstandar enterprise dengan visualisasi tabel dinamis menggunakan ALV Grid.
> **Versi:** SAP NetWeaver AS ABAP 7.40+ / 7.50+ & SAP S/4HANA (mengutamakan pendekatan modern `CL_SALV_TABLE`).
> **Prasyarat:** Telah memahami [[abap-dasar|ABAP Dasar]], [[abap-internal-tables|ABAP Internal Tables]], dan [[abap-database|ABAP Database & Open SQL]].

---

## Gambaran Umum

Dalam dunia operasional perusahaan pengguna SAP, mayoritas program kustom yang dibuat adalah program pelaporan (*Reporting*). Laporan ini digunakan oleh manajemen dan staf operasional untuk menganalisis pergerakan stok, status pesanan penjualan, maupun rincian saldo keuangan.

Sebelum era modern, developer menyusun laporan teks kaku menggunakan perintah `WRITE`. Di era modern saat ini, standar resmi penyajian data tabular di SAP adalah **ALV (ABAP List Viewer)**. Dengan ALV, pengguna mendapatkan antarmuka tabel spreadsheet interaktif yang secara otomatis dilengkapi fitur bawaan kelas dunia: pengurutan data (*sorting*), penyaringan (*filtering*), kalkulasi subtotal dan grand total, pemilihan tata letak kolom kustom (*layout variants*), hingga ekspor data instan ke file Microsoft Excel atau PDF tanpa memerlukan coding tambahan.

---

## Cara Belajar

```text
🟢 Fundamental
→ Pahami siklus hidup event pelaporan (INITIALIZATION, AT SELECTION-SCREEN, START-OF-SELECTION) dan SELECT-OPTIONS.

🟡 Lanjutan
→ Kuasai pembuatan ALV Grid modern menggunakan class bawaan CL_SALV_TABLE, aktivasi toolbar standar, dan format kolom.

🛠️ Praktik
→ Bangun mini project laporan pemantauan penjualan lengkap dengan filter rentang tanggal, pola zebra striping, dan total omset otomatis.
```

Mental model siklus hidup eksekusi program pelaporan SAP:

```text
       User Membuka Report / Menjalankan T-Code
                         │
                         ▼
       Event: INITIALIZATION
       (Mengisi nilai default tanggal hari ini di Selection Screen)
                         │
                         ▼
       Event: AT SELECTION-SCREEN OUTPUT (PBO)
       (Menyesuaikan tampilan kolom input secara dinamis)
                         │
                         ▼
       Layar Selection Screen Tampil di Hadapan User
       [ User mengisi filter data dan menekan tombol Execute (F8) ]
                         │
                         ▼
       Event: AT SELECTION-SCREEN (PAI)
       (Validasi logika input; jika ada kesalahan, tampilkan pesan error)
                         │
                         ▼
       Event: START-OF-SELECTION
       (Eksekusi query SELECT ke database & pemrosesan data in-memory)
                         │
                         ▼
       Event: END-OF-SELECTION
       (Memanggil CL_SALV_TABLE=>FACTORY dan menampilkan ALV Grid)
                         │
                         ▼
       Layar ALV Grid Interaktif Muncul di SAP GUI
```

**Hafalan:**

```text
SELECT-OPTIONS   → Input filter rentang multi-nilai (menghasilkan tabel internal ranges)
INITIALIZATION   → Event persiapan nilai awal sebelum Selection Screen muncul ke user
AT SELECTION-SCR → Event validasi data input form sebelum query database dijalankan
START-OF-SELECT. → Event utama untuk mengeksekusi penarikan query database
CL_SALV_TABLE    → Class resmi modern SAP untuk membuat tampilan ALV Grid secara instan
set_all( abap_true ) → Mengaktifkan seluruh toolbar standar ALV (Excel, Print, Sort, Filter)
set_striped_pattern  → Mengaktifkan tampilan baris selang-seling warna abu-abu (Zebra lines)
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Evolusi Pelaporan SAP: Dari Basic List ke ALV](#1--evolusi-pelaporan-sap-dari-basic-list-ke-alv)
2. [Siklus Hidup Event Program Pelaporan (Report Events)](#2--siklus-hidup-event-program-pelaporan-report-events)
3. [Input Rentang Nilai Tingkat Lanjut: SELECT-OPTIONS](#3--input-rentang-nilai-tingkat-lanjut-select-options)
4. [Validasi Input Form & Penanganan Pesan Kesalahan](#4--validasi-input-form--penanganan-pesan-kesalahan)

### 🟡 Lanjutan

5. [Pengenalan Object-Oriented ALV (CL_SALV_TABLE)](#5--pengenalan-object-oriented-alv-cl_salv_table)
6. [Aktivasi Toolbar Standar SAP & Ekspor Excel](#6--aktivasi-toolbar-standar-sap--ekspor-excel)
7. [Kustomisasi Tampilan: Zebra Striping & Judul Laporan](#7--kustomisasi-tampilan-zebra-striping--judul-laporan)
8. [Pengaturan Kolom: Mengubah Label & Menyembunyikan Kolom](#8--pengaturan-kolom-mengubah-label--menyembunyikan-kolom)
9. [Kalkulasi Agregasi: Grand Total & Subtotal Otomatis](#9--kalkulasi-agregasi-grand-total--subtotal-otomatis)
10. [Interaktivitas: Kolom Hotspot & Navigasi Drill-Down Transaksi](#10--interaktivitas-kolom-hotspot--navigasi-drill-down-transaksi)

### 🛠️ Praktik

11. [Mini Project: Laporan Pemantauan Pesanan Penjualan](#11-️-mini-project-laporan-pemantauan-pesanan-penjualan)

### 📚 Ringkasan & Referensi

12. [Peta Ingatan & Ringkasan](#12--peta-ingatan--ringkasan)
13. [Cheat Code ALV 10 Detik](#13--cheat-code-alv-10-detik)
14. [Urutan Belajar Selanjutnya](#14--urutan-belajar-selanjutnya)
15. [Referensi Resmi](#15--referensi-resmi)

---

## 1. 🟢 Evolusi Pelaporan SAP: Dari Basic List ke ALV

### Konsep

Pada generasi awal ABAP, developer menyajikan data laporan menggunakan instruksi klasik `WRITE`, `ULINE`, dan `SKIP` untuk menggambar tabel karakter baris demi baris di layar *Basic List*.

Keterbatasan *Basic List* klasik:
* Tampilan statis dan tidak bisa diurutkan secara dinamis oleh pengguna.
* Kolom terpotong jika resolusi monitor pengguna berbeda.
* Pengguna tidak bisa mengekspor data ke Excel secara langsung tanpa konversi rumit.

Untuk menjawab kebutuhan ini, SAP menghadirkan **ALV (ABAP List Viewer)**. ALV mengubah data internal table apa pun menjadi kisi spreadsheet interaktif berstandar profesional hanya dalam beberapa baris kode.

---

## 2. 🟢 Siklus Hidup Event Program Pelaporan (Report Events)

### Konsep

Program executable report di ABAP digerakkan oleh urutan event sistem (*Event-Driven Architecture*):

| Blok Event | Waktu Pemicuan | Penggunaan Tipikal |
| :--- | :--- | :--- |
| **`INITIALIZATION`** | Sebelum Selection Screen tampil. | Menentukan nilai default cerdas (misal: mengisi filter tanggal dengan tanggal hari pertama bulan ini sampai hari ini). |
| **`AT SELECTION-SCREEN OUTPUT`** | PBO (*Process Before Output*) layar input. | Menyembunyikan atau menonaktifkan kolom input tertentu berdasarkan radio button yang dipilih. |
| **`AT SELECTION-SCREEN`** | PAI (*Process After Input*) saat user klik tombol Execute. | Memeriksa validitas input (misal: memastikan rentang tanggal akhir tidak lebih kecil dari tanggal awal). |
| **`START-OF-SELECTION`** | Tepat setelah validasi form lolos. | Menjalankan query `SELECT` database dan komputasi data. |
| **`END-OF-SELECTION`** | Setelah seluruh data berhasil ditarik. | Memanggil fungsi atau method penampil ALV Grid. |

---

## 3. 🟢 Input Rentang Nilai Tingkat Lanjut: SELECT-OPTIONS

### Konsep

Berbeda dengan `PARAMETERS` yang hanya menerima satu nilai tunggal, **`SELECT-OPTIONS`** menghasilkan layar masukan kompleks yang memungkinkan pengguna memasukkan:
* Satu nilai eksak (`1000`).
* Rentang nilai dari sampai (`1000` s/d `2000`).
* Pengecualian nilai (*Exclude*).
* Pola teks (*Wildcard* menggunakan tanda bintang `*`).

### Struktur Internal Tabel Ranges

Di belakang layar, pernyataan `SELECT-OPTIONS s_matnr FOR mara-matnr.` secara otomatis membuat sebuah Internal Table berstruktur 4 kolom:

| Kolom | Tipe | Contoh Isi | Keterangan |
| :--- | :---: | :---: | :--- |
| **`SIGN`** | `C(1)` | `'I'` atau `'E'` | `'I'` = Include (Sertakan), `'E'` = Exclude (Kecualikan). |
| **`OPTION`** | `C(2)` | `'EQ'`, `'BT'`, `'CP'` | Operator: `'EQ'` (Equal), `'BT'` (Between / Rentang), `'CP'` (Contains Pattern). |
| **`LOW`** | Sesuai Tipe | `'1000'` | Batas nilai bawah / nilai tunggal. |
| **`HIGH`** | Sesuai Tipe | `'2000'` | Batas nilai atas (hanya terisi jika option `'BT'`). |

### Keunggulan Integrasi dengan Open SQL

Tabel ranges hasil `SELECT-OPTIONS` dapat langsung dipasangkan pada klausa `WHERE` query Open SQL menggunakan operator **`IN`**:

```abap
SELECT-OPTIONS s_erdat FOR sy-datum.

" Query database langsung mengevaluasi seluruh logika rentang secara otomatis!
SELECT vbeln, erdat FROM vbak WHERE erdat IN @s_erdat INTO TABLE @DATA(lt_so).
```

---

## 4. 🟢 Validasi Input Form & Penanganan Pesan Kesalahan

### Konsep

Untuk mencegah query lambat yang menyedot jutaan baris database, validasi wajib dilakukan pada event **`AT SELECTION-SCREEN`**.

Jika pengguna mengisi kombinasi data yang keliru, batalkan eksekusi dan arahkan kembali kursor ke kolom yang bermasalah menggunakan perintah `MESSAGE ... TYPE 'E'`:

```abap
AT SELECTION-SCREEN.
  IF s_erdat-high IS NOT INITIAL AND s_erdat-high < s_erdat-low.
    " Pesan Type 'E' akan membekukan layar dan menandai kolom input dengan warna merah
    MESSAGE 'Tanggal akhir tidak boleh lebih awal dari tanggal mulai!' TYPE 'E'.
  ENDIF.
```

### Message Class vs Pesan Literal

Di ABAP, menampilkan pesan dapat dilakukan dengan dua pendekatan:

1. **Pesan Literal Teks**:
   Pesan ditulis langsung berupa string di dalam kode. Pendekatan ini sangat praktis, cepat, dan ideal untuk **latihan dasar atau program utilitas internal**:
   ```abap
   MESSAGE 'Tanggal akhir tidak boleh lebih awal dari tanggal mulai!' TYPE 'E'.
   ```

2. **Message Class (`SE91`)**:
   Pada **aplikasi enterprise production**, pesan didaftarkan secara terpusat pada Message Class di T-Code `SE91`. Setiap pesan diberi nomor ID (misal: `001`) dan dapat menyertakan placeholder dinamis (`&1`, `&2`):
   ```abap
   " Memanggil pesan nomor 001 dari Message Class 'ZMSG_SALES'
   MESSAGE e001(zmsg_sales) WITH s_erdat-low s_erdat-high.
   ```
   *Keunggulan Enterprise:* Pesan yang didaftarkan di `SE91` secara otomatis mendukung penerjemahan ke berbagai bahasa (*Internationalization / i18n* via T-Code `SE63`), sehingga user di Jerman melihat pesan berbahasa Jerman, sedangkan user di Indonesia melihat bahasa Indonesia tanpa mengubah kode sumber.

### Pengamanan Akses: Pengecekan Otorisasi (AUTHORITY-CHECK)

Pada program pelaporan bisnis yang mengolah data sensitif (misal: dokumen penjualan per Sales Organization atau data keuangan per Company Code), developer menyisipkan instruksi `AUTHORITY-CHECK` untuk memverifikasi hak akses pengguna:

```abap
" Memeriksa apakah user memiliki wewenang menampilkan (Activity '03') Sales Org terkait:
AUTHORITY-CHECK OBJECT 'V_VBAK_VKO'
  ID 'VKORG' FIELD p_vkorg
  ID 'ACTVT' FIELD '03'. " '03' = Activity Display

IF sy-subrc <> 0.
  MESSAGE 'Anda tidak memiliki wewenang untuk mengakses data organisasi ini!' TYPE 'E'.
ENDIF.
```

> [!NOTE]
> **Desain Keamanan Aplikasi:**
> `AUTHORITY-CHECK` merupakan bagian dari tata kelola keamanan SAP. Penerapannya disesuaikan dengan kebutuhan bisnis, arsitektur modul, dan peran otorisasi (*Role* di T-Code `PFCG`). Program utilitas teknis atau laporan tanpa data sensitif tidak selalu memerlukan pengecekan eksplisit ini jika proteksi sudah diterapkan di level Transaction Code (`SE93` / `SU24`).

---

## 5. 🟡 Pengenalan Object-Oriented ALV (CL_SALV_TABLE)

### Konsep

Pada sistem SAP lama, developer menampilkan ALV menggunakan Function Module klasik `REUSE_ALV_GRID_DISPLAY`. Pendekatan klasik ini membutuhkan puluhan baris konfigurasi manual yang rumit (*Field Catalog*).

Pada SAP modern, SAP memperkenalkan class **`CL_SALV_TABLE`**. Dengan class ini, Anda dapat menampilkan tabel internal ke ALV Grid hanya dengan **dua baris instruksi**:

```abap
" 1. Panggil factory method untuk menginisialisasi ALV dari internal table
cl_salv_table=>factory(
  IMPORTING r_salv_table = DATA(lo_alv)
  CHANGING  t_table      = lt_data
).

" 2. Tampilkan langsung ke layar
lo_alv->display( ).
```

Sistem SAP secara otomatis membaca metadata tipe data dari Data Dictionary untuk menentukan nama kolom, perataan teks, dan lebar kolom optimal!

### Jembatan Menuju Modul OOP: Memahami Sintaks `=>` dan `->`

Meskipun konsep Object-Oriented Programming dibahas mendalam pada [[abap-oop|Modul 7: ABAP Objects]], `CL_SALV_TABLE` menggunakan dua operator method yang sangat intuitif:

```text
CL_SALV_TABLE (Class Cetak Biru)
        │
        ▼ (cl_salv_table=>factory)  --> Simbol '=>' memanggil Static / Factory Method
lo_alv (Object Reference / Instance di Memori)
        │
        ▼ (lo_alv->display())       --> Simbol '->' memanggil Instance Method
Layar ALV Grid Tampil
```

1. **Static Method (`=>`)**: Method milik Class secara global. Anda dapat memanggilnya langsung tanpa perlu membuat objek terlebih dahulu (`cl_salv_table=>factory`).
2. **Instance Method (`->`)**: Method yang bekerja pada satu objek spesifik yang telah aktif di memori komputer (`lo_alv->display()`).

---

## 6. 🟡 Aktivasi Toolbar Standar SAP & Ekspor Excel

### Konsep

Secara default, `CL_SALV_TABLE` dibuat dalam mode minimalis tanpa tombol menu atas. Untuk memunculkan seluruh toolbar standar SAP (tombol unduh Excel, Print, Filter, Sort):

```abap
" Mengaktifkan fungsi toolbar lengkap
DATA(lo_functions) = lo_alv->get_functions( ).
lo_functions->set_all( abap_true ).
```

Ketika instruksi di atas dijalankan, tombol ekspor ke Spreadsheet / Excel langsung aktif dan dapat digunakan pengguna tanpa menulis kode ekspor file satu baris pun.

---

## 7. 🟡 Kustomisasi Tampilan: Zebra Striping & Judul Laporan

### Konsep

Untuk kenyamanan visual pengguna saat membaca ribuan baris data, aktifkan fitur pola garis warna berselang-seling (*Zebra Lines* / *Striped Pattern*) dan tambahkan header judul laporan:

```abap
" Mengakses pengaturan display
DATA(lo_display) = lo_alv->get_display_settings( ).

" 1. Mengaktifkan zebra striping
lo_display->set_striped_pattern( abap_true ).

" 2. Menetapkan judul header di atas kisi tabel
lo_display->set_list_header( 'Laporan Monitoring Transaksi Penjualan' ).
```

---

## 8. 🟡 Pengaturan Kolom: Mengubah Label & Menyembunyikan Kolom

### Konsep

Jika nama kolom bawaan ingin disesuaikan atau ada kolom teknis internal yang ingin disembunyikan dari layar pengguna:

```abap
DATA(lo_columns) = lo_alv->get_columns( ).

" 1. Mengoptimalkan lebar kolom secara otomatis (Auto-fit column width)
lo_columns->set_optimize( abap_true ).

" 2. Mengubah teks label kolom tertentu
TRY.
    DATA(lo_col_netwr) = lo_columns->get_column( 'NETWR' ).
    lo_col_netwr->set_short_text( 'Total' ).
    lo_col_netwr->set_medium_text( 'Total Bersih' ).
    lo_col_netwr->set_long_text( 'Total Nilai Bersih Faktur' ).

    " 3. Menyembunyikan kolom teknis MANDT dari tampilan
    DATA(lo_col_mandt) = lo_columns->get_column( 'MANDT' ).
    lo_col_mandt->set_visible( abap_false ).
  CATCH cx_salv_not_found.
    " Menangani jika nama kolom tidak ditemukan
ENDTRY.
```

---

## 9. 🟡 Kalkulasi Agregasi: Grand Total & Subtotal Otomatis

### Konsep

Untuk menambahkan baris penjumlahan otomatis (*Grand Total*) di baris terbawah tabel ALV:

```abap
DATA(lo_aggregations) = lo_alv->get_aggregations( ).

TRY.
    " Mengaktifkan perhitungan total otomatis untuk kolom NETWR
    lo_aggregations->add_aggregation(
      columnname  = 'NETWR'
      aggregation = if_salv_c_aggregation=>total
    ).
  CATCH cx_salv_not_found cx_salv_existing cx_salv_data_error.
ENDTRY.
```

---

## 10. 🟡 Interaktivitas: Kolom Hotspot & Navigasi Drill-Down Transaksi

### Konsep

Dalam laporan SAP profesional, pengguna mengharapkan dokumen dapat diklik (berupa tautan biru/bergaris bawah yang dinamakan **Hotspot**). Ketika diklik, layar akan langsung melompat (*Drill-Down*) membuka dokumen transaksi asli (misal: klik No. Sales Order langsung membuka transaksi `VA03`).

```abap
TRY.
    DATA(lo_col_vbeln) = CAST cl_salv_column_table( lo_columns->get_column( 'VBELN' ) ).
    " Menjadikan kolom sebagai tautan klik aktif (Hotspot)
    lo_col_vbeln->set_cell_type( if_salv_c_cell_type=>hotspot ).
  CATCH cx_salv_not_found.
ENDTRY.
```

---

## 11. 🛠️ Mini Project: Laporan Pemantauan Pesanan Penjualan

### Tujuan

Membangun aplikasi program laporan interaktif executable lengkap (`ZREP_SALES_MONITORING`). Program ini menyediakan layar seleksi filter rentang tanggal (*Select-Options*) dan pilihan kategori status, memvalidasi input tanggal, mengolah data transaksi penjualan in-memory, dan menyajikan hasilnya menggunakan ALV Grid modern berbasis `CL_SALV_TABLE` lengkap dengan toolbar standar, zebra striping, label kolom kustom, dan baris akumulasi grand total.

### Fitur

1. Layar seleksi interaktif dengan filter rentang tanggal (`SELECT-OPTIONS`) dan pilihan status pesanan (`PARAMETERS`).
2. Validasi input: memastikan batas tanggal akhir tidak lebih kecil dari tanggal mulai.
3. Visualisasi data tabel menggunakan class modern `CL_SALV_TABLE`.
4. Aktivasi toolbar standar lengkap (tombol ekspor spreadsheet Excel, sorting, print).
5. Pola zebra striping dan penyesuaian lebar kolom otomatis (*auto-fit width*).
6. Baris akumulasi total omset dan total diskon di baris paling bawah ALV.

### Konsep yang Digunakan

* Deklarasi `SELECT-OPTIONS` dan penanganan tabel ranges.
* Pemisahan siklus hidup event (`INITIALIZATION`, `AT SELECTION-SCREEN`, `START-OF-SELECTION`).
* Pembuatan ALV Grid OO menggunakan `cl_salv_table=>factory`.
* Pengaturan konfigurasi tampilan via `get_functions()`, `get_display_settings()`, dan `get_aggregations()`.

### Langkah Implementasi

1. **Definisikan Tipe Data**: Buat tipe baris `ty_report_data` yang memuat kolom-kolom laporan.
2. **Desain Selection Screen**: Buat `SELECT-OPTIONS` untuk rentang tanggal dan `PARAMETERS` untuk status.
3. **Set Nilai Default**: Di event `INITIALIZATION`, tetapkan tanggal default bulan berjalan.
4. **Validasi Input**: Di event `AT SELECTION-SCREEN`, periksa keabsahan rentang tanggal.
5. **Siapkan Data Laporan**: Di event `START-OF-SELECTION`, isi data tabel internal.
6. **Bangun ALV Grid**: Konfigurasikan instance `CL_SALV_TABLE`, aktifkan fitur-fiturnya, dan panggil `display()`.

### Kode Lengkap Program

```abap
*&---------------------------------------------------------------------*
*& Report ZREP_SALES_MONITORING
*&---------------------------------------------------------------------*
*& Mini Project: Laporan Interaktif Penjualan dengan OO ALV Grid
*&---------------------------------------------------------------------*
REPORT zrep_sales_monitoring.

*----------------------------------------------------------------------*
* 1. Struktur Data Laporan
*----------------------------------------------------------------------*
TYPES: BEGIN OF ty_report_data,
         order_id   TYPE c LENGTH 10,
         order_date TYPE d,
         customer   TYPE string,
         city       TYPE string,
         gross_amt  TYPE p LENGTH 9 DECIMALS 2,
         discount   TYPE p LENGTH 8 DECIMALS 2,
         net_amount TYPE p LENGTH 9 DECIMALS 2,
       END OF ty_report_data.

TYPES: tt_report_data TYPE STANDARD TABLE OF ty_report_data WITH EMPTY KEY.

DATA: gt_report TYPE tt_report_data,
      gv_date   TYPE d.

*----------------------------------------------------------------------*
* 2. Layar Input Seleksi (Selection Screen)
*----------------------------------------------------------------------*
SELECTION-SCREEN BEGIN OF BLOCK b1 WITH FRAME TITLE TEXT-001.
  SELECT-OPTIONS: s_date FOR gv_date OBLIGATORY.
  PARAMETERS:     p_vip  AS CHECKBOX DEFAULT ' '.
SELECTION-SCREEN END OF BLOCK b1.

*----------------------------------------------------------------------*
* 3. Event INITIALIZATION (Nilai Bawaan Awal)
*----------------------------------------------------------------------*
INITIALIZATION.
  " Mengisi rentang tanggal default: Hari pertama bulan ini s/d Hari ini
  s_date-sign   = 'I'.
  s_date-option = 'BT'.
  s_date-low    = |{ sy-datum(6) }01|. " Contoh: 20260901
  s_date-high   = sy-datum.            " Contoh: 20260930
  APPEND s_date.

*----------------------------------------------------------------------*
* 4. Event AT SELECTION-SCREEN (Validasi Input)
*----------------------------------------------------------------------*
AT SELECTION-SCREEN.
  LOOP AT s_date.
    IF s_date-high IS NOT INITIAL AND s_date-high < s_date-low.
      MESSAGE 'Tanggal akhir tidak boleh lebih awal dari tanggal awal!' TYPE 'E'.
    ENDIF.
  ENDLOOP.

*----------------------------------------------------------------------*
* 5. Event START-OF-SELECTION (Pengambilan & Pemrosesan Data)
*----------------------------------------------------------------------*
START-OF-SELECTION.

  " Mengisi data transaksi simulasi (Dalam sistem nyata: SELECT FROM database)
  gt_report = VALUE tt_report_data(
    ( order_id = 'SO-202601' order_date = '20260905' customer = 'PT Samudera Logistik' city = 'Jakarta'   gross_amt = '25000000' discount = '2500000' net_amount = '22500000' )
    ( order_id = 'SO-202602' order_date = '20260910' customer = 'CV Graha Kreasi'     city = 'Surabaya'  gross_amt = '10000000' discount = '500000'  net_amount = '9500000'  )
    ( order_id = 'SO-202603' order_date = '20260918' customer = 'PT Nusantara Makmur' city = 'Bandung'   gross_amt = '40000000' discount = '4000000' net_amount = '36000000' )
    ( order_id = 'SO-202604' order_date = '20260925' customer = 'PT Borneo Perkasa'   city = 'Balikpapan'gross_amt = '15000000' discount = '1500000' net_amount = '13500000' )
  ).

*----------------------------------------------------------------------*
* 6. Membangun dan Menampilkan OO ALV Grid (CL_SALV_TABLE)
*----------------------------------------------------------------------*
  TRY.
      " 1. Instansiasi objek ALV dari tabel internal
      cl_salv_table=>factory(
        IMPORTING r_salv_table = DATA(lo_alv)
        CHANGING  t_table      = gt_report
      ).

      " 2. Aktifkan seluruh tombol toolbar standar (Excel, Sort, Filter, Print)
      lo_alv->get_functions( )->set_all( abap_true ).

      " 3. Kustomisasi Display Settings (Zebra Striping & Judul Laporan)
      DATA(lo_display) = lo_alv->get_display_settings( ).
      lo_display->set_striped_pattern( abap_true ).
      lo_display->set_list_header( 'LAPORAN MONITORING TRANSAKSI PENJUALAN KONSOLIDASI' ).

      " 4. Kustomisasi Kolom
      DATA(lo_columns) = lo_alv->get_columns( ).
      lo_columns->set_optimize( abap_true ). " Auto-fit column width

      " Mengubah teks kolom agar rapi
      DATA(lo_col_order) = lo_columns->get_column( 'ORDER_ID' ).
      lo_col_order->set_short_text( 'No. Order' ).
      lo_col_order->set_medium_text( 'No. Pesanan' ).
      lo_col_order->set_long_text( 'Nomor Pesanan Penjualan' ).

      " 5. Menambahkan Baris Total Akumulasi (Grand Total)
      DATA(lo_aggregations) = lo_alv->get_aggregations( ).
      lo_aggregations->add_aggregation(
        columnname  = 'GROSS_AMT'
        aggregation = if_salv_c_aggregation=>total
      ).
      lo_aggregations->add_aggregation(
        columnname  = 'NET_AMOUNT'
        aggregation = if_salv_c_aggregation=>total
      ).

      " 6. Tampilkan ALV Grid ke Layar SAP GUI
      lo_alv->display( ).

    CATCH cx_salv_msg cx_salv_not_found cx_salv_existing cx_salv_data_error.
      MESSAGE 'Terjadi kesalahan sistem saat membangkitkan ALV Grid!' TYPE 'E'.
  ENDTRY.
```

### Hasil Akhir

Tampilan spreadsheet interaktif di layar SAP GUI:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ LAPORAN MONITORING TRANSAKSI PENJUALAN KONSOLIDASI                                     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [Sort A-Z] [Filter] [Total Σ] [Subtotal] [Export Excel] [Print] [Layout Variants v]    │
├─────────────┬────────────┬───────────────────────┬────────────┬─────────────┬──────────┤
│ No. Pesanan │ Tgl Order  │ Nama Pelanggan        │ Kota       │ Bruto (Rp)  │ Netto(Rp)│
├─────────────┼────────────┼───────────────────────┼────────────┼─────────────┼──────────┤
│ SO-202601   │ 05.09.2026 │ PT Samudera Logistik  │ Jakarta    │  25.000.000 │ 22.500.00│
│ SO-202602   │ 10.09.2026 │ CV Graha Kreasi       │ Surabaya   │  10.000.000 │  9.500.00│
│ SO-202603   │ 18.09.2026 │ PT Nusantara Makmur   │ Bandung    │  40.000.000 │ 36.000.00│
│ SO-202604   │ 25.09.2026 │ PT Borneo Perkasa     │ Balikpapan │  15.000.000 │ 13.500.00│
├─────────────┴────────────┴───────────────────────┴────────────┼─────────────┼──────────┤
│ GRAND TOTAL (*):                                              │  90.000.000 │ 81.500.00│
└───────────────────────────────────────────────────────────────┴─────────────┴──────────┘
```

---

## 12. 📚 Ringkasan & Peta Ingatan

### Peta Konsep ABAP Reports & ALV

```text
ABAP Reports & ALV Grid
├── 1. Siklus Hidup Event
│   ├── INITIALIZATION (Persiapan default input sebelum layar tampil)
│   ├── AT SELECTION-SCREEN (Validasi aturan bisnis & pencegahan error)
│   └── START-OF-SELECTION (Eksekusi query DB & olah data)
├── 2. Input Seleksi Interaktif
│   ├── PARAMETERS (Input nilai tunggal)
│   └── SELECT-OPTIONS (Tabel ranges: SIGN, OPTION, LOW, HIGH)
├── 3. Arsitektur CL_SALV_TABLE
│   ├── cl_salv_table=>factory( ) (Inisialisasi otomatis dari internal table)
│   └── display( ) (Render visual ke SAP GUI)
└── 4. Kustomisasi Komponen ALV
    ├── Functions (lo_functions->set_all( abap_true ) untuk tombol Excel/Print)
    ├── Display (Zebra striping & title header)
    ├── Columns (Auto-fit width & label kustom)
    └── Aggregations (Grand total penjumlahan kolom numerik)
```

---

## 13. 📚 Cheat Code ALV 10 Detik

```text
SELECT-OPTIONS s_val FOR tab-col.        → Membuat input filter rentang
cl_salv_table=>factory( ... )            → Membuat objek ALV Grid instan
lo_alv->get_functions( )->set_all( 'X' ) → Mengaktifkan seluruh toolbar standar
lo_display->set_striped_pattern( 'X' )   → Mengaktifkan baris warna selang-seling (Zebra)
lo_columns->set_optimize( 'X' )          → Lebar kolom pas otomatis (Auto-fit)
lo_col->set_cell_type( hotspot )         → Menjadikan kolom berupa link dapat diklik
lo_aggr->add_aggregation( ... )          → Menambahkan baris total penjumlahan
lo_alv->display( )                       → Memunculkan tabel ALV ke layar pengguna
```

---

## 14. 🧭 Urutan Belajar Selanjutnya

Setelah menguasai teknik pembuatan antarmuka pelaporan data bisnis, langkah berikutnya adalah mempelajari paradigma pemrograman modern berbasis objek di SAP:

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
6. 🟡 ABAP Reports & ALV Grid (Selesai pada modul ini)
      │
      ▼
7. 🟡 ABAP Objects (OOP)
   → Pelajari konsep Class, Interface, Inheritance, Polymorphism, dan penanganan Exception modern di ABAP.
      │
      ▼
8. 🔴 ABAP Enhancement Framework
   → Pelajari teknik kustomisasi standar SAP menggunakan BAdI dan Enhancement Spots.
```

Lanjutkan ke modul berikutnya: [[abap-oop|ABAP Objects (OOP)]] (Modul 7).

---

## 15. 🔗 Referensi Resmi

* [SAP Help Portal — The SALV Family (Object-Oriented ALV)](https://help.sap.com/docs/ABAP_PLATFORM/)
* [ABAP Keyword Documentation — Selection Screen Processing](https://help.sap.com/doc/abapdocu_latest_index_htm/latest/en-US/index.htm)
* [SAP Community — Best Practices with CL_SALV_TABLE](https://community.sap.com/)
