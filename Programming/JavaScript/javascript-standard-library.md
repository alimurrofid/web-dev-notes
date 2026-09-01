# JavaScript Standard Library Cheatsheet Revised

> **Target:** Pemula yang sudah memahami dasar JavaScript (tipe data, variabel, fungsi, array, dan object) serta ingin menguasai built-in standard objects dan utility API resmi JavaScript (ES2020+).
>
> Fokus cheatsheet ini: **Number & Math → BigInt → String & RegExp → Array & Object API → JSON → Date & Intl API → Map & Set → URL & Encoding → Proxy & Reflect → structuredClone → mini project**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami untuk manipulasi data numerik, teks, array, objek, format JSON, dan tanggal

🟡 Lanjutan
→ pelajari setelah fundamental nyaman: struktur Map/Set, RegExp, URL API, encoding, & Intl

🔴 Advanced / Operasional
→ penting untuk metaprogramming, Proxy data-binding, deep clone, dan keamanan eksekusi
```

Mental model ekosistem Standard Library di JavaScript Runtime:

```text
       Aplikasi JavaScript (Browser / Node.js Runtime)
                         │
                         ▼
        Global Scope & Built-in ECMAScript API
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   Data Structures   Formatting & Time  Metaprogramming
   - Array, Object   - Date, Intl       - Proxy, Reflect
   - Map, Set        - JSON, RegExp     - structuredClone
   - BigInt, Symbol  - URL, Base64      - URI Encoding
         │               │               │
         └───────────────┼───────────────┘
                         │
                         ▼
         Eksekusi Native Cepat Tanpa Library Luar
```

**Hafalan:**

```text
Built-in Object  → Fitur resmi bahasa yang siap digunakan langsung tanpa npm install
Standard Library → Koleksi konstruktor, utilitas statis, dan prototype method bawaan
Immutability     → Objek/nilai yang tidak dapat diubah di tempat (seperti String)
Deep Clone       → Duplikasi struktur data kompleks hingga ke cabang terdalam (structuredClone)
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Standard Library & Global Objects](#bagian-1)
2. [Number (Static Properties, Methods, & Formatting)](#bagian-2)
3. [BigInt (Bilangan Bulat Arbitrer)](#bagian-3)
4. [Math (Konstanta, Pembulatan, Trigonometri, & Random)](#bagian-4)
5. [Boolean (Wrapper & Konversi Logika)](#bagian-5)
6. [String (Manipulasi, Pencarian, Slicing, & Regex Method)](#bagian-6)
7. [Array (Mutasi, Non-Mutasi, Iterasi, & Transformation)](#bagian-7)
8. [Object (Static Methods: keys, values, entries, assign, freeze, seal)](#bagian-8)
9. [JSON (Serialization, Deserialization, Replacer, & Reviver)](#bagian-9)
10. [Date (Waktu, Timestamp, Formatting, & Operasi Tanggal)](#bagian-10)

### 🟡 Lanjutan

11. [Map & WeakMap (Key-Value Collection Lanjutan)](#bagian-11)
12. [Set & WeakSet (Koleksi Nilai Unik)](#bagian-12)
13. [Symbol (Identifier Unik & Well-Known Symbols)](#bagian-13)
14. [RegExp (Regular Expression Patterns & Modifiers)](#bagian-14)
15. [URL & URLSearchParams (Parsing & Manipulasi Query URL)](#bagian-15)
16. [URI Encoding (encodeURI, encodeURIComponent, decodeURI)](#bagian-16)
17. [Base64 Encoding (btoa, atob, Buffer)](#bagian-17)
18. [Internationalization API (Intl.NumberFormat, Intl.DateTimeFormat, Intl.RelativeTimeFormat)](#bagian-18)

### 🔴 Advanced / Operasional

19. [Proxy (Interception & Traps: get, set, deleteProperty)](#bagian-19)
20. [Reflect (Metaprogramming & Standard Object Operations)](#bagian-20)
21. [Structured Clone (structuredClone Deep Copy)](#bagian-21)
22. [Eval & Function Constructor (dan Risiko Keamanannya)](#bagian-22)

### 🛠️ Referensi & Praktik

23. [Peta Ingatan Cepat](#bagian-23)
24. [Tabel Ringkasan](#bagian-24)
25. [Cheat Code JavaScript Standard Library 10 Detik](#bagian-25)
26. [Urutan Belajar yang Disarankan](#bagian-26)
27. [Mini Project: Dashboard Pemrosesan Data & Utilitas Transaksi E-Commerce](#bagian-27)
28. [Referensi Resmi](#bagian-28)

---

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan Standard Library & Global Objects

## Konsep

**JavaScript Standard Library** adalah kumpulan objek, fungsi, dan konstruktor bawaan (*built-in global objects*) yang telah disediakan secara langsung oleh spesifikasi ECMAScript di dalam runtime (Browser, Node.js, Deno, Bun) tanpa perlu menginstal paket (*npm*) atau pustaka eksternal pihak ketiga.

Kategori Utama Standard Library:
1. **Value & Primitive Wrappers:** `Number`, `String`, `Boolean`, `BigInt`, `Symbol`.
2. **Koleksi Struktur Data:** `Array`, `Object`, `Map`, `Set`, `WeakMap`, `WeakSet`.
3. **Utilitas Matematika & Waktu:** `Math`, `Date`, `Intl` (Internationalization).
4. **Format & Pertukaran Data:** `JSON`, `RegExp`, `URL`, `URLSearchParams`, URI encoders.
5. **Metaprogramming & Eksekusi:** `Proxy`, `Reflect`, `structuredClone`, `eval`.

## Contoh

```javascript
// Menggunakan beberapa fitur built-in Standard Library sekaligus
const rawPrice = "150000.75";
const priceNumber = Number(rawPrice); // Tipe Number
const roundedPrice = Math.round(priceNumber); // Math Utility

// Format Mata Uang Otomatis dengan Intl API
const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
}).format(roundedPrice);

// Tanggal Saat Ini
const transactionDate = new Date().toISOString().split("T")[0];

console.log("Harga Asli (String):", rawPrice);
console.log("Harga Angka (Number):", priceNumber);
console.log("Harga Bulat (Math):", roundedPrice);
console.log("Format Rupiah (Intl):", formattedPrice);
console.log("Tanggal Transaksi (Date):", transactionDate);
```

## Output

```text
Harga Asli (String): 150000.75
Harga Angka (Number): 150000.75
Harga Bulat (Math): 150001
Format Rupiah (Intl): Rp 150.001,00
Tanggal Transaksi (Date): 2026-08-29
```

## Cara Kerja

```text
                 Aplikasi JavaScript
                          │
                          ▼
            Akses Global Scope (globalThis)
                          │
         ┌────────────────┴────────────────┐
         ▼                                 ▼
   Built-in Static Utilitas         Built-in Constructors
   (Math, JSON, Reflect)            (Array, Date, Map, Set)
         │                                 │
         └────────────────┬────────────────┘
                          │
                          ▼
         Eksekusi Langsung di Native Engine
```

**Hafalan:**

```text
Standard Library → Kumpulan objek & utilitas bawaan resmi yang siap pakai tanpa install package
globalThis       → Objek global universal di semua runtime JS (window di browser, global di Node)
```

## Best Practice & Kesalahan Umum

- ✅ Maksimalkan penggunaan Standard Library bawaan sebelum memutuskan untuk menginstal library eksternal berukuran besar (seperti Moment.js atau Lodash).
- ❌ Jangan pernah memodifikasi prototype bawaan Standard Library (*Monkey Patching*).

---

<a id="bagian-2"></a>

# 2. 🟢 Number (Static Properties, Methods, & Formatting)

## Konsep

Objek bawaan **`Number`** menyediakan konstanta numerik penting dan metode-metode pembantu untuk memvalidasi, mengonversi, serta memformat angka.

Konstanta Penting `Number`:
- `Number.MAX_SAFE_INTEGER` (`9007199254740991`): Batas angka bulat tertinggi yang dapat dihitung dengan presisi tanpa distorsi.
- `Number.MIN_SAFE_INTEGER` (`-9007199254740991`): Batas angka bulat terendah yang presisi.
- `Number.POSITIVE_INFINITY` & `Number.NEGATIVE_INFINITY`.
- `Number.NaN`: Nilai bukan angka (*Not-a-Number*).

Method Static & Prototype Esensial:
- `Number.isInteger(value)`: Memeriksa apakah nilai adalah bilangan bulat murni.
- `Number.isFinite(value)`: Memeriksa apakah nilai adalah angka terbatas yang valid (bukan Infinity/NaN).
- `Number.isNaN(value)`: Memeriksa apakah nilai bernilai NaN secara pasti tanpa *type coercion*.
- `num.toFixed(digits)`: Memformat angka desimal dengan jumlah digit tetap di belakang koma (mengembalikan string).
- `num.toLocaleString(locale)`: Memformat angka sesuai aturan penulisan regional (ribuan, desimal).

## Contoh

```javascript
// 1. Validasi Angka yang Ketat
console.log("isInteger(42):", Number.isInteger(42)); // true
console.log("isInteger(42.5):", Number.isInteger(42.5)); // false
console.log("isNaN('halo'):", Number.isNaN("halo")); // false (karena tipe datanya string, bukan NaN)
console.log("isNaN(NaN):", Number.isNaN(NaN)); // true

// 2. Pemformatan Angka Desimal (toFixed)
const pi = 3.1415926535;
console.log("PI (2 desimal):", pi.toFixed(2)); // "3.14"
console.log("PI (4 desimal):", pi.toFixed(4)); // "3.1416"

// 3. Format Angka Regional (toLocaleString)
const largeAmount = 1500000000;
console.log("Format Indonesia:", largeAmount.toLocaleString("id-ID")); // "1.500.000.000"
console.log("Format US:", largeAmount.toLocaleString("en-US")); // "1,500,000,000"
```

## Output

```text
isInteger(42): true
isInteger(42.5): false
isNaN('halo'): false
isNaN(NaN): true
PI (2 desimal): 3.14
PI (4 desimal): 3.1416
Format Indonesia: 1.500.000.000
Format US: 1,500,000,000
```

## Cara Kerja

```text
            Nilai Angka: 3.14159
                    │
                    ▼
            pi.toFixed(2)
                    │
                    ▼
            Pembulatan presisi -> Hasil Teks: "3.14"
```

**Hafalan:**

```text
Number.isInteger(value)  → Mengecek apakah nilai berupa bilangan bulat
Number.isNaN(value)      → Mengecek apakah nilai bertipe NaN secara ketat
number.toFixed(digits)   → Membulatkan angka ke jumlah digit desimal tertentu (return string)
number.toLocaleString()  → Memformat angka dengan pemisah ribuan lokal
```

## Best Practice & Kesalahan Umum

- ✅ Selalu gunakan `Number.isNaN()` modern, jangan gunakan fungsi global lawas `isNaN()`, karena `isNaN("teks")` menghasilkan `true` akibat konversi tipe otomatis yang membingungkan.
- ❌ Ingat bahwa `num.toFixed()` menghasilkan nilai bertipe **String**, bukan Number; gunakan `Number(num.toFixed(2))` jika ingin mengembalikannya ke tipe angka.

---

<a id="bagian-3"></a>

# 3. 🟢 BigInt (Bilangan Bulat Arbitrer)

## Konsep

Tipe data primitif **`BigInt`** digunakan untuk merepresentasikan dan memproses bilangan bulat dengan ukuran sembarang (*arbitrary-precision integers*) yang melampaui batas batas aman `Number.MAX_SAFE_INTEGER` (2^53 - 1).

Karakteristik BigInt:
- Dibuat dengan menambahkan akhiran huruf **`n`** di belakang bilangan bulat (misal `100n`), atau melalui fungsi konstruktor **`BigInt("10000000000000000000")`**.
- Hanya dapat digunakan untuk bilangan bulat (tidak mendukung angka pecahan/desimal).
- Tidak dapat dicampur langsung dalam operasi matematika dengan tipe `Number` biasa tanpa konversi eksplisit.

## Contoh

```javascript
// Masalah pada Number biasa saat melebihi batas aman
const unsafeNum = 9007199254740991 + 2; // Presisi angka rusak!
console.log("Number Biasa (Rusak):", unsafeNum);

// Menggunakan BigInt untuk kalkulasi angka raksasa yang presisi
const safeBigInt1 = 9007199254740991n + 2n;
const safeBigInt2 = BigInt("1000000000000000000000000") * 5n;

console.log("BigInt Presisi 1:", safeBigInt1);
console.log("BigInt Presisi 2:", safeBigInt2);

// Konversi antar BigInt dan Number
const normalNumber = 50;
const bigNumber = 100n;

// const errorMath = normalNumber + bigNumber; // TypeError: Cannot mix BigInt and other types
const validMath = BigInt(normalNumber) + bigNumber;
console.log("Hasil Penjumlahan Aman:", validMath);
```

## Output

```text
Number Biasa (Rusak): 9007199254740992
BigInt Presisi 1: 9007199254740993n
BigInt Presisi 2: 5000000000000000000000000n
Hasil Penjumlahan Aman: 150n
```

## Cara Kerja

```text
       9007199254740991n + 2n
                 │
                 ▼
       Engine BigInt memproses presisi bit tak terbatas
                 │
                 ▼
       Hasil Akurat: 9007199254740993n
```

**Hafalan:**

```text
12345678901234567890n → Angka bertipe BigInt (akhiran n)
BigInt(stringOrNumber) → Mengonversi string/angka menjadi tipe BigInt
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan BigInt untuk menangani ID transaksi database 64-bit (misal Twitter Snowflake ID, data kriptografi, atau saldo kripto).
- ❌ Jangan pernah mengonversi BigInt kembali ke Number jika nilainya melebihi `Number.MAX_SAFE_INTEGER`, karena presisinya akan hilang.

---

<a id="bagian-4"></a>

# 4. 🟢 Math (Konstanta, Pembulatan, Trigonometri, & Random)

## Konsep

Objek **`Math`** adalah objek statis bawaan (*bukan fungsi konstruktor*) yang menyediakan konstanta matematika standar dan sekumpulan fungsi kalkulasi numerik.

Fitur Utama Objek `Math`:
- **Konstanta:** `Math.PI` (3.14159...), `Math.E` (2.718...).
- **Pembulatan:**
  - `Math.floor(x)`: Membulatkan ke bawah (lantai).
  - `Math.ceil(x)`: Membulatkan ke atas (langit-langit).
  - `Math.round(x)`: Membulatkan ke bilangan bulat terdekat (>= 0.5 ke atas).
  - `Math.trunc(x)`: Membuang bagian desimal tanpa pembulatan.
- **Operasi Numerik:**
  - `Math.abs(x)`: Mengambil nilai absolut/positif.
  - `Math.min(...numbers)` & `Math.max(...numbers)`: Mencari angka terkecil dan terbesar.
  - `Math.pow(base, exp)` (`base ** exp`): Perpangkatan.
  - `Math.sqrt(x)`: Akar kuadrat.
  - `Math.random()`: Menghasilkan angka acak semu antara 0 (inklusif) sampai 1 (eksklusif).

## Contoh

```javascript
// 1. Teknik Pembulatan Angka
const price = 45.7;
console.log("Math.floor(45.7):", Math.floor(price)); // 45
console.log("Math.ceil(45.1):", Math.ceil(45.1));   // 46
console.log("Math.round(45.5):", Math.round(price)); // 46
console.log("Math.trunc(45.99):", Math.trunc(45.99)); // 45

// 2. Mencari Nilai Maksimum & Minimum
const scores = [88, 95, 72, 99, 81];
console.log("Nilai Tertinggi:", Math.max(...scores)); // 99
console.log("Nilai Terendah:", Math.min(...scores));  // 72

// 3. Menghasilkan Angka Acak dalam Rentang Tertentu (Random Range)
function getRandomInt(min, max) {
    // Menghasilkan angka bulat acak dari min sampai max (inklusif)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log("Dadu (1-6):", getRandomInt(1, 6));
console.log("Dadu (1-6):", getRandomInt(1, 6));
```

## Output

```text
Math.floor(45.7): 45
Math.ceil(45.1): 46
Math.round(45.5): 46
Math.trunc(45.99): 45
Nilai Tertinggi: 99
Nilai Terendah: 72
Dadu (1-6): 4
Dadu (1-6): 2
```

## Cara Kerja

```text
         Math.random() -> Menghasilkan desimal 0.7234...
                │
                ▼
         * (6 - 1 + 1) -> 4.3404...
                │
                ▼
         Math.floor() -> 4
                │
                ▼
         + 1 -> 5 (Angka bulat acak final)
```

**Hafalan:**

```text
Math.floor(number)                → Membulatkan angka ke bawah
Math.ceil(number)                 → Membulatkan angka ke atas
Math.max(...numbers)              → Mencari angka terbesar dari daftar
Math.floor(Math.random() * N) + 1 → Rumus umum angka acak 1 sampai N
```

## Best Practice & Kesalahan Umum

- ✅ Selalu gunakan penyebaran (*spread operator*) `Math.max(...array)` saat mencari nilai ekstrem dari array.
- ❌ Jangan pernah memanggil `new Math()`, karena `Math` bukan class konstruktor.

---

<a id="bagian-5"></a>

# 5. 🟢 Boolean (Wrapper & Konversi Logika)

## Konsep

Tipe **`Boolean`** dapat digunakan sebagai fungsi utilitas konversi tipe data (`Boolean(value)`) untuk mengecek apakah suatu nilai bernilai **Truthy** atau **Falsy**.

Fungsi `Boolean(val)` mengonversi nilai apa pun menjadi `true` atau `false` murni:
- Seluruh 8 nilai falsy (`false`, `0`, `""`, `null`, `undefined`, `NaN`, `0n`, `document.all`) akan menghasilkan `false`.
- Semua nilai di luar daftar di atas akan menghasilkan `true`.

## Contoh

```javascript
// 1. Menguji Berbagai Nilai Falsy
console.log("Boolean(0):", Boolean(0)); // false
console.log("Boolean(''):", Boolean("")); // false
console.log("Boolean(null):", Boolean(null)); // false
console.log("Boolean(undefined):", Boolean(undefined)); // false
console.log("Boolean(NaN):", Boolean(NaN)); // false

// 2. Menguji Nilai Truthy
console.log("Boolean('0'):", Boolean("0")); // true (String ada isinya!)
console.log("Boolean([]):", Boolean([])); // true (Array kosong adalah objek!)
console.log("Boolean({}):", Boolean({})); // true (Objek kosong adalah truthy!)

// 3. Teknik Cepat Boolean Casting menggunakan Double NOT (!!)
const userInput = "Budi Santoso";
const hasName = !!userInput;
console.log("hasName (!!):", hasName); // true

// 4. Menyaring Elemen Falsy dari Array
const rawData = ["Apel", "", 0, "Jeruk", null, "Mangga", undefined];
const cleanData = rawData.filter(Boolean); // Membuang string kosong, 0, null, undefined
console.log("Data Bersih:", cleanData);
```

## Output

```text
Boolean(0): false
Boolean(''): false
Boolean(null): false
Boolean(undefined): false
Boolean(NaN): false
Boolean('0'): true
Boolean([]): true
Boolean({}): true
hasName (!!): true
Data Bersih: [ 'Apel', 'Jeruk', 'Mangga' ]
```

## Cara Kerja

```text
         rawData.filter(Boolean)
                   │
                   ▼
         Tiap elemen diuji melalui fungsi Boolean(elem)
                   │
         ┌─────────┴─────────┐
       [true]              [false]
         │                   │
         ▼                   ▼
    Pertahankan           Buang
```

**Hafalan:**

```text
Boolean(value)      → Mengonversi nilai apa pun menjadi boolean murni (true/false)
!!value             → Sintaks singkat (double NOT) untuk boolean casting
array.filter(Boolean) → Trik ampuh membuang semua elemen falsy dari array
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan `array.filter(Boolean)` untuk membersihkan array dari nilai-nilai kosong atau `null`.
- ❌ Jangan membuat objek boolean dengan kata kunci `new Boolean(false)`, karena objek pembungkus selalu bernilai *truthy* dan dapat menimbulkan bug logika yang fatal.

---

<a id="bagian-6"></a>

# 6. 🟢 String (Manipulasi, Pencarian, Slicing, & Regex Method)

## Konsep

Objek bawaan **`String`** menyediakan puluhan method bawaan (*prototype methods*) untuk memanipulasi, memotong, mencari, dan memformat teks.

Method String yang Paling Sering Digunakan:
- **Transformasi Kasus & Spasi:**
  - `.toUpperCase()` & `.toLowerCase()`: Mengubah huruf kapital / kecil.
  - `.trim()`, `.trimStart()`, `.trimEnd()`: Memangkas spasi putih di ujung teks.
- **Pencarian & Pengecekan:**
  - `.includes(searchString)`: Mengecek apakah teks mengandung kata tertentu (return boolean).
  - `.startsWith(str)` & `.endsWith(str)`: Mengecek awalan / akhiran teks.
  - `.indexOf(searchString)`: Mencari indeks posisi awal kata (mengembalikan `-1` jika tidak ada).
- **Pemotongan & Ekstraksi:**
  - `.slice(startIndex, endIndex)`: Memotong teks berdasarkan indeks (mendukung indeks negatif dari belakang).
  - `.split(separator)`: Memecah teks menjadi Array berdasarkan pemisah.
- **Penggantian & Format:**
  - `.replace(target, replacement)`: Mengganti kemunculan pertama.
  - `.replaceAll(target, replacement)`: Mengganti seluruh kemunculan teks.
  - `.padStart(targetLength, padString)` & `.padEnd()`: Menambahkan karakter pengisi panjang.

## Contoh

```javascript
const message = "   Halo, Belajar JavaScript Standard Library Seru!   ";

// 1. Pembersihan & Manipulasi Teks
const cleanMessage = message.trim();
console.log("Trimmed:", cleanMessage);
console.log("Kapital:", cleanMessage.toUpperCase());

// 2. Pencarian & Validasi Teks
console.log("Mengandung 'JavaScript'?", cleanMessage.includes("JavaScript")); // true
console.log("Diawali 'Halo'?", cleanMessage.startsWith("Halo")); // true
console.log("Diakhiri 'Seru!'?", cleanMessage.endsWith("Seru!")); // true

// 3. Pemotongan Teks (slice)
const filename = "laporan-keuangan-2026.pdf";
const extension = filename.slice(-3); // Mengambil 3 karakter dari belakang
const documentName = filename.slice(0, -4); // Membuang ekstensi .pdf

console.log("Ekstensi:", extension); // "pdf"
console.log("Nama Dokumen:", documentName); // "laporan-keuangan-2026"

// 4. Penggantian Teks (replace & replaceAll)
const rawCsv = "Apel,Jeruk,Mangga,Jeruk";
const updatedCsv = rawCsv.replaceAll("Jeruk", "Alpukat");
console.log("Updated CSV:", updatedCsv);

// 5. Padding (Penyelarasan Teks)
const invoiceNumber = "42";
console.log("Format Invoice ID:", invoiceNumber.padStart(6, "0")); // "000042"
```

## Output

```text
Trimmed: Halo, Belajar JavaScript Standard Library Seru!
Kapital: HALO, BELAJAR JAVASCRIPT STANDARD LIBRARY SERU!
Mengandung 'JavaScript'? true
Diawali 'Halo'? true
Diakhiri 'Seru!'? true
Ekstensi: pdf
Nama Dokumen: laporan-keuangan-2026
Updated CSV: Apel,Alpukat,Mangga,Alpukat
Format Invoice ID: 000042
```

## Cara Kerja

```text
     "laporan-keuangan.pdf".slice(-3)
                     │
                     ▼
     Engine menghitung 3 karakter dari akhir string
                     │
                     ▼
     Hasil Ekstraksi: "pdf"
```

**Hafalan:**

```text
string.includes(keyword)          → Mengecek keberadaan kata dalam teks (boolean)
string.slice(startIndex, endIndex)→ Memotong string (mendukung indeks negatif)
string.split(separator)           → Memecah teks menjadi Array
string.replaceAll(oldText, newText)→ Mengganti semua kata yang cocok
string.padStart(length, padChar)  → Mengisi karakter di depan hingga panjang tercapai
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan `.slice()` daripada method lawas seperti `.substr()` atau `.substring()` karena `.slice()` lebih konsisten dan mendukung indeks negatif.
- ❌ Ingat bahwa semua tipe String di JavaScript bersifat **Immutable** (tidak dapat diubah di tempat); method string selalu mengembalikan string baru.

---

<a id="bagian-7"></a>

# 7. 🟢 Array (Mutasi, Non-Mutasi, Iterasi, & Transformation)

## Konsep

Objek **`Array`** adalah struktur data terpenting di JavaScript untuk mengelola deret data.

### Klasifikasi Method Array:
1. **Mutating Methods (Mengubah Array Asli):**
   - `.push(...items)`: Menambah di akhir.
   - `.pop()`: Mengambil dan menghapus elemen terakhir.
   - `.unshift(...items)`: Menambah di awal.
   - `.shift()`: Mengambil dan menghapus elemen pertama.
   - `.splice(start, deleteCount, ...items)`: Menyisipkan/menghapus elemen di tengah array.
   - `.sort(compareFn)`: Mengurutkan array di tempat.
   - `.reverse()`: Membalikkan urutan elemen.

2. **Non-Mutating / Iteration & Transformation Methods (Mengembalikan Array Baru):**
   - `.map(fn)`: Mentransformasi setiap elemen menjadi nilai baru.
   - `.filter(fn)`: Menyaring elemen yang lolos kondisi.
   - `.reduce(fn, initialValue)`: Mengakumulasikan seluruh elemen menjadi satu nilai tunggal.
   - `.find(fn)`: Mengambil elemen pertama yang cocok.
   - `.findIndex(fn)`: Mengambil indeks elemen pertama yang cocok.
   - `.some(fn)`: Mengecek apakah minimal ada 1 elemen yang cocok (boolean).
   - `.every(fn)`: Mengecek apakah seluruh elemen memenuhi kondisi (boolean).
   - `.flat(depth)`: Meratakan nested array.
   - `.toSorted()`, `.toReversed()`, `.toSpliced()` (ES2023): Versi non-mutasi modern.

## Contoh

```javascript
const products = [
    { id: 1, name: "Keyboard", price: 450000, category: "Elektronik" },
    { id: 2, name: "Mouse", price: 150000, category: "Elektronik" },
    { id: 3, name: "Meja Kerja", price: 1200000, category: "Furniture" },
    { id: 4, name: "Kabel USB", price: 35000, category: "Aksesoris" }
];

// 1. Filter: Mengambil produk kategori Elektronik
const electronicItems = products.filter(item => item.category === "Elektronik");
console.log("Produk Elektronik:", electronicItems.map(p => p.name));

// 2. Map: Mengambil daftar nama saja
const productNames = products.map(item => item.name);
console.log("Daftar Nama:", productNames);

// 3. Reduce: Menghitung total seluruh inventaris
const totalInventoryPrice = products.reduce((total, item) => total + item.price, 0);
console.log("Total Nilai Inventaris: Rp", totalInventoryPrice.toLocaleString("id-ID"));

// 4. Find & Some
const expensiveItem = products.find(item => item.price > 1000000);
console.log("Produk Mewah Pertama:", expensiveItem?.name);

const hasCheapItem = products.some(item => item.price < 50000);
console.log("Ada barang di bawah 50rb?", hasCheapItem); // true
```

## Output

```text
Produk Elektronik: [ 'Keyboard', 'Mouse' ]
Daftar Nama: [ 'Keyboard', 'Mouse', 'Meja Kerja', 'Kabel USB' ]
Total Nilai Inventaris: Rp 1.835.000
Produk Mewah Pertama: Meja Kerja
Ada barang di bawah 50rb? true
```

## Cara Kerja

```text
                    Array Awal: [150000, 450000, 35000]
                                    │
                                    ▼
         .reduce((total, item) => total + item, 0)
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         │ Putaran 1: 0 + 150000       = 150000                │
         │ Putaran 2: 150000 + 450000  = 600000                │
         │ Putaran 3: 600000 + 35000   = 635000                │
         └──────────────────────────┬──────────────────────────┘
                                    │
                                    ▼
                           Hasil Akhir: 635000
```

**Hafalan:**

```text
array.map(callback)               → Mengubah setiap elemen menjadi array baru dengan panjang sama
array.filter(callback)            → Menyaring elemen yang lolos kondisi (return true)
array.reduce(callback, initialVal)→ Menggabungkan seluruh elemen menjadi satu nilai akumulasi
array.find(callback)              → Mengembalikan elemen pertama yang cocok (atau undefined)
```

## Best Practice & Kesalahan Umum

- ✅ Prioritaskan method fungsional non-mutasi (`.map()`, `.filter()`, `.reduce()`) untuk meminimalkan *side-effects* pada data asli.
- ❌ Hati-hati dengan `array.sort()` tanpa comparator function (`array.sort((a,b) => a - b)`), karena secara default `.sort()` mengurutkan angka berdasarkan urutan alfabetik string (`[10, 2, 5].sort()` menjadi `[10, 2, 5]`).

---

<a id="bagian-8"></a>

# 8. 🟢 Object (Static Methods: keys, values, entries, assign, freeze, seal)

## Konsep

Objek global **`Object`** menyediakan sekumpulan method statis yang sangat berguna untuk menginspeksi, memanipulasi, menggabungkan, serta mengunci struktur objek di JavaScript.

Method Statis Utama Objek:
- **Transformasi ke Array:**
  - `Object.keys(obj)`: Mengembalikan array berisi seluruh nama properti (*keys*).
  - `Object.values(obj)`: Mengembalikan array berisi seluruh nilai properti (*values*).
  - `Object.entries(obj)`: Mengembalikan array berisi pasangan `[key, value]`.
  - `Object.fromEntries(entriesArray)`: Mengubah array pasangan `[key, value]` kembali menjadi Objek.
- **Penggabungan Objek:**
  - `Object.assign(target, ...sources)`: Menyalin seluruh properti dari objek sumber ke objek target.
- **Keamanan & Immutability:**
  - `Object.freeze(obj)`: Membekukan objek sepenuhnya (tidak bisa tambah, ubah, atau hapus properti).
  - `Object.seal(obj)`: Mengunci objek (properti yang ada boleh diubah nilainya, tetapi tidak bisa tambah/hapus properti).

## Contoh

```javascript
const user = {
    id: 101,
    name: "Budi Santoso",
    role: "Administrator",
    score: 95
};

// 1. Ekstraksi Keys, Values, dan Entries
console.log("Keys:", Object.keys(user));
console.log("Values:", Object.values(user));
console.log("Entries:", Object.entries(user));

// 2. Iterasi Objek menggunakan Object.entries + Destructuring
for (const [key, value] of Object.entries(user)) {
    console.log(`Field ${key}: ${value}`);
}

// 3. Object Immutability dengan Object.freeze()
const appConfig = Object.freeze({
    apiEndpoint: "https://api.example.com",
    maxRetries: 3
});

// Mencoba memodifikasi objek yang dibekukan
// appConfig.maxRetries = 10; // Gagal (TypeError di Strict Mode)
console.log("Config Max Retries:", appConfig.maxRetries); // 3 (Tetap aman!)
console.log("Apakah objek dibekukan?", Object.isFrozen(appConfig)); // true
```

## Output

```text
Keys: [ 'id', 'name', 'role', 'score' ]
Values: [ 101, 'Budi Santoso', 'Administrator', 95 ]
Entries: [
  [ 'id', 101 ],
  [ 'name', 'Budi Santoso' ],
  [ 'role', 'Administrator' ],
  [ 'score', 95 ]
]
Field id: 101
Field name: Budi Santoso
Field role: Administrator
Field score: 95
Config Max Retries: 3
Apakah objek dibekukan? true
```

## Cara Kerja

```text
         Objek: { name: "Budi", role: "Admin" }
                         │
                         ▼
                  Object.entries()
                         │
                         ▼
         Array: [ ["name", "Budi"], ["role", "Admin"] ]
```

**Hafalan:**

```text
Object.keys(object)                → Mengambil semua key properti objek sebagai Array
Object.values(object)              → Mengambil semua isi nilai objek sebagai Array
Object.entries(object)             → Mengambil array pasangan [key, value]
Object.fromEntries(iterable)       → Mengubah array [key, value] menjadi Objek
Object.freeze(object)              → Mengunci objek agar tidak bisa dimutasi sama sekali
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan kombinasi `Object.entries(obj)` dan `for...of` untuk melakukan iterasi data objek secara aman tanpa risiko properti prototype terbawa.
- ❌ Ingat bahwa `Object.freeze()` hanya bersifat *shallow freeze* (hanya membekukan properti tingkat pertama; objek bersarang di dalamnya tetap bisa dimutasi kecuali dibekukan secara rekursif).

---

<a id="bagian-9"></a>

# 9. 🟢 JSON (Serialization, Deserialization, Replacer, & Reviver)

## Konsep

**JSON (JavaScript Object Notation)** adalah format teks standar terbuka yang ringan dan independen bahasa untuk pertukaran data (*data interchange*) antara klien (browser) dan server (backend API).

Objek bawaan **`JSON`** menyediakan 2 metode utama:
1. **`JSON.stringify(value, replacer, space)` (Serialization):**
   Mengonversi objek atau nilai JavaScript menjadi string teks berformat JSON.
   - `replacer`: Fungsi/array filter untuk menyaring atau memodifikasi properti tertentu.
   - `space`: Jumlah indentasi spasi untuk membuat format teks rapi (*pretty-print*).
2. **`JSON.parse(text, reviver)` (Deserialization):**
   Mengurai teks string JSON kembali menjadi objek JavaScript asli.
   - `reviver`: Fungsi transformasi untuk memulihkan tipe data tertentu (misal string tanggal kembali ke objek `Date`).

## Contoh

```javascript
const transaction = {
    orderId: "TRX-9988",
    amount: 750000,
    isPaid: true,
    secretToken: "SECRET_HASH_123",
    createdAt: new Date()
};

// 1. Serialization dengan Pretty-Print & Replacer Filter
// Menyembunyikan properti 'secretToken' dari output JSON
const jsonString = JSON.stringify(transaction, (key, value) => {
    if (key === "secretToken") return undefined; // Buang key ini
    return value;
}, 2);

console.log("=== Serialized JSON String ===");
console.log(jsonString);

// 2. Deserialization dengan Reviver (Memulihkan Objek Date)
const parsedData = JSON.parse(jsonString, (key, value) => {
    if (key === "createdAt") {
        return new Date(value); // Kembalikan ke objek Date asli
    }
    return value;
});

console.log("\n=== Deserialized Object ===");
console.log("Order ID:", parsedData.orderId);
console.log("Tipe createdAt:", parsedData.createdAt instanceof Date ? "Objek Date Valid" : "String Biasa");
```

## Output

```text
=== Serialized JSON String ===
{
  "orderId": "TRX-9988",
  "amount": 750000,
  "isPaid": true,
  "createdAt": "2026-08-29T10:35:00.000Z"
}

=== Deserialized Object ===
Order ID: TRX-9988
Tipe createdAt: Objek Date Valid
```

## Cara Kerja

```text
   Objek JS: { name: "Budi" }  ──► JSON.stringify() ──► String: '{"name":"Budi"}'
   String: '{"name":"Budi"}'  ──► JSON.parse()     ──► Objek JS: { name: "Budi" }
```

**Hafalan:**

```text
JSON.stringify(value, replacer, space) → Mengubah objek menjadi string JSON (Serialization)
JSON.parse(text, reviver)             → Mengubah string JSON menjadi objek JS (Deserialization)
```

## Best Practice & Kesalahan Umum

- ✅ Selalu bungkus pemanggilan `JSON.parse()` di dalam blok `try...catch` untuk menangani risiko data JSON yang rusak (*malformed JSON*).
- ❌ Ketahuilah bahwa `JSON.stringify()` otomatis membuang properti bernilai `undefined`, `Function`, dan `Symbol`.

---

<a id="bagian-10"></a>

# 10. 🟢 Date (Waktu, Timestamp, Formatting, & Operasi Tanggal)

## Konsep

Objek bawaan **`Date`** digunakan untuk merepresentasikan dan memanipulasi waktu serta tanggal di JavaScript (berbasis milidetik sejak *Unix Epoch* yaitu 1 Januari 1970 00:00:00 UTC).

Cara Membuat Objek Date:
- `new Date()`: Tanggal dan jam lokal saat ini.
- `new Date(timestampMs)`: Tanggal dari milidetik epoch.
- `new Date("YYYY-MM-DDTHH:mm:ss")`: Parsing dari string format ISO 8601.
- `new Date(year, monthIndex, day, hours, minutes)`: Parameter numerik (**Ingat:** indeks bulan berawal dari **0** untuk Januari hingga **11** untuk Desember!).

Method Utama Objek Date:
- **Getter (Waktu Lokal):** `.getFullYear()`, `.getMonth()`, `.getDate()`, `.getDay()`, `.getHours()`, `.getMinutes()`, `.getTime()`.
- **Static Helper:**
  - `Date.now()`: Mengambil timestamp milidetik saat ini secara instan tanpa membuat instance objek.

## Contoh

```javascript
// 1. Membuat dan Membaca Komponen Tanggal
const now = new Date();

console.log("Tahun:", now.getFullYear());
console.log("Bulan (0-11):", now.getMonth()); // 0 = Januari
console.log("Tanggal (1-31):", now.getDate());
console.log("Hari (0-6):", now.getDay()); // 0 = Minggu
console.log("Timestamp Epoch (ms):", Date.now());

// 2. Operasi Aritmatika Tanggal (Menambah 7 Hari ke Depan)
const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 7);
console.log("7 Hari ke Depan:", futureDate.toISOString().split("T")[0]);

// 3. Menghitung Selisih Hari Antara Dua Tanggal
const startDate = new Date("2026-08-01");
const endDate = new Date("2026-08-29");

const diffInMs = endDate.getTime() - startDate.getTime();
const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

console.log(`Selisih Waktu: ${diffInDays} hari`);
```

## Output

```text
Tahun: 2026
Bulan (0-11): 7
Tanggal (1-31): 29
Hari (0-6): 6
Timestamp Epoch (ms): 1787999700000
7 Hari ke Depan: 2026-09-05
Selisih Waktu: 28 hari
```

## Cara Kerja

```text
       endDate.getTime() - startDate.getTime()
                         │
                         ▼
       Selisih dalam milidetik (ms)
                         │
                         ▼
       Dibagi (1000 ms * 60 s * 60 m * 24 h)
                         │
                         ▼
       Hasil = Jumlah Hari Pasti
```

**Hafalan:**

```text
new Date()             → Membuat objek tanggal saat ini
Date.now()             → Mengambil timestamp saat ini dalam milidetik (tanpa 'new')
date.getFullYear()     → Mengambil 4 digit angka tahun
date.getMonth()        → Mengambil nomor indeks bulan (0 = Januari, 11 = Desember)
date.getDate()         → Mengambil nomor hari/tanggal (1-31)
date.toISOString()     → Mengubah tanggal ke format standar ISO 8601 (UTC)
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan `Date.now()` untuk mencatat waktu atau mengukur durasi performa karena lebih cepat dan tidak membebani memori alokasi objek.
- ❌ Hati-hati terhadap jebakan `date.getMonth()`; ingat selalu bahwa bulan Januari bernilai `0`, bukan `1`.

---

<a id="bagian-11"></a>

# 11. 🟡 Map & WeakMap (Key-Value Collection Lanjutan)

## Konsep

**`Map`** adalah struktur data koleksi pasangan kunci-nilai (*key-value pairs*) yang diperkenalkan pada ES6 sebagai alternatif yang jauh lebih kuat dan fleksibel dibandingkan objek biasa.

### Keunggulan `Map` Dibandingkan Objek Biasa (`{}`):
1. **Tipe Key Bebas:** Key pada `Map` bisa bertipe data apa saja (termasuk Objek, Fungsi, Boolean, Number), sedangkan objek biasa membatasi key hanya berupa String atau Symbol.
2. **Urutan Terjamin:** Urutan iterasi pada `Map` dijamin sesuai dengan urutan waktu penyisipan (*insertion order*).
3. **Ukuran Langsung:** Memiliki properti `.size` untuk mengetahui jumlah data secara instan (tanpa perlu `Object.keys().length`).
4. **Performa Tinggi:** Dioptimasi khusus untuk operasi penambahan dan penghapusan data yang sering (*frequent additions/removals*).

### Method Utama `Map`:
- `.set(key, value)`: Menambah atau memperbarui pasangan key-value.
- `.get(key)`: Mengambil nilai berdasarkan key (mengembalikan `undefined` jika tidak ada).
- `.has(key)`: Memeriksa apakah key ada di dalam Map (boolean).
- `.delete(key)`: Menghapus data berdasarkan key.
- `.clear()`: Mengosongkan seluruh isi Map.
- `.size`: Jumlah total pasangan key-value.

**`WeakMap`** adalah variasi khusus di mana key **wajib bertipe Objek** dan referensi ke objek tersebut bersifat lemah (*weakly held*), sehingga tidak mencegah *Garbage Collector* membersihkan memori saat objek aslinya sudah tidak digunakan lagi di tempat lain.

## Contoh

```javascript
// 1. Membuat dan Menggunakan Map
const userRoleMap = new Map();

// Objek sebagai key
const userBudi = { id: 1, name: "Budi" };
const userSiti = { id: 2, name: "Siti" };

userRoleMap.set(userBudi, "SUPER_ADMIN");
userRoleMap.set(userSiti, "STAFF");
userRoleMap.set("session_timeout", 3600); // Key bertipe string biasa

console.log("Role Budi:", userRoleMap.get(userBudi));
console.log("Total Data di Map:", userRoleMap.size); // 3
console.log("Apakah ada userSiti?", userRoleMap.has(userSiti)); // true

// 2. Iterasi Map menggunakan for...of
console.log("\n=== Iterasi Map ===");
for (const [key, role] of userRoleMap) {
    const keyLabel = typeof key === "object" ? key.name : key;
    console.log(`Key: ${keyLabel} -> Role: ${role}`);
}

// 3. WeakMap untuk Data Tambahan Privat
const userMetadata = new WeakMap();
let tempUser = { id: 99 };
userMetadata.set(tempUser, { loginCount: 15, lastIp: "192.168.1.1" });

console.log("\nMetadata tempUser:", userMetadata.get(tempUser));
```

## Output

```text
Role Budi: SUPER_ADMIN
Total Data di Map: 3
Apakah ada userSiti? true

=== Iterasi Map ===
Key: Budi -> Role: SUPER_ADMIN
Key: Siti -> Role: STAFF
Key: session_timeout -> Role: 3600

Metadata tempUser: { loginCount: 15, lastIp: '192.168.1.1' }
```

## Cara Kerja

```text
       userRoleMap.set(userBudi, "SUPER_ADMIN")
                          │
                          ▼
       Membuat tautan Hash Map: Referensi Memori Objek ──► Nilai
                          │
                          ▼
       userRoleMap.get(userBudi) langsung mengambil nilai tanpa konversi string
```

**Hafalan:**

```text
map.set(key, value)   → Menyimpan pasangan data baru ke dalam Map
map.get(key)          → Mengambil nilai dari Map berdasarkan key
map.has(key)          → Mengecek apakah key terdaftar di Map
map.delete(key)       → Menghapus entri berdasarkan key
map.size              → Mendapatkan total jumlah entri di dalam Map
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan `Map` saat kunci data Anda dinamis atau berupa objek (misal: asosiasi metadata DOM element ke data aplikasi).
- ❌ Jangan gunakan `map[key] = val` untuk mengisi data Map; selalu gunakan method resmi `map.set(key, val)`.

---

<a id="bagian-12"></a>

# 12. 🟡 Set & WeakSet (Koleksi Nilai Unik)

## Konsep

**`Set`** adalah struktur data bawaan yang menampung sekumpulan **nilai unik (*unique values*)**. `Set` secara otomatis membuang nilai duplikat sehingga setiap elemen hanya boleh muncul tepat satu kali.

Method Utama `Set`:
- `.add(value)`: Menambahkan nilai baru (jika nilai sudah ada, penambahan diabaikan).
- `.has(value)`: Memeriksa apakah suatu nilai ada di dalam Set (sangat cepat, O(1) time complexity).
- `.delete(value)`: Menghapus nilai tertentu.
- `.clear()`: Mengosongkan Set.
- `.size`: Menghitung total elemen unik.

**`WeakSet`** adalah variasi di mana seluruh elemen **wajib berupa Objek** dan referensi objek di dalamnya bersifat lemah untuk pencegahan kebocoran memori (*memory leak prevention*).

## Contoh

```javascript
// 1. Menghilangkan Duplikasi dari Array secara Instan (Trik Populer!)
const rawTags = ["javascript", "web", "nodejs", "javascript", "react", "web"];
const uniqueTags = [...new Set(rawTags)];

console.log("Array Asli (Ada Duplikat):", rawTags);
console.log("Array Unik (Set + Spread):", uniqueTags);

// 2. Operasi Dasar Set
const activeUserIds = new Set();

activeUserIds.add(101);
activeUserIds.add(102);
activeUserIds.add(101); // Diabaikan otomatis karena 101 sudah ada

console.log("Total User Aktif:", activeUserIds.size); // 2
console.log("Apakah User 102 aktif?", activeUserIds.has(102)); // true

activeUserIds.delete(102);
console.log("Setelah 102 logout, sisa:", activeUserIds.size); // 1

// 3. Iterasi Set dengan for...of
console.log("\n=== Iterasi Elemen Set ===");
for (const tag of new Set(rawTags)) {
    console.log("Tag:", tag);
}
```

## Output

```text
Array Asli (Ada Duplikat): [ 'javascript', 'web', 'nodejs', 'javascript', 'react', 'web' ]
Array Unik (Set + Spread): [ 'javascript', 'web', 'nodejs', 'react' ]
Total User Aktif: 2
Apakah User 102 aktif? true
Setelah 102 logout, sisa: 1

=== Iterasi Elemen Set ===
Tag: javascript
Tag: web
Tag: nodejs
Tag: react
```

## Cara Kerja

```text
         Input Array: ["js", "web", "js"]
                       │
                       ▼
         new Set(["js", "web", "js"])
                       │
                       ▼
         Deteksi duplikat "js" -> Hanya simpan 1 salinan
                       │
                       ▼
         Set(2) { "js", "web" }
```

**Hafalan:**

```text
[...new Set(array)] → Trik paling ringkas dan cepat untuk menghapus duplikat dari array
set.add(value)      → Menambahkan nilai baru (otomatis mencegah duplikasi)
set.has(value)      → Mengecek keberadaan nilai dengan performa O(1) yang sangat cepat
set.size            → Jumlah elemen unik di dalam Set
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan `Set.prototype.has()` untuk pengecekan keberadaan data berulang-ulang alih-alih `array.includes()`, karena `Set` memiliki performa O(1) yang jauh lebih cepat dibanding `Array` O(N).
- ❌ Objek di dalam Set dibandingkan berdasarkan referensi memorinya (`=== `), sehingga `set.add({id: 1})` dan `set.add({id: 1})` akan dianggap sebagai 2 objek yang berbeda karena referensi memorinya berlainan.

---

<a id="bagian-13"></a>

# 13. 🟡 Symbol (Identifier Unik & Well-Known Symbols)

## Konsep

**`Symbol`** adalah tipe data primitif yang diperkenalkan pada ES6 untuk menciptakan **pengenal unik yang dijamin tidak akan pernah bentrok (*guaranteed unique identifier*)**, bahkan jika dua simbol dibuat dengan label deskripsi yang persis sama.

Kegunaan Utama Symbol:
1. **Hidden / Unique Property Keys:** Menambahkan properti ke dalam objek tanpa takut menimpa (*override*) atau tertimpa oleh properti lain dari library eksternal.
2. **Non-Enumerable Property:** Properti yang menggunakan kunci Symbol tidak akan muncul pada perulangan `for...in` atau `Object.keys()`.
3. **Well-Known Symbols:** Simbol bawaan standar (seperti `Symbol.iterator`, `Symbol.toPrimitive`, `Symbol.hasInstance`) untuk mengkustomisasi perilaku internal bahasa.

## Contoh

```javascript
// 1. Setiap Symbol Dijamin Selalu Unik
const symA = Symbol("session_id");
const symB = Symbol("session_id");

console.log("Apakah symA === symB?", symA === symB); // false (Selalu unik!)

// 2. Properti Objek dengan Kunci Symbol
const internalId = Symbol("internal_id");

const userAccount = {
    name: "Ahmad",
    role: "User",
    [internalId]: "SYS-SECRET-9988" // Properti berbasis Symbol
};

console.log("Nama:", userAccount.name);
console.log("Akses Properti Symbol:", userAccount[internalId]);

// 3. Bukti bahwa Symbol tidak bocor ke Object.keys()
console.log("Object.keys():", Object.keys(userAccount)); // [ 'name', 'role' ] (Symbol tersembunyi!)

// Membaca Symbol khusus menggunakan Reflect atau getOwnPropertySymbols
console.log("Own Symbols:", Object.getOwnPropertySymbols(userAccount));
```

## Output

```text
Apakah symA === symB? false
Nama: Ahmad
Akses Properti Symbol: SYS-SECRET-9988
Object.keys(): [ 'name', 'role' ]
Own Symbols: [ Symbol(internal_id) ]
```

## Cara Kerja

```text
         const id = Symbol("desc")
                     │
                     ▼
         Engine mengalokasikan Token Unik 128-bit di memori
                     │
                     ▼
         Menjadi key properti objek yang bebas konflik
```

**Hafalan:**

```text
Symbol(description)            → Menciptakan identifier primitif unik yang tidak pernah bertabrakan
Symbol.for(key)                → Mengambil atau mendaftarkan simbol ke dalam Global Symbol Registry
Object.getOwnPropertySymbols() → Mengambil seluruh key properti bertipe Symbol dari suatu objek
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan Symbol untuk menambahkan metadata internal pada objek agar tidak mengganggu properti publik yang diakses oleh pengguna objek.
- ❌ Jangan memanggil Symbol dengan kata kunci `new Symbol()`, karena Symbol adalah fungsi pembuat tipe primitif, bukan constructor.

---

<a id="bagian-14"></a>

# 14. 🟡 RegExp (Regular Expression Patterns & Modifiers)

## Konsep

**`RegExp`** (Regular Expression) adalah objek pola pencocokan teks yang digunakan untuk memvalidasi format, mencari substring, dan mengganti teks berdasarkan pola tertentu.

Cara Deklarasi RegExp:
1. **Literal Pattern:** `/pattern/flags` (misal: `/[a-z]+/i`).
2. **Constructor Function:** `new RegExp("pattern", "flags")` (cocok jika pola dibuat secara dinamis saat runtime).

Flags / Modifiers Umum:
- `g` (*Global*): Mencari seluruh kecocokan dalam teks (bukan hanya kecocokan pertama).
- `i` (*Case-Insensitive*): Mengabaikan perbedaan huruf besar dan huruf kecil.
- `m` (*Multi-line*): Mengaktifkan kecocokan baris awal `^` dan akhir `$` per baris.

Method Penting RegExp & String:
- `regex.test(string)`: Menguji apakah string cocok dengan pola (return boolean).
- `regex.exec(string)`: Mengembalikan array detail hasil pencocokan pertama beserta *capture groups*.
- `string.match(regex)` & `string.matchAll(regex)`: Mencocokkan string dengan pola.

## Contoh

```javascript
// 1. Validasi Format Email Sederhana dengan .test()
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validEmail = "budi.santoso@example.com";
const invalidEmail = "budi_at_example";

console.log("Email 1 Valid?", emailPattern.test(validEmail));   // true
console.log("Email 2 Valid?", emailPattern.test(invalidEmail)); // false

// 2. Ekstraksi Nomor Telepon & Grup dengan .exec()
const phoneText = "Hubungi admin kami di: 0812-3456-7890 atau 0857-1122-3344";
const phonePattern = /(08\d{2})-(\d{4})-(\d{4})/g;

let match;
console.log("\n=== Hasil Pencarian Nomor Telepon ===");
while ((match = phonePattern.exec(phoneText)) !== null) {
    console.log(`Nomor Ditemukan: ${match[0]} (Kode Area: ${match[1]})`);
}

// 3. Membersihkan Karakter Non-Alfanumerik dengan replace
const dirtyInput = "Halo @#Dunia!! 2026 %^&*";
const cleanAlphaNum = dirtyInput.replace(/[^a-zA-Z0-9 ]/g, "");
console.log("\nCleaned String:", cleanAlphaNum);
```

## Output

```text
Email 1 Valid? true
Email 2 Valid? false

=== Hasil Pencarian Nomor Telepon ===
Nomor Ditemukan: 0812-3456-7890 (Kode Area: 0812)
Nomor Ditemukan: 0857-1122-3344 (Kode Area: 0857)

Cleaned String: Halo Dunia 2026 
```

## Cara Kerja

```text
         "budi@example.com"
                 │
                 ▼
         emailPattern.test(str)
                 │
         ┌───────┴───────┐
       [Cocok]       [Tidak]
         │               │
         ▼               ▼
       true            false
```

**Hafalan:**

```text
/pattern/flags          → Pola RegExp literal
regex.test(string)      → Memeriksa kecocokan pola teks (return true/false)
regex.exec(string)      → Mengekstrak grup kecocokan pola
string.replace(regex, replacement) → Mengganti teks yang cocok dengan pola regex
```

## Best Practice & Kesalahan Umum

- ✅ Selalu gunakan `regex.test()` jika Anda hanya membutuhkan konfirmasi ada/tidaknya pola (boolean) karena jauh lebih cepat daripada `.exec()` atau `.match()`.
- ❌ Hati-hati dengan flag global `g` pada method `regex.test()`, karena RegExp objek akan menyimpan indeks pencarian terakhir (`lastIndex`) yang dapat menghasilkan nilai selang-seling jika dipanggil ulang.

---

<a id="bagian-15"></a>

# 15. 🟡 URL & URLSearchParams (Parsing & Manipulasi Query URL)

## Konsep

Objek bawaan **`URL`** dan **`URLSearchParams`** menyediakan API standar yang aman dan andal untuk mengurai (*parse*), membaca, serta memanipulasi komponen alamat website dan parameter query string tanpa perlu melakukan manipulasi string manual yang rawan bug.

Komponen yang Disediakan Objek `URL`:
- `.protocol`: Protokol (misal `https:`).
- `.host` / `.hostname`: Nama domain server dan port.
- `.pathname`: Jalur rute URL.
- `.search`: String query mentah (misal `?page=2&sort=asc`).
- `.searchParams`: Objek instance `URLSearchParams` untuk manipulasi query secara dinamis.

Method Utama `URLSearchParams`:
- `.get(name)`: Mengambil nilai parameter.
- `.set(name, value)`: Menetapkan atau menimpa nilai parameter.
- `.append(name, value)`: Menambahkan parameter baru.
- `.has(name)`: Mengecek apakah nama parameter ada.
- `.delete(name)`: Menghapus parameter.
- `.toString()`: Mengubah kembali ke string query URL.

## Contoh

```javascript
// 1. Mengurai (Parsing) Alamat URL Lengkap
const fullUrl = new URL("https://toko.example.com:8080/products/search?category=gadget&page=1&sort=price#reviews");

console.log("Protocol:", fullUrl.protocol); // "https:"
console.log("Host:", fullUrl.host);         // "toko.example.com:8080"
console.log("Pathname:", fullUrl.pathname); // "/products/search"
console.log("Hash Anchor:", fullUrl.hash);  // "#reviews"

// 2. Membaca dan Memanipulasi Query Parameters via searchParams
const query = fullUrl.searchParams;

console.log("Kategori Saat Ini:", query.get("category")); // "gadget"
console.log("Halaman Saat Ini:", query.get("page"));       // "1"

// Mengubah dan menambah query baru
query.set("page", "2"); // Ubah page menjadi 2
query.append("filter", "free_shipping"); // Tambah filter baru
query.delete("sort"); // Hapus parameter sort

console.log("\nURL Query yang Diperbarui:", query.toString());
console.log("URL Final Lengkap:", fullUrl.toString());
```

## Output

```text
Protocol: https:
Host: toko.example.com:8080
Pathname: /products/search
Hash Anchor: #reviews
Kategori Saat Ini: gadget
Halaman Saat Ini: 1

URL Query yang Diperbarui: category=gadget&page=2&filter=free_shipping
URL Final Lengkap: https://toko.example.com:8080/products/search?category=gadget&page=2&filter=free_shipping#reviews
```

## Cara Kerja

```text
         Alamat URL Teks
                │
                ▼
         new URL(urlString)
                │
         ┌──────┴──────┐
         ▼             ▼
      Domain & Path  searchParams (URLSearchParams)
                       │
                       ▼
                  .set("page", "2") otomatis meng-update string URL utuh
```

**Hafalan:**

```text
new URL(urlString)                     → Mengurai string URL menjadi objek komponen terpisah
url.searchParams.get(paramName)        → Mengambil nilai dari parameter query
url.searchParams.set(paramName, value) → Menetapkan atau memperbarui nilai parameter query
```

## Best Practice & Kesalahan Umum

- ✅ Selalu gunakan `URL` dan `URLSearchParams` untuk membangun endpoint API agar karakter khusus (seperti spasi dan simbol) otomatis di-*encode* dengan benar.
- ❌ Jangan menyusun URL query menggunakan konkatenasi string manual `url + "?key=" + val` yang rentan menimbulkan bug karakter ilegal.

---

<a id="bagian-16"></a>

# 16. 🟡 URI Encoding (encodeURI, encodeURIComponent, decodeURI)

## Konsep

Karakter khusus pada URL (seperti spasi, tanda tanya `?`, ampersand `&`, garis miring `/`, dan simbol non-ASCII) harus diubah menjadi format heksadesimal yang aman (*Percent-Encoding*) agar dapat ditransmisikan melalui protokol HTTP tanpa merusak struktur URL.

Perbedaan Dua Fungsi Encoding Utama:
1. **`encodeURI(fullUri)`:**
   - Digunakan untuk meng-encode **keseluruhan alamat URL lengkap**.
   - **TIDAK** mengubah karakter pemisah URL yang sah seperti `:`, `/`, `?`, `&`, `#`.
2. **`encodeURIComponent(paramValue)`:**
   - Digunakan khusus untuk meng-encode **satu nilai parameter/komponen data saja**.
   - Mengubah **SEMUA** karakter khusus termasuk `/`, `?`, `&`, `=`, dan `#` menjadi kode persen (misal `/` menjadi `%2F`).

Fungsi Pemulih (Decoding):
- **`decodeURI(encodedUri)`** & **`decodeURIComponent(encodedParam)`**.

## Contoh

```javascript
const searchKeyword = "Laptop Gaming & Aksesoris/2026?";

// 1. Perbedaan encodeURI vs encodeURIComponent
const fullUrlSample = "https://example.com/cari?q=" + searchKeyword;

console.log("=== Menggunakan encodeURI ===");
const encodedFull = encodeURI(fullUrlSample);
console.log("Hasil encodeURI:", encodedFull);

console.log("\n=== Menggunakan encodeURIComponent (PILIHAN BENAR UNTUK VALUE) ===");
const encodedValueOnly = encodeURIComponent(searchKeyword);
const safeUrl = `https://example.com/cari?q=${encodedValueOnly}`;
console.log("Encoded Value:", encodedValueOnly);
console.log("Safe Final URL:", safeUrl);

// 2. Mengembalikan ke Teks Asli (Decoding)
const decodedValue = decodeURIComponent(encodedValueOnly);
console.log("\nDecoded Kembali:", decodedValue);
```

## Output

```text
=== Menggunakan encodeURI ===
Hasil encodeURI: https://example.com/cari?q=Laptop%20Gaming%20&%20Aksesoris/2026?

=== Menggunakan encodeURIComponent (PILIHAN BENAR UNTUK VALUE) ===
Encoded Value: Laptop%20Gaming%20%26%20Aksesoris%2F2026%3F
Safe Final URL: https://example.com/cari?q=Laptop%20Gaming%20%26%20Aksesoris%2F2026%3F

Decoded Kembali: Laptop Gaming & Aksesoris/2026?
```

## Cara Kerja

```text
   Karakter '&' dan '?' dalam data ──► encodeURIComponent() ──► '%26' dan '%3F'
   (Mencegah parameter query terpecah secara tidak sengaja oleh web server)
```

**Hafalan:**

```text
encodeURIComponent(param)   → Meng-encode satu nilai parameter (wajib untuk data dinamis)
encodeURI(fullUrl)          → Meng-encode seluruh URL lengkap tanpa merusak struktur ://?
decodeURIComponent(encoded) → Mengembalikan nilai percent-encoded kembali ke teks normal
```

## Best Practice & Kesalahan Umum

- ✅ Selalu bungkus setiap nilai variabel dinamis yang akan dimasukkan ke dalam query URL dengan `encodeURIComponent()`.
- ❌ Jangan gunakan `encodeURI()` pada nilai parameter yang mengandung tanda `&` atau `=`, karena karakter tersebut tidak akan di-encode dan membuat query terpecah.

---

<a id="bagian-17"></a>

# 17. 🟡 Base64 Encoding (btoa, atob, Buffer)

## Konsep

**Base64** adalah skema pengodean (*encoding*) yang mengubah data biner atau teks menjadi sekumpulan 64 karakter ASCII yang aman untuk ditransmisikan melalui media yang hanya mendukung format teks (seperti header HTTP, email, token otentikasi Basic Auth, atau Data URL gambar inline).

Fungsi Bawaan Base64:
1. **Di Lingkungan Browser & Modern Node.js:**
   - **`btoa(plainString)`** (*Binary to ASCII*): Mengubah string teks menjadi format Base64.
   - **`atob(base64String)`** (*ASCII to Binary*): Mengurai string Base64 kembali menjadi string teks asli.
2. **Di Lingkungan Node.js (Buffer API):**
   - `Buffer.from(text, 'utf-8').toString('base64')`
   - `Buffer.from(base64, 'base64').toString('utf-8')`

## Contoh

```javascript
// 1. Menggunakan btoa dan atob (Standar Web Global)
const plainCredentials = "admin_user:super_secret_password_2026";

// Encoding ke Base64
const encodedBase64 = btoa(plainCredentials);
console.log("Teks Asli:", plainCredentials);
console.log("Hasil Base64 (btoa):", encodedBase64);

// Decoding kembali dari Base64
const decodedText = atob(encodedBase64);
console.log("Hasil Decode (atob):", decodedText);

// 2. Membuat Header Basic Authentication HTTP
const authHeader = "Basic " + btoa("client_id:client_secret");
console.log("Header Authorization:", authHeader);

// 3. Menggunakan Buffer API di Node.js (Mendukung UTF-8 Karakter Non-Latin)
const nodeEncoded = Buffer.from(plainCredentials, "utf-8").toString("base64");
const nodeDecoded = Buffer.from(nodeEncoded, "base64").toString("utf-8");
console.log("\nNode.js Buffer Decode:", nodeDecoded);
```

## Output

```text
Teks Asli: admin_user:super_secret_password_2026
Hasil Base64 (btoa): YWRtaW5fdXNlcjpzdXBlcl9zZWNyZXRfcGFzc3dvcmRfMjAyNg==
Hasil Decode (atob): admin_user:super_secret_password_2026
Header Authorization: Basic Y2xpZW50X2lkOmNsaWVudF9zZWNyZXQ=

Node.js Buffer Decode: admin_user:super_secret_password_2026
```

## Cara Kerja

```text
   Teks: "admin:123" ──► Konversi ke Byte Biner ──► Dikelompokkan per 6 bit ──► Teks Base64: "YWRtaW46MTIz"
```

**Hafalan:**

```text
btoa(text)   → Mengubah string teks menjadi Base64 (Binary to ASCII)
atob(base64) → Mengubah string Base64 kembali ke teks asli (ASCII to Binary)
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan Base64 untuk menyematkan aset kecil (misal ikon SVG kecil pada CSS) atau header otentikasi.
- ❌ Ingat bahwa Base64 adalah teknik **Encoding**, BUKAN **Enkripsi**; data Base64 dapat dibaca kembali oleh siapa saja dengan mudah tanpa kunci rahasia.

---

<a id="bagian-18"></a>

# 18. 🟡 Internationalization API (Intl.NumberFormat, Intl.DateTimeFormat, Intl.RelativeTimeFormat)

## Konsep

Namespace global **`Intl`** adalah Internationalization API resmi ECMAScript yang menyediakan pemformatan bahasa, angka, mata uang, dan tanggal tingkat lanjut berdasarkan standar lokasi regional (*Locale-sensitive formatting*).

Fitur Utama `Intl`:
1. **`Intl.NumberFormat(locale, options)`:** Memformat angka menjadi mata uang (IDR, USD, EUR), persentase, atau unit ukuran (kilometer, megabyte).
2. **`Intl.DateTimeFormat(locale, options)`:** Memformat tanggal dan jam lengkap dengan nama hari, bulan, dan zona waktu lokal.
3. **`Intl.RelativeTimeFormat(locale, options)`:** Memformat waktu relatif secara alami (seperti *"3 hari yang lalu"*, *"besok"*, *"dalam 5 menit"*).

## Contoh

```javascript
// 1. Pemformatan Mata Uang (Intl.NumberFormat)
const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
});

const usdFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
});

console.log("Format Rupiah:", rupiahFormatter.format(1500000)); // "Rp 1.500.000"
console.log("Format Dolar:", usdFormatter.format(1500000));    // "$1,500,000.00"

// 2. Pemformatan Tanggal Lengkap (Intl.DateTimeFormat)
const today = new Date("2026-08-29T14:30:00");
const indonesianDate = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "short"
}).format(today);

console.log("\nTanggal Indonesia:", indonesianDate);

// 3. Pemformatan Waktu Relatif (Intl.RelativeTimeFormat)
const rtf = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" });

console.log("\nWaktu Relatif (-1 hari):", rtf.format(-1, "day"));     // "kemarin"
console.log("Waktu Relatif (-3 hari):", rtf.format(-3, "day"));     // "3 hari yang lalu"
console.log("Waktu Relatif (+2 jam):", rtf.format(2, "hour"));      // "dalam 2 jam"
```

## Output

```text
Format Rupiah: Rp 1.500.000
Format Dolar: $1,500,000.00

Tanggal Indonesia: Sabtu, 29 Agustus 2026 14.30

Waktu Relatif (-1 hari): kemarin
Waktu Relatif (-3 hari): 3 hari yang lalu
Waktu Relatif (+2 jam): dalam 2 jam
```

## Cara Kerja

```text
       new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" })
                               │
                               ▼
       Engine memuat kamus aturan lokalisasi standar Unicode CLDR
                               │
                               ▼
       Menghasilkan string terformat sempurna sesuai kaidah Bahasa Indonesia
```

**Hafalan:**

```text
new Intl.NumberFormat(locale, options).format(number)     → Format mata uang & angka regional
new Intl.DateTimeFormat(locale, options).format(date)     → Format tanggal lokal lengkap
new Intl.RelativeTimeFormat(locale, options).format(n, u) → Format teks waktu relatif (lalu / depan)
```

## Best Practice & Kesalahan Umum

- ✅ Simpan instance `Intl.NumberFormat` atau `Intl.DateTimeFormat` ke dalam variabel/konstanta untuk digunakan berulang-ulang agar performa rendering aplikasi cepat.
- ❌ Jangan membuat format mata uang manual menggunakan pemotongan string dan regex jika bisa diserahkan ke `Intl.NumberFormat` bawaan browser.

---

<a id="bagian-19"></a>

# 19. 🔴 Proxy (Interception & Traps: get, set, deleteProperty)

## Konsep

Objek **`Proxy`** memungkinkan kita membungkus suatu objek target (**Target**) dan mencegat (*intercept*) serta mengkustomisasi operasi dasar pada objek tersebut (seperti membaca properti, menulis nilai baru, menghapus properti, atau pemanggilan fungsi) menggunakan kumpulan fungsi penangkap yang disebut **Traps** di dalam objek **Handler**.

Sintaks:
```javascript
const proxy = new Proxy(target, handler);
```

Traps Populer pada Handler:
- `get(target, property, receiver)`: Dicegat saat properti dibaca (`proxy.prop`).
- `set(target, property, value, receiver)`: Dicegat saat properti diisi nilai baru (`proxy.prop = val`).
- `has(target, property)`: Dicegat saat operator `in` digunakan (`"prop" in proxy`).
- `deleteProperty(target, property)`: Dicegat saat operator `delete` dijalankan.

Proxy menjadi fondasi utama di balik sistem **Reaktivitas Modern** pada framework web terkini (seperti Vue 3 Composition API).

## Contoh

```javascript
// 1. Objek Data Target
const rawUser = {
    username: "budisantoso",
    age: 24
};

// 2. Handler dengan Traps Get & Set untuk Validasi Otomatis
const userValidationHandler = {
    get(target, property) {
        console.log(`[LOG]: Membaca properti "${String(property)}"`);
        // Jika properti tidak ada, berikan pesan default ramah
        return property in target ? target[property] : "Properti Tidak Ditemukan!";
    },

    set(target, property, value) {
        console.log(`[LOG]: Menulis properti "${String(property)}" dengan nilai: `, value);

        // Validasi aturan usia
        if (property === "age") {
            if (typeof value !== "number" || value < 0 || value > 120) {
                throw new RangeError("Usia harus berupa angka antara 0 sampai 120!");
            }
        }

        // Simpan nilai ke target asli jika valid
        target[property] = value;
        return true; // Wajib mengembalikan true untuk menandakan mutasi berhasil
    }
};

// 3. Membuat Objek Proxy
const monitoredUser = new Proxy(rawUser, userValidationHandler);

// Menguji trap GET
console.log("Username:", monitoredUser.username);
console.log("Email:", monitoredUser.email); // Properti Tidak Ditemukan!

// Menguji trap SET
monitoredUser.age = 25; // Valid
console.log("Usia Baru:", monitoredUser.age);

// monitoredUser.age = -10; // Error! RangeError: Usia harus berupa angka antara 0 sampai 120!
```

## Output

```text
[LOG]: Membaca properti "username"
Username: budisantoso
[LOG]: Membaca properti "email"
Email: Properti Tidak Ditemukan!
[LOG]: Menulis properti "age" dengan nilai:  25
[LOG]: Membaca properti "age"
Usia Baru: 25
```

## Cara Kerja

```text
       Akses: monitoredUser.username
                     │
                     ▼
       Memicu Handler Trap: get(target, "username")
                     │
                     ▼
       Logging / Modifikasi / Validasi
                     │
                     ▼
       Kembalikan nilai ke pemanggil
```

**Hafalan:**

```text
new Proxy(target, { get, set, has, deleteProperty }) → Membungkus objek dengan lapisan proteksi/intersepsi
trap.set(target, prop, value)                        → Wajib me-return boolean true jika sukses
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan Proxy untuk membuat sistem validasi skema otomatis, logging aktivitas data (*auditing*), atau data-binding reaktif.
- ❌ Jangan lupa mengembalikan nilai `true` pada trap `set`, karena di Strict Mode hal itu akan memicu `TypeError`.

---

<a id="bagian-20"></a>

# 20. 🔴 Reflect (Metaprogramming & Standard Object Operations)

## Konsep

**`Reflect`** adalah objek statis bawaan (mirip dengan `Math`, bukan konstruktor) yang menyediakan metode-metode standar untuk melakukan operasi inspeksi dan manipulasi objek di level bahasa (*Metaprogramming*).

Mengapa Menggunakan `Reflect`?
1. **Pasangan Sempurna untuk Proxy:** Setiap trap pada `Proxy` memiliki method yang namanya identik di `Reflect` (misal: `handler.get` berpasangan dengan `Reflect.get`).
2. **Nilai Kembalian yang Lebih Elegan:** Daripada melempar error fatal, method `Reflect` mengembalikan status boolean (misal `Reflect.defineProperty` me-return boolean `true`/`false`).
3. **Menggantikan Operator Jadul:** Menyediakan fungsi formal untuk `in` (`Reflect.has`), `delete` (`Reflect.deleteProperty`), dan `new` (`Reflect.construct`).

## Contoh

```javascript
const article = {
    title: "Belajar JavaScript Standard Library",
    tags: ["js", "stdlib"]
};

// 1. Operasi Standar menggunakan Reflect
console.log("Reflect.has('title'):", Reflect.has(article, "title")); // Sama dengan "title" in article
console.log("Reflect.get('title'):", Reflect.get(article, "title")); // Sama dengan article.title

// Menetapkan nilai dengan Reflect.set
Reflect.set(article, "views", 1500);
console.log("Views:", article.views);

// Menghapus properti dengan Reflect.deleteProperty
Reflect.deleteProperty(article, "tags");
console.log("Tags setelah delete:", article.tags); // undefined

// 2. Kombinasi Sempurna Proxy + Reflect (Pola Standar Industri)
const reactiveTarget = { score: 100 };

const reactiveProxy = new Proxy(reactiveTarget, {
    get(target, prop, receiver) {
        console.log(`[Reflect Get]: ${String(prop)}`);
        // Meneruskan eksekusi default secara aman dengan receiver context
        return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
        console.log(`[Reflect Set]: ${String(prop)} = ${value}`);
        return Reflect.set(target, prop, value, receiver);
    }
});

reactiveProxy.score = 200;
console.log("Skor Akhir:", reactiveProxy.score);
```

## Output

```text
Reflect.has('title'): true
Reflect.get('title'): Belajar JavaScript Standard Library
Views: 1500
Tags setelah delete: undefined
[Reflect Set]: score = 200
[Reflect Get]: score
Skor Akhir: 200
```

## Cara Kerja

```text
       Proxy Handler Trap
              │
              ▼
       Reflect.get(target, prop, receiver)
              │
              ▼
       Eksekusi operasi objek asli dengan binding receiver yang benar
```

**Hafalan:**

```text
Reflect.get(target, prop, receiver)         → Membaca properti objek dengan benar
Reflect.set(target, prop, value, receiver)  → Menulis properti dan me-return boolean sukses
Reflect.has(target, prop)                   → Pengganti fungsi untuk operator 'in'
Reflect.deleteProperty(target, prop)        → Pengganti fungsi untuk operator 'delete'
```

## Best Practice & Kesalahan Umum

- ✅ Selalu teruskan operasi bawaan di dalam Proxy handler menggunakan `Reflect.*` dengan menyertakan argumen `receiver` agar referensi `this` pada getter/setter prototype tidak rusak.
- ❌ Jangan memanggil `new Reflect()`, karena `Reflect` adalah objek statis murni.

---

<a id="bagian-21"></a>

# 21. 🔴 Structured Clone (structuredClone Deep Copy)

## Konsep

Fungsi global **`structuredClone(value)`** (standar resmi HTML/ECMAScript modern) adalah cara resmi untuk menduplikasi objek secara mendalam (**Deep Clone / Deep Copy**) secara native tanpa bantuan pustaka eksternal seperti Lodash.

Perbedaan Tipe Salinan:
1. **Shallow Copy (`Object.assign` / `{...obj}`):** Hanya menyalin tingkat pertama; objek bersarang (*nested objects*) di dalamnya masih berbagi referensi memori yang sama.
2. **Deep Copy Tradisional (`JSON.parse(JSON.stringify(obj))`):** Mampu menyalin bersarang, tetapi **merusak tipe data khusus** (Date menjadi string, Map/Set menjadi objek kosong, RegExp hilang, dan melempar error pada referensi melingkar / *circular reference*).
3. **`structuredClone()` (Native Modern):** Menyalin seluruh hierarki bersarang sekaligus **mempertahankan tipe data kompleks** (`Date`, `Set`, `Map`, `ArrayBuffer`, `RegExp`) serta mampu menangani referensi melingkar (*circular references*).

## Contoh

```javascript
// Objek kompleks dengan nested structure, Date, Set, dan referensi
const originalAccount = {
    id: 101,
    name: "Budi Santoso",
    createdAt: new Date("2026-08-01"),
    tags: new Set(["vip", "verified"]),
    settings: {
        theme: "dark",
        notifications: {
            email: true,
            push: false
        }
    }
};

// 1. Melakukan Deep Copy dengan structuredClone
const clonedAccount = structuredClone(originalAccount);

// 2. Memodifikasi objek kloning
clonedAccount.name = "Budi Santoso (Updated)";
clonedAccount.settings.notifications.email = false;
clonedAccount.tags.add("premium");

// 3. Pembuktian: Objek Asli Sama Sekali Tidak Berubah!
console.log("=== Objek Asli (Aman & Tidak Berubah) ===");
console.log("Nama:", originalAccount.name);
console.log("Email Notif Asli:", originalAccount.settings.notifications.email); // true
console.log("Tags Asli (Set):", [...originalAccount.tags]); // [ 'vip', 'verified' ]
console.log("Tipe createdAt:", originalAccount.createdAt instanceof Date ? "Date Object" : "String");

console.log("\n=== Objek Kloning (Berhasil Dimodifikasi Terpisah) ===");
console.log("Nama Kloning:", clonedAccount.name);
console.log("Email Notif Kloning:", clonedAccount.settings.notifications.email); // false
console.log("Tags Kloning (Set):", [...clonedAccount.tags]); // [ 'vip', 'verified', 'premium' ]
```

## Output

```text
=== Objek Asli (Aman & Tidak Berubah) ===
Nama: Budi Santoso
Email Notif Asli: true
Tags Asli (Set): [ 'vip', 'verified' ]
Tipe createdAt: Date Object

=== Objek Kloning (Berhasil Dimodifikasi Terpisah) ===
Nama Kloning: Budi Santoso (Updated)
Email Notif Kloning: false
Tags Kloning (Set): [ 'vip', 'verified', 'premium' ]
```

## Cara Kerja

```text
           originalAccount (Nested Memory 1)
                         │
                         ▼
             structuredClone(originalAccount)
                         │
                         ▼
           clonedAccount (Alokasi Memori Baru Terpisah Penuh)
```

**Hafalan:**

```text
structuredClone(object) → Melakukan deep copy native untuk seluruh struktur data kompleks
```

## Best Practice & Kesalahan Umum

- ✅ Jadikan `structuredClone()` sebagai standar utama untuk menduplikasi state atau objek konfigurasi bertingkat.
- ❌ Ingat bahwa `structuredClone()` tidak dapat menyalin fungsi (*Function*) atau node DOM browser; mencoba menyalin fungsi akan melempar `DataCloneError`.

---

<a id="bagian-22"></a>

# 22. 🔴 Eval & Function Constructor (dan Risiko Keamanannya)

## Konsep

Fungsi bawaan **`eval(stringCode)`** mengeksekusi string teks yang dikirimkan seolah-olah string tersebut adalah kode program JavaScript yang sedang berjalan.

### Mengapa `eval()` Sangat Berbahaya & Dilarang Keras di Aplikasi Nyata?
1. **Celah Keamanan Fatal (XSS / Code Injection):** Jika teks masukan berasal dari pengguna atau sumber luar yang belum terfilter, peretas dapat mengeksekusi kode jahat apa pun (mencuri token cookie, membobol data sensitif).
2. **Merusak Optimasi Performa:** Engine JavaScript (V8) tidak dapat mengoptimasi kode di sekitar `eval` karena struktur variabel tidak dapat diprediksi secara statis.
3. **Kebocoran Scope:** `eval` tanpa mode ketat dapat menciptakan atau mengubah variabel di scope lokal sekitarnya secara tidak terduga.

Alternatif Aman:
- Jika ingin mem-parsing format data JSON: Gunakan **`JSON.parse()`**.
- Jika ingin mengakses properti dinamis: Gunakan **Bracket Notation (`obj[prop]`)**.

## Contoh

```javascript
// 1. Contoh Sederhana Cara Kerja eval (Hanya untuk edukasi!)
const expression = "10 * 5 + 2";
const result = eval(expression);
console.log(`Hasil eval("${expression}"):`, result);

// 2. Bahaya Celah Keamanan (Simulasi Serangan)
function dangerousCalculator(userInput) {
    // JANGAN PERNAH LAKUKAN INI DI PRODUKSI!
    return eval(userInput);
}

// Penggunaan wajar:
console.log("Kalkulasi Wajar:", dangerousCalculator("50 + 25"));

// Serangan Injeksi Kode Jahat:
// dangerousCalculator("console.log('HACKED! Akses data dicuri: ' + JSON.stringify(process.env))");

// 3. Alternatif Aman: Parsing Ekspresi Matematika Sederhana dengan Aman
function safeAdd(a, b) {
    return Number(a) + Number(b);
}
console.log("Hasil Aman:", safeAdd("10", "20"));
```

## Output

```text
Hasil eval("10 * 5 + 2"): 52
Kalkulasi Wajar: 75
Hasil Aman: 30
```

## Cara Kerja

```text
        String Teks: "10 + 5"
                 │
                 ▼
        eval(stringCode)
                 │
                 ▼
        Engine Parser dipaksa mem-parsing ulang kode saat runtime
        (Lambat & Rawan Injeksi Kode)
```

**Hafalan:**

```text
eval(stringCode) → Mengeksekusi string teks sebagai kode JavaScript aktif (SANGAT BERBAHAYA)
"eval is evil"   → Pepatah terkenal dalam komunitas JavaScript: hindari 100%!
```

## Best Practice & Kesalahan Umum

- ✅ 100% hindari penggunaan `eval()` dalam pengembangan aplikasi web dan backend modern.
- ❌ Jangan pernah menggunakan `eval()` hanya untuk mengurai string JSON (selalu gunakan `JSON.parse()`).

---

<a id="bagian-23"></a>

# 23. 🛠️ Peta Ingatan Cepat

## Mental Model Pemilihan Built-in Object Berdasarkan Bentuk Data

```text
                                Masalah Komputasi Data
                                          │
        ┌─────────────────────────────────┼─────────────────────────────────┐
        ▼                                 ▼                                 ▼
   Data Teks & Nilai             Koleksi & Struktur               Format & Waktu
   - String: slice, split, trim  - Array: map, filter, reduce     - JSON: parse, stringify
   - Number: isInteger, toFixed  - Object: entries, freeze        - Date: now, getFullYear
   - BigInt: 9007199254740991n   - Map: Key objek sembarang       - Intl: NumberFormat (IDR)
   - Boolean: filter(Boolean)    - Set: Data unik tanpa duplikat  - RegExp: test, exec
        │                                 │                                 │
        └─────────────────────────────────┼─────────────────────────────────┘
                                          │
                                          ▼
                             Metaprogramming & Utilitas
                             - URL / URLSearchParams
                             - encodeURIComponent
                             - btoa / atob (Base64)
                             - Proxy & Reflect
                             - structuredClone (Deep Copy)
```

## Pohon Keputusan Utilitas Koleksi Data

```text
                                Kebutuhan Struktur Data
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   ▼                                             ▼
            Deret Terurut Indeks?                        Pasangan Kunci-Nilai?
                   │                                             │
                   ▼                                             ▼
                 Array                                           │
                   │                               ┌─────────────┴─────────────┐
                   ▼                               ▼                           ▼
            Butuh Nilai Unik Saja?           Kunci Cukup Teks?          Kunci Berupa Objek?
                   │                               │                           │
                   ▼                               ▼                           ▼
                  Set                            Object                       Map
```

---

<a id="bagian-24"></a>

# 24. 📚 Tabel Ringkasan

| Kategori | API / Built-in | Contoh Kode | Penjelasan & Kegunaan |
|---|---|---|---|
| **Numerik** | `Number` | `Number.isInteger(42)` | Validasi tipe angka bulat yang ketat |
| **Numerik** | `Math` | `Math.max(10, 20, 5)` | Utilitas operasi matematika & pembulatan |
| **Numerik** | `BigInt` | `100n + 200n` | Kalkulasi bilangan bulat presisi arbitrer |
| **Teks** | `String` | `str.slice(0, 5)` | Manipulasi, pencarian, & pemotongan string |
| **Teks** | `RegExp` | `/^[a-z]+$/i.test(s)` | Pencocokan pola teks & validasi ekspresi reguler |
| **Koleksi** | `Array` | `arr.filter(fn)` | Struktur deret data terurut dengan method fungsional |
| **Koleksi** | `Object` | `Object.entries(obj)` | Inspeksi & ekstraksi pasangan properti objek |
| **Koleksi** | `Map` | `map.set(keyObj, val)` | Koleksi key-value dengan kunci sembarang tipe data |
| **Koleksi** | `Set` | `new Set(array)` | Koleksi nilai unik (otomatis buang duplikat) |
| **Waktu** | `Date` | `Date.now()` | Representasi tanggal dan timestamp waktu |
| **Waktu/Angka** | `Intl` | `new Intl.NumberFormat()` | Pemformatan mata uang, tanggal, & waktu lokal |
| **Format** | `JSON` | `JSON.parse(str)` | Serialisasi & deserialisasi format data JSON |
| **Web/URL** | `URL` | `url.searchParams.get('q')` | Penguraian & manipulasi alamat web & parameter |
| **Web/URL** | `URI Encode` | `encodeURIComponent(val)` | Meng-encode nilai parameter agar aman di HTTP URL |
| **Web/URL** | `Base64` | `btoa(text)` / `atob(b64)` | Pengodean teks/biner ke string Base64 |
| **Metaprogram** | `Proxy` | `new Proxy(target, h)` | Mencegat (intercept) operasi get/set pada objek |
| **Metaprogram** | `Reflect` | `Reflect.get(t, p)` | Eksekusi operasi objek standar secara elegan |
| **Safety** | `Deep Clone` | `structuredClone(obj)` | Duplikasi objek mendalam (deep copy) native resmi |

---

<a id="bagian-25"></a>

# 25. ⚡ Cheat Code JavaScript Standard Library 10 Detik

## 1. Hapus Duplikat & Bersihkan Array
```javascript
const uniqueItems = [...new Set(["a", "b", "a", "c"])]; // ["a", "b", "c"]
const validValues = [1, "", null, 2, undefined].filter(Boolean); // [1, 2]
```

## 2. Format Rupiah & Tanggal Lokal Cepat
```javascript
const rupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(num);
const todayIndo = new Intl.DateTimeFormat("id-ID", { dateStyle: "full" }).format(new Date());
```

## 3. Deep Clone Aman (ES2022+)
```javascript
const original = { id: 1, date: new Date(), tags: new Set(["a", "b"]) };
const copied = structuredClone(original);
```

## 4. Query URL & Object Entries
```javascript
const params = new URLSearchParams({ category: "gadget", sort: "desc" });
console.log(params.toString()); // "category=gadget&sort=desc"

for (const [key, value] of Object.entries({ a: 1, b: 2 })) {
    console.log(key, value);
}
```

---

<a id="bagian-26"></a>

# 26. 🧭 Urutan Belajar yang Disarankan

Untuk menguasai Standard Library JavaScript secara efisien dari operasi data harian hingga metaprogramming, ikuti 4 tahapan berikut:

```text
                   FASE 1: Tipe Data Primitif & Koleksi Dasar (Minggu 1)
       ┌─────────────────────────────────────────────────────────────┐
       │ 1. Number, Math functions, & Boolean konversi filter        │
       │ 2. String manipulation: slice, split, trim, replace         │
       │ 3. Array essential methods: map, filter, reduce, find       │
       │ 4. Object static methods: keys, values, entries, freeze     │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
                   FASE 2: Format Data, Waktu, & Koleksi Modern (Minggu 2)
       ┌─────────────────────────────────────────────────────────────┐
       │ 5. JSON serialization/deserialization (replacer & reviver)  │
       │ 6. Date & Intl API (NumberFormat, DateTimeFormat)           │
       │ 7. Map dan Set untuk struktur data unik & key objek         │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
                   FASE 3: Pola Teks, URL & Encoding (Minggu 3)
       ┌─────────────────────────────────────────────────────────────┐
       │ 8. RegExp patterns, flags, test(), exec()                   │
       │ 9. URL & URLSearchParams manipulation                       │
       │ 10. URI Encoding (encodeURIComponent) & Base64 (btoa/atob)  │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
                   FASE 4: Metaprogramming & Proyek Terintegrasi (Minggu 4)
       ┌─────────────────────────────────────────────────────────────┐
       │ 11. Symbol & well-known symbols                             │
       │ 12. Proxy & Reflect (Traps, data-binding, interceptors)     │
       │ 13. structuredClone deep copy                               │
       │ 14. Menyelesaikan Mini Project Standard Library             │
       └─────────────────────────────────────────────────────────────┘
```

---

<a id="bagian-27"></a>

# 27. 🏗️ Mini Project: Dashboard Pemrosesan Data & Utilitas Transaksi E-Commerce

## Konsep Project

Project ini menggabungkan berbagai built-in Standard Library JavaScript ke dalam sebuah sistem pipeline pemrosesan data pesanan e-commerce:
- **Map & Set:** Menyimpan katalog produk unik dan keranjang belanja berbasis objek.
- **Intl.NumberFormat & Intl.DateTimeFormat:** Memformat total biaya transaksi dan tanggal pesanan resmi Bahasa Indonesia.
- **RegExp & URLSearchParams:** Validasi kupon diskon dan pembuatan link faktur pembayaran.
- **Proxy & Reflect:** Memvalidasi mutasi data transaksi pelanggan secara otomatis sebelum disimpan.
- **structuredClone:** Membuat backup salinan transaksi yang aman dari mutasi liar.
- **JSON:** Menyimpan data log audit transaksi.

## Kode Lengkap

```javascript
/**
 * Mini Project Standard Library: Data Processing & E-Commerce Invoice Engine
 */

// 1. Data Katalog Produk menggunakan Map (Key Objek)
const catalogMap = new Map();

const prodA = { id: "SKU-01", name: "Monitor 27 Inch 144Hz" };
const prodB = { id: "SKU-02", name: "Mechanical Keyboard RGB" };
const prodC = { id: "SKU-03", name: "Mouse Wireless Ultralight" };

catalogMap.set(prodA, { price: 3200000, category: "Display" });
catalogMap.set(prodB, { price: 850000, category: "Aksesoris" });
catalogMap.set(prodC, { price: 450000, category: "Aksesoris" });

// 2. Formatters Baku (Intl API)
const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
});

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "short"
});

// 3. Validasi Kupon Diskon menggunakan RegExp
function validatePromoCoupon(couponCode) {
    // Format: DISKON-XX (XX adalah angka 10 s.d. 90)
    const couponRegex = /^DISKON-([1-9][0-9])$/i;
    const match = couponRegex.exec(couponCode);

    if (match) {
        return { isValid: true, discountPercent: parseInt(match[1], 10) };
    }
    return { isValid: false, discountPercent: 0 };
}

// 4. Proxy Data State Transaksi dengan Validasi Input Otomatis
function createProtectedOrder(initialData) {
    return new Proxy(initialData, {
        set(target, prop, value, receiver) {
            if (prop === "customerEmail") {
                const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
                if (!emailRegex.test(value)) {
                    throw new TypeError(`Format email "${value}" tidak valid!`);
                }
            }
            return Reflect.set(target, prop, value, receiver);
        }
    });
}

// 5. Engine Pembuat Struk dan URL Pembayaran
function processOrderCheckout(customerInfo, cartItems, couponCode = "") {
    // Inisialisasi Protected State Order
    const orderState = createProtectedOrder({
        orderId: "INV-" + Date.now().toString().slice(-6),
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        items: cartItems,
        createdAt: new Date()
    });

    // Mengumpulkan kategori unik menggunakan Set
    const uniqueCategories = new Set();
    let grossTotal = 0;

    for (const { product, qty } of cartItems) {
        const productInfo = catalogMap.get(product);
        if (productInfo) {
            grossTotal += productInfo.price * qty;
            uniqueCategories.add(productInfo.category);
        }
    }

    // Hitung Diskon
    const { isValid: hasDiscount, discountPercent } = validatePromoCoupon(couponCode);
    const discountAmount = hasDiscount ? grossTotal * (discountPercent / 100) : 0;
    const netTotal = grossTotal - discountAmount;

    // Backup State Asli menggunakan structuredClone (Deep Copy)
    const orderBackup = structuredClone(orderState);

    // Membangun URL Pembayaran via URL & URLSearchParams
    const paymentUrl = new URL("https://checkout.toko.com/pay");
    paymentUrl.searchParams.set("order_id", orderState.orderId);
    paymentUrl.searchParams.set("amount", String(netTotal));
    paymentUrl.searchParams.set("email", orderState.customerEmail);

    // Cetak Struk Hasil
    let receipt = `\n=======================================================\n`;
    receipt += `                FAKTUR TRANSAKSI E-COMMERCE            \n`;
    receipt += `=======================================================\n`;
    receipt += `No. Faktur : ${orderState.orderId}\n`;
    receipt += `Pelanggan  : ${orderState.customerName} (${orderState.customerEmail})\n`;
    receipt += `Waktu      : ${dateFormatter.format(orderState.createdAt)}\n`;
    receipt += `Kategori   : ${[...uniqueCategories].join(", ")}\n`;
    receipt += `-------------------------------------------------------\n`;
    receipt += `Item                               Qty       Subtotal  \n`;
    receipt += `-------------------------------------------------------\n`;

    for (const { product, qty } of cartItems) {
        const info = catalogMap.get(product);
        const sub = info.price * qty;
        const paddedName = product.name.padEnd(30, " ");
        const paddedQty = String(qty).padStart(3, " ");
        const paddedSub = currencyFormatter.format(sub).padStart(16, " ");
        receipt += `${paddedName} ${paddedQty} ${paddedSub}\n`;
    }

    receipt += `-------------------------------------------------------\n`;
    receipt += `Total Kotor   : ${currencyFormatter.format(grossTotal).padStart(35, " ")}\n`;
    if (hasDiscount) {
        receipt += `Diskon (${discountPercent}%)   : ${("-" + currencyFormatter.format(discountAmount)).padStart(35, " ")}\n`;
    }
    receipt += `Total Bayar   : ${currencyFormatter.format(netTotal).padStart(35, " ")}\n`;
    receipt += `-------------------------------------------------------\n`;
    receipt += `Link Bayar    : ${paymentUrl.toString()}\n`;
    receipt += `=======================================================\n`;

    return { receipt, orderBackup };
}

// 6. Eksekusi Simulasi Transaksi
const customer = { name: "Budi Santoso", email: "budi.santoso@example.com" };
const shoppingCart = [
    { product: prodA, qty: 1 },
    { product: prodB, qty: 2 }
];

const { receipt } = processOrderCheckout(customer, shoppingCart, "DISKON-15");
console.log(receipt);
```

## Output

```text
=======================================================
                FAKTUR TRANSAKSI E-COMMERCE            
=======================================================
No. Faktur : INV-789012
Pelanggan  : Budi Santoso (budi.santoso@example.com)
Waktu      : Sabtu, 29 Agustus 2026 14.35
Kategori   : Display, Aksesoris
-------------------------------------------------------
Item                               Qty       Subtotal  
-------------------------------------------------------
Monitor 27 Inch 144Hz                1    Rp 3.200.000
Mechanical Keyboard RGB              2    Rp 1.700.000
-------------------------------------------------------
Total Kotor   :                            Rp 4.900.000
Diskon (15%)   :                            -Rp 735.000
Total Bayar   :                            Rp 4.165.000
-------------------------------------------------------
Link Bayar    : https://checkout.toko.com/pay?order_id=INV-789012&amount=4165000&email=budi.santoso%40example.com
=======================================================
```

## Cara Kerja

```text
       Input Pesanan (Customer, Cart, Kupon)
                         │
                         ▼
       Map lookup -> Hitung Subtotal & Kategori Set
                         │
                         ▼
       RegExp -> Validasi & Parse Kupon Diskon (DISKON-15)
                         │
                         ▼
       Proxy -> Proteksi integritas email pelanggan
                         │
                         ▼
       URL & searchParams -> Generate Link Pembayaran Aman
                         │
                         ▼
       Intl Formatters -> Render Struk Resmi Berbahasa Indonesia
```

**Hafalan:**

```text
Standard Library Pipeline → Menggabungkan Map, Set, Intl, RegExp, Proxy, URL untuk solusi komprehensif
```

---

<a id="bagian-28"></a>

# 28. 🔗 Referensi Resmi

Untuk mempelajari dokumentasi dan spesifikasi resmi seluruh Standard Library built-in JavaScript:

- [MDN Web Docs — Standard Built-in Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)
- [MDN Web Docs — Intl (Internationalization API)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [MDN Web Docs — Proxy and Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN Web Docs — URL & URLSearchParams API](https://developer.mozilla.org/en-US/docs/Web/API/URL)
- [ECMA-262 ECMAScript Language Specification (Standard Library)](https://tc39.es/ecma262/)

> **Catatan Versi:** Cheatsheet ini disusun mengacu pada spesifikasi **ECMAScript 2022+**. Seluruh API standar yang dibahas didukung penuh secara bawaan (*native*) di Node.js LTS terkini dan seluruh browser modern tanpa memerlukan polyfill.
