---
title: "C# Generic"
description: "C# Generics modern (C# 14 & .NET 10 LTS): type-safety kompilasi, generic classes/methods, generic constraints, C# 14 nameof unbound generics, dan covariance/contravariance."
order: 3
tags:
  - programming
  - csharp
  - dotnet
  - generics
  - intermediate
---

# C# Generic

> **Target:** Pemula yang telah menguasai dasar C# dan OOP, serta ingin memahami sistem generic type-safe untuk persiapan Collection Framework, LINQ, dan Entity Framework Core.  
> **Versi:** C# 14 / .NET 10 (LTS)  
> **Prasyarat:** [[csharp-oop|C# OOP]]  
> Fokus modul pembelajaran ini: **mental model type safety & eliminasi boxing/unboxing → CLR Reification vs Java Type Erasure → generic class, pair & response envelope → generic method & interface → generic constraints lengkap (class, struct, notnull, new(), base class, interface) → C# 14 nameof unbound generic types (nameof(List<>)) → default(T) & default literal → covariance (out T) & contravariance (in T) → generic delegates → static member caching trap → mini project generic in-memory repository pattern**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami untuk membuat class, method, dan antarmuka generic yang bebas boxing dan type-safe

🟡 Lanjutan
→ pelajari setelah menguasai generic dasar: generic constraints lengkap, default(T), dan fitur C# 14 nameof unbound

🔴 Advanced / Operasional
→ penting untuk arsitektur library/framework: CLR Reification runtime, covariance (out), contravariance (in), dan static caching
```

Mental model kompilasi dan eksekusi Generic di .NET CLR (Reified Generics):

```text
      Source Code Generic (<T>, <TKey, TValue>)
                         │
                         ▼
             Roslyn Compiler (Type Check)
                         │
                         ▼
        Bytecode CIL Menyimpan Metadata <T>
                         │
                         ▼
          Common Language Runtime (CLR)
          ┌──────────────┴──────────────┐
          ▼                             ▼
   Value Types (int, double)    Reference Types (string, User)
  ┌─────────────────────────┐  ┌─────────────────────────────┐
  │   Specialized Native    │  │   Shared Native Machinery   │
  │ Machine Code per Type   │  │   (Menggunakan Pointer Heap)│
  │ (Zero Boxing Overhead)  │  │   (Hemat Alokasi Kode)      │
  └─────────────────────────┘  └─────────────────────────────┘
```

**Hafalan:**

```text
Type Parameter → placeholder tipe data abstrak yang dideklarasikan dengan kurung siku (seperti <T>, <TKey, TValue>)
Type Argument  → tipe data konkret yang diberikan saat instansiasi (seperti <string>, <int>, <Customer>)
Type-Safe      → jaminan compiler bahwa tipe data selalu valid saat kompilasi tanpa perlu runtime casting
Boxing         → proses membungkus value type (int) ke dalam objek heap (object) yang memboroskan memori CPU
Unboxing       → proses mengekstrak kembali nilai value type dari objek heap dengan casting eksplisit
Reification    → keunggulan CLR .NET yang mempertahankan informasi tipe generic saat runtime (bukan type erasure)
Covariance     → mengizinkan penggunaan tipe yang lebih spesifik daripada yang dideklarasikan (out T - Producer)
Contravariance → mengizinkan penggunaan tipe yang lebih umum daripada yang dideklarasikan (in T - Consumer)
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan C# Generic & Masalah Non-Generic (Boxing & Casting)](#1--pengenalan-c-generic--masalah-non-generic-boxing--casting)
2. [Mental Model CLR Reification vs Java Type Erasure](#2--mental-model-clr-reification-vs-java-type-erasure)
3. [Generic Class dengan Parameter Tunggal (T)](#3--generic-class-dengan-parameter-tunggal-t)
4. [Generic Class dengan Multi-Parameter (TKey, TValue)](#4--generic-class-dengan-multi-parameter-tkey-tvalue)
5. [Generic API Response Envelope (ApiResponse of T)](#5--generic-api-response-envelope-apiresponse-of-t)
6. [Generic Method & Type Inference Otomatis](#6--generic-method--type-inference-otomatis)
7. [Generic Interface Dasar (IRepository of T, TId)](#7--generic-interface-dasar-irepository-of-t-tid)

### 🟡 Lanjutan

8. [Generic Constraints: Value Types vs Reference Types (where T : class, struct, notnull)](#8--generic-constraints-value-types-vs-reference-types-where-t--class-struct-notnull)
9. [Generic Constraints: Parameterless Constructor (where T : new())](#9--generic-constraints-parameterless-constructor-where-t--new)
10. [Generic Constraints: Base Class & Interface Constraint](#10--generic-constraints-base-class--interface-constraint)
11. [Multiple Generic Constraints & Aturan Sintaks](#11--multiple-generic-constraints--aturan-sintaks)
12. [Dukungan C# 14: nameof pada Unbound Generic Types](#12--dukungan-c-14-nameof-pada-unbound-generic-types)
13. [Nilai Default pada Generic: Operator default](#13--nilai-default-pada-generic-operator-default)

### 🔴 Advanced / Operasional

14. [Covariance pada Generic Interface (out T - Producer)](#14--covariance-pada-generic-interface-out-t---producer)
15. [Contravariance pada Generic Interface (in T - Consumer)](#15--contravariance-pada-generic-interface-in-t---consumer)
16. [Tabel Komparasi Invariance vs Covariance vs Contravariance](#16--tabel-komparasi-invariance-vs-covariance-vs-contravariance)
17. [Generic Delegates Bawaan .NET (Func, Action, Predicate)](#17--generic-delegates-bawaan-net-func-action-predicate)
18. [Generic Records & Generic Structs](#18--generic-records--generic-structs)
19. [Bahaya Static Members di Dalam Generic Class (Cache Trap)](#19--bahaya-static-members-di-dalam-generic-class-cache-trap)

### 🛠️ Referensi & Praktik

20. [Peta Ingatan Cepat](#20-️-peta-ingatan-cepat)
21. [Tabel Ringkasan](#21--tabel-ringkasan)
22. [Cheat Code C# Generic 10 Detik](#22--cheat-code-c-generic-10-detik)
23. [Urutan Belajar yang Disarankan](#23--urutan-belajar-yang-disarankan)
24. [Mini Project: Generic In-Memory Repository & Filtering Engine CLI](#24-️-mini-project-generic-in-memory-repository--filtering-engine-cli)
25. [Referensi Resmi](#25--referensi-resmi)

---

## 1. 🟢 Pengenalan C# Generic & Masalah Non-Generic (Boxing & Casting)

#### Konsep

Sebelum fitur Generic diperkenalkan di .NET 2.0, struktur data menggunakan tipe dasar universal **`System.Object`** (`ArrayList`, `Hashtable`).

Penggunaan `object` memiliki dua masalah fatal:
1. **Tidak Ada Type Safety (Bahaya Runtime Crash):** Nilai apa pun bisa masuk ke dalam koleksi. Kesalahan tipe data baru terdeteksi saat runtime sebagai **`InvalidCastException`**.
2. **Penurunan Performa Masif Akibat Boxing & Unboxing:**
   - **Boxing:** Membungkus Value Type (`int`, `double`, `struct`) ke dalam objek referensi di Heap Memory.
   - **Unboxing:** Mengekstrak kembali nilai dari Heap ke Stack melalui casting manual.
   - Mengakibatkan alokasi sampah memori berlebih yang membebani Garbage Collector.

**Generic** menyelesaikan kedua masalah ini secara mutlak: kode ditulis menggunakan placeholder tipe data abstrak (`<T>`) yang diverifikasi ketat saat kompilasi tanpa alokasi boxing.

#### Contoh

Perbandingan Kode Non-Generic vs Generic Modern:

```csharp
using System.Collections;

// ❌ CARA LAMA (NON-GENERIC): Tidak Aman & Boros Alokasi Memori
ArrayList listLama = new ArrayList();
listLama.Add(100);             // Memicu BOXING: int dialokasikan ke Heap!
listLama.Add("Bukan Angka");   // Tipe berbeda bisa masuk tanpa terdeteksi!

// int angka = (int)listLama[1]; // 💥 RUNTIME CRASH: InvalidCastException!

// ✅ CARA MODERN (GENERIC): 100% Type-Safe & Zero Boxing!
List<int> listGeneric = [100, 200, 300];
// listGeneric.Add("Teks"); // ❌ COMPILE ERROR: Kompiler langsung menolak sebelum program jalan!

int hasil = listGeneric[0]; // Tidak perlu casting, nilai langsung dibaca dari Stack!
Console.WriteLine( â "Elemen Generic: {hasil}");
```

#### Output

```text
Elemen Generic: 100
```

**Hafalan:**

```text
Boxing   → alokasi pembungkusan value type ke heap memory via tipe object
Unboxing → ekstraksi nilai heap kembali ke stack melalui casting tipe
Generics → solusi type-safe zero-boxing untuk komputasi berperforma tinggi
```

---

## 2. 🟢 Mental Model CLR Reification vs Java Type Erasure

#### Konsep

Salah satu keunggulan terbesar arsitektur .NET dibandingkan runtime bahasa lain (seperti Java) adalah **Reified Generics**:

| Karakteristik | Java Generics (Type Erasure) | C# / .NET Generics (Reification) |
|---|---|---|
| **Waktu Kompilasi** | Informasi tipe `<T>` diperiksa oleh javac. | Informasi tipe `<T>` diperiksa oleh Roslyn. |
| **Hasil Bytecode** | Informasi `<T>` **DIHAPUS (Erased)** dan diganti `Object`. | Informasi `<T>` **DIPERTAHANKAN (Reified)** di metadata CIL. |
| **Eksekusi Runtime** | JVM tidak mengetahui tipe asli (tipe primitif `int` dilarang). | **CLR mengetahui tipe asli secara presisi** saat runtime. |
| **Tipe Primitif** | Wajib menggunakan Wrapper Object (`Integer`, `Double`). | **Mendukung tipe primitif langsung (`List<int>`) tanpa alokasi objek!** |
| **Performa Mesin** | Menghasilkan alokasi pointer di heap. | RyuJIT membuat kode mesin native khusus (*specialized native code*). |

#### Cara Kerja

```text
List<int>    ──> CLR JIT membuat kode mesin khusus 32-bit integer murni di CPU.
List<double> ──> CLR JIT membuat kode mesin khusus 64-bit floating point murni di CPU.
List<string> ──> CLR JIT berbagi mesin native pointer bersama objek referensi lain.
```

---

## 3. 🟢 Generic Class dengan Parameter Tunggal (`<T>`)

#### Konsep

Generic Class adalah class yang dapat bekerja dengan tipe data apa pun yang ditentukan saat instansiasi menggunakan placeholder **`<T>`** (*T = Type*).

#### Contoh

```csharp
// Generic Box Container
public class KotakPenyimpanan<T>
{
    private T _konten;

    public KotakPenyimpanan(T kontenAwal)
    {
        _konten = kontenAwal;
    }

    public T AmbilKonten() => _konten;

    public void GantiKonten(T kontenBaru)
    {
        _konten = kontenBaru;
        Console.WriteLine( â "Konten kotak diperbarui menjadi: {_konten}");
    }
}

// Penggunaan dengan tipe data yang berbeda-beda
KotakPenyimpanan<int> kotakAngka = new KotakPenyimpanan<int>(42);
KotakPenyimpanan<string> kotakTeks = new KotakPenyimpanan<string>("Dokumen Rahasia");

Console.WriteLine( â "Isi Kotak Angka: {kotakAngka.AmbilKonten()}");
Console.WriteLine( â "Isi Kotak Teks : {kotakTeks.AmbilKonten()}");

kotakTeks.GantiKonten("Sertifikat Digital");
```

#### Output

```text
Isi Kotak Angka: 42
Isi Kotak Teks : Dokumen Rahasia
Konten kotak diperbarui menjadi: Sertifikat Digital
```

**Hafalan:**

```text
public class Name<T> { ... } → generic class dengan parameter tipe tunggal T
```

---

## 4. 🟢 Generic Class dengan Multi-Parameter (`<TKey, TValue>`)

#### Konsep

Sebuah class generic dapat memiliki lebih dari satu parameter tipe data yang dipisahkan oleh tanda koma, seperti pola pasangan kunci-nilai (**`<TKey, TValue>`**).

#### Contoh

```csharp
// Primary Constructor C# 14 pada Generic Class Multi-Parameter
public class PasanganData<TKey, TValue>(TKey kunci, TValue nilai)
{
    public TKey Kunci { get; init; } = kunci;
    public TValue Nilai { get; init; } = nilai;

    public void CetakInformasi()
    {
        Console.WriteLine( â "[{typeof(TKey).Name}] Kunci: {Kunci} -> [{typeof(TValue).Name}] Nilai: {Nilai}");
    }
}

PasanganData<string, decimal> hargaProduk = new PasanganData<string, decimal>("PROD-01", 125_000m);
PasanganData<int, bool> statusAkun = new PasanganData<int, bool>(1002, true);

hargaProduk.CetakInformasi();
statusAkun.CetakInformasi();
```

#### Output

```text
[String] Kunci: PROD-01 -> [Decimal] Nilai: 125000
[Int32] Kunci: 1002 -> [Boolean] Nilai: True
```

**Hafalan:**

```text
public class Name<T1, T2> → generic class dengan banyak parameter tipe data
```

---

## 5. 🟢 Generic API Response Envelope (`ApiResponse<T>`)

#### Konsep

Dalam arsitektur backend REST API industri (ASP.NET Core), pola envelope seragam digunakan untuk membungkus seluruh response JSON. Kita menggunakan Generic agar payload `Data` dapat menampung tipe apa saja secara *type-safe*.

#### Contoh

```csharp
public class ApiResponse<T>
{
    public int StatusCode { get; init; }
    public string Message { get; init; }
    public T? Data { get; init; }
    public bool Success => StatusCode >= 200 && StatusCode < 300;

    // Factory method pembantu
    public static ApiResponse<T> Ok(T data, string pesan = "Sukses") =>
        new ApiResponse<T> { StatusCode = 200, Message = pesan, Data = data };

    public static ApiResponse<T> Fail(int code, string pesan) =>
        new ApiResponse<T> { StatusCode = code, Message = pesan, Data = default };
}

public record ProfilUser(string Username, string Role);

// Membungkus data objek ProfilUser
ProfilUser user = new ProfilUser("alimurrofid", "Admin");
ApiResponse<ProfilUser> response = ApiResponse<ProfilUser>.Ok(user, "Data profil berhasil dimuat");

Console.WriteLine( â "Status  : {response.StatusCode} (Success: {response.Success})");
Console.WriteLine( â "Pesan   : {response.Message}");
Console.WriteLine( â "Payload : {response.Data?.Username} [{response.Data?.Role}]");
```

#### Output

```text
Status  : 200 (Success: True)
Pesan   : Data profil berhasil dimuat
Payload : alimurrofid [Admin]
```

**Hafalan:**

```text
ApiResponse<T> → pola envelope generic standar backend untuk payload data dinamis
```

---

## 6. 🟢 Generic Method & Type Inference Otomatis

#### Konsep

Method generic adalah method yang mendeklarasikan parameter tipenya sendiri (`<T>`) pada tingkat method, bahkan di dalam class yang bukan generic.

**Type Inference Otomatis:**  
Kompiler C# cukup cerdas untuk menyimpulkan tipe `<T>` berdasarkan tipe argumen yang dioper saat pemanggilan, sehingga penulisan kurung siku `<tipe>` seringkali bersifat opsional.

#### Contoh

```csharp
public static class ArrayHelper
{
    // Generic Method untuk menukar dua elemen
    public static void TukarPosisi<T>(ref T a, ref T b)
    {
        T temp = a;
        a = b;
        b = temp;
    }

    // Generic Method untuk mencetak elemen array
    public static void CetakElemen<T>(T[] array)
    {
        Console.WriteLine( â "Isi Array ({typeof(T).Name}): {string.Join(", ", array)}");
    }
}

int x = 10, y = 20;
ArrayHelper.TukarPosisi(ref x, ref y); // Type inference otomatis menyimpulkan <int>
Console.WriteLine( â "Setelah Tukar -> x: {x}, y: {y}");

string[] bahasa = ["C#", "F#", "TypeScript"];
ArrayHelper.CetakElemen(bahasa); // Type inference otomatis menyimpulkan <string>
```

#### Output

```text
Setelah Tukar -> x: 20, y: 10
Isi Array (String): C#, F#, TypeScript
```

**Hafalan:**

```text
public TReturn MethodName<T>(T param) → generic method dengan type parameter mandiri
```

---

## 7. 🟢 Generic Interface Dasar (`IRepository<T, TId>`)

#### Konsep

Interface generic mendefinisikan kontrak operasi seragam untuk manipulasi entitas domain apa pun di layer akses data (*Repository Pattern*).

#### Contoh

```csharp
public interface IRepository<T, TId>
{
    void Add(T entity);
    T? GetById(TId id);
    IEnumerable<T> GetAll();
}

public record Customer(int Id, string Name);

// Implementasi interface konkret untuk Customer
public class CustomerRepository : IRepository<Customer, int>
{
    private readonly List<Customer> _storage = [];

    public void Add(Customer entity) => _storage.Add(entity);

    public Customer? GetById(int id) => _storage.FirstOrDefault(c => c.Id == id);

    public IEnumerable<Customer> GetAll() => _storage;
}

IRepository<Customer, int> repo = new CustomerRepository();
repo.Add(new Customer(1, "Budi Santoso"));
repo.Add(new Customer(2, "Siti Aminah"));

Console.WriteLine( â "Total Customer: {repo.GetAll().Count()}");
Console.WriteLine( â "Cari ID 1     : {repo.GetById(1)?.Name}");
```

#### Output

```text
Total Customer: 2
Cari ID 1     : Budi Santoso
```

---

## 8. 🟡 Generic Constraints: Value Types vs Reference Types (`where T : class, struct, notnull`)

#### Konsep

Secara default, parameter generic `<T>` dapat diisi dengan tipe apa saja tanpa batasan (*unconstrained*). Namun, seringkali kita butuh memastikan tipe yang masuk memiliki karakteristik tertentu.

Kompiler C# menyediakan klausa **`where T : ...`**:
1. **`where T : class`:** Tipe data **wajib Reference Type** (class, interface, delegate, record). Nilai primitif seperti `int` atau `struct` dilarang masuk.
2. **`where T : struct`:** Tipe data **wajib Value Type** (primitif number, bool, custom struct). Objek referensi dilarang.
3. **`where T : notnull`:** Tipe data tidak boleh bernilai nullable (`null`).

#### Contoh

```csharp
// Constraint: T hanya boleh Reference Type
public class ReferenceContainer<T> where T : class
{
    public void PeriksaNull(T item)
    {
        Console.WriteLine( â "Apakah item null? {item == null}");
    }
}

// Constraint: T hanya boleh Value Type
public class ValueCalculator<T> where T : struct
{
    public int DapatkanUkuranMemori() => System.Runtime.CompilerServices.Unsafe.SizeOf<T>();
}

ReferenceContainer<string> cRef = new ReferenceContainer<string>();
cRef.PeriksaNull("Teks Valid");

// ReferenceContainer<int> cGagal = new ReferenceContainer<int>(); // ❌ COMPILE ERROR: 'int' bukan reference type!

ValueCalculator<int> cVal = new ValueCalculator<int>();
Console.WriteLine( â "Ukuran int di Stack: {cVal.DapatkanUkuranMemori()} byte");
```

#### Output

```text
Apakah item null? False
Ukuran int di Stack: 4 byte
```

**Hafalan:**

```text
where T : class   → batasan hanya untuk reference types
where T : struct  → batasan hanya untuk value types
where T : notnull → batasan tipe data tidak boleh bernilai null
```

---

## 9. 🟡 Generic Constraints: Parameterless Constructor (`where T : new()`)

#### Konsep

Jika sebuah method atau class generic perlu membuat instance baru dari tipe `<T>` menggunakan perintah `new T()`, Anda wajib menambahkan constraint **`where T : new()`**.

Kompiler Roslyn menjamin bahwa tipe konkret yang diberikan memiliki parameterless constructor publik yang dapat dipanggil.

#### Contoh

```csharp
public class EntityFactory<T> where T : new()
{
    public T CreateDefaultInstance()
    {
        // Diizinkan karena ada constraint where T : new()
        return new T();
    }
}

public class OrderItem
{
    public string Sku { get; set; } = "UNKNOWN";
    public int Qty { get; set; } = 1;
}

EntityFactory<OrderItem> factory = new EntityFactory<OrderItem>();
OrderItem itemBaru = factory.CreateDefaultInstance();

Console.WriteLine( â "Item Hasil Factory: SKU={itemBaru.Sku}, Qty={itemBaru.Qty}");
```

#### Output

```text
Item Hasil Factory: SKU=UNKNOWN, Qty=1
```

**Hafalan:**

```text
where T : new() → mewajibkan T memiliki constructor kosong publik agar bisa memanggil new T()
```

---

## 10. 🟡 Generic Constraints: Base Class & Interface Constraint

#### Konsep

Untuk memastikan `<T>` memiliki properti atau method tertentu, kita dapat menguncinya ke Parent Class atau Interface tertentu:
1. **Base Class Constraint (`where T : BaseClass`):** Tipe `<T>` wajib merupakan class tersebut atau class turunannya.
2. **Interface Constraint (`where T : IComparable<T>`):** Tipe `<T>` wajib mengimplementasikan interface tersebut.

#### Contoh

```csharp
public abstract class BaseEntity
{
    public int Id { get; init; }
    public DateTime CreatedAt { get; init; } = DateTime.Now;
}

public class ProdukEntity : BaseEntity
{
    public string Nama { get; set; } = "";
}

// Constraint: T wajib turunan BaseEntity dan mengimplementasikan IComparable
public class EntityProcessor<T> where T : BaseEntity, IComparable<T>
{
    public void CetakMetadata(T entity)
    {
        // Aman mengakses property Id dan CreatedAt karena dijamin oleh BaseEntity
        Console.WriteLine( â "ID: {entity.Id} | Waktu Dibuat: {entity.CreatedAt:yyyy-MM-dd}");
    }
}
```

---

## 11. 🟡 Multiple Generic Constraints & Aturan Sintaks

#### Konsep

Sebuah parameter tipe generic dapat memiliki lebih dari satu constraint sekaligus.

> [!IMPORTANT]
> **Aturan Urutan Penulisan Constraint:**
> 1. `class` atau `struct` (jika ada) **wajib ditulis pertama**.
> 2. Nama Base Class (jika ada) wajib ditulis setelah `class` atau di urutan pertama.
> 3. Interface constraints dapat ditulis setelahnya.
> 4. `new()` **wajib ditulis paling terakhir**.

Contoh sintaks sah:
```csharp
public class ServiceManager<TEntity, TDto>
    where TEntity : BaseEntity, IAuditable, new()
    where TDto : class
{
    // ...
}
```

---

## 12. 🟡 Dukungan C# 14: `nameof` pada Unbound Generic Types

#### Konsep

Sebelum C# 14, ketika developer ingin mendapatkan nama teks dari class generic menggunakan operator `nameof`, kompiler mewajibkan kita menyertakan argumen tipe data konkret tiruan:
```csharp
// SINTAKS LAMA (C# 13 ke bawah - canggung):
string namaClass = nameof(List<int>); // Menghasilkan "List"
string namaDict  = nameof(Dictionary<string, object>); // Menghasilkan "Dictionary"
```

**Di C# 14 (.NET 10 LTS)**, operator **`nameof` mendukung Unbound Generic Types**:
- Anda dapat langsung menulis tanda kurung siku kosong `nameof(List<>)` atau tanda koma untuk multi-parameter `nameof(Dictionary<,>)` tanpa perlu menentukan tipe dummy!

#### Contoh

```csharp
// ✅ FITUR BARU C# 14: Unbound Generic Typeof Nameof
string namaList = nameof(List<>);
string namaDictionary = nameof(Dictionary<,>);
string namaAction = nameof(Action<,,>);

Console.WriteLine( â "Unbound List       : {namaList}");
Console.WriteLine( â "Unbound Dictionary : {namaDictionary}");
Console.WriteLine( â "Unbound Action     : {namaAction}");
```

#### Output

```text
Unbound List       : List
Unbound Dictionary : Dictionary
Unbound Action     : Action
```

**Hafalan:**

```text
nameof(List<>)       → sintaks C# 14 mengekstrak nama tipe generic tanpa type argument dummy
nameof(Dictionary<,>)→ unbound generic dengan dua parameter tipe
```

---

## 13. 🟡 Nilai Default pada Generic: Operator `default`

#### Konsep

Dalam generic `<T>`, kita tidak bisa langsung menetapkan `T x = null;` karena `T` bisa saja berupa Value Type (seperti `int`) yang tidak mengizinkan nilai `null`.

Gunakan operator **`default`** atau **`default(T)`**:
- Jika `T` adalah Reference Type (misal `string`), mengembalikan **`null`**.
- Jika `T` adalah Numeric Value Type (misal `int`), mengembalikan angka **`0`**.
- Jika `T` adalah Boolean, mengembalikan **`false`**.

#### Contoh

```csharp
public static class DefaultTester
{
    public static void CetakDefault<T>()
    {
        T? nilaiDefault = default;
        Console.WriteLine( â "Nilai default untuk tipe [{typeof(T).Name}]: {nilaiDefault ?? (object)"null"}");
    }
}

DefaultTester.CetakDefault<int>();
DefaultTester.CetakDefault<bool>();
DefaultTester.CetakDefault<string>();
```

#### Output

```text
Nilai default untuk tipe [Int32]: 0
Nilai default untuk tipe [Boolean]: False
Nilai default untuk tipe [String]: null
```

**Hafalan:**

```text
default(T) atau default → menghasilkan nilai default aman tipe data (0, false, atau null)
```

---

## 14. 🔴 Covariance pada Generic Interface (`out T` - Producer)

#### Konsep

Secara default, antarmuka generic bersifat **Invariant** (tidak fleksibel):  
Meskipun `Kucing` adalah turunan dari `Hewan`, variabel `IKandang<Hewan>` **TIDAK BISA** menerima objek `IKandang<Kucing>`.

**Covariance (`out T`):**
- Menandai bahwa tipe parameter `T` hanya digunakan sebagai **Nilai Kembalian (Return Value / Output / Producer)**.
- Mengizinkan Anda menetapkan tipe yang lebih spesifik (*subclass*) ke tipe yang lebih umum (*superclass*).
- Dideklarasikan dengan keyword **`out`** di depan parameter tipe interface.

#### Contoh

```csharp
public class Hewan { public string Suara => "Suara Binatang"; }
public class Kucing : Hewan { public new string Suara => "Meong!"; }

// Interface Covariant (out T): Hanya boleh mengembalikan T
public interface IProduserHewan<out T>
{
    T BuatHewan(); // T sebagai return value (Output)
}

public class KucingFactory : IProduserHewan<Kucing>
{
    public Kucing BuatHewan() => new Kucing();
}

// Covariance Beraksi: IProduserHewan<Kucing> sah ditugaskan ke IProduserHewan<Hewan>!
IProduserHewan<Hewan> produser = new KucingFactory();
Hewan hasil = produser.BuatHewan();

Console.WriteLine( â "Hewan berhasil dibuat: {hasil.GetType().Name}");
```

#### Output

```text
Hewan berhasil dibuat: Kucing
```

**Hafalan:**

```text
interface IName<out T> → covariance: T hanya sebagai output (return value), mengizinkan asignasi turunan
```

---

## 15. 🔴 Contravariance pada Generic Interface (`in T` - Consumer)

#### Konsep

Kebalikan dari Covariance, **Contravariance (`in T`)**:
- Menandai bahwa tipe parameter `T` hanya digunakan sebagai **Parameter Masukan (Input / Consumer)**.
- Mengizinkan Anda menetapkan tipe yang lebih umum (*superclass*) ke tipe yang membutuhkan turunan spesifik (*subclass*).
- Dideklarasikan dengan keyword **`in`** di depan parameter tipe interface.

#### Contoh

```csharp
public class Hewan { }
public class Kucing : Hewan { }

// Interface Contravariant (in T): T hanya sebagai parameter input
public interface IPembersih<in T>
{
    void Mandikan(T hewan);
}

public class PembersihHewanUmum : IPembersih<Hewan>
{
    public void Mandikan(Hewan hewan) => Console.WriteLine("Memandikan hewan umum secara higienis.");
}

// Contravariance Beraksi: IPembersih<Hewan> sah ditugaskan ke IPembersih<Kucing>!
IPembersih<Kucing> pembersihKucing = new PembersihHewanUmum();
pembersihKucing.Mandikan(new Kucing());
```

#### Output

```text
Memandikan hewan umum secara higienis.
```

**Hafalan:**

```text
interface IName<in T> → contravariance: T hanya sebagai parameter input, mengizinkan penugasan superclass
```

---

## 16. 🔴 Tabel Komparasi Invariance vs Covariance vs Contravariance

| Pola Variansi | Keyword C# | Arah Fleksibilitas Tipe | Posisi Parameter | Contoh Antarmuka Bawaan |
|---|:---:|---|---|---|
| **Invariant** | *(Tanpa keyword)* | Tipe data harus sama persis | Input & Output | IList<T>, IDictionary<K, V> |
| **Covariant** | **out T** | Turunan -> Induk (Lebih spesifik) | Hanya Output (Return) | IEnumerable<out T>, IReadOnlyList<out T> |
| **Contravariant**| **in T** | Induk -> Turunan (Lebih umum) | Hanya Input (Argumen) | IComparer<in T>, Action<in T> |

---

## 17. 🔴 Generic Delegates Bawaan .NET (`Func`, `Action`, `Predicate`)

#### Konsep

Di C# modern, Anda jarang perlu membuat delegate kustom secara manual. .NET menyediakan generic delegate siap pakai di namespace `System`:
1. **`Action<T1, T2, ...>`:** Delegate yang menerima parameter dan **tidak mengembalikan nilai (`void`)**.
2. **`Func<T1, T2, ..., TResult>`:** Delegate yang menerima parameter dan **mengembalikan nilai `TResult`** (tipe terakhir adalah return value).
3. **`Predicate<T>`:** Delegate yang menguji parameter dan selalu mengembalikan nilai boolean **`bool`** (ekuivalen dengan `Func<T, bool>`).

#### Contoh

```csharp
// 1. Action: Void
Action<string> cetakLog = pesan => Console.WriteLine( â "[LOG]: {pesan}");
cetakLog("Server berjalan normal");

// 2. Func: Menerima int & int, mengembalikan int (TResult di akhir)
Func<int, int, int> kali = (a, b) => a * b;
Console.WriteLine( â "Hasil Kali (4 x 5): {kali(4, 5)}");

// 3. Predicate: Pengujian logika boolean
Predicate<int> isDewasa = umur => umur >= 17;
Console.WriteLine( â "Apakah 20 tahun dewasa? {isDewasa(20)}");
```

#### Output

```text
[LOG]: Server berjalan normal
Hasil Kali (4 x 5): 20
Apakah 20 tahun dewasa? True
```

---

## 18. 🔴 Generic Records & Generic Structs

#### Konsep

Generic tidak terbatas pada class biasa:
1. **Generic Records:** Sangat ideal untuk DTO fungsional monad (seperti pola `Result<T>` atau `Paginated<T>`).
2. **Generic Structs:** Digunakan untuk struktur data komputasi performa tinggi di Stack memori.

#### Contoh

```csharp
// Generic Record Monad Result
public record Result<T>(bool IsSuccess, T? Data, string? ErrorMessage)
{
    public static Result<T> Success(T data) => new(true, data, null);
    public static Result<T> Failure(string error) => new(false, default, error);
}

var hasilSukses = Result<string>.Success("Token-12345");
var hasilGagal = Result<int>.Failure("Data tidak ditemukan");

Console.WriteLine( â "Sukses: {hasilSukses.IsSuccess} | Data: {hasilSukses.Data}");
Console.WriteLine( â "Gagal : {hasilGagal.IsSuccess} | Error: {hasilGagal.ErrorMessage}");
```

#### Output

```text
Sukses: True | Data: Token-12345
Gagal : False | Error: Data tidak ditemukan
```

---

## 19. 🔴 Bahaya Static Members di Dalam Generic Class (Cache Trap)

#### Konsep

> [!WARNING]
> **Trap Static Caching pada Generic Class:**
> Di C# (.NET CLR), variabel `static` di dalam generic class **TIDAK DIBAGI SECARA GLOBAL**, melainkan **DIBUAT MANDIRI UNTUK SETIAP VARIAN TIPE `<T>`**!
> 
> Artinya, `GenericCounter<int>.Count` dan `GenericCounter<string>.Count` adalah **dua variabel static terpisah di memori**. Jangan gunakan field static di dalam generic class sebagai global cache universal.

#### Contoh Demonstrasi

```csharp
public class Counter<T>
{
    public static int Hitungan = 0;
}

// Manipulasi varian int
Counter<int>.Hitungan++;
Counter<int>.Hitungan++;

// Manipulasi varian string
Counter<string>.Hitungan++;

Console.WriteLine( â "Counter<int>    : {Counter<int>.Hitungan}");    // Nilai 2
Console.WriteLine( â "Counter<string> : {Counter<string>.Hitungan}"); // Nilai 1 (TIDAK menjadi 3!)
```

#### Output

```text
Counter<int>    : 2
Counter<string> : 1
```

---

## 20. 🛠️ Peta Ingatan Cepat

```text
C# 14 Generic System
├── Fundamental
│   ├── Eliminasi Masalah Non-Generic (Zero Boxing/Unboxing)
│   ├── Mental Model CLR Reified Generics (Beda dengan Java Erasure)
│   ├── Generic Class & Multi-Parameter (<TKey, TValue>)
│   └── Generic Methods & Otomatisasi Type Inference
├── Lanjutan
│   ├── Generic Constraints (class, struct, notnull, new(), base, interface)
│   ├── C# 14 nameof Unbound Generic Types (nameof(List<>))
│   └── Nilai Default Generik (operator default)
└── Advanced / Operasional
    ├── Variansi Tipe (Covariance out T vs Contravariance in T)
    ├── Generic Delegates Bawaan (Action, Func, Predicate)
    ├── Generic Records (Result<T> pattern)
    └── Static Member Caching Trap per Varian Tipe
```

---

## 21. 📊 Tabel Ringkasan

| Fitur Generic | Sintaks C# 14 | Keterangan & Aturan |
|---|---|---|
| **Class Generic** | `class Repo<T>` | Class fleksibel bekerja dengan tipe apa saja. |
| **Method Generic** | `T Max<T>(T a, T b)` | Method dengan parameter tipe independen. |
| **Constraint Class** | `where T : class` | Wajib Reference Type (bukan int/struct). |
| **Constraint Struct**| `where T : struct` | Wajib Value Type (int, double, bool). |
| **Constructor New** | `where T : new()` | Wajib punya constructor kosong publik. |
| **C# 14 Unbound Name**| `nameof(List<>)` | Mengambil nama tipe generic tanpa tipe tiruan. |
| **Covariance (Out)** | `interface IProducer<out T>`| T hanya sebagai return value (Output). |
| **Contravariance (In)**| `interface IConsumer<in T>` | T hanya sebagai argumen method (Input). |

---

## 22. ⚡ Cheat Code C# Generic 10 Detik

```text
class Box<T>                   → generic class dengan parameter T
where T : class, new()         → batasan reference type & wajib punya constructor new
nameof(List<>)                 → C# 14 nama unbound generic type
T val = default;               → inisialisasi default aman untuk generic
interface IProd<out T>         → covariant producer (output saja)
interface ICons<in T>          → contravariant consumer (input saja)
Func<T, TResult>               → delegate fungsi ber-return value
Action<T>                      → delegate void ber-parameter
record Result<T>(T Data, bool S)→ generic data transfer object
```

---

## 23. 🧭 Urutan Belajar yang Disarankan

1. Pahami mengapa **Boxing & Unboxing** merusak performa CPU dan bagaimana Generic mengatasinya.
2. Sadari perbedaan revolusioner **.NET Reified Generics** dibandingkan Java Type Erasure.
3. Kuasai pembuatan **Generic Class** dan **Generic Method** dengan *Type Inference*.
4. Kuasai seluruh variasi **Generic Constraints** (`where T : class, struct, new(), BaseEntity`).
5. Pelajari fitur mutakhir C# 14 **`nameof` pada Unbound Generic Types**.
6. Pahami prinsip pemilihan **Covariance (`out`)** dan **Contravariance (`in`)**.
7. Kerjakan **Mini Project Generic In-Memory Repository** untuk persiapan mendalam menuju LINQ & EF Core.
8. Lanjutkan ke materi berikutnya: [[csharp-collection|C# Collection Framework]].

---

## 24. 🏗️ Mini Project: Generic In-Memory Repository & Filtering Engine CLI

### Tujuan
Membangun framework penyimpanan data dalam memori generic (*In-Memory Repository Pattern*) berbasis **C# 14 & .NET 10** yang menerapkan Generic Constraints, Generic Interface, Generic Records, Predicate Filtering, dan C# 14 Unbound `nameof`.

### Fitur
1. Base entity abstrak bertipe ID generic (`BaseEntity<TId>`).
2. Antarmuka repository generic (`IRepository<TEntity, TId>`).
3. Dukungan pencarian menggunakan generic predicate `Func<TEntity, bool>`.
4. Wrapper hasil operasi menggunakan generic record `Result<T>`.

### Kode Lengkap (`Program.cs`)

```csharp
// Mini Project: Generic In-Memory Repository Engine (C# 14 / .NET 10 LTS)

// 1. Base Entity Abstrak dengan Generic ID
public abstract class BaseEntity<TId>
{
    public TId Id { get; init; } = default!;
    public DateTime CreatedAt { get; init; } = DateTime.Now;
}

// 2. Generic Monad Result
public record OperationResult<T>(bool Success, T? Data, string? Message);

// 3. Generic Interface Repository
public interface IRepository<TEntity, TId> where TEntity : BaseEntity<TId>
{
    OperationResult<TEntity> Save(TEntity entity);
    TEntity? FindById(TId id);
    IEnumerable<TEntity> FindWhere(Func<TEntity, bool> predicate);
    int TotalCount();
}

// 4. Implementasi Generic In-Memory Repository
public class InMemoryRepository<TEntity, TId> : IRepository<TEntity, TId> 
    where TEntity : BaseEntity<TId>
{
    private readonly List<TEntity> _storage = [];

    public OperationResult<TEntity> Save(TEntity entity)
    {
        // Fitur C# 14: Log nama unbound generic interface untuk observability
        string namaRepo = nameof(IRepository<,>);

        _storage.Add(entity);
        return new OperationResult<TEntity>(true, entity,  â "{namaRepo}: Data berhasil disimpan!");
    }

    public TEntity? FindById(TId id)
    {
        return _storage.FirstOrDefault(item => EqualityComparer<TId>.Default.Equals(item.Id, id));
    }

    public IEnumerable<TEntity> FindWhere(Func<TEntity, bool> predicate)
    {
        return _storage.Where(predicate);
    }

    public int TotalCount() => _storage.Count;
}

// 5. Entitas Domain Konkret
public class ProductEntity : BaseEntity<string>
{
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
    public bool IsActive { get; set; } = true;
}

// --- SIMULASI PENGUJIAN SISTEM ---

Console.WriteLine("==================================================");
Console.WriteLine("  GENERIC REPOSITORY ENGINE (C# 14 / .NET 10 LTS) ");
Console.WriteLine("==================================================");

// Inisialisasi Repository Khusus Produk (Entity = ProductEntity, ID = string)
IRepository<ProductEntity, string> productRepo = new InMemoryRepository<ProductEntity, string>();

// Simpan Data
productRepo.Save(new ProductEntity { Id = "PRD-01", Name = "Keyboard Mekanikal RGB", Price = 750_000m });
productRepo.Save(new ProductEntity { Id = "PRD-02", Name = "Mouse Wireless Silent", Price = 250_000m });
productRepo.Save(new ProductEntity { Id = "PRD-03", Name = "Monitor Gaming 240Hz", Price = 4_200_000m, IsActive = false });

Console.WriteLine( â "\nTotal Produk Tersimpan : {productRepo.TotalCount()} unit\n");

// Pencarian Berdasarkan ID
Console.WriteLine("--- MENCARI PRODUK BERDASARKAN ID (PRD-02) ---");
var pDitemukan = productRepo.FindById("PRD-02");
if (pDitemukan != null)
{
    Console.WriteLine( â "Ditemukan : {pDitemukan.Name} | Harga: Rp {pDitemukan.Price:N0}");
}

// Pencarian Filter Menggunakan Generic Func Predicate (Harga > Rp 500.000 & Aktif)
Console.WriteLine("\n--- FILTER PRODUK AKTIF DENGAN HARGA > RP 500.000 ---");
var produkMahal = productRepo.FindWhere(p => p.Price > 500_000m && p.IsActive);

foreach (var item in produkMahal)
{
    Console.WriteLine( â "- [{item.Id}] {item.Name,-25} : Rp {item.Price:N0}");
}
```

### Hasil Akhir

```text
==================================================
  GENERIC REPOSITORY ENGINE (C# 14 / .NET 10 LTS) 
==================================================

Total Produk Tersimpan : 3 unit

--- MENCARI PRODUK BERDASARKAN ID (PRD-02) ---
Ditemukan : Mouse Wireless Silent | Harga: Rp 250,000

--- FILTER PRODUK AKTIF DENGAN HARGA > RP 500.000 ---
- [PRD-01] Keyboard Mekanikal RGB    : Rp 750,000
```

---

## 25. 🔗 Referensi Resmi

- [Generics in C# & .NET (Microsoft Learn)](https://learn.microsoft.com/dotnet/csharp/fundamentals/types/generics)
- [Constraints on Type Parameters (where T)](https://learn.microsoft.com/dotnet/csharp/programming-guide/generics/constraints-on-type-parameters)
- [What's New in C# 14 - Nameof Unbound Generic Types](https://learn.microsoft.com/dotnet/csharp/whats-new/csharp-14#nameof-supports-unbound-generic-types)
- [Covariance and Contravariance in Generics](https://learn.microsoft.com/dotnet/standard/generics/covariance-and-contravariance)
- [CLR Architecture: How Generics are Reified at Runtime](https://learn.microsoft.com/dotnet/standard/generics/)
