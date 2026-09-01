# Java Dasar Cheatsheet Revised

> **Target:** Pemula yang baru mulai belajar pemrograman modern dengan Java (Java 21 LTS).
>
> Fokus cheatsheet ini: **mental model JVM → sintaks & class anatomi → tipe data & variabel → casting & wrapper class → operator & formatting → input scanner & array → control flow & loop → method & overloading → modern features (records, text blocks) → exception handling dasar & mini project konsol**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami untuk mulai menulis kode Java yang valid, aman, dan dapat dikompilasi

🟡 Lanjutan
→ pelajari setelah memahami tipe data, array, branching, loop, dan modularitas method

🔴 Advanced / Operasional
→ penting untuk pemahaman modern Java, fitur standar library esensial, dan exception handling
```

Mental model eksekusi Java dari Source Code sampai Mesin (JVM):

```text
        Source Code Java (.java)
                   │
                   ▼
         Java Compiler (javac)
                   │
                   ▼
          Bytecode (.class)
                   │
                   ▼
     ┌───────────────────────────┐
     │   Java Virtual Machine    │
     │          (JVM)            │
     ├─────────────┬─────────────┤
     │ ClassLoader │ Memory Area │
     │ Interpreter │ JIT (C1/C2) │
     └─────────────┴─────────────┘
                   │
                   ▼
      Instruksi Native Mesin OS
      (Windows / Linux / macOS)
```

**Hafalan:**

```text
JDK          → Java Development Kit: paket lengkap untuk developer (compiler javac, debugger, JRE)
JRE          → Java Runtime Environment: runtime untuk menjalankan aplikasi Java (JVM + Core Libs)
JVM          → Java Virtual Machine: mesin virtual penerjemah bytecode ke native machine code
Bytecode     → File biner .class hasil kompilasi javac yang platform-independent
WORA         → Write Once, Run Anywhere: tulis kode sekali, jalankan di OS mana pun selama ada JVM
Statically   → Tipe data setiap variabel wajib dideklarasikan dan diperiksa saat waktu kompilasi
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Java & Mental Model JVM](#bagian-1)
2. [Program Hello World & Anatomi Class Java](#bagian-2)
3. [Komentar & Dokumentasi Kode (Javadoc)](#bagian-3)
4. [Tipe Data Primitif Number (Integer & Floating Point)](#bagian-4)
5. [Tipe Data Character & Escape Sequences](#bagian-5)
6. [Tipe Data Boolean](#bagian-6)
7. [Tipe Data String & Immutability](#bagian-7)
8. [Variable, Type Inference (var) & Constant (final)](#bagian-8)
9. [Konversi Tipe Data Number (Widening vs Narrowing Casting)](#bagian-9)
10. [Tipe Data Bukan Primitif (Wrapper Class & Autoboxing)](#bagian-10)
11. [Operator Matematika & Penugasan](#bagian-11)
12. [Operator Perbandingan (== vs .equals())](#bagian-12)
13. [Operator Logika / Boolean (Short-Circuit)](#bagian-13)
14. [Output Konsol & Formatting (System.out.printf)](#bagian-14)
15. [Membaca Input Pengguna dengan Scanner](#bagian-15)
16. [Tipe Data Array 1 Dimensi](#bagian-16)
17. [Tipe Data Array Multidimensi & Jagged Array](#bagian-17)
18. [If, Else If, dan Else Statement](#bagian-18)

### 🟡 Lanjutan

19. [Switch Statement & Switch Expression Modern](#bagian-19)
20. [Ternary Operator (?:)](#bagian-20)
21. [For Loop Standar](#bagian-21)
22. [Enhanced For Loop (For-Each)](#bagian-22)
23. [While Loop](#bagian-23)
24. [Do-While Loop](#bagian-24)
25. [Break dan Continue](#bagian-25)
26. [Label pada Perulangan](#bagian-26)
27. [Method Dasar (Void & Return Value)](#bagian-27)
28. [Method Parameter & Argument Passing (Pass-by-Value)](#bagian-28)
29. [Method Variable Argument (Varargs)](#bagian-29)
30. [Method Overloading](#bagian-30)
31. [Recursive Method](#bagian-31)
32. [Variable Scope & Shadowing](#bagian-32)

### 🔴 Advanced / Operasional

33. [String Utility Methods Lengkap](#bagian-33)
34. [Text Blocks (Multiline String Modern)](#bagian-34)
35. [Math Utility Class (java.lang.Math)](#bagian-35)
36. [Record Dasar (Immutable Data Carrier)](#bagian-36)
37. [Penanganan Exception Dasar (try-catch-finally)](#bagian-37)

### 🛠️ Referensi & Praktik

38. [Peta Ingatan Cepat](#bagian-38)
39. [Tabel Ringkasan](#bagian-39)
40. [Cheat Code Java Dasar 10 Detik](#bagian-40)
41. [Urutan Belajar yang Disarankan](#bagian-41)
42. [Mini Project: Aplikasi Kasir & Inventaris Toko CLI](#bagian-42)
43. [Referensi Resmi](#bagian-43)

---

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan Java & Mental Model JVM

## Konsep

Java adalah bahasa pemrograman berorientasi objek yang bersifat **statically typed** dan **compiled to bytecode**. Berbeda dengan bahasa yang langsung dikompilasi ke binary mesin tertentu (seperti C/C++), Java mengompilasi kode sumber menjadi instruksi perantara yang disebut **Bytecode** (`.class`).

Bytecode ini kemudian dieksekusi oleh **Java Virtual Machine (JVM)**. JVM bertindak sebagai jembatan antara bytecode dan sistem operasi komputer, sehingga aplikasi Java dapat berjalan di Windows, Linux, maupun macOS tanpa perlu diubah kodenya (*Write Once, Run Anywhere*).

## Contoh

Alur kompilasi dan eksekusi manual via terminal:

```bash
# Langkah 1: Menulis kode pada file Main.java
# Langkah 2: Mengompilasi source code menjadi bytecode Main.class
javac Main.java

# Langkah 3: Menjalankan bytecode pada JVM (tanpa ekstensi .class)
java Main
```

## Output

```text
Program Java berhasil dijalankan di atas JVM.
```

## Cara Kerja

```text
         Developer menulis File.java
                     │
                     ▼
          javac File.java (Compiler)
                     │
                     ▼
             File.class (Bytecode)
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
   JVM Windows              JVM Linux
         │                       │
         ▼                       ▼
    Binary x86/ARM          Binary x86/ARM
```

**Hafalan:**

```text
javac file.java  → mengompilasi kode sumber Java menjadi file bytecode (.class)
java ClassName   → menjalankan class bytecode di atas Java Virtual Machine
```

## Best Practice

- Gunakan versi Java LTS (*Long Term Support*), seperti **Java 17** atau **Java 21**.
- Pastikan variabel environment `JAVA_HOME` dan `PATH` mengarah ke instalasi JDK yang sesuai di komputer Anda.

---

<a id="bagian-2"></a>

# 2. 🟢 Program Hello World & Anatomi Class Java

## Konsep

Di Java, **setiap kode program wajib berada di dalam sebuah class**. Nama public class harus sama persis dengan nama file fisik (termasuk huruf besar dan kecil / *case-sensitive*).

Titik masuk (*entry point*) eksekusi setiap program Java adalah method khusus dengan signature:
`public static void main(String[] args)`

## Contoh

File `Main.java`:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Dunia Java!");
    }
}
```

## Output

```text
Hello, Dunia Java!
```

## Cara Kerja

```text
              Sistem Operasi / Terminal
                         │
                         ▼
        JVM mencari method main(String[] args)
                         │
                         ▼
      Eksekusi baris System.out.println(...)
                         │
                         ▼
          Teks dicetak ke Standard Output
```

**Hafalan:**

```text
public           → modifier akses agar method/class dapat diakses oleh JVM dari luar
static           → method dapat dijalankan langsung tanpa perlu membuat objek / instance
void             → method tidak mengembalikan nilai apa pun ke pemanggil
main             → nama method utama standar yang dicari JVM sebagai titik mulai
String[] args    → array argumen baris perintah (command line arguments) yang dikirim saat runtime
```

## Kesalahan Umum

❌ Menamai file `main.java` padahal class-nya `public class Main` (Java bersifat *case-sensitive*).

✅ Pastikan nama file `Main.java` identik dengan `public class Main`.

---

<a id="bagian-3"></a>

# 3. 🟢 Komentar & Dokumentasi Kode (Javadoc)

## Konsep

Komentar adalah teks dalam program yang diabaikan oleh compiler. Komentar digunakan untuk memberikan penjelasan logika, catatan pengembangan, atau dokumentasi resmi API (*Javadoc*).

## Contoh

```java
public class KomentarExample {
    public static void main(String[] args) {
        // 1. Single-line comment: komentar satu baris

        /*
         * 2. Multi-line comment:
         * komentar yang mencakup
         * beberapa baris teks
         */

        System.out.println("Komentar tidak akan dieksekusi compiler.");
    }

    /**
     * Menghitung total harga setelah diskon.
     *
     * @param price Harga awal produk
     * @param discount Persentase diskon (0.0 - 1.0)
     * @return Harga akhir setelah dipotong diskon
     */
    public static double calculatePrice(double price, double discount) {
        return price - (price * discount);
    }
}
```

## Output

```text
Komentar tidak akan dieksekusi compiler.
```

## Cara Kerja

```text
          Source Code + Komentar
                    │
                    ▼
          javac Parser Lexer
                    │
       ┌────────────┴────────────┐
       ▼                         ▼
   Kode Program               Komentar
 (Diubah ke Bytecode)      (Dihapus/Dibuang)
```

**Hafalan:**

```text
// comment              → komentar satu baris
/* comment */           → komentar multi-baris
/** @param @return */   → format Javadoc untuk dokumentasi resmi class/method
```

## Best Practice

- Gunakan komentar untuk menjelaskan *mengapa* (alasan) suatu keputusan logika diambil, bukan sekadar mengulang *apa* yang dilakukan baris kode yang sudah jelas.
- Manfaatkan tag `@param` dan `@return` pada method public agar dokumentasi IDE dapat terbaca otomatis saat *hover*.

---

<a id="bagian-4"></a>

# 4. 🟢 Tipe Data Primitif Number (Integer & Floating Point)

## Konsep

Java menyediakan 8 tipe data primitif, 6 di antaranya adalah tipe number:
1. **Bilangan Bulat (Integer):** `byte` (8-bit), `short` (16-bit), `int` (32-bit, default), `long` (64-bit).
2. **Bilangan Pecahan (Floating Point):** `float` (32-bit), `double` (64-bit, default).

Sejak Java 7, kita dapat menggunakan tanda garis bawah (*underscore* `_`) sebagai pemisah angka agar lebih mudah dibaca manusia.

## Contoh

```java
public class NumberExample {
    public static void main(String[] args) {
        byte nilaiByte = 120;
        short nilaiShort = 30_000;
        int nilaiInt = 1_000_000_000;
        long nilaiLong = 9_000_000_000_000L; // Wajib akhiran L

        float nilaiFloat = 3.14F;             // Wajib akhiran F
        double nilaiDouble = 3.141592653589793;

        System.out.println("Byte: " + nilaiByte);
        System.out.println("Int: " + nilaiInt);
        System.out.println("Long: " + nilaiLong);
        System.out.println("Double: " + nilaiDouble);
    }
}
```

## Output

```text
Byte: 120
Int: 1000000000
Long: 9000000000000
Double: 3.141592653589793
```

## Cara Kerja

```text
┌───────────┬────────┬─────────────────────────────┬────────────────────────────┐
│ Tipe Data │ Ukuran │ Rentang Nilai Minimum       │ Rentang Nilai Maksimum     │
├───────────┼────────┼─────────────────────────────┼────────────────────────────┤
│ byte      │ 8-bit  │ -128                        │ 127                        │
│ short     │ 16-bit │ -32,768                     │ 32,767                     │
│ int       │ 32-bit │ -2,147,483,648              │ 2,147,483,647 (~2 Milyar)  │
│ long      │ 64-bit │ -9,223,372,036,854,775,808  │ 9,223,372,036,854,775,807  │
│ float     │ 32-bit │ ±1.4E-45                    │ ±3.4028235E38 (6-7 digit)  │
│ double    │ 64-bit │ ±4.9E-324                   │ ±1.7976931E308 (15 digit)  │
└───────────┴────────┴─────────────────────────────┴────────────────────────────┘
```

**Hafalan:**

```text
byte    → bilangan bulat mini (-128 s.d 127)
int     → bilangan bulat standar default Java (~2 Milyar)
long    → bilangan bulat raksasa (wajib akhiran L/l)
float   → bilangan pecahan presisi tunggal (wajib akhiran F/f)
double  → bilangan pecahan standar presisi ganda (default untuk desimal)
```

## Kesalahan Umum

❌ Menulis literal long tanpa `L` saat nilainya melebihi 2 milyar: `long x = 5000000000;` (compiler menganggap 5 milyar sebagai integer sehingga error *integer number too large*).

✅ Selalu sertakan huruf `L`: `long x = 5_000_000_000L;`.

---

<a id="bagian-5"></a>

# 5. 🟢 Tipe Data Character & Escape Sequences

## Konsep

Tipe data `char` digunakan untuk menyimpan satu karakter tunggal berbasis encoding Unicode (16-bit). Literal karakter **wajib diapit tanda petik tunggal (`'`)**, bukan petik ganda (`"`).

Karakter khusus dapat ditulis menggunakan **Escape Sequence** yang diawali tanda garis miring terbalik (`\`).

## Contoh

```java
public class CharExample {
    public static void main(String[] args) {
        char hurufA = 'A';
        char angkaKarakter = '9';
        char simbol = '€';

        // Escape sequences
        char tab = '\t';
        char newline = '\n';
        char petikTunggal = '\'';
        char backslash = '\\';

        System.out.println("Baris 1" + newline + "Baris 2 dengan tab:" + tab + hurufA);
        System.out.println("Karakter petik: " + petikTunggal + " dan backslash: " + backslash);
    }
}
```

## Output

```text
Baris 1
Baris 2 dengan tab:	A
Karakter petik: ' dan backslash: \
```

## Cara Kerja

```text
Input Teks Char     ->   Unicode Code Point   ->   Biner 16-bit di Memori
   'A'              ->        U+0041          ->     00000000 01000001
   '\n' (Line Feed) ->        U+000A          ->     00000000 00001010
   '\t' (Tab)       ->        U+0009          ->     00000000 00001001
```

**Hafalan:**

```text
char   → tipe 1 karakter tunggal diapit petik tunggal ('a', 'Z', '9')
\n     → karakter baris baru (newline)
\t     → karakter tab horizontal
\\     → karakter garis miring terbalik (backslash)
\'     → karakter petik tunggal di dalam literal karakter
\"     → karakter petik ganda di dalam string
```

---

<a id="bagian-6"></a>

# 6. 🟢 Tipe Data Boolean

## Konsep

Tipe data `boolean` hanya memiliki dua nilai yang valid: `true` (benar) atau `false` (salah). Tipe ini merupakan fondasi utama untuk seluruh percabangan logika (*if statement*) dan perulangan (*loop*).

Di Java, boolean **tidak dapat dikonversi ke angka 0 atau 1** secara otomatis (berbeda dengan C/C++ atau JavaScript).

## Contoh

```java
public class BooleanExample {
    public static void main(String[] args) {
        boolean isJavaFun = true;
        boolean isFishFlying = false;

        System.out.println("Apakah Java menyenangkan? " + isJavaFun);
        System.out.println("Apakah ikan terbang? " + isFishFlying);
    }
}
```

## Output

```text
Apakah Java menyenangkan? true
Apakah ikan terbang? false
```

## Cara Kerja

```text
Kondisi Evaluasi Program
           │
           ▼
┌──────────────────────┐
│ boolean: true/false  │
└──────────┬───────────┘
     ┌─────┴─────┐
     ▼           ▼
   true        false
 (Lanjut)     (Lewati)
```

**Hafalan:**

```text
boolean  → tipe data logika dengan dua nilai mutlak: true atau false
```

---

<a id="bagian-7"></a>

# 7. 🟢 Tipe Data String & Immutability

## Konsep

Tipe data `String` di Java adalah **tipe data non-primitif (Object / Reference Type)** yang merepresentasikan rangkaian karakter. Literal String ditulis dengan tanda petik ganda (`"`).

Sifat fundamental terpenting dari String di Java adalah **Immutable** (nilainya tidak dapat diubah setelah dibuat). Setiap kali Anda memodifikasi atau menggabungkan String, Java akan menciptakan objek String baru di memori (*String Constant Pool*).

## Contoh

```java
public class StringExample {
    public static void main(String[] args) {
        String firstName = "Budi";
        String lastName = "Santoso";

        // Penggabungan String (Concatenation)
        String fullName = firstName + " " + lastName;

        System.out.println("Nama Lengkap: " + fullName);
        System.out.println("Panjang Karakter: " + fullName.length());
        System.out.println("Huruf Kapital: " + fullName.toUpperCase());
    }
}
```

## Output

```text
Nama Lengkap: Budi Santoso
Panjang Karakter: 12
Huruf Kapital: BUDI SANTOSO
```

## Cara Kerja

```text
Variabel Stack                      String Constant Pool (Heap)
┌──────────────┐                   ┌─────────────────────────────┐
│ firstName    ├──────────────────>│ "Budi"                      │
├──────────────┤                   ├─────────────────────────────┤
│ lastName     ├──────────────────>│ "Santoso"                   │
├──────────────┤                   ├─────────────────────────────┤
│ fullName     ├──────────────────>│ "Budi Santoso" (Objek Baru) │
└──────────────┘                   └─────────────────────────────┘
```

**Hafalan:**

```text
String                → tipe data teks (objek) diapit tanda petik ganda ("...")
stringA + stringB     → menggabungkan dua string menjadi objek string baru
string.length()       → mengembalikan jumlah karakter dalam string
string.toUpperCase()  → menghasilkan salinan string baru dalam huruf besar semua
string.toLowerCase()  → menghasilkan salinan string baru dalam huruf kecil semua
```

## Best Practice

- Gunakan operator `+` untuk penggabungan string sederhana.
- Jika melakukan manipulasi / perulangan ribuan penggabungan string, gunakan class `StringBuilder` untuk efisiensi memori.

---

<a id="bagian-8"></a>

# 8. 🟢 Variable, Type Inference (var) & Constant (final)

## Konsep

Variabel adalah tempat di memori untuk menampung data. Karena Java bersifat *statically typed*, tipe data variabel harus diketahui sebelum program dijalankan.

- **Variabel Biasa:** nilainya dapat diubah sewaktu-waktu.
- **Konstanta (`final`):** nilainya dikunci dan tidak dapat diubah setelah inisialisasi pertama.
- **Type Inference (`var`):** sejak Java 10, keyword `var` dapat digunakan untuk variabel lokal di mana tipe data disimpulkan otomatis oleh compiler dari nilai inisialisasinya.

## Contoh

```java
public class VariableExample {
    public static void main(String[] args) {
        // Deklarasi eksplisit
        String applicationName = "Sistem Kasir";
        int stock = 50;
        stock = 45; // Nilai dapat diubah

        // Konstanta dengan keyword final
        final double TAX_RATE = 0.11; // 11% PPN
        // TAX_RATE = 0.12; // ERROR: cannot assign a value to final variable

        // Local variable type inference (var)
        var price = 25_000;          // Disimpulkan sebagai int
        var storeName = "Toko Berkah"; // Disimpulkan sebagai String

        System.out.println("Aplikasi: " + applicationName);
        System.out.println("Toko: " + storeName + ", Pajak: " + TAX_RATE);
        System.out.println("Stok sisa: " + stock + ", Harga: " + price);
    }
}
```

## Output

```text
Aplikasi: Sistem Kasir
Toko: Toko Berkah, Pajak: 0.11
Stok sisa: 45, Harga: 25000
```

## Cara Kerja

```text
               Deklarasi var x = 100
                         │
                         ▼
        Compiler membaca nilai literal (100)
                         │
                         ▼
        Tipe data 'int' dikunci permanen
       (Bukan tipe dinamis seperti di JS/PHP)
```

**Hafalan:**

```text
dataType name = value;  → deklarasi variabel dengan tipe eksplisit
final dataType NAME     → membuat variabel konstan yang tidak dapat diubah nilainya
var name = value;       → type inference otomatis oleh compiler untuk variabel lokal
```

## Kesalahan Umum

❌ Mendeklarasikan `var` tanpa nilai inisialisasi: `var total;` (compiler tidak bisa menebak tipe datanya).

✅ Selalu sertakan nilai awal saat menggunakan `var`: `var total = 0;`.

---

<a id="bagian-9"></a>

# 9. 🟢 Konversi Tipe Data Number (Widening vs Narrowing Casting)

## Konsep

Konversi number terjadi saat nilai satu tipe number diubah ke tipe number lainnya:

1. **Widening Casting (Otomatis / Implisit):** Mengubah tipe kecil ke tipe lebih besar (`byte -> short -> int -> long -> float -> double`). Aman karena tidak ada data yang hilang.
2. **Narrowing Casting (Manual / Eksplisit):** Mengubah tipe besar ke tipe lebih kecil (`double -> float -> long -> int -> short -> byte`). Wajib menyertakan tanda kurung `(targetType)` dan berisiko kehilangan presisi (*data loss*) atau *integer overflow*.

## Contoh

```java
public class CastingExample {
    public static void main(String[] args) {
        // 1. Widening Casting (Otomatis)
        int nilaiInt = 500;
        double nilaiDouble = nilaiInt; // int ke double otomatis
        System.out.println("Widening (int ke double): " + nilaiDouble);

        // 2. Narrowing Casting (Manual)
        double pecahan = 9.87;
        int bulat = (int) pecahan; // Memotong angka di belakang koma (truncation)
        System.out.println("Narrowing (double ke int): " + bulat);

        // 3. Fenomena Overflow
        int angkaBesar = 130;
        byte angkaByte = (byte) angkaBesar; // byte max 127
        System.out.println("Overflow int (130) ke byte: " + angkaByte);
    }
}
```

## Output

```text
Widening (int ke double): 500.0
Narrowing (double ke int): 9
Overflow int (130) ke byte: -126
```

## Cara Kerja

```text
Widening (Aman - Otomatis):
byte ──> short ──> int ──> long ──> float ──> double

Narrowing (Manual - Berisiko Potong/Overflow):
double ──> float ──> long ──> int ──> short ──> byte
           (Syntax: (targetType) value)
```

**Hafalan:**

```text
(targetType) value  → memaksa konversi nilai ke tipe target secara eksplisit (casting)
```

## Best Practice

- Selalu periksa rentang nilai sebelum melakukan *narrowing casting* untuk menghindari *overflow* tak terduga.
- Ingat bahwa konversi dari `double` ke `int` membuang desimal (bukan pembulatan matematika).

---

<a id="bagian-10"></a>

# 10. 🟢 Tipe Data Bukan Primitif (Wrapper Class & Autoboxing)

## Konsep

Tipe data primitif (`int`, `double`, `boolean`, dll.) menyimpan nilai secara langsung di memori stack dan **tidak dapat bernilai `null`**.

Namun, Java menyediakan **Wrapper Class** (tipe objek representatif untuk setiap primitif) yang dapat bernilai `null` dan memiliki method bantuan:
- `byte` $\rightarrow$ `Byte`
- `short` $\rightarrow$ `Short`
- `int` $\rightarrow$ `Integer`
- `long` $\rightarrow$ `Long`
- `float` $\rightarrow$ `Float`
- `double` $\rightarrow$ `Double`
- `char` $\rightarrow$ `Character`
- `boolean` $\rightarrow$ `Boolean`

Konversi otomatis antara primitif dan wrapper disebut **Autoboxing** dan **Unboxing**.

## Contoh

```java
public class WrapperExample {
    public static void main(String[] args) {
        // Inisialisasi Wrapper Class (bisa null)
        Integer jumlahBarang = null;
        System.out.println("Jumlah barang awal: " + jumlahBarang);

        // Autoboxing: primitif int otomatis dibungkus ke Integer objek
        int angkaPrimitif = 100;
        Integer angkaObjek = angkaPrimitif;

        // Unboxing: Integer objek otomatis dibuka menjadi primitif int
        int konversiBalik = angkaObjek;

        // Method parsing bawaan Wrapper Class
        String strAngka = "2500";
        int parsedInt = Integer.parseInt(strAngka);
        double parsedDouble = Double.parseDouble("99.99");

        System.out.println("Hasil Parse: " + (parsedInt + 500));
        System.out.println("Parsed Double: " + parsedDouble);
    }
}
```

## Output

```text
Jumlah barang awal: null
Hasil Parse: 3000
Parsed Double: 99.99
```

## Cara Kerja

```text
             Primitif (int, 100)
                     │
         Autoboxing  │  Unboxing
       (Integer.valueOf) (intValue())
                     ▼
            Objek Wrapper (Integer)
```

**Hafalan:**

```text
Integer.parseInt(text)     → mengonversi String teks angka menjadi tipe primitif int
Double.parseDouble(text)   → mengonversi String teks desimal menjadi tipe primitif double
Boolean.parseBoolean(text) → mengonversi String "true"/"false" menjadi tipe primitif boolean
```

## Kesalahan Umum

❌ Melakukan unboxing pada objek wrapper yang bernilai `null`:
`Integer x = null; int y = x;` $\rightarrow$ Menghasilkan runtime error `NullPointerException`.

✅ Selalu periksa `if (x != null)` sebelum melakukan operasi aritmatika pada objek wrapper.

---

<a id="bagian-11"></a>

# 11. 🟢 Operator Matematika & Penugasan

## Konsep

Java mendukung operator aritmatika standar: penjumlahan (`+`), pengurangan (`-`), perkalian (`*`), pembagian (`/`), dan sisa bagi / modulo (`%`).

- **Integer Division:** Pembagian antara dua bilangan bulat menghasilkan bilangan bulat (desimal dibuang).
- **Augmented Assignment:** Singkatan operator penugasan seperti `+=`, `-=`, `*=`, `/=`, `%=`.
- **Unary Operator:** Increment `++` (tambah 1) dan Decrement `--` (kurang 1).

## Contoh

```java
public class MathOperators {
    public static void main(String[] args) {
        int a = 10;
        int b = 3;

        System.out.println("Penjumlahan (10 + 3): " + (a + b)); // 13
        System.out.println("Pengurangan (10 - 3): " + (a - b)); // 7
        System.out.println("Perkalian (10 * 3)  : " + (a * b)); // 30
        System.out.println("Pembagian Int (10 / 3): " + (a / b)); // 3
        System.out.println("Pembagian Desimal   : " + ((double) a / b)); // 3.3333333333333335
        System.out.println("Modulo Sisa (10 % 3): " + (a % b)); // 1

        // Augmented Assignment
        int saldo = 1000;
        saldo += 500; // saldo = saldo + 500 -> 1500
        saldo -= 200; // saldo = saldo - 200 -> 1300
        System.out.println("Saldo Akhir: " + saldo);

        // Unary increment
        int counter = 5;
        counter++; // counter menjadi 6
        System.out.println("Counter: " + counter);
    }
}
```

## Output

```text
Penjumlahan (10 + 3): 13
Pengurangan (10 - 3): 7
Perkalian (10 * 3)  : 30
Pembagian Int (10 / 3): 3
Pembagian Desimal   : 3.3333333333333335
Modulo Sisa (10 % 3): 1
Saldo Akhir: 1300
Counter: 6
```

## Cara Kerja

```text
Ekspresi: 10 / 3      ==>  Kedua operand int     ==> Hasil: 3 (Integer)
Ekspresi: (double)10/3 ==>  Salah satu double     ==> Hasil: 3.33333... (Double)
```

**Hafalan:**

```text
left + right   → menjumlahkan left dan right
left - right   → mengurangkan right dari left
left * right   → mengalikan left dengan right
left / right   → membagi left dengan right
left % right   → menghasilkan sisa pembagian (modulo)
variable += amount → menambah nilai variable sejumlah amount
variable++     → menambah nilai variable sebanyak 1 (post-increment)
```

---

<a id="bagian-12"></a>

# 12. 🟢 Operator Perbandingan (== vs .equals())

## Konsep

Operator perbandingan menghasilkan nilai boolean `true` atau `false`:
- `>` (lebih besar dari)
- `<` (lebih kecil dari)
- `>=` (lebih besar atau sama dengan)
- `<=` (lebih kecil atau sama dengan)
- `==` (sama dengan nilai / referensi memori)
- `!=` (tidak sama dengan)

> [!IMPORTANT]
> **Perbedaan Krusial `==` vs `.equals()`:**
> - Operator `==` pada tipe primitif membandingkan **nilainya**.
> - Operator `==` pada Objek (seperti `String`) membandingkan **alamat memori (referensi)**.
> - Method `.equals()` membandingkan **isi teks / konten sebenarnya** dari objek.

## Contoh

```java
public class ComparisonExample {
    public static void main(String[] args) {
        int x = 10;
        int y = 20;

        System.out.println("x > y  : " + (x > y));  // false
        System.out.println("x <= y : " + (x <= y)); // true
        System.out.println("x != y : " + (x != y)); // true

        // Perbandingan String
        String str1 = "Java";
        String str2 = new String("Java");

        System.out.println("== referensi memori: " + (str1 == str2));      // false
        System.out.println(".equals() isi konten: " + str1.equals(str2));   // true
        System.out.println("equalsIgnoreCase   : " + str1.equalsIgnoreCase("JAVA")); // true
    }
}
```

## Output

```text
x > y  : false
x <= y : true
x != y : true
== referensi memori: false
.equals() isi konten: true
equalsIgnoreCase   : true
```

## Cara Kerja

```text
Variabel Stack                      Heap Memory
┌───────────┐                      ┌──────────────────────┐
│ str1      ├─────────────────────>│ "Java" (Pool @0x101) │
├───────────┤                      ├──────────────────────┤
│ str2      ├─────────────────────>│ "Java" (Heap @0x202) │
└───────────┘                      └──────────────────────┘

str1 == str2      ==> 0x101 == 0x202  ==> false (Beda Alamat)
str1.equals(str2) ==> "Java" == "Java" ==> true  (Sama Konten)
```

**Hafalan:**

```text
left == right                 → perbandingan kesamaan nilai (primitif) atau referensi (objek)
left != right                 → perbandingan ketidaksamaan nilai
source.equals(target)         → membandingkan kesamaan konten objek String secara case-sensitive
source.equalsIgnoreCase(target) → membandingkan kesamaan konten String tanpa membedakan huruf besar/kecil
```

## Kesalahan Umum

❌ Membandingkan dua string menggunakan `if (input == "admin")` (sering menghasilkan bug false saat string dibaca dari Scanner atau Database).

✅ Selalu gunakan `.equals()`: `if ("admin".equals(input))`.

---

<a id="bagian-13"></a>

# 13. 🟢 Operator Logika / Boolean (Short-Circuit)

## Konsep

Operator logika digunakan untuk menggabungkan dua atau lebih ekspresi boolean:
1. `&&` (**AND Logika / Short-Circuit**): Menghasilkan `true` jika kedua sisi bernilai `true`. Jika operand kiri bernilai `false`, sisi kanan **tidak dievaluasi sama sekali**.
2. `||` (**OR Logika / Short-Circuit**): Menghasilkan `true` jika salah satu sisi bernilai `true`. Jika operand kiri sudah `true`, sisi kanan **tidak dievaluasi**.
3. `!` (**NOT Logika / Negasi**): Membalikkan nilai boolean (`!true` menjadi `false`, `!false` menjadi `true`).

## Contoh

```java
public class LogicalOperators {
    public static void main(String[] args) {
        int nilaiUjian = 85;
        int nilaiAbsensi = 80;

        boolean lulusUjian = nilaiUjian >= 75;     // true
        boolean lulusAbsensi = nilaiAbsensi >= 75; // true

        // Operator AND (&&)
        boolean lulusFinal = lulusUjian && lulusAbsensi;
        System.out.println("Lulus Kelulusan Final: " + lulusFinal);

        // Operator OR (||)
        boolean dapatRemedial = (nilaiUjian < 75) || (nilaiAbsensi < 75);
        System.out.println("Perlu Remedial: " + dapatRemedial);

        // Operator NOT (!)
        System.out.println("Status Tidak Lulus: " + !lulusFinal);

        // Short-Circuit Safety: Mencegah NullPointerException
        String teks = null;
        if (teks != null && teks.length() > 0) {
            System.out.println("Teks ada");
        } else {
            System.out.println("Teks bernilai null / aman dari crash!");
        }
    }
}
```

## Output

```text
Lulus Kelulusan Final: true
Perlu Remedial: false
Status Tidak Lulus: false
Teks bernilai null / aman dari crash!
```

## Cara Kerja

```text
Ekspresi: (A && B)
Eval A ───> false ───> STOP (Hasil Langsung false, B diabaikan)
       ───> true  ───> Eval B ───> Hasil sesuai B

Ekspresi: (A || B)
Eval A ───> true  ───> STOP (Hasil Langsung true, B diabaikan)
       ───> false ───> Eval B ───> Hasil sesuai B
```

**Hafalan:**

```text
conditionA && conditionB → menghasilkan true jika KEDUA kondisi bernilai true
conditionA || conditionB → menghasilkan true jika SALAH SATU kondisi bernilai true
!condition               → membalikkan nilai boolean (true <-> false)
```

---

<a id="bagian-14"></a>

# 14. 🟢 Output Konsol & Formatting (System.out.printf)

## Konsep

Java menyediakan tiga method utama pada objek `System.out`:
1. `print()`: Mencetak teks tanpa membuat baris baru di akhir.
2. `println()`: Mencetak teks dan menambahkan karakter *newline* (ganti baris).
3. `printf()` / `format()`: Mencetak teks dengan format template specifier (`%s`, `%d`, `%f`, dll.).

## Contoh

```java
public class OutputExample {
    public static void main(String[] args) {
        String nama = "Ahmad";
        int umur = 22;
        double ipk = 3.8765;

        // Print biasa vs Println
        System.out.print("Memuat data... ");
        System.out.println("Selesai!");

        // Printf dengan format specifier
        // %s = String, %d = Integer, %.2f = Float/Double 2 angka di belakang koma, %n = newline
        System.out.printf("Nama : %s%n", nama);
        System.out.printf("Umur : %d tahun%n", umur);
        System.out.printf("IPK  : %.2f%n", ipk);
        System.out.printf("Tabel: | %-10s | %5d | %6.2f |%n", nama, umur, ipk);
    }
}
```

## Output

```text
Memuat data... Selesai!
Nama : Ahmad
Umur : 22 tahun
IPK  : 3.88
Tabel: | Ahmad      |    22 |   3.88 |
```

## Cara Kerja

```text
Template String: "Nama: %s, Usia: %d" + Argumen ("Ahmad", 22)
                         │
                         ▼
        Formatter Engine menyuntikkan data
                         │
                         ▼
             "Nama: Ahmad, Usia: 22"
```

**Hafalan:**

```text
System.out.print(message)                   → mencetak teks tanpa ganti baris
System.out.println(message)                 → mencetak teks lalu pindah ke baris baru
System.out.printf(format, arguments)        → mencetak teks terformat dengan format specifier
%s                                          → format specifier untuk teks (String)
%d                                          → format specifier untuk bilangan bulat (Integer)
%.2f                                        → format specifier untuk bilangan desimal dengan 2 angka pecahan
%n                                          → platform-independent newline (ganti baris)
```

---

<a id="bagian-15"></a>

# 15. 🟢 Membaca Input Pengguna dengan Scanner

## Konsep

Untuk membaca input teks dari pengguna melalui terminal, Java menyediakan class `java.util.Scanner` yang membungkus stream `System.in`.

Method pembacaan Scanner yang sering digunakan:
- `nextLine()`: Membaca seluruh baris input teks (termasuk spasi).
- `nextInt()`: Membaca nilai bilangan bulat `int`.
- `nextDouble()`: Membaca nilai pecahan `double`.
- `nextBoolean()`: Membaca nilai boolean.

> [!WARNING]
> **Masalah "Newline Trap" pada Scanner:**
> Saat Anda memanggil `nextInt()` kemudian memanggil `nextLine()`, karakter *Enter* (`\n`) yang tersisa di buffer akan langsung terbaca oleh `nextLine()`. Solusinya adalah memanggil `scanner.nextLine()` kosong sebagai pembersih buffer.

## Contoh

```java
import java.util.Scanner;

public class ScannerExample {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Masukkan umur Anda: ");
        int umur = scanner.nextInt();

        // Mengonsumsi sisa newline \n di buffer
        scanner.nextLine();

        System.out.print("Masukkan nama lengkap: ");
        String nama = scanner.nextLine();

        System.out.print("Masukkan saldo awal: ");
        double saldo = scanner.nextDouble();

        System.out.println("\n=== DATA PENGGUNA ===");
        System.out.printf("Nama  : %s%n", nama);
        System.out.printf("Umur  : %d tahun%n", umur);
        System.out.printf("Saldo : Rp %,.2f%n", saldo);

        scanner.close(); // Menutup scanner
    }
}
```

## Output

```text
Masukkan umur Anda: 25
Masukkan nama lengkap: Budi Pratama
Masukkan saldo awal: 1500000

=== DATA PENGGUNA ===
Nama  : Budi Pratama
Umur  : 25 tahun
Saldo : Rp 1,500,000.00
```

## Cara Kerja

```text
Keyboard User ──> System.in (Buffer Input Stream)
                        │
                        ▼
                Scanner (Parser)
       ┌────────────────┼────────────────┐
       ▼                ▼                ▼
  nextInt()        nextDouble()      nextLine()
 (Baca Angka)     (Baca Desimal)   (Baca Satu Baris)
```

**Hafalan:**

```text
Scanner scanner = new Scanner(System.in); → membuat objek pembaca input dari keyboard
scanner.nextLine()                       → membaca 1 baris teks sampai karakter enter ditekan
scanner.nextInt()                        → membaca nilai input berupa integer
scanner.nextDouble()                     → membaca nilai input berupa desimal (double)
scanner.close()                          → menutup resource scanner setelah selesai digunakan
```

---

<a id="bagian-16"></a>

# 16. 🟢 Tipe Data Array 1 Dimensi

## Konsep

Array adalah struktur data yang menampung sekumpulan nilai dengan **tipe data yang sama** dan memiliki **panjang ukuran tetap (fixed-size)** yang dialokasikan saat pertama kali dibuat.

Indeks array di Java selalu dimulai dari angka **0** sampai dengan `length - 1`. Mengakses indeks di luar rentang tersebut akan memicu `ArrayIndexOutOfBoundsException`.

## Contoh

```java
public class ArrayExample {
    public static void main(String[] args) {
        // Cara 1: Alokasi dengan keyword new dan menentukan kapasitas
        int[] numbers = new int[3];
        numbers[0] = 10;
        numbers[1] = 25;
        numbers[2] = 50;

        // Cara 2: Array Initializer langsung dengan nilai
        String[] fruits = {"Apel", "Mangga", "Pisang", "Jeruk"};

        // Mengakses data array
        System.out.println("Elemen pertama buah: " + fruits[0]);
        System.out.println("Jumlah total buah: " + fruits.length);

        // Mengubah nilai elemen array
        fruits[1] = "Alpukat";
        System.out.println("Buah index ke-1 setelah diubah: " + fruits[1]);
    }
}
```

## Output

```text
Elemen pertama buah: Apel
Jumlah total buah: 4
Buah index ke-1 setelah diubah: Alpukat
```

## Cara Kerja

```text
fruits Array di Memori Heap:
Index:       [0]         [1]         [2]         [3]
Nilai:    ┌──────────┬──────────┬──────────┬──────────┐
          │  "Apel"  │ "Alpukat"│ "Pisang" │ "Jeruk"  │
          └──────────┴──────────┴──────────┴──────────┘
Kapasitas: fruits.length == 4
```

**Hafalan:**

```text
dataType[] arrayName = new dataType[size]; → membuat array baru dengan kapasitas ukuran tetap size
dataType[] arrayName = {val1, val2, val3}; → inisialisasi array langsung dengan nilai elemen
arrayName[index]                           → mengakses atau mengubah elemen pada posisi index (mulai dari 0)
arrayName.length                           → properti untuk mengetahui total jumlah elemen dalam array
```

## Kesalahan Umum

❌ Menulis `fruits.length()` dengan kurung seperti pada String (Array menggunakan properti field `.length` tanpa tanda kurung).

✅ Gunakan `array.length` untuk array, dan `string.length()` untuk string.

---

<a id="bagian-17"></a>

# 17. 🟢 Tipe Data Array Multidimensi & Jagged Array

## Konsep

Array Multidimensi di Java adalah "Array di dalam Array". Bentuk paling umum adalah Array 2 Dimensi yang merepresentasikan tabel matriks baris dan kolom.

Karena diimplementasikan sebagai array dari array, Java mendukung **Jagged Array** (array 2D di mana setiap baris memiliki jumlah kolom yang berbeda-beda).

## Contoh

```java
public class MultiArrayExample {
    public static void main(String[] args) {
        // 1. Matriks 2D Simetris (2 Baris x 3 Kolom)
        int[][] matriks = {
            {1, 2, 3}, // Baris 0
            {4, 5, 6}  // Baris 1
        };

        System.out.println("Akses baris 0, kolom 2: " + matriks[0][2]); // 3
        System.out.println("Akses baris 1, kolom 1: " + matriks[1][1]); // 5

        // 2. Jagged Array (Panjang kolom bervariasi)
        String[][] kelompok = {
            {"Ali", "Budi"},               // Baris 0: 2 anggota
            {"Citra", "Dewi", "Eko", "Fani"} // Baris 1: 4 anggota
        };

        System.out.println("Jumlah anggota kelompok 0: " + kelompok[0].length);
        System.out.println("Jumlah anggota kelompok 1: " + kelompok[1].length);
    }
}
```

## Output

```text
Akses baris 0, kolom 2: 3
Akses baris 1, kolom 1: 5
Jumlah anggota kelompok 0: 2
Jumlah anggota kelompok 1: 4
```

## Cara Kerja

```text
matriks Referensi
       │
       ▼
┌──────────────┐
│ [0] (Baris 0)├───────> ┌───┬───┬───┐ (1, 2, 3)
├──────────────┤         └───┴───┴───┘
│ [1] (Baris 1)├───────> ┌───┬───┬───┐ (4, 5, 6)
└──────────────┘         └───┴───┴───┘
```

**Hafalan:**

```text
dataType[][] arrayName = new dataType[rows][columns]; → membuat array 2D dengan jumlah baris dan kolom tertentu
arrayName[row][column]                               → mengakses elemen pada baris row dan kolom column
```

---

<a id="bagian-18"></a>

# 18. 🟢 If, Else If, dan Else Statement

## Konsep

Struktur percabangan logika kondisional digunakan untuk mengeksekusi blok kode tertentu hanya ketika suatu kondisi boolean terpenuhi (`true`).

- `if`: Kondisi awal.
- `else if`: Kondisi alternatif jika kondisi sebelumnya salah.
- `else`: Blok default jika seluruh kondisi sebelumnya tidak terpenuhi.

## Contoh

```java
public class IfStatementExample {
    public static void main(String[] args) {
        int score = 82;
        char grade;
        String status;

        if (score >= 85) {
            grade = 'A';
            status = "Sangat Memuaskan";
        } else if (score >= 75) {
            grade = 'B';
            status = "Memuaskan";
        } else if (score >= 60) {
            grade = 'C';
            status = "Cukup";
        } else {
            grade = 'D';
            status = "Tidak Lulus";
        }

        System.out.printf("Skor: %d -> Grade: %c (%s)%n", score, grade, status);
    }
}
```

## Output

```text
Skor: 82 -> Grade: B (Memuaskan)
```

## Cara Kerja

```text
                Evaluasi Kondisi 1 (score >= 85)
                               │
                ┌──────────────┴──────────────┐
             [true]                        [false]
                │                             │
                ▼                             ▼
        Eksekusi Blok A          Evaluasi Kondisi 2 (score >= 75)
                                              │
                               ┌──────────────┴──────────────┐
                            [true]                        [false]
                               │                             │
                               ▼                             ▼
                       Eksekusi Blok B               Lanjut ke Else ...
```

**Hafalan:**

```text
if (condition) { statement }                    → eksekusi blok jika condition bernilai true
else if (condition) { statement }               → evaluasi alternatif jika kondisi sebelumnya false
else { statement }                              → eksekusi blok default jika semua kondisi di atas false
```

---

<a id="bagian-19"></a>

# 19. 🟡 Switch Statement & Switch Expression Modern

## Konsep

Switch statement digunakan untuk memilih salah satu dari banyak cabang berdasarkan nilai tunggal (tipe: `int`, `byte`, `short`, `char`, `String`, atau `enum`).

Sejak **Java 14**, Java memperkenalkan **Switch Expression** dengan arrow syntax (`case ->`) yang lebih ringkas, aman dari *fall-through bug*, serta dapat menghasilkan nilai kembalian langsung (*expression value*).

## Contoh

```java
public class SwitchExample {
    public static void main(String[] args) {
        String level = "VIP";

        // 1. Classic Switch Statement (Perlu break)
        double diskonClassic;
        switch (level) {
            case "VIP":
                diskonClassic = 0.20;
                break;
            case "MEMBER":
                diskonClassic = 0.10;
                break;
            default:
                diskonClassic = 0.0;
                break;
        }

        // 2. Modern Switch Expression (Java 14+ Arrow Syntax)
        double diskonModern = switch (level) {
            case "VIP" -> 0.20;
            case "MEMBER" -> 0.10;
            case "GUEST", "NON_MEMBER" -> 0.0; // Multi-case
            default -> {
                System.out.println("Level tidak dikenal!");
                yield 0.0; // yield digunakan jika ada multi-baris blok
            }
        };

        System.out.println("Diskon Classic: " + diskonClassic);
        System.out.println("Diskon Modern : " + diskonModern);
    }
}
```

## Output

```text
Diskon Classic: 0.2
Diskon Modern : 0.2
```

## Cara Kerja

```text
               Nilai Target Switch
                        │
       ┌────────────────┼────────────────┐
       ▼                ▼                ▼
  case "VIP"      case "MEMBER"      default
       │                │                │
       ▼                ▼                ▼
   Return 0.20      Return 0.10      Return 0.0
```

**Hafalan:**

```text
switch (variable) { case value -> result; } → switch expression modern menghasilkan nilai tanpa risiko fall-through
yield value                                 → mengembalikan nilai dari blok multi-baris di dalam switch expression
```

## Best Practice

- Utamakan penggunaan **Switch Expression (`case ->`)** modern karena lebih bersih dan tidak memerlukan keyword `break` manual.

---

<a id="bagian-20"></a>

# 20. 🟡 Ternary Operator (?:)

## Konsep

Ternary operator adalah bentuk singkat dari percabangan `if-else` sederhana yang mengembalikan sebuah nilai dalam satu baris ekspresi.

Format:
`kondisi ? nilaiJikaTrue : nilaiJikaFalse;`

## Contoh

```java
public class TernaryExample {
    public static void main(String[] args) {
        int nilai = 78;

        // If-Else biasa
        String hasilIfElse;
        if (nilai >= 75) {
            hasilIfElse = "Lulus";
        } else {
            hasilIfElse = "Remedial";
        }

        // Ternary operator
        String hasilTernary = (nilai >= 75) ? "Lulus" : "Remedial";

        System.out.println("Hasil Ternary: " + hasilTernary);
    }
}
```

## Output

```text
Hasil Ternary: Lulus
```

## Cara Kerja

```text
(kondisi)  ───> true  ───> Ambil nilai setelah tanda tanya (?)
           ───> false ───> Ambil nilai setelah tanda titik dua (:)
```

**Hafalan:**

```text
condition ? valueIfTrue : valueIfFalse → shorthand evaluasi kondisi if-else menghasilkan satu nilai
```

---

<a id="bagian-21"></a>

# 21. 🟡 For Loop Standar

## Konsep

`for` loop digunakan ketika kita mengetahui secara pasti berapa kali iterasi perulangan perlu dilakukan. Loop ini terdiri dari tiga bagian utama:
1. **Inisialisasi:** Deklarasi variabel counter awal.
2. **Kondisi:** Syarat perulangan terus berjalan selama bernilai `true`.
3. **Post-Statement:** Perubahan counter (biasanya increment `++` atau decrement `--`) di setiap akhir putaran.

## Contoh

```java
public class ForLoopExample {
    public static void main(String[] args) {
        // Loop maju 1 sampai 5
        System.out.println("Loop Maju:");
        for (int i = 1; i <= 5; i++) {
            System.out.println("Iterasi ke-" + i);
        }

        // Loop mundur 5 sampai 1
        System.out.println("\nLoop Mundur:");
        for (int i = 5; i >= 1; i--) {
            System.out.print(i + " ");
        }
        System.out.println();
    }
}
```

## Output

```text
Loop Maju:
Iterasi ke-1
Iterasi ke-2
Iterasi ke-3
Iterasi ke-4
Iterasi ke-5

Loop Mundur:
5 4 3 2 1 
```

## Cara Kerja

```text
1. Inisialisasi: int i = 1
       │
       ▼
2. Cek Kondisi (i <= 5) ───[false]───> KELUAR LOOP
       │
     [true]
       │
       ▼
3. Eksekusi Blok Body Program
       │
       ▼
4. Post-Statement: i++
       │
       └───────> Kembali ke Langkah 2
```

**Hafalan:**

```text
for (init; condition; post) { statement } → melakukan iterasi berulang selama condition bernilai true
```

---

<a id="bagian-22"></a>

# 22. 🟡 Enhanced For Loop (For-Each)

## Konsep

Enhanced For Loop (*For-Each Loop*) diperkenalkan untuk mempermudah pembacaan seluruh elemen array atau koleksi tanpa perlu mengelola variabel index counter manual.

## Contoh

```java
public class ForEachExample {
    public static void main(String[] args) {
        String[] daftarKota = {"Jakarta", "Bandung", "Surabaya", "Yogyakarta"};

        // For-Each Loop
        for (String kota : daftarKota) {
            System.out.println("Nama Kota: " + kota);
        }
    }
}
```

## Output

```text
Nama Kota: Jakarta
Nama Kota: Bandung
Nama Kota: Surabaya
Nama Kota: Yogyakarta
```

## Cara Kerja

```text
Array: ["Jakarta", "Bandung", "Surabaya", "Yogyakarta"]
              │
    Iterasi 1 ├──> kota = "Jakarta"   ──> Eksekusi Body
    Iterasi 2 ├──> kota = "Bandung"   ──> Eksekusi Body
    Iterasi 3 ├──> kota = "Surabaya"  ──> Eksekusi Body
    Iterasi 4 └──> kota = "Yogyakarta"──> Eksekusi Body
```

**Hafalan:**

```text
for (dataType element : collection) { statement } → membaca setiap item dalam array/koleksi dari awal sampai akhir
```

## Best Practice

- Gunakan *For-Each* saat Anda hanya butuh membaca data.
- Gunakan *For Loop standar* jika Anda memerlukan nomor index elemen atau ingin mengubah isi elemen array tersebut.

---

<a id="bagian-23"></a>

# 23. 🟡 While Loop

## Konsep

`while` loop adalah perulangan yang memeriksa kondisi di awal **sebelum** mengeksekusi blok kode di dalamnya. Jika kondisi awal bernilai `false`, blok kode **tidak akan pernah dijalankan sama sekali**.

Loop ini sangat cocok digunakan saat jumlah perulangan tidak diketahui secara pasti (misalnya perulangan menu sampai user memilih keluar).

## Contoh

```java
public class WhileLoopExample {
    public static void main(String[] args) {
        int counter = 1;

        while (counter <= 4) {
            System.out.println("Perulangan while ke-" + counter);
            counter++; // Wajib ada agar tidak terjadi infinite loop
        }
    }
}
```

## Output

```text
Perulangan while ke-1
Perulangan while ke-2
Perulangan while ke-3
Perulangan while ke-4
```

## Cara Kerja

```text
         Cek Kondisi (counter <= 4)
                      │
        ┌─────────────┴─────────────┐
     [true]                      [false]
        │                           │
        ▼                           ▼
Eksekusi Body + counter++      Selesai Loop
        │
        └─────> Kembali ke Cek Kondisi
```

**Hafalan:**

```text
while (condition) { statement } → mengulang eksekusi kode selama condition bernilai true
```

---

<a id="bagian-24"></a>

# 24. 🟡 Do-While Loop

## Konsep

Berbeda dengan `while` loop, `do-while` loop mengevaluasi kondisi perulangan di **akhir**. Artinya, blok kode di dalam `do-while` **pasti dieksekusi minimal 1 kali**, meskipun kondisinya bernilai `false` sejak awal.

## Contoh

```java
public class DoWhileExample {
    public static void main(String[] args) {
        int angka = 100;

        do {
            System.out.println("Pasti dijalankan minimal 1 kali! Nilai angka: " + angka);
            angka++;
        } while (angka <= 5); // Kondisi langsung bernilai false (101 <= 5)
    }
}
```

## Output

```text
Pasti dijalankan minimal 1 kali! Nilai angka: 100
```

## Cara Kerja

```text
        1. Eksekusi Blok Body (Minimal 1x)
                       │
                       ▼
        2. Evaluasi Kondisi (angka <= 5)
                       │
        ┌──────────────┴──────────────┐
     [true]                        [false]
        │                             │
        ▼                             ▼
Ulangi Langkah 1                Keluar dari Loop
```

**Hafalan:**

```text
do { statement } while (condition); → mengeksekusi body minimal 1x, lalu mengulang selama condition bernilai true
```

---

<a id="bagian-25"></a>

# 25. 🟡 Break dan Continue

## Konsep

Dua kata kunci untuk mengontrol jalannya perulangan:
- `break`: Menghentikan seluruh proses perulangan seketika dan langsung keluar dari loop.
- `continue`: Menghentikan iterasi putaran saat ini dan langsung melompat ke putaran/iterasi berikutnya.

## Contoh

```java
public class BreakContinueExample {
    public static void main(String[] args) {
        System.out.println("Demo Continue (Lewati Angka Genap):");
        for (int i = 1; i <= 6; i++) {
            if (i % 2 == 0) {
                continue; // Lewati angka genap
            }
            System.out.println("Angka Ganjil: " + i);
        }

        System.out.println("\nDemo Break (Hentikan saat angka == 4):");
        for (int i = 1; i <= 10; i++) {
            if (i == 4) {
                System.out.println("Ketemu 4! Berhenti.");
                break; // Keluar dari loop
            }
            System.out.println("Nilai: " + i);
        }
    }
}
```

## Output

```text
Demo Continue (Lewati Angka Genap):
Angka Ganjil: 1
Angka Ganjil: 3
Angka Ganjil: 5

Demo Break (Hentikan saat angka == 4):
Nilai: 1
Nilai: 2
Nilai: 3
Ketemu 4! Berhenti.
```

## Cara Kerja

```text
for-loop iterasi
       │
       ├────> ketemu 'continue' ───> Langsung ke iterasi berikutnya
       │
       └────> ketemu 'break'    ───> Hancurkan loop & keluar
```

**Hafalan:**

```text
break    → menghentikan dan keluar dari struktur perulangan atau switch seketika
continue → melompati sisa instruksi iterasi saat ini dan lanjut ke iterasi berikutnya
```

---

<a id="bagian-26"></a>

# 26. 🟡 Label pada Perulangan

## Konsep

Secara default, `break` dan `continue` hanya berlaku untuk loop yang paling dalam (*innermost loop*).

Jika kita memiliki perulangan bersarang (*nested loop*) dan ingin menghentikan loop terluar secara langsung, kita dapat menyematkan sebuah **Label** pada loop terluar.

## Contoh

```java
public class LabelExample {
    public static void main(String[] args) {
        outerLoop: // Definisi Label
        for (int baris = 1; baris <= 3; baris++) {
            for (int kolom = 1; kolom <= 3; kolom++) {
                if (baris == 2 && kolom == 2) {
                    System.out.println("Kondisi tercapai di (2,2) -> Break Outer Loop!");
                    break outerLoop; // Keluar dari outerLoop seketika
                }
                System.out.printf("Baris: %d, Kolom: %d%n", baris, kolom);
            }
        }
    }
}
```

## Output

```text
Baris: 1, Kolom: 1
Baris: 1, Kolom: 2
Baris: 1, Kolom: 3
Baris: 2, Kolom: 1
Kondisi tercapai di (2,2) -> Break Outer Loop!
```

## Cara Kerja

```text
outerLoop: for (...)
     │
     └──> innerLoop: for (...)
                 │
           break outerLoop ──────> Langsung loncat ke luar outerLoop
```

**Hafalan:**

```text
labelName: for (...)     → menandai blok perulangan dengan nama pengenal label
break labelName;         → menghentikan loop bertanda labelName dari dalam nested loop
continue labelName;      → melanjutkan iterasi loop bertanda labelName
```

---

<a id="bagian-27"></a>

# 27. 🟡 Method Dasar (Void & Return Value)

## Konsep

Method adalah blok kode yang berisi serangkaian instruksi untuk melakukan tugas spesifik yang dapat dipanggil berulang kali (*reusable*).

- **Method `void`:** Method yang hanya mengeksekusi tugas tanpa mengembalikan nilai data apapun.
- **Method dengan Return Value:** Method yang wajib mengembalikan data dengan tipe yang telah ditentukan menggunakan kata kunci `return`.

## Contoh

```java
public class MethodExample {
    // 1. Method void (tidak mengembalikan nilai)
    static void sapaPengguna(String nama) {
        System.out.println("Halo, selamat datang " + nama + "!");
    }

    // 2. Method dengan return value (tipe int)
    static int hitungLuasPersegi(int sisi) {
        int luas = sisi * sisi;
        return luas; // Mengembalikan hasil perhitungan
    }

    public static void main(String[] args) {
        sapaPengguna("Andi");

        int sisi = 5;
        int hasilLuas = hitungLuasPersegi(sisi);
        System.out.printf("Luas persegi dengan sisi %d adalah %d%n", sisi, hasilLuas);
    }
}
```

## Output

```text
Halo, selamat datang Andi!
Luas persegi dengan sisi 5 adalah 25
```

## Cara Kerja

```text
        Pemanggil: main()
               │
               ├──> Panggil hitungLuasPersegi(5)
               │            │
               │            ▼
               │     Hitung: 5 * 5 = 25
               │            │
               │            ▼
               │     return 25
               │            │
               ▼<───────────┘
        hasilLuas = 25
```

**Hafalan:**

```text
static returnType methodName(parameters) { return value; } → mendefinisikan method berpenghasil nilai balik
static void methodName(parameters) { statement }          → mendefinisikan prosedur method tanpa nilai balik
return value;                                             → mengembalikan value ke pemanggil dan mengakhiri method
```

---

<a id="bagian-28"></a>

# 28. 🟡 Method Parameter & Argument Passing (Pass-by-Value)

## Konsep

Java selalu menggunakan mekanisme **Pass-by-Value** untuk seluruh pengiriman argumen ke parameter method:

1. **Pada Tipe Primitif:** Yang disalin adalah **nilai datanya**. Perubahan nilai parameter di dalam method tidak mempengaruhi variabel asli di pemanggil.
2. **Pada Tipe Objek/Array:** Yang disalin adalah **nilai referensi memorinya**. Mengubah isi data di dalam objek/array akan berdampak pada objek asli, tetapi menugaskan ulang (*reassign*) referensi baru tidak akan mengubah referensi asli.

## Contoh

```java
public class ParameterPassingExample {
    static void ubahPrimitif(int angka) {
        angka = 999; // Hanya mengubah salinan lokal
    }

    static void ubahArray(int[] data) {
        data[0] = 999; // Mengubah konten di alamat memori heap yang sama
    }

    public static void main(String[] args) {
        int nilaiAwal = 10;
        ubahPrimitif(nilaiAwal);
        System.out.println("Nilai primitif setelah method: " + nilaiAwal); // Tetap 10

        int[] arrayAwal = {10, 20, 30};
        ubahArray(arrayAwal);
        System.out.println("Array index 0 setelah method: " + arrayAwal[0]); // Berubah jadi 999
    }
}
```

## Output

```text
Nilai primitif setelah method: 10
Array index 0 setelah method: 999
```

## Cara Kerja

```text
Stack Frame main()                    Stack Frame ubahPrimitif()
┌──────────────────┐                  ┌──────────────────┐
│ nilaiAwal = 10   │ ──(Salin Nilai)─>│ angka = 10 -> 999│
└──────────────────┘                  └──────────────────┘

Stack Frame main()                    Heap Memory
┌──────────────────┐                  ┌────────────────────────┐
│ arrayAwal (0xAA) ├─────────┐        │ [0]: 10 -> 999         │
└──────────────────┘         │        │ [1]: 20                │
                             ├───────>│ [2]: 30                │
Stack Frame ubahArray()      │        └────────────────────────┘
┌──────────────────┐         │
│ data (0xAA)      ├─────────┘
└──────────────────┘
```

**Hafalan:**

```text
Pass-by-Value (Primitive) → menyalin nilai literal murni; variabel asli di luar method tidak terpengaruh
Pass-by-Value (Reference) → menyalin alamat referensi; manipulasi internal objek berdampak pada objek asli
```

---

<a id="bagian-29"></a>

# 29. 🟡 Method Variable Argument (Varargs)

## Konsep

Varargs (*Variable Arguments*) memungkinkan sebuah method menerima nol, satu, atau banyak argumen dari tipe data yang sama tanpa perlu membuat array secara manual saat pemanggilan.

Di dalam tubuh method, parameter varargs diperlakukan seperti array biasa (`dataType[]`).

> [!NOTE]
> Parameter varargs wajib diletakkan di **posisi parameter paling akhir** dan hanya boleh ada **satu parameter varargs** dalam satu method.

## Contoh

```java
public class VarargsExample {
    static int hitungTotal(String label, int... angka) {
        int total = 0;
        for (int nilai : angka) {
            total += nilai;
        }
        System.out.println("Kategori: " + label + ", Jumlah item: " + angka.length);
        return total;
    }

    public static void main(String[] args) {
        // Pemanggilan fleksibel dengan jumlah argumen berbeda
        int total1 = hitungTotal("Belanja Harian", 10000, 25000, 15000);
        int total2 = hitungTotal("Kosong"); // 0 argumen varargs
        int total3 = hitungTotal("Banyak", 50, 100, 150, 200, 250);

        System.out.println("Total 1: " + total1);
        System.out.println("Total 2: " + total2);
        System.out.println("Total 3: " + total3);
    }
}
```

## Output

```text
Kategori: Belanja Harian, Jumlah item: 3
Kategori: Kosong, Jumlah item: 0
Kategori: Banyak, Jumlah item: 5
Total 1: 50000
Total 2: 0
Total 3: 750
```

## Cara Kerja

```text
Pemanggil: hitungTotal("A", 10, 20)
                  │
                  ▼
Compiler otomatis membungkus: new int[]{10, 20}
                  │
                  ▼
Body Method menerima: int[] angka
```

**Hafalan:**

```text
static returnType methodName(type... parameters) → menerima jumlah argumen dinamis (0 atau banyak) sebagai array
```

---

<a id="bagian-30"></a>

# 30. 🟡 Method Overloading

## Konsep

Method Overloading adalah kemampuan membuat beberapa method dengan **nama yang sama** di dalam satu class, asalkan memiliki **daftar parameter yang berbeda** (berbeda jumlah parameter atau berbeda tipe datanya).

Perbedaan tipe nilai balik (*return type*) saja **tidak cukup** untuk membedakan overloaded method.

## Contoh

```java
public class OverloadingExample {
    // Versi 1: Dua integer
    static int tambah(int a, int b) {
        return a + b;
    }

    // Versi 2: Tiga integer (Beda jumlah parameter)
    static int tambah(int a, int b, int c) {
        return a + b + c;
    }

    // Versi 3: Dua double (Beda tipe parameter)
    static double tambah(double a, double b) {
        return a + b;
    }

    public static void main(String[] args) {
        System.out.println("Tambah 2 int   : " + tambah(10, 20));       // Memanggil Versi 1
        System.out.println("Tambah 3 int   : " + tambah(10, 20, 30));   // Memanggil Versi 2
        System.out.println("Tambah 2 double: " + tambah(5.5, 4.2));     // Memanggil Versi 3
    }
}
```

## Output

```text
Tambah 2 int   : 30
Tambah 3 int   : 60
Tambah 2 double: 9.7
```

## Cara Kerja

```text
Pemanggilan: tambah(10, 20)
       │
       ▼
Compiler memeriksa tanda tangan method (Signature Match):
├─ tambah(int, int)       ==> MATCH! (Dipilih)
├─ tambah(int, int, int)  ==> Beda jumlah parameter
└─ tambah(double, double) ==> Beda tipe parameter
```

**Hafalan:**

```text
Method Overloading → method dengan nama identik tetapi memiliki parameter berbeda tipe atau jumlah
```

---

<a id="bagian-31"></a>

# 31. 🟡 Recursive Method

## Konsep

Recursive Method adalah method yang **memanggil dirinya sendiri** untuk menyelesaikan masalah bertingkat dengan memecahnya menjadi sub-masalah yang lebih kecil.

Setiap fungsi rekursif wajib memiliki dua komponen:
1. **Base Case (Kasus Berhenti):** Kondisi di mana rekursi berhenti agar tidak terjadi perulangan tak terbatas.
2. **Recursive Step:** Langkah pemanggilan method itu sendiri menuju ke arah *base case*.

> [!CAUTION]
> Jika fungsi rekursif tidak memiliki base case atau terlalu dalam, JVM akan kehabisan memori stack dan memunculkan error `StackOverflowError`.

## Contoh

```java
public class RecursiveExample {
    // Menghitung Faktorial: n! = n * (n - 1)!
    static int faktorial(int n) {
        // 1. Base Case
        if (n <= 1) {
            return 1;
        }

        // 2. Recursive Call
        return n * faktorial(n - 1);
    }

    public static void main(String[] args) {
        int angka = 5;
        int hasil = faktorial(angka); // 5! = 5 * 4 * 3 * 2 * 1 = 120
        System.out.printf("Faktorial dari %d adalah %d%n", angka, hasil);
    }
}
```

## Output

```text
Faktorial dari 5 adalah 120
```

## Cara Kerja

```text
Call Stack Execution:
faktorial(5) ──> 5 * faktorial(4)
                     │
                     └──> 4 * faktorial(3)
                              │
                              └──> 3 * faktorial(2)
                                       │
                                       └──> 2 * faktorial(1)
                                                │
                                                └──> return 1 (Base Case)
Unwinding Call Stack:
2 * 1 = 2 ──> 3 * 2 = 6 ──> 4 * 6 = 24 ──> 5 * 24 = 120 (Hasil Akhir)
```

**Hafalan:**

```text
Base Case      → kondisi pembatas mutlak untuk menghentikan pemanggilan rekursif
Recursive Step → pemanggilan diri sendiri dengan parameter yang semakin mendekati base case
```

---

<a id="bagian-32"></a>

# 32. 🟡 Variable Scope & Shadowing

## Konsep

Scope menentukan di mana sebuah variabel dapat diakses di dalam kode program:
- **Class/Static Scope:** Variabel milik class yang dapat diakses oleh seluruh method dalam class.
- **Method Scope:** Variabel yang dideklarasikan di dalam method, hanya aktif selama method berjalan.
- **Block Scope:** Variabel yang dideklarasikan di dalam kurung kurawal `{ ... }` (seperti di dalam `if` atau `for`), hanya dapat diakses di dalam blok tersebut.

**Variable Shadowing** terjadi ketika sebuah variabel di scope yang lebih dalam memiliki nama yang sama persis dengan variabel di scope luar, sehingga menutupi variabel luar tersebut.

## Contoh

```java
public class ScopeExample {
    static int globalScore = 100; // Class/Static scope

    public static void main(String[] args) {
        int mainScore = 50; // Method scope

        if (mainScore > 10) {
            int bonus = 25; // Block scope (hanya ada di dalam kurung if)
            System.out.println("Total dalam blok: " + (mainScore + bonus + globalScore));
        }

        // System.out.println(bonus); // ERROR: bonus cannot be resolved to a variable

        // Shadowing Example
        int globalScore = 999; // Shadowing variabel static globalScore
        System.out.println("Nilai lokal globalScore (Shadowing): " + globalScore); // 999
        System.out.println("Nilai asli static Class: " + ScopeExample.globalScore); // 100
    }
}
```

## Output

```text
Total dalam blok: 175
Nilai lokal globalScore (Shadowing): 999
Nilai asli static Class: 100
```

## Cara Kerja

```text
┌─ Scope Class (globalScore) ──────────────────────────┐
│                                                      │
│  ┌─ Scope Method main() (mainScore) ──────────────┐  │
│  │                                                │  │
│  │  ┌─ Scope Block if (bonus) ─────────────────┐  │  │
│  │  │  Bisa akses: bonus, mainScore, globalScore│  │  │
│  │  └──────────────────────────────────────────┘  │  │
│  │                                                │  │
│  │  Hanya bisa akses: mainScore, globalScore      │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

**Hafalan:**

```text
Block Scope → variabel yang dideklarasikan dalam kurung { ... } musnah saat eksekusi keluar dari blok
Shadowing   → variabel lokal menutup visibilitas variabel luar yang bernama sama
```

---

<a id="bagian-33"></a>

# 33. 🔴 String Utility Methods Lengkap

## Konsep

Class `String` di Java memiliki berbagai method bawaan yang sangat kaya untuk memanipulasi, memotong, membersihkan, dan mencari teks.

## Contoh

```java
public class StringMethodsExample {
    public static void main(String[] args) {
        String teks = "  Belajar Java Modern 21  ";

        System.out.println("Panjang Karakter: " + teks.length());
        System.out.println("Strip Whitespace: '" + teks.strip() + "'");
        System.out.println("Karakter Index 4: " + teks.strip().charAt(4)); // 'j'
        System.out.println("Substring (0-7) : " + teks.strip().substring(0, 7)); // "Belajar"
        System.out.println("Mengandung 'Java': " + teks.contains("Java")); // true
        System.out.println("Starts with '  B': " + teks.startsWith("  B")); // true
        System.out.println("Replace '21'->'LTS': " + teks.strip().replace("21", "LTS"));

        // Split & Join
        String csv = "Apel,Jeruk,Mangga";
        String[] daftarBuah = csv.split(",");
        System.out.println("Hasil Split [1] : " + daftarBuah[1]); // "Jeruk"

        String joined = String.join(" - ", daftarBuah);
        System.out.println("Hasil Join      : " + joined);

        // Repeat & Formatted (Java 15+)
        System.out.println("Repeat '*' x 5  : " + "*".repeat(5));
        String formatted = "Halo %s, skor Anda: %d".formatted("Budi", 95);
        System.out.println("Formatted String: " + formatted);
    }
}
```

## Output

```text
Panjang Karakter: 26
Strip Whitespace: 'Belajar Java Modern 21'
Karakter Index 4: j
Substring (0-7) : Belajar
Mengandung 'Java': true
Starts with '  B': true
Replace '21'->'LTS': Belajar Java Modern LTS
Hasil Split [1] : Jeruk
Hasil Join      : Apel - Jeruk - Mangga
Repeat '*' x 5  : *****
Formatted String: Halo Budi, skor Anda: 95
```

## Cara Kerja

```text
"Apel,Jeruk,Mangga".split(",") ──> Array Baru: ["Apel", "Jeruk", "Mangga"]
String.join(" - ", array)       ──> String Baru: "Apel - Jeruk - Mangga"
```

**Hafalan:**

```text
source.charAt(index)                 → mengambil karakter tunggal pada index tertentu
source.substring(beginIndex, endIndex) → memotong string dari beginIndex hingga sebelum endIndex
source.strip()                       → menghapus spasi/whitespace di awal dan akhir string secara modern
source.contains(target)              → memeriksa apakah string mengandung substring target (true/false)
source.replace(oldText, newText)     → mengganti kemunculan oldText dengan newText
source.split(delimiter)              → memecah string menjadi array berdasarkan pemisah delimiter
String.join(delimiter, elements)     → menggabungkan elemen-elemen menjadi satu string dengan pemisah delimiter
source.formatted(arguments)          → memformat template string dengan argumen yang diberikan
```

---

<a id="bagian-34"></a>

# 34. 🔴 Text Blocks (Multiline String Modern)

## Konsep

Diperkenalkan secara resmi pada **Java 15**, **Text Blocks** memungkinkan penulisan String multi-baris tanpa perlu menggunakan escape sequence `\n` dan concatenation yang rumit.

Text block dibuka dan ditutup dengan **tiga tanda petik ganda (`"""`)**. Indentasi umum secara otomatis dibersihkan oleh compiler.

## Contoh

```java
public class TextBlockExample {
    public static void main(String[] args) {
        // String JSON Multi-baris rapi
        String jsonPayload = """
            {
                "userId": 101,
                "userName": "%s",
                "role": "Software Engineer",
                "isActive": true
            }
            """.formatted("Budi Santoso");

        // String Query SQL
        String query = """
            SELECT id, name, email
            FROM users
            WHERE status = 'ACTIVE'
            ORDER BY created_at DESC;
            """;

        System.out.println("JSON Output:");
        System.out.println(jsonPayload);

        System.out.println("SQL Query:");
        System.out.println(query);
    }
}
```

## Output

```text
JSON Output:
{
    "userId": 101,
    "userName": "Budi Santoso",
    "role": "Software Engineer",
    "isActive": true
}

SQL Query:
SELECT id, name, email
FROM users
WHERE status = 'ACTIVE'
ORDER BY created_at DESC;
```

## Cara Kerja

```text
Input Tiga Petik Ganda:
"""
    {
        "name": "Budi"
    }
"""
         │
         ▼
Compiler menghitung indentasi terendah (Incidental Whitespace) dan membuangnya
         │
         ▼
String rapi tanpa perlu \n atau \"
```

**Hafalan:**

```text
""" multiline text """ → literal string multi-baris yang menjaga format layout teks asli
```

---

<a id="bagian-35"></a>

# 35. 🔴 Math Utility Class (java.lang.Math)

## Konsep

Class `java.lang.Math` menyediakan sekumpulan method static untuk operasi matematika lanjutan seperti trigonometri, eksponensial, pembulatan, dan penghitungan angka acak (*random*).

Karena berada dalam package `java.lang`, class ini **tidak perlu di-import**.

## Contoh

```java
public class MathExample {
    public static void main(String[] args) {
        // 1. Min & Max
        System.out.println("Math.max(10, 25): " + Math.max(10, 25)); // 25
        System.out.println("Math.min(10, 25): " + Math.min(10, 25)); // 10

        // 2. Akar Kuadrat & Pangkat
        System.out.println("Math.sqrt(64)   : " + Math.sqrt(64));   // 8.0
        System.out.println("Math.pow(2, 4)   : " + Math.pow(2, 4));   // 16.0

        // 3. Nilai Mutlak & Pembulatan
        System.out.println("Math.abs(-50)    : " + Math.abs(-50));    // 50
        System.out.println("Math.round(4.6)  : " + Math.round(4.6));  // 5 (long)
        System.out.println("Math.ceil(4.1)   : " + Math.ceil(4.1));   // 5.0 (bulat ke atas)
        System.out.println("Math.floor(4.9)  : " + Math.floor(4.9));  // 4.0 (bulat ke bawah)

        // 4. Angka Acak (Random 1 - 100)
        int randomAngka = (int) (Math.random() * 100) + 1;
        System.out.println("Random (1 - 100) : " + randomAngka);
    }
}
```

## Output

```text
Math.max(10, 25): 25
Math.min(10, 25): 10
Math.sqrt(64)   : 8.0
Math.pow(2, 4)   : 16.0
Math.abs(-50)    : 50
Math.round(4.6)  : 5
Math.ceil(4.1)   : 5.0
Math.floor(4.9)  : 4.0
Random (1 - 100) : 73
```

## Cara Kerja

```text
Math.random()        ==> Menghasilkan double 0.0 <= x < 1.0
Math.random() * 100  ==> Menghasilkan double 0.0 <= x < 100.0
(int)(...) + 1       ==> Menghasilkan integer 1 <= x <= 100
```

**Hafalan:**

```text
Math.max(firstNumber, secondNumber)  → mengembalikan nilai terbesar di antara dua angka
Math.min(firstNumber, secondNumber)  → mengembalikan nilai terkecil di antara dua angka
Math.sqrt(number)                    → menghitung akar kuadrat (square root)
Math.pow(base, exponent)             → menghitung nilai perpangkatan base^exponent
Math.abs(number)                     → mengembalikan nilai mutlak positif (absolute value)
Math.round(number)                   → membulatkan bilangan desimal ke bilangan bulat terdekat
Math.random()                        → menghasilkan bilangan desimal acak dari 0.0 hingga < 1.0
```

---

<a id="bagian-36"></a>

# 36. 🔴 Record Dasar (Immutable Data Carrier)

## Konsep

Diperkenalkan secara resmi pada **Java 16**, **Record** adalah tipe class khusus yang dirancang khusus sebagai pembawa data (*data carrier*) yang bersifat *immutable*.

Dengan mendeklarasikan sebuah `record`, Java secara otomatis membuatkan:
- Field `private final` untuk setiap komponen
- Constructor kanonikal lengkap
- Getter method (dengan nama field tanpa awalan `get`)
- Method `equals()`, `hashCode()`, dan `toString()` bawaan

## Contoh

```java
// Definisi Record Product
public record Product(String code, String name, double price) {
    // Compact Constructor untuk validasi data (Opsional)
    public Product {
        if (price < 0) {
            throw new IllegalArgumentException("Harga tidak boleh negatif!");
        }
    }
}

class RecordDemo {
    public static void main(String[] args) {
        Product p1 = new Product("P01", "Kopi Robusta", 25000);

        // Akses komponen data (getter otomatis)
        System.out.println("Kode  : " + p1.code());
        System.out.println("Nama  : " + p1.name());
        System.out.println("Harga : " + p1.price());

        // toString() otomatis terformat indah
        System.out.println("ToString: " + p1);

        // Equality check otomatis membandingkan isi nilai field
        Product p2 = new Product("P01", "Kopi Robusta", 25000);
        System.out.println("p1.equals(p2): " + p1.equals(p2)); // true
    }
}
```

## Output

```text
Kode  : P01
Nama  : Kopi Robusta
Harga : 25000.0
ToString: Product[code=P01, name=Kopi Robusta, price=25000.0]
p1.equals(p2): true
```

## Cara Kerja

```text
Deklarasi: record Product(String name, double price)
                         │
                         ▼
        Compiler Java otomatis menghasilkan:
        ├── private final String name;
        ├── private final double price;
        ├── public String name() { return this.name; }
        ├── public double price() { return this.price; }
        ├── public boolean equals(Object o) { ... }
        └── public String toString() { ... }
```

**Hafalan:**

```text
public record RecordName(parameters) {} → membuat class penampung data immutable otomatis dengan getter, toString, dan equals
```

---

<a id="bagian-37"></a>

# 37. 🔴 Penanganan Exception Dasar (try-catch-finally)

## Konsep

Exception adalah kejadian error saat runtime yang mengganggu aliran normal program. Jika tidak ditangani, program Java akan langsung crash dan berhenti seketika.

- `try`: Menampung blok kode yang berpotensi memicu exception.
- `catch`: Menangkap dan menangani exception tertentu jika terjadi.
- `finally`: Blok kode yang **selalu dijalankan**, baik terjadi exception maupun tidak (sering digunakan untuk cleanup).
- `throw`: Melemparkan exception secara manual saat validasi gagal.

## Contoh

```java
public class ExceptionExample {
    static int bagiAngka(int pembilang, int penyebut) {
        if (penyebut == 0) {
            throw new IllegalArgumentException("Penyebut tidak boleh bernilai nol!");
        }
        return pembilang / penyebut;
    }

    public static void main(String[] args) {
        try {
            System.out.println("Mencoba pembagian valid:");
            int hasil1 = bagiAngka(20, 4);
            System.out.println("Hasil: " + hasil1);

            System.out.println("\nMencoba pembagian tidak valid:");
            int hasil2 = bagiAngka(10, 0); // Memicu Exception
            System.out.println("Hasil: " + hasil2); // Baris ini dilewati

        } catch (IllegalArgumentException | ArithmeticException e) {
            System.out.println("Terjadi Penanganan Error: " + e.getMessage());
        } finally {
            System.out.println("Blok finally selesai dieksekusi (Clean up resource).");
        }

        System.out.println("Program tetap berjalan normal setelah exception ditangani!");
    }
}
```

## Output

```text
Mencoba pembagian valid:
Hasil: 5

Mencoba pembagian tidak valid:
Terjadi Penanganan Error: Penyebut tidak boleh bernilai nol!
Blok finally selesai dieksekusi (Clean up resource).
Program tetap berjalan normal setelah exception ditangani!
```

## Cara Kerja

```text
                  Blok try dijalankan
                          │
         ┌────────────────┴────────────────┐
     [Normal]                          [Error]
         │                                 │
         ▼                                 ▼
   Lanjut Eksekusi                  Lompat ke Blok catch
         │                                 │
         └────────────────┬────────────────┘
                          │
                          ▼
                 Blok finally Berjalan
                          │
                          ▼
            Lanjut ke Program Berikutnya
```

**Hafalan:**

```text
try { statement } catch (ExceptionType error) { handler } → menangkap error runtime agar program tidak crash
finally { cleanup }                                      → blok kode yang selalu dieksekusi dalam kondisi apapun
throw new ExceptionType(message);                        → melempar error baru secara eksplisit
```

---

<a id="bagian-38"></a>

# 38. 🛠️ Peta Ingatan Cepat

```text
                       ARSITEKTUR BAHASA JAVA
                                  │
      ┌───────────────────────────┼───────────────────────────┐
      ▼                           ▼                           ▼
TIPE DATA PRIMITIF       TIPE DATA REFERENCE         CONTROL & MODULARITAS
├─ Integer: byte, short, ├─ String (Immutable Pool)  ├─ If, Else If, Else
│  int (default), long   ├─ Array ([size], Jagged)   ├─ Switch Expression (->)
├─ Float: float, double  ├─ Wrapper (Integer, etc.)  ├─ Loops (For, While, Do)
├─ Char: 'A' (Unicode)   ├─ Record (Data Carrier)    ├─ Methods (Overload, Varargs)
└─ Boolean: true/false   └─ Nullable                 └─ Exception (Try-Catch)
```

---

<a id="bagian-39"></a>

# 39. 📚 Tabel Ringkasan

| Kategori / Fitur | Sintaks / API Utama | Fungsi & Kegunaan |
|---|---|---|
| Titik Masuk | `public static void main(String[] args)` | Titik awal eksekusi program Java oleh JVM |
| Variabel Lokal | `var namaVariabel = nilai;` | Type inference tipe data otomatis pada variabel lokal |
| Konstanta | `final tipeData NAMA = nilai;` | Mengunci nilai variabel agar tidak dapat diubah |
| Wrapper Parsing | `Integer.parseInt(text)` | Mengonversi String teks angka menjadi primitif `int` |
| Kesamaan Objek | `str1.equals(str2)` | Membandingkan konten isi teks string (case-sensitive) |
| Konsol Format | `System.out.printf(format, args)` | Mencetak teks terformat (`%s`, `%d`, `%.2f`, `%n`) |
| Input Scanner | `scanner.nextLine()` | Membaca input teks satu baris dari keyboard user |
| Panjang Array | `array.length` | Mengetahui jumlah total elemen dalam array |
| Switch Modern | `switch (val) { case "A" -> ...; }` | Switch expression bebas bug fall-through |
| Varargs | `static void f(int... numbers)` | Menerima argumen dinamis 0 s.d N sebagai array |
| Multiline Teks | `""" text """` | Text block multi-baris bebas escape karakter |
| Matematika | `Math.max()`, `Math.sqrt()`, `Math.random()` | Utility operasi kalkulasi matematika |
| Data Carrier | `public record User(String name, int age) {}` | Class penampung data immutable otomatis |
| Error Handling | `try { ... } catch (Exception e) { ... }` | Menangkap runtime exception mencegah crash |

---

<a id="bagian-40"></a>

# 40. ⚡ Cheat Code Java Dasar 10 Detik

```java
// 1. Template Entry Point Class Standar
public class Main {
    public static void main(String[] args) {
        System.out.println("Siap!");
    }
}

// 2. Input Scanner Aman
Scanner scanner = new Scanner(System.in);
String teks = scanner.nextLine();

// 3. Array & For-Each Loop
String[] items = {"A", "B", "C"};
for (String item : items) {
    System.out.println(item);
}

// 4. Switch Expression Modern
String kategori = switch (skor) {
    case 100 -> "Sempurna";
    case 80, 90 -> "Bagus";
    default -> "Cukup";
};

// 5. Perbandingan String Wajib .equals()
if ("admin".equals(inputRole)) {
    System.out.println("Akses Diterima");
}

// 6. Record Praktis
public record Item(String id, String name, int price) {}
```

---

<a id="bagian-41"></a>

# 41. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Fundamental Java Engine & Tipe Data
├── Pahami alur JVM (javac -> .class -> java)
├── Kuasai tipe primitif (int, double, boolean, char)
└── Pahami immutability String dan perbedaan == vs .equals()
       │
       ▼
Langkah 2: Control Flow, Array & Scanner Input
├── Latihan logika percabangan (if-else, modern switch)
├── Kuasai perulangan (for, for-each, while) dan break/continue
└── Olah data sekumpulan dengan Array 1D & 2D melalui input Scanner
       │
       ▼
Langkah 3: Modularitas Method & Best Practice
├── Pecah kode menjadi method void & return value
├── Kuasai Pass-by-Value mental model
└── Manfaatkan Varargs dan Method Overloading
       │
       ▼
Langkah 4: Fitur Modern & Error Handling
├── Gunakan Text Blocks dan Record untuk struktur data bersih
├── Lindungi kode dari crash dengan try-catch-finally
└── Bangun Mini Project CLI Kasir & Inventaris
       │
       ▼
Langkah 5: Siap Melangkah ke Java OOP & Spring Boot Framework!
```

---

<a id="bagian-42"></a>

# 42. 🏗️ Mini Project: Aplikasi Kasir & Inventaris Toko CLI

Aplikasi konsol interaktif lengkap yang menggabungkan seluruh konsep dasar Java: `Scanner`, `Record`, `Array`, `Method Overloading`, `Switch Expression`, `Loop`, `Formatting`, dan `Exception Handling`.

```java
import java.util.Scanner;

// 1. Record untuk Struktur Data Barang (Immutable)
record Item(String code, String name, double price) {}

public class TokoApp {
    // Array Inventaris Barang Toko
    static Item[] katalog = {
        new Item("B01", "Buku Tulis A5", 5000),
        new Item("B02", "Pulpen Gel 0.5", 3500),
        new Item("B03", "Penghapus Karet", 2000),
        new Item("B04", "Penggaris 30cm", 4000)
    };

    // Method Overloading: Hitung Diskon Berdasarkan Total Belanja
    static double hitungDiskon(double totalBelanja) {
        if (totalBelanja >= 50000) return 0.10; // Diskon 10%
        if (totalBelanja >= 25000) return 0.05; // Diskon 5%
        return 0.0;
    }

    // Method Overloading: Hitung Diskon Berdasarkan Status Member
    static double hitungDiskon(double totalBelanja, boolean isMember) {
        double diskonDasar = hitungDiskon(totalBelanja);
        return isMember ? diskonDasar + 0.05 : diskonDasar; // Tambahan 5% untuk Member
    }

    static void tampilkanKatalog() {
        System.out.println("\n=== KATALOG BARANG TOKO BERKAH ===");
        System.out.println("--------------------------------------------------");
        System.out.printf("| %-6s | %-20s | %-12s |%n", "KODE", "NAMA BARANG", "HARGA");
        System.out.println("--------------------------------------------------");
        for (Item item : katalog) {
            System.out.printf("| %-6s | %-20s | Rp %,10.2f |%n", item.code(), item.name(), item.price());
        }
        System.out.println("--------------------------------------------------");
    }

    static Item cariItem(String kode) {
        for (Item item : katalog) {
            if (item.code().equalsIgnoreCase(kode)) {
                return item;
            }
        }
        return null;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        System.out.println("==================================================");
        System.out.println("   SELAMAT DATANG DI SISTEM KASIR TOKO BERKAH     ");
        System.out.println("==================================================");

        while (running) {
            tampilkanKatalog();

            double totalBelanja = 0;
            boolean belanjaSelesai = false;

            while (!belanjaSelesai) {
                System.out.print("\nMasukkan kode barang yang ingin dibeli (atau 'SELESAI'): ");
                String inputKode = scanner.nextLine().strip();

                if (inputKode.equalsIgnoreCase("SELESAI")) {
                    belanjaSelesai = true;
                    continue;
                }

                Item itemTerpilih = cariItem(inputKode);
                if (itemTerpilih == null) {
                    System.out.println("❌ Kode barang tidak ditemukan! Silakan coba lagi.");
                    continue;
                }

                System.out.print("Masukkan jumlah qty untuk " + itemTerpilih.name() + ": ");
                try {
                    int qty = Integer.parseInt(scanner.nextLine().strip());
                    if (qty <= 0) {
                        System.out.println("❌ Jumlah harus lebih dari 0!");
                        continue;
                    }
                    double subtotal = itemTerpilih.price() * qty;
                    totalBelanja += subtotal;
                    System.out.printf("✅ Ditambahkan: %d x %s = Rp %,.2f%n", qty, itemTerpilih.name(), subtotal);
                } catch (NumberFormatException e) {
                    System.out.println("❌ Input jumlah tidak valid (harus angka)!");
                }
            }

            if (totalBelanja > 0) {
                System.out.print("\nApakah pelanggan memiliki kartu Member? (y/n): ");
                String memberInput = scanner.nextLine().strip();
                boolean isMember = memberInput.equalsIgnoreCase("y");

                double rateDiskon = hitungDiskon(totalBelanja, isMember);
                double nominalDiskon = totalBelanja * rateDiskon;
                double totalBayar = totalBelanja - nominalDiskon;

                // Tampilkan Struk Pembayaran
                System.out.println("\n==================================================");
                System.out.println("               STRUK PEMBAYARAN                   ");
                System.out.println("==================================================");
                System.out.printf("Total Belanja Kotor : Rp %,12.2f%n", totalBelanja);
                System.out.printf("Status Member       : %s%n", (isMember ? "YA (+5%)" : "TIDAK"));
                System.out.printf("Diskon (%.0f%%)         : Rp %,12.2f%n", (rateDiskon * 100), nominalDiskon);
                System.out.println("--------------------------------------------------");
                System.out.printf("TOTAL WAJIB BAYAR   : Rp %,12.2f%n", totalBayar);
                System.out.println("==================================================");
            } else {
                System.out.println("\nTidak ada transaksi belanja yang diproses.");
            }

            System.out.print("\nIngin memproses transaksi baru? (y/n): ");
            String lanjut = scanner.nextLine().strip();
            if (!lanjut.equalsIgnoreCase("y")) {
                running = false;
                System.out.println("\nTerima kasih telah menggunakan sistem kasir Toko Berkah!");
            }
        }

        scanner.close();
    }
}
```

## Output Demonstrasi

```text
==================================================
   SELAMAT DATANG DI SISTEM KASIR TOKO BERKAH     
==================================================

=== KATALOG BARANG TOKO BERKAH ===
--------------------------------------------------
| KODE   | NAMA BARANG          | HARGA        |
--------------------------------------------------
| B01    | Buku Tulis A5        | Rp   5,000.00 |
| B02    | Pulpen Gel 0.5       | Rp   3,500.00 |
| B03    | Penghapus Karet      | Rp   2,000.00 |
| B04    | Penggaris 30cm       | Rp   4,000.00 |
--------------------------------------------------

Masukkan kode barang yang ingin dibeli (atau 'SELESAI'): B01
Masukkan jumlah qty untuk Buku Tulis A5: 6
✅ Ditambahkan: 6 x Buku Tulis A5 = Rp 30,000.00

Masukkan kode barang yang ingin dibeli (atau 'SELESAI'): B02
Masukkan jumlah qty untuk Pulpen Gel 0.5: 4
✅ Ditambahkan: 4 x Pulpen Gel 0.5 = Rp 14,000.00

Masukkan kode barang yang ingin dibeli (atau 'SELESAI'): SELESAI

Apakah pelanggan memiliki kartu Member? (y/n): y

==================================================
               STRUK PEMBAYARAN                   
==================================================
Total Belanja Kotor : Rp    44,000.00
Status Member       : YA (+5%)
Diskon (10%)        : Rp     4,400.00
--------------------------------------------------
TOTAL WAJIB BAYAR   : Rp    39,600.00
==================================================

Ingin memproses transaksi baru? (y/n): n

Terima kasih telah menggunakan sistem kasir Toko Berkah!
```

---

<a id="bagian-43"></a>

# 43. 🔗 Referensi Resmi

- [Dokumentasi Resmi Oracle Java SE](https://docs.oracle.com/en/java/)
- [Java SE 21 (LTS) Specification & API Docs](https://docs.oracle.com/en/java/javase/21/docs/api/)
- [The Java Tutorials by Oracle](https://docs.oracle.com/javase/tutorial/)
- [OpenJDK Official Project](https://openjdk.org/)
