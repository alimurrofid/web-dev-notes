# Vue Router Cheatsheet Revised

> **Target:** pemula yang sudah memahami dasar Vue 3 (component, template, props, emit, Composition API), lalu ingin belajar routing multi-halaman dengan Vue Router.
>
> Fokus cheatsheet ini: **pengenalan SPA → setup & instalasi → RouterLink & RouterView → routes dasar → route params → matching syntax → query params → programmatic navigation → nested routes → named routes → named views → redirect & alias → props → history modes → lazy loading → meta → navigation guards → router view slot → scroll behavior → dynamic routing → mini project**.
>
> Semua contoh utama menggunakan **Vue 3 + Composition API (`<script setup>`)** dan **Vue Router 4**. API Vue Router 4 menggunakan `createRouter()` dan opsi `history`, bukan sintaks `new Router()` / `mode` lama milik Vue Router 3.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami untuk mulai membuat aplikasi multi-halaman

🟡 Lanjutan
→ pelajari setelah routing dasar dan parameter nyaman

🔴 Advanced / Reference
→ penting ketika kebutuhan aplikasi, proteksi rute, dan performa meningkat
```

Mental model:

```text
       URL di Browser Bar
               │
               │ dicocokkan oleh Router
               ▼
       Route Matching & Params
               │
               │ validasi akses
               ▼
       Navigation Guards
               │
               │ render component yang cocok
               ▼
       <RouterView />
               │
               ▼
       Tampilan UI Terupdate
```

**Hafalan:**

```text
Vue        → membangun komponen antarmuka (UI)
Vue Router → mengatur URL, navigasi, dan perpindahan halaman
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan SPA & Routing](#bagian-1)
2. [Setup & Instalasi Vue Router](#bagian-2)
3. [Komponen Router: RouterLink & RouterView](#bagian-3)
4. [Konfigurasi Routes Dasar](#bagian-4)
5. [Dynamic Route Matching (Route Params)](#bagian-5)
6. [Matching Syntax Lanjutan](#bagian-6)
7. [Query Params & Hash](#bagian-7)
8. [Programmatic Navigation (useRouter)](#bagian-8)

### 🟡 Lanjutan

9. [Nested Routes (Rute Bersarang)](#bagian-9)
10. [Named Routes](#bagian-10)
11. [Named Views](#bagian-11)
12. [Redirect & Alias](#bagian-12)
13. [Passing Props ke Route Component](#bagian-13)
14. [History Modes](#bagian-14)
15. [Lazy Loading Routes](#bagian-15)
16. [Route Meta Fields](#bagian-16)
17. [Navigation Guards (Proteksi Rute)](#bagian-17)
18. [RouterView Slot, Transition & KeepAlive](#bagian-18)
19. [Scroll Behavior](#bagian-19)
20. [Dynamic Routing](#bagian-20)

### 🔴 Advanced / Reference

21. [Navigation Failure Handling](#bagian-21)
22. [Peta Ingatan Cepat](#bagian-22)
23. [Tabel Ringkasan](#bagian-23)
24. [Cheat Code Vue Router 10 Detik](#bagian-24)
25. [Urutan Belajar yang Disarankan](#bagian-25)
26. [Mini Project: Portal Dashboard Pengguna](#bagian-26)
27. [Referensi Resmi](#bagian-27)

---

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan SPA & Routing

## Konsep

**SPA (Single Page Application)** adalah aplikasi web yang hanya memuat satu file HTML utama (`index.html`) lalu mengganti tampilan komponen secara dinamis berdasarkan URL tanpa melakukan *full page reload* (layar putih berkedip).

## Perbandingan: Web Tradisional vs Vue Router SPA

### Web Tradisional (Multi-Page Reload)

```text
       Pengguna Klik Link
               │
               │ browser request file baru ke server
               ▼
       Server Memproses & Mengirim HTML Baru
               │
               │ browser memuat ulang seluruh halaman
               ▼
       Full Page Reload (Layar Putih Berkedip)
```

### Vue Router SPA (Instant Client-Side Navigation)

```text
       Pengguna Klik <RouterLink>
               │
               │ router mencegat event klik di browser
               ▼
       URL di Address Bar Berubah
               │
               │ router mencocokkan route path
               ▼
       Komponen Halaman Ditukar di dalam <RouterView />
               │
               ▼
       UI Berubah Instan Tanpa Reload Server
```

## Struktur Aplikasi Vue Router

```text
       App.vue (Layout Utama)
          │
          │ <RouterView />
          ▼
       ┌───────────────────────────────┐
       │ /         ──> HomeView.vue    │
       │ /about    ──> AboutView.vue   │
       │ /users/10 ──> UserView.vue    │
       └───────────────────────────────┘
```

**Hafalan:**

```text
Router menghubungkan: URL di browser ──> Komponen Vue yang dirender
```

**Best Practice:** Gunakan `<RouterLink>` untuk navigasi internal aplikasi. Jangan gunakan `<a href>` biasa karena akan memicu *full page reload* yang merusak pengalaman SPA.

---

<a id="bagian-2"></a>

# 2. 🟢 Setup & Instalasi Vue Router

## Konsep

Vue Router diinstal melalui package manager dan didaftarkan sebagai plugin ke aplikasi Vue menggunakan `createRouter()` dan `app.use(router)`.

## 1. Instalasi

Jalankan perintah di terminal:

```bash
npm install vue-router
```

## 2. Membuat Konfigurasi Router (`src/router/index.js`)

```js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
```

## 3. Daftarkan di Entry Point (`src/main.js`)

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// Pasang router sebelum mount
app.use(router)

app.mount('#app')
```

## Diagram Alur Setup

```text
       createApp(App)
             │
             │ buat aplikasi Vue
             ▼
       createRouter({ history, routes })
             │
             │ inisialisasi konfigurasi router
             ▼
       app.use(router)
             │
             │ daftarkan plugin router
             ▼
       app.mount('#app')
             │
             ▼
       Aplikasi Siap Melakukan Routing
```

**Hafalan:**

```text
createRouter() → app.use(router) → pasang <RouterView /> di App.vue
```

---

<a id="bagian-3"></a>

# 3. 🟢 Komponen Router: RouterLink & RouterView

## Konsep

Vue Router menyediakan dua komponen global utama:
1. **`<RouterLink>`**: Komponen navigasi deklaratif (menggantikan tag `<a>`).
2. **`<RouterView>`**: Wadah tempat komponen rute ditampilkan sesuai URL aktif.

## Contoh Penggunaan (`src/App.vue`)

```html
<template>
  <div id="app">
    <nav class="navbar">
      <RouterLink to="/">Beranda</RouterLink>
      <RouterLink to="/about">Tentang Kami</RouterLink>
    </nav>

    <main class="content">
      <!-- Komponen rute akan dirender di sini -->
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* Kelas CSS otomatis untuk link yang sedang aktif */
.router-link-active {
  font-weight: bold;
  color: #42b883;
}
.router-link-exact-active {
  border-bottom: 2px solid #42b883;
}
</style>
```

## Diagram Alur Navigasi

```text
       Klik <RouterLink to="/about">
                       │
                       │ ubah URL tanpa reload
                       ▼
             Address Bar: /about
                       │
                       │ router mencocokkan path
                       ▼
           AboutView Dimuat di <RouterView />
```

## Kelas CSS Otomatis pada RouterLink

Vue Router secara otomatis menambahkan kelas CSS pada `<RouterLink>` yang aktif:
- `router-link-active`: Aktif jika URL saat ini mengandung path tujuan (misal `/about` cocok dengan `/about/team`).
- `router-link-exact-active`: Aktif **hanya jika** URL saat ini persis 100% sama dengan atribut `to`.

**Hafalan:**

```text
RouterLink → tombol pindah halaman (menggantikan <a>)
RouterView → slot penampil halaman rute aktif
```

---

<a id="bagian-4"></a>

# 4. 🟢 Konfigurasi Routes Dasar

## Konsep

Array `routes` mendefinisikan pemetaan antara alamat URL (`path`) dan komponen Vue (`component`) yang akan ditampilkan.

## Contoh Konfigurasi Rute

```js
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ContactView from '@/views/ContactView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
  { path: '/contact', component: ContactView },

  // Catch-all route untuk halaman 404 (Not Found)
  { path: '/:pathMatch(.*)*', component: NotFoundView },
]
```

## Output Alur

```text
Buka URL: /         ──> Merender HomeView
Buka URL: /about    ──> Merender AboutView
Buka URL: /contact  ──> Merender ContactView
Buka URL: /ngawur   ──> Merender NotFoundView (404)
```

## Diagram Penanganan 404

```**text**
       URL yang Diminta Pengguna
                   │
                   │ cocok dengan salah satu route?
         ┌─────────┴─────────┐
         │ YA                │ TIDAK
         ▼                   ▼
    Halaman Terkait    /:pathMatch(.*)*
                         │
                         ▼
                   NotFoundView (404)
```

**Hafalan:**

```text
path: '/' ──> URL tujuan
component: NamaView ──> Komponen yang dirender
/:pathMatch(.*)* ──> Penampung halaman 404
```

**Best Practice:** Selalu letakkan route 404 `/:pathMatch(.*)*` di baris paling akhir array `routes`.

---

<a id="bagian-5"></a>

# 5. 🟢 Dynamic Route Matching (Route Params)

## Konsep

Ketika sebuah rute memiliki bagian dinamis (seperti ID pengguna atau slug artikel), gunakan tanda titik dua `:` untuk mendefinisikan **Route Params**.

## Contoh Konfigurasi

```js
const routes = [
  // :id adalah parameter dinamis
  { path: '/users/:id', component: () => import('@/views/UserDetailView.vue') },
]
```

## Membaca Parameter di Komponen (`UserDetailView.vue`)

Gunakan fungsi `useRoute()` dari `vue-router` untuk membaca data URL aktif:

```html
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

// Membaca nilai param id
console.log('ID User:', route.params.id)
</script>

<template>
  <div class="user-detail">
    <h1>Profil Pengguna #{{ route.params.id }}</h1>
  </div>
</template>
```

## Output

```text
Akses URL: /users/42   ──> Tampilan: "Profil Pengguna #42"
Akses URL: /users/andi ──> Tampilan: "Profil Pengguna #andi"
```

## Diagram Alur Route Params

```text
       URL: /users/42
             │
             │ router mengekstrak bagian dinamis
             ▼
       route.params = { id: '42' }
             │
             │ dibaca di komponen
             ▼
       Template: <h1>Profil Pengguna #42</h1>
```

**Hafalan:**

```text
path: '/users/:id' ──> dibaca melalui route.params.id
```

---

<a id="bagian-6"></a>

# 6. 🟢 Matching Syntax Lanjutan

## Konsep

Vue Router 4 mendukung sintaks pencocokan rute yang fleksibel menggunakan *optional params*, *custom regex*, dan *repeatable params*.

## 1. Optional Param (`:param?`)

Tambahkan tanda tanya `?` jika parameter boleh ada atau tidak ada:

```js
// Cocok untuk /users dan /users/10
{ path: '/users/:id?', component: UserView }
```

## 2. Custom Regex Param (`:param(pattern)`)

Batasi format parameter agar hanya cocok dengan pola tertentu (misal hanya angka):

```js
// Hanya cocok jika :id berupa angka (digit)
{ path: '/products/:id(\\d+)', component: ProductView }
```

```text
/products/123  ──> Cocok (Halaman ProductView dirender)
/products/sepatu ──> Tidak cocok (Dilewati ke rute berikutnya / 404)
```

## 3. Repeatable Param (`:param+` atau `:param*`)

Gunakan `+` (minimal 1 segmen) atau `*` (0 atau lebih segmen) untuk menangkap path bersarang:

```js
// Cocok untuk /files/dokumen/2026/laporan.pdf
{ path: '/files/:chapters+', component: FileView }
```

Hasil ekstraksi:

```js
route.params.chapters // ['dokumen', '2026', 'laporan.pdf']
```

## Ringkasan Sintaks Matching

```text
/users/:id        ──> Wajib ada 1 nilai
/users/:id?       ──> Opsional (boleh kosong)
/users/:id(\\d+)   ──> Wajib berupa angka
/files/:path+     ──> Berulang (1 atau lebih segmen jadi array)
/:pathMatch(.*)*  ──> Catch-all seluruh URL (404)
```

**Hafalan:**

```text
? = opsional, (\\d+) = hanya angka, + / * = repeatable segmen
```

---

<a id="bagian-7"></a>

# 7. 🟢 Query Params & Hash

## Konsep

Selain parameter path, URL sering kali membawa data tambahan berupa **Query Params** (`?key=value`) dan **Hash** (`#section`). Query dan hash bersifat opsional dan tidak mengubah struktur pencocokan rute.

## Perbedaan Anatomi URL

```text
https://example.com/products/10?category=laptop&sort=asc#spesifikasi
                    │          │                         │
                    │          │                         └── Hash: route.hash ('#spesifikasi')
                    │          └──────────────────────────── Query: route.query.category ('laptop')
                    └─────────────────────────────────────── Path: route.params.id ('10')
```

## Membaca Query dan Hash di Komponen

```html
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

console.log('Path Param:', route.params.id)    // '10'
console.log('Kategori:', route.query.category)  // 'laptop'
console.log('Urutan:', route.query.sort)        // 'asc'
console.log('Hash ID:', route.hash)             // '#spesifikasi'
</script>

<template>
  <div>
    <p>Menampilkan produk kategori: {{ route.query.category }}</p>
  </div>
</template>
```

## Navigasi dengan Query & Hash

```html
<RouterLink :to="{ path: '/products/10', query: { category: 'laptop' }, hash: '#spesifikasi' }">
  Lihat Spesifikasi Laptop
</RouterLink>
```

**Hafalan:**

```text
/users/:id ──> route.params (struktur rute)
?tab=desc  ──> route.query (filter / pencarian)
#reviews   ──> route.hash (posisi anchor elemen)
```

---

<a id="bagian-8"></a>

# 8. 🟢 Programmatic Navigation (useRouter)

## Konsep

Selain navigasi deklaratif menggunakan `<RouterLink>`, kita dapat berpindah halaman melalui kode JavaScript (misal setelah tombol submit form diklik) menggunakan fungsi **`useRouter()`**.

## Perbedaan Vital: `useRouter()` vs `useRoute()`

```text
       ┌───────────────────────────────────────────────────────────┐
       │                Perbedaan useRouter vs useRoute            │
       ├─────────────────────────────┬─────────────────────────────┤
       │ useRouter()                 │ useRoute()                  │
       ├─────────────────────────────┼─────────────────────────────┤
       │ Objek CONTROLLER navigasi   │ Objek SNAPSHOT data rute    │
       │ Digunakan untuk BERPINDAH   │ Digunakan untuk MEMBACA     │
       │ router.push('/about')       │ route.params.id             │
       │ router.replace('/login')    │ route.query.search          │
       │ router.back() / router.go() │ route.path / route.meta     │
       └─────────────────────────────┴─────────────────────────────┘
```

## Contoh Metode Navigasi

```html
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function handleLoginSuccess() {
  // 1. Pindah ke halaman baru (menambah riwayat history browser)
  router.push('/dashboard')

  // 2. Navigasi dengan object & params
  // router.push({ name: 'user-profile', params: { id: '42' } })

  // 3. Ganti halaman saat ini tanpa menambah history (user tidak bisa klik tombol 'Back' browser)
  // router.replace('/home')

  // 4. Navigasi riwayat history
  // router.back() // Mundur 1 halaman
  // router.forward() // Maju 1 halaman
  // router.go(-2) // Mundur 2 halaman
}
</script>

<template>
  <button @click="handleLoginSuccess">Login & Masuk Dashboard</button>
</template>
```

**Hafalan:**

```text
router.push('/path')    → pindah halaman (ada history)
router.replace('/path') → timpa halaman saat ini (tanpa history)
router.back()           → kembali ke halaman sebelumnya
```

---

<a id="bagian-9"></a>

# 9. 🟡 Nested Routes (Rute Bersarang)

## Konsep

Aplikasi modern sering kali memiliki tata letak bertingkat (misal: halaman Dashboard yang memiliki sidebar tetap, dan area konten tengah berganti-ganti antara Profile, Settings, dan Analytics).

Pola ini dibangun menggunakan **Nested Routes** dengan properti `children`.

## Konfigurasi Nested Routes

```js
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/DashboardLayout.vue'),
    children: [
      // URL: /dashboard
      { path: '', component: () => import('@/views/DashboardHome.vue') },
      // URL: /dashboard/profile
      { path: 'profile', component: () => import('@/views/DashboardProfile.vue') },
      // URL: /dashboard/settings
      { path: 'settings', component: () => import('@/views/DashboardSettings.vue') },
    ],
  },
]
```

## Komponen Induk (`DashboardLayout.vue`)

Komponen induk **wajib memiliki `<RouterView />`** untuk merender anak komponennya:

```html
<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <RouterLink to="/dashboard">Ringkasan</RouterLink>
      <RouterLink to="/dashboard/profile">Profil Saya</RouterLink>
      <RouterLink to="/dashboard/settings">Pengaturan</RouterLink>
    </aside>

    <main class="dashboard-content">
      <!-- Komponen anak (children) akan dirender di sini -->
      <RouterView />
    </main>
  </div>
</template>
```

## Diagram Alur Nested Routes

```text
       URL: /dashboard/profile
                  │
                  ▼
       DashboardLayout.vue (Parent)
                  │
                  │ <RouterView /> internal
                  ▼
       DashboardProfile.vue (Child)
```

**Hafalan:**

```text
children: [ { path: 'sub-path', component: ChildView } ]
Parent wajib menyertakan <RouterView /> untuk merender child.
```

**Kesalahan Umum:**

❌ Menulis path anak dengan awalan slash `/` (misal: `path: '/profile'` di dalam children). Path yang diawali `/` akan dianggap sebagai root URL absolut!  
✅ Tulis tanpa awalan slash: `path: 'profile'`.

---

<a id="bagian-10"></a>

# 10. 🟡 Named Routes

## Konsep

**Named Routes** adalah memberikan nama unik (`name`) pada konfigurasi rute. Menggunakan nama jauh lebih aman dan fleksibel daripada menulis string path URL secara manual di banyak komponen.

## Keuntungan Named Routes

- Jika path URL berubah (misal dari `/pengguna/:id` menjadi `/members/:id`), kita hanya perlu mengubah 1 file router saja tanpa harus mengedit ratusan komponen lain.
- Menghindari kesalahan ketik (*typo*) pada URL yang panjang.

## Konfigurasi

```js
const routes = [
  {
    path: '/user-profile-account/:userId',
    name: 'user-detail',
    component: UserDetailView,
  },
]
```

## Cara Pemakaian

### 1. Di Template (`<RouterLink>`)

```html
<RouterLink :to="{ name: 'user-detail', params: { userId: '123' } }">
  Lihat Profil
</RouterLink>
```

### 2. Di Script (`router.push`)

```js
router.push({
  name: 'user-detail',
  params: { userId: '123' },
  query: { tab: 'settings' },
})
```

**Hafalan:**

```text
name: 'namaUnik' → :to="{ name: 'namaUnik', params: { id: 1 } }"
```

---

<a id="bagian-11"></a>

# 11. 🟡 Named Views

## Konsep

Secara default, satu `<RouterView />` merender satu komponen. Namun, jika Anda memiliki tata letak dengan beberapa area independen (misalnya: Header, Sidebar, dan Main Content yang berbeda-beda per rute), Anda dapat menggunakan **Named Views**.

## Konfigurasi Router

Gunakan properti `components` (jamak), bukan `component`:

```js
const routes = [
  {
    path: '/dashboard',
    components: {
      default: MainContent,
      sidebar: AppSidebar,
      header: AppHeader,
    },
  },
]
```

## Template Layout (`App.vue`)

```html
<template>
  <div class="layout">
    <!-- Named View: header -->
    <RouterView name="header" />

    <div class="body">
      <!-- Named View: sidebar -->
      <RouterView name="sidebar" />

      <!-- Default View (tanpa atribut name) -->
      <RouterView />
    </div>
  </div>
</template>
```

## Diagram Named Views

```text
       URL: /dashboard
              │
              ├──────> <RouterView name="header" />  ──> AppHeader.vue
              ├──────> <RouterView name="sidebar" /> ──> AppSidebar.vue
              └──────> <RouterView /> (default)     ──> MainContent.vue
```

**Hafalan:**

```text
components: { default: A, sidebar: B } ──> <RouterView name="sidebar" />
```

---

<a id="bagian-12"></a>

# 12. 🟡 Redirect & Alias

## Konsep

- **Redirect**: Ketika pengguna membuka URL A, router otomatis mengarahkan browser ke URL B.
- **Alias**: URL A dan URL B menampilkan komponen yang sama persis tanpa mengubah alamat URL di browser.

## 1. Redirect

```js
const routes = [
  // Redirect string sederhana
  { path: '/home', redirect: '/' },

  // Redirect ke Named Route
  { path: '/profile', redirect: { name: 'user-profile' } },

  // Dynamic Redirect berbasis fungsi
  {
    path: '/users',
    redirect: (to) => {
      return { path: '/members', query: { from: to.path } }
    },
  },
]
```

## 2. Alias

```js
const routes = [
  {
    path: '/users',
    component: UserListView,
    // /members dan /people akan menampilkan UserListView dengan URL tetap
    alias: ['/members', '/people'],
  },
]
```

**Hafalan:**

```text
redirect: '/tujuan' ──> URL browser berubah ke tujuan baru
alias: '/nama-lain' ──> URL tetap nama lain, tapi komponen yang dimuat sama
```

---

<a id="bagian-13"></a>

# 13. 🟡 Passing Props ke Route Component

## Konsep

Daripada komponen rute membaca `$route.params.id` secara langsung (yang membuat komponen terikat erat dengan Vue Router), kita dapat mengaktifkan **`props: true`**. Hal ini membuat komponen bersifat murni (*decoupled*) dan mudah diuji secara independen.

## 1. Boolean Mode (`props: true`)

```js
const routes = [
  {
    path: '/users/:id',
    component: UserDetailView,
    props: true, // Otomatis mengoper route.params sebagai props komponen
  },
]
```

Di dalam Komponen (`UserDetailView.vue`):

```html
<script setup>
// Menerima param langsung sebagai prop standar Vue!
defineProps({
  id: String,
})
</script>

<template>
  <h1>Pengguna ID: {{ id }}</h1>
</template>
```

## 2. Function Mode (`props: (route) => ({ ... })`)

Gunakan fungsi jika ingin menggabungkan query params atau melakukan casting tipe:

```js
{
  path: '/search',
  component: SearchView,
  props: (route) => ({ query: route.query.q, page: Number(route.query.page) || 1 }),
}
```

**Hafalan:**

```text
props: true ──> route.params otomatis diterima via defineProps()
```

---

<a id="bagian-14"></a>

# 14. 🟡 History Modes

## Konsep

Vue Router 4 menyediakan tiga mode riwayat navigasi (*history modes*) yang dipilih saat membuat router melalui opsi `history`.

## Perbandingan 3 History Mode

| Mode | Fungsi Pembuat | Format URL | Kebutuhan Konfigurasi Server |
|---|---|---|---|
| **HTML5 History** (Direkomendasikan) | `createWebHistory()` | `example.com/about` | **Wajib** URL rewrite ke `index.html` |
| **Hash Mode** | `createWebHashHistory()` | `example.com/#/about` | Tidak perlu konfigurasi server |
| **Memory Mode** | `createMemoryHistory()` | Tidak tampil di browser | Untuk SSR / Testing / Node.js |

## Contoh Konfigurasi HTML5 Mode

```js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  // Menghasilkan URL bersih dan modern tanpa tanda pagar #
  history: createWebHistory(),
  routes,
})
```

**Penting:** Pada mode `createWebHistory()`, jika pengguna menekan tombol refresh (F5) pada URL `/about`, server web (Nginx/Apache) harus dikonfigurasi untuk mengembalikan `index.html`, jika tidak maka akan terjadi error 404 dari web server.

**Hafalan:**

```text
createWebHistory()     → URL bersih standar modern (SPA produksi)
createWebHashHistory() → URL dengan tanda # (demo tanpa setting server)
createMemoryHistory()  → URL di memori (testing & SSR)
```

---

<a id="bagian-15"></a>

# 15. 🟡 Lazy Loading Routes

## Konsep

Secara default, jika semua komponen diimpor di awal file (`import Home from './Home.vue'`), seluruh kode halaman akan digabungkan menjadi satu file JavaScript raksasa.

Dengan **Lazy Loading** (Dynamic Import), kode sebuah halaman hanya akan diunduh oleh browser saat pengguna benar-benar membuka rute tersebut. Hal ini membuat waktu muat awal aplikasi (*initial load time*) jauh lebih cepat.

## Cara Penulisan

```js
const routes = [
  // Halaman utama dimuat langsung (eager)
  { path: '/', component: HomeView },

  // Halaman lain diimpor secara dinamis saat dibuka (lazy loaded)
  {
    path: '/about',
    component: () => import('@/views/AboutView.vue'),
  },
  {
    path: '/admin',
    component: () => import('@/views/AdminDashboard.vue'),
  },
]
```

## Diagram Alur Lazy Loading

```text
       Aplikasi Pertama Kali Dibuka
                     │
                     ▼
       Browser Hanya Mengunduh: Bundle Utama (HomeView)
                     │
                     │ pengguna klik /admin
                     ▼
       Browser Mengunduh Chunk Khusus: AdminDashboard.js
                     │
                     ▼
       Halaman Admin Dirender
```

**Hafalan:**

```text
component: () => import('@/views/NamaView.vue') ──> kode diunduh saat dibutuhkan
```

---

<a id="bagian-16"></a>

# 16. 🟡 Route Meta Fields

## Konsep

Properti `meta` memungkinkan kita menyematkan data kustom ke dalam konfigurasi rute, seperti penanda bahwa rute butuh login (`requiresAuth: true`), level hak akses (`role: 'admin'`), atau judul halaman (`title: 'Profil'`).

## Konfigurasi

```js
const routes = [
  {
    path: '/admin/settings',
    component: AdminSettingsView,
    meta: {
      requiresAuth: true,
      role: 'admin',
      title: 'Pengaturan Admin',
    },
  },
]
```

## Membaca Meta

Meta dapat dibaca dari objek `route.meta` di komponen maupun di dalam Navigation Guard:

```js
// Di Navigation Guard
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !userIsLoggedIn()) {
    return { path: '/login' }
  }
})
```

**Hafalan:**

```text
meta: { key: value } ──> data kustom rute untuk auth, title, atau role
```

---

<a id="bagian-17"></a>

# 17. 🟡 Navigation Guards (Proteksi Rute)

## Konsep

**Navigation Guards** adalah mekanisme untuk mengontrol, membatasi, atau mengarahkan navigasi rute (misalnya: mencegah pengguna masuk halaman dashboard jika belum login).

## Alur Urutan Eksekusi Guard

```text
       Navigasi Dimulai (User klik link)
                     │
                     ▼
       1. Global Guard (router.beforeEach)
                     │
                     ▼
       2. Route Guard (beforeEnter di rute tujuan)
                     │
                     ▼
       3. In-Component Guard (onBeforeRouteUpdate / Leave)
                     │
                     ▼
       4. Global Resolve (router.beforeResolve)
                     │
                     ▼
       Navigasi Disetujui ──> Komponen Dirender
                     │
                     ▼
       5. Global After Hook (router.afterEach)
```

## 1. Global Before Guard (`router.beforeEach`)

Di Vue Router 4, gunakan nilai pengembalian (*return value*):
- `return false`: Batalkan navigasi.
- `return { name: 'login' }` atau `return '/login'`: Alihkan ke rute lain.
- `return true` atau tanpa return: Izinkan navigasi lanjut.

```js
router.beforeEach((to, from) => {
  const isAuthenticated = checkUserToken()

  // Periksa apakah halaman membutuhkan autentikasi
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Alihkan ke login beserta query halaman asal
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})
```

## 2. Per-Route Guard (`beforeEnter`)

Didefinisikan langsung di dalam objek route:

```js
{
  path: '/admin',
  component: AdminView,
  beforeEnter: (to, from) => {
    if (!isAdminUser()) return { path: '/unauthorized' }
  },
}
```

## 3. In-Component Guard (Composition API)

Vue Router menyediakan hook yang dapat dipanggil langsung di `<script setup>`:

```html
<script setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

// Dipanggil saat pengguna ingin meninggalkan halaman (misal: form belum disimpan)
onBeforeRouteLeave((to, from) => {
  const answer = window.confirm('Perubahan Anda belum disimpan! Yakin ingin pergi?')
  if (!answer) return false // Batalkan navigasi
})

// Dipanggil saat parameter rute berubah tapi komponennya sama (misal /users/1 -> /users/2)
onBeforeRouteUpdate(async (to, from) => {
  console.log('ID Baru:', to.params.id)
})
</script>
```

**Hafalan:**

```text
beforeEach() ──> guard global untuk seluruh rute aplikasi
return false ──> batalkan navigasi
return '/login' ──> redirect rute
```

---

<a id="bagian-18"></a>

# 18. 🟡 RouterView Slot, Transition & KeepAlive

## Konsep

Di Vue 3, untuk menerapkan **animasi transisi antar-halaman** (`<transition>`) atau **menyimpan cache keadaan halaman** (`<keep-alive>`), kita wajib menggunakan sintaks **Scoped Slot** `<RouterView v-slot="{ Component }">`.

## Contoh Lengkap di `App.vue`

```html
<template>
  <div class="app-container">
    <Navbar />

    <!-- Menggunakan v-slot untuk mengakses komponen aktif -->
    <RouterView v-slot="{ Component, route }">
      <Transition name="fade" mode="out-in">
        <KeepAlive :include="['ProductListView']">
          <!-- Komponen dinamis yang dirender -->
          <component :is="Component" :key="route.path" />
        </KeepAlive>
      </Transition>
    </RouterView>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

## Diagram Alur Slot Rendering

```text
       <RouterView v-slot="{ Component, route }">
                          │
                          ▼
             <Transition name="fade">
                          │
                          ▼
              <KeepAlive include="...">
                          │
                          ▼
            <component :is="Component" />
```

**Hafalan:**

```text
<RouterView v-slot="{ Component }">
  <Transition>
    <KeepAlive>
      <component :is="Component" />
    </KeepAlive>
  </Transition>
</RouterView>
```

---

<a id="bagian-19"></a>

# 19. 🟡 Scroll Behavior

## Konsep

Opsi `scrollBehavior` mengatur posisi scroll halaman secara otomatis setiap kali pengguna berpindah rute (misalnya: selalu kembali ke paling atas, atau mempertahankan posisi scroll saat menekan tombol *Back* browser).

## Contoh Konfigurasi

```js
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 1. Jika tombol Back/Forward browser ditekan, kembalikan ke posisi scroll sebelumnya
    if (savedPosition) {
      return savedPosition
    }

    // 2. Jika rute memiliki anchor hash (misal #spesifikasi), scroll ke elemen tersebut
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }

    // 3. Default: selalu scroll ke koordinat paling atas halaman
    return { top: 0 }
  },
})
```

**Hafalan:**

```text
scrollBehavior: (to, from, savedPosition) => savedPosition || { top: 0 }
```

---

<a id="bagian-20"></a>

# 20. 🟡 Dynamic Routing

## Konsep

Vue Router memungkinkan penambahan atau penghapusan rute secara dinamis saat aplikasi sedang berjalan (runtime). Fitur ini sangat berguna untuk aplikasi berbasis izin (*RBAC*), di mana menu admin baru ditambahkan ke router setelah pengguna berhasil login sebagai admin.

## API Dynamic Routing

```js
// 1. Menambahkan rute baru saat runtime
router.addRoute({
  path: '/super-admin',
  name: 'super-admin',
  component: () => import('@/views/SuperAdminView.vue'),
})

// 2. Menambahkan rute anak ke rute induk yang sudah ada
router.addRoute('dashboard', {
  path: 'vip',
  component: () => import('@/views/VipView.vue'),
})

// 3. Menghapus rute berdasarkan nama
router.removeRoute('super-admin')

// 4. Memeriksa keberadaan rute
router.hasRoute('super-admin') // true / false

// 5. Mengambil seluruh daftar rute aktif
router.getRoutes()
```

**Hafalan:**

```text
router.addRoute(routeObj) ──> tambah rute secara dinamis saat runtime
router.removeRoute('name') ──> hapus rute dari router
```

---

<a id="bagian-21"></a>

# 21. 🔴 Navigation Failure Handling

## Konsep

Navigasi programmatic (`router.push`) dapat dibatalkan atau dialihkan oleh Navigation Guard. Vue Router menyediakan helper untuk mendeteksi apakah navigasi sukses atau mengalami kegagalan.

## Mendeteksi Kegagalan Navigasi

```js
import { isNavigationFailure, NavigationFailureType } from 'vue-router'

async function navigateToAdmin() {
  const failure = await router.push('/admin')

  if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
    console.warn('Navigasi dibatalkan oleh guard atau pengguna!')
  } else if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
    console.info('Navigasi dialihkan ke rute lain oleh guard!')
  }
}
```

## Tipe-Tipe Navigation Failure

```text
aborted    ──> Navigasi dibatalkan (misal: return false di guard)
cancelled  ──> Navigasi baru dimulai sebelum navigasi sebelumnya selesai
redirected ──> Guard mengembalikan alamat pengalihan baru
```

**Hafalan:**

```text
const failure = await router.push('/path')
isNavigationFailure(failure, NavigationFailureType.aborted)
```

---

<a id="bagian-22"></a>

# 22. 🧠 Peta Ingatan Cepat

## A. Alur Keseluruhan Vue Router

```text
       Klik <RouterLink> / router.push()
                       │
                       ▼
            Eksekusi Navigation Guard
             (beforeEach / beforeEnter)
                       │
             ┌─────────┴─────────┐
             │ Lolos             │ Batal / Redirect
             ▼                   ▼
       Router Matching     Navigasi Dialihkan
             │
             ▼
       Ekstraksi Params & Query
             │
             ▼
       Render di <RouterView />
             │
             ▼
       DOM Komponen Tampil di Layar
```

## B. Anatomi URL & Pembacaan Data

```text
URL: https://app.com/products/42?category=elektronik#fitur
                     │          │                    │
                     ▼          ▼                    ▼
             route.params.id  route.query.category  route.hash
```

## C. Perbandingan useRouter vs useRoute

```text
       ┌─────────────────────────┐     ┌─────────────────────────┐
       │       useRouter()       │     │       useRoute()        │
       ├─────────────────────────┤     ├─────────────────────────┤
       │ .push('/dashboard')     │     │ .params.id              │
       │ .replace('/login')      │     │ .query.tab              │
       │ .back() / .go(-1)       │     │ .meta.requiresAuth      │
       │ .addRoute({ ... })      │     │ .fullPath               │
       └─────────────────────────┘     └─────────────────────────┘
```

## D. Alur Nested Routes

```text
       /dashboard/profile
               │
               ▼
       DashboardLayout.vue (Parent)
               │
               │ <RouterView />
               ▼
       DashboardProfile.vue (Child)
```

---

<a id="bagian-23"></a>

# 23. 📚 Tabel Ringkasan

| Konsep / API | Fungsi Utama | Contoh Sintaks |
|---|---|---|
| `createRouter()` | Membuat instance router untuk aplikasi Vue 3 | `createRouter({ history, routes })` |
| `createWebHistory()` | Mode HTML5 History bersih tanpa tanda pagar `#` | `history: createWebHistory()` |
| `<RouterLink>` | Komponen navigasi deklaratif (link internal) | `<RouterLink to="/about">Tentang</RouterLink>` |
| `<RouterView>` | Slot tempat komponen rute aktif dirender | `<RouterView />` |
| `useRouter()` | Objek pemandu untuk aksi navigasi di JavaScript | `const router = useRouter(); router.push('/home')` |
| `useRoute()` | Objek snapshot pembaca data URL aktif saat ini | `const route = useRoute(); console.log(route.params.id)` |
| `route.params` | Mengambil parameter dinamis dari URL | `route.params.id` |
| `route.query` | Mengambil parameter query string | `route.query.search` |
| `children: []` | Mendefinisikan rute bertingkat (*nested routes*) | `children: [{ path: 'profile', component: Profile }]` |
| `name` | Memberikan nama unik pada rute (*named routes*) | `{ path: '/user/:id', name: 'user-detail' }` |
| `props: true` | Mengirimkan route params sebagai props komponen | `props: true` |
| `() => import()` | Memuat komponen rute secara dinamis (*lazy loading*) | `component: () => import('@/views/About.vue')` |
| `meta: {}` | Menyimpan metadata kustom rute | `meta: { requiresAuth: true }` |
| `beforeEach()` | Guard global untuk memvalidasi dan memproteksi rute | `router.beforeEach((to) => { if(!auth) return '/login' })` |
| `scrollBehavior` | Mengontrol posisi scroll halaman saat berpindah rute | `scrollBehavior(to, from, saved) { return { top: 0 } }` |

---

<a id="bagian-24"></a>

# 24. ⚡ Cheat Code Vue Router 10 Detik

```text
createRouter()       → Membuat instance router
createWebHistory()   → Mode URL bersih tanpa #
<RouterLink to="...">→ Link pindah halaman
<RouterView />       → Tempat tampil halaman rute
useRouter()          → Pindah rute via script (router.push)
useRoute()           → Baca data rute (params, query, meta)
:param               → Parameter dinamis path
props: true          → Terima params sebagai props
children: []         → Rute bertingkat (nested route)
beforeEach()         → Guard proteksi auth rute
```

Contekan Cepat 1 File:

```html
<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

function handleGoToDetail(id) {
  router.push({ name: 'detail', params: { id } })
}
</script>

<template>
  <div>
    <p>Halaman Saat Ini: {{ route.fullPath }} (ID: {{ route.params.id }})</p>
    <button @click="handleGoToDetail(99)">Buka Detail #99</button>
  </div>
</template>
```

---

<a id="bagian-25"></a>

# 25. 🧭 Urutan Belajar yang Disarankan

```text
1. 🟢 Fundamental Routing
   ├─ Pahami konsep SPA & perbedaan link biasa vs RouterLink
   ├─ Setup createRouter() dan createWebHistory() di main.js
   ├─ Membuat routes dasar dan halaman 404 catch-all
   ├─ Membaca Route Params (:id) dan Query Params (?q=)
   └─ Menggunakan useRouter() untuk navigasi programmatic
2. 🟡 Routing Lanjutan & Tata Letak
   ├─ Menyusun Nested Routes (children) untuk dashboard bertingkat
   ├─ Menerapkan Named Routes dan Named Views
   ├─ Mengaktifkan props: true pada komponen rute
   ├─ Memahami History Modes (HTML5 vs Hash)
   └─ Mengoptimalkan performa dengan Lazy Loading (() => import())
3. 🔴 Proteksi & Animasi Rute
   ├─ Menyematkan Route Meta Fields (meta: { requiresAuth })
   ├─ Mengamankan rute dengan Navigation Guards (beforeEach)
   ├─ Membuat animasi transisi dengan RouterView Scoped Slot
   ├─ Mengatur posisi Scroll Behavior
   └─ Mengerjakan Mini Project Terpadu
```

---

<a id="bagian-26"></a>

# 26. 🏗️ Mini Project: Portal Dashboard Pengguna

Mini project ini menggabungkan: **Nested Routes, Route Params, Named Routes, Props Mode, Route Meta, dan Navigation Auth Guard**.

## 1. Konfigurasi Router (`src/router/index.js`)

```js
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardLayout from '@/views/DashboardLayout.vue'
import UserProfile from '@/views/UserProfile.vue'
import UserPosts from '@/views/UserPosts.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/dashboard/:id',
    name: 'dashboard',
    component: DashboardLayout,
    props: true, // id dioper sebagai props ke DashboardLayout
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'user-profile',
        component: UserProfile,
        props: true,
      },
      {
        path: 'posts',
        name: 'user-posts',
        component: UserPosts,
        props: true,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Simulasi status login
const isLoggedIn = true

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'login' }
  }
})

export default router
```

## 2. Layout Induk (`src/views/DashboardLayout.vue`)

```html
<script setup>
defineProps({
  id: String,
})
</script>

<template>
  <div class="dashboard-page">
    <header class="header">
      <h2>Portal Pengguna (ID: {{ id }})</h2>
      <nav class="nav-links">
        <RouterLink :to="{ name: 'user-profile', params: { id } }">Profil</RouterLink>
        <RouterLink :to="{ name: 'user-posts', params: { id } }">Daftar Post</RouterLink>
      </nav>
    </header>

    <main class="content-box">
      <!-- Area render halaman anak -->
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.dashboard-page { max-width: 650px; margin: 2rem auto; font-family: sans-serif; }
.header { border-bottom: 2px solid #eee; padding-bottom: 1rem; margin-bottom: 1.5rem; }
.nav-links { display: flex; gap: 1rem; margin-top: 0.5rem; }
.nav-links a { text-decoration: none; color: #333; }
.nav-links .router-link-exact-active { font-weight: bold; color: #42b883; border-bottom: 2px solid #42b883; }
.content-box { background: #fdfdfd; border: 1px solid #e2e2e2; border-radius: 8px; padding: 1.5rem; }
</style>
```

## 3. Komponen Anak (`src/views/UserProfile.vue`)

```html
<script setup>
defineProps({
  id: String,
})
</script>

<template>
  <div>
    <h3>Informasi Profil</h3>
    <p>Selamat datang di dashboard akun #{{ id }}.</p>
  </div>
</template>
```

## Output Tampilan Mini Project

```text
URL: /dashboard/10

Portal Pengguna (ID: 10)
[ Profil ]  [ Daftar Post ]
------------------------------------------------------
Informasi Profil
Selamat datang di dashboard akun #10.
```

```text
URL: /dashboard/10/posts

Portal Pengguna (ID: 10)
[ Profil ]  [ Daftar Post ]
------------------------------------------------------
Daftar Artikel Pengguna #10
• Belajar Vue 3 Dasar
• Panduan Vue Router 4
```

## Diagram Alur Mini Project

```text
       URL: /dashboard/10
               │
               ▼
       Global Guard (Cek to.meta.requiresAuth) ──> Status: LoggedIn ✓
               │
               ▼
       DashboardLayout.vue (Parent, Props id: "10")
               │
               │ <RouterView />
               ▼
       UserProfile.vue (Child Rute Aktif)
```

**Kunci:** Pahami bagaimana parameter `:id` mengalir dari rute induk ke rute anak, dan bagaimana `meta: { requiresAuth: true }` melindungi seluruh rute cabang di dalamnya.

---

<a id="bagian-27"></a>

# 27. 🔗 Referensi Resmi

- [Vue Router 4 — Official Documentation](https://router.vuejs.org/)
- [Getting Started Guide](https://router.vuejs.org/guide/)
- [Dynamic Route Matching](https://router.vuejs.org/guide/essentials/dynamic-matching.html)
- [Nested Routes Guide](https://router.vuejs.org/guide/essentials/nested-routes.html)
- [Programmatic Navigation](https://router.vuejs.org/guide/essentials/navigation.html)
- [Named Routes](https://router.vuejs.org/guide/essentials/named-routes.html)
- [Named Views](https://router.vuejs.org/guide/essentials/named-views.html)
- [Passing Props to Route Components](https://router.vuejs.org/guide/essentials/passing-props.html)
- [HTML5 History Modes](https://router.vuejs.org/guide/essentials/history-mode.html)
- [Navigation Guards In-Depth](https://router.vuejs.org/guide/advanced/navigation-guards.html)
- [RouterView Slot & Transitions](https://router.vuejs.org/guide/advanced/router-view-slot.html)
- [Dynamic Routing Guide](https://router.vuejs.org/guide/advanced/dynamic-routing.html)
- [API Reference](https://router.vuejs.org/api/)
