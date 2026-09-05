---
title: "React Zustand"
description: "State management ringan dan fleksibel dengan Zustand: store creation, selective subscriptions, async actions, middleware (persist, devtools), dan slice pattern."
order: 3
tags:
  - web-development
  - frontend
  - react
  - zustand
  - state-management
---

# React Zustand

> **Target:** Pemula yang telah memahami React Dasar dan React Router, serta ingin menguasai **Global State Management modern, ringan, berkinerja tinggi, dan tanpa Provider boilerplate menggunakan Zustand v4 / v5** (React 18 / 19 & Vite).
> **Versi:** Zustand 4.x / 5.x
> **Prasyarat:** [[react-dasar|React Dasar]]
> Fokus modul pembelajaran ini: **masalah Props Drilling → kelemahan React Context API → mental model Zustand → fungsi `create()` → State & Actions → Selector-based Subscriptions (performa render optimal) → Immutability Array & Object → parameter `get` → Async Actions & API fetch → `persist` LocalStorage middleware → Redux `devtools` middleware → Store Slices Pattern → `useStore.getState()` di luar React → `useShallow` → Client State vs Server State → mini project E-Commerce Shopping Cart & Auth Manager**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: Masalah Props Drilling, Context vs Zustand, fungsi create(), State & Actions, dan State Selectors

🟡 Lanjutan
→ pelajari setelah menguasai Store dasar: Parameter get, Async Actions, Persist Middleware (LocalStorage), DevTools, dan Store Slices

🔴 Advanced / Operasional
→ penting untuk arsitektur production: getState() di luar React (Axios), useShallow optimization, dan Client State vs Server State
```

Mental model alur kerja Zustand Global State:

```text
               1. KOMPONEN MEMANGGIL ACTION (useStore)
                   addItem({ id: "P1", name: "Laptop" })
                                │
                                ▼
               2. ZUSTAND STORE (create / set / get)
                   Perbarui State Cart & Kalkulasi Total
                                │
                                ▼
               3. PERSIST MIDDLEWARE (Opsional)
                   Otomatis Simpan ke LocalStorage
                                │
                                ▼
               4. SELECTOR BERLANGGANAN (Subscribers)
      ┌─────────────────────────┴─────────────────────────┐
      ▼ (Komponen yang Memilih cartItems)                   ▼ (Komponen yang Memilih user)
  CartDrawer RE-RENDER (UI Update)                  UserAvatar TIDAK RE-RENDER (Aman!)
```

**Hafalan:**

```text
Props Drilling       → kondisi buruk di mana data dioper melalui banyak layer komponen perantara yang sebenarnya tidak butuh data tersebut
Zustand              → library global state management berbasis Hook yang sangat ringkas, cepat, dan tidak memerlukan <Provider> pembungkus
create((set, get))   → fungsi inisialisasi untuk membuat Store kustom yang menampung variabel state dan action functions
set(fnOrObject)      → fungsi mutator di dalam store untuk memperbarui state (otomatis melakukan shallow merge tingkat atas)
get()                → fungsi di dalam store untuk membaca state terkini tanpa perlu memicu set pembaruan
Selector             → fungsi pemilih `state => state.target` yang memastikan komponen hanya me-render ulang jika nilai target berubah
persist Middleware   → plugin resmi Zustand untuk menyinkronkan state ke web storage (localStorage / sessionStorage) secara otomatis
getState()           → metode imperatif untuk membaca data store langsung dari file JavaScript biasa di luar komponen React
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Global State Management & Masalah Props Drilling di React](#bagian-1)
2. [Evaluasi React Context API (`useContext`) vs Zustand](#bagian-2)
3. [Pengenalan Zustand & Mental Model](#bagian-3)
4. [Instalasi & Setup Dasar Zustand](#bagian-4)
5. [Membuat Store Pertama dengan `create()`](#bagian-5)
6. [Mengonsumsi Store di Komponen & Konsep State Selectors](#bagian-6)
7. [Pembaruan State Objek & Array Immutability di Zustand](#bagian-7)
8. [Mengakses State Terkini di Dalam Action dengan Parameter `get`](#bagian-8)

### 🟡 Lanjutan

9. [Async Actions di Zustand](#bagian-9)
10. [Auto-Sync LocalStorage dengan `persist` Middleware](#bagian-10)
11. [Debugging State dengan Redux DevTools Middleware (`devtools`)](#bagian-11)
12. [Menggabungkan Multiple Middleware](#bagian-12)
13. [Immer Middleware untuk Mutasi State yang Lebih Mudah](#bagian-13)
14. [Memisahkan Store Besar dengan Slices Pattern](#bagian-14)
15. [Membaca & Mengubah State di Luar Komponen React](#bagian-15)
16. [Menghindari Re-render Berlebihan dengan `useShallow`](#bagian-16)

### 🔴 Advanced / Operasional

17. [Perbandingan Arsitektur: Client State (Zustand) vs Server State (TanStack React Query)](#bagian-17)
18. [TypeScript Support Dasar di Zustand](#bagian-18)

### 🛠️ Referensi & Praktik

19. [Peta Ingatan Cepat](#bagian-19)
20. [Tabel Ringkasan](#bagian-20)
21. [Cheat Code Zustand 10 Detik](#bagian-21)
22. [Urutan Belajar yang Disarankan](#bagian-22)
23. [Mini Project: Production-Ready E-Commerce Shopping Cart & Auth State Manager Web App](#bagian-23)
24. [Referensi Resmi](#bagian-24)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan Global State Management & Masalah Props Drilling di React

#### Konsep

Ketika membangun aplikasi kecil, state lokal (`useState`) dan *Lifting State Up* sudah memadai. Namun saat aplikasi membesar, data tertentu (seperti data User Login, Keranjang Belanja, Notifikasi, atau Tema) dibutuhkan oleh puluhan komponen yang tersebar di pohon hierarki yang berbeda.

**Props Drilling**:
Kondisi di mana kita terpaksa mengoper props melalui 5–10 lapisan komponen perantara yang sama sekali tidak membutuhkan data tersebut, hanya agar data bisa sampai ke komponen cucu di dasar pohon. Hal ini membuat kode sangat rapuh, kotor, dan sulit di-refactor.

**Global State Management**:
Menyimpan state bersama di dalam **Store Terpusat (*Single Source of Truth*)** di luar pohon komponen. Komponen manapun dapat langsung membaca atau mengubah data tersebut tanpa melewati perantara.

#### Cara Kerja

```text
Props Drilling (Buruk):
App ──(props)──> Layout ──(props)──> Header ──(props)──> Navbar ──(props)──> UserAvatar

Global State Store (Zustand - Bersih):
┌────────────────────────────┐
│    Global Zustand Store    │
└──────┬──────────────┬──────┘
       │ (Direct)     │ (Direct)
       ▼              ▼
   Navbar         UserAvatar
```

**Hafalan:**

```text
Global State Store → wadah data terpusat independen yang dapat diakses langsung oleh komponen manapun tanpa perantara
```

---

<a id="bagian-2"></a>

## 2. 🟢 Evaluasi React Context API (`useContext`) vs Zustand

#### Konsep

Banyak pemula bertanya: *"React sudah punya Context API bawaan, mengapa kita butuh library seperti Zustand?"*

Perbandingan:

| Fitur / Karakteristik | React Context API | Zustand |
|---|---|---|
| **Kebutuhan Provider** | Wajib membungkus JSX dengan `<MyContext.Provider>` (Menyebabkan *Provider Hell*) | **Nol Provider**. Cukup import custom hook dan pakai langsung |
| **Performa Re-render** | ❌ **Buruk untuk state dinamis.** Setiap ada 1 nilai di context yang berubah, **seluruh komponen konsumen akan me-render ulang** | ✅ **Super Cepat.** Mendukung *Selectors*, komponen hanya re-render jika field yang dipilihnya berubah |
| **Boilerplate** | Panjang (`createContext`, `useContext`, Provider wrapper) | Sangat singkat (Hanya 1 fungsi `create()`) |
| **Akses di luar React** | ❌ Tidak bisa diakses di file `.js` biasa | ✅ Bisa diakses kapan saja via `useStore.getState()` |

> **Kesimpulan:** Gunakan **Context API** hanya untuk data yang sangat jarang berubah (seperti Bahasa/Locale atau Tema). Gunakan **Zustand** untuk seluruh state dinamis aplikasi (Auth, Keranjang, Data Form, Filter).

**Hafalan:**

```text
Zustand vs Context → Zustand unggul mutlak dalam performa re-render (selector-based) dan bebas dari pembungkus Provider
```

---

<a id="bagian-3"></a>

## 3. 🟢 Pengenalan Zustand & Mental Model

#### Konsep

**Zustand** (kata Jerman yang berarti *"State / Keadaan"*) adalah library state management berukuran sangat kecil (~1 kB) yang dirancang dengan filosofi modern:
1. **Hook-Centric:** Store yang Anda buat otomatis menjadi React Hook (misal: `useCartStore()`).
2. **Unopinionated & Minimalist:** Tidak ada konsep action types string yang rumit, reducer switch-case raksasa, atau dispatcher kaku seperti Redux lama.
3. **Immutability Otomatis Tingkat Atas:** Fungsi `set()` secara otomatis melakukan shallow merge untuk properti tingkat atas.

**Hafalan:**

```text
Zustand Store → custom hook mandiri yang menggabungkan deklarasi state dan fungsi mutator dalam satu kesatuan
```

---

<a id="bagian-4"></a>

## 4. 🟢 Instalasi & Setup Dasar Zustand

#### Konsep

Instalasi Zustand pada proyek React / Vite:
```bash
npm install zustand
```

Tidak ada konfigurasi tambahan atau setup file global yang diperlukan. Anda bisa langsung membuat file store (misal: `src/store/useCounterStore.js`).

**Hafalan:**

```text
npm install zustand → dependensi tunggal ringan tanpa dependensi peer yang memberatkan
```

---

<a id="bagian-5"></a>

## 5. 🟢 Membuat Store Pertama dengan `create()`

#### Konsep

Fungsi **`create()`** dari `zustand` menerima satu parameter callback `(set) => ({ ... })` yang mengembalikan objek penampung **State** dan **Action Functions**.

Fungsi `set()`:
- Digunakan untuk memperbarui nilai state di dalam store.
- Dapat menerima objek baru: `set({ count: 10 })`.
- Atau menerima fungsi updater: `set((state) => ({ count: state.count + 1 }))`.

#### Contoh

```javascript
// src/store/useCounterStore.js
import { create } from 'zustand';

export const useCounterStore = create((set) => ({
  // 1. Variabel State
  count: 0,
  userName: "Budi Santoso",

  // 2. Action Functions
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setCustomCount: (newVal) => set({ count: newVal }),
  reset: () => set({ count: 0 })
}));
```

**Hafalan:**

```text
export const useStore = create((set) => ({ key: value, action: () => set(fn) }))
```

---

<a id="bagian-6"></a>

## 6. 🟢 Mengonsumsi Store di Komponen & Konsep State Selectors

#### Konsep

Untuk menggunakan store di dalam komponen React, kita memanggil custom hook hasil `create()` dengan memberikan fungsi **Selector: `state => state.targetProperty`**.

Mengapa Wajib Menggunakan Selector?
- Jika Anda menulis: `const store = useCounterStore()` $\rightarrow$ Komponen akan me-render ulang setiap kali **properti apapun di dalam store berubah** (Boros performa!).
- Jika Anda menulis: `const count = useCounterStore(state => state.count)` $\rightarrow$ Komponen **HANYA akan me-render ulang jika nilai `count` yang berubah**. Jika `userName` berubah, komponen ini tidak akan terganggu.

#### Contoh

```jsx
import React from 'react';
import { useCounterStore } from '../store/useCounterStore';

export default function CounterDisplay() {
  // Selector spesifik (Hanya berlangganan ke 'count')
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Hitungan: {count}</h2>
      <button onClick={decrement}>- Kurang</button>
      <button onClick={increment} style={{ marginLeft: "8px" }}>+ Tambah</button>
    </div>
  );
}
```

**Hafalan:**

```text
const value = useStore((state) => state.specificProperty) → selector berlangganan presisi untuk performa render maksimal
```

---

<a id="bagian-7"></a>

## 7. 🟢 Pembaruan State Objek & Array Immutability di Zustand

#### Konsep

Fungsi `set()` di Zustand melakukan *shallow merge* otomatis pada level pertama, tetapi **untuk Array dan Objek bersarang, Anda tetap wajib menerapkan prinsip Immutability**:

- **Menambah ke Array:** `set(state => ({ items: [...state.items, newItem] }))`
- **Menghapus dari Array:** `set(state => ({ items: state.items.filter(i => i.id !== targetId) }))`
- **Memperbarui Objek Bersarang:** `set(state => ({ user: { ...state.user, name: newName } }))`

#### Contoh

```javascript
import { create } from 'zustand';

export const useTodoStore = create((set) => ({
  todos: [
    { id: 1, text: "Belajar Zustand", completed: false }
  ],

  // Tambah Todo Baru
  addTodo: (text) => set((state) => ({
    todos: [...state.todos, { id: Date.now(), text, completed: false }]
  })),

  // Toggle Status Selesai
  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),

  // Hapus Todo
  deleteTodo: (id) => set((state) => ({
    todos: state.todos.filter((todo) => todo.id !== id)
  }))
}));
```

**Hafalan:**

```text
set(state => ({ items: [...state.items, newItem] }))       → menambah item array di Zustand store
set(state => ({ items: state.items.filter(i => i.id !== id) })) → menghapus item array di Zustand store
```

---

<a id="bagian-8"></a>

## 8. 🟢 Mengakses State Terkini di Dalam Action dengan Parameter `get`

#### Konsep

Seringkali di dalam action function, kita perlu membaca data state saat ini tanpa harus memodifikasinya (misal: memvalidasi stok barang sebelum dimasukkan ke keranjang, atau menghitung total harga).

Callback `create()` menyediakan parameter kedua yaitu **`get`**:
`create((set, get) => ({ ... }))`

- `get().items` : Membaca nilai array `items` saat ini.
- `get().totalPrice()` : Memanggil helper kalkulasi.

#### Contoh

```javascript
import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],

  // Action dengan validasi membaca state via get()
  addItemWithCheck: (product) => {
    const currentItems = get().items;
    const isAlreadyInCart = currentItems.some((i) => i.id === product.id);

    if (isAlreadyInCart) {
      alert("Produk ini sudah ada di keranjang!");
      return;
    }

    set({ items: [...currentItems, { ...product, quantity: 1 }] });
  },

  // Helper kalkulasi total belanja langsung dari store
  getTotalAmount: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}));
```

**Hafalan:**

```text
const currentState = get(); → membaca snapshot data state di dalam action function tanpa memicu mutasi
```

---

<a id="bagian-9"></a>

## 9. 🟡 Async Actions di Zustand

#### Konsep

Di Redux lama, menangani asynchronous data fetching membutuhkan middleware rumit seperti Redux Thunk atau Redux Saga.

Di Zustand, **Async Action bekerja secara alami**:
Cukup tambahkan kata kunci **`async`** pada action function, dan panggil `set()` saat status loading berubah dan saat data API tiba!

#### Contoh

```javascript
import { create } from 'zustand';

export const useProductStore = create((set) => ({
  products: [],
  isLoading: false,
  errorMessage: null,

  // Async Action Natural
  fetchProducts: async () => {
    set({ isLoading: true, errorMessage: null });
    try {
      const response = await fetch("https://fakestoreapi.com/products?limit=5");
      if (!response.ok) throw new Error("Gagal mengambil data produk dari server");
      const data = await response.json();
      set({ products: data, isLoading: false });
    } catch (error) {
      set({ errorMessage: error.message, isLoading: false });
    }
  }
}));
```

Penggunaan di Komponen:
```jsx
import { useEffect } from 'react';
import { useProductStore } from '../store/useProductStore';

export default function ProductList() {
  const { products, isLoading, errorMessage, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (isLoading) return <p>⏳ Sedang memuat produk...</p>;
  if (errorMessage) return <p style={{ color: "red" }}>❌ {errorMessage}</p>;

  return (
    <ul>
      {products.map(p => <li key={p.id}>{p.title} - ${p.price}</li>)}
    </ul>
  );
}
```

**Hafalan:**

```text
actionName: async () => { set({ loading: true }); const res = await fetch(); set({ data: res, loading: false }); }
```

---

<a id="bagian-10"></a>

## 10. 🟡 Auto-Sync LocalStorage dengan `persist` Middleware

#### Konsep

Zustand menyediakan middleware resmi **`persist`** untuk **menyimpan state ke `localStorage` (atau `sessionStorage`) secara otomatis**:
- Setiap ada perubahan state $\rightarrow$ Zustand otomatis men-serialize state ke JSON di `localStorage`.
- Saat browser di-refresh $\rightarrow$ Zustand otomatis memuat kembali (*Hydrate*) data dari `localStorage` ke state aplikasi.

#### Contoh

```javascript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: (userData, token) => set({ user: userData, token }),
      logout: () => set({ user: null, token: null })
    }),
    {
      name: "auth-storage", // Kunci di LocalStorage
      storage: createJSONStorage(() => localStorage), // Default: localStorage
      // Opsional: hanya simpan field tertentu (partialize)
      partialize: (state) => ({ token: state.token, user: state.user })
    }
  )
);
```

**Hafalan:**

```text
create(persist((set, get) => ({ ... }), { name: "storage-key" })) → auto-sync state ke LocalStorage otomatis
```

---

<a id="bagian-11"></a>

## 11. 🟡 Debugging State dengan Redux DevTools Middleware (`devtools`)

#### Konsep

Anda dapat menggunakan ekstensi browser **Redux DevTools** untuk melakukan *Time-Travel Debugging*, melihat riwayat setiap mutasi state, dan membatalkan aksi (*Undo/Redo*), meskipun Anda menggunakan Zustand!

Cukup bungkus store Anda dengan middleware **`devtools`**.

#### Contoh

```javascript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useCounterStore = create(
  devtools(
    (set) => ({
      count: 0,
      // Berikan label nama action sebagai parameter kedua di set() untuk log DevTools
      increment: () => set((state) => ({ count: state.count + 1 }), false, "counter/increment"),
      decrement: () => set((state) => ({ count: state.count - 1 }), false, "counter/decrement")
    }),
    { name: "CounterStore" }
  )
);
```

**Hafalan:**

```text
create(devtools((set) => ({ ... }), { name: "StoreName" })) → mengaktifkan debugging Redux DevTools di browser
```

---

<a id="bagian-12"></a>

## 12. 🟡 Menggabungkan Multiple Middleware

#### Konsep

Dalam aplikasi profesional, kita sering menggabungkan beberapa middleware sekaligus (misal: `devtools` untuk debugging + `persist` untuk penyimpanan lokal).

Pola pembungkusannya:
`create(devtools(persist((set, get) => ({ ... }), { name: "storage-key" }), { name: "DevToolsName" }))`

#### Contoh

```javascript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useSettingsStore = create(
  devtools(
    persist(
      (set) => ({
        theme: "light",
        language: "id",
        toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" }))
      }),
      { name: "app-settings-storage" }
    ),
    { name: "SettingsStore" }
  )
);
```

**Hafalan:**

```text
create(devtools(persist((set) => ({ ... }), { name: "storage-key" }))) → menggabungkan DevTools & Persist
```

---

<a id="bagian-13"></a>

## 13. 🟡 Immer Middleware untuk Mutasi State yang Lebih Mudah

#### Konsep

Jika Anda memiliki data state dengan struktur bersarang yang sangat dalam (*deeply nested objects/arrays*), menulis spread operator `...` berulang kali dapat membingungkan dan rawan salah.

Middleware **`immer`** memungkinkan kita menulis mutasi langsung (*Direct Mutation*) seperti JavaScript biasa (misal: `state.cart.items.push(item)` atau `state.user.profile.age++`), dan Immer akan otomatis mengonversinya menjadi immutable state baru di balik layar.

```bash
npm install immer
```

#### Contoh

```javascript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useNestedStore = create(
  immer((set) => ({
    user: {
      profile: { name: "Budi", details: { score: 100 } }
    },
    updateScore: (newScore) =>
      set((state) => {
        // Mutasi langsung tanpa spread operator berjenjang!
        state.user.profile.details.score = newScore;
      })
  }))
);
```

**Hafalan:**

```text
create(immer((set) => ({ update: () => set(state => { state.nested.val = newVal }) })))
```

---

<a id="bagian-14"></a>

## 14. 🟡 Memisahkan Store Besar dengan Slices Pattern

#### Konsep

Untuk aplikasi enterprise yang memiliki ratusan state, menyatukan seluruh state ke dalam satu file raksasa akan sulit dikelola.

**Slices Pattern**:
1. Buat beberapa slice modular (misal: `createAuthSlice`, `createCartSlice`).
2. Gabungkan seluruh slice ke dalam satu store utama menggunakan operator spread.

#### Contoh

Slice 1 (`src/store/slices/authSlice.js`):
```javascript
export const createAuthSlice = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null })
});
```

Slice 2 (`src/store/slices/cartSlice.js`):
```javascript
export const createCartSlice = (set) => ({
  items: [],
  addItem: (product) => set((s) => ({ items: [...s.items, product] })),
  clearCart: () => set({ items: [] })
});
```

Store Utama (`src/store/useAppStore.js`):
```javascript
import { create } from 'zustand';
import { createAuthSlice } from './slices/authSlice';
import { createCartSlice } from './slices/cartSlice';

export const useAppStore = create((...a) => ({
  ...createAuthSlice(...a),
  ...createCartSlice(...a)
}));
```

**Hafalan:**

```text
Slices Pattern → memecah store raksasa menjadi potongan modul slice terpisah yang digabung di root store
```

---

<a id="bagian-15"></a>

## 15. 🟡 Membaca & Mengubah State di Luar Komponen React

#### Konsep

Salah satu keunggulan terbesar Zustand dibanding React Context adalah: **Zustand dapat dibaca dan diubah dari file JavaScript murni di luar siklus render React** (misal: di dalam Axios Interceptor, file utilitas, atau service worker).

- **Membaca State:** `useStore.getState().token`
- **Mengubah State:** `useStore.setState({ token: "newToken" })`
- **Berlangganan Perubahan Manual:** `useStore.subscribe((state) => console.log(state))`

#### Contoh (Axios Authorization Interceptor)

```javascript
// src/api/axiosClient.js
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const apiClient = axios.create({ baseURL: 'https://api.toko.com/v1' });

// Request Interceptor: Otomatis sisipkan Bearer Token dari Zustand
apiClient.interceptors.request.use((config) => {
  // Akses state langsung di luar komponen React!
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

**Hafalan:**

```text
useStore.getState().property → membaca data store secara instan di file JavaScript biasa tanpa React Hook
useStore.setState({ key: val }) → mengubah state secara imperatif dari luar komponen
```

---

<a id="bagian-16"></a>

## 16. 🟡 Menghindari Re-render Berlebihan dengan `useShallow`

#### Konsep

Jika Anda ingin memilih beberapa nilai sekaligus dari store dalam bentuk objek:
`const { name, role } = useUserStore(state => ({ name: state.name, role: state.role }))`

Secara default, React menganggap objek `{ name, role }` baru sebagai referensi berbeda pada setiap render (*Reference Inequality*), yang memicu **re-render tak terbatas / berulang**!

Solusi:
Gunakan utility **`useShallow`** dari `zustand/react/shallow`:
Zustand akan membandingkan nilai properti satu per satu (*Shallow Comparison*) dan mencegah re-render jika nilainya sama persis.

#### Contoh

```jsx
import { useShallow } from 'zustand/react/shallow';
import { useUserStore } from '../store/useUserStore';

export default function UserBadge() {
  // Aman dari re-render berlebihan saat mengekstrak multiple properties!
  const { name, role } = useUserStore(
    useShallow((state) => ({
      name: state.name,
      role: state.role
    }))
  );

  return <div>{name} ({role})</div>;
}
```

**Hafalan:**

```text
useStore(useShallow(state => ({ a: state.a, b: state.b }))) → mengekstrak banyak field tanpa bug re-render objek baru
```

---

<a id="bagian-17"></a>

## 17. 🔴 Perbandingan Arsitektur: Client State (Zustand) vs Server State (TanStack React Query)

#### Konsep

Standar arsitektur frontend modern membagi state menjadi 2 domain yang berbeda:

1. **Client State (Kelola dengan Zustand):**
   - Data lokal yang dimiliki dan dikendalikan penuh oleh aplikasi frontend browser.
   - Contoh: Keranjang belanja lokal, Status Toggle Modal/Sidebar, Pilihan Tema, Input form sementara.
2. **Server State (Kelola dengan TanStack Query / React Query):**
   - Data yang dimiliki oleh database backend/server.
   - Membutuhkan penanganan *caching*, *revalidation*, *deduplication*, dan *polling*.
   - Contoh: Daftar produk dari database, riwayat invoice order.

**Hafalan:**

```text
Client State (Zustand) = data UI milik browser | Server State (TanStack Query) = data caching milik database server
```

---

<a id="bagian-18"></a>

## 18. 🔴 TypeScript Support Dasar di Zustand

#### Konsep

Zustand memiliki dukungan TypeScript kelas satu bawaan tanpa perlu package types tambahan:

Definisikan tipe interface untuk State dan Actions, lalu operasikan ke `create<StoreType>()`:

#### Contoh

```typescript
import { create } from 'zustand';

interface CartState {
  totalItems: number;
  isOpen: boolean;
  addItem: () => void;
  toggleDrawer: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
  totalItems: 0,
  isOpen: false,
  addItem: () => set((state) => ({ totalItems: state.totalItems + 1 })),
  toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
}));
```

**Hafalan:**

```text
create<StoreInterface>()((set) => ({ ... })) → pola deklarasi typed store di TypeScript
```

---

<a id="bagian-19"></a>

## 19. 🛠️ Peta Ingatan Cepat

```text
                          PETA ARSITEKTUR ZUSTAND
                                     │
       ┌─────────────────────────────┼─────────────────────────────┐
       ▼                             ▼                             ▼
CORE & SELECTORS             ASYNC & MIDDLEWARE            INTEGRASI & ADVANCED
├─ create((set, get))        ├─ async/await Actions        ├─ useStore.getState() (Axios)
├─ state => state.target     ├─ persist (LocalStorage)     ├─ useShallow (Multi-field)
├─ Immutability Spread       ├─ devtools (Redux Tool)      ├─ Slices Pattern
└─ Zero Provider Setup       └─ immer (Direct Mutate)      └─ Client vs Server State
```

---

<a id="bagian-20"></a>

## 20. 📚 Tabel Ringkasan

| Komponen / Fitur | Lokasi | Fungsi & Karakteristik Utama |
|---|---|---|
| `create((set, get))` | `zustand` | Fungsi inti pembuat Custom Hook Store global |
| `set(fnOrObject)` | Store Action | Memperbarui state dengan shallow merge otomatis |
| `get()` | Store Action | Membaca snapshot data state saat ini di dalam action |
| `Selector` | Komponen | Fungsi pemfilter `state => state.val` penangkal re-render |
| `persist` | `zustand/middleware` | Menyimpan dan me-load state ke LocalStorage otomatis |
| `devtools` | `zustand/middleware` | Menghubungkan mutasi state ke Redux DevTools extension |
| `immer` | `zustand/middleware/immer` | Memungkinkan sintaks mutasi langsung pada nested state |
| `useShallow` | `zustand/react/shallow` | Mencegah re-render saat memilih multiple properti |
| `getState()` | Instance Store | Membaca state di file JavaScript biasa di luar React |

---

<a id="bagian-21"></a>

## 21. ⚡ Cheat Code Zustand 10 Detik

```javascript
// 1. Template Store Persist Lengkap
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => set(s => ({ items: [...s.items, item] })),
      remove: (id) => set(s => ({ items: s.items.filter(i => i.id !== id) })),
      count: () => get().items.length,
    }),
    { name: 'app-storage' }
  )
);

// 2. Pemakaian di Komponen
const items = useStore(state => state.items);
const add = useStore(state => state.add);
```

---

<a id="bagian-22"></a>

## 22. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Fundamental Store & Selectors
├── Kuasai create((set)) dan buat State serta Actions sederhana
└── Gunakan State Selectors (state => state.val) di komponen
       │
       ▼
Langkah 2: Parameter get & Async Actions
├── Akses data state via get() untuk kalkulasi dan validasi
└── Buat Async Actions untuk fetch data API langsung di store
       │
       ▼
Langkah 3: Middleware Produktivitas
├── Terapkan persist middleware untuk auto-sync ke LocalStorage
└── Pasang devtools middleware untuk debugging
       │
       ▼
Langkah 4: Pola Arsitektur Skala Besar
├── Pecah store menjadi modul modular dengan Slices Pattern
├── Akses store di luar React via useStore.getState() (API Interceptors)
└── Optimasi performa re-render objek via useShallow
       │
       ▼
Langkah 5: Siap Membangun Aplikasi Enterprise Skala Penuh!
```

---

<a id="bagian-23"></a>

## 23. 🏗️ Mini Project: Production-Ready E-Commerce Shopping Cart & Auth State Manager Web App

Aplikasi web lengkap dan runnable yang mengintegrasikan: **Zustand Store dengan `persist` Middleware (LocalStorage), Auth State, Shopping Cart State, Live Calculation Subscriptions, Selectors, Multi-Component Dispatching, dan Toast Notifications**.

```jsx
import React, { useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ==========================================
// 1. GLOBAL ZUSTAND STORE WITH PERSIST
// ==========================================
export const useECommerceStore = create(
  persist(
    (set, get) => ({
      // --- AUTH STATE ---
      user: null,
      login: (username) => set({ user: { username, role: "CUSTOMER" } }),
      logout: () => set({ user: null, cart: [] }),

      // --- CART STATE ---
      cart: [],

      // Tambah Barang ke Keranjang
      addToCart: (product) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find(item => item.id === product.id);

        if (existingItem) {
          // Jika sudah ada, tambah kuantitas
          set({
            cart: currentCart.map(item =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
          });
        } else {
          // Jika belum ada, masukkan item baru
          set({ cart: [...currentCart, { ...product, quantity: 1 }] });
        }
      },

      // Update Kuantitas
      updateQuantity: (id, amount) => {
        const currentCart = get().cart;
        set({
          cart: currentCart
            .map(item => {
              if (item.id === id) {
                const newQty = item.quantity + amount;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean) // Hapus item jika quantity = 0
        });
      },

      // Hapus Item
      removeFromCart: (id) => {
        set(state => ({ cart: state.cart.filter(item => item.id !== id) }));
      },

      // Kosongkan Keranjang
      clearCart: () => set({ cart: [] }),

      // --- CALCULATED GETTERS ---
      getTotalPrice: () => {
        return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getTotalItemCount: () => {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0);
      }
    }),
    {
      name: "ecommerce-zustand-storage" // Otomatis tersimpan di LocalStorage
    }
  )
);

// ==========================================
// 2. DUMMY PRODUCTS CATALOG
// ==========================================
const PRODUCTS = [
  { id: "P1", name: "Mechanical Keyboard RGB", price: 850000, category: "AKSESORIS" },
  { id: "P2", name: "Wireless Ergonomic Mouse", price: 450000, category: "AKSESORIS" },
  { id: "P3", name: "Headset Gaming 7.1", price: 650000, category: "AUDIO" }
];

// ==========================================
// 3. KOMPONEN NAVBAR (SELECTOR KE USER & TOTAL ITEMS)
// ==========================================
function Navbar() {
  // Hanya berlangganan ke field user dan cart
  const user = useECommerceStore(state => state.user);
  const login = useECommerceStore(state => state.login);
  const logout = useECommerceStore(state => state.logout);
  const totalItemCount = useECommerceStore(state => state.getTotalItemCount());

  return (
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", background: "#1e293b", color: "#fff", borderRadius: "8px", marginBottom: "24px" }}>
      <h2 style={{ margin: 0, fontSize: "20px" }}>⚡ Zustand Mart</h2>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ background: "#334155", padding: "6px 12px", borderRadius: "20px", fontWeight: "bold" }}>
          🛒 Keranjang: <span style={{ color: "#38bdf8" }}>{totalItemCount} Barang</span>
        </div>

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>Halo, <strong>{user.username}</strong></span>
            <button onClick={logout} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>
              Logout
            </button>
          </div>
        ) : (
          <button onClick={() => login("Budi Santoso")} style={{ background: "#10b981", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            Login Demo
          </button>
        )}
      </div>
    </header>
  );
}

// ==========================================
// 4. KOMPONEN KATALOG PRODUK
// ==========================================
function ProductCatalog() {
  const addToCart = useECommerceStore(state => state.addToCart);

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3>Katalog Produk Tersedia</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        {PRODUCTS.map(p => (
          <div key={p.id} style={{ border: "1px solid #e2e8f0", padding: "16px", borderRadius: "8px", background: "#f8fafc" }}>
            <h4 style={{ margin: "0 0 8px 0" }}>{p.name}</h4>
            <div style={{ color: "#64748b", fontSize: "13px", marginBottom: "8px" }}>{p.category}</div>
            <div style={{ fontWeight: "bold", color: "#16a34a", fontSize: "16px", marginBottom: "14px" }}>
              Rp {p.price.toLocaleString("id-ID")}
            </div>
            <button
              onClick={() => addToCart(p)}
              style={{ width: "100%", background: "#2563eb", color: "#fff", border: "none", padding: "8px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
            >
              + Masukkan Keranjang
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 5. KOMPONEN CART DRAWER (BELANJA & CHECKOUT)
// ==========================================
function CartSummary() {
  const cart = useECommerceStore(state => state.cart);
  const updateQuantity = useECommerceStore(state => state.updateQuantity);
  const removeFromCart = useECommerceStore(state => state.removeFromCart);
  const clearCart = useECommerceStore(state => state.clearCart);
  const totalPrice = useECommerceStore(state => state.getTotalPrice());

  if (cart.length === 0) {
    return (
      <div style={{ border: "2px dashed #cbd5e1", padding: "30px", textAlign: "center", borderRadius: "8px", color: "#64748b" }}>
        Keranjang belanja Anda masih kosong. Silakan pilih produk di atas!
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #e2e8f0", padding: "20px", borderRadius: "8px", background: "#ffffff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ margin: 0 }}>Rincian Keranjang Belanja</h3>
        <button onClick={clearCart} style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}>
          Kosongkan
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px 0" }}>
        {cart.map(item => (
          <li key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
            <div>
              <div style={{ fontWeight: "bold" }}>{item.name}</div>
              <div style={{ color: "#64748b", fontSize: "13px" }}>
                Rp {item.price.toLocaleString("id-ID")} x {item.quantity} = <strong>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</strong>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: "4px 8px", cursor: "pointer" }}>-</button>
              <span style={{ fontWeight: "bold", minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: "4px 8px", cursor: "pointer" }}>+</button>
              <button onClick={() => removeFromCart(item.id)} style={{ color: "#ef4444", border: "none", background: "none", cursor: "pointer", marginLeft: "10px" }}>✕</button>
            </div>
          </li>
        ))}
      </ul>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid #e2e8f0", paddingTop: "16px" }}>
        <div>
          <small style={{ color: "#64748b" }}>Total Pembayaran:</small>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: "#2563eb" }}>
            Rp {totalPrice.toLocaleString("id-ID")}
          </div>
        </div>
        <button
          onClick={() => alert(`Pembayaran sebesar Rp ${totalPrice.toLocaleString("id-ID")} Berhasil!`)}
          style={{ background: "#16a34a", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "15px" }}
        >
          Checkout Sekarang ➡
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 6. MAIN APPLICATION
// ==========================================
export default function App() {
  return (
    <div style={{ maxWidth: "850px", margin: "30px auto", fontFamily: "Segoe UI, sans-serif", padding: "0 15px" }}>
      <Navbar />
      <ProductCatalog />
      <CartSummary />
    </div>
  );
}
```

#### Hasil Output Tampilan Aplikasi & Sinkronisasi LocalStorage

```text
┌────────────────────────────────────────────────────────────────────────┐
│ ⚡ Zustand Mart         🛒 Keranjang: 2 Barang       Halo, Budi Santoso│
├────────────────────────────────────────────────────────────────────────┤
│ Katalog Produk Tersedia                                                │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────┐ │
│ │ Mechanical Keyboard  │ │ Wireless Mouse       │ │ Headset Gaming   │ │
│ │ Rp 850.000           │ │ Rp 450.000           │ │ Rp 650.000       │ │
│ │ [ + Masukkan Keranjang]│ │ [ + Masukkan Keranjang]│ │ [+ Masuk Keranjang]│
│ └──────────────────────┘ └──────────────────────┘ └──────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│ Rincian Keranjang Belanja                                [Kosongkan]   │
│ • Mechanical Keyboard RGB   Rp 850.000 x 1 = Rp 850.000  [-] 1 [+] [✕] │
│ • Wireless Ergonomic Mouse  Rp 450.000 x 1 = Rp 450.000  [-] 1 [+] [✕] │
│                                                                        │
│ Total Pembayaran: Rp 1.300.000                  [ Checkout Sekarang ➡ ]│
├────────────────────────────────────────────────────────────────────────┤
│ (State otomatis tersimpan di LocalStorage key: ecommerce-zustand-store)│
└────────────────────────────────────────────────────────────────────────┘
```

---

<a id="bagian-24"></a>

## 24. 🔗 Referensi Resmi

- [Zustand Official Documentation & GitHub](https://github.com/pmndrs/zustand)
- [Zustand Documentation Guide (pmndrs.github.io/zustand)](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [TanStack Query vs Zustand (Client vs Server State Architecture)](https://tkdodo.eu/blog/practical-react-query)
