# JavaScript OOP Cheatsheet Revised

> **Target:** pemula yang sudah memahami dasar JavaScript (object,
> function, array), lalu ingin mengenal Object-Oriented Programming
> (OOP) di JavaScript.
>
> Fokus cheatsheet ini: **konsep OOP → constructor function →
> prototype → class → inheritance → encapsulation → static →
> error → iterable/iterator → mini project**.
>
> **Batasan penting:** JavaScript mendukung OOP berbasis prototype.
> `class` adalah syntax yang lebih nyaman untuk bekerja dengan
> prototype, bukan sistem inheritance yang sepenuhnya terpisah dari
> prototype.

## Cara Belajar

``` text
🟢 Fundamental
→ wajib untuk mulai menulis kode berorientasi object

🟡 Lanjutan
→ pelajari setelah fundamental nyaman

🔴 Advanced / Reference
→ penting ketika kebutuhan aplikasi meningkat
```

Mental model:

``` text
Object
 ↓
Class (blueprint)
 ↓
Constructor
 ↓
Property (data) + Method (behavior)
 ↓
Inheritance / Encapsulation
```

**Penting:**

``` text
Property → data
Method   → behavior
Object   → gabungan data + behavior
Class    → blueprint/pola object
```

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan OOP](#bagian-1)
2. [Membuat Constructor Function](#bagian-2)
3. [Property di Constructor Function](#bagian-3)
4. [Method di Constructor Function](#bagian-4)
5. [Parameter di Constructor Function](#bagian-5)
6. [Prototype](#bagian-6)
7. [Prototype Inheritance](#bagian-7)
8. [Class](#bagian-8)
9. [Constructor di Class](#bagian-9)
10. [Property di Class](#bagian-10)
11. [Method di Class](#bagian-11)

### 🟡 Lanjutan

12. [Class Inheritance](#bagian-12)
13. [Super Constructor](#bagian-13)
14. [Super Method](#bagian-14)
15. [Getter dan Setter di Class](#bagian-15)
16. [Public Class Field](#bagian-16)
17. [Private Class Field](#bagian-17)
18. [Private Method](#bagian-18)
19. [Operator instanceof](#bagian-19)
20. [Static Field](#bagian-20)
21. [Static Method](#bagian-21)
22. [Error](#bagian-22)
23. [Error Handling](#bagian-23)
24. [Membuat Class Error](#bagian-24)

### 🔴 Advanced / Reference

25. [Iterable dan Iterator](#bagian-25)
26. [Mini Flow JavaScript OOP](#bagian-26)
27. [Tabel Ringkasan](#bagian-27)
28. [Cheat Code JavaScript OOP 10 Detik](#bagian-28)
29. [Urutan Belajar yang Disarankan](#bagian-29)
30. [Mini Project](#bagian-30)
31. [Referensi Resmi](#bagian-31)

------------------------------------------------------------------------

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan OOP

## Konsep

**OOP (Object-Oriented Programming)** adalah pendekatan pemrograman
yang mengorganisasi data dan behavior ke dalam object.

Contoh dunia nyata:

``` text
User
├── name
├── email
└── login()

Product
├── name
├── price
└── discount()
```

Dalam JavaScript:

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

Konsep OOP yang penting:

``` text
Object
Class
Constructor
Property
Method
Prototype
Inheritance
Encapsulation
Polymorphism
```

## Kunci

> Property → data, Method → behavior, Object → gabungan data +
> behavior, Class → blueprint/pola object.

## Best Practice

- Mulai dari object sederhana dulu, lalu naik ke constructor function
  dan `class` ketika butuh pola yang berulang.

------------------------------------------------------------------------

<a id="bagian-2"></a>

# 2. 🟢 Membuat Constructor Function

## Konsep

Sebelum `class` populer, JavaScript banyak menggunakan **constructor
function** untuk membuat object dengan pola yang sama.

## Contoh

``` javascript
function Person() {
}

const person = new Person();

console.log(person);
```

`new` membuat object baru dan menjalankan constructor function.

Constructor function biasanya diawali huruf kapital:

``` javascript
function Person() {
}

function Product() {
}

function User() {
}
```

Contoh dengan property:

``` javascript
function Person() {
    this.name = "Budi";
}

const person = new Person();

console.log(person.name);
```

## Output

``` text
Budi
```

## Cara Kerja

``` text
function Person() {}
       ↓
new Person()
       ↓
object baru
```

## Kunci

> Constructor function → function yang dipanggil dengan `new` untuk
> membuat object baru.

## Best Practice

- Untuk kode baru, gunakan `class` (section 8) — lebih mudah dibaca
  daripada constructor function.

------------------------------------------------------------------------

<a id="bagian-3"></a>

# 3. 🟢 Property di Constructor Function

## Konsep

Property dapat dibuat menggunakan `this` di dalam constructor
function.

## Contoh

``` javascript
function Person() {
    this.name = "Budi";
    this.age = 20;
}

const person = new Person();

console.log(person.name);
console.log(person.age);
```

## Output

``` text
Budi
20
```

Setiap object hasil constructor memiliki property tersebut:

``` javascript
const person1 = new Person();
const person2 = new Person();

console.log(person1.name);
console.log(person2.name);
```

## Diagram

``` text
Person()
   │
   ├── this.name
   └── this.age
        │
        ▼
   ┌──────────┐
   │ person1  │
   └──────────┘
        │
   ┌──────────┐
   │ person2  │
   └──────────┘
```

## Kunci

> `this.property = value` → property instance.

------------------------------------------------------------------------

<a id="bagian-4"></a>

# 4. 🟢 Method di Constructor Function

## Konsep

Method dapat dibuat langsung di constructor, tetapi ada masalah: setiap
object memiliki function sendiri. Solusinya adalah menempatkan method
di prototype agar dipakai bersama.

## Contoh (di constructor)

``` javascript
function Person() {
    this.name = "Budi";

    this.sayHello = function () {
        console.log(`Halo ${this.name}`);
    };
}

const person = new Person();

person.sayHello();
```

## Output

``` text
Halo Budi
```

Namun ada masalah: setiap object memiliki function `sayHello` sendiri.

``` text
person1.sayHello !== person2.sayHello
```

## Contoh (di prototype)

Untuk method yang dipakai bersama, lebih baik gunakan prototype:

``` javascript
function Person(name) {
    this.name = name;
}

Person.prototype.sayHello = function () {
    console.log(`Halo ${this.name}`);
};

const person = new Person("Budi");

person.sayHello();
```

## Output

``` text
Halo Budi
```

## Kunci

> method di constructor → dibuat per object, method di prototype →
> dipakai bersama.

## Best Practice

- Tempatkan method di prototype agar tidak dibuat ulang untuk setiap
  instance.

------------------------------------------------------------------------

<a id="bagian-5"></a>

# 5. 🟢 Parameter di Constructor Function

## Konsep

Constructor function dapat menerima parameter untuk membuat object
dengan nilai berbeda.

## Contoh

``` javascript
function Person(name, age) {
    this.name = name;
    this.age = age;
}

const person = new Person("Budi", 20);

console.log(person.name);
console.log(person.age);
```

## Output

``` text
Budi
20
```

Membuat object lain:

``` javascript
const person1 = new Person("Budi", 20);
const person2 = new Person("Andi", 25);

console.log(person1.name);
console.log(person2.name);
```

## Output

``` text
Budi
Andi
```

## Kunci

> `function Person(name, age)` → `new Person("Budi", 20)`.

------------------------------------------------------------------------

<a id="bagian-6"></a>

# 6. 🟢 Prototype

## Konsep

Setiap object JavaScript dapat memiliki hubungan prototype. Prototype
digunakan sebagai tempat berbagi property/method yang dapat diwarisi
object.

## Contoh

``` javascript
function Person(name) {
    this.name = name;
}

Person.prototype.sayHello = function () {
    console.log(`Halo ${this.name}`);
};

const person = new Person("Budi");

person.sayHello();
```

## Output

``` text
Halo Budi
```

Saat `person.sayHello()` dipanggil:

``` text
person
  │
  ├── name
  │
  └── prototype
        │
        └── sayHello()
```

Jika property tidak ditemukan langsung pada object, JavaScript mencari
pada prototype chain.

## Kunci

> Prototype chain = jalur pencarian property/method:

``` text
object
  ↓
prototype
  ↓
prototype berikutnya
  ↓
null
```

## Best Practice

- Gunakan prototype untuk method yang dipakai banyak instance agar
  hemat memory.

------------------------------------------------------------------------

<a id="bagian-7"></a>

# 7. 🟡 Prototype Inheritance

## Konsep

Prototype inheritance berarti sebuah object dapat mewarisi
property/method dari prototype object lain.

## Contoh

Parent:

``` javascript
function Person(name) {
    this.name = name;
}

Person.prototype.sayHello = function () {
    console.log(`Halo ${this.name}`);
};
```

Child:

``` javascript
function Employee(name, company) {
    Person.call(this, name);

    this.company = company;
}

Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee;
```

Method child:

``` javascript
Employee.prototype.work = function () {
    console.log(`${this.name} sedang bekerja`);
};
```

Gunakan:

``` javascript
const employee = new Employee("Budi", "ABC");

employee.sayHello();
employee.work();
```

## Output

``` text
Halo Budi
Budi sedang bekerja
```

## Diagram

``` text
employee
   │
   ▼
Employee.prototype
   │
   ▼
Person.prototype
   │
   ▼
Object.prototype
   │
   ▼
null
```

## Kunci

> Constructor inheritance = `Person.call(this, ...)` +
> `Object.create(Person.prototype)`.

## Best Practice

- Untuk kode baru, `class extends` (section 12) biasanya lebih mudah
  dibaca daripada prototype inheritance manual.

------------------------------------------------------------------------

<a id="bagian-8"></a>

# 8. 🟢 Class

## Konsep

`class` menyediakan syntax yang lebih nyaman untuk membuat object dan
inheritance.

## Contoh

``` javascript
class Person {
    sayHello() {
        console.log("Hello");
    }
}

const person = new Person();

person.sayHello();
```

## Output

``` text
Hello
```

Secara konsep:

``` text
class
  ↓
prototype
  ↓
object instance
```

## Kunci

> `class` = syntax modern untuk pola object/prototype.

## Best Practice

- Gunakan `class` untuk kode baru — lebih jelas dan mudah dipelihara
  daripada constructor function.

------------------------------------------------------------------------

<a id="bagian-9"></a>

# 9. 🟢 Constructor di Class

## Konsep

Class dapat memiliki method khusus bernama `constructor` yang
dipanggil otomatis ketika menggunakan `new`.

## Contoh

``` javascript
class Person {
    constructor(name) {
        this.name = name;
    }
}

const person = new Person("Budi");

console.log(person.name);
```

## Output

``` text
Budi
```

## Cara Kerja

``` text
new Person("Budi")
        │
        ▼
constructor("Budi")
        │
        ▼
this.name = "Budi"
```

## Kunci

> `new Class()` → `constructor()` dijalankan otomatis.

------------------------------------------------------------------------

<a id="bagian-10"></a>

# 10. 🟢 Property di Class

## Konsep

Property instance dapat dibuat di `constructor` menggunakan `this`.

## Contoh

``` javascript
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

const person = new Person("Budi", 20);

console.log(person.name);
console.log(person.age);
```

## Output

``` text
Budi
20
```

Setiap instance memiliki property masing-masing:

``` javascript
const person1 = new Person("Budi", 20);
const person2 = new Person("Andi", 25);
```

## Kunci

> `this.name = ...` → property instance.

------------------------------------------------------------------------

<a id="bagian-11"></a>

# 11. 🟢 Method di Class

## Konsep

Method ditulis langsung di dalam class. Method class berada pada
prototype, sehingga tidak perlu dibuat ulang sebagai function sendiri
pada setiap instance.

## Contoh

``` javascript
class Person {
    constructor(name) {
        this.name = name;
    }

    sayHello() {
        console.log(`Halo ${this.name}`);
    }
}

const person = new Person("Budi");

person.sayHello();
```

## Output

``` text
Halo Budi
```

## Cara Kerja

``` text
Person.prototype
      │
      └── sayHello()
```

## Kunci

> `class Person { method() {} }` → method berada di prototype.

------------------------------------------------------------------------

<a id="bagian-12"></a>

# 12. 🟡 Class Inheritance

## Konsep

Gunakan `extends` untuk membuat child class yang mewarisi parent
class.

## Contoh

Parent:

``` javascript
class Person {
    sayHello() {
        console.log("Hello");
    }
}
```

Child:

``` javascript
class Employee extends Person {
    work() {
        console.log("Working");
    }
}
```

Gunakan:

``` javascript
const employee = new Employee();

employee.sayHello();
employee.work();
```

## Output

``` text
Hello
Working
```

## Diagram

``` text
Person
  │
  │ extends
  ▼
Employee
  │
  ▼
employee
```

## Kunci

> `class Child extends Parent`.

------------------------------------------------------------------------

<a id="bagian-13"></a>

# 13. 🟡 Super Constructor

## Konsep

Jika child class memiliki `constructor`, child harus memanggil
`super()` **sebelum** menggunakan `this`.

## Contoh

Parent:

``` javascript
class Person {
    constructor(name) {
        this.name = name;
    }
}
```

Child:

``` javascript
class Employee extends Person {
    constructor(name, company) {
        super(name);

        this.company = company;
    }
}
```

Gunakan:

``` javascript
const employee = new Employee("Budi", "ABC");

console.log(employee.name);
console.log(employee.company);
```

## Output

``` text
Budi
ABC
```

## Diagram

``` text
Employee constructor
        │
        ├── super(name)
        │      ↓
        │   Person constructor
        │
        └── this.company
```

## Kunci

> `extends` + `constructor` → harus `super(...)` sebelum `this`.

## Kesalahan Umum

❌ Menggunakan `this` sebelum memanggil `super()` di child constructor
— JavaScript melempar error.

✅ Panggil `super(...)` terlebih dahulu.

------------------------------------------------------------------------

<a id="bagian-14"></a>

# 14. 🟡 Super Method

## Konsep

`super` juga digunakan untuk memanggil method parent.

## Contoh

Parent:

``` javascript
class Person {
    sayHello() {
        console.log("Hello dari Person");
    }
}
```

Child:

``` javascript
class Employee extends Person {
    sayHello() {
        super.sayHello();

        console.log("Hello dari Employee");
    }
}
```

Gunakan:

``` javascript
const employee = new Employee();

employee.sayHello();
```

## Output

``` text
Hello dari Person
Hello dari Employee
```

## Kunci

> `super(...)` → parent constructor, `super.method()` → parent method.

------------------------------------------------------------------------

<a id="bagian-15"></a>

# 15. 🟡 Getter dan Setter di Class

## Konsep

Getter membaca property dengan syntax seperti property biasa, dan
setter mengubahnya seperti assignment.

## Contoh

``` javascript
class Person {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    set fullName(value) {
        const [firstName, lastName] = value.split(" ");

        this.firstName = firstName;
        this.lastName = lastName;
    }
}
```

Getter:

``` javascript
const person = new Person("Budi", "Santoso");

console.log(person.fullName);
```

## Output

``` text
Budi Santoso
```

Setter:

``` javascript
person.fullName = "Andi Wijaya";

console.log(person.fullName);
```

## Output

``` text
Andi Wijaya
```

## Kunci

> `get` → baca seperti property, `set` → assign seperti property.

## Best Practice

- Gunakan getter/setter untuk menghitung nilai turunan atau validasi
  saat property diubah.

------------------------------------------------------------------------

<a id="bagian-16"></a>

# 16. 🟡 Public Class Field

## Konsep

Public class field dapat ditulis langsung di body class tanpa
`constructor`.

## Contoh

``` javascript
class Person {
    species = "Human";

    constructor(name) {
        this.name = name;
    }
}

const person = new Person("Budi");

console.log(person.species);
console.log(person.name);
```

## Output

``` text
Human
Budi
```

Field tersebut dapat diakses dan diubah dari luar:

``` javascript
person.species = "Homo sapiens";

console.log(person.species);
```

## Kunci

> `class Person { name = "Budi"; }` → property bersifat **public**.

------------------------------------------------------------------------

<a id="bagian-17"></a>

# 17. 🟡 Private Class Field

## Konsep

Private class field menggunakan tanda `#` dan benar-benar dibatasi oleh
syntax JavaScript — tidak bisa diakses dari luar.

## Contoh

``` javascript
class BankAccount {
    #balance = 0;

    deposit(amount) {
        this.#balance += amount;
    }

    getBalance() {
        return this.#balance;
    }
}

const account = new BankAccount();

account.deposit(100);

console.log(account.getBalance());
```

## Output

``` text
100
```

Akses langsung dari luar tidak diperbolehkan:

``` javascript
// account.#balance;
// SyntaxError
```

## Diagram

``` text
BankAccount
├── public deposit()
├── public getBalance()
└── private #balance
```

## Kunci

> `#balance` → private, `balance` → public.

## Best Practice

- Gunakan private field (`#`) untuk menyembunyikan detail internal
  (encapsulation).

------------------------------------------------------------------------

<a id="bagian-18"></a>

# 18. 🟡 Private Method

## Konsep

Method juga dapat dibuat private menggunakan `#`. Private method hanya
dapat dipanggil dari dalam class.

## Contoh

``` javascript
class User {
    #validateName(name) {
        return name.length >= 3;
    }

    constructor(name) {
        if (!this.#validateName(name)) {
            throw new Error("Nama terlalu pendek");
        }

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

Private method tidak dapat dipanggil dari luar:

``` javascript
// user.#validateName("Budi");
// SyntaxError
```

## Kunci

> `#method()` → private method.

## Best Practice

- Gunakan private method untuk helper internal yang tidak perlu
  diekspos ke luar class.

------------------------------------------------------------------------

<a id="bagian-19"></a>

# 19. 🟡 Operator instanceof

## Konsep

`instanceof` digunakan untuk mengecek apakah sebuah object merupakan
instance dari constructor/class tertentu berdasarkan prototype chain.

## Contoh

``` javascript
class Person {
}

const person = new Person();

console.log(person instanceof Person);
```

## Output

``` text
true
```

``` javascript
console.log(person instanceof Object);
console.log(person instanceof Array);
```

## Output

``` text
true
false
```

Dengan inheritance:

``` javascript
class Person {
}

class Employee extends Person {
}

const employee = new Employee();

console.log(employee instanceof Employee);
console.log(employee instanceof Person);
```

## Output

``` text
true
true
```

## Kunci

> `object instanceof Class` → `true` / `false`.

------------------------------------------------------------------------

<a id="bagian-20"></a>

# 20. 🟡 Static Field

## Konsep

Static field dimiliki oleh **class**, bukan oleh instance.

## Contoh

``` javascript
class Configuration {
    static appName = "My App";
}

console.log(Configuration.appName);
```

## Output

``` text
My App
```

Tidak diakses melalui instance:

``` javascript
const config = new Configuration();

// config.appName
// undefined
```

## Perbandingan

``` text
instance field
    ↓
object.property

static field
    ↓
Class.property
```

## Kunci

> `static` → milik class, non-static → milik instance.

------------------------------------------------------------------------

<a id="bagian-21"></a>

# 21. 🟡 Static Method

## Konsep

Static method dipanggil melalui class, bukan instance. Cocok untuk
utility yang tidak membutuhkan data instance.

## Contoh

``` javascript
class MathUtil {
    static add(a, b) {
        return a + b;
    }
}

console.log(MathUtil.add(10, 5));
```

## Output

``` text
15
```

Tidak perlu membuat instance:

``` javascript
// const util = new MathUtil();
```

Contoh lain — factory method:

``` javascript
class User {
    static createGuest() {
        return new User("Guest");
    }

    constructor(name) {
        this.name = name;
    }
}

const user = User.createGuest();

console.log(user.name);
```

## Output

``` text
Guest
```

## Kunci

> `Class.method()` — bukan `instance.method()`.

## Best Practice

- Gunakan static method untuk factory (misal `createGuest()`) atau
  utility murni.

------------------------------------------------------------------------

<a id="bagian-22"></a>

# 22. 🟡 Error

## Konsep

JavaScript menyediakan object `Error` untuk merepresentasikan
kesalahan.

## Contoh

``` javascript
const error = new Error("Terjadi kesalahan");

console.log(error.message);
console.log(error.name);
```

## Output

``` text
Terjadi kesalahan
Error
```

Melempar error:

``` javascript
throw new Error("Data tidak valid");
```

Setelah `throw`, alur normal function berhenti sampai error ditangani.

Jenis error bawaan yang umum:

``` text
Error
TypeError
ReferenceError
SyntaxError
RangeError
URIError
EvalError
AggregateError
```

Contoh `TypeError`:

``` javascript
const number = 10;

// number.toUpperCase();
// TypeError
```

## Kunci

> `new Error("pesan")` → `throw error`.

------------------------------------------------------------------------

<a id="bagian-23"></a>

# 23. 🟡 Error Handling

## Konsep

Gunakan `try...catch` untuk menangani error, dan `finally` untuk kode
yang selalu dijalankan.

## Contoh

``` javascript
try {
    throw new Error("Data tidak valid");
} catch (error) {
    console.log(error.message);
}
```

## Output

``` text
Data tidak valid
```

## `finally`

``` javascript
try {
    console.log("Try");
} catch (error) {
    console.log("Catch");
} finally {
    console.log("Finally");
}
```

## Output

``` text
Try
Finally
```

## Pola lengkap

``` text
try
 │
 ├── berhasil ───────┐
 │                   │
 └── error → catch   │
                     ▼
                  finally
```

## Kunci

``` javascript
try {
    // kode berisiko
} catch (error) {
    // tangani error
} finally {
    // selalu dijalankan
}
```

## Kesalahan Umum

❌ Menangkap error lalu menelannya tanpa log.

✅ Catat error (misal `console.error`) dan tangani dengan tepat.

------------------------------------------------------------------------

<a id="bagian-24"></a>

# 24. 🟡 Membuat Class Error

## Konsep

Kita dapat membuat error sendiri dengan `extends Error` agar bisa
membedakan jenis error aplikasi.

## Contoh

``` javascript
class ValidationError extends Error {
    constructor(message) {
        super(message);

        this.name = "ValidationError";
    }
}
```

Gunakan:

``` javascript
function register(name) {
    if (!name) {
        throw new ValidationError("Nama wajib diisi");
    }

    return "Registrasi berhasil";
}
```

Tangani:

``` javascript
try {
    register("");
} catch (error) {
    console.log(error.name);
    console.log(error.message);
}
```

## Output

``` text
ValidationError
Nama wajib diisi
```

Dengan class error, kita dapat membedakan jenis error:

``` javascript
try {
    register("");
} catch (error) {
    if (error instanceof ValidationError) {
        console.log("Error validasi");
    } else {
        console.log("Error lain");
    }
}
```

## Kunci

> `class MyError extends Error` → `throw new MyError("message")`.

## Best Practice

- Buat custom error per jenis kegagalan (validasi, not found, dll)
  agar penanganannya spesifik.

------------------------------------------------------------------------

<a id="bagian-25"></a>

# 25. 🔴 Iterable dan Iterator

## Konsep

**Iterable** adalah object yang dapat digunakan oleh `for...of`.
Iterable memiliki method `Symbol.iterator` yang menghasilkan iterator.

Contoh iterable:

``` text
Array
String
Map
Set
```

## Contoh

``` javascript
const numbers = [10, 20, 30];

for (const number of numbers) {
    console.log(number);
}
```

## Output

``` text
10
20
30
```

## Iterator

``` javascript
const numbers = [10, 20, 30];

const iterator = numbers[Symbol.iterator]();

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

## Output

``` text
{ value: 10, done: false }
{ value: 20, done: false }
{ value: 30, done: false }
{ value: undefined, done: true }
```

## Membuat iterable sendiri

``` javascript
const range = {
    start: 1,
    end: 3,

    [Symbol.iterator]() {
        let current = this.start;
        const end = this.end;

        return {
            next() {
                if (current <= end) {
                    return {
                        value: current++,
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
};
```

Sekarang dapat digunakan dengan `for...of`:

``` javascript
for (const number of range) {
    console.log(number);
}
```

## Output

``` text
1
2
3
```

## Diagram

``` text
iterable
   │
   │ Symbol.iterator()
   ▼
iterator
   │
   │ next()
   ▼
{ value, done }
```

## Kunci

> Iterable → `Symbol.iterator` → Iterator → `next()` → `{ value,
> done }`.

## Best Practice

- Implementasikan `Symbol.iterator` pada class/object yang ingin
  diiterasi dengan `for...of`.

------------------------------------------------------------------------

<a id="bagian-26"></a>

# 26. 🛠️ Mini Flow JavaScript OOP

Gunakan alur ini ketika merancang kode berorientasi object:

``` text
1. Identifikasi object & datanya (property)
        ↓
2. Tentukan behavior-nya (method)
        ↓
3. Pilih pola: object biasa / class
        ↓
4. Sembunyikan detail internal (private #)
        ↓
5. Gunakan inheritance jika ada "is-a"
        ↓
6. Tangani error dengan custom error
```

### Kapan memakai apa?

  Kebutuhan                         Pilihan
  ---------------------------------- ----------------------------
  Object tunggal sederhana           Object literal `{}`
  Pola object berulang               Class
  Berbagi method antar instance      Prototype / method class
  Pewarisan                          `extends` (+ `super`)
  Menyembunyikan data               Private field `#`
  Nilai milik class                 `static`
  Menangani error                   `try/catch/finally`
  Error khusus aplikasi              `class MyError extends Error`
  Iterasi object                    `Symbol.iterator` / `next()`

> **Best practice:** gunakan `class` untuk kode baru, private field
> untuk encapsulation, dan custom error agar error handling spesifik.

------------------------------------------------------------------------

<a id="bagian-27"></a>

# 27. 📚 Tabel Ringkasan

  Materi              API / Syntax                     Tujuan
  ------------------- -------------------------------- -----------------------------
  Pengenalan OOP      object, class                    Memahami OOP
  Constructor Func    `function` + `new`               Membuat object dengan function
  Property            `this.name`                      Menyimpan data instance
  Method              `this.method()`                  Behavior object
  Parameter           `constructor(name)`              Input saat membuat object
  Prototype           `prototype`                      Berbagi method/property
  Proto Inheritance   `Object.create()`                Pewarisan prototype
  Class               `class`                          Syntax OOP modern
  Constructor         `constructor()`                  Inisialisasi instance
  Property Class      `this.property`                  Data instance
  Method Class        `method()`                       Behavior instance
  Class Inheritance   `extends`                        Pewarisan class
  Super Constructor   `super()`                        Memanggil parent constructor
  Super Method        `super.method()`                 Memanggil parent method
  Getter              `get`                            Membaca computed property
  Setter              `set`                            Mengubah property
  Public Field        `field = value`                  Property instance public
  Private Field       `#field`                         Property tersembunyi
  Private Method      `#method()`                      Method internal
  instanceof          `instanceof`                     Cek instance
  Static Field        `static field`                   Data milik class
  Static Method       `static method()`                Utility milik class
  Error               `Error`                          Merepresentasikan error
  Error Handling      `try/catch`                      Menangani error
  Custom Error        `extends Error`                  Error khusus aplikasi
  Iterable            `Symbol.iterator`                Object yang dapat diiterasi
  Iterator            `next()`                         Menghasilkan nilai bertahap

------------------------------------------------------------------------

<a id="bagian-28"></a>

# 28. ⚡ Cheat Code JavaScript OOP 10 Detik

``` text
class      → blueprint object
constructor() → inisialisasi instance
this.prop  → property instance
method()   → behavior
extends    → inheritance
super()    → parent constructor
super.method() → parent method
get / set  → getter / setter
#field     → private
static     → milik class
instanceof → cek instance
try/catch/finally → error handling
class MyError extends Error → custom error
Symbol.iterator → iterable
next()     → iterator
```

## Class dasar

``` javascript
class Person {
    constructor(name) {
        this.name = name;
    }

    sayHello() {
        console.log(`Halo ${this.name}`);
    }
}

const person = new Person("Budi");
```

## Inheritance

``` javascript
class Employee extends Person {
    constructor(name, company) {
        super(name);

        this.company = company;
    }
}
```

## Encapsulation

``` javascript
class BankAccount {
    #balance = 0;

    deposit(amount) {
        this.#balance += amount;
    }
}
```

## Error handling

``` javascript
try {
    throw new Error("Data tidak valid");
} catch (error) {
    console.log(error.message);
} finally {
    console.log("Selesai");
}
```

------------------------------------------------------------------------

<a id="bagian-29"></a>

# 29. 🧭 Urutan Belajar yang Disarankan

``` text
1. Konsep OOP (object, property, method)
        ↓
2. Constructor function
        ↓
3. Prototype & prototype chain
        ↓
4. Class (constructor, property, method)
        ↓
5. Inheritance (extends, super)
        ↓
6. Encapsulation (private #, getter/setter)
        ↓
7. Static field & method
        ↓
8. Error & error handling
        ↓
9. Iterable & iterator
        ↓
10. Mini project
```

Prinsip: kuasai class terlebih dahulu, baru pelajari prototype untuk
memahami apa yang terjadi "di balik layar".

------------------------------------------------------------------------

<a id="bagian-30"></a>

# 30. 🏗️ Mini Project

## Sistem User dan Admin

Project ini menggabungkan:

``` text
class
constructor
property
method
class inheritance
super
static method
getter
private field
instanceof
error handling
custom error
```

## Program

``` javascript
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

class User {
    #password;

    constructor(name, password) {
        if (!name) {
            throw new ValidationError("Nama wajib diisi");
        }

        if (password.length < 6) {
            throw new ValidationError(
                "Password minimal 6 karakter"
            );
        }

        this.name = name;
        this.#password = password;
    }

    get username() {
        return this.name.toLowerCase();
    }

    login(password) {
        return this.#password === password;
    }

    static createGuest() {
        return new User("Guest", "guest123");
    }
}

class Admin extends User {
    constructor(name, password, permissions = []) {
        super(name, password);

        this.permissions = permissions;
    }

    can(permission) {
        return this.permissions.includes(permission);
    }
}

try {
    const admin = new Admin(
        "Budi",
        "rahasia123",
        ["read", "write", "delete"]
    );

    console.log(admin.username);
    console.log(admin.login("rahasia123"));
    console.log(admin.can("delete"));
    console.log(admin instanceof Admin);
    console.log(admin instanceof User);

    const guest = User.createGuest();

    console.log(guest.username);
} catch (error) {
    if (error instanceof ValidationError) {
        console.log(`Validation Error: ${error.message}`);
    } else {
        console.log(`Error: ${error.message}`);
    }
}
```

## Output

``` text
budi
true
true
true
true
guest
```

## Diagram

``` text
                Error
                  │
                  ▼
          ValidationError

                User
        ┌─────────┼─────────┐
        │         │         │
      name     #password   methods
        │
        ▼
      Admin
        │
        └── permissions

Admin
  │
  ├── super(...)
  ├── can()
  └── instanceof User → true
```

## Konsep yang dipakai

``` text
ValidationError → custom error
User            → class + constructor
#password       → private field
get username    → getter
static createGuest() → static method
Admin extends User  → inheritance
super()         → parent constructor
```

------------------------------------------------------------------------

<a id="bagian-31"></a>

# 31. 🔗 Referensi Resmi

- [MDN — Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [MDN — Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
- [MDN — Object prototypes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes)
- [MDN — this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- [MDN — Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- [MDN — try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
- [MDN — Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
- [ECMAScript Language Specification](https://tc39.es/ecma262/)

> **Catatan versi:** Cheatsheet ini menggunakan fitur JavaScript
> modern, termasuk class fields, private fields/methods, static
> fields/methods, dan iterator protocol.
