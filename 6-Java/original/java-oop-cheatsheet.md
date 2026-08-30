# Java OOP Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Java Modern (Java 21 LTS) untuk pemula yang ingin memahami konsep Object-Oriented Programming. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> Java adalah bahasa pemrograman berbasis objek murni di mana setiap fungsionalitas diorganisir dalam bentuk class dan object.

## Daftar Isi

1. [Pengenalan OOP](#1-pengenalan-oop)
2. [Class dan Object](#2-class-dan-object)
3. [Field](#3-field)
4. [Method](#4-method)
5. [Constructor](#5-constructor)
6. [Constructor Overloading](#6-constructor-overloading)
7. [Kata Kunci this](#7-kata-kunci-this)
8. [Inheritance](#8-inheritance)
9. [Kata Kunci super](#9-kata-kunci-super)
10. [Method Overriding](#10-method-overriding)
11. [Access Modifier](#11-access-modifier)
12. [Encapsulation](#12-encapsulation)
13. [Package dan Import](#13-package-dan-import)
14. [Polymorphism](#14-polymorphism)
15. [Type Check dan Cast (instanceof)](#15-type-check-dan-cast-instanceof)
16. [Abstract Class](#16-abstract-class)
17. [Interface](#17-interface)
18. [Interface Inheritance](#18-interface-inheritance)
19. [Default dan Static Method di Interface](#19-default-dan-static-method-di-interface)
20. [Anonymous Class](#20-anonymous-class)
21. [Inner Class](#21-inner-class)
22. [Static Keyword](#22-static-keyword)
23. [Final Keyword](#23-final-keyword)
24. [Sealed Class](#24-sealed-class)
25. [Enum](#25-enum)
26. [Object Class](#26-object-class)
27. [Exception](#27-exception)
28. [Custom Exception](#28-custom-exception)

---

# 1. Pengenalan OOP

OOP adalah paradigma pemrograman berdasarkan konsep "objek" yang berisi data (field/property) dan kode (method/behavior). 4 pilar utama OOP:
1. Encapsulation (Enkapsulasi)
2. Inheritance (Pewarisan)
3. Polymorphism (Polimorfisme)
4. Abstraction (Abstraksi)

---

# 2. Class dan Object

Class adalah cetak biru (blueprint), sedangkan Object adalah bentuk nyata (instance) dari class.

```java
class Person {
}

public class Main {
    public static void main(String[] args) {
        Person person1 = new Person();
        Person person2 = new Person();
    }
}
```

---

# 3. Field

Field adalah variabel yang dideklarasikan di dalam class untuk menyimpan status/data objek.

```java
class Person {
    String name;
    String address;
    final String country = "Indonesia";
}
```

---

# 4. Method

Method adalah fungsi yang menempel pada class/objek.

```java
class Person {
    String name;

    void sayHello(String paramName) {
        System.out.println("Hello " + paramName + ", my name is " + name);
    }
}
```

---

# 5. Constructor

Constructor adalah method khusus yang otomatis dipanggil saat objek dibuat dengan kata kunci `new`.

```java
class Person {
    String name;

    Person(String paramName) {
        name = paramName;
    }
}
```

---

# 6. Constructor Overloading

Class dapat memiliki lebih dari satu constructor dengan parameter berbeda.

```java
class Person {
    String name;
    String address;

    Person(String paramName) {
        name = paramName;
    }

    Person(String paramName, String paramAddress) {
        name = paramName;
        address = paramAddress;
    }

    Person() {
    }
}
```

---

# 7. Kata Kunci this

Kata kunci `this` merujuk ke objek saat ini, berguna untuk mengatasi shadowing dan memanggil constructor lain (`this()`).

```java
class Person {
    String name;
    String address;

    Person(String name, String address) {
        this.name = name;
        this.address = address;
    }

    Person(String name) {
        this(name, null); // Panggil constructor lain
    }
}
```

---

# 8. Inheritance

Inheritance memungkinkan sebuah class mewarisi field dan method dari class lain menggunakan kata kunci `extends`.

```java
class Manager {
    String name;

    void sayHello(String paramName) {
        System.out.println("Hello " + paramName + ", my name is Manager " + name);
    }
}

class VicePresident extends Manager {
}
```

---

# 9. Kata Kunci super

Kata kunci `super` digunakan untuk mengakses constructor atau method milik parent class.

```java
class VicePresident extends Manager {
    VicePresident(String name) {
        super(name); // Panggil parent constructor
    }

    void parentSayHello(String name) {
        super.sayHello(name); // Panggil parent method
    }
}
```

---

# 10. Method Overriding

Mendeklarasikan ulang method yang sudah ada di parent class dengan implementasi berbeda.

```java
class VicePresident extends Manager {
    @Override
    void sayHello(String paramName) {
        System.out.println("Hello " + paramName + ", my name is VP " + name);
    }
}
```

---

# 11. Access Modifier

Tingkat aksesibilitas class, field, dan method:
- `public`: Diakses dari mana saja.
- `protected`: Diakses dalam package yang sama dan subclass.
- `default` (no modifier): Diakses dalam package yang sama saja.
- `private`: Hanya diakses di dalam class yang sama.

---

# 12. Encapsulation

Menyembunyikan data sensitif menggunakan modifier `private` dan menyediakan akses melalui Getter dan Setter.

```java
class Product {
    private String name;
    private double price;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        if (price >= 0) {
            this.price = price;
        }
    }
}
```

---

# 13. Package dan Import

Package mengelompokkan class ke dalam direktori, dan import digunakan untuk menggunakan class dari package lain.

```java
package com.example.model;

import java.util.Date;
```

---

# 14. Polymorphism

Polymorphism memungkinkan sebuah objek memiliki banyak bentuk (berubah bentuk menjadi tipe parent-nya).

```java
Employee employee = new Employee("Budi");
employee = new Manager("Budi");
employee = new VicePresident("Budi");
```

---

# 15. Type Check dan Cast (instanceof)

Memeriksa tipe objek saat runtime dan melakukan konversi tipe data.

```java
// Modern Pattern Matching (Java 16+)
if (employee instanceof VicePresident vp) {
    System.out.println("Halo VP: " + vp.name);
} else if (employee instanceof Manager manager) {
    System.out.println("Halo Manager: " + manager.name);
}
```

---

# 16. Abstract Class

Class yang tidak dapat diinstansiasi langsung dan dapat memiliki abstract method (method tanpa body).

```java
abstract class Location {
    String name;
}

class City extends Location {
}
```

---

# 17. Interface

Kontrak perilaku murni yang seluruh method-nya abstract secara default. Menggunakan kata kunci `implements`.

```java
interface Car {
    void drive();
    int getTire();
}

class Avanza implements Car {
    public void drive() {
        System.out.println("Avanza drive");
    }

    public int getTire() {
        return 4;
    }
}
```

---

# 18. Interface Inheritance

Interface dapat mewarisi satu atau lebih interface lainnya menggunakan kata kunci `extends`.

```java
interface HasBrand {
    String getBrand();
}

interface Car extends HasBrand {
    void drive();
}
```

---

# 19. Default dan Static Method di Interface

Sejak Java 8, interface dapat memiliki concrete method dengan keyword `default` dan `static`.

```java
interface Vehicle {
    void drive();

    default boolean isMaintenance() {
        return false;
    }

    static void info() {
        System.out.println("Vehicle interface");
    }
}
```

---

# 20. Anonymous Class

Membuat instance objek dari interface/abstract class secara langsung tanpa membuat nama class terpisah.

```java
Car car = new Car() {
    public void drive() {
        System.out.println("Drive custom car");
    }

    public int getTire() {
        return 4;
    }
};
```

---

# 21. Inner Class

Class yang dideklarasikan di dalam class lain.

```java
class Company {
    private String name;

    class Employee {
        private String name;

        public String getCompanyName() {
            return Company.this.name; // Akses outer class
        }
    }
}
```

---

# 22. Static Keyword

Kata kunci `static` membuat field/method menjadi milik class secara global, bukan milik instance objek perorangan.

```java
class Application {
    public static final String VERSION = "1.0.0";

    public static void display() {
        System.out.println("App Version: " + VERSION);
    }
}
```

---

# 23. Final Keyword

- `final variable`: Nilai tidak bisa diubah (konstanta).
- `final method`: Method tidak bisa di-override oleh child class.
- `final class`: Class tidak bisa diwariskan / dijadikan parent.

---

# 24. Sealed Class

Sejak Java 17, `sealed class` digunakan untuk membatasi class mana saja yang diizinkan mewarisinya menggunakan keyword `permits`.

```java
public sealed class Shape permits Circle, Rectangle {}

public final class Circle extends Shape {}
public final class Rectangle extends Shape {}
```

---

# 25. Enum

Enum adalah tipe data khusus untuk mendefinisikan kumpulan konstanta bernilai tetap.

```java
public enum Level {
    STANDARD("Standard Level"),
    PREMIUM("Premium Level"),
    VIP("VIP Level");

    private final String description;

    Level(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
```

---

# 26. Object Class

`java.lang.Object` adalah root superclass dari semua class di Java. Method penting yang sering di-override:
- `toString()`
- `equals(Object obj)`
- `hashCode()`

---

# 27. Exception

Exception digunakan untuk menangani error saat runtime.
- **Checked Exception:** Wajib ditangani dengan `try-catch` atau dideklarasikan di signature method (`throws`).
- **Unchecked Exception:** Turunan dari `RuntimeException`, tidak wajib dideklarasikan secara eksplisit.

```java
try {
    // kode berisiko
} catch (Exception e) {
    // penanganan error
} finally {
    // selalu dieksekusi
}
```

---

# 28. Custom Exception

Membuat class exception buatan sendiri untuk kebutuhan domain logika aplikasi.

```java
public class ValidationException extends Exception {
    public ValidationException(String message) {
        super(message);
    }
}
```
