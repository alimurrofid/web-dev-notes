# PHP Standard Library Cheatsheet Revised

> **Target:** pemula yang sudah memahami dasar bahasa PHP (variabel,
> fungsi, array, control flow), lalu ingin mengenal standard library
> PHP untuk kebutuhan sehari-hari.
>
> Fokus cheatsheet ini: **string → array → number/math → date/time →
> JSON → regex → file → filter/URL → hash/password → random →
> iterasi (iterator/generator) → exception → reflection → intl**.
>
> **Batasan penting:** PHP memiliki sangat banyak extension dan fungsi
> bawaan. Cheatsheet ini tidak membahas semuanya — hanya yang paling
> sering dipakai saat belajar dan membuat aplikasi.

## Cara Belajar

```text
🟢 Fundamental
→ wajib untuk bekerja dengan teks, array, angka, dan tanggal

🟡 Lanjutan
→ pelajari setelah fundamental nyaman

🔴 Advanced / Reference
→ penting ketika kebutuhan aplikasi meningkat
```

Mental model:

```text
Masalah
  ↓
Kenali kelompok masalahnya
  ↓
Cari fungsi/class PHP yang sesuai
  ↓
Gunakan
```

Contoh:

```text
Butuh memproses teks?
  → String Functions

Butuh mengolah data list?
  → Array Functions

Butuh tanggal?
  → DateTime

Butuh pertukaran data API?
  → JSON
```

**Penting:** kunci menguasai PHP Standard Library bukan menghafal
seluruh API, tetapi mengetahui **API mana yang harus dicari** ketika
menghadapi suatu masalah.

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan PHP Standard Library](#bagian-1)
2. [String Dasar](#bagian-2)
3. [String Pencarian](#bagian-3)
4. [String Manipulasi](#bagian-4)
5. [Array Dasar](#bagian-5)
6. [Array Search](#bagian-6)
7. [Array Manipulation](#bagian-7)
8. [Array Callback](#bagian-8)
9. [Sorting](#bagian-9)
10. [Number](#bagian-10)
11. [Math](#bagian-11)
12. [Date dan Time](#bagian-12)

### 🟡 Lanjutan

13. [DateTime](#bagian-13)
14. [DateInterval dan DatePeriod](#bagian-14)
15. [Timezone](#bagian-15)
16. [JSON](#bagian-16)
17. [Regular Expression](#bagian-17)
18. [File dan Directory](#bagian-18)
19. [Filesystem](#bagian-19)
20. [Path](#bagian-20)
21. [Filter dan Validasi](#bagian-21)
22. [URL](#bagian-22)
23. [Variable, Constant, dan Type Checking](#bagian-23)
24. [String Encoding](#bagian-24)

### 🔴 Advanced / Reference

25. [Hash dan Password](#bagian-25)
26. [Random](#bagian-26)
27. [Serialization](#bagian-27)
28. [Iterator](#bagian-28)
29. [Closure](#bagian-29)
30. [Generator](#bagian-30)
31. [Exception dan Error](#bagian-31)
32. [Reflection](#bagian-32)
33. [Intl](#bagian-33)
34. [Mini Flow PHP Standard Library](#bagian-34)
35. [Tabel Ringkasan](#bagian-35)
36. [Cheat Code PHP Standard Library 10 Detik](#bagian-36)
37. [Urutan Belajar yang Disarankan](#bagian-37)
38. [Mini Project](#bagian-38)
39. [Referensi Resmi](#bagian-39)

------------------------------------------------------------------------

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan PHP Standard Library

## Konsep

**PHP Standard Library** adalah kumpulan fungsi, class, interface,
constant, dan utility yang tersedia bersama PHP atau melalui extension
resmi PHP.

Contoh:

```php
strlen("Hello");
count([1, 2, 3]);
json_encode(["name" => "Budi"]);
date("Y-m-d");
```

Beberapa API berasal dari **core PHP**, sedangkan sebagian lainnya
berasal dari extension yang umum tersedia seperti `json`, `mbstring`,
`intl`, dan lainnya.

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

## Kunci

> PHP Standard Library = alat siap pakai PHP. Tidak perlu membuat
> semuanya dari nol.

## Best Practice

- Kenali **kelompok masalah**, bukan menghafal semua fungsi satu per
  satu.
- Saat butuh sesuatu, cek dahulu apakah PHP sudah menyediakan fungsi
  bawaannya sebelum menulis implementasi sendiri.

------------------------------------------------------------------------

<a id="bagian-2"></a>

# 2. 🟢 String Dasar

## Konsep

PHP menyediakan banyak fungsi untuk memproses string. Mulai dari yang
paling sering dipakai: menghitung panjang, mengubah huruf besar/kecil,
membersihkan whitespace, dan mengambil bagian string.

## `strlen()`

Menghitung panjang string dalam **byte**.

```php
$name = "Budi";

echo strlen($name);
```

Output:

```text
4
```

> Untuk string multibyte seperti UTF-8, gunakan `mb_strlen()` jika
> extension `mbstring` tersedia.

## `strtolower()` dan `strtoupper()`

```php
echo strtolower("HELLO");
echo PHP_EOL;
echo strtoupper("hello");
```

Output:

```text
hello
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

## `ltrim()` dan `rtrim()`

```php
echo ltrim("  Hello");
echo PHP_EOL;
echo rtrim("Hello  ");
```

Output:

```text
Hello
Hello
```

## `substr()`

Mengambil bagian string berdasarkan posisi dan panjang.

```php
$text = "Hello World";

echo substr($text, 0, 5);
```

Output:

```text
Hello
```

## Cara Kerja

```text
input string
  ↓
fungsi string PHP
  ↓
hasil string baru
```

## Kunci

> `strlen` → panjang, `trim` → bersihkan, `substr` → ambil bagian.

## Kesalahan Umum

❌ Menggunakan `strlen()` untuk menghitung karakter pada teks Unicode —
hasilnya bisa lebih besar dari jumlah karakter sebenarnya.

✅ Gunakan `mb_strlen()` untuk teks multibyte.

------------------------------------------------------------------------

<a id="bagian-3"></a>

# 3. 🟢 String Pencarian

## Konsep

Fungsi pencarian string digunakan untuk menjawab pertanyaan: "apakah
teks mengandung X?", "dimana posisi X?", dan "apakah teks dimulai /
diakhiri dengan X?".

## `strpos()`

Mencari posisi (index) pertama dari substring.

```php
$text = "Hello World";

echo strpos($text, "World");
```

Output:

```text
6
```

Jika tidak ditemukan, hasilnya `false`:

```php
var_dump(strpos("Hello", "PHP"));
```

Output:

```text
bool(false)
```

**Penting:** karena index bisa bernilai `0`, gunakan perbandingan
strict `!==`:

```php
$text = "Hello";

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

PHP modern (8.0+):

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

Output:

```text
bool(true)
```

## `str_ends_with()`

```php
var_dump(
    str_ends_with("Hello World", "World")
);
```

Output:

```text
bool(true)
```

## Kunci

> `str_contains` → cek isi, `str_starts_with` → cek awal,
> `str_ends_with` → cek akhir. Ketiganya mengembalikan `bool`.
>
> `strpos` → cari posisi; hasil bisa `0`, jadi bandingkan dengan `!==
> false`.

## Best Practice

- Gunakan `str_contains()` / `str_starts_with()` / `str_ends_with()`
  jika hanya butuh jawaban ya/tidak — lebih mudah dibaca daripada
  `strpos()`.
- Gunakan `strpos()` hanya jika benar-benar membutuhkan posisi index.

------------------------------------------------------------------------

<a id="bagian-4"></a>

# 4. 🟢 String Manipulasi

## Konsep

Fungsi manipulasi string mengubah isi teks: mengganti, mengulang,
menambah padding, memecah, menggabungkan, dan memformat.

## `str_replace()`

Mengganti semua kemunculan substring.

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

Mengulang string.

```php
echo str_repeat("*", 5);
```

Output:

```text
*****
```

## `str_pad()`

Menambahkan karakter hingga mencapai panjang tertentu.

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

Memecah string menjadi array berdasarkan delimiter.

```php
$text = "apel,jeruk,mangga";

$fruits = explode(",", $text);

print_r($fruits);
```

Hasil:

```text
Array
(
    [0] => apel
    [1] => jeruk
    [2] => mangga
)
```

## `implode()`

Menggabungkan array menjadi string.

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

Format umum:

| Format | Arti |
|---|---|
| `%s` | string |
| `%d` | integer |
| `%f` | float |
| `%.2f` | float 2 angka desimal |

## Cara Kerja

```text
string / array
  ↓
fungsi manipulasi
  ↓
hasil baru
```

## Kunci

> `str_replace` → ganti, `explode` → string → array, `implode` →
> array → string, `sprintf` → format string.

## Kesalahan Umum

❌ Membangun query atau perintah dengan menggabungkan string dari input
user tanpa escaping — berisiko injection.

✅ Gunakan parameter binding di query, atau `htmlspecialchars()` untuk
output HTML.

------------------------------------------------------------------------

<a id="bagian-5"></a>

# 5. 🟢 Array Dasar

## Konsep

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

Menghitung jumlah item.

```php
echo count($names);
```

Output:

```text
3
```

## `array_values()`

Mengambil semua value dan mereset key menjadi index numerik.

```php
$data = [
    "name" => "Budi",
    "age" => 20
];

print_r(
    array_values($data)
);
```

Hasil:

```text
Array
(
    [0] => Budi
    [1] => 20
)
```

## `array_keys()`

Mengambil semua key.

```php
print_r(
    array_keys($data)
);
```

Hasil:

```text
Array
(
    [0] => name
    [1] => age
)
```

## `array_key_exists()`

Mengecek apakah sebuah key ada.

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

## Kunci

> `count` → jumlah, `array_keys` → kumpulan key, `array_values` →
> kumpulan value, `array_key_exists` → cek key.

## Kesalahan Umum

❌ Menggunakan `isset($array[$key])` untuk mengecek keberadaan key —
hasil `false` jika nilainya `null`.

✅ Gunakan `array_key_exists($key, $array)` jika keberadaan key yang
ingin dicek, bukan nilainya.

------------------------------------------------------------------------

<a id="bagian-6"></a>

# 6. 🟢 Array Search

## Konsep

Fungsi pencarian array digunakan untuk mencari nilai di dalam array.

## `in_array()`

Mengecek apakah sebuah value ada di array.

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

Gunakan strict mode (`true`) jika tipe data juga harus sama:

```php
var_dump(
    in_array(10, ["10"], true)
);
```

Output:

```text
bool(false)
```

## `array_search()`

Mengembalikan key/index dari value yang dicari.

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

Jika tidak ditemukan, hasilnya `false`. Bandingkan dengan `!==`:

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

## Kunci

> `in_array` → cek ada atau tidak (`bool`).
>
> `array_search` → cari key/index dari value.

## Best Practice

- Selalu gunakan argumen ketiga `true` (strict) pada `in_array()` dan
  `array_search()` untuk menghindari perbandingan longgar antar tipe.

------------------------------------------------------------------------

<a id="bagian-7"></a>

# 7. 🟢 Array Manipulation

## Konsep

Fungsi manipulasi array mengubah susunan array: menambah, menghapus,
menggabungkan, memotong, dan mengubah urutan.

## `array_push()` dan `$array[]`

Menambahkan item di akhir array.

```php
$names = ["Budi"];

array_push($names, "Andi", "Citra");

print_r($names);
```

Lebih sederhana untuk satu item:

```php
$names[] = "Andi";
```

## `array_pop()`

Menghapus dan mengembalikan item terakhir.

```php
$names = ["Budi", "Andi"];

$last = array_pop($names);

echo $last;
```

Output:

```text
Andi
```

## `array_shift()`

Menghapus dan mengembalikan item pertama.

```php
$first = array_shift($names);
```

## `array_unshift()`

Menambahkan item di awal array.

```php
array_unshift($names, "Citra");
```

## `array_merge()`

Menggabungkan array.

```php
$a = [1, 2];
$b = [3, 4];

$result = array_merge($a, $b);

print_r($result);
```

Hasil:

```text
Array
(
    [0] => 1
    [1] => 2
    [2] => 3
    [3] => 4
)
```

Untuk associative array, key string dengan nama sama dapat ditimpa
oleh array berikutnya.

## Spread operator

Cara modern menggabungkan array:

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
$data = ["A", "B", "C", "D"];

print_r(
    array_slice($data, 1, 2)
);
```

Hasil:

```text
Array
(
    [0] => B
    [1] => C
)
```

## `array_splice()`

Menghapus atau mengganti bagian array (mengubah array asli).

```php
$data = ["A", "B", "C"];

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
Array
(
    [0] => A
    [1] => X
    [2] => C
)
```

## `array_unique()`

Menghilangkan nilai duplikat.

```php
$data = ["A", "B", "A"];

print_r(
    array_unique($data)
);
```

Hasil:

```text
Array
(
    [0] => A
    [1] => B
)
```

## `array_reverse()`

Membalik urutan array.

```php
$data = [1, 2, 3];

print_r(
    array_reverse($data)
);
```

Hasil:

```text
Array
(
    [0] => 3
    [1] => 2
    [2] => 1
)
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

Hasil:

```text
Array
(
    [Budi] => name
    [20] => age
)
```

## Kunci

> `push` → tambah belakang, `pop` → hapus belakang, `shift` → hapus
> depan, `unshift` → tambah depan.
>
> `merge` → gabung, `slice` → ambil sebagian (tanpa mengubah asli),
> `splice` → potong/ubah (mengubah asli), `unique` → hilangkan
> duplikat, `reverse` → balik urutan.

## Kesalahan Umum

❌ Mengira `array_slice()` mengubah array asli.

✅ `array_slice()` mengembalikan array baru; gunakan `array_splice()`
jika ingin mengubah array asli.

------------------------------------------------------------------------

<a id="bagian-8"></a>

# 8. 🟢 Array Callback

## Konsep

Banyak fungsi array menerima callback untuk mengubah, menyaring, atau
menggabungkan item.

## `array_map()`

Mengubah setiap item dan mengembalikan array baru.

```php
$numbers = [1, 2, 3];

$result = array_map(
    fn($number) => $number * 2,
    $numbers
);

print_r($result);
```

Hasil:

```text
Array
(
    [0] => 2
    [1] => 4
    [2] => 6
)
```

## `array_filter()`

Menyaring item berdasarkan kondisi.

```php
$numbers = [1, 2, 3, 4];

$result = array_filter(
    $numbers,
    fn($number) => $number % 2 === 0
);

print_r($result);
```

Hasil:

```text
Array
(
    [1] => 2
    [3] => 4
)
```

> `array_filter()` mempertahankan key. Jika membutuhkan index
> berurutan kembali, gunakan `array_values()`:

```php
$result = array_values($result);
```

## `array_reduce()`

Menggabungkan seluruh item menjadi satu nilai.

```php
$numbers = [1, 2, 3, 4];

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

Menjalankan callback untuk setiap item (untuk efek samping).

```php
$names = ["Budi", "Andi"];

array_walk(
    $names,
    function ($name) {
        echo $name . PHP_EOL;
    }
);
```

Output:

```text
Budi
Andi
```

## Cara Kerja

```text
array
  ↓
fungsi array + callback
  ↓
hasil baru / efek samping
```

## Kunci

> `map` → ubah semua, `filter` → pilih sebagian, `reduce` → banyak →
> satu, `walk` → jalankan aksi pada setiap item.

## Best Practice

- `array_map()` dan `array_filter()` mengembalikan array baru — data
  asli tidak berubah.
- Gunakan arrow function `fn()` untuk callback sederhana agar lebih
  ringkas.

------------------------------------------------------------------------

<a id="bagian-9"></a>

# 9. 🟢 Sorting

## Konsep

PHP menyediakan berbagai fungsi sortir yang dibedakan oleh: diurutkan
berdasarkan value atau key, arah ascending/descending, dan apakah key
dipertahankan.

## `sort()`

Sort ascending berdasarkan value dan mereset key.

```php
$data = [3, 1, 2];

sort($data);

print_r($data);
```

Hasil:

```text
Array
(
    [0] => 1
    [1] => 2
    [2] => 3
)
```

## `rsort()`

Descending berdasarkan value, mereset key.

```php
rsort($data);
```

## `asort()`

Sort value ascending dan mempertahankan key.

```php
$data = [
    "a" => 30,
    "b" => 10,
    "c" => 20
];

asort($data);

print_r($data);
```

Hasil:

```text
Array
(
    [b] => 10
    [c] => 20
    [a] => 30
)
```

## `arsort()`

Descending berdasarkan value, mempertahankan key.

```php
arsort($data);
```

## `ksort()`

Sort ascending berdasarkan key.

```php
ksort($data);
```

## `krsort()`

Descending berdasarkan key.

```php
krsort($data);
```

## `usort()`

Sortir dengan logika custom.

```php
$numbers = [3, 1, 2];

usort(
    $numbers,
    fn($a, $b) => $a <=> $b
);
```

## Kunci

```text
sort   → value ASC, reset key
rsort  → value DESC, reset key

asort  → value ASC, keep key
arsort → value DESC, keep key

ksort  → key ASC
krsort → key DESC

usort  → custom
```

## Kesalahan Umum

❌ Menggunakan `sort()` pada associative array — key string akan
hilang.

✅ Gunakan `asort()` / `arsort()` jika ingin mempertahankan key.

------------------------------------------------------------------------

<a id="bagian-10"></a>

# 10. 🟢 Number

## Konsep

Fungsi number digunakan untuk mengecek tipe numerik dan mengonversi
nilai.

## `is_int()`

```php
var_dump(is_int(10));
```

Output:

```text
bool(true)
```

## `is_float()`

```php
var_dump(is_float(10.5));
```

Output:

```text
bool(true)
```

## `is_numeric()`

Mengecek apakah nilai merupakan angka atau string numerik.

```php
var_dump(is_numeric("100"));
```

Output:

```text
bool(true)
```

## `intval()`

Mengonversi nilai menjadi integer.

```php
echo intval("100");
```

Output:

```text
100
```

## `floatval()`

Mengonversi nilai menjadi float.

```php
echo floatval("10.5");
```

Output:

```text
10.5
```

## `number_format()`

Memformat angka dengan pemisah ribuan dan desimal.

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

## Kunci

> `is_int` → cek integer, `is_float` → cek float, `is_numeric` → cek
> numerik.
>
> `intval` → jadi integer, `floatval` → jadi float, `number_format` →
> format angka.

## Kesalahan Umum

❌ Menggunakan `is_int("100")` untuk mengecek input form — hasilnya
`false` karena input form berupa string.

✅ Gunakan `is_numeric()` atau filter validasi untuk mengecek input
berupa angka.

------------------------------------------------------------------------

<a id="bagian-11"></a>

# 11. 🟢 Math

## Konsep

Fungsi math PHP mencakup pembulatan, nilai absolut, perhitungan
minimum/maksimum, pangkat, akar, dan random integer.

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

Pembulatan ke nilai terdekat.

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

## `min()` dan `max()`

```php
echo min(10, 5, 20);
echo PHP_EOL;
echo max(10, 5, 20);
```

Output:

```text
5
20
```

## `pow()`

Pangkat.

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

Akar kuadrat.

```php
echo sqrt(16);
```

Output:

```text
4
```

## `random_int()`

Integer acak yang aman secara kriptografis.

```php
$number = random_int(1, 100);

echo $number;
```

## Kunci

> `abs` → absolut, `round` → bulatkan terdekat, `ceil` → ke atas,
> `floor` → ke bawah.
>
> `min` → terkecil, `max` → terbesar, `pow`/`**` → pangkat, `sqrt` →
> akar, `random_int` → random aman.

## Kesalahan Umum

❌ Menggunakan `rand()` / `mt_rand()` untuk kebutuhan keamanan (token,
OTP, password reset).

✅ Gunakan `random_int()` yang aman secara kriptografis.

------------------------------------------------------------------------

<a id="bagian-12"></a>

# 12. 🟢 Date dan Time

## Konsep

Fungsi tanggal PHP bekerja dengan Unix timestamp (detik sejak
1970-01-01). Untuk kebutuhan sederhana, fungsi `time()`, `date()`, dan
`strtotime()` sudah cukup.

## `time()`

Timestamp Unix saat ini.

```php
echo time();
```

Contoh output:

```text
1787616000
```

## `date()`

Memformat timestamp menjadi string tanggal.

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

Contoh lengkap:

```php
echo date("Y-m-d H:i:s");
```

## `strtotime()`

Mengubah string waktu menjadi Unix timestamp.

```php
$timestamp = strtotime("tomorrow");

echo date("Y-m-d", $timestamp);
```

## `date_default_timezone_set()`

Mengatur timezone default untuk fungsi tanggal.

```php
date_default_timezone_set("Asia/Jakarta");

echo date("Y-m-d H:i:s");
```

## Kunci

> `time` → timestamp sekarang, `date` → format timestamp, `strtotime`
> → string → timestamp.

## Best Practice

- Untuk logika tanggal yang kompleks, gunakan class `DateTimeImmutable`
  dan `DateTimeZone` daripada fungsi global (lihat section 13–15).

------------------------------------------------------------------------

<a id="bagian-13"></a>

# 13. 🟡 DateTime

## Konsep

`DateTime` adalah object untuk bekerja dengan tanggal dan waktu. Berbeda
dengan fungsi `date()`, object ini bisa dioperasikan (tambah hari,
ubah timezone, bandingkan).

## Membuat DateTime

```php
$date = new DateTime();

echo $date->format("Y-m-d H:i:s");
```

## Tanggal tertentu

```php
$date = new DateTime("2026-01-01");

echo $date->format("Y-m-d");
```

Output:

```text
2026-01-01
```

## `modify()`

Mengubah tanggal dengan relative format.

```php
$date = new DateTime("2026-01-01");

$date->modify("+7 days");

echo $date->format("Y-m-d");
```

Output:

```text
2026-01-08
```

## `DateTimeImmutable`

Versi immutable: setiap modifikasi mengembalikan object baru, object
asli tidak berubah.

```php
$date = new DateTimeImmutable("2026-01-01");

$newDate = $date->modify("+7 days");

echo $date->format("Y-m-d");
echo PHP_EOL;
echo $newDate->format("Y-m-d");
```

Output:

```text
2026-01-01
2026-01-08
```

## Kunci

> `DateTime` → tanggal mutable (bisa diubah).
>
> `DateTimeImmutable` → tanggal immutable (modifikasi menghasilkan
> object baru).

## Best Practice

- Gunakan `DateTimeImmutable` secara default — lebih aman dari bug
  "tanggal berubah tanpa disengaja".

------------------------------------------------------------------------

<a id="bagian-14"></a>

# 14. 🟡 DateInterval dan DatePeriod

## Konsep

`DateInterval` merepresentasikan jarak waktu (misal 7 hari, 1 bulan).
`DatePeriod` merepresentasikan kumpulan tanggal dalam satu periode.

## `DateInterval`

```php
$interval = new DateInterval("P7D");

$date = new DateTimeImmutable("2026-01-01");

$result = $date->add($interval);

echo $result->format("Y-m-d");
```

Output:

```text
2026-01-08
```

Format interval:

| Format | Arti |
|---|---|
| `P1D` | 1 hari |
| `P1W` | 1 minggu |
| `P1M` | 1 bulan |
| `P1Y` | 1 tahun |
| `PT1H` | 1 jam |

## `DatePeriod`

Untuk membuat rentang tanggal.

```php
$start = new DateTimeImmutable("2026-01-01");
$interval = new DateInterval("P1D");
$end = new DateTimeImmutable("2026-01-04");

$period = new DatePeriod($start, $interval, $end);

foreach ($period as $date) {
    echo $date->format("Y-m-d");
    echo PHP_EOL;
}
```

Output:

```text
2026-01-01
2026-01-02
2026-01-03
```

## Kunci

> `DateInterval` → jarak/perubahan waktu.
>
> `DatePeriod` → kumpulan waktu dalam periode.

------------------------------------------------------------------------

<a id="bagian-15"></a>

# 15. 🟡 Timezone

## Konsep

Timezone menentukan zona waktu sebuah tanggal. PHP menyediakan class
`DateTimeZone` dan method `setTimezone()` untuk konversi.

## `DateTimeZone`

```php
$timezone = new DateTimeZone("Asia/Jakarta");

$date = new DateTimeImmutable("now", $timezone);

echo $date->format("Y-m-d H:i:s");
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

Mengonversi tampilan waktu ke timezone lain. Nilai momentnya sama,
tampilannya berbeda.

```php
$date = new DateTimeImmutable(
    "2026-01-01 12:00:00",
    new DateTimeZone("UTC")
);

$jakarta = $date->setTimezone(
    new DateTimeZone("Asia/Jakarta")
);

echo $jakarta->format("Y-m-d H:i:s");
```

Output:

```text
2026-01-01 19:00:00
```

## Cara Kerja

```text
tanggal di timezone A
  ↓
setTimezone(timezone B)
  ↓
tampilan waktu di timezone B
```

## Kunci

> `DateTimeZone` → timezone, `setTimezone()` → konversi tampilan
> timezone.

## Kesalahan Umum

❌ Menyimpan tanggal dalam format string lokal tanpa timezone — sulit
dikonversi dan dibandingkan.

✅ Simpan dalam UTC, lalu konversi ke timezone lokal saat ditampilkan.

------------------------------------------------------------------------

<a id="bagian-16"></a>

# 16. 🟡 JSON

## Konsep

JSON adalah format pertukaran data yang sering digunakan untuk API.
PHP menyediakan `json_encode()` dan `json_decode()`.

## `json_encode()`

PHP → JSON.

```php
$data = [
    "name" => "Budi",
    "age" => 20
];

$json = json_encode($data);

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

Output:

```json
{
    "name": "Budi",
    "age": 20
}
```

## `json_decode()`

JSON → PHP.

```php
$json = '{"name":"Budi","age":20}';

$data = json_decode($json, true);

print_r($data);
```

Hasil:

```text
Array
(
    [name] => Budi
    [age] => 20
)
```

Jika argumen kedua `true`, hasil object JSON menjadi associative array.

Tanpa `true`, hasilnya object:

```php
$data = json_decode($json);

echo $data->name;
```

Output:

```text
Budi
```

## Error JSON

```php
$json = "{invalid}";

$data = json_decode($json);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_last_error_msg();
}
```

## `JSON_THROW_ON_ERROR`

Untuk aplikasi modern, lebih nyaman melempar exception:

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

## Kunci

> `json_encode` → PHP → JSON, `json_decode` → JSON → PHP.
>
> `JSON_PRETTY_PRINT` → JSON rapi, `JSON_THROW_ON_ERROR` → lempar
> exception jika error.

## Best Practice

- Gunakan `JSON_THROW_ON_ERROR` agar error JSON ditangani lewat
  `try/catch`, bukan dicek manual dengan `json_last_error()`.

------------------------------------------------------------------------

<a id="bagian-17"></a>

# 17. 🟡 Regular Expression

## Konsep

Regex (PCRE) digunakan untuk mencari atau memvalidasi pola teks. Fungsi
utama: `preg_match()`, `preg_match_all()`, `preg_replace()`, dan
`preg_split()`.

## `preg_match()`

Mencari pola pertama.

```php
$text = "Belajar PHP";

if (preg_match("/PHP/", $text)) {
    echo "Ketemu";
}
```

## Mencari angka

```php
$text = "Umur saya 20 tahun";

preg_match("/\d+/", $text, $matches);

print_r($matches);
```

Hasil:

```text
Array
(
    [0] => 20
)
```

## `preg_match_all()`

Mencari semua kemunculan pola.

```php
$text = "PHP 8, PHP 9";

preg_match_all("/PHP/", $text, $matches);

print_r($matches[0]);
```

Hasil:

```text
Array
(
    [0] => PHP
    [1] => PHP
)
```

## `preg_replace()`

Mencari dan mengganti berdasarkan pola.

```php
$text = "Hello 123";

$result = preg_replace(
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

Memecah string berdasarkan pola.

```php
$text = "apel,jeruk,mangga";

$result = preg_split("/,/", $text);

print_r($result);
```

Hasil:

```text
Array
(
    [0] => apel
    [1] => jeruk
    [2] => mangga
)
```

## Kunci

> `preg_match` → cari satu pola, `preg_match_all` → cari semua,
> `preg_replace` → cari + ganti, `preg_split` → pecah berdasarkan
> regex.

## Best Practice

- Untuk pencarian teks biasa tanpa pola, gunakan `str_contains()` /
  `str_replace()` — lebih cepat dan mudah dibaca daripada regex.

------------------------------------------------------------------------

<a id="bagian-18"></a>

# 18. 🟡 File dan Directory

## Konsep

PHP menyediakan fungsi untuk membaca, menulis, mengecek, dan mengelola
file serta directory.

## `file_get_contents()`

Membaca seluruh file menjadi string.

```php
$content = file_get_contents("data.txt");

echo $content;
```

## `file_put_contents()`

Menulis string ke file.

```php
file_put_contents("data.txt", "Hello PHP");
```

## Append

Menambahkan ke akhir file.

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

## `is_file()` dan `is_dir()`

```php
var_dump(is_file("data.txt"));
var_dump(is_dir("data"));
```

Output:

```text
bool(true)
bool(true)
```

## `mkdir()`

Membuat directory.

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

## `rmdir()` dan `unlink()`

Menghapus directory kosong dan file.

```php
rmdir("data");

unlink("data.txt");
```

## Kunci

> `file_get_contents` → baca file, `file_put_contents` → tulis file,
> `file_exists` → cek ada.
>
> `mkdir` → buat directory, `rmdir` → hapus directory kosong, `unlink`
> → hapus file.

## Kesalahan Umum

❌ Menulis langsung ke path dari input user tanpa validasi — berisiko
path traversal.

✅ Validasi path dan pastikan berada di dalam directory yang diizinkan.

------------------------------------------------------------------------

<a id="bagian-19"></a>

# 19. 🟡 Filesystem

## Konsep

Fungsi filesystem melengkapi operasi file: ukuran, waktu modifikasi,
menyalin, mengganti nama, dan melihat isi directory.

## `filesize()`

```php
echo filesize("data.txt");
```

## `filemtime()`

Waktu terakhir file diubah.

```php
$time = filemtime("data.txt");

echo date("Y-m-d H:i:s", $time);
```

## `copy()`

Menyalin file.

```php
copy("data.txt", "backup.txt");
```

## `rename()`

Mengganti nama atau memindahkan file.

```php
rename("backup.txt", "data-backup.txt");
```

## `scandir()`

Melihat isi directory.

```php
$files = scandir(".");

print_r($files);
```

Hasil kira-kira:

```text
Array
(
    [0] => .
    [1] => ..
    [2] => data.txt
)
```

## `glob()`

Mencari file berdasarkan pattern.

```php
$files = glob("*.php");

print_r($files);
```

## Kunci

> `filesize` → ukuran, `filemtime` → waktu modifikasi, `copy` → salin,
> `rename` → pindah/ganti nama.
>
> `scandir` → isi directory, `glob` → cari berdasarkan pattern.

------------------------------------------------------------------------

<a id="bagian-20"></a>

# 20. 🟡 Path

## Konsep

Fungsi path membantu mengolah path file: mengambil nama file, folder,
extension, dan menyelesaikan path relatif.

## `basename()`

Mengambil nama file dari path.

```php
$path = "/var/www/index.php";

echo basename($path);
```

Output:

```text
index.php
```

## `dirname()`

Mengambil directory dari path.

```php
echo dirname($path);
```

Output:

```text
/var/www
```

## `pathinfo()`

Mengambil informasi lengkap path.

```php
print_r(
    pathinfo("/var/www/index.php")
);
```

Hasil:

```text
Array
(
    [dirname] => /var/www
    [basename] => index.php
    [extension] => php
    [filename] => index
)
```

## `realpath()`

Menyelesaikan path menjadi path absolut.

```php
echo realpath("data.txt");
```

Jika path dapat diselesaikan, hasilnya berupa path absolut.

## Kunci

> `basename` → nama file, `dirname` → folder, `pathinfo` → detail
> path, `realpath` → path absolut yang terselesaikan.

------------------------------------------------------------------------

<a id="bagian-21"></a>

# 21. 🟡 Filter dan Validasi

## Konsep

Extension `filter` menyediakan validasi dan sanitasi data, terutama
untuk input dari luar aplikasi.

## `filter_var()`

Validasi email:

```php
$email = "budi@example.com";

if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Email valid";
}
```

Validasi URL:

```php
$url = "https://example.com";

var_dump(
    filter_var($url, FILTER_VALIDATE_URL)
);
```

Output:

```text
string(19) "https://example.com"
```

Validasi integer:

```php
$value = "100";

$result = filter_var($value, FILTER_VALIDATE_INT);

var_dump($result);
```

Output:

```text
int(100)
```

## Sanitasi

PHP memiliki filter sanitasi, tetapi untuk aplikasi modern jangan
menganggap `FILTER_SANITIZE_*` sebagai solusi universal untuk keamanan
output.

Untuk output HTML, gunakan escaping sesuai context:

```php
echo htmlspecialchars(
    $userInput,
    ENT_QUOTES,
    "UTF-8"
);
```

## Kunci

> `filter_var()` → validasi / filter, `htmlspecialchars()` → escape
> teks untuk HTML.

## Kesalahan Umum

❌ Menggunakan `FILTER_SANITIZE_*` sebagai pengganti escaping output.

✅ Escape di titik output (misal `htmlspecialchars()` untuk HTML),
bukan di titik input.

------------------------------------------------------------------------

<a id="bagian-22"></a>

# 22. 🟡 URL

## Konsep

Fungsi URL digunakan untuk memecah URL, membangun query string, dan
melakukan encoding komponen URL.

## `parse_url()`

Memecah URL menjadi bagian-bagiannya.

```php
$url = "https://example.com:8080/path?id=10";

print_r(parse_url($url));
```

Hasil:

```text
Array
(
    [scheme] => https
    [host] => example.com
    [port] => 8080
    [path] => /path
    [query] => id=10
)
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

Output:

```text
name=Budi&age=20
```

## `urlencode()` dan `rawurlencode()`

Encoding komponen string URL.

```php
echo urlencode("hello world");
echo PHP_EOL;
echo rawurlencode("hello world");
```

Output:

```text
hello+world
hello%20world
```

Untuk membangun query string, `http_build_query()` biasanya lebih
praktis.

## Kunci

> `parse_url` → URL → array informasi, `http_build_query` → array →
> query string, `urlencode`/`rawurlencode` → encode komponen string
> URL.

------------------------------------------------------------------------

<a id="bagian-23"></a>

# 23. 🟡 Variable, Constant, dan Type Checking

## Konsep

PHP menyediakan fungsi untuk memeriksa variabel, mendefinisikan
constant, dan mengecek tipe data.

## `isset()` dan `empty()`

```php
$name = "Budi";
$value = "";

var_dump(isset($name));
var_dump(empty($value));
```

Output:

```text
bool(true)
bool(true)
```

## `unset()`

Menghapus variabel.

```php
$name = "Budi";

unset($name);

var_dump(isset($name));
```

Output:

```text
bool(false)
```

## `gettype()`

Mengambil nama tipe variabel.

```php
$value = 100;

echo gettype($value);
```

Output:

```text
integer
```

## Constant

```php
define("APP_NAME", "Belajar PHP");

echo APP_NAME;
```

Mengambil constant berdasarkan nama string:

```php
$name = "APP_NAME";

echo constant($name);
```

Mengecek keberadaan constant:

```php
var_dump(defined("APP_NAME"));
```

Dalam PHP modern, constant juga sering dibuat dengan:

```php
const APP_VERSION = "1.0.0";
```

## Type Checking

Fungsi `is_*()`:

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

```php
var_dump(is_scalar("PHP"));
```

Output:

```text
bool(true)
```

## `is_iterable()`

Mengecek apakah nilai bisa digunakan dalam `foreach`.

```php
$data = [1, 2, 3];

var_dump(is_iterable($data));
```

Output:

```text
bool(true)
```

## Kunci

> `isset` → ada dan bukan null, `empty` → dianggap kosong, `unset` →
> hapus variabel, `gettype` → tipe variabel.
>
> `define`/`const` → buat constant, `defined` → cek constant,
> `constant` → ambil constant berdasarkan nama.
>
> `is_*()` → cek tipe, `is_scalar()` → scalar, `is_iterable()` → bisa
> di-foreach.

## Kesalahan Umum

❌ Menggunakan `gettype()` untuk percabangan — hasilnya string, mudah
salah ketik.

✅ Gunakan `is_*()` yang mengembalikan `bool`.

------------------------------------------------------------------------

<a id="bagian-24"></a>

# 24. 🟡 String Encoding

## Konsep

Untuk teks multibyte/Unicode, extension `mbstring` menyediakan fungsi
`mb_*()` yang bekerja per karakter, bukan per byte.

## `mb_strlen()`

```php
$text = "Indonesia";

echo mb_strlen($text, "UTF-8");
```

Output:

```text
9
```

## `mb_strtolower()` dan `mb_strtoupper()`

```php
echo mb_strtolower("HELLO", "UTF-8");
echo PHP_EOL;
echo mb_strtoupper("hello", "UTF-8");
```

Output:

```text
hello
HELLO
```

## `mb_substr()`

```php
$text = "Belajar PHP";

echo mb_substr($text, 0, 7, "UTF-8");
```

Output:

```text
Belajar
```

## Kunci

> `strlen` → byte, `mb_strlen` → karakter multibyte.
>
> `substr` → substring berbasis byte, `mb_substr` → substring
> multibyte.

## Best Practice

- Untuk aplikasi yang banyak menggunakan Unicode, biasakan menggunakan
  `mb_*()` jika operasi string memang membutuhkan dukungan multibyte.

------------------------------------------------------------------------

<a id="bagian-25"></a>

# 25. 🔴 Hash dan Password

## Konsep

Hash digunakan untuk menghasilkan nilai hash dari data, dan PHP
menyediakan API khusus untuk password hashing.

## `hash()`

```php
$result = hash("sha256", "Hello");

echo $result;
```

Output (contoh):

```text
185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969
```

Algoritma populer:

```text
sha256
sha512
md5
sha1
```

> Untuk keamanan modern, jangan menggunakan MD5/SHA-1 sebagai password
> hashing.

## Password hashing

Untuk password gunakan API khusus:

```php
$password = "rahasia";

$hash = password_hash($password, PASSWORD_DEFAULT);

echo $hash;
```

Verifikasi:

```php
if (password_verify("rahasia", $hash)) {
    echo "Password benar";
}
```

Mengecek apakah hash perlu diperbarui:

```php
if (password_needs_rehash($hash, PASSWORD_DEFAULT)) {
    // Buat hash baru
}
```

## Cara Kerja

```text
password
  ↓
password_hash()
  ↓
hash (jangan disimpan plaintext)
  ↓
password_verify()
  ↓
bool
```

## Kunci

> `hash()` → hash umum, `password_hash()` → password,
> `password_verify()` → verifikasi password.

## Kesalahan Umum

❌ Menyimpan password plaintext atau dengan MD5/SHA-1.

✅ Gunakan `password_hash()` + `password_verify()`.

------------------------------------------------------------------------

<a id="bagian-26"></a>

# 26. 🔴 Random

## Konsep

PHP menyediakan fungsi random yang aman secara kriptografis:
`random_int()` dan `random_bytes()`.

## `random_int()`

```php
echo random_int(1, 100);
```

## `random_bytes()`

```php
$bytes = random_bytes(16);

echo bin2hex($bytes);
```

## `bin2hex()` dan `hex2bin()`

```php
echo bin2hex(random_bytes(8));
```

```php
$hex = "48656c6c6f";

echo hex2bin($hex);
```

Output:

```text
Hello
```

## Kunci

> `random_int` → random integer aman, `random_bytes` → random bytes
> aman.
>
> `bin2hex` → binary → hex, `hex2bin` → hex → binary.

## Kesalahan Umum

❌ Menggunakan `rand()` / `mt_rand()` untuk token, password reset,
session secret, atau kebutuhan keamanan.

✅ Gunakan `random_int()` / `random_bytes()`.

------------------------------------------------------------------------

<a id="bagian-27"></a>

# 27. 🔴 Serialization

## Konsep

Serialization mengubah data PHP menjadi representasi string, dan
`unserialize()` mengembalikannya menjadi data PHP.

## `serialize()` dan `unserialize()`

```php
$data = [
    "name" => "Budi",
    "age" => 20
];

$result = serialize($data);

echo $result;
```

Output (contoh):

```text
a:2:{s:4:"name";s:4:"Budi";s:3:"age";i:20;}
```

```php
$data = unserialize($result);

print_r($data);
```

Hasil:

```text
Array
(
    [name] => Budi
    [age] => 20
)
```

## Keamanan

Jangan sembarangan melakukan:

```php
unserialize($untrustedInput);
```

terhadap data yang berasal dari user atau sumber tidak dipercaya.

Jika hanya membutuhkan format pertukaran data, JSON biasanya lebih aman
dan interoperable:

```php
json_encode($data);
json_decode($json, true);
```

## Kunci

> `serialize` → PHP data → string PHP, `unserialize` → string PHP →
> PHP data.
>
> Untrusted input → jangan langsung `unserialize`.

## Kesalahan Umum

❌ Menggunakan `serialize()` untuk menyimpan data yang akan dibaca oleh
sistem lain.

✅ Gunakan JSON untuk pertukaran data antar sistem.

------------------------------------------------------------------------

<a id="bagian-28"></a>

# 28. 🔴 Iterator

## Konsep

PHP memiliki konsep `Traversable`, `Iterator`, dan banyak object yang
dapat digunakan dengan `foreach`.

Contoh dasar:

```php
$data = ["Budi", "Andi"];

foreach ($data as $name) {
    echo $name;
}
```

## Interface `Iterator`

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

## Contoh sederhana

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

Output:

```text
Budi
Andi
Citra
```

## Kunci

> `Iterator` → object yang bisa dikontrol cara iterasinya.

## Best Practice

- Untuk kebutuhan umum, gunakan array atau `Generator`. Buat custom
  `Iterator` hanya jika kontrol iterasi yang detail benar-benar
  dibutuhkan.

------------------------------------------------------------------------

<a id="bagian-29"></a>

# 29. 🔴 Closure

## Konsep

Closure adalah function yang dapat disimpan sebagai value dan dipakai
sebagai callback.

```php
$greet = function (string $name): string {
    return "Hello $name";
};

echo $greet("Budi");
```

Output:

```text
Hello Budi
```

## Arrow function

```php
$double = fn($number) => $number * 2;

echo $double(10);
```

Output:

```text
20
```

## Closure bersama array

```php
$numbers = [1, 2, 3];

$result = array_map(
    fn($number) => $number * 2,
    $numbers
);
```

## `use`

Closure dapat menangkap variabel dari scope luar:

```php
$tax = 0.11;

$calculate = function ($price) use ($tax) {
    return $price + ($price * $tax);
};

echo $calculate(100);
```

Output:

```text
111
```

## Kunci

> Closure → function sebagai value, sering dipakai callback.
>
> Arrow function `fn()` → ringkas, otomatis menangkap variabel dari
> scope luar (by value).

------------------------------------------------------------------------

<a id="bagian-30"></a>

# 30. 🔴 Generator

## Konsep

Generator menggunakan `yield` untuk menghasilkan value satu per satu
tanpa membangun seluruh array di memory sekaligus.

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

Output:

```text
123
```

## Contoh dengan loop

```php
function rangeGenerator(
    int $start,
    int $end
): Generator {
    for ($i = $start; $i <= $end; $i++) {
        yield $i;
    }
}

foreach (rangeGenerator(1, 3) as $number) {
    echo $number;
}
```

Output:

```text
123
```

## Cara Kerja

```text
data besar
  ↓
yield satu per satu
  ↓
diproses foreach
  ↓
memory hemat
```

## Kunci

> `yield` → hasilkan value bertahap.
>
> Generator → iterable yang menghasilkan data secara lazy.

## Best Practice

- Gunakan Generator ketika data terlalu besar untuk dimuat seluruhnya
  ke memory.

------------------------------------------------------------------------

<a id="bagian-31"></a>

# 31. 🔴 Exception dan Error

## Konsep

Error handling di PHP menggunakan `try`, `throw`, `catch`, dan
`finally`.

## `Exception`

```php
throw new Exception("Terjadi kesalahan");
```

## `try/catch`

```php
try {
    throw new Exception("Terjadi kesalahan");
} catch (Exception $e) {
    echo $e->getMessage();
}
```

Output:

```text
Terjadi kesalahan
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

Output:

```text
ProsesSelesai
```

## `Throwable`

PHP modern memiliki hierarchy utama:

```text
Throwable
├── Error
└── Exception
```

Untuk menangkap error/exception secara umum:

```php
try {
    // ...
} catch (Throwable $e) {
    echo $e->getMessage();
}
```

## `ErrorException`

PHP juga menyediakan `ErrorException` untuk merepresentasikan error
level tertentu sebagai exception ketika memang diperlukan.

## Kunci

> `try` → jalankan, `throw` → lempar, `catch` → tangkap, `finally` →
> selalu dijalankan setelah try/catch selesai.

## Kesalahan Umum

❌ Menangkap semua exception lalu menelannya tanpa log.

✅ Catat error (log) dan tangani dengan tepat, atau biarkan naik ke
layer yang bisa menanganinya.

------------------------------------------------------------------------

<a id="bagian-32"></a>

# 32. 🔴 Reflection

## Konsep

Reflection digunakan untuk menginspeksi class, method, property,
parameter, dan struktur object saat runtime.

## `ReflectionClass`

```php
class User
{
    public string $name;

    public function login(): void
    {
    }
}

$reflection = new ReflectionClass(User::class);

echo $reflection->getName();
```

Output:

```text
User
```

## Method dan Property

```php
$methods = $reflection->getMethods();

foreach ($methods as $method) {
    echo $method->getName();
}
```

```php
$properties = $reflection->getProperties();

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

## Kunci

> Reflection → melihat struktur PHP object/class saat runtime.

## Best Practice

- Gunakan Reflection hanya jika benar-benar diperlukan — kode yang
  memakai Reflection lebih sulit dibaca dan di-debug.

------------------------------------------------------------------------

<a id="bagian-33"></a>

# 33. 🔴 Intl

## Konsep

Extension `intl` menyediakan API internasionalisasi: format angka,
currency, tanggal, dan locale.

> Ketersediaan fitur ini bergantung pada extension `intl`.

## `NumberFormatter`

```php
$formatter = new NumberFormatter(
    "id_ID",
    NumberFormatter::CURRENCY
);

echo $formatter->formatCurrency(150000, "IDR");
```

Output:

```text
Rp150.000,00
```

Format desimal:

```php
$formatter = new NumberFormatter(
    "id_ID",
    NumberFormatter::DECIMAL
);

echo $formatter->format(1234567.89);
```

Output:

```text
1.234.567,89
```

## `IntlDateFormatter`

```php
$formatter = new IntlDateFormatter(
    "id_ID",
    IntlDateFormatter::LONG,
    IntlDateFormatter::NONE,
    "Asia/Jakarta"
);

echo $formatter->format(
    new DateTimeImmutable()
);
```

Contoh output:

```text
17 Agustus 2026
```

## Perbedaan konsep

```text
date()
→ format sederhana berdasarkan pattern PHP

DateTime::format()
→ format object tanggal

IntlDateFormatter
→ format berdasarkan locale
```

## Kunci

> `intl` berguna untuk: format angka, currency, tanggal, locale,
> collation, internationalization.

## Best Practice

- Untuk aplikasi yang membutuhkan format berdasarkan locale, gunakan
  `intl` daripada merakit string secara manual.

------------------------------------------------------------------------

<a id="bagian-34"></a>

# 34. 🛠️ Mini Flow PHP Standard Library

Gunakan alur ini ketika menghadapi masalah pemrograman:

```text
1. Kenali jenis masalah
        ↓
2. Cari API standard library yang sesuai
        ↓
3. Uji dengan contoh kecil
        ↓
4. Terapkan ke masalah nyata
        ↓
5. Periksa keamanan (input user, password, random)
```

### Kapan memakai apa?

  Kebutuhan                        Pilihan
  --------------------------------- ----------------------------
  Memproses teks                   String Functions
  Mengolah data list               Array Functions
  Membutuhkan tanggal              DateTimeImmutable
  Pertukaran data API              JSON
  Mencari pola teks                PCRE / preg_*
  Membaca/menulis file             file_get_contents()
  Validasi input                   filter_var()
  Password                         password_hash() / password_verify()
  Random untuk security            random_int() / random_bytes()
  Data besar diproses bertahap     Generator
  Inspect class                    Reflection
  Format sesuai locale             Intl

### Prinsip penting

Jangan menghafalkan semua fungsi. Hafalkan **kelompok masalahnya**:

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

> **Kunci menguasai PHP Standard Library bukan menghafal seluruh API,
> tetapi mengetahui API mana yang harus dicari ketika menghadapi suatu
> masalah.**

------------------------------------------------------------------------

<a id="bagian-35"></a>

# 35. 📚 Tabel Ringkasan

  Materi       API utama                           Tujuan
  ------------ ----------------------------------- ---------------------------
  String       `strlen()` / `mb_strlen()`          Panjang string
  String       `trim()`                            Hapus whitespace
  String       `substr()` / `mb_substr()`          Ambil substring
  String       `strpos()`                          Cari posisi
  String       `str_contains()`                    Cek substring
  String       `str_replace()`                     Ganti string
  String       `explode()` / `implode()`           String ↔ array
  String       `sprintf()`                         Format string
  Array        `count()`                           Jumlah item
  Array        `in_array()`                        Cek value
  Array        `array_search()`                    Cari key/index
  Array        `array_push()` / `array_pop()`      Tambah / hapus belakang
  Array        `array_shift()` / `array_unshift()` Hapus / tambah depan
  Array        `array_merge()`                     Gabung array
  Array        `array_slice()` / `array_splice()`  Potong array
  Array        `array_map()`                       Transform
  Array        `array_filter()`                    Filter
  Array        `array_reduce()`                    Reduce
  Array        `sort()` / `asort()` / `ksort()`    Sortir
  Number       `is_numeric()`                      Cek numerik
  Number       `intval()` / `floatval()`           Konversi
  Number       `number_format()`                   Format angka
  Math         `round()` / `ceil()` / `floor()`    Pembulatan
  Math         `min()` / `max()`                   Nilai min/maks
  Math         `random_int()`                      Random aman
  Date         `date()` / `strtotime()`            Format tanggal
  DateTime     `DateTimeImmutable`                 Object tanggal
  DateTime     `DateInterval` / `DatePeriod`       Interval / periode
  Timezone     `DateTimeZone`                      Zona waktu
  JSON         `json_encode()` / `json_decode()`   PHP ↔ JSON
  Regex        `preg_match()` / `preg_replace()`   Cari / ganti pola
  File         `file_get_contents()`               Baca file
  File         `file_put_contents()`               Tulis file
  Directory    `mkdir()` / `scandir()`             Buat / baca directory
  Path         `basename()` / `dirname()`          Nama file / folder
  Filter       `filter_var()`                      Validasi / filter
  URL          `parse_url()` / `http_build_query()` Pecah / buat URL
  Variable     `isset()` / `empty()` / `unset()`   Cek / hapus variabel
  Type         `is_*()`                            Cek tipe
  Encoding     `mb_strlen()` / `mb_substr()`       String multibyte
  Hash         `hash()`                            Hash data
  Password     `password_hash()`                   Hash password
  Password     `password_verify()`                 Verifikasi password
  Random       `random_bytes()`                    Random bytes aman
  Serialize    `serialize()` / `unserialize()`     PHP data ↔ string
  Iterator     `Iterator`                          Custom iteration
  Generator    `yield`                             Lazy iteration
  Exception    `try/catch` / `Throwable`           Error handling
  Reflection   `ReflectionClass`                   Inspect class
  Intl         `NumberFormatter`                   Format angka/currency

------------------------------------------------------------------------

<a id="bagian-36"></a>

# 36. ⚡ Cheat Code PHP Standard Library 10 Detik

```text
String → strlen, trim, substr, str_contains, str_replace,
         explode, implode, sprintf

Array  → count, in_array, array_map, array_filter,
         array_reduce, sort

Date   → DateTimeImmutable, DateTimeZone, DateInterval

JSON   → json_encode, json_decode

File   → file_get_contents, file_put_contents, file_exists

Regex  → preg_match, preg_replace

Security → password_hash, password_verify,
           random_int, random_bytes
```

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

in_array($value, $array, true);

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
$date = new DateTimeImmutable();

$date->format("Y-m-d H:i:s");
```

## JSON

```php
$json = json_encode($data);

$data = json_decode(
    $json,
    true,
    512,
    JSON_THROW_ON_ERROR
);
```

## File

```php
$content = file_get_contents("data.txt");

file_put_contents("data.txt", $content);
```

## Regex

```php
preg_match("/PHP/", $text);

preg_replace("/PHP/", "JavaScript", $text);
```

## Password

```php
$hash = password_hash($password, PASSWORD_DEFAULT);

password_verify($password, $hash);
```

## Random aman

```php
random_int(100000, 999999);

bin2hex(random_bytes(16));
```

------------------------------------------------------------------------

<a id="bagian-37"></a>

# 37. 🧭 Urutan Belajar yang Disarankan

```text
1. String
       ↓
2. Array
       ↓
3. Number + Math
       ↓
4. DateTime
       ↓
5. JSON
       ↓
6. Regex
       ↓
7. File + Filesystem
       ↓
8. Filter + URL
       ↓
9. Hash + Password
       ↓
10. Random
        ↓
11. Iterator + Generator
        ↓
12. Exception
        ↓
13. Reflection
        ↓
14. Intl
```

Prinsip: kuasai dulu String, Array, Number, dan DateTime — empat ini
paling sering dipakai sehari-hari.

------------------------------------------------------------------------

<a id="bagian-38"></a>

# 38. 🏗️ Mini Project

## JSON API sederhana dari file

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

$data = file_get_contents("users.json");

$users = json_decode(
    $data,
    true,
    512,
    JSON_THROW_ON_ERROR
);

$activeUsers = array_filter(
    $users,
    fn($user) => $user["active"] === true
);

$result = array_map(
    fn($user) => ["name" => $user["name"]],
    $activeUsers
);

$response = [
    "success" => true,
    "generated_at" => new DateTimeImmutable(),
    "data" => array_values($result)
];

echo json_encode(
    $response,
    JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR
);
```

### Alur

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

------------------------------------------------------------------------

<a id="bagian-39"></a>

# 39. 🔗 Referensi Resmi

- [PHP Manual — Function Reference](https://www.php.net/manual/en/funcref.php)
- [PHP Manual — String Functions](https://www.php.net/manual/en/ref.strings.php)
- [PHP Manual — Array Functions](https://www.php.net/manual/en/ref.array.php)
- [PHP Manual — Date and Time](https://www.php.net/manual/en/book.datetime.php)
- [PHP Manual — JSON](https://www.php.net/manual/en/book.json.php)
- [PHP Manual — PCRE / Regular Expressions](https://www.php.net/manual/en/book.pcre.php)
- [PHP Manual — Filesystem](https://www.php.net/manual/en/book.filesystem.php)
- [PHP Manual — Filter](https://www.php.net/manual/en/book.filter.php)
- [PHP Manual — Hash](https://www.php.net/manual/en/book.hash.php)
- [PHP Manual — Password Hashing](https://www.php.net/manual/en/book.password.php)
- [PHP Manual — Random](https://www.php.net/manual/en/book.random.php)
- [PHP Manual — DateTimeImmutable](https://www.php.net/manual/en/class.datetimeimmutable.php)
- [PHP Manual — Iterator](https://www.php.net/manual/en/class.iterator.php)
- [PHP Manual — Generators](https://www.php.net/manual/en/language.generators.php)
- [PHP Manual — Exceptions](https://www.php.net/manual/en/language.exceptions.php)
- [PHP Manual — Reflection](https://www.php.net/manual/en/book.reflection.php)
- [PHP Manual — Intl](https://www.php.net/manual/en/book.intl.php)
