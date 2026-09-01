---
title: "Java Generic"
description: "Java Generics: generic class, generic method, bounded type parameters, wildcard types (? extends, ? super), dan type erasure."
order: 3
tags:
  - programming
  - java
  - generics
  - intermediate
---

# Java Generic

> **Target:** Pemula yang telah menguasai konsep dasar Java dan OOP, serta ingin memahami **Java Generic** secara mendalam dan type-safe untuk persiapan Collection Framework & Spring Boot.
>
> Fokus cheatsheet ini: **mental model type safety → generic class, pair & response → generic method & interface → bounded type parameters → invariant vs covariant → wildcards (?, extends, super) → prinsip PECS → generic records → type erasure & batasan generic → comparable/comparator → mini project generic repository**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami untuk membuat class, method, dan interface generic yang bersih dan bebas runtime error

🟡 Lanjutan
→ pelajari setelah menguasai generic dasar: bounded types, invariant, wildcards, dan prinsip PECS

🔴 Advanced / Operasional
→ penting untuk arsitektur library/framework: type erasure, generic restrictions, comparable, dan raw types
```

Mental model verifikasi Type Safety oleh Compiler vs Runtime Execution:

```text
       Source Code Generic (<T>, <K, V>)
                       │
                       ▼
           Java Compiler (javac)
      ┌────────────────┴────────────────┐
      ▼                                 ▼
 Type Checking Ketat             Type Erasure Process
(Cek Tipe saat Kompilasi)      (Hapus <T>, Ganti Object/Bound)
      │                                 │
      └────────────────┬────────────────┘
                       │
                       ▼
            Bytecode Bersih & Aman
         (Bebas ClassCastException)
                       │
                       ▼
                  JVM Runtime
```

**Hafalan:**

```text
Type Parameter → placeholder tipe data abstrak yang dideklarasikan dengan tanda kurung siku (seperti <T>, <E>, <K, V>)
Type Argument  → tipe data konkret yang diberikan saat instansiasi (seperti <String>, <Integer>, <User>)
Type Safety    → jaminan compiler bahwa tipe data yang masuk dan keluar selalu sesuai dan valid tanpa casting
PECS           → Producer Extends, Consumer Super (aturan memilih wildcard ? extends vs ? super)
Type Erasure   → mekanisme compiler menghapus informasi generic di bytecode demi backward compatibility
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Java Generic & Masalah Kode Non-Generic](#bagian-1)
2. [Generic Class dengan Parameter Tunggal (`<T>`)](#bagian-2)
3. [Generic Class dengan Multi-Parameter (`<K, V>`)](#bagian-3)
4. [Generic Method (`<T> returnType method(T param)`)](#bagian-4)
5. [Generic Constructor](#bagian-5)
6. [Generic Interface (`Repository<T, ID>`)](#bagian-6)

### 🟡 Lanjutan

7. [Bounded Type Parameter (Upper Bounded: `<T extends Number>`)](#bagian-7)
8. [Multiple Bounds Type Parameter (`<T extends A & B>`)](#bagian-8)
9. [Konsep Invariant pada Generic (Invariant vs Covariant)](#bagian-9)
10. [Wildcard Unbounded (`<?>`)](#bagian-10)
11. [Wildcard Upper Bounded (`<? extends T>`)](#bagian-11)
12. [Wildcard Lower Bounded (`<? super T>`)](#bagian-12)
13. [Prinsip PECS (Producer Extends, Consumer Super)](#bagian-13)
14. [Generic Record (Java 16+)](#bagian-14)

### 🔴 Advanced / Operasional

15. [Type Erasure di JVM & Bridge Method](#bagian-15)
16. [Batasan & Larangan pada Java Generic](#bagian-16)
17. [Raw Types & Anotasi `@SuppressWarnings("unchecked")`](#bagian-17)
18. [Comparable & Comparator Generic (`Comparable<T>`, `Comparator<T>`)](#bagian-18)

### 🛠️ Referensi & Praktik

19. [Peta Ingatan Cepat](#bagian-19)
20. [Tabel Ringkasan](#bagian-20)
21. [Cheat Code Java Generic 10 Detik](#bagian-21)
22. [Urutan Belajar yang Disarankan](#bagian-22)
23. [Mini Project: Generic In-Memory Repository & Paginated Data Store Engine CLI](#bagian-23)
24. [Referensi Resmi](#bagian-24)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan Java Generic & Masalah Kode Non-Generic

#### Konsep

Sebelum Java 5 memperkenalkan Generic, developer harus menggunakan tipe umum `Object` untuk membuat struktur data yang fleksibel. Pendekatan ini memiliki dua kelemahan fatal:
1. **Wajib Manual Casting:** Setiap kali mengambil data dari penampung, developer harus melakukan *explicit downcasting* `(String) data`.
2. **Bahaya `ClassCastException` saat Runtime:** Jika ada salah tipe data yang dimasukkan, compiler tidak akan memberikan peringatan apapun. Error baru meledak saat aplikasi sedang berjalan (*runtime crash*).

**Java Generic** menyelesaikan masalah ini dengan memindahkan verifikasi tipe data langsung ke **waktu kompilasi (*compile-time type safety*)** tanpa perlu casting manual.

#### Contoh

```java
// 1. Pendekatan Lama Tanpa Generic (Raw Object)
class NonGenericBox {
    private Object data;

    public void set(Object data) { this.data = data; }
    public Object get() { return this.data; }
}

// 2. Pendekatan Modern dengan Generic (<T>)
class GenericBox<T> {
    private T data;

    public void set(T data) { this.data = data; }
    public T get() { return this.data; }
}

public class GenericIntroDemo {
    public static void main(String[] args) {
        // Bahaya Pendekatan Lama:
        NonGenericBox oldBox = new NonGenericBox();
        oldBox.set("Teks Rahasia");
        oldBox.set(12345); // Tidak sengaja tertimpa angka integer

        // String teks = (String) oldBox.get(); // RUNTIME ERROR: ClassCastException!

        // Keamanan Pendekatan Generic:
        GenericBox<String> modernBox = new GenericBox<>();
        modernBox.set("Teks Aman");
        // modernBox.set(12345); // COMPILE ERROR: incompatible types: int cannot be converted to String

        String hasil = modernBox.get(); // Bebas casting manual!
        System.out.println("Data dari Generic Box: " + hasil);
    }
}
```

#### Output

```text
Data dari Generic Box: Teks Aman
```

#### Cara Kerja

```text
KODE NON-GENERIC (Object):
Input Data ──> Simpan sebagai Object ──> Ambil Data ──> Manual Cast (String) ──> Risiko Crash Runtime!

KODE GENERIC (<T>):
Input Data ──> Verifikasi Kompiler Tipe <String> ──> Ambil Data ──> Bebas Cast (Pasti String) ──> Aman 100%!
```

**Hafalan:**

```text
Type Safety → kepastian bahwa program bebas dari ClassCastException karena tipe dicek sebelum dijalankan
Generic     → parameterisasi tipe data yang memungkinkan class/method bekerja dinamis dengan tipe aman
```

---

<a id="bagian-2"></a>

## 2. 🟢 Generic Class dengan Parameter Tunggal (`<T>`)

#### Konsep

Generic Class adalah class yang mendeklarasikan satu atau lebih **Type Parameter** di samping nama class-nya menggunakan kurung siku (misal: `class Box<T>`).

Konvensi penamaan standar Type Parameter di Java:
- `T` : *Type* (Tipe data umum)
- `E` : *Element* (Elemen dalam struktur data / Collection)
- `K` : *Key* (Kunci dalam Map)
- `V` : *Value* (Nilai dalam Map)
- `N` : *Number* (Angka)

#### Contoh

```java
// Mendefinisikan Generic Class dengan Type Parameter <T>
public class WadahData<T> {
    private T konten;

    public WadahData(T konten) {
        this.konten = konten;
    }

    public void setKonten(T konten) {
        this.konten = konten;
    }

    public T getKonten() {
        return this.konten;
    }

    public void cetakTipe() {
        System.out.printf("Konten: %s (Tipe Asli: %s)%n", konten, konten.getClass().getSimpleName());
    }
}

class GenericClassDemo {
    public static void main(String[] args) {
        // Instansiasi dengan tipe String (Diamond Operator <>)
        WadahData<String> wadahTeks = new WadahData<>("Belajar Java Generic");
        wadahTeks.cetakTipe();

        // Instansiasi dengan tipe Integer
        WadahData<Integer> wadahAngka = new WadahData<>(2024);
        wadahAngka.cetakTipe();

        // Instansiasi dengan tipe Boolean
        WadahData<Boolean> wadahBool = new WadahData<>(true);
        wadahBool.cetakTipe();
    }
}
```

#### Output

```text
Konten: Belajar Java Generic (Tipe Asli: String)
Konten: 2024 (Tipe Asli: Integer)
Konten: true (Tipe Asli: Boolean)
```

#### Cara Kerja

```text
WadahData<String>   ──> Tipe T digantikan oleh String di konteks objek wadahTeks
WadahData<Integer>  ──> Tipe T digantikan oleh Integer di konteks objek wadahAngka
```

**Hafalan:**

```text
class ClassName<T> { ... }                  → mendeklarasikan class generic dengan type parameter T
ClassName<TargetType> obj = new ClassName<>(); → instansiasi objek generic dengan argumen tipe konkret
```

---

<a id="bagian-3"></a>

## 3. 🟢 Generic Class dengan Multi-Parameter (`<K, V>`)

#### Konsep

Class generic dapat menerima **lebih dari satu type parameter** yang dipisahkan dengan tanda koma (misal: `<K, V>` atau `<T, E, R>`).

Pola ini sangat sering digunakan dalam arsitektur backend untuk:
- Pasangan Kunci-Nilai (*Key-Value Pair*)
- Pembungkus Respon API (*API Response Wrapper* / DTO)
- Hasil Operasi Result/Either (`<Success, Error>`)

#### Contoh

```java
// Generic Pair Class dengan dua type parameter <K, V>
class Pasangan<K, V> {
    private final K kunci;
    private final V nilai;

    public Pasangan(K kunci, V nilai) {
        this.kunci = kunci;
        this.nilai = nilai;
    }

    public K getKunci() { return kunci; }
    public V getNilai() { return nilai; }

    @Override
    public String toString() {
        return "[" + kunci + " => " + nilai + "]";
    }
}

public class MultiGenericDemo {
    public static void main(String[] args) {
        // Pasangan String & Integer (Kode Produk & Stok)
        Pasangan<String, Integer> stokBarang = new Pasangan<>("PRD-001", 150);
        System.out.println("Stok: " + stokBarang);

        // Pasangan Integer & String (HTTP Status Code & Pesan)
        Pasangan<Integer, String> response = new Pasangan<>(200, "OK: Berhasil mengambil data.");
        System.out.println("Respon Server: " + response);

        // Akses type-safe tanpa casting
        String kode = stokBarang.getKunci();
        int jumlah = stokBarang.getNilai();
        System.out.printf("Kode: %s, Jumlah: %d unit.%n", kode, jumlah);
    }
}
```

#### Output

```text
Stok: [PRD-001 => 150]
Respon Server: [200 => OK: Berhasil mengambil data.]
Kode: PRD-001, Jumlah: 150 unit.
```

#### Cara Kerja

```text
new Pasangan<String, Integer>("PRD-001", 150)
                      │
                      ▼
Pasangan: [ K: String ("PRD-001")  |  V: Integer (150) ]
```

**Hafalan:**

```text
class ClassName<K, V> { ... } → mendefinisikan generic class dengan dua parameter tipe berbeda
```

---

<a id="bagian-4"></a>

## 4. 🟢 Generic Method (`<T> returnType method(T param)`)

#### Konsep

Generic Method adalah method yang mendeklarasikan **Type Parameter-nya sendiri** secara independen, terlepas dari apakah class pembungkusnya generic atau bukan.

Deklarasi `<T>` diletakkan **tepat sebelum tipe nilai balik (*return type*)** method:
`public static <T> void namaMethod(T param) { ... }`

#### Contoh

```java
public class GenericMethodDemo {
    // Generic Method: Menghitung total elemen dalam array tipe apapun
    public static <T> int hitungElemen(T[] array) {
        return array.length;
    }

    // Generic Method: Mengambil elemen pertama dari array
    public static <T> T ambilPertama(T[] array) {
        if (array == null || array.length == 0) {
            return null;
        }
        return array[0];
    }

    public static void main(String[] args) {
        String[] daftarNama = {"Ahmad", "Budi", "Citra"};
        Integer[] daftarAngka = {10, 20, 30, 40, 50};

        // Pemanggilan generic method (Tipe disimpulkan otomatis oleh compiler)
        int totalNama = hitungElemen(daftarNama);
        String namaPertama = ambilPertama(daftarNama);

        int totalAngka = hitungElemen(daftarAngka);
        Integer angkaPertama = ambilPertama(daftarAngka);

        System.out.printf("Array Nama : Total %d, Pertama: '%s'%n", totalNama, namaPertama);
        System.out.printf("Array Angka: Total %d, Pertama: %d%n", totalAngka, angkaPertama);
    }
}
```

#### Output

```text
Array Nama : Total 3, Pertama: 'Ahmad'
Array Angka: Total 5, Pertama: 10
```

#### Cara Kerja

```text
ambilPertama(daftarNama) ──> Compiler melihat tipe argumen String[] ──> T otomatis disimpulkan sebagai String
ambilPertama(daftarAngka)──> Compiler melihat tipe argumen Integer[]──> T otomatis disimpulkan sebagai Integer
```

**Hafalan:**

```text
public static <T> returnType methodName(T parameter) → mendeklarasikan generic method independen
```

---

<a id="bagian-5"></a>

## 5. 🟢 Generic Constructor

#### Konsep

Constructor pada class biasa (non-generic) maupun generic class dapat memiliki **Type Parameter-nya sendiri** yang terpisah dari type parameter class.

#### Contoh

```java
class LoggerEntry {
    private String deskripsi;

    // Generic Constructor pada class non-generic
    public <T> LoggerEntry(T payload) {
        this.deskripsi = String.format("Log [%s]: %s", payload.getClass().getSimpleName(), payload.toString());
    }

    public void cetakLog() {
        System.out.println(deskripsi);
    }
}

public class GenericConstructorDemo {
    public static void main(String[] args) {
        LoggerEntry log1 = new LoggerEntry("Transaksi Berhasil");
        LoggerEntry log2 = new LoggerEntry(500); // Menerima Integer
        LoggerEntry log3 = new LoggerEntry(true); // Menerima Boolean

        log1.cetakLog();
        log2.cetakLog();
        log3.cetakLog();
    }
}
```

#### Output

```text
Log [String]: Transaksi Berhasil
Log [Integer]: 500
Log [Boolean]: true
```

#### Cara Kerja

```text
new LoggerEntry(500) ──> Tipe constructor T otomatis menjadi Integer ──> Inisialisasi deskripsi
```

**Hafalan:**

```text
public <T> ClassName(T parameter) { ... } → mendefinisikan constructor dengan type parameter generic mandiri
```

---

<a id="bagian-6"></a>

## 6. 🟢 Generic Interface (`Repository<T, ID>`)

#### Konsep

Generic Interface mendefinisikan kontrak antarmuka yang fleksibel terhadap tipe data model yang akan diolahnya.

Pola ini adalah fondasi dari seluruh arsitektur **Data Access Layer / DAO / Repository Pattern** modern (seperti `JpaRepository<T, ID>` di Spring Data).

#### Contoh

```java
// Generic Interface Kontrak CRUD
interface GenericRepository<T, ID> {
    void simpan(T entitas);
    T cariBerdasarkanId(ID id);
    void hapus(ID id);
}

// Model Entitas Pengguna
class AkunUser {
    private String id;
    private String nama;

    public AkunUser(String id, String nama) {
        this.id = id;
        this.nama = nama;
    }

    public String getId() { return id; }
    public String getNama() { return nama; }

    @Override
    public String toString() { return "AkunUser{id='" + id + "', nama='" + nama + "'}"; }
}

// Implementasi Konkret untuk AkunUser dengan ID bertipe String
class UserMemoryRepository implements GenericRepository<AkunUser, String> {
    @Override
    public void simpan(AkunUser entitas) {
        System.out.println("Menyimpan ke memori: " + entitas);
    }

    @Override
    public AkunUser cariBerdasarkanId(String id) {
        return new AkunUser(id, "Budi Hartono");
    }

    @Override
    public void hapus(String id) {
        System.out.println("Menghapus user dengan ID: " + id);
    }
}

public class GenericInterfaceDemo {
    public static void main(String[] args) {
        GenericRepository<AkunUser, String> repo = new UserMemoryRepository();

        repo.simpan(new AkunUser("USR-01", "Budi Hartono"));
        AkunUser user = repo.cariBerdasarkanId("USR-01");
        System.out.println("Ditemukan: " + user);
        repo.hapus("USR-01");
    }
}
```

#### Output

```text
Menyimpan ke memori: AkunUser{id='USR-01', nama='Budi Hartono'}
Ditemukan: AkunUser{id='USR-01', nama='Budi Hartono'}
Menghapus user dengan ID: USR-01
```

#### Cara Kerja

```text
interface GenericRepository<T, ID>
                │
                ▼ implements <AkunUser, String>
class UserMemoryRepository:
- simpan(AkunUser entitas)
- cariBerdasarkanId(String id) -> AkunUser
```

**Hafalan:**

```text
interface InterfaceName<T, ID> { ... }                  → mendefinisikan kontrak interface generic
class ClassName implements InterfaceName<TypeA, TypeB>  → mengimplementasikan interface dengan tipe konkret
```

---

<a id="bagian-7"></a>

## 7. 🟡 Bounded Type Parameter (Upper Bounded: `<T extends Number>`)

#### Konsep

Secara default, parameter `<T>` dapat diisi oleh tipe data apapun (setara dengan turunan `Object`).

Jika kita ingin membatasi tipe data yang boleh digunakan hanya untuk class tertentu atau subclass turunannya, kita menggunakan **Bounded Type Parameter (Upper Bound)** dengan kata kunci `extends`:
`<T extends SuperClassOrInterface>`

Keuntungan Bounded Type:
- Mencegah tipe yang tidak relevan masuk saat kompilasi.
- Mengizinkan method milik `SuperClass` dipanggil langsung pada variabel `T`.

#### Contoh

```java
// Membatasi T hanya untuk turunan Number (Integer, Double, Float, Long)
class KalkulatorStatistik<T extends Number> {
    private T[] numbers;

    public KalkulatorStatistik(T[] numbers) {
        this.numbers = numbers;
    }

    public double hitungRataRata() {
        double total = 0.0;
        for (T num : numbers) {
            // Method doubleValue() dapat dipanggil karena T dijamin turunan Number
            total += num.doubleValue();
        }
        return total / numbers.length;
    }
}

public class BoundedTypeDemo {
    public static void main(String[] args) {
        Integer[] nilaiInt = {80, 90, 85, 95};
        KalkulatorStatistik<Integer> statInt = new KalkulatorStatistik<>(nilaiInt);
        System.out.printf("Rata-rata Nilai Int: %.2f%n", statInt.hitungRataRata());

        Double[] hargaDouble = {15000.5, 25000.0, 10000.75};
        KalkulatorStatistik<Double> statDouble = new KalkulatorStatistik<>(hargaDouble);
        System.out.printf("Rata-rata Harga    : Rp %,.2f%n", statDouble.hitungRataRata());

        // String[] teks = {"A", "B"};
        // KalkulatorStatistik<String> errorStat = new KalkulatorStatistik<>(teks);
        // COMPILE ERROR: type argument String is not within bounds of type-variable T
    }
}
```

#### Output

```text
Rata-rata Nilai Int: 87.50
Rata-rata Harga    : Rp 16,667.08
```

#### Cara Kerja

```text
<T extends Number>
         │
         ├──> Integer, Double, Float, Long  [DIIZINKAN]
         └──> String, Boolean, CustomClass  [DITOLAK KOMPILER]
```

**Hafalan:**

```text
<T extends SuperType> → membatasi type parameter T hanya untuk SuperType atau class turunannya
```

---

<a id="bagian-8"></a>

## 8. 🟡 Multiple Bounds Type Parameter (`<T extends A & B>`)

#### Konsep

Java memungkinkan Type Parameter dibatasi oleh **lebih dari satu batasan tipe** (*Multiple Bounds*) menggunakan tanda ampersand (`&`):
`<T extends ClassA & InterfaceB & InterfaceC>`

Aturan baku Multiple Bounds:
1. Jika ada satu batasan berupa `Class`, **posisinya wajib ditulis paling awal**.
2. Batasan berikutnya harus berupa `Interface`.
3. Java tidak mengizinkan lebih dari satu class pada multiple bounds (karena aturan single inheritance).

#### Contoh

```java
interface Bernama {
    String getNama();
}

// Bounded Type yang mewarisi class Number dan mengimplementasikan interface Bernama
// (Sebagai contoh kita buat class sendiri)
abstract class RekeningBase {
    public abstract double getSaldo();
}

class RekeningNasabah extends RekeningBase implements Bernama {
    private String nama;
    private double saldo;

    public RekeningNasabah(String nama, double saldo) {
        this.nama = nama;
        this.saldo = saldo;
    }

    @Override public String getNama() { return nama; }
    @Override public double getSaldo() { return saldo; }
}

public class MultipleBoundsDemo {
    // T wajib merupakan turunan RekeningBase DAN mengimplementasikan Bernama
    public static <T extends RekeningBase & Bernama> void cetakProfilRekening(T rekening) {
        System.out.printf("Pemilik: %s | Saldo: Rp %,.2f%n", rekening.getNama(), rekening.getSaldo());
    }

    public static void main(String[] args) {
        RekeningNasabah nasabah = new RekeningNasabah("Dewi Lestari", 7_500_000);
        cetakProfilRekening(nasabah);
    }
}
```

#### Output

```text
Pemilik: Dewi Lestari | Saldo: Rp 7,500,000.00
```

#### Cara Kerja

```text
Parameter T wajib lolos 2 syarat:
1. instanceof RekeningBase == true
2. instanceof Bernama == true
```

**Hafalan:**

```text
<T extends SuperClass & InterfaceA & InterfaceB> → mensyaratkan T memenuhi satu class dan banyak interface
```

---

<a id="bagian-9"></a>

## 9. 🟡 Konsep Invariant pada Generic (Invariant vs Covariant)

#### Konsep

Dalam pewarisan objek biasa di Java:
`Integer` adalah subclass dari `Number` $\rightarrow$ `Number num = Integer.valueOf(10);` (Polymorphic / Covariant).

Namun, pada **Java Generic**, perilakunya bersifat **INVARIANT**:
`WadahData<Integer>` **BUKAN MERUPAKAN SUBCLASS** dari `WadahData<Number>`!

Mengapa Java mendesain Generic bersifat Invariant?
Untuk **mencegah Heap Pollution** dan menjaga Type Safety. Jika diizinkan, kita bisa memasukkan `Double` ke dalam `WadahData<Number>` yang sebenarnya menyimpan `Integer`, sehingga memicu runtime crash.

#### Contoh

```java
public class InvariantDemo {
    public static void prosesWadahNumber(WadahData<Number> wadah) {
        wadah.setKonten(99.99); // Memasukkan Double
    }

    public static void main(String[] args) {
        WadahData<Integer> wadahInt = new WadahData<>(100);

        // Baris berikut ini TIDAK BISA DIKOMPILASI (Invariant Protection):
        // prosesWadahNumber(wadahInt);
        // COMPILE ERROR: incompatible types: WadahData<Integer> cannot be converted to WadahData<Number>

        System.out.println("Generic bersifat Invariant demi melindungi Type Safety!");
    }
}
```

#### Output

```text
Generic bersifat Invariant demi melindungi Type Safety!
```

#### Cara Kerja

```text
Hubungan Pewarisan Biasa:
Integer ──(is-a)──> Number   [VALID]

Hubungan Generic (Invariant):
Box<Integer> ──(Bukan Subclass)──X──> Box<Number>   [DILARANG]
```

**Hafalan:**

```text
Invariant → Box<Child> bukan merupakan turunan dari Box<Parent> meskipun Child turunan dari Parent
```

---

<a id="bagian-10"></a>

## 10. 🟡 Wildcard Unbounded (`<?>`)

#### Konsep

Karena generic bersifat invariant, kita tidak bisa mengoper `Box<String>` atau `Box<Integer>` ke method yang menerima `Box<Object>`.

Solusinya adalah menggunakan **Wildcard Unbounded** yang dilambangkan dengan tanda tanya (`<?>`), yang berarti *"Wadah bertipe apapun yang tidak diketahui secara pasti"*.

> [!WARNING]
> Struktur data dengan `<?>` bersifat **Read-Only / Safe for Reading** sebagai tipe `Object`. Anda **tidak boleh menambahkan/menulis data baru** ke dalamnya (kecuali nilai `null`).

#### Contoh

```java
public class UnboundedWildcardDemo {
    // Menerima WadahData dengan tipe parameter apapun
    public static void cetakIsiWadah(WadahData<?> wadah) {
        // Membaca data aman sebagai tipe Object
        Object isi = wadah.getKonten();
        System.out.println("Isi Wadah (?): " + isi);

        // wadah.setKonten("Teks Baru"); // COMPILE ERROR: cannot capture <?>
    }

    public static void main(String[] args) {
        WadahData<String> w1 = new WadahData<>("Halo Dunia");
        WadahData<Integer> w2 = new WadahData<>(500);
        WadahData<Boolean> w3 = new WadahData<>(true);

        // Semua tipe wadah generic dapat diterima!
        cetakIsiWadah(w1);
        cetakIsiWadah(w2);
        cetakIsiWadah(w3);
    }
}
```

#### Output

```text
Isi Wadah (?): Halo Dunia
Isi Wadah (?): 500
Isi Wadah (?): true
```

#### Cara Kerja

```text
cetakIsiWadah(WadahData<?> wadah)
       ├──> Menerima WadahData<String>   [OK]
       ├──> Menerima WadahData<Integer>  [OK]
       └──> Menerima WadahData<Custom>   [OK]
```

**Hafalan:**

```text
ClassName<?> variable → wildcard unbounded menerima tipe generic apapun untuk operasi baca aman
```

---

<a id="bagian-11"></a>

## 11. 🟡 Wildcard Upper Bounded (`<? extends T>`)

#### Konsep

**Upper Bounded Wildcard** (`<? extends T>`) membatasi tipe wildcard hanya untuk tipe `T` atau class-class turunannya.

Karakteristik utama `<? extends T>`:
- **Digunakan untuk MEMBACA data (Read Only / Producer):** Kita dijamin mendapatkan data yang minimal bertipe `T`.
- **DILARANG MENULIS data baru:** Compiler menolak penambahan data baru karena compiler tidak tahu pasti tipe turunan konkret apa yang sedang aktif di dalam struktur data tersebut.

#### Contoh

```java
import java.util.List;

public class UpperBoundedWildcardDemo {
    // Menerima List berisi Number atau subclass-nya (Integer, Double, Float, dll.)
    public static double hitungTotal(List<? extends Number> listAngka) {
        double total = 0.0;
        for (Number num : listAngka) {
            total += num.doubleValue(); // Aman membaca sebagai Number
        }

        // listAngka.add(10); // COMPILE ERROR: tidak boleh menambah data pada ? extends!
        return total;
    }

    public static void main(String[] args) {
        List<Integer> listInt = List.of(10, 20, 30);
        List<Double> listDouble = List.of(1.5, 2.5, 3.5);

        System.out.println("Total List Integer: " + hitungTotal(listInt));
        System.out.println("Total List Double : " + hitungTotal(listDouble));
    }
}
```

#### Output

```text
Total List Integer: 60.0
Total List Double : 7.5
```

#### Cara Kerja

```text
List<? extends Number>
         │
         ├──> List<Integer> [Diterima - Baca sebagai Number]
         ├──> List<Double>  [Diterima - Baca sebagai Number]
         └──> Menambah Data ──X──> Ditolak Compiler (Read-Only)
```

**Hafalan:**

```text
<? extends SuperType> → upper bounded wildcard untuk membaca data dari hierarki class turunan
```

---

<a id="bagian-12"></a>

## 12. 🟡 Wildcard Lower Bounded (`<? super T>`)

#### Konsep

**Lower Bounded Wildcard** (`<? super T>`) membatasi tipe wildcard hanya untuk tipe `T` atau superclass induk di atasnya (sampai dengan `Object`).

Karakteristik utama `<? super T>`:
- **Digunakan untuk MENULIS / MENAMPUNG data (Write / Consumer):** Kita dijamin aman memasukkan objek bertipe `T` (atau subclass-nya) ke dalam koleksi tersebut.

#### Contoh

```java
import java.util.ArrayList;
import java.util.List;

public class LowerBoundedWildcardDemo {
    // Menerima List bertipe Integer atau Superclass-nya (Number, Object)
    public static void tambahkanAngka(List<? super Integer> listTujuan) {
        listTujuan.add(100);
        listTujuan.add(200);
        listTujuan.add(300);
        System.out.println("Berhasil menambahkan 3 angka integer ke list tujuan.");
    }

    public static void main(String[] args) {
        List<Integer> listInt = new ArrayList<>();
        List<Number> listNum = new ArrayList<>();
        List<Object> listObj = new ArrayList<>();

        tambahkanAngka(listInt); // Integer super Integer -> OK
        tambahkanAngka(listNum); // Number super Integer  -> OK
        tambahkanAngka(listObj); // Object super Integer  -> OK

        System.out.println("List Number: " + listNum);
        System.out.println("List Object: " + listObj);
    }
}
```

#### Output

```text
Berhasil menambahkan 3 angka integer ke list tujuan.
Berhasil menambahkan 3 angka integer ke list tujuan.
Berhasil menambahkan 3 angka integer ke list tujuan.
List Number: [100, 200, 300]
List Object: [100, 200, 300]
```

#### Cara Kerja

```text
List<? super Integer>
         ├──> List<Integer>  ──> list.add(Integer) [AMAN]
         ├──> List<Number>   ──> list.add(Integer) [AMAN (Integer is a Number)]
         └──> List<Object>   ──> list.add(Integer) [AMAN (Integer is an Object)]
```

**Hafalan:**

```text
<? super SubType> → lower bounded wildcard untuk menulis/memasukkan data SubType ke koleksi penampung
```

---

<a id="bagian-13"></a>

## 13. 🟡 Prinsip PECS (Producer Extends, Consumer Super)

#### Konsep

**PECS** adalah singkatan dari:
- **Producer Extends:** Jika parameter generic bertindak sebagai **penghasil/penyedia data** yang akan dibaca oleh method Anda $\rightarrow$ gunakan `<? extends T>`.
- **Consumer Super:** Jika parameter generic bertindak sebagai **penampung/penerima data** yang akan ditulis/dimasukkan oleh method Anda $\rightarrow$ gunakan `<? super T>`.

Prinsip ini dirumuskan oleh *Joshua Bloch* (penulis buku *Effective Java*) sebagai panduan arsitektur library Java standar.

#### Contoh

```java
import java.util.ArrayList;
import java.util.List;

public class PecsDemo {
    // Menyalin data dari sumber (Producer) ke tujuan (Consumer)
    public static <T> void salinData(List<? extends T> source, List<? super T> destination) {
        for (T item : source) {      // source adalah Producer (hanya dibaca)
            destination.add(item);   // destination adalah Consumer (hanya ditulis)
        }
    }

    public static void main(String[] args) {
        List<Integer> sumberInt = List.of(1, 2, 3, 4, 5);
        List<Number> targetNumber = new ArrayList<>();

        // Menyalin List<Integer> (subclass) ke List<Number> (superclass) dengan sempurna!
        salinData(sumberInt, targetNumber);

        System.out.println("Hasil Salin PECS: " + targetNumber);
    }
}
```

#### Output

```text
Hasil Salin PECS: [1, 2, 3, 4, 5]
```

#### Cara Kerja

```text
List<? extends T> source (PRODUCER)  ──>  item = source.get()
                                                │
                                                ▼
List<? super T> destination (CONSUMER) ──> destination.add(item)
```

**Hafalan:**

```text
Producer Extends → gunakan <? extends T> jika hanya membaca data dari parameter
Consumer Super   → gunakan <? super T> jika hanya menulis data ke dalam parameter
```

---

<a id="bagian-14"></a>

## 14. 🟡 Generic Record (Java 16+)

#### Konsep

Sejak **Java 16**, tipe `record` (immutable data carrier) mendukung deklarasi Type Parameter generic.

Pola ini merupakan standar industri modern untuk membungkus **Standard API Response DTO** pada aplikasi RESTful API (seperti Spring Boot) yang rapi, ringkas, dan type-safe.

#### Contoh

```java
// Standard API Response Record Generic
public record ApiResponse<T>(
    boolean success,
    String message,
    T data,
    long timestamp
) {
    // Static Helper Factory Method: Sukses
    public static <T> ApiResponse<T> sukses(T data, String pesan) {
        return new ApiResponse<>(true, pesan, data, System.currentTimeMillis());
    }

    // Static Helper Factory Method: Gagal
    public static <T> ApiResponse<T> gagal(String pesan) {
        return new ApiResponse<>(false, pesan, null, System.currentTimeMillis());
    }
}

class RecordGenericDemo {
    public static void main(String[] args) {
        // Respon data String
        ApiResponse<String> res1 = ApiResponse.sukses("Token-JWT-12345", "Login berhasil.");
        System.out.println("Respon 1: " + res1);

        // Respon data Integer
        ApiResponse<Integer> res2 = ApiResponse.sukses(500000, "Saldo berhasil dimuat.");
        System.out.printf("Status: %b | Data: %d | Pesan: %s%n", res2.success(), res2.data(), res2.message());

        // Respon Gagal
        ApiResponse<Void> resError = ApiResponse.gagal("User tidak ditemukan!");
        System.out.println("Respon Error: " + resError);
    }
}
```

#### Output

```text
Respon 1: ApiResponse[success=true, message=Login berhasil., data=Token-JWT-12345, timestamp=1724930000000]
Status: true | Data: 500000 | Pesan: Saldo berhasil dimuat.
Respon Error: ApiResponse[success=false, message=User tidak ditemukan!, data=null, timestamp=1724930000000]
```

#### Cara Kerja

```text
ApiResponse<UserDTO> ──> data() otomatis bertipe UserDTO tanpa casting
```

**Hafalan:**

```text
public record RecordName<T>(T data, String message) {} → membuat DTO immutable generic yang ringkas dan type-safe
```

---

<a id="bagian-15"></a>

## 15. 🔴 Type Erasure di JVM & Bridge Method

#### Konsep

Java Generic diimplementasikan menggunakan konsep **Type Erasure** demi menjaga kompatibilitas dengan versi Java lama sebelum Java 5 (*Backward Compatibility*).

Apa yang terjadi saat proses kompilasi (*compile-time* $\rightarrow$ *bytecode*)?
1. Seluruh type parameter `<T>` **dihapus dan digantikan oleh `Object`** (atau tipe batasnya jika menggunakan `<T extends Number>`).
2. Compiler menyisipkan instruksi casting bytecode otomatis di titik pemanggilan.
3. Compiler menciptakan **Bridge Method** jika diperlukan untuk menjaga polimorfisme pada generic overriding.

Akibatnya, **pada saat runtime JVM berjalan, informasi `<T>` sudah tidak ada lagi di memori objek**.

#### Contoh

Perbandingan Kode Sumber Java vs Hasil Bytecode setelah Type Erasure:

```java
// 1. Kode yang Anda Tulis:
public class Box<T extends Number> {
    private T data;
    public void set(T data) { this.data = data; }
    public T get() { return this.data; }
}

// 2. Kode yang Dihasilkan Compiler di Bytecode (.class):
/*
public class Box {
    private Number data; // T diganti menjadi tipe batasnya (Number)
    public void set(Number data) { this.data = data; }
    public Number get() { return this.data; }
}
*/
```

#### Cara Kerja

```text
Kode Sumber: Box<String> box = new Box<>(); box.set("Halo"); String s = box.get();
                     │
                     ▼ (Type Erasure oleh javac)
Bytecode:    Box box = new Box(); box.set("Halo"); String s = (String) box.get();
```

**Hafalan:**

```text
Type Erasure → proses compiler menghapus seluruh kurung <T> di bytecode dan menggantinya dengan Object/Bound
```

---

<a id="bagian-16"></a>

## 16. 🔴 Batasan & Larangan pada Java Generic

#### Konsep

Karena adanya mekanisme *Type Erasure*, terdapat beberapa batasan fundamental yang **DILARANG** dalam penulisan Java Generic:

| # | Larangan | Alasan Teknis | Solusi yang Benar |
|---|---|---|---|
| 1 | Tidak bisa instansiasi parameter tipe: `new T()` ❌ | Tipe `T` tidak diketahui saat runtime | Lewatkan `Supplier<T>` atau `Class<T>` |
| 2 | Tidak bisa tipe data primitif: `Box<int>` ❌ | Primitif bukan turunan `Object` | Gunakan Wrapper: `Box<Integer>` |
| 3 | Tidak bisa `static field` bertipe `T` ❌ | Field static dibagi bersama untuk semua instance | Buat field non-static |
| 4 | Tidak bisa `instanceof` bertipe generic: `x instanceof Box<String>` ❌ | Tipe `<String>` hilang saat runtime | Gunakan wildcard: `x instanceof Box<?>` |
| 5 | Tidak bisa membuat generic array: `new T[10]` ❌ | Array butuh informasi tipe konkret di runtime | Gunakan `(T[]) new Object[size]` atau `List<T>` |
| 6 | Tidak bisa generic Exception: `class MyEx<T> extends Exception` ❌ | JVM tidak bisa menangkap generic catch | Buat class exception biasa |

#### Contoh

```java
import java.util.function.Supplier;

public class GenericRestrictionsDemo<T> {
    // 1. DILARANG: private static T staticData; ❌

    // 2. Solusi membuat instance T menggunakan Factory Supplier:
    public static <T> T buatInstance(Supplier<T> supplier) {
        return supplier.get(); // ✅ Solusi benar
    }

    public static void main(String[] args) {
        // Box<int> boxPrimitif; // ❌ DILARANG
        WadahData<Integer> boxWrapper = new WadahData<>(100); // ✅ Benar

        String instanceBaru = buatInstance(String::new);
        System.out.println("Instance string baru via Supplier berhasil dibuat.");
    }
}
```

#### Output

```text
Instance string baru via Supplier berhasil dibuat.
```

---

<a id="bagian-17"></a>

## 17. 🔴 Raw Types & Anotasi `@SuppressWarnings("unchecked")`

#### Konsep

**Raw Type** adalah penggunaan generic class tanpa menyertakan Type Argument (misal: menulis `WadahData` alih-alih `WadahData<String>`).

Penggunaan Raw Type sangat **TIDAK DIREKOMENDASIKAN** karena mematikan fitur type safety dan mengembalikan kode ke era Java lama yang rawan error.

Jika Anda terpaksa berinteraksi dengan library warisan (*legacy code*) yang menghasilkan peringatan *unchecked warning*, Anda dapat membungkam peringatan compiler secara terkontrol menggunakan anotasi `@SuppressWarnings("unchecked")`.

#### Contoh

```java
public class RawTypeDemo {
    // Menutup warning unchecked secara lokal pada method tertentu
    @SuppressWarnings("unchecked")
    public static <T> T[] buatArrayGeneric(int ukuran) {
        // Casting Object[] ke T[] memicu unchecked cast warning
        return (T[]) new Object[ukuran];
    }

    public static void main(String[] args) {
        // ❌ Raw Type (Menghasilkan warning kompilasi)
        WadahData rawBox = new WadahData("Teks Raw");
        rawBox.set(12345); // Compiler tidak bisa memvalidasi tipe data!

        String[] arrayBaru = buatArrayGeneric(5);
        System.out.println("Array generic kapasitas: " + arrayBaru.length);
    }
}
```

#### Output

```text
Array generic kapasitas: 5
```

#### Best Practice

- **Haramkan penggunaan Raw Type** pada kode baru.
- Batasi lingkup `@SuppressWarnings("unchecked")` sesempit mungkin (hanya pada satu baris variabel atau satu method kecil).

---

<a id="bagian-18"></a>

## 18. 🔴 Comparable & Comparator Generic (`Comparable<T>`, `Comparator<T>`)

#### Konsep

Untuk melakukan pengurutan data objek generic (*sorting*), Java menyediakan dua interface generic standar:
1. **`Comparable<T>` (Natural Ordering):** Diimplementasikan langsung oleh class objek tersebut dengan meng-override method `compareTo(T other)`.
2. **`Comparator<T>` (Custom Sorting):** Dibuat sebagai class / lambda terpisah untuk mendefinisikan berbagai variasi aturan pengurutan yang berbeda-beda.

#### Contoh

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

// 1. Mengimplementasikan Comparable<ProdukItem>
class ProdukItem implements Comparable<ProdukItem> {
    private String nama;
    private double harga;

    public ProdukItem(String nama, double harga) {
        this.nama = nama;
        this.harga = harga;
    }

    public String getNama() { return nama; }
    public double getHarga() { return harga; }

    // Natural sort: Urutkan berdasarkan harga termurah
    @Override
    public int compareTo(ProdukItem other) {
        return Double.compare(this.harga, other.harga);
    }

    @Override
    public String toString() {
        return String.format("%s (Rp %,.2f)", nama, harga);
    }
}

public class ComparableGenericDemo {
    public static void main(String[] args) {
        List<ProdukItem> daftar = new ArrayList<>();
        daftar.add(new ProdukItem("Laptop Gaming", 15_000_000));
        daftar.add(new ProdukItem("Mouse Pad", 50_000));
        daftar.add(new ProdukItem("Keyboard Mekanikal", 650_000));

        // 1. Natural Sort via Comparable (Berdasarkan Harga)
        Collections.sort(daftar);
        System.out.println("Urut Harga (Natural Sort):");
        for (ProdukItem p : daftar) System.out.println("- " + p);

        // 2. Custom Sort via Comparator Generic (Berdasarkan Nama A-Z)
        daftar.sort(Comparator.comparing(ProdukItem::getNama));
        System.out.println("\nUrut Nama A-Z (Comparator):");
        for (ProdukItem p : daftar) System.out.println("- " + p);
    }
}
```

#### Output

```text
Urut Harga (Natural Sort):
- Mouse Pad (Rp 50,000.00)
- Keyboard Mekanikal (Rp 650,000.00)
- Laptop Gaming (Rp 15,000,000.00)

Urut Nama A-Z (Comparator):
- Keyboard Mekanikal (Rp 650,000.00)
- Laptop Gaming (Rp 15,000,000.00)
- Mouse Pad (Rp 50,000.00)
```

#### Cara Kerja

```text
compareTo(other):
Nilai Negatif (< 0) ──> Objek ini lebih kecil dari other
Nilai Nol (== 0)     ──> Objek ini sama dengan other
Nilai Positif (> 0) ──> Objek ini lebih besar dari other
```

**Hafalan:**

```text
public int compareTo(T other)          → method perbandingan natural ordering antar objek sejenis
Comparator.comparing(Class::getField)  → membuat comparator instan berbasis getter field objek
```

---

<a id="bagian-19"></a>

## 19. 🛠️ Peta Ingatan Cepat

```text
                           PETA ARSITEKTUR JAVA GENERIC
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
  DEKLARASI GENERIK               BOUNDED & INVARIANT             WILDCARDS & PECS
  ├─ class Box<T>                 ├─ <T extends Number>           ├─ <?> (Unbounded Read)
  ├─ class Pair<K, V>             ├─ <T extends A & B>            ├─ <? extends T> (Producer/Read)
  ├─ <T> T method(T p)            ├─ Invariant: Box<A> ≠ Box<B>   ├─ <? super T> (Consumer/Write)
  └─ record Res<T>(T d)           └─ Type Erasure (javac bytecode)└─ PECS Rule (Effective Java)
```

---

<a id="bagian-20"></a>

## 20. 📚 Tabel Ringkasan

| Konsep / Fitur | Sintaks Utama | Fungsi & Kegunaan |
|---|---|---|
| Generic Class | `class Box<T> { ... }` | Cetak biru class fleksibel dengan type parameter |
| Multi Parameter | `class Pair<K, V> { ... }` | Menampung kombinasi dua tipe data (Key & Value) |
| Generic Method | `public static <T> T name(T p)` | Method dengan type parameter independen |
| Generic Interface | `interface Repo<T, ID> { ... }` | Kontrak antarmuka generic untuk Repository pattern |
| Upper Bound | `<T extends Number>` | Membatasi tipe hanya untuk subclass Number |
| Multiple Bounds | `<T extends ClassA & InterfaceB>` | Mensyaratkan turunan satu class dan interface |
| Invariant | `Box<Integer>` $\neq$ `Box<Number>` | Karakteristik ketat pencegah polusi heap memori |
| Unbounded Wildcard | `Box<?>` | Menerima tipe generic apapun untuk operasi baca umum |
| Producer Wildcard | `List<? extends T>` | Wildcard untuk membaca data dari hierarki turunan |
| Consumer Wildcard | `List<? super T>` | Wildcard untuk menulis/menambah data ke penampung |
| Aturan Emas | **PECS** | Producer Extends, Consumer Super |
| Generic Record | `record Response<T>(T data) {}` | DTO immutable response API ringkas & type-safe |
| Type Erasure | Penghapusan `<T>` ke `Object` | Mekanisme compiler menjaga kompatibilitas runtime |
| Suppress Warning | `@SuppressWarnings("unchecked")` | Membungkam peringatan unchecked cast compiler |

---

<a id="bagian-21"></a>

## 21. ⚡ Cheat Code Java Generic 10 Detik

```java
// 1. Generic Box Sederhana
public class Box<T> {
    private T item;
    public void set(T item) { this.item = item; }
    public T get() { return item; }
}

// 2. Generic Method Cepat
public static <T> T getFirst(List<T> list) {
    return list.isEmpty() ? null : list.get(0);
}

// 3. PECS Helper Pattern
public static <T> void copy(List<? extends T> src, List<? super T> dest) {
    dest.addAll(src);
}

// 4. Modern Generic Record Response
public record Result<T>(boolean ok, T value, String error) {}
```

---

<a id="bagian-22"></a>

## 22. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Fundamental Type Safety & Generic Class
├── Pahami bahaya ClassCastException pada Object lama
├── Buat Generic Class tunggal (<T>) dan ganda (<K, V>)
└── Buat Generic Method independen dan Generic Interface
       │
       ▼
Langkah 2: Bounded Types & Wildcards Mastery
├── Batasi tipe angka dengan <T extends Number>
├── Pahami mengapa generic bersifat Invariant
└── Kuasai aturan PECS (Producer Extends, Consumer Super)
       │
       ▼
Langkah 3: Fitur Modern & JVM Internals
├── Manfaatkan Generic Record untuk API DTO (Java 16+)
├── Pahami Type Erasure & batasan teknis generic di Java
└── Terapkan Comparable<T> dan Comparator<T>
       │
       ▼
Langkah 4: Siap Melangkah ke Java Collection Framework & Spring Data JPA!
```

---

<a id="bagian-23"></a>

## 23. 🏗️ Mini Project: Generic In-Memory Repository & Paginated Data Store Engine CLI

Aplikasi nyata backend data store engine generik yang mengimplementasikan **Generic Interface, Bounded Type Parameter, Generic Record, Predicate Filtering, PECS, dan Pagination DTO** yang siap pakai untuk arsitektur backend.

```java
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;

// 1. Interface Kontrak untuk Seluruh Entitas yang Memiliki ID
interface Identifiable<ID> {
    ID getId();
}

// 2. Generic Record untuk Pembungkus Hasil Pagination
record Page<T>(List<T> content, int pageNumber, int pageSize, int totalElements) {
    public int totalPages() {
        return (int) Math.ceil((double) totalElements / pageSize);
    }
}

// 3. Generic Repository Interface
interface DataRepository<T extends Identifiable<ID>, ID> {
    void save(T entity);
    Optional<T> findById(ID id);
    List<T> findAll();
    List<T> findBy(Predicate<? super T> filter); // Consumer Super Predicate
    Page<T> findPaginated(int page, int size);
    boolean deleteById(ID id);
    int count();
}

// 4. Implementasi Generic In-Memory Data Repository
class InMemoryRepository<T extends Identifiable<ID>, ID> implements DataRepository<T, ID> {
    private final List<T> storage = new ArrayList<>();

    @Override
    public void save(T entity) {
        // Jika ID sudah ada, replace (Update), jika belum ada, add (Create)
        deleteById(entity.getId());
        storage.add(entity);
    }

    @Override
    public Optional<T> findById(ID id) {
        for (T item : storage) {
            if (item.getId().equals(id)) {
                return Optional.of(item);
            }
        }
        return Optional.empty();
    }

    @Override
    public List<T> findAll() {
        return new ArrayList<>(storage); // Return salinan data aman
    }

    @Override
    public List<T> findBy(Predicate<? super T> filter) {
        List<T> results = new ArrayList<>();
        for (T item : storage) {
            if (filter.test(item)) {
                results.add(item);
            }
        }
        return results;
    }

    @Override
    public Page<T> findPaginated(int page, int size) {
        int fromIndex = (page - 1) * size;
        if (fromIndex >= storage.size() || fromIndex < 0) {
            return new Page<>(List.of(), page, size, storage.size());
        }
        int toIndex = Math.min(fromIndex + size, storage.size());
        List<T> pagedList = storage.subList(fromIndex, toIndex);
        return new Page<>(pagedList, page, size, storage.size());
    }

    @Override
    public boolean deleteById(ID id) {
        return storage.removeIf(item -> item.getId().equals(id));
    }

    @Override
    public int count() {
        return storage.size();
    }
}

// 5. Model Entitas 1: Produk (ID: String)
record ProdukEntity(String id, String nama, double harga, String kategori) implements Identifiable<String> {
    @Override public String getId() { return id; }
}

// 6. Model Entitas 2: Customer (ID: Long)
record CustomerEntity(Long id, String username, String email) implements Identifiable<Long> {
    @Override public Long getId() { return id; }
}

// 7. Main Application Demo
public class GenericEngineApp {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("   GENERIC IN-MEMORY DATA STORE ENGINE RUNTIME    ");
        System.out.println("==================================================");

        // Instansiasi Repository untuk Produk (Type: ProdukEntity, ID: String)
        DataRepository<ProdukEntity, String> produkRepo = new InMemoryRepository<>();

        // Seeding Data Produk
        produkRepo.save(new ProdukEntity("PRD-01", "MacBook Pro M3", 28_000_000, "LAPTOP"));
        produkRepo.save(new ProdukEntity("PRD-02", "Mechanical Keyboard", 1_200_000, "AKSESORIS"));
        produkRepo.save(new ProdukEntity("PRD-03", "Dell UltraSharp Monitor", 6_500_000, "MONITOR"));
        produkRepo.save(new ProdukEntity("PRD-04", "Wireless Mouse Logitech", 450_000, "AKSESORIS"));
        produkRepo.save(new ProdukEntity("PRD-05", "ThinkPad X1 Carbon", 24_000_000, "LAPTOP"));

        System.out.printf("Total Produk di Data Store: %d item%n%n", produkRepo.count());

        // 1. Cari Berdasarkan ID
        System.out.println("--- 1. Pencarian findById('PRD-03') ---");
        Optional<ProdukEntity> optProduk = produkRepo.findById("PRD-03");
        optProduk.ifPresent(p -> System.out.printf("Ditemukan: %s | Harga: Rp %,.2f%n", p.nama(), p.harga()));

        // 2. Query Filter Generic (Kategori == LAPTOP)
        System.out.println("\n--- 2. Query Filter Kategori 'LAPTOP' ---");
        List<ProdukEntity> laptops = produkRepo.findBy(p -> "LAPTOP".equals(p.kategori()));
        for (ProdukEntity laptop : laptops) {
            System.out.printf("- %s (Rp %,.2f)%n", laptop.nama(), laptop.harga());
        }

        // 3. Paginated Query (Page 1, Size 2)
        System.out.println("\n--- 3. Pagination Data (Page 1, Size 2) ---");
        Page<ProdukEntity> page1 = produkRepo.findPaginated(1, 2);
        System.out.printf("Halaman %d dari %d (Total Data: %d):%n", page1.pageNumber(), page1.totalPages(), page1.totalElements());
        for (ProdukEntity p : page1.content()) {
            System.out.printf("  [%s] %s%n", p.id(), p.nama());
        }

        // 4. Instansiasi Repository untuk Customer (Type: CustomerEntity, ID: Long)
        System.out.println("\n--- 4. Data Store CustomerEntity (ID: Long) ---");
        DataRepository<CustomerEntity, Long> customerRepo = new InMemoryRepository<>();
        customerRepo.save(new CustomerEntity(1001L, "alimurrofid", "ali@dev.com"));
        customerRepo.save(new CustomerEntity(1002L, "budi_santoso", "budi@dev.com"));

        for (CustomerEntity cust : customerRepo.findAll()) {
            System.out.printf("Customer ID: %d | User: %s (%s)%n", cust.getId(), cust.username(), cust.email());
        }

        System.out.println("\n==================================================");
        System.out.println("   GENERIC ENGINE BERHASIL DIEKSEKUSI TYPE-SAFE   ");
        System.out.println("==================================================");
    }
}
```

#### Output Demonstrasi

```text
==================================================
   GENERIC IN-MEMORY DATA STORE ENGINE RUNTIME    
==================================================
Total Produk di Data Store: 5 item

--- 1. Pencarian findById('PRD-03') ---
Ditemukan: Dell UltraSharp Monitor | Harga: Rp 6,500,000.00

--- 2. Query Filter Kategori 'LAPTOP' ---
- MacBook Pro M3 (Rp 28,000,000.00)
- ThinkPad X1 Carbon (Rp 24,000,000.00)

--- 3. Pagination Data (Page 1, Size 2) ---
Halaman 1 dari 3 (Total Data: 5):
  [PRD-01] MacBook Pro M3
  [PRD-02] Mechanical Keyboard

--- 4. Data Store CustomerEntity (ID: Long) ---
Customer ID: 1001 | User: alimurrofid (ali@dev.com)
Customer ID: 1002 | User: budi_santoso (budi@dev.com)

==================================================
   GENERIC ENGINE BERHASIL DIEKSEKUSI TYPE-SAFE   
==================================================
```

---

<a id="bagian-24"></a>

## 24. 🔗 Referensi Resmi

- [Oracle Java Generics Documentation & Tutorial](https://docs.oracle.com/javase/tutorial/java/generics/)
- [Java Language Specification - Type Variables & Parameterized Types](https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.4)
- [Angelika Langer Java Generics FAQ](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html)
- [Effective Java by Joshua Bloch - Generics Chapter](https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/)
