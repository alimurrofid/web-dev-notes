---
title: "C# Dasar"
description: "Fundamental pemrograman modern C# 14 & .NET 10 LTS: CLR, Roslyn, Top-Level Statements, tipe data, nullable reference types, control flow, methods, dan pattern matching."
order: 1
tags:
  - programming
  - csharp
  - dotnet
  - backend
  - fundamental
---

# C# Dasar

> **Target:** Pemula yang baru mulai belajar pemrograman modern dengan **C# 14 & .NET 10 (LTS)**.  
> **Versi:** C# 14 / .NET 10 (LTS)  
> Fokus modul pembelajaran ini: **mental model CLR & Roslyn → Top-Level Statements → tipe data primitif & memori stack/heap → nullable reference types & null-safety → casting → operator → input/output konsol & string literals → array & collection expressions → control flow & pattern matching switch → methods & parameter modifiers (in/out/ref) → exception handling dasar → mini project konsol kasir**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami untuk mulai menulis kode C# yang valid, type-safe, dan dapat dikompilasi oleh .NET SDK

🟡 Lanjutan
→ pelajari setelah memahami tipe data, array, branching, loop, dan modularitas method

🔴 Advanced / Operasional
→ penting untuk pemahaman sistem memori, parameter modifiers, exception filters, dan modern features C# 14
```

Mental model alur kompilasi dan eksekusi C# dari Source Code ke Mesin:

```text
         Source Code C# (.cs)
                  │
                  ▼
         Roslyn Compiler (csc)
                  │
                  ▼
     Common Intermediate Language (CIL)
             (.dll / .exe)
                  │
                  ▼
    ┌───────────────────────────┐
    │  Common Language Runtime  │
    │         (.NET CLR)        │
    ├─────────────┬─────────────┤
    │ Type Loader │ Memory Mgr  │
    │  RyuJIT     │ Garbage Col │
    │  Compiler   │ (Gen 0/1/2) │
    └─────────────┴─────────────┘
                  │
                  ▼
     Instruksi Mesin Native OS
     (Windows / Linux / macOS)
```

**Hafalan:**

```text
.NET SDK     → paket lengkap developer untuk membangun, menguji, dan menjalankan aplikasi (.NET CLI + Roslyn + Runtime)
CLR          → Common Language Runtime: mesin virtual penerjemah bytecode CIL menjadi instruksi native mesin
CIL / IL     → Common Intermediate Language: bytecode biner portabel hasil kompilasi Roslyn
RyuJIT       → Just-In-Time compiler bawaan CLR yang mengompilasi IL menjadi native machine code saat runtime
Cross-Plat   → berjalan mulus di Windows, Linux, dan macOS tanpa perubahan kode sumber
Type-Safe    → pemeriksaan tipe data secara ketat saat waktu kompilasi untuk mencegah kegagalan runtime
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan C# 14, .NET 10 & Mental Model CLR](#1--pengenalan-c-14-net-10--mental-model-clr)
2. [Program Pertama & Anatomi Top-Level Statements Modern](#2--program-pertama--anatomi-top-level-statements-modern)
3. [Komentar & Dokumentasi XML (///)](#3--komentar--dokumentasi-xml-)
4. [Tipe Data Primitif Number (Integer & Floating Point)](#4--tipe-data-primitif-number-integer--floating-point)
5. [Tipe Data Character & Boolean](#5--tipe-data-character--boolean)
6. [Tipe Data String & Raw String Literals](#6--tipe-data-string--raw-string-literals)
7. [Variable, Type Inference (var) & Constant (const)](#7--variable-type-inference-var--constant-const)
8. [Value Types vs Reference Types (Stack vs Heap)](#8--value-types-vs-reference-types-stack-vs-heap)
9. [Nullable Types & Fitur Null-Safety C# 14](#9--nullable-types--fitur-null-safety-c-14)
10. [Konversi Tipe Data (Implicit, Explicit Casting & Convert)](#10--konversi-tipe-data-implicit-explicit-casting--convert)
11. [Operator Aritmatika, Penugasan & Presedensi](#11--operator-aritmatika-penugasan--presedensi)
12. [Operator Perbandingan & Logika (Short-Circuit)](#12--operator-perbandingan--logika-short-circuit)
13. [Input & Output Konsol (Console.ReadLine & Format Interpolasi)](#13--input--output-konsol-consolereadline--format-interpolasi)
14. [Tipe Data Array 1 Dimensi & Collection Expressions](#14--tipe-data-array-1-dimensi--collection-expressions)
15. [Tipe Data Array Multidimensi & Jagged Array](#15--tipe-data-array-multidimensi--jagged-array)
16. [Percabangan If, Else If, dan Else](#16--percabangan-if-else-if-dan-else)

### 🟡 Lanjutan

17. [Switch Statement & Modern Switch Expression](#17--switch-statement--modern-switch-expression)
18. [Ternary Operator (?:) & Null-Coalescing Operator](#18--ternary-operator---null-coalescing-operator)
19. [Perulangan For Loop Standar](#19--perulangan-for-loop-standar)
20. [Perulangan Foreach Loop](#20--perulangan-foreach-loop)
21. [Perulangan While dan Do-While](#21--perulangan-while-dan-do-while)
22. [Break, Continue, dan Return](#22--break-continue-dan-return)
23. [Method Dasar (Void & Return Value)](#23--method-dasar-void--return-value)
24. [Method Parameter Passing (Value, in, out, ref)](#24--method-parameter-passing-value-in-out-ref)
25. [Method Overloading & Optional Parameters](#25--method-overloading--optional-parameters)
26. [Local Functions & Variable Scope](#26--local-functions--variable-scope)

### 🔴 Advanced / Operasional

27. [String Utility Methods & Manipulasi Teks](#27--string-utility-methods--manipulasi-teks)
28. [Math Utility Class (System.Math)](#28--math-utility-class-systemmath)
29. [Penanganan Exception Dasar & Exception Filters (when)](#29--penanganan-exception-dasar--exception-filters-when)

### 🛠️ Referensi & Praktik

30. [Peta Ingatan Cepat](#30-️-peta-ingatan-cepat)
31. [Tabel Ringkasan](#31--tabel-ringkasan)
32. [Cheat Code C# Dasar 10 Detik](#32--cheat-code-c-dasar-10-detik)
33. [Urutan Belajar yang Disarankan](#33--urutan-belajar-yang-disarankan)
34. [Mini Project: Sistem Kasir & Inventaris Toko CLI](#34-️-mini-project-sistem-kasir--inventaris-toko-cli)
35. [Referensi Resmi](#35--referensi-resmi)

---

## 1. 🟢 Pengenalan C# 14, .NET 10 & Mental Model CLR

#### Konsep

**C# (dibaca *C-Sharp*)** adalah bahasa pemrograman modern, aman (*type-safe*), dan berorientasi objek yang dikembangkan oleh Microsoft. C# berjalan di atas runtime **.NET 10 (LTS)** yang bersifat open-source dan cross-platform (dapat berjalan di Linux, macOS, dan Windows).

Ekosistem .NET terdiri dari:
1. **.NET CLI (`dotnet`):** Command-line tool untuk membuat project (`dotnet new`), mengompilasi (`dotnet build`), dan menjalankan aplikasi (`dotnet run`).
2. **Roslyn Compiler:** Kompiler C# mutakhir yang menerjemahkan kode sumber `.cs` menjadi **Common Intermediate Language (CIL)**.
3. **Common Language Runtime (CLR):** Mesin virtual yang mengelola eksekusi aplikasi, menyediakan Garbage Collection (pengelola memori otomatis), dan mengompilasi CIL menjadi kode mesin menggunakan **RyuJIT** (*Just-In-Time Compiler*).

#### Contoh

Memeriksa versi SDK dan membuat project console baru via terminal:

```bash
# Periksa instalasi .NET SDK
dotnet --version

# Buat project console baru
dotnet new console -n BelajarCSharp

# Masuk ke folder dan jalankan
cd BelajarCSharp
dotnet run
```

Output:

```text
Hello, World!
```

#### Cara Kerja

```text
dotnet run ──> Roslyn kompilasi C# ──> Menghasilkan CIL (.dll) ──> CLR RyuJIT ──> CPU Eksekusi
```

**Hafalan:**

```text
dotnet new console → membuat template proyek aplikasi konsol baru
dotnet build       → mengompilasi source code menjadi binary IL tanpa menjalankannya
dotnet run         → mengompilasi sekaligus mengeksekusi aplikasi secara langsung
```

---

## 2. 🟢 Program Pertama & Anatomi Top-Level Statements Modern

#### Konsep

Pada versi C# klasik terdahulu, setiap program wajib dibungkus di dalam `namespace`, `class Program`, dan method `static void Main(string[] args)`.

Sejak C# 9 hingga **C# 14 (.NET 10)**, C# mengadopsi standar **Top-Level Statements**:
- Anda dapat langsung menulis instruksi logika program di baris pertama file `Program.cs`.
- Kompiler Roslyn secara otomatis membungkus kode tersebut ke dalam method `Main` di balik layar saat kompilasi.

#### Contoh

Kode modern C# 14 (`Program.cs`):

```csharp
// Top-Level Statements: Ringkas, bersih, dan langsung dapat dieksekusi
Console.WriteLine("Selamat datang di C# 14 & .NET 10 LTS!");

string bahasa = "C#";
int versi = 14;

Console.WriteLine($"Sedang mempelajari {bahasa} versi {versi}.");
```

#### Output

```text
Selamat datang di C# 14 & .NET 10 LTS!
Sedang mempelajari C# versi 14.
```

#### Cara Kerja

```text
Top-Level Code (.cs) ──> Diterjemahkan Roslyn menjadi ──> internal class Program { static void Main() { ... } }
```

**Hafalan:**

```text
Console.WriteLine(text) → mencetak teks ke layar konsol diakhiri dengan baris baru (newline)
Console.Write(text)     → mencetak teks ke layar konsol tanpa berpindah baris
```

---

## 3. 🟢 Komentar & Dokumentasi XML (`///`)

#### Konsep

C# mendukung 3 variasi komentar:
1. **Single-line comment:** Dimulai dengan `//` untuk catatan satu baris.
2. **Multi-line comment:** Diapit oleh `/* ... */` untuk blok catatan panjang.
3. **XML Documentation Comment:** Dimulai dengan `///` tepat di atas deklarasi method/class. Komentar ini dibaca oleh IDE (Visual Studio, VS Code, JetBrains Rider) untuk menampilkan petunjuk IntelliSense saat method dipanggil.

#### Contoh

```csharp
// 1. Komentar satu baris untuk instruksi sederhana
int totalStok = 50;

/*
 * 2. Komentar multi-baris
 * Menjelaskan modul penghitungan pajak barang
 */
double tarifPajak = 0.11;

/// <summary>
/// Menghitung total harga belanja setelah dikenakan pajak PPN.
/// </summary>
/// <param name="hargaAwal">Harga dasar barang dalam rupiah.</param>
/// <returns>Nominal total yang harus dibayar.</returns>
double HitungTotal(double hargaAwal)
{
    return hargaAwal + (hargaAwal * tarifPajak);
}

Console.WriteLine($"Total: Rp {HitungTotal(100_000)}");
```

#### Output

```text
Total: Rp 111000
```

**Hafalan:**

```text
//                  → komentar satu baris
/* ... */           → komentar multi-baris
/// <summary> ...   → komentar dokumentasi XML resmi untuk IntelliSense IDE
```

---

## 4. 🟢 Tipe Data Primitif Number (Integer & Floating Point)

#### Konsep

C# adalah bahasa *strongly-typed* yang menyediakan tipe data bilangan bulat (*integer*) dan bilangan pecahan (*floating point*):

| Tipe Data | Ukuran | Rentang Nilai | Penggunaan Umum |
|---|:---:|---|---|
| `byte` | 8-bit | 0 s/d 255 | Data binary, file buffer |
| `short` | 16-bit | -32.768 s/d 32.767 | Angka kecil |
| `int` | 32-bit | ±2,14 Miliar | **Standar utama bilangan bulat** |
| `long` | 64-bit | ±9 Quintillion (akhiri `L`) | ID database besar, timestamp milidetik |
| `float` | 32-bit | ~6-9 digit presisi (akhiri `f`) | Grafik, game engine, AI tensor |
| `double` | 64-bit | ~15-17 digit presisi | **Standar utama perhitungan ilmiah/fisika** |
| `decimal` | 128-bit | ~28-29 digit presisi (akhiri `m`) | **Wajib untuk keuangan/moneter/rupiah** |

> [!IMPORTANT]
> **Aturan Finansial:** Untuk perhitungan uang, diskon, dan saldo perbankan, **SELALU gunakan `decimal`**. Tipe `double` dan `float` menggunakan aproksimasi biner IEEE 754 yang rentan menghasilkan kesalahan pembulatan desimal (misal `0.1 + 0.2 = 0.30000000000000004`).

#### Contoh

```csharp
// Digit separator (_) diizinkan untuk mempermudah pembacaan nominal besar
int populasiKota = 1_500_000;
long idTransaksi = 9_876_543_210_123L;

double koordinatLatitude = -6.2087634;
decimal saldoTabungan = 25_500_000.75m; // Akhiri dengan huruf 'm' untuk decimal

Console.WriteLine($"Populasi : {populasiKota:N0}");
Console.WriteLine($"Saldo    : Rp {saldoTabungan:N2}");
```

#### Output

```text
Populasi : 1,500,000
Saldo    : Rp 25,500,000.75
```

**Hafalan:**

```text
int     → 32-bit bilangan bulat standar
long    → 64-bit integer besar (akhiran L)
double  → floating point 64-bit standar komputasi cepat
decimal → 128-bit angka presisi tinggi khusus keuangan (akhiran m)
```

---

## 5. 🟢 Tipe Data Character & Boolean

#### Konsep

1. **`char` (16-bit Unicode):** Menyimpan tepat satu karakter teks yang diapit oleh **tanda petik tunggal (`'`)**. Mendukung karakter ASCII dan escape sequences.
2. **`bool` (Boolean):** Menyimpan status kebenaran logika yang hanya memiliki dua kemungkinan nilai literal: **`true`** atau **`false`**.

Escape Sequences Populer pada Char/String:
- `\n` : Pindah baris baru (*New Line*).
- `\t` : Tabulasi spasi horizontal.
- `\\` : Karakter garis miring terbalik (*Backslash*).
- `\'` : Karakter petik tunggal.
- `\"` : Karakter petik ganda.

#### Contoh

```csharp
char gradeNilai = 'A';
char simbolMataUang = '$';

bool isAkunAktif = true;
bool isVoucherExpired = false;

Console.WriteLine($"Grade: {gradeNilai}");
Console.WriteLine($"Status Akun Aktif: {isAkunAktif}");
Console.WriteLine($"Apakah Boleh Transaksi? {isAkunAktif && !isVoucherExpired}");
```

#### Output

```text
Grade: A
Status Akun Aktif: True
Apakah Boleh Transaksi? True
```

**Hafalan:**

```text
char → karakter tunggal bertanda petik tunggal ('A', '9', '\n')
bool → status logika true atau false
```

---

## 6. 🟢 Tipe Data String & Raw String Literals

#### Konsep

`string` di C# adalah tipe data referensi yang membungkus deretan karakter teks dan bersifat **Immutable** (konten memori string tidak dapat diubah setelah dibuat). Setiap operasi modifikasi menghasilkan string baru di heap.

Fitur String Modern di C#:
1. **String Interpolation (`$""`):** Menyisipkan ekspresi variabel langsung ke dalam teks menggunakan kurung kurawal `{variabel}`.
2. **Verbatim String (`@""`):** Mengabaikan karakter escape backslash, sangat berguna untuk path folder atau Regex (`@"C:\Windows\System32"`).
3. **Raw String Literals:** Menulis teks multi-baris persis apa adanya dengan pembatas minimal 3 tanda kutip ganda tanpa perlu escape karakter kutip ganda atau newline (sangat ideal untuk payload JSON, XML, atau kueri SQL).

#### Contoh

```csharp
string namaProduk = "Monitor UltraWide 34 Inch";
decimal harga = 6_500_000m;

// 1. String Interpolation
string info = $"Produk: {namaProduk} | Harga: Rp {harga:N0}";
Console.WriteLine(info);

// 2. Verbatim String (Path Windows)
string filePath = @"C:\Users\Developer\Documents\config.json";
Console.WriteLine(filePath);

// 3. Raw String Literals (C# 11 - 14) untuk payload JSON murni
string jsonPayload = """
{
    "sku": "MON-34",
    "nama": "Monitor UltraWide",
    "aktif": true
}
""";

Console.WriteLine("\nPayload JSON:\n" + jsonPayload);
```

#### Output

```text
Produk: Monitor UltraWide 34 Inch | Harga: Rp 6,500,000
C:\Users\Developer\Documents\config.json

Payload JSON:
{
    "sku": "MON-34",
    "nama": "Monitor UltraWide",
    "aktif": true
}
```

**Hafalan:**

```text
$"{var}"      → string interpolation untuk menyisipkan variabel ke dalam teks
@"text"       → verbatim string yang mengabaikan karakter escape
"""text"""    → raw string literals untuk teks multi-baris dan JSON bebas escape
```

---

## 7. 🟢 Variable, Type Inference (`var`) & Constant (`const`)

#### Konsep

Variabel adalah lokasi penyimpanan data di memori komputer yang diberi nama.

Tiga cara deklarasi variabel di C#:
1. **Eksplisit:** Menyebutkan tipe data secara langsung (`int umur = 25;`).
2. **Type Inference (`var`):** Kompiler Roslyn secara otomatis menyimpulkan tipe data berdasarkan nilai inisialisasinya saat kompilasi. C# tetap berstatus **statically typed** (tipe data tidak bisa berubah setelah di-infer).
3. **Konstanta (`const`):** Variabel yang nilainya tidak dapat diubah sepanjang waktu program berjalan (*immutable compile-time constant*).

#### Contoh

```csharp
// Deklarasi Eksplisit
string universitas = "Institut Teknologi";

// Type Inference dengan var (Kompiler menetapkan bertipe int dan double)
var semester = 4;             // Otomatis disimpulkan sebagai 'int'
var indeksPrestasi = 3.85;    // Otomatis disimpulkan sebagai 'double'

// Konstanta (Wajib diberi nilai langsung dan tidak bisa di-reassign)
const double PI = 3.14159265359;
const string APP_NAME = "SimAkademik";

// semester = "Empat"; // ❌ COMPILE ERROR: Cannot implicitly convert type 'string' to 'int'

Console.WriteLine($"Aplikasi : {APP_NAME}");
Console.WriteLine($"Semester : {semester} | IPK: {indeksPrestasi}");
```

#### Output

```text
Aplikasi : SimAkademik
Semester : 4 | IPK: 3.85
```

**Hafalan:**

```text
var   → deklarasi variabel lokal dengan penentuan tipe otomatis oleh kompiler
const → nilai konstanta kompilasi yang tidak dapat diubah lagi
```

---

## 8. 🟢 Value Types vs Reference Types (Stack vs Heap)

#### Konsep

Manajemen memori C# terbagi menjadi dua kategori fundamental:

1. **Value Types:**
   - Menyimpan nilai datanya secara langsung pada alokasi memori **Stack**.
   - Dialokasikan dan dibersihkan seketika saat scope method selesai dieksekusi.
   - Bersifat *copy by value* (saat dioper ke variabel lain, seluruh nilai disalin secara mandiri).
   - Meliputi: semua tipe number primitif (`int`, `long`, `double`, `decimal`), `bool`, `char`, `struct`, dan `enum`.

2. **Reference Types:**
   - Menyimpan alamat pointer memori di **Stack**, sedangkan objek data aslinya dialokasikan di **Heap**.
   - Dikelola dan dibersihkan oleh Garbage Collector (.NET GC).
   - Bersifat *copy by reference* (dua variabel dapat menunjuk ke satu objek data yang sama di heap).
   - Meliputi: `string`, `class`, `record class`, `interface`, array, dan delegate.

#### Cara Kerja

```text
         STACK MEMORY                           HEAP MEMORY
┌────────────────────────────┐         ┌─────────────────────────────┐
│ int x = 10 (Value langsung)│         │                             │
│ int y = 10 (Salinan x)     │         │                             │
├────────────────────────────┤         │                             │
│ string p1 ─────────────────┼────────>│ "Laptop Asus" (Objek Nyata) │
│ string p2 ─────────────────┼────────>│                             │
└────────────────────────────┘         └─────────────────────────────┘
```

#### Contoh

```csharp
// 1. Uji Value Type (Mandiri)
int a = 100;
int b = a; // Nilai 'a' disalin ke 'b'
b = 200;

Console.WriteLine($"Value Type -> a: {a}, b: {b}"); // 'a' tetap 100!

// 2. Uji Reference Type (Array di Heap)
int[] arrayA = [1, 2, 3];
int[] arrayB = arrayA; // arrayB menunjuk ke alamat Heap yang sama dengan arrayA
arrayB[0] = 999;

Console.WriteLine($"Reference Type -> arrayA[0]: {arrayA[0]}"); // arrayA ikut berubah menjadi 999!
```

#### Output

```text
Value Type -> a: 100, b: 200
Reference Type -> arrayA[0]: 999
```

**Hafalan:**

```text
Value Type     → data disimpan langsung di Stack (int, bool, struct)
Reference Type → pointer ada di Stack, objek data ada di Heap (string, class, array)
```

---

## 9. 🟢 Nullable Types & Fitur Null-Safety C# 14

#### Konsep

Masalah terbesar pemrograman modern adalah **`NullReferenceException`** (mencoba mengakses data dari pointer yang tidak menunjuk ke mana pun).

C# menyediakan sistem pertahanan null-safety komprehensif:
1. **Nullable Value Types (`T?`):** Memungkinkan tipe primitif bernilai `null` (`int? kuota = null;`).
2. **Nullable Reference Types (`string?`):** Menandakan bahwa variabel string secara sengaja diizinkan bernilai `null`.
3. **Null-Coalescing (`??`):** Memberikan nilai cadangan (fallback) jika ekspresi bernilai null.
4. **Null-Coalescing Assignment (`??=`):** Menugaskan nilai hanya jika variabel saat ini bernilai null.
5. **Null-Conditional Operator (`?.`):** Mengakses property atau method secara aman tanpa melempar exception jika objek bernilai null.
6. **C# 14 Null-Conditional Assignment (`target?.Property = value`):** Menugaskan nilai ke property atau indexer (`target?[i] = value`) hanya jika objek target tidak bernilai null. Jika target bernilai null, penugasan diabaikan (*short-circuiting* tanpa mengevaluasi ekspresi sisi kanan).

#### Contoh

```csharp
// Nullable Value Type
int? jumlahAnak = null;
Console.WriteLine($"Jumlah anak: {jumlahAnak ?? 0}"); // Output 0 jika null

// Null-Coalescing Assignment (??=)
string? koneksiDb = null;
koneksiDb ??= "Server=localhost;Port=5432;Database=toko;";
Console.WriteLine($"Koneksi DB: {koneksiDb}");

// Null-Conditional (?.)
string? namaPelanggan = null;
int? panjangNama = namaPelanggan?.Length; // Aman: tidak melempar NullReferenceException!
Console.WriteLine($"Panjang Nama: {panjangNama ?? 0}");

// Null-Conditional Assignment (C# 14)
class ProfilUser { public string Catatan { get; set; } = ""; }
ProfilUser? profil = null;
profil?.Catatan = "Akun VIP Aktif"; // Aman di C# 14: tidak crash meski profil bernilai null!
```

#### Output

```text
Jumlah anak: 0
Koneksi DB: Server=localhost;Port=5432;Database=toko;
Panjang Nama: 0
```

**Hafalan:**

```text
T?                 → tipe data yang boleh bernilai null (nullable)
??                 → operator pemberi nilai default jika sisi kiri bernilai null
??=                → isi nilai baru hanya jika variabel saat ini bernilai null
?.                 → akses member objek secara aman tanpa crash jika objek null
target?.Prop = val → null-conditional assignment C# 14 (hanya isi jika target tidak null)
```

---

## 10. 🟢 Konversi Tipe Data (Implicit, Explicit Casting & Convert)

#### Konsep

Tiga cara melakukan konversi tipe data di C#:

1. **Implicit Casting (Otomatis / Widening):** Terjadi otomatis tanpa risiko kehilangan data saat mengonversi tipe kecil ke tipe yang lebih besar (`int` $\rightarrow$ `long` $\rightarrow$ `double`).
2. **Explicit Casting (Manual / Narrowing):** Wajib menuliskan tipe target dalam kurung `(tipe)` saat mengonversi tipe besar ke kecil. Berisiko terjadi pemotongan data (*overflow / precision loss*).
3. **Type Conversion Methods (`Convert` / `Parse`):** Mengonversi teks string menjadi angka:
   - `int.Parse("123")` : Langsung mengonversi string ke integer (melempar exception jika format salah).
   - `int.TryParse("123", out int hasil)` : **Best Practice Industri**. Mengonversi string secara aman tanpa melempar exception jika gagal.

#### Contoh

```csharp
// 1. Implicit Casting
int angkaInt = 45;
double angkaDouble = angkaInt; // Otomatis

// 2. Explicit Casting
double desimalTinggi = 9.87;
int bulat = (int)desimalTinggi; // Angka di belakang koma terpotong menjadi 9

// 3. Safe Parsing dengan int.TryParse
string inputPengguna = "15000";

if (int.TryParse(inputPengguna, out int nominalBayar))
{
    Console.WriteLine($"Parsing Berhasil: Rp {nominalBayar:N0}");
}
else
{
    Console.WriteLine("Format angka yang Anda masukkan tidak valid!");
}
```

#### Output

```text
Parsing Berhasil: Rp 15,000
```

**Hafalan:**

```text
(tipe) var              → explicit casting manual antar-tipe angka kompatibel
int.TryParse(teks, out) → konversi string ke angka secara aman bebas exception
```

---

## 11. 🟢 Operator Aritmatika, Penugasan & Presedensi

#### Konsep

Operator aritmatika digunakan untuk melakukan komputasi matematika:
- Penjumlahan (`+`), Pengurangan (`-`), Perkalian (`*`), Pembagian (`/`), Sisa Bagi / Modulo (`%`).
- Increment (`++`) dan Decrement (`--`).
- Compound Assignment: `+=`, `-=`, `*=`, `/=`, `%=`.

> [!WARNING]
> **Pembagian Integer:** Jika kedua operan adalah bilangan bulat (`int / int`), hasilnya adalah bilangan bulat yang dipotong ke bawah! Misal: `7 / 2 = 3`, bukan `3.5`. Jika menginginkan pecahan, minimal salah satu operan wajib berstatus floating point (`7.0 / 2 = 3.5`).

#### Contoh

```csharp
int totalItem = 17;
int kapasitasBox = 5;

int boxPenuh = totalItem / kapasitasBox;  // 3 box
int sisaItem = totalItem % kapasitasBox;  // 2 item tersisa

double rataRata = 7.0 / 2; // Menggunakan 7.0 agar menghasilkan pecahan 3.5

Console.WriteLine($"Box Penuh  : {boxPenuh}");
Console.WriteLine($"Sisa Item  : {sisaItem}");
Console.WriteLine($"Rata-rata  : {rataRata}");
```

#### Output

```text
Box Penuh  : 3
Sisa Item  : 2
Rata-rata  : 3.5
```

**Hafalan:**

```text
a / b → pembagian (menghasilkan integer bulat jika kedua operan int)
a % b → modulo (mengembalikan sisa pembagian)
a += b→ penyingkat penugasan a = a + b
```

---

## 12. 🟢 Operator Perbandingan & Logika (Short-Circuit)

#### Konsep

1. **Operator Perbandingan:** Menghasilkan nilai boolean `true` atau `false`:
   - Sama dengan (`==`), Tidak sama dengan (`!=`).
   - Lebih besar (`>`), Lebih kecil (`<`), Lebih besar sama dengan (`>=`), Lebih kecil sama dengan (`<=`).
2. **Operator Logika Boolean:**
   - Logika AND (`&&`): Bernilai `true` jika kedua kondisi bernilai benar.
   - Logika OR (`||`): Bernilai `true` jika salah satu kondisi bernilai benar.
   - Logika NOT (`!`): Membalikkan nilai boolean (`!true` menjadi `false`).

**Evaluasi Short-Circuit:**  
Pada operator `&&`, jika kondisi pertama bernilai `false`, kondisi kedua **tidak akan dieksekusi** sama sekali. Pada operator `||`, jika kondisi pertama bernilai `true`, kondisi kedua langsung dilewati.

#### Contoh

```csharp
int usia = 22;
bool memilikiSim = true;
bool sedangMabuk = false;

// Evaluasi Short-Circuit
bool bolehMengemudi = (usia >= 17) && memilikiSim && !sedangMabuk;

Console.WriteLine($"Boleh mengemudi: {bolehMengemudi}");
```

#### Output

```text
Boleh mengemudi: True
```

**Hafalan:**

```text
&& → logika AND dengan evaluasi short-circuit (keduanya wajib true)
|| → logika OR dengan evaluasi short-circuit (salah satu cukup true)
!  → logika NOT untuk membalikkan nilai boolean
```

---

## 13. 🟢 Input & Output Konsol (`Console.ReadLine` & Format Interpolasi)

#### Konsep

Untuk berinteraksi dengan pengguna melalui terminal CLI:
- **`Console.ReadLine()`:** Membaca satu baris teks input dari keyboard pengguna (selalu mengembalikan tipe `string?`).
- **`Console.WriteLine()`:** Menampilkan teks ke layar konsol diakhiri dengan baris baru.
- **Specifiers Formatting Teks Interpolasi:**
  - `{angka:N0}` : Format pemisah ribuan tanpa desimal (misal `1,000,000`).
  - `{angka:C}` : Format mata uang (*Currency* sesuai locale OS).
  - `{persen:P1}` : Format persentase 1 digit di belakang koma (misal `25.5%`).

#### Contoh

```csharp
Console.Write("Masukkan Nama Kasir: ");
string namaKasir = "Ali Murrofid"; // Simulasi input

Console.Write("Masukkan Total Transaksi: ");
string inputTotal = "750000";       // Simulasi input

if (decimal.TryParse(inputTotal, out decimal nominal))
{
    Console.WriteLine("\n--- STRUK PEMBAYARAN ---");
    Console.WriteLine($"Kasir       : {namaKasir}");
    Console.WriteLine($"Total Bayar : Rp {nominal:N0}");
    Console.WriteLine($"Diskon (10%): Rp {nominal * 0.10m:N0}");
}
```

#### Output

```text
--- STRUK PEMBAYARAN ---
Kasir       : Ali Murrofid
Total Bayar : Rp 750,000
Diskon (10%): Rp 75,000
```

**Hafalan:**

```text
Console.ReadLine() → membaca satu baris teks input keyboard (mengembalikan string?)
{val:N2}           → format string angka dengan pemisah ribuan dan 2 digit desimal
```

---

## 14. 🟢 Tipe Data Array 1 Dimensi & Collection Expressions

#### Konsep

Array adalah struktur data berurutan yang menyimpan sekumpulan elemen bertipe data sama dengan **panjang ukuran tetap (*fixed-size*)** yang dialokasikan di Heap Memory. Indeks array dimulai dari angka `0`.

**C# 12–14 Collection Expressions (`[...]`):**  
Di era modern C# 14, Anda tidak perlu lagi menulis sintaks lama yang panjang `new int[] { 1, 2, 3 }`. Gunakan tanda kurung siku `[...]` dan *Spread Operator* (`..`) untuk menggabungkan array.

#### Contoh

```csharp
// Sintaks Modern C# 14: Collection Expressions
int[] nilaiUjian = [85, 90, 78, 92, 88];

// Mengakses berdasarkan indeks
Console.WriteLine($"Elemen Pertama (Index 0) : {nilaiUjian[0]}");
Console.WriteLine($"Panjang Total Array      : {nilaiUjian.Length}");

// Fitur Index from End (^1 = elemen paling belakang)
Console.WriteLine($"Elemen Terakhir (^1)      : {nilaiUjian[^1]}");

// Menggabungkan array menggunakan Spread Operator (..)
int[] nilaiTambahan = [95, 100];
int[] semuaNilai = [..nilaiUjian, ..nilaiTambahan];

Console.WriteLine($"Total Elemen Setelah Digabung: {semuaNilai.Length}");
```

#### Output

```text
Elemen Pertama (Index 0) : 85
Panjang Total Array      : 5
Elemen Terakhir (^1)      : 88
Total Elemen Setelah Digabung: 7
```

**Hafalan:**

```text
type[] nama = [a, b, c] → deklarasi array modern via collection expressions
arr[^1]                 → mengakses elemen paling akhir dari array
..array                 → spread operator untuk menyalin seluruh isi array ke koleksi baru
```

---

## 15. 🟢 Tipe Data Array Multidimensi & Jagged Array

#### Konsep

C# membedakan dua jenis array bertingkat:

1. **Multidimensional Array (Rectangular Array - `[,]`):**
   - Matriks kotak persegi dengan jumlah kolom yang seragam di setiap barisnya.
   - Deklarasi: `int[,] matriks = new int[baris, kolom];`
2. **Jagged Array (Array of Arrays - `[][]`):**
   - Array yang elemen-elemennya berupa array lain dengan panjang kolom yang **berbeda-beda**.
   - Deklarasi: `int[][] jagged = new int[baris][];`

#### Contoh

```csharp
// 1. Multidimensional Rectangular Array (Matriks 2x3)
int[,] matriks = {
    { 1, 2, 3 },
    { 4, 5, 6 }
};
Console.WriteLine($"Matriks Baris 1 Kolom 2: {matriks[0, 1]}"); // Nilai 2

// 2. Jagged Array (Panjang kolom bebas)
int[][] jadwalKerja = [
    [1, 2, 3],       // Shift A: 3 hari kerja
    [4, 5],          // Shift B: 2 hari kerja
    [6, 7, 8, 9]     // Shift C: 4 hari kerja
];

Console.WriteLine($"Shift C memiliki {jadwalKerja[2].Length} hari kerja.");
```

#### Output

```text
Matriks Baris 1 Kolom 2: 2
Shift C memiliki 4 hari kerja.
```

**Hafalan:**

```text
int[,]  → array multidimensi persegi panjang (panjang kolom sama)
int[][] → jagged array (array di dalam array dengan panjang baris bebas)
```

---

## 16. 🟢 Percabangan If, Else If, dan Else

#### Konsep

Percabangan logika mengeksekusi blok kode tertentu berdasarkan kondisi boolean yang terpenuhi secara terurut dari atas ke bawah.

#### Contoh

```csharp
int nilaiAkhir = 82;
string predikat;

if (nilaiAkhir >= 85)
{
    predikat = "A (Sangat Memuaskan)";
}
else if (nilaiAkhir >= 75)
{
    predikat = "B (Memuaskan)";
}
else if (nilaiAkhir >= 60)
{
    predikat = "C (Cukup)";
}
else
{
    predikat = "D (Tidak Lulus)";
}

Console.WriteLine($"Nilai: {nilaiAkhir} | Predikat: {predikat}");
```

#### Output

```text
Nilai: 82 | Predikat: B (Memuaskan)
```

**Hafalan:**

```text
if (kondisi) { ... } else if (kondisi) { ... } else { ... } → struktur branching logika standar
```

---

## 17. 🟡 Switch Statement & Modern Switch Expression

#### Konsep

Selain statement `switch` konvensional dengan `case` dan `break`, C# modern menghadirkan **`switch` Expression**:
- Berbasis sintaks lambda ekspresif (`=>`).
- Langsung mengembalikan nilai kembalian (*return value*).
- Menggunakan tanda garis bawah (`_`) sebagai pengganti `default`.
- Mendukung **Pattern Matching C# 14** (menguji tipe, relasi komparasi, dan kondisi logika secara bersamaan).

#### Contoh

```csharp
// Modern Switch Expression dengan Relational Pattern Matching
int skorKredit = 720;

string statusPersetujuan = skorKredit switch
{
    >= 800 => "APPROVED_INSTANT",
    >= 700 and < 800 => "APPROVED_STANDARD",
    >= 600 and < 700 => "MANUAL_REVIEW",
    _ => "REJECTED" // Default fallback
};

Console.WriteLine($"Status Pengajuan Kredit: {statusPersetujuan}");
```

#### Output

```text
Status Pengajuan Kredit: APPROVED_STANDARD
```

**Hafalan:**

```text
var hasil = target switch { pola1 => val1, pola2 => val2, _ => defVal } → modern switch expression
_                                                                       → discard symbol penanda default
```

---

## 18. 🟡 Ternary Operator (`?:`) & Null-Coalescing Operator

#### Konsep

1. **Ternary Operator (`kondisi ? nilaiJikaTrue : nilaiJikaFalse`):** Penyingkat statement `if-else` sederhana menjadi satu baris ekspresi.
2. **Kombinasi dengan Null-Coalescing (`??`):** Menyediakan pertahanan berlapis untuk nilai null.

#### Contoh

```csharp
int totalBelanja = 600_000;

// Ternary Operator
decimal persentaseDiskon = (totalBelanja >= 500_000) ? 0.15m : 0.05m;
decimal potongan = totalBelanja * persentaseDiskon;

Console.WriteLine($"Diskon Diterima: Rp {potongan:N0}");
```

#### Output

```text
Diskon Diterima: Rp 90,000
```

**Hafalan:**

```text
kondisi ? jikaTrue : jikaFalse → ternary conditional operator
```

---

## 19. 🟡 Perulangan For Loop Standar

#### Konsep

Perulangan `for` digunakan saat jumlah perulangan sudah diketahui secara pasti sebelumnya. Terdiri dari 3 bagian:
1. Inisialisasi variabel penghitung (*counter*).
2. Kondisi terminasi perulangan.
3. Operasi iterasi (increment / decrement).

#### Contoh

```csharp
Console.WriteLine("Daftar Angka Kelipatan 5:");

for (int i = 5; i <= 25; i += 5)
{
    Console.Write($"{i} ");
}
Console.WriteLine();
```

#### Output

```text
Daftar Angka Kelipatan 5:
5 10 15 20 25 
```

**Hafalan:**

```text
for (int i = 0; i < n; i++) { ... } → perulangan terstruktur berbasis counter numerik
```

---

## 20. 🟡 Perulangan Foreach Loop

#### Konsep

Perulangan `foreach` digunakan untuk mengiterasi seluruh elemen di dalam koleksi atau array secara berurutan dari awal hingga akhir tanpa perlu mengelola variabel counter indeks manual.

> [!NOTE]
> Variabel iterasi di dalam `foreach` bersifat **Read-Only**. Anda tidak dapat mengubah elemen array secara langsung di dalam tubuh `foreach` (`item = 10` akan memicu compile error).

#### Contoh

```csharp
string[] daftarProduk = ["Keyboard Mekanikal", "Mouse Wireless", "Headset Bluetooth"];

Console.WriteLine("Katalog Produk:");
foreach (var produk in daftarProduk)
{
    Console.WriteLine($"- {produk}");
}
```

#### Output

```text
Katalog Produk:
- Keyboard Mekanikal
- Mouse Wireless
- Headset Bluetooth
```

**Hafalan:**

```text
foreach (var item in collection) { ... } → iterasi seluruh elemen koleksi secara aman dan terurut
```

---

## 21. 🟡 Perulangan While dan Do-While

#### Konsep

1. **`while` Loop:** Memeriksa kondisi logika **sebelum** mengeksekusi tubuh perulangan. Jika kondisi bernilai `false` sejak awal, blok perulangan tidak akan pernah dieksekusi sama sekali (0 kali).
2. **`do-while` Loop:** Mengeksekusi tubuh perulangan terlebih dahulu **minimal 1 kali**, baru kemudian memeriksa kondisi logika di bagian akhir.

#### Contoh

```csharp
int countdown = 3;

// While Loop
while (countdown > 0)
{
    Console.WriteLine($"Hitung Mundur: {countdown}...");
    countdown--;
}
Console.WriteLine("Selesai!");

// Do-While Loop (Pasti jalan minimal 1x)
int angka = 100;
do
{
    Console.WriteLine($"Nilai angka (Do-While): {angka}");
} while (angka < 50); // Kondisi false, perulangan berhenti
```

#### Output

```text
Hitung Mundur: 3...
Hitung Mundur: 2...
Hitung Mundur: 1...
Selesai!
Nilai angka (Do-While): 100
```

**Hafalan:**

```text
while (kondisi) { ... }       → cek kondisi di awal, eksekusi jika true
do { ... } while (kondisi);   → eksekusi minimal 1 kali, baru periksa kondisi di akhir
```

---

## 22. 🟡 Break, Continue, dan Return

#### Konsep

Pengontrol aliran perulangan:
- **`break`:** Menghentikan dan keluar seketika dari seluruh siklus perulangan.
- **`continue`:** Melewati sisa instruksi pada iterasi saat ini dan langsung melompat ke iterasi berikutnya.
- **`return`:** Keluar dari method secara total dan mengembalikan nilai (jika ada).

#### Contoh

```csharp
Console.WriteLine("Iterasi angka 1 s/d 10 (Lewati 3, Berhenti di 6):");

for (int i = 1; i <= 10; i++)
{
    if (i == 3)
    {
        continue; // Lewati angka 3
    }

    if (i == 6)
    {
        break; // Hentikan loop di angka 6
    }

    Console.Write($"{i} ");
}
Console.WriteLine();
```

#### Output

```text
Iterasi angka 1 s/d 10 (Lewati 3, Berhenti di 6):
1 2 4 5 
```

**Hafalan:**

```text
break    → hentikan paksa perulangan saat ini
continue → lewati sisa iterasi saat ini, lanjut ke iterasi berikutnya
```

---

## 23. 🟡 Method Dasar (Void & Return Value)

#### Konsep

Method adalah blok kode terorganisir yang melakukan tugas spesifik dan dapat dipanggil berulang kali (*reusable*):
- **Method `void`:** Tidak mengembalikan nilai apa pun.
- **Method dengan Return Value:** Menghasilkan nilai kembalian dengan tipe data yang ditentukan via keyword `return`.
- **Expression-Bodied Method:** Penyingkat penulisan method satu baris menggunakan operator panah `=>`.

#### Contoh

```csharp
// Method Void Standar
void CetakHeader(string judul)
{
    Console.WriteLine($"=== {judul.ToUpper()} ===");
}

// Method dengan Return Value (Biasa)
decimal HitungPajak(decimal nominal, decimal tarif = 0.11m)
{
    return nominal * tarif;
}

// Expression-Bodied Method (Ringkas satu baris)
decimal HitungTotalAkhir(decimal nominal, decimal pajak) => nominal + pajak;

CetakHeader("Invoice Pembelian");
decimal subtotal = 500_000m;
decimal ppn = HitungPajak(subtotal);
decimal grandTotal = HitungTotalAkhir(subtotal, ppn);

Console.WriteLine($"Subtotal   : Rp {subtotal:N0}");
Console.WriteLine($"PPN (11%)  : Rp {ppn:N0}");
Console.WriteLine($"Total Bayar: Rp {grandTotal:N0}");
```

#### Output

```text
=== INVOICE PEMBELIAN ===
Subtotal   : Rp 500,000
PPN (11%)  : Rp 55,000
Total Bayar: Rp 555,000
```

**Hafalan:**

```text
void                 → method yang tidak mengembalikan nilai
return val           → mengembalikan hasil eksekusi method
type Method() => exp → expression-bodied method satu baris
```

---

## 24. 🟡 Method Parameter Passing (Value, in, out, ref)

#### Konsep

Secara default, parameter bertipe value type dikirim secara **Pass-by-Value** (nilainya disalin). C# menyediakan 3 modifier parameter tingkat lanjut:

1. **`ref`:** Mengoper referensi memori variabel asli. Perubahan di dalam method akan memengaruhi variabel di luar method. Variabel wajib diinisialisasi sebelum dipanggil.
2. **`out`:** Mengembalikan lebih dari satu output dari method. Variabel pemanggil tidak harus diinisialisasi sebelumnya, namun **wajib diberi nilai** di dalam method sebelum method selesai.
3. **`in`:** Mengoper referensi memori hanya untuk dibaca (**Read-Only**). Mencegah salinan memori bernilai besar tanpa risiko datanya dimodifikasi oleh method.

#### Contoh

```csharp
// 1. Parameter ref
void TambahBonus(ref decimal saldo, decimal bonus)
{
    saldo += bonus; // Memodifikasi variabel asli di luar
}

// 2. Parameter out
bool CobaBagi(int pembilang, int penyebut, out double hasil)
{
    if (penyebut == 0)
    {
        hasil = 0; // Wajib diisi sebelum return
        return false;
    }
    hasil = (double)pembilang / penyebut;
    return true;
}

decimal dompet = 100_000m;
TambahBonus(ref dompet, 50_000m);
Console.WriteLine($"Saldo setelah bonus: Rp {dompet:N0}");

if (CobaBagi(10, 2, out double hasilBagi))
{
    Console.WriteLine($"Hasil Pembagian: {hasilBagi}");
}
```

#### Output

```text
Saldo setelah bonus: Rp 150,000
Hasil Pembagian: 5
```

**Hafalan:**

```text
ref var → kirim referensi memori dua arah (baca dan tulis variabel luar)
out var → kirim variabel kosong untuk diisi dan dikembalikan oleh method
in var  → kirim referensi memori hanya-baca (read-only, hemat alokasi)
```

---

## 25. 🟡 Method Overloading & Optional Parameters

#### Konsep

1. **Method Overloading:** Mendefinisikan beberapa method dengan **nama yang sama persis** di dalam satu scope, asalkan memiliki jumlah atau tipe parameter yang berbeda (*berbeda signature*).
2. **Optional Parameters:** Parameter yang memiliki nilai default bawaan. Pemanggil tidak wajib menyertakan argumen untuk parameter tersebut.

#### Contoh

```csharp
// Overloading 1: Cari berdasarkan ID Integer
void CariUser(int id)
{
    Console.WriteLine($"Mencari user berdasarkan ID: {id}");
}

// Overloading 2: Cari berdasarkan Username String
void CariUser(string username)
{
    Console.WriteLine($"Mencari user berdasarkan Username: {username}");
}

// Optional Parameter (format = "IDR")
void CetakNominal(decimal nominal, string mataUang = "IDR")
{
    Console.WriteLine($"Nominal: {mataUang} {nominal:N0}");
}

CariUser(101);
CariUser("alimurrofid");
CetakNominal(50_000m);          // Memakai default "IDR"
CetakNominal(20m, "USD");        // Mengganti nilai opsional
```

#### Output

```text
Mencari user berdasarkan ID: 101
Mencari user berdasarkan Username: alimurrofid
Nominal: IDR 50,000
Nominal: USD 20
```

**Hafalan:**

```text
Overloading          → nama method sama dengan parameter berbeda
void M(int x = 10)   → parameter opsional dengan nilai default bawaan
```

---

## 26. 🟡 Local Functions & Variable Scope

#### Konsep

1. **Scope Variabel:** Area di dalam kode di mana suatu variabel dapat diakses (dibatasi oleh kurung kurawal `{ ... }`). Variabel lokal di dalam blok `if` atau `for` tidak dapat diakses dari luar blok tersebut.
2. **Local Functions:** Method bantuan privat yang dideklarasikan langsung **di dalam method lain**. Membantu mengisolasi logika yang hanya relevan bagi method tersebut tanpa mengotori class luar.

#### Contoh

```csharp
void ProsesTransaksi(decimal[] daftarBelanja)
{
    decimal total = 0;

    // Local Function: Hanya bisa dipanggil di dalam ProsesTransaksi
    decimal HitungDiskonMember(decimal subtotal) => subtotal >= 500_000 ? subtotal * 0.10m : 0m;

    foreach (var harga in daftarBelanja)
    {
        total += harga;
    }

    decimal diskon = HitungDiskonMember(total);
    Console.WriteLine($"Subtotal: Rp {total:N0} | Diskon: Rp {diskon:N0}");
}

ProsesTransaksi([200_000m, 350_000m]);
```

#### Output

```text
Subtotal: Rp 550,000 | Diskon: Rp 55,000
```

**Hafalan:**

```text
Local Function → method internal yang didefinisikan dan digunakan khusus di dalam tubuh method lain
```

---

## 27. 🔴 String Utility Methods & Manipulasi Teks

#### Konsep

Metode bawaan class `System.String` yang esensial:
- `string.IsNullOrWhiteSpace(str)` : Memeriksa apakah teks null, kosong (`""`), atau hanya spasi (`"   "`).
- `str.Trim()` : Menghapus spasi liar di awal dan akhir teks.
- `str.ToLower()` & `str.ToUpper()` : Mengubah kapitalisasi huruf.
- `str.Contains(sub)` : Mengecek keberadaan substring.
- `str.Replace(old, new)` : Mengganti teks lama dengan teks baru.
- `str.Split(pemisah)` : Memecah teks menjadi array string.
- `string.Join(pemisah, array)` : Menggabungkan array string menjadi satu teks utuh.

#### Contoh

```csharp
string rawInput = "   kopi,gula,susu,teh   ";

// 1. Pembersihan Teks
string cleaned = rawInput.Trim();

// 2. Pemecahan ke Array
string[] daftarBarang = cleaned.Split(',');

// 3. Penggabungan Kembali dengan Format Rapi
string hasilGabung = string.Join(" | ", daftarBarang);

Console.WriteLine($"Hasil Split & Join: {hasilGabung}");
Console.WriteLine($"Apakah mengandung 'susu'? {cleaned.Contains("susu")}");
```

#### Output

```text
Hasil Split & Join: kopi | gula | susu | teh
Apakah mengandung 'susu'? True
```

**Hafalan:**

```text
string.IsNullOrWhiteSpace(s) → validasi teks tidak boleh null, kosong, atau hanya spasi
string.Join(delimit, arr)    → menggabungkan array string menjadi satu string dengan pemisah
```

---

## 28. 🔴 Math Utility Class (`System.Math`)

#### Konsep

Class statis `System.Math` menyediakan fungsi matematika dan kalkulasi numerik bawaan:
- `Math.Abs(x)` : Menghasilkan nilai absolut (selalu positif).
- `Math.Max(a, b)` & `Math.Min(a, b)` : Mengambil nilai tertinggi atau terendah.
- `Math.Round(x, digits)` : Membulatkan angka pecahan ke digit desimal tertentu.
- `Math.Ceiling(x)` : Membulatkan ke atas ke bilangan bulat terdekat.
- `Math.Floor(x)` : Membulatkan ke bawah ke bilangan bulat terdekat.
- `Math.Pow(basis, pangkat)` : Menghitung pemangkatan angka.
- `Math.Sqrt(x)` : Menghitung akar kuadrat.

#### Contoh

```csharp
double biayaOngkir = 14_250.60;

Console.WriteLine($"Nilai Max (10 vs 25) : {Math.Max(10, 25)}");
Console.WriteLine($"Pembulatan Round (2) : Rp {Math.Round(biayaOngkir, 0):N0}");
Console.WriteLine($"Pembulatan Ceiling   : Rp {Math.Ceiling(biayaOngkir):N0}");
Console.WriteLine($"Akar Kuadrat dari 64 : {Math.Sqrt(64)}");
```

#### Output

```text
Nilai Max (10 vs 25) : 25
Pembulatan Round (2) : Rp 14,251
Pembulatan Ceiling   : Rp 14,251
Akar Kuadrat dari 64 : 8
```

**Hafalan:**

```text
Math.Max(a, b)   → nilai terbesar di antara dua angka
Math.Round(x, d) → pembulatan angka ke d desimal
Math.Ceiling(x)  → pembulatan ke atas
```

---

## 29. 🔴 Penanganan Exception Dasar & Exception Filters (`when`)

#### Konsep

Exception adalah kesalahan atau kejadian tak terduga saat program sedang berjalan (*runtime error*):
- `try` : Blok kode berisiko yang diawasi.
- `catch (ExceptionType ex)` : Menangkap tipe error tertentu dan menangani pemulihannya.
- `finally` : Blok kode yang **selalu dieksekusi** tanpa peduli apakah terjadi error atau tidak (cocok untuk menutup file/koneksi).
- **Exception Filters (`when`):** Fitur unggulan C# untuk menangkap exception hanya jika memenuhi kondisi predikat boolean tertentu tanpa perlu *rethrow*.

#### Contoh

```csharp
void ProsesTransaksiBank(decimal nominalTarik, decimal saldo)
{
    try
    {
        if (nominalTarik <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(nominalTarik), "Nominal penarikan wajib lebih dari 0!");
        }

        if (nominalTarik > saldo)
        {
            throw new InvalidOperationException("Saldo rekening tidak mencukupi untuk penarikan ini.");
        }

        saldo -= nominalTarik;
        Console.WriteLine($"Penarikan berhasil Rp {nominalTarik:N0}. Sisa saldo: Rp {saldo:N0}");
    }
    // Exception Filter: Hanya tangkap jika pesan spesifik tertentu
    catch (InvalidOperationException ex) when (ex.Message.Contains("Saldo"))
    {
        Console.WriteLine($"[GAGAL TRANSAKSI KEUANGAN]: {ex.Message}");
    }
    catch (ArgumentOutOfRangeException ex)
    {
        Console.WriteLine($"[VALIDASI INPUT ERROR]: {ex.Message}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[ERROR SISTEM UMUM]: {ex.Message}");
    }
    finally
    {
        Console.WriteLine("Sesi perbankan selesai ditutup.");
    }
}

ProsesTransaksiBank(500_000m, 200_000m);
```

#### Output

```text
[GAGAL TRANSAKSI KEUANGAN]: Saldo rekening tidak mencukupi untuk penarikan ini.
Sesi perbankan selesai ditutup.
```

**Hafalan:**

```text
try { ... } catch (Type ex) when (cond) { ... } finally { ... } → blok exception handling dengan filter
throw new Exception("pesan")                                   → melempar exception baru secara sengaja
```

---

## 30. 🛠️ Peta Ingatan Cepat

```text
C# 14 & .NET 10 LTS
├── Fundamental
│   ├── Mental Model (.NET CLR, Roslyn, CIL, RyuJIT)
│   ├── Top-Level Statements (Program.cs tanpa boilerplate)
│   ├── Sistem Tipe (Value Types di Stack vs Reference Types di Heap)
│   ├── Null-Safety (Nullable Types T?, ??, ??=, ?.)
│   └── Koleksi Modern (Array & Collection Expressions [...])
├── Lanjutan
│   ├── Percabangan (If-Else & Modern Switch Expression)
│   ├── Perulangan (For, Foreach, While, Do-While)
│   ├── Aliran (Break, Continue, Return)
│   └── Modularitas Method (Pass-by-Value, in, out, ref)
└── Advanced / Operasional
    ├── String Utilities & Raw String Literals
    ├── Math Utilities
    └── Penanganan Exception & Exception Filters (when)
```

---

## 31. 📊 Tabel Ringkasan

| Konsep | Sintaks C# 14 | Deskripsi / Kegunaan |
|---|---|---|
| **Cetak Konsol** | `Console.WriteLine($"Nilai: {x}")` | Mencetak teks dengan string interpolation. |
| **Inference Tipe** | `var angka = 100;` | Menentukan tipe data variabel otomatis saat kompilasi. |
| **Pengecekan Null** | `var hasil = target ?? "Default";` | Fallback nilai default jika variabel null. |
| **Collection Literal**| `int[] arr = [1, 2, 3];` | Sintaks ringkas membuat array (Collection Expressions). |
| **Switch Expression**| `var x = val switch { 1 => "A", _ => "B" };`| Pemetaan nilai berbasis pola modern. |
| **Safe Parsing** | `int.TryParse(teks, out var val)` | Konversi string ke angka bebas exception runtime. |
| **Parameter Out** | `bool Sukses(out double res)` | Mengembalikan multi-output dari eksekusi method. |
| **Exception Filter**| `catch (Exception e) when (kondisi)` | Menangkap error hanya jika kondisi boolean terpenuhi. |

---

## 32. ⚡ Cheat Code C# Dasar 10 Detik

```text
dotnet run                   → jalankan aplikasi C# dari terminal
Console.WriteLine($"{var}")  → cetak teks dengan interpolasi variabel
int.TryParse(s, out var res) → parsing string ke int secara aman
int[] a = [1, 2, 3]          → array collection expression C# modern
val ?? fallback              → nilai default jika null
obj?.Prop                    → akses property aman dari null
val switch { A => 1, _ => 0} → switch expression modern
ref / out / in               → modifier parameter memori method
try / catch / finally        → blok penanganan exception runtime
```

---

## 33. 🧭 Urutan Belajar yang Disarankan

1. Pahami mental model bagaimana **.NET CLR** mengeksekusi CIL Bytecode menjadi Native Machine Code.
2. Tulis program pertama menggunakan **Top-Level Statements** dan pahami cara kerja compiler Roslyn.
3. Kuasai perbedaan alokasi memori **Value Types (Stack)** dan **Reference Types (Heap)**.
4. Terapkan fitur **Null-Safety C#** (`int?`, `string?`, `??`, `?.`) untuk mencegah bug *NullReferenceException*.
5. Kuasai sintaks koleksi modern **Collection Expressions** (`[...]`) dan loop `foreach`.
6. Latih perbandingan percabangan dengan **Modern Switch Expression**.
7. Pelajari mekanisme pengiriman parameter method (`in`, `out`, `ref`).
8. Kerjakan **Mini Project Sistem Kasir Toko CLI** untuk menggabungkan seluruh konsep fundamental.
9. Lanjutkan ke materi berikutnya: [[csharp-oop|C# OOP]].

---

## 34. 🏗️ Mini Project: Sistem Kasir & Inventaris Toko CLI

### Tujuan
Membangun aplikasi konsol kasir dan manajemen transaksi sederhana menggunakan **C# 14 & .NET 10** yang menerapkan Top-Level Statements, tipe data `decimal`, Array collection expressions, `switch` expression, validasi `TryParse`, dan penanganan exception.

### Fitur
1. Katalog produk dengan harga berbasis `decimal` (presisi finansial).
2. Perhitungan subtotal, PPN (11%), dan diskon member via switch expression.
3. Validasi nominal pembayaran tunai dan kalkulasi uang kembalian.
4. Penanganan input salah menggunakan `int.TryParse` dan `decimal.TryParse`.

### Kode Lengkap (`Program.cs`)

```csharp
// Mini Project: Aplikasi Kasir Toko Sembako Modern (C# 14 / .NET 10 LTS)

// 1. Data Katalog Menggunakan Collection Expressions Modern
string[] namaProduk = ["Beras Premium 5kg", "Minyak Goreng 2L", "Gula Pasir 1kg", "Kopi Bubuk 250g"];
decimal[] hargaProduk = [75_000m, 36_000m, 17_500m, 22_000m];
int[] stokProduk = [20, 15, 30, 25];

Console.WriteLine("==================================================");
Console.WriteLine("   SISTEM KASIR TOKO MODERN (C# 14 / .NET 10)     ");
Console.WriteLine("==================================================");

// 2. Tampilkan Katalog Produk
Console.WriteLine("\n[KATALOG PRODUK TERSEDIA]");
for (int i = 0; i < namaProduk.Length; i++)
{
    Console.WriteLine($"{i + 1}. {namaProduk[i],-20} : Rp {hargaProduk[i],9:N0} (Stok: {stokProduk[i]})");
}

// 3. Simulasi Input Transaksi Kasir dengan Validasi TryParse
string rawInputId = "1";         // Simulasi input ID produk
string rawInputJumlah = "2";     // Simulasi input jumlah beli
string rawInputMember = "GOLD";  // Tipe membership pelanggan
string rawUangBayar = "200000";  // Nominal uang pembayaran tunai

// Validasi ID Produk via int.TryParse
if (!int.TryParse(rawInputId, out int pilihanId) || pilihanId < 1 || pilihanId > namaProduk.Length)
{
    Console.WriteLine("Error: Pilihan ID produk tidak valid!");
    return;
}

// Validasi Jumlah Beli & Ketersediaan Stok
if (!int.TryParse(rawInputJumlah, out int jumlahBeli) || jumlahBeli <= 0 || jumlahBeli > stokProduk[pilihanId - 1])
{
    Console.WriteLine("Error: Jumlah beli tidak valid atau melebihi stok yang tersedia!");
    return;
}

string tipeMember = rawInputMember.Trim().ToUpper();

Console.WriteLine("\n--- MEMPROSES TRANSAKSI ---");
Console.WriteLine($"Item Dipilih  : {namaProduk[pilihanId - 1]}");
Console.WriteLine($"Jumlah Beli   : {jumlahBeli} unit");
Console.WriteLine($"Status Member : {tipeMember}");

// 4. Hitung Subtotal & Diskon Menggunakan Modern Switch Expression
decimal hargaSatuan = hargaProduk[pilihanId - 1];
decimal subtotal = hargaSatuan * jumlahBeli;

decimal persentaseDiskon = tipeMember switch
{
    "PLATINUM" => 0.15m, // Diskon 15%
    "GOLD"     => 0.10m, // Diskon 10%
    "SILVER"   => 0.05m, // Diskon 5%
    _          => 0.00m  // Non-member
};

decimal nominalDiskon = subtotal * persentaseDiskon;
decimal kenaPajak = subtotal - nominalDiskon;
decimal ppn = kenaPajak * 0.11m; // PPN 11%
decimal totalAkhir = kenaPajak + ppn;

// 5. Cetak Struk Pembayaran
Console.WriteLine("\n================ STRUK RESMI ================");
Console.WriteLine($"Subtotal Belanja    : Rp {subtotal,12:N0}");
Console.WriteLine($"Diskon Member ({persentaseDiskon:P0}) : Rp {nominalDiskon,12:N0}");
Console.WriteLine($"Dasar Kena Pajak    : Rp {kenaPajak,12:N0}");
Console.WriteLine($"PPN (11%)           : Rp {ppn,12:N0}");
Console.WriteLine("---------------------------------------------");
Console.WriteLine($"TOTAL TAGIHAN       : Rp {totalAkhir,12:N0}");
Console.WriteLine("=============================================");

// 6. Pembayaran & Kembalian dengan Validasi decimal.TryParse
if (!decimal.TryParse(rawUangBayar, out decimal uangDibayar) || uangDibayar < totalAkhir)
{
    Console.WriteLine("\nStatus: GAGAL! Pembayaran tidak valid atau uang tunai kurang.");
    return;
}

decimal kembalian = uangDibayar - totalAkhir;
Console.WriteLine($"Uang Tunai Diterima : Rp {uangDibayar,12:N0}");
Console.WriteLine($"Uang Kembalian      : Rp {kembalian,12:N0}");
Console.WriteLine("\nStatus: TRANSAKSI BERHASIL LUNAS. Terima Kasih!");
```

### Hasil Akhir

```text
==================================================
   SISTEM KASIR TOKO MODERN (C# 14 / .NET 10)     
==================================================

[KATALOG PRODUK TERSEDIA]
1. Beras Premium 5kg    : Rp    75,000 (Stok: 20)
2. Minyak Goreng 2L     : Rp    36,000 (Stok: 15)
3. Gula Pasir 1kg       : Rp    17,500 (Stok: 30)
4. Kopi Bubuk 250g      : Rp    22,000 (Stok: 25)

--- MEMPROSES TRANSAKSI ---
Item Dipilih  : Beras Premium 5kg
Jumlah Beli   : 2 unit
Status Member : GOLD

================ STRUK RESMI ================
Subtotal Belanja    : Rp      150,000
Diskon Member (10%) : Rp       15,000
Dasar Kena Pajak    : Rp      135,000
PPN (11%)           : Rp       14,850
---------------------------------------------
TOTAL TAGIHAN       : Rp      149,850
=============================================
Uang Tunai Diterima : Rp      200,000
Uang Kembalian      : Rp       50,150

Status: TRANSAKSI BERHASIL LUNAS. Terima Kasih!
```

---

## 35. 🔗 Referensi Resmi

- [Dokumentasi Resmi C# Language (Microsoft Learn)](https://learn.microsoft.com/dotnet/csharp/)
- [What's New in C# 14](https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-14)
- [Dokumentasi Resmi .NET 10 (Microsoft Learn)](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10)
- [Common Language Runtime (CLR) Architecture Overview](https://learn.microsoft.com/dotnet/standard/clr)
- [C# Language Design & Roslyn Compiler GitHub Repository](https://github.com/dotnet/csharplang)
