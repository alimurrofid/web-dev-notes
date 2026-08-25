# JavaScript Dasar Cheatsheet — Mudah Dipahami & Diingat

> **Target:** JavaScript modern (ES2020+) untuk pemula. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> JavaScript adalah bahasa pemrograman yang banyak digunakan untuk membuat halaman web interaktif, tetapi juga dapat berjalan di luar browser, misalnya dengan Node.js.

## Daftar Isi

1. [Pengenalan JavaScript](#1-pengenalan-javascript)
2. [Program Hello World](#2-program-hello-world)
3. [Komentar](#3-komentar)
4. [Tipe Data Number](#4-tipe-data-number)
5. [Tipe Data Boolean](#5-tipe-data-boolean)
6. [Tipe Data String](#6-tipe-data-string)
7. [Variable](#7-variable)
8. [Operator Matematika](#8-operator-matematika)
9. [Operator Perbandingan](#9-operator-perbandingan)
10. [Operator Logika](#10-operator-logika)
11. [Console](#11-console)
12. [String Template](#12-string-template)
13. [Konversi String dan Number](#13-konversi-string-dan-number)
14. [Tipe Data Array](#14-tipe-data-array)
15. [Tipe Data Object](#15-tipe-data-object)
16. [If Expression](#16-if-expression)
17. [Popup](#17-popup)
18. [Undefined](#18-undefined)
19. [Null](#19-null)
20. [Switch Expression](#20-switch-expression)
21. [Operator typeof](#21-operator-typeof)
22. [Operator in](#22-operator-in)
23. [Ternary Operator](#23-ternary-operator)
24. [Nullish Coalescing Operator](#24-nullish-coalescing-operator)
25. [Optional Chaining](#25-optional-chaining)
26. [Falsy dan Truthy](#26-falsy-dan-truthy)
27. [Operator Logika di Non Boolean](#27-operator-logika-di-non-boolean)
28. [For Loop](#28-for-loop)
29. [While Loop](#29-while-loop)
30. [Do While Loop](#30-do-while-loop)
31. [Break dan Continue](#31-break-dan-continue)
32. [Label](#32-label)
33. [For In](#33-for-in)
34. [For Of](#34-for-of)
35. [With Statement](#35-with-statement)
36. [Function](#36-function)
37. [Function Parameter](#37-function-parameter)
38. [Function Return Value](#38-function-return-value)
39. [Optional Parameter](#39-optional-parameter)
40. [Default Parameter](#40-default-parameter)
41. [Rest Parameter](#41-rest-parameter)
42. [Function Sebagai Value](#42-function-sebagai-value)
43. [Anonymous Function](#43-anonymous-function)
44. [Function dalam Function](#44-function-dalam-function)
45. [Scope](#45-scope)
46. [Recursive Function](#46-recursive-function)
47. [Function Generator](#47-function-generator)
48. [Arrow Function](#48-arrow-function)
49. [Closure](#49-closure)
50. [Object Method](#50-object-method)
51. [Kata Kunci this](#51-kata-kunci-this)
52. [Arrow Function di Object](#52-arrow-function-di-object)
53. [Getter dan Setter](#53-getter-dan-setter)
54. [Masalah Variable var](#54-masalah-variable-var)
55. [Destructuring](#55-destructuring)
56. [Strict Mode](#56-strict-mode)
57. [Debugger](#57-debugger)
58. [Tabel Ringkasan](#58-tabel-ringkasan)
59. [Mini Project](#59-mini-project)
60. [Cheat Code JavaScript 10 Detik](#60-cheat-code-javascript-10-detik)
61. [Referensi Resmi](#61-referensi-resmi)

---

# 1. Pengenalan JavaScript

JavaScript adalah bahasa pemrograman yang dapat berjalan di browser dan juga di runtime seperti Node.js.

Diagram sederhana:

```text
Browser
   │
   ├── HTML → struktur
   ├── CSS  → tampilan
   └── JS   → perilaku / logic
```

Contoh:

```html
<script>
    console.log("Halo JavaScript!");
</script>
```

**Ciri penting JavaScript:**

```text
JavaScript
├── dynamically typed
├── case-sensitive
├── statement biasanya diakhiri ;
├── block kode menggunakan {}
└── function adalah first-class value
```

**Hafalan:**

```text
HTML → apa yang ada
CSS  → bagaimana tampilannya
JS   → bagaimana perilakunya
```

---

# 2. Program Hello World

Cara paling sederhana:

```javascript
console.log("Hello World!");
```

Output:

```text
Hello World!
```

Di browser, JavaScript juga dapat ditulis di HTML:

```html
<!DOCTYPE html>
<html>
<body>

<script>
    console.log("Hello World!");
</script>

</body>
</html>
```

**Hafalan:**

```text
console.log() = tampilkan ke console
```

---

# 3. Komentar

Komentar tidak dieksekusi sebagai kode.

## Single-line

```javascript
// Ini komentar
```

## Multi-line

```javascript
/*
    Ini komentar
    lebih dari satu baris
*/
```

Contoh:

```javascript
// Menampilkan nama
console.log("Budi");
```

**Hafalan:**

```text
//      → satu baris
/* */   → banyak baris
```

---

# 4. Tipe Data Number

JavaScript menggunakan `number` untuk integer maupun desimal.

```javascript
let age = 20;
let price = 19.99;
let temperature = -2.5;
```

Contoh:

```javascript
console.log(10);
console.log(10.5);
```

JavaScript juga memiliki `bigint` untuk bilangan integer yang sangat besar:

```javascript
const bigNumber = 12345678901234567890n;
```

**Hafalan:**

```text
10      → number
10.5    → number
123n    → bigint
```

> Untuk operasi angka biasa, `number` adalah tipe yang paling sering digunakan.

---

# 5. Tipe Data Boolean

Boolean hanya memiliki:

```javascript
true
false
```

Contoh:

```javascript
const isLogin = true;
const isAdmin = false;
```

Boolean banyak digunakan untuk kondisi:

```javascript
if (isLogin) {
    console.log("Selamat datang");
}
```

Output:

```text
Selamat datang
```

**Hafalan:**

```text
true  → ya
false → tidak
```

---

# 6. Tipe Data String

String adalah teks.

```javascript
const name = "Budi";
const city = 'Bandung';
```

JavaScript mendukung single quote, double quote, dan backtick.

```javascript
const a = "Hello";
const b = 'Hello';
const c = `Hello`;
```

## Concatenation

Gunakan `+`:

```javascript
const name = "Budi";

console.log("Halo " + name);
```

Output:

```text
Halo Budi
```

Untuk string modern, template literal biasanya lebih nyaman.

**Hafalan:**

```text
"..." → string
'...' → string
`...` → template literal
+     → gabungkan string
```

---

# 7. Variable

Variable digunakan untuk menyimpan nilai.

JavaScript modern menggunakan `let` dan `const`.

```javascript
let name = "Budi";
const age = 20;
```

## Mengubah nilai

`let` dapat diubah:

```javascript
let count = 10;

count = 20;

console.log(count);
```

Output:

```text
20
```

`const` tidak dapat di-assign ulang:

```javascript
const name = "Budi";

// name = "Andi"; // TypeError
```

## Aturan nama variable

Valid:

```javascript
let name;
let userName;
let user_name;
let $value;
let _value;
```

Tidak valid:

```javascript
// let 1name;
// let user-name;
```

**Hafalan:**

```text
let   → boleh di-assign ulang
const → tidak boleh di-assign ulang
```

> `const` tidak berarti object/array menjadi immutable. Yang tidak boleh diubah adalah binding-nya.

---

# 8. Operator Matematika

Operator dasar:

| Operator | Fungsi | Contoh |
| --- | --- | --- |
| `+` | tambah | `10 + 3` |
| `-` | kurang | `10 - 3` |
| `*` | kali | `10 * 3` |
| `/` | bagi | `10 / 3` |
| `%` | sisa bagi | `10 % 3` |
| `**` | pangkat | `2 ** 3` |

Contoh:

```javascript
const a = 10;
const b = 3;

console.log(a + b);
console.log(a - b);
console.log(a * b);
console.log(a / b);
console.log(a % b);
console.log(a ** b);
```

Output:

```text
13
7
30
3.3333333333333335
1
1000
```

## Increment dan decrement

```javascript
let count = 1;

count++;
count--;

console.log(count);
```

**Hafalan:**

```text
+  -  *  /  %  **
++ --
```

---

# 9. Operator Perbandingan

Operator utama:

| Operator | Arti |
| --- | --- |
| `==` | sama setelah coercion |
| `===` | sama nilai dan tipe |
| `!=` | tidak sama setelah coercion |
| `!==` | tidak sama nilai atau tipe |
| `<` | kurang dari |
| `>` | lebih dari |
| `<=` | kurang dari / sama |
| `>=` | lebih dari / sama |

## `==` vs `===`

```javascript
console.log(5 == "5");
console.log(5 === "5");
```

Output:

```text
true
false
```

Karena:

```text
5 == "5"
↓
coercion
↓
true

5 === "5"
↓
number !== string
↓
false
```

**Best practice umum:**

```text
gunakan === dan !==
```

---

# 10. Operator Logika

| Operator | Arti |
| --- | --- |
| `&&` | AND |
| `||` | OR |
| `!` | NOT |

Contoh:

```javascript
const age = 20;
const isMember = true;

if (age >= 18 && isMember) {
    console.log("Boleh masuk");
}
```

Output:

```text
Boleh masuk
```

## Truth table sederhana

```text
AND (&&)

true  && true  = true
true  && false = false
false && true  = false
false && false = false
```

```text
OR (||)

true  || true  = true
true  || false = true
false || true  = true
false || false = false
```

```text
NOT (!)

!true  = false
!false = true
```

**Hafalan:**

```text
&& → semua harus true
|| → salah satu cukup true
!  → kebalikan
```

---

# 11. Console

`console` digunakan untuk debugging dan melihat informasi saat program berjalan.

## `console.log()`

```javascript
console.log("Hello");
```

## `console.error()`

```javascript
console.error("Terjadi error");
```

## `console.warn()`

```javascript
console.warn("Hati-hati");
```

## `console.table()`

```javascript
const users = [
    { name: "Budi", age: 20 },
    { name: "Andi", age: 25 }
];

console.table(users);
```

## Melihat tipe data

```javascript
const value = 10;

console.log(typeof value);
```

Output:

```text
number
```

**Hafalan:**

```text
console.log()   → info
console.error() → error
console.warn()  → warning
console.table() → data tabel
```

---

# 12. String Template

Template literal menggunakan backtick `` ` ``.

```javascript
const name = "Budi";
const age = 20;

console.log(`Halo ${name}, umur kamu ${age}`);
```

Output:

```text
Halo Budi, umur kamu 20
```

## Expression di dalam template

```javascript
const a = 10;
const b = 5;

console.log(`Hasil = ${a + b}`);
```

Output:

```text
Hasil = 15
```

**Hafalan:**

```text
`Halo ${name}`
       ↑
   expression
```

---

# 13. Konversi String dan Number

## Number → String

Gunakan `String()`:

```javascript
const number = 100;

const text = String(number);

console.log(text);
console.log(typeof text);
```

Output:

```text
100
string
```

Bisa juga:

```javascript
const text = (100).toString();
```

## String → Number

Gunakan `Number()`:

```javascript
const text = "100";

const number = Number(text);

console.log(number);
console.log(typeof number);
```

Output:

```text
100
number
```

## `parseInt()`

```javascript
console.log(parseInt("100px", 10));
```

Output:

```text
100
```

## `parseFloat()`

```javascript
console.log(parseFloat("10.5px"));
```

Output:

```text
10.5
```

## Konversi gagal

```javascript
console.log(Number("hello"));
```

Output:

```text
NaN
```

**Hafalan:**

```text
String(100)      → "100"
Number("100")    → 100
parseInt("10px") → 10
parseFloat(...)  → desimal
```

---

# 14. Tipe Data Array

Array digunakan untuk menyimpan banyak nilai.

```javascript
const fruits = [
    "Apple",
    "Banana",
    "Orange"
];
```

Index dimulai dari `0`:

```text
0 → Apple
1 → Banana
2 → Orange
```

Akses:

```javascript
console.log(fruits[0]);
```

Output:

```text
Apple
```

## Mengubah item

```javascript
fruits[0] = "Mango";
```

## Menambah item

```javascript
fruits.push("Durian");
```

## Nested array

```javascript
const matrix = [
    [1, 2],
    [3, 4]
];

console.log(matrix[0][1]);
```

Output:

```text
2
```

**Hafalan:**

```text
array[index]
index dimulai dari 0
```

---

# 15. Tipe Data Object

Object menyimpan data dalam bentuk property `key: value`.

```javascript
const user = {
    name: "Budi",
    age: 20,
    city: "Bandung"
};
```

Akses dengan dot:

```javascript
console.log(user.name);
```

Output:

```text
Budi
```

Akses dengan bracket:

```javascript
console.log(user["age"]);
```

Output:

```text
20
```

## Menambah property

```javascript
user.email = "budi@example.com";
```

## Nested object

```javascript
const user = {
    name: "Budi",
    address: {
        city: "Bandung"
    }
};

console.log(user.address.city);
```

**Hafalan:**

```text
object.property
object["property"]
```

---

# 16. If Expression

Digunakan untuk mengambil keputusan.

```javascript
const age = 20;

if (age >= 18) {
    console.log("Dewasa");
}
```

## if - else

```javascript
const age = 15;

if (age >= 18) {
    console.log("Dewasa");
} else {
    console.log("Anak-anak");
}
```

## if - else if - else

```javascript
const score = 85;

if (score >= 90) {
    console.log("A");
} else if (score >= 80) {
    console.log("B");
} else {
    console.log("C");
}
```

Output:

```text
B
```

**Hafalan:**

```text
if
├── true  → jalankan blok
└── false → cek else / else if
```

---

# 17. Popup

Browser menyediakan beberapa popup bawaan.

## `alert()`

```javascript
alert("Selamat datang!");
```

Menampilkan pesan.

## `confirm()`

```javascript
const result = confirm("Hapus data?");

console.log(result);
```

Hasil:

```text
true  → OK
false → Cancel
```

## `prompt()`

```javascript
const name = prompt("Siapa nama kamu?");

console.log(name);
```

`prompt()` mengembalikan string atau `null` jika dibatalkan.

**Hafalan:**

```text
alert()   → informasi
confirm() → tanya OK/Cancel
prompt()  → minta input
```

> Popup ini adalah API browser, bukan fitur khusus bahasa JavaScript yang tersedia di semua runtime.

---

# 18. Undefined

`undefined` berarti nilai belum diberikan atau property tidak ditemukan.

```javascript
let name;

console.log(name);
```

Output:

```text
undefined
```

Property yang tidak ada:

```javascript
const user = {};

console.log(user.name);
```

Output:

```text
undefined
```

Function tanpa `return` juga menghasilkan `undefined`:

```javascript
function test() {
}

console.log(test());
```

**Hafalan:**

```text
undefined = tidak ada nilai yang diberikan
```

---

# 19. Null

`null` biasanya digunakan secara sengaja untuk menyatakan "tidak ada nilai".

```javascript
const user = null;

console.log(user);
```

Output:

```text
null
```

Perbedaan:

```text
undefined → nilai belum tersedia / tidak diberikan
null      → sengaja menyatakan tidak ada nilai
```

Contoh:

```javascript
let selectedUser = null;

if (selectedUser === null) {
    console.log("Belum memilih user");
}
```

**Catatan:**

```javascript
typeof null
```

menghasilkan:

```text
"object"
```

Ini adalah perilaku historis JavaScript.

---

# 20. Switch Expression

`switch` cocok ketika satu nilai dibandingkan dengan beberapa pilihan.

```javascript
const role = "admin";

switch (role) {
    case "admin":
        console.log("Dashboard Admin");
        break;

    case "user":
        console.log("Dashboard User");
        break;

    default:
        console.log("Guest");
}
```

Output:

```text
Dashboard Admin
```

## Jangan lupa `break`

```javascript
switch (role) {
    case "admin":
        console.log("Admin");
        break;
}
```

Tanpa `break`, eksekusi dapat berlanjut ke `case` berikutnya.

**Hafalan:**

```text
switch(value)
├── case A
├── case B
└── default
```

> `switch` adalah statement, bukan expression yang mengembalikan nilai seperti `switch` pada beberapa bahasa lain.

---

# 21. Operator typeof

`typeof` digunakan untuk mengetahui tipe data.

```javascript
console.log(typeof 10);
console.log(typeof "Hello");
console.log(typeof true);
console.log(typeof undefined);
```

Output:

```text
number
string
boolean
undefined
```

Contoh:

```javascript
const value = 10;

if (typeof value === "number") {
    console.log("Ini number");
}
```

Tipe umum:

```text
typeof 10          → "number"
typeof "PHP"       → "string"
typeof true        → "boolean"
typeof undefined   → "undefined"
typeof null        → "object"
typeof {}          → "object"
typeof []           → "object"
typeof function(){} → "function"
```

**Hafalan:**

```text
typeof value → "nama tipe"
```

---

# 22. Operator in

Operator `in` digunakan untuk mengecek apakah property/index ada pada object.

```javascript
const user = {
    name: "Budi",
    age: 20
};

console.log("name" in user);
console.log("email" in user);
```

Output:

```text
true
false
```

Pada array, `in` mengecek **index**, bukan isi:

```javascript
const fruits = ["Apple", "Banana"];

console.log(0 in fruits);
console.log("Apple" in fruits);
```

Output:

```text
true
false
```

**Hafalan:**

```text
property in object
```

---

# 23. Ternary Operator

Ternary adalah bentuk singkat dari `if/else`.

```javascript
const age = 20;

const status = age >= 18
    ? "Dewasa"
    : "Anak-anak";

console.log(status);
```

Output:

```text
Dewasa
```

Bentuk panjang:

```javascript
let status;

if (age >= 18) {
    status = "Dewasa";
} else {
    status = "Anak-anak";
}
```

**Hafalan:**

```text
condition ? true : false
```

---

# 24. Nullish Coalescing Operator

Gunakan `??` untuk fallback ketika nilai `null` atau `undefined`.

```javascript
const name = null;

const result = name ?? "Guest";

console.log(result);
```

Output:

```text
Guest
```

Perhatikan perbedaannya dengan `||`:

```javascript
console.log(0 || "fallback");
console.log(0 ?? "fallback");
```

Output:

```text
fallback
0
```

Karena `??` hanya menganggap `null` dan `undefined` sebagai nullish.

**Hafalan:**

```text
?? = kalau null/undefined, pakai cadangan
```

---

# 25. Optional Chaining

Optional chaining `?.` digunakan untuk mengakses property tanpa error ketika bagian sebelumnya `null` atau `undefined`.

```javascript
const user = {
    profile: {
        name: "Budi"
    }
};

console.log(user.profile?.name);
```

Output:

```text
Budi
```

Jika `profile` tidak ada:

```javascript
const user = {};

console.log(user.profile?.name);
```

Output:

```text
undefined
```

Tanpa `?.`, akses berantai seperti `user.profile.name` dapat menghasilkan error jika `profile` tidak ada.

## Optional method call

```javascript
const user = {
    sayHello() {
        console.log("Hello");
    }
};

user.sayHello?.();
```

**Hafalan:**

```text
object?.property
object?.method?.()
```

---

# 26. Falsy dan Truthy

JavaScript memiliki nilai yang dianggap `false` dalam konteks boolean.

## Falsy

Nilai falsy utama:

```text
false
0
-0
0n
""
null
undefined
NaN
```

Contoh:

```javascript
if ("") {
    console.log("true");
} else {
    console.log("false");
}
```

Output:

```text
false
```

## Truthy

Hampir semua nilai lain adalah truthy.

Contoh:

```javascript
if ("Hello") {
    console.log("true");
}
```

Output:

```text
true
```

Perhatikan:

```javascript
Boolean("false"); // true
Boolean([]);      // true
Boolean({});      // true
```

**Hafalan:**

```text
Falsy  → dianggap false
Truthy → dianggap true
```

---

# 27. Operator Logika di Non Boolean

Operator `&&` dan `||` tidak selalu menghasilkan boolean.

## `&&`

Mengembalikan operand pertama yang falsy, atau operand terakhir jika semuanya truthy.

```javascript
console.log("A" && "B");
console.log(0 && "B");
```

Output:

```text
B
0
```

## `||`

Mengembalikan operand pertama yang truthy.

```javascript
console.log("" || "Guest");
console.log("Budi" || "Guest");
```

Output:

```text
Guest
Budi
```

## `??`

Mengembalikan nilai kanan hanya jika kiri `null` atau `undefined`.

```javascript
console.log(null ?? "Guest");
console.log(0 ?? "Guest");
```

Output:

```text
Guest
0
```

**Hafalan:**

```text
&& → cari falsy
|| → cari truthy
?? → cari non-nullish
```

---

# 28. For Loop

Digunakan ketika jumlah iterasi dikontrol oleh counter.

```javascript
for (let i = 1; i <= 5; i++) {
    console.log(i);
}
```

Output:

```text
1
2
3
4
5
```

Struktur:

```text
for (
    initialization;
    condition;
    increment
)
```

Diagram:

```text
init
 │
 ▼
condition ── false ──> selesai
 │
true
 │
 ▼
body
 │
 ▼
increment
 │
 └──────────────> condition
```

**Hafalan:**

```text
init → condition → body → increment
```

---

# 29. While Loop

`while` menjalankan block selama kondisi true.

```javascript
let i = 1;

while (i <= 5) {
    console.log(i);
    i++;
}
```

Output:

```text
1
2
3
4
5
```

Pastikan kondisi akhirnya berubah agar tidak terjadi infinite loop.

**Hafalan:**

```text
while = cek dulu, baru jalankan
```

---

# 30. Do While Loop

Perbedaan utama:

```text
while    → cek dulu
do while → jalankan dulu
```

Contoh:

```javascript
let i = 10;

do {
    console.log(i);
    i++;
} while (i <= 5);
```

Output:

```text
10
```

Walaupun kondisi awal false, body tetap dijalankan sekali.

**Hafalan:**

```text
do while = minimal 1 kali
```

---

# 31. Break dan Continue

## `break`

Menghentikan loop.

```javascript
for (let i = 1; i <= 10; i++) {
    if (i === 5) {
        break;
    }

    console.log(i);
}
```

Output:

```text
1
2
3
4
```

## `continue`

Melewati iterasi saat ini.

```javascript
for (let i = 1; i <= 5; i++) {
    if (i === 3) {
        continue;
    }

    console.log(i);
}
```

Output:

```text
1
2
4
5
```

**Hafalan:**

```text
break    → keluar
continue → lewati
```

---

# 32. Label

Label memberi nama pada statement atau loop.

```javascript
outerLoop:
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (i === 1 && j === 1) {
            break outerLoop;
        }

        console.log(i, j);
    }
}
```

`break outerLoop` menghentikan loop yang diberi label.

`continue` juga dapat menggunakan label:

```javascript
outerLoop:
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (j === 1) {
            continue outerLoop;
        }

        console.log(i, j);
    }
}
```

**Catatan:** label jarang diperlukan. Gunakan hanya jika membuat alur nested loop lebih jelas.

**Hafalan:**

```text
label:
    statement

break label;
continue label;
```

---

# 33. For In

`for...in` digunakan untuk mengiterasi **property enumerable** dari object.

```javascript
const user = {
    name: "Budi",
    age: 20
};

for (const key in user) {
    console.log(key, user[key]);
}
```

Output:

```text
name Budi
age 20
```

Pada array, `for...in` menghasilkan index:

```javascript
const fruits = ["Apple", "Banana"];

for (const index in fruits) {
    console.log(index);
}
```

Output:

```text
0
1
```

**Hafalan:**

```text
for...in → key / property
```

> Untuk array, biasanya lebih baik gunakan `for...of` atau method array seperti `forEach()`.

---

# 34. For Of

`for...of` digunakan untuk mengiterasi **value** dari iterable seperti array dan string.

```javascript
const fruits = [
    "Apple",
    "Banana",
    "Orange"
];

for (const fruit of fruits) {
    console.log(fruit);
}
```

Output:

```text
Apple
Banana
Orange
```

String juga iterable:

```javascript
for (const char of "ABC") {
    console.log(char);
}
```

Output:

```text
A
B
C
```

**Hafalan:**

```text
for...in → key
for...of → value
```

---

# 35. With Statement

`with` memperpendek akses property dengan memasukkan object ke lexical environment.

```javascript
const user = {
    name: "Budi",
    age: 20
};
```

Secara historis, `with` dapat digunakan seperti:

```javascript
with (user) {
    console.log(name);
    console.log(age);
}
```

Namun **jangan gunakan `with` dalam kode modern**.

Alasannya antara lain:
- membuat scope sulit diprediksi;
- mengurangi keterbacaan;
- tidak tersedia dalam strict mode;
- dapat menyebabkan ambiguitas nama variable.

Gunakan:

```javascript
console.log(user.name);
console.log(user.age);
```

**Hafalan:**

```text
with → hindari
```

---

# 36. Function

Function adalah blok kode yang dapat dipanggil berulang kali.

```javascript
function sayHello() {
    console.log("Hello JavaScript");
}

sayHello();
```

Output:

```text
Hello JavaScript
```

Function dapat mengembalikan nilai:

```javascript
function getName() {
    return "Budi";
}

console.log(getName());
```

Output:

```text
Budi
```

**Hafalan:**

```text
function = bungkus logic agar reusable
```

---

# 37. Function Parameter

Parameter adalah variable yang menerima nilai ketika function dipanggil.

```javascript
function greet(name) {
    console.log(`Halo ${name}`);
}

greet("Budi");
```

Output:

```text
Halo Budi
```

Multiple parameter:

```javascript
function add(a, b) {
    return a + b;
}

console.log(add(10, 5));
```

Output:

```text
15
```

### Parameter vs Argument

```text
function greet(name)
              ↑
          parameter

greet("Budi");
      ↑
    argument
```

**Hafalan:**

```text
parameter → saat define
argument  → saat call
```

---

# 38. Function Return Value

Function dapat mengembalikan nilai menggunakan `return`.

```javascript
function add(a, b) {
    return a + b;
}

const result = add(10, 5);

console.log(result);
```

Output:

```text
15
```

`return` juga menghentikan eksekusi function:

```javascript
function test() {
    return "Selesai";

    console.log("Tidak dijalankan");
}
```

**Hafalan:**

```text
return = kirim nilai keluar + hentikan function
```

---

# 39. Optional Parameter

JavaScript tidak memiliki syntax khusus `optional parameter` seperti beberapa bahasa.

Secara praktik, parameter dapat tidak diberikan:

```javascript
function greet(name) {
    console.log(name);
}

greet();
```

Output:

```text
undefined
```

Kita dapat memeriksa:

```javascript
function greet(name) {
    if (name === undefined) {
        console.log("Halo Guest");
        return;
    }

    console.log(`Halo ${name}`);
}
```

Atau gunakan default parameter:

```javascript
function greet(name = "Guest") {
    console.log(`Halo ${name}`);
}

greet();
```

**Hafalan:**

```text
argument tidak dikirim → parameter = undefined
```

---

# 40. Default Parameter

Default parameter memberi nilai cadangan jika argument bernilai `undefined`.

```javascript
function greet(name = "Guest") {
    console.log(`Halo ${name}`);
}

greet();
greet("Budi");
```

Output:

```text
Halo Guest
Halo Budi
```

Perhatikan:

```javascript
greet(undefined); // Guest
greet(null);      // null
```

`null` tidak memicu default parameter.

**Hafalan:**

```text
undefined → pakai default
null      → tetap null
```

---

# 41. Rest Parameter

Rest parameter `...` mengumpulkan sisa argument menjadi array.

```javascript
function sum(...numbers) {
    let total = 0;

    for (const number of numbers) {
        total += number;
    }

    return total;
}

console.log(sum(1, 2, 3, 4));
```

Output:

```text
10
```

Dengan parameter biasa:

```javascript
function greet(firstName, ...others) {
    console.log(firstName);
    console.log(others);
}

greet("Budi", "Andi", "Siti");
```

Output:

```text
Budi
["Andi", "Siti"]
```

**Hafalan:**

```text
...args → kumpulkan sisa argument menjadi array
```

---

# 42. Function Sebagai Value

Di JavaScript, function adalah **first-class value**.

Function dapat disimpan di variable:

```javascript
function sayHello() {
    console.log("Hello");
}

const fn = sayHello;

fn();
```

Function juga dapat dikirim sebagai argument:

```javascript
function execute(callback) {
    callback();
}

execute(sayHello);
```

Function dapat dikembalikan dari function lain:

```javascript
function createGreeting() {
    return function () {
        console.log("Hello");
    };
}

const greeting = createGreeting();

greeting();
```

**Hafalan:**

```text
function bisa:
→ disimpan
→ dikirim
→ dikembalikan
```

---

# 43. Anonymous Function

Anonymous function adalah function tanpa nama.

```javascript
const greet = function (name) {
    return `Halo ${name}`;
};

console.log(greet("Budi"));
```

Output:

```text
Halo Budi
```

Anonymous function sering digunakan sebagai callback:

```javascript
const numbers = [1, 2, 3];

const result = numbers.map(function (number) {
    return number * 2;
});

console.log(result);
```

Output:

```text
[2, 4, 6]
```

**Hafalan:**

```text
function (...) {
    ...
}
```

= function tanpa nama.

---

# 44. Function dalam Function

Function dapat didefinisikan di dalam function lain.

```javascript
function outer() {
    function inner() {
        console.log("Inner");
    }

    inner();
}

outer();
```

Output:

```text
Inner
```

Function `inner` hanya dapat diakses dari scope `outer`.

Contoh lain:

```javascript
function calculate(a, b) {
    function add() {
        return a + b;
    }

    return add();
}

console.log(calculate(10, 5));
```

Output:

```text
15
```

**Hafalan:**

```text
function di dalam function
→ inner function
```

---

# 45. Scope

Scope menentukan di mana variable dapat diakses.

## Global scope

```javascript
const name = "Budi";

console.log(name);
```

## Function scope

```javascript
function sayHello() {
    const name = "Budi";

    console.log(name);
}

sayHello();
```

`name` tidak dapat diakses di luar function.

## Block scope

`let` dan `const` memiliki block scope:

```javascript
if (true) {
    let message = "Hello";
    const age = 20;

    console.log(message);
}

// message tidak dapat digunakan di sini
```

Diagram:

```text
Global
│
├── function scope
│   └── local variables
│
└── block scope
    ├── let
    └── const
```

**Hafalan:**

```text
let / const → block scoped
var         → function scoped
```

---

# 46. Recursive Function

Recursive function adalah function yang memanggil dirinya sendiri.

Contoh faktorial:

```javascript
function factorial(number) {
    if (number <= 1) {
        return 1;
    }

    return number * factorial(number - 1);
}

console.log(factorial(5));
```

Output:

```text
120
```

Alurnya:

```text
factorial(5)
  ↓
5 × factorial(4)
  ↓
5 × 4 × factorial(3)
  ↓
5 × 4 × 3 × factorial(2)
  ↓
5 × 4 × 3 × 2 × factorial(1)
  ↓
120
```

Setiap recursive function harus memiliki **base case**.

**Hafalan:**

```text
recursive = function memanggil dirinya sendiri
base case = titik berhenti
```

---

# 47. Function Generator

Generator function menggunakan `function*` dan dapat menghentikan sementara eksekusi dengan `yield`.

```javascript
function* numbers() {
    yield 1;
    yield 2;
    yield 3;
}

const generator = numbers();

console.log(generator.next());
console.log(generator.next());
console.log(generator.next());
console.log(generator.next());
```

Output:

```text
{ value: 1, done: false }
{ value: 2, done: false }
{ value: 3, done: false }
{ value: undefined, done: true }
```

Generator juga iterable:

```javascript
function* numbers() {
    yield 1;
    yield 2;
    yield 3;
}

for (const number of numbers()) {
    console.log(number);
}
```

Output:

```text
1
2
3
```

**Hafalan:**

```text
function* → generator
yield     → pause + kirim value
next()    → lanjutkan generator
```

---

# 48. Arrow Function

Arrow function adalah syntax singkat untuk function.

```javascript
const double = (number) => {
    return number * 2;
};

console.log(double(5));
```

Bisa disingkat:

```javascript
const double = (number) => number * 2;
```

Jika satu parameter, tanda kurung dapat dihilangkan:

```javascript
const double = number => number * 2;
```

Dengan beberapa parameter:

```javascript
const add = (a, b) => a + b;
```

**Hafalan:**

```text
(x) => expression
```

> Arrow function tidak memiliki `this` sendiri; `this`-nya berasal dari lexical scope.

---

# 49. Closure

Closure terjadi ketika sebuah function mengingat dan tetap dapat mengakses variable dari lexical scope tempat function tersebut dibuat.

```javascript
function createCounter() {
    let count = 0;

    return function () {
        count++;
        return count;
    };
}

const counter = createCounter();

console.log(counter());
console.log(counter());
console.log(counter());
```

Output:

```text
1
2
3
```

Diagram:

```text
createCounter()
      │
      ├── count = 0
      │
      └── return function
              │
              └── tetap mengingat count
```

**Hafalan:**

```text
closure = function + lexical environment yang diingat
```

---

# 50. Object Method

Function yang menjadi property object disebut method.

```javascript
const user = {
    name: "Budi",

    sayHello() {
        console.log(`Halo ${this.name}`);
    }
};

user.sayHello();
```

Output:

```text
Halo Budi
```

Syntax method shorthand:

```javascript
const user = {
    sayHello() {
        console.log("Hello");
    }
};
```

**Hafalan:**

```text
object + function property = method
```

---

# 51. Kata Kunci this

`this` merujuk pada context pemanggilan function, dengan aturan yang bergantung pada cara function dipanggil.

Dalam method object:

```javascript
const user = {
    name: "Budi",

    sayHello() {
        console.log(this.name);
    }
};

user.sayHello();
```

Output:

```text
Budi
```

Dalam constructor/class, `this` biasanya merujuk ke instance:

```javascript
class User {
    constructor(name) {
        this.name = name;
    }
}

const user = new User("Budi");

console.log(user.name);
```

**Hafalan penting:**

```text
this bukan sekadar "object saat function dibuat"
this ditentukan oleh cara function dipanggil
```

---

# 52. Arrow Function di Object

Hati-hati menggunakan arrow function sebagai method object.

```javascript
const user = {
    name: "Budi",

    sayHello: () => {
        console.log(this.name);
    }
};

user.sayHello();
```

Arrow function **tidak memiliki `this` sendiri**. Ia mengambil `this` dari lexical scope di luar object.

Untuk method object yang membutuhkan `this`, gunakan method biasa:

```javascript
const user = {
    name: "Budi",

    sayHello() {
        console.log(this.name);
    }
};

user.sayHello();
```

**Hafalan:**

```text
method biasa → punya this berdasarkan call
arrow        → tidak punya this sendiri
```

---

# 53. Getter dan Setter

Getter dan setter digunakan untuk mengontrol akses property.

```javascript
const user = {
    firstName: "Budi",
    lastName: "Santoso",

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    },

    set fullName(value) {
        const [firstName, lastName] = value.split(" ");

        this.firstName = firstName;
        this.lastName = lastName;
    }
};
```

Getter dipanggil seperti property:

```javascript
console.log(user.fullName);
```

Setter juga terlihat seperti assignment:

```javascript
user.fullName = "Andi Wijaya";

console.log(user.fullName);
```

Output:

```text
Budi Santoso
Andi Wijaya
```

**Hafalan:**

```text
get → baca seperti property
set → ubah seperti assignment
```

---

# 54. Masalah Variable var

`var` adalah syntax lama yang sebaiknya tidak digunakan untuk kode modern.

## `var` function scoped

```javascript
if (true) {
    var message = "Hello";
}

console.log(message);
```

Output:

```text
Hello
```

Bandingkan `let`:

```javascript
if (true) {
    let message = "Hello";
}

// console.log(message); // ReferenceError
```

## `var` dapat redeclare

```javascript
var name = "Budi";
var name = "Andi";

console.log(name);
```

Ini berbeda dengan `let`:

```javascript
let name = "Budi";
// let name = "Andi"; // SyntaxError
```

## Hoisting

`var` memiliki perilaku hoisting yang dapat membingungkan:

```javascript
console.log(name);

var name = "Budi";
```

Output:

```text
undefined
```

Dengan `let`/`const`, variable berada dalam temporal dead zone sebelum deklarasi.

**Best practice:**

```text
gunakan const secara default
gunakan let jika perlu reassignment
hindari var
```

---

# 55. Destructuring

Destructuring digunakan untuk mengambil data dari array atau object ke variable.

## Object destructuring

```javascript
const user = {
    name: "Budi",
    age: 20
};

const { name, age } = user;

console.log(name);
console.log(age);
```

Output:

```text
Budi
20
```

Rename:

```javascript
const { name: userName } = user;

console.log(userName);
```

## Array destructuring

```javascript
const fruits = [
    "Apple",
    "Banana",
    "Orange"
];

const [first, second] = fruits;

console.log(first);
console.log(second);
```

Output:

```text
Apple
Banana
```

## Skip item

```javascript
const [first, , third] = fruits;
```

## Rest destructuring

```javascript
const [first, ...others] = fruits;
```

**Hafalan:**

```text
const { name } = object
const [first] = array
```

---

# 56. Strict Mode

Strict mode membuat JavaScript menggunakan aturan yang lebih ketat.

Aktifkan dengan:

```javascript
"use strict";
```

Contoh:

```javascript
"use strict";

x = 10;
```

Dalam strict mode, ini menghasilkan `ReferenceError` karena `x` belum dideklarasikan.

Strict mode juga mengubah beberapa perilaku `this`, assignment tertentu, dan syntax lama.

**Catatan penting:** module JavaScript (`<script type="module">` atau ES modules) sudah menggunakan strict mode secara otomatis.

**Hafalan:**

```text
"use strict";
```

> Untuk kode modern berbasis module, biasanya tidak perlu menulis `"use strict"` secara manual.

---

# 57. Debugger

`debugger` dapat menghentikan eksekusi saat Developer Tools debugger aktif.

```javascript
function add(a, b) {
    debugger;

    return a + b;
}

console.log(add(10, 5));
```

Saat browser mencapai `debugger`, eksekusi dapat berhenti sehingga kita bisa melihat:
- nilai variable;
- call stack;
- scope;
- expression;
- alur program.

Selain `debugger`, gunakan juga:

```javascript
console.log(value);
```

**Hafalan:**

```text
debugger = breakpoint dari kode
```

---

# 58. Tabel Ringkasan

| Materi | Fungsi | Kata Kunci |
| --- | --- | --- |
| Pengenalan JavaScript | Mengenal JS | JavaScript |
| Hello World | Output | `console.log()` |
| Komentar | Catatan kode | `//`, `/* */` |
| Number | Angka | `number` |
| Boolean | True/false | `true`, `false` |
| String | Teks | `"..."`, `'...'`, `` `...` `` |
| Variable | Data yang dapat diikat | `let`, `const` |
| Matematika | Operasi angka | `+ - * / % **` |
| Perbandingan | Membandingkan | `=== !==` |
| Logika | Gabung kondisi | `&& || !` |
| Console | Debug/output | `console` |
| Template | String dinamis | `` `${}` `` |
| Konversi | Ubah tipe | `String()`, `Number()` |
| Array | Kumpulan data | `[]` |
| Object | Data key/value | `{}` |
| If | Kondisi | `if` |
| Popup | Interaksi browser | `alert()` |
| Undefined | Nilai belum tersedia | `undefined` |
| Null | Tidak ada nilai | `null` |
| Switch | Banyak pilihan | `switch`, `case` |
| typeof | Cek tipe | `typeof` |
| in | Cek property/index | `in` |
| Ternary | If singkat | `? :` |
| Nullish | Fallback nullish | `??` |
| Optional Chaining | Akses aman | `?.` |
| Falsy/Truthy | Nilai boolean context | `false`, `0`, `""` |
| Logika non-boolean | Menghasilkan operand | `&&`, `||`, `??` |
| For | Loop terkontrol | `for` |
| While | Loop berdasarkan kondisi | `while` |
| Do While | Loop minimal sekali | `do` |
| Break | Keluar loop | `break` |
| Continue | Lewati iterasi | `continue` |
| Label | Target loop | `label:` |
| For In | Iterasi key | `for...in` |
| For Of | Iterasi value | `for...of` |
| With | Legacy scope shortcut | `with` |
| Function | Logic reusable | `function` |
| Parameter | Input function | `parameter` |
| Return | Output function | `return` |
| Optional Parameter | Parameter boleh tidak dikirim | `undefined` |
| Default Parameter | Nilai cadangan | `=` |
| Rest Parameter | Kumpulkan argument | `...args` |
| Function as Value | Function sebagai data | `fn` |
| Anonymous | Function tanpa nama | `function () {}` |
| Nested Function | Function dalam function | `inner()` |
| Scope | Jangkauan variable | lexical scope |
| Recursive | Function memanggil diri | recursion |
| Generator | Function yang dapat pause | `function*`, `yield` |
| Arrow | Function singkat | `=>` |
| Closure | Function mengingat scope | closure |
| Object Method | Function pada object | `method()` |
| `this` | Context function | `this` |
| Arrow di Object | Lexical `this` | `() =>` |
| Getter/Setter | Kontrol property | `get`, `set` |
| `var` | Variable legacy | `var` |
| Destructuring | Ambil data | `{}`, `[]` |
| Strict Mode | Aturan lebih ketat | `"use strict"` |
| Debugger | Berhenti untuk debug | `debugger` |

---

# 59. Mini Project

## Program Nilai Siswa

Project ini menggabungkan:

```text
variable
array
object
function
parameter
return
if
for...of
operator
string template
```

### `index.html`

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Nilai Siswa</title>
</head>
<body>

<script>
    const students = [
        {
            name: "Budi",
            score: 90
        },
        {
            name: "Andi",
            score: 75
        },
        {
            name: "Siti",
            score: 60
        }
    ];

    function getGrade(score) {
        if (score >= 90) {
            return "A";
        }

        if (score >= 80) {
            return "B";
        }

        if (score >= 70) {
            return "C";
        }

        return "D";
    }

    for (const student of students) {
        const grade = getGrade(student.score);

        console.log(
            `${student.name} - ${student.score} - Grade ${grade}`
        );
    }
</script>

</body>
</html>
```

Output:

```text
Budi - 90 - Grade A
Andi - 75 - Grade C
Siti - 60 - Grade D
```

Diagram:

```text
students
    │
    ▼
for...of
    │
    ▼
getGrade(score)
    │
    ├── >= 90 → A
    ├── >= 80 → B
    ├── >= 70 → C
    └── else  → D
    │
    ▼
console.log()
```

---

# 60. Cheat Code JavaScript 10 Detik

> **JavaScript memakai `let`/`const` untuk variable, `null` untuk nilai kosong yang disengaja, `undefined` untuk nilai yang belum tersedia, `[]` untuk array, `{}` untuk object, `===` untuk perbandingan ketat, `&&`/`||`/`!` untuk logika, `??` untuk fallback nullish, `?.` untuk optional chaining, `if`/`switch` untuk kondisi, `for`/`while`/`do while` untuk loop, `break` untuk keluar dan `continue` untuk melewati iterasi. `for...in` mengambil key, sedangkan `for...of` mengambil value. Function dibuat dengan `function`, menerima parameter, mengembalikan nilai dengan `return`, dan dapat disimpan sebagai value, anonymous, arrow, callback, generator, recursive, serta membentuk closure. Gunakan `const` secara default, `let` jika perlu reassignment, dan hindari `var` pada kode modern.**

---

# 61. Referensi Resmi

- **MDN — JavaScript Guide**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide

- **MDN — JavaScript Reference**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference

- **ECMAScript Language Specification**  
  https://tc39.es/ecma262/

- **Node.js Documentation**  
  https://nodejs.org/docs/latest/api/

> **Catatan versi:** Cheatsheet ini menggunakan sintaks JavaScript modern (ES2020+). Detail perilaku dapat berbeda berdasarkan runtime dan environment (browser atau Node.js).
