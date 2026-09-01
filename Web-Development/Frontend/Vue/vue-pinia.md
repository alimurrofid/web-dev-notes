---
title: "Vue Pinia"
description: "Global state management modern dengan Pinia untuk Vue 3: Option vs Setup Stores, State, Getters, Actions, Plugins, dan Persisted State."
order: 3
tags:
  - web-development
  - frontend
  - vue
  - pinia
  - state-management
---

# Vue Pinia

> **Target:** pemula yang sudah memahami dasar Vue 3 + Composition API (component, props, emit, `ref`, `computed`), lalu ingin mengenal state management dengan Pinia.
> **Versi:** Pinia 2.x / Vue 3.x
> **Prasyarat:** [[vue-dasar|Vue Dasar]]
> Fokus modul pembelajaran ini: **pengenalan → setup → store → state → $patch/$reset → storeToRefs → getter → action → global state → setup store → store composition → $subscribe/$onAction → typescript → ssr → plugins → mini project**.
> Semua contoh utama menggunakan `<script setup>` dan **Option Store**, lalu diperdalam dengan **Setup Store** agar mudah membandingkan keduanya.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami untuk mulai mengelola state bersama antar-komponen

🟡 Lanjutan
→ pelajari setelah konsep dasar store nyaman

🔴 Advanced / Reference
→ penting ketika kebutuhan aplikasi meningkat
```

Mental model:

```text
              Pinia Store (Global State)
          ┌────────────────────────────────┐
          │                                │
          │  State    (data / ref)         │
          │    │                           │
          │    ▼                           │
          │  Getters  (computed)           │
          │    │                           │
          │    ▼                           │
          │  Actions  (methods / functions)│
          │                                │
          └────────────────────────────────┘
             ▲     │
  read/write │     │ reactivity
             │     ▼
      ┌──────────────────┐
      │  Vue Components  │
      │ (Navbar, Card,   │
      │  Checkout, dll.) │
      └──────────────────┘
```

**Hafalan:**

```text
State   → data utama
Getter  → nilai turunan (computed)
Action  → fungsi / methods
Store   → tempat ketiganya
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Pinia](#bagian-1)
2. [Setup & Instalasi](#bagian-2)
3. [Membuat Store](#bagian-3)
4. [State](#bagian-4)
5. [Mengubah State dengan `$patch dan $reset`](#bagian-5)
6. [Destructuring dengan storeToRefs](#bagian-6)
7. [Getters](#bagian-7)
8. [Actions](#bagian-8)

### 🟡 Lanjutan

9. [Global State & Pola Akses Komponen](#bagian-9)
10. [Setup Store (Composition API Style)](#bagian-10)
11. [Store Composition (Akses Lintas Store)](#bagian-11)
12. [Mengamati Store (`$subscribe dan $onAction`)](#bagian-12)
13. [Pinia dengan TypeScript](#bagian-13)

### 🔴 Advanced / Reference

14. [Store di Luar Component & SSR](#bagian-14)
15. [Pinia Plugins & Persist State](#bagian-15)
16. [Peta Ingatan Cepat](#bagian-16)
17. [Tabel Ringkasan](#bagian-17)
18. [Cheat Code Pinia 10 Detik](#bagian-18)
19. [Urutan Belajar yang Disarankan](#bagian-19)
20. [Mini Project: Shopping Cart Terpadu](#bagian-20)
21. [Referensi Resmi](#bagian-21)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan Pinia

#### Konsep

**Pinia** adalah state management library resmi untuk Vue.

Sederhananya:

```text
Component A ──┐
              │
Component B ──┼──> Pinia Store
              │        │
Component C ──┘        ▼
                    Shared State
```

Tanpa store, komunikasi data antar-component bisa menjadi panjang (*prop drilling*):

```text
       Parent Component
              │
              │ props: { user }
              ▼
        Child Component
              │
              │ props: { user }
              ▼
      Grandchild Component
              │
              │ props: { user } (hanya perantara)
              ▼
      UserBadge Component  <── Butuh data user di sini!
```

Dengan Pinia:

```text
Component A ─────┐
                 │
Component B ─────┼──> Store
                 │      │
Component C ─────┘      ▼
                    State bersama
```

Pinia store menyimpan **state dan business logic** yang tidak terikat pada satu component tree. Konsep utamanya adalah **state, getters, dan actions**, yang dapat dipahami seperti `data`, `computed`, dan `methods` pada component Vue.

#### Kapan menggunakan Pinia?

Cocok untuk data yang:

```text
dipakai banyak component
harus bertahan ketika berpindah halaman
memiliki business logic bersama
```

Contoh data yang tepat masuk ke Pinia:

```text
Sesi Login Pengguna (User Auth)
Keranjang Belanja (Shopping Cart)
Preferensi Tema (Dark / Light Mode)
Notifikasi Global (Toast / Alerts)
Filter Pencarian Produk Lintas Halaman
```

Tidak semua data harus masuk store. Data yang hanya digunakan satu component lebih baik tetap menjadi local state:

```text
Modal sedang terbuka?  ──> Local State (ref di dalam .vue)
Input form sementara?  ──> Local State (ref di dalam .vue)
Tab aktif halaman ini? ──> Local State (ref di dalam .vue)
```

#### Model mental Pinia

```text
              Pinia Store
          ┌─────────────────┐
          │                 │
          │     State       │
          │       │         │
          │       ▼         │
          │    Getters      │
          │       │         │
          │       ▼         │
          │    Actions      │
          │                 │
          └─────────────────┘
             ▲     │
  read/write │     │ reactivity
             │     ▼
          Components
```

**Hafalan:**

```text
State   → data
Getter  → computed
Action  → method
Store   → tempat ketiganya
```

**Kunci:** Mulai dengan local state. Masukkan ke Pinia hanya ketika data benar-benar dipakai banyak component atau harus bertahan lintas halaman.

---

<a id="bagian-2"></a>

## 2. 🟢 Setup & Instalasi

#### Konsep

Pinia didaftarkan ke aplikasi Vue sebagai plugin dengan `createPinia()`.

#### Install Pinia

```bash
npm install pinia
```

#### Pasang Pinia

`src/main.js`:

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)

app.mount('#app')
```

#### Diagram Alur Setup

```text
       createApp(App)
             │
             │ inisialisasi aplikasi Vue
             ▼
       createPinia()
             │
             │ buat root instance Pinia
             ▼
       app.use(pinia)
             │
             │ daftarkan plugin ke seluruh komponen
             ▼
       app.mount('#app')
             │
             ▼
       Pinia Aktif & Siap Digunakan
```

Setelah `app.use(pinia)`, store Pinia dapat digunakan oleh component di aplikasi.

#### Struktur folder

```text
src/
├── components/
├── views/
├── stores/               <── Folder khusus store
│   ├── counter.js
│   ├── user.js
│   └── cart.js
├── App.vue
└── main.js
```

Biasanya setiap store diletakkan pada file terpisah:

```text
stores/
   │
   ├── user.js
   ├── cart.js
   └── product.js
```

Pinia mendukung banyak store dan pola modular.

**Hafalan:**

```text
createPinia() → app.use(pinia) → store tersedia di aplikasi
```

**Best Practice:** Simpan setiap store di file terpisah dalam folder `src/stores/`.

---

<a id="bagian-3"></a>

## 3. 🟢 Membuat Store

#### Konsep

**Store** adalah tempat untuk menyimpan state dan logic yang ingin digunakan bersama. Store dibuat menggunakan `defineStore()` dan membutuhkan **id unik**. Konvensi nama function store biasanya `use...Store`, misalnya `useUserStore` atau `useCartStore`.

#### Membuat Store

`src/stores/counter.js`:

```js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),

  getters: {
    doubleCount: (state) => state.count * 2,
  },

  actions: {
    increment() {
      this.count++
    },
  },
})
```

#### Diagram Anatomi Store

```text
       ┌───────────────────────────────────────┐
       │   useCounterStore (ID: 'counter')     │
       ├───────────────────────────────────────┤
       │  State   : count = 0                  │
       │  Getter  : doubleCount (count * 2)    │
       │  Action  : increment()                │
       └───────────────────┬───────────────────┘
                           │
                           │ useCounterStore()
                           ▼
       ┌───────────────────────────────────────┐
       │              Component                │
       │  <p>{{ counter.count }}</p>           │
       │  <button @click="counter.increment()">│
       └───────────────────────────────────────┘
```

#### Menggunakan Store

Di component:

```html
<script setup>
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
</script>

<template>
  <p>Count: {{ counter.count }}</p>
  <p>Double: {{ counter.doubleCount }}</p>

  <button @click="counter.increment()">
    Tambah
  </button>
</template>
```

#### Output awal

```text
Count: 0
Double: 0

[ Tambah ]
```

Klik tombol `[ Tambah ]`:

```text
Count: 1
Double: 2

[ Tambah ]
```

#### Store adalah reactive

Instance store dapat dibaca dan diubah langsung:

```js
const counter = useCounterStore()

counter.count++
```

Pinia memang dirancang agar state pada store dapat diakses langsung tanpa wrapper verbose seperti pada pola Vuex lama.

**Hafalan:**

```text
defineStore('id', { ... }) → membuat definisi store
useCounterStore()          → mengambil instance store di komponen
```

**Kesalahan Umum:**

❌ Memanggil `defineStore()` di dalam component.  
✅ `defineStore()` dipanggil di file store, lalu `useStore()` dipanggil di component.

---

<a id="bagian-4"></a>

## 4. 🟢 State

#### Konsep

**State** adalah data utama yang disimpan oleh store. Pada Option Store, state didefinisikan sebagai function yang mengembalikan object initial state.

#### Membuat State

```js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: 'Budi',
    age: 20,
    isLoggedIn: false,
    items: [],
  }),
})
```

#### Membaca State

```html
<script setup>
import { useUserStore } from '@/stores/user'

const user = useUserStore()
</script>

<template>
  <p>{{ user.name }}</p>
  <p>{{ user.age }}</p>
</template>
```

#### Output

```text
Budi
20
```

#### Mengubah State Langsung

State dapat diubah langsung dari component:

```js
const user = useUserStore()

user.name = 'Andi'
user.age = 21
```

#### Diagram Alur Mutasi State

```text
       user.name = 'Andi'
               │
               │ mutasi langsung pada proxy store
               ▼
       State di Pinia Berubah
               │
               │ melacak dependensi komponen
               ▼
       DOM Komponen Diperbarui Otomatis
```

#### State yang belum memiliki nilai

Tetap deklarasikan property sejak awal:

```js
state: () => ({
  user: null,
  items: [],
})
```

Jangan menambahkan property yang tidak pernah didefinisikan di `state()`:

```js
// ❌ Jangan lakukan ini
store.newProperty = 'hello'
```

**Hafalan:**

```text
state: () => ({ semuaStateAwal })
→ semua state wajib dideklarasikan sejak awal agar dapat dilacak
```

**Kesalahan Umum:**

❌ Menambahkan property baru ke store di luar fungsi `state()`.  
✅ Deklarasikan semua state di awal, termasuk yang nilainya masih `null` atau `[]`.

---

<a id="bagian-5"></a>

## 5. 🟢 Mengubah State dengan `$patch dan $reset`

#### Konsep

Pinia menyediakan method bawaan `$patch()` untuk mengubah beberapa state sekaligus dalam 1 kali batch update dan `$reset()` untuk mengembalikan state ke kondisi awal.

#### Menggunakan `$patch` dengan Objek

```js
const user = useUserStore()

user.$patch({
  name: 'Andi',
  age: 21,
})
```

#### Menggunakan `$patch` dengan Fungsi Callback

Untuk perubahan yang melibatkan array atau mutasi bersyarat:

```js
user.$patch((state) => {
  state.items.push({ id: 1, text: 'Buku' })
  state.age++
  state.isLoggedIn = true
})
```

Diagram alur `$patch`:

```text
Mutasi A (name)  ──┐
Mutasi B (age)   ──┼──> $patch() ──> 1x Batch Update ke DOM
Mutasi C (items) ──┘
```

#### Reset State: `$reset()`

Pada **Option Store**, Pinia menyediakan method `$reset()` untuk mengembalikan nilai ke kondisi default saat store dibuat:

```js
const user = useUserStore()

// State kembali ke name: 'Budi', age: 20, isLoggedIn: false
user.$reset()
```

#### Diagram Alur `$reset`

```text
user.name ('Andi') ──┐
                     │ ──> user.$reset() ──> Initial State (Budi, 20)
user.age (21)      ──┘
```

**Hafalan:**

```text
$patch() → ubah banyak state sekaligus dalam 1 batch
$reset() → kembalikan seluruh state ke nilai awal
```

---

<a id="bagian-6"></a>

## 6. 🟢 Destructuring dengan storeToRefs

#### Konsep

Ketika kita melakukan destructuring langsung pada objek store, **reaktivitas state dan getter akan hilang**:

```js
const store = useCounterStore()

// ❌ SALAH: count dan doubleCount menjadi variabel biasa (bukan reactive lagi)
const { count, doubleCount } = store
```

Agar destructuring tetap mempertahankan sifat reactive, gunakan **`storeToRefs()`**.

#### Cara Penggunaan yang Benar

```html
<script setup>
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()

// ✅ BENAR: state dan getter dibungkus storeToRefs
const { count, doubleCount } = storeToRefs(counter)

// ✅ Action di-destructure LANGSUNG tanpa storeToRefs
const { increment } = counter
</script>

<template>
  <p>{{ count }} / {{ doubleCount }}</p>
  <button @click="increment">Tambah</button>
</template>
```

#### Diagram Ekstraksi Reaktif

```text
              ┌───────────────────────────────┐
              │       useCounterStore()       │
              └───────┬───────────────┬───────┘
                      │               │
        state/getters │               │ actions
                      ▼               ▼
              ┌───────────────┐ ┌───────────────┐
              │ storeToRefs() │ │  Destructure  │
              │               │ │   Langsung    │
              └───────┬───────┘ └───────┬───────┘
                      │                 │
                      ▼                 ▼
               Tetap Reaktif      Fungsi Action
                (ref.value)         (method)
```

**Hafalan:**

```text
storeToRefs(store) → untuk state & getter
action             → ambil langsung dari store
```

**Kesalahan Umum:**

❌ Membungkus action ke dalam `storeToRefs(store)`.  
✅ `storeToRefs` hanya untuk data reaktif (state dan getter).

---

<a id="bagian-7"></a>

## 7. 🟢 Getters

#### Konsep

**Getter** adalah nilai turunan dari state, konsepnya mirip dengan `computed` pada component Vue. Getter otomatis di-cache dan hanya dihitung ulang jika dependensinya berubah.

#### Getter sederhana

```js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 10,
  }),

  getters: {
    doubleCount: (state) => state.count * 2,
  },
})
```

Component:

```html
<script setup>
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
</script>

<template>
  <p>Count: {{ counter.count }}</p>
  <p>Double: {{ counter.doubleCount }}</p>
</template>
```

#### Output

```text
Count: 10
Double: 20
```

#### Getter menggunakan `this`

Jika getter ingin mengakses getter lain, gunakan fungsi biasa (bukan arrow function):

```js
getters: {
  doubleCount: (state) => state.count * 2,

  quadrupleCount() {
    return this.doubleCount * 2
  },
}
```

Hasil:

```text
count          = 10
doubleCount    = 20
quadrupleCount = 40
```

#### Getter yang menerima parameter (Return a Function)

Getter dapat mengembalikan fungsi jika membutuhkan argumen dinamis:

```js
getters: {
  getTodoById: (state) => {
    return (id) => state.todos.find(todo => todo.id === id)
  },
}
```

Di component:

```html
<script setup>
const todoStore = useTodoStore()
const targetTodo = todoStore.getTodoById(2)
</script>
```

#### Diagram Alur Getter

```text
       State Utama (count = 10)
                 │
                 │ hitung turunan data
                 ▼
       Getter doubleCount (computed: count * 2)
                 │
                 │ cache otomatis hasil = 20
                 ▼
       Tampilan Komponen (UI Render)
```

#### Getter bukan tempat side effect

```text
getter → hitung / turunkan nilai (pure function)
action → jalankan logic / mutasi / side effect
```

**Hafalan:**

```text
State → Getter → derived value
Getter = computed milik store
```

**Kesalahan Umum:**

❌ Menjalankan side effect (API request, localStorage) di dalam getter.  
✅ Getter hanya untuk menghitung dan mengembalikan nilai.

---

<a id="bagian-8"></a>

## 8. 🟢 Actions

#### Konsep

**Action** adalah function yang berisi logic atau business logic pada store. Action setara dengan method pada component Vue, dan dapat menggunakan `this` untuk mengakses state, getter, dan action lain.

#### Membuat Action

```js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),

  actions: {
    increment() {
      this.count++
    },

    decrement() {
      this.count--
    },

    add(amount) {
      this.count += amount
    },
  },
})
```

#### Diagram Siklus Action

```text
       ┌───────────────────────────────┐
       │           Component           │
       └───────────────┬───────────────┘
                       │
                       │ store.increment()
                       ▼
       ┌───────────────────────────────┐
       │         Pinia Action          │
       │         (this.count++)        │
       └───────────────┬───────────────┘
                       │
                       │ mutasi data
                       ▼
       ┌───────────────────────────────┐
       │         Reactive State        │
       └───────────────┬───────────────┘
                       │
                       │ reaktivitas
                       ▼
       ┌───────────────────────────────┐
       │           UI Update           │
       └───────────────────────────────┘
```

#### Action Asynchronous (API Call)

Action dapat berupa async function dan cocok untuk API request:

```js
actions: {
  async fetchUsers() {
    this.isLoading = true
    try {
      const response = await fetch('/api/users')
      this.users = await response.json()
    } catch (error) {
      this.error = error.message
    } finally {
      this.isLoading = false
    }
  },
}
```

#### Action memanggil Action lain

```js
actions: {
  increment() {
    this.count++
  },

  incrementTwice() {
    this.increment()
    this.increment()
  },
}
```

**Hafalan:**

```text
Action → logic → ubah state → UI update
```

**Best Practice:** Letakkan semua logic perubahan state yang kompleks (termasuk async) di action, bukan di dalam komponen.

---

<a id="bagian-9"></a>

## 9. 🟡 Global State & Pola Akses Komponen

#### Konsep

Salah satu alasan utama menggunakan Pinia adalah membuat state yang dapat digunakan oleh banyak component secara konsisten tanpa jalur props bertingkat.

#### Tanpa Pinia (Prop Drilling Panjang)

```text
       ┌───────────────────────────┐
       │         App.vue           │
       └─────────────┬─────────────┘
                     │
                     │ props: { user }
                     ▼
       ┌───────────────────────────┐
       │        Layout.vue         │
       └─────────────┬─────────────┘
                     │
                     │ props: { user }
                     ▼
       ┌───────────────────────────┐
       │        Header.vue         │
       └─────────────┬─────────────┘
                     │
                     │ props: { user }
                     ▼
       ┌───────────────────────────┐
       │       UserMenu.vue        │
       └───────────────────────────┘
```

#### Dengan Pinia (Pusat Data Bersama)

```text
       ┌───────────────────────────────────────────┐
       │               useUserStore                │
       │              (Global State)               │
       └───────┬─────────────┬─────────────┬───────┘
               │             │             │
    useUser()  │  useUser()  │  useUser()  │
               ▼             ▼             ▼
       ┌──────────────┐┌──────────────┐┌──────────────┐
       │  Navbar.vue  ││Dashboard.vue ││ Profile.vue  │
       └──────────────┘└──────────────┘└──────────────┘
```

Semua component mengambil store yang sama:

```js
const user = useUserStore()
```

#### Contoh User Store

```js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: 'Budi',
    isLoggedIn: true,
  }),

  getters: {
    greeting: (state) => `Halo ${state.name}`,
  },

  actions: {
    login(name) {
      this.name = name
      this.isLoggedIn = true
    },

    logout() {
      this.name = ''
      this.isLoggedIn = false
    },
  },
})
```

Jika action dijalankan dari salah satu component:

```js
user.login('Andi')
```

maka semua component lain yang membaca state tersebut otomatis menerima pembaruan secara reactive.

#### Membedakan Local State vs Global State

```text
Data hanya dibutuhkan oleh 1 komponen?
                │
                ▼
Gunakan LOCAL STATE (const state = ref() di dalam .vue)

Data dibutuhkan oleh banyak komponen / lintas halaman?
                │
                ▼
Gunakan GLOBAL STATE (Pinia Store di src/stores/)
```

**Hafalan:**

```text
Local state  → untuk komponen tunggal (isModalOpen, activeTab)
Global state → untuk data bersama (currentUser, cart, theme)
```

---

<a id="bagian-10"></a>

## 10. 🟡 Setup Store (Composition API Style)

#### Konsep

Pinia menyediakan sintaks **Setup Store** yang identik dengan gaya Vue 3 `<script setup>`:
- `ref()` mewakili **State**
- `computed()` mewakili **Getters**
- `function()` mewakili **Actions**

#### Contoh Setup Store

`src/stores/counterSetup.js`:

```js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterSetupStore = defineStore('counterSetup', () => {
  // State
  const count = ref(0)

  // Getter
  const doubleCount = computed(() => count.value * 2)

  // Action
  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  // Wajib me-return semua yang ingin diekspos
  return {
    count,
    doubleCount,
    increment,
    decrement,
  }
})
```

#### Pemetaan Option Store vs Setup Store

```text
Option Store           Setup Store
────────────           ───────────
state: () => ({})  ──> ref()
getters: {}        ──> computed()
actions: {}        ──> function()
```

#### Perbandingan

```js
//Option Store
defineStore('id', {
  state,
  getters,
  actions
})
// → sangat terstruktur, mudah dipelajari pemula

//Setup Store
defineStore('id', () => {
  ref()
  computed()
  function()
  return { ... }
})
// → lebih fleksibel, cocok untuk pengguna Composition API
```

**Hafalan:**

```text
ref()      → state
computed() → getter
function() → action
```

---

<a id="bagian-11"></a>

## 11. 🟡 Store Composition (Akses Lintas Store)

#### Konsep

Pinia memungkinkan sebuah store menggunakan store lain secara langsung di dalam Getters maupun Actions.

#### Contoh: Cart Store menggunakan User Store

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),

  actions: {
    async checkout() {
      const user = useUserStore()

      // Validasi data dari store lain
      if (!user.isLoggedIn) {
        throw new Error('Harap login terlebih dahulu')
      }

      console.log(`Memproses checkout untuk ${user.name}...`)
    },
  },
})
```

#### Diagram Hubungan Antar-Store

```text
       ┌────────────────────────────┐
       │       useUserStore         │
       │  user: { isLoggedIn: true }│
       └─────────────┬──────────────┘
                     │
                     │ dibaca oleh action
                     ▼
       ┌───────────────────────────┐
       │       useCartStore        │
       │     checkout() { ... }    │
       └─────────────┬─────────────┘
                     │
                     │ validasi sukses
                     ▼
       ┌───────────────────────────┐
       │   Proses Transaksi Belanja│
       └───────────────────────────┘
```

**Hafalan:**

```text
Import useStoreLain() → panggil di dalam action/getter saat dibutuhkan
```

---

<a id="bagian-12"></a>

## 12. 🟡 Mengamati Store (`$subscribe dan $onAction`)

#### Konsep

Pinia menyediakan method untuk mengamati perubahan state (`$subscribe`) dan siklus hidup pemanggilan action (`$onAction`).

#### Mengamati Perubahan State: `$subscribe`

```js
const counter = useCounterStore()

counter.$subscribe((mutation, state) => {
  console.log('Tipe mutasi:', mutation.type)
  console.log('State terbaru:', state.count)
})
```

#### Diagram Alur `$subscribe`

```text
State berubah
      ↓
$subscribe terpanggil
      ↓
Sync ke LocalStorage / Logging
```

#### Mengamati Action: `$onAction`

```js
counter.$onAction(({ name, args, after, onError }) => {
  console.log(`Action [${name}] dimulai dengan argumen:`, args)

  after((result) => {
    console.log(`Action [${name}] selesai dengan hasil:`, result)
  })

  onError((error) => {
    console.error(`Action [${name}] gagal:`, error)
  })
})
```

#### Diagram Siklus `$onAction`

```text
       Komponen Memanggil Action
                   │
                   ▼
         onAction Listener Aktif
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
      after()             onError()
   (Aksi Berhasil)     (Aksi Gagal)
```

**Hafalan:**

```text
$subscribe → mengamati mutasi state
$onAction  → mengamati pemanggilan action (before, after, error)
```

---

<a id="bagian-13"></a>

## 13. 🟡 Pinia dengan TypeScript

#### Konsep

Pinia memiliki inferensi tipe otomatis yang sangat baik untuk TypeScript.

#### Menentukan Tipe State

```ts
import { defineStore } from 'pinia'

interface UserItem {
  id: number
  name: string
  role: 'admin' | 'user'
}

interface UserState {
  users: UserItem[]
  currentUser: UserItem | null
  isLoading: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    currentUser: null,
    isLoading: false,
  }),

  actions: {
    setUser(user: UserItem) {
      this.currentUser = user
    },
  },
})
```

TypeScript otomatis menginferensikan return type pada state dan getters.

**Hafalan:**

```text
state: (): UserState => ({ ... })
→ tentukan interface state awal agar autocomplete bekerja maksimal
```

---

<a id="bagian-14"></a>

## 14. 🔴 Store di Luar Component & SSR

#### Konsep

Store Pinia dapat digunakan di luar file komponen `.vue`, misalnya di dalam file Vue Router.

#### Penggunaan di Vue Router Guard

Pastikan store dipanggil **di dalam callback router**, bukan di top-level file:

```js
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/dashboard', component: () => import('@/views/Dashboard.vue'), meta: { requiresAuth: true } },
  ],
})

// ✅ Panggil useUserStore() di dalam hook
router.beforeEach((to, from, next) => {
  const user = useUserStore()

  if (to.meta.requiresAuth && !user.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router
```

#### Diagram Alur Router Guard

```text
       Navigasi Route (to: '/dashboard')
                     │
                     │ router.beforeEach()
                     ▼
           useUserStore() Aktif
                     │
                     │ periksa status isLoggedIn
                     ▼
            Pengecekan Otorisasi
             │                 │
        Sudah Login       Belum Login
             │                 │
             ▼                 ▼
          next()         next('/login')
```

**Hafalan:**

```text
Panggil useStore() di dalam fungsi router guard, bukan di luar fungsi
```

---

<a id="bagian-15"></a>

## 15. 🔴 Pinia Plugins & Persist State

#### Konsep

Plugin Pinia digunakan untuk memperluas fungsi store, seperti auto-save ke `localStorage`. Plugin dipasang menggunakan `pinia.use()`.

### 1. Plugin Sederhana (Custom Logger)

```js
import { createPinia } from 'pinia'

const pinia = createPinia()

function loggerPlugin({ store }) {
  store.$subscribe((mutation, state) => {
    console.log(`[Plugin] Store ${store.$id} berubah:`, state)
  })
}

pinia.use(loggerPlugin)
```

### 2. Persist State dengan `pinia-plugin-persistedstate`

Install plugin:

```bash
npm install pinia-plugin-persistedstate
```

Pasang di `src/main.js`:

```js
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

Aktifkan di store:

```js
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  persist: true, // Otomatis tersimpan di localStorage!
})
```

#### Diagram Alur Persistensi

```text
       State di Store Berubah
                 │
                 │ pinia.use(plugin) mendeteksi mutasi
                 ▼
       Plugin Persistedstate Aktif
                 │
                 │ serialisasi state ke JSON
                 ▼
       localStorage Browser Terupdate
```

**Hafalan:**

```text
pinia.use(plugin) → daftarkan plugin
persist: true     → auto-save state ke browser storage
```

---

<a id="bagian-16"></a>

## 16. 🧠 Peta Ingatan Cepat

#### A. Konsep Dasar

```text
             Pinia
               │
       ┌───────┼────────┐
       │       │        │
       ▼       ▼        ▼
     State   Getter   Action
       │       │        │
       ▼       ▼        ▼
      data   computed  methods
```

#### B. Alur Data Komponen & Store

```text
       ┌───────────────────────────────┐
       │           Component           │
       └───────────────┬───────────────┘
                       │
                       │ 1. panggil action
                       ▼
       ┌───────────────────────────────┐
       │         Pinia Action          │
       └───────────────┬───────────────┘
                       │
                       │ 2. ubah state
                       ▼
       ┌───────────────────────────────┐
       │          State Utama          │
       └───────┬───────────────┬───────┘
               │               │
               │ 3. komputasi  │ 4. trigger reaktif
               ▼               ▼
       ┌───────────────┐ ┌─────────────┐
       │    Getter     │ │  UI Render  │
       └───────────────┘ └─────────────┘
```

#### C. Setup

```text
createPinia()
      ↓
app.use(pinia)
      ↓
useStore()
      ↓
store tersedia
```

#### D. Store

```text
defineStore('id', ...)
        │
        ▼
   useSomethingStore
        │
        ▼
const store = useSomethingStore()
```

#### E. State & Patch

```text
state
  ↓
data reactive

store.count
  ↓
baca / ubah langsung

store.$patch()
  ↓
ubah banyak state sekaligus

store.$reset()
  ↓
kembali ke initial state
```

#### F. Destructuring dengan `storeToRefs`

```text
              ┌───────────────────────────────┐
              │             Store             │
              └───────┬───────────────┬───────┘
                      │               │
        state/getters │               │ actions
                      ▼               ▼
              ┌───────────────┐ ┌───────────────┐
              │ storeToRefs() │ │  Destructure  │
              │               │ │   Langsung    │
              └───────┬───────┘ └───────┬───────┘
                      │                 │
                      ▼                 ▼
                 Ref Reaktif      Fungsi Action
```

#### G. Option Store vs Setup Store

```text
Option Store            Setup Store
────────────            ───────────
state                   ref
getters                 computed
actions                 function
```

---

<a id="bagian-17"></a>

## 17. 📚 Tabel Ringkasan

| Materi | Fungsi | Kata Kunci |
|---|---|---|
| Pengenalan | State management resmi Vue | Pinia |
| Setup | Memasang Pinia di main.js | `createPinia()` |
| Store | Tempat penyimpanan state + logic | `defineStore()` |
| State | Data reactive utama | `state: () => ({})` |
| `$patch` | Mengubah banyak state dalam 1 batch | `$patch()` |
| `$reset` | Mengembalikan state ke nilai awal | `$reset()` |
| `storeToRefs` | Destructure state & getter tetap reaktif | `storeToRefs()` |
| Getter | Nilai komputasi turunan | `getters: {}` |
| Action | Business logic & mutasi state | `actions: {}` |
| Global State | Akses data store lintas komponen | `useStore()` |
| Setup Store | Penulisan store bergaya Composition API | `defineStore('id', () => {})` |
| Store Composition | Store menggunakan store lain | `useOtherStore()` |
| `$subscribe` | Mengamati mutasi state | `$subscribe()` |
| `$onAction` | Mengamati siklus action | `$onAction()` |
| TypeScript | Type inference & static typing | `UserState` |
| Plugins | Ekstensi fungsionalitas store | `pinia.use()` |

---

<a id="bagian-18"></a>

## 18. ⚡ Cheat Code Pinia 10 Detik

```text
createPinia()       → memasang Pinia ke aplikasi
defineStore('id')   → membuat store
state               → data reactive
getters             → nilai turunan (computed)
actions             → method + business logic
useStore()          → mengambil instance store
storeToRefs()       → destructure tetap reactive
$patch()            → ubah banyak state sekaligus
$reset()            → kembali ke state awal
```

#### Setup dasar

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

#### Store dasar

```js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
```

#### Menggunakan store di komponen

```html
<script setup>
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
const { count, double } = storeToRefs(counter)
const { increment } = counter
</script>

<template>
  <p>{{ count }} / {{ double }}</p>
  <button @click="increment">Tambah</button>
</template>
```

---

<a id="bagian-19"></a>

## 19. 🧭 Urutan Belajar yang Disarankan

```text
1. Pengenalan
       ↓
2. Setup
       ↓
3. Store
       ↓
4. State
       ↓
5. $patch & $reset
       ↓
6. storeToRefs()
       ↓
7. Getter
       ↓
8. Action
       ↓
9. Global State
       ↓
10. Setup Store
       ↓
11. Store Composition
       ↓
12. $subscribe / $onAction
       ↓
13. TypeScript
       ↓
14. Plugins & Persistence
       ↓
15. Mini Project
```

**Prinsip:** Kuasai dulu konsep dasar State → Getter → Action dengan Option Store, baru pelajari Setup Store dan fitur lanjutan.

---

<a id="bagian-20"></a>

## 20. 🏗️ Mini Project: Shopping Cart Terpadu

Contoh mini project yang menggabungkan: **State, Getters, Actions, `storeToRefs`, dan Cross-Component access**.

### 1. Cart Store (`src/stores/cart.js`)

```js
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [
      { id: 1, text: 'Buku Vue 3', price: 100000, qty: 1 },
      { id: 2, text: 'Stiker Pinia', price: 15000, qty: 2 },
    ],
  }),

  getters: {
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.qty, 0)
    },

    totalPrice: (state) => {
      return state.items.reduce((total, item) => total + (item.price * item.qty), 0)
    },
  },

  actions: {
    addItem(text, price) {
      if (!text.trim()) return

      this.items.push({
        id: Date.now(),
        text,
        price: Number(price),
        qty: 1,
      })
    },

    removeItem(id) {
      this.items = this.items.filter(item => item.id !== id)
    },

    clearCart() {
      this.items = []
    },
  },
})
```

### 2. Komponen Antarmuka (`src/App.vue`)

```html
<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

const { items, totalItems, totalPrice } = storeToRefs(cart)
const { addItem, removeItem, clearCart } = cart

const newItemName = ref('')
const newItemPrice = ref(0)

function handleAdd() {
  if (!newItemName.value || newItemPrice.value <= 0) return

  addItem(newItemName.value, newItemPrice.value)
  newItemName.value = ''
  newItemPrice.value = 0
}
</script>

<template>
  <div class="cart-app">
    <h1>Mini Shopping Cart</h1>

    <div class="form">
      <input v-model="newItemName" placeholder="Nama barang..." />
      <input v-model.number="newItemPrice" type="number" placeholder="Harga..." />
      <button @click="handleAdd">Tambah Barang</button>
    </div>

    <p>Total Barang: {{ totalItems }}</p>

    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.text }} (x{{ item.qty }}) — Rp {{ (item.price * item.qty).toLocaleString('id-ID') }}
        <button @click="removeItem(item.id)">Hapus</button>
      </li>
    </ul>

    <h3>Total Bayar: Rp {{ totalPrice.toLocaleString('id-ID') }}</h3>
    <button @click="clearCart">Kosongkan Keranjang</button>
  </div>
</template>
```

#### Output

```text
Mini Shopping Cart

[ Nama barang... ] [ Harga... ] [ Tambah Barang ]

Total Barang: 3

• Buku Vue 3 (x1) — Rp 100.000      [ Hapus ]
• Stiker Pinia (x2) — Rp 30.000     [ Hapus ]

Total Bayar: Rp 130.000
[ Kosongkan Keranjang ]
```

#### Diagram Alur Mini Project

```text
               useCartStore
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
     State        Getter       Action
       │            │            │
     items      totalItems     addItem()
                totalPrice     removeItem()
                    │          clearCart()
                    ▼
                App.vue
                    │
                    ▼
             Tampilan Belanja
```

**Kunci:** Pahami alur **State → Getter (hitung) → Action (mutasi) → UI Update**. Seluruh komponen yang membaca store akan otomatis terupdate secara sinkron.

---

<a id="bagian-21"></a>

## 21. 🔗 Referensi Resmi

- [Pinia — Official Website](https://pinia.vuejs.org/)
- [Getting Started](https://pinia.vuejs.org/getting-started.html)
- [Defining a Store](https://pinia.vuejs.org/core-concepts/)
- [State](https://pinia.vuejs.org/core-concepts/state.html)
- [Getters](https://pinia.vuejs.org/core-concepts/getters.html)
- [Actions](https://pinia.vuejs.org/core-concepts/actions.html)
- [Composing Stores](https://pinia.vuejs.org/cookbook/composing-stores.html)
- [SSR](https://pinia.vuejs.org/ssr/)
- [TypeScript Guide](https://pinia.vuejs.org/core-concepts/typescript.html)
- [API Reference](https://pinia.vuejs.org/api/)
