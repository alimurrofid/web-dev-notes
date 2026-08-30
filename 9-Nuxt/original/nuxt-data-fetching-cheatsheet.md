# Nuxt Data Fetching & Server API Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Nuxt 3.12+ (Nitro Server Engine & Vue 3) untuk pemula yang ingin memahami Universal Data Fetching (`useFetch`, `useAsyncData`, `$fetch`) dan menulis API backend sendiri di folder `server/api/`. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> Nuxt 3 menyediakan fungsi fetching universal yang mencegah fetch ganda saat SSR dan menyertakan Nitro Server Engine untuk membuat API backend langsung di proyek Nuxt.

## Daftar Isi

1. [useFetch Dasar](#1-usefetch-dasar)
2. [useFetch vs useAsyncData vs $fetch](#2-usefetch-vs-useasyncdata-vs-fetch)
3. [Opsi useFetch: lazy, pick, query](#3-opsi-usefetch-lazy-pick-query)
4. [Nitro Server API (server/api)](#4-nitro-server-api-serverapi)
5. [HTTP Methods pada Server Routes](#5-http-methods-pada-server-routes)
6. [Membaca Body dan Query](#6-membaca-body-dan-query)
7. [createError](#7-createerror)
8. [Server Middleware](#8-server-middleware)

---

# 1. useFetch Dasar

Mengambil data dari API dengan composable bawaan Nuxt 3.

```vue
<script setup>
const { data: users, pending, error, refresh } = await useFetch('https://jsonplaceholder.typicode.com/users')
</script>

<template>
  <div v-if="pending">Memuat...</div>
  <ul v-else>
    <li v-for="u in users" :key="u.id">{{ u.name }}</li>
  </ul>
</template>
```

---

# 2. useFetch vs useAsyncData vs $fetch

- **`useFetch(url)`:** Shortcut paling praktis untuk fetching URL langsung dengan integrasi SSR otomatis.
- **`useAsyncData(key, handler)`:** Digunakan jika fetcher memanggil multi-promise atau SDK library pihak ketiga.
- **`$fetch(url)`:** Digunakan murni di dalam event handler (seperti klik tombol submit form) tanpa SSR caching.

---

# 3. Opsi useFetch: lazy, pick, query

```javascript
const { data } = await useFetch('/api/products', {
  lazy: true,                  // Tidak memblokir navigasi halaman
  pick: ['id', 'title'],       // Hanya ambil field yang dibutuhkan
  query: { search: 'laptop' }  // Query string URL
})
```

---

# 4. Nitro Server API (server/api)

Membuat endpoint backend sendiri di dalam folder `server/api/`.

```typescript
// server/api/hello.ts
export default defineEventHandler((event) => {
  return { message: "Halo dari Nitro Server Engine!" }
})
```

---

# 5. HTTP Methods pada Server Routes

- `server/api/products.get.ts` $\rightarrow$ Endpoint `GET /api/products`
- `server/api/products.post.ts` $\rightarrow$ Endpoint `POST /api/products`
- `server/api/products.delete.ts` $\rightarrow$ Endpoint `DELETE /api/products`

---

# 6. Membaca Body dan Query

Menggunakan helper bawaan H3 di Nitro:

```typescript
// server/api/submit.post.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)       // Membaca URL query (?q=...)
  const body = await readBody(event)  // Membaca JSON body POST

  return { query, body, success: true }
})
```

---

# 7. createError

Melempar error HTTP terstruktur dari server Nitro.

```typescript
// server/api/products/[id].ts
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (id === '0') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Produk tidak ditemukan!'
    })
  }
  return { id, name: 'Produk Contoh' }
})
```

---

# 8. Server Middleware

Mencegat setiap request yang masuk ke server Nuxt.

```typescript
// server/middleware/log.ts
export default defineEventHandler((event) => {
  console.log('Request Server Masuk:', event.node.req.url)
})
```
