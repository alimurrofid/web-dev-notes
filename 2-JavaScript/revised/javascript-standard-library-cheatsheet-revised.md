# JavaScript Standard Library Cheatsheet Revised

> **Target:** pemula yang sudah memahami dasar JavaScript (tipe data,
> variable, function, array, object), lalu ingin mengenal built-in
> objects dan API standar JavaScript.
>
> Fokus cheatsheet ini: **Number → String → Array → Object → JSON →
> BigInt → Date → Math → Boolean → Map/Set → Symbol → RegExp →
> Proxy/Reflect → Encoding → Base64 → eval**.
>
> **Batasan penting:** `console`, `setTimeout`, `fetch`, DOM, dan API
> browser/Node.js bukan semuanya bagian dari core ECMAScript Standard
> Library. Beberapa API seperti `Proxy`, `Reflect`, `Symbol`, dan
> `RegExp` cukup konseptual — cheatsheet ini memprioritaskan syntax
> yang paling sering digunakan.

## Cara Belajar

``` text
🟢 Fundamental
→ wajib untuk bekerja dengan data sehari-hari

🟡 Lanjutan
→ pelajari setelah fundamental nyaman

🔴 Advanced / Reference
→ penting ketika kebutuhan aplikasi meningkat
```

Mental model:

``` text
Masalah
  ↓
Kenali kelompok datanya
  ↓
Pilih built-in object yang sesuai
  ↓
Gunakan
```

Contoh:

``` text
Butuh teks?
  → String

Butuh kumpulan data?
  → Array

Butuh key-value?
  → Object / Map

Butuh data unik?
  → Set

Butuh pertukaran data?
  → JSON
```

**Penting:**

``` text
Built-in object
→ fitur yang sudah disediakan JavaScript
→ tidak perlu install package
```

## Daftar Isi

### 🟢 Fundamental

1. [Pendahuluan](#bagian-1)
2. [Number](#bagian-2)
3. [String](#bagian-3)
4. [Array](#bagian-4)
5. [Object](#bagian-5)
6. [JSON](#bagian-6)
7. [BigInt](#bagian-7)
8. [Date](#bagian-8)
9. [Math](#bagian-9)
10. [Boolean](#bagian-10)

### 🟡 Lanjutan

11. [Map](#bagian-11)
12. [Set](#bagian-12)
13. [Symbol](#bagian-13)
14. [RegExp](#bagian-14)
15. [Encode](#bagian-15)
16. [Base64](#bagian-16)

### 🔴 Advanced / Reference

17. [Proxy](#bagian-17)
18. [Reflect](#bagian-18)
19. [Eval](#bagian-19)
20. [Mini Flow JavaScript Standard Library](#bagian-20)
21. [Tabel Ringkasan](#bagian-21)
22. [Cheat Code JavaScript Standard Library 10 Detik](#bagian-22)
23. [Urutan Belajar yang Disarankan](#bagian-23)
24. [Mini Project](#bagian-24)
25. [Referensi Resmi](#bagian-25)

------------------------------------------------------------------------

<a id="bagian-1"></a>

# 1. 🟢 Pendahuluan

## Konsep

JavaScript memiliki banyak **built-in object** dan API standar yang
bisa langsung digunakan tanpa library tambahan.

## Contoh

``` javascript
console.log(Number("100"));
console.log("Budi".toUpperCase());
console.log(Math.max(10, 20));
```

## Output

``` text
100
BUDI
20
```

Kelompok API yang penting:

``` text
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

## Kunci

> Built-in object = fitur yang sudah disediakan JavaScript, tidak
> perlu install package.

## Best Practice

- Kenali **kelompok datanya**, bukan menghafal semua method — dengan
  tahu kelompoknya, method yang relevan mudah ditemukan di dokumentasi.

------------------------------------------------------------------------

<a id="bagian-2"></a>

# 2. 🟢 Number

## Konsep

`Number` digunakan untuk bekerja dengan angka floating-point dalam
JavaScript.

## Contoh

``` javascript
const age = 20;
const price = 99.99;

console.log(age);
console.log(price);
```

## Output

``` text
20
99.99
```

## Konversi ke Number

``` javascript
console.log(Number("100"));
console.log(Number("12.5"));
```

## Output

``` text
100
12.5
```

Jika tidak dapat dikonversi:

``` javascript
console.log(Number("hello"));
```

## Output

``` text
NaN
```

## `parseInt()` dan `parseFloat()`

``` javascript
console.log(parseInt("100"));
console.log(parseInt("100px"));
console.log(parseFloat("12.5"));
console.log(parseFloat("12.5px"));
```

## Output

``` text
100
100
12.5
12.5
```

## `Number.isNaN()` dan `Number.isInteger()`

``` javascript
console.log(Number.isNaN(NaN));
console.log(Number.isNaN("hello"));
console.log(Number.isInteger(10));
console.log(Number.isInteger(10.5));
```

## Output

``` text
true
false
true
false
```

## Nilai khusus

``` javascript
console.log(Number.MAX_VALUE);
console.log(Number.MAX_SAFE_INTEGER);
console.log(Number.POSITIVE_INFINITY);
console.log(Number.NaN);
```

## Kunci

> `Number("10")` → konversi, `parseInt("10px")` → integer,
> `parseFloat("10.5px")` → decimal, `Number.isNaN(x)` → cek NaN,
> `Number.isInteger(x)` → cek integer.

## Kesalahan Umum

❌ Menggunakan `isNaN()` global — hasilnya bisa menyesatkan karena
melakukan coercion.

✅ Gunakan `Number.isNaN()` untuk cek `NaN` yang ketat.

------------------------------------------------------------------------

<a id="bagian-3"></a>

# 3. 🟢 String

## Konsep

`String` digunakan untuk bekerja dengan teks.

## Contoh

``` javascript
const name = "Budi";

console.log(name);
console.log(name.length);
```

## Output

``` text
Budi
4
```

## Method String yang sering dipakai

### `toUpperCase()` dan `toLowerCase()`

``` javascript
console.log("hello".toUpperCase());
console.log("HELLO".toLowerCase());
```

## Output

``` text
HELLO
hello
```

### `includes()`, `startsWith()`, `endsWith()`

``` javascript
console.log("JavaScript".includes("Script"));
console.log("JavaScript".startsWith("Java"));
console.log("JavaScript".endsWith("Script"));
```

## Output

``` text
true
true
true
```

### `indexOf()`

``` javascript
console.log("JavaScript".indexOf("Script"));
console.log("JavaScript".indexOf("PHP"));
```

## Output

``` text
4
-1
```

### `slice()` dan `substring()`

``` javascript
console.log("JavaScript".slice(0, 4));
console.log("JavaScript".substring(4, 10));
```

## Output

``` text
Java
Script
```

### `replace()`, `split()`, `trim()`

``` javascript
console.log("Saya suka PHP".replace("PHP", "JavaScript"));
console.log("apel,jeruk,mangga".split(","));
console.log("  Budi  ".trim());
```

## Output

``` text
Saya suka JavaScript
[ 'apel', 'jeruk', 'mangga' ]
Budi
```

## Kunci

> `length` → panjang, `includes` → mengandung, `indexOf` → posisi,
> `slice` → potong, `replace` → ganti, `split` → string → array,
> `trim` → hapus spasi ujung.

## Best Practice

- Gunakan `includes()` / `startsWith()` / `endsWith()` daripada
  `indexOf() !== -1` — lebih mudah dibaca.

------------------------------------------------------------------------

<a id="bagian-4"></a>

# 4. 🟢 Array

## Konsep

`Array` digunakan untuk menyimpan kumpulan data dalam urutan tertentu.

## Contoh

``` javascript
const fruits = ["Apple", "Banana", "Orange"];

console.log(fruits);
console.log(fruits[0]);
```

## Output

``` text
[ 'Apple', 'Banana', 'Orange' ]
Apple
```

## Menambah dan menghapus

``` javascript
const numbers = [1, 2];

numbers.push(3);      // tambah belakang
numbers.pop();        // hapus belakang
numbers.unshift(0);   // tambah depan
numbers.shift();      // hapus depan

console.log(numbers);
```

## `map()` dan `filter()`

``` javascript
const numbers = [1, 2, 3, 4];

const doubled = numbers.map(number => number * 2);
const evens = numbers.filter(number => number % 2 === 0);

console.log(doubled);
console.log(evens);
```

## Output

``` text
[2, 4, 6, 8]
[2, 4]
```

## `find()` dan `findIndex()`

``` javascript
const numbers = [10, 20, 30];

console.log(numbers.find(number => number > 15));
console.log(numbers.findIndex(number => number > 15));
```

## Output

``` text
20
1
```

## `includes()` dan `reduce()`

``` javascript
const numbers = [1, 2, 3, 4];

console.log(numbers.includes(20));

const total = numbers.reduce(
    (result, number) => result + number,
    0
);

console.log(total);
```

## Output

``` text
false
10
```

## `sort()`

Hati-hati: default `sort()` membandingkan elemen sebagai string.

``` javascript
const numbers = [10, 2, 5];

numbers.sort();

console.log(numbers);
```

## Output

``` text
[10, 2, 5]
```

Untuk mengurutkan angka dengan benar:

``` javascript
numbers.sort((a, b) => a - b);
```

## Kunci

> `push` → tambah belakang, `pop` → hapus belakang, `unshift` →
> tambah depan, `shift` → hapus depan.
>
> `map` → ubah, `filter` → pilih, `find` → cari value, `findIndex` →
> cari index, `reduce` → gabungkan, `sort` → urutkan.

## Kesalahan Umum

❌ Menggunakan `sort()` tanpa callback untuk array angka.

✅ Gunakan `sort((a, b) => a - b)` untuk ascending numerik.

------------------------------------------------------------------------

<a id="bagian-5"></a>

# 5. 🟢 Object

## Konsep

`Object` digunakan untuk membuat data berbentuk key-value.

## Contoh

``` javascript
const user = {
    name: "Budi",
    age: 20
};

console.log(user.name);
console.log(user.age);
```

## Output

``` text
Budi
20
```

## `Object.keys()`, `Object.values()`, `Object.entries()`

``` javascript
console.log(Object.keys(user));
console.log(Object.values(user));
console.log(Object.entries(user));
```

## Output

``` text
[ 'name', 'age' ]
[ 'Budi', 20 ]
[ [ 'name', 'Budi' ], [ 'age', 20 ] ]
```

## `Object.fromEntries()`

Mengubah array entries menjadi object:

``` javascript
const entries = [
    ["name", "Budi"],
    ["age", 20]
];

const user = Object.fromEntries(entries);

console.log(user);
```

## Output

``` text
{ name: 'Budi', age: 20 }
```

## `Object.assign()`

``` javascript
const target = { name: "Budi" };
const source = { age: 20 };

Object.assign(target, source);

console.log(target);
```

## Output

``` text
{ name: 'Budi', age: 20 }
```

## `Object.hasOwn()`

Mengecek apakah property dimiliki langsung oleh object:

``` javascript
const user = { name: "Budi" };

console.log(Object.hasOwn(user, "name"));
console.log(Object.hasOwn(user, "age"));
```

## Output

``` text
true
false
```

## Kunci

> `Object.keys()` → key, `Object.values()` → value,
> `Object.entries()` → key + value, `Object.fromEntries()` → entries
> → object, `Object.assign()` → gabungkan/assign, `Object.hasOwn()` →
> cek own property.

------------------------------------------------------------------------

<a id="bagian-6"></a>

# 6. 🟢 JSON

## Konsep

`JSON` digunakan untuk pertukaran data dalam format JSON — antara
JavaScript object dan string.

## `JSON.stringify()`

Object → JSON string:

``` javascript
const user = {
    name: "Budi",
    age: 20
};

const json = JSON.stringify(user);

console.log(json);
console.log(typeof json);
```

## Output

``` text
{"name":"Budi","age":20}
string
```

## `JSON.parse()`

JSON string → JavaScript value:

``` javascript
const json = '{"name":"Budi","age":20}';

const user = JSON.parse(json);

console.log(user.name);
```

## Output

``` text
Budi
```

## Diagram

``` text
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

## Kunci

> `stringify` → JS → JSON string, `parse` → JSON string → JS.

## Kesalahan Umum

❌ Mengirim object langsung ke `fetch` body tanpa `JSON.stringify()`.

✅ Serialisasi dengan `JSON.stringify()` saat mengirim, dan `JSON.parse()`
saat menerima.

------------------------------------------------------------------------

<a id="bagian-7"></a>

# 7. 🟢 BigInt

## Konsep

`BigInt` digunakan untuk bilangan integer yang lebih besar daripada
batas aman `Number`.

## Batas aman Number

``` javascript
console.log(Number.MAX_SAFE_INTEGER);
```

## Output

``` text
9007199254740991
```

## Membuat BigInt

``` javascript
const bigNumber = 9007199254740992n;

console.log(bigNumber);
console.log(typeof bigNumber);
```

## Output

``` text
9007199254740992n
bigint
```

Bisa menggunakan `BigInt()`:

``` javascript
const value = BigInt("9007199254740992");

console.log(value);
```

## Operasi

``` javascript
const a = 1000000000000000000n;
const b = 2000000000000000000n;

console.log(a + b);
console.log(a * b);
```

## Tidak boleh mencampur Number dan BigInt

``` javascript
const a = 10n;
const b = 10;

// a + b
// TypeError
```

Konversi:

``` javascript
console.log(Number(10n));
console.log(BigInt(10));
```

## Kunci

> `100n` → BigInt, `100` → Number.

## Kesalahan Umum

❌ Mencampur `BigInt` dengan `Number` dalam satu operasi — melempar
`TypeError`.

✅ Konversi salah satu nilainya terlebih dahulu.

------------------------------------------------------------------------

<a id="bagian-8"></a>

# 8. 🟢 Date

## Konsep

`Date` digunakan untuk bekerja dengan tanggal dan waktu.

## Contoh

``` javascript
const now = new Date();

console.log(now);
```

Membuat tanggal tertentu:

``` javascript
const date = new Date("2026-08-17T10:30:00");

console.log(date);
```

## Getter

``` javascript
const date = new Date();

console.log(date.getFullYear());
console.log(date.getMonth());
console.log(date.getDate());
console.log(date.getDay());
```

Catatan:

``` text
getMonth()
→ Januari = 0
→ Februari = 1
→ ...
→ Desember = 11
```

## UTC dan timestamp

``` javascript
const date = new Date();

console.log(date.getUTCFullYear());
console.log(date.getTime());
console.log(date.toISOString());
```

`getTime()` menghasilkan jumlah milliseconds sejak Unix epoch.

## Membandingkan tanggal

``` javascript
const date1 = new Date("2026-01-01");
const date2 = new Date("2026-02-01");

console.log(date2 > date1);
```

## Output

``` text
true
```

## Kunci

> `new Date()` → sekarang, `getFullYear()` → tahun, `getMonth()` →
> bulan 0-11, `getDate()` → tanggal, `getDay()` → hari 0-6,
> `getTime()` → timestamp, `toISOString()` → ISO string.

## Best Practice

- Untuk aplikasi tanggal/waktu yang kompleks, perhatikan timezone dan
  pertimbangkan API modern seperti `Temporal` jika tersedia pada
  environment yang digunakan.

------------------------------------------------------------------------

<a id="bagian-9"></a>

# 9. 🟢 Math

## Konsep

`Math` menyediakan operasi matematika: pembulatan, min/max, dan
random.

## Pembulatan

``` javascript
console.log(Math.round(10.4));
console.log(Math.round(10.6));
console.log(Math.floor(10.9));
console.log(Math.ceil(10.1));
console.log(Math.trunc(10.9));
```

## Output

``` text
10
11
10
11
10
```

## `Math.max()` dan `Math.min()`

``` javascript
console.log(Math.max(10, 20, 5));
console.log(Math.min(10, 20, 5));
```

## Output

``` text
20
5
```

## `Math.random()`

Menghasilkan angka pseudo-random dari `0` sampai kurang dari `1`:

``` javascript
console.log(Math.random());
```

Random integer 1–10:

``` javascript
const number = Math.floor(Math.random() * 10) + 1;

console.log(number);
```

## Kunci

> `round` → terdekat, `floor` → bawah, `ceil` → atas, `trunc` → buang
> desimal, `max` → terbesar, `min` → terkecil, `random` → `0 <= x < 1`.

## Kesalahan Umum

❌ Menggunakan `Math.random()` untuk kebutuhan keamanan (token, OTP).

✅ Gunakan `crypto.getRandomValues()` (Web Crypto) untuk random yang
aman secara kriptografis.

------------------------------------------------------------------------

<a id="bagian-10"></a>

# 10. 🟢 Boolean

## Konsep

`Boolean` merepresentasikan nilai `true` / `false`, dan dapat
mengonversi nilai lain menjadi boolean.

## Contoh

``` javascript
const active = true;

console.log(active);
console.log(typeof active);
```

## Output

``` text
true
boolean
```

## Konversi

``` javascript
console.log(Boolean(1));
console.log(Boolean(0));
console.log(Boolean("hello"));
console.log(Boolean(""));
```

## Output

``` text
true
false
true
false
```

Nilai falsy yang penting:

``` text
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

## Kunci

> `Boolean(value)` → ubah value menjadi true/false.

## Kesalahan Umum

❌ Mengira `[]` (array kosong) itu falsy.

✅ `[]` dan `{}` adalah truthy. Hanya 8 nilai falsy (daftar di atas).

------------------------------------------------------------------------

<a id="bagian-11"></a>

# 11. 🟡 Map

## Konsep

`Map` menyimpan data dalam pasangan key-value. Berbeda dengan object,
key Map bisa berupa object, function, primitive, dll.

## Contoh

``` javascript
const users = new Map();

users.set("name", "Budi");
users.set("age", 20);

console.log(users.get("name"));
console.log(users.get("age"));
```

## Output

``` text
Budi
20
```

## `has()`, `delete()`, `size`

``` javascript
console.log(users.has("name"));

users.delete("age");

console.log(users.has("age"));
console.log(users.size);
```

## Output

``` text
true
false
1
```

## `for...of`

``` javascript
const users = new Map([
    ["Budi", 20],
    ["Andi", 25]
]);

for (const [name, age] of users) {
    console.log(name, age);
}
```

## Output

``` text
Budi 20
Andi 25
```

## Perbedaan object dan Map

``` text
Object
→ key biasanya string atau symbol

Map
→ key bisa object, function, primitive, dll.
```

## Kunci

> `set()` → simpan, `get()` → ambil, `has()` → cek, `delete()` →
> hapus, `size` → jumlah.

## Best Practice

- Gunakan `Map` ketika key-nya dinamis atau bukan string, atau ketika
  butuh iterasi yang teratur.

------------------------------------------------------------------------

<a id="bagian-12"></a>

# 12. 🟡 Set

## Konsep

`Set` menyimpan nilai unik — nilai duplikat otomatis dibuang.

## Contoh

``` javascript
const numbers = new Set();

numbers.add(10);
numbers.add(20);
numbers.add(10);

console.log(numbers);
```

## Output

``` text
Set(2) { 10, 20 }
```

Nilai `10` hanya disimpan sekali.

## `has()`, `delete()`, `size`

``` javascript
console.log(numbers.has(20));

numbers.delete(10);

console.log(numbers.size);
```

## Menghapus duplikat array

``` javascript
const numbers = [1, 2, 2, 3, 3, 3];

const uniqueNumbers = [...new Set(numbers)];

console.log(uniqueNumbers);
```

## Output

``` text
[1, 2, 3]
```

## Kunci

> Set → kumpulan nilai unik.

## Best Practice

- Gunakan `[...new Set(array)]` untuk menghapus duplikat dari array
  dengan cepat.

------------------------------------------------------------------------

<a id="bagian-13"></a>

# 13. 🟡 Symbol

## Konsep

`Symbol` adalah primitive value yang unik — dua Symbol selalu berbeda
walaupun deskripsinya sama.

## Contoh

``` javascript
const id1 = Symbol("id");
const id2 = Symbol("id");

console.log(id1 === id2);
```

## Output

``` text
false
```

Walaupun deskripsinya sama:

``` text
Symbol("id") !== Symbol("id")
```

## Symbol sebagai property

``` javascript
const id = Symbol("id");

const user = {
    name: "Budi",
    [id]: 123
};

console.log(user[id]);
```

## Output

``` text
123
```

Property Symbol tidak muncul pada `Object.keys()`:

``` javascript
console.log(Object.keys(user));
```

## Output

``` text
[ 'name' ]
```

## Well-known Symbol

Contoh yang penting:

``` javascript
Symbol.iterator
```

Digunakan untuk membuat object iterable.

## Kunci

> `Symbol()` → identifier unik.

## Best Practice

- Gunakan `Symbol` untuk property yang "tersembunyi" dari iterasi
  biasa, atau untuk key unik yang tidak bentrok.

------------------------------------------------------------------------

<a id="bagian-14"></a>

# 14. 🟡 RegExp

## Konsep

`RegExp` digunakan untuk pencarian dan pencocokan pola teks.

## Contoh

``` javascript
const pattern = /javascript/i;

console.log(pattern.test("Saya belajar JavaScript"));
```

## Output

``` text
true
```

Flag:

``` text
i → ignore case
g → global
m → multiline
s → dotAll
u → unicode
y → sticky
d → indices
```

## `test()`

``` javascript
const pattern = /^\d+$/;

console.log(pattern.test("123"));
console.log(pattern.test("abc"));
```

## Output

``` text
true
false
```

## `match()` dan `replace()`

``` javascript
const text = "apel 10, jeruk 20";

console.log(text.match(/\d+/g));
```

## Output

``` text
[ '10', '20' ]
```

``` javascript
console.log("Saya suka PHP".replace(/PHP/g, "JavaScript"));
```

## Output

``` text
Saya suka JavaScript
```

Contoh pola:

``` text
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

## Kunci

> `/regex/flags`.

## Best Practice

- Untuk pencarian teks sederhana, gunakan `includes()` /
  `startsWith()` — regex hanya untuk pola yang kompleks.

------------------------------------------------------------------------

<a id="bagian-15"></a>

# 15. 🟡 Encode

## Konsep

Encoding digunakan untuk mengubah data menjadi representasi yang aman
untuk konteks tertentu, misalnya URL encoding.

## `encodeURIComponent()`

Digunakan untuk encode bagian dari URL (query parameter/value):

``` javascript
const text = "Budi & Andi";

console.log(encodeURIComponent(text));
```

## Output

``` text
Budi%20%26%20Andi
```

Decode:

``` javascript
const encoded = "Budi%20%26%20Andi";

console.log(decodeURIComponent(encoded));
```

## Output

``` text
Budi & Andi
```

## `encodeURI()`

Digunakan untuk encode URI secara keseluruhan tanpa meng-encode
karakter struktur URI tertentu:

``` javascript
const url = "https://example.com/search?q=Budi Andi";

console.log(encodeURI(url));
```

## Perbedaan

``` text
encodeURI()
→ untuk URI secara keseluruhan

encodeURIComponent()
→ untuk satu bagian/component URI
```

## Kunci

> `encodeURIComponent()` → cocok untuk query parameter/value,
> `decodeURIComponent()` → kembalikan ke string asli.

## Kesalahan Umum

❌ Menggunakan `encodeURI()` untuk nilai query parameter.

✅ Gunakan `encodeURIComponent()` untuk value agar karakter khusus
ikut di-encode.

------------------------------------------------------------------------

<a id="bagian-16"></a>

# 16. 🟡 Base64

## Konsep

Base64 adalah encoding untuk merepresentasikan data biner sebagai
teks. Di browser, API yang umum adalah `btoa()` dan `atob()`.

## Encode dan Decode

``` javascript
const encoded = btoa("Hello");

console.log(encoded);

const decoded = atob("SGVsbG8=");

console.log(decoded);
```

## Output

``` text
SGVsbG8=
Hello
```

## Diagram

``` text
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

## Unicode

`btoa()` dan `atob()` bekerja dengan binary string dan tidak langsung
aman untuk semua Unicode. Untuk teks Unicode, gunakan
`TextEncoder`/`TextDecoder` bersama konversi byte:

``` javascript
const text = "Halo 👋";

const bytes = new TextEncoder().encode(text);
const binary = String.fromCharCode(...bytes);

const encoded = btoa(binary);

console.log(encoded);
```

## Kunci

> `btoa()` → binary string → Base64, `atob()` → Base64 → binary
> string.

> Di Node.js, Base64 umumnya menggunakan `Buffer`, misalnya
> `Buffer.from("Hello").toString("base64")`.

------------------------------------------------------------------------

<a id="bagian-17"></a>

# 17. 🔴 Proxy

## Konsep

`Proxy` digunakan untuk membuat object yang perilakunya dapat
di-intercept, misalnya saat property dibaca atau diubah.

## Contoh `get()`

``` javascript
const user = {
    name: "Budi"
};

const proxy = new Proxy(user, {
    get(target, property) {
        console.log(`Membaca property: ${String(property)}`);

        return target[property];
    }
});

console.log(proxy.name);
```

## Output

``` text
Membaca property: name
Budi
```

## Contoh `set()`

``` javascript
const user = {};

const proxy = new Proxy(user, {
    set(target, property, value) {
        console.log(`Mengubah ${String(property)}`);

        target[property] = value;

        return true;
    }
});

proxy.name = "Budi";
```

Proxy dapat digunakan untuk:

``` text
validasi
logging
intercept property
reactivity
custom behavior
```

## Kunci

> Proxy → object + handler, meng-intercept behavior.

``` javascript
new Proxy(target, {
    get() {},
    set() {}
});
```

## Best Practice

- Gunakan Proxy dengan hati-hati — menambah overhead dan bisa
  menyulitkan debugging.

------------------------------------------------------------------------

<a id="bagian-18"></a>

# 18. 🔴 Reflect

## Konsep

`Reflect` menyediakan method untuk operasi object yang terstruktur,
dan sering dipakai bersama `Proxy`.

## Contoh

``` javascript
const user = {
    name: "Budi"
};

console.log(Reflect.get(user, "name"));

Reflect.set(user, "age", 20);

console.log(Reflect.has(user, "name"));
```

## Output

``` text
Budi
true
```

## Method penting

``` javascript
Reflect.get()
Reflect.set()
Reflect.has()
Reflect.deleteProperty()
Reflect.ownKeys()
Reflect.construct()
```

## `Reflect` bersama `Proxy`

``` javascript
const proxy = new Proxy(user, {
    get(target, property, receiver) {
        return Reflect.get(target, property, receiver);
    }
});
```

## Kunci

> Proxy → intercept, Reflect → operasi object secara terstruktur.

------------------------------------------------------------------------

<a id="bagian-19"></a>

# 19. 🔴 Eval

## Konsep

`eval()` menjalankan string sebagai kode JavaScript.

## Contoh

``` javascript
const result = eval("10 + 20");

console.log(result);
```

## Output

``` text
30
```

Namun `eval()` umumnya **tidak direkomendasikan** untuk kode aplikasi
biasa karena dapat menimbulkan masalah keamanan, debugging, optimasi,
dan maintainability jika input berasal dari sumber yang tidak dipercaya.

Contoh berbahaya:

``` javascript
const input = getUserInput();

// eval(input);
```

Jangan menjalankan input user sebagai JavaScript.

## Alternatif

``` text
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

``` javascript
const operations = {
    add: (a, b) => a + b,
    multiply: (a, b) => a * b
};

console.log(operations.add(10, 20));
```

## Output

``` text
30
```

## Kunci

> `eval(string)` → menjalankan string sebagai JavaScript.
>
> Jangan gunakan `eval()` untuk input user/tidak terpercaya.

## Kesalahan Umum

❌ Menggunakan `eval()` pada input user — risiko code injection.

✅ Gunakan alternatif yang aman (mapping object, parser khusus, dll).

------------------------------------------------------------------------

<a id="bagian-20"></a>

# 20. 🛠️ Mini Flow JavaScript Standard Library

Gunakan alur ini ketika mengolah data:

``` text
1. Kenali jenis data (teks / list / key-value / tanggal)
        ↓
2. Pilih built-in object yang sesuai
        ↓
3. Gunakan method yang tepat (map, filter, reduce, dll.)
        ↓
4. Serialisasi jika perlu pertukaran data (JSON)
        ↓
5. Periksa keamanan (jangan eval input user)
```

### Kapan memakai apa?

  Kebutuhan                        Pilihan
  --------------------------------- ----------------------------
  Teks                              `String`
  Kumpulan data                    `Array`
  Key-value                        `Object` / `Map`
  Nilai unik                       `Set`
  Integer sangat besar              `BigInt`
  Tanggal & waktu                   `Date`
  Operasi matematika                `Math`
  Pertukaran data                   `JSON`
  Pattern matching                  `RegExp`
  Identifier unik                   `Symbol`
  Encodeng URI                      `encodeURIComponent()`
  Encoding binary ↔ teks            `btoa()` / `atob()`
  Intercept object                  `Proxy` + `Reflect`

> **Best practice:** kenali kelompok datanya terlebih dahulu, lalu
> cari method yang relevan — bukan menghafal semua API.

------------------------------------------------------------------------

<a id="bagian-21"></a>

# 21. 📚 Tabel Ringkasan

  Materi    API Penting                                Tujuan
  --------- ------------------------------------------ ---------------------------
  Number    `Number()`, `parseInt()`, `parseFloat()`    Angka
  String    `includes()`, `slice()`, `replace()`, `split()` Teks
  Array     `map()`, `filter()`, `find()`, `reduce()`   Kumpulan data berurutan
  Object    `Object.keys()`, `values()`, `entries()`    Data key-value
  JSON      `JSON.stringify()`, `JSON.parse()`          Serialisasi data
  BigInt    `123n`, `BigInt()`                          Integer sangat besar
  Date      `new Date()`, `getTime()`, `toISOString()`  Tanggal & waktu
  Math      `round()`, `floor()`, `ceil()`, `random()`  Operasi matematika
  Boolean   `Boolean()`                                 Nilai true/false
  Map       `set()`, `get()`, `has()`, `delete()`       Key-value fleksibel
  Set       `add()`, `has()`, `delete()`                Nilai unik
  Symbol    `Symbol()`                                  Identifier unik
  RegExp    `test()`, `match()`, `replace()`            Pattern matching
  Encode    `encodeURI()`, `encodeURIComponent()`       Encoding URI
  Base64    `btoa()`, `atob()`                          Encoding binary ↔ teks
  Proxy     `get`, `set`                                Intercept object behavior
  Reflect   `get()`, `set()`, `has()`                   Operasi object
  Eval      `eval()`                                    Eksekusi string sebagai JS

------------------------------------------------------------------------

<a id="bagian-22"></a>

# 22. ⚡ Cheat Code JavaScript Standard Library 10 Detik

``` text
Number   → angka, konversi
String   → teks
Array    → list
Object   → key-value
JSON     → data ↔ string
BigInt   → integer besar
Date     → tanggal
Math     → matematika
Boolean  → true/false
Map      → key-value fleksibel
Set      → unique
Symbol   → identifier unik
RegExp   → pattern
Proxy    → intercept
Reflect  → operasi object
Encode   → URI encoding
Base64   → binary ↔ text
Eval     → hindari
```

## Number dan String

``` javascript
Number("100");
parseInt("100px", 10);

"Budi".toUpperCase();
"apel,jeruk".split(",");
"  Budi  ".trim();
```

## Array

``` javascript
[1, 2, 3].map(x => x * 2);
[1, 2, 3, 4].filter(x => x % 2 === 0);
[1, 2, 3].reduce((a, b) => a + b, 0);
[10, 2, 5].sort((a, b) => a - b);
```

## Object dan JSON

``` javascript
Object.keys(user);
Object.values(user);
Object.entries(user);

JSON.stringify(user);
JSON.parse(json);
```

## Map dan Set

``` javascript
const map = new Map();
map.set("name", "Budi");
map.get("name");

const unique = [...new Set([1, 2, 2, 3])];
```

## RegExp

``` javascript
/^\d+$/.test("123");
"apel 10, jeruk 20".match(/\d+/g);
```

------------------------------------------------------------------------

<a id="bagian-23"></a>

# 23. 🧭 Urutan Belajar yang Disarankan

``` text
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

Prinsip: kuasai dulu String, Array, Object, dan JSON — empat ini
paling sering dipakai sehari-hari.

------------------------------------------------------------------------

<a id="bagian-24"></a>

# 24. 🏗️ Mini Project

## Data User dengan Standard Library

Project ini menggabungkan:

``` text
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

## Program

``` javascript
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
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

console.log(userMap.get(1).name);

// Number
const totalUsers = Number(validUsers.length);

console.log(totalUsers);

// Date
const createdAt = new Date();

console.log(createdAt.toISOString());

// JSON
const json = JSON.stringify(validUsers);

console.log(json);

// JSON → object
const parsedUsers = JSON.parse(json);

console.log(parsedUsers.length);
```

## Contoh output

``` text
[ 'JavaScript', 'PHP', 'Python', 'Go' ]
Budi
3
2026-...
[{"id":1,...}]
3
```

## Alur

``` text
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

------------------------------------------------------------------------

<a id="bagian-25"></a>

# 25. 🔗 Referensi Resmi

- [MDN — JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
- [MDN — Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
- [MDN — String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
- [MDN — Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN — Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- [MDN — JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)
- [MDN — BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
- [MDN — Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [MDN — Math](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math)
- [MDN — Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
- [MDN — Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN — Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN — Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [MDN — RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- [MDN — Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN — Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
- [MDN — encodeURI()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)
- [MDN — encodeURIComponent()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
- [MDN — btoa()](https://developer.mozilla.org/en-US/docs/Web/API/Window/btoa)
- [MDN — atob()](https://developer.mozilla.org/en-US/docs/Web/API/Window/atob)
- [MDN — eval()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)
- [ECMAScript Language Specification](https://tc39.es/ecma262/)

> **Catatan:** JavaScript memiliki perbedaan environment. Contohnya
> `btoa()`/`atob()` dan DOM tersedia di browser, sedangkan `Buffer`,
> `fs`, `path` tersedia di Node.js. Topik seperti Number, String,
> Array, Object, JSON, Map, Set, Symbol, RegExp, Proxy, Reflect
> merupakan bagian penting dari JavaScript/ECMAScript standard.
