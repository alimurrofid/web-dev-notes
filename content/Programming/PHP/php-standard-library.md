---
title: "PHP Standard Library"
description: "Fungsi bawaan (built-in functions) dan standard library esensial PHP untuk manipulasi string, array, date/time, math, file system, dan JSON."
order: 3
tags:
  - programming
  - php
  - standard-library
  - reference
---

# PHP Standard Library

> **Target:** Pemula yang sudah memahami dasar bahasa PHP dan OOP, lalu ingin menguasai fungsi dan class bawaan (*PHP Standard Library*) untuk produktivitas pengembangan web harian di PHP 8+.
> **Versi:** PHP 8.x
> **Prasyarat:** [[php-dasar|PHP Dasar]]
> Fokus modul pembelajaran ini: **string functions & multibyte → array operations & callbacks → number & math → date & time (DateTimeImmutable) → JSON parsing & validation → regular expressions (PCRE2) → file stream & I/O → directory & path → data filtering & URL → hashing & password security → cryptographic random → SPL iterators & generators → exceptions & reflection → internationalization (intl) → mini project data processor**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: manipulasi teks (string), pengolahan array, matematika, dan penanganan tanggal dasar

🟡 Lanjutan
→ pelajari setelah fundamental nyaman: DateTimeImmutable, JSON, Regex, File/Directory, Filter, dan URL

🔴 Advanced / Reference
→ penting untuk keamanan & performa: Password Hashing, Secure Random, Iterators, Generators, Reflection, dan Intl
```

Mental model navigasi PHP Standard Library:

```text
       Kebutuhan / Masalah Aplikasi
                     │
                     │ Identifikasi jenis data yang diproses
                     ▼
       Pilih Domain Built-in API PHP
       ┌───────────────────────────────────────────────────────────┐
       │ • Teks & Karakter   ──> String Functions & mbstring       │
       │ • Koleksi & List    ──> Array Functions & Callbacks       │
       │ • Waktu & Jadwal    ──> DateTimeImmutable & DateInterval  │
       │ • Pertukaran Data   ──> JSON (json_encode / json_decode)  │
       │ • File & Dokumen    ──> Filesystem & File Stream (fopen)  │
       │ • Keamanan Akun     ──> Password Hashing & Random Bytes   │
       └─────────────────────────────┬─────────────────────────────┘
                                     │
                                     ▼
       Eksekusi Fungsi Standar Bawaan PHP (Cepat, Aman, & Optimal)
```

**Hafalan:**

```text
Standard Library → Kumpulan fungsi, class, dan konstanta bawaan tanpa perlu instalasi library eksternal
Multibyte        → Fungsi berawalan mb_* untuk memproses karakter internasional/UTF-8 secara akurat
Immutable Date   → DateTimeImmutable mencegah modifikasi tanggal yang tidak disengaja
Throw on Error   → Selalu aktifkan opsi JSON_THROW_ON_ERROR saat parsing JSON
Secure Hash      → password_hash() dan password_verify() untuk keamanan kredensial pengguna
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan PHP Standard Library & Arsitektur Built-in API](#bagian-1)
2. [String Dasar (strlen, strtoupper, strtolower, trim, substr)](#bagian-2)
3. [String Pencarian (str_contains, str_starts_with, str_ends_with, strpos)](#bagian-3)
4. [String Manipulasi & Format (str_replace, explode, implode, sprintf)](#bagian-4)
5. [Array Dasar & Operasi Elemen (count, array_push, array_pop, array_shift)](#bagian-5)
6. [Array Search & Key Operations (in_array, array_search, array_keys, array_values)](#bagian-6)
7. [Array Manipulation (array_merge, array_slice, array_splice, array_chunk, array_column)](#bagian-7)
8. [Array Callback Functions (array_map, array_filter, array_reduce, array_walk)](#bagian-8)
9. [Array Sorting (sort, rsort, asort, arsort, ksort, usort)](#bagian-9)
10. [Number Functions & Konversi (is_numeric, is_int, intval, floatval, abs)](#bagian-10)
11. [Math Functions (round, ceil, floor, min, max, pow, sqrt)](#bagian-11)
12. [Date & Time Dasar (time, date, strtotime, microtime)](#bagian-12)

### 🟡 Lanjutan

13. [DateTime & DateTimeImmutable (OOP Date Handling)](#bagian-13)
14. [DateInterval & DatePeriod](#bagian-14)
15. [DateTimeZone & Manajemen Zona Waktu](#bagian-15)
16. [JSON Processing (json_encode, json_decode, json_validate)](#bagian-16)
17. [Regular Expression PCRE (preg_match, preg_match_all, preg_replace, preg_split)](#bagian-17)
18. [File I/O Cepat (file_get_contents, file_put_contents, file_exists, unlink)](#bagian-18)
19. [File Stream & CSV (fopen, fgets, fread, fwrite, fgetcsv, fputcsv)](#bagian-19)
20. [Directory & Filesystem (mkdir, rmdir, scandir, is_dir, glob)](#bagian-20)
21. [Path Operations (basename, dirname, pathinfo, realpath)](#bagian-21)
22. [Data Filter & Sanitasi (filter_var, filter_input, FILTER_VALIDATE_*)](#bagian-22)
23. [URL Parsing & Query String (parse_url, http_build_query, urlencode)](#bagian-23)
24. [Variable & Type Checking (isset, empty, unset, is_null, gettype)](#bagian-24)
25. [String Encoding & Multibyte (mb_strlen, mb_substr, mb_strpos)](#bagian-25)

### 🔴 Advanced / Reference

26. [Hash & Cryptographic Digest (hash, hash_hmac, hash_equals)](#bagian-26)
27. [Secure Password Hashing (password_hash, password_verify, password_needs_rehash)](#bagian-27)
28. [Cryptographically Secure Random (random_int, random_bytes, bin2hex)](#bagian-28)
29. [Data Serialization (serialize, unserialize)](#bagian-29)
30. [SPL Iterators (ArrayIterator, IteratorAggregate, DirectoryIterator)](#bagian-30)
31. [Generators & yield (Streaming Data Hemat Memori)](#bagian-31)
32. [Exception & Error Hierarchy (Throwable, Exception, Error, TypeError)](#bagian-32)
33. [Reflection API (ReflectionClass, ReflectionMethod)](#bagian-33)
34. [Intl Extension (NumberFormatter, IntlDateFormatter, Locale)](#bagian-34)

### 🛠️ Referensi & Praktik

35. [Peta Ingatan Cepat](#bagian-35)
36. [Tabel Ringkasan](#bagian-36)
37. [Cheat Code PHP Standard Library 10 Detik](#bagian-37)
38. [Urutan Belajar yang Disarankan](#bagian-38)
39. [Mini Project: REST API & CLI Data Processor Terintegrasi](#bagian-39)
40. [Referensi Resmi](#bagian-40)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan PHP Standard Library & Arsitektur Built-in API

#### Konsep

**PHP Standard Library** adalah ekosistem fungsi, class, interface, dan modul bawaan (*built-in*) yang disediakan langsung oleh engine PHP. Anda tidak perlu menginstal library pihak ketiga melalui Composer untuk melakukan tugas-tugas umum seperti manipulasi teks, enkripsi, parsing JSON, pengolahan file, dan komunikasi web.

Arsitektur Standard Library PHP terbagi menjadi:
1. **Core Language Built-ins:** Fungsi bawaan inti (`strlen`, `count`, `array_merge`, `isset`).
2. **Bundled Standard Extensions:** Modul yang aktif secara default di hampir semua instalasi PHP modern (`json`, `mbstring`, `pcre`, `filter`, `hash`, `date`, `spl`).
3. **Optional Extensions:** Modul resmi untuk kebutuhan spesifik seperti `intl` (internasionalisasi) dan `pdo` (koneksi database).

#### Contoh

```php
<?php

// Menggunakan beberapa fungsi bawaan PHP dalam satu alur
$dataUser = ["nama" => " Budi Santoso ", "role" => "ADMIN"];

$namaBersih = trim($dataUser["nama"]);
$roleKecil  = strtolower($dataUser["role"]);
$jsonOutput = json_encode(["nama" => $namaBersih, "role" => $roleKecil]);

echo $jsonOutput;
```

#### Output

```text
{"nama":"Budi Santoso","role":"admin"}
```

#### Cara Kerja

```text
       Input Mentah: ["nama" => " Budi Santoso ", "role" => "ADMIN"]
                             │
                             ▼
       Normalisasi: trim($nama) & strtolower($role)
                             │
                             ▼
       json_encode(["nama" => "Budi Santoso", "role" => "admin"])
                             │
                             ▼
       Output JSON: {"nama":"Budi Santoso","role":"admin"}
```

**Hafalan:**

```text
Standard Library → Koleksi fungsi dan class siap pakai yang disediakan langsung oleh engine PHP
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Periksa fungsi bawaan PHP terlebih dahulu sebelum membuat fungsi kustom atau menambahkan dependency Composer baru.
- ❌ **Kesalahan Umum:** Menulis ulang fungsi buatan sendiri untuk hal-hal yang sudah disediakan secara sangat cepat dan teruji oleh PHP (seperti *slugify*, *array search*, atau *date diff*).

---

<a id="bagian-2"></a>

## 2. 🟢 String Dasar (`strlen`, `strtoupper`, `strtolower`, `trim`, `substr`)

#### Konsep

Operasi dasar teks yang paling sering digunakan dalam aplikasi:
- `strlen($string)` : Menghitung jumlah panjang byte string.
- `strtoupper($string)` / `strtolower($string)` : Mengubah huruf menjadi kapital/kecil.
- `trim($string)` : Menghapus spasi dan karakter whitespace di awal dan akhir teks (`ltrim` untuk kiri saja, `rtrim` untuk kanan saja).
- `substr($string, $offset, $length)` : Mengambil potongan karakter dari posisi tertentu.

#### Contoh

```php
<?php

$teks = "  Halo Dunia PHP  ";

$bersih = trim($teks);
echo "Panjang Teks: " . strlen($bersih) . PHP_EOL;
echo "Huruf Besar : " . strtoupper($bersih) . PHP_EOL;
echo "Huruf Kecil : " . strtolower($bersih) . PHP_EOL;
echo "Potong Teks : " . substr($bersih, 0, 4); // Ambil 4 huruf pertama
```

#### Output

```text
Panjang Teks: 14
Huruf Besar : HALO DUNIA PHP
Huruf Kecil : halo dunia php
Potong Teks : Halo
```

#### Diagram Alur Pemotongan String

```text
       Index String:  0   1   2   3   4   5   6   7   8   9  10  11  12  13
       Karakter:     [H] [a] [l] [o] [ ] [D] [u] [n] [i] [a] [ ] [P] [H] [P]
                      └───────────┘
               substr($bersih, 0, 4) ──> "Halo"
```

**Hafalan:**

```text
strlen($string)                    → Hitung jumlah byte string
trim($string)                      → Hapus spasi di ujung kiri dan kanan
substr($string, $offset, $length)  → Potong karakter mulai dari $offset sepanjang $length
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Selalu lakukan `trim()` pada data input formulir sebelum disimpan atau divalidasi.
- ❌ **Kesalahan Umum:** Menggunakan `strlen()` dan `substr()` untuk karakter beraksen atau emoji (gunakan `mb_strlen()` dan `mb_substr()` untuk keamanan UTF-8).

---

<a id="bagian-3"></a>

## 3. 🟢 String Pencarian (`str_contains`, `str_starts_with`, `str_ends_with`, `strpos`)

#### Konsep

Pemeriksaan dan pencarian posisi kata di dalam teks:
- `str_contains($haystack, $needle)` : (PHP 8+) Mengecek apakah teks mengandung substring tertentu (menghasilkan boolean).
- `str_starts_with($haystack, $needle)` : (PHP 8+) Mengecek apakah teks diawali substring tertentu.
- `str_ends_with($haystack, $needle)` : (PHP 8+) Mengecek apakah teks diakhiri substring tertentu.
- `strpos($haystack, $needle)` : Mencari indeks posisi angka kemunculan pertama kata (menghasilkan integer atau boolean `false`).

#### Contoh

```php
<?php

$url = "https://example.com/api/v1/users.json";

var_dump(str_starts_with($url, "https://")); // bool(true)
var_dump(str_ends_with($url, ".json"));       // bool(true)
var_dump(str_contains($url, "/api/"));        // bool(true)

$posisiDomain = strpos($url, "example.com");
echo "Domain dimulai pada index ke: $posisiDomain";
```

#### Output

```text
bool(true)
bool(true)
bool(true)
Domain dimulai pada index ke: 8
```

#### Cara Kerja Pencarian String

```text
       URL: "https://example.com/api/v1/users.json"
                             │
                             ▼
       Evaluasi: str_starts_with("https://") ──> true
                             │
                             ▼
       Evaluasi: str_contains("/api/")        ──> true
                             │
                             ▼
       Evaluasi: str_ends_with(".json")       ──> true
```

**Hafalan:**

```text
str_contains($haystack, $needle)     → Cek keberadaan substring (true/false)
str_starts_with($haystack, $needle)  → Cek awalan string (true/false)
str_ends_with($haystack, $needle)    → Cek akhiran string (true/false)
strpos($haystack, $needle) !== false → Cek posisi kemunculan (wajib strict comparison)
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan helper PHP 8+ (`str_contains`, `str_starts_with`) karena lebih ekspresif dan tidak rentan salah evaluasi nilai `0`.
- ❌ **Kesalahan Umum:** Memeriksa `strpos` dengan operator loose `if (strpos(...) == false)` (jika kata berada di index `0`, ekspresi akan salah dianggap false).

---

<a id="bagian-4"></a>

## 4. 🟢 String Manipulasi & Format (`str_replace`, `explode`, `implode`, `sprintf`)

#### Konsep

- `str_replace($search, $replace, $subject)` : Mengganti seluruh kemunculan kata target.
- `explode($separator, $string)` : Memecah string menjadi array berdasarkan pemisah.
- `implode($separator, $array)` : Menggabungkan elemen array menjadi satu string utuh.
- `sprintf($format, ...$values)` : Memformat teks menggunakan placeholder `%s` (string), `%d` (integer), `%.2f` (float 2 desimal).

#### Contoh

```php
<?php

// 1. Replace Kata
$pesan = "Halo [NAMA], pesanan [ORDER_ID] telah dikirim.";
$pesanSiap = str_replace(["[NAMA]", "[ORDER_ID]"], ["Budi", "ORD-99"], $pesan);
echo $pesanSiap . PHP_EOL;

// 2. Explode & Implode
$tagsString = "php,laravel,vue,docker";
$tagsArray = explode(",", $tagsString);
$tagsArray[] = "tailwind";
$hasilBaru = implode(" | ", $tagsArray);
echo "Tags: $hasilBaru" . PHP_EOL;

// 3. Sprintf Formatter
$namaProduk = "Kopi Susu";
$harga = 18500.5;
$laporan = sprintf("Item: %-12s | Harga: Rp %10.2f", $namaProduk, $harga);
echo $laporan;
```

#### Output

```text
Halo Budi, pesanan ORD-99 telah dikirim.
Tags: php | laravel | vue | docker | tailwind
Item: Kopi Susu   | Harga: Rp   18500.50
```

**Hafalan:**

```text
str_replace($search, $replace, $string)  → Ganti kata target dengan kata baru
explode($delimiter, $string)             → Pecah string menjadi array
implode($glue, $array)                   → Satukan array menjadi satu string
sprintf($format, ...$values)             → Format string dengan template placeholder
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan array pada `$search` dan `$replace` di `str_replace` untuk melakukan penggantian banyak placeholder sekaligus.
- ❌ **Kesalahan Umum:** Mengirimkan delimiter string kosong `""` ke fungsi `explode()` (memicu `ValueError`).

---

<a id="bagian-5"></a>

## 5. 🟢 Array Dasar & Operasi Elemen (`count`, `array_push`, `array_pop`, `array_shift`)

#### Konsep

Manipulasi elemen array di awal dan akhir antrean:
- `count($array)` : Menghitung jumlah total elemen di dalam array.
- `array_push($array, ...$values)` / `$array[] = $val` : Menambahkan elemen baru di posisi paling belakang.
- `array_pop($array)` : Mengambil dan menghapus elemen terakhir (struktur data *Stack / LIFO*).
- `array_shift($array)` : Mengambil dan menghapus elemen pertama (struktur data *Queue / FIFO*).
- `array_unshift($array, ...$values)` : Menambahkan elemen baru di posisi paling depan.

#### Contoh

```php
<?php

$antrean = ["Budi", "Andi"];

// Tambah di belakang
$antrean[] = "Citra";
array_push($antrean, "Dewi");

// Ambil dari depan (Queue)
$dilayani = array_shift($antrean);
echo "Sedang dilayani: $dilayani" . PHP_EOL;

// Ambil dari belakang (Pop)
$batal = array_pop($antrean);
echo "Membatalkan antrean: $batal" . PHP_EOL;

echo "Sisa antrean (" . count($antrean) . " orang): " . implode(", ", $antrean);
```

#### Output

```text
Sedang dilayani: Budi
Membatalkan antrean: Dewi
Sisa antrean (2 orang): Andi, Citra
```

#### Diagram Alur Operasi Array

```text
       array_unshift() ──> [ Depan ] [ ... Array Data ... ] [ Belakang ] <── array_push() / $arr[]
       array_shift()   <── [ Depan ]                         [ Belakang ] ──> array_pop()
```

**Hafalan:**

```text
count($array)                  → Menghitung jumlah elemen array
$array[] = $value              → Tambah elemen ke ujung belakang (lebih cepat dari array_push)
array_pop($array)              → Hapus dan ambil elemen paling belakang
array_shift($array)            → Hapus dan ambil elemen paling depan
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan `$array[] = $value` alih-alih `array_push()` saat menambahkan satu elemen karena menghindari overhead pemanggilan fungsi.
- ❌ **Kesalahan Umum:** Lupa bahwa `array_shift()` me-reindex ulang seluruh index numerik array dari `0`.

---

<a id="bagian-6"></a>

## 6. 🟢 Array Search & Key Operations (`in_array`, `array_search`, `array_keys`, `array_values`)

#### Konsep

- `in_array($needle, $haystack, $strict)` : Memeriksa apakah nilai ada di dalam array (menghasilkan boolean).
- `array_search($needle, $haystack, $strict)` : Mencari nilai dan mengembalikan **key/index** tempat nilai tersebut ditemukan.
- `array_key_exists($key, $array)` : Memeriksa apakah key tertentu ada di dalam array.
- `array_keys($array)` / `array_values($array)` : Mengambil seluruh daftar key atau seluruh daftar value sebagai indexed array baru.

#### Contoh

```php
<?php

$user = [
    "id" => 101,
    "username" => "budisantoso",
    "role" => "admin",
    "status" => "active"
];

var_dump(in_array("admin", $user, true));          // bool(true)
var_dump(array_key_exists("username", $user));      // bool(true)

$kunciRole = array_search("admin", $user, true);
echo "Nilai 'admin' berada pada key: $kunciRole" . PHP_EOL;

$daftarKeys = array_keys($user);
echo "Daftar atribut: " . implode(", ", $daftarKeys);
```

#### Output

```text
bool(true)
bool(true)
Nilai 'admin' berada pada key: role
Daftar atribut: id, username, role, status
```

**Hafalan:**

```text
in_array($value, $array, true)          → Cek keberadaan nilai (wajib strict true)
array_search($value, $array, true)      → Cari nilai dan kembalikan key-nya
array_key_exists($key, $array)          → Cek keberadaan nama key di array
array_keys($array)                      → Ekstrak seluruh key menjadi indexed array
array_values($array)                    → Ekstrak seluruh value menjadi indexed array
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** **Selalu sertakan parameter ketiga `$strict = true`** pada `in_array()` dan `array_search()` untuk mencegah bug perbandingan integer `0` dengan string.
- ❌ **Kesalahan Umum:** Menggunakan `isset($array[$key])` untuk mengecek key yang bernilai `null` (`isset` menghasilkan `false` jika nilainya null, gunakan `array_key_exists` untuk kepastian keberadaan key).

---

<a id="bagian-7"></a>

## 7. 🟢 Array Manipulation (`array_merge`, `array_slice`, `array_splice`, `array_chunk`, `array_column`)

#### Konsep

- `array_merge(...$arrays)` : Menggabungkan dua atau lebih array. Key string ditimpa oleh array sebelah kanan; key numerik di-reindex urut.
- `array_slice($array, $offset, $length)` : Mengambil sebagian potongan array tanpa mengubah array asli.
- `array_chunk($array, $size)` : Memecah array besar menjadi potongan-potongan kecil (cocok untuk batching/pagination).
- `array_column($array, $columnKey, $indexKey)` : Mengambil satu kolom spesifik dari array multidimensi.
- `array_unique($array)` : Menghapus duplikasi elemen nilai.

#### Contoh

```php
<?php

$daftarProduk = [
    ["id" => 1, "nama" => "Laptop", "harga" => 12000000],
    ["id" => 2, "nama" => "Mouse",  "harga" => 250000],
    ["id" => 3, "nama" => "Keyboard", "harga" => 750000],
];

// Mengambil seluruh nama produk saja
$namaSemuaProduk = array_column($daftarProduk, "nama");
echo "Nama Produk: " . implode(", ", $namaSemuaProduk) . PHP_EOL;

// Memecah array menjadi kelompok isi 2
$kelompok = array_chunk($namaSemuaProduk, 2);
echo "Jumlah Batch: " . count($kelompok) . PHP_EOL;

// Menggabungkan array
$tambahan = ["Monitor", "Headset"];
$semuaItem = array_merge($namaSemuaProduk, $tambahan);
echo "Total Item: " . count($semuaItem);
```

#### Output

```text
Nama Produk: Laptop, Mouse, Keyboard
Jumlah Batch: 2
Total Item: 5
```

**Hafalan:**

```text
array_column($matrix, 'colName')       → Ambil satu kolom dari array tabel multidimensi
array_chunk($array, $size)             → Pecah array menjadi sub-array per $size elemen
array_merge($arr1, $arr2)              → Gabungkan beberapa array menjadi satu
array_unique($array)                   → Hapus seluruh nilai duplikat
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan `array_column()` untuk mengekstrak data ID atau nama dari kumpulan data hasil query database.
- ❌ **Kesalahan Umum:** Tertukar antara `array_slice()` (tidak mengubah array asli) dengan `array_splice()` (memotong dan memodifikasi array asli secara langsung).

---

<a id="bagian-8"></a>

## 8. 🟢 Array Callback Functions (`array_map`, `array_filter`, `array_reduce`, `array_walk`)

#### Konsep

Fungsi tingkat tinggi (*Higher-Order Functions*) yang menerima fungsi penangan (*callback*):
- `array_map($callback, $array)` : Mentransformasi setiap elemen array ke format nilai baru.
- `array_filter($array, $callback)` : Menyaring elemen berdasarkan kondisi boolean callback.
- `array_reduce($array, $callback, $initial)` : Mengakumulasi seluruh elemen array menjadi satu nilai tunggal (misal: total sum).
- `array_walk($array, $callback)` : Menjalankan aksi/modifikasi pada setiap elemen array di tempat.

#### Contoh

```php
<?php

$transaksi = [50000, 150000, 25000, 300000, 75000];

// 1. Filter transaksi di atas 100.000
$transaksiBesar = array_filter($transaksi, fn(int $nominal): bool => $nominal >= 100000);

// 2. Map: Format ke string Rupiah
$formatRupiah = array_map(fn(int $n): string => "Rp " . number_format($n, 0, ",", "."), $transaksiBesar);

// 3. Reduce: Hitung total omset
$totalOmset = array_reduce($transaksi, fn(int $carry, int $n): int => $carry + $n, 0);

echo "Transaksi Besar: " . implode(" | ", $formatRupiah) . PHP_EOL;
echo "Total Omset: Rp " . number_format($totalOmset, 0, ",", ".");
```

#### Output

```text
Transaksi Besar: Rp 150.000 | Rp 300.000
Total Omset: Rp 600.000
```

#### Alur Transformasi Callback

```text
                     Input Array: [50000, 150000, 25000, 300000, 75000]
                                            │
                 ┌──────────────────────────┴──────────────────────────┐
                 │                                                     │
                 ▼                                                     ▼
       array_filter(n >= 100000)                             array_reduce(carry + n)
                 │                                                     │
                 ▼                                                     ▼
         [150000, 300000]                                         Total: 600000
                 │
                 ▼
       array_map("Rp " . n)
                 │
                 ▼
       ["Rp 150.000", "Rp 300.000"]
```

**Hafalan:**

```text
array_map($callback, $array)             → Transformasi elemen (urutan parameter: callback dulu)
array_filter($array, $callback)          → Saring elemen (urutan parameter: array dulu)
array_reduce($array, $callback, $init)   → Akumulasi nilai menjadi single scalar
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan Arrow Function `fn($item) => $item > 0` untuk callback satu baris yang bersih dan ringkas.
- ❌ **Kesalahan Umum:** Ingat baik-baik perbedaan posisi parameter: `array_map` menerima callback di awal, sedangkan `array_filter` menerima array di awal!

---

<a id="bagian-9"></a>

## 9. 🟢 Array Sorting (`sort`, `rsort`, `asort`, `arsort`, `ksort`, `usort`)

#### Konsep

PHP menyediakan kumpulan fungsi sorting yang memodifikasi array secara langsung (*in-place*):

| Fungsi | Tipe Pengurutan | Mempertahankan Key Asosiatif? |
|---|---|---|
| `sort()` | Ascending (Kecil ke Besar) | ❌ Tidak (Index di-reset 0..n) |
| `rsort()` | Descending (Besar ke Kecil) | ❌ Tidak (Index di-reset 0..n) |
| `asort()` | Ascending berdasarkan Value | ✅ Ya |
| `arsort()` | Descending berdasarkan Value | ✅ Ya |
| `ksort()` | Ascending berdasarkan Key | ✅ Ya |
| `krsort()` | Descending berdasarkan Key | ✅ Ya |
| `usort()` | Custom Comparator Callback | ❌ Tidak |

#### Contoh

```php
<?php

$skorSiswa = [
    "Budi"  => 85,
    "Andi"  => 95,
    "Citra" => 78
];

// Sort berdasarkan skor tertinggi (Value Descending, pertahankan key)
arsort($skorSiswa);
print_r($skorSiswa);

// Custom Sort menggunakan usort & Spaceship operator (<=>)
$katalog = [
    ["nama" => "Sepatu", "harga" => 350000],
    ["nama" => "Baju",   "harga" => 120000],
    ["nama" => "Topi",   "harga" => 50000],
];

// Urutkan katalog dari harga termurah
usort($katalog, fn(array $a, array $b): int => $a["harga"] <=> $b["harga"]);
print_r($katalog);
```

#### Output

```text
Array
(
    [Andi] => 95
    [Budi] => 85
    [Citra] => 78
)
Array
(
    [0] => Array
        (
            [nama] => Topi
            [harga] => 50000
        )
    [1] => Array
        (
            [nama] => Baju
            [harga] => 120000
        )
    [2] => Array
        (
            [nama] => Sepatu
            [harga] => 350000
        )
)
```

**Hafalan:**

```text
asort($array)                               → Urutkan value ascending (key tetap aman)
arsort($array)                              → Urutkan value descending (key tetap aman)
ksort($array)                               → Urutkan alfabetis key array
usort($array, fn($a, $b) => $a <=> $b)      → Custom sorting dengan spaceship operator
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan `usort()` yang dipadukan dengan spaceship operator `<=>` untuk mengurutkan array objek atau tabel multidimensi.
- ❌ **Kesalahan Umum:** Menggunakan `sort()` pada associative array yang menyebabkan key string hilang dan berubah menjadi index angka `0, 1, 2`.

---

<a id="bagian-10"></a>

## 10. 🟢 Number Functions & Konversi (`is_numeric`, `is_int`, `intval`, `floatval`, `abs`)

#### Konsep

- `is_numeric($val)` : Mengecek apakah variabel berupa angka atau string angka (seperti `"123"` atau `"45.67"`).
- `intval($val)` / `(int) $val` : Mengonversi nilai ke integer.
- `floatval($val)` / `(float) $val` : Mengonversi nilai ke float.
- `abs($number)` : Mengembalikan nilai mutlak / absolut positif.
- `number_format($num, $decimals, $dec_point, $thousands_sep)` : Memformat angka ke teks berpemisah ribuan dan desimal.

#### Contoh

```php
<?php

$inputHarga = "250000.75";

if (is_numeric($inputHarga)) {
    $nominal = (float) $inputHarga;
    $rupiah = number_format($nominal, 2, ",", ".");
    echo "Nominal Valid: Rp $rupiah" . PHP_EOL;
}

echo "Absolut: " . abs(-500); // Menghasilkan 500
```

#### Output

```text
Nominal Valid: Rp 250.000,75
Absolut: 500
```

**Hafalan:**

```text
is_numeric($val)                                      → Validasi input apakah format angka valid
number_format($number, $decimals, $decPoint, $sep)    → Format angka ke string ribuan
abs($number)                                          → Nilai mutlak positif
```

---

<a id="bagian-11"></a>

## 11. 🟢 Math Functions (`round`, `ceil`, `floor`, `min`, `max`, `pow`, `sqrt`)

#### Konsep

Operasi matematika standar:
- `round($val, $precision)` : Pembulatan matematika terdekat.
- `ceil($val)` : Pembulatan ke atas (*ceiling*).
- `floor($val)` : Pembulatan ke bawah (*floor*).
- `min(...$values)` / `max(...$values)` : Mengambil nilai terendah atau tertinggi.
- `pow($base, $exp)` / `**` : Perpangkatan.
- `sqrt($val)` : Menghitung akar kuadrat.

#### Contoh

```php
<?php

$angka = 4.657;

echo "Round (2 desimal): " . round($angka, 2) . PHP_EOL;
echo "Ceil  (Ke atas)   : " . ceil($angka) . PHP_EOL;
echo "Floor (Ke bawah)  : " . floor($angka) . PHP_EOL;
echo "Nilai Tertinggi   : " . max(10, 45, 90, 23) . PHP_EOL;
echo "Akar 64           : " . sqrt(64);
```

#### Output

```text
Round (2 desimal): 4.66
Ceil  (Ke atas)   : 5
Floor (Ke bawah)  : 4
Nilai Tertinggi   : 90
Akar 64           : 8
```

**Hafalan:**

```text
round($val, $precision)   → Pembulatan normal terdekat
ceil($val)                → Bulatkan selalu ke atas
floor($val)               → Bulatkan selalu ke bawah (buang desimal)
min(...$vals) / max(...)  → Ambil nilai minimum / maksimum
```

---

<a id="bagian-12"></a>

## 12. 🟢 Date & Time Dasar (`time`, `date`, `strtotime`, `microtime`)

#### Konsep

Fungsi dasar waktu prosedural bawaan PHP:
- `time()` : Mengembalikan *Unix Timestamp* saat ini (jumlah detik sejak 1 Januari 1970).
- `date($format, $timestamp)` : Memformat timestamp menjadi string tanggal yang dapat dibaca.
- `strtotime($timeString)` : Mengonversi teks bahasa manusia (seperti `"+1 week"`, `"next Monday"`, `"2026-08-25"`) menjadi Unix timestamp.
- `microtime(true)` : Mengembalikan waktu saat ini dalam detik beserta mikrodetik (cocok untuk mengukur durasi performa eksekusi skrip).

Karakter format tanggal populer:
- `Y` : Tahun 4 digit (2026), `m` : Bulan 2 digit (01-12), `d` : Hari 2 digit (01-31).
- `H` : Jam format 24 (00-23), `i` : Menit (00-59), `s` : Detik (00-59).

#### Contoh

```php
<?php

// Set default timezone
date_default_timezone_set("Asia/Jakarta");

$sekarangTimestamp = time();
echo "Timestamp Saat Ini : $sekarangTimestamp" . PHP_EOL;
echo "Format Lengkap     : " . date("Y-m-d H:i:s", $sekarangTimestamp) . PHP_EOL;

// Konversi teks manusia dengan strtotime
$tujuhHariLagi = strtotime("+7 days");
echo "7 Hari Kedepan     : " . date("d F Y", $tujuhHariLagi);
```

#### Output

```text
Timestamp Saat Ini : 1787677200
Format Lengkap     : 2026-08-25 22:55:00
7 Hari Kedepan     : 01 September 2026
```

**Hafalan:**

```text
time()                           → Unix timestamp detik saat ini
date('Y-m-d H:i:s', $timestamp)  → Format timestamp ke teks tanggal
strtotime('+1 month')            → Konversi teks relatif ke unix timestamp
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Selalu pastikan timezone default disetel menggunakan `date_default_timezone_set("Asia/Jakarta")` atau melalui konfigurasi `php.ini`.
- ❌ **Kesalahan Umum:** Untuk aplikasi modern dan logika bisnis tanggal yang kompleks, utamakan menggunakan `DateTimeImmutable` (lihat Bagian 13) dibanding fungsi prosedural `date()`.

---

<a id="bagian-13"></a>

## 13. 🟡 `DateTime` & `DateTimeImmutable` (OOP Date Handling)

#### Konsep

PHP menyediakan representasi tanggal berbasis Object-Oriented:
- **`DateTime`:** Objek tanggal yang bersifat *mutable* (memodifikasi objek asal saat method dijalankan).
- **`DateTimeImmutable` (SANGAT DIREKOMENDASIKAN):** Objek tanggal yang bersifat *immutable* (setiap modifikasi waktu menghasilkan objek baru, sehingga aman dari *bug side-effect*).

#### Contoh

```php
<?php

$timezone = new DateTimeZone("Asia/Jakarta");

// Membuat objek waktu saat ini
$waktuOrder = new DateTimeImmutable("2026-08-25 14:30:00", $timezone);

// Tambah 3 hari menghasilkan objek baru tanpa mengubah $waktuOrder
$jatuhTempo = $waktuOrder->modify("+3 days");

echo "Waktu Order : " . $waktuOrder->format("d-m-Y H:i") . PHP_EOL;
echo "Jatuh Tempo : " . $jatuhTempo->format("d-m-Y H:i") . PHP_EOL;

// Menghitung selisih durasi (DateInterval)
$selisih = $waktuOrder->diff($jatuhTempo);
echo "Selisih     : {$selisih->days} hari";
```

#### Output

```text
Waktu Order : 25-08-2026 14:30
Jatuh Tempo : 28-08-2026 14:30
Selisih     : 3 hari
```

#### Cara Kerja Immutability

```text
       $waktuOrder = new DateTimeImmutable("2026-08-25")
                              │
                              │ ->modify("+3 days")
                              ▼
       $jatuhTempo = Instance Objek Baru ("2026-08-28")
       ($waktuOrder asli tetap aman bernilai "2026-08-25")
```

**Hafalan:**

```text
$date = new DateTimeImmutable('now', new DateTimeZone('Asia/Jakarta'));
$date->format('Y-m-d H:i:s');     → Format output string tanggal
$date->modify('+1 day');          → Mengembalikan objek baru yang ditambah 1 hari
$dateA->diff($dateB);             → Menghitung objek selisih DateInterval
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan `DateTimeImmutable` sebagai tipe standar untuk seluruh properti entitas tanggal di aplikasi Anda.
- ❌ **Kesalahan Umum:** Menggunakan `DateTime` biasa di mana passing variabel objek ke fungsi lain tanpa sengaja mengubah nilai tanggal aslinya (*mutation bug*).

---

<a id="bagian-14"></a>

## 14. 🟡 `DateInterval` & `DatePeriod`

#### Konsep

- **`DateInterval`:** Merepresentasikan durasi waktu tertentu (misal: "2 hari 4 jam"). Format spesifikasi ISO-8601 diawali `P` (*Period*), contoh: `P1D` (1 hari), `P2W` (2 minggu), `PT1H` (1 jam, waktu diawali `T`).
- **`DatePeriod`:** Merepresentasikan rentang perulangan tanggal berulang antara titik awal dan akhir berdasarkan interval tertentu.

#### Contoh

```php
<?php

$mulai = new DateTimeImmutable("2026-09-01");
$interval = new DateInterval("P1D"); // Interval 1 Hari
$selesai = new DateTimeImmutable("2026-09-05");

// Generate perulangan tanggal harian
$periode = new DatePeriod($mulai, $interval, $selesai);

echo "Jadwal Acara:" . PHP_EOL;
foreach ($periode as $tgl) {
    echo "- " . $tgl->format("d F Y") . PHP_EOL;
}
```

#### Output

```text
Jadwal Acara:
- 01 September 2026
- 02 September 2026
- 03 September 2026
- 04 September 2026
```

**Hafalan:**

```text
new DateInterval('P1D')                  → Durasi 1 hari (ISO 8601: P=Period, T=Time)
new DatePeriod($start, $interval, $end)  → Koleksi generator perulangan rentang tanggal
```

---

<a id="bagian-15"></a>

## 15. 🟡 `DateTimeZone` & Manajemen Zona Waktu

#### Konsep

Class **`DateTimeZone`** mengelola zona waktu dunia dan aturan *Daylight Saving Time (DST)* secara akurat. Kita dapat mengonversi waktu dari satu zona waktu (misal: UTC) ke zona waktu lokal pengguna (misal: Asia/Jakarta) dengan method `setTimezone()`.

#### Contoh

```php
<?php

// Waktu server disimpan dalam format standar dunia UTC
$waktuServerUtc = new DateTimeImmutable("2026-08-25 12:00:00", new DateTimeZone("UTC"));

// Konversi ke zona waktu Indonesia Barat (WIB / UTC+7)
$waktuJakarta = $waktuServerUtc->setTimezone(new DateTimeZone("Asia/Jakarta"));

echo "UTC Time : " . $waktuServerUtc->format("Y-m-d H:i:s T") . PHP_EOL;
echo "WIB Time : " . $waktuJakarta->format("Y-m-d H:i:s T");
```

#### Output

```text
UTC Time : 2026-08-25 12:00:00 UTC
WIB Time : 2026-08-25 19:00:00 WIB
```

**Hafalan:**

```text
$tz = new DateTimeZone('Asia/Jakarta');
$date->setTimezone($tz);                 → Konversi tampilan jam ke zona waktu target
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Selalu simpan data timestamp di database dalam zona waktu `UTC`, lalu konversi ke zona waktu lokal pengguna saat ditampilkan.
- ❌ **Kesalahan Umum:** Menyimpan tanggal dengan zona waktu campuran di database tanpa menyertakan offset zona waktu.

---

<a id="bagian-16"></a>

## 16. 🟡 JSON Processing (`json_encode`, `json_decode`, `json_validate`)

#### Konsep

JSON (*JavaScript Object Notation*) adalah format standar pertukaran data pada Web API modern:
- `json_encode($data, $flags)` : Mengubah array/objek PHP menjadi teks string JSON.
- `json_decode($jsonString, $associative, $depth, $flags)` : Mengubah string JSON menjadi array/objek PHP.
- `json_validate($jsonString)` : (PHP 8.3+) Memeriksa validitas sintaks string JSON secara instan tanpa membebani memori untuk decoding.

Flag krusial:
- `JSON_THROW_ON_ERROR` : Melempar `JsonException` jika proses parsing gagal (menghindari kegagalan hening).
- `JSON_PRETTY_PRINT` : Memberikan indentasi rapi pada output JSON string.

#### Contoh

```php
<?php

$payload = [
    "status" => "success",
    "code" => 200,
    "data" => [
        "user_id" => 42,
        "username" => "budisantoso"
    ]
];

// 1. Encode ke string JSON
$jsonTeks = json_encode($payload, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR);
echo $jsonTeks . PHP_EOL;

// 2. Validasi Sintaks JSON (PHP 8.3+)
if (json_validate($jsonTeks)) {
    // 3. Decode kembali menjadi associative array
    $dataArray = json_decode($jsonTeks, true, 512, JSON_THROW_ON_ERROR);
    echo "Username: " . $dataArray["data"]["username"];
}
```

#### Output

```text
{
    "status": "success",
    "code": 200,
    "data": {
        "user_id": 42,
        "username": "budisantoso"
    }
}
Username: budisantoso
```

**Hafalan:**

```text
json_encode($data, JSON_THROW_ON_ERROR)        → PHP Data -> JSON String
json_decode($json, true, 512, JSON_THROW_ON_ERROR) → JSON String -> Associative Array
json_validate($json)                           → Cek validitas JSON tanpa decoding (PHP 8.3+)
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Selalu pasang flag `JSON_THROW_ON_ERROR` agar error format JSON langsung tertangkap di blok `try-catch`.
- ❌ **Kesalahan Umum:** Lupa memberikan parameter kedua `$associative = true` pada `json_decode()` yang menyebabkan hasilnya bertipe `stdClass` bukan `array`.

---

<a id="bagian-17"></a>

## 17. 🟡 Regular Expression PCRE (`preg_match`, `preg_match_all`, `preg_replace`, `preg_split`)

#### Konsep

PHP menggunakan library PCRE2 (*Perl Compatible Regular Expressions*) untuk pencocokan pola tingkat lanjut:
- `preg_match($pattern, $subject, $matches)` : Mengecek apakah pola cocok dan menangkap kemunculan pertama.
- `preg_match_all($pattern, $subject, $matches)` : Menangkap seluruh kecocokan pola di dalam teks.
- `preg_replace($pattern, $replacement, $subject)` : Mengganti teks yang cocok dengan pola regex.
- `preg_split($pattern, $subject)` : Memecah string berdasarkan pola pemisah regex.

#### Contoh

```php
<?php

$input = "Order #ORD-101 tanggal 2026-08-25 senilai Rp 150000";

// 1. Ekstrak Kode Order dengan preg_match
if (preg_match('/ORD-\d+/', $input, $match)) {
    echo "Ditemukan Kode: " . $match[0] . PHP_EOL;
}

// 2. Ekstrak Semua Angka dengan preg_match_all
preg_match_all('/\d+/', $input, $allMatches);
echo "Angka yang ditemukan: " . implode(", ", $allMatches[0]) . PHP_EOL;

// 3. Sanitasi Nomor HP (Hapus semua karakter non-angka)
$nomorHpKotor = "+62 (812)-3456-7890";
$nomorHpBersih = preg_replace('/\D/', '', $nomorHpKotor);
echo "Nomor HP Bersih: $nomorHpBersih";
```

#### Output

```text
Ditemukan Kode: ORD-101
Angka yang ditemukan: 101, 2026, 08, 25, 150000
Nomor HP Bersih: 6281234567890
```

**Hafalan:**

```text
preg_match('/pola/', $text, $matches)         → Cari kecocokan pertama
preg_match_all('/pola/', $text, $matches)     → Cari seluruh kecocokan
preg_replace('/\D/', '', $text)               → Ganti pola regex (misal: \D non-digit)
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan pembatas pola standar seperti garis miring `/pola/` dan selalu validasi pola regex kompleks dengan unit test.
- ❌ **Kesalahan Umum:** Menggunakan regex untuk operasi sederhana yang bisa diselesaikan jauh lebih cepat dengan `str_contains()` atau `str_replace()`.

---

<a id="bagian-18"></a>

## 18. 🟡 File I/O Cepat (`file_get_contents`, `file_put_contents`, `file_exists`, `unlink`)

#### Konsep

Fungsi tingkat tinggi untuk operasi baca-tulis file sederhana tanpa repot mengelola file handle pointer:
- `file_get_contents($filename)` : Membaca seluruh isi file menjadi string teks (juga dapat membaca URL HTTP).
- `file_put_contents($filename, $data, $flags)` : Menulis string teks ke dalam file (gunakan flag `FILE_APPEND` untuk menambah ke baris akhir).
- `file_exists($filename)` : Memeriksa apakah file atau folder ada.
- `filesize($filename)` : Mengambil ukuran file dalam satuan byte.
- `unlink($filename)` : Menghapus file fisik dari storage.

#### Contoh

```php
<?php

$namaFile = "catatan.txt";

// 1. Menulis data baru ke file
file_put_contents($namaFile, "Baris 1: Inisialisasi Sistem\n");

// 2. Menambahkan data ke baris terakhir (Append)
file_put_contents($namaFile, "Baris 2: Transaksi Berhasil\n", FILE_APPEND);

// 3. Membaca isi file
if (file_exists($namaFile)) {
    echo "Ukuran File: " . filesize($namaFile) . " byte" . PHP_EOL;
    echo "Isi File:\n" . file_get_contents($namaFile);
    
    // Hapus file setelah selesai
    unlink($namaFile);
}
```

#### Output

```text
Ukuran File: 54 byte
Isi File:
Baris 1: Inisialisasi Sistem
Baris 2: Transaksi Berhasil
```

**Hafalan:**

```text
file_get_contents($path)                   → Baca seluruh isi file menjadi string
file_put_contents($path, $data, FILE_APPEND) → Tulis data ke file (tambahkan di ujung)
unlink($path)                              → Hapus file dari penyimpanan
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan `file_get_contents()` untuk file berukuran kecil hingga sedang (< 10MB).
- ❌ **Kesalahan Umum:** Membaca file berukuran ratusan megabyte atau gigabyte dengan `file_get_contents()` yang akan menyebabkan *Fatal Error: Allowed memory size exhausted* (gunakan File Stream di Bagian 19).

---

<a id="bagian-19"></a>

## 19. 🟡 File Stream & CSV (`fopen`, `fgets`, `fread`, `fwrite`, `fgetcsv`, `fputcsv`)

#### Konsep

Untuk file berukuran besar atau format terstruktur (seperti CSV), gunakan teknik **File Stream** yang memproses data baris demi baris menggunakan *resource pointer*:
- `fopen($filename, $mode)` : Membuka file stream (`'r'` = read, `'w'` = write baru, `'a'` = append).
- `fgets($handle)` : Membaca 1 baris teks.
- `fgetcsv($handle)` / `fputcsv($handle, $fields)` : Membaca / menulis 1 baris format CSV menjadi array.
- `fclose($handle)` : Menutup pointer file stream setelah selesai.

#### Contoh

```php
<?php

$fileCsv = "produk.csv";

// 1. Tulis File CSV
$handle = fopen($fileCsv, "w");
fputcsv($handle, ["ID", "Nama Produk", "Harga"]);
fputcsv($handle, [1, "Kopi Arabika", 45000]);
fputcsv($handle, [2, "Teh Hijau", 25000]);
fclose($handle);

// 2. Baca File CSV Baris demi Baris
$bacaHandle = fopen($fileCsv, "r");
while (($baris = fgetcsv($bacaHandle)) !== false) {
    printf("%-4s | %-15s | %s\n", $baris[0], $baris[1], $baris[2]);
}
fclose($bacaHandle);

unlink($fileCsv);
```

#### Output

```text
ID   | Nama Produk     | Harga
1    | Kopi Arabika    | 45000
2    | Teh Hijau       | 25000
```

#### Alur File Streaming Hemat Memori

```text
       File CSV di Harddisk (1 Juta Baris)
                     │
                     │ fopen("r") -> Buat Pointer
                     ▼
       Loop while (fgets / fgetcsv)
                     │
                     ▼
       Baca Baris demi Baris (RAM hanya terpakai ~1KB per baris)
                     │
                     ▼
       fclose() -> Tutup Koneksi File
```

**Hafalan:**

```text
$h = fopen($path, 'r'); while ($row = fgetcsv($h)) { ... } fclose($h);
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Selalu pastikan memanggil `fclose($handle)` setelah selesai membuka file stream guna mencegah kebocoran resource (*file descriptor leak*).
- ❌ **Kesalahan Umum:** Lupa memeriksa apakah `fopen()` berhasil sebelum membaca file (`if ($handle !== false)`).

---

<a id="bagian-20"></a>

## 20. 🟡 Directory & Filesystem (`mkdir`, `rmdir`, `scandir`, `is_dir`, `glob`)

#### Konsep

Pengelolaan direktori dan pencarian file:
- `mkdir($dirname, $permissions, $recursive)` : Membuat direktori baru (aktifkan `$recursive = true` untuk membuat subfolder bertingkat).
- `rmdir($dirname)` : Menghapus direktori kosong.
- `scandir($dirname)` : Mengambil daftar seluruh file dan folder di dalam suatu direktori.
- `is_dir($path)` / `is_file($path)` : Mengecek apakah path berupa folder atau file.
- `glob($pattern)` : Mencari daftar file yang cocok dengan pola wildcard (misal: `"uploads/*.png"`).

#### Contoh

```php
<?php

$folder = "storage/logs";

// 1. Buat direktori bertingkat
if (!is_dir($folder)) {
    mkdir($folder, 0755, true);
}

file_put_contents("$folder/app.log", "Log entry\n");
file_put_contents("$folder/error.log", "Error entry\n");

// 2. Cari semua file .log dengan glob()
$logFiles = glob("$folder/*.log");
foreach ($logFiles as $file) {
    echo "Ditemukan: " . basename($file) . PHP_EOL;
    unlink($file);
}

rmdir($folder);
rmdir("storage");
```

#### Output

```text
Ditemukan: app.log
Ditemukan: error.log
```

**Hafalan:**

```text
mkdir($path, 0755, true)     → Buat folder bertingkat secara rekursif
glob('folder/*.ext')         → Cari daftar file dengan pola wildcard
scandir($path)               → Ambil seluruh isi folder menjadi array
```

---

<a id="bagian-21"></a>

## 21. 🟡 Path Operations (`basename`, `dirname`, `pathinfo`, `realpath`)

#### Konsep

Memanipulasi dan membedah struktur path file:
- `basename($path)` : Mengambil nama file beserta ekstensinya saja.
- `dirname($path)` : Mengambil path direktori induk tempat file berada.
- `pathinfo($path)` : Membedah path menjadi associative array (`dirname`, `basename`, `extension`, `filename`).
- `realpath($path)` : Mengonversi path relatif (seperti `../storage/app.log`) menjadi path absolut sistem operasi yang sebenarnya.

#### Contoh

```php
<?php

$filePath = "/var/www/html/uploads/laporan_keuangan.pdf";

echo "Folder Induk : " . dirname($filePath) . PHP_EOL;
echo "Nama File    : " . basename($filePath) . PHP_EOL;

$info = pathinfo($filePath);
echo "Ekstensi     : " . $info["extension"] . PHP_EOL;
echo "Nama Murni   : " . $info["filename"];
```

#### Output

```text
Folder Induk : /var/www/html/uploads
Nama File    : laporan_keuangan.pdf
Ekstensi     : pdf
Nama Murni   : laporan_keuangan
```

**Hafalan:**

```text
pathinfo($path, PATHINFO_EXTENSION)  → Ambil ekstensi file (misal: 'pdf', 'png')
dirname($path)                       → Ambil folder direktori induk
basename($path)                      → Ambil nama file saja
```

---

<a id="bagian-22"></a>

## 22. 🟡 Data Filter & Sanitasi (`filter_var`, `filter_input`, `FILTER_VALIDATE_*`)

#### Konsep

Extension **Filter** menyediakan validasi dan pembersihan (*sanitasi*) data input tanpa perlu menuliskan regex manual yang rumit:
- `filter_var($value, $filter, $options)` : Memvalidasi atau membersihkan variabel.
- Filter Validasi Utama: `FILTER_VALIDATE_EMAIL`, `FILTER_VALIDATE_INT`, `FILTER_VALIDATE_FLOAT`, `FILTER_VALIDATE_URL`, `FILTER_VALIDATE_IP`.
- Filter Sanitasi Utama: `FILTER_SANITIZE_EMAIL`, `FILTER_SANITIZE_NUMBER_INT`.

#### Contoh

```php
<?php

$emailInput = "  budi.santoso@example.com ";
$ipInput    = "192.168.1.1";
$umurInput  = "25";

// 1. Validasi Email
$emailBersih = trim($emailInput);
if (filter_var($emailBersih, FILTER_VALIDATE_EMAIL)) {
    echo "Email Valid: $emailBersih" . PHP_EOL;
}

// 2. Validasi IP Address
if (filter_var($ipInput, FILTER_VALIDATE_IP)) {
    echo "IP Address Valid: $ipInput" . PHP_EOL;
}

// 3. Validasi Integer dengan Rentang Batas
$umurValid = filter_var($umurInput, FILTER_VALIDATE_INT, [
    "options" => ["min_range" => 18, "max_range" => 60]
]);

var_dump($umurValid); // int(25)
```

#### Output

```text
Email Valid: budi.santoso@example.com
IP Address Valid: 192.168.1.1
int(25)
```

**Hafalan:**

```text
filter_var($email, FILTER_VALIDATE_EMAIL)   → Validasi format email (true jika valid)
filter_var($url, FILTER_VALIDATE_URL)       → Validasi format URL web
filter_var($int, FILTER_VALIDATE_INT)       → Validasi angka integer
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Selalu gunakan `filter_var(..., FILTER_VALIDATE_EMAIL)` untuk validasi email daripada mencoba menyusun regex email sendiri.
- ❌ **Kesalahan Umum:** Mengira sanitasi otomatis memvalidasi kebenaran data; sanitasi hanya membuang karakter terlarang, validasi tetap wajib dilakukan.

---

<a id="bagian-23"></a>

## 23. 🟡 URL Parsing & Query String (`parse_url`, `http_build_query`, `urlencode`)

#### Konsep

- `parse_url($url)` : Membedah URL menjadi komponen: `scheme`, `host`, `port`, `path`, `query`, `fragment`.
- `http_build_query($array)` : Mengonversi associative array menjadi format URL query string yang ter-*encode* aman (misal: `q=budi&page=1`).
- `urlencode($string)` / `urldecode($string)` : Meng-encode dan men-decode karakter khusus agar aman dilewatkan di URL.

#### Contoh

```php
<?php

$url = "https://toko.com/search?kategori=elektronik&sort=termurah#daftar";

$parts = parse_url($url);
echo "Host : " . $parts["host"] . PHP_EOL;
echo "Path : " . $parts["path"] . PHP_EOL;
echo "Query: " . $parts["query"] . PHP_EOL;

// Menyusun parameter query baru dari array
$params = [
    "kategori" => "buku & majalah",
    "halaman" => 2,
    "filter" => ["promo" => true, "stok" => "ada"]
];

$queryString = http_build_query($params);
echo "Generated URL: https://toko.com/produk?" . $queryString;
```

#### Output

```text
Host : toko.com
Path : /search
Query: kategori=elektronik&sort=termurah
Generated URL: https://toko.com/produk?kategori=buku+%26+majalah&halaman=2&filter%5Bpromo%5D=1&filter%5Bstok%5D=ada
```

**Hafalan:**

```text
parse_url($url)               → Membedah URL menjadi komponen host, path, query
http_build_query($params)     → Mengonversi array parameter menjadi query string URL
```

---

<a id="bagian-24"></a>

## 24. 🟡 Variable & Type Checking (`isset`, `empty`, `unset`, `is_null`, `gettype`)

#### Konsep

Konsep dasar pengecekan variabel:
- `isset($var)` : Menghasilkan `true` jika variabel **ada dan bernilai bukan `null`**.
- `empty($var)` : Menghasilkan `true` jika variabel **tidak ada atau bernilai falsy** (`""`, `0`, `0.0`, `"0"`, `null`, `false`, `[]`).
- `unset($var)` : Menghapus variabel atau elemen array dari memori.
- `is_null($var)` : Menghasilkan `true` hanya jika variabel bernilai `null`.
- `gettype($var)` : Mengembalikan nama tipe data variabel berupa string.

#### Contoh

```php
<?php

$data = [
    "nama" => "Budi",
    "saldo" => 0,
    "catatan" => null
];

var_dump(isset($data["nama"]));    // bool(true)
var_dump(isset($data["catatan"])); // bool(false) - bernilai null!
var_dump(empty($data["saldo"]));   // bool(true) - angka 0 dianggap empty!

unset($data["nama"]); // Hapus key nama
var_dump(isset($data["nama"]));    // bool(false)
```

#### Output

```text
bool(true)
bool(false)
bool(true)
bool(false)
```

#### Perbandingan: `isset()` vs `empty()`

```text
       Nilai Variabel               isset($val)         empty($val)
       ────────────────────────────────────────────────────────────
       $val = "PHP";                true                false
       $val = "";                   true                true
       $val = 0;                    true                true
       $val = null;                 false               true
       Variabel belum dibuat        false               true
```

**Hafalan:**

```text
isset($var)      → True jika variabel terdefinisi dan BUKAN null
empty($var)      → True jika variabel kosong atau bernilai falsy (0, "", null, [])
unset($var)      → Hapus variabel dari memori
```

---

<a id="bagian-25"></a>

## 25. 🟡 String Encoding & Multibyte (`mb_strlen`, `mb_substr`, `mb_strpos`)

#### Konsep

Fungsi string standar (`strlen`, `substr`) mengukur string berdasarkan **jumlah byte**. Bahasa internasional (bahasa Arab, Mandarin, Jepang) serta **Emoji** menggunakan encoding UTF-8 di mana 1 karakter dapat terdiri dari 2 hingga 4 byte.

Extension **`mbstring`** menyediakan fungsi berawalan `mb_*` yang memproses teks berdasarkan **jumlah karakter visual sebenarnya**.

#### Contoh

```php
<?php

$teksEmoji = "Halo 👋"; // Emoji melambai berukuran 4 byte

// Fungsi standar (berbasis byte)
echo "strlen()    : " . strlen($teksEmoji) . " byte" . PHP_EOL;

// Fungsi Multibyte (berbasis karakter visual)
echo "mb_strlen() : " . mb_strlen($teksEmoji, "UTF-8") . " karakter" . PHP_EOL;
echo "mb_substr() : " . mb_substr($teksEmoji, 0, 6, "UTF-8") . PHP_EOL;
```

#### Output

```text
strlen()    : 9 byte
mb_strlen() : 6 karakter
mb_substr() : Halo 👋
```

**Hafalan:**

```text
mb_strlen($str, 'UTF-8')               → Hitung karakter teks UTF-8 / Emoji secara akurat
mb_substr($str, $start, $len, 'UTF-8') → Potong teks UTF-8 tanpa merusak karakter
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Selalu gunakan `mb_*` saat memproses nama pengguna, bio profil, atau teks internasional yang berpotensi memuat emoji.
- ❌ **Kesalahan Umum:** Memotong emoji menggunakan `substr()` standar yang akan membelah byte emoji di tengah jalan (*corrupted character*).

---

<a id="bagian-26"></a>

## 26. 🔴 Hash & Cryptographic Digest (`hash`, `hash_hmac`, `hash_equals`)

#### Konsep

- `hash($algo, $data)` : Menghasilkan *digest* hash satu arah (misal: `'sha256'`).
- `hash_hmac($algo, $data, $secretKey)` : Menghasilkan hash dengan tanda tangan kunci rahasia (*Keyed-Hash Message Authentication Code*), standar untuk verifikasi webhook API (seperti Midtrans/Stripe).
- `hash_equals($knownHash, $userHash)` : Membandingkan dua string hash secara aman dari serangan *Timing Attack*.

#### Contoh

```php
<?php

$apiKeySecret = "RAHASIA_SUPER_123";
$payload = '{"order_id": "ORD-101", "status": "PAID"}';

// Membuat Signature Webhook HMAC SHA-256
$signature = hash_hmac("sha256", $payload, $apiKeySecret);
echo "Webhook Signature: " . $signature . PHP_EOL;

// Verifikasi Signature yang diterima dari Client
$signatureMasuk = $signature;
if (hash_equals($signature, $signatureMasuk)) {
    echo "Verifikasi Webhook: ASLI & VALID!";
}
```

#### Output

```text
Webhook Signature: b4c28f9d0c6441e8c75d4090289a5ad30a91e5e2978fe2fa03d853e390c503cf
Verifikasi Webhook: ASLI & VALID!
```

**Hafalan:**

```text
hash('sha256', $data)                  → Hashing data 1 arah
hash_hmac('sha256', $data, $key)       → Hashing ber-tanda tangan kunci rahasia
hash_equals($known, $user)             → Perbandingan hash aman anti Timing Attack
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Selalu gunakan `hash_equals()` saat memverifikasi token reset password atau webhook signature.
- ❌ **Kesalahan Umum:** Menggunakan `hash('md5', ...)` atau `hash('sha1', ...)` untuk keamanan kata sandi (keduanya rentan bentrokan dan terlalu cepat ditembus).

---

<a id="bagian-27"></a>

## 27. 🔴 Secure Password Hashing (`password_hash`, `password_verify`, `password_needs_rehash`)

#### Konsep

Untuk mengamankan kata sandi pengguna, PHP menyediakan API hashing kriptografi modern berbasis **Bcrypt** dan **Argon2id**:
- `password_hash($password, PASSWORD_DEFAULT)` : Membuat hash kata sandi aman yang otomatis menyertakan *salt* acak unik.
- `password_verify($password, $hash)` : Memverifikasi apakah kata sandi mentah cocok dengan string hash di database.
- `password_needs_rehash($hash, $algo)` : Memeriksa apakah hash perlu diperbarui jika konfigurasi keamanan server ditingkatkan.

#### Contoh

```php
<?php

$passwordUser = "RahasiaBudi#2026";

// 1. Hashing saat pendaftaran (Register)
$hashTersimpan = password_hash($passwordUser, PASSWORD_DEFAULT);
echo "Hash di DB: " . $hashTersimpan . PHP_EOL;

// 2. Verifikasi saat login
$passwordInputLogin = "RahasiaBudi#2026";

if (password_verify($passwordInputLogin, $hashTersimpan)) {
    echo "Login Berhasil: Password Cocok!" . PHP_EOL;
} else {
    echo "Login Gagal: Password Salah!" . PHP_EOL;
}
```

#### Output

```text
Hash di DB: $2y$10$... (string hash unik 60 karakter)
Login Berhasil: Password Cocok!
```

**Hafalan:**

```text
$hash = password_hash($password, PASSWORD_DEFAULT); → Hashing password otomatis bersalt
password_verify($password, $hash)                   → Verifikasi password saat login
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Selalu gunakan `PASSWORD_DEFAULT` atau `PASSWORD_ARGON2ID` untuk menyimpan password user.
- ❌ **Kesalahan Umum:** Menggunakan algoritma hash biasa seperti `md5()` atau `sha256()` untuk password (sangat berbahaya karena rentan serangan *Rainbow Table*).

---

<a id="bagian-28"></a>

## 28. 🔴 Cryptographically Secure Random (`random_int`, `random_bytes`, `bin2hex`)

#### Konsep

Untuk keperluan keamanan (seperti membuat token reset password, token API, atau kode OTP), **JANGAN** gunakan fungsi random lama seperti `rand()` atau `mt_rand()`.

Gunakan fungsi generator acak berkekuatan kriptografi bawaan CSPRNG:
- `random_int($min, $max)` : Menghasilkan bilangan integer acak yang aman secara kriptografi.
- `random_bytes($length)` : Menghasilkan byte acak kriptografis.
- `bin2hex($bytes)` : Mengonversi byte biner menjadi string heksadesimal yang mudah dibaca.

#### Contoh

```php
<?php

// 1. Generate Kode OTP 6 Digit Acak
$kodeOtp = random_int(100000, 999999);
echo "Kode OTP: $kodeOtp" . PHP_EOL;

// 2. Generate Token Reset Password 32 Karakter
$tokenAman = bin2hex(random_bytes(16)); // 16 bytes = 32 karakter hex
echo "Token API: $tokenAman";
```

#### Output

```text
Kode OTP: 742918
Token API: 4f8a2b1c9d3e5f7a0b2c4d6e8f1a3b5c
```

**Hafalan:**

```text
random_int($min, $max)              → Angka integer acak aman untuk OTP / PIN
bin2hex(random_bytes(16))           → String token acak aman untuk Token / API Key
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan `bin2hex(random_bytes(32))` untuk generate token sesi dan token aktivasi akun.
- ❌ **Kesalahan Umum:** Menggunakan `uniqid()` atau `rand()` untuk token keamanan (keduanya dapat diprediksi oleh penyerang).

---

<a id="bagian-29"></a>

## 29. 🔴 Data Serialization (`serialize`, `unserialize`)

#### Konsep

- `serialize($value)` : Mengonversi struktur data PHP (array, objek) menjadi representasi string yang dapat disimpan ke database atau cache.
- `unserialize($string)` : Mengonversi kembali string hasil serialize menjadi struktur objek/array asli di memori.

#### Contoh

```php
<?php

$sessionData = [
    "user_id" => 101,
    "roles" => ["admin", "editor"],
    "is_logged_in" => true
];

$serialized = serialize($sessionData);
echo "Serialized: " . $serialized . PHP_EOL;

$restored = unserialize($serialized);
echo "User ID: " . $restored["user_id"];
```

#### Output

```text
Serialized: a:3:{s:7:"user_id";i:101;s:5:"roles";a:2:{i:0;s:5:"admin";i:1;s:6:"editor";}s:12:"is_logged_in";b:1;}
User ID: 101
```

**Hafalan:**

```text
serialize($data)     → PHP Data -> Serialized String
unserialize($string) → Serialized String -> PHP Data
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Utamakan format JSON (`json_encode`) untuk interoperabilitas data antar sistem.
- ❌ **Kesalahan Umum:** Melakukan `unserialize()` terhadap string input mentah dari pengguna (celah keamanan kritis *PHP Object Injection*).

---

<a id="bagian-30"></a>

## 30. 🔴 SPL Iterators (`ArrayIterator`, `IteratorAggregate`, `DirectoryIterator`)

#### Konsep

**SPL (Standard PHP Library)** menyediakan kumpulan class iterator untuk menelusuri data secara terstandarisasi:
- `ArrayIterator` : Membungkus array agar dapat diperlakukan sebagai objek iterator.
- `IteratorAggregate` : Interface agar class kustom dapat diiterasi langsung via loop `foreach`.
- `DirectoryIterator` : Menelusuri seluruh file dalam folder secara efisien menggunakan pendekatan OOP.

#### Contoh

```php
<?php

// Menelusuri direktori saat ini dengan DirectoryIterator
$dir = new DirectoryIterator(__DIR__);

echo "Daftar File di Folder:" . PHP_EOL;
foreach ($dir as $fileInfo) {
    if ($fileInfo->isFile()) {
        echo "- " . $fileInfo->getFilename() . " (" . $fileInfo->getSize() . " byte)" . PHP_EOL;
    }
}
```

#### Output

```text
Daftar File di Folder:
- php-dasar-cheatsheet-revised.md (108526 byte)
- php-oop-cheatsheet-revised.md (94120 byte)
```

**Hafalan:**

```text
new DirectoryIterator($path)   → Iterator OOP untuk menelusuri isi direktori
```

---

<a id="bagian-31"></a>

## 31. 🔴 Generators & `yield` (Streaming Data Hemat Memori)

#### Konsep

**Generator** memungkinkan pembuatan iterasi data dalam jumlah jutaan **tanpa mengonsumsi memori RAM** karena data di-*generate* satu per satu saat diminta (*on-demand lazy evaluation*).

Kata kunci **`yield`** mengembalikan nilai sementara ke perulangan lalu menjeda eksekusi fungsi hingga iterasi berikutnya dipanggil.

#### Contoh

```php
<?php

// Membaca file baris demi baris menggunakan Generator
function bacaBarisFile(string $namaFile): Generator
{
    $handle = fopen($namaFile, "r");
    while (($baris = fgets($handle)) !== false) {
        yield trim($baris);
    }
    fclose($handle);
}

// Simulasi membuat file dummy
file_put_contents("antrean.txt", "Transaksi 1\nTransaksi 2\nTransaksi 3\n");

foreach (bacaBarisFile("antrean.txt") as $nomor => $isi) {
    echo "Baris $nomor: $isi" . PHP_EOL;
}

unlink("antrean.txt");
```

#### Output

```text
Baris 0: Transaksi 1
Baris 1: Transaksi 2
Baris 2: Transaksi 3
```

**Hafalan:**

```text
yield $value;   → Mengembalikan satu nilai ke perulangan tanpa membebani RAM
```

---

<a id="bagian-32"></a>

## 32. 🔴 Exception & Error Hierarchy (`Throwable`, `Exception`, `Error`, `TypeError`)

#### Konsep

Seluruh error dan exception di PHP 8+ mengimplementasikan interface **`Throwable`**:

```text
                           Throwable (Interface)
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
             Exception                                 Error
         (Kondisi Logika Aplikasi)               (Kesalahan Fatal Engine)
                 │                                       │
     ┌───────────┴───────────┐               ┌───────────┴───────────┐
     ▼                       ▼               ▼                       ▼
RuntimeException    InvalidArgumentException TypeError             ValueError
```

#### Contoh

```php
<?php

function hitungBagi(int $a, int $b): float
{
    if ($b === 0) {
        throw new InvalidArgumentException("Pembagi tidak boleh nol!");
    }
    return $a / $b;
}

try {
    echo hitungBagi(10, 0);
} catch (InvalidArgumentException $e) {
    echo "Tertangkap Logika Error: " . $e->getMessage() . PHP_EOL;
} catch (Throwable $e) {
    echo "Tertangkap Fatal Error: " . $e->getMessage() . PHP_EOL;
}
```

#### Output

```text
Tertangkap Logika Error: Pembagi tidak boleh nol!
```

**Hafalan:**

```text
catch (Exception $e)    → Menangkap exception logika aplikasi
catch (Throwable $e)    → Menangkap seluruh jenis error dan exception di PHP
```

---

<a id="bagian-33"></a>

## 33. 🔴 Reflection API (`ReflectionClass`, `ReflectionMethod`)

#### Konsep

**Reflection API** memungkinkan program menginspeksi metadata dan arsitektur kode dirinya sendiri saat runtime (melihat daftar class, parameter fungsi, return type, dan annotations).

#### Contoh

```php
<?php

class LayananPembayaran
{
    public function bayar(int $jumlah, string $metode = "QRIS"): bool
    {
        return true;
    }
}

$reflector = new ReflectionClass(LayananPembayaran::class);
$method = $reflector->getMethod("bayar");

echo "Nama Method: " . $method->getName() . PHP_EOL;
foreach ($method->getParameters() as $param) {
    echo "- Param: $" . $param->getName() . " (Tipe: " . $param->getType() . ")" . PHP_EOL;
}
```

#### Output

```text
Nama Method: bayar
- Param: $jumlah (Tipe: int)
- Param: $metode (Tipe: string)
```

**Hafalan:**

```text
$ref = new ReflectionClass(ClassName::class);  → Introspeksi struktur dan metadata class
```

---

<a id="bagian-34"></a>

## 34. 🔴 Intl Extension (`NumberFormatter`, `IntlDateFormatter`, `Locale`)

#### Konsep

Extension **`intl`** menyediakan fungsi internasionalisasi resmi untuk memformat mata uang, angka desimal, dan tanggal sesuai bahasa dan budaya negara target:
- `NumberFormatter` : Memformat mata uang (misal: format Rupiah lokal `id_ID` atau USD `en_US`).
- `IntlDateFormatter` : Memformat tanggal dalam nama bulan dan hari bahasa Indonesia lokal.

#### Contoh

```php
<?php

if (class_exists("NumberFormatter")) {
    // 1. Format Mata Uang Rupiah Indonesia (id_ID)
    $currencyFormatter = new NumberFormatter("id_ID", NumberFormatter::CURRENCY);
    echo "Rupiah: " . $currencyFormatter->formatCurrency(1500000, "IDR") . PHP_EOL;

    // 2. Format Mata Uang Dollar Amerika (en_US)
    $usdFormatter = new NumberFormatter("en_US", NumberFormatter::CURRENCY);
    echo "Dollar: " . $usdFormatter->formatCurrency(1500000, "USD") . PHP_EOL;

    // 3. Format Tanggal Bahasa Indonesia Lokal
    $dateFormatter = new IntlDateFormatter(
        "id_ID",
        IntlDateFormatter::FULL,
        IntlDateFormatter::NONE,
        "Asia/Jakarta"
    );
    echo "Hari Ini: " . $dateFormatter->format(new DateTimeImmutable("2026-08-25"));
}
```

#### Output

```text
Rupiah: Rp 1.500.000,00
Dollar: $1,500,000.00
Hari Ini: Selasa, 25 Agustus 2026
```

**Hafalan:**

```text
new NumberFormatter('id_ID', NumberFormatter::CURRENCY)->formatCurrency($val, 'IDR')
```

---

<a id="bagian-35"></a>

## 35. 🛠️ Peta Ingatan Cepat

Mental model komprehensif seluruh domain PHP Standard Library:

```text
       ┌───────────────────────────────────────────────────────────────┐
       │                 PHP STANDARD LIBRARY ECOSYSTEM                │
       └───────────────────────────────┬───────────────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
   DATA & KOLEKSI                WAKTU & FORMAT                I/O & KEAMANAN
 ┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
 │ String Functions │         │ DateTimeImmutable│         │ File I/O & Stream│
 │ Multibyte (mb_)  │         │ DateInterval     │         │ JSON Processing  │
 │ Array Functions  │         │ DateTimeZone     │         │ Password Hash    │
 │ Array Callbacks  │         │ Regex (PCRE2)    │         │ CSPRNG Random    │
 │ Math & Numbers   │         │ Intl Formatter   │         │ Filter & URL     │
 └──────────────────┘         └──────────────────┘         └──────────────────┘
         │                             │                             │
         └─────────────────────────────┼─────────────────────────────┘
                                       │
                                       ▼
       ┌───────────────────────────────────────────────────────────────┐
       │              APLIKASI WEB CEPAT, STABIL & AMAN                │
       └───────────────────────────────────────────────────────────────┘
```

**Peta Ringkas Pemilihan API:**

```text
Manipulasi Teks  ──> strlen, trim, substr, str_contains, str_replace, explode, implode
Koleksi Data     ──> count, in_array, array_merge, array_map, array_filter, array_reduce
Waktu & Kalender ──> DateTimeImmutable, DateTimeZone, DateInterval, format('Y-m-d')
Data Web API     ──> json_encode, json_decode (JSON_THROW_ON_ERROR), filter_var
Penyimpanan File ──> file_get_contents, file_put_contents, fopen, fgetcsv, unlink
Keamanan Akun    ──> password_hash, password_verify, random_int, random_bytes
```

---

<a id="bagian-36"></a>

## 36. 📚 Tabel Ringkasan

| Domain | API / Fungsi Utama | Fungsi & Kegunaan Utama |
|---|---|---|
| **String** | `strlen()`, `trim()`, `substr()` | Panjang teks, hapus spasi, dan potong substring |
| **String Search** | `str_contains()`, `str_starts_with()` | Pemeriksaan awalan dan keberadaan substring (PHP 8+) |
| **String Replace**| `str_replace()`, `sprintf()` | Penggantian kata dan format template string |
| **Array Elemen** | `count()`, `array_push()`, `array_pop()` | Hitung jumlah dan manipulasi antrean LIFO/FIFO |
| **Array Search** | `in_array()`, `array_search()` | Pencarian nilai dan key (wajib strict `true`) |
| **Array Transform**| `array_map()`, `array_filter()` | Transformasi dan penyaringan elemen via callback |
| **Array Column** | `array_column()`, `array_chunk()` | Ekstrak kolom tabel dan pembagian batch data |
| **Sorting** | `asort()`, `arsort()`, `usort()` | Pengurutan array nilai, key, dan custom comparator |
| **Angka & Math** | `number_format()`, `round()`, `abs()` | Format ribuan desimal dan pembulatan matematika |
| **Waktu Modern** | `DateTimeImmutable`, `DateTimeZone` | Pengelolaan tanggal & zona waktu berbasis objek immutable |
| **JSON** | `json_encode()`, `json_decode()` | Serialisasi dan parsing data JSON (Throw on Error) |
| **Regex** | `preg_match()`, `preg_replace()` | Pencocokan dan penggantian pola teks PCRE2 |
| **File I/O** | `file_get_contents()`, `file_put_contents()` | Operasi baca-tulis file instan |
| **File Stream** | `fopen()`, `fgetcsv()`, `fputcsv()` | Streaming file dan CSV baris demi baris hemat RAM |
| **Validasi Web** | `filter_var()`, `parse_url()` | Validasi email/URL dan pembedah komponen URL |
| **Keamanan Hash**| `password_hash()`, `password_verify()` | Hashing kata sandi aman (Bcrypt / Argon2) |
| **Random Aman** | `random_int()`, `random_bytes()` | Generator angka dan token acak kriptografis CSPRNG |
| **Streaming RAM**| `yield` (Generator) | Penghasil iterasi data on-demand hemat memori |

---

<a id="bagian-37"></a>

## 37. ⚡ Cheat Code PHP Standard Library 10 Detik

```php
<?php

// 1. String & Multibyte
$nama = trim("  Budi Santoso  ");
$isPhp = str_contains($nama, "Budi");
$panjang = mb_strlen("Halo 👋", "UTF-8");

// 2. Array Manipulation & Callbacks
$angka = [10, 25, 50, 100];
$disaring = array_filter($angka, fn(int $n): bool => $n >= 50);
$rupiah   = array_map(fn(int $n): string => "Rp " . number_format($n, 0, ",", "."), $disaring);

// 3. DateTimeImmutable & Timezone
$tz = new DateTimeZone("Asia/Jakarta");
$sekarang = new DateTimeImmutable("now", $tz);
$jatuhTempo = $sekarang->modify("+7 days")->format("Y-m-d H:i:s");

// 4. JSON Safe Parsing
$json = json_encode(["status" => true, "data" => $rupiah], JSON_THROW_ON_ERROR);
$data = json_decode($json, true, 512, JSON_THROW_ON_ERROR);

// 5. Keamanan Password & Token
$hash = password_hash("Rahasia#2026", PASSWORD_DEFAULT);
$isValid = password_verify("Rahasia#2026", $hash);
$tokenOtp = random_int(100000, 999999);
$apiToken = bin2hex(random_bytes(16));
```

---

<a id="bagian-38"></a>

## 38. 🧭 Urutan Belajar yang Disarankan

```text
       ┌────────────────────────────────────────────────────────────┐
       │             TAHAP 1: FONDASI TEKS & KOLEKSI                │
       │  String Functions ──> Array Functions ──> Number & Math    │
       └─────────────────────────────┬──────────────────────────────┘
                                     │
                                     ▼
       ┌────────────────────────────────────────────────────────────┐
       │             TAHAP 2: WAKTU & DATA FORMATTING               │
       │  DateTimeImmutable ──> DateTimeZone ──> JSON ──> Filter    │
       └─────────────────────────────┬──────────────────────────────┘
                                     │
                                     ▼
       ┌────────────────────────────────────────────────────────────┐
       │             TAHAP 3: STORAGE & KOMUNIKASI WEB              │
       │  File I/O ──> File Stream & CSV ──> Path ──> URL Parsing   │
       └─────────────────────────────┬──────────────────────────────┘
                                     │
                                     ▼
       ┌────────────────────────────────────────────────────────────┐
       │             TAHAP 4: KEAMANAN & REGEX                      │
       │  Password Hashing ──> CSPRNG Random ──> Regex PCRE2 ──> mb_│
       └─────────────────────────────┬──────────────────────────────┘
                                     │
                                     ▼
       ┌────────────────────────────────────────────────────────────┐
       │             TAHAP 5: ADVANCED ARSITEKTUR & PROJECT         │
       │  Generators (yield) ──> Exceptions ──> Mini Project API    │
       └────────────────────────────────────────────────────────────┘
```

---

<a id="bagian-39"></a>

## 39. 🏗️ Mini Project: REST API & CLI Data Processor Terintegrasi

Mini project ini mengintegrasikan fungsi-fungsi Standard Library PHP paling penting: **`file_get_contents`**, **`json_decode` (JSON_THROW_ON_ERROR)**, **`filter_var`**, **`array_filter`**, **`array_map`**, **`DateTimeImmutable`**, **`password_hash`**, dan **`json_encode`**.

##### Kode Program (`api_processor.php`)

```php
<?php

declare(strict_types=1);

date_default_timezone_set("Asia/Jakarta");

// 1. Simulasi File Data Mentah JSON (Database File)
$fileDatabase = "users_raw.json";

$dummyJson = <<<JSON
[
    {"id": 1, "nama": "  Budi Santoso  ", "email": "budi@example.com", "role": "admin", "aktif": true, "saldo": 1500000},
    {"id": 2, "nama": "Andi Pratama", "email": "andi-invalid-email", "role": "user", "aktif": true, "saldo": 750000},
    {"id": 3, "nama": "Citra Lestari", "email": "citra@gmail.com", "role": "user", "aktif": false, "saldo": 250000},
    {"id": 4, "nama": "Dewi Sartika", "email": "dewi@perusahaan.co.id", "role": "user", "aktif": true, "saldo": 3200000}
]
JSON;

file_put_contents($fileDatabase, $dummyJson);

// 2. Fungsi Pemrosesan Data Menggunakan PHP Standard Library
function prosesDataPengguna(string $filePath): array
{
    if (!file_exists($filePath)) {
        throw new RuntimeException("File data tidak ditemukan: $filePath");
    }

    $rawContent = file_get_contents($filePath);
    $users = json_decode($rawContent, true, 512, JSON_THROW_ON_ERROR);

    // Filter 1: Hanya user yang aktif DAN memiliki format email valid (filter_var)
    $validUsers = array_filter($users, function (array $u): bool {
        $emailValid = (bool) filter_var($u["email"], FILTER_VALIDATE_EMAIL);
        return $u["aktif"] === true && $emailValid;
    });

    // Transformasi Data (array_map): Normalisasi string, format rupiah, dan buat default password hash
    $hasilTransform = array_map(function (array $u): array {
        return [
            "id" => $u["id"],
            "nama" => trim($u["nama"]),
            "email" => strtolower($u["email"]),
            "role" => strtoupper($u["role"]),
            "saldo_formatted" => "Rp " . number_format((float) $u["saldo"], 0, ",", "."),
            "password_hash" => password_hash("DefaultPass123!", PASSWORD_DEFAULT)
        ];
    }, $validUsers);

    return array_values($hasilTransform);
}

// 3. Eksekusi dan Penyusunan Response JSON API
try {
    $dataBersih = prosesDataPengguna($fileDatabase);

    $apiResponse = [
        "status" => "success",
        "code" => 200,
        "meta" => [
            "total_records" => count($dataBersih),
            "generated_at" => (new DateTimeImmutable())->format("Y-m-d H:i:s T"),
            "php_version" => PHP_VERSION
        ],
        "data" => $dataBersih
    ];

    echo json_encode($apiResponse, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);

} catch (Throwable $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ], JSON_PRETTY_PRINT);
} finally {
    // Cleanup file temporary
    if (file_exists($fileDatabase)) {
        unlink($fileDatabase);
    }
}
```

##### Output Eksekusi Program

```text
{
    "status": "success",
    "code": 200,
    "meta": {
        "total_records": 2,
        "generated_at": "2026-08-25 22:55:00 WIB",
        "php_version": "8.3.0"
    },
    "data": [
        {
            "id": 1,
            "nama": "Budi Santoso",
            "email": "budi@example.com",
            "role": "ADMIN",
            "saldo_formatted": "Rp 1.500.000",
            "password_hash": "$2y$10$..."
        },
        {
            "id": 4,
            "nama": "Dewi Sartika",
            "email": "dewi@perusahaan.co.id",
            "role": "USER",
            "saldo_formatted": "Rp 3.200.000",
            "password_hash": "$2y$10$..."
        }
    ]
}
```

---

<a id="bagian-40"></a>

## 40. 🔗 Referensi Resmi

- [PHP Manual — Function Reference](https://www.php.net/manual/en/funcref.php)

- [PHP Manual — String Functions](https://www.php.net/manual/en/ref.strings.php)

- [PHP Manual — Multibyte String (mbstring)](https://www.php.net/manual/en/book.mbstring.php)

- [PHP Manual — Array Functions](https://www.php.net/manual/en/ref.array.php)

- [PHP Manual — Math Functions](https://www.php.net/manual/en/ref.math.php)

- [PHP Manual — Date and Time](https://www.php.net/manual/en/book.datetime.php)

- [PHP Manual — DateTimeImmutable Class](https://www.php.net/manual/en/class.datetimeimmutable.php)

- [PHP Manual — JSON Functions](https://www.php.net/manual/en/book.json.php)

- [PHP Manual — PCRE / Regular Expressions](https://www.php.net/manual/en/book.pcre.php)

- [PHP Manual — Filesystem](https://www.php.net/manual/en/book.filesystem.php)

- [PHP Manual — Data Filtering](https://www.php.net/manual/en/book.filter.php)

- [PHP Manual — URL Functions](https://www.php.net/manual/en/book.url.php)

- [PHP Manual — Hash Functions](https://www.php.net/manual/en/book.hash.php)

- [PHP Manual — Password Hashing](https://www.php.net/manual/en/book.password.php)

- [PHP Manual — Cryptographic Random (CSPRNG)](https://www.php.net/manual/en/book.random.php)

- [PHP Manual — Standard PHP Library (SPL)](https://www.php.net/manual/en/book.spl.php)

- [PHP Manual — Generators](https://www.php.net/manual/en/language.generators.php)

- [PHP Manual — Exceptions Hierarchy](https://www.php.net/manual/en/language.exceptions.php)

- [PHP Manual — Reflection API](https://www.php.net/manual/en/book.reflection.php)

- [PHP Manual — Internationalization (Intl)](https://www.php.net/manual/en/book.intl.php)
