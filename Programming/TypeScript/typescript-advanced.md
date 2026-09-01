---
title: "TypeScript Advanced"
description: "Fitur tingkat lanjut TypeScript: mapped types, conditional types, template literal types, keyof & typeof, type guards, utility types, dan declaration merging."
order: 3
tags:
  - programming
  - typescript
  - advanced
  - types
---

# TypeScript Advanced

> **Target:** Pemula yang telah menguasai TypeScript Dasar dan OOP/Generics, serta ingin melangkah ke level mahir (**Type-Level Metaprogramming, Indexed Access Types `T[K]`, Mapped Types `[K in keyof T]`, Mapping Modifiers `+`/`-`, Key Remapping via `as`, Conditional Types `T extends U ? X : Y`, Keyword `infer`, Template Literal Types & Intrinsic String Manipulation, Advanced Utility Types `Awaited`/`ReturnType`/`Parameters`/`Exclude`, Recursive Types, Declaration Files `.d.ts`, Global Augmentation, dan Stage 3 Decorators**) menggunakan **TypeScript 5.5+**.
>
> Fokus cheatsheet ini: **mental model Type-Level Computation → Indexed Access `T[K]` → `typeof` pada tipe → Index Signatures → Mapped Types & Modifiers (`-readonly`, `-?`) → Key Remapping `as` → Conditional Types & Distributive Unions → Keyword `infer` → Template Literal Types (`Capitalize`, `Uppercase`) → Advanced Utility Types (`Awaited`, `ReturnType`, `Parameters`, `Exclude`, `Extract`) → Recursive Types (DeepReadonly & JSON Tree) → `.d.ts` & Ambient Declarations → Global Augmentation (`Window`, `ProcessEnv`) → Stage 3 Decorators TS 5.0+ → mini project Type-Safe Query Builder & Deep Immutable Store**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: Indexed Access T[K], typeof pada level tipe, Mapped Types dasar, dan Mapping Modifiers (+/-)

🟡 Lanjutan
→ pelajari setelah Mapped Types lancar: Key Remapping via 'as', Conditional Types, Keyword 'infer', Template Literals, dan Advanced Utility Types

🔴 Advanced / Operasional
→ penting untuk arsitektur library/framework: Recursive Types (DeepReadonly), Declaration Files (.d.ts), Global Augmentation, dan Stage 3 Decorators
```

Mental model alur komputasi tipe (*Type-Level Function Pipeline*) di TypeScript:

```text
                 TIPE DATA SUMBER (Interface / Objek)
                                │
                                ▼
                 1. MAPPED TYPE DENGAN RE-MAPPING
            [K in keyof T as `on${Capitalize<K>}`]
                                │
                                ▼
                 2. CONDITIONAL TYPE LOGIC
              T[K] extends Function ? Action : Value
                                │
                                ▼
                 3. INFER TYPE EXTRACTION
                T extends Promise<infer U> ? U : T
                                │
                                ▼
                 HASIL TRANSFORMASI TIPE BARU
           (100% Type-Safe & Autocomplete di IDE Anda)
```

**Hafalan:**

```text
Type-Level Metaprogramming → manipulasi dan komputasi tipe data layaknya fungsi pemrograman pada waktu kompilasi
Indexed Access (T[K])      → ekstraksi tipe properti tertentu dari suatu tipe objek T menggunakan key K
Mapped Type                → sintaks iterasi untuk mentransformasikan setiap properti tipe menjadi bentuk baru [K in keyof T]
Key Remapping (as)         → klausa pengubah nama key properti pada mapped type menggunakan template literal
Conditional Type           → logika percabangan if/else di level tipe data (T extends U ? X : Y)
infer Keyword              → variabel penangkap tipe otomatis di dalam ekspresi conditional types (Unwrap Types)
Template Literal Type      → tipe data string yang disusun dari kombinasi pola literal template (`${Prefix}_${Action}`)
Awaited<T>                 → utility type untuk mengekstrak tipe nilai akhir dari Promise bersarang (Unwrap Promise)
ReturnType<T>              → utility type untuk mengekstrak tipe kembalian dari suatu fungsi T
Parameters<T>              → utility type untuk mengekstrak tuple tipe argumen parameter fungsi T
Declaration File (.d.ts)   → berkas deklarasi tipe murni tanpa kode JavaScript untuk menyediakan types pada library eksternal
Global Augmentation        → teknik memperluas tipe interface global bawaan (seperti Window atau NodeJS.ProcessEnv)
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Type-Level Metaprogramming di TypeScript](#bagian-1)
2. [Indexed Access Types (`T[K]` & `T[keyof T]`)](#bagian-2)
3. [Operator `typeof` pada Level Tipe Data](#bagian-3)
4. [Index Signatures & Dynamic Key Objects](#bagian-4)
5. [Mapped Types Dasar (`[K in keyof T]: T[K]`)](#bagian-5)
6. [Mapping Modifiers: Menambah atau Menghapus `readonly` dan `?`](#bagian-6)

### 🟡 Lanjutan

7. [Key Remapping via Klausa `as` pada Mapped Types](#bagian-7)
8. [Conditional Types (`T extends U ? X : Y`)](#bagian-8)
9. [Distributive Conditional Types pada Union](#bagian-9)
10. [Keyword `infer`: Ekstraksi Tipe Dinamis di dalam Conditional Types](#bagian-10)
11. [Template Literal Types & String Manipulation Types](#bagian-11)
12. [Advanced Utility Types 1: `Awaited<T>`](#bagian-12)
13. [Advanced Utility Types 2: `ReturnType<T>` & `Parameters<T>`](#bagian-13)
14. [Advanced Utility Types 3: `Exclude<T, U>`, `Extract<T, U>`, dan `NonNullable<T>`](#bagian-14)
15. [Advanced Utility Types 4: `ConstructorParameters<T>` & `InstanceType<T>`](#bagian-15)
16. [Recursive Type Aliases](#bagian-16)

### 🔴 Advanced / Operasional

17. [Declaration Files (`.d.ts`) & Ambient Declarations](#bagian-17)
18. [Global Augmentation & Declaration Merging](#bagian-18)
19. [Stage 3 Decorators Modern di TypeScript 5.0+](#bagian-19)
20. [Best Practice & Kinerja Kompilasi Type-Level](#bagian-20)

### 🛠️ Referensi & Praktik

21. [Peta Ingatan Cepat](#bagian-21)
22. [Tabel Ringkasan](#bagian-22)
23. [Cheat Code TypeScript Advanced 10 Detik](#bagian-23)
24. [Urutan Belajar yang Disarankan](#bagian-24)
25. [Mini Project: Production-Ready Type-Safe Query Builder, Event-Driven Schema Validator & Deep Immutable Store with Mapped and Conditional Types](#bagian-25)
26. [Referensi Resmi](#bagian-26)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan Type-Level Metaprogramming di TypeScript

#### Konsep

TypeScript bukan sekadar validator tipe data pasif. Sistem tipe TypeScript adalah bahasa pemrograman fungsional murni yang **Turing-Complete**:
- Anda dapat membuat *fungsi di level tipe* yang menerima tipe data sebagai input dan menghasilkan tipe data baru sebagai output.
- Semua komputasi tipe ini dievaluasi **saat proses kompilasi tanpa runtime overhead apa pun**.

#### Cara Kerja

```text
Input Tipe (Model Database User)
               │
               ▼ Type Transformation (Mapped + Conditional)
Output Tipe (Frontend Form State, API DTO, Event Handlers Otomatis)
```

**Hafalan:**

```text
Type-Level Programming → komputasi logika transformasi tipe data yang dieksekusi saat proses compile-time
```

---

<a id="bagian-2"></a>

## 2. 🟢 Indexed Access Types (`T[K]` & `T[keyof T]`)

#### Konsep

Sama seperti mengakses properti objek di JavaScript via `obj["prop"]`, kita dapat **mengekstrak tipe data dari suatu properti interface/tipe** menggunakan sintaks **`Type["property"]`**.

#### Contoh

```typescript
interface UserProfile {
    id: string
    personalInfo: {
        firstName: string
        lastName: string
        age: number
    }
    roles: ("ADMIN" | "USER")[]
}

// 1. Mengambil Tipe Objek Bersarang:
type PersonalInfo = UserProfile["personalInfo"] 
// { firstName: string; lastName: string; age: number }

// 2. Mengambil Tipe Elemen Array:
type SingleRole = UserProfile["roles"][number] 
// "ADMIN" | "USER"

// 3. Mengambil Union Seluruh Tipe Nilai:
type UserValues = UserProfile[keyof UserProfile] 
// string | { firstName: string... } | ("ADMIN" | "USER")[]
```

**Hafalan:**

```text
T["prop"]   → mengekstrak tipe properti spesifik dari tipe T
T[number]   → mengekstrak tipe elemen tunggal dari tipe array T
```

---

<a id="bagian-3"></a>

## 3. 🟢 Operator `typeof` pada Level Tipe Data

#### Konsep

Di JavaScript, `typeof x` mengembalikan string nama tipe di runtime.

Di TypeScript, jika `typeof` digunakan **di dalam deklarasi tipe (`type X = typeof x`)**, ia akan **mengekstrak struktur tipe data lengkap dari variabel/objek JavaScript yang ada**.

#### Contoh

```typescript
// Objek Konfigurasi JavaScript Biasa
const DEFAULT_SYSTEM_SETTINGS = {
    appName: "Enterprise Hub",
    maxConnections: 100,
    features: {
        darkMode: true,
        betaAccess: false
    }
}

// Mengekstrak Tipe Otomatis tanpa menulis interface manual:
type SystemSettings = typeof DEFAULT_SYSTEM_SETTINGS

/*
Hasil Tipe SystemSettings:
{
    appName: string;
    maxConnections: number;
    features: { darkMode: boolean; betaAccess: boolean; };
}
*/
```

**Hafalan:**

```text
type MyType = typeof jsVariable; → mengekstrak struktur tipe data langsung dari objek JavaScript
```

---

<a id="bagian-4"></a>

## 4. 🟢 Index Signatures & Dynamic Key Objects

#### Konsep

Jika sebuah objek memiliki nama-nama properti yang dinamis dan tidak diketahui sebelumnya:
Gunakan **Index Signature: `[key: KeyType]: ValueType`**.

#### Contoh

```typescript
interface DynamicHeaders {
    // Properti wajib:
    "content-type": string
    // Properti dinamis lainnya bebas string apa saja:
    [headerName: string]: string | number
}

const reqHeaders: DynamicHeaders = {
    "content-type": "application/json",
    "x-api-key": "secret-123",
    "x-retry-count": 3
}
```

**Hafalan:**

```text
[key: string]: ValueType → index signature untuk mendefinisikan objek dengan nama key dinamis
```

---

<a id="bagian-5"></a>

## 5. 🟢 Mapped Types Dasar (`[K in keyof T]: T[K]`)

#### Konsep

**Mapped Types** memungkinkan kita mengiterasi setiap properti dari suatu tipe `T` untuk menghasilkan tipe baru.

Sintaks Dasar:
`type MyMappedType<T> = { [K in keyof T]: NewType }`

#### Contoh

```typescript
interface Car {
    brand: string
    maxSpeed: number
    isElectric: boolean
}

// Mapped Type: Mengubah seluruh tipe nilai properti menjadi boolean (Flag Validator)
type FeatureValidatorFlags<T> = {
    [K in keyof T]: boolean
}

type CarValidation = FeatureValidatorFlags<Car>
/*
Hasil:
{
    brand: boolean;
    maxSpeed: boolean;
    isElectric: boolean;
}
*/
```

**Hafalan:**

```text
{ [K in keyof T]: Transformation } → Mapped Type untuk mentransformasikan setiap properti tipe T
```

---

<a id="bagian-6"></a>

## 6. 🟢 Mapping Modifiers: Menambah atau Menghapus `readonly` dan `?`

#### Konsep

Saat melakukan mapping, kita dapat menambahkan (`+`) atau menghapus (`-`) modifier `readonly` dan tanda opsional `?`:
- **`-readonly`:** Menghapus status readonly (membuat properti mutable).
- **`-?`:** Menghapus status opsional (membuat seluruh properti menjadi wajib / non-nullable).

#### Contoh

```typescript
interface ImmutableProfile {
    readonly id: string
    readonly name: string
    age?: number
    bio?: string
}

// Menghapus readonly dan menghapus tanda opsional (?)
type MutableStrictProfile<T> = {
    -readonly [K in keyof T]-?: T[K]
}

type UnlockedProfile = MutableStrictProfile<ImmutableProfile>
/*
Hasil UnlockedProfile:
{
    id: string;      // Tidak lagi readonly
    name: string;    // Tidak lagi readonly
    age: number;     // Wajib (Bukan opsional lagi)
    bio: string;     // Wajib (Bukan opsional lagi)
}
*/
```

**Hafalan:**

```text
-readonly [K in keyof T] → menghapus modifier readonly
[K in keyof T]-?         → menghapus modifier opsional (?) sehingga seluruh properti menjadi wajib
```

---

<a id="bagian-7"></a>

## 7. 🟡 Key Remapping via Klausa `as` pada Mapped Types

#### Konsep

Dengan klausa **`as` (TS 4.1+)**, kita dapat **mengubah nama key properti** saat melakukan mapping (misal: otomatis membuat nama method Getter/Setter untuk setiap properti).

#### Contoh

```typescript
interface UserModel {
    id: string
    name: string
    email: string
}

// Otomatis men-generate nama method Getter: getName(), getEmail(), getId()
type AutoGetters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

type UserGetters = AutoGetters<UserModel>
/*
Hasil:
{
    getId: () => string;
    getName: () => string;
    getEmail: () => string;
}
*/
```

**Hafalan:**

```text
[K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] → Key Remapping untuk auto-generate nama properti
```

---

<a id="bagian-8"></a>

## 8. 🟡 Conditional Types (`T extends U ? X : Y`)

#### Konsep

**Conditional Types** adalah operator *Ternary if/else* di level tipe:
Jika tipe `T` dapat di-assign ke tipe `U`, maka kembalikan tipe `X`, jika tidak kembalikan tipe `Y`.

Format: `T extends U ? X : Y`

#### Contoh

```typescript
// Memeriksa Apakah Tipe adalah String
type TypeClassifier<T> = T extends string 
    ? "TIPE_TEKS" 
    : T extends number 
    ? "TIPE_ANGKA" 
    : "TIPE_LAIN"

type TestA = TypeClassifier<"Halo"> // "TIPE_TEKS"
type TestB = TypeClassifier<42>     // "TIPE_ANGKA"
type TestC = TypeClassifier<true>   // "TIPE_LAIN"
```

**Hafalan:**

```text
T extends U ? TrueType : FalseType → percabangan kondisional if/else pada sistem tipe TypeScript
```

---

<a id="bagian-9"></a>

## 9. 🟡 Distributive Conditional Types pada Union

#### Konsep

Ketika Conditional Type menerima **Union Type** (`A | B | C`), TypeScript secara otomatis **mendistribusikan pengecekan ke setiap anggota union satu per satu**:
`(A | B) extends U ? X : Y` $\rightarrow$ `(A extends U ? X : Y) | (B extends U ? X : Y)`.

#### Contoh

```typescript
// Menghilangkan tipe null dan undefined dari Union
type RemoveNullAndUndefined<T> = T extends null | undefined ? never : T

type RawInput = string | number | null | undefined

type CleanedInput = RemoveNullAndUndefined<RawInput>
// Evaluasi: (string extends null ? never : string) | (number extends null ? never : number) | (null -> never)
// Hasil Akhir: string | number (never otomatis tereliminasi dari union!)
```

**Hafalan:**

```text
Distributive Conditional Types → evaluasi kondisional yang otomatis diterapkan ke setiap anggota Union secara terpisah
```

---

<a id="bagian-10"></a>

## 10. 🟡 Keyword `infer`: Ekstraksi Tipe Dinamis di dalam Conditional Types

#### Konsep

Keyword **`infer`** digunakan untuk **mendeklarasikan variabel tipe penangkap** di dalam klausa `extends`.

Kapan Digunakan:
Ketika kita ingin *membongkar dan mengekstrak* tipe di dalam struktur generik (misal: mengekstrak tipe elemen array, tipe return Promise, atau tipe argumen fungsi).

#### Contoh

```typescript
// 1. Mengekstrak Tipe Elemen di dalam Array
type ElementOf<T> = T extends (infer ItemType)[] ? ItemType : T

type StrArr = string[]
type ExtractedType = ElementOf<StrArr> // string

// 2. Mengekstrak Tipe Payload di dalam Promise
type UnwrapPromise<T> = T extends Promise<infer Payload> ? Payload : T

type AsyncData = Promise<{ id: string; name: string }>
type ResolvedData = UnwrapPromise<AsyncData> // { id: string; name: string }
```

**Hafalan:**

```text
T extends Promise<infer U> ? U : T → keyword infer untuk mengekstrak dan menangkap tipe bersarang secara dinamis
```

---

<a id="bagian-11"></a>

## 11. 🟡 Template Literal Types & String Manipulation Types

#### Konsep

Template Literal Types memungkinkan pembuatan tipe string berbasis pola interpolasi `` `${A}_${B}` ``.

Empat Intrinsic String Manipulation Types Bawaan:
1. **`Uppercase<S>`:** Mengubah string menjadi huruf kapital (`"halo"` $\rightarrow$ `"HALO"`).
2. **`Lowercase<S>`:** Mengubah string menjadi huruf kecil.
3. **`Capitalize<S>`:** Mengubah huruf pertama menjadi kapital (`"user"` $\rightarrow$ `"User"`).
4. **`Uncapitalize<S>`:** Mengubah huruf pertama menjadi huruf kecil.

#### Contoh

```typescript
type Entity = "user" | "product" | "order"
type Action = "created" | "updated" | "deleted"

// Menghasilkan 9 kombinasi nama event otomatis:
type DomainEvent = `${Uppercase<Entity>}_${Uppercase<Action>}`
// "USER_CREATED" | "USER_UPDATED" | "USER_DELETED" | "PRODUCT_CREATED" | ...

// Validasi Pola Format Hex Color CSS:
type HexColor = `#${string}`
const validColor: HexColor = "#00dc82" // ✅ Valid
// const invalidColor: HexColor = "rgb(0,0,0)" ❌ ERROR: Type '"rgb(0,0,0)"' is not assignable to type '`#${string}`'
```

**Hafalan:**

```text
`${TypeA}_${TypeB}` + Capitalize<S> → membuat tipe pola string dinamis dengan manipulasi kapitalisasi bawaan
```

---

<a id="bagian-12"></a>

## 12. 🟡 Advanced Utility Types 1: `Awaited<T>`

#### Konsep

Utility Type bawaan **`Awaited<T>`** (TS 4.5+) digunakan untuk membongkar tipe payload Promise berulang kali (*Recursive Unwrap*) hingga mendapatkan nilai murni akhirnya.

#### Contoh

```typescript
type DeepPromise = Promise<Promise<Promise<string>>>

type FinalType = Awaited<DeepPromise> // string

async function fetchUserData() {
    return { id: "u-101", balance: 500000 }
}

// Mengekstrak tipe return murni dari fungsi async:
type UserPayload = Awaited<ReturnType<typeof fetchUserData>>
// { id: string; balance: number }
```

**Hafalan:**

```text
Awaited<Promise<T>> → membongkar tipe data di dalam Promise hingga mendapatkan nilai murni T
```

---

<a id="bagian-13"></a>

## 13. 🟡 Advanced Utility Types 2: `ReturnType<T>` & `Parameters<T>`

#### Konsep

1. **`ReturnType<typeof functionName>`:** Mengekstrak tipe kembalian dari suatu fungsi.
2. **`Parameters<typeof functionName>`:** Mengekstrak tuple tipe dari seluruh parameter fungsi.

#### Contoh

```typescript
function registerProduct(sku: string, price: number, inStock: boolean) {
    return {
        sku,
        price,
        inStock,
        registeredAt: new Date()
    }
}

// 1. Ambil Tipe Parameter: [sku: string, price: number, inStock: boolean]
type RegisterProductParams = Parameters<typeof registerProduct>

// 2. Ambil Tipe Hasil Return:
type ProductRegistrationResult = ReturnType<typeof registerProduct>
```

**Hafalan:**

```text
ReturnType<typeof fn>  → mengekstrak tipe nilai kembalian fungsi
Parameters<typeof fn>  → mengekstrak tuple tipe argumen parameter fungsi
```

---

<a id="bagian-14"></a>

## 14. 🟡 Advanced Utility Types 3: `Exclude<T, U>`, `Extract<T, U>`, dan `NonNullable<T>`

#### Konsep

Operasi Aljabar Himpunan pada Union Types:
- **`Exclude<UnionType, ExcludedMembers>`:** Membuang anggota tertentu dari Union.
- **`Extract<UnionType, ExtractedMembers>`:** Hanya mengambil anggota yang cocok dari Union.
- **`NonNullable<T>`:** Membuang `null` dan `undefined` dari tipe data `T`.

#### Contoh

```typescript
type AllActions = "CLICK" | "HOVER" | "FOCUS" | "SUBMIT" | "RESET"

// 1. Exclude: Buang "SUBMIT" dan "RESET"
type MouseActions = Exclude<AllActions, "SUBMIT" | "RESET">
// "CLICK" | "HOVER" | "FOCUS"

// 2. Extract: Hanya ambil aksi form
type FormActions = Extract<AllActions, "SUBMIT" | "RESET" | "DRAG">
// "SUBMIT" | "RESET"

// 3. NonNullable
type RawToken = string | null | undefined
type CleanToken = NonNullable<RawToken> // string
```

**Hafalan:**

```text
Exclude<Union, ExcludeMembers> → membuang subset anggota dari union
Extract<Union, MatchMembers>   → mengambil subset anggota yang cocok dari union
NonNullable<T>                 → menghapus null dan undefined dari tipe data T
```

---

<a id="bagian-15"></a>

## 15. 🟡 Advanced Utility Types 4: `ConstructorParameters<T>` & `InstanceType<T>`

#### Konsep

- **`ConstructorParameters<typeof ClassName>`:** Mengekstrak tuple tipe parameter constructor class.
- **`InstanceType<typeof ClassName>`:** Mengekstrak tipe instance objek yang dihasilkan oleh class.

#### Contoh

```typescript
class DatabaseConnection {
    constructor(public host: string, public port: number) {}
}

type ConnParams = ConstructorParameters<typeof DatabaseConnection> // [host: string, port: number]
type ConnInstance = InstanceType<typeof DatabaseConnection>         // DatabaseConnection
```

**Hafalan:**

```text
InstanceType<typeof ClassName> → mengekstrak tipe instance dari class constructor
```

---

<a id="bagian-16"></a>

## 16. 🟡 Recursive Type Aliases

#### Konsep

Sebuah tipe data yang **mereferensikan dirinya sendiri secara rekursif** untuk memodelkan struktur data bersarang tak terbatas (seperti JSON tree, navigasi menu hierarkis, atau deeply nested state).

#### Contoh

```typescript
// 1. Tipe JSON Value Universal Lengkap
export type JSONValue = 
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | { [key: string]: JSONValue }

// 2. Deep Readonly Rekursif (Mengunci seluruh level nested objek)
export type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends Function 
        ? T[K] 
        : T[K] extends object 
        ? DeepReadonly<T[K]> 
        : T[K]
}
```

**Hafalan:**

```text
DeepReadonly<T> → mapped type rekursif yang mengunci seluruh level kedalaman objek menjadi immutable
```

---

<a id="bagian-17"></a>

## 17. 🔴 Declaration Files (`.d.ts`) & Ambient Declarations

#### Konsep

**Declaration Files (`.d.ts`)**:
Berkas yang **HANYA memuat deklarasi tipe data** tanpa kode implementasi runtime JavaScript.

Digunakan untuk:
1. Mendistribusikan tipe library npm.
2. Menyediakan tipe untuk library JavaScript lama tanpa types via **`declare module "nama-library"`**.

#### Contoh

File `src/types/legacy-payment.d.ts`:
```typescript
declare module "legacy-payment-sdk" {
    export interface PaymentConfig {
        merchantId: string
        secretKey: string
    }

    export function initPayment(config: PaymentConfig): boolean
    export function chargeCard(amount: number): Promise<{ success: boolean; txId: string }>
}
```

**Hafalan:**

```text
declare module "lib-name" { export ... } → menyediakan anotasi tipe untuk library JS tanpa types di file .d.ts
```

---

<a id="bagian-18"></a>

## 18. 🔴 Global Augmentation & Declaration Merging

#### Konsep

**Global Augmentation** memungkinkan kita memperluas tipe bawaan browser (`Window`) atau runtime (`NodeJS.ProcessEnv`) agar IDE mengenali variabel global kustom kita.

#### Contoh

File `src/types/global-augmentation.d.ts`:
```typescript
// 1. Memperluas Objek Global Window Browser
declare global {
    interface Window {
        myAnalyticsTracker: {
            trackEvent: (name: string) => void
        }
    }

    // 2. Memperluas Variabel Environment Node.js
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string
            JWT_SECRET_KEY: string
            PORT?: string
        }
    }
}

export {}
```

**Hafalan:**

```text
declare global { interface Window { customProp: type } } → memperluas tipe objek global bawaan runtime
```

---

<a id="bagian-19"></a>

## 19. 🔴 Stage 3 Decorators Modern di TypeScript 5.0+

#### Konsep

TypeScript 5.0+ mengadopsi standar **ECMAScript Stage 3 Decorators** resmi (tidak lagi membutuhkan opsi legacy `experimentalDecorators: true`).

Jenis Decorator:
- **Class Decorator:** `(target: Function, context: ClassDecoratorContext)`
- **Method Decorator:** `(target: Function, context: ClassMethodDecoratorContext)`

#### Contoh

```typescript
// Method Decorator: Pengukur Durasi Eksekusi
function MeasureExecutionTime(originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = String(context.name)

    return function (this: any, ...args: any[]) {
        const start = performance.now()
        const result = originalMethod.apply(this, args)
        const duration = (performance.now() - start).toFixed(2)
        console.log(`⏱️ [Performance] Method '${methodName}' selesai dalam ${duration} ms`)
        return result
    }
}

class HeavyCalculationService {
    @MeasureExecutionTime
    public computePrimes(limit: number): number {
        let count = 0
        for (let i = 2; i < limit; i++) count++
        return count
    }
}
```

**Hafalan:**

```text
Stage 3 Decorators (TS 5.0+) → standar decorator resmi ECMAScript menggunakan decorator context
```

---

<a id="bagian-20"></a>

## 20. 🔴 Best Practice & Kinerja Kompilasi Type-Level

#### Konsep

Kompilasi TypeScript dapat menjadi sangat lambat (*IDE Type Lag*) jika Anda menulis tipe rekursif yang terlalu dalam tanpa *Exit Condition*.

Aturan Kinerja:
1. Hindari recursive mapped types pada objek raksasa (> 100 level).
2. Manfaatkan `skipLibCheck: true` di `tsconfig.json`.
3. Pecah tipe kompleks menjadi langkah-langkah *Type Alias* kecil untuk mempermudah caching compiler.

**Hafalan:**

```text
Kinerja Kompilasi → selalu sertakan batas rekursi pada tipe kompleks untuk mencegah loop kompilasi tak terbatas
```

---

<a id="bagian-21"></a>

## 21. 🛠️ Peta Ingatan Cepat

```text
                 PETA ARSITEKTUR TYPESCRIPT ADVANCED
                                  │
       ┌──────────────────────────┼──────────────────────────┐
       ▼                          ▼                          ▼
MAPPED & CONDITIONAL TYPES INFER & STRING TEMPLATES  DECLARATION & DECORATORS
├─ [K in keyof T]: T[K]    ├─ T extends P<infer U>   ├─ .d.ts Declaration Files
├─ -readonly & -?          ├─ `${Prefix}_${Action}`  ├─ declare global (Window)
├─ Key Remapping via 'as'  ├─ Capitalize & Lowercase ├─ Stage 3 Decorators (TS 5)
└─ T extends U ? X : Y     └─ Awaited, ReturnType    └─ DeepReadonly Recursive
```

---

<a id="bagian-22"></a>

## 22. 📚 Tabel Ringkasan

| Fitur / Keyword | Kategori | Fungsi & Karakteristik Utama |
|---|---|---|
| `T[K]` | Indexed Access | Mengekstrak tipe properti bersarang dari tipe T |
| `[K in keyof T]` | Mapped Type | Mengiterasi seluruh properti tipe T |
| `-readonly` / `-?` | Modifier | Menghapus modifier readonly atau opsional saat mapping |
| `as` in Mapped | Key Remapping | Mengubah nama properti hasil mapping via template string |
| `T extends U ? X : Y`| Conditional | Logika if/else percabangan di level sistem tipe |
| `infer U` | Type Extraction | Menangkap dan mengekstrak tipe di dalam struktur generik |
| `` `${A}_${B}` `` | Template Literal| Membuat tipe pola string dinamis berbasis interpolasi |
| `Awaited<T>` | Utility Type | Membongkar tipe payload Promise berulang kali |
| `ReturnType<T>` | Utility Type | Mengekstrak tipe return dari signature fungsi |
| `Parameters<T>` | Utility Type | Mengekstrak tuple tipe parameter dari signature fungsi |
| `.d.ts` | Type Definition | Berkas deklarasi tipe murni tanpa output runtime JS |

---

<a id="bagian-23"></a>

## 23. ⚡ Cheat Code TypeScript Advanced 10 Detik

```typescript
// 1. Template Deep Readonly
type DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K] }

// 2. Template Auto Getter Remapping
type AutoGetters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] }

// 3. Template Unwrap Promise via infer
type Unwrap<T> = T extends Promise<infer U> ? U : T
```

---

<a id="bagian-24"></a>

## 24. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Indexed Access & Mapped Types
├── Ekstrak tipe bersarang via T[K] dan typeof variabel
└── Transformasikan properti dengan mapped types dan modifiers (-readonly, -?)
       │
       ▼
Langkah 2: Conditional Types & Keyword infer
├── Kuasai logika if/else tipe (T extends U ? X : Y)
└── Ekstrak tipe payload di dalam Promise/Array via infer
       │
       ▼
Langkah 3: Template Literal Types & String Intrinsics
├── Bangun tipe pola nama event via `${Prefix}_${Action}`
└── Terapkan Capitalize dan Lowercase untuk key remapping
       │
       ▼
Langkah 4: Ecosystem & Enterprise Tooling
├── Tulis berkas .d.ts dan lakukan Global Augmentation pada Window/ProcessEnv
└── Terapkan Stage 3 Decorators modern (TS 5.0+)
       │
       ▼
Langkah 5: Selamat! Anda Telah Menjadi TypeScript Full-Stack Master 100%!
```

---

<a id="bagian-25"></a>

## 25. 🏗️ Mini Project: Production-Ready Type-Safe Query Builder, Event-Driven Schema Validator & Deep Immutable Store with Mapped and Conditional Types

Aplikasi enterprise TypeScript lengkap, modern, dan runnable yang mengintegrasikan: **DeepReadonly Recursive, Type-Safe Query Builder dengan `keyof` dan `infer`, Auto-generated Getters/Setters Mapped Type via `as`, dan Dynamic Event Name Template Literal**.

```typescript
// =========================================================================
// 1. ADVANCED TYPE UTILITIES
// =========================================================================

// Deep Readonly Rekursif
export type DeepImmutable<T> = {
    readonly [K in keyof T]: T[K] extends (...args: any[]) => any
        ? T[K]
        : T[K] extends object
        ? DeepImmutable<T[K]>
        : T[K]
}

// Auto-Generate Getters Mapped Type
export type ModelGetters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

// Dynamic Domain Event Template Literal
export type EntityName = "user" | "order" | "invoice"
export type CRUDAction = "created" | "updated" | "deleted"
export type DomainEventName = `${Uppercase<EntityName>}_${Uppercase<CRUDAction>}`

// =========================================================================
// 2. DOMAIN MODELS
// =========================================================================

export interface ProductModel {
    id: string
    title: string
    price: number
    inStock: boolean
    tags: string[]
}

// =========================================================================
// 3. TYPE-SAFE QUERY BUILDER (MENGGUNAKAN KEYOF & CONDITIONAL TYPES)
// =========================================================================

export type FilterOperator = "eq" | "gt" | "lt" | "contains"

export interface QueryFilter<TModel, K extends keyof TModel = keyof TModel> {
    field: K
    operator: FilterOperator
    value: TModel[K]
}

export class TypeSafeQueryBuilder<TModel extends object> {
    private filters: Array<QueryFilter<TModel, any>> = []
    private selectedFields: Array<keyof TModel> = []

    // Method Where 100% Type-Safe: Field divalidasi dan Value dicocokkan dengan tipe kolom!
    public where<K extends keyof TModel>(
        field: K,
        operator: FilterOperator,
        value: TModel[K]
    ): this {
        this.filters.push({ field, operator, value })
        return this
    }

    // Method Select Fields
    public select<K extends keyof TModel>(...fields: K[]): this {
        this.selectedFields = fields
        return this
    }

    // Eksekusi Query pada In-Memory Collection
    public execute(collection: TModel[]): Partial<TModel>[] {
        return collection
            .filter((item) => {
                return this.filters.every((f) => {
                    const itemVal = item[f.field as keyof TModel]
                    if (f.operator === "eq") return itemVal === f.value
                    if (f.operator === "gt") return itemVal > f.value
                    if (f.operator === "lt") return itemVal < f.value
                    return true
                })
            })
            .map((item) => {
                if (this.selectedFields.length === 0) return item
                const result: Partial<TModel> = {}
                this.selectedFields.forEach((field) => {
                    result[field] = item[field]
                })
                return result
            })
    }
}

// =========================================================================
// 4. DEEP IMMUTABLE STORE
// =========================================================================

export class ImmutableStore<TState extends object> {
    private state: DeepImmutable<TState>

    constructor(initialState: TState) {
        this.state = Object.freeze({ ...initialState }) as DeepImmutable<TState>
    }

    public getState(): DeepImmutable<TState> {
        return this.state
    }

    // Update State Secara Type-Safe
    public update(updater: (currentState: DeepImmutable<TState>) => Partial<TState>): void {
        const nextPatch = updater(this.state)
        this.state = Object.freeze({
            ...this.state,
            ...nextPatch
        }) as DeepImmutable<TState>
    }
}

// =========================================================================
// 5. SIMULASI RUNNABLE
// =========================================================================

// Dataset Produk
const sampleProducts: ProductModel[] = [
    { id: "p1", title: "Mechanical Keyboard", price: 850000, inStock: true, tags: ["hardware"] },
    { id: "p2", title: "Gaming Mouse", price: 450000, inStock: true, tags: ["hardware"] },
    { id: "p3", title: "Desk Mat Extended", price: 150000, inStock: false, tags: ["accessories"] }
]

// 1. Eksekusi Query Builder Type-Safe
const query = new TypeSafeQueryBuilder<ProductModel>()
    .where("price", "gt", 200000) // ✅ 'price' divalidasi number
    .where("inStock", "eq", true)  // ✅ 'inStock' divalidasi boolean
    .select("id", "title", "price")

const queryResults = query.execute(sampleProducts)
console.log("Hasil Filter Query Builder:", queryResults)

// 2. Eksekusi Deep Immutable Store
const store = new ImmutableStore({
    config: { theme: "dark", version: "1.0.0" },
    activeUser: { name: "Alimur", role: "ADMIN" }
})

console.log("Status Store Saat Ini:", store.getState())

store.update((prev) => ({
    activeUser: { ...prev.activeUser, name: "Alimur Updated" }
}))

console.log("Status Store Setelah Update:", store.getState())
```

#### Hasil Output Eksekusi Terminal

```text
Hasil Filter Query Builder: [
  { id: 'p1', title: 'Mechanical Keyboard', price: 850000 },
  { id: 'p2', title: 'Gaming Mouse', price: 450000 }
]
Status Store Saat Ini: {
  config: { theme: 'dark', version: '1.0.0' },
  activeUser: { name: 'Alimur', role: 'ADMIN' }
}
Status Store Setelah Update: {
  config: { theme: 'dark', version: '1.0.0' },
  activeUser: { name: 'Alimur Updated', role: 'ADMIN' }
}
```

---

<a id="bagian-26"></a>

## 26. 🔗 Referensi Resmi

- [TypeScript Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [TypeScript Conditional Types Reference](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [TypeScript Mapped Types Reference](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [TypeScript Template Literal Types Reference](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
