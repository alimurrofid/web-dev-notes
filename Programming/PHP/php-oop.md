# PHP OOP Cheatsheet Revised

> **Target:** Pemula yang sudah memahami PHP Dasar, lalu ingin menguasai Object-Oriented Programming (OOP) modern di PHP 8+.
>
> Fokus cheatsheet ini: **mental model OOP → class & object → properties & methods → constructor & promotion → visibility & encapsulation → inheritance & overriding → abstract & interface → polymorphism → namespaces & autoloading → static & self → traits → magic methods & cloning → generators & reflection → error & exception handling → mini project e-commerce OOP**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: fondasi utama pembuatan class, object, constructor, visibility, dan inheritance

🟡 Lanjutan
→ pelajari setelah fundamental nyaman: namespace, trait, static, final, magic methods, dan cloning

🔴 Advanced / Reference
→ penting untuk arsitektur aplikasi: generator, covariance/contravariance, reflection, dan exception
```

Mental model interaksi Object-Oriented Programming di PHP:

```text
       CLASS (Cetak Biru / Definisi Struktur)
       ┌───────────────────────────────────────────────┐
       │ class RekeningBank {                          │
       │     private int $saldo;                       │
       │     public function setor(int $jumlah): void  │
       │ }                                             │
       └───────────────────────┬───────────────────────┘
                               │
                               │ new RekeningBank(100000)
                               ▼
       OBJECT / INSTANCE (Wujud Nyata di Memori RAM)
       ┌───────────────────────────────────────────────┐
       │ $rekeningBudi (Alamat Memori #1)              │
       │ • Saldo: Rp 100.000                           │
       │ • Method: setor(), tarik(), getSaldo()        │
       └───────────────────────────────────────────────┘
                               │
                               ▼
       Pemanggilan Method: $rekeningBudi->setor(50000);
```

**Hafalan:**

```text
Class        → Definisi struktur data dan perilaku (cetak biru rancangan)
Object       → Instance nyata yang dibuat di memori dari sebuah class menggunakan new
Property     → Variabel yang melekat dan menyimpan data/state di dalam object
Method       → Fungsi yang melekat dan menjalankan perilaku/logika di dalam object
$this        → Penunjuk (pointer) ke instance object yang sedang aktif saat ini
Constructor  → Method khusus __construct() yang otomatis dieksekusi saat object dibuat
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan OOP & Mental Model Objek](#bagian-1)
2. [Class (Definisi & Struktur)](#bagian-2)
3. [Object (Instansiasi dengan new)](#bagian-3)
4. [Property (Typed Properties & Readonly)](#bagian-4)
5. [Method & Return Types](#bagian-5)
6. [$this Keyword & Method Chaining](#bagian-6)
7. [Constructor & Constructor Property Promotion (PHP 8+)](#bagian-7)
8. [Visibility (public, protected, private)](#bagian-8)
9. [Encapsulation & Data Integrity](#bagian-9)
10. [Getter dan Setter (Accessor & Mutator)](#bagian-10)
11. [Inheritance (Pewarisan dengan extends)](#bagian-11)
12. [Method Overriding & Strict Compatibility](#bagian-12)
13. [parent Keyword & Parent Constructor](#bagian-13)
14. [Abstract Class & Abstract Method](#bagian-14)
15. [Interface & Multiple Interfaces](#bagian-15)
16. [Interface Inheritance](#bagian-16)
17. [Polymorphism (Satu Kontrak, Banyak Bentuk)](#bagian-17)
18. [Type Declaration & instanceof Operator](#bagian-18)

### 🟡 Lanjutan

19. [Namespace & Penataan Struktur Kode](#bagian-19)
20. [use Keyword (Import Class, Function, Const, & Alias)](#bagian-20)
21. [static Keyword (Static Property & Method)](#bagian-21)
22. [self vs $this vs parent](#bagian-22)
23. [final Keyword (Final Method & Class)](#bagian-23)
24. [Trait (Horizontal Code Reuse)](#bagian-24)
25. [Trait Conflict, Priority & Alias (insteadof & as)](#bagian-25)
26. [Anonymous Class](#bagian-26)
27. [stdClass & Object Casting](#bagian-27)
28. [Object Cloning (clone & __clone)](#bagian-28)
29. [Comparing Objects (== vs ===)](#bagian-29)
30. [Magic Methods Populer (__toString, __get, __set, __call, __invoke)](#bagian-30)
31. [Overloading Property & Method Dinamis](#bagian-31)
32. [Object Iteration (IteratorAggregate & Traversable)](#bagian-32)
33. [Destructor (__destruct) & Resource Cleanup](#bagian-33)

### 🔴 Advanced / Reference

34. [Generator & yield dalam OOP](#bagian-34)
35. [Covariance & Contravariance](#bagian-35)
36. [Reflection API (Introspeksi Class & Object)](#bagian-36)
37. [DateTime & DateTimeImmutable (OOP Date Handling)](#bagian-37)
38. [Exception Handling (try, catch, finally, Custom Exception)](#bagian-38)
39. [Regular Expression OOP (Pola PCRE2 dalam Objek)](#bagian-39)

### 🛠️ Referensi & Praktik

40. [Peta Ingatan Cepat](#bagian-40)
41. [Tabel Ringkasan](#bagian-41)
42. [Cheat Code PHP OOP 10 Detik](#bagian-42)
43. [Urutan Belajar yang Disarankan](#bagian-43)
44. [Mini Project: Sistem Manajemen E-Commerce & Pembayaran OOP](#bagian-44)
45. [Referensi Resmi](#bagian-45)

---

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan OOP & Mental Model Objek

## Konsep

**Object-Oriented Programming (OOP)** adalah paradigma pemrograman yang mengorganisasi kode menjadi kumpulan **Objek**. Berbeda dengan pemrograman prosedural yang memisahkan data (variabel) dan logika (fungsi), OOP menyatukan data dan fungsi yang memanipulasinya ke dalam satu kesatuan utuh.

Empat Pilar Utama OOP:
1. **Encapsulation:** Membungkus data dan membatasi akses langsung dari luar demi integritas data.
2. **Inheritance:** Menurunkan sifat dan method dari class induk ke class anak guna menghindari duplikasi.
3. **Polymorphism:** Kemampuan berbagai class berbeda merespons method yang sama dengan cara masing-masing.
4. **Abstraction:** Menyembunyikan detail implementasi internal dan hanya mengekspos fungsi penting melalui interface/abstract.

## Contoh

```php
<?php

class Mobil
{
    public string $merk;
    public int $kecepatan = 0;

    public function tancapGas(int $tambahan): void
    {
        $this->kecepatan += $tambahan;
        echo "Mobil {$this->merk} melaju pada kecepatan {$this->kecepatan} km/jam." . PHP_EOL;
    }
}

$mobilBudi = new Mobil();
$mobilBudi->merk = "Toyota";
$mobilBudi->tancapGas(60);
```

## Output

```text
Mobil Toyota melaju pada kecepatan 60 km/jam.
```

## Cara Kerja

```text
       Definisi Class Mobil (Cetak Biru)
                     │
                     │ new Mobil()
                     ▼
       Objek $mobilBudi dibuat di memori RAM
                     │
                     │ $mobilBudi->tancapGas(60)
                     ▼
       Proses internal: $this->kecepatan (0 + 60 = 60)
                     │
                     ▼
       Output: Mobil Toyota melaju pada kecepatan 60 km/jam.
```

**Hafalan:**

```text
Class   → Cetak biru (blueprint) yang mendefinisikan atribut dan aksi
Object  → Bentuk nyata hasil cetakan class yang menyimpan data tersendiri
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Modelkan class berdasarkan entitas nyata dalam domain bisnis Anda (`User`, `Product`, `Order`, `Invoice`).
- ❌ **Kesalahan Umum:** Menggunakan OOP hanya sebagai pembungkus fungsi prosedural tanpa memanfaatkan enkapsulasi state objek.

---

<a id="bagian-2"></a>

# 2. 🟢 Class (Definisi & Struktur)

## Konsep

**Class** adalah cetak biru (*blueprint*) atau template untuk membuat objek. Di dalam class, kita mendefinisikan properti apa saja yang dimiliki objek dan method apa saja yang dapat dijalankan oleh objek tersebut.

Nama class di PHP secara konvensi wajib menggunakan format **PascalCase** (contoh: `PenggunaAplikasi`, `TransaksiKasir`).

## Contoh

```php
<?php

class Pengguna
{
    // 1. Properti (Data/Atribut)
    public string $nama;
    public string $email;

    // 2. Method (Perilaku/Fungsi)
    public function perkenalkanDiri(): string
    {
        return "Halo, nama saya " . $this->nama . " (" . $this->email . ")";
    }
}
```

## Cara Kerja

```text
       File PHP dimuat
             │
             ▼
       Zend Engine mendaftarkan struktur class 'Pengguna' ke Class Table
             │
             ▼
       Class siap diinstansiasi menjadi satu atau banyak objek independen
```

**Hafalan:**

```text
class ClassName { ... }   → Mendefinisikan class baru dengan nama PascalCase
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Letakkan satu class per satu file dengan nama file yang persis sama dengan nama class (misal: `Pengguna.php` untuk `class Pengguna`).
- ❌ **Kesalahan Umum:** Menulis kode logika eksekusi (seperti `echo` atau kalkulasi langsung) di luar method di dalam blok class.

---

<a id="bagian-3"></a>

# 3. 🟢 Object (Instansiasi dengan `new`)

## Konsep

**Object** adalah instansiasi konkret dari sebuah class. Setiap objek memiliki ruang memorinya sendiri, sehingga perubahan data pada satu objek tidak akan memengaruhi data pada objek lain, meskipun keduanya dibuat dari class yang sama.

Untuk membuat objek baru, gunakan kata kunci `new ClassName()`.

## Contoh

```php
<?php

class Kucing
{
    public string $nama;
    public string $warna;

    public function bersuara(): void
    {
        echo "{$this->nama} ({$this->warna}): Meong!" . PHP_EOL;
    }
}

// Membuat 2 objek independen dari 1 class
$kucingA = new Kucing();
$kucingA->nama = "Milo";
$kucingA->warna = "Oranye";

$kucingB = new Kucing();
$kucingB->nama = "Luna";
$kucingB->warna = "Hitam";

$kucingA->bersuara();
$kucingB->bersuara();
```

## Output

```text
Milo (Oranye): Meong!
Luna (Hitam): Meong!
```

## Alokasi Memori Objek

```text
                     Class Kucing (Template)
                                │
               ┌────────────────┴────────────────┐
               │ new Kucing()                    │ new Kucing()
               ▼                                 ▼
       Objek $kucingA (Slot RAM #1)      Objek $kucingB (Slot RAM #2)
       nama: "Milo"                      nama: "Luna"
       warna: "Oranye"                   warna: "Hitam"
```

**Hafalan:**

```text
$object = new ClassName();  → Membuat instance objek baru dari class
$object->propertyName       → Mengakses nilai properti dari objek
$object->methodName()       → Menjalankan method dari objek
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Selalu inisialisasi properti objek melalui *Constructor* agar objek tidak berada dalam kondisi state yang tidak lengkap (*uninitialized*).
- ❌ **Kesalahan Umum:** Mengakses properti sebelum diberi nilai pada typed properties, yang memicu *Error: Typed property must not be accessed before initialization*.

---

<a id="bagian-4"></a>

# 4. 🟢 Property (Typed Properties & Readonly)

## Konsep

**Property** adalah variabel yang dimiliki oleh class. Sejak PHP 7.4, properti mendukung deklarasi tipe eksplisit (**Typed Properties**). Sejak PHP 8.1, kita dapat menambahkan modifier **`readonly`** untuk membuat properti hanya bisa diisi tepat **satu kali** (biasanya di constructor) dan tidak dapat diubah lagi sesudahnya (*immutable*).

## Contoh

```php
<?php

class Produk
{
    // Typed property biasa dengan default value
    public string $nama;
    public int $harga = 0;
    
    // Readonly property (hanya bisa diisi sekali di constructor)
    public readonly string $sku;

    public function __construct(string $sku, string $nama, int $harga)
    {
        $this->sku = $sku;
        $this->nama = $nama;
        $this->harga = $harga;
    }
}

$laptop = new Produk("SKU-101", "Laptop Gaming", 15000000);
echo "Produk: {$laptop->nama} | SKU: {$laptop->sku} | Harga: Rp {$laptop->harga}" . PHP_EOL;

// $laptop->sku = "SKU-999"; // ERROR! Cannot modify readonly property
```

## Output

```text
Produk: Laptop Gaming | SKU: SKU-101 | Harga: Rp 15000000
```

## Cara Kerja Readonly

```text
       Inisialisasi di Constructor: $this->sku = "SKU-101";
                     │
                     ▼
       Status Properti Terkunci Permanen (Read-Only)
                     │
                     ▼ Upaya Modifikasi Luar: $laptop->sku = "XXX"
       Zend Engine melempar Error: Cannot modify readonly property
```

**Hafalan:**

```text
public type $propertyName;          → Properti dengan penegasan tipe data
public readonly type $propertyName; → Properti yang nilainya tidak dapat diubah setelah diisi
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Selalu berikan type declaration pada properti untuk mencegah bug tipe data liar.
- ❌ **Kesalahan Umum:** Memberikan default value pada properti readonly (`public readonly string $sku = "A";` ❌), yang menyebabkan nilainya terkunci selamanya dan tidak bisa diisi dari constructor.

---

<a id="bagian-5"></a>

# 5. 🟢 Method & Return Types

## Konsep

**Method** adalah fungsi yang didefinisikan di dalam class untuk merepresentasikan tindakan atau perilaku yang dapat dilakukan oleh objek. Method dapat menerima parameter dan wajib memiliki deklarasi nilai kembalian (*return type*) pada PHP modern.

## Contoh

```php
<?php

class KalkulatorDiskon
{
    public function hitung(int $totalBelanja, float $persenDiskon): int
    {
        $potongan = (int) ($totalBelanja * ($persenDiskon / 100));
        return $totalBelanja - $potongan;
    }

    public function cetakStruk(string $namaToko, int $totalBayar): void
    {
        echo "=== $namaToko ===" . PHP_EOL;
        echo "Total yang harus dibayar: Rp " . number_format($totalBayar, 0, ",", ".") . PHP_EOL;
    }
}

$app = new KalkulatorDiskon();
$hasil = $app->hitung(200000, 15);
$app->cetakStruk("Minimarket Berkah", $hasil);
```

## Output

```text
=== Minimarket Berkah ===
Total yang harus dibayar: Rp 170.000
```

## Diagram Alur Pemanggilan Method

```text
       $app->hitung(200000, 15)
                 │
                 ▼
       Proses kalkulasi: 200000 - (200000 * 0.15) = 170000
                 │
                 ▼
       return 170000 ──> Diteruskan ke variabel $hasil
                 │
                 ▼
       $app->cetakStruk("Minimarket Berkah", $hasil)
```

**Hafalan:**

```text
public function methodName(type $param): returnType { ... }
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan return type `: void` jika method tidak mengembalikan nilai, atau gunakan `: self` / `: static` jika mengembalikan instance objek itu sendiri.
- ❌ **Kesalahan Umum:** Lupa kata kunci `public`/`private`/`protected` pada deklarasi method (meski default-nya `public`, menuliskannya secara eksplisit adalah standar PSR-12).

---

<a id="bagian-6"></a>

# 6. 🟢 `$this` Keyword & Method Chaining

## Konsep

- **`$this` Keyword:** Variabel semu khusus (*pseudo-variable*) yang otomatis tersedia di dalam method non-static. `$this` merujuk langsung ke **instance objek saat ini yang sedang menjalankan method tersebut**.
- **Method Chaining:** Teknik memanggil beberapa method secara beruntun dalam satu baris (contoh: `$query->where()->orderBy()->get()`) dengan cara mengembalikan `$this` di akhir method.

## Contoh

```php
<?php

class QueryBuilder
{
    private string $tabel = "";
    private array $kondisi = [];

    public function table(string $namaTabel): self
    {
        $this->tabel = $namaTabel;
        return $this; // Kembalikan objek saat ini
    }

    public function where(string $kolom, string $nilai): self
    {
        $this->kondisi[] = "$kolom = '$nilai'";
        return $this; // Kembalikan objek saat ini
    }

    public function toSql(): string
    {
        $sql = "SELECT * FROM {$this->tabel}";
        if (!empty($this->kondisi)) {
            $sql .= " WHERE " . implode(" AND ", $this->kondisi);
        }
        return $sql;
    }
}

// Method Chaining fluent API
$query = (new QueryBuilder())
    ->table("users")
    ->where("status", "active")
    ->where("role", "admin")
    ->toSql();

echo $query;
```

## Output

```text
SELECT * FROM users WHERE status = 'active' AND role = 'admin'
```

## Alur Method Chaining

```text
       (new QueryBuilder())
                 │
                 │ ->table("users")
                 ▼
       [Set properti $tabel, return $this]
                 │
                 │ ->where("status", "active")
                 ▼
       [Tambah kondisi array, return $this]
                 │
                 │ ->toSql()
                 ▼
       Generate String SQL Final
```

**Hafalan:**

```text
$this->propertyName       → Mengakses properti objek milik instance saat ini
$this->methodName()       → Memanggil method lain di dalam objek yang sama
return $this;             → Pola method chaining (fluent interface)
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan type hint `: self` atau `: static` pada method yang mengembalikan `return $this;`.
- ❌ **Kesalahan Umum:** Mencoba menggunakan `$this` di dalam fungsi global atau method `static` (memicu *Fatal Error: Using $this when not in object context*).

---

<a id="bagian-7"></a>

# 7. 🟢 Constructor & Constructor Property Promotion (PHP 8+)

## Konsep

**Constructor (`__construct`)** adalah method khusus yang otomatis dieksekusi oleh PHP pada saat sebuah objek pertama kali dibuat dengan kata kunci `new`. Constructor berfungsi utama untuk menerima argumen dan menginisialisasi properti objek.

**Constructor Property Promotion (PHP 8+):** Fitur modern yang memungkinkan deklarasi visibilitas, tipe data, dan penetapan properti langsung di dalam parameter constructor tanpa perlu menuliskan deklarasi properti dan baris `$this->prop = $prop;` secara manual berulang-ulang.

## Contoh

```php
<?php

// Gaya Modern PHP 8+ (Constructor Property Promotion)
class Pelanggan
{
    public function __construct(
        public int $id,
        public string $nama,
        public string $email,
        public string $level = "Silver"
    ) {
        // PHP otomatis membuat properti $this->id, $this->nama, dst.
    }
}

$user = new Pelanggan(1, "Budi Santoso", "budi@gmail.com");
echo "ID: {$user->id} | Nama: {$user->nama} | Level: {$user->level}";
```

## Output

```text
ID: 1 | Nama: Budi Santoso | Level: Silver
```

## Perbandingan Penulisan: Lama vs Modern (PHP 8+)

```text
Gaya Lama (Sebelum PHP 8)                       Gaya Modern (Property Promotion)
────────────────────────────────────────────────────────────────────────────────
class User {                                    class User {
    public int $id;                                 public function __construct(
    public string $nama;                                public int $id,
    public function __construct($id, $nama){            public string $nama
        $this->id = $id;                            ) {}
        $this->nama = $nama;                    }
    }
}
```

**Hafalan:**

```text
public function __construct(public type $param) { ... }  → Deklarasi + inisialisasi instan
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan *Constructor Property Promotion* sebagai cara standar menulis DTO (*Data Transfer Object*) dan Entity di PHP modern.
- ❌ **Kesalahan Umum:** Menggandakan deklarasi properti di luar constructor saat sudah menggunakan property promotion.

---

<a id="bagian-8"></a>

# 8. 🟢 Visibility (`public`, `protected`, `private`)

## Konsep

**Visibility (Aksesibilitas)** mengatur dari mana saja suatu properti atau method dapat diakses di dalam aplikasi.

Tiga tingkat visibility di PHP:
1. **`public`:** Dapat diakses dari mana saja (di dalam class, class turunan, dan dari luar objek).
2. **`protected`:** HANYA dapat diakses dari dalam class itu sendiri dan class anak turunannya (*subclass*).
3. **`private`:** HANYA dapat diakses dari dalam class tempat ia dideklarasikan secara persis (class anak turunan TIDAK BISA mengaksesnya).

## Contoh

```php
<?php

class Induk
{
    public string $terbuka = "Public: Semua orang boleh akses";
    protected string $keluarga = "Protected: Hanya induk dan anak";
    private string $rahasia = "Private: Hanya class Induk";

    public function tesAkses(): void
    {
        echo $this->terbuka . PHP_EOL;
        echo $this->keluarga . PHP_EOL;
        echo $this->rahasia . PHP_EOL;
    }
}

class Anak extends Induk
{
    public function tesAnak(): void
    {
        echo $this->terbuka . PHP_EOL;
        echo $this->keluarga . PHP_EOL;
        // echo $this->rahasia; // ERROR! Private tidak diwariskan
    }
}

$obj = new Induk();
echo $obj->terbuka . PHP_EOL; // BISA
// echo $obj->keluarga;       // ERROR!
// echo $obj->rahasia;        // ERROR!
```

## Output

```text
Public: Semua orang boleh akses
```

## Matriks Hak Akses Visibility

```text
       Hak Akses                 public       protected       private
       ──────────────────────────────────────────────────────────────────
       Dalam Class Sendiri       ✅ Ya         ✅ Ya           ✅ Ya
       Class Turunan (Anak)      ✅ Ya         ✅ Ya           ❌ Tidak
       Luar Class (Global)       ✅ Ya         ❌ Tidak        ❌ Tidak
```

**Hafalan:**

```text
public    → Bebas diakses dari mana saja
protected → Hanya untuk class sendiri dan anak turunannya
private   → Terkunci rapat hanya untuk class tempat ia ditulis
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Jadikan properti `private` atau `protected` secara default, lalu buka akses baca/tulis melalui method publik yang terenkapsulasi.
- ❌ **Kesalahan Umum:** Menjadikan semua properti `public` sehingga state internal objek bisa dirusak secara liar dari luar.

---

<a id="bagian-9"></a>

# 9. 🟢 Encapsulation & Data Integrity

## Konsep

**Encapsulation (Enkapsulasi)** adalah teknik menyembunyikan data internal objek dan mewajibkan segala modifikasi data dilakukan melalui method publik yang memiliki logika validasi. Tujuannya adalah memastikan objek **selalu berada dalam kondisi valid (*data integrity*)**.

## Contoh

```php
<?php

class RekeningTabungan
{
    private int $saldo = 0; // Terkunci dari manipulasi luar

    public function __construct(int $saldoAwal)
    {
        if ($saldoAwal > 0) {
            $this->saldo = $saldoAwal;
        }
    }

    public function setor(int $nominal): void
    {
        if ($nominal <= 0) {
            echo "Error: Setoran harus lebih dari 0!" . PHP_EOL;
            return;
        }
        $this->saldo += $nominal;
    }

    public function tarik(int $nominal): void
    {
        if ($nominal > $this->saldo) {
            echo "Error: Saldo tidak mencukupi!" . PHP_EOL;
            return;
        }
        $this->saldo -= $nominal;
    }

    public function getSaldo(): int
    {
        return $this->saldo;
    }
}

$tabungan = new RekeningTabungan(100000);
$tabungan->setor(50000);
$tabungan->tarik(200000); // Ditolak validasi enkapsulasi
echo "Saldo Akhir: Rp " . $tabungan->getSaldo();
```

## Output

```text
Error: Saldo tidak mencukupi!
Saldo Akhir: Rp 150000
```

## Cara Kerja Enkapsulasi

```text
       Luar Objek (Client Code)
                 │
                 │ $tabungan->tarik(200000)
                 ▼
       Method Publik (Pintu Gerbang Validasi)
                 │
        ┌────────┴────────┐
        │                 │
    [ Gagal ]         [ Valid ]
        │                 │
        ▼                 ▼
  Tolak & Batalkan   Kurangi $this->saldo
```

**Hafalan:**

```text
Enkapsulasi = Data disembunyikan (private) + Akses divalidasi via method publik
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Letakkan semua aturan validasi bisnis (*business rules*) di dalam method class objek terkait, bukan tercecer di file controller.
- ❌ **Kesalahan Umum:** Membuat properti `private` namun langsung membuat getter dan setter polos tanpa validasi apa pun (ini sama saja dengan membuat properti publik).

---

<a id="bagian-10"></a>

# 10. 🟢 Getter dan Setter (Accessor & Mutator)

## Konsep

- **Getter (Accessor):** Method publik yang bertugas membaca dan mengembalikan nilai properti private/protected.
- **Setter (Mutator):** Method publik yang bertugas memvalidasi dan mengubah nilai properti private/protected.

Konvensi penamaan standar: `getPropertyName()` dan `setPropertyName($value)`.

## Contoh

```php
<?php

class AkunUser
{
    private string $email;

    public function setEmail(string $email): void
    {
        // Validasi format email sebelum disimpan
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Format email tidak valid: $email");
        }
        $this->email = strtolower($email);
    }

    public function getEmail(): string
    {
        return $this->email;
    }
}

$user = new AkunUser();
$user->setEmail("Budi.Santoso@Example.COM");
echo "Email tersimpan: " . $user->getEmail();
```

## Output

```text
Email tersimpan: budi.santoso@example.com
```

## Alur Setter & Getter

```text
       Input Luar ("Budi.Santoso@Example.COM")
                      │
                      │ setEmail()
                      ▼
       Validasi FILTER_VALIDATE_EMAIL & strtolower()
                      │
                      ▼
       Disimpan di properti private $email
                      │
                      │ getEmail()
                      ▼
       Output Bersih: "budi.santoso@example.com"
```

**Hafalan:**

```text
public function getProperty(): type { return $this->property; }
public function setProperty(type $value): void { $this->property = $value; }
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Berikan sanitasi atau transformasi format (seperti `trim()`, `strtolower()`) di dalam setter saat menerima input data.
- ❌ **Kesalahan Umum:** Mengembalikan referensi langsung ke array internal yang memungkinkan data termodifikasi tanpa melewati setter.

---

<a id="bagian-11"></a>

# 11. 🟢 Inheritance (Pewarisan dengan `extends`)

## Konsep

**Inheritance (Pewarisan)** memungkinkan sebuah class anak (*subclass/child class*) mewarisi seluruh properti dan method berstatus `public` dan `protected` dari class induk (*superclass/parent class*).

Pewarisan ditulis menggunakan kata kunci **`extends`**. Di PHP, sebuah class **hanya boleh mewarisi tepat satu class induk** (*single inheritance*).

## Contoh

```php
<?php

class Karyawan
{
    public function __construct(
        public string $nama,
        public int $gajiPokok
    ) {}

    public function getGajiTotal(): int
    {
        return $this->gajiPokok;
    }
}

// Manager mewarisi seluruh fitur Karyawan
class Manager extends Karyawan
{
    public int $tunjangan = 5000000;

    public function getGajiTotal(): int
    {
        return $this->gajiPokok + $this->tunjangan;
    }
}

$mgr = new Manager("Budi", 10000000);
echo "Manager: {$mgr->nama} | Gaji Total: Rp " . number_format($mgr->getGajiTotal(), 0, ",", ".");
```

## Output

```text
Manager: Budi | Gaji Total: Rp 15.000.000
```

## Struktur Pewarisan Class

```text
       Parent Class: Karyawan ($nama, $gajiPokok, getGajiTotal())
                            │
                            │ extends
                            ▼
       Child Class: Manager ($tunjangan, override getGajiTotal())
```

**Hafalan:**

```text
class ChildClass extends ParentClass { ... }  → Mewarisi seluruh member parent
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan inheritance jika terdapat hubungan **"IS-A" (Adalah Suatu)** yang valid (misal: *Manager IS-A Karyawan*).
- ❌ **Kesalahan Umum:** Menggunakan inheritance semata-mata demi *code sharing* padahal hubungannya bukan "IS-A" (untuk kasus ini, gunakan *Composition* atau *Trait*).

---

<a id="bagian-12"></a>

# 12. 🟢 Method Overriding & Strict Compatibility

## Konsep

**Method Overriding** adalah kemampuan class anak untuk menulis ulang implementasi method yang diwarisi dari class induk dengan nama yang sama persis.

Aturan Kompatibilitas PHP Modern:
1. Tipe parameter pada class anak harus kompatibel atau sama dengan class induk.
2. Return type pada class anak tidak boleh lebih luas daripada class induk.
3. Tingkat visibilitas pada class anak **tidak boleh lebih ketat** daripada class induk (misal: `public` di parent tidak boleh diubah jadi `protected` di child).

## Contoh

```php
<?php

class Notifikasi
{
    public function kirim(string $pesan): void
    {
        echo "Mengirim notifikasi umum: $pesan" . PHP_EOL;
    }
}

class EmailNotifikasi extends Notifikasi
{
    // Override method kirim() khusus untuk email
    public function kirim(string $pesan): void
    {
        echo "Mengirim EMAIL via SMTP Server: $pesan" . PHP_EOL;
    }
}

$notif = new EmailNotifikasi();
$notif->kirim("Tagihan bulanan telah terbit.");
```

## Output

```text
Mengirim EMAIL via SMTP Server: Tagihan bulanan telah terbit.
```

## Cara Kerja Method Resolution

```text
       Pemanggilan: $notif->kirim()
                     │
                     ▼ Cek apakah ada method kirim() di class EmailNotifikasi?
                 [ Ya ]
                     ▼
       Eksekusi method milik EmailNotifikasi (Hasil Override)
```

**Hafalan:**

```text
Override = Menulis ulang method parent di child class dengan nama yang sama
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan atribut `#[Override]` di atas method pada PHP 8.3+ untuk memastikan bahwa method tersebut benar-benar meng-override method parent.
- ❌ **Kesalahan Umum:** Mengubah visibility dari `public` di parent menjadi `private` di child class (*Fatal Error: Access level must be public*).

---

<a id="bagian-13"></a>

# 13. 🟢 `parent` Keyword & Parent Constructor

## Konsep

Kata kunci **`parent`** digunakan di dalam class anak untuk memanggil method atau constructor milik class induk yang telah ditimpa (*overridden*).

Operator resolusi scope **`parent::methodName()`** memastikan logika pada class induk tetap dijalankan sebelum atau sesudah logika tambahan milik class anak dieksekusi.

## Contoh

```php
<?php

class Kendaraan
{
    public function __construct(public string $merk, public int $tahun)
    {
        echo "1. Constructor Kendaraan ($merk, $tahun) dijalankan." . PHP_EOL;
    }
}

class MobilSport extends Kendaraan
{
    public function __construct(string $merk, int $tahun, public int $kapasitasCc)
    {
        // Memanggil constructor parent
        parent::__construct($merk, $tahun);
        
        echo "2. Constructor MobilSport ($kapasitasCc cc) selesai." . PHP_EOL;
    }
}

$ferrari = new MobilSport("Ferrari", 2026, 4000);
```

## Output

```text
1. Constructor Kendaraan (Ferrari, 2026) dijalankan.
2. Constructor MobilSport (4000 cc) selesai.
```

## Alur Pemanggilan Parent Constructor

```text
       new MobilSport("Ferrari", 2026, 4000)
                 │
                 ▼
       MobilSport::__construct()
                 │
                 │ parent::__construct("Ferrari", 2026)
                 ▼
       Kendaraan::__construct() (Inisialisasi $merk & $tahun)
                 │
                 ▼
       Lanjutkan sisa inisialisasi properti $kapasitasCc di MobilSport
```

**Hafalan:**

```text
parent::__construct($args)  → Menjalankan constructor class induk
parent::methodName($args)   → Menjalankan method class induk yang di-override
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Selalu panggil `parent::__construct()` di baris pertama constructor anak jika class induk memiliki constructor sendiri.
- ❌ **Kesalahan Umum:** Lupa memanggil constructor parent sehingga properti penting yang diinisialisasi di class induk menjadi kosong/uninitialized.

---

<a id="bagian-14"></a>

# 14. 🟢 Abstract Class & Abstract Method

## Konsep

- **Abstract Class:** Class setengah matang yang **tidak dapat diinstansiasi secara langsung** (`new AbstractClass()` ❌). Class ini berfungsi sebagai kerangka dasar wajib bagi class-class turunannya.
- **Abstract Method:** Method tanpa isi blok kode yang wajib diimplementasikan secara konkret oleh setiap class anak turunan non-abstract.

## Contoh

```php
<?php

abstract class Pembayaran
{
    public function __construct(public int $nominal) {}

    // Method abstract: wajib diisi oleh anak
    abstract public function prosesPembayaran(): bool;

    // Method konkret: langsung bisa digunakan
    public function cetakKuitansi(): void
    {
        echo "Kuitansi Pembayaran senilai Rp " . number_format($this->nominal, 0, ",", ".") . PHP_EOL;
    }
}

class PembayaranTransferBank extends Pembayaran
{
    public function prosesPembayaran(): bool
    {
        echo "Memverifikasi mutasi rekening bank untuk nominal Rp {$this->nominal}..." . PHP_EOL;
        return true;
    }
}

$bayar = new PembayaranTransferBank(500000);
$bayar->prosesPembayaran();
$bayar->cetakKuitansi();
```

## Output

```text
Memverifikasi mutasi rekening bank untuk nominal Rp 500000...
Kuitansi Pembayaran senilai Rp 500.000
```

## Struktur Abstract Class

```text
       abstract class Pembayaran (Tidak bisa di-new)
       • abstract public function prosesPembayaran(): bool; (Wajib diisi anak)
       • public function cetakKuitansi(): void { ... }      (Langsung diwariskan)
                     │
                     │ extends
                     ▼
       class PembayaranTransferBank (Konkret)
       • Mengisi kode logika prosesPembayaran()
```

**Hafalan:**

```text
abstract class ClassName { ... }          → Class cetak biru yang tidak bisa di-instansiasi
abstract public function methodName();   → Deklarasi kontrak method wajib tanpa kurung kurawal
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan abstract class ketika beberapa class anak berbagi banyak properti dan logika bersama, namun memiliki 1 atau 2 perilaku spesifik yang berbeda.
- ❌ **Kesalahan Umum:** Mencoba membuat abstract method dengan isi kurung kurawal (`abstract public function test() {}` ❌).

---

<a id="bagian-15"></a>

# 15. 🟢 Interface & Multiple Interfaces

## Konsep

**Interface** adalah kontrak murni 100% yang mendefinisikan daftar method apa saja yang **wajib disediakan oleh sebuah class**, tanpa memuat kode implementasi sama sekali.

Keunggulan terbesar Interface dibandingkan Class: sebuah class PHP dapat mengimplementasikan **banyak interface sekaligus (*Multiple Interfaces*)** menggunakan kata kunci **`implements`**.

## Contoh

```php
<?php

interface DapatDieksporPdf
{
    public function exportPdf(): string;
}

interface DapatDikirimEmail
{
    public function kirimEmail(string $tujuan): bool;
}

// Mengimplementasikan 2 interface sekaligus
class LaporanKeuangan implements DapatDieksporPdf, DapatDikirimEmail
{
    public function exportPdf(): string
    {
        return "File PDF Laporan Keuangan berhasil dibuat.";
    }

    public function kirimEmail(string $tujuan): bool
    {
        echo "Laporan berhasil dikirim ke email: $tujuan" . PHP_EOL;
        return true;
    }
}

$laporan = new LaporanKeuangan();
echo $laporan->exportPdf() . PHP_EOL;
$laporan->kirimEmail("direktur@perusahaan.com");
```

## Output

```text
File PDF Laporan Keuangan berhasil dibuat.
Laporan berhasil dikirim ke email: direktur@perusahaan.com
```

## Matriks: Abstract Class vs Interface

```text
Fitur                       Abstract Class              Interface
──────────────────────────────────────────────────────────────────────────
Metode Implementasi         Boleh konkret & abstract    Murni kontrak (100% abstract)
Properti Data               Bisa memiliki properti      Hanya bisa konstanta (const)
Jumlah Implementasi         Single (1 extends)          Multiple (banyak implements)
```

**Hafalan:**

```text
interface InterfaceName { ... }               → Membuat kontrak interface
class MyClass implements IntfA, IntfB { ... } → Memenuhi implementasi banyak interface
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Berikan nama interface yang mencerminkan kemampuan atau peran (*role*), sering diakhiri kata sifat seperti `Exportable`, `Loggable`, `Jsonable`.
- ❌ **Kesalahan Umum:** Memberikan visibility `private` atau `protected` pada method interface (seluruh method interface WAJIB `public`).

---

<a id="bagian-16"></a>

# 16. 🟢 Interface Inheritance

## Konsep

Sama seperti class, **sebuah interface dapat mewarisi interface lainnya** menggunakan kata kunci **`extends`**. Class yang mengimplementasikan interface anak wajib memenuhi seluruh method dari interface anak dan seluruh method dari interface induknya.

## Contoh

```php
<?php

interface RepositoryDasar
{
    public function findById(int $id): ?array;
    public function save(array $data): bool;
}

// Interface turunan mewarisi method findById & save
interface UserRepositoryInterface extends RepositoryDasar
{
    public function findByEmail(string $email): ?array;
}

class UserRepository implements UserRepositoryInterface
{
    public function findById(int $id): ?array { return ["id" => $id, "name" => "Budi"]; }
    public function save(array $data): bool { return true; }
    public function findByEmail(string $email): ?array { return ["email" => $email]; }
}

$repo = new UserRepository();
print_r($repo->findById(1));
```

## Output

```text
Array
(
    [id] => 1
    [name] => Budi
)
```

## Hirarki Interface

```text
       interface RepositoryDasar (findById, save)
                     │
                     │ extends
                     ▼
       interface UserRepositoryInterface (findByEmail)
                     │
                     │ implements
                     ▼
       class UserRepository (Wajib mengisi findById, save, dan findByEmail)
```

**Hafalan:**

```text
interface ChildInterface extends ParentInterface { ... }
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Pecah interface menjadi bagian-bagian kecil yang terfokus (*Interface Segregation Principle*).
- ❌ **Kesalahan Umum:** Membuat interface raksasa yang memaksa class mengimplementasikan method yang sebenarnya tidak dibutuhkan.

---

<a id="bagian-17"></a>

# 17. 🟢 Polymorphism (Satu Kontrak, Banyak Bentuk)

## Konsep

**Polymorphism (Banyak Bentuk)** adalah kemampuan kode aplikasi untuk memperlakukan berbagai objek yang berbeda dengan cara yang seragam, selama objek-objek tersebut mengimplementasikan interface atau parent class yang sama.

Dengan polymorphism, kita dapat menambah fitur pembayaran/notifikasi baru tanpa mengubah kode sistem utama.

## Contoh

```php
<?php

interface GatewayPembayaran
{
    public function bayar(int $jumlah): void;
}

class MidtransGateway implements GatewayPembayaran
{
    public function bayar(int $jumlah): void
    {
        echo "Pembayaran Rp $jumlah diproses via Snap Midtrans." . PHP_EOL;
    }
}

class XenditGateway implements GatewayPembayaran
{
    public function bayar(int $jumlah): void
    {
        echo "Pembayaran Rp $jumlah diproses via Virtual Account Xendit." . PHP_EOL;
    }
}

// Fungsi utama menerima interface (Polymorphic)
function selesaikanOrder(GatewayPembayaran $gateway, int $total): void
{
    $gateway->bayar($total);
}

selesaikanOrder(new MidtransGateway(), 150000);
selesaikanOrder(new XenditGateway(), 250000);
```

## Output

```text
Pembayaran Rp 150000 diproses via Snap Midtrans.
Pembayaran Rp 250000 diproses via Virtual Account Xendit.
```

## Cara Kerja Polymorphism

```text
       Fungsi: selesaikanOrder(GatewayPembayaran $gateway)
                                │
               ┌────────────────┴────────────────┐
               │                                 │
               ▼                                 ▼
       $gateway = MidtransGateway        $gateway = XenditGateway
       ->bayar() via Midtrans            ->bayar() via Xendit
```

**Hafalan:**

```text
Polymorphism = Bergantung pada Interface/Abstraksi, bukan pada class konkret
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Terapkan prinsip *Dependency Inversion* dengan selalu mem-passing interface pada parameter fungsi atau constructor.
- ❌ **Kesalahan Umum:** Menggunakan banyak percabangan `if ($type == 'midtrans') ... elseif ($type == 'xendit')` yang merusak fleksibilitas polymorphism.

---

<a id="bagian-18"></a>

# 18. 🟢 Type Declaration & `instanceof` Operator

## Konsep

- **Object Type Declaration:** Memastikan parameter fungsi atau properti menerima instance dari class atau interface tertentu.
- **`instanceof` Operator:** Memeriksa pada saat *runtime* apakah suatu objek merupakan turunan dari class tertentu atau mengimplementasikan interface tertentu (menghasilkan boolean `true` atau `false`).

## Contoh

```php
<?php

interface Pesan
{
    public function getKonten(): string;
}

class EmailPesan implements Pesan
{
    public function getKonten(): string { return "Isi Email"; }
}

class SmsPesan implements Pesan
{
    public function getKonten(): string { return "Isi SMS"; }
}

$pesanA = new EmailPesan();

var_dump($pesanA instanceof EmailPesan); // bool(true)
var_dump($pesanA instanceof Pesan);      // bool(true) - mengimplementasikan interface
var_dump($pesanA instanceof SmsPesan);   // bool(false)
```

## Output

```text
bool(true)
bool(true)
bool(false)
```

**Hafalan:**

```text
$object instanceof ClassName      → Memeriksa apakah $object turunan dari ClassName
$object instanceof InterfaceName  → Memeriksa apakah $object mengimplementasikan InterfaceName
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan type declaration di parameter fungsi sebagai validasi utama; gunakan `instanceof` hanya saat mengecek koleksi objek heterogen.
- ❌ **Kesalahan Umum:** Menggunakan perbandingan string nama class `get_class($obj) === 'EmailPesan'` yang tidak mengenali hubungan inheritance dan interface.

---

<a id="bagian-19"></a>

# 19. 🟡 Namespace & Penataan Struktur Kode

## Konsep

**Namespace** digunakan untuk mengelompokkan class, interface, function, dan konstanta agar terorganisir rapi dan **mencegah bentrokan nama (*name collision*)** ketika aplikasi menggunakan library eksternal.

Namespace dideklarasikan di **baris pertama paling atas file** menggunakan kata kunci `namespace Vendor\Package;`.

## Contoh

File `src/Payment/Invoice.php`:

```php
<?php

namespace App\Payment;

class Invoice
{
    public function cetak(): string
    {
        return "Invoice Pembayaran";
    }
}
```

File utama `index.php`:

```php
<?php

require_once "src/Payment/Invoice.php";

// Mengakses class dengan Fully Qualified Class Name (FQCN)
$inv = new \App\Payment\Invoice();
echo $inv->cetak();
```

## Output

```text
Invoice Pembayaran
```

## Struktur Namespace vs Folder (PSR-4)

```text
       App\Payment\Invoice
        │     │       │
        │     │       └── Nama Class: Invoice (Invoice.php)
        │     └────────── Subfolder: Payment/
        └──────────────── Root Folder: src/ (diatur via Composer PSR-4)
```

**Hafalan:**

```text
namespace App\Services;     → Mendeklarasikan ruang nama file saat ini
\App\Services\PaymentService → Akses class dengan alamat lengkap FQCN
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Ikuti standar PSR-4 di mana penamaan namespace mencerminkan struktur folder file di project Anda.
- ❌ **Kesalahan Umum:** Meletakkan statement atau output apa pun di atas deklarasi `namespace` (harus menjadi baris pertama setelah `<?php`).

---

<a id="bagian-20"></a>

# 20. 🟡 `use` Keyword (Import Class, Function, Const, & Alias)

## Konsep

Kata kunci **`use`** digunakan untuk mengimpor (*import*) class, interface, fungsi, atau konstanta dari namespace lain ke dalam file aktif, sehingga kita tidak perlu menuliskan nama namespace yang panjang berulang kali.

Jika terdapat dua class dengan nama yang sama persis dari namespace berbeda, gunakan kata kunci **`as`** untuk membuat **Alias**.

## Contoh

```php
<?php

namespace App;

// Mengimpor class dari namespace lain
use App\Payment\Invoice as PaymentInvoice;
use function strlen;
use const PHP_EOL;

$invoice = new PaymentInvoice();
echo $invoice->cetak() . PHP_EOL;
```

## Output

```text
Invoice Pembayaran
```

**Hafalan:**

```text
use Path\To\ClassName;              → Import class agar bisa dipanggil pendek
use Path\To\ClassName as AliasName; → Import class dengan nama alias kustom
use function Path\To\functionName;  → Import fungsi global/namespace
use const Path\To\CONST_NAME;       → Import konstanta
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Urutkan baris `use` secara alfabetis dan kelompokkan berdasarkan jenisnya (PSR-12).
- ❌ **Kesalahan Umum:** Mengimpor dua class bernama sama tanpa memberikan alias `as` (*Fatal Error: Cannot use App\A\User as User because the name is already in use*).

---

<a id="bagian-21"></a>

# 21. 🟡 `static` Keyword (Static Property & Method)

## Konsep

Kata kunci **`static`** mendefinisikan properti atau method yang **menjadi milik class itu sendiri**, bukan milik instance objek individu.

Karakteristik Static Member:
- Dapat dipanggil langsung tanpa perlu membuat objek (`new`) terlebih dahulu.
- Nilai static property dibagi bersama (*shared state*) oleh seluruh instance class.
- Dipanggil menggunakan operator resolusi scope ganda **`::`** (Paamayim Nekudotayim).

## Contoh

```php
<?php

class KonverterMataUang
{
    public static float $kursUsdKeIdr = 16000.0;

    public static function keRupiah(float $usd): float
    {
        return $usd * self::$kursUsdKeIdr;
    }
}

// Akses langsung tanpa membuat new KonverterMataUang()
echo "Kurs: Rp " . KonverterMataUang::$kursUsdKeIdr . PHP_EOL;
echo "$10 USD = Rp " . number_format(KonverterMataUang::keRupiah(10), 0, ",", ".");
```

## Output

```text
Kurs: Rp 16000
$10 USD = Rp 160.000
```

## Alokasi Memori: Static vs Instance

```text
       ┌────────────────────────────────────────────────────────────┐
       │ Class KonverterMataUang (Memori Statis Tunggal)            │
       │ • static $kursUsdKeIdr = 16000 (Dibagi bersama oleh semua) │
       └────────────────────────────────────────────────────────────┘
```

**Hafalan:**

```text
ClassName::$staticProperty    → Mengakses properti statis dari luar class
ClassName::staticMethod()     → Menjalankan method statis dari luar class
self::$staticProperty         → Mengakses properti statis dari dalam class
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan static method untuk fungsi helper utilitas murni (*pure helper functions*) yang tidak membutuhkan state objek (misal: `Str::slug()`, `Math::round()`).
- ❌ **Kesalahan Umum:** Menggunakan `$this` di dalam static method (static method tidak memiliki konteks `$this`!).

---

<a id="bagian-22"></a>

# 22. 🟡 `self` vs `$this` vs `parent`

## Konsep

Tiga kata kunci referensi internal di PHP:
1. **`$this`:** Merujuk ke **instance objek saat ini** (digunakan untuk properti/method non-static).
2. **`self`:** Merujuk ke **class tempat kode tersebut ditulis** secara statis saat *compile-time*.
3. **`parent`:** Merujuk ke **class induk langsung** dari class saat ini.

## Contoh

```php
<?php

class Induk
{
    public static string $nama = "Induk";

    public function getSelf(): string { 
        return self::$nama;
    }
}

class Anak extends Induk
{
    public static string $nama = "Anak";
}

$anak = new Anak();
echo "Hasil self: " . $anak->getSelf(); // Menghasilkan "Induk" karena self diikat di class Induk
```

## Output

```text
Hasil self: Induk
```

## Matriks Perbandingan Referensi

```text
       Kata Kunci     Konteks           Operator     Target Rujukan
       ──────────────────────────────────────────────────────────────────────────
       $this          Non-Static        ->           Instance Objek aktif saat runtime
       self           Static / Class    ::           Class tempat kode tersebut ditulis
       parent         Parent Class      ::           Class induk langsung
```

**Hafalan:**

```text
$this->property   → Akses member instance objek saat ini
self::$property   → Akses static member class sendiri
parent::method()  → Akses method milik class induk
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan `static::` (Late Static Binding) alih-alih `self::` jika Anda menginginkan subclass dapat meng-override static property/method parent.
- ❌ **Kesalahan Umum:** Menggunakan `$this->` untuk memanggil static property (seharusnya gunakan `self::$property`).

---

<a id="bagian-23"></a>

# 23. 🟡 `final` Keyword (Final Method & Class)

## Konsep

Kata kunci **`final`** digunakan untuk mencegah pewarisan atau modifikasi lebih lanjut:
- **Final Class:** Class yang **tidak dapat diwarisi / di-extends** sama sekali oleh class lain.
- **Final Method:** Method yang **tidak dapat di-override** oleh class anak.

## Contoh

```php
<?php

class AlgoritmaKeamanan
{
    // Method ini tidak boleh diubah oleh class turunan mana pun
    final public function enkripsi(string $data): string
    {
        return hash("sha256", $data);
    }
}

// Class ini terkunci total dan tidak bisa di-extends
final class DatabaseConnection
{
    public function connect(): string { return "Connected"; }
}

// class CustomDb extends DatabaseConnection {} // ERROR! Cannot extend final class
```

**Hafalan:**

```text
final class ClassName { ... }         → Mencegah class di-extends
final public function methodName()    → Mencegah method di-override
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Berikan keyword `final` pada class value object atau algoritma keamanan kritis yang tidak boleh dimodifikasi perilsakunya.
- ❌ **Kesalahan Umum:** Menjadikan abstract class sebagai `final` (kontradiktif! Abstract mewajibkan extends, sedangkan final melarang extends).

---

<a id="bagian-24"></a>

# 24. 🟡 Trait (Horizontal Code Reuse)

## Konsep

PHP hanya mendukung *Single Inheritance* (hanya bisa `extends` 1 class). **Trait** hadir sebagai mekanisme untuk berbagi method dan properti antar class yang tidak berada dalam satu garis keturunan pewarisan (*Horizontal Code Reuse*).

Trait dimasukkan ke dalam class menggunakan kata kunci **`use TraitName;`** di dalam blok class.

## Contoh

```php
<?php

trait HasTimestamps
{
    public string $createdAt;
    public string $updatedAt;

    public function recordTimestamps(): void
    {
        $this->createdAt = date("Y-m-d H:i:s");
        $this->updatedAt = date("Y-m-d H:i:s");
    }
}

class User
{
    use HasTimestamps; // Memasukkan trait
    public string $name = "Budi";
}

class Product
{
    use HasTimestamps; // Menggunakan trait yang sama
    public string $title = "Buku PHP";
}

$user = new User();
$user->recordTimestamps();
echo "User: {$user->name} dibuat pada {$user->createdAt}";
```

## Output

```text
User: Budi dibuat pada 2026-08-25 22:25:00
```

## Visualisasi Trait (Horizontal Reuse)

```text
                        ┌──────────────────┐
                        │ trait HasLog     │
                        └────────┬─────────┘
                 ┌───────────────┴───────────────┐
                 │ use                           │ use
                 ▼                               ▼
       class OrderController           class ProductRepository
       (Garis pewarisan berbeda)       (Garis pewarisan berbeda)
```

**Hafalan:**

```text
trait TraitName { ... }    → Mendefinisikan trait baru
use TraitA, TraitB;        → Memasang satu atau banyak trait di dalam class
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan trait untuk kemampuan utilitas lintas class (seperti `Loggable`, `HasSlug`, `Auditable`).
- ❌ **Kesalahan Umum:** Memasukkan terlalu banyak trait ke dalam satu class hingga menciptakan kode siluman (*hidden dependencies*) yang sulit ditelusuri.

---

<a id="bagian-25"></a>

# 25. 🟡 Trait Conflict, Priority & Alias (`insteadof` & `as`)

## Konsep

Jika sebuah class menggunakan dua trait yang memiliki nama method yang persis sama, PHP akan melempar *Fatal Error*.

Untuk mengatasi bentrokan:
1. **`insteadof`:** Memilih secara eksplisit method dari trait mana yang akan dipakai.
2. **`as`:** Memberikan nama alias alternatif pada method trait lainnya.

## Contoh

```php
<?php

trait LoggerA
{
    public function log(string $msg): void { echo "[LoggerA]: $msg" . PHP_EOL; }
}

trait LoggerB
{
    public function log(string $msg): void { echo "[LoggerB]: $msg" . PHP_EOL; }
}

class Service
{
    use LoggerA, LoggerB {
        // Gunakan log() milik LoggerA alih-alih LoggerB
        LoggerA::log insteadof LoggerB;
        // Berikan alias untuk log() milik LoggerB
        LoggerB::log as logBackup;
    }
}

$srv = new Service();
$srv->log("Pesan utama");
$srv->logBackup("Pesan cadangan");
```

## Output

```text
[LoggerA]: Pesan utama
[LoggerB]: Pesan cadangan
```

**Hafalan:**

```text
TraitA::method insteadof TraitB;  → Pilih method TraitA untuk menyelesaikan bentrok
TraitB::method as aliasName;       → Ganti nama panggilan method dari TraitB
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Rancang nama method di dalam trait secara unik untuk meminimalisir kemungkinan konflik sejak awal.
- ❌ **Kesalahan Umum:** Lupa menangani konflik method trait ganda yang menghasilkan *Fatal Error: Trait method has not been applied*.

---

<a id="bagian-26"></a>

# 26. 🟡 Anonymous Class

## Konsep

**Anonymous Class** adalah class tanpa nama yang dibuat langsung pada saat *runtime*. Fitur ini sangat berguna untuk membuat objek instan sekali pakai, seperti untuk kebutuhan *mocking unit testing* atau konfigurasi handler sederhana.

## Contoh

```php
<?php

interface Logger
{
    public function log(string $pesan): void;
}

function prosesSistem(Logger $logger): void
{
    $logger->log("Sistem berhasil dijalankan.");
}

// Membuat anonymous class yang langsung mengimplementasikan interface
prosesSistem(new class implements Logger {
    public function log(string $pesan): void
    {
        echo "[IN-MEMORY LOG]: $pesan" . PHP_EOL;
    }
});
```

## Output

```text
[IN-MEMORY LOG]: Sistem berhasil dijalankan.
```

**Hafalan:**

```text
$obj = new class($args) { ... };  → Membuat objek dari class anonim instan
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan anonymous class untuk objek *mock* saat testing atau passing callback kompleks satu kali pakai.
- ❌ **Kesalahan Umum:** Menggunakan anonymous class untuk struktur data domain utama yang perlu dipakai berulang di banyak file.

---

<a id="bagian-27"></a>

# 27. 🟡 `stdClass` & Object Casting

## Konsep

**`stdClass`** adalah class bawaan PHP yang kosong secara default. Objek `stdClass` sering digunakan saat melakukan konversi (*casting*) dari associative array menjadi objek menggunakan sintaks `(object) $array`, atau saat melakukan decoding JSON (`json_decode($json)`).

## Contoh

```php
<?php

$dataArray = [
    "nama" => "Budi",
    "kota" => "Surabaya"
];

// Konversi array ke stdClass object
$obj = (object) $dataArray;

echo "Nama: " . $obj->nama . PHP_EOL;
echo "Kota: " . $obj->kota . PHP_EOL;
var_dump($obj);
```

## Output

```text
Nama: Budi
Kota: Surabaya
object(stdClass)#1 (2) {
  ["nama"]=>
  string(4) "Budi"
  ["kota"]=>
  string(8) "Surabaya"
}
```

**Hafalan:**

```text
$obj = (object) $array;   → Casting associative array menjadi objek stdClass
$obj = new stdClass();    → Membuat objek generic kosong bawaan PHP
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan DTO / Class kustom ber-tipe daripada `stdClass` jika struktur data memiliki aturan validasi bisnis.
- ❌ **Kesalahan Umum:** Mengira `stdClass` memiliki method; `stdClass` murni penampung properti dinamis tanpa method.

---

<a id="bagian-28"></a>

# 28. 🟡 Object Cloning (`clone` & `__clone`)

## Konsep

Di PHP, saat kita melakukan penugasan variabel objek `$b = $a`, PHP melakukan *pass-by-reference handle* (keduanya menunjuk ke objek yang sama di memori).

Untuk menduplikasi objek secara terpisah, gunakan kata kunci **`clone $object`**. Jika objek tersebut memiliki referensi ke objek bersarang lain, definisikan magic method **`__clone()`** untuk melakukan *Deep Copy*.

## Contoh

```php
<?php

class Alamat
{
    public function __construct(public string $kota) {}
}

class Karyawan
{
    public function __construct(public string $nama, public Alamat $alamat) {}

    // Magic method clone untuk deep copy
    public function __clone()
    {
        $this->alamat = clone $this->alamat; // Kloning juga objek anaknya
    }
}

$karyawan1 = new Karyawan("Budi", new Alamat("Jakarta"));
$karyawan2 = clone $karyawan1;

$karyawan2->nama = "Andi";
$karyawan2->alamat->kota = "Bandung";

echo "Karyawan 1: {$karyawan1->nama} ({$karyawan1->alamat->kota})" . PHP_EOL;
echo "Karyawan 2: {$karyawan2->nama} ({$karyawan2->alamat->kota})";
```

## Output

```text
Karyawan 1: Budi (Jakarta)
Karyawan 2: Andi (Bandung)
```

## Perbedaan Assignment vs Clone

```text
       Assignment ($b = $a)              Cloning ($b = clone $a)
       ┌───────────┐                     ┌───────────┐       ┌───────────┐
       │ $a  |  $b │                     │ Objek $a  │       │ Objek $b  │
       └─────┬─────┘                     └───────────┘       └───────────┘
             ▼                                 Dua objek independen
       1 Objek Memori                          di memori terpisah
```

**Hafalan:**

```text
$copy = clone $original;   → Menduplikasi objek menjadi instance terpisah
public function __clone()  → Method yang otomatis dipanggil saat proses kloning
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Terapkan *Deep Copy* di dalam `__clone()` jika objek Anda memiliki properti bertipe objek lain.
- ❌ **Kesalahan Umum:** Mengira `$b = $a` membuat salinan objek baru; perubahan pada `$b` akan merusak data pada `$a`.

---

<a id="bagian-29"></a>

# 29. 🟡 Comparing Objects (`==` vs `===`)

## Konsep

Dua operator untuk membandingkan objek di PHP:
1. **Perbandingan Kesamaan (`$a == $b`):** Bernilai `true` jika kedua objek berasal dari **class yang sama dan seluruh nilai propertinya sama**.
2. **Perbandingan Identik (`$a === $b`):** Bernilai `true` HANYA JIKA kedua variabel merujuk ke **instance fisik yang persis sama di memori RAM**.

## Contoh

```php
<?php

class Titik
{
    public function __construct(public int $x, public int $y) {}
}

$t1 = new Titik(10, 20);
$t2 = new Titik(10, 20);
$t3 = $t1; // Merujuk ke objek yang sama persis

var_dump($t1 == $t2);  // bool(true)  - class sama & properti sama
var_dump($t1 === $t2); // bool(false) - slot memori berbeda
var_dump($t1 === $t3); // bool(true)  - slot memori persis sama
```

## Output

```text
bool(true)
bool(false)
bool(true)
```

**Hafalan:**

```text
$objA == $objB    → True jika tipe class sama dan semua isi propertinya bernilai sama
$objA === $objB   → True hanya jika menunjuk ke alamat instance memori yang persis sama
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan `===` jika Anda ingin memastikan bahwa variabel adalah objek yang sama persis (misal: *identity check*).
- ❌ **Kesalahan Umum:** Membandingkan dua objek hasil kloning dengan `===` dan berharap hasilnya `true`.

---

<a id="bagian-30"></a>

# 30. 🟡 Magic Methods Populer

## Konsep

**Magic Methods** adalah method-method khusus bawaan PHP yang selalu diawali dengan garis bawah ganda (`__`). Method ini dipicu secara otomatis oleh PHP saat terjadi aksi tertentu pada objek.

Magic Methods paling populer:
- `__toString()` : Dipicu saat objek dicetak sebagai string (`echo $obj`).
- `__invoke()` : Dipicu saat objek dipanggil seperti memanggil fungsi (`$obj()`).
- `__get($name)` / `__set($name, $value)` : Dipicu saat membaca/menulis properti yang tidak ada atau tidak dapat diakses.
- `__call($name, $arguments)` : Dipicu saat memanggil method yang tidak ada.

## Contoh

```php
<?php

class Pengguna
{
    public function __construct(public string $nama, public string $role) {}

    // Dipanggil saat: echo $obj
    public function __toString(): string
    {
        return "Pengguna: {$this->nama} (Role: {$this->role})";
    }

    // Dipanggil saat: $obj()
    public function __invoke(string $tindakan): void
    {
        echo "Menjalankan aksi '$tindakan' untuk {$this->nama}." . PHP_EOL;
    }
}

$user = new Pengguna("Budi Santoso", "Admin");
echo $user . PHP_EOL; // Memanggil __toString()
$user("ExportData");  // Memanggil __invoke()
```

## Output

```text
Pengguna: Budi Santoso (Role: Admin)
Menjalankan aksi 'ExportData' untuk Budi Santoso.
```

**Hafalan:**

```text
__toString()               → Mengonversi objek ke representasi teks saat di-echo
__invoke(...$args)         → Menjadikan objek dapat dipanggil seperti fungsi $obj()
__get($prop) / __set($p,$v) → Menangkap akses ke properti yang tidak terdefinisi
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Implementasikan `__toString()` pada Value Objects atau Entity untuk kemudahan debugging dan logging.
- ❌ **Kesalahan Umum:** Menggunakan `__get` dan `__set` secara berlebihan sehingga kode kehilangan dukungan autocomplete IDE.

---

<a id="bagian-31"></a>

# 31. 🟡 Overloading Property & Method Dinamis

## Konsep

Di PHP, **Overloading** memiliki arti berbeda dibanding bahasa C++/Java. Di PHP, Overloading adalah kemampuan menangani pemanggilan properti atau method yang tidak terdefinisi secara dinamis melalui magic methods `__get`, `__set`, `__isset`, `__unset`, dan `__call`.

## Contoh

```php
<?php

class DynamicBag
{
    private array $storage = [];

    public function __set(string $name, mixed $value): void
    {
        $this->storage[$name] = $value;
    }

    public function __get(string $name): mixed
    {
        return $this->storage[$name] ?? null;
    }

    public function __call(string $name, array $arguments): mixed
    {
        echo "Method '$name' tidak ditemukan! Argumen: " . implode(", ", $arguments) . PHP_EOL;
        return null;
    }
}

$bag = new DynamicBag();
$bag->warna = "Merah"; // Memicu __set
echo "Warna: " . $bag->warna . PHP_EOL; // Memicu __get
$bag->simpanData("data1", 123); // Memicu __call
```

## Output

```text
Warna: Merah
Method 'simpanData' tidak ditemukan! Argumen: data1, 123
```

**Hafalan:**

```text
__set($key, $val)          → Intersep penulisan properti dinamis
__get($key)                → Intersep pembacaan properti dinamis
__call($method, $args)     → Intersep pemanggilan method dinamis
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan overloading untuk proxy atau wrapper library eksternal secara terkontrol.
- ❌ **Kesalahan Umum:** Menyimpan data bisnis inti di dalam properti dinamis tanpa schema atau type checking yang jelas.

---

<a id="bagian-32"></a>

# 32. 🟡 Object Iteration (`IteratorAggregate` & `Traversable`)

## Konsep

Secara default, jika objek di-loop dengan `foreach ($object as $key => $val)`, PHP akan mengiterasi seluruh properti yang berstatus `public`.

Untuk mengontrol penuh bagaimana objek di-iterasi (misal: membaca data dari array private di dalamnya), class dapat mengimplementasikan interface bawaan PHP **`IteratorAggregate`**.

## Contoh

```php
<?php

class KeranjangBelanja implements IteratorAggregate
{
    private array $items = [];

    public function tambahItem(string $nama, int $harga): void
    {
        $this->items[] = ["nama" => $nama, "harga" => $harga];
    }

    // Wajib diisi dari interface IteratorAggregate
    public function getIterator(): Traversable
    {
        return new ArrayIterator($this->items);
    }
}

$cart = new KeranjangBelanja();
$cart->tambahItem("Kemeja", 150000);
$cart->tambahItem("Celana", 200000);

foreach ($cart as $item) {
    echo "- {$item['nama']}: Rp {$item['harga']}" . PHP_EOL;
}
```

## Output

```text
- Kemeja: Rp 150000
- Celana: Rp 200000
```

**Hafalan:**

```text
implements IteratorAggregate  → Menjadikan objek private dapat di-foreach dari luar
public function getIterator() → Mengembalikan instance ArrayIterator dari data internal
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Implementasikan `IteratorAggregate` pada class koleksi (*Collection class*) agar terasa seperti array native bagi pemanggil.
- ❌ **Kesalahan Umum:** Membuka properti internal array menjadi `public` hanya agar bisa di-loop `foreach`.

---

<a id="bagian-33"></a>

# 33. 🟡 Destructor (`__destruct`) & Resource Cleanup

## Konsep

**Destructor (`__destruct`)** adalah magic method yang otomatis dipanggil oleh PHP ketika sebuah objek dihapus dari memori, atau saat skrip PHP selesai dieksekusi seluruhnya. Destructor sangat ideal untuk membersihkan resource eksternal (menutup file handle, menutup koneksi socket, atau mencatat log akhir).

## Contoh

```php
<?php

class FileWriter
{
    public function __construct(public string $namaFile)
    {
        echo "1. Membuka file: $namaFile" . PHP_EOL;
    }

    public function tulis(string $teks): void
    {
        echo "2. Menulis data: '$teks'" . PHP_EOL;
    }

    public function __destruct()
    {
        echo "3. Menutup file {$this->namaFile} & membersihkan buffer memori." . PHP_EOL;
    }
}

$writer = new FileWriter("laporan.txt");
$writer->tulis("Data Omset Harian");
// Saat skrip selesai, __destruct otomatis dieksekusi
```

## Output

```text
1. Membuka file: laporan.txt
2. Menulis data: 'Data Omset Harian'
3. Menutup file laporan.txt & membersihkan buffer memori.
```

**Hafalan:**

```text
public function __destruct()  → Dipanggil otomatis saat objek dihapus / program selesai
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan destructor untuk menutup resource eksternal yang tidak tertangani otomatis oleh garbage collector.
- ❌ **Kesalahan Umum:** Melempar exception dari dalam `__destruct()` (dapat memicu *Fatal Error* yang tidak tertangkap jika skrip sedang shutdown).

---

<a id="bagian-34"></a>

# 34. 🔴 Generator & `yield` dalam OOP

## Konsep

**Generator** memungkinkan kita membuat method yang menghasilkan serangkaian data dalam jumlah sangat besar **tanpa harus memuat seluruh data sekaligus ke memori RAM**.

Generator menggunakan kata kunci **`yield`**. Generator mengembalikan objek `Generator` bawaan PHP yang mengimplementasikan `Iterator`.

## Contoh

```php
<?php

class LaporanGenerator
{
    // Menggunakan yield untuk streaming jutaan baris data hemat memori
    public function generateAngka(int $maksimal): Generator
    {
        for ($i = 1; $i <= $maksimal; $i++) {
            yield $i => "Baris Transaksi #$i";
        }
    }
}

$gen = new LaporanGenerator();
foreach ($gen->generateAngka(3) as $nomor => $baris) {
    echo "ID $nomor: $baris" . PHP_EOL;
}
```

## Output

```text
ID 1: Baris Transaksi #1
ID 2: Baris Transaksi #2
ID 3: Baris Transaksi #3
```

## Perbandingan Memori: Array vs Generator

```text
       Array Biasa (Memuat 1 Juta Baris Sekaligus)
       ┌────────────────────────────────────────────────────────────┐
       │ RAM Terpakai: ~100MB (Bisa Memory Limit Exceeded!)         │
       └────────────────────────────────────────────────────────────┘

       Generator dengan yield (Memproses 1 per 1 On-Demand)
       ┌────────────────────────────────────────────────────────────┐
       │ RAM Terpakai: < 1MB (Sangat Ringan & Efisien)              │
       └────────────────────────────────────────────────────────────┘
```

**Hafalan:**

```text
yield $value;       → Mengembalikan satu nilai ke perulangan lalu mem-pause eksekusi
public function fn(): Generator  → Return type fungsi generator
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan generator saat membaca file CSV berukuran gigabyte atau streaming data query database yang masif.
- ❌ **Kesalahan Umum:** Mencoba mengakses index generator dengan kurung siku (`$gen[0]` ❌). Generator hanya bisa diiterasi via loop.

---

<a id="bagian-35"></a>

# 35. 🔴 Covariance & Contravariance

## Konsep

Prinsip variansi tipe pada method overriding:
- **Covariance (Return Type):** Class anak diizinkan mengembalikan tipe yang **lebih spesifik (subtipe)** daripada tipe kembalian di class parent.
- **Contravariance (Parameter Type):** Class anak diizinkan menerima parameter dengan tipe yang **lebih umum (supertipe)** daripada tipe parameter di class parent.

## Contoh

```php
<?php

class Makanan {}
class MakananKucing extends Makanan {}

class Hewan
{
    public function makan(MakananKucing $m): void {}
    public function beranak(): Hewan { return new Hewan(); }
}

class Kucing extends Hewan
{
    // Contravariance: Parameter Makanan lebih umum dari MakananKucing
    public function makan(Makanan $m): void {}

    // Covariance: Return Kucing lebih spesifik dari Hewan
    public function beranak(): Kucing { return new Kucing(); }
}

echo "Covariance & Contravariance valid di PHP 8+";
```

## Output

```text
Covariance & Contravariance valid di PHP 8+
```

**Hafalan:**

```text
Covariance     → Return type boleh lebih spesifik (Child Class)
Contravariance → Parameter type boleh lebih luas / umum (Parent Class)
```

---

<a id="bagian-36"></a>

# 36. 🔴 Reflection API (Introspeksi Class & Object)

## Konsep

**Reflection API** adalah kumpulan class bawaan PHP (`ReflectionClass`, `ReflectionMethod`, `ReflectionProperty`) yang memungkinkan program untuk **menginspeksi struktur kode dirinya sendiri** saat runtime (melihat daftar method, properti private, annotations/attributes, tipe parameter).

Fitur ini menjadi fondasi utama *Dependency Injection Container* di framework modern seperti Laravel dan Symfony.

## Contoh

```php
<?php

class PenggunaService
{
    private string $apiKey = "SECRET_123";

    public function proses(int $id, string $action): bool
    {
        return true;
    }
}

$reflector = new ReflectionClass(PenggunaService::class);

echo "Nama Class: " . $reflector->getName() . PHP_EOL;

foreach ($reflector->getMethods() as $method) {
    echo "- Method: " . $method->getName() . " (Jumlah Parameter: " . $method->getNumberOfParameters() . ")" . PHP_EOL;
}
```

## Output

```text
Nama Class: PenggunaService
- Method: proses (Jumlah Parameter: 2)
```

**Hafalan:**

```text
$reflector = new ReflectionClass(ClassName::class);  → Menginspeksi metadata class
$reflector->getMethods();                            → Mengambil daftar seluruh method
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Gunakan Reflection untuk pembuatan framework/library, dynamic container, atau auto-wiring.
- ❌ **Kesalahan Umum:** Menggunakan reflection untuk logika bisnis sehari-hari (reflection memiliki *overhead* performa lebih lambat).

---

<a id="bagian-37"></a>

# 37. 🔴 DateTime & `DateTimeImmutable` (OOP Date Handling)

## Konsep

PHP menyediakan class OOP resmi untuk mengelola tanggal dan zona waktu:
- **`DateTime`:** Objek tanggal yang bersifat *mutable* (perubahan tanggal memodifikasi objek itu sendiri).
- **`DateTimeImmutable` (SANGAT DIREKOMENDASIKAN):** Objek tanggal yang bersifat *immutable* (setiap modifikasi menghasilkan objek baru sehingga aman dari *side-effect*).

## Contoh

```php
<?php

// Menggunakan DateTimeImmutable
$sekarang = new DateTimeImmutable("2026-08-25 10:00:00", new DateTimeZone("Asia/Jakarta"));

// Menambah 7 hari menghasilkan instance baru
$tujuhHariLagi = $sekarang->modify("+7 days");

echo "Waktu Dibuat : " . $sekarang->format("d F Y H:i") . PHP_EOL;
echo "Jatuh Tempo  : " . $tujuhHariLagi->format("d F Y H:i");
```

## Output

```text
Waktu Dibuat : 25 August 2026 10:00
Jatuh Tempo  : 01 September 2026 10:00
```

**Hafalan:**

```text
$date = new DateTimeImmutable('now', new DateTimeZone('Asia/Jakarta'));
$date->format('Y-m-d H:i:s');  → Format tanggal menjadi string
$date->modify('+1 day');       → Tambah waktu (menghasilkan objek baru)
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Selalu gunakan `DateTimeImmutable` sebagai tipe standar manipulasi tanggal.
- ❌ **Kesalahan Umum:** Menggunakan fungsi prosedural lawas `date()` dan `strtotime()` yang rentan bug zona waktu pada aplikasi enterprise.

---

<a id="bagian-38"></a>

# 38. 🔴 Exception Handling (try, catch, finally, Custom Exception)

## Konsep

**Exception** adalah objek yang merepresentasikan kondisi error atau kegagalan yang tidak terduga saat program berjalan. OOP menggunakan blok **`try-catch-finally`** dan instruksi **`throw`** untuk menangani error secara elegan tanpa membuat aplikasi *crash*.

Kita dapat membuat **Custom Exception** dengan cara meng-extends class bawaan `Exception`.

## Contoh

```php
<?php

// Membuat Custom Exception Class
class SaldoTidakCukupException extends Exception {}

class DompetDigital
{
    public function __construct(private int $saldo) {}

    public function bayar(int $jumlah): void
    {
        if ($jumlah > $this->saldo) {
            throw new SaldoTidakCukupException("Gagal: Saldo Rp {$this->saldo} tidak cukup untuk bayar Rp $jumlah.");
        }
        $this->saldo -= $jumlah;
        echo "Pembayaran Rp $jumlah berhasil!" . PHP_EOL;
    }
}

$dompet = new DompetDigital(50000);

try {
    $dompet->bayar(100000); // Memicu Exception
} catch (SaldoTidakCukupException $e) {
    echo "Tertangkap Exception: " . $e->getMessage() . PHP_EOL;
} finally {
    echo "Blok finally: Selesai memproses transaksi." . PHP_EOL;
}
```

## Output

```text
Tertangkap Exception: Gagal: Saldo Rp 50000 tidak cukup untuk bayar Rp 100000.
Blok finally: Selesai memproses transaksi.
```

## Alur Eksekusi Try-Catch-Finally

```text
       Blok try { $dompet->bayar(100000); }
                 │
                 ▼
       Cek: Apakah nominal > saldo?
                 │
        ┌────────┴────────┐
        │                 │
    [ Ya ]           [ Tidak ]
        │                 │
        ▼                 ▼
  throw Exception    Lanjut Selesai
        │
        ▼
  Masuk ke Blok catch (SaldoTidakCukupException $e)
        │
        ▼
  Blok finally (Pasti dijalankan apapun yang terjadi)
```

**Hafalan:**

```text
throw new Exception('message');            → Melempar objek exception
try { ... } catch (Exception $e) { ... }  → Menangkap dan menangani exception
finally { ... }                            → Blok yang selalu dieksekusi apapun yang terjadi
```

## Best Practice & Kesalahan Umum

- ✅ **Best Practice:** Buat class custom exception yang deskriptif (`UserNotFoundException`, `PaymentFailedException`) untuk menangkap error secara spesifik.
- ❌ **Kesalahan Umum:** Menangkap generic `catch (Throwable $e)` dan mengabaikannya tanpa mencatat log error (*silent failure*).

---

<a id="bagian-39"></a>

# 39. 🔴 Regular Expression OOP (Pola PCRE2 dalam Objek)

## Konsep

Dalam arsitektur OOP modern, operasi Regular Expression (Regex) dibungkus ke dalam class Value Object atau Service Validator agar pola regex terenkapsulasi rapi dan dapat digunakan ulang tanpa menuliskan `preg_match` mentah di mana-mana.

## Contoh

```php
<?php

class ValidatorUsername
{
    // Pola: huruf kecil, angka, garis bawah, panjang 3-16 karakter
    private const PATTERN = '/^[a-z0-9_]{3,16}$/';

    public static function isValid(string $username): bool
    {
        return (bool) preg_match(self::PATTERN, $username);
    }
}

$user1 = "budi_99";
$user2 = "User Spasi!";

echo "User 1 Valid? " . (ValidatorUsername::isValid($user1) ? "Ya" : "Tidak") . PHP_EOL;
echo "User 2 Valid? " . (ValidatorUsername::isValid($user2) ? "Ya" : "Tidak");
```

## Output

```text
User 1 Valid? Ya
User 2 Valid? Tidak
```

**Hafalan:**

```text
preg_match($pattern, $subject)   → Cek kecocokan pola regex (1 jika cocok, 0 jika tidak)
preg_replace($pattern, $rep, $s) → Ganti teks yang cocok dengan pola regex
```

---

<a id="bagian-40"></a>

# 40. 🛠️ Peta Ingatan Cepat

Mental model komprehensif hubungan seluruh konsep utama PHP OOP:

```text
       ┌───────────────────────────────────────────────────────────────┐
       │                     ARSITEKTUR PHP OOP                        │
       └───────────────────────────────┬───────────────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
   FONDASI OBJEK               REUSABILITAS & KONTRAK         PERILAKU & ADVANCED
 ┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
 │ Class & Object   │         │ Inheritance      │         │ Magic Methods    │
 │ Property & Method│         │ Abstract Class   │         │ Object Cloning   │
 │ Constructor      │         │ Interface        │         │ Generators       │
 │ Visibility       │         │ Polymorphism     │         │ Exceptions       │
 │ Encapsulation    │         │ Trait            │         │ Reflection       │
 └──────────────────┘         └──────────────────┘         └──────────────────┘
         │                             │                             │
         └─────────────────────────────┼─────────────────────────────┘
                                       │
                                       ▼
       ┌───────────────────────────────────────────────────────────────┐
       │                   SISTEM APLIKASI ROBUST                      │
       │        Loose Coupling  |  High Cohesion  |  Maintainable      │
       └───────────────────────────────────────────────────────────────┘
```

**Peta Ringkas Operasi:**

```text
Definisi Dasar   → Class, Object, Property, Method, $this, __construct
Keamanan Data    → Visibility (private/protected), Encapsulation, Getter/Setter
Hierarki & Desain→ extends, parent::, abstract, interface, implements, Polymorphism
Organisasi Kode  → namespace, use, trait, static, self::, final
Keandalan Sistem → Custom Exceptions (try-catch), DateTimeImmutable, Generators
```

---

<a id="bagian-41"></a>

# 41. 📚 Tabel Ringkasan

| Fitur / Konsep | Sintaks / Kata Kunci | Fungsi & Kegunaan Utama |
|---|---|---|
| **Instansiasi Objek** | `new ClassName()` | Membuat instance objek baru di memori RAM |
| **Constructor** | `public function __construct()` | Menginisialisasi data saat objek baru dibuat |
| **Akses Objek Aktif** | `$this->property` | Mengakses properti/method milik instance aktif |
| **Akses Class Sendiri**| `self::$property` | Mengakses static member milik class tempat kode ditulis |
| **Akses Parent** | `parent::methodName()` | Memanggil method/constructor milik class induk |
| **Pewarisan Class** | `class Child extends Parent` | Mewarisi member public & protected class induk |
| **Kontrak Interface** | `interface` & `implements` | Menetapkan kontrak method wajib tanpa implementasi |
| **Class Abstraksi** | `abstract class` | Kerangka dasar yang tidak bisa di-instansiasi langsung |
| **Horizontal Reuse** | `trait` & `use TraitName` | Berbagi method antar class tanpa batasan inheritance |
| **Kunci Immutability** | `readonly` | Properti hanya bisa diisi 1x di constructor |
| **Kunci Anti-Override**| `final` | Mencegah class di-extends atau method di-override |
| **Duplikasi Objek** | `clone $object` | Membuat salinan instance objek terpisah di memori |
| **Pengecekan Tipe** | `$obj instanceof Type` | Memeriksa apakah objek turunan dari class/interface |
| **Penanganan Error** | `try { ... } catch ($e)` | Menangkap dan menangani exception secara aman |
| **Hemat Memori** | `yield $data;` | Menghasilkan streaming data on-demand (Generator) |

---

<a id="bagian-42"></a>

# 42. ⚡ Cheat Code PHP OOP 10 Detik

```php
<?php

// 1. Interface & Kontrak
interface DapatDibayar {
    public function bayar(int $jumlah): void;
}

// 2. Trait Reusable
trait NotifikasiTrait {
    public function kirimSms(string $no, string $pesan): void {
        echo "SMS ke $no: $pesan\n";
    }
}

// 3. Class dengan Constructor Promotion, Enkapsulasi & Implements
class KartuKredit implements DapatDibayar {
    use NotifikasiTrait;

    public function __construct(
        public readonly string $nomorKartu,
        private int $limit
    ) {}

    public function bayar(int $jumlah): void {
        if ($jumlah > $this->limit) {
            throw new Exception("Limit tidak mencukupi!");
        }
        $this->limit -= $jumlah;
        $this->kirimSms("08123456", "Pembayaran Rp $jumlah sukses.");
    }
}

// 4. Polymorphic Call & Exception Handling
try {
    $metode = new KartuKredit("4111-2222", 5000000);
    $metode->bayar(1500000);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
```

---

<a id="bagian-43"></a>

# 43. 🧭 Urutan Belajar yang Disarankan

```text
       ┌────────────────────────────────────────────────────────────┐
       │             TAHAP 1: FONDASI KELAS & OBJEK                 │
       │  Class ──> Object (new) ──> Property ──> Method ──> $this  │
       └─────────────────────────────┬──────────────────────────────┘
                                     │
                                     ▼
       ┌────────────────────────────────────────────────────────────┐
       │             TAHAP 2: INISIALISASI & ENKAPSULASI            │
       │  __construct ──> Visibility (private) ──> Getter & Setter  │
       └─────────────────────────────┬──────────────────────────────┘
                                     │
                                     ▼
       ┌────────────────────────────────────────────────────────────┐
       │             TAHAP 3: HIERARKI & DESAIN POLIMORFISME        │
       │  extends ──> Override ──> parent:: ──> Abstract ──> Intf   │
       │  ──────────────────────> Polymorphism                      │
       └─────────────────────────────┬──────────────────────────────┘
                                     │
                                     ▼
       ┌────────────────────────────────────────────────────────────┐
       │             TAHAP 4: FITUR & PERILAKU LANJUTAN             │
       │  Namespace ──> use ──> static / self ──> Trait ──> clone   │
       └─────────────────────────────┬──────────────────────────────┘
                                     │
                                     ▼
       ┌────────────────────────────────────────────────────────────┐
       │             TAHAP 5: OPERASIONAL, EXCEPTION & PROJECT      │
       │  Custom Exceptions ──> DateTimeImmutable ──> Mini Project  │
       └────────────────────────────────────────────────────────────┘
```

---

<a id="bagian-44"></a>

# 44. 🏗️ Mini Project: Sistem Manajemen E-Commerce & Pembayaran OOP

Mini project ini mengintegrasikan seluruh konsep fundamental hingga lanjutan PHP OOP: **Constructor Property Promotion**, **Readonly Properties**, **Interface & Polymorphism**, **Traits**, **Custom Exceptions**, **Encapsulation**, dan **Type Declarations**.

### Kode Program (`ecommerce.php`)

```php
<?php

declare(strict_types=1);

namespace App\Ecommerce;

use Exception;
use DateTimeImmutable;

// 1. Custom Exception
class PembayaranGagalException extends Exception {}

// 2. Trait untuk Logging Aksi
trait LoggerTrait
{
    public function log(string $pesan): void
    {
        $waktu = (new DateTimeImmutable())->format("Y-m-d H:i:s");
        echo "[$waktu LOG]: $pesan" . PHP_EOL;
    }
}

// 3. Entity Produk (Encapsulated & Readonly)
class Produk
{
    public function __construct(
        public readonly int $id,
        public readonly string $nama,
        private int $harga,
        private int $stok
    ) {}

    public function getHarga(): int { return $this->harga; }
    public function getStok(): int { return $this->stok; }

    public function kurangiStok(int $qty): void
    {
        if ($qty > $this->stok) {
            throw new Exception("Stok produk '{$this->nama}' tidak mencukupi!");
        }
        $this->stok -= $qty;
    }
}

// 4. Interface Pembayaran (Polymorphic Contract)
interface MetodePembayaranInterface
{
    public function proses(int $total): bool;
}

// 5. Implementasi Gateway Pembayaran A: Saldo Dompet
class SaldoDompet implements MetodePembayaranInterface
{
    use LoggerTrait;

    public function __construct(private int $saldo) {}

    public function proses(int $total): bool
    {
        if ($total > $this->saldo) {
            throw new PembayaranGagalException("Saldo dompet (Rp {$this->saldo}) tidak mencukupi tagihan Rp $total!");
        }
        $this->saldo -= $total;
        $this->log("Pembayaran Rp $total via Saldo Dompet sukses. Sisa saldo: Rp {$this->saldo}.");
        return true;
    }
}

// 6. Implementasi Gateway Pembayaran B: Kartu Kredit
class KartuKredit implements MetodePembayaranInterface
{
    use LoggerTrait;

    public function __construct(public readonly string $nomorKartu) {}

    public function proses(int $total): bool
    {
        $this->log("Otorisasi Bank untuk Kartu {$this->nomorKartu} senilai Rp $total disetujui.");
        return true;
    }
}

// 7. Class Transaksi Order (Orchestrator)
class Order
{
    use LoggerTrait;

    private array $items = [];

    public function __construct(public readonly string $orderId) {}

    public function tambahProduk(Produk $produk, int $qty): void
    {
        $produk->kurangiStok($qty);
        $this->items[] = [
            "produk" => $produk,
            "qty" => $qty,
            "subtotal" => $produk->getHarga() * $qty
        ];
    }

    public function hitungTotal(): int
    {
        return array_sum(array_column($this->items, "subtotal"));
    }

    public function checkout(MetodePembayaranInterface $metode): void
    {
        $total = $this->hitungTotal();
        echo "==================================================" . PHP_EOL;
        echo "MEMPROSES CHECKOUT: ORDER {$this->orderId}" . PHP_EOL;
        echo "Total Tagihan: Rp " . number_format($total, 0, ",", ".") . PHP_EOL;
        echo "--------------------------------------------------" . PHP_EOL;

        $metode->proses($total);
        $this->log("Order {$this->orderId} telah lunas dan siap dikirim!");
        echo "==================================================" . PHP_EOL;
    }
}

// ================= SIMULASI SISTEM =================

try {
    // 1. Buat Data Master Produk
    $laptop = new Produk(1, "Laptop Ultrabook", 12000000, 5);
    $mouse  = new Produk(2, "Mouse Wireless", 250000, 10);

    // 2. Buat Order Pembelian
    $order1 = new Order("ORD-2026-001");
    $order1->tambahProduk($laptop, 1);
    $order1->tambahProduk($mouse, 2);

    // 3. Bayar dengan Polymorphic Payment Method
    $dompetUser = new SaldoDompet(15000000);
    $order1->checkout($dompetUser);

} catch (PembayaranGagalException $e) {
    echo "GAGAL BAYAR: " . $e->getMessage() . PHP_EOL;
} catch (Exception $e) {
    echo "ERROR SISTEM: " . $e->getMessage() . PHP_EOL;
}
```

### Output Eksekusi Program

```text
==================================================
MEMPROSES CHECKOUT: ORDER ORD-2026-001
Total Tagihan: Rp 12.500.000
--------------------------------------------------
[2026-08-25 22:25:00 LOG]: Pembayaran Rp 12500000 via Saldo Dompet sukses. Sisa saldo: Rp 2500000.
[2026-08-25 22:25:00 LOG]: Order ORD-2026-001 telah lunas dan siap dikirim!
==================================================
```

---

<a id="bagian-45"></a>

# 45. 🔗 Referensi Resmi

- [PHP Manual — Classes and Objects (OOP5)](https://www.php.net/manual/en/language.oop5.php)

- [PHP Manual — Properties & Type Declarations](https://www.php.net/manual/en/language.oop5.properties.php)

- [PHP Manual — Constructors and Destructors](https://www.php.net/manual/en/language.oop5.decon.php)

- [PHP Manual — Visibility](https://www.php.net/manual/en/language.oop5.visibility.php)

- [PHP Manual — Class Inheritance](https://www.php.net/manual/en/language.oop5.inheritance.php)

- [PHP Manual — Object Interfaces](https://www.php.net/manual/en/language.oop5.interfaces.php)

- [PHP Manual — Traits](https://www.php.net/manual/en/language.oop5.traits.php)

- [PHP Manual — Magic Methods](https://www.php.net/manual/en/language.oop5.magic.php)

- [PHP Manual — Exceptions](https://www.php.net/manual/en/language.exceptions.php)

- [PHP-FIG PSR Standards (PSR-4 Autoloading & PSR-12 Coding Standard)](https://www.php-fig.org/psr/)
