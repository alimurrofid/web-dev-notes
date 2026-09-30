---
title: "ABAP Data Dictionary (DDIC)"
description: "Panduan lengkap ABAP Data Dictionary (DDIC): Domain, Data Element, Transparent Table, Technical Settings, Foreign Key, Search Help, Lock Object, hingga Table Maintenance Generator (TMG)."
order: 2
tags:
  - programming
  - abap
  - sap
  - database
  - ddic
  - fundamental
---

# ABAP Data Dictionary (DDIC)

> **Target:** Pemula yang ingin menguasai pemodelan database, metadata, dan integritas data pada sistem SAP ERP (ECC & S/4HANA).
> **Versi:** SAP NetWeaver AS ABAP 7.40+ / 7.50+ & SAP S/4HANA (T-Code `SE11`, `SE16N`, `SM30`, `SM12`).
> **Prasyarat:** Telah memahami konsep dasar arsitektur SAP dan tipe data bawaan pada modul [[abap-dasar|ABAP Dasar]].

---

## Gambaran Umum

**ABAP Data Dictionary (DDIC)** adalah repositori metadata terpusat di dalam SAP NetWeaver Application Server yang dikelola melalui Transaction Code **`SE11`**. Berbeda dengan basis data relasional konvensional di mana tabel dibuat langsung melalui perintah DDL (`CREATE TABLE`), sistem SAP mengisolasi seluruh pendefinisian database melalui lapisan abstraksi DDIC.

Ketika seorang developer mendefinisikan tabel di DDIC, SAP secara otomatis:
1. Menghasilkan struktur fisik tabel pada database underlying (SAP HANA, Oracle, DB2, atau SQL Server) secara independen.
2. Menyediakan teks antarmuka (*UI field labels*) multibahasa tanpa perlu hardcoding di program aplikasi.
3. Menegakkan integritas referensial data (*foreign key*) dan validasi domain secara konsisten di seluruh modul SAP.
4. Mengelola penguncian data (*concurrency locking*) dan mekanisme caching di memori server (*database buffering*).

---

## Cara Belajar

```text
🟢 Fundamental
→ Pahami 3 lapisan pemodelan data (Domain → Data Element → Table Field), Transparent Table, dan Primary Key MANDT.

🟡 Lanjutan
→ Kuasai Technical Settings (Data Class & Size Category), Foreign Key Relationships, Search Help (F4), dan Lock Objects (SM12).

🛠️ Praktik
→ Bangun tabel database kustom Z-Table lengkap dengan Table Maintenance Generator (TMG) yang dapat diakses via T-Code SM30.
```

Mental model hirarki pemodelan data di ABAP Dictionary:

```text
       ┌────────────────────────────────────────────────────────┐
       │ 1. Domain (Karakteristik Teknis Murni)                 │
       │    - Tipe data teknis (CHAR, NUMC, DATS, CURR, DEC)    │
       │    - Panjang karakter (Length) & Desimal               │
       │    - Nilai valid tetap (Fixed Values / Dropdown)       │
       └───────────────────────────┬────────────────────────────┘
                                   │ Menjadi basis teknis untuk
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │ 2. Data Element (Semantik Bisnis & Antarmuka GUI)      │
       │    - Label teks UI (Short 10, Med 20, Long 40, Header) │
       │    - Parameter ID (SPA/GPA Memory)                     │
       │    - Dokumentasi F1 Help pengguna                      │
       └───────────────────────────┬────────────────────────────┘
                                   │ Digunakan sebagai kolom pada
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │ 3. Table Field (Struktur Tabel Database / SE11)        │
       │    - Menampung nama kolom (Field Name)                 │
       │    - Menandai Primary Key                              │
       │    - Menghubungkan Foreign Key & Search Help           │
       └───────────────────────────┬────────────────────────────┘
                                   │ Diterjemahkan oleh Database Interface
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │ 4. Physical Database Layer (SAP HANA / AnyDB)          │
       │    - Tabel fisik di database underlying                │
       └────────────────────────────────────────────────────────┘
```

**Hafalan:**

```text
SE11           → T-Code utama ABAP Dictionary untuk mengelola Domain, Data Element, dan Tabel
Domain         → Definisi teknis murni (tipe dasar, panjang memori, nilai valid/fixed values)
Data Element   → Definisi makna bisnis (label teks UI untuk layar SAP GUI, bantuan F1)
MANDT          → Kolom Primary Key pertama wajib pada tabel Client-Dependent
Technical Set. → Pengaturan memori database (Data Class & Size Category via SE13)
Foreign Key    → Penegakan integritas data input terhadap Check Table
TMG            → Table Maintenance Generator: layar entri data otomatis via T-Code SM30
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan ABAP Dictionary & T-Code SE11](#1--pengenalan-abap-dictionary--t-code-se11)
2. [Tiga Lapisan Pemodelan Data (Domain, Data Element, Field)](#2--tiga-lapisan-pemodelan-data-domain-data-element-field)
3. [Mendefinisikan Domain (Tipe Teknis & Fixed Values)](#3--mendefinisikan-domain-tipe-teknis--fixed-values)
4. [Mendefinisikan Data Element (Makna Bisnis & Field Labels)](#4--mendefinisikan-data-element-makna-bisnis--field-labels)
5. [Tabel Database Transparan (Transparent Tables)](#5--tabel-database-transparan-transparent-tables)
6. [Field MANDT & Konsep Client-Dependent](#6--field-mandt--konsep-client-dependent)
7. [Technical Settings (Data Class & Size Category)](#7--technical-settings-data-class--size-category)

### 🟡 Lanjutan

8. [Database Buffering & Logging Perubahan Data](#8--database-buffering--logging-perubahan-data)
9. [Foreign Key & Integritas Relasional (Check Table)](#9--foreign-key--integritas-relasional-check-table)
10. [Struktur (Structures) & Table Types](#10--struktur-structures--table-types)
11. [Search Help (F4 Input Help)](#11--search-help-f4-input-help)
12. [Lock Objects (Mekanisme Penguncian Data & SM12)](#12--lock-objects-mekanisme-penguncian-data--sm12)
13. [Table Maintenance Generator (TMG & SM30)](#13--table-maintenance-generator-tmg--sm30)
14. [Database Views di DDIC](#14--database-views-di-ddic)

### 🛠️ Praktik

15. [Mini Project: Membangun Master Data Pelanggan](#15-️-mini-project-membangun-master-data-pelanggan)

### 📚 Ringkasan & Referensi

16. [Peta Ingatan & Ringkasan](#16--peta-ingatan--ringkasan)
17. [Cheat Code DDIC 10 Detik](#17--cheat-code-ddic-10-detik)
18. [Urutan Belajar Selanjutnya](#18--urutan-belajar-selanjutnya)
19. [Referensi Resmi](#19--referensi-resmi)

---

## 1. 🟢 Pengenalan ABAP Dictionary & T-Code SE11

### Konsep

Di database tradisional seperti PostgreSQL atau MySQL, skema tabel dibuat langsung menggunakan script SQL. Namun dalam ekosistem SAP, seluruh objek database dikelola melalui **ABAP Dictionary** via Transaction Code **`SE11`**.

ABAP Dictionary bertindak sebagai *single source of truth* untuk seluruh struktur data di sistem SAP.

```text
               Pengembang ABAP (T-Code SE11)
                             │
                             ▼
               ┌───────────────────────────┐
               │  ABAP Data Dictionary     │
               └─────────────┬─────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
   Program Aplikasi ABAP          Database Interface
   - Type Checking Kompilasi      - Menghasilkan DDL native
   - Label Input Otomatis         - Mengelola Sinkronisasi
   - Validasi Input F4 / F1       - Mengatur Caching Memori
                                            │
                                            ▼
                                  SAP HANA / Database Fisik
```

### Mengapa ABAP Dictionary Sangat Penting?

1. **Database Independence**: Program ABAP yang Anda tulis tidak terikat pada satu vendor database tertentu (dapat berjalan di SAP HANA, Oracle, DB2, maupun SQL Server tanpa mengubah kode).
2. **Kamus Multibahasa Terpusat**: Label kolom (misal: "Nomor Pelanggan" dalam Bahasa Indonesia, "Customer Number" dalam Bahasa Inggris) disimpan di DDIC. Layar SAP GUI otomatis menampilkan bahasa yang sesuai dengan preferensi login user.
3. **Pemeriksaan Konsistensi Terpadu**: Jika struktur tabel diubah, kompiler ABAP langsung mendeteksi seluruh program yang terpengaruh dan menandainya untuk kompilasi ulang.

---

## 2. 🟢 Tiga Lapisan Pemodelan Data (Domain, Data Element, Field)

### Konsep

Salah satu konsep paling elegan namun kerap membingungkan pemula di SAP adalah pemisahan antara **Domain**, **Data Element**, dan **Table Field**.

```text
┌────────────────────────────────────────────────────────┐
│ DOMAIN: ZDM_STATUS                                     │
│ → Karakteristik teknis: Tipe CHAR, Panjang 1           │
│ → Fixed Values: 'A' = Aktif, 'I' = Inaktif             │
└───────────────────────────┬────────────────────────────┘
                            │ Digunakan oleh
                            ▼
┌────────────────────────────────────────────────────────┐
│ DATA ELEMENT: ZDE_CUST_STATUS                          │
│ → Makna bisnis: Status Akun Pelanggan                 │
│ → UI Label: "Status Pelanggan"                         │
└───────────────────────────┬────────────────────────────┘
                            │ Digunakan pada tabel
                            ▼
┌────────────────────────────────────────────────────────┐
│ TABLE FIELD: ZTCUST-STATUS                             │
│ → Kolom konkret pada tabel fisik ZTCUST                │
└────────────────────────────────────────────────────────┘
```

### Perbedaan Peran Ketiganya

| Lapisan | Fokus Utama | Contoh Objek | Yang Didefinisikan |
| :--- | :--- | :--- | :--- |
| **Domain** | Karakteristik Teknis | `ZDM_JUMLAH_BARANG` | Tipe data teknis (`INT4`), panjang digit, format desimal, *fixed values* (daftar pilihan nilai valid). |
| **Data Element** | Makna Bisnis (*Semantics*) | `ZDE_QTY_PESANAN` | Label teks UI untuk layar GUI (Short, Medium, Long, Header), dokumentasi tombol F1 (*Help text*), Parameter ID. |
| **Table Field** | Implementasi Fisik Tabel | Kolom `QTY` pada tabel `ZTSALES` | Posisi kolom dalam tabel database, apakah merupakan Primary Key, aturan Foreign Key, dan nilai default. |

> [!TIP]
> **Prinsip Reusabilitas:** Satu Domain dapat digunakan oleh banyak Data Element yang berbeda maknanya namun memiliki spesifikasi teknis yang sama. Misalnya, satu domain bertipe `CHAR 10` dapat digunakan oleh Data Element `ZDE_NO_FAKTUR`, `ZDE_NO_SURAT_JALAN`, dan `ZDE_NO_PESANAN`.

---

## 3. 🟢 Mendefinisikan Domain (Tipe Teknis & Fixed Values)

### Konsep

Domain mendefinisikan batas-batas nilai teknis dari suatu data di level memori terendah.

Properti utama Domain:
1. **Data Type**: Pilihan tipe DDIC bawaan SAP (misal: `CHAR`, `NUMC`, `DATS`, `TIMS`, `DEC`, `CURR`).
2. **Length**: Jumlah maksimal karakter atau digit.
3. **Decimals**: Jumlah angka di belakang koma (khusus tipe numerik desimal seperti `DEC` atau `CURR`).
4. **Value Range (Fixed Values)**: Daftar nilai valid diskret yang diizinkan masuk ke sistem. Nilai ini secara otomatis akan menjadi *dropdown list* saat pengguna menginput data di layar SAP GUI!

### Tipe Data DDIC Populer

| Tipe DDIC | Arti | Keterangan |
| :--- | :--- | :--- |
| `CHAR` | Character String | Teks alfanumerik panjang tetap. |
| `NUMC` | Numeric Character | Karakter teks khusus angka; mempertahankan angka nol di depan (*leading zeros*). |
| `DATS` | Date | Tanggal standar kalender (format `YYYYMMDD`, panjang 8). |
| `TIMS` | Time | Waktu sistem (format `HHMMSS`, panjang 6). |
| `DEC` | Counter or Amount | Angka desimal dengan penentuan presisi koma tetap. |
| `CURR` | Currency Field | Nilai mata uang finansial; wajib dipasangkan dengan field referensi mata uang (`CUKY`). |

### Contoh Pembuatan Domain di SE11

```text
Nama Domain : ZDM_GENDER
Data Type   : CHAR
Length      : 1

Value Range (Fixed Values):
----------------------------------
Fixed Value | Description
----------------------------------
L           | Laki-laki
P           | Perempuan
```

Ketika kolom tabel menggunakan domain `ZDM_GENDER`, pengguna tidak akan bisa mengisi sembarang karakter selain `'L'` atau `'P'` karena divalidasi langsung oleh sistem.

---

## 4. 🟢 Mendefinisikan Data Element (Makna Bisnis & Field Labels)

### Konsep

Data Element memberikan konteks bisnis kepada Domain teknis. Tanpa Data Element, sistem SAP tidak tahu teks apa yang harus dicetak di atas kolom tabel atau di samping kotak isian form.

### Properti Field Labels pada Data Element

SAP GUI dan SAP Fiori memerlukan teks label dalam berbagai ukuran agar tampilan UI responsif dan tidak terpotong saat ruang layar menyempit:

| Tipe Label | Maks. Panjang | Contoh Isi Label |
| :--- | :---: | :--- |
| **Short** | 10 karakter | `Status Pel` |
| **Medium** | 20 karakter | `Status Pelanggan` |
| **Long** | 40 karakter | `Status Akun Pelanggan` |
| **Heading** | 55 karakter | `Status Pelanggan` |

### Parameter ID (Memory ID)

Pada Data Element, Anda dapat menentukan **Parameter ID** (misal: `KUN` untuk Customer, `MAT` untuk Material). Fitur ini membuat SAP GUI mengingat nomor dokumen atau ID terakhir yang Anda buka di satu transaksi, lalu otomatis mengisikannya ke transaksi berikutnya tanpa perlu mengetik ulang (*Set/Get Parameter Memory*).

---

## 5. 🟢 Tabel Database Transparan (Transparent Tables)

### Konsep

**Transparent Table** adalah jenis tabel database paling umum di SAP. Dinamakan "transparan" karena terdapat relasi 1:1 antara definisi tabel di ABAP Dictionary dengan tabel fisik di basis data underlying (memiliki nama tabel dan kolom yang persis sama di SAP HANA / Oracle).

### Langkah Pembuatan Tabel Transparan di SE11

1. Buka T-Code `SE11`, pilih radio button **Database table**, masukkan nama tabel kustom (contoh: `ZTCUST_MASTER`), lalu klik **Create**.
2. Masukkan deskripsi singkat (*Short Text*).
3. Pada tab **Delivery and Maintenance**:
   * **Delivery Class**: Pilih `A` (Application table: data master dan transaksi bisnis).
   * **Data Browser/Table View Maint.**: Pilih `Display/Maintenance Allowed` agar data tabel dapat dilihat di `SE16N` dan dapat dibuatkan layar TMG di `SM30`.
4. Pada tab **Fields**: Definisikan kolom-kolom tabel, tentukan field mana yang menjadi Primary Key, dan pasangkan dengan Data Element yang sesuai.
5. Klik menu **Technical Settings** (Ctrl+Shift+F9) untuk menentukan alokasi memori database.
6. Klik ikon **Activate** (Ctrl+F3). SAP akan langsung membuat tabel fisik tersebut di database server.

---

## 6. 🟢 Field MANDT & Konsep Client-Dependent

### Konsep

Sistem SAP memisahkan data bisnis antar entitas perusahaan di dalam satu server menggunakan nomor **Client** (misal: Client `100` untuk operasional PT A, Client `200` untuk PT B).

Agar data transaksi tidak bocor atau tercampur antar Client:

> **Aturan Wajib:** Field pertama pada setiap tabel transparan data bisnis **WAJIB bernama `MANDT`**, bertipe Data Element bawaan **`MANDT`**, dan dicentang sebagai **Primary Key**!

```text
Struktur Field Tabel Transparan:
-------------------------------------------------------------------------
Field       | Key | Initial | Data Element | Tipe | Pjg | Keterangan
-------------------------------------------------------------------------
MANDT       |  X  |    X    | MANDT        | CLNT |  3  | Nomor Client
CUST_ID     |  X  |    X    | ZDE_CUST_ID  | CHAR | 10  | ID Pelanggan
CUST_NAME   |     |         | ZDE_CUST_NAME| CHAR | 40  | Nama Pelanggan
-------------------------------------------------------------------------
```

### Cara Kerja Isolasi Otomatis

Ketika program ABAP menjalankan query Open SQL:

```abap
SELECT * FROM ztcust_master INTO TABLE @DATA(lt_cust).
```

Database Interface SAP akan **secara otomatis menambahkan klausa filter client aktif** di belakang layar:

```sql
-- Diterjemahkan otomatis ke Database fisik:
SELECT * FROM ZTCUST_MASTER WHERE MANDT = '100';
```

Dengan mekanisme ini, developer tidak perlu khawatir datanya tertukar dengan unit bisnis lain.

---

## 7. 🟢 Technical Settings (Data Class & Size Category)

### Konsep

Sebelum tabel diaktifkan di `SE11`, Anda diwajibkan mengisi **Technical Settings** (dapat juga diakses langsung via T-Code **`SE13`**). Pengaturan ini menentukan bagaimana database mengalokasikan ruang memori (*tablespace*) untuk tabel tersebut.

### 1. Data Class (Klasifikasi Jenis Data)

| Data Class | Tipe Data yang Ditampung | Karakteristik Perubahan Data |
| :--- | :--- | :--- |
| **`APPL0`** | Master Data | Data induk yang jarang berubah tetapi sering dibaca (contoh: Master Pelanggan, Master Material, Vendor). |
| **`APPL1`** | Transaction Data | Data transaksi yang sering bertambah dan berubah dengan cepat (contoh: Sales Order, Faktur Tagihan, Purchase Order). |
| **`APPL2`** | Organizational / Customizing | Konfigurasi sistem dan parameter aplikasi perusahaan; diubah hanya saat proses setup sistem. |

### 2. Size Category (Estimasi Jumlah Baris Data)

Size Category menentukan ukuran *extent* awal memori yang dialokasikan oleh database engine:

| Size Category | Perkiraan Jumlah Baris Record Data |
| :---: | :--- |
| **`0`** | 0 s/d 9.300 record data |
| **`1`** | 9.300 s/d 37.000 record data |
| **`2`** | 37.000 s/d 150.000 record data |
| **`3`** | 150.000 s/d 600.000 record data |
| **`4`** | 600.000 s/d 2.400.000 record data |

### Best Practice

- Selalu pilih `APPL0` untuk tabel master dan `APPL1` untuk tabel transaksi.
- Jangan asal memilih Size Category terbesar (`4`) jika tabel hanya akan menampung ratusan data konfigurasi lokal, karena akan memboroskan alokasi blok memori database (*tablespace fragmentation*).

---

## 8. 🟡 Database Buffering & Logging Perubahan Data

### Konsep

Database buffering adalah mekanisme di mana Application Server menyimpan salinan isi tabel ke dalam memori RAM lokal server (*Shared Memory Buffer*) guna menghindari frekuensi pemanggilan query I/O ke database fisik.

### Jenis-Jenis Buffering di DDIC

```text
Pilihan Buffering di Technical Settings:
├── 1. Buffering not allowed (Default untuk tabel transaksi bervolume tinggi)
└── 2. Buffering allowed
       ├── Single-record buffering (Hanya me-cache record yang pernah dibaca via WHERE key)
       ├── Generic buffering (Me-cache sekumpulan record berdasarkan subset key)
       └── Full buffering (Membaca dan menyimpan SELURUH isi tabel ke RAM)
```

### Kapan Menggunakan Full Buffering?

Gunakan **Full Buffering** hanya untuk tabel kecil (kurang dari 1.000 baris) yang datanya bersifat statis dan sangat sering dibaca oleh ribuan user (contoh: Tabel Kode Pos, Tabel Kode Mata Uang, Tabel Status Transaksi).

### Kesalahan Umum

❌ Mengaktifkan Buffering pada tabel transaksi penjualan (`APPL1`).

Karena tabel transaksi sangat sering diperbarui (`INSERT`, `UPDATE`). Setiap kali ada update, Application Server harus membuang dan me-reload cache memori (*buffer invalidation*), yang justru memperlambat performa sistem secara drastis.

✅ Tetapkan opsi **Buffering not allowed** untuk seluruh tabel transaksi aktif.

Alasannya, integritas data transaksi real-time langsung dijamin oleh database server tanpa risiko membaca data *stale* di memori lokal.

---

## 9. 🟡 Foreign Key & Integritas Relasional (Check Table)

### Konsep

Dalam SAP, **Foreign Key** digunakan untuk menghubungkan satu field pada tabel input dengan field kunci pada tabel master lain yang disebut **Check Table**.

Jika sebuah field dipasangkan Foreign Key:
* Sistem SAP GUI secara otomatis memblokir nilai input yang tidak terdaftar di Check Table.
* Sistem secara otomatis menyediakan tombol dropdown pencarian (*F4 Input Help*) yang bersumber dari tabel induk tersebut.

```text
Tabel Transaksi: ZTSALES_ORDER               Tabel Check: T005 (Master Negara)
┌───────────────────────────────┐            ┌───────────────────────────────┐
│ Field        | Nilai          │            │ COUNTRY_CODE | NAMA_NEGARA    │
├──────────────┼────────────────┤            ├──────────────┼────────────────┤
│ SO_NUMBER    | 50000001       │            │ ID           | Indonesia      │
│ CUSTOMER     | CUST-100       │            │ JP           | Jepang         │
│ COUNTRY      | ID ────────────┼───────────>│ US           | Amerika Serikat│
└───────────────────────────────┘            └───────────────────────────────┘
```

Jika pengguna mencoba memasukkan nilai `'XX'`, layar SAP GUI akan langsung menampilkan pesan error: *"Entry XX does not exist in T005"*.

### Kardinalitas Relasi (Cardinality)

Kardinalitas mendefinisikan hubungan kuantitas data:
* `1 : 1` : Satu record di tabel transaksi berkorespondensi tepat ke satu record di check table.
* `1 : CN` : Satu record di check table dapat diasosiasikan ke 0 atau banyak record di tabel transaksi (*paling umum*).

---

## 10. 🟡 Struktur (Structures) & Table Types

### Konsep

Selain tabel database fisik, ABAP Dictionary juga digunakan untuk mendefinisikan tipe data internal yang hanya hidup di memori runtime program:

### 1. Structure (`SE11` $\rightarrow$ Data type $\rightarrow$ Structure)

Struktur adalah cetak biru susunan field tanpa alokasi tabel fisik di database. Digunakan sebagai tipe data untuk **Work Area** di dalam program ABAP:

```abap
" Menggunakan struktur DDIC ZSTR_ALAMAT sebagai tipe data variabel lokal
DATA ls_alamat TYPE zstr_alamat.

ls_alamat-jalan = 'Jl. MH Thamrin No. 1'.
ls_alamat-kota  = 'Jakarta Pusat'.
```

### 2. Table Type (`SE11` $\rightarrow$ Data type $\rightarrow$ Table type)

Table Type mendefinisikan tipe data untuk **Internal Table** (kumpulan baris dinamis di memori) yang merujuk pada struktur tertentu.

### 3. Append Structure (Ekstensi Standar SAP yang Aman)

Jika perusahaan Anda membutuhkan kolom tambahan pada tabel standar bawaan SAP (misal: menambahkan kolom `NO_KTP` pada tabel master vendor standar `LFA1`):

> [!IMPORTANT]
> **Dilarang memodifikasi langsung tabel standar SAP!**
> Gunakan fitur **Append Structure** di `SE11`. Append Structure memungkinkan Anda menyisipkan kolom kustom (`Z...`) di bagian akhir tabel standar secara aman tanpa merusak struktur bawaan saat SAP melakukan update versi (*Clean Core principle*).

---

## 11. 🟡 Search Help (F4 Input Help)

### Konsep

Ketika pengguna berada di layar input dan menekan tombol keyboard **`F4`**, sebuah jendela pop-up dialog pencarian data akan muncul. Jendela pencarian ini dikonfigurasi melalui objek **Search Help** di `SE11`.

```text
Jenis Search Help di DDIC:
├── 1. Elementary Search Help (Pencarian berbasis satu tabel query tunggal)
└── 2. Collective Search Help (Menggabungkan beberapa Elementary Search Help menjadi tab pilihan)
```

### Parameter Search Help

* **IMP (Import)**: Mengirim data dari layar form ke Search Help untuk menyaring hasil pencarian awal.
* **EXP (Export)**: Mengirim data record yang dipilih pengguna dari hasil pencarian kembali ke kolom form layar.

---

## 12. 🟡 Lock Objects (Mekanisme Penguncian Data & SM12)

### Konsep

Dalam sistem ERP berskala ribuan user yang bekerja bersamaan, risiko dua pengguna mengedit dokumen penjualan yang sama pada detik yang sama (*concurrency conflict*) harus dicegah.

SAP menangani konkurensi ini menggunakan **Lock Objects** via T-Code **`SE11`**.

### Penamaan & Mekanisme Otomatis

* Nama Lock Object **WAJIB diawali dengan huruf `EZ_` atau `EY_`** (misal: `EZ_TCUST`).
* Ketika Lock Object diaktifkan, sistem SAP secara otomatis men-generate dua Function Module penangan kunci:
  1. `ENQUEUE_<Lock_Object_Name>`: Untuk memasang kunci sebelum membaca/mengedit data.
  2. `DEQUEUE_<Lock_Object_Name>`: Untuk melepaskan kunci setelah transaksi selesai (`COMMIT`).

```text
User A membuka data pelanggan CUST-01
         │
         ▼
Panggil Function: ENQUEUE_EZ_TCUST( iv_cust_id = 'CUST-01' )
         │
         ▼
SAP Enqueue Server mencatat kunci di tabel kunci memori
         │
         ├─── Jika User B mencoba mengedit CUST-01 pada saat yang sama:
         │    ENQUEUE_EZ_TCUST menghasilkan sy-subrc <> 0 (Ditolak / Terkunci!)
         │
User A selesai mengedit dan menekan Save
         │
         ▼
Panggil Function: DEQUEUE_EZ_TCUST( iv_cust_id = 'CUST-01' )
         │
         ▼
Kunci dilepas, data kembali dapat diakses user lain
```

> [!TIP]
> Administrator sistem dapat melihat dan mengelola daftar transaksi yang sedang terkunci di seluruh server menggunakan T-Code **`SM12`** (*Lock Entries Overview*).

---

## 13. 🟡 Table Maintenance Generator (TMG & SM30)

### Konsep

Salah satu fitur paling produktif di SAP adalah **Table Maintenance Generator (TMG)**. Dengan TMG, Anda dapat membuat aplikasi CRUD (*Create, Read, Update, Delete*) lengkap dengan antarmuka grafis dalam hitungan detik **tanpa menulis satu baris kode ABAP pun!**

### Langkah Membuat TMG di SE11

1. Buka tabel kustom Anda di `SE11` (pastikan di tab *Delivery and Maintenance* opsi *Data Browser/Table View Maint.* diset ke `Display/Maintenance Allowed`).
2. Klik menu navigasi atas: **Utilities** $\rightarrow$ **Table Maintenance Generator**.
3. Tentukan parameter:
   * **Authorization Group**: `&NC&` (tanpa proteksi otorisasi khusus untuk pengujian lokal).
   * **Function Group**: Masukkan nama Function Group penampung (contoh: `ZFG_CUST`).
   * **Maintenance Type**:
     * `One Step`: Seluruh data ditampilkan dalam satu layar tabel tabular (*Overview Screen*).
     * `Two Step`: Memiliki layar ringkasan (*Overview*) dan layar rincian per record (*Detail Screen*).
   * **Maintenance Screen No.**: Klik tombol **Find Screen Number(s)** pada toolbar untuk penomoran otomatis.
4. Klik tombol **Create** (ikon kertas putih/pensil).
5. SAP akan men-generate layar Dynpro otomatis.

### Mengakses Data via T-Code `SM30`

Setelah TMG dibuat, buka T-Code **`SM30`**, masukkan nama tabel Anda, lalu klik **Maintain**. Pengguna dapat langsung menambah record baru (*New Entries*), mengubah, maupun menghapus data tabel secara visual.

---

## 14. 🟡 Database Views di DDIC

### Konsep

**View** adalah tabel virtual yang datanya tidak disimpan secara fisik, melainkan diambil secara dinamis dari satu atau beberapa tabel database induk.

| Jenis View | Kegunaan Utama | Karakteristik |
| :--- | :--- | :--- |
| **Database View** | Menggabungkan data dari beberapa tabel relasional (`INNER JOIN`). | Hanya untuk membaca data (*Read-Only*). |
| **Maintenance View** | Membuat antarmuka pemeliharaan data multi-tabel via TMG (`SM30`). | Mendukung penulisan dan pengeditan data secara terintegrasi. |
| **Projection View** | Menyembunyikan kolom-kolom tertentu dari satu tabel fisik. | Mengurangi beban bandwidth memori. |
| **Help View** | Sumber data seleksi untuk Search Help. | Digunakan khusus untuk mendukung navigasi input F4. |

---

## 15. 🛠️ Mini Project: Membangun Master Data Pelanggan

### Tujuan

Membangun solusi master data pelanggan enterprise lengkap di ABAP Dictionary: membuat Domain dengan fixed values status, Data Element dengan label terstandarisasi, Transparent Table `ZTCLIENT_MASTER` berindeks Primary Key `MANDT`, memasang Technical Settings optimal, mengaktifkan Foreign Key ke tabel negara standar SAP `T005`, dan men-generate antarmuka data visual via Table Maintenance Generator (`SM30`).

### Fitur

1. Pemisahan domain teknis gender dan status akun dengan dropdown pilihan otomatis.
2. Label UI multilingual yang seragam untuk antarmuka SAP GUI.
3. Isolasi data transaksi multi-tenant menggunakan kolom `MANDT`.
4. Validasi kode negara mengacu pada tabel standar SAP `T005`.
5. Antarmuka CRUD visual lengkap tanpa coding menggunakan Table Maintenance Generator.

### Konsep yang Digunakan

* Pembuatan Domain (`SE11`) dengan rentang nilai tetap (*Fixed Values*).
* Pembuatan Data Element (`SE11`) dengan Field Labels lengkap.
* Konfigurasi Tabel Transparan dengan Delivery Class `A`.
* Technical Settings: Data Class `APPL0` dan Size Category `0`.
* Penerapan relasi Foreign Key ke tabel Check Table standar.
* Pembangkitan layar antarmuka data menggunakan TMG (`SM30`).

### Langkah Implementasi

#### Langkah 1: Buat Domain Status Pelanggan (`ZDM_CUST_STATUS`)
* T-Code: `SE11` $\rightarrow$ Domain $\rightarrow$ `ZDM_CUST_STATUS` $\rightarrow$ Create.
* Data Type: `CHAR`, Length: `1`.
* Tab *Value Range*:
  * `'A'` = Aktif
  * `'I'` = Inaktif
  * `'B'` = Diblokir (Blacklist)
* Simpan dan Aktifkan (Ctrl+F3).

#### Langkah 2: Buat Data Element (`ZDE_CUST_STATUS`)
* T-Code: `SE11` $\rightarrow$ Data type $\rightarrow$ `ZDE_CUST_STATUS` $\rightarrow$ Create $\rightarrow$ Data element.
* Elementary data type: Masukkan Domain `ZDM_CUST_STATUS`.
* Tab *Field Label*:
  * Short (10) : `Status`
  * Medium (20): `Status Pelanggan`
  * Long (40)  : `Status Akun Pelanggan`
  * Heading (55): `Status Pelanggan`
* Simpan dan Aktifkan.

#### Langkah 3: Buat Data Element ID Pelanggan (`ZDE_CLIENT_ID`)
* T-Code: `SE11` $\rightarrow$ Data type $\rightarrow$ `ZDE_CLIENT_ID` $\rightarrow$ Create.
* Tipe Teknis bawaan: Predefined Type `CHAR` panjang `10`.
* Field Label: `ID Pelanggan`.
* Simpan dan Aktifkan.

#### Langkah 4: Buat Tabel Transparan `ZTCLIENT_MASTER`
* T-Code: `SE11` $\rightarrow$ Database table $\rightarrow$ `ZTCLIENT_MASTER` $\rightarrow$ Create.
* Short Description: `Tabel Master Data Pelanggan`.
* Tab *Delivery and Maintenance*:
  * Delivery Class: `A`
  * Data Browser/Table View Maint.: `Display/Maintenance Allowed`
* Tab *Fields*: Susun kolom tabel sebagai berikut:

```text
-------------------------------------------------------------------------
Field Name    | Key | Init | Data Element  | Tipe | Pjg | Keterangan
-------------------------------------------------------------------------
MANDT         |  X  |  X   | MANDT         | CLNT |  3  | Nomor Mandant
CLIENT_ID     |  X  |  X   | ZDE_CLIENT_ID | CHAR | 10  | ID Pelanggan
CLIENT_NAME   |     |      | TEXT40        | CHAR | 40  | Nama Perusahaan
STATUS        |     |      | ZDE_CUST_STATUS|CHAR |  1  | Status Akun
COUNTRY       |     |      | LAND1         | CHAR |  3  | Kode Negara
CREATED_ON    |     |      | ERDAT         | DATS |  8  | Tanggal Dibuat
-------------------------------------------------------------------------
```

#### Langkah 5: Pasang Foreign Key untuk Kolom Negara (`COUNTRY`)
1. Pilih baris field `COUNTRY`.
2. Klik tombol **Foreign Keys** (ikon kunci gembok pada toolbar tabel).
3. Masukkan Check Table: `T005` (Tabel negara standar SAP).
4. Klik tombol **Generate Proposal**. Sistem akan secara otomatis memetakan relasi `MANDT = T005-MANDT` dan `COUNTRY = T005-LAND1`.
5. Klik **Copy**.

#### Langkah 6: Konfigurasi Technical Settings (`SE13`)
1. Klik tombol **Technical Settings** pada toolbar tabel.
2. Data Class: Masukkan `APPL0` (Master data).
3. Size Category: Masukkan `0` (0 s/d 9.300 baris record).
4. Buffering: `Buffering not allowed`.
5. Simpan dan kembali ke layar tabel.
6. Aktifkan tabel `ZTCLIENT_MASTER` (Ctrl+F3).

#### Langkah 7: Generate Layar Pemeliharaan Data (TMG)
1. Pada menu navigasi `SE11`, klik **Utilities** $\rightarrow$ **Table Maintenance Generator**.
2. Masukkan Authorization Group: `&NC&`.
3. Masukkan Function Group baru: `ZFG_CLIENT_MGT`.
4. Maintenance Type: `One Step`.
5. Klik tombol **Find Screen Number(s)** pada toolbar $\rightarrow$ pilih nomor usulan sistem (misal: Screen `1000`).
6. Klik tombol **Create** (ikon pensil/kertas putih).

### Hasil Akhir

1. Buka T-Code **`SM30`**.
2. Masukkan Table Name: **`ZTCLIENT_MASTER`** $\rightarrow$ Klik **Maintain**.
3. Layar antarmuka entri visual SAP GUI akan terbuka:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ Pemeliharaan Tabel ZTCLIENT_MASTER: Overview Screen                    │
├────────────┬──────────────────────┬────────┬────────┬──────────────────┤
│ ID Pelangg.│ Nama Perusahaan      │ Status │ Negara │ Tanggal Dibuat   │
├────────────┼──────────────────────┼────────┼────────┼──────────────────┤
│ CUST-0001  │ PT Astra Jaya Mandiri│ A [v]  │ ID     │ 30.09.2026       │
│ CUST-0002  │ Tokyo Electron Ltd   │ A [v]  │ JP     │ 30.09.2026       │
│ CUST-0003  │ Global Tech Corp     │ I [v]  │ US     │ 30.09.2026       │
└────────────┴──────────────────────┴────────┴────────┴──────────────────┘
```

* **Validasi Otomatis Berjalan**: Kolom Status memiliki pilihan dropdown tetap (`A`, `I`, `B`). Jika kolom Negara diisi `'ZZ'`, sistem langsung memblokir dengan pesan error Foreign Key `T005`.

---

## 16. 📚 Ringkasan & Peta Ingatan

### Peta Konsep ABAP Dictionary

```text
ABAP Dictionary (DDIC / SE11)
├── 1. Hirarki Objek Data
│   ├── Domain (Tipe data teknis dasar, panjang, desimal, fixed values)
│   ├── Data Element (Makna bisnis, UI labels pendek/panjang, F1 help)
│   └── Table Fields (Kolom konkret, Primary Key, Foreign Key)
├── 2. Tabel Transparan
│   ├── Client-Dependent (Wajib kolom MANDT sebagai primary key pertama)
│   ├── Technical Settings (Data Class APPL0/APPL1 & Size Category 0-4)
│   └── Database Buffering (Single-record, Generic, Full buffering)
├── 3. Relasi & Bantuan Input
│   ├── Foreign Key (Integritas referensial mengacu ke Check Table)
│   └── Search Help (Jendela navigasi input F4 pengguna)
└── 4. Utilitas & Integrasi
    ├── Table Maintenance Generator / TMG (CRUD visual instan di SM30)
    ├── Lock Objects (Pencegahan race condition via SM12 / ENQUEUE & DEQUEUE)
    └── Views (Database View, Maintenance View, Projection View)
```

---

## 17. 📚 Cheat Code DDIC 10 Detik

```text
SE11               → Pusat kendali seluruh objek ABAP Data Dictionary
SE16N              → Melihat dan menelusuri data mentah di tabel database
SM30               → Menjalankan layar pemeliharaan data visual TMG
SM12               → Melihat dan membuka paksa kunci data yang menggantung
MANDT              → Kolom kunci isolasi client wajib pada tabel transparan
APPL0              → Data Class untuk Master Data (jarang berubah)
APPL1              → Data Class untuk Transaksi Bisnis (sering berubah)
Append Structure   → Menyisipkan kolom kustom ke tabel standar SAP secara aman
EZ_nama            → Format nama resmi Lock Object untuk generate ENQUEUE/DEQUEUE
Fixed Values       → Menghasilkan dropdown list pilihan valid otomatis di layar GUI
```

---

## 18. 🧭 Urutan Belajar Selanjutnya

Setelah memahami cara memodelkan data di ABAP Data Dictionary, langkah berikutnya adalah mempelajari bagaimana data tersebut ditampung dan diolah secara dinamis di dalam memori program ABAP:

```text
1. 🟢 ABAP Dasar (Fondasi sintaks & kontrol alur)
      │
      ▼
2. 🟢 ABAP Data Dictionary (DDIC) (Selesai pada modul ini)
      │
      ▼
3. 🟢 ABAP Internal Tables
   → Pelajari struktur data array in-memory (Standard, Sorted, Hashed Table), Work Area, Field Symbols, dan sintaks manipulasi modern 7.40+ (VALUE, FOR, FILTER).
      │
      ▼
4. 🟡 ABAP Database & Open SQL
   → Pelajari cara membaca dan menyimpan data antara memori program dan tabel DDIC menggunakan SELECT query.
```

Lanjutkan ke modul berikutnya: [[abap-internal-tables|ABAP Internal Tables]] (Modul 3).

---

## 19. 🔗 Referensi Resmi

* [SAP Help Portal — ABAP Dictionary (BC-DWB-DIC)](https://help.sap.com/docs/ABAP_PLATFORM/)
* [SAP Community — Best Practices for Table Design and Buffering](https://community.sap.com/)
* [ABAP Keyword Documentation — ABAP Dictionary Reference](https://help.sap.com/doc/abapdocu_latest_index_htm/latest/en-US/index.htm)
