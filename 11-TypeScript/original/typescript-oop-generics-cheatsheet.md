# TypeScript OOP & Generics Cheatsheet — Mudah Dipahami & Diingat

> **Target:** TypeScript 5.5+ untuk pemula yang ingin memahami Pemrograman Berorientasi Objek (Class, Access Modifiers, Abstract Classes, Multiple Interfaces), Generics dasar hingga lanjutan (`<T>`, Generic Constraints `extends keyof`), dan Utility Types inti (`Partial`, `Required`, `Readonly`, `Record`, `Pick`, `Omit`). Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> TypeScript memperkaya JavaScript dengan enkapsulasi class yang kuat, generic reusability tanpa mengorbankan type safety, dan utility types bawaan untuk memanipulasi struktur tipe data secara deklaratif.

## Daftar Isi

1. [Class & Access Modifiers](#1-class--access-modifiers)
2. [Parameter Properties](#2-parameter-properties)
3. [Abstract Class](#3-abstract-class)
4. [Generics Dasar](#4-generics-dasar)
5. [Generic Constraints](#5-generic-constraints)
6. [keyof & Generic Lookup](#6-keyof--generic-lookup)
7. [Utility Types: Partial & Required](#7-utility-types-partial--required)
8. [Utility Types: Pick & Omit](#8-utility-types-pick--omit)
9. [Utility Types: Record & Readonly](#9-utility-types-record--readonly)

---

# 1. Class & Access Modifiers

- `public` : Dapat diakses dari mana saja (default).
- `private` : Hanya dapat diakses di dalam class itu sendiri.
- `protected` : Dapat diakses di dalam class dan kelas turunannya (subclass).
- `readonly` : Nilai properti tidak dapat diubah setelah constructor.

```typescript
class Account {
    public id: string
    private balance: number
    protected owner: string

    constructor(id: string, balance: number, owner: string) {
        this.id = id
        this.balance = balance
        this.owner = owner
    }

    public getBalance(): number {
        return this.balance
    }
}
```

---

# 2. Parameter Properties

Shorthand untuk mendeklarasikan dan menginisialisasi properti langsung di parameter constructor.

```typescript
class User {
    constructor(
        public name: string,
        private email: string,
        readonly createdAt: Date = new Date()
    ) {}
}
```

---

# 3. Abstract Class

Class template yang tidak bisa di-instansiasi langsung dan mewajibkan subclass mengimplementasikan method abstrak.

```typescript
abstract class PaymentGateway {
    constructor(public apiKey: string) {}
    abstract processPayment(amount: number): boolean
}

class MidtransGateway extends PaymentGateway {
    processPayment(amount: number): boolean {
        console.log(`Memproses Rp ${amount} via Midtrans`)
        return true
    }
}
```

---

# 4. Generics Dasar

Membuat fungsi atau interface fleksibel untuk sembarang tipe data.

```typescript
function wrapInArray<T>(item: T): T[] {
    return [item]
}

const numArr = wrapInArray(42)       // number[]
const strArr = wrapInArray("Halo")   // string[]
```

---

# 5. Generic Constraints

Membatasi tipe data generik dengan keyword `extends`.

```typescript
interface HasId {
    id: string
}

function printId<T extends HasId>(entity: T): string {
    return `ID: ${entity.id}`
}
```

---

# 6. keyof & Generic Lookup

Mengambil nilai properti objek secara type-safe.

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key]
}
```

---

# 7. Utility Types: Partial & Required

```typescript
interface UserProfile {
    name: string
    email: string
    age: number
}

// Semua properti jadi opsional:
type UserUpdateDTO = Partial<UserProfile>

// Semua properti jadi wajib:
type StrictProfile = Required<UserProfile>
```

---

# 8. Utility Types: Pick & Omit

```typescript
// Hanya ambil 'name' dan 'email'
type UserSummary = Pick<UserProfile, "name" | "email">

// Buang properti 'age'
type UserWithoutAge = Omit<UserProfile, "age">
```

---

# 9. Utility Types: Record & Readonly

```typescript
// Kamus Key-Value: Record<K, T>
type UserRoleDictionary = Record<string, string[]>

// Mengunci seluruh properti agar tidak bisa dimutasi:
type ImmutableUser = Readonly<UserProfile>
```
