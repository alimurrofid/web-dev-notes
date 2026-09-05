---
title: "Angular Routing"
description: "Panduan client-side routing modern dengan Angular Router: Routes, RouterOutlet, RouterLink, Component Input Binding (:id), Nested routes, Lazy loading (loadComponent), Functional Guards (canActivate), dan Mini Project."
order: 2
tags:
  - web-development
  - frontend
  - angular
  - router
  - typescript
  - intermediate
---

# Angular Routing

> **Target:** Pemula yang telah memahami dasar Angular modern (Standalone Components, Signals, Data Binding, dan Dependency Injection), serta ingin menguasai **navigasi multi-halaman berbasis client-side routing menggunakan Angular Router (Current / Stable)**.  
> **Versi:** Angular Current / Stable (Standalone Components, Functional Router Providers, Signals Route Input Binding, dan Functional Route Guards)  
> **Prasyarat:** [[angular-dasar|Angular Dasar]] · [[typescript-dasar|TypeScript Dasar]]  
> Fokus modul pembelajaran ini: **mental model SPA & Client-Side Routing → setup fungsional `provideRouter` & `app.routes.ts` → outlet tampilan `<router-outlet />` → link navigasi `RouterLink` & `RouterLinkActive` → definisi rute & matching strategy → dynamic route params (`:id`) via modern Signal Inputs (`withComponentInputBinding`) → query params & URL fragments → programmatic navigation (`inject(Router)`) → nested & child routes (layout bersarang) → lazy loading Standalone Components (`loadComponent`) → functional route guards (`CanActivateFn`, `CanDeactivateFn`) → ergonomi router (title, events, scroll restoration) → mini project Portal Dashboard & Katalog Multi-Page SPA**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: Konsep SPA, provideRouter, RouterOutlet, RouterLink, Route Definitions, Dynamic Params via Signal Inputs, dan Programmatic Navigation

🟡 Lanjutan
→ pelajari setelah routing dasar nyaman: Nested/Child Layouts, Lazy Loading Standalone, dan Functional Route Guards (Proteksi Autentikasi & Form)

🔴 Advanced / Praktik
→ penting untuk aplikasi siap produksi: Ergonomi Router (Title, Events, Scroll Restoration), Tabel Komparasi, dan Mini Project Terpadu
```

Mental model alur pencocokan rute dan rendering pada Angular Router:

```text
                 1. USER KLIK LINK / UBAH URL
                         (/products/101)
                               │
                               ▼
                 2. ROUTE MATCHING ENGINE
               (Mencocokkan path: 'products/:id')
                               │
                               ▼
                 3. RUN FUNCTIONAL GUARDS
             (authGuard / canActivateFn mengecek izin)
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
              Izin Diberikan               Izin Ditolak
                │                             │
                ▼                             ▼
    4. RESOLVE COMPONENT & INPUTS       Redirect ke /login
     (id: '101' di-bind ke Signal)
                │
                ▼
    5. RENDER KE <router-outlet />
     (Komponen halaman muncul di layar)
```

**Hafalan:**

```text
provideRouter()              → Mendaftarkan router service dan konfigurasi rute di app.config.ts
app.routes.ts                → Tempat mendefinisikan array Routes (aturan pemetaan URL ke Komponen)
<router-outlet />            → Komponen placeholder tempat halaman yang cocok ditampilkan di layar
[routerLink]                 → Direktif navigasi client-side tanpa reload halaman (pengganti href)
routerLinkActive             → Direktif untuk menambahkan class CSS aktif pada menu yang sedang dibuka
withComponentInputBinding()  → Fitur modern yang otomatis memasukkan parameter URL (:id) ke signal input()
loadComponent                → Fungsi pemecah bundle (lazy loading) untuk Standalone Component
CanActivateFn                → Fungsi guard modern untuk memproteksi akses rute berdasarkan kondisi/token
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan SPA & Mental Model Routing di Angular](#bagian-1)
2. [Setup Routing Modern (provideRouter & app.routes.ts)](#bagian-2)
3. [Komponen Inti: RouterOutlet & RouterLink](#bagian-3)
4. [Konfigurasi Routes Dasar, Path Matching & 404 Wildcard](#bagian-4)
5. [Dynamic Route Matching & Parameter URL (:id via Signal Inputs)](#bagian-5)
6. [Query Parameters & URL Fragments](#bagian-6)
7. [Programmatic Navigation (inject(Router) & navigate())](#bagian-7)

### 🟡 Lanjutan

8. [Nested & Child Routes (Layout Bersarang dengan Sub-Outlet)](#bagian-8)
9. [Lazy Loading Standalone Components (loadComponent & Code-Splitting)](#bagian-9)
10. [Functional Route Guards (canActivateFn & Proteksi Autentikasi)](#bagian-10)
11. [Form Leave Protection (canDeactivateFn)](#bagian-11)
12. [Ergonomi Router (Route Title, Router Events & Scroll Restoration)](#bagian-12)

### 🛠️ Praktik & Referensi

13. [Peta Ingatan, Cheat Code 10 Detik & Tabel Komparasi](#bagian-13)
14. [Mini Project: Portal Dashboard & Katalog Multi-Page SPA](#bagian-14)
15. [Urutan Belajar yang Disarankan & Referensi Resmi](#bagian-15)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan SPA & Mental Model Routing di Angular

### Konsep

Dalam website tradisional (*Multi-Page Application*), setiap kali pengguna mengklik tautan (`<a href="...">`), browser mengirimkan permintaan HTTP baru ke server, menghancurkan seluruh memori DOM halaman lama, lalu merender ulang file HTML baru dari server (*full page reload* dengan kedipan layar putih).

Pada **Single Page Application (SPA)** menggunakan **Angular Router**:
- Hanya ada **satu halaman HTML utama** (`index.html`) yang dimuat saat pertama kali aplikasi dibuka.
- Ketika URL di address bar berubah, **Angular Router mencegat event tersebut** secara lokal di browser (*client-side*).
- Router mencari komponen halaman yang sesuai dengan URL, lalu menukarnya di dalam slot penampung **`<router-outlet />`** secara instan tanpa memuat ulang seluruh halaman.

##### Perbandingan Alur Navigasi

```text
Web Tradisional (Full Page Reload):
User Klik Link ──► Request HTML ke Server ──► Server Render ──► Layar Berkedip Putih ──► Halaman Baru

Angular Router SPA (Instant Client Navigation):
User Klik Link ──► Router Cek URL Lokal ──► Tukar Komponen di <router-outlet /> ──► UI Berganti Instan
```

### Best Practice

- Selalu gunakan `[routerLink]` alih-alih `href` pada link navigasi internal aplikasi untuk mencegah *full page reload*.
- Gunakan `href` biasa hanya jika menautkan link ke website eksternal (misal: `https://google.com`).

**Kunci:** Angular Router mengubah URL dan menukar komponen di dalam `<router-outlet />` tanpa reload halaman.

---

<a id="bagian-2"></a>

## 2. 🟢 Setup Routing Modern (provideRouter & app.routes.ts)

### Konsep

Pada Angular modern berbasis Standalone Components, routing dikonfigurasi secara fungsional tanpa memerlukan `RouterModule.forRoot()`.

Arsitektur setup routing modern terdiri dari 2 file utama:
1. **`src/app/app.routes.ts`**: Array bertipe `Routes` yang mendefinisikan daftar aturan URL ke Komponen.
2. **`src/app/app.config.ts`**: Mendaftarkan fungsi `provideRouter(routes, ...fiturTambahan)` ke dalam providers global aplikasi.

##### Diagram Alur Registrasi Router

```text
app.routes.ts (Array Routes: path ──► component)
      │
      ▼
app.config.ts (provideRouter(routes, withComponentInputBinding()))
      │
      ▼
main.ts (bootstrapApplication(AppComponent, appConfig))
```

### Contoh Konfigurasi

1. **Definisi Rute (`src/app/app.routes.ts`)**:

```typescript
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { AboutComponent } from './pages/about.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent }
];
```

2. **Pendaftaran di Config Global (`src/app/app.config.ts`)**:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Mengaktifkan router dan binding parameter URL langsung ke Signal Input
    provideRouter(routes, withComponentInputBinding())
  ]
};
```

3. **Entry Point (`src/main.ts`)**:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

### Kesalahan Umum

❌ Mengimpor `RouterModule.forRoot()` di komponen Standalone modern.  
Alasannya: `RouterModule.forRoot` adalah pola NgModule legacy. Pada Angular modern, konfigurasi dilakukan di `app.config.ts` via `provideRouter()`.

✅ Gunakan `provideRouter(routes)` di dalam `app.config.ts`.

**Kunci:** `provideRouter(routes)` adalah cara standar modern untuk mengaktifkan routing pada aplikasi Angular Standalone.

---

<a id="bagian-3"></a>

## 3. 🟢 Komponen Inti: RouterOutlet & RouterLink

### Konsep

Untuk menampilkan halaman dan berpindah antar-rute, Angular Router menyediakan dua direktif utama:

1. **`<router-outlet />`**:
   - Komponen placeholder (wadah dinamis).
   - Menandai lokasi di mana Angular harus merender komponen halaman yang aktif sesuai URL browser saat ini.
2. **`routerLink` & `routerLinkActive`**:
   - `routerLink`: Menghubungkan elemen HTML (`<a>`, `<button>`) ke rute tujuan tanpa memicu reload browser.
   - `routerLinkActive`: Menambahkan satu atau lebih class CSS (misal: `active`) secara otomatis saat rute URL tersebut sedang dibuka.
   - `[routerLinkActiveOptions]="{ exact: true }"`: Memastikan class aktif hanya terpasang jika URL benar-benar cocok persis (*exact match*), sangat penting untuk rute beranda `/`.

### Contoh

1. **Komponen Halaman Beranda (`src/app/pages/home.component.ts`)**:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `<h2>🏠 Halaman Utama</h2><p>Selamat datang di portal kami!</p>`
})
export class HomeComponent {}
```

2. **Komponen Halaman Tentang (`src/app/pages/about.component.ts`)**:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `<h2>ℹ️ Tentang Kami</h2><p>Aplikasi ini dibuat dengan Angular Modern.</p>`
})
export class AboutComponent {}
```

3. **Root Layout (`src/app/app.component.ts`)**:

```typescript
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  // Wajib impor RouterOutlet, RouterLink, dan RouterLinkActive
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="navbar">
      <h1 class="logo">MyPortal</h1>
      <nav class="nav-links">
        <!-- exact: true mencegah '/' selalu aktif di semua sub-halaman -->
        <a 
          routerLink="/" 
          routerLinkActive="active-tab" 
          [routerLinkActiveOptions]="{ exact: true }">
          Beranda
        </a>
        <a 
          routerLink="/about" 
          routerLinkActive="active-tab">
          Tentang Kami
        </a>
      </nav>
    </header>

    <main class="content-container">
      <!-- Di sinilah komponen HomeComponent atau AboutComponent akan dirender -->
      <router-outlet />
    </main>
  `,
  styles: `
    .navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: #1e293b; color: white; }
    .logo { margin: 0; font-size: 1.25rem; }
    .nav-links a { color: #94a3b8; text-decoration: none; margin-left: 1.5rem; padding: 0.4rem 0.8rem; border-radius: 4px; }
    .nav-links a.active-tab { color: #ffffff; background: #3b82f6; font-weight: bold; }
    .content-container { padding: 2rem; max-width: 800px; margin: 0 auto; }
  `
})
export class AppComponent {}
```

### Hasil

**Kondisi awal di URL `/`:**
```text
┌────────────────────────────────────────────────────────┐
│ MyPortal                    [ Beranda (Active) ] [ Tentang Kami ] │
├────────────────────────────────────────────────────────┤
│ 🏠 Halaman Utama                                       │
│ Selamat datang di portal kami!                         │
└────────────────────────────────────────────────────────┘
```

**Setelah mengklik menu "Tentang Kami" (URL menjadi `/about` tanpa reload):**
```text
┌────────────────────────────────────────────────────────┐
│ MyPortal                    [ Beranda ] [ Tentang Kami (Active) ] │
├────────────────────────────────────────────────────────┤
│ ℹ️ Tentang Kami                                        │
│ Aplikasi ini dibuat dengan Angular Modern.             │
└────────────────────────────────────────────────────────┘
```

### Kesalahan Umum

❌ Menggunakan `<a href="/about">` untuk link internal aplikasi.  
Alasannya: Browser akan melakukan refresh penuh dan menghapus seluruh state memory di browser.

✅ Gunakan `<a routerLink="/about">`.

**Kunci:** `<router-outlet />` adalah slot penampung tampilan, dan `routerLink` adalah direktif navigasi instan tanpa refresh.

---

<a id="bagian-4"></a>

## 4. 🟢 Konfigurasi Routes Dasar, Path Matching & 404 Wildcard

### Konsep

Array `Routes` adalah daftar konfigurasi pemetaan antara path URL dengan komponen yang harus dimuat.

##### Aturan Utama Pendefinisian Path:
1. **Tanpa Garis Miring di Awal**: Tulis `path: 'about'`, bukan `path: '/about'`.
2. **Rute Beranda (`path: ''`)**: Mewakili root domain `/`.
3. **Redirect (`redirectTo`)**: Mengarahkan URL tertentu ke URL lain (wajib menyertakan `pathMatch: 'full'`).
4. **Wildcard 404 (`path: '**'`)**: Menangkap semua URL yang tidak terdaftar. **Wajib diletakkan di posisi paling akhir array**, karena router mengevaluasi rute dari urutan atas ke bawah (*first match wins*).

##### Perbedaan `pathMatch: 'full'` vs `pathMatch: 'prefix'`
- `'prefix'` (default): Rute cocok jika awal URL mengandung path tersebut (misal `path: ''` dengan `'prefix'` akan mencocokkan *semua* URL karena semua string diawali dengan string kosong).
- `'full'`: Rute hanya cocok jika keseluruhan URL identik 100% dengan path.

### Contoh

```typescript
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { AboutComponent } from './pages/about.component';
import { NotFoundComponent } from './pages/not-found.component';

export const routes: Routes = [
  // 1. Rute Beranda
  { path: '', component: HomeComponent },

  // 2. Rute Statis Biasa
  { path: 'about', component: AboutComponent },

  // 3. Rute Redirect (misal alias 'tentang' diarahkan ke 'about')
  { path: 'tentang', redirectTo: 'about', pathMatch: 'full' },

  // 4. Wildcard Catch-All 404 (Wajib di urutan paling bawah!)
  { path: '**', component: NotFoundComponent }
];
```

Komponen 404 (`src/app/pages/not-found.component.ts`):

```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-box">
      <h2>404 - Halaman Tidak Ditemukan</h2>
      <p>Maaf, alamat URL yang Anda cari tidak tersedia.</p>
      <a routerLink="/" class="back-btn">⬅ Kembali ke Beranda</a>
    </div>
  `,
  styles: `
    .not-found-box { text-align: center; padding: 3rem 1rem; }
    .back-btn { display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; }
  `
})
export class NotFoundComponent {}
```

### Hasil

**Ketika pengguna mengetik URL yang tidak terdaftar (`/halaman-ngawur`):**

```text
┌────────────────────────────────────────────────────────┐
│ 404 - Halaman Tidak Ditemukan                          │
│ Maaf, alamat URL yang Anda cari tidak tersedia.        │
│ [ ⬅ Kembali ke Beranda ]                               │
└────────────────────────────────────────────────────────┘
```

### Kesalahan Umum

❌ Meletakkan rute wildcard `{ path: '**' }` di urutan awal atau tengah array `routes`.  
Alasannya: Karena router mencocokkan rute dari atas ke bawah, rute apa pun di bawah `**` tidak akan pernah bisa diakses.

✅ Letakkan `{ path: '**' }` selalu pada elemen **paling terakhir** di array `routes`.

**Kunci:** Router mengevaluasi rute dari atas ke bawah; gunakan `pathMatch: 'full'` pada redirect dan letakkan wildcard `**` di baris terakhir.

---

<a id="bagian-5"></a>

## 5. 🟢 Dynamic Route Matching & Parameter URL (:id via Signal Inputs)

### Konsep

Banyak halaman web membutuhkan parameter dinamis pada URL, seperti menampilkan detail produk `/products/101` atau profil pengguna `/users/alimur`.

Pada Angular Router, parameter dinamis ditandai dengan tanda titik dua (`:namaParam`).

##### Pendekatan Modern: `withComponentInputBinding()`
Dahulu, untuk mengambil parameter URL kita harus menyuntikkan service `ActivatedRoute` dan melakukan langganan (*subscribe*) Observable yang panjang.

Pada Angular modern (Current/Stable), parameter URL dapat **otomatis di-bind langsung ke Signal Input komponen** menggunakan fungsi `input()` atau `input.required()`.

##### Syarat Mengaktifkan Signal Input Route Binding:
1. Daftarkan `withComponentInputBinding()` pada `provideRouter()` di `app.config.ts`.
2. Buat properti `input<string>()` pada komponen dengan **nama variabel yang sama persis** dengan nama parameter di route (`:id` $\rightarrow$ `id = input<string>()`).

### Contoh

1. **Definisi Rute (`src/app/app.routes.ts`)**:

```typescript
import { Routes } from '@angular/router';
import { ProductListComponent } from './pages/product-list.component';
import { ProductDetailComponent } from './pages/product-detail.component';

export const routes: Routes = [
  { path: 'products', component: ProductListComponent },
  // Parameter dinamis :id
  { path: 'products/:id', component: ProductDetailComponent }
];
```

2. **Komponen Detail Produk (`src/app/pages/product-detail.component.ts`)**:

```typescript
import { Component, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="detail-card">
      <a routerLink="/products" class="back-link">← Kembali ke Daftar Produk</a>
      
      <!-- id() adalah Signal yang otomatis diisi nilai parameter URL -->
      <h2>📦 Detail Produk ID: {{ id() }}</h2>
      <p>Kategori: <strong>{{ categoryInfo() }}</strong></p>
    </div>
  `,
  styles: `
    .detail-card { padding: 1.5rem; border: 1px solid #cbd5e1; border-radius: 8px; max-width: 500px; }
    .back-link { display: inline-block; margin-bottom: 1rem; color: #3b82f6; text-decoration: none; }
  `
})
export class ProductDetailComponent {
  // Otomatis terikat dengan parameter :id dari URL
  id = input.required<string>();

  // Derived state menggunakan computed signal dari id URL
  categoryInfo = computed(() => {
    return Number(this.id()) > 100 ? 'Elektronik & Gadget' : 'Aksesoris';
  });
}
```

3. **Komponen Daftar Produk (`src/app/pages/product-list.component.ts`)**:

```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>Katalog Produk</h2>
    <ul>
      <li>
        <a [routerLink]="['/products', 101]">Monitor Gaming 144Hz (ID: 101)</a>
      </li>
      <li>
        <a [routerLink]="['/products', 102]">Keyboard TKL Mechanical (ID: 102)</a>
      </li>
      <li>
        <a [routerLink]="['/products', 45]">Mousepad Deskmat (ID: 45)</a>
      </li>
    </ul>
  `
})
export class ProductListComponent {}
```

### Hasil

**Ketika pengguna mengklik "Monitor Gaming 144Hz (ID: 101)" (URL: `/products/101`):**

```text
┌────────────────────────────────────────────────────────┐
│ ← Kembali ke Daftar Produk                             │
│ 📦 Detail Produk ID: 101                               │
│ Kategori: Elektronik & Gadget                          │
└────────────────────────────────────────────────────────┘
```

### Pendekatan Alternatif: `ActivatedRoute` (Jika Diperlukan)

Jika Anda perlu membaca snapshot rute di luar komponen (misal di Service utilitas), Anda dapat menyuntikkan `ActivatedRoute`:

```typescript
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export class OldDetailComponent {
  private route = inject(ActivatedRoute);

  // Mengambil nilai saat inisialisasi awal (Snapshot)
  productId = this.route.snapshot.paramMap.get('id');
}
```

**Kunci:** Gunakan `withComponentInputBinding()` dan `input.required<string>()` sebagai standar modern utama untuk menangkap parameter URL.

---

<a id="bagian-6"></a>

## 6. 🟢 Query Parameters & URL Fragments

### Konsep

Selain parameter path (`/products/101`), URL sering membawa data tambahan berupa:
1. **Query Parameters (`?key=value`)**: Digunakan untuk filtering, sorting, atau pagination (misal `/products?category=laptop&sort=asc`).
2. **Fragment / Hash (`#section-id`)**: Digunakan untuk melompat (*scroll anchor*) ke bagian tertentu di halaman (misal `/about#contact`).

##### Mengirim Query Params & Fragment di Template:
- `[queryParams]="{ key: 'value' }"`
- `[fragment]="'section-name'"`
- `queryParamsHandling`: Mengatur perilaku saat navigasi baru:
  - `'merge'`: Menggabungkan query params baru dengan query params lama.
  - `'preserve'`: Mempertahankan query params lama tanpa perubahan.

##### Membaca Query Params:
Jika `withComponentInputBinding()` aktif, nama query param juga **otomatis masuk ke `input()`** yang bernama sama!

### Contoh

1. **Komponen Pengirim Query Params (`src/app/pages/shop.component.ts`)**:

```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h3>Pencarian & Filter Toko</h3>
    <div class="filters">
      <!-- Mengirim Query Params via RouterLink -->
      <a 
        [routerLink]="['/shop/search']" 
        [queryParams]="{ q: 'keyboard', sort: 'price_asc' }"
        [fragment]="'hasil-pencarian'">
        Cari Keyboard (Termurah)
      </a>

      <a 
        [routerLink]="['/shop/search']" 
        [queryParams]="{ q: 'monitor', sort: 'rating' }">
        Cari Monitor (Rating Terbaik)
      </a>
    </div>
  `,
  styles: `
    .filters a { display: inline-block; margin-right: 1rem; padding: 0.5rem 1rem; background: #e0f2fe; color: #0369a1; text-decoration: none; border-radius: 4px; }
  `
})
export class ShopComponent {}
```

2. **Komponen Penerima Query Params (`src/app/pages/search-result.component.ts`)**:

```typescript
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-search-result',
  standalone: true,
  template: `
    <div class="result-box" id="hasil-pencarian">
      <h3>Hasil Pencarian</h3>
      <p>Kata Kunci: <strong>{{ q() || 'Semua' }}</strong></p>
      <p>Urutan (Sort): <strong>{{ sort() || 'Default' }}</strong></p>
    </div>
  `,
  styles: `
    .result-box { padding: 1.25rem; border: 1px solid #cbd5e1; border-radius: 8px; max-width: 400px; }
  `
})
export class SearchResultComponent {
  // Query param ?q=... dan ?sort=... otomatis terikat ke input signal ini
  q = input<string>('');
  sort = input<string>('');
}
```

### Hasil

**Ketika pengguna mengklik "Cari Keyboard (Termurah)" (URL: `/shop/search?q=keyboard&sort=price_asc#hasil-pencarian`):**

```text
┌────────────────────────────────────────────────────────┐
│ Hasil Pencarian                                        │
│ Kata Kunci: keyboard                                   │
│ Urutan (Sort): price_asc                               │
└────────────────────────────────────────────────────────┘
```

**Kunci:** `[queryParams]` mengirim query string di template dan otomatis dibaca oleh `input()` bertipe sama dengan opsi `withComponentInputBinding()`.

---

<a id="bagian-7"></a>

## 7. 🟢 Programmatic Navigation (inject(Router) & navigate())

### Konsep

Tidak semua perpindahan halaman dipicu oleh klik tautan `<a>`. Sering kali navigasi harus dijalankan lewat kode TypeScript setelah aksi tertentu selesai (misal: setelah tombol checkout ditekan, form login valid, atau timer selesai).

Untuk melakukan navigasi dari TypeScript, kita menggunakan service **`Router`** melalui fungsi **`inject(Router)`**.

##### Dua Method Navigasi Utama:
1. **`router.navigate(['/path', paramValue], extras)`**:
   - Menerima array segmen URL dan objek konfigurasi opsional (`queryParams`, `fragment`).
   - Pendekatan yang paling fleksibel dan direkomendasikan.
2. **`router.navigateByUrl('/full-path?q=1')`**:
   - Menerima string URL lengkap secara langsung.

### Contoh

```typescript
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  template: `
    <div class="checkout-card">
      <h3>Pembayaran Pesanan</h3>
      <p>Total Tagihan: <strong>Rp 350.000</strong></p>

      <button (click)="bayarSekarang()" [disabled]="isProcessing()">
        {{ isProcessing() ? 'Memproses Transaksi...' : 'Bayar Sekarang' }}
      </button>
    </div>
  `,
  styles: `
    .checkout-card { padding: 1.5rem; border: 1px solid #cbd5e1; border-radius: 8px; max-width: 360px; }
    button { width: 100%; padding: 0.6rem; background: #16a34a; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; }
    button:disabled { background: #94a3b8; cursor: not-allowed; }
  `
})
export class CheckoutComponent {
  // Mengambil Router Service via Dependency Injection modern
  private router = inject(Router);
  isProcessing = signal(false);

  bayarSekarang() {
    this.isProcessing.set(true);

    // Simulasi proses transaksi backend 1.5 detik
    setTimeout(() => {
      this.isProcessing.set(false);
      
      // Navigasi programatik ke halaman sukses dengan membawa ID transaksi
      const invoiceId = 'INV-' + Math.floor(1000 + Math.random() * 9000);
      
      this.router.navigate(['/order-success', invoiceId], {
        queryParams: { status: 'paid' }
      });
    }, 1500);
  }
}
```

### Hasil

**Setelah transaksi selesai diproses:**
- Browser otomatis berpindah ke URL: `/order-success/INV-7412?status=paid` tanpa reload halaman.

### Best Practice

- Gunakan `this.router.navigate(['/segmen', param])` untuk membangun path dinamis yang bersih.
- Hindari penggabungan string manual (*string concatenation*) yang rentan salah sintaks garis miring.

**Kunci:** Gunakan `inject(Router)` dan method `.navigate(['/path'])` untuk memicu navigasi dari logika TypeScript.

---

<a id="bagian-8"></a>

## 8. 🟡 Nested & Child Routes (Layout Bersarang dengan Sub-Outlet)

### Konsep

Aplikasi modern sering memiliki bagian yang mempertahankan tata letak (*layout*) induk yang sama (seperti bilah navigasi samping / sidebar), sementara konten di sebelah kanannya berganti-ganti. Contohnya: Dashboard Admin (`/admin/overview`, `/admin/users`, `/admin/settings`).

Angular Router mendukung ini melalui konfigurasi **`children: [...]`** (*Nested Routes*).

##### Cara Kerja:
1. Rute induk memiliki komponen layout sendiri yang berisi tag **`<router-outlet />` kedua (sub-outlet)**.
2. Setiap kali sub-rute anak dibuka, konten anak akan dirender ke dalam `<router-outlet />` milik induknya, tanpa merender ulang sidebar atau navbar induk.

##### Diagram Struktur Outlet Bertingkat

```text
AppComponent (Root Layout)
  └── <router-outlet />  ──► Merender AdminLayoutComponent
                                ├── Sidebar Navigasi Admin
                                └── <router-outlet /> (Sub-Outlet)
                                      ├── /admin/overview  ──► OverviewComponent
                                      └── /admin/settings  ──► SettingsComponent
```

### Contoh

1. **Definisi Rute Bersarang (`src/app/app.routes.ts`)**:

```typescript
import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin/admin-layout.component';
import { AdminOverviewComponent } from './admin/admin-overview.component';
import { AdminSettingsComponent } from './admin/admin-settings.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent, // Komponen Pembungkus Layout
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' }, // Default child
      { path: 'overview', component: AdminOverviewComponent },
      { path: 'settings', component: AdminSettingsComponent }
    ]
  }
];
```

2. **Komponen Layout Induk (`src/app/admin/admin-layout.component.ts`)**:

```typescript
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-wrapper">
      <aside class="sidebar">
        <h4>Panel Admin</h4>
        <nav>
          <a routerLink="overview" routerLinkActive="active-side">📊 Ringkasan</a>
          <a routerLink="settings" routerLinkActive="active-side">⚙️ Pengaturan</a>
        </nav>
      </aside>

      <section class="admin-main">
        <!-- Sub-Outlet tempat halaman anak muncul -->
        <router-outlet />
      </section>
    </div>
  `,
  styles: `
    .admin-wrapper { display: flex; border: 1px solid #cbd5e1; border-radius: 8px; min-height: 250px; }
    .sidebar { width: 180px; background: #f8fafc; padding: 1rem; border-right: 1px solid #cbd5e1; }
    .sidebar nav a { display: block; padding: 0.5rem; color: #334155; text-decoration: none; margin-bottom: 0.25rem; border-radius: 4px; }
    .sidebar nav a.active-side { background: #3b82f6; color: white; font-weight: bold; }
    .admin-main { flex: 1; padding: 1.5rem; }
  `
})
export class AdminLayoutComponent {}
```

3. **Komponen Anak (`src/app/admin/admin-overview.component.ts`)**:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  template: `<h3>Statistik Kunjungan</h3><p>Total Pengguna Aktif: <strong>1.420 orang</strong></p>`
})
export class AdminOverviewComponent {}
```

### Hasil

**Saat membuka `/admin/overview`:**
- Sidebar tetap diam di posisinya, dan konten `AdminOverviewComponent` terisi di `<router-outlet />` sebelah kanan.

**Kunci:** `children: [...]` memetakan sub-rute ke dalam `<router-outlet />` internal milik komponen induk.

---

<a id="bagian-9"></a>

## 9. 🟡 Lazy Loading Standalone Components (loadComponent & Code-Splitting)

### Konsep

Ketika aplikasi membesar dengan puluhan halaman, mengimpor seluruh komponen di awal (*eager loading*) akan membuat ukuran file download pertama (`main.js`) membengkak, sehingga aplikasi terasa lambat saat pertama kali dibuka.

**Lazy Loading** adalah teknik untuk memecah bundle JavaScript (*code-splitting*). Komponen halaman hanya akan diunduh dari server jaringan **ketika pengguna benar-benar menavigasi ke rute tersebut**.

##### Fungsi `loadComponent` Modern
Pada komponen Standalone, lazy loading ditulis dengan fungsi import dinamis JavaScript:
`loadComponent: () => import('./path').then(m => m.NamaComponent)`

##### Perbandingan Ukuran Bundle

```text
Tanpa Lazy Loading (Eager):
Download Sekaligus: [ Home + Dashboard + Admin + Reports + Settings ] ──► 2.5 MB (Lambat)

Dengan Lazy Loading:
Download Awal:      [ Home Page Saja ] ──► 250 KB (Sangat Cepat ⚡)
Saat Klik Admin:    [ Unduh chunk-admin.js ] ──► 150 KB (Diunduh on-demand)
```

### Contoh

```typescript
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';

export const routes: Routes = [
  // 1. Eager Loading (Halaman beranda dimuat langsung)
  { path: '', component: HomeComponent },

  // 2. Lazy Loading Standalone Component via loadComponent
  { 
    path: 'reports', 
    loadComponent: () => import('./pages/reports.component').then(m => m.ReportsComponent)
  },

  // 3. Lazy Loading Sekelompok Sub-Rute via loadChildren
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
  }
];
```

### Hasil di Network Browser Tab

Ketika pengguna pertama kali mengklik menu `/reports`, tab Network browser akan mencatat pengunduhan file baru (misal: `chunk-7H9X2.js`) secara asynchronous.

### Best Practice

- Gunakan `loadComponent` untuk seluruh halaman non-beranda di aplikasi produksi agar waktu muat awal (*First Contentful Paint*) sangat cepat.

**Kunci:** `loadComponent: () => import(...)` membagi bundle aplikasi menjadi pecahan kecil yang diunduh sesuai kebutuhan.

---

<a id="bagian-10"></a>

## 10. 🟡 Functional Route Guards (canActivateFn & Proteksi Autentikasi)

### Konsep

**Route Guards** adalah mekanisme pertahanan rute untuk mengontrol apakah pengguna diizinkan membuka rute tertentu atau tidak (misal: memeriksa apakah user sudah login sebelum membuka `/dashboard`).

##### Mengapa Functional Guards?
- **Dahulu (Legacy Class Guards)**: Wajib membuat class baru dengan dekorator `@Injectable()` yang mengimplementasikan antarmuka `CanActivate`. Terlalu banyak *boilerplate*.
- **Sekarang (Functional Guards `CanActivateFn`)**: Berupa fungsi TypeScript murni yang ringkas dan langsung dapat menggunakan `inject()` di dalam tubuh fungsinya.

##### Nilai Kembalian Guard:
Fungsi guard dapat mengembalikan:
1. `true`: Izin diberikan, navigasi dilanjutkan.
2. `false`: Navigasi dibatalkan.
3. `UrlTree` / `RedirectCommand`: Mengalihkan rute otomatis (misal: lempar ke `/login`).

##### Diagram Alur Proteksi Auth Guard

```text
Pengguna Akses /admin
          │
          ▼
authGuard(route, state)
          │
   Sudah Login?
   ├── YA  ──► return true ──► Masuk ke /admin
   └── TDK ──► return router.parseUrl('/login') ──► Dilempar ke /login
```

### Contoh

1. **Service Otentikasi Sederhana (`src/app/services/auth.service.ts`)**:

```typescript
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Status login disimpan dalam Writable Signal
  isLoggedIn = signal(false);

  login() {
    this.isLoggedIn.set(true);
  }

  logout() {
    this.isLoggedIn.set(false);
  }
}
```

2. **Functional Guard (`src/app/guards/auth.guard.ts`)**:

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // Pengguna diizinkan masuk
  }

  // Jika belum login, alihkan ke halaman login dengan menyertakan returnUrl
  return router.parseUrl('/login');
};
```

3. **Pemasangan Guard di Rute (`src/app/app.routes.ts`)**:

```typescript
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { LoginComponent } from './pages/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin', 
    loadComponent: () => import('./pages/admin.component').then(m => m.AdminComponent),
    // Pasang guard pada array canActivate
    canActivate: [authGuard] 
  }
];
```

### Hasil

**Ketika pengguna yang belum login mencoba mengetik URL `/admin` di address bar:**
- Guard menolak akses dan browser seketika berpindah ke tampilan halaman `/login`.

**Kunci:** `CanActivateFn` adalah fungsi murni yang memeriksa status otentikasi dan mengembalikan `true` atau redirect `UrlTree`.

---

<a id="bagian-11"></a>

## 11. 🟡 Form Leave Protection (canDeactivateFn)

### Konsep

Pernahkah Anda sedang mengisi formulir panjang, lalu tidak sengaja mengklik tombol menu lain dan seluruh data yang Anda ketik hilang begitu saja?

**`canDeactivateFn`** adalah guard yang berjalan saat pengguna **ingin meninggalkan rute saat ini**. Guard ini memberi kesempatan kepada komponen untuk menampilkan dialog konfirmasi (*"Data belum tersimpan, yakin ingin keluar?"*).

### Contoh

1. **Antarmuka Komponen yang Memiliki Form (`src/app/guards/pending-changes.guard.ts`)**:

```typescript
import { CanDeactivateFn } from '@angular/router';

// Kontrak antarmuka komponen yang dapat diperiksa oleh guard
export interface CanComponentDeactivate {
  hasUnsavedChanges: () => boolean;
}

export const pendingChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  // Jika ada perubahan belum tersimpan, mintalah konfirmasi user
  if (component.hasUnsavedChanges && component.hasUnsavedChanges()) {
    return confirm('⚠️ Anda memiliki perubahan data yang belum tersimpan. Yakin ingin meninggalkan halaman?');
  }
  return true;
};
```

2. **Komponen Form yang Mengimplementasikan Pemeriksaan (`src/app/pages/edit-profile.component.ts`)**:

```typescript
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CanComponentDeactivate } from '../guards/pending-changes.guard';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="edit-card">
      <h3>Edit Profil</h3>
      <input type="text" [(ngModel)]="username" placeholder="Nama pengguna..." />
      <button (click)="save()">Simpan</button>
    </div>
  `
})
export class EditProfileComponent implements CanComponentDeactivate {
  username = 'Budi';
  isSaved = signal(true);

  // Jika username diubah dan belum disimpan
  hasUnsavedChanges(): boolean {
    return !this.isSaved();
  }

  save() {
    this.isSaved.set(true);
    alert('Data tersimpan!');
  }
}
```

3. **Pendaftaran di Rute (`src/app/app.routes.ts`)**:

```typescript
import { Routes } from '@angular/router';
import { EditProfileComponent } from './pages/edit-profile.component';
import { pendingChangesGuard } from './guards/pending-changes.guard';

export const routes: Routes = [
  { 
    path: 'edit-profile', 
    component: EditProfileComponent,
    canDeactivate: [pendingChangesGuard]
  }
];
```

### Hasil

Ketika pengguna mengubah teks form lalu mengklik link menu lain tanpa menekan tombol "Simpan", browser akan menampilkan dialog browser:  
`[ OK ]` $\rightarrow$ Navigasi dilanjutkan,  
`[ Cancel ]` $\rightarrow$ Pengguna tetap berada di halaman form.

**Kunci:** `canDeactivateFn` melindungi pengguna dari kehilangan data form yang belum tersimpan saat bernavigasi keluar.

---

<a id="bagian-12"></a>

## 12. 🟡 Ergonomi Router (Route Title, Router Events & Scroll Restoration)

### Konsep

Untuk memberikan pengalaman pengguna (*User Experience*) yang mulus dan profesional, Angular Router menyediakan beberapa fitur ergonomis:

1. **Route Title**: Mengubah judul tab browser secara otomatis setiap kali berpindah halaman.
2. **Scroll Position Restoration (`withInMemoryScrolling`)**: Mengembalikan posisi scroll ke bagian atas halaman secara otomatis saat berpindah rute (seperti perilaku website normal).
3. **Router Events**: Memantau momen transisi rute untuk menampilkan indikator loading.

##### Setup Fitur Ergonomi di `app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      // Otomatis scroll ke atas setiap kali rute berganti
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })
    )
  ]
};
```

### Contoh Route Title Statis & Dinamis

```typescript
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { ProductDetailComponent } from './pages/product-detail.component';

export const routes: Routes = [
  // 1. Judul Statis
  { 
    path: '', 
    title: 'MyPortal - Beranda', 
    component: HomeComponent 
  },
  
  // 2. Judul Dinamis menggunakan fungsi penentu (ResolveFn)
  { 
    path: 'products/:id', 
    title: (route) => `Detail Produk #${route.paramMap.get('id')} - MyPortal`,
    component: ProductDetailComponent 
  }
];
```

### Contoh Indikator Loading Transisi Rute

```typescript
import { Component, inject, signal } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    @if (isLoading()) {
      <div class="top-loading-bar"></div>
    }
    <router-outlet />
  `,
  styles: `
    .top-loading-bar { position: fixed; top: 0; left: 0; width: 100%; height: 3px; background: #3b82f6; animation: loadingAnim 1s infinite linear; }
    @keyframes loadingAnim { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }
  `
})
export class AppComponent {
  private router = inject(Router);
  isLoading = signal(false);

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isLoading.set(false);
      }
    });
  }
}
```

**Kunci:** `title`, `withInMemoryScrolling()`, dan `router.events` menyempurnakan kenyamanan visual dan navigasi pengguna.

---

<a id="bagian-13"></a>

## 13. 🛠️ Peta Ingatan, Cheat Code 10 Detik & Tabel Komparasi

### Peta Ingatan Konsep Angular Router

```text
Angular Router Modern
├── Konfigurasi & Inisialisasi
│   ├── provideRouter(routes) di app.config.ts
│   ├── withComponentInputBinding() (Auto Input Signal :id)
│   └── withInMemoryScrolling({ scrollPositionRestoration: 'top' })
├── Komponen Antarmuka
│   ├── <router-outlet /> (Slot tampilan halaman)
│   ├── [routerLink] (Navigasi tanpa reload)
│   └── routerLinkActive (Active class state)
├── Struktur Rute
│   ├── Static: path: 'about'
│   ├── Dynamic: path: 'items/:id'
│   ├── Redirect: redirectTo + pathMatch: 'full'
│   ├── 404 Wildcard: path: '**' (Urutan paling akhir)
│   └── Nested: children: [...] (Layout bersarang)
├── Performa & Proteksi
│   ├── Lazy Loading: loadComponent: () => import(...)
│   ├── CanActivateFn (Proteksi akses masuk)
│   └── CanDeactivateFn (Proteksi form belum simpan)
└── Navigasi Programatik
    └── inject(Router).navigate(['/path', id])
```

### Tabel Komparasi Sintaks Router: Angular vs Vue vs React

| Fitur / Konsep | Angular Router (Modern) | Vue Router 4 | React Router 6 / 7 |
|---|---|---|---|
| **Konfigurasi Provider** | `provideRouter(routes)` | `createRouter({ routes, history })` | `<RouterProvider router={router} />` |
| **Wadah Tampilan** | `<router-outlet />` | `<RouterView />` | `<Outlet />` |
| **Link Navigasi** | `<a routerLink="/about">` | `<RouterLink to="/about">` | `<Link to="/about">` |
| **Styling Link Aktif** | `routerLinkActive="active"` | `active-class="active"` | `className={({isActive}) => ...}` |
| **Ambil Param `:id`** | `id = input.required<string>()` | `const route = useRoute(); route.params.id` | `const { id } = useParams()` |
| **Navigasi Kode (TS)** | `inject(Router).navigate(['/url'])` | `useRouter().push('/url')` | `const navigate = useNavigate(); navigate('/url')` |
| **Lazy Loading** | `loadComponent: () => import(...)` | `component: () => import(...)` | `lazy: () => import(...)` |
| **Proteksi Rute** | `canActivate: [authGuard]` | `router.beforeEach((to, from) => ...)` | Custom Wrapper Component `<ProtectedRoute>` |
| **Rute Tidak Ditemukan** | `{ path: '**', component: NotFound }` | `{ path: '/:pathMatch(.*)*', component: ... }` | `{ path: '*', element: <NotFound /> }` |

### Cheat Code Angular Router 10 Detik

```text
provideRouter(routes, withComponentInputBinding()) → Setup awal wajib
<router-outlet />                          → Tempat halaman dirender
<a routerLink="/path" routerLinkActive="active"> → Link navigasi aktif
id = input.required<string>()              → Menangkap parameter :id
inject(Router).navigate(['/path', id])     → Pindah halaman via TypeScript
loadComponent: () => import('./page')      → Lazy loading halaman
canActivate: [authGuard]                   → Mengunci rute dengan guard
path: '**'                                 → Halaman 404 (paling bawah)
```

---

<a id="bagian-14"></a>

## 14. 🛠️ Mini Project: Portal Dashboard & Katalog Multi-Page SPA

### Deskripsi Proyek
Membangun aplikasi multi-halaman **Portal Dashboard & Katalog Produk SPA** mandiri yang mengintegrasikan:
- Setup `provideRouter` dengan `withComponentInputBinding()`.
- Layout Header dengan indikator navigasi aktif (`routerLinkActive`).
- Halaman Katalog dengan parameter dinamis (`:id`) yang dibaca via Signal Input.
- Halaman Login & Proteksi Halaman Admin Dashboard menggunakan **Functional Auth Guard** (`canActivateFn`).
- Penanganan Halaman 404 Not Found.

```text
┌────────────────────────────────────────────────────────────────┐
│ 🚀 Portal SPA   [ Katalog ]  [ Dashboard Admin (🔒) ]  [ Login ]│
├────────────────────────────────────────────────────────────────┤
│ (Tampilan Halaman Berganti di sini via <router-outlet />)      │
└────────────────────────────────────────────────────────────────┘
```

### Langkah 1: Service Otentikasi (`src/app/services/auth.service.ts`)

```typescript
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = signal(false);
  currentUser = signal('Budi Santoso');

  login() {
    this.isLoggedIn.set(true);
  }

  logout() {
    this.isLoggedIn.set(false);
  }
}
```

### Langkah 2: Functional Auth Guard (`src/app/guards/auth.guard.ts`)

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }
  
  // Alihkan ke halaman login jika belum terotentikasi
  return router.parseUrl('/login');
};
```

### Langkah 3: Halaman-Halaman Aplikasi

1. **Katalog Produk (`src/app/pages/catalog.component.ts`)**:
```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>🛍️ Katalog Produk Unggulan</h2>
    <div class="grid">
      <div class="card">
        <h3>Laptop Pro 16"</h3>
        <p>Performa tinggi untuk developer.</p>
        <a [routerLink]="['/product', 101]" class="btn">Lihat Spesifikasi</a>
      </div>
      <div class="card">
        <h3>Mechanical Keyboard</h3>
        <p>Switch tactile dengan RGB.</p>
        <a [routerLink]="['/product', 102]" class="btn">Lihat Spesifikasi</a>
      </div>
    </div>
  `,
  styles: `
    .grid { display: flex; gap: 1rem; margin-top: 1rem; }
    .card { border: 1px solid #cbd5e1; padding: 1rem; border-radius: 8px; flex: 1; }
    .btn { display: inline-block; margin-top: 0.5rem; padding: 0.4rem 0.8rem; background: #3b82f6; color: white; text-decoration: none; border-radius: 4px; }
  `
})
export class CatalogComponent {}
```

2. **Detail Produk (`src/app/pages/product-detail.component.ts`)**:
```typescript
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="box">
      <a routerLink="/catalog">← Kembali ke Katalog</a>
      <h2>Rincian Item ID: #{{ id() }}</h2>
      <p>Data parameter URL ini otomatis dibaca oleh <strong>Signal Input</strong>.</p>
    </div>
  `,
  styles: `.box { padding: 1.5rem; border: 1px solid #cbd5e1; border-radius: 8px; }`
})
export class ProductDetailComponent {
  id = input.required<string>();
}
```

3. **Login (`src/app/pages/login.component.ts`)**:
```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="auth-box">
      <h2>🔐 Autentikasi Masuk</h2>
      <p>Status: {{ auth.isLoggedIn() ? 'Sudah Login' : 'Belum Login' }}</p>
      
      @if (!auth.isLoggedIn()) {
        <button (click)="doLogin()">Masuk (Set Login = True)</button>
      } @else {
        <button (click)="auth.logout()">Keluar (Logout)</button>
      }
    </div>
  `,
  styles: `.auth-box { padding: 1.5rem; border: 1px solid #cbd5e1; border-radius: 8px; max-width: 320px; } button { padding: 0.5rem 1rem; cursor: pointer; }`
})
export class LoginComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  doLogin() {
    this.auth.login();
    this.router.navigate(['/admin']);
  }
}
```

4. **Protected Admin Dashboard (`src/app/pages/admin.component.ts`)**:
```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  template: `
    <div class="admin-panel">
      <h2>🛡️ Panel Rahasia Admin</h2>
      <p>Selamat datang, <strong>{{ auth.currentUser() }}</strong>! Halaman ini dilindungi oleh <code>canActivate: [authGuard]</code>.</p>
      <button (click)="auth.logout()">Logout</button>
    </div>
  `,
  styles: `.admin-panel { background: #f0fdf4; border: 1px solid #22c55e; padding: 1.5rem; border-radius: 8px; }`
})
export class AdminComponent {
  auth = inject(AuthService);
}
```

5. **Not Found 404 (`src/app/pages/not-found.component.ts`)**:
```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="text-align: center; padding: 2rem;">
      <h2>404 - Halaman Tidak Ditemukan</h2>
      <a routerLink="/catalog">Kembali ke Katalog</a>
    </div>
  `
})
export class NotFoundComponent {}
```

### Langkah 4: Definisi Rute (`src/app/app.routes.ts`)

```typescript
import { Routes } from '@angular/router';
import { CatalogComponent } from './pages/catalog.component';
import { ProductDetailComponent } from './pages/product-detail.component';
import { LoginComponent } from './pages/login.component';
import { AdminComponent } from './pages/admin.component';
import { NotFoundComponent } from './pages/not-found.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'catalog', component: CatalogComponent, title: 'Katalog Produk' },
  { path: 'product/:id', component: ProductDetailComponent, title: 'Detail Produk' },
  { path: 'login', component: LoginComponent, title: 'Masuk Akun' },
  
  // Rute Terproteksi
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate: [authGuard],
    title: 'Dashboard Admin'
  },
  
  // Wildcard 404
  { path: '**', component: NotFoundComponent, title: '404 Tidak Ditemukan' }
];
```

### Langkah 5: Root Layout (`src/app/app.component.ts`)

```typescript
import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="navbar">
      <div class="brand">🚀 Portal SPA</div>
      <nav class="nav-links">
        <a routerLink="/catalog" routerLinkActive="active-nav">🛍️ Katalog</a>
        <a routerLink="/admin" routerLinkActive="active-nav">🔒 Admin Dashboard</a>
        <a routerLink="/login" routerLinkActive="active-nav">
          {{ auth.isLoggedIn() ? '👤 Akun (' + auth.currentUser() + ')' : '🔑 Login' }}
        </a>
      </nav>
    </header>

    <main class="main-content">
      <router-outlet />
    </main>
  `,
  styles: `
    .navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: #0f172a; color: white; }
    .brand { font-weight: bold; font-size: 1.1rem; }
    .nav-links a { color: #94a3b8; text-decoration: none; margin-left: 1rem; padding: 0.4rem 0.8rem; border-radius: 4px; }
    .nav-links a.active-nav { color: white; background: #2563eb; }
    .main-content { padding: 2rem; max-width: 800px; margin: 0 auto; font-family: system-ui, sans-serif; }
  `
})
export class AppComponent {
  auth = inject(AuthService);
}
```

---

<a id="bagian-15"></a>

## 15. 🧭 Urutan Belajar yang Disarankan & Referensi Resmi

### Urutan Langkah Belajar Selanjutnya

```text
1. Kuasai Dasar Komponen & Signals: [[angular-dasar|Angular Dasar]]
   ↓
2. Pahami Navigasi & Proteksi Rute: [[angular-routing|Angular Routing]] (Selesai ✅)
   ↓
3. Lanjut ke Modul State Management & Async Stream: [[angular-state|Angular State]]
   - Global State Management Terpusat
   - RxJS & Signals Interop (toSignal, toObservable)
   - HTTP Interceptors & NgRx SignalStore
```

### Referensi Resmi

- **Dokumentasi Resmi Angular Router**: [https://angular.dev/guide/routing](https://angular.dev/guide/routing)
- **Panduan Common Routing Tasks**: [https://angular.dev/guide/routing/common-router-tasks](https://angular.dev/guide/routing/common-router-tasks)
- **API Reference `provideRouter`**: [https://angular.dev/api/router/provideRouter](https://angular.dev/api/router/provideRouter)
- **API Reference `withComponentInputBinding`**: [https://angular.dev/api/router/withComponentInputBinding](https://angular.dev/api/router/withComponentInputBinding)
- **Panduan Functional Route Guards**: [https://angular.dev/api/router/CanActivateFn](https://angular.dev/api/router/CanActivateFn)
