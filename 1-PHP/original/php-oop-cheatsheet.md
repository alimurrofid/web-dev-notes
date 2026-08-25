# PHP OOP Cheatsheet — Mudah Dipahami & Diingat

> **Tujuan:** menjadi peta cepat PHP OOP. Semua contoh dibuat singkat agar mudah dicoba dan dihafalkan.
>
> **Catatan:** contoh membutuhkan PHP 8+ kecuali disebutkan lain.

## Daftar Isi

1. [Pengenalan OOP](#1-pengenalan-oop)
2. [Class](#2-class)
3. [Object](#3-object)
4. [Properties](#4-properties)
5. [Function / Method](#5-function--method)
6. [`$this` Keyword](#6-this-keyword)
7. [Constant](#7-constant)
8. [`self` Keyword](#8-self-keyword)
9. [Constructor](#9-constructor)
10. [Destructor](#10-destructor)
11. [Inheritance](#11-inheritance)
12. [Namespace](#12-namespace)
13. [Import](#13-import)
14. [Visibility](#14-visibility)
15. [Function Overriding](#15-function-overriding)
16. [`parent` Keyword](#16-parent-keyword)
17. [Constructor Overriding](#17-constructor-overriding)
18. [Polymorphism](#18-polymorphism)
19. [Type Check dan Casts](#19-type-check-dan-casts)
20. [Abstract Class](#20-abstract-class)
21. [Abstract Function](#21-abstract-function)
22. [Getter dan Setter](#22-getter-dan-setter)
23. [Interface](#23-interface)
24. [Interface Inheritance](#24-interface-inheritance)
25. [Trait](#25-trait)
26. [Trait Overriding](#26-trait-overriding)
27. [Trait Conflict](#27-trait-conflict)
28. [Trait Inheritance](#28-trait-inheritance)
29. [Final Class](#29-final-class)
30. [Final Function](#30-final-function)
31. [Anonymous Class](#31-anonymous-class)
32. [`static` Keyword](#32-static-keyword)
33. [`stdClass`](#33-stdclass)
34. [Object Iteration](#34-object-iteration)
35. [Generator](#35-generator)
36. [Object Cloning](#36-object-cloning)
37. [Comparing Object](#37-comparing-object)
38. [Magic Function](#38-magic-function)
39. [Overloading](#39-overloading)
40. [Covariance dan Contravariance](#40-covariance-dan-contravariance)
41. [DateTime](#41-datetime)
42. [Exception](#42-exception)
43. [Regular Expression](#43-regular-expression)
44. [Reflection](#44-reflection)
45. [Peta Ingatan Cepat](#45-peta-ingatan-cepat)

---

## 1. Pengenalan OOP

**OOP (Object-Oriented Programming)** adalah cara menyusun program berdasarkan **object**.

### Cara mengingat

```text
CLASS = cetak biru
OBJECT = benda nyata
PROPERTY = data
METHOD = perilaku
```

Contoh:

```php
class Mobil
{
    public string $merk;

    public function jalan(): void
    {
        echo "Mobil berjalan";
    }
}

$mobil = new Mobil();
$mobil->merk = "Toyota";
$mobil->jalan();
```

**Output:**
```text
Mobil berjalan
```

Diagram:

```text
             CLASS Mobil
          ┌───────────────┐
          │ merk          │ ← property
          │ jalan()       │ ← method
          └───────┬───────┘
                  │ new
                  ▼
             OBJECT $mobil
```

---

## 2. Class

Class adalah **template/cetak biru**.

```php
class User
{
    public string $name;

    public function sayHello(): void
    {
        echo "Halo";
    }
}
```

Belum ada object sampai kita menggunakan `new`.

**Ingat:** `class = rancangan`.

---

## 3. Object

Object adalah **instance/hasil dari class**.

```php
class User
{
    public string $name;
}

$user = new User();
$user->name = "Budi";

echo $user->name;
```

**Output:**
```text
Budi
```

Diagram:

```text
class User
    │
    ├── new User() ──> $user
    │                    │
    │                    └── name = Budi
    │
    └── new User() ──> $user2
```

---

## 4. Properties

Property adalah data yang dimiliki object.

```php
class Product
{
    public string $name;
    public int $price;
}

$product = new Product();
$product->name = "Buku";
$product->price = 50000;

echo $product->name . ": " . $product->price;
```

**Output:**
```text
Buku: 50000
```

Akses property:

```php
$object->property
```

---

## 5. Function / Method

Function di dalam class biasanya disebut **method**.

```php
class Calculator
{
    public function add(int $a, int $b): int
    {
        return $a + $b;
    }
}

$calc = new Calculator();

echo $calc->add(10, 5);
```

**Output:**
```text
15
```

Ingat:

```text
Property = "punya apa?"
Method   = "bisa melakukan apa?"
```

---

## 6. `$this` Keyword

`$this` menunjuk ke **object yang sedang aktif**.

```php
class User
{
    public string $name;

    public function greet(): void
    {
        echo "Halo " . $this->name;
    }
}

$user = new User();
$user->name = "Budi";
$user->greet();
```

**Output:**
```text
Halo Budi
```

Diagram:

```text
$user
  │
  ▼
$this
  │
  └── $this->name
          ↓
        Budi
```

**Ingat:** `$this = object ini`.

---

## 7. Constant

Constant adalah nilai yang **tidak berubah**.

### Class constant

```php
class App
{
    public const VERSION = "1.0";
}

echo App::VERSION;
```

**Output:**
```text
1.0
```

Akses constant class:

```php
ClassName::CONSTANT
```

**Ingat:** property memakai `->`, constant memakai `::`.

---

## 8. `self` Keyword

`self` menunjuk ke **class tempat kode tersebut ditulis**.

```php
class Config
{
    public const APP_NAME = "Belajar PHP";

    public static function name(): void
    {
        echo self::APP_NAME;
    }
}

Config::name();
```

**Output:**
```text
Belajar PHP
```

Ingat:

```text
$this  → object saat ini
self   → class saat ini
parent → parent class
static → class yang dipanggil secara dinamis
```

---

## 9. Constructor

Constructor adalah method khusus yang otomatis dipanggil saat object dibuat.

```php
class User
{
    public function __construct(public string $name)
    {
        echo "User dibuat\n";
    }
}

$user = new User("Budi");
echo $user->name;
```

**Output:**
```text
User dibuat
Budi
```

Diagram:

```text
new User("Budi")
       │
       ▼
__construct()
       │
       ▼
Object siap digunakan
```

### Constructor Property Promotion

PHP modern memungkinkan:

```php
class User
{
    public function __construct(
        public string $name,
        private int $age
    ) {}
}
```

---

## 10. Destructor

Destructor dipanggil ketika object dihancurkan atau script selesai.

```php
class FileManager
{
    public function __construct()
    {
        echo "Buka\n";
    }

    public function __destruct()
    {
        echo "Tutup";
    }
}

$file = new FileManager();
```

**Output kira-kira:**
```text
Buka
Tutup
```

**Ingat:**

```text
__construct() → mulai
__destruct()  → selesai
```

Jangan mengandalkan urutan destructor untuk logika bisnis penting.

---

## 11. Inheritance

Inheritance = class anak mewarisi class induk.

```php
class Animal
{
    public function eat(): void
    {
        echo "Makan";
    }
}

class Cat extends Animal
{
}

$cat = new Cat();
$cat->eat();
```

**Output:**
```text
Makan
```

Diagram:

```text
Animal
  │
  │ extends
  ▼
 Cat
  │
  └── mewarisi eat()
```

**Ingat:** `extends = mewarisi`.

---

## 12. Namespace

Namespace mencegah bentroknya nama class.

```php
namespace App\Models;

class User
{
}
```

Class tersebut memiliki nama lengkap:

```text
App\Models\User
```

Biasanya struktur project:

```text
App\
├── Models\
│   └── User.php
└── Services\
    └── UserService.php
```

**Ingat:** namespace = alamat class.

---

## 13. Import

`use` digunakan untuk mengimpor class/interface/trait dari namespace lain.

```php
namespace App\Controllers;

use App\Models\User;

class UserController
{
    public function show(): void
    {
        $user = new User();
    }
}
```

Tanpa `use`, kita dapat memakai nama lengkap:

```php
$user = new \App\Models\User();
```

**Ingat:**

```text
namespace = menentukan alamat
use       = mengambil/mengimpor alamat
```

---

## 14. Visibility

Visibility menentukan **siapa yang boleh mengakses** member class.

| Visibility | Class sendiri | Child | Dari luar |
|---|---:|---:|---:|
| `public` | ✓ | ✓ | ✓ |
| `protected` | ✓ | ✓ | ✗ |
| `private` | ✓ | ✗ | ✗ |

Contoh:

```php
class User
{
    public string $name = "Budi";
    protected string $email = "budi@mail.com";
    private string $password = "123";
}

$user = new User();

echo $user->name; // boleh
// echo $user->email;    // error
// echo $user->password; // error
```

Diagram:

```text
public    → semua
protected → class + child
private   → class sendiri
```

---

## 15. Function Overriding

Child class mengganti implementasi method parent.

```php
class Animal
{
    public function sound(): void
    {
        echo "Suara hewan";
    }
}

class Cat extends Animal
{
    public function sound(): void
    {
        echo "Meong";
    }
}

$cat = new Cat();
$cat->sound();
```

**Output:**
```text
Meong
```

**Ingat:** overriding = "method parent diganti oleh child".

---

## 16. `parent` Keyword

`parent` digunakan untuk mengakses parent class.

```php
class Animal
{
    public function sound(): void
    {
        echo "Suara\n";
    }
}

class Cat extends Animal
{
    public function sound(): void
    {
        parent::sound();
        echo "Meong";
    }
}

(new Cat())->sound();
```

**Output:**
```text
Suara
Meong
```

Ingat:

```text
self::   → class sendiri
parent:: → parent
```

---

## 17. Constructor Overriding

Child boleh memiliki constructor sendiri.

```php
class User
{
    public function __construct(public string $name)
    {
    }
}

class Admin extends User
{
    public function __construct(
        string $name,
        public string $role
    ) {
        parent::__construct($name);
    }
}

$admin = new Admin("Budi", "superadmin");

echo $admin->name . " - " . $admin->role;
```

**Output:**
```text
Budi - superadmin
```

**Penting:** constructor child tidak otomatis menjalankan constructor parent. Jika perlu, panggil:

```php
parent::__construct(...);
```

---

## 18. Polymorphism

Polymorphism = **satu bentuk pemanggilan, banyak perilaku**.

```php
interface Animal
{
    public function sound(): string;
}

class Cat implements Animal
{
    public function sound(): string
    {
        return "Meong";
    }
}

class Dog implements Animal
{
    public function sound(): string
    {
        return "Guk";
    }
}

function makeSound(Animal $animal): void
{
    echo $animal->sound();
}

makeSound(new Cat());
echo "\n";
makeSound(new Dog());
```

**Output:**
```text
Meong
Guk
```

Diagram:

```text
          Animal
         /      \
       Cat      Dog
        │        │
     Meong      Guk
         \      /
          ↓    ↓
       makeSound()
```

---

## 19. Type Check dan Casts

### `instanceof`

Mengecek apakah object merupakan instance dari class/interface tertentu.

```php
class User {}

$user = new User();

var_dump($user instanceof User);
```

**Output:**
```text
bool(true)
```

### Type declaration

```php
function greet(User $user): string
{
    return "Halo";
}
```

PHP akan memastikan argumennya sesuai tipe.

### Casting sederhana

```php
$value = "123";

$number = (int) $value;

var_dump($number);
```

**Output:**
```text
int(123)
```

Untuk object, gunakan tipe/interface yang sesuai daripada mengandalkan casting sembarangan.

---

## 20. Abstract Class

Abstract class adalah class yang **tidak dapat langsung dibuat object**.

```php
abstract class Animal
{
    abstract public function sound(): string;
}

class Cat extends Animal
{
    public function sound(): string
    {
        return "Meong";
    }
}

$cat = new Cat();

echo $cat->sound();
```

**Output:**
```text
Meong
```

Ini tidak boleh:

```php
// $animal = new Animal();
```

**Ingat:** abstract class = blueprint yang belum lengkap.

---

## 21. Abstract Function

Abstract function adalah method yang **hanya dideklarasikan**, implementasinya wajib dibuat oleh child.

```php
abstract class Shape
{
    abstract public function area(): float;
}

class Square extends Shape
{
    public function __construct(private float $side)
    {
    }

    public function area(): float
    {
        return $this->side * $this->side;
    }
}

echo (new Square(5))->area();
```

**Output:**
```text
25
```

---

## 22. Getter dan Setter

Getter = mengambil nilai.

Setter = mengubah nilai.

```php
class User
{
    private string $name = "";

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }
}

$user = new User();
$user->setName("Budi");

echo $user->getName();
```

**Output:**
```text
Budi
```

Kenapa tidak langsung `public`?

Agar kita dapat memberi aturan:

```php
public function setAge(int $age): void
{
    if ($age < 0) {
        throw new InvalidArgumentException("Umur tidak valid");
    }

    $this->age = $age;
}
```

---

## 23. Interface

Interface adalah **kontrak**.

Class yang `implements` interface wajib memenuhi method yang ditentukan.

```php
interface Payment
{
    public function pay(int $amount): string;
}

class Cash implements Payment
{
    public function pay(int $amount): string
    {
        return "Bayar cash: $amount";
    }
}

$payment = new Cash();

echo $payment->pay(50000);
```

**Output:**
```text
Bayar cash: 50000
```

Diagram:

```text
       Payment
      interface
          │
      implements
          ▼
         Cash
```

---

## 24. Interface Inheritance

Interface dapat mewarisi interface lain menggunakan `extends`.

```php
interface Readable
{
    public function read(): string;
}

interface Writable
{
    public function write(string $data): void;
}

interface Document extends Readable, Writable
{
}

class FileDocument implements Document
{
    public function read(): string
    {
        return "isi file";
    }

    public function write(string $data): void
    {
        echo "Tulis: $data";
    }
}

$file = new FileDocument();

echo $file->read() . "\n";
$file->write("Halo");
```

**Output:**
```text
isi file
Tulis: Halo
```

---

## 25. Trait

Trait digunakan untuk **berbagi implementasi method** antar class.

```php
trait Logger
{
    public function log(string $message): void
    {
        echo "[LOG] $message";
    }
}

class User
{
    use Logger;
}

(new User())->log("Login");
```

**Output:**
```text
[LOG] Login
```

Diagram:

```text
Trait Logger
     │
     │ use
     ▼
   User
     │
     └── log()
```

**Ingat:** trait = potongan kemampuan yang bisa ditempel ke class.

---

## 26. Trait Overriding

Method dari trait dapat diganti oleh method class.

```php
trait Logger
{
    public function log(): string
    {
        return "Trait";
    }
}

class App
{
    use Logger;

    public function log(): string
    {
        return "Class";
    }
}

echo (new App())->log();
```

**Output:**
```text
Class
```

Prioritas sederhananya:

```text
Class
  ↓
Trait
  ↓
Parent
```

---

## 27. Trait Conflict

Jika dua trait mempunyai method dengan nama sama, PHP membutuhkan aturan `insteadof`.

```php
trait A
{
    public function hello(): string
    {
        return "A";
    }
}

trait B
{
    public function hello(): string
    {
        return "B";
    }
}

class Test
{
    use A, B {
        A::hello insteadof B;
    }
}

echo (new Test())->hello();
```

**Output:**
```text
A
```

Kita juga dapat memberi alias:

```php
use A, B {
    A::hello insteadof B;
    B::hello as helloB;
}
```

---

## 28. Trait Inheritance

Trait dapat digunakan pada parent dan child.

```php
trait Logger
{
    public function log(): string
    {
        return "log";
    }
}

class ParentClass
{
    use Logger;
}

class ChildClass extends ParentClass
{
}

echo (new ChildClass())->log();
```

**Output:**
```text
log
```

Catatan: ini adalah kombinasi **inheritance class + penggunaan trait**, bukan `trait extends class`.

---

## 29. Final Class

`final class` tidak boleh diwarisi.

```php
final class Config
{
    public function get(): string
    {
        return "config";
    }
}

// class AppConfig extends Config {} // Error
```

**Ingat:** `final class = jangan diwarisi`.

---

## 30. Final Function

`final` pada method berarti method tersebut tidak boleh dioverride child.

```php
class ParentClass
{
    final public function hello(): string
    {
        return "Hello";
    }
}

class ChildClass extends ParentClass
{
    // public function hello(): string {} // Error
}
```

**Ingat:**

```text
final class    → tidak boleh extends
final method   → tidak boleh override
```

---

## 31. Anonymous Class

Anonymous class adalah class tanpa nama.

```php
$logger = new class {
    public function log(): string
    {
        return "Halo dari anonymous class";
    }
};

echo $logger->log();
```

**Output:**
```text
Halo dari anonymous class
```

Cocok untuk object kecil yang hanya digunakan sekali.

---

## 32. `static` Keyword

`static` membuat member menjadi milik **class**, bukan object tertentu.

```php
class Counter
{
    public static int $count = 0;

    public static function increment(): void
    {
        self::$count++;
    }
}

Counter::increment();
Counter::increment();

echo Counter::$count;
```

**Output:**
```text
2
```

Akses static:

```php
ClassName::$property
ClassName::method()
```

Bukan:

```php
$object->property
```

---

## 33. `stdClass`

`stdClass` adalah class kosong bawaan PHP yang sering digunakan sebagai object sederhana.

```php
$user = new stdClass();

$user->name = "Budi";
$user->age = 20;

echo $user->name;
```

**Output:**
```text
Budi
```

Cara mengingat:

```text
stdClass = object kosong untuk data sederhana
```

---

## 34. Object Iteration

Object dapat di-loop dengan `foreach`.

```php
class User
{
    public string $name = "Budi";
    public int $age = 20;
}

$user = new User();

foreach ($user as $key => $value) {
    echo "$key = $value\n";
}
```

**Output:**
```text
name = Budi
age = 20
```

Catatan: property `private`/`protected` memiliki aturan visibility saat iterasi dilakukan dari luar class.

---

## 35. Generator

Generator menggunakan `yield` untuk menghasilkan nilai **satu per satu**.

```php
function numbers(): Generator
{
    yield 1;
    yield 2;
    yield 3;
}

foreach (numbers() as $number) {
    echo $number . "\n";
}
```

**Output:**
```text
1
2
3
```

Diagram:

```text
Generator
   │
 yield 1 ──> dipakai
   │
 yield 2 ──> dipakai
   │
 yield 3 ──> dipakai
```

Keuntungannya: tidak harus membuat seluruh hasil sekaligus di memory.

---

## 36. Object Cloning

`clone` membuat object baru berdasarkan object lama.

```php
class User
{
    public function __construct(public string $name)
    {
    }
}

$user1 = new User("Budi");
$user2 = clone $user1;

$user2->name = "Andi";

echo $user1->name . "\n";
echo $user2->name;
```

**Output:**
```text
Budi
Andi
```

Diagram:

```text
$user1
  │
 clone
  ▼
$user2

Object berbeda
Data awal sama
```

Untuk mengatur proses clone, gunakan:

```php
__clone()
```

---

## 37. Comparing Object

Ada dua operator penting:

```php
==
===
```

### `==`

Membandingkan object berdasarkan nilai/property tertentu.

### `===`

Mengecek apakah keduanya merupakan **instance object yang sama**.

```php
class User
{
    public function __construct(public string $name)
    {
    }
}

$a = new User("Budi");
$b = new User("Budi");
$c = $a;

var_dump($a == $b);
var_dump($a === $b);
var_dump($a === $c);
```

**Output:**
```text
bool(true)
bool(false)
bool(true)
```

Ingat:

```text
==  → nilai/state setara
=== → object yang sama
```

---

## 38. Magic Function

Magic methods adalah method khusus yang namanya diawali `__`.

Contoh populer:

```text
__construct()
__destruct()
__get()
__set()
__isset()
__unset()
__call()
__callStatic()
__toString()
__clone()
__invoke()
```

Contoh `__toString()`:

```php
class User
{
    public function __construct(public string $name)
    {
    }

    public function __toString(): string
    {
        return $this->name;
    }
}

$user = new User("Budi");

echo $user;
```

**Output:**
```text
Budi
```

**Ingat:** magic method = PHP otomatis memanggilnya pada kondisi tertentu.

---

## 39. Overloading

Dalam PHP, istilah **overloading** terutama merujuk pada mekanisme magic methods untuk menangani property/method yang tidak dapat diakses secara normal.

Contoh property overloading:

```php
class User
{
    private array $data = [];

    public function __get(string $name): mixed
    {
        return $this->data[$name] ?? null;
    }

    public function __set(string $name, mixed $value): void
    {
        $this->data[$name] = $value;
    }
}

$user = new User();

$user->name = "Budi";

echo $user->name;
```

**Output:**
```text
Budi
```

Catatan penting:

> PHP tidak melakukan method overloading seperti Java/C++ berdasarkan jumlah/tipe parameter. Untuk kasus seperti itu biasanya digunakan optional parameter, union type, variadic, atau magic `__call()`.

---

## 40. Covariance dan Contravariance

Ini berhubungan dengan **tipe return dan parameter pada inheritance**.

### Covariance

Return type child boleh lebih spesifik.

```php
class Animal {}

class Cat extends Animal {}

class Factory
{
    public function create(): Animal
    {
        return new Animal();
    }
}

class CatFactory extends Factory
{
    public function create(): Cat
    {
        return new Cat();
    }
}
```

Diagram:

```text
Return:
Animal
  ↑
 Cat  ← lebih spesifik
```

### Contravariance

Parameter child boleh menerima tipe yang **lebih umum**.

```php
class Animal {}
class Cat extends Animal {}

class Handler
{
    public function handle(Cat $cat): void
    {
    }
}

class GeneralHandler extends Handler
{
    public function handle(Animal $animal): void
    {
    }
}
```

Cara mengingat:

```text
Covariance       → return → lebih spesifik
Contravariance   → parameter → lebih umum
```

---

## 41. DateTime

PHP menyediakan class `DateTime` untuk bekerja dengan tanggal dan waktu.

```php
$date = new DateTime("2026-08-17");

echo $date->format("Y-m-d");
```

**Output:**
```text
2026-08-17
```

Tambah hari:

```php
$date->modify("+7 days");

echo $date->format("Y-m-d");
```

**Output:**
```text
2026-08-24
```

Diagram:

```text
DateTime
   │
   ├── format()
   ├── modify()
   ├── setTime()
   └── diff()
```

Gunakan `DateTimeImmutable` jika ingin object tanggal yang tidak berubah.

---

## 42. Exception

Exception digunakan untuk menangani kondisi error/abnormal.

```php
function divide(int $a, int $b): float
{
    if ($b === 0) {
        throw new Exception("Tidak boleh dibagi 0");
    }

    return $a / $b;
}

try {
    echo divide(10, 0);
} catch (Exception $e) {
    echo $e->getMessage();
}
```

**Output:**
```text
Tidak boleh dibagi 0
```

Diagram:

```text
try
 │
 ├── sukses ──> lanjut
 │
 └── error
       │
       ▼
     throw
       │
       ▼
     catch
```

Struktur umum:

```php
try {
    // kode
} catch (Exception $e) {
    // tangani error
} finally {
    // selalu dijalankan
}
```

---

## 43. Regular Expression

Regular Expression (Regex) digunakan untuk mencari/mencocokkan pola teks.

PHP menggunakan fungsi seperti `preg_match()`.

```php
$text = "Email saya: budi@example.com";

preg_match(
    '/[\w.-]+@[\w.-]+\.\w+/',
    $text,
    $matches
);

echo $matches[0];
```

**Output:**
```text
budi@example.com
```

Contoh pola:

```text
^       → awal string
$       → akhir string
.       → karakter apa pun
\d      → digit
\w      → karakter kata
+       → satu atau lebih
*       → nol atau lebih
?       → nol atau satu
[]      → pilihan karakter
()      → group
```

Contoh validasi angka:

```php
preg_match('/^\d+$/', '123');
```

---

## 44. Reflection

Reflection memungkinkan program **memeriksa struktur class/object saat runtime**.

```php
class User
{
    public string $name;

    public function hello(): void
    {
        echo "Halo";
    }
}

$reflection = new ReflectionClass(User::class);

echo $reflection->getName() . "\n";

foreach ($reflection->getMethods() as $method) {
    echo $method->getName() . "\n";
}
```

**Output:**
```text
User
hello
```

Reflection dapat digunakan untuk mengetahui:

```text
Class
 ├── nama
 ├── properties
 ├── methods
 ├── modifiers
 ├── parent class
 └── interfaces
```

Sering digunakan oleh framework, dependency injection, ORM, dan tooling.

---

# 45. Peta Ingatan Cepat

## A. Struktur dasar OOP

```text
CLASS
 │
 │ new
 ▼
OBJECT
 │
 ├── PROPERTY → data
 │
 └── METHOD   → perilaku
```

## B. Keyword penting

```text
$this
  → object saat ini

self::
  → class saat ini

parent::
  → parent class

static::
  → static/class context

new
  → membuat object

extends
  → inheritance class

implements
  → memenuhi interface

use
  → import namespace / memakai trait

clone
  → salin object

instanceof
  → cek tipe object
```

## C. Empat konsep utama OOP

```text
                 OOP
                  │
      ┌───────────┼───────────┐
      │           │           │
 Encapsulation Inheritance Polymorphism
      │           │           │
  private/getter extends    interface
  /setter                    /abstract
                  │
             Abstraction
                  │
          abstract/interface
```

## D. Visibility

```text
public
  ↓
semua bisa akses

protected
  ↓
class + child

private
  ↓
class sendiri
```

## E. Inheritance vs Interface vs Trait

| Fitur | Tujuan | Keyword |
|---|---|---|
| Class inheritance | Mewarisi class | `extends` |
| Interface | Membuat kontrak | `implements` |
| Interface inheritance | Interface mewarisi interface | `extends` |
| Trait | Berbagi implementasi | `use` |

## F. Override

```text
Parent
  │
  └── method()

Child
  │
  └── method()  ← override
```

Untuk memanggil versi parent:

```php
parent::method();
```

## G. Urutan belajar yang disarankan

```text
1. Class
   ↓
2. Object
   ↓
3. Property
   ↓
4. Method
   ↓
5. $this
   ↓
6. Constructor
   ↓
7. Visibility
   ↓
8. Inheritance
   ↓
9. Overriding + parent
   ↓
10. Abstract Class
    ↓
11. Interface
    ↓
12. Polymorphism
    ↓
13. Trait
    ↓
14. Static
    ↓
15. Exception
    ↓
16. Reflection
```

## Cheat Code 10 Detik

Kalau lupa, ingat kalimat ini:

> **Class adalah cetak biru. Object adalah hasilnya. Property adalah datanya. Method adalah perilakunya. `new` membuat object. `$this` menunjuk object saat ini. `self` menunjuk class saat ini. `parent` menunjuk parent. `extends` mewarisi class. `implements` memenuhi interface. `use` memakai trait/import namespace.**

---

## Contoh Mini Project untuk Menggabungkan Banyak Materi

```php
<?php

interface Payment
{
    public function pay(int $amount): string;
}

abstract class User
{
    public function __construct(
        public string $name
    ) {
    }

    abstract public function role(): string;

    public function greet(): string
    {
        return "Halo, saya {$this->name}";
    }
}

class Customer extends User implements Payment
{
    public function role(): string
    {
        return "Customer";
    }

    public function pay(int $amount): string
    {
        return "{$this->name} membayar Rp{$amount}";
    }
}

$customer = new Customer("Budi");

echo $customer->greet() . "\n";
echo $customer->role() . "\n";
echo $customer->pay(50000);
```

**Output:**
```text
Halo, saya Budi
Customer
Budi membayar Rp50000
```

Diagram:

```text
                   User
              abstract class
                    │
                 extends
                    ▼
                Customer
                    │
              implements
                    ▼
                 Payment


Customer
   │
   ├── name = Budi       ← property
   │
   ├── greet()            ← inherited method
   ├── role()             ← override abstract method
   └── pay()             ← interface implementation
```

---

# Ringkasan Super Singkat

| Istilah | Hafalan |
|---|---|
| Class | Cetak biru |
| Object | Hasil/cetakan |
| Property | Data |
| Method | Perilaku |
| `$this` | Object ini |
| Constant | Nilai tetap |
| `self` | Class ini |
| Constructor | Saat object dibuat |
| Destructor | Saat object selesai dihancurkan |
| `extends` | Mewarisi class |
| `parent` | Akses parent |
| Namespace | Alamat class |
| `use` | Import / trait |
| `public` | Semua |
| `protected` | Class + child |
| `private` | Class sendiri |
| Override | Ganti method parent |
| Polymorphism | Satu interface, banyak perilaku |
| Abstract | Blueprint belum lengkap |
| Getter | Ambil data |
| Setter | Ubah data |
| Interface | Kontrak |
| Trait | Reusable implementation |
| `final` | Tidak boleh diwarisi/override |
| Anonymous class | Class tanpa nama |
| `static` | Milik class |
| `stdClass` | Object kosong sederhana |
| `foreach` | Iterasi property |
| `yield` | Generator |
| `clone` | Salin object |
| `==` | Nilai/state |
| `===` | Object yang sama |
| Magic method | Method khusus `__...` |
| Overloading | Tangani akses method/property dinamis |
| Covariance | Return lebih spesifik |
| Contravariance | Parameter lebih umum |
| DateTime | Tanggal/waktu |
| Exception | Penanganan error |
| Regex | Pola teks |
| Reflection | Introspeksi struktur object/class |

> **Kunci utama:** jangan mencoba menghafal semua syntax sekaligus. Pahami hubungan **Class → Object → Property → Method → Constructor → Inheritance → Interface → Polymorphism** terlebih dahulu. Sisanya akan jauh lebih mudah.
