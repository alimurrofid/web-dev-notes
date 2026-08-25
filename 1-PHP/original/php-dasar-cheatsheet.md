# PHP Dasar Cheatsheet — Mudah Dipahami & Diingat

> **Target:** PHP 8.x untuk pemula. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> PHP adalah bahasa scripting general-purpose yang banyak digunakan untuk web dan dapat disisipkan ke dalam HTML. PHP bersifat dynamically typed secara default, sehingga tipe variable ditentukan saat runtime.

## Daftar Isi

1. [Pengenalan PHP](#1-pengenalan-php)
2. [Menginstall PHP](#2-menginstall-php)
3. [Program Hello World](#3-program-hello-world)
4. [Tipe Data Number](#4-tipe-data-number)
5. [Tipe Data Boolean](#5-tipe-data-boolean)
6. [Tipe Data String](#6-tipe-data-string)
7. [Variable](#7-variable)
8. [Constant](#8-constant)
9. [Data NULL](#9-data-null)
10. [Tipe Data Array](#10-tipe-data-array)
11. [Operator Aritmatika](#11-operator-aritmatika)
12. [Operator Penugasan](#12-operator-penugasan)
13. [Operator Perbandingan](#13-operator-perbandingan)
14. [Operator Logika](#14-operator-logika)
15. [Increment dan Decrement](#15-increment-dan-decrement)
16. [Operator Array](#16-operator-array)
17. [Expression, Statement dan Block](#17-expression-statement-dan-block)
18. [Manipulasi String](#18-manipulasi-string)
19. [If Statement](#19-if-statement)
20. [Switch Statement](#20-switch-statement)
21. [Ternary Operator](#21-ternary-operator)
22. [Null Coalescing Operator](#22-null-coalescing-operator)
23. [For Loop](#23-for-loop)
24. [While Loop](#24-while-loop)
25. [Do While Loop](#25-do-while-loop)
26. [Break & Continue](#26-break--continue)
27. [For Each Loop](#27-for-each-loop)
28. [goto Operator](#28-goto-operator)
29. [Function](#29-function)
30. [Function Argument](#30-function-argument)
31. [Function Return Value](#31-function-return-value)
32. [Variable Function](#32-variable-function)
33. [Anonymous Function](#33-anonymous-function)
34. [Arrow Function](#34-arrow-function)
35. [Callback Function](#35-callback-function)
36. [Recursive Function](#36-recursive-function)
37. [Komentar](#37-komentar)
38. [String Function](#38-string-function)
39. [Array Function](#39-array-function)
40. [is Function](#40-is-function)
41. [Require dan Include](#41-require-dan-include)
42. [Variable Scope](#42-variable-scope)
43. [Reference](#43-reference)
44. [Peta Ingatan Cepat](#44-peta-ingatan-cepat)
45. [Tabel Ringkasan](#45-tabel-ringkasan)
46. [Mini Project](#46-mini-project)
47. [Cheat Code PHP 10 Detik](#47-cheat-code-php-10-detik)
48. [Referensi Resmi](#48-referensi-resmi)

---

# 1. Pengenalan PHP

PHP adalah bahasa scripting general-purpose yang sangat cocok untuk web dan dapat disisipkan ke dalam HTML. [PHP Manual](https://www.php.net/manual/en/manual.php).

Diagram sederhana:

```text
Browser
   │
   │ request
   ▼
Web Server
   │
   ▼
PHP
   │
   ├── proses logic
   ├── akses database
   └── menghasilkan HTML
   │
   ▼
Browser
```

Contoh:

```php
<?php

echo "Halo dari PHP!";
```

Output:

```text
Halo dari PHP!
```

## Ciri penting PHP

```text
PHP
├── server-side
├── dynamically typed
├── statement biasanya diakhiri ;
├── variable diawali $
└── blok kode menggunakan {}
```

PHP memiliki tipe built-in seperti `null`, `bool`, `int`, `float`, `string`, `array`, `object`, `callable`, dan `resource`. [PHP Manual — Types](https://www.php.net/manual/en/language.types.php).

**Hafalan:**

```text
PHP = kode dijalankan di server → hasil dikirim ke client
```

---

# 2. Menginstall PHP

## 2.1 Cek apakah PHP sudah terinstall

Buka terminal:

```bash
php -v
```

Contoh:

```text
PHP 8.x.x (cli)
```

Jika command tidak ditemukan, install PHP sesuai sistem operasi.

## 2.2 Ubuntu / Debian

```bash
sudo apt update
sudo apt install php
```

Cek:

```bash
php -v
```

## 2.3 macOS dengan Homebrew

```bash
brew install php
```

Cek:

```bash
php -v
```

## 2.4 Windows

Pilihan umum:

```text
PHP binary
XAMPP
Laragon
Docker
```

Setelah PHP tersedia di PATH:

```bash
php -v
```

## 2.5 Menjalankan server development

Masuk ke folder project:

```bash
cd belajar-php
```

Jalankan:

```bash
php -S localhost:8000
```

Buka:

```text
http://localhost:8000
```

Diagram:

```text
project/
├── index.php
└── ...
      │
      ▼
php -S localhost:8000
      │
      ▼
localhost:8000
```

> Untuk belajar PHP dasar, built-in development server sudah cukup. Jangan gunakan server development ini sebagai server production.

---

# 3. Program Hello World

Buat:

```text
index.php
```

Isi:

```php
<?php

echo "Hello World!";
```

Jalankan:

```bash
php index.php
```

Output:

```text
Hello World!
```

## PHP + HTML

```php
<!DOCTYPE html>
<html>
<body>

<h1>
    <?php echo "Hello World!"; ?>
</h1>

</body>
</html>
```

Output browser:

```text
Hello World!
```

Bentuk singkat `echo` juga sering ditulis:

```php
<h1><?= "Hello World!" ?></h1>
```

**Hafalan:**

```text
<?php ... ?>
```

= area PHP ketika PHP disisipkan ke HTML.

---

# 4. Tipe Data Number

Number di PHP terutama terdiri dari:

```text
int
float
```

## Integer

Bilangan bulat:

```php
$age = 20;
$count = -5;
```

## Float

Bilangan desimal:

```php
$price = 19.99;
$temperature = -2.5;
```

Contoh:

```php
$number = 10;

var_dump($number);
```

Output:

```text
int(10)
```

Float:

```php
$price = 19.99;

var_dump($price);
```

Output:

```text
float(19.99)
```

`var_dump()` berguna untuk melihat nilai sekaligus tipe data.

**Hafalan:**

```text
10     → int
10.5   → float
```

---

# 5. Tipe Data Boolean

Boolean hanya memiliki:

```php
true
false
```

Contoh:

```php
$isLogin = true;
$isAdmin = false;
```

Cek:

```php
var_dump($isLogin);
var_dump($isAdmin);
```

Output:

```text
bool(true)
bool(false)
```

Boolean banyak digunakan untuk kondisi:

```php
if ($isLogin) {
    echo "Selamat datang";
}
```

Output:

```text
Selamat datang
```

**Hafalan:**

```text
true  → ya
false → tidak
```

---

# 6. Tipe Data String

String adalah teks.

```php
$name = "Budi";
```

Bisa menggunakan single quote:

```php
$name = 'Budi';
```

atau double quote:

```php
$name = "Budi";
```

## Interpolasi string

Double quote dapat melakukan interpolasi variable:

```php
$name = "Budi";

echo "Halo $name";
```

Output:

```text
Halo Budi
```

Single quote:

```php
$name = "Budi";

echo 'Halo $name';
```

Output:

```text
Halo $name
```

## Concatenation

Gunakan `.`:

```php
$name = "Budi";

echo "Halo " . $name;
```

Output:

```text
Halo Budi
```

**Hafalan:**

```text
"..." → interpolation
.     → gabungkan string
```

---

# 7. Variable

Variable PHP diawali `$`.

```php
$name = "Budi";
$age = 20;
```

Diagram:

```text
$name
  │
  ▼
"Budi"
```

## Mengubah nilai

```php
$count = 10;

$count = 20;

echo $count;
```

Output:

```text
20
```

## Variable dapat berubah tipe

```php
$value = 10;

$value = "PHP";
```

PHP adalah dynamically typed secara default; tipe variable biasanya ditentukan saat runtime. [PHP Manual — Type System](https://www.php.net/manual/en/language.types.intro.php).

## Aturan nama variable

Valid:

```php
$name
$userName
$user_name
$_value
```

Tidak valid:

```php
$1name
$user-name
```

**Hafalan:**

```text
$ + nama = variable
```

---

# 8. Constant

Constant adalah nilai yang tidak dimaksudkan untuk diubah.

Cara modern yang umum:

```php
const APP_NAME = "Belajar PHP";
```

Gunakan:

```php
echo APP_NAME;
```

Output:

```text
Belajar PHP
```

Bisa juga:

```php
define("APP_VERSION", "1.0.0");

echo APP_VERSION;
```

## Variable vs Constant

```text
Variable
$name
$age

Constant
APP_NAME
APP_VERSION
```

Convention constant:

```text
HURUF_BESAR
```

Contoh:

```php
const MAX_LOGIN = 3;
```

**Hafalan:**

```text
variable  → $name
constant  → NAME
```

---

# 9. Data NULL

`null` berarti variable tidak memiliki nilai.

```php
$name = null;

var_dump($name);
```

Output:

```text
NULL
```

Contoh:

```php
$user = null;

if ($user === null) {
    echo "Belum login";
}
```

Output:

```text
Belum login
```

**Hafalan:**

```text
null = tidak ada nilai
```

---

# 10. Tipe Data Array

Array digunakan untuk menyimpan banyak nilai.

## Indexed array

```php
$fruits = [
    "Apple",
    "Banana",
    "Orange",
];
```

Index dimulai dari `0`:

```text
0 → Apple
1 → Banana
2 → Orange
```

Akses:

```php
echo $fruits[0];
```

Output:

```text
Apple
```

## Associative array

```php
$user = [
    "name" => "Budi",
    "age" => 20,
];
```

Akses:

```php
echo $user["name"];
```

Output:

```text
Budi
```

## Nested array

```php
$users = [
    [
        "name" => "Budi",
        "age" => 20,
    ],
    [
        "name" => "Andi",
        "age" => 25,
    ],
];
```

Akses:

```php
echo $users[0]["name"];
```

Output:

```text
Budi
```

Diagram:

```text
Array
│
├── indexed
│    ├── 0
│    ├── 1
│    └── 2
│
└── associative
     ├── name
     └── age
```

---

# 11. Operator Aritmatika

Operator dasar:

| Operator | Fungsi    | Contoh   |
| -------- | --------- | -------- |
| `+`      | tambah    | `10 + 3` |
| `-`      | kurang    | `10 - 3` |
| `*`      | kali      | `10 * 3` |
| `/`      | bagi      | `10 / 3` |
| `%`      | sisa bagi | `10 % 3` |
| `**`     | pangkat   | `2 ** 3` |

Contoh:

```php
$a = 10;
$b = 3;

echo $a + $b;
echo $a - $b;
echo $a * $b;
echo $a / $b;
echo $a % $b;
echo $a ** $b;
```

Hasil:

```text
13
7
30
3.333...
1
1000
```

**Hafalan:**

```text
+  -  *  /  %  **
```

---

# 12. Operator Penugasan

Assignment:

```php
$x = 10;
```

Compound assignment:

```php
$x += 5;   // x = x + 5
$x -= 5;   // x = x - 5
$x *= 5;   // x = x * 5
$x /= 5;   // x = x / 5
$x %= 5;   // x = x % 5
```

String:

```php
$name = "Budi";
$name .= " Santoso";
```

Hasil:

```text
Budi Santoso
```

**Hafalan:**

```text
op=
```

Contoh:

```text
+=
-=
*=
/=
%=
.=
```

---

# 13. Operator Perbandingan

Operator utama:

| Operator | Arti                       |
| -------- | -------------------------- |
| `==`     | sama nilai                 |
| `===`    | sama nilai dan tipe        |
| `!=`     | tidak sama nilai           |
| `!==`    | tidak sama nilai atau tipe |
| `<`      | kurang dari                |
| `>`      | lebih dari                 |
| `<=`     | kurang dari / sama         |
| `>=`     | lebih dari / sama          |
| `<=>`    | spaceship                  |

## `==` vs `===`

```php
var_dump(5 == "5");
var_dump(5 === "5");
```

Output:

```text
bool(true)
bool(false)
```

Karena:

```text
5 == "5"
↓
nilai dianggap sama

5 === "5"
↓
nilai sama tetapi tipe berbeda
↓
false
```

**Best practice umum:**

```text
lebih aman gunakan === dan !==
```

---

# 14. Operator Logika

| Operator | Arti |
| -------- | ---- | --- | --- |
| `&&`     | AND  |
| `        |      | `   | OR  |
| `!`      | NOT  |
| `and`    | AND  |
| `or`     | OR   |
| `xor`    | XOR  |

Contoh:

```php
$age = 20;
$isMember = true;

if ($age >= 18 && $isMember) {
    echo "Boleh masuk";
}
```

Output:

```text
Boleh masuk
```

## Truth table sederhana

```text
AND (&&)

true  && true  = true
true  && false = false
false && true  = false
false && false = false
```

```text
OR (||)

true  || true  = true
true  || false = true
false || true  = true
false || false = false
```

**Catatan:** `and` dan `or` memiliki precedence berbeda dari `&&` dan `||`. Untuk kondisi sehari-hari, `&&` dan `||` biasanya lebih mudah diprediksi.

---

# 15. Increment dan Decrement

Increment:

```php
$count = 1;

$count++;
```

Hasil:

```text
2
```

Decrement:

```php
$count = 2;

$count--;
```

Hasil:

```text
1
```

## Prefix vs postfix

```php
$x = 5;

echo $x++;
```

Output:

```text
5
```

Setelah itu:

```text
$x = 6
```

Prefix:

```php
$x = 5;

echo ++$x;
```

Output:

```text
6
```

**Hafalan:**

```text
x++ → pakai dulu, tambah
++x → tambah dulu, pakai
```

---

# 16. Operator Array

Operator array:

| Operator | Fungsi                         |
| -------- | ------------------------------ |
| `+`      | union                          |
| `==`     | sama pasangan key/value        |
| `===`    | sama key/value dan urutan/tipe |
| `!=`     | tidak sama                     |
| `!==`    | tidak identik                  |

## Union `+`

```php
$a = [
    "name" => "Budi",
];

$b = [
    "age" => 20,
];

$result = $a + $b;

print_r($result);
```

Output:

```text
Array
(
    [name] => Budi
    [age] => 20
)
```

Jika key sama, nilai dari array kiri dipertahankan.

```php
$a = ["name" => "Budi"];
$b = ["name" => "Andi"];

$result = $a + $b;
```

Hasil:

```text
name => Budi
```

**Hafalan:**

```text
array + array = union
array kiri lebih dominan untuk key yang sama
```

---

# 17. Expression, Statement dan Block

## Expression

Expression adalah sesuatu yang menghasilkan nilai.

```php
10 + 5
```

```php
$name
```

```php
$isLogin === true
```

Contoh:

```php
$result = 10 + 5;
```

Bagian:

```text
10 + 5
   ↓
expression
   ↓
15
```

## Statement

Statement adalah instruksi yang dijalankan PHP.

```php
$name = "Budi";
```

```php
echo $name;
```

```php
if ($age >= 18) {
    echo "Dewasa";
}
```

Statement biasanya diakhiri `;`. [PHP Manual — Control Structures](https://www.php.net/manual/en/language.control-structures.php).

## Block

Block adalah kumpulan statement di antara `{}`.

```php
if ($age >= 18) {
    echo "Dewasa";
    echo "Boleh masuk";
}
```

Diagram:

```text
if (...)
{
    statement
    statement
    statement
}
```

**Hafalan:**

```text
Expression → menghasilkan nilai
Statement  → instruksi
Block      → kumpulan statement
```

---

# 18. Manipulasi String

## Concatenation

```php
$first = "Budi";
$last = "Santoso";

$name = $first . " " . $last;
```

Output:

```text
Budi Santoso
```

## Interpolasi

```php
$name = "Budi";

echo "Halo $name";
```

## Heredoc

```php
$name = "Budi";

$text = <<<TEXT
Halo $name
Selamat belajar PHP
TEXT;

echo $text;
```

## Nowdoc

```php
$text = <<<'TEXT'
Halo $name
TEXT;

echo $text;
```

Output:

```text
Halo $name
```

**Perbedaan:**

```text
Heredoc → mirip double quote
Nowdoc  → mirip single quote
```

---

# 19. If Statement

Digunakan untuk mengambil keputusan berdasarkan kondisi.

```php
$age = 20;

if ($age >= 18) {
    echo "Dewasa";
}
```

Output:

```text
Dewasa
```

## if - else

```php
$age = 15;

if ($age >= 18) {
    echo "Dewasa";
} else {
    echo "Anak-anak";
}
```

Output:

```text
Anak-anak
```

## if - elseif - else

```php
$score = 85;

if ($score >= 90) {
    echo "A";
} elseif ($score >= 80) {
    echo "B";
} else {
    echo "C";
}
```

Output:

```text
B
```

Diagram:

```text
Condition
    │
    ├── true  → blok 1
    │
    └── false
          │
          ▼
       elseif?
          │
          ├── true → blok 2
          └── false → else
```

---

# 20. Switch Statement

Cocok ketika satu nilai dibandingkan dengan beberapa pilihan.

```php
$role = "admin";

switch ($role) {
    case "admin":
        echo "Dashboard Admin";
        break;

    case "user":
        echo "Dashboard User";
        break;

    default:
        echo "Guest";
}
```

Output:

```text
Dashboard Admin
```

## Jangan lupa `break`

```php
switch ($role) {
    case "admin":
        echo "Admin";
        break;
}
```

Tanpa `break`, eksekusi dapat berlanjut ke case berikutnya.

**Peta:**

```text
switch(value)
    │
    ├── case A
    ├── case B
    ├── case C
    └── default
```

PHP modern juga memiliki `match`, tetapi materi ini fokus pada `switch`. Dokumentasi resmi PHP mencantumkan keduanya dalam control structures. [PHP Manual — Control Structures](https://www.php.net/manual/en/language.control-structures.php).

---

# 21. Ternary Operator

Ternary adalah bentuk singkat dari `if/else`.

```php
$age = 20;

$status = $age >= 18
    ? "Dewasa"
    : "Anak-anak";
```

Output:

```text
Dewasa
```

Bentuk panjang:

```php
if ($age >= 18) {
    $status = "Dewasa";
} else {
    $status = "Anak-anak";
}
```

Bentuk singkat:

```php
$status = $age >= 18
    ? "Dewasa"
    : "Anak-anak";
```

**Hafalan:**

```text
condition ? true : false
```

---

# 22. Null Coalescing Operator

Gunakan `??` untuk memberikan fallback ketika nilai tidak ada atau `null`.

```php
$name = null;

$result = $name ?? "Guest";

echo $result;
```

Output:

```text
Guest
```

Contoh:

```php
$username = $_GET["username"] ?? "Guest";
```

Jika parameter tidak tersedia:

```text
Guest
```

Diagram:

```text
$value ?? "fallback"
   │
   ├── ada & bukan null → $value
   │
   └── null/tidak ada    → fallback
```

**Hafalan:**

```text
?? = kalau null, pakai cadangan
```

---

# 23. For Loop

Digunakan ketika jumlah iterasi diketahui atau dikontrol oleh counter.

```php
for ($i = 1; $i <= 5; $i++) {
    echo $i . PHP_EOL;
}
```

Output:

```text
1
2
3
4
5
```

Struktur:

```text
for (
    initialization;
    condition;
    increment
)
```

Diagram:

```text
init
 │
 ▼
condition ── false ──> selesai
 │
true
 │
 ▼
body
 │
 ▼
increment
 │
 └───────────────> condition
```

**Hafalan:**

```text
init → condition → body → increment
```

---

# 24. While Loop

While menjalankan block selama kondisi bernilai true.

```php
$i = 1;

while ($i <= 5) {
    echo $i . PHP_EOL;

    $i++;
}
```

Output:

```text
1
2
3
4
5
```

Diagram:

```text
condition
    │
    ├── false → selesai
    │
    └── true
          ↓
        body
          ↓
       ulangi
```

Pastikan kondisi akhirnya berubah agar tidak terjadi infinite loop.

---

# 25. Do While Loop

Perbedaan utama:

```text
while     → cek dulu
do while  → jalankan dulu
```

Contoh:

```php
$i = 10;

do {
    echo $i;
    $i++;
} while ($i <= 5);
```

Output:

```text
10
```

Walaupun kondisi awal false, body tetap dijalankan sekali.

Diagram:

```text
body
 ↓
condition
 ↓
true → ulang
false → selesai
```

**Hafalan:**

```text
do while = minimal 1 kali
```

---

# 26. Break & Continue

## break

Menghentikan loop.

```php
for ($i = 1; $i <= 10; $i++) {
    if ($i === 5) {
        break;
    }

    echo $i . " ";
}
```

Output:

```text
1 2 3 4
```

## continue

Melewati iterasi saat ini dan lanjut ke iterasi berikutnya.

```php
for ($i = 1; $i <= 5; $i++) {
    if ($i === 3) {
        continue;
    }

    echo $i . " ";
}
```

Output:

```text
1 2 4 5
```

**Hafalan:**

```text
break    → keluar
continue → lewati
```

---

# 27. For Each Loop

`foreach` digunakan untuk melakukan iterasi array.

## Value saja

```php
$fruits = [
    "Apple",
    "Banana",
    "Orange",
];

foreach ($fruits as $fruit) {
    echo $fruit . PHP_EOL;
}
```

Output:

```text
Apple
Banana
Orange
```

## Key dan value

```php
$user = [
    "name" => "Budi",
    "age" => 20,
];

foreach ($user as $key => $value) {
    echo "$key: $value" . PHP_EOL;
}
```

Output:

```text
name: Budi
age: 20
```

Diagram:

```text
array
 │
 ├── item 1 → foreach
 ├── item 2 → foreach
 └── item 3 → foreach
```

**Hafalan:**

```text
foreach ($array as $item)
```

---

# 28. goto Operator

`goto` memindahkan eksekusi ke label tertentu.

```php
$count = 1;

start:

echo $count . PHP_EOL;

$count++;

if ($count <= 3) {
    goto start;
}
```

Output:

```text
1
2
3
```

Struktur:

```text
goto label;

label:
    statement
```

**Catatan:** `goto` jarang diperlukan dalam aplikasi modern karena dapat membuat alur program sulit dibaca. Gunakan loop atau function jika lebih jelas.

**Hafalan:**

```text
goto = lompat ke label
```

---

# 29. Function

Function adalah blok kode yang dapat dipanggil berulang kali.

```php
function sayHello()
{
    echo "Hello PHP";
}

sayHello();
```

Output:

```text
Hello PHP
```

Diagram:

```text
define function
      │
      ▼
   sayHello()
      │
      ▼
     call
      │
      ▼
    output
```

## Function dengan return

```php
function getName()
{
    return "Budi";
}

echo getName();
```

Output:

```text
Budi
```

**Hafalan:**

```text
function = bungkus logic agar dapat digunakan ulang
```

---

# 30. Function Argument

Argument adalah nilai yang dikirim ketika function dipanggil.

```php
function greet($name)
{
    echo "Halo $name";
}

greet("Budi");
```

Output:

```text
Halo Budi
```

## Multiple argument

```php
function add($a, $b)
{
    echo $a + $b;
}

add(10, 5);
```

Output:

```text
15
```

## Default argument

```php
function greet($name = "Guest")
{
    echo "Halo $name";
}

greet();
```

Output:

```text
Halo Guest
```

### Parameter vs Argument

```text
function greet($name)
              ↑
           parameter

greet("Budi");
      ↑
    argument
```

---

# 31. Function Return Value

Function dapat mengembalikan nilai menggunakan `return`.

```php
function add($a, $b)
{
    return $a + $b;
}

$result = add(10, 5);

echo $result;
```

Output:

```text
15
```

Diagram:

```text
add(10, 5)
    │
    ▼
10 + 5
    │
    ▼
return 15
    │
    ▼
$result
```

`return` juga menghentikan eksekusi function.

```php
function test()
{
    return "Selesai";

    echo "Tidak dijalankan";
}
```

---

# 32. Variable Function

Variable function terjadi ketika nama function disimpan di dalam variable.

```php
function sayHello()
{
    echo "Hello";
}

$function = "sayHello";

$function();
```

Output:

```text
Hello
```

Contoh dengan function argument:

```php
function add($a, $b)
{
    return $a + $b;
}

$operation = "add";

echo $operation(10, 5);
```

Output:

```text
15
```

**Hafalan:**

```text
$function = "namaFunction";
$function();
```

---

# 33. Anonymous Function

Anonymous function adalah function tanpa nama.

```php
$greet = function ($name) {
    return "Halo $name";
};

echo $greet("Budi");
```

Output:

```text
Halo Budi
```

Anonymous function sering digunakan sebagai callback.

```php
$numbers = [1, 2, 3];

$result = array_map(
    function ($number) {
        return $number * 2;
    },
    $numbers
);
```

Hasil:

```text
[2, 4, 6]
```

**Hafalan:**

```text
function (...) {
    ...
}
```

= function tanpa nama yang dapat disimpan ke variable.

---

# 34. Arrow Function

Arrow function adalah syntax singkat untuk function sederhana.

```php
$double = fn($number) => $number * 2;

echo $double(5);
```

Output:

```text
10
```

Dibandingkan anonymous function:

```php
$double = function ($number) {
    return $number * 2;
};
```

Arrow:

```php
$double = fn($number) => $number * 2;
```

## Dengan array_map

```php
$numbers = [1, 2, 3];

$result = array_map(
    fn($number) => $number * 2,
    $numbers
);
```

Hasil:

```text
[2, 4, 6]
```

**Hafalan:**

```text
fn($x) => expression
```

---

# 35. Callback Function

Callback adalah function yang dikirim ke function lain untuk dipanggil kemudian.

```php
function process($number, $callback)
{
    return $callback($number);
}

$result = process(
    5,
    fn($number) => $number * 2
);

echo $result;
```

Output:

```text
10
```

Diagram:

```text
process()
   │
   ├── number = 5
   │
   └── callback
         │
         ▼
     5 × 2
         │
         ▼
        10
```

Contoh built-in:

```php
$numbers = [1, 2, 3];

$result = array_map(
    fn($number) => $number * 2,
    $numbers
);
```

**Hafalan:**

```text
callback = function sebagai argument
```

---

# 36. Recursive Function

Recursive function adalah function yang memanggil dirinya sendiri.

Contoh faktorial:

```php
function factorial($number)
{
    if ($number <= 1) {
        return 1;
    }

    return $number * factorial($number - 1);
}

echo factorial(5);
```

Output:

```text
120
```

Alurnya:

```text
factorial(5)
  ↓
5 × factorial(4)
  ↓
5 × 4 × factorial(3)
  ↓
5 × 4 × 3 × factorial(2)
  ↓
5 × 4 × 3 × 2 × factorial(1)
  ↓
5 × 4 × 3 × 2 × 1
  ↓
120
```

Setiap recursive function harus memiliki **base case**.

```text
recursive call
      ↓
base case
      ↓
berhenti
```

**Hafalan:**

```text
recursive = function memanggil dirinya sendiri
```

---

# 37. Komentar

Komentar tidak dieksekusi sebagai kode.

## Single-line

```php
// Ini komentar
# Ini juga komentar
```

## Multi-line

```php
/*
    Ini komentar
    lebih dari satu baris
*/
```

Contoh:

```php
// Menampilkan nama
echo "Budi";
```

**Hafalan:**

```text
// komentar satu baris
#  komentar satu baris
/* */ komentar banyak baris
```

---

# 38. String Function

PHP menyediakan banyak function bawaan untuk string.

## `strlen()`

Menghitung panjang string:

```php
$name = "Budi";

echo strlen($name);
```

Output:

```text
4
```

## `strtoupper()`

```php
echo strtoupper("hello");
```

Output:

```text
HELLO
```

## `strtolower()`

```php
echo strtolower("HELLO");
```

Output:

```text
hello
```

## `str_replace()`

```php
$text = "Saya belajar JavaScript";

$text = str_replace(
    "JavaScript",
    "PHP",
    $text
);

echo $text;
```

Output:

```text
Saya belajar PHP
```

## `trim()`

```php
$text = "  Budi  ";

echo trim($text);
```

Output:

```text
Budi
```

## `substr()`

```php
$text = "Belajar PHP";

echo substr($text, 0, 7);
```

Output:

```text
Belajar
```

## `str_contains()`

```php
$text = "Belajar PHP";

var_dump(
    str_contains($text, "PHP")
);
```

Output:

```text
bool(true)
```

## Ringkasan

```text
strlen()       → panjang
strtoupper()   → uppercase
strtolower()   → lowercase
str_replace()  → replace
trim()         → hapus whitespace
substr()       → ambil sebagian
str_contains() → cek substring
```

---

# 39. Array Function

PHP memiliki banyak function untuk memproses array.

## `count()`

```php
$items = ["A", "B", "C"];

echo count($items);
```

Output:

```text
3
```

## `in_array()`

```php
$items = ["PHP", "Vue"];

var_dump(
    in_array("PHP", $items)
);
```

Output:

```text
bool(true)
```

## `array_push()`

```php
$items = ["PHP"];

array_push($items, "Vue");

print_r($items);
```

Hasil:

```text
Array
(
    [0] => PHP
    [1] => Vue
)
```

Untuk satu item, juga umum:

```php
$items[] = "Vue";
```

## `array_pop()`

Menghapus item terakhir:

```php
$items = ["A", "B", "C"];

array_pop($items);
```

Hasil:

```text
["A", "B"]
```

## `array_shift()`

Menghapus item pertama:

```php
$items = ["A", "B", "C"];

array_shift($items);
```

Hasil:

```text
["B", "C"]
```

## `array_unshift()`

Menambah item di awal:

```php
$items = ["B", "C"];

array_unshift($items, "A");
```

Hasil:

```text
["A", "B", "C"]
```

## `array_map()`

```php
$numbers = [1, 2, 3];

$result = array_map(
    fn($number) => $number * 2,
    $numbers
);
```

Hasil:

```text
[2, 4, 6]
```

## `array_filter()`

```php
$numbers = [1, 2, 3, 4];

$result = array_filter(
    $numbers,
    fn($number) => $number % 2 === 0
);
```

Hasil:

```text
[2, 4]
```

## `array_merge()`

```php
$a = ["A", "B"];
$b = ["C", "D"];

$result = array_merge($a, $b);
```

Hasil:

```text
["A", "B", "C", "D"]
```

## `sort()`

```php
$numbers = [3, 1, 2];

sort($numbers);
```

Hasil:

```text
[1, 2, 3]
```

## Function array yang perlu diingat

```text
count()
in_array()
array_push()
array_pop()
array_shift()
array_unshift()
array_map()
array_filter()
array_merge()
sort()
```

PHP 8.4 menambahkan beberapa helper array seperti `array_find()`, `array_find_key()`, `array_any()`, dan `array_all()`. Untuk detail versi dan fungsi, lihat [PHP Manual](https://www.php.net/manual/en/).

---

# 40. is Function

PHP memiliki banyak function berbentuk `is_*()` untuk mengecek tipe atau kondisi nilai. [PHP Manual — Types](https://www.php.net/manual/en/language.types.php).

## `is_int()`

```php
$value = 10;

var_dump(is_int($value));
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

## `is_string()`

```php
var_dump(is_string("PHP"));
```

Output:

```text
bool(true)
```

## `is_bool()`

```php
var_dump(is_bool(true));
```

Output:

```text
bool(true)
```

## `is_array()`

```php
var_dump(is_array([]));
```

Output:

```text
bool(true)
```

## `is_null()`

```php
$value = null;

var_dump(is_null($value));
```

Output:

```text
bool(true)
```

## `is_numeric()`

```php
var_dump(is_numeric("123"));
```

Output:

```text
bool(true)
```

## Ringkasan

```text
is_int()
is_float()
is_string()
is_bool()
is_array()
is_null()
is_numeric()
```

Hafalan:

```text
is_*() → "apakah ini ...?"
```

---

# 41. Require dan Include

Digunakan untuk memasukkan file PHP lain.

Misalnya:

```text
project/
├── index.php
└── config.php
```

`config.php`:

```php
<?php

$appName = "Belajar PHP";
```

`index.php`:

```php
<?php

require "config.php";

echo $appName;
```

Output:

```text
Belajar PHP
```

## `include`

```php
include "config.php";
```

Jika file tidak ditemukan, `include` menghasilkan warning (`E_WARNING`) ketika file tidak ditemukan dan eksekusi dapat berlanjut. [PHP Manual — include](https://www.php.net/manual/en/function.include.php).

## `require`

```php
require "config.php";
```

Jika file tidak ditemukan, `require` menghasilkan error yang lebih serius ketika file gagal dimuat. [PHP Manual — require](https://www.php.net/manual/en/function.require.php).

Diagram:

```text
index.php
    │
    ├── require
    │      ↓
    │   config.php
    │
    ▼
lanjut menjalankan kode
```

## `include_once`

```php
include_once "config.php";
```

Memastikan file hanya disertakan sekali.

## `require_once`

```php
require_once "config.php";
```

Juga memastikan file hanya disertakan sekali.

### Kapan menggunakan?

Umumnya:

```text
require_once → dependency wajib
include_once → file tambahan yang tidak wajib
```

**Hafalan:**

```text
require = wajib
include = tambahan
_once   = sekali
```

---

# 42. Variable Scope

Scope menentukan di mana variable dapat diakses.

## Global scope

```php
$name = "Budi";

echo $name;
```

Variable berada di global scope.

## Local scope

```php
function sayHello()
{
    $name = "Budi";

    echo $name;
}

sayHello();
```

`$name` hanya tersedia di dalam function.

```php
function sayHello()
{
    $name = "Budi";
}

sayHello();

echo $name;
```

Tidak dapat menggunakan `$name` sebagai local variable di luar function tersebut.

## `global`

```php
$name = "Budi";

function sayHello()
{
    global $name;

    echo $name;
}

sayHello();
```

Output:

```text
Budi
```

## `$GLOBALS`

```php
$name = "Budi";

function sayHello()
{
    echo $GLOBALS["name"];
}

sayHello();
```

## Static variable

Variable `static` mempertahankan nilai antar pemanggilan function:

```php
function counter()
{
    static $count = 0;

    $count++;

    echo $count . PHP_EOL;
}

counter();
counter();
counter();
```

Output:

```text
1
2
3
```

Diagram:

```text
Global Scope
    │
    └── $name
         │
         ├── global
         └── $GLOBALS

Function Scope
    │
    └── local variables
```

**Hafalan:**

```text
global scope  → luar function
local scope   → dalam function
static        → nilai bertahan antar call
```

---

# 43. Reference

Reference membuat dua variable menunjuk ke nilai yang sama.

Gunakan `&`.

```php
$name = "Budi";

$otherName = &$name;

$otherName = "Andi";

echo $name;
```

Output:

```text
Andi
```

Diagram:

```text
$name ───────┐
             ├──> "Andi"
$otherName ──┘
```

Tanpa reference:

```php
$name = "Budi";

$otherName = $name;

$otherName = "Andi";

echo $name;
```

Output:

```text
Budi
```

Dengan reference:

```php
$otherName = &$name;
```

Perubahan pada `$otherName` juga memengaruhi `$name`.

## Reference pada function

```php
function increment(&$number)
{
    $number++;
}

$count = 10;

increment($count);

echo $count;
```

Output:

```text
11
```

**Hafalan:**

```text
& = reference
```

Reference bukan sekadar "copy variable"; dua variable dapat menjadi alias untuk nilai yang sama. PHP memiliki dokumentasi khusus tentang reference dan passing by reference. [PHP Manual — References Explained](https://www.php.net/manual/en/language.references.php).

---

# 44. Peta Ingatan Cepat

## A. PHP Basic

```text
PHP
 │
 ├── variable       → $name
 ├── constant       → NAME
 ├── null           → tidak ada nilai
 ├── array          → kumpulan data
 └── function       → logic reusable
```

---

## B. Tipe Data

```text
Number
├── int
└── float

Boolean
├── true
└── false

String
└── "PHP"

Array
└── [ ... ]

NULL
└── null
```

PHP juga memiliki `object`, `callable`, dan `resource`.

---

## C. Operator

```text
Aritmatika
+ - * / % **

Assignment
= += -= *= /= %= .=

Comparison
== === != !== < > <= >= <=>

Logic
&& || ! and or xor

Increment
++ --

Array
+ == === != !==
```

---

## D. Conditional

```text
if
 │
 ├── elseif
 └── else

switch
 │
 ├── case
 └── default

ternary
condition ? true : false

null coalescing
$value ?? fallback
```

---

## E. Loop

```text
for
 ↓
jumlah iterasi terkontrol

while
 ↓
cek → jalankan

do while
 ↓
jalankan → cek

foreach
 ↓
array
```

---

## F. Loop Control

```text
break
  ↓
keluar loop

continue
  ↓
lewati iterasi sekarang
```

---

## G. Function

```text
function
   │
   ├── argument
   │
   ├── return
   │
   ├── variable function
   │
   ├── anonymous
   │
   ├── arrow
   │
   ├── callback
   │
   └── recursive
```

---

## H. String

```text
.              → concatenate
strlen()       → panjang
strtoupper()   → uppercase
strtolower()   → lowercase
str_replace()  → replace
trim()         → whitespace
substr()       → substring
str_contains() → contains
```

---

## I. Array

```text
count()
in_array()
array_push()
array_pop()
array_shift()
array_unshift()
array_map()
array_filter()
array_merge()
sort()
```

---

## J. File

```text
require
include
require_once
include_once
```

Hafalan:

```text
require → wajib
include → tambahan
_once   → satu kali
```

---

# 45. Tabel Ringkasan

| Materi            | Fungsi                    | Kata Kunci         |
| ----------------- | ------------------------- | ------------------ | --- | --- |
| Pengenalan PHP    | Mengenal PHP              | `<?php`            |
| Menginstall PHP   | Menjalankan PHP           | `php -v`           |
| Hello World       | Output                    | `echo`             |
| Number            | Angka                     | `int`, `float`     |
| Boolean           | Nilai true/false          | `true`, `false`    |
| String            | Teks                      | `"PHP"`            |
| Variable          | Data yang dapat berubah   | `$name`            |
| Constant          | Nilai konstan             | `const`            |
| NULL              | Tidak ada nilai           | `null`             |
| Array             | Kumpulan data             | `[]`               |
| Aritmatika        | Operasi angka             | `+ - * / % **`     |
| Penugasan         | Assign nilai              | `= += -=`          |
| Perbandingan      | Membandingkan             | `=== !==`          |
| Logika            | Gabung kondisi            | `&&                |     | !`  |
| Increment         | Tambah 1                  | `++`               |
| Decrement         | Kurang 1                  | `--`               |
| Operator Array    | Operasi array             | `+`, `==`, `===`   |
| Expression        | Menghasilkan nilai        | `10 + 5`           |
| Statement         | Instruksi                 | `echo`, assignment |
| Block             | Kumpulan statement        | `{}`               |
| Manipulasi String | Mengolah teks             | `.`                |
| If                | Kondisi                   | `if`               |
| Switch            | Banyak pilihan            | `case`             |
| Ternary           | If singkat                | `? :`              |
| Null Coalescing   | Fallback null             | `??`               |
| For               | Loop terkontrol           | `for`              |
| While             | Loop berdasarkan kondisi  | `while`            |
| Do While          | Loop minimal sekali       | `do`               |
| Break             | Keluar loop               | `break`            |
| Continue          | Lewati iterasi            | `continue`         |
| Foreach           | Loop array                | `foreach`          |
| goto              | Lompat label              | `goto`             |
| Function          | Logic reusable            | `function`         |
| Argument          | Input function            | `$arg`             |
| Return            | Output function           | `return`           |
| Variable Function | Function dari variable    | `$fn()`            |
| Anonymous         | Function tanpa nama       | `function () {}`   |
| Arrow             | Function singkat          | `fn() =>`          |
| Callback          | Function sebagai argument | `$callback()`      |
| Recursive         | Function memanggil diri   | recursion          |
| Komentar          | Catatan kode              | `//`, `/* */`      |
| String Function   | Utility string            | `strlen()`         |
| Array Function    | Utility array             | `array_map()`      |
| is Function       | Cek tipe                  | `is_*()`           |
| Require / Include | Import file               | `require`          |
| Scope             | Jangkauan variable        | global/local       |
| Reference         | Alias nilai               | `&`                |

---

# 46. Mini Project

## Program Nilai Siswa

Project ini menggabungkan:

```text
variable
array
function
argument
return
if
foreach
operator
string
```

### `index.php`

```php
<?php

$students = [
    [
        "name" => "Budi",
        "score" => 90,
    ],
    [
        "name" => "Andi",
        "score" => 75,
    ],
    [
        "name" => "Siti",
        "score" => 60,
    ],
];

function getGrade($score)
{
    if ($score >= 90) {
        return "A";
    }

    if ($score >= 80) {
        return "B";
    }

    if ($score >= 70) {
        return "C";
    }

    return "D";
}

foreach ($students as $student) {
    $grade = getGrade($student["score"]);

    echo $student["name"]
        . " - "
        . $student["score"]
        . " - Grade "
        . $grade
        . PHP_EOL;
}
```

Output:

```text
Budi - 90 - Grade A
Andi - 75 - Grade C
Siti - 60 - Grade D
```

Diagram:

```text
$students
    │
    ▼
 foreach
    │
    ▼
 getGrade(score)
    │
    ├── >= 90 → A
    ├── >= 80 → B
    ├── >= 70 → C
    └── else  → D
    │
    ▼
 output
```

---

# 47. Cheat Code PHP 10 Detik

> **PHP memakai `$` untuk variable, `const` untuk constant, `null` untuk tidak ada nilai, `[]` untuk array, `.` untuk menggabungkan string, `===` untuk perbandingan ketat, `&&`/`||` untuk logika, `if`/`switch` untuk kondisi, `for`/`while`/`do while`/`foreach` untuk loop, `break` untuk keluar dan `continue` untuk melewati iterasi. Function dibuat dengan `function`, menerima argument, mengembalikan nilai dengan `return`, dan dapat dibuat anonymous/arrow/callback/recursive. `require`/`include` memasukkan file lain. Scope menentukan tempat variable dapat diakses, sedangkan `&` membuat reference.**

---

# 48. Referensi Resmi

- **PHP Manual**  
  https://www.php.net/manual/en/

- **Language Reference**
  https://www.php.net/manual/en/langref.php

- **Types**
  https://www.php.net/manual/en/language.types.php

- **Variables**
  https://www.php.net/manual/en/language.variables.php

- **Constants**
  https://www.php.net/manual/en/language.constants.php

- **Operators**
  https://www.php.net/manual/en/language.operators.php

- **Control Structures**
  https://www.php.net/manual/en/language.control-structures.php

- **Functions**
  https://www.php.net/manual/en/language.functions.php

- **References Explained**
  https://www.php.net/manual/en/language.references.php

- **include**
  https://www.php.net/manual/en/function.include.php

> **Catatan versi:** Cheatsheet ini menggunakan sintaks PHP 8.x. Dokumentasi resmi saat ini mencakup PHP 8.x dan menyediakan migration guide untuk perubahan antar-versi.
