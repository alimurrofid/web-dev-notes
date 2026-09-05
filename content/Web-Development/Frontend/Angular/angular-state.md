---
title: "Angular State Management"
description: "Manajemen state global di Angular modern: Service-based Signals Store, computed values, side effects, RxJS Interop, dan HTTP Interceptors."
order: 3
tags:
  - web-development
  - frontend
  - angular
  - state-management
  - signals
  - typescript
  - intermediate
---

# Angular State Management

> **Target:** Pemula yang telah memahami dasar Angular (komponen, template, dan routing), serta ingin menguasai **pengelolaan state global terpusat dan penanganan data asinkron menggunakan Angular Signals & RxJS Interop (Current / Stable)**.  
> **Versi:** Angular Current / Stable (Service-Based Signals Store, RxJS Interop `toSignal`/`toObservable`, dan Functional HTTP Interceptors)  
> **Prasyarat:** [[angular-dasar|Angular Dasar]] · [[angular-routing|Angular Routing]] · [[typescript-dasar|TypeScript Dasar]]  
> Fokus modul pembelajaran ini: **mental model local vs global state → masalah prop drilling → arsitektur Service-Based Signals Store (`providedIn: 'root'`) → enkapsulasi private Writable Signal & public `asReadonly()` → derived state global (`computed`) → action methods & immutability pattern → konsumsi store di komponen (`inject()`) → side effects reaktif (`effect()`) & LocalStorage persistence → pengendalian reaktivitas (`untracked()`, `onCleanup`) → Signals & RxJS Interop (`toSignal()`, `toObservable()`) → functional HTTP Interceptors (`withInterceptors`) → pola store composition → mini project Shopping Cart & Auth Session Global Store SPA**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: Konsep Global State, Arsitektur Service-Based Signals Store, Enkapsulasi asReadonly(), Selectors computed(), Actions Mutasi, dan Side Effects effect()

🟡 Lanjutan
→ pelajari setelah konsep dasar store nyaman: untracked(), onCleanup(), RxJS & Signals Interop (toSignal, toObservable), dan Functional HTTP Interceptors

🔴 Advanced / Praktik
→ penting untuk aplikasi skala menengah-besar: Store Composition, SignalStore Overview, Tabel Komparasi, dan Mini Project Terintegrasi
```

Mental model aliran data terpusat (*Unidirectional Data Flow*) pada Store berbasis Signals:

```text
                ┌────────────────────────────────────────────────────────┐
                │          Global Store Service (Singleton)              │
                │                                                        │
                │   [ Private Signal State ]  #items = signal<Item[]>([])│
                │             │                                          │
                │   [ Public Readonly State ] items = #items.asReadonly()│
                │             │                                          │
                │   [ Derived Selectors ]     total = computed(...)      │
                │             ▲                                          │
                │             │ mutasi internal                          │
                │   [ Action Methods ]        addItem(), removeItem()    │
                └─────────────┼──────────────────────────────▲───────────┘
                              │                              │
          membaca state       │                              │ memanggil action
          reaktif via Signal  │                              │ saat user klik tombol
                              ▼                              │
                ┌────────────────────────────────────────────┴───────────┐
                │                Angular UI Components                   │
                │   (NavbarBadge, CatalogPage, CartDrawer, CheckoutPage) │
                └────────────────────────────────────────────────────────┘
```

**Hafalan:**

```text
Local State       → Data yang hanya dibutuhkan dan hidup di dalam satu komponen (misal: toggle form isExpanded)
Global State      → Data bersama yang dibagi dan dibutuhkan lintas halaman/komponen (misal: cart items, user login)
Service Store     → Class Singleton (@Injectable providedIn: 'root') yang menampung State, Getters, dan Actions
asReadonly()      → Mengubah Writable Signal menjadi Read-Only Signal untuk mencegah mutasi langsung dari luar
computed()        → Derived selector global dengan mekanisme caching otomatis (otomatis sinkron)
effect()          → Menjalankan side effect reaktif saat signal berubah (misal: sinkronisasi otomatis ke LocalStorage)
toSignal()        → Mengubah Observable stream (RxJS / HTTP) menjadi Angular Signal deklaratif
toObservable()    → Mengubah Angular Signal menjadi Observable stream untuk memanfaatkan operator RxJS
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Global State & Masalah Prop Drilling](#bagian-1)
2. [Arsitektur Service-Based Signals Store](#bagian-2)
3. [Enkapsulasi State: Private Signal & Public Readonly (asReadonly)](#bagian-3)
4. [Derived Global State dengan computed()](#bagian-4)
5. [Action Methods & Pola Mutasi State Immutability](#bagian-5)
6. [Mengonsumsi Global Store di Komponen (inject())](#bagian-6)
7. [Side Effects Reaktif dengan effect() & LocalStorage Persistence](#bagian-7)

### 🟡 Lanjutan

8. [Mengontrol Reaktivitas: untracked() & Pembersihan Effect (onCleanup)](#bagian-8)
9. [Menjembatani RxJS dan Signals (@angular/core/rxjs-interop)](#bagian-9)
10. [Mengubah Observable HTTP ke Signal via toSignal()](#bagian-10)
11. [Mengubah Signal ke Observable Stream via toObservable()](#bagian-11)
12. [Functional HTTP Interceptors (withInterceptors)](#bagian-12)
13. [Pola Arsitektur Lanjutan: Store Composition & SignalStore Overview](#bagian-13)

### 🛠️ Praktik & Referensi

14. [Peta Ingatan, Cheat Code 10 Detik & Tabel Komparasi](#bagian-14)
15. [Mini Project: Shopping Cart & Auth Session Global Store SPA](#bagian-15)
16. [Urutan Belajar yang Disarankan & Referensi Resmi](#bagian-16)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan Global State & Masalah Prop Drilling

### Konsep

Dalam pengembangan antarmuka web, data (*state*) dapat dikelompokkan menjadi dua kategori:

1. **Local State (State Lokal)**:
   - Data yang hanya relevan dan dibutuhkan oleh satu komponen tertentu.
   - Contoh: status modal terbuka/tutup (`isOpen = signal(false)`), teks pencarian sementara, tab aktif pada kartu.
2. **Global State (State Bersama / Aplikasi)**:
   - Data yang harus diakses dan dimutasi oleh banyak komponen di lokasi pohon DOM yang berbeda.
   - Contoh: data keranjang belanja (dibutuhkan di Navbar badge, Halaman Produk, dan Halaman Checkout), informasi akun pengguna yang sedang login, dan tema aplikasi (*dark/light mode*).

##### Masalah *Prop Drilling* Tanpa Global Store

Tanpa wadah state terpusat, jika komponen anak di hierarki terdalam membutuhkan data dari komponen teratas, kita terpaksa melewatkan properti tersebut melewati banyak komponen perantara yang sebenarnya tidak membutuhkan data tersebut (*Prop Drilling*):

```text
[ Root AppComponent (Menyimpan State User) ]
                    │
                    ▼  (lewatkan [user]="user")
         [ LayoutComponent ]
                    │
                    ▼  (lewatkan [user]="user")
          [ HeaderComponent ]
                    │
                    ▼  (lewatkan [user]="user")
     [ UserProfileBadgeComponent ]  <── Data baru dipakai di sini!
```

##### Solusi: Centralized Global Store Service

Dengan arsitektur Store, semua komponen dapat langsung membaca dan memperbarui data secara terpusat tanpa melalui komponen perantara:

```text
      ┌──────────────────────────────────────────────┐
      │         Global Store Service (Singleton)     │
      │         - user = signal({ name: 'Budi' })    │
      └──────────────────────┬───────────────────────┘
                             │
            ┌────────────────┼────────────────┐
            │ inject(Store)  │ inject(Store)  │ inject(Store)
            ▼                ▼                ▼
     [ NavbarComponent ] [ DashboardPage ] [ SettingsPage ]
```

**Kunci:** Local State untuk UI internal 1 komponen; Global Store untuk data yang dibagi dan sinkron lintas komponen.

---

<a id="bagian-2"></a>

## 2. 🟢 Arsitektur Service-Based Signals Store

### Konsep

Di ekosistem Angular modern, kita tidak perlu menginstal pustaka eksternal yang rumit (seperti Redux lama) hanya untuk mengelola state global sederhana hingga menengah.

Angular menyediakan arsitektur bawaan yang sangat elegan dan berkinerja tinggi: **Service-Based Signals Store**.

##### 3 Elemen Penyusun Store:
1. **State (`signal`)**: Nilai reaktif utama yang menyimpan data murni.
2. **Getters / Selectors (`computed`)**: Nilai turunan dari state yang otomatis terhitung ulang dan memiliki *caching*.
3. **Actions (Methods)**: Fungsi-fungsi untuk mengubah state secara terkontrol.

##### Mengapa `@Injectable({ providedIn: 'root' })`?
Properti `providedIn: 'root'` mendaftarkan service ke *Root Injector* Angular. Ini menjamin bahwa service tersebut adalah **Singleton** (hanya ada 1 instance objek yang hidup di seluruh aplikasi), sehingga seluruh komponen akan membaca memori state yang sama persis.

### Contoh Struktur Store

File: `src/app/stores/counter.store.ts`

```typescript
import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root' // Singleton global
})
export class CounterStore {
  // 1. State Utama
  count = signal<number>(0);

  // 2. Selectors (Derived State)
  doubleCount = computed(() => this.count() * 2);
  isEven = computed(() => this.count() % 2 === 0);

  // 3. Actions (Mutasi State)
  increment() {
    this.count.update(c => c + 1);
  }

  decrement() {
    this.count.update(c => Math.max(0, c - 1));
  }

  reset() {
    this.count.set(0);
  }
}
```

### Hasil

Ketika `increment()` dipanggil dari mana saja (misal dari Navbar atau Footer), `count()` dan `doubleCount()` di seluruh komponen yang membacanya akan otomatis ter-render ulang secara instan.

**Kunci:** Store di Angular modern dibangun dari `@Injectable({ providedIn: 'root' })` yang menggabungkan `signal`, `computed`, dan *action methods*.

---

<a id="bagian-3"></a>

## 3. 🟢 Enkapsulasi State: Private Signal & Public Readonly (asReadonly)

### Konsep

Pada arsitektur state management yang baik, komponen UI **hanya boleh membaca data atau memanggil Action**. Komponen luar **TIDAK BOLEH memutasi nilai state secara sembarangan** (misal langsung menjalankan `store.items.set([])` di template komponen).

Jika komponen luar bebas memutasi state secara langsung, pelacakan *bug* akan menjadi sangat sulit karena kita tidak tahu komponen mana yang merusak data.

##### Solusi Modern: `asReadonly()` & Private Field (`#`)
Angular Signal menyediakan method **`asReadonly()`** yang mengubah *Writable Signal* menjadi *Read-Only Signal*.

```text
┌────────────────────────────────────────────────────────────┐
│                    Store Service Class                     │
│                                                            │
│  Private State: #items = signal<string[]>([])              │
│        │                                                   │
│        ▼ (Diekspos ke luar via .asReadonly())              │
│  Public State:  items = this.#items.asReadonly()           │
│                                                            │
│  Komponen Luar:                                            │
│  - store.items()        ──► BISA (Membaca Data)            │
│  - store.items.set(...) ──► ❌ ERROR (Dilarang Memutasi)  │
│  - store.addItem(...)   ──► BISA (Memanggil Action Resmi)  │
└────────────────────────────────────────────────────────────┘
```

### Contoh Implementasi

File: `src/app/stores/theme.store.ts`

```typescript
import { Injectable, signal, computed } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeStore {
  // 1. Private Writable Signal (Hanya bisa dimutasi di dalam class ini)
  #mode = signal<ThemeMode>('light');

  // 2. Public Readonly Signal (Aman dibaca oleh seluruh komponen luar)
  readonly mode = this.#mode.asReadonly();

  // 3. Derived Selector
  readonly isDarkMode = computed(() => this.#mode() === 'dark');

  // 4. Action Resmi untuk mengubah state
  toggleTheme() {
    this.#mode.update(current => (current === 'light' ? 'dark' : 'light'));
  }

  setTheme(newMode: ThemeMode) {
    this.#mode.set(newMode);
  }
}
```

### Kesalahan Umum

❌ Membiarkan Writable Signal terbuka secara publik pada Store:
```typescript
// ❌ Bahaya: Komponen luar bisa memutasi langsung tanpa lewat method
export class BadStore {
  user = signal({ name: 'Andi' }); 
}
```

✅ Amankan state dengan *private field* dan ekspos via `.asReadonly()`:
```typescript
// ✅ Aman: Integritas state terjaga 100%
export class GoodStore {
  #user = signal({ name: 'Andi' });
  readonly user = this.#user.asReadonly();
}
```

**Kunci:** Gunakan `#state = signal(...)` dan ekspos ke komponen luar via `this.#state.asReadonly()` demi menjaga integritas data.

---

<a id="bagian-4"></a>

## 4. 🟢 Derived Global State dengan computed()

### Konsep

Dalam aplikasi, kita sering membutuhkan data kalkulasi atau filter dari state utama, seperti:
- Menghitung total harga belanja (`totalPrice = item * qty`).
- Menghitung jumlah barang yang belum dicentang.
- Memfilter daftar produk berdasarkan kategori yang dipilih.

Alih-alih menghitung ulang data tersebut secara manual di setiap komponen, Store menyediakan **Selectors** menggunakan **`computed()`**.

##### Keunggulan `computed()` pada Store Global:
1. **Declarative**: Otomatis memperbarui nilainya setiap kali signal sumber di dalam store berubah.
2. **Caching & Memoization**: Jika signal sumber tidak berubah, pemanggilan `totalPrice()` di 10 komponen berbeda hanya dieksekusi 1 kali dan mengambil nilai dari memori *cache*.
3. **Read-Only**: Tidak dapat dimutasi sembarangan dari luar.

### Contoh

File: `src/app/stores/cart.store.ts`

```typescript
import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartStore {
  // State Utama
  #items = signal<CartItem[]>([
    { id: 1, name: 'Mechanical Keyboard', price: 500000, quantity: 1 },
    { id: 2, name: 'Wireless Mouse', price: 250000, quantity: 2 }
  ]);

  // Read-Only State
  readonly items = this.#items.asReadonly();

  // 1. Selector: Total Jumlah Unit Barang
  readonly totalUnits = computed(() => {
    return this.#items().reduce((acc, item) => acc + item.quantity, 0);
  });

  // 2. Selector: Total Tagihan Belanja (Rupiah)
  readonly totalPrice = computed(() => {
    return this.#items().reduce((acc, item) => acc + (item.price * item.quantity), 0);
  });

  // 3. Selector: Apakah keranjang kosong?
  readonly isCartEmpty = computed(() => this.#items().length === 0);
}
```

### Hasil

Jika ada komponen yang membaca `store.totalPrice()`, nilainya akan otomatis menghasilkan `1000000` (Rp 1.000.000) dan tersinkronisasi di semua layar.

**Kunci:** `computed()` pada Store berperan sebagai *Getter / Selector* reaktif yang memiliki performa tinggi berkat *caching* bawaan.

---

<a id="bagian-5"></a>

## 5. 🟢 Action Methods & Pola Mutasi State Immutability

### Konsep

Dalam ekosistem reaktivitas modern, mutasi data wajib mematuhi aturan **Immutability (Kekekalan Data)**:
> Jangan pernah mengubah isi array atau properti objek secara langsung (*direct in-place mutation*), melainkan **buatlah salinan baru (*new reference*)** dengan nilai yang telah diperbarui.

##### Mengapa Immutability Wajib?
Angular Signal mendeteksi perubahan nilai berdasarkan **perbandingan referensi (*reference equality check*)**. Jika Anda hanya memutasi elemen di dalam array lama (`items.push(...)`), Angular menganggap referensi array tidak berubah sehingga tampilan DOM mungkin tidak diperbarui.

##### Pola Mutasi Immutability:
- **Menambah Item**: Gunakan Spread Operator `[...oldList, newItem]` (bukan `.push()`).
- **Menghapus Item**: Gunakan `.filter(item => item.id !== id)`.
- **Memperbarui Item**: Gunakan `.map(item => item.id === id ? { ...item, ...update } : item)`.

### Contoh Implementasi Actions Lengkap

File: `src/app/stores/cart.store.ts`

```typescript
import { Injectable, signal } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartStore {
  #items = signal<CartItem[]>([]);
  readonly items = this.#items.asReadonly();

  // 1. Menambah Item Baru (atau menaikkan qty jika barang sudah ada)
  addItem(product: { id: number; name: string; price: number }) {
    this.#items.update(list => {
      const existing = list.find(item => item.id === product.id);
      if (existing) {
        // Update item secara immutable
        return list.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Tambah item baru di depan array
      return [{ ...product, quantity: 1 }, ...list];
    });
  }

  // 2. Mengubah Kuantitas Barang
  updateQuantity(id: number, delta: number) {
    this.#items.update(list =>
      list
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null) // Hapus jika qty 0
    );
  }

  // 3. Menghapus Item dari Keranjang
  removeItem(id: number) {
    this.#items.update(list => list.filter(item => item.id !== id));
  }

  // 4. Mengosongkan Keranjang
  clearCart() {
    this.#items.set([]);
  }
}
```

### Kesalahan Umum

❌ Melakukan mutasi langsung pada array Signal:
```typescript
// ❌ SALAH: Tidak memicu reaktivitas dengan benar
this.#items().push(newItem); 
```

✅ Gunakan `.update()` dengan spread operator:
```typescript
// ✅ BENAR: Menghasilkan referensi array baru
this.#items.update(list => [...list, newItem]);
```

**Kunci:** Selalu perbarui Signal menggunakan pola immutable (`[...spread]`, `.filter()`, `.map()`) melalui method `.update()`.

---

<a id="bagian-6"></a>

## 6. 🟢 Mengonsumsi Global Store di Komponen (inject())

### Konsep

Untuk menggunakan Store di dalam komponen Standalone:
1. Suntikkan Store menggunakan fungsi modern **`inject(StoreName)`**.
2. Baca state atau selector di template dengan memanggil tanda kurung: `store.items()` atau `store.totalPrice()`.
3. Panggil action methods pada event binding tombol: `(click)="store.addItem(...)"`.

##### Diagram Pemakaian Store Lintas Komponen

```text
       CartStore (Singleton State)
         ▲                ▲
         │ inject()       │ inject()
[ NavbarBadgeComponent ]  [ ProductCardComponent ]
- Menampilkan total item   - Tombol "+ Tambah ke Keranjang"
```

### Contoh

1. **Komponen Badge di Navbar (`src/app/components/navbar-cart.component.ts`)**:

```typescript
import { Component, inject } from '@angular/core';
import { CartStore } from '../stores/cart.store';

@Component({
  selector: 'app-navbar-cart',
  standalone: true,
  template: `
    <div class="cart-badge">
      <span>🛒 Keranjang:</span>
      <!-- Membaca selector totalUnits dan totalPrice dari store global -->
      <strong class="count">{{ cartStore.totalUnits() }} item</strong>
      <span class="price">(Rp {{ cartStore.totalPrice().toLocaleString('id-ID') }})</span>
    </div>
  `,
  styles: `
    .cart-badge { display: flex; align-items: center; gap: 0.5rem; background: #334155; color: white; padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.9rem; }
    .count { background: #3b82f6; padding: 2px 6px; border-radius: 4px; }
  `
})
export class NavbarCartComponent {
  // Inject store global
  cartStore = inject(CartStore);
}
```

2. **Komponen Katalog Penambah Barang (`src/app/components/product-catalog.component.ts`)**:

```typescript
import { Component, inject } from '@angular/core';
import { CartStore } from '../stores/cart.store';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  template: `
    <div class="catalog-grid">
      <div class="card">
        <h4>Desk Mat Minimalis</h4>
        <p>Rp 150.000</p>
        <button (click)="cartStore.addItem({ id: 10, name: 'Desk Mat Minimalis', price: 150000 })">
          + Beli Barang
        </button>
      </div>

      <div class="card">
        <h4>LED Monitor Bar</h4>
        <p>Rp 350.000</p>
        <button (click)="cartStore.addItem({ id: 20, name: 'LED Monitor Bar', price: 350000 })">
          + Beli Barang
        </button>
      </div>
    </div>
  `,
  styles: `
    .catalog-grid { display: flex; gap: 1rem; margin-top: 1rem; }
    .card { border: 1px solid #cbd5e1; padding: 1rem; border-radius: 8px; flex: 1; }
    button { padding: 0.4rem 0.8rem; background: #16a34a; color: white; border: none; border-radius: 4px; cursor: pointer; }
  `
})
export class ProductCatalogComponent {
  cartStore = inject(CartStore);
}
```

### Hasil

**Kondisi awal di navbar:**
```text
🛒 Keranjang: [ 0 item ] (Rp 0)
```

**Setelah tombol "+ Beli Barang" pada LED Monitor Bar diklik 2 kali:**
```text
🛒 Keranjang: [ 2 item ] (Rp 700.000)
```

**Kunci:** Komponen cukup menyuntikkan store via `inject(Store)` dan langsung membaca nilainya di template tanpa perlu *lifecycle subscription* manual.

---

<a id="bagian-7"></a>

## 7. 🟢 Side Effects Reaktif dengan effect() & LocalStorage Persistence

### Konsep

Dalam pengembangan aplikasi, kita sering perlu menjalankan **Side Effect** (operasi sampingan di luar rendering tampilan) setiap kali data di Store berubah, seperti:
- Menyimpan (*persist*) state keranjang belanja ke `localStorage` browser.
- Menulis log analitik pengguna.
- Menyesuaikan class pada elemen `document.body` (misal class `.dark-theme`).

Angular menyediakan fungsi **`effect()`** yang akan **otomatis dijalankan kembali setiap kali ada signal di dalamnya yang berubah nilai**.

##### Perbedaan `computed()` vs `effect()`:

| Fitur | `computed()` | `effect()` |
|---|---|---|
| **Tujuan** | Menghasilkan **nilai data turunan** (*Derived Value*) | Menjalankan **aksi / side effect** |
| **Nilai Kembalian** | Mengembalikan Read-Only Signal | Tidak mengembalikan nilai (*void*) |
| **Kaidah Utama** | Wajib berupa fungsi murni (*pure function*, tanpa efek samping) | Didesain khusus untuk operasi *I/O*, logging, LocalStorage |

### Contoh: Otomatis Menyimpan State ke LocalStorage

File: `src/app/stores/persisted-cart.store.ts`

```typescript
import { Injectable, signal, effect } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class PersistedCartStore {
  private STORAGE_KEY = 'app_cart_storage';

  // State awal dimuat dari LocalStorage (jika ada)
  #items = signal<CartItem[]>(this.#loadFromLocalStorage());
  readonly items = this.#items.asReadonly();

  constructor() {
    // Effect ini otomatis berjalan setiap kali signal #items berubah!
    effect(() => {
      const dataJson = JSON.stringify(this.#items());
      localStorage.setItem(this.STORAGE_KEY, dataJson);
      console.log('[EFFECT] State keranjang berhasil disinkronkan ke LocalStorage.');
    });
  }

  addItem(item: CartItem) {
    this.#items.update(list => [...list, item]);
  }

  #loadFromLocalStorage(): CartItem[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
}
```

### Hasil

Setiap kali method `addItem()` dipanggil, `effect()` di constructor langsung mendeteksi perubahan `#items()` dan menuliskan data JSON terbaru ke `localStorage` secara otomatis. Saat halaman di-refresh, data belanja tidak akan hilang.

### Kesalahan Umum

❌ Mengubah nilai signal lain di dalam `computed()`:
```typescript
// ❌ DILARANG: computed tidak boleh menghasilkan side effect
const total = computed(() => {
  localStorage.setItem('key', 'val'); // Side effect terlarang!
  return 100;
});
```

✅ Lakukan operasi side-effect hanya di dalam blok `effect(() => { ... })`.

**Kunci:** Gunakan `effect()` di dalam constructor untuk menyinkronkan perubahan signal ke sistem eksternal seperti `localStorage`.

---

<a id="bagian-8"></a>

## 8. 🟡 Mengontrol Reaktivitas: untracked() & Pembersihan Effect (onCleanup)

### Konsep

Ketika menggunakan `effect()`, terkadang ada kebutuhan khusus untuk mengontrol perilakunya:

1. **`untracked()`**:
   - Membaca nilai sebuah Signal di dalam `effect()` **tanpa mendaftarkannya sebagai pemicu dependensi**.
   - Contoh: Kita ingin mengirim log ke server setiap kali `cartItems()` berubah, dan menyertakan nilai `currentUser()`, tetapi kita **tidak ingin** effect tersebut berjalan ulang jika hanya `currentUser` yang berganti nama.
2. **`onCleanup()`**:
   - Fungsi callback untuk membersihkan proses lama (seperti timer `setTimeout`, socket connection, atau event listener) sebelum effect dijalankan ulang berikutnya atau saat komponen dihancurkan.

### Contoh

```typescript
import { Injectable, signal, effect, untracked } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActivityLoggerStore {
  activePage = signal('Home');
  currentUser = signal('Budi');

  constructor() {
    effect((onCleanup) => {
      // 1. activePage didaftarkan sebagai dependensi aktif
      const page = this.activePage();

      // 2. currentUser dibaca menggunakan untracked() (TIDAK menjadi trigger effect)
      const user = untracked(() => this.currentUser());

      console.log(`[ANALYTICS] Pengguna ${user} membuka halaman: ${page}`);

      // 3. Setup timer simulasi pengiriman data
      const timer = setTimeout(() => {
        console.log(`[NETWORK] Ping analitik terkirim untuk ${page}`);
      }, 2000);

      // 4. Bersihkan timer jika user berpindah halaman sebelum 2 detik
      onCleanup(() => {
        clearTimeout(timer);
        console.log('[CLEANUP] Membatalkan ping analitik halaman sebelumnya.');
      });
    });
  }
}
```

### Hasil Console

- Ketika `activePage.set('Checkout')`: Effect langsung berjalan dan mencatat log.
- Jika dalam 1 detik `activePage.set('Catalog')`: `onCleanup` otomatis membatalkan timer sebelumnya dan membuat timer baru.
- Ketika `currentUser.set('Andi')`: Effect **tidak berjalan ulang** berkat `untracked()`.

**Kunci:** Gunakan `untracked()` untuk membaca signal tanpa meregistrasikan dependensi, dan `onCleanup` untuk mencegah proses tumpang tindih.

---

<a id="bagian-9"></a>

## 9. 🟡 Menjembatani RxJS dan Signals (@angular/core/rxjs-interop)

### Konsep

Di Angular modern, terdapat pembagian peran yang sangat jelas antara Signals dan RxJS:

```text
┌────────────────────────────────────────────────────────┐
│                   Kapan Menggunakan Apa?               │
├───────────────────────────┬────────────────────────────┤
│      Angular Signals      │         RxJS Streams       │
├───────────────────────────┼────────────────────────────┤
│ • Manajemen State UI      │ • Penanganan Async Events  │
│ • Komputasi Nilai Turunan │ • HTTP Request / WebSockets│
│ • Rendering Template DOM  │ • Debounce, Throttle, Time │
│ • Performa Cepat & Mudah  │ • Pembatalan Stream (Abort)│
└───────────────────────────┴────────────────────────────┘
```

Paket resmi **`@angular/core/rxjs-interop`** menyediakan dua fungsi jembatan terbaik:
1. **`toSignal()`**: Mengubah RxJS Observable $\rightarrow$ Angular Signal (untuk konsumsi data di template secara mudah).
2. **`toObservable()`**: Mengubah Angular Signal $\rightarrow$ RxJS Observable (untuk memanfaatkan operator canggih seperti `debounceTime` atau `switchMap`).

##### Diagram Interoperabilitas

```text
Observable (HTTP / Stream) ──► toSignal()     ──► Signal (UI State & Template)
Signal (Input / State)     ──► toObservable() ──► Observable (RxJS Operators)
```

**Kunci:** Signals sangat unggul untuk UI State; RxJS sangat unggul untuk kontrol alur asynchronous yang kompleks.

---

<a id="bagian-10"></a>

## 10. 🟡 Mengubah Observable HTTP ke Signal via toSignal()

### Konsep

Ketika kita memanggil backend API menggunakan `HttpClient`, method HTTP mengembalikan sebuah RxJS `Observable`.

Dahulu, kita harus melakukan `.subscribe()` manual di komponen dan menyimpannya ke variabel, lalu mengurusi unsubscription di `ngOnDestroy`.

Dengan fungsi **`toSignal(observable$, options)`**:
- Observable otomatis di-subscribe dan diubah menjadi **Read-Only Signal**.
- Otomatis dibersihkan (*unsubscribed*) saat injection context selesai.
- Dapat diberikan nilai awal (*initial value*) saat data masih dalam proses loading dari server.

### Contoh

1. **Service Pengambil Data (`src/app/services/product-api.service.ts`)**:

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Product {
  id: number;
  title: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  getProducts() {
    return this.http.get<Product[]>(this.apiUrl);
  }
}
```

2. **Store Menggunakan `toSignal()` (`src/app/stores/product.store.ts`)**:

```typescript
import { Injectable, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductApiService, Product } from '../services/product-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductStore {
  private api = inject(ProductApiService);

  // Mengubah Observable HTTP langsung menjadi Signal dengan initialValue array kosong
  readonly products = toSignal(this.api.getProducts(), {
    initialValue: [] as Product[]
  });

  // Derived state dari signal hasil API
  readonly totalProducts = computed(() => this.products().length);
  readonly isLoading = computed(() => this.products().length === 0);
}
```

3. **Konsumsi di Komponen Template**:

```typescript
import { Component, inject } from '@angular/core';
import { ProductStore } from '../stores/product.store';

@Component({
  selector: 'app-product-view',
  standalone: true,
  template: `
    <h3>Daftar Produk dari Server</h3>

    @if (store.isLoading()) {
      <p>⏳ Sedang memuat data produk...</p>
    } @else {
      <p>Total Ditemukan: {{ store.totalProducts() }} produk</p>
      <ul>
        @for (item of store.products(); track item.id) {
          <li>{{ item.title }}</li>
        }
      </ul>
    }
  `
})
export class ProductViewComponent {
  store = inject(ProductStore);
}
```

### Hasil

Tidak ada lagi kode `ngOnInit`, `subscribe()`, atau `ngOnDestroy` manual. Template langsung membaca `store.products()` seperti variabel reaktif biasa!

**Kunci:** `toSignal(observable$, { initialValue: ... })` mengubah data asinkron backend menjadi Signal deklaratif yang bersih.

---

<a id="bagian-11"></a>

## 11. 🟡 Mengubah Signal ke Observable Stream via toObservable()

### Konsep

Ketika kita ingin mengimplementasikan fitur seperti **Pencarian Realtime dengan Debounce (Live Search Typeahead)**, kita ingin mendengarkan perubahan teks pengetikan dari Signal, tetapi menundanya selama 300ms agar tidak membanjiri server dengan request HTTP.

Untuk memanfaatkan operator RxJS seperti `debounceTime()`, `distinctUntilChanged()`, dan `switchMap()`, kita mengubah Signal input teks menjadi Observable stream menggunakan **`toObservable()`**.

### Contoh: Fitur Live Search dengan Debounce

File: `src/app/components/live-search.component.ts`

```typescript
import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-live-search',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="search-box">
      <h3>Cari Pengguna (Live Debounce)</h3>
      <input 
        type="text" 
        [ngModel]="searchQuery()" 
        (ngModelChange)="searchQuery.set($event)"
        placeholder="Ketik nama user..." 
      />

      <ul>
        @for (u of searchResults(); track u.id) {
          <li>👤 {{ u.name }}</li>
        } @empty {
          <li>Tidak ada data yang cocok.</li>
        }
      </ul>
    </div>
  `
})
export class LiveSearchComponent {
  private http = inject(HttpClient);

  // 1. Signal pencarian dari input form
  searchQuery = signal('');

  // 2. Ubah Signal ke Observable stream untuk menerapkan debounce
  private queryStream$ = toObservable(this.searchQuery).pipe(
    debounceTime(400), // Tunggu jeda mengetik 400ms
    distinctUntilChanged(), // Abaikan jika kata kunci sama
    switchMap(query => {
      if (!query.trim()) return of([]);
      return this.http.get<User[]>(`https://jsonplaceholder.typicode.com/users?q=${query}`);
    })
  );

  // 3. Ubah kembali hasil akhir Observable stream menjadi Signal untuk UI template
  searchResults = toSignal(this.queryStream$, { initialValue: [] as User[] });
}
```

### Hasil

Ketika pengguna mengetik cepat "Budi", request ke server tidak dikirim pada setiap ketukan huruf, melainkan hanya 1 kali setelah pengguna berhenti mengetik selama 400 milidetik.

**Kunci:** `toObservable(mySignal)` memungkinkan kita menerapkan operator canggih RxJS (`debounceTime`, `switchMap`) pada data Signal.

---

<a id="bagian-12"></a>

## 12. 🟡 Functional HTTP Interceptors (withInterceptors)

### Konsep

**HTTP Interceptors** adalah middleware yang mencegat setiap request HTTP yang keluar dari aplikasi dan setiap response yang masuk dari server backend.

##### Dua Penggunaan Paling Umum:
1. **Auth Token Interceptor**: Otomatis menyisipkan header `Authorization: Bearer <token>` dari Global Auth Store ke semua permintaan API backend.
2. **Global Error Interceptor**: Menangkap error 401 Unauthorized (token kadaluarsa) untuk otomatis melakukan redirect ke halaman login.

##### Konfigurasi Interceptor Fungsional di `app.config.ts`
Pada Angular modern, interceptor didefinisikan sebagai fungsi bertipe **`HttpInterceptorFn`** dan didaftarkan menggunakan **`withInterceptors([authInterceptor, errorInterceptor])`**.

### Contoh

1. **Service Auth Global (`src/app/stores/auth.store.ts`)**:

```typescript
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  #token = signal<string | null>('JWT_TOKEN_SECRET_XYZ');
  readonly token = this.#token.asReadonly();
}
```

2. **Functional Auth Interceptor (`src/app/interceptors/auth.interceptor.ts`)**:

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../stores/auth.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const token = authStore.token();

  // Jika token tersedia, kloning request dan tambahkan header Authorization
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
```

3. **Pendaftaran di Config Global (`src/app/app.config.ts`)**:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Mendaftarkan client HTTP beserta middleware interceptors
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
```

### Hasil di Network Tab Browser

Setiap kali `HttpClient.get()` atau `HttpClient.post()` dipanggil, header request otomatis memiliki:
```http
Authorization: Bearer JWT_TOKEN_SECRET_XYZ
```

**Kunci:** `withInterceptors([fn])` mendaftarkan fungsi middleware HTTP untuk mengotomatisasi injeksi token autentikasi global.

---

<a id="bagian-13"></a>

## 13. 🟡 Pola Arsitektur Lanjutan: Store Composition & SignalStore Overview

### Konsep

Ketika aplikasi membesar menjadi enterprise, kita akan memiliki beberapa Store terpisah (misal: `AuthStore`, `CartStore`, `NotificationStore`).

##### 1. Store Composition (Komunikasi Antar-Store)
Sebuah Store dapat dengan mudah menyuntikkan Store lain via `inject()`. Contoh: `OrderStore` menyuntikkan `AuthStore` untuk mengambil ID user yang sedang login saat checkout.

```typescript
@Injectable({ providedIn: 'root' })
export class OrderStore {
  private authStore = inject(AuthStore); // Menyuntikkan store lain
  private cartStore = inject(CartStore);

  checkout() {
    const userId = this.authStore.user()?.id;
    const items = this.cartStore.items();
    console.log(`User ${userId} membuat pesanan untuk ${items.length} item.`);
  }
}
```

##### 2. Pengenalan Singkat `@ngrx/signals` (*NgRx SignalStore*)
Untuk arsitektur tim berskala besar yang membutuhkan standarisasi ketat, ekosistem Angular menyediakan library resmi bernama **NgRx SignalStore** (`signalStore()`). Library ini menyusun state, computed selectors, dan methods dalam struktur deklaratif fungsional tanpa boilerplate Redux lama:

```typescript
// Gambaran sekilas pola NgRx SignalStore (Opsional / Advanced)
import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';

export const BooksStore = signalStore(
  { providedIn: 'root' },
  withState({ books: [], isLoading: false }),
  withComputed(({ books }) => ({
    bookCount: computed(() => books().length)
  })),
  withMethods((store) => ({
    loadAll() { /* ... */ }
  }))
);
```

**Kunci:** Store berbasis Service sudah sangat mumpuni untuk sebagian besar aplikasi; gunakan Store Composition untuk menghubungkan data antar-store.

---

<a id="bagian-14"></a>

## 14. 🛠️ Peta Ingatan, Cheat Code 10 Detik & Tabel Komparasi

### Peta Ingatan Konsep Angular State Management

```text
Angular State Management
├── Local State vs Global State
│   ├── Local: Signal di dalam 1 komponen
│   └── Global: Service Singleton (@Injectable providedIn: 'root')
├── Anatomi Store Modern
│   ├── State: #private = signal(...)
│   ├── Enkapsulasi: readonly = this.#private.asReadonly()
│   ├── Selectors: computed(() => ...) (Cached Derived State)
│   └── Actions: methods dengan pola update immutability
├── Reaktivitas & Side Effects
│   ├── effect(() => { ... }) (LocalStorage, Analytics)
│   ├── untracked() (Membaca signal tanpa trigger effect)
│   └── onCleanup() (Pembersihan timer / proses lama)
├── Signals & RxJS Interoperability
│   ├── toSignal(observable$) (Stream -> Signal untuk UI)
│   └── toObservable(signal) (Signal -> Stream untuk Debounce)
└── Infrastruktur Asinkron
    └── withInterceptors([authInterceptor])
```

### Tabel Komparasi State Management: Angular vs Vue vs React

| Konsep / Fitur | Angular (Signals Store) | Vue 3 (Pinia) | React (Zustand) |
|---|---|---|---|
| **Definisi Store** | `@Injectable({ providedIn: 'root' }) class Store` | `defineStore('id', () => { ... })` | `create((set, get) => ({ ... }))` |
| **State Utama** | `state = signal(0)` | `const state = ref(0)` | `count: 0` |
| **Enkapsulasi Readonly** | `readonly = state.asReadonly()` | Otomatis via store instance | Otomatis via selector hook |
| **Derived State (Getters)** | `total = computed(() => ...)` | `const total = computed(() => ...)` | `(state) => state.items.length` |
| **Mutasi State** | `state.update(v => ...)` | `state.value++` atau `$patch` | `set(state => ({ ... }))` |
| **Side Effects** | `effect(() => ...)` | `watch()` / `$subscribe` | `subscribe()` / `useEffect` |
| **Akses di Komponen** | `private store = inject(MyStore)` | `const store = useMyStore()` | `const count = useStore(s => s.count)` |
| **Async Stream Bridge** | `toSignal()` & `toObservable()` | *Watch effect manual* | `fromObservable()` |

### Cheat Code Angular State 10 Detik

```text
#state = signal(data)              → State privat di dalam service store
state = this.#state.asReadonly()   → State publik yang aman dari mutasi liar
total = computed(() => state()*2)  → Selector global dengan caching otomatis
this.#state.update(list => [...])  → Mutasi state secara immutable
effect(() => localStorage.setItem) → Sinkronisasi otomatis ke storage
toSignal(http.get())               → Mengubah data API Observable ke Signal
toObservable(searchQuery)          → Mengubah Signal ke Observable untuk debounce
withInterceptors([authInterceptor])→ Menyisipkan JWT token ke semua HTTP request
```

---

<a id="bagian-15"></a>

## 15. 🛠️ Mini Project: Shopping Cart & Auth Session Global Store SPA

### Deskripsi Proyek
Membangun aplikasi **Interactive Shopping Cart & Auth Session SPA** mandiri yang mengintegrasikan:
- `AuthStore`: Mengelola status login pengguna secara global.
- `CartStore`: Mengelola keranjang belanja global (tambah, kurangi qty, hapus, total tagihan dinamis) dengan enkapsulasi `asReadonly()`.
- Sinkronisasi otomatis ke `localStorage` via `effect()`.
- Tampilan Navbar Cart Badge yang otomatis sinkron dengan Catalog Page dan Cart Drawer.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ 🛒 TechStore    [ Katalog Produk ]    [ 👤 Budi Santoso ]    [ 🛒 2 Item ] │
├──────────────────────────────────────────────┬───────────────────────────────┤
│ Katalog Produk Unggulan:                     │ Keranjang Belanja Anda:       │
│ • Keyboard RGB (Rp 450.000) [ + Beli ]       │ • Keyboard RGB x1 [ + ] [ - ] │
│ • Mouse Ergonomic (Rp 200.000) [ + Beli ]    │ • Mouse Ergonomic x1 [+][-]   │
│                                              │ Total: Rp 650.000             │
└──────────────────────────────────────────────┴───────────────────────────────┘
```

### Langkah 1: Model Data (`src/app/models/cart.model.ts`)

```typescript
export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface CartItem extends Product {
  quantity: number;
}
```

### Langkah 2: Auth Store Global (`src/app/stores/auth.store.ts`)

```typescript
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  #userName = signal<string>('Budi Santoso');
  #isLoggedIn = signal<boolean>(true);

  readonly userName = this.#userName.asReadonly();
  readonly isLoggedIn = this.#isLoggedIn.asReadonly();

  toggleAuth() {
    this.#isLoggedIn.update(status => !status);
  }
}
```

### Langkah 3: Cart Store Global dengan LocalStorage Persistence (`src/app/stores/cart.store.ts`)

```typescript
import { Injectable, signal, computed, effect } from '@angular/core';
import { Product, CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartStore {
  private STORAGE_KEY = 'global_cart_state';

  // 1. State Privat
  #items = signal<CartItem[]>(this.#loadInitialState());

  // 2. State Publik Read-Only
  readonly items = this.#items.asReadonly();

  // 3. Derived Selectors (Computed)
  readonly totalUnits = computed(() =>
    this.#items().reduce((total, item) => total + item.quantity, 0)
  );

  readonly totalPrice = computed(() =>
    this.#items().reduce((total, item) => total + item.price * item.quantity, 0)
  );

  readonly isEmpty = computed(() => this.#items().length === 0);

  constructor() {
    // Sinkronisasi otomatis ke LocalStorage setiap kali ada perubahan item
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.#items()));
    });
  }

  // 4. Actions
  addItem(product: Product) {
    this.#items.update(list => {
      const existing = list.find(item => item.id === product.id);
      if (existing) {
        return list.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...list, { ...product, quantity: 1 }];
    });
  }

  updateQuantity(id: number, delta: number) {
    this.#items.update(list =>
      list
        .map(item => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  }

  removeItem(id: number) {
    this.#items.update(list => list.filter(item => item.id !== id));
  }

  clearAll() {
    this.#items.set([]);
  }

  #loadInitialState(): CartItem[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) {
      return [
        { id: 1, name: 'Mechanical Keyboard RGB', price: 450000, quantity: 1 }
      ];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
}
```

### Langkah 4: Komponen Navbar Badge (`src/app/components/header-bar.component.ts`)

```typescript
import { Component, inject } from '@angular/core';
import { AuthStore } from '../stores/auth.store';
import { CartStore } from '../stores/cart.store';

@Component({
  selector: 'app-header-bar',
  standalone: true,
  template: `
    <header class="navbar">
      <h2 class="logo">⚡ TechStore</h2>
      
      <div class="user-meta">
        <button class="auth-btn" (click)="authStore.toggleAuth()">
          {{ authStore.isLoggedIn() ? '👤 ' + authStore.userName() : '🔑 Belum Login' }}
        </button>

        <div class="cart-pill">
          🛒 Total: <strong>{{ cartStore.totalUnits() }} item</strong>
        </div>
      </div>
    </header>
  `,
  styles: `
    .navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: #0f172a; color: white; border-radius: 8px; margin-bottom: 1.5rem; }
    .logo { margin: 0; font-size: 1.2rem; }
    .user-meta { display: flex; align-items: center; gap: 1rem; }
    .auth-btn { background: #334155; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; }
    .cart-pill { background: #2563eb; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.9rem; }
  `
})
export class HeaderBarComponent {
  authStore = inject(AuthStore);
  cartStore = inject(CartStore);
}
```

### Langkah 5: Komponen Utama Aplikasi (`src/app/app.component.ts`)

```typescript
import { Component, inject } from '@angular/core';
import { HeaderBarComponent } from './components/header-bar.component';
import { CartStore } from './stores/cart.store';
import { Product } from './models/cart.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderBarComponent],
  template: `
    <main class="app-layout">
      <!-- Navbar Terkoneksi Store Global -->
      <app-header-bar />

      <div class="content-grid">
        <!-- Kolom Kiri: Katalog Produk -->
        <section class="catalog-section">
          <h3>🛍️ Katalog Produk</h3>
          <div class="product-list">
            @for (p of availableProducts; track p.id) {
              <div class="product-card">
                <h4>{{ p.name }}</h4>
                <p class="price">Rp {{ p.price.toLocaleString('id-ID') }}</p>
                <button (click)="cartStore.addItem(p)">+ Beli Sekarang</button>
              </div>
            }
          </div>
        </section>

        <!-- Kolom Kanan: Keranjang Belanja Realtime -->
        <section class="cart-section">
          <h3>🛒 Isi Keranjang Belanja</h3>

          @if (cartStore.isEmpty()) {
            <p class="empty-text">Keranjang Anda masih kosong.</p>
          } @else {
            <ul class="cart-items">
              @for (item of cartStore.items(); track item.id) {
                <li class="item-row">
                  <div class="item-info">
                    <strong>{{ item.name }}</strong>
                    <small>Rp {{ item.price.toLocaleString('id-ID') }}</small>
                  </div>

                  <div class="qty-controls">
                    <button (click)="cartStore.updateQuantity(item.id, -1)">-</button>
                    <span>{{ item.quantity }}</span>
                    <button (click)="cartStore.updateQuantity(item.id, 1)">+</button>
                    <button class="del" (click)="cartStore.removeItem(item.id)">✕</button>
                  </div>
                </li>
              }
            </ul>

            <div class="cart-summary">
              <p>Total Item: <strong>{{ cartStore.totalUnits() }} pcs</strong></p>
              <h4>Total Bayar: Rp {{ cartStore.totalPrice().toLocaleString('id-ID') }}</h4>
              <button class="clear-btn" (click)="cartStore.clearAll()">Kosongkan Keranjang</button>
            </div>
          }
        </section>
      </div>
    </main>
  `,
  styles: `
    .app-layout { max-width: 900px; margin: 2rem auto; font-family: system-ui, sans-serif; padding: 0 1rem; }
    .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .catalog-section, .cart-section { border: 1px solid #cbd5e1; border-radius: 8px; padding: 1.25rem; background: #ffffff; }
    .product-card { border: 1px solid #e2e8f0; padding: 0.75rem; border-radius: 6px; margin-bottom: 0.75rem; }
    .product-card h4 { margin: 0 0 0.25rem 0; }
    .product-card .price { color: #0284c7; font-weight: bold; margin: 0 0 0.5rem 0; }
    .product-card button { background: #2563eb; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; }
    .cart-items { list-style: none; padding: 0; margin: 0; }
    .item-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #f1f5f9; }
    .qty-controls { display: flex; align-items: center; gap: 0.4rem; }
    .qty-controls button { width: 26px; height: 26px; border: 1px solid #cbd5e1; background: #f8fafc; border-radius: 4px; cursor: pointer; }
    .qty-controls button.del { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }
    .cart-summary { margin-top: 1rem; padding-top: 1rem; border-top: 2px solid #e2e8f0; }
    .clear-btn { background: #ef4444; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; margin-top: 0.5rem; }
  `
})
export class AppComponent {
  cartStore = inject(CartStore);

  availableProducts: Product[] = [
    { id: 1, name: 'Mechanical Keyboard RGB', price: 450000 },
    { id: 2, name: 'Wireless Mouse Ergonomic', price: 200000 },
    { id: 3, name: 'Monitor LED 24 Inch 144Hz', price: 1750000 }
  ];
}
```

---

<a id="bagian-16"></a>

## 16. 🧭 Urutan Belajar yang Disarankan & Referensi Resmi

### Selamat! Anda Telah Menyelesaikan Trilogi Inti Angular 🚀

```text
1. 🟢 [[angular-dasar|Angular Dasar]]
   - Standalone Components, Signals Reactivity, Control Flow (@if/@for), Form, dan Basic DI.
      │
      ▼
2. 🟡 [[angular-routing|Angular Routing]]
   - Client-Side Navigation, Parameter :id via Signal Input, Nested Routes, dan Functional Guards.
      │
      ▼
3. 🔴 [[angular-state|Angular State Management]] (Selesai ✅)
   - Service-Based Signals Store, asReadonly, effect(), RxJS Interop (toSignal), dan Interceptors.
```

### Referensi Resmi

- **Dokumentasi Resmi Angular Signals**: [https://angular.dev/guide/signals](https://angular.dev/guide/signals)
- **Panduan RxJS & Signals Interop**: [https://angular.dev/guide/signals/rxjs-interop](https://angular.dev/guide/signals/rxjs-interop)
- **Panduan Dependency Injection**: [https://angular.dev/guide/di](https://angular.dev/guide/di)
- **Panduan Functional HTTP Interceptors**: [https://angular.dev/guide/http/interceptors](https://angular.dev/guide/http/interceptors)
- **NgRx SignalStore Official Guide**: [https://ngrx.io/guide/signals/signal-store](https://ngrx.io/guide/signals/signal-store)
