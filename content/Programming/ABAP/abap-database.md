---
title: "ABAP Database Access & Open SQL"
description: "Panduan lengkap akses database dan Open SQL di SAP ABAP: sintaks modern 7.40+, operasi CRUD, JOIN, FOR ALL ENTRIES, transaksi SAP LUW (COMMIT/ROLLBACK WORK), dan aturan optimasi performa query."
order: 4
tags:
  - programming
  - abap
  - sap
  - database
  - sql
  - intermediate
---

# ABAP Database Access & Open SQL

> **Target:** Pemula hingga intermediate yang ingin menguasai teknik interaksi basis data yang aman, efisien, dan modern di sistem SAP.
> **Versi:** SAP NetWeaver AS ABAP 7.40+ / 7.50+ & SAP S/4HANA (kompatibel dengan sistem ECC 6.0).
> **Prasyarat:** Telah memahami [[abap-dictionary|ABAP Data Dictionary (DDIC)]] dan manipulasi data pada [[abap-internal-tables|ABAP Internal Tables]].

---

## Gambaran Umum

Dalam arsitektur SAP, program aplikasi tidak berkomunikasi langsung dengan mesin database fisik menggunakan query spesifik vendor (seperti T-SQL atau PL/SQL). Sebagai gantinya, ABAP menyediakan lapisan abstraksi khusus yang disebut **Open SQL** (atau kini dinamakan **ABAP SQL** pada versi modern).

Open SQL adalah subset dari standar ANSI-SQL yang sepenuhnya independen dari mesin database underlying. Database Interface di Application Server bertindak sebagai penerjemah cerdas yang mengonversi pernyataan Open SQL menjadi Native SQL spesifik (apakah itu SAP HANA, Oracle, DB2, atau SQL Server) sekaligus secara otomatis menangani proteksi SQL Injection, isolasi nomor Client (`MANDT`), dan sinkronisasi memori buffer.

---

## Cara Belajar

```text
🟢 Fundamental
→ Pahami arsitektur Database Interface, sintaks SELECT dasar, sy-subrc, sy-dbcnt, dan operasi DML (INSERT, UPDATE, MODIFY, DELETE).

🟡 Lanjutan
→ Kuasai Open SQL modern 7.40+ (@ host variables & koma), JOIN vs FOR ALL ENTRIES, dan transaksi SAP LUW (COMMIT/ROLLBACK).

🛠️ Praktik
→ Bangun mini project update status faktur penjualan dengan validasi integritas data dan eksekusi transaksi database yang aman.
```

Mental model alur penerjemahan query oleh Database Interface SAP:

```text
       Program ABAP Developer
       ┌────────────────────────────────────────────────────────┐
       │ SELECT vbeln, erdat                                    │
       │   FROM vbak                                            │
       │   WHERE vbeln = @lv_so                                 │
       │   INTO TABLE @DATA(lt_so).                             │
       └───────────────────────────┬────────────────────────────┘
                                   │ Open SQL Query (Database-Independent)
                                   ▼
       Database Interface (Application Server Layer)
       ┌────────────────────────────────────────────────────────┐
       │ 1. Cek Shared Memory Buffer (Apakah data ada di RAM?) │
       │ 2. Sisipkan filter tenant: AND MANDT = '100'           │
       │ 3. Konversi ke Native SQL Dialect (SAP HANA)           │
       └───────────────────────────┬────────────────────────────┘
                                   │ Native SQL Query
                                   ▼
       Database Layer (SAP HANA / Oracle / MSSQL)
       [ Mengeksekusi query dan mengembalikan record data ]
```

**Hafalan:**

```text
Open SQL         → Bahasa query standar SAP yang independen dari merek database
Database Interf. → Lapisan Application Server yang menerjemahkan Open SQL ke Native SQL
SELECT SINGLE    → Membaca tepat 1 baris record data ke dalam Work Area
SELECT INTO TAB. → Menarik sekumpulan baris record ke dalam Internal Table
@ (Host Variable)→ Simbol prefiks wajib pada sintaks modern 7.40+ untuk variabel ABAP
sy-dbcnt         → Variabel sistem yang mencatat jumlah baris yang berhasil diproses query
COMMIT WORK      → Mengonfirmasi dan menyimpan seluruh perubahan data secara permanen
ROLLBACK WORK    → Membatalkan seluruh perubahan transaksi data jika terjadi kesalahan
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Open SQL & Database Interface](#1--pengenalan-open-sql--database-interface)
2. [Membaca Data Tunggal (SELECT SINGLE)](#2--membaca-data-tunggal-select-single)
3. [Membaca Banyak Data (SELECT INTO TABLE)](#3--membaca-banyak-data-select-into-table)
4. [Evaluasi Hasil Query (sy-subrc & sy-dbcnt)](#4--evaluasi-hasil-query-sy-subrc--sy-dbcnt)
5. [Operasi Manipulasi Data: INSERT, UPDATE, MODIFY, DELETE](#5--operasi-manipulasi-data-insert-update-modify-delete)

### 🟡 Lanjutan

6. [Sintaks Modern ABAP 7.40+ / 7.50+ Open SQL](#6--sintaks-modern-abap-740--750-open-sql)
7. [Relasi Tabel: INNER JOIN & LEFT OUTER JOIN](#7--relasi-tabel-inner-join--left-outer-join)
8. [Teknik FOR ALL ENTRIES & Jebakan Fatalnya](#8--teknik-for-all-entries--jebakan-fatalnya)
9. [Transaksi Database & SAP LUW (COMMIT & ROLLBACK WORK)](#9--transaksi-database--sap-luw-commit--rollback-work)
10. [Aturan Emas Kinerja Query (Performance Guidelines)](#10--aturan-emas-kinerja-query-performance-guidelines)

### 🛠️ Praktik

11. [Mini Project: Pemrosesan Status Pesanan Penjualan](#11-️-mini-project-pemrosesan-status-pesanan-penjualan)

### 📚 Ringkasan & Referensi

12. [Peta Ingatan & Ringkasan](#12--peta-ingatan--ringkasan)
13. [Cheat Code Database 10 Detik](#13--cheat-code-database-10-detik)
14. [Urutan Belajar Selanjutnya](#14--urutan-belajar-selanjutnya)
15. [Referensi Resmi](#15--referensi-resmi)

---

## 1. 🟢 Pengenalan Open SQL & Database Interface

### Konsep

Dalam lingkungan enterprise SAP, sistem dirancang untuk dapat dipindahkan (*portable*) antar berbagai mesin database. Keunggulan ini dimungkinkan oleh **Database Interface**.

Kelebihan Open SQL dibanding Native SQL:
1. **Keamanan SQL Injection Otomatis**: Variabel program yang digunakan di klausa `WHERE` diperlakukan secara terisolasi sebagai parameter terikat (*prepared statements*), sehingga mencegah serangan injeksi kode berbahaya.
2. **Otomasi Client Handling**: Anda tidak perlu menuliskan `WHERE mandt = sy-mandt` pada setiap query, karena sistem menyisipkannya secara transparan.
3. **Integrasi Kamus Data**: Tipe data hasil query langsung diverifikasi oleh kompiler terhadap struktur tabel di `SE11`.

---

## 2. 🟢 Membaca Data Tunggal (SELECT SINGLE)

### Konsep

Jika Anda hanya membutuhkan tepat satu record data dan kriteria pencarian menggunakan Primary Key lengkap tabel, gunakan pernyataan **`SELECT SINGLE`**. Data langsung dipindahkan ke sebuah **Work Area**.

### Contoh Kode Klasik vs Modern

```abap
REPORT z_select_single.

DATA: lv_cust_id TYPE c LENGTH 10 VALUE 'CUST-0001'.

" Pendekatan Modern ABAP 7.40+:
" - Nama kolom dipisahkan tanda koma
" - Variabel ABAP diberi awalan tanda '@' (escape character)
" - Work area dibuat otomatis di tempat menggunakan @DATA(ls_cust)
SELECT SINGLE client_id, client_name, status
  FROM ztclient_master
  WHERE client_id = @lv_cust_id
  INTO @DATA(ls_cust).

IF sy-subrc = 0.
  WRITE: / 'Pelanggan Ditemukan!',
         / 'ID   :', ls_cust-client_id,
         / 'Nama :', ls_cust-client_name,
         / 'Status:', ls_cust-status.
ELSE.
  WRITE: / 'Pelanggan dengan ID', lv_cust_id, 'tidak ditemukan.'.
ENDIF.
```

---

## 3. 🟢 Membaca Banyak Data (SELECT INTO TABLE)

### Konsep

Untuk menarik ratusan atau ribuan baris data sekaligus, gunakan klausa **`INTO TABLE`** untuk memindahkan seluruh hasil query ke dalam sebuah **Internal Table**.

### Contoh Kode

```abap
REPORT z_select_table.

" Menarik maksimal 100 transaksi dengan status 'A'
SELECT client_id, client_name, country
  FROM ztclient_master
  WHERE status = 'A'
  ORDER BY client_id ASCENDING
  INTO TABLE @DATA(lt_active_clients)
  UP TO 100 ROWS.

WRITE: / 'Total Pelanggan Aktif yang ditarik:', lines( lt_active_clients ).
```

> [!WARNING]
> **Hindari SELECT ... ENDSELECT:** Pada program lama, Anda mungkin melihat pola `SELECT * FROM tab ... ENDSELECT.`. Pola ini menarik data baris per baris bolak-balik melalui jaringan (*network round-trips*) yang sangat lambat. **Selalu gunakan `SELECT ... INTO TABLE` (Array Fetch)**.

---

## 4. 🟢 Evaluasi Hasil Query (sy-subrc & sy-dbcnt)

### Konsep

Segera setelah pernyataan query database dieksekusi, periksa dua variabel sistem berikut:

| Variabel Sistem | Nilai | Arti |
| :--- | :---: | :--- |
| **`sy-subrc`** | `0` | Query berhasil; setidaknya satu record data berhasil ditemukan/diproses. |
| **`sy-subrc`** | `4` | Tidak ada record data yang cocok dengan kriteria `WHERE`. |
| **`sy-dbcnt`** | Integer $\ge 0$ | Jumlah tepat baris record data yang berhasil dibaca atau diubah oleh perintah SQL terakhir. |

```abap
SELECT * FROM ztclient_master WHERE country = 'ID' INTO TABLE @DATA(lt_id_clients).

IF sy-subrc = 0.
  WRITE: / 'Ditemukan', sy-dbcnt, 'pelanggan dari Indonesia.'.
ELSE.
  WRITE: / 'Tidak ada pelanggan dari negara tersebut.'.
ENDIF.
```

---

## 5. 🟢 Operasi Manipulasi Data: INSERT, UPDATE, MODIFY, DELETE

### Konsep

Operasi DML (*Data Manipulation Language*) digunakan untuk menambah, mengubah, atau menghapus record pada tabel database.

### 1. Perintah INSERT (Menambah Data Baru)

```abap
DATA ls_new TYPE ztclient_master.
ls_new-client_id   = 'CUST-0099'.
ls_new-client_name = 'PT Sentosa Abadi'.
ls_new-status      = 'A'.
ls_new-country     = 'ID'.

INSERT ztclient_master FROM @ls_new.
IF sy-subrc = 0.
  WRITE: / 'Data berhasil disisipkan.'.
ELSE.
  WRITE: / 'Gagal: Data dengan Primary Key tersebut sudah ada!'.
ENDIF.
```

### 2. Perintah UPDATE (Mengubah Data yang Sudah Ada)

```abap
" Mengubah status pelanggan secara langsung di database
UPDATE ztclient_master
  SET status = 'B'
  WHERE client_id = 'CUST-0099'.

IF sy-subrc = 0.
  WRITE: / 'Status pelanggan berhasil diblokir. Baris diupdate:', sy-dbcnt.
ENDIF.
```

### 3. Perintah MODIFY (Operasi Upsert Cerdas)

Perintah `MODIFY` memeriksa Primary Key data: jika record sudah ada, sistem melakukan `UPDATE`; jika belum ada, sistem melakukan `INSERT`.

```abap
" Sangat ideal untuk proses sinkronisasi massal dari Internal Table
MODIFY ztclient_master FROM TABLE @lt_client_batch.
```

### 4. Perintah DELETE (Menghapus Data)

```abap
DELETE FROM ztclient_master WHERE client_id = 'CUST-0099'.
```

---

## 6. 🟡 Sintaks Modern ABAP 7.40+ / 7.50+ Open SQL

### Konsep

Revisi sintaks Open SQL sejak versi 7.40 menghadirkan kapabilitas setara database modern:

### 1. Escape Character `@` & Koma Pemisah Kolom

Pada sintaks baru, seluruh variabel lokal ABAP yang digunakan di dalam query **wajib diawali tanda `@`**, dan kolom hasil seleksi **wajib dipisahkan tanda koma**:

```abap
DATA lv_status TYPE c LENGTH 1 VALUE 'A'.

SELECT client_id, client_name
  FROM ztclient_master
  WHERE status = @lv_status
  INTO TABLE @DATA(lt_result).
```

### 2. Ekspresi Logika CASE di dalam Query

Anda dapat memetakan deskripsi nilai secara langsung di level database sebelum data dikirim ke memori program:

```abap
SELECT client_id,
       client_name,
       CASE status
         WHEN 'A' THEN 'Aktif'
         WHEN 'I' THEN 'Inaktif'
         ELSE 'Diblokir'
       END AS status_desc
  FROM ztclient_master
  INTO TABLE @DATA(lt_with_desc).
```

---

## 7. 🟡 Relasi Tabel: INNER JOIN & LEFT OUTER JOIN

### Konsep

Dalam sistem SAP, data dokumen biasanya terpecah menjadi dua tabel: tabel **Header** (informasi umum seperti tanggal dan pelanggan) dan tabel **Item** (rincian barang yang dibeli).

* Contoh: Tabel Standar `VBAK` (Sales Order Header) dan `VBAP` (Sales Order Items).

### Contoh Query INNER JOIN

```abap
REPORT z_sql_join.

SELECT h~vbeln,
       h~erdat,
       h~kunnr,
       i~posnr,
       i~matnr,
       i~kwmeng
  FROM vbak AS h
  INNER JOIN vbap AS i ON h~vbeln = i~vbeln
  WHERE h~erdat >= '20260101'
  ORDER BY h~vbeln, i~posnr
  INTO TABLE @DATA(lt_sales_orders)
  UP TO 50 ROWS.
```

---

## 8. 🟡 Teknik FOR ALL ENTRIES & Jebakan Fatalnya

### Konsep

Jika relasi antar tabel terlalu kompleks atau query `JOIN` membebani database, developer SAP menggunakan teknik **`FOR ALL ENTRIES`**. Teknik ini menggunakan sekumpulan data di internal table pendorong sebagai klausa filter pada query tabel kedua.

```abap
" Langkah 1: Tarik data Header terlebih dahulu
SELECT vbeln, kunnr FROM vbak WHERE erdat = @sy-datum INTO TABLE @DATA(lt_headers).

" Langkah 2: Tarik data Items yang HANYA berelasi dengan header di atas
IF lt_headers IS NOT INITIAL.
  SELECT vbeln, posnr, matnr, netwr
    FROM vbap
    FOR ALL ENTRIES IN @lt_headers
    WHERE vbeln = @lt_headers-vbeln
    INTO TABLE @DATA(lt_items).
ENDIF.
```

### Kesalahan Umum

❌ Memanggil `FOR ALL ENTRIES` tanpa mengecek apakah internal table pendorong kosong.

Jika tabel pendorong (`lt_headers`) kosong, klausa `WHERE` pada query **akan diabaikan sepenuhnya oleh sistem**, sehingga database akan menarik **SELURUH baris data yang ada di tabel database tanpa filter!** Hal ini menyebabkan crash kehabisan memori server (*Short Dump `TSV_TNEW_PAGE_ALLOC_FAILED`*).

✅ **Selalu bungkus dengan `IF <itab> IS NOT INITIAL.`** sebelum memanggil query `FOR ALL ENTRIES`.

Alasannya, pemeriksaan ini memastikan query hanya dieksekusi jika terdapat setidaknya satu record kunci pendorong.

---

## 9. 🟡 Transaksi Database & SAP LUW (COMMIT & ROLLBACK WORK)

### Konsep

Sistem ERP menangani transaksi uang dan barang bernilai tinggi. Jika Anda menyimpan pesanan penjualan yang terdiri dari 1 data header dan 10 rincian barang, tidak boleh terjadi kondisi di mana data header tersimpan namun itemnya gagal tersimpan akibat error jaringan.

SAP menggunakan konsep **SAP LUW (Logical Unit of Work)**:

```text
Eksekusi Program ABAP:
1. INSERT Header Pesanan Penjualan
2. INSERT 10 Baris Item Barang
3. UPDATE Stok Gudang
               │
      ┌────────┴────────┐
      ▼                 ▼
   Sukses?           Ada Error?
      │                 │
      ▼                 ▼
 COMMIT WORK;     ROLLBACK WORK;
 (Simpan Permanen) (Batalkan Seluruhnya)
```

* **`COMMIT WORK`**: Memvalidasi seluruh antrean update dan mengonfirmasikannya secara permanen ke database engine.
* **`ROLLBACK WORK`**: Membatalkan seluruh instruksi `INSERT`/`UPDATE`/`DELETE` yang terjadi sejak `COMMIT` terakhir dan mengembalikan kondisi data ke titik awal.

---

## 10. 🟡 Aturan Emas Kinerja Query (Performance Guidelines)

### Panduan Resmi Optimasi Query SAP

1. **Pilih Kolom Spesifik (Hindari `SELECT *`)**: Hanya tarik kolom yang benar-benar digunakan untuk meminimalkan beban I/O memori dan bandwidth jaringan.
2. **Hindari SELECT di Dalam LOOP**: Mengambil data satu per satu di dalam perulangan `LOOP AT` menciptakan masalah $N+1$ query. Tarik data sekaligus sebelum loop menggunakan `FOR ALL ENTRIES` atau `JOIN`, lalu baca di dalam loop menggunakan `READ TABLE ... BINARY SEARCH` atau Hashed Table.
3. **Manfaatkan Indeks Database**: Susun urutan klausa `WHERE` sesuai dengan kolom Primary Key atau Secondary Index yang terdaftar di `SE11`.
4. **Agregasi di Database**: Gunakan fungsi agregasi SQL bawaan (`SUM`, `AVG`, `COUNT`, `MAX`, `MIN`) di dalam perintah `SELECT` daripada menarik jutaan data lalu menjumlahkannya secara manual di dalam program ABAP.

---

## 11. 🛠️ Mini Project: Pemrosesan Status Pesanan Penjualan

### Tujuan

Membangun program pemrosesan transaksi pesanan penjualan (`ZREP_ORDER_PROCESSOR`). Program ini membaca pesanan berstatus `'OPEN'`, memvalidasi ketersediaan stok barang dari tabel database, mengupdate status pesanan menjadi `'PROCESSED'`, dan mengeksekusi konfirmasi transaksi menggunakan `COMMIT WORK` secara aman.

### Fitur

1. Penarikan data pesanan dan rincian item secara efisien menggunakan teknik `FOR ALL ENTRIES`.
2. Validasi konsistensi data sebelum melakukan modifikasi.
3. Update batch status dokumen menggunakan instruksi `UPDATE ... FROM TABLE`.
4. Manajemen transaksi aman menggunakan proteksi `COMMIT WORK` dan `ROLLBACK WORK`.
5. Cetak laporan log eksekusi pemrosesan database ke layar Basic List.

### Konsep yang Digunakan

* Query Open SQL modern dengan host variables `@`.
* Pencegahan tabel kosong pada `FOR ALL ENTRIES`.
* Penggunaan `sy-subrc` dan `sy-dbcnt` untuk verifikasi DML.
* Kontrol transaksi database atomik via `COMMIT WORK` / `ROLLBACK WORK`.

### Langkah Implementasi

1. **Tarik Header Pesanan**: Ambil data pesanan berstatus `'OPEN'` dari tabel transaksi.
2. **Validasi Keterisian**: Periksa `IF lt_headers IS NOT INITIAL`.
3. **Tarik Rincian Item**: Ambil rincian pesanan via `FOR ALL ENTRIES`.
4. **Kalkulasi & Update Status**: Ubah status menjadi `'PROCESSED'`.
5. **Eksekusi COMMIT**: Terapkan perubahan permanen ke database dan cetak ringkasan.

### Kode Lengkap Program

```abap
*&---------------------------------------------------------------------*
*& Report ZREP_ORDER_PROCESSOR
*&---------------------------------------------------------------------*
*& Mini Project: Pemrosesan Status Dokumen dengan Kontrol Transaksi LUW
*&---------------------------------------------------------------------*
REPORT zrep_order_processor LINE-SIZE 85.

*----------------------------------------------------------------------*
* 1. Definisi Tipe Data Lokal
*----------------------------------------------------------------------*
TYPES: BEGIN OF ty_order_header,
         order_id TYPE c LENGTH 10,
         customer TYPE string,
         status   TYPE c LENGTH 1,
       END OF ty_order_header.

TYPES: BEGIN OF ty_order_item,
         order_id TYPE c LENGTH 10,
         item_no  TYPE n LENGTH 4,
         matnr    TYPE c LENGTH 10,
         qty      TYPE i,
       END OF ty_order_item.

DATA: lt_headers TYPE STANDARD TABLE OF ty_order_header WITH EMPTY KEY,
      lt_items   TYPE STANDARD TABLE OF ty_order_item WITH EMPTY KEY.

*----------------------------------------------------------------------*
* 2. Logika Utama Pemrosesan
*----------------------------------------------------------------------*
START-OF-SELECTION.

  " Simulasi penarikan pesanan terbuka (Dalam sistem nyata: FROM ztorder_hdr)
  lt_headers = VALUE #(
    ( order_id = 'ORD-2026-1' customer = 'PT Surya Mandiri'  status = 'O' )
    ( order_id = 'ORD-2026-2' customer = 'CV Makmur Sejati'  status = 'O' )
  ).

  WRITE: / sy-uline(80).
  WRITE: / '|', (76) 'LOG PEMROSESAN TRANSAKSI DATABASE (SAP LUW)' CENTERED, '|'.
  WRITE: / sy-uline(80).

  " 1. Wajib cek ketersediaan data pendorong sebelum FOR ALL ENTRIES
  IF lt_headers IS NOT INITIAL.

    " Simulasi penarikan item transaksi (Dalam sistem nyata: FROM ztorder_itm)
    lt_items = VALUE #(
      ( order_id = 'ORD-2026-1' item_no = '0010' matnr = 'MAT-A1' qty = 10 )
      ( order_id = 'ORD-2026-1' item_no = '0020' matnr = 'MAT-B2' qty = 5  )
      ( order_id = 'ORD-2026-2' item_no = '0010' matnr = 'MAT-C3' qty = 2  )
    ).

    WRITE: / '| Ditemukan pesanan terbuka untuk diproses:', lines( lt_headers ), 'dokumen.', (23) ' ', '|'.
    WRITE: / '| Total rincian baris barang ditemukan    :', lines( lt_items ),   'item.   ', (23) ' ', '|'.
    WRITE: / sy-uline(80).

    " 2. Simulasi modifikasi status secara batch
    DATA(lv_error_flag) = abap_false.

    LOOP AT lt_headers ASSIGNING FIELD-SYMBOL(<fs_hdr>).
      <fs_hdr>-status = 'P'. " 'P' = Processed
    ENDLOOP.

    " 3. Eksekusi Kontrol Transaksi Database
    IF lv_error_flag = abap_false.
      " Simpan permanen ke database
      COMMIT WORK.
      WRITE: / '| STATUS EKSEKUSI: SUKSES PENUH. COMMIT WORK berhasil dijalankan.', (14) ' ', '|'.
    ELSE.
      " Batalkan seluruh perubahan jika terdeteksi anomali data
      ROLLBACK WORK.
      WRITE: / '| STATUS EKSEKUSI: GAGAL! ROLLBACK WORK dijalankan. Data dikembalikan.', (8) ' ', '|'.
    ENDIF.

  ELSE.
    WRITE: / '| Tidak ada pesanan berstatus terbuka untuk diproses hari ini.', (20) ' ', '|'.
  ENDIF.

  WRITE: / sy-uline(80).
```

### Hasil Akhir

```text
---------------------------------------------------------------------------------
|                    LOG PEMROSESAN TRANSAKSI DATABASE (SAP LUW)                |
---------------------------------------------------------------------------------
| Ditemukan pesanan terbuka untuk diproses:          2 dokumen.                 |
| Total rincian baris barang ditemukan    :          3 item.                    |
---------------------------------------------------------------------------------
| STATUS EKSEKUSI: SUKSES PENUH. COMMIT WORK berhasil dijalankan.               |
---------------------------------------------------------------------------------
```

---

## 12. 📚 Ringkasan & Peta Ingatan

### Peta Konsep ABAP Database & Open SQL

```text
Open SQL & Database Access
├── 1. Arsitektur & Keamanan
│   ├── Database Interface (Penerjemah Open SQL ke Native SQL dialek database)
│   ├── Client Handling (Otomatis filter MANDT per tenant)
│   └── Proteksi SQL Injection (Prepared statements bawaan)
├── 2. Operasi Query & Manipulasi
│   ├── SELECT SINGLE (1 record ke Work Area)
│   ├── SELECT INTO TABLE (Banyak record ke Internal Table)
│   └── DML Modifikasi (INSERT, UPDATE, MODIFY, DELETE)
├── 3. Relasi & Ekstraksi Lanjutan
│   ├── INNER & LEFT OUTER JOIN (Relasi multi-tabel langsung di DB)
│   └── FOR ALL ENTRIES (Wajib didahului pengecekan IS NOT INITIAL)
└── 4. Kinerja & Integritas Transaksi
    ├── SAP LUW (COMMIT WORK untuk konfirmasi, ROLLBACK WORK untuk pembatalan)
    └── Golden Rules (Hindari SELECT *, hindari query di dalam LOOP AT)
```

---

## 13. 📚 Cheat Code Database 10 Detik

```text
SELECT SINGLE * FROM tab WHERE k = @v INTO @DATA(wa).    → Menarik 1 record data
SELECT col1, col2 FROM tab INTO TABLE @DATA(itab).       → Menarik banyak data
INSERT tab FROM @wa.                                     → Menyisipkan baris baru
UPDATE tab SET col = @v WHERE k = @k.                    → Memperbarui data
MODIFY tab FROM TABLE @itab.                             → Upsert massal otomatis
COMMIT WORK.                                             → Simpan permanen transaksi
ROLLBACK WORK.                                           → Batalkan transaksi jika error
sy-subrc = 0                                             → Query berhasil menemukan data
sy-dbcnt                                                 → Jumlah baris yang diproses
```

---

## 14. 🧭 Urutan Belajar Selanjutnya

Setelah menguasai cara berinteraksi dengan database secara efisien, materi berikutnya berfokus pada pengorganisasian kode program ke dalam modul-modul yang dapat digunakan kembali dan integrasi antarmuka:

```text
1. 🟢 ABAP Dasar (Fondasi sintaks & kontrol alur)
      │
      ▼
2. 🟢 ABAP Data Dictionary (Struktur tabel & tipe data)
      │
      ▼
3. 🟢 ABAP Internal Tables (Manipulasi data in-memory)
      │
      ▼
4. 🟡 ABAP Database & Open SQL (Selesai pada modul ini)
      │
      ▼
5. 🟡 ABAP Modularization & Integration
   → Pelajari pengorganisasian kode dengan Function Groups, Function Modules, Remote Function Call (RFC), dan Business Application Programming Interface (BAPI).
      │
      ▼
6. 🟡 ABAP Reports & ALV Grid
   → Pelajari visualisasi data tabel interaktif menggunakan CL_SALV_TABLE.
```

Lanjutkan ke modul berikutnya: [[abap-modularization|ABAP Modularization & Integration]] (Modul 5).

---

## 15. 🔗 Referensi Resmi

* [SAP Help Portal — ABAP SQL (Open SQL) Overview](https://help.sap.com/docs/ABAP_PLATFORM/)
* [ABAP Keyword Documentation — ABAP SQL Reference](https://help.sap.com/doc/abapdocu_latest_index_htm/latest/en-US/index.htm)
* [SAP Community — Performance Guidelines for Open SQL](https://community.sap.com/)
