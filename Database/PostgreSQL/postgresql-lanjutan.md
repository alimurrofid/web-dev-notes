---
title: "PostgreSQL Lanjutan"
description: "Query SQL lanjutan di PostgreSQL: JOIN (INNER, LEFT, RIGHT, FULL), Subqueries, Aggregate Functions & GROUP BY, Common Table Expressions (CTE), dan Window Functions."
order: 2
tags:
  - database
  - postgresql
  - sql
  - intermediate
---

# PostgreSQL Lanjutan

> **Target:** Pemula yang telah menguasai dasar-dasar SQL dan PostgreSQL Dasar, serta ingin melangkah ke tingkat menengah-mahir (**Query Tuning `EXPLAIN (ANALYZE, BUFFERS)`, B-Tree & GIN Indexing, Fuzzy Search `pg_trgm` Trigram, Manipulasi Dokumen JSONB, Advanced Upsert `ON CONFLICT` & `MERGE`, Common Table Expressions (CTE) & Recursive CTE, Window Functions analitik (`ROW_NUMBER`, `LEAD`/`LAG`), dan Transaksi ACID dengan Row-Level Locking `SELECT ... FOR UPDATE`**) menggunakan **PostgreSQL 16+**.
>
> Fokus cheatsheet ini: **mental model Query Cost Optimizer → `EXPLAIN ANALYZE` execution plan → B-Tree & GIN Indexing → Partial & Expression Index → Fuzzy Search & Typo Tolerance `pg_trgm` → JSON vs JSONB (Binary JSON) → Operator JSONB (`->`, `->>`, `@>`, `?`) → Advanced Upsert (`ON CONFLICT` & `MERGE`) → CTE `WITH` & Hierarki Pohon `WITH RECURSIVE` → Window Functions vs `GROUP BY` → `OVER (PARTITION BY ...)` → Ranking (`ROW_NUMBER`, `RANK`, `DENSE_RANK`) → Value (`LEAD`, `LAG`, Running Totals) → Transaksi ACID & `SAVEPOINT` → Isolation Levels → Row Locking `SELECT ... FOR UPDATE` pencegah Race Condition & Deadlock → mini project Financial Analytics & High-Concurrency Inventory System**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: EXPLAIN ANALYZE, B-Tree Index, GIN Index, Partial Index, dan Fuzzy Search pg_trgm

🟡 Lanjutan
→ pelajari setelah Indexing: Tipe Data JSONB, Manipulasi JSONB, Advanced Upsert ON CONFLICT / MERGE, CTE WITH, dan Recursive CTE

🔴 Advanced / Operasional
→ penting untuk skala enterprise: Window Functions analitik, Transaksi ACID, Isolation Levels, dan SELECT FOR UPDATE
```

Mental model optimasi query dan evaluasi Execution Plan di PostgreSQL:

```text
                 QUERY SQL DIKIRIM KE ENGINE
                               │
                               ▼
                 1. PARSER & REWRITER
            (Cek sintaks SQL & ubah query)
                               │
                               ▼
                 2. COST-BASED OPTIMIZER
         (Hitung biaya I/O: Seq Scan vs Index Scan)
                               │
                               ▼
                 3. EXECUTOR
       ┌──────────────────────┴──────────────────────┐
       ▼ (Tabel Kecil / Tanpa Index)                 ▼ (Tabel Besar + Index Cocok)
  Sequential Scan (Lambat O(N))                Index Scan / Index Only Scan (Cepat O(log N))
       │                                             │
       └──────────────────────┬──────────────────────┘
                              ▼
                 PENGEMBALIAN HASIL QUERY KE CLIENT
```

**Hafalan:**

```text
EXPLAIN ANALYZE      → perintah analisis untuk melihat rencana eksekusi dan waktu nyata eksekusi query milidetik
B-Tree Index         → struktur indeks standar PostgreSQL untuk pencarian cepat operasi perbandingan =, <, >, BETWEEN
GIN Index            → Generalized Inverted Index untuk pencarian super cepat di dalam Array dan dokumen JSONB (@>)
pg_trgm (Trigram)    → ekstensi pencarian kemiripan teks (fuzzy search) dan akselerator query LIKE '%...%' via GIN index
JSONB                → format penyimpanan JSON biner yang terdekompresi, mendukung indeks, dan cepat diproses
ON CONFLICT          → klausul upsert untuk menangani konflik unique key (DO UPDATE SET atau DO NOTHING)
MERGE INTO           → statement standar ANSI SQL untuk menyinkronkan data antar-tabel secara kondisional (PostgreSQL 15+)
CTE (WITH)           → Common Table Expression untuk menyusun subquery sementara yang rapi dan modular
Recursive CTE        → query rekursif untuk membaca struktur hierarki bertingkat (pohon kategori, bagan manajer)
Window Function      → fungsi kalkulasi analitik (OVER PARTITION BY) yang tidak menghilangkan baris data individual
SELECT ... FOR UPDATE→ mekanisme penguncian baris (Row Locking) untuk mencegah race condition / double-spending
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan PostgreSQL Lanjutan & Mental Model Query Cost Optimizer](#bagian-1)
2. [Analisis Kinerja Query dengan `EXPLAIN` & `EXPLAIN (ANALYZE, BUFFERS)`](#bagian-2)
3. [Arsitektur Indexing: B-Tree Index & Composite Multi-Column Index](#bagian-3)
4. [Specialized Indexing: GIN Index (Generalized Inverted Index)](#bagian-4)
5. [Partial Indexing & Expression Index](#bagian-5)
6. [Fuzzy Search & Typo Tolerance dengan Ekstensi `pg_trgm`](#bagian-6)

### 🟡 Lanjutan

7. [Tipe Data JSON vs JSONB (Binary JSON)](#bagian-7)
8. [Operator & Fungsi JSONB Inti](#bagian-8)
9. [Manipulasi & Modifikasi Data JSONB](#bagian-9)
10. [Advanced Upsert: `ON CONFLICT` & Statement `MERGE`](#bagian-10)
11. [Common Table Expressions (CTE / Klausul `WITH`)](#bagian-11)
12. [Recursive CTE (`WITH RECURSIVE`) untuk Data Berjenjang](#bagian-12)

### 🔴 Advanced / Operasional

13. [Pengenalan Window Functions & Perbedaannya dengan `GROUP BY`](#bagian-13)
14. [Anatomi Klausul `OVER (PARTITION BY ... ORDER BY ...)`](#bagian-14)
15. [Ranking Window Functions: `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `NTILE()`](#bagian-15)
16. [Value Window Functions: `LEAD()`, `LAG()`, `FIRST_VALUE()`, `LAST_VALUE()`](#bagian-16)
17. [Running Totals & Moving Averages dengan Window Functions](#bagian-17)
18. [Transaksi Database & Prinsip ACID](#bagian-18)
19. [Titik Pemulihan Parsial dengan `SAVEPOINT`](#bagian-19)
20. [Transaction Isolation Levels](#bagian-20)
21. [Pencegahan Race Condition dengan Row-Level Locking (`SELECT ... FOR UPDATE`)](#bagian-21)
22. [Deadlock Detection & Strategi Mitigasi](#bagian-22)

### 🛠️ Referensi & Praktik

23. [Peta Ingatan Cepat](#bagian-23)
24. [Tabel Ringkasan](#bagian-24)
25. [Cheat Code PostgreSQL Lanjutan 10 Detik](#bagian-25)
26. [Urutan Belajar yang Disarankan](#bagian-26)
27. [Mini Project: Production-Ready Financial Analytics & High-Concurrency Inventory System](#bagian-27)
28. [Referensi Resmi](#bagian-28)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan PostgreSQL Lanjutan & Mental Model Query Cost Optimizer

#### Konsep

PostgreSQL memiliki **Cost-Based Query Optimizer (CBO)** yang sangat canggih:
- Sebelum mengeksekusi query, optimizer membuat beberapa alternatif *Execution Plan*.
- Optimizer menghitung estimasi biaya (*cost*) berdasarkan statistik tabel (jumlah baris, distribusi nilai kolom, dan kecepatan disk page fetch).
- Rencana dengan nilai *cost* terendah akan dipilih oleh *Executor*.

#### Cara Kerja

```text
Query SQL: SELECT * FROM users WHERE email = 'budi@mail.com'
                         │
                         ▼
        Cost-Based Optimizer Menghitung Biaya:
 ├── Opsi A (Seq Scan): Periksa 1.000.000 baris satu per satu ──> Cost: 25.000 (Lambat) ❌
 └── Opsi B (Index Scan): Lompat langsung via B-Tree Index ────> Cost: 4.25 (Cepat) ✅
                         │
                         ▼
        Opsi B Dipilih & Dijalankan dalam 0.05 ms!
```

**Hafalan:**

```text
Cost-Based Optimizer → komponen internal PostgreSQL yang memilih rute eksekusi query tercepat dan berbiaya I/O terendah
```

---

<a id="bagian-2"></a>

## 2. 🟢 Analisis Kinerja Query dengan `EXPLAIN` & `EXPLAIN (ANALYZE, BUFFERS)`

#### Konsep

1. **`EXPLAIN query`:** Menampilkan estimasi rencana eksekusi tanpa benar-benar menjalankan query (*Estimasi Teoretis*).
2. **`EXPLAIN (ANALYZE, BUFFERS) query`:** **Menjalankan query secara nyata** dan mencatat metrik asli:
   - **`actual time`:** Waktu nyata eksekusi dalam milidetik (`ms`).
   - **`Buffers: shared hit`:** Jumlah halaman data yang dibaca dari memory RAM (*Shared Buffer*).
   - **`Buffers: shared read`:** Jumlah halaman data yang terpaksa dibaca dari storage disk fisik (*I/O lambat*).

#### Contoh

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, name, email 
FROM users 
WHERE email = 'budi@mail.com';
```

#### Output

```text
Index Scan using idx_users_email on users  (cost=0.42..8.44 rows=1 width=45) (actual time=0.032..0.033 rows=1 loops=1)
  Index Cond: ((email)::text = 'budi@mail.com'::text)
  Buffers: shared hit=3
Planning Time: 0.095 ms
Execution Time: 0.051 ms
```

**Hafalan:**

```text
EXPLAIN (ANALYZE, BUFFERS) query; → menjalankan query nyata dan menampilkan waktu eksekusi serta konsumsi memory buffer
```

---

<a id="bagian-3"></a>

## 3. 🟢 Arsitektur Indexing: B-Tree Index & Composite Multi-Column Index

#### Konsep

1. **B-Tree Index (Default):**
   - Struktur pohon seimbang (*Self-Balancing Search Tree*) berkinerja $O(\log N)$.
   - Ideal untuk perbandingan kesetaraan (`=`), rentang (`<`, `<=`, `>`, `>=`, `BETWEEN`), dan `ORDER BY`.
2. **Composite Index (Multi-Column):**
   - Indeks gabungan beberapa kolom: `CREATE INDEX idx ON orders (user_id, status)`.
   - **Aturan Leftmost Prefix:** Indeks ini efektif untuk query yang memfilter `user_id` saja, atau `user_id` DAN `status`. Indeks ini **TIDAK efektif** jika query hanya memfilter `status` tanpa `user_id`!

#### Contoh

```sql
-- 1. B-Tree Index Tunggal
CREATE INDEX idx_products_sku ON products (sku);

-- 2. Composite Index (Urutan kolom menentukan efisiensi!)
CREATE INDEX idx_orders_user_status ON orders (user_id, status);

-- Query ini 100% menggunakan index:
SELECT * FROM orders WHERE user_id = 'u-101' AND status = 'PAID';
```

**Hafalan:**

```text
CREATE INDEX index_name ON table_name (col1, col2); → membuat B-Tree composite index dengan aturan leftmost prefix
```

---

<a id="bagian-4"></a>

## 4. 🟢 Specialized Indexing: GIN Index (Generalized Inverted Index)

#### Konsep

**GIN (Generalized Inverted Index)**:
- Indeks pembalik (*Inverted Index*) yang memetakan setiap elemen/kunci individual di dalam kolom ke baris-baris data yang memuatnya.
- **Sangat Kuat Untuk:**
  - Pencarian di dalam dokumen **JSONB** (`@>`, `?`, `?|`, `?&`).
  - Pencarian di dalam **Tipe Data Array** (`tags text[]`).

#### Contoh

```sql
-- Buat GIN Index pada Kolom JSONB
CREATE INDEX idx_products_attributes_gin ON products USING GIN (attributes);

-- Query Pencarian JSONB Super Cepat (Memanfaatkan GIN Index):
SELECT id, name, attributes 
FROM products 
WHERE attributes @> '{"color": "black", "brand": "Logitech"}';
```

**Hafalan:**

```text
CREATE INDEX index_name ON table_name USING GIN (jsonb_or_array_column); → indeks GIN untuk operasi pencarian JSONB dan Array
```

---

<a id="bagian-5"></a>

## 5. 🟢 Partial Indexing & Expression Index

#### Konsep

1. **Partial Index (`WHERE condition`):**
   - Hanya mengindeks baris-baris data yang memenuhi kriteria tertentu.
   - **Keuntungan:** Ukuran indeks 90% lebih kecil di disk dan jauh lebih cepat di-*update*.
2. **Expression Index (Index pada Hasil Fungsi):**
   - Mengindeks hasil ekspresi/fungsi, misal: `LOWER(email)` agar pencarian case-insensitive tetap menggunakan indeks.

#### Contoh

```sql
-- 1. Partial Index: Hanya indeks pesanan yang belum selesai
CREATE INDEX idx_orders_unprocessed ON orders (created_at) 
WHERE status IN ('PENDING', 'PROCESSING');

-- 2. Expression Index: Pencarian email huruf kecil
CREATE INDEX idx_users_lower_email ON users (LOWER(email));

-- Query yang otomatis menggunakan Expression Index:
SELECT * FROM users WHERE LOWER(email) = 'budi@mail.com';
```

**Hafalan:**

```text
CREATE INDEX idx ON tbl (col) WHERE condition; → partial index hemat disk | CREATE INDEX idx ON tbl (LOWER(col)); → expression index
```

---

<a id="bagian-6"></a>

## 6. 🟢 Fuzzy Search & Typo Tolerance dengan Ekstensi `pg_trgm`

#### Konsep

Pencarian teks biasa menggunakan `LIKE '%keyword%'` memiliki dua kelemahan fatal:
1. **Sangat Lambat:** `LIKE '%...%'` tidak dapat menggunakan B-Tree index biasa dan terpaksa melakukan *Full Table Scan*.
2. **Kaku (No Typo Tolerance):** Jika pengguna salah ketik (misal: mencari `"smphone"` alih-alih `"smartphone"`), hasil query akan kosong.

**Solusi: Ekstensi `pg_trgm` (Trigram)**:
- Memecah teks menjadi potongan 3 karakter (trigram) berurutan.
- Mendukung **GIN Index pada ekspresi string** untuk meng-akselerasi `LIKE '%keyword%'` hingga 100x lipat.
- Menyediakan operator kemiripan teks:
  - **`%`** : Pencocokan berdasarkan *similarity threshold* (default > 0.3).
  - **`<->`** : Operator jarak kemiripan (*Distance*) untuk `ORDER BY` dari yang paling mirip.

#### Contoh

```sql
-- [1] Aktifkan Ekstensi Trigram
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- [2] Buat GIN Index Trigram pada Kolom Teks
CREATE INDEX idx_products_name_trgm ON products USING GIN (name gin_trgm_ops);

-- [3] Query Pencarian Cepat LIKE '%...%' (Menggunakan GIN Index!)
SELECT id, name, price 
FROM products 
WHERE name ILIKE '%mechanical keyboard%';

-- [4] Query Fuzzy Search dengan Toleransi Typo (User mencari 'leptop')
SELECT id, name, similarity(name, 'leptop asus') AS skor_kemiripan
FROM products
WHERE name % 'leptop asus'
ORDER BY name <-> 'leptop asus'
LIMIT 5;
```

#### Output

```text
 id |          name           | skor_kemiripan 
----+-------------------------+----------------
  1 | Laptop Asus ROG Strix   |           0.78
  4 | Laptop Asus Vivobook 14 |           0.71
```

**Hafalan:**

```text
CREATE EXTENSION pg_trgm; CREATE INDEX idx ON tbl USING GIN (col gin_trgm_ops); → fuzzy search cepat dan toleran typo
```

---

<a id="bagian-7"></a>

## 7. 🟡 Tipe Data JSON vs JSONB (Binary JSON)

#### Konsep

PostgreSQL menyediakan dua tipe data untuk menyimpan dokumen JSON:

| Karakteristik | `JSON` (Plain Text) | `JSONB` (Binary JSON - Standar Industri) |
|---|---|---|
| **Format Simpan** | Teks string mentah persis seperti input | Format biner terdekompresi & terstruktur |
| **Kecepatan Tulis** | Sedikit lebih cepat (tanpa parsing biner) | Memerlukan sedikit waktu parsing biner |
| **Kecepatan Baca** | Lambat (harus re-parse setiap query) | **Sangat Cepat** (siap diekstrak langsung) |
| **Dukungan Index** | Terbatas | **Penuh (GIN & BTREE Index Support)** |
| **Duplikasi Key** | Menyimpan key duplikat | Otomatis menghapus key duplikat (ambil terakhir)|

> [!TIP]
> **Gunakan `JSONB` dalam 99% kasus produksi!** Gunakan `JSON` biasa hanya jika Anda wajib mempertahankan urutan key asli atau spasi mentah dokumen.

**Hafalan:**

```text
Gunakan JSONB untuk dokumen fleksibel karena mendukung indexing GIN dan pemrosesan binary cepat
```

---

<a id="bagian-8"></a>

## 8. 🟡 Operator & Fungsi JSONB Inti

#### Konsep

Operator Ekstraksi & Pencarian JSONB:
- **`->`** : Mengekstrak elemen sebagai **objek JSONB**.
- **`->>`** : Mengekstrak elemen sebagai **tipe teks biasa (`text`)**.
- **`@>`** : Operator penampung (*Contains*): Apakah JSONB kiri memuat struktur JSONB kanan?
- **`?`** : Apakah string key tertentu ada di level atas dokumen JSONB?

#### Contoh

```sql
-- 1. Ekstrak nilai string: ->>
SELECT 
    id,
    attributes->>'brand' AS brand_name,
    (attributes->>'ram_gb')::int AS ram_size
FROM products;

-- 2. Filter dengan operator Contains (@>)
SELECT id, name 
FROM products 
WHERE attributes @> '{"is_wireless": true}';
```

**Hafalan:**

```text
-> menghasilkan tipe JSONB | ->> menghasilkan tipe teks | @> memeriksa apakah dokumen memuat JSON tertentu
```

---

<a id="bagian-9"></a>

## 9. 🟡 Manipulasi & Modifikasi Data JSONB

#### Konsep

1. **`jsonb_set(target, path, new_value, create_missing)`:** Mengubah atau menambah properti bersarang.
2. **`target || new_jsonb`:** Menggabungkan (*Concatenate / Merge*) dua objek JSONB.
3. **`target - 'key_name'`:** Menghapus key dari objek JSONB.

#### Contoh

```sql
-- 1. Update/Tambah Key 'warranty_months' bernilai 24
UPDATE products 
SET attributes = jsonb_set(attributes, '{warranty_months}', '24'::jsonb, true)
WHERE id = 1;

-- 2. Merge Patch JSONB (Menimpa properti lama dan menambah properti baru)
UPDATE products
SET attributes = attributes || '{"discount": 10, "is_promo": true}'::jsonb
WHERE id = 1;

-- 3. Hapus Key 'discount'
UPDATE products 
SET attributes = attributes - 'discount'
WHERE id = 1;
```

**Hafalan:**

```text
jsonb_set(col, '{path}', 'val'::jsonb) → mutasi properti bersarang | col || '{"k":"v"}'::jsonb → merge objek JSONB
```

---

<a id="bagian-10"></a>

## 10. 🟡 Advanced Upsert: `ON CONFLICT` & Statement `MERGE`

#### Konsep

1. **`INSERT ... ON CONFLICT` (PostgreSQL Native Upsert):**
   - Menangani benturan saat insert data yang melanggar *Unique Constraint* atau *Primary Key*.
   - Pilihan aksi:
     - **`DO NOTHING`** : Mengabaikan insert tanpa melempar error.
     - **`DO UPDATE SET ... WHERE ...`** : Memperbarui baris data yang bertabrakan menggunakan pseudo-tabel `EXCLUDED`.
2. **Statement `MERGE` (PostgreSQL 15+ / Standar ANSI SQL):**
   - Menyinkronkan tabel target dengan tabel sumber berdasarkan kondisi kesamaan data (*Source vs Target*).
   - Mendukung multi-aksi: `WHEN MATCHED THEN UPDATE`, `WHEN NOT MATCHED THEN INSERT`, `WHEN MATCHED AND ... THEN DELETE`.

#### Contoh

```sql
-- [1] Upsert Idempotent dengan ON CONFLICT (Update counter login jika email sudah ada)
INSERT INTO users (email, full_name, login_count, last_login)
VALUES ('budi@mail.com', 'Budi Santoso', 1, NOW())
ON CONFLICT (email) 
DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    login_count = users.login_count + 1,
    last_login = EXCLUDED.last_login;

-- [2] Statement MERGE Sinkronisasi Stok Gudang (Postgres 15+)
MERGE INTO inventory AS target
USING incoming_shipment AS source
ON target.product_id = source.product_id
WHEN MATCHED THEN
    UPDATE SET stock = target.stock + source.quantity, updated_at = NOW()
WHEN NOT MATCHED THEN
    INSERT (product_id, stock, updated_at) VALUES (source.product_id, source.quantity, NOW());
```

**Hafalan:**

```text
INSERT ... ON CONFLICT (unique_col) DO UPDATE SET col = EXCLUDED.col; → upsert data idempotent aman tanpa error race condition
```

---

<a id="bagian-11"></a>

## 11. 🟡 Common Table Expressions (CTE / Klausul `WITH`)

#### Konsep

**CTE (`WITH cte_name AS (...)`)**:
- Mendefinisikan tabel hasil sementara (*Temporary Result Set*) yang dapat direferensikan berulang kali di query utama.
- **Keuntungan:** Jauh lebih mudah dibaca dan di-maintain dibanding *Nested Subqueries* yang berantakan.

#### Contoh

```sql
WITH top_customers AS (
    SELECT user_id, SUM(total_amount) AS total_belanja
    FROM orders
    WHERE status = 'PAID'
    GROUP BY user_id
    HAVING SUM(total_amount) > 10000000
)
SELECT u.name, u.email, tc.total_belanja
FROM top_customers tc
JOIN users u ON u.id = tc.user_id
ORDER BY tc.total_belanja DESC;
```

**Hafalan:**

```text
WITH cte_name AS (SELECT ...) SELECT ... FROM cte_name; → membuat subquery sementara yang bersih dan terstruktur
```

---

<a id="bagian-12"></a>

## 12. 🟡 Recursive CTE (`WITH RECURSIVE`) untuk Data Berjenjang

#### Konsep

**`WITH RECURSIVE`**:
Sintaks khusus untuk membaca struktur data pohon / graf hierarki tak terbatas (seperti pohon kategori bersarang, bagan struktur organisasi karyawan, atau komentar bertingkat).

Format Dua Bagian:
1. **Anchor Member:** Titik awal data root (induk teratas).
2. **`UNION ALL`**
3. **Recursive Member:** Query yang mereferensikan nama CTE dirinya sendiri untuk menelusuri anak/cabang.

#### Contoh

```sql
WITH RECURSIVE category_tree AS (
    -- 1. Anchor Member: Kategori level paling atas (parent_id IS NULL)
    SELECT id, name, parent_id, 1 AS level, name::text AS path
    FROM categories
    WHERE parent_id IS NULL

    UNION ALL

    -- 2. Recursive Member: Gabungkan anak dengan parent-nya
    SELECT c.id, c.name, c.parent_id, ct.level + 1, ct.path || ' -> ' || c.name
    FROM categories c
    JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT id, name, level, path FROM category_tree ORDER BY path;
```

#### Output

```text
 id |     name      | level |              path               
----+---------------+-------+---------------------------------
  1 | Elektronik    |     1 | Elektronik
  3 | Komputer      |     2 | Elektronik -> Komputer
  5 | Laptop Gaming |     3 | Elektronik -> Komputer -> Laptop Gaming
```

**Hafalan:**

```text
WITH RECURSIVE cte AS (anchor_query UNION ALL recursive_query) → query hierarki data pohon tak terbatas
```

---

<a id="bagian-13"></a>

## 13. 🔴 Pengenalan Window Functions & Perbedaannya dengan `GROUP BY`

#### Konsep

- **`GROUP BY`:** Mengelompokkan baris data dan **menciutkannya menjadi 1 baris agregat** per grup (detail baris individual hilang).
- **`Window Function`:** Melakukan kalkulasi agregat/peringkat lintas partisi baris **TANPA menghilangkan atau menciutkan baris data asli**.

#### Cara Kerja

```text
GROUP BY departemen:
Departemen IT ──> [Budi: 10jt, Ani: 12jt, Candra: 8jt] ──> Output: IT: Rata-rata 10jt (Hanya 1 Baris)

Window Function OVER (PARTITION BY departemen):
Output:
Budi   | IT | 10jt | Rata-rata Dept: 10jt
Ani    | IT | 12jt | Rata-rata Dept: 10jt  (Semua baris individual tetap utuh!)
Candra | IT |  8jt | Rata-rata Dept: 10jt
```

**Hafalan:**

```text
Window Function menghitung nilai agregat lintas grup tanpa menciutkan baris data individual
```

---

<a id="bagian-14"></a>

## 14. 🔴 Anatomi Klausul `OVER (PARTITION BY ... ORDER BY ...)`

#### Konsep

Sintaks Window Function:
`FUNCTION() OVER (PARTITION BY kolom_grup ORDER BY kolom_urut)`

- **`PARTITION BY`** : Membagi baris data ke dalam partisi jendela terpisah (mirip `GROUP BY`).
- **`ORDER BY`** : Mengatur urutan evaluasi baris di dalam jendela tersebut.

**Hafalan:**

```text
OVER (PARTITION BY group_col ORDER BY sort_col) → membagi jendela partisi data untuk evaluasi analitik
```

---

<a id="bagian-15"></a>

## 15. 🔴 Ranking Window Functions: `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `NTILE()`

#### Konsep

Perbedaan 4 Fungsi Pemeringkat:
- **`ROW_NUMBER()`:** Nomor baris unik berurutan (1, 2, 3, 4) tanpa angka kembar.
- **`RANK()`:** Memberikan peringkat sama untuk nilai kembar, lalu **melompati angka berikutnya** (1, 2, 2, 4).
- **`DENSE_RANK()`:** Memberikan peringkat sama untuk nilai kembar **tanpa melompati angka** (1, 2, 2, 3).
- **`NTILE(N)`:** Membagi baris data menjadi $N$ kelompok kuartil/persentil yang sama besar.

#### Contoh

```sql
SELECT 
    name, 
    department, 
    salary,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS row_num,
    RANK()       OVER (PARTITION BY department ORDER BY salary DESC) AS rnk,
    DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dense_rnk
FROM employees;
```

**Hafalan:**

```text
ROW_NUMBER() selalu unik (1,2,3) | RANK() melompat (1,2,2,4) | DENSE_RANK() tidak melompat (1,2,2,3)
```

---

<a id="bagian-16"></a>

## 16. 🔴 Value Window Functions: `LEAD()`, `LAG()`, `FIRST_VALUE()`, `LAST_VALUE()`

#### Konsep

- **`LAG(kolom, offset)`:** Mengambil nilai baris **sebelumnya** di dalam partisi.
- **`LEAD(kolom, offset)`:** Mengambil nilai baris **berikutnya** di dalam partisi.
- **Sangat Berguna Untuk:** Menghitung pertumbuhan penjualan bulanan (*Month-over-Month Growth*).

#### Contoh

```sql
SELECT 
    bulan,
    omset,
    LAG(omset, 1) OVER (ORDER BY bulan) AS omset_bulan_lalu,
    omset - LAG(omset, 1) OVER (ORDER BY bulan) AS selisih_pertumbuhan
FROM monthly_sales;
```

**Hafalan:**

```text
LAG(col, 1) OVER (...) → membaca nilai baris sebelumnya | LEAD(col, 1) OVER (...) → membaca nilai baris berikutnya
```

---

<a id="bagian-17"></a>

## 17. 🔴 Running Totals & Moving Averages dengan Window Functions

#### Konsep

Menghitung akumulasi total berjalan (*Running Total*) dan rata-rata bergerak (*Moving Average*) tanpa loop pemrograman.

#### Contoh

```sql
SELECT 
    tanggal,
    penjualan_harian,
    -- Running Total Akumulasi dari Awal Bulan
    SUM(penjualan_harian) OVER (ORDER BY tanggal) AS akumulasi_penjualan,
    -- Moving Average 7 Hari Terakhir
    AVG(penjualan_harian) OVER (
        ORDER BY tanggal 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS rata_rata_7_hari
FROM daily_revenue;
```

**Hafalan:**

```text
SUM(col) OVER (ORDER BY date_col) → menghitung akumulasi total berjalan (running total)
```

---

<a id="bagian-18"></a>

## 18. 🔴 Transaksi Database & Prinsip ACID

#### Konsep

Transaksi memastikan sekelompok perintah SQL dieksekusi sebagai satu unit tak terpisahkan:
- **A (Atomicity):** Berhasil semua atau batal semua (*All or Nothing*).
- **C (Consistency):** Data selalu valid mematuhi seluruh constraint.
- **I (Isolation):** Transaksi yang berjalan bersamaan tidak saling merusak.
- **D (Durability):** Data yang telah di-commit tersimpan permanen di disk (via *Write-Ahead Logging / WAL*).

Perintah:
- `BEGIN;` : Memulai transaksi.
- `COMMIT;` : Menyimpan perubahan secara permanen.
- `ROLLBACK;` : Membatalkan seluruh perubahan jika terjadi error.

**Hafalan:**

```text
BEGIN; ... COMMIT; (simpan permanen) | BEGIN; ... ROLLBACK; (batalkan seluruh operasi)
```

---

<a id="bagian-19"></a>

## 19. 🔴 Titik Pemulihan Parsial dengan `SAVEPOINT`

#### Konsep

**`SAVEPOINT nama_titik`**:
Membuat penanda titik tengah di dalam transaksi, sehingga kita bisa membatalkan sebagian operasi yang gagal (`ROLLBACK TO SAVEPOINT`) tanpa harus membatalkan seluruh transaksi dari awal.

#### Contoh

```sql
BEGIN;

-- 1. Operasi Utama
INSERT INTO orders (id, user_id, total) VALUES ('ord-101', 'u-1', 500000);

-- 2. Buat Savepoint sebelum proses eksternal
SAVEPOINT payment_point;

-- 3. Percobaan Operasi Tambahan
INSERT INTO reward_points (user_id, points) VALUES ('u-1', 50);

-- Jika reward gagal, batalkan sebagian saja:
ROLLBACK TO SAVEPOINT payment_point;

-- Order utama tetap aman dan bisa di-commit!
COMMIT;
```

**Hafalan:**

```text
SAVEPOINT sp_name; ... ROLLBACK TO SAVEPOINT sp_name; → membatalkan sebagian operasi tanpa membatalkan seluruh transaksi
```

---

<a id="bagian-20"></a>

## 20. 🔴 Transaction Isolation Levels

#### Konsep

PostgreSQL mendukung 3 tingkat isolasi transaksi:

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|---|---|---|---|
| **`READ COMMITTED` (Default)** | Dicegah | Bisa Terjadi | Bisa Terjadi |
| **`REPEATABLE READ`** | Dicegah | Dicegah | Dicegah (di PostgreSQL) |
| **`SERIALIZABLE`** | Dicegah | Dicegah | Dicegah (Isolasi Mutlak) |

Cara Mengatur:
`SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`

**Hafalan:**

```text
READ COMMITTED (Default aman cepat) | SERIALIZABLE (Isolasi terketat dengan jaminan zero anomaly)
```

---

<a id="bagian-21"></a>

## 21. 🔴 Pencegahan Race Condition dengan Row-Level Locking (`SELECT ... FOR UPDATE`)

#### Konsep

Ketika dua pengguna mencoba membeli 1 barang stok terakhir pada detik yang sama (*Double-Spending / Race Condition*):
Keduanya membaca stok = 1 $\rightarrow$ keduanya mengizinkan pembelian $\rightarrow$ Stok menjadi -1 ❌.

**Solusi: Pessimistic Row Locking (`SELECT ... FOR UPDATE`)**:
- Baris data yang di-select **langsung dikunci (*Pessimistic Lock*)**.
- Transaksi lain yang mencoba membaca baris yang sama dengan `FOR UPDATE` **wajib menunggu hingga transaksi pertama selesai (`COMMIT` / `ROLLBACK`)**.

#### Contoh

```sql
BEGIN;

-- 1. Kunci Baris Produk Khusus
SELECT stock 
FROM inventory 
WHERE product_id = 'prod-99' 
FOR UPDATE;

-- 2. Validasi & Kurangi Stok
UPDATE inventory 
SET stock = stock - 1 
WHERE product_id = 'prod-99' AND stock >= 1;

COMMIT;
```

**Hafalan:**

```text
SELECT * FROM tbl WHERE id = 1 FOR UPDATE; → mengunci baris data untuk mencegah race condition transaksi konkuren
```

---

<a id="bagian-22"></a>

## 22. 🔴 Deadlock Detection & Strategi Mitigasi

#### Konsep

**Deadlock**:
Kondisi di mana Transaksi A mengunci Baris 1 dan menunggu Baris 2, sementara Transaksi B mengunci Baris 2 dan menunggu Baris 1 $\rightarrow$ Keduanya macet selamanya.

PostgreSQL memiliki **Deadlock Detector otomatis** yang akan mematikan salah satu transaksi setelah parameter `deadlock_timeout` (default 1 detik) terlampaui.

Aturan Pencegahan Deadlock:
- **Selalu kunci baris dengan urutan ID yang sama di seluruh kode aplikasi** (misal: urutkan ID ascending sebelum melakukan `FOR UPDATE`).

**Hafalan:**

```text
Pencegahan Deadlock → selalu lakukan locking atau update baris dengan urutan ID yang konsisten dan terurut
```

---

<a id="bagian-23"></a>

## 23. 🛠️ Peta Ingatan Cepat

```text
                 PETA ARSITEKTUR POSTGRESQL LANJUTAN
                                  │
       ┌──────────────────────────┼──────────────────────────┐
       ▼                          ▼                          ▼
PERFORMANCE & INDEXING        JSONB & UPSERT QUERIES     ANALYTICS & CONCURRENCY
├─ EXPLAIN (ANALYZE, BUFFERS) ├─ JSONB (->, ->>, @>, ?)  ├─ Window Functions (OVER)
├─ B-Tree & GIN Indexes       ├─ jsonb_set & merge (||)  ├─ ROW_NUMBER & LEAD/LAG
├─ Partial & Expression Index ├─ ON CONFLICT DO UPDATE   ├─ ACID & SAVEPOINT
└─ pg_trgm (Fuzzy / ILIKE)    └─ MERGE INTO & CTE WITH   └─ SELECT ... FOR UPDATE
```

---

<a id="bagian-24"></a>

## 24. 📚 Tabel Ringkasan

| Fitur / Perintah | Kategori | Fungsi & Karakteristik Utama |
|---|---|---|
| `EXPLAIN ANALYZE` | Diagnostik | Menampilkan rencana eksekusi dan waktu nyata milidetik |
| `GIN Index` | Indexing | Indeks terbalik untuk Array, dokumen JSONB, dan Trigram |
| `pg_trgm` | Ekstensi | Pencarian kemiripan teks (fuzzy search) dan akselerator `LIKE` |
| `Partial Index` | Indexing | Indeks yang difilter kondisi `WHERE` untuk menghemat disk |
| `JSONB` | Tipe Data | Format JSON biner yang cepat diproses dan mendukung indeks |
| `ON CONFLICT` | DML / Upsert | Menangani benturan unique key saat insert secara idempotent |
| `MERGE INTO` | DML / Upsert | Sinkronisasi data antar-tabel standar ANSI SQL (Postgres 15+) |
| `WITH RECURSIVE` | Query | Query perulangan untuk membaca hierarki pohon bersarang |
| `ROW_NUMBER()` | Window Func | Memberikan nomor urut unik pada partisi data |
| `LEAD()` / `LAG()` | Window Func | Membaca nilai baris sebelum / sesudah baris aktif |
| `SELECT ... FOR UPDATE`| Concurrency | Mengunci baris data untuk mencegah race condition |

---

<a id="bagian-25"></a>

## 25. ⚡ Cheat Code PostgreSQL Lanjutan 10 Detik

```sql
-- 1. Template Trigram Fuzzy Search Index
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_trgm ON products USING GIN (name gin_trgm_ops);

-- 2. Template Upsert Idempotent
INSERT INTO counters (key, count) VALUES ('views', 1)
ON CONFLICT (key) DO UPDATE SET count = counters.count + 1;

-- 3. Template Window Ranking & Pessimistic Locking
SELECT id, name, DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) FROM staff;
SELECT stock FROM items WHERE id = 'item-1' FOR UPDATE;
```

---

<a id="bagian-26"></a>

## 26. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Kuasai Profiling & Indexing Modern
├── Analisis bottleneck via EXPLAIN (ANALYZE, BUFFERS)
├── Terapkan B-Tree composite, GIN, dan Partial index
└── Pasang pg_trgm untuk akselerasi LIKE dan fuzzy search
       │
       ▼
Langkah 2: Kelola Data Kompleks & Upsert Idempotent
├── Manipulasi dokumen JSONB (@>, jsonb_set, -)
├── Terapkan ON CONFLICT DO UPDATE dan MERGE statement
└── Bangun query hierarki via WITH RECURSIVE
       │
       ▼
Langkah 3: Bangun Analitik Kuat dengan Window Functions
├── Terapkan ROW_NUMBER, RANK, DENSE_RANK
└── Hitung pertumbuhan via LAG / LEAD dan running totals
       │
       ▼
Langkah 4: Amankan Konkurensi Tingkat Tinggi
├── Pahami Isolation Levels & SAVEPOINT
└── Kunci baris kritis transaksi finansial via SELECT FOR UPDATE
       │
       ▼
Langkah 5: Siap Melangkah ke PostgreSQL Fungsi, Triggers & Administrasi!
```

---

<a id="bagian-27"></a>

## 27. 🏗️ Mini Project: Production-Ready Financial Analytics & High-Concurrency Inventory System

Skema database PostgreSQL enterprise lengkap, modern, dan runnable yang mengintegrasikan: **Ekstensi `pg_trgm` Fuzzy Search, Kolom JSONB Terindeks GIN, Advanced Upsert `ON CONFLICT`, Window Functions Analitik Finansial, dan Transaksi Concurrency-Safe dengan `SELECT ... FOR UPDATE`**.

```sql
-- =========================================================================
-- 1. SETUP EKSTENSI & TABEL
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    price NUMERIC(15, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    attributes JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    total_amount NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================
-- 2. INDEXING STRATEGIS (GIN JSONB, TRIGRAM, COMPOSITE)
-- =========================================================================

CREATE INDEX idx_products_attributes_gin ON products USING GIN (attributes);
CREATE INDEX idx_products_name_trgm ON products USING GIN (name gin_trgm_ops);
CREATE INDEX idx_orders_customer_date ON orders (customer_id, created_at);

-- =========================================================================
-- 3. SEED DATA MENGGUNAKAN IDEMPOTENT UPSERT (ON CONFLICT)
-- =========================================================================

INSERT INTO products (name, sku, price, stock, attributes) VALUES
('Laptop Gaming ASUS ROG Zephyrus', 'SKU-ROG-01', 25000000, 10, '{"ram_gb": 32, "brand": "ASUS", "gpu": "RTX 4080"}'::jsonb),
('Mechanical Keyboard Keychron K2', 'SKU-KEY-02', 1500000, 25, '{"switch": "Gateron Brown", "wireless": true}'::jsonb),
('Wireless Mouse Logitech MX Master 3S', 'SKU-LOG-03', 1800000, 15, '{"dpi": 8000, "brand": "Logitech"}'::jsonb)
ON CONFLICT (sku) 
DO UPDATE SET 
    price = EXCLUDED.price,
    stock = EXCLUDED.stock,
    attributes = EXCLUDED.attributes;

-- Seed Orders Transaksi
INSERT INTO orders (customer_id, product_id, quantity, total_amount, created_at) VALUES
(101, 1, 1, 25000000, '2026-01-10 10:00:00+07'),
(101, 2, 2, 3000000, '2026-01-15 14:30:00+07'),
(102, 3, 1, 1800000, '2026-01-20 09:15:00+07'),
(101, 3, 1, 1800000, '2026-02-05 11:20:00+07'),
(102, 1, 1, 25000000, '2026-02-12 16:45:00+07');

-- =========================================================================
-- 4. CONCURRENCY-SAFE INVENTORY TRANSACTION (SELECT FOR UPDATE)
-- =========================================================================

BEGIN;

-- Kunci baris produk agar tidak terjadi double-spending / race condition
SELECT id, name, stock, price 
FROM products 
WHERE id = 1 
FOR UPDATE;

-- Simulasikan validasi dan update stok
UPDATE products 
SET stock = stock - 1 
WHERE id = 1 AND stock >= 1;

-- Catat order
INSERT INTO orders (customer_id, product_id, quantity, total_amount)
VALUES (103, 1, 1, 25000000);

COMMIT;

-- =========================================================================
-- 5. ANALYTICAL QUERY DENGAN WINDOW FUNCTIONS & FUZZY SEARCH
-- =========================================================================

-- [A] Fuzzy Search Produk (Typo 'keycron')
SELECT id, name, price, similarity(name, 'keycron') AS score
FROM products
WHERE name % 'keycron'
ORDER BY name <-> 'keycron';

-- [B] Analisis Finansial: Running Total & Peringkat Belanja per Pelanggan
SELECT 
    o.id AS order_id,
    o.customer_id,
    p.name AS product_name,
    o.total_amount,
    o.created_at::date AS order_date,
    -- Running Total Akumulasi Belanja per Pelanggan
    SUM(o.total_amount) OVER (
        PARTITION BY o.customer_id 
        ORDER BY o.created_at
    ) AS customer_cumulative_spend,
    -- Peringkat Transaksi Terbesar per Pelanggan
    DENSE_RANK() OVER (
        PARTITION BY o.customer_id 
        ORDER BY o.total_amount DESC
    ) AS spend_rank
FROM orders o
JOIN products p ON p.id = o.product_id
ORDER BY o.customer_id, o.created_at;
```

#### Hasil Output Eksekusi Terminal

```text
-- Hasil Fuzzy Search:
 id |              name               |   price    | score 
----+---------------------------------+------------+-------
  2 | Mechanical Keyboard Keychron K2 | 1500000.00 |  0.42

-- Hasil Analisis Finansial:
 order_id | customer_id |              product_name            | total_amount | order_date | customer_cumulative_spend | spend_rank 
----------+-------------+--------------------------------------+--------------+------------+---------------------------+------------
        1 |         101 | Laptop Gaming ASUS ROG Zephyrus      |  25000000.00 | 2026-01-10 |               25000000.00 |          1
        2 |         101 | Mechanical Keyboard Keychron K2      |   3000000.00 | 2026-01-15 |               28000000.00 |          2
        4 |         101 | Wireless Mouse Logitech MX Master 3S |   1800000.00 | 2026-02-05 |               29800000.00 |          3
        3 |         102 | Wireless Mouse Logitech MX Master 3S |   1800000.00 | 2026-01-20 |                1800000.00 |          2
        5 |         102 | Laptop Gaming ASUS ROG Zephyrus      |  25000000.00 | 2026-02-12 |               26800000.00 |          1
```

---

<a id="bagian-28"></a>

## 28. 🔗 Referensi Resmi

- [PostgreSQL Official Documentation: Indexes](https://www.postgresql.org/docs/current/indexes.html)
- [PostgreSQL Documentation: pg_trgm Extension](https://www.postgresql.org/docs/current/pgtrgm.html)
- [PostgreSQL Documentation: JSON Functions and Operators](https://www.postgresql.org/docs/current/functions-json.html)
- [PostgreSQL Documentation: MERGE Statement](https://www.postgresql.org/docs/current/sql-merge.html)
- [PostgreSQL Documentation: Window Functions Tutorial](https://www.postgresql.org/docs/current/tutorial-window.html)
