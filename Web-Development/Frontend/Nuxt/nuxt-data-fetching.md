# Nuxt Data Fetching & Server API Cheatsheet Revised

> **Target:** Pemula yang telah memahami Nuxt Dasar dan Vue 3, serta ingin menguasai **Universal Data Fetching (`useFetch`, `useAsyncData`, `$fetch`), pencegahan double-fetching saat SSR, dan pembuatan backend RESTful API menggunakan Nitro Server Engine (`server/api/`)** pada **Nuxt 3.12+ (Nuxt 4 Ready)**.
>
> Fokus cheatsheet ini: **SSR Data Hydration & Double Fetching mental model → `useFetch` vs `useAsyncData` vs `$fetch` → opsi lanjutan (`lazy`, `pick`, `transform`, `query`, `watch`) → key deduplication caching → Nitro Server Engine → `defineEventHandler` → HTTP Method matching (`.get.ts`, `.post.ts`, `.delete.ts`) → H3 utilities (`getQuery`, `readBody`, `getRouterParam`) → server error `createError` → server middleware → server caching `defineCachedEventHandler` → mini project Full-Stack Product Management & Search API**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: Masalah Double Fetching, useFetch vs useAsyncData vs $fetch, return data reaktif, dan opsi lazy/pick/query

🟡 Lanjutan
→ pelajari setelah memahami useFetch: Nitro Server Engine (server/api/), defineEventHandler, getQuery, readBody, getRouterParam, dan createError

🔴 Advanced / Operasional
→ penting untuk arsitektur production: Server Middleware, Cached Event Handlers, Deduplication Caching, dan End-to-End Type Safety
```

Mental model alur Universal Data Fetching & Server Payload Hydration di Nuxt 3:

```text
              1. PERMINTAAN HALAMAN (SSR REQUEST)
                               │
                               ▼
              2. NUXT SERVER MENJALANKAN useFetch()
             (Fetch data dari database / REST API luar)
                               │
                               ▼
              3. DATA DISERIALISASI KE DALAM SSR PAYLOAD
                window.__NUXT__.data = { ... }
                               │
                               ▼
              4. BROWSER MENERIMA HTML LENGKAP DENGAN DATA
                               │
                               ▼
              5. CLIENT HYDRATION (Browser Load JS)
         (useFetch di browser MEMBACA data dari SSR Payload,
          TIDAK MELAKUKAN FETCH ULANG KE SERVER! Bebas Double Fetch!)
```

**Hafalan:**

```text
Universal Data Fetching → mekanisme pengambilan data yang dieksekusi di server saat SSR dan diteruskan ke browser tanpa fetch ulang
useFetch(url, options)  → composable utama Nuxt untuk mengambil data dari endpoint URL dengan auto-caching dan reaktivitas
useAsyncData(key, fn)   → composable pembungkus asynchronous logic kustom (multi-promises / SDK eksternal)
$fetch(url, options)    → utilitas HTTP client murni (berbasis ofetch) untuk pemanggilan langsung di dalam event handler
Nitro Server Engine     → mesin backend server full-stack berkinerja tinggi bawaan Nuxt 3 untuk membuat REST API di server/api/
defineEventHandler(fn)  → fungsi pembungkus pembuatan endpoint server handler di Nitro
readBody(event)         → fungsi utilitas H3 untuk mem-parsing request body JSON pada method POST/PUT
getQuery(event)         → fungsi utilitas H3 untuk membaca query string URL (?search=val) di server
createError(options)    → fungsi utilitas untuk melempar respon error HTTP terstruktur (400, 404, 500) dari server
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Universal Data Fetching di Nuxt 3 & Masalah Double Fetching](#bagian-1)
2. [Perbedaan Fundamental `useFetch` vs `useAsyncData` vs `$fetch`](#bagian-2)
3. [Composable `useFetch` Dasar](#bagian-3)
4. [Opsi Kunci `useFetch` untuk Kinerja Optimal](#bagian-4)
5. [Composable `useAsyncData` untuk Kasus Lanjutan](#bagian-5)
6. [Mekanisme Caching & Deduplication Berbasis `key`](#bagian-6)
7. [Re-fetching Otomatis Berbasis Reaktivitas dengan Opsi `watch`](#bagian-7)
8. [Eksekusi Manual On-Demand dengan `immediate: false` & `execute()`](#bagian-8)

### 🟡 Lanjutan

9. [Pengenalan Nitro Server Engine & Direktori `server/api/`](#bagian-9)
10. [Menulis Endpoint API Pertama dengan `defineEventHandler`](#bagian-10)
11. [Method Matching pada Server Routes](#bagian-11)
12. [Membaca Query Parameters dengan `getQuery(event)`](#bagian-12)
13. [Membaca Request Body JSON dengan `readBody(event)`](#bagian-13)
14. [Dynamic Server Routes & URL Params dengan `getRouterParam(event, 'id')`](#bagian-14)
15. [Penanganan Error Server Terstruktur dengan `createError`](#bagian-15)
16. [Server Middleware di Folder `server/middleware/`](#bagian-16)

### 🔴 Advanced / Operasional

17. [Nitro Server Storage & Cached Event Handlers](#bagian-17)
18. [Mengonsumsi Server API Internal dari Frontend Nuxt](#bagian-18)

### 🛠️ Referensi & Praktik

19. [Peta Ingatan Cepat](#bagian-19)
20. [Tabel Ringkasan](#bagian-20)
21. [Cheat Code Nuxt Data Fetching 10 Detik](#bagian-21)
22. [Urutan Belajar yang Disarankan](#bagian-22)
23. [Mini Project: Production-Ready Full-Stack Product Management & Search API Web App](#bagian-23)
24. [Referensi Resmi](#bagian-24)

---

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan Universal Data Fetching di Nuxt 3 & Masalah Double Fetching

## Konsep

Pada aplikasi SSR biasa, jika Anda menggunakan `fetch()` bawaan JavaScript di dalam komponen Vue:
1. Server mengeksekusi `fetch()` saat me-render HTML awal.
2. Saat HTML tiba di browser, script Vue dijalankan ulang (*Client Hydration*), dan browser **menjalankan `fetch()` kedua kalinya**.
3. Ini disebut **Double Fetching Problem**: memboroskan kuota API, memperlambat performa, dan menyebabkan kedipan UI (*UI Flicker*).

**Solusi Nuxt 3: Universal Data Fetching (`useFetch`)**:
- Server mengambil data saat SSR dan **menyematkan data tersebut ke dalam payload HTML awal** (`window.__NUXT__.data`).
- Di browser, `useFetch` langsung mengambil data dari payload tersebut **tanpa melakukan network request kedua**.

## Cara Kerja

```text
Fetch Biasa (Bermasalah):
Server Fetch (Request 1) ──> Kirim HTML ──> Browser Hydration Fetch Lagi (Request 2) ❌

Nuxt 3 useFetch (Optimal):
Server Fetch (Request 1) ──> Kirim HTML + Data Payload ──> Browser Baca Payload (0 Request) ✅
```

**Hafalan:**

```text
Double Fetching Problem   → masalah fetch berulang di server dan browser saat SSR
SSR Data Payload Transfer → mekanisme Nuxt mengoper hasil fetch server ke browser untuk mencegah double fetch
```

---

<a id="bagian-2"></a>

# 2. 🟢 Perbedaan Fundamental `useFetch` vs `useAsyncData` vs `$fetch`

## Konsep

Memahami kapan menggunakan masing-masing alat fetching adalah kunci utama di Nuxt 3:

| Composable / Fungsi | Kapan Wajib Digunakan? | Integrasi SSR Payload? |
|---|---|---|
| **`useFetch(url, options)`** | Digunakan pada **`<script setup>` komponen** untuk mengambil data dari URL endpoint langsung. (Shortcut dari `useAsyncData + $fetch`). | ✅ **YA** (Aman dari Double Fetch) |
| **`useAsyncData(key, fn)`** | Digunakan pada **`<script setup>`** saat fungsi pengambil data membutuhkan logika kompleks, multi-promise (`Promise.all`), atau SDK pihak ketiga (Supabase, Firebase, Prisma). | ✅ **YA** (Aman dari Double Fetch) |
| **`$fetch(url, options)`** | Digunakan **HANYA di dalam Event Handlers** (seperti tombol submit form `@click="onSubmit"`, update data, hapus data). | ❌ **TIDAK** (Khusus mutasi data) |

> [!WARNING]
> **JANGAN MEMANGGIL `$fetch` LANGSUNG DI TOP-LEVEL `<script setup>` TANPA `useAsyncData`!** Memanggil `$fetch` langsung di `<script setup>` akan memicu *Double Fetching*.

**Hafalan:**

```text
useFetch()     → ambil data dari URL di <script setup> komponen
useAsyncData() → bungkus multi-promise / SDK pihak ketiga di <script setup>
$fetch()       → kirim form POST/PUT/DELETE di dalam fungsi event handler (onClick)
```

---

<a id="bagian-3"></a>

# 3. 🟢 Composable `useFetch` Dasar

## Konsep

Sintaks dasar `useFetch`:
`const { data, pending, error, refresh, status } = await useFetch(url, options)`

Objek Kembalian Reaktif:
- **`data`:** `Ref` berisi payload hasil respon JSON.
- **`pending`:** `Ref<boolean>` bernilai `true` saat request sedang berlangsung.
- **`error`:** `Ref` berisi detail objek error jika request gagal.
- **`refresh()`:** Fungsi untuk memicu pengambilan data ulang secara manual.
- **`status`:** `Ref<'idle' | 'pending' | 'success' | 'error'>`.

## Contoh

```vue
<script setup>
// Mengambil data user dari API publik
const { data: users, pending, error, refresh } = await useFetch('https://jsonplaceholder.typicode.com/users')
</script>

<template>
  <div style="padding: 20px;">
    <h2>Daftar Pengguna</h2>
    <button @click="refresh()">🔄 Muat Ulang Data</button>

    <!-- State Loading -->
    <div v-if="pending" style="color: #2563eb; margin-top: 10px;">
      ⏳ Sedang memuat data...
    </div>

    <!-- State Error -->
    <div v-else-if="error" style="color: #ef4444; margin-top: 10px;">
      ❌ Gagal memuat data: {{ error.message }}
    </div>

    <!-- State Sukses -->
    <ul v-else style="margin-top: 10px;">
      <li v-for="user in users" :key="user.id">
        <strong>{{ user.name }}</strong> — {{ user.email }}
      </li>
    </ul>
  </div>
</template>
```

**Hafalan:**

```text
const { data, pending, error, refresh } = await useFetch('/api/url')
```

---

<a id="bagian-4"></a>

# 4. 🟢 Opsi Kunci `useFetch` untuk Kinerja Optimal

## Konsep

`useFetch` menyediakan berbagai opsi konfigurasi untuk mengoptimalkan performa dan transfer payload:

1. **`lazy: true` (Non-blocking Navigation):**
   - Secara default (`await useFetch`), Nuxt akan **menunda navigasi halaman** sampai data selesai dimuat di server.
   - Dengan `lazy: true` (atau menggunakan `useLazyFetch`), halaman berpindah seketika (*0ms latency*), dan kita menampilkan skeleton loading via `pending`.
2. **`pick: ['id', 'title']` (Payload Trimmer):**
   - Hanya menyertakan field yang disebutkan ke dalam SSR payload. Menghemat ukuran HTML hingga 80%!
3. **`transform: (data) => ...`:**
   - Memodifikasi atau memfilter bentuk data sebelum diserialisasi ke payload.
4. **`query: { search: 'keyword', limit: 10 }`:**
   - Menyematkan query string parameter ke URL secara otomatis.

## Contoh

```vue
<script setup>
const searchQuery = ref('laptop')

const { data: products, pending } = await useFetch('/api/products', {
  lazy: true,                             // Halaman terbuka instan tanpa nunggu fetch
  pick: ['id', 'title', 'price'],         // Hanya ambil 3 field ini dari respon API
  query: { search: searchQuery, limit: 5 },// URL otomatis: /api/products?search=laptop&limit=5
  transform: (raw) => raw.data            // Ambil array di dalam properti { data: [...] }
})
</script>
```

**Hafalan:**

```text
lazy: true               → navigasi instan tanpa memblokir perpindahan halaman
pick: ['fieldA', 'fieldB']→ memangkas ukuran payload HTML hanya untuk field yang dibutuhkan
query: { key: val }      → menyematkan parameter query string ke URL request
```

---

<a id="bagian-5"></a>

# 5. 🟢 Composable `useAsyncData` untuk Kasus Lanjutan

## Konsep

Gunakan **`useAsyncData(key, handlerFunction)`** ketika Anda perlu:
1. Menggabungkan 2 atau lebih pemanggilan API secara paralel (`Promise.all`).
2. Mengambil data menggunakan SDK Database (misal: Supabase, Firebase, Prisma).

Parameter:
- `key` (String Unik): Pengenal cache data di SSR Payload.
- `handlerFunction`: Fungsi async yang mengembalikan data hasil.

## Contoh

```vue
<script setup>
// Mengambil Profil dan Statistik secara paralel dalam 1 payload SSR
const { data: dashboardData, pending } = await useAsyncData('user-dashboard-data', async () => {
  const [profile, stats] = await Promise.all([
    $fetch('/api/user/profile'),
    $fetch('/api/user/statistics')
  ])

  return { profile, stats }
})
</script>

<template>
  <div v-if="!pending">
    <h2>Halo, {{ dashboardData.profile.name }}</h2>
    <p>Total Transaksi: {{ dashboardData.stats.totalOrders }}</p>
  </div>
</template>
```

**Hafalan:**

```text
useAsyncData('unique-cache-key', async () => { return await customFetcher(); })
```

---

<a id="bagian-6"></a>

# 6. 🟢 Mekanisme Caching & Deduplication Berbasis `key`

## Konsep

Nuxt 3 secara otomatis membuatkan **Cache Key** untuk setiap `useFetch` berdasarkan URL dan opsinya.

Jika dua komponen di halaman yang sama memanggil URL yang sama:
`useFetch('/api/categories')`
Nuxt otomatis melakukan **Request Deduplication** (hanya menjalankan 1 network request dan membagikan hasilnya ke kedua komponen).

Anda juga dapat mendefinisikan `key` kustom secara eksplisit:
`useFetch('/api/items', { key: 'global-categories' })`

**Hafalan:**

```text
Deduplication Caching → Nuxt menggabungkan pemanggilan endpoint yang sama menjadi 1 request tunggal efisien
```

---

<a id="bagian-7"></a>

# 7. 🟢 Re-fetching Otomatis Berbasis Reaktivitas dengan Opsi `watch`

## Konsep

Seringkali kita ingin data otomatis di-fetch ulang ketika nilai filter input atau halaman paginasi berubah (misal: dropdown kategori berganti).

Gunakan opsi **`watch: [reactiveDependency]`**:
Setiap kali nilai di dalam array `watch` berubah, `useFetch` **otomatis memicu `refresh()`** dan memperbarui data di layar.

## Contoh

```vue
<script setup>
const selectedCategory = ref('ELEKTRONIK')
const currentPage = ref(1)

const { data: products, pending } = await useFetch('/api/products', {
  query: { category: selectedCategory, page: currentPage },
  // Otomatis fetch ulang saat kategori atau halaman berganti!
  watch: [selectedCategory, currentPage]
})
</script>

<template>
  <div>
    <select v-model="selectedCategory">
      <option value="ELEKTRONIK">Elektronik</option>
      <option value="FASHION">Fashion</option>
    </select>
    <button @click="currentPage++">Halaman Berikutnya ({{ currentPage }})</button>

    <div v-if="pending">⏳ Memperbarui katalog...</div>
    <ul v-else>
      <li v-for="p in products" :key="p.id">{{ p.name }}</li>
    </ul>
  </div>
</template>
```

**Hafalan:**

```text
watch: [reactiveVariable] → otomatis memicu re-fetch data saat variabel reaktif berubah nilainya
```

---

<a id="bagian-8"></a>

# 8. 🟢 Eksekusi Manual On-Demand dengan `immediate: false` & `execute()`

## Konsep

Jika Anda tidak ingin data diambil secara otomatis saat halaman pertama kali dimuat (misal: fitur pencarian yang baru berjalan setelah user menekan tombol *"Cari"*):

Gunakan opsi **`immediate: false`** dan panggil fungsi **`execute()`**:

## Contoh

```vue
<script setup>
const searchKeyword = ref('')

const { data: searchResults, pending, execute } = await useFetch('/api/search', {
  immediate: false, // Jangan fetch saat halaman terbuka awal
  query: { q: searchKeyword }
})

const handleSearchClick = () => {
  if (searchKeyword.value.trim()) {
    execute() // Eksekusi fetch secara manual on-demand!
  }
}
</script>

<template>
  <div>
    <input v-model="searchKeyword" placeholder="Ketik kata kunci..." />
    <button @click="handleSearchClick">Cari Sekarang</button>

    <div v-if="pending">Mencari...</div>
    <ul v-if="searchResults">
      <li v-for="res in searchResults" :key="res.id">{{ res.title }}</li>
    </ul>
  </div>
</template>
```

**Hafalan:**

```text
immediate: false + execute() → menonaktifkan auto-fetch awal dan memicu pemanggilan manual on-demand
```

---

<a id="bagian-9"></a>

# 9. 🟡 Pengenalan Nitro Server Engine & Direktori `server/api/`

## Konsep

Nuxt 3 bukan sekadar frontend framework, melainkan **Full-Stack Framework**. Di dalamnya tertanam **Nitro Server Engine** berbasis library HTTP super cepat bernama **H3**.

Keuntungan Nitro Server API:
1. **Zero Setup Backend:** Cukup buat file di folder `server/api/`, endpoint API backend langsung aktif!
2. **TypeScript End-to-End Type Safety:** Tipe data kembalian server API otomatis dikenali oleh `useFetch` di frontend tanpa mendefinisikan interface manual.
3. **Cross-Platform Deployment:** Otomatis dapat di-deploy ke Node.js, Vercel Serverless, Cloudflare Workers, Docker, AWS Lambda.

**Hafalan:**

```text
server/api/ → folder khusus penampung endpoint backend RESTful API berbasis Nitro Engine
```

---

<a id="bagian-10"></a>

# 10. 🟡 Menulis Endpoint API Pertama dengan `defineEventHandler`

## Konsep

Setiap file di dalam folder `server/api/` mengekspor default fungsi **`defineEventHandler((event) => { ... })`**.

Nilai yang Anda `return` dari fungsi handler (objek, array, string) **otomatis di-serialize menjadi JSON** dengan header `Content-Type: application/json` dan status HTTP `200 OK`.

## Contoh

File `server/api/hello.ts`:
```typescript
// Endpoint URL: http://localhost:3000/api/hello
export default defineEventHandler((event) => {
  return {
    success: true,
    message: "Halo dari Backend Server Nitro Nuxt 3!",
    serverTime: new Date().toISOString()
  }
})
```

## Output JSON

```json
{
  "success": true,
  "message": "Halo dari Backend Server Nitro Nuxt 3!",
  "serverTime": "2026-08-29T19:58:00.000Z"
}
```

**Hafalan:**

```text
export default defineEventHandler((event) => { return { status: 'success' }; })
```

---

<a id="bagian-11"></a>

# 11. 🟡 Method Matching pada Server Routes

## Konsep

Secara default, file `server/api/users.ts` akan menerima semua jenis HTTP method (GET, POST, PUT, DELETE).

Untuk membatasi endpoint hanya merespons method HTTP tertentu (*Method Suffix Matching*):
- `server/api/products.get.ts` $\rightarrow$ Hanya merespons `GET /api/products`
- `server/api/products.post.ts` $\rightarrow$ Hanya merespons `POST /api/products`
- `server/api/products.put.ts` $\rightarrow$ Hanya merespons `PUT /api/products`
- `server/api/products.delete.ts` $\rightarrow$ Hanya merespons `DELETE /api/products`

## Contoh

File `server/api/products.get.ts`:
```typescript
export default defineEventHandler((event) => {
  return [
    { id: 1, name: "Mechanical Keyboard", price: 850000 },
    { id: 2, name: "Ergonomic Mouse", price: 450000 }
  ]
})
```

File `server/api/products.post.ts`:
```typescript
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return { success: true, message: "Produk berhasil ditambahkan", data: body }
})
```

**Hafalan:**

```text
filename.get.ts / filename.post.ts → membatasi HTTP method yang diterima endpoint secara deklaratif
```

---

<a id="bagian-12"></a>

# 12. 🟡 Membaca Query Parameters dengan `getQuery(event)`

## Konsep

Untuk membaca query parameters dari URL (misal: `/api/search?keyword=laptop&limit=5`), gunakan fungsi **`getQuery(event)`** dari H3.

## Contoh

File `server/api/search.get.ts`:
```typescript
export default defineEventHandler((event) => {
  // Membaca URL Query String
  const query = getQuery(event)
  const keyword = query.keyword || ''
  const limit = Number(query.limit) || 10

  return {
    searchedKeyword: keyword,
    resultLimit: limit,
    data: [`Hasil 1 untuk ${keyword}`, `Hasil 2 untuk ${keyword}`]
  }
})
```

**Hafalan:**

```text
const query = getQuery(event); const keyword = query.keyword; → membaca URL query parameters di server
```

---

<a id="bagian-13"></a>

# 13. 🟡 Membaca Request Body JSON dengan `readBody(event)`

## Konsep

Saat client mengirimkan request `POST` atau `PUT` dengan payload JSON, gunakan fungsi asynchronous **`readBody(event)`** untuk mengekstrak dan mem-parsing JSON body secara otomatis.

## Contoh

File `server/api/orders.post.ts`:
```typescript
export default defineEventHandler(async (event) => {
  // Parsing JSON Body secara aman
  const body = await readBody(event)

  if (!body.productId || !body.quantity) {
    throw createError({
      statusCode: 400,
      statusMessage: "Field productId dan quantity wajib diisi!"
    })
  }

  return {
    orderId: "ORD-" + Date.now(),
    status: "CREATED",
    details: body
  }
})
```

**Hafalan:**

```text
const body = await readBody(event); → mem-parsing JSON payload body pada request POST/PUT
```

---

<a id="bagian-14"></a>

# 14. 🟡 Dynamic Server Routes & URL Params dengan `getRouterParam(event, 'id')`

## Konsep

Sama seperti halaman frontend, kita dapat membuat endpoint server dengan parameter URL dinamis menggunakan kurung siku `[param].ts`.

Untuk membaca parameter tersebut di server:
Gunakan fungsi **`getRouterParam(event, 'paramName')`**.

## Contoh

File `server/api/products/[id].get.ts`:
```typescript
// Endpoint URL: GET /api/products/101
export default defineEventHandler((event) => {
  const productId = getRouterParam(event, 'id')

  return {
    id: productId,
    name: `Detail Produk #${productId}`,
    inStock: true
  }
})
```

**Hafalan:**

```text
const id = getRouterParam(event, 'id') → mengekstrak parameter dinamis [id] dari path URL server API
```

---

<a id="bagian-15"></a>

# 15. 🟡 Penanganan Error Server Terstruktur dengan `createError`

## Konsep

Jika terjadi kesalahan validasi atau data tidak ditemukan di server API, jangan mengembalikan string biasa.

Gunakan fungsi **`createError({ statusCode, statusMessage, data })`**:
- Mengembalikan HTTP Status Code yang tepat (400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error).
- Format respon JSON otomatis seragam dan kompatibel dengan penanganan error di `useFetch` frontend.

## Contoh

```typescript
// server/api/users/[id].get.ts
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  if (id === '999') {
    throw createError({
      statusCode: 404,
      statusMessage: "User Tidak Ditemukan",
      data: { requestedId: id, timestamp: new Date() }
    })
  }

  return { id, name: "Budi Santoso" }
})
```

**Hafalan:**

```text
throw createError({ statusCode: 404, statusMessage: 'Not Found' }) → melempar response error HTTP terstandar
```

---

<a id="bagian-16"></a>

# 16. 🟡 Server Middleware di Folder `server/middleware/`

## Konsep

Setiap file di dalam folder **`server/middleware/`** akan dieksekusi **pada setiap request yang masuk ke server Nuxt** sebelum request tersebut diteruskan ke route handler.

Kasus Penggunaan:
- Logging request URL dan IP client.
- Memeriksa header otentikasi Bearer Token.
- Menambahkan context custom ke `event.context`.

## Contoh

File `server/middleware/logger.ts`:
```typescript
export default defineEventHandler((event) => {
  const method = getMethod(event)
  const url = getRequestURL(event).pathname

  console.log(`[Nitro Server Log] ${new Date().toLocaleTimeString()} - ${method} ${url}`)
})
```

**Hafalan:**

```text
server/middleware/ → middleware server global yang mencegat setiap request masuk ke aplikasi
```

---

<a id="bagian-17"></a>

# 17. 🔴 Nitro Server Storage & Cached Event Handlers

## Konsep

Untuk endpoint yang datanya jarang berubah (seperti daftar kurs mata uang atau konfigurasi sistem), menjalankan kalkulasi database berulang kali sangat membebani server.

Gunakan **`defineCachedEventHandler(handler, options)`**:
- Nitro otomatis meng-cache hasil respon di memori server.
- Opsi `maxAge`: Masa berlaku cache dalam detik (*Stale-While-Revalidate*).

## Contoh

```typescript
// server/api/rates.get.ts
export default defineCachedEventHandler((event) => {
  console.log("Menghitung kurs baru di server...")
  return { USD: 15500, EUR: 16800, updatedAt: new Date().toISOString() }
}, {
  maxAge: 60 * 10 // Cache berlaku selama 10 Menit
})
```

**Hafalan:**

```text
defineCachedEventHandler(fn, { maxAge: 600 }) → meng-cache respon endpoint di server selama waktu tertentu
```

---

<a id="bagian-18"></a>

# 18. 🔴 Mengonsumsi Server API Internal dari Frontend Nuxt

## Konsep

Ketika Anda membuat endpoint di `server/api/products.get.ts`, Anda dapat mengonsumsinya langsung dari halaman Vue frontend menggunakan:
`const { data } = await useFetch('/api/products')`

Keunggulan Full-Stack Nuxt:
- **Zero HTTP Overhead pada SSR:** Saat SSR di server, Nuxt memanggil handler `server/api/` secara internal via memori (*Direct Function Call*) **tanpa melalui koneksi soket jaringan TCP/HTTP lokal**. Ini membuat SSR Nuxt 3 luar biasa cepat!

**Hafalan:**

```text
Direct Function Call SSR → pemanggilan /api internal saat SSR dieksekusi di memori tanpa overhead jaringan HTTP
```

---

<a id="bagian-19"></a>

# 19. 🛠️ Peta Ingatan Cepat

```text
                      PETA ARSITEKTUR DATA FETCHING NUXT
                                      │
       ┌──────────────────────────────┼──────────────────────────────┐
       ▼                              ▼                              ▼
UNIVERSAL FETCH (CLIENT/SSR)  NITRO SERVER API (server/api)   H3 SERVER UTILITIES
├─ useFetch('/api/...')       ├─ defineEventHandler()         ├─ getQuery(event)
├─ useAsyncData(key, fn)      ├─ Method: .get.ts, .post.ts    ├─ readBody(event)
├─ $fetch() (Event Handler)   ├─ server/middleware/           ├─ getRouterParam(event)
└─ Options: lazy, pick, watch └─ defineCachedEventHandler()   └─ createError({ statusCode })
```

---

<a id="bagian-20"></a>

# 20. 📚 Tabel Ringkasan

| Fungsi / Composable | Lingkungan | Kegunaan & Karakteristik Utama |
|---|---|---|
| `useFetch(url, opts)` | Vue Component | Mengambil data dari endpoint dengan auto-caching SSR |
| `useAsyncData(key, fn)` | Vue Component | Membungkus logika async kustom / multi-promise |
| `$fetch(url, opts)` | Event Handler | HTTP client murni untuk mutasi data POST/PUT/DELETE |
| `defineEventHandler` | Server Nitro | Membuat endpoint API backend di `server/api/` |
| `getQuery(event)` | Server Nitro | Membaca URL query parameters (`?key=val`) di backend |
| `readBody(event)` | Server Nitro | Mem-parsing JSON request body pada request POST/PUT |
| `getRouterParam(event, id)` | Server Nitro | Membaca parameter dinamis `[id].ts` dari URL server |
| `createError(opts)` | Server Nitro | Melempar error HTTP standar (400, 404, 500) |
| `defineCachedEventHandler` | Server Nitro | Meng-cache output respon server di memori |

---

<a id="bagian-21"></a>

# 21. ⚡ Cheat Code Nuxt Data Fetching 10 Detik

```vue
<!-- 1. Frontend useFetch Template -->
<script setup>
const search = ref('')
const { data, pending, refresh } = await useFetch('/api/items', {
  lazy: true,
  query: { search },
  watch: [search]
})

const handleCreate = async (payload) => {
  await $fetch('/api/items', { method: 'POST', body: payload })
  refresh() // Segarkan daftar setelah simpan
}
</script>

<!-- 2. Backend Nitro API Template -->
// server/api/items.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.title) throw createError({ statusCode: 400, statusMessage: "Title required" })
  return { success: true, id: Date.now(), ...body }
})
```

---

<a id="bagian-22"></a>

# 22. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Kuasai useFetch Dasar & Opsi Kunci
├── Pahami mekanisme SSR Payload dan eliminasi Double Fetching
└── Gunakan opsi lazy: true dan pick untuk efisiensi transfer data
       │
       ▼
Langkah 2: Kuasai Reaktivitas & useAsyncData
├── Sinkronkan filter pencarian dengan opsi watch: [searchRef]
└── Bungkus multi-promises menggunakan useAsyncData('key', fn)
       │
       ▼
Langkah 3: Bangun Backend API dengan Nitro
├── Buat endpoint server/api/ dengan defineEventHandler
├── Bedakan file method (.get.ts, .post.ts, .delete.ts)
└── Ekstrak data via getQuery(), readBody(), dan getRouterParam()
       │
       ▼
Langkah 4: Standar Produksi & Keamanan Server
├── Terapkan penanganan error server via createError()
└── Pasang logging dan auth header check di server/middleware/
       │
       ▼
Langkah 5: Siap Melangkah ke Nuxt State Management & Auth Route Middleware!
```

---

<a id="bagian-23"></a>

# 23. 🏗️ Mini Project: Production-Ready Full-Stack Product Management & Search API Web App

Aplikasi web full-stack lengkap dan runnable yang mengintegrasikan: **Nitro RESTful Server API (`server/api/products`), H3 Handlers (`getQuery`, `readBody`, `createError`), Server Middleware Logging, Frontend `useFetch` dengan Live Search Watcher, Loading Skeletons, dan Mutasi Data via `$fetch`**.

### 1. Server Middleware Logging (`server/middleware/logger.ts`):
```typescript
export default defineEventHandler((event) => {
  const method = getMethod(event)
  const path = getRequestURL(event).pathname
  console.log(`📡 [API Log] ${method} ${path}`)
})
```

### 2. Backend Server GET & Search Endpoint (`server/api/products.get.ts`):
```typescript
// In-Memory Database Dummy
let productsDb = [
  { id: 1, name: "Mechanical Keyboard RGB", price: 850000, category: "AKSESORIS" },
  { id: 2, name: "Wireless Ergonomic Mouse", price: 450000, category: "AKSESORIS" },
  { id: 3, name: "Headset Gaming 7.1 Surround", price: 650000, category: "AUDIO" },
  { id: 4, name: "Monitor 27 Inch 4K IPS", price: 4500000, category: "DISPLAY" }
]

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.toLowerCase() : ''
  const category = query.category || 'ALL'

  let result = productsDb

  if (search) {
    result = result.filter(p => p.name.toLowerCase().includes(search))
  }

  if (category !== 'ALL') {
    result = result.filter(p => p.category === category)
  }

  return {
    success: true,
    total: result.length,
    data: result
  }
})
```

### 3. Backend Server POST Create Endpoint (`server/api/products.post.ts`):
```typescript
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validasi Input Server
  if (!body.name || !body.price) {
    throw createError({
      statusCode: 400,
      statusMessage: "Nama produk dan harga wajib diisi!"
    })
  }

  const newProduct = {
    id: Date.now(),
    name: String(body.name),
    price: Number(body.price),
    category: String(body.category || 'LAINNYA')
  }

  return {
    success: true,
    message: "Produk berhasil ditambahkan ke database Nitro!",
    data: newProduct
  }
})
```

### 4. Frontend Application Page (`pages/index.vue`):
```vue
<script setup>
useSeoMeta({
  title: 'Full-Stack Product Manager - Nuxt Nitro',
  description: 'Aplikasi manajemen produk full-stack dengan Nitro Server API dan useFetch.'
})

// State Filter Reaktif
const searchKeyword = ref('')
const selectedCategory = ref('ALL')

// State Form Tambah Produk
const newProduct = reactive({ name: '', price: '', category: 'AKSESORIS' })
const isSubmitting = ref(false)
const notification = ref(null)

// Universal Data Fetching dengan Live Watcher Reaktif
const { data: response, pending, error, refresh } = await useFetch('/api/products', {
  lazy: true,
  query: { search: searchKeyword, category: selectedCategory },
  watch: [searchKeyword, selectedCategory] // Otomatis fetch ulang saat filter berubah!
})

// Handler Submit Data Baru via $fetch
const handleAddProduct = async () => {
  if (!newProduct.name || !newProduct.price) {
    alert('Mohon lengkapi nama dan harga!')
    return
  }

  isSubmitting.value = true
  try {
    const res = await $fetch('/api/products', {
      method: 'POST',
      body: newProduct
    })

    notification.value = res.message
    newProduct.name = ''
    newProduct.price = ''
    refresh() // Segarkan daftar data setelah POST sukses
    setTimeout(() => { notification.value = null }, 3000)
  } catch (err) {
    alert(`Error: ${err.statusMessage || err.message}`)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div style="font-family: 'Segoe UI', sans-serif; max-width: 850px; margin: 30px auto; padding: 20px;">
    <header style="background: #0f172a; color: #fff; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
      <h1 style="margin: 0; color: #00dc82;">⚡ Nuxt 3 Full-Stack Product Hub</h1>
      <p style="margin: 6px 0 0 0; color: #94a3b8;">Universal Data Fetching & Nitro Server API Demo</p>
    </header>

    <!-- Notifikasi Sukses -->
    <div v-if="notification" style="background: #dcfce7; color: #166534; padding: 12px; border-radius: 6px; margin-bottom: 20px;">
      ✅ {{ notification }}
    </div>

    <!-- Form Tambah Produk (POST via $fetch) -->
    <section style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
      <h3 style="margin-top: 0;">+ Tambah Produk Baru</h3>
      <form @submit.prevent="handleAddProduct" style="display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 10px;">
        <input v-model="newProduct.name" placeholder="Nama Produk" style="padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;" />
        <input v-model="newProduct.price" type="number" placeholder="Harga (Rp)" style="padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;" />
        <select v-model="newProduct.category" style="padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;">
          <option value="AKSESORIS">Aksesoris</option>
          <option value="AUDIO">Audio</option>
          <option value="DISPLAY">Display</option>
        </select>
        <button :disabled="isSubmitting" type="submit" style="background: #00dc82; color: #000; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer;">
          {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
        </button>
      </form>
    </section>

    <!-- Toolbar Filter & Pencarian (Live Watcher) -->
    <section style="display: flex; justify-content: space-between; margin-bottom: 16px; gap: 12px;">
      <input
        v-model="searchKeyword"
        placeholder="Cari produk realtime (useFetch watcher)..."
        style="flex: 1; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 4px;"
      />
      <select v-model="selectedCategory" style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 4px;">
        <option value="ALL">Semua Kategori</option>
        <option value="AKSESORIS">Aksesoris</option>
        <option value="AUDIO">Audio</option>
        <option value="DISPLAY">Display</option>
      </select>
      <button @click="refresh()" style="padding: 8px 14px; cursor: pointer;">🔄 Refresh</button>
    </section>

    <!-- Status Loading / Error / Data List -->
    <div v-if="pending" style="text-align: center; padding: 30px; color: #2563eb;">
      ⏳ Sedang mengambil data dari Nitro API...
    </div>

    <div v-else-if="error" style="background: #fee2e2; color: #991b1b; padding: 16px; border-radius: 6px;">
      ❌ Terjadi kesalahan: {{ error.message }}
    </div>

    <div v-else-if="response?.data.length === 0" style="text-align: center; padding: 30px; color: #64748b;">
      Tidak ada produk yang cocok dengan pencarian.
    </div>

    <ul v-else style="list-style: none; padding: 0; margin: 0;">
      <li
        v-for="item in response?.data"
        :key="item.id"
        style="display: flex; justify-content: space-between; align-items: center; padding: 14px; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 8px; background: #fff;"
      >
        <div>
          <strong>{{ item.name }}</strong>
          <span style="margin-left: 8px; font-size: 12px; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">
            {{ item.category }}
          </span>
        </div>
        <div style="font-weight: bold; color: #16a34a;">
          Rp {{ item.price.toLocaleString('id-ID') }}
        </div>
      </li>
    </ul>
  </div>
</template>
```

## Hasil Output Tampilan Aplikasi & Respons Nitro API

```text
┌────────────────────────────────────────────────────────────────────────┐
│ ⚡ Nuxt 3 Full-Stack Product Hub                                       │
│ Universal Data Fetching & Nitro Server API Demo                        │
├────────────────────────────────────────────────────────────────────────┤
│ + Tambah Produk Baru                                                   │
│ [ Nama Produk       ] [ 500000    ] [ Aksesoris ▼ ] [ Simpan ]         │
├────────────────────────────────────────────────────────────────────────┤
│ [ Cari produk realtime (useFetch watcher)... ] [ Semua Kategori ▼ ] 🔄 │
│                                                                        │
│ • Mechanical Keyboard RGB   [AKSESORIS]   Rp 850.000                   │
│ • Wireless Ergonomic Mouse  [AKSESORIS]   Rp 450.000                   │
│ • Headset Gaming 7.1        [AUDIO]       Rp 650.000                   │
│ • Monitor 27 Inch 4K IPS    [DISPLAY]     Rp 4.500.000                 │
└────────────────────────────────────────────────────────────────────────┘
```

---

<a id="bagian-24"></a>

# 24. 🔗 Referensi Resmi

- [Nuxt 3 Data Fetching Documentation](https://nuxt.com/docs/getting-started/data-fetching)
- [Nitro Server Engine Official Documentation](https://nitro.unjs.io/)
- [H3 HTTP Framework Utilities Reference](https://www.jsdocs.io/package/h3)
- [Ofetch HTTP Client Documentation](https://github.com/unjs/ofetch)
