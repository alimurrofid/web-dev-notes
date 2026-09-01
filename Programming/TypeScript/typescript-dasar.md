---
title: "TypeScript Dasar"
description: "Dasar TypeScript: static typing, primitive types, array & tuple, object types, type inference, union & literal types, dan interface dasar."
order: 1
tags:
  - programming
  - typescript
  - frontend
  - backend
  - fundamental
---

# TypeScript Dasar

> **Target:** Pemula yang telah memahami JavaScript modern (ES6+) dan ingin menguasai **Sistem Tipe Statis TypeScript 5.5+ (Kompilator `tsc`, `tsconfig.json` Strict Mode, Tipe Primitif & Khusus `unknown`/`never`/`any`, Arrays & Tuples, Object Modifiers `readonly`/`?`, `type` vs `interface`, Union & Intersection `|`/`&`, Literal Types & `as const`, Discriminated Unions, Function Overloading, Type Assertions, dan Type Narrowing / Custom Type Guards `val is Type`)**.
>
> Fokus cheatsheet ini: **mental model Static Typing & Type Erasure → `tsc` & `tsconfig.json` → Tipe Primitif → `unknown` vs `any` vs `never` (Exhaustiveness checking) → Inference vs Annotation → Arrays & Tuples → Object Types → `type` vs `interface` (Declaration Merging) → Unions & Intersections → `as const` → Discriminated Unions → Functions & Overloading → Type Assertions → Narrowing (`typeof`, `instanceof`, `in`) → Custom Type Guards (`val is Type`) → Assertion Functions (`asserts val is Type`) → mini project Type-Safe User Management & Order Processing Engine**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: Static Typing vs Type Erasure, tsconfig.json, Primitive Types, unknown vs any vs never, Arrays, Tuples, dan Type Aliases

🟡 Lanjutan
→ pelajari setelah fundamental nyaman: Interfaces (extends & declaration merging), Unions/Intersections, as const, Discriminated Unions, dan Function Overloading

🔴 Advanced / Operasional
→ penting untuk type safety maksimal: Type Narrowing (typeof/instanceof/in), Custom Type Guards (val is Type), dan Assertion Functions (asserts)
```

Mental model alur kompilasi dan penghapusan tipe (*Type Erasure*) di TypeScript:

```text
              KODE TYPESCRIPT (.ts) (Dengan Anotasi Tipe Statis)
                               │
                               ▼
              1. TYPESCRIPT COMPILER (tsc) TYPE CHECKING
           (Memvalidasi aturan tipe & mendeteksi bug compile-time)
                               │
                ┌──────────────┴──────────────┐
                ▼ Ada Error Tipe              ▼ Bebas Error Tipe
         Tolak Kompilasi               2. TYPE ERASURE PROSES
         (Tampilkan Pesan Error)       (Semua interface, type, & anotasi dihapus)
                                              │
                                              ▼
                                       KODE JAVASCRIPT MURNI (.js)
                                              │
                                              ▼
                                       EKSEKUSI DI RUNTIME
                                  (Node.js / Bun / Browser V8)
```

**Hafalan:**

```text
Static Typing at Compile Time → pengecekan tipe data yang dilakukan saat kompilasi sebelum kode dijalankan di browser/server
Type Erasure                  → proses penghapusan seluruh anotasi tipe TypeScript saat dikonversi menjadi JavaScript murni
tsconfig.json                → berkas konfigurasi root kompilator TypeScript (mengatur strict mode, target JS, modul)
any                           → tipe pelarian yang mematikan seluruh pemeriksaan tipe (hindari penggunaan di production)
unknown                       → tipe data tidak diketahui yang aman karena mewajibkan type narrowing sebelum dieksekusi
never                         → tipe data yang merepresentasikan nilai yang tidak akan pernah terjadi (exhaustiveness check)
as const                      → const assertion untuk mengunci seluruh nilai objek/array menjadi tipe literal readonly
Discriminated Union           → pola pemodelan data aman di mana beberapa interface berbagi satu properti pembeda literal unik (tag)
Type Narrowing                → teknik mempersempit tipe data yang luas menjadi tipe spesifik di dalam blok percabangan if
Custom Type Guard (val is T)  → fungsi predikat boolean yang mengajarkan compiler untuk mempersempit tipe variabel
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan TypeScript 5 & Mental Model Static Typing](#bagian-1)
2. [Tooling Kompilator `tsc` & Konfigurasi `tsconfig.json`](#bagian-2)
3. [Tipe Primitif Inti](#bagian-3)
4. [Tipe Khusus: `any`, `unknown`, `never`, dan `void`](#bagian-4)
5. [Type Inference vs Explicit Type Annotation](#bagian-5)
6. [Arrays & Tuples](#bagian-6)
7. [Object Types & Properti Modifiers](#bagian-7)
8. [Type Aliases (`type`)](#bagian-8)

### 🟡 Lanjutan

9. [Interfaces (`interface`) & Pewarisan (`extends`)](#bagian-9)
10. [Perbandingan Mendalam: Kapan Memilih `type` vs `interface`](#bagian-10)
11. [Union Types (`|`) & Intersection Types (`&`)](#bagian-11)
12. [Literal Types & Const Assertions (`as const`)](#bagian-12)
13. [Discriminated Unions (Tagged Unions)](#bagian-13)
14. [Anotasi Fungsi: Parameters, Return Types & Optional Params](#bagian-14)
15. [Rest Parameters & Function Type Signatures](#bagian-15)
16. [Function Overloading](#bagian-16)
17. [Type Assertions (`as Type`) & Non-null Assertion Operator (`!`)](#bagian-17)

### 🔴 Advanced / Operasional

18. [Type Narrowing Dasar dengan `typeof`, `instanceof`, dan Operator `in`](#bagian-18)
19. [Custom User-Defined Type Guards (`value is Type`)](#bagian-19)
20. [Assertion Functions (`asserts value is Type`)](#bagian-20)

### 🛠️ Referensi & Praktik

21. [Peta Ingatan Cepat](#bagian-21)
22. [Tabel Ringkasan](#bagian-22)
23. [Cheat Code TypeScript Dasar 10 Detik](#bagian-23)
24. [Urutan Belajar yang Disarankan](#bagian-24)
25. [Mini Project: Production-Ready Type-Safe User Management, Role-Based Access & E-Commerce Order Processing Engine](#bagian-25)
26. [Referensi Resmi](#bagian-26)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan TypeScript 5 & Mental Model Static Typing

#### Konsep

JavaScript adalah bahasa **Dynamically Typed**: tipe data baru diketahui saat program berjalan di runtime (*Runtime Evaluation*). Ini sering memicu error legendaris `TypeError: Cannot read properties of undefined`.

**TypeScript** adalah **Superset JavaScript dengan Static Typing**:
- Menambahkan lapisan sistem tipe di atas JavaScript standar.
- Memeriksa kebenaran tipe **saat proses coding / kompilasi (*Compile Time*)**.
- **Type Erasure:** Seluruh tipe data, interface, dan generic akan dihapus 100% saat di-compile ke `.js`, sehingga **tidak menambah beban ukuran file atau memori di runtime**.

#### Cara Kerja

```text
JavaScript Biasa:
const user = { name: "Budi" };
console.log(user.email.toLowerCase()); ──> Crash di Browser Runtime: TypeError! ❌

TypeScript:
interface User { name: string; email?: string }
const user: User = { name: "Budi" };
console.log(user.email.toLowerCase()); ──> Compiler Langsung Beri Garis Merah: "Object is possibly 'undefined'" ✅
```

**Hafalan:**

```text
TypeScript = JavaScript + Static Type System (Di-compile menjadi JavaScript murni via Type Erasure)
```

---

<a id="bagian-2"></a>

## 2. 🟢 Tooling Kompilator `tsc` & Konfigurasi `tsconfig.json`

#### Konsep

Kompilator resmi TypeScript adalah **`tsc` (*TypeScript Compiler*)**.

Inisialisasi Project TypeScript:
```bash
npm init -y
npm install -D typescript
npx tsc --init
```

Konfigurasi Standar Produksi Modern (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "target": "ES2022",                /* Versi output JavaScript modern */
    "module": "ESNext",                /* Modul import/export modern */
    "moduleResolution": "bundler",     /* Resolusi modul untuk Vite/Webpack/Nuxt/Next */
    "strict": true,                    /* WAJIB: Mengaktifkan seluruh strict type checking rules */
    "noImplicitAny": true,             /* Melarang variabel tanpa tipe menjadi any secara diam-diam */
    "strictNullChecks": true,          /* Memperlakukan null dan undefined secara ketat */
    "skipLibCheck": true,              /* Mempercepat build dengan melewati cek deklarasi library */
    "outDir": "./dist"                 /* Folder output file JS yang dihasilkan */
  },
  "include": ["src/**/*"]
}
```

**Hafalan:**

```text
npx tsc --init   → membuat file konfigurasi tsconfig.json baru
strict: true     → opsi wajib tsconfig.json untuk mengaktifkan keamanan tipe maksimal
```

---

<a id="bagian-3"></a>

## 3. 🟢 Tipe Primitif Inti

#### Konsep

TypeScript mendukung 7 tipe data primitif bawaan JavaScript:

1. **`string`:** Teks karakter (`"Halo"`, `'Dunia'`, `` `Nilai: ${val}` ``).
2. **`number`:** Seluruh angka bulat dan desimal floating point (`42`, `3.14`, `-10`).
3. **`boolean`:** Nilai kebenaran logika (`true` atau `false`).
4. **`null`:** Representasi nilai kosong yang disengaja.
5. **`undefined`:** Variabel yang belum diinisialisasi nilai.
6. **`symbol`:** Pengenal unik mutlak (`Symbol("key")`).
7. **`bigint`:** Angka bilangan bulat sangat besar di atas $2^{53} - 1$ (`100n`).

#### Contoh

```typescript
let username: string = "alimur_dev"
let age: number = 25
let isSubscribed: boolean = true
let emptyValue: null = null
let notAssigned: undefined = undefined
let bigId: bigint = 9007199254740995n
```

**Hafalan:**

```text
string, number, boolean, null, undefined, bigint, symbol → 7 tipe data primitif dasar TypeScript
```

---

<a id="bagian-4"></a>

## 4. 🟢 Tipe Khusus: `any`, `unknown`, `never`, dan `void`

#### Konsep

Empat tipe khusus yang paling sering disalahpahami oleh pemula:

| Tipe Khusus | Karakteristik & Aturan Penggunaan | Tingkat Keamanan |
|---|---|---|
| **`any`** | Mematikan seluruh sistem tipe. Mengizinkan pemanggilan properti/method apa saja tanpa validasi. | ❌ **Sangat Berbahaya (Hindari!)** |
| **`unknown`** | Menerima tipe data apa saja, **namun MELARANG eksekusi properti/method sebelum dilakukan pengecekan tipe (*Type Narrowing*)**. | ✅ **Sangat Aman (Alternatif `any`)** |
| **`void`** | Digunakan sebagai return type fungsi yang **tidak mengembalikan nilai apa pun** (misal: `console.log`). | ✅ Standar Fungsi |
| **`never`** | Merepresentasikan nilai yang **tidak akan pernah ada** (fungsi melempar error, infinite loop, atau unhandled branch). | ✅ Sangat Berguna |

#### Contoh

```typescript
// 1. unknown vs any
let inputUnknown: unknown = "Halo Dunia"
// inputUnknown.toUpperCase() ❌ ERROR: 'inputUnknown' is of type 'unknown'

if (typeof inputUnknown === "string") {
    // ✅ Aman setelah diperiksa:
    console.log(inputUnknown.toUpperCase())
}

// 2. void vs never
function logActivity(msg: string): void {
    console.log(`[LOG] ${msg}`)
}

function panicAndCrash(errorMsg: string): never {
    throw new Error(`Fatal Error: ${errorMsg}`)
}
```

**Hafalan:**

```text
unknown → tipe data aman untuk nilai dinamis (wajib diperiksa dengan typeof sebelum digunakan)
never   → tipe data untuk fungsi yang melempar error atau percabangan yang tidak mungkin terjadi
```

---

<a id="bagian-5"></a>

## 5. 🟢 Type Inference vs Explicit Type Annotation

#### Konsep

1. **Type Inference (Penyimpulan Otomatis):**
   - TypeScript cukup pintar untuk menebak tipe data secara otomatis berdasarkan nilai awal yang di-assign.
   - **Best Practice:** Biarkan compiler menyimpulkan tipe untuk variabel lokal sederhana.
2. **Explicit Type Annotation (Anotasi Eksplisit):**
   - Wajib digunakan saat: mendeklarasikan parameter fungsi, return type fungsi publik, variabel yang diinisialisasi nanti, atau objek kompleks.

#### Contoh

```typescript
// ✅ Type Inference Otomatis: tipe variabel ini otomatis 'number'
let counter = 10 

// ✅ Explicit Annotation: Wajib pada parameter fungsi
function multiply(x: number, y: number): number {
    return x * y
}
```

**Hafalan:**

```text
let x = 10         → Type Inference (otomatis disimpulkan number)
let x: number = 10 → Explicit Type Annotation (dinyatakan manual)
```

---

<a id="bagian-6"></a>

## 6. 🟢 Arrays & Tuples

#### Konsep

1. **Typed Array:**
   - Menyimpan kumpulan elemen dengan tipe seragam (`number[]` atau `Array<string>`).
   - `readonly T[]` : Mencegah mutasi array (`.push()`, `.pop()` akan ditolak compiler).
2. **Tuples:**
   - Array dengan **jumlah elemen tetap** dan **tipe data pada setiap posisi indeks telah ditentukan secara spesifik**.

#### Contoh

```typescript
// 1. Arrays
const skills: string[] = ["TypeScript", "Vue", "PostgreSQL"]
const immutableScores: readonly number[] = [90, 85, 95]
// immutableScores.push(100) ❌ ERROR: Property 'push' does not exist on 'readonly number[]'

// 2. Tuples: [Latitude, Longitude, CityName]
let coordinate: [number, number, string] = [-6.2088, 106.8456, "Jakarta"]
console.log(`Kota: ${coordinate[2]}, Lat: ${coordinate[0]}`)
```

**Hafalan:**

```text
T[]                  → array dinamis dengan elemen bertipe T
[typeA, typeB]       → tuple dengan panjang dan susunan tipe indeks yang pasti
readonly T[]         → array yang terkunci dari mutasi method push/pop
```

---

<a id="bagian-7"></a>

## 7. 🟢 Object Types & Properti Modifiers

#### Konsep

Mendefinisikan bentuk objek (*Shape of Object*) beserta modifiernya:
- **`readonly prop`:** Nilai properti tidak dapat diubah setelah inisialisasi awal.
- **`prop?: type`:** Properti opsional (bisa bernilai `type` atau `undefined`).

#### Contoh

```typescript
type Product = {
    readonly id: string      // Tidak bisa diubah (Immutable ID)
    name: string
    price: number
    description?: string     // Opsional
}

const laptop: Product = {
    id: "prod-101",
    name: "ThinkPad X1 Carbon",
    price: 25000000
}

// laptop.id = "prod-999" ❌ ERROR: Cannot assign to 'id' because it is a read-only property
```

**Hafalan:**

```text
{ readonly id: string; name: string; age?: number } → struktur objek dengan modifier readonly dan opsional
```

---

<a id="bagian-8"></a>

## 8. 🟢 Type Aliases (`type`)

#### Konsep

Keyword **`type`** digunakan untuk memberi nama pada sembarang tipe data (Objek, Primitif, Union, Tuple, atau Function Signature).

#### Contoh

```typescript
// 1. Type Alias untuk Objek
type Coordinates = { x: number; y: number }

// 2. Type Alias untuk Primitif / ID
type UserID = string

// 3. Type Alias untuk Function Signature
type MathOperation = (a: number, b: number) => number

const add: MathOperation = (a, b) => a + b
```

**Hafalan:**

```text
type TypeName = Definition; → membuat alias nama untuk sembarang tipe data di TypeScript
```

---

<a id="bagian-9"></a>

## 9. 🟡 Interfaces (`interface`) & Pewarisan (`extends`)

#### Konsep

Keyword **`interface`** khusus digunakan untuk mendefinisikan **kontrak bentuk objek**.

Keunggulan Interface:
- Mendukung pewarisan hierarkis menggunakan keyword **`extends`**.
- Dapat diimplementasikan oleh Class di OOP (`class MyClass implements MyInterface`).

#### Contoh

```typescript
interface Person {
    id: string
    name: string
    email: string
}

// Mewarisi seluruh properti dari Person dan menambah properti baru
interface Employee extends Person {
    department: string
    salary: number
}

const staff: Employee = {
    id: "emp-01",
    name: "Siti Rahma",
    email: "siti@kantor.com",
    department: "Engineering",
    salary: 15000000
}
```

**Hafalan:**

```text
interface ChildInterface extends ParentInterface { newProp: type } → mewarisi kontrak bentuk objek
```

---

<a id="bagian-10"></a>

## 10. 🟡 Perbandingan Mendalam: Kapan Memilih `type` vs `interface`

#### Konsep

Keduanya sering kali dapat digunakan bergantian untuk mendefinisikan objek, namun memiliki perbedaan krusial:

| Fitur | `interface` | `type` (Type Alias) |
|---|---|---|
| **Tujuan Utama** | Kontrak bentuk Objek & Class OOP. | Alias untuk semua hal (Objek, Primitif, Union, Tuple). |
| **Pewarisan** | `extends` | Intersection `&` |
| **Declaration Merging** | ✅ **BISA** (Otomatis menggabungkan interface bernama sama). | ❌ **TIDAK BISA** (Error: Duplicate identifier). |
| **Union (`\|`) Langsung** | ❌ Tidak bisa | ✅ **Bisa (`type Status = 'A' \| 'B'`)** |

> [!TIP]
> **Panduan Praktis:**
> - Gunakan **`interface`** untuk mendefinisikan struktur data model aplikasi, class, atau saat membuat library (karena mendukung *Declaration Merging*).
> - Gunakan **`type`** untuk Unions (`|`), Intersections (`&`), Tuples, Primitives, dan manipulasi tipe lanjutan.

#### Contoh Declaration Merging pada Interface

```typescript
// File 1 (Window dasar)
interface AppConfig {
    appName: string
}

// File 2 (Modul tambahan memperluas interface yang sama tanpa mengedit file 1)
interface AppConfig {
    version: string
}

// Hasilnya digabung otomatis:
const config: AppConfig = {
    appName: "Enterprise App",
    version: "1.0.0"
}
```

**Hafalan:**

```text
interface → gunakan untuk objek publik dan kontrak class (mendukung declaration merging)
type      → gunakan untuk union literals, tuples, primitif, dan transformasi tipe
```

---

<a id="bagian-11"></a>

## 11. 🟡 Union Types (`|`) & Intersection Types (`&`)

#### Konsep

1. **Union Types (`A | B`):**
   - Nilai variabel boleh berupa tipe A **ATAU** tipe B.
2. **Intersection Types (`A & B`):**
   - Nilai variabel harus memiliki **SEMUA properti milik tipe A DAN tipe B**.

#### Contoh

```typescript
// 1. Union: ID bisa berupa String atau Number
type Identifier = string | number

function printId(id: Identifier) {
    console.log(`ID: ${id}`)
}

// 2. Intersection: Menggabungkan profil dasar dengan izin akses
type Timestamps = { createdAt: Date; updatedAt: Date }
type Account = { username: string; email: string }

type FullAccountRecord = Account & Timestamps

const userAccount: FullAccountRecord = {
    username: "budi",
    email: "budi@mail.com",
    createdAt: new Date(),
    updatedAt: new Date()
}
```

**Hafalan:**

```text
typeA | typeB → Union (nilai adalah salah satu dari tipe)
typeA & typeB → Intersection (menggabungkan seluruh properti kedua tipe menjadi satu)
```

---

<a id="bagian-12"></a>

## 12. 🟡 Literal Types & Const Assertions (`as const`)

#### Konsep

1. **Literal Types:**
   - Membatasi nilai variabel bukan sekadar `string` sembarang, melainkan hanya string tertentu (misal: `"GET" | "POST"`).
2. **Const Assertion (`as const`):**
   - Mengubah seluruh properti objek/array menjadi tipe literal yang **`readonly` secara mendalam (*Deep Readonly*)**.

#### Contoh

```typescript
// 1. String Literal Union
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

function requestApi(url: string, method: HttpMethod) { /* ... */ }
// requestApi("/users", "FETCH") ❌ ERROR: Argument of type '"FETCH"' is not assignable to parameter of type 'HttpMethod'

// 2. as const Assertion
const THEME_CONFIG = {
    mode: "dark",
    primaryColor: "#00dc82",
    fontSize: 16
} as const

// THEME_CONFIG.mode = "light" ❌ ERROR: Cannot assign to 'mode' because it is a read-only property
```

**Hafalan:**

```text
type Status = "ACTIVE" | "INACTIVE" → Literal Type (hanya menerima string spesifik)
const obj = { k: "v" } as const     → mengunci seluruh nilai properti objek menjadi literal readonly
```

---

<a id="bagian-13"></a>

## 13. 🟡 Discriminated Unions (Tagged Unions)

#### Konsep

**Discriminated Union** adalah pola pemodelan data paling aman dan elegan di TypeScript:
- Menggabungkan beberapa interface berbeda yang memiliki **satu properti pembeda bersama (*Discriminant Tag*)** berupa string literal unik (misal: `status` atau `kind`).
- Memungkinkan TypeScript melakukan **Narrowing otomatis 100% aman** di dalam blok `switch` atau `if`.

#### Contoh

```typescript
interface NetworkLoadingState {
    status: "LOADING"
}

interface NetworkSuccessState {
    status: "SUCCESS"
    data: string[]
}

interface NetworkErrorState {
    status: "ERROR"
    errorMessage: string
}

type NetworkState = NetworkLoadingState | NetworkSuccessState | NetworkErrorState

function renderUI(state: NetworkState) {
    switch (state.status) {
        case "LOADING":
            return "⏳ Memuat data..."
        case "SUCCESS":
            // ✅ TypeScript tahu pasti bahwa 'data' ada di sini!
            return `✅ Berhasil: ${state.data.join(", ")}`
        case "ERROR":
            // ✅ TypeScript tahu pasti bahwa 'errorMessage' ada di sini!
            return `❌ Gagal: ${state.errorMessage}`
    }
}
```

**Hafalan:**

```text
Discriminated Union → union objek yang memiliki satu properti tag pembeda literal bersama untuk narrowing otomatis
```

---

<a id="bagian-14"></a>

## 14. 🟡 Anotasi Fungsi: Parameters, Return Types & Optional Params

#### Konsep

Menuliskan tipe pada fungsi:
- Parameter opsional wajib diletakkan **setelah** parameter wajib.
- Parameter dengan nilai default otomatis bersifat opsional.

#### Contoh

```typescript
function createGreeting(name: string, title?: string, uppercase: boolean = false): string {
    const full = title ? `${title} ${name}` : name
    return uppercase ? full.toUpperCase() : full
}

console.log(createGreeting("Budi", "Dr.")) // Hasil: "Dr. Budi"
```

**Hafalan:**

```text
function fn(param1: type, param2?: optType): returnType { return val; }
```

---

<a id="bagian-15"></a>

## 15. 🟡 Rest Parameters & Function Type Signatures

#### Konsep

1. **Rest Parameters:** Mengumpulkan sisa argumen tak terbatas ke dalam bentuk array bertipe (`...numbers: number[]`).
2. **Function Type Signatures:** Mendefinisikan tipe fungsi sebagai variabel callback.

#### Contoh

```typescript
// 1. Rest Parameters
function sumAllNumbers(...numbers: number[]): number {
    return numbers.reduce((acc, curr) => acc + curr, 0)
}

// 2. Callback Signature
type FilterPredicate<T> = (item: T) => boolean

function customFilter<T>(items: T[], predicate: FilterPredicate<T>): T[] {
    return items.filter(predicate)
}
```

**Hafalan:**

```text
function fn(...args: number[]): number          → rest parameter dengan elemen bertipe number
type CallbackType = (arg: string) => void       → signature tipe fungsi callback
```

---

<a id="bagian-16"></a>

## 16. 🟡 Function Overloading

#### Konsep

**Function Overloading** digunakan saat sebuah fungsi dapat menerima kombinasi parameter yang berbeda dan menghasilkan tipe return yang berbeda tergantung inputnya.

Struktur Overloading:
1. **Overload Signatures (1 atau lebih):** Deklarasi tipe tanpa body fungsi.
2. **Implementation Signature:** Body fungsi nyata yang menangani semua variasi parameter.

#### Contoh

```typescript
// 1. Overload Signatures:
function formatInput(value: string): string
function formatInput(value: number): string
function formatInput(value: boolean): string

// 2. Implementation Signature:
function formatInput(value: string | number | boolean): string {
    if (typeof value === "string") {
        return `[Teks] ${value.trim()}`
    } else if (typeof value === "number") {
        return `[Angka] Rp ${value.toLocaleString('id-ID')}`
    } else {
        return `[Status] ${value ? "AKTIF" : "NON-AKTIF"}`
    }
}

const resString = formatInput("  Halo  ") // Tipe return: string
const resNumber = formatInput(500000)     // Tipe return: string
```

**Hafalan:**

```text
function fn(a: string): string; function fn(a: number): number; function fn(a: any): any { ... }
```

---

<a id="bagian-17"></a>

## 17. 🟡 Type Assertions (`as Type`) & Non-null Assertion Operator (`!`)

#### Konsep

1. **Type Assertion (`as Type`):**
   - Memberi tahu compiler: *"Percayalah, saya tahu tipe variabel ini lebih spesifik daripada perkiraanmu"*.
   - **Bukan type conversion/casting di runtime!** (Tidak mengubah data JavaScript asli).
2. **Non-null Assertion Operator (`!`):**
   - Memberi tahu compiler bahwa nilai variabel dijamin **tidak mungkin `null` atau `undefined`**.

> [!CAUTION]
> Gunakan Type Assertion dan `!` sehemat mungkin. Jika salah menebak, aplikasi akan crash di runtime!

#### Contoh

```typescript
// 1. DOM Element Type Assertion
const emailInput = document.getElementById("user-email") as HTMLInputElement
console.log(emailInput.value)

// 2. Non-null Assertion Operator (!)
function findUser(id: string): string | undefined { return "Budi" }
const foundUserName: string = findUser("101")! // Memaksa compiler percaya bahwa return bukan undefined
```

**Hafalan:**

```text
val as SpecificType → Type Assertion (meyakinkan compiler tentang tipe spesifik)
val!                → Non-null Assertion (menghilangkan kemungkinan null / undefined)
```

---

<a id="bagian-18"></a>

## 18. 🔴 Type Narrowing Dasar dengan `typeof`, `instanceof`, dan Operator `in`

#### Konsep

**Type Narrowing** adalah proses di mana TypeScript secara otomatis menganalisis alur logika kode Anda (*Control Flow Analysis*) untuk menyempitkan tipe variabel:

1. **`typeof v === "string"`:** Untuk memeriksa tipe primitif (`string`, `number`, `boolean`, `symbol`, `bigint`, `undefined`).
2. **`v instanceof Date`:** Untuk memeriksa apakah objek merupakan instance dari Class atau Constructor.
3. **`"propertyName" in object`:** Untuk memeriksa keberadaan properti spesifik pada objek.

#### Contoh

```typescript
interface AdminAccount {
    username: string
    privileges: string[]
}

interface CustomerAccount {
    username: string
    loyaltyPoints: number
}

function processAccount(account: AdminAccount | CustomerAccount) {
    // Narrowing menggunakan operator 'in'
    if ("privileges" in account) {
        // Di sini account otomatis bertipe AdminAccount!
        console.log(`Admin ${account.username} memiliki ${account.privileges.length} hak akses.`)
    } else {
        // Di sini account otomatis bertipe CustomerAccount!
        console.log(`Customer ${account.username} memiliki ${account.loyaltyPoints} poin.`)
    }
}
```

**Hafalan:**

```text
typeof val === 'string'  → narrowing untuk tipe primitif
val instanceof MyClass   → narrowing untuk instance Class objek
'prop' in obj            → narrowing untuk memeriksa keberadaan properti objek
```

---

<a id="bagian-19"></a>

## 19. 🔴 Custom User-Defined Type Guards (`value is Type`)

#### Konsep

Jika logika pemeriksaan tipe Anda sangat kompleks dan ingin dipisahkan ke fungsi terpisah:
Fungsi JavaScript boolean biasa **tidak akan menyempitkan tipe data** di luar fungsinya.

**Solusi: Custom Type Guard**:
Fungsi yang mengembalikan predikat tipe: **`function isType(val: unknown): val is TargetType`**.
- Jika fungsi mengembalikan `true`, TypeScript **otomatis mengubah tipe `val` menjadi `TargetType`** pada blok percabangan pemanggilnya!

#### Contoh

```typescript
interface ApiResponseSuccess {
    status: 200
    payload: { id: string; title: string }
}

// Custom Type Guard Function
function isApiSuccess(res: unknown): res is ApiResponseSuccess {
    return (
        typeof res === "object" &&
        res !== null &&
        "status" in res &&
        (res as any).status === 200 &&
        "payload" in res
    )
}

// Penggunaan:
function handleResponse(response: unknown) {
    if (isApiSuccess(response)) {
        // ✅ TypeScript 100% yakin response memiliki .payload.title!
        console.log("Judul:", response.payload.title)
    } else {
        console.log("Respon bukan sukses.")
    }
}
```

**Hafalan:**

```text
function isUser(val: unknown): val is User { return ...; } → Custom Type Guard untuk narrowing kustom
```

---

<a id="bagian-20"></a>

## 20. 🔴 Assertion Functions (`asserts value is Type`)

#### Konsep

**Assertion Function** adalah fungsi khusus yang memvalidasi kondisi atau tipe data:
- Jika kondisi tidak terpenuhi, fungsi akan **melempar exception error (`throw new Error`)**.
- Jika tidak ada error, TypeScript **otomatis menyempitkan tipe variabel pada baris-baris kode di bawahnya** tanpa memerlukan blok `if/else`.

Format:
`function assertIsDefined<T>(val: T): asserts val is NonNullable<T>`

#### Contoh

```typescript
// Assertion Function
function assertIsString(val: unknown, varName: string): asserts val is string {
    if (typeof val !== "string") {
        throw new Error(`Validasi Gagal: Variabel '${varName}' harus bertipe string!`)
    }
}

function processInput(input: unknown) {
    // Sebelum baris ini, input bertipe 'unknown'
    assertIsString(input, "userInput")
    
    // ✅ Setelah baris di atas, TypeScript otomatis tahu input adalah 'string'!
    console.log(input.trim().toUpperCase())
}
```

**Hafalan:**

```text
function assert(val: unknown): asserts val is Type { if (!valid) throw Error(); } → assertion function
```

---

<a id="bagian-21"></a>

## 21. 🛠️ Peta Ingatan Cepat

```text
                     PETA ARSITEKTUR TYPESCRIPT DASAR
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
TYPE SYSTEM CORE             OBJECTS & CONTRACTS         TYPE NARROWING & GUARDS
├─ Primitive Types           ├─ type vs interface        ├─ typeof, instanceof, in
├─ unknown vs any vs never   ├─ readonly & optional (?)  ├─ Discriminated Unions
├─ Arrays T[] & Tuples       ├─ Union (|) & Intersect (&)├─ Custom Guard (val is T)
└─ Type Inference            └─ as const assertions      └─ Assertion (asserts val is T)
```

---

<a id="bagian-22"></a>

## 22. 📚 Tabel Ringkasan

| Fitur / Keyword | Kategori | Fungsi & Karakteristik Utama |
|---|---|---|
| `unknown` | Tipe Data | Alternatif aman `any` yang mewajibkan type checking sebelum dieksekusi |
| `never` | Tipe Data | Representasi nilai yang tidak pernah terjadi (Exhaustiveness checking) |
| `readonly` | Modifier | Mengunci nilai properti atau array dari modifikasi mutasi |
| `type` | Definisi Tipe | Memberi nama alias untuk tipe primitif, union, tuple, atau objek |
| `interface` | Definisi Tipe | Kontrak bentuk objek yang mendukung `extends` dan Declaration Merging |
| `as const` | Assertion | Mengunci objek/array menjadi tipe literal konstan secara mendalam |
| `Union (|)` | Operasi Tipe | Mengizinkan variabel bernilai salah satu dari kumpulan tipe |
| `Intersection (&)`| Operasi Tipe | Menggabungkan seluruh properti dari beberapa tipe menjadi satu |
| `val is Type` | Type Guard | Predikat fungsi boolean untuk mempersempit tipe data kustom |
| `asserts val is T`| Assertion | Memvalidasi dan menyempitkan tipe pada baris-baris eksekusi berikutnya |

---

<a id="bagian-23"></a>

## 23. ⚡ Cheat Code TypeScript Dasar 10 Detik

```typescript
// 1. Template Discriminated Union
type AsyncResult<T> = 
  | { status: "SUCCESS"; data: T }
  | { status: "ERROR"; error: string }

// 2. Template Custom Type Guard
function isSuccess<T>(res: AsyncResult<T>): res is { status: "SUCCESS"; data: T } {
  return res.status === "SUCCESS"
}

// 3. Template as const Configuration
const APP_ROLES = ["ADMIN", "CUSTOMER", "STAFF"] as const
type AppRole = typeof APP_ROLES[number] // 'ADMIN' | 'CUSTOMER' | 'STAFF'
```

---

<a id="bagian-24"></a>

## 24. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Setup Tooling & Tipe Primitif
├── Konfigurasi tsconfig.json dengan opsi strict: true
└── Pahami perbedaan krusial unknown vs any vs never
       │
       ▼
Langkah 2: Pemodelan Struktur Objek & Kontrak
├── Kuasai Array, Tuple, dan modifier readonly / opsional (?)
└── Pahami kapan menggunakan type vs interface (extends & declaration merging)
       │
       ▼
Langkah 3: Tipe Literal & Discriminated Unions
├── Kunci konfigurasi konstan menggunakan as const
└── Modelkan state aplikasi dengan aman via Discriminated Unions
       │
       ▼
Langkah 4: Kontrol Alur & Type Narrowing Tingkat Tinggi
├── Saring tipe dengan typeof, instanceof, dan operator in
└── Buat fungsi Custom Type Guard (val is Type) dan Assertion Functions
       │
       ▼
Langkah 5: Siap Melangkah ke TypeScript OOP, Generics & Utility Types!
```

---

<a id="bagian-25"></a>

## 25. 🏗️ Mini Project: Production-Ready Type-Safe User Management, Role-Based Access & E-Commerce Order Processing Engine

Aplikasi TypeScript lengkap, modern, dan runnable yang mengintegrasikan: **Discriminated Unions untuk Status Pembayaran, Custom Type Guards untuk Validasi Payload, `as const` Constants, Interface Inheritance, Function Overloading, dan Exhaustiveness Checking `never`**.

```typescript
// =========================================================================
// 1. DOMAIN MODELS & CONSTANTS
// =========================================================================

// Roles Konstan dengan as const
export const USER_ROLES = ["CUSTOMER", "VENDOR", "ADMIN"] as const
export type UserRole = typeof USER_ROLES[number]

// Interface Induk Entitas Dasar
export interface BaseEntity {
    readonly id: string
    createdAt: Date
}

// Interface User dengan Pewarisan
export interface User extends BaseEntity {
    name: string
    email: string
    role: UserRole
    isActive: boolean
}

// Item Pesanan
export interface OrderItem {
    readonly productId: string
    name: string
    price: number
    quantity: number
}

// =========================================================================
// 2. DISCRIMINATED UNIONS UNTUK PAYMENT PROCESSING STATE
// =========================================================================

export interface PaymentPending {
    status: "PENDING"
    paymentUrl: string
    expiresAt: Date
}

export interface PaymentSuccess {
    status: "PAID"
    transactionId: string
    paidAt: Date
    amountPaid: number
}

export interface PaymentFailed {
    status: "FAILED"
    failureCode: string
    reason: string
}

export type PaymentState = PaymentPending | PaymentSuccess | PaymentFailed

export interface Order extends BaseEntity {
    customer: User
    items: OrderItem[]
    totalAmount: number
    payment: PaymentState
}

// =========================================================================
// 3. CUSTOM TYPE GUARDS & ASSERTION FUNCTIONS
// =========================================================================

// Type Guard untuk Memeriksa Apakah User adalah Admin
export function isAdminUser(user: User): user is User & { role: "ADMIN" } {
    return user.role === "ADMIN" && user.isActive
}

// Custom Type Guard untuk Memvalidasi Payload Order Item dari Input Luar
export function isValidOrderItem(item: unknown): item is OrderItem {
    return (
        typeof item === "object" &&
        item !== null &&
        "productId" in item &&
        "name" in item &&
        "price" in item &&
        "quantity" in item &&
        typeof (item as any).price === "number" &&
        (item as any).price > 0 &&
        typeof (item as any).quantity === "number" &&
        (item as any).quantity > 0
    )
}

// Assertion Function untuk Memastikan Pesanan Sudah Dibayar
export function assertOrderIsPaid(order: Order): asserts order is Order & { payment: PaymentSuccess } {
    if (order.payment.status !== "PAID") {
        throw new Error(`Pesanan ${order.id} belum dibayar! Status saat ini: ${order.payment.status}`)
    }
}

// =========================================================================
// 4. ORDER PROCESSING ENGINE DENGAN EXHAUSTIVENESS CHECKING
// =========================================================================

export class OrderProcessor {
    // Menghitung Total Belanja dari Daftar Item
    public static calculateTotal(items: OrderItem[]): number {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }

    // Memproses Notifikasi Status Pembayaran (Exhaustiveness Check via never)
    public static getPaymentStatusMessage(payment: PaymentState): string {
        switch (payment.status) {
            case "PENDING":
                return `⏳ Menunggu pembayaran. Silakan bayar di: ${payment.paymentUrl}`
            case "PAID":
                return `✅ Pembayaran lunas sebesar Rp ${payment.amountPaid.toLocaleString('id-ID')} (Ref: ${payment.transactionId})`
            case "FAILED":
                return `❌ Pembayaran gagal: ${payment.reason} (Kode: ${payment.failureCode})`
            default:
                // Exhaustiveness Checking: Jika ada status baru yang belum di-handle, baris ini akan error saat compile!
                const _unreachable: never = payment
                throw new Error(`Unhandled payment status: ${JSON.stringify(_unreachable)}`)
        }
    }

    // Mengirim Barang (Hanya jika pesanan lolos assertion pembayaran)
    public static shipOrder(order: Order, operator: User): string {
        if (!isAdminUser(operator)) {
            throw new Error(`Akses Ditolak: Hanya Admin yang berhak memproses pengiriman!`)
        }

        // Assertion Type Narrowing
        assertOrderIsPaid(order)

        // TypeScript 100% tahu order.payment adalah PaymentSuccess!
        return `📦 Paket untuk pesanan ${order.id} berhasil dikirim! Transaksi terverifikasi: ${order.payment.transactionId}`
    }
}

// =========================================================================
// 5. SIMULASI RUNNABLE
// =========================================================================

// Setup Dummy Data
const adminUser: User = {
    id: "usr-admin-01",
    name: "Alimur Admin",
    email: "admin@tokokita.com",
    role: "ADMIN",
    isActive: true,
    createdAt: new Date()
}

const customerUser: User = {
    id: "usr-cust-01",
    name: "Budi Santoso",
    email: "budi@mail.com",
    role: "CUSTOMER",
    isActive: true,
    createdAt: new Date()
}

const cartItems: OrderItem[] = [
    { productId: "prod-1", name: "Mechanical Keyboard", price: 850000, quantity: 1 },
    { productId: "prod-2", name: "Gaming Mouse", price: 450000, quantity: 2 }
]

// Buat Pesanan Baru dengan Status PAID
const myOrder: Order = {
    id: "ORD-2026-999",
    customer: customerUser,
    items: cartItems,
    totalAmount: OrderProcessor.calculateTotal(cartItems),
    payment: {
        status: "PAID",
        transactionId: "TRX-BCA-888999",
        paidAt: new Date(),
        amountPaid: 1750000
    },
    createdAt: new Date()
}

// Eksekusi Pengujian
console.log(OrderProcessor.getPaymentStatusMessage(myOrder.payment))
console.log(OrderProcessor.shipOrder(myOrder, adminUser))
```

#### Hasil Output Eksekusi Terminal

```text
✅ Pembayaran lunas sebesar Rp 1.750.000 (Ref: TRX-BCA-888999)
📦 Paket untuk pesanan ORD-2026-999 berhasil dikirim! Transaksi terverifikasi: TRX-BCA-888999
```

---

<a id="bagian-26"></a>

## 26. 🔗 Referensi Resmi

- [TypeScript Official Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Everyday Types Guide](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Narrowing & Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript TSConfig Reference](https://www.typescriptlang.org/tsconfig)
