---
title: "PostgreSQL Fungsi & Administrasi"
description: "Administrasi & fitur tingkat lanjut PostgreSQL: Stored Procedures & Functions, Triggers, Views, Indexing (B-Tree, GIN), EXPLAIN ANALYZE, Transactions (ACID), dan Backup."
order: 3
tags:
  - database
  - postgresql
  - administration
  - performance
---

# PostgreSQL Fungsi & Administrasi

> **Target:** Pemula yang telah menguasai SQL dasar dan PostgreSQL Lanjutan, serta ingin menguasai **Database Programmability di level engine (Views, Materialized Views `REFRESH CONCURRENTLY`, Bahasa Prosedural PL/pgSQL, Stored Functions & Stored Procedures `CALL`), Otomatisasi Event via Database Triggers (`NEW`, `OLD`, Audit Logging), Real-Time Pub/Sub (`LISTEN`/`NOTIFY`), Full-Text Search (`tsvector`, `tsquery`, GIN ranking), Foreign Data Wrapper (`postgres_fdw`), Query Profiling (`pg_stat_statements`), Connection Pooling (`PgBouncer`), Row Level Security (RLS Policies multi-tenancy), serta Administrasi Database (Maintenance `VACUUM ANALYZE`, Pemantauan `pg_stat_activity`, dan Backup/Restore `pg_dump`/`pg_restore`)** menggunakan **PostgreSQL 16+**.
>
> Fokus cheatsheet ini: **mental model Database Programmability → Virtual Views vs Materialized Views → PL/pgSQL Syntax & Blok Anonim (`DO $$`) → Stored Functions (`RETURNS TABLE`) → Kontrol Alur Logika & Error Handling (`RAISE EXCEPTION`) → Stored Procedures (`CALL`) → Event-Driven Triggers (`BEFORE`/`AFTER`) → Audit Logging Otomatis → Real-Time Pub/Sub (`LISTEN`/`NOTIFY`) → Full-Text Search & GIN ranking → Foreign Data Wrapper (`postgres_fdw`) → Query Profiling (`pg_stat_statements`) → Connection Pooling (`PgBouncer`) → User Roles & Privileges → Row Level Security (RLS) untuk Multi-Tenant → Database Maintenance (`VACUUM`, `ANALYZE`, `pg_stat_activity`) → Backup & Disaster Recovery (`pg_dump`, `pg_restore`) → mini project Multi-Tenant Enterprise E-Commerce Suite**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: Views, Materialized Views (Caching), Blok PL/pgSQL, dan Menulis Stored Functions (RETURNS TABLE)

🟡 Lanjutan
→ pelajari setelah PL/pgSQL lancar: Kontrol Alur, RAISE EXCEPTION, Stored Procedures, Database Triggers, Real-Time Pub/Sub, dan Full-Text Search

🔴 Advanced / Operasional
→ penting untuk arsitektur production: Foreign Data Wrapper (FDW), pg_stat_statements, PgBouncer, Roles, RLS Multi-Tenant, dan VACUUM Maintenance
```

Mental model alur eksekusi Event Trigger & PL/pgSQL Function di PostgreSQL Engine:

```text
                 1. OPERASI DML DITERIMA (INSERT / UPDATE / DELETE)
                               │
                               ▼
                 2. BEFORE TRIGGER DIEKSEKUSI
           (Validasi data / Modifikasi nilai NEW.col)
                               │
                               ▼
                 3. PENULISAN BARIS DATA KE STORAGE ENGINE
                               │
                               ▼
                 4. AFTER TRIGGER & REAL-TIME NOTIFY
       (Catat ke Audit Log / Kirim NOTIFY ke WebSocket Backend)
                               │
                               ▼
                 5. COMMIT TRANSAKSI & RESUMSI HASIL
```

**Hafalan:**

```text
View                      → tabel virtual berbasis query SQL tersimpan yang dieksekusi ulang secara dinamis setiap kali dipanggil
Materialized View         → hasil query kompleks yang disimpan secara fisik di disk untuk performa pembacaan instan
PL/pgSQL                  → bahasa pemrograman prosedural resmi bawaan PostgreSQL untuk menulis logika bisnis di server database
Stored Function           → fungsi PL/pgSQL yang mengembalikan nilai (skalar atau tabel) dan dapat dipanggil di dalam query SELECT
Stored Procedure          → prosedur PL/pgSQL yang dieksekusi via perintah CALL dan dapat mengontrol transaksi COMMIT/ROLLBACK mandiri
Trigger                   → fungsi otomatis yang dipicu oleh event DML (INSERT, UPDATE, DELETE) pada tabel tertentu
NEW & OLD                 → variabel record bawaan trigger penampung nilai data baru (NEW) dan data lama sebelum diubah (OLD)
LISTEN & NOTIFY           → fitur message broker pub/sub native PostgreSQL untuk streaming event real-time ke aplikasi backend
Foreign Data Wrapper (FDW)→ fitur SQL/MED resmi untuk melakukan query federated dan JOIN antar server database PostgreSQL yang berbeda
pg_stat_statements        → ekstensi resmi untuk melacak dan mendiagnosa daftar query paling lambat dan membebani server (Slow Queries)
PgBouncer                 → lightweight connection pooler standar industri untuk menangani ribuan koneksi aplikasi konkuren
Row Level Security (RLS)  → mekanisme keamanan tingkat baris di mana pengguna hanya diizinkan melihat data miliknya sendiri (Multi-Tenancy)
VACUUM                    → proses pembersihan dead tuples (sampah baris usang akibat MVCC) dan optimasi ruang penyimpanan tabel
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Database Programmability & Administrasi PostgreSQL 16](#bagian-1)
2. [Database Views: Virtual Tables untuk Keamanan & Abstraksi Query](#bagian-2)
3. [Materialized Views: Caching Query Berat di Disk](#bagian-3)
4. [Pengenalan Bahasa Prosedural PL/pgSQL & Blok Anonim](#bagian-4)
5. [Menulis Stored Functions dengan PL/pgSQL](#bagian-5)
6. [Parameter Fungsi & Nilai Kembalian Tabel](#bagian-6)

### 🟡 Lanjutan

7. [Kontrol Alur Logika di PL/pgSQL](#bagian-7)
8. [Penanganan Error & Eksepsi di PL/pgSQL](#bagian-8)
9. [Stored Procedures: Menjalankan Transaksi di Database](#bagian-9)
10. [Pengenalan Database Triggers & Mental Model Event-Driven](#bagian-10)
11. [Menulis Trigger Function](#bagian-11)
12. [Mendefinisikan Database Trigger](#bagian-12)
13. [Studi Kasus Trigger: Audit Logging Otomatis](#bagian-13)
14. [Real-Time Pub/Sub Native: `LISTEN` & `NOTIFY`](#bagian-14)
15. [Full-Text Search Modern di PostgreSQL](#bagian-15)
16. [Optimasi Full-Text Search dengan GIN Index & Ranking](#bagian-16)

### 🔴 Advanced / Operasional

17. [Foreign Data Wrapper (FDW) & Federated Queries via `postgres_fdw`](#bagian-17)
18. [Query Performance Profiling dengan Ekstensi `pg_stat_statements`](#bagian-18)
19. [Connection Pooling di Lingkungan Produksi dengan `PgBouncer`](#bagian-19)
20. [Manajemen User, Roles & Hak Akses](#bagian-20)
21. [Row Level Security (RLS) untuk Multi-Tenancy & Data Isolation](#bagian-21)
22. [Database Maintenance & Garbage Collection](#bagian-22)
23. [Strategi Backup & Disaster Recovery](#bagian-23)
24. [Replikasi & High Availability Dasar](#bagian-24)

### 🛠️ Referensi & Praktik

25. [Peta Ingatan Cepat](#bagian-25)
26. [Tabel Ringkasan](#bagian-26)
27. [Cheat Code PostgreSQL Fungsi & Administrasi 10 Detik](#bagian-27)
28. [Urutan Belajar yang Disarankan](#bagian-28)
29. [Mini Project: Production-Ready Enterprise Multi-Tenant E-Commerce System with Audit Triggers, Real-Time NOTIFY, Materialized Analytics, PL/pgSQL Stored Procedure, and Row Level Security (RLS)](#bagian-29)
30. [Referensi Resmi](#bagian-30)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan Database Programmability & Administrasi PostgreSQL 16

#### Konsep

PostgreSQL bukan hanya tempat pasif menyimpan data, melainkan **Platform Komputasi Terdistribusi yang Kuat**:
1. **Programmability:** Menjalankan logika bisnis kompleks langsung di dalam mesin database via **PL/pgSQL Functions, Stored Procedures, dan Triggers** (mengurangi round-trip jaringan aplikasi hingga 90%).
2. **Administration & Security:** Manajemen hak akses berbasis **Roles**, isolasi data multi-tenant via **Row Level Security (RLS)**, pemeliharaan storage via **`VACUUM`**, dan federated database queries via **FDW**.

**Hafalan:**

```text
Database Programmability → memindahkan eksekusi logika bisnis berat langsung ke database server untuk efisiensi maksimal
```

---

<a id="bagian-2"></a>

## 2. 🟢 Database Views: Virtual Tables untuk Keamanan & Abstraksi Query

#### Konsep

**View (`CREATE VIEW`)**:
- Tabel virtual yang tidak menyimpan data fisik di disk.
- Menyimpan query `SELECT` yang rumit (banyak `JOIN`) menjadi satu nama tabel sederhana.
- **Keamanan:** Membatasi kolom sensitif (seperti `password_hash` atau `gaji`) agar tidak terlihat oleh user laporan.

#### Contoh

```sql
CREATE OR REPLACE VIEW view_active_customers AS
SELECT 
    id, 
    name, 
    email, 
    created_at 
FROM users 
WHERE is_active = true AND deleted_at IS NULL;

-- Penggunaan:
SELECT * FROM view_active_customers WHERE created_at >= '2026-01-01';
```

**Hafalan:**

```text
CREATE VIEW view_name AS SELECT ...; → tabel virtual penyederhana query dan pembatas akses kolom sensitif
```

---

<a id="bagian-3"></a>

## 3. 🟢 Materialized Views: Caching Query Berat di Disk

#### Konsep

**Materialized View (`CREATE MATERIALIZED VIEW`)**:
- Berbeda dengan View biasa, Materialized View **menyimpan hasil query secara fisik ke disk (*Precomputed Cache*)**.
- Query laporan berat berdurasi 10 detik dapat disajikan seketika dalam **1 milidetik**.
- **Pembaruan Data:** Menggunakan `REFRESH MATERIALIZED VIEW CONCURRENTLY view_name;` (tanpa mengunci akses pembacaan).

#### Contoh

```sql
-- 1. Buat Materialized View Agregasi Laporan Penjualan Bulanan
CREATE MATERIALIZED VIEW mv_monthly_sales_summary AS
SELECT 
    DATE_TRUNC('month', created_at) AS order_month,
    COUNT(id) AS total_orders,
    SUM(total_amount) AS total_revenue
FROM orders
WHERE status = 'PAID'
GROUP BY DATE_TRUNC('month', created_at);

-- 2. Buat Unique Index (Wajib untuk REFRESH CONCURRENTLY)
CREATE UNIQUE INDEX idx_mv_monthly_sales_month ON mv_monthly_sales_summary (order_month);

-- 3. Refresh Data Tanpa Lock (Zero Downtime)
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_monthly_sales_summary;
```

**Hafalan:**

```text
CREATE MATERIALIZED VIEW mv AS ...; REFRESH MATERIALIZED VIEW CONCURRENTLY mv; → cache hasil query berat di disk
```

---

<a id="bagian-4"></a>

## 4. 🟢 Pengenalan Bahasa Prosedural PL/pgSQL & Blok Anonim

#### Konsep

**PL/pgSQL (Procedural Language / PostgreSQL)** menambahkan fitur pemrograman (variabel, percabangan `IF`, perulangan `LOOP`, dan exception handling) ke dalam SQL standar.

**Blok Anonim (`DO $$ ... $$`)**:
Menjalankan script PL/pgSQL sekali pakai tanpa perlu membuat fungsi permanen di database.

#### Contoh

```sql
DO $$
DECLARE
    v_total_users INT;
    v_target_bonus NUMERIC := 500000;
BEGIN
    SELECT COUNT(*) INTO v_total_users FROM users WHERE is_active = true;
    RAISE NOTICE 'Jumlah user aktif: %, Bonus total: Rp %', v_total_users, (v_total_users * v_target_bonus);
END $$;
```

**Hafalan:**

```text
DO $$ DECLARE ... BEGIN ... END $$; → mengeksekusi blok kode PL/pgSQL sekali pakai di PostgreSQL
```

---

<a id="bagian-5"></a>

## 5. 🟢 Menulis Stored Functions dengan PL/pgSQL

#### Konsep

**Stored Function (`CREATE FUNCTION`)**:
- Fungsi tersimpan di database yang menerima argumen dan **mengembalikan nilai skalar atau record**.
- Dapat dipanggil langsung di dalam query `SELECT`, `WHERE`, atau `HAVING`.

#### Contoh

```sql
CREATE OR REPLACE FUNCTION fn_calculate_discount(
    p_total_price NUMERIC,
    p_is_vip BOOLEAN
) 
RETURNS NUMERIC 
LANGUAGE plpgsql
AS $$
DECLARE
    v_discount NUMERIC := 0;
BEGIN
    IF p_is_vip THEN
        v_discount := p_total_price * 0.15; -- 15% VIP
    ELSIF p_total_price >= 1000000 THEN
        v_discount := p_total_price * 0.05; -- 5% Regular Promo
    END IF;

    RETURN v_discount;
END;
$$;

-- Pemanggilan:
SELECT fn_calculate_discount(1500000, true) AS nominal_diskon;
```

**Hafalan:**

```text
CREATE FUNCTION fn_name(params) RETURNS type LANGUAGE plpgsql AS $$ ... $$; → membuat fungsi database kustom
```

---

<a id="bagian-6"></a>

## 6. 🟢 Parameter Fungsi & Nilai Kembalian Tabel

#### Konsep

Fungsi PL/pgSQL dapat mengembalikan kumpulan baris data layaknya tabel menggunakan klausa **`RETURNS TABLE (kolom1 tipe, kolom2 tipe)`** dan keyword **`RETURN QUERY`**.

#### Contoh

```sql
CREATE OR REPLACE FUNCTION fn_get_top_products(p_limit INT)
RETURNS TABLE (
    product_id INT,
    product_name VARCHAR,
    total_sales NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        COALESCE(SUM(o.total_amount), 0) AS total_sales
    FROM products p
    LEFT JOIN orders o ON o.product_id = p.id
    GROUP BY p.id, p.name
    ORDER BY total_sales DESC
    LIMIT p_limit;
END;
$$;

-- Pemanggilan Layaknya Tabel Biasa:
SELECT * FROM fn_get_top_products(5);
```

**Hafalan:**

```text
RETURNS TABLE (col type) ... RETURN QUERY SELECT ...; → fungsi database yang mengembalikan dataset tabel
```

---

<a id="bagian-7"></a>

## 7. 🟡 Kontrol Alur Logika di PL/pgSQL

#### Konsep

PL/pgSQL mendukung struktur kendali lengkap:
1. **Percabangan:** `IF condition THEN ... ELSIF ... ELSE ... END IF;`
2. **Perulangan Cursor / Record:** `FOR record_var IN query LOOP ... END LOOP;`
3. **Perulangan Numerik:** `FOR i IN 1..10 LOOP ... END LOOP;`

#### Contoh

```sql
CREATE OR REPLACE FUNCTION fn_recalculate_points()
RETURNS VOID 
LANGUAGE plpgsql
AS $$
DECLARE
    v_customer RECORD;
    v_points INT;
BEGIN
    -- Loop seluruh customer yang memiliki transaksi
    FOR v_customer IN (SELECT customer_id, SUM(total_amount) AS total FROM orders GROUP BY customer_id) LOOP
        v_points := FLOOR(v_customer.total / 100000); -- 1 poin per 100rb
        
        UPDATE customers 
        SET reward_points = v_points 
        WHERE id = v_customer.customer_id;
    END LOOP;
END;
$$;
```

**Hafalan:**

```text
FOR record_var IN (SELECT ...) LOOP ... END LOOP; → iterasi baris hasil query di PL/pgSQL
```

---

<a id="bagian-8"></a>

## 8. 🟡 Penanganan Error & Eksepsi di PL/pgSQL

#### Konsep

1. **`RAISE EXCEPTION 'Pesan Error';`** : Melempar error dan otomatis membatalkan (*Rollback*) transaksi.
2. **Blok `BEGIN ... EXCEPTION WHEN ... THEN ... END;`** : Menangkap error agar proses tetap berjalan.

#### Contoh

```sql
CREATE OR REPLACE FUNCTION fn_transfer_balance(
    p_sender_id INT,
    p_receiver_id INT,
    p_amount NUMERIC
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_sender_balance NUMERIC;
BEGIN
    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'Nominal transfer harus lebih besar dari 0!';
    END IF;

    SELECT balance INTO v_sender_balance FROM wallets WHERE user_id = p_sender_id FOR UPDATE;

    IF v_sender_balance < p_amount THEN
        RAISE EXCEPTION 'Saldo tidak mencukupi! Saldo saat ini: %', v_sender_balance;
    END IF;

    UPDATE wallets SET balance = balance - p_amount WHERE user_id = p_sender_id;
    UPDATE wallets SET balance = balance + p_amount WHERE user_id = p_receiver_id;

    RETURN true;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Gagal memproses transfer: %', SQLERRM;
        RETURN false;
END;
$$;
```

**Hafalan:**

```text
RAISE EXCEPTION 'pesan' → melempar error dan rollback | EXCEPTION WHEN OTHERS THEN → menangkap error
```

---

<a id="bagian-9"></a>

## 9. 🟡 Stored Procedures: Menjalankan Transaksi di Database

#### Konsep

Perbedaan Utama Function vs Procedure:
- **Function (`CREATE FUNCTION`):** Wajib mengembalikan nilai dan **TIDAK BISA** melakukan `COMMIT` atau `ROLLBACK` di tengah eksekusi.
- **Procedure (`CREATE PROCEDURE` - PG 11+):** Dieksekusi via perintah **`CALL`** dan **BISA mengontrol transaksi (`COMMIT` / `ROLLBACK`) mandiri**. Sangat ideal untuk batch processing ribuan data.

#### Contoh

```sql
CREATE OR REPLACE PROCEDURE pr_process_monthly_billing()
LANGUAGE plpgsql
AS $$
DECLARE
    v_cust RECORD;
BEGIN
    FOR v_cust IN (SELECT id, monthly_fee FROM subscriptions WHERE status = 'ACTIVE') LOOP
        -- Potong saldo
        UPDATE wallets SET balance = balance - v_cust.monthly_fee WHERE user_id = v_cust.id;
        
        -- Commit per batch setiap baris selesai diproses!
        COMMIT;
    END LOOP;
END;
$$;

-- Pemanggilan Procedure:
CALL pr_process_monthly_billing();
```

**Hafalan:**

```text
CREATE PROCEDURE pr_name() ... CALL pr_name(); → prosedur database mandiri yang mampu mengontrol COMMIT transaksi
```

---

<a id="bagian-10"></a>

## 10. 🟡 Pengenalan Database Triggers & Mental Model Event-Driven

#### Konsep

**Database Trigger**:
Mekanisme event-driven di mana fungsi database dieksekusi secara otomatis ketika terjadi event DML (**`INSERT`**, **`UPDATE`**, atau **`DELETE`**) pada tabel target.

Dua Dimensi Trigger:
1. **Waktu Eksekusi:**
   - **`BEFORE`** : Berjalan sebelum data ditulis (ideal untuk validasi atau mengubah data `NEW`).
   - **`AFTER`** : Berjalan setelah data tersimpan (ideal untuk audit log atau notifikasi eksternal).
2. **Frekuensi Eksekusi:**
   - **`FOR EACH ROW`** : Dijalankan untuk setiap baris yang terdampak.
   - **`FOR EACH STATEMENT`** : Dijalankan 1 kali per query SQL.

**Hafalan:**

```text
BEFORE Trigger untuk validasi data | AFTER Trigger untuk audit logging dan sinkronisasi data
```

---

<a id="bagian-11"></a>

## 11. 🟡 Menulis Trigger Function

#### Konsep

Trigger Function memiliki format khusus:
- **`RETURNS trigger`**
- Variabel bawaan otomatis:
  - **`NEW`** : Record berisi data baris baru yang akan di-insert/update.
  - **`OLD`** : Record berisi data baris lama sebelum di-update/delete.
  - **`TG_OP`** : Nama operasi (`'INSERT'`, `'UPDATE'`, `'DELETE'`).

#### Contoh

```sql
CREATE OR REPLACE FUNCTION trg_fn_update_timestamp()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
    -- Otomatis perbarui kolom updated_at ke waktu saat ini
    NEW.updated_at = NOW();
    RETURN NEW; -- Wajib me-return NEW pada BEFORE trigger!
END;
$$;
```

**Hafalan:**

```text
RETURNS TRIGGER ... RETURN NEW; → fungsi trigger yang menyematkan nilai modifikasi sebelum data disimpan
```

---

<a id="bagian-12"></a>

## 12. 🟡 Mendefinisikan Database Trigger

#### Konsep

Menghubungkan Trigger Function ke tabel target menggunakan statement **`CREATE TRIGGER`**.

#### Contoh

```sql
CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION trg_fn_update_timestamp();
```

**Hafalan:**

```text
CREATE TRIGGER trg_name BEFORE UPDATE ON tbl FOR EACH ROW EXECUTE FUNCTION fn_name();
```

---

<a id="bagian-13"></a>

## 13. 🟡 Studi Kasus Trigger: Audit Logging Otomatis

#### Konsep

Mencatat seluruh riwayat perubahan harga produk atau mutasi data sensitif ke tabel audit log secara otomatis dan tidak bisa dimanipulasi oleh aplikasi backend.

#### Contoh

```sql
-- [1] Tabel Audit Log
CREATE TABLE product_audit_logs (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    action_type VARCHAR(20) NOT NULL,
    old_price NUMERIC(15,2),
    new_price NUMERIC(15,2),
    changed_by VARCHAR(100) DEFAULT CURRENT_USER,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- [2] Trigger Function Audit
CREATE OR REPLACE FUNCTION trg_fn_audit_product_changes()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        IF (OLD.price <> NEW.price) THEN
            INSERT INTO product_audit_logs (product_id, action_type, old_price, new_price)
            VALUES (NEW.id, 'PRICE_CHANGE', OLD.price, NEW.price);
        END IF;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO product_audit_logs (product_id, action_type, old_price, new_price)
        VALUES (OLD.id, 'PRODUCT_DELETED', OLD.price, NULL);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

-- [3] Pasang Trigger AFTER UPDATE OR DELETE
CREATE TRIGGER trg_audit_products
AFTER UPDATE OR DELETE ON products
FOR EACH ROW
EXECUTE FUNCTION trg_fn_audit_product_changes();
```

**Hafalan:**

```text
Audit Trigger AFTER UPDATE OR DELETE → mencatat riwayat perubahan data sensitif secara otomatis dan tamper-proof
```

---

<a id="bagian-14"></a>

## 14. 🟡 Real-Time Pub/Sub Native: `LISTEN` & `NOTIFY`

#### Konsep

PostgreSQL memiliki sistem **Publish/Subscribe (Pub/Sub) Native** berkecepatan tinggi tanpa perlu menginstal message broker eksternal (seperti Redis/RabbitMQ) untuk kebutuhan notifikasi real-time:
- **`NOTIFY channel_name, 'payload_teks'`** : Mengirimkan pesan/event ke channel tertentu.
- **`LISTEN channel_name;`** : Mendaftarkan koneksi client (Node.js, Go, Python) untuk mendengarkan pesan masuk secara asynchronous via event loop WebSocket.

#### Contoh

```sql
-- [1] Trigger Function yang Mengirim Notifikasi Real-Time saat Order Baru Masuk
CREATE OR REPLACE FUNCTION trg_fn_notify_new_order()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
DECLARE
    v_payload JSONB;
BEGIN
    v_payload := jsonb_build_object(
        'event', 'ORDER_CREATED',
        'order_id', NEW.id,
        'customer_id', NEW.customer_id,
        'total_amount', NEW.total_amount,
        'timestamp', NOW()
    );

    -- Kirim event real-time ke channel 'order_events'
    PERFORM pg_notify('order_events', v_payload::text);
    RETURN NEW;
END;
$$;

-- [2] Pasang Trigger AFTER INSERT
CREATE TRIGGER trg_notify_orders
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION trg_fn_notify_new_order();

-- [3] Di Backend / Terminal Listener:
LISTEN order_events;
```

**Hafalan:**

```text
PERFORM pg_notify('channel', payload::text); | LISTEN channel; → real-time pub/sub messaging native di PostgreSQL
```

---

<a id="bagian-15"></a>

## 15. 🟡 Full-Text Search Modern di PostgreSQL

#### Konsep

Pencarian teks lengkap (*Full-Text Search*) mengubah teks menjadi representasi leksikal yang memahami akar kata (*Stemming*) dan mengabaikan kata hubung (*Stop words*):
1. **`to_tsvector('indonesian', text)`:** Mengubah teks mentah menjadi dokumen vektor kata terindeks.
2. **`to_tsquery('indonesian', 'kata1 & kata2')`:** Mengubah kata kunci pencarian menjadi query boolean (`&` AND, `|` OR, `!` NOT).
3. **Operator `@@`:** Operator pencocokan Full-Text (`vector @@ query`).

#### Contoh

```sql
-- Pencarian Artikel Berisi Kata 'belajar' DAN 'database'
SELECT id, title 
FROM articles 
WHERE to_tsvector('indonesian', title || ' ' || content) @@ to_tsquery('indonesian', 'belajar & database');
```

**Hafalan:**

```text
to_tsvector(text) @@ to_tsquery(query) → operator pencarian full-text search leksikal berbasis stemming
```

---

<a id="bagian-16"></a>

## 16. 🟡 Optimasi Full-Text Search dengan GIN Index & Ranking

#### Konsep

Pencarian Full-Text pada jutaan baris akan lambat jika `to_tsvector` dihitung ulang setiap kali query.

Optimasi Standar:
1. Simpan `tsvector` di dalam kolom **Generated Column (`GENERATED ALWAYS AS ... STORED`)**.
2. Buat **GIN Index** pada kolom `tsvector` tersebut.
3. Gunakan **`ts_rank()`** untuk mengurutkan hasil berdasarkan tingkat relevansi tertinggi.

#### Contoh

```sql
-- 1. Tambah Kolom Generated tsvector
ALTER TABLE articles 
ADD COLUMN search_vector tsvector 
GENERATED ALWAYS AS (to_tsvector('indonesian', title || ' ' || content)) STORED;

-- 2. Buat GIN Index pada search_vector
CREATE INDEX idx_articles_fts_gin ON articles USING GIN (search_vector);

-- 3. Query Super Cepat Terurut Berdasarkan Relevansi Skor (ts_rank)
SELECT 
    id, 
    title, 
    ts_rank(search_vector, to_tsquery('indonesian', 'postgresql | database')) AS relevansi_skor
FROM articles
WHERE search_vector @@ to_tsquery('indonesian', 'postgresql | database')
ORDER BY relevansi_skor DESC
LIMIT 10;
```

**Hafalan:**

```text
ts_rank(vector, query) → menghitung skor relevansi pencarian teks lengkap
```

---

<a id="bagian-17"></a>

## 17. 🔴 Foreign Data Wrapper (FDW) & Federated Queries via `postgres_fdw`

#### Konsep

**Foreign Data Wrapper (FDW - SQL/MED Standard)**:
Fitur resmi PostgreSQL yang memungkinkan database lokal mengakses dan melakukan **`JOIN` langsung dengan tabel di server PostgreSQL lain (Remote Database)** secara transparan layaknya tabel lokal.

Empat Langkah Setup FDW:
1. `CREATE EXTENSION postgres_fdw;`
2. `CREATE SERVER remote_srv FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host '10.0.0.5', port '5432', dbname 'order_db');`
3. `CREATE USER MAPPING FOR local_user SERVER remote_srv OPTIONS (user 'remote_usr', password 'secret');`
4. `IMPORT FOREIGN SCHEMA public FROM SERVER remote_srv INTO remote_orders;`

#### Contoh

```sql
-- [1] Aktifkan Ekstensi FDW
CREATE EXTENSION IF NOT EXISTS postgres_fdw;

-- [2] Daftarkan Server Remote
CREATE SERVER remote_warehouse_server
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host '10.0.1.50', port '5432', dbname 'warehouse_db');

-- [3] Buat Pemetaan User
CREATE USER MAPPING FOR CURRENT_USER
SERVER remote_warehouse_server
OPTIONS (user 'readonly_usr', password 'SecretPass123!');

-- [4] Buat Skema Lokal & Impor Tabel Remote
CREATE SCHEMA IF NOT EXISTS remote_wh;

IMPORT FOREIGN SCHEMA public
LIMIT TO (inventory_stock, supplier_catalog)
FROM SERVER remote_warehouse_server
INTO remote_wh;

-- [5] Eksekusi Query Cross-Database JOIN!
SELECT 
    p.name AS local_product_name,
    rw.stock_quantity AS remote_stock
FROM products p
JOIN remote_wh.inventory_stock rw ON rw.sku = p.sku;
```

**Hafalan:**

```text
CREATE EXTENSION postgres_fdw; IMPORT FOREIGN SCHEMA ... INTO schema_lokal; → federated query antar database
```

---

<a id="bagian-18"></a>

## 18. 🔴 Query Performance Profiling dengan Ekstensi `pg_stat_statements`

#### Konsep

**`pg_stat_statements`** adalah modul resmi wajib untuk DBA dan Backend Engineer guna melacak dan mendiagnosa seluruh query SQL yang berjalan di database.

Mengidentifikasi:
- Query paling lambat (*Mean Execution Time*).
- Query paling sering dipanggil (*Calls Count*).
- Query yang paling banyak membebani I/O disk (*Block Read I/O*).

#### Contoh Query Diagnosa Top 5 Slow Queries

```sql
-- Aktifkan Ekstensi
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Cari 5 Query Paling Membebani Waktu CPU/Server
SELECT 
    query,
    calls,
    ROUND(total_exec_time::numeric, 2) AS total_time_ms,
    ROUND(mean_exec_time::numeric, 2) AS avg_time_ms,
    rows,
    ROUND((100.0 * shared_blks_hit / NULLIF(shared_blks_hit + shared_blks_read, 0))::numeric, 2) AS cache_hit_ratio
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 5;
```

**Hafalan:**

```text
SELECT query, calls, mean_exec_time FROM pg_stat_statements ORDER BY total_exec_time DESC; → diagnosa slow queries
```

---

<a id="bagian-19"></a>

## 19. 🔴 Connection Pooling di Lingkungan Produksi dengan `PgBouncer`

#### Konsep

PostgreSQL menggunakan model *Process-per-Connection* di mana setiap koneksi baru menghabiskan ~5–10MB RAM dan slot CPU.

Jika aplikasi backend serverless (AWS Lambda, Vercel) atau puluhan pod Kubernetes membuka 2.000 koneksi bersamaan $\rightarrow$ PostgreSQL akan crash kehabisan `max_connections`.

**Solusi: `PgBouncer`**:
- Connection Pooler ringan yang dipasang di depan PostgreSQL.
- Sanggup menerima 10.000 koneksi client dan mendistribusikannya ke hanya ~50–100 koneksi riil PostgreSQL.

Tiga Mode Pooling:
1. **Session Pooling:** Koneksi dikunci selama sesi client aktif (default).
2. **Transaction Pooling (Paling Populer):** Server connection dikembalikan ke pool segera setelah transaksi `COMMIT`/`ROLLBACK` selesai.
3. **Statement Pooling:** Koneksi dikembalikan setelah 1 statement SQL selesai (tidak mendukung multi-statement transaction).

**Hafalan:**

```text
PgBouncer Transaction Pooling → connection pooler ringan yang memungkinkan ribuan instance aplikasi berbagi koneksi Postgres
```

---

<a id="bagian-20"></a>

## 20. 🔴 Manajemen User, Roles & Hak Akses

#### Konsep

PostgreSQL menggunakan konsep **Roles** yang dapat berfungsi sebagai user (login) atau grup.

Prinsip *Least Privilege*:
- Aplikasi hanya boleh diberi hak `SELECT`, `INSERT`, `UPDATE`, `DELETE`. Dilarang menggunakan user superuser `postgres` di kode aplikasi!

#### Contoh

```sql
-- 1. Buat Role Aplikasi Tanpa Superuser
CREATE ROLE app_user WITH LOGIN PASSWORD 'SecureAppPass123!';

-- 2. Berikan Hak Akses Khusus ke Database & Skema
GRANT CONNECT ON DATABASE ecommerce_db TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;

-- 3. Berikan Hak Akses CRUD pada Seluruh Tabel
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;

-- 4. Pastikan Tabel Baru di Masa Depan Otomatis Memiliki Hak Akses Ini
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
```

**Hafalan:**

```text
CREATE ROLE app_user WITH LOGIN; GRANT SELECT, INSERT, UPDATE ON ALL TABLES TO app_user;
```

---

<a id="bagian-21"></a>

## 21. 🔴 Row Level Security (RLS) untuk Multi-Tenancy & Data Isolation

#### Konsep

**Row Level Security (RLS)**:
Fitur keamanan di mana database secara otomatis membatasi baris data yang boleh dibaca atau diubah pengguna berdasarkan *Security Policy*.

Sangat ideal untuk **Aplikasi SaaS Multi-Tenant**:
Developer tidak perlu khawatir lupa menulis `WHERE tenant_id = ...` di setiap query backend, karena database otomatis memfilternya di level engine!

#### Contoh

```sql
-- 1. Aktifkan RLS pada Tabel
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- 2. Buat Policy: Pengguna hanya boleh melihat dokumen milik tenant-nya
CREATE POLICY tenant_isolation_policy ON documents
FOR ALL
TO app_user
USING (tenant_id = CURRENT_SETTING('app.current_tenant_id')::int)
WITH CHECK (tenant_id = CURRENT_SETTING('app.current_tenant_id')::int);

-- 3. Cara Aplikasi Mengatur Sesi Tenant:
SET LOCAL app.current_tenant_id = '101';
SELECT * FROM documents; -- Otomatis hanya mengembalikan baris dengan tenant_id = 101!
```

**Hafalan:**

```text
ALTER TABLE tbl ENABLE ROW LEVEL SECURITY; CREATE POLICY p ON tbl USING (tenant_id = current_setting('app.tenant'));
```

---

<a id="bagian-22"></a>

## 22. 🔴 Database Maintenance & Garbage Collection

#### Konsep

PostgreSQL menggunakan **Multi-Version Concurrency Control (MVCC)**:
- Saat baris di-`UPDATE` atau di-`DELETE`, baris lama tidak langsung ditimpa di disk melainkan ditandai sebagai **Dead Tuple**.
- Jika tidak dibersihkan, dead tuples menyebabkan **Table Bloat** (ukuran tabel membengkak dan query melambat).

Perintah Maintenance:
1. **`VACUUM table_name;`** : Menandai ruang dead tuples agar bisa digunakan kembali oleh data baru.
2. **`VACUUM FULL table_name;`** : Mengunci tabel total dan menulis ulang file ke disk untuk mengecilkan ukuran fisik.
3. **`ANALYZE table_name;`** : Memperbarui statistik tabel untuk Cost-Based Optimizer.

**Hafalan:**

```text
VACUUM ANALYZE table_name; → membersihkan dead tuples sampah MVCC dan memperbarui statistik query optimizer
```

---

<a id="bagian-23"></a>

## 23. 🔴 Strategi Backup & Disaster Recovery

#### Konsep

1. **Logical Backup (`pg_dump`):**
   - Mengekstrak skema dan data menjadi file SQL atau custom archive `.dump`.
2. **Restore (`pg_restore` / `psql`):**
   - Memulihkan data dari berkas backup.

#### Perintah CLI di Terminal Linux

```bash
# [1] Backup Database Lengkap Format Custom Directory Terkompresi
pg_dump -U postgres -h localhost -F c -b -v -f ecommerce_backup.dump ecommerce_db

# [2] Restore Database ke Server Baru
pg_restore -U postgres -h localhost -d new_ecommerce_db -v ecommerce_backup.dump
```

**Hafalan:**

```text
pg_dump -F c -f db.dump dbname (backup arsip biner terkompresi) | pg_restore -d newdb db.dump (restore data)
```

---

<a id="bagian-24"></a>

## 24. 🔴 Replikasi & High Availability Dasar

#### Konsep

1. **Physical Streaming Replication:**
   - Menyalin seluruh isi cluster byte-by-byte via stream log transaksi WAL (*Write-Ahead Logging*).
   - Membentuk server **Read Replica** (Primary untuk Write, Replica untuk Read).
2. **Logical Replication:**
   - Menyalin data berbasis tabel/skema tertentu menggunakan model **Publish/Subscribe**.

**Hafalan:**

```text
Streaming Replication → mereplikasi seluruh cluster database ke server Read Replica untuk High Availability
```

---

<a id="bagian-25"></a>

## 25. 🛠️ Peta Ingatan Cepat

```text
            PETA ARSITEKTUR POSTGRESQL FUNGSI & ADMINISTRASI
                                   │
       ┌───────────────────────────┼───────────────────────────┐
       ▼                           ▼                           ▼
DATABASE PROGRAMMABILITY     ADVANCED EXTENSIONS & FDW     ADMINISTRATION & SECURITY
├─ Views & Materialized Views├─ Foreign Data Wrapper (FDW) ├─ User Roles & Privileges
├─ PL/pgSQL & Procedures     ├─ pg_stat_statements (Slow)  ├─ Row Level Security (RLS)
├─ Triggers (BEFORE/AFTER)   ├─ PgBouncer Connection Pool  ├─ VACUUM ANALYZE Maintenance
└─ LISTEN & NOTIFY Pub/Sub   └─ Full-Text Search (tsvector)└─ Backup pg_dump & Restore
```

---

<a id="bagian-26"></a>

## 26. 📚 Tabel Ringkasan

| Fitur / Perintah | Kategori | Fungsi & Karakteristik Utama |
|---|---|---|
| `CREATE MATERIALIZED VIEW` | Storage/Cache | Menyimpan hasil query agregat kompleks di disk |
| `REFRESH CONCURRENTLY` | Maintenance | Memperbarui Materialized View tanpa mengunci pembacaan |
| `PL/pgSQL` | Bahasa Prosedural| Menulis logika percabangan, looping, dan kalkulasi di database |
| `CREATE PROCEDURE` | Programmability | Prosedur database yang mampu mengontrol transaksi `COMMIT` |
| `BEFORE / AFTER TRIGGER` | Event Driven | Memicu fungsi otomatis saat terjadi operasi DML |
| `LISTEN / NOTIFY` | Real-Time Pub/Sub| Streaming event real-time native ke aplikasi backend |
| `postgres_fdw` | Ekstensi/FDW | Federated query dan join data antar instance PostgreSQL |
| `pg_stat_statements` | Ekstensi/Diagnostik| Melacak dan menganalisis performa slow queries di produksi |
| `PgBouncer` | Tooling/Pooler | Connection pooler ringan pencegah kehabisan `max_connections` |
| `Row Level Security (RLS)`| Keamanan | Membatasi akses baris data multi-tenant secara otomatis |
| `VACUUM ANALYZE` | Maintenance | Membersihkan dead tuples dan memperbarui statistik optimizer |
| `pg_dump` / `pg_restore` | Disaster Recovery| Utilitas backup dan pemulihan database resmi |

---

<a id="bagian-27"></a>

## 27. ⚡ Cheat Code PostgreSQL Fungsi & Administrasi 10 Detik

```sql
-- 1. Template Real-Time Trigger Notification
CREATE FUNCTION trg_notify() RETURNS TRIGGER AS $$ BEGIN PERFORM pg_notify('events', row_to_json(NEW)::text); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_ev AFTER INSERT ON orders FOR EACH ROW EXECUTE FUNCTION trg_notify();

-- 2. Template RLS Multi-Tenant
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_policy ON accounts USING (tenant_id = current_setting('app.tenant')::int);

-- 3. Template FDW Import Remote
CREATE EXTENSION postgres_fdw;
IMPORT FOREIGN SCHEMA public FROM SERVER remote_srv INTO remote_schema;
```

---

<a id="bagian-28"></a>

## 28. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Kuasai Views & Materialized Views
├── Sederhanakan query agregat dengan Virtual Views
└── Akselerasi laporan analitik via Materialized Views (REFRESH CONCURRENTLY)
       │
       ▼
Langkah 2: Kuasai PL/pgSQL & Event-Driven Triggers
├── Tulis Stored Functions (RETURNS TABLE) dan Procedures (COMMIT)
├── Pasang Audit Logging Triggers
└── Aktifkan Real-Time Event Notification via LISTEN / NOTIFY
       │
       ▼
Langkah 3: Integrasi Data Lanjutan & Ekstensi Produksi
├── Hubungkan database terdistribusi via Foreign Data Wrapper (postgres_fdw)
├── Profiling performa query via pg_stat_statements
└── Pasang connection pooler PgBouncer di depan PostgreSQL
       │
       ▼
Langkah 4: Amankan Multi-Tenancy & Kelola Server Produksi
├── Terapkan Row Level Security (RLS) untuk isolasi data tenant
├── Buat User Roles dengan prinsip Least Privilege
└── Jadwalkan VACUUM ANALYZE dan disaster recovery pg_dump
       │
       ▼
Langkah 5: Selamat! Anda Telah Menjadi Database Architect PostgreSQL Handal!
```

---

<a id="bagian-29"></a>

## 29. 🏗️ Mini Project: Production-Ready Enterprise Multi-Tenant E-Commerce System with Audit Triggers, Real-Time NOTIFY, Materialized Analytics, PL/pgSQL Stored Procedure, and Row Level Security (RLS)

Skema database PostgreSQL enterprise lengkap, modern, dan runnable yang mengintegrasikan: **Row Level Security (RLS) Multi-Tenant, Event Trigger Audit Logging, Real-Time NOTIFY Streaming, Materialized Analytics Caching, dan PL/pgSQL Inventory Procedure**.

```sql
-- =========================================================================
-- 1. SETUP TABEL MULTI-TENANT & AUDIT LOG
-- =========================================================================

CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES tenants(id),
    customer_name VARCHAR(100) NOT NULL,
    total_amount NUMERIC(15, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    tenant_id INT,
    table_name VARCHAR(50),
    action VARCHAR(20),
    record_id INT,
    old_data JSONB,
    new_data JSONB,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================
-- 2. ROW LEVEL SECURITY (RLS) MULTI-TENANT ISOLATION
-- =========================================================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_order_isolation ON orders
FOR ALL
USING (tenant_id = NULLIF(CURRENT_SETTING('app.current_tenant_id', true), '')::int)
WITH CHECK (tenant_id = NULLIF(CURRENT_SETTING('app.current_tenant_id', true), '')::int);

-- =========================================================================
-- 3. AUDIT TRIGGER & REAL-TIME PUB/SUB NOTIFY
-- =========================================================================

CREATE OR REPLACE FUNCTION trg_fn_order_pipeline()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        -- [A] Catat ke Audit Log
        INSERT INTO audit_logs (tenant_id, table_name, action, record_id, new_data)
        VALUES (NEW.tenant_id, 'orders', 'INSERT', NEW.id, to_jsonb(NEW));

        -- [B] Kirim Notifikasi Real-Time ke WebSocket Backend
        PERFORM pg_notify('live_orders', jsonb_build_object(
            'event', 'NEW_ORDER',
            'order_id', NEW.id,
            'tenant_id', NEW.tenant_id,
            'total', NEW.total_amount
        )::text);

        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$;

CREATE TRIGGER trg_orders_lifecycle
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION trg_fn_order_pipeline();

-- =========================================================================
-- 4. MATERIALIZED VIEW ANALYTICS CACHE
-- =========================================================================

CREATE MATERIALIZED VIEW mv_tenant_revenue AS
SELECT 
    tenant_id,
    COUNT(id) AS total_transactions,
    SUM(total_amount) AS total_revenue
FROM orders
WHERE status = 'PAID'
GROUP BY tenant_id;

CREATE UNIQUE INDEX idx_mv_tenant_rev ON mv_tenant_revenue (tenant_id);

-- =========================================================================
-- 5. PL/pgSQL STORED PROCEDURE TRANSAKSI
-- =========================================================================

CREATE OR REPLACE PROCEDURE pr_pay_order(p_order_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE orders 
    SET status = 'PAID' 
    WHERE id = p_order_id;

    -- Refresh cache analitik setelah pembayaran
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_tenant_revenue;
    
    COMMIT;
END;
$$;

-- =========================================================================
-- 6. SIMULASI RUNNABLE
-- =========================================================================

-- Daftarkan Dua Perusahaan Tenant Berbeda
INSERT INTO tenants (company_name) VALUES ('Toko Elektronik Makmur'), ('Fashion Busana Prima');

-- Simulasikan Sesi Login Tenant 1
SET app.current_tenant_id = '1';

INSERT INTO orders (tenant_id, customer_name, total_amount) VALUES
(1, 'Budi Santoso', 2500000),
(1, 'Ani Wijaya', 1500000);

-- Simulasikan Sesi Login Tenant 2
SET app.current_tenant_id = '2';

INSERT INTO orders (tenant_id, customer_name, total_amount) VALUES
(2, 'Citra Lestari', 850000);

-- Uji Isolasi RLS (Hanya Menampilkan Order Milik Tenant 2!)
SELECT id, tenant_id, customer_name, total_amount FROM orders;

-- Bayar Pesanan Tenant 2 via Procedure
CALL pr_pay_order(3);

-- Periksa Audit Log
SELECT id, tenant_id, action, new_data->>'customer_name' AS customer FROM audit_logs;
```

#### Hasil Output Eksekusi Terminal

```text
-- Hasil Query Tenant 2 (Isolasi RLS 100% Aman):
 id | tenant_id | customer_name | total_amount 
----+-----------+---------------+--------------
  3 |         2 | Citra Lestari |       850000

-- Hasil Audit Logs Otomatis:
 id | tenant_id | action |   customer    
----+-----------+--------+---------------
  1 |         1 | INSERT | Budi Santoso
  2 |         1 | INSERT | Ani Wijaya
  3 |         2 | INSERT | Citra Lestari
```

---

<a id="bagian-30"></a>

## 30. 🔗 Referensi Resmi

- [PostgreSQL Documentation: Views and Materialized Views](https://www.postgresql.org/docs/current/rules-materializedviews.html)
- [PostgreSQL Documentation: PL/pgSQL Programming Language](https://www.postgresql.org/docs/current/plpgsql.html)
- [PostgreSQL Documentation: Trigger Procedures](https://www.postgresql.org/docs/current/plpgsql-trigger.html)
- [PostgreSQL Documentation: LISTEN and NOTIFY](https://www.postgresql.org/docs/current/sql-notify.html)
- [PostgreSQL Documentation: postgres_fdw Module](https://www.postgresql.org/docs/current/postgres-fdw.html)
- [PostgreSQL Documentation: pg_stat_statements Module](https://www.postgresql.org/docs/current/pgstatstatements.html)
- [PgBouncer Official Documentation](https://www.pgbouncer.org/)
- [PostgreSQL Documentation: Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
