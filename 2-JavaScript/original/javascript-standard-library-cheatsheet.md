# JavaScript Standard Library Cheatsheet — Mudah Dipahami & Diingat

> **Target:** JavaScript modern (ES2020+) dengan fokus pada built-in objects, utility, encoding, dan API standar JavaScript.
>
> Pola pembahasan: **materi → konsep → kode → output → hafalan**.
>
> Catatan: beberapa API seperti `Proxy`, `Reflect`, `Symbol`, dan `RegExp` cukup konseptual. Cheatsheet ini memprioritaskan syntax yang paling sering digunakan.

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Number](#2-number)
3. [String](#3-string)
4. [Array](#4-array)
5. [Object](#5-object)
6. [JSON](#6-json)
7. [BigInt](#7-bigint)
8. [Date](#8-date)
9. [Math](#9-math)
10. [Boolean](#10-boolean)
11. [Map](#11-map)
12. [Set](#12-set)
13. [Symbol](#13-symbol)
14. [RegExp](#14-regexp)
15. [Proxy](#15-proxy)
16. [Reflect](#16-reflect)
17. [Encode](#17-encode)
18. [Base64](#18-base64)
19. [Eval](#19-eval)
20. [Tabel Ringkasan](#20-tabel-ringkasan)
21. [Mini Project](#21-mini-project)
22. [Cheat Code JavaScript Standard Library 10 Detik](#22-cheat-code-javascript-standard-library-10-detik)
23. [Referensi Resmi](#23-referensi-resmi)

---

# 1. Pendahuluan

JavaScript memiliki banyak **built-in object** dan API standar yang bisa langsung digunakan tanpa library tambahan.

Contoh:

```javascript
console.log(Number("100"));
console.log("Budi".toUpperCase());

console.log(Math.max(10, 20));
```

Output:

```text
100
BUDI
20
```

Kelompok API yang penting:

```text
Number
String
Array
Object
JSON
BigInt
Date
Math
Boolean
Map
Set
Symbol
RegExp
Proxy
Reflect
Encoding
Base64
eval
```

**Hafalan:**

```text
Built-in object
→ fitur yang sudah disediakan JavaScript
→ tidak perlu install package
```

> **Catatan:** `console`, `setTimeout`, `fetch`, DOM, dan API browser/Node.js bukan semuanya bagian dari core ECMAScript Standard Library. Cheatsheet ini fokus pada topik yang Anda minta.

---

# 2. Number

`Number` digunakan untuk bekerja dengan angka floating-point dalam JavaScript.

```javascript
const age = 20;
const price = 99.99;

console.log(age);
console.log(price);
```

Output:

```text
20
99.99
```

## Konversi ke Number

```javascript
console.log(Number("100"));
console.log(Number("12.5"));
```

Output:

```text
100
12.5
```

Jika tidak dapat dikonversi:

```javascript
console.log(Number("hello"));
```

Output:

```text
NaN
```

## `parseInt()`

```javascript
console.log(parseInt("100"));
console.log(parseInt("100px"));
```

Output:

```text
100
100
```

## `parseFloat()`

```javascript
console.log(parseFloat("12.5"));
console.log(parseFloat("12.5px"));
```

Output:

```text
12.5
12.5
```

## `Number.isNaN()`

```javascript
console.log(Number.isNaN(NaN));
console.log(Number.isNaN("hello"));
```

Output:

```text
true
false
```

## `Number.isInteger()`

```javascript
console.log(Number.isInteger(10));
console.log(Number.isInteger(10.5));
```

Output:

```text
true
false
```

## Nilai khusus

```javascript
console.log(Number.MAX_VALUE);
console.log(Number.MIN_VALUE);
console.log(Number.MAX_SAFE_INTEGER);
console.log(Number.MIN_SAFE_INTEGER);
console.log(Number.POSITIVE_INFINITY);
console.log(Number.NEGATIVE_INFINITY);
console.log(Number.NaN);
```

**Hafalan:**

```text
Number("10")          → konversi
parseInt("10px")      → integer
parseFloat("10.5px")  → decimal
Number.isNaN(x)       → cek NaN
Number.isInteger(x)   → cek integer
```

---

# 3. String

`String` digunakan untuk bekerja dengan teks.

```javascript
const name = "Budi";

console.log(name);
console.log(name.length);
```

Output:

```text
Budi
4
```

## Method String yang sering dipakai

### `toUpperCase()`

```javascript
console.log("hello".toUpperCase());
```

Output:

```text
HELLO
```

### `toLowerCase()`

```javascript
console.log("HELLO".toLowerCase());
```

Output:

```text
hello
```

### `includes()`

```javascript
console.log("JavaScript".includes("Script"));
```

Output:

```text
true
```

### `startsWith()`

```javascript
console.log("JavaScript".startsWith("Java"));
```

Output:

```text
true
```

### `endsWith()`

```javascript
console.log("JavaScript".endsWith("Script"));
```

Output:

```text
true
```

### `indexOf()`

```javascript
console.log("JavaScript".indexOf("Script"));
```

Output:

```text
4
```

Jika tidak ditemukan:

```javascript
console.log("JavaScript".indexOf("PHP"));
```

Output:

```text
-1
```

### `slice()`

```javascript
console.log("JavaScript".slice(0, 4));
```

Output:

```text
Java
```

### `substring()`

```javascript
console.log("JavaScript".substring(4, 10));
```

Output:

```text
Script
```

### `replace()`

```javascript
console.log(
    "Saya suka PHP".replace("PHP", "JavaScript")
);
```

Output:

```text
Saya suka JavaScript
```

### `split()`

```javascript
console.log("apel,jeruk,mangga".split(","));
```

Output:

```text
[ 'apel', 'jeruk', 'mangga' ]
```

### `trim()`

```javascript
console.log("  Budi  ".trim());
```

Output:

```text
Budi
```

**Hafalan:**

```text
length      → panjang
includes    → mengandung
indexOf     → posisi
slice       → potong
replace     → ganti
split       → string → array
trim        → hapus spasi ujung
```

---

# 4. Array

`Array` digunakan untuk menyimpan kumpulan data dalam urutan tertentu.

```javascript
const fruits = [
    "Apple",
    "Banana",
    "Orange"
];

console.log(fruits);
console.log(fruits[0]);
```

Output:

```text
[ 'Apple', 'Banana', 'Orange' ]
Apple
```

## `push()`

Menambah data di akhir.

```javascript
const numbers = [1, 2];

numbers.push(3);

console.log(numbers);
```

Output:

```text
[1, 2, 3]
```

## `pop()`

Menghapus data terakhir.

```javascript
const numbers = [1, 2, 3];

numbers.pop();

console.log(numbers);
```

Output:

```text
[1, 2]
```

## `unshift()`

Menambah data di awal.

```javascript
const numbers = [2, 3];

numbers.unshift(1);

console.log(numbers);
```

Output:

```text
[1, 2, 3]
```

## `shift()`

Menghapus data pertama.

```javascript
const numbers = [1, 2, 3];

numbers.shift();

console.log(numbers);
```

Output:

```text
[2, 3]
```

## `map()`

Mengubah setiap elemen menjadi array baru.

```javascript
const numbers = [1, 2, 3];

const result = numbers.map(
    number => number * 2
);

console.log(result);
```

Output:

```text
[2, 4, 6]
```

## `filter()`

Memilih elemen yang memenuhi kondisi.

```javascript
const numbers = [1, 2, 3, 4];

const result = numbers.filter(
    number => number % 2 === 0
);

console.log(result);
```

Output:

```text
[2, 4]
```

## `find()`

Mencari satu elemen pertama yang cocok.

```javascript
const numbers = [10, 20, 30];

console.log(
    numbers.find(number => number > 15)
);
```

Output:

```text
20
```

## `findIndex()`

```javascript
const numbers = [10, 20, 30];

console.log(
    numbers.findIndex(number => number > 15)
);
```

Output:

```text
1
```

## `includes()`

```javascript
const numbers = [10, 20, 30];

console.log(numbers.includes(20));
```

Output:

```text
true
```

## `reduce()`

Menggabungkan seluruh elemen menjadi satu nilai.

```javascript
const numbers = [1, 2, 3, 4];

const total = numbers.reduce(
    (result, number) => result + number,
    0
);

console.log(total);
```

Output:

```text
10
```

## `sort()`

Hati-hati: default `sort()` membandingkan elemen sebagai string.

```javascript
const numbers = [10, 2, 5];

numbers.sort();

console.log(numbers);
```

Hasil dapat menjadi:

```text
[10, 2, 5]
```

Untuk angka:

```javascript
numbers.sort((a, b) => a - b);
```

**Hafalan:**

```text
push      → tambah belakang
pop       → hapus belakang
unshift   → tambah depan
shift     → hapus depan
map       → ubah
filter    → pilih
find      → cari value
findIndex → cari index
reduce    → gabungkan
sort      → urutkan
```

---

# 5. Object

`Object` digunakan untuk membuat data berbentuk key-value.

```javascript
const user = {
    name: "Budi",
    age: 20
};

console.log(user.name);
console.log(user.age);
```

Output:

```text
Budi
20
```

## `Object.keys()`

```javascript
const user = {
    name: "Budi",
    age: 20
};

console.log(Object.keys(user));
```

Output:

```text
[ 'name', 'age' ]
```

## `Object.values()`

```javascript
console.log(Object.values(user));
```

Output:

```text
[ 'Budi', 20 ]
```

## `Object.entries()`

```javascript
console.log(Object.entries(user));
```

Output:

```text
[
    [ 'name', 'Budi' ],
    [ 'age', 20 ]
]
```

## `Object.fromEntries()`

Mengubah array entries menjadi object.

```javascript
const entries = [
    ["name", "Budi"],
    ["age", 20]
];

const user = Object.fromEntries(entries);

console.log(user);
```

Output:

```text
{ name: 'Budi', age: 20 }
```

## `Object.assign()`

```javascript
const target = {
    name: "Budi"
};

const source = {
    age: 20
};

Object.assign(target, source);

console.log(target);
```

Output:

```text
{ name: 'Budi', age: 20 }
```

## `Object.hasOwn()`

Mengecek apakah property dimiliki langsung oleh object.

```javascript
const user = {
    name: "Budi"
};

console.log(
    Object.hasOwn(user, "name")
);

console.log(
    Object.hasOwn(user, "age")
);
```

Output:

```text
true
false
```

**Hafalan:**

```text
Object.keys()       → key
Object.values()     → value
Object.entries()    → key + value
Object.fromEntries  → entries → object
Object.assign()     → gabungkan/assign
Object.hasOwn()     → cek own property
```

---

# 6. JSON

`JSON` digunakan untuk pertukaran data dalam format JSON.

Contoh:

```javascript
const user = {
    name: "Budi",
    age: 20
};
```

## `JSON.stringify()`

Object → JSON string.

```javascript
const user = {
    name: "Budi",
    age: 20
};

const json = JSON.stringify(user);

console.log(json);
console.log(typeof json);
```

Output:

```text
{"name":"Budi","age":20}
string
```

## `JSON.parse()`

JSON string → JavaScript value.

```javascript
const json = '{"name":"Budi","age":20}';

const user = JSON.parse(json);

console.log(user.name);
```

Output:

```text
Budi
```

Diagram:

```text
JavaScript Object
       │
       │ stringify()
       ▼
    JSON String
       │
       │ parse()
       ▼
JavaScript Object
```

**Hafalan:**

```text
stringify → JS → JSON string
parse     → JSON string → JS
```

---

# 7. BigInt

`BigInt` digunakan untuk bilangan integer yang lebih besar daripada batas aman `Number`.

Batas aman `Number`:

```javascript
console.log(Number.MAX_SAFE_INTEGER);
```

Output:

```text
9007199254740991
```

Membuat BigInt:

```javascript
const bigNumber = 9007199254740992n;

console.log(bigNumber);
console.log(typeof bigNumber);
```

Output:

```text
9007199254740992n
bigint
```

Bisa menggunakan `BigInt()`:

```javascript
const value = BigInt("9007199254740992");

console.log(value);
```

Operasi:

```javascript
const a = 1000000000000000000n;
const b = 2000000000000000000n;

console.log(a + b);
console.log(a * b);
```

**Tidak boleh mencampur `Number` dan `BigInt` langsung:**

```javascript
const a = 10n;
const b = 10;

// a + b
// TypeError
```

Konversi:

```javascript
console.log(Number(10n));
console.log(BigInt(10));
```

**Hafalan:**

```text
100n → BigInt
100  → Number
```

---

# 8. Date

`Date` digunakan untuk bekerja dengan tanggal dan waktu.

```javascript
const now = new Date();

console.log(now);
```

Membuat tanggal tertentu:

```javascript
const date = new Date(
    "2026-08-17T10:30:00"
);

console.log(date);
```

## Getter

```javascript
const date = new Date();

console.log(date.getFullYear());
console.log(date.getMonth());
console.log(date.getDate());
console.log(date.getDay());
```

Catatan:

```text
getMonth()
→ Januari = 0
→ Februari = 1
→ ...
→ Desember = 11
```

## UTC

```javascript
const date = new Date();

console.log(date.getUTCFullYear());
console.log(date.getUTCMonth());
console.log(date.getUTCDate());
```

## Timestamp

```javascript
const date = new Date();

console.log(date.getTime());
```

`getTime()` menghasilkan jumlah milliseconds sejak Unix epoch.

## ISO String

```javascript
const date = new Date();

console.log(date.toISOString());
```

Contoh output:

```text
2026-08-17T...
```

## Membandingkan tanggal

```javascript
const date1 = new Date("2026-01-01");
const date2 = new Date("2026-02-01");

console.log(date2 > date1);
```

Output:

```text
true
```

**Hafalan:**

```text
new Date()       → sekarang
getFullYear()    → tahun
getMonth()       → bulan 0-11
getDate()        → tanggal
getDay()         → hari 0-6
getTime()        → timestamp
toISOString()    → ISO string
```

> Untuk aplikasi tanggal/waktu yang kompleks, perhatikan timezone dan pertimbangkan API modern seperti `Temporal` jika tersedia pada environment yang digunakan.

---

# 9. Math

`Math` menyediakan operasi matematika.

## `Math.round()`

Membulatkan ke terdekat.

```javascript
console.log(Math.round(10.4));
console.log(Math.round(10.6));
```

Output:

```text
10
11
```

## `Math.floor()`

Membulatkan ke bawah.

```javascript
console.log(Math.floor(10.9));
```

Output:

```text
10
```

## `Math.ceil()`

Membulatkan ke atas.

```javascript
console.log(Math.ceil(10.1));
```

Output:

```text
11
```

## `Math.trunc()`

Menghapus angka di belakang koma.

```javascript
console.log(Math.trunc(10.9));
```

Output:

```text
10
```

## `Math.max()`

```javascript
console.log(Math.max(10, 20, 5));
```

Output:

```text
20
```

## `Math.min()`

```javascript
console.log(Math.min(10, 20, 5));
```

Output:

```text
5
```

## `Math.random()`

Menghasilkan angka pseudo-random dari `0` sampai kurang dari `1`.

```javascript
console.log(Math.random());
```

Contoh:

```text
0.583...
```

Random integer 1–10:

```javascript
const number =
    Math.floor(Math.random() * 10) + 1;

console.log(number);
```

**Hafalan:**

```text
round  → terdekat
floor  → bawah
ceil   → atas
trunc  → buang desimal
max    → terbesar
min    → terkecil
random → 0 <= x < 1
```

---

# 10. Boolean

`Boolean` merepresentasikan nilai:

```text
true
false
```

```javascript
const active = true;

console.log(active);
console.log(typeof active);
```

Output:

```text
true
boolean
```

Konversi:

```javascript
console.log(Boolean(1));
console.log(Boolean(0));
console.log(Boolean("hello"));
console.log(Boolean(""));
```

Output:

```text
true
false
true
false
```

Nilai falsy yang penting:

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

Selain itu umumnya truthy.

Contoh:

```javascript
if ("hello") {
    console.log("Truthy");
}
```

Output:

```text
Truthy
```

**Hafalan:**

```text
Boolean(value)
→ ubah value menjadi true/false
```

---

# 11. Map

`Map` menyimpan data dalam pasangan key-value.

```javascript
const users = new Map();

users.set("name", "Budi");
users.set("age", 20);

console.log(users.get("name"));
console.log(users.get("age"));
```

Output:

```text
Budi
20
```

## `has()`

```javascript
console.log(users.has("name"));
```

Output:

```text
true
```

## `delete()`

```javascript
users.delete("age");

console.log(users.has("age"));
```

Output:

```text
false
```

## `size`

```javascript
console.log(users.size);
```

## `for...of`

```javascript
const users = new Map([
    ["Budi", 20],
    ["Andi", 25]
]);

for (const [name, age] of users) {
    console.log(name, age);
}
```

Output:

```text
Budi 20
Andi 25
```

Perbedaan object dan Map:

```text
Object
→ key biasanya string atau symbol

Map
→ key bisa object, function, primitive, dll.
```

**Hafalan:**

```text
set()    → simpan
get()    → ambil
has()    → cek
delete() → hapus
size     → jumlah
```

---

# 12. Set

`Set` menyimpan nilai unik.

```javascript
const numbers = new Set();

numbers.add(10);
numbers.add(20);
numbers.add(10);

console.log(numbers);
```

Output:

```text
Set(2) { 10, 20 }
```

Nilai `10` hanya disimpan sekali.

## `has()`

```javascript
console.log(numbers.has(20));
```

Output:

```text
true
```

## `delete()`

```javascript
numbers.delete(10);

console.log(numbers);
```

## `size`

```javascript
console.log(numbers.size);
```

## Menghapus duplikat array

```javascript
const numbers = [
    1, 2, 2, 3, 3, 3
];

const uniqueNumbers = [
    ...new Set(numbers)
];

console.log(uniqueNumbers);
```

Output:

```text
[1, 2, 3]
```

**Hafalan:**

```text
Set → kumpulan nilai unik
```

---

# 13. Symbol

`Symbol` adalah primitive value yang unik.

```javascript
const id1 = Symbol("id");
const id2 = Symbol("id");

console.log(id1 === id2);
```

Output:

```text
false
```

Walaupun deskripsinya sama:

```text
Symbol("id") !== Symbol("id")
```

## Symbol sebagai property

```javascript
const id = Symbol("id");

const user = {
    name: "Budi",
    [id]: 123
};

console.log(user[id]);
```

Output:

```text
123
```

Property Symbol tidak muncul pada `Object.keys()`:

```javascript
console.log(Object.keys(user));
```

Output:

```text
[ 'name' ]
```

## Well-known Symbol

Contoh yang penting:

```javascript
Symbol.iterator
```

Digunakan untuk membuat object iterable.

**Hafalan:**

```text
Symbol() → identifier unik
```

---

# 14. RegExp

`RegExp` digunakan untuk pencarian dan pencocokan pola teks.

Contoh:

```javascript
const pattern = /javascript/i;

console.log(
    pattern.test("Saya belajar JavaScript")
);
```

Output:

```text
true
```

Flag:

```text
i → ignore case
g → global
m → multiline
s → dotAll
u → unicode
y → sticky
d → indices
```

## `test()`

```javascript
const pattern = /^\d+$/;

console.log(pattern.test("123"));
console.log(pattern.test("abc"));
```

Output:

```text
true
false
```

## `match()`

```javascript
const text = "apel 10, jeruk 20";

console.log(
    text.match(/\d+/g)
);
```

Output:

```text
[ '10', '20' ]
```

## `replace()`

```javascript
const text = "Saya suka PHP";

console.log(
    text.replace(/PHP/g, "JavaScript")
);
```

Output:

```text
Saya suka JavaScript
```

Contoh pola:

```text
\d   → digit
\w   → word character
\s   → whitespace
.    → karakter apa pun kecuali newline (secara default)
^    → awal string/baris
$    → akhir string/baris
+    → satu atau lebih
*    → nol atau lebih
?    → nol atau satu / lazy tergantung konteks
[]   → character class
()   → group
```

**Hafalan:**

```text
/regex/flags
```

---

# 15. Proxy

`Proxy` digunakan untuk membuat object yang perilakunya dapat di-intercept.

Contoh sederhana:

```javascript
const user = {
    name: "Budi"
};

const proxy = new Proxy(user, {
    get(target, property) {
        console.log(
            `Membaca property: ${String(property)}`
        );

        return target[property];
    }
});

console.log(proxy.name);
```

Output:

```text
Membaca property: name
Budi
```

## `set()`

```javascript
const user = {};

const proxy = new Proxy(user, {
    set(target, property, value) {
        console.log(
            `Mengubah ${String(property)}`
        );

        target[property] = value;

        return true;
    }
});

proxy.name = "Budi";
```

Proxy dapat digunakan untuk:

```text
validasi
logging
intercept property
reactivity
custom behavior
```

**Hafalan:**

```text
Proxy
→ object + handler
→ intercept behavior
```

Pola:

```javascript
new Proxy(target, {
    get() {},
    set() {}
});
```

---

# 16. Reflect

`Reflect` menyediakan method untuk operasi object yang terstruktur.

Contoh:

```javascript
const user = {
    name: "Budi"
};

console.log(
    Reflect.get(user, "name")
);
```

Output:

```text
Budi
```

Set property:

```javascript
Reflect.set(
    user,
    "age",
    20
);

console.log(user);
```

## Method penting

```javascript
Reflect.get()
Reflect.set()
Reflect.has()
Reflect.deleteProperty()
Reflect.ownKeys()
Reflect.construct()
```

Contoh:

```javascript
const user = {
    name: "Budi"
};

console.log(
    Reflect.has(user, "name")
);
```

Output:

```text
true
```

`Reflect` sering dipakai bersama `Proxy`.

```javascript
const proxy = new Proxy(user, {
    get(target, property, receiver) {
        return Reflect.get(
            target,
            property,
            receiver
        );
    }
});
```

**Hafalan:**

```text
Proxy
→ intercept

Reflect
→ operasi object secara terstruktur
```

---

# 17. Encode

Encoding digunakan untuk mengubah data menjadi representasi yang aman untuk konteks tertentu.

Contoh yang sering digunakan di JavaScript adalah URL encoding.

## `encodeURIComponent()`

Digunakan untuk encode bagian dari URL.

```javascript
const text = "Budi & Andi";

console.log(
    encodeURIComponent(text)
);
```

Output:

```text
Budi%20%26%20Andi
```

Decode:

```javascript
const encoded =
    "Budi%20%26%20Andi";

console.log(
    decodeURIComponent(encoded)
);
```

Output:

```text
Budi & Andi
```

## `encodeURI()`

Digunakan untuk encode URI secara keseluruhan tanpa meng-encode karakter struktur URI tertentu.

```javascript
const url =
    "https://example.com/search?q=Budi Andi";

console.log(
    encodeURI(url)
);
```

Decode:

```javascript
console.log(
    decodeURI(encodeURI(url))
);
```

Perbedaan:

```text
encodeURI()
→ untuk URI secara keseluruhan

encodeURIComponent()
→ untuk satu bagian/component URI
```

**Hafalan:**

```text
encodeURIComponent()
→ cocok untuk query parameter/value

decodeURIComponent()
→ kembalikan ke string asli
```

---

# 18. Base64

Base64 adalah encoding untuk merepresentasikan data biner sebagai teks.

Di browser, API yang umum:

```javascript
btoa()
atob()
```

## Encode

```javascript
const encoded = btoa("Hello");

console.log(encoded);
```

Output:

```text
SGVsbG8=
```

## Decode

```javascript
const decoded = atob("SGVsbG8=");

console.log(decoded);
```

Output:

```text
Hello
```

Diagram:

```text
"Hello"
   │
 btoa()
   ▼
"SGVsbG8="
   │
 atob()
   ▼
"Hello"
```

### Unicode

`btoa()` dan `atob()` bekerja dengan binary string dan tidak langsung aman untuk semua Unicode.

Untuk teks Unicode, gunakan `TextEncoder`/`TextDecoder` bersama konversi byte jika membutuhkan Base64 yang benar untuk UTF-8.

Contoh browser:

```javascript
const text = "Halo 👋";

const bytes =
    new TextEncoder().encode(text);

const binary = String.fromCharCode(...bytes);

const encoded = btoa(binary);

console.log(encoded);
```

Decode:

```javascript
const binaryDecoded = atob(encoded);

const bytesDecoded =
    Uint8Array.from(
        binaryDecoded,
        char => char.charCodeAt(0)
    );

const textDecoded =
    new TextDecoder().decode(bytesDecoded);

console.log(textDecoded);
```

Output:

```text
Halo 👋
```

> Di Node.js, Base64 umumnya menggunakan `Buffer`, misalnya `Buffer.from("Hello").toString("base64")`.

**Hafalan:**

```text
btoa() → binary string → Base64
atob() → Base64 → binary string
```

---

# 19. Eval

`eval()` menjalankan string sebagai kode JavaScript.

Contoh:

```javascript
const result = eval("10 + 20");

console.log(result);
```

Output:

```text
30
```

Namun `eval()` umumnya **tidak direkomendasikan** untuk kode aplikasi biasa karena dapat menimbulkan masalah keamanan, debugging, optimasi, dan maintainability jika input berasal dari sumber yang tidak dipercaya.

Contoh berbahaya:

```javascript
const input = getUserInput();

// eval(input);
```

Jangan menjalankan input user sebagai JavaScript.

Alternatif:

```text
eval()
   ↓
hindari jika tidak benar-benar diperlukan

Gunakan:
- function biasa
- parser khusus
- JSON.parse()
- mapping object
- expression parser yang aman sesuai kebutuhan
```

Contoh alternatif untuk operasi sederhana:

```javascript
const operations = {
    add: (a, b) => a + b,
    multiply: (a, b) => a * b
};

console.log(
    operations.add(10, 20)
);
```

Output:

```text
30
```

**Hafalan:**

```text
eval(string)
→ menjalankan string sebagai JavaScript

Jangan gunakan eval()
→ untuk input user/tidak terpercaya
```

---

# 20. Tabel Ringkasan

| Materi | Fungsi | Method/API Penting |
| --- | --- | --- |
| Number | Angka | `Number()`, `parseInt()`, `parseFloat()` |
| String | Teks | `includes()`, `slice()`, `replace()`, `split()` |
| Array | Kumpulan data berurutan | `map()`, `filter()`, `find()`, `reduce()` |
| Object | Data key-value | `Object.keys()`, `values()`, `entries()` |
| JSON | Serialisasi data | `JSON.stringify()`, `JSON.parse()` |
| BigInt | Integer sangat besar | `123n`, `BigInt()` |
| Date | Tanggal & waktu | `new Date()`, `getTime()`, `toISOString()` |
| Math | Operasi matematika | `round()`, `floor()`, `ceil()`, `random()` |
| Boolean | Nilai true/false | `Boolean()` |
| Map | Key-value fleksibel | `set()`, `get()`, `has()`, `delete()` |
| Set | Nilai unik | `add()`, `has()`, `delete()` |
| Symbol | Identifier unik | `Symbol()` |
| RegExp | Pattern matching | `test()`, `match()`, `replace()` |
| Proxy | Intercept object behavior | `get`, `set` |
| Reflect | Operasi object | `get()`, `set()`, `has()` |
| Encode | Encoding URI | `encodeURI()`, `encodeURIComponent()` |
| Base64 | Encoding binary ↔ teks | `btoa()`, `atob()` |
| Eval | Eksekusi string sebagai JS | `eval()` |

---

# 21. Mini Project

## Data User dengan Standard Library

Project ini menggabungkan:

```text
Array
Object
Map
Set
JSON
Date
Number
String
RegExp
```

### Program

```javascript
const users = [
    {
        id: 1,
        name: "Budi",
        email: "budi@example.com",
        skills: ["JavaScript", "PHP"]
    },
    {
        id: 2,
        name: "Andi",
        email: "andi@example.com",
        skills: ["JavaScript", "Python"]
    },
    {
        id: 3,
        name: "Siti",
        email: "siti@example.com",
        skills: ["JavaScript", "Go"]
    }
];

// String + RegExp
const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validUsers = users.filter(user =>
    emailPattern.test(user.email)
);

// Set
const skills = new Set(
    validUsers.flatMap(user => user.skills)
);

console.log([...skills]);

// Map
const userMap = new Map(
    validUsers.map(user => [user.id, user])
);

console.log(
    userMap.get(1).name
);

// Number
const totalUsers = Number(
    validUsers.length
);

console.log(totalUsers);

// Date
const createdAt = new Date();

console.log(
    createdAt.toISOString()
);

// JSON
const json = JSON.stringify(
    validUsers
);

console.log(json);

// JSON → object
const parsedUsers =
    JSON.parse(json);

console.log(
    parsedUsers.length
);
```

Contoh output:

```text
[ 'JavaScript', 'PHP', 'Python', 'Go' ]
Budi
3
2026-...
[{"id":1,...}]
3
```

### Alur

```text
Array users
     │
     ├── filter()
     │      │
     │      ▼
     │   RegExp
     │
     ├── flatMap()
     │      │
     │      ▼
     │     Set
     │
     ├── map()
     │      │
     │      ▼
     │     Map
     │
     ├── Date
     │
     └── JSON
            │
            ▼
        stringify()
            │
            ▼
        JSON string
            │
            ▼
          parse()
```

---

# 22. Cheat Code JavaScript Standard Library 10 Detik

> **Number untuk angka, String untuk teks, Array untuk kumpulan data berurutan, Object untuk key-value, JSON untuk serialisasi, BigInt untuk integer sangat besar, Date untuk tanggal/waktu, Math untuk operasi matematika, Boolean untuk true/false, Map untuk key-value dengan key fleksibel, Set untuk nilai unik, Symbol untuk identifier unik, RegExp untuk pattern matching, Proxy untuk intercept behavior object, Reflect untuk operasi object, encodeURIComponent untuk encode bagian URI, Base64 memakai `btoa()`/`atob()` di browser, dan `eval()` sebaiknya dihindari kecuali benar-benar diperlukan.**

Versi super singkat:

```text
Number   → angka
String   → teks
Array    → list
Object   → key-value
JSON     → data ↔ string
BigInt   → integer besar
Date     → tanggal
Math     → matematika
Boolean  → true/false
Map      → key-value
Set      → unique
Symbol   → identifier unik
RegExp   → pattern
Proxy    → intercept
Reflect  → operasi object
Encode   → URI encoding
Base64   → binary ↔ text
Eval     → string → JavaScript
```

---

# 23. Referensi Resmi

- **MDN — JavaScript Reference**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference

- **MDN — Number**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number

- **MDN — String**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String

- **MDN — Array**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

- **MDN — Object**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object

- **MDN — JSON**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON

- **MDN — BigInt**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt

- **MDN — Date**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

- **MDN — Math**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math

- **MDN — Boolean**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean

- **MDN — Map**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map

- **MDN — Set**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set

- **MDN — Symbol**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol

- **MDN — RegExp**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp

- **MDN — Proxy**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy

- **MDN — Reflect**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect

- **MDN — `encodeURI()`**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI

- **MDN — `encodeURIComponent()`**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent

- **MDN — `btoa()`**  
  https://developer.mozilla.org/en-US/docs/Web/API/Window/btoa

- **MDN — `atob()`**  
  https://developer.mozilla.org/en-US/docs/Web/API/Window/atob

- **MDN — `eval()`**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval

- **ECMAScript Language Specification**  
  https://tc39.es/ecma262/

---

## Catatan Penting

JavaScript memiliki perbedaan environment. Contohnya:

```text
Browser
├── btoa()
├── atob()
└── DOM APIs

Node.js
├── Buffer
├── fs
├── path
└── Node.js APIs
```

Sedangkan topik seperti:

```text
Number
String
Array
Object
JSON
BigInt
Date
Math
Boolean
Map
Set
Symbol
RegExp
Proxy
Reflect
```

merupakan bagian penting dari JavaScript/ECMAScript standard.

**Urutan belajar yang disarankan:**

```text
Number
  ↓
String
  ↓
Array
  ↓
Object
  ↓
JSON
  ↓
Date + Math
  ↓
Map + Set
  ↓
BigInt
  ↓
Symbol
  ↓
RegExp
  ↓
Encode + Base64
  ↓
Proxy + Reflect
  ↓
Eval (cukup pahami, hindari dalam penggunaan normal)
```
