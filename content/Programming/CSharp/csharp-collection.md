---
title: "C# Collection Framework"
description: "Panduan komprehensif struktur data dan collections di C# 14 dan .NET 10 LTS: List, Dictionary, HashSet, Queue, PriorityQueue, Collection Expressions, Spread operator, Immutable Collections, serta zero-allocation memory slicing via Span<T>."
order: 4
tags:
  - csharp
  - dotnet
  - programming
  - collection
  - data-structures
---

# C# Collection Framework

> Target: Pemula hingga Menengah  
> Versi: C# 14 / .NET 10 LTS  
> Prasyarat: [[csharp-dasar|C# Dasar]], [[csharp-oop|C# OOP]], dan [[csharp-generic|C# Generic]]

---

## Gambaran Umum

Dalam rekayasa perangkat lunak modern, sebagian besar data bisnis tidak berbentuk nilai tunggal skalar melainkan sekumpulan data terkait: daftar transaksi perbankan, antrean pesanan gudang, direktori konfigurasi sistem, atau himpunan identitas pengguna unik.

Bahasa C# dan runtime .NET 10 LTS menyediakan ekosistem **Collection Framework** yang luar biasa kaya, aman secara tipe (*type-safe*), dan dioptimalkan secara agresif pada tingkat mesin. Modul ini membahas secara tuntas struktur data esensial di namespace `System.Collections.Generic`, evolusi sintaksis modern C# 12-14 seperti **Collection Expressions** (`[...]`) dan **Spread Operator** (`..`), koleksi data tak dapat diubah (*Immutable Collections*), hingga teknik slicing memori berkinerja ekstrem tanpa alokasi Garbage Collection (*zero-allocation*) menggunakan **`Span<T>`** dan **`ReadOnlySpan<T>`**.

---

## Cara Belajar

1. Pahami mental model hierarki antarmuka bawaan .NET (`IEnumerable<T>`, `ICollection<T>`, `IList<T>`).
2. Kuasai tiga struktur data kerja harian utama: `List<T>`, `Dictionary<TKey, TValue>`, dan `HashSet<T>`.
3. Eksplorasi struktur data terurut dan sekuensial seperti `Queue<T>`, `Stack<T>`, dan `PriorityQueue<TElement, TPriority>`.
4. Praktikkan gaya penulisan modern C# 14 dengan Collection Expressions seragam (`[]`).
5. Pelajari teknik optimasi performa backend: hindari alokasi array yang tidak perlu dan gunakan `Span<T>` untuk parsing berkecepatan tinggi.
6. Terapkan seluruh materi ke dalam Mini Project pemrosesan antrean dan batch pesanan e-commerce.

---

## Daftar Isi

### 🟢 Fundamental

1. [Mental Model Koleksi Data vs Array Mentah](#1--mental-model-koleksi-data-vs-array-mentah)
2. [Hierarki Antarmuka Inti (.NET Collection Interfaces)](#2--hierarki-antarmuka-inti-net-collection-interfaces)
3. [List: Dynamic Array Fleksibel](#3--list-dynamic-array-fleksibel)
4. [Dictionary: Hash Table Berkecepatan Tinggi O(1)](#4--dictionary-hash-table-berkecepatan-tinggi-o1)
5. [HashSet: Himpunan Nilai Unik dan Operasi Matematika](#5--hashset-himpunan-nilai-unik-dan-operasi-matematika)

### 🟡 Intermediate

6. [Queue dan Stack: Pengolahan Sekuensial FIFO dan LIFO](#6--queue-dan-stack-pengolahan-sekuensial-fifo-dan-lifo)
7. [PriorityQueue: Antrean Berbasis Prioritas Min-Heap](#7--priorityqueue-antrean-berbasis-prioritas-min-heap)
8. [Koleksi Terurut: SortedList, SortedDictionary, dan SortedSet](#8--koleksi-terurut-sortedlist-sorteddictionary-dan-sortedset)
9. [C# Modern: Collection Expressions dan Spread Operator](#9--c-modern-collection-expressions-dan-spread-operator)

### 🔴 Advanced

10. [Immutability Sejati: System.Collections.Immutable](#10--immutability-sejati-systemcollectionsimmutable)
11. [Zero-Allocation Memory Slicing: Span dan ReadOnlySpan](#11--zero-allocation-memory-slicing-span-dan-readonlyspan)
12. [Tabel Komparasi Big-O Complexity dan Karakteristik Memori](#12--tabel-komparasi-big-o-complexity-dan-karakteristik-memori)
13. [Pengenalan Thread-Safe Collections (Concurrent Collections)](#13--pengenalan-thread-safe-collections-concurrent-collections)

### 🛠️ Praktik

14. [Best Practice Arsitektur Collections](#14-️-best-practice-arsitektur-collections)
15. [Kesalahan Umum Pemula](#15-️-kesalahan-umum-pemula)
16. [Mini Project: Priority Dispatch dan Fast Slicing Fulfillment Engine](#16-️-mini-project-priority-dispatch-dan-fast-slicing-fulfillment-engine)

### 📚 Referensi

17. [Peta Ingatan](#17--peta-ingatan)
18. [Cheat Code 10 Detik](#18--cheat-code-10-detik)
19. [Urutan Belajar Berikutnya](#19--urutan-belajar-berikutnya)
20. [Referensi Resmi](#20--referensi-resmi)

---

## 1. 🟢 Mental Model Koleksi Data vs Array Mentah

### Konsep

Di level paling bawah perangkat keras dan arsitektur memori .NET, struktur data paling mendasar adalah **Array** (`T[]`). Array menyimpan elemen-elemen data secara berurutan (*contiguous memory block*) dengan ukuran tetap (*fixed size*).

Keterbatasan array mentah:
1. **Ukuran Kaku (Fixed Capacity):** Sekali diinisialisasi dengan ukuran $N$, kapasitas array tidak dapat ditambah atau dikurangi. Untuk menambah 1 elemen, Anda harus mengalokasikan array baru berukuran $N+1$ dan menyalin seluruh elemen lama.
2. **Minim Operasi Terbina:** Array mentah tidak menyediakan operasi cerdas seperti pencarian berbasis hash kunci, pengecekan duplikasi otomatis, atau manipulasi antrean berbobot prioritas.

**Collection Framework** di .NET dibangun di atas struktur memori dasar tersebut, membungkusnya dengan logika manajemen kapasitas dinamis, pointer hashing, dan algoritma penyeimbangan pohon (*balanced tree*) untuk memenuhi kebutuhan aplikasi nyata.

### Mental Model

```text
┌────────────────────────────────────────────────────────┐
│                      Array (T[])                       │
│  - Ukuran kaku ditentukan saat instansiasi             │
│  - Alokasi memori berurutan (Contiguous)              │
│  - Akses indeks secepat kilat: O(1)                    │
└───────────────────────────┬────────────────────────────┘
                            │ dibungkus & diabstraksi oleh
                            ▼
┌────────────────────────────────────────────────────────┐
│             .NET Generic Collections                   │
│                                                        │
│  ┌───────────────────┐        ┌─────────────────────┐  │
│  │     List<T>       │        │ Dictionary<TKey,TV> │  │
│  │ Kapasitas dinamis │        │ Lookup instan O(1)  │  │
│  └───────────────────┘        └─────────────────────┘  │
│  ┌───────────────────┐        ┌─────────────────────┐  │
│  │    HashSet<T>     │        │ PriorityQueue<T, P> │  │
│  │ Elemen selalu unik│        │ Min-heap prioritas  │  │
│  └───────────────────┘        └─────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

---

## 2. 🟢 Hierarki Antarmuka Inti (.NET Collection Interfaces)

### Konsep

Ekosistem koleksi .NET didesain menggunakan prinsip *Interface Segregation* yang sangat rapi. Setiap antarmuka memberikan kontrak kemampuan tertentu:

```text
                    IEnumerable<T>
                   (Hanya foreach)
                          │
                          ▼
                    ICollection<T>
              (Count, Add, Remove, Contains)
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
         IList<T>               IDictionary<TKey, TValue>
   (Index [i], Insert, RemoveAt)    (Keys, Values, TryGetValue)
```

1. **`IEnumerable<T>`:** Antarmuka paling dasar. Hanya mendukung iterasi satu arah maju (*forward-only traversal*) via method `GetEnumerator()` yang dieksekusi oleh perulangan `foreach`. Tidak mengetahui jumlah elemen total sebelum diiterasi.
2. **`ICollection<T>`:** Menurunkan `IEnumerable<T>`, menambahkan properti `Count`, method penambahan (`Add`), penghapusan (`Remove`), pembersihan (`Clear`), dan pengecekan keberadaan (`Contains`).
3. **`IList<T>`:** Menurunkan `ICollection<T>`, mendukung akses posisi langsung menggunakan indeks kurung siku `[int index]`, serta method `Insert(index, item)` dan `RemoveAt(index)`.
4. **`IReadOnlyCollection<T>` & `IReadOnlyList<T>`:** Antarmuka pelindung (*defensive read-only contract*). Hanya mengekspos `Count` dan indexer *getter* `this[int index] { get; }` tanpa method pemutasi data.

### Contoh Kontrak Antarmuka

```csharp
// Menggunakan antarmuka paling abstrak pada parameter method
public static void CetakElemen<T>(IEnumerable<T> kumpulanData)
{
    foreach (T item in kumpulanData)
    {
        Console.Write($"{item} ");
    }
    Console.WriteLine();
}

// Bekerja untuk Array, List, maupun HashSet tanpa duplikasi kode
CetakElemen(new int[] { 10, 20, 30 });
CetakElemen(new List<string> { "Alpha", "Beta", "Gamma" });
CetakElemen(new HashSet<double> { 3.14, 2.71 });
```

Output:
```text
10 20 30 
Alpha Beta Gamma 
3.14 2.71 
```

**Hafalan:**
```text
IEnumerable<T>  -> cukup untuk membaca data dengan foreach
ICollection<T>  -> butuh informasi Count dan operasi Add/Remove
IList<T>        -> butuh akses elemen berdasarkan indeks spesifik [i]
IReadOnlyList<T>-> mengembalikan koleksi ke publik tanpa izin mutasi
```

---

## 3. 🟢 List<T>: Dynamic Array Fleksibel

### Konsep

`List<T>` adalah koleksi data yang paling sering digunakan dalam aplikasi C#. `List<T>` mengimplementasikan `IList<T>` dengan membungkus array internal (`T[]`) yang ukurannya dapat bertambah secara otomatis saat dibutuhkan.

### Cara Kerja Internal (Capacity Doubling)

Ketika elemen ditambahkan (`Add`) melampaui kapasitas buffer array internal saat ini:
1. `List<T>` mengalokasikan array baru di Managed Heap dengan ukuran **dua kali lipat** dari kapasitas sebelumnya ($2 	imes Capacity$).
2. Seluruh elemen dari array lama disalin ke array baru.
3. Array lama ditinggalkan untuk dibersihkan oleh Garbage Collector (GC).

```text
Status Awal (Capacity = 4, Count = 4):
[ A ][ B ][ C ][ D ]

Eksekusi: list.Add('E');
1. Alokasi array baru (Capacity = 8):
   [   ][   ][   ][   ][   ][   ][   ][   ]
2. Salin data lama:
   [ A ][ B ][ C ][ D ][   ][   ][   ][   ]
3. Masukkan data baru:
   [ A ][ B ][ C ][ D ][ E ][   ][   ][   ]
```

### Contoh Penggunaan Lengkap

```csharp
// Inisialisasi List
List<string> bahasa = new();

// Menambahkan elemen: O(1) amortized
bahasa.Add("C#");
bahasa.Add("F#");
bahasa.Add("TypeScript");

// Menambahkan banyak elemen sekaligus
bahasa.AddRange(["Rust", "Go", "Kotlin"]);

// Akses berbasis indeks: O(1)
Console.WriteLine($"Elemen indeks 0: {bahasa[0]}");

// Menghapus elemen berdasarkan nilai atau indeks
bahasa.Remove("F#");      // O(N) karena harus menggeser elemen
bahasa.RemoveAt(0);       // O(N) menghapus indeks 0 (C#)

// Pencarian dan predicate
bool adaRust = bahasa.Contains("Rust");
string? kataPanjang = bahasa.Find(b => b.Length > 5);

Console.WriteLine($"Total elemen: {bahasa.Count}, Kapasitas: {bahasa.Capacity}");
Console.WriteLine($"Ada Rust: {adaRust}, Kata > 5 huruf: {kataPanjang}");
```

Output:
```text
Elemen indeks 0: C#
Total elemen: 4, Kapasitas: 8
Ada Rust: True, Kata > 5 huruf: TypeScript
```

> [!TIP]
> **Pre-allocate Capacity:** Jika Anda mengetahui bahwa sebuah `List<T>` akan menampung 5.000 data, inisialisasikan kapasitasnya sejak awal: `var list = new List<Order>(5000);`. Ini mencegah proses re-alokasi memori berkali-kali ($4 
ightarrow 8 
ightarrow 16 
ightarrow \dots 
ightarrow 8192$) yang membebani Garbage Collector.

---

## 4. 🟢 Dictionary<TKey, TValue>: Hash Table Berkecepatan Tinggi O(1)

### Konsep

`Dictionary<TKey, TValue>` adalah koleksi pasangan kunci-nilai (*key-value pairs*). Setiap kunci (*key*) harus bersifat unik dan tidak boleh `null`. 

`Dictionary` menggunakan algoritma pemetaan hash (*hash table*) sehingga operasi pencarian, penambahan, dan penghapusan data memiliki kompleksitas waktu rata-rata konstan **$O(1)$**, tidak peduli apakah kamus menampung 10 data atau 1.000.000 data!

### Cara Kerja Hashing

```text
    Key ("USER-101")
           │
           ▼
     GetHashCode()  ->  Hash Code Integer (contoh: 8943712)
           │
           ▼
    Modulo Bucket   ->  Bucket Index = 8943712 % KapasitasBucket (misal: Bucket #4)
           │
           ▼
    Penyimpanan     ->  Entry disimpan di Bucket #4
```

Jika dua kunci berbeda menghasilkan bucket yang sama (*hash collision*), .NET menyelesaikannya secara transparan menggunakan teknik *collision resolution chaining*.

### Operasi Aman: TryGetValue vs Indexer

Ketika membaca data dari Dictionary:
* Mengakses kunci yang **tidak ada** via indexer `dict[key]` akan melempar exception fatal: `KeyNotFoundException`.
* Gunakan method `TryGetValue(key, out var val)` yang aman, cepat, dan tidak melempar exception!

```csharp
Dictionary<string, decimal> daftarHarga = new()
{
    ["LAPTOP-01"] = 14500000m,
    ["MOUSE-01"]  = 350000m,
    ["KEYBOARD"]  = 850000m
};

// 1. Menambahkan data aman (C# 14 / .NET)
daftarHarga.TryAdd("MOUSE-01", 400000m); // Mengembalikan false karena sudah ada, tanpa crash

// 2. Membaca data dengan aman via TryGetValue
string kodeCari = "LAPTOP-01";
if (daftarHarga.TryGetValue(kodeCari, out decimal harga))
{
    Console.WriteLine($"Harga {kodeCari}: Rp{harga:N0}");
}
else
{
    Console.WriteLine($"Produk {kodeCari} tidak ditemukan!");
}

// 3. Iterasi pasangan Key-Value
foreach (KeyValuePair<string, decimal> item in daftarHarga)
{
    Console.WriteLine($"- {item.Key}: Rp{item.Value:N0}");
}
```

Output:
```text
Harga LAPTOP-01: Rp14,500,000
- LAPTOP-01: Rp14,500,000
- MOUSE-01: Rp350,000
- KEYBOARD: Rp850,000
```

> [!WARNING]
> **Key Immutability:** Jangan pernah menggunakan objek yang *state*-nya dapat berubah (mutable object) sebagai Key di dalam `Dictionary`. Jika properti objek berubah setelah disimpan, nilai `GetHashCode()` objek tersebut akan berubah, mengakibatkan data Anda "hilang" di dalam Dictionary dan tidak dapat ditemukan kembali!

---

## 5. 🟢 HashSet<T>: Himpunan Nilai Unik dan Operasi Matematika

### Konsep

`HashSet<T>` adalah struktur data himpunan (*set*) yang menjamin setiap elemen di dalamnya bersifat **unik** tanpa urutan tertentu (*unordered*).

`HashSet<T>` menggunakan algoritma hash internal yang mirip dengan `Dictionary`, menjadikannya memiliki kecepatan pencarian `Contains(item)` sebesar **$O(1)$**, jauh melampaui `List<T>.Contains(item)` yang membutuhkan waktu **$O(N)$**.

### Operasi Aljabar Himpunan

`HashSet<T>` menyediakan operasi teori himpunan bawaan yang sangat kuat:
* `UnionWith(other)`: Gabungan ($A \cup B$)
* `IntersectWith(other)`: Irisan ($A \cap B$)
* `ExceptWith(other)`: Selisih ($A \setminus B$)
* `IsSubsetOf(other)`: Himpunan bagian ($A \subseteq B$)

### Contoh Penggunaan

```csharp
HashSet<string> peranAdmin = ["CREATE", "READ", "UPDATE", "DELETE"];
HashSet<string> peranEditor = ["READ", "UPDATE"];
HashSet<string> peranTamu   = ["READ"];

// 1. Duplikasi otomatis ditolak tanpa error
bool ditambahkan = peranAdmin.Add("CREATE"); // Menghasilkan false karena sudah ada

// 2. Pengecekan keanggotaan O(1)
Console.WriteLine($"Apakah peran Editor punya akses DELETE? {peranEditor.Contains("DELETE")}");

// 3. Operasi Selisih Himpunan (Apa hak yang dimiliki Admin tapi tidak dimiliki Editor?)
HashSet<string> hakEksklusifAdmin = new(peranAdmin);
hakEksklusifAdmin.ExceptWith(peranEditor);

Console.WriteLine("Hak akses eksklusif Admin:");
foreach (var hak in hakEksklusifAdmin)
{
    Console.WriteLine($"* {hak}");
}
```

Output:
```text
Apakah peran Editor punya akses DELETE? False
Hak akses eksklusif Admin:
* CREATE
* DELETE
```

---

## 6. 🟡 Queue<T> dan Stack<T>: Pengolahan Sekuensial FIFO dan LIFO

### Konsep

Ketika pemrosesan data membutuhkan urutan kedatangan yang ketat, C# menyediakan dua struktur data linear:

1. **`Queue<T>` (FIFO - First-In, First-Out):** Elemen yang pertama kali masuk akan menjadi elemen yang pertama kali keluar. Sangat cocok untuk antrean cetak dokumen (*print spooler*), antrean pengiriman email notifikasi, atau *event processing pipeline*.
2. **`Stack<T>` (LIFO - Last-In, First-Out):** Elemen yang terakhir kali masuk akan menjadi elemen yang pertama kali keluar. Sangat cocok untuk fitur *Undo/Redo* text editor, evaluasi tanda kurung ekspresi matematika, atau penelusuran graf mendalam (*DFS*).

```text
FIFO (Queue):
Input  ──> [ Item 3 ][ Item 2 ][ Item 1 ] ──> Output (Item 1 keluar duluan)

LIFO (Stack):
Input / Output  <──> [ Item 3 ] (Paling atas)
                     [ Item 2 ]
                     [ Item 1 ] (Paling bawah)
```

### Contoh Kode Queue dan Stack

```csharp
// --- DEMO QUEUE (FIFO) ---
Queue<string> antreanCustomer = new();
antreanCustomer.Enqueue("Pelanggan A");
antreanCustomer.Enqueue("Pelanggan B");
antreanCustomer.Enqueue("Pelanggan C");

Console.WriteLine($"Melayani: {antreanCustomer.Dequeue()}"); // Pelanggan A
Console.WriteLine($"Berikutnya di antrean: {antreanCustomer.Peek()}"); // Pelanggan B

// --- DEMO STACK (LIFO) ---
Stack<string> riwayatAksi = new();
riwayatAksi.Push("Tulis Kata 'Halo'");
riwayatAksi.Push("Ubah Warna Teks ke Biru");
riwayatAksi.Push("Perbesar Ukuran Font");

Console.WriteLine($"Aksi terakhir (Undo): {riwayatAksi.Pop()}"); // Perbesar Ukuran Font
Console.WriteLine($"Kondisi saat ini: {riwayatAksi.Peek()}");    // Ubah Warna Teks ke Biru
```

Output:
```text
Melayani: Pelanggan A
Berikutnya di antrean: Pelanggan B
Aksi terakhir (Undo): Perbesar Ukuran Font
Kondisi saat ini: Ubah Warna Teks ke Biru
```

---

## 7. 🟡 PriorityQueue<TElement, TPriority>: Antrean Berbasis Prioritas Min-Heap

### Konsep

Dalam sistem antrean dunia nyata, tidak semua permintaan memiliki urgensi yang sama:
* Pasien unit gawat darurat (UGD) harus didahulukan dibandingkan pasien rawat jalan biasa.
* Paket pengiriman pelanggan *VIP Express Same-Day* harus diproses lebih dahulu daripada paket reguler bebas ongkir, meskipun paket reguler tiba lebih awal.

Diperkenalkan sejak .NET 6 dan dioptimalkan di .NET 10 LTS, **`PriorityQueue<TElement, TPriority>`** mengimplementasikan algoritma **Min-Heap (Binary Heap)**:
* Secara *default*, nilai prioritas terkecil (angka paling rendah) diproses paling pertama (misal: prioritas `1` keluar sebelum prioritas `5`).
* Operasi penyisipan (`Enqueue`) dan penarikan teratas (`Dequeue`) memiliki performa **$O(\log N)$**.

### Contoh Penggunaan PriorityQueue

```csharp
// PriorityQueue menampung nama tugas dan bobot prioritas integer
PriorityQueue<string, int> antreanTriageRS = new();

// Enqueue(element, priority)
antreanTriageRS.Enqueue("Flu Ringan - Pasien X", 4);
antreanTriageRS.Enqueue("Serangan Jantung - Pasien A", 1); // Prioritas tertinggi
antreanTriageRS.Enqueue("Patah Tulang Kaki - Pasien B", 2);
antreanTriageRS.Enqueue("Demam Biasa - Pasien Y", 3);

Console.WriteLine("Urutan Penanganan Medis:");
while (antreanTriageRS.TryDequeue(out string? pasien, out int prioritas))
{
    Console.WriteLine($"[Level {prioritas}] Menangani: {pasien}");
}
```

Output:
```text
Urutan Penanganan Medis:
[Level 1] Menangani: Serangan Jantung - Pasien A
[Level 2] Menangani: Patah Tulang Kaki - Pasien B
[Level 3] Menangani: Demam Biasa - Pasien Y
[Level 4] Menangani: Flu Ringan - Pasien X
```

> [!NOTE]
> Jika Anda ingin prioritas angka terbesar keluar duluan (*Max-Heap*), Anda dapat menyertakan custom `IComparer<TPriority>` pada konstruktornya: `new PriorityQueue<string, int>(Comparer<int>.Create((x, y) => y.CompareTo(x)));`.

---

## 8. 🟡 Koleksi Terurut: SortedList, SortedDictionary, dan SortedSet

### Konsep

Koleksi seperti `Dictionary` atau `HashSet` biasa tidak menjamin urutan data sama sekali. Ketika Anda memerlukan koleksi yang datanya **selalu tersortir secara otomatis setiap kali ada elemen baru masuk**, gunakan keluarga koleksi terurut:

1. **`SortedList<TKey, TValue>`:**
   * Diimplementasikan secara internal sebagai **dua array paralel** yang disortir menggunakan Binary Search.
   * Konsumsi memori sangat hemat.
   * Pencarian $O(\log N)$, namun penambahan (*insert*) dan penghapusan bernilai $O(N)$ karena pergeseran array. Ideal jika data jarang bertambah setelah diisi di awal.
2. **`SortedDictionary<TKey, TValue>`:**
   * Diimplementasikan menggunakan struktur data **Red-Black Tree** (Self-Balancing Binary Search Tree).
   * Operasi penambahan, penghapusan, dan pencarian semuanya konsisten **$O(\log N)$**.
   * Mengonsumsi lebih banyak memori daripada `SortedList` karena alokasi node pointer pohon.
3. **`SortedSet<T>`:**
   * Himpunan unik yang selalu terurut secara otomatis menggunakan Red-Black Tree.
   * Mendukung operasi rentang seperti `GetViewBetween(min, max)`.

### Contoh SortedSet Rentang Nilai

```csharp
SortedSet<int> skorSiswa = [88, 55, 92, 74, 99, 61, 85];

// Nilai otomatis terurut dari terkecil ke terbesar
Console.WriteLine($"Nilai Terendah: {skorSiswa.Min}, Tertinggi: {skorSiswa.Max}");

// Mengambil sub-rentang nilai (misal: skor kategori B antara 70 sampai 89)
SortedSet<int> kategoriB = skorSiswa.GetViewBetween(70, 89);

Console.WriteLine("Skor dalam rentang 70 - 89:");
foreach (int skor in kategoriB)
{
    Console.Write($"{skor} ");
}
Console.WriteLine();
```

Output:
```text
Nilai Terendah: 55, Tertinggi: 99
Skor dalam rentang 70 - 89:
74 85 88 
```

---

## 9. 🟡 C# Modern: Collection Expressions dan Spread Operator

### Konsep

Salah satu fitur paling revolusioner di C# modern (dimulai di C# 12 dan disempurnakan di C# 14) adalah **Collection Expressions**. Sebelum C# 12, setiap tipe koleksi memiliki sintaksis inisialisasi yang berbeda-beda dan membingungkan:

```csharp
// CARA LAMA (Verbos & Berbeda-beda)
int[] a = new int[] { 1, 2, 3 };
List<int> b = new List<int>() { 1, 2, 3 };
Span<int> c = stackalloc int[] { 1, 2, 3 };
ImmutableArray<int> d = ImmutableArray.Create(1, 2, 3);
```

Dengan **Collection Expressions**, Anda dapat menggunakan kurung siku ringkas **`[...]`** untuk SEMUA tipe koleksi di atas! Compiler C# secara cerdas mendeteksi tipe target dan menghasilkan kode byte IL paling efisien di balik layar.

### Spread Operator (`..`)

Spread operator (`..`) memungkinkan Anda membongkar (*unpack*) elemen dari satu atau beberapa koleksi ke dalam koleksi baru secara elegan, mirip dengan operator spread di JavaScript atau Python.

### Contoh C# 14 Modern Collection Expressions

```csharp
// 1. Koleksi Kosong Seragam
int[] arrayKosong = [];
List<string> listKosong = [];

// 2. Inisialisasi Ringkas Seragam
int[] primaAwal = [2, 3, 5, 7];
List<int> primaLanjutan = [11, 13, 17];

// 3. Menggabungkan Koleksi Menggunakan Spread Operator (..)
int[] gabunganPrima = [..primaAwal, ..primaLanjutan, 19, 23];

Console.WriteLine($"Total bilangan prima terkumpul: {gabunganPrima.Length}");
Console.WriteLine(string.Join(", ", gabunganPrima));

// 4. Inisialisasi Langsung ke Span<T> Tanpa Alokasi Heap
ReadOnlySpan<byte> headerMagicBytes = [0x89, 0x50, 0x4E, 0x47];
Console.WriteLine($"Byte pertama header PNG: 0x{headerMagicBytes[0]:X2}");
```

Output:
```text
Total bilangan prima terkumpul: 9
2, 3, 5, 7, 11, 13, 17, 19, 23
Byte pertama header PNG: 0x89
```

> [!TIP]
> Di C# 14, compiler .NET 10 menganalisis ukuran spread expression statis dan mengoptimalkan pengalokasian memori secara langsung dalam satu blok tanpa resizing berulang.

---

## 10. 🔴 Immutability Sejati: System.Collections.Immutable

### Konsep

Banyak pengembang mengira antarmuka `IReadOnlyList<T>` menjamin bahwa data di dalamnya tidak akan pernah berubah (*immutable*). **Ini adalah kesalahpahaman berbahaya!**

`IReadOnlyList<T>` hanyalah sebuah *view* atau jendela baca. Jika objek aslinya adalah `List<T>`, pihak lain yang memiliki referensi ke `List` tersebut masih dapat menambah atau menghapus elemen kapan saja!

```csharp
List<string> internalList = ["A", "B"];
IReadOnlyList<string> readOnlyView = internalList;

internalList.Add("C"); // readOnlyView sekarang bernilai A, B, C! Mutasi tembus!
```

Untuk menjamin **Immutability Sejati** (sangat krusial untuk arsitektur multi-thread dan event-driven domain architecture), .NET menyediakan namespace `System.Collections.Immutable`:
* `ImmutableArray<T>`: Dibungkus di atas struct tunggal. Tanpa overhead alokasi pointer ekstra.
* `ImmutableList<T>`, `ImmutableDictionary<TKey, TValue>`, `ImmutableHashSet<T>`: Menggunakan struktur data pohon persisten (*persistent AVL tree*).

### Cara Kerja Persistent Data Structures

Saat Anda memanggil method pemutasi seperti `Add()` atau `Remove()` pada koleksi immutable, koleksi lama **tidak pernah diubah**. Koleksi akan mengembalikan instance baru dengan berbagi sebagian besar node cabang pohon yang tidak berubah (*node sharing*), sehingga operasi sangat cepat dan hemat memori.

```text
Original Immutable: [ Node 1 ] ──> [ Node 2 ]
                                         │
Dipanggil: Add(Node 3)                   ▼
Instance Baru:      [ Node 1 ] ──> [ Node 2 ] ──> [ Node 3 ]
(Node 1 dan Node 2 digunakan bersama tanpa menduplikasi seluruh memori)
```

### Contoh Penggunaan

```csharp
using System.Collections.Immutable;

// Membuat ImmutableArray
ImmutableArray<string> statusServer = ["RUNNING", "HEALTHY"];

// Melakukan 'Add' mengembalikan instance baru
ImmutableArray<string> statusBaru = statusServer.Add("ALERT_CPU");

Console.WriteLine($"Status Asli Count : {statusServer.Length}"); // Tetap 2!
Console.WriteLine($"Status Baru Count : {statusBaru.Length}");    // Menjadi 3!
Console.WriteLine($"Status Asli       : {string.Join(", ", statusServer)}");
Console.WriteLine($"Status Baru       : {string.Join(", ", statusBaru)}");
```

Output:
```text
Status Asli Count : 2
Status Baru Count : 3
Status Asli       : RUNNING, HEALTHY
Status Baru       : RUNNING, HEALTHY, ALERT_CPU
```

---

## 11. 🔴 Zero-Allocation Memory Slicing: Span<T> dan ReadOnlySpan<T>

### Konsep

Dalam arsitektur backend berkinerja tinggi (seperti Kestrel Web Server di .NET), operasi manipulasi string dan array adalah kontributor terbesar pemborosan memori Garbage Collection.

Misalkan Anda memiliki string berukuran 1 MB dan ingin mengambil potongan karakter 10 huruf di tengahnya:
* Cara konvensional: `text.Substring(500, 10)` mengalokasikan objek string baru di Managed Heap. Jika dilakukan jutaan kali per detik, Garbage Collector akan mengalami beban ekstrem (*GC Pauses*).
* Cara modern: **`ReadOnlySpan<char>`** tidak mengalokasikan objek baru sama sekali! `Span` hanyalah sebuah *view window* tipis (pointer alamat memori + panjang karakter) yang menunjuk langsung ke blok memori yang sudah ada.

```text
String di Heap (Panjang: 1000):
[ ... 499 chars ... ][ D ][ A ][ T ][ A ][ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ ... 490 chars ... ]
                     ▲                                       ▲
                     └─────── ReadOnlySpan (Pointer + Len) ──┘
                     (0 bytes alokasi memori heap baru!)
```

### Karakteristik Teknis

1. **`Span<T>` dan `ReadOnlySpan<T>` adalah `ref struct`:**
   * Hanya boleh hidup di **Stack** (tidak pernah dialokasikan di Heap).
   * Tidak dapat dijadikan *field* dari class biasa atau digunakan di method async di seberang titik `await` (untuk skenario async/heap, gunakan `Memory<T>` / `ReadOnlyMemory<T>`).
2. Menghubungkan berbagai sumber memori secara seragam: Managed Array, Stack Memory (`stackalloc`), maupun Unmanaged Native Pointer.

### Contoh Parsing String Tanpa Alokasi Heap

```csharp
string logLine = "2026-10-09|WARN|DiskSpaceLow|404";

// Membaca string sebagai ReadOnlySpan<char>
ReadOnlySpan<char> span = logLine.AsSpan();

// Melakukan slicing tanpa alokasi objek string baru
ReadOnlySpan<char> tanggal  = span.Slice(0, 10);
ReadOnlySpan<char> level    = span.Slice(11, 4);
ReadOnlySpan<char> kodePesan= span.Slice(29, 3);

// Parsing integer langsung dari Span tanpa alokasi ToString()
int kodeError = int.Parse(kodePesan);

Console.WriteLine($"Tanggal   : {tanggal.ToString()}");
Console.WriteLine($"Log Level : {level.ToString()}");
Console.WriteLine($"Kode Error: {kodeError}");
```

Output:
```text
Tanggal   : 2026-10-09
Log Level : WARN
Kode Error: 404
```

---

## 12. 🔴 Tabel Komparasi Big-O Complexity dan Karakteristik Memori

Gunakan tabel audit ini sebagai panduan utama dalam memilih struktur data yang tepat untuk kebutuhan aplikasi backend Anda:

| Tipe Struktur Data | Akses Indeks `[i]` | Pencarian Nilai | Penyisipan (`Insert`) | Penghapusan (`Delete`) | Kapan Digunakan? |
|---|:---:|:---:|:---:|:---:|---|
| **`T[]` (Array)** | $O(1)$ | $O(N)$ | N/A (Fixed) | N/A (Fixed) | Ukuran data sudah pasti dan tidak pernah berubah |
| **`List<T>`** | $O(1)$ | $O(N)$ | $O(1)$ amortized di akhir, $O(N)$ di tengah | $O(N)$ | Koleksi umum serbaguna berbasis urutan |
| **`Dictionary<K, V>`** | $O(1)$ via Key | $O(1)$ via Key | $O(1)$ | $O(1)$ | Pemetaan pasangan kunci-nilai dengan pencarian instan |
| **`HashSet<T>`** | N/A | $O(1)$ | $O(1)$ | $O(1)$ | Menolak duplikasi data dan pengujian keanggotaan cepat |
| **`Queue<T>`** | N/A | $O(N)$ | $O(1)$ via `Enqueue` | $O(1)$ via `Dequeue` | Pemrosesan antrean urut kedatangan (FIFO) |
| **`Stack<T>`** | N/A | $O(N)$ | $O(1)$ via `Push` | $O(1)$ via `Pop` | Operasi penumpukan data terakhir keluar (LIFO) |
| **`PriorityQueue<T, P>`** | N/A | $O(N)$ | $O(\log N)$ | $O(\log N)$ | Antrean tugas yang memiliki derajat urgensi berbeda |
| **`SortedDictionary<K, V>`**| N/A | $O(\log N)$ | $O(\log N)$ | $O(\log N)$ | Kunci harus selalu tersortir rapi di setiap saat |
| **`ReadOnlySpan<T>`** | $O(1)$ | $O(N)$ | N/A (Slice view) | N/A (Slice view) | Manipulasi string/buffer berkinerja tinggi bebas GC |

---

## 13. 🔴 Pengenalan Thread-Safe Collections (Concurrent Collections)

### Masalah pada Koleksi Standar

Koleksi umum seperti `List<T>`, `Dictionary<K, V>`, dan `HashSet<T>` **TIDAK THREAD-SAFE**. Jika dua thread melakukan modifikasi (`Add` atau `Remove`) secara bersamaan:
1. Data internal array atau hash bucket akan mengalami korupsi memori (*race condition*).
2. Terjadi exception tak terduga seperti `IndexOutOfRangeException` atau *infinite loop* internal pada re-hashing.

### Solusi Modern .NET

Di namespace `System.Collections.Concurrent`, .NET menyediakan koleksi yang dirancang khusus untuk lingkungan multithread berkinerja tinggi menggunakan algoritma bebas kunci (*lock-free*) atau penguncian granular halus (*fine-grained bucket lock*):

```csharp
using System.Collections.Concurrent;

// Pengganti Dictionary yang aman diakses ratusan thread sekaligus
ConcurrentDictionary<string, int> viewCounter = new();

// AddOrUpdate aman secara atomik
viewCounter.AddOrUpdate("artikel-csharp-14", 1, (key, oldValue) => oldValue + 1);

// Pengganti Queue untuk pola Producer-Consumer
ConcurrentQueue<string> jobQueue = new();
jobQueue.Enqueue("JOB-909");

if (jobQueue.TryDequeue(out string? job))
{
    Console.WriteLine($"Memproses job multithread: {job}");
}
```

Output:
```text
Memproses job multithread: JOB-909
```

*(Materi mendalam tentang konkurensi dan asinkronus akan dibahas tuntas pada [[csharp-async-threading|C# Asynchronous & Concurrency]]).*

---

## 14. 🛠️ Best Practice Arsitektur Collections

### 1. Pre-allocate Capacity untuk Koleksi Besar
Hindari siklus resize yang lambat. Jika Anda tahu ukuran perkiraan data, selalu berikan kapasitas awal:
```csharp
var daftarPengguna = new List<User>(expectedCount);
var kamusCache = new Dictionary<string, Session>(expectedCount);
```

### 2. Selalu Gunakan `TryGetValue` Alih-alih Pengecekan Dobel
Hindari anti-pattern berikut:
```csharp
// ❌ BURUK: Dua kali pencarian hash table terpisah (Boros CPU)
if (cache.ContainsKey(id))
{
    var item = cache[id];
}

// ✅ BAIK: Hanya satu kali pencarian hash table tunggal
if (cache.TryGetValue(id, out var item))
{
    // gunakan item
}
```

### 3. Kembalikan Antarmuka Read-Only dari Domain Model
Jangan mengekspos `List<T>` internal keluar dari class domain Anda. Bungkus dengan `AsReadOnly()` atau kembalikan `IReadOnlyList<T>`:
```csharp
public class Pesanan
{
    private readonly List<ItemPesanan> _items = [];

    // Konsumen luar hanya dapat membaca, tidak bisa sembarangan memanggil .Add() atau .Clear()
    public IReadOnlyList<ItemPesanan> Items => _items.AsReadOnly();

    public void TambahItem(ItemPesanan item)
    {
        // Validasi aturan bisnis di sini sebelum mutasi
        _items.Add(item);
    }
}
```

---

## 15. 🛠️ Kesalahan Umum Pemula

### 1. Memodifikasi Koleksi Saat Sedang Diiterasi dengan `foreach`

❌ **Salah:**
```csharp
List<int> angka = [1, 2, 3, 4, 5];
foreach (var n in angka)
{
    if (n % 2 == 0)
    {
        angka.Remove(n); // CRASH! InvalidOperationException: Collection was modified!
    }
}
```

✅ **Benar:**
Gunakan method `RemoveAll` yang memang dioptimalkan untuk penghapusan in-place:
```csharp
angka.RemoveAll(n => n % 2 == 0);
```

---

### 2. Mengabaikan Implementasi `GetHashCode()` pada Objek Custom Key

❌ **Salah:**
Membuat class kustom sebagai Key pada `Dictionary` tanpa meng-override `Equals` dan `GetHashCode`. Dua instance berbeda dengan properti identik akan dianggap dua kunci yang berbeda!

✅ **Benar:**
Gunakan `record` (yang otomatis mengimplementasikan perbandingan nilai dan hash code yang benar) atau implementasikan `IEquatable<T>` secara eksplisit.

---

### 3. Menggunakan `List<T>.Contains()` untuk Koleksi Berukuran Ribuan Elemen

❌ **Salah:**
Mencari ID di dalam `List<string>` berisi 50.000 data menggunakan loop atau `Contains()` ($O(N)$ - membandingkan satu per satu hingga akhir).

✅ **Benar:**
Gunakan `HashSet<string>` untuk pencarian cepat instan ($O(1)$).

---

## 16. 🛠️ Mini Project: Priority Dispatch dan Fast Slicing Fulfillment Engine

### Tujuan

Membangun mesin pemrosesan pesanan gudang e-commerce (*Fulfillment & Dispatch Engine*) modern yang:
1. Menerima pesanan dan mengurutkannya berdasarkan prioritas pengiriman (*Emergency VIP* > *Express* > *Reguler*) menggunakan `PriorityQueue`.
2. Mencegah duplikasi nomor invoice secara instan menggunakan `HashSet`.
3. Memetakan detail status pesanan menggunakan `Dictionary`.
4. Melakukan *fast zero-allocation parsing* terhadap kode barcode paket menggunakan `ReadOnlySpan<char>`.

### Implementasi Lengkap (C# 14 / .NET 10 LTS)

```csharp
using System;
using System.Collections.Generic;

namespace WarehouseFulfillmentEngine;

// Enum Prioritas Pengiriman (Nilai integer lebih kecil = prioritas lebih tinggi di Min-Heap)
public enum UrgensiPengiriman
{
    VipEmergency = 1,
    Express = 2,
    Reguler = 3
}

// Representasi Item Pesanan
public readonly record struct ItemPesanan(string Sku, int Jumlah, decimal HargaSatuan);

// Representasi Pesanan Gudang
public sealed class PesananGudang
{
    public required string NomorInvoice { get; init; }
    public required string NamaPelanggan { get; init; }
    public required UrgensiPengiriman Urgensi { get; init; }
    public List<ItemPesanan> DaftarItem { get; init; } = [];
}

// Mesin Pemrosesan Gudang Terpadu
public sealed class MesinFulfillment
{
    // 1. Min-Heap untuk urutan dispatch berdasarkan prioritas
    private readonly PriorityQueue<PesananGudang, int> _antreanDispatch = new();

    // 2. HashSet O(1) untuk menjamin keunikan invoice yang diproses
    private readonly HashSet<string> _daftarInvoiceTerekam = [];

    // 3. Dictionary O(1) untuk pelacakan status pesanan
    private readonly Dictionary<string, string> _statusTracking = [];

    public bool DaftarkanPesanan(PesananGudang pesanan)
    {
        // Cek duplikasi invoice
        if (!_daftarInvoiceTerekam.Add(pesanan.NomorInvoice))
        {
            Console.WriteLine($"[DITOLAK] Invoice {pesanan.NomorInvoice} sudah pernah didaftarkan!");
            return false;
        }

        // Masukkan ke antrean berdasarkan integer prioritasnya
        _antreanDispatch.Enqueue(pesanan, (int)pesanan.Urgensi);
        _statusTracking[pesanan.NomorInvoice] = "MENUNGGU_PENGIRIMAN";

        Console.WriteLine($"[TERDAFTAR] {pesanan.NomorInvoice} ({pesanan.NamaPelanggan}) - Prioritas: {pesanan.Urgensi}");
        return true;
    }

    public void ProsesSeluruhPengiriman()
    {
        Console.WriteLine("
--- MEMULAI DISPATCH GUDANG (BERDASARKAN PRIORITAS) ---");

        while (_antreanDispatch.TryDequeue(out PesananGudang? pesanan, out int prioritas))
        {
            _statusTracking[pesanan.NomorInvoice] = "SELESAI_DIKIRIM";
            Console.WriteLine($"-> Mengirim Invoice: {pesanan.NomorInvoice} | Pelanggan: {pesanan.NamaPelanggan} | Level: {(UrgensiPengiriman)prioritas}");
        }
    }

    // High-performance zero-allocation parser untuk kode barcode format: "GUDANG99-RAK05-SKU12345"
    public static void ParseBarcodePaket(string rawBarcode)
    {
        ReadOnlySpan<char> span = rawBarcode.AsSpan();

        int pemisahPertama = span.IndexOf('-');
        int pemisahKedua = span.LastIndexOf('-');

        if (pemisahPertama == -1 || pemisahKedua == -1 || pemisahPertama == pemisahKedua)
        {
            Console.WriteLine("Format barcode tidak valid!");
            return;
        }

        ReadOnlySpan<char> kodeGudang = span.Slice(0, pemisahPertama);
        ReadOnlySpan<char> nomorRak   = span.Slice(pemisahPertama + 1, pemisahKedua - pemisahPertama - 1);
        ReadOnlySpan<char> sku        = span.Slice(pemisahKedua + 1);

        Console.WriteLine($"[PARSER SPAN BEBAS GC] Gudang: {kodeGudang} | Rak: {nomorRak} | SKU: {sku}");
    }
}

public static class Program
{
    public static void Main()
    {
        MesinFulfillment engine = new();

        // Demonstrasi Zero-Allocation Span Parsing
        Console.WriteLine("=== 1. TEST FAST BARCODE SLICING ===");
        MesinFulfillment.ParseBarcodePaket("JKT01-RAK12-ELEC8829");

        // Demonstrasi Koleksi & Priority Queue
        Console.WriteLine("
=== 2. REGISTRASI PESANAN DENGAN PRIORITAS ===");
        
        PesananGudang order1 = new()
        {
            NomorInvoice = "INV-2026-001",
            NamaPelanggan = "Budi Santoso",
            Urgensi = UrgensiPengiriman.Reguler
        };

        PesananGudang order2 = new()
        {
            NomorInvoice = "INV-2026-002",
            NamaPelanggan = "Rumah Sakit Sehat (Obat Darurat)",
            Urgensi = UrgensiPengiriman.VipEmergency // Harus keluar pertama!
        };

        PesananGudang order3 = new()
        {
            NomorInvoice = "INV-2026-003",
            NamaPelanggan = "Citra Lestari",
            Urgensi = UrgensiPengiriman.Express
        };

        // Registrasi pesanan
        engine.DaftarkanPesanan(order1);
        engine.DaftarkanPesanan(order2);
        engine.DaftarkanPesanan(order3);

        // Uji coba duplikasi invoice
        engine.DaftarkanPesanan(new PesananGudang 
        { 
            NomorInvoice = "INV-2026-001", 
            NamaPelanggan = "Duplikat Budi", 
            Urgensi = UrgensiPengiriman.VipEmergency 
        });

        // Jalankan pemrosesan urut
        engine.ProsesSeluruhPengiriman();
    }
}
```

### Hasil Eksekusi

```text
=== 1. TEST FAST BARCODE SLICING ===
[PARSER SPAN BEBAS GC] Gudang: JKT01 | Rak: RAK12 | SKU: ELEC8829

=== 2. REGISTRASI PESANAN DENGAN PRIORITAS ===
[TERDAFTAR] INV-2026-001 (Budi Santoso) - Prioritas: Reguler
[TERDAFTAR] INV-2026-002 (Rumah Sakit Sehat (Obat Darurat)) - Prioritas: VipEmergency
[TERDAFTAR] INV-2026-003 (Citra Lestari) - Prioritas: Express
[DITOLAK] Invoice INV-2026-001 sudah pernah didaftarkan!

--- MEMULAI DISPATCH GUDANG (BERDASARKAN PRIORITAS) ---
-> Mengirim Invoice: INV-2026-002 | Pelanggan: Rumah Sakit Sehat (Obat Darurat) | Level: VipEmergency
-> Mengirim Invoice: INV-2026-003 | Pelanggan: Citra Lestari | Level: Express
-> Mengirim Invoice: INV-2026-001 | Pelanggan: Budi Santoso | Level: Reguler
```

---

## 17. 📚 Peta Ingatan

```text
.NET Collection Framework
├── Linear & Index-Based
│   ├── Array (T[])                  -> Fixed size, ultra fast O(1) index
│   └── List<T>                      -> Dynamic array, capacity doubling
├── Hash-Based (O(1) Lookup)
│   ├── Dictionary<TKey, TValue>     -> Key-value mapping
│   └── HashSet<T>                   -> Unordered unique set & algebra
├── Sequential & Heap-Based
│   ├── Queue<T>                     -> FIFO (Enqueue / Dequeue)
│   ├── Stack<T>                     -> LIFO (Push / Pop)
│   └── PriorityQueue<T, Priority>   -> Min-heap urgency order
├── Tree-Based (Auto-Sorted)
│   ├── SortedDictionary<K, V>       -> Red-Black tree O(log N)
│   └── SortedSet<T>                 -> Unique sorted elements & range view
├── Modern Syntax (C# 12 - 14)
│   ├── Collection Expressions       -> [...] seragam untuk semua koleksi
│   └── Spread Operator              -> [..list1, ..list2]
└── High Performance & Memory
    ├── Immutable Collections        -> Thread-safe persistent structures
    └── Span<T> / ReadOnlySpan<T>    -> Zero-allocation stack-only memory slice
```

---

## 18. 📚 Cheat Code 10 Detik

```text
Collection Expressions:
[1, 2, 3]                  -> inisialisasi seragam array, list, atau span
[..daftarA, ..daftarB]     -> spread operator penggabungan koleksi

List<T>:
list.Add(item)             -> menambah di akhir O(1) amortized
list.Capacity = N          -> pre-sizing alokasi buffer internal

Dictionary<K, V>:
dict.TryGetValue(k, out v) -> pembacaan aman tanpa melempar exception
dict.TryAdd(k, v)          -> penambahan aman jika kunci belum ada

HashSet<T>:
set.Add(item)              -> bernilai false jika elemen sudah ada
set.Contains(item)         -> pengecekan keanggotaan instan O(1)

PriorityQueue<T, P>:
pq.Enqueue(item, priority) -> memasukkan dengan bobot prioritas
pq.Dequeue()               -> mengambil elemen prioritas terkecil (Min-Heap)

Span<T>:
str.AsSpan().Slice(0, 5)   -> pemotongan data tanpa alokasi memori heap baru
```

---

## 19. 🧭 Urutan Belajar Berikutnya

Setelah menguasai struktur data dan koleksi, langkah wajib berikutnya adalah mempelajari cara memanipulasi, memfilter, mentransformasi, dan memproyeksikan data tersebut secara deklaratif dan elegan:

1. **Lanjutkan ke [[csharp-linq|C# LINQ]] (Modul 5):**
   * Pahami fondasi *Delegates*, *Action*, *Func*, dan ekspresi *Lambda*.
   * Pelajari keajaiban *Deferred Execution* (*Lazy Evaluation*) menggunakan kata kunci `yield return`.
   * Kuasai operasi data esensial: `Where`, `Select`, `SelectMany`, `GroupBy`, `Join`, dan `Aggregate`.
   * Eksplorasi fitur mutakhir C# 14: **Extension Members block (`extension Name for Type`)**.

---

## 20. 🔗 Referensi Resmi

* [Collections in C# and .NET - Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/standard/collections/)
* [Collection Expressions - C# Language Reference](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/collection-expressions)
* [PriorityQueue<TElement, TPriority> Class - Microsoft .NET Documentation](https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.priorityqueue-2)
* [Memory and Span Guidelines - .NET Runtime Architecture](https://learn.microsoft.com/en-us/dotnet/standard/memory-and-spans/)
