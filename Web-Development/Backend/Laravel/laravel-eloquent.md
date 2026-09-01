---
title: "Laravel Eloquent ORM"
description: "Eloquent ORM mendalam: Model, CRUD, Mass Assignment, Relationships (1-1, 1-N, N-N, Morph), Eager Loading (anti N+1), Scopes, Casting, dan Observers."
order: 3
tags:
  - web-development
  - backend
  - laravel
  - eloquent
  - orm
---

# Laravel Eloquent ORM

> **Target:** pemula yang sudah memahami Laravel Dasar, konsep database/migration, dan dasar Collection, lalu ingin menguasai Eloquent ORM secara mendalam dari nol hingga mahir.
> **Versi:** Laravel 11 / 12
> **Prasyarat:** [[laravel-database|Laravel Database]]
> Fokus modul pembelajaran ini: **Model & konvensi tabel → CRUD lengkap → Mass Assignment → Timestamps → Default attributes → Query Builder dari Model → Eloquent Collection → Soft Deletes → Global & Local Scopes → Seluruh tipe Relasi (1-to-1, 1-to-Many, Many-to-Many, Intermediate Table, Custom Pivot Model) → Querying & Aggregating Relations → Eager Loading (solusi N+1) → UUID & ULID → Casting Modern (`casts()` method) → Modern Accessors & Mutators → Model Events & Observers → Serialization → Model Factories & Seeding → Has One of Many → Has Through → Polymorphic Relations lengkap → Morph Map → Custom Casts → Model Pruning → Mini Project E-Commerce**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami untuk mulai bekerja dengan model, CRUD, mass assignment, dan query builder

🟡 Core Eloquent & Relationships
→ pelajari relasi antar tabel, eager loading (anti N+1), scopes, casting modern, dan lifecycle

🔴 Advanced Relationships & Operasional
→ penting ketika struktur relasi aplikasi semakin kompleks (Through, Polymorphic, Custom Casts, Pruning)
```

Mental model interaksi Eloquent ORM:

```text
       Aplikasi Web (Controller / Service Layer)
                         │
                         │ User::with('orders')->where('is_active', true)->get()
                         ▼
       Eloquent Model (Layer Pemetaan Objek PHP)
                         │
                         │ memetakan relasi & menyusun query via Query Builder
                         ▼
       Laravel Database Engine (PDO Prepared Statements)
                         │
                         │ compile ke SQL aman & binding parameter
                         ▼
       Database Server (SQLite / MySQL / PostgreSQL / SQL Server)
                         │
                         │ eksekusi pada tabel & index penyimpanan
                         ▼
       Hasil Query Dibungkus ke Eloquent Collection (Objek Model Terhidrasi)
```

**Hafalan:**

```text
Model         → representasi 1 tabel database sebagai class PHP
Instance      → representasi 1 baris record data sebagai objek PHP
Collection    → kumpulan banyak objek model hasil query di dalam RAM
Relationship  → relasi antar tabel yang didefinisikan sebagai method model
Query Builder → penyusun query SQL berantai sebelum dieksekusi ke database
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Model & Konvensi Tabel](#bagian-1)
2. [Insert Data](#bagian-2)
3. [Find & Select Data](#bagian-3)
4. [Update Data](#bagian-4)
5. [Delete Data](#bagian-5)
6. [Delete Many & Truncate](#bagian-6)
7. [Mass Assignment Protection](#bagian-7)
8. [Timestamps Management](#bagian-8)
9. [Default Attribute Values](#bagian-9)
10. [Query Builder dari Model](#bagian-10)
11. [Eloquent Collection](#bagian-11)

### 🟡 Core Eloquent & Relationships

12. [Soft Deletes](#bagian-12)
13. [Query Scope: Konsep Reusable Query](#bagian-13)
14. [Query Global Scope](#bagian-14)
15. [Query Local Scope](#bagian-15)
16. [Konsep Dasar Relasi (Relationships)](#bagian-16)
17. [One to One Relationship](#bagian-17)
18. [One to Many Relationship](#bagian-18)
19. [Many to Many Relationship](#bagian-19)
20. [Intermediate Table & Kolom Pivot](#bagian-20)
21. [Pivot Model](#bagian-21)
22. [Querying Relations](#bagian-22)
23. [Aggregating Relations](#bagian-23)
24. [Lazy vs Eager Loading (Solusi N+1 Problem)](#bagian-24)
25. [UUID & ULID Primary Keys](#bagian-25)
26. [Attribute Casting Modern](#bagian-26)
27. [Accessors dan Mutators Modern](#bagian-27)
28. [Model Events & Observers](#bagian-28)
29. [Serialization Data](#bagian-29)
30. [Model Factories & Seeding](#bagian-30)

### 🔴 Advanced Relationships & Operasional

31. [Has One of Many](#bagian-31)
32. [Has One Through](#bagian-32)
33. [Has Many Through](#bagian-33)
34. [Polymorphic Relationships: Konsep & Schema](#bagian-34)
35. [One to One Polymorphic](#bagian-35)
36. [One to Many Polymorphic](#bagian-36)
37. [One of Many Polymorphic](#bagian-37)
38. [Many to Many Polymorphic](#bagian-38)
39. [Polymorphic Types & Morph Map](#bagian-39)
40. [Custom Casts](#bagian-40)
41. [Model Pruning & Touch Parent](#bagian-41)

### 🛠️ Referensi & Praktik

42. [Peta Ingatan Cepat](#bagian-42)
43. [Tabel Ringkasan](#bagian-43)
44. [Cheat Code Eloquent 10 Detik](#bagian-44)
45. [Urutan Belajar yang Disarankan](#bagian-45)
46. [Mini Project: E-Commerce Catalog, Order Management & Review System](#bagian-46)
47. [Referensi Resmi](#bagian-47)

---

<a id="bagian-1"></a>

## 1. 🟢 Model & Konvensi Tabel

#### Konsep

Setiap class Model di Eloquent merepresentasikan satu tabel database. Eloquent menggunakan prinsip *Convention over Configuration*:
- **Nama Tabel**: Singular PascalCase (`Product`) otomatis dipetakan ke tabel Plural snake_case (`products`).
- **Primary Key**: Default kolom `id` berupa auto-incrementing integer.
- **Timestamps**: Default menganggap kolom `created_at` dan `updated_at` ada.

### 1. Membuat Model via Artisan

```bash
# Membuat Model saja di app/Models/Product.php
php artisan make:model Product

# Membuat Model sekaligus Migration
php artisan make:model Product -m

# Membuat Model lengkap (Migration, Factory, Seeder, Controller)
php artisan make:model Product -all
```

### 2. Struktur Model Dasar (`app/Models/Product.php`)

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    // Konvensi default: Tabel otomatis 'products', Primary Key 'id'
}
```

### 3. Menimpa Konvensi Default (*Custom Configuration*)

Jika struktur database warisan (*legacy*) tidak mengikuti konvensi Laravel, kita dapat menimpanya dengan properti model:

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    // 1. Kustom nama tabel (jika bukan 'products')
    protected $table = 'tb_produk';

    // 2. Kustom nama primary key (jika bukan 'id')
    protected $primaryKey = 'product_code';

    // 3. Jika primary key bukan auto-incrementing integer (misal string/kode unik)
    public $incrementing = false;
    protected $keyType = 'string';

    // 4. Kustom nama koneksi database (jika multi-database)
    protected $connection = 'pgsql';
}
```

#### Cara Kerja

```text
       Nama Class Model: Product
                 │
                 │ Pluralize + Snake Case
                 ▼
       Nama Tabel Database: products
                 │
                 │ Primary Key Default
                 ▼
       Kolom Identitas: id (Auto Increment BigInt)
```

**Hafalan:**

```text
Product model       → products table
Flight model        → flights table
OrderItem model     → order_items table
$table = 'name'     → menimpa nama tabel default
$primaryKey = 'key' → menimpa nama kolom primary key default
```

#### Best Practice

- Selalu gunakan nama model bentuk tunggal dalam format PascalCase (misal `Category`, `OrderDetail`).
- Buat migration bersamaan dengan model menggunakan flag `-m` (`php artisan make:model Product -m`).

#### Kesalahan Umum

❌ Memberi nama class model bentuk jamak seperti `class Products extends Model`. Ini akan membuat Eloquent mencari tabel `products` yang rancu atau `products_s`.

✅ Beri nama class bentuk tunggal `class Product extends Model`.

---

<a id="bagian-2"></a>

## 2. 🟢 Insert Data

#### Konsep

Memasukkan data baru ke database menggunakan Eloquent dapat dilakukan dengan beberapa pendekatan:
1. `create()`: Menyimpan array data sekaligus (membutuhkan proteksi Mass Assignment `$fillable`).
2. `new Model()` + `save()`: Membuat objek, mengisi properti satu per satu, lalu menyimpan ke database.
3. `forceCreate()`: Insert data langsung dengan mengabaikan proteksi Mass Assignment.
4. `firstOrCreate()` / `firstOrNew()`: Mencari data yang ada; jika belum ada, buat baru.
5. `updateOrCreate()`: Update data jika cocok dengan kriteria; jika tidak ada, insert baru.

### 1. Menggunakan `create()` (Paling Umum)

```php
use App\Models\Product;

// Membutuhkan konfigurasi $fillable pada Model Product
$product = Product::create([
    'name'  => 'Mechanical Keyboard',
    'price' => 750000,
    'stock' => 25,
]);

echo $product->id; // ID otomatis tersedia setelah berhasil di-insert
```

### 2. Menggunakan `new Model()` + `save()`

```php
$product = new Product();
$product->name = 'Wireless Mouse';
$product->price = 250000;
$product->stock = 50;
$product->save(); // Menjalankan query INSERT SQL
```

### 3. Menggunakan `forceCreate()`

```php
// Digunakan saat proses internal yang terpercaya (misal Seeder / Job Worker)
$product = Product::forceCreate([
    'name'      => 'Monitor 4K',
    'price'     => 4500000,
    'is_admin'  => true, // Melewati pembatasan $fillable
]);
```

### 4. Menggunakan `firstOrCreate()` & `firstOrNew()`

```php
// firstOrCreate: cari berdasarkan kriteria; jika tidak ada, langsung insert ke DB
$product = Product::firstOrCreate(
    ['name' => 'Monitor 24 Inch'], // Kriteria pencarian
    ['price' => 1800000, 'stock' => 10] // Data tambahan saat insert
);

// firstOrNew: cari berdasarkan kriteria; jika tidak ada, buat instance objek (belum save)
$newProduct = Product::firstOrNew(
    ['name' => 'Desk Mat'],
    ['price' => 150000]
);
$newProduct->save(); // Simpan manual saat siap
```

### 5. Menggunakan `updateOrCreate()`

```php
// Cari berdasarkan SKU; jika ketemu maka update price, jika belum ada maka insert
$product = Product::updateOrCreate(
    ['sku' => 'KB-MECH-01'],
    ['name' => 'Mechanical Keyboard RGB', 'price' => 800000]
);
```

#### Output

```text
ID Produk Baru: 1
Nama: Mechanical Keyboard
Harga: Rp 750.000
Created At: 2026-08-25 20:00:00
```

#### Cara Kerja

```text
       Array Data Input
              │
              ▼
       Pemeriksaan $fillable (Mass Assignment Check)
              │
              ▼
       Generate Query: INSERT INTO products (...) VALUES (...)
              │
              ▼
       Hydrate Instance Model (ID dan Timestamps Terisi Otomatis)
```

**Hafalan:**

```text
Model::create(attributes)                      → insert langsung (wajib $fillable)
new Model() + ->save()                         → isi properti objek lalu simpan
Model::forceCreate(attributes)                 → insert mengabaikan proteksi $fillable
Model::firstOrCreate(condition, attributes)    → ambil jika ada, insert jika belum ada
Model::firstOrNew(condition, attributes)       → ambil jika ada, buat objek baru jika belum ada
Model::updateOrCreate(condition, attributes)   → perbarui jika ada, insert jika belum ada
```

#### Best Practice

- Gunakan `Model::create()` untuk form input standar controller yang sudah divalidasi.
- Gunakan `updateOrCreate()` untuk proses sinkronisasi data API atau import Excel agar terhindar dari duplikasi data.

#### Kesalahan Umum

❌ Memanggil `Product::create($request->all())` tanpa mendefinisikan `$fillable` pada Model (akan melempar `MassAssignmentException`).

✅ Definisikan `$fillable` pada Model terlebih dahulu.

---

<a id="bagian-3"></a>

## 3. 🟢 Find & Select Data

#### Konsep

Eloquent menyediakan berbagai method ekspresif untuk mengambil satu atau banyak record model berdasarkan Primary Key maupun kriteria filter kolom.

### 1. Mengambil Berdasarkan Primary Key (`find`, `findOrFail`, `findMany`)

```php
use App\Models\Product;

// 1. find(): Mengembalikan instance Model atau null jika tidak ditemukan
$product = Product::find(1);

// 2. findOrFail(): Melempar ModelNotFoundException (HTTP 404) jika ID tidak ditemukan
$product = Product::findOrFail(1);

// 3. findMany(): Mengambil banyak model sekaligus berdasarkan array ID
$products = Product::findMany([1, 2, 3]);

// 4. findOr(): Mengambil model, atau mengeksekusi closure jika tidak ada
$product = Product::findOr(999, function () {
    return 'Produk cadangan default';
});
```

### 2. Mengambil 1 Record Pertama (`first`, `firstOrFail`, `firstWhere`, `sole`)

```php
// 1. first(): Mengambil baris pertama yang cocok dengan filter
$product = Product::where('status', 'active')->first();

// 2. firstOrFail(): Mengambil baris pertama atau error 404 jika kosong
$product = Product::where('slug', 'mechanical-keyboard')->firstOrFail();

// 3. firstWhere(): Shortcut praktis pengganti where('col', 'val')->first()
$product = Product::firstWhere('sku', 'KB-MECH-01');

// 4. sole(): Mengambil tepat 1 record. Melempar error jika data kosong ATAU lebih dari 1!
$product = Product::where('email', 'admin@example.com')->sole();
```

### 3. Mengambil Semua Data (`all`, `get`)

```php
// Mengambil seluruh isi tabel products
$allProducts = Product::all();

// Mengambil data dengan filter dan sorting
$activeProducts = Product::where('is_active', true)
    ->orderBy('price', 'asc')
    ->get();
```

#### Output

```text
Data Ditemukan:
ID: 1 | Nama: Mechanical Keyboard | Harga: 750000
```

#### Cara Kerja

```text
       Product::findOrFail(1)
                 │
                 │ SELECT * FROM products WHERE id = 1 LIMIT 1
                 ▼
       ┌────────────────────────┐
       │ Apakah Record Ada?     │
       └────┬──────────────┬────┘
            │ Ya           │ Tidak
            ▼              ▼
       Return Model   Throw ModelNotFoundException (HTTP 404)
```

**Hafalan:**

```text
find(id)                             → ambil 1 model berdasarkan ID (bisa null)
findOrFail(id)                       → ambil 1 model berdasarkan ID (wajib ada / 404)
findMany(ids)                        → ambil kumpulan model dari array ID
first()                              → ambil 1 baris pertama hasil query
firstOrFail()                        → ambil 1 baris pertama (wajib ada / 404)
firstWhere('column', 'value')        → shortcut where('column', 'value')->first()
sole()                               → ambil tepat 1 record (error jika 0 atau >1)
all()                                → ambil seluruh isi tabel sebagai Collection
get()                                → eksekusi query builder dan ambil Collection
```

#### Best Practice

- Gunakan `findOrFail()` di dalam Route Controller show/edit agar aplikasi otomatis mengembalikan respons 404 jika pengguna memasukkan ID yang tidak ada di URL.

---

<a id="bagian-4"></a>

## 4. 🟢 Update Data

#### Konsep

Memperbarui data model dapat dilakukan dengan dua pendekatan:
1. **Via Model Instance**: Mengambil model, mengubah atributnya, lalu memanggil `save()` atau `update()`. Cara ini memicu *Model Events* dan *Timestamps*.
2. **Via Direct Query Update**: Memperbarui baris data langsung di tingkat SQL tanpa memuat objek ke RAM. Sangat efisien untuk update massal.
3. **Increment / Decrement**: Menambah atau mengurangi nilai angka secara atomik.

### 1. Update Lewat Instance Model

```php
$product = Product::findOrFail(1);

// Pendekatan A: Mengubah properti objek satu per satu
$product->price = 850000;
$product->stock = 20;
$product->save(); // Eksekusi SQL UPDATE

// Pendekatan B: Update massal (memerlukan $fillable)
$product->update([
    'price' => 850000,
    'stock' => 20,
]);
```

### 2. Direct Query Update (Update Massal di Database)

```php
// Update 1000 produk diskon sekaligus tanpa memakan memori RAM
$affectedRows = Product::where('category_id', 2)
    ->where('stock', '>', 0)
    ->update(['is_discount' => true]);
```

### 3. Increment & Decrement Atomik

```php
$product = Product::findOrFail(1);

// Tambah stok sebanyak 1
$product->increment('stock');

// Tambah stok sebanyak 5 dan ubah harga sekaligus
$product->increment('stock', 5, ['price' => 900000]);

// Kurangi stok sebanyak 2
$product->decrement('stock', 2);

// Increment banyak kolom sekaligus (Laravel modern)
$product->incrementEach([
    'views' => 1,
    'clicks' => 5,
]);
```

#### Output

```text
Update Berhasil. Baris terpengaruh: 1
Harga baru: Rp 850.000
Stok baru: 23
```

#### Cara Kerja

```text
       Ambil Model via findOrFail(id)
                     │
                     ▼
       Ubah Properti / Panggil update(['column' => 'value'])
                     │
                     ▼
       Periksa Atribut Kotor (isDirty() / getDirty())
                     │
                     ▼
       Eksekusi UPDATE products SET column = value, updated_at = NOW() WHERE id = 1
```

**Hafalan:**

```text
$model->save()                                 → simpan seluruh perubahan properti objek
$model->update(['column' => 'value'])          → isi array perubahan dan simpan sekaligus
Model::where('column', 'value')->update(...)   → update massal langsung di database
$model->increment('column', amount)            → tambah nilai angka secara atomik
$model->decrement('column', amount)            → kurangi nilai angka secara atomik
$model->incrementEach(['column' => amount])    → tambah banyak kolom angka sekaligus
```

#### Best Practice

- Gunakan `$model->increment()` / `$model->decrement()` untuk operasi counter atau stok agar terhindar dari masalah *Race Condition*.

---

<a id="bagian-5"></a>

## 5. 🟢 Delete Data

#### Konsep

Menghapus data model dapat dilakukan dari instance objek model menggunakan `delete()` atau langsung berdasarkan ID menggunakan static method `destroy()`.

### 1. Menghapus Lewat Instance Model

```php
$product = Product::findOrFail(1);

// Menghapus 1 baris data dari database
$product->delete();
```

### 2. Menghapus Berdasarkan Primary Key (`destroy`)

```php
// Hapus 1 record berdasarkan ID
Product::destroy(1);

// Hapus banyak record sekaligus dengan array ID
Product::destroy([1, 2, 3]);

// Hapus dengan argumen terpisah
Product::destroy(4, 5, 6);
```

#### Output

```text
Record ID 1 berhasil dihapus dari database.
```

#### Cara Kerja

```text
       Product::destroy(1)
                │
                │ Generate SQL
                ▼
       DELETE FROM products WHERE id IN (1)
```

**Hafalan:**

```text
$model->delete()              → hapus data dari instance objek yang sedang aktif
Model::destroy(id)            → hapus data langsung berdasarkan ID tunggal
Model::destroy([id1, id2])    → hapus banyak data langsung berdasarkan kumpulan array ID
```

#### Best Practice

- Jika hanya memiliki ID dari request, gunakan `Product::destroy($id)` daripada melakukan `Product::find($id)->delete()` untuk menghemat 1 query SELECT.

---

<a id="bagian-6"></a>

## 6. 🟢 Delete Many & Truncate

#### Konsep

Ketika perlu menghapus kumpulan data berdasarkan kondisi tertentu tanpa memuat ribuan objek ke memori, gunakan Query Builder `delete()` atau kosongkan seluruh tabel menggunakan `truncate()`.

### 1. Menghapus Banyak Data Berdasarkan Kondisi

```php
// Menghapus seluruh produk yang statusnya draft dan dibuat sebelum tahun lalu
$deletedCount = Product::where('status', 'draft')
    ->where('created_at', '<', now()->subYear())
    ->delete();

echo "Total produk dihapus: {$deletedCount}";
```

### 2. Menghapus Seluruh Data Tabel (`truncate`)

```php
// Menghapus SEMUA data dan mereset auto-increment ID ke 1
Product::truncate();
```

### 3. Perbedaan Mass Delete vs Model Delete

| Fitur | `$model->delete()` | `Product::where(...)->delete()` |
|---|---|---|
| Eksekusi SQL | 1 baris per model | 1 query untuk semua baris cocok |
| Konsumsi RAM | Memuat objek ke RAM | Sangat hemat (tanpa muat objek) |
| Memicu Model Events | Ya (`deleting`, `deleted`) | Tidak (eksekusi langsung di DB) |
| Dukungan Soft Delete | Ya | Ya (jika menggunakan trait) |

#### Cara Kerja

```text
       Product::where('status', 'inactive')->delete()
                             │
                             ▼
       Eksekusi: DELETE FROM products WHERE status = 'inactive'
                             │
                             ▼
       Mengembalikan angka integer jumlah baris yang terhapus
```

**Hafalan:**

```text
Model::where('column', 'value')->delete() → hapus banyak baris sesuai filter
Model::query()->delete()                  → hapus seluruh baris via query builder
Model::truncate()                         → kosongkan tabel dan reset auto-increment
```

---

<a id="bagian-7"></a>

## 7. 🟢 Mass Assignment Protection

#### Konsep

*Mass Assignment* adalah fitur memasukkan array data input (seperti `$request->all()`) langsung ke method `create()` atau `update()`. Fitur ini sangat praktis namun memiliki celah keamanan jika pengguna jahat menyisipkan field terlarang (misal `'is_admin' => true`).

Untuk melindunginya, Laravel mewajibkan kita menentukan `$fillable` (whitelist) atau `$guarded` (blacklist) pada setiap Model.

### 1. Menggunakan `$fillable` (Sangat Disarankan)

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    // HANYA kolom di bawah ini yang diizinkan diisi via Mass Assignment
    protected $fillable = [
        'name',
        'slug',
        'price',
        'stock',
        'description',
    ];
}
```

### 2. Menggunakan `$guarded`

```php
class Product extends Model
{
    // Kolom di bawah ini DILARANG diisi via Mass Assignment
    protected $guarded = [
        'id',
        'is_admin',
    ];
}
```

### 3. Membuka Proteksi Sementara di Seeder / Command

```php
// Mematikan proteksi mass assignment sementara
Model::unguard();

// Jalankan import data seeder...

// Mengaktifkan kembali proteksi
Model::reguard();
```

#### Output Percobaan Penetrasi

Jika request mengirim `['name' => 'Mouse', 'is_admin' => 1]`, maka hanya kolom `name` yang tersimpan, sedangkan `is_admin` akan diabaikan secara aman oleh Eloquent.

#### Cara Kerja

```text
       Input Array: ['name' => 'Keyboard', 'is_admin' => true]
                                │
                                ▼
       Penyaringan Berdasarkan $fillable ['name', 'price', 'stock']
                                │
                                ▼
       Data Aman Disimpan: ['name' => 'Keyboard'] (is_admin dibuang)
```

**Hafalan:**

```text
protected $fillable = ['column'] → whitelist kolom yang BOLEH di-mass assign
protected $guarded  = ['column'] → blacklist kolom yang DILARANG di-mass assign
Model::unguard()                 → matikan proteksi mass assignment secara global
Model::reguard()                 → aktifkan kembali proteksi mass assignment
```

#### Best Practice

- Selalu prioritaskan `$fillable` daripada `$guarded = []`. Menentukan kolom secara eksplisit jauh lebih aman dari celah kebocoran hak akses data.

---

<a id="bagian-8"></a>

## 8. 🟢 Timestamps Management

#### Konsep

Secara default, Eloquent mengasumsikan tabel Anda memiliki dua kolom timestamp:
- `created_at`: Otomatis diisi waktu saat data pertama kali dibuat (*INSERT*).
- `updated_at`: Otomatis diperbarui waktu saat data mengalami perubahan (*UPDATE*).

### 1. Menonaktifkan Timestamps

Jika tabel Anda tidak memiliki kolom `created_at` dan `updated_at`:

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderStatus extends Model
{
    // Nonaktifkan pengelolaan timestamp otomatis
    public $timestamps = false;
}
```

### 2. Kustomisasi Nama Kolom Timestamps

```php
class Product extends Model
{
    const CREATED_AT = 'created_on';
    const UPDATED_AT = 'modified_on';
}
```

### 3. Memperbarui Timestamp Tanpa Mengubah Kolom (`touch`)

```php
$product = Product::findOrFail(1);

// Memperbarui kolom updated_at ke waktu SEKARANG (NOW)
$product->touch();
```

### 4. Menyimpan Perubahan Tanpa Mengubah `updated_at`

```php
// Update kolom stock tanpa memperbarui updated_at
$product->withoutTimestamps(function () use ($product) {
    $product->update(['stock' => 100]);
});
```

#### Cara Kerja

```text
       Event INSERT ──> Eloquent otomatis isi created_at & updated_at = now()
       Event UPDATE ──> Eloquent otomatis perbarui updated_at = now()
```

**Hafalan:**

```text
public $timestamps = false       → matikan fitur timestamps pada model
const CREATED_AT = 'column'      → ubah nama kolom created_at kustom
const UPDATED_AT = 'column'      → ubah nama kolom updated_at kustom
$model->touch()                  → perbarui kolom updated_at ke waktu sekarang
$model->withoutTimestamps(fn)    → jalankan mutasi tanpa mengubah updated_at
```

---

<a id="bagian-9"></a>

## 9. 🟢 Default Attribute Values

#### Konsep

Properti `$attributes` digunakan untuk menetapkan nilai default pada atribut model saat instance objek baru dibuat di memori sebelum disimpan ke database.

### 1. Mendefinisikan `$attributes`

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    // Nilai bawaan saat objek dibuat dengan 'new Product()'
    protected $attributes = [
        'status'    => 'draft',
        'stock'     => 0,
        'is_active' => true,
    ];
}
```

### 2. Penggunaan

```php
$product = new Product();

echo $product->status;    // 'draft'
echo $product->stock;     // 0
echo $product->is_active; // true
```

#### Output

```text
Status Default: draft
Stok Default: 0
```

#### Perbedaan Default Model vs Default Migration

```text
Default Migration Schema:
$table->string('status')->default('draft')
→ Berlaku di level Database SQL saat query INSERT tidak menyertakan kolom.

Default Model $attributes:
protected $attributes = ['status' => 'draft']
→ Berlaku seketika di level Objek PHP saat objek dibuat di memory aplikasi.
```

**Hafalan:**

```text
protected $attributes = ['column' => 'default_value'] → inisialisasi nilai awal model di RAM
```

---

<a id="bagian-10"></a>

## 10. 🟢 Query Builder dari Model

#### Konsep

Setiap class Model Eloquent bertindak sebagai *Entry Point* menuju Laravel Query Builder. Kita dapat menggunakan semua method query builder seperti `where()`, `orderBy()`, `limit()`, `select()`, dan menyambungkannya (*method chaining*).

### 1. Sintaks Query Builder Eloquent

```php
use App\Models\Product;

// Query berantai yang ekspresif
$products = Product::query()
    ->where('is_active', true)
    ->where('price', '>=', 500000)
    ->orderBy('price', 'desc')
    ->limit(10)
    ->get();
```

### 2. Method Eksekutor & Agregasi Esensial

```php
// Mengambil 1 data pertama
$firstProduct = Product::where('status', 'published')->first();

// Menghitung jumlah total baris cocok
$totalActive = Product::where('is_active', true)->count();

// Memeriksa apakah ada minimal 1 data cocok (sangat cepat, mengembalikan boolean)
$hasStock = Product::where('stock', '>', 0)->exists();

// Memeriksa ketiadaan data
$isEmpty = Product::where('stock', '<=', 0)->doesntExist();

// Mengambil data terurut berdasarkan created_at terbaru
$latestProducts = Product::latest()->get();

// Mengambil data terurut berdasarkan created_at terlama
$oldestProducts = Product::oldest()->get();
```

#### Cara Kerja Method Chaining

```text
       Product::query()             → Mulai inisialisasi Query Builder
              │
              ▼
       ->where('price', '>', 1000)  → Tambahkan klausa WHERE ke SQL
              │
              ▼
       ->orderBy('created_at')      → Tambahkan klausa ORDER BY ke SQL
              │
              ▼
       ->get()                      → Eksekusi SQL & kembalikan Eloquent Collection
```

**Hafalan:**

```text
Model::query()                         → inisialisasi query builder eksplisit
where('column', 'operator', 'value')   → saring baris data
orderBy('column', 'direction')         → urutkan hasil ('asc' atau 'desc')
latest('column')                       → urutkan dari yang terbaru (default created_at)
oldest('column')                       → urutkan dari yang terlama (default created_at)
count('column')                        → hitung total record cocok di database
exists()                               → cek ketersediaan data (return true/false)
doesntExist()                          → cek jika data kosong (return true/false)
get(['column'])                        → eksekusi query dan ambil Collection
```

---

<a id="bagian-11"></a>

## 11. 🟢 Eloquent Collection

#### Konsep

Hasil eksekusi method `get()`, `all()`, atau pemanggilan relasi jamak mengembalikan objek `Illuminate\Database\Eloquent\Collection`. Collection ini membungkus array objek model dengan ratusan helper method bawaan yang sangat kuat.

### 1. Operasi Esensial Eloquent Collection

```php
$products = Product::all();

// 1. Menghitung jumlah model di koleksi RAM
$count = $products->count();

// 2. Mengambil model berdasarkan Primary Key dari memori
$product = $products->find(1);

// 3. Mengambil array nilai dari 1 kolom tertentu
$names = $products->pluck('name'); // ['Keyboard', 'Mouse', 'Monitor']

// 4. Memfilter koleksi di RAM tanpa query ulang database
$inStock = $products->filter(function ($item) {
    return $item->stock > 0;
});

// 5. Transformasi setiap model
$formatted = $products->map(function ($item) {
    return [
        'id'    => $item->id,
        'title' => strtoupper($item->name),
    ];
});

// 6. Mengurutkan koleksi di RAM
$sorted = $products->sortBy('price');

// 7. Mengambil model dengan harga termurah
$cheapest = $products->firstWhere('price', '<=', 100000);
```

### 2. Perbedaan Query Database vs Collection Memory

```text
Query Database (Di Server SQL):
Product::where('price', '>', 50000)->get();
→ SQL melakukan filtering di harddisk/index database. RAM server PHP tetap hemat.

Eloquent Collection (Di Memory RAM PHP):
$products = Product::all();
$expensive = $products->filter(fn($p) => $p->price > 50000);
→ Seluruh tabel dimuat ke RAM PHP baru difilter. Lambat jika tabel berukuran besar!
```

**Hafalan:**

```text
pluck('column')                 → ambil kumpulan nilai dari satu kolom
filter(callback)                → saring isi koleksi di RAM
map(callback)                   → transformasi setiap elemen koleksi
sortBy('column')                → urutkan koleksi di RAM
contains('column', 'value')     → periksa apakah koleksi berisi data tertentu
fresh(['relation'])             → muat ulang data model dari database
load(['relation'])              → eager load relasi pada koleksi yang sudah ada di RAM
```

---

<a id="bagian-12"></a>

## 12. 🟡 Soft Deletes

#### Konsep

*Soft Delete* adalah mekanisme penghapusan aman di mana baris data tidak benar-benar dihapus secara fisik dari tabel harddisk (*hard delete*). Laravel mengisi kolom timestamp `deleted_at`.

Data yang memiliki `deleted_at` tidak null akan otomatis disembunyikan dari semua query standar Eloquent.

### 1. Menyiapkan Migration

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('products', function (Blueprint $table) {
            // Menambahkan kolom nullable 'deleted_at'
            $table->softDeletes();
        });
    }

    public function down(): void {
        Schema::table('products', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
```

### 2. Mengaktifkan Trait pada Model

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes; // Aktifkan fungsionalitas Soft Delete
}
```

### 3. Operasi Soft Delete Lengkap

```php
$product = Product::findOrFail(1);

// 1. Soft Delete: mengisi kolom deleted_at = NOW()
$product->delete();

// 2. Query normal: otomatis mengabaikan data yang deleted_at != null
$activeProducts = Product::all(); // Produk ID 1 TIDAK AKAN MUNCUL

// 3. Mengambil data termasuk yang sudah di-soft delete
$allWithTrashed = Product::withTrashed()->get();

// 4. HANYA mengambil data yang berstatus terhapus
$trashBin = Product::onlyTrashed()->get();

// 5. Memulihkan kembali data yang terhapus (deleted_at di-set null)
$product->restore();
Product::withTrashed()->where('id', 1)->restore();

// 6. Menghapus PERMANEN dari harddisk database (Hard Delete)
$product->forceDelete();
```

#### Cara Kerja

```text
       $product->delete()
               │
               ▼
       UPDATE products SET deleted_at = '2026-08-25 20:00:00' WHERE id = 1
               │
               ▼
       Product::all() ──> SELECT * FROM products WHERE deleted_at IS NULL
```

**Hafalan:**

```text
use SoftDeletes;               → aktifkan trait soft delete pada model
$table->softDeletes()          → buat kolom deleted_at di migration
withTrashed()                  → sertakan data aktif dan data terhapus
onlyTrashed()                  → ambil HANYA data yang sedang terhapus
$model->restore()              → pulihkan data soft deleted ke status aktif
$model->forceDelete()          → hapus fisik baris permanen dari harddisk
```

---

<a id="bagian-13"></a>

## 13. 🟡 Query Scope: Konsep Reusable Query

#### Konsep

Query Scope adalah fitur untuk membungkus logika query yang sering digunakan berulang kali ke dalam method model yang ekspresif dan bersih.

Contoh tujuan: daripada menulis query berulang seperti `Product::where('status', 'active')->where('stock', '>', 0)->where('price', '<=', 500000)->get()`, kita dapat menyederhanakannya menjadi:

```php
$products = Product::active()->inStock()->budget(500000)->get();
```

Laravel membagi scope menjadi dua jenis:
1. **Local Scope**: Dipanggil secara manual dan eksplisit saat dibutuhkan.
2. **Global Scope**: Diterapkan secara otomatis ke setiap query model tanpa perlu dipanggil manual.

#### Diagram Perbandingan

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           Pilihan Query Scope                           │
└────────────────────┬───────────────────────────────┬────────────────────┘
                     │                               │
                     ▼                               ▼
             Query Local Scope               Query Global Scope
                     │                               │
                     ▼                               ▼
         Dipanggil Manual Sesuai         Otomatis Aktif di Seluruh
          Kebutuhan Controller            Query Model (Default Filter)
```

**Hafalan:**

```text
Local Scope  → query reusable yang dipanggil secara eksplisit oleh developer
Global Scope → query filter yang otomatis diterapkan pada setiap query model
```

---

<a id="bagian-14"></a>

## 14. 🟡 Query Global Scope

#### Konsep

Global Scope otomatis menyisipkan klausa WHERE tertentu ke semua query model. Sangat cocok untuk fitur *Multi-Tenancy* (misal otomatis filter `where('tenant_id', auth()->user()->tenant_id)`), atau menyembunyikan data rahasia/non-aktif secara sistemik.

### 1. Membuat Global Scope Terpisah via Class

```php
namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class ActiveScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $builder->where('is_active', true);
    }
}
```

### 2. Mendaftarkan Global Scope di Model (`booted`)

```php
namespace App\Models;

use App\Models\Scopes\ActiveScope;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected static function booted(): void
    {
        // Daftarkan class scope
        static::addGlobalScope(new ActiveScope);
    }
}
```

### 3. Global Scope Anonim (*Closure Based*)

```php
protected static function booted(): void
{
    static::addGlobalScope('ancient', function ($builder) {
        $builder->where('created_at', '>=', now()->subYears(5));
    });
}
```

### 4. Menonaktifkan Global Scope Saat Dibutuhkan

```php
// Menonaktifkan ActiveScope tertentu untuk halaman Administrator
$allProducts = Product::withoutGlobalScope(ActiveScope::class)->get();

// Menonaktifkan Global Scope anonim berdasarkan nama
$allAncient = Product::withoutGlobalScope('ancient')->get();

// Menonaktifkan SEMUA global scopes sekaligus
$rawProducts = Product::withoutGlobalScopes()->get();
```

#### Output Query SQL

```text
Query Product::all():
SQL: SELECT * FROM products WHERE is_active = 1

Query Product::withoutGlobalScope(ActiveScope::class)->get():
SQL: SELECT * FROM products
```

**Hafalan:**

```text
static::addGlobalScope(new ScopeClass)       → daftarkan global scope pada booted()
withoutGlobalScope(ScopeClass::class)        → matikan satu global scope tertentu
withoutGlobalScopes([Scope1::class, Scope2]) → matikan beberapa global scope
withoutGlobalScopes()                        → matikan seluruh global scope
```

---

<a id="bagian-15"></a>

## 15. 🟡 Query Local Scope

#### Konsep

Local Scope ditulis sebagai method di dalam Model dengan awalan kata `scope` (format camelCase: `scopeActive`, `scopePopular`). Saat dipanggil di Controller, awalan `scope` dihilangkan (`Product::active()`, `Product::popular()`).

### 1. Menulis Local Scope pada Model

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    // Scope tanpa parameter
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    // Scope dengan parameter dinamis
    public function scopePriceBelow(Builder $query, float $amount): void
    {
        $query->where('price', '<=', $amount);
    }

    // Scope pencarian filter kata kunci
    public function scopeSearch(Builder $query, ?string $term): void
    {
        if ($term) {
            $query->where('name', 'like', "%{$term}%");
        }
    }
}
```

### 2. Penggunaan di Controller (*Method Chaining*)

```php
use App\Models\Product;

$products = Product::query()
    ->active()
    ->priceBelow(500000)
    ->search(request('q'))
    ->orderBy('price', 'asc')
    ->get();
```

#### Output

```text
Mengambil produk aktif dengan harga <= 500000 yang mengandung nama pencarian.
```

#### Cara Kerja

```text
       Product::active()->priceBelow(500000)
                    │
                    ▼
       Eksekusi scopeActive($query)      ──> WHERE is_active = 1
                    │
                    ▼
       Eksekusi scopePriceBelow($query)  ──> AND price <= 500000
```

**Hafalan:**

```text
public function scopeActive(Builder $query)            → dipanggil sebagai Model::active()
public function scopeCategory(Builder $query, $value)  → dipanggil sebagai Model::category($value)
```

#### Best Practice

- Gunakan Local Scope untuk menyembunyikan query filter yang kompleks dari Controller. Controller harus tetap ramping dan mudah dibaca (*Thin Controller, Fat Model*).

---

<a id="bagian-16"></a>

## 16. 🟡 Konsep Dasar Relasi (Relationships)

#### Konsep

Tabel di database relasional saling terhubung satu sama lain menggunakan kolom *Foreign Key*. Di Eloquent, relasi ini didefinisikan sebagai **method** pada class Model.

Eloquent menyediakan fungsionalitas ganda untuk setiap relasi:
1. **Dynamic Property** (`$user->phone`): Mengembalikan objek atau Collection hasil relasi yang sudah dieksekusi.
2. **Method Query Builder** (`$user->phone()`): Mengembalikan objek Query Builder relasi sehingga kita dapat menambahkan filter berantai (`->where(...)`, `->orderBy(...)`).

#### Diagram Macam-Macam Relasi

```text
       ┌────────────────────────────────────────────────────────┐
       │                 Tipe Relasi Utama Eloquent             │
       └───────┬────────────────┬────────────────┬──────────────┘
               │                │                │
               ▼                ▼                ▼
          One to One       One to Many      Many to Many
         (1 Induk ke       (1 Induk ke      (Banyak Induk ke
           1 Anak)         Banyak Anak)    Banyak Anak via Pivot)
```

**Hafalan:**

```text
hasOne('RelatedClass')         → model ini memiliki satu anak
belongsTo('RelatedClass')      → model ini dimiliki oleh satu induk (menyimpan foreign_key)
hasMany('RelatedClass')        → model ini memiliki banyak anak
belongsToMany('RelatedClass')  → model ini berelasi banyak-ke-banyak via tabel perantara
```

---

<a id="bagian-17"></a>

## 17. 🟡 One to One Relationship

#### Konsep

Relasi Satu-ke-Satu (1:1) menghubungkan 1 record di tabel induk dengan tepat 1 record di tabel anak.
Contoh: Setiap `User` memiliki tepat 1 `Phone` (atau 1 `Profile`), dan setiap `Phone` dimiliki oleh 1 `User`.

- Tabel `users`: `id`, `name`
- Tabel `phones`: `id`, `user_id` (foreign key), `number`

### 1. Definisi Model `User` (Induk)

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Model
{
    public function phone(): HasOne
    {
        // Eloquent otomatis mencari foreign key 'user_id' di tabel phones
        return $this->hasOne(Phone::class);
    }
}
```

### 2. Definisi Model `Phone` (Anak - Pemegang Foreign Key)

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Phone extends Model
{
    protected $fillable = ['user_id', 'number'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

### 3. Penggunaan & Pembuatan Relasi

```php
// Membaca relasi (Dynamic Property)
$user = User::findOrFail(1);
echo $user->phone->number;

// Membaca relasi kebalikan
$phone = Phone::firstWhere('number', '08123456789');
echo $phone->user->name;

// Membuat data relasi baru
$user->phone()->create([
    'number' => '08987654321',
]);
```

#### Cara Kerja

```text
       User Model (id: 1)
               │
               │ hasOne(Phone::class)
               ▼
       SELECT * FROM phones WHERE user_id = 1 LIMIT 1
               │
               ▼
       Objek Phone Terhubung
```

**Hafalan:**

```text
$this->hasOne(Phone::class)                 → deklarasi 1:1 di sisi induk
$this->belongsTo(User::class)               → deklarasi kebalikan di sisi anak (pemegang FK)
$this->hasOne(Phone::class, 'foreign_key')  → menentukan custom nama foreign key
$model->relation()->create(attributes)      → insert data anak otomatis mengisikan foreign_id
```

---

<a id="bagian-18"></a>

## 18. 🟡 One to Many Relationship

#### Konsep

Relasi Satu-ke-Banyak (1:N) menghubungkan 1 record di tabel induk dengan banyak record di tabel anak.
Contoh: 1 `Category` memiliki banyak `Product`, dan setiap `Product` dimiliki oleh 1 `Category`.

- Tabel `categories`: `id`, `name`
- Tabel `products`: `id`, `category_id` (foreign key), `name`, `price`

### 1. Definisi Model `Category` (Induk)

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
```

### 2. Definisi Model `Product` (Anak)

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $fillable = ['category_id', 'name', 'price'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
```

### 3. Penggunaan

```php
$category = Category::findOrFail(1);

// Mengambil semua produk di kategori ini (Eloquent Collection)
foreach ($category->products as $product) {
    echo "{$product->name} - Rp {$product->price}\n";
}

// Menambahkan filter lanjutan via Method Builder
$cheapProducts = $category->products()
    ->where('price', '<=', 100000)
    ->orderBy('name')
    ->get();

// Menyimpan produk baru langsung terkait ke kategori ini
$category->products()->create([
    'name'  => 'Mousepad XL',
    'price' => 120000,
]);
```

#### Cara Kerja

```text
       Category (id: 1)
             │
             │ hasMany(Product::class)
             ▼
       SELECT * FROM products WHERE category_id = 1
             │
             ▼
       Eloquent Collection Berisi Kumpulan Objek Product
```

**Hafalan:**

```text
$this->hasMany(Product::class)              → relasi 1:N pada model induk
$this->belongsTo(Category::class)           → relasi balik pada model anak
$parent->children()->create(attributes)     → insert 1 record anak terkait
$parent->children()->createMany([array])    → insert banyak record anak sekaligus
```

---

<a id="bagian-19"></a>

## 19. 🟡 Many to Many Relationship

#### Konsep

Relasi Banyak-ke-Banyak (N:N) terjadi ketika 1 record tabel A dapat memiliki banyak relasi di tabel B, dan sebaliknya 1 record tabel B dapat dimiliki oleh banyak relasi di tabel A.
Contoh: 1 `User` dapat memiliki banyak `Role` (Admin, Editor), dan 1 `Role` dapat dimiliki oleh banyak `User`.

Relasi ini membutuhkan **Intermediate Table (Tabel Pivot)**.
- Konvensi nama tabel pivot: gabungan kedua nama model bentuk tunggal secara alfabetis snake_case: `role_user`.
- Struktur tabel `role_user`: `user_id`, `role_id`.

### 1. Definisi Model

```php
// app/Models/User.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Model
{
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }
}

// app/Models/Role.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}
```

### 2. Mengelola Relasi Pivot (`attach`, `detach`, `sync`, `toggle`)

```php
$user = User::findOrFail(1);

// 1. attach(): Menambahkan relasi baru ke tabel pivot
$user->roles()->attach(2); // Tambah Role ID 2
$user->roles()->attach([1, 3]); // Tambah banyak role

// 2. detach(): Melepas relasi dari tabel pivot
$user->roles()->detach(2); // Lepas Role ID 2
$user->roles()->detach(); // Lepas SEMUA role milik user ini

// 3. sync(): Menyelaraskan relasi (paling sering dipakai untuk form edit checkbox)
// Hapus role lama yang tidak ada di array, dan pasang role baru di array
$user->roles()->sync([1, 4]);

// 4. syncWithoutDetaching(): Menambah yang baru tanpa menghapus relasi yang sudah ada
$user->roles()->syncWithoutDetaching([2]);

// 5. toggle(): Jika sudah ada maka lepas (detach), jika belum ada maka pasang (attach)
$user->roles()->toggle([1, 2]);
```

#### Cara Kerja

```text
       User (id: 1) ──> [ Tabel Pivot: role_user ] <── Role (id: 2)
                             │
                             ▼
       $user->roles()->sync([1, 2])
                             │
                             ▼
       DELETE FROM role_user WHERE user_id = 1 AND role_id NOT IN (1, 2);
       INSERT INTO role_user (user_id, role_id) VALUES (1, 1), (1, 2);
```

**Hafalan:**

```text
$this->belongsToMany(Role::class)  → deklarasi relasi many-to-many
$model->relation()->attach(id)     → tambah data ke tabel pivot
$model->relation()->detach(id)     → hapus data dari tabel pivot
$model->relation()->sync([ids])    → selaraskan data pivot (hapus yang tidak ada, tambah yang baru)
$model->relation()->toggle([ids])  → bolak-balik status relasi (ada -> hapus, tidak ada -> buat)
```

---

<a id="bagian-20"></a>

## 20. 🟡 Intermediate Table & Kolom Pivot

#### Konsep

Tabel pivot sering kali tidak hanya menyimpan foreign key saja, melainkan juga memiliki kolom data tambahan (seperti `quantity`, `unit_price`, `expires_at`, `created_at`).

Secara default, Eloquent hanya mengambil foreign key dari tabel pivot. Agar kolom tambahan dapat diakses, kita harus mendaftarkannya menggunakan `withPivot()`.

### 1. Mendefinisikan Kolom Pivot pada Model

```php
// app/Models/Order.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Order extends Model
{
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class)
            ->withPivot('quantity', 'unit_price', 'discount') // Izinkan kolom tambahan
            ->withTimestamps(); // Otomatis kelola created_at & updated_at di tabel pivot
    }
}
```

### 2. Mengakses & Menyimpan Data Pivot

```php
$order = Order::with('products')->findOrFail(1);

// Mengakses kolom pivot via properti 'pivot'
foreach ($order->products as $product) {
    echo "Produk: {$product->name}\n";
    echo "Qty: {$product->pivot->quantity}\n";
    echo "Harga Satuan: Rp {$product->pivot->unit_price}\n";
    echo "Subtotal: Rp " . ($product->pivot->quantity * $product->pivot->unit_price) . "\n\n";
}

// Menyimpan data tambahan saat attach atau sync
$order->products()->attach($productId, [
    'quantity'   => 3,
    'unit_price' => 750000,
    'discount'   => 0,
]);

// Update data pivot yang sudah ada
$order->products()->updateExistingPivot($productId, [
    'quantity' => 5,
]);
```

#### Cara Kerja

```sql
       SELECT products.*, 
              order_product.quantity, 
              order_product.unit_price 
       FROM products 
       INNER JOIN order_product ON products.id = order_product.product_id 
       WHERE order_product.order_id = 1
```

**Hafalan:**

```text
withPivot(['column1', 'column2'])              → izinkan pembacaan kolom tambahan pivot
withTimestamps()                               → kelola timestamps di tabel pivot
$model->pivot->column                          → akses data kolom pivot dari model
attach(id, ['pivot_column' => 'value'])        → simpan nilai tambahan ke kolom pivot
updateExistingPivot(id, ['column' => 'value']) → perbarui nilai kolom pivot yang ada
```

---

<a id="bagian-21"></a>

## 21. 🟡 Pivot Model

#### Konsep

Ketika tabel pivot memiliki logika bisnis yang kompleks, relasi tambahan, casting atribut, atau lifecycle events, membuat class **Custom Pivot Model** (turunan `Illuminate\Database\Eloquent\Relations\Pivot`) adalah pendekatan terbaik.

### 1. Membuat Custom Pivot Model

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class OrderProduct extends Pivot
{
    protected $table = 'order_product';

    // Mendukung casting atribut di tabel pivot
    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'quantity'   => 'integer',
        ];
    }

    // Helper method bisnis langsung di pivot
    public function getSubtotalAttribute(): float
    {
        return $this->quantity * $this->unit_price;
    }
}
```

### 2. Menggunakan Pivot Model pada Relasi (`using`)

```php
// app/Models/Order.php
public function products(): BelongsToMany
{
    return $this->belongsToMany(Product::class)
        ->using(OrderProduct::class) // Hubungkan ke class Custom Pivot
        ->withPivot('quantity', 'unit_price')
        ->withTimestamps();
}
```

### 3. Penggunaan

```php
$order = Order::find(1);

foreach ($order->products as $product) {
    // Memanggil method helper dari custom pivot model
    echo "Subtotal: Rp " . number_format($product->pivot->subtotal, 0, ',', '.');
}
```

**Hafalan:**

```text
class OrderProduct extends Pivot  → class custom pivot model
->using(OrderProduct::class)      → instruksikan relasi belongsToMany memakai custom pivot
```

---

<a id="bagian-22"></a>

## 22. 🟡 Querying Relations

#### Konsep

Eloquent memungkinkan kita menyaring (*filter*) model induk berdasarkan keberadaan atau kriteria yang terjadi pada model anaknya.

### 1. Menyaring Berdasarkan Keberadaan Relasi (`has`, `doesntHave`)

```php
use App\Models\User;

// 1. has(): Ambil user yang memiliki minimal 1 postingan
$users = User::has('posts')->get();

// 2. has() dengan operator jumlah: Ambil user yang punya minimal 5 postingan
$prolificUsers = User::has('posts', '>=', 5)->get();

// 3. doesntHave(): Ambil user yang BELUM PERNAH membuat postingan
$newbies = User::doesntHave('posts')->get();
```

### 2. Menyaring Berdasarkan Kondisi Relasi (`whereHas`, `whereDoesntHave`)

```php
// 1. whereHas(): Ambil user yang memiliki postingan dengan status 'published'
$publishedAuthors = User::whereHas('posts', function ($query) {
    $query->where('status', 'published');
})->get();

// 2. whereDoesntHave(): Ambil user yang TIDAK memiliki postingan berstatus 'banned'
$cleanUsers = User::whereDoesntHave('posts', function ($query) {
    $query->where('is_banned', true);
})->get();

// 3. whereRelation(): Shortcut praktis untuk filter 1 kolom relasi sederhana
$authors = User::whereRelation('posts', 'status', 'published')->get();

// 4. withWhereHas(): Filter induk SEKALIGUS Eager Load data anak dalam 1 method ringkas
$usersWithActivePosts = User::withWhereHas('posts', function ($query) {
    $query->where('is_featured', true);
})->get();
```

#### Cara Kerja

```text
       User::has('posts')
              │
              │ Subquery SQL EXISTS
              ▼
       SELECT * FROM users WHERE EXISTS (
           SELECT 1 FROM posts WHERE posts.user_id = users.id
       )
```

**Hafalan:**

```text
has('relation')                                 → filter induk yang punya minimal 1 data anak
has('relation', 'operator', count)              → filter induk dengan jumlah data anak tertentu
doesntHave('relation')                          → filter induk yang TIDAK punya data anak
whereHas('relation', callback)                  → filter induk berdasarkan kondisi data anak
whereDoesntHave('relation', callback)           → filter induk yang tidak memenuhi kondisi anak
whereRelation('relation', 'column', 'value')    → shortcut filter kolom anak tanpa closure
withWhereHas('relation', callback)              → filter kondisi anak SEKALIGUS eager load
```

---

<a id="bagian-23"></a>

## 23. 🟡 Aggregating Relations

#### Konsep

Sering kali kita perlu menghitung jumlah, menjumlahkan total nominal, atau mencari rata-rata dari relasi anak tanpa perlu memuat ribuan objek anak ke memori aplikasi.

Eloquent menyediakan kumpulan method `withCount`, `withSum`, `withAvg`, `withMin`, `withMax`, dan `withExists` yang dieksekusi secara instan via subquery SQL berkinerja tinggi.

### 1. Menghitung Jumlah Relasi (`withCount`)

```php
// Menghitung jumlah komentar di setiap postingan
$posts = Post::withCount('comments')->get();

foreach ($posts as $post) {
    // Nilai otomatis tersedia di atribut {relation}_count
    echo "{$post->title} ({$post->comments_count} komentar)\n";
}

// Menghitung dengan filter & alias kustom
$posts = Post::withCount([
    'comments',
    'comments as approved_comments_count' => function ($query) {
        $query->where('is_approved', true);
    },
])->get();

echo $posts->first()->approved_comments_count;
```

### 2. Agregasi Statistik Lainnya (`withSum`, `withAvg`, `withMin`, `withMax`)

```php
use App\Models\User;
use App\Models\Product;

// 1. withSum: Total nominal transaksi per user
$users = User::withSum('orders', 'total_amount')->get();
echo $users->first()->orders_sum_total_amount;

// 2. withAvg: Rating rata-rata per produk
$products = Product::withAvg('reviews', 'rating')->get();
echo $products->first()->reviews_avg_rating;

// 3. withMax & withMin: Harga varian termahal dan termurah
$products = Product::withMax('variants', 'price')
    ->withMin('variants', 'price')
    ->get();

// 4. withExists: Memeriksa apakah relasi ada (menghasilkan boolean true/false)
$users = User::withExists('activeSubscription')->get();
if ($users->first()->active_subscription_exists) {
    echo "Member Berlangganan Aktif";
}
```

#### Cara Kerja

```text
       Post::withCount('comments')
                   │
                   ▼
       SELECT posts.*, 
              (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) AS comments_count 
       FROM posts;
```

**Hafalan:**

```text
withCount('relation')                      → atribut {relation}_count (jumlah anak)
withSum('relation', 'column')              → atribut {relation}_sum_{column} (total nominal)
withAvg('relation', 'column')              → atribut {relation}_avg_{column} (rata-rata)
withMin('relation', 'column')              → atribut {relation}_min_{column} (nilai terkecil)
withMax('relation', 'column')              → atribut {relation}_max_{column} (nilai terbesar)
withExists('relation')                     → atribut {relation}_exists (boolean true/false)
```

---

<a id="bagian-24"></a>

## 24. 🟡 Lazy vs Eager Loading (Solusi N+1 Problem)

#### Konsep

**N+1 Query Problem** adalah jebakan performa paling umum pada ORM:
- Jika kita mengambil 100 record buku (`1 Query`), lalu di dalam loop kita memanggil `$book->author->name` secara dinamis (*Lazy Loading*), Laravel akan mengeksekusi 1 query tambahan untuk setiap iterasi loop (`100 Query`). Total: **101 Query SQL!** Ini menyebabkan aplikasi menjadi sangat lambat.

**Eager Loading** adalah solusi utama: memuat seluruh relasi yang dibutuhkan di awal hanya dalam **2 Query SQL yang teroptimasi**, terlepas dari berapa pun jumlah baris yang ada.

### 1. Bahaya Lazy Loading (N+1 Query)

```php
// ❌ BURUK: Menghasilkan 1 + N Query ke Database
$books = Book::all(); // Query 1: SELECT * FROM books;

foreach ($books as $book) {
    // Mengeksekusi Query SELECT * FROM authors WHERE id = ? berulang kali!
    echo $book->author->name; 
}
```

### 2. Solusi Eager Loading (`with`)

```php
// ✅ BAIK: Hanya 2 Query SQL Cepat!
$books = Book::with('author')->get();

// Query 1: SELECT * FROM books;
// Query 2: SELECT * FROM authors WHERE id IN (1, 2, 3, ...);

foreach ($books as $book) {
    echo $book->author->name; // Bebas query tambahan (data sudah ada di RAM)
}
```

### 3. Eager Loading Lanjutan (Multiple, Nested, & Filtered)

```php
// 1. Memuat banyak relasi sekaligus
$books = Book::with(['author', 'publisher', 'categories'])->get();

// 2. Nested Eager Loading (Relasi Bersarang: Buku -> Penulis -> Profil)
$books = Book::with('author.profile')->get();

// 3. Eager Loading dengan Constraint Filter
$authors = Author::with(['posts' => function ($query) {
    $query->where('is_published', true)->orderBy('published_at', 'desc');
}])->get();
```

### 4. Lazy Eager Loading (`load`, `loadMissing`)

Jika kumpulan model sudah terlanjur diambil dan kita baru memutuskan ingin melakukan eager load belakangan:

```php
$books = Book::all();

// Lakukan eager loading pada objek collection yang sudah ada di RAM
$books->load('author');

// Hanya muat jika relasi author BELUM di-load sebelumnya
$books->loadMissing('author');
```

### 5. Mencegah Lazy Loading di Mode Development

Di Laravel modern, kita dapat menginstruksikan aplikasi agar melempar error keras jika ada lazy loading yang tidak sengaja lolos:

```php
// app/Providers/AppServiceProvider.php
use Illuminate\Database\Eloquent\Model;

public function boot(): void
{
    // Melempar exception jika terjadi N+1 lazy loading di local development
    Model::preventLazyLoading(! app()->isProduction());
}
```

#### Diagram Perbandingan Performa

```text
Lazy Loading (N+1):
SELECT * FROM books (1x)
  ├── SELECT * FROM authors WHERE id = 1 (1x)
  ├── SELECT * FROM authors WHERE id = 2 (1x)
  └── ... (Loop 100x = 101 Query SQL)

Eager Loading:
SELECT * FROM books; (1x)
SELECT * FROM authors WHERE id IN (1, 2, 3, ...); (1x)
  └── (Hanya 2 Query Teroptimasi)
```

**Hafalan:**

```text
Model::with(['relation'])              → eager load relasi di awal query (Solusi N+1)
Model::with('relation.subrelation')    → eager load relasi bersarang (nested)
$collection->load(['relation'])        → eager load belakangan pada koleksi yang ada di RAM
$model->loadMissing(['relation'])      → muat relasi hanya jika belum terhidrasi
Model::preventLazyLoading(condition)   → aktifkan alarm deteksi N+1 di file AppServiceProvider
```

---

<a id="bagian-25"></a>

## 25. 🟡 UUID & ULID Primary Keys

#### Konsep

Penggunaan auto-increment integer ID (1, 2, 3) rentan terhadap tebakan URL (*enumeration attack*). Laravel menyediakan dukungan native untuk:
- **UUID (Universally Unique Identifier)**: String 36 karakter acak (`550e8400-e29b-41d4-a716-446655440000`).
- **ULID (Universally Unique Lexicographically Sortable Identifier)**: String 26 karakter unik yang dapat diurutkan berdasarkan waktu pembuatan secara alami (`01ARZ3NDEKTSV4RRFFQ69G5FAV`).

### 1. Migration Skema

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        // Skema UUID
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->decimal('amount', 12, 2);
            $table->timestamps();
        });

        // Skema ULID
        Schema::create('transactions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('reference');
            $table->timestamps();
        });
    }
};
```

### 2. Mengaktifkan Trait pada Model

```php
// app/Models/Order.php (UUID)
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasUuids; // Otomatis generate UUID string saat membuat record baru
}

// app/Models/Transaction.php (ULID)
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasUlids; // Otomatis generate ULID string yang terurut saat create
}
```

### 3. Penggunaan

```php
$order = Order::create(['amount' => 500000]);

echo $order->id; // '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
```

**Hafalan:**

```text
use HasUuids;              → otomatis buat UUID 36-karakter sebagai primary key
use HasUlids;              → otomatis buat ULID 26-karakter terurut sebagai primary key
$table->uuid('id')->primary()  → kolom primary key UUID di migration
$table->ulid('id')->primary()  → kolom primary key ULID di migration
```

---

<a id="bagian-26"></a>

## 26. 🟡 Attribute Casting Modern

#### Konsep

Casting secara otomatis mengubah tipe data kolom mentah database (yang sering berupa string) menjadi tipe data PHP yang sesuai saat dibaca, dan mengembalikannya ke format database saat disimpan.

Di Laravel modern (Laravel 11 / 12 / 13), casting didefinisikan menggunakan method `casts(): array` (bukan properti `$casts = []`).

### 1. Mendefinisikan Method `casts()`

```php
namespace App\Models;

use App\Enums\ProductStatus;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected function casts(): array
    {
        return [
            'is_active'    => 'boolean',
            'stock'        => 'integer',
            'price'        => 'decimal:2',
            'options'      => 'array',           // Otomatis encode/decode JSON
            'published_at' => 'datetime',        // Menjadi objek Carbon
            'expires_at'   => 'immutable_date',
            'status'       => ProductStatus::class, // PHP 8.1+ Backed Enum
            'secret_token' => 'encrypted',       // Enkripsi otomatis di database
        ];
    }
}
```

### 2. Penggunaan

```php
$product = Product::find(1);

// Dibaca langsung sebagai tipe data asli
if ($product->is_active === true) { ... }
$formattedDate = $product->published_at->format('d M Y'); // Objek Carbon
$product->options = ['color' => 'red', 'size' => 'L']; // Array langsung disimpan sebagai JSON di DB
```

#### Cara Kerja

```text
       Database Storage (JSON String: '{"color":"red"}')
                            │
                            │ Saat Diakses ($product->options)
                            ▼
       PHP Array Asli (['color' => 'red'])
                            │
                            │ Saat Disimpan ($product->save())
                            ▼
       JSON String di-encode kembali secara otomatis ke SQL
```

**Hafalan:**

```text
protected function casts(): array → method modern tempat mendefinisikan seluruh tipe casting
'boolean'                         → konversi ke tipe bool (true/false)
'integer' / 'decimal:2'           → konversi angka integer / desimal presisi
'array' / 'json'                  → otomatis JSON encode saat simpan & decode saat baca
'datetime' / 'date'               → konversi string tanggal ke objek Carbon
'encrypted'                       → otomatis enkripsi di database & dekripsi saat dibaca
EnumClass::class                  → casting langsung ke PHP 8 Backed Enum
```

---

<a id="bagian-27"></a>

## 27. 🟡 Accessors dan Mutators Modern

#### Konsep

- **Accessor**: Memanipulasi nilai atribut saat **dibaca** oleh kode aplikasi (misal mengubah format nama menjadi huruf kapital).
- **Mutator**: Memanipulasi nilai atribut saat **disimpan** ke database (misal melakukan hashing password atau slugify judul).

Di Laravel modern, Accessor dan Mutator didefinisikan secara elegan dalam satu method menggunakan class `Illuminate\Database\Eloquent\Casts\Attribute`.

### 1. Definisi Accessor & Mutator Modern

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class User extends Model
{
    // Accessor & Mutator untuk atribut 'first_name'
    protected function firstName(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => ucfirst($value), // Dijalankan saat dibaca
            set: fn (string $value) => strtolower($value), // Dijalankan saat disimpan
        );
    }

    // Virtual Accessor (Atribut tiruan yang tidak ada di kolom tabel database)
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => 
                "{$attributes['first_name']} {$attributes['last_name']}",
        );
    }
}
```

### 2. Penggunaan

```php
$user = new User();
$user->first_name = 'BUDI'; // Mutator otomatis mengubahnya menjadi 'budi' saat simpan
$user->last_name = 'Santoso';
$user->save();

echo $user->first_name; // Accessor mengembalikan 'Budi'
echo $user->full_name;  // Virtual Accessor mengembalikan 'Budi Santoso'
```

**Hafalan:**

```text
Attribute::make(get: callback, set: callback) → sintaks modern accessor & mutator
get: fn (string $value) => ...                → transformasi nilai saat dibaca
set: fn (string $value) => ...                → transformasi nilai saat disimpan
```

---

<a id="bagian-28"></a>

## 28. 🟡 Model Events & Observers

#### Konsep

Eloquent memancarkan berbagai *Lifecycle Events* saat model berinteraksi dengan database:
`retrieved`, `creating`, `created`, `updating`, `updated`, `saving`, `saved`, `deleting`, `deleted`, `restoring`, `restored`.

Event berakhiran `-ing` berjalan **sebelum** aksi database terjadi (dapat dibatalkan jika return `false`), sedangkan `-ed` berjalan **setelah** aksi sukses.

### 1. Menangani Event di Model (`booted`)

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Post extends Model
{
    protected static function booted(): void
    {
        // Otomatis generate slug sebelum data disimpan ke database
        static::creating(function (Post $post) {
            if (empty($post->slug)) {
                $post->slug = Str::slug($post->title);
            }
        });

        // Hapus file gambar fisik setelah post dihapus
        static::deleted(function (Post $post) {
            // Storage::delete($post->image_path);
        });
    }
}
```

### 2. Menggunakan Observers (Class Terpisah untuk Kode Bersih)

```bash
# Membuat Observer class via Artisan
php artisan make:observer UserObserver --model=User
```

File `app/Observers/UserObserver.php`:

```php
namespace App\Observers;

use App\Models\User;

class UserObserver
{
    public function created(User $user): void
    {
        // Kirim email selamat datang setelah registrasi sukses
        // Mail::to($user)->send(new WelcomeEmail($user));
    }

    public function deleting(User $user): void
    {
        // Bersihkan data dependensi sebelum user terhapus
    }
}
```

Daftarkan Observer di `app/Providers/AppServiceProvider.php`:

```php
use App\Models\User;
use App\Observers\UserObserver;

public function boot(): void
{
    User::observe(UserObserver::class);
}
```

**Hafalan:**

```text
creating / created    → event sebelum / sesudah insert record baru
updating / updated    → event sebelum / sesudah update record
deleting / deleted    → event sebelum / sesudah hapus record
make:observer Name    → artisan command membuat class observer
Model::observe(Class) → daftarkan observer di AppServiceProvider
```

---

<a id="bagian-29"></a>

## 29. 🟡 Serialization Data

#### Konsep

Serialization adalah proses mengubah instance Model atau Eloquent Collection menjadi array PHP mentah atau format teks JSON untuk kebutuhan respons REST API.

### 1. Mengubah Model ke Array & JSON

```php
$user = User::with('roles')->findOrFail(1);

// Mengubah ke Array PHP
$userArray = $user->toArray();

// Mengubah ke String JSON
$userJson = $user->toJson();

// Langsung dikembalikan di Controller (Laravel otomatis convert ke JSON)
return response()->json($user);
```

### 2. Menyembunyikan Kolom Sensitif (`$hidden` & `$visible`)

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    // Kolom yang TIDAK AKAN PERNAH muncul di output JSON/Array API
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
    ];

    // Alternatif Whitelist: HANYA kolom ini yang boleh muncul
    // protected $visible = ['id', 'name', 'email'];
}
```

### 3. Menambahkan Virtual Attribute ke JSON (`$appends`)

```php
class User extends Model
{
    // Sertakan hasil Virtual Accessor ke dalam output JSON
    protected $appends = [
        'full_name',
    ];
}
```

#### Output JSON API

```json
{
  "id": 1,
  "first_name": "Budi",
  "last_name": "Santoso",
  "full_name": "Budi Santoso",
  "email": "budi@example.com"
}
```

**Hafalan:**

```text
$model->toArray()               → konversi model ke array PHP
$model->toJson()                → konversi model ke string JSON
protected $hidden = ['column']  → sembunyikan kolom dari serialisasi JSON (blacklist)
protected $visible = ['column'] → whitelist kolom yang tampil di JSON
protected $appends = ['attr']   → sertakan virtual accessor ke output JSON
```

---

<a id="bagian-30"></a>

## 30. 🟡 Model Factories & Seeding

#### Konsep

Model Factory digunakan untuk membuat ratusan hingga ribuan data tiruan (*dummy data*) yang realistis untuk kebutuhan *automated testing* dan *seeding* database lokal development.

### 1. Membuat Factory via Artisan

```bash
php artisan make:factory ProductFactory --model=Product
```

### 2. Menulis Definisi Factory (`database/factories/ProductFactory.php`)

```php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'name'        => ucfirst($name),
            'slug'        => Str::slug($name),
            'price'       => fake()->numberBetween(50000, 5000000),
            'stock'       => fake()->numberBetween(0, 100),
            'description' => fake()->paragraph(),
            'is_active'   => fake()->boolean(80), // 80% kemungkinan bernilai true
        ];
    }

    // State kustom untuk variasi data
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock' => 0,
        ]);
    }
}
```

### 3. Menggunakan Factory di Seeder / Test

```php
use App\Models\Product;

// 1. make(): Membuat instance objek di RAM (BELUM disimpan ke DB)
$product = Product::factory()->make();

// 2. create(): Membuat dan LANGSUNG menyimpan ke database
$product = Product::factory()->create();

// 3. Membuat 50 produk sekaligus
Product::factory()->count(50)->create();

// 4. Menggabungkan dengan state kustom
Product::factory()->count(10)->outOfStock()->create();

// 5. Membuat produk sekaligus relasinya
Product::factory()
    ->count(5)
    ->hasVariants(3) // Otomatis buat 3 varian per produk
    ->create();
```

**Hafalan:**

```text
make:factory NameFactory            → buat file class factory
Model::factory()->make()            → buat objek model di RAM (tanpa insert DB)
Model::factory()->create()          → buat objek dan simpan langsung ke database
Model::factory()->count(amount)     → tentukan jumlah baris data yang ingin dibuat
$factory->state(callback)           → modifikasi kondisi atribut tertentu pada factory
```

---

<a id="bagian-31"></a>

## 31. 🔴 Has One of Many

#### Konsep

Ketika model induk memiliki relasi 1-to-Many ke model anak, namun kita sering membutuhkan kueri untuk mengambil **tepat 1 anak** dengan kriteria ekstrem tertentu (misal: pesanan *terbaru*, harga produk *termahal*, atau login *pertama kali*).

Eloquent menyediakan method `latestOfMany()`, `oldestOfMany()`, dan `ofMany()`.

### 1. Definisi pada Model

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    // 1. Mengambil 1 order TERBARU milik customer ini
    public function latestOrder(): HasOne
    {
        return $this->hasOne(Order::class)->latestOfMany();
    }

    // 2. Mengambil 1 order TERLAMA (pertama kali order)
    public function oldestOrder(): HasOne
    {
        return $this->hasOne(Order::class)->oldestOfMany();
    }

    // 3. Mengambil order dengan NOMINAL TERBESAR
    public function largestOrder(): HasOne
    {
        return $this->hasOne(Order::class)->ofMany('total_amount', 'max');
    }
}
```

### 2. Penggunaan

```php
$customer = Customer::with('latestOrder')->findOrFail(1);

echo "Pesanan Terakhir: #{$customer->latestOrder->id} senilai Rp {$customer->latestOrder->total_amount}";
```

**Hafalan:**

```text
$this->hasOne(Child::class)->latestOfMany()            → ambil 1 record anak paling baru
$this->hasOne(Child::class)->oldestOfMany()            → ambil 1 record anak paling awal
$this->hasOne(Child::class)->ofMany('column', 'max')   → ambil 1 record anak dengan nilai kolom maksimum
```

---

<a id="bagian-32"></a>

## 32. 🔴 Has One Through

#### Konsep

Relasi `hasOneThrough` menghubungkan model asal ke 1 model tujuan **melalui satu model perantara**.

Contoh Kasus: Setiap `Mechanic` (Montir) memiliki 1 `Car` (Mobil), dan setiap `Car` memiliki 1 `Owner` (Pemilik). Kita ingin langsung mengetahui `Owner` dari seorang `Mechanic` tanpa query manual berulang.

Struktur Tabel:
- `mechanics`: `id`, `name`
- `cars`: `id`, `mechanic_id`, `model`
- `owners`: `id`, `car_id`, `name`

### 1. Definisi Model `Mechanic`

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class Mechanic extends Model
{
    public function carOwner(): HasOneThrough
    {
        // Argumen: (ModelTujuan::class, ModelPerantara::class)
        return $this->hasOneThrough(Owner::class, Car::class);
    }
}
```

### 2. Penggunaan

```php
$mechanic = Mechanic::with('carOwner')->find(1);

echo "Montir: {$mechanic->name} sedang memperbaiki mobil milik: {$mechanic->carOwner->name}";
```

#### Cara Kerja

```text
       Mechanic (id: 1)
             │
             │ [Tabel Perantara: cars WHERE mechanic_id = 1]
             ▼
       Car (id: 10)
             │
             │ [Tabel Tujuan: owners WHERE car_id = 10]
             ▼
       Owner (name: Budi)
```

**Hafalan:**

```text
$this->hasOneThrough(FinalModel::class, IntermediateModel::class)
→ akses 1 model tujuan melalui 1 model perantara
```

---

<a id="bagian-33"></a>

## 33. 🔴 Has Many Through

#### Konsep

Relasi `hasManyThrough` menghubungkan model asal ke **banyak model tujuan melalui satu model perantara**.

Contoh Kasus: 1 `Country` memiliki banyak `User`, dan setiap `User` memiliki banyak `Post`. Kita ingin mengambil seluruh `Post` yang ada di suatu `Country` secara langsung.

Struktur Tabel:
- `countries`: `id`, `name`
- `users`: `id`, `country_id`, `name`
- `posts`: `id`, `user_id`, `title`

### 1. Definisi Model `Country`

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Country extends Model
{
    public function posts(): HasManyThrough
    {
        // Argumen: (ModelTujuan::class, ModelPerantara::class)
        return $this->hasManyThrough(Post::class, User::class);
    }
}
```

### 2. Penggunaan

```php
$country = Country::findOrFail(1); // Indonesia

echo "Total Postingan di {$country->name}: " . $country->posts()->count() . "\n";

foreach ($country->posts as $post) {
    echo "- {$post->title}\n";
}
```

#### Cara Kerja

```text
       Country (id: 1)
             │
             │ JOIN users ON users.country_id = countries.id
             ▼
       Users di Country Ini
             │
             │ JOIN posts ON posts.user_id = users.id
             ▼
       Kumpulan Objek Post Terkait
```

**Hafalan:**

```text
$this->hasManyThrough(FinalModel::class, IntermediateModel::class)
→ akses banyak model tujuan melalui 1 model perantara
```

---

<a id="bagian-34"></a>

## 34. 🔴 Polymorphic Relationships: Konsep & Schema

#### Konsep

Relasi Polimorfik (*Polymorphic Relations*) memungkinkan satu tabel anak dimiliki oleh **berbagai tipe model induk yang berbeda-beda** hanya dengan satu tabel tunggal.

Contoh Klasik: Fitur Komentar (`Comment`). Komentar dapat dipasang pada model `Post` maupun model `Video`.

Tabel `comments` membutuhkan 2 kolom khusus:
1. `commentable_id`: Menyimpan ID induk (misal ID 5).
2. `commentable_type`: Menyimpan nama class induk (misal `App\Models\Post` atau `App\Models\Video`).

### 1. Migration Skema Polimorfik

```php
Schema::create('comments', function (Blueprint $table) {
    $table->id();
    $table->text('body');
    
    // Shortcut membuat 2 kolom: commentable_id (bigint) dan commentable_type (string)
    $table->morphs('commentable');
    
    $table->timestamps();
});
```

#### Cara Kerja

```text
                         Tabel comments
                               │
            ┌──────────────────┴──────────────────┐
            │ commentable_id   │ commentable_type │
            ├──────────────────┼──────────────────┤
            │ 1                │ App\Models\Post  │ ──> Menunjuk ke Post ID 1
            │ 1                │ App\Models\Video │ ──> Menunjuk ke Video ID 1
            └──────────────────┴──────────────────┘
```

**Hafalan:**

```text
$table->morphs('name')          → buat kolom name_id dan name_type di migration (not nullable)
$table->nullableMorphs('name')  → buat kolom name_id dan name_type yang boleh null
```

---

<a id="bagian-35"></a>

## 35. 🔴 One to One Polymorphic

#### Konsep

Relasi Satu-ke-Satu Polimorfik menghubungkan 1 record anak polimorfik ke 1 record dari berbagai tipe induk.
Contoh: Model `Image` (Foto Profil) dapat dimiliki oleh `User` atau `Company`.

- Tabel `images`: `id`, `url`, `imageable_id`, `imageable_type`

### 1. Definisi Model

```php
// app/Models/Image.php (Model Anak)
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Image extends Model
{
    public function imageable(): MorphTo
    {
        return $this->morphTo();
    }
}

// app/Models/User.php (Induk 1)
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class User extends Model
{
    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable');
    }
}

// app/Models/Company.php (Induk 2)
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Company extends Model
{
    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable');
    }
}
```

### 2. Penggunaan

```php
// Simpan gambar untuk user
$user = User::find(1);
$user->image()->create(['url' => 'avatars/user1.jpg']);

// Simpan gambar untuk company
$company = Company::find(1);
$company->image()->create(['url' => 'logos/company1.png']);

// Akses balik dari image ke pemilik aslinya
$image = Image::find(1);
$owner = $image->imageable; // Mengembalikan objek User atau Company secara dinamis!
```

**Hafalan:**

```text
$this->morphOne(Image::class, 'imageable') → deklarasi 1:1 polimorfik di model induk
$this->morphTo()                           → deklarasi kebalikan di model anak
```

---

<a id="bagian-36"></a>

## 36. 🔴 One to Many Polymorphic

#### Konsep

Relasi Satu-ke-Banyak Polimorfik menghubungkan banyak record anak ke salah satu dari beberapa tipe model induk.
Contoh: `Post` dan `Video` sama-sama memiliki banyak `Comment`.

- Tabel `comments`: `id`, `body`, `commentable_id`, `commentable_type`

### 1. Definisi Model

```php
// app/Models/Comment.php (Anak)
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Comment extends Model
{
    public function commentable(): MorphTo
    {
        return $this->morphTo();
    }
}

// app/Models/Post.php (Induk)
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Post extends Model
{
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}

// app/Models/Video.php (Induk)
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Video extends Model
{
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
```

### 2. Penggunaan

```php
$post = Post::find(1);
$post->comments()->create(['body' => 'Artikel yang sangat bermanfaat!']);

$video = Video::find(1);
$video->comments()->create(['body' => 'Kualitas video sangat jernih!']);

// Mengambil semua komentar
foreach ($video->comments as $comment) {
    echo $comment->body;
}
```

**Hafalan:**

```text
$this->morphMany(Comment::class, 'commentable') → deklarasi 1:N polimorfik di model induk
$this->morphTo()                                → deklarasi kebalikan di model anak
```

---

<a id="bagian-37"></a>

## 37. 🔴 One of Many Polymorphic

#### Konsep

Mengambil **tepat 1 record anak polimorfik** terbaru atau terekstrem dari relasi One-to-Many Polimorfik menggunakan `latestOfMany()`.

Contoh: Mengambil 1 `Image` terbaru yang diunggah oleh `User` atau `Product`.

### 1. Definisi Model

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Product extends Model
{
    public function images(): MorphMany
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    // Ambil tepat 1 foto produk terbaru
    public function latestImage(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable')->latestOfMany();
    }
}
```

### 2. Penggunaan

```php
$product = Product::with('latestImage')->findOrFail(1);

echo "Foto Utama: " . $product->latestImage->url;
```

**Hafalan:**

```text
$this->morphOne(Child::class, 'name')->latestOfMany() → ambil 1 anak polimorfik terbaru
```

---

<a id="bagian-38"></a>

## 38. 🔴 Many to Many Polymorphic

#### Konsep

Relasi Banyak-ke-Banyak Polimorfik memungkinkan beberapa model induk berbagi kumpulan tag/kategori yang sama via tabel pivot polimorfik.

Contoh Kasus: `Post` dan `Video` sama-sama memiliki banyak `Tag`, dan setiap `Tag` dapat dipasang pada banyak `Post` maupun `Video`.

Struktur Tabel:
- `posts`: `id`, `title`
- `videos`: `id`, `title`
- `tags`: `id`, `name`
- `taggables` (Pivot Polimorfik): `tag_id`, `taggable_id`, `taggable_type`

### 1. Migration Skema Pivot

```php
Schema::create('taggables', function (Blueprint $table) {
    $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
    $table->morphs('taggable'); // taggable_id & taggable_type
});
```

### 2. Definisi Model

```php
// app/Models/Tag.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Tag extends Model
{
    // Mengambil semua Post yang memiliki tag ini
    public function posts(): MorphToMany
    {
        return $this->morphedByMany(Post::class, 'taggable');
    }

    // Mengambil semua Video yang memiliki tag ini
    public function videos(): MorphToMany
    {
        return $this->morphedByMany(Video::class, 'taggable');
    }
}

// app/Models/Post.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Post extends Model
{
    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }
}
```

### 3. Penggunaan

```php
$post = Post::find(1);
$tag = Tag::firstOrCreate(['name' => 'Laravel']);

// Pasang tag ke post
$post->tags()->attach($tag->id);

// Selaraskan tag
$post->tags()->sync([1, 2]);
```

**Hafalan:**

```text
$this->morphToMany(Tag::class, 'taggable')     → pasang relasi N:N polimorfik di sisi model induk
$this->morphedByMany(Post::class, 'taggable')  → pasang relasi balik di sisi model Tag
```

---

<a id="bagian-39"></a>

## 39. 🔴 Polymorphic Types & Morph Map

#### Konsep

Secara default, Laravel menyimpan nama class lengkap (*Fully Qualified Class Name*) seperti `App\Models\Post` pada kolom `commentable_type`.

Kelemahan FQCN default:
1. **Boros Ukuran Database**: Menyimpan string namespace yang panjang di setiap baris data.
2. **Kerapuhan Refactoring**: Jika Anda memindahkan letak model (misal ke `App\Models\Blog\Post`), relasi data lama di database akan langsung rusak!

**Solusinya adalah Morph Map**: Mendaftarkan alias pendek dan stabil untuk setiap model.

### 1. Mendaftarkan Morph Map di `AppServiceProvider`

```php
namespace App\Providers;

use App\Models\Post;
use App\Models\Video;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Mendaftarkan alias pendek & mewajibkan morph map untuk keamanan
        Relation::enforceMorphMap([
            'post'    => Post::class,
            'video'   => Video::class,
            'user'    => User::class,
        ]);
    }
}
```

### 2. Dampak di Database

Kolom `commentable_type` sekarang hanya menyimpan string ringkas `'post'` atau `'video'`.

#### Cara Kerja

```text
       Input: $post->comments()->create(['body' => 'Mantap!'])
                         │
                         │ Periksa Morph Map ('post' => Post::class)
                         ▼
       INSERT INTO comments (body, commentable_id, commentable_type) 
       VALUES ('Mantap!', 1, 'post')
```

**Hafalan:**

```text
Relation::enforceMorphMap(['alias' => Model::class])
→ daftarkan alias pendek pengganti nama namespace class di database
```

---

<a id="bagian-40"></a>

## 40. 🔴 Custom Casts

#### Konsep

Jika kebutuhan konversi tipe data model Anda melampaui kemampuan built-in cast bawaan Laravel (misal: enkripsi kustom, formatting mata uang dengan *Value Object*, atau koordinat GPS), kita dapat membuat **Custom Cast Class** menggunakan antarmuka `CastsAttributes`.

### 1. Membuat Custom Cast via Artisan

```bash
php artisan make:cast MoneyCast
```

### 2. Implementasi Class `MoneyCast`

```php
namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class MoneyCast implements CastsAttributes
{
    // Dijalankan saat data dibaca dari database ke Model
    public function get(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        // Ubah integer rupiah (misal 500000) menjadi string terformat (Rp 500.000)
        return 'Rp ' . number_format((int) $value, 0, ',', '.');
    }

    // Dijalankan saat data di-set di Model untuk disimpan ke database
    public function set(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        // Bersihkan karakter non-angka sebelum disimpan sebagai integer ke DB
        return [$key => (int) preg_replace('/[^0-9]/', '', (string) $value)];
    }
}
```

### 3. Mendaftarkan Custom Cast di Model

```php
namespace App\Models;

use App\Casts\MoneyCast;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected function casts(): array
    {
        return [
            'price' => MoneyCast::class,
        ];
    }
}
```

### 4. Penggunaan

```php
$product = new Product();
$product->price = 'Rp 750.000'; // Otomatis disanitasi menjadi 750000 di SQL
$product->save();

echo $product->price; // Output otomatis: 'Rp 750.000'
```

**Hafalan:**

```text
make:cast NameCast                        → buat file class custom cast
class NameCast implements CastsAttributes → kontrak wajib custom cast
get($model, $key, $value, $attributes)    → transformasi data keluar (baca)
set($model, $key, $value, $attributes)    → transformasi data masuk (simpan)
```

---

<a id="bagian-41"></a>

## 41. 🔴 Model Pruning & Touch Parent

#### Konsep

1. **Model Pruning**: Fitur pembersihan otomatis untuk menghapus record lama atau data sampah yang sudah usang secara terjadwal tanpa membebani server.
2. **Touch Parent Timestamps (`$touches`)**: Otomatis memperbarui kolom `updated_at` pada model induk setiap kali ada data anak yang diubah atau dihapus.

### 1. Menerapkan Model Pruning (`Prunable`)

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Prunable;

class ActivityLog extends Model
{
    use Prunable;

    // Tentukan kriteria data usang yang ingin dihapus otomatis
    public function prunable(): Builder
    {
        // Hapus log aktivitas yang sudah berusia lebih dari 30 hari
        return static::where('created_at', '<=', now()->subDays(30));
    }
}
```

Jalankan via Artisan / Task Scheduler:

```bash
# Menjalankan pembersihan pruning
php artisan model:prune
```

### 2. Touch Parent Timestamps (`$touches`)

Contoh Kasus: Setiap kali ada `Comment` baru yang ditambahkan, kita ingin kolom `updated_at` pada `Post` induknya otomatis diperbarui.

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    // Nama relasi induk yang ingin di-update timestamp-nya secara otomatis
    protected $touches = ['post'];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
```

**Hafalan:**

```text
use Prunable;                          → aktifkan fitur pembersihan otomatis data lama
public function prunable(): Builder    → query penentu data mana yang akan dipangkas
php artisan model:prune                → command eksekusi pemangkasan data
protected $touches = ['relation_name'] → otomatis perbarui updated_at induk saat anak berubah
```

---

<a id="bagian-42"></a>

## 42. 🛠️ Peta Ingatan Cepat

#### A. Mental Model Arsitektur Eloquent ORM

```text
       Aplikasi Web (Controller / Action)
                      │
                      │ 1. Panggil Model Query
                      ▼
       Eloquent Model Layer (Abstraksi Objek PHP)
                      │
                      │ 2. Bangun Query Berantai
                      ▼
       Laravel Query Builder
                      │
                      │ 3. Compile ke SQL + Parameter Binding Aman
                      ▼
       Database Server (SQLite / MySQL / PostgreSQL)
                      │
                      │ 4. Eksekusi SQL pada Tabel & Index
                      ▼
       Eloquent Collection (Kumpulan Objek Model Terhidrasi di RAM)
```

#### B. Anatomi Seluruh Relasi Eloquent

```text
One to One:
User (Induk) ───────── hasOne ─────────> Phone (user_id)
Phone (Anak) ──────── belongsTo ────────> User

One to Many:
Category (Induk) ───── hasMany ────────> Products (category_id)
Product (Anak) ────── belongsTo ────────> Category

Many to Many:
User ───────────── belongsToMany ───────> [ role_user (Pivot) ] <─── belongsToMany ─── Role

Polymorphic One to Many:
Post ─────────────── morphMany ─────────> [ comments (id, body, commentable_id, commentable_type) ]
Video ────────────── morphMany ─────────>
```

#### C. Alur Penanganan N+1 Problem (Eager Loading)

```text
       ┌────────────────────────────────────────────────────────┐
       │             Deteksi Akses Data Relasi di Loop          │
       └───────┬────────────────────────────────┬───────────────┘
               │                                │
               ▼                                ▼
       Lazy Loading (Bahaya N+1)       Eager Loading (with())
               │                                │
               ▼                                ▼
       SELECT * FROM posts;             SELECT * FROM posts;
       SELECT * FROM users (Loop 100x)  SELECT * FROM users WHERE id IN (1..100);
               │                                │
               ▼                                ▼
       101 Query SQL Lambat             Hanya 2 Query SQL Cepat!
```

---

<a id="bagian-43"></a>

## 43. 📚 Tabel Ringkasan

| Kategori | Fitur / Kebutuhan | Method / Sintaks Utama | Fungsi & Kegunaan |
|---|---|---|---|
| **Pembuatan** | Model Baru | `php artisan make:model Name -m` | Membuat class Model beserta migration |
| **Insert** | Simpan Massal | `Model::create(attributes)` | Insert data baru (wajib `$fillable`) |
| **Insert** | Simpan Objek | `$model = new Model(); $model->save()` | Isi properti objek lalu insert ke database |
| **Insert** | Cek / Buat | `Model::firstOrCreate(cond, attr)` | Ambil data jika ada, insert jika belum ada |
| **Insert** | Update / Buat | `Model::updateOrCreate(cond, attr)` | Perbarui jika ada, buat baru jika belum ada |
| **Find** | Primary Key | `Model::findOrFail(id)` | Cari 1 ID (otomatis melempar HTTP 404 jika null) |
| **Find** | Baris Pertama | `Model::firstWhere('column', 'value')` | Shortcut `where('column', 'value')->first()` |
| **Update** | Update Instance | `$model->update(['column' => 'value'])` | Perbarui kolom dari instance objek aktif |
| **Update** | Counter Atomik | `$model->increment('column', amount)` | Tambah nilai angka tanpa race condition |
| **Delete** | Hapus Objek | `$model->delete()` | Menghapus record dari instance aktif |
| **Delete** | Hapus via ID | `Model::destroy(id)` | Hapus langsung berdasarkan ID tanpa SELECT dulu |
| **Keamanan** | Whitelist Input | `protected $fillable = ['column']` | Mencegah celah mass assignment injection |
| **Koleksi** | Saring di RAM | `$collection->filter(callback)` | Filter data di RAM tanpa query SQL ulang |
| **Soft Delete**| Hapus Maya | `use SoftDeletes;` | Mengisi `deleted_at` tanpa hapus fisik baris |
| **Soft Delete**| Data Terhapus | `Model::onlyTrashed()->get()` | Mengambil HANYA data yang berstatus terhapus |
| **Scope** | Query Reusable | `public function scopeName($query)` | Menulis query filter yang dapat dipakai berulang |
| **Scope** | Scope Otomatis | `static::addGlobalScope(new Scope)` | Pasang filter otomatis di setiap query model |
| **Relasi 1:1**| 1 ke 1 | `hasOne()` / `belongsTo()` | Hubungkan 1 record induk ke 1 record anak |
| **Relasi 1:N**| 1 ke Banyak | `hasMany()` / `belongsTo()` | Hubungkan 1 record induk ke banyak record anak |
| **Relasi N:N**| Banyak ke Banyak| `belongsToMany()` | Hubungkan relasi N:N via tabel pivot |
| **Pivot** | Selaraskan Data | `$model->roles()->sync([ids])` | Sinkronisasi ID tabel pivot (hapus & tambah) |
| **Pivot Data**| Kolom Tambahan | `->withPivot(['column'])` | Izinkan pembacaan kolom ekstra dari tabel pivot |
| **Query Relasi**| Filter Anak | `whereHas('relation', callback)` | Saring data induk berdasarkan kondisi data anak |
| **Agregasi** | Hitung Jumlah | `withCount('relation')` | Hitung jumlah anak via subquery SQL efisien |
| **Optimasi** | Anti N+1 Query | `Model::with(['relation'])` | Eager loading relasi dalam 2 query cepat |
| **Identifier**| UUID / ULID | `use HasUuids;` / `use HasUlids;` | Auto generate identifier unik non-integer |
| **Casting** | Mutasi Tipe | `protected function casts(): array` | Konversi otomatis format tipe data kolom |
| **Akses Atribut**| Manipulasi Data | `Attribute::make(get, set)` | Modifikasi nilai atribut saat dibaca/disimpan |
| **Lifecycle** | Pantau Event | `php artisan make:observer Name` | Class pemantau event lifecycle model |
| **Serialisasi**| Sembunyikan Data| `protected $hidden = ['column']` | Sembunyikan field rahasia dari JSON API |
| **Polimorfik** | 1 ke Banyak Poli| `morphMany()` / `morphTo()` | 1 tabel anak dapat dimiliki berbagai tipe induk |
| **Morph Map** | Alias Stabil | `Relation::enforceMorphMap([...])` | Alias pendek pengganti nama class di database |
| **Pembersihan**| Pruning Otomatis| `use Prunable;` | Pembersihan otomatis record usang terjadwal |

---

<a id="bagian-44"></a>

## 44. ⚡ Cheat Code Eloquent 10 Detik

```php
// 1. Ambil Data Wajib Ada (404 jika null)
$product = Product::findOrFail(1);

// 2. Query Lengkap Teroptimasi Anti N+1
$products = Product::query()
    ->where('is_active', true)
    ->with(['category', 'tags'])
    ->withCount('reviews')
    ->latest()
    ->paginate(15);

// 3. Insert & Update Singkat
$product = Product::create(['name' => 'Mouse', 'price' => 250000]);
$product->update(['price' => 275000]);

// 4. Sinkronisasi Relasi Many-to-Many
$user->roles()->sync([1, 2, 3]);

// 5. Filter Relasi Anak
$users = User::whereHas('orders', fn($q) => $q->where('total', '>', 1000000))->get();
```

Template Model Eloquent Modern Lengkap:

```php
namespace App\Models;

use App\Casts\MoneyCast;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'price',
        'stock',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'stock'     => 'integer',
            'price'     => 'decimal:2',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true)->where('stock', '>', 0);
    }

    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => ucfirst($value),
            set: fn (string $value) => strtolower($value),
        );
    }
}
```

---

<a id="bagian-45"></a>

## 45. 🧭 Urutan Belajar yang Disarankan

```text
       Langkah 1: Fondasi Model & Operasi CRUD
              │   • Membuat model & migration
              │   • create(), findOrFail(), update(), delete()
              │   • Proteksi Mass Assignment ($fillable)
              ▼
       Langkah 2: Query Builder & Eloquent Collection
              │   • Method chaining (where, orderBy, latest, exists)
              │   • Transformasi koleksi di RAM (map, filter, pluck)
              ▼
       Langkah 3: Penguasaan Seluruh Tipe Relasi
              │   • One-to-One (hasOne, belongsTo)
              │   • One-to-Many (hasMany, belongsTo)
              │   • Many-to-Many & Pivot (belongsToMany, sync, withPivot)
              ▼
       Langkah 4: Optimasi Performa & Query Lanjutan
              │   • Mengatasi N+1 Problem dengan Eager Loading (with)
              │   • Querying & Aggregating Relations (whereHas, withCount)
              ▼
       Langkah 5: Fitur Model Lanjutan & Lifecycle
              │   • Soft Deletes & Scopes (Local & Global)
              │   • Casting Modern (casts() method) & Accessors (Attribute::make)
              │   • Model Events & Observers
              ▼
       Langkah 6: Arsitektur Kompleks & Polimorfik
              │   • Has Many Through & Polymorphic Relations
              │   • Morph Map & Custom Casts
              ▼
       Langkah 7: Mini Project Terpadu E-Commerce
```

---

<a id="bagian-46"></a>

## 46. 🏗️ Mini Project: E-Commerce Catalog, Order Management & Review System

Proyek mini terpadu yang menggabungkan seluruh konsep inti Eloquent: **Migration, Model, Relasi 1:N, Relasi N:N dengan Pivot Tambahan, Relasi Polimorfik Review, Eager Loading Bebas N+1, Scopes, dan Casting Modern**.

### 1. Migration Skema Database

```php
// database/migrations/2026_01_01_000001_create_ecommerce_system_tables.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->decimal('price', 12, 2);
            $table->integer('stock')->default(0);
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('product_tag', function (Blueprint $table) {
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
            $table->primary(['product_id', 'tag_id']);
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->morphs('reviewable'); // reviewable_id & reviewable_type (Polymorphic)
            $table->unsignedTinyInteger('rating'); // 1 s.d. 5
            $table->text('comment');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('product_tag');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
    }
};
```

### 2. Definisi Model

```php
// app/Models/Category.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model {
    protected $fillable = ['name', 'slug'];

    public function products(): HasMany {
        return $this->hasMany(Product::class);
    }
}

// app/Models/Tag.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model {
    protected $fillable = ['name'];

    public function products(): BelongsToMany {
        return $this->belongsToMany(Product::class);
    }
}

// app/Models/Review.php (Polymorphic)
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Review extends Model {
    protected $fillable = ['rating', 'comment'];

    public function reviewable(): MorphTo {
        return $this->morphTo();
    }
}

// app/Models/Product.php
namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model {
    use SoftDeletes;

    protected $fillable = ['category_id', 'name', 'slug', 'price', 'stock', 'is_active'];

    protected function casts(): array {
        return [
            'is_active' => 'boolean',
            'stock'     => 'integer',
            'price'     => 'decimal:2',
        ];
    }

    public function category(): BelongsTo {
        return $this->belongsTo(Category::class);
    }

    public function tags(): BelongsToMany {
        return $this->belongsToMany(Tag::class);
    }

    public function reviews(): MorphMany {
        return $this->morphMany(Review::class, 'reviewable');
    }

    public function scopeAvailable(Builder $query): void {
        $query->where('is_active', true)->where('stock', '>', 0);
    }
}
```

### 3. Controller (`app/Http/Controllers/ProductCatalogController.php`)

```php
namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductCatalogController extends Controller
{
    public function index(Request $request)
    {
        // Query Produk Teroptimasi (Eager Load Relasi + Agregasi Review Bebas N+1)
        $products = Product::query()
            ->available()
            ->with(['category', 'tags'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->when($request->filled('category'), function ($query) use ($request) {
                $query->whereRelation('category', 'slug', $request->query('category'));
            })
            ->orderBy('price', 'asc')
            ->paginate(10);

        // Mengambil Kategori beserta Jumlah Produk Tersedianya
        $categories = Category::withCount(['products' => fn($q) => $q->available()])->get();

        return view('catalog.index', compact('products', 'categories'));
    }
}
```

#### Output Tampilan Mini Project

```text
========================================================================
                      KATALOG PRODUK E-COMMERCE
========================================================================

Daftar Kategori:
• Aksesoris Komputer (15 Produk Tersedia)
• Monitor & Display  (8 Produk Tersedia)
• Audio & Headset    (12 Produk Tersedia)

Daftar Produk:
------------------------------------------------------------------------
1. Mechanical Keyboard RGB
   Kategori   : Aksesoris Komputer
   Harga      : Rp 750.000 (Stok: 25)
   Tag        : [Gaming] [RGB] [Mechanical]
   Rating     : ⭐ 4.8 / 5.0 (Berdasarkan 42 ulasan)
------------------------------------------------------------------------
2. Wireless Gaming Mouse
   Kategori   : Aksesoris Komputer
   Harga      : Rp 350.000 (Stok: 50)
   Tag        : [Wireless] [Gaming]
   Rating     : ⭐ 4.6 / 5.0 (Berdasarkan 18 ulasan)
------------------------------------------------------------------------
3. Monitor Gaming 27 Inch 165Hz
   Kategori   : Monitor & Display
   Harga      : Rp 2.800.000 (Stok: 10)
   Tag        : [Display] [165Hz] [IPS]
   Rating     : ⭐ 4.9 / 5.0 (Berdasarkan 65 ulasan)
------------------------------------------------------------------------

Navigasi Halaman:
[ Halaman 1 dari 4 ]  « Sebelumnya  [ 1 ]  [ 2 ]  [ 3 ]  [ 4 ]  Selanjutnya »
```

#### Diagram Alur Mini Project

```text
       GET /catalog?category=aksesoris-komputer
                         │
                         ▼
       ProductCatalogController@index
                         │
                         ├──> 1. Eksekusi Category::withCount('products')
                         │       (Subquery SQL Count Cepat)
                         │
                         └──> 2. Eksekusi Product::available()->with(['category', 'tags'])
                                 ->withAvg('reviews', 'rating')
                                 (Hanya 3 Query Teroptimasi Eager Load)
                         │
                         ▼
       Kirim Data ke View 'catalog.index' ──> Tampilkan Halaman Bersih Bebas N+1
```

---

<a id="bagian-47"></a>

## 47. 🔗 Referensi Resmi

- [Laravel Documentation: Eloquent ORM Getting Started](https://laravel.com/docs/eloquent)
- [Laravel Documentation: Eloquent Relationships](https://laravel.com/docs/eloquent-relationships)
- [Laravel Documentation: Eloquent Mutators & Casts](https://laravel.com/docs/eloquent-mutators)
- [Laravel Documentation: Eloquent Collections](https://laravel.com/docs/eloquent-collections)
- [Laravel Documentation: Eloquent Serialization](https://laravel.com/docs/eloquent-serialization)
- [Laravel Documentation: Database Seeding & Factories](https://laravel.com/docs/eloquent-factories)
