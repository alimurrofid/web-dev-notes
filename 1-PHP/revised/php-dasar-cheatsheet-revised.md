# PHP Dasar Cheatsheet Revised

> **Target:** PHP 8+ untuk pemula.
>
> Dokumen ini disusun sebagai **learning path**, bukan sekadar daftar syntax. Ikuti level secara berurutan. Bagian 🟡 dan 🔴 boleh dipelajari setelah fundamental kuat.
>
> Pola setiap materi sebisa mungkin: **konsep → contoh → output → hafalan → best practice**.

## Cara Belajar
```text
🟢 LEVEL 0 — Mulai PHP
🟢 LEVEL 1 — Fundamental
🟢 LEVEL 2 — Operator & Control Flow
🟢 LEVEL 3 — Array & String
🟢 LEVEL 4 — Function
🟡 LEVEL 5 — Function & Program Structure Lanjutan
🔴 LEVEL 6 — Advanced / Reference
🛠️ Mini Project
🎯 Roadmap
```

**Prioritas belajar:**

```text
🟢 Wajib sekarang
🟡 Pelajari setelah dasar
🔴 Advanced / reference
```

> Jangan mencoba menghafal semua function bawaan PHP. Pahami konsepnya terlebih dahulu; gunakan bagian Quick Reference saat membutuhkan syntax tertentu.

## Daftar Isi

### 🟢 Level 0 — Mulai PHP
1. [Pengenalan PHP](#bagian-1)
2. [Menginstall PHP](#bagian-2)
3. [Hello World](#bagian-3)
4. [Komentar](#bagian-4)

### 🟢 Level 1 — Fundamental
5. [Variable](#bagian-5)
6. [Constant](#bagian-6)
7. [Data Type](#bagian-7)
8. [String Dasar](#bagian-8)
9. [Array Dasar](#bagian-9)
10. [`var_dump()` dan Debugging Dasar](#bagian-10)
11. [Expression, Statement, dan Block](#bagian-11)

### 🟢 Level 2 — Operator & Control Flow
12. [Operator Aritmatika](#bagian-12)
13. [Operator Penugasan](#bagian-13)
14. [Operator Perbandingan](#bagian-14)
15. [Operator Logika](#bagian-15)
16. [Increment dan Decrement](#bagian-16)
17. [If / Else](#bagian-17)
18. [Ternary](#bagian-18)
19. [Null Coalescing](#bagian-19)
20. [Switch](#bagian-20)
21. [Match](#bagian-21)
22. [For](#bagian-22)
23. [While](#bagian-23)
24. [Do While](#bagian-24)
25. [Foreach](#bagian-25)
26. [Break dan Continue](#bagian-26)

### 🟢 Level 3 — Array & String
27. [Manipulasi String](#bagian-27)
28. [Array Functions](#bagian-28)
29. [String Functions](#bagian-29)
30. [Type Checking (`is_*`)](#bagian-30)

### 🟢 Level 4 — Function
31. [Function](#bagian-31)
32. [Parameter dan Argument](#bagian-32)
33. [Return Value](#bagian-33)
34. [Type Declaration](#bagian-34)
35. [Variable Scope](#bagian-35)

### 🟡 Level 5 — Function & Program Structure Lanjutan
36. [Anonymous Function](#bagian-36)
37. [Arrow Function](#bagian-37)
38. [Callback](#bagian-38)
39. [Variable Function](#bagian-39)
40. [Recursive Function](#bagian-40)
41. [Require dan Include](#bagian-41)

### 🔴 Level 6 — Advanced / Reference
42. [Operator Array](#bagian-42)
43. [Reference](#bagian-43)
44. [`goto`](#bagian-44)

### 🎯 Penutup
45. [Peta Ingatan Cepat](#bagian-45)
46. [Tabel Ringkasan](#bagian-46)
47. [Mini Project](#bagian-47)
48. [Kesalahan Umum Pemula](#bagian-48)
49. [Best Practice PHP Modern](#bagian-49)
50. [Roadmap Belajar](#bagian-50)
51. [Cheat Code PHP 10 Detik](#bagian-51)
52. [Referensi Resmi](#bagian-52)


---

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan PHP

PHP adalah bahasa scripting general-purpose yang sangat cocok untuk web dan dapat disisipkan ke dalam HTML.

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

PHP memiliki tipe built-in seperti `null`, `bool`, `int`, `float`, `string`, `array`, `object`, `callable`, dan `resource`.

**Hafalan:**

```text
PHP = kode dijalankan di server → hasil dikirim ke client
```

---


---

<a id="bagian-2"></a>

# 2. 🟢 Menginstall PHP

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


---

<a id="bagian-3"></a>

# 3. 🟢 Program Hello World

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


---

<a id="bagian-4"></a>

# 4. 🟢 Komentar

Komentar tidak dieksekusi sebagai kode.

## Single-line

```php
// Ini komentar
## Ini juga komentar
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
## komentar satu baris
/* */ komentar banyak baris
```

---


---

<a id="bagian-5"></a>

# 5. 🟢 Variable

Variable menyimpan nilai dan namanya diawali `$`.

```php
$name = "Budi";
$age = 20;
$isAdmin = false;
```

Diagram:

```text
$name    ──→ "Budi"
$age     ──→ 20
$isAdmin ──→ false
```

Nilai variable dapat berubah:

```php
$count = 10;
$count = 20;

echo $count;
```

Output:

```text
20
```

PHP bersifat dynamically typed secara default, sehingga sebuah variable dapat menyimpan nilai dengan tipe berbeda pada waktu berbeda.

```php
$value = 10;     // int
$value = "PHP";  // string
```

### Aturan nama variable

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

<a id="bagian-6"></a>

# 6. 🟢 Constant

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


---

<a id="bagian-7"></a>

# 7. 🟢 Data Type

PHP memiliki beberapa tipe data built-in yang penting untuk pemula:

```text
string
int
float
bool
null
array
object
```

Untuk PHP dasar, kuasai lima yang pertama terlebih dahulu.

### Number

```php
$age = 20;       // int
$price = 19.99;  // float
```

### Boolean

```php
$isLogin = true;
$isAdmin = false;
```

### String

```php
$name = "Budi";
```

### Null

```php
$user = null;
```

`null` berarti tidak ada nilai.

### Array

```php
$fruits = ["Apple", "Banana"];
```

**Hafalan:**

```text
20       → int
19.99    → float
true     → bool
"Budi"   → string
null     → tidak ada nilai
[...]    → array
```


---

<a id="bagian-8"></a>

# 8. 🟢 String Dasar

String adalah data berupa teks.

```php
$name = "Budi";
```

Single quote:

```php
$name = 'Budi';
```

Double quote:

```php
$name = "Budi";
```

## Interpolasi

Double quote dapat menginterpolasikan variable:

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
echo 'Halo $name';
```

Output:

```text
Halo $name
```

## Concatenation

Gunakan `.` untuk menggabungkan string:

```php
$first = "Budi";
$last = "Santoso";

echo $first . " " . $last;
```

Output:

```text
Budi Santoso
```

**Hafalan:**

```text
"..." → interpolation
.     → gabungkan string
```

> Detail string seperti heredoc/nowdoc dipelajari nanti di bagian manipulasi string.


---

<a id="bagian-9"></a>

# 9. 🟢 Array Dasar

Array digunakan untuk menyimpan beberapa nilai.

## Indexed array

```php
$fruits = [
    "Apple",
    "Banana",
    "Orange",
];

echo $fruits[0];
```

Output:

```text
Apple
```

Index dimulai dari `0`:

```text
0 → Apple
1 → Banana
2 → Orange
```

## Associative array

```php
$user = [
    "name" => "Budi",
    "age" => 20,
];

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

echo $users[0]["name"];
```

Output:

```text
Budi
```

Diagram:

```text
Array
├── indexed
│   ├── 0
│   ├── 1
│   └── 2
│
└── associative
    ├── name
    └── age
```

> Jangan menghafal array sebagai "kotak". Pahami bahwa array menyimpan kumpulan nilai yang dapat diakses menggunakan key.


---

<a id="bagian-10"></a>

# 10. 🟢 `var_dump()` dan Debugging Dasar

`var_dump()` menampilkan **nilai sekaligus tipe data**.

```php
$name = "Budi";
$age = 20;
$isAdmin = false;

var_dump($name);
var_dump($age);
var_dump($isAdmin);
```

Output:

```text
string(4) "Budi"
int(20)
bool(false)
```

Untuk array, `print_r()` juga berguna:

```php
$items = ["PHP", "HTML"];

print_r($items);
```

Cara mengingat:

```text
echo      → tampilkan nilai
var_dump  → nilai + tipe + detail
print_r   → struktur array/object lebih mudah dibaca
```

> Saat belajar, `var_dump()` sering lebih membantu daripada menebak-nebak isi variable.


---

<a id="bagian-11"></a>

# 11. 🟢 Expression, Statement, dan Block

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


---

<a id="bagian-12"></a>

# 12. 🟢 Operator Aritmatika

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


---

<a id="bagian-13"></a>

# 13. 🟢 Operator Penugasan

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


---

<a id="bagian-14"></a>

# 14. 🟢 Operator Perbandingan

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


---

<a id="bagian-15"></a>

# 15. 🟢 Operator Logika

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


---

<a id="bagian-16"></a>

# 16. 🟢 Increment dan Decrement

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


---

<a id="bagian-17"></a>

# 17. 🟢 If Statement

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


---

<a id="bagian-18"></a>

# 18. 🟢 Ternary Operator

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


---

<a id="bagian-19"></a>

# 19. 🟢 Null Coalescing Operator

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


---

<a id="bagian-20"></a>

# 20. 🟢 Switch Statement

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


---

<a id="bagian-21"></a>

# 21. 🟢 Match Expression

`match` tersedia sejak PHP 8 dan merupakan expression yang menghasilkan nilai.

```php
$role = "admin";

$message = match ($role) {
    "admin" => "Dashboard Admin",
    "user" => "Dashboard User",
    default => "Guest",
};

echo $message;
```

Output:

```text
Dashboard Admin
```

### `switch` vs `match`

```text
switch
→ statement
→ menggunakan case
→ umumnya memakai break
→ dapat berisi beberapa statement

match
→ expression
→ menghasilkan value
→ tidak fall-through
→ cocok untuk pemetaan sederhana
```

> Pelajari `switch` terlebih dahulu jika baru mengenal control flow. `match` adalah syntax modern yang berguna setelah konsep tersebut dipahami.


---

<a id="bagian-22"></a>

# 22. 🟢 For Loop

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


---

<a id="bagian-23"></a>

# 23. 🟢 While Loop

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


---

<a id="bagian-24"></a>

# 24. 🟢 Do While Loop

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


---

<a id="bagian-25"></a>

# 25. 🟢 Foreach Loop

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


---

<a id="bagian-26"></a>

# 26. 🟢 Break dan Continue

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


---

<a id="bagian-27"></a>

# 27. 🟢 Manipulasi String

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


---

<a id="bagian-28"></a>

# 28. 🟢 Array Functions

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


---

<a id="bagian-29"></a>

# 29. 🟢 String Functions

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


---

<a id="bagian-30"></a>

# 30. 🟢 Type Checking (`is_*`)

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


---

<a id="bagian-31"></a>

# 31. 🟢 Function

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


---

<a id="bagian-32"></a>

# 32. 🟢 Parameter dan Argument

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


---

<a id="bagian-33"></a>

# 33. 🟢 Return Value

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


---

<a id="bagian-34"></a>

# 34. 🟢 Type Declaration

Type declaration digunakan untuk menjelaskan tipe parameter dan return value.

```php
function add(int $a, int $b): int
{
    return $a + $b;
}

echo add(10, 5);
```

Output:

```text
15
```

Contoh string:

```php
function greet(string $name): string
{
    return "Halo $name";
}
```

Cara membaca:

```text
function add(int $a, int $b): int
              │              │
              │              └── return type
              └── parameter type
```

Type declaration membantu:

- membuat maksud function lebih jelas
- menangkap kesalahan tipe lebih awal
- membuat IDE/static analysis lebih membantu

> PHP tetap dynamically typed secara default. Type declaration adalah alat untuk membuat kontrak tipe lebih jelas, bukan berarti PHP berubah menjadi bahasa statically typed sepenuhnya.


---

<a id="bagian-35"></a>

# 35. 🟢 Variable Scope

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


---

<a id="bagian-36"></a>

# 36. 🟡 Anonymous Function

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


---

<a id="bagian-37"></a>

# 37. 🟡 Arrow Function

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


---

<a id="bagian-38"></a>

# 38. 🟡 Callback Function

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


---

<a id="bagian-39"></a>

# 39. 🟡 Variable Function

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


---

<a id="bagian-40"></a>

# 40. 🟡 Recursive Function

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


---

<a id="bagian-41"></a>

# 41. 🟡 Require dan Include

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


---

<a id="bagian-42"></a>

# 42. 🔴 Operator Array

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


---

<a id="bagian-43"></a>

# 43. 🔴 Reference

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


---

<a id="bagian-44"></a>

# 44. 🔴 `goto`

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

### Untuk pemula

`goto` **bukan bagian dari control flow yang perlu dipakai dalam program sehari-hari**.

Biasanya lebih mudah menggunakan:

```text
loop
function
if
```

daripada `goto`.

> Pelajari `goto` terutama untuk memahami kode PHP lama/legacy. Jangan menjadikannya pilihan pertama saat menulis kode baru.


---

<a id="bagian-45"></a>

# 45. 🧠 Peta Ingatan Cepat

## Fundamental

```text
variable
   ↓
menyimpan value
   ↓
value memiliki type
```

## Control flow

```text
if / else
→ pilih berdasarkan kondisi

ternary
→ versi singkat if / else

??
→ gunakan fallback ketika nilai null/tidak tersedia

switch / match
→ pilih dari beberapa kemungkinan

for / while / do while
→ ulangi kode

foreach
→ iterasi array
```

## Function

```text
function
  ↓
parameter
  ↓
argument
  ↓
return
  ↓
type declaration
```

## Struktur program

```text
require / include
→ menggunakan kode dari file lain
```

## Advanced

```text
reference
goto
variable function
recursive function
```

> Kuasai bagian 🟢 terlebih dahulu. Bagian 🔴 bukan syarat untuk mulai membuat aplikasi PHP.


---

<a id="bagian-46"></a>

# 46. 📚 Tabel Ringkasan

| Konsep | Hafalan |
|---|---|
| Variable | Data yang dapat berubah |
| Constant | Nilai konstan |
| `string` | Teks |
| `int` | Bilangan bulat |
| `float` | Bilangan desimal |
| `bool` | `true` / `false` |
| `null` | Tidak ada nilai |
| Array | Kumpulan nilai |
| `echo` | Menampilkan output |
| `var_dump()` | Nilai + tipe |
| `==` | Perbandingan nilai |
| `===` | Nilai + tipe |
| `&&` | AND |
| `||` | OR |
| `!` | NOT |
| `if` | Percabangan |
| `ternary` | Bentuk singkat `if/else` |
| `??` | Fallback jika null/tidak tersedia |
| `switch` | Pilihan berdasarkan satu nilai |
| `match` | Expression pilihan yang menghasilkan value |
| `for` | Loop dengan counter |
| `while` | Loop selama kondisi true |
| `do while` | Body dijalankan minimal sekali |
| `foreach` | Iterasi array |
| `break` | Keluar dari loop |
| `continue` | Lewati iterasi saat ini |
| `function` | Blok kode reusable |
| `parameter` | Variable pada definisi function |
| `argument` | Nilai saat function dipanggil |
| `return` | Mengembalikan nilai |
| `scope` | Area tempat variable dapat diakses |
| `require` | Memuat file; error dapat menghentikan eksekusi |
| `include` | Memuat file; error dapat memungkinkan eksekusi berlanjut |
| `&` | Reference |
| `goto` | Lompat ke label; jarang direkomendasikan |


---

<a id="bagian-47"></a>

# 47. 🛠️ Mini Project

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


---

<a id="bagian-48"></a>

# 48. ⚠️ Kesalahan Umum Pemula

## 1. Membandingkan dengan `==` tanpa memahami tipe

Lebih aman membiasakan:

```php
if ($age === 18) {
    // ...
}
```

daripada selalu menggunakan `==`.

## 2. Terlalu cepat memakai syntax advanced

Tidak perlu memulai dari:

```text
arrow function
callback
variable function
reference
goto
```

Kuasai dulu:

```text
variable
array
if
loop
function
```

## 3. Membuat function terlalu besar

Jika satu function melakukan terlalu banyak hal, pecah menjadi beberapa function yang memiliki tanggung jawab jelas.

## 4. Menggunakan `global` sebagai solusi utama

Jika sebuah function membutuhkan data dari luar, pertimbangkan mengirimkannya sebagai parameter.

Lebih jelas:

```php
function greet(string $name): string
{
    return "Halo $name";
}

echo greet("Budi");
```

daripada membuat function bergantung pada global state.

## 5. Tidak memberi type declaration

Jika tipe data sudah diketahui, biasakan menuliskannya:

```php
function add(int $a, int $b): int
{
    return $a + $b;
}
```

## 6. Menggunakan `goto` untuk alur normal

Gunakan struktur kontrol yang lebih mudah dibaca seperti `if`, loop, dan function.

## 7. Menghafal function tanpa memahami data yang diproses

Sebelum menghafal `array_map()` atau `array_filter()`, pahami dulu:

```text
array
↓
foreach
↓
function
```

Baru pelajari fungsi higher-order.


---

<a id="bagian-49"></a>

# 49. ⭐ Best Practice PHP Modern

Berikut kebiasaan yang baik untuk mulai dibangun sejak awal.

### 1. Gunakan `===` / `!==` secara default

```php
if ($value === 10) {
    // ...
}
```

### 2. Gunakan type declaration

```php
function calculate(int $price, int $qty): int
{
    return $price * $qty;
}
```

### 3. Pertimbangkan strict types

Di awal file PHP, Anda dapat menggunakan:

```php
<?php

declare(strict_types=1);
```

Ini membuat pemeriksaan tipe scalar pada pemanggilan function lebih ketat.

### 4. Gunakan nama variable yang jelas

Kurang jelas:

```php
$x = 10;
```

Lebih jelas:

```php
$maxAttempts = 10;
```

### 5. Hindari global state jika tidak diperlukan

Kirim dependency/data melalui parameter atau gunakan struktur program yang lebih jelas.

### 6. Pilih syntax yang paling mudah dibaca

Jangan memakai ternary untuk logic panjang:

```php
// Kurang jelas jika dibuat terlalu kompleks
$result = $a ? ($b ? "A" : "B") : "C";
```

Gunakan `if/else` jika logic menjadi sulit dibaca.

### 7. Jangan over-engineering

Pemula tidak perlu langsung memakai class, design pattern, callback, atau abstraction untuk program yang sederhana.

Belajar:

```text
data
→ condition
→ loop
→ function
```

terlebih dahulu.

### 8. Pisahkan learning syntax dari project architecture

`require`, namespace, OOP, Composer, framework, dan architecture akan lebih mudah dipahami setelah dasar PHP kuat.


---

<a id="bagian-50"></a>

# 50. 🧭 Urutan Belajar yang Disarankan

Jika mulai dari nol, gunakan urutan ini:

```text
PHP & CLI
   ↓
Variable
   ↓
Data Type
   ↓
Operator
   ↓
if / else
   ↓
ternary / ??
   ↓
switch / match
   ↓
loop
   ↓
array
   ↓
foreach
   ↓
string & array functions
   ↓
function
   ↓
parameter / argument
   ↓
return
   ↓
type declaration
   ↓
scope
   ↓
require/include
   ↓
mini project
   ↓
PHP OOP
```

Setelah nyaman:

```text
🟡 Anonymous Function
🟡 Arrow Function
🟡 Callback
🟡 Recursive Function
```

Kemudian:

```text
🔴 Reference
🔴 Variable Function
🔴 goto
```

Dan setelah PHP dasar:

```text
PHP OOP
↓
Namespace
↓
Composer
↓
Exception
↓
Database
↓
HTTP
↓
Framework
```

> Jangan naik level hanya karena sudah selesai membaca. Naik level ketika Anda sudah bisa membuat program kecil dengan konsep level sebelumnya.


---

<a id="bagian-51"></a>

# 51. ⚡ Cheat Code PHP 10 Detik

Kalau lupa semuanya, ingat alur ini:

```text
Variable
   ↓
Data
   ↓
Operator
   ↓
if / else
   ↓
loop
   ↓
array
   ↓
function
   ↓
program
```

Keyword utama:

```text
$        → variable
const    → constant
echo     → output
===      → strict comparison
if       → kondisi
? :      → ternary
??       → fallback null
switch   → pilihan
match    → pilihan yang menghasilkan value
for      → loop counter
while    → loop condition
foreach  → loop array
function → reusable logic
return   → kembalikan nilai
require  → muat file
```

**Kalimat inti:**

> PHP menerima data, memprosesnya dengan operator, mengambil keputusan dengan control flow, mengulang pekerjaan dengan loop, mengelompokkan data dengan array, dan mengelompokkan logic reusable dengan function.


---

<a id="bagian-52"></a>

# 52. 🔗 Referensi Resmi

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
