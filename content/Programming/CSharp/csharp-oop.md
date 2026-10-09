---
title: "C# OOP"
description: "Object-Oriented Programming modern dengan C# 14 & .NET 10 LTS: 4 pilar OOP, Primary Constructors, Field-Backed Properties (field), Records, Structs, dan Interfaces."
order: 2
tags:
  - programming
  - csharp
  - dotnet
  - oop
  - intermediate
---

# C# OOP

> **Target:** Pemula yang telah memahami dasar C# dan ingin menguasai arsitektur **Object-Oriented Programming (OOP)** modern dengan **C# 14 & .NET 10 (LTS)**.  
> **Versi:** C# 14 / .NET 10 (LTS)  
> **Prasyarat:** [[csharp-dasar|C# Dasar]]  
> Fokus modul pembelajaran ini: **mental model objek & heap → class, properties (init, field-backed C# 14) & primary constructors → encapsulation & access modifiers → inheritance & base → polymorphism (virtual/override vs new) → abstract class & interfaces → structs (value types & memory) → record class & record struct (with expression) → sealed & static classes → exception hierarchy & custom exceptions → resource cleanup (IDisposable & using) → mini project payment gateway CLI**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami untuk membangun struktur class, enkapsulasi data, properties, dan primary constructors

🟡 Lanjutan
→ pelajari setelah menguasai class dasar: pewarisan, polimorfisme (virtual vs new), abstraksi, interface, dan structs

🔴 Advanced / Operasional
→ penting untuk arsitektur enterprise: record immutability, exception hierarchy, IDisposable resource cleanup, dan GC lifecycle
```

Mental model alur instansiasi dan relasi objek di C# (.NET CLR):

```text
          Source Code Class (.cs)
                     │
                     ▼
          Kompilasi Roslyn (CIL)
                     │
                     ▼
         CLR Type Loader & Metadata
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
     Stack Memory          Heap Memory
(Variabel Pointer Ref)  (Instance Objek Nyata)
   [Customer cust]  ──> [Field / State / VTable]
          │                     │
          └──────────┬──────────┘
                     │
                     ▼
     Dynamic Virtual Method Dispatch
     & Garbage Collection (Gen 0/1/2)
```

**Hafalan:**

```text
Class        → cetak biru (blueprint) yang mendefinisikan struktur data (state) dan fungsi operasi (behavior)
Object       → wujud konkret (instance) dari class yang dialokasikan di Heap Memory
Encapsulation→ membungkus data internal dan membatasi akses melalui getter/setter atau properties
Inheritance  → mewariskan atribut dan method dari parent class ke child class via tanda titik dua (:)
Polymorphism → kemampuan objek untuk mengekspresikan perilaku berbeda melalui overriding method virtual
Abstraction  → menyembunyikan detail kerumitan internal dan hanya mengekspos antarmuka esensial
Primary Ctor → sintaks ringkas C# 12-14 mendefinisikan constructor langsung di nama class
Field Keyword→ fitur C# 14 untuk mengakses backing field otomatis di dalam property tanpa variabel privat manual
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan OOP & 4 Pilar Utama](#1--pengenalan-oop--4-pilar-utama)
2. [Class & Object (Mental Model Cetak Biru vs Instance Memori)](#2--class--object-mental-model-cetak-biru-vs-instance-memori)
3. [Fields & Auto-Implemented Properties Modern](#3--fields--auto-implemented-properties-modern)
4. [Field-Backed Properties dengan Keyword field (C# 14)](#4--field-backed-properties-dengan-keyword-field-c-14)
5. [Property init Accessor & Immutability Objek](#5--property-init-accessor--immutability-objek)
6. [Constructor Tradisional & Constructor Chaining (this)](#6--constructor-tradisional--constructor-chaining-this)
7. [Primary Constructors Modern pada Class](#7--primary-constructors-modern-pada-class)
8. [Modifier Akses (Access Modifiers Lengkap)](#8--modifier-akses-access-modifiers-lengkap)
9. [Enkapsulasi & Proteksi State Objek](#9--enkapsulasi--proteksi-state-objek)

### 🟡 Lanjutan

10. [Inheritance / Pewarisan (:) & Keyword base](#10--inheritance--pewarisan---keyword-base)
11. [Method Overriding (virtual & override)](#11--method-overriding-virtual--override)
12. [Method Hiding (new Keyword) vs Overriding](#12--method-hiding-new-keyword-vs-overriding)
13. [Polymorphism (Polimorfisme & Dynamic Dispatch)](#13--polymorphism-polimorfisme--dynamic-dispatch)
14. [Type Casting Objek & Pattern Matching (is / as)](#14--type-casting-objek--pattern-matching-is--as)
15. [Abstract Class & Abstract Method](#15--abstract-class--abstract-method)
16. [Interface Dasar & Multiple Implementation](#16--interface-dasar--multiple-implementation)
17. [Interface Inheritance & Default Interface Methods](#17--interface-inheritance--default-interface-methods)
18. [Explicit Interface Implementation](#18--explicit-interface-implementation)
19. [Structs (Value Types & Alokasi Hemat Memori)](#19--structs-value-types--alokasi-hemat-memori)

### 🔴 Advanced / Operasional

20. [Record Types (record class & record struct)](#20--record-types-record-class--record-struct)
21. [Mutasi Non-Destruktif pada Record dengan Keyword with](#21--mutasi-non-destruktif-pada-record-dengan-keyword-with)
22. [Static Class & Static Members](#22--static-class--static-members)
23. [Sealed Class & Sealed Methods](#23--sealed-class--sealed-methods)
24. [Hierarchy Exception di .NET & Custom Exception Class](#24--hierarchy-exception-di-net--custom-exception-class)
25. [Manajemen Resource Otomatis dengan IDisposable & using](#25--manajemen-resource-otomatis-dengan-idisposable--using)
26. [Garbage Collection & Siklus Hidup Objek (Gen 0, 1, 2)](#26--garbage-collection--siklus-hidup-objek-gen-0-1-2)

### 🛠️ Referensi & Praktik

27. [Peta Ingatan Cepat](#27-️-peta-ingatan-cepat)
28. [Tabel Ringkasan](#28--tabel-ringkasan)
29. [Cheat Code C# OOP 10 Detik](#29--cheat-code-c-oop-10-detik)
30. [Urutan Belajar yang Disarankan](#30--urutan-belajar-yang-disarankan)
31. [Mini Project: Sistem Payment Gateway & Transaksi E-Commerce CLI](#31-️-mini-project-sistem-payment-gateway--transaksi-e-commerce-cli)
32. [Referensi Resmi](#32--referensi-resmi)

---

## 1. 🟢 Pengenalan OOP & 4 Pilar Utama

#### Konsep

**Object-Oriented Programming (OOP)** adalah paradigma pemrograman yang memodelkan dunia nyata ke dalam unit perangkat lunak yang disebut **Object**. Objek menggabungkan data status (**State / Properties**) dan fungsionalitas perilaku (**Behavior / Methods**).

Empat pilar utama arsitektur OOP di C#:
1. **Encapsulation (Enkapsulasi):** Membungkus data internal dan membatasi modifikasi liar dari luar menggunakan access modifier dan properties.
2. **Inheritance (Pewarisan):** Membentuk hierarki class di mana class turunan (*child class*) mewarisi kapabilitas dari class induk (*parent class*).
3. **Polymorphism (Polimorfisme):** Kemampuan antarmuka atau parent class untuk mengeksekusi perilaku yang berbeda sesuai objek konkret yang menjalankannya saat runtime.
4. **Abstraction (Abstraksi):** Menyembunyikan kerumitan teknis implementasi dan hanya menyajikan antarmuka penting bagi pemanggil (*interface* / *abstract class*).

---

## 2. 🟢 Class & Object (Mental Model Cetak Biru vs Instance Memori)

#### Konsep

- **Class:** Cetak biru (*blueprint*) tipe data yang didefinisikan oleh programmer. Class belum memakan ruang memori untuk data sebelum diinstansiasi.
- **Object / Instance:** Entitas konkret yang dicetak dari class menggunakan kata kunci **`new`**. Objek dialokasikan di **Heap Memory**, dan alamat memorinya disimpan pada variabel referensi di **Stack Memory**.

#### Contoh

```csharp
// 1. Definisi Class (Cetak Biru)
public class RekeningBank
{
    public string NomorRekening = "";
    public string Pemilik = "";
    public decimal Saldo;

    public void Setor(decimal nominal)
    {
        Saldo += nominal;
        Console.WriteLine($"Berhasil setor Rp {nominal:N0}. Saldo sekarang: Rp {Saldo:N0}");
    }
}

// 2. Pembuatan Objek Nyata (Instance di Heap)
RekeningBank rekBudi = new RekeningBank();
rekBudi.NomorRekening = "REK-1001";
rekBudi.Pemilik = "Budi Santoso";
rekBudi.Saldo = 500_000m;

rekBudi.Setor(250_000m);
```

#### Output

```text
Berhasil setor Rp 250,000. Saldo sekarang: Rp 750,000
```

**Hafalan:**

```text
Class  → template blueprint kode
Object → wujud instance nyata di Heap Memory via keyword new
```

---

## 3. 🟢 Fields & Auto-Implemented Properties Modern

#### Konsep

Di C#, akses data tidak dianjurkan menggunakan variabel publik (*public field*). C# menyediakan **Properties** yang menggabungkan kemudahan sintaks field dengan fleksibilitas method getter dan setter:
- **Auto-Implemented Properties (`{ get; set; }`):** Kompiler Roslyn otomatis membuatkan variabel privat tersembunyi (*backing field*) di balik layar.
- **Read-Only Properties (`{ get; }`):** Nilai hanya bisa diisi saat deklarasi awal atau di dalam constructor.

#### Contoh

```csharp
public class Produk
{
    // Auto-implemented properties
    public string Sku { get; set; }
    public string Nama { get; set; }
    public decimal Harga { get; set; }

    // Read-only property hasil kalkulasi
    public bool IsProdukMahal => Harga >= 10_000_000m;

    public Produk(string sku, string nama, decimal harga)
    {
        Sku = sku;
        Nama = nama;
        Harga = harga;
    }
}

Produk p = new Produk("LAP-01", "Laptop Gaming", 15_000_000m);
Console.WriteLine($"Produk: {p.Nama} | Mahal? {p.IsProdukMahal}");
```

#### Output

```text
Produk: Laptop Gaming | Mahal? True
```

**Hafalan:**

```text
public type Prop { get; set; } → auto-implemented property modern
public type Prop => expression  → expression-bodied read-only property
```

---

## 4. 🟢 Field-Backed Properties dengan Keyword field (C# 14)

#### Konsep

Sebelum C# 14, jika kita ingin menambahkan validasi logika pada setter, kita **terpaksa membuat private field manual**:
```csharp
// SINTAKS LAMA (C# 13 ke bawah - Boilerplate)
private string _nama;
public string Nama
{
    get => _nama;
    set => _nama = !string.IsNullOrWhiteSpace(value) ? value : throw new ArgumentException();
}
```

**Di C# 14 (.NET 10 LTS)**, diperkenalkan fitur **Field-Backed Properties**:
- Anda dapat menyisipkan logika validasi pada accessor `set` atau `get` menggunakan keyword kontekstual baru: **`field`**.
- Kompiler Roslyn otomatis menghasilkan dan mengelola backing field secara transparan tanpa Anda perlu mendeklarasikan `_nama` secara manual!

#### Contoh

```csharp
public class UserAccount
{
    public string Username { get; set; } = "";

    // ✅ FITUR BARU C# 14: Validasi setter langsung menggunakan keyword 'field'
    public string Email
    {
        get => field;
        set => field = value.Contains('@') 
            ? value.Trim().ToLower() 
            : throw new ArgumentException("Format alamat email tidak valid!");
    }

    // Mengontrol nilai default dan validasi saldo
    public decimal Saldo
    {
        get => field;
        set => field = value >= 0 
            ? value 
            : throw new ArgumentException("Saldo tidak boleh bernilai negatif!");
    } = 100_000m; // Inisialisasi default
}

UserAccount user = new UserAccount();
user.Email = "  Budi.Dev@Gmail.COM  ";
Console.WriteLine($"Email ternormalisasi: {user.Email}");
Console.WriteLine($"Saldo awal: Rp {user.Saldo:N0}");
```

#### Output

```text
Email ternormalisasi: budi.dev@gmail.com
Saldo awal: Rp 100,000
```

**Hafalan:**

```text
set => field = validasi(value) → fitur C# 14 mengakses backing storage otomatis tanpa variabel privat
```

---

## 5. 🟢 Property init Accessor & Immutability Objek

#### Konsep

Accessor **`init`** (diperkenalkan sejak C# 9 dan disempurnakan di .NET 10) memungkinkan sebuah property dapat diisi nilainya saat pembuatan objek (*Object Initializer*), namun setelah objek selesai dibuat, property tersebut menjadi **Immutable (Read-Only permanen)**.

#### Contoh

```csharp
public class Pesanan
{
    public string IdTransaksi { get; init; } = "";
    public decimal TotalBayar { get; init; }
    public string Status { get; set; } = "PENDING"; // Boleh diubah kapan saja
}

// Menggunakan Object Initializer
Pesanan order = new Pesanan
{
    IdTransaksi = "TRX-998877",
    TotalBayar = 750_000m
};

order.Status = "LUNAS"; // ✅ Boleh (set)
// order.IdTransaksi = "TRX-BARU"; // ❌ COMPILE ERROR: Property 'IdTransaksi' cannot be assigned to (init-only)

Console.WriteLine($"Pesanan: {order.IdTransaksi} | Status: {order.Status}");
```

#### Output

```text
Pesanan: TRX-998877 | Status: LUNAS
```

**Hafalan:**

```text
public type Prop { get; init; } → property yang hanya boleh diisi saat inisialisasi awal objek
```

---

## 6. 🟢 Constructor Tradisional & Constructor Chaining (this)

#### Konsep

Constructor adalah method khusus yang otomatis dieksekusi saat objek diinstansiasi dengan `new`.
- Memiliki nama yang **persis sama dengan nama class**.
- Tidak memiliki tipe kembalian (*no return type*).
- **Constructor Chaining (`: this(...)`):** Memanggil constructor lain di dalam class yang sama untuk menghindari duplikasi kode inisialisasi (*DRY*).

#### Contoh

```csharp
public class Karyawan
{
    public string Id { get; set; }
    public string Nama { get; set; }
    public string Divisi { get; set; }

    // Constructor Lengkap
    public Karyawan(string id, string nama, string divisi)
    {
        Id = id;
        Nama = nama;
        Divisi = divisi;
    }

    // Constructor Chaining: Mendelegasikan nilai default ke constructor utama
    public Karyawan(string id, string nama) : this(id, nama, "Umum")
    {
    }
}

Karyawan k1 = new Karyawan("EMP-01", "Ahmad", "IT Engineering");
Karyawan k2 = new Karyawan("EMP-02", "Siti");

Console.WriteLine($"{k1.Nama} - Divisi: {k1.Divisi}");
Console.WriteLine($"{k2.Nama} - Divisi: {k2.Divisi}");
```

#### Output

```text
Ahmad - Divisi: IT Engineering
Siti - Divisi: Umum
```

**Hafalan:**

```text
public ClassName(params) : this(args) → constructor chaining memanggil constructor lain di class yang sama
```

---

## 7. 🟢 Primary Constructors Modern pada Class

#### Konsep

Mulai C# 12 hingga **C# 14**, C# mendukung **Primary Constructors** pada deklarasi class biasa (sebelumnya hanya ada di `record`).
- Parameter constructor ditulis langsung di samping nama class: `public class Customer(string id, string name)`.
- Parameter tersebut langsung dapat diakses di seluruh tubuh class dan untuk menginisialisasi property tanpa deklarasi constructor terpisah.

#### Contoh

```csharp
// Primary Constructor C# 14: Langsung mendefinisikan parameter pada header class
public class Mahasiswa(string nim, string nama, double ipk)
{
    public string Nim { get; } = nim;
    public string Nama { get; set; } = nama;
    public double Ipk { get; set; } = ipk;

    public void CetakProfil()
    {
        // Parameter primary constructor 'nim' dan 'nama' dapat langsung digunakan
        Console.WriteLine($"NIM: {Nim} | Mahasiswa: {Nama} | IPK: {Ipk:F2}");
    }
}

Mahasiswa mhs = new Mahasiswa("2026001", "Ali Murrofid", 3.92);
mhs.CetakProfil();
```

#### Output

```text
NIM: 2026001 | Mahasiswa: Ali Murrofid | IPK: 3.92
```

**Hafalan:**

```text
public class Name(params) → primary constructor menyederhanakan deklarasi inisialisasi class
```

---

## 8. 🟢 Modifier Akses (Access Modifiers Lengkap)

#### Konsep

C# menyediakan sistem kontrol hak akses paling komprehensif di dunia OOP:

| Modifier Akses | Tingkat Visibilitas Akses |
|---|---|
| **`public`** | Bebas diakses dari mana saja (dalam proyek maupun assembly luar). |
| **`private`** *(Default)* | Hanya dapat diakses di dalam tubuh class/struct yang sama. |
| **`protected`** | Dapat diakses di dalam class yang sama dan semua class turunannya (*child class*). |
| **`internal`** | Dapat diakses oleh kode mana saja di dalam **Assembly/Proyek yang sama**, tapi tersembunyi dari luar. |
| **`protected internal`**| Dapat diakses dalam assembly yang sama ATAU class turunan di assembly lain. |
| **`private protected`**  | Hanya dapat diakses oleh class turunan di dalam **assembly yang sama**. |

---

## 9. 🟢 Enkapsulasi & Proteksi State Objek

#### Konsep

Enkapsulasi bertujuan melindungi konsistensi data (*invariants*) agar tidak berada dalam kondisi korup atau tidak valid. Field data dibuat `private`, dan perubahan hanya diizinkan melalui method atau property yang tervalidasi.

#### Contoh

```csharp
public class DompetDigital
{
    // Enkapsulasi: Saldo tidak boleh diubah langsung dari luar
    private decimal _saldo;

    public decimal Saldo => _saldo; // Hanya ekspos getter publik

    public void TopUp(decimal nominal)
    {
        if (nominal <= 0) throw new ArgumentException("Nominal top-up harus positif!");
        _saldo += nominal;
    }

    public bool Bayar(decimal nominal)
    {
        if (nominal > _saldo) return false;
        _saldo -= nominal;
        return true;
    }
}

DompetDigital wallet = new DompetDigital();
wallet.TopUp(100_000m);
bool sukses = wallet.Bayar(45_000m);

Console.WriteLine($"Pembayaran sukses: {sukses} | Sisa saldo: Rp {wallet.Saldo:N0}");
```

#### Output

```text
Pembayaran sukses: True | Sisa saldo: Rp 55,000
```

---

## 10. 🟡 Inheritance / Pewarisan (:) & Keyword base

#### Konsep

Inheritance memungkinkan sebuah class mewarisi atribut dan perilaku dari class lain menggunakan tanda titik dua (**`:`**).
- **Single Class Inheritance:** C# hanya mengizinkan mewarisi tepat satu parent class.
- **`base(...)`:** Digunakan untuk memanggil constructor atau method milik parent class.

#### Contoh

```csharp
// Parent Class (Superclass)
public class Kendaraan
{
    public string Merek { get; set; }
    public int Tahun { get; set; }

    public Kendaraan(string merek, int tahun)
    {
        Merek = merek;
        Tahun = tahun;
    }

    public void NyalakanMesin() => Console.WriteLine($"Mesin {Merek} menyala: Brummm!");
}

// Child Class (Subclass)
public class Mobil : Kendaraan
{
    public int JumlahPintu { get; set; }

    // Memanggil constructor parent class menggunakan : base(...)
    public Mobil(string merek, int tahun, int jumlahPintu) : base(merek, tahun)
    {
        JumlahPintu = jumlahPintu;
    }

    public void BukaPintu() => Console.WriteLine($"Membuka {JumlahPintu} pintu mobil.");
}

Mobil avanza = new Mobil("Toyota Avanza", 2026, 4);
avanza.NyalakanMesin();
avanza.BukaPintu();
```

#### Output

```text
Mesin Toyota Avanza menyala: Brummm!
Membuka 4 pintu mobil.
```

**Hafalan:**

```text
class Child : Parent           → pewarisan class
public Child(...) : base(...) → mendelegasikan inisialisasi ke constructor induk
```

---

## 11. 🟡 Method Overriding (virtual & override)

#### Konsep

Di C#, method parent class **TIDAK DAPAT di-override secara sembarangan** kecuali telah diizinkan secara eksplisit:
1. **`virtual`:** Diletakkan pada method parent class untuk menandai bahwa implementasi method ini boleh ditimpa oleh child class.
2. **`override`:** Diletakkan pada method child class untuk menyediakan implementasi baru yang menggantikan versi parent.

#### Contoh

```csharp
public class Notifikasi
{
    public virtual void KirimPesan(string pesan)
    {
        Console.WriteLine($"[NOTIFIKASI UMUM]: {pesan}");
    }
}

public class EmailNotifikasi : Notifikasi
{
    // Override perilaku parent
    public override void KirimPesan(string pesan)
    {
        Console.WriteLine($"[EMAIL SENT TO INBOX]: {pesan}");
    }
}

Notifikasi n1 = new Notifikasi();
Notifikasi n2 = new EmailNotifikasi(); // Polimorfisme

n1.KirimPesan("Halo!");
n2.KirimPesan("Halo!"); // Memanggil versi EmailNotifikasi karena virtual dynamic dispatch
```

#### Output

```text
[NOTIFIKASI UMUM]: Halo!
[EMAIL SENT TO INBOX]: Halo!
```

**Hafalan:**

```text
virtual  → mengizinkan method induk untuk di-override oleh child class
override → mengimplementasikan versi baru method virtual di child class
```

---

## 12. 🟡 Method Hiding (new Keyword) vs Overriding

#### Konsep

Perbedaan paling sering membingungkan di C#:
- **`override` (Dynamic Dispatch):** Terikat pada **tipe objek nyata di Heap saat runtime**.
- **`new` (Method Hiding / Static Binding):** Memutuskan rantai polimorfisme dan menyembunyikan method parent. Terikat pada **tipe variabel referensi saat kompilasi**.

#### Contoh Perbandingan

```csharp
public class Induk
{
    public virtual void TampilOverride() => Console.WriteLine("Induk - Virtual");
    public void TampilHiding() => Console.WriteLine("Induk - Biasa");
}

public class Anak : Induk
{
    public override void TampilOverride() => Console.WriteLine("Anak - Override");
    public new void TampilHiding() => Console.WriteLine("Anak - Hiding via new");
}

Induk obj = new Anak(); // Referensi bertipe 'Induk', objek nyata bertipe 'Anak'

obj.TampilOverride(); // Output: Anak - Override (Polimorfik runtime)
obj.TampilHiding();   // Output: Induk - Biasa (Karena referensi adalah Induk!)
```

#### Output

```text
Anak - Override
Induk - Biasa
```

> [!WARNING]
> Hindari penggunaan `new` method hiding untuk polimorfisme, karena dapat memicu bug halus akibat perbedaan tipe variabel pemanggil. Gunakan selalu `virtual` dan `override`.

---

## 13. 🟡 Polymorphism (Polimorfisme & Dynamic Dispatch)

#### Konsep

Polimorfisme memungkinkan sekumpulan objek dari berbagai class turunan diperlakukan sebagai satu tipe parent class atau interface yang sama, namun masing-masing tetap mengeksekusi perilakunya secara dinamis.

#### Contoh

```csharp
public abstract class BangunDatar
{
    public abstract double HitungLuas();
}

public class Persegi(double sisi) : BangunDatar
{
    public override double HitungLuas() => sisi * sisi;
}

public class Lingkaran(double radius) : BangunDatar
{
    public override double HitungLuas() => Math.PI * radius * radius;
}

// Polimorfisme dalam Array Koleksi
BangunDatar[] daftarBentuk = [
    new Persegi(10),
    new Lingkaran(7),
    new Persegi(5)
];

foreach (var bentuk in daftarBentuk)
{
    Console.WriteLine($"Luas Bangun: {bentuk.HitungLuas():F2}");
}
```

#### Output

```text
Luas Bangun: 100.00
Luas Bangun: 153.94
Luas Bangun: 25.00
```

---

## 14. 🟡 Type Casting Objek & Pattern Matching (is / as)

#### Konsep

1. **Operator `is`:** Menguji apakah suatu objek kompatibel dengan tipe tertentu. C# modern mendukung **Pattern Matching**: jika cocok, objek langsung dimasukkan ke variabel baru.
2. **Operator `as`:** Melakukan konversi tipe referensi. Jika gagal, mengembalikan nilai `null` tanpa melempar `InvalidCastException`.

#### Contoh

```csharp
object data = "Belajar C# 14 Modern";

// Pattern Matching dengan 'is'
if (data is string teks)
{
    Console.WriteLine($"Teks valid dengan panjang: {teks.Length}");
}

// Operator 'as'
object angkaObj = 100;
string? teksGagal = angkaObj as string; // teksGagal bernilai null (bukan crash)
Console.WriteLine($"Hasil cast 'as': {teksGagal ?? "Gagal Konversi ke String"}");
```

#### Output

```text
Teks valid dengan panjang: 20
Hasil cast 'as': Gagal Konversi ke String
```

**Hafalan:**

```text
obj is TargetType var → uji tipe dan langsung simpan ke variabel baru jika true
obj as TargetType     → konversi aman, menghasilkan null jika gagal
```

---

## 15. 🟡 Abstract Class & Abstract Method

#### Konsep

- **Abstract Class (`abstract class`):** Class konseptual yang **tidak dapat diinstansiasi secara langsung** dengan `new`. Hanya berfungsi sebagai cetak biru dasar bagi class turunan.
- **Abstract Method (`abstract method`):** Method tanpa tubuh implementasi (`{}`) yang **wajib diimplementasikan** oleh seluruh class anak konkret via keyword `override`.

---

## 16. 🟡 Interface Dasar & Multiple Implementation

#### Konsep

**Interface** adalah kontrak perilaku murni yang mendefinisikan apa yang harus dapat dilakukan oleh sebuah class, tanpa menentukan bagaimana cara melakukannya.
- Penamaan standar C# diawali dengan huruf **`I`** (misal: `IRepository`, `IPaymentGateway`).
- Sebuah class di C# **dapat mengimplementasikan banyak interface sekaligus (*Multiple Implementation*)**.

#### Contoh

```csharp
public interface IStorable
{
    void Simpan();
}

public interface IPrintable
{
    void Cetak();
}

// Satu class mengimplementasikan dua interface
public class DokumenKontrak(string judul) : IStorable, IPrintable
{
    public void Simpan() => Console.WriteLine($"Dokumen '{judul}' disimpan ke database.");
    public void Cetak() => Console.WriteLine($"Mencetak fisik kontrak: {judul}");
}

DokumenKontrak doc = new DokumenKontrak("Perjanjian Kerja");
doc.Simpan();
doc.Cetak();
```

#### Output

```text
Dokumen 'Perjanjian Kerja' disimpan ke database.
Mencetak fisik kontrak: Perjanjian Kerja
```

---

## 17. 🟡 Interface Inheritance & Default Interface Methods

#### Konsep

Di C# modern, Interface dapat:
1. Mewarisi interface lain (`public interface IAdvancedRepo : IBaseRepo`).
2. **Default Interface Methods:** Interface dapat memiliki method dengan tubuh implementasi bawaan. Jika class pengimplementasi tidak menuliskan method tersebut, versi bawaan interface yang akan digunakan (sangat membantu menjaga backward compatibility saat library diperbarui).

---

## 18. 🟡 Explicit Interface Implementation

#### Konsep

Jika sebuah class mengimplementasikan dua interface yang memiliki method dengan nama dan parameter yang persis sama, terjadi ambiguitas nama. C# menyelesaikannya dengan **Explicit Interface Implementation**:
- Nama interface disertakan langsung di depan nama method: `void IInterfaceA.Proses()`.
- Method eksplisit ini **tidak boleh memiliki access modifier `public`** dan hanya dapat dipanggil ketika objek di-cast ke tipe interface yang bersangkutan.

#### Contoh

```csharp
public interface IOrderService
{
    void Batal();
}

public interface ISubscriptionService
{
    void Batal();
}

public class LayananKombinasi : IOrderService, ISubscriptionService
{
    // Implementasi Eksplisit Interface A
    void IOrderService.Batal() => Console.WriteLine("Membatalkan Order Barang.");

    // Implementasi Eksplisit Interface B
    void ISubscriptionService.Batal() => Console.WriteLine("Membatalkan Langganan Bulanan.");
}

LayananKombinasi layanan = new LayananKombinasi();

// Cast ke interface yang diinginkan untuk memanggilnya
((IOrderService)layanan).Batal();
((ISubscriptionService)layanan).Batal();
```

#### Output

```text
Membatalkan Order Barang.
Membatalkan Langganan Bulanan.
```

---

## 19. 🟡 Structs (Value Types & Alokasi Hemat Memori)

#### Konsep

`struct` adalah tipe data berorientasi objek yang berstatus **Value Type** (dialokasikan langsung di Stack Memory, bukan di Heap):
- Tidak memicu kerja Garbage Collector saat dihancurkan.
- Sangat ideal untuk struktur data berukuran kecil (< 16 byte), berumur pendek, dan tidak memerlukan pewarisan hierarki class.
- **`readonly struct`:** Menjamin seluruh field di dalam struct bersifat immutable permanen.

#### Contoh

```csharp
public readonly struct TitikKoordinat(double x, double y)
{
    public double X { get; } = x;
    public double Y { get; } = y;

    public double HitungJarakKePusat() => Math.Sqrt(X * X + Y * Y);
}

TitikKoordinat p1 = new TitikKoordinat(3, 4);
Console.WriteLine($"Jarak Titik (3, 4) ke Pusat: {p1.HitungJarakKePusat()}");
```

#### Output

```text
Jarak Titik (3, 4) ke Pusat: 5
```

---

## 20. 🔴 Record Types (record class & record struct)

#### Konsep

**`record`** adalah fitur revolusioner C# untuk merepresentasikan data pembawa (*Data Carrier / DTO*):
1. **Value-Based Equality:** Dua instance record yang berbeda alamat memorinya akan dianggap sama (`==` bernilai `true`) jika seluruh konten datanya identik.
2. **ToString Otomatis:** Menghasilkan representasi string rapi tanpa perlu override manual.
3. **Immutability Bawaan:** Properti pada positional record secara default berstatus `init`.

#### Contoh

```csharp
// Positional Record: Mendefinisikan class DTO lengkap hanya dalam 1 baris!
public record MahasiswaDto(string Nim, string Nama, string Prodi);

MahasiswaDto m1 = new MahasiswaDto("101", "Ahmad", "Informatika");
MahasiswaDto m2 = new MahasiswaDto("101", "Ahmad", "Informatika");

Console.WriteLine($"Print Record: {m1}");
Console.WriteLine($"Equality Cek (m1 == m2): {m1 == m2}"); // TRUE (karena seluruh nilainya identik!)
```

#### Output

```text
Print Record: MahasiswaDto { Nim = 101, Nama = Ahmad, Prodi = Informatika }
Equality Cek (m1 == m2): True
```

---

## 21. 🔴 Mutasi Non-Destruktif pada Record dengan Keyword with

#### Konsep

Karena record dirancang immutable, kita tidak dapat mengubah nilainya secara langsung (`m1.Nama = "Budi"` error). C# menyediakan ekspresi **`with`** untuk membuat salinan record baru dengan mengubah sebagian nilai property tertentu secara aman (*Non-Destructive Mutation*).

#### Contoh

```csharp
public record ProdukDto(string Sku, string Nama, decimal Harga);

ProdukDto pAsli = new ProdukDto("SKU-01", "Mouse Gaming", 250_000m);

// Membuat objek baru hasil mutasi diskon tanpa mengubah pAsli
ProdukDto pPromo = pAsli with { Harga = 200_000m };

Console.WriteLine($"Produk Asli  : Rp {pAsli.Harga:N0}");
Console.WriteLine($"Produk Promo : Rp {pPromo.Harga:N0}");
```

#### Output

```text
Produk Asli  : Rp 250,000
Produk Promo : Rp 200,000
```

---

## 22. 🔴 Static Class & Static Members

#### Konsep

Keyword `static` menandakan bahwa member atau class tersebut menjadi milik **tipe class itu sendiri**, bukan milik instance objek tertentu.
- **Static Class:** Tidak dapat diinstansiasi dengan `new` dan tidak dapat diwarisi. Semua member di dalamnya wajib bertipe `static`. Sering digunakan untuk class utilitas (seperti `System.Math`).

---

## 23. 🔴 Sealed Class & Sealed Methods

#### Konsep

- **`sealed class`:** Mengunci class agar **tidak dapat diwarisi sama sekali** oleh class lain (mirip keyword `final` di Java). Sangat penting untuk keamanan arsitektur dan optimasi devirtualisasi pemanggilan method oleh RyuJIT.
- **`sealed method`:** Mengunci method override pada child class agar tidak dapat di-override lagi oleh turunan di bawahnya.

---

## 24. 🔴 Hierarchy Exception di .NET & Custom Exception Class

#### Konsep

Seluruh exception di .NET diturunkan dari class induk **`System.Exception`**. Untuk domain aplikasi bisnis, disarankan membuat custom exception yang mewarisi class `Exception`.

#### Contoh

```csharp
// Custom Exception Domain
public class SaldoTidakCukupException(decimal saldoSaatIni, decimal penarikan) 
    : Exception($"Penarikan Rp {penarikan:N0} gagal! Saldo hanya tersisa Rp {saldoSaatIni:N0}.")
{
    public decimal Defisit => penarikan - saldoSaatIni;
}

void TarikUang(decimal saldo, decimal tarik)
{
    if (tarik > saldo)
    {
        throw new SaldoTidakCukupException(saldo, tarik);
    }
}

try
{
    TarikUang(100_000m, 250_000m);
}
catch (SaldoTidakCukupException ex)
{
    Console.WriteLine($"[ERROR BISNIS]: {ex.Message}");
    Console.WriteLine($"Kekurangan Dana: Rp {ex.Defisit:N0}");
}
```

#### Output

```text
[ERROR BISNIS]: Penarikan Rp 250,000 gagal! Saldo hanya tersisa Rp 100,000.
Kekurangan Dana: Rp 150,000
```

---

## 25. 🔴 Manajemen Resource Otomatis dengan IDisposable & using

#### Konsep

Garbage Collector (.NET GC) hanya mengelola memori RAM terkelola (*Managed Memory*). Sumber daya tak terkelola (*Unmanaged Resources*) seperti koneksi file, koneksi socket jaringan, atau handle database harus dibersihkan segera.
- Implementasikan interface **`IDisposable`** dan method `Dispose()`.
- Gunakan statement **`using`** modern: objek akan otomatis memanggil `Dispose()` begitu keluar dari scope, bahkan jika terjadi error crash di tengah eksekusi.

#### Contoh

```csharp
public class FileLoggerSimulator : IDisposable
{
    public void TulisLog(string pesan) => Console.WriteLine($"Menulis ke disk: {pesan}");

    public void Dispose()
    {
        Console.WriteLine("--> Resource handle file berhasil ditutup dan dibersihkan dari RAM!");
    }
}

// using statement modern (otomatis panggil Dispose di akhir method)
using var logger = new FileLoggerSimulator();
logger.TulisLog("Aplikasi C# 14 berhasil boot.");
```

#### Output

```text
Menulis ke disk: Aplikasi C# 14 berhasil boot.
--> Resource handle file berhasil ditutup dan dibersihkan dari RAM!
```

---

## 26. 🔴 Garbage Collection & Siklus Hidup Objek (Gen 0, 1, 2)

#### Konsep

Garbage Collector di .NET 10 CLR bekerja secara otomatis membebaskan memori objek yang sudah tidak memiliki referensi aktif dari stack root. Memori Heap terbagi menjadi 3 Generasi (*Generational GC*):
1. **Gen 0:** Objek berumur sangat pendek (variabel lokal method). Dibersihkan paling sering dan super cepat.
2. **Gen 1:** Objek yang selamat dari pembersihan Gen 0 (zona transisi).
3. **Gen 2:** Objek berumur panjang (singleton services, koneksi database, static cache).
4. **Large Object Heap (LOH):** Objek berukuran > 85.000 byte (seperti array raksasa).

---

## 27. 🛠️ Peta Ingatan Cepat

```text
C# 14 OOP Architecture
├── Fundamental
│   ├── 4 Pilar (Encapsulation, Inheritance, Polymorphism, Abstraction)
│   ├── Properties (Auto get/set, init, dan field keyword C# 14)
│   └── Constructors (Traditional chaining vs Primary Constructors)
├── Lanjutan
│   ├── Pewarisan & Polimorfisme (virtual / override vs new)
│   ├── Abstraksi (abstract class vs interface & default methods)
│   └── Value Types Berkinerja Tinggi (structs & readonly struct)
└── Advanced / Operasional
    ├── Immutability & DTO (record class & record struct with expression)
    ├── Penguncian & Desain (sealed & static classes)
    ├── Custom Exception Domain
    └── Resource Management (IDisposable, using pattern, GC Lifecycle)
```

---

## 28. 📊 Tabel Ringkasan

| Fitur / Keyword | Sintaks C# 14 | Fungsi & Karakteristik |
|---|---|---|
| **Primary Constructor** | `class User(string id)` | Menulis parameter constructor langsung di header class. |
| **Field Keyword** | `set => field = value;` | Fitur C# 14 mengakses backing storage otomatis property. |
| **Init Accessor** | `public string Id { get; init; }` | Property hanya boleh diisi saat inisialisasi awal objek. |
| **Method Override** | `public override void Run()` | Menimpa method virtual milik parent class secara dinamis. |
| **Method Hiding** | `public new void Run()` | Menyembunyikan method parent class secara statis kompilasi. |
| **Positional Record**| `record UserDto(string Id);` | Data carrier immutable dengan value equality bawaan. |
| **With Expression** | `var baru = lama with { X = 2 };`| Mutasi non-destruktif membuat salinan record baru. |
| **Using Statement** | `using var res = new Res();` | Otomatis membersihkan unmanaged resource via IDisposable. |

---

## 29. ⚡ Cheat Code C# OOP 10 Detik

```text
class C(params)            → primary constructor C# modern
set => field = val         → field-backed property C# 14
get; init;                 → immutable property pasca-inisialisasi
class C : Base, I1, I2     → pewarisan class & banyak interface
virtual / override         → pasangan method dynamic dispatch polimorfik
record Dto(string A, int B)→ data transfer object immutable instan
orig with { Prop = val }   → mutasi non-destruktif record
using var x = new Res()    → auto-dispose resource safety
```

---

## 30. 🧭 Urutan Belajar yang Disarankan

1. Kuasai pembuatan class dan pembatasan data via **Properties** dan **Access Modifiers**.
2. Pahami fitur baru C# 14 **Field-Backed Properties (`field`)** dan **Primary Constructors**.
3. Pelajari **Inheritance (`:`)** dan bedakan dengan tegas antara **`override`** dan **`new`**.
4. Rancang antarmuka abstraksi menggunakan **`interface`** dan **`abstract class`**.
5. Gunakan **`struct`** untuk tipe data kecil berkinerja tinggi bebas Garbage Collection.
6. Adopsi **`record`** untuk kebutuhan DTO dan pemrosesan data berbasis *immutable state*.
7. Terapkan pola **`using`** dan **`IDisposable`** untuk mencegah kebocoran memori.
8. Kerjakan **Mini Project Payment Gateway CLI** untuk menguji integrasi seluruh pilar OOP.
9. Lanjutkan ke modul berikutnya: [[csharp-generic|C# Generic]].

---

## 31. 🏗️ Mini Project: Sistem Payment Gateway & Transaksi E-Commerce CLI

### Tujuan
Membangun engine pemrosesan pembayaran e-commerce berbasis **C# 14 & .NET 10** yang menerapkan Primary Constructors, Field-Backed Properties, Interface Abstraction, Polimorfisme, Record DTO, dan Custom Domain Exception.

### Fitur
1. Abstraksi interface payment processor (`IPaymentGateway`).
2. Implementasi vendor pembayaran jamak (`QrisPaymentGateway` dan `CreditCardPaymentGateway`).
3. Pembuatan invoice immutable menggunakan C# Positional Record.
4. Custom Exception `PembayaranGagalException` untuk penanganan kegagalan transaksi.

### Kode Lengkap (`Program.cs`)

```csharp
// Mini Project: Sistem Payment Gateway E-Commerce Modern (C# 14 / .NET 10 LTS)

// 1. Domain Record DTO (Positional Record)
public record Invoice(string InvoiceId, string CustomerName, decimal TotalBayar);

// 2. Custom Exception
public class PembayaranGagalException(string invoiceId, string alasan) 
    : Exception($"[TRANSAKSI {invoiceId} GAGAL]: {alasan}")
{
    public string InvoiceId { get; } = invoiceId;
}

// 3. Abstraksi Interface Payment Gateway
public interface IPaymentGateway
{
    string NamaChannel { get; }
    bool ProsesBayar(Invoice invoice, decimal uangDiserahkan);
}

// 4. Implementasi Konkret 1: QRIS Payment (Primary Constructor)
public class QrisPaymentGateway(decimal biayaLayanan = 1_500m) : IPaymentGateway
{
    public string NamaChannel => "QRIS Instant Dynamic";

    public bool ProsesBayar(Invoice invoice, decimal uangDiserahkan)
    {
        decimal totalFinal = invoice.TotalBayar + biayaLayanan;
        Console.WriteLine($"Menghasilkan QR Code untuk {invoice.CustomerName}...");
        Console.WriteLine($"Tagihan: Rp {invoice.TotalBayar:N0} + Fee Admin: Rp {biayaLayanan:N0} = Rp {totalFinal:N0}");

        if (uangDiserahkan < totalFinal)
        {
            throw new PembayaranGagalException(invoice.InvoiceId, "Saldo scan e-wallet tidak mencukupi!");
        }

        Console.WriteLine("--> Notifikasi Webhook: Pembayaran QRIS Sukses Diterima!");
        return true;
    }
}

// 5. Implementasi Konkret 2: Kartu Kredit Payment
public class CreditCardPaymentGateway : IPaymentGateway
{
    public string NamaChannel => "Kartu Kredit Visa/Mastercard";

    // Property C# 14: Validasi nomor kartu menggunakan keyword 'field'
    public string MaskedCardNumber
    {
        get => field;
        set => field = value.Length == 16 
            ? $"XXXX-XXXX-XXXX-{value[^4..]}" 
            : throw new ArgumentException("Nomor kartu kredit wajib 16 digit angka!");
    } = "XXXX-XXXX-XXXX-0000";

    public bool ProsesBayar(Invoice invoice, decimal uangDiserahkan)
    {
        Console.WriteLine($"Menghubungi Bank Issuer untuk kartu {MaskedCardNumber}...");
        if (uangDiserahkan < invoice.TotalBayar)
        {
            throw new PembayaranGagalException(invoice.InvoiceId, "Limit kartu kredit tidak mencukupi!");
        }

        Console.WriteLine("--> Otorisasi Bank 3D Secure Berhasil!");
        return true;
    }
}

// 6. Payment Engine Orchestrator
public class CheckoutService(IPaymentGateway gateway)
{
    public void EksekusiCheckout(Invoice invoice, decimal uangBayar)
    {
        Console.WriteLine("==================================================");
        Console.WriteLine($"Memproses Pesanan : {invoice.InvoiceId}");
        Console.WriteLine($"Pelanggan         : {invoice.CustomerName}");
        Console.WriteLine($"Channel Dipilih   : {gateway.NamaChannel}");
        Console.WriteLine("--------------------------------------------------");

        try
        {
            bool status = gateway.ProsesBayar(invoice, uangBayar);
            if (status)
            {
                Console.WriteLine($"STATUS AKHIR      : LUNAS BERHASIL ({DateTime.Now:yyyy-MM-dd HH:mm})");
            }
        }
        catch (PembayaranGagalException ex)
        {
            Console.WriteLine($"STATUS AKHIR      : DITOLAK!");
            Console.WriteLine($"Penyebab Error    : {ex.Message}");
        }
        Console.WriteLine("==================================================
");
    }
}

// --- SIMULASI PENGUJIAN TRANSAKSI ---

Invoice inv1 = new Invoice("INV-2026-001", "Budi Santoso", 250_000m);
Invoice inv2 = new Invoice("INV-2026-002", "Siti Aminah", 1_500_000m);

// Simulasi 1: Pembayaran QRIS Berhasil
IPaymentGateway qris = new QrisPaymentGateway();
CheckoutService serviceQris = new CheckoutService(qris);
serviceQris.EksekusiCheckout(inv1, 300_000m);

// Simulasi 2: Pembayaran Kartu Kredit Gagal (Limit Kurang)
CreditCardPaymentGateway cc = new CreditCardPaymentGateway();
cc.MaskedCardNumber = "4111222233334444"; // C# 14 field-backed validation
CheckoutService serviceCc = new CheckoutService(cc);
serviceCc.EksekusiCheckout(inv2, 1_000_000m); // Uang bayar lebih kecil dari tagihan
```

### Hasil Akhir

```text
==================================================
Memproses Pesanan : INV-2026-001
Pelanggan         : Budi Santoso
Channel Dipilih   : QRIS Instant Dynamic
--------------------------------------------------
Menghasilkan QR Code untuk Budi Santoso...
Tagihan: Rp 250,000 + Fee Admin: Rp 1,500 = Rp 251,500
--> Notifikasi Webhook: Pembayaran QRIS Sukses Diterima!
STATUS AKHIR      : LUNAS BERHASIL (2026-10-09 23:15)
==================================================

==================================================
Memproses Pesanan : INV-2026-002
Pelanggan         : Siti Aminah
Channel Dipilih   : Kartu Kredit Visa/Mastercard
--------------------------------------------------
Menghubungi Bank Issuer untuk kartu XXXX-XXXX-XXXX-4444...
STATUS AKHIR      : DITOLAK!
Penyebab Error    : [TRANSAKSI INV-2026-002 GAGAL]: Limit kartu kredit tidak mencukupi!
==================================================
```

---

## 32. 🔗 Referensi Resmi

- [Object-Oriented Programming in C# (Microsoft Learn)](https://learn.microsoft.com/dotnet/csharp/fundamentals/tutorials/oop)
- [Properties and Field-Backed Properties in C# 14](https://learn.microsoft.com/dotnet/csharp/programming-guide/classes-and-structs/properties)
- [Primary Constructors (Microsoft Learn)](https://learn.microsoft.com/dotnet/csharp/programming-guide/classes-and-structs/instance-constructors#primary-constructors)
- [Records in C# (Value Equality & Mutation)](https://learn.microsoft.com/dotnet/csharp/fundamentals/types/records)
- [Garbage Collection Architecture in .NET](https://learn.microsoft.com/dotnet/standard/garbage-collection/fundamentals)
