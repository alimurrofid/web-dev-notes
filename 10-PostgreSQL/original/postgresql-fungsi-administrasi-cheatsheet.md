# PostgreSQL Fungsi & Administrasi Cheatsheet — Mudah Dipahami & Diingat

> **Target:** PostgreSQL 16+ untuk pemula yang ingin memahami Views, Materialized Views, Bahasa Prosedural PL/pgSQL (Functions & Procedures), Database Triggers, Full-Text Search, Row Level Security (RLS), dan Administrasi Database (Maintenance, Backup & Restore). Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> PostgreSQL menyediakan ekstensibilitas server-side programming yang kuat melalui PL/pgSQL, otomatisasi event via Triggers, keamanan data multi-tenant via RLS, dan utilitas administrasi disaster recovery yang andal.

## Daftar Isi

1. [Views dan Materialized Views](#1-views-dan-materialized-views)
2. [Stored Functions (PL/pgSQL)](#2-stored-functions-plpgsql)
3. [Stored Procedures](#3-stored-procedures)
4. [Database Triggers](#4-database-triggers)
5. [Audit Logging Trigger](#5-audit-logging-trigger)
6. [Full-Text Search](#6-full-text-search)
7. [Row Level Security (RLS)](#7-row-level-security-rls)
8. [Database Maintenance & Backup](#8-database-maintenance--backup)

---

# 1. Views dan Materialized Views

- **View:** Query virtual yang dieksekusi setiap kali dipanggil.
- **Materialized View:** Hasil query disimpan di disk untuk performa kilat.

```sql
-- Virtual View
CREATE VIEW v_active_customers AS
SELECT id, name, email FROM customers WHERE is_active = TRUE;

-- Materialized View
CREATE MATERIALIZED VIEW mv_monthly_revenue AS
SELECT TO_CHAR(created_at, 'YYYY-MM') AS month, SUM(total_amount) AS revenue
FROM orders GROUP BY TO_CHAR(created_at, 'YYYY-MM');

-- Refresh data:
REFRESH MATERIALIZED VIEW mv_monthly_revenue;
```

---

# 2. Stored Functions (PL/pgSQL)

Menulis fungsi logika bisnis di dalam database.

```sql
CREATE OR REPLACE FUNCTION hitung_diskon(harga NUMERIC, persen INT)
RETURNS NUMERIC AS $$
BEGIN
    RETURN harga - (harga * persen / 100);
END;
$$ LANGUAGE plpgsql;

-- Pemanggilan:
SELECT hitung_diskon(100000, 10); -- Hasil: 90000
```

---

# 3. Stored Procedures

Mengeksekusi prosedur yang dapat mengontrol transaksi (`COMMIT` / `ROLLBACK`).

```sql
CREATE OR REPLACE PROCEDURE transfer_dana(pengirim UUID, penerima UUID, jumlah NUMERIC)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE accounts SET balance = balance - jumlah WHERE id = pengirim;
    UPDATE accounts SET balance = balance + jumlah WHERE id = penerima;
    COMMIT;
END;
$$;

-- Pemanggilan:
CALL transfer_dana('id-1', 'id-2', 50000);
```

---

# 4. Database Triggers

Mengeksekusi fungsi otomatis saat terjadi event `INSERT`, `UPDATE`, atau `DELETE`.

```sql
-- 1. Trigger Function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Trigger Attachment
CREATE TRIGGER trg_update_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
```

---

# 5. Audit Logging Trigger

Mencatat history perubahan data ke tabel audit log.

```sql
CREATE OR REPLACE FUNCTION audit_product_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO product_audit (product_id, old_price, new_price, changed_at)
    VALUES (OLD.id, OLD.price, NEW.price, CURRENT_TIMESTAMP);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_price
AFTER UPDATE OF price ON products
FOR EACH ROW
EXECUTE FUNCTION audit_product_changes();
```

---

# 6. Full-Text Search

Pencarian teks canggih berbasis kata dasar dan bobot relevansi.

```sql
SELECT title, content 
FROM articles 
WHERE to_tsvector('indonesian', title || ' ' || content) @@ to_tsquery('indonesian', 'database & postgresql');
```

---

# 7. Row Level Security (RLS)

Membatasi akses baris data per tenant atau per user di level database.

```sql
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON documents
FOR ALL
USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

---

# 8. Database Maintenance & Backup

- `VACUUM ANALYZE;` : Membersihkan dead tuples dan memperbarui statistik optimizer.
- `pg_dump -U postgres -d my_db -F c -b -v -f backup.dump` : Backup database ke file dump.
- `pg_restore -U postgres -d my_db_new -v backup.dump` : Restore file dump ke database.
