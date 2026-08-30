# PostgreSQL Dasar Cheatsheet — Mudah Dipahami & Diingat

> **Target:** PostgreSQL 16+ untuk pemula yang ingin memahami Database Relasional, DDL, DML, Tipe Data Modern (UUID, ENUM, TIMESTAMPTZ), Constraints, RETURNING, UPSERT (ON CONFLICT), Agregasi, dan Relasi JOIN. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> PostgreSQL adalah sistem manajemen basis data relasional objek (ORDBMS) sumber terbuka yang terkenal dengan keandalan konkurensi MVCC, kepatuhan standar SQL murni, dan fitur tipe data modern yang sangat kaya.

## Daftar Isi

1. [Perintah Meta psql](#1-perintah-meta-psql)
2. [Tipe Data Utama](#2-tipe-data-utama)
3. [DDL: CREATE TABLE & Constraints](#3-ddl-create-table--constraints)
4. [DML: INSERT & RETURNING](#4-dml-insert--returning)
5. [UPSERT: ON CONFLICT](#5-upsert-on-conflict)
6. [DML: UPDATE & DELETE](#6-dml-update--delete)
7. [Pencarian Teks ILIKE](#7-pencarian-teks-ilike)
8. [Agregasi & GROUP BY / HAVING](#8-agregasi--group-by--having)
9. [Relasi Foreign Key](#9-relasi-foreign-key)
10. [JOINs Tabel](#10-joins-tabel)

---

# 1. Perintah Meta psql

- `\l` : Melihat daftar seluruh database.
- `\c nama_db` : Masuk/koneksi ke database tertentu.
- `\dt` : Melihat daftar tabel di skema saat ini.
- `\d+ nama_tabel` : Menampilkan deskripsi struktur kolom tabel.
- `\q` : Keluar dari terminal `psql`.

---

# 2. Tipe Data Utama

- `UUID` : Identifier unik 128-bit (`DEFAULT gen_random_uuid()`).
- `VARCHAR(n)` / `TEXT` : String dengan batas panjang vs teks tak terbatas.
- `INTEGER` / `BIGINT` : Bilangan bulat 4-byte vs 8-byte.
- `NUMERIC(10, 2)` : Angka desimal presisi tinggi untuk uang/finansial.
- `TIMESTAMPTZ` : Waktu dan tanggal lengkap beserta zona waktu (*UTC*).
- `BOOLEAN` : `TRUE` atau `FALSE`.

---

# 3. DDL: CREATE TABLE & Constraints

```sql
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'ADMIN');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role user_role DEFAULT 'CUSTOMER',
    age INT CHECK (age >= 17),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

---

# 4. DML: INSERT & RETURNING

Menyimpan data dan langsung mengembalikan hasil baris baru via `RETURNING`.

```sql
INSERT INTO users (name, email, age)
VALUES ('Budi Santoso', 'budi@mail.com', 25)
RETURNING id, name, created_at;
```

---

# 5. UPSERT: ON CONFLICT

Menangani duplikasi data (Insert jika belum ada, Update jika sudah ada).

```sql
INSERT INTO users (name, email, age)
VALUES ('Budi Update', 'budi@mail.com', 26)
ON CONFLICT (email) 
DO UPDATE SET 
    name = EXCLUDED.name,
    age = EXCLUDED.age;
```

---

# 6. DML: UPDATE & DELETE

```sql
-- Update data
UPDATE users 
SET name = 'Budi Nugroho' 
WHERE email = 'budi@mail.com'
RETURNING *;

-- Delete data
DELETE FROM users 
WHERE email = 'budi@mail.com'
RETURNING id;
```

---

# 7. Pencarian Teks ILIKE

Pencarian string tanpa membedakan huruf besar dan kecil (*Case-Insensitive*).

```sql
SELECT * FROM users 
WHERE name ILIKE '%budi%';
```

---

# 8. Agregasi & GROUP BY / HAVING

```sql
SELECT role, COUNT(*) AS total_user, AVG(age) AS rata_usia
FROM users
GROUP BY role
HAVING COUNT(*) > 1;
```

---

# 9. Relasi Foreign Key

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount > 0),
    order_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

---

# 10. JOINs Tabel

```sql
SELECT u.name, u.email, o.id AS order_id, o.total_amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
```
