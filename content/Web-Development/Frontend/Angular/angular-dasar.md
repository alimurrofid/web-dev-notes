---
title: "Angular Dasar"
description: "Panduan fundamental Angular modern: Standalone Component, Built-in Control Flow (@if, @for), Signal State lokal, Component Communication (input, output, model), Form, dan Dependency Injection (inject)."
order: 1
tags:
  - web-development
  - frontend
  - angular
  - typescript
  - fundamental
---

# Angular Dasar

> **Target:** Pemula yang telah memahami TypeScript dasar, JavaScript modern (ES6+), dan manipulasi DOM, serta ingin menguasai **arsitektur antarmuka pengguna berbasis komponen menggunakan Angular modern (Current / Stable)**.  
> **Versi:** Angular Current / Stable (Standalone Components & Signals Reactivity)  
> **Prasyarat:** [[typescript-dasar|TypeScript Dasar]] · [[javascript-dom|JavaScript DOM]]  
> Fokus modul pembelajaran ini: **mental model SPA & Standalone Component → tooling @angular/cli & bedah direktori → anatomi @Component decorator → data binding & event handling → state reaktif lokal dengan Signals (`signal`, `set`, `update`, `computed`) → built-in control flow modern (`@if`, `@for`, `@switch`) → komunikasi komponen (`input()`, `output()`, `model()`) → form input & two-way binding `[(ngModel)]` → reactive forms dasar → dependency injection fungsional (`inject()`) → HTTP Client dasar (Component → Service → HttpClient → Signal) → lifecycle hooks esensial → content projection (`<ng-content>`) → mini project Task & Habit Tracker**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: Mental Model Standalone, Anatomi Komponen, Data Binding, Signals Dasar, dan Control Flow (@if/@for)

🟡 Lanjutan
→ pelajari setelah fundamental nyaman: Komunikasi Komponen (input/output/model), Form Binding, Dependency Injection, dan HTTP Service

🔴 Advanced / Praktik
→ penting untuk arsitektur terstruktur: Content Projection, Lifecycle Hooks, dan Mini Project Terintegrasi
```

Mental model interaksi State, Template, dan DOM pada Angular Modern:

```text
               1. USER EVENT / HTTP RESPONSE
                             │
                             ▼
               2. UPDATE STATE SIGNAL (Class)
                 count.update(n => n + 1)
                             │
                             ▼
               3. SIGNAL NOTIFY DEPENDENCY
             (Memberi tahu template yang bergantung)
                             │
                             ▼
               4. GRANULAR TEMPLATE UPDATE
           (Render ulang bagian @if / @for / {{ }} )
                             │
                             ▼
                 5. RE-RENDER KE REAL DOM
         (Hanya node DOM terkait yang diperbarui)
```

**Hafalan:**

```text
Standalone Component → Komponen independen mandiri yang mengimpor dependensinya sendiri tanpa butuh NgModule
@Component Decorator → Metadata TypeScript yang mendefinisikan selector, imports, template, dan style komponen
Interpolation {{ }}  → Menampilkan nilai ekspresi TypeScript ke dalam teks template HTML
Property Binding []  → Mengikat data TypeScript ke properti elemen DOM atau input komponen anak ([src], [disabled])
Event Binding ()     → Mendengarkan interaksi user dari DOM untuk memicu method TypeScript ((click), (input))
Signal               → Nilai pembungkus reaktif yang melacak dependensi dan memberitahu template saat nilainya berubah
@if / @for / @switch → Blok kontrol alur deklaratif bawaan template Angular modern dengan performa tinggi
input() / output()   → Fungsi modern Angular untuk menerima data dari parent dan memancarkan event ke parent
model()              → Fungsi modern Angular untuk komunikasi data dua arah (two-way binding) antar-komponen
inject()             → Fungsi modern untuk mengambil dependensi (Service) tanpa melalui constructor boilerplate
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Angular & Mental Model Standalone](#bagian-1)
2. [Instalasi Tooling CLI & Struktur Folder Proyek](#bagian-2)
3. [Anatomi Standalone Component (@Component)](#bagian-3)
4. [Data Binding (Interpolasi & Property Binding)](#bagian-4)
5. [Event Binding & Penanganan Interaksi User](#bagian-5)
6. [State Lokal Komponen Menggunakan Angular Signals](#bagian-6)
7. [Built-in Control Flow: Percabangan (@if, @else if, @else)](#bagian-7)
8. [Built-in Control Flow: Perulangan (@for, track, @empty)](#bagian-8)
9. [Built-in Control Flow: Seleksi Multi-Kondisi (@switch, @case)](#bagian-9)
10. [Komunikasi Komponen: Menerima Data via input()](#bagian-10)
11. [Komunikasi Komponen: Mengirim Event via output()](#bagian-11)
12. [Two-Way Binding Komponen Modern dengan model()](#bagian-12)

### 🟡 Lanjutan

13. [Form Input & Two-Way Binding [(ngModel)]](#bagian-13)
14. [Dasar Reactive Forms (FormControl & FormGroup Sederhana)](#bagian-14)
15. [Dependency Injection & Service Modern dengan inject()](#bagian-15)
16. [Mengambil Data Backend dengan HTTP Client Dasar](#bagian-16)
17. [Lifecycle Hooks Esensial (ngOnInit & ngOnDestroy)](#bagian-17)
18. [Content Projection Sederhana (<ng-content>)](#bagian-18)

### 🛠️ Praktik & Referensi

19. [Peta Ingatan, Cheat Code 10 Detik & Tabel Komparasi](#bagian-19)
20. [Mini Project: Task & Habit Tracker CLI-Like Web App](#bagian-20)
21. [Urutan Belajar yang Disarankan & Referensi Resmi](#bagian-21)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan Angular & Mental Model Standalone

### Konsep

**Angular** adalah framework web berbasis TypeScript berskala industri untuk membangun aplikasi web modern yang cepat, terstruktur, dan mudah dirawat (*Single Page Application*).

Pada Angular modern (current/stable), arsitektur aplikasi dibangun menggunakan paradigma **Standalone Components**:

##### Mengapa Standalone Components?
- **Dahulu (Legacy NgModule)**: Setiap komponen, direktif, dan pipe wajib didaftarkan ke dalam modul penampung (`@NgModule`). Jika kita lupa mendaftarkan komponen ke array `declarations` atau `exports`, Angular akan memunculkan error runtime yang membingungkan.
- **Sekarang (Modern Standalone)**: Komponen bersifat mandiri (*self-contained*). Komponen langsung mendeklarasikan dependensi apa saja yang ia butuhkan di dalam array `imports: [...]` pada dekoratornya sendiri.

##### Mental Model Komponen Standalone

```text
┌────────────────────────────────────────────────────────┐
│                   Standalone Component                 │
│                                                        │
│  imports: [CommonModule, RouterLink, ChildComponent]   │
│  ┌──────────────────────────────────────────────────┐  │
│  │ TypeScript Class (Logic & State)                 │  │
│  │ - userName = signal('Budi')                      │  │
│  │ - login() { ... }                                │  │
│  └────────────────────────┬─────────────────────────┘  │
│                           │ mengikat data (Binding)    │
│  ┌────────────────────────▼─────────────────────────┐  │
│  │ HTML Template (Tampilan & Kontrol Alur)          │  │
│  │ <h1>Halo {{ userName() }}</h1>                   │  │
│  │ @if (isLoggedIn()) { <Dashboard /> }             │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### Contoh Sederhana

```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <main>
      <h1>Selamat Datang di Angular Modern!</h1>
      <button (click)="tambah()">Klik Saya: {{ count() }}</button>
    </main>
  `
})
export class AppComponent {
  count = signal(0);

  tambah() {
    this.count.update(c => c + 1);
  }
}
```

### Hasil

**Output awal di browser:**

```text
Selamat Datang di Angular Modern!
[ Klik Saya: 0 ]
```

**Setelah tombol diklik 2 kali:**

```text
Selamat Datang di Angular Modern!
[ Klik Saya: 2 ]
```

### Best Practice

- Gunakan komponen Standalone untuk seluruh komponen baru.
- Jangan membuat file `app.module.ts` atau `@NgModule` baru pada proyek modern.

**Kunci:** Komponen Standalone adalah unit mandiri yang langsung mengimpor kebutuhannya sendiri tanpa perantara NgModule.

---

<a id="bagian-2"></a>

## 2. 🟢 Instalasi Tooling CLI & Struktur Folder Proyek

### Konsep

Angular menyediakan command line tool resmi bernama `@angular/cli` untuk inisialisasi proyek standar, scaffolding kode, kompilasi TypeScript, hingga pengujian.

##### Alur Bootstrap Aplikasi Modern

```text
index.html (Memuat tag <app-root>)
    │
    ▼
src/main.ts (Menjalankan bootstrapApplication(AppComponent, appConfig))
    │
    ▼
src/app/app.config.ts (Mendaftarkan Providers global: HTTP, Router, dll)
    │
    ▼
src/app/app.component.ts (Merender Root Standalone Component ke <app-root>)
```

### Contoh Perintah CLI

```bash
# 1. Install Angular CLI secara global
npm install -g @angular/cli

# 2. Buat proyek baru dengan Standalone default
ng new belajar-angular --routing=false --style=css

# 3. Masuk ke direktori dan jalankan local dev server
cd belajar-angular
ng serve --open
```

### Struktur Direktori Standar

```text
belajar-angular/
├── src/
│   ├── app/
│   │   ├── app.component.ts       → Root Standalone Component (Logika & Template)
│   │   ├── app.component.html     → Template HTML eksternal (opsional)
│   │   ├── app.component.css      → Styling CSS lokal terisolasi
│   │   └── app.config.ts          → Konfigurasi global (providers, Router, HTTP)
│   ├── index.html                 → File HTML utama tempat tag <app-root> berada
│   ├── main.ts                    → Titik masuk eksekusi (bootstrapApplication)
│   └── styles.css                 → Global stylesheet untuk seluruh aplikasi
├── angular.json                   → Konfigurasi build tool & workspace CLI
├── tsconfig.json                  → Konfigurasi compiler TypeScript
└── package.json                   → Daftar dependensi npm
```

### Bedah File Entry Point (`src/main.ts`)

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Menjalankan aplikasi langsung dari Root Standalone Component
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

### Kesalahan Umum

❌ Menggunakan tutorial berbasis `platformBrowserDynamic().bootstrapModule(AppModule)` pada proyek Angular modern.  
Alasannya: Pendekatan tersebut adalah sintaks lama berbasis NgModule yang tidak lagi digunakan sebagai default.

✅ Gunakan `bootstrapApplication(RootComponent, appConfig)` pada file `main.ts`.

**Kunci:** Proyek Angular modern dimulai dari `main.ts` yang langsung mem-bootstrap Standalone Root Component via `bootstrapApplication`.

---

<a id="bagian-3"></a>

## 3. 🟢 Anatomi Standalone Component (@Component)

### Konsep

Sebuah komponen Angular dibangun dari dua bagian utama:
1. **TypeScript Class**: Berisi properti (state) dan method (logika bisnis).
2. **`@Component` Decorator**: Metadata yang memberi instruksi kepada compiler Angular mengenai cara kerja komponen tersebut di layar.

##### Anatomi Dekorator `@Component`

```text
@Component({
  selector: 'app-user-card',     ──► Nama tag HTML kustom untuk memanggil komponen
  standalone: true,              ──► Menandakan komponen mandiri (tanpa NgModule)
  imports: [CommonModule],       ──► Daftar komponen / direktif yang dipakai di template
  template: `...`,               ──► Template inline (atau templateUrl: './user.html')
  styles: `...`                  ──► Style CSS lokal (atau styleUrl: './user.css')
})
```

##### Isolasi CSS (View Encapsulation)
Secara default, CSS yang ditulis di dalam komponen Angular bersifat terisolasi (*scoped*). Selector CSS yang Anda tulis tidak akan bocor ke komponen lain di luar komponen tersebut.

### Contoh

Membuat komponen kartu profil (`src/app/user-card.component.ts`):

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [],
  template: `
    <article class="card">
      <h2>{{ name }}</h2>
      <p class="role-badge">{{ role }}</p>
    </article>
  `,
  styles: `
    .card {
      border: 1px solid #e2e8f0;
      padding: 1.25rem;
      border-radius: 8px;
      background: #ffffff;
      max-width: 300px;
    }
    .role-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      background: #e0f2fe;
      color: #0369a1;
      border-radius: 4px;
      font-size: 0.85rem;
    }
  `
})
export class UserCardComponent {
  name: string = 'Budi Santoso';
  role: string = 'Frontend Engineer';
}
```

### Hasil

**Penggunaan di template parent:**

```html
<app-user-card></app-user-card>
```

**Output visual di browser:**

```text
┌─────────────────────────────────┐
│ Budi Santoso                    │
│ [ Frontend Engineer ]           │
└─────────────────────────────────┘
```

**Kunci:** `@Component` menyatukan class TypeScript, template HTML, dan scoped CSS menjadi tag HTML kustom yang dapat digunakan berulang kali.

---

<a id="bagian-4"></a>

## 4. 🟢 Data Binding (Interpolasi & Property Binding)

### Konsep

Data Binding adalah mekanisme komunikasi satu arah dari kode TypeScript ke template HTML agar antarmuka selalu sinkron dengan data.

```text
TypeScript Class (Data) ──── [ Binding ] ────► HTML Template (DOM)
```

Terdapat dua tipe data binding utama:

1. **Text Interpolation `{{ ekspresi }}`**:
   - Menyisipkan nilai ekspresi TypeScript sebagai **teks murni (*plain text*)** ke dalam konten elemen HTML.
   - Otomatis melakukan sanitasi teks sehingga aman dari serangan injeksi XSS.

2. **Property Binding `[properti]="ekspresi"`**:
   - Mengikat nilai data ke **DOM Property** elemen (seperti `src`, `href`, `disabled`, `hidden`, `value`).
   - Menghilangkan atau menambahkan atribut secara otomatis untuk atribut boolean.

##### Atribut Boolean (*Truthy / Falsy*)
Pada property binding seperti `[disabled]="kondisi"`:
- Jika nilainya bernilai *truthy* (`true`, `'yes'`), atribut boolean aktif di DOM.
- Jika nilainya bernilai *falsy* (`false`, `null`, `undefined`), Angular otomatis menghapus atribut tersebut dari elemen DOM.

### Contoh

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-binding-demo',
  standalone: true,
  template: `
    <section class="demo-box">
      <!-- 1. Interpolasi Teks & Ekspresi Matematika Sederhana -->
      <h1>Halo, {{ username }}!</h1>
      <p>Total Poin: {{ points * 2 }} poin</p>

      <!-- 2. Property Binding Atribut Elemen -->
      <img [src]="avatarUrl" [alt]="username" width="60" />

      <!-- 3. Property Binding Atribut Boolean -->
      <div>
        <button [disabled]="isLocked">
          {{ isLocked ? 'Tombol Terkunci' : 'Kirim Data' }}
        </button>
      </div>

      <!-- 4. Class & Style Binding Dinamis -->
      <div [class.active-card]="isActive" [style.color]="textColor">
        Status Akun: Aktif
      </div>
    </section>
  `,
  styles: `
    .demo-box { padding: 1rem; border: 1px solid #cbd5e1; border-radius: 8px; }
    .active-card { font-weight: bold; border-left: 4px solid #10b981; padding-left: 0.5rem; }
  `
})
export class BindingDemoComponent {
  username = 'Ahmad Dahlan';
  points = 25;
  avatarUrl = 'https://picsum.photos/60';
  isLocked = true;
  isActive = true;
  textColor = '#0f766e';
}
```

### Hasil

**Output yang dirender ke DOM:**

```html
<section class="demo-box">
  <h1>Halo, Ahmad Dahlan!</h1>
  <p>Total Poin: 50 poin</p>
  <img src="https://picsum.photos/60" alt="Ahmad Dahlan" width="60">
  <div>
    <button disabled>Tombol Terkunci</button>
  </div>
  <div class="active-card" style="color: rgb(15, 118, 110);">
    Status Akun: Aktif
  </div>
</section>
```

### Kesalahan Umum

❌ Menggabungkan kurung siku `[]` dengan kurung kurawal `{{ }}` di dalam binding atribut:
```html
<!-- SALAH -->
<img [src]="{{ avatarUrl }}" />
```

✅ Gunakan salah satu sintaks secara tepat:
```html
<!-- BENAR (Property Binding) -->
<img [src]="avatarUrl" />

<!-- BENAR (Interpolasi Atribut Biasa) -->
<img src="{{ avatarUrl }}" />
```

**Kunci:** Gunakan `{{ }}` untuk konten teks dan `[properti]` untuk mengikat nilai ekspresi ke properti DOM elemen.

---

<a id="bagian-5"></a>

## 5. 🟢 Event Binding & Penanganan Interaksi User

### Konsep

**Event Binding** menggunakan tanda kurung biasa `(namaEvent)="handler()"` untuk mendengarkan aksi interaksi pengguna dari DOM (seperti klik tombol, input teks, submit form, hover mouse) dan meneruskannya ke method TypeScript.

##### Diagram Alur Event

```text
User Klik Tombol (DOM Event: 'click')
                 │
                 ▼
      (click)="tambahPoin()"
                 │
                 ▼
       Eksekusi Method di TS
         points.update(...)
                 │
                 ▼
        DOM Otomatis Update
```

##### Objek `$event`
Angular menyediakan variabel bawaan `$event` pada template untuk mengakses payload event asli dari browser (seperti `MouseEvent` atau `InputEvent`).

### Contoh

```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-event-demo',
  standalone: true,
  template: `
    <div class="event-card">
      <h3>Penghitung Interaktif</h3>
      <p>Skor Saat Ini: <strong>{{ score() }}</strong></p>

      <!-- Event klik sederhana -->
      <div class="btn-group">
        <button (click)="tambah()">+ Tambah 1</button>
        <button (click)="reset()">Reset Skor</button>
      </div>

      <hr />

      <!-- Event input dengan menangkap objek $event -->
      <label>Catatan Pengguna:</label>
      <input 
        type="text" 
        placeholder="Ketik catatan..." 
        (input)="onTextInput($event)" 
      />

      <p class="preview-text">Hasil Live: {{ userNote() }}</p>
    </div>
  `,
  styles: `
    .event-card { padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 360px; }
    .btn-group button { margin-right: 0.5rem; padding: 0.4rem 0.8rem; cursor: pointer; }
    .preview-text { color: #475569; font-style: italic; }
  `
})
export class EventDemoComponent {
  score = signal(0);
  userNote = signal('');

  tambah() {
    this.score.update(s => s + 1);
  }

  reset() {
    this.score.set(0);
  }

  onTextInput(event: Event) {
    // Type casting dari event target ke HTMLInputElement
    const target = event.target as HTMLInputElement;
    this.userNote.set(target.value);
  }
}
```

### Hasil

**Kondisi awal:**
```text
Penghitung Interaktif
Skor Saat Ini: 0
[ + Tambah 1 ] [ Reset Skor ]
Catatan Pengguna: [                      ]
Hasil Live: 
```

**Setelah klik "+ Tambah 1" sebanyak 3 kali dan mengetik "Angular Cepat":**
```text
Penghitung Interaktif
Skor Saat Ini: 3
[ + Tambah 1 ] [ Reset Skor ]
Catatan Pengguna: [ Angular Cepat        ]
Hasil Live: Angular Cepat
```

### Kesalahan Umum

❌ Lupa melakukan type-casting pada objek `$event.target`:
```typescript
// ❌ Error TypeScript: Property 'value' does not exist on type 'EventTarget'
onInput(e: Event) {
  this.note = e.target.value; 
}
```

✅ Lakukan type casting ke elemen yang sesuai:
```typescript
// ✅ Aman dan Type-Safe
onInput(e: Event) {
  const input = e.target as HTMLInputElement;
  this.note = input.value;
}
```

**Kunci:** `(event)="handler()"` mengalirkan interaksi dari antarmuka pengguna (DOM) ke logika TypeScript.

---

<a id="bagian-6"></a>

## 6. 🟢 State Lokal Komponen Menggunakan Angular Signals

### Konsep

Pada Angular modern, **Signals** adalah fondasi utama sistem reaktivitas (*Reactivity Engine*).

##### Apa itu Signal?
Signal adalah pembungkus nilai (*reactive value holder*) yang melacak di mana saja nilainya dibaca. Ketika nilai di dalam signal diperbarui, Angular mengetahui secara presisi node DOM mana yang harus diperbarui tanpa perlu memeriksa seluruh komponen aplikasi (*fine-grained reactivity*).

##### Mengapa Membaca Signal Memerlukan Tanda Kurung `()`?
Signal dibungkus sebagai fungsi *getter*. Saat kita memanggil `count()`, getter tersebut dieksekusi sehingga sistem Angular dapat mendaftarkan konteks saat itu (template atau computed) sebagai dependensi aktif.

##### Operasi Dasar Signal:
- `signal(nilaiAwal)`: Membuat *Writable Signal* baru.
- `mySignal()`: Membaca nilai signal (wajib pakai tanda kurung di TS maupun di template).
- `mySignal.set(nilaiBaru)`: Mengganti (*replace*) nilai secara langsung.
- `mySignal.update(fn)`: Memperbarui nilai berdasarkan nilai saat ini (`n => n + 1`).
- `computed(() => ...)`: Menghasilkan nilai turunan (*derived state*) yang otomatis terhitung ulang dan memiliki mekanisme **caching**.

##### Diagram Hubungan State & Computed

```text
price (50000)   ─────┐
                     ├───► computed(() => price() * qty()) ───► total (150000)
quantity (3)    ─────┘
```

### Contoh

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-signal-cart',
  standalone: true,
  template: `
    <div class="cart-box">
      <h3>Keranjang Belanja</h3>
      <p>Produk: <strong>{{ productName() }}</strong></p>
      <p>Harga Satuan: Rp {{ price().toLocaleString('id-ID') }}</p>
      <p>Jumlah Beli: {{ quantity() }} pcs</p>

      <!-- Derived State: Otomatis sinkron dan memiliki caching -->
      <h4>Total Tagihan: Rp {{ totalPrice().toLocaleString('id-ID') }}</h4>

      <div class="actions">
        <button (click)="tambah()">+ Tambah</button>
        <button (click)="kurang()" [disabled]="quantity() <= 1">- Kurang</button>
        <button (click)="gantiProduk()">Ganti ke Mouse</button>
      </div>
    </div>
  `,
  styles: `
    .cart-box { padding: 1.25rem; border: 1px solid #cbd5e1; border-radius: 8px; max-width: 400px; }
    .actions button { margin-right: 0.5rem; padding: 0.4rem 0.8rem; cursor: pointer; }
  `
})
export class SignalCartComponent {
  // 1. Writable Signals
  productName = signal('Keyboard Mechanical RGB');
  price = signal(450000);
  quantity = signal(1);

  // 2. Computed Signal (Read-Only Derived State)
  totalPrice = computed(() => this.price() * this.quantity());

  tambah() {
    this.quantity.update(q => q + 1);
  }

  kurang() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  gantiProduk() {
    this.productName.set('Mouse Wireless Ergonomic');
    this.price.set(200000);
  }
}
```

### Hasil

**Kondisi awal:**
```text
Keranjang Belanja
Produk: Keyboard Mechanical RGB
Harga Satuan: Rp 450.000
Jumlah Beli: 1 pcs
Total Tagihan: Rp 450.000
[ + Tambah ] [ - Kurang (Disabled) ] [ Ganti ke Mouse ]
```

**Setelah klik "+ Tambah" 2 kali:**
```text
Keranjang Belanja
Produk: Keyboard Mechanical RGB
Harga Satuan: Rp 450.000
Jumlah Beli: 3 pcs
Total Tagihan: Rp 1.350.000
[ + Tambah ] [ - Kurang ] [ Ganti ke Mouse ]
```

### Kesalahan Umum

❌ Lupa menulis tanda kurung saat membaca signal di template:
```html
<!-- ❌ SALAH: Menghasilkan referensi fungsi [Function] -->
<p>Total: {{ quantity }}</p>
```

✅ Selalu panggil dengan tanda kurung `()`:
```html
<!-- ✅ BENAR -->
<p>Total: {{ quantity() }}</p>
```

❌ Mencoba meng-assign nilai langsung ke computed signal:
```typescript
// ❌ Error: Computed signals are read-only
this.totalPrice.set(500000);
```

**Kunci:** `signal()` membungkus state reaktif lokal, dibaca dengan `signal()`, diubah dengan `.set()` atau `.update()`, dan diturunkan dengan `computed()`.

---

<a id="bagian-7"></a>

## 7. 🟢 Built-in Control Flow: Percabangan (@if, @else if, @else)

### Konsep

Angular modern memperkenalkan sintaks blok deklaratif bawaan template: `@if`, `@else if`, dan `@else`.

##### Mengapa Built-in Control Flow Lebih Unggul?
- **Kompilasi Langsung**: Diterjemahkan langsung oleh compiler Angular menjadi instruksi JS yang optimal, tidak seperti direktif `*ngIf` lama yang membutuhkan parser mikro-sintaks tambahan.
- **Tanpa Impor Modul**: Tidak memerlukan `CommonModule` lagi.
- **Type Narrowing**: Variabel di dalam blok `@if` otomatis memiliki tipe data yang lebih spesifik (*type-safe*).

##### Diagram Percabangan

```text
              isLoggedIn()
                   │
          ┌────────┴────────┐
          ▼                 ▼
        true              false
   (Render Profil)   (Render Tombol Login)
```

### Contoh

```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-control-if-demo',
  standalone: true,
  template: `
    <div class="auth-box">
      <button (click)="toggleAuth()">
        {{ isLoggedIn() ? 'Keluar (Logout)' : 'Masuk (Login)' }}
      </button>

      <hr />

      <!-- Percabangan Deklaratif Modern -->
      @if (isLoggedIn()) {
        <div class="user-panel">
          <h3>Selamat Datang, {{ userName() }}!</h3>
          <p>Status: Member Aktif ✅</p>
        </div>
      } @else if (isGuest()) {
        <div class="guest-panel">
          <h3>Mode Tamu</h3>
          <p>Anda memiliki akses pratinjau terbatas.</p>
        </div>
      } @else {
        <div class="locked-panel">
          <p>Silakan login terlebih dahulu untuk mengakses data.</p>
        </div>
      }
    </div>
  `,
  styles: `
    .auth-box { padding: 1rem; border: 1px solid #cbd5e1; border-radius: 8px; max-width: 380px; }
    .user-panel { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 0.5rem 1rem; }
    .guest-panel { background: #fefce8; border-left: 4px solid #eab308; padding: 0.5rem 1rem; }
    .locked-panel { background: #fef2f2; border-left: 4px solid #ef4444; padding: 0.5rem 1rem; }
  `
})
export class ControlIfDemoComponent {
  isLoggedIn = signal(false);
  isGuest = signal(true);
  userName = signal('Dewi Sartika');

  toggleAuth() {
    this.isLoggedIn.update(v => !v);
  }
}
```

### Hasil

**Kondisi awal (`isLoggedIn: false`, `isGuest: true`):**
```text
[ Masuk (Login) ]
-----------------------------------
Mode Tamu
Anda memiliki akses pratinjau terbatas.
```

**Setelah tombol login diklik (`isLoggedIn: true`):**
```text
[ Keluar (Logout) ]
-----------------------------------
Selamat Datang, Dewi Sartika!
Status: Member Aktif ✅
```

**Kunci:** `@if`, `@else if`, dan `@else` menyediakan percabangan template yang bersih, type-safe, dan berkinerja tinggi tanpa modul tambahan.

---

<a id="bagian-8"></a>

## 8. 🟢 Built-in Control Flow: Perulangan (@for, track, @empty)

### Konsep

Blok `@for` digunakan untuk melakukan perulangan (*looping*) pada koleksi data array di template.

##### Mengapa `track` Wajib?
Pada Angular modern, ekspresi `track` **wajib disertakan** pada setiap blok `@for`.  
`track` memberikan identifier unik (seperti ID database `item.id` atau indeks unik) sehingga saat urutan data array berubah atau salah satu data dihapus, Angular hanya memanipulasi node DOM yang relevan tanpa merender ulang seluruh list dari awal.

##### Variabel Kontekstual Bawaan:
- `$index`: Indeks item (mulai dari 0).
- `$first`: Boolean `true` jika item adalah elemen pertama.
- `$last`: Boolean `true` jika item adalah elemen terakhir.
- `$even` / `$odd`: Boolean untuk posisi genap/ganjil.
- `$count`: Total panjang item array.

##### Blok Fallback `@empty`
Jika array kosong (`length === 0`), blok `@empty` otomatis dieksekusi tanpa perlu menulis `@if (items.length === 0)` secara terpisah.

### Contoh

```typescript
import { Component, signal } from '@angular/core';

interface ProductItem {
  id: number;
  name: string;
  stock: number;
}

@Component({
  selector: 'app-control-for-demo',
  standalone: true,
  template: `
    <div class="inventory-box">
      <h3>Inventaris Gudang (Total: {{ items().length }})</h3>

      <ul>
        <!-- Perulangan Modern dengan track dan variabel kontekstual -->
        @for (item of items(); track item.id; let idx = $index, isLast = $last) {
          <li class="item-row">
            <span class="badge">#{{ idx + 1 }}</span>
            <strong>{{ item.name }}</strong> (Stok: {{ item.stock }})
            @if (isLast) {
              <em class="last-tag">← Terakhir</em>
            }
          </li>
        } @empty {
          <li class="empty-state">📦 Seluruh stok produk kosong!</li>
        }
      </ul>

      <div class="btn-group">
        <button (click)="kosongkan()">Kosongkan Stok</button>
        <button (click)="isiUlang()">Isi Ulang Data</button>
      </div>
    </div>
  `,
  styles: `
    .inventory-box { padding: 1rem; border: 1px solid #cbd5e1; border-radius: 8px; max-width: 420px; }
    .item-row { margin-bottom: 0.5rem; list-style: none; }
    .badge { background: #e2e8f0; padding: 2px 6px; border-radius: 4px; margin-right: 6px; font-size: 0.8rem; }
    .last-tag { color: #0284c7; font-size: 0.8rem; margin-left: 6px; }
    .empty-state { color: #dc2626; list-style: none; padding: 0.5rem 0; font-weight: 500; }
  `
})
export class ControlForDemoComponent {
  items = signal<ProductItem[]>([
    { id: 101, name: 'Monitor LED 24"', stock: 8 },
    { id: 102, name: 'Keyboard Mechanical', stock: 15 },
    { id: 103, name: 'Mouse Wireless', stock: 20 }
  ]);

  kosongkan() {
    this.items.set([]);
  }

  isiUlang() {
    this.items.set([
      { id: 101, name: 'Monitor LED 24"', stock: 8 },
      { id: 102, name: 'Keyboard Mechanical', stock: 15 }
    ]);
  }
}
```

### Hasil

**Kondisi awal:**
```text
Inventaris Gudang (Total: 3)
• [#1] Monitor LED 24" (Stok: 8)
• [#2] Keyboard Mechanical (Stok: 15)
• [#3] Mouse Wireless (Stok: 20) ← Terakhir
[ Kosongkan Stok ] [ Isi Ulang Data ]
```

**Setelah klik "Kosongkan Stok":**
```text
Inventaris Gudang (Total: 0)
• 📦 Seluruh stok produk kosong!
[ Kosongkan Stok ] [ Isi Ulang Data ]
```

### Kesalahan Umum

❌ Menggunakan `$index` sebagai `track` pada data dinamis yang sering ditambah/dihapus:
```html
<!-- ❌ Berisiko bug rendering jika urutan berubah -->
@for (item of items(); track $index)
```

✅ Gunakan ID unik dari data objek:
```html
<!-- ✅ Rekomendasi performa optimal -->
@for (item of items(); track item.id)
```

**Kunci:** `@for (item of list; track item.id)` melakukan perulangan array berkinerja tinggi dengan fallback otomatis `@empty`.

---

<a id="bagian-9"></a>

## 9. 🟢 Built-in Control Flow: Seleksi Multi-Kondisi (@switch, @case)

### Konsep

Blok `@switch` menyederhanakan evaluasi multi-kondisi diskrit dengan memeriksa satu nilai terhadap berbagai kemungkinan `@case`, serta menyediakan blok fallback `@default`.

Sintaks ini jauh lebih rapi dan efisien dibanding menulis rantai `@if` dan `@else if` yang bersarang.

### Contoh

```typescript
import { Component, signal } from '@angular/core';

type PaketStatus = 'pending' | 'process' | 'shipped' | 'delivered';

@Component({
  selector: 'app-control-switch-demo',
  standalone: true,
  template: `
    <div class="tracker-box">
      <h3>Status Pelacakan Pengiriman</h3>

      <!-- Seleksi Multi-Kondisi Deklaratif -->
      @switch (currentStatus()) {
        @case ('pending') {
          <div class="badge status-yellow">⏳ Menunggu Konfirmasi Penjual</div>
        }
        @case ('process') {
          <div class="badge status-blue">📦 Pesanan Sedang Dikemas</div>
        }
        @case ('shipped') {
          <div class="badge status-purple">🚚 Paket Sedang Diantar Kurir</div>
        }
        @case ('delivered') {
          <div class="badge status-green">✅ Paket Telah Diterima Pembeli</div>
        }
        @default {
          <div class="badge status-gray">Status Tidak Dikenali</div>
        }
      }

      <div class="control-buttons">
        <button (click)="setStatus('process')">Kemas</button>
        <button (click)="setStatus('shipped')">Kirim</button>
        <button (click)="setStatus('delivered')">Sampai</button>
      </div>
    </div>
  `,
  styles: `
    .tracker-box { padding: 1.25rem; border: 1px solid #cbd5e1; border-radius: 8px; max-width: 380px; }
    .badge { padding: 0.5rem 1rem; border-radius: 6px; font-weight: 600; margin-bottom: 1rem; }
    .status-yellow { background: #fef9c3; color: #854d0e; }
    .status-blue { background: #dbeafe; color: #1e40af; }
    .status-purple { background: #f3e8ff; color: #6b21a8; }
    .status-green { background: #dcfce7; color: #166534; }
    .status-gray { background: #f1f5f9; color: #475569; }
    .control-buttons button { margin-right: 0.5rem; padding: 0.35rem 0.75rem; cursor: pointer; }
  `
})
export class ControlSwitchDemoComponent {
  currentStatus = signal<PaketStatus>('pending');

  setStatus(val: PaketStatus) {
    this.currentStatus.set(val);
  }
}
```

### Hasil

**Kondisi awal:**
```text
Status Pelacakan Pengiriman
[ ⏳ Menunggu Konfirmasi Penjual ]
[ Kemas ] [ Kirim ] [ Sampai ]
```

**Setelah klik "Kirim":**
```text
Status Pelacakan Pengiriman
[ 🚚 Paket Sedang Diantar Kurir ]
[ Kemas ] [ Kirim ] [ Sampai ]
```

**Kunci:** `@switch` mengevaluasi nilai terhadap `@case` dan mengeksekusi `@default` jika tidak ada kondisi yang terpenuhi.

---

<a id="bagian-10"></a>

## 10. 🟢 Komunikasi Komponen: Menerima Data via input()

### Konsep

Pada Angular modern, komunikasi satu arah dari komponen induk (*Parent*) ke komponen anak (*Child*) menggunakan fungsi **Signal Inputs**: `input()` dan `input.required()`.

##### Karakteristik Signal Inputs:
- Menggantikan dekorator lama `@Input()`.
- Menghasilkan **Read-Only Signal** di komponen anak.
- Komponen anak tidak diizinkan mengubah nilai input secara langsung (menjaga prinsip *One-Way Data Flow*).
- Komponen anak dapat langsung membuat derived state menggunakan `computed()` dari nilai `input()`.

##### Diagram Aliran Data

```text
Parent Component (State)
       │
       │ [title]="myTitle()"  (Mengirim data via Property Binding)
       ▼
Child Component (input.required<string>())
```

### Contoh

1. **Komponen Anak (`src/app/badge.component.ts`)**:

```typescript
import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-user-badge',
  standalone: true,
  template: `
    <div class="badge-card" [class.vip-tier]="isVip()">
      <h4>{{ userName() }}</h4>
      <p>Skor: {{ points() }} | Level: <strong>{{ levelName() }}</strong></p>
    </div>
  `,
  styles: `
    .badge-card { padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 6px; margin-bottom: 0.5rem; }
    .vip-tier { background: #fef08a; border-color: #ca8a04; }
  `
})
export class UserBadgeComponent {
  // Input wajib (Required)
  userName = input.required<string>();

  // Input opsional dengan nilai default
  points = input<number>(0);
  isVip = input<boolean>(false);

  // Derived state dari input signal
  levelName = computed(() => (this.points() >= 100 ? 'Master' : 'Beginner'));
}
```

2. **Komponen Induk (`src/app/dashboard.component.ts`)**:

```typescript
import { Component, signal } from '@angular/core';
import { UserBadgeComponent } from './badge.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [UserBadgeComponent], // Wajib didaftarkan di imports
  template: `
    <section>
      <h2>Panel Dashboard Anggota</h2>
      <app-user-badge 
        [userName]="currentUser()" 
        [points]="userPoints()" 
        [isVip]="true" 
      />
    </section>
  `
})
export class DashboardComponent {
  currentUser = signal('Siti Nurhaliza');
  userPoints = signal(120);
}
```

### Hasil

**Output visual di browser:**
```text
Panel Dashboard Anggota
┌──────────────────────────────────────────┐
│ Siti Nurhaliza                           │
│ Skor: 120 | Level: Master                │
└──────────────────────────────────────────┘
```

### Kesalahan Umum

❌ Mencoba memutasi properti `input()` di komponen anak:
```typescript
// ❌ Error TypeScript: Left-hand side cannot be assigned / Input signal is read-only
this.points.set(200); 
```

**Kunci:** `input.required<T>()` dan `input<T>(defaultValue)` menerima data dari parent sebagai Read-Only Signal.

---

<a id="bagian-11"></a>

## 11. 🟢 Komunikasi Komponen: Mengirim Event via output()

### Konsep

Untuk mengirim sinyal, event, atau data dari komponen anak kembali ke komponen induk, Angular menyediakan fungsi **`output()`**.

Fungsi `output()` menggantikan dekorator `@Output()` dan `new EventEmitter()` dengan sintaks fungsional yang lebih bersih dan aman secara tipe data.

##### Diagram Aliran Event

```text
Child Component: this.hapusEvent.emit(id)
                     │
                     │ (hapusEvent)="onHapus($event)"
                     ▼
Parent Component: update signal array
```

### Contoh

1. **Komponen Anak (`src/app/todo-item.component.ts`)**:

```typescript
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  template: `
    <div class="todo-row">
      <span>{{ taskTitle() }}</span>
      <button class="del-btn" (click)="kirimHapus()">✕ Hapus</button>
    </div>
  `,
  styles: `
    .todo-row { display: flex; justify-content: space-between; padding: 0.5rem; border-bottom: 1px solid #e2e8f0; }
    .del-btn { background: #fee2e2; color: #dc2626; border: none; padding: 2px 8px; border-radius: 4px; cursor: pointer; }
  `
})
export class TodoItemComponent {
  id = input.required<number>();
  taskTitle = input.required<string>();

  // Mendefinisikan output channel
  itemDeleted = output<number>();

  kirimHapus() {
    // Memancarkan nilai ID ke parent
    this.itemDeleted.emit(this.id());
  }
}
```

2. **Komponen Induk (`src/app/todo-list.component.ts`)**:

```typescript
import { Component, signal } from '@angular/core';
import { TodoItemComponent } from './todo-item.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [TodoItemComponent],
  template: `
    <div class="list-card">
      <h3>Daftar Rencana Harian</h3>
      @for (t of tasks(); track t.id) {
        <app-todo-item 
          [id]="t.id" 
          [taskTitle]="t.title" 
          (itemDeleted)="handleHapus($event)" 
        />
      }
    </div>
  `
})
export class TodoListComponent {
  tasks = signal([
    { id: 1, title: 'Mempelajari Standalone Components' },
    { id: 2, title: 'Menguasai Angular Signals' }
  ]);

  handleHapus(id: number) {
    this.tasks.update(list => list.filter(t => t.id !== id));
  }
}
```

### Hasil

**Kondisi awal:**
```text
Daftar Rencana Harian
• Mempelajari Standalone Components   [ ✕ Hapus ]
• Menguasai Angular Signals           [ ✕ Hapus ]
```

**Setelah tombol hapus pada item pertama diklik:**
```text
Daftar Rencana Harian
• Menguasai Angular Signals           [ ✕ Hapus ]
```

**Kunci:** `output<T>()` membuat event emitter modern, dipancarkan via `.emit(data)` dan ditangkap parent via `(namaOutput)="handler($event)"`.

---

<a id="bagian-12"></a>

## 12. 🟢 Two-Way Binding Komponen Modern dengan model()

### Konsep

Fungsi **`model()`** adalah fitur modern Angular untuk membangun **Two-Way Binding antar-komponen kustom** secara otomatis.

##### Perbedaan `input()` vs `model()`:
- `input()`: Komunikasi 1 arah (Parent $\rightarrow$ Child). Di sisi Child bersifat *Read-Only Signal*.
- `model()`: Komunikasi 2 arah (Parent $\leftrightarrow$ Child). Di sisi Child bersifat *Writable Signal*. Ketika Child mengubah nilai via `.set()` atau `.update()`, Parent otomatis mendapatkan nilai terbaru melalui sintaks `[(namaModel)]`.

##### Diagram *Banana-in-a-Box* Antar-Komponen

```text
Parent Component [ (darkMode) ] ◄── Sinkronisasi 2 Arah ──► Child Component (model())
```

### Contoh

1. **Komponen Anak (`src/app/custom-toggle.component.ts`)**:

```typescript
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-custom-toggle',
  standalone: true,
  template: `
    <button class="toggle-btn" (click)="toggle()">
      Status Fitur: <strong>{{ checked() ? 'AKTIF 🟢' : 'NONAKTIF 🔴' }}</strong>
    </button>
  `,
  styles: `
    .toggle-btn { padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid #cbd5e1; cursor: pointer; }
  `
})
export class CustomToggleComponent {
  // Two-way binding signal model
  checked = model<boolean>(false);

  toggle() {
    this.checked.update(val => !val);
  }
}
```

2. **Komponen Induk (`src/app/settings-page.component.ts`)**:

```typescript
import { Component, signal } from '@angular/core';
import { CustomToggleComponent } from './custom-toggle.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CustomToggleComponent],
  template: `
    <div class="settings-box">
      <h2>Pengaturan Mode Gelap</h2>
      
      <!-- Sintaks Banana-in-a-box [()] langsung ke Signal Parent -->
      <app-custom-toggle [(checked)]="isDarkTheme" />

      <p>Nilai Terbaca di Parent: <code>{{ isDarkTheme() }}</code></p>
    </div>
  `
})
export class SettingsPageComponent {
  isDarkTheme = signal(false);
}
```

### Hasil

**Kondisi awal:**
```text
Pengaturan Mode Gelap
[ Status Fitur: NONAKTIF 🔴 ]
Nilai Terbaca di Parent: false
```

**Setelah tombol toggle diklik di komponen anak:**
```text
Pengaturan Mode Gelap
[ Status Fitur: AKTIF 🟢 ]
Nilai Terbaca di Parent: true
```

**Kunci:** `model()` di Child berpasangan dengan `[(modelName)]` di Parent untuk menyinkronkan data dua arah secara otomatis.

---

<a id="bagian-13"></a>

## 13. 🟡 Form Input & Two-Way Binding [(ngModel)]

### Konsep

Untuk elemen form HTML standar (`<input>`, `<textarea>`, `<select>`), Angular menyediakan pendekatan **Template-driven Forms** menggunakan direktif `[(ngModel)]` yang berasal dari paket `@angular/forms` (`FormsModule`).

> [!IMPORTANT]
> **Pembeda Konsep:**
> 1. `[(ngModel)]`: Digunakan khusus untuk elemen HTML native form `<input>` dengan modul `FormsModule`.
> 2. `model()`: Fungsi modern Angular untuk membuat kontrak two-way binding pada komponen kustom buatan Anda sendiri.

### Contoh

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Wajib diimpor di array imports

@Component({
  selector: 'app-form-demo',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="form-container">
      <h3>Form Biodata Singkat</h3>

      <div class="field">
        <label>Nama Lengkap:</label>
        <input type="text" [(ngModel)]="fullName" placeholder="Masukkan nama..." />
      </div>

      <div class="field">
        <label>Kota Asal:</label>
        <select [(ngModel)]="selectedCity">
          <option value="Jakarta">Jakarta</option>
          <option value="Surabaya">Surabaya</option>
          <option value="Bandung">Bandung</option>
        </select>
      </div>

      <div class="field">
        <label>
          <input type="checkbox" [(ngModel)]="isSubscribed" />
          Langganan Newsletter
        </label>
      </div>

      <hr />

      <div class="live-preview">
        <h4>Pratinjau Data Realtime:</h4>
        <p>Nama: <strong>{{ fullName }}</strong></p>
        <p>Kota: <strong>{{ selectedCity }}</strong></p>
        <p>Status Langganan: <strong>{{ isSubscribed ? 'Ya ✅' : 'Tidak ❌' }}</strong></p>
      </div>
    </div>
  `,
  styles: `
    .form-container { padding: 1.25rem; border: 1px solid #cbd5e1; border-radius: 8px; max-width: 420px; }
    .field { margin-bottom: 0.75rem; }
    .field label { display: block; margin-bottom: 0.25rem; font-weight: 500; }
    .field input[type="text"], .field select { width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px; box-sizing: border-box; }
    .live-preview { background: #f8fafc; padding: 0.75rem; border-radius: 6px; }
  `
})
export class FormDemoComponent {
  fullName: string = 'Raden Saleh';
  selectedCity: string = 'Bandung';
  isSubscribed: boolean = true;
}
```

### Hasil

**Tampilan awal form:**
```text
Form Biodata Singkat
Nama Lengkap: [ Raden Saleh           ]
Kota Asal:    [ Bandung             ▼ ]
[x] Langganan Newsletter
----------------------------------------
Pratinjau Data Realtime:
Nama: Raden Saleh
Kota: Bandung
Status Langganan: Ya ✅
```

### Kesalahan Umum

❌ Lupa mengimpor `FormsModule` pada array `imports` di dekorator `@Component`:
```typescript
// ❌ Error runtime di browser: Can't bind to 'ngModel' since it isn't a known property of 'input'
@Component({
  standalone: true,
  imports: [], // Lupa menambahkan FormsModule!
  ...
})
```

✅ Selalu sertakan `FormsModule` di array `imports`.

**Kunci:** Gunakan `[(ngModel)]` bersama `FormsModule` untuk two-way binding cepat pada form input standar.

---

<a id="bagian-14"></a>

## 14. 🟡 Dasar Reactive Forms (FormControl & FormGroup Sederhana)

### Konsep

Untuk form kompleks di aplikasi skala besar, **Reactive Forms** (`ReactiveFormsModule`) memisahkan pengelolaan state, sinkronisasi nilai, dan aturan validasi langsung ke dalam objek model TypeScript.

##### Elemen Utama Reactive Forms:
- `FormControl`: Mengelola nilai individual dan status validasi satu field input.
- `FormGroup`: Mengelompokkan sekumpulan `FormControl` menjadi satu objek form terpadu.
- `Validators`: Koleksi fungsi validasi bawaan (misal: `Validators.required`, `Validators.email`, `Validators.minLength`).

##### Status Form Bawaan:
- `.valid` / `.invalid`: Menandakan apakah seluruh aturan validasi terpenuhi.
- `.touched`: Bernilai `true` jika user sudah pernah mengklik dan keluar dari input tersebut (*blur*).
- `.dirty`: Bernilai `true` jika user sudah pernah mengubah isi teks input.

### Contoh

```typescript
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-reactive-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="login-card">
      <h3>Masuk ke Akun</h3>

      <form [formGroup]="loginForm" (ngSubmit)="handleLogin()">
        <div class="form-group">
          <label>Email Pengguna:</label>
          <input type="email" formControlName="email" placeholder="user@mail.com" />
          @if (loginForm.controls.email.invalid && loginForm.controls.email.touched) {
            <small class="error-msg">Format email tidak valid atau belum diisi.</small>
          }
        </div>

        <div class="form-group">
          <label>Password:</label>
          <input type="password" formControlName="password" placeholder="Minimal 6 karakter" />
          @if (loginForm.controls.password.invalid && loginForm.controls.password.touched) {
            <small class="error-msg">Password wajib diisi minimal 6 karakter.</small>
          }
        </div>

        <button type="submit" [disabled]="loginForm.invalid">
          Login Sekarang
        </button>
      </form>
    </div>
  `,
  styles: `
    .login-card { padding: 1.5rem; border: 1px solid #cbd5e1; border-radius: 8px; max-width: 360px; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.25rem; font-size: 0.9rem; }
    .form-group input { width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px; box-sizing: border-box; }
    .error-msg { color: #dc2626; font-size: 0.8rem; margin-top: 0.25rem; display: block; }
    button { width: 100%; padding: 0.6rem; background: #2563eb; color: #fff; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; }
    button:disabled { background: #94a3b8; cursor: not-allowed; }
  `
})
export class ReactiveLoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  handleLogin() {
    if (this.loginForm.valid) {
      console.log('Payload Login:', this.loginForm.value);
    }
  }
}
```

### Hasil

**Kondisi awal form (Tombol login nonaktif):**
```text
Masuk ke Akun
Email Pengguna: [                      ]
Password:       [                      ]
[ Login Sekarang (Disabled) ]
```

**Ketika email diketik salah dan keluar dari field (*touched*):**
```text
Masuk ke Akun
Email Pengguna: [ bukan-email          ]
⚠️ Format email tidak valid atau belum diisi.
Password:       [                      ]
[ Login Sekarang (Disabled) ]
```

**Kunci:** `ReactiveFormsModule` menyediakan form yang *type-safe*, mudah diuji secara terpisah (*unit test*), dan memiliki validasi terpusat di TypeScript.

---

<a id="bagian-15"></a>

## 15. 🟡 Dependency Injection & Service Modern dengan inject()

### Konsep

**Dependency Injection (DI)** adalah pola arsitektur di mana sebuah class menerima dependensi (seperti *Service*) dari luar sistem, alih-alih membuat instance objeknya sendiri secara manual (`new Service()`).

##### Keuntungan DI di Angular:
- **Singleton Scope**: Service yang didaftarkan dengan `@Injectable({ providedIn: 'root' })` hanya dibuat **satu kali** (*single instance*) untuk seluruh aplikasi, menghemat memori dan memudahkan sinkronisasi data global.
- **Fungsi `inject()` Modern**: Menggantikan deklarasi panjang di constructor sehingga kode komponen jauh lebih ringkas.

##### Diagram Alur Pengambilan Service via DI

```text
Service Class (@Injectable providedIn: 'root')
                    │
                    │ Dikelola oleh Angular Root Injector
                    ▼
Komponen: private logService = inject(LoggerService)
```

### Contoh

1. **Service Logger (`src/app/services/logger.service.ts`)**:

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Tersedia global sebagai Singleton
})
export class LoggerService {
  info(pesan: string) {
    const waktu = new Date().toLocaleTimeString();
    console.log(`[${waktu}] ℹ️ LOG: ${pesan}`);
  }
}
```

2. **Komponen Pengguna Service (`src/app/order-button.component.ts`)**:

```typescript
import { Component, inject } from '@angular/core';
import { LoggerService } from './services/logger.service';

@Component({
  selector: 'app-order-button',
  standalone: true,
  template: `
    <div class="order-box">
      <button (click)="prosesPesanan()">Buat Pesanan Baru</button>
    </div>
  `
})
export class OrderButtonComponent {
  // Mengambil dependensi menggunakan inject() fungsional modern
  private logger = inject(LoggerService);

  prosesPesanan() {
    this.logger.info('Pesanan #9981 berhasil dibuat oleh user.');
  }
}
```

### Hasil

**Ketika tombol "Buat Pesanan Baru" diklik di browser:**

```text
[22:15:30] ℹ️ LOG: Pesanan #9981 berhasil dibuat oleh user.
```

### Best Practice

- Gunakan fungsi `inject(ServiceName)` modern alih-alih constructor injection `constructor(private logger: LoggerService) {}`.
- Selalu gunakan `providedIn: 'root'` untuk Service umum agar Angular dapat melakukan *tree-shaking* otomatis pada bundle produksi.

**Kunci:** `inject()` mengambil instance Service yang dikelola secara terpusat oleh Angular Dependency Injection.

---

<a id="bagian-16"></a>

## 16. 🟡 Mengambil Data Backend dengan HTTP Client Dasar

### Konsep

Untuk berkomunikasi dengan REST API backend (GET, POST, PUT, DELETE), Angular menyediakan layanan resmi `HttpClient`.

##### Pola Arsitektur Konsumsi API yang Baik:

```text
Komponen (UI & Signal State)
       │
       ▼ (Memanggil method service)
Service (HttpClient & Transformasi Data)
       │
       ▼ (HTTP GET Request)
REST API Backend (JSON Response)
```

##### Konfigurasi Global `provideHttpClient()`
Pada aplikasi Standalone, `HttpClient` diaktifkan di file `src/app/app.config.ts` menggunakan fungsi `provideHttpClient()`.

### Contoh

1. **Konfigurasi `src/app/app.config.ts`**:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient() // Mengaktifkan client HTTP di aplikasi
  ]
};
```

2. **Service Pengambil Data (`src/app/services/user-api.service.ts`)**:

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface UserItem {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  getUsers() {
    // Mengembalikan Observable data array UserItem
    return this.http.get<UserItem[]>(`${this.apiUrl}?_limit=3`);
  }
}
```

3. **Komponen Penampil Data (`src/app/user-list.component.ts`)**:

```typescript
import { Component, inject, signal, OnInit } from '@angular/core';
import { UserApiService, UserItem } from './services/user-api.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  template: `
    <div class="api-card">
      <h3>Daftar Pengguna dari Server</h3>

      @if (isLoading()) {
        <p class="loading-state">⏳ Sedang mengambil data dari API...</p>
      } @else {
        <ul>
          @for (user of users(); track user.id) {
            <li>
              <strong>{{ user.name }}</strong> ({{ user.email }})
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: `
    .api-card { padding: 1.25rem; border: 1px solid #cbd5e1; border-radius: 8px; max-width: 450px; }
    .loading-state { color: #0284c7; font-style: italic; }
  `
})
export class UserListComponent implements OnInit {
  private userApi = inject(UserApiService);

  users = signal<UserItem[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    // Memanggil API saat komponen pertama kali diinisialisasi
    this.userApi.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error mengambil API:', err);
        this.isLoading.set(false);
      }
    });
  }
}
```

### Hasil

**Saat awal memuat data:**
```text
Daftar Pengguna dari Server
⏳ Sedang mengambil data dari API...
```

**Setelah data berhasil diterima dari server:**
```text
Daftar Pengguna dari Server
• Leanne Graham (Sincere@april.biz)
• Ervin Howell (Shanna@melissa.tv)
• Clementine Bauch (Nathan@yesenia.net)
```

**Kunci:** Pisahkan logika komunikasi HTTP ke dalam Service terpisah, lalu konsumsi hasilnya di komponen untuk memperbarui state Signal.

---

<a id="bagian-17"></a>

## 17. 🟡 Lifecycle Hooks Esensial (ngOnInit & ngOnDestroy)

### Konsep

Setiap komponen Angular memiliki siklus hidup (*lifecycle*) mulai dari pembuatan instance, inisialisasi input, rendering tampilan, hingga penghancuran dari DOM.

##### Dua Lifecycle Hook Paling Penting:
1. **`ngOnInit()`**:
   - Dijalankan **1 kali** tepat setelah komponen selesai diinisialisasi dan seluruh nilai `input()` pertama diterima.
   - Tempat terbaik untuk inisialisasi data, pemanggilan API, atau setup awal.
2. **`ngOnDestroy()`**:
   - Dijalankan tepat sebelum elemen komponen dihancurkan dan dihapus dari DOM.
   - Tempat wajib untuk membersihkan timer (`clearInterval`), melepaskan listener manual, atau membatalkan langganan stream demi mencegah kebocoran memori (*memory leak*).

##### Diagram Siklus Hidup

```text
Constructor Component
        │
        ▼
Inisialisasi Input Props
        │
        ▼
ngOnInit()  ──► [ Ideal untuk Fetch Data API & Inisialisasi ]
        │
        ▼
Rendering DOM & Interaksi Pengguna
        │
        ▼
ngOnDestroy() ──► [ Wajib untuk Cleanup Timer / Subscriptions ]
        │
        ▼
Komponen Dihapus dari DOM
```

### Contoh

```typescript
import { Component, OnInit, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-timer-demo',
  standalone: true,
  template: `
    <div class="timer-box">
      <h3>Detik Berjalan: {{ seconds() }}s</h3>
      <p>Komponen ini aktif dan memperbarui state setiap detik.</p>
    </div>
  `,
  styles: `
    .timer-box { padding: 1rem; border: 1px solid #cbd5e1; border-radius: 8px; max-width: 320px; }
  `
})
export class TimerDemoComponent implements OnInit, OnDestroy {
  seconds = signal(0);
  private intervalId: any;

  ngOnInit() {
    console.log('[LIFECYCLE] ngOnInit: Timer dimulai.');
    this.intervalId = setInterval(() => {
      this.seconds.update(s => s + 1);
    }, 1000);
  }

  ngOnDestroy() {
    console.log('[LIFECYCLE] ngOnDestroy: Membersihkan timer.');
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
```

### Hasil

**Console Log saat komponen muncul:**
```text
[LIFECYCLE] ngOnInit: Timer dimulai.
```

**Console Log saat komponen ditutup/dihancurkan:**
```text
[LIFECYCLE] ngOnDestroy: Membersihkan timer.
```

**Kunci:** Gunakan `ngOnInit` untuk inisialisasi data dan `ngOnDestroy` untuk membersihkan proses latar belakang agar tidak terjadi *memory leak*.

---

<a id="bagian-18"></a>

## 18. 🟡 Content Projection Sederhana (<ng-content>)

### Konsep

**Content Projection** adalah mekanisme untuk memasukkan potongan HTML kustom dari komponen induk ke dalam *slot* yang telah disediakan oleh komponen anak (analog dengan `<slot>` pada Vue atau `children` pada React).

Angular menggunakan tag bawaan **`<ng-content />`**.

##### Multi-Slot Projection via Atribut Selector
Kita dapat menyediakan beberapa slot berbeda pada satu komponen anak dengan memberikan filter atribut: `<ng-content select="[card-header]" />`.

##### Diagram Content Projection

```text
Parent Template:
  <app-ui-card>
    <h3 card-header>Judul Kustom</h3>  ───► Masuk ke slot: select="[card-header]"
    <p>Isi paragraf bebas...</p>         ───► Masuk ke slot default: <ng-content />
  </app-ui-card>
```

### Contoh

1. **Komponen Pembungkus Kartu (`src/app/ui-card.component.ts`)**:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-ui-card',
  standalone: true,
  template: `
    <div class="card-wrapper">
      <!-- Slot Khusus Header -->
      <div class="card-header">
        <ng-content select="[card-header]" />
      </div>

      <!-- Slot Default Isi Konten -->
      <div class="card-body">
        <ng-content />
      </div>
    </div>
  `,
  styles: `
    .card-wrapper { border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; max-width: 380px; }
    .card-header { background: #f1f5f9; padding: 0.75rem 1rem; border-bottom: 1px solid #cbd5e1; font-weight: bold; }
    .card-body { padding: 1rem; }
  `
})
export class UiCardComponent {}
```

2. **Penggunaan di Komponen Induk (`src/app/home-page.component.ts`)**:

```typescript
import { Component } from '@angular/core';
import { UiCardComponent } from './ui-card.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [UiCardComponent],
  template: `
    <app-ui-card>
      <span card-header>📢 Pengumuman Rilis</span>
      <p>Angular modern kini hadir dengan Standalone & Signals bawaan yang sangat cepat dan menyenangkan!</p>
    </app-ui-card>
  `
})
export class HomePageComponent {}
```

### Hasil

**Output yang dirender di browser:**
```text
┌──────────────────────────────────────────┐
│ 📢 Pengumuman Rilis                      │
├──────────────────────────────────────────┤
│ Angular modern kini hadir dengan         │
│ Standalone & Signals bawaan yang sangat  │
│ cepat dan menyenangkan!                  │
└──────────────────────────────────────────┘
```

**Kunci:** `<ng-content />` membuat komponen anak fleksibel menerima konten HTML apa pun dari komponen induk.

---

<a id="bagian-19"></a>

## 19. 🛠️ Peta Ingatan, Cheat Code 10 Detik & Tabel Komparasi

### Peta Ingatan Konsep Angular Modern

```text
Angular Modern
├── Komponen (Building Blocks)
│   ├── Standalone Decorator (@Component({ standalone: true }))
│   ├── Data Binding ({{ }}, [property], (event))
│   └── Content Projection (<ng-content>)
├── Reaktivitas & State Lokal
│   ├── Writable Signal (signal, set, update)
│   └── Derived State (computed dengan caching otomatis)
├── Kontrol Alur Deklaratif
│   ├── Percabangan: @if / @else if / @else
│   ├── Perulangan: @for (track, @empty)
│   └── Multi-Kondisi: @switch / @case / @default
├── Komunikasi Antar-Komponen
│   ├── input() / input.required() (Parent -> Child)
│   ├── output() (Child -> Parent Event)
│   └── model() (Two-Way Synchronization)
└── Layanan & Arsitektur
    ├── Dependency Injection (inject())
    ├── Singleton Service (@Injectable providedIn: 'root')
    └── Client REST API (provideHttpClient & HttpClient)
```

### Tabel Komparasi Sintaks: Angular vs Vue vs React

| Fitur / Konsep | Angular Modern | Vue 3 (Composition API) | React (Hooks) |
|---|---|---|---|
| **Deklarasi Komponen** | `@Component({ standalone: true })` | `<script setup>` | `function MyComponent()` |
| **State Reaktif Lokal** | `count = signal(0)` | `const count = ref(0)` | `const [count, setCount] = useState(0)` |
| **Membaca Nilai State** | `count()` | `count.value` (JS) / `count` (HTML) | `count` |
| **Mengubah Nilai State** | `count.set(1)` / `count.update(n => n + 1)` | `count.value = 1` | `setCount(1)` / `setCount(n => n + 1)` |
| **Derived State (Caching)** | `total = computed(() => count() * 2)` | `const total = computed(() => count.value * 2)` | `const total = useMemo(() => count * 2, [count])` |
| **Kondisional Tampilan** | `@if (isReady()) { ... }` | `<div v-if="isReady">` | `{isReady ? <div /> : null}` |
| **Perulangan List** | `@for (item of list(); track item.id)` | `<div v-for="item in list" :key="item.id">` | `{list.map(item => <div key={item.id} />)}` |
| **Menerima Data Parent** | `title = input.required<string>()` | `defineProps<{ title: string }>()` | `function Comp({ title })` |
| **Kirim Event ke Parent** | `saved = output<number>()` | `const emit = defineEmits(['saved'])` | `function Comp({ onSaved })` |
| **Two-Way Binding** | `active = model<boolean>(false)` | `const active = defineModel<boolean>()` | *Manual Prop + Callback* |
| **Dependency Injection** | `private api = inject(ApiService)` | `const api = inject('apiKey')` | `const api = useContext(ApiContext)` |

### Cheat Code Angular 10 Detik

```text
signal(val)                 → membuat state reaktif lokal
mySignal()                  → membaca nilai signal
mySignal.set(val)           → menimpa nilai signal secara langsung
mySignal.update(fn)         → memperbarui nilai signal berdasarkan nilai lama
computed(() => val)         → state turunan yang otomatis sinkron & cached
@if (kondisi) { }           → percabangan template deklaratif
@for (item of list; track item.id) → perulangan list dengan identifier unik
input() / input.required()  → menerima properti dari parent (read-only signal)
output()                    → memancarkan event ke parent
model()                     → two-way binding antar-komponen kustom
inject(Service)             → mengambil service singleton tanpa constructor
```

---

<a id="bagian-20"></a>

## 20. 🛠️ Mini Project: Task & Habit Tracker CLI-Like Web App

### Deskripsi Proyek
Membangun aplikasi web **Interactive Task & Habit Tracker** mandiri yang mengintegrasikan:
- Standalone Component hierarkis (Parent App + Child Task Item).
- State lokal menggunakan **Signals & Computed**.
- Kontrol alur template modern (`@if`, `@for` dengan `track`, `@empty`).
- Komunikasi komponen menggunakan `input()` dan `output()`.
- Service arsitektur dengan fungsi `inject()`.
- Penyimpanan lokal (*LocalStorage persistence*) menggunakan `effect()`.

```text
┌────────────────────────────────────────────────────────┐
│              Task & Habit Tracker (Angular)            │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [ Input Judul Task... ]  [ + Tambah ]            │  │
│  └──────────────────────────────────────────────────┘  │
│  Total: 3 | Selesai: 1 | Belum: 2                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [x] Belajar Standalone Component      [ Hapus ]  │  │
│  │ [ ] Menguasai Signals Reactivity      [ Hapus ]  │  │
│  │ [ ] Menggunakan Built-in Control Flow [ Hapus ]  │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### Langkah 1: Model Data (`src/app/models/task.model.ts`)

```typescript
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}
```

### Langkah 2: Task Service (`src/app/services/task.service.ts`)

```typescript
import { Injectable, signal, effect } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private STORAGE_KEY = 'angular_tasks_data';

  // State Utama menggunakan Writable Signal
  tasks = signal<Task[]>(this.loadFromStorage());

  constructor() {
    // Sinkronisasi otomatis ke LocalStorage setiap kali signal tasks berubah
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks()));
    });
  }

  addTask(title: string) {
    if (!title.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      createdAt: new Date()
    };
    this.tasks.update(list => [newTask, ...list]);
  }

  toggleTask(id: string) {
    this.tasks.update(list =>
      list.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  deleteTask(id: string) {
    this.tasks.update(list => list.filter(t => t.id !== id));
  }

  private loadFromStorage(): Task[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) {
      return [
        { id: '1', title: 'Pahami Mental Model Standalone', completed: true, createdAt: new Date() },
        { id: '2', title: 'Eksperimen dengan Signals & Computed', completed: false, createdAt: new Date() }
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

### Langkah 3: Komponen Anak Task Item (`src/app/components/task-item.component.ts`)

```typescript
import { Component, input, output } from '@angular/core';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  template: `
    <div class="task-card" [class.done]="task().completed">
      <label class="task-label">
        <input 
          type="checkbox" 
          [checked]="task().completed" 
          (change)="toggle.emit(task().id)" 
        />
        <span class="title-text">{{ task().title }}</span>
      </label>
      
      <button class="delete-btn" (click)="delete.emit(task().id)">✕ Hapus</button>
    </div>
  `,
  styles: `
    .task-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      margin-bottom: 0.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      background: #ffffff;
      transition: all 0.2s ease;
    }
    .task-card.done {
      background: #f8fafc;
      opacity: 0.7;
    }
    .task-card.done .title-text {
      text-decoration: line-through;
      color: #94a3b8;
    }
    .task-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
    }
    .delete-btn {
      background: #fee2e2;
      color: #ef4444;
      border: none;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      cursor: pointer;
    }
    .delete-btn:hover { background: #fecaca; }
  `
})
export class TaskItemComponent {
  task = input.required<Task>();
  toggle = output<string>();
  delete = output<string>();
}
```

### Langkah 4: Komponen Utama (`src/app/app.component.ts`)

```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from './services/task.service';
import { TaskItemComponent } from './components/task-item.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, TaskItemComponent],
  template: `
    <main class="app-container">
      <header class="app-header">
        <h1>🎯 Task & Habit Tracker</h1>
        <p class="subtitle">Dibangun dengan Angular Standalone & Signals</p>
      </header>

      <!-- Form Input Task -->
      <section class="form-section">
        <input 
          type="text" 
          [(ngModel)]="rawTitle" 
          placeholder="Tulis target atau tugas baru..."
          (keyup.enter)="submitTask()" 
        />
        <button (click)="submitTask()" [disabled]="!rawTitle.trim()">
          + Tambah Tugas
        </button>
      </section>

      <!-- Statistik Derived State (Computed Signals) -->
      <section class="stats-bar">
        <span>Total: <strong>{{ totalCount() }}</strong></span>
        <span>Selesai: <strong>{{ completedCount() }}</strong></span>
        <span>Tersisa: <strong>{{ remainingCount() }}</strong></span>
      </section>

      <!-- Daftar List dengan Built-in Control Flow -->
      <section class="list-section">
        @for (item of taskService.tasks(); track item.id) {
          <app-task-item 
            [task]="item" 
            (toggle)="taskService.toggleTask($event)"
            (delete)="taskService.deleteTask($event)"
          />
        } @empty {
          <div class="empty-box">
            <p>🎉 Belum ada tugas! Tambahkan tugas pertama Anda di atas.</p>
          </div>
        }
      </section>
    </main>
  `,
  styles: `
    .app-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 1.5rem;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      font-family: system-ui, -apple-system, sans-serif;
    }
    .app-header { text-align: center; margin-bottom: 1.5rem; }
    .subtitle { color: #64748b; font-size: 0.9rem; margin-top: -0.5rem; }
    .form-section { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .form-section input {
      flex: 1;
      padding: 0.6rem 0.8rem;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
    }
    .form-section button {
      padding: 0.6rem 1.2rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
    }
    .form-section button:disabled { background: #94a3b8; cursor: not-allowed; }
    .stats-bar {
      display: flex;
      justify-content: space-around;
      padding: 0.75rem;
      background: #f1f5f9;
      border-radius: 6px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }
    .empty-box {
      text-align: center;
      padding: 2rem;
      color: #64748b;
      border: 2px dashed #cbd5e1;
      border-radius: 8px;
    }
  `
})
export class AppComponent {
  taskService = inject(TaskService);

  // Properti model form biasa untuk [(ngModel)]
  rawTitle = '';

  // Derived State (Computed Signals)
  totalCount = computed(() => this.taskService.tasks().length);
  completedCount = computed(() => this.taskService.tasks().filter(t => t.completed).length);
  remainingCount = computed(() => this.totalCount() - this.completedCount());

  submitTask() {
    if (this.rawTitle.trim()) {
      this.taskService.addTask(this.rawTitle);
      this.rawTitle = ''; // Reset input field
    }
  }
}
```

---

<a id="bagian-21"></a>

## 21. 🧭 Urutan Belajar yang Disarankan & Referensi Resmi

### Urutan Langkah Belajar Selanjutnya

```text
1. Pahami Mental Model Standalone & Signals
   ↓
2. Latih Component Communication (input/output/model)
   ↓
3. Kerjakan Mini Project Task Tracker
   ↓
4. Lanjut ke Modul Navigasi: [[angular-routing|Angular Routing]]
   ↓
5. Lanjut ke Modul State Lanjutan & Async Stream: [[angular-state|Angular State]]
```

### Referensi Resmi

- **Dokumentasi Resmi Angular**: [https://angular.dev](https://angular.dev)
- **Panduan Standalone Components**: [https://angular.dev/guide/components](https://angular.dev/guide/components)
- **Panduan Angular Signals**: [https://angular.dev/guide/signals](https://angular.dev/guide/signals)
- **Panduan Built-in Control Flow**: [https://angular.dev/guide/templates/control-flow](https://angular.dev/guide/templates/control-flow)
- **Panduan Signal Inputs & Outputs**: [https://angular.dev/guide/components/inputs](https://angular.dev/guide/components/inputs)
- **CLI Command Reference**: [https://angular.dev/tools/cli](https://angular.dev/tools/cli)
