---
title: "ABAP Internal Tables"
description: "Panduan lengkap struktur data in-memory SAP ABAP: Standard Table, Sorted Table, Hashed Table, Work Area, Field Symbols, operasi tabel, hingga sintaks modern ABAP 7.40+ (VALUE, FOR, FILTER, Table Expressions)."
order: 3
tags:
  - programming
  - abap
  - sap
  - internal-tables
  - data-structure
  - fundamental
---

# ABAP Internal Tables

> **Target:** Pemula hingga intermediate yang ingin menguasai manipulasi struktur data array dinamis di memori program SAP ABAP.
> **Versi:** SAP NetWeaver AS ABAP 7.40+ / 7.50+ & SAP S/4HANA (kompatibel dengan sistem ECC 6.0).
> **Prasyarat:** Telah memahami tipe data dasar pada [[abap-dasar|ABAP Dasar]] dan struktur data pada [[abap-dictionary|ABAP Data Dictionary (DDIC)]].

---

## Gambaran Umum

Dalam aplikasi bisnis SAP, data yang dibaca dari database tidak diproses satu per satu di disk, melainkan ditarik sekaligus ke dalam memori RAM server program. Struktur data dinamis di memori inilah yang dinamakan **Internal Table**.

Internal Table adalah array dinamis multi-baris yang setiap barisnya memiliki struktur kolom identik. Di ABAP, Internal Table berfungsi sebagai media utama untuk menyimpan hasil query database, memfilter transaksi, melakukan kalkulasi batch, hingga mempersiapkan data sebelum ditampilkan ke layar pelaporan ALV Grid atau dikirim ke API eksternal.

---

## Cara Belajar

```text
🟢 Fundamental
→ Pahami 3 jenis Internal Table (Standard, Sorted, Hashed), Work Area vs Field Symbols, dan operasi dasar (APPEND, READ, LOOP, MODIFY).

🟡 Lanjutan
→ Kuasai optimasi pencarian biner, operasi agregasi COLLECT, dan sintaks ekspresi modern ABAP 7.40+ (Table Expressions, VALUE, FOR, FILTER).

🛠️ Praktik
→ Bangun mini project in-memory aggregation untuk mengelompokkan dan merekap total penjualan sales representatif.
```

Mental model perbandingan alokasi memori antara Work Area dan Internal Table:

```text
┌────────────────────────────────────────────────────────┐
│ WORK AREA (ls_item)                                    │
│ Menampung tepat 1 baris record data saat ini           │
│ [ MATNR: M-101  | MAKTX: Kabel LAN  | MENGE: 10 ]      │
└───────────────────────────┬────────────────────────────┘
                            │ APPEND (Menyisipkan baris)
                            │ LOOP AT ... INTO (Membaca per baris)
                            ▼
┌────────────────────────────────────────────────────────┐
│ INTERNAL TABLE (lt_items)                              │
│ Kumpulan n-baris data dinamis di memori RAM server    │
│ Baris 1: [ MATNR: M-101 | MAKTX: Kabel LAN | MENGE: 10]│
│ Baris 2: [ MATNR: M-102 | MAKTX: Router   | MENGE: 2 ] │
│ Baris 3: [ MATNR: M-103 | MAKTX: Switch   | MENGE: 5 ] │
└────────────────────────────────────────────────────────┘
```

**Hafalan:**

```text
Internal Table → Kumpulan baris record dinamis di RAM (setara List of Objects di bahasa lain)
Work Area      → Variabel penampung 1 baris data saat memproses baris internal table
Field Symbol   → Pointer penunjuk langsung ke alamat memori baris tabel (tanpa copy overhead)
Standard Table → Tabel linier default, pencarian linier O(N) atau biner O(log N) jika di-SORT
Sorted Table   → Tabel yang selalu terurut otomatis berdasarkan Primary Key, pencarian O(log N)
Hashed Table   → Tabel berbasis hashing tanpa nomor baris, pencarian konstan O(1) sangat cepat
sy-tabix       → Nomor indeks baris saat ini yang sedang dibaca dalam perulangan LOOP AT
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Konsep Internal Table & Work Area](#1--konsep-internal-table--work-area)
2. [Tiga Kategori Internal Table (Standard, Sorted, Hashed)](#2--tiga-kategori-internal-table-standard-sorted-hashed)
3. [Deklarasi Internal Table & Tipe Baris (TYPES & DATA)](#3--deklarasi-internal-table--tipe-baris-types--data)
4. [Menambah Data ke Tabel (APPEND & INSERT)](#4--menambah-data-ke-tabel-append--insert)
5. [Membaca Data Tunggal (READ TABLE & Binary Search)](#5--membaca-data-tunggal-read-table--binary-search)
6. [Perulangan Data (LOOP AT & sy-tabix)](#6--perulangan-data-loop-at--sy-tabix)
7. [Memperbarui & Menghapus Data (MODIFY & DELETE)](#7--memperbarui--menghapus-data-modify--delete)
8. [Mengurutkan Data (SORT) & Pengecekan Keberadaan](#8--mengurutkan-data-sort--pengecekan-keberadaan)

### 🟡 Lanjutan

9. [Field Symbols (ASSIGNING) vs Work Area](#9--field-symbols-assigning-vs-work-area)
10. [Agregasi Otomatis dengan Perintah COLLECT](#10--agregasi-otomatis-dengan-perintah-collect)
11. [Modern ABAP 7.40+: Table Expressions itab[...]](#11--modern-abap-740-table-expressions-itab)
12. [Modern ABAP 7.40+: Constructor Operator VALUE](#12--modern-abap-740-constructor-operator-value)
13. [Modern ABAP 7.40+: Iterasi & Komprehensif FOR IN](#13--modern-abap-740-iterasi--komprehensif-for-in)
14. [Modern ABAP 7.40+: Operator FILTER & CORRESPONDING](#14--modern-abap-740-operator-filter--corresponding)

### 🛠️ Praktik

15. [Mini Project: Agregasi & Rekap Penjualan In-Memory](#15-️-mini-project-agregasi--rekap-penjualan-in-memory)

### 📚 Ringkasan & Referensi

16. [Peta Ingatan & Ringkasan](#16--peta-ingatan--ringkasan)
17. [Cheat Code Internal Tables 10 Detik](#17--cheat-code-internal-tables-10-detik)
18. [Urutan Belajar Selanjutnya](#18--urutan-belajar-selanjutnya)
19. [Referensi Resmi](#19--referensi-resmi)

---

## 1. 🟢 Konsep Internal Table & Work Area

### Konsep

Dalam arsitektur ABAP klasik, instruksi kalkulasi dan manipulasi data tidak dapat langsung mengeksekusi operasi matematika pada internal table secara langsung. Sebagai gantinya, data dipindahkan baris per baris ke sebuah variabel perantara berdimensi tunggal yang disebut **Work Area**.

```text
              Internal Table (RAM)
           ┌────────────────────────┐
           │ Baris 1: ID 01 | Budi  │
           │ Baris 2: ID 02 | Sinta │ ──────┐
           │ Baris 3: ID 03 | Doni  │       │ LOOP AT ... INTO ls_wa
           └────────────────────────┘       │ (Membaca baris ke-2)
                                            ▼
                                     ┌──────────────────────┐
                                     │ Work Area: ls_wa     │
                                     │ ID: 02 | Nama: Sinta │
                                     └──────────────────────┘
```

> [!WARNING]
> **Larangan Header Lines:** Pada kode lama (ABAP 4.6c ke bawah), tabel dideklarasikan dengan `DATA itab TYPE TABLE OF ... WITH HEADER LINE`. Pola ini **dilarang keras** pada standar ABAP modern dan ABAP Objects karena nama tabel dan work area-nya sama persis sehingga rentan menimbulkan bug logika fatal. Selalu pisahkan secara eksplisit antara Internal Table (`lt_...`) dan Work Area (`ls_...`).

---

## 2. 🟢 Tiga Kategori Internal Table (Standard, Sorted, Hashed)

### Konsep

Memilih jenis internal table yang tepat adalah kunci utama performa program SAP.

| Kategori Tabel | Akses Kunci (*Key Access*) | Akses Indeks (*Index Access*) | Karakteristik & Kapan Digunakan |
| :--- | :---: | :---: | :--- |
| **`STANDARD TABLE`** | Linier $\mathcal{O}(N)$ atau Biner $\mathcal{O}(\log N)$ | Ya (`INDEX i`) | Jenis tabel default. Data disimpan urut sesuai waktu penambahan (`APPEND`). Ideal untuk data berukuran kecil hingga menengah atau data hasil query sederhana. |
| **`SORTED TABLE`** | Biner $\mathcal{O}(\log N)$ | Ya (`INDEX i`) | Data selalu otomatis terurut berdasarkan Primary Key setiap kali ada data baru disisipkan. Ideal untuk data master yang sering dicari berdasarkan kunci. |
| **`HASHED TABLE`** | Konstan $\mathcal{O}(1)$ | **Tidak** | Menggunakan algoritma hash internal. Sangat cepat tanpa terpengaruh ukuran data (100 record atau 1 juta record membutuhkan waktu pencarian yang sama persis). Wajib memiliki Unique Key. |

---

## 3. 🟢 Deklarasi Internal Table & Tipe Baris (TYPES & DATA)

### Konsep

Untuk membuat internal table, definisikan terlebih dahulu struktur tipe barisnya (`TYPES`), kemudian buat tabelnya menggunakan kata kunci `TYPE TABLE OF` atau `TYPE STANDARD TABLE OF`.

```abap
REPORT z_internal_table_decl.

" 1. Mendefinisikan struktur baris
TYPES: BEGIN OF ty_material,
         matnr TYPE c LENGTH 10,
         maktx TYPE string,
         price TYPE p LENGTH 8 DECIMALS 2,
       END OF ty_material.

" 2. Mendefinisikan tipe tabel
TYPES: tt_material TYPE STANDARD TABLE OF ty_material WITH EMPTY KEY.

" 3. Mendeklarasikan internal table dan work area
DATA: lt_materials TYPE tt_material,
      ls_material  TYPE ty_material.
```

---

## 4. 🟢 Menambah Data ke Tabel (APPEND & INSERT)

### Konsep

* `APPEND`: Menyisipkan satu record baris baru ke posisi **paling akhir** (hanya untuk `STANDARD TABLE`).
* `INSERT`: Menyisipkan satu record ke posisi indeks tertentu atau ke dalam `SORTED`/`HASHED TABLE` sesuai aturan kuncinya.

### Contoh Kode

```abap
REPORT z_itab_append.

TYPES: BEGIN OF ty_karyawan,
         nik  TYPE n LENGTH 4,
         nama TYPE string,
         dept TYPE string,
       END OF ty_karyawan.

DATA: lt_karyawan TYPE STANDARD TABLE OF ty_karyawan WITH EMPTY KEY,
      ls_karyawan TYPE ty_karyawan.

" Mengisi baris pertama via Work Area
ls_karyawan-nik  = '1001'.
ls_karyawan-nama = 'Rian Pratama'.
ls_karyawan-dept = 'IT Support'.
APPEND ls_karyawan TO lt_karyawan.

" Mengisi baris kedua
ls_karyawan-nik  = '1002'.
ls_karyawan-nama = 'Dewi Lestari'.
ls_karyawan-dept = 'Finance'.
APPEND ls_karyawan TO lt_karyawan.

" Membersihkan memori work area setelah dipakai
CLEAR ls_karyawan.

WRITE: / 'Jumlah data berhasil dimasukkan:', lines( lt_karyawan ).
```

### Output

```text
Jumlah data berhasil dimasukkan:          2
```

---

## 5. 🟢 Membaca Data Tunggal (READ TABLE & Binary Search)

### Konsep

Untuk mencari dan membaca tepat satu baris record dari internal table ke work area, gunakan perintah `READ TABLE`.
* Selalu evaluasi nilai **`sy-subrc`** segera setelah perintah ini dijalankan (`0` = data ditemukan, `4` = tidak ada data yang cocok).

### Optimasi BINARY SEARCH

Secara default, `READ TABLE` pada Standard Table melakukan penelusuran linier dari baris 1 sampai akhir. Jika tabel berisi puluhan ribu record, proses ini lambat. Gunakan klausa `BINARY SEARCH` untuk memangkas waktu pencarian secara drastis!

> [!IMPORTANT]
> **Aturan Wajib Binary Search:** Sebelum memanggil `READ TABLE ... BINARY SEARCH`, tabel **WAJIB diurutkan (`SORT`) terlebih dahulu** dengan urutan field kunci yang persis sama dengan kondisi `WITH KEY`. Jika tabel belum diurutkan, binary search akan menghasilkan data acak yang salah!

### Contoh Kode

```abap
REPORT z_itab_read.

TYPES: BEGIN OF ty_produk,
         kode TYPE c LENGTH 5,
         nama TYPE string,
       END OF ty_produk.

DATA: lt_produk TYPE STANDARD TABLE OF ty_produk WITH EMPTY KEY,
      ls_produk TYPE ty_produk.

lt_produk = VALUE #( ( kode = 'P003' nama = 'Monitor 24 Inch' )
                     ( kode = 'P001' nama = 'Keyboard Mechanical' )
                     ( kode = 'P002' nama = 'Wireless Mouse' ) ).

" 1. Wajib SORT sebelum BINARY SEARCH
SORT lt_produk BY kode ASCENDING.

" 2. Mencari produk dengan kode P002
READ TABLE lt_produk INTO ls_produk
  WITH KEY kode = 'P002'
  BINARY SEARCH.

IF sy-subrc = 0.
  WRITE: / 'Produk Ditemukan pada baris ke-', sy-tabix,
         / 'Nama Produk :', ls_produk-nama.
ELSE.
  WRITE: / 'Produk tidak ditemukan!'.
ENDIF.
```

### Output

```text
Produk Ditemukan pada baris ke-          2
Nama Produk : Wireless Mouse
```

---

## 6. 🟢 Perulangan Data (LOOP AT & sy-tabix)

### Konsep

Instruksi `LOOP AT ... INTO ... ENDLOOP` membaca isi internal table baris demi baris secara berurutan. Di setiap iterasi putaran, variabel sistem **`sy-tabix`** secara otomatis berisi nomor indeks baris yang sedang aktif.

### Contoh Kode

```abap
REPORT z_itab_loop.

TYPES: BEGIN OF ty_nilai,
         siswa TYPE string,
         skor  TYPE i,
       END OF ty_nilai.

DATA: lt_kelas TYPE STANDARD TABLE OF ty_nilai WITH EMPTY KEY,
      ls_siswa TYPE ty_nilai.

lt_kelas = VALUE #( ( siswa = 'Budi' skor = 90 )
                    ( siswa = 'Ani'  skor = 65 )
                    ( siswa = 'Cici' skor = 85 ) ).

" Menampilkan hanya siswa yang lulus (skor >= 70)
LOOP AT lt_kelas INTO ls_siswa WHERE skor >= 70.
  WRITE: / 'Baris Indeks Asli:', sy-tabix,
         '| Siswa:', (10) ls_siswa-siswa,
         '| Skor:', ls_siswa-skor.
ENDLOOP.
```

### Output

```text
Baris Indeks Asli:          1 | Siswa: Budi       | Skor:         90
Baris Indeks Asli:          3 | Siswa: Cici       | Skor:         85
```

---

## 7. 🟢 Memperbarui & Menghapus Data (MODIFY & DELETE)

### Konsep

* `MODIFY`: Memperbarui nilai record di internal table.
* `DELETE`: Menghapus baris record dari internal table berdasarkan nomor indeks (`INDEX`) atau kriteria kondisi logika (`WHERE`).

### Contoh Kode

```abap
REPORT z_itab_modify_delete.

TYPES: BEGIN OF ty_task,
         id     TYPE i,
         status TYPE string,
       END OF ty_task.

DATA: lt_tasks TYPE STANDARD TABLE OF ty_task WITH EMPTY KEY,
      ls_task  TYPE ty_task.

lt_tasks = VALUE #( ( id = 1 status = 'OPEN' )
                    ( id = 2 status = 'PENDING' )
                    ( id = 3 status = 'CLOSED' ) ).

" 1. Mengubah status baris ke-2 menjadi 'DONE'
ls_task-id     = 2.
ls_task-status = 'DONE'.
MODIFY lt_tasks FROM ls_task INDEX 2.

" 2. Menghapus semua task yang statusnya 'CLOSED'
DELETE lt_tasks WHERE status = 'CLOSED'.

LOOP AT lt_tasks INTO ls_task.
  WRITE: / 'Task ID:', ls_task-id, '| Status:', ls_task-status.
ENDLOOP.
```

### Output

```text
Task ID:          1 | Status: OPEN
Task ID:          2 | Status: DONE
```

---

## 8. 🟢 Mengurutkan Data (SORT) & Pengecekan Keberadaan

### Konsep

Instruksi `SORT` menyusun ulang urutan baris di dalam internal table. Anda dapat mengurutkan berdasarkan satu kolom atau kombinasi beberapa kolom secara menaik (`ASCENDING`) atau menurun (`DESCENDING`).

```abap
" Mengurutkan berdasarkan departemen A-Z, lalu gaji tertinggi ke terendah
SORT lt_karyawan BY dept ASCENDING gaji DESCENDING.
```

### Menghapus Duplikasi Data (`DELETE ADJACENT DUPLICATES`)

Untuk membuang data duplikat secara efisien:

```abap
" Wajib di-SORT terlebih dahulu sebelum menghapus data ganda yang bersebelahan
SORT lt_kota BY nama_kota.
DELETE ADJACENT DUPLICATES FROM lt_kota COMPARING nama_kota.
```

---

## 9. 🟡 Field Symbols (ASSIGNING) vs Work Area

### Konsep

Ketika melakukan perulangan `LOOP AT ... INTO ls_wa`, sistem SAP menduplikasi (meng-copy) setiap bit data dari tabel ke variabel work area di setiap putaran iterasi. Pada tabel dengan 100.000 baris atau kolom yang sangat lebar, biaya copy memori ini sangat boros CPU.

**Field Symbols** (`<fs_wa>`) berfungsi sebagai *memory pointer*. Dengan `LOOP AT ... ASSIGNING <fs_wa>`, Field Symbol langsung menunjuk ke alamat fisik baris data di dalam tabel tanpa melakukan copy sama sekali!

```text
Pendekatan INTO (Copy):
Internal Table [Baris Data] ──(Copy Nilai)──> Work Area [Variabel Terpisah]

Pendekatan ASSIGNING (Pointer):
Internal Table [Baris Data] <───(Menunjuk Langsung)─── Field Symbol <fs>
```

### Contoh Kode Perbandingan

```abap
REPORT z_field_symbols.

TYPES: BEGIN OF ty_akun,
         user_id TYPE string,
         poin    TYPE i,
       END OF ty_akun.

DATA lt_akun TYPE STANDARD TABLE OF ty_akun WITH EMPTY KEY.

lt_akun = VALUE #( ( user_id = 'USER_A' poin = 100 )
                   ( user_id = 'USER_B' poin = 200 ) ).

" FIELD-SYMBOL langsung menunjuk memori tabel
FIELD-SYMBOLS <fs_akun> TYPE ty_akun.

LOOP AT lt_akun ASSIGNING <fs_akun>.
  " Mengubah nilai langsung pada tabel tanpa perlu perintah MODIFY!
  <fs_akun>-poin = <fs_akun>-poin + 50.
ENDLOOP.

LOOP AT lt_akun ASSIGNING <fs_akun>.
  WRITE: / 'User:', <fs_akun>-user_id, '| Poin Baru:', <fs_akun>-poin.
ENDLOOP.
```

### Output

```text
User: USER_A | Poin Baru:        150
User: USER_B | Poin Baru:        250
```

---

## 10. 🟡 Agregasi Otomatis dengan Perintah COLLECT

### Konsep

Perintah `COLLECT` digunakan untuk menjumlahkan (*accumulate*) nilai numerik secara otomatis berdasarkan kombinasi kolom non-numerik yang bertindak sebagai *key*.

Jika baris dengan key tersebut belum ada di tabel, `COLLECT` akan bertindak seperti `APPEND`. Namun jika key sudah ada, `COLLECT` tidak akan membuat baris baru, melainkan menjumlahkan nilai kolom numeriknya!

> [!IMPORTANT]
> **Aturan Tipe Data Baris (Line Type) COLLECT:**
> Tipe baris tabel internal pada `COLLECT` **wajib bertipe flat** (panjang tetap, seperti `c LENGTH n`, `d`, `n`). Penggunaan tipe dinamis (*deep components*) seperti `STRING`, `XSTRING`, atau tabel bersarang dilarang keras dan akan memicu *syntax check error* atau *runtime dump* `ITAB_ILLEGAL_COLLECT`. Selain itu, seluruh kolom non-kunci wajib bertipe numerik (`i`, `p`, `f`).

### Contoh Kode

```abap
REPORT z_itab_collect.

TYPES: BEGIN OF ty_rekap,
         cabang TYPE c LENGTH 20,
         omset  TYPE p LENGTH 9 DECIMALS 2,
       END OF ty_rekap.

DATA: lt_rekap TYPE STANDARD TABLE OF ty_rekap WITH EMPTY KEY,
      ls_rekap TYPE ty_rekap.

ls_rekap = VALUE #( cabang = 'Jakarta' omset = '1000000' ).
COLLECT ls_rekap INTO lt_rekap.

ls_rekap = VALUE #( cabang = 'Surabaya' omset = '500000' ).
COLLECT ls_rekap INTO lt_rekap.

" Jakarta masuk lagi -> omset otomatis diakumulasikan!
ls_rekap = VALUE #( cabang = 'Jakarta' omset = '2000000' ).
COLLECT ls_rekap INTO lt_rekap.

LOOP AT lt_rekap INTO ls_rekap.
  WRITE: / 'Cabang:', (10) ls_rekap-cabang, '| Total Omset: Rp', ls_rekap-omset.
ENDLOOP.
```

### Output

```text
Cabang: Jakarta    | Total Omset: Rp       3.000.000,00
Cabang: Surabaya   | Total Omset: Rp         500.000,00
```

---

## 11. 🟡 Modern ABAP 7.40+: Table Expressions itab[...]

### Konsep

Di ABAP modern, Anda tidak perlu lagi menulis 4 baris perintah `READ TABLE ... INTO ... IF sy-subrc = 0`. Anda dapat mengakses baris record layaknya mengakses array menggunakan tanda kurung siku `itab[ ... ]`.

```abap
REPORT z_table_expressions.

TYPES: BEGIN OF ty_cust,
         id   TYPE i,
         nama TYPE string,
       END OF ty_cust.

TYPES tt_cust TYPE STANDARD TABLE OF ty_cust WITH EMPTY KEY.

DATA(lt_cust) = VALUE tt_cust(
  ( id = 101 nama = 'PT Samudera' )
  ( id = 102 nama = 'CV Perkasa' )
).

" 1. Membaca baris pertama via Indeks
DATA(ls_first) = lt_cust[ 1 ].
WRITE: / 'Baris 1:', ls_first-nama.

" 2. Membaca langsung satu nilai field dengan kondisi Key
DATA(lv_nama) = lt_cust[ id = 102 ]-nama.
WRITE: / 'Hasil Cari ID 102:', lv_nama.

" 3. Penanganan data tidak ditemukan menggunakan OPTIONAL
DATA(lv_safe) = VALUE #( lt_cust[ id = 999 ]-nama OPTIONAL ).
IF lv_safe IS INITIAL.
  WRITE: / 'Data ID 999 aman ditangani tanpa crash runtime!'.
ENDIF.
```

---

## 12. 🟡 Modern ABAP 7.40+: Constructor Operator VALUE

### Konsep

Operator `VALUE #( ... )` mengisi internal table secara instan dengan puluhan data tanpa memerlukan perulangan `APPEND` berulang kali:

```abap
DATA lt_angka TYPE STANDARD TABLE OF i WITH EMPTY KEY.

" Mengisi data secara deklaratif
lt_angka = VALUE #( ( 10 ) ( 20 ) ( 30 ) ( 40 ) ( 50 ) ).
```

---

## 13. 🟡 Modern ABAP 7.40+: Iterasi & Komprehensif FOR IN

### Konsep

Operator `FOR ... IN` memungkinkan transformasi data (*mapping*) dari satu internal table ke internal table lain secara fungsional dalam satu baris ekspresi (mirip *List Comprehension* di Python):

```abap
REPORT z_for_comprehension.

TYPES: BEGIN OF ty_raw,
         angka TYPE i,
       END OF ty_raw.

TYPES tt_raw TYPE STANDARD TABLE OF ty_raw WITH EMPTY KEY.

DATA(lt_awal) = VALUE tt_raw( ( angka = 2 ) ( angka = 4 ) ( angka = 6 ) ).

" Mengalikan setiap elemen dengan 10 ke tabel baru secara instan
DATA(lt_hasil) = VALUE tt_raw(
  FOR ls IN lt_awal ( angka = ls-angka * 10 )
).

LOOP AT lt_hasil INTO DATA(ls_out).
  WRITE: / 'Nilai Baru:', ls_out-angka.
ENDLOOP.
```

---

## 14. 🟡 Modern ABAP 7.40+: Operator FILTER & CORRESPONDING

### Konsep

* `FILTER`: Menyaring isi tabel bertipe `SORTED` atau `HASHED` berdasarkan nilai kunci tertentu tanpa memerlukan blok `LOOP AT WHERE`.
* `CORRESPONDING`: Memetakan field yang memiliki nama sama persis antar dua struktur atau tabel yang berbeda skemanya.

```abap
" Memindahkan kolom-kolom yang bernama identik secara otomatis
DATA(lt_target) = CORRESPONDING tt_target_type( lt_source_type ).
```

---

## 15. 🛠️ Mini Project: Agregasi & Rekap Penjualan In-Memory

### Tujuan

Membangun program pemrosesan data transaksi penjualan in-memory (`ZREP_SALES_AGGREGATION`). Program ini mensimulasikan sekumpulan transaksi faktur kotor dari berbagai sales representatif, lalu melakukan pemilahan, pengurutan, kalkulasi komisi dinamis menggunakan Field Symbols, dan agregasi total omset per wiraniaga menggunakan perintah `COLLECT`.

### Fitur

1. Inisialisasi data transaksi penjualan dummy secara instan menggunakan operator modern `VALUE #( )`.
2. Pengurutan data transaksi berdasarkan tanggal dan nama sales representatif.
3. Kalkulasi komisi otomatis 5% menggunakan `FIELD-SYMBOLS` untuk performa memori tinggi tanpa salinan data.
4. Agregasi total omset dan komisi per nama sales representatif menggunakan `COLLECT`.
5. Cetak laporan tabular rapi ke layar Basic List.

### Konsep yang Digunakan

* Deklarasi `TYPES` bertingkat untuk transaksi rincian dan rekap agregat.
* Operator konstruktor `VALUE #( )` modern.
* Manipulasi in-place menggunakan `FIELD-SYMBOLS (<fs_wa>)`.
* Perintah agregasi `COLLECT`.
* Pengurutan data via `SORT ... BY`.
* Format visualisasi tabel terpusat via `WRITE`.

### Langkah Implementasi

1. **Definisikan Struktur Data**: Buat `ty_transaksi` (rincian nota) dan `ty_rekap_sales` (ringkasan total per orang).
2. **Siapkan Data Mentah**: Isi internal table transaksi menggunakan `VALUE #( )`.
3. **Kalkulasi Komisi**: Iterasi tabel transaksi menggunakan `ASSIGNING <fs_trx>` untuk menghitung komisi 5%.
4. **Agregasikan ke Tabel Rekap**: Gunakan loop dan perintah `COLLECT` ke dalam tabel rekap.
5. **Cetak Hasil**: Tampilkan laporan rincian transaksi dan ringkasan total komisi.

### Kode Lengkap Program

```abap
*&---------------------------------------------------------------------*
*& Report ZREP_SALES_AGGREGATION
*&---------------------------------------------------------------------*
*& Mini Project: Pemrosesan & Agregasi Data Penjualan In-Memory
*&---------------------------------------------------------------------*
REPORT zrep_sales_aggregation LINE-SIZE 85.

*----------------------------------------------------------------------*
* 1. Definisi Tipe Data
*----------------------------------------------------------------------*
TYPES: BEGIN OF ty_transaksi,
         no_faktur TYPE c LENGTH 8,
         salesman  TYPE c LENGTH 25,
         nominal   TYPE p LENGTH 9 DECIMALS 2,
         komisi    TYPE p LENGTH 8 DECIMALS 2,
       END OF ty_transaksi.

TYPES: BEGIN OF ty_rekap_sales,
         salesman     TYPE c LENGTH 25,
         total_omset  TYPE p LENGTH 9 DECIMALS 2,
         total_komisi TYPE p LENGTH 8 DECIMALS 2,
       END OF ty_rekap_sales.

TYPES: tt_transaksi   TYPE STANDARD TABLE OF ty_transaksi WITH EMPTY KEY,
       tt_rekap_sales TYPE STANDARD TABLE OF ty_rekap_sales WITH EMPTY KEY.

*----------------------------------------------------------------------*
* 2. Logika Utama Program
*----------------------------------------------------------------------*
START-OF-SELECTION.

  " Mengisi 5 data transaksi penjualan mentah
  DATA(lt_trx) = VALUE tt_transaksi(
    ( no_faktur = 'INV-001' salesman = 'Budi Santoso' nominal = '15000000' )
    ( no_faktur = 'INV-002' salesman = 'Dewi Lestari' nominal = '20000000' )
    ( no_faktur = 'INV-003' salesman = 'Budi Santoso' nominal = '10000000' )
    ( no_faktur = 'INV-004' salesman = 'Dewi Lestari' nominal = '5000000'  )
    ( no_faktur = 'INV-005' salesman = 'Agus Wijaya'  nominal = '30000000' )
  ).

  DATA: lt_rekap TYPE tt_rekap_sales,
        ls_rekap TYPE ty_rekap_sales.

  FIELD-SYMBOLS <fs_trx> TYPE ty_transaksi.

  " 1. Hitung komisi 5% langsung pada memori tabel via Field Symbols
  LOOP AT lt_trx ASSIGNING <fs_trx>.
    <fs_trx>-komisi = <fs_trx>-nominal * '0.05'.

    " 2. Akumulasikan ke tabel rekap menggunakan COLLECT
    ls_rekap-salesman     = <fs_trx>-salesman.
    ls_rekap-total_omset  = <fs_trx>-nominal.
    ls_rekap-total_komisi = <fs_trx>-komisi.
    COLLECT ls_rekap INTO lt_rekap.
  ENDLOOP.

  " 3. Urutkan rekap berdasarkan total omset tertinggi
  SORT lt_rekap BY total_omset DESCENDING.

  " 4. Cetak Rincian Transaksi
  WRITE: / sy-uline(80).
  WRITE: / '|', (76) 'DAFTAR TRANSAKSI PENJUALAN MASUK' CENTERED, '|'.
  WRITE: / sy-uline(80).
  WRITE: / '| No Faktur | Sales Representative   | Nilai Omset (Rp)    | Komisi 5% (Rp)      |'.
  WRITE: / sy-uline(80).

  LOOP AT lt_trx ASSIGNING <fs_trx>.
    WRITE: / '|', (10) <fs_trx>-no_faktur,
             '|', (23) <fs_trx>-salesman,
             '|', (19) <fs_trx>-nominal,
             '|', (19) <fs_trx>-komisi, '|'.
  ENDLOOP.

  " 5. Cetak Hasil Agregasi Rekap
  WRITE: / sy-uline(80).
  SKIP 1.
  WRITE: / sy-uline(80).
  WRITE: / '|', (76) 'REKAPITULASI TOTAL KOMISI PER SALES (HASIL COLLECT)' CENTERED, '|'.
  WRITE: / sy-uline(80).
  WRITE: / '| Peringkat | Nama Wiraniaga         | Total Omset Bersih  | Total Komisi Didapat|'.
  WRITE: / sy-uline(80).

  LOOP AT lt_rekap INTO ls_rekap.
    WRITE: / '|', (9) sy-tabix,
             '|', (23) ls_rekap-salesman,
             '|', (19) ls_rekap-total_omset,
             '|', (19) ls_rekap-total_komisi, '|'.
  ENDLOOP.
  WRITE: / sy-uline(80).
```

### Hasil Akhir

```text
---------------------------------------------------------------------------------
|                       DAFTAR TRANSAKSI PENJUALAN MASUK                        |
---------------------------------------------------------------------------------
| No Faktur | Sales Representative   | Nilai Omset (Rp)    | Komisi 5% (Rp)      |
---------------------------------------------------------------------------------
| INV-001    | Budi Santoso            |       15.000.000,00 |          750.000,00 |
| INV-002    | Dewi Lestari            |       20.000.000,00 |        1.000.000,00 |
| INV-003    | Budi Santoso            |       10.000.000,00 |          500.000,00 |
| INV-004    | Dewi Lestari            |        5.000.000,00 |          250.000,00 |
| INV-005    | Agus Wijaya             |       30.000.000,00 |        1.500.000,00 |
---------------------------------------------------------------------------------

---------------------------------------------------------------------------------
|             REKAPITULASI TOTAL KOMISI PER SALES (HASIL COLLECT)               |
---------------------------------------------------------------------------------
| Peringkat | Nama Wiraniaga         | Total Omset Bersih  | Total Komisi Didapat|
---------------------------------------------------------------------------------
|         1 | Agus Wijaya            |       30.000.000,00 |        1.500.000,00 |
|         2 | Dewi Lestari           |       25.000.000,00 |        1.250.000,00 |
|         3 | Budi Santoso           |       25.000.000,00 |        1.250.000,00 |
---------------------------------------------------------------------------------
```

---

## 16. 📚 Ringkasan & Peta Ingatan

### Peta Konsep ABAP Internal Tables

```text
Internal Tables (Array Dinamis In-Memory)
├── 1. Kategori Tabel
│   ├── Standard Table (Fleksibel, APPEND di akhir, penelusuran linier / biner)
│   ├── Sorted Table (Terurut otomatis sesuai Primary Key, pencarian biner O(log N))
│   └── Hashed Table (Akses kunci O(1) konstan via algoritma hashing)
├── 2. Operasi Klasik
│   ├── Manipulasi Baris (APPEND, INSERT, MODIFY, DELETE)
│   ├── Pembacaan Data (READ TABLE itab INTO wa BINARY SEARCH)
│   └── Perulangan (LOOP AT itab INTO wa / ASSIGNING <fs_wa>)
├── 3. Optimasi Performa
│   ├── Wajib SORT sebelum BINARY SEARCH
│   └── Gunakan FIELD-SYMBOLS (<fs>) untuk menghindari copy memori besar
└── 4. Modern ABAP (7.40+)
    ├── Table Expressions itab[ key = val ]
    ├── Constructor Operator VALUE #( )
    ├── Komprehensif FOR ... IN
    └── Filter dinamis FILTER & CORRESPONDING
```

---

## 17. 📚 Cheat Code Internal Tables 10 Detik

```text
APPEND wa TO itab.               → Menambah baris baru di posisi paling akhir
READ TABLE itab INTO wa KEY k=v. → Membaca 1 record data tunggal
SORT itab BY col1 ASCENDING.     → Mengurutkan baris tabel
LOOP AT itab ASSIGNING <fs>.     → Iterasi performa tinggi via pointer memori
COLLECT wa INTO itab.            → Akumulasi nilai numerik otomatis berdasarkan key
DELETE itab WHERE col = val.     → Menghapus baris sesuai kondisi logika
lines( itab )                    → Menghitung jumlah total baris record tabel
itab[ key = val ]                → Mengambil record dengan Table Expression modern
VALUE #( ( val1 ) ( val2 ) )     → Inisialisasi isi tabel sebaris instan (ABAP 7.40+)
```

---

## 18. 🧭 Urutan Belajar Selanjutnya

Setelah menguasai pengolahan data array di dalam memori program, langkah berikutnya adalah mempelajari bagaimana data tersebut diambil secara efisien dari basis data relasional:

```text
1. 🟢 ABAP Dasar (Fondasi sintaks & kontrol alur)
      │
      ▼
2. 🟢 ABAP Data Dictionary (Struktur tabel & tipe data)
      │
      ▼
3. 🟢 ABAP Internal Tables (Selesai pada modul ini)
      │
      ▼
4. 🟡 ABAP Database & Open SQL
   → Pelajari cara membaca ribuan record dari database ke internal table dengan SELECT, Join, FOR ALL ENTRIES, dan transaksi LUW.
      │
      ▼
5. 🟡 ABAP Modularization & Integration
   → Pelajari pengorganisasian kode ke Function Modules, RFC, dan BAPI.
```

Lanjutkan ke modul berikutnya: [[abap-database|ABAP Database Access & Open SQL]] (Modul 4).

---

## 19. 🔗 Referensi Resmi

* [SAP Help Portal — Internal Tables in ABAP](https://help.sap.com/docs/ABAP_PLATFORM/)
* [ABAP Keyword Documentation — Processing Internal Tables](https://help.sap.com/doc/abapdocu_latest_index_htm/latest/en-US/index.htm)
* [SAP Community — Performance Guidelines for Internal Tables and Field Symbols](https://community.sap.com/)
