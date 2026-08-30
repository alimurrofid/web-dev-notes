# Java Lambda & Stream API Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Java Modern (Java 21 LTS) untuk pemula yang ingin memahami konsep Functional Programming, Lambda Expression, dan Stream API. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> Java 8 memperkenalkan paradigma Functional Programming melalui Lambda Expression dan Stream API, memungkinkan pemrosesan data koleksi secara deklaratif, ringkas, dan paralel.

## Daftar Isi

1. [Pengenalan Lambda](#1-pengenalan-lambda)
2. [Functional Interface](#2-functional-interface)
3. [Consumer Interface](#3-consumer-interface)
4. [Supplier Interface](#4-supplier-interface)
5. [Function Interface](#5-function-interface)
6. [Predicate Interface](#6-predicate-interface)
7. [Method Reference](#7-method-reference)
8. [Optional](#8-optional)
9. [Pengenalan Stream API](#9-pengenalan-stream-api)
10. [Membuat Stream](#10-membuat-stream)
11. [Stream Filter dan Map](#11-stream-filter-dan-map)
12. [Stream FlatMap](#12-stream-flatmap)
13. [Stream Slicing (Limit dan Skip)](#13-stream-slicing-limit-dan-skip)
14. [Stream Reduce dan Count](#14-stream-reduce-dan-count)
15. [Stream Matching](#15-stream-matching)
16. [Collectors toList dan toMap](#16-collectors-tolist-dan-tomap)
17. [Collectors GroupingBy](#17-collectors-groupingby)
18. [Parallel Stream](#18-parallel-stream)

---

# 1. Pengenalan Lambda

Lambda Expression adalah fungsi anonim (tanpa nama class/method) yang dapat disimpan dalam variabel atau dioper sebagai argumen method.

```java
// Sebelum Java 8 (Anonymous Class)
Runnable r1 = new Runnable() {
    public void run() { System.out.println("Hello"); }
};

// Dengan Lambda Expression
Runnable r2 = () -> System.out.println("Hello");
```

---

# 2. Functional Interface

Interface yang hanya memiliki tepat **satu abstract method** (Single Abstract Method / SAM), ditandai dengan anotasi `@FunctionalInterface`.

```java
@FunctionalInterface
public interface SimpleCalculator {
    int calculate(int a, int b);
}
```

---

# 3. Consumer Interface

Menerima satu nilai masukan dan tidak mengembalikan nilai apapun (`void`).

```java
Consumer<String> printer = text -> System.out.println("LOG: " + text);
printer.accept("Aplikasi dimulai");
```

---

# 4. Supplier Interface

Tidak menerima argumen apapun tetapi menghasilkan sebuah nilai kembalian.

```java
Supplier<Double> randomGen = () -> Math.random();
System.out.println("Angka acak: " + randomGen.get());
```

---

# 5. Function Interface

Menerima satu nilai masukan bertipe `T` dan mengembalikan nilai baru bertipe `R`.

```java
Function<String, Integer> lengthFinder = str -> str.length();
System.out.println(lengthFinder.apply("Java")); // 4
```

---

# 6. Predicate Interface

Menerima satu nilai masukan dan mengembalikan nilai `boolean` (`true`/`false`).

```java
Predicate<Integer> isEven = n -> n % 2 == 0;
System.out.println(isEven.test(4)); // true
```

---

# 7. Method Reference

Sintaks penyingkat lambda yang langsung merujuk ke method yang sudah ada menggunakan operator `::`.

```java
List<String> names = List.of("Ali", "Budi", "Citra");
names.forEach(System.out::println); // Method reference ke println
```

---

# 8. Optional

Class pembungkus untuk menghindari `NullPointerException`.

```java
Optional<String> name = Optional.ofNullable(null);
String result = name.orElse("Nama Default");
System.out.println(result); // Nama Default
```

---

# 9. Pengenalan Stream API

Stream adalah aliran data dari sumber (Collection/Array) yang diproses secara berurutan (*pipeline*) melalui operasi perantara (*intermediate*) dan operasi akhir (*terminal*).

```text
Source -> filter() -> map() -> collect()
```

---

# 10. Membuat Stream

```java
Stream<String> s1 = List.of("A", "B").stream();
Stream<String> s2 = Stream.of("X", "Y");
IntStream s3 = IntStream.range(1, 5); // 1, 2, 3, 4
```

---

# 11. Stream Filter dan Map

- `filter`: Menyaring data berdasarkan `Predicate`.
- `map`: Mengubah bentuk data berdasarkan `Function`.

```java
List<String> results = List.of("budi", "ahmad", "andi")
    .stream()
    .filter(name -> name.startsWith("a"))
    .map(String::toUpperCase)
    .toList(); // [AHMAD, ANDI]
```

---

# 12. Stream FlatMap

Meratakan elemen bersarang (misal: `List<List<T>>` menjadi `List<T>`).

```java
List<List<String>> nested = List.of(List.of("A", "B"), List.of("C", "D"));
List<String> flat = nested.stream()
    .flatMap(List::stream)
    .toList(); // [A, B, C, D]
```

---

# 13. Stream Slicing (Limit dan Skip)

```java
List<Integer> nums = List.of(1, 2, 3, 4, 5, 6)
    .stream()
    .skip(2)   // Lewati 1, 2
    .limit(3)  // Ambil 3, 4, 5
    .toList();
```

---

# 14. Stream Reduce dan Count

Operasi terminal untuk menggabungkan seluruh elemen menjadi satu nilai.

```java
int total = List.of(10, 20, 30)
    .stream()
    .reduce(0, (a, b) -> a + b); // 60
```

---

# 15. Stream Matching

- `anyMatch`: Minimal satu elemen memenuhi syarat.
- `allMatch`: Seluruh elemen wajib memenuhi syarat.
- `noneMatch`: Tidak ada satupun yang memenuhi syarat.

```java
boolean adaGenap = List.of(1, 3, 4).stream().anyMatch(n -> n % 2 == 0); // true
```

---

# 16. Collectors toList dan toMap

```java
List<String> list = Stream.of("A", "B").collect(Collectors.toList());
Map<String, Integer> map = Stream.of("Apel", "Pisang")
    .collect(Collectors.toMap(s -> s, String::length));
```

---

# 17. Collectors GroupingBy

Mengelompokkan elemen ke dalam `Map<Key, List<Item>>`.

```java
record User(String name, String role) {}
List<User> users = List.of(new User("Ali", "ADMIN"), new User("Budi", "USER"));

Map<String, List<User>> byRole = users.stream()
    .collect(Collectors.groupingBy(User::role));
```

---

# 18. Parallel Stream

Memproses stream secara paralel menggunakan multi-core CPU via ForkJoinPool.

```java
List.of(1, 2, 3, 4, 5).parallelStream().forEach(System.out::println);
```
