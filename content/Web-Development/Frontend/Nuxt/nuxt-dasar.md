---
title: "Nuxt Dasar"
description: "Fundamental Nuxt 3: SSR & SSG mental model, File-based routing, Layouts, Auto-imports, Composables, dan SEO meta tags."
order: 1
tags:
  - web-development
  - frontend
  - nuxt
  - vue
  - ssr
---

# Nuxt Dasar

> **Target:** Pemula yang telah memahami Vue 3 (Composition API & `<script setup>`), serta ingin menguasai **pengembangan web full-stack, Server-Side Rendering (SSR), Static Site Generation (SSG), File-Based Routing, Auto-Imports, Layouts, dan SEO modern menggunakan Nuxt 3.12+ (Nuxt 4 Ready)**.
> **Versi:** Nuxt 3.x (Vue 3 / Nitro)
> **Prasyarat:** [[vue-dasar|Vue Dasar]]
> Fokus modul pembelajaran ini: **mental model SSR vs CSR vs SSG → Nuxi CLI → struktur direktori standar Nuxt 3 → Auto-Imports (Vue Reactivity, Components, Composables) → File-Based Routing (`pages/`) → Dynamic Routes (`[id].vue`, `[...slug].vue`) → `<NuxtLink>` prefetching → `app.vue` & `<NuxtPage>` → Layouts System (`layouts/` & `definePageMeta`) → `<ClientOnly>` → Assets (`public/` vs `assets/`) → SEO `useHead()` & `useSeoMeta()` → `nuxt.config.ts` → Nested Pages → Custom `error.vue` & `clearError()` → Page Transitions → mini project Corporate Blog & Product Showcase**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: Mental Model SSR/SSG, Nuxi CLI, Struktur Direktori, Auto-Imports, File-based Routing, <NuxtLink>, dan app.vue

🟡 Lanjutan
→ pelajari setelah routing dasar: Layouts System, definePageMeta, <ClientOnly>, Assets Management, useSeoMeta, nuxt.config.ts, dan error.vue

🔴 Advanced / Operasional
→ penting untuk arsitektur production: Nested Sub-pages, Page Transitions, TypeScript auto-generation, dan Hybrid Rendering
```

Mental model alur request Server-Side Rendering (SSR) & Client Hydration di Nuxt 3:

```text
              1. PENGGUNA MEMINTA URL DARI BROWSER (HTTP GET)
                                │
                                ▼
              2. NUXT SERVER (Nitro Engine Node.js)
                 ├─ Render Komponen Vue menjadi HTML Statis
                 └─ Jalankan Data Fetching Awal di Server
                                │
                                ▼
              3. BROWSER MENERIMA DOKUMEN HTML MATANG
         (Layar langsung tampil dalam hitungan milidetik + SEO Ramah)
                                │
                                ▼
              4. CLIENT HYDRATION (Vue Script Loaded)
        (Browser mengaktifkan reaktivitas Vue, Event Listeners, & SPA)
                                │
                                ▼
              5. NAVIGASI BERIKUTNYA BERUBAH MENJADI SPA
           (Klik <NuxtLink> instan tanpa reload halaman browser!)
```

**Hafalan:**

```text
SSR (Server-Side Rendering)   → proses render komponen Vue menjadi HTML siap saji di server sebelum dikirim ke browser
Universal / Isomorphic App    → aplikasi yang kodenya dieksekusi di server saat pemuatan awal dan di browser saat interaksi
Auto-Imports                  → fitur bawaan Nuxt yang mengimpor komponen, composables, dan fungsi Vue secara otomatis tanpa import
File-Based Routing            → pembuatan rute halaman web otomatis berdasarkan struktur file dan folder di dalam direktori 'pages/'
<NuxtLink>                    → komponen tautan pintar dengan fitur auto-prefetching saat link terlihat di layar browser
<NuxtPage>                    → komponen view router penampung tempat file dari direktori 'pages/' ditampilkan
<NuxtLayout>                  → komponen pembungkus tata letak (Header, Sidebar, Footer) yang didefinisikan di direktori 'layouts/'
useSeoMeta()                  → composable resmi Nuxt untuk mengatur metadata Search Engine Optimization dan Open Graph dinamis
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Nuxt 3 & Mental Model Full-Stack Framework](#bagian-1)
2. [Tooling Nuxi CLI & Inisialisasi Proyek Baru](#bagian-2)
3. [Anatomi Struktur Direktori Standar Nuxt 3](#bagian-3)
4. [Konsep Auto-Imports Otomatis](#bagian-4)
5. [File-Based Routing Dasar di Folder `pages/`](#bagian-5)
6. [Dynamic Routing & Parameter URL](#bagian-6)
7. [Navigasi Pintar dengan `<NuxtLink>`](#bagian-7)
8. [Komponen `<NuxtPage>` & Root Component `app.vue`](#bagian-8)

### 🟡 Lanjutan

9. [Layouts System: Membuat Tata Letak Bersama di `layouts/`](#bagian-9)
10. [Dynamic & Per-Page Layouts dengan `definePageMeta`](#bagian-10)
11. [Komponen `<ClientOnly>` untuk Render Khusus Browser](#bagian-11)
12. [Assets & Media: Folder `public/` vs `assets/`](#bagian-12)
13. [SEO & Dynamic Metadata dengan `useHead()` & `useSeoMeta()`](#bagian-13)
14. [Konfigurasi Utama di `nuxt.config.ts`](#bagian-14)
15. [Nested Pages & Sub-routing](#bagian-15)
16. [Halaman Error Kustom (`error.vue` di Root Proyek)](#bagian-16)

### 🔴 Advanced / Operasional

17. [Page & Layout Transitions](#bagian-17)
18. [TypeScript Support Kelas Satu di Nuxt 3](#bagian-18)

### 🛠️ Referensi & Praktik

19. [Peta Ingatan Cepat](#bagian-19)
20. [Tabel Ringkasan](#bagian-20)
21. [Cheat Code Nuxt Dasar 10 Detik](#bagian-21)
22. [Urutan Belajar yang Disarankan](#bagian-22)
23. [Mini Project: Production-Ready Corporate Blog & Product Showcase Nuxt Web App](#bagian-23)
24. [Referensi Resmi](#bagian-24)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan Nuxt 3 & Mental Model Full-Stack Framework

#### Konsep

Vue.js murni adalah framework Single Page Application (SPA) berbasis **Client-Side Rendering (CSR)**: browser menerima file HTML kosong (`<div id="app"></div>`) dan JavaScript besar. Dampaknya:
1. **SEO Buruk:** Mesin pencari (Google, Bing) dan media sosial kesulitan membaca konten dinamis.
2. **Initial Load Lambat:** Pengguna harus menunggu seluruh bundle JavaScript terunduh sebelum melihat tampilan apapun (*White Screen Lag*).

**Nuxt 3** adalah **Meta-Framework Full-Stack** di atas Vue 3 yang memberikan kemampuan:
- **Server-Side Rendering (SSR):** Server mengirim HTML matang yang ramah SEO dan instan dilihat pengguna.
- **Client-Side Hydration:** Setelah halaman tampil, Vue mengambil alih sehingga navigasi berikutnya menjadi SPA super cepat.
- **Static Site Generation (SSG):** Men-generate seluruh halaman menjadi file HTML statis saat build (`nuxt generate`).

#### Cara Kerja

```text
Vue SPA Murni (CSR):
Request ──> Terima HTML Kosong (<div id="app">) ──(Download JS)──> Render UI (Lambat di Awal)

Nuxt 3 (Universal SSR):
Request ──> Server Render HTML Berisi Konten ──(Tampil Instan!)──> Vue Hydration (Lanjut SPA)
```

**Hafalan:**

```text
Universal SSR → render HTML matang di server untuk kecepatan awal dan SEO, lalu lanjutkan sebagai SPA interaktif di browser
```

---

<a id="bagian-2"></a>

## 2. 🟢 Tooling Nuxi CLI & Inisialisasi Proyek Baru

#### Konsep

**Nuxi** adalah Command Line Interface (CLI) resmi untuk ekosistem Nuxt 3.

Perintah Pembuatan Proyek Baru:
```bash
# Inisialisasi proyek Nuxt 3
npx nuxi@latest init my-nuxt-app

# Masuk direktori proyek
cd my-nuxt-app

# Instalasi seluruh dependensi
npm install

# Jalankan server pengembangan lokal (Hot Module Replacement)
npm run dev
```

Server lokal otomatis berjalan pada alamat: `http://localhost:3000`.

**Hafalan:**

```text
npx nuxi@latest init <nama-proyek> → perintah resmi pembuatan proyek baru Nuxt 3
```

---

<a id="bagian-3"></a>

## 3. 🟢 Anatomi Struktur Direktori Standar Nuxt 3

#### Konsep

Nuxt menganut prinsip **Convention over Configuration** (membaca struktur folder secara otomatis tanpa perlu konfigurasi routing manual):

```text
my-nuxt-app/
├── .nuxt/           (File build internal otomatis - jangan diedit)
├── assets/          (Aset terkompilasi: SCSS, CSS global, font)
├── components/      (Komponen UI Vue yang otomatis ter-import)
├── composables/     (Fungsi komposisi logika reusable auto-import)
├── layouts/         (Template tata letak bersama: default.vue, admin.vue)
├── pages/           (Struktur rute halaman web otomatis)
├── public/          (Aset statis publik: favicon, robots.txt, logo)
├── server/          (Nitro backend engine: server/api/ dan server/middleware/)
├── app.vue          (Root entry component aplikasi)
├── error.vue        (Halaman penanganan error kustom 404 / 500)
├── nuxt.config.ts   (File konfigurasi utama Nuxt)
└── package.json     (Metadata proyek dan daftar dependensi)
```

**Hafalan:**

```text
pages/       → rute halaman web otomatis
components/  → komponen UI auto-import
layouts/     → template tata letak bersama
composables/ → fungsi logika reaktif auto-import
server/      → endpoint API backend Nitro
```

---

<a id="bagian-4"></a>

## 4. 🟢 Konsep Auto-Imports Otomatis

#### Konsep

Salah satu fitur paling produktif di Nuxt 3 adalah **Auto-Imports**:
Anda **TIDAK PERLU MENULIS BARIS `import { ... }`** untuk:
1. **Vue Reactivity APIs:** `ref`, `reactive`, `computed`, `watch`, `onMounted`, `nextTick`.
2. **Nuxt Composables:** `useRoute`, `useRouter`, `useFetch`, `useHead`, `useSeoMeta`, `useState`.
3. **Komponen di `components/`:** Semua file `.vue` di folder `components/` langsung dapat digunakan di template JSX/Vue tanpa registrasi.

#### Contoh

```vue
<!-- components/AppAlert.vue -->
<template>
  <div class="alert-box">
    <slot />
  </div>
</template>
```

Penggunaan di Halaman (`pages/index.vue`):
```vue
<script setup>
// ref dan computed otomatis tersedia tanpa "import { ref } from 'vue'"!
const count = ref(0)
const doubleCount = computed(() => count.value * 2)
</script>

<template>
  <div>
    <!-- Komponen <AppAlert> otomatis ter-import tanpa import manual! -->
    <AppAlert>
      Nilai saat ini: {{ count }} (Dobel: {{ doubleCount }})
    </AppAlert>
    <button @click="count++">+ Tambah</button>
  </div>
</template>
```

**Hafalan:**

```text
Auto-Imports → seluruh fungsi Vue Reactivity, Nuxt Composables, dan Komponen UI otomatis tersedia tanpa baris import
```

---

<a id="bagian-5"></a>

## 5. 🟢 File-Based Routing Dasar di Folder `pages/`

#### Konsep

Begitu Anda membuat folder **`pages/`**, Nuxt akan mengaktifkan modul Vue Router secara otomatis di balik layar. Setiap file `.vue` yang dibuat di dalam folder ini otomatis menjadi URL rute web:

| Struktur File di `pages/` | Hasil URL di Browser |
|---|---|
| `pages/index.vue` | `http://localhost:3000/` |
| `pages/about.vue` | `http://localhost:3000/about` |
| `pages/contact.vue` | `http://localhost:3000/contact` |
| `pages/blog/index.vue` | `http://localhost:3000/blog` |
| `pages/blog/latest.vue` | `http://localhost:3000/blog/latest` |

#### Contoh

File `pages/about.vue`:
```vue
<template>
  <div>
    <h1>Tentang Perusahaan Kami</h1>
    <p>Kami membangun solusi web performa tinggi dengan Nuxt 3.</p>
  </div>
</template>
```

**Hafalan:**

```text
pages/index.vue   → rute root halaman utama (/)
pages/about.vue   → rute /about
```

---

<a id="bagian-6"></a>

## 6. 🟢 Dynamic Routing & Parameter URL

#### Konsep

Untuk membuat halaman dengan parameter URL dinamis (seperti `/products/101` atau `/users/budi`), gunakan tanda kurung siku `[parameter].vue` pada penamaan file atau folder:

1. **Parameter Tunggal:** `pages/products/[id].vue` $\rightarrow$ Menangkap URL `/products/101`.
2. **Parameter Folder Bersarang:** `pages/users/[username]/settings.vue` $\rightarrow$ Menangkap `/users/budi/settings`.
3. **Catch-All (Wildcard):** `pages/[...slug].vue` $\rightarrow$ Menangkap seluruh segmen URL berjenjang (`/docs/a/b/c`).

Mengekstrak Parameter di Script:
Gunakan composable **`useRoute().params.id`**.

#### Contoh

File `pages/products/[id].vue`:
```vue
<script setup>
const route = useRoute()
const productId = route.params.id // Mengambil parameter [id] dari URL
</script>

<template>
  <div class="product-detail">
    <h2>Detail Produk #{{ productId }}</h2>
    <p>Sedang menampilkan data untuk ID: <strong>{{ productId }}</strong></p>
  </div>
</template>
```

**Hafalan:**

```text
pages/resource/[id].vue → rute dinamis yang menangkap parameter URL via useRoute().params.id
pages/[...slug].vue     → rute catch-all yang menangkap seluruh sisa segmen URL sebagai array
```

---

<a id="bagian-7"></a>

## 7. 🟢 Navigasi Pintar dengan `<NuxtLink>`

#### Konsep

Komponen **`<NuxtLink>`** adalah pengganti tag `<a>` standar dan komponen `<RouterLink>` bawaan Vue:

Fitur Unggulan `<NuxtLink>`:
1. **Client-Side Navigation:** Berpindah halaman seketika tanpa refresh browser.
2. **Smart Prefetching Otomatis:** Begitu elemen `<NuxtLink to="/products">` masuk ke area pandang layar (*viewport*), Nuxt otomatis mendownload kode JavaScript halaman tersebut di latar belakang. Saat pengguna mengklik link, halaman terbuka dalam **0 milidetik**!
3. **Mendukung Link Eksternal:** Jika atribut `to` berisi `https://...`, `<NuxtLink>` otomatis me-render tag `<a>` biasa dengan `rel="noopener noreferrer"`.

#### Contoh

```vue
<template>
  <nav style="display: flex; gap: 15px; padding: 15px; background: #f8fafc;">
    <!-- Link Internal dengan Prefetching Otomatis -->
    <NuxtLink to="/" active-class="active-nav">Beranda</NuxtLink>
    <NuxtLink to="/products" active-class="active-nav">Katalog Produk</NuxtLink>
    <NuxtLink to="/about" active-class="active-nav">Tentang</NuxtLink>

    <!-- Link Eksternal Otomatis Terdeteksi -->
    <NuxtLink to="https://google.com" target="_blank">Google</NuxtLink>
  </nav>
</template>
```

**Hafalan:**

```text
<NuxtLink to="/path">Label</NuxtLink> → tautan cerdas dengan auto-prefetching dan navigasi SPA instan
```

---

<a id="bagian-8"></a>

## 8. 🟢 Komponen `<NuxtPage>` & Root Component `app.vue`

#### Konsep

File **`app.vue`** di root proyek adalah komponen induk utama tempat seluruh siklus aplikasi Nuxt bermula.

Agar halaman-halaman dari folder `pages/` dapat ditampilkan di layar, Anda **WAJIB menyisipkan tag `<NuxtPage />`** di dalam `app.vue`:
- Jika `app.vue` hanya berisi teks biasa tanpa `<NuxtPage />`, folder `pages/` tidak akan pernah ditampilkan!

#### Contoh

File `app.vue` Standar dengan Layout:
```vue
<!-- app.vue -->
<template>
  <div>
    <!-- Menampilkan Layout dan Halaman Aktif -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

**Hafalan:**

```text
<NuxtPage />   → portal router view yang me-render halaman dari direktori pages/
<NuxtLayout /> → pembungkus tata letak yang me-render layout dari direktori layouts/
```

---

<a id="bagian-9"></a>

## 9. 🟡 Layouts System: Membuat Tata Letak Bersama di `layouts/`

#### Konsep

Jika Anda memiliki 20 halaman yang semuanya menggunakan Header Navbar dan Footer yang sama persis, Anda tidak perlu mengulang template tersebut di setiap halaman.

Buat file layout di folder **`layouts/`**:
- Layout default bernama **`layouts/default.vue`**.
- Gunakan tag **`<slot />`** untuk menentukan tempat konten halaman dirender.

#### Contoh

File `layouts/default.vue`:
```vue
<template>
  <div class="layout-wrapper">
    <!-- Header Bersama -->
    <header style="background: #0f172a; color: #fff; padding: 15px 20px;">
      <h2>🚀 Portal Nuxt 3 Enterprise</h2>
      <nav style="display: flex; gap: 15px;">
        <NuxtLink to="/" style="color: #fff;">Beranda</NuxtLink>
        <NuxtLink to="/products" style="color: #fff;">Produk</NuxtLink>
      </nav>
    </header>

    <!-- Konten Halaman Spesifik Dirender di Slot Ini -->
    <main style="padding: 24px; min-height: 450px;">
      <slot />
    </main>

    <!-- Footer Bersama -->
    <footer style="text-align: center; padding: 15px; background: #f1f5f9; color: #64748b;">
      © 2026 Nuxt Enterprise. Seluruh hak cipta dilindungi.
    </footer>
  </div>
</template>
```

**Hafalan:**

```text
layouts/default.vue + <slot /> → template tata letak bersama default untuk seluruh halaman
```

---

<a id="bagian-10"></a>

## 10. 🟡 Dynamic & Per-Page Layouts dengan `definePageMeta`

#### Konsep

Seringkali kita membutuhkan layout berbeda untuk halaman tertentu (misal: layout khusus Dashboard Admin `layouts/admin.vue`, atau halaman Login tanpa Navbar `layouts/auth.vue`).

Gunakan macro compiler **`definePageMeta({ layout: 'nama-layout' })`** di dalam `<script setup>` halaman terkait.

#### Contoh

1. Layout Khusus Admin (`layouts/admin.vue`):
```vue
<template>
  <div style="display: flex;">
    <aside style="width: 220px; background: #1e293b; color: #fff; min-height: 100vh; padding: 15px;">
      <h3>Panel Admin</h3>
      <p>Menu Pengguna</p>
      <p>Laporan Penjualan</p>
    </aside>
    <main style="flex: 1; padding: 20px;">
      <slot />
    </main>
  </div>
</template>
```

2. Mengaktifkan Layout di Halaman (`pages/admin/dashboard.vue`):
```vue
<script setup>
// Menentukan layout kustom untuk halaman ini
definePageMeta({
  layout: 'admin'
})
</script>

<template>
  <div>
    <h1>Dashboard Statistik Admin</h1>
    <p>Halaman ini otomatis dibungkus oleh layouts/admin.vue!</p>
  </div>
</template>
```

**Hafalan:**

```text
definePageMeta({ layout: 'admin' }) → menetapkan layout kustom per halaman
definePageMeta({ layout: false })   → menonaktifkan seluruh layout (halaman polos)
```

---

<a id="bagian-11"></a>

## 11. 🟡 Komponen `<ClientOnly>` untuk Render Khusus Browser

#### Konsep

Pada Server-Side Rendering (SSR), kode dieksekusi di Node.js server terlebih dahulu. Di server, objek browser seperti `window`, `document`, `localStorage`, atau library Canvas/Chart **TIDAK TERSEDIA**.

Jika Anda memanggil library yang membutuhkan `window` di server, akan terjadi crash atau error **SSR Hydration Mismatch**.

Gunakan tag bawaan **`<ClientOnly>`**:
- Komponen di dalam `<ClientOnly>` **hanya akan dirender di browser klien**.
- Properti `fallback` menampilkan teks atau skeleton placeholder sementara saat HTML dirender di server.

#### Contoh

```vue
<template>
  <div>
    <h2>Statistik Pengunjung Live</h2>

    <!-- Hanya dijalankan di browser, aman dari error SSR -->
    <ClientOnly fallback-tag="div" fallback="⏳ Memuat grafik interaktif...">
      <InteractiveChartCanvas />
    </ClientOnly>
  </div>
</template>
```

**Hafalan:**

```text
<ClientOnly fallback="Loading..."> <BrowserOnlyComponent /> </ClientOnly> → merender komponen khusus di sisi client
```

---

<a id="bagian-12"></a>

## 12. 🟡 Assets & Media: Folder `public/` vs `assets/`

#### Konsep

Nuxt 3 menyediakan dua folder untuk menyimpan file gambar, font, dan stylesheet:

| Karakteristik | Folder `public/` | Folder `assets/` |
|---|---|---|
| **Pemrosesan** | **Tidak diproses** (Disajikan apa adanya tanpa kompilasi) | **Diproses oleh Vite** (Di-bundle, di-minify, hash nama file) |
| **Akses di Kode** | Menggunakan root URL langsung: `/logo.png`, `/robots.txt` | Menggunakan alias path: `~/assets/images/banner.jpg` |
| **Kasus Penggunaan** | `favicon.ico`, `robots.txt`, `sitemap.xml`, gambar statis murni | File CSS/SCSS global, gambar yang perlu dioptimasi oleh bundler |

#### Contoh

```vue
<template>
  <div>
    <!-- Gambar dari folder public/ (public/logo.png) -->
    <img src="/logo.png" alt="Logo Publik" />

    <!-- File CSS yang di-import dari folder assets/ -->
    <img src="~/assets/images/hero-banner.png" alt="Banner Teroptimasi Vite" />
  </div>
</template>
```

**Hafalan:**

```text
public/assets  → URL absolut langsung (/file.png) tanpa proses bundler
assets/images  → alias path (~/assets/file.png) diproses dan dioptimasi oleh Vite bundler
```

---

<a id="bagian-13"></a>

## 13. 🟡 SEO & Dynamic Metadata dengan `useHead()` & `useSeoMeta()`

#### Konsep

Keunggulan utama Nuxt adalah optimasi mesin pencari (SEO). Nuxt menyediakan 2 composable resmi:

1. **`useSeoMeta()` (Sangat Direkomendasikan):** Berorientasi properti strongly-typed untuk Title, Description, Open Graph (WhatsApp, Twitter, Facebook preview) dengan performa tinggi.
2. **`useHead()`:** Mengatur tag `<script>`, `<link rel="stylesheet">`, atau tag `<meta>` kustom.

#### Contoh

```vue
<script setup>
const route = useRoute()
const articleTitle = ref("Panduan Lengkap Nuxt 3 untuk Pemula")

// Konfigurasi SEO Terstruktur
useSeoMeta({
  title: articleTitle,
  description: 'Pelajari dasar-dasar Nuxt 3, SSR, Auto-Imports, dan Routing dalam bahasa Indonesia.',
  ogTitle: articleTitle,
  ogDescription: 'Pelajari dasar-dasar Nuxt 3, SSR, Auto-Imports, dan Routing.',
  ogImage: 'https://mysite.com/banner-nuxt.jpg',
  ogUrl: `https://mysite.com${route.fullPath}`,
  twitterCard: 'summary_large_image'
})

useHead({
  htmlAttrs: { lang: 'id' },
  link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
})
</script>
```

**Hafalan:**

```text
useSeoMeta({ title: 'Judul', description: 'Deskripsi', ogImage: 'url' }) → konfigurasi SEO & Open Graph sosial media
```

---

<a id="bagian-14"></a>

## 14. 🟡 Konfigurasi Utama di `nuxt.config.ts`

#### Konsep

File **`nuxt.config.ts`** adalah pusat kendali pengaturan aplikasi Nuxt.

Pengaturan Umum:
- **`css`:** Mendaftarkan file stylesheet global.
- **`modules`:** Mendaftarkan modul eksternal (misal: `@nuxtjs/tailwindcss`, `@pinia/nuxt`).
- **`app.head`:** Mengatur metadata SEO default untuk seluruh halaman aplikasi.
- **`devtools`:** Mengaktifkan Nuxt DevTools di browser.

#### Contoh

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // 1. Mengaktifkan Nuxt DevTools interaktif
  devtools: { enabled: true },

  // 2. Mendaftarkan CSS Global
  css: ['~/assets/css/main.css'],

  // 3. Metadata Head Default Global
  app: {
    head: {
      title: 'Aplikasi Toko Nuxt 3',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  // 4. Kompatibilitas Versi
  compatibilityDate: '2024-04-03'
})
```

**Hafalan:**

```text
defineNuxtConfig({ devtools: { enabled: true }, css: ['~/assets/css/main.css'] })
```

---

<a id="bagian-15"></a>

## 15. 🟡 Nested Pages & Sub-routing

#### Konsep

Untuk membuat halaman bersarang dengan sub-navigasi (misal: halaman Dashboard yang memiliki tab Ringkasan, Profil, dan Notifikasi di dalam area konten yang sama):

1. Buat file induk: `pages/parent.vue`.
2. Di dalam file induk, letakkan tag **`<NuxtPage />`** internal.
3. Buat folder dengan nama yang sama persis: `pages/parent/` dan isi sub-halaman di dalamnya (`child1.vue`, `child2.vue`).

#### Contoh

Struktur File:
```text
pages/
├── dashboard.vue         (File Induk berisi <NuxtPage />)
└── dashboard/
    ├── index.vue         (Default sub-tab: /dashboard)
    └── profile.vue       (Sub-tab: /dashboard/profile)
```

File `pages/dashboard.vue`:
```vue
<template>
  <div style="display: flex; gap: 20px;">
    <!-- Sidebar Sub-Navigasi -->
    <nav style="width: 180px; background: #f8fafc; padding: 10px;">
      <NuxtLink to="/dashboard">Ringkasan</NuxtLink><br />
      <NuxtLink to="/dashboard/profile">Edit Profil</NuxtLink>
    </nav>

    <!-- Sub-page dirender di sini tanpa me-reload layout induk -->
    <div style="flex: 1;">
      <NuxtPage />
    </div>
  </div>
</template>
```

**Hafalan:**

```text
pages/parent.vue + pages/parent/child.vue → membuat sub-routing bersarang dengan tag <NuxtPage /> internal
```

---

<a id="bagian-16"></a>

## 16. 🟡 Halaman Error Kustom (`error.vue` di Root Proyek)

#### Konsep

Jika terjadi error `404 Not Found` atau `500 Server Error`, Nuxt secara default menampilkan halaman error bawaan Nuxt.

Untuk membuat halaman error kustom berpenampilan profesional:
1. Buat file **`error.vue` di root proyek** (sejajar dengan `app.vue`).
2. Terima properti `error` via `defineProps({ error: Object })`.
3. Sediakan tombol pemulihan menggunakan fungsi **`clearError({ redirect: '/' })`**.

#### Contoh

```vue
<!-- error.vue -->
<script setup>
const props = defineProps({
  error: {
    type: Object,
    default: () => ({ statusCode: 404, message: 'Halaman Tidak Ditemukan' })
  }
})

// Fungsi pembersih error & redirect aman
const handleClearError = () => clearError({ redirect: '/' })
</script>

<template>
  <div style="text-align: center; padding: 60px 20px; font-family: sans-serif;">
    <h1 style="font-size: 72px; color: #ef4444; margin: 0;">{{ error.statusCode }}</h1>
    <h2>{{ error.statusCode === 404 ? 'Halaman Tidak Ditemukan' : 'Terjadi Kesalahan Server' }}</h2>
    <p style="color: #64748b; margin-bottom: 24px;">{{ error.message }}</p>
    <button
      @click="handleClearError"
      style="background: #2563eb; color: #fff; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;"
    >
      ⬅ Kembali ke Halaman Utama
    </button>
  </div>
</template>
```

**Hafalan:**

```text
error.vue + clearError({ redirect: '/' }) → halaman error kustom global penangan 404/500
```

---

<a id="bagian-17"></a>

## 17. 🔴 Page & Layout Transitions

#### Konsep

Nuxt 3 memiliki integrasi bawaan dengan komponen `<Transition>` Vue untuk memberikan animasi halus saat berpindah antar halaman.

Aktifkan CSS transisi di `nuxt.config.ts` atau file CSS global:

```css
/* assets/css/main.css */
.page-enter-active,
.page-leave-active {
  transition: all 0.25s ease-out;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
```

Aktifkan di `nuxt.config.ts`:
```typescript
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})
```

**Hafalan:**

```text
app.pageTransition: { name: 'page', mode: 'out-in' } → mengaktifkan animasi transisi halaman global
```

---

<a id="bagian-18"></a>

## 18. 🔴 TypeScript Support Kelas Satu di Nuxt 3

#### Konsep

Nuxt 3 dibangun 100% menggunakan TypeScript dan menyediakan **auto-type generation**:
- Setiap kali Anda membuat rute baru di `pages/` atau komponen di `components/`, Nuxt otomatis memperbarui file `.nuxt/tsconfig.json` dan memberikan autocompletion tipe rute yang sangat akurat.
- Anda dapat menulis `<script setup lang="ts">` secara langsung tanpa konfigurasi compiler manual.

**Hafalan:**

```text
<script setup lang="ts"> → penulisan komponen berbasis TypeScript dengan autocompletion rute otomatis
```

---

<a id="bagian-19"></a>

## 19. 🛠️ Peta Ingatan Cepat

```text
                           PETA ARSITEKTUR NUXT DASAR
                                       │
       ┌───────────────────────────────┼───────────────────────────────┐
       ▼                               ▼                               ▼
ROUTING & NAVIGASI             LAYOUTS & VIEWPORT              OPTIMASI & SEO
├─ pages/index.vue             ├─ app.vue (<NuxtPage />)       ├─ useSeoMeta() (Meta Tags)
├─ pages/items/[id].vue        ├─ layouts/default.vue          ├─ <ClientOnly> (No SSR crash)
├─ <NuxtLink to="...">         ├─ definePageMeta({ layout })   ├─ public/ vs assets/
└─ pages/[...slug].vue (404)   └─ error.vue (clearError)       └─ nuxt.config.ts
```

---

<a id="bagian-20"></a>

## 20. 📚 Tabel Ringkasan

| Fitur / Komponen | Lokasi / Tipe | Fungsi & Karakteristik Utama |
|---|---|---|
| `<NuxtPage />` | Komponen Bawaan | Me-render komponen halaman yang sesuai dengan URL saat ini |
| `<NuxtLink>` | Komponen Bawaan | Navigasi cerdas dengan auto-prefetching dan active class |
| `<NuxtLayout>` | Komponen Bawaan | Membungkus halaman dengan template layout di `layouts/` |
| `<ClientOnly>` | Komponen Bawaan | Merender slot hanya di sisi browser klien (mencegah SSR crash) |
| `useRoute()` | Composable | Membaca parameter URL (`params`), query string, dan path |
| `useRouter()` | Composable | Navigasi halaman terprogram (`router.push('/dashboard')`) |
| `useSeoMeta()` | Composable | Mengatur tag SEO title, description, dan Open Graph sosial media |
| `definePageMeta()`| Compiler Macro | Menentukan konfigurasi layout dan middleware per halaman |
| `clearError()` | Composable | Membersihkan status error global dan melakukan redirect |

---

<a id="bagian-21"></a>

## 21. ⚡ Cheat Code Nuxt Dasar 10 Detik

```vue
<!-- Template Halaman Standar Nuxt 3 Lengkap -->
<script setup>
// 1. Metadata Layout
definePageMeta({ layout: 'default' })

// 2. SEO Metadata
useSeoMeta({
  title: 'Katalog Produk Nuxt',
  description: 'Daftar produk terbaik toko kami.'
})

// 3. Route Parameter
const route = useRoute()
const count = ref(0)
</script>

<template>
  <div>
    <h1>Halaman Produk #{{ route.params.id || 'Semua' }}</h1>
    <NuxtLink to="/checkout">Lanjut Bayar ➡</NuxtLink>
  </div>
</template>
```

---

<a id="bagian-22"></a>

## 22. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Fundamental SSR & Struktur Folder
├── Pahami perbedaan SSR vs SPA dan rasakan manfaat auto-imports
└── Kuasai file-based routing di pages/ (index.vue, about.vue)
       │
       ▼
Langkah 2: Dynamic Routing & Navigasi
├── Buat rute dinamis pages/items/[id].vue dan tangkap via useRoute()
└── Gunakan <NuxtLink> untuk navigasi instan dengan prefetching
       │
       ▼
Langkah 3: Layouts System & SEO
├── Buat layout bersama di layouts/default.vue dengan <slot />
├── Atur layout kustom via definePageMeta({ layout: 'admin' })
└── Optimasi visibilitas Google via useSeoMeta()
       │
       ▼
Langkah 4: Error Handling & Komponen Khusus
├── Tangani komponen browser via <ClientOnly>
└── Buat halaman penanganan error kustom error.vue (clearError)
       │
       ▼
Langkah 5: Siap Melangkah ke Nuxt Data Fetching (useFetch) & Nitro Server API!
```

---

<a id="bagian-23"></a>

## 23. 🏗️ Mini Project: Production-Ready Corporate Blog & Product Showcase Nuxt Web App

Aplikasi web Nuxt 3 lengkap dan runnable yang mengintegrasikan: **File-Based Routing, Multi-Layouts (Default vs Admin), Dynamic Routes `[id].vue`, `<NuxtLink>` Prefetching, `useSeoMeta()`, Auto-Imports, `<ClientOnly>`, Custom `error.vue`, dan Catch-All `[...slug].vue`**.

##### 1. File Entry Utama (`app.vue`):
```vue
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

##### 2. Layout Default (`layouts/default.vue`):
```vue
<template>
  <div style="font-family: 'Segoe UI', sans-serif; max-width: 900px; margin: 0 auto; padding: 20px;">
    <!-- Navbar Header -->
    <header style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 20px;">
      <h2 style="margin: 0; color: #00dc82;">🟢 NuxtCorp Showcase</h2>
      <nav style="display: flex; gap: 15px;">
        <NuxtLink to="/" style="text-decoration: none; color: #334155; font-weight: bold;">Beranda</NuxtLink>
        <NuxtLink to="/products" style="text-decoration: none; color: #334155; font-weight: bold;">Produk</NuxtLink>
        <NuxtLink to="/admin" style="text-decoration: none; color: #2563eb; font-weight: bold;">Panel Admin 🔒</NuxtLink>
      </nav>
    </header>

    <!-- Slot Konten Halaman -->
    <main style="min-height: 400px;">
      <slot />
    </main>

    <!-- Footer -->
    <footer style="border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 30px; text-align: center; color: #94a3b8; font-size: 14px;">
      Nuxt 3 Universal SSR Enterprise Architecture © 2026
    </footer>
  </div>
</template>
```

##### 3. Layout Admin (`layouts/admin.vue`):
```vue
<template>
  <div style="font-family: 'Segoe UI', sans-serif; display: flex; min-height: 100vh;">
    <aside style="width: 220px; background: #0f172a; color: #fff; padding: 20px;">
      <h3 style="color: #00dc82; margin-top: 0;">⚡ Admin Nuxt</h3>
      <NuxtLink to="/admin" style="color: #fff; display: block; margin-bottom: 10px; text-decoration: none;">Dashboard</NuxtLink>
      <NuxtLink to="/" style="color: #94a3b8; display: block; text-decoration: none;">⬅ Keluar ke Web</NuxtLink>
    </aside>
    <main style="flex: 1; padding: 30px; background: #f8fafc;">
      <slot />
    </main>
  </div>
</template>
```

##### 4. Halaman Beranda (`pages/index.vue`):
```vue
<script setup>
useSeoMeta({
  title: 'Beranda - NuxtCorp Showcase',
  description: 'Solusi website modern berkecepatan tinggi dengan Nuxt 3 dan SSR.',
  ogTitle: 'NuxtCorp Showcase Official'
})

const features = ref([
  'Server-Side Rendering (SSR) Instan',
  'File-Based Routing Otomatis',
  'Auto-Imports Komponen & Composables',
  'SEO & Social Share Ready'
])
</script>

<template>
  <div>
    <h1>Selamat Datang di NuxtCorp!</h1>
    <p>Aplikasi web modern yang menggabungkan performa SSR dengan fleksibilitas Vue 3.</p>

    <h3>Fitur Unggulan Arsitektur:</h3>
    <ul>
      <li v-for="feat in features" :key="feat" style="margin-bottom: 6px;">{{ feat }}</li>
    </ul>

    <!-- Komponen Khusus Client -->
    <ClientOnly fallback="Memuat waktu lokal server...">
      <p style="background: #e0f2fe; color: #0369a1; padding: 10px; border-radius: 6px;">
        🕒 Waktu Browser Klien: <strong>{{ new Date().toLocaleTimeString('id-ID') }}</strong>
      </p>
    </ClientOnly>

    <NuxtLink to="/products" style="display: inline-block; background: #00dc82; color: #000; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 10px;">
      Jelajahi Produk Kami ➡
    </NuxtLink>
  </div>
</template>
```

##### 5. Halaman Katalog Produk (`pages/products/index.vue`):
```vue
<script setup>
useSeoMeta({
  title: 'Katalog Produk - NuxtCorp',
  description: 'Daftar produk teknologi terbaik dari NuxtCorp.'
})

const products = [
  { id: '1', name: 'Nuxt Nitro Cloud Server', price: 2500000 },
  { id: '2', name: 'Vue Dev Mastery Suite', price: 1200000 },
  { id: '3', name: 'Tailwind UI Pro Bundle', price: 850000 }
]
</script>

<template>
  <div>
    <h2>Katalog Produk</h2>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
      <div v-for="p in products" :key="p.id" style="border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; background: #ffffff;">
        <h4 style="margin: 0 0 8px 0;">{{ p.name }}</h4>
        <div style="color: #16a34a; font-weight: bold; margin-bottom: 12px;">
          Rp {{ p.price.toLocaleString('id-ID') }}
        </div>
        <NuxtLink :to="`/products/${p.id}`" style="color: #2563eb; text-decoration: none; font-weight: bold;">
          Lihat Detail 🔎
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
```

##### 6. Halaman Detail Produk Dinamis (`pages/products/[id].vue`):
```vue
<script setup>
const route = useRoute()
const productId = route.params.id

useSeoMeta({
  title: `Detail Produk #${productId} - NuxtCorp`,
  description: `Informasi lengkap mengenai spesifikasi produk ID ${productId}.`
})
</script>

<template>
  <div style="border: 1px solid #e2e8f0; padding: 24px; border-radius: 8px; background: #fff;">
    <NuxtLink to="/products" style="display: inline-block; margin-bottom: 15px; color: #2563eb; text-decoration: none;">
      ⬅ Kembali ke Katalog
    </NuxtLink>
    <h2>Detail Produk #{{ productId }}</h2>
    <p>Spesifikasi teknis produk ID <strong>{{ productId }}</strong> berhasil dimuat secara SSR!</p>
    <button @click="alert('Pesanan berhasil dibuat!')" style="background: #00dc82; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer;">
      Beli Produk Ini
    </button>
  </div>
</template>
```

##### 7. Halaman Admin Dashboard (`pages/admin.vue`):
```vue
<script setup>
// Menggunakan layout khusus admin
definePageMeta({
  layout: 'admin'
})

useSeoMeta({
  title: 'Dashboard Admin - NuxtCorp',
  robots: 'noindex, nofollow' // Cegah Google mengindeks panel admin
})
</script>

<template>
  <div>
    <h2>🔒 Panel Kendali Admin</h2>
    <p>Halaman ini berjalan di atas layout khusus <code>layouts/admin.vue</code>.</p>
    <div style="background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
      <h4>Status Sistem: Normal (100% Uptime SSR Nitro Engine)</h4>
    </div>
  </div>
</template>
```

##### 8. Halaman Error Global (`error.vue`):
```vue
<script setup>
const props = defineProps({
  error: {
    type: Object,
    default: () => ({ statusCode: 404, message: 'Halaman Tidak Ditemukan' })
  }
})

const handleClear = () => clearError({ redirect: '/' })
</script>

<template>
  <div style="text-align: center; padding: 80px 20px; font-family: sans-serif;">
    <h1 style="font-size: 80px; color: #ef4444; margin: 0;">{{ error.statusCode }}</h1>
    <h2>{{ error.statusCode === 404 ? 'Halaman Tidak Ditemukan' : 'Terjadi Kesalahan Server' }}</h2>
    <p style="color: #64748b; margin-bottom: 24px;">{{ error.message }}</p>
    <button @click="handleClear" style="background: #00dc82; color: #000; border: none; padding: 10px 24px; border-radius: 6px; font-weight: bold; cursor: pointer;">
      Kembali ke Beranda
    </button>
  </div>
</template>
```

#### Hasil Output Tampilan Aplikasi

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 🟢 NuxtCorp Showcase          Beranda   Produk   Panel Admin 🔒        │
├────────────────────────────────────────────────────────────────────────┤
│ Selamat Datang di NuxtCorp!                                            │
│ Aplikasi web modern dengan performa SSR dan fleksibilitas Vue 3.       │
│                                                                        │
│ Fitur Unggulan Arsitektur:                                             │
│ • Server-Side Rendering (SSR) Instan                                   │
│ • File-Based Routing Otomatis                                          │
│ • Auto-Imports Komponen & Composables                                  │
│ • SEO & Social Share Ready                                             │
│                                                                        │
│ 🕒 Waktu Browser Klien: 19:56:00 (ClientOnly)                          │
│                                                                        │
│ [ Jelajahi Produk Kami ➡ ]                                             │
├────────────────────────────────────────────────────────────────────────┤
│ Nuxt 3 Universal SSR Enterprise Architecture © 2026                    │
└────────────────────────────────────────────────────────────────────────┘
```

---

<a id="bagian-24"></a>

## 24. 🔗 Referensi Resmi

- [Nuxt 3 Official Documentation (nuxt.com)](https://nuxt.com/)
- [Nuxt Directory Structure Guide](https://nuxt.com/docs/guide/directory-structure/nuxt)
- [Nuxt SEO & Head Management Guide](https://nuxt.com/docs/getting-started/seo-meta)
- [Vue 3 Official Documentation](https://vuejs.org/)
