---
title: "Laravel Collection"
description: "Panduan komprehensif Fluent Collection Laravel: pembuatan, transformasi (map, filter, reduce), agregasi, grouping, sorting, dan higher-order messages."
order: 4
tags:
  - web-development
  - backend
  - laravel
  - collection
  - data-processing
---

# Laravel Collection

> **Target:** pemula sampai menengah yang sudah memahami dasar PHP, array, foreach, dan dasar Laravel, lalu ingin menguasai `Illuminate\Support\Collection` secara mendalam dari nol hingga mahir.
> **Versi:** Laravel 11 / 12
> **Prasyarat:** [[laravel-dasar|Laravel Dasar]]
> Fokus modul pembelajaran ini: **Pembuatan Collection → Iterasi (`each`) → Transformasi (`map`, `flatMap`, `mapToGroups`) → Penyaringan (`filter`, `reject`, `where`) → Pengambilan (`first`, `pluck`, `value`) → Pengujian & Eksistensi (`contains`, `every`, `has`) → Pengurutan (`sortBy`, `sortKeys`) → Pengelompokan (`groupBy`, `keyBy`, `countBy`) → Agregasi (`sum`, `avg`, `percentage`) → Manipulasi array mutatif & imutatif → Partisi & Slicing → Chunking & Sliding → Operasi Himpunan (`diff`, `intersect`, `merge`, `combine`) → Utility & Conditional (`when`, `tap`, `pipe`) → Collection Macros → Lazy Collection (Pengolahan Dataset Besar & Memory Streaming via Generator) → Mini Project Analitik Transaksi E-Commerce**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami untuk mulai bekerja dengan collection, mapping, filtering, grouping, dan agregasi data

🟡 Lanjutan & Manipulasi Kompleks
→ pelajari teknik transformasi bersarang, partisi, zipping, chunking, operasi himpunan, dan pipeline utility

🔴 Performance & Operasional
→ penting saat mengolah dataset raksasa (file log/CSV giga-byte) menggunakan Lazy Collection tanpa kehabisan RAM
```

Mental model alur pemrosesan data pada Laravel Collection:

```text
       Data Mentah (Array / JSON / Hasil Query)
                         │
                         │ collect($data)
                         ▼
       Laravel Collection (Objek Pembungkus di RAM)
                         │
                         │ ->filter(fn($item) => ...)
                         ▼
       Data Tersaring (Koleksi Menengah)
                         │
                         │ ->map(fn($item) => ...)
                         ▼
       Data Tertransformasi
                         │
                         │ ->groupBy('category') / ->sum('total')
                         ▼
       Hasil Akhir (Collection / Objek / Nilai Skalar)
```

**Hafalan:**

```text
Collection      → wrapper objek di atas array dengan ratusan helper ekspresif
Method Chaining → menyambungkan beberapa operasi pengolahan data secara berurutan
Immutability    → sebagian besar method mengembalikan instance Collection baru (data asli aman)
LazyCollection  → pemrosesan data stream per baris menggunakan PHP Generator untuk hemat RAM
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Laravel Collection](#bagian-1)
2. [Membuat Collection](#bagian-2)
3. [Iterasi & Perulangan (For Each)](#bagian-3)
4. [Transformasi Dasar (Mapping)](#bagian-4)
5. [Penyaringan Data (Filtering)](#bagian-5)
6. [Mengambil Data (Retrieval)](#bagian-6)
7. [Pemeriksaan & Pengujian (Checking & Testing)](#bagian-7)
8. [Pengurutan (Ordering & Sorting)](#bagian-8)
9. [Pengelompokan (Grouping & Keying)](#bagian-9)
10. [Kalkulasi & Agregasi (Aggregates)](#bagian-10)

### 🟡 Lanjutan & Manipulasi Kompleks

11. [Manipulasi Elemen Array](#bagian-11)
12. [Partisi & Pembagian Data (Partitioning)](#bagian-12)
13. [Struktur Bersarang (Flattening & Collapsing)](#bagian-13)
14. [Penggabungan Paralel (Zipping)](#bagian-14)
15. [Pemotongan Koleksi (Slicing & Memory Pagination)](#bagian-15)
16. [Mengambil & Melompati (Take & Skip)](#bagian-16)
17. [Pecahan Data (Chunking & Sliding)](#bagian-17)
18. [Representasi String & Serialisasi](#bagian-18)
19. [Akumulasi & Reduksi Data (Reduce)](#bagian-19)
20. [Operasi Himpunan (Set Operations: Diff & Intersect)](#bagian-20)
21. [Penggabungan Koleksi (Merging & Combining)](#bagian-21)
22. [Eksekusi Kondisional & Utility Pipeline](#bagian-22)
23. [Randomisasi Data](#bagian-23)
24. [Collection Macros (Extending Collection)](#bagian-24)

### 🔴 Performance & Operasional

25. [Lazy Collection: Pengolahan Dataset Raksasa](#bagian-25)
26. [Perbandingan Performa: Collection vs Array Native vs SQL Query](#bagian-26)
27. [Perbedaan Support Collection vs Eloquent Collection](#bagian-27)

### 🛠️ Referensi & Praktik

28. [Peta Ingatan Cepat](#bagian-28)
29. [Tabel Ringkasan](#bagian-29)
30. [Cheat Code Collection 10 Detik](#bagian-30)
31. [Urutan Belajar yang Disarankan](#bagian-31)
32. [Mini Project: Pengolahan Laporan Penjualan & Analitik E-Commerce](#bagian-32)
33. [Referensi Resmi](#bagian-33)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan Laravel Collection

#### Konsep

Class `Illuminate\Support\Collection` adalah wrapper berorientasi objek yang kuat dan ekspresif untuk bekerja dengan kumpulan data array di Laravel.

Tanpa Collection, pengolahan array di PHP native sering kali membutuhkan banyak perulangan `foreach`, variabel sementara, dan fungsi array native dengan urutan argumen yang tidak konsisten (`array_map($callback, $array)` vs `array_filter($array, $callback)`).

Dengan Collection, kita dapat mengolah data menggunakan pola **Method Chaining** yang bersih dan deklaratif.

### 1. Perbandingan PHP Native vs Laravel Collection

```php
// Pendekatan PHP Native (Banyak baris & variabel sementara):
$users = [
    ['name' => 'Budi', 'role' => 'admin', 'age' => 25],
    ['name' => 'Andi', 'role' => 'user',  'age' => 17],
    ['name' => 'Citra', 'role' => 'admin', 'age' => 22],
];

$adultAdminNames = [];
foreach ($users as $user) {
    if ($user['role'] === 'admin' && $user['age'] >= 18) {
        $adultAdminNames[] = strtoupper($user['name']);
    }
}
sort($adultAdminNames);

// Pendekatan Laravel Collection (Ekspresif & deklaratif):
use Illuminate\Support\Collection;

$adultAdminNames = collect($users)
    ->where('role', 'admin')
    ->where('age', '>=', 18)
    ->pluck('name')
    ->map(fn (string $name) => strtoupper($name))
    ->sort()
    ->values();
```

#### Output

```text
Array
(
    [0] => BUDI
    [1] => CITRA
)
```

#### Cara Kerja

```text
       Input Array Mentah
               │
               │ collect($users)
               ▼
       Instansiasi Objek Collection di RAM
               │
               │ Method Chaining: where() ──> pluck() ──> map() ──> sort()
               ▼
       Hasil Akhir Terstruktur Bersih
```

**Hafalan:**

```text
collect(array)          → membungkus array menjadi objek Collection
$collection->count()    → menghitung jumlah elemen di dalam koleksi
$collection->all()      → mengambil kembali array PHP native mentah
$collection->values()   → mereset index numerik array menjadi berurutan 0, 1, 2...
```

#### Best Practice

- Gunakan Collection saat data membutuhkan 2 atau lebih langkah transformasi/penyaringan.
- Jika hanya membutuhkan 1 operasi sederhana pada array kecil (misal `in_array`), fungsi native PHP tetap sah digunakan.

---

<a id="bagian-2"></a>

## 2. 🟢 Membuat Collection

#### Konsep

Laravel menyediakan beragam cara untuk membuat (*instantiate*) objek Collection, baik dari array biasa, objek, angka urut, maupun nilai tunggal.

### 1. Menggunakan Helper Global `collect()`

```php
// Dari array numerik
$numbers = collect([10, 20, 30, 40]);

// Dari array asosiatif
$user = collect([
    'name'  => 'Budi',
    'email' => 'budi@example.com',
]);
```

### 2. Menggunakan Static Method `Collection::make()`

```php
use Illuminate\Support\Collection;

$collection = Collection::make(['PHP', 'Laravel', 'Vue', 'Docker']);
```

### 3. Membuat Collection Kosong (`Collection::empty()`)

```php
$emptyCollection = Collection::empty();
```

### 4. Membungkus Nilai Tunggal / Null (`Collection::wrap()`)

Method `wrap()` sangat berguna ketika sebuah variabel bisa bernilai `null`, `string`, atau `array`, dan kita ingin menjamin hasilnya selalu berupa Collection yang aman diiterasi:

```php
// Jika nilai berupa array, tetap dibungkus utuh
$col1 = Collection::wrap(['satu', 'dua']); // Collection berisi 2 item

// Jika nilai berupa skalar tunggal, dijadikan elemen pertama
$col2 = Collection::wrap('tunggal'); // Collection berisi ['tunggal']

// Jika nilai berupa null, otomatis menjadi Collection kosong
$col3 = Collection::wrap(null); // Collection kosong []
```

### 5. Membuat Deret Angka & Pengulangan (`times` & `range`)

```php
// 1. times: Menjalankan closure sebanyak N kali
$squares = Collection::times(5, fn (int $number) => $number * $number);
// Hasil: [1, 4, 9, 16, 25]

// 2. range: Membuat deret angka dari rentang tertentu
$numbers = Collection::range(1, 5);
// Hasil: [1, 2, 3, 4, 5]
```

#### Output

```text
Collection Times (5 item):
[1, 4, 9, 16, 25]
```

**Hafalan:**

```text
collect(value)                       → membuat instance Collection dari berbagai tipe data
Collection::make(value)              → cara deklarasi statis pembuatan Collection
Collection::empty()                  → membuat objek Collection baru yang kosong
Collection::wrap(value)              → mengonversi nilai apa pun (bahkan null) menjadi Collection aman
Collection::times(count, callback)   → membuat koleksi berisi hasil eksekusi closure sebanyak N kali
Collection::range(start, end)        → membuat koleksi deret angka dari start sampai end
```

---

<a id="bagian-3"></a>

## 3. 🟢 Iterasi & Perulangan (For Each)

#### Konsep

Untuk melakukan iterasi pada setiap elemen Collection tanpa mengubah (*mutate*) struktur data dasarnya, gunakan method `each()`. Sangat ideal untuk menjalankan efek samping (*side effects*) seperti logging, pengiriman notifikasi, atau penyimpanan database.

### 1. Penggunaan Dasar `each()`

```php
$products = collect([
    ['name' => 'Keyboard', 'price' => 750000],
    ['name' => 'Mouse',    'price' => 250000],
    ['name' => 'Monitor',  'price' => 2000000],
]);

$products->each(function (array $item, int $key) {
    echo "Index {$key}: {$item['name']} seharga Rp {$item['price']}\n";
});
```

### 2. Menghentikan Iterasi Lebih Awal (*Break Loop*)

Pada perulangan PHP native kita menggunakan kata kunci `break`. Di dalam method `each()` Collection, kembalikan nilai `false` (`return false;`) untuk menghentikan perulangan seketika:

```php
$scores = collect([80, 90, 45, 100, 70]);

$scores->each(function (int $score, int $key) {
    if ($score < 50) {
        echo "Ditemukan nilai di bawah KKM pada index {$key}! Iterasi dihentikan.\n";
        return false; // Berfungsi seperti perintah 'break;'
    }
    echo "Nilai: {$score}\n";
});
```

### 3. Iterasi Array Bersarang dengan `eachSpread()`

Jika elemen koleksi berupa array bertingkat (*nested array*), `eachSpread()` otomatis memecah setiap elemen menjadi argumen terpisah:

```php
$users = collect([
    ['Budi', 'budi@example.com', 'Admin'],
    ['Andi', 'andi@example.com', 'Editor'],
]);

$users->eachSpread(function (string $name, string $email, string $role) {
    echo "User: {$name} | Email: {$email} | Peran: {$role}\n";
});
```

#### Output

```text
Nilai: 80
Nilai: 90
Ditemukan nilai di bawah KKM pada index 2! Iterasi dihentikan.
```

**Hafalan:**

```text
$collection->each(fn(value, key) => ...)        → iterasi setiap elemen tanpa mengubah data asli
return false di dalam each                      → menghentikan iterasi (setara 'break')
$collection->eachSpread(fn(arg1, arg2) => ...)  → iterasi array bersarang langsung ke parameter terpisah
```

#### Kesalahan Umum

❌ Berharap `each()` mengembalikan array yang sudah diubah (misal menulis `$res = $col->each(fn($x) => $x * 2);`).

✅ Gunakan `map()` jika ingin mengubah dan menghasilkan koleksi baru. Gunakan `each()` murni untuk *side effect*.

---

<a id="bagian-4"></a>

## 4. 🟢 Transformasi Dasar (Mapping)

#### Konsep

Transformasi adalah proses mengubah setiap elemen di dalam koleksi menjadi bentuk/struktur baru. Method keluarga `map` selalu menghasilkan **Collection baru** tanpa merusak data aslinya (*immutable*).

### 1. Method `map()`

```php
$prices = collect([10000, 25000, 50000]);

// Menambahkan PPN 11% ke setiap harga
$totalPrices = $prices->map(function (int $price) {
    return $price * 1.11;
});
```

### 2. Method `mapWithKeys()`

Mengubah elemen koleksi sekaligus menetapkan *custom associative key*:

```php
$employees = collect([
    ['id' => 'EMP-01', 'name' => 'Budi', 'role' => 'Manager'],
    ['id' => 'EMP-02', 'name' => 'Citra', 'role' => 'Staff'],
]);

$mapped = $employees->mapWithKeys(function (array $item) {
    return [$item['id'] => $item['name'] . ' (' . $item['role'] . ')'];
});
```

Hasil:

```php
[
    'EMP-01' => 'Budi (Manager)',
    'EMP-02' => 'Citra (Staff)',
]
```

### 3. Method `flatMap()`

Melakukan mapping lalu meratakan (*flatten*) array satu level ke bawah:

```php
$users = collect([
    ['name' => 'Budi', 'tags' => ['PHP', 'Laravel']],
    ['name' => 'Citra', 'tags' => ['Vue', 'CSS']],
]);

$allTags = $users->flatMap(function (array $user) {
    return $user['tags'];
});
// Hasil: ['PHP', 'Laravel', 'Vue', 'CSS']
```

### 4. Method `mapToGroups()`

Mengelompokkan hasil mapping ke dalam key asosiatif:

```php
$users = collect([
    ['name' => 'Budi',  'department' => 'IT'],
    ['name' => 'Andi',  'department' => 'HR'],
    ['name' => 'Citra', 'department' => 'IT'],
]);

$grouped = $users->mapToGroups(function (array $user) {
    return [$user['department'] => $user['name']];
});
// Hasil: ['IT' => ['Budi', 'Citra'], 'HR' => ['Andi']]
```

### 5. Method `mapInto()`

Mengonversi setiap item di dalam koleksi menjadi objek class tertentu:

```php
class Currency {
    public function __construct(public int $amount) {}
}

$currencies = collect([50000, 100000])->mapInto(Currency::class);
```

#### Cara Kerja

```text
       Input: [10000, 20000]
                 │
                 │ map(fn($price) => $price + 5000)
                 ▼
       Output: [15000, 25000] (Instance Collection Baru)
```

**Hafalan:**

```text
$collection->map(callback)                      → transformasi setiap item menjadi nilai baru
$collection->mapWithKeys(callback)              → transformasi item menjadi pasangan [key => value]
$collection->flatMap(callback)                  → transformasi item lalu ratakan hasil array
$collection->mapToGroups(callback)              → transformasi dan kelompokkan ke key asosiatif
$collection->mapInto(ClassName::class)          → instansiasi setiap item menjadi objek ClassName
$collection->mapSpread(fn(arg1, arg2) => ...)   → mapping array bersarang ke parameter terpisah
```

---

<a id="bagian-5"></a>

## 5. 🟢 Penyaringan Data (Filtering)

#### Konsep

Penyaringan (*filtering*) memilih elemen-elemen tertentu yang memenuhi kriteria kondisi dan membuang elemen yang tidak sesuai.

### 1. Method `filter()` & `reject()`

- `filter()`: Mempertahankan elemen yang mengembalikan nilai `true`. Jika tanpa callback, otomatis membuang nilai *falsy* (`false`, `null`, `0`, `""`, `[]`).
- `reject()`: Kebalikan dari `filter()`. Membuang elemen yang mengembalikan `true`.

```php
$numbers = collect([1, 2, 3, 4, 5, 6]);

// Filter angka genap
$evens = $numbers->filter(fn (int $value) => $value % 2 === 0); // [2, 4, 6]

// Reject angka genap (hanya menyisakan ganjil)
$odds = $numbers->reject(fn (int $value) => $value % 2 === 0);  // [1, 3, 5]

// Filter tanpa callback: membersihkan nilai kosong
$clean = collect([10, null, 0, false, 'Laravel', ''])->filter(); // [10, 'Laravel']
```

### 2. Kumpulan Method `where` Berantai

```php
$products = collect([
    ['name' => 'Mouse',    'price' => 150000, 'category' => 'hardware', 'stock' => 10],
    ['name' => 'Keyboard', 'price' => 750000, 'category' => 'hardware', 'stock' => 0],
    ['name' => 'E-Book',   'price' => 50000,  'category' => 'digital',  'stock' => 100],
    ['name' => 'Voucher',  'price' => null,   'category' => 'promo',    'stock' => 5],
]);

// 1. where: perbandingan kolom = nilai
$hardware = $products->where('category', 'hardware');

// 2. where dengan operator perbandingan
$expensive = $products->where('price', '>', 100000);

// 3. whereIn & whereNotIn
$selected = $products->whereIn('category', ['digital', 'promo']);
$notHardware = $products->whereNotIn('category', ['hardware']);

// 4. whereNull & whereNotNull
$freePromos = $products->whereNull('price');
$hasPrice = $products->whereNotNull('price');

// 5. whereBetween & whereNotBetween
$medium = $products->whereBetween('price', [100000, 800000]);

// 6. whereStrict: perbandingan ketat (===)
$strict = $products->whereStrict('stock', 0);
```

### 3. Menghapus Duplikasi (`unique` & `duplicates`)

```php
$students = collect([
    ['name' => 'Budi', 'class' => '10A'],
    ['name' => 'Andi', 'class' => '10B'],
    ['name' => 'Budi', 'class' => '10C'],
]);

// Hapus duplikasi berdasarkan kolom 'name'
$uniqueStudents = $students->unique('name');

// Menemukan nilai apa saja yang duplikat
$duplicatedNames = collect(['A', 'B', 'C', 'A', 'B'])->duplicates(); // ['A', 'B']
```

#### Cara Kerja

```text
       Koleksi Awal: [1, 2, 3, 4, 5, 6]
              │
              │ filter(fn($n) => $n > 3)
              ▼
       Koleksi Hasil: [4, 5, 6]
```

**Hafalan:**

```text
$collection->filter(callback)                     → pertahankan item jika callback bernilai true
$collection->reject(callback)                     → buang item jika callback bernilai true
$collection->where('column', 'value')             → filter kolom = nilai
$collection->where('column', 'operator', 'value') → filter kolom dengan operator ('>', '<=', dll.)
$collection->whereIn('column', [values])          → filter kolom cocok dengan array nilai
$collection->whereNull('column')                  → filter kolom yang bernilai null
$collection->whereBetween('column', [min, max])   → filter kolom di dalam rentang min s.d. max
$collection->unique('column')                     → buang duplikasi data
$collection->duplicates('column')                 → ambil kumpulan nilai yang terduplikasi
```

---

<a id="bagian-6"></a>

## 6. 🟢 Mengambil Data (Retrieval)

#### Konsep

Method pengambilan (*retrieval*) digunakan untuk mengekstrak 1 elemen tertentu, nilai kolom tertentu, atau mengambil data teratas/terbawah dari sebuah koleksi.

### 1. Mengambil Nilai Pertama & Terakhir (`first`, `firstWhere`, `last`)

```php
$numbers = collect([10, 20, 30, 40, 50]);

// Ambil item paling awal
$first = $numbers->first(); // 10

// Ambil item pertama yang memenuhi kondisi
$firstAbove25 = $numbers->first(fn (int $value) => $value > 25); // 30

// firstWhere: shortcut mencari item pertama berdasarkan kolom
$users = collect([
    ['id' => 1, 'name' => 'Budi'],
    ['id' => 2, 'name' => 'Citra'],
]);
$user = $users->firstWhere('id', 2); // ['id' => 2, 'name' => 'Citra']

// Ambil item paling akhir
$last = $numbers->last(); // 50
```

### 2. Mengambil Berdasarkan Key / Index (`get`, `value`, `pull`)

```php
$settings = collect([
    'app_name' => 'Toko Laravel',
    'theme'    => 'dark',
]);

// 1. get: mengambil nilai dengan fallback default jika key tidak ada
$appName = $settings->get('app_name'); // 'Toko Laravel'
$timeout = $settings->get('timeout', 30); // 30 (nilai default)

// 2. value: shortcut mengambil 1 field dari item pertama
$products = collect([
    ['name' => 'Mouse', 'price' => 250000],
    ['name' => 'Keyboard', 'price' => 750000],
]);
$firstPrice = $products->value('price'); // 250000

// 3. pull: mengambil nilai SEKALIGUS menghapusnya dari koleksi (mutatif)
$theme = $settings->pull('theme'); // Mengembalikan 'dark', $settings sisa ['app_name' => ...]
```

### 3. Mengekstrak Kolom Tertentu (`pluck`)

```php
$users = collect([
    ['id' => 101, 'name' => 'Budi', 'role' => 'Admin'],
    ['id' => 102, 'name' => 'Andi', 'role' => 'Editor'],
]);

// Ambil array nilai dari kolom 'name' saja
$names = $users->pluck('name'); // ['Budi', 'Andi']

// Pluck dengan custom key: [key_column => value_column]
$roleById = $users->pluck('role', 'id');
// Hasil: [101 => 'Admin', 102 => 'Editor']
```

### 4. Method `sole()`

Mengambil tepat 1 elemen yang cocok. Melempar error `ItemNotFoundException` jika data kosong, atau `MultipleItemsFoundException` jika ditemukan lebih dari 1 data:

```php
$user = $users->sole('id', 101);
```

**Hafalan:**

```text
$collection->first(callback)                          → ambil elemen pertama (bisa null)
$collection->firstWhere('column', 'value')            → shortcut ambil elemen pertama sesuai kolom
$collection->last(callback)                           → ambil elemen terakhir
$collection->get('key', 'default_value')              → ambil nilai key dengan fallback default
$collection->pluck('value_column', 'key_column')      → ekstrak array kolom tertentu
$collection->value('column')                          → ambil nilai kolom dari item pertama
$collection->pull('key')                              → ambil nilai sekaligus buang dari koleksi
$collection->sole('column', 'value')                  → ambil tepat 1 item (error jika 0 atau >1)
```

---

<a id="bagian-7"></a>

## 7. 🟢 Pemeriksaan & Pengujian (Checking & Testing)

#### Konsep

Kumpulan method untuk menguji kondisi isi data, mengecek ketersediaan elemen, atau memverifikasi apakah seluruh elemen memenuhi aturan tertentu. Menghasilkan nilai boolean `true` atau `false`.

### 1. Cek Kekosongan Data (`isEmpty`, `isNotEmpty`)

```php
$cart = collect([]);

$isEmpty = $cart->isEmpty();       // true
$hasItems = $cart->isNotEmpty();   // false
```

### 2. Cek Keberadaan Elemen (`contains`, `doesntContain`)

```php
$fruits = collect(['Apel', 'Jeruk', 'Mangga']);

// 1. Cek nilai skalar
$hasMango = $fruits->contains('Mangga'); // true

// 2. Cek dengan callback
$numbers = collect([10, 25, 50, 75]);
$hasHigh = $numbers->contains(fn (int $val) => $val > 100); // false

// 3. Cek pasangan key/value pada array asosiatif
$users = collect([['name' => 'Budi', 'role' => 'admin']]);
$hasAdmin = $users->contains('role', 'admin'); // true

// 4. doesntContain: kebalikan contains
$noSuper = $users->doesntContain('role', 'superadmin'); // true
```

### 3. Cek Keberadaan Key Asosiatif (`has`, `hasAny`)

```php
$profile = collect([
    'name'  => 'Budi',
    'email' => 'budi@example.com',
]);

// Cek apakah key tertentu ada
$hasEmail = $profile->has('email'); // true
$hasBoth = $profile->has(['name', 'phone']); // false (karena phone tidak ada)

// hasAny: return true jika MINIMAL SALAH SATU key ada
$hasAny = $profile->hasAny(['phone', 'email']); // true
```

### 4. Validasi Menyeluruh (`every`, `some`, `search`)

```php
$scores = collect([80, 85, 90, 78]);

// every: return true HANYA JIKA SEMUA elemen lulus kondisi
$allPassed = $scores->every(fn (int $score) => $score >= 75); // true

// search: mencari index posisi dari data tertentu
$fruits = collect(['Apel', 'Jeruk', 'Mangga']);
$index = $fruits->search('Jeruk'); // 1 (mengembalikan false jika tidak ada)
```

**Hafalan:**

```text
$collection->isEmpty()                  → cek apakah koleksi kosong (true/false)
$collection->isNotEmpty()               → cek apakah koleksi memiliki isi (true/false)
$collection->contains('column', 'value')→ cek ketersediaan data cocok
$collection->doesntContain('value')     → cek ketiadaan data
$collection->has(['key1', 'key2'])      → cek apakah seluruh key ada di koleksi
$collection->hasAny(['key1', 'key2'])   → cek apakah minimal salah satu key ada
$collection->every(callback)            → cek apakah seluruh elemen memenuhi kondisi
$collection->search('value')            → cari posisi index elemen (return index / false)
```

---

<a id="bagian-8"></a>

## 8. 🟢 Pengurutan (Ordering & Sorting)

#### Konsep

Mengurutkan elemen di dalam koleksi, baik berdasarkan nilai langsung, nilai kolom tertentu, maupun berdasarkan urutan key asosiatif.

### 1. Mengurutkan Nilai Skalar (`sort` & `reverse`)

```php
$numbers = collect([5, 3, 8, 1, 4]);

// Urutkan terkecil ke terbesar (Ascending)
$sorted = $numbers->sort()->values(); // [1, 3, 4, 5, 8]

// Membalikkan urutan koleksi
$reversed = $sorted->reverse()->values(); // [8, 5, 4, 3, 1]
```

### 2. Mengurutkan Berdasarkan Kolom (`sortBy` & `sortByDesc`)

```php
$products = collect([
    ['name' => 'Mouse',    'price' => 250000],
    ['name' => 'Monitor',  'price' => 2000000],
    ['name' => 'Keyboard', 'price' => 750000],
]);

// 1. Urutkan dari harga termurah ke termahal
$cheapestFirst = $products->sortBy('price')->values();

// 2. Urutkan dari harga termahal ke termurah
$expensiveFirst = $products->sortByDesc('price')->values();

// 3. Pengurutan multi-kriteria menggunakan array
$users = collect([
    ['role' => 'admin', 'age' => 30],
    ['role' => 'admin', 'age' => 22],
    ['role' => 'user',  'age' => 25],
]);
$sortedUsers = $users->sortBy([
    ['role', 'asc'],
    ['age', 'desc'],
])->values();
```

### 3. Mengurutkan Berdasarkan Key Asosiatif (`sortKeys`, `sortKeysDesc`)

```php
$data = collect([
    'c' => 'Citra',
    'a' => 'Andi',
    'b' => 'Budi',
]);

$sortedByKey = $data->sortKeys();
// Hasil: ['a' => 'Andi', 'b' => 'Budi', 'c' => 'Citra']
```

#### Cara Kerja

```text
       Input: [3, 1, 2]
                │
                │ sortBy(fn($x) => $x)
                ▼
       Output: [1, 2, 3]
```

**Hafalan:**

```text
$collection->sort()                     → urutkan nilai skalar ascending
$collection->sortBy('column')           → urutkan berdasarkan kolom ascending
$collection->sortByDesc('column')       → urutkan berdasarkan kolom descending
$collection->sortKeys()                 → urutkan berdasarkan key asosiatif A-Z
$collection->sortKeysDesc()             → urutkan berdasarkan key asosiatif Z-A
$collection->reverse()                  → balikkan urutan isi koleksi
```

#### Best Practice

- Selalu sambungkan dengan `->values()` setelah pemanggilan `sort()` atau `sortBy()` pada array terindeks numerik untuk mereset kunci index agar kembali rapi mulai dari `0`.

---

<a id="bagian-9"></a>

## 9. 🟢 Pengelompokan (Grouping & Keying)

#### Konsep

- `groupBy()`: Mengelompokkan banyak elemen menjadi array bertingkat berdasarkan kategori tertentu.
- `keyBy()`: Menetapkan salah satu kolom unik sebagai key asosiatif koleksi (elemen dengan key sama akan saling menimpa).
- `countBy()`: Menghitung frekuensi kemunculan setiap kategori.

### 1. Method `groupBy()`

```php
$students = collect([
    ['name' => 'Budi',  'class' => '10A', 'gender' => 'male'],
    ['name' => 'Citra', 'class' => '10B', 'gender' => 'female'],
    ['name' => 'Andi',  'class' => '10A', 'gender' => 'male'],
    ['name' => 'Dewi',  'class' => '10B', 'gender' => 'female'],
]);

// 1. Grouping 1 tingkat berdasarkan kelas
$byClass = $students->groupBy('class');
/*
Hasil:
[
    '10A' => [['name' => 'Budi', ...], ['name' => 'Andi', ...]],
    '10B' => [['name' => 'Citra', ...], ['name' => 'Dewi', ...]],
]
*/

// 2. Multi-level Grouping (Kelas lalu Gender)
$byClassAndGender = $students->groupBy(['class', 'gender']);
```

### 2. Method `keyBy()`

Mengubah key koleksi menjadi nilai dari kolom tertentu:

```php
$users = collect([
    ['id' => 101, 'name' => 'Budi', 'email' => 'budi@example.com'],
    ['id' => 102, 'name' => 'Andi', 'email' => 'andi@example.com'],
]);

$keyedById = $users->keyBy('id');
/*
Hasil:
[
    101 => ['id' => 101, 'name' => 'Budi', ...],
    102 => ['id' => 102, 'name' => 'Andi', ...],
]
*/

// Akses instan tanpa looping
$user101 = $keyedById->get(101);
```

### 3. Method `countBy()`

Menghitung frekuensi data otomatis:

```php
$emails = collect([
    'budi@gmail.com',
    'andi@yahoo.com',
    'citra@gmail.com',
    'dewi@gmail.com',
]);

// Hitung frekuensi domain email
$domainCounts = $emails->countBy(function (string $email) {
    return explode('@', $email)[1];
});
// Hasil: ['gmail.com' => 3, 'yahoo.com' => 1]
```

#### Cara Kerja

```text
       Input: [Item A (Cat 1), Item B (Cat 2), Item C (Cat 1)]
                               │
                               │ groupBy('category')
                               ▼
       Output: [
           'Cat 1' => [Item A, Item C],
           'Cat 2' => [Item B]
       ]
```

**Hafalan:**

```text
$collection->groupBy('column')          → kelompokkan kumpulan item menjadi array bertingkat
$collection->keyBy('column')            → tetapkan kolom unik sebagai key asosiatif
$collection->countBy(callback)          → hitung jumlah frekuensi kemunculan per grup
```

---

<a id="bagian-10"></a>

## 10. 🟢 Kalkulasi & Agregasi (Aggregates)

#### Konsep

Melakukan perhitungan matematis dan kalkulasi statistik secara langsung terhadap kumpulan nilai numerik atau properti objek di dalam koleksi.

### 1. Operasi Statistik Dasar (`sum`, `avg`, `min`, `max`, `count`)

```php
$orders = collect([
    ['product' => 'Keyboard', 'price' => 750000, 'qty' => 2],
    ['product' => 'Mouse',    'price' => 250000, 'qty' => 1],
    ['product' => 'Monitor',  'price' => 2000000, 'qty' => 1],
]);

// 1. Total jumlah elemen
$totalItems = $orders->count(); // 3

// 2. sum: Menjumlahkan nilai kolom
$totalPrice = $orders->sum('price'); // 3000000

// sum dengan kalkulasi closure (price * qty)
$grandTotal = $orders->sum(fn (array $item) => $item['price'] * $item['qty']); // 3750000

// 3. avg / average: Rata-rata harga
$averagePrice = $orders->avg('price'); // 1000000

// 4. min & max: Harga termurah dan termahal
$cheapest = $orders->min('price'); // 250000
$mostExpensive = $orders->max('price'); // 2000000
```

### 2. Statistik Lanjutan (`median`, `mode`, `percentage`)

```php
$scores = collect([10, 20, 20, 40, 50, 90, 100]);

// 1. Nilai tengah (Median)
$median = $scores->median(); // 40

// 2. Nilai yang paling sering muncul (Mode)
$mode = $scores->mode(); // [20]

// 3. percentage: Menghitung persentase data yang memenuhi kriteria (Laravel modern)
$percentagePassed = $scores->percentage(fn (int $score) => $score >= 50); // 42.85%
```

#### Output

```text
Total Belanja: Rp 3.750.000
Rata-rata Harga: Rp 1.000.000
Persentase Lulus: 42.85%
```

**Hafalan:**

```text
$collection->count()                   → hitung total elemen koleksi
$collection->sum('column')             → total penjumlahan nilai kolom
$collection->avg('column')             → nilai rata-rata kolom
$collection->min('column')             → nilai minimum kolom
$collection->max('column')             → nilai maksimum kolom
$collection->median('column')          → nilai tengah statistik
$collection->mode('column')            → nilai modus yang paling sering muncul
$collection->percentage(callback)      → persentase elemen yang memenuhi kondisi (0-100)
```

---

<a id="bagian-11"></a>

## 11. 🟡 Manipulasi Elemen Array

#### Konsep

Kumpulan method untuk memodifikasi, menyisipkan, dan menghapus elemen dari awal, akhir, atau posisi tertentu di dalam koleksi.

### 1. Menambah & Menyisipkan Data (`push`, `prepend`, `put`, `pad`)

```php
$stack = collect(['B', 'C']);

// 1. push: Menambahkan item ke urutan PALING AKHIR
$stack->push('D'); // ['B', 'C', 'D']

// 2. prepend: Menambahkan item ke urutan PALING AWAL
$stack->prepend('A'); // ['A', 'B', 'C', 'D']

// 3. put: Menetapkan key dan value asosiatif
$user = collect(['name' => 'Budi']);
$user->put('email', 'budi@example.com');

// 4. pad: Mengisi koleksi dengan nilai default hingga mencapai panjang tertentu
$padded = collect([1, 2])->pad(5, 0); // [1, 2, 0, 0, 0]
```

### 2. Mengambil & Menghapus Data (`pop`, `shift`, `forget`, `splice`)

```php
$items = collect(['satu', 'dua', 'tiga', 'empat']);

// 1. pop: Mengambil dan MENGHAPUS item PALING AKHIR (mutatif)
$last = $items->pop(); // 'empat', $items sisa ['satu', 'dua', 'tiga']

// 2. shift: Mengambil dan MENGHAPUS item PALING AWAL (mutatif)
$first = $items->shift(); // 'satu', $items sisa ['dua', 'tiga']

// 3. forget: Menghapus item berdasarkan key tanpa return value (mutatif)
$profile = collect(['name' => 'Budi', 'secret' => '123456']);
$profile->forget('secret'); // 'secret' terhapus

// 4. splice: Memotong dan mengganti bagian tertentu dari koleksi (mutatif)
$numbers = collect([10, 20, 30, 40, 50]);
$chunk = $numbers->splice(1, 2, [99, 100]); 
// $chunk berisi [20, 30], $numbers menjadi [10, 99, 100, 40, 50]
```

### 3. Transformasi Langsung di Tempat (`transform`)

Berbeda dengan `map()` yang membuat koleksi baru, `transform()` memodifikasi koleksi asal secara langsung di tempat (*mutates original collection*):

```php
$prices = collect([100, 200, 300]);
$prices->transform(fn (int $val) => $val * 2);
// $prices langsung berubah menjadi [200, 400, 600]
```

**Hafalan:**

```text
$collection->push(value)               → sisipkan item di akhir koleksi
$collection->prepend(value)            → sisipkan item di awal koleksi
$collection->put('key', 'value')       → simpan pasangan key => value asosiatif
$collection->pop()                     → ambil & hapus item terakhir
$collection->shift()                   → ambil & hapus item pertama
$collection->forget('key')             → hapus elemen berdasarkan key
$collection->splice(index, count, rep) → potong dan ganti elemen pada posisi index
$collection->transform(callback)       → mutasi setiap elemen langsung di tempat (in-place)
```

---

<a id="bagian-12"></a>

## 12. 🟡 Partisi & Pembagian Data (Partitioning)

#### Konsep

Method `partition()` memisahkan sebuah koleksi menjadi **dua koleksi terpisah** dalam satu langkah evaluasi logika:
1. Koleksi pertama: Berisi elemen yang lulus pengujian kondisi (`true`).
2. Koleksi kedua: Berisi elemen yang gagal pengujian kondisi (`false`).

### 1. Penggunaan Dasar `partition()`

Menggunakan fitur PHP *Array Destructuring* `[$passed, $failed]`:

```php
$students = collect([
    ['name' => 'Budi',  'score' => 85],
    ['name' => 'Andi',  'score' => 45],
    ['name' => 'Citra', 'score' => 90],
    ['name' => 'Dewi',  'score' => 60],
]);

// Pisahkan antara siswa yang LULUS (score >= 75) dan REMEDIAL (< 75)
[$passedStudents, $remedialStudents] = $students->partition(function (array $student) {
    return $student['score'] >= 75;
});
```

#### Output

```text
Siswa Lulus:
- Budi (85)
- Citra (90)

Siswa Remedial:
- Andi (45)
- Dewi (60)
```

#### Cara Kerja

```text
       Koleksi Siswa: [Budi (85), Andi (45), Citra (90), Dewi (60)]
                                     │
                                     │ partition(fn($s) => $s['score'] >= 75)
                     ┌───────────────┴───────────────┐
                     ▼                               ▼
       Koleksi Lulus (True)            Koleksi Remedial (False)
       [Budi (85), Citra (90)]         [Andi (45), Dewi (60)]
```

**Hafalan:**

```text
[$passed, $failed] = $collection->partition(callback)
→ membelah koleksi menjadi 2 bagian [Array True, Array False]
```

---

<a id="bagian-13"></a>

## 13. 🟡 Struktur Bersarang (Flattening & Collapsing)

#### Konsep

- `collapse()`: Menggabungkan kumpulan array di dalam array menjadi satu array datar (*1 level*).
- `flatten()`: Meratakan array bersarang multi-level yang sangat dalam menjadi satu tingkat datar.
- `crossJoin()`: Menghasilkan kombinasi silang (perkalian *Cartesian Product*) antar koleksi.

### 1. Method `collapse()`

```php
$matrix = collect([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]);

$flat = $matrix->collapse()->values();
// Hasil: [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### 2. Method `flatten()`

```php
$deepNested = collect([
    'Apple' => [
        'iPhone' => ['iPhone 13', 'iPhone 14'],
        'Mac'    => ['MacBook Air', 'MacBook Pro'],
    ],
    'Google' => ['Pixel 7', 'Pixel 8'],
]);

// Ratakan seluruh kedalaman hirarki menjadi array 1 dimensi
$allDevices = $deepNested->flatten()->values();
// Hasil: ['iPhone 13', 'iPhone 14', 'MacBook Air', 'MacBook Pro', 'Pixel 7', 'Pixel 8']

// Ratakan dengan batasan kedalaman level (misal hanya 1 tingkat)
$levelOne = $deepNested->flatten(1);
```

### 3. Kombinasi Silang (`crossJoin`)

```php
$sizes = collect(['S', 'M', 'L']);
$colors = collect(['Merah', 'Biru']);

$variants = $sizes->crossJoin($colors);
/*
Hasil (6 kombinasi):
[
    ['S', 'Merah'], ['S', 'Biru'],
    ['M', 'Merah'], ['M', 'Biru'],
    ['L', 'Merah'], ['L', 'Biru'],
]
*/
```

**Hafalan:**

```text
$collection->collapse()                      → gabungkan array multi-dimensi 1 tingkat ke bawah
$collection->flatten(depth)                  → ratakan seluruh hirarki bersarang menjadi 1 dimensi
$collection->crossJoin([array1, array2])     → buat kombinasi silang perkalian Cartesian
```

---

<a id="bagian-14"></a>

## 14. 🟡 Penggabungan Paralel (Zipping)

#### Konsep

Method `zip()` menggabungkan elemen dari koleksi asal dengan nilai dari array/koleksi lain yang berada pada posisi index yang sama secara paralel.

### 1. Penggunaan `zip()`

```php
$names = collect(['Budi', 'Andi', 'Citra']);
$roles = collect(['Admin', 'Editor', 'Author']);
$salaries = collect([10000000, 7500000, 6000000]);

$zipped = $names->zip($roles, $salaries);
/*
Hasil:
[
    ['Budi', 'Admin', 10000000],
    ['Andi', 'Editor', 7500000],
    ['Citra', 'Author', 6000000],
]
*/
```

#### Cara Kerja

```text
       Index 0: 'Budi'   + 'Admin'  + 10000000 ──> ['Budi', 'Admin', 10000000]
       Index 1: 'Andi'   + 'Editor' + 7500000  ──> ['Andi', 'Editor', 7500000]
       Index 2: 'Citra'  + 'Author' + 6000000  ──> ['Citra', 'Author', 6000000]
```

**Hafalan:**

```text
$collection->zip([array1, array2]) → pasangkan elemen antar koleksi berdasarkan kesamaan index
```

---

<a id="bagian-15"></a>

## 15. 🟡 Pemotongan Koleksi (Slicing & Memory Pagination)

#### Konsep

Mengambil sebagian potongan (*slice*) dari koleksi data di memori atau membaginya untuk kebutuhan paginasi manual.

### 1. Method `slice()`

```php
$letters = collect(['A', 'B', 'C', 'D', 'E', 'F']);

// Ambil mulai dari index 2 sebanyak 3 elemen
$slice = $letters->slice(2, 3)->values(); // ['C', 'D', 'E']
```

### 2. Paginasi Memori dengan `forPage()`

Mengambil subset data berdasarkan nomor halaman dan jumlah item per halaman:

```php
$products = collect(range(1, 50)); // 50 produk

$pageNumber = 2;
$perPage = 10;

// Mengambil 10 produk untuk Halaman 2 (item 11 s.d. 20)
$pageTwoProducts = $products->forPage($pageNumber, $perPage)->values();
```

### 3. Membagi Koleksi (`split` & `splitIn`)

```php
$numbers = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// split(3): Membagi menjadi 3 grup yang berukuran rata
$groups = $numbers->split(3);
// Grup 1: [1, 2, 3, 4], Grup 2: [5, 6, 7], Grup 3: [8, 9, 10]

// splitIn(3): Membagi menjadi 3 grup dengan ukuran presisi
$groupsIn = $numbers->splitIn(3);
```

**Hafalan:**

```text
$collection->slice(offset, length)      → potong koleksi mulai dari offset sebanyak length
$collection->forPage(page, perPage)     → ambil potongan data sesuai nomor halaman dan perPage
$collection->split(number_of_groups)    → bagi koleksi menjadi N grup berukuran rata
$collection->splitIn(number_of_groups)  → bagi koleksi persis menjadi N grup
```

---

<a id="bagian-16"></a>

## 16. 🟡 Mengambil & Melompati (Take & Skip)

#### Konsep

- `take(limit)`: Mengambil N item pertama (atau N item terakhir jika bernilai negatif).
- `skip(count)`: Melompati N item pertama dan mengambil sisanya.
- `takeUntil()` / `takeWhile()`: Mengambil data secara kontinu hingga/selama kondisi terpenuhi.
- `skipUntil()` / `skipWhile()`: Melompati data secara kontinu hingga/selama kondisi terpenuhi.

### 1. Method `take()` & `skip()`

```php
$numbers = collect([10, 20, 30, 40, 50, 60]);

// Ambil 3 item teratas
$topThree = $numbers->take(3)->values(); // [10, 20, 30]

// Ambil 2 item terbawah (angka negatif)
$bottomTwo = $numbers->take(-2)->values(); // [50, 60]

// Lewati 2 item pertama, ambil sisanya
$skipped = $numbers->skip(2)->values(); // [30, 40, 50, 60]
```

### 2. Pengambilan Bersyarat (`takeWhile` & `takeUntil`)

```php
$temperatures = collect([28, 29, 31, 35, 42, 30, 25]);

// takeWhile: Ambil terus SELAMA suhu < 40. Berhenti seketika saat mencapai 42!
$normalTemps = $temperatures->takeWhile(fn (int $temp) => $temp < 40)->values();
// Hasil: [28, 29, 31, 35]

// takeUntil: Ambil terus SAMPAI suhu mencapai 35. Berhenti saat menemukan 35!
$beforeHot = $temperatures->takeUntil(fn (int $temp) => $temp >= 35)->values();
// Hasil: [28, 29, 31]
```

### 3. Pelompatan Bersyarat (`skipWhile` & `skipUntil`)

```php
$queue = collect(['VIP-1', 'VIP-2', 'REG-1', 'REG-2']);

// skipWhile: Lewati terus selama masih berawalan 'VIP-'
$regulars = $queue->skipWhile(fn (string $item) => str_starts_with($item, 'VIP-'))->values();
// Hasil: ['REG-1', 'REG-2']
```

**Hafalan:**

```text
$collection->take(amount)           → ambil N elemen pertama (negatif = dari belakang)
$collection->skip(amount)           → lompati N elemen pertama
$collection->takeWhile(callback)    → ambil item selama kondisi callback bernilai true
$collection->takeUntil(callback)    → ambil item hingga kondisi callback menjadi true
$collection->skipWhile(callback)    → lompati item selama kondisi callback bernilai true
$collection->skipUntil(callback)    → lompati item hingga kondisi callback menjadi true
```

---

<a id="bagian-17"></a>

## 17. 🟡 Pecahan Data (Chunking & Sliding)

#### Konsep

- `chunk(size)`: Memecah koleksi besar menjadi potongan-potongan kecil berukuran tetap.
- `chunkWhile()`: Memecah koleksi setiap kali terjadi perubahan kondisi.
- `sliding(size, step)`: Membuat jendela geser (*sliding window*) untuk analisis data berurutan.

### 1. Method `chunk()`

Sangat ideal untuk membuat tata letak grid baris pada UI atau pemrosesan batch:

```php
$products = collect(['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7']);

// Pecah menjadi baris berisi 3 produk per baris
$gridRows = $products->chunk(3);
/*
Hasil:
Row 1: ['P1', 'P2', 'P3']
Row 2: ['P4', 'P5', 'P6']
Row 3: ['P7']
*/
```

### 2. Method `sliding()` (Jendela Geser)

```php
$dailySales = collect([100, 120, 130, 150, 180]);

// Sliding window berukuran 3 hari untuk menghitung Moving Average
$windows = $dailySales->sliding(3);
/*
Hasil:
Window 1: [100, 120, 130]
Window 2: [120, 130, 150]
Window 3: [130, 150, 180]
*/
```

#### Cara Kerja

```text
       Input: [1, 2, 3, 4, 5, 6, 7]
                     │
                     │ chunk(3)
                     ▼
       Chunk 1: [1, 2, 3]
       Chunk 2: [4, 5, 6]
       Chunk 3: [7]
```

**Hafalan:**

```text
$collection->chunk(size)            → pecah koleksi menjadi array berisi kumpulan berukuran size
$collection->chunkWhile(callback)   → pecah koleksi secara dinamis selama callback bernilai true
$collection->sliding(size, step)    → buat jendela geser berurutan untuk analisis data deret
```

---

<a id="bagian-18"></a>

## 18. 🟡 Representasi String & Serialisasi

#### Konsep

Mengubah isi koleksi menjadi format teks string terformat, string JSON untuk respons API, atau mengekspornya kembali menjadi array native.

### 1. Menggabungkan Menjadi String (`implode` & `join`)

```php
$tags = collect(['PHP', 'Laravel', 'Vue']);

// 1. implode: Menggabungkan nilai dengan pemisah
$tagString = $tags->implode(', '); // 'PHP, Laravel, Vue'

// implode pada array asosiatif
$users = collect([['name' => 'Budi'], ['name' => 'Andi']]);
$userNames = $users->implode('name', ', '); // 'Budi, Andi'

// 2. join: Menggabungkan dengan penanganan tata bahasa untuk item terakhir
$niceSentence = $tags->join(', ', ' dan '); 
// Hasil: 'PHP, Laravel dan Vue'
```

### 2. Serialisasi JSON & Array (`toJson`, `toArray`)

```php
$data = collect([
    'app'     => 'E-Commerce',
    'version' => '1.0.0',
    'status'  => 'active',
]);

// 1. Konversi ke JSON String
$jsonString = $data->toJson(JSON_PRETTY_PRINT);

// 2. Konversi ke Array PHP Native
$nativeArray = $data->toArray();
```

**Hafalan:**

```text
$collection->implode('column', 'glue')      → gabungkan nilai kolom menjadi string berpembatas
$collection->join('glue', 'final_glue')     → gabungkan string dengan penutup khusus di akhir
$collection->toJson()                       → ubah koleksi menjadi format teks JSON
$collection->toArray()                      → ubah koleksi menjadi array PHP native biasa
```

---

<a id="bagian-19"></a>

## 19. 🟡 Akumulasi & Reduksi Data (Reduce)

#### Konsep

Method `reduce()` mengakumulasi seluruh elemen koleksi secara iteratif dari kiri ke kanan sehingga menghasilkan **satu nilai tunggal** (*single scalar value*).

Method `scan()` mirip dengan `reduce`, namun menyimpan seluruh tahapan akumulasi sementara ke dalam koleksi baru.

### 1. Penggunaan Dasar `reduce()`

```php
$cart = collect([
    ['item' => 'Buku',   'price' => 50000, 'qty' => 2],
    ['item' => 'Pensil', 'price' => 5000,  'qty' => 5],
    ['item' => 'Tas',    'price' => 150000, 'qty' => 1],
]);

// Hitung total seluruh belanja dengan nilai awal $initial = 0
$totalCart = $cart->reduce(function (int $carry, array $item) {
    return $carry + ($item['price'] * $item['qty']);
}, 0);

echo "Total: Rp {$totalCart}"; // Total: Rp 275.000
```

### 2. Method `scan()` (Menyimpan Riwayat Akumulasi)

```php
$deposits = collect([10000, 20000, 50000]);

// Akumulasi saldo tabungan berjalan
$runningBalance = $deposits->scan(function (int $carry, int $deposit) {
    return $carry + $deposit;
}, 0);
// Hasil: [0, 10000, 30000, 80000]
```

#### Cara Kerja

```text
       Carry Awal: 0
       Iterasi 1: Carry 0 + (50000 * 2) = 100000
       Iterasi 2: Carry 100000 + (5000 * 5) = 125000
       Iterasi 3: Carry 125000 + (150000 * 1) = 275000
       Hasil Akhir: 275000
```

**Hafalan:**

```text
$collection->reduce(fn(carry, item) => ..., initial) → akumulasi koleksi menjadi 1 nilai tunggal
$collection->scan(fn(carry, item) => ..., initial)   → akumulasi koleksi dengan menyimpan riwayat tahapan
```

---

<a id="bagian-20"></a>

## 20. 🟡 Operasi Himpunan (Set Operations: Diff & Intersect)

#### Konsep

Operasi matematika himpunan untuk membandingkan dua koleksi:
- `diff()`: Mencari elemen yang ada di koleksi A tapi **TIDAK ADA** di koleksi B (Selisih).
- `intersect()`: Mencari elemen yang **ADA DI KEDUA** koleksi (Irisan).

### 1. Operasi Selisih (`diff`, `diffKeys`, `diffAssoc`)

```php
$requiredSkills = collect(['PHP', 'Laravel', 'MySQL', 'Docker']);
$candidateSkills = collect(['PHP', 'Laravel', 'Vue']);

// Cari skill yang BELUM DIMILIKI kandidat (Required - Candidate)
$missingSkills = $requiredSkills->diff($candidateSkills)->values();
// Hasil: ['MySQL', 'Docker']

// diffKeys: Membandingkan perbedaan key asosiatif
$formFields = collect(['name' => 'Budi', 'email' => 'budi@test.com', 'age' => 25]);
$schema = collect(['name' => '', 'email' => '']);
$extraFields = $formFields->diffKeys($schema); // ['age' => 25]
```

### 2. Operasi Irisan (`intersect`, `intersectByKeys`)

```php
$adminPermissions = collect(['create', 'read', 'update', 'delete']);
$userPermissions = collect(['read', 'update', 'share']);

// Ambil hak akses yang sama-sama dimiliki
$common = $adminPermissions->intersect($userPermissions)->values();
// Hasil: ['read', 'update']
```

#### Cara Kerja

```text
       Himpunan A: [PHP, Laravel, MySQL, Docker]
       Himpunan B: [PHP, Laravel, Vue]
       
       A diff B      ──> [MySQL, Docker]
       A intersect B ──> [PHP, Laravel]
```

**Hafalan:**

```text
$collection->diff([array])            → cari elemen yang ada di koleksi utama tapi tidak ada di target
$collection->diffKeys([array])        → cari perbedaan berdasarkan nama key asosiatif
$collection->intersect([array])       → cari elemen yang beririsan (ada di kedua belah pihak)
$collection->intersectByKeys([array]) → cari irisan berdasarkan kecocokan key asosiatif
```

---

<a id="bagian-21"></a>

## 21. 🟡 Penggabungan Koleksi (Merging & Combining)

#### Konsep

- `merge()`: Menggabungkan array; jika key asosiatif sama, nilai lama akan ditimpa.
- `mergeRecursive()`: Menggabungkan array; jika key asosiatif sama, nilainya akan digabung menjadi array bertingkat.
- `combine()`: Menggabungkan dua koleksi di mana koleksi 1 menjadi **Key** dan koleksi 2 menjadi **Value**.
- `concat()`: Menambahkan elemen array numerik ke akhir koleksi tanpa mengubah index numerik.

### 1. Method `merge()` & `mergeRecursive()`

```php
$defaultSettings = collect(['theme' => 'light', 'notifications' => true]);
$userSettings = collect(['theme' => 'dark', 'volume' => 80]);

// merge: Nilai 'dark' menimpa 'light'
$finalSettings = $defaultSettings->merge($userSettings);
// Hasil: ['theme' => 'dark', 'notifications' => true, 'volume' => 80]

// mergeRecursive: Menggabungkan isi key sama ke dalam array
$arr1 = collect(['tags' => ['PHP']]);
$arr2 = collect(['tags' => ['Laravel']]);
$merged = $arr1->mergeRecursive($arr2);
// Hasil: ['tags' => ['PHP', 'Laravel']]
```

### 2. Method `combine()` (Pasangan Key-Value)

```php
$headers = collect(['ID', 'Nama', 'Jabatan']);
$row = collect([101, 'Budi', 'Manager']);

// Buat array asosiatif dari dua array terpisah
$employee = $headers->combine($row);
// Hasil: ['ID' => 101, 'Nama' => 'Budi', 'Jabatan' => 'Manager']
```

**Hafalan:**

```text
$collection->merge([array])          → gabungkan array (key asosiatif sama saling menimpa)
$collection->mergeRecursive([array]) → gabungkan array bertingkat tanpa menimpa nilai
$keys->combine($values)              → jadikan koleksi 1 sebagai keys dan koleksi 2 sebagai values
$collection->concat([array])         → tambahkan elemen ke akhir urutan numerik
$collection->union([array])          → gabungkan array tanpa menimpa key yang sudah ada
```

---

<a id="bagian-22"></a>

## 22. 🟡 Eksekusi Kondisional & Utility Pipeline

#### Konsep

- `when()` & `unless()`: Menjalankan transformasi HANYA JIKA kondisi tertentu bernilai `true`/`false` tanpa memutus *method chaining*.
- `tap()`: Mengintip isi koleksi untuk debugging/logging tanpa memodifikasi data.
- `pipe()`: Melewatkan seluruh koleksi ke closure kustom untuk menghasilkan nilai akhir baru.

### 1. Eksekusi Kondisional (`when` & `unless`)

```php
$searchTerm = request('q');
$sortByPrice = true;

$products = collect([
    ['name' => 'Mechanical Keyboard', 'price' => 750000],
    ['name' => 'Wireless Mouse',      'price' => 250000],
    ['name' => 'Gaming Monitor',     'price' => 2000000],
]);

$result = $products
    // Jalankan filter search HANYA jika variable $searchTerm memiliki isi
    ->when($searchTerm, function (Collection $col, string $query) {
        return $col->filter(fn ($item) => str_contains(strtolower($item['name']), strtolower($query)));
    })
    // Jalankan sorting harga jika $sortByPrice bernilai true
    ->when($sortByPrice, function (Collection $col) {
        return $col->sortBy('price');
    })
    ->values();
```

### 2. Debugging Tanpa Putus Chaining (`tap`)

```php
$result = collect([1, 2, 3, 4, 5])
    ->filter(fn ($x) => $x > 2)
    ->tap(function (Collection $col) {
        Log::info('Data setelah difilter:', $col->all());
    })
    ->map(fn ($x) => $x * 10)
    ->values();
```

### 3. Pipeline Data Transformation (`pipe`, `pipeThrough`)

```php
$stats = collect([10, 20, 30, 40, 50])->pipe(function (Collection $col) {
    return [
        'count' => $col->count(),
        'sum'   => $col->sum(),
        'avg'   => $col->avg(),
    ];
});
```

**Hafalan:**

```text
$collection->when(condition, callback, defaultCallback) → jalankan callback jika kondisi bernilai true
$collection->unless(condition, callback)                → jalankan callback jika kondisi bernilai false
$collection->tap(callback)                              → intip isi koleksi tanpa mengubah jalannya pipeline
$collection->pipe(callback)                             → lemparkan seluruh koleksi ke closure kustom
```

---

<a id="bagian-23"></a>

## 23. 🟡 Randomisasi Data

#### Konsep

Method untuk mengacak urutan elemen koleksi atau mengambil sejumlah sampel acak.

### 1. Method `random()` & `shuffle()`

```php
$prizes = collect(['Emas 1g', 'Voucher 50rb', 'Payung', 'Kaos', 'Zonk']);

// 1. random(): Mengambil 1 nilai acak
$winnerPrize = $prizes->random(); // 'Emas 1g'

// Mengambil 2 sampel acak sekaligus (mengembalikan Collection)
$twoPrizes = $prizes->random(2);

// 2. shuffle(): Mengacak seluruh urutan data koleksi di tempat
$shuffled = $prizes->shuffle()->values();
```

**Hafalan:**

```text
$collection->random(amount) → ambil 1 atau N elemen acak dari koleksi
$collection->shuffle()      → acak seluruh urutan elemen di dalam koleksi
```

---

<a id="bagian-24"></a>

## 24. 🟡 Collection Macros (Extending Collection)

#### Konsep

Collection Macros memungkinkan kita menambahkan method kustom buatan sendiri ke dalam class `Collection` di seluruh aplikasi Laravel secara global.

### 1. Mendaftarkan Macro di `AppServiceProvider`

```php
namespace App\Providers;

use Illuminate\Support\Collection;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Menambahkan macro custom 'toUpper'
        Collection::macro('toUpper', function () {
            return $this->map(function ($value) {
                return Str::upper($value);
            });
        });

        // Menambahkan macro custom hitung PPN
        Collection::macro('withTax', function (float $taxPercentage = 11.0) {
            return $this->map(function ($price) use ($taxPercentage) {
                return $price + ($price * ($taxPercentage / 100));
            });
        });
    }
}
```

### 2. Penggunaan di Controller / Service

```php
$tags = collect(['php', 'laravel', 'vue'])->toUpper();
// Hasil: ['PHP', 'LARAVEL', 'VUE']

$prices = collect([100000, 200000])->withTax();
// Hasil: [111000, 222000]
```

**Hafalan:**

```text
Collection::macro('methodName', fn) → daftarkan custom method baru ke Laravel Collection
```

---

<a id="bagian-25"></a>

## 25. 🔴 Lazy Collection: Pengolahan Dataset Raksasa

#### Konsep

Standard Collection memuat seluruh data ke dalam memori RAM sekaligus. Jika Anda memproses file log berukuran 2 GB atau 1.000.000 baris data tabel, server akan langsung mengalami error `Allowed memory size exhausted`.

**Lazy Collection** (`Illuminate\Support\LazyCollection`) memanfaatkan fitur **PHP Generators (`yield`)**. Data dialirkan dan diproses **satu per satu baris per baris** (*stream*), sehingga konsumsi memori RAM tetap konstan sangat kecil (misal hanya 2 MB) meski mengolah data jutaan baris!

### 1. Membuat Lazy Collection dari File Besar

```php
use Illuminate\Support\LazyCollection;

// Membaca file log raksasa tanpa memakan RAM
$logLines = LazyCollection::make(function () {
    $handle = fopen(storage_path('logs/laravel.log'), 'r');

    while (($line = fgets($handle)) !== false) {
        yield $line; // Menyerahkan 1 baris ke memory saat diminta saja
    }

    fclose($handle);
});

// Proses filtering dan mapping berlangsung secara stream per baris!
$errorCount = $logLines
    ->filter(fn (string $line) => str_contains($line, 'ERROR'))
    ->count();
```

### 2. Lazy Collection Deret Angka Raksasa

```php
// Mengolah 10.000.000 angka tanpa crash memori
$sum = LazyCollection::times(10000000)
    ->filter(fn ($n) => $n % 2 === 0)
    ->take(100)
    ->sum();
```

### 3. Integrasi Database Eloquent (`cursor`)

Eloquent menyediakan method `cursor()` yang otomatis mengembalikan `LazyCollection` menggunakan database cursor PDO:

```php
// Memproses 500.000 user dari database secara stream hemat RAM
User::query()
    ->where('is_active', true)
    ->cursor() // Mengembalikan LazyCollection
    ->each(function (User $user) {
        // Kirim email atau sinkronisasi data...
    });
```

#### Diagram Alur: Standard Collection vs Lazy Collection

```text
Standard Collection (Boros RAM):
[ File 2GB / 1 Juta Baris ] ──> Muat SEMUA ke RAM Sekaligus (Memory Crash!)

Lazy Collection (Hemat RAM via Generator):
[ File 2GB ] ──yield baris 1──> [ RAM: 1 Baris ] ──> Proses ──> Buang
             ──yield baris 2──> [ RAM: 1 Baris ] ──> Proses ──> Buang
             ──yield baris 3──> [ RAM: 1 Baris ] ──> Selesai! (RAM Tetap < 2MB)
```

**Hafalan:**

```text
LazyCollection::make(fn)   → buat lazy stream collection menggunakan generator (yield)
LazyCollection::times(N)   → buat deret angka raksasa yang dievaluasi secara malas (lazy)
Model::cursor()            → ambil data query database sebagai LazyCollection hemat RAM
```

---

<a id="bagian-26"></a>

## 26. 🔴 Perbandingan Performa: Collection vs Array Native vs SQL Query

#### Konsep

Sangat krusial bagi developer untuk memahami kapan data sebaiknya diproses di server database SQL, kapan di Laravel Collection, dan kapan menggunakan Array native.

| Kriteria | Database SQL Query | Laravel Collection | PHP Array Native |
|---|---|---|---|
| **Lokasi Eksekusi** | Server Mesin Database (Disk & Index) | Server PHP (Memori RAM) | Server PHP (Memori RAM) |
| **Kecepatan Dataset Besar** | Sangat Cepat (menggunakan Index) | Lambat jika memuat seluruh data ke RAM | Cepat untuk operasi primitif |
| **Keterbacaan Kode** | Sedang (SQL / Query Builder) | Sangat Tinggi (Method Chaining) | Rendah (Banyak loop & variabel) |
| **Use Case Terbaik** | Menyaring ribuan/jutaan baris data | Transformasi data bisnis & format tampilan | Operasi algoritma mikro & performa ekstrem |

#### Aturan Emas Arsitektur Data

```text
1. Filter & Urutkan Data Sebanyak Mungkin di Level Database:
   ✅ Product::where('status', 'active')->orderBy('price')->get();
   ❌ Product::all()->where('status', 'active')->sortBy('price'); (Buruk jika 100.000 row)

2. Gunakan Collection untuk Transformasi Kompleks Setelah Data Diambil:
   ✅ $products->groupBy('category')->map(fn($group) => ...);
```

**Hafalan:**

```text
Filter jutaan baris  → lakukan di Database SQL (Index)
Transformasi tampilan → lakukan di Laravel Collection (RAM)
Dataset file raksasa → gunakan LazyCollection (Stream Generator)
```

---

<a id="bagian-27"></a>

## 27. 🔴 Perbedaan Support Collection vs Eloquent Collection

#### Konsep

Laravel memiliki dua class Collection yang berbeda:
1. `Illuminate\Support\Collection`: Collection generik untuk data array umum.
2. `Illuminate\Database\Eloquent\Collection`: Turunan khusus yang membungkus objek **Model Eloquent**.

#### Perbandingan Method Khusus Eloquent Collection

| Method Khusus | Kegunaan pada Eloquent Collection |
|---|---|
| `$collection->find($id)` | Mengambil model berdasarkan nilai Primary Key |
| `$collection->load(['relation'])` | Melakukan Eager Loading relasi tambahan pada model di RAM |
| `$collection->loadMissing(['relation'])` | Eager load relasi hanya jika relasi belum termuat |
| `$collection->modelKeys()` | Mengambil seluruh array Primary Key (`[1, 2, 3]`) |
| `$collection->fresh()` | Memuat ulang seluruh data model dari database |
| `$collection->toQuery()` | Mengubah kumpulan model menjadi Query Builder kembali |

```php
// Contoh Eager Loading belakangan pada Eloquent Collection:
$users = User::all(); // Mengembalikan Eloquent Collection
$users->load('posts'); // Eager load relasi posts secara instan di RAM
```

**Hafalan:**

```text
Support Collection   → pembungkus array data generik
Eloquent Collection  → pembungkus kumpulan Model Eloquent (memiliki method load, find, fresh, modelKeys)
```

---

<a id="bagian-28"></a>

## 28. 🛠️ Peta Ingatan Cepat

#### A. Peta Mental Fungsi Utama Collection

```text
       ┌────────────────────────────────────────────────────────┐
       │             Kategori Operasi Laravel Collection        │
       └───────┬────────────────┬────────────────┬──────────────┘
               │                │                │
               ▼                ▼                ▼
          Transformasi      Penyaringan       Agregasi & Reduksi
         (map, flatMap,    (filter, reject,    (sum, avg, count,
          mapWithKeys)      where, unique)      reduce, scan)
               │                │                │
               ▼                ▼                ▼
          Pengelompokan     Pemotongan       Penggabungan
         (groupBy, keyBy,  (slice, chunk,   (merge, combine,
          countBy)          take, skip)      zip, collapse)
```

#### B. Ringkasan Perilaku Method Kritis

```text
• Mengembalikan Koleksi Baru (Immutable) : map, filter, where, sortBy, groupBy, chunk
• Mengubah Koleksi Asli (Mutable)        : push, pop, shift, splice, forget, transform
• Mengembalikan Nilai Skalar / Tunggal   : first, last, value, sum, avg, count, reduce
• Mengalirkan Data Stream (Hemat RAM)    : LazyCollection, cursor
```

---

<a id="bagian-29"></a>

## 29. 📚 Tabel Ringkasan

| Kategori | Method / API | Parameter Umum | Fungsi & Deskripsi |
|---|---|---|---|
| **Pembuatan** | `collect()` | `value` | Membuat instance Collection dari array/nilai |
| **Pembuatan** | `Collection::wrap()` | `value` | Membungkus nilai apa pun (bahkan null) menjadi Collection aman |
| **Pembuatan** | `Collection::times()` | `count, callback` | Membuat koleksi dari hasil eksekusi N kali |
| **Iterasi** | `each()` | `callback(item, key)` | Perulangan elemen untuk side-effect (return false = break) |
| **Transformasi** | `map()` | `callback(item)` | Mengubah setiap elemen menjadi nilai baru |
| **Transformasi** | `mapWithKeys()` | `callback(item)` | Mengubah elemen menjadi pasangan `[key => value]` |
| **Transformasi** | `flatMap()` | `callback(item)` | Melakukan mapping dan meratakan array 1 level |
| **Transformasi** | `pluck()` | `'value_col', 'key_col'` | Mengekstrak array dari kolom tertentu |
| **Filter** | `filter()` | `callback` / kosong | Mempertahankan elemen bernilai true / membersihkan nilai kosong |
| **Filter** | `reject()` | `callback` | Membuang elemen yang bernilai true |
| **Filter** | `where()` | `'column', 'operator', 'value'` | Filter kolom dengan operator perbandingan |
| **Filter** | `unique()` | `'column'` | Menghapus data duplikat |
| **Retrieval** | `first()` | `callback` / kosong | Mengambil elemen pertama |
| **Retrieval** | `firstWhere()`| `'column', 'value'` | Shortcut ambil elemen pertama sesuai kolom |
| **Retrieval** | `get()` | `'key', 'default'` | Mengambil nilai key dengan fallback default |
| **Retrieval** | `sole()` | `'column', 'value'` | Mengambil tepat 1 elemen (error jika 0 atau >1) |
| **Pengujian** | `contains()` | `'column', 'value'` | Memeriksa ketersediaan data (true/false) |
| **Pengujian** | `every()` | `callback` | Memeriksa apakah seluruh data lulus kriteria |
| **Sorting** | `sortBy()` | `'column'` | Mengurutkan data ascending berdasarkan kolom |
| **Sorting** | `sortByDesc()` | `'column'` | Mengurutkan data descending berdasarkan kolom |
| **Grouping** | `groupBy()` | `'column'` | Mengelompokkan data menjadi array bertingkat |
| **Grouping** | `keyBy()` | `'column'` | Menetapkan kolom unik sebagai key asosiatif |
| **Grouping** | `countBy()` | `callback` / `'column'` | Menghitung frekuensi kemunculan per kategori |
| **Agregasi** | `sum()` | `'column'` / `callback` | Menjumlahkan seluruh nilai kolom |
| **Agregasi** | `avg()` | `'column'` | Menghitung rata-rata nilai kolom |
| **Agregasi** | `percentage()`| `callback` | Menghitung persentase data cocok (0-100) |
| **Manipulasi** | `push()` | `value` | Menyisipkan elemen di akhir koleksi |
| **Manipulasi** | `pop()` | kosong | Mengambil dan menghapus elemen terakhir |
| **Partisi** | `partition()` | `callback` | Membagi koleksi menjadi 2 bagian `[$true, $false]` |
| **Struktur** | `flatten()` | `depth` | Meratakan seluruh hirarki bertingkat menjadi 1 dimensi |
| **Struktur** | `zip()` | `[array]` | Menggabungkan array paralel berdasarkan kesamaan index |
| **Potongan** | `chunk()` | `size` | Memecah koleksi menjadi array berukuran size |
| **Potongan** | `forPage()` | `page, perPage` | Mengambil data paginasi di memori |
| **Reduksi** | `reduce()` | `callback(carry, item), initial` | Mengakumulasi koleksi menjadi 1 nilai akhir |
| **Himpunan** | `diff()` | `[array]` | Mencari selisih data yang tidak ada di target |
| **Himpunan** | `intersect()` | `[array]` | Mencari irisan data yang ada di kedua belah pihak |
| **Gabung** | `merge()` | `[array]` | Menggabungkan array (menimpa key sama) |
| **Gabung** | `combine()` | `$values` | Menjadikan koleksi 1 sebagai keys dan koleksi 2 sebagai values |
| **Utility** | `when()` | `condition, callback` | Eksekusi transformasi hanya jika kondisi bernilai true |
| **Utility** | `tap()` | `callback` | Mengintip koleksi untuk logging tanpa merusak pipeline |
| **Stream** | `LazyCollection`| `generator` | Memproses dataset jutaan baris secara stream hemat RAM |

---

<a id="bagian-30"></a>

## 30. ⚡ Cheat Code Collection 10 Detik

```php
// 1. Pipeline Filter, Map, Sort Lengkap
$result = collect($data)
    ->where('is_active', true)
    ->pluck('price', 'name')
    ->map(fn($price) => $price * 1.11)
    ->sortByDesc(fn($price) => $price);

// 2. Grouping & Hitung Otomatis
$summary = collect($orders)->groupBy('category')->map->count();

// 3. Ekstrak Cepat & String Join
$emails = collect($users)->pluck('email')->join(', ', ' dan ');

// 4. Pisahkan Lulus vs Gagal Seketika
[$passed, $remedial] = collect($students)->partition(fn($s) => $s['score'] >= 75);

// 5. Total Akumulasi Belanja
$grandTotal = collect($cart)->sum(fn($item) => $item['qty'] * $item['price']);
```

---

<a id="bagian-31"></a>

## 31. 🧭 Urutan Belajar yang Disarankan

```text
       Langkah 1: Fondasi Pembuatan & Akses Dasar
              │   • collect(), all(), count(), values()
              │   • Iterasi dengan each() & pemahaman immutability
              ▼
       Langkah 2: Transformasi & Penyaringan Data
              │   • map(), mapWithKeys(), flatMap(), pluck()
              │   • filter(), reject(), where(), whereIn(), unique()
              ▼
       Langkah 3: Pengorganisasian & Kalkulasi
              │   • sortBy(), sortByDesc(), sortKeys()
              │   • groupBy(), keyBy(), countBy()
              │   • sum(), avg(), min(), max(), percentage()
              ▼
       Langkah 4: Manipulasi Kompleks & Himpunan
              │   • partition(), collapse(), flatten(), zip()
              │   • chunk(), sliding(), forPage()
              │   • diff(), intersect(), merge(), combine()
              ▼
       Langkah 5: Utility Pipeline & Ekstensi
              │   • when(), unless(), tap(), pipe()
              │   • Membuat custom method dengan Collection::macro()
              ▼
       Langkah 6: Optimasi Dataset Raksasa
              │   • LazyCollection & Generator yield untuk hemat RAM
              ▼
       Langkah 7: Mini Project Terpadu Analitik Data
```

---

<a id="bagian-32"></a>

## 32. 🏗️ Mini Project: Pengolahan Laporan Penjualan & Analitik E-Commerce

Proyek nyata yang menggabungkan seluruh fungsionalitas inti Collection: **Pembuatan, Filtering bersyarat, Mapping data, Grouping per kategori, Paginasi memori, Kalkulasi statistik omset, dan Ekspor laporan ringkasan**.

### 1. Kode Service Analitik (`app/Services/SalesAnalyticsService.php`)

```php
namespace App\Services;

use Illuminate\Support\Collection;

class SalesAnalyticsService
{
    /**
     * Memproses data transaksi mentah dan menghasilkan analitik lengkap.
     */
    public function generateReport(array $rawTransactions, array $filters = []): array
    {
        $transactions = collect($rawTransactions);

        // 1. Filtering Data Bersyarat
        $filtered = $transactions
            ->when(!empty($filters['status']), function (Collection $col) use ($filters) {
                return $col->where('status', $filters['status']);
            })
            ->when(!empty($filters['min_amount']), function (Collection $col) use ($filters) {
                return $col->where('total_amount', '>=', $filters['min_amount']);
            });

        // 2. Partisi: Transaksi Sukses vs Transaksi Batal/Refund
        [$successfulOrders, $failedOrders] = $filtered->partition(function ($order) {
            return $order['status'] === 'completed';
        });

        // 3. Kalkulasi Statistik Utama
        $totalRevenue = $successfulOrders->sum('total_amount');
        $averageOrderValue = $successfulOrders->avg('total_amount');
        $totalItemsSold = $successfulOrders->sum(fn ($order) => collect($order['items'])->sum('qty'));

        // 4. Grouping & Agregasi Berdasarkan Kategori Produk
        $salesByCategory = $successfulOrders
            ->flatMap(function ($order) {
                return $order['items'];
            })
            ->groupBy('category')
            ->map(function (Collection $items, string $category) {
                return [
                    'category'    => $category,
                    'total_qty'   => $items->sum('qty'),
                    'total_sales' => $items->sum(fn ($i) => $i['price'] * $i['qty']),
                ];
            })
            ->sortByDesc('total_sales')
            ->values();

        // 5. Ranking 3 Pelanggan Teratas (Top 3 Spenders)
        $topCustomers = $successfulOrders
            ->groupBy('customer_id')
            ->map(function (Collection $orders, int $customerId) {
                return [
                    'customer_id'   => $customerId,
                    'customer_name' => $orders->first()['customer_name'],
                    'order_count'   => $orders->count(),
                    'total_spent'   => $orders->sum('total_amount'),
                ];
            })
            ->sortByDesc('total_spent')
            ->take(3)
            ->values();

        // 6. Paginasi Memori untuk Daftar Transaksi (Halaman 1, 5 item per page)
        $paginatedTransactions = $successfulOrders
            ->sortByDesc('transaction_date')
            ->forPage(1, 5)
            ->values();

        return [
            'metrics' => [
                'total_completed_orders' => $successfulOrders->count(),
                'total_failed_orders'    => $failedOrders->count(),
                'total_revenue'          => $totalRevenue,
                'average_order_value'    => $averageOrderValue,
                'total_items_sold'       => $totalItemsSold,
            ],
            'sales_by_category' => $salesByCategory->all(),
            'top_customers'     => $topCustomers->all(),
            'recent_page_data'  => $paginatedTransactions->all(),
        ];
    }
}
```

### 2. Data Dummy & Eksekusi

```php
$rawTransactions = [
    [
        'id' => 'TRX-001', 'customer_id' => 101, 'customer_name' => 'Budi Santoso',
        'status' => 'completed', 'total_amount' => 1500000, 'transaction_date' => '2026-08-01',
        'items' => [
            ['name' => 'Keyboard RGB', 'category' => 'Aksesoris', 'price' => 750000, 'qty' => 2],
        ]
    ],
    [
        'id' => 'TRX-002', 'customer_id' => 102, 'customer_name' => 'Citra Lestari',
        'status' => 'completed', 'total_amount' => 2800000, 'transaction_date' => '2026-08-02',
        'items' => [
            ['name' => 'Gaming Monitor 27"', 'category' => 'Display', 'price' => 2800000, 'qty' => 1],
        ]
    ],
    [
        'id' => 'TRX-003', 'customer_id' => 101, 'customer_name' => 'Budi Santoso',
        'status' => 'completed', 'total_amount' => 350000, 'transaction_date' => '2026-08-03',
        'items' => [
            ['name' => 'Wireless Mouse', 'category' => 'Aksesoris', 'price' => 350000, 'qty' => 1],
        ]
    ],
    [
        'id' => 'TRX-004', 'customer_id' => 103, 'customer_name' => 'Andi Wijaya',
        'status' => 'cancelled', 'total_amount' => 500000, 'transaction_date' => '2026-08-04',
        'items' => [
            ['name' => 'Headset Stand', 'category' => 'Aksesoris', 'price' => 500000, 'qty' => 1],
        ]
    ],
];

$analytics = new SalesAnalyticsService();
$report = $analytics->generateReport($rawTransactions);
```

#### Output Tampilan Mini Project

```text
========================================================================
                      LAPORAN ANALITIK PENJUALAN
========================================================================

METRIK UTAMA:
• Total Pesanan Berhasil : 3 Transaksi
• Total Pesanan Batal    : 1 Transaksi
• Total Omset Penjualan  : Rp 4.650.000
• Rata-rata Nilai Order  : Rp 1.550.000
• Total Produk Terjual   : 4 Unit

PENJUALAN PER KATEGORI:
1. Display   : Rp 2.800.000 (1 Unit)
2. Aksesoris : Rp 1.850.000 (3 Unit)

TOP 3 PELANGGAN TERBAIK:
1. Citra Lestari (1 Pesanan) - Total Belanja: Rp 2.800.000
2. Budi Santoso  (2 Pesanan) - Total Belanja: Rp 1.850.000

PAGINASI TRANSAKSI TERBARU (Halaman 1):
• TRX-003 | 2026-08-03 | Budi Santoso  | Rp 350.000   [completed]
• TRX-002 | 2026-08-02 | Citra Lestari | Rp 2.800.000 [completed]
• TRX-001 | 2026-08-01 | Budi Santoso  | Rp 1.500.000 [completed]
========================================================================
```

#### Diagram Alur Mini Project

```text
       Input Data Transaksi Mentah
                    │
                    ▼
       1. Filtering & Partisi Status (completed vs cancelled)
                    │
                    ├──> 2. Hitung Total Omset & Rata-rata Order
                    │
                    ├──> 3. flatMap() Items ──> groupBy('category') ──> Total Penjualan Kategori
                    │
                    ├──> 4. groupBy('customer_id') ──> sortByDesc() ──> take(3) Pelanggan Terbaik
                    │
                    └──> 5. forPage(1, 5) ──> Paginasi Riwayat Transaksi di RAM
                    │
                    ▼
       Hasil Output Laporan Analitik Terstruktur & Komprehensif
```

---

<a id="bagian-33"></a>

## 33. 🔗 Referensi Resmi

- [Laravel Documentation: Collections Guide](https://laravel.com/docs/collections)
- [Laravel Documentation: Lazy Collections](https://laravel.com/docs/collections#lazy-collections)
- [Laravel API Reference: Illuminate\Support\Collection](https://laravel.com/api/master/Illuminate/Support/Collection.html)
- [Laravel API Reference: Illuminate\Support\LazyCollection](https://laravel.com/api/master/Illuminate/Support/LazyCollection.html)
- [PHP Manual: Generators Overview](https://www.php.net/manual/en/language.generators.overview.php)
