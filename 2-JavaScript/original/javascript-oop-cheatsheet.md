# JavaScript OOP Cheatsheet — Mudah Dipahami & Diingat

> **Target:** JavaScript modern (ES2020+) dengan fokus Object-Oriented Programming (OOP).
>
> Pola pembahasan: **materi → konsep → kode → output → hafalan**.
>
> JavaScript mendukung OOP berbasis prototype. `class` adalah syntax yang lebih nyaman untuk bekerja dengan prototype, bukan sistem inheritance yang sepenuhnya terpisah dari prototype.

## Daftar Isi

1. [Pengenalan OOP](#1-pengenalan-oop)
2. [Membuat Constructor Function](#2-membuat-constructor-function)
3. [Property di Constructor Function](#3-property-di-constructor-function)
4. [Method di Constructor Function](#4-method-di-constructor-function)
5. [Parameter di Constructor Function](#5-parameter-di-constructor-function)
6. [Constructor Inheritance](#6-constructor-inheritance)
7. [Prototype](#7-prototype)
8. [Prototype Inheritance](#8-prototype-inheritance)
9. [Class](#9-class)
10. [Constructor di Class](#10-constructor-di-class)
11. [Property di Class](#11-property-di-class)
12. [Method di Class](#12-method-di-class)
13. [Class Inheritance](#13-class-inheritance)
14. [Super Constructor](#14-super-constructor)
15. [Super Method](#15-super-method)
16. [Getter dan Setter di Class](#16-getter-dan-setter-di-class)
17. [Public Class Field](#17-public-class-field)
18. [Private Class Field](#18-private-class-field)
19. [Private Method](#19-private-method)
20. [Operator instanceof](#20-operator-instanceof)
21. [Static Field](#21-static-field)
22. [Static Method](#22-static-method)
23. [Error](#23-error)
24. [Error Handling](#24-error-handling)
25. [Membuat Class Error](#25-membuat-class-error)
26. [Iterable dan Iterator](#26-iterable-dan-iterator)
27. [Tabel Ringkasan](#27-tabel-ringkasan)
28. [Mini Project](#28-mini-project)
29. [Cheat Code JavaScript OOP 10 Detik](#29-cheat-code-javascript-oop-10-detik)
30. [Referensi Resmi](#30-referensi-resmi)

---

# 1. Pengenalan OOP

**OOP (Object-Oriented Programming)** adalah pendekatan pemrograman yang mengorganisasi data dan behavior ke dalam object.

Contoh dunia nyata:

```text
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

Konsep OOP yang penting:

```text
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

**Hafalan:**

```text
Property → data
Method   → behavior
Object   → gabungan data + behavior
Class    → blueprint/pola object
```

---

# 2. Membuat Constructor Function

Sebelum `class` populer, JavaScript banyak menggunakan **constructor function** untuk membuat object dengan pola yang sama.

```javascript
function Person() {
}

const person = new Person();

console.log(person);
```

`new` membuat object baru dan menjalankan constructor function.

Constructor function biasanya diawali huruf kapital:

```javascript
function Person() {
}

function Product() {
}

function User() {
}
```

Contoh:

```javascript
function Person() {
    this.name = "Budi";
}

const person = new Person();

console.log(person.name);
```

Output:

```text
Budi
```

**Hafalan:**

```text
function Person() {}
       ↓
new Person()
       ↓
object baru
```

---

# 3. Property di Constructor Function

Property dapat dibuat menggunakan `this`.

```javascript
function Person() {
    this.name = "Budi";
    this.age = 20;
}

const person = new Person();

console.log(person.name);
console.log(person.age);
```

Output:

```text
Budi
20
```

Setiap object hasil constructor memiliki property tersebut.

```javascript
const person1 = new Person();
const person2 = new Person();

console.log(person1.name);
console.log(person2.name);
```

Diagram:

```text
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

**Hafalan:**

```text
this.property = value
```

---

# 4. Method di Constructor Function

Method dapat dibuat langsung di constructor:

```javascript
function Person() {
    this.name = "Budi";

    this.sayHello = function () {
        console.log(`Halo ${this.name}`);
    };
}

const person = new Person();

person.sayHello();
```

Output:

```text
Halo Budi
```

Namun ada masalah: setiap object memiliki function `sayHello` sendiri.

```text
person1.sayHello !== person2.sayHello
```

Untuk method yang dipakai bersama, lebih baik gunakan prototype:

```javascript
Person.prototype.sayHello = function () {
    console.log(`Halo ${this.name}`);
};
```

Dengan prototype, method dapat dibagi oleh banyak instance.

**Hafalan:**

```text
method di constructor → dibuat per object
method di prototype   → dipakai bersama
```

---

# 5. Parameter di Constructor Function

Constructor function dapat menerima parameter.

```javascript
function Person(name, age) {
    this.name = name;
    this.age = age;
}

const person = new Person("Budi", 20);

console.log(person.name);
console.log(person.age);
```

Output:

```text
Budi
20
```

Membuat object lain:

```javascript
const person1 = new Person("Budi", 20);
const person2 = new Person("Andi", 25);

console.log(person1.name);
console.log(person2.name);
```

Output:

```text
Budi
Andi
```

**Hafalan:**

```text
function Person(name, age)
               ↓
new Person("Budi", 20)
```

---

# 6. Constructor Inheritance

Constructor function dapat digunakan untuk inheritance dengan kombinasi `call()` dan prototype.

Contoh parent:

```javascript
function Person(name) {
    this.name = name;
}
```

Child:

```javascript
function Employee(name, company) {
    Person.call(this, name);

    this.company = company;
}
```

Agar prototype child mewarisi prototype parent:

```javascript
Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee;
```

Tambahkan method:

```javascript
Employee.prototype.sayHello = function () {
    console.log(`Halo ${this.name} dari ${this.company}`);
};
```

Gunakan:

```javascript
const employee = new Employee(
    "Budi",
    "ABC"
);

employee.sayHello();
```

Output:

```text
Halo Budi dari ABC
```

Diagram:

```text
Person
  │
  │ prototype
  ▼
Employee
  │
  ▼
employee
```

**Hafalan:**

```text
Person.call(this, ...)
        +
Object.create(Person.prototype)
```

> Untuk kode baru, `class extends` biasanya lebih mudah dibaca.

---

# 7. Prototype

Setiap object JavaScript dapat memiliki hubungan prototype.

Prototype digunakan sebagai tempat berbagi property/method yang dapat diwarisi object.

Contoh:

```javascript
function Person(name) {
    this.name = name;
}

Person.prototype.sayHello = function () {
    console.log(`Halo ${this.name}`);
};

const person = new Person("Budi");

person.sayHello();
```

Output:

```text
Halo Budi
```

Saat `person.sayHello()` dipanggil:

```text
person
  │
  ├── name
  │
  └── prototype
        │
        └── sayHello()
```

Jika property tidak ditemukan langsung pada object, JavaScript mencari pada prototype chain.

**Hafalan:**

```text
object
  ↓
prototype
  ↓
prototype berikutnya
  ↓
null
```

---

# 8. Prototype Inheritance

Prototype inheritance berarti sebuah object dapat mewarisi property/method dari prototype object lain.

Parent:

```javascript
function Person(name) {
    this.name = name;
}

Person.prototype.sayHello = function () {
    console.log(`Halo ${this.name}`);
};
```

Child:

```javascript
function Employee(name, company) {
    Person.call(this, name);

    this.company = company;
}

Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee;
```

Method child:

```javascript
Employee.prototype.work = function () {
    console.log(`${this.name} sedang bekerja`);
};
```

Gunakan:

```javascript
const employee = new Employee(
    "Budi",
    "ABC"
);

employee.sayHello();
employee.work();
```

Output:

```text
Halo Budi
Budi sedang bekerja
```

Diagram:

```text
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

**Hafalan:**

```text
prototype chain = jalur pencarian property/method
```

---

# 9. Class

`class` menyediakan syntax yang lebih nyaman untuk membuat object dan inheritance.

```javascript
class Person {
}
```

Membuat object:

```javascript
const person = new Person();

console.log(person);
```

Contoh lengkap:

```javascript
class Person {
    sayHello() {
        console.log("Hello");
    }
}

const person = new Person();

person.sayHello();
```

Output:

```text
Hello
```

Secara konsep:

```text
class
  ↓
prototype
  ↓
object instance
```

**Hafalan:**

```text
class = syntax modern untuk pola object/prototype
```

---

# 10. Constructor di Class

Class dapat memiliki method khusus bernama `constructor`.

```javascript
class Person {
    constructor(name) {
        this.name = name;
    }
}

const person = new Person("Budi");

console.log(person.name);
```

Output:

```text
Budi
```

`constructor()` dipanggil otomatis ketika menggunakan `new`.

```text
new Person("Budi")
        │
        ▼
constructor("Budi")
        │
        ▼
this.name = "Budi"
```

**Hafalan:**

```text
new Class()
    ↓
constructor()
```

---

# 11. Property di Class

Property instance dapat dibuat di `constructor`.

```javascript
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

const person = new Person(
    "Budi",
    20
);

console.log(person.name);
console.log(person.age);
```

Output:

```text
Budi
20
```

Property instance:

```text
person
├── name
└── age
```

Setiap instance memiliki property masing-masing:

```javascript
const person1 = new Person("Budi", 20);
const person2 = new Person("Andi", 25);
```

**Hafalan:**

```text
this.name = ...
→ property instance
```

---

# 12. Method di Class

Method ditulis langsung di dalam class.

```javascript
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

Output:

```text
Halo Budi
```

Method class berada pada prototype:

```text
Person.prototype
      │
      └── sayHello()
```

Jadi method tidak perlu dibuat ulang sebagai function sendiri pada setiap instance.

**Hafalan:**

```javascript
class Person {
    method() {
    }
}
```

---

# 13. Class Inheritance

Gunakan `extends` untuk membuat child class.

Parent:

```javascript
class Person {
    sayHello() {
        console.log("Hello");
    }
}
```

Child:

```javascript
class Employee extends Person {
    work() {
        console.log("Working");
    }
}
```

Gunakan:

```javascript
const employee = new Employee();

employee.sayHello();
employee.work();
```

Output:

```text
Hello
Working
```

Diagram:

```text
Person
  │
  │ extends
  ▼
Employee
  │
  ▼
employee
```

**Hafalan:**

```text
class Child extends Parent
```

---

# 14. Super Constructor

Jika child class memiliki `constructor`, child harus memanggil `super()` sebelum menggunakan `this`.

Parent:

```javascript
class Person {
    constructor(name) {
        this.name = name;
    }
}
```

Child:

```javascript
class Employee extends Person {
    constructor(name, company) {
        super(name);

        this.company = company;
    }
}
```

Gunakan:

```javascript
const employee = new Employee(
    "Budi",
    "ABC"
);

console.log(employee.name);
console.log(employee.company);
```

Output:

```text
Budi
ABC
```

Diagram:

```text
Employee constructor
        │
        ├── super(name)
        │      ↓
        │   Person constructor
        │
        └── this.company
```

**Hafalan:**

```text
extends + constructor
        ↓
harus super(...) sebelum this
```

---

# 15. Super Method

`super` juga digunakan untuk memanggil method parent.

Parent:

```javascript
class Person {
    sayHello() {
        console.log("Hello dari Person");
    }
}
```

Child:

```javascript
class Employee extends Person {
    sayHello() {
        super.sayHello();

        console.log("Hello dari Employee");
    }
}
```

Gunakan:

```javascript
const employee = new Employee();

employee.sayHello();
```

Output:

```text
Hello dari Person
Hello dari Employee
```

**Hafalan:**

```text
super(...)          → parent constructor
super.method()      → parent method
```

---

# 16. Getter dan Setter di Class

Getter membaca property dengan syntax seperti property biasa.

```javascript
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

```javascript
const person = new Person(
    "Budi",
    "Santoso"
);

console.log(person.fullName);
```

Output:

```text
Budi Santoso
```

Setter:

```javascript
person.fullName = "Andi Wijaya";

console.log(person.fullName);
```

Output:

```text
Andi Wijaya
```

**Hafalan:**

```text
get → baca seperti property
set → assign seperti property
```

---

# 17. Public Class Field

Public class field dapat ditulis langsung di body class.

```javascript
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

Output:

```text
Human
Budi
```

Field tersebut dapat diakses dari luar:

```javascript
person.species = "Homo sapiens";

console.log(person.species);
```

**Hafalan:**

```javascript
class Person {
    name = "Budi";
}
```

Property tersebut bersifat **public**.

---

# 18. Private Class Field

Private class field menggunakan tanda `#`.

```javascript
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

Output:

```text
100
```

Akses langsung dari luar tidak diperbolehkan:

```javascript
// account.#balance;
// SyntaxError
```

Private field benar-benar dibatasi oleh syntax JavaScript.

Diagram:

```text
BankAccount
├── public deposit()
├── public getBalance()
└── private #balance
```

**Hafalan:**

```text
#balance → private
balance  → public
```

---

# 19. Private Method

Method juga dapat dibuat private menggunakan `#`.

```javascript
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

Output:

```text
Budi
```

Private method tidak dapat dipanggil dari luar:

```javascript
// user.#validateName("Budi");
// SyntaxError
```

**Hafalan:**

```text
#method() → private method
```

---

# 20. Operator instanceof

`instanceof` digunakan untuk mengecek apakah sebuah object merupakan instance dari constructor/class tertentu berdasarkan prototype chain.

```javascript
class Person {
}

const person = new Person();

console.log(person instanceof Person);
```

Output:

```text
true
```

Contoh:

```javascript
console.log(person instanceof Object);
console.log(person instanceof Array);
```

Output:

```text
true
false
```

Dengan inheritance:

```javascript
class Person {
}

class Employee extends Person {
}

const employee = new Employee();

console.log(employee instanceof Employee);
console.log(employee instanceof Person);
```

Output:

```text
true
true
```

**Hafalan:**

```text
object instanceof Class
→ true / false
```

---

# 21. Static Field

Static field dimiliki oleh **class**, bukan oleh instance.

```javascript
class Configuration {
    static appName = "My App";
}

console.log(Configuration.appName);
```

Output:

```text
My App
```

Tidak diakses melalui instance:

```javascript
const config = new Configuration();

// config.appName
// undefined
```

Perbandingan:

```text
instance field
    ↓
object.property

static field
    ↓
Class.property
```

Contoh:

```javascript
class User {
    static role = "user";

    constructor(name) {
        this.name = name;
    }
}

const user = new User("Budi");

console.log(User.role);
console.log(user.name);
```

Output:

```text
user
Budi
```

**Hafalan:**

```text
static → milik class
non-static → milik instance
```

---

# 22. Static Method

Static method dipanggil melalui class, bukan instance.

```javascript
class MathUtil {
    static add(a, b) {
        return a + b;
    }
}

console.log(MathUtil.add(10, 5));
```

Output:

```text
15
```

Tidak perlu:

```javascript
const util = new MathUtil();
```

Static method cocok untuk utility yang tidak membutuhkan data instance.

Contoh:

```javascript
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

Output:

```text
Guest
```

**Hafalan:**

```text
Class.method()
```

bukan:

```text
instance.method()
```

---

# 23. Error

JavaScript menyediakan object `Error` untuk merepresentasikan kesalahan.

```javascript
const error = new Error("Terjadi kesalahan");

console.log(error.message);
console.log(error.name);
```

Output:

```text
Terjadi kesalahan
Error
```

Melempar error:

```javascript
throw new Error("Data tidak valid");
```

Setelah `throw`, alur normal function berhenti sampai error ditangani.

Jenis error bawaan yang umum:

```text
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

```javascript
const number = 10;

// number.toUpperCase();
// TypeError
```

**Hafalan:**

```text
new Error("pesan")
throw error
```

---

# 24. Error Handling

Gunakan `try...catch` untuk menangani error.

```javascript
try {
    throw new Error("Data tidak valid");
} catch (error) {
    console.log(error.message);
}
```

Output:

```text
Data tidak valid
```

## `finally`

`finally` dijalankan setelah `try/catch`, baik terjadi error maupun tidak.

```javascript
try {
    console.log("Try");
} catch (error) {
    console.log("Catch");
} finally {
    console.log("Finally");
}
```

Output:

```text
Try
Finally
```

## Pola lengkap

```text
try
 │
 ├── berhasil ───────┐
 │                   │
 └── error → catch   │
                     ▼
                  finally
```

**Hafalan:**

```javascript
try {
    // kode berisiko
} catch (error) {
    // tangani error
} finally {
    // selalu dijalankan
}
```

---

# 25. Membuat Class Error

Kita dapat membuat error sendiri dengan `extends Error`.

```javascript
class ValidationError extends Error {
    constructor(message) {
        super(message);

        this.name = "ValidationError";
    }
}
```

Gunakan:

```javascript
function register(name) {
    if (!name) {
        throw new ValidationError(
            "Nama wajib diisi"
        );
    }

    return "Registrasi berhasil";
}
```

Tangani:

```javascript
try {
    register("");
} catch (error) {
    console.log(error.name);
    console.log(error.message);
}
```

Output:

```text
ValidationError
Nama wajib diisi
```

Dengan class error, kita dapat membedakan jenis error.

```javascript
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

**Hafalan:**

```text
class MyError extends Error
```

Lalu:

```text
throw new MyError("message")
```

---

# 26. Iterable dan Iterator

**Iterable** adalah object yang dapat digunakan oleh `for...of`.

Contoh iterable:

```text
Array
String
Map
Set
```

Contoh:

```javascript
const numbers = [10, 20, 30];

for (const number of numbers) {
    console.log(number);
}
```

Output:

```text
10
20
30
```

## Iterator

Iterable memiliki method `Symbol.iterator` yang menghasilkan iterator.

```javascript
const numbers = [10, 20, 30];

const iterator = numbers[Symbol.iterator]();

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

Output:

```text
{ value: 10, done: false }
{ value: 20, done: false }
{ value: 30, done: false }
{ value: undefined, done: true }
```

Pola iterator:

```text
iterator.next()
       │
       ▼
{ value, done }
```

## Membuat iterable sendiri

```javascript
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

```javascript
for (const number of range) {
    console.log(number);
}
```

Output:

```text
1
2
3
```

Diagram:

```text
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

**Hafalan:**

```text
Iterable
   ↓
Symbol.iterator
   ↓
Iterator
   ↓
next()
   ↓
{ value, done }
```

---

# 27. Tabel Ringkasan

| Materi | Fungsi | Kata Kunci |
| --- | --- | --- |
| Pengenalan OOP | Memahami object-oriented programming | object, class |
| Constructor Function | Membuat object dengan function | `function`, `new` |
| Property Constructor | Menyimpan data instance | `this.name` |
| Method Constructor | Behavior object | `this.method()` |
| Parameter Constructor | Input saat membuat object | `constructor(name)` |
| Constructor Inheritance | Pewarisan constructor lama | `call()` |
| Prototype | Berbagi method/property | `prototype` |
| Prototype Inheritance | Pewarisan prototype | `Object.create()` |
| Class | Syntax OOP modern | `class` |
| Constructor Class | Inisialisasi instance | `constructor()` |
| Property Class | Data instance | `this.property` |
| Method Class | Behavior instance | `method()` |
| Class Inheritance | Pewarisan class | `extends` |
| Super Constructor | Memanggil parent constructor | `super()` |
| Super Method | Memanggil parent method | `super.method()` |
| Getter | Membaca computed property | `get` |
| Setter | Mengubah property | `set` |
| Public Field | Property instance public | `field = value` |
| Private Field | Property tersembunyi | `#field` |
| Private Method | Method internal | `#method()` |
| instanceof | Cek instance | `instanceof` |
| Static Field | Data milik class | `static field` |
| Static Method | Utility milik class | `static method()` |
| Error | Merepresentasikan error | `Error` |
| Error Handling | Menangani error | `try/catch` |
| Custom Error | Error khusus aplikasi | `extends Error` |
| Iterable | Object yang dapat diiterasi | `Symbol.iterator` |
| Iterator | Menghasilkan nilai bertahap | `next()` |

---

# 28. Mini Project

## Sistem User dan Admin

Project ini menggabungkan:

```text
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

### Program

```javascript
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
            throw new ValidationError(
                "Nama wajib diisi"
            );
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
        console.log(
            `Validation Error: ${error.message}`
        );
    } else {
        console.log(
            `Error: ${error.message}`
        );
    }
}
```

Output:

```text
budi
true
true
true
true
guest
```

Diagram:

```text
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

### Konsep yang dipakai

```text
ValidationError
    ↓
custom error

User
    ↓
class + constructor
    ↓
#password
    ↓
private field
    ↓
get username
    ↓
getter
    ↓
static createGuest()
    ↓
static method

Admin extends User
    ↓
inheritance
    ↓
super()
```

---

# 29. Cheat Code JavaScript OOP 10 Detik

> **Constructor function dibuat dengan `function` dan dipanggil menggunakan `new`. Property instance biasanya disimpan melalui `this`, sedangkan method dapat ditempatkan di prototype agar dipakai bersama. Prototype membentuk prototype chain dan menjadi dasar inheritance JavaScript. `class` adalah syntax yang lebih nyaman untuk pola tersebut. Gunakan `extends` untuk inheritance, `super()` untuk parent constructor, dan `super.method()` untuk parent method. Getter/setter memakai `get`/`set`, public field dapat ditulis langsung di class, sedangkan private field/method memakai `#`. `instanceof` mengecek hubungan instance dengan prototype chain. `static` berarti milik class, bukan instance. Error dibuat dengan `new Error()`, dilempar dengan `throw`, dan ditangani menggunakan `try/catch/finally`. Custom error dibuat dengan `class MyError extends Error`. Iterable menyediakan `Symbol.iterator`, sedangkan iterator menyediakan `next()` yang menghasilkan `{ value, done }`.**

---

# 30. Referensi Resmi

- **MDN — Classes**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

- **MDN — Inheritance and the prototype chain**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain

- **MDN — Object prototypes**  
  https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes

- **MDN — `this`**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this

- **MDN — Error**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error

- **MDN — `try...catch`**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch

- **MDN — Iteration protocols**  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols

- **ECMAScript Language Specification**  
  https://tc39.es/ecma262/

> **Catatan versi:** Cheatsheet ini menggunakan fitur JavaScript modern, termasuk class fields, private fields/methods, static fields/methods, dan iterator protocol.
