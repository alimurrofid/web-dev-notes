---
title: "ASP.NET Core Dasar (.NET 10 LTS)"
description: "Panduan komprehensif arsitektur dasar ASP.NET Core di .NET 10 LTS: Kestrel web server, WebApplicationBuilder, Dependency Injection (Transient, Scoped, Singleton, Captive Dependency), Middleware Pipeline, Options Pattern, dan Structured Logging."
order: 1
tags:
  - web-development
  - backend
  - dotnet
  - aspnetcore
  - csharp
  - dependency-injection
---

# ASP.NET Core Dasar (.NET 10 LTS)

> Target: Pemula hingga Menengah  
> Versi: .NET 10 LTS (C# 14)  
> Prasyarat: [[csharp-dasar|C# Dasar]], [[csharp-oop|C# OOP]], dan [[csharp-async-threading|C# Asynchronous & Concurrency]]

---

## Gambaran Umum

**ASP.NET Core** adalah framework backend generasi modern dari Microsoft yang dibangun ulang dari dasar (*ground-up rewrite*) agar sepenuhnya modular, bebas platform (*cross-platform* di Linux, macOS, dan Windows), dan berkinerja luar biasa cepat. Di berbagai pengujian independen TechEmpower Benchmarks, server web bawaan ASP.NET Core (**Kestrel**) secara konsisten masuk ke jajaran framework web tercepat di dunia, mampu melayani jutaan permintaan HTTP per detik dengan konsumsi RAM yang sangat efisien.

Di versi **.NET 10 LTS** (Long Term Support yang didukung hingga akhir tahun 2028), arsitektur ASP.NET Core disederhanakan secara dramatis:
* Tidak ada lagi file `Startup.cs` lama yang rumit; seluruh inisialisasi aplikasi kini dipusatkan di file `Program.cs` menggunakan model **`WebApplicationBuilder`**.
* Kontainer **Dependency Injection (DI)** bawaan terintegrasi secara mendalam tanpa membutuhkan library eksternal.
* Pemrosesan HTTP diatur melalui pipa modular **Middleware Pipeline** yang fleksibel dan transparan.
* Konfigurasi sistem didukung oleh **Options Pattern** yang *type-safe* dan tervalidasi saat server dinyalakan (*fail-fast at startup*).

---

## Cara Belajar

1. Pahami mental model siklus hidup request dari internet masuk ke Kestrel Web Server hingga diproses aplikasi.
2. Kuasai struktur berkas proyek modern dan peran utama file `Program.cs`.
3. Kuasai mekanisme kerja kontainer **Dependency Injection (DI)**: pahami perbedaan vital `Transient`, `Scoped`, dan `Singleton`, serta cara menghindari bahaya **Captive Dependency**.
4. Pelajari cara kerja **Middleware Pipeline** dua arah (*Russian doll pattern*) dan urutan eksekusi yang benar.
5. Kelola konfigurasi lingkungan secara profesional menggunakan **Options Pattern** (`IOptions`, `IOptionsSnapshot`, `IOptionsMonitor`).
6. Terapkan logging terstruktur (*structured logging*) menggunakan abstraksi `ILogger<T>`.
7. Bangun Mini Project gateway diagnosa sistem dan pelacakan Correlation ID end-to-end.

---

## Daftar Isi

### 🟢 Fundamental

1. [Mental Model Arsitektur: Kestrel Web Server dan HTTP Pipeline](#1--mental-model-arsitektur-kestrel-web-server-dan-http-pipeline)
2. [Anatomi Proyek Modern .NET 10 dan Program.cs](#2--anatomi-proyek-modern-net-10-dan-programcs)
3. [WebApplicationBuilder vs WebApplication](#3--webapplicationbuilder-vs-webapplication)
4. [Dependency Injection (DI) Container Bawaan](#4--dependency-injection-di-container-bawaan)
5. [Tiga Siklus Hidup Layanan: Transient, Scoped, dan Singleton](#5--tiga-siklus-hidup-layanan-transient-scoped-dan-singleton)

### 🟡 Intermediate

6. [Bahaya Fatal Captive Dependency dan Cara Mendeteksinya](#6--bahaya-fatal-captive-dependency-dan-cara-mendeteksinya)
7. [Keyed Services: Resolusi Dependensi Berbasis Kunci](#7--keyed-services-resolusi-dependensi-berbasis-kunci)
8. [Middleware Pipeline: Model Boneka Rusia (Russian Doll)](#8--middleware-pipeline-model-boneka-rusia-russian-doll)
9. [Urutan Standar Middleware dan Pembuatan Custom Middleware](#9--urutan-standar-middleware-dan-pembuatan-custom-middleware)
10. [Konfigurasi Terstruktur: appsettings.json dan Hierarki Lingkungan](#10--konfigurasi-terstruktur-appsettingsjson-dan-hierarki-lingkungan)

### 🔴 Advanced

11. [Options Pattern: IOptions, IOptionsSnapshot, dan IOptionsMonitor](#11--options-pattern-ioptions-ioptionssnapshot-dan-ioptionsmonitor)
12. [Fail-Fast Validation pada Startup Aplikasi](#12--fail-fast-validation-pada-startup-aplikasi)
13. [Observability & Structured Logging Berbasis ILogger](#13--observability--structured-logging-berbasis-ilogger)

### 🛠️ Praktik

14. [Best Practice Arsitektur ASP.NET Core](#14-️-best-practice-arsitektur-aspnet-core)
15. [Kesalahan Umum Pemula](#15-️-kesalahan-umum-pemula)
16. [Mini Project: System Diagnostics & Correlation Tracking Gateway](#16-️-mini-project-system-diagnostics--correlation-tracking-gateway)

### 📚 Referensi

17. [Peta Ingatan](#17--peta-ingatan)
18. [Cheat Code 10 Detik](#18--cheat-code-10-detik)
19. [Urutan Belajar Berikutnya](#19--urutan-belajar-berikutnya)
20. [Referensi Resmi](#20--referensi-resmi)

---

## 1. 🟢 Mental Model Arsitektur: Kestrel Web Server dan HTTP Pipeline

### Konsep

Ketika pengguna browser atau aplikasi mobile mengirimkan permintaan HTTP ke server backend ASP.NET Core:
1. **Reverse Proxy (Opsional di Lingkungan Produksi):** Permintaan diterima pertama kali oleh Reverse Proxy edge seperti Nginx, Envoy, AWS ALB, atau Cloudflare untuk terminasi SSL/TLS dan mitigasi serangan DDoS.
2. **Kestrel Web Server:** Server web bawaan .NET yang sangat teroptimasi. Kestrel mendengarkan port TCP (misal port 5000 atau 8080), membedah paket biner HTTP/1.1, HTTP/2, atau HTTP/3 menjadi objek `HttpContext` di memori.
3. **Middleware Pipeline:** `HttpContext` dialirkan melintasi rantai komponen middleware (autentikasi, routing, logging, dsb.) secara berurutan.
4. **Endpoint Execution:** Logika bisnis (Minimal API atau Controller) dijalankan untuk memproses data dan menghasilkan respon (JSON, berkas, dsb.).
5. Respon dikembalikan kembali melintasi middleware dalam arah sebaliknya menuju pengguna.

### Diagram Alur Eksekusi HTTP

```text
HTTP Request
     │
     ▼
┌────────────────────────────────────────────────────────┐
│               Kestrel Web Server (OS Port)             │
│               Membentuk HttpContext                    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Middleware Pipeline                  │
│                                                        │
│   Middleware 1 (Global Exception Handler)              │
│       │                                                │
│       ▼                                                │
│   Middleware 2 (Correlation ID & Diagnostics)          │
│       │                                                │
│       ▼                                                │
│   Middleware 3 (Authentication & Authorization)        │
│       │                                                │
│       ▼                                                │
│   Middleware 4 (Routing & Endpoint Dispatcher)         │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│              Endpoint / Business Logic                 │
│               (Minimal API / Service)                  │
└────────────────────────────────────────────────────────┘
```

---

## 2. 🟢 Anatomi Proyek Modern .NET 10 dan Program.cs

### Konsep

Membuat proyek web baru di terminal:
```bash
dotnet new web -n TokoOnlineApi
```

Struktur direktori proyek ASP.NET Core modern sangat minimalis dan bersih:

```text
TokoOnlineApi/
├── appsettings.json                 <- File konfigurasi utama
├── appsettings.Development.json     <- Override konfigurasi lingkungan lokal
├── TokoOnlineApi.csproj             <- Manifest proyek & dependensi NuGet
└── Program.cs                       <- Titik masuk tunggal aplikasi
```

### Berkas `TokoOnlineApi.csproj` (.NET 10 LTS)

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
</Project>
```

Dengan SDK `Microsoft.NET.Sdk.Web`, seluruh namespace fundamental ASP.NET Core (`Microsoft.AspNetCore.Builder`, `Microsoft.Extensions.DependencyInjection`, dll.) otomatis diimpor secara implisit.

---

## 3. 🟢 WebApplicationBuilder vs WebApplication

### Konsep

File `Program.cs` di .NET modern dibagi menjadi dua fase yang tegas dan berurutan:

```text
       Fase 1: BUILDER                  Fase 2: APPLICATION
  (Konfigurasi & Registrasi DI)        (Pipeline Middleware & Routing)
               │                                      │
               ▼                                      ▼
var builder = WebApplication.CreateBuilder();    var app = builder.Build();
builder.Services.Add...                          app.Use...
builder.Configuration.Add...                     app.MapGet...
                                                 app.Run();
```

1. **Fase Builder (`WebApplicationBuilder`):**
   * Mendaftarkan seluruh layanan (*services*) ke dalam kontainer Dependency Injection (`builder.Services`).
   * Membaca file konfigurasi dan variabel lingkungan (`builder.Configuration`).
   * Mengatur adapter logging (`builder.Logging`).
   * **Aturan Mutlak:** Pada fase ini, aplikasi belum menerima request HTTP apapun.
2. **Fase Application (`WebApplication`):**
   * Dimulai saat memanggil `builder.Build()`.
   * Pada tahap ini, kontainer DI sudah **terkunci permanen (*immutable*)**; Anda tidak dapat menambah atau mengubah registrasi layanan lagi.
   * Mengatur urutan pipa middleware (`app.Use...`) dan memetakan rute endpoint (`app.MapGet...`).
   * Membuka port server untuk mulai melayani request via `app.Run()`.

### Contoh Kode Program.cs Minimal

```csharp
var builder = WebApplication.CreateBuilder(args);

// 1. Registrasi Service ke DI Container
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// 2. Registrasi Middleware & Endpoints
app.MapGet("/", () => "Server ASP.NET Core .NET 10 LTS Aktif!");

app.Run();
```

---

## 4. 🟢 Dependency Injection (DI) Container Bawaan

### Konsep

**Dependency Injection (DI)** adalah teknik desain perangkat lunak di mana sebuah objek menerima objek lain yang dibutuhkannya (*dependensi*), alih-alih membuat objek tersebut secara manual menggunakan kata kunci `new`.

Keuntungan DI:
* **Loose Coupling:** Kelas logika bisnis tidak terikat kuat pada implementasi konkrit kelas database atau pustaka pihak ketiga.
* **Testability:** Anda dapat dengan mudah mengganti dependensi asli dengan *Mock* saat melakukan Unit Testing.
* **Lifecycle Management:** Alokasi memori dan pelepasan sumber daya (`IDisposable` / `IAsyncDisposable`) dikelola secara otomatis oleh framework.

### Inversi Kontrol (IoC) Melalui Interface

```csharp
// 1. Kontrak Antarmuka
public interface INotifikasiService
{
    Task KirimPesanAsync(string tujuan, string pesan);
}

// 2. Implementasi Konkrit
public class EmailNotifikasiService : INotifikasiService
{
    public Task KirimPesanAsync(string tujuan, string pesan)
    {
        Console.WriteLine($"[EMAIL] Mengirim ke {tujuan}: {pesan}");
        return Task.CompletedTask;
    }
}

// 3. Konsumen Menerima Dependensi via Konstruktor (Primary Constructor C# 14)
public class PesananHandler(INotifikasiService notifikasi)
{
    public async Task CheckoutAsync(string emailUser)
    {
        // Logika checkout...
        await notifikasi.KirimPesanAsync(emailUser, "Pesanan Anda berhasil!");
    }
}
```

---

## 5. 🟢 Tiga Siklus Hidup Layanan: Transient, Scoped, dan Singleton

Ketika mendaftarkan service ke dalam `builder.Services`, Anda wajib memilih salah satu dari tiga siklus hidup (*Service Lifetime*):

```text
Lifetime        Frekuensi Pembuatan Objek                    Kapan Digunakan?
──────────────────────────────────────────────────────────────────────────────────
Transient       Setiap kali diminta (Per-injection)          Komputasi ringan tanpa state
Scoped          Tepat 1 kali per HTTP Request                DbContext, Unit of Work, Repo
Singleton       Tepat 1 kali seumur hidup aplikasi           Cache in-memory, Client HTTP
```

### 1. Transient (`AddTransient<TService, TImplementation>()`)
* Instance baru dibuat setiap kali dependensi tersebut diminta oleh kelas manapun.
* Jika dalam satu HTTP request ada 3 kelas yang meminta dependensi yang sama, akan tercipta 3 instance objek terpisah di memori.
* Cocok untuk layanan ringan yang tidak menyimpan status (*stateless*).

### 2. Scoped (`AddScoped<TService, TImplementation>()`)
* Instance baru dibuat **tepat satu kali untuk setiap HTTP Request** yang masuk.
* Seluruh kelas dan middleware yang meminta dependensi ini di dalam siklus HTTP request yang sama akan berbagi instance objek yang identik.
* Ketika HTTP request selesai dan respon dikirimkan ke pengguna, objek scoped tersebut akan otomatis dibersihkan dan di-dispose oleh framework.
* **Standar Mutlak:** Seluruh interaksi database (seperti Entity Framework Core `DbContext`) **WAJIB** didaftarkan sebagai `Scoped`!

### 3. Singleton (`AddSingleton<TService, TImplementation>()`)
* Instance dibuat **tepat satu kali saat pertama kali diminta**, dan objek yang sama tersebut digunakan terus-menerus untuk melayani seluruh pengguna di seluruh HTTP request sepanjang server aktif.
* Cocok untuk cache memori bersama, konfigurasi global, atau koneksi thread-safe berbiaya instansiasi mahal.

---

## 6. 🟡 Bahaya Fatal Captive Dependency dan Cara Mendeteksinya

### Masalah

**Captive Dependency** adalah salah satu bug arsitektur paling berbahaya pada aplikasi backend ASP.NET Core:
> Terjadi ketika sebuah layanan dengan masa hidup panjang (**Singleton**) bergantung pada layanan dengan masa hidup pendek (**Scoped**).

```text
┌────────────────────────────────────────────────────────┐
│                   SINGLETON SERVICE                    │
│             (Hidup seumur hidup aplikasi)              │
│                                                        │
│  Menyimpan referensi ke:                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │                  SCOPED SERVICE                  │  │
│  │             (Harusnya mati per request)          │  │
│  │                                                  │  │
│  │  -> TERTANGKAP & TERSANDERA DI DALAM SINGLETON!  │  │
│  │  -> Tidak pernah dibersihkan oleh GC!            │  │
│  │  -> Data antar pengguna saling bocor!            │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

Dampaknya fatal:
1. **Memory Leak:** Objek scoped (dan seluruh `DbContext` yang dipegangnya) tidak pernah dibersihkan oleh Garbage Collector.
2. **Korupsi Data Antar Pengguna:** Pengguna B dapat melihat atau memutasi entitas database yang sedang dikelola oleh transaksi Pengguna A karena keduanya berbagi `DbContext` yang sama melalui Singleton tersebut!

### Fitur Deteksi Otomatis .NET (Scope Validation)

Di lingkungan `Development`, ASP.NET Core secara otomatis mengaktifkan validasi scope:
```csharp
builder.Services.AddSingleton<LayananLaporanGlobal>();
builder.Services.AddScoped<DatabaseContext>(); // Jika LayananLaporanGlobal menyuntikkan DatabaseContext:
// RUNTIME CRASH: Cannot consume scoped service 'DatabaseContext' from singleton 'LayananLaporanGlobal'!
```

> [!CAUTION]
> Jangan pernah mematikan validasi scope (`ValidateScopes = false`) di konfigurasi builder aplikasi Anda.

---

## 7. 🟡 Keyed Services: Resolusi Dependensi Berbasis Kunci

### Konsep

Diperkenalkan sejak .NET 8 dan menjadi standar di .NET 10 LTS, **Keyed Services** memecahkan masalah klasik: bagaimana jika Anda memiliki satu interface yang sama, tetapi membutuhkan dua implementasi konkrit berbeda untuk skenario berbeda?

Sebelumnya, pengembang terpaksa menggunakan Factory Pattern yang rumit. Dengan Keyed Services, Anda dapat mendaftarkan dependensi dengan sebuah kunci pengenal string/enum:

```csharp
// Registrasi di builder.Services
builder.Services.AddKeyedScoped<IPenyimpananBerkas, AmazonS3Storage>("s3");
builder.Services.AddKeyedScoped<IPenyimpananBerkas, LocalDiskStorage>("lokal");

// Penggunaan pada Minimal API / Controller via atribut [FromKeyedServices]
app.MapPost("/upload-dokumen-penting", (
    IFormFile berkas, 
    [FromKeyedServices("s3")] IPenyimpananBerkas storage) =>
{
    // Menggunakan AmazonS3Storage secara otomatis
    return storage.SimpanAsync(berkas);
});
```

---

## 8. 🟡 Middleware Pipeline: Model Boneka Rusia (Russian Doll)

### Konsep

Setiap komponen **Middleware** di ASP.NET Core bertindak seperti lapisan boneka bersarang (*Russian Matryoshka Doll*):
1. Menerima `HttpContext`.
2. Menjalankan logika **sebelum** middleware berikutnya (arah request).
3. Memanggil delegasi `await next(context)` untuk menyerahkan eksekusi ke middleware di lapisan lebih dalam.
4. Menjalankan logika **setelah** middleware berikutnya selesai (arah response).

```text
                Request Masuk
                     │
                     ▼
             ┌───────────────┐
             │ Middleware A  │ (Sebelum: Log waktu mulai)
             │   ┌───────────┤
             │   │ Midleware B│ (Sebelum: Cek Auth)
             │   │   ┌───────┤
             │   │   │Endpoint│ ──> Logika Bisnis Dijalankan
             │   │   └───────┤
             │   │ Midleware B│ (Setelah: Tambah Security Header)
             │   └───────────┤
             │ Middleware A  │ (Setelah: Log waktu total)
             └───────────────┘
                     │
                     ▼
               Response Keluar
```

Jika suatu middleware memutuskan untuk **tidak** memanggil `next(context)`, alur tersebut disebut **Short-Circuiting** (misal: middleware autentikasi langsung mengembalikan respon `401 Unauthorized` tanpa meneruskan request ke endpoint).

---

## 9. 🟡 Urutan Standar Middleware dan Pembuatan Custom Middleware

### Urutan Mutlak Middleware

Urutan pemanggilan `app.Use...` di file `Program.cs` **SANGAT KRUSIAL**. Urutan yang salah dapat menyebabkan celah keamanan fatal:

```csharp
var app = builder.Build();

// 1. Penanganan Exception (Paling luar agar dapat menangkap error dari seluruh lapisan)
app.UseExceptionHandler("/error");

// 2. Keamanan Protokol Transport
app.UseHsts();
app.UseHttpsRedirection();

// 3. Routing (Menentukan endpoint mana yang cocok dengan URL)
app.UseRouting();

// 4. Keamanan CORS (Cross-Origin Resource Sharing)
app.UseCors();

// 5. Autentikasi (Siapa pengguna ini? Menghasilkan ClaimsPrincipal)
app.UseAuthentication();

// 6. Otorisasi (Apakah pengguna berhak mengakses endpoint ini?)
app.UseAuthorization();

// 7. Eksekusi Endpoint (Terminal)
app.MapControllers();
```

> [!WARNING]
> Jangan pernah menukar posisi `app.UseAuthentication()` dan `app.UseAuthorization()`. Jika otorisasi dijalankan sebelum autentikasi, otorisasi akan selalu menganggap pengguna anonim!

### Membuat Custom Inline Middleware

```csharp
app.Use(async (context, next) =>
{
    var waktuMulai = System.Diagnostics.Stopwatch.GetTimestamp();

    // Lanjutkan ke middleware berikutnya
    await next(context);

    // Dijalankan saat respon kembali
    var durasiMs = System.Diagnostics.Stopwatch.GetElapsedTime(waktuMulai).TotalMilliseconds;
    Console.WriteLine($"[HTTP AUDIT] {context.Request.Method} {context.Request.Path} selesai dalam {durasiMs:N2} ms");
});
```

---

## 10. 🟡 Konfigurasi Terstruktur: appsettings.json dan Hierarki Lingkungan

### Konsep

ASP.NET Core membaca konfigurasi dari berbagai sumber secara hierarkis bertingkat. Sumber yang dibaca belakangan akan menimpa (*override*) nilai dari sumber sebelumnya:

```text
1. appsettings.json                         (Nilai Default Dasar)
        ↓ ditimpa oleh
2. appsettings.{Environment}.json           (Nilai Spesifik, misal: Production)
        ↓ ditimpa oleh
3. User Secrets (Khusus Development Lokal)  (Kredensial rahasia programmer)
        ↓ ditimpa oleh
4. Environment Variables OS / Docker / K8s  (Injeksi variabel container produksi)
        ↓ ditimpa oleh
5. Command Line Arguments                   (--ServerPort 8080)
```

### Format Berkas `appsettings.json`

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "PengaturanPaymentGateway": {
    "MerchantId": "MID-9921",
    "TimeoutDetik": 30,
    "ModeSandbox": true
  }
}
```

---

## 11. 🔴 Options Pattern: IOptions, IOptionsSnapshot, dan IOptionsMonitor

### Konsep

Jangan membaca konfigurasi menggunakan string mentah `Configuration["PengaturanPaymentGateway:MerchantId"]` yang rawan salah ketik (*magic strings*).

Gunakan **Options Pattern**: petakan section JSON langsung ke sebuah kelas C# yang *strongly-typed*:

```csharp
public class PengaturanPaymentGateway
{
    public required string MerchantId { get; set; }
    public int TimeoutDetik { get; set; }
    public bool ModeSandbox { get; set; }
}

// Registrasi di Program.cs
builder.Services.Configure<PengaturanPaymentGateway>(
    builder.Configuration.GetSection("PengaturanPaymentGateway")
);
```

### Tiga Varian Antarmuka Options

| Antarmuka | Masa Hidup (Lifetime) | Mendukung Hot-Reload? | Kapan Digunakan? |
|---|---|:---:|---|
| **`IOptions<T>`** | Singleton | ❌ Tidak | Konfigurasi statis yang tidak pernah berubah selama aplikasi menyala |
| **`IOptionsSnapshot<T>`** | Scoped | ✅ Ya (Per Request) | Membaca konfigurasi teranyar di setiap HTTP request baru (Standar API) |
| **`IOptionsMonitor<T>`** | Singleton | ✅ Ya (Real-time Event) | Layanan Singleton yang butuh notifikasi seketika saat berkas JSON diedit |

---

## 12. 🔴 Fail-Fast Validation pada Startup Aplikasi

### Konsep

Salah satu mimpi buruk operasional server adalah ketika aplikasi berhasil dinyalakan (*starts up*), tetapi beberapa jam kemudian mengalami *crash* saat ada transaksi pertama yang mengakses konfigurasi API key yang lupa diisi!

Prinsip **Fail-Fast**: Jika konfigurasi penting tidak ada atau salah format, **server harus menolak menyala sejak detik pertama**.

### Implementasi Startup Validation (.NET 10)

```csharp
using System.ComponentModel.DataAnnotations;

public class PengaturanPaymentGateway
{
    [Required(ErrorMessage = "MerchantId wajib diisi di appsettings!")]
    public required string MerchantId { get; set; }

    [Range(5, 120, ErrorMessage = "Timeout harus antara 5 hingga 120 detik!")]
    public int TimeoutDetik { get; set; }
}

// Registrasi di Program.cs dengan Validasi Saat Startup:
builder.Services.AddOptions<PengaturanPaymentGateway>()
    .Bind(builder.Configuration.GetSection("PengaturanPaymentGateway"))
    .ValidateDataAnnotations() // Memvalidasi atribut DataAnnotations
    .ValidateOnStart();         // Evaluasi seketika saat aplikasi boot-up!
```

Jika `MerchantId` kosong, aplikasi akan langsung melempar `OptionsValidationException` saat `builder.Build()` dijalankan, mencegah server rusak terdeploy ke produksi!

---

## 13. 🔴 Observability & Structured Logging Berbasis ILogger

### Konsep

Jangan pernah menggunakan `Console.WriteLine()` untuk pencatatan riwayat aplikasi backend enterprise! `Console.WriteLine` hanya menghasilkan teks mentah yang tidak dapat diindeks, difilter, atau dianalisis oleh sistem monitoring modern seperti OpenTelemetry, Grafana Loki, Datadog, atau ElasticSearch.

Gunakan abstraksi **`ILogger<TCategory>`** dengan **Structured Logging (Message Templates)**:

```csharp
// ❌ BURUK: String Interpolation (Menggabungkan teks, parameter tidak dapat diindeks oleh Elasticsearch)
logger.LogInformation($"User {userId} membeli item {itemId} senilai {harga}");

// ✅ BAIK: Structured Logging (Parameter ditangkap sebagai atribut terpisah di log JSON)
logger.LogInformation("User {UserId} membeli item {ItemId} senilai {Harga:C}", userId, itemId, harga);
```

Hasil log dalam format JSON terstruktur:
```json
{
  "Timestamp": "2026-10-09T23:30:00Z",
  "Level": "Information",
  "Message": "User USR-101 membeli item ITM-99 senilai Rp150,000",
  "UserId": "USR-101",
  "ItemId": "ITM-99",
  "Harga": 150000
}
```

---

## 14. 🛠️ Best Practice Arsitektur ASP.NET Core

### 1. Desain Dependency Injection yang Bersih
* Selalu bergantung pada Interface (`IService`), bukan kelas konkrit.
* Jangan menggunakan Service Locator anti-pattern (`app.Services.GetService<T>()` di dalam method bisnis).

### 2. Pisahkan File Endpoint Besar
Meskipun Minimal APIs mengizinkan penulisan seluruh endpoint di `Program.cs`, jangan letakkan ratusan endpoint di satu file tersebut. Kelompokkan rute menggunakan **Route Groups** dan kelas ekstensi terpisah.

### 3. Gunakan Correlation ID untuk Pelacakan Terdistribusi
Setiap HTTP request yang masuk harus memiliki ID pelacakan unik (`X-Correlation-Id`). Teruskan header ini ke panggilan database dan microservices lain untuk mempermudah pelacakan error end-to-end.

---

## 15. 🛠️ Kesalahan Umum Pemula

### 1. Menyimpan State Pengguna di Service Singleton

❌ **Salah:**
Menyimpan ID pengguna yang sedang login di dalam field service Singleton:
```csharp
public class KeranjangBelanjaService // Didaftarkan sebagai Singleton!
{
    public List<Item> Items = []; // Seluruh pembeli di dunia berbagi keranjang yang sama!
}
```

✅ **Benar:**
Gunakan `Scoped` lifetime untuk layanan yang menyimpan konteks pengguna per-request, atau simpan data keranjang di distributed database/Redis.

---

### 2. Meletakkan Middleware di Urutan yang Keliru

❌ **Salah:**
Meletakkan `app.UseCors()` setelah `app.UseRouting()` dan `app.UseEndpoints()`. Browser akan memblokir request frontend karena response pre-flight OPTIONS tidak diberi header CORS yang valid.

✅ **Benar:**
Letakkan `app.UseCors()` sebelum `app.UseAuthentication()` dan sebelum endpoint mapping.

---

## 16. 🛠️ Mini Project: System Diagnostics & Correlation Tracking Gateway

### Tujuan

Membangun Gateway Diagnostik Cloud (*Diagnostic Gateway API*) menggunakan ASP.NET Core .NET 10 LTS yang mengimplementasikan:
1. Custom Middleware untuk injeksi dan pelacakan header **`X-Correlation-Id`**.
2. Dependency Injection lengkap dengan siklus hidup `Scoped` dan `Singleton`.
3. Options Pattern terstruktur dengan validasi ketat saat startup (`ValidateOnStart`).
4. Structured Logging dengan penandaan Correlation ID pada setiap output.

### Implementasi Lengkap (C# 14 / .NET 10 LTS)

```csharp
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

// 1. REGISTRASI OPTIONS PATTERN DENGAN FAIL-FAST VALIDATION
builder.Services.AddOptions<DiagnostikOptions>()
    .Bind(builder.Configuration.GetSection("Diagnostik"))
    .ValidateDataAnnotations()
    .ValidateOnStart();

// 2. REGISTRASI DEPENDENCY INJECTION
builder.Services.AddSingleton<ICounterKunjungan, InMemoryCounterKunjungan>();
builder.Services.AddScoped<ILayananDiagnostikSistem, LayananDiagnostikSistem>();

var app = builder.Build();

// 3. CUSTOM MIDDLEWARE: CORRELATION ID & PERFORMANCE PROFILER
app.Use(async (context, next) =>
{
    // Cek apakah klien mengirim header X-Correlation-Id, jika tidak buat ID baru
    string correlationId = context.Request.Headers.TryGetValue("X-Correlation-Id", out var id) && !string.IsNullOrWhiteSpace(id)
        ? id.ToString()
        : $"CORR-{Guid.NewGuid():N}"[..13].ToUpper();

    // Tempelkan Correlation ID ke response header agar klien dapat melacaknya
    context.Response.Headers["X-Correlation-Id"] = correlationId;

    var stopwatch = Stopwatch.StartNew();
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();

    logger.LogInformation("[GATEWAY IN] {Method} {Path} | CorrelationId: {CorrelationId}", 
        context.Request.Method, context.Request.Path, correlationId);

    // Lanjutkan ke middleware berikutnya
    await next(context);

    stopwatch.Stop();
    logger.LogInformation("[GATEWAY OUT] Status: {StatusCode} | Waktu: {Durasi:N2} ms | CorrelationId: {CorrelationId}",
        context.Response.StatusCode, stopwatch.ElapsedMilliseconds, correlationId);
});

// 4. PEMETAAN ENDPOINT MINIMAL APIS
app.MapGet("/", () => Results.Ok(new 
{ 
    Status = "Online", 
    Framework = ".NET 10 LTS", 
    WaktuServerUtc = DateTime.UtcNow 
}));

app.MapGet("/diagnostik/status", (
    ILayananDiagnostikSistem diagnostik, 
    ICounterKunjungan counter,
    HttpContext httpContext) =>
{
    counter.IncrementKunjungan();
    string correlationId = httpContext.Response.Headers["X-Correlation-Id"].ToString();

    var infoSistem = diagnostik.AmbilInfoStatus(correlationId, counter.TotalKunjungan);
    return Results.Ok(infoSistem);
});

app.Run();

// --- DEFINISI KONTRAK & KELAS MODEL ---

public sealed class DiagnostikOptions
{
    [Required(ErrorMessage = "NamaEnvironment wajib diisi!")]
    public required string NamaEnvironment { get; set; }

    [Range(1, 1000, ErrorMessage = "MaksimalWorker harus bernilai 1 - 1000")]
    public int MaksimalWorker { get; set; } = 100;
}

public interface ICounterKunjungan
{
    int TotalKunjungan { get; }
    void IncrementKunjungan();
}

public sealed class InMemoryCounterKunjungan : ICounterKunjungan
{
    private int _kunjungan;
    public int TotalKunjungan => _kunjungan;
    public void IncrementKunjungan() => Interlocked.Increment(ref _kunjungan);
}

public interface ILayananDiagnostikSistem
{
    object AmbilInfoStatus(string correlationId, int totalKunjungan);
}

public sealed class LayananDiagnostikSistem(
    Microsoft.Extensions.Options.IOptions<DiagnostikOptions> options, 
    ILogger<LayananDiagnostikSistem> logger) : ILayananDiagnostikSistem
{
    private readonly DiagnostikOptions _config = options.Value;

    public object AmbilInfoStatus(string correlationId, int totalKunjungan)
    {
        logger.LogInformation("Memproses audit diagnostik untuk {CorrelationId}", correlationId);

        return new
        {
            CorrelationId = correlationId,
            Lingkungan = _config.NamaEnvironment,
            MaksimalWorker = _config.MaksimalWorker,
            TotalKunjunganServer = totalKunjungan,
            MemoryTerpakaiMb = Process.GetCurrentProcess().WorkingSet64 / (1024 * 1024),
            StatusAudit = "HEALTHY"
        };
    }
}
```

### Konfigurasi Pendukung `appsettings.json`

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "Diagnostik": {
    "NamaEnvironment": "Production-Cluster-01",
    "MaksimalWorker": 250
  }
}
```

### Pengujian Request dan Response HTTP

Permintaan HTTP:
```http
GET /diagnostik/status HTTP/1.1
Host: localhost:5000
```

Respon HTTP yang Dihasilkan:
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
X-Correlation-Id: CORR-A8F291BD40
Date: Fri, 09 Oct 2026 23:32:00 GMT

{
  "correlationId": "CORR-A8F291BD40",
  "lingkungan": "Production-Cluster-01",
  "maksimalWorker": 250,
  "totalKunjunganServer": 1,
  "memoryTerpakaiMb": 38,
  "statusAudit": "HEALTHY"
}
```

Log Terminal Terstruktur:
```text
info: Program[0]
      [GATEWAY IN] GET /diagnostik/status | CorrelationId: CORR-A8F291BD40
info: LayananDiagnostikSistem[0]
      Memproses audit diagnostik untuk CORR-A8F291BD40
info: Program[0]
      [GATEWAY OUT] Status: 200 | Waktu: 4.12 ms | CorrelationId: CORR-A8F291BD40
```

---

## 17. 📚 Peta Ingatan

```text
ASP.NET Core Architecture (.NET 10 LTS)
├── Startup Lifecycle
│   ├── WebApplicationBuilder   -> Register Services (DI), Configuration, Logging
│   └── WebApplication          -> Build immutable pipeline, Map routes, Run Kestrel
├── Dependency Injection Container
│   ├── Transient               -> New instance every request/injection
│   ├── Scoped                  -> Exactly 1 instance per HTTP request lifecycle
│   ├── Singleton               -> 1 shared instance for application lifetime
│   ├── Captive Dependency      -> Singleton consuming Scoped (FATAL BUG)
│   └── Keyed Services          -> AddKeyedScoped & [FromKeyedServices]
├── Middleware Pipeline
│   ├── Russian Doll Pattern    -> Inbound request -> Next delegate -> Outbound response
│   ├── Short-Circuiting        -> Immediate response without calling next
│   └── Pipeline Order          -> ExceptionHandler -> Https -> Routing -> Auth -> Endpoints
└── Configuration & Options
    ├── appsettings.json        -> Multi-source hierarchical configuration
    └── Options Pattern         -> IOptions, IOptionsSnapshot, IOptionsMonitor (ValidateOnStart)
```

---

## 18. 📚 Cheat Code 10 Detik

```text
builder.Services.AddTransient<I, C>()  -> service dibuat baru setiap kali disuntikkan
builder.Services.AddScoped<I, C>()     -> service dibuat 1 kali per HTTP request (DbContext)
builder.Services.AddSingleton<I, C>()  -> service dibuat 1 kali seumur hidup server
builder.Services.AddKeyedScoped<I, C>("k") -> registrasi dengan kunci pembeda
app.Use(async (ctx, next) => ...)     -> mendefinisikan custom middleware
await next(ctx)                        -> meneruskan request ke middleware berikutnya
context.Response.Headers["Key"] = v    -> memodifikasi response header
builder.Services.Configure<TOptions>() -> mapping section config ke strongly-typed class
ValidateOnStart()                      -> memvalidasi kelengkapan config saat booting
logger.LogInformation("Pesan {Key}", val) -> structured logging berkinerja tinggi
```

---

## 19. 🧭 Urutan Belajar Berikutnya

Lanjutkan perjalanan pengembangan web backend Anda ke spesialisasi pembuatan RESTful Web API:

1. **Lanjutkan ke [[dotnet-web-api|ASP.NET Core Web API & Minimal APIs]] (Modul 2):**
   * Pelajari arsitektur modern **Minimal APIs** vs Controllers.
   * Kuasai *Parameter Binding* (`[FromBody]`, `[FromQuery]`, `[FromRoute]`, `[AsParameters]`).
   * Terapkan validasi data otomatis menggunakan pustaka industri **FluentValidation**.
   * Standarisasi respon error menggunakan format global **Problem Details (RFC 7807)**.
   * Konfigurasi dokumentasi API interaktif menggunakan spesifikasi **OpenAPI bawaan .NET 10**.

---

## 20. 🔗 Referensi Resmi

* [ASP.NET Core Fundamentals Overview - Microsoft Learn](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/)
* [Dependency Injection in ASP.NET Core - Microsoft Learn](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection)
* [ASP.NET Core Middleware - Microsoft Architecture Guide](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/)
* [Options pattern in .NET - Microsoft Documentation](https://learn.microsoft.com/en-us/dotnet/core/extensions/options)
