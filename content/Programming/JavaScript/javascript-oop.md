---
title: "JavaScript OOP"
description: "Object-Oriented Programming di JavaScript: prototype chain, constructor function, ES6 classes, inheritance, encapsulation (#private), dan polymorphism."
order: 3
tags:
  - programming
  - javascript
  - oop
  - intermediate
---

# JavaScript OOP

> **Target:** Pemula yang sudah memahami dasar JavaScript (object, function, array) dan ingin menguasai Object-Oriented Programming (OOP) modern di JavaScript (ES6 / ES2022+).
> **Versi:** ES6+ Class & Prototype
> **Prasyarat:** [[javascript-dasar|JavaScript Dasar]]
> Fokus modul pembelajaran ini: **mental model prototype → constructor function → prototype chain → ES6 class → inheritance (extends & super) → encapsulation (private fields #) → static fields/methods → error handling & custom errors → iterable protocol → mini project OOP**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami untuk mulai menulis kode berorientasi objek yang bersih dan hemat memori

🟡 Lanjutan
→ pelajari setelah menguasai class, constructor, prototype, dan method dasar

🔴 Advanced / Operasional
→ penting untuk arsitektur aplikasi skala besar, protokol iterator, dan komposisi
```

Mental model arsitektur objek dan pewarisan di JavaScript Engine:

```text
       Source Code Class / Constructor (ES6+)
                         │
                         ▼
             JavaScript Engine Parser
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
    Instance Objek                 Prototype Object
  (State / Properti)             (Shared Method Storage)
         │                               │
         ▼                               ▼
   Tautan Internal                 Rantai Pewarisan
    [[Prototype]]                (Prototype Chain Lookup)
         │                               │
         └───────────────┬───────────────┘
                         │
                         ▼
       Puncak Rantai: Object.prototype ──► null
```

**Hafalan:**

```text
Object      → Gabungan data (property) dan perilaku (method) dalam satu unit
Class       → Cetak biru (blueprint) untuk menciptakan objek-objek sejenis
Prototype   → Tempat penyimpanan method bersama agar hemat alokasi memori
Inheritance → Pewarisan fitur dari parent class ke child class via extends
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan OOP & 4 Pilar Utama](#bagian-1)
2. [Constructor Function](#bagian-2)
3. [Property di Constructor Function](#bagian-3)
4. [Method di Constructor Function & Masalah Duplikasi Memori](#bagian-4)
5. [Parameter di Constructor Function](#bagian-5)
6. [Constructor Inheritance (Parent.call(this))](#bagian-6)
7. [Prototype (prototype & __proto__)](#bagian-7)
8. [Prototype Inheritance & Prototype Chain](#bagian-8)
9. [Class Declaration & Expression (ES6)](#bagian-9)
10. [Constructor di Class](#bagian-10)
11. [Property di Class](#bagian-11)
12. [Method di Class & Prototype Method](#bagian-12)

### 🟡 Lanjutan

13. [Class Inheritance (extends)](#bagian-13)
14. [Super Constructor (super())](#bagian-14)
15. [Super Method (super.method()) & Method Overriding](#bagian-15)
16. [Getter dan Setter di Class](#bagian-16)
17. [Public Class Field](#bagian-17)
18. [Private Class Field (#field) & Enkapsulasi Asli](#bagian-18)
19. [Private Method (#method())](#bagian-19)
20. [Operator instanceof & Type Checking](#bagian-20)
21. [Static Field (static property)](#bagian-21)
22. [Static Method (static method()) & Utility Class](#bagian-22)
23. [Standard Error di JavaScript (Error, TypeError, RangeError)](#bagian-23)
24. [Error Handling (try, catch, finally, throw)](#bagian-24)
25. [Custom Error Class (class CustomError extends Error)](#bagian-25)

### 🔴 Advanced / Operasional

26. [Iterable dan Iterator Protocol ([Symbol.iterator])](#bagian-26)
27. [Object Composition vs Class Inheritance](#bagian-27)

### 🛠️ Referensi & Praktik

28. [Peta Ingatan Cepat](#bagian-28)
29. [Tabel Ringkasan](#bagian-29)
30. [Cheat Code JavaScript OOP 10 Detik](#bagian-30)
31. [Urutan Belajar yang Disarankan](#bagian-31)
32. [Mini Project: Sistem Manajemen Reservasi Kamar & Layanan Hotel OOP](#bagian-32)
33. [Referensi Resmi](#bagian-33)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan OOP & 4 Pilar Utama

#### Konsep

**Object-Oriented Programming (OOP)** adalah paradigma pemrograman yang berpusat pada pembuatan **Object**—sebuah entitas mandiri yang menggabungkan data (**Property / State**) dan fungsi pengolah data tersebut (**Method / Behavior**).

OOP memudahkan kita dalam mengorganisasi kode aplikasi skala besar agar lebih terstruktur, mudah dirawat (*maintainable*), dan dapat digunakan kembali (*reusable*).

##### 4 Pilar Utama OOP:
1. **Encapsulation (Enkapsulasi):** Membungkus data dan method ke dalam satu unit objek serta menyembunyikan detail internal yang sensitif dari akses luar.
2. **Inheritance (Pewarisan):** Kemampuan sebuah class anak (*child class*) untuk mewarisi property dan method dari class induk (*parent class*).
3. **Polymorphism (Polimorfisme):** Kemampuan berbagai objek untuk merespons method dengan nama yang sama dengan cara/perilaku yang berbeda sesuai tipe objeknya.
4. **Abstraction (Abstraksi):** Menyembunyikan kompleksitas implementasi internal dan hanya mengekspos antarmuka (*interface*) penting yang dibutuhkan pengguna.

##### Mental Model OOP di JavaScript:
JavaScript pada intinya adalah bahasa berbasis **Prototype** (*Prototype-based Object Orientation*). Sintaks `class` yang diperkenalkan pada ES6 (2015) adalah *Syntactic Sugar* (pemanis sintaks) di atas sistem prototype untuk membuat penulisan kode OOP terasa familiar seperti di Java, C#, atau PHP.

#### Contoh

```javascript
// Konsep Objek: Menggabungkan Data (Property) dan Perilaku (Method)
const bankAccount = {
    accountHolder: "Budi Santoso",
    balance: 5000000,

    deposit(amount) {
        this.balance += amount;
        return `Setor Rp${amount.toLocaleString("id-ID")} berhasil. Saldo saat ini: Rp${this.balance.toLocaleString("id-ID")}`;
    },

    checkBalance() {
        return `Pemilik: ${this.accountHolder} | Saldo: Rp${this.balance.toLocaleString("id-ID")}`;
    }
};

console.log(bankAccount.checkBalance());
console.log(bankAccount.deposit(1500000));
```

#### Output

```text
Pemilik: Budi Santoso | Saldo: Rp5.000.000
Setor Rp1.500.000 berhasil. Saldo saat ini: Rp6.500.000
```

#### Cara Kerja

```text
                 Konsep Objek dalam Memori
       ┌───────────────────────────────────────────────┐
       │                   Bank Account                │
       ├───────────────────────────────────────────────┤
       │ [Property / Data]                             │
       │ - accountHolder : "Budi Santoso"              │
       │ - balance       : 6500000                     │
       ├───────────────────────────────────────────────┤
       │ [Method / Behavior]                           │
       │ - deposit(amount)                             │
       │ - checkBalance()                              │
       └───────────────────────────────────────────────┘
                               │
                               ▼
        bankAccount.deposit() memanipulasi data internal
```

**Hafalan:**

```text
Object   → Kumpulan data (property) dan fungsi pengolahnya (method)
Property → Variabel di dalam objek yang menyimpan status/informasi
Method   → Fungsi di dalam objek yang mendefinisikan aksi atau perilaku
Class    → Blueprint / cetak biru untuk menciptakan banyak objek sejenis
```

#### Best Practice & Kesalahan Umum

- ✅ Kelompokkan fungsi-fungsi yang bekerja pada sekumpulan data yang sama menjadi satu unit objek/class.
- ❌ Jangan membuat objek dengan properti yang tersebar dan diolah oleh fungsi-fungsi global yang terpisah secara acak (gaya prosedural murni).

---

<a id="bagian-2"></a>

## 2. 🟢 Constructor Function

#### Konsep

Sebelum adanya sintaks `class` di ES6, cara standar untuk membuat *blueprint* objek di JavaScript adalah menggunakan **Constructor Function**.

Karakteristik Constructor Function:
- Ditulis menggunakan kata kunci `function` dengan konvensi nama berawalan **Huruf Kapital (*PascalCase*)** (contoh: `Person`, `Car`, `User`).
- Wajib dipanggil menggunakan kata kunci **`new`** (misal: `new Person()`).
- Saat dipanggil dengan `new`, JavaScript secara otomatis:
  1. Membuat sebuah objek kosong baru `{}`.
  2. Mengikat (*bind*) kata kunci `this` ke objek baru tersebut.
  3. Mengarahkan prototype objek baru ke prototype Constructor Function.
  4. Mengembalikan (*return*) objek baru tersebut secara implisit.

#### Contoh

```javascript
// Mendefinisikan Constructor Function
function User(username, email) {
    // 'this' merujuk pada instance objek baru yang sedang dibuat
    this.username = username;
    this.email = email;
}

// Membuat instance objek menggunakan kata kunci 'new'
const user1 = new User("budisantoso", "budi@example.com");
const user2 = new User("sitirahma", "siti@example.com");

console.log("User 1:", user1);
console.log("User 2:", user2);
console.log("Apakah user1 adalah instance dari User?", user1 instanceof User);
```

#### Output

```text
User 1: User { username: 'budisantoso', email: 'budi@example.com' }
User 2: User { username: 'sitirahma', email: 'siti@example.com' }
Apakah user1 adalah instance dari User? true
```

#### Cara Kerja

```text
            Pemanggilan: new User("budisantoso", "budi@...")
                                │
                                ▼
            1. Buat objek kosong baru: {}
                                │
                                ▼
            2. Ikat 'this' = objek baru
                                │
                                ▼
            3. Isi properti: this.username, this.email
                                │
                                ▼
            4. Kembalikan objek yang sudah terisi
```

**Hafalan:**

```text
function Identifier(parameters) { this.property = value; } → Pola Constructor Function
const instance = new Identifier(arguments)                 → Instansiasi objek baru dari constructor
```

#### Best Practice & Kesalahan Umum

- ✅ Selalu awali nama constructor function dengan huruf besar (*PascalCase*) sebagai penanda bahwa fungsi tersebut wajib dipanggil dengan `new`.
- ❌ Jangan memanggil constructor function tanpa kata kunci `new`, karena tanpa `new`, `this` akan merujuk ke Global Object / undefined (di strict mode) dan tidak akan menghasilkan objek baru.

---

<a id="bagian-3"></a>

## 3. 🟢 Property di Constructor Function

#### Konsep

**Property** di dalam constructor function adalah variabel yang ditempelkan ke objek melalui kata kunci **`this`** (`this.propertyName = value`).

Setiap kali objek baru dibuat dengan kata kunci `new`, objek tersebut akan memiliki salinan (*copy*) independen dari seluruh properti yang didefinisikan di dalam constructor. Nilai properti satu objek tidak akan memengaruhi nilai properti objek lainnya.

#### Contoh

```javascript
function Product(code, name, price, stock = 0) {
    this.code = code;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.createdAt = new Date().toISOString().split("T")[0];
}

const productA = new Product("PRD-01", "Monitor 27 Inch", 3500000, 10);
const productB = new Product("PRD-02", "Keyboard Wireless", 450000, 25);

// Mengubah properti objek A
productA.stock -= 2; // Terjual 2 unit

console.log("Stok Produk A:", productA.stock); // 8
console.log("Stok Produk B:", productB.stock); // 25 (Tetap tidak terpengaruh!)
```

#### Output

```text
Stok Produk A: 8
Stok Produk B: 25
```

#### Cara Kerja

```text
       new Product("PRD-01", ...)           new Product("PRD-02", ...)
                  │                                    │
                  ▼                                    ▼
       Memori Objek A (PRD-01)              Memori Objek B (PRD-02)
       ┌─────────────────────┐              ┌─────────────────────┐
       │ stock : 8           │              │ stock : 25          │
       └─────────────────────┘              └─────────────────────┘
              (Properti terisolasi penuh satu sama lain)
```

**Hafalan:**

```text
this.propertyName = value → Menetapkan nilai properti unik pada instance objek
```

#### Best Practice & Kesalahan Umum

- ✅ Berikan nilai default pada parameter constructor untuk menghindari properti bernilai `undefined` jika argumen tidak lengkap.
- ❌ Hindari menaruh data yang seharusnya dipakai bersama (*shared data*) langsung di dalam `this` constructor jika data tersebut tidak pernah berubah nilainya (gunakan prototype atau static).

---

<a id="bagian-4"></a>

## 4. 🟢 Method di Constructor Function & Masalah Duplikasi Memori

#### Konsep

Kita dapat menambahkan **Method** (fungsi aksi) langsung ke dalam constructor function dengan menempelkannya pada `this` (`this.methodName = function() { ... }`).

##### Masalah Duplikasi Memori:
Jika sebuah method didefinisikan langsung di dalam body constructor function menggunakan `this.methodName`, maka **setiap kali objek baru di-instansiasi (`new`), fungsi method tersebut akan diduplikasi dan dialokasikan ulang di memori**.

Jika kita membuat 10.000 objek, maka akan ada 10.000 salinan fungsi yang persis sama di dalam RAM. Inilah alasan mengapa penempatan method dianjurkan menggunakan **Prototype**.

#### Contoh

```javascript
function Driver(name, vehicle) {
    this.name = name;
    this.vehicle = vehicle;

    // Method di dalam constructor (Tiap instance menduplikasi fungsi ini di memori)
    this.drive = function() {
        return `${this.name} sedang mengemudikan ${this.vehicle}`;
    };
}

const driver1 = new Driver("Andi", "Truk");
const driver2 = new Driver("Bambang", "Bus");

console.log(driver1.drive());
console.log(driver2.drive());

// Bukti Duplikasi Memori:
// Kedua fungsi memiliki logika yang sama tetapi referensi memorinya BERBEDA!
console.log("Apakah referensi method sama?", driver1.drive === driver2.drive); // false
```

#### Output

```text
Andi sedang mengemudikan Truk
Bambang sedang mengemudikan Bus
Apakah referensi method sama? false
```

#### Cara Kerja

```text
           driver1                               driver2
     ┌─────────────────┐                   ┌─────────────────┐
     │ name: "Andi"    │                   │ name: "Bambang" │
     │ drive: Function ├─► Alokasi RAM 1   │ drive: Function ├─► Alokasi RAM 2
     └─────────────────┘                   └─────────────────┘
                 (Terjadi pemborosan alokasi memori fungsi)
```

**Hafalan:**

```text
this.methodName = function() { ... } → Menempelkan method langsung pada setiap instance
instance1.method === instance2.method → Bernilai false (menandakan fungsi diduplikasi di memori)
```

#### Best Practice & Kesalahan Umum

- ✅ Ketahui bahwa mendefinisikan method langsung di dalam constructor hanya tepat jika method tersebut membutuhkan akses ke variabel lokal tertutup (*closure*).
- ❌ Untuk method umum yang logikanya identik pada seluruh instance, gunakan mekanisme **Prototype** agar memori digunakan bersama (*shared memory*).

---

<a id="bagian-5"></a>

## 5. 🟢 Parameter di Constructor Function

#### Konsep

Constructor function dapat menerima sejumlah **Parameter** layaknya fungsi biasa di JavaScript. Parameter ini digunakan untuk menginisialisasi nilai awal properti saat objek diciptakan.

Teknik Penanganan Parameter:
1. **Positional Arguments:** Menerima argumen berdasarkan urutan posisi (`new User(name, email, age)`).
2. **Options Object (Destructuring):** Menerima satu objek konfigurasi (`new User({ name, email, age })`). Sangat direkomendasikan jika parameter berjumlah banyak (lebih dari 3) atau memiliki banyak nilai opsional.

#### Contoh

```javascript
// 1. Menggunakan Positional Parameters standar
function Course(title, instructor, durationHours = 10) {
    this.title = title;
    this.instructor = instructor;
    this.durationHours = durationHours;
}

const jsCourse = new Course("Mastering JS OOP", "Fajar Pratama", 25);
console.log("Course 1:", jsCourse);

// 2. Menggunakan Options Object Pattern (Destructuring) - Best Practice untuk parameter banyak
function ServerConfig({ host = "localhost", port = 8080, ssl = false, timeout = 3000 } = {}) {
    this.host = host;
    this.port = port;
    this.ssl = ssl;
    this.timeout = timeout;
}

const prodServer = new ServerConfig({
    host: "api.production.com",
    port: 443,
    ssl: true
});

console.log("Server Config:", prodServer);
```

#### Output

```text
Course 1: Course { title: 'Mastering JS OOP', instructor: 'Fajar Pratama', durationHours: 25 }
Server Config: ServerConfig {
  host: 'api.production.com',
  port: 443,
  ssl: true,
  timeout: 3000
}
```

#### Cara Kerja

```text
        new ServerConfig({ host: "api...", ssl: true })
                            │
                            ▼
        Destructuring Parameter dengan Default Value
                            │
                            ▼
        Hasil Objek terinisialisasi rapi tanpa bingung urutan parameter
```

**Hafalan:**

```text
function Identifier({ param1 = def1, param2 = def2 } = {}) → Pola inisialisasi object options
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan pola *Options Object* jika constructor memiliki lebih dari 3 parameter agar pemanggil tidak perlu mengingat urutan posisi argumen.
- ❌ Jangan membuat constructor dengan belasan parameter bertipe sama berurutan tanpa nama objek pembungkus.

---

<a id="bagian-6"></a>

## 6. 🟢 Constructor Inheritance (Parent.call(this))

#### Konsep

Sebelum adanya kata kunci `class` dan `extends`, pewarisan antar constructor function dilakukan dengan meminjam constructor induk menggunakan method **`Parent.call(this, ...arguments)`**.

Cara Kerja:
- Method `.call()` mengeksekusi constructor induk (`Parent`) dengan memaksa kata kunci `this` di dalamnya mengarah ke instance objek milik anak (`Child`).
- Dengan demikian, semua inisialisasi properti yang ada di `Parent` akan otomatis diterapkan ke objek `Child`.

#### Contoh

```javascript
// 1. Constructor Induk (Parent)
function Employee(name, baseSalary) {
    this.name = name;
    this.baseSalary = baseSalary;
}

// 2. Constructor Anak (Child)
function Manager(name, baseSalary, department, allowance) {
    // Meminjam constructor Employee untuk inisialisasi name & baseSalary
    Employee.call(this, name, baseSalary);

    // Properti khusus milik Manager
    this.department = department;
    this.allowance = allowance;
}

const techManager = new Manager("Hendra", 15000000, "Engineering", 5000000);

console.log("Manager Name:", techManager.name);
console.log("Base Salary:", techManager.baseSalary);
console.log("Department:", techManager.department);
console.log("Allowance:", techManager.allowance);
console.log("Objek Manager:", techManager);
```

#### Output

```text
Manager Name: Hendra
Base Salary: 15000000
Department: Engineering
Allowance: 5000000
Objek Manager: Manager {
  name: 'Hendra',
  baseSalary: 15000000,
  department: 'Engineering',
  allowance: 5000000
}
```

#### Cara Kerja

```text
         new Manager("Hendra", 15000000, "Engineering", 5000000)
                              │
                              ▼
         Eksekusi: Employee.call(this, "Hendra", 15000000)
                              │
                              ▼
         Menempelkan this.name dan this.baseSalary ke objek Manager
                              │
                              ▼
         Menempelkan this.department dan this.allowance
```

**Hafalan:**

```text
ParentConstructor.call(this, ...args) → Meminjam constructor parent untuk mengisi properti
```

#### Best Practice & Kesalahan Umum

- ✅ Pahami mekanisme `Parent.call(this)` untuk mengerti fondasi bagaimana cara kerja kata kunci modern `super()` di balik layar.
- ❌ Ingat bahwa `Parent.call(this)` hanya mewarisi **properti instance**, belum mewarisi method yang ada di `Parent.prototype` (memerlukan prototype chaining).

---

<a id="bagian-7"></a>

## 7. 🟢 Prototype (prototype & __proto__)

#### Konsep

Setiap fungsi di JavaScript secara otomatis memiliki properti khusus bernama **`prototype`**. Objek prototype ini berfungsi sebagai **wadah bersama (*shared storage*)** untuk seluruh method dan data yang ingin diwariskan ke semua instance objek yang diciptakan dari fungsi tersebut.

Karakteristik Prototype:
- Method yang ditaruh di `Constructor.prototype` **hanya dialokasikan 1 kali di memori**, berapa pun banyaknya objek yang di-instansiasi.
- Setiap objek hasil `new Constructor()` memiliki tautan internal internal (**`[[Prototype]]`** atau dapat diakses via **`__proto__`**) yang mengarah ke `Constructor.prototype`.
- **Property Lookup:** Ketika kita memanggil `instance.methodName()`, JavaScript pertama-tama mencari di objek itu sendiri. Jika tidak ditemukan, JavaScript otomatis mencari ke atas melalui tautan prototype.

#### Contoh

```javascript
function Student(id, name) {
    this.id = id;
    this.name = name;
}

// Menempelkan method ke dalam Prototype (Hemat Memori & Berbagi Fungsi)
Student.prototype.study = function(subject) {
    return `Mahasiswa ${this.name} (NIM: ${this.id}) sedang belajar ${subject}`;
};

Student.prototype.university = "Universitas Terbuka";

const student1 = new Student("101", "Ahmad");
const student2 = new Student("102", "Budi");

console.log(student1.study("Struktur Data"));
console.log(student2.study("Basis Data"));

// Bukti Shared Memory: Kedua instance merujuk ke method yang sama persis!
console.log("Apakah method identik?", student1.study === student2.study); // true

// Membaca prototype tautan
console.log("Prototype check:", Object.getPrototypeOf(student1) === Student.prototype); // true
```

#### Output

```text
Mahasiswa Ahmad (NIM: 101) sedang belajar Struktur Data
Mahasiswa Budi (NIM: 102) sedang belajar Basis Data
Apakah method identik? true
Prototype check: true
```

#### Cara Kerja

```text
          student1.study("Struktur Data")
                       │
                       ▼
          Apakah student1 memiliki properti 'study' sendiri?
                       │
         ┌─────────────┴─────────────┐
       [Ada]                       [Tidak]
         │                           │
         ▼                           ▼
    Eksekusi               Cari di Student.prototype
                                     │
                                     ▼
                               Method DITEMUKAN & Dieksekusi
```

**Hafalan:**

```text
Constructor.prototype.methodName = function() { ... } → Menambahkan method shared ke prototype
Object.getPrototypeOf(instance)                       → Cara standar membaca prototype dari suatu objek
```

#### Best Practice & Kesalahan Umum

- ✅ Selalu letakkan method umum di `prototype` alih-alih di dalam body constructor function.
- ❌ Gunakan `Object.getPrototypeOf(obj)` alih-alih properti non-standar `obj.__proto__` untuk membaca prototype objek.

---

<a id="bagian-8"></a>

## 8. 🟢 Prototype Inheritance & Prototype Chain

#### Konsep

**Prototype Chain** (Rantai Prototype) adalah mekanisme bagaimana objek di JavaScript saling mewarisi fitur satu sama lain.

Jika sebuah method/properti dipanggil pada suatu objek:
1. Engine mencari di objek itu sendiri (*own property*).
2. Jika tidak ada, mencari di prototype induknya (`Child.prototype`).
3. Jika belum ada, mencari di prototype kakeknya (`Parent.prototype`).
4. Berlanjut terus ke atas sampai mencapai puncak rantai yaitu **`Object.prototype`**.
5. Jika di `Object.prototype` tetap tidak ditemukan, barulah mengembalikan **`undefined`** (atau error jika dipanggil sebagai fungsi).

Untuk menghubungkan prototype `Child` agar mewarisi `Parent.prototype`, digunakan **`Object.setPrototypeOf(Child.prototype, Parent.prototype)`** atau `Object.create()`.

#### Contoh

```javascript
// 1. Parent Constructor & Prototype
function Animal(name) {
    this.name = name;
}

Animal.prototype.eat = function() {
    return `${this.name} sedang makan.`;
};

// 2. Child Constructor
function Dog(name, breed) {
    Animal.call(this, name); // Constructor inheritance
    this.breed = breed;
}

// 3. Menghubungkan Rantai Prototype (Prototype Inheritance)
Object.setPrototypeOf(Dog.prototype, Animal.prototype);

// Menambahkan method khusus di Dog.prototype
Dog.prototype.bark = function() {
    return `${this.name} (${this.breed}) menggonggong: Guk Guk!`;
};

const myDog = new Dog("Milo", "Golden Retriever");

console.log(myDog.bark()); // Dari Dog.prototype
console.log(myDog.eat());  // Mewarisi dari Animal.prototype
console.log(myDog.toString()); // Mewarisi dari puncak Object.prototype
```

#### Output

```text
Milo (Golden Retriever) menggonggong: Guk Guk!
Milo sedang makan.
[object Object]
```

#### Cara Kerja

```text
                            Rantai Prototype (Lookup)
                               myDog.eat()
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │ 1. myDog (Instance) -> Tidak ada 'eat'                  │
       └────────────────────────────┬────────────────────────────┘
                                    │ __proto__
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │ 2. Dog.prototype    -> Tidak ada 'eat'                  │
       └────────────────────────────┬────────────────────────────┘
                                    │ __proto__
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │ 3. Animal.prototype -> ADA! (Eksekusi Method 'eat')     │
       └────────────────────────────┬────────────────────────────┘
                                    │ __proto__
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │ 4. Object.prototype -> (Puncak Objek Bawaan JS)         │
       └────────────────────────────┬────────────────────────────┘
                                    │ __proto__
                                    ▼
                                  null
```

**Hafalan:**

```text
Object.setPrototypeOf(Child.prototype, Parent.prototype) → Menyambungkan rantai pewarisan prototype
Object.prototype                                         → Akar teratas dari semua objek di JavaScript
```

#### Best Practice & Kesalahan Umum

- ✅ Pahami alur rantai prototype untuk memahami cara kerja inheritance di JavaScript.
- ❌ Jangan pernah memodifikasi prototype bawaan global seperti `Object.prototype` atau `Array.prototype` (*Monkey Patching*), karena dapat merusak library lain dan menimbulkan celah keamanan.

---

<a id="bagian-9"></a>

## 9. 🟢 Class Declaration & Expression (ES6)

#### Konsep

Mulai standar ECMAScript 2015 (ES6), JavaScript memperkenalkan kata kunci **`class`**. Sintaks ini menyediakan cara yang jauh lebih bersih, modern, dan ekspresif untuk membangun aplikasi berorientasi objek tanpa harus memanipulasi `prototype` secara manual.

Karakteristik Penting `class` di JavaScript:
- **Syntactic Sugar:** Di balik layar, `class` tetap menggunakan sistem *prototype*.
- **No Hoisting:** Berbeda dengan function declaration, `class` **TIDAK di-hoist**. Anda tidak bisa membuat instance class sebelum baris deklarasinya.
- **Strict Mode Otomatis:** Seluruh kode di dalam body `class` secara otomatis dieksekusi dalam mode ketat (*Strict Mode*).
- Dapat dideklarasikan sebagai **Class Declaration** (`class Name {}`) atau **Class Expression** (`const Name = class {}`).

#### Contoh

```javascript
// 1. Class Declaration
class Member {
    // Body class
    sayWelcome() {
        console.log("Selamat datang di platform komunitas!");
    }
}

const member1 = new Member();
member1.sayWelcome();

// 2. Class Expression (Dapat berupa anonymous atau named)
const PaymentGateway = class {
    process(amount) {
        return `Memproses transaksi senilai Rp${amount.toLocaleString("id-ID")}`;
    }
};

const gateway = new PaymentGateway();
console.log(gateway.process(250000));

// Bukti bahwa class adalah function prototype di balik layar
console.log("typeof Member:", typeof Member); // "function"
```

#### Output

```text
Selamat datang di platform komunitas!
Memproses transaksi senilai Rp250.000
typeof Member: function
```

#### Cara Kerja

```text
          class Member { sayWelcome() {} }
                         │
                         ▼
          Engine menerjemahkan secara internal menjadi:
          - Function constructor 'Member'
          - Member.prototype.sayWelcome = function() {}
          - Menambahkan proteksi Strict Mode & No-Hoisting
```

**Hafalan:**

```text
class ClassName { ... }         → Mendeklarasikan class blueprint modern (ES6)
const ClassName = class { ... } → Mendeklarasikan class expression ke dalam variabel
```

#### Best Practice & Kesalahan Umum

- ✅ Selalu gunakan sintaks modern `class` untuk seluruh pengembangan aplikasi baru alih-alih constructor function jadul.
- ❌ Jangan mencoba memanggil class tanpa kata kunci `new`, karena engine JavaScript akan langsung melempar `TypeError: Class constructor cannot be invoked without 'new'`.

---

<a id="bagian-10"></a>

## 10. 🟢 Constructor di Class

#### Konsep

Method **`constructor`** adalah method khusus di dalam sebuah `class` yang otomatis dieksekusi pertama kali setiap kali objek baru dibuat melalui kata kunci `new`.

Karakteristik Method Constructor:
- Hanya boleh ada **tepat satu** method bernama `constructor` di dalam sebuah class.
- Digunakan untuk menerima parameter inisialisasi dan menyiapkan nilai awal properti objek (`this.propertyName = value`).
- Jika kita tidak menuliskan method `constructor`, JavaScript akan otomatis menyediakan constructor kosong default (`constructor() {}`).

#### Contoh

```javascript
class Laptop {
    constructor(brand, processor, ramGb) {
        console.log(`[Constructor]: Menginisialisasi laptop ${brand}...`);
        this.brand = brand;
        this.processor = processor;
        this.ramGb = ramGb;
        this.isPowerOn = false;
    }

    turnOn() {
        this.isPowerOn = true;
        return `${this.brand} (${this.processor}, ${this.ramGb}GB RAM) berhasil dinyalakan.`;
    }
}

// Saat 'new' dipanggil, method constructor langsung dijalankan
const myLaptop = new Laptop("ThinkPad", "Intel Core i7", 16);

console.log("Status Daya:", myLaptop.isPowerOn);
console.log(myLaptop.turnOn());
console.log("Status Daya Sekarang:", myLaptop.isPowerOn);
```

#### Output

```text
[Constructor]: Menginisialisasi laptop ThinkPad...
Status Daya: false
ThinkPad (Intel Core i7, 16GB RAM) berhasil dinyalakan.
Status Daya Sekarang: true
```

#### Cara Kerja

```text
            new Laptop("ThinkPad", "Intel Core i7", 16)
                                │
                                ▼
            Engine membuat instance objek kosong baru
                                │
                                ▼
            Memanggil method constructor(brand, proc, ram)
                                │
                                ▼
            Properti this.brand, this.processor terpasang
                                │
                                ▼
            Mengembalikan instance objek utuh ke variabel 'myLaptop'
```

**Hafalan:**

```text
constructor(...parameters) { ... } → Method inisialisasi wajib yang otomatis dipanggil saat 'new'
```

#### Best Practice & Kesalahan Umum

- ✅ Lakukan validasi tipe data awal di dalam constructor untuk menjamin integritas data objek sejak awal diciptakan.
- ❌ Jangan pernah menulis lebih dari satu method `constructor` dalam satu class yang sama karena akan menghasilkan `SyntaxError`.

---

<a id="bagian-11"></a>

## 11. 🟢 Property di Class

#### Konsep

Property pada class merepresentasikan data atau status (*state*) dari suatu instance objek.

Di JavaScript modern, terdapat dua cara mendeklarasikan properti:
1. **Di Dalam Constructor (`this.prop = val`):** Cara paling umum saat nilai properti bergantung pada argumen yang dikirim saat instansiasi.
2. **Public Field Declaration (Di Luar Constructor):** Mendeklarasikan properti langsung di body class (didukung sejak ES2022). Sangat bersih untuk nilai default yang tidak memerlukan parameter constructor.

#### Contoh

```javascript
class Article {
    // Public Field dengan nilai default langsung di body class
    viewCount = 0;
    isPublished = false;
    publishedAt = null;

    constructor(title, author) {
        // Properti yang diinisialisasi dari parameter
        this.title = title;
        this.author = author;
    }

    publish() {
        this.isPublished = true;
        this.publishedAt = new Date().toISOString().split("T")[0];
    }

    read() {
        this.viewCount++;
        return `Membaca "${this.title}" oleh ${this.author}. Total tayangan: ${this.viewCount}`;
    }
}

const article1 = new Article("Panduan Lengkap JavaScript OOP", "Rian Hidayat");

console.log("Status Publikasi Awal:", article1.isPublished); // false
article1.publish();
console.log("Status Publikasi Setelah Publish:", article1.isPublished, "Tanggal:", article1.publishedAt);

console.log(article1.read());
console.log(article1.read());
```

#### Output

```text
Status Publikasi Awal: false
Status Publikasi Setelah Publish: true Tanggal: 2026-08-29
Membaca "Panduan Lengkap JavaScript OOP" oleh Rian Hidayat. Total tayangan: 1
Membaca "Panduan Lengkap JavaScript OOP" oleh Rian Hidayat. Total tayangan: 2
```

#### Cara Kerja

```text
       Instansiasi: new Article("Panduan...", "Rian...")
                            │
                            ▼
       1. Inisialisasi Field Default: viewCount = 0, isPublished = false
                            │
                            ▼
       2. Jalankan Constructor: this.title = ..., this.author = ...
```

**Hafalan:**

```text
propertyName = defaultValue; → Public field langsung di body class
this.propertyName = value;   → Properti yang didefinisikan di dalam method/constructor
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan deklarasi *public field* untuk properti yang memiliki nilai awal tetap agar struktur data class terlihat jelas di bagian atas class body.
- ❌ Jangan biarkan properti dibiarkan tanpa inisialisasi awal jika berpotensi menyebabkan nilai `undefined` saat diakses method.

---

<a id="bagian-12"></a>

## 12. 🟢 Method di Class & Prototype Method

#### Konsep

Method di dalam class adalah fungsi yang mendefinisikan aksi atau kemampuan yang dapat dilakukan oleh objek tersebut.

Karakteristik Method di Class:
- Method yang ditulis di dalam body class secara otomatis ditempatkan pada **`Class.prototype`**.
- Dengan demikian, method tersebut otomatis dibagikan (*shared*) ke seluruh instance objek tanpa pemborosan memori.
- Di dalam method, kata kunci **`this`** secara otomatis merujuk ke instance objek yang sedang memanggil method tersebut.
- Penulisan method menggunakan format ringkas (*method shorthand*), tanpa kata kunci `function`.

#### Contoh

```javascript
class BankCustomer {
    constructor(accountNumber, holderName, balance = 0) {
        this.accountNumber = accountNumber;
        this.holderName = holderName;
        this.balance = balance;
    }

    // Method prototype yang di-share ke semua instance
    deposit(amount) {
        if (amount <= 0) {
            return "Jumlah setoran harus lebih dari Rp0!";
        }
        this.balance += amount;
        return `Setor Rp${amount.toLocaleString("id-ID")} berhasil. Saldo: Rp${this.balance.toLocaleString("id-ID")}`;
    }

    withdraw(amount) {
        if (amount > this.balance) {
            return `Penarikan gagal! Saldo tidak cukup (Sisa: Rp${this.balance.toLocaleString("id-ID")})`;
        }
        this.balance -= amount;
        return `Tarik tunai Rp${amount.toLocaleString("id-ID")} berhasil. Sisa saldo: Rp${this.balance.toLocaleString("id-ID")}`;
    }
}

const customerA = new BankCustomer("ACC-001", "Dewi Sartika", 1000000);
const customerB = new BankCustomer("ACC-002", "Budi Gunawan", 500000);

console.log(customerA.deposit(500000));
console.log(customerA.withdraw(300000));
console.log(customerB.withdraw(700000)); // Gagal

// Bukti bahwa method otomatis berada di prototype
console.log("Apakah method shared di prototype?", customerA.deposit === customerB.deposit); // true
```

#### Output

```text
Setor Rp500.000 berhasil. Saldo: Rp1.500.000
Tarik tunai Rp300.000 berhasil. Sisa saldo: Rp1.200.000
Penarikan gagal! Saldo tidak cukup (Sisa: Rp500.000)
Apakah method shared di prototype? true
```

#### Cara Kerja

```text
     customerA.deposit(500000)
              │
              ▼
     Method 'deposit' dicari di BankCustomer.prototype
              │
              ▼
     'this' diarahkan ke customerA
              │
              ▼
     this.balance milik customerA diperbarui
```

**Hafalan:**

```text
methodName(parameters) { ... } → Mendefinisikan prototype method di dalam class
this.propertyName               → Mengakses data milik instance pemanggil saat ini
```

#### Best Practice & Kesalahan Umum

- ✅ Pisahkan logika operasi data yang kompleks menjadi method-method kecil yang fokus (*Single Responsibility*).
- ❌ Jangan menambahkan tanda koma `,` di antara definisi method di dalam class (berbeda dengan object literal biasa yang memerlukan koma).

---

<a id="bagian-13"></a>

## 13. 🟡 Class Inheritance (extends)

#### Konsep

**Class Inheritance** (Pewarisan Kelas) adalah konsep di mana sebuah class turunan (**Child Class / Subclass**) dapat mewarisi seluruh properti dan method dari class induk (**Parent Class / Superclass**) menggunakan kata kunci **`extends`**.

Manfaat Utama Inheritance:
- **Code Reusability:** Menghindari penulisan kode berulang dengan menaruh properti dan logika umum di class parent.
- **Hierarki Model:** Membangun relasi *is-a* (misal: *Manager is an Employee*, *ElectricCar is a Vehicle*).

#### Contoh

```javascript
// Parent Class (Superclass)
class Vehicle {
    constructor(brand, year) {
        this.brand = brand;
        this.year = year;
    }

    startEngine() {
        return `Mesin ${this.brand} (${this.year}) berhasil dihidupkan.`;
    }
}

// Child Class (Subclass) mewarisi Vehicle
class ElectricCar extends Vehicle {
    batteryCapacity = "75 kWh";

    chargeBattery() {
        return `Mengisi daya baterai ${this.brand} (${this.batteryCapacity})...`;
    }
}

const myEV = new ElectricCar("Hyundai Ioniq", 2024);

console.log(myEV.startEngine());  // Mewarisi dari class Vehicle
console.log(myEV.chargeBattery()); // Milik class ElectricCar
console.log("Kapasitas Baterai:", myEV.batteryCapacity);
```

#### Output

```text
Mesin Hyundai Ioniq (2024) berhasil dihidupkan.
Mengisi daya baterai Hyundai Ioniq (75 kWh)...
Kapasitas Baterai: 75 kWh
```

#### Cara Kerja

```text
         myEV.startEngine()
                 │
                 ▼
         Cari di ElectricCar.prototype (Tidak Ada)
                 │
                 ▼
         Cari di Vehicle.prototype (ADA!)
                 │
                 ▼
         Eksekusi method startEngine()
```

**Hafalan:**

```text
class SubClass extends SuperClass { ... } → Mewarisi seluruh method dan properti dari SuperClass
```

#### Best Practice & Kesalahan Umum

- ✅ Buat parent class untuk hal-hal yang bersifat umum dan abstrak, lalu gunakan subclass untuk hal-hal yang spesifik.
- ❌ Jangan membuat pohon pewarisan yang terlalu dalam bertingkat-tingkat (misal lebih dari 3-4 tingkat) karena membuat alur kode sulit dilacak.

---

<a id="bagian-14"></a>

## 14. 🟡 Super Constructor (super())

#### Konsep

Ketika sebuah subclass memiliki method `constructor`-nya sendiri, kita **WAJIB memanggil `super()`** di baris pertama sebelum mengakses kata kunci `this`.

Fungsi `super()`:
- Memanggil method constructor milik parent class untuk menginisialisasi properti warisan.
- Menyiapkan konteks `this` untuk subclass. Jika `super()` tidak dipanggil, engine JavaScript akan melempar `ReferenceError: Must call super constructor in derived class before accessing 'this'`.

#### Contoh

```javascript
// Parent Class
class Person {
    constructor(fullName, age) {
        this.fullName = fullName;
        this.age = age;
    }

    getDetails() {
        return `Nama: ${this.fullName}, Usia: ${this.age} tahun`;
    }
}

// Child Class
class Teacher extends Person {
    constructor(fullName, age, subject, certificationId) {
        // 1. Wajib memanggil super() untuk inisialisasi fullName & age di class Person
        super(fullName, age);

        // 2. Menginisialisasi properti spesifik milik Teacher
        this.subject = subject;
        this.certificationId = certificationId;
    }

    teach() {
        return `Guru ${this.fullName} sedang mengajar mata pelajaran ${this.subject}`;
    }
}

const teacher1 = new Teacher("Dra. Siti Aminah", 45, "Fisika Modern", "CERT-8899");

console.log(teacher1.getDetails()); // Dari Parent
console.log(teacher1.teach());      // Dari Child
```

#### Output

```text
Nama: Dra. Siti Aminah, Usia: 45 tahun
Guru Dra. Siti Aminah sedang mengajar mata pelajaran Fisika Modern
```

#### Cara Kerja

```text
     new Teacher("Dra. Siti Aminah", 45, "Fisika Modern", "CERT-8899")
                                │
                                ▼
     1. Masuk ke constructor Teacher
                                │
                                ▼
     2. Eksekusi super(fullName, age) -> Jalankan constructor Person
                                │
                                ▼
     3. 'this' aktif dan properti Person terpasang
                                │
                                ▼
     4. Pasang this.subject dan this.certificationId
```

**Hafalan:**

```text
super(...arguments) → Memanggil constructor parent class (wajib sebelum mengakses 'this')
```

#### Best Practice & Kesalahan Umum

- ✅ Selalu letakkan panggilan `super()` di baris pertama constructor subclass.
- ❌ Jangan pernah mencoba membaca atau menulis properti `this.something` sebelum memanggil `super()`.

---

<a id="bagian-15"></a>

## 15. 🟡 Super Method (super.method()) & Method Overriding

#### Konsep

1. **Method Overriding (Penimpaan Method):**
   Subclass dapat mendefinisikan ulang method yang namanya sama persis dengan yang ada di parent class untuk memberikan perilaku baru yang lebih spesifik.
2. **Super Method (`super.methodName()`):**
   Subclass dapat memanggil method asli milik parent class dari dalam method yang di-override menggunakan sintaks `super.methodName()`, sehingga kita bisa memperkaya (*extend*) perilaku parent tanpa harus menulis ulang kodenya dari nol.

#### Contoh

```javascript
class NotificationService {
    send(recipient, message) {
        return `[Standard Log]: Mengirim pesan ke "${recipient}": "${message}"`;
    }
}

class EncryptedEmailService extends NotificationService {
    // Method Overriding: Menimpa perilaku method send()
    send(recipient, message) {
        // Enkripsi pesan sederhana
        const encryptedMessage = Buffer.from(message).toString("base64");
        
        // Memanggil implementasi dasar parent class via super.send()
        const standardResult = super.send(recipient, encryptedMessage);
        
        return `${standardResult} (Status: Terenkripsi End-to-End)`;
    }
}

const plainService = new NotificationService();
const secureService = new EncryptedEmailService();

console.log(plainService.send("user@mail.com", "Halo Dunia"));
console.log(secureService.send("ceo@corp.com", "Laporan Rahasia Perusahaan"));
```

#### Output

```text
[Standard Log]: Mengirim pesan ke "user@mail.com": "Halo Dunia"
[Standard Log]: Mengirim pesan ke "ceo@corp.com": "TGFwb3JhbiBSYWhhc2lhIFBlcnVzYWhhYW4=" (Status: Terenkripsi End-to-End)
```

#### Cara Kerja

```text
         secureService.send(...)
                   │
                   ▼
         Masuk ke EncryptedEmailService.prototype.send
                   │
                   ▼
         Enkripsi teks ke Base64
                   │
                   ▼
         super.send() -> Panggil NotificationService.prototype.send
                   │
                   ▼
         Gabungkan hasil dan kembalikan output
```

**Hafalan:**

```text
super.methodName(...args) → Memanggil method milik parent class dari dalam subclass
```

#### Best Practice & Kesalahan Umum

- ✅ Manfaatkan `super.method()` saat ingin memperkaya fitur parent tanpa menghilangkan alur kerja validasi atau logging yang sudah ada di parent.
- ❌ Hati-hati saat meng-override method; pastikan tipe nilai kembalian (*return type*) tetap konsisten dengan kontrak parent agar tidak merusak kode pemanggil (*Liskov Substitution Principle*).

---

<a id="bagian-16"></a>

## 16. 🟡 Getter dan Setter di Class

#### Konsep

Kata kunci **`get`** dan **`set`** pada class memungkinkan kita mendefinisikan method yang bertindak seolah-olah sebagai properti biasa (*Accessor Properties*).

Manfaat Getter & Setter di Class:
- **Getter (`get propertyName()`):** Menghitung nilai dinamis (*computed property*) saat properti dibaca.
- **Setter (`set propertyName(value)`):** Memvalidasi atau memformat data sebelum nilai disimpan ke dalam properti internal.

#### Contoh

```javascript
class UserAccount {
    constructor(firstName, lastName, initialBalance = 0) {
        this.firstName = firstName;
        this.lastName = lastName;
        this._balance = initialBalance; // Konvensi underscore: properti internal
    }

    // Getter untuk nama lengkap dinamis
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    // Setter untuk membedah nama lengkap
    set fullName(value) {
        if (!value || typeof value !== "string") {
            console.error("Nama lengkap tidak valid!");
            return;
        }
        const [first, ...rest] = value.trim().split(" ");
        this.firstName = first ?? "";
        this.lastName = rest.join(" ") ?? "";
    }

    // Getter saldo
    get balance() {
        return this._balance;
    }

    // Setter saldo dengan proteksi validasi
    set balance(amount) {
        if (typeof amount !== "number" || amount < 0) {
            console.error("Error: Saldo tidak boleh negatif atau non-angka!");
            return;
        }
        this._balance = amount;
    }
}

const account = new UserAccount("Ahmad", "Dahlan", 2500000);

// Membaca via getter (tanpa tanda kurung ())
console.log("Nama Lengkap:", account.fullName);
console.log("Saldo Awal: Rp", account.balance);

// Mengubah via setter
account.fullName = "Muhammad Ahmad Dahlan";
console.log("First Name:", account.firstName, "| Last Name:", account.lastName);

// Validasi setter
account.balance = -50000; // Ditolak oleh setter
account.balance = 3000000; // Berhasil
console.log("Saldo Akhir: Rp", account.balance);
```

#### Output

```text
Nama Lengkap: Ahmad Dahlan
Saldo Awal: Rp 2500000
First Name: Muhammad | Last Name: Ahmad Dahlan
Error: Saldo tidak boleh negatif atau non-angka!
Saldo Akhir: Rp 3000000
```

#### Cara Kerja

```text
       account.fullName = "Muhammad Ahmad Dahlan"
                          │
                          ▼
       Otomatis memicu: set fullName(value)
                          │
                          ▼
       Validasi & Update properti this.firstName & this.lastName
```

**Hafalan:**

```text
get propertyName() { return value; } → Mendefinisikan properti baca dinamis (tanpa kurung ())
set propertyName(value) { ... }      → Mendefinisikan properti tulis dengan validasi otomatis
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan getter untuk kalkulasi data turunan (seperti usia dari tanggal lahir, total harga dari subtotal+pajak).
- ❌ Jangan menamai getter/setter persis sama dengan nama properti penyimpan internalnya tanpa pembeda (misal `_balance`), karena akan memicu *infinite loop recursion*.

---

<a id="bagian-17"></a>

## 17. 🟡 Public Class Field

#### Konsep

**Public Class Field** (fitur resmi ECMAScript 2022) memungkinkan kita mendeklarasikan properti publik langsung di dalam body class tanpa perlu menuliskannya di dalam constructor.

Karakteristik:
- Properti otomatis menjadi milik setiap instance objek (*instance property*).
- Dapat diakses dan diubah secara bebas dari luar objek.
- Membuat definisi atribut class terlihat sangat rapi dan terdokumentasi di bagian paling atas class.

#### Contoh

```javascript
class SmartDevice {
    // Public Class Fields dengan nilai default
    deviceName = "Generic Device";
    ipAddress = "192.168.1.1";
    isOnline = false;
    firmwareVersion = "v1.0.0";

    constructor(customName, customIp) {
        if (customName) this.deviceName = customName;
        if (customIp) this.ipAddress = customIp;
    }

    connect() {
        this.isOnline = true;
        return `${this.deviceName} (${this.ipAddress}) berhasil terhubung ke jaringan.`;
    }
}

const lamp = new SmartDevice("Smart Lamp Ruang Tamu", "192.168.1.50");
console.log(lamp.connect());
console.log("Status Online:", lamp.isOnline);
console.log("Firmware:", lamp.firmwareVersion);
```

#### Output

```text
Smart Lamp Ruang Tamu (192.168.1.50) berhasil terhubung ke jaringan.
Status Online: true
Firmware: v1.0.0
```

#### Cara Kerja

```text
            class SmartDevice { field = val; }
                         │
                         ▼
            Saat instansiasi objek (new):
            Engine otomatis menempelkan field ke instance objek
```

**Hafalan:**

```text
class ClassName { fieldName = defaultValue; } → Deklarasi public field modern di body class
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan public field untuk mendefinisikan seluruh variabel status default instance agar class mudah dibaca.
- ❌ Jangan gunakan public field jika data tersebut bersifat rahasia dan tidak boleh dimodifikasi langsung dari luar (gunakan *Private Field* `#`).

---

<a id="bagian-18"></a>

## 18. 🟡 Private Class Field (#field) & Enkapsulasi Asli

#### Konsep

Sebelum standar ES2022, JavaScript tidak memiliki fitur enkapsulasi privat murni (developer hanya menggunakan konvensi underscore `_property` yang tetap bisa diakses dari luar).

Mulai ES2022, JavaScript menghadirkan **Private Class Field** dengan menambahkan simbol pagar (**`#`**) di depan nama properti.

Karakteristik Private Field:
- **Hard Privacy:** Benar-benar diisolasi di level engine JavaScript.
- **Tidak Dapat Diakses dari Luar:** Mencoba membaca atau mengubah `obj.#property` dari luar class akan langsung menghasilkan **`SyntaxError`**.
- **Hanya Dapat Diakses dari Dalam Class Pemiliknya:** Method di dalam class tersebut yang boleh membaca dan memutasi nilai `#field`.

#### Contoh

```javascript
class DigitalWallet {
    // 1. Deklarasi Private Fields menggunakan tanda #
    #balance = 0;
    #pinNumber;
    #transactionHistory = [];

    constructor(ownerName, initialPin, initialDeposit = 0) {
        this.ownerName = ownerName; // Public
        this.#pinNumber = initialPin; // Private
        this.#balance = initialDeposit; // Private
    }

    // Public Method untuk transaksi yang aman
    deposit(amount) {
        if (amount <= 0) return "Nominal setoran tidak valid";
        this.#balance += amount;
        this.#transactionHistory.push({ type: "DEPOSIT", amount, date: new Date().toISOString() });
        return `Setor Rp${amount.toLocaleString("id-ID")} berhasil.`;
    }

    withdraw(amount, enteredPin) {
        if (enteredPin !== this.#pinNumber) {
            return "❌ Transaksi Ditolak: PIN Anda salah!";
        }
        if (amount > this.#balance) {
            return "❌ Transaksi Ditolak: Saldo tidak mencukupi!";
        }

        this.#balance -= amount;
        this.#transactionHistory.push({ type: "WITHDRAW", amount, date: new Date().toISOString() });
        return `✅ Tarik Rp${amount.toLocaleString("id-ID")} berhasil.`;
    }

    getBalance(enteredPin) {
        if (enteredPin !== this.#pinNumber) return "PIN Salah!";
        return `Saldo Dompet (${this.ownerName}): Rp${this.#balance.toLocaleString("id-ID")}`;
    }
}

const myWallet = new DigitalWallet("Budi Pratama", "123456", 500000);

console.log(myWallet.deposit(250000));
console.log(myWallet.withdraw(100000, "999999")); // PIN salah
console.log(myWallet.withdraw(100000, "123456")); // PIN benar
console.log(myWallet.getBalance("123456"));

// Mencoba membobol private field dari luar:
// console.log(myWallet.#balance); // SyntaxError: Private field '#balance' must be declared in an enclosing class
```

#### Output

```text
Setor Rp250.000 berhasil.
❌ Transaksi Ditolak: PIN Anda salah!
✅ Tarik Rp100.000 berhasil.
Saldo Dompet (Budi Pratama): Rp650.000
```

#### Cara Kerja

```text
                      myWallet (Instance)
       ┌───────────────────────────────────────────────┐
       │ [Public Interface]                            │
       │ - ownerName                                   │
       │ - deposit(), withdraw(), getBalance()         │
       ├───────────────────────────────────────────────┤
       │ [Enkapsulasi Privat - Terkunci Simbol #]      │
       │ - #balance                                    │
       │ - #pinNumber                                  │
       │ - #transactionHistory                         │
       └───────────────────────────────────────────────┘
              (Akses luar langsung ditolak Engine)
```

**Hafalan:**

```text
#fieldName = initialValue; → Mendeklarasikan private field yang terkunci dari akses luar
this.#fieldName            → Mengakses private field dari dalam method internal class
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan private field (`#field`) untuk data krusial (seperti saldo, token, credential, state mesin internal).
- ❌ Private field wajib dideklarasikan di body class terlebih dahulu sebelum digunakan di dalam constructor.

---

<a id="bagian-19"></a>

## 19. 🟡 Private Method (#method())

#### Konsep

Sama seperti properti privat, kita juga dapat membuat **Private Method** dengan menambahkan simbol pagar (**`#`**) di depan nama method (`#methodName() {}`).

Karakteristik:
- Hanya dapat dipanggil oleh method lain di dalam class yang sama.
- Sangat ideal untuk fungsi-fungsi bantuan internal (*internal helper functions*) atau algoritma validasi sensitif yang tidak boleh diekspos ke publik.

#### Contoh

```javascript
class PaymentProcessor {
    #apiKey = "SECRET_KEY_9988";

    // Public Method
    processPayment(cardNumber, amount) {
        // Memanggil private method internal untuk validasi
        if (!this.#validateCard(cardNumber)) {
            return "Pembayaran Gagal: Nomor kartu tidak valid!";
        }

        const signature = this.#generateSecuritySignature(cardNumber, amount);
        return `Pembayaran Rp${amount.toLocaleString("id-ID")} SUKSES (Signature: ${signature})`;
    }

    // Private Method 1: Validasi
    #validateCard(cardNumber) {
        return typeof cardNumber === "string" && cardNumber.length === 16;
    }

    // Private Method 2: Enkripsi / Signature
    #generateSecuritySignature(cardNumber, amount) {
        return Buffer.from(`${cardNumber}-${amount}-${this.#apiKey}`).toString("hex").slice(0, 12);
    }
}

const payment = new PaymentProcessor();

console.log(payment.processPayment("1234567812345678", 500000));
console.log(payment.processPayment("123", 500000)); // Gagal

// Mencoba memanggil private method dari luar:
// payment.#validateCard("1234"); // SyntaxError!
```

#### Output

```text
Pembayaran Rp500.000 SUKSES (Signature: 313233343536)
Pembayaran Gagal: Nomor kartu tidak valid!
```

#### Cara Kerja

```text
         payment.processPayment(...)
                     │
                     ▼
         this.#validateCard(...)
                     │
                     ▼
         this.#generateSecuritySignature(...)
     (Seluruh method bertanda # terisolasi di dalam class)
```

**Hafalan:**

```text
#methodName(parameters) { ... } → Mendefinisikan method internal privat
this.#methodName(...)           → Memanggil method privat dari dalam class
```

#### Best Practice & Kesalahan Umum

- ✅ Sembunyikan detail komputasi rumit dan logika bisnis internal ke dalam private methods agar API publik class tetap ringkas dan bersih.
- ❌ Subclass tidak dapat mengakses private method milik parent class secara langsung.

---

<a id="bagian-20"></a>

## 20. 🟡 Operator instanceof & Type Checking

#### Konsep

Operator **`instanceof`** digunakan untuk menguji apakah suatu instance objek diciptakan dari suatu **Class** (atau Constructor Function) tertentu, atau apakah class tersebut ada di dalam rantai prototype (*prototype chain*) objek tersebut.

Hasil Operator:
- Mengembalikan **`true`** jika objek merupakan turunan/instance dari class yang diuji.
- Mengembalikan **`false`** jika tidak ada hubungan pewarisan.

Sangat bermanfaat dalam penerapan **Polymorphism** dan pemeriksaan tipe data objek (*runtime type guard*).

#### Contoh

```javascript
class Employee {}
class Manager extends Employee {}
class Director extends Manager {}
class Customer {}

const budi = new Director();
const siti = new Customer();

// 1. Memeriksa hubungan hierarki pewarisan
console.log("Apakah budi instanceof Director?", budi instanceof Director); // true
console.log("Apakah budi instanceof Manager?", budi instanceof Manager);   // true (Mewarisi Manager)
console.log("Apakah budi instanceof Employee?", budi instanceof Employee); // true (Mewarisi Employee)
console.log("Apakah budi instanceof Object?", budi instanceof Object);     // true (Akar semua objek)

console.log("Apakah budi instanceof Customer?", budi instanceof Customer); // false
console.log("Apakah siti instanceof Employee?", siti instanceof Employee); // false

// 2. Penerapan Runtime Type Guard
function calculateBonus(person) {
    if (person instanceof Director) {
        return "Bonus Direktur: Rp50.000.000";
    } else if (person instanceof Manager) {
        return "Bonus Manager: Rp20.000.000";
    } else if (person instanceof Employee) {
        return "Bonus Karyawan: Rp5.000.000";
    } else {
        return "Bukan karyawan resmi!";
    }
}

console.log(calculateBonus(budi));
console.log(calculateBonus(siti));
```

#### Output

```text
Apakah budi instanceof Director? true
Apakah budi instanceof Manager? true
Apakah budi instanceof Employee? true
Apakah budi instanceof Object? true
Apakah budi instanceof Customer? false
Apakah siti instanceof Employee? false
Bonus Direktur: Rp50.000.000
Bukan karyawan resmi!
```

#### Cara Kerja

```text
               Pengecekan: budi instanceof Employee
                               │
                               ▼
               Telusuri Prototype Chain objek 'budi':
               Director.prototype ──► Manager.prototype ──► Employee.prototype
                               │
                               ▼
               Ditemukan kecocokan! -> Mengembalikan true
```

**Hafalan:**

```text
objectInstance instanceof TargetClass → Mengecek apakah objek merupakan instance dari TargetClass
```

#### Best Practice & Kesalahan Umum

- ✅ Urutkan pengecekan `instanceof` dari class yang paling spesifik (turunan terbawah) ke class yang paling umum (induk teratas).
- ❌ Hati-hati bahwa tipe primitif (seperti `"halo" instanceof String`) bernilai `false`; gunakan `typeof` untuk tipe data primitif.

---

<a id="bagian-21"></a>

## 21. 🟡 Static Field (static property)

#### Konsep

Kata kunci **`static`** pada properti class digunakan untuk mendefinisikan field yang **menempel langsung pada Class itu sendiri**, bukan pada instance objek hasil instansiasi (`new`).

Karakteristik Static Field:
- Diakses langsung melalui nama class: **`ClassName.propertyName`**.
- **Shared / Global untuk Class tersebut:** Nilainya hanya ada 1 salinan di memori.
- **TIDAK BISA** diakses melalui instance objek (`instance.propertyName` akan menghasilkan `undefined`).
- Sangat cocok untuk: Menyimpan konstanta konfigurasi, cache global, atau menghitung total instance yang pernah dibuat (*counter*).

#### Contoh

```javascript
class AppConfig {
    // Static Fields (Menempel di class AppConfig)
    static APP_NAME = "Portal Akademik Mahasiswa";
    static VERSION = "3.2.0";
    static MAX_LOGIN_ATTEMPTS = 5;
    
    // Menghitung total objek yang dibuat
    static totalInstancesCreated = 0;

    constructor(instanceName) {
        this.instanceName = instanceName;
        AppConfig.totalInstancesCreated++; // Mengubah static field
    }
}

// 1. Mengakses static field langsung dari nama Class
console.log("Nama Aplikasi:", AppConfig.APP_NAME);
console.log("Versi:", AppConfig.VERSION);
console.log("Batas Login:", AppConfig.MAX_LOGIN_ATTEMPTS);

// 2. Membuat beberapa instance
const session1 = new AppConfig("Sesi Admin");
const session2 = new AppConfig("Sesi Dosen");
const session3 = new AppConfig("Sesi Mahasiswa");

console.log("Total Instance yang Dibuat:", AppConfig.totalInstancesCreated); // 3

// Bukti: Static field tidak ada di instance
console.log("Akses dari instance:", session1.APP_NAME); // undefined
```

#### Output

```text
Nama Aplikasi: Portal Akademik Mahasiswa
Versi: 3.2.0
Batas Login: 5
Total Instance yang Dibuat: 3
Akses dari instance: undefined
```

#### Cara Kerja

```text
      AppConfig (Class Object di Memori)
      ┌─────────────────────────────────┐
      │ APP_NAME: "Portal Akademik"     │ ◄─── AppConfig.APP_NAME
      │ totalInstancesCreated: 3        │
      └─────────────────────────────────┘
                      ▲
         (Terpisah dari instance session1, session2)
```

**Hafalan:**

```text
static fieldName = value; → Mendefinisikan properti milik Class (bukan instance)
ClassName.fieldName       → Mengakses nilai static field
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan static field berhuruf kapital (*UPPER_SNAKE_CASE*) untuk mendefinisikan nilai konstan aplikasi.
- ❌ Jangan mencoba membaca static field menggunakan `this.staticProp` di dalam method instance biasa; gunakan `ClassName.staticProp`.

---

<a id="bagian-22"></a>

## 22. 🟡 Static Method (static method()) & Utility Class

#### Konsep

**Static Method** adalah fungsi aksi yang menempel langsung pada class dan dipanggil langsung melalui nama class: **`ClassName.methodName()`**.

Karakteristik Static Method:
- Tidak membutuhkan pembuatan objek dengan `new` untuk menjalankannya.
- Di dalam static method, kata kunci **`this`** merujuk pada **Class itu sendiri**, bukan instance objek.
- Sangat ideal digunakan untuk:
  1. **Utility Functions:** Fungsi pembantu umum (seperti `Math.max()`, `Object.keys()`, `Date.now()`).
  2. **Factory Method:** Method alternatif untuk menciptakan objek baru dengan konfigurasi khusus.

#### Contoh

```javascript
class MathUtil {
    // Utility static methods
    static add(...numbers) {
        return numbers.reduce((total, num) => total + num, 0);
    }

    static formatRupiah(amount) {
        return "Rp " + amount.toLocaleString("id-ID");
    }
}

// Menggunakan static utility tanpa instansiasi 'new'
const sum = MathUtil.add(10, 20, 30, 40);
console.log("Hasil Jumlah:", sum);
console.log("Format Mata Uang:", MathUtil.formatRupiah(sum));

// Contoh Factory Method:
class User {
    constructor(username, role) {
        this.username = username;
        this.role = role;
    }

    // Static Factory Method untuk membuat admin secara instan
    static createAdmin(username) {
        return new User(username, "SUPER_ADMIN");
    }

    // Static Factory Method untuk membuat tamu
    static createGuest() {
        return new User("guest_" + Math.floor(Math.random() * 1000), "GUEST");
    }
}

const adminUser = User.createAdmin("root_system");
const guestUser = User.createGuest();

console.log("Admin User:", adminUser);
console.log("Guest User:", guestUser);
```

#### Output

```text
Hasil Jumlah: 100
Format Mata Uang: Rp 100.000
Admin User: User { username: 'root_system', role: 'SUPER_ADMIN' }
Guest User: User { username: 'guest_834', role: 'GUEST' }
```

#### Cara Kerja

```text
         MathUtil.formatRupiah(100000)
                     │
                     ▼
         Langsung dieksekusi dari objek MathUtil
         (Tanpa perlu membuat alokasi instance 'new')
```

**Hafalan:**

```text
static methodName(parameters) { ... } → Mendefinisikan method milik Class
ClassName.methodName(...args)         → Memanggil static method secara langsung
```

#### Best Practice & Kesalahan Umum

- ✅ Buat Static Factory Method (seperti `User.fromJSON(json)`) untuk mempermudah instansiasi objek dari berbagai format data masukan.
- ❌ Jangan mencoba mengakses properti instance (`this.instanceProp`) di dalam static method karena static method tidak memiliki konteks instance objek.

---

<a id="bagian-23"></a>

## 23. 🟡 Standard Error di JavaScript (Error, TypeError, RangeError)

#### Konsep

Di JavaScript, ketika terjadi kesalahan pada saat program berjalan (*runtime error*), engine akan menciptakan dan melempar objek **Error**.

Objek Error Bawaan Standar:
- **`Error`:** Class dasar untuk seluruh tipe kesalahan umum.
- **`TypeError`:** Terjadi saat sebuah operasi dilakukan pada tipe data yang salah (misal: memanggil variabel non-fungsi `x()`, membaca properti dari `null`).
- **`RangeError`:** Terjadi saat nilai numerik berada di luar rentang yang diizinkan (misal: `new Array(-1)`).
- **`SyntaxError`:** Terjadi saat penulisan kode melanggar aturan tata bahasa JavaScript.
- **`ReferenceError`:** Terjadi saat mencoba mengakses variabel yang belum didefinisikan.

Struktur Objek Error:
- `error.name`: Nama tipe class error (misal: `"TypeError"`).
- `error.message`: Deskripsi teks penjelasan kesalahan.
- `error.stack`: Jejak tumpukan fungsi (*stack trace*) baris kode tempat terjadinya error.

#### Contoh

```javascript
// 1. Menciptakan objek error standar
const genericError = new Error("Terjadi kesalahan koneksi jaringan!");
console.log("Error Name:", genericError.name);
console.log("Error Message:", genericError.message);

// 2. Melempar error secara sengaja menggunakan kata kunci 'throw'
function validateAge(age) {
    if (typeof age !== "number") {
        throw new TypeError("Usia wajib bertipe Number!");
    }
    if (age < 0 || age > 120) {
        throw new RangeError("Rentang usia harus antara 0 sampai 120 tahun!");
    }
    return `Usia valid: ${age} tahun`;
}

console.log(validateAge(25));

// Contoh melempar error
try {
    validateAge("dua puluh");
} catch (err) {
    console.log(`[${err.name}]: ${err.message}`);
}
```

#### Output

```text
Error Name: Error
Error Message: Terjadi kesalahan koneksi jaringan!
Usia valid: 25 tahun
[TypeError]: Usia wajib bertipe Number!
```

#### Cara Kerja

```text
         throw new TypeError("...")
                     │
                     ▼
         Eksekusi kode normal langsung TERHENTI
                     │
                     ▼
         Mencari blok penanganan (try-catch) terdekat
```

**Hafalan:**

```text
throw new Error(message) → Melempar objek error untuk menghentikan alur jika terjadi kegagalan
error.name               → Mengambil nama kategori error
error.message            → Mengambil isi pesan kesalahan
```

#### Best Practice & Kesalahan Umum

- ✅ Selalu lempar (*throw*) objek turunan `Error` (misal `throw new Error("...")`), jangan melempar string primitif (`throw "error"`) karena string tidak memiliki informasi *stack trace*.
- ❌ Pilih jenis error bawaan yang tepat (`TypeError` untuk kesalahan tipe data, `RangeError` untuk batas angka).

---

<a id="bagian-24"></a>

## 24. 🟡 Error Handling (try, catch, finally, throw)

#### Konsep

**Error Handling** adalah mekanisme untuk mengantisipasi dan menangani kesalahan runtime agar aplikasi tidak berhenti mendadak (*crash*) saat menghadapi kondisi tak terduga.

Blok Penanganan Error:
- **`try { ... }`:** Membungkus kode yang berpotensi menghasilkan kesalahan (*error-prone code*).
- **`catch (error) { ... }`:** Menangkap dan memproses objek error jika ada kegagalan yang dilempar dari dalam blok `try`.
- **`finally { ... }`:** Blok yang **pasti selalu dieksekusi**, baik blok `try` berhasil maupun gagal melempar error. Sangat ideal untuk operasi pembersihan sumber daya (*cleanup*, menutup koneksi, mematikan status loading).

#### Contoh

```javascript
function parseUserJSON(jsonString) {
    console.log("1. Memulai proses parsing data...");

    try {
        const user = JSON.parse(jsonString);

        if (!user.name) {
            throw new Error("Data tidak lengkap: properti 'name' wajib ada!");
        }

        console.log("2. Parsing berhasil:", user.name);
        return user;
    } catch (error) {
        console.error(`3. [Penanganan Error]: ${error.name} -> ${error.message}`);
        return null; // Nilai fallback aman
    } finally {
        console.log("4. [Finally]: Pembersihan memori & proses selesai.\n");
    }
}

// Kasus Sukses
parseUserJSON('{"name": "Budi Santoso", "role": "Admin"}');

// Kasus Error JSON Rusak
parseUserJSON('{ JSON_TIDAK_VALID }');

// Kasus Error Validasi Manual
parseUserJSON('{"role": "Guest"}');
```

#### Output

```text
1. Memulai proses parsing data...
2. Parsing berhasil: Budi Santoso
4. [Finally]: Pembersihan memori & proses selesai.

1. Memulai proses parsing data...
3. [Penanganan Error]: SyntaxError -> Expected property name or '}' in JSON at position 2
4. [Finally]: Pembersihan memori & proses selesai.

1. Memulai proses parsing data...
3. [Penanganan Error]: Error -> Data tidak lengkap: properti 'name' wajib ada!
4. [Finally]: Pembersihan memori & proses selesai.
```

#### Cara Kerja

```text
               Masuk ke Blok try { ... }
                         │
         ┌───────────────┴───────────────┐
   Ada Error?                       Tidak Ada Error?
         │                               │
         ▼                               ▼
   Lompat ke catch(err)            Lanjutkan try sampai selesai
         │                               │
         └───────────────┬───────────────┘
                         │
                         ▼
             Jalankan Blok finally { ... }
```

**Hafalan:**

```text
try { ... } catch (error) { ... } finally { ... } → Struktur lengkap penanganan error runtime
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan blok `finally` untuk mereset state loading pada antarmuka pengguna (UI) atau menutup koneksi file/database.
- ❌ Jangan membuat blok `catch` yang kosong tanpa aksi apa pun (*silent fail*), karena hal itu akan menyembunyikan bug penting yang seharusnya diperbaiki.

---

<a id="bagian-25"></a>

## 25. 🟡 Custom Error Class (class CustomError extends Error)

#### Konsep

Dalam pengembangan aplikasi nyata yang kompleks, sering kali objek `Error` standar bawaan tidak cukup spesifik untuk mendeskripsikan kesalahan domain bisnis (misal: *ValidationError*, *DatabaseConnectionError*, *InsufficientFundsError*).

Kita dapat membuat **Custom Error Class** dengan mewarisi class dasar **`Error`** menggunakan kata kunci `extends Error`.

Keuntungan Custom Error:
- Menambahkan metadata tambahan (seperti kode error HTTP `statusCode`, daftar field yang gagal validasi).
- Membedakan jenis penanganan error di blok `catch` menggunakan operator `instanceof`.

#### Contoh

```javascript
// 1. Membuat Custom Error Class untuk Validasi Form
class ValidationError extends Error {
    constructor(message, invalidField) {
        super(message);
        this.name = "ValidationError";
        this.invalidField = invalidField;
    }
}

// 2. Membuat Custom Error Class untuk Transaksi Saldo
class InsufficientFundsError extends Error {
    constructor(currentBalance, requestedAmount) {
        const msg = `Saldo tidak cukup (Saldo: Rp${currentBalance.toLocaleString("id-ID")}, Diminta: Rp${requestedAmount.toLocaleString("id-ID")})`;
        super(msg);
        this.name = "InsufficientFundsError";
        this.currentBalance = currentBalance;
        this.requestedAmount = requestedAmount;
    }
}

// 3. Fungsi Bisnis yang Memanfaatkan Custom Error
function processWithdrawal(balance, amount) {
    if (typeof amount !== "number" || amount <= 0) {
        throw new ValidationError("Nominal penarikan harus angka positif!", "amount");
    }
    if (amount > balance) {
        throw new InsufficientFundsError(balance, amount);
    }
    return balance - amount;
}

// 4. Penanganan Error Spesifik Menggunakan instanceof
function handleTransaction(balance, amount) {
    try {
        const remaining = processWithdrawal(balance, amount);
        console.log(`✅ Transaksi Berhasil! Sisa Saldo: Rp${remaining.toLocaleString("id-ID")}`);
    } catch (err) {
        if (err instanceof ValidationError) {
            console.error(`⚠️ [Input Error] Field "${err.invalidField}": ${err.message}`);
        } else if (err instanceof InsufficientFundsError) {
            console.error(`🛑 [Finansial Error]: ${err.message}`);
        } else {
            console.error(`💥 [Fatal System Error]: ${err.message}`);
        }
    }
}

handleTransaction(1000000, 250000);  // Berhasil
handleTransaction(1000000, "lima");   // ValidationError
handleTransaction(500000, 750000);   // InsufficientFundsError
```

#### Output

```text
✅ Transaksi Berhasil! Sisa Saldo: Rp750.000
⚠️ [Input Error] Field "amount": Nominal penarikan harus angka positif!
🛑 [Finansial Error]: Saldo tidak cukup (Saldo: Rp500.000, Diminta: Rp750.000)
```

#### Cara Kerja

```text
         throw new InsufficientFundsError(...)
                         │
                         ▼
         Masuk ke blok catch (err)
                         │
         ┌───────────────┴───────────────┐
   err instanceof ValidationError?  err instanceof InsufficientFundsError?
         │                               │
         ▼                               ▼
       [Bukan]                         [BENAR!]
                                         │
                                         ▼
                             Tangani Error Finansial Khusus
```

**Hafalan:**

```text
class CustomError extends Error { ... } → Membuat tipe error domain aplikasi khusus
if (error instanceof CustomError) { ... }→ Membedakan penanganan error secara spesifik
```

#### Best Practice & Kesalahan Umum

- ✅ Selalu set `this.name = "CustomErrorName"` di dalam constructor custom error agar nama class tampil akurat di stack trace log.
- ❌ Jangan membuat puluhan custom error class untuk kasus yang terlalu sepele; kelompokkan error berdasarkan kategori penanganannya.

---

<a id="bagian-26"></a>

## 26. 🔴 Iterable dan Iterator Protocol ([Symbol.iterator])

#### Konsep

Di JavaScript, objek dapat dibuat agar bisa diulang menggunakan perulangan **`for...of`** dan spread operator (**`...`**) dengan mengimplementasikan **Iterable Protocol**.

Dua Protokol Utama:
1. **Iterable Protocol:** Objek harus memiliki method dengan nama kunci simbol bawaan **`[Symbol.iterator]()`**.
2. **Iterator Protocol:** Method tersebut harus mengembalikan sebuah objek **Iterator** yang memiliki method **`.next()`**, di mana method ini mengembalikan objek berformat `{ value: ..., done: boolean }`.

Saat `for...of` dijalankan:
- Engine memanggil `obj[Symbol.iterator]()`.
- Engine berulang kali memanggil `.next()` sampai properti `done: true` tercapai.

#### Contoh

```javascript
// Membuat Custom Collection Class yang mendukung perulangan for...of
class TeamRoster {
    constructor(teamName) {
        this.teamName = teamName;
        this.members = [];
    }

    addMember(name, role) {
        this.members.push({ name, role });
    }

    // Mengimplementasikan Iterable Protocol
    [Symbol.iterator]() {
        let currentIndex = 0;
        const membersList = this.members;

        // Mengembalikan objek Iterator
        return {
            next() {
                if (currentIndex < membersList.length) {
                    return {
                        value: membersList[currentIndex++],
                        done: false
                    };
                }
                return {
                    value: undefined,
                    done: true
                };
            }
        };
    }
}

const devTeam = new TeamRoster("Alpha Engineering");
devTeam.addMember("Rian", "Tech Lead");
devTeam.addMember("Siti", "Frontend Engineer");
devTeam.addMember("Budi", "Backend Engineer");

console.log(`=== Anggota Tim: ${devTeam.teamName} ===`);

// Objek class sekarang bisa langsung diiterasi dengan for...of!
for (const member of devTeam) {
    console.log(`- ${member.name} (${member.role})`);
}

// Bisa juga menggunakan Spread Operator (...)
const allMembersArray = [...devTeam];
console.log("Total Anggota (via Spread):", allMembersArray.length);
```

#### Output

```text
=== Anggota Tim: Alpha Engineering ===
- Rian (Tech Lead)
- Siti (Frontend Engineer)
- Budi (Backend Engineer)
Total Anggota (via Spread): 3
```

#### Cara Kerja

```text
         for (const member of devTeam)
                       │
                       ▼
         Panggil: devTeam[Symbol.iterator]()
                       │
                       ▼
         Loop iterator.next() -> { value: { name: "Rian"... }, done: false }
                       │
                       ▼
         Loop iterator.next() -> ...
                       │
                       ▼
         Loop iterator.next() -> { value: undefined, done: true } (Berhenti)
```

**Hafalan:**

```text
[Symbol.iterator]() { return { next() { return { value, done }; } }; } → Protokol iterasi objek
```

#### Best Practice & Kesalahan Umum

- ✅ Terapkan Iterable Protocol pada class penampung data koleksi (*Collection / Repository*) agar konsumen class dapat mengonsumsinya secara alami dengan `for...of`.
- ❌ Jangan lupa mengembalikan `done: true` saat iterasi selesai, jika tidak perulangan `for...of` akan menjadi infinite loop.

---

<a id="bagian-27"></a>

## 27. 🔴 Object Composition vs Class Inheritance

#### Konsep

Dalam arsitektur perangkat lunak berorientasi objek modern, terdapat prinsip terkenal:
> **"Favor Object Composition over Class Inheritance"** (Pilihlah Komposisi Objek daripada Pewarisan Kelas).

##### Masalah Inheritance yang Kaku:
Inheritance mendefinisikan apa suatu objek itu (*what an object **IS*** - hubungan *is-a*). Jika kebutuhan aplikasi berkembang dan memerlukan kombinasi kemampuan silang, hierarki pewarisan akan menjadi sangat rumit (*Gorilla/Banana Problem* atau *Diamond Problem*).

##### Kekuatan Composition:
Composition mendefinisikan apa yang bisa dilakukan suatu objek (*what an object **CAN DO*** - hubungan *has-a*). Kita membuat fungsi-fungsi kemampuan kecil (*composable behaviors*) lalu menggabungkannya ke dalam objek sesuai kebutuhan menggunakan `Object.assign()` atau Factory Functions.

#### Contoh

```javascript
// 1. Mendefinisikan Kemampuan-Kemampuan Terpisah (Behaviors)
const canFly = (state) => ({
    fly: () => `${state.name} sedang terbang tinggi di angkasa.`
});

const canSwim = (state) => ({
    swim: () => `${state.name} sedang berenang menyelam di air.`
});

const canQuack = (state) => ({
    quack: () => `${state.name} bersuara: Kwek kwek!`
});

// 2. Factory Function yang Menyusun Objek secara Fleksibel (Composition)
function createDuck(name) {
    const state = { name };
    // Menggabungkan kemampuan: Terbang + Berenang + Bersuara
    return Object.assign(state, canFly(state), canSwim(state), canQuack(state));
}

function createPenguin(name) {
    const state = { name };
    // Penguin hanya: Berenang + Bersuara (Tidak bisa terbang!)
    return Object.assign(state, canSwim(state), canQuack(state));
}

const donald = createDuck("Donald si Bebek");
const pingu = createPenguin("Pingu si Penguin");

console.log("=== Kemampuan Bebek ===");
console.log(donald.fly());
console.log(donald.swim());
console.log(donald.quack());

console.log("\n=== Kemampuan Penguin ===");
console.log(pingu.swim());
console.log(pingu.quack());
console.log("Bisa terbang?", pingu.fly ? "Ya" : "Tidak (Aman tanpa inheritance salah)");
```

#### Output

```text
=== Kemampuan Bebek ===
Donald si Bebek sedang terbang tinggi di angkasa.
Donald si Bebek sedang berenang menyelam di air.
Donald si Bebek bersuara: Kwek kwek!

=== Kemampuan Penguin ===
Pingu si Penguin sedang berenang menyelam di air.
Pingu si Penguin bersuara: Kwek kwek!
Bisa terbang? Tidak (Aman tanpa inheritance salah)
```

#### Cara Kerja

```text
         canFly()       canSwim()       canQuack()
            │               │               │
            └───────────────┼───────────────┘
                            │
                            ▼
               Object.assign(state, ...)
                            │
                            ▼
        Objek baru tercipta dengan kemampuan modular
```

**Hafalan:**

```text
Inheritance → Relasi "is-a" (Pewarisan hierarki kaku dari parent ke child)
Composition → Relasi "has-a" (Penyusunan kemampuan fleksibel dari modul-modul kecil)
Object.assign(target, ...sources) → Menggabungkan banyak objek behavior ke satu target
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan Class Inheritance jika relasi data benar-benar hierarkis dan stabil. Gunakan Object Composition jika objek membutuhkan kombinasi kemampuan yang bervariasi.
- ❌ Jangan memaksa membuat subclass dengan inheritance bertingkat hanya untuk meminjam 1 fungsi kecil dari parent.

---

<a id="bagian-28"></a>

## 28. 🛠️ Peta Ingatan Cepat

#### Mental Model Arsitektur OOP JavaScript

```text
                      ┌───────────────────────────────┐
                      │     JavaScript OOP Model      │
                      └───────────────┬───────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        ▼                             ▼                             ▼
   Sistem Prototype              Sintaks ES6 Class              Enkapsulasi & Safety
   - Constructor Function        - constructor()                - Public fields (name = val)
   - Prototype Chain             - Prototype methods            - Private fields (#balance)
   - Object.getPrototypeOf()     - extends & super()            - Private methods (#check())
   - Prototype Inheritance       - static properties & methods  - Custom Error classes
        │                             │                             │
        └─────────────────────────────┼─────────────────────────────┘
                                      │
                                      ▼
                        Pola Desain & Ekosistem Lanjutan
                        - Getters (get) & Setters (set)
                        - Type Checking via instanceof
                        - Iterable Protocol ([Symbol.iterator])
                        - Object Composition (Mixins / Behaviors)
```

#### Pola Pengambilan Keputusan OOP

```text
                                Kebutuhan Fitur Class
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   ▼                                             ▼
          Milik Tiap Instance?                           Milik Class Global?
                   │                                             │
                   ▼                                             ▼
          Gunakan Field / Method                         Gunakan static
                   │
                   ▼
                               Tingkat Akses Data
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   ▼                                             ▼
            Boleh Diakses Luar?                           Sensitif / Privat?
                   │                                             │
                   ▼                                             ▼
             Public Field                                  Private Field (#)
                   │
                   ▼
                                 Relasi Antar Objek
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   ▼                                             ▼
          Hierarki "is-a" Jelas?                     Kemampuan Fleksibel "has-a"?
                   │                                             │
                   ▼                                             ▼
          class Child extends Parent                    Object Composition / Mixin
```

---

<a id="bagian-29"></a>

## 29. 📚 Tabel Ringkasan

| Kategori | Fitur / Sintaks | Contoh Kode | Penjelasan & Kegunaan |
|---|---|---|---|
| **Class** | Class Declaration | `class User { ... }` | Mendefinisikan blueprint class objek (ES6) |
| **Class** | Constructor | `constructor(name) { ... }` | Inisialisasi awal objek saat dipanggil dengan `new` |
| **Method** | Prototype Method | `sayHi() { ... }` | Method bersama yang otomatis berada di prototype |
| **Pewarisan** | Subclassing | `class Admin extends User` | Mewarisi seluruh properti dan method dari parent |
| **Pewarisan** | Super Constructor | `super(name, email);` | Menjalankan constructor parent class (wajib di derived) |
| **Pewarisan** | Super Method | `super.save();` | Memanggil method asli milik parent class |
| **Akses** | Getter / Setter | `get total()` / `set total(v)` | Properti baca/tulis dinamis dengan validasi |
| **Field** | Public Field | `status = "ACTIVE";` | Field publik langsung di body class |
| **Privasi** | Private Field | `#balance = 0;` | Field privat terkunci engine (simbol pagar `#`) |
| **Privasi** | Private Method | `#validate() { ... }` | Method internal privat yang tidak bisa diakses luar |
| **Class Level** | Static Field | `static APP_NAME = "MyApp";` | Properti yang menempel langsung pada Class |
| **Class Level** | Static Method | `static format(val) { ... }` | Fungsi utility yang dipanggil tanpa instansiasi `new` |
| **Checking** | `instanceof` | `user instanceof Admin` | Mengecek apakah objek adalah turunan class tertentu |
| **Error** | Error Handling | `try { ... } catch (err)` | Menangkap dan menangani kesalahan runtime |
| **Error** | Custom Error | `class AppError extends Error` | Membuat tipe error spesifik domain aplikasi |
| **Protokol** | Iterable | `[Symbol.iterator]() { ... }` | Mengaktifkan dukungan perulangan `for...of` |

---

<a id="bagian-30"></a>

## 30. ⚡ Cheat Code JavaScript OOP 10 Detik

### 1. Definisi Class Lengkap (ES6+)
```javascript
class Product {
    #stock = 0; // Private

    constructor(name, price, initialStock = 0) {
        this.name = name;
        this.price = price;
        this.#stock = initialStock;
    }

    get stock() { return this.#stock; }
    
    sell(qty) {
        if (qty > this.#stock) throw new Error("Stok tidak cukup!");
        this.#stock -= qty;
        return `Terjual ${qty} unit ${this.name}`;
    }
}
```

### 2. Inheritance & Super
```javascript
class DigitalProduct extends Product {
    constructor(name, price, downloadUrl) {
        super(name, price, 9999); // super constructor
        this.downloadUrl = downloadUrl;
    }
}
```

### 3. Static Utility & Factory
```javascript
class Formatter {
    static toRupiah(amount) {
        return "Rp " + amount.toLocaleString("id-ID");
    }
}
console.log(Formatter.toRupiah(50000));
```

### 4. Custom Error & Try-Catch
```javascript
class PaymentError extends Error {
    constructor(msg) { super(msg); this.name = "PaymentError"; }
}

try {
    throw new PaymentError("Saldo tidak mencukupi!");
} catch (err) {
    if (err instanceof PaymentError) console.error("Payment Failed:", err.message);
}
```

---

<a id="bagian-31"></a>

## 31. 🧭 Urutan Belajar yang Disarankan

Untuk menguasai Object-Oriented Programming di JavaScript secara mendalam dan terstruktur, ikuti 4 tahapan belajar berikut:

```text
                   FASE 1: Fondasi Prototype & Constructor (Minggu 1)
       ┌─────────────────────────────────────────────────────────────┐
       │ 1. Mental model Prototype & perbedaan memori instance       │
       │ 2. Constructor Function, new keyword, & this binding        │
       │ 3. Prototype Chain (Object.getPrototypeOf) & Inheritance    │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
                   FASE 2: Modern ES6 Class Essentials (Minggu 2)
       ┌─────────────────────────────────────────────────────────────┐
       │ 4. Class Declaration, constructor, & prototype methods      │
       │ 5. Class Inheritance (extends, super constructor & method)  │
       │ 6. Getters (get) dan Setters (set) dengan validasi data     │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
                   FASE 3: Enkapsulasi, Static, & Errors (Minggu 3)
       ┌─────────────────────────────────────────────────────────────┐
       │ 7. Public & Private Class Fields (#field, #method)          │
       │ 8. Static Fields & Static Utility Methods                   │
       │ 9. Error Handling (try/catch/finally) & Custom Error Class  │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
                   FASE 4: Pola Desain Lanjutan & Proyek (Minggu 4)
       ┌─────────────────────────────────────────────────────────────┐
       │ 10. Type Checking via instanceof & Polymorphic dispatch     │
       │ 11. Iterable & Iterator Protocol ([Symbol.iterator])        │
       │ 12. Object Composition vs Inheritance                       │
       │ 13. Mengerjakan Mini Project OOP Terintegrasi               │
       └─────────────────────────────────────────────────────────────┘
```

---

<a id="bagian-32"></a>

## 32. 🏗️ Mini Project: Sistem Manajemen Reservasi Kamar & Layanan Hotel OOP

#### Konsep Project

Project ini menyatukan seluruh pilar dan fitur OOP JavaScript modern:
- **Class Hierarchy & Inheritance:** Parent `Room` diwarisi oleh `DeluxeRoom` dan `SuiteRoom`.
- **Private Fields (`#`):** Melindungi data sensitif seperti riwayat transaksi (`#balance`, `#guestPin`).
- **Encapsulation & Validation:** Getter/Setter dengan proteksi input.
- **Polymorphism & Method Overriding:** Method `calculateDailyRate()` dan `getRoomPerks()` berperilaku berbeda sesuai jenis kamar.
- **Custom Error Classes:** `ReservationError` dan `RoomUnavailableError`.
- **Static Utilities & Factory:** `HotelConfig` dan factory generator nomor reservasi.
- **Iterable Protocol:** Class `HotelBookingManager` dapat langsung di-loop dengan `for...of`.

#### Kode Lengkap

```javascript
/**
 * Mini Project OOP: Sistem Reservasi Hotel Bintang Lima Interaktif
 */

// 1. Custom Error Classes
class HotelError extends Error {
    constructor(message) {
        super(message);
        this.name = "HotelError";
    }
}

class RoomUnavailableError extends HotelError {
    constructor(roomNumber) {
        super(`Kamar nomor ${roomNumber} saat ini sedang tidak tersedia atau sudah dipesan!`);
        this.name = "RoomUnavailableError";
        this.roomNumber = roomNumber;
    }
}

class ValidationError extends HotelError {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

// 2. Base Class: Room (Parent)
class Room {
    #isOccupied = false;
    #currentGuest = null;

    constructor(roomNumber, baseRatePerNight) {
        if (typeof roomNumber !== "string" || roomNumber.trim() === "") {
            throw new ValidationError("Nomor kamar wajib berupa teks valid!");
        }
        this.roomNumber = roomNumber;
        this.baseRatePerNight = baseRatePerNight;
    }

    get isOccupied() {
        return this.#isOccupied;
    }

    get currentGuest() {
        return this.#currentGuest;
    }

    // Method Polymorphic Dasar
    calculateDailyRate() {
        return this.baseRatePerNight;
    }

    getRoomPerks() {
        return ["Wi-Fi Kecepatan Tinggi", "Air Mineral Gratis", "Smart TV"];
    }

    checkIn(guestName) {
        if (this.#isOccupied) {
            throw new RoomUnavailableError(this.roomNumber);
        }
        this.#isOccupied = true;
        this.#currentGuest = guestName;
        return `✅ Check-In Berhasil: Kamar ${this.roomNumber} untuk Tamu "${guestName}"`;
    }

    checkOut() {
        if (!this.#isOccupied) {
            return `Kamar ${this.roomNumber} memang sedang kosong.`;
        }
        const prevGuest = this.#currentGuest;
        this.#isOccupied = false;
        this.#currentGuest = null;
        return `🚪 Check-Out Berhasil: Tamu "${prevGuest}" telah meninggalkan kamar ${this.roomNumber}`;
    }
}

// 3. Subclass 1: DeluxeRoom (Mewarisi Room)
class DeluxeRoom extends Room {
    constructor(roomNumber) {
        super(roomNumber, 750000); // Base rate: Rp750.000
    }

    // Method Overriding
    getRoomPerks() {
        return [...super.getRoomPerks(), "Sarapan Prasmanan 2 Orang", "Akses Kolam Renang"];
    }
}

// 4. Subclass 2: SuiteRoom (Mewarisi Room dengan Layanan VIP)
class SuiteRoom extends Room {
    #butlerService = true;

    constructor(roomNumber) {
        super(roomNumber, 2000000); // Base rate: Rp2.000.000
    }

    // Method Overriding dengan Diskon/Biaya Tambahan
    calculateDailyRate() {
        const base = super.calculateDailyRate();
        const luxuryTax = base * 0.10; // Pajak kemewahan 10%
        return base + luxuryTax;
    }

    getRoomPerks() {
        return [...super.getRoomPerks(), "Layanan Butler Pribadi 24 Jam", "Akses Lounge VIP", "Antar-Jemput Bandara"];
    }
}

// 5. Manager Collection Class yang Mengimplementasikan Iterable Protocol
class HotelBookingManager {
    static HOTEL_NAME = "Grand Astina Resort & Spa";
    #rooms = [];

    addRoom(roomInstance) {
        if (!(roomInstance instanceof Room)) {
            throw new ValidationError("Hanya instance turunan class Room yang boleh didaftarkan!");
        }
        this.#rooms.push(roomInstance);
    }

    // Implementasi Iterable Protocol untuk perulangan for...of
    [Symbol.iterator]() {
        let index = 0;
        const roomsList = this.#rooms;
        return {
            next() {
                if (index < roomsList.length) {
                    return { value: roomsList[index++], done: false };
                }
                return { value: undefined, done: true };
            }
        };
    }

    generateHotelReport() {
        let report = `\n=======================================================\n`;
        report += `       LAPORAN STATUS OKUPANSI: ${HotelBookingManager.HOTEL_NAME.toUpperCase()}       \n`;
        report += `=======================================================\n`;
        report += `No. Kamar  Tipe Kamar     Tarif/Malam   Status    Tamu\n`;
        report += `-------------------------------------------------------\n`;

        for (const room of this) {
            const typeName = room instanceof SuiteRoom ? "Suite VIP" : (room instanceof DeluxeRoom ? "Deluxe   " : "Standard ");
            const rateStr = ("Rp" + room.calculateDailyRate().toLocaleString("id-ID")).padEnd(13, " ");
            const statusStr = room.isOccupied ? "TERISI " : "KOSONG ";
            const guestStr = room.currentGuest ?? "-";

            report += `${room.roomNumber.padEnd(10, " ")} ${typeName}    ${rateStr} ${statusStr}  ${guestStr}\n`;
        }

        report += `=======================================================\n`;
        return report;
    }
}

// 6. Eksekusi Program Reservasi
try {
    const hotel = new HotelBookingManager();

    const room101 = new DeluxeRoom("101");
    const room102 = new DeluxeRoom("102");
    const suite301 = new SuiteRoom("301-VIP");

    hotel.addRoom(room101);
    hotel.addRoom(room102);
    hotel.addRoom(suite301);

    console.log(room101.checkIn("Budi Santoso"));
    console.log(suite301.checkIn("Dr. Hendra Wijaya"));

    // Menampilkan Fasilitas Suite
    console.log("\nFasilitas Kamar Suite 301:", suite301.getRoomPerks().join(", "));

    // Simulasi Error Kamar yang Sudah Terisi
    try {
        console.log(room101.checkIn("Tamu Lain"));
    } catch (err) {
        if (err instanceof RoomUnavailableError) {
            console.error(`\n⚠️ [Peringatan Booking]: ${err.message}`);
        }
    }

    // Cetak Laporan Okupansi Hotel
    console.log(hotel.generateHotelReport());

} catch (globalErr) {
    console.error("Fatal Error:", globalErr.message);
}
```

#### Output

```text
✅ Check-In Berhasil: Kamar 101 untuk Tamu "Budi Santoso"
✅ Check-In Berhasil: Kamar 301-VIP untuk Tamu "Dr. Hendra Wijaya"

Fasilitas Kamar Suite 301: Wi-Fi Kecepatan Tinggi, Air Mineral Gratis, Smart TV, Layanan Butler Pribadi 24 Jam, Akses Lounge VIP, Antar-Jemput Bandara

⚠️ [Peringatan Booking]: Kamar nomor 101 saat ini sedang tidak tersedia atau sudah dipesan!

=======================================================
       LAPORAN STATUS OKUPANSI: GRAND ASTINA RESORT & SPA       
=======================================================
No. Kamar  Tipe Kamar     Tarif/Malam   Status    Tamu
-------------------------------------------------------
101        Deluxe         Rp750.000     TERISI   Budi Santoso
102        Deluxe         Rp750.000     KOSONG   -
301-VIP    Suite VIP      Rp2.200.000   TERISI   Dr. Hendra Wijaya
=======================================================
```

#### Cara Kerja

```text
         new SuiteRoom("301-VIP")
                   │
                   ▼
         Mewarisi Room -> set rate Rp2.000.000
                   │
                   ▼
         calculateDailyRate() -> Override (+ Luxury Tax 10% = Rp2.200.000)
                   │
                   ▼
         hotelBookingManager[Symbol.iterator]() -> Iterasi for..of pada laporan
```

**Hafalan:**

```text
Polymorphism in Action → Method calculateDailyRate() dipanggil seragam tapi hasil berbeda sesuai tipe
```

---

<a id="bagian-33"></a>

## 33. 🔗 Referensi Resmi

Untuk mempelajari dokumentasi resmi dan spesifikasi mendalam mengenai Object-Oriented Programming di JavaScript:

- [MDN Web Docs — Classes in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [MDN Web Docs — Inheritance and the Prototype Chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
- [MDN Web Docs — Private Class Features (#)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties)
- [ECMA-262 ECMAScript Language Specification (Class & Object Model)](https://tc39.es/ecma262/)
- [JavaScript.info — Classes and Prototypes Guide](https://javascript.info/classes)

> **Catatan Versi:** Cheatsheet ini disusun mengacu pada standar **ECMAScript 2022+**. Seluruh fitur enkapsulasi modern (*Private Fields & Methods* `#`, *Public Fields*, dan *Static Blocks*) didukung secara penuh oleh Node.js LTS terkini dan seluruh browser modern.
