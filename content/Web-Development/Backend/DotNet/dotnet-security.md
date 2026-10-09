---
title: "Keamanan & Autentikasi ASP.NET Core"
description: "Panduan komprehensif keamanan dan otorisasi di .NET 10 LTS: JWT Bearer authentication, ClaimsPrincipal, Role-based vs Policy-based Authorization, Password Hashing, CORS, Rate Limiting Middleware bawaan, dan Secret Management."
order: 4
tags:
  - web-development
  - backend
  - dotnet
  - security
  - jwt
  - authentication
  - authorization
---

# Keamanan & Autentikasi ASP.NET Core

> Target: Pemula hingga Menengah  
> Versi: .NET 10 LTS (C# 14)  
> Prasyarat: [[csharp-oop|C# OOP]], [[dotnet-dasar|ASP.NET Core Dasar]], dan [[dotnet-web-api|ASP.NET Core Web API]]

---

## Gambaran Umum

Dalam dunia rekayasa perangkat lunak modern, keamanan (*security*) bukanlah fitur tambahan yang dipasang belakangan saat aplikasi hendak dirilis, melainkan fondasi arsitektur wajib (*Security by Design*). Celah keamanan sekecil apapun pada API backend dapat mengakibatkan kebocoran data pelanggan, kerugian finansial masif, dan kehancuran reputasi organisasi.

ASP.NET Core pada **.NET 10 LTS** menyediakan kerangka kerja keamanan tingkat enterprise yang komprehensif dan telah teruji di sistem berskala global:
* Standar industri autentikasi stateless menggunakan **JSON Web Token (JWT Bearer)**.
* Sistem kendali akses modern berbasis klaim (**Claims-Based**) dan kebijakan (**Policy-Based Authorization**) yang sangat fleksibel.
* Algoritma hashing kata sandi tahan uji (*salted PBKDF2*) via `IPasswordHasher<T>`.
* Perlindungan serangan DoS dan brute-force menggunakan **Rate Limiting Middleware bawaan .NET**.
* Manajemen rahasia (*Secret Management*) yang mencegah kebocoran kredensial ke repositori Git.

---

## Cara Belajar

1. Pahami mental model perbedaan tegas antara **Autentikasi (Authentication)** dan **Otorisasi (Authorization)**.
2. Pelajari anatomi token JWT (Header, Payload, Signature) dan cara kerjanya secara *stateless*.
3. Konfigurasikan middleware JWT Bearer resmi dan pahami validasi kriptografi token.
4. Kuasai cara membaca identitas pengguna dari objek `ClaimsPrincipal` (`HttpContext.User`).
5. Tingkatkan sistem otorisasi dari Role-based konvensional ke **Policy-based Authorization** menggunakan Requirements & Handlers.
6. Terapkan algoritma hashing kata sandi yang aman dan hindari algoritma usang (MD5/SHA1).
7. Konfigurasikan **Rate Limiting Middleware bawaan .NET** untuk mencegah serangan brute force dan scraping.
8. Bangun Mini Project API Vault Perbankan aman dengan autentikasi JWT dan otorisasi bertingkat.

---

## Daftar Isi

### 🟢 Fundamental

1. [Mental Model: Autentikasi vs Otorisasi](#1--mental-model-autentikasi-vs-otorisasi)
2. [Anatomi JSON Web Token (JWT): Header, Payload, dan Signature](#2--anatomi-json-web-token-jwt-header-payload-dan-signature)
3. [Konfigurasi Middleware JWT Bearer di .NET 10](#3--konfigurasi-middleware-jwt-bearer-di-net-10)
4. [Claims dan ClaimsPrincipal: Membaca Identitas Pengguna](#4--claims-dan-claimsprincipal-membaca-identitas-pengguna)

### 🟡 Intermediate

5. [Role-Based Authorization dan Keterbatasannya](#5--role-based-authorization-dan-keterbatasannya)
6. [Policy-Based Authorization: Fleksibilitas Aturan Bisnis Modern](#6--policy-based-authorization-fleksibilitas-aturan-bisnis-modern)
7. [Hashing Kata Sandi Aman Menggunakan IPasswordHasher](#7--hashing-kata-sandi-aman-menggunakan-ipasswordhasher)
8. [Kebijakan Cross-Origin Resource Sharing (CORS) yang Ketat](#8--kebijakan-cross-origin-resource-sharing-cors-yang-ketat)

### 🔴 Advanced

9. [Rate Limiting Middleware Bawaan .NET 10](#9--rate-limiting-middleware-bawaan-net-10)
10. [Refresh Token Pattern dan Siklus Hidup Token Singkat](#10--refresh-token-pattern-dan-siklus-hidup-token-singkat)
11. [Secret Management: Dotnet User-Secrets vs Environment Variables](#11--secret-management-dotnet-user-secrets-vs-environment-variables)

### 🛠️ Praktik

12. [Best Practice Keamanan Backend Enterprise](#12-️-best-practice-keamanan-backend-enterprise)
13. [Kesalahan Umum Pemula](#13-️-kesalahan-umum-pemula)
14. [Mini Project: Secure Bank Vault & Transaction Authorization API](#14-️-mini-project-secure-bank-vault--transaction-authorization-api)

### 📚 Referensi

15. [Peta Ingatan](#15--peta-ingatan)
16. [Cheat Code 10 Detik](#16--cheat-code-10-detik)
17. [Urutan Belajar Berikutnya](#17--urutan-belajar-berikutnya)
18. [Referensi Resmi](#18--referensi-resmi)

---

## 1. 🟢 Mental Model: Autentikasi vs Otorisasi

### Konsep

Banyak pemula mencampurkan dua istilah ini. Keduanya menjawab dua pertanyaan yang sama sekali berbeda dalam gerbang keamanan:

```text
                  PENGGUNA MENGIRIM REQUEST
                              │
                              ▼
        ┌───────────────────────────────────────────┐
        │            1. AUTENTIKASI (401)           │
        │           "Siapa Anda sebenarnya?"        │
        │                                           │
        │  Memverifikasi identitas pengguna         │
        │  (Cek username/password, verifikasi JWT)  │
        └─────────────────────┬─────────────────────┘
                              │ Terbukti Valid
                              ▼
        ┌───────────────────────────────────────────┐
        │             2. OTORISASI (403)            │
        │      "Apakah Anda berhak melakukan ini?"  │
        │                                           │
        │  Memverifikasi hak akses / izin pengguna  │
        │  (Apakah berhak menghapus data nasabah?)  │
        └─────────────────────┬─────────────────────┘
                              │ Berhak
                              ▼
                   AKSES SUMBER DAYA DIIZINKAN
```

* **Autentikasi (Authentication - 401 Unauthorized):** Membuktikan keaslian identitas. Jika kartu identitas / token Anda palsu atau kedaluwarsa, Anda ditolak di gerbang pertama.
* **Otorisasi (Authorization - 403 Forbidden):** Memeriksa hak istimewa (*permissions*). Anda adalah staf kantor yang sah (terautentikasi), tetapi Anda dilarang membuka brankas direktur utama.

---

## 2. 🟢 Anatomi JSON Web Token (JWT): Header, Payload, dan Signature

### Konsep

Dalam arsitektur REST API modern, kita menghindari penyimpanan session di memori server (*stateless*). **JSON Web Token (JWT)** adalah standar terbuka (RFC 7519) untuk mentransmisikan klaim data secara aman antar pihak dalam bentuk token string ringkas.

Token JWT terdiri dari tiga bagian string terpisah yang dienkode dengan Base64Url dan dipisahkan oleh tanda titik (`.`):

```text
  Header         Payload (Claims)          Signature Kriptografi
(Algoritma)       (Data Pengguna)           (Segel Keaslian Server)
 ─────────       ─────────────────       ──────────────────────────────
 eyJhbGci...  .  eyJzdWIiOiIxM...    .   TJVA95OrM7E2cBab30RMHrHDcEfx..
```

1. **Header:** Menyatakan metadata token, terutama algoritma enkripsi (misal: `{"alg": "HS256", "typ": "JWT"}`).
2. **Payload (Claims):** Berisi data pernyataan identitas pengguna seperti ID pengguna (`sub`), nama, role, tanggal kedaluwarsa (`exp`), dan penerbit (`iss`). Data ini **TIDAK DIENKRIPSI** (hanya dibungkus Base64), sehingga siapa saja bisa membacanya! **Jangan pernah menyimpan password atau nomor kartu kredit di dalam JWT payload!**
3. **Signature:** Dihasilkan dengan menggabungkan Header + Payload + Kunci Rahasia Server (*Secret Key*) menggunakan algoritma kriptografi (HMAC-SHA256). Jika ada peretas yang mengubah `role: "User"` menjadi `role: "Admin"` di payload, tanda tangan digital akan otomatis rusak dan server akan menolak token tersebut!

---

## 3. 🟢 Konfigurasi Middleware JWT Bearer di .NET 10

### Instalasi Paket Resmi

```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
```

### Konfigurasi di `Program.cs`

```csharp
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// 1. Ambil konfigurasi JWT dari appsettings.json
string jwtIssuer = builder.Configuration["Jwt:Issuer"]!;
string jwtAudience = builder.Configuration["Jwt:Audience"]!;
string jwtKey = builder.Configuration["Jwt:Key"]!;

// 2. Daftarkan Middleware Autentikasi JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,

        ValidateAudience = true,
        ValidAudience = jwtAudience,

        ValidateLifetime = true,           // Wajib tolak token yang sudah expired!
        ClockSkew = TimeSpan.Zero,          // Hilangkan toleransi delay jam server (tepat detik kadaluarsa)

        ValidateIssuerSigningKey = true,   // Wajib verifikasi tanda tangan rahasia
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

// Urutan Wajib Middleware:
app.UseAuthentication();
app.UseAuthorization();
```

---

## 4. 🟢 Claims dan ClaimsPrincipal: Membaca Identitas Pengguna

### Konsep

Ketika sebuah request tiba dengan header `Authorization: Bearer <token>`, middleware JWT memvalidasi tanda tangan token. Jika sah, middleware membedah seluruh klaim di payload token dan membungkusnya ke dalam objek **`ClaimsPrincipal`** yang otomatis ditempelkan pada properti **`HttpContext.User`**.

### Membaca Data Pengguna di Minimal APIs

```csharp
using System.Security.Claims;

app.MapGet("/api/profil-saya", (ClaimsPrincipal user) =>
{
    // Mengambil ID pengguna dari claim standar 'sub' / NameIdentifier
    string? userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    string? email = user.FindFirstValue(ClaimTypes.Email);

    return Results.Ok(new 
    { 
        UserId = userId, 
        Email = email,
        IsAuthenticated = user.Identity?.IsAuthenticated 
    });
})
.RequireAuthorization(); // Endpoint ini terlindungi, tolak jika tidak ada token!
```

---

## 5. 🟡 Role-Based Authorization dan Keterbatasannya

### Konsep

Cara paling sederhana untuk membatasi akses adalah menggunakan peran (*Role*):

```csharp
app.MapDelete("/api/nasabah/{id}", (int id) => Results.NoContent())
   .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin,SuperUser" });
```

### Mengapa Role-Based Kurang Fleksibel?

Dalam sistem enterprise, peran pengguna menjadi sangat dinamis:
* Bagaimana jika pengguna berposisi "Staff", tetapi hanya boleh menyetujui transaksi jika nominalnya di bawah Rp10 Juta?
* Bagaimana jika pengguna adalah "Manajer", tetapi hanya boleh menyetujui dokumen dari departemennya sendiri?

Pendekatan Role-Based akan memaksa Anda membuat puluhan peran kaku seperti `AdminCabangJakarta`, `StaffTransaksiMaks10Juta`, dsb. Inilah alasan mengapa enterprise menggunakan **Policy-Based Authorization**.

---

## 6. 🟡 Policy-Based Authorization: Fleksibilitas Aturan Bisnis Modern

### Konsep

**Policy-Based Authorization** memisahkan definisi kebijakan bisnis dari kode endpoint. Kebijakan terdiri dari:
1. **Policy Name:** Nama kebijakan (misal: `"HanyaBolehTransaksiBesar"`).
2. **Requirements:** Kriteria yang harus dipenuhi (misal: Harus memiliki sertifikasi teller dan usia akun minimal 1 tahun).
3. **Authorization Handler:** Logika C# yang mengevaluasi apakah pengguna saat ini memenuhi kriteria tersebut.

### Pembuatan Custom Requirement & Handler

```csharp
using Microsoft.AspNetCore.Authorization;

// 1. Definisikan Kriteria Syarat
public class SyaratBatasKredit(decimal batasMaksimal) : IAuthorizationRequirement
{
    public decimal BatasMaksimal { get; } = batasMaksimal;
}

// 2. Evaluator Logika Otorisasi
public class SyaratBatasKreditHandler : AuthorizationHandler<SyaratBatasKredit>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context, 
        SyaratBatasKredit requirement)
    {
        // Baca claim 'LimitOtorisasi' dari token JWT pengguna
        var claimLimit = context.User.FindFirst("LimitOtorisasi");
        if (claimLimit is not null && decimal.TryParse(claimLimit.Value, out decimal limitUser))
        {
            if (limitUser >= requirement.BatasMaksimal)
            {
                context.Succeed(requirement); // Hak akses DIBERIKAN!
            }
        }

        return Task.CompletedTask;
    }
}
```

Pendaftaran di `Program.cs`:

```csharp
builder.Services.AddSingleton<IAuthorizationHandler, SyaratBatasKreditHandler>();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("PersetujuanKreditBesar", policy =>
        policy.Requirements.Add(new SyaratBatasKredit(100000000m))); // Minimal limit 100 Juta
});

// Penggunaan pada Endpoint:
app.MapPost("/api/kredit/setujui", () => Results.Ok("Kredit disetujui"))
   .RequireAuthorization("PersetujuanKreditBesar");
```

---

## 7. 🟡 Hashing Kata Sandi Aman Menggunakan IPasswordHasher

### Mengapa Dilarang Menggunakan MD5 atau SHA256 Biasa?

Fungsi kriptografi cepat seperti MD5, SHA-1, atau SHA-256 dirancang untuk integritas file berkecepatan tinggi, **bukan untuk password**. Komputer modern dapat menguji miliaran kombinasi SHA-256 per detik menggunakan GPU (*Rainbow Table & Brute Force*).

Password harus di-hash menggunakan algoritma lambat (*slow hashing algorithm*) yang menyertakan **Garam Kriptografi Acak (Salt)** dan perulangan komputasi berulang (*Work Factor / Iterations*).

### Menggunakan `IPasswordHasher<TUser>` Bawaan .NET

ASP.NET Core menyediakan `PasswordHasher<TUser>` yang secara default mengimplementasikan **PBKDF2 dengan HMAC-SHA256, 128-bit salt acak, dan ratusan ribu iterasi**:

```csharp
using Microsoft.AspNetCore.Identity;

public class UserDummy { }

public static class KeamananPassword
{
    private static readonly PasswordHasher<UserDummy> _hasher = new();
    private static readonly UserDummy _userContext = new();

    // 1. Membuat Hash Kata Sandi Baru
    public static string HashPassword(string plainPassword)
    {
        return _hasher.HashPassword(_userContext, plainPassword);
    }

    // 2. Verifikasi Password Saat Login
    public static bool VerifikasiPassword(string hashedPassword, string inputPassword)
    {
        var result = _hasher.VerifyHashedPassword(_userContext, hashedPassword, inputPassword);
        return result == PasswordVerificationResult.Success;
    }
}
```

---

## 8. 🟡 Kebijakan Cross-Origin Resource Sharing (CORS) yang Ketat

### Konsep

Secara default, browser memblokir aplikasi web frontend (misal berjalan di `https://frontend-toko.com`) untuk mengirimkan request AJAX/Fetch ke server backend yang memiliki domain/port berbeda (misal `https://api-toko.com`).

**CORS (Cross-Origin Resource Sharing)** adalah mekanisme HTTP header yang memungkinkan server backend mendeklarasikan siapa saja klien frontend yang diizinkan mengambil datanya.

### Konfigurasi CORS Produksi yang Aman

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendTerpercayaPolicy", policy =>
    {
        policy.WithOrigins("https://toko.com", "https://admin.toko.com")
              .WithMethods("GET", "POST", "PUT", "DELETE")
              .WithHeaders("Authorization", "Content-Type", "X-Correlation-Id")
              .AllowCredentials(); // Izinkan transfer cookie / token aman
    });
});

var app = builder.Build();

// Pasang middleware CORS sebelum Authentication
app.UseCors("FrontendTerpercayaPolicy");
```

> [!CAUTION]
> Jangan pernah menggunakan `.AllowAnyOrigin()` bersamaan dengan `.AllowCredentials()` di lingkungan produksi. Ini adalah celah keamanan fatal (*Cross-Origin Data Leakage*).

---

## 9. 🔴 Rate Limiting Middleware Bawaan .NET 10

### Masalah

Tanpa pembatasan frekuensi (*Rate Limiting*):
* Peretas dapat menjalankan skrip otomatis untuk menebak password ribuan kali per menit (*Brute Force Attack*).
* Bot dapat melakukan scraping katalog data hingga server Anda kehabisan memori (*DoS*).

### Fitur Bawaan .NET Modern

Sejak .NET 7 dan disempurnakan di .NET 10 LTS, ASP.NET Core menyediakan middleware pembatasan bawaan di namespace `System.Threading.RateLimiting` tanpa membutuhkan library pihak ketiga.

### Algoritma Rate Limiting Bawaan

1. **Fixed Window:** Membatasi $N$ request per jendela waktu tetap (misal: 100 request per 1 menit).
2. **Sliding Window:** Menghaluskan lonjakan batas jendela waktu tetap.
3. **Token Bucket:** Mengizinkan ledakan request singkat (*burst*) selama token masih tersedia di ember.
4. **Concurrency Limiter:** Membatasi jumlah request simultan yang sedang diproses bersamaan.

### Contoh Implementasi Rate Limiting

```csharp
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// Konfigurasi Kebijakan Rate Limiter
builder.Services.AddRateLimiter(options =>
{
    // Jika klien melanggar kuota, kembalikan HTTP 429 Too Many Requests
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    // Kebijakan untuk endpoint login: Maksimal 5 percobaan per menit per alamat IP klien
    options.AddPolicy("LoginLimiter", httpContext =>
    {
        string clientIp = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

        return RateLimitPartition.GetFixedWindowLimiter(clientIp, _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 5,
            Window = TimeSpan.FromMinutes(1),
            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            QueueLimit = 0 // Tolak langsung tanpa antrean
        });
    });
});

var app = builder.Build();
app.UseRateLimiter();

// Pasang Rate Limiter pada endpoint login:
app.MapPost("/api/auth/login", () => Results.Ok("Login sukses"))
   .RequireRateLimiting("LoginLimiter");
```

---

## 10. 🔴 Refresh Token Pattern dan Siklus Hidup Token Singkat

### Mengapa Access Token Harus Berumur Pendek?

Karena token JWT bersifat *stateless*, server **tidak dapat mencabut (*revoke*) token yang sudah diterbitkan** sebelum masa kedaluwarsanya habis, kecuali server menyimpan daftar hitam (*blacklist*) di memori Redis.

Jika sebuah Access Token berlaku selama 30 hari dan token tersebut dicuri dari komputer pengguna, peretas memiliki akses penuh ke akun tersebut selama sebulan penuh!

### Solusi Standar: Access Token + Refresh Token

```text
1. Client Login  ──>  Server mengembalikan:
                       - Access Token (JWT): Kedaluwarsa sangat singkat (misal: 15 Menit)
                       - Refresh Token (String Acak Kriptografis): Disimpan di Database, kedaluwarsa 7 Hari

2. Request Normal──>  Client mengirimkan Access Token (15 Menit)

3. Token Expired ──>  Client mengirimkan Refresh Token ke endpoint /api/auth/refresh
                       Server mencocokkan Refresh Token di database:
                       Jika valid & belum dicabut ──> Terbitkan Access Token baru 15 Menit lagi!
                       Jika user diblokir/logout  ──> Hapus Refresh Token dari DB, akses terputus seketika!
```

---

## 11. 🔴 Secret Management: Dotnet User-Secrets vs Environment Variables

### Aturan Emas Keamanan Kode

> **JANGAN PERNAH MENYIMPAN KUNCI JWT, PASSWORD DATABASE, ATAU API SECRET DI DALAM FILE `appsettings.json` YANG DI-COMMIT KE GIT!**

### 1. Lingkungan Pengembangan Lokal (`dotnet user-secrets`)
Gunakan tool rahasia pengguna lokal. Nilai rahasia disimpan di luar folder proyek (di direktori profil pengguna OS lokal) sehingga tidak akan pernah ter-commit ke Git secara tidak sengaja:

```bash
# Inisialisasi User Secrets
dotnet user-secrets init

# Simpan Kunci JWT Rahasia
dotnet user-secrets set "Jwt:Key" "KunciSuperRahasiaMinimal32KarakterKriptografi2026!"
```

### 2. Lingkungan Server Produksi (Environment Variables / Vault)
Di server produksi, injeksikan kredensial melalui Environment Variables container Docker / Kubernetes atau cloud vault (Azure Key Vault / AWS Secrets Manager):

```bash
export Jwt__Key="KunciProduksiYangSangatPanjangDanDiacakOlehSistemVault"
```

---

## 12. 🛠️ Best Practice Keamanan Backend Enterprise

1. **Wajibkan HTTPS (Transport Layer Security):**
   Selalu aktifkan `app.UseHsts()` dan `app.UseHttpsRedirection()` agar data kredensial tidak dapat disadap (*Man-in-the-Middle Attack*).
2. **Minimalisir Data di Payload JWT:**
   Jangan memasukkan data PII (*Personally Identifiable Information*) seperti NIK, nomor telepon, atau data sensitif ke dalam payload JWT.
3. **Gunakan Waktu Toleransi Jam Nol (`ClockSkew = TimeSpan.Zero`):**
   Default .NET memberikan toleransi delay jam server sebesar 5 menit. Jika Access Token kedaluwarsa dalam 15 menit, token tersebut kenyataannya masih berlaku selama 20 menit kecuali Anda menyetel `ClockSkew = TimeSpan.Zero`.

---

## 13. 🛠️ Kesalahan Umum Pemula

### 1. Menukar Posisi Middleware `UseAuthentication()` dan `UseAuthorization()`

❌ **Salah:**
```csharp
app.UseAuthorization();
app.UseAuthentication();
```
Otorisasi dijalankan saat identitas pengguna belum sempat diverifikasi, menyebabkan seluruh request pengguna sah selalu dianggap anonim dan ditolak dengan status HTTP 401/403.

✅ **Benar:**
Selalu panggil `UseAuthentication()` terlebih dahulu, baru kemudian `UseAuthorization()`.

---

### 2. Menggunakan Kunci Rahasia JWT yang Terlalu Pendek

Algoritma HMAC-SHA256 (`HS256`) membutuhkan kunci dengan panjang minimal **256-bit (32 karakter)**. Jika kunci kurang dari 32 karakter, ASP.NET Core akan melempar exception saat inisialisasi: `ArgumentOutOfRangeException: IDX10720: SymmetricSecurityKey must be at least 256 bits`.

---

## 14. 🛠️ Mini Project: Secure Bank Vault & Transaction Authorization API

### Tujuan

Membangun REST API Brankas Finansial Aman (*Secure Bank Vault API*) menggunakan ASP.NET Core .NET 10 LTS:
1. Endpoint login dengan verifikasi hash password menggunakan `IPasswordHasher`.
2. Penerbitan dan validasi token JWT Bearer.
3. Proteksi endpoint transfer dana menggunakan **Policy-Based Authorization** (Klaim Limit Otorisasi minimal Rp50 Juta).
4. Perlindungan endpoint login dari serangan brute-force menggunakan **Rate Limiting Middleware**.

### Implementasi Lengkap (C# 14 / .NET 10 LTS)

```csharp
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// 1. KONFIGURASI KEAMANAN & SECRETS
const string JwtSecretKey = "KunciRahasiaBankDigitalSuperAmanMin32Char2026!";
const string JwtIssuer = "BankDigitalAuthServer";
const string JwtAudience = "BankDigitalCoreApi";

// 2. REGISTRASI RATE LIMITING
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("LoginLimiter", ctx =>
    {
        string ip = ctx.Connection.RemoteIpAddress?.ToString() ?? "global";
        return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 3, // Maksimal 3 kali percobaan login per menit
            Window = TimeSpan.FromMinutes(1)
        });
    });
});

// 3. REGISTRASI AUTENTIKASI JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = JwtIssuer,
            ValidateAudience = true,
            ValidAudience = JwtAudience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtSecretKey))
        };
    });

// 4. REGISTRASI POLICY-BASED AUTHORIZATION
builder.Services.AddSingleton<IAuthorizationHandler, SyaratOtorisasiTransferHandler>();
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("HarusOtoritasTinggi", policy =>
        policy.Requirements.Add(new SyaratOtorisasiTransferRequirement(50000000m))); // Minimal limit Rp50 Juta
});

var app = builder.Build();

app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

// ==========================================
// ENDPOINTS LOGIKA TRANSPORT
// ==========================================

// Endpoint Login (Dilindungi Rate Limiter)
app.MapPost("/api/auth/login", (LoginRequestDto dto) =>
{
    var hasher = new PasswordHasher<object>();

    // Simulasi Pengguna di Database (Password plaintext: "RahasiaNasabah123!")
    string passwordHashTersimpan = hasher.HashPassword(new object(), "RahasiaNasabah123!");

    if (dto.Username != "teller_budi")
    {
        return Results.Unauthorized();
    }

    // Verifikasi hash password
    var hasilVerifikasi = hasher.VerifyHashedPassword(new object(), passwordHashTersimpan, dto.Password);
    if (hasilVerifikasi != PasswordVerificationResult.Success)
    {
        return Results.Unauthorized();
    }

    // Terbitkan Token JWT jika verifikasi sukses
    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.UTF8.GetBytes(JwtSecretKey);
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity([
            new Claim(ClaimTypes.NameIdentifier, "USR-8821"),
            new Claim(ClaimTypes.Name, dto.Username),
            new Claim(ClaimTypes.Role, "SeniorTeller"),
            new Claim("LimitOtorisasi", "75000000") // Pengguna ini memiliki limit Rp75 Juta
        ]),
        Expires = DateTime.UtcNow.AddMinutes(15),
        Issuer = JwtIssuer,
        Audience = JwtAudience,
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
    };

    var token = tokenHandler.CreateToken(tokenDescriptor);
    return Results.Ok(new { AccessToken = tokenHandler.WriteToken(token), ExpireInMinutes = 15 });
})
.RequireRateLimiting("LoginLimiter");

// Endpoint Terproteksi Autentikasi Standar
app.MapGet("/api/vault/saldo", (ClaimsPrincipal user) =>
{
    string username = user.Identity?.Name ?? "Anonim";
    return Results.Ok(new { Operator = username, SaldoBrankas = 1500000000m });
})
.RequireAuthorization();

// Endpoint Super Kritis: Dilindungi Kebijakan Khusus (Policy: HarusOtoritasTinggi)
app.MapPost("/api/vault/transfer-dana-besar", (TransferRequestDto dto, ClaimsPrincipal user) =>
{
    return Results.Ok(new 
    { 
        Status = "SUKSES_DITRANSFER", 
        Nominal = dto.Nominal, 
        DisetujuiOleh = user.Identity?.Name 
    });
})
.RequireAuthorization("HarusOtoritasTinggi");

app.Run();

// ==========================================
// DTOs & AUTHORIZATION LOGIC
// ==========================================
public sealed record LoginRequestDto(string Username, string Password);
public sealed record TransferRequestDto(string RekeningTujuan, decimal Nominal);

public sealed class SyaratOtorisasiTransferRequirement(decimal batasMinimal) : IAuthorizationRequirement
{
    public decimal BatasMinimal { get; } = batasMinimal;
}

public sealed class SyaratOtorisasiTransferHandler : AuthorizationHandler<SyaratOtorisasiTransferRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context, 
        SyaratOtorisasiTransferRequirement requirement)
    {
        var claimLimit = context.User.FindFirst("LimitOtorisasi");
        if (claimLimit is not null && decimal.TryParse(claimLimit.Value, out decimal limit))
        {
            if (limit >= requirement.BatasMinimal)
            {
                context.Succeed(requirement);
            }
        }

        return Task.CompletedTask;
    }
}
```

### Hasil Pengujian Keamanan

#### 1. Uji Login Berhasil Mendapatkan JWT Token
Request:
```http
POST /api/auth/login HTTP/1.1
Content-Type: application/json

{
  "username": "teller_budi",
  "password": "RahasiaNasabah123!"
}
```

Response:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJVU1ItODgyMSIsIm5hbWUiOiJ0ZWxsZXJfYnVkaSIsInJvbGUiOiJTZW5pb3JUZWxsZXIiLCJMaW1pdE90b3Jpc2FzaSI6Ijc1MDAwMDAwIiwibmJmIjoxNzI4NTA4MDAwLCJleHAiOjE3Mjg1MDg5MDAsImlzcyI6IkJhbmtEaWdpdGFsQXV0aFNlcnZlciIsImF1ZCI6IkJhbmtEaWdpdGFsQ29yZUFwaSJ9.98cE7f...",
  "expireInMinutes": 15
}
```

#### 2. Uji Serangan Brute Force (Percobaan Ke-4 Ditolak Rate Limiter)
Response:
```http
HTTP/1.1 429 Too Many Requests
Date: Fri, 09 Oct 2026 23:40:00 GMT
```

#### 3. Uji Akses Endpoint Kritis dengan Token Sah
Request:
```http
POST /api/vault/transfer-dana-besar HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
Content-Type: application/json

{
  "rekeningTujuan": "REK-9901-BCA",
  "nominal": 60000000
}
```

Response:
```http
HTTP/1.1 200 OK

{
  "status": "SUKSES_DITRANSFER",
  "nominal": 60000000,
  "disetujuiOleh": "teller_budi"
}
```

---

## 15. 📚 Peta Ingatan

```text
ASP.NET Core Security Landscape (.NET 10 LTS)
├── Authentication (Who are you?)
│   ├── JWT Bearer              -> Stateless token (Header.Payload.Signature)
│   ├── Token Validation        -> ValidateIssuer, ValidateAudience, ValidateLifetime
│   └── ClaimsPrincipal         -> User identity injected into HttpContext.User
├── Authorization (What can you do?)
│   ├── Role-Based              -> Simple role checks ([Authorize(Roles = "Admin")])
│   └── Policy-Based            -> Business rule engine (Requirements + Handlers)
├── Credentials Protection
│   ├── IPasswordHasher<T>      -> PBKDF2 salted slow hash algorithm
│   └── Secret Management       -> dotnet user-secrets (Dev) & Env Vars (Prod)
└── Infrastructure Security
    ├── Rate Limiting           -> Built-in protection against DoS/Brute Force
    ├── CORS Policy             -> Explicit whitelist of trusted frontend domains
    └── Transport Security      -> HTTPS redirection & HSTS enforcement
```

---

## 16. 📚 Cheat Code 10 Detik

```text
AddAuthentication().AddJwtBearer() -> registrasi middleware validasi JWT
AddAuthorization(opt => ...)       -> registrasi kebijakan otorisasi (policies)
RequireAuthorization()             -> melindungi rute (wajib ada token valid)
RequireAuthorization("PolicyName") -> melindungi rute dengan policy spesifik
RequireRateLimiting("PolicyName")  -> membatasi frekuensi request pada endpoint
user.FindFirstValue(ClaimTypes.X)  -> membaca data claim dari ClaimsPrincipal
PasswordHasher.HashPassword(...)   -> menghasilkan salted PBKDF2 hash
PasswordHasher.VerifyHashedPassword()-> mencocokkan input password dengan hash
dotnet user-secrets set "K" "V"    -> menyimpan secret lokal di luar Git
ClockSkew = TimeSpan.Zero          -> eliminasi toleransi delay expired token
```

---

## 17. 🧭 Urutan Belajar Berikutnya

Lengkapi seluruh pilar rekayasa perangkat lunak backend ASP.NET Core dengan modul penutup: Pengujian Otomatis (*Automated Testing*):

1. **Lanjutkan ke [[dotnet-testing|Testing ASP.NET Core]] (Modul 5):**
   * Pahami pengujian unit (*Unit Testing*) menggunakan kerangka kerja **xUnit** dan pustaka asersi ekspresif **FluentAssertions**.
   * Lakukan isolasi dependensi menggunakan library mocking modern (**NSubstitute / Moq**).
   * Bangun pengujian integrasi menyeluruh (*Integration Testing*) menggunakan **`WebApplicationFactory<Program>`**.
   * Jalankan database PostgreSQL sesungguhnya di dalam kontainer Docker saat pengujian menggunakan **Testcontainers .NET**.

---

## 18. 🔗 Referensi Resmi

* [Overview of ASP.NET Core Security - Microsoft Learn](https://learn.microsoft.com/en-us/aspnet/core/security/)
* [Configure JWT Bearer Authentication in ASP.NET Core - Microsoft Documentation](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/jwt-authn)
* [Policy-based Authorization in ASP.NET Core - Microsoft Architecture Guide](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/policies)
* [Rate Limiting Middleware in ASP.NET Core - Microsoft Learn](https://learn.microsoft.com/en-us/aspnet/core/performance/rate-limit)
