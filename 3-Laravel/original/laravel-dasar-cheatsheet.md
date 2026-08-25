# Laravel Dasar Cheatsheet — Mudah Dipahami & Diingat

> **Target:** memahami fondasi Laravel dari membuat project sampai request, routing, controller, middleware, session, error handling, dan maintenance mode.
>
> Pola: **konsep → syntax → contoh → output → hafalan**.
>
> Contoh mengikuti pola Laravel modern. Beberapa detail dapat berbeda antar versi Laravel, jadi gunakan dokumentasi resmi sesuai versi project yang sedang dipakai.

## Daftar Isi

1. [Pengenalan Laravel](#1-pengenalan-laravel)
2. [Membuat Project](#2-membuat-project)
3. [Struktur Project](#3-struktur-project)
4. [Menjalankan Laravel](#4-menjalankan-laravel)
5. [Artisan](#5-artisan)
6. [Request Lifecycle](#6-request-lifecycle)
7. [Testing](#7-testing)
8. [Environment](#8-environment)
9. [Application Environment](#9-application-environment)
10. [Configuration](#10-configuration)
11. [Configuration Cache](#11-configuration-cache)
12. [Dependency Injection](#12-dependency-injection)
13. [Service Container](#13-service-container)
14. [Service Provider](#14-service-provider)
15. [Facades](#15-facades)
16. [Routing](#16-routing)
17. [View](#17-view)
18. [Static File](#18-static-file)
19. [Route Parameter](#19-route-parameter)
20. [Named Route](#20-named-route)
21. [Controller](#21-controller)
22. [Request](#22-request)
23. [Request Input](#23-request-input)
24. [Input Type](#24-input-type)
25. [Filter Request Input](#25-filter-request-input)
26. [File Storage](#26-file-storage)
27. [File Upload](#27-file-upload)
28. [Response](#28-response)
29. [Encryption](#29-encryption)
30. [Cookie](#30-cookie)
31. [Redirect](#31-redirect)
32. [Middleware](#32-middleware)
33. [Cross Site Request Forgery](#33-cross-site-request-forgery)
34. [Route Group](#34-route-group)
35. [URL Generation](#35-url-generation)
36. [Session](#36-session)
37. [Error Handling](#37-error-handling)
38. [HTTP Exception](#38-http-exception)
39. [Maintenance Mode](#39-maintenance-mode)
40. [Mini Project](#40-mini-project)
41. [Tabel Ringkasan](#41-tabel-ringkasan)
42. [Cheat Code Laravel Dasar 10 Detik](#42-cheat-code-laravel-dasar-10-detik)
43. [Referensi Resmi](#43-referensi-resmi)

---

# 1. Pengenalan Laravel

Laravel adalah framework PHP untuk membuat aplikasi web dengan sintaks yang ekspresif dan struktur yang terorganisasi.

Laravel banyak digunakan untuk:

```text
Web Application
REST API
Authentication
Database Application
CRUD
Backend
```

Konsep yang sering ditemui:

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service / Model
  ↓
View / JSON Response
```

Contoh route paling sederhana:

```php
use Illuminate\Support\Facades\Route;

Route::get('/hello', function () {
    return 'Hello Laravel';
});
```

**Hafalan:**

```text
Laravel
→ framework PHP
→ membantu routing, HTTP, view, database,
  security, testing, dan struktur aplikasi
```

---

# 2. Membuat Project

Laravel membutuhkan PHP dan dependency manager Composer.

Cara umum membuat project:

```bash
composer create-project laravel/laravel belajar-laravel
```

Masuk ke project:

```bash
cd belajar-laravel
```

Alternatif menggunakan Laravel installer jika sudah terpasang:

```bash
laravel new belajar-laravel
```

Install dependency:

```bash
composer install
```

Jika menggunakan Node/Vite untuk asset frontend:

```bash
npm install
```

Build asset:

```bash
npm run build
```

Development:

```bash
npm run dev
```

**Hafalan:**

```text
composer create-project
→ buat project

composer install
→ install dependency PHP

npm install
→ install dependency frontend

npm run dev
→ development asset server
```

---

# 3. Struktur Project

Struktur umum Laravel:

```text
belajar-laravel/
│
├── app/
│   ├── Console/
│   ├── Exceptions/
│   ├── Http/
│   │   ├── Controllers/
│   │   └── Middleware/
│   ├── Models/
│   └── Providers/
│
├── bootstrap/
│
├── config/
│
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
│
├── public/
│   ├── index.php
│   └── ...
│
├── resources/
│   ├── css/
│   ├── js/
│   └── views/
│
├── routes/
│   ├── console.php
│   └── web.php
│
├── storage/
│
├── tests/
│   ├── Feature/
│   └── Unit/
│
├── .env
├── artisan
├── composer.json
└── package.json
```

## Folder penting

| Folder | Fungsi |
|---|---|
| `app/` | kode aplikasi |
| `app/Http/Controllers` | controller |
| `app/Models` | model |
| `app/Providers` | service provider |
| `bootstrap/` | bootstrap aplikasi/framework |
| `config/` | konfigurasi |
| `database/` | migration, factory, seeder |
| `public/` | document root / entry point |
| `resources/views` | Blade view |
| `routes/` | route |
| `storage/` | log, cache, file |
| `tests/` | automated test |
| `.env` | environment variable |
| `artisan` | CLI Laravel |

**Hafalan:**

```text
app
→ kode aplikasi

config
→ konfigurasi

database
→ database support files

public
→ file publik / entry point

resources
→ view dan asset sumber

routes
→ URL aplikasi

storage
→ file runtime

tests
→ testing
```

---

# 4. Menjalankan Laravel

## Development Server

Cara umum:

```bash
php artisan serve
```

Biasanya aplikasi dapat diakses melalui:

```text
http://127.0.0.1:8000
```

Pada stack Laravel modern, command `composer run dev` juga dapat digunakan jika script development tersedia di project:

```bash
composer run dev
```

## Vite

Development frontend:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

**Hafalan:**

```text
php artisan serve
→ server PHP development

npm run dev
→ Vite development

npm run build
→ build asset production
```

---

# 5. Artisan

Artisan adalah command-line interface bawaan Laravel.

Melihat semua command:

```bash
php artisan list
```

Melihat bantuan:

```bash
php artisan help route:list
```

Melihat route:

```bash
php artisan route:list
```

Membuat controller:

```bash
php artisan make:controller UserController
```

Membuat model:

```bash
php artisan make:model User
```

Membuat model + migration:

```bash
php artisan make:model User -m
```

Membuat middleware:

```bash
php artisan make:middleware AdminMiddleware
```

Membuat request class:

```bash
php artisan make:request StoreUserRequest
```

Membuat test:

```bash
php artisan make:test UserTest
```

Menjalankan test:

```bash
php artisan test
```

Melihat environment:

```bash
php artisan about
```

Melihat konfigurasi:

```bash
php artisan config:show app
```

Cache konfigurasi:

```bash
php artisan config:cache
```

Membersihkan cache konfigurasi:

```bash
php artisan config:clear
```

Maintenance mode:

```bash
php artisan down
```

Keluar maintenance:

```bash
php artisan up
```

**Hafalan:**

```text
artisan
→ terminal Laravel
```

---

# 6. Request Lifecycle

Request Laravel secara sederhana berjalan seperti:

```text
Browser
  ↓
public/index.php
  ↓
Bootstrap Laravel
  ↓
Service Container
  ↓
HTTP Kernel / middleware pipeline
  ↓
Router
  ↓
Route Middleware
  ↓
Controller / Closure
  ↓
Response
  ↓
Middleware
  ↓
Browser
```

Contoh:

```text
GET /users
   ↓
Route
   ↓
Middleware
   ↓
UserController@index
   ↓
View / JSON
   ↓
HTTP Response
```

File `public/index.php` berperan sebagai entry point HTTP.

**Hafalan:**

```text
Request
→ masuk public/index.php
→ bootstrap
→ middleware
→ route
→ controller
→ response
```

---

# 7. Testing

Laravel menyediakan testing support dengan Pest dan PHPUnit pada project modern.

Menjalankan seluruh test:

```bash
php artisan test
```

Membuat feature test:

```bash
php artisan make:test UserTest
```

Membuat unit test:

```bash
php artisan make:test UserTest --unit
```

Contoh:

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;

class HomeTest extends TestCase
{
    public function test_home_page_is_accessible(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
```

Contoh assertion:

```php
$response->assertStatus(200);

$response->assertOk();

$response->assertNotFound();

$response->assertRedirect();

$response->assertSee('Laravel');
```

Testing request JSON:

```php
$response = $this->getJson('/api/users');

$response->assertOk();
```

**Hafalan:**

```text
Feature Test
→ menguji fitur dari sudut pandang aplikasi

Unit Test
→ menguji bagian kecil secara terisolasi

php artisan test
→ jalankan test
```

---

# 8. Environment

File `.env` menyimpan konfigurasi yang berbeda antar environment.

Contoh:

```env
APP_NAME=Laravel
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

Mengakses environment:

```php
env('APP_NAME');
```

Namun dalam kode aplikasi, nilai konfigurasi sebaiknya dibaca melalui `config()` setelah dipetakan ke file config:

```php
config('app.name');
```

## `.env.example`

File `.env.example` biasanya menjadi template variable environment.

Jangan memasukkan secret production ke repository.

**Hafalan:**

```text
.env
→ environment-specific values

.env.example
→ template

config()
→ baca konfigurasi aplikasi
```

---

# 9. Application Environment

Laravel menyediakan informasi environment aplikasi.

```php
app()->environment();
```

Contoh:

```php
if (app()->environment('local')) {
    // hanya local
}
```

Bisa juga:

```php
if (app()->environment([
    'local',
    'testing'
])) {
    // local atau testing
}
```

Contoh berdasarkan environment:

```php
if (app()->environment('production')) {
    // production
}
```

**Hafalan:**

```text
local
→ development

testing
→ automated test

production
→ aplikasi production
```

---

# 10. Configuration

File konfigurasi berada di:

```text
config/
```

Contoh:

```text
config/app.php
config/database.php
config/filesystems.php
config/cache.php
```

Mengambil konfigurasi:

```php
$name = config('app.name');
```

Nested configuration:

```php
$value = config(
    'database.default'
);
```

Memberikan default:

```php
$value = config(
    'app.timezone',
    'UTC'
);
```

Mengubah configuration saat runtime:

```php
config([
    'app.name' => 'Belajar Laravel'
]);
```

Perubahan runtime tersebut tidak berarti mengubah file konfigurasi secara permanen.

**Hafalan:**

```text
config/file.php
→ tempat konfigurasi

config('key')
→ membaca konfigurasi
```

---

# 11. Configuration Cache

Untuk production, konfigurasi dapat di-cache.

```bash
php artisan config:cache
```

Membersihkan:

```bash
php artisan config:clear
```

Setelah configuration cache dibuat, jangan mengandalkan `env()` secara langsung di sembarang tempat aplikasi.

Pola yang disarankan:

```text
.env
  ↓
config/*.php
  ↓
config()
  ↓
application code
```

Contoh:

```php
// config/app.php
'company_name' => env(
    'COMPANY_NAME',
    'My Company'
),
```

Lalu:

```php
config('app.company_name');
```

**Hafalan:**

```text
env()
→ sumber environment

config()
→ API konfigurasi aplikasi

config:cache
→ cache konfigurasi
```

---

# 12. Dependency Injection

Dependency Injection berarti dependency diberikan dari luar, bukan dibuat langsung di dalam class.

Tanpa DI:

```php
class UserController
{
    public function index()
    {
        $service =
            new UserService();

        return $service->getUsers();
    }
}
```

Dengan DI:

```php
class UserController
{
    public function __construct(
        private UserService $service
    ) {
    }

    public function index()
    {
        return $this->service->getUsers();
    }
}
```

Laravel dapat membantu me-resolve dependency melalui Service Container.

**Keuntungan:**

```text
lebih mudah testing
lebih mudah mengganti implementation
dependency lebih jelas
class lebih terstruktur
```

**Hafalan:**

```text
Dependency Injection
→ dependency diberikan
→ bukan dibuat manual di dalam class
```

---

# 13. Service Container

Service Container adalah mekanisme Laravel untuk mengelola dependency dan dependency resolution.

Resolve class:

```php
$service =
    app(UserService::class);
```

Atau:

```php
$service =
    resolve(UserService::class);
```

Binding:

```php
$this->app->bind(
    UserRepositoryInterface::class,
    UserRepository::class
);
```

Singleton:

```php
$this->app->singleton(
    UserService::class,
    function ($app) {
        return new UserService();
    }
);
```

Kemudian:

```php
app(UserService::class);
```

**Hafalan:**

```text
Container
→ tempat Laravel mengelola dependency

bind
→ buat binding

singleton
→ satu instance dalam lifecycle container
```

---

# 14. Service Provider

Service Provider adalah tempat utama untuk mendaftarkan atau melakukan bootstrap service aplikasi.

Contoh sederhana:

```php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider
    extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        //
    }
}
```

## `register()`

Gunakan untuk mendaftarkan binding ke container:

```php
public function register(): void
{
    $this->app->bind(
        UserService::class,
        fn () => new UserService()
    );
}
```

## `boot()`

Digunakan setelah service provider terdaftar.

```php
public function boot(): void
{
    // bootstrap logic
}
```

**Hafalan:**

```text
register
→ daftar service/binding

boot
→ jalankan bootstrap setelah provider diregistrasikan
```

---

# 15. Facades

Facade menyediakan interface statis yang nyaman terhadap service di container.

Contoh:

```php
use Illuminate\Support\Facades\Log;

Log::info(
    'User login'
);
```

Cache:

```php
use Illuminate\Support\Facades\Cache;

Cache::put(
    'name',
    'Budi',
    60
);
```

Response:

```php
return response()->json([
    'name' => 'Budi'
]);
```

Facade bukan berarti service benar-benar menggunakan static state biasa; Laravel facade meneruskan pemanggilan ke object yang dikelola container.

**Hafalan:**

```text
Facade
→ syntax singkat untuk service Laravel
```

---

# 16. Routing

Route biasanya didefinisikan di:

```text
routes/web.php
```

Contoh:

```php
use Illuminate\Support\Facades\Route;

Route::get('/hello', function () {
    return 'Hello Laravel';
});
```

HTTP method:

```php
Route::get(...);

Route::post(...);

Route::put(...);

Route::patch(...);

Route::delete(...);

Route::options(...);
```

Multiple method:

```php
Route::match(
    ['get', 'post'],
    '/hello',
    function () {
        return 'Hello';
    }
);
```

Semua method:

```php
Route::any(
    '/hello',
    function () {
        return 'Hello';
    }
);
```

Melihat route:

```bash
php artisan route:list
```

**Hafalan:**

```text
GET
POST
PUT
PATCH
DELETE
```

---

# 17. View

View biasanya berada di:

```text
resources/views/
```

Contoh:

```text
resources/views/home.blade.php
```

Route:

```php
Route::get('/home', function () {
    return view('home');
});
```

Dengan data:

```php
return view(
    'home',
    [
        'name' => 'Budi'
    ]
);
```

Blade:

```blade
<h1>Hello {{ $name }}</h1>
```

## Blade escaping

```blade
{{ $name }}
```

Secara default Blade melakukan HTML escaping.

Untuk raw HTML:

```blade
{!! $html !!}
```

Gunakan raw output hanya jika memang mempercayai atau sudah men-sanitize HTML tersebut.

## Blade condition

```blade
@if ($age >= 18)
    Dewasa
@else
    Anak-anak
@endif
```

## Blade loop

```blade
@foreach ($users as $user)
    <p>{{ $user->name }}</p>
@endforeach
```

**Hafalan:**

```text
view('home')
→ resources/views/home.blade.php
```

---

# 18. Static File

File publik biasanya diletakkan di:

```text
public/
```

Contoh:

```text
public/css/app.css
public/js/app.js
public/images/logo.png
```

Di Blade:

```blade
<link
    rel="stylesheet"
    href="{{ asset('css/app.css') }}"
>
```

JavaScript:

```blade
<script
    src="{{ asset('js/app.js') }}"
></script>
```

Image:

```blade
<img
    src="{{ asset('images/logo.png') }}"
    alt="Logo"
>
```

Untuk asset yang diproses Vite, Laravel modern menggunakan:

```blade
@vite([
    'resources/css/app.css',
    'resources/js/app.js'
])
```

**Hafalan:**

```text
public/
→ static/public file

asset()
→ URL ke asset public

@vite()
→ asset yang dikelola Vite
```

---

# 19. Route Parameter

Parameter biasa:

```php
Route::get(
    '/users/{id}',
    function ($id) {
        return "User $id";
    }
);
```

URL:

```text
/users/10
```

Hasil:

```text
User 10
```

## Optional parameter

```php
Route::get(
    '/hello/{name?}',
    function ($name = 'Guest') {
        return "Hello $name";
    }
);
```

## Constraint

```php
Route::get(
    '/users/{id}',
    function ($id) {
        return $id;
    }
)->whereNumber('id');
```

Regex:

```php
->where(
    'id',
    '[0-9]+'
);
```

**Hafalan:**

```text
/users/{id}
→ required parameter

/users/{name?}
→ optional parameter

whereNumber()
→ parameter harus angka
```

---

# 20. Named Route

Memberikan nama pada route:

```php
Route::get(
    '/users/{id}',
    function ($id) {
        return $id;
    }
)->name('users.show');
```

Generate URL:

```php
$url = route(
    'users.show',
    ['id' => 10]
);
```

Blade:

```blade
<a href="{{ route(
    'users.show',
    ['id' => $user->id]
) }}">
    Detail
</a>
```

Redirect:

```php
return redirect()->route(
    'users.show',
    ['id' => 10]
);
```

**Hafalan:**

```text
name()
→ beri nama route

route()
→ generate URL berdasarkan nama
```

---

# 21. Controller

Membuat controller:

```bash
php artisan make:controller UserController
```

Contoh:

```php
namespace App\Http\Controllers;

class UserController
{
    public function index()
    {
        return view('users.index');
    }
}
```

Route:

```php
use App\Http\Controllers\UserController;

Route::get(
    '/users',
    [UserController::class, 'index']
);
```

## Resource Controller

```bash
php artisan make:controller UserController --resource
```

Route:

```php
Route::resource(
    'users',
    UserController::class
);
```

Resource controller umumnya memiliki action:

```text
index
create
store
show
edit
update
destroy
```

**Hafalan:**

```text
Route
→ menentukan URL

Controller
→ menangani request/action
```

---

# 22. Request

Laravel menyediakan `Illuminate\Http\Request`.

```php
use Illuminate\Http\Request;

Route::post(
    '/users',
    function (Request $request) {
        return $request->method();
    }
);
```

## Request URL

```php
$request->url();
```

## Full URL

```php
$request->fullUrl();
```

## HTTP Method

```php
$request->method();
```

## Path

```php
$request->path();
```

## IP

```php
$request->ip();
```

**Hafalan:**

```text
Request
→ semua informasi request HTTP
```

---

# 23. Request Input

## `input()`

```php
$name =
    $request->input('name');
```

Default value:

```php
$name =
    $request->input(
        'name',
        'Guest'
    );
```

Nested input:

```php
$city =
    $request->input(
        'user.address.city'
    );
```

## `all()`

```php
$data =
    $request->all();
```

## `only()`

```php
$data =
    $request->only([
        'name',
        'email'
    ]);
```

## `except()`

```php
$data =
    $request->except([
        'password'
    ]);
```

**Hafalan:**

```text
input()
→ ambil input

all()
→ semua input

only()
→ hanya field tertentu

except()
→ semua kecuali field tertentu
```

---

# 24. Input Type

Request memiliki helper untuk tipe input tertentu.

## `string()`

```php
$name =
    $request->string('name');
```

## `integer()`

```php
$age =
    $request->integer('age');
```

## `boolean()`

```php
$active =
    $request->boolean('active');
```

## `array()`

```php
$tags =
    $request->array('tags');
```

## `date()`

```php
$date =
    $request->date('birthday');
```

> Untuk input yang tidak sesuai format, helper tertentu dapat melempar exception. Gunakan validasi request jika input berasal dari user.

Contoh:

```php
$name =
    $request->string('name')->trim();
```

**Hafalan:**

```text
string()
integer()
boolean()
array()
date()
```

---

# 25. Filter Request Input

Untuk mengambil input secara terkontrol:

```php
$data =
    $request->only([
        'name',
        'email'
    ]);
```

Untuk menghapus field:

```php
$data =
    $request->except([
        'is_admin'
    ]);
```

Untuk validasi sekaligus mendapatkan data tervalidasi:

```php
$data =
    $request->validate([
        'name' =>
            ['required', 'string', 'max:100'],

        'email' =>
            ['required', 'email'],
    ]);
```

Contoh hasil:

```php
$name = $data['name'];
$email = $data['email'];
```

**Penting:**

```text
only/except
→ memilih input

validate
→ memastikan input memenuhi rule
→ mengembalikan validated data
```

Jangan percaya input user hanya karena field sudah dipilih.

---

# 26. File Storage

Laravel menyediakan filesystem abstraction melalui `Storage`.

```php
use Illuminate\Support\Facades\Storage;
```

Menyimpan:

```php
Storage::put(
    'files/example.txt',
    'Hello Laravel'
);
```

Mengecek:

```php
Storage::exists(
    'files/example.txt'
);
```

Membaca:

```php
$content =
    Storage::get(
        'files/example.txt'
    );
```

Menghapus:

```php
Storage::delete(
    'files/example.txt'
);
```

## Disk

```php
Storage::disk('local');
```

Atau:

```php
Storage::disk('public');
```

**Hafalan:**

```text
Storage
→ API filesystem Laravel

put
→ simpan

get
→ baca

exists
→ cek

delete
→ hapus
```

---

# 27. File Upload

Form HTML:

```blade
<form
    method="POST"
    action="/upload"
    enctype="multipart/form-data"
>
    @csrf

    <input
        type="file"
        name="avatar"
    >

    <button type="submit">
        Upload
    </button>
</form>
```

Controller:

```php
use Illuminate\Http\Request;

public function upload(
    Request $request
) {
    $request->validate([
        'avatar' => [
            'required',
            'image',
            'max:2048'
        ],
    ]);

    $path =
        $request->file('avatar')
            ->store('avatars');

    return $path;
}
```

Menyimpan ke disk tertentu:

```php
$path =
    $request->file('avatar')
        ->store(
            'avatars',
            'public'
        );
```

Cek file:

```php
if ($request->hasFile('avatar')) {
    // ...
}
```

Mengambil original name:

```php
$file =
    $request->file('avatar');

$name =
    $file->getClientOriginalName();
```

> Jangan menggunakan nama file dari client sebagai satu-satunya nama penyimpanan. `store()` menghasilkan nama file yang lebih aman untuk penyimpanan.

**Hafalan:**

```text
hasFile()
→ cek upload

file()
→ ambil UploadedFile

store()
→ simpan file
```

---

# 28. Response

## String response

```php
return 'Hello Laravel';
```

## View response

```php
return view(
    'home'
);
```

## JSON response

```php
return response()->json([
    'name' => 'Budi'
]);
```

## Status code

```php
return response(
    'Created',
    201
);
```

## Header

```php
return response(
    'Hello'
)->header(
    'X-App',
    'Laravel'
);
```

## Download

```php
return response()->download(
    storage_path(
        'app/file.pdf'
    )
);
```

## File response

```php
return response()->file(
    storage_path(
        'app/file.pdf'
    )
);
```

**Hafalan:**

```text
response()
→ HTTP response

response()->json()
→ JSON

response()->download()
→ download

response()->file()
→ tampilkan file
```

---

# 29. Encryption

Laravel menyediakan `Crypt`.

```php
use Illuminate\Support\Facades\Crypt;
```

Encrypt:

```php
$encrypted =
    Crypt::encryptString(
        'rahasia'
    );
```

Decrypt:

```php
$decrypted =
    Crypt::decryptString(
        $encrypted
    );
```

Object/value serializable:

```php
$encrypted =
    Crypt::encrypt(
        $data
    );

$data =
    Crypt::decrypt(
        $encrypted
    );
```

Jika ciphertext tidak valid atau dimanipulasi, proses decrypt dapat melempar exception.

**Hafalan:**

```text
encrypt
→ lindungi data

decrypt
→ kembalikan data
```

Jangan menyimpan password dengan encryption. Password harus di-hash menggunakan password hashing.

---

# 30. Cookie

Membuat cookie pada response:

```php
return response(
    'Hello'
)->cookie(
    'theme',
    'dark',
    60
);
```

Mengambil cookie:

```php
$theme =
    $request->cookie(
        'theme'
    );
```

Facade Cookie:

```php
use Illuminate\Support\Facades\Cookie;

$cookie =
    Cookie::make(
        'theme',
        'dark',
        60
    );

return response(
    'Hello'
)->withCookie($cookie);
```

Menghapus cookie:

```php
return response(
    'Logout'
)->withoutCookie('theme');
```

**Hafalan:**

```text
$request->cookie()
→ baca cookie

response()->cookie()
→ kirim cookie

withoutCookie()
→ hapus cookie
```

---

# 31. Redirect

Redirect sederhana:

```php
return redirect('/users');
```

Redirect back:

```php
return back();
```

Redirect route:

```php
return redirect()->route(
    'users.index'
);
```

Redirect dengan session flash:

```php
return redirect()
    ->route('users.index')
    ->with(
        'success',
        'User berhasil dibuat'
    );
```

Di Blade:

```blade
@if (session('success'))
    <div>
        {{ session('success') }}
    </div>
@endif
```

**Hafalan:**

```text
redirect()
→ pindah URL

back()
→ kembali

redirect()->route()
→ pindah berdasarkan named route
```

---

# 32. Middleware

Middleware adalah lapisan yang memeriksa atau memproses request sebelum/atau sesudah request masuk ke aplikasi.

Alur:

```text
Request
  ↓
Middleware
  ↓
Controller
  ↓
Middleware
  ↓
Response
```

Membuat middleware:

```bash
php artisan make:middleware AdminMiddleware
```

Contoh:

```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(
        Request $request,
        Closure $next
    ): Response {
        if (
            ! $request->user()?->is_admin
        ) {
            abort(403);
        }

        return $next($request);
    }
}
```

Middleware dapat digunakan pada route atau group.

```php
Route::middleware('auth')
    ->group(function () {
        // protected routes
    });
```

**Hafalan:**

```text
Middleware
→ penjaga / filter request
```

---

# 33. Cross Site Request Forgery

CSRF melindungi request state-changing dari forged request yang tidak sah.

Pada form Blade:

```blade
<form
    method="POST"
    action="/users"
>
    @csrf

    <input
        type="text"
        name="name"
    >

    <button>
        Simpan
    </button>
</form>
```

`@csrf` menghasilkan hidden input token.

Secara konsep:

```html
<input
    type="hidden"
    name="_token"
    value="..."
>
```

Untuk AJAX/fetch, token CSRF dapat dikirim sesuai pola aplikasi dan middleware/framework setup.

**Hafalan:**

```text
POST / PUT / PATCH / DELETE
→ pastikan CSRF token untuk web forms
```

Jangan menghapus proteksi CSRF hanya agar form "berfungsi".

---

# 34. Route Group

Route group digunakan untuk berbagi konfigurasi route.

## Prefix

```php
Route::prefix('admin')
    ->group(function () {
        Route::get(
            '/users',
            fn () => 'Users'
        );
    });
```

URL:

```text
/admin/users
```

## Middleware

```php
Route::middleware('auth')
    ->group(function () {
        Route::get(
            '/profile',
            fn () => 'Profile'
        );
    });
```

## Name prefix

```php
Route::name('admin.')
    ->group(function () {
        Route::get(
            '/users',
            fn () => 'Users'
        )->name('users');
    });
```

Nama route:

```text
admin.users
```

## Kombinasi

```php
Route::prefix('admin')
    ->middleware('auth')
    ->name('admin.')
    ->group(function () {

        Route::get(
            '/users',
            fn () => 'Users'
        )->name('users');

    });
```

**Hafalan:**

```text
prefix
→ URL prefix

middleware
→ middleware bersama

name
→ route name prefix

group
→ kelompok route
```

---

# 35. URL Generation

## `url()`

```php
$url =
    url('/users');
```

## `route()`

```php
$url =
    route('users.show', [
        'id' => 10
    ]);
```

## `asset()`

```php
$url =
    asset('css/app.css');
```

## Current URL

```php
$url =
    url()->current();
```

Full URL:

```php
$url =
    url()->full();
```

**Hafalan:**

```text
url()
→ URL path

route()
→ URL berdasarkan named route

asset()
→ URL asset public
```

---

# 36. Session

Laravel menyediakan session API.

## Menyimpan

```php
session([
    'name' => 'Budi'
]);
```

Atau:

```php
session()->put(
    'name',
    'Budi'
);
```

## Mengambil

```php
$name =
    session('name');
```

Default:

```php
$name =
    session(
        'name',
        'Guest'
    );
```

## `has()`

```php
if (session()->has('name')) {
    // ...
}
```

## `forget()`

```php
session()->forget(
    'name'
);
```

## `flush()`

Menghapus seluruh session data:

```php
session()->flush();
```

## Flash

Untuk data sementara sampai request berikutnya:

```php
session()->flash(
    'success',
    'Berhasil'
);
```

**Hafalan:**

```text
put
→ simpan

get / session()
→ ambil

forget
→ hapus key

flash
→ simpan sementara untuk request berikutnya
```

---

# 37. Error Handling

Laravel menangani exception melalui sistem exception handler/framework.

Contoh melempar exception:

```php
throw new RuntimeException(
    'Terjadi kesalahan'
);
```

Menangani:

```php
try {
    // code
} catch (Throwable $e) {
    report($e);

    return response()->json([
        'message' => 'Server error'
    ], 500);
}
```

## `report()`

```php
report($e);
```

Digunakan untuk mengirim exception ke sistem reporting Laravel.

## `render()`

Dalam konteks exception tertentu, Laravel memungkinkan custom rendering response melalui exception configuration atau exception class.

## Debug

Saat local development:

```env
APP_DEBUG=true
```

Production:

```env
APP_DEBUG=false
```

**Sangat penting:**

```text
APP_DEBUG=true
→ jangan digunakan di production
```

Karena debug output dapat membocorkan informasi internal aplikasi.

**Hafalan:**

```text
throw
→ lempar error

try/catch
→ tangani secara lokal

report()
→ laporkan exception

APP_DEBUG
→ detail debugging
```

---

# 38. HTTP Exception

Laravel menyediakan helper `abort()`.

## 404

```php
abort(404);
```

Dengan pesan:

```php
abort(
    404,
    'User tidak ditemukan'
);
```

## 403

```php
abort(403);
```

## Response exception

```php
abort_if(
    !$user->is_admin,
    403
);
```

```php
abort_unless(
    $user->is_active,
    403
);
```

Alternatif menggunakan exception HTTP:

```php
throw new Symfony\Component\HttpKernel\Exception\HttpException(
    403,
    'Forbidden'
);
```

Dalam aplikasi Laravel, helper `abort()` biasanya lebih ringkas.

**Hafalan:**

```text
abort(404)
→ Not Found

abort(403)
→ Forbidden

abort(500)
→ Server Error
```

---

# 39. Maintenance Mode

Mengaktifkan maintenance mode:

```bash
php artisan down
```

Aplikasi akan menampilkan maintenance response.

Mengaktifkan dengan status:

```bash
php artisan down \
    --status=503
```

Pesan:

```bash
php artisan down \
    --render="errors::503"
```

Menentukan secret bypass dapat dilakukan menggunakan opsi maintenance mode yang tersedia pada versi Laravel yang digunakan.

Mematikan:

```bash
php artisan up
```

Cek status:

```bash
php artisan about
```

**Hafalan:**

```text
php artisan down
→ maintenance ON

php artisan up
→ maintenance OFF
```

---

# 40. Mini Project

## CRUD sederhana alur Request → Route → Controller → View

### 1. Buat controller

```bash
php artisan make:controller UserController
```

### 2. Controller

```php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController
{
    public function create()
    {
        return view('users.create');
    }

    public function store(
        Request $request
    ) {
        $data =
            $request->validate([
                'name' => [
                    'required',
                    'string',
                    'max:100'
                ],

                'email' => [
                    'required',
                    'email'
                ],
            ]);

        return redirect()
            ->route('users.create')
            ->with(
                'success',
                'User berhasil diproses'
            );
    }
}
```

### 3. Route

```php
use App\Http\Controllers\UserController;

Route::get(
    '/users/create',
    [UserController::class, 'create']
)->name('users.create');

Route::post(
    '/users',
    [UserController::class, 'store']
)->name('users.store');
```

### 4. View

`resources/views/users/create.blade.php`

```blade
<!DOCTYPE html>
<html>
<head>
    <title>Create User</title>
</head>
<body>

@if (session('success'))
    <p>
        {{ session('success') }}
    </p>
@endif

@if ($errors->any())
    <ul>
        @foreach ($errors->all() as $error)
            <li>{{ $error }}</li>
        @endforeach
    </ul>
@endif

<form
    method="POST"
    action="{{ route('users.store') }}"
>
    @csrf

    <div>
        <label>
            Name
        </label>

        <input
            type="text"
            name="name"
            value="{{ old('name') }}"
        >
    </div>

    <div>
        <label>
            Email
        </label>

        <input
            type="email"
            name="email"
            value="{{ old('email') }}"
        >
    </div>

    <button type="submit">
        Simpan
    </button>
</form>

</body>
</html>
```

### Alur project

```text
GET /users/create
       ↓
UserController@create
       ↓
users.create
       ↓
Form

POST /users
       ↓
CSRF
       ↓
Request Validation
       ↓
UserController@store
       ↓
Redirect
       ↓
Flash Session
```

---

# 41. Tabel Ringkasan

| Materi | API / Syntax | Fungsi |
|---|---|---|
| Project | `composer create-project` | Membuat project |
| Server | `php artisan serve` | Development server |
| Artisan | `php artisan list` | Daftar command |
| Route | `Route::get()` | Route GET |
| Route | `Route::post()` | Route POST |
| Route | `Route::resource()` | Resource routes |
| Route | `route:list` | Melihat route |
| View | `view()` | Render Blade |
| Asset | `asset()` | URL public asset |
| Asset | `@vite()` | Asset Vite |
| Parameter | `{id}` | Route parameter |
| Named Route | `->name()` | Memberi nama route |
| URL | `route()` | Generate URL route |
| Controller | `make:controller` | Membuat controller |
| Request | `Request` | Object request |
| Input | `$request->input()` | Ambil input |
| Input | `$request->only()` | Pilih input |
| Input | `$request->except()` | Kecualikan input |
| Input | `$request->validate()` | Validasi input |
| Type | `$request->string()` | Ambil string |
| Type | `$request->integer()` | Ambil integer |
| Type | `$request->boolean()` | Ambil boolean |
| Upload | `$request->file()` | Ambil file |
| Storage | `Storage::put()` | Simpan file |
| Storage | `Storage::get()` | Baca file |
| Storage | `Storage::delete()` | Hapus file |
| Response | `response()` | HTTP response |
| Response | `response()->json()` | JSON |
| Redirect | `redirect()` | Redirect |
| Redirect | `back()` | Kembali |
| Encryption | `Crypt::encryptString()` | Encrypt string |
| Encryption | `Crypt::decryptString()` | Decrypt string |
| Cookie | `$request->cookie()` | Baca cookie |
| Cookie | `response()->cookie()` | Set cookie |
| Session | `session()` | Akses session |
| Middleware | `make:middleware` | Membuat middleware |
| CSRF | `@csrf` | CSRF token |
| Group | `->group()` | Route group |
| Error | `abort()` | HTTP exception |
| Error | `report()` | Report exception |
| Maintenance | `artisan down` | Maintenance ON |
| Maintenance | `artisan up` | Maintenance OFF |
| Config | `config()` | Ambil config |
| Config | `config:cache` | Cache config |
| Container | `app()` | Resolve service |
| Provider | `ServiceProvider` | Register/bootstrap service |
| Testing | `php artisan test` | Menjalankan test |

---

# 42. Cheat Code Laravel Dasar 10 Detik

> **Route → Controller → Request → Validation → View/Response.**

## Route

```php
Route::get(
    '/users',
    [UserController::class, 'index']
)->name('users.index');
```

## Controller

```php
class UserController
{
    public function index()
    {
        return view(
            'users.index'
        );
    }
}
```

## Request

```php
public function store(
    Request $request
) {
    $data =
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
        ]);
}
```

## View

```php
return view(
    'users.index',
    compact('users')
);
```

## Blade

```blade
{{ $name }}

@if ($condition)
    ...
@endif

@foreach ($users as $user)
    {{ $user->name }}
@endforeach

@csrf
```

## Redirect

```php
return redirect()
    ->route('users.index')
    ->with(
        'success',
        'Berhasil'
    );
```

## JSON

```php
return response()->json([
    'success' => true,
    'data' => $data
]);
```

## Session

```php
session()->put(
    'name',
    'Budi'
);

$name =
    session('name');
```

## Storage

```php
Storage::put(
    'file.txt',
    'Hello'
);

Storage::get(
    'file.txt'
);
```

## Upload

```php
$path =
    $request
        ->file('avatar')
        ->store('avatars');
```

## Middleware

```php
Route::middleware('auth')
    ->group(function () {
        // protected routes
    });
```

## URL

```php
route(
    'users.show',
    ['id' => 10]
);

asset('css/app.css');

url('/users');
```

## Artisan

```bash
php artisan route:list

php artisan make:controller UserController

php artisan make:middleware AuthMiddleware

php artisan test

php artisan config:cache

php artisan down

php artisan up
```

## Security

```text
@csrf
→ CSRF protection

$request->validate()
→ validasi input

{{ $value }}
→ escaped Blade output

Crypt
→ encryption

password_hash()
→ password hashing di PHP

APP_DEBUG=false
→ production
```

---

# 43. Referensi Resmi

- Laravel Documentation  
  https://laravel.com/docs

- Laravel Installation  
  https://laravel.com/docs/installation

- Laravel Structure  
  https://laravel.com/docs/structure

- Laravel Request Lifecycle  
  https://laravel.com/docs/lifecycle

- Laravel Configuration  
  https://laravel.com/docs/configuration

- Laravel Service Container  
  https://laravel.com/docs/container

- Laravel Service Providers  
  https://laravel.com/docs/providers

- Laravel Facades  
  https://laravel.com/docs/facades

- Laravel Routing  
  https://laravel.com/docs/routing

- Laravel Controllers  
  https://laravel.com/docs/controllers

- Laravel Views / Blade  
  https://laravel.com/docs/views

- Laravel Requests  
  https://laravel.com/docs/requests

- Laravel Validation  
  https://laravel.com/docs/validation

- Laravel Filesystem  
  https://laravel.com/docs/filesystem

- Laravel Responses  
  https://laravel.com/docs/responses

- Laravel Encryption  
  https://laravel.com/docs/encryption

- Laravel Cookies  
  https://laravel.com/docs/requests#cookies

- Laravel Redirects  
  https://laravel.com/docs/redirects

- Laravel Middleware  
  https://laravel.com/docs/middleware

- Laravel CSRF Protection  
  https://laravel.com/docs/csrf

- Laravel Session  
  https://laravel.com/docs/session

- Laravel Error Handling  
  https://laravel.com/docs/errors

- Laravel Maintenance Mode  
  https://laravel.com/docs/configuration#maintenance-mode

- Laravel Testing  
  https://laravel.com/docs/testing

---

# Pola Belajar Laravel Dasar

Urutan belajar yang disarankan:

```text
Pengenalan
    ↓
Membuat Project
    ↓
Struktur Project
    ↓
Artisan
    ↓
Request Lifecycle
    ↓
Environment + Configuration
    ↓
Service Container
    ↓
Service Provider
    ↓
Routing
    ↓
View + Blade
    ↓
Controller
    ↓
Request + Input
    ↓
Validation
    ↓
Response
    ↓
Redirect
    ↓
Session + Cookie
    ↓
Middleware + CSRF
    ↓
Storage + Upload
    ↓
Error Handling
    ↓
Testing
    ↓
Maintenance Mode
```

## Mental Model Utama

Saat membuat fitur Laravel, pikirkan:

```text
1. URL-nya apa?
        ↓
2. Route-nya bagaimana?
        ↓
3. Perlu middleware?
        ↓
4. Controller mana?
        ↓
5. Input apa yang diterima?
        ↓
6. Input perlu divalidasi?
        ↓
7. Business logic di mana?
        ↓
8. Response-nya View / JSON / Redirect?
        ↓
9. Perlu Session / Cookie / Storage?
        ↓
10. Perlu Test?
```

> **Kunci belajar Laravel:** jangan menghafalkan semua class dan method. Kuasai alur **Request → Route → Middleware → Controller → Validation → Business Logic → Response**, lalu gunakan dokumentasi Laravel untuk mencari API spesifik yang dibutuhkan.
