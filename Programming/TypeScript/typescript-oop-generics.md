---
title: "TypeScript OOP & Generics"
description: "Class, access modifiers, interface implementation, abstract classes, serta Generic types, constraints, dan generic utility patterns."
order: 2
tags:
  - programming
  - typescript
  - oop
  - generics
  - intermediate
---

# TypeScript OOP & Generics

> **Target:** Pemula yang telah memahami TypeScript Dasar dan ingin menguasai **Pemrograman Berorientasi Objek di TypeScript (Classes, Access Modifiers `public`/`private`/`protected`/`readonly`, Parameter Properties shorthand, Getters/Setters, Static Members, Abstract Classes, Multiple Interface Implementation), Generics Komprehensif (`<T>`, Generic Functions, Generic Interfaces, Generic Classes, Generic Constraints `extends keyof`, Default Type Parameters), dan Utility Types Inti (`Partial`, `Required`, `Readonly`, `Record`, `Pick`, `Omit`)** menggunakan **TypeScript 5.5+**.
>
> Fokus cheatsheet ini: **mental model OOP & Encapsulation → Class & Access Modifiers → Parameter Properties → Abstract Classes & Interfaces → Generics `<T>` mental model → Generic Functions & Classes → Generic Constraints (`extends`) → `keyof` lookup constraints → Default Type Parameters → Utility Types Inti (`Partial`, `Required`, `Readonly`, `Record`, `Pick`, `Omit`) → Constructor Signatures → mini project Enterprise Generic In-Memory Repository & Polymorphic Event Bus**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: Class, Access Modifiers (public/private/protected/readonly), Parameter Properties, dan Getters/Setters

🟡 Lanjutan
→ pelajari setelah Class lancar: Abstract Classes, Multiple Interfaces, Generics Dasar (<T>), Generic Constraints (extends), dan keyof constraints

🔴 Advanced / Operasional
→ penting untuk arsitektur library/framework: Utility Types Inti (Partial/Pick/Omit/Record), Generic Factory Signatures, dan Anti-Pattern avoidance
```

Mental model alur abstraksi Generics `<T>` di TypeScript:

```text
                       FUNGSI / CLASS GENERIK
                     function identity<T>(arg: T): T
                                   │
                                   ▼
                PEMANGGIL MENYEDIAKAN TIPE SPESIFIK
         ┌─────────────────────────┼─────────────────────────┐
         ▼ (Dipanggil dgn number)  ▼ (Dipanggil dgn string)  ▼ (Dipanggil dgn User)
     identity<number>(42)    identity<string>("Halo")    identity<User>(userObj)
         │                         │                         │
         ▼                         ▼                         ▼
  Compiler Mengetahui       Compiler Mengetahui       Compiler Mengetahui
  Return bertipe: NUMBER    Return bertipe: STRING    Return bertipe: USER
         │                         │                         │
         └─────────────────────────┴─────────────────────────┘
                                   ▼
        TYPE SAFETY 100% TERJAGA TANPA REDUNDANSI KODE! (Zero 'any')
```

**Hafalan:**

```text
Access Modifiers      → kata kunci (public, private, protected, readonly) pengatur hak akses properti/method class
Parameter Properties  → shorthand deklarasi dan inisialisasi properti otomatis langsung di parameter constructor
Abstract Class        → kelas template dasar yang tidak dapat di-instansiasi langsung dan mewajibkan implementasi di subclass
Generics (<T>)        → fitur pembuatan komponen fleksibel dan reusable yang mempertahankan tipe data asli pemanggil
Generic Constraint    → pembatasan tipe generik menggunakan keyword extends (T extends HasId atau K extends keyof T)
keyof T               → operator pengambil kumpulan seluruh key string literal dari suatu tipe objek T
Partial<T>            → utility type yang mengubah seluruh properti tipe T menjadi opsional (?)
Required<T>           → utility type yang mengubah seluruh properti tipe T menjadi wajib (menghapus ?)
Readonly<T>           → utility type yang mengunci seluruh properti tipe T menjadi tidak bisa diubah (readonly)
Record<K, T>          → utility type untuk membuat struktur objek kamus key-value dengan key bertipe K dan value bertipe T
Pick<T, K>            → utility type untuk memilih sebagian daftar properti K dari tipe objek T
Omit<T, K>            → utility type untuk membuang daftar properti K dari tipe objek T
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Object-Oriented Programming (OOP) di TypeScript & Keunggulan Dibanding JS Classes Biasa](#bagian-1)
2. [Definisi Class, Constructor & Access Modifiers](#bagian-2)
3. [Parameter Properties: Shorthand Constructor Deklarasi Otomatis](#bagian-3)
4. [Getters & Setters untuk Enkapsulasi Mutasi Data](#bagian-4)
5. [Static Members & Static Initialization Blocks](#bagian-5)
6. [Class Inheritance & Method Overriding](#bagian-6)

### 🟡 Lanjutan

7. [Abstract Classes & Abstract Methods](#bagian-7)
8. [Mengimplementasikan Multiple Interfaces pada Class](#bagian-8)
9. [Pengenalan Generics (`<T>`) & Mental Model Reusability](#bagian-9)
10. [Generic Functions & Multi-Type Parameters](#bagian-10)
11. [Generic Interfaces & Generic Type Aliases](#bagian-11)
12. [Generic Classes](#bagian-12)
13. [Generic Constraints dengan Keyword `extends`](#bagian-13)
14. [Operator `keyof` & Generic Property Constraints](#bagian-14)
15. [Default Generic Type Parameters](#bagian-15)

### 🔴 Advanced / Operasional

16. [Utility Types Inti 1: `Partial<T>` & `Required<T>`](#bagian-16)
17. [Utility Types Inti 2: `Readonly<T>` & `Record<K, T>`](#bagian-17)
18. [Utility Types Inti 3: `Pick<T, K>` & `Omit<T, K>`](#bagian-18)
19. [Generic Factory & Constructor Signatures](#bagian-19)
20. [Best Practice & Anti-Pattern Penggunaan Generics](#bagian-20)

### 🛠️ Referensi & Praktik

21. [Peta Ingatan Cepat](#bagian-21)
22. [Tabel Ringkasan](#bagian-22)
23. [Cheat Code TypeScript OOP & Generics 10 Detik](#bagian-23)
24. [Urutan Belajar yang Disarankan](#bagian-24)
25. [Mini Project: Production-Ready Enterprise Generic In-Memory Repository, Polymorphic Event Bus & Type-Safe Database Entity Service](#bagian-25)
26. [Referensi Resmi](#bagian-26)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan Object-Oriented Programming (OOP) di TypeScript & Keunggulan Dibanding JS Classes Biasa

#### Konsep

Pada JavaScript biasa (ES6), `class` tidak memiliki penegakan tipe data statis atau enkapsulasi yang ketat (semua properti defaultnya adalah publik dan rentan terhadap mutasi liar).

**Keunggulan Class di TypeScript**:
1. **Access Modifiers Sejati:** Mengatur batas akses secara formal (`public`, `private`, `protected`, `readonly`).
2. **Type Checking Constructor & Method:** Parameter constructor dan return value method divalidasi saat coding.
3. **Contract Implementation:** Memastikan Class mematuhi satu atau banyak `interface`.

#### Cara Kerja

```text
JavaScript Class (Biasa):
class BankAccount { constructor(balance) { this.balance = balance; } }
account.balance = "LIMA JUTA"; ──> Diterima tanpa error ──> Crash saat kalkulasi bunga ❌

TypeScript Class (Type-Safe):
class BankAccount { private balance: number; ... }
account.balance = "LIMA JUTA"; ──> Compiler Langsung Error: "Property 'balance' is private" ✅
```

**Hafalan:**

```text
TypeScript Class = JavaScript Class + Access Modifiers + Interface Contracts + Compile-Time Safety
```

---

<a id="bagian-2"></a>

## 2. 🟢 Definisi Class, Constructor & Access Modifiers

#### Konsep

Empat Access Modifiers Inti:
- **`public` (Default):** Properti/method dapat diakses dari mana saja (dalam class, turunan, maupun instance luar).
- **`private`:** Hanya dapat diakses **di dalam class itu sendiri** (instance luar dan class turunan dilarang mengakses).
- **`protected`:** Dapat diakses di dalam class itu sendiri **DAN kelas turunannya (*Subclass*)**, tetapi tidak bisa diakses dari instance luar.
- **`readonly`:** Properti hanya bisa diisi nilainya di deklarasi awal atau di dalam `constructor`, setelah itu tidak bisa diubah (*Immutable*).

#### Contoh

```typescript
class BankAccount {
    public readonly accountNumber: string
    private balance: number
    protected accountHolder: string

    constructor(accountNumber: string, initialBalance: number, holder: string) {
        this.accountNumber = accountNumber
        this.balance = initialBalance
        this.accountHolder = holder
    }

    public deposit(amount: number): void {
        if (amount <= 0) throw new Error("Jumlah setoran harus positif!")
        this.balance += amount
    }

    public getBalance(): number {
        return this.balance
    }
}

const myAcc = new BankAccount("ACC-123456", 1000000, "Budi Santoso")
myAcc.deposit(500000)
console.log(`Saldo: Rp ${myAcc.getBalance()}`)

// myAcc.balance = 9999999 ❌ ERROR: Property 'balance' is private
// myAcc.accountNumber = "NEW-ID" ❌ ERROR: Cannot assign to 'accountNumber' because it is read-only
```

**Hafalan:**

```text
public    → bebas diakses dari mana saja
private   → khusus di dalam class sendiri
protected → di dalam class sendiri + subclass turunan
readonly  → tidak dapat dimutasi setelah inisialisasi constructor
```

---

<a id="bagian-3"></a>

## 3. 🟢 Parameter Properties: Shorthand Constructor Deklarasi Otomatis

#### Konsep

Menuliskan properti class dan menginisialisasinya di constructor secara tradisional sangat bertele-tele (*Boilerplate*).

**Parameter Properties Shorthand**:
Dengan menambahkan modifier akses (`public`, `private`, `protected`, atau `readonly`) **langsung pada parameter `constructor`**, TypeScript otomatis:
1. Mendeklarasikan properti class tersebut.
2. Melakukan assign `this.propName = propName` di background secara otomatis.

#### Contoh

```typescript
// ✅ Cara Cerdas & Bersih (Parameter Properties):
class Customer {
    constructor(
        public readonly id: string,
        public name: string,
        private email: string,
        protected tier: "REGULAR" | "VIP" = "REGULAR"
    ) {
        // Tidak perlu menulis this.id = id; this.name = name; dsb!
    }

    public getContactEmail(): string {
        return this.email
    }
}

const cust = new Customer("c-101", "Alimur", "alimur@dev.com")
console.log(cust.name) // "Alimur"
```

**Hafalan:**

```text
constructor(public name: string, private age: number) {} → deklarasi dan assignment otomatis instan
```

---

<a id="bagian-4"></a>

## 4. 🟢 Getters & Setters untuk Enkapsulasi Mutasi Data

#### Konsep

Gunakan accessor **`get`** dan **`set`** untuk mengontrol cara membaca dan mengubah data privat dengan validasi khusus:
- **`get propName(): type`:** Dieksekusi saat membaca properti (`obj.propName`).
- **`set propName(value: type)`:** Dieksekusi saat menetapkan nilai baru (`obj.propName = val`).

#### Contoh

```typescript
class ProductItem {
    constructor(public name: string, private _price: number) {}

    // Getter
    get price(): number {
        return this._price
    }

    // Setter dengan Validasi
    set price(newPrice: number) {
        if (newPrice < 0) {
            throw new Error("Harga produk tidak boleh negatif!")
        }
        this._price = newPrice
    }
}

const item = new ProductItem("Keyboard", 500000)
item.price = 600000 // Memanggil setter
console.log(item.price) // Memanggil getter: 600000
```

**Hafalan:**

```text
get prop(): type { return this._prop; } set prop(val: type) { this._prop = val; }
```

---

<a id="bagian-5"></a>

## 5. 🟢 Static Members & Static Initialization Blocks

#### Konsep

1. **Static Members (`static`):** Properti atau method yang menempel **pada Class itu sendiri**, bukan pada instance objek yang dibuat via `new`.
2. **Static Initialization Blocks (`static { ... }`):** Blok logika untuk menginisialisasi konfigurasi static yang kompleks saat class pertama kali dimuat.

#### Contoh

```typescript
class AppConfiguration {
    public static readonly API_VERSION = "v1"
    public static baseUrl: string

    // Static Initialization Block (TS 4.4+)
    static {
        const env = process.env.NODE_ENV || "development"
        AppConfiguration.baseUrl = env === "production" 
            ? "https://api.perusahaan.com" 
            : "http://localhost:3000"
    }

    public static createEndpoint(path: string): string {
        return `${AppConfiguration.baseUrl}/${AppConfiguration.API_VERSION}/${path}`
    }
}

console.log(AppConfiguration.createEndpoint("users"))
```

**Hafalan:**

```text
static member → properti/method milik Class global tanpa perlu instansiasi new Class()
```

---

<a id="bagian-6"></a>

## 6. 🟢 Class Inheritance & Method Overriding

#### Konsep

Pewarisan Class menggunakan keyword **`extends`**:
- **`super(...args)`:** Wajib dipanggil di baris pertama constructor subclass untuk memicu constructor parent.
- **`override` (TS 4.3+):** Keyword penanda bahwa method sengaja menimpa method parent (mencegah salah ketik nama method).

#### Contoh

```typescript
class NotificationService {
    constructor(public channelName: string) {}

    public send(recipient: string, message: string): void {
        console.log(`[${this.channelName}] Mengirim ke ${recipient}: ${message}`)
    }
}

class EmailNotificationService extends NotificationService {
    constructor(public smtpServer: string) {
        super("EMAIL_CHANNEL") // Panggil constructor parent
    }

    // Menimpa method parent secara eksplisit
    public override send(recipient: string, message: string): void {
        console.log(`Mengubungkan ke SMTP Server ${this.smtpServer}...`)
        super.send(recipient, message)
    }
}
```

**Hafalan:**

```text
class Child extends Parent { constructor() { super(); } override method() {} }
```

---

<a id="bagian-7"></a>

## 7. 🟡 Abstract Classes & Abstract Methods

#### Konsep

**Abstract Class (`abstract class`)**:
- Kelas cetak biru dasar yang **TIDAK BISA di-instansiasi langsung** (`new AbstractClass()` akan ditolak compiler).
- Dapat memuat method konkret biasa dan **Abstract Methods (`abstract methodName(): type`)** yang **wajib diimplementasikan oleh setiap subclass turunan**.

#### Contoh

```typescript
abstract class PaymentProcessor {
    constructor(public gatewayName: string) {}

    // Method konkret bersama:
    public logTransaction(amount: number): void {
        console.log(`[Audit] Transaksi Rp ${amount} via ${this.gatewayName}`)
    }

    // Abstract Method: Wajib di-coding di class anak
    public abstract processPayment(amount: number, accountId: string): boolean
}

class XenditProcessor extends PaymentProcessor {
    constructor() {
        super("Xendit Gateway")
    }

    public processPayment(amount: number, accountId: string): boolean {
        this.logTransaction(amount)
        console.log(`Memotong saldo akun ${accountId} via Xendit API...`)
        return true
    }
}
```

**Hafalan:**

```text
abstract class Base { abstract process(): void; } → template class yang mewajibkan subclass mengimplementasikan method
```

---

<a id="bagian-8"></a>

## 8. 🟡 Mengimplementasikan Multiple Interfaces pada Class

#### Konsep

Sebuah class di TypeScript dapat mengimplementasikan **lebih dari satu interface sekaligus** menggunakan keyword **`implements`** dipisahkan tanda koma.

Ini menjamin class mematuhi banyak kontrak arsitektur (*Separation of Concerns*).

#### Contoh

```typescript
interface IIdentifiable {
    id: string
}

interface IAuditable {
    createdAt: Date
    updatedAt: Date
    logAudit(): void
}

class OrderEntity implements IIdentifiable, IAuditable {
    constructor(
        public id: string,
        public totalAmount: number,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) {}

    public logAudit(): void {
        console.log(`Entitas Order ${this.id} tercatat pada ${this.createdAt.toISOString()}`)
    }
}
```

**Hafalan:**

```text
class MyClass implements InterfaceA, InterfaceB { ... } → mematuhi banyak kontrak interface sekaligus
```

---

<a id="bagian-9"></a>

## 9. 🟡 Pengenalan Generics (`<T>`) & Mental Model Reusability

#### Konsep

Tanpa Generics, jika Anda ingin membuat fungsi penampung yang bisa menerima sembarang tipe:
1. Anda menggunakan `any` $\rightarrow$ **Kehilangan Type Safety dan autocompletion!**
2. Anda membuat 10 fungsi berbeda (`wrapNumber`, `wrapString`, `wrapUser`) $\rightarrow$ **Redundansi kode masif!**

**Solusi: Generics (`<T>`)**:
- `<T>` adalah **Variabel Penampung Tipe Data (*Type Parameter*)**.
- Tipe data baru dikunci saat fungsi/class tersebut dipanggil, sehingga **Type Safety tetap 100% utuh**.

#### Contoh

```typescript
// Fungsi Generik Murni:
function wrapValue<T>(val: T): { value: T; timestamp: Date } {
    return {
        value: val,
        timestamp: new Date()
    }
}

// 1. Dipanggil dengan string -> Return otomatis { value: string, timestamp: Date }
const wrappedStr = wrapValue("Halo TypeScript")
console.log(wrappedStr.value.toUpperCase()) // Autocompletion string aktif!

// 2. Dipanggil dengan number -> Return otomatis { value: number, timestamp: Date }
const wrappedNum = wrapValue(150000)
console.log(wrappedNum.value.toFixed(2)) // Autocompletion number aktif!
```

**Hafalan:**

```text
function fn<T>(arg: T): T → fungsi generik yang mengunci tipe return persis sesuai tipe argumen input
```

---

<a id="bagian-10"></a>

## 10. 🟡 Generic Functions & Multi-Type Parameters

#### Konsep

Kita dapat menggunakan lebih dari satu variabel generik (konvensi penamaan: `T`, `U`, `V`, `K`, `E`):
- `T` : Type
- `U` / `V` : Type ke-2 / ke-3
- `K` : Key
- `E` : Element / Error

#### Contoh

```typescript
// Fungsi Memasangkan Dua Tipe Berbeda Menjadi Tuple
function createPair<T, U>(first: T, second: U): [T, U] {
    return [first, second]
}

const pair1 = createPair("UserID", 101)             // [string, number]
const pair2 = createPair(true, { role: "ADMIN" })   // [boolean, { role: string }]
```

**Hafalan:**

```text
function pair<T, U>(a: T, b: U): [T, U] → fungsi generik dengan multi-parameter tipe
```

---

<a id="bagian-11"></a>

## 11. 🟡 Generic Interfaces & Generic Type Aliases

#### Konsep

Mendefinisikan format respon API atau wrapper data standar yang dapat membungkus model payload apa saja.

#### Contoh

```typescript
// 1. Generic Interface Respon API Standar
interface ApiResponse<TData> {
    statusCode: number
    success: boolean
    message: string
    data: TData
}

// 2. Generic Type Alias Result Monad
type Result<T, E = Error> = 
    | { success: true; value: T }
    | { success: false; error: E }

// Penggunaan Nyata:
interface UserProfile { id: string; name: string }

const response: ApiResponse<UserProfile> = {
    statusCode: 200,
    success: true,
    message: "Berhasil",
    data: { id: "u-1", name: "Budi" }
}
```

**Hafalan:**

```text
interface ApiResponse<T> { status: number; data: T; } → interface generik untuk payload fleksibel
```

---

<a id="bagian-12"></a>

## 12. 🟡 Generic Classes

#### Konsep

Class yang dapat mengelola koleksi data atau logika internal untuk sembarang tipe data secara terisolasi dan type-safe.

#### Contoh

```typescript
class GenericQueue<TItem> {
    private items: TItem[] = []

    public enqueue(item: TItem): void {
        this.items.push(item)
    }

    public dequeue(): TItem | undefined {
        return this.items.shift()
    }

    public size(): number {
        return this.items.length
    }
}

// Antrean String:
const stringQueue = new GenericQueue<string>()
stringQueue.enqueue("Antrean-1")
// stringQueue.enqueue(999) ❌ ERROR: Argument of type 'number' is not assignable to 'string'
```

**Hafalan:**

```text
class DataStore<T> { private data: T[] = []; push(item: T) {} } → generic class type-safe
```

---

<a id="bagian-13"></a>

## 13. 🟡 Generic Constraints dengan Keyword `extends`

#### Konsep

Secara default, `<T>` dapat berupa tipe apa saja. Jika Anda ingin memastikan bahwa `<T>` **wajib memiliki properti tertentu** (misal: harus memiliki properti `id: string`):

Gunakan **Generic Constraints**: `<T extends BaseInterface>`.

#### Contoh

```typescript
interface HasIdentity {
    id: string
}

// Hanya menerima tipe data yang memiliki properti 'id: string'
function logEntityId<T extends HasIdentity>(entity: T): string {
    return `ID Entitas: ${entity.id.toUpperCase()}`
}

logEntityId({ id: "prod-1", name: "Laptop" }) // ✅ Lolos
// logEntityId({ name: "Produk Tanpa ID" }) ❌ ERROR: Property 'id' is missing
```

**Hafalan:**

```text
<T extends HasId>(item: T) → membatasi tipe generik agar wajib memiliki struktur minimal HasId
```

---

<a id="bagian-14"></a>

## 14. 🟡 Operator `keyof` & Generic Property Constraints

#### Konsep

Operator **`keyof T`** menghasilkan gabungan string literal dari seluruh nama properti pada tipe `T`.

Kombinasi `<T, K extends keyof T>`:
Memungkinkan kita membuat fungsi pengambil properti objek yang **100% type-safe** (nama properti divalidasi compiler dan return value otomatis bertipe `T[K]`).

#### Contoh

```typescript
function getProperty<T, K extends keyof T>(targetObject: T, propertyKey: K): T[K] {
    return targetObject[propertyKey]
}

const user = { id: "u-1", name: "Alimur", age: 25 }

const userName = getProperty(user, "name") // Tipe otomatis: string
const userAge = getProperty(user, "age")   // Tipe otomatis: number

// getProperty(user, "alamat") ❌ ERROR: Argument of type '"alamat"' is not assignable to '"id" | "name" | "age"'
```

**Hafalan:**

```text
<T, K extends keyof T>(obj: T, key: K): T[K] → pengambil properti objek yang 100% type-safe
```

---

<a id="bagian-15"></a>

## 15. 🟡 Default Generic Type Parameters

#### Konsep

Sama seperti parameter fungsi biasa yang bisa memiliki nilai default, parameter tipe generik dapat memiliki **tipe default** jika pemanggil tidak menentukannya secara eksplisit.

Format: `<T = DefaultType>`

#### Contoh

```typescript
interface HttpResponse<T = Record<string, unknown>> {
    status: number
    data: T
}

// 1. Menggunakan tipe default (Record<string, unknown>):
const defaultRes: HttpResponse = {
    status: 200,
    data: { customField: "halo" }
}

// 2. Menimpa dengan tipe spesifik:
const userRes: HttpResponse<{ name: string }> = {
    status: 200,
    data: { name: "Budi" }
}
```

**Hafalan:**

```text
<T = string> → menyediakan tipe default jika type parameter tidak didefinisikan secara manual
```

---

<a id="bagian-16"></a>

## 16. 🔴 Utility Types Inti 1: `Partial<T>` & `Required<T>`

#### Konsep

1. **`Partial<T>`:** Mengubah **semua properti tipe `T` menjadi opsional (`?`)**. Sangat ideal untuk payload HTTP `PATCH` / Update DTO.
2. **`Required<T>`:** Menghapus seluruh tanda `?` dan mengubah **semua properti menjadi wajib**.

#### Contoh

```typescript
interface UserProfile {
    id: string
    name: string
    email: string
    bio?: string
}

// 1. Partial: Semua properti jadi opsional
type UpdateUserDto = Partial<UserProfile>
const updateData: UpdateUserDto = { name: "Budi Baru" } // ✅ Valid hanya kirim name

// 2. Required: 'bio' yang tadinya opsional sekarang wajib diisi!
type StrictUserProfile = Required<UserProfile>
```

**Hafalan:**

```text
Partial<T>  → membuat seluruh properti menjadi opsional (ideal untuk update)
Required<T> → membuat seluruh properti menjadi wajib (menghapus tanda ?)
```

---

<a id="bagian-17"></a>

## 17. 🔴 Utility Types Inti 2: `Readonly<T>` & `Record<K, T>`

#### Konsep

1. **`Readonly<T>`:** Mengunci seluruh properti tipe `T` agar **tidak dapat di-assign ulang nilainya**.
2. **`Record<Keys, Type>`:** Membuat tipe objek kamus (*Dictionary / Map*) di mana key-nya bertipe `Keys` dan nilainya bertipe `Type`.

#### Contoh

```typescript
interface Product {
    id: string
    price: number
}

// 1. Readonly
type ImmutableProduct = Readonly<Product>
const p: ImmutableProduct = { id: "p1", price: 50000 }
// p.price = 60000 ❌ ERROR: Cannot assign to 'price' because it is a read-only property

// 2. Record: Kamus Role ke Daftar Hak Akses
type AppRole = "ADMIN" | "USER" | "GUEST"
type RolePermissionsMap = Record<AppRole, string[]>

const permissions: RolePermissionsMap = {
    ADMIN: ["CREATE", "READ", "UPDATE", "DELETE"],
    USER: ["READ", "UPDATE"],
    GUEST: ["READ"]
}
```

**Hafalan:**

```text
Readonly<T>   → mengunci semua properti menjadi immutable
Record<K, T>  → membuat dictionary objek bertipe key K dan value T
```

---

<a id="bagian-18"></a>

## 18. 🔴 Utility Types Inti 3: `Pick<T, K>` & `Omit<T, K>`

#### Konsep

1. **`Pick<T, Keys>`:** Membuat tipe baru dengan **hanya mengambil (*Pick*) properti tertentu** dari tipe `T`.
2. **`Omit<T, Keys>`:** Membuat tipe baru dengan **membuang (*Omit*) properti tertentu** dari tipe `T`.

#### Contoh

```typescript
interface DatabaseUser {
    id: string
    username: string
    email: string
    passwordHash: string
    createdAt: Date
}

// 1. Pick: Hanya ambil 'id', 'username', dan 'email' untuk respon API publik
type PublicUserDto = Pick<DatabaseUser, "id" | "username" | "email">

// 2. Omit: Buang 'passwordHash' dari database record
type SafeUserRecord = Omit<DatabaseUser, "passwordHash">
```

**Hafalan:**

```text
Pick<T, 'k1' | 'k2'> → mengambil subset properti tertentu dari tipe T
Omit<T, 'k1' | 'k2'> → membuang properti tertentu dari tipe T
```

---

<a id="bagian-19"></a>

## 19. 🔴 Generic Factory & Constructor Signatures

#### Konsep

Dalam pola Dependency Injection atau Factory Pattern, kita sering perlu mengoper Class Constructor sebagai parameter dan membuat instance baru secara dinamis.

Tipe Constructor Signature:
`type Constructor<T> = new (...args: any[]) => T`

#### Contoh

```typescript
type ClassConstructor<T> = new (...args: any[]) => T

function instantiateService<T>(ServiceClass: ClassConstructor<T>): T {
    console.log(`[DI Factory] Membuat instance untuk ${ServiceClass.name}...`)
    return new ServiceClass()
}

class AuthService {
    public authenticate() { return "Token Valid" }
}

const authInstance = instantiateService(AuthService) // Tipe otomatis: AuthService
console.log(authInstance.authenticate())
```

**Hafalan:**

```text
new (...args: any[]) => T → tipe constructor generic untuk Factory Pattern dan Dependency Injection
```

---

<a id="bagian-20"></a>

## 20. 🔴 Best Practice & Anti-Pattern Penggunaan Generics

#### Konsep

Generics adalah alat yang sangat kuat, namun sering disalahgunakan (*Over-engineering*).

> [!WARNING]
> **Anti-Pattern 1: Generics yang Tidak Perlu (*Single-Use Generic*)**
> ```typescript
> // ❌ BURUK (Generic mubazir):
> function printName<T extends string>(name: T): void { console.log(name) }
> // ✅ BENAR (Gunakan tipe biasa):
> function printName(name: string): void { console.log(name) }
> ```
>
> **Anti-Pattern 2: Menggunakan Generic Tanpa Mengaitkannya ke Return Value atau State**
> Jika tipe parameter `T` hanya muncul satu kali di parameter dan tidak mempengaruhi return value atau class state, kemungkinan besar Anda tidak membutuhkan generics!

**Hafalan:**

```text
Aturan Emas Generics → gunakan generics hanya jika terdapat hubungan korelasi antara 2 parameter atau antara parameter dan return type
```

---

<a id="bagian-21"></a>

## 21. 🛠️ Peta Ingatan Cepat

```text
                   PETA ARSITEKTUR TYPESCRIPT OOP & GENERICS
                                      │
       ┌──────────────────────────────┼──────────────────────────────┐
       ▼                              ▼                              ▼
OBJECT-ORIENTED PROGRAMMING    GENERICS SYSTEM (<T>)          UTILITY TYPES TRANSFORMATION
├─ Access Modifiers            ├─ Generic Functions & Classes ├─ Partial<T> & Required<T>
├─ Parameter Properties        ├─ Generic Constraints         ├─ Readonly<T> & Record<K,T>
├─ Abstract Classes            ├─ keyof Lookup (T[K])         ├─ Pick<T,K> & Omit<T,K>
└─ implements Multiple         └─ Default Type (<T = string>) └─ Constructor<T> (new)
```

---

<a id="bagian-22"></a>

## 22. 📚 Tabel Ringkasan

| Fitur / Keyword | Kategori | Fungsi & Karakteristik Utama |
|---|---|---|
| `private` / `protected` | Modifier | Mengisolasi akses properti class sendiri vs turunan subclass |
| `Parameter Properties`| Constructor | Shorthand pendeklarasian dan assignment properti class otomatis |
| `abstract class` | OOP | Kelas template yang mewajibkan implementasi method di class anak |
| `implements` | OOP | Menghubungkan class dengan satu atau banyak interface contracts |
| `<T>` | Generics | Type parameter penampung tipe dinamis yang aman saat compile |
| `extends Constraint` | Generics | Membatasi tipe generik agar mematuhi struktur interface tertentu |
| `keyof T` | Tipe Operator | Mengambil kumpulan seluruh nama key properti dari tipe objek T |
| `Partial<T>` | Utility Type | Mengubah seluruh properti tipe T menjadi opsional (`?`) |
| `Required<T>` | Utility Type | Mengubah seluruh properti tipe T menjadi wajib |
| `Pick<T, K>` | Utility Type | Mengambil subset properti K dari tipe T |
| `Omit<T, K>` | Utility Type | Membuang subset properti K dari tipe T |
| `Record<K, T>` | Utility Type | Membuat dictionary objek bertipe key K dan value T |

---

<a id="bagian-23"></a>

## 23. ⚡ Cheat Code TypeScript OOP & Generics 10 Detik

```typescript
// 1. Shorthand Class & Interface Implementation
interface IEntity { id: string }
class BaseService<T extends IEntity> {
  constructor(protected items: T[] = []) {}
  public findById(id: string): T | undefined { return this.items.find(i => i.id === id) }
}

// 2. Type-Safe DTO Transformation via Utility Types
interface User { id: string; name: string; passwordHash: string }
type CreateUserDTO = Omit<User, "id">
type UpdateUserDTO = Partial<CreateUserDTO>
```

---

<a id="bagian-24"></a>

## 24. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Kuasai Class Modern & Access Modifiers
├── Gunakan Parameter Properties untuk menyingkat constructor
└── Enkapsulasi data dengan private, protected, dan getters/setters
       │
       ▼
Langkah 2: Terapkan Abstract Class & Interface Contracts
├── Bangun hierarki class yang rapi menggunakan abstract class
└── Pastikan konsistensi arsitektur dengan implements interface
       │
       ▼
Langkah 3: Bangun Abstraksi Reusable via Generics (<T>)
├── Tulis fungsi generik dan batasi dengan extends constraints
└── Gunakan operator keyof T untuk membaca properti secara type-safe
       │
       ▼
Langkah 4: Kuasai Manipulasi Tipe dengan Utility Types
├── Gunakan Pick & Omit untuk membuat DTO input/output yang bersih
└── Lindungi mutasi state dengan Readonly dan bangun kamus dengan Record
       │
       ▼
Langkah 5: Siap Melangkah ke TypeScript Advanced (Mapped & Conditional Types)!
```

---

<a id="bagian-25"></a>

## 25. 🏗️ Mini Project: Production-Ready Enterprise Generic In-Memory Repository, Polymorphic Event Bus & Type-Safe Database Entity Service

Aplikasi enterprise TypeScript lengkap, modern, dan runnable yang mengintegrasikan: **Abstract Base Service, Generic In-Memory Repository `<T extends BaseEntity>`, Polymorphic Event Bus, `Pick`/`Omit` DTOs, dan `Record` In-Memory Index Store**.

```typescript
// =========================================================================
// 1. DOMAIN CONTRACTS & BASE ENTITIES
// =========================================================================

export interface BaseEntity {
    readonly id: string
    createdAt: Date
    updatedAt: Date
}

// Model User
export interface UserEntity extends BaseEntity {
    name: string
    email: string
    role: "ADMIN" | "STAFF" | "CUSTOMER"
    balance: number
}

// DTOs menggunakan Utility Types:
export type CreateUserDTO = Omit<UserEntity, "id" | "createdAt" | "updatedAt">
export type UpdateUserDTO = Partial<Omit<UserEntity, "id" | "createdAt">>
export type UserPublicSummary = Pick<UserEntity, "id" | "name" | "role">

// =========================================================================
// 2. GENERIC REPOSITORY INTERFACE & IMPLEMENTATION
// =========================================================================

export interface IRepository<T extends BaseEntity> {
    findById(id: string): T | undefined
    findAll(): T[]
    create(dto: Omit<T, "id" | "createdAt" | "updatedAt">): T
    update(id: string, dto: Partial<T>): T | undefined
    delete(id: string): boolean
}

export class InMemoryRepository<T extends BaseEntity> implements IRepository<T> {
    // In-Memory Storage menggunakan Record Dictionary
    private storage: Record<string, T> = {}

    public findById(id: string): T | undefined {
        return this.storage[id]
    }

    public findAll(): T[] {
        return Object.values(this.storage)
    }

    public create(dto: Omit<T, "id" | "createdAt" | "updatedAt">): T {
        const now = new Date()
        const newId = `id-${Math.random().toString(36).substr(2, 9)}`
        
        const newEntity = {
            ...dto,
            id: newId,
            createdAt: now,
            updatedAt: now
        } as T

        this.storage[newId] = newEntity
        return newEntity
    }

    public update(id: string, dto: Partial<T>): T | undefined {
        const existing = this.storage[id]
        if (!existing) return undefined

        const updatedEntity: T = {
            ...existing,
            ...dto,
            updatedAt: new Date()
        }

        this.storage[id] = updatedEntity
        return updatedEntity
    }

    public delete(id: string): boolean {
        if (!this.storage[id]) return false
        delete this.storage[id]
        return true
    }
}

// =========================================================================
// 3. POLYMORPHIC GENERIC EVENT BUS
// =========================================================================

export type EventCallback<TData> = (payload: TData) => void

export class GenericEventBus {
    private listeners: Record<string, Array<EventCallback<any>>> = {}

    public on<TPayload>(eventName: string, callback: EventCallback<TPayload>): void {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = []
        }
        this.listeners[eventName].push(callback)
    }

    public emit<TPayload>(eventName: string, payload: TPayload): void {
        const eventCallbacks = this.listeners[eventName]
        if (eventCallbacks) {
            eventCallbacks.forEach(cb => cb(payload))
        }
    }
}

// =========================================================================
// 4. ABSTRACT BUSINESS SERVICE & USER SERVICE IMPLEMENTATION
// =========================================================================

export abstract class AbstractDomainService<T extends BaseEntity> {
    constructor(
        protected readonly repository: IRepository<T>,
        protected readonly eventBus: GenericEventBus
    ) {}

    public abstract validate(entity: Partial<T>): boolean
}

export class UserService extends AbstractDomainService<UserEntity> {
    constructor(
        repository: IRepository<UserEntity>,
        eventBus: GenericEventBus
    ) {
        super(repository, eventBus)
    }

    public override validate(data: Partial<UserEntity>): boolean {
        if (data.balance !== undefined && data.balance < 0) {
            throw new Error("Saldo user tidak boleh bernilai negatif!")
        }
        return true
    }

    public registerUser(dto: CreateUserDTO): UserPublicSummary {
        this.validate(dto)
        const user = this.repository.create(dto)
        
        // Emit Event Notifikasi
        this.eventBus.emit<UserEntity>("USER_REGISTERED", user)

        // Return hanya field publik (Pick)
        return {
            id: user.id,
            name: user.name,
            role: user.role
        }
    }

    public topUpBalance(userId: string, amount: number): UserEntity {
        const user = this.repository.findById(userId)
        if (!user) throw new Error("User tidak ditemukan!")

        const updated = this.repository.update(userId, {
            balance: user.balance + amount
        })

        if (!updated) throw new Error("Gagal mengupdate saldo!")
        this.eventBus.emit<{ userId: string; newBalance: number }>("BALANCE_UPDATED", {
            userId,
            newBalance: updated.balance
        })

        return updated
    }
}

// =========================================================================
// 5. SIMULASI RUNNABLE
// =========================================================================

// Inisialisasi Event Bus & Repository
const eventBus = new GenericEventBus()
const userRepo = new InMemoryRepository<UserEntity>()
const userService = new UserService(userRepo, eventBus)

// Pasang Listener Event
eventBus.on<UserEntity>("USER_REGISTERED", (user) => {
    console.log(`🔔 [Event Bus] User Baru Terdaftar: ${user.name} (${user.email}) - ID: ${user.id}`)
})

eventBus.on<{ userId: string; newBalance: number }>("BALANCE_UPDATED", (event) => {
    console.log(`💰 [Event Bus] Saldo User ${event.userId} bertambah menjadi Rp ${event.newBalance.toLocaleString('id-ID')}`)
})

// Eksekusi Pendaftaran User
const newUser = userService.registerUser({
    name: "Alimur",
    email: "alimur@dev.com",
    role: "ADMIN",
    balance: 500000
})

console.log("Ringkasan User:", newUser)

// Eksekusi Top Up Saldo
userService.topUpBalance(newUser.id, 250000)
```

#### Hasil Output Eksekusi Terminal

```text
🔔 [Event Bus] User Baru Terdaftar: Alimur (alimur@dev.com) - ID: id-k8j3x9z1a
Ringkasan User: { id: 'id-k8j3x9z1a', name: 'Alimur', role: 'ADMIN' }
💰 [Event Bus] Saldo User id-k8j3x9z1a bertambah menjadi Rp 750.000
```

---

<a id="bagian-26"></a>

## 26. 🔗 Referensi Resmi

- [TypeScript Classes Documentation](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [TypeScript Generics Documentation](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Utility Types Reference](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [TypeScript Keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)
