---
title: "C# LINQ (Language Integrated Query)"
description: "Panduan komprehensif LINQ di C# 14 dan .NET 10 LTS: Delegates, Lambda expressions, Deferred Execution vs Immediate Execution, operasi transformasi Where/Select/GroupBy/Join, IEnumerable vs IQueryable, serta Extension Members block C# 14."
order: 5
tags:
  - csharp
  - dotnet
  - programming
  - linq
  - functional-programming
---

# C# LINQ (Language Integrated Query)

> Target: Pemula hingga Menengah  
> Versi: C# 14 / .NET 10 LTS  
> Prasyarat: [[csharp-dasar|C# Dasar]], [[csharp-oop|C# OOP]], [[csharp-generic|C# Generic]], dan [[csharp-collection|C# Collection Framework]]

---

## Gambaran Umum

Sebelum era LINQ (Language Integrated Query), pengembang C# harus menulis perulangan manual (`for`, `foreach`) bercabang-cabang dan variabel penampung sementara (*temporary accumulator*) hanya untuk memfilter, mengurutkan, dan mengelompokkan sekumpulan data. Pendekatan imperatif ini panjang, rawan bug off-by-one, dan sulit dipelihara.

**LINQ** mengubah paradigma tersebut dengan menghadirkan gaya pemrograman deklaratif dan fungsional langsung ke dalam inti bahasa C#. Anda cukup menyatakan **apa data yang Anda inginkan** (*what to get*), bukan mendikte langkah teknis mesin secara mendetail (*how to loop*).

Di .NET 10 LTS dan C# 14, LINQ tidak hanya berlaku untuk koleksi data dalam memori (*LINQ to Objects*), melainkan menjadi bahasa seragam untuk kueri database relasional (*LINQ to Entities / EF Core*), parsing XML/JSON, hingga stream reaktif. C# 14 bahkan membawa lompatan besar melalui fitur **Extension Members**, mempermudah perluasan operator LINQ dengan sintaksis deklaratif yang jauh lebih elegan.

---

## Cara Belajar

1. Pahami mental model perbedaan gaya imperatif vs deklaratif.
2. Kuasai fondasi fungsional di C#: `Func`, `Action`, dan ekspresi Lambda modern.
3. Pelajari perbedaan fundamental antara **Deferred Execution** (eksekusi malas via `yield return`) dan **Immediate Execution** (eksekusi serakah seperti `ToList()`).
4. Pahami bahaya kritis **Multiple Enumeration Trap** dan cara mengatasinya.
5. Kuasai operator inti LINQ: filtering (`Where`), proyeksi (`Select`, `SelectMany`), pengelompokan (`GroupBy`), dan partisi (`Chunk`, `Take`).
6. Pahami perbedaan mendasar antara `IEnumerable<T>` (eksekusi di RAM) dan `IQueryable<T>` (diterjemahkan menjadi SQL di server database).
7. Pelajari fitur mutakhir C# 14: **Extension Members block**.
8. Terapkan seluruh materi ke dalam Mini Project deteksi anomali transaksi finansial.

---

## Daftar Isi

### 🟢 Fundamental

1. [Mental Model: Gaya Imperatif vs Deklaratif LINQ](#1--mental-model-gaya-imperatif-vs-deklaratif-linq)
2. [Fondasi Fungsional: Delegates, Func, Action, dan Lambda](#2--fondasi-fungsional-delegates-func-action-dan-lambda)
3. [Dua Wajah LINQ: Method Syntax vs Query Syntax](#3--dua-wajah-linq-method-syntax-vs-query-syntax)
4. [Mekanisme Pipeline: Deferred Execution vs Immediate Execution](#4--mekanisme-pipeline-deferred-execution-vs-immediate-execution)

### 🟡 Intermediate

5. [Operator Pemfilteran dan Proyeksi: Where, Select, dan SelectMany](#5--operator-pemfilteran-dan-proyeksi-where-select-dan-selectmany)
6. [Operator Pengurutan dan Partisi: OrderBy, Chunk, dan Take](#6--operator-pengurutan-dan-partisi-orderby-chunk-dan-take)
7. [Operator Pengelompokan dan Himpunan: GroupBy, DistinctBy, dan Set](#7--operator-pengelompokan-dan-himpunan-groupby-distinctby-dan-set)
8. [Operator Agregasi: Count, Sum, Min, Max, dan Aggregate](#8--operator-agregasi-count-sum-min-max-dan-aggregate)
9. [Operator Penggabungan: Join dan GroupJoin](#9--operator-penggabungan-join-dan-groupjoin)

### 🔴 Advanced

10. [Multiple Enumeration Trap dan Cara Menghindarinya](#10--multiple-enumeration-trap-dan-cara-menghindarinya)
11. [IEnumerable vs IQueryable: Rahasia Eksekusi Database EF Core](#11--ienumerable-vs-iqueryable-rahasia-eksekusi-database-ef-core)
12. [Cara Kerja Internal: yield return dan Compiler State Machine](#12--cara-kerja-internal-yield-return-dan-compiler-state-machine)
13. [Fitur C# 14: Extension Members Block untuk LINQ](#13--fitur-c-14-extension-members-block-untuk-linq)

### 🛠️ Praktik

14. [Best Practice Performa LINQ](#14-️-best-practice-performa-linq)
15. [Kesalahan Umum Pemula](#15-️-kesalahan-umum-pemula)
16. [Mini Project: Financial Ledger & Fraud Anomaly Detection Engine](#16-️-mini-project-financial-ledger--fraud-anomaly-detection-engine)

### 📚 Referensi

17. [Peta Ingatan](#17--peta-ingatan)
18. [Cheat Code 10 Detik](#18--cheat-code-10-detik)
19. [Urutan Belajar Berikutnya](#19--urutan-belajar-berikutnya)
20. [Referensi Resmi](#20--referensi-resmi)

---

## 1. 🟢 Mental Model: Gaya Imperatif vs Deklaratif LINQ

### Konsep

Dalam pemrograman **imperatif**, pengembang bertindak sebagai mandor pabrik yang memberikan instruksi langkah demi langkah:
* "Buat list kosong baru."
* "Mulai perulangan dari indeks 0 hingga panjang data."
* "Cek apakah elemen saat ini memenuhi kondisi."
* "Jika ya, masukkan ke list baru."
* "Urutkan list tersebut secara manual."

Dalam pemrograman **deklaratif (LINQ)**, pengembang bertindak sebagai pembuat spesifikasi bisnis:
* "Saya ingin data yang aktif, diurutkan berdasarkan tanggal terbaru, dan ambil 5 teratas."

### Perbandingan Kode Nyata

Tugas: Ambil nama pelanggan yang berusia di atas 20 tahun, urutkan berdasarkan nama secara alfabetis, dan ubah hurufnya menjadi kapital.

```csharp
record Customer(string Name, int Age);

List<Customer> customers = [
    new("Budi", 25),
    new("Agus", 17),
    new("Citra", 22),
    new("Dewi", 19),
    new("Eko", 30)
];

// ❌ GAYA IMPERATIF KONVENSIONAL (Panjang & rawan salah alur)
List<string> hasilImperatif = [];
foreach (var c in customers)
{
    if (c.Age > 20)
    {
        hasilImperatif.Add(c.Name.ToUpper());
    }
}
hasilImperatif.Sort();

// ✅ GAYA DEKLARATIF LINQ (Ekspresif, ringkas, mudah dibaca)
var hasilLinq = customers
    .Where(c => c.Age > 20)
    .Select(c => c.Name.ToUpper())
    .Order();
```

Hasil kedua pendekatan identik: `BUDI`, `CITRA`, `EKO`. Namun kode LINQ dapat dibaca seperti kalimat bahasa Inggris bisnis yang jelas dan bebas mutasi variabel lokal.

---

## 2. 🟢 Fondasi Fungsional: Delegates, Func, Action, dan Lambda

### Konsep

LINQ dibangun di atas konsep pemrograman fungsional di mana **fungsi dapat diperlakukan sebagai nilai data** (dapat disimpan dalam variabel, dikirim sebagai argumen, atau dikembalikan dari method).

Di C#, abstraksi ini diwujudkan melalui:
1. **Delegate:** Kontrak *type-safe* untuk method pointer.
2. **`Action<...>`:** Delegate bawaan untuk fungsi tanpa nilai balik (`void`).
3. **`Func<..., TResult>`:** Delegate bawaan untuk fungsi yang mengembalikan nilai `TResult`. Parameter tipe terakhir selalu merupakan tipe return value!
4. **Ekspresi Lambda (`=>`):** Sintaks ringkas untuk membuat fungsi anonim (*anonymous function*).

```text
Parameter  Operator Lambda  Ekspresi / Body
   (x)           =>             x * 2
```

### Parameter Modifiers & Default Values di Lambda Modern

Di C# modern (C# 12-14), ekspresi lambda mendukung parameter default dan modifier tipe (`ref`, `in`):

```csharp
// 1. Func: Menerima int, mengembalikan bool
Func<int, bool> apakahGenap = n => n % 2 == 0;
Console.WriteLine($"Apakah 8 genap? {apakahGenap(8)}");

// 2. Action: Menerima string, tanpa return value (void)
Action<string> cetakPeringatan = pesan => Console.WriteLine($"[ALERT] {pesan}");
cetakPeringatan("Koneksi lambat!");

// 3. Lambda dengan parameter default (C# modern)
var formatMataUang = (decimal nominal, string prefix = "Rp") => $"{prefix}{nominal:N0}";
Console.WriteLine(formatMataUang(50000));         // Rp50,000
Console.WriteLine(formatMataUang(25, "USD $"));   // USD $25
```

Output:
```text
Apakah 8 genap? True
[ALERT] Koneksi lambat!
Rp50,000
USD $25
```

---

## 3. 🟢 Dua Wajah LINQ: Method Syntax vs Query Syntax

### Konsep

C# menyediakan dua cara penulisan kueri LINQ yang ekuivalen secara fungsional:

1. **Method Syntax (Fluent API):** Menggunakan extension method berantai (`.Where()`, `.Select()`, `.OrderBy()`). Ini adalah pendekatan paling populer dan direkomendasikan di kalangan pengembang C# profesional karena mendukung 100% seluruh operator LINQ.
2. **Query Syntax (Comprehension Syntax):** Menggunakan kata kunci mirip bahasa SQL (`from`, `where`, `select`, `orderby`). Sintaks ini sangat elegan saat menangani relasi multi-join yang kompleks.

### Komparasi Sintaksis

```csharp
int[] angka = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 1. Method Syntax (Fluent API)
var genapKuadratMethod = angka
    .Where(x => x % 2 == 0)
    .Select(x => x * x);

// 2. Query Syntax (SQL-like)
var genapKuadratQuery = from x in angka
                        where x % 2 == 0
                        select x * x;
```

> [!NOTE]
> Di balik layar, compiler C# akan selalu menerjemahkan *Query Syntax* menjadi *Method Syntax* sebelum menghasilkan Intermediate Language (IL). Tidak ada perbedaan performa runtime di antara keduanya.

---

## 4. 🟢 Mekanisme Pipeline: Deferred Execution vs Immediate Execution

### Konsep

Memahami perbedaan **Deferred Execution** dan **Immediate Execution** adalah kunci terpenting agar Anda tidak menjadi korban bug performa saat bekerja dengan LINQ.

```text
               DEFINISI KUERI LINQ
        var kueri = data.Where(x => x > 10);
                        │
                        ▼
            DEFERRED EXECUTION (Malas)
      Kueri BELUM DIJALANKAN sama sekali!
      Hanya menyimpan formula / resep kueri.
                        │
       Iterasi / Pemanggilan Greedy Operator
   (foreach, .ToList(), .ToArray(), .Count())
                        │
                        ▼
           IMMEDIATE EXECUTION (Eksekusi)
       Data ditarik dan diproses saat itu juga!
```

1. **Deferred Execution (Lazy Evaluation):** Sebagian besar operator penyaringan dan proyeksi (`Where`, `Select`, `Take`, `Skip`, `OrderBy`) bersifat *lazy*. Kueri tidak dieksekusi saat didefinisikan! Kueri baru berjalan ketika data benar-benar diminta (misal: di dalam perulangan `foreach`).
2. **Immediate Execution (Greedy Operators):** Operator yang memaksa seluruh pipeline kueri dieksekusi saat itu juga dan menghasilkan hasil konkrit di memori. Contoh: `ToList()`, `ToArray()`, `ToDictionary()`, `Count()`, `First()`, `Single()`.

### Bukti Nyata Deferred Execution

```csharp
List<string> namaList = ["Ali", "Budi"];

// Kueri didefinisikan (Belum dieksekusi!)
var kueriFilter = namaList.Where(n => n.Length > 3);

// Menambahkan data baru SETELAH kueri didefinisikan
namaList.Add("Charlie"); // Panjang 7 huruf

// Kueri BARU DIEKSEKUSI di perulangan foreach ini
Console.WriteLine("Hasil iterasi:");
foreach (var nama in kueriFilter)
{
    Console.WriteLine($"- {nama}");
}
```

Output:
```text
Hasil iterasi:
- Charlie
```

Perhatikan bahwa `"Charlie"` ikut tercetak meskipun ditambahkan setelah baris `var kueriFilter = ...`. Ini membuktikan bahwa kueri LINQ bukanlah snapshot data masa lalu, melainkan **saluran pipa pemrosesan data langsung**.

---

## 5. 🟡 Operator Pemfilteran dan Proyeksi: Where, Select, dan SelectMany

### Konsep

Tiga operator fundamental yang paling sering digunakan dalam memproses koleksi data:

1. **`Where(predicate)`:** Menyaring elemen berdasarkan kondisi logika boolean.
2. **`Select(selector)`:** Memproyeksikan atau mentransformasikan setiap elemen menjadi bentuk data lain (misal: mengambil satu properti spesifik atau mengubahnya menjadi ViewModel / DTO baru).
3. **`SelectMany(collectionSelector)`:** Membuka dan meratakan koleksi bersarang (*flattening 1-to-N relationships*). Jika setiap pelanggan memiliki daftar pesanan, `SelectMany` mengubah `List<Customer>` yang memiliki `List<Order>` menjadi satu aliran datar `IEnumerable<Order>`.

### Contoh SelectMany (Flattening Koleksi)

```csharp
record KelasSekolah(string NamaKelas, List<string> DaftarSiswa);

List<KelasSekolah> daftarKelas = [
    new("Kelas 10-A", ["Budi", "Citra"]),
    new("Kelas 10-B", ["Agus", "Dewi", "Eko"])
];

// Perbedaan Select vs SelectMany:
// Select -> Menghasilkan IEnumerable<List<string>> (Daftar di dalam Daftar)
// SelectMany -> Meratakan seluruh siswa menjadi IEnumerable<string> tunggal!
var semuaSiswa = daftarKelas.SelectMany(k => k.DaftarSiswa);

Console.WriteLine("Daftar seluruh siswa gabungan:");
foreach (var siswa in semuaSiswa)
{
    Console.Write($"{siswa} ");
}
Console.WriteLine();
```

Output:
```text
Daftar seluruh siswa gabungan:
Budi Citra Agus Dewi Eko 
```

---

## 6. 🟡 Operator Pengurutan dan Partisi: OrderBy, Chunk, dan Take

### Konsep

Dalam menampilkan data pada antarmuka pengguna atau API, data perlu disortir dan dipaginasi (*pagination*):

1. **`OrderBy()` & `OrderByDescending()`:** Mengurutkan elemen secara *ascending* (A-Z, 0-9) atau *descending*.
2. **`ThenBy()` & `ThenByDescending()`:** Kriteria pengurutan sekunder jika kriteria pertama menghasilkan nilai yang sama.
3. **`Take(count)` & `Skip(count)`:** Mengambil atau melompati $N$ elemen pertama (pola dasar paginasi web: `Skip((page - 1) * pageSize).Take(pageSize)`).
4. **`Chunk(size)` (.NET Modern):** Memecah satu koleksi besar menjadi pecahan batch berukuran tetap. Sangat berguna untuk pengiriman batch database atau bulk API call!

### Contoh Paginasi dan Chunking

```csharp
int[] logIds = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110];

// 1. Paginasi Halaman ke-2 (Ukuran halaman = 3 item)
int pageIndex = 2;
int pageSize = 3;
var pageData = logIds.Skip((pageIndex - 1) * pageSize).Take(pageSize);
Console.WriteLine($"Halaman 2: {string.Join(", ", pageData)}"); // 104, 105, 106

// 2. Pemecahan Batch dengan Chunk (Batching berukuran 4 item)
IEnumerable<int[]> batches = logIds.Chunk(4);
int batchNo = 1;
foreach (var batch in batches)
{
    Console.WriteLine($"Batch #{batchNo++} (Isi {batch.Length}): [{string.Join(", ", batch)}]");
}
```

Output:
```text
Halaman 2: 104, 105, 106
Batch #1 (Isi 4): [101, 102, 103, 104]
Batch #2 (Isi 4): [105, 106, 107, 108]
Batch #3 (Isi 2): [109, 110]
```

---

## 7. 🟡 Operator Pengelompokan dan Himpunan: GroupBy, DistinctBy, dan Set

### Konsep

1. **`GroupBy(keySelector)`:** Mengelompokkan elemen-elemen data berdasarkan nilai kunci tertentu, menghasilkan struktur `IEnumerable<IGrouping<TKey, TElement>>`.
2. **`DistinctBy(keySelector)` (.NET Modern):** Mengeliminasi elemen duplikat berdasarkan properti kunci spesifik tanpa perlu mengimplementasikan `IEqualityComparer<T>` yang rumit!
3. **Operasi Himpunan:** `IntersectBy`, `ExceptBy`, dan `UnionBy`.

### Contoh Pengelompokan dan Deduplikasi

```csharp
record Karyawan(string Nama, string Departemen, decimal Gaji);

List<Karyawan> staf = [
    new("Andi", "IT", 12000000m),
    new("Budi", "HR", 8000000m),
    new("Citra", "IT", 15000000m),
    new("Doni", "Finance", 11000000m),
    new("Elsa", "HR", 9000000m)
];

// 1. Mengelompokkan berdasarkan Departemen
var grupDepartemen = staf.GroupBy(k => k.Departemen);

Console.WriteLine("Ringkasan Departemen:");
foreach (var grup in grupDepartemen)
{
    Console.WriteLine($"
Departemen: {grup.Key} (Total: {grup.Count()} staf)");
    foreach (var k in grup)
    {
        Console.WriteLine($"  - {k.Nama}: Rp{k.Gaji:N0}");
    }
}

// 2. Mengambil satu perwakilan pertama dari setiap departemen (DistinctBy)
var perwakilanDept = staf.DistinctBy(k => k.Departemen);
Console.WriteLine("
Perwakilan tiap departemen: " + string.Join(", ", perwakilanDept.Select(k => k.Nama)));
```

Output:
```text
Ringkasan Departemen:

Departemen: IT (Total: 2 staf)
  - Andi: Rp12,000,000
  - Citra: Rp15,000,000

Departemen: HR (Total: 2 staf)
  - Budi: Rp8,000,000
  - Elsa: Rp9,000,000

Departemen: Finance (Total: 1 staf)
  - Doni: Rp11,000,000

Perwakilan tiap departemen: Andi, Budi, Doni
```

---

## 8. 🟡 Operator Agregasi: Count, Sum, Min, Max, dan Aggregate

### Konsep

Operator agregasi mereduksi sekumpulan data menjadi satu nilai skalar tunggal:
* `Count()`: Menghitung total elemen (atau elemen yang memenuhi predicate).
* `Sum()`, `Average()`: Menghitung jumlah total dan rata-rata numerik.
* `Min()`, `Max()`, `MinBy()`, `MaxBy()`: Menemukan nilai ekstrem atau objek dengan properti paling ekstrem.
* **`Aggregate(accumulator)`:** Operator reduksi serbaguna (*fold/reduce*) untuk melakukan kalkulasi akumulatif kustom.

### Contoh Agregasi Kompleks

```csharp
decimal[] belanjaan = [150000m, 350000m, 80000m, 500000m];

// Agregasi standar
decimal totalBelanja = belanjaan.Sum();
decimal rataRata     = belanjaan.Average();

Console.WriteLine($"Total: Rp{totalBelanja:N0}, Rata-rata: Rp{rataRata:N0}");

// Menggunakan Aggregate untuk menghitung saldo dengan diskon progresif bertingkat
// Rumus: SaldoAwal + (Item * PPN 1.11)
decimal totalSetelahPajak = belanjaan.Aggregate(0m, (total, item) => total + (item * 1.11m));
Console.WriteLine($"Total + PPN 11%: Rp{totalSetelahPajak:N0}");
```

Output:
```text
Total: Rp1,080,000, Rata-rata: Rp270,000
Total + PPN 11%: Rp1,198,800
```

---

## 9. 🟡 Operator Penggabungan: Join dan GroupJoin

### Konsep

Ketika Anda memiliki dua koleksi independen yang memiliki relasi melalui kunci bersama (*foreign key*):

1. **`Join()` (Inner Join):** Mencocokkan elemen dari koleksi kiri dan kanan yang kuncinya sama. Elemen yang tidak memiliki pasangan akan dibuang.
2. **`GroupJoin()` (Left Outer / Hierarchical Join):** Memasangkan setiap elemen kiri dengan sekumpulan elemen kanan yang cocok (menghasilkan relasi 1-ke-banyak induk-anak).

### Contoh Inner Join

```csharp
record Kategori(int Id, string Nama);
record Produk(string NamaProduk, int KategoriId);

List<Kategori> masterKategori = [
    new(1, "Elektronik"),
    new(2, "Pakaian")
];

List<Produk> masterProduk = [
    new("Laptop Gaming", 1),
    new("Mouse Wireless", 1),
    new("Kemeja Flanel", 2)
];

// Inner Join antara Produk dan Kategori
var hasilJoin = masterProduk.Join(
    masterKategori,
    produk => produk.KategoriId,   // Kunci koleksi pertama
    kategori => kategori.Id,        // Kunci koleksi kedua
    (p, k) => new { p.NamaProduk, Kategori = k.Nama } // Proyeksi hasil gabungan
);

foreach (var item in hasilJoin)
{
    Console.WriteLine($"* {item.NamaProduk} -> Kategori: {item.Kategori}");
}
```

Output:
```text
* Laptop Gaming -> Kategori: Elektronik
* Mouse Wireless -> Kategori: Elektronik
* Kemeja Flanel -> Kategori: Pakaian
```

---

## 10. 🔴 Multiple Enumeration Trap dan Cara Menghindarinya

### Konsep

Salah satu jebakan performa paling fatal pada aplikasi C# produksi adalah **Multiple Enumeration**.

Karena pipeline LINQ dengan `IEnumerable<T>` bersifat *lazy* (dieksekusi ulang setiap kali diiterasi), jika Anda memanggil operator terminal berkali-kali pada variabel `IEnumerable<T>` yang sama, seluruh kueri beserta kalkulasi beratnya akan diulang dari awal berkali-kali!

### Ilustrasi Masalah

```csharp
// ❌ CONTOH BERBAHAYA: Multiple Enumeration
public static void ProsesData(IEnumerable<int> kueriBerat)
{
    // Eksekusi #1: Menghitung total data
    if (kueriBerat.Any())
    {
        // Eksekusi #2: Mengambil elemen pertama
        Console.WriteLine($"Data pertama: {kueriBerat.First()}");

        // Eksekusi #3: Menghitung jumlah total
        Console.WriteLine($"Jumlah data: {kueriBerat.Count()}");

        // Eksekusi #4: Melakukan perulangan
        foreach (var item in kueriBerat) { /*...*/ }
    }
}
```

Jika `kueriBerat` berasal dari panggilan database (EF Core) atau parsing file CSV berukuran 500 MB, kode di atas akan melakukan **4 kali kueri ke database atau 4 kali pembacaan file ulang!**

### Solusi Standar Arsitektur

Jika Anda perlu menggunakan data hasil kueri lebih dari satu kali, segera materialisasikan kueri tersebut ke dalam memori menggunakan `.ToList()` atau `.ToArray()`:

```csharp
// ✅ SOLUSI BENAR: Materialisasi Sekali di Memori
public static void ProsesDataAman(IEnumerable<int> kueriBerat)
{
    // Hanya dieksekusi 1 kali ke sumber data!
    List<int> dataTersimpan = kueriBerat.ToList();

    if (dataTersimpan.Count > 0)
    {
        Console.WriteLine($"Data pertama: {dataTersimpan[0]}");
        Console.WriteLine($"Jumlah data: {dataTersimpan.Count}");
        foreach (var item in dataTersimpan) { /* aman dan secepat kilat */ }
    }
}
```

---

## 11. 🔴 IEnumerable vs IQueryable: Rahasia Eksekusi Database EF Core

### Konsep

Banyak pemula kebingungan mengapa Entity Framework Core (ORM database .NET) menggunakan `IQueryable<T>` alih-alih `IEnumerable<T>`.

Perbedaan keduanya sangat masif:

| Karakteristik | `IEnumerable<T>` (LINQ to Objects) | `IQueryable<T>` (LINQ to Providers / EF Core) |
|---|---|---|
| **Eksekusi** | Di dalam memori RAM aplikasi | Di server eksternal (Database SQL / Server API) |
| **Bentuk Lambda** | Menerima kompilasi kode IL (`Func<T, bool>`) | Menerima pohon ekspresi (`Expression<Func<T, bool>>`) |
| **Filtering `Where`** | Seluruh data ditarik dulu ke RAM, baru disaring | Diterjemahkan menjadi klausa `WHERE` pada perintah SQL |

### Mental Model Eksekusi Database

```text
Kasus: Tabel Pengguna berisi 5.000.000 baris. Anda mencari pengguna dengan ID = 88.

1. Pendekatan Salah (IEnumerable):
   db.Users.AsEnumerable().Where(u => u.Id == 88).FirstOrDefault();
   
   Alur:
   [Database] ──── Kirim 5.000.000 Baris (Gigabytes Data) ────> [Aplikasi RAM]
   Aplikasi menyaring di memori. Server Crash akibat OutOfMemoryException!

2. Pendekatan Benar (IQueryable):
   db.Users.Where(u => u.Id == 88).FirstOrDefault();
   
   Alur:
   [Aplikasi] ──── Mengirim Perintah SQL: "SELECT TOP 1 * FROM Users WHERE Id = 88" ────> [Database]
   [Database] ──── Hanya mengembalikan 1 baris saja! ────> [Aplikasi RAM]
```

> [!IMPORTANT]
> Jangan pernah memanggil `.AsEnumerable()`, `.ToList()`, atau `.ToArray()` sebelum klausa `.Where()` atau `.Take()` saat berinteraksi dengan database via Entity Framework Core!

---

## 12. 🔴 Cara Kerja Internal: yield return dan Compiler State Machine

### Konsep

Bagaimana LINQ mengimplementasikan *Deferred Execution*? Jawabannya terletak pada konstruksi compiler yang luar biasa: kata kunci **`yield return`**.

Ketika sebuah method mengembalikan `IEnumerable<T>` dan menggunakan `yield return`, compiler C# tidak mengeksekusi method tersebut dari awal hingga akhir seperti fungsi biasa. Compiler secara otomatis membuatkan sebuah **Class State Machine tersembunyi** yang mengimplementasikan `IEnumerator<T>`.

### Simulasi Generator Kustom

```csharp
public static class CustomLinqGenerator
{
    // Method ini tidak langsung berjalan saat dipanggil!
    public static IEnumerable<int> HasilkanAngkaGenap(int batasMaksimum)
    {
        Console.WriteLine("-> [State Machine Dimulai]");
        for (int i = 1; i <= batasMaksimum; i++)
        {
            if (i % 2 == 0)
            {
                Console.WriteLine($"-> [Yielding data: {i}]");
                yield return i; // Eksekusi jeda di sini, menyerahkan kendali ke pemanggil!
                Console.WriteLine($"-> [Melanjutkan pencarian setelah: {i}]");
            }
        }
        Console.WriteLine("-> [State Machine Selesai]");
    }
}

// Konsumen hanya meminta 1 data pertama saja!
var generator = CustomLinqGenerator.HasilkanAngkaGenap(100);
Console.WriteLine("Memanggil Take(1):");
var angkaPertama = generator.Take(1).First();
Console.WriteLine($"Angka didapat: {angkaPertama}");
```

Output:
```text
Memanggil Take(1):
-> [State Machine Dimulai]
-> [Yielding data: 2]
Angka didapat: 2
```

Perhatikan bahwa loop berhenti seketika di angka 2! Angka 3 hingga 100 **tidak pernah diproses sama sekali**. Inilah efisiensi spektakuler dari *lazy evaluation pipeline*.

---

## 13. 🔴 Fitur C# 14: Extension Members Block untuk LINQ

### Konsep Evolusi di C# 14

Selama lebih dari satu dekade sejak C# 3.0, *Extension Methods* harus dideklarasikan sebagai method statis di dalam kelas statis yang canggung:

```csharp
// SINTAKSIS LAMA (Sebelum C# 14)
public static class EnumerableExtensions
{
    public static decimal Median(this IEnumerable<decimal> source)
    {
        // implementasi
    }
}
```

Di C# 14, .NET mengeksplorasi sintaksis deklaratif modern: **Extension Members block (`extension Name for Type`)**. Sintaksis ini dirancang untuk memungkinkan perluasan tipe target tidak hanya dengan methods, tetapi juga properties dan operator secara deklaratif dalam satu kesatuan blok namespace.

> [!NOTE]
> **Status Fitur & Standar Produksi Saat Ini:**  
> Sintaksis *Extension Members* adalah proposal evolusi desain bahasa C# 14.  
> Untuk aplikasi enterprise produksi berbasis .NET 8 LTS (C# 12) atau .NET 9 saat ini, **Extension Methods tradisional berbasis `public static class` dengan parameter `this`** tetap merupakan standar industri mutlak yang wajib Anda kuasai karena didukung 100% di semua versi C#.

### 1. Standar Universal: Extension Methods Tradisional (C# 3.0 s/d C# 13)

```csharp
public static class LinqFinanceExtensions
{
    public static decimal TrimmedAverage(this IEnumerable<decimal> source, decimal persentasePangkas = 0.1m)
    {
        var list = source.Order().ToList();
        if (list.Count == 0) return 0m;

        int jumlahPangkas = (int)(list.Count * persentasePangkas);
        var dataValid = list.Skip(jumlahPangkas).Take(list.Count - (jumlahPangkas * 2));

        return dataValid.Any() ? dataValid.Average() : 0m;
    }
}
```

### 2. Sintaksis Eksploratif C# 14: Extension Members Block

```csharp
// Sintaksis Extension Members C# 14 (.NET 10 LTS)
public static extension LinqFinanceExtensions for IEnumerable<decimal>
{
    // Menambahkan method ekstensi penghitungan Nilai Rata-rata Terpangkas (Trimmed Mean)
    public decimal TrimmedAverage(decimal persentasePangkas = 0.1m)
    {
        var list = this.Order().ToList();
        if (list.Count == 0) return 0m;

        int jumlahPangkas = (int)(list.Count * persentasePangkas);
        var dataValid = list.Skip(jumlahPangkas).Take(list.Count - (jumlahPangkas * 2));

        return dataValid.Any() ? dataValid.Average() : 0m;
    }
}

// Penggunaan langsung seperti method bawaan LINQ resmi:
List<decimal> dataSensitif = [10m, 12m, 11m, 14m, 1000m /* outlier */];
decimal rataRataAman = dataSensitif.TrimmedAverage(0.2m);
Console.WriteLine($"Rata-rata Terpangkas: {rataRataAman:N1}");
```

---

## 14. 🛠️ Best Practice Performa LINQ

### 1. Gunakan `Any()` Alih-alih `Count() > 0`
```csharp
// ❌ BURUK: Menghitung seluruh elemen hingga akhir koleksi (Beban O(N))
if (daftarPelanggan.Count() > 0) { ... }

// ✅ BAIK: Berhenti seketika saat menemukan elemen pertama (Beban O(1))
if (daftarPelanggan.Any()) { ... }
```

### 2. Hindari Alokasi Closure yang Tidak Perlu di Perulangan Ketat
Setiap kali ekspresi lambda menangkap variabel lokal di luarnya (*capturing closure*), compiler mengalokasikan objek pembungkus di Managed Heap:
```csharp
// ❌ Memicu alokasi objek closure di setiap iterasi
for (int i = 0; i < 100000; i++)
{
    int ambangBatas = i;
    var valid = items.Where(x => x.Nilai > ambangBatas);
}
```

### 3. Gunakan `Count` Property Jika Tipe Asli Mendukungnya
Jika koleksi Anda bertipe `List<T>` atau `T[]`, akses properti `.Count` atau `.Length` alih-alih memanggil extension method `.Count()` dari LINQ. Properti dieksekusi instan $O(1)$ tanpa overhead *interface dispatch*.

---

## 15. 🛠️ Kesalahan Umum Pemula

### 1. Memanggil `First()` Tanpa Validasi Keberadaan Data

❌ **Salah:**
```csharp
var user = users.First(u => u.Email == inputEmail); // CRASH! InvalidOperationException jika email tidak ada
```

✅ **Benar:**
Gunakan `FirstOrDefault()` dengan null-check atau nilai default:
```csharp
var user = users.FirstOrDefault(u => u.Email == inputEmail);
if (user is not null)
{
    // Proses user
}
```

---

### 2. Membingungkan `SingleOrDefault()` dengan `FirstOrDefault()`

* `FirstOrDefault()`: Mengambil elemen pertama yang cocok dan **langsung berhenti**.
* `SingleOrDefault()`: Memeriksa **seluruh koleksi** untuk memastikan hanya ada tepat SATU elemen yang cocok. Jika ada 2 elemen yang memenuhi kriteria, `SingleOrDefault()` akan melempar exception!

Gunakan `SingleOrDefault()` hanya jika duplikasi adalah pelanggaran integritas data fatal.

---

## 16. 🛠️ Mini Project: Financial Ledger & Fraud Anomaly Detection Engine

### Tujuan

Membangun mesin deteksi transaksi mencurigakan (*Fraud & Anomaly Detection Pipeline*) pada perbankan menggunakan kekuatan fungsional LINQ:
1. Memfilter transaksi bernilai ekstrem di atas ambang batas normal.
2. Mengelompokkan transaksi berdasarkan rekening asal menggunakan `GroupBy`.
3. Mendeteksi anomali lonjakan frekuensi transaksi mencurigakan (*velocity fraud*) menggunakan partisi `Chunk`.
4. Menghitung total paparan risiko keuangan menggunakan `Aggregate`.

### Implementasi Lengkap (C# 14 / .NET 10 LTS)

```csharp
using System;
using System.Collections.Generic;
using System.Linq;

namespace FraudDetectionEngine;

// Tipe Data Transaksi Finansial
public enum KategoriTransaksi { Belanja, TarikTunai, TransferAntarBank, Kripto }

public readonly record struct TransaksiBank(
    string IdTransaksi,
    string NomorRekening,
    decimal Nominal,
    KategoriTransaksi Kategori,
    DateTime WaktuTransaksi
);

// Hasil Analisis Risiko Rekening
public sealed record LaporanRisikoRekening(
    string NomorRekening,
    int TotalTransaksi,
    decimal TotalNominal,
    decimal NominalTertinggi,
    bool TerindikasiFraud
);

public static class MesinDeteksiAnomali
{
    public static void Main()
    {
        Console.WriteLine("=== SISTEM DETEKSI FRAUD TRANSAKSI FINANSIAL (LINQ ENGINE) ===
");

        // Dataset Simulasi Transaksi
        List<TransaksiBank> logTransaksi = [
            new("TRX-01", "REK-1001", 500000m,    KategoriTransaksi.Belanja, DateTime.UtcNow.AddMinutes(-50)),
            new("TRX-02", "REK-1002", 15000000m,  KategoriTransaksi.TransferAntarBank, DateTime.UtcNow.AddMinutes(-40)),
            new("TRX-03", "REK-1001", 850000m,    KategoriTransaksi.TarikTunai, DateTime.UtcNow.AddMinutes(-30)),
            new("TRX-04", "REK-1003", 45000000m,  KategoriTransaksi.Kripto, DateTime.UtcNow.AddMinutes(-25)),
            new("TRX-05", "REK-1003", 55000000m,  KategoriTransaksi.Kripto, DateTime.UtcNow.AddMinutes(-20)),
            new("TRX-06", "REK-1003", 60000000m,  KategoriTransaksi.TransferAntarBank, DateTime.UtcNow.AddMinutes(-15)),
            new("TRX-07", "REK-1002", 200000m,    KategoriTransaksi.Belanja, DateTime.UtcNow.AddMinutes(-10)),
            new("TRX-08", "REK-1001", 1200000m,   KategoriTransaksi.Belanja, DateTime.UtcNow.AddMinutes(-5))
        ];

        // 1. LINQ PIPELINE: Deteksi Transaksi Bernilai Sangat Tinggi (> Rp40 Juta)
        Console.WriteLine("--- 1. Transaksi Kategori Berisiko Tinggi (Nominal > Rp40 Juta) ---");
        var transaksiBerisikoTinggi = logTransaksi
            .Where(t => t.Nominal >= 40000000m)
            .OrderByDescending(t => t.Nominal)
            .Select(t => new { t.IdTransaksi, t.NomorRekening, t.Nominal, t.Kategori });

        foreach (var item in transaksiBerisikoTinggi)
        {
            Console.WriteLine($"[ALERT TINGGI] {item.IdTransaksi} | Rekening: {item.NomorRekening} | Rp{item.Nominal:N0} ({item.Kategori})");
        }

        // 2. LINQ PIPELINE: Pengelompokan dan Profiling Risiko Tiap Rekening
        Console.WriteLine("
--- 2. Profiling Aktivitas Rekening (GroupBy & Agregasi) ---");
        var profilRekening = logTransaksi
            .GroupBy(t => t.NomorRekening)
            .Select(group => {
                decimal total = group.Sum(t => t.Nominal);
                decimal tertinggi = group.Max(t => t.Nominal);
                int count = group.Count();
                
                // Aturan Bisnis Fraud: Total transaksi > Rp100 Juta ATAU ada transaksi Kripto > Rp50 Juta
                bool isFraud = total >= 100000000m || group.Any(t => t.Kategori == KategoriTransaksi.Kripto && t.Nominal >= 50000000m);

                return new LaporanRisikoRekening(group.Key, count, total, tertinggi, isFraud);
            })
            .OrderByDescending(r => r.TotalNominal);

        foreach (var laporan in profilRekening)
        {
            string status = laporan.TerindikasiFraud ? "🚨 BAHAYA (BLOKIR SEGERA)" : "✅ NORMAL";
            Console.WriteLine($"Rekening: {laporan.NomorRekening}");
            Console.WriteLine($"  - Total Transaksi: {laporan.TotalTransaksi} transaksi");
            Console.WriteLine($"  - Total Volume   : Rp{laporan.TotalNominal:N0}");
            Console.WriteLine($"  - Nominal Puncak : Rp{laporan.NominalTertinggi:N0}");
            Console.WriteLine($"  - Status Audit   : {status}
");
        }

        // 3. LINQ PIPELINE: Akumulasi Total Paparan Risiko Seluruh Sistem (Aggregate)
        decimal totalPaparanFraud = profilRekening
            .Where(r => r.TerindikasiFraud)
            .Aggregate(0m, (akumulator, rek) => akumulator + rek.TotalNominal);

        Console.WriteLine($"--- TOTAL DANA DALAM RISIKO ANOMALI: Rp{totalPaparanFraud:N0} ---");
    }
}
```

### Hasil Eksekusi

```text
=== SISTEM DETEKSI FRAUD TRANSAKSI FINANSIAL (LINQ ENGINE) ===

--- 1. Transaksi Kategori Berisiko Tinggi (Nominal > Rp40 Juta) ---
[ALERT TINGGI] TRX-06 | Rekening: REK-1003 | Rp60,000,000 (TransferAntarBank)
[ALERT TINGGI] TRX-05 | Rekening: REK-1003 | Rp55,000,000 (Kripto)
[ALERT TINGGI] TRX-04 | Rekening: REK-1003 | Rp45,000,000 (Kripto)

--- 2. Profiling Aktivitas Rekening (GroupBy & Agregasi) ---
Rekening: REK-1003
  - Total Transaksi: 3 transaksi
  - Total Volume   : Rp160,000,000
  - Nominal Puncak : Rp60,000,000
  - Status Audit   : 🚨 BAHAYA (BLOKIR SEGERA)

Rekening: REK-1002
  - Total Transaksi: 2 transaksi
  - Total Volume   : Rp15,200,000
  - Nominal Puncak : Rp15,000,000
  - Status Audit   : ✅ NORMAL

Rekening: REK-1001
  - Total Transaksi: 3 transaksi
  - Total Volume   : Rp2,550,000
  - Nominal Puncak : Rp1,200,000
  - Status Audit   : ✅ NORMAL

--- TOTAL DANA DALAM RISIKO ANOMALI: Rp160,000,000 ---
```

---

## 17. 📚 Peta Ingatan

```text
LINQ Execution Landscape
├── Execution Models
│   ├── Deferred Execution (Lazy)   -> Where, Select, OrderBy, Take, Chunk
│   │   └── State Machine           -> yield return
│   └── Immediate Execution (Greedy)-> ToList, ToArray, Count, Any, Aggregate
├── In-Memory vs Database
│   ├── IEnumerable<T>              -> Di RAM aplikasi via Func<T, bool>
│   └── IQueryable<T>               -> Di Database via SQL Expression Trees
├── Essential Operators
│   ├── Filtering & Slicing         -> Where, Take, Skip, Chunk, DistinctBy
│   ├── Transformation              -> Select (1:1), SelectMany (1:N Flatten)
│   ├── Grouping & Join             -> GroupBy, Join, GroupJoin
│   └── Aggregation                 -> Any, Count, Sum, MinBy, MaxBy, Aggregate
└── Modern C# 14
    └── Extension Members block     -> extension Name for IEnumerable<T>
```

---

## 18. 📚 Cheat Code 10 Detik

```text
Where(p)                   -> menyaring data berdasarkan kondisi
Select(f)                  -> memproyeksikan data ke bentuk/tipe baru
SelectMany(f)              -> meratakan koleksi bersarang menjadi satu aliran datar
OrderBy(k) / Order()       -> mengurutkan data ascending
Take(N) / Skip(N)          -> paginasi data
Chunk(N)                   -> memecah koleksi menjadi array batch berukuran N
GroupBy(k)                 -> mengelompokkan data berdasarkan kunci
Any() / Any(p)             -> mengecek keberadaan data (O(1) optimal)
FirstOrDefault()           -> mengambil 1 item pertama atau default jika kosong
ToList() / ToArray()       -> materialisasi immediate execution ke memori RAM
Aggregate(seed, func)      -> akumulasi reduksi kustom (fold/reduce)
```

---

## 19. 🧭 Urutan Belajar Berikutnya

Kuasai pilar terakhir pemrograman C# tingkat lanjut sebelum melangkah ke framework backend ASP.NET Core:

1. **Lanjutkan ke [[csharp-async-threading|C# Asynchronous & Concurrency]] (Modul 6):**
   * Pahami Task-based Asynchronous Pattern (TAP) menggunakan `async` dan `await`.
   * Pahami perbedaan kritis antara `Task` dan `ValueTask` untuk alokasi memori nol.
   * Kuasai standar pembatalan operasi via `CancellationToken`.
   * Pelajari stream asinkronus menggunakan `IAsyncEnumerable<T>`.
   * Sinkronisasi modern thread-safety menggunakan fitur C# 13/14: **`System.Threading.Lock`**.

---

## 20. 🔗 Referensi Resmi

* [LINQ (Language Integrated Query) Documentation - Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/csharp/linq/)
* [Standard Query Operators Overview - .NET Guide](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/standard-query-operators-overview)
* [Avoid Multiple Enumeration of IEnumerable - Microsoft Architecture](https://learn.microsoft.com/en-us/dotnet/fundamentals/code-analysis/quality-rules/ca1851)
* [Extension Members Feature Specification - C# 14 Language Design](https://github.com/dotnet/csharplang/issues/54)
