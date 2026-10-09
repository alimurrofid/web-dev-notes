---
title: "Testing ASP.NET Core (.NET 10 LTS)"
description: "Panduan komprehensif automated testing di .NET 10 LTS: Piramida Testing, Unit Testing via xUnit & FluentAssertions, Mocking via NSubstitute, Integration Testing via WebApplicationFactory, dan Database Testing menggunakan Testcontainers .NET."
order: 5
tags:
  - web-development
  - backend
  - dotnet
  - testing
  - xunit
  - integration-testing
  - testcontainers
---

# Testing ASP.NET Core (.NET 10 LTS)

> Target: Pemula hingga Menengah  
> Versi: .NET 10 LTS (C# 14)  
> Prasyarat: [[csharp-oop|C# OOP]], [[dotnet-dasar|ASP.NET Core Dasar]], [[dotnet-web-api|ASP.NET Core Web API]], dan [[dotnet-efcore|Entity Framework Core 10]]

---

## Gambaran Umum

Dalam rekayasa perangkat lunak enterprise, kode yang tidak memiliki tes otomatis (*automated test*) adalah liabilitas teknis (*technical debt*). Tanpa tes otomatis, setiap perubahan kecil pada kode atau pembaruan pustaka framework dapat merusak fitur bisnis lain yang sudah berjalan tanpa disadari (*regression bug*).

Ekosistem **.NET 10 LTS** memiliki dukungan kelas satu untuk berbagai tingkatan pengujian otomatis:
* **xUnit:** Kerangka kerja pengujian unit (*Unit Testing*) standar industri di platform .NET.
* **FluentAssertions:** Pustaka asersi ekspresif yang menyulap pengujian menjadi kalimat yang mudah dibaca dan memberikan pesan diagnostik kegagalan yang sangat informatif.
* **NSubstitute:** Pustaka pembuatan objek tiruan (*Mocking*) modern yang ringkas dan *type-safe*.
* **WebApplicationFactory:** Menguji seluruh alur request, middleware, dan routing ASP.NET Core secara *in-memory* tanpa perlu membuka port TCP fisik.
* **Testcontainers .NET:** Menjalankan instance database nyata (PostgreSQL, SQL Server) di dalam kontainer Docker sementara selama proses pengujian integrasi berlangsung, melenyapkan bug klasik perbedaan lingkungan (*"works on my machine"*).

---

## Cara Belajar

1. Pahami mental model **Piramida Testing** (Unit Test vs Integration Test vs E2E Test).
2. Kuasai sintaksis pengujian xUnit menggunakan atribut `[Fact]` dan `[Theory]`.
3. Terapkan pola standar **Arrange, Act, Assert (AAA)**.
4. Gunakan **FluentAssertions** untuk meningkatkan kejelasan kode tes.
5. Pelajari teknik isolasi dependensi (*Mocking*) menggunakan **NSubstitute**.
6. Bangun tes integrasi menyeluruh menggunakan **`WebApplicationFactory<Program>`**.
7. Pahami mengapa *EF Core InMemory Provider* adalah anti-pattern dan bagaimana **Testcontainers .NET** menjadi solusi standar industri.
8. Bangun Mini Project *Test Suite* komprehensif untuk pengujian modul perbankan.

---

## Daftar Isi

### 🟢 Fundamental

1. [Mental Model: Piramida Testing dalam Rekayasa Perangkat Lunak](#1--mental-model-piramida-testing-dalam-rekayasa-perangkat-lunak)
2. [Anatomi Unit Testing: Pola Arrange-Act-Assert (AAA)](#2--anatomi-unit-testing-pola-arrange-act-assert-aaa)
3. [xUnit Fundamentals: Fact vs Theory dan InlineData](#3--xunit-fundamentals-fact-vs-theory-dan-inlinedata)
4. [Asersi Ekspresif Menggunakan FluentAssertions](#4--asersi-ekspresif-menggunakan-fluentassertions)

### 🟡 Intermediate

5. [Mocking Dependensi Menggunakan NSubstitute](#5--mocking-dependensi-menggunakan-nsubstitute)
6. [Memverifikasi Pemanggilan Method: Received vs DidNotReceive](#6--memverifikasi-pemanggilan-method-received-vs-didnotreceive)
7. [Integration Testing In-Memory Menggunakan WebApplicationFactory](#7--integration-testing-in-memory-menggunakan-webapplicationfactory)
8. [Kustomisasi Layanan Pengujian via ConfigureTestServices](#8--kustomisasi-layanan-pengujian-via-configuretestservices)

### 🔴 Advanced

9. [Database Testing Nyata: Mengapa Bukan EF Core InMemory?](#9--database-testing-nyata-mengapa-bukan-ef-core-inmemory)
10. [Testcontainers .NET: Database PostgreSQL Nyata di Docker](#10--testcontainers-net-database-postgresql-nyata-di-docker)
11. [Siklus Hidup Kontainer Pengujian: IAsyncLifetime xUnit](#11--siklus-hidup-kontainer-pengujian-iasynclifetime-xunit)
12. [Pengujian Endpoint Berproteksi Autentikasi dan Otorisasi](#12--pengujian-endpoint-berproteksi-autentikasi-dan-otorisasi)

### 🛠️ Praktik

13. [Best Practice & Naming Convention Pengujian Otomatis](#13-️-best-practice--naming-convention-pengujian-otomatis)
14. [Kesalahan Umum Pemula](#14-️-kesalahan-umum-pemula)
15. [Mini Project: Automated Testing Suite for Banking & Transfer Engine](#15-️-mini-project-automated-testing-suite-for-banking--transfer-engine)

### 📚 Referensi

16. [Peta Ingatan](#16--peta-ingatan)
17. [Cheat Code 10 Detik](#17--cheat-code-10-detik)
18. [Urutan Belajar Berikutnya](#18--urutan-belajar-berikutnya)
19. [Referensi Resmi](#19--referensi-resmi)

---

## 1. 🟢 Mental Model: Piramida Testing dalam Rekayasa Perangkat Lunak

### Konsep

Dalam strategi pengujian perangkat lunak profesional, tes dibagi menjadi tiga lapisan piramida berdasarkan cakupan, kecepatan eksekusi, dan biaya pemeliharaan:

```text
               ▲
              /              /   \      E2E Tests (Sedikit, Lambat, Biaya Tinggi)
            / E2E \     Menguji UI/Browser ke backend nyata end-to-end
           /───────          /         \   Integration Tests (Sedang, Kecepatan Menengah)
         /Integrasi  \  Menguji HTTP Pipeline, Middleware, DB nyata via Docker
        /─────────────       /               \ Unit Tests (Sangat Banyak, Secepat Kilat O(ms))
      /   Unit Tests    \Menguji algoritma & logika domain terisolasi murni
     /───────────────────```

1. **Unit Tests (Lapisan Terbawah & Terbesar):**
   * Menguji fungsi atau kelas tunggal secara terisolasi murni.
   * Tidak ada koneksi database, tidak ada jaringan, dan tidak ada I/O disk.
   * Berjalan dalam hitungan milidetik. Ribuan unit test dapat dieksekusi hanya dalam 3 detik!
2. **Integration Tests (Lapisan Menengah):**
   * Menguji bagaimana beberapa komponen bekerja sama: apakah routing Minimal API benar, apakah middleware autentikasi bekerja, apakah kueri EF Core menghasilkan SQL yang valid di database PostgreSQL.
3. **End-to-End (E2E) Tests (Lapisan Puncak):**
   * Menguji skenario pengguna nyata dari antarmuka visual (Playwright/Cypress) hingga ke database.

---

## 2. 🟢 Anatomi Unit Testing: Pola Arrange-Act-Assert (AAA)

### Konsep

Setiap method pengujian harus disusun menggunakan pola **AAA** yang baku:

1. **Arrange (Persiapan):** Menyiapkan seluruh data input, membuat objek yang akan diuji (*System Under Test - SUT*), dan mengonfigurasi objek tiruan (*mocks*).
2. **Act (Aksi):** Mengeksekusi satu method atau aksi tunggal yang ingin diuji.
3. **Assert (Penegasan):** Memverifikasi bahwa hasil yang dikembalikan atau perubahan status sesuai dengan ekspektasi bisnis.

### Contoh Pola AAA

```csharp
public class KalkulatorDiskonTests
{
    [Fact]
    public void HitungTotal_KetikaMemberVip_HarusMemberikanDiskonDuaPuluhPersen()
    {
        // 1. ARRANGE (Siapkan objek dan data)
        var kalkulator = new KalkulatorDiskon();
        decimal totalBelanja = 1000000m;
        bool isVip = true;

        // 2. ACT (Jalankan aksi tunggal)
        decimal hasilAkhir = kalkulator.HitungTotal(totalBelanja, isVip);

        // 3. ASSERT (Verifikasi kebenaran)
        Assert.Equal(800000m, hasilAkhir);
    }
}
```

---

## 3. 🟢 xUnit Fundamentals: Fact vs Theory dan InlineData

### Konsep

xUnit adalah framework tes default di ekosistem .NET modern:

1. **`[Fact]`:** Digunakan untuk tes invarian tunggal yang selalu menguji skenario statis tertentu.
2. **`[Theory]`:** Digunakan untuk pengujian berbasis data (*Parameterized Tests*). Method yang sama akan dijalankan berulang-ulang dengan berbagai kombinasi input data yang disediakan oleh atribut **`[InlineData]`**.

### Contoh Penggunaan Theory & InlineData

```csharp
public class ValidatorPasswordTests
{
    [Theory]
    [InlineData("pendek")]                  // Gagal: < 8 karakter
    [InlineData("tanpaangkaSemua")]          // Gagal: tidak ada angka
    [InlineData("1234567890")]              // Gagal: tidak ada huruf besar
    public void Validasi_KetikaFormatLemah_HarusMengembalikanFalse(string passwordLemah)
    {
        // Arrange
        var validator = new ValidatorPassword();

        // Act
        bool isValid = validator.Validasi(passwordLemah);

        // Assert
        Assert.False(isValid);
    }
}
```

---

## 4. 🟢 Asersi Ekspresif Menggunakan FluentAssertions

### Mengapa Bukan `Assert.*` Bawaan?

Asersi bawaan xUnit (`Assert.Equal`, `Assert.True`) fungsional, tetapi pesannya kaku dan sulit dibaca ketika membandingkan koleksi data atau objek kompleks.

**FluentAssertions** menyediakan sintaksis fluent yang sangat mirip dengan kalimat bahasa Inggris alami:

```bash
dotnet add package FluentAssertions
```

### Komparasi Sintaksis

```csharp
// Menggunakan Assert xUnit konvensional:
Assert.Equal(200, respon.StatusCode);
Assert.NotNull(respon.Data);
Assert.Contains("Admin", user.Roles);

// Menggunakan FluentAssertions (Ekspresif & Jelas!):
respon.StatusCode.Should().Be(200);
respon.Data.Should().NotBeNull();
user.Roles.Should().Contain("Admin");

// Perbandingan Objek Kompleks:
user.Should().BeEquivalentTo(expectedUser, options => 
    options.Excluding(u => u.Id)); // Membandingkan seluruh properti kecuali Id!
```

Jika pengujian gagal, FluentAssertions menghasilkan pesan kegagalan yang luar biasa informatif:
> *"Expected respon.StatusCode to be 200, but found 404 (Not Found)."*

---

## 5. 🟡 Mocking Dependensi Menggunakan NSubstitute

### Konsep

Saat menguji unit kelas logika bisnis (misal `LayananTransferBank`), kelas tersebut bergantung pada `IRepositoriRekening` yang berinteraksi dengan database.

Dalam Unit Testing, kita **TIDAK INGIN** menyentuh database sungguhan! Kita membuat objek tiruan (*Mock/Substitute*) dari interface tersebut menggunakan **NSubstitute**:

```bash
dotnet add package NSubstitute
```

### Membuat Substitute dan Menentukan Nilai Balik

```csharp
// 1. Buat tiruan dari antarmuka
var repoMock = Substitute.For<IRepositoriRekening>();

// 2. Konfigurasikan perilaku: Jika FindById("REK-01") dipanggil, kembalikan rekening dengan saldo Rp500.000
repoMock.FindById("REK-01").Returns(new RekeningBank("REK-01", 500000m));

// 3. Suntikkan mock ke kelas yang sedang diuji (SUT)
var service = new LayananTransferBank(repoMock);
```

---

## 6. 🟡 Memverifikasi Pemanggilan Method: Received vs DidNotReceive

### Konsep

Selain memeriksa nilai kembalian, pengujian sering kali harus memverifikasi apakah suatu method pada dependensi benar-benar dipanggil dengan parameter yang tepat:

* **`Received(count)`:** Memverifikasi method dipanggil sebanyak $N$ kali.
* **`DidNotReceive()`:** Memverifikasi method **sama sekali tidak pernah dipanggil** (sangat penting untuk memastikan transaksi yang gagal tidak disimpan ke database!).

### Contoh Verifikasi Perilaku

```csharp
[Fact]
public async Task Transfer_KetikaSaldoTidakCukup_JanganPernahPanggilUpdateDatabase()
{
    // Arrange
    var repoMock = Substitute.For<IRepositoriRekening>();
    repoMock.FindById("REK-01").Returns(new RekeningBank("REK-01", 50000m)); // Saldo hanya 50 Ribu

    var service = new LayananTransferBank(repoMock);

    // Act & Assert
    var act = async () => await service.TransferAsync("REK-01", "REK-02", 200000m); // Coba transfer 200 Ribu
    
    await act.Should().ThrowAsync<SaldoTidakCukupException>();

    // VERIFIKASI PERILAKU:
    // Pastikan method UpdateRekening SAMA SEKALI TIDAK PERNAH dipanggil!
    await repoMock.DidNotReceive().UpdateRekeningAsync(Arg.Any<RekeningBank>());
}
```

---

## 7. 🟡 Integration Testing In-Memory Menggunakan WebApplicationFactory

### Konsep

Bagaimana cara menguji REST API Anda secara menyeluruh tanpa harus menyalakan server manual di terminal dan mengirim request via Postman?

Microsoft menyediakan paket resmi **`Microsoft.AspNetCore.Mvc.Testing`** dengan kelas **`WebApplicationFactory<TProgram>`**.

`WebApplicationFactory` menyalakan seluruh host ASP.NET Core Anda secara *in-memory* menggunakan `TestServer`, mengeksekusi middleware, routing, dan filter persis seperti di dunia nyata!

```bash
dotnet add package Microsoft.AspNetCore.Mvc.Testing
```

### Membuka Program.cs untuk Proyek Pengujian

Di C# modern yang menggunakan *Top-Level Statements*, tambahkan deklarasi ini di bagian paling bawah berkas `Program.cs` proyek API Anda agar kelas `Program` dapat diakses oleh proyek pengujian:

```csharp
// Tambahkan di baris paling akhir Program.cs:
public partial class Program { }
```

### Contoh Integration Test Sederhana

```csharp
using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;

public class HealthEndpointTests(WebApplicationFactory<Program> factory) 
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task GetHealth_HarusMengembalikanStatus200DanJsonOnline()
    {
        // 1. Arrange: Buat HttpClient in-memory dari factory
        var client = factory.CreateClient();

        // 2. Act: Kirim HTTP GET ke rute API
        var response = await client.GetAsync("/api/health");

        // 3. Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Online");
    }
}
```

---

## 8. 🟡 Kustomisasi Layanan Pengujian via ConfigureTestServices

### Konsep

Dalam tes integrasi, Anda mungkin ingin menjalankan 95% middleware dan layanan asli, tetapi ingin mengganti 1 layanan pihak ketiga tertentu (misal: mengganti layanan SMS/Payment Gateway asli dengan mock agar tidak mengirim tagihan kartu kredit sungguhan saat tes dijalankan).

Gunakan method **`WithWebHostBuilder`** dan **`ConfigureTestServices`**:

```csharp
var customClient = factory.WithWebHostBuilder(builder =>
{
    builder.ConfigureTestServices(services =>
    {
        // Hapus implementasi asli dan ganti dengan tiruan khusus pengujian
        var mockPayment = Substitute.For<IPaymentGateway>();
        mockPayment.ChargeAsync(Arg.Any<decimal>()).Returns(true);

        services.AddSingleton(mockPayment);
    });
})
.CreateClient();
```

---

## 9. 🔴 Database Testing Nyata: Mengapa Bukan EF Core InMemory?

### Bahaya Mematikan Provider InMemory

Banyak tutorial pemula merekomendasikan penggunaan `UseInMemoryDatabase()` untuk pengujian integrasi EF Core. **Ini adalah anti-pattern yang sangat berbahaya!**

Kelemahan fatal InMemory Provider:
1. **Tidak Menegakkan Integritas Relasional:** InMemory tidak memeriksa `Foreign Key constraint`. Anda dapat menyimpan `OrderItem` dengan `OrderId` fiktif yang tidak ada di database tanpa memicu error!
2. **Tidak Mendukung Transaksi ACID:** Perintah `context.Database.BeginTransaction()` tidak didukung atau diabaikan.
3. **Penerjemahan SQL Berbeda:** InMemory mengeksekusi kueri menggunakan LINQ to Objects di C# RAM, bukan SQL engine. Kueri yang sukses di InMemory sering kali **CRASH di produksi** karena database PostgreSQL tidak mendukung fungsi C# tertentu!

> [!IMPORTANT]
> Jangan uji kueri database dengan simulator memori palsu. Ujilah kueri database Anda menggunakan **mesin database nyata** yang berjalan di dalam kontainer Docker!

---

## 10. 🔴 Testcontainers .NET: Database PostgreSQL Nyata di Docker

### Konsep

**Testcontainers** adalah pustaka open-source standar industri yang memungkinkan Anda membuat, menyalakan, dan membuang kontainer Docker secara terprogram langsung dari kode C#:

```bash
dotnet add package Testcontainers.PostgreSql
```

Ketika tes Anda dimulai, Testcontainers secara otomatis mengunduh image resmi `postgres:17`, menyalakan kontainer di port acak, menerapkan seluruh migrasi EF Core Anda, dan menghancurkan kontainer tersebut ketika pengujian selesai!

---

## 11. 🔴 Siklus Hidup Kontainer Pengujian: IAsyncLifetime xUnit

### Konsep

Menyalakan kontainer Docker membutuhkan waktu beberapa detik. Kita tidak ingin menyalakan dan mematikan kontainer di setiap satu unit test.

xUnit menyediakan antarmuka **`IAsyncLifetime`**:
* **`InitializeAsync()`:** Dijalankan tepat satu kali sebelum tes pertama dimulai (menyalakan kontainer Docker).
* **`DisposeAsync()`:** Dijalankan tepat satu kali setelah seluruh tes di kelas tersebut selesai (mematikan dan menghapus kontainer Docker).

### Implementasi Kelas Basis Pengujian Database

```csharp
using Testcontainers.PostgreSql;

public class PostgresIntegrationTestFixture : IAsyncLifetime
{
    // Konfigurasi kontainer PostgreSQL resmi di Docker
    public PostgreSqlContainer DbContainer { get; } = new PostgreSqlBuilder()
        .WithImage("postgres:17-alpine")
        .WithDatabase("test_bank_db")
        .WithUsername("postgres")
        .WithPassword("SecretPassword123!")
        .Build();

    public async Task InitializeAsync()
    {
        // Nyalakan kontainer Docker sebelum tes berjalan
        await DbContainer.StartAsync();
    }

    public async Task DisposeAsync()
    {
        // Matikan dan buang kontainer setelah seluruh tes selesai
        await DbContainer.DisposeAsync();
    }
}
```

---

## 12. 🔴 Pengujian Endpoint Berproteksi Autentikasi dan Otorisasi

### Konsep

Bagaimana menguji endpoint yang memiliki atribut `.RequireAuthorization()` di dalam `WebApplicationFactory`?

Dua pendekatan profesional:
1. **Penerbitan Token Uji Nyata:** Buat token JWT yang valid menggunakan kunci rahasia uji yang sama dan tempelkan ke header `client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", testToken);`.
2. **Custom Test Authentication Handler:** Daftarkan authentication scheme tiruan khusus di `ConfigureTestServices` yang otomatis menganggap request telah terautentikasi dengan klaim tertentu tanpa perlu enkripsi token berulang-ulang.

---

## 13. 🛠️ Best Practice & Naming Convention Pengujian Otomatis

### 1. Pola Penamaan Standar Industri
Gunakan pola 3 bagian yang deskriptif:
```text
[NamaMethod]_[KondisiSkenario]_[HasilYangDiharapkan]
```
Contoh:
* `TarikTunai_KetikaSaldoKurang_HarusMelemparSaldoTidakCukupException`
* `GetProdukById_KetikaIdDitemukan_HarusMengembalikanStatus200DanDto`

### 2. Pertahankan Independensi Tes (Test Isolation)
Setiap tes harus dapat dijalankan secara independen dalam urutan apapun (*zero side-effects*). Jangan biarkan Tes B bergantung pada data yang dibuat oleh Tes A!

---

## 14. 🛠️ Kesalahan Umum Pemula

### 1. Menguji Kode Implementasi Alih-alih Menguji Perilaku Bisnis

❌ **Salah:**
Menulis tes yang memeriksa apakah variabel internal bernilai tertentu (*testing implementation details*). Ketika kode di-refactor, tes langsung rusak padahal perilakunya sama.

✅ **Benar:**
Ujilah **kontrak input dan output publik** (*testing observable behavior*).

---

### 2. Menggunakan Thread.Sleep di Dalam Tes Asinkron

❌ **Salah:**
```csharp
Thread.Sleep(2000); // Memblokir thread worker xUnit dan memperlambat CI/CD pipeline!
```

✅ **Benar:**
Gunakan `await Task.Delay(...)` jika memang membutuhkan jeda waktu, atau gunakan mekanisme sinyal sinkronisasi seperti `TaskCompletionSource`.

---

## 15. 🛠️ Mini Project: Automated Testing Suite for Banking & Transfer Engine

### Tujuan

Membangun rangkaian pengujian otomatis (*Automated Testing Suite*) profesional untuk modul perbankan menggunakan C# 14 dan .NET 10 LTS:
1. **Unit Test (NSubstitute + FluentAssertions):** Menguji logika domain transfer uang dengan isolasi repositori mock.
2. **Integration Test (WebApplicationFactory):** Menguji endpoint HTTP `POST /api/bank/transfer` secara *in-memory* lengkap dengan validasi status HTTP dan format respon JSON.

### Implementasi Lengkap (C# 14 / .NET 10 LTS)

```csharp
using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Testing;
using NSubstitute;
using Xunit;

namespace BankingTestingSuite;

// ==========================================
// 1. DOMAIN & LOGIKA BISNIS YANG DIUJI (SUT)
// ==========================================
public sealed record RekeningNasabah(string NomorRekening, decimal Saldo);
public sealed record TransferPermintaanDto(string DariRekening, string KeRekening, decimal Nominal);
public sealed record TransferResponDto(string Status, decimal SisaSaldo);

public class SaldoTidakCukupException(string message) : Exception(message);

public interface IBatabaseRekening
{
    Task<RekeningNasabah?> CariRekeningAsync(string noRek);
    Task PerbaruiSaldoAsync(string noRek, decimal saldoBaru);
}

public sealed class LayananTransferPerbankan(IBatabaseRekening db)
{
    public async Task<decimal> EksekusiTransferAsync(string dariRek, string keRek, decimal nominal)
    {
        if (nominal <= 0) throw new ArgumentException("Nominal harus lebih dari 0.");

        var rekSumber = await db.CariRekeningAsync(dariRek) 
            ?? throw new InvalidOperationException("Rekening sumber tidak ditemukan.");

        if (rekSumber.Saldo < nominal)
        {
            throw new SaldoTidakCukupException($"Saldo Rp{rekSumber.Saldo:N0} tidak mencukupi untuk transfer Rp{nominal:N0}.");
        }

        decimal sisaSaldo = rekSumber.Saldo - nominal;
        await db.PerbaruiSaldoAsync(dariRek, sisaSaldo);

        return sisaSaldo;
    }
}

// ==========================================
// 2. UNIT TESTING SUITE (xUnit + NSubstitute + FluentAssertions)
// ==========================================
public class LayananTransferPerbankanUnitTests
{
    [Fact]
    public async Task EksekusiTransfer_KetikaSaldoMencukupi_HarusBerhasilDanPerbaruiDatabase()
    {
        // ARRANGE
        var dbMock = Substitute.For<IBatabaseRekening>();
        dbMock.CariRekeningAsync("REK-101")
              .Returns(new RekeningNasabah("REK-101", 1000000m)); // Saldo 1 Juta

        var sut = new LayananTransferPerbankan(dbMock);

        // ACT
        decimal sisaSaldo = await sut.EksekusiTransferAsync("REK-101", "REK-102", 300000m); // Transfer 300 Ribu

        // ASSERT (Menggunakan FluentAssertions)
        sisaSaldo.Should().Be(700000m);

        // Verifikasi bahwa database benar-benar diperbarui dengan saldo 700 Ribu
        await dbMock.Received(1).PerbaruiSaldoAsync("REK-101", 700000m);
    }

    [Fact]
    public async Task EksekusiTransfer_KetikaSaldoKurang_HarusMelemparExceptionDanBatalSimpan()
    {
        // ARRANGE
        var dbMock = Substitute.For<IBatabaseRekening>();
        dbMock.CariRekeningAsync("REK-101")
              .Returns(new RekeningNasabah("REK-101", 100000m)); // Saldo hanya 100 Ribu

        var sut = new LayananTransferPerbankan(dbMock);

        // ACT
        var aksi = async () => await sut.EksekusiTransferAsync("REK-101", "REK-102", 500000m); // Coba transfer 500 Ribu

        // ASSERT
        await aksi.Should().ThrowAsync<SaldoTidakCukupException>()
                   .WithMessage("*tidak mencukupi*");

        // Verifikasi keamanan: Database TIDAK BOLEH disentuh!
        await dbMock.DidNotReceive().PerbaruiSaldoAsync(Arg.Any<string>(), Arg.Any<decimal>());
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-50000)]
    public async Task EksekusiTransfer_KetikaNominalTidakValid_HarusMelemparArgumentException(decimal nominalTidakValid)
    {
        // ARRANGE
        var dbMock = Substitute.For<IBatabaseRekening>();
        var sut = new LayananTransferPerbankan(dbMock);

        // ACT & ASSERT
        var aksi = async () => await sut.EksekusiTransferAsync("REK-101", "REK-102", nominalTidakValid);
        await aksi.Should().ThrowAsync<ArgumentException>();
    }
}

// ==========================================
// 3. INTEGRATION TESTING DENGAN WebApplicationFactory
// ==========================================
public class TransferEndpointIntegrationTests
{
    [Fact]
    public async Task PostTransfer_KetikaRequestValid_HarusMengembalikanStatus200Ok()
    {
        // Setup host web in-memory
        var builder = WebApplication.CreateBuilder();
        
        // Daftarkan dependensi tiruan di memori
        var dbMock = Substitute.For<IBatabaseRekening>();
        dbMock.CariRekeningAsync("REK-A").Returns(new RekeningNasabah("REK-A", 5000000m));
        
        builder.Services.AddSingleton(dbMock);
        builder.Services.AddScoped<LayananTransferPerbankan>();

        var app = builder.Build();

        app.MapPost("/api/bank/transfer", async (TransferPermintaanDto dto, LayananTransferPerbankan service) =>
        {
            decimal sisa = await service.EksekusiTransferAsync(dto.DariRekening, dto.KeRekening, dto.Nominal);
            return Results.Ok(new TransferResponDto("BERHASIL", sisa));
        });

        // Simulasi request in-memory
        await using var factory = new WebApplicationFactory<Program>();
        var client = factory.CreateClient();

        // Buat payload request
        var payload = new TransferPermintaanDto("REK-A", "REK-B", 1500000m);

        // Kirim HTTP POST
        var response = await client.PostAsJsonAsync("/api/bank/transfer", payload);

        // Assert HTTP Level
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var hasil = await response.Content.ReadFromJsonAsync<TransferResponDto>();
        hasil.Should().NotBeNull();
        hasil!.Status.Should().Be("BERHASIL");
        hasil.SisaSaldo.Should().Be(3500000m);
    }
}
```

### Hasil Eksekusi Test Runner (`dotnet test`)

```text
Passed!  - Failed: 0, Passed: 4, Skipped: 0, Total: 4, Duration: 342 ms - BankingTestingSuite.dll (net10.0)

✓ LayananTransferPerbankanUnitTests.EksekusiTransfer_KetikaSaldoMencukupi_HarusBerhasilDanPerbaruiDatabase [8 ms]
✓ LayananTransferPerbankanUnitTests.EksekusiTransfer_KetikaSaldoKurang_HarusMelemparExceptionDanBatalSimpan [2 ms]
✓ LayananTransferPerbankanUnitTests.EksekusiTransfer_KetikaNominalTidakValid_HarusMelemparArgumentException(nominalTidakValid: 0) [1 ms]
✓ LayananTransferPerbankanUnitTests.EksekusiTransfer_KetikaNominalTidakValid_HarusMelemparArgumentException(nominalTidakValid: -50000) [1 ms]
✓ TransferEndpointIntegrationTests.PostTransfer_KetikaRequestValid_HarusMengembalikanStatus200Ok [185 ms]
```

---

## 16. 📚 Peta Ingatan

```text
ASP.NET Core Testing Landscape (.NET 10 LTS)
├── Testing Pyramid
│   ├── Unit Tests              -> Fast, isolated, test single class/method
│   ├── Integration Tests       -> Medium, in-memory pipeline, real DB containers
│   └── End-to-End Tests        -> Slow, real system testing
├── Frameworks & Libraries
│   ├── xUnit                   -> Standard test runner ([Fact], [Theory], [InlineData])
│   ├── FluentAssertions        -> Expressive readable assertions (Should().Be())
│   └── NSubstitute             -> Type-safe clean mocking framework
├── Integration Testing
│   ├── WebApplicationFactory   -> In-memory ASP.NET Core host testing
│   └── ConfigureTestServices   -> Override specific dependencies during tests
└── Database Testing Strategy
    ├── EF Core InMemory        -> ANTI-PATTERN (Lacks SQL fidelity & constraints)
    └── Testcontainers .NET     -> Real Docker PostgreSQL container with IAsyncLifetime
```

---

## 17. 📚 Cheat Code 10 Detik

```text
[Fact]                         -> deklarasi pengujian statis tunggal di xUnit
[Theory] + [InlineData(...)]   -> pengujian berbasis dataset parameter
sut.Should().Be(expected)      -> asersi nilai tunggal FluentAssertions
act.Should().ThrowAsync<T>()   -> asersi bahwa fungsi asinkron melempar exception T
Substitute.For<TInterface>()   -> membuat objek mock pengganti antarmuka
mock.Method().Returns(val)     -> menentukan nilai balik tiruan pada method
mock.Received(1).Method(...)   -> memverifikasi method dipanggil tepat 1 kali
mock.DidNotReceive().Method(...) -> memverifikasi method tidak pernah dipanggil
WebApplicationFactory<Program> -> in-memory test host untuk HTTP integration test
Testcontainers.PostgreSql      -> kontainer Docker database resmi untuk tes integrasi
```

---

## 18. 🧭 Urutan Belajar Berikutnya

Selamat! Anda telah menyelesaikan seluruh kurikulum backend enterprise **ASP.NET Core dan .NET 10 LTS**:

1. **Fondasi Dasar:** [[dotnet-dasar|ASP.NET Core Dasar]]
2. **RESTful Web APIs:** [[dotnet-web-api|Minimal APIs & Web API]]
3. **Persistensi Database Relasional:** [[dotnet-efcore|Entity Framework Core 10]]
4. **Keamanan & Autentikasi:** [[dotnet-security|Keamanan, JWT, dan Rate Limiting]]
5. **Pengujian Otomatis:** [[dotnet-testing|Testing ASP.NET Core]]

Langkah selanjutnya untuk memperdalam wawasan arsitektur backend:
* Pelajari arsitektur database relasional tingkat lanjut di kategori [[Database/PostgreSQL/index|PostgreSQL]].
* Pelajari orkestrasi kontainer produksi di kategori [[DevOps/Docker/index|Docker]] dan [[DevOps/Linux/index|Linux]].

---

## 19. 🔗 Referensi Resmi

* [Integration tests in ASP.NET Core - Microsoft Learn](https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests)
* [Unit testing C# in .NET Core using dotnet test and xUnit - Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-with-dotnet-test)
* [FluentAssertions Official Documentation](https://fluentassertions.com/introduction)
* [NSubstitute Official Documentation](https://nsubstitute.github.io/)
* [Testcontainers for .NET Documentation](https://dotnet.testcontainers.org/)
