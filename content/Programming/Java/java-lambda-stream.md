---
title: "Java Lambda & Stream API"
description: "Functional programming di Java: lambda expression, functional interfaces (Predicate, Function, Consumer, Supplier), dan Stream API (filter, map, reduce, collect)."
order: 5
tags:
  - programming
  - java
  - lambda
  - stream
  - functional
---

# Java Lambda & Stream API

> **Target:** Pemula yang telah memahami dasar Java, OOP, Generic, dan Collection Framework, serta ingin menguasai paradigma **Functional Programming, Lambda Expressions, Method References, Optional, dan Stream API** di Java (Java 21 LTS).
> **Versi:** Java 17 / 21 (LTS)
> **Prasyarat:** [[java-collection|Java Collection]]
> Fokus modul pembelajaran ini: **mental model functional vs imperative → Functional Interfaces (Consumer, Supplier, Function, Predicate) → sintaks Lambda & Variable Capture → Method Reference (::) → Optional<T> pipeline → Stream API Lifecycle (Source, Intermediate, Terminal) → flatMap & Slicing → Reduce & Aggregations → Collectors (toList, toMap, groupingBy, partitioningBy, downstream) → Lazy Evaluation & Parallel Stream → mini project analitik penjualan e-commerce**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami untuk menulis fungsi anonim, method reference, dan functional interfaces bawaan

🟡 Lanjutan
→ pelajari setelah menguasai Lambda: Optional pipeline dan Stream API (filter, map, flatMap, reduce, match)

🔴 Advanced / Operasional
→ penting untuk arsitektur backend: Collectors groupingBy bertingkat, downstream statistics, dan parallel stream
```

Mental model alur data Stream Pipeline pada JVM:

```text
                     DATA SOURCE
         (List, Set, Array, I/O Channel)
                        │
                        ▼  .stream()
       ┌─────────────────────────────────┐
       │     INTERMEDIATE OPERATIONS     │ (LAZY)
       │ filter() ──> map() ──> sorted() │
       └────────────────┬────────────────┘
                        │
                        ▼  Terminal Operation Dipanggil
       ┌─────────────────────────────────┐
       │       TERMINAL OPERATION        │ (EAGER)
       │  collect() / reduce() / count() │
       └────────────────┬────────────────┘
                        │
                        ▼
                 HASIL AKHIR
         (List Baru, Map, Nilai Tunggal)
```

**Hafalan:**

```text
SAM          → Single Abstract Method: interface yang hanya memiliki tepat satu method abstrak
Lambda       → fungsi anonim ringkas tanpa nama class yang dapat disimpan dalam variabel atau dioper sebagai argumen
Method Ref   → sintaks penyingkat pemanggilan method yang sudah ada menggunakan operator titik dua ganda (::)
Optional<T>  → container pembungkus objek yang boleh bernilai null atau ada isinya untuk mencegah NullPointerException
Stream API   → pipeline aliran data deklaratif untuk memproses koleksi elemen melalui operasi berantai (chaining)
Terminal     → operasi akhir penutup yang memicu eksekusi seluruh rangkaian intermediate operations secara nyata
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Paradigma Functional Programming di Java](#bagian-1)
2. [Functional Interface & Anotasi `@FunctionalInterface`](#bagian-2)
3. [Sintaks Dasar Lambda Expression](#bagian-3)
4. [Built-in Interface: `Consumer<T>` & `BiConsumer<T, U>`](#bagian-4)
5. [Built-in Interface: `Supplier<T>`](#bagian-5)
6. [Built-in Interface: `Function<T, R>` & `BiFunction<T, U, R>`](#bagian-6)
7. [Built-in Interface: `Predicate<T>` & `BiPredicate<T, U>`](#bagian-7)
8. [Primitive Functional Interfaces (`IntPredicate`, `DoubleFunction`, dll.)](#bagian-8)
9. [Method Reference (4 Pola Sintaks `::`)](#bagian-9)
10. [Variable Capture & Aturan *Effectively Final*](#bagian-10)

### 🟡 Lanjutan

11. [`Optional<T>` Dasar (Mencegah NullPointerException)](#bagian-11)
12. [`Optional<T>` Modern Flow (`map`, `flatMap`, `orElseThrow`)](#bagian-12)
13. [Pengenalan Stream API & Mental Model Pipeline](#bagian-13)
14. [Membuat Stream dari Berbagai Sumber](#bagian-14)
15. [Intermediate Operations: `filter()`, `map()`, `sorted()`, `distinct()`, `peek()`](#bagian-15)
16. [Intermediate Operations: `flatMap()` (Transformasi One-to-Many)](#bagian-16)
17. [Slicing Operations: `limit()`, `skip()`, `takeWhile()` & `dropWhile()`](#bagian-17)
18. [Terminal Operations: `forEach()`, `count()`, `min()`, `max()`, `reduce()`](#bagian-18)
19. [Short-Circuiting Terminal Operations: `anyMatch()`, `allMatch()`, `findFirst()`](#bagian-19)

### 🔴 Advanced / Operasional

20. [Collectors Dasar (`toList`, `toSet`, `toMap`, `joining`)](#bagian-20)
21. [Collectors Lanjutan: `groupingBy()` & `partitioningBy()`](#bagian-21)
22. [Downstream Collectors (`counting`, `mapping`, `summingDouble`, `averagingDouble`)](#bagian-22)
23. [Lazy Evaluation pada Stream Pipeline](#bagian-23)
24. [Parallel Stream (`parallelStream()` & ForkJoinPool)](#bagian-24)

### 🛠️ Referensi & Praktik

25. [Peta Ingatan Cepat](#bagian-25)
26. [Tabel Ringkasan](#bagian-26)
27. [Cheat Code Java Lambda & Stream 10 Detik](#bagian-27)
28. [Urutan Belajar yang Disarankan](#bagian-28)
29. [Mini Project: Engine Pemrosesan & Analitik Transaksi Penjualan E-Commerce CLI](#bagian-29)
30. [Referensi Resmi](#bagian-30)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan Paradigma Functional Programming di Java

#### Konsep

Sebelum Java 8, Java adalah bahasa berorientasi objek murni yang bersifat **imperatif** (kita harus menulis instruksi langkah demi langkah secara detail *bagaimana* sebuah tugas diselesaikan, misalnya melalui perulangan for-loop manual dan anonymous class yang panjang).

Sejak Java 8, Java mengadopsi elemen **Functional Programming** yang bersifat **deklaratif** (kita cukup mendeskripsikan *apa* hasil data yang diinginkan).

Perbandingan Gaya Imperatif vs Deklaratif:
- **Imperatif (Lama):** Buat list kosong $\rightarrow$ for-loop $\rightarrow$ if-statement $\rightarrow$ manual add.
- **Deklaratif (Functional):** `list.stream().filter(...).map(...).toList()`.

#### Contoh

```java
import java.util.ArrayList;
import java.util.List;

public class FunctionalIntroDemo {
    public static void main(String[] args) {
        List<String> rawNames = List.of("budi", "ahmad", "andi", "citra", "anisa");

        // 1. Gaya Imperatif (Lama)
        List<String> resultImperative = new ArrayList<>();
        for (String name : rawNames) {
            if (name.startsWith("a")) {
                resultImperative.add(name.toUpperCase());
            }
        }
        System.out.println("Hasil Imperatif : " + resultImperative);

        // 2. Gaya Deklaratif Functional (Modern)
        List<String> resultFunctional = rawNames.stream()
            .filter(name -> name.startsWith("a"))
            .map(String::toUpperCase)
            .toList();

        System.out.println("Hasil Functional: " + resultFunctional);
    }
}
```

#### Output

```text
Hasil Imperatif : [AHMAD, ANDI, ANISA]
Hasil Functional: [AHMAD, ANDI, ANISA]
```

#### Cara Kerja

```text
Imperatif  ──> Instruksi mikro teknis: inisialisasi list, loop indeks, conditional check
Deklaratif ──> Pipeline ekspresif: Sumber Data ──> Saring ('a') ──> Ubah Huruf Besar ──> Kumpulkan
```

**Hafalan:**

```text
Declarative Style → gaya pemrograman yang berfokus pada "apa yang ingin dicapai" daripada "bagaimana langkah teknisnya"
```

---

<a id="bagian-2"></a>

## 2. 🟢 Functional Interface & Anotasi `@FunctionalInterface`

#### Konsep

**Functional Interface** adalah interface yang **hanya memiliki tepat satu Single Abstract Method (SAM)**. Interface ini dapat memiliki banyak method `default` atau `static`, asalkan method abstraknya tetap berjumlah satu.

Anotasi opsional `@FunctionalInterface` digunakan untuk meminta compiler memverifikasi bahwa interface tersebut benar-benar mematuhi aturan SAM (akan error jika kita menambah method abstrak kedua).

Functional Interface adalah **tipe target mutlak** untuk setiap Lambda Expression dan Method Reference di Java.

#### Contoh

```java
// Mendefinisikan Custom Functional Interface
@FunctionalInterface
interface KalkulatorOperasi {
    // Tepat 1 Abstract Method
    double hitung(double a, double b);

    // Boleh memiliki default method
    default void info() {
        System.out.println("Menjalankan kalkulasi matematika...");
    }
}

public class FunctionalInterfaceDemo {
    public static void main(String[] args) {
        // Implementasi instan via Lambda
        KalkulatorOperasi tambah = (x, y) -> x + y;
        KalkulatorOperasi kali = (x, y) -> x * y;

        tambah.info();
        System.out.println("10 + 5 = " + tambah.hitung(10, 5));
        System.out.println("10 * 5 = " + kali.hitung(10, 5));
    }
}
```

#### Output

```text
Menjalankan kalkulasi matematika...
10 + 5 = 15.0
10 * 5 = 50.0
```

#### Cara Kerja

```text
Lambda Expression (x, y) -> x + y
              │
              ▼
Otomatis dicocokkan ke method SAM: double hitung(double a, double b)
```

**Hafalan:**

```text
@FunctionalInterface → anotasi validasi compiler bahwa interface hanya memiliki tepat 1 method abstrak
Single Abstract Method (SAM) → syarat mutlak sebuah interface dapat diisi oleh ekspresi lambda
```

---

<a id="bagian-3"></a>

## 3. 🟢 Sintaks Dasar Lambda Expression

#### Konsep

Anatomi Lambda Expression terdiri dari tiga bagian utama:
1. **Daftar Parameter `(p1, p2)`:** Tipe data parameter bersifat opsional karena compiler dapat menyimpulkannya secara otomatis (*Type Inference*). Jika hanya ada 1 parameter, tanda kurung boleh dihilangkan (`x -> ...`).
2. **Operator Panah `->`:** Pemisah antara parameter dan isi badan lambda (*arrow token*).
3. **Badan Lambda (*Body*):**
   - *Expression Body:* Jika hanya satu baris, tanda kurung kurawal `{}` dan kata kunci `return` tidak perlu ditulis.
   - *Block Body:* Jika multi-baris, wajib dibungkus kurung kurawal `{ ... }` dan menyertakan `return` eksplisit jika ada nilai balik.

#### Contoh

```java
@FunctionalInterface
interface PemformatPesan {
    String format(String pesan, int kode);
}

public class LambdaSyntaxDemo {
    public static void main(String[] args) {
        // 1. Single Expression Body (Ringkas)
        PemformatPesan formatSederhana = (msg, code) -> "[" + code + "] " + msg;

        // 2. Multi-line Block Body
        PemformatPesan formatLengkap = (msg, code) -> {
            String status = (code >= 400) ? "ERROR" : "SUCCESS";
            return String.format("[%s - %d] %s", status, code, msg.toUpperCase());
        };

        System.out.println(formatSederhana.format("Koneksi berhasil", 200));
        System.out.println(formatLengkap.format("Halaman tidak ditemukan", 404));
    }
}
```

#### Output

```text
[200] Koneksi berhasil
[ERROR - 404] HALAMAN TIDAK DITEMUKAN
```

#### Cara Kerja

```text
(msg, code)             ->                "[" + code + "] " + msg
[Parameter Input]    [Arrow Token]           [Hasil Output]
```

**Hafalan:**

```text
(parameters) -> expression          → format lambda satu baris tanpa kurung kurawal
(parameters) -> { statements; return value; } → format lambda multi-baris dengan kurung kurawal
```

---

<a id="bagian-4"></a>

## 4. 🟢 Built-in Interface: `Consumer<T>` & `BiConsumer<T, U>`

#### Konsep

- **`Consumer<T>`:** Menerima satu parameter masukan bertipe `T` dan **tidak mengembalikan nilai apapun (`void`)**. Method utamanya adalah `void accept(T t)`.
- **`BiConsumer<T, U>`:** Menerima dua parameter masukan dan tidak mengembalikan nilai apapun (`void accept(T t, U u)`).
- **Chaining `andThen()`:** Menjalankan consumer kedua tepat setelah consumer pertama selesai dieksekusi secara berurutan.

Pola ini umum digunakan untuk: pencetakan data ke log/konsol, mutasi state objek, atau penyimpanan data ke database.

#### Contoh

```java
import java.util.function.BiConsumer;
import java.util.function.Consumer;

public class ConsumerDemo {
    public static void main(String[] args) {
        // 1. Consumer Tunggal
        Consumer<String> cetakKonsol = teks -> System.out.println("PRINT: " + teks);
        Consumer<String> cetakLog = teks -> System.out.println("LOG  : " + teks.toUpperCase());

        // Chaining Consumer (andThen)
        Consumer<String> gabungan = cetakKonsol.andThen(cetakLog);
        gabungan.accept("Server berhasil dihidupkan");

        // 2. BiConsumer (2 Parameter)
        BiConsumer<String, Double> notifikasiGaji = (nama, gaji) -> 
            System.out.printf("Transfer gaji ke %s sebesar Rp %,.2f sukses.%n", nama, gaji);

        notifikasiGaji.accept("Budi Setiawan", 12_500_000.0);
    }
}
```

#### Output

```text
PRINT: Server berhasil dihidupkan
LOG  : SERVER BERHASIL DIHIDUPKAN
Transfer gaji ke Budi Setiawan sebesar Rp 12,500,000.00 sukses.
```

#### Cara Kerja

```text
Input Teks ──> Consumer A (accept) ──> Lanjut ──> Consumer B (accept)
```

**Hafalan:**

```text
consumer.accept(value)          → mengeksekusi operasi pada value tanpa menghasilkan return value
consumerA.andThen(consumerB)    → merangkai dua consumer untuk dieksekusi berurutan
```

---

<a id="bagian-5"></a>

## 5. 🟢 Built-in Interface: `Supplier<T>`

#### Konsep

**`Supplier<T>`** adalah kebalikan dari `Consumer`. Interface ini **tidak menerima parameter apapun**, tetapi **menghasilkan/mengembalikan sebuah nilai** bertipe `T`. Method utamanya adalah `T get()`.

Kegunaan utama `Supplier`:
- **Lazy Evaluation (Evaluasi Tunda):** Menghitung nilai atau membuat objek hanya saat benar-benar dibutuhkan untuk menghemat CPU & RAM.
- **Factory Pattern:** Menghasilkan instance objek baru.

#### Contoh

```java
import java.util.UUID;
import java.util.function.Supplier;

public class SupplierDemo {
    public static void main(String[] args) {
        // Supplier untuk menghasilkan ID Transaksi acak
        Supplier<String> txIdGenerator = () -> "TX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // Supplier untuk tanggal & waktu saat ini
        Supplier<Long> timestampSupplier = System::currentTimeMillis;

        System.out.println("Transaksi 1: " + txIdGenerator.get() + " pada " + timestampSupplier.get());
        System.out.println("Transaksi 2: " + txIdGenerator.get() + " pada " + timestampSupplier.get());
    }
}
```

#### Output

```text
Transaksi 1: TX-A1B2C3D4 pada 1724930000000
Transaksi 2: TX-E5F6G7H8 pada 1724930000010
```

#### Cara Kerja

```text
Supplier.get() ──(Tanpa Input)──> Menghasilkan Objek / Nilai T
```

**Hafalan:**

```text
Supplier<T> supplier = () -> value; → mendefinisikan penyedia data tanpa input
supplier.get()                      → mengambil nilai yang dihasilkan oleh supplier
```

---

<a id="bagian-6"></a>

## 6. 🟢 Built-in Interface: `Function<T, R>` & `BiFunction<T, U, R>`

#### Konsep

- **`Function<T, R>`:** Menerima satu parameter masukan bertipe `T` dan **mengubah/mentransformasikan datanya menjadi nilai baru bertipe `R`**. Method utamanya adalah `R apply(T t)`.
- **`BiFunction<T, U, R>`:** Menerima dua parameter masukan bertipe `T` dan `U`, lalu menghasilkan nilai kembalian bertipe `R` (`R apply(T t, U u)`).

Pola ini adalah fondasi utama operasi `.map()` pada Stream API untuk mengubah Entity database menjadi DTO response.

#### Contoh

```java
import java.util.function.BiFunction;
import java.util.function.Function;

record UserEntity(String id, String username, String email) {}
record UserResponseDTO(String id, String username) {}

public class FunctionDemo {
    public static void main(String[] args) {
        // 1. Function: Transformasi Entity ke DTO
        Function<UserEntity, UserResponseDTO> entityToDto = entity -> 
            new UserResponseDTO(entity.id(), entity.username());

        UserEntity user = new UserEntity("USR-1", "alimurrofid", "ali@dev.com");
        UserResponseDTO dto = entityToDto.apply(user);
        System.out.println("Hasil Transformasi DTO: " + dto);

        // 2. Chaining Function (andThen vs compose)
        Function<String, String> strip = String::strip;
        Function<String, Integer> toLength = String::length;
        Function<String, Integer> cleanAndCount = strip.andThen(toLength);

        System.out.println("Panjang Bersih '  Java  ': " + cleanAndCount.apply("  Java  ")); // 4

        // 3. BiFunction
        BiFunction<Integer, Double, Double> hitungDiskon = (qty, harga) -> (qty * harga) * 0.90;
        System.out.printf("Total Setelah Diskon: Rp %,.2f%n", hitungDiskon.apply(3, 50000.0));
    }
}
```

#### Output

```text
Hasil Transformasi DTO: UserResponseDTO[id=USR-1, username=alimurrofid]
Panjang Bersih '  Java  ': 4
Total Setelah Diskon: Rp 135,000.00
```

#### Cara Kerja

```text
Input (T: UserEntity) ──> Function.apply() ──> Output (R: UserResponseDTO)
```

**Hafalan:**

```text
function.apply(input)           → mengeksekusi transformasi dari tipe input T ke tipe output R
functionA.andThen(functionB)    → menjalankan functionA dahulu, lalu hasilnya dioper ke functionB
```

---

<a id="bagian-7"></a>

## 7. 🟢 Built-in Interface: `Predicate<T>` & `BiPredicate<T, U>`

#### Konsep

- **`Predicate<T>`:** Menerima satu parameter masukan bertipe `T` dan **mengembalikan nilai boolean (`true`/`false`)**. Method utamanya adalah `boolean test(T t)`.
- **`BiPredicate<T, U>`:** Menerima dua parameter masukan dan mengembalikan nilai boolean (`boolean test(T t, U u)`).

Predicate mendukung logika boolean berantai:
- `predicateA.and(predicateB)` : Logika AND (`&&`).
- `predicateA.or(predicateB)` : Logika OR (`||`).
- `predicate.negate()` : Logika NOT (`!`).

Pola ini adalah fondasi operasi `.filter()` pada Stream API.

#### Contoh

```java
import java.util.function.Predicate;

public class PredicateDemo {
    public static void main(String[] args) {
        Predicate<Integer> isGenap = n -> n % 2 == 0;
        Predicate<Integer> isPositif = n -> n > 0;

        // Logika Berantai
        Predicate<Integer> isGenapDanPositif = isGenap.and(isPositif);
        Predicate<Integer> isGanjil = isGenap.negate();

        System.out.println("Apakah 4 genap & positif? " + isGenapDanPositif.test(4));   // true
        System.out.println("Apakah -2 genap & positif? " + isGenapDanPositif.test(-2)); // false
        System.out.println("Apakah 5 ganjil? " + isGanjil.test(5));                     // true
    }
}
```

#### Output

```text
Apakah 4 genap & positif? true
Apakah -2 genap & positif? false
Apakah 5 ganjil? true
```

#### Cara Kerja

```text
Input Nilai (T) ──> Predicate.test() ──> Evaluasi Logika ──> true / false
```

**Hafalan:**

```text
predicate.test(value)           → menguji apakah value memenuhi kondisi boolean (true/false)
predicateA.and(predicateB)      → menggabungkan dua predicate dengan logika AND
predicateA.or(predicateB)       → menggabungkan dua predicate dengan logika OR
predicate.negate()              → membalikkan hasil pengujian predicate (NOT)
```

---

<a id="bagian-8"></a>

## 8. 🟢 Primitive Functional Interfaces (`IntPredicate`, `DoubleFunction`, dll.)

#### Konsep

Generic biasa (`Predicate<Integer>`, `Function<Double, Double>`) selalu menggunakan Wrapper Class objek, yang menyebabkan overhead alokasi memori dan konversi otomatis (**Autoboxing & Unboxing**) saat memproses jutaan data angka.

Untuk optimasi performa tinggi, Java menyediakan versi primitif khusus:
- **Predicate:** `IntPredicate`, `LongPredicate`, `DoublePredicate`
- **Consumer:** `IntConsumer`, `LongConsumer`, `DoubleConsumer`
- **Supplier:** `IntSupplier`, `LongSupplier`, `DoubleSupplier`
- **Function:** `IntFunction<R>`, `ToIntFunction<T>`, `DoubleToLongFunction`, dll.

#### Contoh

```java
import java.util.function.IntPredicate;
import java.util.function.IntToDoubleFunction;

public class PrimitiveFunctionDemo {
    public static void main(String[] args) {
        // IntPredicate menerima primitif 'int' langsung tanpa objek Integer
        IntPredicate isKelipatanTiga = n -> n % 3 == 0;

        System.out.println("Apakah 9 kelipatan 3? " + isKelipatanTiga.test(9));

        // Konversi primitif int ke primitif double langsung
        IntToDoubleFunction konversiKeDolar = rupiah -> rupiah / 15_500.0;
        System.out.printf("Rp 155.000 dalam USD: $%.2f%n", konversiKeDolar.applyAsDouble(155_000));
    }
}
```

#### Output

```text
Apakah 9 kelipatan 3? true
Rp 155.000 dalam USD: $10.00
```

**Hafalan:**

```text
IntPredicate / DoubleConsumer → versi fungsional primitif tanpa overhead memori autoboxing objek
```

---

<a id="bagian-9"></a>

## 9. 🟢 Method Reference (4 Pola Sintaks `::`)

#### Konsep

**Method Reference** adalah sintaks penyingkat ekspresi lambda yang langsung merujuk ke method atau constructor yang sudah ada menggunakan operator titik dua ganda (`::`).

Terdapat 4 variasi pola Method Reference di Java:

| # | Kategori | Sintaks Lambda Biasa | Sintaks Method Reference |
|---|---|---|---|
| 1 | **Static Method** | `(x) -> Math.sqrt(x)` | `Math::sqrt` |
| 2 | **Instance Method (Objek Tertentu)** | `(s) -> System.out.println(s)` | `System.out::println` |
| 3 | **Instance Method (Objek Arbitrer)** | `(s) -> s.toUpperCase()` | `String::toUpperCase` |
| 4 | **Constructor Reference** | `(s) -> new ArrayList<>(s)` | `ArrayList::new` |

#### Contoh

```java
import java.util.List;
import java.util.function.BiFunction;
import java.util.function.Consumer;
import java.util.function.Function;

public class MethodReferenceDemo {
    public static void main(String[] args) {
        // 1. Static Method Reference
        Function<Double, Double> akar = Math::sqrt;
        System.out.println("Akar 64: " + akar.apply(64.0));

        // 2. Instance Method pada Objek Tertentu (System.out)
        Consumer<String> logger = System.out::println;
        logger.accept("Log via Method Reference");

        // 3. Instance Method pada Objek Arbitrer
        Function<String, String> capitalizer = String::toUpperCase;
        System.out.println("Kapital: " + capitalizer.apply("java 21"));

        // 4. Constructor Reference
        Function<String, StringBuilder> builderCreator = StringBuilder::new;
        StringBuilder sb = builderCreator.apply("Halo Builder");
        System.out.println("Builder Content: " + sb);
    }
}
```

#### Output

```text
Akar 64: 8.0
Log via Method Reference
Kapital: JAVA 21
Builder Content: Halo Builder
```

#### Cara Kerja

```text
Lambda: (str) -> str.toUpperCase()   ===>   Method Reference: String::toUpperCase
```

**Hafalan:**

```text
Class::staticMethod     → mereferensikan method static
object::instanceMethod  → mereferensikan method pada instance objek tertentu
Class::instanceMethod   → mereferensikan method instance pada tipe objek masukan
Class::new              → mereferensikan constructor untuk membuat objek baru
```

---

<a id="bagian-10"></a>

## 10. 🟢 Variable Capture & Aturan *Effectively Final*

#### Konsep

Lambda Expression dapat membaca variabel lokal yang berada di luar tubuh lambda (*Variable Capture*).

Namun, variabel lokal tersebut **wajib berstatus `final` atau *Effectively Final*** (nilainya tidak pernah dimodifikasi atau ditugaskan ulang setelah inisialisasi awal).

Mengapa Java mewajibkan *Effectively Final*?
Karena lambda dapat dieksekusi secara asynchronous di thread yang berbeda saat stack frame method aslinya sudah musnah. Java menyalin nilai variabel ke tubuh lambda (*capture by value*), bukan referensi memorinya.

#### Contoh

```java
public class VariableCaptureDemo {
    public static void main(String[] args) {
        String prefix = "[APP LOG]"; // Effectively Final (tidak pernah diubah lagi)

        Runnable task = () -> {
            // Membaca variabel prefix diizinkan
            System.out.println(prefix + " Menjalankan background job.");
        };

        task.run();

        // prefix = "[NEW LOG]"; // JIKA BARIS INI DIAKTIFKAN -> COMPILE ERROR:
        // local variables referenced from a lambda expression must be final or effectively final
    }
}
```

#### Output

```text
[APP LOG] Menjalankan background job.
```

**Hafalan:**

```text
Effectively Final → variabel lokal yang tidak pernah di-reassign nilainya sehingga aman dibaca di dalam lambda
```

---

<a id="bagian-11"></a>

## 11. 🟡 `Optional<T>` Dasar (Mencegah NullPointerException)

#### Konsep

`Optional<T>` adalah class container pembungkus yang dirancang untuk merepresentasikan **nilai yang mungkin ada atau mungkin tidak ada (`null`)**. Tujuannya adalah mengeliminasi bahaya `NullPointerException` dan memaksa pemanggil menangani ketiadaan data secara eksplisit.

Tiga cara membuat `Optional`:
1. `Optional.of(value)` : Nilai wajib **tidak boleh null** (akan langsung error jika null).
2. `Optional.ofNullable(value)` : Nilai **boleh null** (menjadi `Optional.empty()` jika null).
3. `Optional.empty()` : Membuat container kosong.

#### Contoh

```java
import java.util.Optional;

public class OptionalBaseDemo {
    static Optional<String> cariEmailUser(String userId) {
        if ("USR-01".equals(userId)) {
            return Optional.of("budi@gmail.com");
        }
        return Optional.empty(); // Tidak ditemukan
    }

    public static void main(String[] args) {
        Optional<String> emailBudi = cariEmailUser("USR-01");
        Optional<String> emailDoni = cariEmailUser("USR-99");

        System.out.println("Email Budi ada? " + emailBudi.isPresent()); // true
        System.out.println("Email Doni kosong? " + emailDoni.isEmpty()); // true

        // Mengambil isi nilai secara aman
        System.out.println("Isi Budi: " + emailBudi.get());
    }
}
```

#### Output

```text
Email Budi ada? true
Email Doni kosong? true
Isi Budi: budi@gmail.com
```

**Hafalan:**

```text
Optional.ofNullable(value) → membungkus value yang mungkin bernilai null secara aman
optional.isPresent()       → mengembalikan true jika container berisi nilai
optional.isEmpty()         → mengembalikan true jika container bernilai kosong (Java 11+)
```

---

<a id="bagian-12"></a>

## 12. 🟡 `Optional<T>` Modern Flow (`map`, `flatMap`, `orElseThrow`)

#### Konsep

Pola modern penanganan `Optional` **TIDAK MENGGUNAKAN `if (opt.isPresent()) opt.get()`** (karena sama saja dengan null check lama).

Gunakan method fungsional berantai (*fluent pipeline*):
- `ifPresent(Consumer)` : Jalankan aksi jika data ada.
- `ifPresentOrElse(Consumer, Runnable)` : Jalankan aksi A jika ada, atau jalankan aksi B jika kosong (Java 9+).
- `map(Function)` : Mengubah isi data di dalam Optional.
- `filter(Predicate)` : Menyaring isi data.
- `orElse(defaultValue)` : Kembalikan nilai default jika kosong.
- `orElseGet(Supplier)` : Evaluasi nilai default secara lazy via Supplier.
- `orElseThrow(SupplierException)` : **Standar Spring Boot:** Lempar custom exception jika data tidak ditemukan.

#### Contoh

```java
import java.util.Optional;

class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String msg) { super(msg); }
}

public class OptionalModernDemo {
    public static void main(String[] args) {
        Optional<String> usernameOpt = Optional.ofNullable("  ahmad_santoso  ");

        // 1. Pipeline Transformasi & Nilai Default
        String cleanUpper = usernameOpt
            .map(String::strip)
            .filter(s -> s.length() > 5)
            .map(String::toUpperCase)
            .orElse("GUEST_USER");

        System.out.println("Hasil Pembersihan: " + cleanUpper);

        // 2. Standar Spring Service: orElseThrow
        Optional<String> userKosong = Optional.empty();
        try {
            String data = userKosong.orElseThrow(() -> new UserNotFoundException("User dengan ID tersebut tidak ada!"));
        } catch (UserNotFoundException e) {
            System.err.println("❌ EXCEPTION TERTANGKAP: " + e.getMessage());
        }
    }
}
```

#### Output

```text
Hasil Pembersihan: AHMAD_SANTOSO
❌ EXCEPTION TERTANGKAP: User dengan ID tersebut tidak ada!
```

#### Cara Kerja

```text
Optional[" ahmad "] ──> map(strip) ──> Optional["ahmad"] ──> map(upper) ──> Optional["AHMAD"]
```

**Hafalan:**

```text
optional.orElse(fallbackValue)           → mengambil nilai atau mengembalikan fallbackValue jika kosong
optional.orElseGet(supplier)             → mengevaluasi supplier untuk nilai default jika kosong (Lazy)
optional.orElseThrow(exceptionSupplier)  → mengambil nilai atau melempar exception jika kosong
optional.ifPresent(consumer)             → mengeksekusi consumer jika data ada
```

---

<a id="bagian-13"></a>

## 13. 🟡 Pengenalan Stream API & Mental Model Pipeline

#### Konsep

**Stream API** adalah antarmuka pipa aliran data (*pipeline*) untuk memproses sekumpulan data secara deklaratif.

Karakteristik fundamental Stream:
1. **Tidak Menyimpan Data:** Stream bukan struktur data penyimpanan (berbeda dengan List/Set). Stream hanya mengalirkan data dari sumbernya.
2. **Tidak Mengubah Data Asli (*Non-Mutating*):** Stream tidak memodifikasi Collection sumber aslinya.
3. **Penyusunan Pipeline Terbagi 3:**
   - **Source:** Sumber data (Collection, Array, I/O).
   - **Intermediate Operations (0 atau Banyak):** Operasi transformasi yang bersifat **LAZY** (hanya mendaftarkan aturan logika tanpa mengeksekusinya).
   - **Terminal Operation (Tepat 1):** Operasi penutup yang bersifat **EAGER** yang memicu eksekusi seluruh pipeline dan mengakhiri stream.
4. **Sekali Pakai (*Single-Use*):** Setelah Terminal Operation dieksekusi, stream ditutup dan **tidak dapat digunakan ulang**.

#### Contoh

```java
import java.util.List;

public class StreamLifecycleDemo {
    public static void main(String[] args) {
        List<String> fruits = List.of("Apel", "Mangga", "Alpukat", "Jeruk", "Anggur");

        // Pipeline Stream Lengkap: Source -> Intermediate (filter, map, sorted) -> Terminal (toList)
        List<String> filteredFruits = fruits.stream()            // 1. Source
            .filter(f -> f.startsWith("A"))                     // 2. Intermediate (Lazy)
            .map(String::toUpperCase)                           // 2. Intermediate (Lazy)
            .sorted()                                           // 2. Intermediate (Lazy)
            .toList();                                          // 3. Terminal (Eager)

        System.out.println("Data Asli (Tidak Berubah): " + fruits);
        System.out.println("Hasil Stream Pipeline    : " + filteredFruits);
    }
}
```

#### Output

```text
Data Asli (Tidak Berubah): [Apel, Mangga, Alpukat, Jeruk, Anggur]
Hasil Stream Pipeline    : [ALPUKAT, ANGGUR, APEL]
```

#### Cara Kerja

```text
fruits (Source) ──> filter("A") ──> map(Upper) ──> sorted() ──> toList() (Hasil)
```

**Hafalan:**

```text
collection.stream()    → membuka pipa aliran data Stream dari sebuah koleksi
Intermediate Operation → operasi penyiapan logika transformasi yang bersifat Lazy (filter, map, sorted)
Terminal Operation     → operasi eksekutor yang menghasilkan output akhir dan menutup stream (toList, count, forEach)
```

---

<a id="bagian-14"></a>

## 14. 🟡 Membuat Stream dari Berbagai Sumber

#### Konsep

Stream dapat diciptakan dari berbagai macam sumber:
1. **Dari Collection:** `collection.stream()`
2. **Dari Array:** `Arrays.stream(array)`
3. **Dari Elemen Langsung:** `Stream.of("A", "B", "C")`
4. **Stream Bilangan Primitif:** `IntStream.range(1, 5)` (1..4) atau `rangeClosed(1, 5)` (1..5)
5. **Infinite Stream (Tak Hingga):** `Stream.iterate(0, n -> n + 2).limit(10)`

#### Contoh

```java
import java.util.Arrays;
import java.util.stream.IntStream;
import java.util.stream.Stream;

public class StreamSourceDemo {
    public static void main(String[] args) {
        // 1. Stream.of
        Stream<String> s1 = Stream.of("Merah", "Kuning", "Hijau");

        // 2. Arrays.stream
        int[] numbers = {10, 20, 30};
        IntStream s2 = Arrays.stream(numbers);

        // 3. IntStream.range (Rentang Angka)
        System.out.print("IntStream 1-5: ");
        IntStream.rangeClosed(1, 5).forEach(n -> System.out.print(n + " "));
        System.out.println();

        // 4. Stream.iterate dengan limit
        System.out.print("Bilangan Genap (iterate): ");
        Stream.iterate(2, n -> n + 2).limit(5).forEach(n -> System.out.print(n + " "));
        System.out.println();
    }
}
```

#### Output

```text
IntStream 1-5: 1 2 3 4 5 
Bilangan Genap (iterate): 2 4 6 8 10 
```

**Hafalan:**

```text
Stream.of(values...)           → membuat stream dari deretan nilai langsung
IntStream.rangeClosed(min, max)→ membuat stream angka integer dari min sampai dengan max inklusif
```

---

<a id="bagian-15"></a>

## 15. 🟡 Intermediate Operations: `filter()`, `map()`, `sorted()`, `distinct()`, `peek()`

#### Konsep

Operasi perantara yang paling sering digunakan:
- `filter(Predicate)` : Menyaring dan hanya meloloskan elemen yang memenuhi kondisi `true`.
- `map(Function)` : Mengubah setiap elemen menjadi bentuk/tipe data lain (1-to-1 mapping).
- `distinct()` : Menghilangkan seluruh elemen duplikat (berbasis `equals()` dan `hashCode()`).
- `sorted()` / `sorted(Comparator)` : Mengurutkan aliran elemen.
- `peek(Consumer)` : Mengintip elemen yang sedang mengalir di pipeline untuk keperluan **debugging log** tanpa mengubah datanya.

#### Contoh

```java
import java.util.Comparator;
import java.util.List;

record Karyawan(String nama, double gaji, String departemen) {}

public class IntermediateOperationsDemo {
    public static void main(String[] args) {
        List<Karyawan> daftar = List.of(
            new Karyawan("Budi", 8_000_000, "IT"),
            new Karyawan("Siti", 12_000_000, "IT"),
            new Karyawan("Andi", 6_000_000, "HR"),
            new Karyawan("Budi", 8_000_000, "IT"), // Duplikat
            new Karyawan("Doni", 15_000_000, "IT")
        );

        List<String> hasil = daftar.stream()
            .filter(k -> "IT".equals(k.departemen()))              // 1. Hanya departemen IT
            .distinct()                                            // 2. Buang duplikat Budi
            .filter(k -> k.gaji() >= 10_000_000)                   // 3. Gaji >= 10 Juta
            .sorted(Comparator.comparingDouble(Karyawan::gaji).reversed()) // 4. Sort Gaji Tertinggi
            .peek(k -> System.out.println("[DEBUG PEEK] Lolos: " + k.nama())) // 5. Intip data
            .map(Karyawan::nama)                                   // 6. Ambil nama saja (String)
            .toList();

        System.out.println("Hasil Akhir: " + hasil);
    }
}
```

#### Output

```text
[DEBUG PEEK] Lolos: Doni
[DEBUG PEEK] Lolos: Siti
Hasil Akhir: [Doni, Siti]
```

#### Cara Kerja

```text
5 Karyawan ──> filter(IT) -> 4 ──> distinct() -> 3 ──> filter(>=10jt) -> 2 ──> map(nama) -> ["Doni", "Siti"]
```

**Hafalan:**

```text
stream.filter(predicate)   → menyaring aliran data berdasarkan kondisi boolean
stream.map(function)       → mentransformasikan setiap elemen menjadi objek baru (1-to-1)
stream.distinct()          → membuang seluruh elemen duplikat dari aliran stream
stream.peek(consumer)      → mengintip data untuk logging/debugging tanpa memutus pipeline
```

---

<a id="bagian-16"></a>

## 16. 🟡 Intermediate Operations: `flatMap()` (Transformasi One-to-Many)

#### Konsep

- `map(Function)` : Menghasilkan 1 elemen untuk setiap 1 elemen input (1-to-1). Jika input berupa `List<List<T>>`, `map` akan menghasilkan `Stream<List<T>>`.
- **`flatMap(Function)` :** Meratakan (*flattening*) struktur hierarki bertingkat menjadi satu aliran tunggal (*One-to-Many* / Flattened Stream). Hasilnya adalah `Stream<T>` datar.

Gunakan `flatMap` jika setiap elemen di dalam stream memiliki daftar sub-koleksi di dalamnya (misal: Pesanan memiliki banyak OrderItem).

#### Contoh

```java
import java.util.List;

record Order(String orderId, List<String> items) {}

public class FlatMapDemo {
    public static void main(String[] args) {
        List<Order> orders = List.of(
            new Order("ORD-1", List.of("Buku", "Pulpen")),
            new Order("ORD-2", List.of("Keyboard", "Mouse")),
            new Order("ORD-3", List.of("Monitor", "Buku"))
        );

        // Menggabungkan seluruh item dari semua order menjadi satu daftar unik
        List<String> semuaItemUnik = orders.stream()
            .flatMap(order -> order.items().stream()) // Meratakan List<String> ke Stream<String>
            .distinct()                               // Hapus duplikat 'Buku'
            .sorted()
            .toList();

        System.out.println("Semua Item Unik Terjual: " + semuaItemUnik);
    }
}
```

#### Output

```text
Semua Item Unik Terjual: [Buku, Keyboard, Monitor, Mouse, Pulpen]
```

#### Cara Kerja

```text
Order 1 [Buku, Pulpen]   ──┐
Order 2 [Keyboard, Mouse] ──┼──> flatMap() ──> Stream Datar: ["Buku", "Pulpen", "Keyboard", "Mouse", ...]
Order 3 [Monitor, Buku]  ──┘
```

**Hafalan:**

```text
stream.flatMap(functionToStream) → meratakan kumpulan sub-koleksi atau stream bertingkat menjadi satu stream datar
```

---

<a id="bagian-17"></a>

## 17. 🟡 Slicing Operations: `limit()`, `skip()`, `takeWhile()` & `dropWhile()`

#### Konsep

Operasi pemotongan ukuran aliran data:
- `limit(n)` : Mengambil maksimal `n` elemen pertama.
- `skip(n)` : Membuang `n` elemen pertama dan meneruskan sisanya (biasa dipadukan dengan `limit` untuk implementasi pagination manual).
- `takeWhile(Predicate)` (Java 9+): Mengambil elemen selama kondisi bernilai `true`. **Begitu bertemu kondisi `false` pertama kali, stream langsung berhenti**.
- `dropWhile(Predicate)` (Java 9+): Membuang elemen selama kondisi bernilai `true`, lalu mengambil seluruh sisa elemen setelahnya.

#### Contoh

```java
import java.util.List;

public class StreamSlicingDemo {
    public static void main(String[] args) {
        List<Integer> numbers = List.of(10, 20, 30, 40, 50, 60, 70);

        // 1. Pagination Simulasi: Skip 2, Limit 3 (Ambil index ke-2, ke-3, ke-4)
        List<Integer> pageData = numbers.stream()
            .skip(2)   // Lewati 10, 20
            .limit(3)  // Ambil 30, 40, 50
            .toList();
        System.out.println("Data Page (Skip 2, Limit 3): " + pageData);

        // 2. takeWhile pada list terurut (Ambil selama nilai < 40)
        List<Integer> bawah40 = numbers.stream()
            .takeWhile(n -> n < 40)
            .toList();
        System.out.println("takeWhile (< 40)            : " + bawah40); // [10, 20, 30]

        // 3. dropWhile (Buang selama nilai < 40, ambil sisanya)
        List<Integer> atas40 = numbers.stream()
            .dropWhile(n -> n < 40)
            .toList();
        System.out.println("dropWhile (< 40)            : " + atas40);  // [40, 50, 60, 70]
    }
}
```

#### Output

```text
Data Page (Skip 2, Limit 3): [30, 40, 50]
takeWhile (< 40)            : [10, 20, 30]
dropWhile (< 40)            : [40, 50, 60, 70]
```

**Hafalan:**

```text
stream.limit(maxSize)      → membatasi aliran stream maksimal sebanyak maxSize elemen
stream.skip(count)         → melewati/membuang count elemen pertama dari aliran stream
stream.takeWhile(predicate)→ mengambil elemen berurutan selama predicate bernilai true, berhenti saat false
```

---

<a id="bagian-18"></a>

## 18. 🟡 Terminal Operations: `forEach()`, `count()`, `min()`, `max()`, `reduce()`

#### Konsep

Terminal Operation mengeksekusi pipeline dan menghasilkan nilai akhir (bukan Stream lagi):
- `forEach(Consumer)` : Melakukan iterasi dan aksi pada setiap elemen.
- `count()` : Mengembalikan total jumlah elemen (`long`).
- `min(Comparator)` / `max(Comparator)` : Mengembalikan `Optional<T>` berisi elemen minimum/maksimum.
- `reduce(identity, accumulator)` : Menggabungkan/mengakumulasi seluruh elemen menjadi satu nilai tunggal (seperti menghitung total penjumlahan nilai atau perkalian).

#### Contoh

```java
import java.util.List;
import java.util.Optional;

public class TerminalOperationsDemo {
    public static void main(String[] args) {
        List<Integer> nilaiList = List.of(10, 25, 50, 15);

        // 1. count
        long totalItem = nilaiList.stream().count();
        System.out.println("Total Elemen: " + totalItem);

        // 2. max & min
        Optional<Integer> nilaiMax = nilaiList.stream().max(Integer::compareTo);
        nilaiMax.ifPresent(m -> System.out.println("Nilai Maksimal: " + m));

        // 3. reduce: Total Penjumlahan (0 + 10 + 25 + 50 + 15)
        int totalPenjumlahan = nilaiList.stream()
            .reduce(0, (subtotal, angka) -> subtotal + angka);

        System.out.println("Total Akumulasi Reduce: " + totalPenjumlahan);
    }
}
```

#### Output

```text
Total Elemen: 4
Nilai Maksimal: 50
Total Akumulasi Reduce: 100
```

#### Cara Kerja

```text
reduce(0, +):
Iterasi 1: 0 + 10 = 10
Iterasi 2: 10 + 25 = 35
Iterasi 3: 35 + 50 = 85
Iterasi 4: 85 + 15 = 100 (Nilai Akhir)
```

**Hafalan:**

```text
stream.reduce(identity, accumulator) → mengakumulasikan seluruh elemen stream menjadi satu nilai tunggal
stream.max(comparator)               → mencari nilai tertinggi dalam stream menghasilkan Optional<T>
stream.count()                       → menghitung jumlah elemen yang mengalir di stream
```

---

<a id="bagian-19"></a>

## 19. 🟡 Short-Circuiting Terminal Operations: `anyMatch()`, `allMatch()`, `findFirst()`

#### Konsep

**Short-Circuiting Operations** adalah operasi terminal cerdas yang **tidak perlu memproses seluruh elemen stream** sampai habis jika hasil kesimpulannya sudah dapat ditentukan di tengah jalan:
- `anyMatch(Predicate)` : Mengembalikan `true` begitu menemukan **minimal satu** elemen yang memenuhi syarat.
- `allMatch(Predicate)` : Mengembalikan `false` begitu menemukan **satu saja** elemen yang melanggar syarat.
- `noneMatch(Predicate)` : Mengembalikan `true` jika **tidak ada satupun** elemen yang memenuhi syarat.
- `findFirst()` : Mengembalikan `Optional<T>` berisi elemen pertama yang lolos pipeline.
- `findAny()` : Mengembalikan elemen apapun yang pertama kali ditemukan (sangat cepat pada parallel stream).

#### Contoh

```java
import java.util.List;
import java.util.Optional;

public class ShortCircuitDemo {
    public static void main(String[] args) {
        List<Integer> numbers = List.of(1, 3, 5, 8, 9);

        // anyMatch langsung berhenti saat memeriksa angka 8 (genap)
        boolean adaGenap = numbers.stream().anyMatch(n -> n % 2 == 0);
        System.out.println("Apakah ada angka genap? " + adaGenap); // true

        // allMatch langsung berhenti di angka 1 (bukan genap)
        boolean semuaGenap = numbers.stream().allMatch(n -> n % 2 == 0);
        System.out.println("Apakah semua angka genap? " + semuaGenap); // false

        // findFirst
        Optional<Integer> genapPertama = numbers.stream()
            .filter(n -> n % 2 == 0)
            .findFirst();

        genapPertama.ifPresent(g -> System.out.println("Genap Pertama Ditemukan: " + g));
    }
}
```

#### Output

```text
Apakah ada angka genap? true
Apakah semua angka genap? false
Genap Pertama Ditemukan: 8
```

**Hafalan:**

```text
stream.anyMatch(predicate)  → memeriksa apakah minimal 1 elemen cocok (Short-Circuit)
stream.allMatch(predicate)  → memeriksa apakah seluruh elemen cocok (Short-Circuit)
stream.findFirst()          → mengambil elemen pertama yang lolos filter sebagai Optional<T>
```

---

<a id="bagian-20"></a>

## 20. 🔴 Collectors Dasar (`toList`, `toSet`, `toMap`, `joining`)

#### Konsep

Method `.collect(Collector)` adalah operasi terminal paling fleksibel untuk mengubah aliran data stream kembali menjadi struktur data koleksi penampung atau format string:
- `Collectors.toList()` / `.toList()` (Java 16+): Mengumpulkan ke dalam `List`.
- `Collectors.toSet()` : Mengumpulkan ke dalam `Set` unik.
- `Collectors.toMap(KeyMapper, ValueMapper)` : Mengumpulkan ke dalam `Map<K, V>`.
- `Collectors.joining(delimiter)` : Menggabungkan elemen String menjadi satu teks dengan pemisah pemisah tertentu.

#### Contoh

```java
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

record ProdukItem(String id, String nama, double harga) {}

public class CollectorsBaseDemo {
    public static void main(String[] args) {
        List<ProdukItem> produkList = List.of(
            new ProdukItem("P1", "Laptop", 15_000_000),
            new ProdukItem("P2", "Mouse", 150_000),
            new ProdukItem("P3", "Keyboard", 500_000)
        );

        // 1. toSet
        Set<String> namaSet = produkList.stream()
            .map(ProdukItem::nama)
            .collect(Collectors.toSet());
        System.out.println("Set Nama: " + namaSet);

        // 2. toMap (Key: ID Produk, Value: Harga)
        Map<String, Double> mapHarga = produkList.stream()
            .collect(Collectors.toMap(ProdukItem::id, ProdukItem::harga));
        System.out.println("Map ID -> Harga: " + mapHarga);

        // 3. joining String
        String csvNama = produkList.stream()
            .map(ProdukItem::nama)
            .collect(Collectors.joining(", ", "Daftar: [", "]"));
        System.out.println("Joining String: " + csvNama);
    }
}
```

#### Output

```text
Set Nama: [Keyboard, Mouse, Laptop]
Map ID -> Harga: {P1=15000000.0, P2=150000.0, P3=500000.0}
Joining String: Daftar: [Laptop, Mouse, Keyboard]
```

**Hafalan:**

```text
stream.collect(Collectors.toList())              → mengumpulkan aliran stream ke struktur data List
stream.collect(Collectors.toMap(keyFn, valFn))   → mengumpulkan aliran stream ke struktur data Map
stream.collect(Collectors.joining(delimiter))    → menggabungkan elemen teks menjadi satu string terformat
```

---

<a id="bagian-21"></a>

## 21. 🔴 Collectors Lanjutan: `groupingBy()` & `partitioningBy()`

#### Konsep

- **`Collectors.groupingBy(classifier)`:** Mengelompokkan elemen stream berdasarkan kriteria tertentu menjadi **`Map<Key, List<Item>>`** (setara dengan `GROUP BY` pada SQL database).
- **`Collectors.partitioningBy(predicate)`:** Kasus khusus grouping yang membagi elemen menjadi dua kelompok boolean: **`Map<Boolean, List<Item>>`** (kelompok `true` dan kelompok `false`).

#### Contoh

```java
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

record Transaksi(String id, String kategori, double nominal, boolean isLunas) {}

public class GroupingPartitionDemo {
    public static void main(String[] args) {
        List<Transaksi> daftar = List.of(
            new Transaksi("T1", "ELEKTRONIK", 5_000_000, true),
            new Transaksi("T2", "FASHION", 250_000, false),
            new Transaksi("T3", "ELEKTRONIK", 1_200_000, true),
            new Transaksi("T4", "KULINER", 75_000, true),
            new Transaksi("T5", "FASHION", 450_000, true)
        );

        // 1. GroupingBy Kategori (Map<String, List<Transaksi>>)
        Map<String, List<Transaksi>> groupKategori = daftar.stream()
            .collect(Collectors.groupingBy(Transaksi::kategori));

        System.out.println("--- Grouping Berdasarkan Kategori ---");
        groupKategori.forEach((kategori, list) -> 
            System.out.printf("Kategori %-10s : %d transaksi%n", kategori, list.size()));

        // 2. PartitioningBy Status Lunas (Map<Boolean, List<Transaksi>>)
        Map<Boolean, List<Transaksi>> partisiLunas = daftar.stream()
            .collect(Collectors.partitioningBy(Transaksi::isLunas));

        System.out.println("\n--- Partisi Status Lunas ---");
        System.out.println("Transaksi Lunas (true) : " + partisiLunas.get(true).size());
        System.out.println("Belum Lunas (false)    : " + partisiLunas.get(false).size());
    }
}
```

#### Output

```text
--- Grouping Berdasarkan Kategori ---
Kategori KULINER    : 1 transaksi
Kategori ELEKTRONIK : 2 transaksi
Kategori FASHION    : 2 transaksi

--- Partisi Status Lunas ---
Transaksi Lunas (true) : 4
Belum Lunas (false)    : 1
```

#### Cara Kerja

```text
Stream Transaksi ──> groupingBy(kategori) ──> Map: { ELEKTRONIK=[T1, T3], FASHION=[T2, T5], KULINER=[T4] }
```

**Hafalan:**

```text
Collectors.groupingBy(classifier)     → mengelompokkan elemen stream ke dalam Map<K, List<T>>
Collectors.partitioningBy(predicate)  → mempartisi elemen stream ke dalam Map<Boolean, List<T>>
```

---

<a id="bagian-22"></a>

## 22. 🔴 Downstream Collectors (`counting`, `mapping`, `summingDouble`, `averagingDouble`)

#### Konsep

`Collectors.groupingBy()` mendukung parameter kedua yang disebut **Downstream Collector** untuk melakukan kalkulasi agregasi langsung pada setiap kelompok data:
- `Collectors.counting()` : Menghitung jumlah elemen per kelompok.
- `Collectors.summingDouble(mapper)` : Menjumlahkan total nominal per kelompok.
- `Collectors.averagingDouble(mapper)` : Menghitung nilai rata-rata per kelompok.
- `Collectors.mapping(mapper, collector)` : Mentransformasikan objek sebelum dikumpulkan.

#### Contoh

```java
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class DownstreamCollectorDemo {
    public static void main(String[] args) {
        List<Transaksi> daftar = List.of(
            new Transaksi("T1", "ELEKTRONIK", 5_000_000, true),
            new Transaksi("T2", "FASHION", 250_000, true),
            new Transaksi("T3", "ELEKTRONIK", 1_200_000, true),
            new Transaksi("T4", "KULINER", 75_000, true),
            new Transaksi("T5", "FASHION", 450_000, true)
        );

        // 1. Menghitung Total Omset Penjualan per Kategori (Map<String, Double>)
        Map<String, Double> omsetPerKategori = daftar.stream()
            .collect(Collectors.groupingBy(
                Transaksi::kategori,
                Collectors.summingDouble(Transaksi::nominal)
            ));

        System.out.println("--- Total Omset Penjualan per Kategori ---");
        omsetPerKategori.forEach((kat, total) -> 
            System.out.printf("- %-11s : Rp %,12.2f%n", kat, total));

        // 2. Mengambil List ID Transaksi saja per Kategori (Map<String, List<String>>)
        Map<String, List<String>> idPerKategori = daftar.stream()
            .collect(Collectors.groupingBy(
                Transaksi::kategori,
                Collectors.mapping(Transaksi::id, Collectors.toList())
            ));

        System.out.println("\n--- ID Transaksi per Kategori ---");
        System.out.println(idPerKategori);
    }
}
```

#### Output

```text
--- Total Omset Penjualan per Kategori ---
- KULINER     : Rp    75,000.00
- ELEKTRONIK  : Rp 6,200,000.00
- FASHION     : Rp   700,000.00

--- ID Transaksi per Kategori ---
{KULINER=[T4], ELEKTRONIK=[T1, T3], FASHION=[T2, T5]}
```

**Hafalan:**

```text
groupingBy(keyFn, summingDouble(valFn)) → mengelompokkan data sekaligus menghitung total akumulasi per grup
```

---

<a id="bagian-23"></a>

## 23. 🔴 Lazy Evaluation pada Stream Pipeline

#### Konsep

Operasi perantara (*Intermediate Operations*) pada Stream API dieksekusi dengan prinsip **Lazy Evaluation**:
- Operasi `filter()`, `map()`, `sorted()` **tidak akan dieksekusi sama sekali** saat baris kode dideklarasikan.
- Mesin eksekusi Java baru mulai menarik data dan memprosesnya saat **Terminal Operation (seperti `findFirst()` atau `toList()`) dipanggil**.
- Proses dilakukan secara *vertikal per elemen* (bukan horizontal batch), sehingga jika menggunakan short-circuiting, elemen di belakang tidak akan pernah disentuh sama sekali.

#### Contoh

```java
import java.util.List;

public class LazyEvaluationDemo {
    public static void main(String[] args) {
        List<String> names = List.of("Ahmad", "Budi", "Citra", "Andi", "Dewi");

        System.out.println("Mendefinisikan pipeline stream...");
        var stream = names.stream()
            .filter(name -> {
                System.out.println("-> Filter dieksekusi untuk: " + name);
                return name.startsWith("A");
            })
            .map(name -> {
                System.out.println("--> Map toUpperCase untuk: " + name);
                return name.toUpperCase();
            });

        System.out.println("\nPipeline selesai didefinisikan (Belum ada filter/map yang jalan!).");
        System.out.println("\nMemanggil Terminal Operation findFirst()...");
        String hasil = stream.findFirst().orElse("NONE");

        System.out.println("\nHasil Akhir: " + hasil);
    }
}
```

#### Output

```text
Mendefinisikan pipeline stream...

Pipeline selesai didefinisikan (Belum ada filter/map yang jalan!).

Memanggil Terminal Operation findFirst()...
-> Filter dieksekusi untuk: Ahmad
--> Map toUpperCase untuk: Ahmad

Hasil Akhir: AHMAD
```

#### Cara Kerja

```text
Karena findFirst() hanya butuh 1 data, eksekusi BERHENTI setelah "Ahmad" lolos.
"Budi", "Citra", "Andi", "Dewi" TIDAK PERNAH DIPROSES sama sekali! (Super Hemat CPU)
```

**Hafalan:**

```text
Lazy Evaluation → operasi stream intermediate hanya dieksekusi saat dibutuhkan oleh terminal operation
```

---

<a id="bagian-24"></a>

## 24. 🔴 Parallel Stream (`parallelStream()` & ForkJoinPool)

#### Konsep

`parallelStream()` membagi aliran data menjadi beberapa pecahan sub-aliran (*sub-streams*) yang dieksekusi secara bersamaan (*multi-threaded*) di seluruh inti CPU komputer menggunakan **`ForkJoinPool.commonPool()`**.

Kapan menggunakan Parallel Stream?
- **Tepat Digunakan:** Kumpulan data sangat besar (> 100.000 elemen) dengan operasi komputasi berat per elemen (CPU-intensive).
- **BAHAYA / HINDARI JIKA:**
  - Ada manipulasi *shared mutable state* (dapat memicu race condition).
  - Kasus operasi I/O, database query, atau stream berukuran kecil (overhead pembuatan thread justru membuat kode lebih lambat).

#### Contoh

```java
import java.util.List;

public class ParallelStreamDemo {
    public static void main(String[] args) {
        List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8);

        System.out.println("Eksekusi Parallel Stream:");
        numbers.parallelStream().forEach(n -> {
            System.out.printf("Angka %d diproses oleh Thread: %s%n", n, Thread.currentThread().getName());
        });
    }
}
```

#### Output

```text
Eksekusi Parallel Stream:
Angka 6 diproses oleh Thread: main
Angka 2 diproses oleh Thread: ForkJoinPool.commonPool-worker-1
Angka 3 diproses oleh Thread: ForkJoinPool.commonPool-worker-2
Angka 8 diproses oleh Thread: main
Angka 1 diproses oleh Thread: ForkJoinPool.commonPool-worker-3
Angka 5 diproses oleh Thread: ForkJoinPool.commonPool-worker-1
Angka 4 diproses oleh Thread: ForkJoinPool.commonPool-worker-2
Angka 7 diproses oleh Thread: main
```

**Hafalan:**

```text
collection.parallelStream() → memproses pipeline data secara paralel memanfaatkan multi-core CPU
```

---

<a id="bagian-25"></a>

## 25. 🛠️ Peta Ingatan Cepat

```text
                         PETA JAVA FUNCTIONAL & STREAM
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
FUNCTIONAL INTERFACES          OPTIONAL PIPELINE              STREAM LIFECYCLE
├─ Consumer<T> (accept void)   ├─ ofNullable(val)             ├─ Source: list.stream()
├─ Supplier<T> (get T)         ├─ map(fn) / filter(pred)      ├─ Interm: filter, map, flatMap
├─ Function<T, R> (apply R)    ├─ orElse(defaultVal)          ├─ Terminal: toList, count, reduce
└─ Predicate<T> (test bool)    └─ orElseThrow(exSupplier)     └─ Collect: groupingBy, toMap
```

---

<a id="bagian-26"></a>

## 26. 📚 Tabel Ringkasan

| Konsep / Interface | Method Utama | Return Type | Karakteristik & Fungsi |
|---|---|---|---|
| `Consumer<T>` | `accept(T t)` | `void` | Menerima data tanpa nilai balik (logging, mutasi) |
| `Supplier<T>` | `get()` | `T` | Menghasilkan nilai data baru tanpa input (factory) |
| `Function<T, R>` | `apply(T t)` | `R` | Mentransformasikan data input T menjadi output R |
| `Predicate<T>` | `test(T t)` | `boolean` | Mengevaluasi kondisi kebenaran logika |
| `Optional<T>` | `orElseThrow(ex)` | `T` | Mengambil data aman atau melempar exception |
| `filter` | `filter(Predicate)` | `Stream<T>` | Menyaring elemen yang lolos kondisi |
| `map` | `map(Function)` | `Stream<R>` | Mengubah elemen 1-to-1 |
| `flatMap` | `flatMap(Function)` | `Stream<R>` | Meratakan sub-koleksi bertingkat menjadi 1 stream |
| `groupingBy` | `groupingBy(fn)` | `Map<K, List<T>>`| Mengelompokkan elemen ala SQL GROUP BY |
| `reduce` | `reduce(init, acc)` | `T` | Mengakumulasikan seluruh elemen menjadi 1 nilai |

---

<a id="bagian-27"></a>

## 27. ⚡ Cheat Code Java Lambda & Stream 10 Detik

```java
// 1. Filter, Map & toList
List<String> activeNames = users.stream()
    .filter(User::isActive)
    .map(User::getName)
    .toList();

// 2. GroupingBy Cepat
Map<String, List<User>> byRole = users.stream()
    .collect(Collectors.groupingBy(User::getRole));

// 3. Optional Safe Value
String email = userOpt.map(User::getEmail).orElse("no-email@domain.com");

// 4. Summing Nominal
double total = orders.stream().mapToDouble(Order::getAmount).sum();

// 5. Short-Circuit Check
boolean hasAdmin = users.stream().anyMatch(u -> "ADMIN".equals(u.getRole()));
```

---

<a id="bagian-28"></a>

## 28. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Kuasai Functional Interfaces & Lambda Syntax
├── Pahami 4 pilar: Consumer, Supplier, Function, Predicate
└── Biasakan Method Reference (::) untuk kode lebih ringkas
       │
       ▼
Langkah 2: Kuasai Optional<T>
├── Hentikan null check manual, gunakan map, orElse, dan orElseThrow
└── Terapkan sebagai standar return type pada Service Layer
       │
       ▼
Langkah 3: Kuasai Stream Pipeline Lifecycle
├── Pahami pemisahan Source, Intermediate (Lazy), dan Terminal (Eager)
└── Kuasai filter, map, flatMap, sorted, distinct, dan reduce
       │
       ▼
Langkah 4: Kuasai Collectors Lanjutan
├── Terapkan groupingBy bertingkat dan downstream aggregations
└── Pahami kapan aman menggunakan parallelStream()
       │
       ▼
Langkah 5: Siap Membangun RESTful API & Service Layer di Spring Boot!
```

---

<a id="bagian-29"></a>

## 29. 🏗️ Mini Project: Engine Pemrosesan & Analitik Transaksi Penjualan E-Commerce CLI

Aplikasi analitik laporan bisnis e-commerce yang mengintegrasikan: **Stream Pipeline, Multi-level Grouping, Downstream Aggregations (`summingDouble`, `counting`, `averagingDouble`), `flatMap`, `takeWhile`, dan `Optional` Handling**.

```java
import java.util.*;
import java.util.stream.Collectors;

record ItemPenjualan(String namaItem, int qty, double hargaSatuan) {
    public double getSubtotal() { return qty * hargaSatuan; }
}

record TransaksiPenjualan(
    String idTransaksi,
    String customerName,
    String kategori,
    String metodeBayar,
    List<ItemPenjualan> items,
    boolean isPaid
) {
    public double hitungTotalTransaksi() {
        return items.stream().mapToDouble(ItemPenjualan::getSubtotal).sum();
    }
}

public class SalesAnalyticsApp {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("   ENGINE ANALITIK PENJUALAN E-COMMERCE STREAM    ");
        System.out.println("==================================================");

        List<TransaksiPenjualan> dataTransaksi = List.of(
            new TransaksiPenjualan("TRX-01", "Budi Santoso", "ELEKTRONIK", "QRIS", List.of(
                new ItemPenjualan("MacBook Air M2", 1, 16_000_000),
                new ItemPenjualan("Mouse Wireless", 1, 350_000)
            ), true),
            new TransaksiPenjualan("TRX-02", "Siti Nurhaliza", "FASHION", "TRANSFER_BANK", List.of(
                new ItemPenjualan("Kemeja Flanel", 2, 250_000),
                new ItemPenjualan("Celana Chino", 1, 350_000)
            ), true),
            new TransaksiPenjualan("TRX-03", "Ahmad Farhan", "ELEKTRONIK", "QRIS", List.of(
                new ItemPenjualan("Mechanical Keyboard", 1, 1_200_000),
                new ItemPenjualan("Monitor 24 Inch", 1, 2_100_000)
            ), true),
            new TransaksiPenjualan("TRX-04", "Citra Dewi", "KULINER", "CASH", List.of(
                new ItemPenjualan("Kopi Arabika 250g", 3, 65_000)
            ), false), // Belum lunas
            new TransaksiPenjualan("TRX-05", "Doni Pratama", "FASHION", "QRIS", List.of(
                new ItemPenjualan("Jaket Parka", 1, 650_000)
            ), true)
        );

        // 1. Total Pendapatan Bersih dari Transaksi yang Lunas (filter + mapToDouble + sum)
        double totalOmsetLunas = dataTransaksi.stream()
            .filter(TransaksiPenjualan::isPaid)
            .mapToDouble(TransaksiPenjualan::hitungTotalTransaksi)
            .sum();

        System.out.printf("1. Total Omset Lunas : Rp %,14.2f%n", totalOmsetLunas);

        // 2. Daftar Seluruh Nama Produk Unik yang Terjual (flatMap + distinct + sorted)
        List<String> daftarProdukTerjual = dataTransaksi.stream()
            .filter(TransaksiPenjualan::isPaid)
            .flatMap(tx -> tx.items().stream())
            .map(ItemPenjualan::namaItem)
            .distinct()
            .sorted()
            .toList();

        System.out.println("\n2. Produk Unik Terjual (flatMap):");
        daftarProdukTerjual.forEach(p -> System.out.println("   - " + p));

        // 3. Omset Penjualan per Kategori (groupingBy + summingDouble)
        Map<String, Double> omsetPerKategori = dataTransaksi.stream()
            .filter(TransaksiPenjualan::isPaid)
            .collect(Collectors.groupingBy(
                TransaksiPenjualan::kategori,
                Collectors.summingDouble(TransaksiPenjualan::hitungTotalTransaksi)
            ));

        System.out.println("\n3. Total Omset per Kategori (groupingBy):");
        omsetPerKategori.forEach((kat, omset) -> 
            System.out.printf("   🏷️  %-12s : Rp %,14.2f%n", kat, omset));

        // 4. Jumlah Transaksi berdasarkan Metode Bayar (groupingBy + counting)
        Map<String, Long> metodeBayarCount = dataTransaksi.stream()
            .filter(TransaksiPenjualan::isPaid)
            .collect(Collectors.groupingBy(TransaksiPenjualan::metodeBayar, Collectors.counting()));

        System.out.println("\n4. Penggunaan Metode Pembayaran (counting):");
        metodeBayarCount.forEach((metode, jumlah) -> 
            System.out.printf("   💳 %-15s : %d transaksi%n", metode, jumlah));

        // 5. Transaksi Terbesar (max + Optional)
        Optional<TransaksiPenjualan> topTransaksi = dataTransaksi.stream()
            .filter(TransaksiPenjualan::isPaid)
            .max(Comparator.comparingDouble(TransaksiPenjualan::hitungTotalTransaksi));

        System.out.println("\n5. Transaksi Terbesar (max):");
        topTransaksi.ifPresent(tx -> 
            System.out.printf("   🏆 %s oleh %s (Rp %,.2f)%n", tx.idTransaksi(), tx.customerName(), tx.hitungTotalTransaksi()));

        System.out.println("\n==================================================");
        System.out.println("   ANALITIK PENJUALAN SELESAI DIPROSES BERSIH     ");
        System.out.println("==================================================");
    }
}
```

#### Output Demonstrasi

```text
==================================================
   ENGINE ANALITIK PENJUALAN E-COMMERCE STREAM    
==================================================
1. Total Omset Lunas : Rp  22,050,000.00

2. Produk Unik Terjual (flatMap):
   - Celana Chino
   - Jaket Parka
   - Kemeja Flanel
   - MacBook Air M2
   - Mechanical Keyboard
   - Monitor 24 Inch
   - Mouse Wireless

3. Total Omset per Kategori (groupingBy):
   🏷️  ELEKTRONIK   : Rp  19,650,000.00
   🏷️  FASHION      : Rp   2,400,000.00

4. Penggunaan Metode Pembayaran (counting):
   💳 QRIS            : 3 transaksi
   💳 TRANSFER_BANK   : 1 transaksi

5. Transaksi Terbesar (max):
   🏆 TRX-01 oleh Budi Santoso (Rp 16,350,000.00)

==================================================
   ANALITIK PENJUALAN SELESAI DIPROSES BERSIH     
==================================================
```

---

<a id="bagian-30"></a>

## 30. 🔗 Referensi Resmi

- [Oracle Java Functional Programming & Lambda Tutorial](https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html)
- [Java SE 21 Stream Package Specification](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/package-summary.html)
- [Oracle Optional Class API Specification](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Optional.html)
- [Java Collectors Utility Class API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Collectors.html)
