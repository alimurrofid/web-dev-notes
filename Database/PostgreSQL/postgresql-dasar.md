---
title: "PostgreSQL Dasar"
description: "Fundamental relational database PostgreSQL: Data types, DDL (CREATE TABLE, ALTER), DML (INSERT, SELECT, UPDATE, DELETE), Filtering (WHERE), dan Constraints."
order: 1
tags:
  - database
  - postgresql
  - sql
  - fundamental
---

# PostgreSQL Dasar

> **Target:** Pemula yang ingin menguasai **basis data relasional modern (RDBMS / ORDBMS), perintah `psql` CLI, DDL & DML, tipe data modern (UUID `gen_random_uuid()`, ENUM, `TIMESTAMPTZ`, `NUMERIC`), integritas data Constraints (`CHECK`, `UNIQUE`), fitur unggulan `RETURNING` & UPSERT (`ON CONFLICT`), pencarian `ILIKE`, agregasi `GROUP BY` / `HAVING`, dan Multi-Table `JOINs`** menggunakan **PostgreSQL 16+**.
>
> Fokus cheatsheet ini: **mental model Object-Relational Database → `psql` meta commands → tipe data modern & ENUM → DDL (`CREATE TABLE`, `ALTER TABLE`, `TRUNCATE`) → Constraints (`CHECK`, `PRIMARY KEY`, `FOREIGN KEY ON DELETE CASCADE`) → DML (`INSERT`, `UPDATE`, `DELETE`) + `RETURNING *` → UPSERT (`ON CONFLICT DO UPDATE`) → `SELECT` filtering & `ILIKE` → Paginasi `LIMIT` & `OFFSET` → Agregasi `GROUP BY` & `HAVING` → Relasi & `INNER`/`LEFT`/`RIGHT`/`FULL OUTER JOIN` → Set Operations (`UNION`, `INTERSECT`, `EXCEPT`) → mini project E-Commerce Relational Schema & Reporting Suite**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: psql CLI, Tipe Data Modern (UUID/ENUM/TIMESTAMPTZ), DDL Constraints, DML, RETURNING, dan UPSERT

🟡 Lanjutan
→ pelajari setelah DML lancar: WHERE filtering, ILIKE search, Paginasi, Agregasi (GROUP BY/HAVING), dan Relasi Foreign Key

🔴 Advanced / Operasional
→ penting untuk arsitektur database: Multi-Table JOINs, Set Operations (UNION/INTERSECT/EXCEPT), dan Integritas Relasi
```

Mental model urutan eksekusi logika (*SQL Logical Query Processing Order*) di PostgreSQL Engine:

```text
               1. FROM & JOIN (Menentukan tabel & relasi gabungan)
                                │
                                ▼
               2. WHERE (Memfilter baris data individual)
                                │
                                ▼
               3. GROUP BY (Mengelompokkan baris data ke dalam grup)
                                │
                                ▼
               4. HAVING (Menyaring hasil kalkulasi agregat grup)
                                │
                                ▼
               5. SELECT & RETURNING (Memilih kolom / ekspresi)
                                │
                                ▼
               6. DISTINCT (Mengeliminasi baris duplikat)
                                │
                                ▼
               7. ORDER BY (Mengurutkan baris data)
                                │
                                ▼
               8. LIMIT & OFFSET (Memotong batas jumlah baris paginasi)
```

**Hafalan:**

```text
psql               → terminal CLI interaktif resmi untuk mengelola dan mengeksekusi query database PostgreSQL
DDL (Data Definition) → perintah pendefinisian struktur skema database (CREATE, ALTER, DROP, TRUNCATE)
DML (Data Manipulation) → perintah manipulasi isi baris data tabel (INSERT, UPDATE, DELETE, SELECT)
RETURNING *        → klausa unggulan PostgreSQL untuk mengembalikan data baris yang baru saja dimanipulasi tanpa query tambahan
ON CONFLICT        → klausa penanganan duplikasi kunci unik untuk melakukan operasi UPSERT (Update jika sudah ada)
TIMESTAMPTZ        → tipe data tanggal dan waktu presisi tinggi yang otomatis mengonversi ke UTC dan zona waktu klien
UUID               → tipe data identifier unik global 128-bit acak yang di-generate via gen_random_uuid()
CHECK Constraint   → aturan validasi nilai kolom tingkat database untuk menjamin integritas data bisnis (price > 0)
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan PostgreSQL 16 & Mental Model Object-Relational Database](#bagian-1)
2. [Tooling `psql` CLI & Perintah Meta Navigasi](#bagian-2)
3. [Tipe Data Inti PostgreSQL](#bagian-3)
4. [Tipe Data Kustom ENUM](#bagian-4)
5. [DDL: Membuat Table dengan Constraints Lengkap](#bagian-5)
6. [DDL: Mengubah & Menghapus Struktur Table](#bagian-6)
7. [DML: Menyimpan Data dengan `INSERT INTO` & Klausa `RETURNING *`](#bagian-7)
8. [DML: Menangani Konflik Duplikasi / UPSERT](#bagian-8)

### 🟡 Lanjutan

9. [DML: Memperbarui Data dengan `UPDATE`](#bagian-9)
10. [DML: Menghapus Data dengan `DELETE`](#bagian-10)
11. [Querying Dasar & Alias](#bagian-11)
12. [Filtering Lanjutan dengan Klausa `WHERE`](#bagian-12)
13. [Pencarian Teks Pola dengan `LIKE` vs `ILIKE`](#bagian-13)
14. [Pengurutan & Paginasi Data](#bagian-14)
15. [Fungsi Agregasi Dasar](#bagian-15)
16. [Pengelompokan Data dengan `GROUP BY` & Penyaringan Agregat `HAVING`](#bagian-16)
17. [Relasi Antar Tabel & Foreign Key Constraints](#bagian-17)

### 🔴 Advanced / Operasional

18. [Teknik Menggabungkan Tabel (JOIN Inti): `INNER JOIN` & `LEFT JOIN`](#bagian-18)
19. [Teknik Menggabungkan Tabel (JOIN Lanjutan): `RIGHT JOIN`, `FULL OUTER JOIN`, dan `CROSS JOIN`](#bagian-19)
20. [Operasi Himpunan Baris Data: `UNION`, `UNION ALL`, `INTERSECT`, dan `EXCEPT`](#bagian-20)

### 🛠️ Referensi & Praktik

21. [Peta Ingatan Cepat](#bagian-21)
22. [Tabel Ringkasan](#bagian-22)
23. [Cheat Code PostgreSQL Dasar 10 Detik](#bagian-23)
24. [Urutan Belajar yang Disarankan](#bagian-24)
25. [Mini Project: Production-Ready E-Commerce Relational Database Schema & Reporting Query Suite](#bagian-25)
26. [Referensi Resmi](#bagian-26)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan PostgreSQL 16 & Mental Model Object-Relational Database

#### Konsep

**PostgreSQL** (sering disebut *Postgres*) adalah **Object-Relational Database Management System (ORDBMS)** paling canggih di dunia sumber terbuka (*Open Source*).

Mengapa PostgreSQL Menjadi Standar Utama Industri Modern?
1. **Kepatuhan ANSI SQL Sangat Ketat:** Mengikuti standar SQL resmi secara presisi.
2. **Konkurensi Tingkat Tinggi dengan MVCC (*Multi-Version Concurrency Control*):** Operasi pembacaan (*Reader*) tidak pernah memblokir operasi penulisan (*Writer*), dan penulisan tidak memblokir pembacaan.
3. **Tipe Data Sangat Kaya:** Mendukung native JSONB, UUID, Geospasial (PostGIS), IP Address (INET), dan Array.
4. **Ekstensibilitas Luar Biasa:** Mendukung bahasa pemrograman kustom di dalam database (PL/pgSQL, Python, JavaScript) dan custom index types (GIN, GiST, BRIN).

#### Cara Kerja

```text
Aplikasi Backend (Node/Java/PHP/Go)
                │
                ▼ SQL Queries (Koneksi TCP Port 5432)
PostgreSQL Engine (Parser ──> Planner/Optimizer ──> Executor)
                │
                ▼ MVCC Transaction Isolation
Storage Engine (Tabel Relasional, Indeks B-Tree/GIN, WAL Logs)
```

**Hafalan:**

```text
ORDBMS (Object-Relational DBMS) → database relasional dengan kemampuan objek, tipe data kustom, dan ekstensibilitas tinggi
MVCC                           → arsitektur konkurensi yang memungkinkan transaksi konkuren tanpa saling mengunci tabel secara kaku
```

---

<a id="bagian-2"></a>

## 2. 🟢 Tooling `psql` CLI & Perintah Meta Navigasi

#### Konsep

**`psql`** adalah terminal antarmuka baris perintah (*CLI*) bawaan PostgreSQL. Seluruh perintah meta di `psql` diawali dengan garis miring terbalik (**`\`**).

Perintah Meta `psql` Paling Penting:

| Perintah Meta | Fungsi & Kegunaan |
|---|---|
| **`\l`** | Menampilkan daftar seluruh database di server (*List Databases*). |
| **`\c nama_database`** | Berpindah / terkoneksi ke database tertentu (*Connect*). |
| **`\dt`** | Menampilkan daftar seluruh tabel di skema aktif (*Describe Tables*). |
| **`\d+ nama_tabel`** | Menampilkan detail struktur kolom, tipe data, dan index pada tabel (*Describe Table*). |
| **`\dn`** | Menampilkan daftar skema namespace di database (*List Schemas*). |
| **`\du`** | Menampilkan daftar pengguna dan hak akses peran (*List Roles*). |
| **`\timing`** | Mengaktifkan stopwatch pengukur waktu eksekusi query (milidetik). |
| **`\q`** | Keluar dari terminal `psql` (*Quit*). |

**Hafalan:**

```text
\l          → melihat seluruh database
\c db_name  → berpindah ke database tujuan
\dt         → melihat daftar seluruh tabel
\d+ table   → melihat struktur kolom dan tipe data tabel secara mendalam
\q          → keluar dari psql
```

---

<a id="bagian-3"></a>

## 3. 🟢 Tipe Data Inti PostgreSQL

#### Konsep

PostgreSQL memiliki sistem tipe data yang sangat kaya dan presisi:

1. **Identifier & UUID:**
   - **`UUID`:** Identifier acak global 128-bit standar industri. Dibuat dengan fungsi bawaan **`gen_random_uuid()`** (Bebas dari masalah prediksi ID berurutan / *Insecure Direct Object Reference*).
   - **`BIGINT` / `BIGSERIAL`:** Angka bulat 8-byte untuk auto-increment tradisional.
2. **Teks & String:**
   - **`VARCHAR(n)`:** String dengan batas karakter maksimal $n$.
   - **`TEXT`:** String teks tak terbatas (di Postgres, performa `TEXT` sama cepatnya dengan `VARCHAR` tanpa batasan alokasi kaku).
3. **Angka & Finansial:**
   - **`INTEGER` (INT):** Angka bulat 4-byte ($-2.14$ miliar s.d. $+2.14$ miliar).
   - **`NUMERIC(precision, scale)` / `DECIMAL`:** Angka desimal presisi mutlak (Wajib untuk uang/transaksi agar tidak terjadi pembulatan floating point yang salah).
4. **Waktu & Tanggal:**
   - **`TIMESTAMPTZ` (*Timestamp with Time Zone*):** Wajib untuk backend modern! Menyimpan tanggal, jam, menit, detik beserta zona waktu (otomatis dikonversi ke UTC di server).
5. **Boolean:**
   - **`BOOLEAN`:** `TRUE`, `FALSE`, atau `NULL`.

#### Contoh

```sql
CREATE TABLE product_samples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL, -- Contoh: 15000000.50
    stock INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

**Hafalan:**

```text
UUID DEFAULT gen_random_uuid() → membuat primary key identifier acak yang aman dan terdesentralisasi
NUMERIC(precision, scale)      → tipe angka desimal presisi pasti untuk data finansial dan harga uang
TIMESTAMPTZ                    → tipe data tanggal waktu standar yang menyertakan zona waktu UTC
```

---

<a id="bagian-4"></a>

## 4. 🟢 Tipe Data Kustom ENUM

#### Konsep

Di PostgreSQL, kita dapat membuat tipe data kustom berbasis pilihan terbatas (**ENUM / Enumerated Type**) menggunakan perintah **`CREATE TYPE ... AS ENUM`**.

Keuntungan ENUM:
- Nilai di luar daftar yang ditentukan akan ditolak seketika oleh database.
- Hemat ruang penyimpanan dibanding teks string biasa.
- Memberikan dokumentasi skema yang jelas.

#### Contoh

```sql
-- 1. Membuat Tipe Data Kustom ENUM
CREATE TYPE order_status AS ENUM ('PENDING', 'PAID', 'SHIPPED', 'CANCELLED');
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'ADMIN', 'SELLER');

-- 2. Menggunakan ENUM di dalam Definisi Tabel
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status order_status DEFAULT 'PENDING' NOT NULL
);
```

**Hafalan:**

```text
CREATE TYPE type_name AS ENUM ('VAL1', 'VAL2', 'VAL3'); → membuat tipe data pilihan kustom di PostgreSQL
```

---

<a id="bagian-5"></a>

## 5. 🟢 DDL: Membuat Table dengan Constraints Lengkap

#### Konsep

**Data Definition Language (DDL)** digunakan untuk membangun struktur tabel.

Jenis Constraints (Aturan Integritas Data):
- **`PRIMARY KEY`:** Kunci identitas baris unik dan tidak boleh null.
- **`NOT NULL`:** Melarang kolom bernilai kosong (*NULL*).
- **`UNIQUE`:** Memastikan tidak ada data kembar di seluruh kolom (misal: email pengguna).
- **`DEFAULT ...`:** Memberikan nilai bawaan jika kolom tidak disertakan saat insert.
- **`CHECK (kondisi)`:** Aturan validasi logika bisnis tingkat database (misal: `CHECK (price > 0)` atau `CHECK (discount <= 100)`).

#### Contoh

```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    balance NUMERIC(14, 2) DEFAULT 0.00 CHECK (balance >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

**Hafalan:**

```text
CHECK (column_condition) → memvalidasi integritas data bisnis langsung di level database engine
```

---

<a id="bagian-6"></a>

## 6. 🟢 DDL: Mengubah & Menghapus Struktur Table

#### Konsep

Perintah Modifikasi Skema DDL:
- **`ALTER TABLE table_name ADD COLUMN ...`:** Menambah kolom baru.
- **`ALTER TABLE table_name DROP COLUMN ...`:** Menghapus kolom.
- **`ALTER TABLE table_name RENAME COLUMN old_name TO new_name`:** Mengubah nama kolom.
- **`ALTER TABLE table_name ALTER COLUMN col_name TYPE new_type`:** Mengubah tipe data kolom.
- **`TRUNCATE TABLE table_name`:** Menghapus seluruh baris data dengan cepat tanpa menghapus struktur tabel (jauh lebih cepat daripada `DELETE`).
- **`DROP TABLE IF EXISTS table_name CASCADE`:** Menghapus tabel permanen beserta objek dependensinya.

#### Contoh

```sql
-- 1. Tambah Kolom Baru
ALTER TABLE customers ADD COLUMN address TEXT;

-- 2. Hapus Kolom
ALTER TABLE customers DROP COLUMN phone;

-- 3. Kosongkan Data Tabel Cepat
TRUNCATE TABLE customers RESTART IDENTITY CASCADE;

-- 4. Hapus Tabel Permanen
DROP TABLE IF EXISTS customers CASCADE;
```

**Hafalan:**

```text
ALTER TABLE name ADD COLUMN col type  → menambah kolom baru ke tabel yang sudah ada
TRUNCATE TABLE name                   → mengosongkan seluruh data tabel secara instan berkinerja tinggi
```

---

<a id="bagian-7"></a>

## 7. 🟢 DML: Menyimpan Data dengan `INSERT INTO` & Klausa `RETURNING *`

#### Konsep

Perintah **`INSERT INTO`** digunakan untuk menyimpan baris data baru ke tabel.

**Fitur Unggulan PostgreSQL: Klausa `RETURNING`**:
Di database lain (seperti MySQL), setelah insert Anda harus memanggil fungsi terpisah untuk mengambil ID yang baru dibuat. Di PostgreSQL, cukup tambahkan **`RETURNING *`** atau **`RETURNING id, created_at`** di akhir query `INSERT`, dan database akan langsung mengembalikan baris yang baru saja disimpan!

#### Contoh

```sql
-- Insert Tunggal dengan Klausa RETURNING
INSERT INTO customers (name, email, balance)
VALUES ('Budi Santoso', 'budi@mail.com', 500000.00)
RETURNING id, name, email, created_at;

-- Insert Banyak Baris Sekaligus (Batch Insert)
INSERT INTO customers (name, email, balance)
VALUES 
    ('Siti Rahma', 'siti@mail.com', 750000.00),
    ('Andi Pratama', 'andi@mail.com', 1200000.00)
RETURNING id, name;
```

#### Output

```text
                  id                  |     name     |     email     |          created_at           
--------------------------------------+--------------+---------------+-------------------------------
 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d | Budi Santoso | budi@mail.com | 2026-08-29 20:00:00.123456+07
(1 row)
```

**Hafalan:**

```text
INSERT INTO table (columns) VALUES (values) RETURNING * → menyimpan data baru dan langsung mengembalikan hasilnya
```

---

<a id="bagian-8"></a>

## 8. 🟢 DML: Menangani Konflik Duplikasi / UPSERT

#### Konsep

Ketika meng-insert data yang berpotensi melanggar constraint `UNIQUE` (misal: email pengguna yang mungkin sudah terdaftar), database biasa akan melempar error gagal.

PostgreSQL memiliki fitur **UPSERT (*Insert or Update*)** menggunakan klausa **`ON CONFLICT`**:
1. **`ON CONFLICT (kolom_unik) DO NOTHING`:** Jika data sudah ada, abaikan tanpa melempar error.
2. **`ON CONFLICT (kolom_unik) DO UPDATE SET ...`:** Jika data sudah ada, perbarui baris yang ada dengan nilai baru via keyword **`EXCLUDED`**.

#### Contoh

```sql
-- UPSERT: Perbarui nama dan saldo jika email sudah terdaftar
INSERT INTO customers (name, email, balance)
VALUES ('Budi Santoso Updated', 'budi@mail.com', 900000.00)
ON CONFLICT (email) 
DO UPDATE SET 
    name = EXCLUDED.name,
    balance = EXCLUDED.balance
RETURNING *;
```

**Hafalan:**

```text
ON CONFLICT (target_col) DO UPDATE SET col = EXCLUDED.col → pola UPSERT resmi di PostgreSQL
ON CONFLICT (target_col) DO NOTHING                      → abaikan insert jika terjadi duplikasi kunci unik
```

---

<a id="bagian-9"></a>

## 9. 🟡 DML: Memperbarui Data dengan `UPDATE`

#### Konsep

Perintah **`UPDATE`** digunakan untuk memperbarui nilai kolom pada baris data yang ada.

> [!WARNING]
> **SELALU SERTAKAN KLAUSA `WHERE` PADA SETIAP QUERY `UPDATE`!** Jika tidak menyertakan `WHERE`, **seluruh baris data di tabel akan terupdate tanpa ampun**.

Klausa `RETURNING` juga dapat digunakan pada `UPDATE`.

#### Contoh

```sql
-- Update Saldo dan Nama Pelanggan Tertentu
UPDATE customers
SET 
    balance = balance + 150000.00,
    name = 'Budi Santoso, S.Kom'
WHERE email = 'budi@mail.com'
RETURNING id, name, balance;
```

**Hafalan:**

```text
UPDATE table SET col = newVal WHERE condition RETURNING * → memperbarui baris data yang memenuhi kondisi
```

---

<a id="bagian-10"></a>

## 10. 🟡 DML: Menghapus Data dengan `DELETE`

#### Konsep

Perintah **`DELETE FROM`** digunakan untuk menghapus baris data dari tabel berdasarkan filter kriteria `WHERE`.

Klausa `RETURNING` dapat digunakan untuk mengembalikan data baris yang baru saja dihapus (misal: mencatat ID yang dihapus ke audit log).

#### Contoh

```sql
-- Hapus Customer Tertentu
DELETE FROM customers
WHERE email = 'andi@mail.com'
RETURNING id, name, email;
```

**Hafalan:**

```text
DELETE FROM table WHERE condition RETURNING id → menghapus baris data dan mengembalikan ID baris yang dihapus
```

---

<a id="bagian-11"></a>

## 11. 🟡 Querying Dasar & Alias

#### Konsep

Perintah **`SELECT`** digunakan untuk membaca data:
- **`SELECT col1, col2 FROM table`:** Memilih kolom tertentu.
- **`AS alias_name`:** Memberikan nama alias sementara untuk kolom atau tabel.
- **`SELECT DISTINCT col FROM table`:** Mengeliminasi nilai duplikat dan hanya menampilkan nilai unik.

#### Contoh

```sql
-- Menggunakan Alias dan DISTINCT
SELECT DISTINCT 
    role AS jenis_pengguna,
    is_active AS status_keaktifan
FROM customers;
```

**Hafalan:**

```text
SELECT col AS alias FROM table → memilih kolom dengan label alias yang mudah dibaca
SELECT DISTINCT col FROM table  → menyaring hasil query agar hanya menampilkan nilai unik
```

---

<a id="bagian-12"></a>

## 12. 🟡 Filtering Lanjutan dengan Klausa `WHERE`

#### Konsep

Klausa **`WHERE`** menyaring baris data berdasarkan ekspresi logika:
- **Operator Perbandingan:** `=`, `!=` atau `<>`, `>`, `<`, `>=`, `<=`.
- **Operator Logika:** `AND`, `OR`, `NOT`.
- **Koleksi & Rentang:** `IN ('A', 'B', 'C')`, `BETWEEN val1 AND val2`.
- **Nilai Kosong:** `IS NULL`, `IS NOT NULL` (Dilarang menggunakan `= NULL`).

#### Contoh

```sql
SELECT name, email, balance, is_active
FROM customers
WHERE 
    is_active = TRUE
    AND balance BETWEEN 100000.00 AND 2000000.00
    AND email IS NOT NULL;
```

**Hafalan:**

```text
WHERE col IS NOT NULL AND col IN ('A', 'B') AND col BETWEEN x AND y
```

---

<a id="bagian-13"></a>

## 13. 🟡 Pencarian Teks Pola dengan `LIKE` vs `ILIKE`

#### Konsep

Untuk mencari string yang mengandung pola tertentu (menggunakan wildcard `%` untuk sembarang karakter dan `_` untuk 1 karakter):

1. **`LIKE` (Case-Sensitive):** Membedakan huruf besar dan kecil (`'Budi'` tidak cocok dengan `'budi'`).
2. **`ILIKE` (Case-Insensitive - Fitur Khas PostgreSQL):** **TIDAK MEMBEDAKAN huruf besar dan kecil** (`'budi'` cocok dengan `'Budi'`, `'BUDI'`, `'bUDI'`).

#### Contoh

```sql
-- 1. Mencari nama yang mengandung kata "santoso" (Huruf besar/kecil bebas!)
SELECT id, name, email 
FROM customers
WHERE name ILIKE '%santoso%';

-- 2. Mencari email yang berakhiran domain "@gmail.com"
SELECT id, name, email 
FROM customers
WHERE email ILIKE '%@gmail.com';
```

**Hafalan:**

```text
WHERE column ILIKE '%keyword%' → pencarian teks case-insensitive tanpa peduli huruf besar/kecil di PostgreSQL
```

---

<a id="bagian-14"></a>

## 14. 🟡 Pengurutan & Paginasi Data

#### Konsep

- **`ORDER BY col1 ASC | DESC`:** Mengurutkan data menaik (*Ascending*) atau menurun (*Descending*).
- **`NULLS FIRST | NULLS LAST`:** Menentukan apakah nilai `NULL` diletakkan di paling atas atau paling bawah.
- **`LIMIT n`:** Membatasi jumlah maksimal baris yang dikembalikan.
- **`OFFSET m`:** Melompati $m$ baris pertama (Rumus Paginasi: `OFFSET = (halaman - 1) * limit`).

#### Contoh

```sql
-- Mengambil Halaman ke-2 (Baris 11 s.d. 20) dengan saldo tertinggi
SELECT id, name, balance
FROM customers
ORDER BY balance DESC NULLS LAST, name ASC
LIMIT 10 OFFSET 10;
```

**Hafalan:**

```text
ORDER BY col DESC LIMIT 10 OFFSET 20 → mengurutkan data dan memotong baris untuk paginasi halaman
```

---

<a id="bagian-15"></a>

## 15. 🟡 Fungsi Agregasi Dasar

#### Konsep

Fungsi agregasi menghitung kumpulan baris data menjadi **satu nilai ringkasan tunggal**:

- **`COUNT(*)`:** Menghitung total jumlah baris.
- **`COUNT(kolom)`:** Menghitung jumlah baris yang tidak bernilai `NULL`.
- **`SUM(kolom)`:** Menghitung jumlah total nilai numerik.
- **`AVG(kolom)`:** Menghitung rata-rata nilai numerik.
- **`MIN(kolom)` / `MAX(kolom)`:** Mencari nilai terendah dan tertinggi.

#### Contoh

```sql
SELECT 
    COUNT(*) AS total_pelanggan,
    SUM(balance) AS total_uang_beredar,
    AVG(balance) AS rata_rata_saldo,
    MIN(balance) AS saldo_terendah,
    MAX(balance) AS saldo_tertinggi
FROM customers
WHERE is_active = TRUE;
```

**Hafalan:**

```text
COUNT(*), SUM(col), AVG(col), MIN(col), MAX(col) → lima fungsi agregasi statistik dasar SQL
```

---

<a id="bagian-16"></a>

## 16. 🟡 Pengelompokan Data dengan `GROUP BY` & Penyaringan Agregat `HAVING`

#### Konsep

1. **`GROUP BY`:** Mengelompokkan baris data yang memiliki nilai kolom yang sama ke dalam baris ringkasan.
2. **`HAVING`:** Menyaring hasil kalkulasi **setelah agregasi selesai**.

> [!IMPORTANT]
> **Perbedaan `WHERE` vs `HAVING`:**
> - `WHERE` memfilter **baris data mentah SEBELUM agregasi dihitung**.
> - `HAVING` memfilter **hasil kalkulasi agregasi SETELAH `GROUP BY` selesai**.

#### Contoh

```sql
SELECT 
    role,
    COUNT(*) AS jumlah_user,
    AVG(balance) AS rata_rata_saldo
FROM customers
WHERE is_active = TRUE              -- 1. Filter baris data mentah
GROUP BY role                      -- 2. Kelompokkan per role
HAVING COUNT(*) >= 2               -- 3. Hanya tampilkan role yang anggotanya minimal 2 orang
ORDER BY jumlah_user DESC;
```

#### Cara Kerja

```text
Tabel Customers Mentah (100 Baris)
             │
             ▼ WHERE is_active = TRUE (Saring baris: sisa 80)
Baris Aktif
             │
             ▼ GROUP BY role (Kelompokkan ke grup: CUSTOMER, ADMIN, SELLER)
Grup Terbentuk
             │
             ▼ HAVING COUNT(*) >= 2 (Saring grup hasil agregasi)
Hasil Akhir Ringkas
```

**Hafalan:**

```text
GROUP BY col HAVING COUNT(*) > n → mengelompokkan baris dan menyaring grup berdasarkan hasil agregasi
```

---

<a id="bagian-17"></a>

## 17. 🟡 Relasi Antar Tabel & Foreign Key Constraints

#### Konsep

**Foreign Key (Kunci Tamu)** menghubungkan kolom di tabel anak (*Child*) ke Primary Key di tabel induk (*Parent*), menjamin integritas referensial.

Aksi Integritas Hapus Data (**`ON DELETE`**):
- **`ON DELETE CASCADE`:** Jika data parent dihapus, **seluruh data child yang berelasi otomatis ikut terhapus**.
- **`ON DELETE SET NULL`:** Jika parent dihapus, kolom foreign key di child diubah menjadi `NULL`.
- **`ON DELETE RESTRICT` (Default):** Melarang penghapusan data parent jika masih ada data child yang mengikatnya.

#### Contoh

Tabel Induk (Categories):
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE
);
```

Tabel Anak (Products):
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    stock INT DEFAULT 0 CHECK (stock >= 0)
);
```

**Hafalan:**

```text
REFERENCES parent_table(id) ON DELETE CASCADE → relasi kunci asing dengan penghapusan berjenjang otomatis
```

---

<a id="bagian-18"></a>

## 18. 🔴 Teknik Menggabungkan Tabel (JOIN Inti): `INNER JOIN` & `LEFT JOIN`

#### Konsep

1. **`INNER JOIN`:** Hanya menampilkan baris yang **memiliki kecocokan data di KEDUA tabel** (Irisan himpunan).
2. **`LEFT JOIN` (LEFT OUTER JOIN):** Menampilkan **SEMUA baris dari tabel kiri**, ditambah data yang cocok dari tabel kanan. Jika tabel kanan tidak memiliki pasangan, kolom kanan akan bernilai `NULL`.

#### Contoh

```sql
-- 1. INNER JOIN: Hanya produk yang memiliki kategori yang tampil
SELECT 
    p.id AS product_id,
    p.name AS product_name,
    p.price,
    c.name AS category_name
FROM products p
INNER JOIN categories c ON p.category_id = c.id;

-- 2. LEFT JOIN: SEMUA produk tampil (termasuk produk tanpa kategori / NULL)
SELECT 
    p.name AS product_name,
    COALESCE(c.name, 'Tanpa Kategori') AS category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;
```

**Hafalan:**

```text
INNER JOIN table_b ON table_a.b_id = table_b.id → menggabungkan hanya baris yang memiliki pasangan cocok
LEFT JOIN table_b ON table_a.b_id = table_b.id  → mempertahankan seluruh baris tabel kiri
```

---

<a id="bagian-19"></a>

## 19. 🔴 Teknik Menggabungkan Tabel (JOIN Lanjutan): `RIGHT JOIN`, `FULL OUTER JOIN`, dan `CROSS JOIN`

#### Konsep

- **`RIGHT JOIN`:** Menampilkan semua baris dari tabel kanan.
- **`FULL OUTER JOIN`:** Menampilkan semua baris dari tabel kiri DAN tabel kanan (data yang tidak cocok diisi `NULL`).
- **`CROSS JOIN` (Cartesian Product):** Mengalikan setiap baris tabel A dengan setiap baris tabel B ($N \times M$ kombinasi baris).

#### Contoh

```sql
-- FULL OUTER JOIN: Tampilkan semua kategori & semua produk meski tidak berpasangan
SELECT 
    p.name AS product_name,
    c.name AS category_name
FROM products p
FULL OUTER JOIN categories c ON p.category_id = c.id;
```

**Hafalan:**

```text
FULL OUTER JOIN → menggabungkan seluruh baris kedua tabel baik yang cocok maupun yang tidak berpasangan
```

---

<a id="bagian-20"></a>

## 20. 🔴 Operasi Himpunan Baris Data: `UNION`, `UNION ALL`, `INTERSECT`, dan `EXCEPT`

#### Konsep

Operasi himpunan menggabungkan hasil dari 2 query `SELECT` yang berbeda (dengan jumlah dan tipe kolom yang sama):

- **`UNION`:** Menggabungkan baris dan **menghapus duplikasi baris**.
- **`UNION ALL`:** Menggabungkan baris **tanpa membuang duplikasi** (Jauh lebih cepat dari `UNION` biasa).
- **`INTERSECT`:** Hanya mengambil baris yang muncul di **kedua query**.
- **`EXCEPT`:** Mengambil baris di Query 1 yang **TIDAK ADA di Query 2**.

#### Contoh

```sql
-- UNION ALL: Menggabungkan email pelanggan dan email vendor ke 1 daftar
SELECT email, 'CUSTOMER' AS sumber FROM customers
UNION ALL
SELECT email, 'SUPPLIER' AS sumber FROM suppliers
ORDER BY email ASC;
```

**Hafalan:**

```text
UNION ALL → menggabungkan baris data dari 2 query secara instan tanpa komputasi sorting dedup
```

---

<a id="bagian-21"></a>

## 21. 🛠️ Peta Ingatan Cepat

```text
                       PETA ARSITEKTUR POSTGRESQL DASAR
                                       │
       ┌───────────────────────────────┼───────────────────────────────┐
       ▼                               ▼                               ▼
DDL & TIPE DATA MODERN         DML & UPSERT ENGINE             QUERY & AGREGASI
├─ UUID (gen_random_uuid)      ├─ INSERT INTO ... RETURNING    ├─ SELECT ... WHERE
├─ ENUM (CREATE TYPE)          ├─ ON CONFLICT DO UPDATE        ├─ ILIKE '%search%'
├─ CHECK Constraints           ├─ UPDATE & DELETE RETURNING    ├─ GROUP BY & HAVING
└─ Foreign Keys (CASCADE)      └─ TRUNCATE TABLE (Fast Clear)  └─ Multi-Table JOINs
```

---

<a id="bagian-22"></a>

## 22. 📚 Tabel Ringkasan

| Perintah / Klausul | Kategori | Fungsi & Karakteristik Utama |
|---|---|---|
| `CREATE TABLE` | DDL | Mendefinisikan tabel baru beserta tipe data dan batasan constraints |
| `ALTER TABLE` | DDL | Memodifikasi struktur tabel (tambah/hapus kolom, ubah tipe) |
| `TRUNCATE TABLE` | DDL | Mengosongkan seluruh baris tabel secara instan berkinerja tinggi |
| `INSERT INTO` | DML | Menyimpan baris data baru ke dalam tabel |
| `RETURNING *` | DML Clause | Mengembalikan data baris yang baru saja di-insert/update/delete |
| `ON CONFLICT` | DML Clause | Menangani duplikasi kunci unik untuk operasi UPSERT |
| `WHERE` | Query | Menyaring baris data mentah berdasarkan kondisi logika |
| `ILIKE` | Query Operator| Pencarian teks pola case-insensitive tanpa peduli huruf besar/kecil |
| `GROUP BY` | Query | Mengelompokkan baris data berdasarkan nilai kolom yang sama |
| `HAVING` | Query | Menyaring hasil perhitungan fungsi agregasi |
| `INNER JOIN` | Relasi JOIN | Menggabungkan hanya baris yang memiliki pasangan cocok di kedua tabel |
| `LEFT JOIN` | Relasi JOIN | Mempertahankan semua baris tabel kiri dan memadankan tabel kanan |

---

<a id="bagian-23"></a>

## 23. ⚡ Cheat Code PostgreSQL Dasar 10 Detik

```sql
-- 1. Template Tabel Modern dengan UUID, ENUM & CHECK
CREATE TYPE item_type AS ENUM ('PHYSICAL', 'DIGITAL');
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price > 0),
    type item_type DEFAULT 'PHYSICAL',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Template UPSERT dengan RETURNING
INSERT INTO items (sku, name, price)
VALUES ('SKU-01', 'Keyboard', 500000.00)
ON CONFLICT (sku) 
DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price
RETURNING *;
```

---

<a id="bagian-24"></a>

## 24. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Tooling psql & Tipe Data Modern
├── Kuasai navigasi psql (\l, \c, \dt, \d+)
└── Gunakan UUID gen_random_uuid(), ENUM, NUMERIC, dan TIMESTAMPTZ
       │
       ▼
Langkah 2: DDL Constraints & DML dengan RETURNING
├── Terapkan CHECK, UNIQUE, NOT NULL, dan DEFAULT pada CREATE TABLE
└── Gunakan INSERT/UPDATE/DELETE dengan klausa RETURNING * dan UPSERT
       │
       ▼
Langkah 3: Filtering Cerdas & Agregasi
├── Gunakan pencarian teks ILIKE dan paginasi LIMIT/OFFSET
└── Kelola laporan data dengan GROUP BY dan penyaring HAVING
       │
       ▼
Langkah 4: Relasi Antar Tabel & Multi-JOINs
├── Hubungkan tabel dengan Foreign Key (ON DELETE CASCADE)
└── Gabungkan data relasi menggunakan INNER JOIN dan LEFT JOIN
       │
       ▼
Langkah 5: Siap Melangkah ke PostgreSQL Lanjutan (Index, JSONB, CTE & Transaksi)!
```

---

<a id="bagian-25"></a>

## 25. 🏗️ Mini Project: Production-Ready E-Commerce Relational Database Schema & Reporting Query Suite

Skema database e-commerce relasional lengkap dan runnable di PostgreSQL 16: **DDL dengan UUID, ENUM, CHECK Constraints, Relasi Foreign Key `ON DELETE CASCADE`, DML dengan `RETURNING` & UPSERT, serta Analisis Laporan Penjualan Multi-Tabel dengan `INNER JOIN`, `LEFT JOIN`, dan `GROUP BY` / `HAVING`**.

```sql
-- =========================================================================
-- 1. SETUP TIPE DATA ENUM & SKEMA TABEL LENGKAP
-- =========================================================================

-- Hapus tabel lama jika ada
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TYPE IF EXISTS order_status_enum CASCADE;
DROP TYPE IF EXISTS customer_tier_enum CASCADE;

-- Buat Tipe Kustom ENUM
CREATE TYPE order_status_enum AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'CANCELLED');
CREATE TYPE customer_tier_enum AS ENUM ('REGULAR', 'VIP', 'PLATINUM');

-- TABEL 1: CUSTOMERS
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    tier customer_tier_enum DEFAULT 'REGULAR' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- TABEL 2: PRODUCTS
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price > 0),
    stock INT DEFAULT 0 NOT NULL CHECK (stock >= 0),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- TABEL 3: ORDERS (Header Transaksi)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status order_status_enum DEFAULT 'PENDING' NOT NULL,
    total_amount NUMERIC(14, 2) DEFAULT 0.00 CHECK (total_amount >= 0),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- TABEL 4: ORDER_ITEMS (Detail Baris Pesanan)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price > 0),
    subtotal NUMERIC(14, 2) NOT NULL CHECK (subtotal > 0)
);

-- =========================================================================
-- 2. DML SEED DATA (MENGGUNAKAN INSERT, RETURNING & UPSERT)
-- =========================================================================

-- Seed Pelanggan
INSERT INTO customers (id, full_name, email, tier)
VALUES 
    ('c1000000-0000-0000-0000-000000000001', 'Budi Santoso', 'budi@ecommerce.com', 'PLATINUM'),
    ('c1000000-0000-0000-0000-000000000002', 'Siti Rahmawati', 'siti@ecommerce.com', 'VIP'),
    ('c1000000-0000-0000-0000-000000000003', 'Andi Nugraha', 'andi@ecommerce.com', 'REGULAR')
ON CONFLICT (email) DO NOTHING;

-- Seed Produk (dengan UPSERT)
INSERT INTO products (id, sku, name, category, price, stock)
VALUES 
    ('p1000000-0000-0000-0000-000000000001', 'LAP-01', 'Laptop Gaming ASUS ROG', 'ELEKTRONIK', 22000000.00, 5),
    ('p1000000-0000-0000-0000-000000000002', 'MOU-01', 'Wireless Mouse Logitech MX', 'AKSESORIS', 1450000.00, 20),
    ('p1000000-0000-0000-0000-000000000003', 'KEY-01', 'Mechanical Keyboard Keychron', 'AKSESORIS', 1250000.00, 15),
    ('p1000000-0000-0000-0000-000000000004', 'MON-01', 'Monitor Dell 4K UltraSharp', 'DISPLAY', 6500000.00, 8)
ON CONFLICT (sku) 
DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock;

-- Seed Transaksi Order & Items
INSERT INTO orders (id, customer_id, order_number, status, total_amount)
VALUES 
    ('o1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'ORD-2026-001', 'PAID', 23450000.00),
    ('o1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'ORD-2026-002', 'PAID', 2700000.00);

INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
VALUES 
    ('o1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 1, 22000000.00, 22000000.00),
    ('o1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000002', 1, 1450000.00, 1450000.00),
    ('o1000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000002', 1, 1450000.00, 1450000.00),
    ('o1000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000003', 1, 1250000.00, 1250000.00);

-- =========================================================================
-- 3. QUERY ANALISIS & LAPORAN PENJUALAN KOMPLEKS (REPORTING SUITE)
-- =========================================================================

-- LAPORAN 1: Rincian Lengkap Seluruh Pesanan (Multi-Table INNER JOIN)
SELECT 
    o.order_number,
    c.full_name AS customer_name,
    c.tier AS customer_tier,
    p.name AS product_name,
    oi.quantity,
    oi.unit_price,
    oi.subtotal,
    o.status AS order_status
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
INNER JOIN order_items oi ON o.id = oi.order_id
INNER JOIN products p ON oi.product_id = p.id
ORDER BY o.created_at DESC, oi.subtotal DESC;

-- LAPORAN 2: Rekap Omset & Total Belanja per Pelanggan (LEFT JOIN & GROUP BY / HAVING)
SELECT 
    c.full_name,
    c.email,
    c.tier,
    COUNT(o.id) AS total_transaksi,
    COALESCE(SUM(o.total_amount), 0.00) AS total_belanja_akumulasi
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id AND o.status = 'PAID'
GROUP BY c.id, c.full_name, c.email, c.tier
HAVING COUNT(o.id) >= 1
ORDER BY total_belanja_akumulasi DESC;

-- LAPORAN 3: Pencarian Produk Aksesoris dengan ILIKE dan Cek Stok
SELECT 
    sku,
    name,
    category,
    price,
    stock
FROM products
WHERE category ILIKE '%aksesoris%' AND stock > 0
ORDER BY price ASC;
```

#### Hasil Output Eksekusi Query Laporan (Terminal psql)

```text
-- OUTPUT LAPORAN 1:
 order_number |  customer_name  | customer_tier |         product_name          | quantity | unit_price  |  subtotal   | order_status 
--------------+-----------------+---------------+-------------------------------+----------+-------------+-------------+--------------
 ORD-2026-001 | Budi Santoso    | PLATINUM      | Laptop Gaming ASUS ROG        |        1 | 22000000.00 | 22000000.00 | PAID
 ORD-2026-001 | Budi Santoso    | PLATINUM      | Wireless Mouse Logitech MX    |        1 |  1450000.00 |  1450000.00 | PAID
 ORD-2026-002 | Siti Rahmawati  | VIP           | Wireless Mouse Logitech MX    |        1 |  1450000.00 |  1450000.00 | PAID
 ORD-2026-002 | Siti Rahmawati  | VIP           | Mechanical Keyboard Keychron  |        1 |  1250000.00 |  1250000.00 | PAID
(4 rows)

-- OUTPUT LAPORAN 2:
   full_name    |       email        |   tier   | total_transaksi | total_belanja_akumulasi 
----------------+--------------------+----------+-----------------+-------------------------
 Budi Santoso   | budi@ecommerce.com | PLATINUM |               1 |             23450000.00
 Siti Rahmawati | siti@ecommerce.com | VIP      |               1 |              2700000.00
(2 rows)
```

---

<a id="bagian-26"></a>

## 26. 🔗 Referensi Resmi

- [PostgreSQL 16 Official Documentation](https://www.postgresql.org/docs/16/index.html)
- [PostgreSQL Data Types Reference](https://www.postgresql.org/docs/16/datatype.html)
- [PostgreSQL Queries & SELECT Commands](https://www.postgresql.org/docs/16/queries.html)
- [PostgreSQL Table Partitioning & Constraints Guide](https://www.postgresql.org/docs/16/ddl-constraints.html)
