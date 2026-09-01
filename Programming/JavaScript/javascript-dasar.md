---
title: "JavaScript Dasar"
description: "Fundamental JavaScript modern (ES6+): variable, tipe data, operator, control flow, function, scope, closure, dan mental model runtime."
order: 1
tags:
  - programming
  - javascript
  - frontend
  - fundamental
---

# JavaScript Dasar

> **Target:** Pemula yang baru mulai belajar pemrograman modern dengan JavaScript (ES2020+).
>
> Fokus cheatsheet ini: **mental model engine → sintaks & tag dasar → tipe data & variabel → operator & perbandingan → control flow & loop → array & object → functions & advanced functions → closure & this → modern ES syntax & best practice**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami untuk mulai menulis kode JavaScript yang benar dan aman

🟡 Lanjutan
→ pelajari setelah memahami control flow, array, object, dan function dasar

🔴 Advanced / Operasional
→ penting untuk pemahaman mendalam, arsitektur kode modern, dan performa
```

Mental model eksekusi JavaScript pada Browser dan Node.js Runtime:

```text
       Source Code JavaScript (.js / <script>)
                         │
                         ▼
             JavaScript Engine (V8 / SpiderMonkey)
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
       Parser                    Call Stack & Heap
    (Syntax & AST)             (Memori & Eksekusi)
         │                               │
         ▼                               ▼
     Bytecode / JIT             Event Loop & Web APIs
    (Mesin Eksekusi)           (Async, DOM, Timers)
         │                               │
         └───────────────┬───────────────┘
                         │
                         ▼
        Hasil Output (Console / UI / Server)
```

**Hafalan:**

```text
JavaScript   → Bahasa pemrograman dinamis yang berjalan di browser (client) dan Node.js (server)
Dynamically  → Tipe data ditentukan secara otomatis saat runtime berdasarkan nilai yang diberikan
Case-Sens    → Huruf besar dan kecil dibedakan (namaUser ≠ namauser)
Statement    → Instruksi program yang lazimnya diakhiri tanda titik koma (;)
Block Code   → Kumpulan statement yang dibungkus kurung kurawal { ... }
First-Class  → Function diperlakukan seperti nilai biasa (bisa disimpan di variabel & dioper)
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan JavaScript & Mental Model Engine](#bagian-1)
2. [Program Hello World & Tag `<script>`](#bagian-2)
3. [Komentar & Dokumentasi Kode](#bagian-3)
4. [Tipe Data Number & BigInt](#bagian-4)
5. [Tipe Data Boolean](#bagian-5)
6. [Tipe Data String & Escape Character](#bagian-6)
7. [Variable (let, const, var)](#bagian-7)
8. [Operator Matematika & Penugasan](#bagian-8)
9. [Operator Perbandingan (Strict vs Loose)](#bagian-9)
10. [Operator Logika (&&, ||, !)](#bagian-10)
11. [Console & Debug Output](#bagian-11)
12. [String Template (Template Literals)](#bagian-12)
13. [Konversi String dan Number](#bagian-13)
14. [Tipe Data Array Dasar](#bagian-14)
15. [Tipe Data Object Dasar](#bagian-15)
16. [Undefined dan Null](#bagian-16)
17. [If, Else If, dan Else Statement](#bagian-17)

### 🟡 Lanjutan

18. [Popup Dialog (alert, prompt, confirm)](#bagian-18)
19. [Switch Statement](#bagian-19)
20. [Operator typeof dan in](#bagian-20)
21. [Ternary Operator (?:)](#bagian-21)
22. [Nullish Coalescing Operator (??)](#bagian-22)
23. [Optional Chaining Operator (?.)](#bagian-23)
24. [Falsy dan Truthy](#bagian-24)
25. [Operator Logika di Non-Boolean (Short-Circuit Evaluation)](#bagian-25)
26. [For Loop](#bagian-26)
27. [While Loop](#bagian-27)
28. [Do While Loop](#bagian-28)
29. [Break dan Continue](#bagian-29)
30. [Label pada Perulangan](#bagian-30)
31. [For In dan For Of](#bagian-31)
32. [With Statement (dan Mengapa Ditinggalkan)](#bagian-32)
33. [Function Dasar & Deklarasi](#bagian-33)
34. [Parameter dan Return Value](#bagian-34)
35. [Optional Parameter, Default Parameter & Rest Parameter](#bagian-35)

### 🔴 Advanced / Operasional

36. [Function Sebagai Value & Anonymous Function](#bagian-36)
37. [Function dalam Function & Scope](#bagian-37)
38. [Recursive Function](#bagian-38)
39. [Function Generator (function* & yield)](#bagian-39)
40. [Arrow Function (() =>)](#bagian-40)
41. [Closure & Data Privacy](#bagian-41)
42. [Object Method dan Kata Kunci this](#bagian-42)
43. [Arrow Function di Object & Perilaku this](#bagian-43)
44. [Getter dan Setter di Object](#bagian-44)
45. [Masalah Variable var (Hoisting & Scope Leak)](#bagian-45)
46. [Destructuring (Array & Object)](#bagian-46)
47. [Strict Mode ("use strict") & Debugger](#bagian-47)

### 🛠️ Referensi & Praktik

48. [Peta Ingatan Cepat](#bagian-48)
49. [Tabel Ringkasan](#bagian-49)
50. [Cheat Code JavaScript Dasar 10 Detik](#bagian-50)
51. [Urutan Belajar yang Disarankan](#bagian-51)
52. [Mini Project: Sistem Manajemen Kasir & Belanja Interaktif](#bagian-52)
53. [Referensi Resmi](#bagian-53)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan JavaScript & Mental Model Engine

#### Konsep

**JavaScript** adalah bahasa pemrograman tingkat tinggi (*high-level*), dinamis (*dynamically typed*), dan interpreted/JIT-compiled yang awalnya dibuat untuk menghidupkan halaman web di sisi peramban (*browser*).

Saat ini, JavaScript tidak hanya berjalan di browser, tetapi juga di server (*Node.js*, *Deno*, *Bun*), aplikasi mobile (*React Native*), hingga aplikasi desktop (*Electron*).

Tiga pilar utama web:
- **HTML:** Struktur dan konten halaman web (kerangka bangunan).
- **CSS:** Tampilan, warna, tata letak, dan animasi visual (desain & estetika).
- **JavaScript:** Perilaku dinamis, logika interaksi, dan manipulasi data (kelistrikan & otomasi).

Ciri khas JavaScript:
- **Dynamically Typed:** Variabel tidak terikat secara kaku pada satu tipe data tertentu.
- **Single-Threaded Non-Blocking:** Mengeksekusi satu instruksi utama dalam satu waktu dengan bantuan *Event Loop* untuk operasi asynchronous.
- **First-Class Functions:** Fungsi dianggap sebagai nilai biasa yang bisa disimpan di variabel, dikirim sebagai argumen, atau dikembalikan dari fungsi lain.

#### Contoh

```javascript
// Menampilkan pesan selamat datang di console
const frameworkName = "JavaScript Modern";
const releaseYear = 1995;
const isAwesome = true;

console.log("Bahasa:", frameworkName);
console.log("Tahun Rilis:", releaseYear);
console.log("Menyenangkan?", isAwesome);
```

#### Output

```text
Bahasa: JavaScript Modern
Tahun Rilis: 1995
Menyenangkan? true
```

#### Cara Kerja

```text
          Browser / Node.js Engine
                     │
                     ▼
          Membaca Script JavaScript
                     │
                     ▼
         Parsing Syntax & Tokenizing
                     │
                     ▼
        Eksekusi Perintah Baris per Baris
                     │
                     ▼
         Output Ditampilkan di Console
```

**Hafalan:**

```text
HTML        → Struktur dokumen web
CSS         → Styling & visual dokumen
JavaScript  → Logika, interaksi, dan manipulasi data
Console     → Tempat melihat log, informasi, dan debugging runtime
```

#### Best Practice & Kesalahan Umum

- ✅ Pahami bahwa JavaScript berjalan di runtime environment (Browser memiliki API DOM/Window, Node.js memiliki API File System/Process).
- ❌ Jangan menganggap JavaScript sama dengan Java; keduanya adalah bahasa yang sangat berbeda dari segi arsitektur maupun filosofi desain.

---

<a id="bagian-2"></a>

## 2. 🟢 Program Hello World & Tag `<script>`

#### Konsep

Untuk menjalankan JavaScript di browser, kita menyematkan kode di dalam elemen HTML menggunakan tag `<script>`. Terdapat dua cara utama:
1. **Inline Script:** Kode JavaScript ditulis langsung di antara tag `<script> ... </script>`.
2. **External Script:** Kode ditulis di file terpisah (misalnya `app.js`) lalu dihubungkan dengan atribut `src="app.js"`.

External script sangat direkomendasikan karena memisahkan antara struktur halaman (HTML) dengan logika aplikasi (JS), sehingga kode lebih bersih dan mudah dirawat.

#### Contoh

**Cara 1: Inline Script di dalam HTML**

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Hello World JS</title>
</head>
<body>
    <h1>Belajar JavaScript Dasar</h1>

    <script>
        console.log("Hello, World dari Inline Script!");
    </script>
</body>
</html>
```

**Cara 2: External Script (Best Practice)**

File `index.html`:
```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Hello World JS</title>
</head>
<body>
    <h1>Belajar JavaScript Dasar</h1>

    <script src="main.js"></script>
</body>
</html>
```

File `main.js`:
```javascript
console.log("Hello, World dari file External!");
```

#### Output

Di browser Developer Tools (Console tab):
```text
Hello, World dari file External!
```

#### Cara Kerja

```text
       Browser memuat index.html
                  │
                  ▼
       Membaca tag <script src="main.js">
                  │
                  ▼
       Mengunduh & Mengeksekusi main.js
                  │
                  ▼
       Mencetak teks ke Web Console
```

**Hafalan:**

```text
<script> ... </script>      → Menjalankan kode JavaScript inline di HTML
<script src="path/to/file"> → Memuat file JavaScript eksternal
console.log(message)         → Mencetak pesan/data ke jendela konsol pengembang
```

#### Best Practice & Kesalahan Umum

- ✅ Letakkan tag `<script>` di bagian akhir tag `<body>` atau gunakan atribut `defer` di dalam `<head>` agar proses rendering tampilan HTML tidak terhalang.
- ❌ Jangan menuliskan kode JavaScript yang panjang secara inline di dalam file HTML.

---

<a id="bagian-3"></a>

## 3. 🟢 Komentar & Dokumentasi Kode

#### Konsep

**Komentar** adalah baris teks di dalam kode program yang diabaikan oleh engine JavaScript saat eksekusi berlangsung. Komentar berfungsi untuk:
- Memberikan penjelasan alur logika yang rumit bagi pengembang lain atau diri sendiri di masa depan.
- Menonaktifkan sementara baris kode tertentu saat proses debugging.
- Membuat dokumentasi format *JSDoc* untuk parameter dan return value function.

Jenis komentar di JavaScript:
1. **Single-line Comment:** Dimulai dengan tanda `//` (berlaku sampai akhir baris).
2. **Multi-line Comment:** Dibungkus dengan `/* ... */` (bisa mencakup beberapa baris).

#### Contoh

```javascript
// Ini adalah komentar satu baris (single-line)
const basePrice = 50000; // Harga dasar produk

/*
  Ini adalah komentar multi-baris (multi-line).
  Sangat cocok untuk menuliskan penjelasan algoritma
  atau catatan penting yang membutuhkan uraian panjang.
*/
const taxRate = 0.11; // PPN 11%

/**
 * Menghitung total harga setelah ditambah pajak
 * @param {number} price - Harga asli barang
 * @param {number} tax - Tarif pajak (contoh: 0.11)
 * @returns {number} Total harga final
 */
function calculateTotal(price, tax) {
    return price + (price * tax);
}

console.log("Total:", calculateTotal(basePrice, taxRate));
```

#### Output

```text
Total: 55500
```

#### Cara Kerja

```text
        Kode Sumber JavaScript
                  │
                  ▼
         JavaScript Lexer / Parser
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
   Komentar (// atau /* */)  Baris Kode Aktif
        │                   │
        ▼                   ▼
    Dibuang / Diabaikan    Diterjemahkan ke Bytecode
```

**Hafalan:**

```text
// text          → Komentar satu baris
/* text */       → Komentar banyak baris
/** JSDoc */     → Komentar dokumentasi fungsi, tipe data, dan parameter
```

#### Best Practice & Kesalahan Umum

- ✅ Tulis komentar yang menjelaskan **MENGAPA** (*Why*) sebuah kode dibuat seperti itu, bukan sekadar mengulang apa yang sudah jelas terbaca dari kode (*What*).
- ❌ Hindari membiarkan kode lama yang sudah usang menumpuk sebagai komentar di repositori; manfaatkan Git version control untuk melacak history kode.

---

<a id="bagian-4"></a>

## 4. 🟢 Tipe Data Number & BigInt

#### Konsep

Di JavaScript, angka bulat (*integer*) dan angka desimal (*floating point*) berada di bawah satu tipe data yang sama, yaitu **Number** (berbasis standar IEEE 754 64-bit float).

Karakteristik Tipe Number:
- Mendukung bilangan bulat (`10`, `-5`) dan desimal (`3.14`, `0.05`).
- Mendukung format heksadesimal (`0xFF`), biner (`0b1010`), dan oktal (`0o77`).
- Memiliki nilai khusus:
  - `Infinity` dan `-Infinity`: Hasil pembagian dengan angka nol.
  - `NaN` (*Not a Number*): Hasil operasi matematika yang tidak valid (misal: `"halo" * 2`).

Untuk bilangan bulat raksasa yang melampaui batas aman Number (`Number.MAX_SAFE_INTEGER` = `9007199254740991`), JavaScript menyediakan tipe data **BigInt** dengan menambahkan akhiran huruf `n` di belakang angka.

#### Contoh

```javascript
// Tipe data Number standar
const integerNumber = 100;
const decimalNumber = 99.5;
const hexNumber = 0xFF; // 255 dalam desimal
const binaryNumber = 0b1010; // 10 dalam desimal

console.log("Integer:", integerNumber);
console.log("Decimal:", decimalNumber);
console.log("Heksadesimal (0xFF):", hexNumber);
console.log("Biner (0b1010):", binaryNumber);

// Nilai spesial Number
const divideByZero = 100 / 0;
const invalidMath = "apel" * 5;

console.log("Bagi Nol:", divideByZero); // Infinity
console.log("Operasi Tidak Valid:", invalidMath); // NaN

// Tipe data BigInt (angka sangat besar)
const bigNumber = 9007199254740991n + 10n;
console.log("BigInt Value:", bigNumber);
```

#### Output

```text
Integer: 100
Decimal: 99.5
Heksadesimal (0xFF): 255
Biner (0b1010): 10
Bagi Nol: Infinity
Operasi Tidak Valid: NaN
BigInt Value: 9007199254741001n
```

#### Cara Kerja

```text
                  Nilai Angka di JavaScript
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
      Tipe Number                        Tipe BigInt
   (Standar IEEE 754)                (Presisi Tak Hingga)
   - Max: 2^53 - 1                   - Diberi akhiran 'n'
   - Termasuk desimal & NaN          - Hanya untuk bilangan bulat
```

**Hafalan:**

```text
Number.isFinite(value)  → Mengecek apakah nilai adalah angka valid (bukan Infinity/NaN)
Number.isNaN(value)     → Mengecek apakah nilai bernilai NaN secara pasti
123n                    → Bilangan BigInt untuk angka di atas 9 kuadriliun
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan `Number.isNaN(value)` untuk memvalidasi apakah suatu variabel menghasilkan `NaN` (jangan gunakan perbandingan `value === NaN` karena `NaN === NaN` bernilai `false`).
- ❌ Jangan mencampur operasi matematika langsung antara tipe `Number` biasa dan `BigInt` tanpa konversi tipe terlebih dahulu (akan menghasilkan `TypeError`).

---

<a id="bagian-5"></a>

## 5. 🟢 Tipe Data Boolean

#### Konsep

Tipe data **Boolean** adalah tipe data logika yang paling sederhana karena hanya memiliki tepat dua kemungkinan nilai:
1. `true` (Benar / Aktif / Mengiyakan)
2. `false` (Salah / Tidak Aktif / Menolak)

Tipe data Boolean menjadi pondasi dari seluruh logika percabangan (*if/else*), perulangan (*looping*), serta evaluasi kondisi dalam program. Nilai boolean biasanya dihasilkan dari operator perbandingan atau ekspresi logika.

#### Contoh

```javascript
const isUserLoggedIn = true;
const hasAdminAccess = false;

console.log("Status Login:", isUserLoggedIn);
console.log("Status Admin:", hasAdminAccess);

// Menghasilkan boolean dari perbandingan logika
const age = 20;
const isAdult = age >= 17;

console.log("Apakah sudah dewasa (>= 17)?", isAdult);
```

#### Output

```text
Status Login: true
Status Admin: false
Apakah sudah dewasa (>= 17)? true
```

#### Cara Kerja

```text
           Ekspresi / Kondisi: (age >= 17)
                          │
                          ▼
            Evaluasi Logika oleh Engine
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
          true                        false
    (Kondisi Terpenuhi)        (Kondisi Tidak Terpenuhi)
```

**Hafalan:**

```text
true   → Merepresentasikan nilai kebenaran (aktif / lolos seleksi)
false  → Merepresentasikan nilai ketidakbenaran (mati / gagal seleksi)
Boolean(value) → Mengonversi nilai apa pun menjadi tipe boolean
```

#### Best Practice & Kesalahan Umum

- ✅ Beri nama variabel boolean dengan awalan kata kerja predikat yang jelas seperti `is`, `has`, `can`, `should` (misal: `isActive`, `hasPermission`, `canDelete`).
- ❌ Hindari membungkus boolean dengan tanda petik (misal: `"false"`), karena string `"false"` bukan boolean dan akan dianggap *truthy* dalam evaluasi kondisi.

---

<a id="bagian-6"></a>

## 6. 🟢 Tipe Data String & Escape Character

#### Konsep

**String** adalah tipe data yang digunakan untuk menampung teks, huruf, kata, atau kalimat. Di JavaScript, string dapat dideklarasikan menggunakan tiga jenis tanda petik:
1. **Petik Tunggal (`'...`):** Standar string sederhana.
2. **Petik Ganda (`"..."`):** Standar string sederhana (tidak ada perbedaan fungsional dengan petik tunggal).
3. **Backtick (``...``):** Template literals (mendukung multi-baris dan interpolasi variabel).

##### Escape Sequence Character
Jika ingin memasukkan karakter khusus (seperti enter, tab, atau tanda petik di dalam string), gunakan tanda backslash (`\`):
- `\n`: Baris baru (*New line / Enter*).
- `\t`: Tabulasi (*Tab indent*).
- `\'`: Karakter tanda petik tunggal.
- `\"`: Karakter tanda petik ganda.
- `\\`: Karakter backslash itu sendiri.

#### Contoh

```javascript
const singleQuote = 'Halo Dunia';
const doubleQuote = "Belajar JavaScript";

// Menggunakan escape character
const quoteWithQuotes = 'Dia berkata: "Belajar coding itu seru!"';
const multiLineEscape = "Baris Pertama\nBaris Kedua\nBaris Ketiga";
const tabEscape = "Nama:\tBudi Santoso";

console.log(singleQuote);
console.log(doubleQuote);
console.log(quoteWithQuotes);
console.log(multiLineEscape);
console.log(tabEscape);

// Menggabungkan string (Concatenation)
const firstName = "John";
const lastName = "Doe";
const fullName = firstName + " " + lastName;

console.log("Nama Lengkap:", fullName);
```

#### Output

```text
Halo Dunia
Belajar JavaScript
Dia berkata: "Belajar coding itu seru!"
Baris Pertama
Baris Kedua
Baris Ketiga
Nama:	Budi Santoso
Nama Lengkap: John Doe
```

#### Cara Kerja

```text
     Karakter String: "Baris 1\nBaris 2"
                     │
                     ▼
           Deteksi Escape Character (\n)
                     │
                     ▼
        Dirender sebagai Pindah Baris Baru
```

**Hafalan:**

```text
string.length           → Menghitung jumlah panjang karakter dalam string
string1 + string2       → Menggabungkan dua atau lebih string (concatenation)
\n                     → Escape character untuk baris baru (new line)
\t                     → Escape character untuk tabulasi indent
```

#### Best Practice & Kesalahan Umum

- ✅ Konsisten gunakan satu jenis kutipan dalam project (biasanya petik ganda `""` atau tunggal `''` sesuai panduan linter ESLint/Prettier).
- ❌ Jangan membuat string multi-baris secara manual menggunakan konkatenasi `+` yang berulang jika bisa menggunakan template literals dengan backtick.

---

<a id="bagian-7"></a>

## 7. 🟢 Variable (let, const, var)

#### Konsep

**Variable** adalah wadah di memori komputer yang diberi nama untuk menyimpan data sehingga nilainya dapat digunakan dan diolah berulang kali.

JavaScript modern memiliki 3 kata kunci untuk membuat variabel:
1. **`const` (Constant - Sangat Direkomendasikan):** Digunakan untuk nilai yang tidak boleh diubah (*reassign*). Wajib langsung diisi nilai awal saat dideklarasikan.
2. **`let` (Direkomendasikan jika nilainya berubah):** Digunakan untuk variabel yang nilainya akan dimutasi atau diisi ulang di kemudian hari.
3. **`var` (Legacy / Tinggalkan):** Cara lama sebelum standar ES6 (2015). Memiliki masalah kebocoran scope (*function scope*, bukan *block scope*) dan rawan menyebabkan bug.

#### Contoh

```javascript
// 1. Menggunakan const (Nilai tetap)
const appName = "E-Commerce App";
const maxLoginAttempts = 3;

// appName = "New App"; // Error! Assignment to constant variable.

// 2. Menggunakan let (Nilai bisa diperbarui)
let currentScore = 10;
console.log("Score awal:", currentScore);

currentScore = 25; // Nilai berhasil diubah
console.log("Score baru:", currentScore);

// 3. Block Scope pada const dan let
{
    const secretKey = "RAHASIA_123";
    let temporaryCount = 5;
    console.log("Di dalam block:", secretKey, temporaryCount);
}

// console.log(secretKey); // ReferenceError: secretKey is not defined (Aman di dalam block)
```

#### Output

```text
Score awal: 10
Score baru: 25
Di dalam block: RAHASIA_123 5
```

#### Cara Kerja

```text
            Pilihan Deklarasi Variabel
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
   Apakah nilainya               Apakah nilainya
     akan berubah?                 selalu tetap?
         │                             │
         ▼                             ▼
    Gunakan let                  Gunakan const
 (Mutable & Block Scope)     (Immutable & Block Scope)
```

**Hafalan:**

```text
const identifier = value → Deklarasi variabel konstan yang tidak bisa diubah nilainya
let identifier = value   → Deklarasi variabel yang nilainya bisa diubah kapan saja
var identifier = value   → Deklarasi model lama (jangan digunakan di kode modern)
```

#### Best Practice & Kesalahan Umum

- ✅ Selalu jadikan `const` sebagai pilihan utama secara default; hanya ganti menjadi `let` jika memang variabel tersebut nilainya perlu dimutasi (misal penghitung perulangan).
- ❌ Jangan pernah menggunakan `var` di JavaScript modern untuk menghindari bug *hoisting* dan *variable shadowing* yang tidak terduga.

---

<a id="bagian-8"></a>

## 8. 🟢 Operator Matematika & Penugasan

#### Konsep

JavaScript menyediakan sekumpulan operator matematika standar (*Arithmetic Operators*) dan operator penugasan (*Assignment Operators*) untuk memproses perhitungan angka.

##### Operator Aritmatika:
- Penjumlahan: `+`
- Pengurangan: `-`
- Perkalian: `*`
- Pembagian: `/`
- Sisa Bagi (Modulus): `%`
- Perpangkatan (Exponentiation): `**`

##### Operator Augmented Assignment (Penugasan Singkat):
Memodifikasi variabel sekaligus menyimpannya kembali:
- `a += b` sama dengan `a = a + b`
- `a -= b` sama dengan `a = a - b`
- `a *= b` sama dengan `a = a * b`
- `a /= b` sama dengan `a = a / b`
- `a %= b` sama dengan `a = a % b`

##### Increment & Decrement:
- `++a` / `a++`: Menambah nilai sebanyak 1.
- `--a` / `a--`: Mengurangi nilai sebanyak 1.

#### Contoh

```javascript
const numA = 10;
const numB = 3;

console.log("Penjumlahan (10 + 3):", numA + numB);
console.log("Pengurangan (10 - 3):", numA - numB);
console.log("Perkalian (10 * 3):", numA * numB);
console.log("Pembagian (10 / 3):", numA / numB);
console.log("Sisa Bagi / Modulus (10 % 3):", numA % numB);
console.log("Pangkat (10 ** 3):", numA ** numB);

// Augmented Assignment
let walletBalance = 100000;
walletBalance += 50000; // Top-up 50.000
console.log("Saldo setelah topup:", walletBalance);

walletBalance -= 20000; // Belanja 20.000
console.log("Saldo setelah belanja:", walletBalance);

// Increment & Decrement
let counter = 1;
counter++; // counter menjadi 2
console.log("Counter:", counter);
```

#### Output

```text
Penjumlahan (10 + 3): 13
Pengurangan (10 - 3): 7
Perkalian (10 * 3): 30
Pembagian (10 / 3): 3.3333333333333335
Sisa Bagi / Modulus (10 % 3): 1
Pangkat (10 ** 3): 1000
Saldo setelah topup: 150000
Saldo setelah belanja: 130000
Counter: 2
```

#### Cara Kerja

```text
          Nilai: 10 Modulus 3 (10 % 3)
                      │
                      ▼
        10 dibagi 3 menghasilkan 3 sisa 1
                      │
                      ▼
             Hasil Operasi = 1
```

**Hafalan:**

```text
leftOperand + rightOperand  → Penjumlahan nilai
leftOperand % rightOperand  → Sisa hasil bagi pembagian bulat
leftOperand ** rightOperand → Perpangkatan angka
variable += amount          → Menambahkan nilai amount ke variable saat ini
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan tanda kurung `( ... )` untuk memperjelas urutan prioritas eksekusi operasi matematika yang kompleks (misal: `(a + b) * c`).
- ❌ Hati-hati saat menggunakan operator `+` pada data yang belum tentu bertipe number, karena jika salah satu operand bertipe string, `+` akan melakukan penyambungan teks (*string concatenation*) bukan penjumlahan angka.

---

<a id="bagian-9"></a>

## 9. 🟢 Operator Perbandingan (Strict vs Loose)

#### Konsep

**Operator Perbandingan** digunakan untuk membandingkan dua buah nilai dan selalu menghasilkan nilai bertipe **Boolean** (`true` atau `false`).

##### Strict Comparison (Wajib Digunakan):
- `===` (Strict Equal): Bernilai `true` hanya jika **Nilai SAMA dan Tipe Data SAMA**.
- `!==` (Strict Not Equal): Bernilai `true` jika **Nilai BEDA atau Tipe Data BEDA**.

##### Loose Comparison (Hindari):
- `==` (Loose Equal): Memaksa konversi tipe data otomatis (*Type Coercion*) sebelum membandingkan.
- `!=` (Loose Not Equal): Memaksa konversi tipe data sebelum membandingkan ketidaksamaan.

##### Operator Relasional Lainnya:
- `>` (Lebih besar dari)
- `<` (Lebih kecil dari)
- `>=` (Lebih besar atau sama dengan)
- `<=` (Lebih kecil atau sama dengan)

#### Contoh

```javascript
const scoreNumber = 100;
const scoreString = "100";

// Perbandingan Loose (==) vs Strict (===)
console.log("Loose Equal (100 == '100'):", scoreNumber == scoreString); // true (berbahaya!)
console.log("Strict Equal (100 === '100'):", scoreNumber === scoreString); // false (aman & akurat)

console.log("Loose Not Equal (100 != '100'):", scoreNumber != scoreString); // false
console.log("Strict Not Equal (100 !== '100'):", scoreNumber !== scoreString); // true

// Perbandingan Relasional
const userAge = 18;
console.log("Apakah 18 >= 17?", userAge >= 17); // true
console.log("Apakah 18 < 12?", userAge < 12); // false
```

#### Output

```text
Loose Equal (100 == '100'): true
Strict Equal (100 === '100'): false
Loose Not Equal (100 != '100'): false
Strict Not Equal (100 !== '100'): true
Apakah 18 >= 17? true
Apakah 18 < 12? false
```

#### Cara Kerja

```text
         leftValue === rightValue
                    │
       ┌────────────┴────────────┐
       ▼                         ▼
Apakah Tipe SAMA?         Apakah Tipe BEDA?
       │                         │
       ▼                         ▼
Cek Apakah Nilai SAMA?       Langsung false
       │
   ┌───┴───┐
   ▼       ▼
 true    false
```

**Hafalan:**

```text
leftOperand === rightOperand → Perbandingan identik (tipe dan nilai harus sama persis)
leftOperand !== rightOperand → Perbandingan tidak identik (beda nilai atau beda tipe)
leftOperand >= rightOperand  → Lebih besar dari atau sama dengan
leftOperand <= rightOperand  → Lebih kecil dari atau sama dengan
```

#### Best Practice & Kesalahan Umum

- ✅ Selalu gunakan operator perbandingan identik (`===` dan `!==`) untuk menghindari bug tak terduga akibat konversi otomatis tipe data (*type coercion*).
- ❌ Jangan pernah menggunakan `==` atau `!=` kecuali Anda memiliki alasan teknis yang sangat spesifik dan terkendali.

---

<a id="bagian-10"></a>

## 10. 🟢 Operator Logika (&&, ||, !)

#### Konsep

**Operator Logika** digunakan untuk mengombinasikan atau membalik nilai-nilai boolean. Operator logika sangat esensial dalam pengambilan keputusan (*decision making*).

Tiga operator logika utama:
1. **`&&` (Logical AND):** Menghasilkan `true` hanya jika **SEMUA** operand bernilai `true`. Jika ada satu saja yang `false`, hasilnya langsung `false`.
2. **`||` (Logical OR):** Menghasilkan `true` jika **SALAH SATU ATAU KEDUA** operand bernilai `true`. Hanya menghasilkan `false` jika seluruh operand bernilai `false`.
3. **`!` (Logical NOT):** Membalik nilai boolean (`true` menjadi `false`, dan sebaliknya).

#### Contoh

```javascript
const hasExamPassed = true;
const hasAttendanceGood = false;

// Operator AND (&&)
const canGraduate = hasExamPassed && hasAttendanceGood;
console.log("Bisa Lulus (AND):", canGraduate); // false

// Operator OR (||)
const canRemedial = hasExamPassed || hasAttendanceGood;
console.log("Bisa Remedial (OR):", canRemedial); // true

// Operator NOT (!)
const isBanned = false;
console.log("Boleh Masuk (!isBanned):", !isBanned); // true
```

#### Output

```text
Bisa Lulus (AND): false
Bisa Remedial (OR): true
Boleh Masuk (!isBanned): true
```

#### Cara Kerja

```text
                 Tabel Kebenaran Logika
   ┌───────┬───────┬───────────┬──────────┬───────────┐
   │   A   │   B   │  A && B   │  A || B  │    !A     │
   ├───────┼───────┼───────────┼──────────┼───────────┤
   │ true  │ true  │   true    │   true   │   false   │
   │ true  │ false │   false   │   true   │   false   │
   │ false │ true  │   false   │   true   │   true    │
   │ false │ false │   false   │   false  │   true    │
   └───────┴───────┴───────────┴──────────┴───────────┘
```

**Hafalan:**

```text
firstCondition && secondCondition → AND: Kedua kondisi wajib bernilai true
firstCondition || secondCondition → OR: Cukup salah satu kondisi bernilai true
!condition                        → NOT: Membalikkan nilai kebenaran boolean
```

#### Best Practice & Kesalahan Umum

- ✅ Manfaatkan operator logika untuk membuat ekspresi kondisi yang deskriptif dan ekspresif.
- ❌ Jangan membuat rantai logika yang terlalu panjang dan bertingkat tanpa pengelompokan tanda kurung `(...)`, karena hal itu membingungkan urutan pembacaan kode.

---

<a id="bagian-11"></a>

## 11. 🟢 Console & Debug Output

#### Konsep

Objek **`console`** menyediakan akses ke konsol debugging browser atau terminal Node.js. Console adalah alat utama programmer untuk memeriksa data, melacak alur eksekusi, serta menemukan sumber kesalahan (*debugging*).

Method `console` yang paling sering digunakan:
- `console.log(...data)`: Mencetak informasi umum.
- `console.info(...data)`: Mencetak informasi informatif.
- `console.warn(...data)`: Mencetak pesan peringatan (kuning).
- `console.error(...data)`: Mencetak pesan kesalahan fatal (merah).
- `console.table(data)`: Menampilkan data array atau objek dalam format tabel yang rapi.
- `console.time(label)` & `console.timeEnd(label)`: Mengukur durasi waktu eksekusi kode.

#### Contoh

```javascript
// 1. Pesan umum
console.log("Ini adalah pesan log standar");
console.info("Info: Server berhasil terhubung");
console.warn("Peringatan: Kapasitas memori hampir penuh!");
console.error("Error: Database gagal merespons!");

// 2. Format Tabel
const userList = [
    { id: 1, name: "Budi", role: "Admin" },
    { id: 2, name: "Siti", role: "User" }
];
console.table(userList);

// 3. Mengukur Waktu Eksekusi
console.time("LoopSpeed");
for (let i = 0; i < 1000000; i++) {
    // Simulasi komputasi
}
console.timeEnd("LoopSpeed");
```

#### Output

```text
Ini adalah pesan log standar
Info: Server berhasil terhubung
Peringatan: Kapasitas memori hampir penuh!
Error: Database gagal merespons!
┌─────────┬────┬────────┬─────────┐
│ (index) │ id │  name  │  role   │
├─────────┼────┼────────┼─────────┤
│    0    │ 1  │ 'Budi' │ 'Admin' │
│    1    │ 2  │ 'Siti' │ 'User'  │
└─────────┴────┴────────┴─────────┘
LoopSpeed: 2.150ms
```

#### Cara Kerja

```text
        Pemanggilan: console.table(userList)
                         │
                         ▼
        Console Engine mem-parsing struktur data
                         │
                         ▼
        Merender tampilan tabular pada DevTools / Terminal
```

**Hafalan:**

```text
console.log(data)         → Mencetak data umum ke konsol
console.warn(message)     → Menampilkan peringatan warna kuning
console.error(message)    → Menampilkan pesan error warna merah
console.table(collection) → Menampilkan array/objek dalam bentuk tabel kolom & baris
```

#### Best Practice & Kesalahan Umum

- ✅ Manfaatkan `console.table()` untuk mempermudah membaca isi array of objects saat debugging.
- ❌ Hapus atau bersihkan seluruh pemanggilan `console.log` sebelum merilis (*deploy*) aplikasi ke lingkungan produksi (*production*).

---

<a id="bagian-12"></a>

## 12. 🟢 String Template (Template Literals)

#### Konsep

**String Template** (atau *Template Literals*) adalah fitur modern JavaScript (ES6) yang memungkinkan pembuatan string menggunakan karakter **backtick (``...``)**.

Keunggulan String Template:
1. **String Interpolation (`${expression}`):** Menyisipkan nilai variabel atau hasil ekspresi matematika langsung di dalam teks tanpa perlu tanda plus `+`.
2. **Multi-line String:** Membuat teks multi-baris secara alami tanpa perlu menulis karakter `\n`.
3. **Expression Evaluation:** Mengeksekusi ekspresi logika atau pemanggilan fungsi langsung di dalam `${...}`.

#### Contoh

```javascript
const itemName = "Keyboard Mechanical";
const price = 450000;
const quantity = 2;

// Menggabungkan cara lama (concatenation)
const oldWay = "Barang: " + itemName + ", Total: Rp" + (price * quantity);
console.log("Cara Lama:", oldWay);

// Menggunakan Template Literals (ES6)
const newWay = `Barang: ${itemName}, Total: Rp${price * quantity}`;
console.log("Cara Modern:", newWay);

// Multi-line string alami
const invoiceReceipt = `
=== STRUK PEMBELIAN ===
Produk : ${itemName}
Jumlah : ${quantity} unit
Harga  : Rp${price}
Total  : Rp${price * quantity}
Status : ${quantity > 1 ? "Diskon Khusus" : "Harga Normal"}
=======================
`;

console.log(invoiceReceipt);
```

#### Output

```text
Cara Lama: Barang: Keyboard Mechanical, Total: Rp900000
Cara Modern: Barang: Keyboard Mechanical, Total: Rp900000

=== STRUK PEMBELIAN ===
Produk : Keyboard Mechanical
Jumlah : 2 unit
Harga  : Rp450000
Total  : Rp900000
Status : Diskon Khusus
=======================
```

#### Cara Kerja

```text
            Template Literal: `Total: ${price * quantity}`
                                    │
                                    ▼
                 Evaluasi ekspresi di dalam ${ ... }
                                    │
                                    ▼
                  Hasil diubah ke string & disatukan
```

**Hafalan:**

```text
`text ${expression} text` → Menyisipkan nilai ekspresi/variabel ke dalam teks
`line 1\nline 2`          → Membuat teks banyak baris secara natural dengan backtick
```

#### Best Practice & Kesalahan Umum

- ✅ Selalu prioritaskan template literals (``...``) untuk setiap penggabungan string dinamis karena jauh lebih mudah dibaca dan minim kesalahan spasi.
- ❌ Jangan lupa menggunakan karakter backtick (``), bukan petik tunggal biasa (`'`), karena sintaks `${...}` tidak akan dievaluasi pada petik tunggal.

---

<a id="bagian-13"></a>

## 13. 🟢 Konversi String dan Number

#### Konsep

Dalam pembuatan aplikasi web, data yang diterima dari formulir HTML (*form input*) atau URL query selalu berformat **String**. Jika kita ingin melakukan operasi matematika, data string tersebut wajib dikonversi menjadi **Number**.

Fungsi Konversi yang Sering Digunakan:
- **`Number(string)`:** Mengonversi string menjadi angka (bulat maupun desimal). Menghasilkan `NaN` jika ada karakter non-angka di dalamnya.
- **`parseInt(string)`:** Mengurai string menjadi bilangan bulat (*integer*). Berhenti mengurai saat menemukan karakter non-angka.
- **`parseFloat(string)`:** Mengurai string menjadi bilangan desimal (*float*).
- **`String(number)`** atau **`number.toString()`:** Mengonversi angka kembali menjadi string.

#### Contoh

```javascript
// 1. String ke Number
const inputAge = "25";
const inputWeight = "65.5kg";
const inputInvalid = "abc123";

console.log("Number('25'):", Number(inputAge)); // 25
console.log("parseInt('65.5kg'):", parseInt(inputWeight)); // 65 (mengabaikan teks 'kg')
console.log("parseFloat('65.5kg'):", parseFloat(inputWeight)); // 65.5
console.log("Number('abc123'):", Number(inputInvalid)); // NaN

// 2. Number ke String
const scoreNumber = 100;
const scoreString = String(scoreNumber);
const methodString = scoreNumber.toString();

console.log("Tipe data scoreString:", typeof scoreString, "Nilai:", scoreString);
console.log("Tipe data methodString:", typeof methodString, "Nilai:", methodString);

// 3. Jebakan Penjumlahan String
const num1 = "10";
const num2 = 5;
console.log("Sebelum konversi ('10' + 5):", num1 + num2); // "105" (salah!)
console.log("Setelah konversi (Number('10') + 5):", Number(num1) + num2); // 15 (benar!)
```

#### Output

```text
Number('25'): 25
parseInt('65.5kg'): 65
parseFloat('65.5kg'): 65.5
Number('abc123'): NaN
Tipe data scoreString: string Nilai: 100
Tipe data methodString: string Nilai: 100
Sebelum konversi ('10' + 5): 105
Setelah konversi (Number('10') + 5): 15
```

#### Cara Kerja

```text
         Input String: "250"
                  │
                  ▼
       Fungsi Konversi: Number("250")
                  │
                  ▼
         Hasil Tipe Data: 250 (Number)
```

**Hafalan:**

```text
Number(string)       → Mengonversi teks menjadi angka pasti (desimal/bulat)
parseInt(string)     → Mengambil bilangan bulat dari teks pembuka
parseFloat(string)   → Mengambil bilangan desimal dari teks pembuka
String(number)       → Mengonversi angka menjadi teks biasa
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan `Number(value)` untuk konversi ketat (strict), atau `parseInt(value, 10)` dengan selalu menyertakan basis desimal (radix 10).
- ❌ Hati-hati terhadap `NaN`; periksa hasil konversi dengan `Number.isNaN()` sebelum memprosesnya dalam kalkulasi krusial (misal pembayaran).

---

<a id="bagian-14"></a>

## 14. 🟢 Tipe Data Array Dasar

#### Konsep

**Array** adalah struktur data terurut (*ordered collection*) yang digunakan untuk menampung sekumpulan nilai dalam satu variabel. Nilai di dalam array disebut elemen, dan setiap elemen memiliki posisi angka urut yang disebut **index** (dimulai dari angka **0**).

Ciri khas Array di JavaScript:
- Elemen diakses melalui nomor indeks dalam kurung siku `array[index]`.
- Panjang elemen bersifat dinamis dan dapat bertambah/berkurang otomatis.
- Dapat menampung berbagai tipe data sekaligus (*mixed types*).

Method Manipulasi Array Esensial:
- `.push(element)`: Menambahkan elemen di akhir array.
- `.pop()`: Menghapus dan mengambil elemen terakhir.
- `.unshift(element)`: Menambahkan elemen di awal array.
- `.shift()`: Menghapus dan mengambil elemen pertama.
- `.length`: Menghitung total elemen yang ada.

#### Contoh

```javascript
// Membuat array
const fruits = ["Apel", "Jeruk", "Mangga"];

console.log("Array awal:", fruits);
console.log("Elemen pertama (index 0):", fruits[0]);
console.log("Panjang array:", fruits.length);

// Mengubah isi elemen
fruits[1] = "Alpukat";
console.log("Setelah diubah:", fruits);

// Menambahkan elemen baru ke akhir (.push)
fruits.push("Pisang");
console.log("Setelah push:", fruits);

// Menghapus elemen paling akhir (.pop)
const removedItem = fruits.pop();
console.log("Elemen yang di-pop:", removedItem);
console.log("Array sekarang:", fruits);
```

#### Output

```text
Array awal: [ 'Apel', 'Jeruk', 'Mangga' ]
Elemen pertama (index 0): Apel
Panjang array: 3
Setelah diubah: [ 'Apel', 'Alpukat', 'Mangga' ]
Setelah push: [ 'Apel', 'Alpukat', 'Mangga', 'Pisang' ]
Elemen yang di-pop: Pisang
Array sekarang: [ 'Apel', 'Alpukat', 'Mangga' ]
```

#### Cara Kerja

```text
             Indeks Array (Mulai dari 0)
    Indeks:    0          1          2
    Isi:    ["Apel",  "Alpukat", "Mangga"]
               │
               ▼
    fruits[0] menghasilkan "Apel"
```

**Hafalan:**

```text
array[index]          → Mengakses atau mengubah elemen pada indeks tertentu
array.push(element)   → Menambahkan data baru ke posisi paling belakang
array.pop()           → Mengambil dan menghapus data dari posisi paling belakang
array.unshift(element)→ Menambahkan data baru ke posisi paling depan
array.shift()         → Mengambil dan menghapus data dari posisi paling depan
array.length          → Mendapatkan jumlah total elemen di dalam array
```

#### Best Practice & Kesalahan Umum

- ✅ Buat variabel array menggunakan kata benda jamak (*plural*), contoh: `users`, `products`, `items`.
- ❌ Ingat bahwa indeks array selalu berawal dari **0**, sehingga elemen terakhir berada di posisi `array.length - 1`.

---

<a id="bagian-15"></a>

## 15. 🟢 Tipe Data Object Dasar

#### Konsep

**Object** adalah struktur data yang menampung kumpulan pasangan kunci dan nilai (*key-value pairs*). Jika array menggunakan nomor indeks angka terurut, maka object menggunakan nama atribut (*property*) berupa teks string untuk mengidentifikasi nilainya.

Object sangat ideal untuk memodelkan entitas nyata seperti Pengguna (*User*), Produk (*Product*), atau Transaksi (*Order*).

Cara Mengakses Properti Object:
1. **Dot Notation (`object.property`):** Cara paling umum, bersih, dan ringkas.
2. **Bracket Notation (`object["property"]`):** Digunakan jika nama key mengandung karakter khusus, spasi, atau berasal dari variabel dinamis.

#### Contoh

```javascript
// Membuat objek dengan object literal {}
const user = {
    id: 101,
    name: "Budi Santoso",
    age: 24,
    isMember: true,
    address: {
        city: "Jakarta",
        country: "Indonesia"
    }
};

// Mengakses properti
console.log("Nama:", user.name);
console.log("Kota (Nested):", user.address.city);
console.log("Akses dengan Bracket:", user["age"]);

// Menambah properti baru
user.email = "budi@example.com";

// Mengubah nilai properti
user.age = 25;

// Menghapus properti
delete user.isMember;

console.log("Object akhir:", user);
```

#### Output

```text
Nama: Budi Santoso
Kota (Nested): Jakarta
Akses dengan Bracket: 24
Object akhir: {
  id: 101,
  name: 'Budi Santoso',
  age: 25,
  address: { city: 'Jakarta', country: 'Indonesia' },
  email: 'budi@example.com'
}
```

#### Cara Kerja

```text
                Objek Pengguna
       ┌───────────────────────────────┐
       │ Key          │ Value          │
       ├──────────────┼────────────────┤
       │ name         │ "Budi Santoso" │
       │ age          │ 25             │
       │ email        │ "budi@..."     │
       └──────────────┴────────────────┘
                      │
                      ▼
     user.name langsung mengambil "Budi Santoso"
```

**Hafalan:**

```text
object.property       → Mengakses nilai properti menggunakan dot notation
object['property']    → Mengakses nilai properti menggunakan bracket notation
object.newKey = value → Menambahkan atau memperbarui nilai properti
delete object.key     → Menghapus properti dari objek
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan dot notation (`object.name`) secara konsisten, dan gunakan bracket notation (`object[key]`) hanya jika key ditentukan secara dinamis saat runtime.
- ❌ Mendeklarasikan object dengan `const` bukan berarti propertinya tidak bisa diubah; kita tetap bisa menambah, mengubah, dan menghapus properti di dalamnya (hanya variabel objeknya yang tidak bisa di-reassign ke objek lain).

---

<a id="bagian-16"></a>

## 16. 🟢 Undefined dan Null

#### Konsep

JavaScript memiliki dua tipe nilai khusus untuk menggambarkan "ketiadaan nilai", namun keduanya memiliki filosofi dan tujuan yang berbeda:

1. **`undefined` (Belum Didefinisikan):**
   - Nilai default dari variabel yang sudah dideklarasikan tetapi belum diberi nilai.
   - Nilai default dari fungsi yang tidak memiliki `return`.
   - Nilai ketika mengakses properti objek yang tidak ada.
   - Bersifat otomatis (*implicit*) dari engine JavaScript.

2. **`null` (Ketiadaan Nilai Secara Sengaja):**
   - Nilai yang diberikan secara sengaja (*explicit*) oleh programmer untuk menandakan bahwa variabel tersebut saat ini kosong atau belum memiliki data.

#### Contoh

```javascript
// 1. Kasus undefined
let emptyVariable;
console.log("Variabel tanpa nilai:", emptyVariable); // undefined

const person = { name: "Andi" };
console.log("Akses properti non-existent:", person.age); // undefined

// 2. Kasus null
let selectedProduct = null; // Sengaja dikosongkan karena user belum memilih
console.log("Produk terpilih:", selectedProduct); // null

selectedProduct = { id: 1, name: "Sepatu" };
console.log("Produk setelah dipilih:", selectedProduct.name);

// 3. Perbedaan Tipe Data
console.log("typeof undefined:", typeof undefined); // "undefined"
console.log("typeof null:", typeof null); // "object" (kebiasaan historis JS)
console.log("undefined == null:", undefined == null); // true (loose)
console.log("undefined === null:", undefined === null); // false (strict)
```

#### Output

```text
Variabel tanpa nilai: undefined
Akses properti non-existent: undefined
Produk terpilih: null
Produk setelah dipilih: Sepatu
typeof undefined: undefined
typeof null: object
undefined == null: true
undefined === null: false
```

#### Cara Kerja

```text
              Ketiadaan Nilai di JavaScript
                           │
            ┌──────────────┴──────────────┐
            ▼                             ▼
        undefined                        null
    (Otomatis dari JS Engine)      (Sengaja Diisi Programmer)
    - Variabel belum diisi         - Variabel bernilai kosong
    - Properti tidak ditemukan     - Reset data objek
```

**Hafalan:**

```text
undefined → Variabel telah dibuat tetapi belum pernah diisi nilai apa pun
null      → Nilai sengaja dikosongkan oleh programmer untuk menunjukkan ketiadaan data
typeof undefined === 'undefined'
typeof null === 'object'
```

#### Best Practice & Kesalahan Umum

- ✅ Berikan nilai awal `null` jika variabel objek/data Anda memang belum memiliki data saat inisialisasi awal.
- ❌ Jangan pernah mengisi variabel secara manual dengan `undefined` (misal: `let a = undefined`); gunakan `null` jika ingin mengosongkan nilai secara eksplisit.

---

<a id="bagian-17"></a>

## 17. 🟢 If, Else If, dan Else Statement

#### Konsep

**If Expression** adalah struktur kontrol utama untuk mengeksekusi blok kode tertentu berdasarkan suatu kondisi bernilai boolean (*true* atau *false*).

Struktur Percabangan:
- **`if (condition)`:** Dijalankan jika kondisi pertama bernilai `true`.
- **`else if (condition)`:** Dijalankan jika kondisi sebelumnya `false` dan kondisi ini bernilai `true`.
- **`else`:** Dijalankan sebagai jalan terakhir jika seluruh kondisi di atas bernilai `false`.

#### Contoh

```javascript
const examScore = 85;

if (examScore >= 90) {
    console.log("Grade: A (Sangat Memuaskan)");
} else if (examScore >= 80) {
    console.log("Grade: B (Memuaskan)");
} else if (examScore >= 70) {
    console.log("Grade: C (Cukup)");
} else {
    console.log("Grade: D (Perlu Remedial)");
}

// Nested If (If Bersarang)
const isMember = true;
const totalShopping = 150000;

if (isMember) {
    if (totalShopping >= 100000) {
        console.log("Selamat! Anda mendapatkan diskon member 10%.");
    } else {
        console.log("Belanja lebih dari Rp100.000 untuk dapat diskon.");
    }
}
```

#### Output

```text
Grade: B (Memuaskan)
Selamat! Anda mendapatkan diskon member 10%.
```

#### Cara Kerja

```text
              Evaluasi Kondisi: (examScore >= 90)
                              │
               ┌──────────────┴──────────────┐
             [true]                        [false]
               │                             │
               ▼                             ▼
       Cetak "Grade: A"          Evaluasi: (examScore >= 80)
                                             │
                              ┌──────────────┴──────────────┐
                            [true]                        [false]
                              │                             │
                              ▼                             ▼
                      Cetak "Grade: B"             Lanjut ke Else If / Else
```

**Hafalan:**

```text
if (condition) { ... }      → Menjalankan blok jika kondisi bernilai true
else if (condition) { ... } → Kondisi alternatif jika kondisi sebelumnya false
else { ... }                → Blok penampung jika semua kondisi sebelumnya false
```

#### Best Practice & Kesalahan Umum

- ✅ Urutkan kondisi `else if` dari nilai yang paling ketat/tinggi ke yang paling rendah agar evaluasi percabangan berjalan akurat.
- ❌ Hindari percabangan bertingkat (*deeply nested if*) yang terlalu dalam karena merusak keterbacaan kode; gunakan teknik *guard clauses* (early return).

---

<a id="bagian-18"></a>

## 18. 🟡 Popup Dialog (alert, prompt, confirm)

#### Konsep

Pada lingkungan browser (*Browser Runtime*), objek `window` menyediakan 3 fungsi dialog interaktif modal sederhana:

1. **`alert(message)`:** Menampilkan jendela pop-up pemberitahuan sederhana dengan 1 tombol "OK". Menahan eksekusi script sampai user menekan tombol.
2. **`prompt(message, defaultValue)`:** Menampilkan kotak dialog input teks. Mengembalikan string isi ketikan user jika menekan "OK", atau `null` jika menekan "Cancel".
3. **`confirm(message)`:** Menampilkan kotak dialog konfirmasi dengan pilihan tombol "OK" dan "Cancel". Mengembalikan `true` jika user klik "OK", dan `false` jika user klik "Cancel".

#### Contoh

```javascript
// 1. Menampilkan notifikasi pemberitahuan
alert("Selamat datang di Portal Belajar JavaScript!");

// 2. Meminta input nama dari user
const userName = prompt("Siapa nama lengkap Anda?", "Pengunjung");

if (userName !== null && userName.trim() !== "") {
    // 3. Meminta konfirmasi tindakan
    const isReady = confirm(`Halo ${userName}, apakah Anda siap memulai kuis?`);

    if (isReady) {
        alert("Bagus! Kuis akan segera dimulai.");
    } else {
        alert("Tidak apa-apa, Anda bisa belajar materi terlebih dahulu.");
    }
} else {
    alert("Nama tidak boleh kosong!");
}
```

#### Output

Contoh interaksi di browser:
```text
[Pop-up Input] -> User mengetik: "Budi Santoso" lalu klik OK
[Pop-up Konfirmasi] -> "Halo Budi Santoso, apakah Anda siap memulai kuis?" -> User klik OK
[Pop-up Alert] -> "Bagus! Kuis akan segera dimulai."
```

#### Cara Kerja

```text
              Pemanggilan confirm(message)
                          │
                          ▼
            Browser menampilkan modal dialog
            (Eksekusi kode JS terhenti sementara)
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
        User Klik OK             User Klik Cancel
            │                           │
            ▼                           ▼
      Mengembalikan true         Mengembalikan false
```

**Hafalan:**

```text
alert(message)               → Menampilkan pesan notifikasi pop-up satu arah
prompt(message, defaultText) → Meminta input teks dari user (return string / null)
confirm(message)             → Meminta persetujuan Ya/Tidak (return true / false)
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan fungsi pop-up bawaan ini hanya untuk keperluan belajar, prototype cepat, atau debugging sederhana.
- ❌ Jangan gunakan `alert` / `prompt` di aplikasi web modern skala produksi karena bersifat memblokir (*blocking thread*) dan tampilannya tidak bisa dikustomisasi secara leluasa dengan CSS.

---

<a id="bagian-19"></a>

## 19. 🟡 Switch Statement

#### Konsep

**Switch Statement** adalah struktur percabangan yang digunakan untuk membandingkan satu nilai terhadap banyak kemungkinan nilai target secara langsung (*equality matching*).

Karakteristik Switch:
- Membandingkan nilai menggunakan perbandingan identik yang ketat (**`===`**).
- Menggunakan kata kunci **`break`** untuk menghentikan evaluasi setelah satu blok case cocok.
- Menggunakan **`default`** sebagai fallback jika tidak ada satu pun `case` yang sesuai.
- Jika `break` diabaikan, program akan terus mengeksekusi case di bawahnya tanpa pengecekan (*fall-through*).

#### Contoh

```javascript
const userRole = "EDITOR";

switch (userRole) {
    case "SUPERADMIN":
    case "ADMIN":
        console.log("Akses Penuh: Boleh mengelola sistem dan pengguna.");
        break;

    case "EDITOR":
        console.log("Akses Terbatas: Boleh menulis dan mengedit artikel.");
        break;

    case "SUBSCRIBER":
        console.log("Akses Baca: Hanya boleh membaca konten premium.");
        break;

    default:
        console.log("Akses Tamu: Silakan login terlebih dahulu.");
        break;
}
```

#### Output

```text
Akses Terbatas: Boleh menulis dan mengedit artikel.
```

#### Cara Kerja

```text
                 Nilai Evaluasi: switch (userRole)
                                 │
                                 ▼
                     Apakah userRole === "ADMIN"?
                                 │
                   ┌─────────────┴─────────────┐
                 [Ya]                        [Tidak]
                   │                           │
                   ▼                           ▼
             Jalankan Blok               Apakah userRole === "EDITOR"?
                   │                           │
                   ▼             ┌─────────────┴─────────────┐
             Ketemu break      [Ya]                        [Tidak]
                   │             │                           │
                   ▼             ▼                           ▼
           Keluar dari switch   Jalankan Blok (Editor)     Jalankan default
```

**Hafalan:**

```text
switch (expression) { ... } → Membuka blok evaluasi nilai spesifik
case targetValue:           → Label nilai yang dicocokkan (menggunakan ===)
break;                      → Menghentikan proses switch agar tidak tembus ke bawah
default:                    → Jalur fallback jika tidak ada case yang cocok
```

#### Best Practice & Kesalahan Umum

- ✅ Manfaatkan teknik *grouped cases* (menumpuk beberapa label case tanpa break) jika beberapa nilai menghasilkan aksi yang persis sama.
- ❌ Jangan sampai lupa menuliskan `break;` di setiap blok case, karena program akan otomatis mengeksekusi baris case di bawahnya (*fall-through bug*).

---

<a id="bagian-20"></a>

## 20. 🟡 Operator typeof dan in

#### Konsep

JavaScript menyediakan operator khusus untuk memeriksa tipe data variabel dan mengecek keberadaan atribut pada objek:

1. **`typeof operand`:** Menghasilkan string yang merepresentasikan tipe data dari suatu nilai/variabel (misal: `"number"`, `"string"`, `"boolean"`, `"object"`, `"function"`, `"undefined"`, `"bigint"`, `"symbol"`).
2. **`"propertyName" in object`:** Operator boolean untuk mengecek apakah sebuah nama properti tersedia di dalam objek (termasuk properti bawaan di rantai prototype).

#### Contoh

```javascript
// 1. Menggunakan typeof
const price = 50000;
const title = "Kursus JavaScript";
const isComplete = false;
const tags = ["js", "web"];
const handler = function() { return "OK"; };

console.log("typeof price:", typeof price); // "number"
console.log("typeof title:", typeof title); // "string"
console.log("typeof isComplete:", typeof isComplete); // "boolean"
console.log("typeof tags:", typeof tags); // "object" (Array adalah objek)
console.log("typeof handler:", typeof handler); // "function"

// 2. Menggunakan in operator
const car = {
    brand: "Toyota",
    year: 2024,
    color: undefined // Nilainya undefined, tapi propertinya ADA
};

console.log("Apakah 'brand' ada di car?", "brand" in car); // true
console.log("Apakah 'color' ada di car?", "color" in car); // true
console.log("Apakah 'price' ada di car?", "price" in car); // false
```

#### Output

```text
typeof price: number
typeof title: string
typeof isComplete: boolean
typeof tags: object
typeof handler: function
Apakah 'brand' ada di car? true
Apakah 'color' ada di car? true
Apakah 'price' ada di car? false
```

#### Cara Kerja

```text
         Pengecekan: "brand" in car
                     │
                     ▼
    Mencari key "brand" di dalam daftar key objek
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
     Ditemukan             Tidak Ditemukan
         │                       │
         ▼                       ▼
    Hasil = true            Hasil = false
```

**Hafalan:**

```text
typeof value          → Mengembalikan tipe data dalam bentuk string teks
propertyName in object→ Mengecek apakah nama properti terdaftar di dalam objek
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan operator `in` jika ingin memastikan apakah properti benar-benar didefinisikan di objek, meskipun properti tersebut sengaja diisi bernilai `undefined`.
- ❌ Ingat bahwa `typeof null` menghasilkan `"object"` (ini adalah bug warisan sejarah JavaScript), jadi jangan gunakan `typeof` untuk memeriksa nilai `null`; gunakan `value === null`.

---

<a id="bagian-21"></a>

## 21. 🟡 Ternary Operator (?:)

#### Konsep

**Ternary Operator** (`condition ? valueIfTrue : valueIfFalse`) adalah operator kondisional satu baris yang merupakan bentuk ringkas dari struktur `if...else`.

Ternary operator sangat berguna ketika kita ingin menetapkan nilai variabel atau menyisipkan ekspresi secara langsung berdasarkan suatu kondisi boolean.

Struktur:
```text
kondisi ? nilai_jika_benar : nilai_jika_salah
```

#### Contoh

```javascript
const score = 80;

// Cara konvensional dengan if-else
let statusIf;
if (score >= 75) {
    statusIf = "Lulus";
} else {
    statusIf = "Tidak Lulus";
}
console.log("Status (If-Else):", statusIf);

// Menggunakan Ternary Operator (Ringkas & Bersih)
const statusTernary = score >= 75 ? "Lulus" : "Tidak Lulus";
console.log("Status (Ternary):", statusTernary);

// Digunakan langsung di dalam Template Literals
const user = { name: "Rina", isPremium: true };
console.log(`Selamat datang, ${user.name} (${user.isPremium ? "Member VIP" : "Member Reguler"})`);
```

#### Output

```text
Status (If-Else): Lulus
Status (Ternary): Lulus
Selamat datang, Rina (Member VIP)
```

#### Cara Kerja

```text
           Evaluasi Kondisi: (score >= 75)
                          │
            ┌─────────────┴─────────────┐
          [true]                      [false]
            │                           │
            ▼                           ▼
    Ambil nilai kiri            Ambil nilai kanan
       ("Lulus")                ("Tidak Lulus")
```

**Hafalan:**

```text
condition ? valueIfTrue : valueIfFalse → Memilih nilai berdasarkan evaluasi boolean
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan ternary operator hanya untuk evaluasi kondisi sederhana (satu baris); hal ini memungkinkan variabel dideklarasikan langsung dengan `const`.
- ❌ Hindari menumpuk ternary bersarang (*nested ternary*) terlalu dalam (misal `a ? b : c ? d : e`) karena sangat sulit dibaca dan dipahami; gunakan `if-else` biasa untuk logika bercabang banyak.

---

<a id="bagian-22"></a>

## 22. 🟡 Nullish Coalescing Operator (??)

#### Konsep

**Nullish Coalescing Operator (`??`)** adalah operator modern JavaScript (ES2020) yang digunakan untuk memberikan nilai default (*fallback value*) hanya jika nilai di sisi kiri bernilai **`null`** atau **`undefined`** (*Nullish values*).

Perbedaan Krusial dengan Logical OR (`||`):
- Operator `||` akan mengganti nilai sisi kiri jika bernilai **falsy** apa pun (termasuk angka `0`, boolean `false`, dan string kosong `""`).
- Operator `??` hanya mengganti nilai sisi kiri jika nilainya benar-benar **`null`** atau **`undefined`**. Angka `0`, boolean `false`, dan string `""` dianggap sebagai data yang valid.

#### Contoh

```javascript
// Kasus 1: Pengaturan kuota (angka 0 adalah nilai valid)
const customLimit = 0;

const limitWithOR = customLimit || 10; // Mengira 0 adalah tidak ada nilai!
const limitWithNullish = customLimit ?? 10; // Menghormati 0 sebagai nilai valid!

console.log("Limit dengan OR (||):", limitWithOR); // 10 (salah tafsir)
console.log("Limit dengan Nullish (??):", limitWithNullish); // 0 (benar)

// Kasus 2: Nilai undefined / null
let userNickname; // undefined
const displayName = userNickname ?? "Anonim";
console.log("Display Name:", displayName); // "Anonim"

// Nullish Assignment Operator (??=)
let userBio = null;
userBio ??= "Bio belum diisi oleh pengguna";
console.log("Bio User:", userBio);
```

#### Output

```text
Limit dengan OR (||): 10
Limit dengan Nullish (??): 0
Display Name: Anonim
Bio User: Bio belum diisi oleh pengguna
```

#### Cara Kerja

```text
                 leftOperand ?? rightOperand
                              │
              ┌───────────────┴───────────────┐
    Apakah left bernilai              Apakah left BUKAN
     null / undefined?                null / undefined?
              │                               │
              ▼                               ▼
     Ambil rightOperand              Ambil leftOperand
      (Nilai Fallback)             (Termasuk 0, false, "")
```

**Hafalan:**

```text
leftOperand ?? fallbackValue  → Menggunakan fallback jika sisi kiri null atau undefined
variable ??= defaultValue     → Mengisi variabel hanya jika saat ini bernilai null/undefined
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan operator `??` saat memproses data angka, boolean, atau input teks yang boleh bernilai `0`, `false`, atau `""`.
- ❌ Jangan gunakan `||` untuk memberi nilai default pada variabel numerik atau boolean, karena angka `0` dan boolean `false` akan tertimpa oleh nilai default secara tidak sengaja.

---

<a id="bagian-23"></a>

## 23. 🟡 Optional Chaining Operator (?.)

#### Konsep

**Optional Chaining (`?.`)** adalah fitur modern JavaScript (ES2020) yang memungkinkan kita membaca nilai properti yang bersarang (*deeply nested properties*) atau memanggil method tanpa perlu khawatir program melempar pesan error fatal `TypeError: Cannot read properties of undefined/null`.

Cara Kerja:
Jika nilai di sebelah kiri `?.` bernilai `null` atau `undefined`, ekspresi langsung berhenti dan secara aman mengembalikan nilai `undefined` (*short-circuit*), alih-alih melempar error yang menghentikan aplikasi.

#### Contoh

```javascript
const userWithoutAddress = {
    id: 1,
    name: "Ahmad"
    // address tidak ada (undefined)
};

// Cara Lama (Berisiko Error)
// console.log(userWithoutAddress.address.city); // TypeError! Aplikasi crash.

// Cara Lama (Manual Defensive Check)
const cityOld = (userWithoutAddress.address && userWithoutAddress.address.city) 
    ? userWithoutAddress.address.city 
    : "Kota tidak diketahui";
console.log("Kota (Cara Lama):", cityOld);

// Cara Modern (Optional Chaining + Nullish Coalescing)
const cityModern = userWithoutAddress.address?.city ?? "Kota tidak diketahui";
console.log("Kota (Cara Modern):", cityModern);

// Memanggil method opsional
const service = {
    sendNotification: null // method tidak tersedia
};

service.sendNotification?.("Pesan penting"); // Aman, tidak error!
```

#### Output

```text
Kota (Cara Lama): Kota tidak diketahui
Kota (Cara Modern): Kota tidak diketahui
```

#### Cara Kerja

```text
              Akses: user.address?.city
                         │
         ┌───────────────┴───────────────┐
   user.address ADA?             user.address null / undefined?
         │                               │
         ▼                               ▼
   Akses properti .city          Langsung return undefined
                                   (Aman tanpa crash)
```

**Hafalan:**

```text
object?.property         → Mengakses properti objek dengan aman
object?.[expression]     → Mengakses properti dinamis/array index dengan aman
object.method?.(...args) → Memanggil method hanya jika method tersebut berupa function
```

#### Best Practice & Kesalahan Umum

- ✅ Gabungkan Optional Chaining (`?.`) dengan Nullish Coalescing (`??`) untuk membaca data JSON / API eksternal yang strukturnya belum pasti lengkap.
- ❌ Jangan gunakan `?.` di sisi kiri penugasan nilai (misal: `user?.address?.city = "Bandung"`), karena optional chaining hanya untuk membaca data (*read-only*), bukan untuk menulis (*write*).

---

<a id="bagian-24"></a>

## 24. 🟡 Falsy dan Truthy

#### Konsep

Di JavaScript, setiap nilai ketika dievaluasi dalam konteks kondisi logika (seperti di dalam blok `if`) akan otomatis dikonversi menjadi salah satu dari dua kelompok:
1. **Falsy:** Nilai yang dianggap sebagai `false`.
2. **Truthy:** Semua nilai di luar daftar nilai falsy dianggap sebagai `true`.

##### Daftar Lengkap 8 Nilai Falsy di JavaScript:
1. `false` (Boolean false)
2. `0`, `-0`, `0n` (Angka nol & BigInt nol)
3. `""`, `''`, string template kosong (String kosong)
4. `null`
5. `undefined`
6. `NaN` (Not a Number)
7. `document.all` (Hanya di browser untuk kompatibilitas legacy)

##### Contoh Nilai Truthy (Penting Diingat!):
- Semua string yang ada isinya (termasuk `"0"`, `"false"`, `" "` spasi).
- Semua angka bukan nol (termasuk angka negatif `-1`, `3.14`).
- Array kosong (`[]`) dan Objek kosong (`{}`) bernilai **TRUTHY**!

#### Contoh

```javascript
// Memeriksa nilai falsy
const emptyText = "";
const zeroNumber = 0;
const nullData = null;

if (!emptyText) console.log("String kosong adalah FALSY");
if (!zeroNumber) console.log("Angka 0 adalah FALSY");
if (!nullData) console.log("Null adalah FALSY");

// Jebakan Truthy yang sering mengecoh pemula
const stringZero = "0";
const emptyArray = [];
const emptyObject = {};

if (stringZero) console.log("String '0' adalah TRUTHY!");
if (emptyArray) console.log("Array kosong [] adalah TRUTHY!");
if (emptyObject) console.log("Objek kosong {} adalah TRUTHY!");
```

#### Output

```text
String kosong adalah FALSY
Angka 0 adalah FALSY
Null adalah FALSY
String '0' adalah TRUTHY!
Array kosong [] adalah TRUTHY!
Objek kosong {} adalah TRUTHY!
```

#### Cara Kerja

```text
           Evaluasi Nilai dalam Kondisi If
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
    Apakah salah satu dari:             Semua nilai lainnya
    false, 0, "", null,                 (termasuk "0", [], {})
    undefined, NaN?                               │
          │                                       ▼
          ▼                                     TRUTHY
        FALSY                              (Dieksekusi)
   (Dilewati / False)
```

**Hafalan:**

```text
Boolean(value) → Menguji apakah suatu nilai bernilai truthy atau falsy
Falsy list     → false, 0, "", null, undefined, NaN
Truthy list    → Segala nilai lainnya (termasuk array kosong [] dan object kosong {})
```

#### Best Practice & Kesalahan Umum

- ✅ Jika ingin mengecek apakah sebuah array memiliki data atau kosong, periksa panjangnya menggunakan `array.length === 0`, jangan mengecek `if (array)` karena array kosong tetap bernilai *truthy*.
- ❌ Jangan mengecek isi string dengan asumsi `"0"` bernilai false; gunakan konversi tipe yang eksplisit.

---

<a id="bagian-25"></a>

## 25. 🟡 Operator Logika di Non-Boolean (Short-Circuit Evaluation)

#### Konsep

Di JavaScript, operator logika `||` (OR) dan `&&` (AND) tidak selalu mengembalikan nilai boolean `true` atau `false`. Saat digunakan pada nilai non-boolean, operator ini mengembalikan **salah satu nilai asli dari operand** berdasarkan mekanisme **Short-Circuit Evaluation**:

1. **Operator OR (`A || B`):**
   - Mengevaluasi nilai kiri (`A`).
   - Jika `A` adalah **truthy**, evaluasi langsung berhenti dan mengembalikan nilai **`A`**.
   - Jika `A` adalah **falsy**, evaluasi dilanjutkan dan mengembalikan nilai **`B`**.

2. **Operator AND (`A && B`):**
   - Mengevaluasi nilai kiri (`A`).
   - Jika `A` adalah **falsy**, evaluasi langsung berhenti dan mengembalikan nilai **`A`**.
   - Jika `A` adalah **truthy**, evaluasi dilanjutkan dan mengembalikan nilai **`B`**.

#### Contoh

```javascript
// 1. Short-Circuit pada Operator OR (||)
console.log("hello" || "world"); // "hello" (karena "hello" truthy)
console.log("" || "Pengunjung"); // "Pengunjung" (karena "" falsy)
console.log(null || 100); // 100 (karena null falsy)
console.log(undefined || null); // null (keduanya falsy, ambil yang terakhir)

// 2. Short-Circuit pada Operator AND (&&)
console.log("hello" && "world"); // "world" (kiri truthy, ambil kanan)
console.log("" && "user"); // "" (kiri falsy, langsung berhenti)
console.log(null && "admin"); // null (kiri falsy)
console.log(100 && 200); // 200 (keduanya truthy, ambil yang terakhir)

// 3. Penerapan nyata: Eksekusi fungsi kondisional
const isLoggedIn = true;
const logAccess = () => console.log("Aktivitas user berhasil dicatat!");

isLoggedIn && logAccess(); // Fungsi dijalankan hanya jika isLoggedIn true
```

#### Output

```text
hello
Pengunjung
100
null
world

null
200
Aktivitas user berhasil dicatat!
```

#### Cara Kerja

```text
              Evaluasi: ("hello" || "world")
                            │
                            ▼
               Apakah "hello" Truthy?
                            │
             ┌──────────────┴──────────────┐
           [Ya]                          [Tidak]
             │                             │
             ▼                             ▼
   Kembalikan "hello"             Kembalikan "world"
   (Short-Circuit Selesai)
```

**Hafalan:**

```text
leftValue || rightValue → Mengambil nilai truthy pertama yang ditemukan
leftValue && rightValue → Mengambil nilai falsy pertama, atau nilai paling kanan jika semua truthy
```

#### Best Practice & Kesalahan Umum

- ✅ Manfaatkan pola `isValid && executeAction()` sebagai cara ekspresif satu baris dalam memanggil fungsi saat kondisi terpenuhi.
- ❌ Hati-hati saat menggunakan `||` untuk nilai default, karena jika nilai aslinya adalah `0` atau `""`, nilai tersebut akan dianggap *falsy* dan tertimpa nilai kanan secara tidak sengaja (gunakan `??` untuk skenario ini).

---

<a id="bagian-26"></a>

## 26. 🟡 For Loop

#### Konsep

**For Loop** adalah struktur perulangan yang paling umum digunakan ketika kita sudah mengetahui secara pasti berapa kali sebuah blok kode harus dieksekusi.

Struktur For Loop terdiri dari 3 bagian statement:
```javascript
for (inisialisasi; kondisi_terminasi; perubahan_nilai) {
    // blok kode yang diulang
}
```
1. **Inisialisasi (`let i = 0`):** Dijalankan tepat satu kali sebelum perulangan dimulai.
2. **Kondisi (`i < limit`):** Dievaluasi sebelum setiap putaran dimulai. Jika bernilai `true`, blok dieksekusi; jika `false`, perulangan berhenti.
3. **Perubahan Nilai (`i++`):** Dijalankan setiap kali setelah satu putaran blok kode selesai dieksekusi.

#### Contoh

```javascript
// Perulangan menaik (Ascending)
console.log("=== Perulangan Naik ===");
for (let counter = 1; counter <= 5; counter++) {
    console.log(`Putaran ke-${counter}`);
}

// Perulangan menurun (Descending)
console.log("=== Perulangan Mundur ===");
for (let timer = 3; timer > 0; timer--) {
    console.log(`Hitung mundur: ${timer}`);
}
console.log("Waktu Habis!");

// Mengakses array menggunakan indeks loop
const tools = ["VS Code", "Terminal", "Git", "Browser"];
for (let i = 0; i < tools.length; i++) {
    console.log(`Tool #${i + 1}: ${tools[i]}`);
}
```

#### Output

```text
=== Perulangan Naik ===
Putaran ke-1
Putaran ke-2
Putaran ke-3
Putaran ke-4
Putaran ke-5
=== Perulangan Mundur ===
Hitung mundur: 3
Hitung mundur: 2
Hitung mundur: 1
Waktu Habis!
Tool #1: VS Code
Tool #2: Terminal
Tool #3: Git
Tool #4: Browser
```

#### Cara Kerja

```text
         Inisialisasi: let i = 0
                   │
                   ▼
         Kondisi: (i < tools.length)?
                   │
         ┌─────────┴─────────┐
       [true]              [false]
         │                   │
         ▼                   ▼
   Eksekusi Blok       Loop Selesai
         │
         ▼
   Increment: i++
         │
         └─────────► Kembali cek kondisi
```

**Hafalan:**

```text
for (initialization; condition; increment) { ... } → Struktur standar perulangan terkontrol
```

#### Best Practice & Kesalahan Umum

- ✅ Selalu deklarasikan variabel iterator menggunakan `let` di dalam tanda kurung loop agar variabel memiliki *block scope* yang aman dan terisolasi.
- ❌ Pastikan kondisi terminasi dan penambahan nilai (*increment*) valid agar program tidak terjebak dalam perulangan tanpa henti (*infinite loop*).

---

<a id="bagian-27"></a>

## 27. 🟡 While Loop

#### Konsep

**While Loop** adalah struktur perulangan yang mengeksekusi blok kode secara berulang selama kondisi logika yang ditentukan bernilai **`true`**.

Karakteristik While Loop:
- Pengecekan kondisi dilakukan di **awal** sebelum blok perulangan dijalankan.
- Jika kondisi bernilai `false` sejak pertama kali, maka blok di dalamnya tidak akan pernah dijalankan sama sekali (0 kali).
- Sangat cocok digunakan ketika kita tidak tahu secara pasti berapa total putaran yang dibutuhkan (misal: menunggu input tertentu dari user atau memproses antrean data).

#### Contoh

```javascript
let currentEnergy = 3;

while (currentEnergy > 0) {
    console.log(`Karakter berjalan... Sisa energi: ${currentEnergy}`);
    currentEnergy--; // Mengurangi energi agar perulangan berhenti pada akhirnya
}

console.log("Energi habis! Karakter harus istirahat.");

// Contoh simulasi dadu sampai angka 6 muncul
let diceNumber = 0;
let attempts = 0;

while (diceNumber !== 6) {
    attempts++;
    diceNumber = Math.floor(Math.random() * 6) + 1;
    console.log(`Lemparan #${attempts}: Angka ${diceNumber}`);
}
console.log(`Selamat! Angka 6 berhasil didapatkan dalam ${attempts} lemparan.`);
```

#### Output

```text
Karakter berjalan... Sisa energi: 3
Karakter berjalan... Sisa energi: 2
Karakter berjalan... Sisa energi: 1
Energi habis! Karakter harus istirahat.
Lemparan #1: Angka 2
Lemparan #2: Angka 4
Lemparan #3: Angka 6
Selamat! Angka 6 berhasil didapatkan dalam 3 lemparan.
```

#### Cara Kerja

```text
             Kondisi: while (currentEnergy > 0)
                            │
              ┌─────────────┴─────────────┐
            [true]                      [false]
              │                           │
              ▼                           ▼
        Jalankan Blok               Keluar Loop
              │
              ▼
        currentEnergy--
              │
              └──────────► Kembali cek kondisi
```

**Hafalan:**

```text
while (condition) { ... } → Mengulang blok kode selama kondisi bernilai true (cek di awal)
```

#### Best Practice & Kesalahan Umum

- ✅ Pastikan terdapat statement di dalam blok loop yang pada akhirnya akan mengubah kondisi menjadi `false`.
- ❌ Hati-hati terhadap lupa menuliskan increment/decrement di dalam body loop, karena hal ini akan membekukan aplikasi akibat *infinite loop*.

---

<a id="bagian-28"></a>

## 28. 🟡 Do While Loop

#### Konsep

**Do While Loop** adalah variasi perulangan yang mengeksekusi blok kodenya terlebih dahulu, baru kemudian memeriksa kondisi logikanya di bagian akhir.

Perbedaan Utama dengan While Loop:
- Pada `while`, kondisi dicek di awal (bisa saja blok tidak dijalankan sama sekali jika kondisi awal `false`).
- Pada `do...while`, blok kode **dijamin pasti dieksekusi minimal 1 kali**, meskipun kondisi logikanya sudah bernilai `false` sejak awal.

#### Contoh

```javascript
let balance = 0;

// Blok do di bawah ini pasti dijalankan 1 kali meskipun balance = 0
do {
    console.log(`Saldo saat ini: Rp${balance} (Menampilkan menu transaksi minimal 1x)`);
    balance -= 1000;
} while (balance > 0);

console.log("Transaksi ditutup.");
```

#### Output

```text
Saldo saat ini: Rp0 (Menampilkan menu transaksi minimal 1x)
Transaksi ditutup.
```

#### Cara Kerja

```text
            Masuk ke Blok: do { ... }
                        │
                        ▼
            Eksekusi baris kode blok
                        │
                        ▼
            Cek Kondisi: while (condition)
                        │
         ┌──────────────┴──────────────┐
       [true]                        [false]
         │                             │
         ▼                             ▼
  Ulangi Blok Lagi                Keluar Loop
```

**Hafalan:**

```text
do { ... } while (condition); → Menjalankan blok minimal 1x sebelum mengecek kondisi di akhir
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan `do...while` ketika sebuah aksi awal wajib ditampilkan terlebih dahulu kepada user sebelum validasi kelanjutan dilakukan (misal form prompt minimal sekali).
- ❌ Jangan lupa menambahkan tanda titik koma (`;`) di akhir penutup `while (condition);`.

---

<a id="bagian-29"></a>

## 29. 🟡 Break dan Continue

#### Konsep

JavaScript menyediakan dua kata kunci untuk mengontrol alur di dalam perulangan:

1. **`break`:** Menghentikan perulangan secara paksa dan langsung melompat keluar dari seluruh struktur loop saat itu juga.
2. **`continue`:** Menghentikan putaran iterasi saat ini dan langsung melompat ke putaran (*iterasi*) berikutnya tanpa mengeksekusi sisa baris kode di bawahnya.

#### Contoh

```javascript
// 1. Menggunakan break untuk menghentikan pencarian data
console.log("=== Contoh Break (Pencarian) ===");
const targetNumber = 3;

for (let i = 1; i <= 5; i++) {
    if (i === targetNumber) {
        console.log(`Angka target ${targetNumber} DITEMUKAN! Menghentikan pencarian.`);
        break; // Keluar dari loop sekarang juga
    }
    console.log(`Memeriksa angka: ${i}`);
}

// 2. Menggunakan continue untuk melewatkan angka genap (hanya cetak ganjil)
console.log("=== Contoh Continue (Hanya Ganjil) ===");
for (let num = 1; num <= 6; num++) {
    if (num % 2 === 0) {
        continue; // Lewati sisa baris kode, lanjut ke angka berikutnya
    }
    console.log(`Angka Ganjil: ${num}`);
}
```

#### Output

```text
=== Contoh Break (Pencarian) ===
Memeriksa angka: 1
Memeriksa angka: 2
Angka target 3 DITEMUKAN! Menghentikan pencarian.
=== Contoh Continue (Hanya Ganjil) ===
Angka Ganjil: 1
Angka Ganjil: 3
Angka Ganjil: 5
```

#### Cara Kerja

```text
                   Iterasi Perulangan
                            │
             ┌──────────────┴──────────────┐
             ▼                             ▼
        Ketemu break                Ketemu continue
             │                             │
             ▼                             ▼
    Hentikan seluruh loop         Lewati putaran ini,
    dan langsung keluar          langsung ke putaran berikutnya
```

**Hafalan:**

```text
break    → Menghentikan seluruh proses perulangan seketika
continue → Melewatkan sisa instruksi di putaran saat ini dan lompat ke iterasi berikutnya
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan `break` saat mencari elemen di dalam data besar agar aplikasi tidak membuang resource komputasi setelah data target ditemukan.
- ❌ Hati-hati saat menggunakan `continue` di dalam `while` loop; pastikan operasi increment/decrement ditulis *sebelum* statement `continue` agar tidak terjadi infinite loop.

---

<a id="bagian-30"></a>

## 30. 🟡 Label pada Perulangan

#### Konsep

**Label** adalah penanda nama yang diletakkan sebelum struktur perulangan. Label memungkinkan kita mengontrol secara spesifik perulangan terluar (*outer loop*) dari dalam perulangan bersarang (*nested inner loop*) menggunakan kata kunci `break labelName` atau `continue labelName`.

Format Label:
```javascript
namaLabel: for (...) {
    for (...) {
        break namaLabel; // Menghentikan perulangan terluar!
    }
}
```

#### Contoh

```javascript
// Perulangan bersarang mencari koordinat target (2, 2)
outerLoop: for (let row = 1; row <= 3; row++) {
    for (let col = 1; col <= 3; col++) {
        console.log(`Cek koordinat: (${row}, ${col})`);

        if (row === 2 && col === 2) {
            console.log("Koordinat (2, 2) ditemukan! Menghentikan seluruh perulangan terluar.");
            break outerLoop; // Menghentikan loop terluar (outerLoop)
        }
    }
}
```

#### Output

```text
Cek koordinat: (1, 1)
Cek koordinat: (1, 2)
Cek koordinat: (1, 3)
Cek koordinat: (2, 1)
Cek koordinat: (2, 2)
Koordinat (2, 2) ditemukan! Menghentikan seluruh perulangan terluar.
```

#### Cara Kerja

```text
        outerLoop: for (row...)
             │
             ▼
        for (col...)
             │
             ▼
        Kondisi Terpenuhi -> break outerLoop;
             │
             ▼
        Langsung keluar dari loop 'outerLoop' terluar
```

**Hafalan:**

```text
labelName: statement   → Memberi nama identitas pada blok perulangan
break labelName        → Menghentikan loop yang berlabel labelName dari dalam nested loop
continue labelName     → Melompat ke iterasi berikutnya dari loop yang berlabel labelName
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan label hanya pada algoritma matriks/grid multi-dimensi yang membutuhkan penghentian loop luar secara efisien.
- ❌ Jangan menggunakan label secara berlebihan untuk alur kode biasa karena dapat membuat struktur logika menyerupai *spaghetti code*.

---

<a id="bagian-31"></a>

## 31. 🟡 For In dan For Of

#### Konsep

JavaScript menyediakan dua variasi loop modern untuk menelusuri koleksi data:

1. **`for...in` (Iterasi Property Key):**
   - Digunakan untuk mengulang seluruh nama properti (**key / nama atribut**) di dalam sebuah **Object** (atau nomor index di array).
   - Menghasilkan: nama properti berupa *string*.

2. **`for...of` (Iterasi Nilai Elemen / Iterable):**
   - Digunakan untuk mengulang langsung **nilai elemen** dari objek yang dapat diiterasi (*Iterable*), seperti **Array**, **String**, **Map**, dan **Set**.
   - Menghasilkan: nilai data secara langsung (*value*).

#### Contoh

```javascript
// 1. Menggunakan for...in untuk menelusuri Objek
const student = {
    name: "Aisyah",
    major: "Informatika",
    gpa: 3.85
};

console.log("=== Menelusuri Objek dengan for...in ===");
for (const key in student) {
    console.log(`Key: ${key} -> Value: ${student[key]}`);
}

// 2. Menggunakan for...of untuk menelusuri Array
const languages = ["JavaScript", "TypeScript", "Python"];

console.log("=== Menelusuri Array dengan for...of ===");
for (const lang of languages) {
    console.log(`Bahasa: ${lang}`);
}
```

#### Output

```text
=== Menelusuri Objek dengan for...in ===
Key: name -> Value: Aisyah
Key: major -> Value: Informatika
Key: gpa -> Value: 3.85
=== Menelusuri Array dengan for...of ===
Bahasa: JavaScript
Bahasa: TypeScript
Bahasa: Python
```

#### Cara Kerja

```text
          Pilihan Loop Penelusuran Koleksi
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
    Objek { key: val }            Array [ val1, val2 ]
          │                             │
          ▼                             ▼
     for...in                      for...of
  (Mengambil Key/Properti)      (Mengambil Nilai Elemen)
```

**Hafalan:**

```text
for (const key in object) { ... }  → Mengulang nama key properti pada objek
for (const value of array) { ... } → Mengulang nilai elemen langsung pada array/iterable
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan `for...of` untuk mengulang isi Array, dan `for...in` untuk mengulang properti Objek.
- ❌ Hindari menggunakan `for...in` pada Array karena urutan index tidak selalu dijamin terurut dan properti prototype bisa ikut terambil.

---

<a id="bagian-32"></a>

## 32. 🟡 With Statement (dan Mengapa Ditinggalkan)

#### Konsep

**With Statement** adalah fitur lama JavaScript yang dibuat dengan tujuan memperpendek penulisan properti objek tanpa perlu mengulang nama objek induknya.

Format Sintaks:
```javascript
with (object) {
    // properti objek bisa diakses seolah-olah variabel lokal
}
```

##### Mengapa Ditinggalkan & Dilarang di Kode Modern?
1. **Ambiguitas Variabel:** Tidak jelas apakah sebuah identifier adalah variabel lokal atau properti objek.
2. **Rawan Bug Fatal:** Jika nama variabel tidak sengaja sama dengan properti bawaan objek, program akan salah memanipulasi data.
3. **Merusak Optimasi Engine:** Mesin JavaScript tidak bisa mengoptimasi performa kode di dalam blok `with`.
4. **Dilarang di Strict Mode:** `with` statement akan menghasilkan `SyntaxError` jika dijalankan di bawah mode ketat (*Strict Mode* / ES Modules).

#### Contoh

```javascript
const userProfile = {
    firstName: "Budi",
    lastName: "Santoso"
};

// Cara with (Tidak Direkomendasikan & Dilarang di Strict Mode)
// with (userProfile) {
//     console.log(firstName + " " + lastName);
// }

// Cara Modern yang Benar: Menggunakan Destructuring (ES6)
const { firstName, lastName } = userProfile;
console.log(`Nama Lengkap (Destructuring): ${firstName} ${lastName}`);
```

#### Output

```text
Nama Lengkap (Destructuring): Budi Santoso
```

#### Cara Kerja

```text
       with (userProfile)             const { firstName } = userProfile
              │                                      │
              ▼                                      ▼
       Scope Ambigu                           Scope Jelas & Terisolasi
       (Dilarang Strict Mode)                 (Standar ES6 Modern)
```

**Hafalan:**

```text
with (object) { ... } → Fitur usang berbahaya (hindari dan jangan pernah digunakan)
const { prop } = obj  → Standar modern pengganti with menggunakan Object Destructuring
```

#### Best Practice & Kesalahan Umum

- ✅ Selalu gunakan *Object Destructuring* modern (`const { prop } = object`) untuk mengekstrak properti objek secara aman dan bersih.
- ❌ Jangan pernah menuliskan keyword `with` di aplikasi modern.

---

<a id="bagian-33"></a>

## 33. 🟡 Function Dasar & Deklarasi

#### Konsep

**Function** (Fungsi) adalah blok kode program yang dirancang untuk melakukan tugas tertentu, dibungkus dalam satu unit bernama, dan dapat dipanggil (*di-invoke*) berulang kali kapan pun dibutuhkan (*reusable code*).

Keuntungan Menggunakan Function:
- **DRY (Don't Repeat Yourself):** Menghindari penulisan kode logika yang sama berulang kali.
- **Modularitas:** Membagi program besar menjadi potongan-potongan tugas kecil yang terstruktur.
- **Hoisting pada Function Declaration:** Fungsi yang dideklarasikan dengan kata kunci `function namaFungsi()` akan dinaikkan (*hoisted*) ke atas oleh engine, sehingga dapat dipanggil bahkan sebelum baris deklarasinya ditulis.

#### Contoh

```javascript
// Memanggil fungsi sebelum deklarasi (Bisa karena Hoisting)
greetUser();

// Deklarasi Function (Function Declaration)
function greetUser() {
    console.log("Halo! Selamat datang di aplikasi kami.");
}

// Memanggil fungsi kembali
greetUser();
greetUser();
```

#### Output

```text
Halo! Selamat datang di aplikasi kami.
Halo! Selamat datang di aplikasi kami.
Halo! Selamat datang di aplikasi kami.
```

#### Cara Kerja

```text
      Mendeklarasikan: function greetUser() { ... }
                            │
                            ▼
      Engine mendaftarkan nama fungsi ke memori (Hoisting)
                            │
                            ▼
      Pemanggilan: greetUser()
                            │
                            ▼
      Mengeksekusi isi blok kode di dalam fungsi
```

**Hafalan:**

```text
function functionName() { ... } → Deklarasi fungsi standar (di-hoist otomatis)
functionName()                  → Memanggil dan mengeksekusi blok kode fungsi
```

#### Best Practice & Kesalahan Umum

- ✅ Berikan nama fungsi menggunakan kata kerja yang deskriptif sesuai tindakannya (*verb-noun*), contoh: `calculateTotal`, `fetchUserData`, `validateEmail`.
- ❌ Hindari membuat satu fungsi yang mengerjakan terlalu banyak hal berbeda sekaligus (*Single Responsibility Principle*).

---

<a id="bagian-34"></a>

## 34. 🟡 Parameter dan Return Value

#### Konsep

Function menjadi sangat fleksibel berkat adanya **Parameter** dan **Return Value**:

1. **Parameter & Argument:**
   - **Parameter:** Variabel yang didefinisikan di tanda kurung fungsi untuk menerima data masukan.
   - **Argument:** Nilai aktual yang kita kirimkan saat memanggil fungsi tersebut.
2. **Return Value (`return`):**
   - Kata kunci `return` digunakan untuk mengirimkan nilai hasil komputasi dari dalam fungsi kembali ke pemanggil.
   - Eksekusi fungsi akan langsung **berhenti seketika** saat baris `return` dijalankan.
   - Jika fungsi tidak memiliki statement `return`, maka fungsi tersebut secara implisit mengembalikan nilai `undefined`.

#### Contoh

```javascript
// Fungsi dengan 2 parameter (price, discountPercent) dan return value
function calculateDiscountPrice(price, discountPercent) {
    const discountAmount = price * (discountPercent / 100);
    const finalPrice = price - discountAmount;
    
    return finalPrice; // Mengembalikan hasil perhitungan
}

// Memanggil fungsi dengan argumen nyata
const originalPrice = 200000;
const promoDiscount = 20; // 20%
const payablePrice = calculateDiscountPrice(originalPrice, promoDiscount);

console.log(`Harga awal: Rp${originalPrice}`);
console.log(`Diskon: ${promoDiscount}%`);
console.log(`Harga bayar: Rp${payablePrice}`);

// Contoh Early Return (Berhenti lebih awal jika input tidak valid)
function checkMembershipStatus(points) {
    if (points < 0) {
        return "Poin tidak valid"; // Langsung keluar dari fungsi
    }
    if (points >= 1000) {
        return "Gold Member";
    }
    return "Silver Member";
}

console.log("Status:", checkMembershipStatus(1200));
console.log("Status Negatif:", checkMembershipStatus(-5));
```

#### Output

```text
Harga awal: Rp200000
Diskon: 20%
Harga bayar: Rp160000
Status: Gold Member
Status Negatif: Poin tidak valid
```

#### Cara Kerja

```text
         Argumen Dikirim: calculateDiscountPrice(200000, 20)
                                │
                                ▼
         Parameter Diterima: (price = 200000, discountPercent = 20)
                                │
                                ▼
         Proses Hitung: finalPrice = 160000
                                │
                                ▼
         return finalPrice; (Mengembalikan 160000 ke variabel pemanggil)
```

**Hafalan:**

```text
function name(param1, param2) { return result; } → Fungsi menerima parameter dan mengembalikan nilai
return value;                                    → Mengembalikan hasil dan langsung menghentikan fungsi
```

#### Best Practice & Kesalahan Umum

- ✅ Terapkan pola *Early Return* (keluar seawal mungkin jika ada kondisi error/invalid) agar kode tidak bertumpuk di dalam blok else.
- ❌ Jangan menuliskan kode apa pun tepat di bawah statement `return`, karena kode tersebut tidak akan pernah dieksekusi (*unreachable code*).

---

<a id="bagian-35"></a>

## 35. 🟡 Optional Parameter, Default Parameter & Rest Parameter

#### Konsep

JavaScript menyediakan fitur modern untuk menangani fleksibilitas parameter fungsi:

1. **Optional Parameter:**
   Secara alami di JavaScript, seluruh parameter bersifat opsional. Jika argumen tidak dikirimkan saat pemanggilan, parameter tersebut otomatis bernilai `undefined`.
2. **Default Parameter (ES6):**
   Memungkinkan kita menentukan nilai bawaan jika argumen tidak dikirim atau bernilai `undefined` (`param = defaultValue`).
3. **Rest Parameter (`...args`):**
   Menggabungkan sejumlah argumen tak terbatas menjadi satu array utuh. Wajib diletakkan di posisi paling terakhir dalam daftar parameter.

#### Contoh

```javascript
// 1. Default Parameter
function registerUser(name, role = "Reguler", isActive = true) {
    console.log(`User: ${name} | Role: ${role} | Status Aktif: ${isActive}`);
}

registerUser("Budi"); // role & isActive menggunakan nilai default
registerUser("Siti", "Admin", true); // nilai default ditimpa

// 2. Rest Parameter (...numbers)
function sumAllNumbers(...numbers) {
    // numbers otomatis menjadi Array murni
    let total = 0;
    for (const num of numbers) {
        total += num;
    }
    return total;
}

console.log("Total (3 angka):", sumAllNumbers(10, 20, 30));
console.log("Total (5 angka):", sumAllNumbers(1, 2, 3, 4, 5));

// 3. Kombinasi parameter biasa dan Rest Parameter
function createInvoice(customerName, ...itemPrices) {
    const total = sumAllNumbers(...itemPrices);
    return `Faktur atas nama ${customerName}: Total Rp${total}`;
}

console.log(createInvoice("Andi", 50000, 75000, 25000));
```

#### Output

```text
User: Budi | Role: Reguler | Status Aktif: true
User: Siti | Role: Admin | Status Aktif: true
Total (3 angka): 60
Total (5 angka): 15
Faktur atas nama Andi: Total Rp150000
```

#### Cara Kerja

```text
     Pemanggilan: sumAllNumbers(10, 20, 30)
                         │
                         ▼
     Rest Parameter: (...numbers)
                         │
                         ▼
     Engine membungkus argumen menjadi Array: [10, 20, 30]
```

**Hafalan:**

```text
function name(param = defaultValue) → Menetapkan nilai bawaan jika argumen kosong
function name(...restParams)        → Menampung seluruh sisa argumen ke dalam sebuah Array
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan Rest Parameter (`...args`) alih-alih variabel jadul `arguments`, karena Rest Parameter menghasilkan array JavaScript asli yang memiliki method `.map()`, `.filter()`, dll.
- ❌ Rest parameter hanya boleh ada satu dan **wajib** diletakkan di posisi paling akhir dalam daftar parameter fungsi.

---

<a id="bagian-36"></a>

## 36. 🔴 Function Sebagai Value & Anonymous Function

#### Konsep

Di JavaScript, function diperlakukan sebagai **First-Class Citizen** (atau *First-Class Value*). Artinya, function memiliki derajat yang sama seperti tipe data lainnya (seperti string atau number):
- Bisa disimpan di dalam variabel (*Function Expression*).
- Bisa dikirimkan sebagai argumen ke fungsi lain (*Callback*).
- Bisa dikembalikan sebagai nilai return dari fungsi lain (*Higher-Order Function*).

**Anonymous Function** adalah fungsi yang tidak memiliki nama identitas. Biasanya digunakan langsung sebagai nilai variabel atau argumen callback sementara.

#### Contoh

```javascript
// 1. Menyimpan Anonymous Function ke dalam variabel (Function Expression)
const sayHello = function(name) {
    return `Halo ${name}, selamat pagi!`;
};

console.log(sayHello("Dewi"));

// 2. Mengirimkan Function sebagai Argumen (Callback)
function processUserGreeting(userName, callbackFunction) {
    const message = callbackFunction(userName);
    console.log("[LOG SERVER]:", message);
}

processUserGreeting("Budi", sayHello);

// 3. Mengirimkan Anonymous Function secara langsung (Inline Callback)
processUserGreeting("Rina", function(name) {
    return `Selamat datang, Member VIP ${name}!`;
});
```

#### Output

```text
Halo Dewi, selamat pagi!
[LOG SERVER]: Halo Budi, selamat pagi!
[LOG SERVER]: Selamat datang, Member VIP Rina!
```

#### Cara Kerja

```text
      Variabel: const sayHello = function(name) { ... }
                         │
                         ▼
      Variabel sayHello menunjuk ke referensi blok fungsi di memori
                         │
                         ▼
      sayHello("Dewi") mengeksekusi referensi fungsi tersebut
```

**Hafalan:**

```text
const identifier = function(parameters) { ... } → Function expression / anonymous function
higherOrderFunction(data, callbackFunction)     → Mengirimkan fungsi sebagai argumen ke fungsi lain
```

#### Best Practice & Kesalahan Umum

- ✅ Sadari bahwa Function Expression yang disimpan di variabel `const` tidak terkena efek *hoisting*; variabel tersebut harus dideklarasikan sebelum dipanggil.
- ❌ Jangan membuat callback yang terlalu rumit secara inline berulang-ulang (*Callback Hell*); pisahkan menjadi fungsi modular bernama jika logika semakin panjang.

---

<a id="bagian-37"></a>

## 37. 🔴 Function dalam Function & Scope

#### Konsep

JavaScript mendukung pembuatan fungsi di dalam fungsi lain (**Nested Function** / *Inner Function*).

##### Mental Model Scope (Lingkup Akses Variabel):
1. **Global Scope:** Variabel yang dideklarasikan di luar fungsi/blok dapat diakses dari mana saja.
2. **Function Scope:** Variabel yang dideklarasikan di dalam suatu fungsi hanya bisa diakses di dalam fungsi tersebut.
3. **Block Scope (`let` / `const`):** Variabel hanya hidup di dalam kurung kurawal `{ ... }`.
4. **Lexical Scoping (Scope Chain):** Fungsi bagian dalam (*inner function*) memiliki akses penuh ke variabel milik fungsi pembungkusnya (*outer function*), namun fungsi luar **TIDAK** bisa mengakses variabel lokal milik fungsi dalam.

#### Contoh

```javascript
const globalAppName = "Sistem Akademik"; // Global Scope

function outerCourseManager(courseName) {
    const courseCode = "IF-101"; // Outer Function Scope

    function innerEnrollStudent(studentName) {
        const enrollmentId = "ENR-" + Math.floor(Math.random() * 1000); // Inner Scope
        
        // Mengakses variabel dari inner scope, outer scope, dan global scope
        console.log(`[${globalAppName}]`);
        console.log(`Mahasiswa: ${studentName} (ID: ${enrollmentId})`);
        console.log(`Mendaftar Mata Kuliah: ${courseName} [${courseCode}]`);
    }

    innerEnrollStudent("Fajar Pratama");
    
    // console.log(enrollmentId); // Error! enrollmentId tidak bisa diakses dari outer function
}

outerCourseManager("Algoritma Pemrograman");
```

#### Output

```text
[Sistem Akademik]
Mahasiswa: Fajar Pratama (ID: ENR-824)
Mendaftar Mata Kuliah: Algoritma Pemrograman [IF-101]
```

#### Cara Kerja

```text
            Global Scope (globalAppName)
                        │
                        ▼
            Outer Function Scope (courseName, courseCode)
                        │
                        ▼
            Inner Function Scope (studentName, enrollmentId)
       (Dapat membaca ke atas, tapi tidak bisa dibaca dari luar)
```

**Hafalan:**

```text
Inner Function → Dapat mengakses parameter dan variabel milik Outer Function
Outer Function → TIDAK DAPAT mengakses variabel privat di dalam Inner Function
```

#### Best Practice & Kesalahan Umum

- ✅ Manfaatkan nested function untuk menyembunyikan fungsi bantuan kecil (*helper functions*) yang hanya relevan bagi satu operasi spesifik.
- ❌ Hindari mencemari Global Scope (*Global Scope Pollution*) dengan membuat variabel tanpa pembungkus fungsi/modul.

---

<a id="bagian-38"></a>

## 38. 🔴 Recursive Function

#### Konsep

**Recursive Function** (Fungsi Rekursif) adalah fungsi yang **memanggil dirinya sendiri** secara berulang hingga mencapai kondisi pemberhentian tertentu.

Dua Bagian Wajib Fungsi Rekursif:
1. **Base Case (Kondisi Berhenti):** Kondisi yang menghentikan rekursi dan mengembalikan nilai akhir tanpa memanggil fungsi lagi.
2. **Recursive Step:** Pemanggilan diri sendiri dengan nilai argumen yang bergerak mendekati *Base Case*.

Fungsi rekursif sangat elegan untuk memproses struktur hierarki (seperti pohon folder, menu bersarang, JSON beranak) dan perhitungan matematika rekursif (faktorial, fibonacci).

#### Contoh

```javascript
// 1. Menghitung Faktorial (5! = 5 * 4 * 3 * 2 * 1)
function factorial(n) {
    // Base Case (Kondisi Berhenti)
    if (n <= 1) {
        return 1;
    }
    
    // Recursive Step
    return n * factorial(n - 1);
}

console.log("Faktorial 5 (5!):", factorial(5)); // 120
console.log("Faktorial 3 (3!):", factorial(3)); // 6

// 2. Menelusuri Kategori Bersarang (Nested Category Tree)
const categoryTree = {
    name: "Elektronik",
    sub: {
        name: "Komputer",
        sub: {
            name: "Laptop Gaming",
            sub: null
        }
    }
};

function printCategoryHierarchy(category, level = 0) {
    if (!category) return; // Base case
    
    console.log("  ".repeat(level) + "-> " + category.name);
    printCategoryHierarchy(category.sub, level + 1); // Rekursi
}

printCategoryHierarchy(categoryTree);
```

#### Output

```text
Faktorial 5 (5!): 120
Faktorial 3 (3!): 6
-> Elektronik
  -> Komputer
    -> Laptop Gaming
```

#### Cara Kerja

```text
        factorial(3)
             │
             ▼
        3 * factorial(2)
                 │
                 ▼
            2 * factorial(1)
                     │
                     ▼
                Base Case: return 1
                     │
        ◄────────────┴──────────── Selesaikan Call Stack ke Atas
        Hasil Akhir = 3 * 2 * 1 = 6
```

**Hafalan:**

```text
Base Case      → Kondisi berhenti agar fungsi tidak memanggil dirinya sendiri lagi
Recursive Step → Memanggil dirinya sendiri dengan parameter yang semakin kecil menuju base case
```

#### Best Practice & Kesalahan Umum

- ✅ Selalu pastikan *Base Case* ditulis di baris paling atas fungsi dan kondisi penghentian dapat tercapai.
- ❌ Hati-hati terhadap *Stack Overflow* (`Maximum call stack size exceeded`) jika Base Case tidak pernah terpenuhi atau kedalaman rekursi terlalu besar.

---

<a id="bagian-39"></a>

## 39. 🔴 Function Generator (function* & yield)

#### Konsep

**Function Generator** adalah tipe fungsi khusus di JavaScript yang eksekusinya dapat **dihentikan sementara (*pause*)** di tengah jalan dan kemudian **dilanjutkan kembali (*resume*)** di masa mendatang.

Karakteristik Generator:
- Dideklarasikan dengan tanda bintang `function* namaGenerator()`.
- Menggunakan kata kunci **`yield`** untuk mengembalikan nilai sementara sekaligus menjeda eksekusi fungsi.
- Saat dipanggil, generator tidak langsung mengeksekusi kodenya, melainkan mengembalikan objek **Generator Iterator**.
- Memanggil method **`.next()`** akan melanjutkan eksekusi hingga menemukan kata kunci `yield` berikutnya, dan mengembalikan objek `{ value: ..., done: boolean }`.
- Bersifat *Lazy Evaluation* (hanya menghitung data saat diminta, sangat hemat memori).

#### Contoh

```javascript
// Membuat Generator Penghasil Nomor ID Tiket Otomatis
function* ticketNumberGenerator() {
    console.log("[Generator]: Mengambil tiket antrean 1");
    yield "TIKET-001";

    console.log("[Generator]: Mengambil tiket antrean 2");
    yield "TIKET-002";

    console.log("[Generator]: Mengambil tiket antrean 3 (Terakhir)");
    yield "TIKET-003";
}

// Inisialisasi generator
const ticketBooth = ticketNumberGenerator();

console.log("Panggilan 1:", ticketBooth.next());
console.log("Panggilan 2:", ticketBooth.next());
console.log("Panggilan 3:", ticketBooth.next());
console.log("Panggilan 4:", ticketBooth.next()); // Selesai (done: true)

// Generator Iterator dengan perulangan for...of
function* generateNumberSequence(limit) {
    for (let i = 1; i <= limit; i++) {
        yield i * 10;
    }
}

console.log("=== Mengulang Generator dengan for...of ===");
for (const val of generateNumberSequence(3)) {
    console.log("Nilai:", val);
}
```

#### Output

```text
[Generator]: Mengambil tiket antrean 1
Panggilan 1: { value: 'TIKET-001', done: false }
[Generator]: Mengambil tiket antrean 2
Panggilan 2: { value: 'TIKET-002', done: false }
[Generator]: Mengambil tiket antrean 3 (Terakhir)
Panggilan 3: { value: 'TIKET-003', done: false }
Panggilan 4: { value: undefined, done: true }
=== Mengulang Generator dengan for...of ===
Nilai: 10
Nilai: 20
Nilai: 30
```

#### Cara Kerja

```text
          ticketBooth.next()
                  │
                  ▼
          Jalankan sampai 'yield "TIKET-001"'
                  │
                  ▼
          Kembalikan { value: "TIKET-001", done: false }
          dan PAUSE (status posisi tersimpan)
```

**Hafalan:**

```text
function* name() { yield value; } → Deklarasi fungsi generator bertahap
generatorObject.next()             → Melanjutkan eksekusi ke yield berikutnya
{ value: ..., done: boolean }      → Struktur objek return dari iterator generator
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan generator untuk menghasilkan deret data tak terhingga atau membaca streaming file besar tanpa membebani kapasitas RAM.
- ❌ Ingat bahwa generator bukan array biasa; data di dalamnya di-generate secara *on-demand*, sehingga tidak bisa diakses dengan indeks `gen[0]`.

---

<a id="bagian-40"></a>

## 40. 🔴 Arrow Function (() =>)

#### Konsep

**Arrow Function** adalah sintaks ringkas modern (ES6) untuk menuliskan fungsi menggunakan tanda panah gemuk (**`=>`**).

Keunggulan & Karakteristik Arrow Function:
1. **Sintaks Sangat Ringkas:** Tanpa perlu menulis kata kunci `function` dan `return` (pada ekspresi satu baris / *implicit return*).
2. **Lexical `this`:** Arrow function **TIDAK** memiliki konteks `this` sendiri; nilai `this` diwarisi langsung dari scope sekelilingnya saat didefinisikan (*lexical scope*).
3. **Tidak Memiliki `arguments` Object:** Gunakan Rest Parameter `...args` sebagai gantinya.
4. **Tidak Bisa Digunakan Sebagai Constructor:** Tidak bisa dipanggil dengan kata kunci `new`.

#### Contoh

```javascript
// 1. Perbandingan Fungsi Biasa vs Arrow Function
// Fungsi biasa:
const multiplyOld = function(a, b) {
    return a * b;
};

// Arrow Function standar:
const multiplyStandard = (a, b) => {
    return a * b;
};

// Arrow Function satu baris (Implicit Return):
const multiplyShort = (a, b) => a * b;

console.log("Multiply:", multiplyShort(5, 4));

// 2. Parameter tunggal (tanda kurung opsional)
const square = x => x * x;
console.log("Square 6:", square(6));

// 3. Digunakan sebagai Callback pada Array Methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
const evens = numbers.filter(num => num % 2 === 0);

console.log("Doubled:", doubled);
console.log("Evens:", evens);
```

#### Output

```text
Multiply: 20
Square 6: 36
Doubled: [ 2, 4, 6, 8, 10 ]
Evens: [ 2, 4 ]
```

#### Cara Kerja

```text
         const double = x => x * 2;
                         │
                         ▼
        Menerima input x, otomatis me-return ekspresi x * 2
        (Implicit Return tanpa kata kunci 'return')
```

**Hafalan:**

```text
(param1, param2) => expression        → Arrow function satu baris dengan implicit return
(param1, param2) => { return result; } → Arrow function dengan blok kode kurung kurawal
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan arrow function sebagai pilihan utama saat menulis fungsi callback (seperti di `.map()`, `.filter()`, `.reduce()`, timer, atau event handler).
- ❌ Jangan gunakan arrow function sebagai method objek jika method tersebut memerlukan akses ke properti internal objek melalui `this`.

---

<a id="bagian-41"></a>

## 41. 🔴 Closure & Data Privacy

#### Konsep

**Closure** adalah kombinasi antara sebuah fungsi dan **lingkungan leksikal (*lexical environment*)** tempat fungsi tersebut pertama kali diciptakan.

Dengan kata lain: sebuah fungsi dalam (*inner function*) akan selalu **mengingat dan memiliki akses** ke variabel-variabel lokal milik fungsi pembungkusnya (*outer function*), bahkan setelah fungsi pembungkus tersebut selesai dieksekusi dan keluar dari call stack.

Kegunaan Utama Closure:
- **Data Privacy / Encapsulation:** Menyembunyikan variabel agar bersifat privat dan tidak dapat diubah secara langsung dari luar.
- **Function Factory:** Membuat fungsi-fungsi spesifik berdasarkan konfigurasi awal.

#### Contoh

```javascript
// Membuat Counter Mandiri dengan Variabel Privat
function createBankCounter(accountHolder, initialBalance) {
    // Variabel ini bersifat PRIVAT (terkapsulasi di dalam closure)
    let balance = initialBalance;

    return {
        getAccountHolder: () => accountHolder,
        checkBalance: () => `Saldo ${accountHolder}: Rp${balance}`,
        deposit: (amount) => {
            if (amount <= 0) return "Jumlah setoran tidak valid";
            balance += amount;
            return `Setor Rp${amount} berhasil. Saldo saat ini: Rp${balance}`;
        },
        withdraw: (amount) => {
            if (amount > balance) return "Saldo tidak mencukupi!";
            balance -= amount;
            return `Tarik Rp${amount} berhasil. Sisa saldo: Rp${balance}`;
        }
    };
}

const budiAccount = createBankCounter("Budi", 100000);

console.log(budiAccount.checkBalance());
console.log(budiAccount.deposit(50000));
console.log(budiAccount.withdraw(30000));

// Mencoba manipulasi saldo langsung dari luar
console.log("Akses balance langsung:", budiAccount.balance); // undefined (AMAN!)
```

#### Output

```text
Saldo Budi: Rp100000
Setor Rp50000 berhasil. Saldo saat ini: Rp150000
Tarik Rp30000 berhasil. Sisa saldo: Rp120000
Akses balance langsung: undefined
```

#### Cara Kerja

```text
     createBankCounter("Budi", 100000) selesai dieksekusi
                         │
                         ▼
     Fungsi keluar dari Call Stack, TETAPI...
                         │
                         ▼
     Objek method tetap mengikat memori variabel 'balance'
     melalui mekanisme CLOSURE
```

**Hafalan:**

```text
Closure → Kemampuan fungsi inner untuk mempertahankan akses ke scope fungsi outer
Privacy → Melindungi variabel dari mutasi liar di scope global
```

#### Best Practice & Kesalahan Umum

- ✅ Manfaatkan closure untuk membuat factory functions dan modul enkapsulasi data tanpa perlu class yang berat.
- ❌ Hati-hati terhadap penumpukan memori (*memory leaks*) jika closure menahan referensi objek besar yang sudah tidak lagi digunakan.

---

<a id="bagian-42"></a>

## 42. 🔴 Object Method dan Kata Kunci this

#### Konsep

Ketika sebuah fungsi disimpan sebagai properti di dalam suatu objek, fungsi tersebut disebut sebagai **Method**.

Kata kunci **`this`** merujuk pada **objek pemilik saat ini (*current context object*)** yang sedang memanggil method tersebut. Nilai `this` ditentukan secara dinamis pada saat fungsi **dipanggil** (*call-site*), bukan saat didefinisikan.

#### Contoh

```javascript
const employee = {
    id: "EMP-01",
    firstName: "Budi",
    lastName: "Santoso",
    baseSalary: 8000000,
    
    // Method konvensional (menggunakan this)
    getFullName: function() {
        return `${this.firstName} ${this.lastName}`;
    },

    // Method shorthand modern (ES6 - Direkomendasikan)
    calculateBonus(percentage) {
        const bonus = this.baseSalary * (percentage / 100);
        return `Bonus untuk ${this.getFullName()}: Rp${bonus}`;
    }
};

console.log("Nama Karyawan:", employee.getFullName());
console.log(employee.calculateBonus(15));
```

#### Output

```text
Nama Karyawan: Budi Santoso
Bonus untuk Budi Santoso: Rp1200000
```

#### Cara Kerja

```text
         Pemanggilan: employee.getFullName()
                            │
                            ▼
         Engine mengecek objek di sebelah kiri tanda titik: employee
                            │
                            ▼
         Di dalam getFullName, 'this' mengarah ke 'employee'
```

**Hafalan:**

```text
object.method()           → Memanggil fungsi sebagai bagian dari objek
this.propertyName         → Mengakses properti milik objek pemanggil saat ini
methodName(params) { ... }→ Sintaks ringkas (method shorthand) di dalam object literal
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan sintaks *method shorthand* (`methodName() { ... }`) di dalam objek literal untuk penulisan method yang rapi.
- ❌ Jika method dioper sebagai callback tanpa pengikatan (*binding*), referensi `this` bisa terlepas (*lost context*).

---

<a id="bagian-43"></a>

## 43. 🔴 Arrow Function di Object & Perilaku this

#### Konsep

Salah satu jebakan terbesar bagi pemula di JavaScript adalah menggunakan **Arrow Function** sebagai method objek.

##### Perbedaan Fatal Konteks `this`:
1. **Regular Function Method:** Mendapatkan konteks `this` dinamis yang menunjuk ke objek yang memanggil method tersebut.
2. **Arrow Function:** **TIDAK MEMILIKI KONTEKS `this` SENDIRI**. Arrow function mengambil `this` dari lingkungan luar (*lexical scope* tempat objek tersebut dibuat, yang umumnya adalah objek `window` di browser atau `global`/`{}` di Node.js). Akibatnya, `this.property` akan bernilai `undefined`.

#### Contoh

```javascript
const userProfile = {
    username: "superbudi",
    level: 5,

    // 1. Regular Function Method (BENAR)
    showProfileRegular: function() {
        console.log(`[Regular] User: ${this.username}, Level: ${this.level}`);
    },

    // 2. Arrow Function Method (SALAH & JEBAKAN)
    showProfileArrow: () => {
        // 'this' di sini BUKAN userProfile, melainkan Global / Window!
        console.log(`[Arrow] User: ${this?.username}, Level: ${this?.level}`);
    }
};

userProfile.showProfileRegular(); // Berfungsi sempurna
userProfile.showProfileArrow();   // undefined!
```

#### Output

```text
[Regular] User: superbudi, Level: 5
[Arrow] User: undefined, Level: undefined
```

#### Cara Kerja

```text
   userProfile.showProfileRegular() ──► 'this' menunjuk ke userProfile (BERHASIL)
   userProfile.showProfileArrow()   ──► 'this' menunjuk ke Global Object (UNDEFINED)
```

**Hafalan:**

```text
Method Objek    → Wajib menggunakan Regular Function / Method Shorthand
Callback Nested → Sangat ideal menggunakan Arrow Function agar 'this' tidak berubah
```

#### Best Practice & Kesalahan Umum

- ✅ Jangan pernah membuat method utama sebuah objek menggunakan arrow function jika di dalamnya memerlukan akses terhadap `this`.
- ✅ Gunakan arrow function pada *callback di dalam method* agar ia mewarisi konteks `this` dari method pembungkusnya secara otomatis tanpa perlu trik `const self = this`.

---

<a id="bagian-44"></a>

## 44. 🔴 Getter dan Setter di Object

#### Konsep

JavaScript menyediakan kata kunci khusus **`get`** (Getter) dan **`set`** (Setter) pada objek literal atau class:

1. **Getter (`get propertyName()`):** Method yang bertindak seolah-olah sebagai properti biasa untuk membaca data (*computed property*). Dipanggil tanpa tanda kurung `()`.
2. **Setter (`set propertyName(value)`):** Method yang bertindak untuk memvalidasi dan mengubah data saat sebuah nilai ditugaskan ke properti (`obj.prop = val`).

Manfaat:
- Enkapsulasi data dengan validasi otomatis sebelum nilai disimpan.
- Membuat nilai dinamis (*computed*) yang selalu ter-update secara otomatis.

#### Contoh

```javascript
const studentRecord = {
    firstName: "Ratna",
    lastName: "Pertiwi",
    _score: 0, // Konvensi underscore: properti internal

    // Getter untuk nama lengkap dinamis
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    },

    // Setter untuk nama lengkap
    set fullName(value) {
        const parts = value.split(" ");
        this.firstName = parts[0] ?? "";
        this.lastName = parts.slice(1).join(" ") ?? "";
    },

    // Getter untuk nilai
    get score() {
        return this._score;
    },

    // Setter untuk validasi nilai
    set score(newScore) {
        if (typeof newScore !== "number" || newScore < 0 || newScore > 100) {
            console.error(`Gagal set score: Nilai ${newScore} tidak valid (harus 0 - 100)!`);
            return;
        }
        this._score = newScore;
    }
};

// Mengakses getter (seperti properti biasa, tanpa kurung ())
console.log("Nama Lengkap:", studentRecord.fullName);

// Menugaskan nilai ke setter
studentRecord.fullName = "Siti Rahmawati";
console.log("Setelah diubah via setter:", studentRecord.firstName, "|", studentRecord.lastName);

// Validasi setter
studentRecord.score = 95; // Berhasil
console.log("Score saat ini:", studentRecord.score);

studentRecord.score = 150; // Ditolak oleh validasi setter
```

#### Output

```text
Nama Lengkap: Ratna Pertiwi
Setelah diubah via setter: Siti | Rahmawati
Score saat ini: 95
Gagal set score: Nilai 150 tidak valid (harus 0 - 100)!
```

#### Cara Kerja

```text
         studentRecord.fullName = "Siti Rahmawati"
                           │
                           ▼
         Memicu pemanggilan method: set fullName(value)
                           │
                           ▼
         Memisahkan nama dan memperbarui firstName & lastName
```

**Hafalan:**

```text
get propertyName() { return val; } → Mendefinisikan properti baca dinamis (tanpa kurung ())
set propertyName(value) { ... }    → Mendefinisikan properti tulis dengan validasi otomatis
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan getter dan setter untuk menambahkan validasi data tanpa mengubah cara pemanggilan API objek dari sisi luar.
- ❌ Jangan menamai getter/setter persis sama dengan nama properti penyimpan internalnya tanpa pembeda (misal gunakan `_score`), karena akan menyebabkan pemanggilan rekursif tanpa henti (*infinite recursion crash*).

---

<a id="bagian-45"></a>

## 45. 🔴 Masalah Variable var (Hoisting & Scope Leak)

#### Konsep

Sebelum standar ES6 (2015), satu-satunya cara membuat variabel di JavaScript adalah dengan kata kunci **`var`**. Namun, `var` memiliki kelemahan desain fundamental yang sangat rawan memicu bug:

1. **Tidak Memiliki Block Scope:** Variabel yang dibuat dengan `var` di dalam blok `if` atau `for` akan bocor ke luar blok (*Function Scoped*, bukan *Block Scoped*).
2. **Hoisting yang Membingungkan:** Variabel `var` dapat diakses sebelum baris deklarasinya tanpa melempar error, namun bernilai `undefined`.
3. **Bisa Dideklarasikan Ulang Secara Diam-diam:** Variabel dengan nama yang sama dapat dideklarasikan ulang dengan `var` tanpa ada pesan peringatan error, berpotensi menimpa data penting.

#### Contoh

```javascript
// 1. Masalah Kebocoran Scope (No Block Scope)
for (var i = 0; i < 3; i++) {
    // looping
}
console.log("Nilai i bocor ke luar loop:", i); // Nilai 3 bocor ke luar! (Berbahaya)

// 2. Masalah Hoisting var
console.log("Nilai testVar sebelum deklarasi:", testVar); // undefined (Tidak error!)
var testVar = "Halo Dunia";

// Bandingkan dengan let / const (Temporal Dead Zone)
// console.log(testLet); // ReferenceError: Cannot access 'testLet' before initialization
let testLet = "Halo Let";

// 3. Masalah Re-declaration (Deklarasi Ulang)
var userToken = "TOKEN_A";
var userToken = "TOKEN_B"; // Tidak ada pesan error sama sekali, data tertimpa diam-diam!
console.log("Token:", userToken);
```

#### Output

```text
Nilai i bocor ke luar loop: 3
Nilai testVar sebelum deklarasi: undefined
Token: TOKEN_B
```

#### Cara Kerja

```text
   var testVar = "Halo" ──► Di-hoist ke atas fungsi sebagai: var testVar; (undefined)
   let testLet = "Halo" ──► Berada di Temporal Dead Zone (TDZ) sampai barisnya dieksekusi
```

**Hafalan:**

```text
var   → Function scoped, di-hoist sebagai undefined, boleh di-redeklarasi (HINDARI!)
let   → Block scoped, TDZ (aman dari hoisting bug), mutable
const → Block scoped, TDZ, immutable reference (PILIHAN UTAMA)
```

#### Best Practice & Kesalahan Umum

- ✅ 100% tinggalkan kata kunci `var` di seluruh project JavaScript modern.
- ❌ Jangan pernah mengasumsikan variabel `var` di dalam blok loop terisolasi secara aman.

---

<a id="bagian-46"></a>

## 46. 🔴 Destructuring (Array & Object)

#### Konsep

**Destructuring Assignment** adalah sintaks ekspresif modern (ES6) yang memungkinkan kita membongkar (*unpack*) nilai dari array atau properti dari objek ke dalam variabel-variabel terpisah secara instan.

Fitur Destructuring:
- **Object Destructuring:** Mengekstrak properti berdasarkan nama kuncinya (`{ name, age } = user`).
- **Array Destructuring:** Mengekstrak elemen berdasarkan urutan posisinya (`[first, second] = list`).
- **Default Value:** Menetapkan nilai cadangan jika properti/elemen bernilai `undefined`.
- **Alias Renaming:** Mengubah nama variabel saat destructuring (`{ oldKey: newName }`).
- **Rest Operator (`...rest`):** Mengumpulkan sisa properti/elemen ke dalam objek/array baru.

#### Contoh

```javascript
// 1. Object Destructuring
const developer = {
    name: "Alex",
    skill: "Fullstack",
    experienceYears: 5,
    country: "Indonesia"
};

// Ekstrak nama, beri alias untuk skill -> mainSkill, default role -> "Senior"
const { name, skill: mainSkill, role = "Senior", ...otherInfo } = developer;

console.log("Nama:", name);
console.log("Skill Utama (Alias):", mainSkill);
console.log("Role (Default Value):", role);
console.log("Info Lainnya (Rest):", otherInfo);

// 2. Array Destructuring
const rgbColors = [255, 128, 0];
const [red, green, blue] = rgbColors;
console.log(`RGB: (${red}, ${green}, ${blue})`);

// Menukar nilai dua variabel tanpa variabel pembantu (Swap)
let a = 1;
let b = 2;
[a, b] = [b, a];
console.log(`Setelah Swap: a=${a}, b=${b}`);
```

#### Output

```text
Nama: Alex
Skill Utama (Alias): Fullstack
Role (Default Value): Senior
Info Lainnya (Rest): { experienceYears: 5, country: 'Indonesia' }
RGB: (255, 128, 0)
Setelah Swap: a=2, b=1
```

#### Cara Kerja

```text
       Objek Sumber: { name: "Alex", skill: "Fullstack" }
                              │
                              ▼
       Pola Destructuring: const { name, skill } = developer
                              │
         ┌────────────────────┴────────────────────┐
         ▼                                         ▼
   let name = "Alex"                       let skill = "Fullstack"
```

**Hafalan:**

```text
const { prop1, prop2 } = object    → Mengekstrak properti objek ke variabel terpisah
const { prop: aliasName } = object → Mengekstrak properti sekaligus mengganti nama variabel
const [item1, item2] = array       → Mengekstrak elemen array berdasarkan urutan indeks
const [item1, ...rest] = array     → Mengekstrak elemen pertama dan mengumpulkan sisa elemen
```

#### Best Practice & Kesalahan Umum

- ✅ Terapkan destructuring langsung pada parameter fungsi (misal: `function render({ title, price })`) untuk memperjelas kebutuhan data input fungsi.
- ❌ Pastikan objek/array sumber tidak bernilai `null` atau `undefined` sebelum di-destructure agar tidak menghasilkan `TypeError`.

---

<a id="bagian-47"></a>

## 47. 🔴 Strict Mode ("use strict") & Debugger

#### Konsep

1. **Strict Mode (`"use strict";`):**
   Fitur yang diperkenalkan pada ECMAScript 5 untuk mengaktifkan mode ketat pada engine JavaScript.
   Manfaat Strict Mode:
   - Mencegah pembuatan variabel global secara tidak sengaja (misal typo lupa `const`/`let`).
   - Melempar error saat mencoba mengubah properti yang bersifat *read-only*.
   - Melarang sintaks lama yang berbahaya seperti `with` statement dan parameter duplikat.
   - *Catatan:* JavaScript ES Modules (`import`/`export`) dan Class otomatis berjalan di dalam Strict Mode secara default.

2. **Debugger (`debugger;`):**
   Kata kunci instruksi yang memerintahkan browser/runtime untuk **menghentikan eksekusi kode (*breakpoint*)** jika jendela Developer Tools sedang terbuka, memungkinkan kita memeriksa memori, call stack, dan nilai variabel langkah demi langkah (*step-by-step*).

#### Contoh

```javascript
// Mengaktifkan mode ketat di seluruh file / fungsi
"use strict";

// 1. Pencegahan Variabel Liar (Global Leak Prevention)
try {
    // Tanpa "use strict", baris ini akan membuat variabel global otomatis!
    // Di Strict Mode, ini menghasilkan ReferenceError
    // typoVariable = "Nilai Liar"; 
} catch (error) {
    console.error("Tertangkap Strict Mode Error:", error.message);
}

// 2. Menggunakan Statement Debugger
function calculateTaxBreakdown(amount) {
    const rate = 0.11;
    
    // Jika DevTools terbuka, eksekusi akan pause di baris ini
    // debugger; 
    
    const taxAmount = amount * rate;
    const finalTotal = amount + taxAmount;
    
    return finalTotal;
}

console.log("Total Kalkulasi:", calculateTaxBreakdown(100000));
```

#### Output

```text
Total Kalkulasi: 111000
```

#### Cara Kerja

```text
              Engine mengeksekusi "use strict"
                             │
                             ▼
             Mengaktifkan Validasi Sintaks Ketat
                             │
         ┌───────────────────┴───────────────────┐
         ▼                                       ▼
   Kode Bersih & Standar                   Deteksi Sintaks Berbahaya / Typo
         │                                       │
         ▼                                       ▼
   Eksekusi Berlanjut                      Lempar Error Seketika
```

**Hafalan:**

```text
"use strict"; → Mengaktifkan mode ketat untuk mencegah bug tersembunyi
debugger;     → Memasang titik henti (breakpoint) otomatis saat DevTools terbuka
```

#### Best Practice & Kesalahan Umum

- ✅ Tuliskan `"use strict";` di baris paling pertama file script jadul jika belum menggunakan modul ES6 modern.
- ❌ Pastikan menghapus seluruh keyword `debugger;` sebelum merilis kode ke server produksi (*production*).

---

<a id="bagian-48"></a>

## 48. 🛠️ Peta Ingatan Cepat

#### Mental Model Hubungan Konsep JavaScript Dasar

```text
                      ┌───────────────────────────────┐
                      │    JavaScript Core Runtime    │
                      └───────────────┬───────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        ▼                             ▼                             ▼
  Tipe Data & Nilai             Struktur Data               Struktur Kontrol
  - Number & BigInt             - Array [0, 1, 2]           - if / else if / else
  - String & Template           - Object { key: val }       - switch (=== matching)
  - Boolean (true/false)        - Destructuring             - Ternary (?:)
  - null & undefined            - Rest & Spread (...)       - Loops (for, while, for..of)
        │                             │                             │
        └─────────────────────────────┼─────────────────────────────┘
                                      │
                                      ▼
                           Functions & Execution
                        - Declaration vs Expression
                        - Arrow Function (() =>)
                        - Parameters & Rest (...args)
                        - Scope, Hoisting & Closure
                        - Object Methods & this
```

#### Pola Keputusan Sintaks JavaScript Modern

```text
                              Kebutuhan Data / Variabel
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
             Nilai Tetap?                               Nilai Berubah?
                   │                                           │
                   ▼                                           ▼
             Gunakan const                                Gunakan let
                   │
                   ▼
                              Kebutuhan Nilai Cadangan
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
            Hanya null/undefined?                        Semua nilai falsy?
                   │                                           │
                   ▼                                           ▼
             Gunakan ??                                   Gunakan ||
                   │
                   ▼
                             Akses Properti Bersarang
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
            Properti Pasti Ada?                         Bisa Jadi Null/Undefined?
                   │                                           │
                   ▼                                           ▼
              object.prop                                object?.nested?.prop
```

---

<a id="bagian-49"></a>

## 49. 📚 Tabel Ringkasan

| Kategori | Sintaks / Fitur | Contoh Penggunaan | Penjelasan & Kegunaan |
|---|---|---|---|
| **Variabel** | `const` | `const MAX = 100;` | Variabel nilai tetap (block-scoped) |
| **Variabel** | `let` | `let score = 0;` | Variabel yang nilainya dapat diubah (block-scoped) |
| **Tipe Data** | Template Literal | `` `Total: ${price}` `` | Interpolasi string dinamis & multi-baris |
| **Tipe Data** | Number Conversion | `Number("123")` | Mengonversi string teks menjadi tipe angka |
| **Koleksi** | Array Method | `items.push("A");` | Menambah elemen di posisi akhir array |
| **Koleksi** | Object Property | `user.name` / `user["age"]` | Membaca properti objek |
| **Perbandingan** | Strict Equality | `a === b` / `a !== b` | Perbandingan identik (tipe & nilai harus sama) |
| **Kondisional** | Ternary Operator | `age >= 17 ? "Dewasa" : "Anak"` | Percabangan satu baris singkat |
| **Safety** | Nullish Coalescing | `val ?? "Default"` | Fallback khusus saat nilai null atau undefined |
| **Safety** | Optional Chaining | `user?.address?.city` | Membaca properti bersarang tanpa error fatal |
| **Perulangan** | For Loop | `for (let i=0; i<5; i++)` | Perulangan standar dengan indeks terkontrol |
| **Perulangan** | For...Of | `for (const item of list)` | Iterasi langsung nilai elemen array/iterable |
| **Perulangan** | For...In | `for (const key in obj)` | Iterasi nama key/properti pada objek |
| **Function** | Declaration | `function sum(a, b) { ... }` | Fungsi bernama standar (di-hoist otomatis) |
| **Function** | Arrow Function | `const add = (a, b) => a + b;` | Fungsi panah ringkas dengan lexical this |
| **Function** | Rest Parameter | `function log(...args)` | Menampung seluruh sisa argumen menjadi array |
| **Modern ES** | Destructuring | `const { name, role } = user;` | Ekstrak properti objek ke variabel terpisah |
| **Modern ES** | Strict Mode | `"use strict";` | Mengaktifkan validasi ketat mesin JavaScript |

---

<a id="bagian-50"></a>

## 50. ⚡ Cheat Code JavaScript Dasar 10 Detik

### 1. Deklarasi & Format String
```javascript
const siteName = "BelajarJS";
let visitCount = 10;
const greeting = `Halo Pengunjung ${visitCount} di ${siteName}!`;
```

### 2. Array & Object Ringkas
```javascript
const fruits = ["Apel", "Jeruk", "Mangga"];
fruits.push("Pisang"); // Tambah akhir
const [firstFruit, ...otherFruits] = fruits;

const product = { id: 101, name: "Mouse Gaming", price: 150000 };
const { name: productName, price } = product;
```

### 3. Kondisional Cepat & Fallback Aman
```javascript
const isEligible = score >= 75 ? "Lolos" : "Gagal";
const userCity = profile?.address?.city ?? "Kota Default";
```

### 4. Arrow Functions & Iterasi
```javascript
const multiply = (x, y) => x * y;
const numbers = [1, 2, 3, 4];
const squared = numbers.map(n => n * n);

for (const num of numbers) {
    console.log("Angka:", num);
}
```

---

<a id="bagian-51"></a>

## 51. 🧭 Urutan Belajar yang Disarankan

Untuk menguasai JavaScript dari nol hingga siap memasuki dunia frontend (DOM, React, Vue) atau backend (Node.js, Express), ikuti urutan pembelajaran bertahap berikut:

```text
                        FASE 1: Fondasi Bahasa (Minggu 1)
       ┌─────────────────────────────────────────────────────────────┐
       │ 1. Engine mental model & console debugging                  │
       │ 2. Variabel modern (const vs let) & Tipe Data Dasar         │
       │ 3. Operator matematika, string template, & konversi tipe    │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
                        FASE 2: Logika & Koleksi Data (Minggu 2)
       ┌─────────────────────────────────────────────────────────────┐
       │ 4. Perbandingan ketat (===) & Operator logika (&&, ||, !)    │
       │ 5. Control Flow: if-else, switch, ternary                   │
       │ 6. Array, Object, dan metode manipulasi dasarnya            │
       │ 7. Perulangan: for, while, do..while, for..of               │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
                        FASE 3: Functions & Modern ES6+ (Minggu 3)
       ┌─────────────────────────────────────────────────────────────┐
       │ 8. Function declaration, return, default/rest parameter     │
       │ 9. Arrow functions & array iteration methods (.map/.filter) │
       │ 10. Destructuring, Nullish Coalescing (??), Optional (?.)   │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
                        FASE 4: Konsep Mendalam & Latihan (Minggu 4)
       ┌─────────────────────────────────────────────────────────────┐
       │ 11. Lexical Scope, Hoisting, dan Closure                    │
       │ 12. Object Method, this context, Getters & Setters          │
       │ 13. Mengerjakan Mini Project Terintegrasi                   │
       └─────────────────────────────────────────────────────────────┘
```

---

<a id="bagian-52"></a>

## 52. 🏗️ Mini Project: Sistem Manajemen Kasir & Belanja Interaktif

#### Konsep Project

Project ini menggabungkan seluruh konsep inti JavaScript dasar yang telah dipelajari:
- Variabel (`const`, `let`) dan Tipe Data
- Array of Objects dan Rest/Spread Parameter
- Function, Default Parameter, dan Arrow Function
- Control Flow (`if-else`, `switch`, `ternary`)
- Nullish Coalescing (`??`) dan Optional Chaining (`?.`)
- Closure untuk Enkapsulasi Keranjang Belanja
- Destructuring dan String Template
- Format Output Bersih dan Informatif

#### Kode Lengkap

```javascript
/**
 * Mini Project: Sistem Kasir & Inventaris Toko Elektronik Modern
 */

// 1. Data Inventaris Produk
const productCatalog = [
    { id: "P01", name: "Keyboard Mechanical", price: 500000, category: "Aksesoris", stock: 10 },
    { id: "P02", name: "Mouse Wireless", price: 150000, category: "Aksesoris", stock: 25 },
    { id: "P03", name: "Monitor 24 Inch IPS", price: 1800000, category: "Display", stock: 5 },
    { id: "P04", name: "Headset Gaming 7.1", price: 350000, category: "Audio", stock: 8 }
];

// 2. Closure Factory: Modul Keranjang Belanja Mandiri
function createShoppingCart(customerName, memberTier = "Reguler") {
    const items = []; // Privat di dalam closure

    return {
        getCustomerInfo: () => ({ customerName, memberTier }),
        
        addItem(productId, quantity = 1) {
            const product = productCatalog.find(p => p.id === productId);
            if (!product) {
                return `❌ Produk dengan ID "${productId}" tidak ditemukan.`;
            }
            if (product.stock < quantity) {
                return `❌ Stok ${product.name} tidak cukup (Tersisa ${product.stock}).`;
            }

            items.push({
                productId: product.id,
                name: product.name,
                unitPrice: product.price,
                quantity: quantity,
                subtotal: product.price * quantity
            });

            return `✅ Ditambahkan: ${product.name} (${quantity}x)`;
        },

        calculateDiscount(totalAmount) {
            switch (memberTier.toUpperCase()) {
                case "PLATINUM":
                    return totalAmount * 0.15; // Diskon 15%
                case "GOLD":
                    return totalAmount * 0.10; // Diskon 10%
                case "SILVER":
                    return totalAmount * 0.05; // Diskon 5%
                default:
                    return totalAmount >= 1000000 ? totalAmount * 0.02 : 0;
            }
        },

        generateReceipt() {
            if (items.length === 0) {
                return "Keranjang belanja masih kosong.";
            }

            let grossTotal = 0;
            let receiptLines = `\n=======================================================\n`;
            receiptLines += `              STRUK PEMBELIAN TOKO KOMPUTER            \n`;
            receiptLines += `=======================================================\n`;
            receiptLines += `Pelanggan : ${customerName} (${memberTier})\n`;
            receiptLines += `Tanggal   : ${new Date().toISOString().split("T")[0]}\n`;
            receiptLines += `-------------------------------------------------------\n`;
            receiptLines += `No  Item                    Qty    Harga      Subtotal \n`;
            receiptLines += `-------------------------------------------------------\n`;

            // Iterasi array menggunakan for...of dengan destructuring
            for (let i = 0; i < items.length; i++) {
                const { name, quantity, unitPrice, subtotal } = items[i];
                grossTotal += subtotal;
                
                const paddedName = name.padEnd(23, " ");
                const paddedQty = String(quantity).padStart(3, " ");
                const paddedPrice = String(unitPrice).padStart(8, " ");
                const paddedSub = String(subtotal).padStart(10, " ");
                
                receiptLines += `${i + 1}.  ${paddedName} ${paddedQty}  ${paddedPrice}  ${paddedSub}\n`;
            }

            const discountAmount = this.calculateDiscount(grossTotal);
            const netPayable = grossTotal - discountAmount;

            receiptLines += `-------------------------------------------------------\n`;
            receiptLines += `Total Kotor   : Rp${grossTotal.toLocaleString("id-ID")}\n`;
            receiptLines += `Diskon Member : Rp${discountAmount.toLocaleString("id-ID")}\n`;
            receiptLines += `Total Bayar   : Rp${netPayable.toLocaleString("id-ID")}\n`;
            receiptLines += `=======================================================\n`;
            receiptLines += `         Terima kasih telah berbelanja bersama kami!   \n`;
            receiptLines += `=======================================================\n`;

            return receiptLines;
        }
    };
}

// 3. Simulasi Transaksi Pelanggan
const myCart = createShoppingCart("Budi Santoso", "Gold");

console.log(myCart.addItem("P01", 2)); // 2x Keyboard Mechanical
console.log(myCart.addItem("P03", 1)); // 1x Monitor 24 Inch
console.log(myCart.addItem("P04", 1)); // 1x Headset Gaming

// 4. Cetak Struk Hasil Belanja
console.log(myCart.generateReceipt());
```

#### Output

```text
✅ Ditambahkan: Keyboard Mechanical (2x)
✅ Ditambahkan: Monitor 24 Inch IPS (1x)
✅ Ditambahkan: Headset Gaming 7.1 (1x)

=======================================================
              STRUK PEMBELIAN TOKO KOMPUTER            
=======================================================
Pelanggan : Budi Santoso (Gold)
Tanggal   : 2026-08-29
-------------------------------------------------------
No  Item                    Qty    Harga      Subtotal 
-------------------------------------------------------
1.  Keyboard Mechanical       2    500000     1000000
2.  Monitor 24 Inch IPS       1   1800000     1800000
3.  Headset Gaming 7.1        1    350000      350000
-------------------------------------------------------
Total Kotor   : Rp3.150.000
Diskon Member : Rp315.000
Total Bayar   : Rp2.835.000
=======================================================
         Terima kasih telah berbelanja bersama kami!   
=======================================================
```

#### Cara Kerja

```text
       createShoppingCart("Budi Santoso", "Gold")
                         │
                         ▼
        Enkapsulasi State: Array items[] dalam Closure
                         │
                         ▼
        addItem(id, qty) memvalidasi katalog produk
                         │
                         ▼
        calculateDiscount() menghitung diskon berdasar tier
                         │
                         ▼
        generateReceipt() memformat struk via Template Literals
```

**Hafalan:**

```text
Shopping Cart Pattern → Pola perancangan modular menggunakan Closure untuk melindungi data transaksi
```

---

<a id="bagian-53"></a>

## 53. 🔗 Referensi Resmi

Untuk memperdalam dan memvalidasi sintaks JavaScript modern secara resmi, gunakan dokumentasi acuan terpercaya berikut:

- [MDN Web Docs — JavaScript Guide (Mozilla)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [MDN Web Docs — JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
- [ECMA-262 ECMAScript Language Specification (Official Standard)](https://tc39.es/ecma262/)
- [Node.js Official Documentation](https://nodejs.org/docs/latest/api/)
- [JavaScript.info — The Modern JavaScript Tutorial](https://javascript.info/)

> **Catatan Versi:** Cheatsheet ini disusun menggunakan standar **ECMAScript 2020+ (ES11+)**. Seluruh sintaks dan method yang dijelaskan didukung penuh oleh browser modern (Chrome, Edge, Firefox, Safari) dan runtime Node.js LTS terkini.
