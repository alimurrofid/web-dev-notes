# Laravel Database Cheatsheet Revised

> **Target:** pemula yang sudah memahami PHP dan Laravel Dasar, lalu ingin memahami database Laravel dan Query Builder sebelum masuk lebih dalam ke Eloquent.
>
> Fokus cheatsheet ini: **database connection & SQLite default → DB Facade → Query Builder CRUD → conditional query → pagination → joins → transactions → query debugging → raw expressions → locking → dataset besar (chunk/lazy/cursor) → migrations → seeding → mini project**.
>
> **Batasan penting:** Eloquent Model adalah topik terpisah. Cheatsheet ini berfokus mendalam pada fondasi database dan Query Builder (`DB::table()`).

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami untuk mulai bekerja dengan database di Laravel

🟡 Lanjutan
→ pelajari setelah query dasar, join, dan pagination sudah nyaman

🔴 Operasional
→ penting saat mengelola skema database dan deployment di server
```

Mental model interaksi database di Laravel:

```text
       Aplikasi Web (Controller / Service)
                     │
                     │ DB::table('products')->where(...)
                     ▼
       Laravel Query Builder (PHP Fluent API)
                     │
                     │ menyusun query & parameter binding aman
                     ▼
       SQL Query Tergenerate (PDO Prepared Statements)
                     │
                     │ eksekusi ke database
                     ▼
       Database Server (SQLite / MySQL / PostgreSQL)
                     │
                     ▼
       Hasil Query (Collection / Objek Data)
```

**Hafalan:**

```text
DB Facade     → akses langsung ke koneksi database & raw SQL
Query Builder → antarmuka PHP untuk membuat query SQL yang aman & ekspresif
Migration     → version control untuk struktur tabel database
Seeder        → pengisi data awal / data contoh ke database
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Laravel Database](#bagian-1)
2. [Konfigurasi Database & Environment](#bagian-2)
3. [DB Facade Dasar](#bagian-3)
4. [Query Builder Dasar](#bagian-4)
5. [Query Builder Insert](#bagian-5)
6. [Query Builder Select & Aggregates](#bagian-6)
7. [Query Builder Where (Filtering)](#bagian-7)
8. [Query Builder Conditional (when)](#bagian-8)
9. [Query Builder Update](#bagian-9)
10. [Query Builder Delete](#bagian-10)
11. [Query Builder Ordering & Grouping](#bagian-11)
12. [Query Builder Paging & Limiting](#bagian-12)
13. [Pagination Otomatis](#bagian-13)
14. [Query Builder Joins](#bagian-14)

### 🟡 Struktur, Reliability & Performa

15. [Database Transactions](#bagian-15)
16. [Debugging Query](#bagian-16)
17. [Raw Expressions (DB::raw)](#bagian-17)
18. [Database Locking](#bagian-18)
19. [Mengelola Dataset Besar: Chunking](#bagian-19)
20. [Mengelola Dataset Besar: Lazy & Cursor](#bagian-20)

### 🟡 Database Schema & Migrations

21. [Database Migration Dasar](#bagian-21)
22. [Membuat & Menjalankan Migration](#bagian-22)
23. [Modifikasi Tabel & Foreign Keys](#bagian-23)
24. [Rollback, Refresh, & Fresh Migration](#bagian-24)
25. [Database Seeding](#bagian-25)
26. [Database Factories (Data Dummy)](#bagian-26)

### 🔴 Operasional & Commands

27. [Database Artisan Commands](#bagian-27)

### 🛠️ Referensi & Praktik

28. [Peta Ingatan Cepat](#bagian-28)
29. [Tabel Ringkasan](#bagian-29)
30. [Cheat Code Database 10 Detik](#bagian-30)
31. [Urutan Belajar yang Disarankan](#bagian-31)
32. [Mini Project: Manajemen Inventaris & Checkout Produk](#bagian-32)
33. [Referensi Resmi](#bagian-33)

---

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan Laravel Database

## Konsep

Laravel menyediakan lapisan abstraksi database yang sangat kuat berbasis **PHP Data Objects (PDO)**. Laravel melindungi aplikasi secara otomatis dari serangan **SQL Injection** menggunakan *prepared statements* dan *parameter binding*.

## Dukungan Database

Laravel mendukung berbagai database driver populer:
- **SQLite** (Default bawaan pada Laravel modern 11 / 12)
- **MySQL** & **MariaDB**
- **PostgreSQL**
- **SQL Server**

## Diagram Alur Eksekusi Database

```text
       Controller Action
              │
              │ DB::table('users')->get()
              ▼
       Query Builder (Penyusun Query)
              │
              │ compile ke SQL + PDO Binding
              ▼
       Database Driver (SQLite / MySQL)
              │
              ▼
       Kumpulan Objek Hasil (Illuminate\Support\Collection)
```

**Hafalan:**

```text
Query Builder bukan database, melainkan API Laravel untuk membuat query SQL secara aman dan terstruktur.
```

---

<a id="bagian-2"></a>

# 2. 🟢 Konfigurasi Database & Environment

## Konsep

Konfigurasi database tersimpan di file **`config/database.php`** dan nilainya diambil secara dinamis dari file **`.env`**.

## 1. Konfigurasi Default SQLite (Laravel Modern)

Pada Laravel 11+, database SQLite aktif secara default tanpa instalasi server database tambahan:

```env
DB_CONNECTION=sqlite
# File database otomatis dibuat di: database/database.sqlite
```

## 2. Konfigurasi MySQL

Jika ingin menggunakan MySQL, ubah pengaturan di `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=belajar_laravel
DB_USERNAME=root
DB_PASSWORD=
```

## 3. Membaca Konfigurasi Database di Kode

```php
// Mengetahui nama koneksi database default yang sedang aktif
$defaultConnection = config('database.default'); // e.g. 'sqlite' atau 'mysql'

// Melihat detail konfigurasi koneksi mysql
$mysqlConfig = config('database.connections.mysql');
```

## 4. Membersihkan Cache Konfigurasi

Jika Anda mengubah nilai di `.env` tetapi belum terbaca:

```bash
php artisan config:clear
```

**Hafalan:**

```text
.env                      → tempat mengatur koneksi database lokal
config/database.php       → konfigurasi resmi koneksi database
php artisan config:clear  → bersihkan cache jika ganti database
```

---

<a id="bagian-3"></a>

# 3. 🟢 DB Facade Dasar

## Konsep

Facade `Illuminate\Support\Facades\DB` menyediakan metode dasar untuk menjalankan query SQL mentah (*raw SQL*) dengan parameter binding yang aman.

## 1. Raw Select (`DB::select`)

```php
use Illuminate\Support\Facades\DB;

// Query dengan parameter binding aman (?)
$users = DB::select('SELECT * FROM users WHERE active = ? AND age >= ?', [1, 18]);

// Query dengan named parameter binding (:name)
$users = DB::select('SELECT * FROM users WHERE email = :email', ['email' => 'budi@example.com']);
```

## 2. Raw Insert (`DB::insert`)

```php
DB::insert('INSERT INTO products (name, price, stock) VALUES (?, ?, ?)', [
    'Laptop Gaming',
    15000000,
    10
]);
```

## 3. Raw Update (`DB::update`)

Mengembalikan jumlah baris (*row count*) yang terpengaruh:

```php
$affectedRows = DB::update('UPDATE products SET stock = ? WHERE id = ?', [20, 1]);
```

## 4. Raw Delete (`DB::delete`)

```php
$deletedRows = DB::delete('DELETE FROM products WHERE stock = ?', [0]);
```

## 5. Perbandingan Alur: Query Builder vs Raw Query

### Alur 1: Raw Query (`DB::select`)

```text
       Aplikasi Web (PHP)
               │
               │ Kirim string SQL mentah lewat koneksi PDO
               ▼
       Mesin Database (PostgreSQL / MySQL)
               │
               ├──> 1. Parsing string SQL langsung di engine
               ├──> 2. Eksekusi langsung pada Disk & Index tabel
               ▼
       Kembalikan Data Mentah (Array / stdClass)
               │
               ▼
       Sangat Cepat & Penggunaan RAM di PHP Sangat Minim
```

### Alur 2: Query Builder (`DB::table`)

```text
       Aplikasi Web (PHP)
               │
               │ 1. Susun objek klausa (chaining: where, join, orderBy) di RAM PHP
               ▼
       Laravel Query Compiler
               │
               │ 2. Compile rantai method PHP menjadi string SQL + bind parameter
               ▼
       Mesin Database (PostgreSQL / MySQL)
               │
               │ 3. Eksekusi query pada Disk & Index tabel
               ▼
       Laravel Response Hydration
               │
               │ 4. Bungkus hasil menjadi objek Collection di RAM PHP
               ▼
       Sangat Fleksibel, Aman & Mudah Dimodifikasi Secara Dinamis
```

## Kapan Memilih Query Builder vs Raw Query?

| Aspek | Query Builder (`DB::table`) | Raw Query (`DB::select`) |
|---|---|---|
| **Alur Pemrosesan** | Disusun & di-compile di RAM PHP → Kirim SQL ke Database | String SQL langsung dikirim ke mesin Database |
| **Beban Memori (RAM)** | Lebih tinggi (membuat objek query & Collection) | Sangat rendah (data mentah langsung dibaca via PDO) |
| **Beban Eksekusi DB** | Dieksekusi setelah kompilasi Query Builder selesai | Langsung dieksekusi oleh mesin database di Disk |
| **Keamanan** | Otomatis aman dari SQL Injection | Wajib menggunakan parameter binding `?` |
| **Kelebihan** | Dinamis (`when()`), sintaks bersih & mudah di-maintain | Kecepatan maksimal untuk kalkulasi berat / query analitik |
| **Kapan Digunakan** | 90% kebutuhan CRUD aplikasi web sehari-hari | Laporan analitik berat, agregasi kompleks, query spesifik DB |

**Hafalan:**

```text
DB::select() → ambil data raw SQL (langsung dieksekusi di database)
DB::insert() → tambah data raw SQL
DB::update() → ubah data raw SQL
DB::delete() → hapus data raw SQL
Selalu gunakan parameter binding (?) pada Raw SQL untuk mencegah SQL Injection!
```

---

<a id="bagian-4"></a>

# 4. 🟢 Query Builder Dasar

## Konsep

**Query Builder** memungkinkan kita menyusun query SQL menggunakan *method chaining* yang bersih, mudah dibaca, dan konsisten di berbagai jenis database.

Akses awal selalu dimulai dengan `DB::table('nama_tabel')`.

## 1. Mengambil Semua Baris (`get`)

Mengembalikan instance `Illuminate\Support\Collection` yang berisi objek PHP standar:

```php
use Illuminate\Support\Facades\DB;

$users = DB::table('users')->get();

foreach ($users as $user) {
    echo $user->name; // Akses kolom sebagai properti objek
}
```

## 2. Mengambil 1 Baris Pertama (`first` & `find`)

```php
// Mengambil row pertama yang cocok
$user = DB::table('users')->where('email', 'budi@example.com')->first();
echo $user?->name;

// Shortcut mencari berdasarkan Primary Key 'id'
$user = DB::table('users')->find(3);
```

## 3. Mengambil Nilai 1 Kolom Saja (`value`)

```php
// Langsung mengembalikan string nilai kolom 'email' (bukan objek)
$email = DB::table('users')->where('id', 1)->value('email');
```

## 4. Mengambil 1 Kolom Menjadi Array (`pluck`)

```php
// Menghasilkan array: ['Budi', 'Andi', 'Siti']
$names = DB::table('users')->pluck('name');

// Menghasilkan array associative dengan key 'id': [1 => 'Budi', 2 => 'Andi']
$userMap = DB::table('users')->pluck('name', 'id');
```

**Hafalan:**

```text
get()   → ambil banyak baris (Collection)
first() → ambil 1 baris pertama (Objek)
find()  → cari 1 baris berdasarkan id
pluck() → ekstrak 1 kolom menjadi array
value() → ambil nilai 1 kolom tunggal
```

---

<a id="bagian-5"></a>

# 5. 🟢 Query Builder Insert

## Konsep

Method `insert()` digunakan untuk menambahkan satu atau banyak baris data baru ke tabel.

## 1. Insert 1 Baris

```php
DB::table('products')->insert([
    'name'  => 'Mouse Wireless',
    'price' => 150000,
    'stock' => 50,
]);
```

## 2. Insert Banyak Baris Sekaligus (Batch Insert)

```php
DB::table('products')->insert([
    ['name' => 'Keyboard Mechanical', 'price' => 500000, 'stock' => 20],
    ['name' => 'Monitor 24 Inch',     'price' => 1800000, 'stock' => 15],
]);
```

## 3. Insert dan Mengambil Auto-Increment ID (`insertGetId`)

```php
$newId = DB::table('products')->insertGetId([
    'name'  => 'Headset Bluetooth',
    'price' => 350000,
    'stock' => 30,
]);

echo "ID Produk Baru: {$newId}";
```

## 4. Upsert (Insert atau Update Otomatis)

Menambahkan data baru, atau memperbarui kolom tertentu jika ada unique key/primary key yang sudah ada di database:

```php
// Parameter: [data], [unique_by_columns], [update_columns]
DB::table('products')->upsert(
    [
        ['id' => 1, 'name' => 'Mouse Wireless V2', 'price' => 175000, 'stock' => 45],
        ['id' => 2, 'name' => 'Webcam HD',         'price' => 300000, 'stock' => 10],
    ],
    ['id'],
    ['price', 'stock']
);
```

**Hafalan:**

```text
insert()       → simpan data baru
insertGetId()  → simpan data & ambil ID barunya
upsert()       → insert jika belum ada, update jika sudah ada
```

---

<a id="bagian-6"></a>

# 6. 🟢 Query Builder Select & Aggregates

## Konsep

Secara default, `get()` mengambil semua kolom (`SELECT *`). Anda dapat memilih kolom tertentu menggunakan `select()` dan menghitung nilai agregat.

## 1. Memilih Kolom Tertentu (`select` & `distinct`)

```php
// SELECT name, price FROM products
$products = DB::table('products')->select('name', 'price')->get();

// Menggunakan alias kolom
$products = DB::table('products')->select('name as product_name', 'price')->get();

// Menghilangkan duplikasi
$categories = DB::table('products')->select('category_id')->distinct()->get();
```

## 2. Fungsi Agregat (Perhitungan Statistik)

```php
// Menghitung total jumlah baris
$totalUsers = DB::table('users')->count();

// Menghitung harga tertinggi & terendah
$maxPrice = DB::table('products')->max('price');
$minPrice = DB::table('products')->min('price');

// Menghitung rata-rata & total nilai
$avgPrice = DB::table('products')->avg('price');
$totalStock = DB::table('products')->sum('stock');
```

## 3. Memeriksa Keberadaan Data (`exists` & `doesntExist`)

Metode ini sangat efisien karena hanya menjalankan query `SELECT EXISTS(...)` tanpa memuat seluruh baris data ke memori:

```php
if (DB::table('orders')->where('user_id', 1)->exists()) {
    echo "User ini sudah pernah melakukan order.";
}

if (DB::table('users')->where('email', 'baru@example.com')->doesntExist()) {
    echo "Email masih tersedia.";
}
```

**Hafalan:**

```text
select('column1', 'column2') → pilih kolom spesifik
count() / sum()              → hitung jumlah / total
exists()                     → cek ada atau tidaknya data secara efisien (true/false)
```

---

<a id="bagian-7"></a>

# 7. 🟢 Query Builder Where (Filtering)

## Konsep

Method `where()` digunakan untuk menyaring baris data berdasarkan kriteria tertentu (klausa `WHERE` pada SQL).

## 1. Where Dasar

```php
// Format: where('kolom', 'operator', 'nilai')
$products = DB::table('products')->where('price', '>=', 500000)->get();

// Jika operatornya sama dengan '=', operator boleh disingkat:
$activeUsers = DB::table('users')->where('status', 'active')->get();
```

## 2. Multiple Where (AND) vs OR Where

```php
// Kondisi AND (status active DAN age >= 18)
$users = DB::table('users')
    ->where('status', 'active')
    ->where('age', '>=', 18)
    ->get();

// Kondisi OR (role admin ATAU role manager)
$staff = DB::table('users')
    ->where('role', 'admin')
    ->orWhere('role', 'manager')
    ->get();
```

## 3. Variasi Helper Where Populer

```php
// 1. Where In (mencocokkan dengan kumpulan array nilai)
$users = DB::table('users')->whereIn('id', [1, 2, 3])->get();
$users = DB::table('users')->whereNotIn('role', ['banned', 'suspended'])->get();

// 2. Where Between (rentang nilai inklusif)
$cheapProducts = DB::table('products')->whereBetween('price', [100000, 500000])->get();

// 3. Where Null / Not Null
$unverifiedUsers = DB::table('users')->whereNull('email_verified_at')->get();
$verifiedUsers = DB::table('users')->whereNotNull('email_verified_at')->get();

// 4. Where Date / Year / Month
$todayOrders = DB::table('orders')->whereDate('created_at', '2026-08-25')->get();
$orders2026 = DB::table('orders')->whereYear('created_at', '2026')->get();
```

**Hafalan:**

```text
where('column', 'value')               → filter kolom = nilai
where('column', 'operator', 'value')   → filter dengan operator pembanding
whereIn('column', [1, 2, 3])           → filter kecocokan array
whereNull('column')                    → filter nilai NULL
```

---

<a id="bagian-8"></a>

# 8. 🟢 Query Builder Conditional (when)

## Konsep

Ketika membangun fitur filter pencarian, query sering kali hanya ditambahkan **jika pengguna mengisi input form tertentu**. Daripada menggunakan blok `if-else` yang memecah rantai query, gunakan method **`when()`**.

## Contoh Penggunaan `when()`

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

public function search(Request $request)
{
    $query = DB::table('products')
        // Klausa ini HANYA dieksekusi jika $request->category memiliki nilai
        ->when($request->filled('category'), function ($q) use ($request) {
            $q->where('category_id', $request->input('category'));
        })
        // Klausa ini HANYA dieksekusi jika $request->min_price memiliki nilai
        ->when($request->filled('min_price'), function ($q) use ($request) {
            $q->where('price', '>=', $request->input('min_price'));
        })
        // Klausa ini HANYA dieksekusi jika $request->search memiliki nilai
        ->when($request->filled('search'), function ($q) use ($request) {
            $q->where('name', 'like', '%' . $request->input('search') . '%');
        });

    return $query->get();
}
```

## Diagram Alur `when()`

```text
       Input User: { search: 'laptop', category: null }
                              │
                              ▼
       ->when(search)   ──> Tambahkan WHERE name LIKE '%laptop%'
                              │
       ->when(category) ──> Dilewati (karena nilainya null)
                              │
                              ▼
       SQL Query Dijalankan Secara Efisien
```

**Hafalan:**

```text
->when($condition, function($query) { $query->where(...); })
→ tambahkan klausa query hanya saat condition bernilai true
```

---

<a id="bagian-9"></a>

# 9. 🟢 Query Builder Update

## Konsep

Method `update()` digunakan untuk memperbarui nilai kolom pada baris yang cocok dengan kriteria `where()`.

## 1. Update Biasa

```php
$affected = DB::table('products')
    ->where('id', 1)
    ->update([
        'price' => 160000,
        'stock' => 40,
    ]);
```

## 2. Update atau Insert Jika Belum Ada (`updateOrInsert`)

```php
// Jika data user_id=10 ditemukan -> update preferensinya
// Jika data user_id=10 TIDAK ada -> buat baris baru
DB::table('user_settings')->updateOrInsert(
    ['user_id' => 10],                     // Kriteria pencarian
    ['theme' => 'dark', 'notifications' => true] // Data yang diupdate / diinsert
);
```

## 3. Increment & Decrement (Menambah/Mengurang Angka)

Sangat berguna untuk mengubah stok barang, saldo, atau jumlah views tanpa menghitung manual di PHP:

```php
// Tambah stok sebanyak 5: UPDATE products SET stock = stock + 5 WHERE id = 1
DB::table('products')->where('id', 1)->increment('stock', 5);

// Kurangi stok sebanyak 1: UPDATE products SET stock = stock - 1 WHERE id = 1
DB::table('products')->where('id', 1)->decrement('stock');
```

**Hafalan:**

```text
update(['column' => 'value'])        → perbarui kolom
updateOrInsert(attributes, values)   → update jika ada, insert jika belum ada
increment('column', amount)          → tambah nilai angka
decrement('column', amount)          → kurangi nilai angka
```

---

<a id="bagian-10"></a>

# 10. 🟢 Query Builder Delete

## Konsep

Method `delete()` menghapus baris tertentu berdasarkan filter `where()`, sedangkan `truncate()` menghapus **seluruh isi tabel** dan mereset ID auto-increment.

## 1. Menghapus Baris Tertentu (`delete`)

```php
// Hapus user yang diblokir
$deletedCount = DB::table('users')
    ->where('status', 'banned')
    ->delete();

// Hapus berdasarkan primary key
DB::table('products')->delete(5);
```

## 2. Mengosongkan Tabel (`truncate`)

```php
// Menghapus SEMUA baris dan me-reset ID auto-increment kembali ke 1
DB::table('activity_logs')->truncate();
```

**Hafalan:**

```text
where(...)->delete() → hapus baris tertentu
truncate()           → kosongkan seluruh tabel & reset ID
```

**Penting:** Selalu sertakan klausa `where()` sebelum memanggil `delete()`. Memanggil `DB::table('users')->delete()` tanpa `where()` akan menghapus semua baris data di tabel!

---

<a id="bagian-11"></a>

# 11. 🟢 Query Builder Ordering & Grouping

## Konsep

Mengatur urutan baris data (`ORDER BY`) dan mengelompokkan data berdasarkan nilai kolom (`GROUP BY`).

## 1. Mengurutkan Data (`orderBy`)

```php
// Urutkan berdasarkan harga termurah (ASC)
$products = DB::table('products')->orderBy('price', 'asc')->get();

// Helper urutan praktis
$newestProducts = DB::table('products')->latest('created_at')->get(); // DESC
$oldestProducts = DB::table('products')->oldest('created_at')->get(); // ASC

// Mengacak urutan (Random)
$randomUsers = DB::table('users')->inRandomOrder()->limit(5)->get();
```

## 2. Grouping & Having (`groupBy` & `having`)

```php
// Menghitung total produk per kategori yang memiliki produk lebih dari 5
$report = DB::table('products')
    ->select('category_id', DB::raw('COUNT(*) as total_products'))
    ->groupBy('category_id')
    ->having('total_products', '>', 5)
    ->get();
```

**Hafalan:**

```text
orderBy('column', 'direction')             → urutkan data ('asc' atau 'desc')
latest('column')                           → urutkan data terbaru (DESC)
groupBy('column')                          → kelompokkan baris
having('column', 'operator', 'value')      → filter hasil agregat group
```

---

<a id="bagian-12"></a>

# 12. 🟢 Query Builder Paging & Limiting

## Konsep

Membatasi jumlah baris yang diambil dari database menggunakan `limit()` dan `offset()`.

## Contoh Penggunaan

```php
// Mengambil 10 baris pertama (LIMIT 10)
$products = DB::table('products')->limit(10)->get();
// atau menggunakan take():
$products = DB::table('products')->take(10)->get();

// Melewati 20 baris pertama dan mengambil 10 baris berikutnya (Paginasi Manual: OFFSET 20 LIMIT 10)
$products = DB::table('products')
    ->offset(20)
    ->limit(10)
    ->get();
// atau menggunakan skip() & take():
$products = DB::table('products')->skip(20)->take(10)->get();
```

**Hafalan:**

```text
limit(amount)  / take(amount) → ambil sebanyak amount baris
offset(amount) / skip(amount) → lewati sebanyak amount baris
```

---

<a id="bagian-13"></a>

# 13. 🟢 Pagination Otomatis

## Konsep

Daripada menghitung limit, offset, dan total halaman secara manual, Laravel menyediakan method **`paginate()`** yang otomatis menghitung seluruh metadata paginasi dan menghasilkan link navigasi halaman.

## 1. Paginasi Standar Bernomor (`paginate`)

```php
use Illuminate\Support\Facades\DB;

public function index()
{
    // Mengambil 15 data per halaman secara otomatis berdasarkan query string ?page=X
    $products = DB::table('products')
        ->orderBy('name')
        ->paginate(15);

    return view('products.index', compact('products'));
}
```

## 2. Menampilkan Link Paginasi di Blade View

```html
<!-- Menampilkan daftar produk -->
<ul>
    @foreach ($products as $product)
        <li>{{ $product->name }} - Rp {{ number_format($product->price) }}</li>
    @endforeach
</ul>

<!-- Merender tombol halaman (Previous, 1, 2, 3, Next) -->
<div class="pagination-links">
    {{ $products->links() }}
</div>
```

## 3. Paginasi Sederhana: `simplePaginate` (Hanya Prev/Next)

Jika tabel memiliki jutaan baris dan Anda tidak membutuhkan nomor total halaman (untuk menghemat query `COUNT(*)`):

```php
// Hanya tombol "Sebelumnya" dan "Berikutnya" (lebih cepat untuk dataset besar)
$products = DB::table('products')->simplePaginate(15);
```

**Hafalan:**

```text
paginate(15)       → paginasi lengkap dengan nomor halaman
simplePaginate(15) → paginasi ringan (hanya tombol Next/Prev)
{{ $data->links() }} → cetak tombol navigasi di Blade
```

---

<a id="bagian-14"></a>

# 14. 🟢 Query Builder Joins

## Konsep

Join digunakan untuk menggabungkan kolom dari dua tabel atau lebih berdasarkan relasi kolom yang sama.

## 1. Inner Join (`join`)

Hanya mengembalikan baris yang memiliki kecocokan di kedua tabel:

```php
$orders = DB::table('orders')
    ->join('users', 'orders.user_id', '=', 'users.id')
    ->select('orders.id', 'orders.total_amount', 'users.name as customer_name', 'users.email')
    ->get();
```

## 2. Left Join (`leftJoin`)

Mengembalikan semua data dari tabel kiri (`orders`), meskipun tidak memiliki data pasangan di tabel kanan (`users`):

```php
$orders = DB::table('orders')
    ->leftJoin('users', 'orders.user_id', '=', 'users.id')
    ->select('orders.id', 'users.name')
    ->get();
```

## Diagram Alur Join

```text
       Tabel 'orders' (user_id = 5)
                     │
                     │ join('users', 'orders.user_id', '=', 'users.id')
                     ▼
       Tabel 'users'  (id = 5, name = 'Budi')
                     │
                     ▼
       Objek Hasil Gabungan: { id: 101, total_amount: 150000, customer_name: 'Budi' }
```

**Hafalan:**

```text
join('other_table', 'first_table.id', '=', 'other_table.foreign_id')
```

---

<a id="bagian-15"></a>

# 15. 🟡 Database Transactions

## Konsep

**Database Transaction** memastikan sekumpulan operasi query dieksekusi secara **atomic** (*All or Nothing*): jika satu query gagal atau terjadi error, **seluruh perubahan otomatis dibatalkan (*rollback*)** sehingga database tidak rusak atau inkonsisten.

## Contoh Kasus: Transfer Saldo Bank

```php
use Illuminate\Support\Facades\DB;

public function transferDana(int $fromUserId, int $toUserId, int $amount)
{
    DB::transaction(function () use ($fromUserId, $toUserId, $amount) {
        // 1. Kurangi saldo pengirim
        DB::table('accounts')->where('user_id', $fromUserId)->decrement('balance', $amount);

        // 2. Tambah saldo penerima
        DB::table('accounts')->where('user_id', $toUserId)->increment('balance', $amount);

        // 3. Catat riwayat mutasi
        DB::table('transactions')->insert([
            'from_user_id' => $fromUserId,
            'to_user_id'   => $toUserId,
            'amount'       => $amount,
            'created_at'   => now(),
        ]);
        
        // Jika ada exception/error di tengah jalan, Laravel otomatis membatalkan seluruh query di atas!
    });
}
```

## Diagram Alur Transaction

```text
       DB::transaction() Dimulai
                 │
                 ├──> 1. Kurangi Saldo Pengirim
                 ├──> 2. Tambah Saldo Penerima
                 ├──> 3. Catat Riwayat Transaksi
                 │
         ┌───────┴───────┐
         │ Sukses        │ Ada Error / Exception
         ▼               ▼
    COMMIT Data     ROLLBACK Otomatis
 (Permanen di DB)  (Database Kembali ke Kondisi Awal)
```

## Manual Transaction

```php
DB::beginTransaction();

try {
    DB::table('users')->delete(1);
    DB::table('orders')->delete(1);

    DB::commit(); // Simpan permanen
} catch (\Exception $e) {
    DB::rollBack(); // Batalkan semua perubahan
    throw $e;
}
```

**Hafalan:**

```text
DB::transaction(function() { ... })
→ operasi aman: commit jika sukses, rollback jika gagal
```

---

<a id="bagian-16"></a>

# 16. 🟡 Debugging Query

## Konsep

Saat mengembangkan fitur, kita sering perlu melihat string SQL asli dan binding nilainya yang dijalankan oleh Laravel.

## 1. Melihat SQL Mentah Beserta Nilai (`ddRawSql` & `dumpRawSql`)

Tersedia di Laravel modern untuk melihat SQL lengkap dengan parameter yang sudah disisipkan:

```php
// Dump SQL dan hentikan eksekusi script (Die & Dump)
DB::table('products')->where('stock', '>', 10)->where('price', '<=', 500000)->ddRawSql();
// Output di layar: SELECT * FROM `products` WHERE `stock` > 10 AND `price` <= 500000
```

## 2. Melihat String SQL Pola (`toSql`)

```php
$sql = DB::table('users')->where('status', 'active')->toSql();
echo $sql; // Output: SELECT * FROM `users` WHERE `status` = ?
```

## 3. Mengaktifkan Log Seluruh Query (`enableQueryLog`)

```php
DB::enableQueryLog();

DB::table('users')->get();
DB::table('products')->where('id', 1)->first();

// Melihat daftar seluruh query yang baru saja dieksekusi beserta waktu eksekusinya
dd(DB::getQueryLog());
```

**Hafalan:**

```text
->ddRawSql()   → cetak query SQL lengkap + nilai binding dan stop script
->toSql()      → ambil string query SQL
DB::getQueryLog() → lihat riwayat seluruh query yang berjalan
```

---

<a id="bagian-17"></a>

# 17. 🟡 Raw Expressions (DB::raw)

## Konsep

Gunakan `DB::raw()` jika Anda membutuhkan ekspresi atau fungsi khusus database (seperti `DATE_FORMAT`, `COUNT(*)`, atau fungsi matematika kustom) yang tidak disediakan oleh Query Builder standar.

## Contoh Pemakaian

```php
use Illuminate\Support\Facades\DB;

// 1. Raw Select (Menghitung total transaksi per user)
$orders = DB::table('orders')
    ->select('user_id', DB::raw('SUM(total_price) as grand_total'))
    ->groupBy('user_id')
    ->get();

// 2. SelectRaw & WhereRaw dengan Parameter Binding Aman
$orders = DB::table('orders')
    ->selectRaw('price * quantity as subtotal')
    ->whereRaw('price * quantity > ?', [1000000])
    ->get();

// 3. OrderByRaw
$users = DB::table('users')
    ->orderByRaw('FIELD(status, "active", "pending", "banned")')
    ->get();
```

**Penting:** Jangan pernah menggabungkan variabel input user langsung dengan concatenation di dalam `DB::raw()`. Selalu gunakan binding parameter `?` pada `whereRaw` untuk mencegah celah SQL Injection!

**Hafalan:**

```text
DB::raw('sql_expression') ──> sisipkan potongan raw SQL
whereRaw('column > ?', [$value]) ──> filter raw SQL dengan parameter binding aman
```

---

<a id="bagian-18"></a>

# 18. 🟡 Database Locking

## Konsep

Locking digunakan untuk mencegah **Race Condition** (dua pengguna mengubah data yang sama persis di detik yang bersamaan, misalnya: dua orang berebut membeli 1 sisa tiket konser).

## 1. Pessimistic Locking: `lockForUpdate()`

Mengunci baris data agar transaksi lain **wajib menunggu** sampai transaksi saat ini selesai di-commit:

```php
DB::transaction(function () {
    // Kunci baris tiket konser ID #99
    $ticket = DB::table('tickets')
        ->where('id', 99)
        ->lockForUpdate()
        ->first();

    if ($ticket->stock > 0) {
        DB::table('tickets')->where('id', 99)->decrement('stock');
        DB::table('bookings')->insert(['ticket_id' => 99, 'user_id' => 1]);
    }
});
```

## 2. Shared Lock: `sharedLock()`

Mengizinkan transaksi lain membaca baris tersebut, tetapi melarang transaksi lain untuk mengubah/mengupdate data sampai transaksi selesai.

**Hafalan:**

```text
lockForUpdate() → kunci baris untuk update eksklusif (anti race condition)
```

---

<a id="bagian-19"></a>

# 19. 🟡 Mengelola Dataset Besar: Chunking

## Konsep

Jika tabel memiliki puluhan ribu hingga jutaan baris, memanggil `get()` akan menyebabkan server kehabisan memori (*Memory Limit Exceeded*). Gunakan **`chunk()`** untuk memproses data dalam potongan-potongan kecil.

## 1. `chunk()` (Hanya untuk Membaca/Export Data)

```php
// Memproses 1.000 data per putaran secara hemat memori
DB::table('users')->orderBy('id')->chunk(1000, function ($users) {
    foreach ($users as $user) {
        // Kirim email atau export...
    }
});
```

## 2. `chunkById()` (WAJIB Digunakan Jika Ada Update/Delete di Dalam Loop)

Jika Anda memperbarui kolom yang menjadi kriteria filter `where()`, `chunk()` biasa akan melewati (*skip*) sebagian baris karena urutan offset-nya bergeser. Gunakan **`chunkById()`**:

```php
// Mengupdate status 1.000 user per putaran tanpa skipping rows
DB::table('users')->where('status', 'pending')->chunkById(1000, function ($users) {
    foreach ($users as $user) {
        DB::table('users')->where('id', $user->id)->update(['status' => 'processed']);
    }
});
```

## Diagram Alur Chunking

```text
       Tabel 100.000 Baris Data
                 │
                 ├──> Ambil 1.000 Baris Pertama ──> Proses & Kosongkan Memori
                 ├──> Ambil 1.000 Baris Kedua   ──> Proses & Kosongkan Memori
                 ├──> Ambil 1.000 Baris Ketiga  ──> Proses & Kosongkan Memori
                 └──> Selesai (Penggunaan Memori Tetap Ringan)
```

**Hafalan:**

```text
chunk(1000, callback)     → proses data besar bertahap
chunkById(1000, callback) → WAJIB jika ada update data di dalam loop
```

---

<a id="bagian-20"></a>

# 20. 🟡 Mengelola Dataset Besar: Lazy & Cursor

## Konsep

Selain chunking, Laravel menyediakan **`lazy()`** dan **`cursor()`** yang memanfaatkan fitur *PHP Generators* (`yield`) untuk mengalirkan (*stream*) baris data satu per satu dengan konsumsi RAM yang sangat minim.

## 1. Lazy Collection (`lazy()`)

Mengambil data per-batch (misal 1.000 per request SQL), tetapi di-loop seperti array tunggal biasa:

```php
// Menghasilkan instance LazyCollection
$users = DB::table('users')->lazy(1000);

foreach ($users as $user) {
    echo $user->name;
}
```

## 2. Cursor (`cursor()`)

Hanya menjalankan **1 kali query SQL tunggal** dan menahan kursor PDO aktif untuk mengalirkan 1 baris record setiap kali loop berjalan (hanya 1 objek user di memori pada satu waktu):

```php
$users = DB::table('users')->where('active', 1)->cursor();

foreach ($users as $user) {
    // Memproses data satu per satu
}
```

**Hafalan:**

```text
lazy()   → chunking otomatis berbasis LazyCollection
cursor() → streaming PDO langsung 1 per 1 (RAM paling hemat)
```

---

<a id="bagian-21"></a>

# 21. 🟡 Database Migration Dasar

## Konsep

**Migration** adalah *version control* untuk database. Migration memungkinkan tim pengembang mendefinisikan, mengubah, dan berbagi skema tabel database secara konsisten di seluruh lingkungan development dan server produksi.

## Struktur File Migration

Setiap migration memiliki dua method utama:
1. **`up()`**: Menjalankan perubahan skema (membuat tabel/kolom baru).
2. **`down()`**: Membatalkan (*rollback*) apa yang dilakukan oleh method `up()`.

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Anonymous class migration (Standar Laravel modern)
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps(); // Menghasilkan kolom created_at & updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
```

**Hafalan:**

```text
up()   → eksekusi perubahan skema tabel
down() → batalkan / hapus perubahan skema tabel
```

---

<a id="bagian-22"></a>

# 22. 🟡 Membuat & Menjalankan Migration

## Konsep

Laravel menyediakan command Artisan untuk menghasilkan file migration di folder `database/migrations/`.

## 1. Membuat Migration Baru

```bash
# Membuat tabel baru 'products'
php artisan make:migration create_products_table

# Membuat migration untuk mengubah tabel yang sudah ada
php artisan make:migration add_stock_to_products_table
```

## 2. Tipe-Tipe Kolom Blueprint yang Sering Digunakan

```php
Schema::create('products', function (Blueprint $table) {
    $table->id();                                    // BigAutoIncrement Primary Key 'id'
    $table->string('name', 100);                     // VARCHAR(100)
    $table->text('description')->nullable();         // TEXT (Boleh NULL)
    $table->decimal('price', 12, 2);                 // DECIMAL(12, 2) untuk mata uang
    $table->integer('stock')->default(0);            // INT dengan nilai default 0
    $table->boolean('is_active')->default(true);     // TINYINT(1) / BOOLEAN
    $table->enum('status', ['draft', 'published']);  // ENUM
    $table->json('attributes')->nullable();          // JSON
    $table->date('release_date')->nullable();        // DATE
    $table->timestamps();                            // created_at & updated_at
});
```

## 3. Menjalankan Migration

```bash
# Mengeksekusi semua migration yang belum berjalan
php artisan migrate
```

**Hafalan:**

```text
php artisan make:migration create_nama_table → buat file migration
php artisan migrate → eksekusi skema ke database
```

---

<a id="bagian-23"></a>

# 23. 🟡 Modifikasi Tabel & Foreign Keys

## Konsep

Jangan pernah mengubah file migration yang sudah pernah dijalankan di server production. Selalu buat file migration baru untuk menambah kolom, menghapus kolom, atau membuat relasi Foreign Key.

## 1. Menambah & Menghapus Kolom di Tabel yang Ada

```bash
php artisan make:migration add_avatar_to_users_table
```

```php
public function up(): void
{
    Schema::table('users', function (Blueprint $table) {
        // Tambahkan kolom baru 'avatar' setelah kolom 'email'
        $table->string('avatar')->nullable()->after('email');
    });
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('avatar');
    });
}
```

## 2. Foreign Key Modern (`foreignId`)

Cara mendefinisikan relasi kunci asing (*Foreign Key*) dengan rapi:

```php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    // Otomatis merujuk ke kolom 'id' pada tabel 'users' + cascade on delete
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('title');
    $table->timestamps();
});
```

**Hafalan:**

```text
$table->foreignId('user_id')->constrained()->cascadeOnDelete();
→ buat kolom foreign key yang otomatis menghapus data anak jika induk dihapus
```

---

<a id="bagian-24"></a>

# 24. 🟡 Rollback, Refresh, & Fresh Migration

## Konsep

Laravel menyediakan berbagai perintah untuk membatalkan atau menyetel ulang seluruh tabel database.

## Perintah Rollback & Reset

```bash
# 1. Rollback: Membatalkan BATCH migration terakhir saja
php artisan migrate:rollback

# 2. Rollback beberapa langkah ke belakang
php artisan migrate:rollback --step=2

# 3. Reset: Membatalkan SEMUA migration dari awal
php artisan migrate:reset

# 4. Refresh: Rollback semua migration lalu jalankan kembali dari awal
php artisan migrate:refresh

# 5. Fresh (Paling Sering Digunakan di Lokal): Hapus SEMUA tabel lalu migrate dari nol
php artisan migrate:fresh

# 6. Fresh sekaligus isi data seeder
php artisan migrate:fresh --seed
```

## Diagram Perbedaan Rollback vs Fresh

```text
migrate:rollback ──> Menjalankan method down() pada batch terakhir
migrate:fresh    ──> Langsung DROP seluruh tabel database ──> Jalankan up() dari awal
```

**Penting:** Perintah `migrate:fresh` menghapus seluruh data tabel tanpa ampun! Hanya gunakan di komputer lokal development, jangan jalankan di server production.

**Hafalan:**

```text
migrate:rollback → batalkan batch terakhir
migrate:fresh --seed → reset total database & isi ulang data dummy
```

---

<a id="bagian-25"></a>

# 25. 🟡 Database Seeding

## Konsep

**Seeder** digunakan untuk mengisi data awal (seperti akun administrator, master data provinsi/kategori) atau data testing ke dalam database.

## 1. Membuat Seeder via Artisan

```bash
php artisan make:seeder CategorySeeder
```

## 2. Mengisi Data di `database/seeders/CategorySeeder.php`

```php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('categories')->insert([
            ['name' => 'Elektronik', 'slug' => 'elektronik'],
            ['name' => 'Pakaian',    'slug' => 'pakaian'],
            ['name' => 'Buku',       'slug' => 'buku'],
        ]);
    }
}
```

## 3. Mendaftarkan Seeder di `DatabaseSeeder.php`

File `database/seeders/DatabaseSeeder.php` adalah pintu masuk utama seluruh seeder:

```php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            // SeederLain::class,
        ]);
    }
}
```

## 4. Menjalankan Seeder

```bash
# Menjalankan DatabaseSeeder utama
php artisan db:seed

# Menjalankan seeder spesifik
php artisan db:seed --class=CategorySeeder
```

**Hafalan:**

```text
php artisan make:seeder NamaSeeder → buat class seeder
php artisan db:seed → jalankan seluruh seeder
```

---

<a id="bagian-26"></a>

# 26. 🟡 Database Factories (Data Dummy)

## Konsep

Untuk mengisi puluhan atau ribuan data contoh secara otomatis untuk keperluan testing, gunakan **Model Factories** bersama library Faker.

## 1. Membuat Factory

```bash
php artisan make:factory ProductFactory
```

## 2. Definisi Blueprint Factory (`database/factories/ProductFactory.php`)

```php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'        => fake()->words(3, true),
            'price'       => fake()->numberBetween(10000, 500000),
            'stock'       => fake()->numberBetween(1, 100),
            'description' => fake()->paragraph(),
            'created_at'  => now(),
        ];
    }
}
```

## 3. Menggunakan Factory di Seeder / Test

```php
// Menghasilkan 50 data produk acak langsung ke database
\App\Models\Product::factory()->count(50)->create();
```

**Hafalan:**

```text
Factory + Faker ──> membuat ratusan data dummy realistis secara otomatis
```

---

<a id="bagian-27"></a>

# 27. 🔴 Database Artisan Commands

## Konsep

Laravel menyediakan rangkaian command Artisan untuk memeriksa kesehatan, status, dan struktur database secara interaktif.

## Daftar Command Esensial

```bash
# Melihat status seluruh file migration (sudah run / pending)
php artisan migrate:status

# Melihat ringkasan database (driver, ukuran database, daftar tabel)
php artisan db:show

# Melihat detail struktur kolom dan index pada tabel tertentu
php artisan db:table products

# Masuk ke CLI database interaktif (sqlite / mysql shell)
php artisan db

# Menghapus seluruh tabel dan view di database
php artisan db:wipe
```

**Hafalan:**

```text
php artisan migrate:status → cek file migration mana yang belum jalan
php artisan db:show        → lihat ringkasan ukuran & tabel database
php artisan db:table nama  → periksa struktur kolom suatu tabel
```

---

<a id="bagian-28"></a>

# 28. 🛠️ Peta Ingatan Cepat

## A. Alur Lengkap Operasi Database

```text
       HTTP Request di Controller
                   │
                   ▼
       Inisialisasi Query: DB::table('orders')
                   │
                   │ Rantai Klausa (Chaining)
                   ├──> ->where() / ->when()  (Penyaringan Data)
                   ├──> ->join()              (Penggabungan Tabel)
                   └──> ->orderBy()           (Pengurutan)
                   │
                   ▼
       ┌───────────────────────────────────────────────┐
       │            Pilihan Eksekutor Akhir            │
       └───────┬───────────────┬───────────────┬───────┘
               │               │               │
               ▼               ▼               ▼
             get()        paginate()        count()
               │               │               │
               ▼               ▼               ▼
          Collection        Paginasi         Nilai
         (Banyak Row)    (Navigasi Blade)   Tunggal
```

## B. Siklus Transaksi Database (Atomic)

```text
            DB::beginTransaction()
                        │
                        ├──> Operasi 1: Kurangi Stok Produk
                        ├──> Operasi 2: Simpan Riwayat Order
                        │
                ┌───────┴───────┐
       Berhasil │               │ Gagal / Exception
                ▼               ▼
            DB::commit()    DB::rollBack()
```

## C. Alur Pengelolaan Skema Database

```text
       make:migration
             │
             │ tulis method up() & down()
             ▼
       php artisan migrate
             │
             │ skema tabel terbentuk di database
             ▼
       php artisan db:seed (Isi Master Data)
```

---

<a id="bagian-29"></a>

# 29. 📚 Tabel Ringkasan

| Materi | Konsep / API Utama | Fungsi & Kegunaan |
|---|---|---|
| Koneksi | `DB::connection()` | Memilih koneksi database |
| Inisialisasi Query | `DB::table('users')` | Memulai pembuatan Query Builder |
| Ambil Banyak | `get()` | Mengambil kumpulan baris data (Collection) |
| Ambil Satu | `first()`, `find(id)` | Mengambil satu objek baris data |
| Filter Data | `where()`, `whereIn()` | Menyaring baris berdasarkan kriteria |
| Filter Kondisional | `when($cond, callback)` | Menambahkan filter hanya jika kondisi terpenuhi |
| Insert Data | `insert()`, `insertGetId()` | Menyimpan data baru |
| Update Data | `update()`, `increment()` | Memperbarui data kolom |
| Delete Data | `delete()`, `truncate()` | Menghapus baris atau mengosongkan tabel |
| Pengurutan | `orderBy()`, `latest()` | Mengurutkan baris data |
| Paginasi | `paginate()`, `links()` | Paginasi otomatis beserta link navigasi Blade |
| Gabung Tabel | `join()`, `leftJoin()` | Menggabungkan relasi antar tabel |
| Transaksi | `DB::transaction()` | Menjamin eksekusi query secara aman (*all or nothing*) |
| Debugging | `ddRawSql()`, `toSql()` | Menampilkan query SQL yang dieksekusi |
| Dataset Besar | `chunkById()`, `cursor()` | Memproses ribuan data tanpa kehabisan RAM |
| Migration | `make:migration`, `migrate`| Version control skema tabel database |
| Rollback | `migrate:rollback`, `fresh` | Membatalkan / me-reset tabel database |
| Seeder | `make:seeder`, `db:seed` | Mengisi data master / awal ke database |

---

<a id="bagian-30"></a>

# 30. ⚡ Cheat Code Database 10 Detik

```text
DB::table('products')->get()             → Ambil semua data
DB::table('products')->where('id', 1)    → Filter kriteria
DB::table('products')->insert([...])     → Tambah data baru
DB::table('products')->update([...])     → Ubah data
DB::table('products')->delete()          → Hapus data
DB::table('products')->paginate(10)      → Paginasi otomatis
DB::transaction(function() { ... })      → Transaksi aman
php artisan migrate                      → Jalankan migrasi tabel
php artisan db:seed                      → Isi data awal
```

Contekan Query Lengkap:

```php
$products = DB::table('products')
    ->select('id', 'name', 'price', 'stock')
    ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%"))
    ->where('stock', '>', 0)
    ->orderBy('price', 'asc')
    ->paginate(15);
```

---

<a id="bagian-31"></a>

# 31. 🧭 Urutan Belajar yang Disarankan

```text
1. 🟢 Fondasi Database & Koneksi
   ├─ Pahami konfigurasi .env & SQLite default di Laravel 11/12
   ├─ Menggunakan DB Facade untuk query SQL dasar
   └─ Menggunakan Query Builder dasar (get, first, find, value, pluck)
2. 🟢 Operasi CRUD & Filtering
   ├─ Melakukan Insert (insert, insertGetId, upsert)
   ├─ Menyaring data dengan Where & WhereIn
   ├─ Menggunakan When() untuk filter dinamis pencarian
   ├─ Melakukan Update, Increment, Decrement, dan Delete
   └─ Mengurutkan data (orderBy, latest) & Paginasi (paginate)
3. 🟡 Hubungan Tabel, Transaksi & Optimasi
   ├─ Menggabungkan tabel dengan Join & LeftJoin
   ├─ Menjaga integritas data dengan Database Transactions
   ├─ Melakukan Debugging Query (ddRawSql, toSql)
   ├─ Memproses dataset besar dengan chunkById() & cursor()
   └─ Mengatur skema database dengan Migrations & Seeders
4. 🔴 Penerapan Nyata
   └─ Mengerjakan Mini Project Manajemen Inventaris & Checkout
```

---

<a id="bagian-32"></a>

# 32. 🏗️ Mini Project: Manajemen Inventaris & Checkout Produk

Mini project ini menggabungkan: **Migration, Seeding, Query Builder dengan filter dinamis `when()`, Pagination, dan Database Atomic Transaction**.

## 1. Migration Tabel Produk & Transaksi

```php
// database/migrations/2026_01_01_000001_create_store_tables.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price', 12, 2);
            $table->integer('stock')->default(0);
            $table->timestamps();
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->integer('quantity');
            $table->decimal('total_price', 12, 2);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('orders');
        Schema::dropIfExists('products');
    }
};
```

## 2. Seeder Data Awal

```php
// database/seeders/ProductSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder {
    public function run(): void {
        DB::table('products')->insert([
            ['name' => 'Laptop ThinkPad', 'price' => 12000000, 'stock' => 10, 'created_at' => now()],
            ['name' => 'Mouse Logitech',  'price' => 250000,   'stock' => 50, 'created_at' => now()],
            ['name' => 'Monitor LG 24"',  'price' => 1800000,  'stock' => 15, 'created_at' => now()],
        ]);
    }
}
```

## 3. Controller (`app/Http/Controllers/ProductController.php`)

```php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    // Menampilkan katalog produk dengan filter & paginasi
    public function index(Request $request)
    {
        $products = DB::table('products')
            ->when($request->filled('search'), function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->input('search') . '%');
            })
            ->where('stock', '>', 0)
            ->orderBy('price', 'asc')
            ->paginate(10)
            ->withQueryString();

        return view('products.index', compact('products'));
    }

    // Memproses checkout secara aman dengan Transaction
    public function checkout(Request $request)
    {
        $request->validate([
            'product_id' => ['required', 'integer'],
            'quantity'   => ['required', 'integer', 'min:1'],
        ]);

        $productId = $request->input('product_id');
        $qty = $request->input('quantity');

        DB::transaction(function () use ($productId, $qty) {
            // 1. Ambil data produk dengan kunci lockForUpdate
            $product = DB::table('products')->where('id', $productId)->lockForUpdate()->first();

            if (!$product || $product->stock < $qty) {
                throw new \Exception('Stok produk tidak mencukupi!');
            }

            // 2. Kurangi stok produk
            DB::table('products')->where('id', $productId)->decrement('stock', $qty);

            // 3. Catat order transaksi
            DB::table('orders')->insert([
                'product_id'  => $productId,
                'quantity'    => $qty,
                'total_price' => $product->price * $qty,
                'created_at'  => now(),
            ]);
        });

        return redirect()->route('products.index')->with('success', 'Checkout berhasil diproses!');
    }
}
```

## Output Tampilan Mini Project

```text
Katalog Produk (Stok Tersedia)

[ Cari produk...               ] [ Filter ]

• Laptop ThinkPad  - Rp 12.000.000 (Sisa Stok: 9)  [ Beli 1 ]
• Monitor LG 24"   - Rp 1.800.000  (Sisa Stok: 15) [ Beli 1 ]
• Mouse Logitech   - Rp 250.000    (Sisa Stok: 50) [ Beli 1 ]

Halaman 1 dari 1 [ < Sebelumnya ] [ Berikutnya > ]
```

## Diagram Alur Mini Project

```text
       User Beli Produk (Product ID #1, Qty: 1)
                         │
                         ▼
       DB::transaction() Dimulai
                         │
                         ├──> 1. Kunci Baris Produk (lockForUpdate)
                         ├──> 2. Validasi Ketersediaan Stok (Stok >= 1)
                         ├──> 3. Kurangi Stok Produk (decrement)
                         ├──> 4. Insert ke Tabel 'orders'
                         │
                         ▼
       COMMIT Transaksi ──> Redirect dengan Flash Message Sukses
```

**Kunci:** Alur Query Builder + Paginasi + Transaksi Atomic adalah fondasi utama pengembangan sistem backend yang handal.

---

<a id="bagian-33"></a>

# 33. 🔗 Referensi Resmi

- [Laravel Database — Official Documentation](https://laravel.com/docs/database)
- [Laravel Query Builder Guide](https://laravel.com/docs/queries)
- [Database Migrations Guide](https://laravel.com/docs/migrations)
- [Database Seeding Guide](https://laravel.com/docs/seeding)
- [Database Pagination Documentation](https://laravel.com/docs/pagination)
