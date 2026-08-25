# Vue.js Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Vue 3 + Composition API, dengan contoh yang singkat dan mudah dipelajari.
>
> Semua contoh utama menggunakan `<script setup>` agar cocok dengan gaya Vue modern.

## Daftar Isi

1. [Pengenalan](#1-pengenalan)
2. [Membuat Project](#2-membuat-project)
3. [Hello Vue](#3-hello-vue)
4. [API Style](#4-api-style)
5. [Template](#5-template)
6. [Template Attributes](#6-template-attributes)
7. [JS Expression di Template](#7-js-expression-di-template)
8. [Directive](#8-directive)
9. [State](#9-state)
10. [DOM Update](#10-dom-update)
11. [Reactive](#11-reactive)
12. [Computed Properties](#12-computed-properties)
13. [Style](#13-style)
14. [Conditional Rendering](#14-conditional-rendering)
15. [List Rendering](#15-list-rendering)
16. [Event Handling](#16-event-handling)
17. [Input Binding](#17-input-binding)
18. [Watchers](#18-watchers)
19. [Template Refs](#19-template-refs)
20. [Lifecycle Hooks](#20-lifecycle-hooks)
21. [Component](#21-component)
22. [Component Props](#22-component-props)
23. [Component Event](#23-component-event)
24. [Component Model](#24-component-model)
25. [Fallthrough Attributes](#25-fallthrough-attributes)
26. [Component Slot](#26-component-slot)
27. [Dynamic Component](#27-dynamic-component)
28. [Provide dan Inject](#28-provide-dan-inject)
29. [Component Instance](#29-component-instance)
30. [Peta Ingatan Cepat](#30-peta-ingatan-cepat)

---

# 1. Pengenalan

**Vue.js** adalah framework JavaScript untuk membuat UI.

Cara berpikir sederhananya:

```text
STATE / DATA
     │
     ▼
  TEMPLATE
     │
     ▼
     DOM
```

Ketika state berubah:

```text
state berubah
     ↓
Vue mendeteksi perubahan
     ↓
DOM diperbarui
```

Contoh:

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">
    Count: {{ count }}
  </button>
</template>
```

**Output awal:**

```text
Count: 0
```

Klik tombol:

```text
Count: 1
Count: 2
Count: 3
...
```

**Kunci:** Vue membuat UI mengikuti state.

---

# 2. Membuat Project

Cara umum membuat project Vue modern menggunakan Vite:

```bash
npm create vue@latest
```

Ikuti pertanyaan setup, kemudian:

```bash
cd nama-project
npm install
npm run dev
```

Struktur sederhananya:

```text
project/
├── src/
│   ├── components/
│   ├── App.vue
│   └── main.js
├── public/
├── index.html
├── package.json
└── vite.config.js
```

File penting:

```text
main.js
   │
   ▼
App.vue
   │
   ├── Component A
   ├── Component B
   └── Component C
```

**Ingat:**

```text
main.js → titik masuk
App.vue  → root component
*.vue    → component
```

---

# 3. Hello Vue

Component Vue biasanya memiliki:

```vue
<script setup>
const message = 'Hello Vue!'
</script>

<template>
  <h1>{{ message }}</h1>
</template>
```

**Output:**

```text
Hello Vue!
```

Vue Single File Component biasanya terdiri dari:

```text
┌─────────────────────────┐
│ <script setup>          │
│   JavaScript            │
├─────────────────────────┤
│ <template>              │
│   HTML-like template    │
├─────────────────────────┤
│ <style>                 │
│   CSS                   │
└─────────────────────────┘
```

---

# 4. API Style

Vue menyediakan dua gaya utama:

## Options API

```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  },

  methods: {
    increment() {
      this.count++
    }
  }
}
</script>
```

## Composition API

Gaya modern yang sering digunakan bersama `<script setup>`:

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>
```

### Perbandingan

```text
Options API
data
methods
computed
watch
    ↓
dikelompokkan berdasarkan jenis fitur

Composition API
ref
computed
watch
function
    ↓
dikelompokkan berdasarkan logika/fitur
```

**Hafalan:** untuk belajar Vue modern, prioritaskan **Composition API + `<script setup>`**.

---

# 5. Template

Template adalah bagian HTML-like tempat kita mendeskripsikan UI.

```vue
<script setup>
const name = 'Budi'
</script>

<template>
  <h1>Halo {{ name }}</h1>
  <p>Selamat belajar Vue.</p>
</template>
```

**Output:**

```text
Halo Budi
Selamat belajar Vue.
```

`{{ }}` disebut **text interpolation**.

```vue
<p>{{ name }}</p>
```

---

# 6. Template Attributes

Attribute HTML dapat diisi menggunakan `v-bind` atau shorthand `:`.

```vue
<script setup>
const imageUrl = '/logo.png'
const title = 'Logo Vue'
</script>

<template>
  <img :src="imageUrl" :alt="title">
</template>
```

Ini:

```vue
:src="imageUrl"
```

adalah shorthand:

```vue
v-bind:src="imageUrl"
```

### Dynamic class

```vue
<div :class="{ active: isActive }">
  Hello
</div>
```

### Dynamic style

```vue
<div :style="{ color: textColor }">
  Hello
</div>
```

**Ingat:**

```text
:value="..."
:class="..."
:style="..."
:src="..."
```

`:` = **bind attribute ke JavaScript**.

---

# 7. JS Expression di Template

Template dapat menjalankan expression JavaScript sederhana.

```vue
<script setup>
const name = 'Budi'
const age = 20
</script>

<template>
  <p>{{ name.toUpperCase() }}</p>
  <p>{{ age + 1 }}</p>
  <p>{{ age >= 18 ? 'Dewasa' : 'Anak' }}</p>
</template>
```

**Output:**

```text
BUDI
21
Dewasa
```

Gunakan expression sederhana.

Untuk logika kompleks, lebih baik gunakan:

```text
computed
method/function
```

daripada membuat template terlalu rumit.

---

# 8. Directive

Directive adalah attribute khusus Vue yang diawali `v-`.

Contoh:

```vue
v-if
v-for
v-bind
v-on
v-model
v-show
v-html
v-text
```

Contoh:

```vue
<p v-if="isLoggedIn">
  Selamat datang
</p>
```

Directive:

```text
v-if="..."
  ↓
perintah Vue
```

### Shorthand penting

```text
v-bind:src   → :src
v-on:click   → @click
```

Jadi:

```vue
<button @click="count++">
```

sama dengan:

```vue
<button v-on:click="count++">
```

---

# 9. State

State adalah data yang menentukan kondisi UI.

Gunakan `ref()` untuk reactive state sederhana.

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <p>{{ count }}</p>
  <button @click="count++">Tambah</button>
</template>
```

**Output awal:**

```text
0
```

Setelah klik:

```text
1
```

### Mengapa `.value`?

Di JavaScript:

```js
count.value++
```

Tetapi di template Vue:

```vue
{{ count }}
```

Vue otomatis melakukan unwrapping ref di template.

**Ingat:**

```text
ref()
 ↓
.value di JavaScript
langsung di template
```

---

# 10. DOM Update

Vue memperbarui DOM ketika reactive state berubah.

```vue
<script setup>
import { ref } from 'vue'

const message = ref('Halo')

function changeMessage() {
  message.value = 'Halo Vue!'
}
</script>

<template>
  <p>{{ message }}</p>
  <button @click="changeMessage">
    Ubah
  </button>
</template>
```

**Sebelum klik:**

```text
Halo
```

**Setelah klik:**

```text
Halo Vue!
```

Diagram:

```text
message.value
     │
     │ berubah
     ▼
 Vue reactive system
     │
     ▼
 DOM update
```

Vue mengatur update DOM secara efisien dan biasanya melakukan flush secara asynchronous.

---

# 11. Reactive

Selain `ref()`, Vue menyediakan `reactive()`.

```vue
<script setup>
import { reactive } from 'vue'

const user = reactive({
  name: 'Budi',
  age: 20
})

function birthday() {
  user.age++
}
</script>

<template>
  <p>{{ user.name }}</p>
  <p>{{ user.age }}</p>

  <button @click="birthday">
    Ulang Tahun
  </button>
</template>
```

**Output awal:**

```text
Budi
20
```

Klik:

```text
Budi
21
```

### `ref` vs `reactive`

```text
ref(value)
  ↓
const count = ref(0)
count.value

reactive(object)
  ↓
const user = reactive({...})
user.name
```

Praktisnya:

```text
Primitive / general purpose → ref()
Object → reactive() atau ref()
```

---

# 12. Computed Properties

`computed()` digunakan untuk **nilai turunan dari state**.

```vue
<script setup>
import { ref, computed } from 'vue'

const price = ref(10000)
const quantity = ref(3)

const total = computed(() => {
  return price.value * quantity.value
})
</script>

<template>
  <p>Total: {{ total }}</p>
</template>
```

**Output:**

```text
Total: 30000
```

Diagram:

```text
price ─────┐
           ├──> computed total
quantity ──┘
                │
                ▼
             30000
```

Computed **di-cache berdasarkan dependency** dan dihitung ulang ketika dependency yang relevan berubah.

**Ingat:**

```text
state → computed → hasil turunan
```

Gunakan computed untuk **nilai**, bukan side effect.

---

# 13. Style

Vue dapat menggunakan `:class` dan `:style`.

## Class object

```vue
<script setup>
import { ref } from 'vue'

const active = ref(true)
</script>

<template>
  <div :class="{ active: active }">
    Menu
  </div>
</template>

<style>
.active {
  font-weight: bold;
}
</style>
```

## Class array

```vue
<div :class="[className, sizeClass]">
```

## Inline style

```vue
<div :style="{ color: color, fontSize: size + 'px' }">
  Text
</div>
```

**Ingat:**

```text
:class → dynamic class
:style → dynamic style
```

---

# 14. Conditional Rendering

Gunakan:

```text
v-if
v-else-if
v-else
v-show
```

Contoh:

```vue
<script setup>
import { ref } from 'vue'

const isLoggedIn = ref(false)
</script>

<template>
  <p v-if="isLoggedIn">Dashboard</p>
  <p v-else>Silakan login</p>
</template>
```

**Output:**

```text
Silakan login
```

### `v-if` vs `v-show`

```text
v-if
 ↓
benar-benar menambah/menghapus DOM

v-show
 ↓
tetap di DOM, hanya mengubah display
```

Gunakan `v-show` ketika elemen sering toggle.

---

# 15. List Rendering

Gunakan `v-for`.

```vue
<script setup>
const users = [
  { id: 1, name: 'Budi' },
  { id: 2, name: 'Andi' },
  { id: 3, name: 'Siti' }
]
</script>

<template>
  <ul>
    <li v-for="user in users" :key="user.id">
      {{ user.name }}
    </li>
  </ul>
</template>
```

**Output:**

```text
Budi
Andi
Siti
```

Diagram:

```text
users
  │
  ├── Budi
  ├── Andi
  └── Siti
       │
       ▼
    v-for
       │
       ▼
  <li>...</li>
```

### Sangat penting: `key`

```vue
:key="user.id"
```

Gunakan key yang **unik dan stabil**.

---

# 16. Event Handling

Gunakan `v-on` atau shorthand `@`.

```vue
<script setup>
function sayHello() {
  alert('Halo!')
}
</script>

<template>
  <button @click="sayHello">
    Klik
  </button>
</template>
```

### Event object

```vue
<button @click="handleClick">
```

```js
function handleClick(event) {
  console.log(event.target)
}
```

### Event modifier

```vue
<form @submit.prevent="submit">
```

```vue
<button @click.stop="click">
```

Modifier umum:

```text
.prevent
.stop
.self
.once
.capture
```

Key modifier:

```vue
<input @keyup.enter="submit">
```

---

# 17. Input Binding

Gunakan `v-model`.

```vue
<script setup>
import { ref } from 'vue'

const name = ref('')
</script>

<template>
  <input v-model="name">
  <p>Halo {{ name }}</p>
</template>
```

Jika user mengetik:

```text
Budi
```

**Output:**

```text
Halo Budi
```

Diagram:

```text
User mengetik
     │
     ▼
  v-model
     │
     ▼
 name.value
     │
     ▼
  Template
```

Untuk tipe lain:

```vue
<input v-model="text">

<input type="checkbox" v-model="checked">

<select v-model="selected">
  <option>A</option>
  <option>B</option>
</select>
```

---

# 18. Watchers

`watch()` digunakan untuk menjalankan side effect ketika state berubah.

```vue
<script setup>
import { ref, watch } from 'vue'

const count = ref(0)

watch(count, (newValue, oldValue) => {
  console.log(oldValue, '→', newValue)
})

count.value = 1
```

Konsep:

```text
count berubah
     ↓
watch mendeteksi
     ↓
callback dijalankan
```

Gunakan watcher untuk hal seperti:

```text
API request
localStorage
logging
side effect
```

Jangan gunakan `watch` hanya untuk menghitung nilai turunan. Untuk itu gunakan `computed`.

---

# 19. Template Refs

Template ref digunakan untuk mendapatkan referensi ke elemen DOM atau component.

```vue
<script setup>
import { ref, onMounted } from 'vue'

const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="input">
</template>
```

Diagram:

```text
template
  │
  │ ref="input"
  ▼
input.value
  │
  ▼
DOM element
```

Template ref biasanya baru tersedia setelah component mounted.

---

# 20. Lifecycle Hooks

Lifecycle adalah tahapan hidup component.

Yang sering digunakan:

```text
onMounted
onUpdated
onUnmounted
```

Contoh:

```vue
<script setup>
import {
  onMounted,
  onUpdated,
  onUnmounted
} from 'vue'

onMounted(() => {
  console.log('Mounted')
})

onUpdated(() => {
  console.log('Updated')
})

onUnmounted(() => {
  console.log('Unmounted')
})
</script>
```

Diagram:

```text
Component dibuat
      │
      ▼
   Mounted
      │
      ▼
  Update state
      │
      ▼
   Updated
      │
      ▼
Component dihapus
      │
      ▼
  Unmounted
```

**Ingat:**

```text
onMounted   → setelah masuk DOM
onUpdated   → setelah update
onUnmounted → sebelum/ketika dilepas
```

---

# 21. Component

Component adalah bagian UI yang dapat digunakan kembali.

`UserCard.vue`:

```vue
<script setup>
defineProps({
  name: String
})
</script>

<template>
  <div>
    User: {{ name }}
  </div>
</template>
```

Parent:

```vue
<script setup>
import UserCard from './components/UserCard.vue'
</script>

<template>
  <UserCard name="Budi" />
  <UserCard name="Andi" />
</template>
```

**Output:**

```text
User: Budi
User: Andi
```

Diagram:

```text
App
 │
 ├── UserCard("Budi")
 │
 └── UserCard("Andi")
```

---

# 22. Component Props

Props adalah data yang dikirim **parent → child**.

Child:

```vue
<script setup>
defineProps({
  name: String,
  age: Number
})
</script>

<template>
  <p>{{ name }} - {{ age }}</p>
</template>
```

Parent:

```vue
<UserCard
  name="Budi"
  :age="20"
/>
```

**Output:**

```text
Budi - 20
```

### Dengan TypeScript

```vue
<script setup lang="ts">
interface Props {
  name: string
  age: number
}

defineProps<Props>()
</script>
```

Diagram:

```text
Parent
  │
  │ props
  ▼
Child
```

**Ingat:** props = input component.

---

# 23. Component Event

Event digunakan untuk komunikasi **child → parent**.

Child:

```vue
<script setup>
const emit = defineEmits(['save'])

function save() {
  emit('save', 'Data dari child')
}
</script>

<template>
  <button @click="save">
    Save
  </button>
</template>
```

Parent:

```vue
<script setup>
function handleSave(data) {
  console.log(data)
}
</script>

<template>
  <Child @save="handleSave" />
</template>
```

Ketika button diklik:

```text
Child
  │
  │ emit('save', data)
  ▼
Parent
  │
  ▼
handleSave(data)
```

**Ingat:**

```text
props → parent ke child
emit  → child ke parent
```

---

# 24. Component Model

`v-model` pada component digunakan untuk membuat two-way binding antara parent dan child.

Child:

```vue
<script setup>
defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  >
</template>
```

Parent:

```vue
<script setup>
import { ref } from 'vue'

const name = ref('')
</script>

<template>
  <UserInput v-model="name" />
  <p>{{ name }}</p>
</template>
```

Diagram:

```text
Parent state
    │
    │ modelValue
    ▼
  Child
    │
    │ update:modelValue
    ▼
Parent state
```

Pada Vue modern, dapat juga menggunakan:

```vue
<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model">
</template>
```

---

# 25. Fallthrough Attributes

Attribute yang tidak didefinisikan sebagai props dapat diteruskan ke root element component.

Child:

```vue
<template>
  <button class="btn">
    Simpan
  </button>
</template>
```

Parent:

```vue
<MyButton
  id="save"
  class="primary"
  disabled
/>
```

Attribute seperti:

```text
id
class
style
disabled
```

dapat "jatuh" ke root element.

Konsep:

```text
<MyButton disabled>
       │
       ▼
root <button>
       │
       └── disabled
```

Untuk mengontrolnya:

```vue
<script setup>
defineOptions({
  inheritAttrs: false
})
</script>
```

Kemudian gunakan `$attrs` atau `useAttrs()` sesuai kebutuhan.

---

# 26. Component Slot

Slot digunakan untuk mengirim **isi/template dari parent ke child**.

Child:

```vue
<template>
  <div class="card">
    <slot />
  </div>
</template>
```

Parent:

```vue
<Card>
  <h2>Hello</h2>
  <p>Isi card</p>
</Card>
```

Hasil konsep:

```text
Card
┌──────────────────┐
│ Hello             │
│ Isi card          │
└──────────────────┘
```

### Named slot

Child:

```vue
<template>
  <header>
    <slot name="header" />
  </header>

  <main>
    <slot />
  </main>
</template>
```

Parent:

```vue
<Card>
  <template #header>
    <h1>Judul</h1>
  </template>

  <p>Isi</p>
</Card>
```

**Ingat:**

```text
props → kirim data
slot  → kirim template/isi UI
```

---

# 27. Dynamic Component

Dynamic component digunakan untuk mengganti component secara dinamis.

```vue
<script setup>
import { ref } from 'vue'
import Home from './Home.vue'
import About from './About.vue'

const current = ref(Home)
</script>

<template>
  <button @click="current = Home">Home</button>
  <button @click="current = About">About</button>

  <component :is="current" />
</template>
```

Diagram:

```text
current
  │
  ├── Home
  │      ↓
  │   <component :is="current">
  │
  └── About
         ↓
      component berubah
```

Cocok untuk:

```text
tab
wizard
step
dynamic view
```

---

# 28. Provide dan Inject

Digunakan untuk mengirim data dari ancestor ke descendant tanpa harus melewati props setiap level.

Parent:

```vue
<script setup>
import { provide, ref } from 'vue'

const theme = ref('dark')

provide('theme', theme)
</script>
```

Descendant:

```vue
<script setup>
import { inject } from 'vue'

const theme = inject('theme')
</script>

<template>
  <p>Theme: {{ theme }}</p>
</template>
```

Diagram:

```text
Grandparent
    │
    │ provide
    ▼
 Parent
    │
    ▼
 Child
    │
    ▼
Grandchild
    ↑
    │ inject
    └──────── data
```

**Ingat:**

```text
provide → kirim ke bawah
inject  → ambil dari ancestor
```

Untuk aplikasi besar, gunakan key yang terstruktur dan pertimbangkan state management bila memang diperlukan.

---

# 29. Component Instance

Component instance adalah object internal yang mewakili sebuah instance component.

Dalam Composition API, biasanya kita **tidak perlu mengakses instance secara langsung**.

Namun untuk kasus tertentu:

```vue
<script setup>
import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()

console.log(instance)
</script>
```

`getCurrentInstance()` hanya tersedia dalam konteks setup tertentu.

Untuk expose API dari child ke parent:

```vue
<script setup>
function focus() {
  console.log('focus')
}

defineExpose({
  focus
})
</script>
```

Parent dapat menggunakan template ref pada component untuk mengakses API yang diexpose.

Diagram:

```text
Parent
  │
  │ template ref
  ▼
Child instance
  │
  └── exposed API
       └── focus()
```

**Catatan:** jangan menjadikan akses instance sebagai cara utama komunikasi antar-component. Gunakan props, emits, slots, provide/inject, atau state management sesuai kebutuhan.

---

# 30. Peta Ingatan Cepat

## A. Alur dasar Vue

```text
        STATE
          │
          ▼
       TEMPLATE
          │
          ▼
          DOM
          ▲
          │
       EVENT
          │
          └────── state berubah
```

Contoh:

```text
count = 0
   │
   ▼
{{ count }}
   │
   ▼
Count: 0
   │
 click
   ▼
count++
   │
   ▼
Count: 1
```

---

## B. State

```text
ref()
  ↓
nilai reactive
  ↓
.value di JS

reactive()
  ↓
object reactive
  ↓
property langsung
```

---

## C. Template

```text
{{ value }}
    ↓
text interpolation

:value
    ↓
v-bind

@click
    ↓
v-on

v-if
    ↓
conditional

v-for
    ↓
list

v-model
    ↓
two-way binding
```

---

## D. Computed vs Watch

```text
Butuh MENGHITUNG NILAI?
        ↓
     computed

Butuh MENJALANKAN SIDE EFFECT?
        ↓
       watch
```

Contoh:

```text
price + quantity
      ↓
   computed
      ↓
     total
```

Sedangkan:

```text
user berubah
      ↓
     watch
      ↓
API / localStorage / logging
```

---

## E. Component Communication

```text
              Parent
             /      \
          props      event
           ↓          ↑
         Child ── emit ──→ Parent
           │
           │ slot
           ▼
       UI content
```

Hafalan:

```text
props → parent → child
emit  → child → parent
slot  → parent kirim template ke child
```

---

## F. Provide / Inject

```text
Ancestor
   │
provide()
   │
   ▼
  ...
   │
   ▼
Descendant
   │
inject()
```

Digunakan ketika props terlalu panjang untuk diteruskan melalui banyak level.

---

## G. Component Dynamic

```text
component
    │
    ├── Home
    ├── About
    └── Profile

:is="current"
    ↓
component yang aktif
```

---

# Cheat Code Vue 10 Detik

> **`ref()` membuat state reactive. `reactive()` membuat object reactive. `computed()` membuat nilai turunan. `watch()` mengawasi perubahan untuk side effect. `v-if` mengatur kondisi. `v-for` membuat list. `@` menangani event. `:` melakukan binding. `v-model` menghubungkan input dengan state. Props mengirim data parent → child. Emit mengirim event child → parent. Slot mengirim template. Provide/Inject mengirim data melewati component tree.**

---

# Tabel Ringkasan

| Materi | Fungsi | Kata kunci |
|---|---|---|
| Pengenalan | Dasar Vue | component, reactive |
| Membuat Project | Membuat aplikasi | Vite, npm |
| Hello Vue | Component pertama | `<template>` |
| API Style | Gaya penulisan Vue | Composition / Options |
| Template | Menulis UI | `{{ }}` |
| Template Attributes | Binding attribute | `:` / `v-bind` |
| JS Expression | Ekspresi di template | `{{ }}` |
| Directive | Instruksi Vue | `v-` |
| State | Data UI | `ref`, `reactive` |
| DOM Update | Update UI | reactive update |
| Reactive | Data reaktif | `ref`, `reactive` |
| Computed | Nilai turunan | `computed()` |
| Style | Dynamic styling | `:class`, `:style` |
| Conditional | Kondisi | `v-if`, `v-show` |
| List | Perulangan | `v-for`, `:key` |
| Event | Interaksi | `@click` |
| Input | Form binding | `v-model` |
| Watchers | Side effect | `watch()` |
| Template Refs | Akses DOM/component | `ref="..."` |
| Lifecycle | Siklus component | `onMounted()` |
| Component | UI reusable | `.vue` |
| Props | Parent → child | `defineProps()` |
| Event | Child → parent | `defineEmits()` |
| Model | Component `v-model` | `defineModel()` |
| Fallthrough | Attribute ke root | `$attrs` |
| Slot | Kirim template | `<slot>` |
| Dynamic Component | Component dinamis | `<component :is>` |
| Provide | Kirim data ke bawah | `provide()` |
| Inject | Ambil data dari atas | `inject()` |
| Component Instance | Instance component | `getCurrentInstance()` |

---

# Urutan Belajar yang Disarankan

```text
1. Pengenalan
       ↓
2. Membuat Project
       ↓
3. Hello Vue
       ↓
4. Template
       ↓
5. Directive
       ↓
6. State
       ↓
7. Reactive
       ↓
8. Computed
       ↓
9. Conditional + List
       ↓
10. Event + Input
        ↓
11. Watch
        ↓
12. Component
        ↓
13. Props + Event
        ↓
14. Slot
        ↓
15. Component Model
        ↓
16. Lifecycle
        ↓
17. Provide / Inject
        ↓
18. Dynamic Component
        ↓
19. Component Instance
```

## Mini Project untuk Menggabungkan Konsep

Contoh sederhana **Todo App**:

```vue
<script setup>
import { ref, computed } from 'vue'

const newTodo = ref('')

const todos = ref([
  { id: 1, text: 'Belajar Vue', done: false },
  { id: 2, text: 'Membuat project', done: true }
])

const remaining = computed(() => {
  return todos.value.filter(todo => !todo.done).length
})

function addTodo() {
  if (!newTodo.value.trim()) return

  todos.value.push({
    id: Date.now(),
    text: newTodo.value,
    done: false
  })

  newTodo.value = ''
}

function removeTodo(id) {
  todos.value = todos.value.filter(todo => todo.id !== id)
}
</script>

<template>
  <h1>Todo App</h1>

  <form @submit.prevent="addTodo">
    <input
      v-model="newTodo"
      placeholder="Todo baru..."
    >

    <button>Tambah</button>
  </form>

  <p>Sisa: {{ remaining }}</p>

  <ul>
    <li
      v-for="todo in todos"
      :key="todo.id"
    >
      <input
        type="checkbox"
        v-model="todo.done"
      >

      <span :class="{ done: todo.done }">
        {{ todo.text }}
      </span>

      <button @click="removeTodo(todo.id)">
        Hapus
      </button>
    </li>
  </ul>
</template>

<style>
.done {
  text-decoration: line-through;
}
</style>
```

**Output konsep:**

```text
Todo App

[ Todo baru...            ] [Tambah]

Sisa: 1

☐ Belajar Vue       [Hapus]
☑ Membuat project   [Hapus]
```

Project kecil ini sudah menggabungkan:

```text
ref
 │
 ├── state
 │
 ├── computed
 │
 ├── v-model
 │
 ├── v-for
 │
 ├── :class
 │
 ├── @click
 │
 └── @submit.prevent
```

> **Kunci utama Vue:** pahami alur **State → Template → Event → State berubah → DOM diperbarui**. Setelah itu pelajari **Component → Props → Emit → Slot**, karena sebagian besar aplikasi Vue tersusun dari pola tersebut.
