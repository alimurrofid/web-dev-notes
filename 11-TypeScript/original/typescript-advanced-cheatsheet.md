# TypeScript Advanced & Type Manipulation Cheatsheet — Mudah Dipahami & Diingat

> **Target:** TypeScript 5.5+ untuk pemula yang ingin memahami Type-Level Metaprogramming, Indexed Access Types (`T[K]`), Mapped Types (`[K in keyof T]`), Conditional Types (`T extends U ? X : Y`), Keyword `infer`, Template Literal Types, Advanced Utility Types (`Awaited`, `ReturnType`, `Parameters`, `Exclude`), Declaration Files (`.d.ts`), dan Decorators modern. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> TypeScript memungkinkan manipulasi tipe data layaknya komputasi pemrograman fungsional di waktu kompilasi untuk menghasilkan tipe data yang dinamis, otomatis, dan tahan terhadap perubahan skema.

## Daftar Isi

1. [Indexed Access Types](#1-indexed-access-types)
2. [Mapped Types & Modifiers](#2-mapped-types--modifiers)
3. [Key Remapping dengan as](#3-key-remapping-dengan-as)
4. [Conditional Types](#4-conditional-types)
5. [Keyword infer](#5-keyword-infer)
6. [Template Literal Types](#6-template-literal-types)
7. [Advanced Utility Types](#7-advanced-utility-types)
8. [Declaration Files (.d.ts)](#8-declaration-files-dts)
9. [Decorators Modern](#9-decorators-modern)

---

# 1. Indexed Access Types

Mengambil tipe dari properti tertentu pada interface/tipe yang ada.

```typescript
interface User {
    id: string
    address: { street: string; city: string }
}

type UserAddress = User["address"] // { street: string; city: string }
type UserCity = User["address"]["city"] // string
```

---

# 2. Mapped Types & Modifiers

Mentransformasikan semua properti pada suatu tipe.

```typescript
type MyReadonly<T> = {
    readonly [K in keyof T]: T[K]
}

type MyMutable<T> = {
    -readonly [K in keyof T]-?: T[K] // Hapus readonly dan hapus tanda opsional ?
}
```

---

# 3. Key Remapping dengan as

Mengubah nama key properti saat mapping.

```typescript
type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

interface Person { name: string; age: number }
type PersonGetters = Getters<Person> 
// { getName: () => string; getAge: () => number }
```

---

# 4. Conditional Types

Logika if/else di level tipe data.

```typescript
type IsString<T> = T extends string ? "YA_STRING" : "BUKAN_STRING"

type Test1 = IsString<"Halo"> // "YA_STRING"
type Test2 = IsString<123>    // "BUKAN_STRING"
```

---

# 5. Keyword infer

Mengekstrak tipe di dalam tipe bersarang (misal: unwrap Promise).

```typescript
type UnpackPromise<T> = T extends Promise<infer U> ? U : T

type Result = UnpackPromise<Promise<string>> // string
```

---

# 6. Template Literal Types

Membuat tipe pola string dinamis.

```typescript
type EventType = "click" | "hover"
type Scope = "button" | "card"

type ElementEvent = `${Scope}:${EventType}` 
// "button:click" | "button:hover" | "card:click" | "card:hover"
```

---

# 7. Advanced Utility Types

- `Awaited<Promise<string>>` $\rightarrow$ `string`
- `ReturnType<() => number>` $\rightarrow$ `number`
- `Parameters<(a: string, b: number) => void>` $\rightarrow$ `[string, number]`
- `Exclude<"a" | "b" | "c", "a">` $\rightarrow$ `"b" | "c"`

---

# 8. Declaration Files (.d.ts)

Menambahkan tipe untuk modul eksternal tanpa tipe.

```typescript
// types/global.d.ts
declare module "my-untyped-lib" {
    export function doSomething(val: string): void
}
```

---

# 9. Decorators Modern

Stage 3 Decorators bawaan TypeScript 5.0+.

```typescript
function LogExecution(target: any, context: ClassMethodDecoratorContext) {
    return function (...args: any[]) {
        console.log(`Memanggil method: ${String(context.name)}`)
        return target.apply(this, args)
    }
}
```
