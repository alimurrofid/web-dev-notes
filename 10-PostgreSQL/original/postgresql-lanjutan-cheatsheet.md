# PostgreSQL Lanjutan Cheatsheet — Mudah Dipahami & Diingat

> **Target:** PostgreSQL 16+ untuk pemula yang ingin memahami Indexing (B-Tree, GIN), EXPLAIN ANALYZE, Tipe Data JSONB, Common Table Expressions (CTE & Recursive CTE), Window Functions (ROW_NUMBER, LEAD/LAG), dan Transaksi ACID dengan Row Locking (SELECT FOR UPDATE). Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> PostgreSQL menyediakan kemampuan indexing canggih, manipulasi dokumen JSONB tanpa schema, analisis data tanpa group reduction via Window Functions, dan kontrol konkurensi tingkat tinggi.

## Daftar Isi

1. [EXPLAIN ANALYZE](#1-explain-analyze)
2. [B-Tree & GIN Index](#2-b-tree--gin-index)
3. [Tipe Data JSONB & Operator](#3-tipe-data-jsonb--operator)
4. [Common Table Expressions (CTE)](#4-common-table-expressions-cte)
5. [Recursive CTE](#5-recursive-cte)
6. [Window Functions (OVER & PARTITION BY)](#6-window-functions-over--partition-by)
7. [ROW_NUMBER, RANK & DENSE_RANK](#7-row_number-rank--dense_rank)
8. [LEAD dan LAG](#8-lead-dan-lag)
9. [Transaksi ACID & SAVEPOINT](#9-transaksi-acid--savepoint)
10. [Row-Level Locking (SELECT FOR UPDATE)](#10-row-level-locking-select-for-update)

---

# 1. EXPLAIN ANALYZE

Melihat rencana eksekusi dan waktu sebenarnya yang dibutuhkan database.

```sql
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM users WHERE email = 'budi@mail.com';
```

---

# 2. B-Tree & GIN Index

- **B-Tree (Default):** Cocok untuk perbandingan `=`, `<`, `>`, `BETWEEN`.
- **GIN Index:** Wajib untuk pencarian di dalam Array dan JSONB (`@>`).

```sql
-- B-Tree Index
CREATE INDEX idx_users_email ON users (email);

-- GIN Index untuk JSONB
CREATE INDEX idx_products_specs ON products USING GIN (specs);
```

---

# 3. Tipe Data JSONB & Operator

- `->` : Mengambil field sebagai JSON.
- `->>` : Mengambil field sebagai Teks.
- `@>` : Memeriksa apakah JSON kiri mengandung JSON kanan.

```sql
SELECT 
    name, 
    specs->>'ram' AS ram_size
FROM products 
WHERE specs @> '{"brand": "ASUS"}';
```

---

# 4. Common Table Expressions (CTE)

Query sementara yang didefinisikan dengan klausa `WITH`.

```sql
WITH high_value_orders AS (
    SELECT customer_id, SUM(total_amount) AS total
    FROM orders
    GROUP BY customer_id
)
SELECT * FROM high_value_orders WHERE total > 10000000;
```

---

# 5. Recursive CTE

Query untuk struktur pohon bertingkat (misal: kategori bersarang).

```sql
WITH RECURSIVE category_tree AS (
    SELECT id, name, parent_id, 1 AS level
    FROM categories WHERE parent_id IS NULL
    UNION ALL
    SELECT c.id, c.name, c.parent_id, ct.level + 1
    FROM categories c
    JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree;
```

---

# 6. Window Functions (OVER & PARTITION BY)

Melakukan kalkulasi agregat tanpa mereduksi baris data.

```sql
SELECT 
    name, 
    department, 
    salary,
    AVG(salary) OVER (PARTITION BY department) AS avg_dept_salary
FROM employees;
```

---

# 7. ROW_NUMBER, RANK & DENSE_RANK

Memberikan nomor peringkat pada baris data.

```sql
SELECT 
    name, 
    score,
    ROW_NUMBER() OVER (ORDER BY score DESC) AS row_num,
    RANK() OVER (ORDER BY score DESC) AS rank_pos,
    DENSE_RANK() OVER (ORDER BY score DESC) AS dense_rank_pos
FROM students;
```

---

# 8. LEAD dan LAG

Mengakses data baris berikutnya (`LEAD`) atau baris sebelumnya (`LAG`).

```sql
SELECT 
    month, 
    revenue,
    LAG(revenue, 1) OVER (ORDER BY month) AS prev_month_rev
FROM monthly_sales;
```

---

# 9. Transaksi ACID & SAVEPOINT

```sql
BEGIN;
UPDATE accounts SET balance = balance - 1000 WHERE id = 1;
SAVEPOINT transfer_point;
UPDATE accounts SET balance = balance + 1000 WHERE id = 2;
-- Jika gagal: ROLLBACK TO transfer_point;
COMMIT;
```

---

# 10. Row-Level Locking (SELECT FOR UPDATE)

Mengunci baris data agar tidak diubah oleh transaksi lain secara bersamaan (mencegah *Race Condition* stok / saldo).

```sql
BEGIN;
SELECT stock FROM inventory WHERE product_id = 101 FOR UPDATE;
UPDATE inventory SET stock = stock - 1 WHERE product_id = 101;
COMMIT;
```
