---
title: "PHP Dasar"
description: "Panduan lengkap PHP 8.x modern dari fundamental sintaks, kontrol alur, array, function, type declaration, hingga mental model server-side."
order: 1
tags:
  - programming
  - php
  - backend
  - fundamental
---

# PHP Dasar

> **Target:** Pemula yang baru mulai belajar pemrograman web dengan PHP modern (PHP 8.x).
> **Versi:** PHP 8.x (Modern PHP)
> Fokus modul pembelajaran ini: **mental model server-side → CLI server → sintaks & tag dasar → variable & data types → operator & control flow → loop → string & array functions → function & type declarations → variable scope → closures & callbacks → file inclusion (`require`/`include`) → references → mini project interaktif**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami sebelum masuk ke framework atau topik lanjutan

🟡 Lanjutan
→ pelajari setelah memahami control flow, array, dan function dasar

🔴 Advanced / Reference
→ penting untuk pemahaman mendalam, optimasi, dan referensi syntax
```

Mental model eksekusi PHP pada Web Server:

```text
       Browser HTTP Request (Client)
                     │
                     │ GET /index.php
                     ▼
       Web Server (Nginx / Apache / PHP CLI Server)
                     │
                     │ meneruskan request ke PHP Engine
                     ▼
       PHP Interpreter Engine (Zend Engine)
                     │
                     │ 1. Parsing & Kompilasi Opcode
                     │ 2. Eksekusi Logic & Query Database
                     │ 3. Generate Output Teks (HTML / JSON)
                     ▼
       HTTP Response (HTML / Plain Text)
                     │
                     │ dikirim kembali melalui network
                     ▼
       Browser me-render tampilan untuk User
```

**Hafalan:**

```text
PHP          → Server-side scripting: kode diproses di server, user hanya menerima hasil akhir
Tag PHP      → <?php ... ?> menandai area eksekusi kode PHP
Statement    → Setiap baris perintah PHP wajib diakhiri titik koma (;)
Variable     → Diawali tanda dollar ($name) dan bersifat case-sensitive
Output Teks  → echo atau print untuk mengirimkan teks ke response buffer
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan PHP & Mental Model Server-Side](#bagian-1)
2. [Menginstall & Menjalankan PHP CLI Server](#bagian-2)
3. [Program Hello World & Tag PHP](#bagian-3)
4. [Komentar & Dokumentasi Kode](#bagian-4)
5. [Variable & Naming Rules](#bagian-5)
6. [Constant (const & define)](#bagian-6)
7. [Data Types (Scalar & Compound)](#bagian-7)
8. [String Dasar, Heredoc & Nowdoc](#bagian-8)
9. [Array Dasar (Indexed & Associative)](#bagian-9)
10. [Debugging dengan var_dump() & print_r()](#bagian-10)
11. [Expression, Statement, dan Block](#bagian-11)
12. [Operator Aritmatika](#bagian-12)
13. [Operator Penugasan (Assignment)](#bagian-13)
14. [Operator Perbandingan (Strict vs Loose)](#bagian-14)
15. [Operator Logika](#bagian-15)
16. [Increment dan Decrement](#bagian-16)
17. [If, Elseif, Else Statement](#bagian-17)
18. [Ternary & Short Ternary Operator](#bagian-18)
19. [Null Coalescing Operator (?? & ??=)](#bagian-19)
20. [Switch Statement](#bagian-20)
21. [Match Expression (PHP 8+)](#bagian-21)
22. [For Loop](#bagian-22)
23. [While Loop](#bagian-23)
24. [Do While Loop](#bagian-24)
25. [Foreach Loop & Destructuring](#bagian-25)
26. [Break dan Continue](#bagian-26)
27. [Manipulasi String](#bagian-27)
28. [Array Functions Esensial](#bagian-28)
29. [String Functions Esensial](#bagian-29)
30. [Type Checking (is_*) & Type Casting](#bagian-30)
31. [Function Dasar & Deklarasi](#bagian-31)
32. [Parameter, Default Value & Named Arguments](#bagian-32)
33. [Return Value & Early Return](#bagian-33)
34. [Type Declaration (Scalar, Return, & Union)](#bagian-34)
35. [Variable Scope (Local, Global, Static)](#bagian-35)

### 🟡 Lanjutan

36. [Anonymous Function (Closure) & use Keyword](#bagian-36)
37. [Arrow Function (fn() =>)](#bagian-37)
38. [Callback Function & callable](#bagian-38)
39. [Variable Function](#bagian-39)
40. [Recursive Function](#bagian-40)
41. [File Inclusion (require, include, require_once)](#bagian-41)

### 🔴 Advanced / Reference

42. [Operator Array & Spread Operator (...)](#bagian-42)
43. [Reference (&) pada Variable & Parameter](#bagian-43)
44. [goto Operator](#bagian-44)

### 🛠️ Referensi & Praktik

45. [Peta Ingatan Cepat](#bagian-45)
46. [Tabel Ringkasan](#bagian-46)
47. [Cheat Code PHP 10 Detik](#bagian-47)
48. [Urutan Belajar yang Disarankan](#bagian-48)
49. [Mini Project: Aplikasi Kasir & Inventaris CLI Interaktif](#bagian-49)
50. [Referensi Resmi](#bagian-50)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan PHP & Mental Model Server-Side

#### Konsep

**PHP** (*Hypertext Preprocessor*) adalah bahasa pemrograman yang berjalan di sisi server (*server-side*).

Bayangkan seperti dapur restoran:
- Kode PHP bekerja di dapur (server) untuk memasak dan memproses data.
- Pelanggan di meja makan (browser/user) hanya menerima hidangan yang sudah jadi (tampilan HTML atau data JSON), tanpa pernah melihat proses atau resep rahasia di dapurnya.

Ciri khas utama PHP:
- **Server-Side:** Kode program berjalan di server, pengunjung website hanya menerima hasil akhirnya.
- **Tipe Data Otomatis (*Dynamically Typed*):** Kita tidak perlu repot mendeklarasikan tipe data secara manual, PHP akan menebaknya otomatis.
- **Bisa Disisipkan ke HTML:** Kode PHP bisa langsung dimasukkan ke dalam file HTML.
- **Ekosistem Sangat Luas:** Menjadi fondasi WordPress, Laravel, dan jutaan website di seluruh dunia.

#### Contoh

```php
<?php

$namaAplikasi = "Belajar PHP Modern";
$tahun = 2026;

echo "Selamat datang di $namaAplikasi ($tahun)!";
```

#### Output

```text
Selamat datang di Belajar PHP Modern (2026)!
```

#### Cara Kerja

```text
       Browser User
            │
            │ Request URL (misal: http://localhost:8000)
            ▼
       Server PHP
            │
            │ 1. Membaca file script PHP
            │ 2. Mengeksekusi variabel & logika echo
            │ 3. Menyusun output teks
            ▼
       Response Hasil ke Browser
            │
            ▼
       "Selamat datang di Belajar PHP Modern (2026)!"
```

**Hafalan:**

```text
Server-side  → Kode dijalankan di server sebelum halaman dikirim ke browser
Dynamic type → Variabel bisa berganti tipe data secara otomatis saat runtime
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Simpan file dengan ekstensi `.php` dan selalu gunakan tag pembuka standar `<?php`.
- ❌ **Kesalahan Umum:** Mengira kode PHP bisa dilihat langsung melalui fitur *Inspect Element* / *View Page Source* di browser (kode PHP dieksekusi di server, hanya outputnya yang sampai ke client).

---

<a id="bagian-2"></a>

## 2. 🟢 Menginstall & Menjalankan PHP CLI Server

#### Konsep

Untuk menjalankan file PHP di komputer, kita bisa menggunakan terminal (*command line*).

Kabar baiknya, PHP sudah menyediakan **server lokal bawaan (*Built-in Web Server*)**. Artinya, saat baru belajar kita tidak perlu menginstall software web server tambahan yang berat (seperti Apache atau Nginx)—cukup ketik satu perintah di terminal, dan web server lokal langsung siap digunakan.

#### Contoh Perintah Terminal

Cek versi PHP di terminal:

```bash
php -v
```

Output:

```text
PHP 8.3.0 (cli) (built: Nov 21 2023 14:00:00) (NTS)
```

Menjalankan file script tunggal:

```bash
php index.php
```

Menjalankan built-in web server:

```bash
php -S localhost:8000
```

#### Cara Kerja

```text
       Terminal / Command Prompt
                 │
                 │ php -S localhost:8000
                 ▼
       Built-in Web Server Aktif
                 │
                 │ Buka Browser: http://localhost:8000
                 ▼
       Server otomatis menyajikan file index.php di folder aktif
```

**Hafalan:**

```text
php -v               → Periksa versi PHP aktif
php script.php       → Jalankan script langsung di terminal
php -S host:port     → Jalankan development web server lokal
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan `php -S localhost:8000` untuk uji coba lokal harian yang cepat dan ringan.
- ❌ **Kesalahan Umum:** Menggunakan built-in development server untuk aplikasi *production* di internet publik.

---

<a id="bagian-3"></a>

## 3. 🟢 Program Hello World & Tag PHP

#### Konsep

Agar server tahu bahwa suatu baris adalah instruksi PHP, kode wajib diawali dengan tag pembuka `<?php`.

Aturan penting tag PHP:
- **File PHP Murni:** Jika file hanya berisi kode PHP saja, **jangan tutup dengan `?>` di akhir file**. Ini adalah standar industri untuk mencegah spasi atau baris kosong liar yang bisa merusak response website.
- **Campur dengan HTML:** Jika menyisipkan PHP di tengah-tengah dokumen HTML, barulah kita wajib menutupnya dengan `?>` atau menggunakan jalan pintas cetak `<?= $variabel ?>`.

#### Contoh

File murni PHP (`app.php`):

```php
<?php

echo "Hello, World!";
```

File campuran HTML dan PHP (`view.php`):

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <title>Hello PHP</title>
</head>
<body>
    <h1><?php echo "Hello World dari PHP!"; ?></h1>
    <p>Nama: <?= "Budi Santoso" ?></p>
</body>
</html>
```

#### Output

```text
Hello, World!
```

#### Cara Kerja

```text
                     File Input
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
   Teks HTML Biasa                Tag <?php ... ?>
        │                                 │
        ▼                                 ▼
   Langsung ke output             Dieksekusi oleh PHP Engine
        │                                 │
        └────────────────┬────────────────┘
                         │
                         ▼
                   Output Buffer
```

**Hafalan:**

```text
<?php              → Pembuka blok kode PHP
echo $value        → Mencetak satu atau beberapa nilai ke output buffer
<?= $value ?>      → Short echo tag (singkatan dari <?php echo $value; ?>)
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Hapus tag penutup `?>` di baris terakhir file jika file tersebut hanya berisi kode PHP murni (PSR-12 coding standard).
- ❌ **Kesalahan Umum:** Lupa titik koma `;` di akhir statement `echo`.

---

<a id="bagian-4"></a>

## 4. 🟢 Komentar & Dokumentasi Kode

#### Konsep

Komentar adalah catatan pengingat di dalam kode yang **tidak akan dijalankan oleh komputer**.

Fungsi komentar:
- Menjelaskan *mengapa* suatu baris kode dibuat (bukan hanya apa yang dilakukannya).
- Menulis catatan pengingat (*TODO*).
- Mematikan baris kode tertentu untuk sementara waktu saat mencari error (*debugging*).

PHP menyediakan 3 cara menulis komentar:
1. `//` untuk komentar pendek 1 baris.
2. `#` untuk komentar pendek 1 baris (gaya shell/terminal).
3. `/* ... */` untuk komentar panjang yang terdiri dari banyak baris.

#### Contoh

```php
<?php

// 1. Ini komentar satu baris
# Ini juga komentar satu baris

/*
   2. Ini komentar multi-baris.
   Sangat cocok untuk penjelasan panjang,
   arsitektur logic, atau dokumentasi fungsi.
*/

$total = 100000; // Komentar inline di ujung baris
echo $total;
```

#### Output

```text
100000
```

#### Cara Kerja

```text
                  PHP Parser Engine
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
   Simbol Komentar                Statement Valid
   (//, #, /* ... */)             ($total = 100000;)
        │                                 │
        ▼                                 ▼
   Diabaikan dari AST             Dikonversi ke Opcode
                                          │
                                          ▼
                                      Eksekusi
```

**Hafalan:**

```text
// text          → Komentar satu baris
# text           → Komentar satu baris alternatif
/* text */       → Komentar multi-baris
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Tulis komentar yang menjelaskan *alasan* (WHY) di balik sebuah keputusan logika, bukan sekadar mengulang apa yang ditulis kode (WHAT).
- ❌ **Kesalahan Umum:** Membiarkan blok kode mati (*commented-out code*) berserakan di repository tanpa alasan jelas.

---

<a id="bagian-5"></a>

## 5. 🟢 Variable & Naming Rules

#### Konsep

Variabel adalah sebuah wadah untuk menyimpan data sementara di memori komputer. Isi dari wadah ini bisa kita ganti kapan saja sepanjang program berjalan.

Di PHP, nama variabel **selalu diawali tanda dollar (`$`)** dan bersifat *case-sensitive* (huruf besar dan kecil dianggap berbeda, misalnya `$nama` tidak sama dengan `$Nama`).

Aturan penamaan variabel:
- Wajib diawali huruf (`a-z`, `A-Z`) atau garis bawah (`_`), setelah tanda `$`.
- Tidak boleh diawali angka (contoh salah: `$1user` ❌).
- Tidak boleh mengandung spasi atau tanda minus (contoh salah: `$user name` ❌, `$user-name` ❌).
- Standar penulisan modern: gunakan format **camelCase** (contoh: `$totalBelanja`, `$namaLengkap`).

#### Contoh

```php
<?php

$namaLengkap = "Budi Santoso";
$umur = 25;
$isMember = true;

// Mengubah nilai variabel (reassignment)
$umur = 26;

echo "Nama: " . $namaLengkap . ", Umur: " . $umur;
```

#### Output

```text
Nama: Budi Santoso, Umur: 26
```

#### Cara Kerja

```text
       Deklarasi Awal: $umur = 25
              │
              ▼
       Alokasi memori lokal zval (type: int, value: 25)
              │
              ▼ Reassignment: $umur = 26
       Update memori zval (type: int, value: 26)
              │
              ▼
       echo $umur ──> Baca memori ──> Output: 26
```

**Hafalan:**

```text
$variableName = $value  → Deklarasi dan inisialisasi variabel di memori
$userName               → Standar penamaan camelCase yang disarankan
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan nama variabel yang deskriptif dan mencerminkan isinya (`$isLoggedIn`, `$productPrice`, `$customerList`).
- ❌ **Kesalahan Umum:** Menggunakan variabel 1 huruf yang ambigu seperti `$x`, `$a`, `$tmp` untuk data penting aplikasi.

---

<a id="bagian-6"></a>

## 6. 🟢 Constant (`const` & `define`)

#### Konsep

**Constant (Konstanta)** adalah sebuah nilai yang **tidak dapat diubah** setelah didefinisikan. Jika variabel nilainya bisa diganti-ganti, nilai konstanta akan selalu tetap sama di seluruh aplikasi.

Dua cara membuat konstanta di PHP:
1. `const NAMA_KONSTANTA = nilai;` — Cara modern dan lebih cepat, bisa digunakan di file biasa maupun di dalam *class*.
2. `define('NAMA_KONSTANTA', nilai);` — Cara fleksibel saat program sedang berjalan (*runtime*), bisa diletakkan di dalam percabangan `if`.

Standar penamaan konstanta: selalu gunakan **HURUF_KAPITAL_BESAR** yang dipisah garis bawah (`UPPER_SNAKE_CASE`), dan tidak menggunakan tanda dollar (`$`).

#### Contoh

```php
<?php

// Gaya modern (compile-time)
const APP_NAME = "Toko Online";
const MAX_LOGIN_ATTEMPTS = 3;

// Gaya runtime
define("DB_PORT", 3306);

echo APP_NAME . " (Max login: " . MAX_LOGIN_ATTEMPTS . ", Port: " . DB_PORT . ")";
```

#### Output

```text
Toko Online (Max login: 3, Port: 3306)
```

#### Perbandingan: Variable vs Constant

```text
       Variabel ($nama)                  Konstanta (APP_NAME)
               │                                   │
               ▼                                   ▼
       Diawali tanda '$'                 Tanpa tanda '$'
               │                                   │
               ▼                                   ▼
       Nilai dapat diubah                Nilai permanen (Read-Only)
               │                                   │
               ▼                                   ▼
       Local / Function Scope            Otomatis Global Scope
```

**Hafalan:**

```text
const NAME = $value          → Definisi konstanta compile-time (modern & cepat)
define('NAME', $value)       → Definisi konstanta runtime (bisa di dalam if)
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan `const` sebagai pilihan utama dan gunakan huruf kapital dengan pemisah garis bawah (`API_KEY`, `BASE_URL`).
- ❌ **Kesalahan Umum:** Menambahkan tanda `$` saat memanggil konstanta (misal: `$APP_NAME` ❌, seharusnya `APP_NAME` ✅).

---

<a id="bagian-7"></a>

## 7. 🟢 Data Types (Scalar & Compound)

#### Konsep

Tipe data adalah jenis informasi yang bisa disimpan dan diproses oleh PHP. Secara umum dibagi menjadi 3 kelompok:

1. **Scalar Types (Menyimpan 1 nilai saja):**
   - `bool` : Nilai kebenaran, hanya ada dua pilihan: `true` (benar) atau `false` (salah).
   - `int` : Bilangan bulat tanpa koma desimal (`10`, `-5`, `0`).
   - `float` / `double` : Bilangan pecahan berkoma (`3.14`, `0.5`).
   - `string` : Teks atau kumpulan huruf/karakter (`"PHP"`, `'Dasar'`).
2. **Compound Types (Menyimpan banyak nilai sekaligus):**
   - `array` : Kumpulan data dalam satu daftar.
   - `object` : Struktur data cetakan dari class (pada konsep OOP).
3. **Special Types (Tipe Khusus):**
   - `null` : Variabel kosong yang belum memiliki nilai.
   - `resource` : Penghubung ke sumber daya luar sistem (seperti koneksi database atau file yang sedang dibuka).

#### Contoh

```php
<?php

$nama = "Andi";            // string
$usia = 21;                // int
$berat = 65.5;             // float
$isAktif = true;           // bool
$catatan = null;           // null
$hobi = ["Coding", "Baca"];// array

echo gettype($nama) . PHP_EOL;
echo gettype($usia) . PHP_EOL;
echo gettype($berat) . PHP_EOL;
echo gettype($isAktif) . PHP_EOL;
echo gettype($catatan) . PHP_EOL;
```

#### Output

```text
string
integer
double
boolean
NULL
```

#### Hirarki Tipe Data PHP

```text
                      Tipe Data PHP
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
     SCALAR              COMPOUND            SPECIAL
   (Tunggal)            (Koleksi)           (Khusus)
        │                   │                   │
   int, float,         array, object       null, resource
   string, bool
```

**Hafalan:**

```text
int       → Bilangan bulat (1, 2, -10)
float     → Bilangan pecahan desimal (3.14, 0.99)
bool      → True atau false
string    → Teks diapit petik ("abc", 'abc')
null      → Representasi nilai kosong tanpa tipe
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Ketahui perbedaan antara integer `0`, string `"0"`, string kosong `""`, dan `null` saat pengecekan kondisi.
- ❌ **Kesalahan Umum:** Membandingkan angka float dengan `===` secara langsung tanpa toleransi pembulatan (*epsilon*) karena presisi aritmatika biner float.

---

<a id="bagian-8"></a>

## 8. 🟢 String Dasar, Heredoc & Nowdoc

#### Konsep

String adalah teks yang diapit tanda petik. PHP menyediakan 4 cara penulisan string sesuai kebutuhan:

1. **Petik Tunggal (`'...'`):** Menampilkan teks apa adanya. Variabel di dalamnya tidak akan dibaca (misalnya `$nama` tetap tercetak sebagai teks `$nama`).
2. **Petik Ganda (`"..."`):** Teks pintar yang bisa langsung membaca isi variabel di dalamnya (*interpolasi*), serta mengenali simbol khusus seperti baris baru (`\n`).
3. **Heredoc (`<<<TAG ... TAG;`):** Untuk menulis teks panjang yang terdiri dari banyak baris dan tetap bisa membaca isi variabel.
4. **Nowdoc (`<<<'TAG' ... TAG;`):** Untuk menulis teks panjang banyak baris apa adanya secara murni tanpa membaca variabel (seperti petik tunggal versi panjang).

#### Contoh

```php
<?php

$bahasa = "PHP";

// Single vs Double Quote
echo 'Belajar $bahasa\n'; // Tidak diinterpolasi
echo PHP_EOL;
echo "Belajar $bahasa\n"; // Diinterpolasi

// Heredoc (mendukung variabel)
$templateEmail = <<<EMAIL
Halo Pembaca,
Selamat belajar $bahasa di cheatsheet ini!
EMAIL;

// Nowdoc (literal tanpa variabel)
$rawCode = <<<'CODE'
Gunakan syntax $bahasa untuk menulis kode.
CODE;

echo $templateEmail . PHP_EOL;
echo $rawCode;
```

#### Output

```text
Belajar $bahasa\n
Belajar PHP
Halo Pembaca,
Selamat belajar PHP di cheatsheet ini!
Gunakan syntax $bahasa untuk menulis kode.
```

#### Evaluasi Teks String

```text
       Double Quote / Heredoc            Single Quote / Nowdoc
                 │                                 │
                 ▼                                 ▼
       Scan variabel ($bahasa)           Teks murni apa adanya
                 │                                 │
                 ▼                                 ▼
       Gantikan dengan isi variabel      Tidak ada interpolasi
                 │                                 │
                 ▼                                 ▼
       "Belajar PHP"                     'Belajar $bahasa'
```

**Hafalan:**

```text
'text'             → Single quote: literal murni, variabel tidak dibaca
"text $var"        → Double quote: membaca isi variabel di dalam teks
<<<TAG ... TAG     → Heredoc: multi-baris + interpolasi variabel
<<<'TAG' ... TAG   → Nowdoc: multi-baris literal tanpa interpolasi variabel
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan kurung kurawal `{$variable}` saat interpolasi variabel kompleks di dalam double quote (contoh: `"Total: {$item->price}"`).
- ❌ **Kesalahan Umum:** Menaruh spasi atau karakter liar setelah tag penutup Heredoc/Nowdoc.

---

<a id="bagian-9"></a>

## 9. 🟢 Array Dasar (Indexed & Associative)

#### Konsep

Array adalah variabel super yang bisa menyimpan banyak data sekaligus dalam satu wadah (seperti daftar belanja).

Di PHP, ada dua jenis array utama:
1. **Indexed Array (Daftar Berurutan):** Datanya diberi nomor urut otomatis (*index*) yang dimulai dari angka `0`.
2. **Associative Array (Daftar Berlabel):** Datanya diberi label nama (*key*) berupa teks yang memiliki arti jelas, seperti `'nama'`, `'email'`, atau `'harga'`.

Penulisan modern selalu menggunakan tanda kurung siku `[]` yang ringkas dan bersih.

#### Contoh

```php
<?php

// 1. Indexed Array
$daftarBuah = ["Apel", "Jeruk", "Mangga"];
echo "Buah pertama: " . $daftarBuah[0] . PHP_EOL;

// Menambah elemen baru ke index terakhir
$daftarBuah[] = "Pisang";

// 2. Associative Array
$pengguna = [
    "username" => "budisantoso",
    "email" => "budi@example.com",
    "role" => "Admin"
];

echo "Role: " . $pengguna["role"] . PHP_EOL;

// 3. Array Bersarang (Multidimensional)
$daftarProduk = [
    ["id" => 1, "nama" => "Laptop", "harga" => 12000000],
    ["id" => 2, "nama" => "Mouse", "harga" => 250000],
];

echo "Produk 1: " . $daftarProduk[0]["nama"];
```

#### Output

```text
Buah pertama: Apel
Role: Admin
Produk 1: Laptop
```

#### Struktur Key-Value Array

```text
       Indexed Array (Key Angka)         Associative Array (Key String)
       ┌─────┬──────────┐                ┌────────────┬──────────────────┐
       │  0  │ "Apel"   │                │ "username" │ "budisantoso"    │
       │  1  │ "Jeruk"  │                │ "email"    │ "budi@gmail.com" │
       │  2  │ "Mangga" │                │ "role"     │ "Admin"          │
       └─────┴──────────┘                └────────────┴──────────────────┘
```

**Hafalan:**

```text
$array = ['a', 'b']          → Indexed array (akses: $array[0])
$array = ['key' => 'value']  → Associative array (akses: $array['key'])
$array[] = $value            → Menambahkan elemen baru ke index paling belakang
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan associative array jika kumpulan data memiliki atribut dengan makna jelas (`name`, `price`, `status`).
- ❌ **Kesalahan Umum:** Mengakses key yang tidak terdefinisi (`$pengguna["alamat"]`) tanpa pengecekan, yang menghasilkan pesan *Warning: Undefined array key*.

---

<a id="bagian-10"></a>

## 10. 🟢 Debugging dengan `var_dump()` & `print_r()`

#### Konsep

Saat membuat program, sering kali ada data yang tidak tampil seperti perkiraan kita. Untuk mencari penyebabnya (*debugging*), PHP menyediakan fungsi "kaca pembesar" bawaan untuk mengintip isi variabel:

- `var_dump($variable)` : Menampilkan isi variabel secara sangat detail, lengkap dengan jenis tipe data dan panjang karakternya (sangat cocok saat mencari bug tipe data).
- `print_r($variable)` : Menampilkan susunan array atau objek dalam format yang lebih ringkas dan nyaman dibaca manusia.

#### Contoh

```php
<?php

$data = [
    "nama" => "Budi",
    "skor" => 95,
    "lulus" => true
];

echo "--- Hasil print_r ---" . PHP_EOL;
print_r($data);

echo PHP_EOL . "--- Hasil var_dump ---" . PHP_EOL;
var_dump($data);
```

#### Output

```text
--- Hasil print_r ---
Array
(
    [nama] => Budi
    [skor] => 95
    [lulus] => 1
)

--- Hasil var_dump ---
array(3) {
  ["nama"]=>
  string(4) "Budi"
  ["skor"]=>
  int(95)
  ["lulus"]=>
  bool(true)
}
```

#### Cara Kerja Debugging

```text
                  Variabel Input ($data)
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
     print_r()                               var_dump()
        │                                       │
        ▼                                       ▼
   Struktur Pohon Ringkas                  Metadata Tipe + Panjang + Nilai
   (Cepat & Mudah Dibaca)                  (Sangat Rinci & Diagnostik Bug)
```

**Hafalan:**

```text
var_dump($value)   → Debugging mendalam (menampilkan tipe data & ukuran)
print_r($value)    → Debugging cepat yang mudah dibaca manusia
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan `var_dump()` saat mendiagnosis bug tipe data (misal: membedakan boolean `false`, string `"0"`, dan integer `0`).
- ❌ **Kesalahan Umum:** Lupa menghapus baris `var_dump()` saat kode dirilis ke server production.

---

<a id="bagian-11"></a>

## 11. 🟢 Expression, Statement, dan Block

#### Konsep

Memahami 3 istilah dasar ini akan membuat Anda jauh lebih mudah membaca penjelasan kode:

1. **Expression (Ekspresi):** Segala potongan kode yang menghasilkan suatu nilai (misalnya `5 + 2`, `100`, atau `$a > 10`).
2. **Statement (Pernyataan):** Satu baris instruksi utuh yang memerintahkan komputer melakukan sesuatu, selalu diakhiri tanda titik koma `;` (misalnya `$total = 5 + 2;`).
3. **Block (Blok Kode):** Kumpulan beberapa baris instruksi yang dibungkus bersama di dalam tanda kurung kurawal `{ ... }` untuk dijalankan sebagai satu kesatuan.

#### Contoh

```php
<?php

// Expression: 10 + 5 menghasilkan 15
// Statement: seluruh baris penugasan diakhiri ;
$total = 10 + 5;

// Block: kumpulan statement di dalam { ... }
if ($total > 10) {
    $diskon = 2000;
    $bayar = $total - $diskon;
    echo "Total bayar: " . $bayar;
}
```

#### Output

```text
Total bayar: 13
```

#### Cara Kerja

```text
       Expression (10 + 5)
              │
              ▼ dievaluasi menghasilkan nilai (15)
       Statement ($total = 15;)
              │
              ▼ dieksekusi dalam urutan instruksi
       Block { statement 1; statement 2; }
```

**Hafalan:**

```text
Expression → Menghasilkan sebuah nilai (misal: $a > 5, 2 * 3)
Statement  → Satu baris instruksi utuh yang diakhiri tanda titik koma (;)
Block      → Kumpulan statement yang dibungkus kurung kurawal { ... }
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Berikan indentasi 4 spasi yang rapi di dalam setiap blok kurung kurawal untuk kemudahan membaca alur kode.
- ❌ **Kesalahan Umum:** Meletakkan titik koma `;` langsung setelah tanda kurung kondisi `if ($a > 10); { ... }` yang menyebabkan blok kode selalu tereksekusi.

---

<a id="bagian-12"></a>

## 12. 🟢 Operator Aritmatika

#### Konsep

Operator aritmatika adalah simbol-simbol matematika dasar yang kita gunakan untuk melakukan perhitungan angka pada PHP:

- `+` : Penjumlahan (tambah)
- `-` : Pengurangan (kurang)
- `*` : Perkalian (kali)
- `/` : Pembagian (bagi)
- `%` : Modulo (sisa dari hasil pembagian, misalnya `10 % 3` bersisa `1`)
- `**` : Pangkat (misalnya `2 ** 3` artinya 2 pangkat 3 = 8)

#### Contoh

```php
<?php

$a = 10;
$b = 3;

echo "Tambah: " . ($a + $b) . PHP_EOL;
echo "Kurang: " . ($a - $b) . PHP_EOL;
echo "Kali: " . ($a * $b) . PHP_EOL;
echo "Bagi: " . ($a / $b) . PHP_EOL;
echo "Sisa Bagi: " . ($a % $b) . PHP_EOL;
echo "Pangkat: " . ($a ** $b) . PHP_EOL;
```

#### Output

```text
Tambah: 13
Kurang: 7
Kali: 30
Bagi: 3.3333333333333
Sisa Bagi: 1
Pangkat: 1000
```

#### Cara Kerja

```text
       Operasi Modulo: 10 % 3
                 │
                 ▼
       10 dibagi 3 = 3 (3 x 3 = 9)
                 │
                 ▼
       Sisa Pembagian = 1
```

**Hafalan:**

```text
$a + $b     → Penjumlahan
$a - $b     → Pengurangan
$a * $b     → Perkalian
$a / $b     → Pembagian
$a % $b     → Modulo (sisa pembagian)
$a ** $b    → Pangkat ($a pangkat $b)
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan tanda kurung `(...)` untuk memperjelas urutan prioritas operasi matematika jika ekspresi cukup panjang.
- ❌ **Kesalahan Umum:** Melakukan operasi pembagian dengan angka 0 (`$a / 0`), yang menghasilkan `DivisionByZeroError` di PHP 8+.

---

<a id="bagian-13"></a>

## 13. 🟢 Operator Penugasan (Assignment)

#### Konsep

Operator penugasan (*assignment*) digunakan untuk memasukkan suatu nilai ke dalam variabel.

Simbol dasarnya adalah sama dengan (`=`). Selain itu, PHP menyediakan jalan pintas operator gabungan agar kita tidak perlu mengetik nama variabel dua kali saat ingin menambah atau mengubah nilainya:
- `$total += 5000` (artinya: `$total = $total + 5000`)
- `$teks .= " dunia"` (artinya: menyambung teks baru ke ujung teks lama)

#### Contoh

```php
<?php

$saldo = 100000;

$saldo += 50000;  // Sama dengan: $saldo = $saldo + 50000
$saldo -= 20000;  // Sama dengan: $saldo = $saldo - 20000
$saldo *= 2;       // Sama dengan: $saldo = $saldo * 2

$teks = "Selamat ";
$teks .= "Datang!"; // Menggabungkan string (concatenation)

echo "Saldo: " . $saldo . PHP_EOL;
echo "Pesan: " . $teks;
```

#### Output

```text
Saldo: 260000
Pesan: Selamat Datang!
```

#### Alur Eksekusi Assignment

```text
       $saldo += 50000
             │
             ▼
       Baca nilai $saldo saat ini (100000)
             │
             ▼
       Tambahkan 50000 (100000 + 50000 = 150000)
             │
             ▼
       Simpan kembali ke $saldo ($saldo = 150000)
```

**Hafalan:**

```text
$a += $value     → Tambahkan $value ke $a ($a = $a + $value)
$a -= $value     → Kurangkan $value dari $a ($a = $a - $value)
$a *= $value     → Kalikan $a dengan $value
$a /= $value     → Bagikan $a dengan $value
$a .= $value     → Gabungkan teks string $value ke $a
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan `$string .= "teks"` untuk menyusun teks panjang di dalam perulangan agar kode lebih ringkas.
- ❌ **Kesalahan Umum:** Tertukar antara penugasan `=` dengan perbandingan kesamaan `==` di dalam kondisi `if`.

---

<a id="bagian-14"></a>

## 14. 🟢 Operator Perbandingan (Strict vs Loose)

#### Konsep

Operator perbandingan digunakan untuk membandingkan dua nilai. Hasilnya selalu berupa nilai kebenaran: `true` (benar) atau `false` (salah).

Perbedaan paling penting di PHP:
- **Strict Comparison (`===` dan `!==`):** Mengecek **nilai dan tipe datanya** secara ketat. Angka `100` tidak sama dengan teks `"100"`. Ini adalah standar yang **wajib selalu digunakan**.
- **Loose Comparison (`==` dan `!=`):** Hanya mengecek nilainya saja dan mencoba mengubah tipe data secara otomatis. Cara ini rawan menimbulkan celah bug yang sulit dilacak.

Operator lainnya mencakup `<`, `>`, `<=`, `>=`, serta spaceship operator (`<=>`) untuk perbandingan tiga arah (`-1`, `0`, `1`).

#### Contoh

```php
<?php

$angka = 100;
$teks = "100";

// Loose comparison
var_dump($angka == $teks);  // bool(true) karena nilainya dianggap sama

// Strict comparison (SANGAT DIREKOMENDASIKAN)
var_dump($angka === $teks); // bool(false) karena int !== string

// Spaceship operator
echo (5 <=> 10) . PHP_EOL;  // -1 (kiri lebih kecil)
echo (10 <=> 10) . PHP_EOL; //  0 (sama besar)
echo (15 <=> 10) . PHP_EOL; //  1 (kiri lebih besar)
```

#### Output

```text
bool(true)
bool(false)
-1
0
1
```

#### Perbandingan Loose vs Strict

```text
       Operasi           Hasil Loose (==)     Hasil Strict (===)
       ──────────────────────────────────────────────────────────
       100 == "100"      true                 false (int vs string)
       0 == false        true                 false (int vs bool)
       "" == null        true                 false (string vs null)
```

**Hafalan:**

```text
$a === $b        → Identik: sama nilai dan sama tipe data (wajib default)
$a !== $b        → Tidak identik: beda nilai atau beda tipe data
$a <=> $b        → Spaceship: -1 ($a < $b), 0 ($a == $b), 1 ($a > $b)
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** **Selalu gunakan `===` dan `!==` secara default** untuk mencegah bug akibat konversi tipe data otomatis.
- ❌ **Kesalahan Umum:** Menggunakan `==` untuk membandingkan output fungsi pencarian (seperti `strpos()`), padahal index `0` bisa salah diartikan sebagai `false`.

---

<a id="bagian-15"></a>

## 15. 🟢 Operator Logika

#### Konsep

Operator logika digunakan saat kita perlu menggabungkan beberapa syarat/kondisi sekaligus:

- `&&` (**AND** / DAN) : Bernilai `true` **hanya jika semua syarat terpenuhi**.
- `||` (**OR** / ATAU) : Bernilai `true` **jika minimal salah satu syarat terpenuhi**.
- `!` (**NOT** / BUKAN) : Membalikkan kondisi (mengubah `true` jadi `false`, atau sebaliknya).
- `xor` : Bernilai `true` jika salah satu benar, tapi `false` jika keduanya benar.

> Selalu gunakan simbol `&&` dan `||` daripada kata `and` / `or` karena urutan eksekusinya jauh lebih aman dan konsisten.

#### Contoh

```php
<?php

$sudahLogin = true;
$role = "admin";
$umur = 20;

// AND (&&)
if ($sudahLogin && $role === "admin") {
    echo "Akses menu manajemen diizinkan." . PHP_EOL;
}

// OR (||)
if ($role === "admin" || $umur >= 21) {
    echo "Boleh masuk ruangan khusus." . PHP_EOL;
}

// NOT (!)
$isBanned = false;
if (!$isBanned) {
    echo "Akun dalam status aktif.";
}
```

#### Output

```text
Akses menu manajemen diizinkan.
Boleh masuk ruangan khusus.
Akun dalam status aktif.
```

#### Tabel Kebenaran

```text
       Kondisi A     Kondisi B     A && B (AND)     A || B (OR)
       ────────────────────────────────────────────────────────
       true          true          true             true
       true          false         false            true
       false         true          false            true
       false         false         false            false
```

**Hafalan:**

```text
$conditionA && $conditionB   → AND: true jika kedua kondisi bernilai true
$conditionA || $conditionB   → OR: true jika salah satu kondisi bernilai true
!$condition                  → NOT: negasi / pembalik nilai kebenaran
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Selalu gunakan simbol `&&` dan `||` daripada kata kunci `and` / `or` karena memiliki tingkat prioritas operator (*precedence*) yang lebih aman dan standar.
- ❌ **Kesalahan Umum:** Mengabaikan evaluasi *short-circuit* (PHP langsung berhenti mengecek kondisi kedua jika kondisi pertama pada `&&` bernilai `false`).

---

<a id="bagian-16"></a>

## 16. 🟢 Increment dan Decrement

#### Konsep

Operator increment (`++`) adalah jalan pintas untuk menambah angka sebanyak `1`, sedangkan decrement (`--`) untuk mengurangi angka sebanyak `1`.

Posisi tanda menentukan kapan penambahan terjadi:
- **Post-increment (`$a++`):** Ambil nilai lama dulu untuk digunakan sekarang, baru kemudian nilainya ditambah 1.
- **Pre-increment (`++$a`):** Tambah 1 terlebih dahulu sekarang juga, baru gunakan nilai barunya.

#### Contoh

```php
<?php

// Post-increment
$a = 5;
$hasilPost = $a++; // $hasilPost = 5, kemudian $a menjadi 6
echo "Post: hasil=$hasilPost, a=$a" . PHP_EOL;

// Pre-increment
$b = 5;
$hasilPre = ++$b;  // $b menjadi 6, kemudian $hasilPre = 6
echo "Pre:  hasil=$hasilPre, b=$b";
```

#### Output

```text
Post: hasil=5, a=6
Pre:  hasil=6, b=6
```

#### Alur Eksekusi Post vs Pre Increment

```text
       Post-increment ($a++)             Pre-increment (++$a)
                │                                 │
                ▼                                 ▼
       1. Baca nilai $a lama (5)         1. Tambah 1 ke $a (menjadi 6)
                │                                 │
                ▼                                 ▼
       2. Simpan 5 ke ekspresi           2. Baca nilai baru $a (6)
                │                                 │
                ▼                                 ▼
       3. Tambah 1 ke $a (menjadi 6)     3. Simpan 6 ke ekspresi
```

**Hafalan:**

```text
$a++        → Post-increment: pakai nilai lama dulu, baru tambah 1
++$a        → Pre-increment: tambah 1 dulu, baru pakai nilai baru
$a--        → Post-decrement: pakai nilai lama dulu, baru kurangi 1
--$a        → Pre-decrement: kurangi 1 dulu, baru pakai nilai baru
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan post-increment `$i++` sebagai format standar di bagian *step* perulangan `for`.
- ❌ **Kesalahan Umum:** Menulis ekspresi bertumpuk rumit seperti `$x = $a++ + ++$a;` yang membingungkan alur pembacaan kode.

---

<a id="bagian-17"></a>

## 17. 🟢 If, Elseif, Else Statement

#### Konsep

Struktur percabangan `if` digunakan untuk membuat keputusan di dalam program: jalankan perintah tertentu **hanya jika syarat/kondisi bernilai benar (`true`)**.

Jika syarat pertama tidak terpenuhi, kita bisa memberikan pilihan syarat lain menggunakan `elseif`, atau memberikan tindakan cadangan terakhir menggunakan `else`.

#### Contoh

```php
<?php

$nilaiUjian = 82;

if ($nilaiUjian >= 90) {
    $grade = "A (Sangat Baik)";
} elseif ($nilaiUjian >= 80) {
    $grade = "B (Baik)";
} elseif ($nilaiUjian >= 70) {
    $grade = "C (Cukup)";
} else {
    $grade = "D (Remedial)";
}

echo "Grade Anda: " . $grade;
```

#### Output

```text
Grade Anda: B (Baik)
```

#### Diagram Percabangan Bersyarat

```text
                  Cek ($nilaiUjian >= 90)
                             │
            ┌────────────────┴────────────────┐
            │ [ True ]                        │ [ False ]
            ▼                                 ▼
       Grade = "A"                   Cek ($nilaiUjian >= 80)
            │                                 │
            │                ┌────────────────┴────────────────┐
            │                │ [ True ]                        │ [ False ]
            │                ▼                                 ▼
            │           Grade = "B"                      Cek kondisi lain / else
            │                │                                 │
            └────────────────┼─────────────────────────────────┘
                             │
                             ▼
                          Selesai
```

**Hafalan:**

```text
if ($condition) { ... }           → Jalankan blok jika kondisi bernilai true
elseif ($condition) { ... }       → Cabang alternatif jika kondisi sebelumnya false
else { ... }                      → Cabang penampung terakhir jika semua kondisi false
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Urutkan kondisi secara logis dari rentang nilai paling spesifik ke yang paling umum.
- ❌ **Kesalahan Umum:** Menulis `else if` (dengan spasi) yang bisa menimbulkan kerancuan syntax pada template alternatif (`if: ... endif;`). Gunakan `elseif` tanpa spasi.

---

<a id="bagian-18"></a>

## 18. 🟢 Ternary & Short Ternary Operator

#### Konsep

**Ternary Operator (`?:`)** adalah jalan pintas untuk menulis `if-else` sederhana hanya dalam 1 baris kode. Formatnya: `kondisi ? jika_benar : jika_salah`.

PHP juga menyediakan **Short Ternary (`$a ?: $cadangan`)** yang otomatis memakai nilai `$a` jika ada isinya (*truthy*), atau memakai nilai `$cadangan` jika `$a` kosong (*falsy*).

#### Contoh

```php
<?php

$skor = 75;

// Ternary standar
$status = ($skor >= 70) ? "Lulus" : "Tidak Lulus";
echo "Status: " . $status . PHP_EOL;

// Short Ternary (Elvis Operator)
$inputPengguna = "";
$namaTampil = $inputPengguna ?: "Anonim";
echo "Nama: " . $namaTampil;
```

#### Output

```text
Status: Lulus
Nama: Anonim
```

#### Cara Kerja Ternary

```text
                  Evaluasi Kondisi ($skor >= 70)
                                │
               ┌────────────────┴────────────────┐
               │                                 │
            [ True ]                         [ False ]
               │                                 │
               ▼                                 ▼
         Hasil: "Lulus"                   Hasil: "Tidak Lulus"
```

**Hafalan:**

```text
$condition ? $valueIfTrue : $valueIfFalse  → Ternary standar: if-else satu baris
$value ?: $fallback                        → Short ternary: pakai $value jika truthy
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan ternary hanya untuk penugasan nilai tunggal sederhana agar kode tetap mudah dibaca.
- ❌ **Kesalahan Umum:** Menumpuk (*nesting*) beberapa ternary dalam satu baris (misal: `$a ? $b ? 1 : 2 : 3`), yang membuat kode sulit dipahami dan rawan bug.

---

<a id="bagian-19"></a>

## 19. 🟢 Null Coalescing Operator (`??` & `??=`)

#### Konsep

**Null Coalescing Operator (`??`)** adalah cara termudah dan teraman di PHP untuk memberikan nilai cadangan (*default*) jika suatu variabel belum dibuat atau bernilai `null`.

Tersedia juga **Null Coalescing Assignment (`??=`)** untuk langsung mengisi suatu variabel hanya jika variabel tersebut saat ini masih `null` atau belum ada.

#### Contoh

```php
<?php

$pengaturan = [
    "tema" => "dark"
];

// Mengambil nilai dengan fallback jika key tidak ditemukan
$temaAktif = $pengaturan["tema"] ?? "light";
$bahasa = $pengaturan["bahasa"] ?? "id";

echo "Tema: $temaAktif, Bahasa: $bahasa" . PHP_EOL;

// Null Coalescing Assignment
$profil = [];
$profil["role"] ??= "member"; // Diisi "member" karena belum ada key "role"
$profil["role"] ??= "admin";  // Diabaikan karena key "role" sudah ada

echo "Role: " . $profil["role"];
```

#### Output

```text
Tema: dark, Bahasa: id
Role: member
```

#### Cara Kerja Null Coalescing

```text
               Pemeriksaan Nilai: $pengaturan["bahasa"]
                                │
               ┌────────────────┴────────────────┐
               │                                 │
         [ Ada & Bukan Null ]              [ Null / Tidak Ada ]
               │                                 │
               ▼                                 ▼
         Pakai Nilai Asli                 Pakai Nilai Fallback ("id")
```

**Hafalan:**

```text
$value ?? $fallback          → Kembalikan $value jika ada dan bukan null, selain itu $fallback
$variable ??= $value         → Isi $variable dengan $value HANYA JIKA saat ini null
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Selalu gunakan `??` saat membaca data input dari array request (seperti `$_GET['page'] ?? 1`) agar aman dari *undefined index warning*.
- ❌ **Kesalahan Umum:** Mengira `??` mengecek nilai boolean `false` atau string kosong `""`. Operator `??` HANYA mengecek `null` atau *undefined*.

---

<a id="bagian-20"></a>

## 20. 🟢 Switch Statement

#### Konsep

`switch` digunakan saat kita ingin mencocokkan satu variabel dengan banyak kemungkinan pilihan nilai (*cases*).

Cara kerjanya:
- PHP mengecek pilihan dari atas ke bawah.
- Begitu ada pilihan yang cocok, kode akan dijalankan sampai bertemu kata kunci `break;` (untuk keluar dari switch).
- Jika tidak ada satu pun pilihan yang cocok, bagian `default:` akan dijalankan sebagai cadangan.

#### Contoh

```php
<?php

$opsiMenu = 2;

switch ($opsiMenu) {
    case 1:
        echo "Menampilkan Data Profil";
        break;
    case 2:
        echo "Menampilkan Data Transaksi";
        break;
    case 3:
        echo "Menampilkan Pengaturan Akun";
        break;
    default:
        echo "Pilihan menu tidak valid!";
        break;
}
```

#### Output

```text
Menampilkan Data Transaksi
```

#### Diagram Alur Switch

```text
       ┌───────────────────────────────────────────────┐
       │             Evaluasi: switch ($opsiMenu)      │
       └───────┬───────────────┬───────────────┬───────┘
               │               │               │
               ▼               ▼               ▼
           case 1:         case 2:         default:
               │               │               │
               ▼               ▼               ▼
          Menu Profil   Menu Transaksi   Pilihan Tidak Valid
               │               │               │
               ▼               ▼               ▼
             break;          break;          break;
               │               │               │
               └───────────────┼───────────────┘
                               │
                               ▼
                        Keluar Switch
```

**Hafalan:**

```text
switch ($value) { ... }   → Memeriksa kesamaan $value terhadap daftar case
case $target:             → Titik cabang jika nilai cocok
break;                    → Menghentikan eksekusi switch (mencegah fall-through)
default:                  → Blok fallback jika tidak ada case yang cocok
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Selalu akhiri setiap blok `case` dengan `break;` kecuali jika Anda sengaja menginginkan *fall-through* untuk beberapa kondisi sekaligus.
- ❌ **Kesalahan Umum:** Mengingat bahwa `switch` melakukan perbandingan longgar (*loose comparison* `==`), yang berpotensi menghasilkan perilaku tak terduga jika membandingkan integer `0` dengan string.

---

<a id="bagian-21"></a>

## 21. 🟢 Match Expression (PHP 8+)

#### Konsep

`match` adalah fitur modern (PHP 8+) pengganti `switch` yang jauh lebih ringkas, aman, dan bersih.

Kelebihan utama `match`:
- **Langsung Menghasilkan Nilai:** Hasilnya bisa langsung disimpan ke dalam variabel.
- **Pengecekan Ketat (`===`):** Membandingkan nilai sekaligus tipe datanya secara aman.
- **Tidak Butuh `break;`:** Otomatis berhenti begitu menemukan kecocokan tanpa risiko bablas.
- **Bisa Menggabungkan Pilihan:** Beberapa pilihan yang hasilnya sama cukup dipisah tanda koma `,`.

#### Contoh

```php
<?php

$statusCode = 404;

$pesan = match ($statusCode) {
    200, 201 => "Request Berhasil",
    400 => "Bad Request",
    401, 403 => "Akses Ditolak",
    404 => "Halaman Tidak Ditemukan",
    500 => "Internal Server Error",
    default => "Status Code Tidak Dikenal",
};

echo "Hasil: " . $pesan;
```

#### Output

```text
Hasil: Halaman Tidak Ditemukan
```

#### Perbandingan: Switch vs Match

```text
       Fitur                 switch                      match (PHP 8+)
       ──────────────────────────────────────────────────────────────────────────
       Sifat                 Statement                   Expression (Return value)
       Perbandingan          Loose (==)                  Strict (===)
       Penghenti             Wajib break;                Otomatis berhenti
       Kompak & Bersih       Cenderung panjang           Sangat ringkas & aman
```

**Hafalan:**

```text
$result = match ($value) { $target => $output, default => $fallback };
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Jadikan `match` sebagai pilihan pertama untuk pemetaan nilai/status di PHP modern.
- ❌ **Kesalahan Umum:** Lupa menyediakan cabang `default` jika tidak semua kemungkinan nilai tertangani, yang akan melempar `UnhandledMatchError`.

---

<a id="bagian-22"></a>

## 22. 🟢 For Loop

#### Konsep

`for` loop digunakan saat kita sudah tahu secara pasti **berapa kali perulangan harus berjalan** (misalnya mengulang sebanyak 5 kali atau 100 kali).

Struktur `for` loop terdiri dari 3 bagian penting:
`for (angka_mulai; syarat_berhenti; langkah_perubahan)`

#### Contoh

```php
<?php

echo "Menghitung maju:" . PHP_EOL;
for ($i = 1; $i <= 5; $i++) {
    echo "Nomor urut: $i" . PHP_EOL;
}

echo PHP_EOL . "Menghitung mundur kelipatan 10:" . PHP_EOL;
for ($i = 50; $i >= 10; $i -= 10) {
    echo "$i ";
}
```

#### Output

```text
Menghitung maju:
Nomor urut: 1
Nomor urut: 2
Nomor urut: 3
Nomor urut: 4
Nomor urut: 5

Menghitung mundur kelipatan 10:
50 40 30 20 10 
```

#### Diagram Alur For Loop

```text
       Inisialisasi Counter ($i = 1)
                     │
                     ▼
       Evaluasi Kondisi ($i <= 5) ───[ False ]───> Selesai Loop
                     │
                 [ True ]
                     ▼
             Jalankan Isi Blok
                     │
                     ▼
             Step Increment ($i++)
                     │
                     ▼
       (Kembali ke Evaluasi Kondisi)
```

**Hafalan:**

```text
for ($i = 0; $i < $count; $i++) { ... }  → Pola loop standar dengan indeks counter
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Hindari memanggil fungsi penghitung seperti `count($array)` berulang kali di dalam bagian kondisi loop `for`. Hitung panjang array sekali sebelum loop dimulai.
- ❌ **Kesalahan Umum:** Kesalahan *Off-by-one* (menggunakan `<` alih-alih `<=` atau sebaliknya).

---

<a id="bagian-23"></a>

## 23. 🟢 While Loop

#### Konsep

`while` loop menjalankan perintah secara berulang **selama suatu syarat masih bernilai benar (`true`)**.

Pengecekan syarat dilakukan di **awal**. Jika sejak pertama kali dicek syaratnya sudah salah (`false`), maka baris kode di dalamnya tidak akan pernah dijalankan sama sekali.

#### Contoh

```php
<?php

$antrean = 1;

while ($antrean <= 3) {
    echo "Melayani nomor antrean: $antrean" . PHP_EOL;
    $antrean++; // Increment agar kondisi akhirnya false
}
```

#### Output

```text
Melayani nomor antrean: 1
Melayani nomor antrean: 2
Melayani nomor antrean: 3
```

#### Diagram Alur While Loop

```text
       Evaluasi Kondisi ($antrean <= 3) ───[ False ]───> Selesai Loop
                     │
                 [ True ]
                     ▼
             Jalankan Isi Blok
                     │
                     ▼
             Update Variabel Kondisi
                     │
                     ▼
       (Kembali ke Evaluasi Kondisi)
```

**Hafalan:**

```text
while ($condition) { ... }  → Jalankan perulangan selama $condition bernilai true
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Pastikan variabel kondisi selalu diperbarui di dalam blok `while` agar tidak terjadi perulangan tak terhingga (*infinite loop*).
- ❌ **Kesalahan Umum:** Lupa menambahkan perubahan variabel (`$antrean++`), menyebabkan server hang karena infinite loop.

---

<a id="bagian-24"></a>

## 24. 🟢 Do While Loop

#### Konsep

`do-while` mirip dengan `while`, perbedaannya pengecekan syarat dilakukan di **akhir**.

Artinya, baris kode di dalam `do-while` **pasti dijalankan minimal 1 kali**, meskipun syaratnya sudah salah sejak awal. Ini sangat cocok untuk meminta input user terlebih dahulu sebelum dicek kebenarannya.

#### Contoh

```php
<?php

$skor = 0;

do {
    echo "Blok ini pasti dieksekusi minimal satu kali. Nilai skor: $skor" . PHP_EOL;
    $skor++;
} while ($skor < 0); // Kondisi false sejak evaluasi pertama
```

#### Output

```text
Blok ini pasti dieksekusi minimal satu kali. Nilai skor: 0
```

#### Diagram Alur Do-While Loop

```text
             Jalankan Isi Blok (Minimal 1x)
                           │
                           ▼
             Evaluasi Kondisi di Akhir
                           │
          ┌────────────────┴────────────────┐
          │                                 │
       [ True ]                         [ False ]
          │                                 │
          ▼                                 ▼
   (Ulangi Blok Kode)                  Selesai Loop
```

**Hafalan:**

```text
do { ... } while ($condition);  → Eksekusi minimal 1 kali, baru cek kondisi di akhir
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan `do-while` untuk skenario interaktif yang memerlukan input user terlebih dahulu sebelum divalidasi (misal: *prompt input CLI*).
- ❌ **Kesalahan Umum:** Lupa tanda titik koma `;` setelah kurung penutup `while ($condition);`.

---

<a id="bagian-25"></a>

## 25. 🟢 Foreach Loop & Destructuring

#### Konsep

`foreach` adalah cara paling mudah dan paling sering digunakan di PHP untuk membaca seluruh isi `array` satu per satu dari awal sampai habis, tanpa perlu pusing menghitung jumlah data secara manual.

Kita bisa membaca nilainya saja, membaca pasangan kunci dan nilainya (`$key => $value`), atau langsung membongkar isinya (*destructuring*).

#### Contoh

```php
<?php

// 1. Foreach Value Saja
$bahasa = ["PHP", "JavaScript", "SQL"];
foreach ($bahasa as $item) {
    echo "Bahasa: $item" . PHP_EOL;
}

// 2. Foreach Key & Value
$profil = [
    "nama" => "Budi",
    "role" => "Software Engineer",
    "kota" => "Jakarta"
];
foreach ($profil as $key => $value) {
    echo "$key: $value" . PHP_EOL;
}

// 3. Foreach dengan Destructuring
$koordinat = [
    [10, 20],
    [30, 40]
];
foreach ($koordinat as [$x, $y]) {
    echo "X: $x, Y: $y" . PHP_EOL;
}
```

#### Output

```text
Bahasa: PHP
Bahasa: JavaScript
Bahasa: SQL
nama: Budi
role: Software Engineer
kota: Jakarta
X: 10, Y: 20
X: 30, Y: 40
```

#### Diagram Alur Foreach Loop

```text
                    Array Sumber Data
                            │
                            ▼
               Ambil Elemen Satu per Satu
                            │
                            ▼
                Terapkan ke Variabel Item
                            │
                            ▼
                Jalankan Isi Blok Loop
                            │
                            ▼
             Selesai jika seluruh elemen habis
```

**Hafalan:**

```text
foreach ($array as $value)              → Iterasi setiap nilai elemen
foreach ($array as $key => $value)      → Iterasi pasangan key dan value
foreach ($matrix as [$col1, $col2])     → Iterasi dengan array destructuring
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Selalu prioritaskan `foreach` daripada `for` konvensional saat membaca data array.
- ❌ **Kesalahan Umum:** Memberikan variabel referensi `&$item` pada `foreach` tanpa melakukan `unset($item)` setelah loop selesai.

---

<a id="bagian-26"></a>

## 26. 🟢 Break dan Continue

#### Konsep

Dua perintah penting untuk mengendalikan jalannya perulangan (*loop*):

- `break` : Menghentikan perulangan saat itu juga dan **langsung keluar** dari perulangan.
- `continue` : Menghentikan putaran saat ini dan **langsung melompat ke putaran berikutnya**.

Keduanya bisa diberi angka opsional (misal: `break 2;`) jika ingin keluar dari perulangan bertingkat (*nested loops*).

#### Contoh

```php
<?php

echo "Demo break (berhenti di angka 3):" . PHP_EOL;
for ($i = 1; $i <= 5; $i++) {
    if ($i === 3) {
        break; // Berhenti total
    }
    echo "$i ";
}

echo PHP_EOL . "Demo continue (lewati angka 3):" . PHP_EOL;
for ($i = 1; $i <= 5; $i++) {
    if ($i === 3) {
        continue; // Lewati angka 3
    }
    echo "$i ";
}
```

#### Output

```text
Demo break (berhenti di angka 3):
1 2 
Demo continue (lewati angka 3):
1 2 4 5 
```

#### Perbandingan Break vs Continue

```text
                         Loop Berjalan
                               │
               ┌───────────────┴───────────────┐
               │                               │
               ▼                               ▼
         Bertemu break                  Bertemu continue
               │                               │
               ▼                               ▼
       Langsung Keluar Total            Lewati Iterasi Ini &
       dari Struktur Loop               Lanjut ke Giliran Berikutnya
```

**Hafalan:**

```text
break        → Hentikan loop dan keluar seketika
continue     → Lewati iterasi saat ini, lanjut ke giliran berikutnya
break $level → Keluar dari sejumlah $level loop bersarang
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan `continue` sebagai *guard clause* di awal blok perulangan untuk memangkas *nesting* `if` yang terlalu dalam.
- ❌ **Kesalahan Umum:** Menggunakan `break` di luar struktur loop atau switch, yang akan menghasilkan pesan *Fatal Error: 'break' not in the 'loop' or 'switch' context*.

---

<a id="bagian-27"></a>

## 27. 🟢 Manipulasi String

#### Konsep

Manipulasi string adalah kegiatan mengolah teks, seperti menyambung kalimat, memotong kata, menghapus spasi liar, atau mengubah huruf besar dan kecil.

Aturan utama di PHP:
- Untuk menyambung teks, gunakan tanda titik (`.`), **bukan tanda tambah (`+`)**.
- Untuk menambahkan teks ke variabel yang sama, gunakan `.=`.

#### Contoh

```php
<?php

$depan = "Budi";
$belakang = "Santoso";

// 1. Concatenation (.)
$namaLengkap = $depan . " " . $belakang;
echo "Nama: " . $namaLengkap . PHP_EOL;

// 2. Pembersihan whitespace (trim)
$inputKotor = "   admin@example.com  \n";
$emailBersih = trim($inputKotor);
echo "Email: '$emailBersih'" . PHP_EOL;

// 3. Mengubah Huruf Besar / Kecil
echo "Upper: " . strtoupper($depan) . PHP_EOL;
echo "Lower: " . strtolower($belakang) . PHP_EOL;
```

#### Output

```text
Nama: Budi Santoso
Email: 'admin@example.com'
Upper: BUDI
Lower: santoso
```

#### Cara Kerja Penggabungan String

```text
       "Budi" . " " . "Santoso"
          │      │        │
          └──────┴────────┴──> Alokasi buffer string baru: "Budi Santoso"
```

**Hafalan:**

```text
$a . $b          → Operator penggabungan string (concatenation)
$a .= $b         → Tambahkan string $b ke ujung $a
trim($string)    → Menghapus spasi liar di awal dan akhir teks
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan titik `.` untuk menyambung string. Jangan gunakan `+` karena tanda `+` di PHP hanya berlaku untuk operasi matematika numerik.
- ❌ **Kesalahan Umum:** Menulis `$pesan = "Total: " + $harga;` yang akan memicu *TypeError* di PHP modern.

---

<a id="bagian-28"></a>

## 28. 🟢 Array Functions Esensial

#### Konsep

PHP menyediakan banyak fungsi bawaan siap pakai untuk mengolah data array dengan cepat tanpa perlu membuat perulangan manual:

- `count($array)` : Menghitung total jumlah isi array.
- `in_array($cari, $array)` : Memeriksa apakah suatu nilai ada di dalam array.
- `array_key_exists($key, $array)` : Memeriksa apakah ada label nama (*key*) tertentu di array.
- `array_push($array, ...$values)` / `array_pop($array)` : Menambah / mengambil elemen di paling belakang.
- `array_shift($array)` / `array_unshift($array, ...$values)` : Mengambil / menambah elemen di paling depan.
- `array_map($callback, $array)` : Mengubah setiap isi elemen array menjadi bentuk baru.
- `array_filter($array, $callback)` : Menyaring dan mengambil hanya data yang memenuhi syarat.
- `array_merge($array1, $array2)` : Menggabungkan dua atau lebih array menjadi satu.
- `sort($array)` / `rsort($array)` : Mengurutkan isi array dari kecil ke besar / sebaliknya.

#### Contoh

```php
<?php

$angka = [1, 2, 3, 4, 5];

// 1. Filter angka genap
$genap = array_filter($angka, fn(int $n): bool => $n % 2 === 0);

// 2. Map (kali 10)
$kaliSepuluh = array_map(fn(int $n): int => $n * 10, $angka);

// 3. Merge array
$kategoriA = ["Elektronik", "Fashion"];
$kategoriB = ["Makanan", "Buku"];
$semuaKategori = array_merge($kategoriA, $kategoriB);

// 4. In array check
$adaBuku = in_array("Buku", $semuaKategori, true);

echo "Genap: " . implode(", ", $genap) . PHP_EOL;
echo "Kali 10: " . implode(", ", $kaliSepuluh) . PHP_EOL;
echo "Total kategori: " . count($semuaKategori) . PHP_EOL;
echo "Ada buku? " . ($adaBuku ? "Ya" : "Tidak");
```

#### Output

```text
Genap: 2, 4
Kali 10: 10, 20, 30, 40, 50
Total kategori: 4
Ada buku? Ya
```

#### Transformasi Array: Filter vs Map

```text
                     Array Input: [1, 2, 3, 4, 5]
                                  │
                 ┌────────────────┴────────────────┐
                 │                                 │
                 ▼                                 ▼
         array_filter(n % 2 == 0)          array_map(n * 10)
                 │                                 │
                 ▼                                 ▼
         [2, 4] (Elemen lolos)             [10, 20, 30, 40, 50]
```

**Hafalan:**

```text
count($array)                     → Hitung total elemen array
in_array($needle, $haystack)      → Periksa keberadaan nilai di dalam array
array_map($callback, $array)      → Transformasi seluruh elemen array
array_filter($array, $callback)   → Saring elemen array berdasarkan kriteria
array_merge($array1, $array2)     → Gabungkan dua atau lebih array
implode($separator, $array)       → Gabungkan elemen array menjadi satu string
explode($separator, $string)      → Pecah string menjadi array berdasarkan pemisah
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Selalu aktifkan parameter strict `$strict = true` saat menggunakan `in_array($needle, $array, true)`.
- ❌ **Kesalahan Umum:** Lupa bahwa urutan parameter `array_map($callback, $array)` dan `array_filter($array, $callback)` berbeda!

---

<a id="bagian-29"></a>

## 29. 🟢 String Functions Esensial

#### Konsep

Selain menyambung teks, PHP memiliki fungsi bawaan lengkap untuk memeriksa dan membedah isi teks:

- `strlen($teks)` : Menghitung jumlah huruf / karakter pada teks.
- `substr($teks, $mulai, $panjang)` : Memotong dan mengambil sebagian kalimat.
- `str_replace($cari, $ganti, $teks)` : Mengganti kata tertentu dengan kata baru.
- `str_contains($teks, $kata)` : (PHP 8+) Mengecek apakah suatu kata ada di dalam teks.
- `str_starts_with($teks, $awalan)` : (PHP 8+) Mengecek apakah teks diawali kata tertentu.
- `str_ends_with($teks, $akhiran)` : (PHP 8+) Mengecek apakah teks diakhiri kata tertentu.
- `explode($pemisah, $teks)` : Memecah kalimat menjadi array berdasarkan tanda pemisah (misal spasi atau koma).

#### Contoh

```php
<?php

$kalimat = "Belajar Pemrograman PHP Modern";

echo "Panjang teks: " . strlen($kalimat) . PHP_EOL;
echo "Potong teks: " . substr($kalimat, 0, 7) . PHP_EOL;

// Fitur Modern PHP 8+
var_dump(str_contains($kalimat, "PHP"));        // bool(true)
var_dump(str_starts_with($kalimat, "Belajar")); // bool(true)
var_dump(str_ends_with($kalimat, "Modern"));    // bool(true)

// Replace kata
$hasilReplace = str_replace("PHP", "Laravel", $kalimat);
echo "Hasil replace: " . $hasilReplace . PHP_EOL;

// Explode teks ke array
$daftarKata = explode(" ", $kalimat);
print_r($daftarKata);
```

#### Output

```text
Panjang teks: 30
Potong teks: Belajar
bool(true)
bool(true)
bool(true)
Hasil replace: Belajar Pemrograman Laravel Modern
Array
(
    [0] => Belajar
    [1] => Pemrograman
    [2] => PHP
    [3] => Modern
)
```

**Hafalan:**

```text
strlen($string)                                → Hitung jumlah karakter string
substr($string, $offset, $length)              → Potong dan ambil substring
str_replace($search, $replace, $subject)       → Ganti kata di dalam string
str_contains($haystack, $needle)               → Cek apakah mengandung substring
str_starts_with($haystack, $needle)            → Cek apakah diawali teks tertentu
str_ends_with($haystack, $needle)              → Cek apakah diakhiri teks tertentu
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan helper modern `str_contains()`, `str_starts_with()`, dan `str_ends_with()` pada PHP 8+ daripada fungsi lawas `strpos() !== false`.
- ❌ **Kesalahan Umum:** Untuk teks yang mengandung karakter multi-byte (seperti huruf beraksen atau emoji), gunakan fungsi multi-byte `mb_strlen()` dan `mb_substr()`.

---

<a id="bagian-30"></a>

## 30. 🟢 Type Checking (`is_*`) & Type Casting

#### Konsep

- **Type Checking (`is_*`):** Kumpulan fungsi bawaan untuk memeriksa jenis tipe data suatu variabel (menghasilkan `true` atau `false`), misalnya `is_string()`, `is_int()`, atau `is_array()`.
- **Type Casting:** Cara mengubah tipe data variabel secara paksa dan langsung dengan menuliskan tipe baru di dalam kurung, misalnya `(int) "100"` untuk mengubah teks angka menjadi bilangan bulat murni.

#### Contoh

```php
<?php

$nilai = "150";

// 1. Pengecekan Type
var_dump(is_string($nilai));  // bool(true)
var_dump(is_numeric($nilai)); // bool(true) - teks angka valid
var_dump(is_int($nilai));     // bool(false) - tipe aslinya masih string

// 2. Type Casting Eksplisit
$angkaInteger = (int) $nilai;
var_dump(is_int($angkaInteger)); // bool(true)

// Contoh casting boolean
var_dump((bool) 0);    // bool(false)
var_dump((bool) 1);    // bool(true)
var_dump((bool) "");   // bool(false)
var_dump((bool) "PHP");// bool(true)
```

#### Output

```text
bool(true)
bool(true)
bool(false)
bool(true)
bool(false)
bool(true)
bool(false)
bool(true)
```

#### Daftar Helper `is_*`

```text
       is_int($value)       ──> Apakah integer?
       is_float($value)     ──> Apakah float?
       is_string($value)    ──> Apakah string?
       is_bool($value)      ──> Apakah boolean?
       is_array($value)     ──> Apakah array?
       is_null($value)      ──> Apakah bernilai null?
       is_numeric($value)   ──> Apakah angka atau string angka?
```

**Hafalan:**

```text
is_type($value)      → Periksa apakah $value memiliki tipe data tertentu
(type) $value        → Konversi tipe data $value secara eksplisit (Type Casting)
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan `is_numeric()` saat memvalidasi input dari query string URL sebelum mengonversinya ke integer.
- ❌ **Kesalahan Umum:** Melakukan casting array kosong `(bool) []` yang menghasilkan `false`, sering terlewat oleh pemula yang mengira objek/array selalu bernilai truthy.

---

<a id="bagian-31"></a>

## 31. 🟢 Function Dasar & Deklarasi

#### Konsep

**Function (Fungsi)** adalah kumpulan baris perintah yang diberi nama agar bisa kita panggil berulang-ulang kapan pun dibutuhkan tanpa harus menulis ulang kode yang sama.

Fungsi membantu membagi program besar yang rumit menjadi potongan-potongan tugas kecil yang rapi dan mudah dikelola. Fungsi dibuat menggunakan kata kunci `function namaFungsi() { ... }`.

#### Contoh

```php
<?php

// 1. Deklarasi Function
function kirimNotifikasi()
{
    echo "Notifikasi: Pesanan Anda sedang diproses." . PHP_EOL;
}

// 2. Memanggil Function
kirimNotifikasi();
kirimNotifikasi();
```

#### Output

```text
Notifikasi: Pesanan Anda sedang diproses.
Notifikasi: Pesanan Anda sedang diproses.
```

#### Cara Kerja Function

```text
       Deklarasi: function kirimNotifikasi() { ... }
                            │
                            ▼ Disimpan di memori Zend Engine
       Pemanggilan: kirimNotifikasi()
                            │
                            ▼ Alihkan alur eksekusi ke blok fungsi
       Jalankan Statement -> Kembali ke pemanggil setelah selesai
```

**Hafalan:**

```text
function functionName() { ... }  → Deklarasi fungsi baru
functionName()                   → Memanggil dan mengeksekusi fungsi
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Berikan nama fungsi yang berupa kata kerja (*verb*) yang jelas mencerminkan aksinya (`calculateTotal()`, `sendEmail()`, `formatDate()`).
- ❌ **Kesalahan Umum:** Mendeklarasikan dua fungsi dengan nama yang persis sama di file yang sama (*Fatal Error: Cannot redeclare function*).

---

<a id="bagian-32"></a>

## 32. 🟢 Parameter, Default Value & Named Arguments

#### Konsep

- **Parameter:** Variabel penampung yang kita siapkan saat membuat fungsi untuk menerima data dari luar.
- **Argument:** Nilai nyata yang kita kirimkan saat memanggil fungsi tersebut.
- **Default Value:** Nilai cadangan jika pemanggil fungsi tidak mengirimkan nilai apa pun.
- **Named Arguments (PHP 8+):** Cara mengirim nilai ke fungsi dengan menyebutkan nama parameternya secara langsung, sehingga urutan pengirimannya bebas dan tidak tertukar.

#### Contoh

```php
<?php

// Function dengan default value
function buatAkun(string $nama, string $role = "Member", bool $kirimEmail = false)
{
    echo "User: $nama | Role: $role | Email Verifikasi: " . ($kirimEmail ? "Ya" : "Tidak") . PHP_EOL;
}

// 1. Pemanggilan standar (posisi)
buatAkun("Budi");
buatAkun("Andi", "Admin", true);

// 2. Pemanggilan dengan Named Arguments (PHP 8+)
buatAkun(kirimEmail: true, nama: "Siti"); // Melewati parameter $role
```

#### Output

```text
User: Budi | Role: Member | Email Verifikasi: Tidak
User: Andi | Role: Admin | Email Verifikasi: Ya
User: Siti | Role: Member | Email Verifikasi: Ya
```

#### Posisi vs Named Arguments

```text
       Pemanggilan Berdasarkan Posisi:
       buatAkun("Andi", "Admin", true);
                  │        │       │
                  ▼        ▼       ▼
                $nama    $role  $kirimEmail

       Pemanggilan Berdasarkan Nama (Named Arguments):
       buatAkun(kirimEmail: true, nama: "Siti");
                    │               │
                    ▼               ▼
               $kirimEmail        $nama (Role otomatis pakai default)
```

**Hafalan:**

```text
function name($param = $defaultValue)    → Parameter dengan nilai cadangan
name(paramName: $value)                 → Named arguments: kirim argument sesuai nama
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Letakkan parameter wajib (tanpa default value) di posisi paling awal sebelum parameter opsional.
- ❌ **Kesalahan Umum:** Meletakkan parameter wajib setelah parameter yang memiliki default value (deprecated di PHP 8.0+).

---

<a id="bagian-33"></a>

## 33. 🟢 Return Value & Early Return

#### Konsep

Fungsi dapat mengirimkan kembali hasil perhitungannya kepada pemanggil menggunakan perintah `return`. Begitu perintah `return` dijalankan, fungsi akan **langsung berhenti seketika**.

**Early Return** adalah pola penulisan terbaik di mana kita menghentikan fungsi dan mengembalikan hasil secepat mungkin begitu ada syarat yang tidak terpenuhi, sehingga kode kita tetap rapi dan tidak memiliki percabangan `if-else` bersarang yang rumit.

#### Contoh

```php
<?php

function hitungDiskon(int $totalBelanja): int
{
    // Early return jika tidak memenuhi syarat diskon
    if ($totalBelanja < 100000) {
        return 0;
    }

    if ($totalBelanja >= 500000) {
        return (int) ($totalBelanja * 0.2); // Diskon 20%
    }

    return (int) ($totalBelanja * 0.1);     // Diskon 10%
}

$diskon1 = hitungDiskon(50000);
$diskon2 = hitungDiskon(200000);
$diskon3 = hitungDiskon(600000);

echo "Diskon 1: Rp " . $diskon1 . PHP_EOL;
echo "Diskon 2: Rp " . $diskon2 . PHP_EOL;
echo "Diskon 3: Rp " . $diskon3;
```

#### Output

```text
Diskon 1: Rp 0
Diskon 2: Rp 20000
Diskon 3: Rp 120000
```

#### Alur Pola Early Return

```text
       hitungDiskon($totalBelanja)
                 │
                 ▼
       Cek: $totalBelanja < 100000 ───[ True ]───> return 0 (Selesai Seketika)
                 │ [ False ]
                 ▼
       Cek: $totalBelanja >= 500000 ──[ True ]───> return 20% (Selesai Seketika)
                 │ [ False ]
                 ▼
       Logika Sisa: return 10% (Selesai)
```

**Hafalan:**

```text
return $value   → Mengembalikan nilai ke pemanggil dan menghentikan fungsi
return;         → Menghentikan fungsi tanpa mengembalikan nilai (void)
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Terapkan pola *Early Return* untuk memeriksa kondisi *edge cases* di baris-baris pertama fungsi.
- ❌ **Kesalahan Umum:** Menulis kode logika di bawah statement `return` tanpa menyadari bahwa baris tersebut tidak akan pernah dieksekusi (*unreachable code*).

---

<a id="bagian-34"></a>

## 34. 🟢 Type Declaration (Scalar, Return, & Union)

#### Konsep

**Type Declaration (Type Hinting)** adalah cara kita menentukan jenis tipe data apa yang wajib dikirim ke parameter fungsi, serta tipe data apa yang wajib dihasilkan saat fungsi selesai (*return type*).

Manfaat Type Declaration:
- Mencegah error salah kirim data sejak awal.
- Menjadikan kode jelas dibaca (*self-documenting*).
- Membantu editor/IDE memberikan petunjuk (*autocomplete*) otomatis.

Di PHP modern kita bisa menentukan tipe tunggal (`string`, `int`), tipe kosong (`void`), tipe boleh null (`?string`), maupun gabungan beberapa tipe sekaligus menggunakan **Union Type** (`int|float`).

#### Contoh

```php
<?php

// Fungsi dengan Type Declaration lengkap & Union Type
function hitungPajak(int|float $harga, float $persentasePajak = 0.11): float
{
    return $harga * $persentasePajak;
}

// Fungsi nullable & return void
function cetakProfil(string $nama, ?string $kota): void
{
    $lokasi = $kota ?? "Tidak Diketahui";
    echo "Nama: $nama, Kota: $lokasi" . PHP_EOL;
}

$pajak = hitungPajak(100000);
echo "Pajak: Rp " . $pajak . PHP_EOL;

cetakProfil("Budi", "Surabaya");
cetakProfil("Andi", null);
```

#### Output

```text
Pajak: Rp 11000
Nama: Budi, Kota: Surabaya
Nama: Andi, Kota: Tidak Diketahui
```

#### Cara Membaca Type Declaration

```text
       function hitungPajak(int|float $harga): float
                             │                  │
                             │                  └── Return Type: Wajib float
                             └── Parameter Type: Boleh int ATAU float (Union)
```

**Hafalan:**

```text
function name(type $param): returnType { ... }   → Deklarasi tipe parameter & return
?type $param                                     → Nullable: boleh bernilai tipe atau null
typeA|typeB $param                               → Union type (PHP 8+): boleh salah satu tipe
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Tambahkan deklarasi tipe data pada seluruh parameter dan return type di kode PHP modern.
- ❌ **Kesalahan Umum:** Mengaktifkan `declare(strict_types=1);` tetapi mengirimkan data string angka `"10"` ke fungsi yang mengharapkan `int`.

---

<a id="bagian-35"></a>

## 35. 🟢 Variable Scope (Local, Global, Static)

#### Konsep

**Scope (Jangkauan Variabel)** menentukan di area mana saja sebuah variabel bisa dibaca atau digunakan:

1. **Local Scope:** Variabel yang dibuat di dalam sebuah fungsi hanya bisa digunakan di dalam fungsi itu sendiri dan akan langsung terhapus dari memori saat fungsi selesai berjalan.
2. **Global Scope:** Variabel yang dibuat di luar fungsi. Variabel ini tidak bisa langsung dibaca di dalam fungsi kecuali kita mengimpornya dengan kata kunci `global`.
3. **Static Scope:** Variabel lokal di dalam fungsi yang **nilainya tetap diingat dan dipertahankan** meskipun fungsi tersebut dipanggil berkali-kali.

#### Contoh

```php
<?php

$namaAplikasi = "Toko App"; // Global Variable

function hitungTransaksi()
{
    // Mengakses global variable
    global $namaAplikasi;
    
    // Static variable (mempertahankan nilai)
    static $totalTransaksi = 0;
    
    $totalTransaksi++;
    
    echo "[$namaAplikasi] Transaksi ke: $totalTransaksi" . PHP_EOL;
}

hitungTransaksi();
hitungTransaksi();
hitungTransaksi();
```

#### Output

```text
[Toko App] Transaksi ke: 1
[Toko App] Transaksi ke: 2
[Toko App] Transaksi ke: 3
```

#### Peta Lingkup Memori Scope

```text
       ┌────────────────────────────────────────────────────────────┐
       │ GLOBAL SCOPE                                               │
       │ $namaAplikasi = "Toko App"                                 │
       │                                                            │
       │    ┌──────────────────────────────────────────────────┐    │
       │    │ LOCAL FUNCTION SCOPE                             │    │
       │    │ global $namaAplikasi; (menghubungkan ke global)  │    │
       │    │ static $totalTransaksi; (memori bertahan)        │    │
       │    │ $diskon = 10000; (hilang setelah fungsi selesai) │    │
       │    └──────────────────────────────────────────────────┘    │
       └────────────────────────────────────────────────────────────┘
```

**Hafalan:**

```text
Local variable   → Dibuat dan hanya hidup di dalam fungsi
global $var      → Mengimpor variabel dari global scope ke dalam fungsi
static $var      → Variabel lokal yang mempertahankan nilainya antar panggilan fungsi
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Hindari ketergantungan pada keyword `global`. Kirimkan data yang dibutuhkan fungsi secara eksplisit melalui **parameter**.
- ❌ **Kesalahan Umum:** Mengakses variabel luar langsung di dalam fungsi tanpa deklarasi `global` yang akan memicu *Warning: Undefined variable*.

---

<a id="bagian-36"></a>

## 36. 🟡 Anonymous Function (Closure) & `use` Keyword

#### Konsep

**Anonymous Function** (atau biasa disebut **Closure**) adalah fungsi yang tidak memiliki nama. Fungsi ini bisa disimpan ke dalam variabel atau dikirim langsung sebagai argumen ke fungsi lain.

Jika ingin membaca variabel dari luar ke dalam Anonymous Function, kita wajib "menjinjingnya" menggunakan kata kunci `use ($namaVariabel)`.

#### Contoh

```php
<?php

$diskon = 5000;

// Anonymous function yang mengimpor $diskon dari luar
$hitungTotal = function (int $harga) use ($diskon): int {
    return $harga - $diskon;
};

echo "Total Bayar: Rp " . $hitungTotal(50000) . PHP_EOL;

// Digunakan sebagai argument
$daftarAngka = [1, 2, 3];
$hasil = array_map(function (int $n): int {
    return $n * $n;
}, $daftarAngka);

print_r($hasil);
```

#### Output

```text
Total Bayar: Rp 45000
Array
(
    [0] => 1
    [1] => 4
    [2] => 9
)
```

#### Cara Kerja `use`

```text
       Parent Scope ($diskon = 5000)
                     │
                     │ use ($diskon)
                     ▼
       Closure Function Scope
       (Menduplikasi nilai $diskon ke dalam memori lokal fungsi)
```

**Hafalan:**

```text
$closure = function ($param) use ($outerVar) { ... };  → Anonymous function dengan binding use
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan closure saat membutuhkan fungsi singkat untuk satu kali pakai (seperti pada callback `array_map` atau middleware routing).
- ❌ **Kesalahan Umum:** Mengira `use ($diskon)` melakukan *pass-by-reference* secara default. Nilai di-copy secara *by-value* kecuali Anda menuliskan `use (&$diskon)`.

---

<a id="bagian-37"></a>

## 37. 🟡 Arrow Function (`fn() =>`)

#### Konsep

**Arrow Function** (fitur modern sejak PHP 7.4) adalah versi mini 1 baris dari Anonymous Function.

Keunggulan Arrow Function:
- Sangat pendek dan ringkas dengan sintaks `fn($param) => ekspresi`.
- **Otomatis membaca variabel dari luar** tanpa perlu menulis kata kunci `use`.
- Hasil perhitungannya otomatis dikembalikan (*implicit return*) tanpa perlu menulis `return`.

#### Contoh

```php
<?php

$faktorPengali = 5;
$daftarAngka = [1, 2, 3, 4];

// Menggunakan Arrow Function: otomatis mengakses $faktorPengali
$hasil = array_map(fn(int $n): int => $n * $faktorPengali, $daftarAngka);

echo "Hasil: " . implode(", ", $hasil);
```

#### Output

```text
Hasil: 5, 10, 15, 20
```

#### Perbandingan: Closure vs Arrow Function

```text
       Anonymous Function Biasa                  Arrow Function (PHP 7.4+)
       ──────────────────────────────────────────────────────────────────────────
       $fn = function ($n) use ($faktor) {       $fn = fn($n) => $n * $faktor;
           return $n * $faktor;
       };
```

**Hafalan:**

```text
fn($param) => $expression   → Arrow function: ringkas, auto-capture variabel luar, implicit return
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan arrow function untuk operasi transformasi atau filter sederhana satu baris.
- ❌ **Kesalahan Umum:** Mencoba memasukkan multi-statement atau blok kurung kurawal `{ ... }` ke dalam arrow function (arrow function hanya mendukung 1 single expression).

---

<a id="bagian-38"></a>

## 38. 🟡 Callback Function & `callable`

#### Konsep

**Callback** adalah sebuah fungsi yang kita kirimkan sebagai "titipan" ke fungsi lain, untuk dijalankan nanti ketika proses tertentu sudah selesai.

Pada parameter fungsi penerima, tipe data callback ditulis menggunakan tipe `callable` atau `Closure`.

#### Contoh

```php
<?php

// Fungsi yang menerima callback
function prosesTransaksi(int $nominal, callable $pajakCalculator): void
{
    $pajak = $pajakCalculator($nominal);
    $total = $nominal + $pajak;
    
    echo "Nominal: Rp $nominal | Pajak: Rp $pajak | Total: Rp $total" . PHP_EOL;
}

// 1. Mengirim Callback berupa Arrow Function
prosesTransaksi(100000, fn(int $n): float => $n * 0.11);

// 2. Mengirim Callback berupa Fungsi Bernama (Named Function)
function hitungPajakKhusus(int $n): float {
    return $n * 0.05;
}

prosesTransaksi(100000, "hitungPajakKhusus");
```

#### Output

```text
Nominal: Rp 100000 | Pajak: Rp 11000 | Total: Rp 111000
Nominal: Rp 100000 | Pajak: Rp 5000 | Total: Rp 105000
```

#### Alur Pemanggilan Callback

```text
       Pemanggil: prosesTransaksi(100000, $callback)
                            │
                            ▼
       Terima Data: $nominal = 100000
                            │
                            ▼
       Eksekusi Callback: $pajakCalculator(100000)
                            │
                            ▼
       Hitung Total Akhir & Tampilkan Hasil
```

**Hafalan:**

```text
callable $callback   → Type hint parameter yang menerima fungsi sebagai argument
$callback($args)     → Mengeksekusi callback yang dikirimkan
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan type hint `callable` saat membuat fungsi utility umum yang membutuhkan kustomisasi logic dari pemanggil.
- ❌ **Kesalahan Umum:** Mengirim nama fungsi berupa string yang salah eja atau tidak terdefinisi, yang memicu *TypeError*.

---

<a id="bagian-39"></a>

## 39. 🟡 Variable Function

#### Konsep

**Variable Function** adalah keunikan PHP yang memungkinkan kita memanggil suatu fungsi menggunakan teks nama fungsi yang tersimpan di dalam variabel.

Jika sebuah variabel bernilai teks nama fungsi dan diikuti tanda kurung `()`, PHP akan otomatis mencari dan mengeksekusi fungsi yang namanya sesuai dengan isi variabel tersebut.

#### Contoh

```php
<?php

function sapaPagi(string $nama): string {
    return "Selamat Pagi, $nama!";
}

function sapaMalam(string $nama): string {
    return "Selamat Malam, $nama!";
}

$waktu = "Pagi";
$namaFungsi = "sapa" . $waktu; // Menghasilkan string "sapaPagi"

// Memanggil fungsi secara dinamis
echo $namaFungsi("Budi") . PHP_EOL;

$waktu = "Malam";
$namaFungsi = "sapa" . $waktu; // Menghasilkan string "sapaMalam"
echo $namaFungsi("Andi");
```

#### Output

```text
Selamat Pagi, Budi!
Selamat Malam, Andi!
```

#### Cara Kerja Variable Function

```text
       $namaFungsi = "sapaPagi";
                 │
                 ▼
       $namaFungsi("Budi");
                 │
                 ▼
       PHP mencari fungsi 'sapaPagi' di memori
                 │
                 ▼
       Eksekusi: sapaPagi("Budi")
```

**Hafalan:**

```text
$functionName = "sayHello";
$functionName();             → Menjalankan fungsi sayHello() secara dinamis
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan `function_exists($namaFungsi)` terlebih dahulu sebelum mengeksekusi variable function untuk memastikan fungsi tersebut ada.
- ❌ **Kesalahan Umum:** Memanggil variable function dari input pengguna langsung tanpa sanitasi/whitelist (potensi celah keamanan eksekusi kode liar).

---

<a id="bagian-40"></a>

## 40. 🟡 Recursive Function

#### Konsep

**Recursive Function** adalah fungsi yang **memanggil dirinya sendiri** secara berulang untuk menyelesaikan masalah bertingkat (seperti membuka boneka bersarang / Matryoshka).

Dua syarat wajib fungsi rekursif:
1. **Base Case (Kondisi Berhenti):** Syarat mutlak kapan fungsi harus berhenti memanggil dirinya sendiri.
2. **Recursive Step:** Pemanggilan fungsi kembali dengan nilai yang semakin mengecil mendekati kondisi berhenti.

#### Contoh

```php
<?php

// Menghitung Faktorial: n! = n * (n - 1)!
function faktorial(int $n): int
{
    // 1. Base Case
    if ($n <= 1) {
        return 1;
    }

    // 2. Recursive Step
    return $n * faktorial($n - 1);
}

echo "5! = " . faktorial(5);
```

#### Output

```text
5! = 120
```

#### Alur Eksekusi Rekursif Faktorial

```text
       faktorial(5)
            │
            ▼
       5 × faktorial(4)
            │
            ▼
       5 × 4 × faktorial(3)
            │
            ▼
       5 × 4 × 3 × faktorial(2)
            │
            ▼
       5 × 4 × 3 × 2 × faktorial(1)
            │
            ▼
       5 × 4 × 3 × 2 × 1 (Base Case Tercapai)
            │
            ▼
       Hasil Akhir = 120
```

**Hafalan:**

```text
Base Case       → Kondisi penghenti agar fungsi tidak memanggil dirinya selamanya
Recursive Step  → Pemanggilan fungsi kembali dengan nilai parameter yang mengecil
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Selalu pastikan *Base Case* ditulis di baris paling awal fungsi rekursif.
- ❌ **Kesalahan Umum:** Lupa mendefinisikan *Base Case*, yang menyebabkan memori habis akibat *infinite recursion / Maximum function nesting level reached*.

---

<a id="bagian-41"></a>

## 41. 🟡 File Inclusion (`require`, `include`, `require_once`)

#### Konsep

File inclusion adalah cara membagi kode program kita ke dalam beberapa file terpisah agar rapi dan mudah dikelola, lalu memanggilnya kembali saat dibutuhkan.

Perbedaan 4 perintah pemanggilan file:
- `include` : Jika file tidak ditemukan, hanya muncul peringatan (*warning*) dan program **tetap lanjut berjalan**.
- `require` : Jika file tidak ditemukan, program langsung **berhenti total (*fatal error*)**.
- `include_once` : Sama seperti `include`, namun memastikan file hanya dimuat tepat 1 kali saja.
- `require_once` : Sama seperti `require`, namun memastikan file hanya dimuat tepat 1 kali saja (**standar industri yang paling sering digunakan** untuk mencegah error fungsi ganda).

#### Contoh

File `config.php`:

```php
<?php
const APP_TITLE = "Sistem Kasir";
$appVersion = "2.1.0";
```

File utama `app.php`:

```php
<?php

require_once __DIR__ . "/config.php";

echo "Aplikasi: " . APP_TITLE . " (v$appVersion)";
```

#### Output

```text
Aplikasi: Sistem Kasir (v2.1.0)
```

#### Matriks Perbandingan File Inclusion

```text
       Perintah             Jika File Hilang       Cegah Duplikasi Ganda?
       ──────────────────────────────────────────────────────────────────
       include              Warning (Jalan terus)  Tidak
       require              Fatal Error (Stop)     Tidak
       include_once         Warning (Jalan terus)  Ya (Hanya 1x)
       require_once         Fatal Error (Stop)     Ya (Hanya 1x - Standar)
```

**Hafalan:**

```text
require_once __DIR__ . '/file.php'   → Muat file wajib tepat 1 kali (standar industri)
__DIR__                             → Magic constant: direktori file saat ini berada
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Selalu gunakan path absolut dengan bantuan magic constant `__DIR__` (contoh: `require_once __DIR__ . '/helper.php'`).
- ❌ **Kesalahan Umum:** Menggunakan `include` biasa untuk file konfigurasi database atau fungsi inti yang fatal jika hilang.

---

<a id="bagian-42"></a>

## 42. 🔴 Operator Array & Spread Operator (`...`)

#### Konsep

Selain fungsi biasa, PHP memiliki operator khusus untuk mengolah array dengan cepat:

1. **Array Union Operator (`+`):** Menggabungkan dua array. Jika ada kunci yang sama, data dari array sisi kiri yang akan dipertahankan.
2. **Spread Operator (`...`):** (Fitur modern sejak PHP 7.4) Membongkar dan menuangkan seluruh isi array ke dalam array baru secara instan dan bersih.

#### Contoh

```php
<?php

// 1. Array Union Operator (+)
$defaultSetting = ["tema" => "light", "bahasa" => "id", "zoom" => 100];
$userSetting    = ["tema" => "dark", "sidebar" => "mini"];

// Array kiri ($userSetting) menang atas key yang sama
$pengaturanFinal = $userSetting + $defaultSetting;
print_r($pengaturanFinal);

// 2. Spread Operator (...) Unpacking
$buah1 = ["Apel", "Jeruk"];
$buah2 = ["Mangga", "Pisang"];
$semuaBuah = [...$buah1, "Melon", ...$buah2];

print_r($semuaBuah);
```

#### Output

```text
Array
(
    [tema] => dark
    [sidebar] => mini
    [bahasa] => id
    [zoom] => 100
)
Array
(
    [0] => Apel
    [1] => Jeruk
    [2] => Melon
    [3] => Mangga
    [4] => Pisang
)
```

**Hafalan:**

```text
$arrayA + $arrayB    → Array union: pertahankan key dari $arrayA jika ada duplikasi
[...$array1, ...$array2]  → Spread operator: membongkar dan menggabungkan array modern
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan spread operator `[...$a, ...$b]` untuk menggabungkan array terindeks numerik pada PHP 8+.
- ❌ **Kesalahan Umum:** Mengharapkan operator union `+` menimpa elemen array indexed seperti halnya `array_merge()`.

---

<a id="bagian-43"></a>

## 43. 🔴 Reference (`&`) pada Variable & Parameter

#### Konsep

Secara default di PHP, saat kita menyalin variabel atau mengirimnya ke fungsi, nilainya akan diduplikasi (*Pass by Value*).

Dengan menambahkan simbol ampersand (`&`), kita membuat **Reference (Alamat Bersama)**. Dua variabel akan menunjuk ke lokasi memori yang sama persis (seperti dua remote pengendali untuk satu televisi). Jika isi salah satu variabel diganti, variabel pasangannya akan otomatis ikut berubah.

#### Contoh

```php
<?php

// 1. Reference pada Variabel
$namaAsli = "Budi";
$namaAlias = &$namaAsli; // Menunjuk ke memori yang sama

$namaAlias = "Andi";
echo "Nama Asli: " . $namaAsli . PHP_EOL; // Ikut berubah menjadi "Andi"

// 2. Passing by Reference pada Parameter Fungsi
function tambahkanBonus(int &$saldo, int $bonus): void
{
    $saldo += $bonus; // Mengubah langsung variabel di luar fungsi
}

$dompet = 50000;
tambahkanBonus($dompet, 25000);
echo "Isi dompet setelah bonus: Rp " . $dompet;
```

#### Output

```text
Nama Asli: Andi
Isi dompet setelah bonus: Rp 75000
```

#### Visualisasi Memori: By Value vs By Reference

```text
       Pass By Value ($b = $a)           Pass By Reference ($b = &$a)
       ┌──────────┬──────────┐           ┌─────────────────────────┐
       │ $a: 10   │ $b: 10   │           │ Alamat Memori (Nilai: 10│
       │ (Slot 1) │ (Slot 2) │           │ $a (Asli) & $b (Alias)  │
       └──────────┴──────────┘           └─────────────────────────┘
       Dua slot memori terpisah          Satu slot memori bersama
```

**Hafalan:**

```text
$alias = &$original           → Membuat variabel alias yang menunjuk ke memori yang sama
function modify(type &$param) → Parameter by-reference: modifikasi langsung data asal
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan *Passing by Reference* secara hati-hati dan hemat, terutama saat memodifikasi data array berukuran sangat besar di tempat.
- ❌ **Kesalahan Umum:** Terlalu banyak menggunakan reference hingga menimbulkan *side-effect* tak terduga di mana variabel luar berubah tanpa disadari.

---

<a id="bagian-44"></a>

## 44. 🔴 `goto` Operator

#### Konsep

Operator `goto` digunakan untuk memerintahkan komputer melompat langsung ke baris kode tertentu yang diberi label (`label:`).

Aturan `goto` di PHP:
- Hanya bisa melompat di dalam file dan fungsi yang sama.
- Tidak bisa melompat masuk ke dalam fungsi atau ke dalam perulangan loop.
- Umumnya dihindari di aplikasi modern karena bisa membuat alur kode melompat-lompat dan membingungkan (*spaghetti code*).

#### Contoh

```php
<?php

$counter = 1;

titikMulai:
echo "Counter: $counter" . PHP_EOL;
$counter++;

if ($counter <= 3) {
    goto titikMulai; // Melompat kembali ke label titikMulai
}

echo "Perulangan selesai!";
```

#### Output

```text
Counter: 1
Counter: 2
Counter: 3
Perulangan selesai!
```

**Hafalan:**

```text
targetLabel:     → Deklarasi titik tujuan lompatan label
goto targetLabel → Perintahkan interpreter langsung melompat ke label tujuan
```

#### Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Hindari penggunaan `goto` dalam alur program aplikasi modern. Gunakan struktur standar (`while`, `for`, `function`, `try-catch`).
- ❌ **Kesalahan Umum:** Menggunakan `goto` secara berlebihan sehingga menciptakan *Spaghetti Code* yang mustahil untuk di-debug dan dipelihara.

---

<a id="bagian-45"></a>

## 45. 🛠️ Peta Ingatan Cepat

Mental model komprehensif hubungan seluruh konsep fundamental PHP:

```text
       ┌───────────────────────────────────────────────────────────────┐
       │                   STRUKTUR PROGRAM PHP                        │
       └───────────────────────────────┬───────────────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
   PENYIMPANAN DATA             KONTROL LOGIKA                REUSABLE LOGIC
 ┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
 │ Variable ($name) │         │ If / Elseif      │         │ Named Function   │
 │ Constant (const) │         │ Ternary (?:)     │         │ Type Declaration │
 │ Scalar Types     │         │ Null Coal. (??)  │         │ Arrow Func (fn)  │
 │ Indexed Array    │         │ Switch / Match   │         │ Anonymous (use)  │
 │ Assoc. Array     │         │ For / Foreach    │         │ Require / Include│
 └──────────────────┘         └──────────────────┘         └──────────────────┘
         │                             │                             │
         └─────────────────────────────┼─────────────────────────────┘
                                       │
                                       ▼
       ┌───────────────────────────────────────────────────────────────┐
       │                    OUTPUT / HASIL AKHIR                       │
       │           echo $output  |  JSON  |  Terminal CLI              │
       └───────────────────────────────────────────────────────────────┘
```

**Peta Ringkas Operasi:**

```text
Data Masuk       → Variable ($var), Array (['k' => 'v']), Data Types (int, string, bool)
Manipulasi       → String Functions (strlen, substr), Array Functions (map, filter, merge)
Keputusan        → Comparison (===, !==), Logical (&&, ||), If-Else, Match (PHP 8+)
Perulangan       → Foreach (paling utama), For (counter), While (kondisi dinamis)
Modularitas      → Function, Type Hinting, Early Return, require_once
```

---

<a id="bagian-46"></a>

## 46. 📚 Tabel Ringkasan

| Fitur / Konsep | Sintaks / API Utama | Fungsi & Kegunaan |
|---|---|---|
| **Cetak Output** | `echo $val;` / `print $val;` | Mengirimkan teks ke response buffer |
| **Konstanta** | `const APP_NAME = "App";` | Menyimpan nilai konstan compile-time |
| **Strict Check** | `$a === $b` / `$a !== $b` | Membandingkan kesamaan nilai dan tipe data |
| **Fallback Null** | `$val ?? $fallback;` | Ambil nilai jika ada dan bukan null |
| **Match Expression** | `match ($val) { 1 => "A", default => "B" };` | Pemetaan nilai modern & strict (PHP 8+) |
| **Iterasi Array** | `foreach ($array as $key => $val)` | Perulangan elemen array paling aman |
| **Filter Array** | `array_filter($array, $callback)` | Menyaring data array berdasarkan kondisi |
| **Transform Array**| `array_map($callback, $array)` | Mengubah setiap elemen array dengan fungsi |
| **Gabung Array** | `array_merge($a, $b)` / `[...$a, ...$b]` | Menggabungkan beberapa array menjadi satu |
| **Teks ke Array** | `explode($delimiter, $string)` | Memecah teks string menjadi array |
| **Array ke Teks** | `implode($glue, $array)` | Menggabungkan array menjadi string utuh |
| **Cek Substring** | `str_contains($text, "cari")` | Memeriksa apakah teks mengandung kata target |
| **Type Hinting** | `function test(int $a): string` | Deklarasi tipe data parameter & return |
| **Arrow Function**| `fn(int $x): int => $x * 2` | Fungsi anonim satu baris ringkas (auto-scope) |
| **Muat File** | `require_once __DIR__ . '/file.php'`| Memuat file dependency wajib tepat 1 kali |

---

<a id="bagian-47"></a>

## 47. ⚡ Cheat Code PHP 10 Detik

```php
<?php

// 1. Variabel, Konstanta & Tipe Data
const APP_ENV = "development";
$nama = "Budi";
$umur = 25;
$isMember = true;

// 2. Array & Manipulasi Modern
$produk = [
    ["nama" => "Kopi", "harga" => 15000],
    ["nama" => "Roti", "harga" => 10000]
];
$produk[] = ["nama" => "Susu", "harga" => 12000];

// 3. Arrow Function & Array Filter
$produkMurah = array_filter($produk, fn(array $p): bool => $p["harga"] <= 12000);

// 4. Match Expression & Null Coalescing
$roleUser = $_GET["role"] ?? "guest";
$akses = match ($roleUser) {
    "admin" => "Full Access",
    "editor", "author" => "Edit Content",
    default => "Read Only"
};

// 5. Function dengan Type Declaration & Early Return
function hitungTotal(array $items): int {
    if (empty($items)) return 0;
    return array_sum(array_column($items, "harga"));
}

$total = hitungTotal($produk);
echo "Total Transaksi: Rp $total | Hak Akses: $akses";
```

---

<a id="bagian-48"></a>

## 48. 🧭 Urutan Belajar yang Disarankan

```text
       ┌────────────────────────────────────────────────────────────┐
       │             TAHAP 1: DASAR SINTAKS & ENVIRONMENT           │
       │  Setup CLI Server ──> Tag PHP ──> Variabel & Data Types    │
       └─────────────────────────────┬──────────────────────────────┘
                                     │
                                     ▼
       ┌────────────────────────────────────────────────────────────┐
       │             TAHAP 2: OPERATOR & CONTROL FLOW               │
       │  Aritmatika & Strict ──> If-Else & Match ──> Foreach Loop  │
       └─────────────────────────────┬──────────────────────────────┘
                                     │
                                     ▼
       ┌────────────────────────────────────────────────────────────┐
       │             TAHAP 3: STRUKTUR DATA & FUNGSI BAWAAN         │
       │  String Functions ──> Array Functions (map/filter) ──> is_*│
       └─────────────────────────────┬──────────────────────────────┘
                                     │
                                     ▼
       ┌────────────────────────────────────────────────────────────┐
       │             TAHAP 4: MODULARITAS & MODERN FUNCTION         │
       │  Function & Type Hints ──> Arrow Function ──> require_once │
       └─────────────────────────────┬──────────────────────────────┘
                                     │
                                     ▼
       ┌────────────────────────────────────────────────────────────┐
       │             TAHAP 5: PRAKTIK PROJECT & NEXT STEP           │
       │  Mini Project CLI Kasir ──> Siap Masuk PHP OOP & Laravel   │
       └────────────────────────────────────────────────────────────┘
```

---

<a id="bagian-49"></a>

## 49. 🏗️ Mini Project: Aplikasi Kasir & Inventaris CLI Interaktif

Mini project ini menggabungkan seluruh konsep dasar PHP: **Type Declarations**, **Associative Array**, **Arrow Functions**, **Array Functions (`array_map`, `array_filter`, `array_sum`)**, **Control Flow (Match & If-Else)**, dan **Modular Functions**.

##### Kode Program (`kasir.php`)

```php
<?php

declare(strict_types=1);

// 1. Data Inventaris Toko (Multidimensional Associative Array)
$inventaris = [
    ["id" => 1, "nama" => "Kopi Tubruk", "kategori" => "Minuman", "harga" => 12000, "stok" => 15],
    ["id" => 2, "nama" => "Teh Manis",   "kategori" => "Minuman", "harga" => 5000,  "stok" => 20],
    ["id" => 3, "nama" => "Roti Bakar",  "kategori" => "Makanan", "harga" => 18000, "stok" => 8],
    ["id" => 4, "nama" => "Nasi Goreng", "kategori" => "Makanan", "harga" => 25000, "stok" => 10],
];

// 2. Fungsi Menampilkan Daftar Produk
function tampilkanMenu(array $items): void
{
    echo "==================================================" . PHP_EOL;
    echo "            DAFTAR PRODUK & STOK TOKO             " . PHP_EOL;
    echo "==================================================" . PHP_EOL;
    printf("%-4s | %-16s | %-8s | %-10s | %s\n", "ID", "Nama Produk", "Kategori", "Harga", "Stok");
    echo "--------------------------------------------------" . PHP_EOL;
    
    foreach ($items as $p) {
        printf(
            "%-4d | %-16s | %-8s | Rp %-7d | %d pcs\n",
            $p["id"],
            $p["nama"],
            $p["kategori"],
            $p["harga"],
            $p["stok"]
        );
    }
    echo "==================================================" . PHP_EOL;
}

// 3. Fungsi Menghitung Subtotal Item Keranjang Belanja
function hitungSubtotal(array $keranjang, array $inventaris): array
{
    $itemDaftar = [];
    
    foreach ($keranjang as $item) {
        $produkId = $item["id"];
        $qty = $item["qty"];
        
        // Cari data produk berdasarkan ID
        $produk = null;
        foreach ($inventaris as $p) {
            if ($p["id"] === $produkId) {
                $produk = $p;
                break;
            }
        }
        
        if ($produk !== null) {
            $subtotal = $produk["harga"] * $qty;
            $itemDaftar[] = [
                "nama" => $produk["nama"],
                "harga" => $produk["harga"],
                "qty" => $qty,
                "subtotal" => $subtotal,
            ];
        }
    }
    
    return $itemDaftar;
}

// 4. Fungsi Hitung Diskon Member (Match Expression)
function dapatkanPersentaseDiskon(string $tipeMember): float
{
    return match (strtolower($tipeMember)) {
        "gold" => 0.15,      // Diskon 15%
        "silver" => 0.10,    // Diskon 10%
        "bronze" => 0.05,    // Diskon 5%
        default => 0.00      // Non-member
    };
}

// 5. Eksekusi Simulasi Transaksi Kasir
tampilkanMenu($inventaris);

// Simulasi Keranjang Belanja Pelanggan
$keranjangBelanja = [
    ["id" => 1, "qty" => 2], // 2x Kopi Tubruk (12.000 x 2 = 24.000)
    ["id" => 3, "qty" => 1], // 1x Roti Bakar  (18.000 x 1 = 18.000)
    ["id" => 4, "qty" => 2], // 2x Nasi Goreng (25.000 x 2 = 50.000)
];

$tipeMemberPelanggan = "Gold";

$rincianItem = hitungSubtotal($keranjangBelanja, $inventaris);
$totalKotor = array_sum(array_column($rincianItem, "subtotal"));

$persenDiskon = dapatkanPersentaseDiskon($tipeMemberPelanggan);
$nominalDiskon = (int) ($totalKotor * $persenDiskon);
$totalBersih = $totalKotor - $nominalDiskon;

echo PHP_EOL . "STRUK TRANSAKSI PEMBAYARAN" . PHP_EOL;
echo "Tipe Pelanggan: Member " . strtoupper($tipeMemberPelanggan) . PHP_EOL;
echo "--------------------------------------------------" . PHP_EOL;

foreach ($rincianItem as $item) {
    printf("%-16s (%d x Rp %-6d) = Rp %d\n", $item["nama"], $item["qty"], $item["harga"], $item["subtotal"]);
}

echo "--------------------------------------------------" . PHP_EOL;
echo "Total Kotor    : Rp " . number_format($totalKotor, 0, ",", ".") . PHP_EOL;
echo "Diskon Member  : Rp " . number_format($nominalDiskon, 0, ",", ".") . " (" . ($persenDiskon * 100) . "%)" . PHP_EOL;
echo "Total Bayar    : Rp " . number_format($totalBersih, 0, ",", ".") . PHP_EOL;
echo "==================================================" . PHP_EOL;
echo "Status: Pembayaran Berhasil Disimpan!" . PHP_EOL;
```

##### Output Eksekusi Program

```text
==================================================
            DAFTAR PRODUK & STOK TOKO             
==================================================
ID   | Nama Produk      | Kategori | Harga      | Stok
--------------------------------------------------
1    | Kopi Tubruk      | Minuman  | Rp 12000   | 15 pcs
2    | Teh Manis        | Minuman  | Rp 5000    | 20 pcs
3    | Roti Bakar       | Makanan  | Rp 18000   | 8 pcs
4    | Nasi Goreng      | Makanan  | Rp 25000   | 10 pcs
==================================================

STRUK TRANSAKSI PEMBAYARAN
Tipe Pelanggan: Member GOLD
--------------------------------------------------
Kopi Tubruk      (2 x Rp 12000 ) = Rp 24000
Roti Bakar       (1 x Rp 18000 ) = Rp 18000
Nasi Goreng      (2 x Rp 25000 ) = Rp 50000
--------------------------------------------------
Total Kotor    : Rp 92.000
Diskon Member  : Rp 13.800 (15%)
Total Bayar    : Rp 78.200
==================================================
Status: Pembayaran Berhasil Disimpan!
```

---

<a id="bagian-50"></a>

## 50. 🔗 Referensi Resmi

- [Dokumentasi Resmi PHP (PHP Manual)](https://www.php.net/manual/en/)

- [PHP Language Reference (Syntax & Types)](https://www.php.net/manual/en/langref.php)

- [PHP Types (Type Declarations & Scalar Types)](https://www.php.net/manual/en/language.types.php)

- [PHP Control Structures (If, Switch, Match, Loops)](https://www.php.net/manual/en/language.control-structures.php)

- [PHP Functions (Arguments, Type Hinting, Closures, Arrow Functions)](https://www.php.net/manual/en/language.functions.php)

- [PHP Array Functions Reference](https://www.php.net/manual/en/ref.array.php)

- [PHP String Functions Reference](https://www.php.net/manual/en/ref.strings.php)

- [PHP PSR Standards (PHP Standards Recommendations)](https://www.php-fig.org/psr/)
