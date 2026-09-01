# Java Collection Cheatsheet Revised

> **Target:** Pemula yang telah memahami dasar Java, OOP, dan Generic, serta ingin menguasai arsitektur **Java Collection Framework** secara mendalam dan efisien untuk kebutuhan backend & Spring Boot (Java 21 LTS).
>
> Fokus cheatsheet ini: **mental model hierarki Collection vs Map → Iterable & Iterator → List (ArrayList vs LinkedList) → Set (HashSet, LinkedHashSet, TreeSet, EnumSet) → Queue & Deque (ArrayDeque, PriorityQueue) → Java 21 Sequenced Collections → Map (HashMap, LinkedHashMap, TreeMap, EnumMap) → Immutable Factory Methods → Collections Utilities → Big-O Complexity → mini project keranjang belanja & antrian pesanan**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami untuk mengelola kumpulan data dinamis berurutan (List, Iterable, Iterator)

🟡 Lanjutan
→ pelajari setelah menguasai List: struktur data unik (Set), antrian (Queue/Deque), dan pasangan kunci-nilai (Map)

🔴 Advanced / Operasional
→ penting untuk optimasi performa: Collections utilities, konversi struktur data, Big-O complexity, dan thread safety
```

Mental model hierarki arsitektur Java Collection Framework:

```text
                  Iterable<E> (Akar Perulangan For-Each)
                       │
                       ▼
                 Collection<E>
      ┌────────────────┼────────────────┐
      ▼                ▼                ▼
   List<E>          Set<E>           Queue<E>
(Berurutan &       (Nilai Unik,     (Antrian FIFO,
Boleh Duplikat)   Cegah Duplikat)    Heap Prioritas)
      │                │                │
 ┌────┴────┐      ┌────┴────┐      ┌────┴────┐
 ▼         ▼      ▼         ▼      ▼         ▼
ArrayList  Linked HashSet   Tree  Array     Priority
           List             Set   Deque     Queue

─────────────────────────────────────────────────────────────
(Bukan Turunan Collection - Pohon Mandiri)
                  Map<K, V> (Pasangan Kunci - Nilai Unik)
      ┌────────────────┼────────────────┐
      ▼                ▼                ▼
   HashMap       LinkedHashMap       TreeMap
 (O(1) Hash)    (Insertion-Order)  (Kunci Terurut)
```

**Hafalan:**

```text
Collection    → interface induk untuk manipulasi sekumpulan objek data dinamis (List, Set, Queue)
List          → struktur data terurut berbasis indeks numerik yang mengizinkan elemen duplikat
Set           → struktur data yang menjamin seluruh elemen di dalamnya bersifat unik tanpa duplikasi
Queue         → struktur data antrian untuk pemrosesan elemen berdasarkan urutan kedatangan atau prioritas
Map           → struktur data pemetaan pasangan kunci unik (Key) ke nilai data (Value)
Sequenced     → fitur Java 21 untuk mengakses elemen pertama, terakhir, dan membalikkan urutan secara seragam
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Java Collection Framework & Mental Model Hierarki](#bagian-1)
2. [`Iterable` & `Iterator` Interface (Looping Internal & Safe Removal)](#bagian-2)
3. [`Collection` Interface Dasar (Operasi Universal Data)](#bagian-3)
4. [`List` Interface & `ArrayList` (Dynamic Array Berperforma Tinggi)](#bagian-4)
5. [`LinkedList` sebagai List & Deque (Doubly Linked List)](#bagian-5)
6. [Immutable List Modern (`List.of`, `List.copyOf` vs `Arrays.asList`)](#bagian-6)

### 🟡 Lanjutan

7. [`Set` Interface & `HashSet` (Penyimpanan Unik Berbasis Hash Table)](#bagian-7)
8. [`LinkedHashSet` (Elemen Unik dengan Pemeliharaan Insertion-Order)](#bagian-8)
9. [`SortedSet`, `NavigableSet` & `TreeSet` (Elemen Unik Terurut Otomatis)](#bagian-9)
10. [`EnumSet` (Set Khusus Enum Berbasis Bit-Vector Super Cepat)](#bagian-10)
11. [Immutable Set Modern (`Set.of`, `Set.copyOf`)](#bagian-11)
12. [`Queue` Interface & `ArrayDeque` (Antrian FIFO Standar Industri)](#bagian-12)
13. [`PriorityQueue` (Antrian Berprioritas Min-Heap / Max-Heap)](#bagian-13)
14. [`Deque` Interface (Stack Modern Pengganti Class Legacy `Stack`)](#bagian-14)
15. [Sequenced Collections (Java 21+ `getFirst`, `getLast`, `reversed`)](#bagian-15)
16. [`Map` Interface & `HashMap` (Key-Value, Hashing & Bucket Collision)](#bagian-16)
17. [`LinkedHashMap` & LRU Cache Dasar (Insertion vs Access Order)](#bagian-17)
18. [`SortedMap`, `NavigableMap` & `TreeMap` (Key Terurut Red-Black Tree)](#bagian-18)
19. [`EnumMap` (Map Khusus Key Enum Berperforma Ekstrem)](#bagian-19)
20. [Immutable Map Modern (`Map.of`, `Map.ofEntries`, `Map.copyOf`)](#bagian-20)

### 🔴 Advanced / Operasional

21. [`Collections` Utility Class (Sorting, Searching, Shuffling & Wrapping)](#bagian-21)
22. [Konversi Antar Collection, Array & Map Views (`toArray`, `entrySet`)](#bagian-22)
23. [Panduan Kompleksitas Waktu (Big-O Time & Space Complexity Guide)](#bagian-23)
24. [Concurrency Dasar pada Collection (`ConcurrentHashMap` & Fail-Fast vs Fail-Safe)](#bagian-24)

### 🛠️ Referensi & Praktik

25. [Peta Ingatan Cepat](#bagian-25)
26. [Tabel Ringkasan](#bagian-26)
27. [Cheat Code Java Collection 10 Detik](#bagian-27)
28. [Urutan Belajar yang Disarankan](#bagian-28)
29. [Mini Project: Sistem Manajemen Keranjang Belanja & Antrian Pesanan E-Commerce CLI](#bagian-29)
30. [Referensi Resmi](#bagian-30)

---

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan Java Collection Framework & Mental Model Hierarki

## Konsep

Array biasa di Java memiliki keterbatasan mendasar: ukurannya bersifat tetap (*fixed-size*) dan tidak memiliki method bawaan untuk pencarian, pengurutan, atau pencegahan duplikasi.

**Java Collection Framework (JCF)** adalah arsitektur terpadu di dalam package `java.util` yang menyediakan:
1. **Interfaces:** Kontrak tipe data abstrak (`List`, `Set`, `Queue`, `Map`).
2. **Implementations:** Struktur data konkret siap pakai (`ArrayList`, `HashSet`, `HashMap`, `ArrayDeque`).
3. **Algorithms:** Method utilitas untuk manipulasi data (*sorting*, *searching*, *reversing* via class `Collections`).

JCF terbagi menjadi dua cabang hierarki besar:
- **Cabang `Collection<E>`:** Menampung kumpulan elemen tunggal (`List`, `Set`, `Queue`).
- **Cabang `Map<K, V>`:** Menampung pasangan kunci unik dan nilai (*Key-Value Pair*).

## Contoh

```java
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class CollectionOverviewDemo {
    public static void main(String[] args) {
        // 1. Cabang Collection (Elemen Tunggal)
        Collection<String> fruits = new ArrayList<>();
        fruits.add("Apel");
        fruits.add("Mangga");
        fruits.add("Pisang");
        System.out.println("Collection Items: " + fruits);

        // 2. Cabang Map (Pasangan Key-Value)
        Map<String, Double> prices = new HashMap<>();
        prices.put("Apel", 15000.0);
        prices.put("Mangga", 25000.0);
        System.out.println("Map Key-Value   : " + prices);
    }
}
```

## Output

```text
Collection Items: [Apel, Mangga, Pisang]
Map Key-Value   : {Apel=15000.0, Mangga=25000.0}
```

## Cara Kerja

```text
                 java.util.Collection<E>
                            │
       ┌────────────────────┼────────────────────┐
       ▼                    ▼                    ▼
     List                  Set                 Queue
(ArrayList, LinkedList) (HashSet, TreeSet)  (ArrayDeque, PriorityQueue)
```

**Hafalan:**

```text
java.util.Collection<E> → interface induk untuk struktur data elemen tunggal (List, Set, Queue)
java.util.Map<K, V>     → interface mandiri untuk struktur data pemetaan pasangan Key-Value
```

---

<a id="bagian-2"></a>

# 2. 🟢 `Iterable` & `Iterator` Interface (Looping Internal & Safe Removal)

## Konsep

- **`Iterable<E>`:** Interface akar di Java yang memiliki satu method abstrak: `Iterator<E> iterator()`. Semua class yang mengimplementasikan `Iterable` dapat dijelajahi menggunakan perulangan modern **`for-each` loop**.
- **`Iterator<E>`:** Objek penunjuk (*cursor*) yang bertugas melintasi elemen koleksi satu per satu secara aman dengan method:
  - `hasNext()`: Memeriksa apakah masih ada elemen berikutnya (`true`/`false`).
  - `next()`: Mengambil elemen saat ini dan memajukan cursor.
  - `remove()`: **Menghapus elemen saat ini secara aman** saat perulangan berlangsung tanpa memicu error `ConcurrentModificationException`.

## Contoh

```java
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class IteratorDemo {
    public static void main(String[] args) {
        List<String> cities = new ArrayList<>(List.of("Jakarta", "Bandung", "Surabaya", "Medan"));

        // Menggunakan Iterator manual untuk menghapus data saat looping
        Iterator<String> it = cities.iterator();
        while (it.hasNext()) {
            String city = it.next();
            if (city.startsWith("B")) {
                it.remove(); // Aman menghapus 'Bandung' saat iterasi
            }
        }

        System.out.println("Daftar Kota setelah penghapusan aman: " + cities);
    }
}
```

## Output

```text
Daftar Kota setelah penghapusan aman: [Jakarta, Surabaya, Medan]
```

## Cara Kerja

```text
cities.iterator() ──> Cursor di posisi -1
                      │
                      ├──> hasNext() == true ──> next() -> "Jakarta"
                      ├──> hasNext() == true ──> next() -> "Bandung" ──> it.remove() (Hapus Aman)
                      └──> hasNext() == false ──> Selesai Loop
```

**Hafalan:**

```text
iterator.hasNext() → memeriksa apakah masih ada elemen berikutnya di dalam koleksi
iterator.next()    → mengambil data elemen berikutnya dan memajukan kursor iterasi
iterator.remove()  → menghapus elemen yang baru saja diambil oleh next() secara aman
```

## Kesalahan Umum

❌ Menghapus elemen langsung dari list saat for-each loop: `for (String s : list) { if (..) list.remove(s); }` $\rightarrow$ Memicu `ConcurrentModificationException`.

✅ Gunakan `iterator.remove()` atau method modern `list.removeIf(condition)`.

---

<a id="bagian-3"></a>

# 3. 🟢 `Collection` Interface Dasar (Operasi Universal Data)

## Konsep

Interface `Collection<E>` mendefinisikan operasi-operasi universal yang didukung oleh seluruh struktur data turunan (`List`, `Set`, `Queue`).

Method-method universal terpenting:
- `add(E element)` / `addAll(Collection c)` : Menambahkan elemen.
- `remove(Object o)` / `removeAll(Collection c)` : Menghapus elemen.
- `contains(Object o)` / `containsAll(Collection c)` : Memeriksa keberadaan elemen.
- `size()` : Mengembalikan jumlah elemen saat ini.
- `isEmpty()` : Memeriksa apakah koleksi kosong.
- `clear()` : Mengosongkan seluruh elemen.
- `removeIf(Predicate filter)` : Menghapus elemen berdasarkan kondisi logika lambda.

## Contoh

```java
import java.util.ArrayList;
import java.util.Collection;

public class CollectionBaseDemo {
    public static void main(String[] args) {
        Collection<String> tasks = new ArrayList<>();

        // 1. Menambah data
        tasks.add("Membaca Dokumentasi");
        tasks.add("Menulis Unit Test");
        tasks.add("Code Review Pull Request");

        System.out.println("Total Tugas: " + tasks.size());
        System.out.println("Apakah ada 'Menulis Unit Test'? " + tasks.contains("Menulis Unit Test"));

        // 2. Menghapus data berbasis kondisi lambda (removeIf)
        tasks.removeIf(task -> task.contains("Review"));

        System.out.println("Tugas setelah filter removeIf: " + tasks);
    }
}
```

## Output

```text
Total Tugas: 3
Apakah ada 'Menulis Unit Test'? true
Tugas setelah filter removeIf: [Membaca Dokumentasi, Menulis Unit Test]
```

## Cara Kerja

```text
tasks.removeIf(task -> task.contains("Review"))
       │
       ▼
Evaluasi setiap item ──> "Code Review..." [true] ──> Hapus dari memori
```

**Hafalan:**

```text
collection.add(element)          → menambahkan elemen baru ke dalam koleksi
collection.contains(element)     → memeriksa apakah elemen terdapat dalam koleksi (true/false)
collection.removeIf(predicate)   → menghapus seluruh elemen yang memenuhi kondisi filter predicate
collection.size()                → mengembalikan total jumlah elemen di dalam koleksi
```

---

<a id="bagian-4"></a>

# 4. 🟢 `List` Interface & `ArrayList` (Dynamic Array Berperforma Tinggi)

## Konsep

`List` adalah koleksi data yang **mempertahankan urutan penyimpanan (*ordered*)** dan **mengizinkan duplikasi nilai**. Setiap elemen memiliki posisi nomor indeks berbasis nol (`0` s.d. `size - 1`).

**`ArrayList`** adalah implementasi `List` yang paling populer dan menjadi pilihan default utama di Java:
- Menggunakan **Array biasa yang dapat membesar secara dinamis** di memori internalnya.
- **Sangat Cepat untuk Akses Acak:** `get(index)` dan `set(index, val)` bekerja dalam waktu instan **$O(1)$**.
- **Lambat untuk Penyisipan/Penghapusan di Tengah:** Memerlukan pergeseran elemen (*array shift*) dalam waktu **$O(n)$**.

## Contoh

```java
import java.util.ArrayList;
import java.util.List;

public class ArrayListDemo {
    public static void main(String[] args) {
        List<String> listPemain = new ArrayList<>();

        // Menambahkan elemen ke belakang
        listPemain.add("Ronaldo");
        listPemain.add("Messi");
        listPemain.add("Neymar");

        // Menyisipkan elemen pada indeks tertentu
        listPemain.add(1, "Mbappe"); // Menyisip di indeks 1, menggeser Messi ke indeks 2

        // Mengakses data via indeks
        System.out.println("Pemain di Indeks 0: " + listPemain.get(0)); // Ronaldo
        System.out.println("Pemain di Indeks 1: " + listPemain.get(1)); // Mbappe

        // Mengubah nilai elemen pada indeks tertentu
        listPemain.set(3, "Haaland"); // Mengganti Neymar dengan Haaland

        System.out.println("Daftar Pemain Final: " + listPemain);
    }
}
```

## Output

```text
Pemain di Indeks 0: Ronaldo
Pemain di Indeks 1: Mbappe
Daftar Pemain Final: [Ronaldo, Mbappe, Messi, Haaland]
```

## Cara Kerja

```text
ArrayList Internal Memory Array:
Indeks:       [0]         [1]        [2]        [3]
Elemen:    ┌──────────┬──────────┬──────────┬──────────┐
           │ Ronaldo  │  Mbappe  │  Messi   │ Haaland  │
           └──────────┴──────────┴──────────┴──────────┘
Operasi get(2) ──> Langsung hitung pointer alamat memori ──> "Messi" (O(1))
```

**Hafalan:**

```text
list.get(index)                 → mengambil elemen pada posisi index tertentu dalam waktu instan O(1)
list.set(index, element)        → mengganti elemen pada posisi index tertentu dengan nilai baru
list.add(index, element)        → menyisipkan elemen pada posisi index dan menggeser elemen lainnya
list.indexOf(element)           → mencari nomor indeks kemunculan pertama elemen (-1 jika tidak ada)
```

---

<a id="bagian-5"></a>

# 5. 🟢 `LinkedList` sebagai List & Deque (Doubly Linked List)

## Konsep

**`LinkedList`** mengorganisir data sebagai rantai simpul (**Doubly Linked List**), di mana setiap simpul (*Node*) menyimpan data beserta dua pointer penunjuk: pointer ke simpul sebelumnya (*prev*) dan ke simpul berikutnya (*next*).

Kapan memilih `LinkedList` dibanding `ArrayList`?
- **Keunggulan:** Operasi penambahan dan penghapusan di **ujung awal (`addFirst()`, `removeFirst()`)** dan **ujung akhir (`addLast()`, `removeLast()`)** bekerja sangat cepat dalam waktu konstan **$O(1)$** tanpa perlu pergeseran memori array.
- **Kelemahan:** Operasi pencarian acak `get(index)` sangat lambat **$O(n)$** karena harus melintasi simpul rantai satu per satu dari awal/akhir.

## Contoh

```java
import java.util.LinkedList;

public class LinkedListDemo {
    public static void main(String[] args) {
        LinkedList<String> antrian = new LinkedList<>();

        // Operasi di ujung list
        antrian.add("Budi");        // Menambah di akhir
        antrian.addFirst("Bos Ali");// Menyisip langsung di paling awal (O(1))
        antrian.addLast("Citra");   // Menambah di paling akhir (O(1))

        System.out.println("Struktur LinkedList: " + antrian);

        // Mengambil dan menghapus dari ujung
        String pertama = antrian.removeFirst();
        System.out.println("Dihapus Pertama : " + pertama);
        System.out.println("Sisa LinkedList   : " + antrian);
    }
}
```

## Output

```text
Struktur LinkedList: [Bos Ali, Budi, Citra]
Dihapus Pertama : Bos Ali
Sisa LinkedList   : [Budi, Citra]
```

## Cara Kerja

```text
Node [Bos Ali] <═══> Node [Budi] <═══> Node [Citra]
(head pointer)                         (tail pointer)
```

**Hafalan:**

```text
linkedList.addFirst(element)    → menyisipkan elemen di posisi paling depan dalam waktu konstan O(1)
linkedList.addLast(element)     → menyisipkan elemen di posisi paling belakang dalam waktu konstan O(1)
linkedList.removeFirst()        → mengambil dan menghapus elemen terdepan
linkedList.removeLast()         → mengambil dan menghapus elemen paling belakang
```

---

<a id="bagian-6"></a>

# 6. 🟢 Immutable List Modern (`List.of`, `List.copyOf` vs `Arrays.asList`)

## Konsep

Java menyediakan factory method modern untuk membuat **Immutable List (Unmodifiable)** yang nilainya dikunci dan tidak dapat diubah setelah dibuat:

1. **`List.of(e1, e2, ...)` (Java 9+):** Menghasilkan List yang **benar-benar immutable**. Menolak nilai `null` (*NullPointerException*) dan sangat hemat alokasi memori.
2. **`List.copyOf(collection)` (Java 10+):** Membuat salinan immutable dari koleksi lain yang sudah ada.
3. **`Arrays.asList(array)` (Legacy):** Menghasilkan list berukuran tetap yang membungkus array asli. **TIDAK BENAR-BENAR IMMUTABLE** karena method `.set(index, val)` masih bisa mengubah data array di belakangnya.

## Contoh

```java
import java.util.List;

public class ImmutableListDemo {
    public static void main(String[] args) {
        // 1. Immutable List Modern via List.of
        List<String> roles = List.of("ADMIN", "USER", "SUPERVISOR");
        System.out.println("Daftar Role: " + roles);

        // roles.add("GUEST"); // ERROR: UnsupportedOperationException!
        // roles.set(0, "ROOT"); // ERROR: UnsupportedOperationException!

        // 2. List.copyOf dari list lain
        List<String> immutableCopy = List.copyOf(roles);
        System.out.println("Salinan Aman: " + immutableCopy);
    }
}
```

## Output

```text
Daftar Role: [ADMIN, USER, SUPERVISOR]
Salinan Aman: [ADMIN, USER, SUPERVISOR]
```

## Cara Kerja

```text
List.of("A", "B", "C")
         │
         ▼
Objek Immutable di Heap ──> add() / remove() / set() ──> Lempar UnsupportedOperationException
```

**Hafalan:**

```text
List.of(elements...)       → membuat list immutable murni yang tidak bisa ditambah, dihapus, atau diubah
List.copyOf(collection)    → membuat salinan unmodifiable dari koleksi sumber yang diberikan
```

---

<a id="bagian-7"></a>

# 7. 🟡 `Set` Interface & `HashSet` (Penyimpanan Unik Berbasis Hash Table)

## Konsep

`Set` adalah kumpulan elemen yang **menjamin tidak ada duplikasi data (setiap elemen wajib unik)**. Jika Anda mencoba menambahkan elemen yang sudah ada, penambahan tersebut akan diabaikan (`add()` mengembalikan `false`).

**`HashSet`** adalah implementasi `Set` paling cepat dan populer di Java:
- Menggunakan struktur data **Hash Table** di belakang layar (dibungkus oleh `HashMap`).
- **Tidak Menjamin Urutan Elemen:** Urutan data saat diiterasi bisa berubah-ubah dan tidak sama dengan urutan saat data dimasukkan.
- **Pencarian Super Cepat:** Operasi `add()`, `remove()`, dan `contains()` bekerja rata-rata dalam waktu instan **$O(1)$** berbasis nilai `hashCode()` dan `equals()`.

## Contoh

```java
import java.util.HashSet;
import java.util.Set;

public class HashSetDemo {
    public static void main(String[] args) {
        Set<String> emailSet = new HashSet<>();

        // Menambahkan email unik
        System.out.println("Add budi@mail.com : " + emailSet.add("budi@mail.com")); // true
        System.out.println("Add siti@mail.com : " + emailSet.add("siti@mail.com")); // true
        System.out.println("Add budi@mail.com : " + emailSet.add("budi@mail.com")); // false (Duplikat ditolak!)

        System.out.println("\nTotal Email Unik: " + emailSet.size()); // 2
        System.out.println("Isi HashSet (Tidak terurut): " + emailSet);

        // Pengecekan instan O(1)
        boolean terdaftar = emailSet.contains("siti@mail.com");
        System.out.println("Apakah siti terdaftar? " + terdaftar);
    }
}
```

## Output

```text
Add budi@mail.com : true
Add siti@mail.com : true
Add budi@mail.com : false

Total Email Unik: 2
Isi HashSet (Tidak terurut): [siti@mail.com, budi@mail.com]
Apakah siti terdaftar? true
```

## Cara Kerja

```text
emailSet.add("budi@mail.com")
          │
          ▼
Hitung: "budi@mail.com".hashCode() ──> Cari Bucket Hash Table
          │
      [Ada isi yang sama via equals()?]
    ┌─────┴─────┐
  [YA]        [TIDAK]
    │           │
    ▼           ▼
Tolak/Abaikan  Simpan Elemen Baru (Return true)
```

**Hafalan:**

```text
Set<T> set = new HashSet<>(); → membuat Set elemen unik dengan kecepatan lookup instan O(1)
set.add(element)              → mengembalikan true jika elemen baru berhasil disimpan, false jika sudah ada
```

---

<a id="bagian-8"></a>

# 8. 🟡 `LinkedHashSet` (Elemen Unik dengan Pemeliharaan Insertion-Order)

## Konsep

`LinkedHashSet` menggabungkan dua keunggulan:
1. **Keunikan `Set`:** Menjamin tidak ada data duplikat dengan lookup cepat $O(1)$.
2. **Pemeliharaan Urutan Penyisipan (*Insertion-Order*):** Menjaga urutan iterasi elemen persis seperti saat elemen tersebut pertama kali dimasukkan ke dalam Set menggunakan rantai *doubly-linked list* internal.

## Contoh

```java
import java.util.LinkedHashSet;
import java.util.Set;

public class LinkedHashSetDemo {
    public static void main(String[] args) {
        Set<String> antrianKunjungan = new LinkedHashSet<>();

        antrianKunjungan.add("Zacky");
        antrianKunjungan.add("Ahmad");
        antrianKunjungan.add("Budi");
        antrianKunjungan.add("Ahmad"); // Duplikat diabaikan

        System.out.println("Isi LinkedHashSet (Pasti urut sesuai urutan input):");
        for (String nama : antrianKunjungan) {
            System.out.println("- " + nama);
        }
    }
}
```

## Output

```text
Isi LinkedHashSet (Pasti urut sesuai urutan input):
- Zacky
- Ahmad
- Budi
```

## Cara Kerja

```text
Hash Table (Lookup O(1))  +  Doubly Linked List (Urutan: Zacky -> Ahmad -> Budi)
```

**Hafalan:**

```text
Set<T> set = new LinkedHashSet<>(); → menyimpan elemen unik dengan urutan iterasi pasti sesuai urutan input
```

---

<a id="bagian-9"></a>

# 9. 🟡 `SortedSet`, `NavigableSet` & `TreeSet` (Elemen Unik Terurut Otomatis)

## Konsep

**`TreeSet`** adalah implementasi `Set` yang menyimpan elemen-elemen unik dalam keadaan **selalu terurut secara otomatis (*sorted*)** berbasis struktur data pohon seimbang **Red-Black Tree**.

Karakteristik `TreeSet`:
- Elemen wajib mengimplementasikan interface `Comparable<T>` atau menyediakan kustom `Comparator<T>`.
- Operasi `add()`, `remove()`, dan `contains()` bekerja dalam waktu logaritmik **$O(\log n)$**.
- Menyediakan method navigasi rentang nilai (`NavigableSet`): `first()`, `last()`, `higher()`, `lower()`, `subSet()`.

## Contoh

```java
import java.util.NavigableSet;
import java.util.TreeSet;

public class TreeSetDemo {
    public static void main(String[] args) {
        NavigableSet<Integer> scores = new TreeSet<>();

        scores.add(85);
        scores.add(40);
        scores.add(95);
        scores.add(70);
        scores.add(60);

        System.out.println("TreeSet Terurut Otomatis (Ascending) : " + scores);
        System.out.println("Nilai Terendah (first)              : " + scores.first());
        System.out.println("Nilai Tertinggi (last)              : " + scores.last());
        System.out.println("Nilai di atas 70 (higher(70))       : " + scores.higher(70)); // 85
        System.out.println("Nilai di bawah 70 (lower(70))       : " + scores.lower(70));  // 60

        // Mengambil urutan terbalik (Descending)
        System.out.println("TreeSet Descending                  : " + scores.descendingSet());
    }
}
```

## Output

```text
TreeSet Terurut Otomatis (Ascending) : [40, 60, 70, 85, 95]
Nilai Terendah (first)              : 40
Nilai Tertinggi (last)              : 95
Nilai di atas 70 (higher(70))       : 85
Nilai di bawah 70 (lower(70))       : 60
TreeSet Descending                  : [95, 85, 70, 60, 40]
```

## Cara Kerja

```text
                  Red-Black Tree:
                       [70]
                      /    \
                   [60]    [85]
                   /          \
                [40]          [95]
```

**Hafalan:**

```text
NavigableSet<T> set = new TreeSet<>(); → membuat set elemen unik yang selalu terurut otomatis (O(log n))
set.first()                            → mengambil elemen paling awal/terkecil
set.last()                             → mengambil elemen paling akhir/terbesar
set.higher(element)                    → mencari elemen terkecil yang lebih besar dari element
set.lower(element)                     → mencari elemen terbesar yang lebih kecil dari element
```

---

<a id="bagian-10"></a>

# 10. 🟡 `EnumSet` (Set Khusus Enum Berbasis Bit-Vector Super Cepat)

## Konsep

Jika Anda membutuhkan Set untuk menampung nilai-nilai dari tipe `Enum`, gunakan **`EnumSet`**.

`EnumSet` diimplementasikan secara internal menggunakan **Bit-Vector (Bitmask)** bilangan biner 64-bit (`long`). Hasilnya, operasi pada `EnumSet` adalah yang **paling cepat dan paling hemat memori di seluruh Java Collection Framework** (jauh melampaui `HashSet`).

## Contoh

```java
import java.util.EnumSet;
import java.util.Set;

enum LevelAkses {
    BACA, TULIS, HAPUS, ADMIN_SISTEM
}

public class EnumSetDemo {
    public static void main(String[] args) {
        // Membuat EnumSet dengan pilihan elemen tertentu
        Set<LevelAkses> userBiasa = EnumSet.of(LevelAkses.BACA);
        Set<LevelAkses> editor = EnumSet.of(LevelAkses.BACA, LevelAkses.TULIS);

        // Membuat EnumSet yang mencakup seluruh enum
        Set<LevelAkses> superAdmin = EnumSet.allOf(LevelAkses.class);

        // Membuat EnumSet rentang nilai
        Set<LevelAkses> operasional = EnumSet.range(LevelAkses.BACA, LevelAkses.HAPUS);

        System.out.println("Akses Editor     : " + editor);
        System.out.println("Akses SuperAdmin : " + superAdmin);
        System.out.println("Akses Operasional: " + operasional);
    }
}
```

## Output

```text
Akses Editor     : [BACA, TULIS]
Akses SuperAdmin : [BACA, TULIS, HAPUS, ADMIN_SISTEM]
Akses Operasional: [BACA, TULIS, HAPUS]
```

## Cara Kerja

```text
Bitmask Memory:
BACA (bit 0) | TULIS (bit 1) | HAPUS (bit 2) | ADMIN (bit 3)
Editor = 0000 0011 (Biner cepat tingkat register CPU)
```

**Hafalan:**

```text
EnumSet.of(E1, E2)        → membuat EnumSet yang hanya berisi konstanta enum pilihan
EnumSet.allOf(EnumClass)  → membuat EnumSet yang berisi seluruh konstanta enum dari class tersebut
```

---

<a id="bagian-11"></a>

# 11. 🟡 Immutable Set Modern (`Set.of`, `Set.copyOf`)

## Konsep

Sama seperti pada List, Java menyediakan method `Set.of(...)` untuk membuat **Immutable Set**.

> [!CAUTION]
> Berbeda dengan `HashSet` biasa yang hanya mengabaikan nilai duplikat saat runtime, `Set.of(...)` **akan langsung melempar `IllegalArgumentException` saat kompilasi/runtime jika mendeteksi elemen duplikat di argumen inisialisasinya**.

## Contoh

```java
import java.util.Set;

public class ImmutableSetDemo {
    public static void main(String[] args) {
        // Inisialisasi Immutable Set
        Set<String> permissions = Set.of("READ", "WRITE", "EXECUTE");
        System.out.println("Permissions: " + permissions);

        // Set.of("A", "A"); // RUNTIME ERROR: IllegalArgumentException: duplicate element: A
    }
}
```

## Output

```text
Permissions: [EXECUTE, WRITE, READ]
```

**Hafalan:**

```text
Set.of(elements...)    → membuat immutable Set unik (melempar IllegalArgumentException jika ada duplikat)
Set.copyOf(collection) → membuat salinan immutable Set dari koleksi lain
```

---

<a id="bagian-12"></a>

# 12. 🟡 `Queue` Interface & `ArrayDeque` (Antrian FIFO Standar Industri)

## Konsep

`Queue` merepresentasikan struktur data antrian yang memproses elemen dengan prinsip **FIFO (*First In, First Out*)**: elemen yang pertama masuk adalah yang pertama keluar.

Method `Queue` terbagi menjadi dua kategori perlakuan saat kondisi gagal/penuh:
1. **Melempar Exception:** `add()`, `remove()`, `element()`
2. **Mengembalikan Nilai Khusus (`false` / `null`):** `offer()`, `poll()`, `peek()` *(Sangat Direkomendasikan)*

**`ArrayDeque`** adalah implementasi antrian berbasis array sirkular yang menjadi standar industri terbaik karena **bebas alokasi pointer Node dan jauh lebih cepat dibanding `LinkedList`**.

## Contoh

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class QueueDemo {
    public static void main(String[] args) {
        Queue<String> antrianKasir = new ArrayDeque<>();

        // 1. Menambahkan antrian (offer)
        antrianKasir.offer("Pelanggan A (Budi)");
        antrianKasir.offer("Pelanggan B (Siti)");
        antrianKasir.offer("Pelanggan C (Doni)");

        // 2. Mengintip siapa yang berada di antrian paling depan tanpa menghapusnya (peek)
        System.out.println("Antrian Terdepan Saat Ini (peek): " + antrianKasir.peek());

        // 3. Memproses dan mengeluarkan antrian terdepan (poll)
        System.out.println("\nMemproses Antrian:");
        while (!antrianKasir.isEmpty()) {
            String dilayani = antrianKasir.poll(); // Mengambil & menghapus antrian terdepan
            System.out.println("-> Melayani: " + dilayani);
        }

        System.out.println("\nStatus antrian setelah semua selesai (poll): " + antrianKasir.poll()); // null
    }
}
```

## Output

```text
Antrian Terdepan Saat Ini (peek): Pelanggan A (Budi)

Memproses Antrian:
-> Melayani: Pelanggan A (Budi)
-> Melayani: Pelanggan B (Siti)
-> Melayani: Pelanggan C (Doni)

Status antrian setelah semua selesai (poll): null
```

## Cara Kerja

```text
offer("D") ──> [ A ] ──> [ B ] ──> [ C ] ──> [ D ]
                 │
                 ▼ poll()
             "A" Keluar (FIFO)
```

**Hafalan:**

```text
queue.offer(element) → memasukkan elemen ke antrian belakang (return false jika penuh)
queue.poll()         → mengambil dan menghapus elemen paling depan (return null jika kosong)
queue.peek()         → melihat elemen terdepan tanpa menghapusnya (return null jika kosong)
```

---

<a id="bagian-13"></a>

# 13. 🟡 `PriorityQueue` (Antrian Berprioritas Min-Heap / Max-Heap)

## Konsep

Elemen di dalam `PriorityQueue` **tidak diproses berdasarkan waktu kedatangan**, melainkan diproses berdasarkan **skala prioritas nilainya**:
- **Min-Heap (Default):** Nilai terkecil diproses paling pertama (misal: prioritas level 1 lebih penting dari level 5).
- **Max-Heap (Kustom Comparator):** Nilai terbesar diproses paling pertama.

## Contoh

```java
import java.util.Comparator;
import java.util.PriorityQueue;
import java.util.Queue;

record PasienIGD(String nama, int tingkatKegawatan) {
    // 1 = Kritis/Emergency, 5 = Ringan
}

public class PriorityQueueDemo {
    public static void main(String[] args) {
        // PriorityQueue dengan Comparator berdasarkan tingkatKegawatan terkecil (Min-Heap)
        Queue<PasienIGD> antrianIGD = new PriorityQueue<>(Comparator.comparingInt(PasienIGD::tingkatKegawatan));

        antrianIGD.offer(new PasienIGD("Pasien A (Flu)", 4));
        antrianIGD.offer(new PasienIGD("Pasien B (Serangan Jantung)", 1));
        antrianIGD.offer(new PasienIGD("Pasien C (Luka Sobek)", 2));

        System.out.println("Urutan Penanganan Dokter IGD:");
        while (!antrianIGD.isEmpty()) {
            PasienIGD p = antrianIGD.poll();
            System.out.printf("-> Menangani: %s [Tingkat: %d]%n", p.nama(), p.tingkatKegawatan());
        }
    }
}
```

## Output

```text
Urutan Penanganan Dokter IGD:
-> Menangani: Pasien B (Serangan Jantung) [Tingkat: 1]
-> Menangani: Pasien C (Luka Sobek) [Tingkat: 2]
-> Menangani: Pasien A (Flu) [Tingkat: 4]
```

## Cara Kerja

```text
Min-Heap Binary Tree:
Elemen prioritas tertinggi (tingkatKegawatan == 1) selalu berada di Root (Puncak)
```

**Hafalan:**

```text
Queue<T> pq = new PriorityQueue<>(comparator); → antrian berprioritas yang otomatis memproses elemen bernilai prioritas tertinggi dahulu
```

---

<a id="bagian-14"></a>

# 14. 🟡 `Deque` Interface (Stack Modern Pengganti Class Legacy `Stack`)

## Konsep

**`Deque`** (*Double-Ended Queue*) adalah antrian dua arah yang memungkinkan operasi penyisipan dan pengambilan di **kedua ujung (depan dan belakang)**.

Java secara resmi merekomendasikan `ArrayDeque` sebagai **pengganti modern dari class legacy `Stack`** (karena class `Stack` lama mewarisi `Vector` yang memiliki overhead sinkronisasi usang).

Operasi Stack Modern via Deque (**LIFO - *Last In, First Out***):
- `push(e)` : Menaruh elemen di puncak stack (`addFirst`).
- `pop()` : Mengambil dan menghapus elemen dari puncak stack (`removeFirst`).
- `peek()` : Melihat elemen puncak stack.

## Contoh

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class DequeStackDemo {
    public static void main(String[] args) {
        // Menggunakan Deque sebagai Stack Modern (LIFO)
        Deque<String> riwayatHalaman = new ArrayDeque<>();

        // Pengguna membuka halaman
        riwayatHalaman.push("1. Halaman Beranda");
        riwayatHalaman.push("2. Halaman Produk");
        riwayatHalaman.push("3. Halaman Checkout");

        System.out.println("Halaman Puncak Saat Ini: " + riwayatHalaman.peek());

        // Tombol Back ditekan (LIFO)
        System.out.println("\nMenekan Tombol Back (Pop):");
        while (!riwayatHalaman.isEmpty()) {
            System.out.println("<- Kembali dari: " + riwayatHalaman.pop());
        }
    }
}
```

## Output

```text
Halaman Puncak Saat Ini: 3. Halaman Checkout

Menekan Tombol Back (Pop):
<- Kembali dari: 3. Halaman Checkout
<- Kembali dari: 2. Halaman Produk
<- Kembali dari: 1. Halaman Beranda
```

## Cara Kerja

```text
push("3. Checkout") ──> ┌─────────────────────┐ (PUNCAK STACK)
                        │ 3. Halaman Checkout │ ──> pop() diambil duluan (LIFO)
                        ├─────────────────────┤
                        │ 2. Halaman Produk   │
                        ├─────────────────────┤
                        │ 1. Halaman Beranda  │
                        └─────────────────────┘
```

**Hafalan:**

```text
deque.push(element) → menaruh elemen di puncak stack (LIFO)
deque.pop()         → mengambil dan membuang elemen teratas puncak stack
```

---

<a id="bagian-15"></a>

# 15. 🟡 Sequenced Collections (Java 21+ `getFirst`, `getLast`, `reversed`)

## Konsep

Sebelum Java 21, setiap struktur data memiliki cara berbeda untuk mengambil elemen pertama dan terakhir (misal: `list.get(0)` vs `deque.getFirst()` vs `sortedSet.first()`).

**Java 21** memperkenalkan **Sequenced Collections** (`SequencedCollection`, `SequencedSet`, `SequencedMap`) untuk menyeragamkan seluruh struktur data yang memiliki urutan yang terdefinisi dengan API standar:
- `getFirst()` / `getLast()` : Mengakses elemen ujung.
- `addFirst(e)` / `addLast(e)` : Menambah di ujung.
- `removeFirst()` / `removeLast()` : Menghapus di ujung.
- `reversed()` : Menghasilkan *reverse-ordered view* secara instan tanpa perlu menyalin list!

## Contoh

```java
import java.util.ArrayList;
import java.util.List;

public class SequencedCollectionDemo {
    public static void main(String[] args) {
        List<String> items = new ArrayList<>(List.of("A", "B", "C", "D"));

        // Fitur Java 21 Baru:
        items.addFirst("AWAL");
        items.addLast("AKHIR");

        System.out.println("List: " + items);
        System.out.println("Elemen Pertama (getFirst): " + items.getFirst());
        System.out.println("Elemen Terakhir (getLast) : " + items.getLast());

        // Reverse view instan
        List<String> terbalik = items.reversed();
        System.out.println("Urutan Terbalik (reversed): " + terbalik);
    }
}
```

## Output

```text
List: [AWAL, A, B, C, D, AKHIR]
Elemen Pertama (getFirst): AWAL
Elemen Terakhir (getLast) : AKHIR
Urutan Terbalik (reversed): [AKHIR, D, C, B, A, AWAL]
```

## Cara Kerja

```text
items.reversed() ──> Membungkus list dalam SequencedView terbalik tanpa alokasi list baru (O(1))
```

**Hafalan:**

```text
collection.getFirst() → mengambil elemen paling depan secara terstandarisasi di Java 21
collection.getLast()  → mengambil elemen paling belakang secara terstandarisasi di Java 21
collection.reversed() → menghasilkan tampilan koleksi dalam urutan terbalik secara instan O(1)
```

---

<a id="bagian-16"></a>

# 16. 🟡 `Map` Interface & `HashMap` (Key-Value, Hashing & Bucket Collision)

## Konsep

`Map<K, V>` adalah struktur data pemetaan **Kunci Unik (Key)** ke **Nilai (Value)**. Setiap satu kunci hanya dapat menampung satu nilai.

**`HashMap`** adalah implementasi `Map` yang paling cepat dan umum digunakan:
- Menggunakan **Hash Table** berbasis array of buckets.
- **Performa Instan:** `put(k, v)` dan `get(k)` rata-rata berjalan dalam waktu **$O(1)$**.
- **Kunci Wajib Unik:** Jika memasukkan key yang sudah ada, value lama akan ditimpa (*overwrite*).
- Mengizinkan satu kunci bernilai `null` dan banyak nilai `null`.

## Contoh

```java
import java.util.HashMap;
import java.util.Map;

public class HashMapDemo {
    public static void main(String[] args) {
        Map<String, String> userRoles = new HashMap<>();

        // 1. Menyimpan data (put)
        userRoles.put("user_101", "ADMIN");
        userRoles.put("user_102", "DEVELOPER");
        userRoles.put("user_103", "MARKETING");

        // Menimpa nilai key yang sudah ada
        userRoles.put("user_102", "TECH_LEAD");

        // 2. Mengambil data (get / getOrDefault)
        System.out.println("Role user_101: " + userRoles.get("user_101")); // ADMIN
        System.out.println("Role user_102: " + userRoles.get("user_102")); // TECH_LEAD
        System.out.println("Role user_999: " + userRoles.getOrDefault("user_999", "GUEST")); // GUEST

        // 3. Iterasi Map via entrySet
        System.out.println("\nSeluruh Data Map:");
        for (Map.Entry<String, String> entry : userRoles.entrySet()) {
            System.out.printf("Key: %-10s -> Value: %s%n", entry.getKey(), entry.getValue());
        }
    }
}
```

## Output

```text
Role user_101: ADMIN
Role user_102: TECH_LEAD
Role user_999: GUEST

Seluruh Data Map:
Key: user_101   -> Value: ADMIN
Key: user_102   -> Value: TECH_LEAD
Key: user_103   -> Value: MARKETING
```

## Cara Kerja

```text
put("user_101", "ADMIN")
         │
         ▼
Index Bucket = "user_101".hashCode() & (n - 1)
         │
         ▼
Simpan Node [Key: "user_101", Value: "ADMIN", Hash: ...] di Bucket Hash Table
```

**Hafalan:**

```text
map.put(key, value)                      → menyimpan pasangan key-value (menimpa jika key sudah ada)
map.get(key)                             → mengambil value berdasarkan key (return null jika tidak ada)
map.getOrDefault(key, defaultValue)      → mengambil value atau mengembalikan defaultValue jika key tidak ditemukan
map.containsKey(key)                     → memeriksa apakah key tertentu ada di dalam map (true/false)
map.entrySet()                           → mengembalikan sekumpulan Map.Entry<K, V> untuk iterasi loop
```

---

<a id="bagian-17"></a>

# 17. 🟡 `LinkedHashMap` & LRU Cache Dasar (Insertion vs Access Order)

## Konsep

`LinkedHashMap` mempertahankan urutan elemen dengan dua mode konfigurasi:
1. **Insertion Order (Default):** Elemen terurut sesuai urutan data pertama kali dimasukkan.
2. **Access Order:** Elemen diurutkan berdasarkan **kapan terakhir kali diakses (`get`/`put`)**. Elemen yang baru diakses akan dipindahkan ke paling belakang. Mode ini adalah fondasi ideal untuk membuat **LRU (*Least Recently Used*) Cache**.

## Contoh

```java
import java.util.LinkedHashMap;
import java.util.Map;

// Sederhana LRU Cache dengan kapasitas maksimum 3 item
class LruCache<K, V> extends LinkedHashMap<K, V> {
    private final int maxCapacity;

    public LruCache(int maxCapacity) {
        // accessOrder = true
        super(maxCapacity, 0.75f, true);
        this.maxCapacity = maxCapacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > maxCapacity; // Buang data terlama jika ukuran melebihi batas
    }
}

public class LinkedHashMapDemo {
    public static void main(String[] args) {
        LruCache<String, String> cache = new LruCache<>(3);

        cache.put("A", "Data A");
        cache.put("B", "Data B");
        cache.put("C", "Data C");
        System.out.println("Cache Awal (Kapasitas 3): " + cache.keySet()); // [A, B, C]

        // Akses 'A' -> 'A' menjadi yang paling baru dipakai, dipindah ke belakang
        cache.get("A");
        System.out.println("Setelah get('A')       : " + cache.keySet()); // [B, C, A]

        // Masukkan 'D' -> 'B' (yang paling usang/eldest) otomatis dibuang!
        cache.put("D", "Data D");
        System.out.println("Setelah put('D') (LRU) : " + cache.keySet()); // [C, A, D]
    }
}
```

## Output

```text
Cache Awal (Kapasitas 3): [A, B, C]
Setelah get('A')       : [B, C, A]
Setelah put('D') (LRU) : [C, A, D]
```

## Cara Kerja

```text
Access Order:
Item yang dibaca via get() dipindahkan ke posisi Tail (Most Recently Used).
Item di posisi Head (Least Recently Used) akan dibuang saat kapasitas penuh.
```

**Hafalan:**

```text
new LinkedHashMap<>(capacity, loadFactor, true) → membuat map dengan mode access-order untuk arsitektur LRU Cache
```

---

<a id="bagian-18"></a>

# 18. 🟡 `SortedMap`, `NavigableMap` & `TreeMap` (Key Terurut Red-Black Tree)

## Konsep

**`TreeMap`** adalah implementasi `Map` yang **selalu menjaga kunci-kuncinya (Keys) dalam keadaan terurut otomatis** berbasis Red-Black Tree.

Karakteristik:
- Key wajib mengimplementasikan `Comparable` atau disediakan `Comparator`.
- Operasi `put`, `get`, `remove` berjalan dalam waktu **$O(\log n)$**.
- Menyediakan fungsi pencarian navigasi range: `firstKey()`, `lastKey()`, `subMap()`.

## Contoh

```java
import java.util.NavigableMap;
import java.util.TreeMap;

public class TreeMapDemo {
    public static void main(String[] args) {
        NavigableMap<String, Double> productPrices = new TreeMap<>();

        productPrices.put("Zebra Cross", 50000.0);
        productPrices.put("Apple iPhone", 18000000.0);
        productPrices.put("MacBook Pro", 25000000.0);
        productPrices.put("Dell Monitor", 4500000.0);

        System.out.println("TreeMap (Kunci Terurut Abjad A-Z Otomatis):");
        for (var entry : productPrices.entrySet()) {
            System.out.printf("- %-15s : Rp %,.2f%n", entry.getKey(), entry.getValue());
        }

        System.out.println("\nKunci Pertama (firstKey): " + productPrices.firstKey());
        System.out.println("Kunci Terakhir (lastKey): " + productPrices.lastKey());
    }
}
```

## Output

```text
TreeMap (Kunci Terurut Abjad A-Z Otomatis):
- Apple iPhone    : Rp 18,000,000.00
- Dell Monitor    : Rp 4,500,000.00
- MacBook Pro     : Rp 25,000,000.00
- Zebra Cross     : Rp 50,000.00

Kunci Pertama (firstKey): Apple iPhone
Kunci Terakhir (lastKey): Zebra Cross
```

**Hafalan:**

```text
NavigableMap<K, V> map = new TreeMap<>(); → Map dengan pengurutan kunci otomatis berstruktur pohon seimbang
```

---

<a id="bagian-19"></a>

# 19. 🟡 `EnumMap` (Map Khusus Key Enum Berperforma Ekstrem)

## Konsep

Jika Kunci (*Key*) dari sebuah Map bertipe data `Enum`, selalu gunakan **`EnumMap`**.

`EnumMap` diimplementasikan secara internal menggunakan **Array biasa dengan indeks sesuai nomor ordinal enum**. Tidak ada proses kalkulasi hash atau penanganan tabrakan (*collision*), menjadikannya **jauh lebih cepat dan jauh lebih hemat memori dibanding `HashMap`**.

## Contoh

```java
import java.util.EnumMap;
import java.util.Map;

enum Hari { SENIN, SELASA, RABU, KAMIS, JUMAT, SABTU, MINGGU }

public class EnumMapDemo {
    public static void main(String[] args) {
        Map<Hari, String> jadwal = new EnumMap<>(Hari.class);

        jadwal.put(Hari.SENIN, "Sprint Planning & Standup");
        jadwal.put(Hari.JUMAT, "Deployment & Retrospective");

        System.out.println("Jadwal Hari Senin: " + jadwal.get(Hari.SENIN));
        System.out.println("Seluruh Jadwal   : " + jadwal);
    }
}
```

## Output

```text
Jadwal Hari Senin: Sprint Planning & Standup
Seluruh Jadwal   : {SENIN=Sprint Planning & Standup, JUMAT=Deployment & Retrospective}
```

**Hafalan:**

```text
Map<EnumKey, V> map = new EnumMap<>(EnumKey.class); → map khusus kunci enum dengan performa array internal super cepat
```

---

<a id="bagian-20"></a>

# 20. 🟡 Immutable Map Modern (`Map.of`, `Map.ofEntries`, `Map.copyOf`)

## Konsep

Java menyediakan factory method modern untuk membuat **Immutable Map (Unmodifiable)**:
1. **`Map.of(k1, v1, k2, v2, ...)`:** Mendukung hingga maksimal 10 pasangan *key-value*.
2. **`Map.ofEntries(entry(k1, v1), ...)`:** Digunakan jika jumlah pasangan *key-value* melebihi 10 entri secara rapi.
3. **`Map.copyOf(map)`:** Membuat salinan immutable dari map yang sudah ada.

## Contoh

```java
import java.util.Map;
import static java.util.Map.entry;

public class ImmutableMapDemo {
    public static void main(String[] args) {
        // 1. Map.of hingga 10 pasangan
        Map<String, Integer> httpCodes = Map.of(
            "OK", 200,
            "NOT_FOUND", 404,
            "SERVER_ERROR", 500
        );

        // 2. Map.ofEntries untuk banyak data
        Map<String, String> config = Map.ofEntries(
            entry("db.host", "localhost"),
            entry("db.port", "5432"),
            entry("db.name", "ecommerce_db"),
            entry("app.env", "production")
        );

        System.out.println("HTTP Codes: " + httpCodes);
        System.out.println("DB Host   : " + config.get("db.host"));
    }
}
```

## Output

```text
HTTP Codes: {OK=200, SERVER_ERROR=500, NOT_FOUND=404}
DB Host   : localhost
```

**Hafalan:**

```text
Map.of(key, value, ...)                → membuat immutable Map ringkas (maks 10 pasang)
Map.ofEntries(entry(k, v), ...)       → membuat immutable Map untuk jumlah pasangan fleksibel
```

---

<a id="bagian-21"></a>

# 21. 🔴 `Collections` Utility Class (Sorting, Searching, Shuffling & Wrapping)

## Konsep

Class `java.util.Collections` berisi method-method `static` untuk memanipulasi atau membungkus struktur data koleksi:
- `sort(List)` : Mengurutkan list secara in-place.
- `binarySearch(List, Key)` : Pencarian biner cepat $O(\log n)$ pada list yang sudah terurut.
- `reverse(List)` : Membalikkan urutan list.
- `shuffle(List)` : Mengacak urutan elemen.
- `frequency(Collection, Object)` : Menghitung berapa kali elemen muncul.
- `disjoint(c1, c2)` : Mengecek apakah dua koleksi tidak memiliki satupun elemen yang sama.
- `unmodifiableList(List)` / `synchronizedList(List)` : Membungkus list agar aman dari modifikasi / thread-safe wrapper.

## Contoh

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CollectionsUtilityDemo {
    public static void main(String[] args) {
        List<Integer> angka = new ArrayList<>(List.of(40, 10, 50, 20, 10, 30));

        // 1. Sorting
        Collections.sort(angka);
        System.out.println("Setelah sort       : " + angka); // [10, 10, 20, 30, 40, 50]

        // 2. Binary Search (Wajib setelah sort)
        int idx = Collections.binarySearch(angka, 30);
        System.out.println("Index angka 30     : " + idx); // 3

        // 3. Frequency
        int jumlah10 = Collections.frequency(angka, 10);
        System.out.println("Frekuensi angka 10 : " + jumlah10 + " kali");

        // 4. Reverse
        Collections.reverse(angka);
        System.out.println("Setelah reverse    : " + angka);
    }
}
```

## Output

```text
Setelah sort       : [10, 10, 20, 30, 40, 50]
Index angka 30     : 3
Frekuensi angka 10 : 2 kali
Setelah reverse    : [50, 40, 30, 20, 10, 10]
```

**Hafalan:**

```text
Collections.sort(list)                   → mengurutkan elemen list secara in-place
Collections.binarySearch(list, key)      → mencari posisi elemen dengan algoritma binary search O(log n)
Collections.frequency(collection, target)→ menghitung jumlah kemunculan target di dalam koleksi
Collections.shuffle(list)                → mengacak urutan elemen list
```

---

<a id="bagian-22"></a>

# 22. 🔴 Konversi Antar Collection, Array & Map Views (`toArray`, `entrySet`)

## Konsep

Pola konversi umum yang sangat sering digunakan dalam aplikasi backend:
1. **Collection ke Array:** `collection.toArray(new String[0])` (Metode modern yang efisien).
2. **Set $\leftrightarrow$ List:** Mengoper koleksi ke dalam constructor `new ArrayList<>(mySet)` atau `new HashSet<>(myList)`.
3. **Map Views:** Mengakses isi Map dalam bentuk Collection:
   - `map.keySet()` : Mengembalikan `Set<K>` berisi seluruh kunci.
   - `map.values()` : Mengembalikan `Collection<V>` berisi seluruh nilai.
   - `map.entrySet()` : Mengembalikan `Set<Map.Entry<K,V>>` berisi pasangan kunci dan nilai.

## Contoh

```java
import java.util.*;

public class CollectionConversionDemo {
    public static void main(String[] args) {
        // 1. Menghilangkan duplikat dari List menggunakan Set
        List<String> listDuplikat = List.of("A", "B", "A", "C", "B");
        Set<String> setUnik = new LinkedHashSet<>(listDuplikat);
        List<String> listTanpaDuplikat = new ArrayList<>(setUnik);
        System.out.println("List Bersih Tanpa Duplikat: " + listTanpaDuplikat);

        // 2. Collection ke Array
        String[] arrayHasil = listTanpaDuplikat.toArray(new String[0]);
        System.out.println("Array Length: " + arrayHasil.length);

        // 3. Map Views
        Map<String, Integer> inventory = Map.of("Buku", 50, "Pulpen", 100);
        Set<String> keys = inventory.keySet();
        Collection<Integer> values = inventory.values();

        System.out.println("Keys  : " + keys);
        System.out.println("Values: " + values);
    }
}
```

## Output

```text
List Bersih Tanpa Duplikat: [A, B, C]
Array Length: 3
Keys  : [Buku, Pulpen]
Values: [50, 100]
```

**Hafalan:**

```text
collection.toArray(new Type[0]) → mengonversi struktur data Collection menjadi Array biasa secara type-safe
```

---

<a id="bagian-23"></a>

# 23. 🔴 Panduan Kompleksitas Waktu (Big-O Time & Space Complexity Guide)

## Konsep

Pemilihan struktur data yang tepat berdampak masif pada performa dan konsumsi memori aplikasi backend Anda:

| Interface | Implementasi | Akses Acak (`get(i)`) | Pencarian (`contains`) | Penyisipan (`add`) | Penghapusan (`remove`) | Keterangan Terbaik |
|---|---|---|---|---|---|---|
| **List** | `ArrayList` | **$O(1)$** | $O(n)$ | $O(1)$ amortized | $O(n)$ | **Default pilihan utama** untuk data berurut |
| **List/Deque** | `LinkedList` | $O(n)$ | $O(n)$ | $O(1)$ di ujung | $O(1)$ di ujung | Baik untuk manipulasi ujung terus-menerus |
| **Set** | `HashSet` | N/A | **$O(1)$** | **$O(1)$** | **$O(1)$** | **Default pilihan utama** untuk keunikan data |
| **Set** | `TreeSet` | N/A | **$O(\log n)$** | **$O(\log n)$** | **$O(\log n)$** | Pilihan saat butuh data unik **selalu terurut** |
| **Queue** | `ArrayDeque` | N/A | $O(n)$ | **$O(1)$** | **$O(1)$** | **Default terbaik** untuk Antrian FIFO / Stack |
| **Queue** | `PriorityQueue`| N/A | $O(n)$ | **$O(\log n)$** | **$O(\log n)$** | Pilihan untuk antrian berbasis nilai prioritas |
| **Map** | `HashMap` | N/A | **$O(1)$ key** | **$O(1)$** | **$O(1)$** | **Default pilihan utama** untuk Key-Value |
| **Map** | `TreeMap` | N/A | **$O(\log n)$** | **$O(\log n)$** | **$O(\log n)$** | Pilihan saat butuh Map dengan Key terurut |

---

<a id="bagian-24"></a>

# 24. 🔴 Concurrency Dasar pada Collection (`ConcurrentHashMap` & Fail-Fast vs Fail-Safe)

## Konsep

Struktur data bawaan standar (`ArrayList`, `HashMap`, `HashSet`) bersifat **Non-Thread-Safe** dan menggunakan mekanisme **Fail-Fast Iterator** (langsung melempar `ConcurrentModificationException` jika mendeteksi adanya mutasi konkuren saat proses iterasi).

Untuk lingkungan *multi-threading* (seperti server Spring Boot yang menangani ribuan request HTTP paralel):
1. **`ConcurrentHashMap`:** Map thread-safe berperforma tinggi yang menggunakan teknik *Bucket Level Lock* (bukan mengunci seluruh tabel).
2. **`CopyOnWriteArrayList`:** List thread-safe yang membuat salinan array baru setiap kali terjadi operasi mutasi data (sangat ideal untuk kasus yang 99% operasinya adalah *Read-Only*).

## Contoh

```java
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

public class ConcurrentCollectionDemo {
    public static void main(String[] args) {
        // Map Thread-Safe berkinerja tinggi untuk aplikasi concurrent
        Map<String, Integer> activeSessions = new ConcurrentHashMap<>();

        activeSessions.put("session_abc", 1001);
        activeSessions.put("session_xyz", 1002);

        // Operasi atomic thread-safe modern
        activeSessions.putIfAbsent("session_abc", 9999); // Tidak tertimpa karena sudah ada
        activeSessions.computeIfPresent("session_xyz", (k, v) -> v + 50); // Nilai di-update menjadi 1052

        System.out.println("Active Concurrent Sessions: " + activeSessions);
    }
}
```

## Output

```text
Active Concurrent Sessions: {session_xyz=1052, session_abc=1001}
```

**Hafalan:**

```text
ConcurrentHashMap<K, V> → implementasi Map thread-safe modern berperforma tinggi tanpa bottleneck lock global
```

---

<a id="bagian-25"></a>

# 25. 🛠️ Peta Ingatan Cepat

```text
                      PANDUAN PEMILIHAN STRUKTUR DATA
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          ▼                          ▼                          ▼
   BUTUH KEY - VALUE?         BUTUH ELEMEN UNIK?        BUTUH PROSES ANTRIAN?
          │                          │                          │
    ┌─────┴─────┐              ┌─────┴─────┐              ┌─────┴─────┐
    ▼           ▼              ▼           ▼              ▼           ▼
  HashMap    TreeMap        HashSet     TreeSet       ArrayDeque  PriorityQueue
(Cepat O(1)) (Terurut)    (Cepat O(1)) (Terurut)      (FIFO/Stack) (Prioritas)
```

---

<a id="bagian-26"></a>

# 26. 📚 Tabel Ringkasan

| Interface | Class Utama | Duplikasi | Urutan Elemen | Null Value | Kompleksitas Umum |
|---|---|---|---|---|---|
| `List` | `ArrayList` | Ya | Terurut (Index) | Ya | $O(1)$ Read, $O(n)$ Shift |
| `List` | `LinkedList` | Ya | Terurut (Node) | Ya | $O(1)$ Ujung, $O(n)$ Read |
| `Set` | `HashSet` | **Tidak** | Acak / Tidak Terurut | Ya (1x) | **$O(1)$** Rata-rata |
| `Set` | `LinkedHashSet` | **Tidak** | Insertion-Order | Ya (1x) | **$O(1)$** Rata-rata |
| `Set` | `TreeSet` | **Tidak** | Sorted (Alami/Kustom) | **Tidak** | $O(\log n)$ |
| `Queue` | `ArrayDeque` | Ya | FIFO / LIFO | **Tidak** | **$O(1)$** Ujung |
| `Queue` | `PriorityQueue` | Ya | Berbasis Prioritas Heap | **Tidak** | $O(\log n)$ |
| `Map` | `HashMap` | Key Tidak | Acak / Tidak Terurut | Key (1x) | **$O(1)$** Rata-rata |
| `Map` | `TreeMap` | Key Tidak | Sorted Key | Key **Tidak**| $O(\log n)$ |

---

<a id="bagian-27"></a>

# 27. ⚡ Cheat Code Java Collection 10 Detik

```java
// 1. List Cepat
List<String> list = new ArrayList<>(List.of("A", "B", "C"));
list.add("D");

// 2. Set Unik Cepat
Set<String> set = new HashSet<>(list); // Hapus duplikat otomatis

// 3. Map Praktis
Map<String, Integer> map = new HashMap<>();
map.put("Java", 21);
int ver = map.getOrDefault("Java", 0);

// 4. Queue / Stack Modern
Deque<String> stack = new ArrayDeque<>();
stack.push("Puncak");
String top = stack.pop();

// 5. Java 21 Sequenced
String first = list.getFirst();
String last = list.getLast();
```

---

<a id="bagian-28"></a>

# 28. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Kuasai List & ArrayList
├── Pahami dynamic array resizing dan akses indeks O(1)
└── Gunakan List.of() untuk data konfigurasi konstan
       │
       ▼
Langkah 2: Kuasai Set untuk Menjamin Keunikan Data
├── Gunakan HashSet untuk eliminasi duplikasi cepat O(1)
└── Pahami kapan membutuhkan LinkedHashSet vs TreeSet
       │
       ▼
Langkah 3: Kuasai Map untuk Relasi Key-Value
├── Kuasai HashMap, getOrDefault, dan iterasi via entrySet
└── Gunakan EnumMap untuk efisiensi kunci Enum
       │
       ▼
Langkah 4: Kuasai Queue & Deque untuk Alur Kerja Data
├── Terapkan ArrayDeque untuk antrian FIFO dan Stack LIFO
└── Terapkan PriorityQueue untuk antrian berbobot/prioritas
       │
       ▼
Langkah 5: Siap Melangkah ke Java Stream API & Spring Boot Architecture!
```

---

<a id="bagian-29"></a>

# 29. 🏗️ Mini Project: Sistem Manajemen Keranjang Belanja & Antrian Pesanan E-Commerce CLI

Aplikasi konsol e-commerce nyata yang mengintegrasikan: `ArrayList` (Katalog), `HashSet` (Kategori Unik), `HashMap` (Keranjang Belanja Key-Value), `ArrayDeque` (Antrian Pesanan Masuk), `PriorityQueue` (Antrian Pengiriman Berprioritas Ekspedisi), dan `Collections` utilities.

```java
import java.util.*;

// 1. Record Model Produk
record Produk(String kode, String nama, double harga, String kategori) {}

// 2. Record Model Pesanan Pengiriman
record PesananPengiriman(String idPesanan, String namaPelanggan, double totalBayar, int prioritasKurir) {
    // Prioritas 1 = Instan Sameday, 2 = Next Day, 3 = Reguler
}

public class EcommerceStoreApp {
    // Struktur Data 1: List untuk Katalog Produk Toko
    private static final List<Produk> katalog = new ArrayList<>();

    // Struktur Data 2: Set untuk Kategori Unik yang Tersedia
    private static final Set<String> daftarKategori = new LinkedHashSet<>();

    // Struktur Data 3: Map untuk Keranjang Belanja Pelanggan (Kode Produk -> Qty)
    private static final Map<String, Integer> keranjang = new HashMap<>();

    // Struktur Data 4: Queue (ArrayDeque) untuk Antrian Checkout Masuk (FIFO)
    private static final Queue<String> antrianCheckout = new ArrayDeque<>();

    // Struktur Data 5: PriorityQueue untuk Antrian Kurir Pengiriman (Prioritas 1 Tercepat)
    private static final Queue<PesananPengiriman> antrianKurir = new PriorityQueue<>(
        Comparator.comparingInt(PesananPengiriman::prioritasKurir)
    );

    static {
        tambahProduk(new Produk("P01", "MacBook Pro M3", 28_000_000, "Elektronik"));
        tambahProduk(new Produk("P02", "Logitech Mouse", 450_000, "Aksesoris"));
        tambahProduk(new Produk("P03", "Mechanical Keyboard", 1_200_000, "Aksesoris"));
        tambahProduk(new Produk("P04", "Monitor Dell 4K", 6_500_000, "Elektronik"));
    }

    private static void tambahProduk(Produk p) {
        katalog.add(p);
        daftarKategori.add(p.kategori()); // Set otomatis menjaga keunikan kategori
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("==================================================");
        System.out.println("   SISTEM MANAJEMEN E-COMMERCE NUSANTARA CLI      ");
        System.out.println("==================================================");

        System.out.println("\n--- 1. DAFTAR KATEGORI TERSEDIA (LinkedHashSet) ---");
        for (String kat : daftarKategori) {
            System.out.println("🏷️  Kategori: " + kat);
        }

        System.out.println("\n--- 2. KATALOG PRODUK (ArrayList & Collections.sort) ---");
        // Sort produk berdasarkan harga termurah
        katalog.sort(Comparator.comparingDouble(Produk::harga));
        for (Produk p : katalog) {
            System.out.printf("[%s] %-22s | Rp %,12.2f | %s%n", p.kode(), p.nama(), p.harga(), p.kategori());
        }

        // Simulasi 3: Menambah Barang ke Keranjang (HashMap)
        System.out.println("\n--- 3. MENAMBAH KE KERANJANG BELANJA (HashMap) ---");
        keranjang.put("P01", 1); // 1 Unit MacBook
        keranjang.put("P02", 2); // 2 Unit Mouse
        keranjang.put("P03", 1); // 1 Unit Keyboard

        double totalBelanja = 0;
        System.out.println("Detail Keranjang Belanja:");
        for (Map.Entry<String, Integer> item : keranjang.entrySet()) {
            Produk p = katalog.stream().filter(prod -> prod.kode().equals(item.getKey())).findFirst().orElse(null);
            if (p != null) {
                double subtotal = p.harga() * item.getValue();
                totalBelanja += subtotal;
                System.out.printf("- %s (x%d) = Rp %,12.2f%n", p.nama(), item.getValue(), subtotal);
            }
        }
        System.out.printf("TOTAL WAJIB BAYAR: Rp %,12.2f%n", totalBelanja);

        // Simulasi 4: Antrian Checkout FIFO (ArrayDeque)
        System.out.println("\n--- 4. ANTRIAN CHECKOUT PESANAN (ArrayDeque - FIFO) ---");
        antrianCheckout.offer("Pesanan-001 (Budi)");
        antrianCheckout.offer("Pesanan-002 (Siti)");
        antrianCheckout.offer("Pesanan-003 (Ahmad)");

        while (!antrianCheckout.isEmpty()) {
            System.out.println("✅ Memproses Checkout: " + antrianCheckout.poll());
        }

        // Simulasi 5: Antrian Ekspedisi Berprioritas (PriorityQueue)
        System.out.println("\n--- 5. ANTRIAN EKSPEDISI PENGIRIMAN (PriorityQueue) ---");
        antrianKurir.offer(new PesananPengiriman("ORD-101", "Pelanggan Reguler (Doni)", 450_000, 3));
        antrianKurir.offer(new PesananPengiriman("ORD-102", "Pelanggan Instan Sameday (Rina)", 28_000_000, 1));
        antrianKurir.offer(new PesananPengiriman("ORD-103", "Pelanggan NextDay (Fani)", 1_200_000, 2));

        System.out.println("Urutan Penugasan Armada Kurir:");
        while (!antrianKurir.isEmpty()) {
            PesananPengiriman order = antrianKurir.poll();
            String labelPrioritas = switch (order.prioritasKurir()) {
                case 1 -> "⚡ INSTAN SAMEDAY";
                case 2 -> "🚚 NEXT DAY";
                default -> "📦 REGULER";
            };
            System.out.printf("-> Kirim ID: %s | %-32s | Prioritas: %s%n", order.idPesanan(), order.namaPelanggan(), labelPrioritas);
        }

        System.out.println("\n==================================================");
        System.out.println("   SELURUH STRUKTUR DATA COLLECTION SUKSES DIUJI  ");
        System.out.println("==================================================");
        scanner.close();
    }
}
```

## Output Demonstrasi

```text
==================================================
   SISTEM MANAJEMEN E-COMMERCE NUSANTARA CLI      
==================================================

--- 1. DAFTAR KATEGORI TERSEDIA (LinkedHashSet) ---
🏷️  Kategori: Elektronik
🏷️  Kategori: Aksesoris

--- 2. KATALOG PRODUK (ArrayList & Collections.sort) ---
[P02] Logitech Mouse         | Rp   450,000.00 | Aksesoris
[P03] Mechanical Keyboard    | Rp 1,200,000.00 | Aksesoris
[P04] Monitor Dell 4K        | Rp 6,500,000.00 | Elektronik
[P01] MacBook Pro M3         | Rp 28,000,000.00 | Elektronik

--- 3. MENAMBAH KE KERANJANG BELANJA (HashMap) ---
Detail Keranjang Belanja:
- Logitech Mouse (x2) = Rp   900,000.00
- Mechanical Keyboard (x1) = Rp 1,200,000.00
- MacBook Pro M3 (x1) = Rp 28,000,000.00
TOTAL WAJIB BAYAR: Rp 30,100,000.00

--- 4. ANTRIAN CHECKOUT PESANAN (ArrayDeque - FIFO) ---
✅ Memproses Checkout: Pesanan-001 (Budi)
✅ Memproses Checkout: Pesanan-002 (Siti)
✅ Memproses Checkout: Pesanan-003 (Ahmad)

--- 5. ANTRIAN EKSPEDISI PENGIRIMAN (PriorityQueue) ---
Urutan Penugasan Armada Kurir:
-> Kirim ID: ORD-102 | Pelanggan Instan Sameday (Rina)  | Prioritas: ⚡ INSTAN SAMEDAY
-> Kirim ID: ORD-103 | Pelanggan NextDay (Fani)         | Prioritas: 🚚 NEXT DAY
-> Kirim ID: ORD-101 | Pelanggan Reguler (Doni)         | Prioritas: 📦 REGULER

==================================================
   SELURUH STRUKTUR DATA COLLECTION SUKSES DIUJI  
==================================================
```

---

<a id="bagian-30"></a>

# 30. 🔗 Referensi Resmi

- [Oracle Java Collections Framework Overview & Trail](https://docs.oracle.com/javase/tutorial/collections/)
- [Java SE 21 Collections Interface Specification](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Collection.html)
- [JEP 431: Sequenced Collections (Java 21)](https://openjdk.org/jeps/431)
- [Effective Java by Joshua Bloch - Collections Chapter](https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/)
