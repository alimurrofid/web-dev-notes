# Vue Router Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Vue 3 + Composition API + Vue Router 4, dengan contoh singkat, diagram, output, dan pola yang mudah diingat.
>
> Semua contoh utama menggunakan `<script setup>` dan pola API Vue Router modern.

## Daftar Isi

1. [Pengenalan SPA](#1-pengenalan-spa)
2. [Router Library](#2-router-library)
3. [Membuat Project](#3-membuat-project)
4. [Setup](#4-setup)
5. [Routing](#5-routing)
6. [Route Param](#6-route-param)
7. [Matching Syntax](#7-matching-syntax)
8. [Query Param](#8-query-param)
9. [Nested Route](#9-nested-route)
10. [Navigation](#10-navigation)
11. [Programmatic Navigation](#11-programmatic-navigation)
12. [Named Route](#12-named-route)
13. [Named View](#13-named-view)
14. [Redirect](#14-redirect)
15. [Props](#15-props)
16. [History Mode](#16-history-mode)
17. [Lazy Loading Route](#17-lazy-loading-route)
18. [RouterView Slot](#18-routerview-slot)
19. [Navigation Guards](#19-navigation-guards)
20. [Referensi Lengkap](#20-referensi-lengkap)
21. [Peta Ingatan Cepat](#21-peta-ingatan-cepat)
22. [Tabel Ringkasan](#22-tabel-ringkasan)

---

# 1. Pengenalan SPA

**SPA (Single Page Application)** adalah aplikasi web yang memuat satu halaman utama lalu mengganti tampilan berdasarkan URL tanpa melakukan full page reload setiap kali berpindah halaman.

Tanpa router:

```text
Klik link
   ↓
Browser request halaman baru
   ↓
Server
   ↓
HTML baru
   ↓
Full page reload
```

Dengan Vue Router:

```text
Klik <RouterLink>
      ↓
Vue Router
      ↓
URL berubah
      ↓
Route dicocokkan
      ↓
Component yang sesuai
      ↓
<RouterView>
      ↓
UI berubah
```

Contoh struktur aplikasi:

```text
App.vue
   │
   └── <RouterView />
          │
          ├── HomeView.vue
          ├── AboutView.vue
          └── UserView.vue
```

Misalnya:

```text
/          → HomeView
/about     → AboutView
/users/10  → UserView
```

**Kunci:** router menghubungkan **URL → component**.

---

# 2. Router Library

Untuk Vue 3, router resmi adalah **Vue Router**.

Vue Router menyediakan:

```text
Static routes
Dynamic routes
Route params
Query params
Nested routes
Named routes
Named views
Redirect
Navigation guards
History modes
Lazy loading
Scroll behavior
```

Instalasi:

```bash
npm install vue-router
```

Diagram:

```text
Vue App
   │
   ├── Components
   ├── State
   └── Vue Router
          │
          ├── URL
          ├── Routes
          ├── Navigation
          └── RouterView
```

**Ingat:**

```text
Vue       → membangun UI
Router    → mengatur URL + halaman
```

---

# 3. Membuat Project

Buat project Vue:

```bash
npm create vue@latest
```

Contoh pilihan:

```text
Project name: vue-router-app
Add TypeScript? No
Add JSX? No
Add Vue Router? Yes
Add Pinia? sesuai kebutuhan
Add Vitest? sesuai kebutuhan
```

Kemudian:

```bash
cd vue-router-app
npm install
npm run dev
```

Jika Vue Router belum dipilih saat membuat project:

```bash
npm install vue-router
```

Struktur sederhana:

```text
vue-router-app/
├── src/
│   ├── components/
│   ├── views/
│   │   ├── HomeView.vue
│   │   └── AboutView.vue
│   ├── router/
│   │   └── index.js
│   ├── App.vue
│   └── main.js
├── public/
├── index.html
└── package.json
```

**Ingat:**

```text
views/
   ↓
halaman yang dipetakan oleh router

router/index.js
   ↓
konfigurasi URL → component
```

---

# 4. Setup

## 4.1 Membuat Router

`src/router/index.js`:

```js
import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'

const routes = [
  {
    path: '/',
    component: HomeView,
  },
  {
    path: '/about',
    component: AboutView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
```

Diagram:

```text
createRouter()
      │
      ├── history
      │
      └── routes
            │
            ├── /
            │    └── HomeView
            │
            └── /about
                 └── AboutView
```

## 4.2 Register ke Vue

`src/main.js`:

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(router)
  .mount('#app')
```

Urutannya:

```text
createApp(App)
      ↓
.use(router)
      ↓
.mount('#app')
```

Router harus dipasang sebelum `mount()`.

## 4.3 RouterView

`App.vue`:

```vue
<template>
  <RouterView />
</template>
```

Sekarang router dapat menentukan component mana yang ditampilkan.

```text
URL
 │
 ▼
Router
 │
 ▼
matched route
 │
 ▼
RouterView
 │
 ▼
Component
```

---

# 5. Routing

Routing paling sederhana:

```js
const routes = [
  {
    path: '/',
    component: HomeView,
  },
  {
    path: '/about',
    component: AboutView,
  },
  {
    path: '/contact',
    component: ContactView,
  },
]
```

Mapping:

```text
URL                 Component

/          ───────→ HomeView
/about     ───────→ AboutView
/contact   ───────→ ContactView
```

Contoh `HomeView.vue`:

```vue
<template>
  <h1>Home</h1>
</template>
```

Contoh `AboutView.vue`:

```vue
<template>
  <h1>About</h1>
</template>
```

**Output ketika membuka `/`:**

```text
Home
```

**Output ketika membuka `/about`:**

```text
About
```

### Catch-all sederhana untuk 404

Untuk Vue Router 4, route catch-all menggunakan parameter dengan regex:

```js
const routes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
  },
]
```

Diagram:

```text
URL tidak cocok
      ↓
/:pathMatch(.*)*
      ↓
NotFoundView
```

---

# 6. Route Param

Route param digunakan ketika bagian URL bersifat dinamis.

Contoh:

```js
const routes = [
  {
    path: '/users/:id',
    component: UserView,
  },
]
```

Maka:

```text
/users/1
/users/2
/users/budi
/users/andi
```

semuanya dapat menggunakan `UserView`.

Diagram:

```text
/users/:id
    │
    ├── /users/1
    ├── /users/2
    └── /users/budi
```

## Membaca param

Gunakan `useRoute()`:

```vue
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

console.log(route.params.id)
</script>

<template>
  <h1>User {{ route.params.id }}</h1>
</template>
```

Jika URL:

```text
/users/42
```

**Output:**

```text
User 42
```

## Beberapa param

```js
{
  path: '/posts/:postId/comments/:commentId',
  component: CommentView,
}
```

URL:

```text
/posts/10/comments/5
```

Param:

```js
route.params.postId
// "10"

route.params.commentId
// "5"
```

**Ingat:**

```text
:param
   ↓
route.params
```

---

# 7. Matching Syntax

Vue Router memiliki syntax pencocokan path yang lebih kuat daripada route statis biasa.

## 7.1 Static segment

```js
{
  path: '/about',
  component: AboutView,
}
```

Hanya cocok dengan:

```text
/about
```

## 7.2 Dynamic segment

```js
{
  path: '/users/:id',
  component: UserView,
}
```

Cocok dengan:

```text
/users/1
/users/abc
/users/budi
```

## 7.3 Optional param

Contoh pola optional:

```js
{
  path: '/users/:id?',
  component: UserView,
}
```

Konsep:

```text
/users
/users/10
```

keduanya dapat dicocokkan sesuai pola route.

## 7.4 Repeatable param

Contoh:

```js
{
  path: '/files/:pathMatch(.*)*',
  component: FilesView,
}
```

Dapat digunakan untuk menangkap path yang panjang.

Contoh:

```text
/files/a
/files/a/b
/files/a/b/c
```

## 7.5 Custom regex

```js
{
  path: '/users/:id(\\d+)',
  component: UserView,
}
```

Konsep:

```text
:id(\\d+)
    ↓
harus berupa angka
```

Contoh:

```text
/users/123  → cocok
/users/budi → tidak cocok
```

> **Catatan:** ketika menulis regex di JavaScript string, backslash biasanya perlu di-escape menjadi `\\`.

## 7.6 Catch-all

```js
{
  path: '/:pathMatch(.*)*',
  component: NotFoundView,
}
```

Digunakan untuk halaman 404.

**Peta syntax:**

```text
/users/:id
       ↓
dynamic

/users/:id?
       ↓
optional

/users/:id(\\d+)
       ↓
custom regex

/:pathMatch(.*)*
       ↓
catch-all / repeatable
```

---

# 8. Query Param

Query param berada setelah `?`.

Contoh URL:

```text
/products?search=vue&page=2
```

Query:

```text
search = vue
page   = 2
```

## Membaca query

```vue
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

console.log(route.query.search)
console.log(route.query.page)
</script>
```

Output:

```text
vue
2
```

## Navigasi dengan query

```js
router.push({
  path: '/products',
  query: {
    search: 'vue',
    page: 2,
  },
})
```

Hasil URL:

```text
/products?search=vue&page=2
```

## Param vs Query

```text
Route Param
/users/10
     ↑
     id

Query Param
/users?role=admin
       ↑
       role
```

Biasanya:

```text
/:id
 ↓
identitas/resource

?search=...
?page=...
?sort=...
 ↓
filter / opsi tampilan
```

**Ingat:**

```text
route.params → bagian path
route.query  → bagian setelah ?
```

---

# 9. Nested Route

Nested route digunakan ketika halaman memiliki halaman anak.

Contoh:

```text
/user/10
   │
   ├── profile
   └── posts
```

Konfigurasi:

```js
const routes = [
  {
    path: '/user/:id',
    component: UserLayout,
    children: [
      {
        path: 'profile',
        component: UserProfile,
      },
      {
        path: 'posts',
        component: UserPosts,
      },
    ],
  },
]
```

URL:

```text
/user/10/profile
/user/10/posts
```

## Parent harus memiliki RouterView

`UserLayout.vue`:

```vue
<template>
  <div>
    <h1>User</h1>

    <RouterView />
  </div>
</template>
```

Diagram:

```text
/user/10
    │
    ▼
UserLayout
    │
    └── <RouterView>
           │
           ├── profile → UserProfile
           │
           └── posts   → UserPosts
```

## Default child route

Jika ingin child tampil saat membuka:

```text
/user/10
```

gunakan:

```js
children: [
  {
    path: '',
    component: UserHome,
  },
  {
    path: 'profile',
    component: UserProfile,
  },
]
```

Diagram:

```text
/user/10
   ↓
UserHome

/user/10/profile
   ↓
UserProfile
```

**Kunci:** `children` membuat hubungan parent → child, sedangkan `<RouterView>` di parent menjadi tempat child dirender.

---

# 10. Navigation

Vue Router menyediakan `RouterLink` untuk navigasi deklaratif.

```vue
<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>

  <RouterView />
</template>
```

Diagram:

```text
<RouterLink>
      │
      ▼
Vue Router
      │
      ▼
URL berubah
      │
      ▼
RouterView
```

## Active link

Vue Router otomatis memberikan class aktif pada `RouterLink`.

Contoh:

```vue
<RouterLink to="/about">
  About
</RouterLink>
```

Ketika `/about` sedang aktif, link dapat memiliki class:

```text
router-link-active
router-link-exact-active
```

## RouterLink vs `<a>`

```text
<RouterLink>
    ↓
client-side navigation

<a href="...">
    ↓
browser navigation biasa
```

Untuk berpindah antar halaman dalam SPA, biasanya gunakan:

```vue
<RouterLink to="/about">
  About
</RouterLink>
```

---

# 11. Programmatic Navigation

Programmatic navigation berarti berpindah route menggunakan JavaScript.

Gunakan `useRouter()`:

```vue
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToAbout() {
  router.push('/about')
}
</script>

<template>
  <button @click="goToAbout">
    About
  </button>
</template>
```

## `push`

```js
router.push('/about')
```

Menambahkan entry ke history browser.

```text
Home
 ↓
About
 ↓
Profile
```

Back:

```text
Profile
 ↓ back
About
```

## `replace`

```js
router.replace('/login')
```

Mengganti entry history saat ini.

```text
Home
 ↓
replace → Login
```

Back tidak akan kembali ke entry yang digantikan dengan cara yang sama seperti `push`.

## `go`

```js
router.go(-1)
```

Kembali satu history entry.

```js
router.go(1)
```

Maju satu entry.

## Dengan route object

```js
router.push({
  path: '/users',
  query: {
    page: 2,
  },
})
```

## Dengan named route

```js
router.push({
  name: 'user',
  params: {
    id: 10,
  },
})
```

**Ingat:**

```text
router.push()
    ↓
navigasi + history baru

router.replace()
    ↓
navigasi + mengganti history saat ini

router.go()
    ↓
bergerak di browser history
```

---

# 12. Named Route

Named route memberikan nama pada route.

```js
const routes = [
  {
    path: '/users/:id',
    name: 'user',
    component: UserView,
  },
]
```

Sekarang kita dapat navigasi menggunakan nama:

```js
router.push({
  name: 'user',
  params: {
    id: 10,
  },
})
```

Hasil:

```text
/users/10
```

## RouterLink

```vue
<RouterLink
  :to="{
    name: 'user',
    params: { id: 10 }
  }"
>
  User 10
</RouterLink>
```

## Mengapa named route?

Tanpa name:

```js
router.push('/users/10')
```

Dengan name:

```js
router.push({
  name: 'user',
  params: { id: 10 },
})
```

Keuntungannya:

```text
Path berubah
   ↓
kode navigasi berbasis name
   ↓
tidak perlu menyebarkan string URL
```

**Ingat:**

```text
name = identifier route
```

Gunakan nama route yang unik.

---

# 13. Named View

**Named View** digunakan ketika satu route perlu menampilkan beberapa component pada beberapa `<RouterView>` sekaligus.

Contoh layout:

```text
┌──────────────────────────┐
│ Header                   │
├───────────┬──────────────┤
│ Sidebar   │ Main         │
│           │              │
│           │              │
└───────────┴──────────────┘
```

`App.vue`:

```vue
<template>
  <RouterView name="header" />
  <RouterView name="sidebar" />
  <RouterView />
</template>
```

Route:

```js
const routes = [
  {
    path: '/',
    components: {
      default: MainView,
      header: HeaderView,
      sidebar: SidebarView,
    },
  },
]
```

Diagram:

```text
Route
 │
 ├── default → MainView
 ├── header  → HeaderView
 └── sidebar → SidebarView
```

`RouterView` tanpa `name` berarti menggunakan nama:

```text
default
```

Contoh:

```vue
<RouterView />
```

setara dengan:

```vue
<RouterView name="default" />
```

**Ingat:**

```text
component
   ↓
satu RouterView

components
   ↓
beberapa named RouterView
```

---

# 14. Redirect

Redirect membuat route otomatis mengarah ke route lain.

## String redirect

```js
const routes = [
  {
    path: '/home',
    redirect: '/',
  },
]
```

Ketika membuka:

```text
/home
```

akan diarahkan ke:

```text
/
```

## Named redirect

```js
{
  path: '/old',
  redirect: {
    name: 'home',
  },
}
```

## Function redirect

```js
{
  path: '/search',
  redirect: to => ({
    name: 'search',
    query: to.query,
  }),
}
```

Konsep:

```text
/user-old
    ↓
redirect
    ↓
/users
```

### Redirect vs alias

Redirect:

```text
/old
 ↓
/new
```

URL akan berpindah ke target.

Alias:

```js
{
  path: '/users',
  component: UsersView,
  alias: '/people',
}
```

Kedua URL dapat merender component yang sama:

```text
/users
/people
```

Perbedaan sederhana:

```text
redirect
  ↓
arah ke route lain

alias
  ↓
route tambahan untuk component yang sama
```

---

# 15. Props

Secara default, route params dibaca melalui `useRoute()`:

```vue
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <h1>User {{ route.params.id }}</h1>
</template>
```

Tetapi route dapat meneruskan params sebagai **props**.

## Boolean props

Route:

```js
{
  path: '/users/:id',
  component: UserView,
  props: true,
}
```

Component:

```vue
<script setup>
defineProps({
  id: String,
})
</script>

<template>
  <h1>User {{ id }}</h1>
</template>
```

Diagram:

```text
URL
/users/10
   │
   ▼
params.id = "10"
   │
   ▼
props
   │
   ▼
UserView
```

## Function props

Lebih fleksibel:

```js
{
  path: '/search',
  component: SearchView,
  props: route => ({
    query: route.query.q,
    page: Number(route.query.page || 1),
  }),
}
```

Component:

```vue
<script setup>
defineProps({
  query: String,
  page: Number,
})
</script>
```

URL:

```text
/search?q=vue&page=2
```

Props:

```text
query = "vue"
page  = 2
```

**Kelebihan props:**

```text
Component
   ↓
tidak terlalu bergantung pada Vue Router
   ↓
lebih mudah diuji / digunakan ulang
```

**Ingat:**

```text
route.params
    ↓
props: true
    ↓
component props
```

---

# 16. History Mode

Vue Router mendukung beberapa history implementation.

## 16.1 Web History

```js
import { createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes,
})
```

URL terlihat normal:

```text
https://example.com/
https://example.com/about
https://example.com/users/10
```

Diagram:

```text
Browser URL
    │
    ▼
HTML5 History API
    │
    ▼
Vue Router
```

## 16.2 Hash History

```js
import { createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
```

URL:

```text
https://example.com/#/
https://example.com/#/about
https://example.com/#/users/10
```

Keuntungan:

```text
server tidak perlu melakukan fallback
ke index.html untuk setiap route
```

## 16.3 Memory History

```js
import { createMemoryHistory } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
```

History disimpan di memory dan tidak bergantung pada URL browser seperti web history.

Umumnya berguna untuk:

```text
SSR
testing
environment tertentu
```

## Web vs Hash

```text
Web History
/about
   ↓
URL bersih
   ↓
perlu konfigurasi server

Hash History
/#/about
   ↓
lebih mudah di-host
   ↓
URL memiliki #
```

### Masalah penting Web History

Jika server tidak dikonfigurasi dengan benar:

```text
User buka langsung:
/users/10

        ↓

Server mencari:
/users/10

        ↓

404
```

Server harus mengembalikan aplikasi SPA (`index.html`) untuk route yang bukan file statis.

**Ingat:**

```text
createWebHistory()
    ↓
URL bersih + server fallback

createWebHashHistory()
    ↓
URL # + setup server lebih sederhana
```

---

# 17. Lazy Loading Route

Lazy loading membuat component route dimuat ketika route tersebut dibutuhkan.

Tanpa lazy loading:

```js
import Home from './views/HomeView.vue'
import About from './views/AboutView.vue'
import User from './views/UserView.vue'
```

Semua component dapat masuk ke bundle awal.

Dengan lazy loading:

```js
const Home = () => import('./views/HomeView.vue')
const About = () => import('./views/AboutView.vue')
const User = () => import('./views/UserView.vue')
```

Atau langsung:

```js
const routes = [
  {
    path: '/about',
    component: () => import('../views/AboutView.vue'),
  },
]
```

Diagram:

```text
Initial load
     │
     ▼
App chunk
     │
     ├── route /about belum dimuat
     ├── route /users belum dimuat
     └── route /admin belum dimuat

User membuka /admin
     │
     ▼
download chunk admin
     │
     ▼
render AdminView
```

Contoh grouping chunk:

```js
const User = () =>
  import(/* webpackChunkName: "user" */ './User.vue')
```

Untuk bundler modern seperti Vite, biasanya cukup menggunakan dynamic import dan biarkan bundler mengatur chunk.

**Kapan berguna?**

```text
Aplikasi besar
     ↓
banyak halaman
     ↓
bundle awal besar
     ↓
lazy loading
     ↓
beban awal lebih kecil
```

**Ingat:**

```text
component: () => import(...)
                     ↑
              load saat dibutuhkan
```

---

# 18. RouterView Slot

> **Catatan:** bagian ini sering salah disebut "RouterView Slow". Istilah yang benar adalah **RouterView Slot**.

`RouterView` menyediakan slot yang memberi akses ke component route yang sedang aktif.

Dasar:

```vue
<RouterView v-slot="{ Component }">
  <component :is="Component" />
</RouterView>
```

Secara sederhana:

```text
RouterView
    │
    └── slot
          │
          └── Component
                 ↓
          route component aktif
```

## RouterView + Transition

```vue
<RouterView v-slot="{ Component }">
  <Transition>
    <component :is="Component" />
  </Transition>
</RouterView>
```

Konsep:

```text
Route berubah
    ↓
Component lama
    ↓
Transition
    ↓
Component baru
```

## RouterView + KeepAlive

```vue
<RouterView v-slot="{ Component }">
  <KeepAlive>
    <component :is="Component" />
  </KeepAlive>
</RouterView>
```

Digunakan ketika route component tertentu ingin dipertahankan state-nya.

## Transition + KeepAlive

```vue
<RouterView v-slot="{ Component }">
  <Transition>
    <KeepAlive>
      <component :is="Component" />
    </KeepAlive>
  </Transition>
</RouterView>
```

**Ingat:**

```text
<RouterView />
    ↓
simple

<RouterView v-slot="{ Component }">
    ↓
kontrol component route
    ↓
Transition / KeepAlive / ref / props
```

---

# 19. Navigation Guards

Navigation guard digunakan untuk:

```text
mengizinkan navigation
menghentikan navigation
redirect
menjalankan validasi sebelum navigation
```

Diagram:

```text
User navigasi
      │
      ▼
Navigation Guard
      │
      ├── return true / undefined
      │       ↓
      │    lanjut
      │
      ├── return false
      │       ↓
      │    batal
      │
      └── return route
              ↓
           redirect
```

## 19.1 Global `beforeEach`

```js
router.beforeEach((to, from) => {
  console.log('from:', from.fullPath)
  console.log('to:', to.fullPath)
})
```

## Auth guard

Misalnya:

```js
router.beforeEach((to) => {
  const isLoggedIn = false

  if (to.meta.requiresAuth && !isLoggedIn) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
      },
    }
  }
})
```

Route:

```js
{
  path: '/dashboard',
  name: 'dashboard',
  component: DashboardView,
  meta: {
    requiresAuth: true,
  },
}
```

Diagram:

```text
/dashboard
    │
    ▼
requiresAuth?
    │
    ├── tidak
    │    ↓
    │  Dashboard
    │
    └── ya
         ↓
      login?
         │
         ├── ya → Dashboard
         │
         └── tidak → /login
```

## 19.2 `beforeEnter`

Guard khusus route:

```js
{
  path: '/admin',
  component: AdminView,
  beforeEnter: () => {
    const isAdmin = false

    if (!isAdmin) {
      return { name: 'home' }
    }
  },
}
```

`beforeEnter` hanya terkait masuk ke route tersebut. Perubahan params/query/hash pada route yang sama tidak selalu memicu guard ini.

## 19.3 `onBeforeRouteLeave`

Dalam component:

```vue
<script setup>
import { onBeforeRouteLeave } from 'vue-router'

onBeforeRouteLeave(() => {
  const confirmed = window.confirm(
    'Yakin meninggalkan halaman?'
  )

  if (!confirmed) {
    return false
  }
})
</script>
```

Cocok untuk:

```text
form belum disimpan
editor
draft
unsaved changes
```

## 19.4 `onBeforeRouteUpdate`

```vue
<script setup>
import { onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteUpdate((to, from) => {
  console.log(to.params.id)
})
</script>
```

Berguna ketika component yang sama digunakan kembali tetapi route location berubah.

Contoh:

```text
/users/1
    ↓
/users/2
```

Component `UserView` dapat digunakan kembali.

## Guard dapat async

```js
router.beforeEach(async (to) => {
  const user = await getCurrentUser()

  if (to.meta.requiresAuth && !user) {
    return { name: 'login' }
  }
})
```

**Ingat:**

```text
beforeEach
    ↓
global

beforeEnter
    ↓
per-route

onBeforeRouteLeave
    ↓
keluar component

onBeforeRouteUpdate
    ↓
route berubah, component dipakai ulang
```

---

# 20. Referensi Lengkap

## 20.1 API Utama

```js
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
  createMemoryHistory,
  useRouter,
  useRoute,
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
} from 'vue-router'
```

## 20.2 Router instance

```js
const router = useRouter()

router.push(...)
router.replace(...)
router.go(...)
router.back()
router.forward()
```

## 20.3 Current route

```js
const route = useRoute()

route.path
route.fullPath
route.name
route.params
route.query
route.hash
route.matched
route.meta
```

Contoh:

```text
URL:
/users/10?tab=posts#comments

route.path
→ /users/10

route.fullPath
→ /users/10?tab=posts#comments

route.params
→ { id: "10" }

route.query
→ { tab: "posts" }

route.hash
→ #comments
```

## 20.4 RouterLink

```vue
<RouterLink to="/">
  Home
</RouterLink>
```

Dengan params:

```vue
<RouterLink
  :to="{
    name: 'user',
    params: { id: 10 }
  }"
>
  User
</RouterLink>
```

Dengan query:

```vue
<RouterLink
  :to="{
    path: '/search',
    query: { q: 'vue' }
  }"
>
  Search
</RouterLink>
```

## 20.5 RouterView

```vue
<RouterView />
```

Named view:

```vue
<RouterView name="sidebar" />
```

Slot:

```vue
<RouterView v-slot="{ Component }">
  <component :is="Component" />
</RouterView>
```

## 20.6 Route object

Bentuk umum:

```js
{
  path: '/users/:id',
  name: 'user',
  component: UserView,
  props: true,
  meta: {
    requiresAuth: true,
  },
  beforeEnter: () => {
    // ...
  },
}
```

## 20.7 Meta

`meta` adalah data tambahan yang dapat ditempelkan pada route.

```js
{
  path: '/admin',
  component: AdminView,
  meta: {
    requiresAuth: true,
    role: 'admin',
  },
}
```

Dibaca:

```js
const route = useRoute()

console.log(route.meta.requiresAuth)
```

Umum digunakan bersama navigation guard.

## 20.8 Scroll Behavior

Router dapat mengatur posisi scroll setelah navigation.

```js
const router = createRouter({
  history: createWebHistory(),
  routes,

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    return {
      top: 0,
    }
  },
})
```

Konsep:

```text
Navigation
    ↓
scrollBehavior
    ↓
atur posisi scroll
```

## 20.9 Dynamic Route

Route dapat ditambahkan saat aplikasi berjalan:

```js
router.addRoute({
  path: '/admin',
  name: 'admin',
  component: AdminView,
})
```

Menghapus:

```js
router.removeRoute('admin')
```

Mengecek:

```js
router.hasRoute('admin')
```

Mendapatkan semua route:

```js
router.getRoutes()
```

## 20.10 Navigation Failure

Navigasi dapat menghasilkan failure tertentu.

```js
const failure = await router.push('/about')

if (failure) {
  console.log('Navigation tidak berhasil')
}
```

Untuk pemeriksaan lebih spesifik:

```js
import {
  isNavigationFailure,
  NavigationFailureType,
} from 'vue-router'
```

Contoh:

```js
if (
  isNavigationFailure(
    failure,
    NavigationFailureType.aborted
  )
) {
  console.log('Navigation dibatalkan')
}
```

---

# 21. Peta Ingatan Cepat

## A. Alur Router

```text
User klik link
      │
      ▼
RouterLink
      │
      ▼
Navigation
      │
      ▼
Navigation Guard
      │
      ├── cancel
      ├── redirect
      └── lanjut
             │
             ▼
        Route Matching
             │
             ▼
        Route Component
             │
             ▼
         RouterView
             │
             ▼
              UI
```

---

## B. URL Anatomy

```text
https://example.com/users/10?tab=posts#comments
                    │       │          │
                    │       │          └── hash
                    │       └───────────── query
                    └───────────────────── path + param
```

Lebih spesifik:

```text
/users/:id
    │
    └── route.params.id

?tab=posts
    │
    └── route.query.tab

#comments
    │
    └── route.hash
```

---

## C. Route → Component

```text
{
  path: '/about',
  component: AboutView
}

        ↓

/about

        ↓

AboutView

        ↓

<RouterView />
```

---

## D. Dynamic Route

```text
/users/:id
      │
      ▼
route.params.id
      │
      ├── 1
      ├── 2
      └── 10
```

---

## E. Navigation

```text
<RouterLink>
     ↓
deklaratif

router.push()
     ↓
programmatic

router.replace()
     ↓
ganti history saat ini

router.go()
     ↓
gerak di history
```

---

## F. Named Route

```text
name: 'user'
      │
      ▼
router.push({
  name: 'user',
  params: { id: 10 }
})
      │
      ▼
/users/10
```

---

## G. Nested Route

```text
Parent Route
     │
     ├── component
     │
     └── children
            │
            ▼
       <RouterView />
            │
            ├── Child A
            └── Child B
```

---

## H. Named View

```text
Route
 │
 ├── default  → Main
 ├── header   → Header
 └── sidebar  → Sidebar
```

---

## I. Redirect

```text
/old
 │
 ▼
redirect
 │
 ▼
/new
```

---

## J. Props

```text
route.params
      │
      ▼
props: true
      │
      ▼
Component
```

---

## K. History

```text
createWebHistory()
      ↓
/about

createWebHashHistory()
      ↓
#/about

createMemoryHistory()
      ↓
history di memory
```

---

## L. Lazy Loading

```text
component: () => import(...)
                  │
                  ▼
           load on demand
                  │
                  ▼
               chunk
```

---

## M. Guards

```text
Navigation
    ↓
beforeEach
    ↓
beforeEnter
    ↓
route component
    ↓
onBeforeRouteUpdate / Leave
```

---

# 22. Tabel Ringkasan

| Materi | Fungsi | Kata kunci |
|---|---|---|
| Pengenalan SPA | Navigasi tanpa full reload | SPA |
| Router Library | Routing resmi Vue | `vue-router` |
| Membuat Project | Membuat aplikasi | Vite |
| Setup | Memasang router | `createRouter()` |
| Routing | URL → component | `routes` |
| Route Param | Data dinamis di path | `:id`, `route.params` |
| Matching Syntax | Pola pencocokan URL | `?`, regex, `*` |
| Query Param | Filter/opsi URL | `route.query` |
| Nested Route | Route bertingkat | `children` |
| Navigation | Link antar route | `RouterLink` |
| Programmatic Navigation | Navigasi dari JS | `router.push()` |
| Named Route | Identitas route | `name` |
| Named View | Banyak view dalam satu route | `components` |
| Redirect | Mengarahkan route | `redirect` |
| Props | Params → component props | `props: true` |
| History Mode | Cara router menyimpan URL | `createWebHistory()` |
| Lazy Loading | Memuat route saat dibutuhkan | `import()` |
| RouterView Slot | Kontrol rendering route component | `v-slot` |
| Navigation Guards | Proteksi/kontrol navigation | `beforeEach()` |
| Meta | Metadata route | `meta` |
| Scroll Behavior | Kontrol posisi scroll | `scrollBehavior()` |
| Dynamic Routing | Tambah/hapus route | `addRoute()` |
| Navigation Failure | Menangani kegagalan navigasi | `isNavigationFailure()` |

---

# Cheat Code Vue Router 10 Detik

> **`createRouter()` membuat router. `routes` menghubungkan URL dengan component. `<RouterView>` menampilkan component route aktif. `<RouterLink>` melakukan navigasi deklaratif. `useRouter()` dipakai untuk navigasi dari JavaScript. `useRoute()` membaca route saat ini. `:id` membuat route param. `route.params` membaca param. `route.query` membaca query. `children` membuat nested route. `name` membuat named route. `components` membuat named views. `redirect` mengarahkan route. `props: true` meneruskan params sebagai props. `createWebHistory()` membuat URL HTML5 yang bersih. `() => import(...)` membuat lazy-loaded route. Navigation guards mengontrol apakah navigation boleh diteruskan.**

---

# Urutan Belajar yang Disarankan

```text
1. Pengenalan SPA
       ↓
2. Router Library
       ↓
3. Membuat Project
       ↓
4. Setup
       ↓
5. Routing
       ↓
6. RouterLink + RouterView
       ↓
7. Route Param
       ↓
8. Query Param
       ↓
9. Nested Route
       ↓
10. Programmatic Navigation
        ↓
11. Named Route
        ↓
12. Redirect
        ↓
13. Props
        ↓
14. History Mode
        ↓
15. Lazy Loading
        ↓
16. RouterView Slot
        ↓
17. Navigation Guards
        ↓
18. Meta + Scroll Behavior
        ↓
19. Dynamic Routing
```

---

# Mini Project — User Dashboard

Contoh untuk menggabungkan routing, params, nested route, named route, props, dan guard.

## Struktur

```text
src/
├── views/
│   ├── LoginView.vue
│   ├── DashboardView.vue
│   ├── UserProfile.vue
│   └── UserPosts.vue
└── router/
    └── index.js
```

## Router

```js
import {
  createRouter,
  createWebHistory,
} from 'vue-router'

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import UserProfile from '../views/UserProfile.vue'
import UserPosts from '../views/UserPosts.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/dashboard/:id',
    name: 'dashboard',
    component: DashboardView,
    props: true,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'profile',
        component: UserProfile,
      },
      {
        path: 'posts',
        name: 'posts',
        component: UserPosts,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const isLoggedIn = true

  if (to.meta.requiresAuth && !isLoggedIn) {
    return {
      name: 'login',
    }
  }
})

export default router
```

## DashboardView.vue

```vue
<script setup>
defineProps({
  id: String,
})
</script>

<template>
  <div>
    <h1>Dashboard User {{ id }}</h1>

    <nav>
      <RouterLink
        :to="{
          name: 'profile',
          params: { id }
        }"
      >
        Profile
      </RouterLink>

      <RouterLink
        :to="{
          name: 'posts',
          params: { id }
        }"
      >
        Posts
      </RouterLink>
    </nav>

    <RouterView />
  </div>
</template>
```

URL:

```text
/dashboard/10
```

Output:

```text
Dashboard User 10

Profile | Posts

Profile content
```

URL:

```text
/dashboard/10/posts
```

Output:

```text
Dashboard User 10

Profile | Posts

Posts content
```

Diagram:

```text
/dashboard/10
      │
      ▼
DashboardView
      │
      └── RouterView
             │
             ├── /dashboard/10
             │       ↓
             │   UserProfile
             │
             └── /dashboard/10/posts
                     ↓
                 UserPosts
```

Konsep yang sudah digabung:

```text
createRouter
     │
     ├── createWebHistory
     │
     ├── routes
     │
     ├── named route
     │
     ├── route param
     │
     ├── props
     │
     ├── nested route
     │
     ├── RouterLink
     │
     ├── RouterView
     │
     └── navigation guard
```

---

# Kunci Utama Vue Router

Pahami alur ini terlebih dahulu:

```text
URL
 │
 ▼
Route Matching
 │
 ├── params
 ├── query
 ├── hash
 └── meta
 │
 ▼
Navigation Guards
 │
 ├── lanjut
 ├── cancel
 └── redirect
 │
 ▼
Route Component
 │
 ▼
RouterView
 │
 ▼
UI
```

Dan pahami 8 API inti berikut:

```text
createRouter()
     ↓
membuat router

createWebHistory()
     ↓
mengatur history

RouterLink
     ↓
navigasi deklaratif

RouterView
     ↓
tempat render route

useRouter()
     ↓
navigasi dari JS

useRoute()
     ↓
membaca route

router.push()
     ↓
berpindah route

router.beforeEach()
     ↓
mengontrol navigation
```

---

# Referensi Resmi

- Vue Router — Introduction:
  https://router.vuejs.org/introduction

- Vue Router — Getting Started:
  https://router.vuejs.org/guide/

- Dynamic Route Matching:
  https://router.vuejs.org/guide/essentials/dynamic-matching.html

- Nested Routes:
  https://router.vuejs.org/guide/essentials/nested-routes.html

- Programmatic Navigation:
  https://router.vuejs.org/guide/essentials/navigation.html

- Named Routes:
  https://router.vuejs.org/guide/essentials/named-routes.html

- Named Views:
  https://router.vuejs.org/guide/essentials/named-views.html

- Redirect and Alias:
  https://router.vuejs.org/guide/essentials/redirect-and-alias.html

- Passing Props to Route Components:
  https://router.vuejs.org/guide/essentials/passing-props.html

- History Modes:
  https://router.vuejs.org/guide/essentials/history-mode.html

- Lazy Loading Routes:
  https://router.vuejs.org/guide/advanced/lazy-loading.html

- RouterView Slot:
  https://router.vuejs.org/guide/advanced/router-view-slot.html

- Navigation Guards:
  https://router.vuejs.org/guide/advanced/navigation-guards.html

- Dynamic Routing:
  https://router.vuejs.org/guide/advanced/dynamic-routing.html

- API Reference:
  https://router.vuejs.org/api/

> **Catatan versi:** Cheatsheet ini ditulis untuk **Vue 3 + Vue Router 4**. API Vue Router 4 menggunakan `createRouter()` dan konfigurasi `history`, bukan pola `new Router()`/`mode` yang digunakan pada Vue Router 3.
