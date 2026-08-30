# Java Collection Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Java Modern (Java 21 LTS) untuk pemula yang ingin memahami struktur data Collection Framework. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> Java Collection Framework adalah sekumpulan interface dan class yang menyediakan arsitektur terstandarisasi untuk menyimpan, mengelola, dan memanipulasi sekumpulan objek secara dinamis.

## Daftar Isi

1. [Pengenalan Collection Framework](#1-pengenalan-collection-framework)
2. [Iterable dan Iterator](#2-iterable-dan-iterator)
3. [Collection Interface](#3-collection-interface)
4. [List dan ArrayList](#4-list-dan-arraylist)
5. [LinkedList](#5-linkedlist)
6. [Immutable List](#6-immutable-list)
7. [Set dan HashSet](#7-set-dan-hashset)
8. [LinkedHashSet](#8-linkedhashset)
9. [TreeSet](#9-treeset)
10. [EnumSet](#10-enumset)
11. [Queue dan ArrayDeque](#11-queue-dan-arraydeque)
12. [PriorityQueue](#12-priorityqueue)
13. [Deque dan Stack](#13-deque-dan-stack)
14. [Map dan HashMap](#14-map-dan-hashmap)
15. [LinkedHashMap](#15-linkedhashmap)
16. [TreeMap](#16-treemap)
17. [EnumMap](#17-enummap)
18. [Immutable Map](#18-immutable-map)
19. [Collections Utility](#19-collections-utility)
20. [Konversi Collection](#20-konversi-collection)

---

# 1. Pengenalan Collection Framework

Collection Framework menggantikan keterbatasan Array statis dengan struktur data dinamis yang dapat bertambah dan berkurang ukurannya secara otomatis.

Struktur utama:
- `List`: Urutan berindeks, boleh duplikat.
- `Set`: Kumpulan unik, tidak boleh duplikat.
- `Queue`: Antrian pemrosesan data (FIFO).
- `Map`: Pasangan Key-Value (bukan turunan `Collection`).

---

# 2. Iterable dan Iterator

`Iterable` adalah antarmuka akar yang memungkinkan suatu objek diiterasi menggunakan loop for-each.

```java
List<String> names = List.of("Ahmad", "Budi", "Citra");
Iterator<String> iterator = names.iterator();

while (iterator.hasNext()) {
    System.out.println(iterator.next());
}
```

---

# 3. Collection Interface

Interface dasar turunan `Iterable` dengan operasi umum: `add()`, `remove()`, `contains()`, `size()`, `clear()`.

```java
Collection<String> items = new ArrayList<>();
items.add("Buku");
items.add("Pulpen");
items.remove("Buku");
System.out.println("Size: " + items.size());
```

---

# 4. List dan ArrayList

`ArrayList` menggunakan array dinamis internal. Sangat cepat untuk operasi baca/akses indeks (`get(index)` O(1)), tetapi lambat untuk penambahan/penghapusan di tengah.

```java
List<String> list = new ArrayList<>();
list.add("Apel");
list.add("Mangga");
list.add(1, "Jeruk"); // Sisip di index 1
System.out.println(list.get(0)); // Apel
```

---

# 5. LinkedList

`LinkedList` menggunakan struktur *doubly linked list*. Sangat cepat untuk penambahan/penghapusan di awal/akhir list (O(1)), tetapi lebih lambat untuk akses acak (O(n)).

```java
List<String> linkedList = new LinkedList<>();
linkedList.add("Satu");
linkedList.add("Dua");
```

---

# 6. Immutable List

List yang tidak dapat diubah (unmodifiable) setelah dibuat.

```java
List<String> immutable = List.of("Java", "Kotlin", "Go");
// immutable.add("PHP"); // UnsupportedOperationException
```

---

# 7. Set dan HashSet

`Set` menjamin setiap elemen bersifat unik (tanpa duplikasi). `HashSet` tidak menjamin urutan elemen dan menggunakan `hashCode()` untuk lookup instan O(1).

```java
Set<String> set = new HashSet<>();
set.add("Budi");
set.add("Budi"); // Diabaikan karena duplikat
System.out.println("Total: " + set.size()); // 1
```

---

# 8. LinkedHashSet

`LinkedHashSet` menggabungkan keunikan Set dengan pemeliharaan urutan penyisipan (*insertion-order*).

```java
Set<String> linkedSet = new LinkedHashSet<>();
linkedSet.add("Zebra");
linkedSet.add("Ayam");
linkedSet.add("Kucing");
// Urutan iterasi pasti: Zebra -> Ayam -> Kucing
```

---

# 9. TreeSet

`TreeSet` menyimpan elemen unik yang terurut secara otomatis (*natural ordering* atau via `Comparator`) berbasis struktur Red-Black Tree.

```java
Set<Integer> treeSet = new TreeSet<>();
treeSet.add(50);
treeSet.add(10);
treeSet.add(30);
System.out.println(treeSet); // [10, 30, 50]
```

---

# 10. EnumSet

Set khusus yang dioptimasi secara ekstrem untuk tipe data `Enum` berbasis bit vector.

```java
enum Day { MON, TUE, WED, THU, FRI, SAT, SUN }
Set<Day> weekend = EnumSet.of(Day.SAT, Day.SUN);
```

---

# 11. Queue dan ArrayDeque

`Queue` merepresentasikan antrian FIFO (*First In First Out*). `ArrayDeque` adalah implementasi default modern berbasis array sirkular.

```java
Queue<String> antrian = new ArrayDeque<>();
antrian.offer("Pelanggan 1");
antrian.offer("Pelanggan 2");

System.out.println(antrian.poll()); // Ambil & hapus: Pelanggan 1
System.out.println(antrian.peek()); // Lihat depan: Pelanggan 2
```

---

# 12. PriorityQueue

Elemen di dalam `PriorityQueue` diproses berdasarkan prioritas nilainya (terkecil dahulu secara default), bukan berdasarkan urutan waktu masuk.

```java
Queue<Integer> pq = new PriorityQueue<>();
pq.offer(50);
pq.offer(10);
pq.offer(30);
System.out.println(pq.poll()); // 10 (Prioritas Tertinggi / Nilai Terkecil)
```

---

# 13. Deque dan Stack

`Deque` (*Double-Ended Queue*) memungkinkan operasi penyisipan dan penghapusan di kedua ujung. Direkomendasikan sebagai pengganti class legacy `Stack`.

```java
Deque<String> stack = new ArrayDeque<>();
stack.push("Baris 1");
stack.push("Baris 2");
System.out.println(stack.pop()); // Baris 2 (LIFO)
```

---

# 14. Map dan HashMap

`Map` menyimpan pasangan kunci dan nilai (*Key-Value*). Kunci wajib unik. `HashMap` adalah implementasi default tercepat berbasis hash table.

```java
Map<String, String> capital = new HashMap<>();
capital.put("ID", "Jakarta");
capital.put("JP", "Tokyo");
System.out.println(capital.get("ID")); // Jakarta
```

---

# 15. LinkedHashMap

`LinkedHashMap` mempertahankan urutan penyimpanan *key-value* sesuai urutan saat dimasukkan (*insertion order*).

```java
Map<String, Integer> map = new LinkedHashMap<>();
map.put("Tiga", 3);
map.put("Satu", 1);
```

---

# 16. TreeMap

`TreeMap` menyimpan pasangan *key-value* dengan kunci yang selalu terurut secara otomatis.

```java
Map<String, Integer> treeMap = new TreeMap<>();
treeMap.put("Z", 100);
treeMap.put("A", 200);
System.out.println(treeMap.firstKey()); // A
```

---

# 17. EnumMap

Map khusus yang sangat efisien di mana kuncinya wajib berupa tipe `Enum`.

```java
Map<Day, String> schedule = new EnumMap<>(Day.class);
schedule.put(Day.MON, "Meeting");
```

---

# 18. Immutable Map

```java
Map<String, Integer> immutableMap = Map.of("A", 1, "B", 2);
```

---

# 19. Collections Utility

Class helper `java.util.Collections` untuk manipulasi koleksi.

```java
List<Integer> numbers = new ArrayList<>(List.of(3, 1, 4, 1, 5));
Collections.sort(numbers);       // [1, 1, 3, 4, 5]
Collections.reverse(numbers);    // [5, 4, 3, 1, 1]
int freq = Collections.frequency(numbers, 1); // 2
```

---

# 20. Konversi Collection

```java
// Set ke List
Set<String> set = Set.of("A", "B");
List<String> list = new ArrayList<>(set);

// Collection ke Array
String[] array = list.toArray(new String[0]);
```
