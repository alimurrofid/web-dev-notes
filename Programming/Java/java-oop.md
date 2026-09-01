# Java OOP Cheatsheet Revised

> **Target:** Pemula yang sudah memahami dasar-dasar Java (tipe data, control flow, method) dan ingin menguasai konsep **Object-Oriented Programming (OOP)** modern dengan Java (Java 21 LTS).
>
> Fokus cheatsheet ini: **mental model objek & heap → class, field & constructor → encapsulation & access modifiers → inheritance & super → polymorphism & pattern matching instanceof → abstract class & interface → inner & anonymous class → static, final & sealed classes → records & enum → exception hierarchy & custom exception → mini project payment gateway**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami untuk membangun struktur class, instansiasi objek, dan enkapsulasi data yang aman

🟡 Lanjutan
→ pelajari setelah menguasai class dasar: pewarisan, polimorfisme, abstraksi, dan interface

🔴 Advanced / Operasional
→ penting untuk arsitektur aplikasi skala besar: sealed class, record, enum, exception hierarchy, dan memory lifecycle
```

Mental model alur instansiasi dan relasi objek di Java:

```text
        Source Code Class (.java)
                   │
                   ▼
         Kompilasi Bytecode (.class)
                   │
                   ▼
       ClassLoader memuat ke Metaspace
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
    Stack Memory        Heap Memory
 (Variabel Referensi) (Instance Objek Nyata)
         │                   │
         └─────────┬─────────┘
                   │
                   ▼
      Dynamic Method Dispatch & GC
```

**Hafalan:**

```text
Object       → entitas nyata di memori (heap) yang menggabungkan state (data) dan behavior (method)
Class        → cetak biru (blueprint) atau template untuk mencetak objek-objek sejenis
Instance     → istilah untuk wujud objek nyata yang dihasilkan dari suatu class via kata kunci new
Encapsulate  → menyembunyikan data internal dan membatasi akses melalui getter/setter
Inheritance  → mewariskan atribut dan perilaku dari parent class ke child class via keyword extends
Polymorphism → kemampuan objek mengambil banyak bentuk dan merespons method sesuai tipe nyatanya
Abstraction  → menyembunyikan detail implementasi dan hanya menampilkan fungsionalitas esensial
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan OOP & 4 Pilar Utama](#bagian-1)
2. [Class & Object (Mental Model Cetak Biru vs Instance Memori)](#bagian-2)
3. [Field / Attribute dalam Class](#bagian-3)
4. [Method dalam Class (Behavior & State Manipulation)](#bagian-4)
5. [Constructor (Inisialisasi Objek & Default Constructor)](#bagian-5)
6. [Constructor Overloading](#bagian-6)
7. [Kata Kunci this & Constructor Chaining](#bagian-7)
8. [Modifier Akses (Access Modifiers)](#bagian-8)
9. [Enkapsulasi, Getter & Setter](#bagian-9)
10. [Package & Import](#bagian-10)

### 🟡 Lanjutan

11. [Inheritance / Pewarisan (extends)](#bagian-11)
12. [Kata Kunci super (Constructor & Method Delegation)](#bagian-12)
13. [Method Overriding (@Override)](#bagian-13)
14. [Polymorphism (Polimorfisme & Dynamic Dispatch)](#bagian-14)
15. [Type Casting Objek & Pattern Matching instanceof](#bagian-15)
16. [Abstract Class & Abstract Method](#bagian-16)
17. [Interface Dasar & Multiple Implementation](#bagian-17)
18. [Interface Inheritance (extends)](#bagian-18)
19. [Default Method & Static Method pada Interface](#bagian-19)
20. [Private Method pada Interface](#bagian-20)
21. [Anonymous Class](#bagian-21)
22. [Inner Class & Static Nested Class](#bagian-22)

### 🔴 Advanced / Operasional

23. [Static Keyword Lengkap (Field, Method, Block)](#bagian-23)
24. [Final Keyword Lengkap (Variable, Method, Class)](#bagian-24)
25. [Sealed Classes & Interfaces (Java 17+)](#bagian-25)
26. [Record Lanjutan & Implementasi Interface](#bagian-26)
27. [Enum Class Lengkap (Fields, Constructor, Method)](#bagian-27)
28. [Object Root Class (toString, equals, hashCode)](#bagian-28)
29. [Hierarchy Exception di Java (Checked vs Unchecked)](#bagian-29)
30. [Custom Exception Class](#bagian-30)
31. [Garbage Collection & Manajemen Memori OOP](#bagian-31)

### 🛠️ Referensi & Praktik

32. [Peta Ingatan Cepat](#bagian-32)
33. [Tabel Ringkasan](#bagian-33)
34. [Cheat Code Java OOP 10 Detik](#bagian-34)
35. [Urutan Belajar yang Disarankan](#bagian-35)
36. [Mini Project: Sistem Payment Gateway & Transaksi E-Commerce CLI](#bagian-36)
37. [Referensi Resmi](#bagian-37)

---

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan OOP & 4 Pilar Utama

## Konsep

**Object-Oriented Programming (OOP)** adalah paradigma pemrograman yang mengorganisir kode ke dalam unit-unit mandiri yang disebut **Object**. Objek menggabungkan data (**State / Field**) dan fungsi operasi (**Behavior / Method**).

Empat pilar utama yang menopang arsitektur OOP:
1. **Encapsulation (Enkapsulasi):** Membungkus data dan membatasi akses langsung dari luar untuk menjaga integritas status objek.
2. **Inheritance (Pewarisan):** Membentuk hierarki class di mana class turunan (*child class*) mewarisi atribut dan perilaku dari class induk (*parent class*).
3. **Polymorphism (Polimorfisme):** Kemampuan satu antarmuka atau parent class untuk mengekspresikan perilaku yang berbeda-beda tergantung objek konkret yang mengeksekusinya.
4. **Abstraction (Abstraksi):** Menyembunyikan kompleksitas detail implementasi dan hanya mengekspos fungsi yang esensial bagi pengguna/pemanggil.

## Contoh

```java
// Blueprint Class sederhana dengan Encapsulation & Method
class BankAccount {
    private String accountNumber;
    private double balance;

    public BankAccount(String accountNumber, double initialDeposit) {
        this.accountNumber = accountNumber;
        this.balance = initialDeposit;
    }

    public void deposit(double amount) {
        if (amount > 0) {
            this.balance += amount;
            System.out.printf("Berhasil setor Rp %,.2f. Saldo sekarang: Rp %,.2f%n", amount, this.balance);
        }
    }

    public double getBalance() {
        return this.balance;
    }
}

public class Main {
    public static void main(String[] args) {
        BankAccount account = new BankAccount("ACC-001", 500_000);
        account.deposit(250_000);
        System.out.printf("Saldo Akhir: Rp %,.2f%n", account.getBalance());
    }
}
```

## Output

```text
Berhasil setor Rp 250,000.00. Saldo sekarang: Rp 750,000.00
Saldo Akhir: Rp 750,000.00
```

## Cara Kerja

```text
                    4 PILAR UTAMA JAVA OOP
                               │
       ┌───────────────┬───────┴───────┬───────────────┐
       ▼               ▼               ▼               ▼
 ENCAPSULATION    INHERITANCE    POLYMORPHISM     ABSTRACTION
 (Data Hiding)   (Reusability)   (Banyak Bentuk) (Kontrak Murni)
 private fields   extends Class   Overriding      interface
 Getter/Setter    super()         Dynamic Call    abstract class
```

**Hafalan:**

```text
Encapsulation → melindungi integritas data internal dengan access modifier private dan accessor method
Inheritance   → mekanisme penurunan sifat parent class ke child class untuk efisiensi reuse kode
Polymorphism  → kemampuan satu tipe referensi merujuk ke berbagai implementasi objek konkret
Abstraction   → penyederhanaan sistem dengan mendefinisikan antarmuka/kontrak tanpa detail implementasi
```

---

<a id="bagian-2"></a>

# 2. 🟢 Class & Object (Mental Model Cetak Biru vs Instance Memori)

## Konsep

- **Class:** Cetak biru (*blueprint*), rancangan struktural, atau sketsa konseptual. Class belum memakan memori runtime untuk instance data.
- **Object:** Instance nyata yang diciptakan dari class menggunakan kata kunci `new`. Objek dialokasikan di area memori **Heap**, sedangkan variabel penampungnya berada di **Stack**.

## Contoh

```java
// Mendefinisikan Class Mobil
class Mobil {
    String merk;
    String warna;
    int tahunProduksi;
}

public class ClassObjectDemo {
    public static void main(String[] args) {
        // Membuat Instance Objek 1
        Mobil mobilA = new Mobil();
        mobilA.merk = "Toyota";
        mobilA.warna = "Hitam";
        mobilA.tahunProduksi = 2022;

        // Membuat Instance Objek 2
        Mobil mobilB = new Mobil();
        mobilB.merk = "Honda";
        mobilB.warna = "Putih";
        mobilB.tahunProduksi = 2024;

        System.out.printf("Mobil A: %s (%s, %d)%n", mobilA.merk, mobilA.warna, mobilA.tahunProduksi);
        System.out.printf("Mobil B: %s (%s, %d)%n", mobilB.merk, mobilB.warna, mobilB.tahunProduksi);
    }
}
```

## Output

```text
Mobil A: Toyota (Hitam, 2022)
Mobil B: Honda (Putih, 2024)
```

## Cara Kerja

```text
Stack Memory                            Heap Memory (Instance Nyata)
┌──────────────┐                       ┌─────────────────────────────────┐
│ mobilA (0x1) ├──────────────────────>│ Objek Mobil @0x1:               │
├──────────────┤                       │ merk = "Toyota", warna = "Hitam"│
│ mobilB (0x2) ├──────────┐            └─────────────────────────────────┘
└──────────────┘          │            ┌─────────────────────────────────┐
                          └───────────>│ Objek Mobil @0x2:               │
                                       │ merk = "Honda", warna = "Putih" │
                                       └─────────────────────────────────┘
```

**Hafalan:**

```text
ClassName objectName = new ClassName(); → membuat instance objek baru di memory heap dari cetak biru class
```

---

<a id="bagian-3"></a>

# 3. 🟢 Field / Attribute dalam Class

## Konsep

**Field** (juga disebut atribut atau *property*) adalah variabel yang dideklarasikan di dalam tubuh class untuk menyimpan data/state dari setiap objek.

Field di Java secara otomatis memiliki **nilai default bawaan** jika tidak diinisialisasi secara eksplisit:
- `int`, `byte`, `short`, `long` $\rightarrow$ `0`
- `float`, `double` $\rightarrow$ `0.0`
- `boolean` $\rightarrow$ `false`
- `char` $\rightarrow$ `'\u0000'` (null char)
- Tipe Reference (`String`, Objek) $\rightarrow$ `null`

## Contoh

```java
class Mahasiswa {
    // Field dengan nilai default otomatis
    String nim;
    String nama;
    double ipk;
    boolean isActive;

    // Field dengan nilai inisialisasi awal
    String universitas = "Institut Teknologi Indonesia";
}

public class FieldDemo {
    public static void main(String[] args) {
        Mahasiswa mhs = new Mahasiswa();

        System.out.println("NIM (default): " + mhs.nim);             // null
        System.out.println("IPK (default): " + mhs.ipk);             // 0.0
        System.out.println("Status Aktif : " + mhs.isActive);        // false
        System.out.println("Universitas  : " + mhs.universitas);     // Institut Teknologi Indonesia

        // Mengisi field
        mhs.nim = "10123001";
        mhs.nama = "Ahmad Pratama";
        mhs.ipk = 3.92;
        mhs.isActive = true;

        System.out.printf("Mahasiswa: %s - %s (IPK: %.2f)%n", mhs.nim, mhs.nama, mhs.ipk);
    }
}
```

## Output

```text
NIM (default): null
IPK (default): 0.0
Status Aktif : false
Universitas  : Institut Teknologi Indonesia
Mahasiswa: 10123001 - Ahmad Pratama (IPK: 3.92)
```

## Cara Kerja

```text
Deklarasi: Mahasiswa mhs = new Mahasiswa();
                     │
                     ▼
Alokasi Block Memori Heap untuk Field:
[ nim: null | nama: null | ipk: 0.0 | isActive: false | universitas: "..." ]
```

**Hafalan:**

```text
object.field = value; → menugaskan nilai value ke dalam field dari objek target
```

---

<a id="bagian-4"></a>

# 4. 🟢 Method dalam Class (Behavior & State Manipulation)

## Konsep

Method dalam class merepresentasikan tindakan, aksi, atau perilaku (*behavior*) yang dapat dilakukan oleh objek tersebut. Method dapat membaca dan mengubah nilai field yang dimiliki objek.

Berbeda dengan method `static` yang menempel pada class, method non-static (instance method) bekerja langsung pada konteks data instance objek tempat method tersebut dipanggil.

## Contoh

```java
class DompetDigital {
    String pemilik;
    double saldo;

    void isiSaldo(double nominal) {
        if (nominal > 0) {
            saldo += nominal;
            System.out.printf("Top up Rp %,.2f berhasil.%n", nominal);
        }
    }

    boolean bayar(double nominal) {
        if (nominal <= saldo) {
            saldo -= nominal;
            System.out.printf("Pembayaran Rp %,.2f sukses.%n", nominal);
            return true;
        } else {
            System.out.printf("Pembayaran Rp %,.2f gagal! Saldo tidak cukup.%n", nominal);
            return false;
        }
    }

    void cetakInfo() {
        System.out.printf("Dompet: %s | Saldo: Rp %,.2f%n", pemilik, saldo);
    }
}

public class MethodDemo {
    public static void main(String[] args) {
        DompetDigital dompet = new DompetDigital();
        dompet.pemilik = "Rina";
        dompet.saldo = 50_000;

        dompet.cetakInfo();
        dompet.isiSaldo(100_000);
        dompet.bayar(120_000);
        dompet.bayar(50_000); // Gagal
        dompet.cetakInfo();
    }
}
```

## Output

```text
Dompet: Rina | Saldo: Rp 50,000.00
Top up Rp 100,000.00 berhasil.
Pembayaran Rp 120,000.00 sukses.
Pembayaran Rp 50,000.00 gagal! Saldo tidak cukup.
Dompet: Rina | Saldo: Rp 30,000.00
```

## Cara Kerja

```text
dompet.bayar(120_000)
       │
       ▼
Periksa: nominal (120k) <= this.saldo (150k)?
       │
     [true] ──> this.saldo = 150k - 120k = 30k ──> return true
```

**Hafalan:**

```text
object.methodName(arguments) → mengeksekusi perilaku method pada konteks data instance object
```

---

<a id="bagian-5"></a>

# 5. 🟢 Constructor (Inisialisasi Objek & Default Constructor)

## Konsep

**Constructor** adalah method khusus yang **dieksekusi secara otomatis satu kali** saat pembuatan instance objek baru (`new`).

Aturan baku constructor:
1. Nama constructor **wajib sama persis** dengan nama class-nya.
2. Constructor **tidak memiliki return type** (bahkan tidak boleh diberi kata kunci `void`).
3. Jika kita tidak menulis constructor sama sekali, compiler Java otomatis menyisipkan **Default No-Argument Constructor** kosong. Namun jika kita menulis minimal satu constructor kustom, default constructor tidak dibuatkan lagi.

## Contoh

```java
class Pengguna {
    String username;
    String role;
    int poin;

    // Custom Parameterized Constructor
    Pengguna(String paramUsername, String paramRole) {
        System.out.println("Constructor Pengguna dipanggil!");
        username = paramUsername;
        role = paramRole;
        poin = 100; // Poin awal pendaftaran
    }
}

public class ConstructorDemo {
    public static void main(String[] args) {
        // Objek langsung terinisialisasi dengan data lengkap
        Pengguna user1 = new Pengguna("budi_dev", "DEVELOPER");

        System.out.printf("User: %s | Role: %s | Poin: %d%n", user1.username, user1.role, user1.poin);
    }
}
```

## Output

```text
Constructor Pengguna dipanggil!
User: budi_dev | Role: DEVELOPER | Poin: 100
```

## Cara Kerja

```text
            Pernyataan: new Pengguna("budi_dev", "DEVELOPER")
                                   │
                                   ▼
                   1. Alokasi Memori Objek di Heap
                                   │
                                   ▼
                   2. Eksekusi Tubuh Constructor Pengguna(...)
                                   │
                                   ▼
                   3. Kembalikan Alamat Referensi Memori
```

**Hafalan:**

```text
ClassName(parameters) { ... } → constructor khusus untuk menginisialisasi nilai awal state saat new dipanggil
```

## Kesalahan Umum

❌ Menambahkan tipe `void` pada constructor: `void Pengguna() { ... }` (ini akan dianggap sebagai method biasa, bukan constructor!).

✅ Tulis nama class langsung tanpa return type: `Pengguna() { ... }`.

---

<a id="bagian-6"></a>

# 6. 🟢 Constructor Overloading

## Konsep

Sama seperti method biasa, sebuah class dapat memiliki **lebih dari satu constructor** dengan syarat daftar parameternya berbeda (berbeda jumlah parameter atau berbeda tipe datanya).

Ini memberikan fleksibilitas bagi pemanggil untuk menginstansiasi objek dengan berbagai skenario data awal yang tersedia.

## Contoh

```java
class Produk {
    String kode;
    String nama;
    double harga;
    int stok;

    // Constructor 1: Lengkap semua field
    Produk(String kode, String nama, double harga, int stok) {
        this.kode = kode;
        this.nama = nama;
        this.harga = harga;
        this.stok = stok;
    }

    // Constructor 2: Stok default 0
    Produk(String kode, String nama, double harga) {
        this.kode = kode;
        this.nama = nama;
        this.harga = harga;
        this.stok = 0;
    }

    // Constructor 3: No-argument constructor
    Produk() {
        this.kode = "N/A";
        this.nama = "Produk Belum Bernama";
        this.harga = 0.0;
        this.stok = 0;
    }
}

public class ConstructorOverloadingDemo {
    public static void main(String[] args) {
        Produk p1 = new Produk("PRD-01", "Keyboard Mekanikal", 450_000, 15);
        Produk p2 = new Produk("PRD-02", "Mouse Wireless", 150_000);
        Produk p3 = new Produk();

        System.out.printf("P1: %s - %s (Rp %,.2f, Stok: %d)%n", p1.kode, p1.nama, p1.harga, p1.stok);
        System.out.printf("P2: %s - %s (Rp %,.2f, Stok: %d)%n", p2.kode, p2.nama, p2.harga, p2.stok);
        System.out.printf("P3: %s - %s (Rp %,.2f, Stok: %d)%n", p3.kode, p3.nama, p3.harga, p3.stok);
    }
}
```

## Output

```text
P1: PRD-01 - Keyboard Mekanikal (Rp 450,000.00, Stok: 15)
P2: PRD-02 - Mouse Wireless (Rp 150,000.00, Stok: 0)
P3: N/A - Produk Belum Bernama (Rp 0.00, Stok: 0)
```

## Cara Kerja

```text
new Produk("PRD-02", "Mouse", 150000) ──> Memanggil Constructor 2 (3 Parameter)
new Produk()                          ──> Memanggil Constructor 3 (0 Parameter)
```

**Hafalan:**

```text
Constructor Overloading → menyediakan variasi constructor dengan parameter berbeda untuk inisialisasi fleksibel
```

---

<a id="bagian-7"></a>

# 7. 🟢 Kata Kunci this & Constructor Chaining

## Konsep

Kata kunci `this` merujuk ke **instance objek saat ini**.

Dua kegunaan vital kata kunci `this`:
1. **Mengatasi Variable Shadowing:** Membedakan antara parameter method/constructor dengan field class saat memiliki nama yang identik (`this.name = name;`).
2. **Constructor Chaining (`this(...)`):** Memanggil constructor lain di dalam class yang sama untuk menghindari duplikasi kode inisialisasi. Pemanggilan `this(...)` **wajib berada pada baris pertama** di dalam constructor.

## Contoh

```java
class Pegawai {
    String id;
    String nama;
    String divisi;
    double gajiPokok;

    // Constructor Utama (Paling Lengkap)
    Pegawai(String id, String nama, String divisi, double gajiPokok) {
        this.id = id;
        this.nama = nama;
        this.divisi = divisi;
        this.gajiPokok = gajiPokok;
    }

    // Constructor Pendukung 1 (Constructor Chaining)
    Pegawai(String id, String nama, String divisi) {
        this(id, nama, divisi, 5_000_000.0); // Memanggil constructor utama dengan gaji default
    }

    // Constructor Pendukung 2 (Constructor Chaining)
    Pegawai(String id, String nama) {
        this(id, nama, "UMUM"); // Memanggil Constructor Pendukung 1
    }

    void cetakInfo() {
        System.out.printf("[%s] %s - Divisi: %s (Gaji: Rp %,.2f)%n", this.id, this.nama, this.divisi, this.gajiPokok);
    }
}

public class ThisKeywordDemo {
    public static void main(String[] args) {
        Pegawai emp1 = new Pegawai("EMP-01", "Budi", "ENGINEERING", 12_000_000);
        Pegawai emp2 = new Pegawai("EMP-02", "Siti", "MARKETING");
        Pegawai emp3 = new Pegawai("EMP-03", "Doni");

        emp1.cetakInfo();
        emp2.cetakInfo();
        emp3.cetakInfo();
    }
}
```

## Output

```text
[EMP-01] Budi - Divisi: ENGINEERING (Gaji: Rp 12,000,000.00)
[EMP-02] Siti - Divisi: MARKETING (Gaji: Rp 5,000,000.00)
[EMP-03] Doni - Divisi: UMUM (Gaji: Rp 5,000,000.00)
```

## Cara Kerja

```text
new Pegawai("EMP-03", "Doni")
       │
       ▼
this("EMP-03", "Doni", "UMUM")
       │
       ▼
this("EMP-03", "Doni", "UMUM", 5000000.0) ──> Eksekusi Inisialisasi Field Sebenarnya
```

**Hafalan:**

```text
this.fieldName         → merujuk eksplisit ke field milik objek saat ini (mengatasi shadowing)
this(arguments)        → memanggil constructor lain di class yang sama (harus di baris pertama)
```

---

<a id="bagian-8"></a>

# 8. 🟢 Modifier Akses (Access Modifiers)

## Konsep

Access Modifier menentukan tingkat visibilitas dan batasan akses terhadap class, field, constructor, dan method.

Terdapat 4 tingkat modifier di Java:
1. `public`: Dapat diakses dari class mana saja, baik dalam package yang sama maupun package luar.
2. `protected`: Dapat diakses dalam **package yang sama** dan oleh **subclass (class turunan)** meskipun berbeda package.
3. *Default / Package-Private* (tanpa modifier): Hanya dapat diakses oleh class-class di dalam **package yang sama**.
4. `private`: Hanya dapat diakses oleh kode di dalam **class yang sama persis**.

## Contoh

```java
package com.toko.data;

public class HakAksesDemo {
    public String publicField = "Bisa diakses siapa saja";
    protected String protectedField = "Bisa diakses package sama & child class";
    String defaultField = "Hanya package com.toko.data";
    private String privateField = "Hanya di dalam HakAksesDemo";

    public void tampilkanSemua() {
        // Semua field dapat diakses di dalam class ini
        System.out.println(publicField);
        System.out.println(protectedField);
        System.out.println(defaultField);
        System.out.println(privateField);
    }
}
```

## Cara Kerja

```text
┌──────────────┬───────────────┬─────────────────┬──────────┬─────────────┐
│ Modifier     │ Class Sendiri │ Package Sendiri │ Subclass │ Luar Package│
├──────────────┼───────────────┼─────────────────┼──────────┼─────────────┤
│ public       │      YA       │       YA        │    YA    │     YA      │
│ protected    │      YA       │       YA        │    YA    │    TIDAK    │
│ default      │      YA       │       YA        │  TIDAK   │    TIDAK    │
│ private      │      YA       │      TIDAK      │  TIDAK   │    TIDAK    │
└──────────────┴───────────────┴─────────────────┴──────────┴─────────────┘
```

**Hafalan:**

```text
public    → akses terbuka bebas dari package mana pun
protected → akses terbatas untuk package yang sama dan subclass turunan
default   → akses tertutup khusus untuk package yang sama (package-private)
private   → akses terisolasi ketat hanya untuk internal class tempatnya dibuat
```

## Best Practice

- Jadikan seluruh field berstatus `private` demi mematuhi prinsip enkapsulasi data.
- Buka akses secara terkontrol menggunakan method `public` getter dan setter.

---

<a id="bagian-9"></a>

# 9. 🟢 Enkapsulasi, Getter & Setter

## Konsep

**Encapsulation** adalah proses membungkus data (*field*) dan melindungi modifikasi sembarangan dari luar dengan menjadikannya `private`, kemudian menyediakan method publik:
- **Getter (`getFieldName()`):** Method untuk membaca nilai data.
- **Setter (`setFieldName(newValue)`):** Method untuk mengubah nilai data dengan menyertakan aturan validasi logika.

Dengan enkapsulasi, objek memiliki kendali penuh atas integritas state dirinya sendiri (*Data Integrity & Hiding*).

## Contoh

```java
class RekeningBank {
    private String nomorRekening;
    private double saldo;

    public RekeningBank(String nomorRekening, double saldoAwal) {
        this.nomorRekening = nomorRekening;
        setSaldo(saldoAwal); // Menggunakan setter ber-validasi
    }

    // Getter untuk nomorRekening (Read-Only)
    public String getNomorRekening() {
        return this.nomorRekening;
    }

    // Getter untuk saldo
    public double getSaldo() {
        return this.saldo;
    }

    // Setter untuk saldo dengan validasi ketat
    public void setSaldo(double saldo) {
        if (saldo >= 0) {
            this.saldo = saldo;
        } else {
            System.out.println("❌ Validasi Gagal: Saldo tidak boleh negatif!");
        }
    }
}

public class EncapsulationDemo {
    public static void main(String[] args) {
        RekeningBank rek = new RekeningBank("11223344", 1_000_000);

        // rek.saldo = -500; // ERROR: saldo has private access

        rek.setSaldo(1_500_000); // Sukses
        rek.setSaldo(-200_000);  // Ditolak oleh validasi setter

        System.out.printf("Nomor Rek: %s | Saldo: Rp %,.2f%n", rek.getNomorRekening(), rek.getSaldo());
    }
}
```

## Output

```text
❌ Validasi Gagal: Saldo tidak boleh negatif!
Nomor Rek: 11223344 | Saldo: Rp 1,500,000.00
```

## Cara Kerja

```text
Akses Eksternal ──> rek.setSaldo(1500000) ──> [Validasi >= 0] ──[OK]──> this.saldo = 1500000
Akses Eksternal ──> rek.setSaldo(-50000)  ──> [Validasi >= 0] ──[Fail]─> Tolak Perubahan
```

**Hafalan:**

```text
public fieldType getFieldName() { return this.fieldName; }         → accessor method untuk membaca nilai
public void setFieldName(fieldType value) { this.fieldName = value; } → mutator method untuk mengubah nilai dengan validasi
```

---

<a id="bagian-10"></a>

# 10. 🟢 Package & Import

## Konsep

**Package** adalah mekanisme pengelompokan class, interface, dan enum ke dalam namespace dan struktur folder direktori fisik.

- `package com.perusahaan.modul;` dideklarasikan di **baris paling pertama** file `.java`.
- `import` digunakan untuk menggunakan class dari package lain.
- Package `java.lang` (berisi `String`, `Math`, `System`, `Integer`) di-import secara otomatis oleh compiler.

## Contoh

Struktur folder:
```text
src/
└── com/
    └── ecommerce/
        ├── model/
        │   └── Customer.java
        └── app/
            └── App.java
```

File `Customer.java`:
```java
package com.ecommerce.model;

public class Customer {
    private String name;

    public Customer(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }
}
```

File `App.java`:
```java
package com.ecommerce.app;

// Import class spesifik dari package model
import com.ecommerce.model.Customer;
// Static import method Math
import static java.lang.Math.max;

public class App {
    public static void main(String[] args) {
        Customer customer = new Customer("Siti Nurhaliza");
        System.out.println("Customer: " + customer.getName());
        System.out.println("Nilai Terbesar: " + max(10, 20));
    }
}
```

## Output

```text
Customer: Siti Nurhaliza
Nilai Terbesar: 20
```

## Cara Kerja

```text
javac menyusun folder:
com/ecommerce/model/Customer.class
com/ecommerce/app/App.class
```

**Hafalan:**

```text
package namespacePath;       → mendefinisikan lokasi package class di baris pertama
import packagePath.ClassName; → mengimpor class spesifik dari package lain
import packagePath.*;        → mengimpor seluruh class publik dalam package target (wildcard)
import static package.Method;→ mengimpor method static sehingga bisa dipanggil langsung tanpa nama class
```

---

<a id="bagian-11"></a>

# 11. 🟡 Inheritance / Pewarisan (extends)

## Konsep

**Inheritance** adalah pilar OOP di mana sebuah class (**Child / Subclass**) mewarisi seluruh field dan method non-private dari class induk (**Parent / Superclass**) menggunakan kata kunci `extends`.

Karakteristik penting di Java:
- **Single Inheritance:** Java hanya mengizinkan satu class mewarisi tepat **satu parent class** (tidak ada multiple class inheritance).
- Seluruh class di Java secara implisit mewarisi class `java.lang.Object` sebagai puncak hierarki.

## Contoh

```java
// Superclass (Parent)
class Karyawan {
    String nama;
    double gajiPokok;

    void kerja() {
        System.out.println(nama + " sedang menyelesaikan tugas rutin kantor.");
    }
}

// Subclass (Child) yang mewarisi Karyawan
class Manager extends Karyawan {
    int jumlahTim;

    void pimpinRapat() {
        System.out.printf("%s sedang memimpin rapat dengan %d anggota tim.%n", nama, jumlahTim);
    }
}

public class InheritanceDemo {
    public static void main(String[] args) {
        Manager mgr = new Manager();
        // Mengakses field dan method warisan dari Karyawan
        mgr.nama = "Hendra Wijaya";
        mgr.gajiPokok = 15_000_000;
        mgr.jumlahTim = 8;

        mgr.kerja();       // Method warisan parent
        mgr.pimpinRapat(); // Method spesifik child
    }
}
```

## Output

```text
Hendra Wijaya sedang menyelesaikan tugas rutin kantor.
Hendra Wijaya sedang memimpin rapat dengan 8 anggota tim.
```

## Cara Kerja

```text
              ┌───────────────────────────┐
              │    Karyawan (Parent)      │
              │  - nama, gajiPokok        │
              │  + kerja()                │
              └─────────────┬─────────────┘
                            │ extends
                            ▼
              ┌───────────────────────────┐
              │     Manager (Child)       │
              │  - jumlahTim              │
              │  + pimpinRapat()          │
              └───────────────────────────┘
```

**Hafalan:**

```text
class ChildClass extends ParentClass { ... } → mewarisi semua field dan method non-private milik ParentClass
```

---

<a id="bagian-12"></a>

# 12. 🟡 Kata Kunci super (Constructor & Method Delegation)

## Konsep

Kata kunci `super` digunakan di dalam child class untuk merujuk ke **anggota milik superclass (parent)**:

1. **`super(...)`:** Memanggil constructor milik superclass. Wajib dipanggil pada **baris pertama** di constructor child class jika superclass tidak memiliki default no-argument constructor.
2. **`super.methodName()`:** Memanggil method asli milik superclass yang telah di-override oleh child class.
3. **`super.fieldName`:** Mengakses field milik superclass jika terjadi bentrok nama.

## Contoh

```java
class Kendaraan {
    String merk;
    int tahun;

    Kendaraan(String merk, int tahun) {
        this.merk = merk;
        this.tahun = tahun;
    }

    void klakson() {
        System.out.println("Bunyi klakson standar: Tiiin!");
    }
}

class Truk extends Kendaraan {
    double kapasitasTon;

    Truk(String merk, int tahun, double kapasitasTon) {
        super(merk, tahun); // 1. Mendelegasikan inisialisasi ke constructor parent Kendaraan
        this.kapasitasTon = kapasitasTon;
    }

    @Override
    void klakson() {
        super.klakson(); // 2. Memanggil method asli parent
        System.out.println("Bunyi klakson kencang Truk: HOOOONK!");
    }

    void cetakSpesifikasi() {
        System.out.printf("Truk Merk: %s | Tahun: %d | Kapasitas: %.1f Ton%n", super.merk, super.tahun, this.kapasitasTon);
    }
}

public class SuperKeywordDemo {
    public static void main(String[] args) {
        Truk fuso = new Truk("Mitsubishi Fuso", 2023, 15.5);
        fuso.cetakSpesifikasi();
        System.out.println("Tes Klakson:");
        fuso.klakson();
    }
}
```

## Output

```text
Truk Merk: Mitsubishi Fuso | Tahun: 2023 | Kapasitas: 15.5 Ton
Tes Klakson:
Bunyi klakson standar: Tiiin!
Bunyi klakson kencang Truk: HOOOONK!
```

## Cara Kerja

```text
Truk Constructor
       │
       ▼
super(merk, tahun) ──> Eksekusi Kendaraan Constructor di Superclass ──> Inisialisasi merk, tahun
       │
       ▼
this.kapasitasTon = kapasitasTon ──> Inisialisasi field spesifik child Truk
```

**Hafalan:**

```text
super(arguments)   → memanggil constructor milik superclass (wajib baris pertama di constructor child)
super.methodName() → memanggil implementasi method asli milik superclass
```

---

<a id="bagian-13"></a>

# 13. 🟡 Method Overriding (@Override)

## Konsep

**Method Overriding** terjadi saat subclass mendeklarasikan ulang sebuah method yang sudah ada di superclass-nya dengan **nama, tipe return, dan parameter yang sama persis**, tetapi memberikan implementasi tubuh yang berbeda.

Gunakan anotasi `@Override` agar compiler membantu memverifikasi bahwa method tersebut benar-benar meng-override method parent yang valid (menghindari kesalahan ketik nama method).

> [!NOTE]
> Method yang memiliki modifier `final` atau `private` pada superclass **tidak dapat di-override**.

## Contoh

```java
class Bentuk {
    double hitungLuas() {
        return 0.0;
    }
}

class Persegi extends Bentuk {
    double sisi;

    Persegi(double sisi) {
        this.sisi = sisi;
    }

    @Override
    double hitungLuas() {
        return sisi * sisi; // Override formula luas persegi
    }
}

class Lingkaran extends Bentuk {
    double radius;

    Lingkaran(double radius) {
        this.radius = radius;
    }

    @Override
    double hitungLuas() {
        return Math.PI * radius * radius; // Override formula luas lingkaran
    }
}

public class MethodOverridingDemo {
    public static void main(String[] args) {
        Persegi p = new Persegi(6);
        Lingkaran l = new Lingkaran(7);

        System.out.printf("Luas Persegi (sisi 6)     : %.2f%n", p.hitungLuas());
        System.out.printf("Luas Lingkaran (radius 7) : %.2f%n", l.hitungLuas());
    }
}
```

## Output

```text
Luas Persegi (sisi 6)     : 36.00
Luas Lingkaran (radius 7) : 153.94
```

## Cara Kerja

```text
Pemanggilan: p.hitungLuas()
      │
      ▼
JVM memeriksa implementasi method pada runtime class (Persegi)
      │
      ▼
Eksekusi method Persegi.hitungLuas() (Bukan Bentuk.hitungLuas())
```

**Hafalan:**

```text
@Override returnType methodName(parameters) → menimpa dan mengganti implementasi method warisan superclass
```

---

<a id="bagian-14"></a>

# 14. 🟡 Polymorphism (Polimorfisme & Dynamic Dispatch)

## Konsep

**Polymorphism** (banyak bentuk) memungkinkan sebuah variabel bertipe superclass/interface untuk menunjuk ke berbagai macam instance subclass yang berbeda.

Saat sebuah method dipanggil melalui referensi superclass, Java secara cerdas akan mengeksekusi method milik objek nyata yang sebenarnya di heap saat runtime (**Dynamic Method Dispatch**).

## Contoh

```java
class Pembayaran {
    void prosesPembayaran(double jumlah) {
        System.out.printf("Memproses pembayaran umum: Rp %,.2f%n", jumlah);
    }
}

class TransferBank extends Pembayaran {
    @Override
    void prosesPembayaran(double jumlah) {
        System.out.printf("✅ Pembayaran Rp %,.2f via Transfer Virtual Account Bank.%n", jumlah);
    }
}

class EWallet extends Pembayaran {
    @Override
    void prosesPembayaran(double jumlah) {
        System.out.printf("✅ Pembayaran Rp %,.2f via Scan QRIS E-Wallet.%n", jumlah);
    }
}

public class PolymorphismDemo {
    // Method menerima tipe umum parent Pembayaran
    static void checkout(Pembayaran metode, double total) {
        metode.prosesPembayaran(total); // Dynamic Method Dispatch
    }

    public static void main(String[] args) {
        Pembayaran p1 = new TransferBank(); // Objek TransferBank dalam tipe Pembayaran
        Pembayaran p2 = new EWallet();      // Objek EWallet dalam tipe Pembayaran

        checkout(p1, 500_000);
        checkout(p2, 75_000);
    }
}
```

## Output

```text
✅ Pembayaran Rp 500,000.00 via Transfer Virtual Account Bank.
✅ Pembayaran Rp 75,000.00 via Scan QRIS E-Wallet.
```

## Cara Kerja

```text
Variabel Referensi: Pembayaran metode
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
 Instance TransferBank   Instance EWallet
 (Eksekusi VA Bank)      (Eksekusi QRIS)
```

**Hafalan:**

```text
ParentType variable = new ChildType(); → variabel referensi parent menunjuk ke instance child (Polymorphism)
Dynamic Method Dispatch                → JVM mengeksekusi versi method objek konkret saat runtime
```

---

<a id="bagian-15"></a>

# 15. 🟡 Type Casting Objek & Pattern Matching instanceof

## Konsep

- **Upcasting (Otomatis):** Mengubah tipe referensi subclass ke superclass (`Karyawan k = new Manager();`). Selalu aman.
- **Downcasting (Manual):** Mengubah tipe referensi superclass kembali ke subclass spesifiknya (`Manager m = (Manager) k;`). Berisiko `ClassCastException` jika objek aslinya bukan bertipe subclass tersebut.
- **Pattern Matching for `instanceof` (Java 16+):** Memeriksa tipe objek sekaligus mendeklarasikan variabel casting dalam satu baris ekspresi yang aman dan bersih.

## Contoh

```java
class PegawaiKantor {
    String nama;
    PegawaiKantor(String nama) { this.nama = nama; }
}

class SoftwareEngineer extends PegawaiKantor {
    String bahasaPemrograman;
    SoftwareEngineer(String nama, String bahasa) {
        super(nama);
        this.bahasaPemrograman = bahasa;
    }
    void coding() {
        System.out.printf("%s sedang ngoding aplikasi dengan %s.%n", nama, bahasaPemrograman);
    }
}

public class InstanceofDemo {
    static void evaluasiPegawai(PegawaiKantor p) {
        // Pattern Matching instanceof Modern (Java 16+)
        if (p instanceof SoftwareEngineer se) {
            // Variabel 'se' otomatis sudah di-cast ke SoftwareEngineer
            se.coding();
        } else {
            System.out.println(p.nama + " adalah pegawai kantor umum.");
        }
    }

    public static void main(String[] args) {
        PegawaiKantor p1 = new SoftwareEngineer("Farhan", "Java 21");
        PegawaiKantor p2 = new PegawaiKantor("Bambang");

        evaluasiPegawai(p1);
        evaluasiPegawai(p2);
    }
}
```

## Output

```text
Farhan sedang ngoding aplikasi dengan Java 21.
Bambang adalah pegawai kantor umum.
```

## Cara Kerja

```text
if (p instanceof SoftwareEngineer se)
          │
      [Cocok?]
    ┌─────┴─────┐
  [YA]        [TIDAK]
    │           │
    ▼           ▼
Otomatis Cast  Lewati Blok
ke tipe 'se'
```

**Hafalan:**

```text
object instanceof TargetType variable → memeriksa apakah object merupakan tipe TargetType dan otomatis meng-cast-nya
```

---

<a id="bagian-16"></a>

# 16. 🟡 Abstract Class & Abstract Method

## Konsep

- **Abstract Class:** Class setengah jadi yang **tidak dapat diinstansiasi langsung** (`new AbstractClass()` akan error). Didesain khusus untuk menjadi superclass dasar.
- **Abstract Method:** Method yang dideklarasikan dengan kata kunci `abstract`, **tidak memiliki isi tubuh `{ ... }`**, dan **wajib di-override & diimplementasikan** oleh subclass konkret pertamanya.

## Contoh

```java
// Abstract Class sebagai cetak biru kontrak dasar
abstract class Hewan {
    String nama;

    Hewan(String nama) {
        this.nama = nama;
    }

    // Abstract Method: Setiap hewan punya suara berbeda
    abstract void bersuara();

    // Concrete Method biasa
    void tidur() {
        System.out.println(nama + " sedang tidur nyenyak: Zzz...");
    }
}

class Kucing extends Hewan {
    Kucing(String nama) { super(nama); }

    @Override
    void bersuara() {
        System.out.println(nama + ": Meong... Meong!");
    }
}

class Anjing extends Hewan {
    Anjing(String nama) { super(nama); }

    @Override
    void bersuara() {
        System.out.println(nama + ": Guk... Guk!");
    }
}

public class AbstractDemo {
    public static void main(String[] args) {
        // Hewan h = new Hewan("Hewan"); // ERROR: Hewan is abstract; cannot be instantiated

        Hewan kucing = new Kucing("Mimi");
        Hewan anjing = new Anjing("Doggy");

        kucing.bersuara();
        kucing.tidur();

        anjing.bersuara();
    }
}
```

## Output

```text
Mimi: Meong... Meong!
Mimi sedang tidur nyenyak: Zzz...
Doggy: Guk... Guk!
```

## Cara Kerja

```text
abstract class Hewan (Kontrak: bersuara())
         │
         ├──── extends ───> class Kucing (Implementasi: Meong)
         │
         └──── extends ───> class Anjing (Implementasi: Guk Guk)
```

**Hafalan:**

```text
abstract class ClassName { ... }    → mendefinisikan class yang tidak bisa dibuat objeknya secara langsung
abstract returnType methodName();  → mendefinisikan kontrak method wajib tanpa kurung kurawal body
```

---

<a id="bagian-17"></a>

# 17. 🟡 Interface Dasar & Multiple Implementation

## Konsep

**Interface** adalah kontrak perilaku murni (*pure contract*) yang mendefinisikan apa yang bisa dilakukan oleh suatu objek tanpa memedulikan bagaimana cara melakukannya.

Karakteristik penting Interface:
1. Seluruh method secara default bersifat `public abstract`.
2. Seluruh variabel/field di interface secara otomatis bersifat `public static final` (konstanta).
3. Class mengimplementasikan interface menggunakan kata kunci `implements`.
4. **Multiple Implementation:** Satu class dapat mengimplementasikan **banyak interface sekaligus** (solusi atas keterbatasan single inheritance class di Java).

## Contoh

```java
interface BisaTerbang {
    void terbang();
}

interface Bersuara {
    void buatSuara();
}

// Implementasi dua interface sekaligus
class BurungElang implements BisaTerbang, Bersuara {
    private String nama;

    public BurungElang(String nama) {
        this.nama = nama;
    }

    @Override
    public void terbang() {
        System.out.println(nama + " melayang tinggi di angkasa.");
    }

    @Override
    public void buatSuara() {
        System.out.println(nama + " berteriak: Kweeeek!");
    }
}

public class InterfaceDemo {
    public static void main(String[] args) {
        BurungElang elang = new BurungElang("Elang Jawa");
        elang.terbang();
        elang.buatSuara();
    }
}
```

## Output

```text
Elang Jawa melayang tinggi di angkasa.
Elang Jawa berteriak: Kweeeek!
```

## Cara Kerja

```text
interface BisaTerbang        interface Bersuara
        │                           │
        └─────────────┬─────────────┘
                      │ implements
                      ▼
               class BurungElang
       (Wajib implementasi kedua kontrak)
```

**Hafalan:**

```text
interface InterfaceName { void method(); }      → mendefinisikan kontrak method antarmuka
class ClassName implements InterfaceA, InterfaceB → mengimplementasikan banyak interface sekaligus
```

---

<a id="bagian-18"></a>

# 18. 🟡 Interface Inheritance (extends)

## Konsep

Interface dapat mewarisi interface lainnya menggunakan kata kunci `extends`.

Berbeda dengan class biasa yang hanya mendukung *single inheritance*, sebuah interface diizinkan mewarisi **banyak interface sekaligus** (*multiple interface inheritance*).

## Contoh

```java
interface Bernapas {
    void napas();
}

interface Bergerak {
    void jalan();
}

// Interface Mewarisi Banyak Interface
interface MakhlukHidup extends Bernapas, Bergerak {
    void makan();
}

class Manusia implements MakhlukHidup {
    @Override
    public void napas() {
        System.out.println("Manusia menghirup oksigen.");
    }

    @Override
    public void jalan() {
        System.out.println("Manusia berjalan dengan 2 kaki.");
    }

    @Override
    public void makan() {
        System.out.println("Manusia makan nasi.");
    }
}

public class InterfaceInheritanceDemo {
    public static void main(String[] args) {
        MakhlukHidup orang = new Manusia();
        orang.napas();
        orang.jalan();
        orang.makan();
    }
}
```

## Output

```text
Manusia menghirup oksigen.
Manusia berjalan dengan 2 kaki.
Manusia makan nasi.
```

## Cara Kerja

```text
interface Bernapas     interface Bergerak
        │                      │
        └──────────┬───────────┘
                   │ extends
                   ▼
        interface MakhlukHidup (Gabungan 3 Kontrak Method)
                   │
                   ▼ implements
             class Manusia
```

**Hafalan:**

```text
interface ChildInterface extends ParentA, ParentB { ... } → interface mewarisi beberapa kontrak interface sekaligus
```

---

<a id="bagian-19"></a>

# 19. 🟡 Default Method & Static Method pada Interface

## Konsep

Sejak **Java 8**, interface dapat memiliki method konkret yang memiliki tubuh kode `{ ... }`:
1. **Default Method (`default`):** Menyediakan implementasi standar bawaan. Jika class yang mengimplementasikan interface tidak meng-override method ini, implementasi default yang akan dijalankan. Fitur ini dirancang untuk evolusi library tanpa merusak class yang sudah ada (*backward compatibility*).
2. **Static Method (`static`):** Method utilitas yang menempel pada interface dan dapat dipanggil langsung melalui nama interface (`InterfaceName.method()`).

## Contoh

```java
interface NotifikasiService {
    // 1. Abstract Method wajib
    void kirimPesan(String penerima, String pesan);

    // 2. Default Method (Opsional untuk di-override)
    default void kirimBroadcast(String[] daftarPenerima, String pesan) {
        System.out.println("Memulai pengiriman broadcast standar:");
        for (String penerima : daftarPenerima) {
            kirimPesan(penerima, pesan);
        }
    }

    // 3. Static Method Utilitas
    static boolean validasiNomorTelepon(String nomor) {
        return nomor != null && nomor.startsWith("+62");
    }
}

class EmailNotifikasi implements NotifikasiService {
    @Override
    public void kirimPesan(String penerima, String pesan) {
        System.out.printf("Mengirim Email ke %s: '%s'%n", penerima, pesan);
    }
}

public class DefaultMethodDemo {
    public static void main(String[] args) {
        NotifikasiService service = new EmailNotifikasi();

        // Panggil method wajib
        service.kirimPesan("budi@gmail.com", "Selamat datang!");

        // Panggil default method
        String[] users = {"ali@gmail.com", "siti@gmail.com"};
        service.kirimBroadcast(users, "Promo Diskon Gajian!");

        // Panggil static method interface
        boolean valid = NotifikasiService.validasiNomorTelepon("+62812345678");
        System.out.println("Validasi Nomor +62: " + valid);
    }
}
```

## Output

```text
Mengirim Email ke budi@gmail.com: 'Selamat datang!'
Memulai pengiriman broadcast standar:
Mengirim Email ke ali@gmail.com: 'Promo Diskon Gajian!'
Mengirim Email ke siti@gmail.com: 'Promo Diskon Gajian!'
Validasi Nomor +62: true
```

## Cara Kerja

```text
Class EmailNotifikasi ──> Tidak ada kirimBroadcast()?
                                │
                                ▼
         Gunakan default method milik NotifikasiService
```

**Hafalan:**

```text
default returnType methodName() { ... } → method ber-body di interface yang dapat diwariskan secara opsional
static returnType methodName() { ... }  → method helper static yang dipanggil via InterfaceName.method()
```

---

<a id="bagian-20"></a>

# 20. 🟡 Private Method pada Interface

## Konsep

Sejak **Java 9**, interface mendukung deklarasi method dengan modifier `private`.

Method private di interface digunakan khusus untuk **meringkas dan membagi logika duplikat di antara beberapa `default` method** di dalam interface yang sama, tanpa membocorkan fungsi internal tersebut ke class luar.

## Contoh

```java
interface LoggingSystem {
    default void logInfo(String pesan) {
        formatDanCetak("INFO", pesan);
    }

    default void logError(String pesan) {
        formatDanCetak("ERROR", pesan);
    }

    // Private Helper Method (Hanya untuk internal interface LoggingSystem)
    private void formatDanCetak(String level, String pesan) {
        System.out.printf("[%tT] [%s] %s%n", System.currentTimeMillis(), level, pesan);
    }
}

class DatabaseLogger implements LoggingSystem {}

public class PrivateInterfaceMethodDemo {
    public static void main(String[] args) {
        DatabaseLogger logger = new DatabaseLogger();
        logger.logInfo("Koneksi database berhasil dibuat.");
        logger.logError("Query timeout saat membaca tabel orders.");
    }
}
```

## Output

```text
[18:30:15] [INFO] Koneksi database berhasil dibuat.
[18:30:15] [ERROR] Query timeout saat membaca tabel orders.
```

## Cara Kerja

```text
logInfo()  ───┐
              ├───> private formatDanCetak() ───> System.out.printf
logError() ───┘
```

**Hafalan:**

```text
private returnType methodName() { ... } → method helper internal interface untuk merapikan kode default methods
```

---

<a id="bagian-21"></a>

# 21. 🟡 Anonymous Class

## Konsep

**Anonymous Class** adalah class tanpa nama yang dideklarasikan dan diinstansiasi secara bersamaan dalam satu baris ekspresi untuk mengimplementasikan sebuah interface atau meng-override abstract class **satu kali pakai**.

Fitur ini berguna saat kita hanya membutuhkan satu objek khusus tanpa perlu repot membuat file class `.java` baru secara terpisah.

## Contoh

```java
interface TombolClickListener {
    void onClick(String event);
}

public class AnonymousClassDemo {
    public static void main(String[] args) {
        // Membuat objek listener menggunakan Anonymous Class
        TombolClickListener loginBtnListener = new TombolClickListener() {
            @Override
            public void onClick(String event) {
                System.out.println("Tombol Login Diklik! Memvalidasi kredensial pengguna...");
            }
        };

        // Memanggil method
        loginBtnListener.onClick("CLICK_EVENT");
    }
}
```

## Output

```text
Tombol Login Diklik! Memvalidasi kredensial pengguna...
```

## Cara Kerja

```text
new InterfaceName() { ... }
             │
             ▼
Compiler otomatis menghasilkan bytecode class anonim di belakang layar:
Main$1.class implements TombolClickListener
```

**Hafalan:**

```text
InterfaceName obj = new InterfaceName() { @Override ... }; → membuat instance implementasi interface sekali pakai tanpa nama class
```

---

<a id="bagian-22"></a>

# 22. 🟡 Inner Class & Static Nested Class

## Konsep

Java memungkinkan kita mendefinisikan class di dalam class lain (*Nested Classes*):
1. **Member Inner Class (Non-Static):** Menempel pada instance objek outer class dan memiliki akses langsung ke seluruh field private outer class.
2. **Static Nested Class:** Tidak menempel pada instance objek outer class, hanya dapat mengakses field static outer class, dan dapat diinstansiasi langsung tanpa instance outer class.

## Contoh

```java
class Luar {
    private String namaLuar = "Outer Class";
    private static String staticLuar = "Static Variable Outer";

    // 1. Member Inner Class (Non-Static)
    class DalamNonStatic {
        void cetak() {
            // Bisa akses field private luar langsung
            System.out.println("Inner Non-Static mengakses: " + namaLuar);
        }
    }

    // 2. Static Nested Class
    static class DalamStatic {
        void cetak() {
            // Hanya bisa akses static luar
            System.out.println("Nested Static mengakses: " + staticLuar);
        }
    }
}

public class NestedClassDemo {
    public static void main(String[] args) {
        // Instansiasi Inner Class Non-Static (Perlu instance objek luar)
        Luar outerObj = new Luar();
        Luar.DalamNonStatic inner = outerObj.new DalamNonStatic();
        inner.cetak();

        // Instansiasi Static Nested Class (Langsung via nama ClassLuar)
        Luar.DalamStatic nested = new Luar.DalamStatic();
        nested.cetak();
    }
}
```

## Output

```text
Inner Non-Static mengakses: Outer Class
Nested Static mengakses: Static Variable Outer
```

## Cara Kerja

```text
Outer Instance (outerObj) ──> outerObj.new DalamNonStatic() (Punya referensi ke outerObj)
Class Luar                ──> new Luar.DalamStatic()         (Mandiri, tanpa referensi instance luar)
```

**Hafalan:**

```text
Outer.Inner inner = outerInstance.new Inner(); → instansiasi member inner class non-static
Outer.Nested nested = new Outer.Nested();      → instansiasi static nested class
```

---

<a id="bagian-23"></a>

# 23. 🔴 Static Keyword Lengkap (Field, Method, Block)

## Konsep

Kata kunci `static` menandakan bahwa anggota tersebut **milik class secara global**, bukan milik instance objek perorangan. Seluruh objek berbagi satu salinan memori yang sama (*Shared Memory*).

- **`static field`:** Variabel global bersama.
- **`static method`:** Method utilitas yang dipanggil tanpa membuat objek (`ClassName.method()`).
- **`static block`:** Blok inisialisasi yang dijalankan **hanya satu kali** saat class pertama kali dimuat oleh ClassLoader ke memori JVM.

## Contoh

```java
class KonfigurasiAplikasi {
    public static final String APP_NAME = "E-Commerce System";
    public static int totalKoneksi;

    // Static Block untuk inisialisasi kompleks
    static {
        System.out.println("[STATIC BLOCK] Memuat konfigurasi database dan cache...");
        totalKoneksi = 10;
    }

    public static void tampilkanInfo() {
        System.out.printf("Aplikasi: %s | Pool Koneksi: %d%n", APP_NAME, totalKoneksi);
    }
}

public class StaticDemo {
    public static void main(String[] args) {
        System.out.println("Memulai program main...");
        // Memanggil method static langsung tanpa keyword new
        KonfigurasiAplikasi.tampilkanInfo();
    }
}
```

## Output

```text
Memulai program main...
[STATIC BLOCK] Memuat konfigurasi database dan cache...
Aplikasi: E-Commerce System | Pool Koneksi: 10
```

## Cara Kerja

```text
ClassLoader memuat KonfigurasiAplikasi.class
                   │
                   ▼
     Eksekusi static block { ... } (Hanya 1x seumur hidup runtime)
                   │
                   ▼
     static field tersimpan di Metaspace / Static Area
```

**Hafalan:**

```text
static type fieldName;  → variabel milik class bersama (shared antar semua instance)
static void method()    → method yang dipanggil langsung via ClassName.method() tanpa new
static { ... }          → blok inisialisasi satu kali saat class pertama dimuat ke memori
```

---

<a id="bagian-24"></a>

# 24. 🔴 Final Keyword Lengkap (Variable, Method, Class)

## Konsep

Kata kunci `final` digunakan untuk membatasi mutasi dan modifikasi:

1. **`final variable`:** Nilai variabel dikunci dan tidak dapat diubah setelah diinisialisasi (konstanta).
2. **`final method`:** Method **tidak dapat di-override** oleh child class manapun.
3. **`final class`:** Class **tidak dapat diwariskan / dijadikan parent** oleh class manapun (contoh: class bawaan `java.lang.String` adalah final).

## Contoh

```java
// Final Class: Tidak bisa di-extends
final class KeamananSistem {
    public final String ENCRYPTION_KEY = "AES-SECRET-KEY";

    // Final Method: Tidak bisa di-override
    public final void autentikasiToken(String token) {
        System.out.println("Memverifikasi token keamanan secara ketat: " + token);
    }
}

// class Hacker extends KeamananSistem {} // ERROR: Cannot inherit from final 'KeamananSistem'

public class FinalDemo {
    public static void main(String[] args) {
        KeamananSistem sec = new KeamananSistem();
        sec.autentikasiToken("TOKEN_12345");
        // sec.ENCRYPTION_KEY = "NEW_KEY"; // ERROR: cannot assign a value to final variable
    }
}
```

## Output

```text
Memverifikasi token keamanan secara ketat: TOKEN_12345
```

## Cara Kerja

```text
final variable  ──> Kunci Nilai   ──> Cegah Reassignment
final method    ──> Kunci Perilaku──> Cegah Override di Child
final class     ──> Kunci Desain  ──> Cegah Inheritance (extends)
```

**Hafalan:**

```text
final type name = value;  → membuat variabel bernilai tetap (konstanta)
final returnType method() → mengunci method agar tidak dapat di-override oleh subclass
final class ClassName     → mengunci class agar tidak dapat diwariskan/diturunkan
```

---

<a id="bagian-25"></a>

# 25. 🔴 Sealed Classes & Interfaces (Java 17+)

## Konsep

Diperkenalkan secara resmi pada **Java 17**, **Sealed Classes** memungkinkan developer membatasi dan mengontrol secara eksplisit **class mana saja yang diizinkan mewarisi atau mengimplementasikannya** menggunakan kata kunci `sealed` dan `permits`.

Subclass yang diizinkan wajib memilih salah satu dari tiga status:
- `final`: Tidak boleh diwariskan lagi.
- `sealed`: Membatasi pewarisan lebih lanjut dengan daftar izinnya sendiri.
- `non-sealed`: Membuka kembali pewarisan secara bebas untuk siapa saja.

## Contoh

```java
// 1. Sealed Class yang hanya mengizinkan CardPayment dan QrisPayment
public sealed class PaymentMethod permits CardPayment, QrisPayment {
    public abstract void pay(double amount);
}

// 2. Subclass dengan modifier final
public final class CardPayment extends PaymentMethod {
    @Override
    public void pay(double amount) {
        System.out.printf("Pembayaran Kartu Kredit: Rp %,.2f%n", amount);
    }
}

// 3. Subclass dengan modifier non-sealed (Bisa diturunkan bebas)
public non-sealed class QrisPayment extends PaymentMethod {
    @Override
    public void pay(double amount) {
        System.out.printf("Pembayaran QRIS: Rp %,.2f%n", amount);
    }
}
```

## Cara Kerja

```text
         sealed class PaymentMethod permits CardPayment, QrisPayment
                                      │
               ┌──────────────────────┴──────────────────────┐
               ▼                                             ▼
     final class CardPayment                    non-sealed class QrisPayment
 (Kunci total, tamat hierarki)                   (Bebas diwariskan siapa saja)
```

**Hafalan:**

```text
sealed class Parent permits ChildA, ChildB → membatasi class turunan hanya untuk daftar yang diizinkan
non-sealed class Child extends Parent      → membuka kembali izin pewarisan bebas untuk class turunan
```

---

<a id="bagian-26"></a>

# 26. 🔴 Record Lanjutan & Implementasi Interface

## Konsep

Record di Java adalah class pembawa data (*immutable data carrier*). Selain penggunaan dasarnya, Record mendukung:
- Mengimplementasikan **Interface**.
- Menambahkan **Custom Instance Method & Static Method**.
- Mendefinisikan **Compact Constructor** untuk validasi data tanpa perlu menulis penugasan `this.field = field`.

> [!NOTE]
> Record tidak dapat menggunakan kata kunci `extends` karena Record secara implisit telah mewarisi class `java.lang.Record` dan berstatus `final`.

## Contoh

```java
interface Validatable {
    boolean isValid();
}

// Record mengimplementasikan interface
public record TransaksiItem(String sku, int kuantitas, double hargaSatuan) implements Validatable {

    // Compact Constructor untuk validasi input
    public TransaksiItem {
        if (kuantitas <= 0) {
            throw new IllegalArgumentException("Kuantitas harus lebih dari nol!");
        }
        if (hargaSatuan < 0) {
            throw new IllegalArgumentException("Harga tidak boleh negatif!");
        }
    }

    // Method kalkulasi tambahan
    public double hitungSubtotal() {
        return kuantitas * hargaSatuan;
    }

    @Override
    public boolean isValid() {
        return sku != null && !sku.isBlank();
    }
}

class RecordAdvancedDemo {
    public static void main(String[] args) {
        TransaksiItem item = new TransaksiItem("SKU-990", 3, 45_000);

        System.out.println("Detail Item : " + item);
        System.out.println("Validitas   : " + item.isValid());
        System.out.printf("Subtotal    : Rp %,.2f%n", item.hitungSubtotal());
    }
}
```

## Output

```text
Detail Item : TransaksiItem[sku=SKU-990, kuantitas=3, hargaSatuan=45000.0]
Validitas   : true
Subtotal    : Rp 135,000.00
```

## Cara Kerja

```text
new TransaksiItem("SKU", 3, 45000)
              │
              ▼
Eksekusi Compact Constructor (Cek validasi)
              │
              ▼
Compiler otomatis mengunci data ke private final fields
```

**Hafalan:**

```text
public record RecordName(parameters) implements InterfaceName { ... } → membuat data carrier immutable dengan kemampuan kontrak interface
```

---

<a id="bagian-27"></a>

# 27. 🔴 Enum Class Lengkap (Fields, Constructor, Method)

## Konsep

**Enum** (*Enumeration*) adalah tipe data class khusus yang berisi kumpulan nilai konstanta tetap yang telah ditentukan sebelumnya.

Di Java, Enum adalah **class berkekuatan penuh** yang dapat memiliki:
- Field data sendiri
- Private constructor
- Method biasa dan method kalkulasi

## Contoh

```java
public enum StatusPesanan {
    PENDING("Menunggu Pembayaran", 0),
    DIPROSES("Sedang Dikemas di Gudang", 1),
    DIKIRIM("Dalam Perjalanan Kurir", 2),
    SELESAI("Pesanan Telah Diterima Pelanggan", 3);

    private final String deskripsi;
    private final int kodeLevel;

    // Enum constructor selalu bersifat private
    StatusPesanan(String deskripsi, int kodeLevel) {
        this.deskripsi = deskripsi;
        this.kodeLevel = kodeLevel;
    }

    public String getDeskripsi() {
        return deskripsi;
    }

    public int getKodeLevel() {
        return kodeLevel;
    }
}

class EnumDemo {
    public static void main(String[] args) {
        StatusPesanan status = StatusPesanan.DIPROSES;

        System.out.println("Nama Enum : " + status.name());
        System.out.println("Urutan    : " + status.ordinal());
        System.out.println("Deskripsi : " + status.getDeskripsi());
        System.out.println("Kode Level: " + status.getKodeLevel());

        // Iterasi seluruh nilai enum dengan .values()
        System.out.println("\nDaftar Seluruh Status:");
        for (StatusPesanan s : StatusPesanan.values()) {
            System.out.printf("- %-8s : %s%n", s.name(), s.getDeskripsi());
        }
    }
}
```

## Output

```text
Nama Enum : DIPROSES
Urutan    : 1
Deskripsi : Sedang Dikemas di Gudang
Kode Level: 1

Daftar Seluruh Status:
- PENDING  : Menunggu Pembayaran
- DIPROSES : Sedang Dikemas di Gudang
- DIKIRIM  : Dalam Perjalanan Kurir
- SELESAI  : Pesanan Telah Diterima Pelanggan
```

## Cara Kerja

```text
StatusPesanan.values() ──> Menghasilkan array: [PENDING, DIPROSES, DIKIRIM, SELESAI]
```

**Hafalan:**

```text
public enum EnumName { CONST_A, CONST_B; ... } → mendefinisikan tipe data konstanta berstruktur class
enumConstant.name()                           → mengembalikan nama teks konstanta enum
enumConstant.ordinal()                        → mengembalikan nomor indeks urutan konstanta enum (mulai 0)
EnumName.values()                             → mengembalikan seluruh daftar elemen enum sebagai array
```

---

<a id="bagian-28"></a>

# 28. 🔴 Object Root Class (toString, equals, hashCode)

## Konsep

`java.lang.Object` adalah akar dari seluruh hierarki class di Java. Tiga method paling penting yang wajib di-override pada domain model:
1. `toString()`: Representasi teks string dari objek saat dicetak ke konsol.
2. `equals(Object obj)`: Memeriksa kesamaan konten nilai data objek.
3. `hashCode()`: Menghasilkan bilangan integer unik yang wajib sinkron dengan `equals` untuk struktur data berbasis hash (seperti `HashSet` dan `HashMap`).

## Contoh

```java
import java.util.Objects;

class AkunUser {
    private String username;
    private String email;

    public AkunUser(String username, String email) {
        this.username = username;
        this.email = email;
    }

    @Override
    public String toString() {
        return "AkunUser{username='" + username + "', email='" + email + "'}";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true; // Cek referensi memori sama
        if (o == null || getClass() != o.getClass()) return false;
        AkunUser user = (AkunUser) o;
        return Objects.equals(username, user.username) && Objects.equals(email, user.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(username, email);
    }
}

public class ObjectMethodsDemo {
    public static void main(String[] args) {
        AkunUser userA = new AkunUser("alimurrofid", "ali@dev.com");
        AkunUser userB = new AkunUser("alimurrofid", "ali@dev.com");

        System.out.println("Print Object: " + userA);
        System.out.println("== referensi : " + (userA == userB));     // false (beda instance memori)
        System.out.println(".equals isi  : " + userA.equals(userB));  // true (konten identik)
        System.out.println("HashCode A   : " + userA.hashCode());
        System.out.println("HashCode B   : " + userB.hashCode());     // Wajib sama dengan HashCode A
    }
}
```

## Output

```text
Print Object: AkunUser{username='alimurrofid', email='ali@dev.com'}
== referensi : false
.equals isi  : true
HashCode A   : 1947230492
HashCode B   : 1947230492
```

## Cara Kerja

```text
Kontrak Java:
Jika a.equals(b) == true ──> Maka a.hashCode() WAJIB SAMA DENGAN b.hashCode()
```

**Hafalan:**

```text
@Override public String toString() { ... }             → mengubah representasi objek menjadi string yang informatif
@Override public boolean equals(Object o) { ... }      → membandingkan kesetaraan konten data internal objek
@Override public int hashCode() { return Objects.hash(fields); } → menghasilkan kode hash unik berbasis nilai data
```

---

<a id="bagian-29"></a>

# 29. 🔴 Hierarchy Exception di Java (Checked vs Unchecked)

## Konsep

Seluruh error dan exception di Java diturunkan dari class induk `java.lang.Throwable`:
- **`Error`:** Masalah fatal tingkat JVM sistem yang tidak dapat dipulihkan (misal: `OutOfMemoryError`, `StackOverflowError`). Aplikasi tidak boleh mencoba menangkapnya.
- **`Exception`:** Masalah yang dapat diprediksi dan ditangani oleh aplikasi:
  1. **Checked Exception:** Turunan langsung dari `Exception` (selain `RuntimeException`). Wajib ditangani dengan `try-catch` atau dideklarasikan di method signature dengan keyword `throws`. Contoh: `IOException`, `SQLException`.
  2. **Unchecked Exception / RuntimeException:** Turunan dari `RuntimeException`. Terjadi akibat kesalahan logika pemrograman dan tidak wajib dideklarasikan secara eksplisit. Contoh: `NullPointerException`, `IllegalArgumentException`.

## Contoh

```java
import java.io.FileReader;
import java.io.IOException;

public class ExceptionHierarchyDemo {
    // Method mendeklarasikan Checked Exception dengan keyword 'throws'
    static void bacaFileKonfigurasi(String path) throws IOException {
        FileReader reader = new FileReader(path); // Membuka file (Checked Exception)
        reader.close();
    }

    public static void main(String[] args) {
        try {
            bacaFileKonfigurasi("app-config.json");
        } catch (IOException e) {
            System.out.println("Menangani Checked Exception: " + e.getMessage());
        }
    }
}
```

## Output

```text
Menangani Checked Exception: app-config.json (The system cannot find the file specified)
```

## Cara Kerja

```text
                        Throwable
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
          Error                         Exception
    (Fatal Sistem JVM)                      │
                            ┌───────────────┴───────────────┐
                            ▼                               ▼
                    Checked Exception               RuntimeException
                  (IOException, SQL, etc.)        (NullPointer, IndexOut, etc.)
                   [Wajib Handle / throws]           [Unchecked Runtime]
```

**Hafalan:**

```text
throws ExceptionType → mendeklarasikan bahwa method berpotensi melempar checked exception ke pemanggilnya
```

---

<a id="bagian-30"></a>

# 30. 🔴 Custom Exception Class

## Konsep

Untuk merepresentasikan kesalahan spesifik pada domain bisnis aplikasi (seperti `SaldoTidakCukupException` atau `PesananKadaluarsaException`), kita dapat membuat class exception buatan sendiri:
- Turunkan dari `Exception` jika menginginkan **Checked Exception**.
- Turunkan dari `RuntimeException` jika menginginkan **Unchecked Exception** yang lebih modern dan fleksibel.

## Contoh

```java
// Custom Unchecked Exception untuk Validasi Bisnis
class SaldoTidakCukupException extends RuntimeException {
    private final double saldoSaatIni;
    private final double nominalTarik;

    public SaldoTidakCukupException(double saldoSaatIni, double nominalTarik) {
        super(String.format("Gagal tarik saldo! Saldo: Rp %,.2f | Penarikan: Rp %,.2f", saldoSaatIni, nominalTarik));
        this.saldoSaatIni = saldoSaatIni;
        this.nominalTarik = nominalTarik;
    }

    public double getDefisit() {
        return nominalTarik - saldoSaatIni;
    }
}

class RekeningSimpanan {
    private double saldo = 100_000;

    public void tarikTunai(double jumlah) {
        if (jumlah > saldo) {
            throw new SaldoTidakCukupException(saldo, jumlah);
        }
        saldo -= jumlah;
        System.out.printf("Tarik tunai berhasil Rp %,.2f. Sisa saldo: Rp %,.2f%n", jumlah, saldo);
    }
}

public class CustomExceptionDemo {
    public static void main(String[] args) {
        RekeningSimpanan rek = new RekeningSimpanan();

        try {
            rek.tarikTunai(50_000);  // Berhasil
            rek.tarikTunai(200_000); // Memicu Custom Exception
        } catch (SaldoTidakCukupException e) {
            System.err.println("❌ ERROR DOMAIN: " + e.getMessage());
            System.err.printf("👉 Kekurangan Dana: Rp %,.2f%n", e.getDefisit());
        }
    }
}
```

## Output

```text
Tarik tunai berhasil Rp 50,000.00. Sisa saldo: Rp 50,000.00
❌ ERROR DOMAIN: Gagal tarik saldo! Saldo: Rp 50,000.00 | Penarikan: Rp 200,000.00
👉 Kekurangan Dana: Rp 150,000.00
```

## Cara Kerja

```text
tarikTunai(200_000) ──> jumlah > saldo ──> throw new SaldoTidakCukupException(...)
                                                      │
                                                      ▼
                                            Ditangkap oleh catch (SaldoTidakCukupException e)
```

**Hafalan:**

```text
public class MyException extends RuntimeException { public MyException(String msg) { super(msg); } } → membuat custom exception domain
```

---

<a id="bagian-31"></a>

# 31. 🔴 Garbage Collection & Manajemen Memori OOP

## Konsep

Manajemen memori pada runtime Java terbagi dalam 3 area utama:
1. **Stack Memory:** Menyimpan pemanggilan method (*Stack Frame*), variabel lokal, dan alamat pointer referensi objek. Memori otomatis dibersihkan saat method selesai dieksekusi (*LIFO*).
2. **Heap Memory:** Menyimpan seluruh instance objek dan variabel instance (`new`).
3. **Metaspace:** Menyimpan metadata class, static fields, dan bytecode method.

**Garbage Collector (GC):** Utilitas otomatis JVM yang melacak objek-objek di Heap yang sudah tidak memiliki referensi aktif dari Stack, lalu menghancurkannya untuk membebaskan ruang RAM.

## Contoh

```java
public class MemoryGCDemo {
    static void prosesData() {
        // Objek dibuat di Heap, referensi 'mhs' ada di Stack
        Mahasiswa mhs = new Mahasiswa();
        mhs.nama = "Sementara";
        System.out.println("Memproses: " + mhs.nama);
    } // Saat method selesai, variabel 'mhs' di Stack musnah -> Objek Mahasiswa di Heap menjadi kandidat GC!

    public static void main(String[] args) {
        prosesData();

        // Melepaskan referensi secara eksplisit
        Mahasiswa m1 = new Mahasiswa();
        m1 = null; // Objek Mahasiswa lama kini terputus dan siap dibersihkan Garbage Collector

        // Saran ke JVM untuk menjalankan GC (Tidak menjamin langsung dieksekusi)
        System.gc();
        System.out.println("Garbage Collector disarankan berjalan.");
    }
}
```

## Output

```text
Memproses: Sementara
Garbage Collector disarankan berjalan.
```

## Cara Kerja

```text
   Stack Frame                Heap Memory
┌──────────────┐             ┌─────────────────────────────┐
│ m1 = null    │             │ [Objek Mahasiswa @0x101]    │ <── (Tidak ada yang menunjuk)
└──────────────┘             └──────────────┬──────────────┘
                                            │
                                            ▼
                               Garbage Collector Menghapus
                               & Mengembalikan Memori ke OS
```

**Hafalan:**

```text
Stack Memory  → alokasi lokal cepat untuk stack frame method dan variabel referensi
Heap Memory   → alokasi dinamis untuk seluruh instance objek nyata
System.gc()   → mengirimkan sinyal saran kepada JVM untuk menjalankan Garbage Collection
```

---

<a id="bagian-32"></a>

# 32. 🛠️ Peta Ingatan Cepat

```text
                             PETA ARSITEKTUR JAVA OOP
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
  PONDASI KELAS                  PEWARISAN & KONTRAK             FITUR MODERN & DATA
  ├─ class (Blueprint)           ├─ extends (Inheritance)        ├─ sealed & permits
  ├─ new (Instance Heap)         ├─ super & super()              ├─ record (Data Carrier)
  ├─ this (Context & Chaining)   ├─ @Override (Polymorphism)     ├─ enum (Konstanta Class)
  ├─ private & Getter/Setter     ├─ abstract class & method      ├─ Pattern Matching instanceof
  └─ package & import            └─ interface & default method   └─ Custom Exception (Domain)
```

---

<a id="bagian-33"></a>

# 33. 📚 Tabel Ringkasan

| Fitur / Keyword | Sintaks Utama | Fungsi & Karakteristik |
|---|---|---|
| Instansiasi | `new ClassName(args)` | Mengalokasikan instance objek baru di memori Heap |
| Konteks Objek | `this.field` / `this(args)` | Merujuk ke objek saat ini atau memanggil constructor lain |
| Enkapsulasi | `private` field + `get`/`set` | Melindungi integritas data dengan validasi mutasi |
| Pewarisan | `class Child extends Parent` | Mewarisi seluruh anggota non-private dari satu parent class |
| Delegasi Parent | `super(args)` / `super.m()` | Memanggil constructor atau method milik superclass |
| Polimorfisme | `@Override` | Mengganti implementasi method parent pada child class |
| Pattern Matching | `if (obj instanceof Type t)` | Memeriksa tipe objek sekaligus meng-cast ke variabel `t` |
| Abstraksi Murni | `interface` / `implements` | Kontrak perilaku method yang dapat diimplementasi banyak |
| Default Interface | `default void method() {}` | Method ber-body opsional pada interface sejak Java 8 |
| Scope Global | `static` field / method | Anggota milik class bersama, dipanggil tanpa membuat objek |
| Pengunci Mutasi | `final` variable / method / class | Mengunci nilai, mencegah override, atau mencegah inheritance |
| Kontrol Hierarki | `sealed class P permits C1, C2` | Membatasi izin subclass yang boleh mewarisi (Java 17+) |
| Immutable Record | `public record User(String id) {}` | Class data carrier ringkas otomatis getter & toString |
| Type-Safe Enum | `public enum Status { A, B }` | Class kumpulan konstanta tetap dengan field dan method |
| Custom Error | `class AppEx extends RuntimeException` | Membuat error domain logika bisnis aplikasi sendiri |

---

<a id="bagian-34"></a>

# 34. ⚡ Cheat Code Java OOP 10 Detik

```java
// 1. Template Class Lengkap dengan Enkapsulasi & Constructor Chaining
public class User {
    private String id;
    private String name;

    public User(String id, String name) {
        this.id = id;
        this.name = name;
    }
    public User(String id) { this(id, "Guest"); }

    public String getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}

// 2. Inheritance & Overriding
public class Admin extends User {
    public Admin(String id, String name) { super(id, name); }
    @Override public String getName() { return "[ADMIN] " + super.getName(); }
}

// 3. Interface Modern
public interface Payable {
    void pay(double amount);
    default void printReceipt() { System.out.println("Receipt printed."); }
}

// 4. Record Praktis (Java 16+)
public record OrderItem(String sku, int qty, double price) {}

// 5. Sealed Class Kontrol (Java 17+)
public sealed class Shape permits Circle, Square {}
public final class Circle extends Shape {}
public final class Square extends Shape {}
```

---

<a id="bagian-35"></a>

# 35. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Penguasaan Class, Object, dan Enkapsulasi
├── Pahami alur pemisahan memori (Stack pointer vs Heap instance)
├── Biasakan seluruh field private dengan Getter & Setter ber-validasi
└── Gunakan constructor overloading dan this(...) chaining
       │
       ▼
Langkah 2: Pewarisan, Polimorfisme & Abstraksi
├── Gunakan extends dan manfaatkan super() untuk delegasi
├── Terapkan @Override dan pahami Dynamic Method Dispatch
└── Buat arsitektur kontrak bersih dengan interface dan abstract class
       │
       ▼
Langkah 3: Fitur Modern Java OOP
├── Manfaatkan Pattern Matching instanceof (Java 16+)
├── Gunakan Record untuk model immutable data carrier
└── Terapkan Sealed Classes (Java 17+) untuk domain hierarki ketat
       │
       ▼
Langkah 4: Robust Error Handling & Domain Exception
├── Rancang Custom Exception turunan RuntimeException
└── Lindungi transaksi sistem dengan try-catch-finally terstruktur
       │
       ▼
Langkah 5: Bangun Arsitektur Sistem OOP Nyata (Mini Project Payment Gateway)!
```

---

<a id="bagian-36"></a>

# 36. 🏗️ Mini Project: Sistem Payment Gateway & Transaksi E-Commerce CLI

Aplikasi nyata berorientasi objek murni yang menggabungkan seluruh konsep inti OOP: **4 Pilar OOP, Interface, Abstract Class, Sealed Class, Record, Enum, Custom Exception, Pattern Matching `instanceof`, dan Dynamic Method Dispatch**.

```java
import java.util.Scanner;
import java.util.UUID;

// 1. Custom Exception Domain
class PaymentFailedException extends RuntimeException {
    public PaymentFailedException(String message) {
        super(message);
    }
}

// 2. Enum untuk Status Transaksi
enum TransactionStatus {
    SUCCESS("Transaksi Berhasil Diproses"),
    FAILED("Transaksi Gagal / Ditolak");

    private final String description;
    TransactionStatus(String description) { this.description = description; }
    public String getDescription() { return description; }
}

// 3. Record untuk Data Transaksi (Immutable)
record PaymentReceipt(String transactionId, String customerName, double amount, String method, TransactionStatus status) {
    public void print() {
        System.out.println("\n==================================================");
        System.out.println("            BUKTI PEMBAYARAN RESMI                ");
        System.out.println("==================================================");
        System.out.printf("ID Transaksi  : %s%n", transactionId);
        System.out.printf("Nama Pembeli  : %s%n", customerName);
        System.out.printf("Total Bayar   : Rp %,.2f%n", amount);
        System.out.printf("Metode Bayar  : %s%n", method);
        System.out.printf("Status        : %s (%s)%n", status.name(), status.getDescription());
        System.out.println("==================================================");
    }
}

// 4. Interface Kontrak Layanan Pembayaran
interface PaymentProcessor {
    PaymentReceipt process(String customerName, double amount);
}

// 5. Sealed Abstract Class untuk Metode Pembayaran Resmi
sealed abstract class BasePaymentMethod implements PaymentProcessor permits BankTransferPayment, EWalletPayment, CreditCardPayment {
    private final String methodName;

    public BasePaymentMethod(String methodName) {
        this.methodName = methodName;
    }

    public String getMethodName() {
        return methodName;
    }

    // Template method helper
    protected String generateTxId() {
        return "TX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}

// 6. Subclass Konkret 1: Transfer Bank
final class BankTransferPayment extends BasePaymentMethod {
    private final String bankName;
    private final String vaNumber;

    public BankTransferPayment(String bankName, String vaNumber) {
        super("Virtual Account " + bankName);
        this.bankName = bankName;
        this.vaNumber = vaNumber;
    }

    @Override
    public PaymentReceipt process(String customerName, double amount) {
        if (amount < 10_000) {
            throw new PaymentFailedException("Minimum transfer bank adalah Rp 10.000,00!");
        }
        System.out.printf("Memverifikasi VA Bank %s [%s]... Lunas!%n", bankName, vaNumber);
        return new PaymentReceipt(generateTxId(), customerName, amount, getMethodName(), TransactionStatus.SUCCESS);
    }
}

// 7. Subclass Konkret 2: E-Wallet QRIS
final class EWalletPayment extends BasePaymentMethod {
    private final String walletProvider;

    public EWalletPayment(String walletProvider) {
        super("E-Wallet (" + walletProvider + ")");
        this.walletProvider = walletProvider;
    }

    @Override
    public PaymentReceipt process(String customerName, double amount) {
        if (amount > 2_000_000) {
            throw new PaymentFailedException("Limit transaksi QRIS E-Wallet maksimal Rp 2.000.000,00!");
        }
        System.out.printf("Memindai QRIS %s untuk pengguna %s... Sukses!%n", walletProvider, customerName);
        return new PaymentReceipt(generateTxId(), customerName, amount, getMethodName(), TransactionStatus.SUCCESS);
    }
}

// 8. Subclass Konkret 3: Kartu Kredit
final class CreditCardPayment extends BasePaymentMethod {
    private final String cardNumber;

    public CreditCardPayment(String cardNumber) {
        super("Credit Card");
        this.cardNumber = cardNumber;
    }

    @Override
    public PaymentReceipt process(String customerName, double amount) {
        if (!cardNumber.startsWith("4") && !cardNumber.startsWith("5")) {
            throw new PaymentFailedException("Kartu kredit tidak valid! Hanya menerima Visa / Mastercard.");
        }
        System.out.println("Otorisasi EDC Kartu Kredit... Disetujui!");
        return new PaymentReceipt(generateTxId(), customerName, amount, getMethodName(), TransactionStatus.SUCCESS);
    }
}

// 9. Main Application Gateway
public class PaymentGatewayApp {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("==================================================");
        System.out.println("      PAYMENT GATEWAY E-COMMERCE NUSANTARA        ");
        System.out.println("==================================================");

        System.out.print("Masukkan nama pelanggan : ");
        String customerName = scanner.nextLine().strip();

        System.out.print("Masukkan total belanja  : Rp ");
        double totalBelanja = Double.parseDouble(scanner.nextLine().strip());

        System.out.println("\nPilih Metode Pembayaran:");
        System.out.println("1. Transfer Bank BCA Virtual Account");
        System.out.println("2. QRIS GoPay / OVO E-Wallet");
        System.out.println("3. Kartu Kredit (Visa/Mastercard)");
        System.out.print("Pilihan (1/2/3): ");
        String pilihan = scanner.nextLine().strip();

        // Polimorfisme: Instansiasi objek konkret ke tipe referensi interface PaymentProcessor
        PaymentProcessor processor = switch (pilihan) {
            case "1" -> new BankTransferPayment("BCA", "88012399812");
            case "2" -> new EWalletPayment("GoPay");
            case "3" -> new CreditCardPayment("4111222233334444");
            default  -> null;
        };

        if (processor == null) {
            System.out.println("❌ Pilihan metode pembayaran tidak valid!");
            scanner.close();
            return;
        }

        try {
            System.out.println("\nMemproses transaksi di gateway...");
            // Dynamic Method Dispatch mengeksekusi method sesuai objek konkretnya
            PaymentReceipt receipt = processor.process(customerName, totalBelanja);
            receipt.print();
        } catch (PaymentFailedException e) {
            System.err.println("\n❌ TRANSAKSI GAGAL: " + e.getMessage());
        } finally {
            System.out.println("\nSesi transaksi gateway selesai.");
            scanner.close();
        }
    }
}
```

## Output Demonstrasi

```text
==================================================
      PAYMENT GATEWAY E-COMMERCE NUSANTARA        
==================================================
Masukkan nama pelanggan : Siti Nurhaliza
Masukkan total belanja  : Rp 350000

Pilih Metode Pembayaran:
1. Transfer Bank BCA Virtual Account
2. QRIS GoPay / OVO E-Wallet
3. Kartu Kredit (Visa/Mastercard)
Pilihan (1/2/3): 2

Memproses transaksi di gateway...
Memindai QRIS GoPay untuk pengguna Siti Nurhaliza... Sukses!

==================================================
            BUKTI PEMBAYARAN RESMI                
==================================================
ID Transaksi  : TX-A7B8C9D0
Nama Pembeli  : Siti Nurhaliza
Total Bayar   : Rp 350,000.00
Metode Bayar  : E-Wallet (GoPay)
Status        : SUCCESS (Transaksi Berhasil Diproses)
==================================================

Sesi transaksi gateway selesai.
```

---

<a id="bagian-37"></a>

# 37. 🔗 Referensi Resmi

- [Oracle Java Object-Oriented Programming Concepts](https://docs.oracle.com/javase/tutorial/java/concepts/)
- [Oracle Java Classes and Objects Tutorial](https://docs.oracle.com/javase/tutorial/java/javaOO/)
- [Java 21 Interfaces and Inheritance Specification](https://docs.oracle.com/javase/tutorial/java/IandI/)
- [Sealed Classes in Java 17+ Language Documentation](https://docs.oracle.com/en/java/javase/21/language/sealed-classes-and-interfaces.html)
