# Pinia Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Vue 3 + Composition API + Pinia 3, dengan contoh singkat, diagram, output, dan pola yang mudah diingat.
>
> Semua contoh utama menggunakan `<script setup>` dan **Option Store**, lalu ditutup dengan contoh **Setup Store** agar mudah membandingkan keduanya.

## Daftar Isi

1. [Pengenalan](#1-pengenalan)
2. [Setup](#2-setup)
3. [Store](#3-store)
4. [State](#4-state)
5. [Action](#5-action)
6. [Getter](#6-getter)
7. [Global State](#7-global-state)
8. [Referensi Lengkap](#8-referensi-lengkap)
9. [Peta Ingatan Cepat](#9-peta-ingatan-cepat)
10. [Tabel Ringkasan](#10-tabel-ringkasan)
11. [Mini Project](#11-mini-project)
12. [Cheat Code Pinia 10 Detik](#cheat-code-pinia-10-detik)

---

# 1. Pengenalan

**Pinia** adalah state management library untuk Vue.

Sederhananya:

```text
Component A ──┐
              │
Component B ──┼──> Pinia Store
              │        │
Component C ──┘        ▼
                    Shared State
```

Tanpa store, komunikasi data antar-component bisa menjadi panjang:

```text
Parent
  │
  ├── props
  ↓
Child
  │
  ├── props
  ↓
Grandchild
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

Pinia store menyimpan **state dan business logic** yang tidak terikat pada satu component tree. Konsep utamanya adalah **state, getters, dan actions**, yang dapat dipahami seperti `data`, `computed`, dan `methods` pada component Vue. citeturn0search0turn0search6

## Kapan menggunakan Pinia?

Cocok untuk data yang:

```text
dipakai banyak component
        atau
harus bertahan ketika berpindah halaman
        atau
memiliki business logic bersama
```

Contoh:

```text
user login
shopping cart
theme
notification
settings
product filter
```

Tidak semua data harus masuk store.

Data yang hanya digunakan satu component biasanya lebih baik tetap menjadi local state:

```text
Modal terbuka?
Input sedang diketik?
Tab aktif di satu component?
```

## Model mental Pinia

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
             │     │
        read/write │
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

---

# 2. Setup

## 2.1 Install Pinia

```bash
npm install pinia
```

Pinia didaftarkan ke aplikasi sebagai plugin dengan `createPinia()`. citeturn0search0

## 2.2 Pasang Pinia

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

Diagram:

```text
createApp(App)
      │
      ▼
createPinia()
      │
      ▼
app.use(pinia)
      │
      ▼
mount()
```

Setelah `app.use(pinia)`, store Pinia dapat digunakan oleh component di aplikasi.

## 2.3 Struktur folder

Struktur yang umum:

```text
src/
├── components/
├── views/
├── stores/
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

Pinia mendukung banyak store dan pola modular. citeturn0search5turn0search9

---

# 3. Store

**Store** adalah tempat untuk menyimpan state dan logic yang ingin digunakan bersama.

Store dibuat menggunakan `defineStore()` dan membutuhkan **id unik**. Konvensi nama function store biasanya `use...Store`, misalnya `useUserStore` atau `useCartStore`. citeturn0search5turn0search7

## 3.1 Membuat Store

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

Diagram:

```text
useCounterStore
       │
       ├── id: counter
       │
       ├── state
       │     └── count
       │
       ├── getters
       │     └── doubleCount
       │
       └── actions
             └── increment()
```

## 3.2 Menggunakan Store

Di component:

```vue
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

**Output awal:**

```text
Count: 0
Double: 0

[ Tambah ]
```

Klik:

```text
Count: 1
Double: 2

[ Tambah ]
```

Klik lagi:

```text
Count: 2
Double: 4
```

## 3.3 Store adalah reactive

Instance store dapat dibaca dan diubah langsung:

```js
const counter = useCounterStore()

counter.count++
```

Pinia memang dirancang agar state pada store dapat diakses langsung tanpa wrapper verbose seperti pada pola Vuex lama. citeturn0search2

**Ingat:**

```text
defineStore()
     ↓
membuat store definition

useCounterStore()
     ↓
mengambil instance store
```

---

# 4. State

**State** adalah data utama yang disimpan oleh store.

Pada Option Store, state didefinisikan sebagai function yang mengembalikan object initial state. Semua bagian state sebaiknya dideklarasikan sejak awal agar Pinia dan Vue dapat melacaknya dengan benar. citeturn0search2

## 4.1 Membuat State

```js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: 'Budi',
    age: 20,
    isLoggedIn: false,
  }),
})
```

Diagram:

```text
useUserStore
      │
      ▼
    state
      │
      ├── name
      ├── age
      └── isLoggedIn
```

## 4.2 Membaca State

```vue
<script setup>
import { useUserStore } from '@/stores/user'

const user = useUserStore()
</script>

<template>
  <p>{{ user.name }}</p>
  <p>{{ user.age }}</p>
</template>
```

Output:

```text
Budi
20
```

## 4.3 Mengubah State

State dapat diubah langsung:

```js
const user = useUserStore()

user.name = 'Andi'
user.age = 21
```

Atau melalui action:

```js
user.updateProfile('Andi', 21)
```

Biasanya logic perubahan state yang kompleks lebih baik diletakkan di action.

## 4.4 `$patch`

Pinia menyediakan `$patch()` untuk mengubah beberapa state sekaligus.

```js
user.$patch({
  name: 'Andi',
  age: 21,
})
```

Untuk perubahan yang lebih kompleks:

```js
user.$patch((state) => {
  state.age++
  state.name = 'Andi'
})
```

Konsep:

```text
state
 │
 ├── direct mutation
 │
 ├── $patch(object)
 │
 └── $patch(callback)
```

## 4.5 Reset State

Pada **Option Store**, Pinia menyediakan:

```js
user.$reset()
```

State kembali ke nilai awal yang didefinisikan oleh `state()`. citeturn0search2

Contoh:

```js
const user = useUserStore()

user.name = 'Andi'
user.age = 30

user.$reset()
```

Kembali:

```text
name = Budi
age  = 20
```

> **Catatan:** pada Setup Store, `$reset()` tidak otomatis tersedia. Jika diperlukan, buat function `$reset()` sendiri. citeturn0search2

## 4.6 State dengan array

```js
state: () => ({
  todos: [],
})
```

Menambah:

```js
store.todos.push({
  id: 1,
  text: 'Belajar Pinia',
})
```

Atau menggunakan action.

## 4.7 State yang belum memiliki nilai

Tetap deklarasikan property:

```js
state: () => ({
  user: null,
  items: [],
})
```

Jangan baru menambahkan property yang tidak pernah didefinisikan:

```js
store.newProperty = 'hello'
```

Jika property tersebut tidak ada di state awal, itu bukan pola state yang didukung Pinia. citeturn0search2

**Ingat:**

```text
state: () => ({
  semuaStateAwal
})
```

---

# 5. Action

**Action** adalah function yang berisi logic atau business logic pada store.

Action pada Pinia setara dengan method pada component Vue. Action dapat menggunakan `this` untuk mengakses state, getter, dan action lain. citeturn0search4

## 5.1 Membuat Action

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

    reset() {
      this.count = 0
    },
  },
})
```

Diagram:

```text
Component
    │
    │ store.increment()
    ▼
 Action
    │
    ▼
this.count++
    │
    ▼
 State berubah
    │
    ▼
UI update
```

## 5.2 Memanggil Action

```vue
<script setup>
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
</script>

<template>
  <button @click="counter.increment()">
    Tambah
  </button>

  <button @click="counter.decrement()">
    Kurang
  </button>

  <button @click="counter.reset()">
    Reset
  </button>
</template>
```

## 5.3 Action dengan parameter

```js
actions: {
  add(amount) {
    this.count += amount
  },
}
```

Panggil:

```js
counter.add(5)
```

Jika sebelumnya:

```text
count = 0
```

maka:

```text
count = 5
```

## 5.4 Action asynchronous

Action dapat berupa async function dan cocok untuk business logic seperti API request. citeturn0search4

```js
actions: {
  async fetchUsers() {
    const response = await fetch('/api/users')

    this.users = await response.json()
  },
}
```

Diagram:

```text
Component
    │
    ▼
fetchUsers()
    │
    ▼
API Request
    │
    ▼
Response
    │
    ▼
this.users
    │
    ▼
UI update
```

## 5.5 Action dapat memanggil action lain

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

## 5.6 Action menggunakan store lain

```js
import { useUserStore } from './user'

actions: {
  async checkout() {
    const user = useUserStore()

    if (!user.isLoggedIn) {
      return
    }

    // proses checkout
  },
}
```

Pinia memungkinkan sebuah store menggunakan store lain secara langsung. Untuk action async, pada konteks SSR sebaiknya panggil `useStore()` sebelum `await` agar instance Pinia yang tepat digunakan. citeturn0search8

**Ingat:**

```text
Action
  ↓
logic
  ↓
ubah state
  ↓
UI update
```

---

# 6. Getter

**Getter** adalah nilai turunan dari state.

Konsepnya mirip dengan `computed` pada component Vue. Getter didefinisikan pada property `getters`. citeturn0search1

## 6.1 Getter sederhana

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

```vue
<script setup>
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
</script>

<template>
  <p>{{ counter.count }}</p>
  <p>{{ counter.doubleCount }}</p>
</template>
```

Output:

```text
10
20
```

Diagram:

```text
count = 10
    │
    ▼
doubleCount
    │
    ▼
    20
```

## 6.2 Getter menggunakan `this`

Jika getter ingin mengakses getter lain:

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
count         = 10
doubleCount   = 20
quadrupleCount = 40
```

> Getter yang menggunakan `this` perlu return type eksplisit jika menggunakan TypeScript pada pola tertentu agar inferensi tidak kehilangan tipe. citeturn0search1

## 6.3 Getter dengan array

```js
state: () => ({
  todos: [
    { id: 1, text: 'Vue', done: true },
    { id: 2, text: 'Pinia', done: false },
  ],
}),

getters: {
  completedTodos: (state) => {
    return state.todos.filter(todo => todo.done)
  },
}
```

Output konsep:

```text
completedTodos

[
  { id: 1, text: 'Vue', done: true }
]
```

## 6.4 Getter bukan tempat side effect

Gunakan:

```text
getter → hitung / turunkan nilai
action → jalankan logic / side effect
```

Contoh yang baik:

```js
getters: {
  totalPrice: (state) => {
    return state.items.reduce(
      (total, item) => total + item.price,
      0
    )
  },
}
```

Bukan:

```js
getters: {
  saveToServer() {
    // jangan menjadikan getter sebagai tempat side effect
  },
}
```

**Ingat:**

```text
State
  ↓
Getter
  ↓
derived value
```

---

# 7. Global State

Salah satu alasan utama menggunakan Pinia adalah membuat state yang dapat digunakan oleh banyak component.

## 7.1 Tanpa Pinia

Misalnya:

```text
App
 │
 ├── Navbar
 │     └── user
 │
 ├── Dashboard
 │     └── user
 │
 └── Profile
       └── user
```

Jika state user harus diteruskan melalui props:

```text
App
 ↓ props
Navbar

App
 ↓ props
Dashboard

App
 ↓ props
Profile
```

Untuk aplikasi yang lebih kompleks, pendekatan ini dapat menjadi tidak nyaman.

## 7.2 Dengan Pinia

```text
             ┌─────────────┐
             │ User Store   │
             └──────┬──────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
     Navbar     Dashboard     Profile
```

Semua component mengambil store yang sama:

```js
const user = useUserStore()
```

## 7.3 Contoh User Store

```js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: 'Budi',
    isLoggedIn: true,
  }),

  getters: {
    greeting: (state) => {
      return `Halo ${state.name}`
    },
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

Navbar:

```vue
<script setup>
import { useUserStore } from '@/stores/user'

const user = useUserStore()
</script>

<template>
  <nav>
    {{ user.greeting }}
  </nav>
</template>
```

Profile:

```vue
<script setup>
import { useUserStore } from '@/stores/user'

const user = useUserStore()
</script>

<template>
  <h1>{{ user.name }}</h1>
</template>
```

Jika action:

```js
user.login('Andi')
```

maka component yang menggunakan state tersebut akan mendapatkan data terbaru secara reactive.

Diagram:

```text
             User Store
                 │
        ┌────────┼────────┐
        │        │        │
        ▼        ▼        ▼
      Navbar  Profile  Dashboard
        │        │        │
        └────────┼────────┘
                 │
                 ▼
            reactive UI
```

## 7.4 Global bukan berarti semua data

Jangan masukkan semua state ke Pinia.

Gunakan local state untuk:

```text
isModalOpen
inputValue
selectedTab
hoveredItem
```

Gunakan Pinia untuk:

```text
currentUser
cart
authentication
theme
notifications
shared filters
application settings
```

Pola sederhana:

```text
Hanya 1 component?
       ↓
local state

Banyak component?
       ↓
pertimbangkan Pinia

Business logic bersama?
       ↓
pertimbangkan Store
```

## 7.5 Store dapat dipakai lintas store

Contoh:

```text
User Store
    │
    └── authentication

Cart Store
    │
    └── cart items
           │
           └── membutuhkan user
```

Di action:

```js
import { useUserStore } from './user'

actions: {
  checkout() {
    const user = useUserStore()

    if (!user.isLoggedIn) {
      return
    }

    // checkout
  },
}
```

Store dapat dikomposisikan dengan store lain sesuai kebutuhan. citeturn0search8

---

# 8. Referensi Lengkap

## 8.1 Import utama

```js
import {
  createPinia,
  defineStore,
  storeToRefs,
} from 'pinia'
```

API yang paling sering digunakan:

```text
createPinia()
defineStore()
storeToRefs()
```

## 8.2 `createPinia()`

Membuat root Pinia instance:

```js
const pinia = createPinia()

app.use(pinia)
```

Alur:

```text
createPinia()
      ↓
app.use(pinia)
      ↓
Pinia tersedia di aplikasi
```

## 8.3 `defineStore()`

Membuat store:

```js
export const useCounterStore = defineStore(
  'counter',
  {
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
  }
)
```

`defineStore()` dapat menerima **Option Store** atau **Setup Store**. citeturn0search5turn0search7

---

## 8.4 Option Store

Format yang paling mudah untuk dipelajari:

```js
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

Model mental:

```text
Option Store

state
  ↓
data

getters
  ↓
computed

actions
  ↓
methods
```

---

## 8.5 Setup Store

Pinia juga menyediakan syntax yang mirip Composition API:

```js
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore(
  'counter',
  () => {
    const count = ref(0)

    const double = computed(() => {
      return count.value * 2
    })

    function increment() {
      count.value++
    }

    return {
      count,
      double,
      increment,
    }
  }
)
```

Dalam Setup Store:

```text
ref()
   ↓
state

computed()
   ↓
getter

function()
   ↓
action
```

Semua state yang ingin dikenali Pinia harus dikembalikan dari setup store. Setup Store juga memberi fleksibilitas untuk menggunakan composable dan watcher. citeturn0search5turn0search11

### Option Store vs Setup Store

```text
Option Store

defineStore('id', {
  state,
  getters,
  actions
})
```

```text
Setup Store

defineStore('id', () => {
  ref()
  computed()
  function()

  return {
    ...
  }
})
```

Untuk belajar dasar Pinia:

```text
mulai dengan Option Store
        ↓
pahami state/getter/action
        ↓
lanjut Setup Store
```

---

## 8.6 `storeToRefs()`

Jangan sembarang destructuring store:

```js
const store = useCounterStore()

const { count } = store
```

Destructuring seperti ini dapat kehilangan reactivity untuk state/getter.

Gunakan:

```js
import { storeToRefs } from 'pinia'

const store = useCounterStore()

const { count, double } = storeToRefs(store)
```

Kemudian:

```vue
<template>
  <p>{{ count }}</p>
  <p>{{ double }}</p>
</template>
```

Untuk action, tidak perlu `storeToRefs()`:

```js
const { increment } = store
```

Konsep:

```text
storeToRefs(store)
      │
      ├── state
      └── getter
           ↓
      tetap reactive
```

---

## 8.7 `$patch()`

Object patch:

```js
store.$patch({
  count: 10,
  name: 'Budi',
})
```

Function patch:

```js
store.$patch((state) => {
  state.count++
  state.name = 'Andi'
})
```

Cocok ketika beberapa perubahan state ingin dilakukan dalam satu patch.

---

## 8.8 `$reset()`

Option Store:

```js
store.$reset()
```

Kembali ke state awal.

Setup Store:

```js
export const useCounterStore = defineStore(
  'counter',
  () => {
    const count = ref(0)

    function $reset() {
      count.value = 0
    }

    return {
      count,
      $reset,
    }
  }
)
```

---

## 8.9 `$subscribe()`

Digunakan untuk mengamati perubahan state store:

```js
store.$subscribe((mutation, state) => {
  console.log('State berubah')
  console.log(state)
})
```

Konsep:

```text
State berubah
     ↓
$subscribe()
     ↓
callback
```

Cocok untuk kebutuhan seperti:

```text
logging
localStorage synchronization
analytics
debugging
```

Untuk business logic utama, tetap prioritaskan action.

---

## 8.10 `$onAction()`

Digunakan untuk mengamati action yang dijalankan:

```js
store.$onAction(
  ({
    name,
    args,
    after,
    onError,
  }) => {
    console.log('Action:', name)
    console.log('Args:', args)

    after(() => {
      console.log('Action selesai')
    })

    onError((error) => {
      console.error(error)
    })
  }
)
```

Diagram:

```text
store.increment()
       │
       ▼
   $onAction
       │
       ├── before
       ├── after
       └── error
```

---

## 8.11 `store.$state`

Akses object state:

```js
console.log(store.$state)
```

Contoh:

```js
store.$state.count
```

Dapat digunakan ketika memang membutuhkan object state secara keseluruhan.

---

## 8.12 Store di luar Component

Di dalam component:

```js
const store = useCounterStore()
```

Biasanya Pinia mengetahui instance aplikasi yang sedang aktif.

Jika store dipakai di luar setup/component, terutama pada SSR, instance Pinia mungkin perlu diberikan secara eksplisit:

```js
const pinia = createPinia()

const store = useCounterStore(pinia)
```

Dalam SSR, pemanggilan `useStore()` perlu dilakukan dalam konteks yang benar agar state antar-request tidak tercampur. citeturn0search10

---

## 8.13 Devtools

Pinia terintegrasi dengan Vue Devtools sehingga store dapat diperiksa saat development. Devtools juga menyediakan dukungan untuk melihat aktivitas store dan debugging. citeturn0search6turn0search9

Konsep:

```text
Application
    │
    ▼
Pinia
    │
    ▼
Vue Devtools
    │
    ├── Store
    ├── State
    └── Actions
```

---

## 8.14 TypeScript

Pinia memiliki inferensi type yang baik.

Contoh:

```ts
export const useCounterStore = defineStore(
  'counter',
  {
    state: () => ({
      count: 0,
      name: 'Budi',
    }),

    actions: {
      increment() {
        this.count++
      },
    },
  }
)
```

TypeScript dapat menginfer:

```text
count → number
name  → string
```

Untuk state yang awalnya kosong, kadang tipe perlu dibantu:

```ts
interface User {
  id: number
  name: string
}

state: () => ({
  users: [] as User[],
  currentUser: null as User | null,
})
```

Pinia mendukung type inference pada state dan TypeScript dengan baik. citeturn0search2turn0search9

---

## 8.15 Store Composition

Store dapat menggunakan store lain:

```js
const user = useUserStore()
```

Misalnya:

```js
export const useCartStore = defineStore('cart', {
  actions: {
    checkout() {
      const user = useUserStore()

      if (!user.isLoggedIn) {
        return
      }

      // checkout
    },
  },
})
```

Konsep:

```text
User Store
    │
    ▼
Cart Store
    │
    ▼
Business Logic
```

Pinia mendukung penggunaan store lain di getter maupun action. citeturn0search8

---

# 9. Peta Ingatan Cepat

## A. Konsep Dasar

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

---

## B. Alur Data

```text
Component
    │
    ▼
Store
    │
    ├── State
    │     ↓
    │   data
    │
    ├── Getter
    │     ↓
    │   derived data
    │
    └── Action
          ↓
        logic
          ↓
       State berubah
          ↓
       UI update
```

---

## C. Setup

```text
createPinia()
      ↓
app.use(pinia)
      ↓
useStore()
      ↓
store tersedia
```

---

## D. Store

```text
defineStore('id', ...)
        │
        ▼
   useSomethingStore
        │
        ▼
const store = useSomethingStore()
```

Hafalan:

```text
defineStore → membuat
useStore    → mengambil
```

---

## E. State

```text
state
 ↓
data reactive

store.count
 ↓
baca / ubah state

store.$patch()
 ↓
ubah state

store.$reset()
 ↓
kembali ke initial state
```

---

## F. Getter

```text
State
  │
  ▼
Getter
  │
  ▼
Derived Value
```

Contoh:

```text
count = 5
   ↓
doubleCount
   ↓
10
```

Hafalan:

```text
Getter = computed milik store
```

---

## G. Action

```text
Component
    │
    ▼
store.increment()
    │
    ▼
Action
    │
    ▼
this.count++
    │
    ▼
State
    │
    ▼
UI
```

Hafalan:

```text
Action = method + business logic
```

---

## H. Global State

```text
             Store
               │
       ┌───────┼───────┐
       ▼       ▼       ▼
   Component Component Component
       │       │       │
       └───────┼───────┘
               ▼
          Shared State
```

---

## I. Option Store vs Setup Store

```text
Option Store

state
getters
actions
```

```text
Setup Store

ref
computed
function
```

Peta:

```text
ref       → state
computed  → getter
function  → action
```

---

## J. `storeToRefs`

```text
Store
 │
 ├── state
 ├── getter
 └── action
       │
       ▼
storeToRefs()
       │
       ├── state ✓
       └── getter ✓

action
   ↓
destructure langsung
```

---

# 10. Tabel Ringkasan

| Materi | Fungsi | Kata kunci |
|---|---|---|
| Pengenalan | State management Vue | Pinia |
| Setup | Memasang Pinia | `createPinia()` |
| Store | Tempat state + logic | `defineStore()` |
| State | Data reactive | `state()` |
| Action | Business logic / mutation | `actions` |
| Getter | Nilai turunan | `getters` |
| Global State | State yang dipakai bersama | `useStore()` |
| `$patch` | Mengubah state | `$patch()` |
| `$reset` | Reset state | `$reset()` |
| `storeToRefs` | Destructure tetap reactive | `storeToRefs()` |
| `$subscribe` | Mengamati perubahan state | `$subscribe()` |
| `$onAction` | Mengamati action | `$onAction()` |
| Setup Store | Store dengan Composition API | `defineStore('id', () => {})` |
| Store Composition | Store menggunakan store lain | `useOtherStore()` |
| Devtools | Debugging store | Vue Devtools |
| TypeScript | Type inference | `defineStore()` |

---

# 11. Mini Project

## Todo Store

Contoh kecil yang menggabungkan:

```text
State
Getter
Action
Global State
Component
```

### `src/stores/todo.js`

```js
import { defineStore } from 'pinia'

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [
      {
        id: 1,
        text: 'Belajar Vue',
        done: true,
      },
      {
        id: 2,
        text: 'Belajar Pinia',
        done: false,
      },
    ],
  }),

  getters: {
    remainingTodos: (state) => {
      return state.todos.filter(
        todo => !todo.done
      ).length
    },

    completedTodos: (state) => {
      return state.todos.filter(
        todo => todo.done
      )
    },
  },

  actions: {
    addTodo(text) {
      if (!text.trim()) return

      this.todos.push({
        id: Date.now(),
        text,
        done: false,
      })
    },

    toggleTodo(id) {
      const todo = this.todos.find(
        todo => todo.id === id
      )

      if (todo) {
        todo.done = !todo.done
      }
    },

    removeTodo(id) {
      this.todos = this.todos.filter(
        todo => todo.id !== id
      )
    },
  },
})
```

### `App.vue`

```vue
<script setup>
import { ref } from 'vue'
import { useTodoStore } from '@/stores/todo'

const todoStore = useTodoStore()

const text = ref('')

function addTodo() {
  todoStore.addTodo(text.value)
  text.value = ''
}
</script>

<template>
  <h1>Todo App</h1>

  <form @submit.prevent="addTodo">
    <input
      v-model="text"
      placeholder="Todo baru..."
    />

    <button>Tambah</button>
  </form>

  <p>
    Sisa:
    {{ todoStore.remainingTodos }}
  </p>

  <ul>
    <li
      v-for="todo in todoStore.todos"
      :key="todo.id"
    >
      <input
        type="checkbox"
        :checked="todo.done"
        @change="todoStore.toggleTodo(todo.id)"
      />

      <span>
        {{ todo.text }}
      </span>

      <button
        @click="todoStore.removeTodo(todo.id)"
      >
        Hapus
      </button>
    </li>
  </ul>
</template>
```

## Output

```text
Todo App

[ Todo baru... ] [Tambah]

Sisa: 1

☑ Belajar Vue     [Hapus]
☐ Belajar Pinia   [Hapus]
```

Tambah:

```text
[ Membuat project ] [Tambah]
```

Output:

```text
Sisa: 2

☑ Belajar Vue
☐ Belajar Pinia
☐ Membuat project
```

Diagram:

```text
                 Todo Store
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
      State        Getter       Action
        │            │            │
        │            │            │
      todos     remainingTodos   addTodo()
                   │             toggleTodo()
                   │             removeTodo()
                   │
                   ▼
               Component
                   │
                   ▼
                    UI
```

Konsep yang sudah digabung:

```text
defineStore()
     │
     ├── state
     │
     ├── getters
     │
     └── actions
            │
            ▼
       useTodoStore()
            │
            ▼
        App.vue
```

---

# Cheat Code Pinia 10 Detik

> **`createPinia()` memasang Pinia ke aplikasi. `defineStore()` membuat store. `state` menyimpan data reactive. `getters` membuat nilai turunan seperti `computed`. `actions` menyimpan method dan business logic. `useSomethingStore()` mengambil instance store. Pinia cocok untuk state yang digunakan banyak component atau business logic yang ingin dibagi. `storeToRefs()` digunakan ketika state/getter ingin di-destructure tanpa kehilangan reactivity. `$patch()` mengubah state dan `$reset()` mengembalikan state Option Store ke nilai awal.**

---

# Urutan Belajar yang Disarankan

```text
1. Pengenalan
       ↓
2. Setup
       ↓
3. Store
       ↓
4. State
       ↓
5. Action
       ↓
6. Getter
       ↓
7. Global State
       ↓
8. storeToRefs()
       ↓
9. $patch()
       ↓
10. $reset()
        ↓
11. Setup Store
        ↓
12. Store Composition
        ↓
13. $subscribe / $onAction
        ↓
14. TypeScript
```

---

# Referensi Resmi

- Pinia — Official Website:
  https://pinia.vuejs.org/

- Getting Started:
  https://pinia.vuejs.org/getting-started.html

- Core Concepts:
  https://pinia.vuejs.org/core-concepts/

- Defining a Store:
  https://pinia.vuejs.org/core-concepts/

- State:
  https://pinia.vuejs.org/core-concepts/state.html

- Getters:
  https://pinia.vuejs.org/core-concepts/getters.html

- Actions:
  https://pinia.vuejs.org/core-concepts/actions.html

- Composing Stores:
  https://pinia.vuejs.org/cookbook/composing-stores.html

- SSR:
  https://pinia.vuejs.org/ssr/

- API Reference:
  https://pinia.vuejs.org/api/

> **Catatan versi:** Cheatsheet ini mengikuti dokumentasi **Pinia 3.x** dan pola **Vue 3 + Composition API**. Pinia saat ini menggunakan `createPinia()` untuk membuat root instance dan `defineStore()` untuk mendefinisikan store. citeturn0search0turn0search9
