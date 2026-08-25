# JavaScript Dasar Cheatsheet Revised

> **Target:** pemula yang baru mulai belajar JavaScript modern (ES2020+),
> belum pernah atau baru sedikit mengenal pemrograman.
>
> Fokus cheatsheet ini: **pengenalan bahasa → tipe data → variable →
> operator → control flow (if/switch/loop) → function → advanced
> function → best practice modern**.
>
> **Batasan penting:** JavaScript dapat berjalan di browser dan di
> runtime seperti Node.js. Cheatsheet ini fokus pada inti bahasa
> (language core), bukan API DOM/browser.

## Cara Belajar

``` text
🟢 Fundamental
→ wajib untuk mulai menulis kode JavaScript

🟡 Lanjutan
→ pelajari setelah fundamental nyaman

🔴 Advanced / Reference
→ penting ketika kebutuhan aplikasi meningkat
```

Mental model:

``` text
HTML → apa yang ada
CSS  → bagaimana tampilannya
JS   → bagaimana perilakunya
```

``` text
Kode JavaScript
  ↓
Diproses engine (browser / Node.js)
  ↓
Hasil / perilaku
```

**Penting:** JavaScript adalah bahasa yang:

``` text
dynamically typed
case-sensitive
statement biasanya diakhiri ;
block kode menggunakan {}
function adalah first-class value
```

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan JavaScript](#bagian-1)
2. [Program Hello World](#bagian-2)
3. [Komentar](#bagian-3)
4. [Tipe Data Number](#bagian-4)
5. [Tipe Data Boolean](#bagian-5)
6. [Tipe Data String](#bagian-6)
7. [Variable](#bagian-7)
8. [Operator Matematika](#bagian-8)
9. [Operator Perbandingan](#bagian-9)
10. [Operator Logika](#bagian-10)
11. [Console](#bagian-11)
12. [String Template](#bagian-12)
13. [Konversi String dan Number](#bagian-13)
14. [Tipe Data Array](#bagian-14)
15. [Tipe Data Object](#bagian-15)
16. [If Expression](#bagian-16)

### 🟡 Lanjutan

17. [Popup](#bagian-17)
18. [Undefined dan Null](#bagian-18)
19. [Switch Expression](#bagian-19)
20. [Operator typeof dan in](#bagian-20)
21. [Ternary Operator](#bagian-21)
22. [Nullish Coalescing Operator](#bagian-22)
23. [Optional Chaining](#bagian-23)
24. [Falsy dan Truthy](#bagian-24)
25. [Operator Logika di Non Boolean](#bagian-25)
26. [For Loop](#bagian-26)
27. [While Loop](#bagian-27)
28. [Do While Loop](#bagian-28)
29. [Break dan Continue](#bagian-29)
30. [Label](#bagian-30)
31. [For In dan For Of](#bagian-31)
32. [With Statement](#bagian-32)
33. [Function](#bagian-33)
34. [Parameter dan Return Value](#bagian-34)
35. [Optional, Default, dan Rest Parameter](#bagian-35)

### 🔴 Advanced / Reference

36. [Function Sebagai Value dan Anonymous](#bagian-36)
37. [Function dalam Function dan Scope](#bagian-37)
38. [Recursive Function](#bagian-38)
39. [Function Generator](#bagian-39)
40. [Arrow Function](#bagian-40)
41. [Closure](#bagian-41)
42. [Object Method dan this](#bagian-42)
43. [Arrow Function di Object](#bagian-43)
44. [Getter dan Setter](#bagian-44)
45. [Masalah Variable var](#bagian-45)
46. [Destructuring](#bagian-46)
47. [Strict Mode dan Debugger](#bagian-47)
48. [Mini Flow JavaScript](#bagian-48)
49. [Tabel Ringkasan](#bagian-49)
50. [Cheat Code JavaScript 10 Detik](#bagian-50)
51. [Urutan Belajar yang Disarankan](#bagian-51)
52. [Mini Project](#bagian-52)
53. [Referensi Resmi](#bagian-53)

------------------------------------------------------------------------

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan JavaScript

## Konsep

JavaScript adalah bahasa pemrograman yang dapat berjalan di browser
untuk membuat halaman web interaktif, dan juga dapat berjalan di luar
browser, misalnya dengan Node.js.

``` text
Browser
   │
   ├── HTML → struktur
   ├── CSS  → tampilan
   └── JS   → perilaku / logic
```

Contoh:

``` html
<script>
    console.log("Halo JavaScript!");
</script>
```

## Kunci

> HTML → apa yang ada, CSS → bagaimana tampilannya, JS → bagaimana
> perilakunya.

## Best Practice

- Pahami dulu inti bahasa (variable, tipe data, function, control
  flow) sebelum masuk ke DOM atau framework.

------------------------------------------------------------------------

<a id="bagian-2"></a>

# 2. 🟢 Program Hello World

## Konsep

Cara paling sederhana menampilkan output di JavaScript adalah dengan
`console.log()`.

## Contoh

``` javascript
console.log("Hello World!");
```

## Output

``` text
Hello World!
```

Di browser, JavaScript juga dapat ditulis di HTML:

``` html
<!DOCTYPE html>
<html>
<body>

<script>
    console.log("Hello World!");
</script>

</body>
</html>
```

## Kunci

> `console.log()` = tampilkan ke console.

------------------------------------------------------------------------

<a id="bagian-3"></a>

# 3. 🟢 Komentar

## Konsep

Komentar tidak dieksekusi sebagai kode. Digunakan untuk menjelaskan
maksud kode.

## Single-line

``` javascript
// Ini komentar
```

## Multi-line

``` javascript
/*
    Ini komentar
    lebih dari satu baris
*/
```

Contoh:

``` javascript
// Menampilkan nama
console.log("Budi");
```

## Kunci

> `//` → satu baris, `/* */` → banyak baris.

## Best Practice

- Tulis komentar untuk menjelaskan **kenapa**, bukan mengulang apa yang
  sudah jelas dari kode.

------------------------------------------------------------------------

<a id="bagian-4"></a>

# 4. 🟢 Tipe Data Number

## Konsep

JavaScript menggunakan satu tipe `number` untuk integer maupun desimal.

## Contoh

``` javascript
let age = 20;
let price = 19.99;
let temperature = -2.5;

console.log(10);
console.log(10.5);
```

## Output

``` text
10
10.5
```

JavaScript juga memiliki `bigint` untuk bilangan integer yang sangat
besar:

``` javascript
const bigNumber = 12345678901234567890n;
```

## Kunci

> `10` → number, `10.5` → number, `123n` → bigint.

## Best Practice

- Untuk operasi angka biasa, `number` adalah tipe yang paling sering
  digunakan.

------------------------------------------------------------------------

<a id="bagian-5"></a>

# 5. 🟢 Tipe Data Boolean

## Konsep

Boolean hanya memiliki dua nilai: `true` dan `false`. Boolean banyak
digunakan untuk kondisi.

## Contoh

``` javascript
const isLogin = true;
const isAdmin = false;

if (isLogin) {
    console.log("Selamat datang");
}
```

## Output

``` text
Selamat datang
```

## Kunci

> `true` → ya, `false` → tidak.

------------------------------------------------------------------------

<a id="bagian-6"></a>

# 6. 🟢 Tipe Data String

## Konsep

String adalah teks. JavaScript mendukung single quote, double quote,
dan backtick (template literal).

## Contoh

``` javascript
const name = "Budi";
const city = 'Bandung';

const a = "Hello";
const b = 'Hello';
const c = `Hello`;
```

## Concatenation

Gunakan `+`:

``` javascript
const name = "Budi";

console.log("Halo " + name);
```

## Output

``` text
Halo Budi
```

Untuk string modern, template literal biasanya lebih nyaman.

## Kunci

> `"..."` → string, `'...'` → string, `` `...` `` → template literal,
> `+` → gabungkan string.

## Best Practice

- Gunakan template literal (`` ` ``) untuk menggabungkan string dengan
  nilai variable.

------------------------------------------------------------------------

<a id="bagian-7"></a>

# 7. 🟢 Variable

## Konsep

Variable digunakan untuk menyimpan nilai. JavaScript modern
menggunakan `let` dan `const`.

## Contoh

``` javascript
let name = "Budi";
const age = 20;
```

## Mengubah nilai

`let` dapat diubah:

``` javascript
let count = 10;

count = 20;

console.log(count);
```

## Output

``` text
20
```

`const` tidak dapat di-assign ulang:

``` javascript
const name = "Budi";

// name = "Andi"; // TypeError
```

## Aturan nama variable

Valid:

``` javascript
let name;
let userName;
let user_name;
let $value;
let _value;
```

Tidak valid:

``` javascript
// let 1name;
// let user-name;
```

## Kunci

> `let` → boleh di-assign ulang, `const` → tidak boleh di-assign
> ulang.

> `const` tidak berarti object/array menjadi immutable. Yang tidak
> boleh diubah adalah binding-nya.

## Best Practice

- Gunakan `const` secara default.
- Gunakan `let` hanya jika nilai perlu di-assign ulang.
- Hindari `var` pada kode modern (lihat section 45).

------------------------------------------------------------------------

<a id="bagian-8"></a>

# 8. 🟢 Operator Matematika

## Konsep

Operator matematika digunakan untuk operasi angka.

## Contoh

Operator dasar:

| Operator | Fungsi | Contoh |
| --- | --- | --- |
| `+` | tambah | `10 + 3` |
| `-` | kurang | `10 - 3` |
| `*` | kali | `10 * 3` |
| `/` | bagi | `10 / 3` |
| `%` | sisa bagi | `10 % 3` |
| `**` | pangkat | `2 ** 3` |

``` javascript
const a = 10;
const b = 3;

console.log(a + b);
console.log(a - b);
console.log(a * b);
console.log(a / b);
console.log(a % b);
console.log(a ** b);
```

## Output

``` text
13
7
30
3.3333333333333335
1
1000
```

## Increment dan decrement

``` javascript
let count = 1;

count++;
count--;

console.log(count);
```

## Output

``` text
1
```

## Kunci

> `+ - * / % **` → operator dasar, `++ --` → increment/decrement.

------------------------------------------------------------------------

<a id="bagian-9"></a>

# 9. 🟢 Operator Perbandingan

## Konsep

Operator perbandingan membandingkan dua nilai dan menghasilkan
boolean.

## Contoh

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

``` javascript
console.log(5 == "5");
console.log(5 === "5");
```

## Output

``` text
true
false
```

Karena:

``` text
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

## Kunci

> Gunakan `===` dan `!==` untuk perbandingan ketat.

## Kesalahan Umum

❌ Menggunakan `==` — hasilnya tergantung coercion yang sering
membingungkan.

✅ Selalu gunakan `===` / `!==` pada kode modern.

------------------------------------------------------------------------

<a id="bagian-10"></a>

# 10. 🟢 Operator Logika

## Konsep

Operator logika menggabungkan kondisi boolean.

## Contoh

| Operator | Arti |
| --- | --- |
| `&&` | AND |
| `||` | OR |
| `!` | NOT |

``` javascript
const age = 20;
const isMember = true;

if (age >= 18 && isMember) {
    console.log("Boleh masuk");
}
```

## Output

``` text
Boleh masuk
```

## Truth table sederhana

``` text
AND (&&)

true  && true  = true
true  && false = false
false && true  = false
false && false = false
```

``` text
OR (||)

true  || true  = true
true  || false = true
false || true  = true
false || false = false
```

``` text
NOT (!)

!true  = false
!false = true
```

## Kunci

> `&&` → semua harus true, `||` → salah satu cukup true, `!` →
> kebalikan.

------------------------------------------------------------------------

<a id="bagian-11"></a>

# 11. 🟢 Console

## Konsep

`console` digunakan untuk debugging dan melihat informasi saat program
berjalan.

## Contoh

``` javascript
console.log("Hello");
console.error("Terjadi error");
console.warn("Hati-hati");
```

## `console.table()`

``` javascript
const users = [
    { name: "Budi", age: 20 },
    { name: "Andi", age: 25 }
];

console.table(users);
```

## Melihat tipe data

``` javascript
const value = 10;

console.log(typeof value);
```

## Output

``` text
number
```

## Kunci

> `console.log()` → info, `console.error()` → error, `console.warn()`
> → warning, `console.table()` → data tabel.

------------------------------------------------------------------------

<a id="bagian-12"></a>

# 12. 🟢 String Template

## Konsep

Template literal menggunakan backtick `` ` `` dan memungkinkan
menyisipkan expression dengan `${}`.

## Contoh

``` javascript
const name = "Budi";
const age = 20;

console.log(`Halo ${name}, umur kamu ${age}`);
```

## Output

``` text
Halo Budi, umur kamu 20
```

## Expression di dalam template

``` javascript
const a = 10;
const b = 5;

console.log(`Hasil = ${a + b}`);
```

## Output

``` text
Hasil = 15
```

## Kunci

> `` `Halo ${name}` `` → `${}` adalah expression yang dievaluasi.

## Best Practice

- Gunakan template literal untuk menyusun string dinamis — lebih mudah
  dibaca daripada concatenation `+`.

------------------------------------------------------------------------

<a id="bagian-13"></a>

# 13. 🟢 Konversi String dan Number

## Konsep

JavaScript menyediakan cara eksplisit untuk mengubah nilai antara
string dan number.

## Number → String

Gunakan `String()`:

``` javascript
const number = 100;

const text = String(number);

console.log(text);
console.log(typeof text);
```

## Output

``` text
100
string
```

Bisa juga:

``` javascript
const text = (100).toString();
```

## String → Number

Gunakan `Number()`:

``` javascript
const text = "100";

const number = Number(text);

console.log(number);
console.log(typeof number);
```

## Output

``` text
100
number
```

## `parseInt()` dan `parseFloat()`

``` javascript
console.log(parseInt("100px", 10));
console.log(parseFloat("10.5px"));
```

## Output

``` text
100
10.5
```

## Konversi gagal

``` javascript
console.log(Number("hello"));
```

## Output

``` text
NaN
```

## Kunci

> `String(100)` → `"100"`, `Number("100")` → `100`, `parseInt("10px")`
> → `10`, `parseFloat(...)` → desimal.

## Kesalahan Umum

❌ Menggunakan `parseInt()` tanpa radix (basis angka).

✅ Selalu sertakan radix `10` untuk bilangan desimal:
`parseInt("100px", 10)`.

------------------------------------------------------------------------

<a id="bagian-14"></a>

# 14. 🟢 Tipe Data Array

## Konsep

Array digunakan untuk menyimpan banyak nilai. Index dimulai dari `0`.

## Contoh

``` javascript
const fruits = [
    "Apple",
    "Banana",
    "Orange"
];
```

Index:

``` text
0 → Apple
1 → Banana
2 → Orange
```

Akses:

``` javascript
console.log(fruits[0]);
```

## Output

``` text
Apple
```

## Mengubah dan menambah item

``` javascript
fruits[0] = "Mango";
fruits.push("Durian");
```

## Nested array

``` javascript
const matrix = [
    [1, 2],
    [3, 4]
];

console.log(matrix[0][1]);
```

## Output

``` text
2
```

## Kunci

> `array[index]` → akses, index dimulai dari `0`.

## Best Practice

- Gunakan `push()` untuk menambah item di akhir array.

------------------------------------------------------------------------

<a id="bagian-15"></a>

# 15. 🟢 Tipe Data Object

## Konsep

Object menyimpan data dalam bentuk property `key: value`.

## Contoh

``` javascript
const user = {
    name: "Budi",
    age: 20,
    city: "Bandung"
};
```

Akses dengan dot dan bracket:

``` javascript
console.log(user.name);
console.log(user["age"]);
```

## Output

``` text
Budi
20
```

## Menambah property

``` javascript
user.email = "budi@example.com";
```

## Nested object

``` javascript
const user = {
    name: "Budi",
    address: {
        city: "Bandung"
    }
};

console.log(user.address.city);
```

## Output

``` text
Bandung
```

## Kunci

> `object.property` atau `object["property"]`.

------------------------------------------------------------------------

<a id="bagian-16"></a>

# 16. 🟢 If Expression

## Konsep

`if` digunakan untuk mengambil keputusan berdasarkan kondisi.

## Contoh

``` javascript
const age = 20;

if (age >= 18) {
    console.log("Dewasa");
}
```

## if - else

``` javascript
const age = 15;

if (age >= 18) {
    console.log("Dewasa");
} else {
    console.log("Anak-anak");
}
```

## if - else if - else

``` javascript
const score = 85;

if (score >= 90) {
    console.log("A");
} else if (score >= 80) {
    console.log("B");
} else {
    console.log("C");
}
```

## Output

``` text
B
```

## Kunci

> `if` → true jalankan blok, false cek `else` / `else if`.

## Best Practice

- Untuk nilai tunggal dengan banyak pilihan, pertimbangkan `switch`
  (section 19).

------------------------------------------------------------------------

<a id="bagian-17"></a>

# 17. 🟡 Popup

## Konsep

Browser menyediakan beberapa popup bawaan: `alert()`, `confirm()`, dan
`prompt()`.

## Contoh

``` javascript
alert("Selamat datang!");
```

``` javascript
const result = confirm("Hapus data?");

console.log(result);
```

Hasil:

``` text
true  → OK
false → Cancel
```

``` javascript
const name = prompt("Siapa nama kamu?");

console.log(name);
```

`prompt()` mengembalikan string atau `null` jika dibatalkan.

## Kunci

> `alert()` → informasi, `confirm()` → tanya OK/Cancel, `prompt()` →
> minta input.

> Popup ini adalah API browser, bukan fitur khusus bahasa JavaScript
> yang tersedia di semua runtime.

## Best Practice

- Untuk aplikasi nyata, gunakan UI sendiri daripada popup bawaan —
  popup memblokir interaksi dan tampilannya tidak konsisten.

------------------------------------------------------------------------

<a id="bagian-18"></a>

# 18. 🟡 Undefined dan Null

## Konsep

`undefined` berarti nilai belum diberikan atau property tidak ditemukan.
`null` biasanya digunakan secara sengaja untuk menyatakan "tidak ada
nilai".

## Undefined

``` javascript
let name;

console.log(name);
```

## Output

``` text
undefined
```

Property yang tidak ada juga menghasilkan `undefined`:

``` javascript
const user = {};

console.log(user.name);
```

## Output

``` text
undefined
```

## Null

``` javascript
const user = null;

console.log(user);
```

## Output

``` text
null
```

## Perbedaan

``` text
undefined → nilai belum tersedia / tidak diberikan
null      → sengaja menyatakan tidak ada nilai
```

Contoh:

``` javascript
let selectedUser = null;

if (selectedUser === null) {
    console.log("Belum memilih user");
}
```

## Catatan

``` javascript
typeof null
```

menghasilkan:

``` text
"object"
```

Ini adalah perilaku historis JavaScript.

## Kunci

> `undefined` = nilai belum diberikan, `null` = sengaja tidak ada nilai.

------------------------------------------------------------------------

<a id="bagian-19"></a>

# 19. 🟡 Switch Expression

## Konsep

`switch` cocok ketika satu nilai dibandingkan dengan beberapa pilihan.

## Contoh

``` javascript
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

## Output

``` text
Dashboard Admin
```

## Jangan lupa `break`

Tanpa `break`, eksekusi dapat berlanjut ke `case` berikutnya.

``` javascript
switch (role) {
    case "admin":
        console.log("Admin");
        break;
}
```

## Kunci

> `switch(value)` → `case A`, `case B`, `default`.

> `switch` adalah statement, bukan expression yang mengembalikan nilai
> seperti `switch` pada beberapa bahasa lain.

## Kesalahan Umum

❌ Lupa `break` — eksekusi jatuh ke case berikutnya.

✅ Selalu akhiri tiap `case` dengan `break` (atau `return` di dalam
function).

------------------------------------------------------------------------

<a id="bagian-20"></a>

# 20. 🟡 Operator typeof dan in

## Konsep

`typeof` digunakan untuk mengetahui tipe data. Operator `in` digunakan
untuk mengecek apakah property/index ada pada object.

## `typeof`

``` javascript
console.log(typeof 10);
console.log(typeof "Hello");
console.log(typeof true);
console.log(typeof undefined);
```

## Output

``` text
number
string
boolean
undefined
```

Tipe umum:

``` text
typeof 10           → "number"
typeof "PHP"        → "string"
typeof true         → "boolean"
typeof undefined    → "undefined"
typeof null         → "object"
typeof {}           → "object"
typeof []           → "object"
typeof function(){} → "function"
```

## `in`

``` javascript
const user = {
    name: "Budi",
    age: 20
};

console.log("name" in user);
console.log("email" in user);
```

## Output

``` text
true
false
```

Pada array, `in` mengecek **index**, bukan isi:

``` javascript
const fruits = ["Apple", "Banana"];

console.log(0 in fruits);
console.log("Apple" in fruits);
```

## Output

``` text
true
false
```

## Kunci

> `typeof value` → "nama tipe", `property in object` → cek keberadaan.

------------------------------------------------------------------------

<a id="bagian-21"></a>

# 21. 🟡 Ternary Operator

## Konsep

Ternary adalah bentuk singkat dari `if/else` yang menghasilkan nilai.

## Contoh

``` javascript
const age = 20;

const status = age >= 18
    ? "Dewasa"
    : "Anak-anak";

console.log(status);
```

## Output

``` text
Dewasa
```

Bentuk panjang:

``` javascript
let status;

if (age >= 18) {
    status = "Dewasa";
} else {
    status = "Anak-anak";
}
```

## Kunci

> `condition ? true : false`.

## Best Practice

- Gunakan ternary untuk assignment sederhana. Jika percabangannya
  kompleks, gunakan `if/else` biasa agar mudah dibaca.

------------------------------------------------------------------------

<a id="bagian-22"></a>

# 22. 🟡 Nullish Coalescing Operator

## Konsep

Gunakan `??` untuk fallback ketika nilai `null` atau `undefined`.

## Contoh

``` javascript
const name = null;

const result = name ?? "Guest";

console.log(result);
```

## Output

``` text
Guest
```

Perhatikan perbedaannya dengan `||`:

``` javascript
console.log(0 || "fallback");
console.log(0 ?? "fallback");
```

## Output

``` text
fallback
0
```

Karena `??` hanya menganggap `null` dan `undefined` sebagai nullish,
sedangkan `||` menganggap semua falsy.

## Kunci

> `??` = kalau null/undefined, pakai cadangan.

## Kesalahan Umum

❌ Menggunakan `||` untuk fallback nilai `0` atau `""` — fallback ikut
terpakai padahal nilainya valid.

✅ Gunakan `??` jika hanya ingin menangani `null`/`undefined`.

------------------------------------------------------------------------

<a id="bagian-23"></a>

# 23. 🟡 Optional Chaining

## Konsep

Optional chaining `?.` digunakan untuk mengakses property tanpa error
ketika bagian sebelumnya `null` atau `undefined`.

## Contoh

``` javascript
const user = {
    profile: {
        name: "Budi"
    }
};

console.log(user.profile?.name);
```

## Output

``` text
Budi
```

Jika `profile` tidak ada:

``` javascript
const user = {};

console.log(user.profile?.name);
```

## Output

``` text
undefined
```

Tanpa `?.`, akses berantai seperti `user.profile.name` dapat
menghasilkan error jika `profile` tidak ada.

## Optional method call

``` javascript
const user = {
    sayHello() {
        console.log("Hello");
    }
};

user.sayHello?.();
```

## Kunci

> `object?.property`, `object?.method?.()`.

## Best Practice

- Gunakan `?.` saat mengakses data yang mungkin tidak lengkap,
  misalnya response API.

------------------------------------------------------------------------

<a id="bagian-24"></a>

# 24. 🟡 Falsy dan Truthy

## Konsep

JavaScript memiliki nilai yang dianggap `false` dalam konteks boolean
(falsy), dan hampir semua nilai lain dianggap `true` (truthy).

## Falsy

Nilai falsy utama:

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

Contoh:

``` javascript
if ("") {
    console.log("true");
} else {
    console.log("false");
}
```

## Output

``` text
false
```

## Truthy

Hampir semua nilai lain adalah truthy:

``` javascript
if ("Hello") {
    console.log("true");
}
```

## Output

``` text
true
```

Perhatikan:

``` javascript
Boolean("false"); // true
Boolean([]);      // true
Boolean({});      // true
```

## Kunci

> Falsy → dianggap false, Truthy → dianggap true.

## Kesalahan Umum

❌ Mengira array kosong `[]` atau string `"false"` itu falsy.

✅ Keduanya truthy. Hanya 8 nilai yang falsy (lihat daftar di atas).

------------------------------------------------------------------------

<a id="bagian-25"></a>

# 25. 🟡 Operator Logika di Non Boolean

## Konsep

Operator `&&` dan `||` tidak selalu menghasilkan boolean — mereka
mengembalikan salah satu operand.

## `&&`

Mengembalikan operand pertama yang falsy, atau operand terakhir jika
semuanya truthy.

``` javascript
console.log("A" && "B");
console.log(0 && "B");
```

## Output

``` text
B
0
```

## `||`

Mengembalikan operand pertama yang truthy.

``` javascript
console.log("" || "Guest");
console.log("Budi" || "Guest");
```

## Output

``` text
Guest
Budi
```

## `??`

Mengembalikan nilai kanan hanya jika kiri `null` atau `undefined`.

``` javascript
console.log(null ?? "Guest");
console.log(0 ?? "Guest");
```

## Output

``` text
Guest
0
```

## Kunci

> `&&` → cari falsy, `||` → cari truthy, `??` → cari non-nullish.

## Best Practice

- Gunakan `||` untuk default value yang menganggap falsy sebagai
  kosong, dan `??` jika hanya `null`/`undefined` yang harus diganti.

------------------------------------------------------------------------

<a id="bagian-26"></a>

# 26. 🟡 For Loop

## Konsep

`for` digunakan ketika jumlah iterasi dikontrol oleh counter.

## Contoh

``` javascript
for (let i = 1; i <= 5; i++) {
    console.log(i);
}
```

## Output

``` text
1
2
3
4
5
```

Struktur:

``` text
for (
    initialization;
    condition;
    increment
)
```

Diagram:

``` text
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

## Kunci

> `init → condition → body → increment`.

------------------------------------------------------------------------

<a id="bagian-27"></a>

# 27. 🟡 While Loop

## Konsep

`while` menjalankan block selama kondisi `true`. Kondisi dicek dulu,
baru body dijalankan.

## Contoh

``` javascript
let i = 1;

while (i <= 5) {
    console.log(i);
    i++;
}
```

## Output

``` text
1
2
3
4
5
```

Pastikan kondisi akhirnya berubah agar tidak terjadi infinite loop.

## Kunci

> `while` = cek dulu, baru jalankan.

## Kesalahan Umum

❌ Lupa mengubah kondisi di dalam loop — terjadi infinite loop.

✅ Pastikan ada statement yang mengubah nilai kondisi (misal `i++`).

------------------------------------------------------------------------

<a id="bagian-28"></a>

# 28. 🟡 Do While Loop

## Konsep

Perbedaan utama dengan `while`: `do while` menjalankan body dulu,
baru mengecek kondisi. Body dijamin berjalan minimal sekali.

## Contoh

``` javascript
let i = 10;

do {
    console.log(i);
    i++;
} while (i <= 5);
```

## Output

``` text
10
```

Walaupun kondisi awal `false`, body tetap dijalankan sekali.

## Kunci

> `while` → cek dulu, `do while` → jalankan dulu (minimal 1 kali).

## Best Practice

- Gunakan `do while` hanya jika body harus jalan minimal sekali
  sebelum kondisi dicek.

------------------------------------------------------------------------

<a id="bagian-29"></a>

# 29. 🟡 Break dan Continue

## Konsep

`break` menghentikan loop, `continue` melewati iterasi saat ini.

## `break`

``` javascript
for (let i = 1; i <= 10; i++) {
    if (i === 5) {
        break;
    }

    console.log(i);
}
```

## Output

``` text
1
2
3
4
```

## `continue`

``` javascript
for (let i = 1; i <= 5; i++) {
    if (i === 3) {
        continue;
    }

    console.log(i);
}
```

## Output

``` text
1
2
4
5
```

## Kunci

> `break` → keluar, `continue` → lewati.

------------------------------------------------------------------------

<a id="bagian-30"></a>

# 30. 🟡 Label

## Konsep

Label memberi nama pada statement atau loop, sehingga `break` /
`continue` bisa menunjuk ke loop tertentu (terutama nested loop).

## Contoh

``` javascript
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

``` javascript
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

## Kunci

> `label:` → beri nama loop, `break label;` / `continue label;`.

## Best Practice

- Label jarang diperlukan. Gunakan hanya jika membuat alur nested loop
  lebih jelas — biasanya lebih baik di-refactor ke function.

------------------------------------------------------------------------

<a id="bagian-31"></a>

# 31. 🟡 For In dan For Of

## Konsep

`for...in` mengiterasi **key/property** dari object. `for...of`
mengiterasi **value** dari iterable seperti array dan string.

## `for...in`

``` javascript
const user = {
    name: "Budi",
    age: 20
};

for (const key in user) {
    console.log(key, user[key]);
}
```

## Output

``` text
name Budi
age 20
```

Pada array, `for...in` menghasilkan index:

``` javascript
const fruits = ["Apple", "Banana"];

for (const index in fruits) {
    console.log(index);
}
```

## Output

``` text
0
1
```

## `for...of`

``` javascript
const fruits = ["Apple", "Banana", "Orange"];

for (const fruit of fruits) {
    console.log(fruit);
}
```

## Output

``` text
Apple
Banana
Orange
```

String juga iterable:

``` javascript
for (const char of "ABC") {
    console.log(char);
}
```

## Output

``` text
A
B
C
```

## Kunci

> `for...in` → key, `for...of` → value.

## Best Practice

- Untuk array, gunakan `for...of` atau method array seperti
  `forEach()` — bukan `for...in`.

------------------------------------------------------------------------

<a id="bagian-32"></a>

# 32. 🟡 With Statement

## Konsep

`with` memperpendek akses property dengan memasukkan object ke lexical
environment. Ini adalah fitur lama yang **jangan digunakan dalam kode
modern**.

## Contoh historis

``` javascript
const user = {
    name: "Budi",
    age: 20
};

with (user) {
    console.log(name);
    console.log(age);
}
```

## Mengapa dihindari

- membuat scope sulit diprediksi;
- mengurangi keterbacaan;
- tidak tersedia dalam strict mode;
- dapat menyebabkan ambiguitas nama variable.

Gunakan akses property biasa:

``` javascript
console.log(user.name);
console.log(user.age);
```

## Kunci

> `with` → hindari.

------------------------------------------------------------------------

<a id="bagian-33"></a>

# 33. 🟡 Function

## Konsep

Function adalah blok kode yang dapat dipanggil berulang kali.

## Contoh

``` javascript
function sayHello() {
    console.log("Hello JavaScript");
}

sayHello();
```

## Output

``` text
Hello JavaScript
```

Function dapat mengembalikan nilai:

``` javascript
function getName() {
    return "Budi";
}

console.log(getName());
```

## Output

``` text
Budi
```

## Kunci

> `function` = bungkus logic agar reusable.

## Best Practice

- Beri nama function dengan kata kerja yang menjelaskan aksinya
  (misal `getGrade`, `calculateTotal`).

------------------------------------------------------------------------

<a id="bagian-34"></a>

# 34. 🟡 Parameter dan Return Value

## Konsep

Parameter adalah variable yang menerima nilai ketika function dipanggil
(argument). `return` mengirim nilai keluar dan menghentikan eksekusi
function.

## Contoh

``` javascript
function greet(name) {
    console.log(`Halo ${name}`);
}

greet("Budi");
```

## Output

``` text
Halo Budi
```

Multiple parameter:

``` javascript
function add(a, b) {
    return a + b;
}

console.log(add(10, 5));
```

## Output

``` text
15
```

## Parameter vs Argument

``` text
function greet(name)
              ↑
          parameter

greet("Budi");
      ↑
    argument
```

## `return` menghentikan eksekusi

``` javascript
function test() {
    return "Selesai";

    console.log("Tidak dijalankan");
}
```

## Kunci

> `parameter` → saat define, `argument` → saat call.
>
> `return` = kirim nilai keluar + hentikan function.

------------------------------------------------------------------------

<a id="bagian-35"></a>

# 35. 🟡 Optional, Default, dan Rest Parameter

## Konsep

Parameter JavaScript dapat tidak diberikan (menjadi `undefined`), diberi
nilai default, atau mengumpulkan sisa argument dengan rest parameter.

## Optional parameter

``` javascript
function greet(name) {
    console.log(name);
}

greet();
```

## Output

``` text
undefined
```

## Default parameter

``` javascript
function greet(name = "Guest") {
    console.log(`Halo ${name}`);
}

greet();
greet("Budi");
```

## Output

``` text
Halo Guest
Halo Budi
```

Perhatikan:

``` javascript
greet(undefined); // Guest
greet(null);      // null
```

`null` tidak memicu default parameter.

## Rest parameter

``` javascript
function sum(...numbers) {
    let total = 0;

    for (const number of numbers) {
        total += number;
    }

    return total;
}

console.log(sum(1, 2, 3, 4));
```

## Output

``` text
10
```

Dengan parameter biasa:

``` javascript
function greet(firstName, ...others) {
    console.log(firstName);
    console.log(others);
}

greet("Budi", "Andi", "Siti");
```

## Output

``` text
Budi
["Andi", "Siti"]
```

## Kunci

> `undefined` → pakai default, `null` → tetap null.
>
> `...args` → kumpulkan sisa argument menjadi array.

## Kesalahan Umum

❌ Menaruh rest parameter bukan di posisi terakhir.

✅ Rest parameter harus menjadi parameter terakhir:
`function greet(firstName, ...others)`.

------------------------------------------------------------------------

<a id="bagian-36"></a>

# 36. 🔴 Function Sebagai Value dan Anonymous

## Konsep

Di JavaScript, function adalah **first-class value**: bisa disimpan di
variable, dikirim sebagai argument, dan dikembalikan dari function
lain. Anonymous function adalah function tanpa nama.

## Function sebagai value

``` javascript
function sayHello() {
    console.log("Hello");
}

const fn = sayHello;

fn();
```

Function dikirim sebagai argument:

``` javascript
function execute(callback) {
    callback();
}

execute(sayHello);
```

Function dikembalikan dari function lain:

``` javascript
function createGreeting() {
    return function () {
        console.log("Hello");
    };
}

const greeting = createGreeting();

greeting();
```

## Anonymous function

``` javascript
const greet = function (name) {
    return `Halo ${name}`;
};

console.log(greet("Budi"));
```

## Output

``` text
Halo Budi
```

Anonymous function sering digunakan sebagai callback:

``` javascript
const numbers = [1, 2, 3];

const result = numbers.map(function (number) {
    return number * 2;
});

console.log(result);
```

## Output

``` text
[2, 4, 6]
```

## Kunci

> Function bisa → disimpan, dikirim, dikembalikan.

------------------------------------------------------------------------

<a id="bagian-37"></a>

# 37. 🔴 Function dalam Function dan Scope

## Konsep

Function dapat didefinisikan di dalam function lain (inner function),
dan scope menentukan di mana variable dapat diakses.

## Function dalam function

``` javascript
function outer() {
    function inner() {
        console.log("Inner");
    }

    inner();
}

outer();
```

## Output

``` text
Inner
```

Function `inner` hanya dapat diakses dari scope `outer`.

## Scope

Global scope:

``` javascript
const name = "Budi";

console.log(name);
```

Function scope:

``` javascript
function sayHello() {
    const name = "Budi";

    console.log(name);
}

sayHello();
```

`name` tidak dapat diakses di luar function.

Block scope — `let` dan `const` memiliki block scope:

``` javascript
if (true) {
    let message = "Hello";
    const age = 20;

    console.log(message);
}

// message tidak dapat digunakan di sini
```

Diagram:

``` text
Global
│
├── function scope
│   └── local variables
│
└── block scope
    ├── let
    └── const
```

## Kunci

> `let` / `const` → block scoped, `var` → function scoped.

## Best Practice

- Deklarasikan variable di scope sekecil mungkin agar mudah dilacak.

------------------------------------------------------------------------

<a id="bagian-38"></a>

# 38. 🔴 Recursive Function

## Konsep

Recursive function adalah function yang memanggil dirinya sendiri.
Setiap recursive function harus memiliki **base case** (titik berhenti).

## Contoh faktorial

``` javascript
function factorial(number) {
    if (number <= 1) {
        return 1;
    }

    return number * factorial(number - 1);
}

console.log(factorial(5));
```

## Output

``` text
120
```

## Alur

``` text
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

## Kunci

> recursive = function memanggil dirinya sendiri, base case = titik
> berhenti.

## Kesalahan Umum

❌ Lupa base case — stack overflow (infinite recursion).

✅ Pastikan ada kondisi yang menghentikan rekursi.

------------------------------------------------------------------------

<a id="bagian-39"></a>

# 39. 🔴 Function Generator

## Konsep

Generator function menggunakan `function*` dan dapat menghentikan
sementara eksekusi dengan `yield`, lalu dilanjutkan dengan `next()`.

## Contoh

``` javascript
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

## Output

``` text
{ value: 1, done: false }
{ value: 2, done: false }
{ value: 3, done: false }
{ value: undefined, done: true }
```

Generator juga iterable:

``` javascript
function* numbers() {
    yield 1;
    yield 2;
    yield 3;
}

for (const number of numbers()) {
    console.log(number);
}
```

## Output

``` text
1
2
3
```

## Kunci

> `function*` → generator, `yield` → pause + kirim value, `next()` →
> lanjutkan generator.

## Best Practice

- Gunakan generator untuk data yang besar atau infinite sequence,
  karena nilainya dibuat satu per satu (lazy).

------------------------------------------------------------------------

<a id="bagian-40"></a>

# 40. 🔴 Arrow Function

## Konsep

Arrow function adalah syntax singkat untuk function.

## Contoh

``` javascript
const double = (number) => {
    return number * 2;
};

console.log(double(5));
```

Bisa disingkat:

``` javascript
const double = (number) => number * 2;
```

Jika satu parameter, tanda kurung dapat dihilangkan:

``` javascript
const double = number => number * 2;
```

Dengan beberapa parameter:

``` javascript
const add = (a, b) => a + b;
```

## Kunci

> `(x) => expression`.

> Arrow function tidak memiliki `this` sendiri; `this`-nya berasal dari
> lexical scope (lihat section 43).

## Best Practice

- Gunakan arrow function untuk callback singkat dan function
  sederhana.

------------------------------------------------------------------------

<a id="bagian-41"></a>

# 41. 🔴 Closure

## Konsep

Closure terjadi ketika sebuah function mengingat dan tetap dapat
mengakses variable dari lexical scope tempat function tersebut dibuat.

## Contoh

``` javascript
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

## Output

``` text
1
2
3
```

## Diagram

``` text
createCounter()
      │
      ├── count = 0
      │
      └── return function
              │
              └── tetap mengingat count
```

## Kunci

> closure = function + lexical environment yang diingat.

## Best Practice

- Closure berguna untuk membuat "private variable" dan state yang
  persisten per instance function.

------------------------------------------------------------------------

<a id="bagian-42"></a>

# 42. 🔴 Object Method dan this

## Konsep

Function yang menjadi property object disebut method. `this` merujuk
pada context pemanggilan function, dan aturannya bergantung pada cara
function dipanggil.

## Object method

``` javascript
const user = {
    name: "Budi",

    sayHello() {
        console.log(`Halo ${this.name}`);
    }
};

user.sayHello();
```

## Output

``` text
Halo Budi
```

Syntax method shorthand:

``` javascript
const user = {
    sayHello() {
        console.log("Hello");
    }
};
```

## `this` di constructor/class

``` javascript
class User {
    constructor(name) {
        this.name = name;
    }
}

const user = new User("Budi");

console.log(user.name);
```

## Output

``` text
Budi
```

## Kunci

> `object + function property` = method.
>
> `this` ditentukan oleh **cara function dipanggil**, bukan sekadar
> "object saat function dibuat".

------------------------------------------------------------------------

<a id="bagian-43"></a>

# 43. 🔴 Arrow Function di Object

## Konsep

Hati-hati menggunakan arrow function sebagai method object — arrow
function **tidak memiliki `this` sendiri**, ia mengambil `this` dari
lexical scope di luar object.

## Contoh masalah

``` javascript
const user = {
    name: "Budi",

    sayHello: () => {
        console.log(this.name);
    }
};

user.sayHello();
```

`this.name` di sini bukan milik `user`, melainkan dari scope luar.

## Solusi

Untuk method object yang membutuhkan `this`, gunakan method biasa:

``` javascript
const user = {
    name: "Budi",

    sayHello() {
        console.log(this.name);
    }
};

user.sayHello();
```

## Output

``` text
Budi
```

## Kunci

> method biasa → punya `this` berdasarkan call, arrow → tidak punya
> `this` sendiri.

## Kesalahan Umum

❌ Menggunakan arrow function untuk method object yang butuh `this`.

✅ Gunakan method shorthand `method() {}`.

------------------------------------------------------------------------

<a id="bagian-44"></a>

# 44. 🔴 Getter dan Setter

## Konsep

Getter dan setter digunakan untuk mengontrol akses property. Getter
dipanggil seperti property (bukan function), setter terlihat seperti
assignment.

## Contoh

``` javascript
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

``` javascript
console.log(user.fullName);
```

Setter juga terlihat seperti assignment:

``` javascript
user.fullName = "Andi Wijaya";

console.log(user.fullName);
```

## Output

``` text
Budi Santoso
Andi Wijaya
```

## Kunci

> `get` → baca seperti property, `set` → ubah seperti assignment.

## Best Practice

- Gunakan getter/setter untuk logic tambahan saat membaca/menulis
  property, atau untuk validasi.

------------------------------------------------------------------------

<a id="bagian-45"></a>

# 45. 🔴 Masalah Variable var

## Konsep

`var` adalah syntax lama yang sebaiknya tidak digunakan untuk kode
modern. Masalah utamanya: function scoped (bukan block scoped), bisa
di-redeclare, dan perilaku hoisting yang membingungkan.

## `var` function scoped

``` javascript
if (true) {
    var message = "Hello";
}

console.log(message);
```

## Output

``` text
Hello
```

Bandingkan `let`:

``` javascript
if (true) {
    let message = "Hello";
}

// console.log(message); // ReferenceError
```

## `var` dapat redeclare

``` javascript
var name = "Budi";
var name = "Andi";

console.log(name);
```

Ini berbeda dengan `let`:

``` javascript
let name = "Budi";
// let name = "Andi"; // SyntaxError
```

## Hoisting

``` javascript
console.log(name);

var name = "Budi";
```

## Output

``` text
undefined
```

Dengan `let`/`const`, variable berada dalam temporal dead zone sebelum
deklarasi.

## Kunci

> `const` secara default, `let` jika perlu reassignment, hindari `var`.

## Kesalahan Umum

❌ Masih memakai `var` pada kode baru.

✅ Gunakan `const`/`let` — lebih aman dan mudah diprediksi.

------------------------------------------------------------------------

<a id="bagian-46"></a>

# 46. 🔴 Destructuring

## Konsep

Destructuring digunakan untuk mengambil data dari array atau object ke
variable secara singkat.

## Object destructuring

``` javascript
const user = {
    name: "Budi",
    age: 20
};

const { name, age } = user;

console.log(name);
console.log(age);
```

## Output

``` text
Budi
20
```

Rename:

``` javascript
const { name: userName } = user;

console.log(userName);
```

## Array destructuring

``` javascript
const fruits = ["Apple", "Banana", "Orange"];

const [first, second] = fruits;

console.log(first);
console.log(second);
```

## Output

``` text
Apple
Banana
```

## Skip item dan rest

``` javascript
const [first, , third] = fruits;

const [firstFruit, ...others] = fruits;
```

## Kunci

> `const { name } = object`, `const [first] = array`.

## Best Practice

- Gunakan destructuring untuk mengambil beberapa property sekaligus —
  kode lebih ringkas.

------------------------------------------------------------------------

<a id="bagian-47"></a>

# 47. 🔴 Strict Mode dan Debugger

## Konsep

Strict mode membuat JavaScript menggunakan aturan yang lebih ketat.
`debugger` dapat menghentikan eksekusi saat Developer Tools debugger
aktif.

## Strict mode

Aktifkan dengan:

``` javascript
"use strict";

x = 10;
```

Dalam strict mode, ini menghasilkan `ReferenceError` karena `x` belum
dideklarasikan.

Strict mode juga mengubah beberapa perilaku `this`, assignment
tertentu, dan syntax lama.

**Catatan penting:** module JavaScript (`<script type="module">` atau
ES modules) sudah menggunakan strict mode secara otomatis.

## Debugger

``` javascript
function add(a, b) {
    debugger;

    return a + b;
}

console.log(add(10, 5));
```

Saat browser mencapai `debugger`, eksekusi dapat berhenti sehingga kita
bisa melihat:

- nilai variable;
- call stack;
- scope;
- expression;
- alur program.

Selain `debugger`, gunakan juga `console.log(value)`.

## Kunci

> `"use strict";` → aturan lebih ketat, `debugger` → breakpoint dari
> kode.

## Best Practice

- Untuk kode modern berbasis module, biasanya tidak perlu menulis
  `"use strict"` secara manual.
- Jangan lupa menghapus statement `debugger` dari kode production.

------------------------------------------------------------------------

<a id="bagian-48"></a>

# 48. 🛠️ Mini Flow JavaScript

Gunakan alur ini ketika menulis logika JavaScript:

``` text
1. Tentukan data yang dibutuhkan
        ↓
2. Simpan dengan const / let
        ↓
3. Olah dengan operator & control flow
        ↓
4. Bungkus logic berulang ke function
        ↓
5. Tampilkan / kembalikan hasil
        ↓
6. Test dengan console.log
```

### Kapan memakai apa?

  Kebutuhan                             Pilihan
  -------------------------------------- ----------------------------
  Menyimpan nilai                        `const` / `let`
  Kumpulan data                         Array
  Data key/value                        Object
  Percabangan sederhana                 `if` / ternary
  Banyak pilihan satu nilai             `switch`
  Perulangan terhitung                  `for`
  Perulangan kondisi                    `while`
  Iterasi array                         `for...of` / `forEach()`
  Function reusable                     `function` / arrow
  Function singkat                      arrow function
  Fallback nullish                      `??`
  Akses aman berantai                   `?.`
  Perbandingan ketat                    `===`

> **Best practice:** gunakan `const` secara default, `let` hanya saat
> perlu reassignment, dan hindari `var` pada kode modern.

------------------------------------------------------------------------

<a id="bagian-49"></a>

# 49. 📚 Tabel Ringkasan

  Materi        API / Syntax                 Tujuan
  ------------- ---------------------------- -----------------------------
  Output        `console.log()`              Menampilkan ke console
  Komentar      `//`, `/* */`                Catatan kode
  Number        `number`, `bigint`           Angka
  Boolean       `true`, `false`              Nilai ya/tidak
  String        `"..."`, `'...'`, `` `...` `` Teks
  Variable      `let`, `const`               Menyimpan nilai
  Matematika    `+ - * / % **`               Operasi angka
  Perbandingan  `===`, `!==`                 Membandingkan
  Logika        `&&`, `||`, `!`              Gabung kondisi
  Template      `` `${}` ``                  String dinamis
  Konversi      `String()`, `Number()`       Ubah tipe
  Array         `[]`                         Kumpulan data
  Object        `{}`                         Data key/value
  Kondisi       `if`, `switch`               Percabangan
  Ternary       `? :`                        If singkat
  Nullish       `??`                         Fallback nullish
  Chaining      `?.`                         Akses aman
  Loop          `for`, `while`, `do`         Perulangan
  Break         `break`                      Keluar loop
  Continue      `continue`                   Lewati iterasi
  For In        `for...in`                   Iterasi key
  For Of        `for...of`                   Iterasi value
  Function      `function`                   Logic reusable
  Parameter     `param`, `...args`           Input function
  Return        `return`                     Output function
  Arrow         `=>`                         Function singkat
  Generator     `function*`, `yield`         Function yang dapat pause
  Closure       closure                      Function mengingat scope
  `this`        `this`                       Context function
  Getter/Setter `get`, `set`                 Kontrol property
  Destructuring `{}`, `[]`                   Ambil data
  Strict Mode   `"use strict"`               Aturan lebih ketat
  Debugger      `debugger`                   Berhenti untuk debug

------------------------------------------------------------------------

<a id="bagian-50"></a>

# 50. ⚡ Cheat Code JavaScript 10 Detik

``` text
Variable  → const (default), let (jika perlu reassignment)
Tipe data → number, string, boolean, null, undefined, object, array
Kondisi   → if / else, switch, ternary (condition ? a : b)
Loop      → for, while, do while
Iterasi   → for...in (key), for...of (value)
Function  → function, arrow (=>), parameter, return
Fallback  → ?? (nullish), ?. (optional chaining)
Bandingkan → === dan !== (bukan == / !=)
```

## Variable dan tipe data

``` javascript
const name = "Budi";
let count = 0;

const numbers = [1, 2, 3];
const user = { name: "Budi", age: 20 };
```

## Kondisi

``` javascript
if (age >= 18) {
    console.log("Dewasa");
} else {
    console.log("Anak-anak");
}

const status = age >= 18 ? "Dewasa" : "Anak-anak";
```

## Loop

``` javascript
for (let i = 1; i <= 5; i++) {
    console.log(i);
}

for (const item of items) {
    console.log(item);
}
```

## Function

``` javascript
function add(a, b) {
    return a + b;
}

const double = (x) => x * 2;
```

## Fallback dan akses aman

``` javascript
const name = input ?? "Guest";

const city = user?.address?.city;
```

------------------------------------------------------------------------

<a id="bagian-51"></a>

# 51. 🧭 Urutan Belajar yang Disarankan

``` text
1. Pengenalan & Hello World
        ↓
2. Tipe data (number, boolean, string)
        ↓
3. Variable (let, const)
        ↓
4. Operator (matematika, perbandingan, logika)
        ↓
5. Array & Object
        ↓
6. Control flow (if, switch, ternary)
        ↓
7. Loop (for, while, do while, break/continue)
        ↓
8. Function (parameter, return, arrow)
        ↓
9. Advanced function (closure, this, destructuring)
        ↓
10. Mini project
```

Prinsip: pahami satu konsep, langsung praktikkan dengan contoh kecil,
lalu lanjut ke konsep berikutnya.

------------------------------------------------------------------------

<a id="bagian-52"></a>

# 52. 🏗️ Mini Project

## Program Nilai Siswa

Project ini menggabungkan:

``` text
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

``` html
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

## Output

``` text
Budi - 90 - Grade A
Andi - 75 - Grade C
Siti - 60 - Grade D
```

## Diagram

``` text
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

------------------------------------------------------------------------

<a id="bagian-53"></a>

# 53. 🔗 Referensi Resmi

- [MDN — JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [MDN — JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
- [ECMAScript Language Specification](https://tc39.es/ecma262/)
- [Node.js Documentation](https://nodejs.org/docs/latest/api/)

> **Catatan versi:** Cheatsheet ini menggunakan sintaks JavaScript
> modern (ES2020+). Detail perilaku dapat berbeda berdasarkan runtime
> dan environment (browser atau Node.js).
