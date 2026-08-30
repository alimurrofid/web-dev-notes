# Nuxt Dasar Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Nuxt 3.12+ (Nuxt 4 Ready & Vue 3 Script Setup) untuk pemula yang ingin memahami Server-Side Rendering (SSR), File-Based Routing, Auto-Imports, Layouts, SEO Metadata, dan ClientOnly components. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> Nuxt adalah full-stack framework berbasis Vue 3 yang memberikan kemampuan SSR, SSG, auto-import, dan integrasi backend Nitro secara out-of-the-box.

## Daftar Isi

1. [Struktur Folder Nuxt 3](#1-struktur-folder-nuxt-3)
2. [Auto-Imports](#2-auto-imports)
3. [File-Based Routing Dasar](#3-file-based-routing-dasar)
4. [Dynamic Routing](#4-dynamic-routing)
5. [NuxtLink](#5-nuxtlink)
6. [Layouts System](#6-layouts-system)
7. [definePageMeta](#7-definepagemeta)
8. [SEO & useSeoMeta](#8-seo--useseometa)
9. [ClientOnly Component](#9-clientonly-component)
10. [Error Page (error.vue)](#10-error-page-errorvue)

---

# 1. Struktur Folder Nuxt 3

Nuxt membaca struktur folder secara otomatis:
- `pages/` : Rute halaman web otomatis.
- `components/` : Komponen UI auto-import.
- `layouts/` : Tata letak bersama.
- `composables/` : Fungsi komposisi auto-import.
- `public/` : Aset statis publik.
- `server/` : Endpoint backend Nitro.

---

# 2. Auto-Imports

Fungsi reaktif Vue (`ref`, `computed`, `watch`) dan komponen di folder `components/` otomatis tersedia tanpa baris `import`.

```vue
<script setup>
// ref otomatis ter-import tanpa "import { ref } from 'vue'"
const count = ref(0)
</script>

<template>
  <button @click="count++">Hitungan: {{ count }}</button>
</template>
```

---

# 3. File-Based Routing Dasar

- `pages/index.vue` $\rightarrow$ URL: `/`
- `pages/about.vue` $\rightarrow$ URL: `/about`
- `pages/contact.vue` $\rightarrow$ URL: `/contact`

---

# 4. Dynamic Routing

Gunakan kurung siku `[param].vue` untuk rute dinamis.

```vue
<!-- pages/products/[id].vue -->
<script setup>
const route = useRoute()
const productId = route.params.id
</script>

<template>
  <h2>Detail Produk ID: {{ productId }}</h2>
</template>
```

---

# 5. NuxtLink

Navigasi internal pintar dengan auto-prefetching saat link terlihat di layar.

```vue
<template>
  <NuxtLink to="/about">Tentang Kami</NuxtLink>
</template>
```

---

# 6. Layouts System

Membuat tata letak bersama di folder `layouts/`.

```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <header><h1>Header Toko</h1></header>
    <main>
      <slot /> <!-- Konten halaman dirender di sini -->
    </main>
    <footer>© 2026</footer>
  </div>
</template>
```

---

# 7. definePageMeta

Menentukan layout atau metadata kustom per halaman.

```vue
<!-- pages/admin.vue -->
<script setup>
definePageMeta({
  layout: 'admin'
})
</script>
```

---

# 8. SEO & useSeoMeta

Mengatur metadata Search Engine Optimization (SEO) dan Open Graph dinamis.

```vue
<script setup>
useSeoMeta({
  title: 'Judul Halaman Toko',
  description: 'Deskripsi singkat halaman untuk mesin pencari.',
  ogTitle: 'Judul untuk Media Sosial'
})
</script>
```

---

# 9. ClientOnly Component

Membungkus komponen yang hanya boleh dirender di browser klien (menghindari error SSR hydration).

```vue
<template>
  <ClientOnly fallback-tag="span" fallback="Memuat chart...">
    <ChartComponent />
  </ClientOnly>
</template>
```

---

# 10. Error Page (error.vue)

Menangkap error global 404 / 500 di root proyek.

```vue
<!-- error.vue -->
<script setup>
const props = defineProps({ error: Object })
const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div>
    <h2>Error {{ error.statusCode }}</h2>
    <p>{{ error.message }}</p>
    <button @click="handleError">Kembali ke Beranda</button>
  </div>
</template>
```
