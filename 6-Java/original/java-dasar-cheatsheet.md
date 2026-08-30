# Java Dasar Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Java Modern (Java 21 LTS) untuk pemula. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> Java adalah bahasa pemrograman berorientasi objek yang bersifat *statically typed*, *compiled*, dan *platform independent* (Write Once, Run Anywhere via JVM).

## Daftar Isi

1. [Pengenalan Java](#1-pengenalan-java)
2. [Program Hello World](#2-program-hello-world)
3. [Komentar](#3-komentar)
4. [Tipe Data Number](#4-tipe-data-number)
5. [Tipe Data Character](#5-tipe-data-character)
6. [Tipe Data Boolean](#6-tipe-data-boolean)
7. [Tipe Data String](#7-tipe-data-string)
8. [Variable](#8-variable)
9. [Konversi Tipe Data Number](#9-konversi-tipe-data-number)
10. [Tipe Data Bukan Primitif](#10-tipe-data-bukan-primitif)
11. [Operator Matematika](#11-operator-matematika)
12. [Operator Perbandingan](#12-operator-perbandingan)
13. [Operator Logika](#13-operator-logika)
14. [Console Output](#14-console-output)
15. [Input Scanner](#15-input-scanner)
16. [Tipe Data Array](#16-tipe-data-array)
17. [Array Multidimensi](#17-array-multidimensi)
18. [If Statement](#18-if-statement)
19. [Switch Statement](#19-switch-statement)
20. [Ternary Operator](#20-ternary-operator)
21. [For Loop](#21-for-loop)
22. [For Each Loop](#22-for-each-loop)
23. [While Loop](#23-while-loop)
24. [Do While Loop](#24-do-while-loop)
25. [Break dan Continue](#25-break-dan-continue)
26. [Label](#26-label)
27. [Method](#27-method)
28. [Method Parameter](#28-method-parameter)
29. [Method Return Value](#29-method-return-value)
30. [Method Variable Argument](#30-method-variable-argument)
31. [Method Overloading](#31-method-overloading)
32. [Recursive Method](#32-recursive-method)
33. [Scope](#33-scope)
34. [String Method](#34-string-method)
35. [Text Block](#35-text-block)
36. [Math Class](#36-math-class)
37. [Record](#37-record)
38. [Try Catch](#38-try-catch)

---

# 1. Pengenalan Java

Java adalah bahasa pemrograman yang berjalan di atas Java Virtual Machine (JVM). Kode Java dikompilasi menjadi bytecode (`.class`) yang dapat dijalankan di berbagai sistem operasi.

```text
Source Code (.java) -> javac (Compiler) -> Bytecode (.class) -> JVM -> Mesin
```

---

# 2. Program Hello World

Setiap program Java harus berada di dalam sebuah class, dan titik awal eksekusi program adalah method `main`.

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

Output:
```text
Hello, World!
```

---

# 3. Komentar

```java
// Ini komentar satu baris

/*
  Ini komentar
  banyak baris
*/

/**
 * Ini Javadoc untuk dokumentasi resmi
 */
```

---

# 4. Tipe Data Number

Java memiliki dua kategori number: Integer (bilangan bulat) dan Floating Point (bilangan pecahan).

```java
byte tipeByte = 100;         // -128 s.d 127
short tipeShort = 10000;     // -32.768 s.d 32.767
int tipeInt = 1000000;       // -2 milyar s.d 2 milyar
long tipeLong = 1000000000L; // akhiran L

float tipeFloat = 10.5F;     // akhiran F
double tipeDouble = 10.5;    // default pecahan

int underscore = 1_000_000;  // pemisah visual
```

---

# 5. Tipe Data Character

Menggunakan petik tunggal (`'`).

```java
char hurufA = 'A';
char petik = '\'';
char tab = '\t';
```

---

# 6. Tipe Data Boolean

```java
boolean benar = true;
boolean salah = false;
```

---

# 7. Tipe Data String

String adalah tipe data non-primitif (object) yang merepresentasikan teks dan bersifat immutable.

```java
String namaDepan = "Budi";
String namaBelakang = "Setiawan";
String namaLengkap = namaDepan + " " + namaBelakang;
```

---

# 8. Variable

```java
String nama = "Eko";
int umur = 30;

final String NEGARA = "Indonesia"; // Nilai tetap (konstanta)

var kota = "Jakarta"; // Type inference otomatis (sejak Java 10)
```

---

# 9. Konversi Tipe Data Number

- **Widening (Otomatis):** byte -> short -> int -> long -> float -> double
- **Narrowing (Manual / Casting):** double -> float -> long -> int -> short -> byte

```java
int valInt = 1000;
double valDouble = valInt; // Widening

double pecahan = 9.78;
int bilanganBulat = (int) pecahan; // Narrowing: 9
```

---

# 10. Tipe Data Bukan Primitif

Setiap tipe primitif memiliki representasi objek (Wrapper Class) dengan nilai bawaan `null`.

```java
Byte objByte = 10;
Integer objInt = 100;
Double objDouble = 10.5;
Boolean objBool = true;

// Konversi primitif ke object (Autoboxing)
int angka = 50;
Integer wrapped = angka;

// Konversi object ke primitif (Unboxing)
int unwrapped = wrapped;
```

---

# 11. Operator Matematika

```java
int a = 10;
int b = 3;

int tambah = a + b; // 13
int kurang = a - b; // 7
int kali = a * b;   // 30
int bagi = a / b;   // 3 (integer division)
int sisa = a % b;   // 1

a += 5; // a = a + 5
a++;    // a = a + 1
```

---

# 12. Operator Perbandingan

```java
int x = 10;
int y = 20;

boolean sama = (x == y);      // false
boolean beda = (x != y);      // true
boolean lebihBesar = (x > y); // false

// Perbandingan String WAJIB memakai .equals()
String s1 = new String("Java");
String s2 = new String("Java");
boolean bandingString = s1.equals(s2); // true
```

---

# 13. Operator Logika

```java
boolean a = true;
boolean b = false;

boolean and = a && b; // false (short-circuit)
boolean or = a || b;  // true (short-circuit)
boolean not = !a;     // false
```

---

# 14. Console Output

```java
System.out.print("Satu ");
System.out.println("Dua");
System.out.printf("Nama: %s, Umur: %d, Nilai: %.2f\n", "Budi", 20, 87.5);
```

---

# 15. Input Scanner

```java
import java.util.Scanner;

public class InputExample {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Masukkan nama: ");
        String nama = scanner.nextLine();

        System.out.print("Masukkan umur: ");
        int umur = scanner.nextInt();

        System.out.println("Halo " + nama + ", umur " + umur);
        scanner.close();
    }
}
```

---

# 16. Tipe Data Array

```java
// Deklarasi dan inisialisasi
int[] angka = new int[3];
angka[0] = 10;
angka[1] = 20;
angka[2] = 30;

// Inisialisasi langsung
String[] buah = {"Apel", "Mangga", "Jeruk"};
int totalBuah = buah.length; // 3
```

---

# 17. Array Multidimensi

```java
int[][] matriks = {
    {1, 2, 3},
    {4, 5, 6}
};

System.out.println(matriks[0][1]); // 2
```

---

# 18. If Statement

```java
int nilai = 80;

if (nilai >= 90) {
    System.out.println("Nilai A");
} else if (nilai >= 75) {
    System.out.println("Nilai B");
} else {
    System.out.println("Nilai C");
}
```

---

# 19. Switch Statement

```java
// Classic switch
char grade = 'B';
switch (grade) {
    case 'A':
        System.out.println("Sangat Baik");
        break;
    case 'B':
        System.out.println("Baik");
        break;
    default:
        System.out.println("Cukup");
}

// Modern switch expression (Java 14+)
String ucapan = switch (grade) {
    case 'A' -> "Luar Biasa";
    case 'B' -> "Bagus Sekali";
    default -> "Perlu Peningkatan";
};
```

---

# 20. Ternary Operator

```java
int nilai = 75;
String hasil = (nilai >= 70) ? "Lulus" : "Tidak Lulus";
```

---

# 21. For Loop

```java
for (int i = 1; i <= 5; i++) {
    System.out.println("Iterasi ke-" + i);
}
```

---

# 22. For Each Loop

```java
String[] namaSiswa = {"Andi", "Budi", "Cici"};

for (String nama : namaSiswa) {
    System.out.println("Siswa: " + nama);
}
```

---

# 23. While Loop

```java
int counter = 1;
while (counter <= 5) {
    System.out.println("Counter: " + counter);
    counter++;
}
```

---

# 24. Do While Loop

```java
int counter = 100;
do {
    System.out.println("Pasti dijalankan minimal 1x");
    counter++;
} while (counter <= 5);
```

---

# 25. Break dan Continue

```java
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) {
        continue; // Lewati angka genap
    }
    if (i > 7) {
        break; // Hentikan loop
    }
    System.out.println(i); // 1, 3, 5, 7
}
```

---

# 26. Label

```java
loopLuar:
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        if (i == 2 && j == 2) {
            break loopLuar;
        }
        System.out.println(i + " - " + j);
    }
}
```

---

# 27. Method

```java
public class MethodExample {
    static void sayHello() {
        System.out.println("Hello Java!");
    }

    public static void main(String[] args) {
        sayHello();
    }
}
```

---

# 28. Method Parameter

```java
static void sapa(String nama, int umur) {
    System.out.println("Halo " + nama + ", umur " + umur);
}
```

---

# 29. Method Return Value

```java
static int tambah(int a, int b) {
    return a + b;
}
```

---

# 30. Method Variable Argument

```java
static int total(int... angka) {
    int hasil = 0;
    for (int val : angka) {
        hasil += val;
    }
    return hasil;
}

// Pemanggilan: total(10, 20, 30);
```

---

# 31. Method Overloading

```java
static int hitung(int a, int b) {
    return a + b;
}

static double hitung(double a, double b) {
    return a + b;
}
```

---

# 32. Recursive Method

```java
static int faktorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * faktorial(n - 1);
}
```

---

# 33. Scope

```java
public class ScopeExample {
    static void contoh() {
        int x = 10; // scope method
        if (x > 5) {
            int y = 20; // scope block
            System.out.println(x + y);
        }
        // y tidak bisa diakses di sini
    }
}
```

---

# 34. String Method

```java
String teks = "  Belajar Java  ";
int panjang = teks.length();               // 16
String bersih = teks.strip();              // "Belajar Java"
String besar = bersih.toUpperCase();       // "BELAJAR JAVA"
boolean ada = bersih.contains("Java");     // true
String ganti = bersih.replace("Java", "SE"); // "Belajar SE"
String[] kata = bersih.split(" ");         // ["Belajar", "Java"]
```

---

# 35. Text Block

```java
String json = """
    {
        "name": "Budi",
        "role": "Developer"
    }
    """;
```

---

# 36. Math Class

```java
int maks = Math.max(10, 20); // 20
double akar = Math.sqrt(64); // 8.0
double pangkat = Math.pow(2, 3); // 8.0
int acak = (int) (Math.random() * 100); // 0-99
```

---

# 37. Record

```java
public record User(String name, int age) {}

// Penggunaan:
// User user = new User("Eko", 25);
// System.out.println(user.name());
```

---

# 38. Try Catch

```java
try {
    int hasil = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Terjadi error: " + e.getMessage());
} finally {
    System.out.println("Selalu dieksekusi");
}
```
