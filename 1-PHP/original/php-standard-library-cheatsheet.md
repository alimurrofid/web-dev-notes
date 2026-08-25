# PHP Standard Library Cheatsheet — Mudah Dipahami & Diingat

> **Target:** PHP Standard Library (fungsi dan class bawaan PHP) untuk kebutuhan sehari-hari.
>
> Pola: **konsep → syntax → contoh → output → hafalan**.
>
> Catatan: PHP memiliki sangat banyak extension dan fungsi bawaan. Cheatsheet ini fokus pada fitur standard library/core yang paling sering dipakai saat belajar PHP dan membuat aplikasi.

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [String](#2-string)
3. [Array](#3-array)
4. [Array Search](#4-array-search)
5. [Array Manipulation](#5-array-manipulation)
6. [Array Callback](#6-array-callback)
7. [Sorting](#7-sorting)
8. [Number](#8-number)
9. [Math](#9-math)
10. [Date dan Time](#10-date-dan-time)
11. [DateTime](#11-datetime)
12. [Timezone](#12-timezone)
13. [JSON](#13-json)
14. [Regular Expression](#14-regular-expression)
15. [File dan Directory](#15-file-dan-directory)
16. [Filesystem](#16-filesystem)
17. [Path](#17-path)
18. [Filter](#18-filter)
19. [URL](#19-url)
20. [Variable](#20-variable)
21. [Constant](#21-constant)
22. [Type Checking](#22-type-checking)
23. [String Encoding](#23-string-encoding)
24. [Hash](#24-hash)
25. [Random](#25-random)
26. [Serialization](#26-serialization)
27. [Iterator](#27-iterator)
28. [Closure](#28-closure)
29. [Generator](#29-generator)
30. [Exception dan Error](#30-exception-dan-error)
31. [Reflection](#31-reflection)
32. [Intl Singkat](#32-intl-singkat)
33. [Date dan Number Formatting](#33-date-dan-number-formatting)
34. [Mini Project](#34-mini-project)
35. [Tabel Ringkasan](#35-tabel-ringkasan)
36. [Cheat Code PHP Standard Library 10 Detik](#36-cheat-code-php-standard-library-10-detik)
37. [Referensi Resmi](#37-referensi-resmi)

---

# 1. Pendahuluan

**PHP Standard Library** adalah kumpulan fungsi, class, interface, constant, dan utility yang tersedia bersama PHP atau melalui extension resmi PHP.

Contoh:

```php
strlen("Hello");
count([1, 2, 3]);
json_encode(["name" => "Budi"]);
date("Y-m-d");
```

Beberapa API berasal dari **core PHP**, sedangkan sebagian lainnya berasal dari extension yang umum tersedia seperti `json`, `mbstring`, `intl`, dan lainnya.

Secara sederhana:

```text
PHP
│
├── Language
│   ├── variable
│   ├── function
│   ├── class
│   └── control flow
│
└── Standard Library / Built-in APIs
    ├── String
    ├── Array
    ├── DateTime
    ├── JSON
    ├── File
    ├── Regex
    ├── Hash
    ├── Random
    └── ...
```

**Hafalan:**

```text
PHP Standard Library
→ alat siap pakai PHP
→ tidak perlu membuat semuanya dari nol
```

---

# 2. String

PHP menyediakan banyak fungsi untuk memproses string.

## `strlen()`

Menghitung panjang string dalam byte.

```php
$name = "Budi";

echo strlen($name);
```

Output:

```text
4
```

> Untuk string multibyte seperti UTF-8, gunakan `mb_strlen()` jika extension `mbstring` tersedia.

## `strtolower()`

```php
echo strtolower("HELLO");
```

Output:

```text
hello
```

## `strtoupper()`

```php
echo strtoupper("hello");
```

Output:

```text
HELLO
```

## `trim()`

Menghapus whitespace di awal dan akhir.

```php
$name = "  Budi  ";

echo trim($name);
```

Output:

```text
Budi
```

## `ltrim()`

```php
echo ltrim("  Hello");
```

## `rtrim()`

```php
echo rtrim("Hello  ");
```

## `substr()`

```php
$text = "Hello World";

echo substr($text, 0, 5);
```

Output:

```text
Hello
```

## `strpos()`

Mencari posisi substring.

```php
$text = "Hello World";

echo strpos($text, "World");
```

Output:

```text
6
```

Jika tidak ditemukan:

```php
var_dump(strpos("Hello", "PHP"));
```

Output:

```text
bool(false)
```

**Penting:**

```php
if (strpos($text, "Hello") !== false) {
    echo "Ketemu";
}
```

Jangan menggunakan:

```php
if (strpos($text, "Hello")) {
    // bisa salah jika hasilnya 0
}
```

## `str_contains()`

PHP modern:

```php
$text = "Hello World";

var_dump(
    str_contains($text, "World")
);
```

Output:

```text
bool(true)
```

## `str_starts_with()`

```php
var_dump(
    str_starts_with("Hello World", "Hello")
);
```

## `str_ends_with()`

```php
var_dump(
    str_ends_with("Hello World", "World")
);
```

## `str_replace()`

```php
$text = "Hello Budi";

echo str_replace(
    "Budi",
    "Andi",
    $text
);
```

Output:

```text
Hello Andi
```

## `str_repeat()`

```php
echo str_repeat("*", 5);
```

Output:

```text
*****
```

## `str_pad()`

```php
echo str_pad(
    "PHP",
    6,
    "-"
);
```

Output:

```text
PHP---
```

## `explode()`

String → array.

```php
$text = "apel,jeruk,mangga";

$fruits = explode(",", $text);

print_r($fruits);
```

## `implode()`

Array → string.

```php
$fruits = [
    "apel",
    "jeruk",
    "mangga"
];

echo implode(", ", $fruits);
```

Output:

```text
apel, jeruk, mangga
```

## `sprintf()`

Membuat string berdasarkan format.

```php
$name = "Budi";
$age = 20;

$message = sprintf(
    "Nama %s, umur %d",
    $name,
    $age
);

echo $message;
```

Output:

```text
Nama Budi, umur 20
```

**Hafalan:**

```text
strlen          → panjang
trim            → bersihkan
substr          → ambil bagian
strpos          → cari posisi
str_contains     → cek isi
str_replace     → ganti
explode          → string → array
implode          → array → string
sprintf          → format string
```

---

# 3. Array

Array PHP dapat digunakan sebagai:

```text
list
map
dictionary
collection
```

Contoh:

```php
$names = [
    "Budi",
    "Andi",
    "Citra"
];
```

## `count()`

```php
echo count($names);
```

Output:

```text
3
```

## `array_values()`

Mengambil semua value.

```php
$data = [
    "name" => "Budi",
    "age" => 20
];

print_r(
    array_values($data)
);
```

## `array_keys()`

```php
print_r(
    array_keys($data)
);
```

Output:

```text
Array
(
    [0] => name
    [1] => age
)
```

## `array_key_exists()`

```php
var_dump(
    array_key_exists("name", $data)
);
```

Output:

```text
bool(true)
```

**Perhatikan perbedaan:**

```php
isset($data["name"]);
```

dan:

```php
array_key_exists("name", $data);
```

`array_key_exists()` tetap `true` jika key ada tetapi nilainya `null`.

---

# 4. Array Search

## `in_array()`

Mengecek apakah value ada.

```php
$names = [
    "Budi",
    "Andi"
];

var_dump(
    in_array("Budi", $names)
);
```

Output:

```text
bool(true)
```

Gunakan strict mode jika tipe juga harus sama:

```php
in_array(
    10,
    ["10"],
    true
);
```

Output:

```text
false
```

## `array_search()`

Mengembalikan key/index.

```php
$names = [
    "Budi",
    "Andi"
];

echo array_search(
    "Andi",
    $names,
    true
);
```

Output:

```text
1
```

Jika tidak ditemukan:

```text
false
```

Gunakan:

```php
$result = array_search(
    "Andi",
    $names,
    true
);

if ($result !== false) {
    echo "Ketemu";
}
```

---

# 5. Array Manipulation

## `array_push()`

```php
$names = [
    "Budi"
];

array_push(
    $names,
    "Andi",
    "Citra"
);

print_r($names);
```

Lebih sederhana untuk menambahkan item:

```php
$names[] = "Andi";
```

## `array_pop()`

Menghapus item terakhir.

```php
$names = [
    "Budi",
    "Andi"
];

$last = array_pop($names);

echo $last;
```

Output:

```text
Andi
```

## `array_shift()`

Menghapus item pertama.

```php
$first = array_shift($names);
```

## `array_unshift()`

Menambahkan item di awal.

```php
array_unshift(
    $names,
    "Citra"
);
```

## `array_merge()`

Menggabungkan array.

```php
$a = [1, 2];
$b = [3, 4];

$result = array_merge($a, $b);

print_r($result);
```

Output:

```text
Array
(
    [0] => 1
    [1] => 2
    [2] => 3
    [3] => 4
)
```

Untuk associative array, key string dengan nama sama dapat ditimpa oleh array berikutnya.

## Spread operator

```php
$a = [1, 2];
$b = [3, 4];

$result = [
    ...$a,
    ...$b
];
```

## `array_slice()`

Mengambil sebagian array tanpa mengubah array asli.

```php
$data = [
    "A",
    "B",
    "C",
    "D"
];

print_r(
    array_slice($data, 1, 2)
);
```

Output:

```text
B
C
```

## `array_splice()`

Menghapus atau mengganti bagian array.

```php
$data = [
    "A",
    "B",
    "C"
];

array_splice(
    $data,
    1,
    1,
    ["X"]
);

print_r($data);
```

Hasil:

```text
A
X
C
```

## `array_unique()`

```php
$data = [
    "A",
    "B",
    "A"
];

print_r(
    array_unique($data)
);
```

## `array_reverse()`

```php
$data = [1, 2, 3];

print_r(
    array_reverse($data)
);
```

## `array_flip()`

Menukar key dan value.

```php
$data = [
    "name" => "Budi",
    "age" => "20"
];

print_r(
    array_flip($data)
);
```

**Hafalan:**

```text
push     → tambah belakang
pop      → hapus belakang
shift    → hapus depan
unshift  → tambah depan
merge    → gabung
slice    → ambil sebagian
splice   → potong/ubah
unique   → hilangkan duplikat
reverse  → balik urutan
```

---

# 6. Array Callback

Banyak fungsi array menerima callback.

## `array_map()`

Mengubah setiap item.

```php
$numbers = [
    1,
    2,
    3
];

$result = array_map(
    fn($number) => $number * 2,
    $numbers
);

print_r($result);
```

Hasil:

```text
2
4
6
```

## `array_filter()`

Menyaring item.

```php
$numbers = [
    1,
    2,
    3,
    4
];

$result = array_filter(
    $numbers,
    fn($number) => $number % 2 === 0
);

print_r($result);
```

Hasil:

```text
2
4
```

> `array_filter()` mempertahankan key. Jika membutuhkan index berurutan kembali, gunakan `array_values()`.

```php
$result = array_values($result);
```

## `array_reduce()`

Menghasilkan satu nilai dari array.

```php
$numbers = [
    1,
    2,
    3,
    4
];

$total = array_reduce(
    $numbers,
    fn($carry, $number) =>
        $carry + $number,
    0
);

echo $total;
```

Output:

```text
10
```

## `array_walk()`

Menjalankan callback untuk setiap item.

```php
$names = [
    "Budi",
    "Andi"
];

array_walk(
    $names,
    function ($name) {
        echo $name . PHP_EOL;
    }
);
```

**Hafalan:**

```text
map
→ ubah semua

filter
→ pilih sebagian

reduce
→ banyak → satu

walk
→ jalankan aksi pada setiap item
```

---

# 7. Sorting

## `sort()`

Sort ascending berdasarkan value dan reset key.

```php
$data = [
    3,
    1,
    2
];

sort($data);

print_r($data);
```

Hasil:

```text
1
2
3
```

## `rsort()`

Descending:

```php
rsort($data);
```

## `asort()`

Sort value dan mempertahankan key.

```php
$data = [
    "a" => 30,
    "b" => 10,
    "c" => 20
];

asort($data);
```

## `arsort()`

Descending berdasarkan value:

```php
arsort($data);
```

## `ksort()`

Sort berdasarkan key:

```php
ksort($data);
```

## `krsort()`

Descending berdasarkan key:

```php
krsort($data);
```

## `usort()`

Custom sorting.

```php
$numbers = [
    3,
    1,
    2
];

usort(
    $numbers,
    fn($a, $b) => $a <=> $b
);
```

**Hafalan:**

```text
sort   → value ASC, reset key
rsort  → value DESC, reset key

asort  → value ASC, keep key
arsort → value DESC, keep key

ksort  → key ASC
krsort → key DESC

usort  → custom
```

---

# 8. Number

## `is_int()`

```php
var_dump(
    is_int(10)
);
```

Output:

```text
bool(true)
```

## `is_float()`

```php
var_dump(
    is_float(10.5)
);
```

## `is_numeric()`

```php
var_dump(
    is_numeric("100")
);
```

Output:

```text
bool(true)
```

## `intval()`

```php
echo intval("100");
```

## `floatval()`

```php
echo floatval("10.5");
```

## `number_format()`

```php
echo number_format(
    1234567.89,
    2,
    ",",
    "."
);
```

Output:

```text
1.234.567,89
```

**Hafalan:**

```text
is_int
→ cek integer

is_float
→ cek float

is_numeric
→ cek apakah numerik

intval
→ jadi integer

floatval
→ jadi float

number_format
→ format angka
```

---

# 9. Math

## `abs()`

Nilai absolut.

```php
echo abs(-10);
```

Output:

```text
10
```

## `round()`

```php
echo round(10.6);
```

Output:

```text
11
```

## `ceil()`

Pembulatan ke atas.

```php
echo ceil(10.1);
```

Output:

```text
11
```

## `floor()`

Pembulatan ke bawah.

```php
echo floor(10.9);
```

Output:

```text
10
```

## `min()`

```php
echo min(10, 5, 20);
```

Output:

```text
5
```

## `max()`

```php
echo max(10, 5, 20);
```

Output:

```text
20
```

## `pow()`

```php
echo pow(2, 3);
```

Output:

```text
8
```

Operator `**` juga tersedia:

```php
echo 2 ** 3;
```

## `sqrt()`

```php
echo sqrt(16);
```

Output:

```text
4
```

## `random_int()`

Untuk integer acak yang aman secara kriptografis.

```php
$number = random_int(1, 100);

echo $number;
```

**Hafalan:**

```text
abs
round
ceil
floor
min
max
pow
sqrt
random_int
```

---

# 10. Date dan Time

## `time()`

Timestamp Unix saat ini.

```php
echo time();
```

## `date()`

Format timestamp.

```php
echo date("Y-m-d");
```

Contoh output:

```text
2026-08-17
```

Format umum:

| Format | Arti |
|---|---|
| `Y` | tahun 4 digit |
| `y` | tahun 2 digit |
| `m` | bulan 2 digit |
| `d` | hari 2 digit |
| `H` | jam 24 jam |
| `i` | menit |
| `s` | detik |
| `l` | nama hari |
| `F` | nama bulan |

Contoh:

```php
echo date(
    "Y-m-d H:i:s"
);
```

## `strtotime()`

String waktu → Unix timestamp.

```php
$timestamp =
    strtotime("tomorrow");

echo date(
    "Y-m-d",
    $timestamp
);
```

## `date_default_timezone_set()`

```php
date_default_timezone_set(
    "Asia/Jakarta"
);

echo date(
    "Y-m-d H:i:s"
);
```

**Catatan:** Untuk aplikasi modern, lebih baik gunakan class `DateTimeImmutable` dan `DateTimeZone` daripada mengandalkan fungsi tanggal global untuk logika yang kompleks.

---

# 11. DateTime

`DateTime` adalah object untuk bekerja dengan tanggal dan waktu.

## Membuat DateTime

```php
$date = new DateTime();

echo $date->format(
    "Y-m-d H:i:s"
);
```

## Tanggal tertentu

```php
$date = new DateTime(
    "2026-01-01"
);

echo $date->format("Y-m-d");
```

## `modify()`

```php
$date = new DateTime(
    "2026-01-01"
);

$date->modify("+7 days");

echo $date->format("Y-m-d");
```

Output:

```text
2026-01-08
```

## `DateTimeImmutable`

```php
$date =
    new DateTimeImmutable(
        "2026-01-01"
    );

$newDate =
    $date->modify("+7 days");

echo $date->format("Y-m-d");
echo PHP_EOL;
echo $newDate->format("Y-m-d");
```

Output:

```text
2026-01-01
2026-01-08
```

`DateTimeImmutable` mengembalikan object baru ketika dimodifikasi.

## `DateInterval`

```php
$interval =
    new DateInterval("P7D");

$date =
    new DateTimeImmutable(
        "2026-01-01"
    );

$result =
    $date->add($interval);

echo $result->format("Y-m-d");
```

## `DatePeriod`

Untuk periode tanggal:

```php
$start =
    new DateTimeImmutable(
        "2026-01-01"
    );

$interval =
    new DateInterval("P1D");

$end =
    new DateTimeImmutable(
        "2026-01-04"
    );

$period =
    new DatePeriod(
        $start,
        $interval,
        $end
    );

foreach ($period as $date) {
    echo $date->format("Y-m-d");
    echo PHP_EOL;
}
```

**Hafalan:**

```text
DateTime
→ tanggal yang mutable

DateTimeImmutable
→ tanggal immutable

DateInterval
→ jarak/perubahan waktu

DatePeriod
→ kumpulan waktu dalam periode
```

---

# 12. Timezone

## `DateTimeZone`

```php
$timezone =
    new DateTimeZone(
        "Asia/Jakarta"
    );

$date =
    new DateTimeImmutable(
        "now",
        $timezone
    );

echo $date->format(
    "Y-m-d H:i:s"
);
```

Contoh timezone:

```text
Asia/Jakarta
Asia/Makassar
Asia/Jayapura
UTC
America/New_York
Europe/London
```

## `setTimezone()`

```php
$date =
    new DateTimeImmutable(
        "2026-01-01 12:00:00",
        new DateTimeZone("UTC")
    );

$jakarta =
    $date->setTimezone(
        new DateTimeZone("Asia/Jakarta")
    );

echo $jakarta->format(
    "Y-m-d H:i:s"
);
```

**Hafalan:**

```text
DateTimeZone
→ timezone

setTimezone()
→ konversi tampilan timezone
```

---

# 13. JSON

JSON sering digunakan untuk API dan pertukaran data.

## `json_encode()`

PHP → JSON.

```php
$data = [
    "name" => "Budi",
    "age" => 20
];

$json =
    json_encode($data);

echo $json;
```

Output:

```json
{"name":"Budi","age":20}
```

## Pretty JSON

```php
$json = json_encode(
    $data,
    JSON_PRETTY_PRINT
);

echo $json;
```

## `json_decode()`

JSON → PHP.

```php
$json =
    '{"name":"Budi","age":20}';

$data =
    json_decode($json, true);

print_r($data);
```

Jika argumen kedua `true`, hasil object JSON menjadi associative array.

Tanpa `true`:

```php
$data =
    json_decode($json);

echo $data->name;
```

## Error JSON

```php
$json = "{invalid}";

$data =
    json_decode($json);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_last_error_msg();
}
```

## `JSON_THROW_ON_ERROR`

Untuk aplikasi modern, sering lebih nyaman:

```php
try {
    $data = json_decode(
        $json,
        true,
        512,
        JSON_THROW_ON_ERROR
    );
} catch (JsonException $e) {
    echo $e->getMessage();
}
```

**Hafalan:**

```text
json_encode
→ PHP → JSON

json_decode
→ JSON → PHP

JSON_PRETTY_PRINT
→ JSON rapi

JSON_THROW_ON_ERROR
→ lempar exception jika JSON error
```

---

# 14. Regular Expression

Regex digunakan untuk mencari atau memvalidasi pola teks.

## `preg_match()`

```php
$text = "Belajar PHP";

if (preg_match(
    "/PHP/",
    $text
)) {
    echo "Ketemu";
}
```

## Mencari angka

```php
$text = "Umur saya 20 tahun";

preg_match(
    "/\d+/",
    $text,
    $matches
);

print_r($matches);
```

## `preg_match_all()`

```php
$text =
    "PHP 8, PHP 9";

preg_match_all(
    "/PHP/",
    $text,
    $matches
);

print_r($matches[0]);
```

## `preg_replace()`

```php
$text =
    "Hello 123";

$result =
    preg_replace(
        "/\d+/",
        "***",
        $text
    );

echo $result;
```

Output:

```text
Hello ***
```

## `preg_split()`

```php
$text =
    "apel,jeruk,mangga";

$result =
    preg_split(
        "/,/",
        $text
    );

print_r($result);
```

**Hafalan:**

```text
preg_match
→ cari satu pola

preg_match_all
→ cari semua

preg_replace
→ cari + ganti

preg_split
→ pecah berdasarkan regex
```

---

# 15. File dan Directory

## `file_get_contents()`

Membaca seluruh file menjadi string.

```php
$content =
    file_get_contents(
        "data.txt"
    );

echo $content;
```

## `file_put_contents()`

Menulis string ke file.

```php
file_put_contents(
    "data.txt",
    "Hello PHP"
);
```

## Append

```php
file_put_contents(
    "data.txt",
    "Baris baru\n",
    FILE_APPEND
);
```

## `file_exists()`

```php
if (file_exists("data.txt")) {
    echo "File ada";
}
```

## `is_file()`

```php
var_dump(
    is_file("data.txt")
);
```

## `is_dir()`

```php
var_dump(
    is_dir("data")
);
```

## `mkdir()`

```php
if (!is_dir("data")) {
    mkdir("data");
}
```

Untuk directory bertingkat:

```php
mkdir(
    "data/cache/log",
    0777,
    true
);
```

> Permission aktual tetap dipengaruhi konfigurasi OS dan umask.

## `rmdir()`

Menghapus directory kosong.

```php
rmdir("data");
```

## `unlink()`

Menghapus file.

```php
unlink("data.txt");
```

**Hafalan:**

```text
file_get_contents
→ baca file

file_put_contents
→ tulis file

file_exists
→ cek ada

mkdir
→ buat directory

rmdir
→ hapus directory kosong

unlink
→ hapus file
```

---

# 16. Filesystem

## `filesize()`

```php
echo filesize("data.txt");
```

## `filemtime()`

Waktu terakhir file diubah.

```php
$time =
    filemtime("data.txt");

echo date(
    "Y-m-d H:i:s",
    $time
);
```

## `copy()`

```php
copy(
    "data.txt",
    "backup.txt"
);
```

## `rename()`

```php
rename(
    "backup.txt",
    "data-backup.txt"
);
```

## `scandir()`

```php
$files =
    scandir(".");

print_r($files);
```

## `glob()`

Mencari file berdasarkan pattern.

```php
$files =
    glob("*.php");

print_r($files);
```

**Hafalan:**

```text
filesize
→ ukuran

filemtime
→ waktu modifikasi

copy
→ salin

rename
→ pindah/ganti nama

scandir
→ isi directory

glob
→ cari berdasarkan pattern
```

---

# 17. Path

## `basename()`

```php
$path =
    "/var/www/index.php";

echo basename($path);
```

Output:

```text
index.php
```

## `dirname()`

```php
echo dirname($path);
```

Output:

```text
/var/www
```

## `pathinfo()`

```php
print_r(
    pathinfo(
        "/var/www/index.php"
    )
);
```

Menghasilkan informasi seperti:

```text
dirname
basename
extension
filename
```

## `realpath()`

```php
echo realpath("data.txt");
```

Jika path dapat diselesaikan, hasilnya berupa path absolut.

**Hafalan:**

```text
basename → nama file
dirname   → folder
pathinfo  → detail path
realpath  → path absolut yang terselesaikan
```

---

# 18. Filter

Extension `filter` menyediakan validasi dan sanitasi.

## `filter_var()`

Validasi email:

```php
$email =
    "budi@example.com";

if (filter_var(
    $email,
    FILTER_VALIDATE_EMAIL
)) {
    echo "Email valid";
}
```

## Validasi URL

```php
$url =
    "https://example.com";

var_dump(
    filter_var(
        $url,
        FILTER_VALIDATE_URL
    )
);
```

## Validasi integer

```php
$value = "100";

$result =
    filter_var(
        $value,
        FILTER_VALIDATE_INT
    );

var_dump($result);
```

## Sanitasi

PHP memiliki filter sanitasi, tetapi untuk aplikasi modern jangan menganggap `FILTER_SANITIZE_*` sebagai solusi universal untuk keamanan output.

Untuk output HTML, gunakan escaping sesuai context, misalnya:

```php
echo htmlspecialchars(
    $userInput,
    ENT_QUOTES,
    "UTF-8"
);
```

**Hafalan:**

```text
filter_var()
→ validasi / filter

htmlspecialchars()
→ escape teks untuk HTML
```

---

# 19. URL

## `parse_url()`

```php
$url =
    "https://example.com:8080/path?id=10";

print_r(
    parse_url($url)
);
```

Informasi dapat berupa:

```text
scheme
host
port
path
query
fragment
```

## `http_build_query()`

Array → query string.

```php
$data = [
    "name" => "Budi",
    "age" => 20
];

echo http_build_query($data);
```

Hasil kira-kira:

```text
name=Budi&age=20
```

## `urlencode()`

```php
echo urlencode(
    "hello world"
);
```

## `rawurlencode()`

```php
echo rawurlencode(
    "hello world"
);
```

Untuk membangun query string, `http_build_query()` biasanya lebih praktis.

**Hafalan:**

```text
parse_url
→ URL → array informasi

http_build_query
→ array → query string

urlencode/rawurlencode
→ encode komponen string URL
```

---

# 20. Variable

## `isset()`

Mengecek apakah variable ada dan tidak `null`.

```php
$name = "Budi";

var_dump(
    isset($name)
);
```

## `empty()`

Mengecek apakah nilai dianggap kosong.

```php
$value = "";

var_dump(
    empty($value)
);
```

## `unset()`

Menghapus variable.

```php
$name = "Budi";

unset($name);

var_dump(
    isset($name)
);
```

Output:

```text
bool(false)
```

## `gettype()`

```php
$value = 100;

echo gettype($value);
```

Output:

```text
integer
```

**Hafalan:**

```text
isset → ada dan bukan null
empty → dianggap kosong
unset → hapus variable
gettype → tipe variable
```

---

# 21. Constant

## `define()`

```php
define(
    "APP_NAME",
    "Belajar PHP"
);

echo APP_NAME;
```

## `constant()`

Mengambil constant berdasarkan nama string:

```php
$name = "APP_NAME";

echo constant($name);
```

## `defined()`

```php
var_dump(
    defined("APP_NAME")
);
```

Dalam PHP modern, constant juga sering dibuat dengan:

```php
const APP_VERSION = "1.0.0";
```

**Hafalan:**

```text
define()
→ buat constant

defined()
→ cek constant

constant()
→ ambil constant berdasarkan nama
```

---

# 22. Type Checking

Fungsi `is_*()` berguna untuk mengecek tipe data.

```php
is_null($value);
is_bool($value);
is_int($value);
is_float($value);
is_string($value);
is_array($value);
is_object($value);
is_resource($value);
```

Contoh:

```php
$value = "PHP";

if (is_string($value)) {
    echo "String";
}
```

## `is_scalar()`

Mengecek apakah nilai merupakan scalar:

```text
bool
int
float
string
```

Contoh:

```php
var_dump(
    is_scalar("PHP")
);
```

## `is_iterable()`

```php
$data = [1, 2, 3];

var_dump(
    is_iterable($data)
);
```

Output:

```text
bool(true)
```

**Hafalan:**

```text
is_*()
→ cek tipe

is_scalar()
→ scalar

is_iterable()
→ bisa digunakan dalam foreach
```

---

# 23. String Encoding

Untuk teks multibyte/Unicode, `mbstring` sangat penting.

## `mb_strlen()`

```php
$text = "Indonesia";

echo mb_strlen(
    $text,
    "UTF-8"
);
```

## `mb_strtolower()`

```php
echo mb_strtolower(
    "HELLO",
    "UTF-8"
);
```

## `mb_strtoupper()`

```php
echo mb_strtoupper(
    "hello",
    "UTF-8"
);
```

## `mb_substr()`

```php
$text =
    "Belajar PHP";

echo mb_substr(
    $text,
    0,
    7,
    "UTF-8"
);
```

**Hafalan:**

```text
strlen
→ byte

mb_strlen
→ karakter multibyte

substr
→ substring berbasis byte

mb_substr
→ substring multibyte
```

Untuk aplikasi yang banyak menggunakan Unicode, biasakan menggunakan `mb_*()` jika operasi string memang membutuhkan dukungan multibyte.

---

# 24. Hash

Hash digunakan untuk menghasilkan nilai hash dari data.

## `hash()`

```php
$result =
    hash(
        "sha256",
        "Hello"
    );

echo $result;
```

Algoritma populer:

```text
sha256
sha512
md5
sha1
```

> Untuk keamanan modern, jangan menggunakan MD5/SHA-1 sebagai password hashing.

## Password hashing

Untuk password gunakan API khusus:

```php
$password = "rahasia";

$hash =
    password_hash(
        $password,
        PASSWORD_DEFAULT
    );

echo $hash;
```

Verifikasi:

```php
if (password_verify(
    "rahasia",
    $hash
)) {
    echo "Password benar";
}
```

Mengecek apakah hash perlu diperbarui:

```php
if (password_needs_rehash(
    $hash,
    PASSWORD_DEFAULT
)) {
    // Buat hash baru
}
```

**Hafalan:**

```text
hash()
→ hash umum

password_hash()
→ password

password_verify()
→ verifikasi password
```

---

# 25. Random

## `random_int()`

Untuk integer acak yang aman secara kriptografis.

```php
echo random_int(
    1,
    100
);
```

## `random_bytes()`

Menghasilkan random bytes yang aman secara kriptografis.

```php
$bytes =
    random_bytes(16);

echo bin2hex($bytes);
```

## `bin2hex()`

Binary → hexadecimal.

```php
echo bin2hex(
    random_bytes(8)
);
```

## `hex2bin()`

Hexadecimal → binary.

```php
$hex = "48656c6c6f";

echo hex2bin($hex);
```

Output:

```text
Hello
```

**Hafalan:**

```text
random_int
→ random integer aman

random_bytes
→ random bytes aman

bin2hex
→ binary → hex

hex2bin
→ hex → binary
```

Jangan menggunakan:

```php
rand()
mt_rand()
```

untuk token, password reset, session secret, atau kebutuhan keamanan.

---

# 26. Serialization

Serialization mengubah data PHP menjadi representasi string.

## `serialize()`

```php
$data = [
    "name" => "Budi",
    "age" => 20
];

$result =
    serialize($data);

echo $result;
```

## `unserialize()`

```php
$data =
    unserialize($result);

print_r($data);
```

### Keamanan

Jangan sembarangan melakukan:

```php
unserialize($untrustedInput);
```

terhadap data yang berasal dari user atau sumber tidak dipercaya.

Jika hanya membutuhkan format pertukaran data, JSON biasanya lebih aman dan interoperable:

```php
json_encode($data);
json_decode($json, true);
```

**Hafalan:**

```text
serialize
→ PHP data → string PHP

unserialize
→ string PHP → PHP data

untrusted input
→ jangan langsung unserialize
```

---

# 27. Iterator

PHP memiliki konsep `Traversable`, `Iterator`, dan banyak object yang dapat digunakan dengan `foreach`.

Contoh:

```php
$data = [
    "Budi",
    "Andi"
];

foreach ($data as $name) {
    echo $name;
}
```

## `Iterator`

Interface utama:

```php
interface Iterator extends Traversable
{
    public function current(): mixed;
    public function key(): mixed;
    public function next(): void;
    public function rewind(): void;
    public function valid(): bool;
}
```

Contoh sederhana:

```php
class Names implements Iterator
{
    private array $names = [
        "Budi",
        "Andi",
        "Citra"
    ];

    private int $position = 0;

    public function current(): mixed
    {
        return $this->names[$this->position];
    }

    public function key(): mixed
    {
        return $this->position;
    }

    public function next(): void
    {
        $this->position++;
    }

    public function rewind(): void
    {
        $this->position = 0;
    }

    public function valid(): bool
    {
        return isset(
            $this->names[$this->position]
        );
    }
}

$names = new Names();

foreach ($names as $name) {
    echo $name . PHP_EOL;
}
```

**Hafalan:**

```text
Iterator
→ object yang bisa dikontrol cara iterasinya
```

---

# 28. Closure

Closure adalah function yang dapat disimpan sebagai value.

```php
$greet = function (
    string $name
): string {
    return "Hello $name";
};

echo $greet("Budi");
```

Dengan arrow function:

```php
$double =
    fn($number) => $number * 2;

echo $double(10);
```

Closure sering dipakai bersama array:

```php
$numbers = [
    1,
    2,
    3
];

$result = array_map(
    fn($number) => $number * 2,
    $numbers
);
```

## `use`

Closure dapat menangkap variable dari scope luar:

```php
$tax = 0.11;

$calculate =
    function ($price) use ($tax) {
        return $price + (
            $price * $tax
        );
    };

echo $calculate(100);
```

**Hafalan:**

```text
Closure
→ function sebagai value
→ sering dipakai callback
```

---

# 29. Generator

Generator menggunakan `yield` untuk menghasilkan value satu per satu.

```php
function numbers(): Generator
{
    yield 1;
    yield 2;
    yield 3;
}

foreach (numbers() as $number) {
    echo $number;
}
```

Generator tidak harus membuat seluruh array di memory sekaligus.

Contoh:

```php
function rangeGenerator(
    int $start,
    int $end
): Generator {
    for (
        $i = $start;
        $i <= $end;
        $i++
    ) {
        yield $i;
    }
}

foreach (
    rangeGenerator(1, 3)
    as $number
) {
    echo $number;
}
```

**Hafalan:**

```text
yield
→ hasilkan value bertahap

Generator
→ iterable yang dapat menghasilkan data secara lazy
```

---

# 30. Exception dan Error

## `Exception`

```php
throw new Exception(
    "Terjadi kesalahan"
);
```

## `try/catch`

```php
try {
    throw new Exception(
        "Terjadi kesalahan"
    );
} catch (Exception $e) {
    echo $e->getMessage();
}
```

## `finally`

```php
try {
    echo "Proses";
} catch (Exception $e) {
    echo "Error";
} finally {
    echo "Selesai";
}
```

## `Throwable`

PHP modern memiliki hierarchy utama:

```text
Throwable
├── Error
└── Exception
```

Karena itu, secara umum error/exception yang dapat ditangkap dapat ditangani dengan:

```php
try {
    // ...
} catch (Throwable $e) {
    echo $e->getMessage();
}
```

## `ErrorException`

PHP juga menyediakan `ErrorException` untuk merepresentasikan error level tertentu sebagai exception ketika memang diperlukan.

**Hafalan:**

```text
try
→ jalankan

throw
→ lempar

catch
→ tangkap

finally
→ selalu dijalankan setelah try/catch selesai
```

---

# 31. Reflection

Reflection digunakan untuk menginspeksi class, method, property, parameter, dan struktur object saat runtime.

## `ReflectionClass`

```php
class User
{
    public string $name;

    public function login(): void
    {
    }
}

$reflection =
    new ReflectionClass(User::class);

echo $reflection->getName();
```

## Method

```php
$methods =
    $reflection->getMethods();

foreach ($methods as $method) {
    echo $method->getName();
}
```

## Property

```php
$properties =
    $reflection->getProperties();

foreach ($properties as $property) {
    echo $property->getName();
}
```

Reflection sering digunakan oleh:

```text
framework
dependency injection
ORM
testing tools
debugging tools
```

**Hafalan:**

```text
Reflection
→ melihat struktur PHP object/class saat runtime
```

---

# 32. Intl Singkat

Extension `intl` menyediakan API internasionalisasi.

Salah satu class penting:

```php
NumberFormatter
```

Contoh:

```php
$formatter =
    new NumberFormatter(
        "id_ID",
        NumberFormatter::CURRENCY
    );

echo $formatter->formatCurrency(
    150000,
    "IDR"
);
```

Contoh lain:

```php
$formatter =
    new NumberFormatter(
        "id_ID",
        NumberFormatter::DECIMAL
    );

echo $formatter->format(1234567.89);
```

`intl` berguna untuk:

```text
format angka
currency
tanggal
locale
collation
internationalization
```

> Ketersediaan fitur ini bergantung pada extension `intl`.

---

# 33. Date dan Number Formatting

Untuk aplikasi yang membutuhkan format berdasarkan locale, `intl` lebih cocok daripada merakit string secara manual.

## `NumberFormatter`

```php
$formatter =
    new NumberFormatter(
        "id_ID",
        NumberFormatter::CURRENCY
    );

echo $formatter->formatCurrency(
    2500000,
    "IDR"
);
```

## `IntlDateFormatter`

```php
$formatter =
    new IntlDateFormatter(
        "id_ID",
        IntlDateFormatter::LONG,
        IntlDateFormatter::NONE,
        "Asia/Jakarta"
    );

echo $formatter->format(
    new DateTimeImmutable()
);
```

Perbedaan konsep:

```text
date()
→ format sederhana berdasarkan pattern PHP

DateTime::format()
→ format object tanggal

IntlDateFormatter
→ format berdasarkan locale
```

---

# 34. Mini Project

## Membuat JSON API sederhana dari file

Project ini menggabungkan:

```text
file_get_contents()
json_decode()
array_filter()
array_map()
json_encode()
DateTimeImmutable
```

Misalkan `users.json`:

```json
[
    {
        "name": "Budi",
        "active": true
    },
    {
        "name": "Andi",
        "active": false
    },
    {
        "name": "Citra",
        "active": true
    }
]
```

PHP:

```php
<?php

$data = file_get_contents(
    "users.json"
);

$users = json_decode(
    $data,
    true,
    512,
    JSON_THROW_ON_ERROR
);

$activeUsers =
    array_filter(
        $users,
        fn($user) =>
            $user["active"] === true
    );

$result =
    array_map(
        fn($user) => [
            "name" => $user["name"]
        ],
        $activeUsers
    );

$response = [
    "success" => true,
    "generated_at" =>
        new DateTimeImmutable(),
    "data" => array_values($result)
];

echo json_encode(
    $response,
    JSON_PRETTY_PRINT |
    JSON_THROW_ON_ERROR
);
```

Alurnya:

```text
users.json
    ↓
file_get_contents()
    ↓
json_decode()
    ↓
array_filter()
    ↓
array_map()
    ↓
DateTimeImmutable
    ↓
json_encode()
    ↓
JSON response
```

---

# 35. Tabel Ringkasan

| Materi | API | Fungsi |
|---|---|---|
| String | `strlen()` | Panjang string |
| String | `trim()` | Hapus whitespace |
| String | `substr()` | Ambil substring |
| String | `strpos()` | Cari posisi |
| String | `str_contains()` | Cek substring |
| String | `str_replace()` | Ganti string |
| String | `explode()` | String → array |
| String | `implode()` | Array → string |
| Array | `count()` | Jumlah item |
| Array | `in_array()` | Cek value |
| Array | `array_search()` | Cari key/index |
| Array | `array_merge()` | Gabung array |
| Array | `array_slice()` | Ambil sebagian |
| Array | `array_splice()` | Potong/ubah |
| Array | `array_map()` | Transform |
| Array | `array_filter()` | Filter |
| Array | `array_reduce()` | Reduce |
| Array | `sort()` | Sort value |
| Number | `is_numeric()` | Cek numerik |
| Number | `intval()` | Konversi integer |
| Number | `number_format()` | Format angka |
| Math | `round()` | Pembulatan |
| Math | `ceil()` | Ke atas |
| Math | `floor()` | Ke bawah |
| Math | `min()` | Nilai minimum |
| Math | `max()` | Nilai maksimum |
| Date | `date()` | Format tanggal |
| Date | `strtotime()` | String → timestamp |
| DateTime | `DateTime` | Object tanggal mutable |
| DateTime | `DateTimeImmutable` | Object tanggal immutable |
| DateTime | `DateInterval` | Interval |
| DateTime | `DatePeriod` | Periode |
| Timezone | `DateTimeZone` | Zona waktu |
| JSON | `json_encode()` | PHP → JSON |
| JSON | `json_decode()` | JSON → PHP |
| Regex | `preg_match()` | Cari pattern |
| Regex | `preg_replace()` | Ganti pattern |
| File | `file_get_contents()` | Baca file |
| File | `file_put_contents()` | Tulis file |
| File | `file_exists()` | Cek file |
| Directory | `mkdir()` | Buat directory |
| Directory | `scandir()` | Baca directory |
| Path | `basename()` | Nama file |
| Path | `dirname()` | Nama directory |
| Path | `pathinfo()` | Detail path |
| Filter | `filter_var()` | Validasi/filter |
| URL | `parse_url()` | Pecah URL |
| URL | `http_build_query()` | Buat query string |
| Variable | `isset()` | Cek ada & bukan null |
| Variable | `empty()` | Cek kosong |
| Variable | `unset()` | Hapus variable |
| Type | `is_*()` | Cek tipe |
| Encoding | `mb_strlen()` | Panjang Unicode |
| Hash | `hash()` | Hash data |
| Password | `password_hash()` | Hash password |
| Password | `password_verify()` | Verifikasi password |
| Random | `random_int()` | Random integer aman |
| Random | `random_bytes()` | Random bytes aman |
| Serialization | `serialize()` | PHP → serialized string |
| Iterator | `Iterator` | Custom iteration |
| Generator | `yield` | Lazy iteration |
| Exception | `try/catch` | Error handling |
| Reflection | `ReflectionClass` | Inspect class |
| Intl | `NumberFormatter` | Format angka/currency |

---

# 36. Cheat Code PHP Standard Library 10 Detik

> **String → `strlen`, `trim`, `substr`, `str_contains`, `str_replace`, `explode`, `implode`. Array → `count`, `in_array`, `array_map`, `array_filter`, `array_reduce`, `sort`. Date → `DateTimeImmutable`, `DateTimeZone`, `DateInterval`. JSON → `json_encode`, `json_decode`. File → `file_get_contents`, `file_put_contents`, `file_exists`. Regex → `preg_match`, `preg_replace`. Security → `password_hash`, `password_verify`, `random_int`, `random_bytes`.**

## String

```php
strlen($text);
trim($text);
substr($text, 0, 5);
str_contains($text, "PHP");
str_replace("A", "B", $text);
explode(",", $text);
implode(",", $array);
```

## Array

```php
count($array);

in_array(
    $value,
    $array,
    true
);

array_map(
    fn($x) => $x * 2,
    $array
);

array_filter(
    $array,
    fn($x) => $x > 10
);

array_reduce(
    $array,
    fn($carry, $x) => $carry + $x,
    0
);
```

## Date

```php
$date =
    new DateTimeImmutable();

$date->format(
    "Y-m-d H:i:s"
);
```

## JSON

```php
$json =
    json_encode($data);

$data =
    json_decode(
        $json,
        true,
        512,
        JSON_THROW_ON_ERROR
    );
```

## File

```php
$content =
    file_get_contents(
        "data.txt"
    );

file_put_contents(
    "data.txt",
    $content
);
```

## Regex

```php
preg_match(
    "/PHP/",
    $text
);

preg_replace(
    "/PHP/",
    "JavaScript",
    $text
);
```

## Password

```php
$hash =
    password_hash(
        $password,
        PASSWORD_DEFAULT
    );

password_verify(
    $password,
    $hash
);
```

## Random aman

```php
random_int(
    100000,
    999999
);

bin2hex(
    random_bytes(16)
);
```

---

# 37. Referensi Resmi

- PHP Manual — Function Reference  
  https://www.php.net/manual/en/funcref.php

- PHP Manual — String Functions  
  https://www.php.net/manual/en/ref.strings.php

- PHP Manual — Array Functions  
  https://www.php.net/manual/en/ref.array.php

- PHP Manual — Date and Time  
  https://www.php.net/manual/en/book.datetime.php

- PHP Manual — JSON  
  https://www.php.net/manual/en/book.json.php

- PHP Manual — PCRE / Regular Expressions  
  https://www.php.net/manual/en/book.pcre.php

- PHP Manual — Filesystem  
  https://www.php.net/manual/en/book.filesystem.php

- PHP Manual — Filter  
  https://www.php.net/manual/en/book.filter.php

- PHP Manual — Hash  
  https://www.php.net/manual/en/book.hash.php

- PHP Manual — Password Hashing  
  https://www.php.net/manual/en/book.password.php

- PHP Manual — Random  
  https://www.php.net/manual/en/book.random.php

- PHP Manual — DateTime  
  https://www.php.net/manual/en/class.datetimeimmutable.php

- PHP Manual — Iterator  
  https://www.php.net/manual/en/class.iterator.php

- PHP Manual — Generators  
  https://www.php.net/manual/en/language.generators.php

- PHP Manual — Exceptions  
  https://www.php.net/manual/en/language.exceptions.php

- PHP Manual — Reflection  
  https://www.php.net/manual/en/book.reflection.php

- PHP Manual — Intl  
  https://www.php.net/manual/en/book.intl.php

---

## Pola Belajar

Urutan belajar yang disarankan:

```text
String
  ↓
Array
  ↓
Array Callback
  ↓
Sorting
  ↓
Number + Math
  ↓
DateTime
  ↓
JSON
  ↓
Regex
  ↓
File + Filesystem
  ↓
Filter + URL
  ↓
Hash + Password
  ↓
Random
  ↓
Iterator
  ↓
Generator
  ↓
Exception
  ↓
Reflection
  ↓
Intl
```

### Prinsip penting

Jangan menghafalkan semua fungsi.

Lebih baik hafalkan **kelompok masalahnya**:

```text
Butuh memproses teks?
→ String Functions

Butuh mengolah data list?
→ Array Functions

Butuh tanggal?
→ DateTime

Butuh komunikasi API?
→ JSON

Butuh mencari pola?
→ PCRE / preg_*

Butuh file?
→ Filesystem

Butuh validasi?
→ filter_var()

Butuh password?
→ password_hash()

Butuh random untuk security?
→ random_int() / random_bytes()

Butuh data besar yang diproses bertahap?
→ Generator

Butuh inspect class?
→ Reflection
```

> **Kunci menguasai PHP Standard Library bukan menghafal seluruh API, tetapi mengetahui API mana yang harus dicari ketika menghadapi suatu masalah.**
