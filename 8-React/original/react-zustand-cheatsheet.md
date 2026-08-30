# React Zustand Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Zustand v4/v5 (React 18/19 & Vite) untuk pemula yang ingin memahami Global State Management modern, ringan, tanpa Provider, dan berperforma tinggi. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> Zustand adalah library state management berbasis Hook yang sangat populer di ekosistem React karena kesederhanaan sintaksisnya dan performa render yang optimal.

## Daftar Isi

1. [Membuat Store Dasar](#1-membuat-store-dasar)
2. [Menggunakan Store dengan Selector](#2-menggunakan-store-dengan-selector)
3. [Update State Objek & Array](#3-update-state-objek--array)
4. [Mengakses State dengan get()](#4-mengakses-state-dengan-get)
5. [Async Actions](#5-async-actions)
6. [Persist Middleware](#6-persist-middleware)
7. [DevTools Middleware](#7-devtools-middleware)
8. [Akses di Luar Komponen](#8-akses-di-luar-komponen)
9. [Store Slices](#9-store-slices)

---

# 1. Membuat Store Dasar

Menggunakan fungsi `create()` untuk mendefinisikan state dan action functions.

```javascript
import { create } from 'zustand';

export const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

---

# 2. Menggunakan Store dengan Selector

Komponen hanya akan me-render ulang jika nilai state yang dipilih (*selector*) berubah.

```jsx
import { useCounterStore } from './counterStore';

export default function Counter() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);

  return (
    <button onClick={increment}>
      Hitungan: {count}
    </button>
  );
}
```

---

# 3. Update State Objek & Array

```javascript
export const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
}));
```

---

# 4. Mengakses State dengan get()

Parameter `get` digunakan untuk membaca nilai state lain di dalam action tanpa perlu me-set ulang.

```javascript
export const useAuthStore = create((set, get) => ({
  user: null,
  isLoggedIn: () => get().user !== null,
}));
```

---

# 5. Async Actions

Zustand mendukung fungsi async langsung di dalam action.

```javascript
export const useUserStore = create((set) => ({
  users: [],
  loading: false,
  fetchUsers: async () => {
    set({ loading: true });
    const res = await fetch('/api/users');
    const data = await res.json();
    set({ users: data, loading: false });
  },
}));
```

---

# 6. Persist Middleware

Menyimpan state ke `localStorage` secara otomatis.

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    { name: 'theme-storage' }
  )
);
```

---

# 7. DevTools Middleware

Menghubungkan store ke Redux DevTools extension di browser.

```javascript
import { devtools } from 'zustand/middleware';

export const useStore = create(devtools((set) => ({ ... })));
```

---

# 8. Akses di Luar Komponen

Membaca atau mengubah state di luar siklus render React (misal di Axios Interceptor).

```javascript
// Membaca state
const token = useAuthStore.getState().token;

// Mengubah state
useAuthStore.setState({ token: 'new-token' });
```

---

# 9. Store Slices

Memecah store besar menjadi potongan-potongan slice yang modular.
