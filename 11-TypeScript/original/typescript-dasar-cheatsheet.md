# TypeScript Dasar Cheatsheet — Mudah Dipahami & Diingat

> **Target:** TypeScript 5.5+ untuk pemula yang ingin memahami Static Typing, Kompilator `tsc`, `tsconfig.json`, Primitive & Special Types (`unknown`, `any`, `never`), Arrays/Tuples, Type Aliases vs Interfaces, Unions/Intersections, `as const`, Functions, Type Assertions, dan Type Narrowing (`typeof`, `instanceof`, `in`, `val is Type`). Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> TypeScript adalah superset dari JavaScript yang menambahkan sistem tipe data statis di waktu kompilasi untuk mencegah bug runtime dan meningkatkan produktivitas developer.

## Daftar Isi

1. [Tipe Primitif](#1-tipe-primitif)
2. [Tipe Khusus: any vs unknown vs never](#2-tipe-khusus-any-vs-unknown-vs-never)
3. [Arrays dan Tuples](#3-arrays-dan-tuples)
4. [Type Aliases dan Interfaces](#4-type-aliases-dan-interfaces)
5. [Union dan Intersection Types](#5-union-dan-intersection-types)
6. [Literal Types dan as const](#6-literal-types-dan-as-const)
7. [Anotasi Fungsi](#7-anotasi-fungsi)
8. [Type Narrowing](#8-type-narrowing)
9. [Custom Type Guards](#9-custom-type-guards)

---

# 1. Tipe Primitif

```typescript
let nama: string = "Alimur"
let usia: number = 25
let isActive: boolean = true
let kosong: null = null
let belumDiisi: undefined = undefined
```

---

# 2. Tipe Khusus: any vs unknown vs never

- `any` : Menonaktifkan pengecekan tipe (berbahaya).
- `unknown` : Tipe tidak diketahui yang aman (wajib type checking sebelum digunakan).
- `never` : Nilai yang tidak pernah terjadi (fungsi infinite loop / error throw).
- `void` : Fungsi yang tidak mengembalikan nilai.

```typescript
let dataAman: unknown = "Halo"
if (typeof dataAman === "string") {
    console.log(dataAman.toUpperCase())
}
```

---

# 3. Arrays dan Tuples

```typescript
// Array
let angka: number[] = [1, 2, 3]

// Tuple (Panjang dan tipe pasti)
let koordinat: [number, number, string] = [10.5, 20.8, "Jakarta"]
```

---

# 4. Type Aliases dan Interfaces

```typescript
// Type Alias
type Point = { x: number; y: number }

// Interface
interface User {
    readonly id: string
    name: string
    age?: number // Opsional
}
```

---

# 5. Union dan Intersection Types

```typescript
// Union (Salah satu tipe)
type Status = "PENDING" | "SUCCESS" | "FAILED"

// Intersection (Gabungan properti)
type Admin = User & { role: "ADMIN" }
```

---

# 6. Literal Types dan as const

```typescript
const CONFIG = {
    env: "production",
    port: 3000
} as const // Mengunci properti menjadi readonly
```

---

# 7. Anotasi Fungsi

```typescript
function hitungTotal(harga: number, diskon: number = 0): number {
    return harga - diskon
}
```

---

# 8. Type Narrowing

```typescript
function cetak(input: string | number) {
    if (typeof input === "string") {
        console.log(input.toUpperCase())
    } else {
        console.log(input.toFixed(2))
    }
}
```

---

# 9. Custom Type Guards

```typescript
interface AdminUser {
    name: string
    permissions: string[]
}

function isAdmin(user: any): user is AdminUser {
    return user && Array.isArray(user.permissions)
}
```
