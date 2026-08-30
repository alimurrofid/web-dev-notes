# Nuxt State, Middleware & Modules Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Nuxt 3.12+ (Nuxt 4 Ready & Vue 3) untuk pemula yang ingin memahami Global State SSR-friendly (`useState`), Session Cookies (`useCookie`), Route Middleware (Navigation Guards), Runtime Config, Plugins, dan Route Rules Hybrid Rendering. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> Nuxt 3 menyediakan manajemen state terisolasi per request untuk mencegah kebocoran data antar user pada server SSR dan sistem middleware deklaratif untuk mengamankan rute.

## Daftar Isi

1. [useState Composable](#1-usestate-composable)
2. [Custom Composables State](#2-custom-composables-state)
3. [Route Middleware Dasar](#3-route-middleware-dasar)
4. [Tiga Jenis Middleware](#4-tiga-jenis-middleware)
5. [navigateTo dan abortNavigation](#5-navigateto-dan-abortnavigation)
6. [useCookie](#6-usecookie)
7. [Runtime Config (useRuntimeConfig)](#7-runtime-config-useruntimeconfig)
8. [Nuxt Plugins](#8-nuxt-plugins)
9. [Route Rules (Hybrid Rendering)](#9-route-rules-hybrid-rendering)

---

# 1. useState Composable

State reaktif bersama yang aman untuk SSR (kebal terhadap Cross-Request State Pollution).

```vue
<script setup>
const counter = useState('counter', () => 0)
</script>

<template>
  <button @click="counter++">Hitungan: {{ counter }}</button>
</template>
```

---

# 2. Custom Composables State

Membungkus `useState` ke dalam composable modular di folder `composables/`.

```typescript
// composables/useAuth.ts
export const useAuth = () => {
  const user = useState('auth_user', () => null)
  const login = (userData) => { user.value = userData }
  const logout = () => { user.value = null }
  return { user, login, logout }
}
```

---

# 3. Route Middleware Dasar

Mencegat navigasi halaman untuk memeriksa autentikasi atau izin akses.

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth()
  if (!user.value) {
    return navigateTo('/login')
  }
})
```

---

# 4. Tiga Jenis Middleware

1. **Inline / Anonymous:** Didefinisikan langsung di `definePageMeta({ middleware: () => ... })`.
2. **Named Middleware:** Dibuat di `middleware/auth.ts`, dipanggil via `definePageMeta({ middleware: 'auth' })`.
3. **Global Middleware:** Dibuat dengan akhiran `.global.ts` (misal: `middleware/log.global.ts`), otomatis berjalan di semua rute.

---

# 5. navigateTo dan abortNavigation

- `navigateTo('/target')` : Mengalihkan ke rute lain secara aman di server & browser.
- `abortNavigation()` : Membatalkan perpindahan rute dan mengembalikan error 403 / 404.

---

# 6. useCookie

Membaca dan menulis cookie yang otomatis tersinkronisasi di server SSR dan browser klien.

```typescript
const token = useCookie('auth_token', {
  maxAge: 60 * 60 * 24 * 7, // 7 Hari
  sameSite: 'lax'
})
```

---

# 7. Runtime Config (useRuntimeConfig)

Memisahkan variabel lingkungan publik (bisa diakses frontend) dan privat (hanya di server).

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecretKey: 'rahasia-server', // Hanya Server
    public: {
      apiBaseUrl: 'https://api.toko.com' // Publik Frontend
    }
  }
})

// Penggunaan di kode:
const config = useRuntimeConfig()
console.log(config.public.apiBaseUrl)
```

---

# 8. Nuxt Plugins

Menyediakan helper global ke seluruh aplikasi via `plugins/`.

```typescript
// plugins/toast.ts
export default defineNuxtPlugin(() => {
  return {
    provide: {
      toast: (msg: string) => alert(msg)
    }
  }
})
// Penggunaan: const { $toast } = useNuxtApp(); $toast('Halo!')
```

---

# 9. Route Rules (Hybrid Rendering)

Mengatur strategi render per URL di `nuxt.config.ts`.

```typescript
export default defineNuxtConfig({
  routeRules: {
    '/admin/**': { ssr: false },        // Client-Side SPA
    '/blog/**': { swr: 3600 },          // Incremental Static Regeneration (1 Jam)
    '/about': { prerender: true }       // Static Site Generation (SSG)
  }
})
```
