# PHP OOP Cheatsheet Revised

> **Tujuan:** menjadi peta belajar dan reference cepat PHP OOP modern untuk pemula.
>
> Contoh dibuat singkat agar mudah dicoba. Pelajari sesuai level; **tidak perlu menghafal semua bagian sekaligus**.
>
> **PHP:** contoh menggunakan PHP 8+.

---

## Cara Belajar

Dokumen ini sengaja dibagi menjadi beberapa level.

```text
🟢 LEVEL 1 — Fundamental
Class → Object → Property → Method → $this → Constructor
→ Visibility → Encapsulation

🟢 LEVEL 2 — Core OOP
Inheritance → Override → parent
→ Abstract → Interface → Polymorphism

🟡 LEVEL 3 — PHP OOP Features
Namespace → use → static → self → final → Trait

🟡 LEVEL 4 — Object Behavior
clone → Object Comparison → Magic Methods
→ Overloading → Object Iteration → Destructor

🔴 LEVEL 5 — Advanced
Generator → Covariance → Contravariance → Reflection
```

Beberapa fitur PHP penting juga dibahas di bagian terpisah:

```text
DateTime
Exception
Regular Expression
```

Ketiganya penting dalam PHP, tetapi **bukan inti konsep OOP**.

## Prioritas belajar

```text
🟢 Wajib dipahami
🟡 Penting setelah dasar
🔴 Advanced / reference
```

> **Jangan mencoba menghafal seluruh cheatsheet.** Kuasai Level 1 terlebih dahulu, lalu lanjut ke Level 2.

---

# Daftar Isi

## 🟢 Level 1 — Fundamental

1. [Apa itu OOP?](#bagian-1)
2. [Class](#bagian-2)
3. [Object](#bagian-3)
4. [Property](#bagian-4)
5. [Method](#bagian-5)
6. [`$this`](#bagian-6)
7. [Constructor](#bagian-7)
8. [Visibility](#bagian-8)
9. [Encapsulation](#bagian-9)
10. [Getter dan Setter](#bagian-10)

## 🟢 Level 2 — Core OOP

11. [Inheritance](#bagian-11)
12. [Method Overriding](#bagian-12)
13. [`parent`](#bagian-13)
14. [Abstract Class dan Abstract Method](#bagian-14)
15. [Interface](#bagian-15)
16. [Interface Inheritance](#bagian-16)
17. [Polymorphism](#bagian-17)
18. [Type Declaration dan `instanceof`](#bagian-18)

## 🟡 Level 3 — PHP OOP Features

19. [Namespace](#bagian-19)
20. [`use` / Import](#bagian-20)
21. [`static`](#bagian-21)
22. [`self`](#bagian-22)
23. [`final`](#bagian-23)
24. [Trait](#bagian-24)
25. [Trait Conflict dan Alias](#bagian-25)
26. [Anonymous Class](#bagian-26)
27. [`stdClass`](#bagian-27)

## 🟡 Level 4 — Object Behavior

28. [Object Cloning](#bagian-28)
29. [Comparing Object](#bagian-29)
30. [Magic Methods](#bagian-30)
31. [Overloading](#bagian-31)
32. [Object Iteration](#bagian-32)
33. [Destructor](#bagian-33)

## 🔴 Level 5 — Advanced

34. [Generator](#bagian-34)
35. [Covariance](#bagian-35)
36. [Contravariance](#bagian-36)
37. [Reflection](#bagian-37)

## PHP Features Pendukung

38. [DateTime](#bagian-38)
39. [Exception](#bagian-39)
40. [Regular Expression](#bagian-40)

41. [Peta Ingatan Cepat](#bagian-41)
42. [Mini Project](#bagian-42)
43. [Kesalahan Umum Pemula](#bagian-43)
44. [Best Practice Singkat](#bagian-44)
45. [Urutan Belajar yang Disarankan](#bagian-45)
46. [Cheat Code PHP OOP 10 Detik](#bagian-46)
47. [Tabel Ringkasan](#bagian-47)
48. [Peta Ingatan Cepat](#bagian-48)
49. [Referensi Resmi](#bagian-49)

---

# 🟢 LEVEL 1 — FUNDAMENTAL

<a id="bagian-1"></a>

# 1. 🟢  Apa itu OOP?

**OOP (Object-Oriented Programming)** adalah cara menyusun program dengan object yang memiliki **data** dan **perilaku**.

Cara mengingat:

```text
CLASS    = definisi/cetak biru
OBJECT   = instance/hasil dari class
PROPERTY = data
METHOD   = perilaku
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

> Analogi "cetak biru" membantu mengingat, tetapi secara teknis class adalah definisi struktur dan perilaku object.

---

<a id="bagian-2"></a>

# 2. 🟢  Class

Class adalah definisi yang menjelaskan **data dan perilaku** yang dimiliki object.

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

```text
class = rancangan/definisi
```

---

<a id="bagian-3"></a>

# 3. 🟢  Object

Object adalah **instance** dari class.

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

Satu class dapat menghasilkan banyak object:

```text
class User
   │
   ├── new User() → $user
   │                  └── name = Budi
   │
   └── new User() → $user2
                      └── name = Andi
```

> Class adalah definisinya; object adalah instance yang benar-benar dibuat saat program berjalan.

---

<a id="bagian-4"></a>

# 4. 🟢  Property

Property adalah **data/state** yang dimiliki object.

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

Contoh:

```php
$product->name
```

---

<a id="bagian-5"></a>

# 5. 🟢  Method

Method adalah function yang berada di dalam class.

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

Cara mengingat:

```text
Property = object punya apa?
Method   = object bisa melakukan apa?
```

---

<a id="bagian-6"></a>

# 6. 🟢  `$this`

`$this` menunjuk ke **object yang sedang menjalankan method**.

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

**Ingat:**

```text
$this = object ini
```

> `$this` hanya tersedia dalam konteks object method. Jangan menggunakannya di method `static`.

---

<a id="bagian-7"></a>

# 7. 🟢  Constructor

Constructor adalah method khusus yang otomatis dipanggil ketika object dibuat.

```php
class User
{
    public function __construct(public string $name)
    {
    }
}

$user = new User("Budi");

echo $user->name;
```

**Output:**
```text
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

## Constructor Property Promotion

PHP modern memungkinkan property sekaligus dideklarasikan melalui parameter constructor:

```php
class User
{
    public function __construct(
        public string $name,
        private int $age
    ) {
    }
}
```

Tanpa promotion, bentuk panjangnya adalah:

```php
class User
{
    public string $name;
    private int $age;

    public function __construct(string $name, int $age)
    {
        $this->name = $name;
        $this->age = $age;
    }
}
```

---

<a id="bagian-8"></a>

# 8. 🟢  Visibility

Visibility menentukan **siapa yang boleh mengakses property atau method**.

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

// echo $user->email;    // Error
// echo $user->password; // Error
```

Cara mengingat:

```text
public
→ semua yang memiliki akses ke object/class dapat mengakses

protected
→ class yang mendeklarasikan + child class

private
→ hanya class yang mendeklarasikan
```

> Gunakan visibility untuk mengontrol API class. Jangan membuat semua property `public` hanya karena lebih mudah.

---

<a id="bagian-9"></a>

# 9. 🟢  Encapsulation

**Encapsulation** berarti mengatur data dan perilaku dalam object sekaligus mengontrol bagaimana bagian internal tersebut diakses.

Contoh:

```php
class BankAccount
{
    private int $balance = 0;

    public function deposit(int $amount): void
    {
        if ($amount <= 0) {
            throw new InvalidArgumentException("Jumlah harus lebih dari 0");
        }

        $this->balance += $amount;
    }

    public function getBalance(): int
    {
        return $this->balance;
    }
}

$account = new BankAccount();

$account->deposit(50000);

echo $account->getBalance();
```

**Output:**
```text
50000
```

Yang penting bukan sekadar "property harus private".

Tujuan utamanya:

```text
Object
 ├── data internal
 └── aturan/perilaku
       ↓
   akses dikontrol
```

Dengan begitu object dapat menjaga agar state-nya tetap valid.

---

<a id="bagian-10"></a>

# 10. 🟢  Getter dan Setter

**Getter** mengambil nilai.

**Setter** mengubah nilai.

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

### Apakah semua property harus punya getter/setter?

**Tidak.**

Getter/setter berguna ketika akses atau perubahan data membutuhkan:

- validasi
- normalisasi
- aturan bisnis
- kontrol akses

Contoh:

```php
public function setAge(int $age): void
{
    if ($age < 0) {
        throw new InvalidArgumentException("Umur tidak valid");
    }

    $this->age = $age;
}
```

> Jangan membuat getter/setter hanya secara otomatis tanpa alasan. Pertimbangkan apakah object memang perlu mengekspos data tersebut.

---

# 🟢 LEVEL 2 — CORE OOP

<a id="bagian-11"></a>

# 11. 🟢  Inheritance

Inheritance membuat child class mewarisi struktur/perilaku dari parent class.

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

**Ingat:**

```text
extends = inheritance class
```

### Best practice

Jangan menggunakan inheritance hanya karena ingin reuse code.

Tanyakan:

> "Apakah Child memang merupakan jenis dari Parent?"

Contoh:

```text
Cat is an Animal  → masuk akal
Car is an Engine  → tidak masuk akal
```

---

<a id="bagian-12"></a>

# 12. 🟢  Method Overriding

Overriding terjadi ketika child menyediakan implementasi method dengan nama yang sama untuk menggantikan perilaku parent.

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

**Ingat:**

```text
override = child mengganti implementasi method parent
```

> Signature method tetap harus kompatibel dengan aturan inheritance PHP.

---

<a id="bagian-13"></a>

# 13. 🟢  `parent`

`parent` digunakan untuk mengakses parent class dari child.

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

Constructor parent juga dapat dipanggil:

```php
parent::__construct(...);
```

Cara mengingat:

```text
self::   → class tempat kode ditulis
parent:: → parent class
```

---

<a id="bagian-14"></a>

# 14. 🟢  Abstract Class dan Abstract Method

## Abstract class

Abstract class adalah class yang **tidak dapat langsung dibuat menjadi object**.

```php
abstract class Animal
{
    abstract public function sound(): string;
}
```

## Abstract method

Abstract method hanya mendefinisikan kontrak method. Child yang konkret harus menyediakan implementasinya.

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

Cara mengingat:

```text
abstract class
→ blueprint yang belum lengkap

abstract method
→ method yang implementasinya harus disediakan child
```

---

<a id="bagian-15"></a>

# 15. 🟢  Interface

Interface adalah **kontrak**.

Class yang `implements` interface harus memenuhi kontrak tersebut.

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

Cara mengingat:

```text
extends
→ inheritance class

implements
→ class memenuhi interface
```

---

<a id="bagian-16"></a>

# 16. 🟢  Interface Inheritance

Interface juga dapat mewarisi interface lain menggunakan `extends`.

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

> Ini fitur yang berguna, tetapi tidak wajib dikuasai saat pertama kali belajar interface.

---

<a id="bagian-17"></a>

# 17. 🟢  Polymorphism

Polymorphism berarti **kode yang sama dapat bekerja dengan beberapa implementasi yang berbeda**.

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

Intinya:

```text
makeSound()
     ↓
menerima Animal
     ↓
tidak peduli Cat atau Dog
     ↓
masing-masing menjalankan sound() sendiri
```

---

<a id="bagian-18"></a>

# 18. 🟢  Type Declaration dan `instanceof`

Ketiga konsep berikut berbeda.

## Type declaration

Menentukan tipe parameter/return.

```php
function greet(User $user): string
{
    return "Halo " . $user->name;
}
```

## `instanceof`

Mengecek apakah object merupakan instance dari class atau cocok dengan interface tertentu.

```php
class User {}

$user = new User();

var_dump($user instanceof User);
```

**Output:**
```text
bool(true)
```

## Casting

Casting mengubah nilai ke tipe tertentu.

```php
$value = "123";

$number = (int) $value;

var_dump($number);
```

**Output:**
```text
int(123)
```

Cara membedakan:

```text
Type declaration → menentukan tipe yang diterima/dikembalikan
instanceof       → mengecek tipe object
Casting          → mengubah tipe nilai
```

> Untuk object, gunakan type declaration/interface yang jelas daripada mengandalkan casting sembarangan.

---

# 🟡 LEVEL 3 — PHP OOP FEATURES

<a id="bagian-19"></a>

# 19. 🟡  Namespace

Namespace adalah cara memberi **nama/alamat logis** pada class, interface, function, dan constant agar nama tidak mudah bentrok.

```php
namespace App\Models;

class User
{
}
```

Nama lengkap class tersebut:

```text
App\Models\User
```

Contoh struktur project:

```text
App/
├── Models/
│   └── User.php
└── Services/
    └── UserService.php
```

Cara mengingat:

```text
namespace = alamat/nama lengkap
```

> Namespace menjadi sangat berguna ketika project memiliki banyak file dan banyak class.

---

<a id="bagian-20"></a>

# 20. 🟡  `use` / Import

`use` dapat digunakan untuk memakai nama class/interface/trait dari namespace lain tanpa menulis nama lengkap setiap kali.

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

Tanpa import:

```php
$user = new \App\Models\User();
```

Cara mengingat:

```text
namespace → menentukan alamat
use       → membuat nama tersebut lebih praktis dipakai
```

> `use` juga digunakan untuk memakai trait, jadi konteksnya perlu dilihat dari penggunaannya.

---

<a id="bagian-21"></a>

# 21. 🟡  `static`

`static` membuat property atau method menjadi milik **class**, bukan object tertentu.

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

Akses:

```php
ClassName::$property;
ClassName::method();
```

Sedangkan object member biasa:

```php
$object->property;
$object->method();
```

> Jangan memakai `static` hanya karena "lebih mudah". Gunakan ketika state/perilaku memang berkaitan dengan class, bukan instance tertentu.

---

<a id="bagian-22"></a>

# 22. 🟡  `self`

`self` merujuk ke **class tempat kode tersebut ditulis**.

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

Cara mengingat:

```text
$this   → object saat ini
self::  → class tempat kode ditulis
parent:: → parent class
```

> `self` sering digunakan untuk mengakses constant atau static member class tersebut.

---

<a id="bagian-23"></a>

# 23. 🟡  `final`

## Final class

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

## Final method

`final` pada method berarti child tidak boleh meng-override method tersebut.

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

Cara mengingat:

```text
final class
→ tidak boleh extends

final method
→ tidak boleh override
```

---

<a id="bagian-24"></a>

# 24. 🟡  Trait

Trait digunakan untuk **berbagi implementasi** antar class.

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

Cara mengingat:

```text
trait = reusable implementation yang dapat digunakan class
```

Trait bukan pengganti inheritance atau interface.

> Jika perilaku tersebut sebenarnya merupakan dependency/service terpisah, composition sering lebih jelas daripada trait.

---

<a id="bagian-25"></a>

# 25. 🟡  Trait Conflict dan Alias

Jika dua trait memiliki method dengan nama sama, PHP membutuhkan aturan untuk menentukan method mana yang digunakan.

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

Kita juga dapat membuat alias:

```php
class Test
{
    use A, B {
        A::hello insteadof B;
        B::hello as helloB;
    }
}
```

Sekarang tersedia:

```php
$test->hello();   // A
$test->helloB();  // B
```

---

<a id="bagian-26"></a>

# 26. 🟡  Anonymous Class

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

Berguna untuk object kecil yang hanya dibutuhkan pada konteks tertentu.

> Ini fitur advanced-ish; pemula tidak perlu menghafalnya.

---

<a id="bagian-27"></a>

# 27. 🟡  `stdClass`

`stdClass` adalah class kosong bawaan PHP yang dapat digunakan untuk membuat object sederhana secara dinamis.

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

> Untuk model/domain object yang memiliki aturan dan perilaku, class khusus biasanya lebih jelas daripada `stdClass`.

---

# 🟡 LEVEL 4 — OBJECT BEHAVIOR

<a id="bagian-28"></a>

# 28. 🟡  Object Cloning

`clone` membuat object baru berdasarkan object yang ada.

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
State awal disalin
```

Untuk mengatur proses cloning:

```php
__clone()
```

> Untuk object yang memiliki property berupa object lain, pahami konsep shallow copy/deep copy sebelum mengandalkan `clone`.

---

<a id="bagian-29"></a>

# 29. 🟡  Comparing Object

PHP memiliki dua operator yang sering digunakan untuk membandingkan object:

```php
==
===
```

### `==`

Object dianggap sama jika class-nya sama dan property/state-nya setara sesuai aturan perbandingan object PHP.

### `===`

Mengecek **identity**: kedua variable harus merujuk ke object yang sama.

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

Cara mengingat:

```text
==  → state/value setara
=== → object yang sama
```

---

<a id="bagian-30"></a>

# 30. 🟡  Magic Methods

Magic methods adalah method khusus PHP yang namanya diawali `__`.

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

Cara mengingat:

```text
magic method = PHP memanggil method tertentu secara otomatis
              ketika kondisi tertentu terjadi
```

> Jangan menggunakan magic method hanya agar kode terlihat "canggih". Gunakan jika perilaku dinamis tersebut memang dibutuhkan.

---

<a id="bagian-31"></a>

# 31. 🟡  Overloading

Dalam PHP, istilah **overloading** terutama mengacu pada mekanisme magic methods untuk menangani property atau method yang tidak dapat diakses secara normal.

Contoh:

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

### Penting

PHP **tidak** melakukan method overloading seperti Java/C++ berdasarkan jumlah atau tipe parameter.

Untuk kebutuhan tersebut, biasanya gunakan:

```text
optional parameter
union type
variadic
beberapa method dengan nama berbeda
atau __call() jika memang diperlukan
```

---

<a id="bagian-32"></a>

# 32. 🟡  Object Iteration

Object dapat di-iterasi dengan `foreach`.

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

Property `private` dan `protected` memiliki aturan visibility ketika iterasi dilakukan dari luar class.

> Ini lebih merupakan fitur perilaku object PHP daripada konsep inti OOP.

---

<a id="bagian-33"></a>

# 33. 🟡  Destructor

Destructor adalah method `__destruct()` yang dipanggil ketika object dihancurkan/menjadi tidak terjangkau, atau ketika script selesai dalam kondisi normal tertentu.

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

Output pada contoh sederhana dapat terlihat seperti:

```text
Buka
Tutup
```

Cara mengingat:

```text
__construct() → inisialisasi
__destruct()  → cleanup saat object dihancurkan
```

> Jangan mengandalkan waktu/urutan destructor untuk logika bisnis penting. Untuk resource penting, kelola lifecycle secara eksplisit bila memungkinkan.

---

# 🔴 LEVEL 5 — ADVANCED

<a id="bagian-34"></a>

# 34. 🔴  Generator

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

Konsepnya:

```text
Generator
   │
 yield 1 → dipakai
   │
 yield 2 → dipakai
   │
 yield 3 → dipakai
```

Keuntungan utama: data dapat diproses secara lazy tanpa harus membangun seluruh hasil sekaligus di memory.

> Generator penting untuk memahami lazy iteration, tetapi bukan materi OOP fundamental.

---

<a id="bagian-35"></a>

# 35. 🔴  Covariance

Covariance berhubungan dengan **return type** pada inheritance.

Child boleh mengembalikan tipe yang lebih spesifik daripada parent, selama tetap kompatibel.

```php
class Animal
{
}

class Cat extends Animal
{
}

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
Return parent:
Animal

Return child:
Cat
 ↓
lebih spesifik
```

Cara mengingat:

```text
Covariance → return → lebih spesifik
```

---

<a id="bagian-36"></a>

# 36. 🔴  Contravariance

Contravariance berhubungan dengan **parameter type** pada inheritance.

Child boleh menerima tipe parameter yang lebih umum, selama tetap kompatibel.

```php
class Animal
{
}

class Cat extends Animal
{
}

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
Covariance
→ return lebih spesifik

Contravariance
→ parameter lebih umum
```

> Ini konsep type system yang advanced. Jangan dipaksakan untuk dihafal saat baru belajar OOP.

---

<a id="bagian-37"></a>

# 37. 🔴  Reflection

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

> Biasanya pemula tidak perlu menggunakan Reflection secara langsung.

---

# PHP FEATURES PENDUKUNG

<a id="bagian-38"></a>

# 38. 🔴  DateTime

`DateTime` digunakan untuk bekerja dengan tanggal dan waktu.

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

PHP juga menyediakan `DateTimeImmutable` ketika kita ingin object tanggal/waktu yang tidak dimodifikasi setelah dibuat.

> DateTime adalah class PHP yang penting, tetapi bukan konsep OOP yang perlu dipelajari sebelum memahami class/object.

---

<a id="bagian-39"></a>

# 39. 🔴  Exception

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

Struktur umum:

```php
try {
    // kode yang mungkin gagal
} catch (Exception $e) {
    // tangani exception
} finally {
    // dijalankan setelah try/catch selesai
}
```

Diagram:

```text
try
 │
 ├── sukses ──→ lanjut
 │
 └── exception
       │
       ▼
     catch
       │
       ▼
    finally
```

> Exception sangat penting untuk PHP secara umum, tetapi konsepnya bukan salah satu dari empat pilar OOP.

---

<a id="bagian-40"></a>

# 40. 🔴  Regular Expression

Regular Expression (Regex) digunakan untuk mencocokkan pola teks.

PHP menyediakan fungsi seperti `preg_match()`.

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

Beberapa simbol:

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

Contoh:

```php
preg_match('/^\d+$/', '123');
```

> Regex penting untuk pengolahan teks, tetapi bukan materi inti OOP.

---

<a id="bagian-41"></a>

# 41. 🧠  Peta Ingatan Cepat

## A. Struktur dasar

```text
CLASS
 │
 │ new
 ▼
OBJECT
 │
 ├── PROPERTY → data/state
 │
 └── METHOD   → behavior/perilaku
```

## B. Keyword utama

```text
$this
  → object saat ini

self::
  → class tempat kode ditulis

parent::
  → parent class

static::
  → akses static member

new
  → membuat object

extends
  → inheritance class

implements
  → memenuhi interface

use
  → import namespace / memakai trait

clone
  → membuat salinan object

instanceof
  → mengecek tipe object
```

## C. Empat pilar OOP

```text
ENCAPSULATION
→ menjaga state + mengontrol akses

ABSTRACTION
→ menampilkan hal penting dan menyembunyikan detail

INHERITANCE
→ hubungan parent-child

POLYMORPHISM
→ satu kontrak, banyak implementasi
```

## D. Visibility

```text
public
  → dapat diakses dari luar

protected
  → class yang mendeklarasikan + child

private
  → hanya class yang mendeklarasikan
```

## E. Inheritance vs Interface vs Trait

| Fitur | Tujuan | Keyword |
|---|---|---|
| Class inheritance | Hubungan parent-child | `extends` |
| Interface | Kontrak | `implements` |
| Interface inheritance | Interface mewarisi interface | `extends` |
| Trait | Berbagi implementasi | `use` |

## F. Override

```text
Parent
  │
  └── method()

Child
  │
  └── method() ← override
```

Untuk memanggil versi parent:

```php
parent::method();
```

---

<a id="bagian-42"></a>

# 42. 🏗️  Mini Project

Contoh berikut menggabungkan beberapa konsep inti.

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

## Apa saja yang digunakan?

```text
class
object
property
method
constructor
inheritance
abstract class
abstract method
interface
implements
polymorphism
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
   ├── name = Budi
   │
   ├── greet()  ← inherited method
   ├── role()   ← implement abstract method
   └── pay()    ← implement interface
```

## Polymorphism versi mini project

Tambahkan implementasi lain:

```php
class CashPayment implements Payment
{
    public function pay(int $amount): string
    {
        return "Bayar cash: Rp{$amount}";
    }
}

class EWalletPayment implements Payment
{
    public function pay(int $amount): string
    {
        return "Bayar e-wallet: Rp{$amount}";
    }
}

function processPayment(Payment $payment): void
{
    echo $payment->pay(50000);
}

processPayment(new CashPayment());

echo "\n";

processPayment(new EWalletPayment());
```

Function yang sama:

```text
processPayment()
       │
       ├── CashPayment
       │
       └── EWalletPayment
```

inilah inti polymorphism:

> Kode pemanggil bergantung pada **kontrak `Payment`**, bukan class konkret tertentu.

---

<a id="bagian-43"></a>

# 43. ⚠️  Kesalahan Umum Pemula

## 1. Menganggap OOP = semua harus class

Tidak.

OOP bukan berarti setiap potongan kode harus dibungkus menjadi class.

Gunakan object ketika object membantu memodelkan:

```text
data
behavior
dependency
aturan bisnis
```

---

## 2. Membuat semua property `public`

Ini memang mudah:

```php
class User
{
    public string $name;
    public int $age;
}
```

Tetapi jika state harus dijaga, gunakan visibility yang tepat dan API yang jelas.

---

## 3. Membuat getter/setter untuk semua property

Tidak semua property perlu:

```text
getX()
setX()
```

Tanyakan:

> Apakah data ini memang perlu diekspos atau diubah dari luar?

---

## 4. Menggunakan inheritance hanya untuk reuse code

Jangan:

```text
"A membutuhkan method dari B"
        ↓
A extends B
```

langsung.

Tanyakan:

> Apakah A memang merupakan jenis dari B?

Jika tidak, pertimbangkan **composition**.

---

## 5. Mengira interface berisi implementasi

Interface terutama mendefinisikan kontrak.

```php
interface Payment
{
    public function pay(int $amount): string;
}
```

Implementasi biasanya berada pada class:

```php
class Cash implements Payment
{
    public function pay(int $amount): string
    {
        return "Cash";
    }
}
```

---

## 6. Mengira `self`, `$this`, dan `parent` sama

Ingat:

```text
$this   → object saat ini
self::  → class tempat kode ditulis
parent:: → parent class
```

---

## 7. Menganggap `static` selalu lebih baik

Static bukan pengganti object.

Jika setiap object membutuhkan state yang berbeda:

```text
Object biasa
→ biasanya lebih tepat
```

Jika data/perilaku memang milik class:

```text
static
→ dapat masuk akal
```

---

## 8. Menggunakan magic method terlalu banyak

Magic method powerful, tetapi dapat membuat kode sulit dilacak.

Gunakan ketika memang memberi manfaat yang jelas.

---

<a id="bagian-44"></a>

# 44. 💡  Best Practice Singkat

```text
1. Mulai dari object dan behavior, bukan dari inheritance.

2. Gunakan type declaration.
   → parameter dan return type sejelas mungkin.

3. Pilih visibility dengan sengaja.
   → jangan semua public.

4. Jaga object tetap valid.
   → validasi perubahan state di tempat yang tepat.

5. Jangan membuat getter/setter secara otomatis.

6. Jangan menggunakan inheritance hanya untuk reuse code.

7. Gunakan interface ketika yang penting adalah kontrak.

8. Gunakan polymorphism agar kode bergantung pada abstraksi,
   bukan implementasi konkret.

9. Gunakan trait untuk berbagi implementasi yang memang cocok
   digunakan lintas class.

10. Gunakan static dengan alasan yang jelas.

11. Hindari magic method jika method biasa sudah cukup jelas.

12. Pisahkan konsep OOP dari fitur PHP lainnya.
    → DateTime, Regex, Exception, Generator, dll.

13. Gunakan namespace pada project yang memiliki banyak class/file.

14. Pelajari advanced feature setelah fundamental benar-benar kuat.

15. Lebih baik memahami 10 konsep dengan benar
    daripada menghafal 40 syntax tanpa memahami hubungan antar-konsep.
```

---

<a id="bagian-45"></a>

# 45. 🧭 Urutan Belajar yang Disarankan

Jika benar-benar baru belajar OOP, ikuti urutan ini:

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
8. Encapsulation
   ↓
9. Getter/Setter
   ↓
10. Inheritance
    ↓
11. Override
    ↓
12. parent
    ↓
13. Abstract
    ↓
14. Interface
    ↓
15. Polymorphism
```

Setelah itu:

```text
Namespace
↓
use
↓
static / self
↓
final
↓
Trait
```

Baru kemudian:

```text
clone
↓
magic methods
↓
overloading
↓
generator
↓
covariance / contravariance
↓
reflection
```

---

<a id="bagian-46"></a>

# 46. ⚡ Cheat Code PHP OOP 10 Detik
Kalau lupa, ingat kalimat ini:

> **Class adalah definisi. Object adalah instance. Property adalah data. Method adalah perilaku. `new` membuat object. `$this` menunjuk object saat ini. Constructor menyiapkan object. Visibility mengatur akses. `extends` mewarisi class. `implements` memenuhi interface. `parent` mengakses parent. `self` mengacu ke class tempat kode ditulis. Polymorphism memungkinkan satu kontrak memiliki banyak implementasi.**

---

<a id="bagian-47"></a>

# 47. 📚 Tabel Ringkasan
| Istilah | Hafalan |
|---|---|
| Class | Definisi/cetak biru |
| Object | Instance |
| Property | Data/state |
| Method | Perilaku |
| `$this` | Object saat ini |
| Constructor | Inisialisasi object |
| Visibility | Kontrol akses |
| Encapsulation | Jaga state + kontrol akses |
| `extends` | Inheritance class |
| Override | Child mengganti implementasi method |
| `parent` | Akses parent |
| Abstract | Blueprint/kontrak yang belum lengkap |
| Interface | Kontrak |
| `implements` | Memenuhi kontrak interface |
| Polymorphism | Satu kontrak, banyak implementasi |
| Namespace | Nama/alamat class |
| `use` | Import / trait |
| `self` | Class tempat kode ditulis |
| `static` | Member milik class |
| `final` | Tidak boleh diwarisi/override |
| Trait | Reusable implementation |
| Anonymous class | Class tanpa nama |
| `stdClass` | Object kosong sederhana |
| `clone` | Salin object |
| `==` | State/value setara |
| `===` | Object yang sama |
| Magic method | Method khusus `__...` |
| Overloading | Akses dinamis via magic methods |
| `yield` | Menghasilkan nilai generator |
| Covariance | Return lebih spesifik |
| Contravariance | Parameter lebih umum |
| Reflection | Introspeksi struktur class/object |
| DateTime | Tanggal/waktu |
| Exception | Penanganan kondisi error |
| Regex | Pencocokan pola teks |

---

<a id="bagian-48"></a>

# 48. 🧠 Peta Ingatan Cepat

Kalau harus mengingat hanya satu alur:

```text
CLASS
  ↓
OBJECT
  ↓
PROPERTY + METHOD
  ↓
$this
  ↓
CONSTRUCTOR
  ↓
VISIBILITY
  ↓
ENCAPSULATION
  ↓
INHERITANCE
  ↓
ABSTRACT / INTERFACE
  ↓
POLYMORPHISM
```

> **Jangan kejar semua fitur PHP OOP sekaligus. Pahami hubungan konsepnya terlebih dahulu. Setelah fundamental kuat, fitur advanced akan jauh lebih mudah dipelajari.**

---

<a id="bagian-49"></a>

# 49. 🔗 Referensi Resmi

- [PHP Manual - Language Reference](https://www.php.net/manual/en/langref.php)
- [PHP Manual - Classes and Objects](https://www.php.net/manual/en/language.oop5.php)
- [PHP Manual - OOP Changelog](https://www.php.net/manual/en/language.oop5.changelog.php)
- [PHP Manual - Exceptions](https://www.php.net/manual/en/language.exceptions.php)
- [PHP Manual - Date and Time](https://www.php.net/manual/en/book.datetime.php)
- [PHP Manual - PCRE / Regular Expressions](https://www.php.net/manual/en/book.pcre.php)
