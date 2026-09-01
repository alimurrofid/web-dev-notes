# Nuxt State, Middleware & Modules Cheatsheet Revised

> **Target:** Pemula yang telah memahami Nuxt Dasar dan Universal Data Fetching, serta ingin menguasai **Global State Management SSR-friendly (`useState`), Session Cookies (`useCookie`), Route Middleware (Navigation Guards), Pinia Nuxt, Runtime Config, Plugins System, dan Hybrid Rendering / Route Rules** pada **Nuxt 3.12+ (Nuxt 4 Ready)**.
>
> Fokus cheatsheet ini: **masalah Cross-Request State Pollution di SSR → `useState()` → custom state composables → integrasi `@pinia/nuxt` → Route Middleware (Global, Named, Inline) → `navigateTo()` & `abortNavigation()` → `definePageMeta` guards → `useCookie()` synchronizer → Runtime Config (`useRuntimeConfig`) → Plugins (`.client.ts` vs `.server.ts`) → Nuxt Modules ecosystem → Hybrid Rendering `routeRules` (SPA, SSG, SWR) → mini project Role-Based Auth & Protected Dashboard SPA**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: State Pollution di SSR, useState(), Custom State Composables, Route Middleware, dan navigateTo()

🟡 Lanjutan
→ pelajari setelah memahami dasar: definePageMeta guards, useCookie(), Runtime Config, Plugins (.client/.server), dan Route Rules

🔴 Advanced / Operasional
→ penting untuk arsitektur production: Hybrid Rendering (SWR/ISR), Nuxt Lifecycle Hooks, Multi-Target Deployment, dan i18n
```

Mental model alur eksekusi Route Middleware & Auth Guard di Nuxt 3:

```text
                 PENGGUNA MENGAKSES URL (/admin/dashboard)
                                │
                                ▼
              1. GLOBAL MIDDLEWARE (*.global.ts)
                (Logging URL / Cek Maintenance Mode)
                                │
                                ▼
              2. NAMED ROUTE MIDDLEWARE ('auth', 'admin')
            (Diekstrak dari definePageMeta({ middleware }))
                                │
                 ┌──────────────┴──────────────┐
                 ▼ (User Belum Login)          ▼ (User Resmi & Ber-Role Admin)
       navigateTo('/login')             Lanjut Render Halaman Dashboard
         (Redirect Seketika)
```

**Hafalan:**

```text
Cross-Request State Pollution → kebocoran data sensitif antar pengguna berbeda yang terjadi jika state global dibuat di luar siklus request SSR
useState(key, init)           → composable resmi Nuxt untuk membuat shared state reaktif yang aman dari kebocoran data SSR
Route Middleware              → fungsi pencegat navigasi halaman (Navigation Guard) yang dieksekusi sebelum rute target dirender
navigateTo(targetUrl)         → fungsi navigasi terprogram universal yang aman dieksekusi di server SSR maupun browser
useCookie(cookieName, opts)   → composable pembaca dan penulis cookie yang otomatis tersinkronisasi antara server dan client
useRuntimeConfig()            → composable untuk mengakses variabel lingkungan publik (Frontend) dan rahasia privat (Server Only)
Route Rules                   → konfigurasi hybrid rendering di nuxt.config.ts untuk mengatur strategi SSR/SPA/SSG/SWR per URL
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan State Management di SSR & Masalah Cross-Request State Pollution](#bagian-1)
2. [Composable `useState()` Bawaan Nuxt 3](#bagian-2)
3. [Mengorganisasi Global State dengan Custom Composables](#bagian-3)
4. [Integrasi Pinia dengan Nuxt 3 (`@pinia/nuxt`)](#bagian-4)
5. [Pengenalan Route Middleware di Nuxt 3](#bagian-5)
6. [Tiga Jenis Route Middleware](#bagian-6)
7. [Menulis Named Route Middleware (`defineNuxtRouteMiddleware`)](#bagian-7)
8. [Navigasi & Redirect di Middleware (`navigateTo` & `abortNavigation`)](#bagian-8)

### 🟡 Lanjutan

9. [Proteksi Halaman dengan Middleware di `definePageMeta`](#bagian-9)
10. [Server-Side Cookie Management dengan `useCookie()`](#bagian-10)
11. [Runtime Config & Variabel Lingkungan (`useRuntimeConfig`)](#bagian-11)
12. [Nuxt Plugins System (`plugins/` folder)](#bagian-12)
13. [Client-Only vs Server-Only Plugins](#bagian-13)
14. [Ekosistem Nuxt Modules](#bagian-14)
15. [Hybrid Rendering & Route Rules di `nuxt.config.ts`](#bagian-15)
16. [Internationalization (i18n) & Multi-Language Routing](#bagian-16)

### 🔴 Advanced / Operasional

17. [Nuxt Lifecycle Hooks & Events](#bagian-17)
18. [Deployment Nuxt 3 ke Production](#bagian-18)

### 🛠️ Referensi & Praktik

19. [Peta Ingatan Cepat](#bagian-19)
20. [Tabel Ringkasan](#bagian-20)
21. [Cheat Code Nuxt State & Middleware 10 Detik](#bagian-21)
22. [Urutan Belajar yang Disarankan](#bagian-22)
23. [Mini Project: Production-Ready Full-Stack Role-Based Authentication, Cart State & Protected Dashboard Web App](#bagian-23)
24. [Referensi Resmi](#bagian-24)

---

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan State Management di SSR & Masalah Cross-Request State Pollution

## Konsep

Pada aplikasi Vue SPA murni (Client-Side), Anda dapat membuat variabel global di luar komponen:
`export const globalUser = ref(null)`
Cara ini bekerja karena browser hanya digunakan oleh 1 orang pengguna.

**Bahaya Fatal di Server-Side Rendering (SSR)**:
- Server Node.js (Nitro) menangani ribuan permintaan pengguna yang berbeda secara bersamaan dalam satu proses memori yang sama (*Shared Node.js Process*).
- Jika Anda menggunakan `const user = ref(null)` di luar fungsi komponen di server, **data User A (yang sedang login) akan bocor dan terbaca oleh User B yang mengakses website sesudahnya**! Ini disebut **Cross-Request State Pollution**.

**Solusi Nuxt 3:**
Nuxt menyediakan composable **`useState()`** yang mengikat state ke dalam konteks request pengguna saat ini (*Request Scope Isolation*) dan menyertakan data tersebut ke dalam SSR Payload secara aman.

## Cara Kerja

```text
State Biasa (ref di luar komponen - BAHAYA):
User A Login (Set user = "Budi") ──> Memory Server Tercemar ──> User B Buka Web (Melihat Akun Budi!) ❌

Nuxt useState (Request Scope Isolation - AMAN):
User A Request ──> Context Request A (useState: "Budi") ──> Respon A
User B Request ──> Context Request B (useState: null)   ──> Respon B ✅
```

**Hafalan:**

```text
Cross-Request State Pollution → bahaya kebocoran data user di server SSR akibat penggunaan variabel global biasa
useState()                    → solusi wajib Nuxt untuk mengisolasi state per request pengguna
```

---

<a id="bagian-2"></a>

# 2. 🟢 Composable `useState()` Bawaan Nuxt 3

## Konsep

Composable **`useState(key, initFunction)`**:
1. `key` (String Unik): Pengenal state agar data tersinkronisasi antara server SSR dan browser hydration.
2. `initFunction`: Fungsi inisialisasi yang hanya dieksekusi 1 kali saat state pertama kali dibuat.

Karakteristik:
- Bekerja persis seperti `ref()` bawaan Vue, namun otomatis dipersistensikan ke dalam payload SSR.

## Contoh

```vue
<script setup>
// Membuat shared state reaktif 'siteCounter'
const counter = useState('siteCounter', () => 0)
</script>

<template>
  <div style="padding: 20px;">
    <h3>Shared Counter: {{ counter }}</h3>
    <button @click="counter++">+ Tambah Hitungan</button>
  </div>
</template>
```

**Hafalan:**

```text
const myState = useState('unique-state-key', () => initialValue)
```

---

<a id="bagian-3"></a>

# 3. 🟢 Mengorganisasi Global State dengan Custom Composables

## Konsep

Praktik terbaik di Nuxt 3 adalah membungkus `useState` ke dalam fungsi composable modular di dalam folder **`composables/`** (otomatis auto-import ke seluruh proyek).

## Contoh

File `composables/useAuth.ts`:
```typescript
interface UserProfile {
  id: string
  name: string
  role: 'USER' | 'ADMIN'
}

export const useAuth = () => {
  // State terisolasi SSR
  const user = useState<UserProfile | null>('auth_user_state', () => null)

  const login = (userData: UserProfile) => {
    user.value = userData
  }

  const logout = () => {
    user.value = null
  }

  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  return {
    user: readonly(user), // Lindungi state agar hanya bisa diubah via method
    login,
    logout,
    isAdmin
  }
}
```

Penggunaan di Halaman Mana Saja:
```vue
<script setup>
// useAuth otomatis tersedia tanpa import!
const { user, login, logout, isAdmin } = useAuth()
</script>

<template>
  <div>
    <p v-if="user">Sedang login sebagai: {{ user.name }} (Admin: {{ isAdmin }})</p>
    <button v-if="!user" @click="login({ id: '1', name: 'Alimur', role: 'ADMIN' })">Login</button>
    <button v-else @click="logout()">Logout</button>
  </div>
</template>
```

**Hafalan:**

```text
composables/useFeature.ts → pola modular mengorganisasi global state dan fungsi action di Nuxt
```

---

<a id="bagian-4"></a>

# 4. 🟢 Integrasi Pinia dengan Nuxt 3 (`@pinia/nuxt`)

## Konsep

Jika aplikasi Anda memiliki ratusan state kompleks dan membutuhkan ekosistem Pinia Store, instal modul resmi:
```bash
npx nuxi module add @pinia/nuxt
```

Keuntungan Pinia di Nuxt 3:
- Auto-import fungsi `defineStore`.
- Otomatis menangani hidrasi SSR state ke browser tanpa konfigurasi manual.

## Contoh

File `stores/cart.ts`:
```typescript
export const useCartStore = defineStore('cartStore', () => {
  const items = ref<Array<{ id: number; name: string; price: number }>>([])

  const addItem = (product: { id: number; name: string; price: number }) => {
    items.value.push(product)
  }

  const totalItems = computed(() => items.value.length)

  return { items, addItem, totalItems }
})
```

**Hafalan:**

```text
npx nuxi module add @pinia/nuxt → integrasi Pinia Store dengan SSR auto-hydration di Nuxt
```

---

<a id="bagian-5"></a>

# 5. 🟢 Pengenalan Route Middleware di Nuxt 3

## Konsep

**Route Middleware** di Nuxt 3 adalah fungsi penjaga rute (*Navigation Guards*) yang berjalan **sebelum pengguna masuk ke halaman tujuan**:
- Berjalan di **Server saat SSR** (mencegah server me-render HTML rahasia jika user belum login).
- Berjalan di **Client saat navigasi SPA** (mencegah klik tautan masuk ke halaman terproteksi).

Parameter Middleware:
`defineNuxtRouteMiddleware((to, from) => { ... })`
- `to`: Objek rute tujuan yang ingin dikunjungi.
- `from`: Objek rute asal saat ini.

**Hafalan:**

```text
Route Middleware → penjaga navigasi halaman yang dieksekusi di server dan browser sebelum halaman target terbuka
```

---

<a id="bagian-6"></a>

# 6. 🟢 Tiga Jenis Route Middleware

## Konsep

Nuxt 3 mendukung 3 variasi penulisan middleware:

| Jenis Middleware | Lokasi Definisi | Cara Kerja & Prioritas Eksekusi |
|---|---|---|
| **1. Global Middleware** | `middleware/*.global.ts` | **Otomatis dijalankan pada SETIAP navigasi** di seluruh aplikasi tanpa perlu didaftarkan di halaman. |
| **2. Named Middleware** | `middleware/auth.ts` | Dijalankan **hanya pada halaman tertentu** yang memanggilnya via `definePageMeta({ middleware: 'auth' })`. |
| **3. Anonymous / Inline** | Langsung di dalam halaman | Didefinisikan langsung di dalam macro `definePageMeta` pada satu file `.vue`. |

Urutan Eksekusi: **Global Middleware $\rightarrow$ Named Middleware $\rightarrow$ Inline Middleware**.

**Hafalan:**

```text
filename.global.ts → middleware global yang berjalan otomatis di semua rute aplikasi
middleware/auth.ts → named middleware yang dipanggil sesuai kebutuhan halaman
```

---

<a id="bagian-7"></a>

# 7. 🟢 Menulis Named Route Middleware (`defineNuxtRouteMiddleware`)

## Konsep

Untuk membuat Named Middleware:
1. Buat file di dalam folder **`middleware/`** (misal: `middleware/auth.ts`).
2. Gunakan pembungkus **`defineNuxtRouteMiddleware((to, from) => { ... })`**.

## Contoh

File `middleware/auth.ts`:
```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth()

  // Jika user belum login, alihkan ke halaman login
  if (!user.value) {
    return navigateTo('/login')
  }
})
```

File `middleware/admin.ts`:
```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  const { user, isAdmin } = useAuth()

  if (!user.value) {
    return navigateTo('/login')
  }

  // Jika bukan admin, tolak dengan error 403 Forbidden
  if (!isAdmin.value) {
    return abortNavigation(createError({
      statusCode: 403,
      statusMessage: "Akses Ditolak: Khusus Administrator"
    }))
  }
})
```

**Hafalan:**

```text
export default defineNuxtRouteMiddleware((to, from) => { /* logic guard */ })
```

---

<a id="bagian-8"></a>

# 8. 🟢 Navigasi & Redirect di Middleware (`navigateTo` & `abortNavigation`)

## Konsep

Di dalam middleware, jangan menggunakan `window.location` atau manipulasi DOM langsung:

Gunakan fungsi resmi Nuxt:
1. **`navigateTo(targetUrl, options)`:**
   - Melakukan pengalihan rute (redirect).
   - Opsi: `redirectCode: 301` (Permanen) atau `replace: true` (Ganti history).
2. **`abortNavigation(errorOptional)`:**
   - Membatalkan proses navigasi seketika.

## Contoh

```typescript
// Redirect ke halaman login sambil membawa query path asal
return navigateTo({
  path: '/login',
  query: { redirect: to.fullPath }
})

// Membatalkan navigasi dengan pesan 404
return abortNavigation(createError({ statusCode: 404, statusMessage: "Halaman disembunyikan" }))
```

**Hafalan:**

```text
return navigateTo('/path') → mengalihkan navigasi rute dari dalam middleware
return abortNavigation()   → membatalkan proses perpindahan halaman
```

---

<a id="bagian-9"></a>

# 9. 🟡 Proteksi Halaman dengan Middleware di `definePageMeta`

## Konsep

Untuk memasang satu atau beberapa named middleware pada sebuah halaman, gunakan properti **`middleware`** di dalam macro **`definePageMeta`**.

## Contoh

File `pages/admin/dashboard.vue`:
```vue
<script setup>
// Melindungi halaman dengan 2 guard middleware berurutan: 'auth' lalu 'admin'
definePageMeta({
  middleware: ['auth', 'admin']
})
</script>

<template>
  <div>
    <h1>Panel Rahasia Admin</h1>
    <p>Hanya dapat diakses setelah lolos verifikasi middleware auth dan admin!</p>
  </div>
</template>
```

**Hafalan:**

```text
definePageMeta({ middleware: ['auth', 'admin'] }) → menerapkan rantai proteksi middleware pada halaman
```

---

<a id="bagian-10"></a>

# 10. 🟡 Server-Side Cookie Management dengan `useCookie()`

## Konsep

Di aplikasi SSR, `localStorage` **tidak dapat diakses oleh server**. Jika token autentikasi disimpan di `localStorage`, server saat SSR tidak akan tahu siapa yang sedang login.

**`useCookie(name, options)`**:
- Otomatis membaca cookie dari header HTTP request saat di server SSR.
- Otomatis membaca & menulis `document.cookie` saat di browser client.
- Sinkronisasi dua arah (*Two-Way Reactive Binding*) yang aman untuk auth token.

## Contoh

```typescript
// composables/useAuthToken.ts
export const useAuthToken = () => {
  // Cookie reaktif berumur 7 hari
  const token = useCookie<string | null>('access_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 Hari
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })

  const setToken = (newToken: string) => { token.value = newToken }
  const removeToken = () => { token.value = null }

  return { token, setToken, removeToken }
}
```

**Hafalan:**

```text
const token = useCookie('auth_token', { maxAge: 604800 }) → mengelola cookie sinkron di server SSR & browser
```

---

<a id="bagian-11"></a>

# 11. 🟡 Runtime Config & Variabel Lingkungan (`useRuntimeConfig`)

## Konsep

Variabel lingkungan rahasia (seperti Secret Key Database atau Stripe API Secret) **TIDAK BOLEH BOCOR KE JAVASCRIPT BROWSER**.

Nuxt memisahkan variabel di `nuxt.config.ts` via **`runtimeConfig`**:
- **Variabel Tingkat Atas (Private):** Hanya bisa dibaca di sisi server (Nitro API & Server Middleware).
- **Variabel di dalam `public`:** Dapat dibaca di server maupun frontend browser.

## Contoh

Konfigurasi di `nuxt.config.ts`:
```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    // 1. Private Keys (HANYA SERVER - AMAN!)
    jwtSecret: 'SuperSecretServerKey123',
    dbPassword: 'rootpassword',

    // 2. Public Keys (Tersedia di Frontend & Backend)
    public: {
      apiBaseUrl: 'https://api.perusahaan.com/v1',
      appName: 'Toko Online Nuxt'
    }
  }
})
```

Penggunaan di Komponen Frontend / Server:
```vue
<script setup>
const config = useRuntimeConfig()

// ✅ BISA diakses di frontend:
console.log(config.public.apiBaseUrl)

// ❌ bernilai undefined di frontend (Hanya ada di server):
console.log(config.jwtSecret)
</script>
```

**Hafalan:**

```text
runtimeConfig: { secretKey: '...', public: { apiBase: '...' } } → pemisahan variabel server privat vs frontend publik
```

---

<a id="bagian-12"></a>

# 12. 🟡 Nuxt Plugins System (`plugins/` folder)

## Konsep

Folder **`plugins/`** digunakan untuk menginisialisasi library pihak ketiga, mendaftarkan direktif Vue kustom, atau menyediakan fungsi helper global (`provide`) ke seluruh aplikasi.

Nuxt otomatis membaca seluruh file di dalam folder `plugins/`.

## Contoh

File `plugins/currency.ts`:
```typescript
export default defineNuxtPlugin(() => {
  return {
    provide: {
      // Menyediakan helper global $formatRupiah
      formatRupiah: (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0
        }).format(amount)
      }
    }
  }
})
```

Penggunaan di Komponen:
```vue
<template>
  <div>
    <!-- Diakses langsung via $formatRupiah di template! -->
    <p>Total: {{ $formatRupiah(1500000) }}</p>
  </div>
</template>
```

**Hafalan:**

```text
defineNuxtPlugin(() => ({ provide: { helperName: fn } })) → menyediakan fungsi utilitas global $helperName
```

---

<a id="bagian-13"></a>

# 13. 🟡 Client-Only vs Server-Only Plugins

## Konsep

Beberapa library pihak ketiga hanya berjalan di browser (seperti library animasi AOS, Chart.js, atau Google Analytics) dan akan crash jika dijalankan di server.

Nuxt menyediakan konvensi akhiran file:
- **`plugins/myPlugin.client.ts`:** Dijalankan **HANYA di browser klien**.
- **`plugins/myPlugin.server.ts`:** Dijalankan **HANYA di server Node.js**.
- **`plugins/myPlugin.ts`:** Dijalankan di kedua lingkungan (*Universal*).

**Hafalan:**

```text
plugin.client.ts → plugin khusus browser | plugin.server.ts → plugin khusus server
```

---

<a id="bagian-14"></a>

# 14. 🟡 Ekosistem Nuxt Modules

## Konsep

Modul Nuxt adalah paket ekstensi resmi yang mengotomatisasi konfigurasi library kompleks hanya dengan 1 perintah:

Modul Populer:
- `@nuxtjs/tailwindcss` : Setup Tailwind CSS instan.
- `@vueuse/nuxt` : Koleksi ratusan Vue Composables bermanfaat.
- `@pinia/nuxt` : State Management terintegrasi.
- `@nuxt/image` : Optimasi kompresi gambar otomatis.

Instalasi Instan via Nuxi:
```bash
npx nuxi module add @nuxtjs/tailwindcss
```

**Hafalan:**

```text
npx nuxi module add <module-name> → menginstal dan mendaftarkan modul Nuxt otomatis ke nuxt.config.ts
```

---

<a id="bagian-15"></a>

# 15. 🟡 Hybrid Rendering & Route Rules di `nuxt.config.ts`

## Konsep

Di masa lalu, Anda harus memilih: seluruh website dijadikan SSR atau seluruh website dijadikan SPA.

**Nuxt 3 Hybrid Rendering (Route Rules)** memungkinkan kita **menentukan strategi rendering yang berbeda untuk setiap path URL**:
- `/admin/**` : `{ ssr: false }` (Jadikan SPA murni karena butuh auth dan tidak butuh SEO).
- `/products/**` : `{ swr: 3600 }` (Stale-While-Revalidate: cache HTML selama 1 jam di CDN edge).
- `/about` : `{ prerender: true }` (Static SSG saat build).
- `/api/**` : `{ cors: true }` (Tambahkan header CORS otomatis).

## Contoh

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // Halaman Statis di-prerender saat build
    '/about': { prerender: true },

    // Halaman Katalog di-cache selama 1 jam (ISR / SWR)
    '/products/**': { swr: 3600 },

    // Panel Admin dijadikan Single Page Application (SPA) murni
    '/admin/**': { ssr: false },

    // Redirect lama ke URL baru
    '/old-blog/**': { redirect: '/blog/**' }
  }
})
```

**Hafalan:**

```text
routeRules: { '/admin/**': { ssr: false }, '/catalog/**': { swr: 3600 } } → strategi rendering hybrid per URL
```

---

<a id="bagian-16"></a>

# 16. 🟡 Internationalization (i18n) & Multi-Language Routing

## Konsep

Untuk website multibahasa (misal: `/id/about` dan `/en/about`), ekosistem Nuxt menggunakan modul resmi **`@nuxtjs/i18n`**:
- Mengatur prefix URL bahasa otomatis.
- Deteksi bahasa browser pengunjung.
- Menyediakan composable `$t('welcome')` dan `useI18n()`.

**Hafalan:**

```text
@nuxtjs/i18n → modul resmi untuk lokalisasi konten dan routing multibahasa di Nuxt
```

---

<a id="bagian-17"></a>

# 17. 🔴 Nuxt Lifecycle Hooks & Events

## Konsep

Nuxt menyediakan sistem **Hooks** yang memungkinkan developer mencegat fase tertentu dari siklus hidup aplikasi:
- `app:created` : Saat instance Vue App pertama kali dibuat.
- `page:start` & `page:finish` : Saat transisi navigasi halaman dimulai dan selesai.

## Contoh

```typescript
// plugins/pageLoading.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:start', () => {
    console.log('Navigasi dimulai...')
  })
  nuxtApp.hook('page:finish', () => {
    console.log('Navigasi selesai!')
  })
})
```

**Hafalan:**

```text
nuxtApp.hook('page:start', fn) → mencegat event siklus hidup runtime aplikasi Nuxt
```

---

<a id="bagian-18"></a>

# 18. 🔴 Deployment Nuxt 3 ke Production

## Konsep

Tiga mode build untuk deployment Nuxt 3:

1. **Node.js Production Server (Universal SSR):**
   ```bash
   npm run build
   node .output/server/index.mjs
   ```
2. **Static Site Generation (SSG / Static Hosting Netlify/GitHub Pages):**
   ```bash
   npx nuxi generate
   # Hasil HTML statis berada di folder .output/public/
   ```
3. **Serverless Edge (Vercel / Cloudflare Workers):**
   - Nitro otomatis mendeteksi platform hosting dan menghasilkan bundle *Zero-Config Serverless*.

**Hafalan:**

```text
npm run build      → build untuk production server Node.js / Docker
npx nuxi generate  → build seluruh halaman menjadi HTML statis murni (SSG)
```

---

<a id="bagian-19"></a>

# 19. 🛠️ Peta Ingatan Cepat

```text
                       PETA ARSITEKTUR NUXT STATE & GUARDS
                                        │
       ┌────────────────────────────────┼────────────────────────────────┐
       ▼                                ▼                                ▼
STATE MANAGEMENT                ROUTE MIDDLEWARE                 CONFIG & PLUGINS
├─ useState() (SSR Safe)        ├─ *.global.ts (Semua Rute)      ├─ useRuntimeConfig()
├─ useCookie() (SSR Session)    ├─ middleware/auth.ts            ├─ plugins/*.client.ts
├─ composables/useAuth.ts       ├─ definePageMeta({ middleware })├─ routeRules (Hybrid)
└─ Pinia Nuxt Store             └─ navigateTo('/login')          └─ provide: { $helper }
```

---

<a id="bagian-20"></a>

# 20. 📚 Tabel Ringkasan

| Fitur / Composable | Tipe | Fungsi & Karakteristik Utama |
|---|---|---|
| `useState(key, fn)` | Composable | Shared state terisolasi per request yang aman untuk SSR |
| `useCookie(name, opts)` | Composable | Sinkronisasi pembacaan & penulisan cookie server-client |
| `defineNuxtRouteMiddleware` | Helper | Mendefinisikan navigation guard pencegat rute |
| `navigateTo(path)` | Helper | Mengalihkan halaman dari dalam middleware secara universal |
| `abortNavigation()` | Helper | Membatalkan proses navigasi rute |
| `defineNuxtPlugin` | Helper | Mendaftarkan ekstensi helper global di folder `plugins/` |
| `useRuntimeConfig()` | Composable | Membaca variabel environment private (server) & public |
| `routeRules` | Konfigurasi | Menentukan strategi rendering hybrid per path URL |

---

<a id="bagian-21"></a>

# 21. ⚡ Cheat Code Nuxt State & Middleware 10 Detik

```typescript
// 1. Template Custom Composable Auth State
export const useAuth = () => {
  const user = useState('user', () => null)
  return { user, login: (u) => user.value = u, logout: () => user.value = null }
}

// 2. Template Named Auth Middleware
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth()
  if (!user.value) return navigateTo('/login')
})
```

---

<a id="bagian-22"></a>

# 22. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Pahami Bahaya State Pollution & Kuasai useState()
├── Gunakan useState() alih-alih ref() global di luar komponen
└── Bungkus ke dalam custom composables di composables/useAuth.ts
       │
       ▼
Langkah 2: Kuasai Session Cookies & Auth Middleware
├── Gunakan useCookie() untuk menyimpan token sesi SSR
├── Buat Named Middleware di middleware/auth.ts dengan navigateTo()
└── Terapkan proteksi di halaman via definePageMeta({ middleware })
       │
       ▼
Langkah 3: Konfigurasi Keamanan & Plugins
├── Pisahkan kredensial via runtimeConfig di nuxt.config.ts
└── Buat plugin global di plugins/ (bedakan .client.ts)
       │
       ▼
Langkah 4: Optimasi Hybrid Rendering & Deployment
├── Terapkan routeRules di nuxt.config.ts (SPA, SSG, SWR)
└── Jalankan build production (npm run build vs nuxi generate)
       │
       ▼
Langkah 5: Selamat! Anda Telah Menguasai Ekosistem Full-Stack Nuxt 3 Lengkap!
```

---

<a id="bagian-23"></a>

# 23. 🏗️ Mini Project: Production-Ready Full-Stack Role-Based Authentication, Cart State & Protected Dashboard Web App

Aplikasi web full-stack lengkap dan runnable yang mengintegrasikan: **`useState`, `useCookie` SSR Session, Route Middleware Guards (Auth & Admin), `definePageMeta`, Runtime Config, Custom Helper Plugin `$formatRupiah`, dan Hybrid Rendering Rules**.

### 1. File Konfigurasi Nuxt (`nuxt.config.ts`):
```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },

  // Runtime Config (Public & Private)
  runtimeConfig: {
    adminSecretCode: 'SUPER_ADMIN_SECRET', // Hanya Server
    public: {
      appName: 'NuxtMart Enterprise Hub',
      apiBase: '/api'
    }
  },

  // Hybrid Route Rules
  routeRules: {
    '/admin/**': { ssr: false } // Jadikan Panel Admin sebagai SPA murni
  }
})
```

### 2. Plugin Pemformat Mata Uang (`plugins/currency.ts`):
```typescript
export default defineNuxtPlugin(() => {
  return {
    provide: {
      rupiah: (val: number) => `Rp ${val.toLocaleString('id-ID')}`
    }
  }
})
```

### 3. Composable Auth & Session State (`composables/useAuth.ts`):
```typescript
interface AuthUser {
  name: string
  email: string
  role: 'USER' | 'ADMIN'
}

export const useAuth = () => {
  // Cookie sesi sinkron SSR & Client (7 Hari)
  const authCookie = useCookie<AuthUser | null>('user_session', { maxAge: 604800, sameSite: 'lax' })
  // Shared state reaktif
  const user = useState<AuthUser | null>('auth_user_state', () => authCookie.value)

  const login = (userData: AuthUser) => {
    user.value = userData
    authCookie.value = userData
  }

  const logout = () => {
    user.value = null
    authCookie.value = null
  }

  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  return { user, login, logout, isAdmin }
}
```

### 4. Auth Route Middleware (`middleware/auth.ts`):
```typescript
export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth()
  if (!user.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
})
```

### 5. Admin Role Middleware (`middleware/admin.ts`):
```typescript
export default defineNuxtRouteMiddleware(() => {
  const { user, isAdmin } = useAuth()
  if (!user.value) return navigateTo('/login')
  if (!isAdmin.value) {
    return abortNavigation(createError({ statusCode: 403, statusMessage: "Khusus Akun Administrator" }))
  }
})
```

### 6. Halaman Login (`pages/login.vue`):
```vue
<script setup>
const { user, login } = useAuth()
const route = useRoute()
const router = useRouter()

const handleLogin = (role) => {
  login({
    name: role === 'ADMIN' ? 'Super Admin' : 'Budi Santoso',
    email: `${role.toLowerCase()}@nuxtmart.com`,
    role
  })

  const target = (route.query.redirect as string) || (role === 'ADMIN' ? '/admin' : '/dashboard')
  router.push(target)
}
</script>

<template>
  <div style="font-family: sans-serif; max-width: 400px; margin: 40px auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center;">
    <h2>Masuk Akun Demo</h2>
    <p style="color: #64748b;">Pilih jenis role pengguna untuk pengujian middleware:</p>
    <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px;">
      <button @click="handleLogin('USER')" style="background: #2563eb; color: #fff; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer;">
        Login sebagai User Biasa
      </button>
      <button @click="handleLogin('ADMIN')" style="background: #00dc82; color: #000; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer;">
        Login sebagai Administrator
      </button>
    </div>
  </div>
</template>
```

### 7. Halaman Dashboard Pengguna (`pages/dashboard.vue`):
```vue
<script setup>
definePageMeta({
  middleware: 'auth' // Dilindungi Middleware Auth
})

const { user, logout } = useAuth()
const { $rupiah } = useNuxtApp()
</script>

<template>
  <div style="font-family: sans-serif; max-width: 800px; margin: 30px auto; padding: 20px;">
    <h2>👤 Dashboard Pengguna</h2>
    <p>Selamat datang, <strong>{{ user?.name }}</strong> ({{ user?.email }})</p>
    <p>Status Saldo: <strong>{{ $rupiah(2500000) }}</strong></p>

    <div style="margin-top: 20px; display: flex; gap: 10px;">
      <NuxtLink to="/admin" style="background: #0f172a; color: #fff; padding: 8px 16px; border-radius: 6px; text-decoration: none;">
        Buka Panel Admin 🔒
      </NuxtLink>
      <button @click="logout(); navigateTo('/login')" style="background: #ef4444; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
        Logout
      </button>
    </div>
  </div>
</template>
```

### 8. Halaman Panel Admin Terproteksi (`pages/admin.vue`):
```vue
<script setup>
definePageMeta({
  middleware: ['auth', 'admin'] // Dilindungi Rantai Auth + Admin Middleware
})

const { user } = useAuth()
const config = useRuntimeConfig()
</script>

<template>
  <div style="font-family: sans-serif; max-width: 800px; margin: 30px auto; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
    <h2 style="color: #00dc82; margin-top: 0;">⚡ Panel Administrator (SPA Hybrid Render)</h2>
    <p>Aplikasi: <strong>{{ config.public.appName }}</strong></p>
    <p>Halo, Admin <strong>{{ user?.name }}</strong>. Anda memiliki hak akses penuh terhadap konfigurasi sistem.</p>
    <NuxtLink to="/dashboard">⬅ Kembali ke Dashboard</NuxtLink>
  </div>
</template>
```

## Hasil Output Alur Pengujian Middleware

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Akses Langsung /admin tanpa login                                  │
│    ──> Mencegat via middleware/auth.ts                                 │
│    ──> Otomatis Redirect ke: /login?redirect=/admin                    │
├────────────────────────────────────────────────────────────────────────┤
│ 2. Login sebagai "User Biasa" lalu buka /admin                         │
│    ──> Lolos middleware/auth.ts                                        │
│    ──> Ditolak oleh middleware/admin.ts: HTTP 403 Forbidden!           │
├────────────────────────────────────────────────────────────────────────┤
│ 3. Login sebagai "Administrator" lalu buka /admin                      │
│    ──> Lolos seluruh guard middleware!                                 │
│    ──> Tampil: ⚡ Panel Administrator (NuxtMart Enterprise Hub)        │
└────────────────────────────────────────────────────────────────────────┘
```

---

<a id="bagian-24"></a>

# 24. 🔗 Referensi Resmi

- [Nuxt 3 State Management Guide](https://nuxt.com/docs/getting-started/state-management)
- [Nuxt 3 Route Middleware Guide](https://nuxt.com/docs/guide/directory-structure/middleware)
- [Nuxt 3 Hybrid Rendering & Route Rules](https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering)
- [Pinia Nuxt Module Documentation](https://pinia.vuejs.org/ssr/nuxt.html)
