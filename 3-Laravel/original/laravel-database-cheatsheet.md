# Laravel Database Cheatsheet — Mudah Dipahami & Diingat

> Cheatsheet ini membahas database Laravel dari dasar sampai Query Builder, transaction, pagination, migration, dan seeding.
>
> Pola utama:
>
> ```text
> CONFIG → DB FAÇADE → QUERY BUILDER → MIGRATION → SEEDING
> ```

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Pengenalan Laravel Database](#2-pengenalan-laravel-database)
3. [Membuat Project](#3-membuat-project)
4. [Konfigurasi Database](#4-konfigurasi-database)
5. [Membuat Database](#5-membuat-database)
6. [DB Facade](#6-db-facade)
7. [Debug Query](#7-debug-query)
8. [CRUD SQL](#8-crud-sql)
9. [Database Transaction](#9-database-transaction)
10. [Database Commands](#10-database-commands)
11. [Query Builder](#11-query-builder)
12. [Query Builder Insert](#12-query-builder-insert)
13. [Query Builder Select](#13-query-builder-select)
14. [Query Builder Where](#14-query-builder-where)
15. [Query Builder Update](#15-query-builder-update)
16. [Query Builder Delete](#16-query-builder-delete)
17. [Query Builder Join](#17-query-builder-join)
18. [Query Builder Ordering](#18-query-builder-ordering)
19. [Query Builder Paging](#19-query-builder-paging)
20. [Chunk Results](#20-chunk-results)
21. [Lazy Results](#21-lazy-results)
22. [Cursor](#22-cursor)
23. [Query Builder Aggregate](#23-query-builder-aggregate)
24. [Query Builder Raw](#24-query-builder-raw)
25. [Query Builder Grouping](#25-query-builder-grouping)
26. [Query Builder Locking](#26-query-builder-locking)
27. [Pagination](#27-pagination)
28. [Cursor Pagination](#28-cursor-pagination)
29. [Database Migration](#29-database-migration)
30. [Membuat Database Migration](#30-membuat-database-migration)
31. [Rollback Database Migration](#31-rollback-database-migration)
32. [Database Seeding](#32-database-seeding)
33. [Cheat Flow Database](#33-cheat-flow-database)
34. [Tabel Ringkasan](#34-tabel-ringkasan)
35. [Cheat Code Database 10 Detik](#35-cheat-code-database-10-detik)
36. [Referensi Resmi](#36-referensi-resmi)

---

# 1. Pendahuluan

Laravel menyediakan beberapa cara untuk berinteraksi dengan database:

```text
SQL langsung
   ↓
DB Facade
   ↓
Query Builder
   ↓
Eloquent ORM
```

Cheatsheet ini fokus pada:

```text
DB Facade
Query Builder
Transaction
Pagination
Migration
Seeding
```

Contoh database yang digunakan:

```text
users
products
orders
categories
```

Contoh struktur sederhana:

```text
users
- id
- name
- email
- age
- created_at
- updated_at
```

---

# 2. Pengenalan Laravel Database

Konfigurasi database Laravel berada di:

```text
config/database.php
```

Konfigurasi biasanya mengambil nilai dari:

```text
.env
```

Contoh:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=belajar_laravel
DB_USERNAME=root
DB_PASSWORD=
```

Laravel mendukung berbagai database melalui driver yang tersedia, misalnya:

```text
MySQL
PostgreSQL
SQLite
SQL Server
```

Akses database menggunakan:

```php
use Illuminate\Support\Facades\DB;
```

Contoh:

```php
$users = DB::table('users')->get();
```

**Hafalan:**

```text
.env
→ konfigurasi environment

config/database.php
→ konfigurasi database Laravel

DB::table()
→ Query Builder
```

---

# 3. Membuat Project

Buat project:

```bash
composer create-project laravel/laravel belajar-database
```

Masuk:

```bash
cd belajar-database
```

Jalankan:

```bash
php artisan serve
```

Atau:

```bash
composer run dev
```

Test koneksi database:

```bash
php artisan migrate
```

Jika migration berhasil dijalankan, konfigurasi database kemungkinan sudah benar.

---

# 4. Konfigurasi Database

## File `.env`

Contoh MySQL:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=belajar_laravel
DB_USERNAME=root
DB_PASSWORD=
```

Contoh SQLite:

```env
DB_CONNECTION=sqlite
```

Pastikan file SQLite tersedia jika konfigurasi Anda menggunakannya.

## Melihat konfigurasi

```php
config('database.default');
```

Hasil misalnya:

```text
mysql
```

Melihat database connection:

```php
config('database.connections.mysql');
```

## Clear configuration cache

Jika perubahan `.env` belum terbaca:

```bash
php artisan config:clear
```

Atau:

```bash
php artisan optimize:clear
```

Untuk production, configuration dapat di-cache:

```bash
php artisan config:cache
```

**Hafalan:**

```text
.env
→ nilai environment

config/database.php
→ definisi connection

config:clear
→ hapus cache config

config:cache
→ cache config
```

---

# 5. Membuat Database

Laravel tidak selalu membuat database server secara otomatis.

Untuk MySQL:

```sql
CREATE DATABASE belajar_laravel;
```

Atau:

```sql
CREATE DATABASE belajar_laravel
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Setelah itu isi:

```env
DB_DATABASE=belajar_laravel
```

Untuk SQLite, buat file database sesuai konfigurasi project, misalnya:

```text
database/database.sqlite
```

Kemudian:

```bash
php artisan migrate
```

**Pola:**

```text
Buat database
 ↓
Atur .env
 ↓
php artisan migrate
 ↓
Database siap
```

---

# 6. DB Facade

Import:

```php
use Illuminate\Support\Facades\DB;
```

## `DB::table()`

```php
$users =
    DB::table('users')
        ->get();
```

## `DB::select()`

Menjalankan SQL:

```php
$users = DB::select(
    'SELECT * FROM users'
);
```

Dengan parameter binding:

```php
$users = DB::select(
    'SELECT * FROM users WHERE age > ?',
    [18]
);
```

## `DB::insert()`

```php
DB::insert(
    'INSERT INTO users
     (name, email)
     VALUES (?, ?)',
    [
        'Budi',
        'budi@example.com'
    ]
);
```

## `DB::update()`

```php
DB::update(
    'UPDATE users
     SET name = ?
     WHERE id = ?',
    [
        'Andi',
        1
    ]
);
```

## `DB::delete()`

```php
DB::delete(
    'DELETE FROM users
     WHERE id = ?',
    [1]
);
```

## `DB::statement()`

Untuk statement SQL umum:

```php
DB::statement(
    'CREATE TABLE test (
        id INTEGER PRIMARY KEY
    )'
);
```

> Gunakan parameter binding untuk nilai dari user. Jangan menyusun SQL dengan string concatenation dari input user.

---

# 7. Debug Query

## `toSql()`

Query Builder:

```php
$query =
    DB::table('users')
        ->where('age', '>', 18);

$sql =
    $query->toSql();
```

Hasil kira-kira:

```sql
select * from "users"
where "age" > ?
```

`toSql()` menampilkan SQL dengan placeholder, bukan nilai binding.

## `getBindings()`

```php
$bindings =
    $query->getBindings();
```

## `dump()`

```php
$query->dump();
```

## `dd()`

```php
$query->dd();
```

`dd()` menampilkan query lalu menghentikan eksekusi.

## `DB::listen()`

Untuk mendengarkan query yang dieksekusi:

```php
DB::listen(
    function ($query) {
        logger($query->sql);
        logger($query->bindings);
        logger($query->time);
    }
);
```

**Hafalan:**

```text
toSql()
→ lihat SQL

getBindings()
→ lihat parameter

dump()
→ tampilkan query

dd()
→ tampilkan + stop

listen()
→ pantau query yang dieksekusi
```

---

# 8. CRUD SQL

CRUD:

```text
Create
Read
Update
Delete
```

## Create

```sql
INSERT INTO users
(name, email)
VALUES
('Budi', 'budi@example.com');
```

Laravel:

```php
DB::insert(
    'INSERT INTO users
     (name, email)
     VALUES (?, ?)',
    [
        'Budi',
        'budi@example.com'
    ]
);
```

## Read

```sql
SELECT *
FROM users;
```

Laravel:

```php
DB::select(
    'SELECT * FROM users'
);
```

## Update

```sql
UPDATE users
SET name = 'Andi'
WHERE id = 1;
```

Laravel:

```php
DB::update(
    'UPDATE users
     SET name = ?
     WHERE id = ?',
    ['Andi', 1]
);
```

## Delete

```sql
DELETE FROM users
WHERE id = 1;
```

Laravel:

```php
DB::delete(
    'DELETE FROM users
     WHERE id = ?',
    [1]
);
```

---

# 9. Database Transaction

Transaction memastikan beberapa operasi database diperlakukan sebagai satu kesatuan.

Konsep:

```text
BEGIN
 ↓
Query 1
 ↓
Query 2
 ↓
Query 3
 ↓
COMMIT
```

Jika gagal:

```text
ROLLBACK
```

## `DB::transaction()`

Cara yang direkomendasikan:

```php
DB::transaction(
    function () {

        DB::table('orders')
            ->insert([
                'user_id' => 1,
                'total' => 100000,
            ]);

        DB::table('users')
            ->where('id', 1)
            ->increment(
                'order_count'
            );
    }
);
```

Jika exception terjadi di dalam closure, transaction akan di-rollback.

## Return Value

```php
$result = DB::transaction(
    function () {

        // query...

        return 'success';
    }
);
```

## Retry Deadlock

Transaction dapat diberikan jumlah percobaan:

```php
DB::transaction(
    function () {
        // query...
    },
    5
);
```

Angka `5` berarti Laravel dapat mencoba transaction kembali ketika terjadi deadlock sesuai mekanisme transaction Laravel.

## Manual Transaction

```php
DB::beginTransaction();

try {

    // query 1
    // query 2

    DB::commit();

} catch (Throwable $e) {

    DB::rollBack();

    throw $e;
}
```

**Hafalan:**

```text
transaction
→ semua berhasil
→ COMMIT

salah satu gagal
→ ROLLBACK
```

---

# 10. Database Commands

Laravel menyediakan Artisan command untuk database.

## Migration

Jalankan:

```bash
php artisan migrate
```

Rollback batch terakhir:

```bash
php artisan migrate:rollback
```

Reset semua migration:

```bash
php artisan migrate:reset
```

Rollback lalu migrate ulang:

```bash
php artisan migrate:refresh
```

Drop semua table lalu migrate:

```bash
php artisan migrate:fresh
```

Dengan seeder:

```bash
php artisan migrate:fresh --seed
```

## Status Migration

```bash
php artisan migrate:status
```

## Database Monitor

Pada versi Laravel yang menyediakan command terkait database:

```bash
php artisan db
```

Untuk daftar command yang tersedia:

```bash
php artisan list
```

**Catatan:**

Command database dapat berbeda menurut versi Laravel. Gunakan:

```bash
php artisan list
```

untuk melihat command yang tersedia pada project Anda.

---

# 11. Query Builder

Query Builder adalah API Laravel untuk membangun query database secara programatik.

Import:

```php
use Illuminate\Support\Facades\DB;
```

Contoh:

```php
$users =
    DB::table('users')
        ->get();
```

Query Builder menggunakan method chaining:

```php
$users =
    DB::table('users')
        ->where('active', true)
        ->orderBy('name')
        ->get();
```

Baca:

```text
users
 ↓
active = true
 ↓
order name
 ↓
ambil data
```

**Hafalan:**

```text
DB::table()
→ mulai Query Builder
```

---

# 12. Query Builder Insert

## `insert()`

```php
DB::table('users')
    ->insert([
        'name' => 'Budi',
        'email' => 'budi@example.com',
    ]);
```

## Banyak Data

```php
DB::table('users')
    ->insert([
        [
            'name' => 'Budi',
            'email' => 'budi@example.com',
        ],
        [
            'name' => 'Andi',
            'email' => 'andi@example.com',
        ],
    ]);
```

## `insertOrIgnore()`

```php
DB::table('users')
    ->insertOrIgnore([
        'name' => 'Budi',
        'email' => 'budi@example.com',
    ]);
```

Perhatikan bahwa perilaku error/duplicate dapat bergantung pada database driver.

## `insertGetId()`

Untuk mendapatkan ID hasil insert:

```php
$id =
    DB::table('users')
        ->insertGetId([
            'name' => 'Budi',
            'email' => 'budi@example.com',
        ]);
```

## `upsert()`

Insert jika belum ada, update jika sudah ada berdasarkan unique key tertentu:

```php
DB::table('users')
    ->upsert(
        [
            [
                'email' => 'budi@example.com',
                'name' => 'Budi',
            ],
            [
                'email' => 'andi@example.com',
                'name' => 'Andi',
            ],
        ],
        ['email'],
        ['name']
    );
```

**Hafalan:**

```text
insert
→ insert

insertGetId
→ insert + ambil ID

insertOrIgnore
→ insert + abaikan error tertentu

upsert
→ insert atau update
```

---

# 13. Query Builder Select

## `get()`

```php
$users =
    DB::table('users')
        ->get();
```

## `first()`

```php
$user =
    DB::table('users')
        ->first();
```

## `find()`

```php
$user =
    DB::table('users')
        ->find(1);
```

## `value()`

```php
$name =
    DB::table('users')
        ->where('id', 1)
        ->value('name');
```

## `pluck()`

```php
$emails =
    DB::table('users')
        ->pluck('email');
```

Dengan key:

```php
$users =
    DB::table('users')
        ->pluck(
            'name',
            'id'
        );
```

## Select Columns

```php
$users =
    DB::table('users')
        ->select(
            'id',
            'name',
            'email'
        )
        ->get();
```

## `selectRaw()`

```php
$users =
    DB::table('users')
        ->selectRaw(
            'name, age + 1 AS next_age'
        )
        ->get();
```

Gunakan binding jika ada input dinamis:

```php
DB::table('users')
    ->selectRaw(
        'price * ? AS total',
        [1.1]
    )
    ->get();
```

## `distinct()`

```php
$ages =
    DB::table('users')
        ->distinct()
        ->pluck('age');
```

**Hafalan:**

```text
get()
→ banyak row

first()
→ satu row pertama

find()
→ berdasarkan primary key

value()
→ satu value

pluck()
→ satu kolom
```

---

# 14. Query Builder Where

## `where()`

```php
$users =
    DB::table('users')
        ->where(
            'age',
            '>',
            18
        )
        ->get();
```

Bentuk sederhana:

```php
DB::table('users')
    ->where(
        'active',
        true
    )
    ->get();
```

## `whereIn()`

```php
DB::table('users')
    ->whereIn(
        'id',
        [1, 2, 3]
    )
    ->get();
```

## `whereNotIn()`

```php
DB::table('users')
    ->whereNotIn(
        'id',
        [1, 2, 3]
    )
    ->get();
```

## `whereNull()`

```php
DB::table('users')
    ->whereNull('email_verified_at')
    ->get();
```

## `whereNotNull()`

```php
DB::table('users')
    ->whereNotNull('email_verified_at')
    ->get();
```

## `whereBetween()`

```php
DB::table('users')
    ->whereBetween(
        'age',
        [18, 30]
    )
    ->get();
```

## `whereNotBetween()`

```php
DB::table('users')
    ->whereNotBetween(
        'age',
        [18, 30]
    )
    ->get();
```

## `whereLike()`

Pada versi Laravel yang mendukung method ini:

```php
DB::table('users')
    ->whereLike(
        'name',
        '%budi%'
    )
    ->get();
```

Alternatif umum:

```php
DB::table('users')
    ->where(
        'name',
        'like',
        '%budi%'
    )
    ->get();
```

## `orWhere()`

```php
DB::table('users')
    ->where(
        'role',
        'admin'
    )
    ->orWhere(
        'role',
        'staff'
    )
    ->get();
```

## Grouping Conditions

```php
DB::table('users')
    ->where(
        function ($query) {
            $query
                ->where('role', 'admin')
                ->orWhere('role', 'staff');
        }
    )
    ->where('active', true)
    ->get();
```

Secara logika:

```text
(role = admin OR role = staff)
AND active = true
```

## `whereColumn()`

Membandingkan dua kolom:

```php
DB::table('orders')
    ->whereColumn(
        'paid_at',
        '<',
        'shipped_at'
    )
    ->get();
```

**Hafalan:**

```text
where
→ kondisi

whereIn
→ termasuk daftar

whereNull
→ NULL

whereBetween
→ rentang

orWhere
→ OR

whereColumn
→ kolom dibandingkan kolom
```

---

# 15. Query Builder Update

## `update()`

```php
DB::table('users')
    ->where('id', 1)
    ->update([
        'name' => 'Andi',
    ]);
```

Return value:

```text
jumlah row yang berubah
```

## Update Banyak Kolom

```php
DB::table('users')
    ->where('id', 1)
    ->update([
        'name' => 'Andi',
        'active' => true,
    ]);
```

## `increment()`

```php
DB::table('users')
    ->where('id', 1)
    ->increment(
        'login_count'
    );
```

Dengan nilai:

```php
DB::table('users')
    ->where('id', 1)
    ->increment(
        'login_count',
        5
    );
```

## `decrement()`

```php
DB::table('products')
    ->where('id', 1)
    ->decrement(
        'stock'
    );
```

## Increment + Update

```php
DB::table('products')
    ->where('id', 1)
    ->increment(
        'stock',
        5,
        [
            'updated_at' =>
                now()
        ]
    );
```

**Hafalan:**

```text
update()
→ ubah kolom

increment()
→ + angka

decrement()
→ - angka
```

---

# 16. Query Builder Delete

## `delete()`

```php
DB::table('users')
    ->where('id', 1)
    ->delete();
```

## Delete Berdasarkan Kondisi

```php
DB::table('users')
    ->where('active', false)
    ->delete();
```

## Truncate

Menghapus seluruh data:

```php
DB::table('users')
    ->truncate();
```

> `truncate()` berbeda dengan `delete()`. Ia bekerja pada level tabel dan perilaku terhadap auto-increment/foreign key dapat berbeda menurut database.

**Hafalan:**

```text
delete
→ hapus row berdasarkan kondisi

truncate
→ kosongkan tabel
```

---

# 17. Query Builder Join

Misalnya:

```text
users
- id
- name

orders
- id
- user_id
- total
```

## `join()`

```php
$orders =
    DB::table('orders')
        ->join(
            'users',
            'orders.user_id',
            '=',
            'users.id'
        )
        ->select(
            'orders.*',
            'users.name'
        )
        ->get();
```

## `leftJoin()`

```php
DB::table('users')
    ->leftJoin(
        'orders',
        'users.id',
        '=',
        'orders.user_id'
    )
    ->get();
```

## `rightJoin()`

```php
DB::table('users')
    ->rightJoin(
        'orders',
        'users.id',
        '=',
        'orders.user_id'
    )
    ->get();
```

## Join dengan kondisi

```php
DB::table('users')
    ->join(
        'orders',
        function ($join) {
            $join
                ->on(
                    'users.id',
                    '=',
                    'orders.user_id'
                )
                ->where(
                    'orders.status',
                    'paid'
                );
        }
    )
    ->get();
```

**Hafalan:**

```text
join
→ inner join

leftJoin
→ semua data kiri

rightJoin
→ semua data kanan
```

---

# 18. Query Builder Ordering

## `orderBy()`

```php
$users =
    DB::table('users')
        ->orderBy(
            'name',
            'asc'
        )
        ->get();
```

Descending:

```php
DB::table('users')
    ->orderBy(
        'created_at',
        'desc'
    )
    ->get();
```

## `latest()`

Umumnya berdasarkan `created_at`:

```php
DB::table('users')
    ->latest()
    ->get();
```

## `oldest()`

```php
DB::table('users')
    ->oldest()
    ->get();
```

## Multiple Ordering

```php
DB::table('users')
    ->orderBy(
        'age',
        'desc'
    )
    ->orderBy(
        'name',
        'asc'
    )
    ->get();
```

## `inRandomOrder()`

```php
DB::table('users')
    ->inRandomOrder()
    ->first();
```

**Hafalan:**

```text
orderBy
→ urutkan

latest
→ terbaru

oldest
→ terlama

inRandomOrder
→ acak
```

---

# 19. Query Builder Paging

Paging dasar menggunakan:

```php
offset()
limit()
```

Contoh:

```php
$users =
    DB::table('users')
        ->offset(20)
        ->limit(10)
        ->get();
```

Artinya:

```text
lewati 20
ambil 10
```

## `skip()`

```php
DB::table('users')
    ->skip(20)
    ->take(10)
    ->get();
```

## `take()`

```php
DB::table('users')
    ->take(10)
    ->get();
```

**Hafalan:**

```text
offset / skip
→ lewati

limit / take
→ ambil
```

---

# 20. Chunk Results

`chunk()` memproses query dalam batch.

```php
DB::table('users')
    ->orderBy('id')
    ->chunk(
        100,
        function ($users) {

            foreach ($users as $user) {
                // proses user
            }

        }
    );
```

Konsep:

```text
1.000.000 users

 ↓ chunk 100

100 users
100 users
100 users
...
```

Keuntungan:

```text
memory lebih hemat
cocok untuk batch processing
```

## `chunkById()`

Untuk pemrosesan yang mengubah data, `chunkById()` sering lebih aman daripada offset-based chunking.

```php
DB::table('users')
    ->where('active', true)
    ->chunkById(
        100,
        function ($users) {

            foreach ($users as $user) {
                DB::table('users')
                    ->where('id', $user->id)
                    ->update([
                        'active' => false
                    ]);
            }

        }
    );
```

**Hafalan:**

```text
chunk()
→ batch berdasarkan chunk query

chunkById()
→ batch berdasarkan ID
```

---

# 21. Lazy Results

Query Builder mendukung pemrosesan lazy.

## `lazy()`

```php
$users =
    DB::table('users')
        ->orderBy('id')
        ->lazy();
```

Kemudian:

```php
foreach ($users as $user) {
    // proses
}
```

Data diproses secara bertahap sehingga tidak harus mengambil semua row menjadi Collection biasa.

## `lazyById()`

```php
$users =
    DB::table('users')
        ->lazyById();
```

Untuk kondisi tertentu, terutama ketika data sedang diperbarui, `lazyById()` dapat membantu menghindari masalah offset.

**Hafalan:**

```text
get()
→ semua hasil

chunk()
→ batch

lazy()
→ lazy stream
```

---

# 22. Cursor

`cursor()` menggunakan generator untuk mengambil model/row satu per satu.

Contoh Query Builder:

```php
$users =
    DB::table('users')
        ->orderBy('id')
        ->cursor();

foreach ($users as $user) {
    // satu row
}
```

Karakteristik:

```text
memory sangat rendah
satu row diproses pada satu waktu
```

Perbedaan umum:

```text
get()
→ Collection seluruh hasil

chunk()
→ batch

lazy()
→ lazy sequence

cursor()
→ satu per satu
```

Catatan penting:

`cursor()` cocok untuk memory efficiency, tetapi untuk query yang sangat besar dan operasi yang membutuhkan relasi/join kompleks, pertimbangkan karakteristik query dan metode chunk/lazy yang sesuai.

---

# 23. Query Builder Aggregate

Aggregate digunakan untuk menghasilkan nilai ringkasan.

## `count()`

```php
$count =
    DB::table('users')
        ->count();
```

## `max()`

```php
$max =
    DB::table('products')
        ->max('price');
```

## `min()`

```php
$min =
    DB::table('products')
        ->min('price');
```

## `avg()`

```php
$average =
    DB::table('products')
        ->avg('price');
```

## `sum()`

```php
$total =
    DB::table('orders')
        ->sum('total');
```

## `exists()`

```php
$exists =
    DB::table('users')
        ->where(
            'email',
            'budi@example.com'
        )
        ->exists();
```

## `doesntExist()`

```php
$notExists =
    DB::table('users')
        ->where(
            'email',
            'budi@example.com'
        )
        ->doesntExist();
```

**Hafalan:**

```text
count
→ jumlah

sum
→ total

avg
→ rata-rata

min
→ terkecil

max
→ terbesar

exists
→ apakah ada?
```

---

# 24. Query Builder Raw

Raw expression digunakan ketika membutuhkan SQL expression yang tidak tersedia langsung sebagai method biasa.

## `DB::raw()`

```php
$users =
    DB::table('users')
        ->select(
            'name',
            DB::raw(
                'age + 1 AS next_age'
            )
        )
        ->get();
```

## `selectRaw()`

```php
DB::table('orders')
    ->selectRaw(
        'SUM(total) AS total_sales'
    )
    ->get();
```

## `whereRaw()`

```php
DB::table('users')
    ->whereRaw(
        'age > ?',
        [18]
    )
    ->get();
```

## `havingRaw()`

```php
DB::table('orders')
    ->select(
        'user_id'
    )
    ->selectRaw(
        'SUM(total) AS total'
    )
    ->groupBy('user_id')
    ->havingRaw(
        'SUM(total) > ?',
        [1000000]
    )
    ->get();
```

## `orderByRaw()`

```php
DB::table('users')
    ->orderByRaw(
        'FIELD(status, ?, ?)',
        ['active', 'inactive']
    )
    ->get();
```

> **Penting:** jangan memasukkan input user langsung ke string SQL raw. Gunakan parameter binding jika method mendukung binding.

---

# 25. Query Builder Grouping

## `groupBy()`

```php
$result =
    DB::table('orders')
        ->select(
            'user_id'
        )
        ->selectRaw(
            'SUM(total) AS total'
        )
        ->groupBy('user_id')
        ->get();
```

SQL konsep:

```sql
SELECT user_id,
       SUM(total) AS total
FROM orders
GROUP BY user_id;
```

## Multiple Group

```php
DB::table('orders')
    ->groupBy(
        'user_id',
        'status'
    )
    ->get();
```

## `having()`

```php
DB::table('orders')
    ->select(
        'user_id'
    )
    ->selectRaw(
        'SUM(total) AS total'
    )
    ->groupBy('user_id')
    ->having(
        'total',
        '>',
        1000000
    )
    ->get();
```

## `havingBetween()`

Pada versi Laravel yang mendukung:

```php
DB::table('orders')
    ->select(
        'user_id'
    )
    ->selectRaw(
        'SUM(total) AS total'
    )
    ->groupBy('user_id')
    ->havingBetween(
        'total',
        [1000000, 5000000]
    )
    ->get();
```

**Hafalan:**

```text
WHERE
→ filter row sebelum grouping

GROUP BY
→ kelompokkan

HAVING
→ filter hasil grouping
```

---

# 26. Query Builder Locking

Locking digunakan terutama dalam transaction ketika beberapa proses dapat mengakses/mengubah data yang sama.

## `lockForUpdate()`

```php
DB::transaction(
    function () {

        $product =
            DB::table('products')
                ->where('id', 1)
                ->lockForUpdate()
                ->first();

        // update stock...

    }
);
```

Konsep:

```text
Transaction
 ↓
lock row
 ↓
baca
 ↓
ubah
 ↓
commit
```

## `sharedLock()`

```php
$product =
    DB::table('products')
        ->where('id', 1)
        ->sharedLock()
        ->first();
```

**Hafalan:**

```text
lockForUpdate
→ lock untuk update

sharedLock
→ shared/read lock
```

> Detail perilaku locking bergantung pada database engine dan isolation level. Gunakan locking bersama transaction jika memang membutuhkan konsistensi konkurensi.

---

# 27. Pagination

Laravel menyediakan pagination melalui Query Builder.

## `paginate()`

```php
$users =
    DB::table('users')
        ->orderBy('id')
        ->paginate(10);
```

Artinya:

```text
10 data per halaman
```

Di controller:

```php
return view(
    'users.index',
    compact('users')
);
```

Di Blade:

```blade
{{ $users->links() }}
```

## Current Page

Laravel otomatis membaca parameter query seperti:

```text
?page=2
```

## `simplePaginate()`

Jika hanya membutuhkan:

```text
Previous
Next
```

gunakan:

```php
$users =
    DB::table('users')
        ->simplePaginate(10);
```

Perbedaan:

```text
paginate()
→ informasi jumlah halaman/total

simplePaginate()
→ next/previous sederhana
```

**Hafalan:**

```text
paginate()
→ pagination lengkap

simplePaginate()
→ pagination sederhana
```

---

# 28. Cursor Pagination

Cursor pagination menggunakan cursor daripada offset.

```php
$users =
    DB::table('users')
        ->orderBy('id')
        ->cursorPaginate(10);
```

Hasil biasanya digunakan dengan:

```blade
{{ $users->links() }}
```

Konsep:

```text
Offset Pagination

page 1 → offset 0
page 2 → offset 10
page 3 → offset 20


Cursor Pagination

cursor A
 ↓
cursor B
 ↓
cursor C
```

Cursor pagination sangat berguna untuk dataset besar karena tidak perlu menghitung offset besar dengan cara yang sama seperti pagination berbasis offset.

Syarat penting:

```text
ORDER BY yang stabil
kolom ordering harus sesuai kebutuhan cursor
```

Contoh:

```php
DB::table('users')
    ->orderBy('id')
    ->cursorPaginate(20);
```

**Hafalan:**

```text
paginate
→ page/offset

cursorPaginate
→ cursor
```

---

# 29. Database Migration

Migration adalah version control untuk struktur database.

Konsep:

```text
Developer A
    ↓
migration
    ↓
database

Developer B
    ↓
migration
    ↓
database
```

Daripada mengubah database secara manual:

```text
CREATE TABLE
ALTER TABLE
DROP TABLE
```

Laravel menyimpan perubahan schema dalam file migration.

Lokasi:

```text
database/migrations/
```

Contoh:

```text
2026_01_01_000000_create_users_table.php
```

Migration biasanya memiliki:

```php
public function up(): void
{
    // perubahan schema
}

public function down(): void
{
    // membatalkan perubahan
}
```

---

# 30. Membuat Database Migration

## Generate Migration

```bash
php artisan make:migration create_products_table
```

Laravel membuat file di:

```text
database/migrations/
```

## Contoh Migration

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create(
            'products',
            function (Blueprint $table) {

                $table->id();

                $table->string(
                    'name'
                );

                $table->decimal(
                    'price',
                    15,
                    2
                );

                $table->integer(
                    'stock'
                )->default(0);

                $table->timestamps();
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'products'
        );
    }
};
```

Jalankan:

```bash
php artisan migrate
```

## Menambah Kolom

Buat migration:

```bash
php artisan make:migration add_status_to_products_table
```

Contoh:

```php
Schema::table(
    'products',
    function (Blueprint $table) {
        $table->string(
            'status'
        )->default('active');
    }
);
```

## Menghapus Kolom

```php
Schema::table(
    'products',
    function (Blueprint $table) {
        $table->dropColumn(
            'status'
        );
    }
);
```

## Rename Column

```php
Schema::table(
    'products',
    function (Blueprint $table) {
        $table->renameColumn(
            'name',
            'product_name'
        );
    }
);
```

## Foreign Key

Contoh:

```php
$table->foreignId(
    'user_id'
)->constrained();
```

Atau lebih eksplisit:

```php
$table->foreignId(
    'user_id'
)->constrained(
    'users'
);
```

Dengan cascade:

```php
$table->foreignId(
    'user_id'
)
->constrained()
->cascadeOnDelete();
```

**Hafalan:**

```text
make:migration
→ buat file migration

up()
→ apply perubahan

down()
→ reverse perubahan

migrate
→ jalankan migration
```

---

# 31. Rollback Database Migration

## Rollback

```bash
php artisan migrate:rollback
```

Mengembalikan batch migration terakhir.

## Rollback Beberapa Step

```bash
php artisan migrate:rollback --step=2
```

## Reset

```bash
php artisan migrate:reset
```

Mengembalikan semua migration.

## Refresh

```bash
php artisan migrate:refresh
```

Konsep:

```text
rollback
 ↓
migrate lagi
```

Dengan step:

```bash
php artisan migrate:refresh --step=2
```

## Fresh

```bash
php artisan migrate:fresh
```

Konsep:

```text
drop semua table
 ↓
migrate dari awal
```

Dengan seeder:

```bash
php artisan migrate:fresh --seed
```

> **Peringatan:** `migrate:fresh` dapat menghapus seluruh tabel dalam database yang digunakan. Jangan menjalankannya sembarangan pada production.

**Hafalan:**

```text
rollback
→ batalkan batch terakhir

reset
→ batalkan semua migration

refresh
→ rollback + migrate

fresh
→ drop table + migrate
```

---

# 32. Database Seeding

Seeding digunakan untuk memasukkan data awal/dummy ke database.

Seeder berada di:

```text
database/seeders/
```

## Membuat Seeder

```bash
php artisan make:seeder ProductSeeder
```

Contoh:

```php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder
    extends Seeder
{
    public function run(): void
    {
        DB::table('products')
            ->insert([
                [
                    'name' => 'Laptop',
                    'price' => 10000000,
                    'stock' => 10,
                ],
                [
                    'name' => 'Mouse',
                    'price' => 200000,
                    'stock' => 50,
                ],
            ]);
    }
}
```

## Memanggil Seeder

Di:

```text
database/seeders/DatabaseSeeder.php
```

```php
public function run(): void
{
    $this->call([
        ProductSeeder::class,
    ]);
}
```

Jalankan:

```bash
php artisan db:seed
```

Atau seeder tertentu:

```bash
php artisan db:seed
    --class=ProductSeeder
```

## Migration + Seeder

```bash
php artisan migrate --seed
```

## Fresh + Seeder

```bash
php artisan migrate:fresh --seed
```

## Seeder dengan Loop

```php
for ($i = 1; $i <= 10; $i++) {

    DB::table('products')
        ->insert([
            'name' =>
                "Product $i",
            'price' => $i * 10000,
            'stock' => 10,
        ]);
}
```

## Factory

Untuk data dummy dalam jumlah besar, Laravel Factory sering lebih nyaman.

Generate:

```bash
php artisan make:factory ProductFactory
```

Contoh konsep:

```php
Product::factory()
    ->count(100)
    ->create();
```

> Factory biasanya digunakan bersama Eloquent model. Seeder bertugas mengatur bagaimana data awal/dummy dimasukkan.

---

# 33. Cheat Flow Database

Ketika membuat fitur database:

```text
1. DATABASE
      ↓
2. .env
      ↓
3. MIGRATION
      ↓
4. SEEDER
      ↓
5. QUERY BUILDER
      ↓
6. TRANSACTION
      ↓
7. PAGINATION
```

Contoh alur:

```text
User membuat akun
        ↓
INSERT users
        ↓
Buat order
        ↓
Kurangi stock
        ↓
Semua berhasil?
   ↙          ↘
 YA           TIDAK
 ↓              ↓
COMMIT       ROLLBACK
```

---

# 34. Tabel Ringkasan

| Materi | Syntax | Fungsi |
|---|---|---|
| DB Facade | `DB::table()` | Mulai Query Builder |
| SQL Select | `DB::select()` | SQL SELECT |
| SQL Insert | `DB::insert()` | SQL INSERT |
| SQL Update | `DB::update()` | SQL UPDATE |
| SQL Delete | `DB::delete()` | SQL DELETE |
| Transaction | `DB::transaction()` | Transaction otomatis |
| Transaction | `DB::beginTransaction()` | Mulai manual |
| Transaction | `DB::commit()` | Commit |
| Transaction | `DB::rollBack()` | Rollback |
| Debug | `toSql()` | Lihat SQL |
| Debug | `getBindings()` | Lihat binding |
| Insert | `insert()` | Insert row |
| Insert | `insertGetId()` | Insert + ID |
| Insert | `insertOrIgnore()` | Insert + ignore tertentu |
| Insert | `upsert()` | Insert/update |
| Select | `get()` | Banyak row |
| Select | `first()` | Row pertama |
| Select | `find()` | Berdasarkan ID |
| Select | `value()` | Satu value |
| Select | `pluck()` | Satu kolom |
| Where | `where()` | Kondisi |
| Where | `whereIn()` | IN |
| Where | `whereNull()` | NULL |
| Where | `whereBetween()` | Range |
| Where | `orWhere()` | OR |
| Where | `whereColumn()` | Bandingkan kolom |
| Update | `update()` | Update |
| Update | `increment()` | Tambah angka |
| Update | `decrement()` | Kurangi angka |
| Delete | `delete()` | Hapus row |
| Delete | `truncate()` | Kosongkan tabel |
| Join | `join()` | Inner join |
| Join | `leftJoin()` | Left join |
| Join | `rightJoin()` | Right join |
| Ordering | `orderBy()` | Urutkan |
| Ordering | `latest()` | Terbaru |
| Ordering | `oldest()` | Terlama |
| Paging | `offset()` | Lewati row |
| Paging | `limit()` | Batasi row |
| Paging | `skip()` | Lewati |
| Paging | `take()` | Ambil |
| Batch | `chunk()` | Proses per batch |
| Batch | `chunkById()` | Batch berdasarkan ID |
| Lazy | `lazy()` | Lazy result |
| Lazy | `lazyById()` | Lazy berdasarkan ID |
| Cursor | `cursor()` | Iterasi satu per satu |
| Aggregate | `count()` | Jumlah |
| Aggregate | `sum()` | Total |
| Aggregate | `avg()` | Rata-rata |
| Aggregate | `min()` | Minimum |
| Aggregate | `max()` | Maximum |
| Raw | `DB::raw()` | SQL expression |
| Raw | `selectRaw()` | Raw SELECT |
| Raw | `whereRaw()` | Raw WHERE |
| Group | `groupBy()` | Kelompokkan |
| Group | `having()` | Filter hasil group |
| Lock | `lockForUpdate()` | Lock update |
| Lock | `sharedLock()` | Shared lock |
| Pagination | `paginate()` | Pagination lengkap |
| Pagination | `simplePaginate()` | Pagination sederhana |
| Cursor Pagination | `cursorPaginate()` | Pagination cursor |
| Migration | `make:migration` | Buat migration |
| Migration | `migrate` | Jalankan migration |
| Migration | `migrate:rollback` | Rollback batch |
| Migration | `migrate:reset` | Reset migration |
| Migration | `migrate:refresh` | Refresh |
| Migration | `migrate:fresh` | Drop + migrate |
| Seeder | `make:seeder` | Buat seeder |
| Seeder | `db:seed` | Jalankan seeder |

---

# 35. Cheat Code Database 10 Detik

## DB Facade

```php
use Illuminate\Support\Facades\DB;
```

## Select

```php
DB::table('users')
    ->get();
```

## Where

```php
DB::table('users')
    ->where(
        'active',
        true
    )
    ->get();
```

## Insert

```php
DB::table('users')
    ->insert([
        'name' => 'Budi',
        'email' =>
            'budi@example.com',
    ]);
```

## Update

```php
DB::table('users')
    ->where('id', 1)
    ->update([
        'name' => 'Andi',
    ]);
```

## Delete

```php
DB::table('users')
    ->where('id', 1)
    ->delete();
```

## Join

```php
DB::table('orders')
    ->join(
        'users',
        'orders.user_id',
        '=',
        'users.id'
    )
    ->get();
```

## Sort

```php
DB::table('users')
    ->orderBy(
        'name'
    )
    ->get();
```

## Pagination

```php
DB::table('users')
    ->paginate(10);
```

## Cursor Pagination

```php
DB::table('users')
    ->orderBy('id')
    ->cursorPaginate(10);
```

## Aggregate

```php
DB::table('orders')
    ->sum('total');
```

## Transaction

```php
DB::transaction(
    function () {
        // query...
    }
);
```

## Migration

```bash
php artisan make:migration create_products_table
```

```bash
php artisan migrate
```

## Rollback

```bash
php artisan migrate:rollback
```

## Fresh

```bash
php artisan migrate:fresh
```

## Seeder

```bash
php artisan make:seeder ProductSeeder
```

```bash
php artisan db:seed
```

## Fresh + Seeder

```bash
php artisan migrate:fresh --seed
```

---

# 36. Referensi Resmi

- Laravel Database: https://laravel.com/docs/database
- Laravel Query Builder: https://laravel.com/docs/queries
- Laravel Pagination: https://laravel.com/docs/pagination
- Laravel Migrations: https://laravel.com/docs/migrations
- Laravel Seeding: https://laravel.com/docs/seeding

---

# Pola Belajar Laravel Database

Urutan belajar yang disarankan:

```text
DB::table()
    ↓
SELECT
    ↓
WHERE
    ↓
INSERT
    ↓
UPDATE
    ↓
DELETE
    ↓
JOIN
    ↓
ORDERING
    ↓
PAGING
    ↓
AGGREGATE
    ↓
GROUPING
    ↓
TRANSACTION
    ↓
MIGRATION
    ↓
SEEDING
    ↓
LAZY / CURSOR
    ↓
PAGINATION
```

## 10 Method Query Builder yang Wajib Hafal

Mulai dari:

```php
DB::table()
get()
where()
insert()
update()
delete()
join()
orderBy()
paginate()
```

Kemudian:

```php
chunk()
lazy()
cursor()
count()
sum()
groupBy()
```

## Mental Model

Ingat:

```text
TABLE
 ↓
WHERE
 ↓
JOIN
 ↓
GROUP
 ↓
ORDER
 ↓
LIMIT / OFFSET
 ↓
GET
```

Contoh:

```php
$orders =
    DB::table('orders')
        ->join(
            'users',
            'orders.user_id',
            '=',
            'users.id'
        )
        ->where(
            'orders.status',
            'paid'
        )
        ->select(
            'users.name'
        )
        ->selectRaw(
            'SUM(orders.total) AS total'
        )
        ->groupBy(
            'users.id',
            'users.name'
        )
        ->orderByDesc(
            'total'
        )
        ->get();
```

Baca:

```text
orders
 ↓
JOIN users
 ↓
hanya order paid
 ↓
ambil nama user
 ↓
hitung total
 ↓
group berdasarkan user
 ↓
urutkan total terbesar
 ↓
ambil hasil
```

## Kunci Utama

```text
Migration
→ struktur database

Seeder
→ isi database

DB Facade
→ akses database langsung

Query Builder
→ bangun query secara programatik

Transaction
→ jaga beberapa query sebagai satu kesatuan

Pagination
→ pecah hasil untuk UI

Chunk / Lazy / Cursor
→ proses data besar dengan memory lebih hemat
```
