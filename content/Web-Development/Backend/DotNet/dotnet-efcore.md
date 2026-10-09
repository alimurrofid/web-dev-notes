---
title: "Entity Framework Core 10"
description: "Panduan komprehensif ORM database di .NET 10 LTS: DbContext, Code-First Migrations, Fluent API mapping, Change Tracker, No-Tracking queries, pencegahan N+1 problem, Split Queries, Value Converters, dan Interceptors."
order: 3
tags:
  - web-development
  - backend
  - dotnet
  - efcore
  - database
  - orm
  - postgresql
---

# Entity Framework Core 10

> Target: Pemula hingga Menengah  
> Versi: EF Core 10 / .NET 10 LTS  
> Prasyarat: [[csharp-oop|C# OOP]], [[csharp-linq|C# LINQ]], dan [[dotnet-dasar|ASP.NET Core Dasar]]

---

## Gambaran Umum

Dalam arsitektur backend modern, menghubungkan logika bisnis berbasis objek (*Object-Oriented C#*) dengan database relasional berbasis tabel (*Relational Database Management System - RDBMS*) seperti PostgreSQL, SQL Server, atau MySQL adalah tantangan besar yang dikenal sebagai *Object-Relational Impedance Mismatch*.

**Entity Framework Core (EF Core)** adalah pustaka Object-Relational Mapper (ORM) resmi dari Microsoft untuk platform .NET. EF Core memungkinkan pengembang berinteraksi dengan database menggunakan objek C# dan kueri LINQ yang *type-safe*, tanpa harus menulis kueri SQL mentah secara manual.

Di versi **EF Core 10** yang berjalan di atas **.NET 10 LTS**, efisiensi eksekusi kueri ditingkatkan secara masif:
* Penerjemahan LINQ ke SQL yang jauh lebih agresif dan optimal.
* Penanganan relasi data multi-tabel menggunakan **Split Queries (`AsSplitQuery`)** untuk melenyapkan masalah *Cartesian Explosion*.
* Pengurangan alokasi memori secara drastis melalui **`AsNoTracking`** dan pooling konteks database (**`AddDbContextPool`**).
* Fitur enterprise modern seperti **Interceptors** untuk audit otomatis, **Value Converters**, dan **Complex Types**.

---

## Cara Belajar

1. Pahami peran mendasar `DbContext` sebagai perpaduan pola desain *Unit of Work* dan *Repository*.
2. Kuasai alur kerja evolusi skema database menggunakan **Code-First Migrations**.
3. Pelajari pemetaan skema menggunakan **Fluent API** (`OnModelCreating`) untuk menjaga kode domain tetap murni (*Clean Architecture*).
4. Pahami cara kerja **Change Tracker** internal dan 5 status entitas.
5. Optimalkan performa kueri baca (*read-only*) menggunakan **`AsNoTracking()`**.
6. Kuasai teknik pengambilan relasi data: hindari **N+1 Query Problem** dan pahami kapan menggunakan **`AsSplitQuery()`**.
7. Terapkan fitur otomatisasi audit (*CreatedAt*, *UpdatedAt*) menggunakan **Interceptors**.
8. Bangun Mini Project sistem pemrosesan pesanan relasional berkinerja tinggi.

---

## Daftar Isi

### 🟢 Fundamental

1. [Mental Model ORM: Menjembatani C# Objects dan Tabel Database](#1--mental-model-orm-menjembatani-c-objects-dan-tabel-database)
2. [Anatomi DbContext dan DbSet: Unit of Work Terpadu](#2--anatomi-dbcontext-dan-dbset-unit-of-work-terpadu)
3. [Konfigurasi Koneksi Database dan DbContext Pooling](#3--konfigurasi-koneksi-database-dan-dbcontext-pooling)
4. [Evolusi Skema via Code-First Migrations](#4--evolusi-skema-via-code-first-migrations)

### 🟡 Intermediate

5. [Pemetaan Skema: Data Annotations vs Fluent API](#5--pemetaan-skema-data-annotations-vs-fluent-api)
6. [Memodelkan Relasi: One-to-Many, Many-to-Many, dan Cascade Delete](#6--memodelkan-relasi-one-to-many-many-to-many-dan-cascade-delete)
7. [Change Tracker Internal: 5 Status Entitas dan SaveChanges](#7--change-tracker-internal-5-status-entitas-dan-savechanges)
8. [Optimasi Kueri Baca: AsNoTracking dan Proyeksi LINQ](#8--optimasi-kueri-baca-asnotracking-dan-proyeksi-linq)

### 🔴 Advanced

9. [Pencegahan N+1 Problem: Eager Loading vs Lazy Loading](#9--pencegahan-n1-problem-eager-loading-vs-lazy-loading)
10. [Cartesian Explosion Trap dan Solusi AsSplitQuery](#10--cartesian-explosion-trap-dan-solusi-assplitquery)
11. [Value Converters dan Complex Types di EF Core 10](#11--value-converters-dan-complex-types-di-ef-core-10)
12. [Audit Trail Otomatis Menggunakan SaveChanges Interceptor](#12--audit-trail-otomatis-menggunakan-savechanges-interceptor)

### 🛠️ Praktik

13. [Best Practice Performa & Arsitektur EF Core](#13-️-best-practice-performa--arsitektur-ef-core)
14. [Kesalahan Umum Pemula](#14-️-kesalahan-umum-pemula)
15. [Mini Project: High-Performance Relational Order Engine](#15-️-mini-project-high-performance-relational-order-engine)

### 📚 Referensi

16. [Peta Ingatan](#16--peta-ingatan)
17. [Cheat Code 10 Detik](#17--cheat-code-10-detik)
18. [Urutan Belajar Berikutnya](#18--urutan-belajar-berikutnya)
19. [Referensi Resmi](#19--referensi-resmi)

---

## 1. 🟢 Mental Model ORM: Menjembatani C# Objects dan Tabel Database

### Konsep

Dalam database relasional, data disimpan dalam bentuk tabel baris dan kolom dua dimensi dengan kunci primer (*Primary Key*) dan kunci asing (*Foreign Key*). Di sisi lain, kode C# beroperasi menggunakan grafik objek (*object graph*), referensi memori, inheritance, dan koleksi polimorfik.

```text
C# Domain Object:
class Customer {
    public Guid Id { get; set; }
    public string Name { get; set; }
    public List<Order> Orders { get; set; }
}
          │
          ▼ diterjemahkan secara otomatis oleh EF Core
Tabel Database Relasional:
Table: Customers (id UUID PK, name VARCHAR)
Table: Orders (id UUID PK, customer_id UUID FK, total NUMERIC)
```

**Entity Framework Core** bertindak sebagai mesin penerjemah dua arah:
1. Menerjemahkan ekspresi kueri C# LINQ menjadi perintah SQL native yang dioptimalkan sesuai dialek database target (PostgreSQL, SQL Server, SQLite).
2. Memetakan baris hasil tabular SQL kembali menjadi objek entitas C# yang terstruktur (*Materialization*).
3. Melacak perubahan properti objek dan menghasilkan perintah SQL `INSERT`, `UPDATE`, atau `DELETE` saat transaksi disimpan.

---

## 2. 🟢 Anatomi DbContext dan DbSet: Unit of Work Terpadu

### Konsep

Jantung dari seluruh interaksi database di EF Core adalah kelas **`DbContext`**. `DbContext` mengimplementasikan dua pola desain enterprise ternama sekaligus:

1. **Repository Pattern:** Diwakili oleh properti **`DbSet<TEntity>`**. Setiap `DbSet<T>` bertindak sebagai repositori tabel database untuk entitas `T`, menyediakan metode kueri dan manipulasi data (`Add`, `Remove`, `Find`).
2. **Unit of Work Pattern:** `DbContext` mengelola transaksi bisnis tunggal. Seluruh perubahan pada berbagai tabel dikumpulkan di memori dan baru dieksekusi secara atomik ke database dalam satu transaksi ketika method **`SaveChangesAsync()`** dipanggil.

### Contoh Definisi DbContext Dasar

```csharp
using Microsoft.EntityFrameworkCore;

// 1. Entitas Domain C#
public class Produk
{
    public Guid Id { get; set; }
    public string Nama { get; set; } = string.Empty;
    public decimal Harga { get; set; }
}

// 2. Kelas Konteks Database Terpusat
public class AplikasiDbContext(DbContextOptions<AplikasiDbContext> options) : DbContext(options)
{
    // DbSet merepresentasikan tabel "Produk" di database
    public DbSet<Produk> DaftarProduk => Set<Produk>();
}
```

---

## 3. 🟢 Konfigurasi Koneksi Database dan DbContext Pooling

### Konsep

Di aplikasi ASP.NET Core, `DbContext` didaftarkan ke dalam kontainer Dependency Injection di file `Program.cs`.

Secara *default*, `DbContext` memiliki siklus hidup **`Scoped`** (satu instance per HTTP Request). Namun, instansiasi `DbContext` baru di setiap request memiliki overhead inisialisasi internal.

Untuk API berkinerja ekstrem, EF Core menyediakan **DbContext Pooling (`AddDbContextPool`)**. Alih-alih membuat instance baru, runtime mengambil instance `DbContext` yang sudah siap dari sebuah pool memori yang dapat digunakan kembali, memotong overhead alokasi memori hingga 40%!

### Pendaftaran di `Program.cs` (Contoh Provider PostgreSQL)

```csharp
var builder = WebApplication.CreateBuilder(args);

// Membaca Connection String dari appsettings.json
string connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? throw new InvalidOperationException("Connection string tidak ditemukan!");

// Mendaftarkan DbContext dengan Pooling untuk performa maksimal
builder.Services.AddDbContextPool<AplikasiDbContext>(options =>
{
    options.UseNpgsql(connectionString, npgsqlOptions =>
    {
        // Konfigurasi ketahanan koneksi otomatis saat terjadi gangguan jaringan singkat
        npgsqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3, 
            maxRetryDelay: TimeSpan.FromSeconds(5), 
            errorCodesToAdd: null);
    });
});
```

---

## 4. 🟢 Evolusi Skema via Code-First Migrations

### Konsep

Dalam pendekatan **Code-First**, Anda menulis kelas C# terlebih dahulu. EF Core kemudian menganalisis kelas-kelas tersebut dan membuat file skrip migrasi C# yang mendeskripsikan perintah DDL (`CREATE TABLE`, `ALTER TABLE`, `ADD COLUMN`) yang dibutuhkan untuk menyelaraskan skema database.

### Perintah Utama CLI Migrations

Instal tool CLI global terlebih dahulu jika belum terpasang:
```bash
dotnet tool install --global dotnet-ef
```

1. **Membuat Migrasi Baru:**
   ```bash
   dotnet ef migrations add InisialisasiSkemaAwal
   ```
   *EF Core menghasilkan berkas migrasi C# yang berisi method `Up()` (menerapkan perubahan) dan `Down()` (rollback jika dibatalkan).*

2. **Menerapkan Migrasi ke Database:**
   ```bash
   dotnet ef database update
   ```
   *EF Core memeriksa tabel khusus `__EFMigrationsHistory` di database dan mengeksekusi migrasi yang belum terpasang secara transaksional.*

3. **Menghasilkan Skrip SQL Idempotent untuk Pipeline CI/CD Produksi:**
   ```bash
   dotnet ef migrations script --idempotent -o skrip-migrasi.sql
   ```
   *Di lingkungan server produksi perbankan/enterprise, jangan jalankan migrasi otomatis saat aplikasi menyala. Hasilkan berkas SQL idempotent ini untuk dievaluasi oleh Database Administrator (DBA).*

---

## 5. 🟡 Pemetaan Skema: Data Annotations vs Fluent API

### Konsep

Anda dapat mengonfigurasi skema kolom database (nama tabel, panjang maksimal karakter, indeks, nilai default) menggunakan dua cara:

1. **Data Annotations:** Menggunakan atribut di atas properti kelas (`[Table]`, `[MaxLength]`, `[Required]`).
2. **Fluent API:** Mengonfigurasi seluruh aturan di method `OnModelCreating` di dalam kelas `DbContext`.

### Mengapa Profesional Memilih Fluent API?

| Kriteria | Data Annotations | Fluent API |
|---|---|---|
| **Pemisahan Tanggung Jawab** | Buruk (Mencemari kelas domain dengan atribut database) | Sangat Bersih (Domain model 100% POCO murni) |
| **Kemampuan Fitur** | Sangat terbatas pada aturan sederhana | Mendukung 100% seluruh fitur database tingkat lanjut |
| **Relasi Kompleks** | Sering membingungkan | Sangat jelas, deklaratif, dan terstruktur |

### Contoh Pemetaan Fluent API Profesional

```csharp
public class AplikasiDbContext(DbContextOptions<AplikasiDbContext> options) : DbContext(options)
{
    public DbSet<Produk> DaftarProduk => Set<Produk>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Konfigurasi Entitas Produk menggunakan Fluent API
        modelBuilder.Entity<Produk>(entity =>
        {
            // Nama tabel eksplisit
            entity.ToTable("produk");

            // Kunci primer
            entity.HasKey(p => p.Id);

            // Kolom Nama: VARCHAR(150), Wajib Diisi
            entity.Property(p => p.Nama)
                  .HasMaxLength(150)
                  .IsRequired();

            // Kolom Harga: Tipe Numerik Presisi Tinggi
            entity.Property(p => p.Harga)
                  .HasPrecision(18, 2)
                  .IsRequired();

            // Indeks unik untuk pencarian cepat
            entity.HasIndex(p => p.Nama).IsUnique();
        });
    }
}
```

---

## 6. 🟡 Memodelkan Relasi: One-to-Many, Many-to-Many, dan Cascade Delete

### 1. Relasi One-to-Many (1 Pelanggan memiliki Banyak Pesanan)

```csharp
public class Pelanggan
{
    public Guid Id { get; set; }
    public string Nama { get; set; } = string.Empty;
    public List<Pesanan> DaftarPesanan { get; set; } = []; // Navigation Property Koleksi
}

public class Pesanan
{
    public Guid Id { get; set; }
    public DateTime Tanggal { get; set; }
    public Guid PelangganId { get; set; }                  // Foreign Key eksplisit
    public Pelanggan? Pelanggan { get; set; }              // Navigation Property Referensi
}

// Konfigurasi Fluent API:
modelBuilder.Entity<Pesanan>(entity =>
{
    entity.HasOne(pesanan => pesanan.Pelanggan)
          .WithMany(pelanggan => pelanggan.DaftarPesanan)
          .HasForeignKey(pesanan => pesanan.PelangganId)
          .OnDelete(DeleteBehavior.Restrict); // Jangan izinkan hapus pelanggan jika masih punya pesanan!
});
```

### 2. Aturan Perilaku Penghapusan (`DeleteBehavior`)
* **`Cascade`:** Jika data induk dihapus, seluruh data anak yang terkait otomatis ikut terhapus di database. Cocok untuk relasi kuat seperti `Pesanan -> ItemPesanan`.
* **`Restrict`:** Database menolak penghapusan data induk jika masih ada data anak yang mereferensikannya. Mencegah kehilangan riwayat transaksi secara tidak sengaja.
* **`SetNull`:** Kolom foreign key pada data anak diubah menjadi `NULL` jika data induk dihapus.

---

## 7. 🟡 Change Tracker Internal: 5 Status Entitas dan SaveChanges

### Konsep

Ketika entitas ditarik dari database melalui kueri biasa, `DbContext` menyimpan snapshot entitas tersebut di dalam memori yang disebut **Change Tracker**.

Setiap entitas memiliki salah satu dari 5 status (*EntityState*):

```text
       ┌───────────┐
       │ Detached  │ ──> Tidak dilacak oleh DbContext
       └─────┬─────┘
             │ Attach() / Kueri dari DB
             ▼
       ┌───────────┐
       │ Unchanged │ ──> Sama persis dengan data di database
       └─────┬─────┘
             │ Properti diubah
             ▼
       ┌───────────┐
       │ Modified  │ ──> Menghasilkan perintah: UPDATE ... WHERE Id = ...
       └───────────┘
```

1. **`Detached`:** Entitas tidak dilacak oleh konteks.
2. **`Unchanged`:** Properti entitas identik dengan nilai di database.
3. **`Added`:** Entitas baru (`Add()`), belum ada di database. Saat `SaveChanges()` dipanggil, akan dieksekusi perintah `INSERT`.
4. **`Modified`:** Satu atau beberapa properti telah diubah. Saat `SaveChanges()` dipanggil, akan dieksekusi perintah `UPDATE`.
5. **`Deleted`:** Entitas ditandai untuk dihapus (`Remove()`). Saat `SaveChanges()` dipanggil, akan dieksekusi perintah `DELETE`.

---

## 8. 🟡 Optimasi Kueri Baca: AsNoTracking dan Proyeksi LINQ

### Konsep

Secara default, setiap objek yang Anda tarik via kueri LINQ otomatis dimasukkan ke dalam Change Tracker. Proses pelacakan ini membutuhkan alokasi memori ekstra untuk menyimpan *snapshot* objek dan membandingkan perubahan properti (*snapshot diffing*).

Pada endpoint REST API membaca data (seperti `GET /api/v1/produk`), data hanya dibaca untuk diubah menjadi JSON dan tidak pernah dimutasi kembali ke database!

### Keuntungan Dramatis `.AsNoTracking()`

```csharp
// ❌ BOROS: Objek disimpan di Change Tracker padahal hanya untuk dibaca
var produk = await dbContext.DaftarProduk.ToListAsync();

// ✅ HEMAT & CEPAT: Mematikan Change Tracker (Hemat RAM hingga 50% & CPU 3x lebih cepat)
var produkAman = await dbContext.DaftarProduk
    .AsNoTracking()
    .ToListAsync();
```

### Proyeksi LINQ Langsung ke DTO (Trik Performa Teratas)

Cara tercepat membaca data dari database adalah menggunakan operator `.Select()` langsung ke kelas DTO:

```csharp
// Kueri SQL yang dihasilkan HANYA mengambil kolom id dan nama!
// Kolom deskripsi_panjang, metadata, dan gambar TIDAK ditarik dari database!
var daftarDto = await dbContext.DaftarProduk
    .AsNoTracking()
    .Where(p => p.Harga > 100000)
    .Select(p => new ProdukRingkasDto(p.Id, p.Nama, p.Harga))
    .ToListAsync();
```

---

## 9. 🔴 Pencegahan N+1 Problem: Eager Loading vs Lazy Loading

### Konsep

**N+1 Query Problem** adalah bencana performa paling umum pada aplikasi yang menggunakan ORM.

Masalah terjadi ketika Anda ingin menampilkan daftar 100 pelanggan beserta kota alamatnya:
* Kueri 1: `SELECT * FROM Customers;` (Menghasilkan 100 pelanggan).
* Kueri 2 s/d 101: Loop berjalan, dan untuk setiap pelanggan aplikasi mengirim kueri tambahan: `SELECT * FROM Addresses WHERE CustomerId = ...;`.
* **Total:** $1 + 100 = 101$ kueri dikirim ke database secara bolak-balik melalui jaringan (*network roundtrips*)!

### Solusi: Eager Loading Menggunakan `.Include()`

EF Core menggabungkan kueri menggunakan klausa `JOIN` di server database sehingga seluruh data induk dan anak ditarik hanya dalam **1 kali kueri tunggal**:

```csharp
// Mengambil Pelanggan sekaligus seluruh Pesanannya dalam 1 kueri database
var data = await dbContext.DaftarPelanggan
    .AsNoTracking()
    .Include(p => p.DaftarPesanan)              // Tarik tabel Pesanan
        .ThenInclude(pesanan => pesanan.Items)  // Tarik tabel Item di dalam Pesanan
    .ToListAsync();
```

---

## 10. 🔴 Cartesian Explosion Trap dan Solusi AsSplitQuery

### Masalah

Meskipun Eager Loading (`Include`) memecahkan masalah N+1, ada bahaya laten ketika Anda me-`Include` banyak koleksi anak sekaligus: **Cartesian Explosion**.

Misalkan sebuah Pelanggan memiliki 20 Pesanan dan 10 Alamat:
* Jika database menggabungkannya dalam 1 kueri SQL `LEFT JOIN`, database akan mengembalikan perkalian baris: $1 	imes 20 	imes 10 = 200$ baris data!
* Seluruh kolom induk `Pelanggan` (nama, email, no telepon) akan **diduplikasi berulang-ulang sebanyak 200 kali** melalui jaringan kawat database, memboroskan bandwidth jaringan dan memori aplikasi.

### Solusi: `AsSplitQuery()`

Diperkenalkan dan disempurnakan di .NET modern, operator **`AsSplitQuery()`** memerintahkan EF Core untuk membagi pengambilan data menjadi beberapa kueri SQL terpisah yang rapi:
* Kueri 1: Ambil data Pelanggan.
* Kueri 2: Ambil data Pesanan untuk pelanggan tersebut.
* Kueri 3: Ambil data Alamat untuk pelanggan tersebut.

EF Core secara otomatis menyatukan ketiga hasil kueri tersebut menjadi objek C# yang utuh di memori tanpa duplikasi cartesian!

```csharp
var hasilAman = await dbContext.DaftarPelanggan
    .AsNoTracking()
    .Include(p => p.DaftarPesanan)
    .Include(p => p.DaftarAlamat)
    .AsSplitQuery() // Melenyapkan Cartesian Explosion!
    .ToListAsync();
```

---

## 11. 🔴 Value Converters dan Complex Types di EF Core 10

### 1. Value Converters
Memungkinkan Anda menyimpan tipe data C# ke dalam tipe kolom database yang berbeda, dan secara otomatis mengonversinya bolak-balik.

Contoh: Menyimpan C# `Strongly-Typed ID` atau `List<string>` tags ke format JSON/String di database:
```csharp
modelBuilder.Entity<Artikel>()
    .Property(a => a.Tags)
    .HasConversion(
        tags => string.Join(',', tags),          // C# ke DB: List diubah jadi string "csharp,dotnet"
        str => str.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList() // DB ke C#
    );
```

### 2. Complex Types (Value Objects di Domain-Driven Design)
Di EF Core 10, fitur **Complex Types** memungkinkan pemodelan objek nilai tanpa identitas (*Value Object*) seperti `AlamatRumah(Jalan, Kota, KodePos)` yang kolom-kolomnya disimpan menyatu di tabel yang sama dengan entitas induk tanpa memerlukan primary key terpisah:

```csharp
modelBuilder.Entity<Pengguna>()
    .ComplexProperty(p => p.AlamatUtama); // Otomatis membuat kolom alamat_utama_jalan, alamat_utama_kota
```

---

## 12. 🔴 Audit Trail Otomatis Menggunakan SaveChanges Interceptor

### Konsep

Dalam standar kepatuhan enterprise, setiap baris data di database wajib memiliki rekam jejak audit: kapan data dibuat (`CreatedAtUtc`) dan kapan terakhir kali diperbarui (`UpdatedAtUtc`).

Jangan mengisi properti audit ini secara manual di setiap service bisnis! Gunakan **`ISaveChangesInterceptor`** agar pengisian audit terjadi secara otomatis dan tidak pernah terlupa setiap kali `SaveChangesAsync` dipanggil.

### Implementasi Audit Interceptor

```csharp
using Microsoft.EntityFrameworkCore.Diagnostics;

public interface IEntitasAudit
{
    DateTime CreatedAtUtc { get; set; }
    DateTime? UpdatedAtUtc { get; set; }
}

public sealed class AuditSaveChangesInterceptor : SaveChangesInterceptor
{
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData, 
        InterceptionResult<int> result, 
        CancellationToken cancellationToken = default)
    {
        if (eventData.Context is not null)
        {
            var waktuSekarang = DateTime.UtcNow;

            foreach (var entry in eventData.Context.ChangeTracker.Entries<IEntitasAudit>())
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedAtUtc = waktuSekarang;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedAtUtc = waktuSekarang;
                }
            }
        }

        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }
}
```

Pendaftaran di `Program.cs`:
```csharp
builder.Services.AddSingleton<AuditSaveChangesInterceptor>();

builder.Services.AddDbContextPool<AplikasiDbContext>((sp, options) =>
{
    options.UseNpgsql(connectionString)
           .AddInterceptors(sp.GetRequiredService<AuditSaveChangesInterceptor>());
});
```

---

## 13. 🛠️ Best Practice Performa & Arsitektur EF Core

### 1. Selalu Gunakan `AsNoTracking()` pada Kueri Read-Only
Setiap kueri yang hanya bertujuan untuk menampilkan data ke layar atau mengembalikan respon HTTP wajib menggunakan `.AsNoTracking()`.

### 2. Hindari Penggunaan InMemory Database Provider untuk Pengujian Integrasi
InMemory provider bawaan Microsoft **tidak mendukung constraint SQL, transaksi ACID, maupun dialek SQL spesifik**. Gunakan **Testcontainers** dengan mesin database PostgreSQL asli yang berjalan di Docker untuk pengujian integrasi yang akurat.

### 3. Batasi Ukuran Hasil Kueri dengan Paginasi
Jangan pernah memanggil `.ToListAsync()` tanpa klausa `.Take(pageSize)`. Mengambil 100.000 data sekaligus ke memori akan memicu *Garbage Collection pause* dan potensi *Out of Memory*.

---

## 14. 🛠️ Kesalahan Umum Pemula

### 1. Melakukan Filtering Data di Memori (Client-Side Evaluation)

❌ **Salah:**
```csharp
// Memanggil ToListAsync() DULUAN, baru menyaring dengan Where!
// Seluruh 2.000.000 data ditarik ke RAM baru difilter!
var hasil = (await dbContext.Pesanan.ToListAsync())
    .Where(p => p.Total > 500000);
```

✅ **Benar:**
```csharp
// Where dipanggil sebelum ToListAsync()!
// Klausa WHERE dieksekusi langsung di mesin database SQL!
var hasil = await dbContext.Pesanan
    .Where(p => p.Total > 500000)
    .ToListAsync();
```

---

### 2. Memanggil `SaveChangesAsync()` di Dalam Perulangan (Loop)

❌ **Salah:**
```csharp
foreach (var item in daftarBaru)
{
    dbContext.Produk.Add(item);
    await dbContext.SaveChangesAsync(); // 1.000 kali roundtrip jaringan ke database!
}
```

✅ **Benar:**
```csharp
dbContext.Produk.AddRange(daftarBaru);
await dbContext.SaveChangesAsync(); // 1 kali kirim dalam 1 transaksi batch tunggal!
```

---

## 15. 🛠️ Mini Project: High-Performance Relational Order Engine

### Tujuan

Membangun modul pemrosesan pesanan relasional menggunakan EF Core 10 dan C# 14:
1. Memodelkan entitas relasional `Order` dan `OrderItem` (One-to-Many) dengan Fluent API.
2. Menerapkan otomatisasi audit timestamp menggunakan `ISaveChangesInterceptor`.
3. Mengambil grafik pesanan lengkap menggunakan Eager Loading bebas kembung via `AsSplitQuery()` dan `AsNoTracking()`.
4. Menerapkan transaksi atomik *Unit of Work*.

### Implementasi Lengkap (C# 14 / .NET 10 LTS)

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace RelationalOrderEngine;

// 1. KONTRAK AUDIT & ENTITAS DOMAIN
public interface IEntitasAudit
{
    DateTime CreatedAtUtc { get; set; }
    DateTime? UpdatedAtUtc { get; set; }
}

public sealed class Order : IEntitasAudit
{
    public Guid Id { get; set; }
    public string NomorInvoice { get; set; } = string.Empty;
    public string NamaPelanggan { get; set; } = string.Empty;
    public decimal TotalTagihan { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }

    // Navigation Property Relasi 1-to-N
    public List<OrderItem> Items { get; set; } = [];
}

public sealed class OrderItem
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public string SkuProduk { get; set; } = string.Empty;
    public int Kuantitas { get; set; }
    public decimal HargaSatuan { get; set; }

    // Navigation Property Balik
    public Order? OrderInduk { get; set; }
}

// 2. AUDIT INTERCEPTOR OTOMATIS
public sealed class AuditTimestampInterceptor : SaveChangesInterceptor
{
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData, 
        InterceptionResult<int> result, 
        CancellationToken cancellationToken = default)
    {
        if (eventData.Context is not null)
        {
            var waktuSekarang = DateTime.UtcNow;
            foreach (var entry in eventData.Context.ChangeTracker.Entries<IEntitasAudit>())
            {
                if (entry.State == EntityState.Added) entry.Entity.CreatedAtUtc = waktuSekarang;
                else if (entry.State == EntityState.Modified) entry.Entity.UpdatedAtUtc = waktuSekarang;
            }
        }

        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }
}

// 3. KELAS DBCONTEXT TERPADU
public sealed class OrderDbContext(DbContextOptions<OrderDbContext> options) : DbContext(options)
{
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Konfigurasi Entitas Order
        modelBuilder.Entity<Order>(entity =>
        {
            entity.ToTable("orders");
            entity.HasKey(o => o.Id);
            entity.Property(o => o.NomorInvoice).HasMaxLength(50).IsRequired();
            entity.HasIndex(o => o.NomorInvoice).IsUnique();
            entity.Property(o => o.NamaPelanggan).HasMaxLength(100).IsRequired();
            entity.Property(o => o.TotalTagihan).HasPrecision(18, 2);

            // Relasi 1-to-N dengan OrderItem
            entity.HasMany(o => o.Items)
                  .WithOne(i => i.OrderInduk)
                  .HasForeignKey(i => i.OrderId)
                  .OnDelete(DeleteBehavior.Cascade); // Jika order dihapus, itemnya otomatis ikut terhapus
        });

        // Konfigurasi Entitas OrderItem
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.ToTable("order_items");
            entity.HasKey(i => i.Id);
            entity.Property(i => i.SkuProduk).HasMaxLength(50).IsRequired();
            entity.Property(i => i.HargaSatuan).HasPrecision(18, 2);
        });
    }
}

// 4. PROGRAM TEST RUNNER
public static class Program
{
    public static async Task Main()
    {
        Console.WriteLine("=== SISTEM REKAYASA RELASIONAL EF CORE 10 (.NET 10 LTS) ===
");

        var optionsBuilder = new DbContextOptionsBuilder<OrderDbContext>();
        optionsBuilder.UseInMemoryDatabase("TestOrderDb") // Menggunakan InMemory untuk demonstrasi mandiri
                      .AddInterceptors(new AuditTimestampInterceptor());

        using var context = new OrderDbContext(optionsBuilder.Options);

        // 1. MEMBUAT PESANAN BARU DENGAN BEBERAPA ITEM ANAK
        Console.WriteLine("--- 1. Membuat Data Pesanan Baru Transaksional ---");
        var pesananBaru = new Order
        {
            Id = Guid.NewGuid(),
            NomorInvoice = "INV-2026-OCT-0901",
            NamaPelanggan = "Budi Hartono",
            Items = [
                new() { Id = Guid.NewGuid(), SkuProduk = "LAPTOP-PRO-16", Kuantitas = 1, HargaSatuan = 24000000m },
                new() { Id = Guid.NewGuid(), SkuProduk = "MOUSE-WIRELESS", Kuantitas = 2, HargaSatuan = 350000m }
            ]
        };
        pesananBaru.TotalTagihan = pesananBaru.Items.Sum(i => i.Kuantitas * i.HargaSatuan);

        context.Orders.Add(pesananBaru);
        await context.SaveChangesAsync(); // Interceptor otomatis mengisi CreatedAtUtc di sini!

        Console.WriteLine($"✓ Pesanan tersimpan: {pesananBaru.NomorInvoice}");
        Console.WriteLine($"✓ Timestamp Audit Otomatis (Interceptor): {pesananBaru.CreatedAtUtc:yyyy-MM-dd HH:mm:ss} UTC
");

        // 2. QUERY OPTIMASI TINGGI DENGAN AsSplitQuery & AsNoTracking
        Console.WriteLine("--- 2. Membaca Grafik Relasi dengan AsSplitQuery() ---");
        var orderDariDb = await context.Orders
            .AsNoTracking()
            .Include(o => o.Items)
            .AsSplitQuery() // Memastikan tidak terjadi Cartesian Explosion
            .FirstOrDefaultAsync(o => o.NomorInvoice == "INV-2026-OCT-0901");

        if (orderDariDb is not null)
        {
            Console.WriteLine($"Invoice : {orderDariDb.NomorInvoice}");
            Console.WriteLine($"Customer: {orderDariDb.NamaPelanggan}");
            Console.WriteLine($"Total   : Rp{orderDariDb.TotalTagihan:N0}");
            Console.WriteLine("Rincian Item:");
            foreach (var item in orderDariDb.Items)
            {
                Console.WriteLine($"  * SKU: {item.SkuProduk,-16} | Qty: {item.Kuantitas} | Satuan: Rp{item.HargaSatuan:N0}");
            }
        }
    }
}
```

### Hasil Eksekusi

```text
=== SISTEM REKAYASA RELASIONAL EF CORE 10 (.NET 10 LTS) ===

--- 1. Membuat Data Pesanan Baru Transaksional ---
✓ Pesanan tersimpan: INV-2026-OCT-0901
✓ Timestamp Audit Otomatis (Interceptor): 2026-10-09 23:35:12 UTC

--- 2. Membaca Grafik Relasi dengan AsSplitQuery() ---
Invoice : INV-2026-OCT-0901
Customer: Budi Hartono
Total   : Rp24,700,000
Rincian Item:
  * SKU: LAPTOP-PRO-16   | Qty: 1 | Satuan: Rp24,000,000
  * SKU: MOUSE-WIRELESS  | Qty: 2 | Satuan: Rp350,000
```

---

## 16. 📚 Peta Ingatan

```text
EF Core 10 Architecture Landscape
├── Core Constructs
│   ├── DbContext               -> Unit of Work managing entity transactions
│   ├── DbSet<T>                -> Repository interface per database table
│   └── Change Tracker          -> 5 States: Detached, Unchanged, Added, Modified, Deleted
├── Schema Design
│   ├── Code-First Migrations   -> add, update, script --idempotent
│   └── Fluent API              -> OnModelCreating, HasKey, HasIndex, OnDelete
├── Query Optimization
│   ├── AsNoTracking()          -> Zero tracking overhead for read-only APIs
│   ├── Include + ThenInclude   -> Eager loading resolving N+1 Problem
│   ├── AsSplitQuery()          -> Eliminates Cartesian Explosion in multi-joins
│   └── LINQ Projection         -> Select directly into DTOs
└── Advanced Features
    ├── Value Converters        -> Custom type mapping (JSON / Enums)
    ├── Complex Types           -> DDD Value Objects without separate tables
    └── Interceptors            -> ISaveChangesInterceptor automated audit trails
```

---

## 17. 📚 Cheat Code 10 Detik

```text
AddDbContextPool<T>()          -> registrasi DbContext dengan koneksi pooling
AsNoTracking()                 -> matikan Change Tracker untuk kueri baca cepat
Include(x => x.Anak)           -> Eager loading untuk mengatasi N+1 query problem
AsSplitQuery()                 -> pisahkan kueri join multi-tabel cegah Cartesian explosion
context.Entry(e).State = ...   -> ubah status entitas di Change Tracker secara manual
OnModelCreating(builder)       -> pusat konfigurasi Fluent API skema tabel
HasForeignKey(x => x.IndukId)  -> menentukan kolom kunci asing secara eksplisit
OnDelete(DeleteBehavior.Cascade)-> hapus anak otomatis jika data induk dihapus
ISaveChangesInterceptor        -> kait otomatis sebelum/setelah SaveChanges dieksekusi
dotnet ef migrations add <Nama> -> membuat skrip evolusi skema database baru
```

---

## 18. 🧭 Urutan Belajar Berikutnya

Lanjutkan perjalanan backend Anda ke aspek yang paling fundamental dalam rekayasa enterprise: keamanan data dan otorisasi:

1. **Lanjutkan ke [[dotnet-security|Keamanan & Autentikasi ASP.NET Core]] (Modul 4):**
   * Pelajari arsitektur autentikasi token berbasis **JSON Web Token (JWT Bearer)**.
   * Kuasai sistem otorisasi tingkat lanjut: **Role-based** vs **Policy-based Authorization** (Requirements & Handlers).
   * Terapkan algoritma *Password Hashing* yang aman menggunakan `IPasswordHasher<T>`.
   * Lindungi server dari serangan DDoS dan abuse menggunakan **Rate Limiting Middleware bawaan .NET**.
   * Kelola rahasia produksi secara aman (*Secret Management*).

---

## 19. 🔗 Referensi Resmi

* [Entity Framework Core Overview - Microsoft Learn](https://learn.microsoft.com/en-us/ef/core/)
* [Efficient Querying in EF Core - Microsoft Architecture Guide](https://learn.microsoft.com/en-us/ef/core/performance/efficient-querying)
* [Change Tracking in EF Core - Microsoft Documentation](https://learn.microsoft.com/en-us/ef/core/change-tracking/)
* [Savechanges Interceptors - EF Core Advanced Features](https://learn.microsoft.com/en-us/ef/core/logging-events-diagnostics/interceptors)
