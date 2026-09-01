# Laravel Dasar Cheatsheet Revised

> **Target:** pemula yang sudah memahami dasar PHP dan ingin belajar Laravel secara bertahap dari fondasi HTTP hingga arsitektur aplikasi.
>
> Fokus cheatsheet ini: **instalasi → Artisan → routing → Blade view → controller → request & input → validation → response & redirect → session & cookies → middleware → CSRF → route groups → storage & file upload → error handling → testing → environment & config → dependency injection → service container & provider → facades → maintenance mode → mini project**.
>
> **Catatan versi:** contoh diarahkan ke **Laravel modern (Laravel 11 / 12)**, termasuk konfigurasi middleware dan routing pada `bootstrap/app.php`.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami untuk mulai membuat aplikasi web Laravel

🟡 Lanjutan
→ pelajari setelah alur request-response dasar sudah nyaman

🔴 Operasional
→ penting saat mengelola aplikasi di server / production
```

Mental model alur HTTP request di Laravel:

```text
       Browser Request
              │
              │ URL: /users
              ▼
       routes/web.php
              │
              │ mencocokkan route
              ▼
       Middleware Pipeline (Auth, CSRF, Session)
              │
              │ lolos filter
              ▼
       Controller (UserController@store)
              │
              │ validasi request input
              ▼
       Request Validation
              │
              │ proses logika aplikasi
              ▼
       Response (Blade View / JSON / Redirect)
              │
              ▼
       Browser Menerima Tampilan (HTML / JSON)
```

**Hafalan:**

```text
Route      → menentukan alamat URL
Middleware → menyaring dan memvalidasi request
Controller → memproses logika dan data
Blade View → menampilkan antarmuka HTML
Response   → hasil akhir yang dikirim ke browser
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Laravel](#bagian-1)
2. [Membuat Project & Instalasi](#bagian-2)
3. [Menjalankan Server & Vite](#bagian-3)
4. [Struktur Direktori Project](#bagian-4)
5. [Mengenal Artisan CLI](#bagian-5)
6. [Route Pertama & Closure](#bagian-6)
7. [HTTP Routing Methods](#bagian-7)
8. [View & Blade Templating Dasar](#bagian-8)
9. [Layout Blade & Asset Vite](#bagian-9)
10. [Route Parameters](#bagian-10)
11. [Named Routes & URL Generator](#bagian-11)
12. [Controller](#bagian-12)
13. [HTTP Request Object](#bagian-13)
14. [Mengambil Data Input Request](#bagian-14)
15. [Form Validation Dasar](#bagian-15)
16. [Form Request Validation](#bagian-16)
17. [HTTP Responses](#bagian-17)
18. [HTTP Redirects](#bagian-18)
19. [Session & Flash Data](#bagian-19)
20. [Cookies](#bagian-20)
21. [Middleware Dasar](#bagian-21)
22. [Mendaftarkan Middleware](#bagian-22)
23. [CSRF Protection](#bagian-23)
24. [Route Groups & Prefixes](#bagian-24)
25. [File Storage Disk](#bagian-25)
26. [File Upload Handling](#bagian-26)
27. [Error Handling & Custom Error Pages](#bagian-27)
28. [HTTP Exceptions](#bagian-28)
29. [Testing Dasar](#bagian-29)
30. [Environment Configuration (.env)](#bagian-30)
31. [Application Environment & Debug Mode](#bagian-31)
32. [File Konfigurasi Laravel](#bagian-32)
33. [Configuration Caching](#bagian-33)

### 🟡 Lanjutan

34. [Dependency Injection](#bagian-34)
35. [Service Container](#bagian-35)
36. [Service Providers](#bagian-36)
37. [Facades](#bagian-37)
38. [Encryption vs Hashing](#bagian-38)

### 🔴 Operasional

39. [Maintenance Mode](#bagian-39)

### 🛠️ Referensi & Praktik

40. [Peta Ingatan Cepat](#bagian-40)
41. [Tabel Ringkasan](#bagian-41)
42. [Cheat Code Laravel Dasar 10 Detik](#bagian-42)
43. [Urutan Belajar yang Disarankan](#bagian-43)
44. [Mini Project: CRUD Sederhana User Portal](#bagian-44)
45. [Referensi Resmi](#bagian-45)

---

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan Laravel

## Konsep

**Laravel** adalah web application framework berbasis PHP dengan sintaks yang ekspresif, elegan, dan terstruktur. Laravel menangani kebutuhan umum aplikasi web seperti routing, otentikasi, validasi, sesi, caching, dan interaksi basis data.

## Diagram Alur Eksekusi

```text
       Browser User
            │
            │ HTTP Request
            ▼
       public/index.php (Entry Point)
            │
            │ bootstrap framework
            ▼
       Route Matching & Middleware
            │
            │ dispatch
            ▼
       Controller Action
            │
            │ generate output
            ▼
       HTTP Response (HTML / JSON)
```

## Route Paling Sederhana

```php
use Illuminate\Support\Facades\Route;

Route::get('/hello', function () {
    return 'Hello Laravel';
});
```

**Hafalan:**

```text
Laravel → framework PHP modern untuk membangun aplikasi web & REST API
```

---

<a id="bagian-2"></a>

# 2. 🟢 Membuat Project & Instalasi

## Konsep

Laravel membutuhkan PHP (versi 8.2+) dan dependency manager **Composer**.

## 1. Membuat Project dengan Composer

```bash
composer create-project laravel/laravel belajar-laravel
```

Masuk ke direktori:

```bash
cd belajar-laravel
```

## 2. Alternatif: Menggunakan Laravel Installer

```bash
laravel new belajar-laravel
```

## 3. Menyiapkan Dependensi Frontend

```bash
npm install
```

**Hafalan:**

```text
composer create-project laravel/laravel nama-app → install Laravel baru
composer install          → install dependensi PHP
npm install               → install dependensi frontend / Vite
```

---

<a id="bagian-3"></a>

# 3. 🟢 Menjalankan Server & Vite

## Konsep

Laravel menyediakan built-in web server melalui Artisan untuk proses development lokal.

## 1. Menjalankan Server PHP

```bash
php artisan serve
```

Aplikasi dapat dibuka di browser pada alamat:

```text
http://127.0.0.1:8000
```

## 2. Menjalankan Asset Server Vite (Frontend)

```bash
npm run dev
```

Untuk build production asset (CSS/JS minified):

```bash
npm run build
```

## Diagram Alur Server Development

```text
php artisan serve  ──> Melayani backend PHP (Port 8000)
npm run dev        ──> Melayani Hot Reload CSS & JS (Vite)
```

**Hafalan:**

```text
php artisan serve → jalankan web server backend
npm run dev       → jalankan asset server frontend
```

---

<a id="bagian-4"></a>

# 4. 🟢 Struktur Direktori Project

## Konsep

Laravel memiliki struktur folder yang rapi dan terstandarisasi:

```text
belajar-laravel/
├── app/                  <── Kode utama aplikasi (Controller, Model, Middleware)
│   ├── Http/
│   │   ├── Controllers/
│   │   └── Requests/
│   ├── Models/
│   └── Providers/
├── bootstrap/            <── Bootstrap framework & bootstrap/app.php
├── config/               <── File-file konfigurasi aplikasi
├── database/             <── Migrations, factories, seeders
├── public/               <── Document root publik & index.php
├── resources/            <── Blade views, raw CSS, JS
│   └── views/
├── routes/               <── Definisi rute web.php & console.php
├── storage/              <── Log aplikasi, cache, uploaded files
├── tests/                <── Automated tests (Feature & Unit)
├── .env                  <── Konfigurasi environment lokal
├── artisan               <── File CLI Artisan
└── composer.json         <── Dependensi PHP
```

## Ringkasan Fungsi Direktori Utama

| Direktori | Fungsi Utama |
|---|---|
| `app/Http/Controllers` | Tempat menyimpan class Controller |
| `app/Models` | Tempat menyimpan class Eloquent Model |
| `bootstrap/app.php` | Konfigurasi routing, middleware, dan exception handler (Laravel modern) |
| `config/` | Kumpulan file setting/konfigurasi aplikasi |
| `resources/views/` | Tempat file template antarmuka Blade (`.blade.php`) |
| `routes/web.php` | Tempat mendaftarkan rute web berbasis browser |
| `storage/` | Tempat penyimpanan file runtime, session file, dan log |

**Hafalan:**

```text
app/       → kode logika aplikasi
resources/ → tampilan Blade & asset
routes/    → daftar URL aplikasi
config/    → setting aplikasi
```

---

<a id="bagian-5"></a>

# 5. 🟢 Mengenal Artisan CLI

## Konsep

**Artisan** adalah antarmuka baris perintah (*Command Line Interface*) bawaan Laravel yang menyediakan perintah pembantu (*generator*) dan utilitas maintenance.

## Perintah Penting Artisan

```bash
# Menampilkan semua daftar command
php artisan list

# Menampilkan informasi rute yang terdaftar
php artisan route:list

# Membuat Controller baru
php artisan make:controller UserController

# Membuat Model baru
php artisan make:model Product

# Membuat Model sekaligus file Migration
php artisan make:model Product -m

# Membuat Middleware
php artisan make:middleware EnsureTokenIsValid

# Membuat Form Request Validation
php artisan make:request StoreUserRequest

# Menjalankan automated tests
php artisan test

# Menampilkan status detail aplikasi & environment
php artisan about
```

**Hafalan:**

```text
php artisan make:controller → buat controller
php artisan route:list      → lihat semua rute
php artisan test            → jalankan testing
```

---

<a id="bagian-6"></a>

# 6. 🟢 Route Pertama & Closure

## Konsep

Route menghubungkan metode HTTP dan URL yang diminta browser ke sebuah aksi (*handler*).

## Menulis Route di `routes/web.php`

```php
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/tentang-kami', function () {
    return 'Ini adalah halaman tentang kami.';
});
```

## Diagram Alur

```text
       Browser: GET /tentang-kami
                  │
                  ▼
       routes/web.php
                  │
                  ▼
       Closure Dieksekusi ──> Return: "Ini adalah halaman tentang kami."
```

**Hafalan:**

```text
Route::get('url', handler) → tangani request GET pada URL tertentu
```

---

<a id="bagian-7"></a>

# 7. 🟢 HTTP Routing Methods

## Konsep

Laravel mendukung seluruh kata kerja metode standar HTTP (RESTful verbs).

## Contoh Method Routing

```php
use Illuminate\Support\Facades\Route;

// Method Standar
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::patch('/users/{id}', [UserController::class, 'updatePartial']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// Menerima beberapa method tertentu
Route::match(['get', 'post'], '/feedback', [FeedbackController::class, 'handle']);

// Menerima seluruh method HTTP apa saja
Route::any('/webhook', [WebhookController::class, 'handle']);
```

**Hafalan:**

```text
GET    → membaca / mengambil data
POST   → membuat / mengirim data baru
PUT    → mengganti seluruh data
PATCH  → memperbarui sebagian data
DELETE → menghapus data
```

---

<a id="bagian-8"></a>

# 8. 🟢 View & Blade Templating Dasar

## Konsep

**Blade** adalah template engine bawaan Laravel yang sangat cepat dan berekstensi `.blade.php`.

## 1. Membuat View (`resources/views/greeting.blade.php`)

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <title>Greeting</title>
</head>
<body>
    <!-- Output data dengan proteksi XSS otomatis (htmlspecialchars) -->
    <h1>Halo, {{ $name }}!</h1>

    <!-- Kondisional -->
    @if ($age >= 18)
        <p>Status: Dewasa ({{ $age }} tahun)</p>
    @else
        <p>Status: Di bawah umur</p>
    @endif

    <!-- Perulangan -->
    <h3>Daftar Hobi:</h3>
    <ul>
        @forelse ($hobbies as $hobby)
            <li>{{ $hobby }}</li>
        @empty
            <li>Belum ada hobi yang terdaftar.</li>
        @endforelse
    </ul>
</body>
</html>
```

## 2. Mengembalikan View dari Route / Controller

```php
Route::get('/greeting', function () {
    return view('greeting', [
        'name' => 'Budi',
        'age' => 20,
        'hobbies' => ['Membaca', 'Coding', 'Bermusik'],
    ]);
});
```

**Hafalan:**

```text
{{ $var }}   → cetak variabel aman (escaped HTML)
{!! $var !!} → cetak variabel mentah (raw HTML - hati-hati XSS!)
@if / @endif → kondisional
@foreach     → looping data
```

---

<a id="bagian-9"></a>

# 9. 🟢 Layout Blade & Asset Vite

## Konsep

Agar tidak menulis struktur HTML (`<html>`, `<head>`, `<nav>`) berulang kali di setiap halaman, gunakan pola **Blade Layout Inheritance**.

## 1. Master Layout (`resources/views/layouts/app.blade.php`)

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'Aplikasi Laravel')</title>
    <!-- Memuat asset via Vite -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <nav class="navbar">
        <a href="/">Beranda</a>
        <a href="/about">Tentang</a>
    </nav>

    <main class="container">
        <!-- Tempat konten halaman anak disisipkan -->
        @yield('content')
    </main>
</body>
</html>
```

## 2. Halaman Anak (`resources/views/about.blade.php`)

```html
@extends('layouts.app')

@section('title', 'Tentang Kami')

@section('content')
    <h1>Halaman Tentang Kami</h1>
    <p>Selamat datang di profil perusahaan kami.</p>
@endsection
```

## Diagram Alur Layout

```text
       Master Layout (app.blade.php)
             │
             │ @yield('content')
             ▼
       Child View (about.blade.php) disisipkan
             │
             ▼
       HTML Utuh Dikirim ke Browser
```

**Hafalan:**

```text
@extends('layouts.app') → warisi layout induk
@section('content')     → isi slot konten
@yield('content')       → titik penyisipan konten di layout induk
```

---

<a id="bagian-10"></a>

# 10. 🟢 Route Parameters

## Konsep

Bagian URL yang dinamis didefinisikan menggunakan kurung kurawal `{param}`.

## 1. Required Parameter

```php
Route::get('/users/{id}', function (string $id) {
    return "Profil Pengguna ID: {$id}";
});
```

## 2. Multiple Parameters

```php
Route::get('/posts/{postId}/comments/{commentId}', function (string $postId, string $commentId) {
    return "Post {$postId} - Komentar {$commentId}";
});
```

## 3. Optional Parameter (`{param?}`)

```php
Route::get('/users/{name?}', function (?string $name = 'Tamu') {
    return "Halo, {$name}";
});
```

## 4. Parameter Constraints (Validasi Regex)

Gunakan `where` untuk membatasi format parameter:

```php
// Hanya cocok jika {id} berupa angka
Route::get('/products/{id}', function (string $id) {
    return "Produk ID: {$id}";
})->where('id', '[0-9]+');

// Menggunakan helper bawaan
Route::get('/users/{id}', function (string $id) { ... })->whereNumber('id');
Route::get('/category/{slug}', function (string $slug) { ... })->whereAlphaNumeric('slug');
```

**Hafalan:**

```text
{id}        → parameter wajib
{name?}     → parameter opsional
->whereNumber('id') → wajib angka
```

---

<a id="bagian-11"></a>

# 11. 🟢 Named Routes & URL Generator

## Konsep

Memberikan nama unik pada rute menggunakan `->name()` mempermudah pembuatan URL dan redirect tanpa terikat pada *hardcoded string*.

## Definisi Named Route

```php
Route::get('/pengguna/profil/akun/{id}', [UserProfileController::class, 'show'])->name('profile.show');
```

## Membuat URL dari Nama Rute

### Di Controller / PHP:

```php
// Menghasilkan: http://127.0.0.1:8000/pengguna/profil/akun/42
$url = route('profile.show', ['id' => 42]);

// Redirect langsung ke named route
return redirect()->route('profile.show', ['id' => 42]);
```

### Di Blade View:

```html
<a href="{{ route('profile.show', ['id' => 42]) }}">Lihat Profil</a>
```

**Hafalan:**

```text
->name('nama.rute') ──> route('nama.rute', ['id' => 1])
```

---

<a id="bagian-12"></a>

# 12. 🟢 Controller

## Konsep

Controller bertugas mengelompokkan logika penanganan HTTP request yang berkaitan ke dalam satu class tersendiri.

## 1. Membuat Controller via Artisan

```bash
php artisan make:controller UserController
```

## 2. Struktur Class Controller (`app/Http/Controllers/UserController.php`)

```php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;

class UserController extends Controller
{
    public function index(): View
    {
        $users = ['Budi', 'Andi', 'Siti'];
        return view('users.index', compact('users'));
    }

    public function show(string $id): View
    {
        return view('users.show', ['userId' => $id]);
    }
}
```

## 3. Menghubungkan Route dengan Controller

```php
use App\Http\Controllers\UserController;

Route::get('/users', [UserController::class, 'index'])->name('users.index');
Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show');
```

## Diagram Alur Request ke Controller

```text
       Browser: GET /users
              │
              │ routes/web.php
              ▼
       UserController@index
              │
              │ ambil data & render view
              ▼
       resources/views/users/index.blade.php
```

**Hafalan:**

```text
Route::get('/path', [NamaController::class, 'namaMethod'])
```

---

<a id="bagian-13"></a>

# 13. 🟢 HTTP Request Object

## Konsep

Objek `Illuminate\Http\Request` menyediakan representasi lengkap dari HTTP request yang masuk ke server (headers, URL, method, IP, input).

## Injeksi Request ke Controller Method

```php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function submit(Request $request)
    {
        // Membaca method HTTP (GET / POST)
        $method = $request->method();

        // Membaca path rute aktif
        $path = $request->path(); // e.g. 'contact/submit'

        // Membaca full URL
        $url = $request->fullUrl();

        // Membaca IP client
        $ip = $request->ip();

        // Memeriksa header request
        $userAgent = $request->header('User-Agent');
    }
}
```

**Hafalan:**

```text
Request $request → otomatis diinjeksi ke controller method oleh service container
```

---

<a id="bagian-14"></a>

# 14. 🟢 Mengambil Data Input Request

## Konsep

Laravel menyediakan beragam helper untuk membaca input form maupun query string secara aman.

## Berbagai Cara Mengambil Input

```php
use Illuminate\Http\Request;

public function store(Request $request)
{
    // 1. Mengambil 1 input spesifik (dengan default value jika kosong)
    $name = $request->input('name', 'Anonim');

    // 2. Mengambil via dynamic property
    $email = $request->email;

    // 3. Mengambil SEMUA input sekaligus (Array associative)
    $allData = $request->all();

    // 4. Mengambil HANYA field tertentu (White-listing)
    $safeData = $request->only(['name', 'email']);

    // 5. Mengambil semua KECUALI field tertentu
    $data = $request->except(['password_confirmation']);

    // 6. Mengambil nilai boolean (otomatis konversi "1", "true", "on" -> true)
    $subscribe = $request->boolean('newsletter');

    // 7. Memeriksa keberadaan input
    if ($request->has('promo_code')) {
        // field ada di request
    }
    if ($request->filled('promo_code')) {
        // field ada dan nilainya TIDAK kosong
    }
}
```

**Hafalan:**

```text
$request->input('field')                 → ambil 1 nilai
$request->only(['field1', 'field2'])     → ambil whitelist field
$request->filled('field')                → cek jika ada dan tidak kosong
```

---

<a id="bagian-15"></a>

# 15. 🟢 Form Validation Dasar

## Konsep

Validasi memastikan seluruh data yang dikirimkan user memenuhi aturan tipe, ukuran, dan format sebelum diproses oleh database.

## Contoh Validasi di Controller

```php
use Illuminate\Http\Request;

public function store(Request $request)
{
    // Otomatis redirect kembali jika validasi gagal, atau melempar JSON error jika API
    $validated = $request->validate([
        'name'     => ['required', 'string', 'min:3', 'max:50'],
        'email'    => ['required', 'email', 'max:100'],
        'age'      => ['required', 'integer', 'min:17'],
        'password' => ['required', 'string', 'min:8'],
    ]);

    // $validated hanya berisi data yang lolos validasi
    return "User {$validated['name']} berhasil divalidasi!";
}
```

## Menampilkan Error di Blade View (`create.blade.php`)

```html
<!-- Menampilkan semua error di bagian atas jika ada -->
@if ($errors->any())
    <div class="alert alert-danger">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form action="/users" method="POST">
    @csrf

    <div>
        <label>Nama:</label>
        <input type="text" name="name" value="{{ old('name') }}">
        <!-- Error spesifik field name -->
        @error('name')
            <span class="text-danger">{{ $message }}</span>
        @enderror
    </div>

    <button type="submit">Daftar</button>
</form>
```

## Diagram Alur Validasi

```text
       User Submit Form
              │
              │ $request->validate()
              ▼
       Pengecekan Aturan Validasi
        │                      │
        │ Lolos                │ Gagal
        ▼                      ▼
   Lanjut ke Logika       Redirect Back + Input Lama (old()) + Error Messages
```

**Hafalan:**

```text
$request->validate([...]) ──> validasi input
{{ old('name') }}         ──> kembalikan input user saat validasi gagal
@error('field')           ──> tampilkan pesan error spesifik
```

---

<a id="bagian-16"></a>

# 16. 🟢 Form Request Validation

## Konsep

Untuk menjaga Controller tetap ramping (*Skinny Controller*), aturan validasi yang panjang atau kompleks sebaiknya dipindahkan ke class **Form Request**.

## 1. Membuat Form Request

```bash
php artisan make:request StoreUserRequest
```

## 2. Mengisi Aturan di `app/Http/Requests/StoreUserRequest.php`

```php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Set true agar diizinkan
    }

    public function rules(): array
    {
        return [
            'name'  => ['required', 'string', 'max:50'],
            'email' => ['required', 'email', 'unique:users,email'],
        ];
    }
}
```

## 3. Injeksi ke Controller Method

```php
use App\Http\Requests\StoreUserRequest;

public function store(StoreUserRequest $request)
{
    // Validasi sudah otomatis berjalan SEBELUM baris ini dieksekusi!
    $validated = $request->validated();

    // Simpan ke database...
}
```

**Hafalan:**

```text
php artisan make:request → buat class validasi terpisah
$request->validated()    → ambil data hasil validasi Form Request
```

---

<a id="bagian-17"></a>

# 17. 🟢 HTTP Responses

## Konsep

Laravel mendukung beragam jenis response: string, Blade view, JSON data, download file, dan kustom status code.

## Ragam Response

```php
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;

// 1. Plain String Response
return response('Data berhasil disimpan', 200);

// 2. Custom Status Code & Header
return response('Akses Ditolak', 403)->header('X-Custom-Header', 'Value');

// 3. JSON Response (REST API)
return response()->json([
    'success' => true,
    'data' => ['id' => 1, 'name' => 'Budi'],
], 200);

// 4. File Download (Mengunduh file ke komputer user)
return response()->download(storage_path('app/public/laporan.pdf'), 'laporan-tahunan.pdf');

// 5. File Inline (Menampilkan gambar/PDF langsung di browser)
return response()->file(storage_path('app/public/gambar.jpg'));
```

**Hafalan:**

```text
response()->json()     → kirim data JSON (API)
response()->download() → unduh file
response('Text', 201)  → kirim status code HTTP kustom
```

---

<a id="bagian-18"></a>

# 18. 🟢 HTTP Redirects

## Konsep

Redirect menginstruksikan browser untuk berpindah ke URL lain setelah suatu aksi selesai diproses (misal: setelah berhasil menyimpan data form).

## Ragam Sintaks Redirect

```php
// 1. Redirect ke URL path tertentu
return redirect('/dashboard');

// 2. Redirect ke Named Route
return redirect()->route('users.index');

// 3. Redirect ke Named Route beserta Parameter
return redirect()->route('users.show', ['id' => 10]);

// 4. Redirect kembali ke halaman sebelumnya
return redirect()->back();

// 5. Redirect kembali dengan input lama yang dipertahankan
return back()->withInput();

// 6. Redirect dengan pesan flash data
return redirect()->route('users.index')->with('success', 'User berhasil ditambahkan!');
```

**Hafalan:**

```text
redirect()->route('name') → redirect ke named route
redirect()->back()        → kembali ke halaman sebelumnya
->with('key', 'message')  → sertakan flash message
```

---

<a id="bagian-19"></a>

# 19. 🟢 Session & Flash Data

## Konsep

HTTP bersifat *stateless*. **Session** digunakan untuk menyimpan data pengguna lintas request (seperti user login atau keranjang belanja).

## Mengelola Session

```php
use Illuminate\Http\Request;

// 1. Menyimpan data ke Session
session(['theme' => 'dark']);
$request->session()->put('cart_total', 150000);

// 2. Membaca data Session
$theme = session('theme', 'light'); // dengan default value 'light'
$cart = $request->session()->get('cart_total');

// 3. Memeriksa keberadaan data Session
if ($request->session()->has('theme')) { ... }

// 4. Menghapus data Session
$request->session()->forget('theme');
$request->session()->flush(); // Hapus seluruh isi session

// 5. Flash Data (Hanya bertahan selama 1 request berikutnya, cocok untuk notifikasi sukses)
$request->session()->flash('status', 'Profil berhasil diperbarui!');
```

## Membaca Flash Message di Blade

```html
@if (session('status'))
    <div class="alert alert-success">
        {{ session('status') }}
    </div>
@endif
```

**Hafalan:**

```text
session(['key' => 'value'])        → simpan permanen di sesi
session()->flash('key', 'message') → simpan sementara untuk 1 request berikutnya
```

---

<a id="bagian-20"></a>

# 20. 🟢 Cookies

## Konsep

Cookie adalah potongan data kecil yang disimpan di browser client dan otomatis dikirimkan kembali ke server pada setiap request berikutnya.

## Membaca dan Menulis Cookie

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

// 1. Membaca Cookie dari Request
public function index(Request $request)
{
    $fontSize = $request->cookie('font_size', '14px');
    // atau via Facade:
    $theme = Cookie::get('theme', 'light');
}

// 2. Menempelkan Cookie ke Response (nama, nilai, menit kedaluwarsa)
public function setCookie()
{
    return response('Cookie berhasil disimpan')
        ->cookie('font_size', '16px', 60 * 24 * 7); // bertahan 7 hari
}

// 3. Menghapus Cookie
public function deleteCookie()
{
    return response('Cookie dihapus')->withoutCookie('font_size');
}
```

**Catatan:** Secara default, seluruh cookie di Laravel otomatis dienkripsi dan ditandatangani (*signed*) demi keamanan agar tidak bisa diubah oleh client.

**Hafalan:**

```text
$request->cookie('name')                      → baca cookie
response()->cookie('name', 'value', $minutes) → kirim cookie ke browser
```

---

<a id="bagian-21"></a>

# 21. 🟢 Middleware Dasar

## Konsep

**Middleware** bertindak sebagai penyaring (*filter/pipeline*) HTTP request yang masuk sebelum mencapai Controller, atau memeriksa response sebelum dikirim ke browser.

## 1. Membuat Middleware via Artisan

```bash
php artisan make:middleware EnsureTokenIsValid
```

## 2. Struktur Middleware (`app/Http/Middleware/EnsureTokenIsValid.php`)

```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTokenIsValid
{
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Logika SEBELUM Controller dieksekusi
        if ($request->input('token') !== 'secret-token-123') {
            return redirect('/login')->with('error', 'Token akses tidak valid.');
        }

        // 2. Teruskan request ke lapisan berikutnya (Controller)
        $response = $next($request);

        // 3. Logika SETELAH Controller dieksekusi (opsional)
        return $response;
    }
}
```

## Diagram Pipeline Middleware

```text
       HTTP Request Masuk
               │
               ▼
       [ Middleware 1: EncryptCookies ]
               │
               ▼
       [ Middleware 2: VerifyCsrfToken ]
               │
               ▼
       [ Middleware 3: Custom Auth Middleware ]
        │                                 │
        │ Token Valid                     │ Token Tidak Valid
        ▼                                 ▼
       Controller Action             Redirect / Response Error
```

**Hafalan:**

```text
return $next($request); ──> izinkan request lanjut ke controller
```

---

<a id="bagian-22"></a>

# 22. 🟢 Mendaftarkan Middleware

## Konsep

Pada **Laravel modern (Laravel 11 / 12)**, middleware didaftarkan secara elegan melalui file **`bootstrap/app.php`** (menggantikan file `Kernel.php` lama).

## Konfigurasi di `bootstrap/app.php`

```php
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // 1. Mendaftarkan Alias Middleware (untuk digunakan di routes)
        $middleware->alias([
            'is-admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
            'check-token' => \App\Http\Middleware\EnsureTokenIsValid::class,
        ]);

        // 2. Menambahkan Global Middleware (berjalan di SEMUA request)
        // $middleware->append(\App\Http\Middleware\LogActivity::class);
    })
    ->create();
```

## Memasang Middleware pada Rute (`routes/web.php`)

```php
Route::get('/admin/dashboard', [AdminController::class, 'index'])
    ->middleware('is-admin');
```

**Hafalan:**

```text
bootstrap/app.php ->withMiddleware() ──> daftarkan alias middleware
->middleware('alias')                ──> pasang ke route
```

---

<a id="bagian-23"></a>

# 23. 🟢 CSRF Protection

## Konsep

**CSRF (Cross-Site Request Forgery)** adalah serangan di mana situs jahat mengeksekusi aksi berbahaya atas nama pengguna yang sedang terautentikasi. Laravel otomatis melindungi seluruh request `POST`, `PUT`, `PATCH`, dan `DELETE` dengan token CSRF.

## 1. Menyertakan CSRF Token di Form Blade

Setiap form HTML dengan method pengubah state **wajib menyertakan `@csrf`**:

```html
<form action="/users" method="POST">
    @csrf <!-- Menghasilkan input hidden berisi token CSRF -->

    <input type="text" name="name">
    <button type="submit">Simpan</button>
</form>
```

## 2. Form Method Spoofing (`@method`)

Karena tag HTML `<form>` hanya mendukung method `GET` dan `POST`, gunakan direktif `@method` untuk mensimulasikan method `PUT` atau `DELETE`:

```html
<form action="/users/1" method="POST">
    @csrf
    @method('PUT') <!-- Mensimulasikan request PUT -->

    <input type="text" name="name" value="Budi Baru">
    <button type="submit">Update</button>
</form>
```

**Hafalan:**

```text
@csrf          → wajib di setiap form POST/PUT/DELETE
@method('PUT') → spoofing HTTP method PUT / DELETE
```

**Kesalahan Umum:**

❌ Lupa menulis `@csrf` pada form HTML.  
Akibat: Laravel akan melempar error **`419 Page Expired`**.

---

<a id="bagian-24"></a>

# 24. 🟢 Route Groups & Prefixes

## Konsep

Route Groups memungkinkan kita berbagi atribut rute (seperti middleware, prefix URL, atau namespace nama rute) ke banyak rute sekaligus tanpa menulisnya berulang-ulang.

## Contoh Route Group Lengkap

```php
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;

// Grup Admin: Prefix URL '/admin', Named Route Prefix 'admin.', dan Middleware 'is-admin'
Route::middleware(['auth', 'is-admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // URL: /admin/dashboard  | Name: admin.dashboard
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // URL: /admin/users      | Name: admin.users
        Route::get('/users', [UserController::class, 'index'])->name('users');
    });
```

## Grouping Berdasarkan Controller

```php
Route::controller(OrderController::class)->group(function () {
    Route::get('/orders', 'index');
    Route::get('/orders/{id}', 'show');
    Route::post('/orders', 'store');
});
```

**Hafalan:**

```text
Route::prefix('admin')->group(...) ──> grup URL /admin/...
Route::name('admin.')->group(...)   ──> grup nama rute admin....
```

---

<a id="bagian-25"></a>

# 25. 🟢 File Storage Disk

## Konsep

Laravel menyediakan abstraksi filesystem yang fleksibel (`Illuminate\Support\Facades\Storage`) untuk mengelola file lokal maupun cloud (Amazon S3) dengan sintaks yang sama.

## Konfigurasi Disk (`config/filesystems.php`)

- **`local`**: File disimpan di `storage/app/private` (tidak bisa diakses publik browser).
- **`public`**: File disimpan di `storage/app/public` (bisa diakses publik setelah membuat symbolic link).

## Perintah Symbolic Link

Agar file di disk `public` dapat diakses langsung oleh browser:

```bash
php artisan storage:link
```

Perintah ini membuat shortcut dari `public/storage` mengarah ke `storage/app/public`.

## Mengelola File dengan Facade `Storage`

```php
use Illuminate\Support\Facades\Storage;

// Menulis file
Storage::disk('public')->put('catatan.txt', 'Isi teks catatan');

// Membaca file
$content = Storage::disk('public')->get('catatan.txt');

// Memeriksa keberadaan file
if (Storage::disk('public')->exists('catatan.txt')) { ... }

// Menghapus file
Storage::disk('public')->delete('catatan.txt');

// Mendapatkan URL publik file
$url = Storage::url('catatan.txt'); // e.g. /storage/catatan.txt
```

**Hafalan:**

```text
php artisan storage:link ──> hubungkan storage publik ke folder public/
Storage::disk('public')->put() ──> simpan file
```

---

<a id="bagian-26"></a>

# 26. 🟢 File Upload Handling

## Konsep

Laravel mempermudah validasi dan penyimpanan file yang diunggah (*file upload*) oleh pengguna.

## 1. Form Upload di Blade

Pastikan form memiliki atribut **`enctype="multipart/form-data"`**:

```html
<form action="/upload-avatar" method="POST" enctype="multipart/form-data">
    @csrf
    <input type="file" name="avatar">
    <button type="submit">Upload Foto</button>
</form>
```

## 2. Memproses Upload di Controller

```php
use Illuminate\Http\Request;

public function upload(Request $request)
{
    // Validasi file (gambar max 2MB)
    $request->validate([
        'avatar' => ['required', 'file', 'image', 'max:2048'], // max dalam kilobyte (2048 KB = 2MB)
    ]);

    if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
        // Simpan otomatis ke folder storage/app/public/avatars dengan nama unik
        $path = $request->file('avatar')->store('avatars', 'public');

        return "File berhasil disimpan di: {$path}";
    }

    return "Upload gagal.";
}
```

**Hafalan:**

```text
enctype="multipart/form-data" ──> wajib pada form upload
$request->file('avatar')->store('folder', 'public') ──> simpan file aman
```

---

<a id="bagian-27"></a>

# 27. 🟢 Error Handling & Custom Error Pages

## Konsep

Laravel otomatis menangani exception dan menampilkan halaman error detail saat development (`APP_DEBUG=true`). Di server production (`APP_DEBUG=false`), Laravel menampilkan halaman error HTTP yang ramah.

## Membuat Custom Error Page

Cukup buat file Blade di dalam folder `resources/views/errors/` sesuai kode status HTTP:

```text
resources/views/errors/
├── 404.blade.php  <── Ditampilkan saat halaman tidak ditemukan
├── 403.blade.php  <── Ditampilkan saat akses dilarang (Forbidden)
└── 500.blade.php  <── Ditampilkan saat terjadi server internal error
```

Contoh `resources/views/errors/404.blade.php`:

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <title>404 - Halaman Tidak Ditemukan</title>
</head>
<body style="text-align: center; padding-top: 5rem;">
    <h1>404</h1>
    <p>Maaf, halaman yang Anda tuju tidak ditemukan.</p>
    <a href="/">Kembali ke Beranda</a>
</body>
</html>
```

**Hafalan:**

```text
resources/views/errors/404.blade.php ──> kustomisasi tampilan error 404
```

---

<a id="bagian-28"></a>

# 28. 🟢 HTTP Exceptions

## Konsep

Fungsi helper `abort()` digunakan untuk langsung menghentikan eksekusi kode dan melempar HTTP exception dengan kode status tertentu.

## Penggunaan `abort()`

```php
public function show(string $id)
{
    $user = findUserById($id);

    // 1. Melempar error 404 jika user tidak ditemukan
    if (!$user) {
        abort(404, 'Pengguna tidak ditemukan.');
    }

    // 2. Helper kondisional abort_if()
    abort_if($user->is_banned, 403, 'Akun Anda sedang dibekukan.');

    // 3. Helper kondisional abort_unless()
    abort_unless($user->is_active, 403, 'Akun belum diaktivasi.');

    return view('users.show', compact('user'));
}
```

**Hafalan:**

```text
abort(404)          → hentikan & lempar 404 Not Found
abort(403)          → hentikan & lempar 403 Forbidden
abort_if(condition) → abort jika condition bernilai true
```

---

<a id="bagian-29"></a>

# 29. 🟢 Testing Dasar

## Konsep

Laravel dirancang dengan dukungan testing bawaan menggunakan **PHPUnit** atau **Pest**. Testing memastikan aplikasi berfungsi dengan benar setelah ada perubahan kode.

## 1. Membuat Feature Test

```bash
php artisan make:test UserPageTest
```

## 2. Menulis Test (`tests/Feature/UserPageTest.php`)

```php
namespace Tests\Feature;

use Tests\TestCase;

class UserPageTest extends TestCase
{
    public function test_halaman_beranda_bisa_diakses(): void
    {
        // 1. Simulasikan HTTP GET request
        $response = $this->get('/');

        // 2. Asersi status response harus 200 OK
        $response->assertStatus(200);

        // 3. Asersi teks tertentu tampil di halaman
        $response->assertSee('Selamat Datang');
    }

    public function test_form_user_butuh_nama(): void
    {
        // Simulasikan POST tanpa data
        $response = $this->post('/users', []);

        // Asersi terjadi error validasi pada session
        $response->assertSessionHasErrors(['name']);
    }
}
```

## 3. Menjalankan Test

```bash
php artisan test
```

**Hafalan:**

```text
php artisan test ──> jalankan seluruh test otomatis aplikasi
```

---

<a id="bagian-30"></a>

# 30. 🟢 Environment Configuration (.env)

## Konsep

File `.env` di root project menyimpan variabel konfigurasi lingkungan lokal yang berbeda-beda di setiap komputer pengembang atau server (seperti koneksi database dan kredensial API).

## Contoh File `.env`

```env
APP_NAME=LaravelApp
APP_ENV=local
APP_KEY=base64:randomKeyGeneratedByArtisan=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
```

## Membaca Nilai `.env` via `env()`

```php
// env('KEY', 'DEFAULT_FALLBACK')
$appName = env('APP_NAME', 'DefaultApp');
```

**Penting:** Jangan pernah memanggil fungsi `env()` langsung di dalam kode Controller atau Blade. Panggil `env()` hanya di dalam file-file folder `config/`, lalu baca menggunakan fungsi `config()`.

**Hafalan:**

```text
.env → file rahasia lokal (jangan pernah di-commit ke Git!)
.env.example → template contoh konfigurasi untuk tim
```

---

<a id="bagian-31"></a>

# 31. 🟢 Application Environment & Debug Mode

## Konsep

Dua variabel terpenting di dalam `.env`:
1. **`APP_ENV`**: Menentukan lingkungan kerja (`local`, `staging`, `production`).
2. **`APP_DEBUG`**: Menentukan apakah pesan error detail ditampilkan atau disembunyikan.

## Panduan Pengaturan Environment

```text
Komputer Pengembang (Lokal):
APP_ENV=local
APP_DEBUG=true   <── Error detail tampil untuk mempermudah debugging

Server Live (Produksi):
APP_ENV=production
APP_DEBUG=false  <── WAJIB false agar kredensial/database tidak bocor ke publik!
```

## Memeriksa Status Environment di Kode

```php
use Illuminate\Support\Facades\App;

if (App::environment('local')) {
    // Kode khusus lokal
}

if (App::environment(['staging', 'production'])) {
    // Kode khusus server
}
```

**Hafalan:**

```text
APP_DEBUG=false ──> WAJIB di server production demi keamanan!
```

---

<a id="bagian-32"></a>

# 32. 🟢 File Konfigurasi Laravel

## Konsep

Seluruh setting resmi aplikasi tersimpan di dalam direktori **`config/`** (seperti `config/app.php`, `config/database.php`, `config/filesystems.php`).

## Membaca Nilai Konfigurasi dengan `config()`

Gunakan notasi titik (*dot notation*) `nama_file.nama_kunci`:

```php
// Membaca 'name' dari config/app.php
$appName = config('app.name');

// Membaca dengan default fallback
$timezone = config('app.timezone', 'UTC');

// Mengubah konfigurasi saat runtime (hanya untuk request saat ini)
config(['app.locale' => 'id']);
```

## Mengapa `config()` > `env()`?

Ketika konfigurasi di-cache di server production (`php artisan config:cache`), seluruh pemanggilan `env()` di luar file `config/` akan mengembalikan `null`!

```text
.env  ──(dibaca oleh)──> config/app.php ──(dibaca oleh)──> config('app.name')
```

**Hafalan:**

```text
config('file.key') ──> cara standar & aman membaca konfigurasi aplikasi
```

---

<a id="bagian-33"></a>

# 33. 🟢 Configuration Caching

## Konsep

Di server production, menggabungkan seluruh file konfigurasi menjadi satu file cache meningkatkan performa boot Laravel secara signifikan.

## Perintah Artisan Config Cache

```bash
# Membuat cache konfigurasi (jalankan di server production saat deploy)
php artisan config:cache

# Menghapus cache konfigurasi (jika ada perubahan file .env / config)
php artisan config:clear

# Membersihkan seluruh cache (config, route, view)
php artisan optimize:clear
```

**Hafalan:**

```text
php artisan config:cache → aktifkan cache konfigurasi (production)
php artisan config:clear → bersihkan cache konfigurasi
```

---

<a id="bagian-34"></a>

# 34. 🟡 Dependency Injection

## Konsep

**Dependency Injection (DI)** adalah teknik di mana sebuah class tidak membuat objek dependensinya sendiri secara manual (`new Service()`), melainkan "disuntikkan" (*injected*) dari luar melalui constructor atau method parameter.

## Contoh Constructor Injection

```php
namespace App\Http\Controllers;

use App\Services\PaymentGateway;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    // PaymentGateway otomatis disuntikkan oleh Laravel
    public function __construct(
        protected PaymentGateway $payment
    ) {}

    public function process(Request $request)
    {
        $this->payment->charge($request->input('amount'));
        return 'Pembayaran sukses.';
    }
}
```

## Diagram Alur Dependency Injection

```text
       Request Masuk ke CheckoutController
                        │
                        ▼
       Laravel Service Container Mendeteksi:
       "CheckoutController butuh PaymentGateway"
                        │
                        │ Container otomatis membuat new PaymentGateway()
                        ▼
       Injeksi Objek ke Constructor Controller
```

**Hafalan:**

```text
Type-hint class pada constructor/method ──> Laravel sediakan objeknya otomatis
```

---

<a id="bagian-35"></a>

# 35. 🟡 Service Container

## Konsep

**Service Container** adalah kotak peralatan (*IoC Container*) milik Laravel yang bertugas mengelola pembuatan objek (*instantiation*) dan menyelesaikan dependensi class secara otomatis.

## 1. Binding (Mendaftarkan Pembuatan Objek)

```php
// Bind biasa (Instance baru dibuat setiap kali dipanggil)
app()->bind(BillingService::class, function ($app) {
    return new BillingService(config('services.stripe.key'));
});

// Singleton (Hanya 1 instance dibuat & dipakai bersama di seluruh aplikasi)
app()->singleton(ReportGenerator::class, function ($app) {
    return new ReportGenerator();
});
```

## 2. Resolving (Mengambil Objek dari Container)

```php
// Mengambil objek yang sudah siap pakai beserta dependensinya
$billing = app(BillingService::class);
```

**Hafalan:**

```text
app()->bind()      → buat objek baru tiap diminta
app()->singleton() → gunakan objek tunggal yang sama selamanya
app(NamaClass::class) → ambil instance dari container
```

---

<a id="bagian-36"></a>

# 36. 🟡 Service Providers

## Konsep

**Service Providers** adalah tempat sentral untuk mendaftarkan (*register*) binding Service Container dan menginisialisasi (*boot*) konfigurasi paket/service.

## Struktur Service Provider (`app/Providers/AppServiceProvider.php`)

```php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\PaymentService;

class AppServiceProvider extends ServiceProvider
{
    // 1. Method register: HANYA untuk binding ke Service Container
    public function register(): void
    {
        $this->app->singleton(PaymentService::class, function ($app) {
            return new PaymentService();
        });
    }

    // 2. Method boot: Dipanggil setelah SEMUA service provider selesai di-register
    public function boot(): void
    {
        // Tempat setting global (misal Blade directives, model events, paginator style)
    }
}
```

**Hafalan:**

```text
register() → tempat mendaftarkan binding ke container
boot()     → tempat menjalankan aksi setelah semua provider terdaftar
```

---

<a id="bagian-37"></a>

# 37. 🟡 Facades

## Konsep

**Facades** menyediakan antarmuka statis (*static proxy*) yang mudah dibaca ke class-class yang tersimpan di dalam Service Container.

## Contoh Facade vs Underlying Service

```php
// Menggunakan Facade statis
use Illuminate\Support\Facades\Cache;

Cache::put('key', 'value', 600);
$val = Cache::get('key');
```

Di balik layar, `Cache::get()` diteruskan ke objek sebenarnya di dalam Service Container:

```text
       Cache::get('key')
              │
              │ diterjemahkan oleh Facade
              ▼
       app('cache')->get('key')
```

## Daftar Facade yang Sering Digunakan

```text
Route::...   ──> Mengatur rute aplikasi
Storage::... ──> Mengelola file storage
Session::... ──> Mengelola session
Cookie::...  ──> Mengelola cookies
Crypt::...   ──> Enkripsi & dekripsi data
Hash::...    ──> Password hashing
Log::...     ──> Menulis log error/info
```

**Hafalan:**

```text
Facade = sintaks statis ringkas untuk mengakses service di Service Container
```

---

<a id="bagian-38"></a>

# 38. 🟡 Encryption vs Hashing

## Konsep

- **Encryption (Dua Arah)**: Data diacak menjadi ciphertext dan **dapat dikembalikan (didekripsi)** ke bentuk aslinya menggunakan APP_KEY.
- **Hashing (Satu Arah)**: Data diubah menjadi hash matematis dan **tidak bisa dikembalikan**. Digunakan khusus untuk password.

## 1. Encryption (Data Sensitif Rahasia)

```php
use Illuminate\Support\Facades\Crypt;

// Mengenkripsi string
$encrypted = Crypt::encryptString('Data Rahasia NIK');

// Mendekripsi string
$original = Crypt::decryptString($encrypted);
```

## 2. Hashing (Password User)

```php
use Illuminate\Support\Facades\Hash;

// Membuat hash password
$hashedPassword = Hash::make('password123');

// Memeriksa kecocokan password input dengan hash di database
if (Hash::check('password123', $hashedPassword)) {
    // Password benar
}
```

**Hafalan:**

```text
Crypt::encryptString() → untuk data rahasia yang butuh dibaca lagi
Hash::make()          → khusus password (satu arah, tidak bisa didekripsi)
```

---

<a id="bagian-39"></a>

# 39. 🔴 Maintenance Mode

## Konsep

Saat melakukan pembaruan besar di server produksi, Anda dapat mengaktifkan **Maintenance Mode** agar pengguna menerima halaman informasi ramah (HTTP status 503) alih-alih error aplikasi.

## Perintah Maintenance Mode

```bash
# Aktifkan maintenance mode
php artisan down

# Aktifkan dengan status code 503
php artisan down --status=503

# Aktifkan dengan Secret Bypass (akses via token rahasia)
php artisan down --secret="akses-rahasia-admin"

# Matikan maintenance mode (kembali online)
php artisan up
```

Jika secret bypass aktif, akses URL: `https://example.com/akses-rahasia-admin` sekali untuk mendapatkan cookie bypass dan melihat situs seperti biasa.

**Hafalan:**

```text
php artisan down → aplikasi maintenance (503)
php artisan up   → aplikasi normal online kembali
```

---

<a id="bagian-40"></a>

# 40. 🧠 Peta Ingatan Cepat

## A. Alur Lengkap HTTP Request-Response

```text
       Browser: HTTP Request
               │
               ▼
       routes/web.php
               │
               ▼
       Middleware Pipeline (CSRF, Auth, Session)
               │
               ▼
       Controller (Method Action)
               │
               ▼
       Request Validation ($request->validate())
               │
               ▼
       Business Logic / Model Data
               │
               ▼
       HTTP Response (Blade View / JSON / Redirect)
               │
               ▼
       Browser: Render HTML / JSON
```

## B. Anatomi Route

```text
Route::get('/users/{id}', [UserController::class, 'show'])
  │          │               │                 │
  │          │               │                 └── Action Method
  │          │               └──────────────────── Controller Class
  │          └──────────────────────────────────── URI Pattern
  └─────────────────────────────────────────────── HTTP Verb
```

## C. Alur Form Submission & Validasi

```text
       Blade Form (@csrf) ──(POST)──> Route ──> Controller@store
                                                     │
                                                     │ $request->validate()
                                      ┌──────────────┴──────────────┐
                                      │ Lolos                       │ Gagal
                                      ▼                             ▼
                               Proses Database              Redirect Back (old())
                                      │                             │
                                      ▼                             ▼
                            Redirect + with('success')      Tampilkan $errors
```

---

<a id="bagian-41"></a>

# 41. 📚 Tabel Ringkasan

| Materi | Konsep / API Utama | Fungsi & Kegunaan |
|---|---|---|
| Instalasi | `composer create-project` | Membuat project baru Laravel |
| Server | `php artisan serve` | Menjalankan local development server |
| Route | `Route::get()`, `post()` | Menghubungkan URL ke Controller/Closure |
| Named Route | `->name('nama')`, `route()` | Identitas rute untuk pembuatan URL fleksibel |
| Controller | `make:controller` | Class pemisah logika penanganan HTTP |
| View | `view('nama', $data)` | Merender template antarmuka Blade |
| Request Input | `$request->input()`, `only()` | Membaca parameter data dari client |
| Validation | `$request->validate()` | Memvalidasi integritas input form |
| Form Request | `make:request` | Class terisolasi untuk aturan validasi kompleks |
| Response | `response()`, `json()` | Mengembalikan data teks, status code, atau JSON |
| Redirect | `redirect()->route()` | Mengarahkan browser ke URL lain |
| Session | `session()`, `->with()` | Menyimpan data persist sementara antar-request |
| Cookie | `cookie()`, `$request->cookie`| Mengelola data cookie pada browser |
| Middleware | `make:middleware`, `$next` | Menyaring dan mengamankan HTTP request |
| CSRF | `@csrf` | Token pelindung serangan Cross-Site Request Forgery |
| Storage | `Storage::disk()`, `storage:link` | Abstraksi penyimpanan berkas/file |
| Upload | `$request->file()->store()` | Memvalidasi dan menyimpan upload file |
| Exception | `abort(404)`, `abort(403)` | Menghentikan kode dengan HTTP error status |
| Config | `config('file.key')` | Membaca konfigurasi aplikasi secara aman |
| DI | Type-hinting constructor | Injeksi dependensi otomatis oleh container |
| Facades | `Route`, `Storage`, `Crypt` | Antarmuka statis ke service di container |
| Maintenance | `artisan down`, `up` | Mengaktifkan/mematikan maintenance mode |

---

<a id="bagian-42"></a>

# 42. ⚡ Cheat Code Laravel Dasar 10 Detik

```text
php artisan serve          → Jalankan server lokal
routes/web.php             → Tempat daftarkan rute
view('nama', compact('x')) → Render Blade view
$request->validate([...])  → Validasi input
return redirect()->route() → Pindah halaman
@csrf                      → Wajib di setiap form POST
php artisan make:...       → Generator otomatis class
config('app.name')         → Baca setting konfigurasi
```

Contekan Alur CRUD 1 File:

```php
// routes/web.php
Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
Route::post('/users', [UserController::class, 'store'])->name('users.store');

// UserController.php
public function store(Request $request) {
    $data = $request->validate([
        'name' => ['required', 'string', 'max:50'],
        'email' => ['required', 'email'],
    ]);

    // Simpan data...
    return redirect()->route('users.create')->with('success', 'User berhasil dibuat!');
}
```

---

<a id="bagian-43"></a>

# 43. 🧭 Urutan Belajar yang Disarankan

```text
1. 🟢 Fondasi Aplikasi
   ├─ Instalasi Laravel & memahami struktur folder
   ├─ Menjalankan server lokal (Artisan & Vite)
   ├─ Membuat Routing dasar & Parameter ({id})
   └─ Membuat Blade View, Layout inheritance & Asset Vite
2. 🟢 Alur HTTP Request & Form
   ├─ Membuat Controller & menghubungkan ke Route
   ├─ Membaca Request Input ($request->input())
   ├─ Melakukan Form Validation ($request->validate())
   ├─ Proteksi Form dengan @csrf & method spoofing
   └─ Mengembalikan Response, JSON, & Redirect with Flash Message
3. 🟡 Keamanan, File & Middleware
   ├─ Mengelola Session & Cookies
   ├─ Menyaring request dengan Middleware
   ├─ Mengelola File Storage & File Upload
   ├─ Menangani Error & HTTP Exceptions (abort(404))
   └─ Konfigurasi Environment (.env vs config())
4. 🔴 Arsitektur Lanjutan
   ├─ Memahami Dependency Injection & Service Container
   ├─ Mengenal Service Providers & Facades
   ├─ Menjalankan Automated Testing dasar
   └─ Mengerjakan Mini Project Terpadu
```

---

<a id="bagian-44"></a>

# 44. 🏗️ Mini Project: CRUD Sederhana User Portal

Contoh proyek mini yang menggabungkan: **Routing, Controller, Form Request Validation, Blade Layout, CSRF, dan Flash Session**.

## 1. Controller (`app/Http/Controllers/UserController.php`)

```php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;

class UserController extends Controller
{
    public function create(): View
    {
        return view('users.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'  => ['required', 'string', 'min:3', 'max:50'],
            'email' => ['required', 'email'],
        ]);

        // Simulasi simpan data...
        
        return redirect()
            ->route('users.create')
            ->with('success', "Pengguna {$validated['name']} berhasil didaftarkan!");
    }
}
```

## 2. Rute (`routes/web.php`)

```php
use App\Http\Controllers\UserController;

Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
Route::post('/users', [UserController::class, 'store'])->name('users.store');
```

## 3. Template View (`resources/views/users/create.blade.php`)

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Pendaftaran Pengguna</title>
    <style>
        body { font-family: sans-serif; max-width: 500px; margin: 2rem auto; }
        .alert-success { background: #d4edda; color: #155724; padding: 0.75rem; border-radius: 4px; margin-bottom: 1rem; }
        .form-group { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.25rem; }
        input { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        .text-error { color: #dc3545; font-size: 0.875rem; }
        button { background: #42b883; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>
    <h2>Form Pendaftaran Pengguna</h2>

    <!-- Flash Message Sukses -->
    @if (session('success'))
        <div class="alert-success">
            {{ session('success') }}
        </div>
    @endif

    <form action="{{ route('users.store') }}" method="POST">
        @csrf

        <div class="form-group">
            <label>Nama Lengkap:</label>
            <input type="text" name="name" value="{{ old('name') }}" placeholder="Masukkan nama...">
            @error('name')
                <span class="text-error">{{ $message }}</span>
            @enderror
        </div>

        <div class="form-group">
            <label>Alamat Email:</label>
            <input type="email" name="email" value="{{ old('email') }}" placeholder="nama@domain.com">
            @error('email')
                <span class="text-error">{{ $message }}</span>
            @enderror
        </div>

        <button type="submit">Daftarkan Pengguna</button>
    </form>
</body>
</html>
```

## Output Tampilan Mini Project

```text
Form Pendaftaran Pengguna

[ Pengguna Budi Santoso berhasil didaftarkan! ]

Nama Lengkap:
[ Budi Santoso ]

Alamat Email:
[ budi@example.com ]

[ Daftarkan Pengguna ]
```

## Diagram Alur Mini Project

```text
       GET /users/create ──> UserController@create ──> users/create.blade.php
                                                              │
                                                              │ Submit Form
                                                              ▼
       POST /users       ──> UserController@store  <── Kirim Data (@csrf)
                                    │
                                    │ $request->validate()
                                    ▼
       Redirect Back     ──> users/create.blade.php + with('success')
```

**Kunci:** Alur Request → Route → Controller → Validation → Response/Redirect adalah inti 80% pekerjaan pengembangan aplikasi web dengan Laravel.

---

<a id="bagian-45"></a>

# 45. 🔗 Referensi Resmi

- [Laravel Documentation](https://laravel.com/docs/)
- [Installation Guide](https://laravel.com/docs/installation)
- [Routing Documentation](https://laravel.com/docs/routing)
- [Controllers Guide](https://laravel.com/docs/controllers)
- [HTTP Requests](https://laravel.com/docs/requests)
- [Validation Guide](https://laravel.com/docs/validation)
- [Blade Templates](https://laravel.com/docs/blade)
- [Middleware Documentation](https://laravel.com/docs/middleware)
- [Session Management](https://laravel.com/docs/session)
- [File Storage](https://laravel.com/docs/filesystem)
- [Service Container](https://laravel.com/docs/container)
- [Service Providers](https://laravel.com/docs/providers)
- [Facades Reference](https://laravel.com/docs/facades)
- [Testing Guide](https://laravel.com/docs/testing)
