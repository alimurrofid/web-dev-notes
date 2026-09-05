---
title: "Vue Dasar"
description: "Fundamental Vue 3: Composition API, <script setup>, Reactivity (ref, reactive), Computed properties, Watchers, Directives, dan Component basics."
order: 1
tags:
  - web-development
  - frontend
  - vue
  - javascript
  - fundamental
---

# Vue Dasar

> **Target:** pemula yang sudah memahami JavaScript dasar, lalu ingin
> **Versi:** Vue 3.x (Composition API)
> **Prasyarat:** [[javascript-dasar|JavaScript Dasar]] · [[javascript-dom|JavaScript DOM]]
> Fokus modul pembelajaran ini: **template → state → reactive → computed →
> Semua contoh utama menggunakan `<script setup>` agar cocok dengan gaya Vue


## Cara Belajar

```text
🟢 Fundamental
→ wajib untuk mulai membuat UI dengan Vue

🟡 Lanjutan
→ pelajari setelah fundamental nyaman

🔴 Advanced / Reference
→ penting ketika kebutuhan aplikasi meningkat
```

Mental model:

```text
STATE / DATA
     |
     v
  TEMPLATE
     |
     v
     DOM
```

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan](#bagian-1)
2. [Membuat Project](#bagian-2)
3. [Hello Vue](#bagian-3)
4. [API Style](#bagian-4)
5. [Template](#bagian-5)
6. [Template Attributes](#bagian-6)
7. [JS Expression di Template](#bagian-7)
8. [Directive](#bagian-8)
9. [State](#bagian-9)
10. [DOM Update](#bagian-10)
11. [Reactive](#bagian-11)
12. [Computed Properties](#bagian-12)
13. [Style](#bagian-13)
14. [Conditional Rendering](#bagian-14)
15. [List Rendering](#bagian-15)
16. [Event Handling](#bagian-16)
17. [Input Binding](#bagian-17)

### 🟡 Lanjutan

18. [Watchers](#bagian-18)
19. [Template Refs](#bagian-19)
20. [Lifecycle Hooks](#bagian-20)
21. [Component](#bagian-21)
22. [Component Props](#bagian-22)
23. [Component Event](#bagian-23)
24. [Component Model](#bagian-24)
25. [Fallthrough Attributes](#bagian-25)
26. [Component Slot](#bagian-26)
27. [Dynamic Component](#bagian-27)
28. [Provide dan Inject](#bagian-28)

### 🔴 Advanced / Reference

29. [Component Instance](#bagian-29)
30. [Peta Ingatan Cepat](#bagian-30)
31. [Tabel Ringkasan](#bagian-31)
32. [Cheat Code Vue 10 Detik](#bagian-32)
33. [Urutan Belajar yang Disarankan](#bagian-33)
34. [Mini Project](#bagian-34)
35. [Referensi Resmi](#bagian-35)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan

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

```html
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

<a id="bagian-2"></a>

## 2. 🟢 Membuat Project

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

**Kunci:**

```text
main.js → titik masuk
App.vue  → root component
*.vue    → component
```

---

<a id="bagian-3"></a>

## 3. 🟢 Hello Vue

Component Vue biasanya memiliki:

```html
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
│ <style scoped>          │
│   CSS                   │
└─────────────────────────┘
```

---

<a id="bagian-4"></a>

## 4. 🟢 API Style

Vue menyediakan dua gaya utama:

#### Options API

```html
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

#### Composition API

Gaya modern yang sering digunakan bersama `<script setup>`:

```html
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>
```

##### Perbandingan

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

**Kunci:** untuk belajar Vue modern, prioritaskan **Composition API + `<script setup>`**.

---

<a id="bagian-5"></a>

## 5. 🟢 Template

Template adalah bagian HTML-like tempat kita mendeskripsikan struktur UI yang akan ditampilkan ke layar.

```html
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

##### Text Interpolation

Syntax `{{ }}` (*Mustache syntax*) disebut **text interpolation**. Ini adalah cara paling dasar untuk menyisipkan data atau variabel JavaScript ke dalam teks HTML secara dinamis.

```html
<p>Halo, {{ name }}!</p>
```

Vue akan merender nilai variabel `name` sebagai teks polos (*plain text*). Jika nilai `name` berubah, tampilan teks di browser otomatis diperbarui.

**Kunci:** `{{ }}` digunakan untuk menyisipkan teks dinamis ke dalam elemen HTML.

---

<a id="bagian-6"></a>

## 6. 🟢 Template Attributes

Attribute binding adalah mekanisme untuk menghubungkan atribut elemen HTML (seperti `src`, `href`, `title`, `disabled`, `class`, dan `style`) dengan nilai data atau ekspresi JavaScript secara dinamis menggunakan directive `v-bind` atau shorthand titik dua (`:`).

```html
<script setup>
import { ref } from 'vue'

const imageUrl = '/logo.png'
const title = 'Logo Vue'
const isDisabled = ref(true)
</script>

<template>
  <!-- Shorthand :src sama artinya dengan v-bind:src -->
  <img :src="imageUrl" :alt="title">

  <!-- Binding boolean attribute -->
  <button :disabled="isDisabled">
    Tombol Nonaktif
  </button>
</template>
```

**Output di DOM:**

```html
<img src="/logo.png" alt="Logo Vue">
<button disabled>Tombol Nonaktif</button>
```

##### Atribut Boolean

Untuk atribut boolean seperti `disabled`, `checked`, atau `readonly`:
- Jika nilainya *truthy* (`true`, `'yes'`), atribut akan disertakan pada elemen HTML.
- Jika nilainya *falsy* (`false`, `null`, `undefined`), atribut otomatis dihilangkan oleh Vue.

**Kunci:**

```text
:src="..."      → binding atribut src
:disabled="..." → binding atribut boolean
:class="..."    → dynamic class
:style="..."    → dynamic style
```

`:` adalah shorthand resmi untuk `v-bind:`.

---

<a id="bagian-7"></a>

## 7. 🟢 JS Expression di Template

Template dapat menjalankan expression JavaScript sederhana.

```html
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

<a id="bagian-8"></a>

## 8. 🟢 Directive

Directive adalah atribut HTML khusus bawaan Vue yang selalu diawali dengan awalan `v-`. Directive memberikan instruksi khusus kepada Vue untuk memanipulasi elemen DOM ketika nilai ekspresinya berubah.

##### Anatomi Directive

```text
v-on:click.prevent="submit"
──┬─ ──┬── ───┬───  ───┬──
  │    │      │        └─ Value: ekspresi / handler JavaScript yang dijalankan
  │    │      └────────── Modifier: postfix khusus untuk mengubah perilaku event/binding
  │    └───────────────── Argument: target nama event atau nama attribute HTML
  └────────────────────── Directive Name: nama directive bawaan Vue (v-on, v-bind, dll.)
```

##### Daftar Directive Umum

```text
v-bind  (:)       → menghubungkan attribute HTML ke JavaScript
v-on    (@)       → mendengarkan event DOM (klik, submit, keyup)
v-model           → two-way data binding pada form input
v-if / v-else     → conditional rendering (tambah/hapus elemen di DOM)
v-show            → conditional display (toggle display: none)
v-for             → list rendering (perulangan data array)
v-html            → merender raw HTML (hati-hati risiko XSS)
v-text            → mengupdate textContent elemen
```

##### Shorthand Paling Sering Digunakan

```text
v-bind:src="url"     → :src="url"
v-on:click="handler" → @click="handler"
```

Contoh:

```html
<!-- Menggunakan shorthand resmi -->
<button @click="count++">
  Tambah
</button>
```

**Kunci:**

```text
: → shorthand v-bind (attribute)
@ → shorthand v-on (event)
# → shorthand v-slot (slot)
```

---

<a id="bagian-9"></a>

## 9. 🟢 State

State adalah data yang menentukan kondisi dan tampilan UI. Ketika data state berubah, Vue akan otomatis memperbarui tampilan UI yang menggunakan data tersebut.

Gunakan `ref()` untuk membuat reactive state (baik tipe primitif seperti string/number/boolean maupun object).

```html
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <p>Total: {{ count }}</p>
  <button @click="increment">Tambah</button>
</template>
```

**Output awal:**

```text
Total: 0
```

Setelah klik tombol:

```text
Total: 1
```

##### Mengapa `.value`?

`ref()` membungkus nilai data ke dalam sebuah objek reaktif dengan properti `.value`.

Aturan akses `ref()`:

1. **Di JavaScript (`<script>`)**: wajib menggunakan `.value` untuk membaca atau mengubah data:
   ```js
   console.log(count.value) // membaca nilai
   count.value++            // mengubah nilai
   ```
2. **Di template (`<template>`)**: **tidak perlu** `.value` karena Vue otomatis melakukan unwrapping (*auto-unwrap*):
   ```html
   <p>{{ count }}</p>
   ```

**Kunci:**

```text
ref()
 ↓
.value saat di <script> (JavaScript)
tanpa .value saat di <template> (HTML)
```

---

<a id="bagian-10"></a>

## 10. 🟢 DOM Update

Vue memperbarui DOM secara otomatis ketika reactive state berubah.

```html
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
message.value berubah
        │
        ▼
Vue Reactive System
        │
        ▼
DOM Update (Asynchronous Batch)
```

##### Update Asynchronous & `nextTick()`

Ketika data state berubah, Vue tidak langsung mengupdate DOM saat itu juga secara sinkron, melainkan mengumpulkannya dalam antrean (*buffer*) dan melakukan *batch update* secara asynchronous agar performa rendering tetap efisien.

Jika Anda perlu mengakses elemen DOM tepat setelah DOM selesai diperbarui (misalnya mengambil ukuran tinggi elemen baru atau memfokuskan input), gunakan fungsi `nextTick()`:

```html
<script setup>
import { ref, nextTick } from 'vue'

const message = ref('Halo')

async function changeMessage() {
  message.value = 'Halo Vue!'
  
  // Tunggu hingga Vue selesai mengupdate DOM
  await nextTick()
  console.log('DOM sudah selesai diperbarui!')
}
</script>
```

**Kunci:** Vue melakukan DOM update secara asynchronous; gunakan `await nextTick()` jika butuh menunggu DOM selesai diperbarui.

---

<a id="bagian-11"></a>

## 11. 🟢 Reactive

`reactive()` adalah fungsi alternatif untuk membuat objek atau array menjadi reactive secara mendalam (*deep reactive*).

Berbeda dengan `ref()`, `reactive()` tidak membungkus data dalam `.value`, melainkan langsung mengembalikan **JavaScript Proxy** dari objek tersebut.

```html
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

##### Keterbatasan `reactive()`

Meskipun terlihat lebih praktis tanpa `.value`, `reactive()` memiliki beberapa keterbatasan penting karena menggunakan JavaScript Proxy:

1. **Hanya untuk tipe objek**: Tidak bisa digunakan untuk data primitif (`string`, `number`, `boolean`).
   ```js
   // ❌ Error / tidak bekerja
   const count = reactive(0)
   ```
2. **Tidak boleh di-reassign**: Mengganti seluruh objek akan memutus koneksi reaktivitas Proxy aslinya.
   ```js
   let user = reactive({ name: 'Budi' })
   // ❌ Reaktivitas putus!
   user = reactive({ name: 'Andi' })
   ```
3. **Kehilangan reaktivitas saat destructuring**:
   ```js
   const user = reactive({ name: 'Budi', age: 20 })
   // ❌ `name` menjadi string biasa, bukan reactive lagi
   const { name } = user
   ```

##### `ref` vs `reactive`

```text
ref(value)
  ↓
Bisa untuk tipe data apa saja (primitif & objek)
Akses lewat .value di script
Best practice standar Vue 3

reactive(object)
  ↓
Hanya untuk objek/array
Akses langsung tanpa .value
Bekerja dengan JavaScript Proxy
```

**Kunci:** Gunakan `ref()` sebagai pilihan utama (*default*) untuk semua kebutuhan state di Vue 3 modern.

---

<a id="bagian-12"></a>

## 12. 🟢 Computed Properties

`computed()` digunakan untuk membuat **nilai turunan dari reactive state**.

```html
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
price (10000) ────┐
                  ├──> computed(() => ...) ──> total (30000)
quantity (3)  ────┘
```

##### Keunggulan `computed`: Caching Otomatis

Mengapa menggunakan `computed()` daripada fungsi/method biasa di template?

1. **Caching Berdasarkan Dependensi**: `computed()` mengingat (*cache*) hasil perhitungannya. Selama nilai `price` dan `quantity` tidak berubah, pemanggilan `total` berkali-kali akan langsung mengambil hasil cache tanpa menghitung ulang.
2. **Method Tanpa Cache**: Jika kita memanggil fungsi biasa `getTotal()` di template, fungsi tersebut akan dieksekusi ulang **setiap kali terjadi re-render pada komponen**, meskipun datanya tidak berubah.

##### Sifat Default: Read-Only

Secara default, nilai `computed` bersifat **read-only** (hanya bisa dibaca, tidak boleh di-assign langsung):

```js
// ❌ Peringatan / Error di console
total.value = 50000
```

**Kunci:**

```text
state → computed → nilai turunan (dengan caching)
```

Gunakan `computed` untuk menghitung **nilai/tampilan**, bukan untuk menjalankan side effect (untuk side effect gunakan `watch`).

---

<a id="bagian-13"></a>

## 13. 🟢 Style

Vue menyediakan integrasi khusus untuk manipulasi atribut `class` dan `style` menggunakan data JavaScript dinamis (`:class` dan `:style`).

##### 1. Class Binding: Object Syntax

Class akan diterapkan jika nilai propertinya bernilai *truthy* (`true`):

```html
<script setup>
import { ref } from 'vue'

const isActive = ref(true)
const hasError = ref(false)
</script>

<template>
  <div :class="{ active: isActive, 'text-danger': hasError }">
    Menu Item
  </div>
</template>

<style>
.active {
  color: green;
  font-weight: bold;
}
.text-danger {
  color: red;
}
</style>
```

**Output di DOM:**

```html
<div class="active">Menu Item</div>
```

##### 2. Class Binding: Array Syntax

Gunakan array jika ingin menerapkan beberapa class CSS secara bersamaan:

```html
<script setup>
import { ref } from 'vue'

const activeClass = ref('active')
const sizeClass = ref('text-large')
</script>

<template>
  <div :class="[activeClass, sizeClass]">
    Konten Utama
  </div>
</template>
```

**Output di DOM:**

```html
<div class="active text-large">Konten Utama</div>
```

##### 3. Inline Style Binding

Gunakan objek JavaScript untuk mengatur properti CSS inline:

```html
<script setup>
import { ref } from 'vue'

const textColor = ref('blue')
const fontSize = ref(18)
</script>

<template>
  <div :style="{ color: textColor, fontSize: fontSize + 'px' }">
    Teks Berwarna
  </div>
</template>
```

**Output di DOM:**

```html
<div style="color: blue; font-size: 18px;">Teks Berwarna</div>
```

**Kunci:**

```text
:class="{ active: isActive }"     → toggle class berdasarkan kondisi boolean
:class="[classA, classB]"         → gabungkan beberapa class
:style="{ color: textColor }"     → styling CSS inline dinamis
```

---

<a id="bagian-14"></a>

## 14. 🟢 Conditional Rendering

Conditional rendering adalah teknik untuk menampilkan, menyembunyikan, atau mengganti elemen UI di layar berdasarkan kondisi logika (*truthy/falsy*) dari state.

Vue menyediakan beberapa directive untuk conditional rendering:

```text
v-if      → render elemen jika kondisi true
v-else-if → kondisi alternatif
v-else    → fallback jika semua kondisi di atas false
v-show    → toggle tampilan elemen (CSS display)
```

Contoh:

```html
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

##### `v-if` vs `v-show`

```text
v-if
 ↓
Benar-benar menambah atau menghapus elemen dari DOM tree.
Lebih hemat biaya render awal jika kondisi awal false.

v-show
 ↓
Elemen selalu ada di DOM, hanya mengubah CSS display: none.
Lebih hemat biaya jika elemen sangat sering di-toggle (tampil/sembunyi).
```

**Kunci:** Gunakan `v-if` untuk percabangan kondisional umum, gunakan `v-show` jika elemen sangat sering di-toggle.

---

<a id="bagian-15"></a>

## 15. 🟢 List Rendering

List rendering adalah teknik untuk merender daftar elemen berulang (seperti daftar produk, daftar pengguna, atau baris tabel) dari data Array atau Objek ke template HTML menggunakan directive `v-for`.

```html
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

##### Sangat penting: `key`

```html
:key="user.id"
```

Selalu sertakan atribut `:key` yang **unik dan stabil** (seperti ID database) pada setiap item `v-for`. Atribut `key` membantu algoritma Virtual DOM Vue melacak identitas setiap elemen secara efisien saat urutan data berubah, ditambah, atau dihapus.

**Kunci:** Gunakan `v-for="item in items" :key="item.id"` untuk merender data list berulang.

---

<a id="bagian-16"></a>

## 16. 🟢 Event Handling

Event handling adalah mekanisme untuk mendengarkan (*listen*) dan merespons aksi atau interaksi dari pengguna (seperti klik tombol, input keyboard, hover mouse, atau submit form) menggunakan directive `v-on` atau shorthand `@`.

```html
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

##### Event Object

Handler fungsi dapat menerima parameter objek `event` bawaan browser secara otomatis:

```html
<button @click="handleClick">
  Lihat Target
</button>
```

```js
function handleClick(event) {
  console.log(event.target)
}
```

##### Event Modifier

Vue menyediakan modifier event untuk mempermudah penanganan perilaku default event tanpa perlu memanggil `event.preventDefault()` atau `event.stopPropagation()` secara manual:

```html
<!-- Mencegah reload halaman saat submit form -->
<form @submit.prevent="submit">
```

```html
<!-- Menghentikan event bubbling -->
<button @click.stop="click">
```

Modifier umum:

```text
.prevent → memanggil event.preventDefault()
.stop    → memanggil event.stopPropagation()
.self    → hanya trigger jika target event adalah elemen itu sendiri
.once    → hanya trigger event 1 kali saja
.capture → menggunakan event capture mode
```

Key modifier untuk mendengarkan tombol keyboard tertentu:

```html
<input @keyup.enter="submit">
```

**Kunci:** Gunakan `@event="handler"` untuk menangani event interaksi pengguna.

---

<a id="bagian-17"></a>

## 17. 🟢 Input Binding

Input binding adalah mekanisme untuk menghubungkan nilai elemen form input (seperti input teks, textarea, checkbox, radio, dan select dropdown) dengan reactive state secara dua arah (*two-way data binding*) menggunakan directive `v-model`.

Ketika pengguna mengetik di form UI, data state otomatis berubah. Sebaliknya, ketika data state diubah lewat kode JavaScript, tampilan form di UI otomatis diperbarui.

```html
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
User mengetik di UI
     │
     ▼
  v-model (Two-way Binding)
     │
     ▼
  name.value (State)
     │
     ▼
  Template / DOM terupdate
```

##### Penggunaan pada Berbagai Tipe Input

`v-model` secara cerdas menyesuaikan properti DOM yang di-bind sesuai tipe inputnya:

```html
<!-- Input Text -->
<input v-model="text">

<!-- Checkbox (boolean) -->
<input type="checkbox" v-model="checked">

<!-- Select Dropdown -->
<select v-model="selected">
  <option value="A">Opsi A</option>
  <option value="B">Opsi B</option>
</select>
```

**Kunci:** `v-model` menyederhanakan two-way data binding antara form input dan reactive state.

---

<a id="bagian-18"></a>

## 18. 🟡 Watchers

`watch()` digunakan untuk menjalankan side effect ketika state berubah.

```html
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

**Kunci:**

```text
 computed = menghasilkan nilai baru berdasarkan data lain.
 watch = melakukan sesuatu ketika data berubah.
```

---

<a id="bagian-19"></a>

## 19. 🟡 Template Refs

Template ref digunakan untuk mendapatkan referensi langsung ke elemen HTML (DOM) atau instance komponen anak tanpa harus menggunakan `document.querySelector()`.

```html
<script setup>
import { ref, onMounted } from 'vue'

// Inisialisasi ref dengan nilai awal null
const input = ref(null)

onMounted(() => {
  // DOM element sudah siap dan dapat diakses
  input.value.focus()
})
</script>

<template>
  <!-- Menghubungkan variabel ref dengan elemen HTML -->
  <input ref="input" placeholder="Otomatis fokus saat halaman dimuat">
</template>
```

Diagram:

```text
Deklarasi di <script>
  const input = ref(null) ── (awal: null)
          │
          │ template rendering
          ▼
<input ref="input"> ─────── (elemen DOM terpasang)
          │
          │ onMounted()
          ▼
input.value ───────────────> HTMLInputElement (bisa di-focus(), dll.)
```

##### Mengapa Nilai Awalnya `null`?

Saat baris `<script setup>` pertama kali dieksekusi, komponen baru saja diinisialisasi dan elemen HTML **belum dibuat di DOM fisik**. Oleh karena itu, variabel ref harus diinisialisasi dengan `null`. 

Referensi DOM baru akan terisi oleh Vue setelah komponen selesai dirender dan dipasang ke DOM (`onMounted()`).

**Kunci:** Template ref hanya dapat diakses setelah komponen masuk ke tahap `onMounted()`.

---

<a id="bagian-20"></a>

## 20. 🟡 Lifecycle Hooks

Lifecycle adalah tahapan hidup sebuah component Vue, mulai dari component dibuat, ditampilkan, diperbarui, sampai dihapus.

Yang sering digunakan:

```text
onMounted
onUpdated
onUnmounted
```

Contoh:

```html
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
        ┌───────────────────┐
        │ Component dibuat  │
        └─────────┬─────────┘
                  │
                  ▼
            ┌──────────────┐
            │ onMounted()  │
            │              │
            │ masuk DOM    │
            └─────┬────────┘
                  │
                  │ Component Hidup
                  ▼
        ┌─────────────────────────┐
        │    State berubah        │
        │         │               │
        │         ▼               │
        │    onUpdated()          │
        │         │               │
        │         │               │
        │    State berubah lagi   │
        │         │               │
        │         ▼               │
        │    onUpdated()          │
        │         │               │
        │        ...              │
        └─────────┬───────────────┘
                  │
                  │ Component dihapus
                  ▼
          ┌──────────────────┐
          │ onUnmounted()    │
          │                  │
          │ setelah dilepas  │
          └──────────────────┘
```

**Kunci:**

```text
onMounted   → setelah component masuk DOM
onUpdated   → setelah component/DOM diperbarui
              dan bisa terjadi berkali-kali
onUnmounted → setelah component dilepas
```

**Urutan sederhananya:**

```text
Component dibuat
      │
      ▼
 onMounted()
      │
      ▼
Component hidup
      │
      ├──── state berubah ────→ onUpdated()
      │                              │
      │                              └── bisa berulang
      │
      ▼
Component dihapus
      │
      ▼
onUnmounted()
```
**Referensi:** [Lifecycle Hooks & Lifecycle Diagram](https://vuejs.org/guide/essentials/lifecycle.html)

---

<a id="bagian-21"></a>

## 21. 🟡 Component

Component adalah bagian UI yang dapat digunakan kembali.

`UserCard.vue`:

```html
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

```html
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

<a id="bagian-22"></a>

## 22. 🟡 Component Props

Props adalah data yang dikirim **parent → child**.

Child:

```html
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

```html
<UserCard
  name="Budi"
  :age="20"
/>
```

**Output:**

```text
Budi - 20
```

##### Dengan TypeScript

```html
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

**Kunci:** props = input component.

---

<a id="bagian-23"></a>

## 23. 🟡 Component Event

Component Event digunakan untuk komunikasi dari child component ke parent component melalui custom event (emit).

Child:

```html
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

```html
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
                │
                │ emit('save', data)
                ▼
        ┌───────────────────────┐
        │  Event "save" + data  │
        └────────┬──────────────┘
                 │
                 ▼
              Parent
                 │
                 │ @save
                 ▼
         handleSave(data)
```

Hubungan dengan props:

```text
       ┌──────────────┐
       │    Parent    │
       └──────┬───────┘
              │       ▲
        props │       │ emit event
              ▼       │
       ┌──────────────┐
       │    Child     │
       └──────────────┘
```

Lebih Sederhananya:

```text
props
  │
  │ data
  ▼
Parent ─────────→ Child


emit
  │
  │ event + data
  ▼
Child ──────────→ Parent
```

**Kunci:**

```text
props → parent ke child
emit  → child ke parent
```

---

<a id="bagian-24"></a>

## 24. 🟡 Component Model

`v-model` pada komponen kustom digunakan untuk membuat komunikasi dua arah (*two-way data binding*) antara parent dan child component.

##### 1. Cara Modern: `defineModel()` (Vue 3.4+)

`defineModel()` adalah makro resmi bawaan Vue yang menyederhanakan two-way binding menjadi sangat ringkas:

**Child Component (`CustomInput.vue`):**

```html
<script setup>
// defineModel() otomatis mengelola prop dan emit internal
const model = defineModel()
</script>

<template>
  <input v-model="model" placeholder="Ketik sesuatu...">
</template>
```

**Parent Component:**

```html
<script setup>
import { ref } from 'vue'
import CustomInput from './CustomInput.vue'

const username = ref('Budi')
</script>

<template>
  <!-- v-model sinkron otomatis 2 arah dengan CustomInput -->
  <CustomInput v-model="username" />
  <p>Nama: {{ username }}</p>
</template>
```

**Output:**

```text
Nama: Budi
```

---

##### 2. Cara Konvensional (Vue 3.3 ke Bawah)

Di balik layar, `v-model` pada komponen bekerja menggunakan pasangan **prop `modelValue`** dan **event `update:modelValue`**:

**Child Component (`UserInput.vue`):**

```html
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

Diagram Alur Kerja:

```text
Parent (username)
       │
       │ :modelValue (Prop ke bawah)
       ▼
Child (<input>)
       │
       │ @update:modelValue (Emit ke atas)
       ▼
Parent (username terupdate)
```

**Kunci:**

```text
Vue 3.4+         → gunakan defineModel() (paling bersih dan direkomendasikan)
Di balik layar   → prop modelValue + emit update:modelValue
```

---

<a id="bagian-25"></a>

## 25. 🟡 Fallthrough Attributes

Fallthrough attribute adalah atribut atau event listener yang dikirimkan ke komponen dari parent, tetapi **tidak dideklarasikan secara eksplisit** di `defineProps()` atau `defineEmits()`.

Secara default, atribut-atribut ini akan otomatis diteruskan (*fallthrough*) ke elemen root dari komponen anak.

**Child Component (`MyButton.vue`):**

```html
<template>
  <!-- class, id, style, dan event listener akan otomatis jatuh ke root <button> -->
  <button class="btn">
    Simpan
  </button>
</template>
```

**Parent Component:**

```html
<template>
  <MyButton
    id="save-btn"
    class="btn-primary"
    disabled
    @click="handleClick"
  />
</template>
```

**Output di DOM:**

```html
<button id="save-btn" class="btn btn-primary" disabled>Simpan</button>
```

---

##### Menonaktifkan Fallthrough: `inheritAttrs: false`

Jika Anda tidak ingin atribut otomatis jatuh ke root element, matikan fitur ini menggunakan `defineOptions`:

```html
<script setup>
defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <div class="wrapper">
    <!-- Tempelkan atribut secara eksplisit ke elemen yang diinginkan menggunakan $attrs -->
    <button v-bind="$attrs">Tombol Kustom</button>
  </div>
</template>
```

##### Multi-Root Components (Fragments)

Jika komponen anak memiliki **lebih dari satu elemen root** di `<template>`, Vue tidak tahu elemen mana yang harus menerima atribut fallthrough dan akan menampilkan peringatan di konsol.

Solusinya: gunakan `v-bind="$attrs"` pada elemen yang dituju secara eksplisit:

```html
<!-- Multi-root: wajib tentukan elemen target dengan v-bind="$attrs" -->
<template>
  <header>Header</header>
  <main v-bind="$attrs">Konten Utama</main>
  <footer>Footer</footer>
</template>
```

**Kunci:** Fallthrough attribute otomatis jatuh ke single-root element; gunakan `v-bind="$attrs"` untuk kontrol manual atau pada multi-root components.

---

<a id="bagian-26"></a>

## 26. 🟡 Component Slot

Slot digunakan untuk mengirim **isi/template dari parent ke child**.

Child:

```html
<template>
  <div class="card">
    <slot />
  </div>
</template>
```

Parent:

```html
<Card>
  <h2>Hello</h2>
  <p>Isi card</p>
</Card>
```

Hasil konsep:

```text
Card
┌──────────────────┐
│ Hello            │
│ Isi card         │
└──────────────────┘
```

##### Named slot

Child:

```html
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

```html
<Card>
  <template #header>
    <h1>Judul</h1>
  </template>

  <p>Isi</p>
</Card>
```

**Kunci:**

```text
props → kirim data
slot  → kirim template/isi UI
```

---

<a id="bagian-27"></a>

## 27. 🟡 Dynamic Component

Dynamic component digunakan untuk mengganti component secara dinamis.

```html
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

<a id="bagian-28"></a>

## 28. 🟡 Provide dan Inject

`provide` dan `inject` digunakan untuk mengirimkan data dari komponen leluhur (*ancestor/grandparent*) langsung ke komponen keturunan (*descendant/grandchild*) yang berada jauh di dalam component tree tanpa harus meneruskan props secara manual di setiap level (**menghindari *prop drilling***).

**Ancestor / Parent Component:**

```html
<script setup>
import { provide, ref } from 'vue'

// Menyediakan reactive state
const theme = ref('dark')

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

// provide(key, value)
provide('theme', theme)
provide('toggleTheme', toggleTheme)
</script>

<template>
  <ChildComponent />
</template>
```

**Descendant / Grandchild Component:**

```html
<script setup>
import { inject } from 'vue'

// inject(key, defaultValue)
const theme = inject('theme')
const toggleTheme = inject('toggleTheme')
</script>

<template>
  <p>Tema Saat Ini: {{ theme }}</p>
  <button @click="toggleTheme">Ganti Tema</button>
</template>
```

Diagram:

```text
       Ancestor Component
                │
                │ provide('theme', ref('dark'))
                ▼
         Child Component  (tidak perlu tahu/meneruskan prop theme)
                │
                ▼
       Grandchild Component
                │
                │ inject('theme') ──> otomatis reactive!
                ▼
           UI Terupdate
```

##### Reaktivitas pada Provide/Inject

- Jika data yang di-*provide* dibungkus dengan `ref()` atau `reactive()`, koneksi reaktivitas **tetap terjaga**. Ketika nilai `theme.value` di ancestor berubah, komponen anak yang meng-*inject* data tersebut akan otomatis terupdate.
- **Best Practice:** Jika komponen anak perlu mengubah data yang di-*inject*, sediakan fungsi mutator dari ancestor (seperti `toggleTheme` di atas) dan jangan mengubah nilai `theme.value` secara langsung di komponen anak.

**Kunci:**

```text
props   → komunikasi langsung parent → child
provide → ancestor menyediakan data/fungsi ke level bawah
inject  → descendant mengambil data/fungsi dari ancestor
```

---

<a id="bagian-29"></a>

## 29. 🔴 Component Instance

Component instance adalah object internal yang mewakili sebuah instance component.
```text
Component
   │
   ▼
Component Instance
(object component yang sedang berjalan)
```

Dalam Composition API, biasanya kita **tidak perlu mengakses instance secara langsung**.

Namun untuk kasus tertentu:

```html
<script setup>
import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()

console.log(instance)
</script>
```

`getCurrentInstance()` hanya digunakan dalam konteks setup tertentu dan umumnya tidak diperlukan untuk penggunaan Vue sehari-hari.

***Untuk expose API dari child ke parent:***
Child dapat menentukan function/property yang boleh diakses Parent:

```html
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
   │ exposed API
   ▼
focus()
```
**Kunci:**

```text
Component Instance → object yang mewakili component
defineExpose()     → menentukan API Child yang boleh diakses Parent
template ref       → Parent mengakses API Child
```

**Catatan:** jangan menjadikan akses instance sebagai cara utama komunikasi antar-component. Gunakan props, emits, slots, provide/inject, atau state management sesuai kebutuhan.

---

<a id="bagian-30"></a>

## 30. 🧠 Peta Ingatan Cepat

#### A. Alur dasar Vue

```text
          STATE
            │
            ▼
        TEMPLATE
            │
            ▼
           DOM
            │
            │ user interaction
            ▼
          EVENT
            │
            │ mengubah
            ▼
          STATE
            │
            └───────────────┐
                            │
                         reactive
                            │
                            ▼
                         TEMPLATE
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
**Kunci:**

```text
State → Template → DOM
Event → State berubah → Template update
```

---

#### B. State

```text
ref()
  ↓
nilai reactive
  ↓
.value di JavaScript
  ↓
.value diakses langsung di template

reactive()
  ↓
object reactive
  ↓
property langsung
```
Contoh:

```text
ref('Budi')
  ↓
name.value

reactive({ name: 'Budi' })
  ↓
user.name
```
**Kunci:**

```text
ref      → nilai tunggal / reference
reactive → object
```

---

#### C. Template

```text
{{ value }}
    ↓
interpolation
    ↓
menampilkan nilai

:value
    ↓
v-bind
    ↓
binding attribute/property

@click
    ↓
v-on
    ↓
event handler

v-if
    ↓
conditional rendering

v-for
    ↓
list rendering

v-model
    ↓
two-way binding
```
**Kunci:**

```text
{{ }}   → tampilkan data
:       → binding
@       → event
v-if    → kondisi
v-for   → perulangan
v-model → two-way binding
```

---

#### D. Computed vs Watch

```text
Butuh MENGHASILKAN NILAI?
          │
          ▼
       computed

Butuh MENJALANKAN SIDE EFFECT?
          │
          ▼
         watch
```

Contoh `computed`:

```text
price + quantity
      │
      ▼
   computed
      │
      ▼
    total
```

Contoh `watch`:

```text
user berubah
      │
      ▼
    watch
      │
      ▼
API / localStorage / logging
```
**Kunci:**

```text
computed → menghasilkan nilai
watch    → menjalankan side effect
```

---

#### E. Component Communication

```text
       ┌──────────────┐
       │    Parent    │
       └──────┬───────┘
              │       ▲
        props │       │ emit event
              ▼       │
       ┌──────────────┐
       │    Child     │
       └──────┬───────┘
              │
         slot │
              ▼
       ┌──────────────┐
       │  UI Content  │
       └──────────────┘
```

**Kunci:**

```text
props → parent → child
emit  → child → parent
slot  → parent mengirim template/content ke child
```

---

#### F. Provide / Inject

```text
       Ancestor
          │
          │ provide()
          ▼
        Parent
          │
          ▼
        Child
          │
          ▼
      Descendant
          │
          │ inject()
          ▼
      gunakan data
```

Digunakan ketika data perlu digunakan oleh descendant yang jauh, sehingga tidak perlu meneruskan props melalui setiap level (prop drilling).
**Kunci:**

```text
provide → menyediakan data ke bawah
inject  → mengambil data dari ancestor
```

---

#### G. Component Dynamic

```text
          component
              │
       ┌──────┼──────┐
       ▼      ▼      ▼
      Home   About  Profile
              ▲
              │
        :is="current"
              │
              ▼
      component yang aktif
```
Contoh:

```html
<component :is="current" />
```
Jika:
```text
current = Home
      ↓
menampilkan Home

current = About
      ↓
menampilkan About
```
**Kunci:**

```text
:is → menentukan component yang sedang ditampilkan
```


---

<a id="bagian-31"></a>

## 31. 📚 Tabel Ringkasan

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

<a id="bagian-32"></a>

## 32. ⚡ Cheat Code Vue 10 Detik

> **`ref()` membuat state reactive. `reactive()` membuat object reactive. `computed()` membuat nilai turunan. `watch()` mengawasi perubahan untuk side effect. `v-if` mengatur kondisi. `v-for` membuat list. `@` menangani event. `:` melakukan binding. `v-model` menghubungkan input dengan state. Props mengirim data parent → child. Emit mengirim event child → parent. Slot mengirim template. Provide/Inject mengirim data melewati component tree.**

---

<a id="bagian-33"></a>

## 33. 🧭 Urutan Belajar yang Disarankan

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

---

<a id="bagian-34"></a>

## 34. 🏗️ Mini Project untuk Menggabungkan Konsep

Contoh sederhana **Todo App**:

```html
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

> **Kunci:** pahami alur **State → Template → Event → State berubah → DOM diperbarui**. Setelah itu pelajari **Component → Props → Emit → Slot**, karena sebagian besar aplikasi Vue tersusun dari pola tersebut.

---

<a id="bagian-35"></a>

## 35. 🔗 Referensi Resmi

- [Vue.js Guide](https://vuejs.org/guide/introduction.html)
- [Template Syntax](https://vuejs.org/guide/essentials/template-syntax.html)
- [Components Basics](https://vuejs.org/guide/essentials/component-basics.html)
- [Composition API](https://vuejs.org/api/composition-api-setup.html)
- [Vite](https://vitejs.dev/guide/)

