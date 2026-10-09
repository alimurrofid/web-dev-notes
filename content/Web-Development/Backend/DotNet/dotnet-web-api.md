---
title: "ASP.NET Core Web API & Minimal APIs"
description: "Panduan komprehensif pembuatan RESTful Web API di .NET 10 LTS: Minimal APIs modern vs Controllers, Parameter Binding, TypedResults, Endpoint Filters, FluentValidation, Problem Details (RFC 7807), Global IExceptionHandler, dan OpenAPI bawaan."
order: 2
tags:
  - web-development
  - backend
  - dotnet
  - aspnetcore
  - minimal-api
  - rest-api
  - openapi
---

# ASP.NET Core Web API & Minimal APIs

> Target: Pemula hingga Menengah  
> Versi: .NET 10 LTS (C# 14)  
> Prasyarat: [[csharp-dasar|C# Dasar]], [[csharp-oop|C# OOP]], dan [[dotnet-dasar|ASP.NET Core Dasar]]

---

## Gambaran Umum

Dalam era arsitektur cloud microservices, containerization Docker, dan serverless computing, kecepatan booting (*cold-start*) dan efisiensi memori API menjadi metrik paling krusial. 

Sebelumnya, pengembang ASP.NET Core membangun REST API menggunakan pendekatan berbasis **Controller** (`ControllerBase`). Meskipun stabil dan terstruktur, Controller memiliki overhead alokasi memori yang cukup tinggi karena ketergantungannya pada refleksi runtime, filter pipeline yang berat, serta lapisan perantara MVC.

Dimulai sejak .NET 6 dan kini menjadi pilihan utama yang sangat matang di **.NET 10 LTS**, Microsoft memperkenalkan **Minimal APIs**. Minimal APIs memangkas seluruh beban seremonial Controller, mengekspos endpoint langsung melalui delegasi lambda berkinerja tinggi, memanfaatkan kompilasi *source generator*, dan mendukung fitur enterprise mutakhir seperti **Route Groups**, **Endpoint Filters**, standar respon error **Problem Details (RFC 7807)**, serta dokumentasi **OpenAPI bawaan** tanpa dependensi pihak ketiga.

---

## Cara Belajar

1. Pahami komparasi mendalam antara Minimal APIs modern vs Controller-based API.
2. Kuasai mekanisme **Parameter Binding** bawaan (`[FromRoute]`, `[FromQuery]`, `[FromBody]`, `[AsParameters]`).
3. Pelajari keuntungan penggunaan **`TypedResults`** untuk pembuatan dokumentasi OpenAPI otomatis dan unit testing yang mudah.
4. Terapkan pemisahan rute menggunakan **Route Groups** (`MapGroup`).
5. Buat validasi data profesional menggunakan **FluentValidation** yang diintegrasikan melalui **Endpoint Filters**.
6. Standarisasi respon error sistem sesuai standar RFC 7807 menggunakan **`IExceptionHandler`**.
7. Konfigurasi dokumentasi API interaktif menggunakan paket OpenAPI resmi bawaan .NET 10.
8. Bangun Mini Project API Katalog Produk siap produksi (*production-ready*).

---

## Daftar Isi

### 🟢 Fundamental

1. [Mental Model: Minimal APIs vs Controller-Based APIs](#1--mental-model-minimal-apis-vs-controller-based-apis)
2. [Anatomi Endpoint Minimal API dan HTTP Verbs](#2--anatomi-endpoint-minimal-api-dan-http-verbs)
3. [Parameter Binding: Dari Mana Data Berasal?](#3--parameter-binding-dari-mana-data-berasal)
4. [Strukturisasi Rute Bersih Menggunakan Route Groups (MapGroup)](#4--strukturisasi-rute-bersih-menggunakan-route-groups-mapgroup)

### 🟡 Intermediate

5. [TypedResults vs Results: Kontrak Respon Type-Safe](#5--typedresults-vs-results-kontrak-respon-type-safe)
6. [AsParameters: Agregasi Parameter Bersih C#](#6--asparameters-agregasi-parameter-bersih-c)
7. [Endpoint Filters: Intersepsi Permintaan pada Tingkat Rute](#7--endpoint-filters-intersepsi-permintaan-pada-tingkat-rute)
8. [Validasi Data Profesional Menggunakan FluentValidation](#8--validasi-data-profesional-menggunakan-fluentvalidation)

### 🔴 Advanced

9. [Standar Respon Error Global: Problem Details (RFC 7807 / 9457)](#9--standar-respon-error-global-problem-details-rfc-7807--9457)
10. [Global Exception Handling Modern via IExceptionHandler](#10--global-exception-handling-modern-via-iexceptionhandler)
11. [OpenAPI dan Scalar di .NET 10 LTS (Tanpa Swashbuckle)](#11--openapi-dan-scalar-di-net-10-lts-tanpa-swashbuckle)
12. [DTO Pattern: Isolasi Domain Model dari Kontrak Publik](#12--dto-pattern-isolasi-domain-model-dari-kontrak-publik)

### 🛠️ Praktik

13. [Best Practice Perancangan RESTful Web API](#13-️-best-practice-perancangan-restful-web-api)
14. [Kesalahan Umum Pemula](#14-️-kesalahan-umum-pemula)
15. [Mini Project: Production-Ready Product Catalog REST API](#15-️-mini-project-production-ready-product-catalog-rest-api)

### 📚 Referensi

16. [Peta Ingatan](#16--peta-ingatan)
17. [Cheat Code 10 Detik](#17--cheat-code-10-detik)
18. [Urutan Belajar Berikutnya](#18--urutan-belajar-berikutnya)
19. [Referensi Resmi](#19--referensi-resmi)

---

## 1. 🟢 Mental Model: Minimal APIs vs Controller-Based APIs

### Konsep

Di ASP.NET Core modern, Anda memiliki dua paradigma dalam membangun REST API:

| Aspek Komparasi | Minimal APIs (Pendekatan Modern .NET 10) | Controller-Based APIs (Pendekatan Konvensional) |
|---|---|---|
| **Struktur** | Endpoint didefinisikan sebagai fungsi lambda / method | Kelas yang mewarisi `ControllerBase` |
| **Overhead Performa** | Sangat ringan, waktu startup 3x lebih cepat, hemat RAM | Lebih lambat karena scanning refleksi & filter MVC |
| **AOT Compilation** | Kompatibel penuh dengan Native AOT (.NET 10) | Membutuhkan refleksi runtime yang sulit di-AOT |
| **Organisasi Kode** | Dipisah modular menggunakan `RouteGroupBuilder` | Dipisah per berkas kelas Controller |
| **Rekomendasi Modern** | Standar utama untuk microservices, cloud, high-QPS | Aplikasi enterprise lama atau tim MVC tradisional |

```text
Controller-Based Pipeline:
HTTP Request ──> Routing ──> Controller Activator (Refleksi) ──> Action Filters ──> Action Method ──> Object Result Formatting

Minimal APIs Pipeline:
HTTP Request ──> Routing ──> Direct Delegate Execution (Cepat!) ──> Direct Response JSON
```

---

## 2. 🟢 Anatomi Endpoint Minimal API dan HTTP Verbs

### Konsep

Setiap endpoint Minimal API dipetakan langsung pada instance `WebApplication` menggunakan method pemetaan kata kerja HTTP (*HTTP Verbs*):

* `app.MapGet(pattern, handler)`: Membaca data (*Read*).
* `app.MapPost(pattern, handler)`: Membuat data baru (*Create*).
* `app.MapPut(pattern, handler)`: Memperbarui seluruh data (*Full Update*).
* `app.MapPatch(pattern, handler)`: Memperbarui sebagian data (*Partial Update*).
* `app.MapDelete(pattern, handler)`: Menghapus data (*Delete*).

### Contoh Sintaksis Dasar

```csharp
var app = WebApplication.Create();

// GET sederhana
app.MapGet("/api/health", () => Results.Ok(new { Status = "Sehat", Versi = "10.0" }));

// GET dengan parameter rute bertipe data integer
app.MapGet("/api/produk/{id:int}", (int id) =>
{
    return Results.Ok(new { ProdukId = id, Nama = "Laptop Gaming" });
});

// POST dengan JSON Body
app.MapPost("/api/pesanan", (PesananBaruDto dto) =>
{
    return Results.Created($"/api/pesanan/{dto.KodePesanan}", dto);
});

app.Run();
```

---

## 3. 🟢 Parameter Binding: Dari Mana Data Berasal?

### Konsep

ASP.NET Core Minimal APIs memiliki mesin pengurai parameter (*Model Binder*) yang sangat cerdas. Binder secara otomatis menyimpulkan dari mana data berasal tanpa Anda harus menulis atribut secara manual:

```text
Aturan Inferensi Otomatis:
1. Jika nama parameter cocok dengan rute URL ({id})   ──> Diambil dari Route (Route Parameter)
2. Jika tipe parameter terdaftar di DI Container       ──> Disuntikkan dari DI (Services)
3. Jika tipe berupa tipe data kompleks (class/record)  ──> Di-parse dari JSON Body ([FromBody])
4. Jika berupa tipe skalar sederhana (int, string, bool) ──> Diambil dari Query String (?page=1)
```

### Penegasan Eksplisit Menggunakan Atribut

Meskipun inferensi otomatis bekerja dengan baik, Anda dapat menggunakan atribut untuk memperjelas kontrak kode:

```csharp
app.MapGet("/api/transaksi/{kodeTransaksi}", (
    [FromRoute] string kodeTransaksi,                           // Dari path URL: /api/transaksi/TRX-99
    [FromQuery(Name = "kategori")] string? filterKategori,       // Dari query: ?kategori=belanja
    [FromHeader(Name = "X-Api-Key")] string apiKey,             // Dari Header HTTP
    [FromServices] ILayananAudit auditService) =>               // Disuntikkan dari DI Container
{
    // Logika endpoint
    return Results.Ok();
});
```

---

## 4. 🟢 Strukturisasi Rute Bersih Menggunakan Route Groups (MapGroup)

### Konsep

Salah satu kritik awal terhadap Minimal APIs adalah bahwa seluruh kode menumpuk di file `Program.cs`. 

Solusi elegan di .NET modern adalah **`RouteGroupBuilder`** (`MapGroup`). Fitur ini memungkinkan Anda:
1. Memberikan awalan URL bersama (misal: `/api/v1/pengguna`).
2. Menerapkan middleware, filter, atau otorisasi keamanan ke seluruh endpoint di dalam grup tersebut sekaligus!
3. Memindahkan seluruh definisi rute ke berkas ekstensi terpisah yang modular dan bersih.

### Pemisahan Rute ke File Ekstensi Terpisah

Berkas `Endpoints/ProdukEndpoints.cs`:

```csharp
public static class ProdukEndpoints
{
    public static RouteGroupBuilder MapProdukEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/", AmbilSemuaProduk);
        group.MapGet("/{id:int}", AmbilProdukById);
        group.MapPost("/", BuatProdukBaru);
        group.MapDelete("/{id:int}", HapusProduk);

        return group;
    }

    private static IResult AmbilSemuaProduk() => Results.Ok(new string[] { "Mouse", "Keyboard" });
    private static IResult AmbilProdukById(int id) => Results.Ok(new { Id = id });
    private static IResult BuatProdukBaru() => Results.Created();
    private static IResult HapusProduk(int id) => Results.NoContent();
}
```

Pendaftaran di `Program.cs`:

```csharp
var app = builder.Build();

// Seluruh endpoint produk otomatis memiliki prefix /api/v1/produk
app.MapGroup("/api/v1/produk")
   .WithTags("Katalog Produk")
   .MapProdukEndpoints();

app.Run();
```

---

## 5. 🟡 TypedResults vs Results: Kontrak Respon Type-Safe

### Konsep

Di Minimal APIs, Anda memiliki dua cara untuk mengembalikan respon:

1. **`Results.*` (Untyped):** Mengembalikan antarmuka umum `IResult`. Tipe data konkrit disamarkan sebagai objek `object?`.
2. **`TypedResults.*` (Strongly-Typed):** Mengembalikan tipe data konkrit seperti `Ok<ProductResponse>`, `NotFound`, atau `CreatedAtRoute<ProductResponse>`.

```text
Results.Ok(data)
  └─ Return type: IResult (Tipe data konkret hilang di tanda tangan method)

TypedResults.Ok(data)
  └─ Return type: Ok<ProductDto> (Compiler & OpenAPI mengetahui tipe data persis!)
```

### Mengapa Wajib Menggunakan `TypedResults`?

1. **Dokumentasi OpenAPI Otomatis:** Framework otomatis mendeklarasikan skema schema respon JSON (HTTP 200 dengan payload `ProductDto`, HTTP 404 tanpa payload) di dokumentasi OpenAPI tanpa perlu menambahkan atribut manual!
2. **Kemudahan Unit Testing:** Anda dapat menguji kembalian method secara langsung dalam Unit Test tanpa perlu membuat *fake HTTP context*:
   ```csharp
   // Unit Test mudah & bersih:
   Ok<ProductDto> hasil = ProdukHandler.AmbilById(10);
   Assert.Equal(10, hasil.Value.Id);
   ```

### Penggunaan Union Return Type (`Results<T1, T2>`)

Jika sebuah method dapat mengembalikan beberapa status HTTP (misal: 200 OK atau 404 Not Found), gabungkan tipe kembaliannya menggunakan `Results<T1, T2>`:

```csharp
public static Results<Ok<ProductDto>, NotFound> AmbilProduk(int id, IProdukRepo repo)
{
    var produk = repo.FindById(id);
    if (produk is null)
    {
        return TypedResults.NotFound();
    }

    return TypedResults.Ok(new ProductDto(produk.Id, produk.Nama));
}
```

---

## 6. 🟡 AsParameters: Agregasi Parameter Bersih C#

### Masalah

Ketika sebuah endpoint pencarian membutuhkan 6 parameter sekaligus (kata kunci pencarian, kategori, nomor halaman, ukuran halaman, urutan sortir, dan service database), deklarasi delegasi lambda menjadi sangat panjang dan sulit dibaca (*parameter clutter*):

```csharp
// ❌ BURUK: Daftar parameter terlalu panjang dan berantakan
app.MapGet("/api/cari", (string? q, string? kat, int? page, int? limit, string? sort, IDbService db) => { ... });
```

### Solusi: Atribut `[AsParameters]`

Bungkus seluruh parameter ke dalam satu buah `record struct` yang bersih:

```csharp
public readonly record struct ParameterPencarianProduk(
    [FromQuery(Name = "q")] string? KataKunci,
    [FromQuery] string? Kategori,
    [FromQuery] int Halaman = 1,
    [FromQuery] int UkuranHalaman = 10
);

// ✅ BERSIH: Handler hanya menerima satu objek parameter tunggal
app.MapGet("/api/cari", ([AsParameters] ParameterPencarianProduk filter, IDbService db) =>
{
    return Results.Ok(new 
    { 
        Keyword = filter.KataKunci, 
        Page = filter.Halaman, 
        Limit = filter.UkuranHalaman 
    });
});
```

---

## 7. 🟡 Endpoint Filters: Intersepsi Permintaan pada Tingkat Rute

### Konsep

Jika **Middleware** bekerja pada level global seluruh aplikasi, **Endpoint Filters** bekerja secara spesifik pada level satu endpoint atau Route Group tertentu.

Endpoint filter dapat:
1. Memvalidasi payload data sebelum handler utama dieksekusi.
2. Memodifikasi argumen input atau hasil respon yang keluar.
3. Mencatat durasi performa eksekusi endpoint tersebut.

### Pembuatan Endpoint Filter

```csharp
public class LogWaktuEksekusiFilter(ILogger<LogWaktuEksekusiFilter> logger) : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var waktuMulai = System.Diagnostics.Stopwatch.GetTimestamp();

        // 1. Eksekusi Handler Endpoint
        var hasil = await next(context);

        // 2. Logika setelah handler selesai
        var durasi = System.Diagnostics.Stopwatch.GetElapsedTime(waktuMulai);
        logger.LogInformation("Endpoint {Path} dieksekusi dalam {Durasi:N2} ms", 
            context.HttpContext.Request.Path, durasi.TotalMilliseconds);

        return hasil;
    }
}

// Pasang filter pada grup rute:
app.MapGroup("/api/v1/transaksi")
   .AddEndpointFilter<LogWaktuEksekusiFilter>();
```

---

## 8. 🟡 Validasi Data Profesional Menggunakan FluentValidation

### Mengapa Bukan DataAnnotations?

Atribut `DataAnnotations` bawaan (`[Required]`, `[EmailAddress]`) mencampurkan aturan validasi langsung ke dalam kelas DTO. Untuk aturan bisnis yang kompleks (misal: "Jika status = VIP, batas pinjaman minimal Rp100 Juta"), DataAnnotations menjadi sangat kaku.

**FluentValidation** adalah standar industri di .NET untuk memisahkan aturan validasi ke kelas validator tersendiri:

```csharp
public sealed record BuatProdukDto(string Nama, decimal Harga, int Stok);

// Validator terisolasi secara profesional
public sealed class BuatProdukValidator : AbstractValidator<BuatProdukDto>
{
    public BuatProdukValidator()
    {
        RuleFor(x => x.Nama)
            .NotEmpty().WithMessage("Nama produk wajib diisi.")
            .MinimumLength(3).WithMessage("Nama produk minimal 3 karakter.")
            .MaximumLength(100).WithMessage("Nama produk maksimal 100 karakter.");

        RuleFor(x => x.Harga)
            .GreaterThan(0).WithMessage("Harga produk harus lebih besar dari Rp0.");

        RuleFor(x => x.Stok)
            .GreaterThanOrEqualTo(0).WithMessage("Stok tidak boleh bernilai negatif.");
    }
}
```

### Auto-Validation via Generic Endpoint Filter

Kita dapat membuat sebuah Endpoint Filter yang secara otomatis memvalidasi DTO apapun menggunakan FluentValidation sebelum masuk ke handler bisnis:

```csharp
public class ValidationFilter<T>(IValidator<T> validator) : IEndpointFilter where T : class
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        // Cari argumen bertipe T di dalam parameter request
        var argument = context.Arguments.OfType<T>().FirstOrDefault();
        if (argument is not null)
        {
            var validationResult = await validator.ValidateAsync(argument);
            if (!validationResult.IsValid)
            {
                // Kembalikan Problem Details 400 Bad Request otomatis
                return TypedResults.ValidationProblem(validationResult.ToDictionary());
            }
        }

        return await next(context);
    }
}
```

---

## 9. 🔴 Standar Respon Error Global: Problem Details (RFC 7807 / 9457)

### Konsep

Salah satu tanda API yang buruk adalah format error yang tidak konsisten: kadang mengembalikan string mentah `"Error!"`, kadang mengembalikan objek `{ "msg": "failed" }`, dan kadang halaman HTML stack trace 500.

IETF merilis spesifikasi resmi **RFC 7807 (diperbarui ke RFC 9457)**: **Problem Details for HTTP APIs**. Format JSON standar ini wajib digunakan oleh seluruh API enterprise modern:

```json
{
  "type": "https://httpstatuses.com/400",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "detail": "Data produk yang dikirimkan tidak valid.",
  "instance": "/api/v1/produk",
  "errors": {
    "Nama": ["Nama produk minimal 3 karakter."],
    "Harga": ["Harga produk harus lebih besar dari Rp0."]
  }
}
```

### Mengaktifkan Problem Details di .NET 10

Cukup satu baris di file `Program.cs`:
```csharp
builder.Services.AddProblemDetails();
```

---

## 10. 🔴 Global Exception Handling Modern via IExceptionHandler

### Konsep

Sebelum .NET 8, pengembang terpaksa membuat middleware exception kustom yang panjang. Mulai .NET 8 dan disempurnakan di .NET 10 LTS, .NET menyediakan abstraksi resmi: **`IExceptionHandler`**.

### Implementasi Global Exception Handler

```csharp
using Microsoft.AspNetCore.Diagnostics;

public sealed class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext, 
        Exception exception, 
        CancellationToken cancellationToken)
    {
        logger.LogError(exception, "[UNHANDLED EXCEPTION] Terjadi kegagalan server: {Message}", exception.Message);

        var problemDetails = new ProblemDetails
        {
            Status = StatusCodes.Status500InternalServerError,
            Title = "Terjadi Kesalahan Internal Server",
            Detail = "Sistem kami sedang mengalami kendala. Silakan hubungi admin.",
            Instance = httpContext.Request.Path
        };

        httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true; // Menandakan bahwa exception telah berhasil ditangani (tidak bocor)
    }
}

// Pendaftaran di Program.cs:
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build();
app.UseExceptionHandler(); // Aktifkan handler terdaftar
```

---

## 11. 🔴 OpenAPI dan Scalar di .NET 10 LTS (Tanpa Swashbuckle)

### Perubahan Besar di .NET Modern

Sejak .NET 9 dan .NET 10 LTS, template bawaan Microsoft **resmi menghentikan ketergantungan pada Swashbuckle.AspNetCore** yang sudah tidak aktif dikembangkan.

Microsoft kini menyediakan generator bawaan resmi berbasis performa tinggi: **`Microsoft.AspNetCore.OpenApi`**.

Untuk menampilkan dokumentasi visual yang sangat modern dan cepat, komunitas industri .NET modern menggunakan **Scalar** (`Scalar.AspNetCore`):

```bash
dotnet add package Microsoft.AspNetCore.OpenApi
dotnet add package Scalar.AspNetCore
```

### Konfigurasi di `Program.cs`

```csharp
builder.Services.AddOpenApi(); // Generator OpenAPI bawaan .NET 10

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi(); // Menyediakan endpoint JSON spesifikasi: /openapi/v1.json
    app.MapScalarApiReference(); // Menyediakan UI Dokumentasi Interaktif Modern di: /scalar/v1
}
```

---

## 12. 🔴 DTO Pattern: Isolasi Domain Model dari Kontrak Publik

### Mengapa DTO (Data Transfer Object) Mutlak?

**Jangan pernah mengembalikan entitas database langsung ke klien HTTP!**

Risiko tanpa DTO:
1. **Over-Posting Security Vulnerability:** Klien dapat mengirimkan JSON `{"IsAdmin": true}` dan secara tidak sengaja memperbarui status hak akses admin jika model database di-bind langsung.
2. **Data Leakage:** Field sensitif seperti `PasswordHash`, `Salt`, atau `InternalAuditNotes` dapat bocor keluar dalam response JSON.
3. **Circular Reference Crash:** Relasi database bolak-balik (misal `Customer -> Orders -> Customer`) akan melempar exception saat diserialisasi ke JSON.

```text
Klien Luar ──── DTO (Data Transfer Object) ────> Controller/API
                                                    │
                                             Dipetakan ke
                                                    ▼
Database   <── Entity Model (Internal) ──────── Model Bisnis
```

---

## 13. 🛠️ Best Practice Perancangan RESTful Web API

### 1. Gunakan Kata Benda Jamak (*Plural Nouns*) untuk Rute
* ✅ `/api/v1/products`
* ❌ `/api/v1/getProducts` atau `/api/v1/deleteProductById`

### 2. Gunakan HTTP Status Codes yang Semantis
* `200 OK`: Permintaan berhasil dan mengembalikan data.
* `201 Created`: Sumber daya baru berhasil dibuat (wajib sertakan header `Location`).
* `204 NoContent`: Permintaan berhasil dieksekusi tetapi tidak ada body yang dikembalikan (misal: sukses DELETE).
* `400 BadRequest`: Data input klien tidak valid (sertakan Problem Details).
* `401 Unauthorized`: Klien belum melakukan login / token tidak valid.
* `403 Forbidden`: Klien sudah login, tetapi tidak memiliki izin mengakses sumber daya.
* `404 NotFound`: ID atau sumber daya tidak ditemukan.

### 3. Dukung Versi API Sejak Awal (*API Versioning*)
Gunakan prefix rute versi seperti `/api/v1/...` untuk menghindari *breaking changes* di kemudian hari ketika kontrak API diperbarui.

---

## 14. 🛠️ Kesalahan Umum Pemula

### 1. Mengembalikan Format Error Acak alih-alih Problem Details

❌ **Salah:**
```csharp
return Results.BadRequest(new { error = "Nama tidak boleh kosong!" });
```

✅ **Benar:**
```csharp
return Results.ValidationProblem(new Dictionary<string, string[]>
{
    ["Nama"] = ["Nama tidak boleh kosong!"]
});
```

---

### 2. Memanggil Logika Database Langsung di Delegasi Rute Tanpa Layering

❌ **Salah:**
Menulis 50 baris kueri SQL / Entity Framework langsung di dalam lambda `app.MapPost(...)`.

✅ **Benar:**
Delegasikan logika bisnis ke Service atau Repository, dan jadikan handler Minimal API hanya sebagai penerima input, pemanggil service, dan pengembali status HTTP (*thin transport layer*).

---

## 15. 🛠️ Mini Project: Production-Ready Product Catalog REST API

### Tujuan

Membangun REST API Katalog Produk berstandar produksi menggunakan ASP.NET Core .NET 10 LTS:
1. Menggunakan **Minimal APIs** dengan **Route Groups**.
2. Format respon strongly-typed menggunakan **`TypedResults`**.
3. Validasi otomatis menggunakan **FluentValidation** via generic **Endpoint Filter**.
4. Standarisasi error menggunakan **Problem Details**.
5. Metadata **OpenAPI** bawaan lengkap.

### Implementasi Lengkap (C# 14 / .NET 10 LTS)

```csharp
using System.Collections.Concurrent;
using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;

var builder = WebApplication.CreateBuilder(args);

// 1. REGISTRASI SERVICE & DEPENDENCY INJECTION
builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();
builder.Services.AddSingleton<IProdukRepository, InMemoryProdukRepository>();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// 2. PEMETAAN ROUTE GROUP
app.MapGroup("/api/v1/produk")
   .WithTags("Katalog Produk")
   .MapProdukEndpoints();

app.Run();

// ==========================================
// DEFINISI ENDPOINTS & LOGIKA TRANSPORT
// ==========================================
public static class ProdukEndpointsExtension
{
    public static RouteGroupBuilder MapProdukEndpoints(this RouteGroupBuilder group)
    {
        // GET: Mengambil semua produk
        group.MapGet("/", GetAllProduk)
             .WithName("GetAllProduk")
             .WithSummary("Mengambil seluruh daftar produk")
             .Produces<IReadOnlyList<ProdukResponseDto>>(StatusCodes.Status200OK);

        // GET: Mengambil produk berdasarkan ID
        group.MapGet("/{id:guid}", GetProdukById)
             .WithName("GetProdukById")
             .WithSummary("Mengambil detail produk berdasarkan ID")
             .Produces<ProdukResponseDto>(StatusCodes.Status200OK)
             .ProducesProblem(StatusCodes.Status404NotFound);

        // POST: Membuat produk baru dengan validasi otomatis
        group.MapPost("/", CreateProduk)
             .WithName("CreateProduk")
             .WithSummary("Membuat produk baru")
             .AddEndpointFilter<ValidationFilter<CreateProdukRequestDto>>()
             .Produces<ProdukResponseDto>(StatusCodes.Status201Created)
             .ProducesValidationProblem();

        return group;
    }

    private static Ok<IReadOnlyList<ProdukResponseDto>> GetAllProduk(IProdukRepository repo)
    {
        var items = repo.GetAll().Select(p => new ProdukResponseDto(p.Id, p.Nama, p.Harga, p.Stok)).ToList();
        return TypedResults.Ok<IReadOnlyList<ProdukResponseDto>>(items);
    }

    private static Results<Ok<ProdukResponseDto>, NotFound<ProblemDetails>> GetProdukById(Guid id, IProdukRepository repo)
    {
        var produk = repo.GetById(id);
        if (produk is null)
        {
            return TypedResults.NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Produk Tidak Ditemukan",
                Detail = $"Produk dengan ID '{id}' tidak ditemukan di katalog kami."
            });
        }

        return TypedResults.Ok(new ProdukResponseDto(produk.Id, produk.Nama, produk.Harga, produk.Stok));
    }

    private static Created<ProdukResponseDto> CreateProduk(CreateProdukRequestDto request, IProdukRepository repo)
    {
        var entitasBaru = new ProdukEntity(Guid.NewGuid(), request.Nama, request.Harga, request.Stok);
        repo.Add(entitasBaru);

        var responseDto = new ProdukResponseDto(entitasBaru.Id, entitasBaru.Nama, entitasBaru.Harga, entitasBaru.Stok);
        return TypedResults.Created($"/api/v1/produk/{entitasBaru.Id}", responseDto);
    }
}

// ==========================================
// DTOs & MODEL ENTITAS
// ==========================================
public sealed record CreateProdukRequestDto(string Nama, decimal Harga, int Stok);
public sealed record ProdukResponseDto(Guid Id, string Nama, decimal Harga, int Stok);
public sealed record ProdukEntity(Guid Id, string Nama, decimal Harga, int Stok);

// ==========================================
// VALIDASI (FLUENTVALIDATION)
// ==========================================
public sealed class CreateProdukValidator : AbstractValidator<CreateProdukRequestDto>
{
    public CreateProdukValidator()
    {
        RuleFor(x => x.Nama)
            .NotEmpty().WithMessage("Nama produk wajib diisi.")
            .Length(3, 50).WithMessage("Nama produk harus antara 3 hingga 50 karakter.");

        RuleFor(x => x.Harga)
            .GreaterThan(0).WithMessage("Harga produk harus lebih besar dari Rp0.");

        RuleFor(x => x.Stok)
            .GreaterThanOrEqualTo(0).WithMessage("Stok awal tidak boleh bernilai negatif.");
    }
}

// Generic Filter Validasi Otomatis
public class ValidationFilter<T>(IValidator<T> validator) : IEndpointFilter where T : class
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var data = context.Arguments.OfType<T>().FirstOrDefault();
        if (data is not null)
        {
            var hasil = await validator.ValidateAsync(data);
            if (!hasil.IsValid)
            {
                return TypedResults.ValidationProblem(hasil.ToDictionary());
            }
        }

        return await next(context);
    }
}

// ==========================================
// REPOSITORY LAYER (IN-MEMORY PERSISTENCE)
// ==========================================
public interface IProdukRepository
{
    IEnumerable<ProdukEntity> GetAll();
    ProdukEntity? GetById(Guid id);
    void Add(ProdukEntity produk);
}

public sealed class InMemoryProdukRepository : IProdukRepository
{
    private readonly ConcurrentDictionary<Guid, ProdukEntity> _storage = new();

    public InMemoryProdukRepository()
    {
        var defaultId = Guid.Parse("11111111-1111-1111-1111-111111111111");
        _storage[defaultId] = new(defaultId, "Mechanical Keyboard RGB", 850000m, 15);
    }

    public IEnumerable<ProdukEntity> GetAll() => _storage.Values;
    public ProdukEntity? GetById(Guid id) => _storage.GetValueOrDefault(id);
    public void Add(ProdukEntity produk) => _storage[produk.Id] = produk;
}
```

### Hasil Pengujian REST API

#### 1. Uji Validasi Input Gagal (HTTP 400 Validation Problem)
Request:
```http
POST /api/v1/produk HTTP/1.1
Content-Type: application/json

{
  "nama": "A",
  "harga": -5000,
  "stok": -1
}
```

Response RFC 7807:
```http
HTTP/1.1 400 Bad Request
Content-Type: application/problem+json

{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Nama": ["Nama produk harus antara 3 hingga 50 karakter."],
    "Harga": ["Harga produk harus lebih besar dari Rp0."],
    "Stok": ["Stok awal tidak boleh bernilai negatif."]
  }
}
```

#### 2. Uji Sukses Pembuatan Data (HTTP 201 Created)
Request:
```http
POST /api/v1/produk HTTP/1.1
Content-Type: application/json

{
  "nama": "Monitor Ultrawide 34 Inch",
  "harga": 7250000,
  "stok": 5
}
```

Response:
```http
HTTP/1.1 201 Created
Location: /api/v1/produk/6fe3c5d1-92aa-4eb7-a065-27ea293c6e9a
Content-Type: application/json

{
  "id": "6fe3c5d1-92aa-4eb7-a065-27ea293c6e9a",
  "nama": "Monitor Ultrawide 34 Inch",
  "harga": 7250000,
  "stok": 5
}
```

---

## 16. 📚 Peta Ingatan

```text
ASP.NET Core Web API Architecture (.NET 10 LTS)
├── API Paradigms
│   ├── Minimal APIs (Recommended) -> Light overhead, Native AOT, Route Groups
│   └── Controller-Based           -> Legacy MVC, reflection-heavy
├── Request Binding & Parsing
│   ├── Auto-Inference             -> Route, Query, Header, JSON Body
│   └── [AsParameters]             -> Clean parameter aggregation struct
├── Response Contracts
│   ├── TypedResults.*             -> Strongly-typed, self-documenting OpenAPI
│   └── Problem Details (RFC 7807) -> Standardized JSON error response
├── Interception & Quality
│   ├── Endpoint Filters           -> Pre/post request inspection per route
│   ├── FluentValidation           -> Isolated business validation rules
│   └── Global IExceptionHandler   -> Uncaught server error catcher
└── API Documentation
    └── Microsoft.AspNetCore.OpenApi -> Native OpenAPI without third-party dependencies
```

---

## 17. 📚 Cheat Code 10 Detik

```text
app.MapGroup("/prefix")         -> membuat grup rute dengan prefix bersama
app.MapGet("/{id:guid}", ...)   -> route parameter dengan constraint GUID
[AsParameters] FilterDto dto    -> membungkus banyak query params jadi 1 struct
TypedResults.Ok(data)           -> mengembalikan 200 OK dengan tipe data eksplisit
TypedResults.Created(uri, data) -> mengembalikan 201 Created dengan header Location
TypedResults.ValidationProblem()-> mengembalikan 400 Bad Request RFC 7807
group.AddEndpointFilter<T>()    -> memasang filter pada seluruh rute dalam grup
builder.Services.AddOpenApi()   -> generator OpenAPI resmi .NET 10 LTS
builder.Services.AddProblemDetails() -> aktivasi format error RFC 7807
IExceptionHandler               -> interface global penangan unhandled exceptions
```

---

## 18. 🧭 Urutan Belajar Berikutnya

Lanjutkan ke persistensi data database relasional menggunakan ORM resmi .NET:

1. **Lanjutkan ke [[dotnet-efcore|Entity Framework Core 10]] (Modul 3):**
   * Pelajari arsitektur `DbContext`, koneksi database, dan *Code-First Migrations*.
   * Kuasai pemetaan entitas tingkat lanjut menggunakan *Fluent API*.
   * Pahami cara kerja *Change Tracker* dan optimasi pembacaan via `.AsNoTracking()`.
   * Hindari jebakan performa *N+1 Query Problem* dan kuasai *Split Queries* (`AsSplitQuery()`).
   * Pelajari audit data otomatis menggunakan *Interceptors*.

---

## 19. 🔗 Referensi Resmi

* [Minimal APIs Overview - Microsoft Learn](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis)
* [Route Handlers in Minimal APIs - Microsoft Learn](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/route-handlers)
* [Problem Details Service in ASP.NET Core - Microsoft Learn](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling#problem-details)
* [OpenAPI Support in ASP.NET Core - Microsoft Learn](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/aspnetcore-openapi)
