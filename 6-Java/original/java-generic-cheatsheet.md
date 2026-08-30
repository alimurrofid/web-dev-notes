# Java Generic Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Java Modern (Java 21 LTS) untuk pemula yang ingin memahami konsep Generic dan Type Safety. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> Java Generic memungkinkan pembuatan class, interface, dan method yang dapat bekerja dengan berbagai tipe data secara aman pada saat kompilasi (*compile-time type safety*) tanpa perlu *casting* manual.

## Daftar Isi

1. [Pengenalan Generic](#1-pengenalan-generic)
2. [Generic Class](#2-generic-class)
3. [Multiple Parameter Generic](#3-multiple-parameter-generic)
4. [Generic Method](#4-generic-method)
5. [Generic Interface](#5-generic-interface)
6. [Bounded Type Parameter](#6-bounded-type-parameter)
7. [Wildcard Unbounded](#7-wildcard-unbounded)
8. [Wildcard Bounded](#8-wildcard-bounded)
9. [Prinsip PECS](#9-prinsip-pecs)
10. [Type Erasure](#10-type-erasure)
11. [Batasan Generic](#11-batasan-generic)
12. [Generic Record](#12-generic-record)
13. [Comparable Generic](#13-comparable-generic)

---

# 1. Pengenalan Generic

Sebelum ada Generic di Java 5, developer menggunakan tipe `Object` yang berisiko memicu `ClassCastException` saat runtime. Generic memindahkan pengecekan error ke waktu kompilasi.

---

# 2. Generic Class

Mendefinisikan class dengan parameter tipe data yang fleksibel menggunakan tanda kurung siku `<T>`.

```java
public class Box<T> {
    private T data;

    public void set(T data) {
        this.data = data;
    }

    public T get() {
        return data;
    }
}
```

---

# 3. Multiple Parameter Generic

Class dapat menerima lebih dari satu parameter tipe, seperti `<K, V>`.

```java
public class Pair<K, V> {
    private K key;
    private V value;

    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public K getKey() { return key; }
    public V getValue() { return value; }
}
```

---

# 4. Generic Method

Method yang memiliki deklarasi type parameter sendiri sebelum tipe return.

```java
public class ArrayHelper {
    public static <T> int count(T[] array) {
        return array.length;
    }
}
```

---

# 5. Generic Interface

Interface yang mendefinisikan kontrak dengan tipe parameter generic.

```java
public interface Repository<T, ID> {
    void save(T entity);
    T findById(ID id);
}
```

---

# 6. Bounded Type Parameter

Membatasi tipe data generic yang diperbolehkan dengan kata kunci `extends`.

```java
public class NumberBox<T extends Number> {
    private T data;

    public NumberBox(T data) {
        this.data = data;
    }

    public double getDoubleValue() {
        return data.doubleValue();
    }
}
```

---

# 7. Wildcard Unbounded

Menggunakan tanda tanya `<?>` untuk menerima tipe data generic apapun.

```java
public static void printData(Box<?> box) {
    System.out.println(box.get());
}
```

---

# 8. Wildcard Bounded

- **Upper Bounded (`<? extends T>`):** Menerima `T` atau subclass-nya (Read-Only).
- **Lower Bounded (`<? super T>`):** Menerima `T` atau superclass-nya (Write-Only).

```java
// Upper Bounded
public static double sumOfList(List<? extends Number> list) {
    double s = 0.0;
    for (Number n : list) s += n.doubleValue();
    return s;
}

// Lower Bounded
public static void addNumbers(List<? super Integer> list) {
    list.add(10);
}
```

---

# 9. Prinsip PECS

**Producer Extends, Consumer Super:**
- Gunakan `<? extends T>` jika struktur data menghasilkan/mengeluarkan data (Producer/Read).
- Gunakan `<? super T>` jika struktur data menerima/menampung data (Consumer/Write).

---

# 10. Type Erasure

Proses di mana compiler Java menghapus seluruh informasi tipe generic saat membuat bytecode dan menggantinya dengan tipe `Object` atau tipe batasnya (*bound*).

---

# 11. Batasan Generic

- Tidak bisa membuat instance dari tipe parameter: `new T()` ❌
- Tidak bisa menggunakan tipe data primitif: `Box<int>` ❌ (Gunakan `Box<Integer>`)
- Tidak bisa membuat static field bertipe `T` ❌
- Tidak bisa menggunakan `instanceof` dengan generic type: `obj instanceof Box<String>` ❌
- Tidak bisa membuat generic exception class: `class MyException<T> extends Exception` ❌

---

# 12. Generic Record

Sejak Java 16, Record dapat dideklarasikan dengan tipe generic.

```java
public record Response<T>(boolean success, T data, String message) {}
```

---

# 13. Comparable Generic

Mengimplementasikan interface `Comparable<T>` untuk pengurutan objek yang type-safe.

```java
public class Mahasiswa implements Comparable<Mahasiswa> {
    private String nama;
    private double ipk;

    @Override
    public int compareTo(Mahasiswa other) {
        return Double.compare(this.ipk, other.ipk);
    }
}
```
