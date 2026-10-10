---
title: "C# Asynchronous & Concurrency"
description: "Panduan komprehensif asinkronus dan multithreading di C# 14 dan .NET 10 LTS: Task-based Asynchronous Pattern (TAP), async/await, Task vs ValueTask, CancellationToken, IAsyncEnumerable, Threading Synchronization, dan System.Threading.Lock modern."
order: 6
tags:
  - csharp
  - dotnet
  - programming
  - async
  - multithreading
  - concurrency
---

# C# Asynchronous & Concurrency

> Target: Pemula hingga Menengah  
> Versi: C# 14 / .NET 10 LTS  
> Prasyarat: [[csharp-dasar|C# Dasar]], [[csharp-oop|C# OOP]], [[csharp-generic|C# Generic]], [[csharp-collection|C# Collection Framework]], dan [[csharp-linq|C# LINQ]]

---

## Gambaran Umum

Dalam arsitektur backend modern berskala tinggi (*high-throughput microservices*), server web tidak hanya melayani 1 pengguna, melainkan harus menangani ribuan permintaan HTTP secara simultan setiap detiknya. Jika setiap permintaan memblokir (*blocking*) thread sistem operasi saat menunggu respon kueri database atau panggilan API eksternal, server akan cepat kehabisan thread (*thread pool starvation*) dan mengalami kegagalan fatal.

Bahasa C# dan .NET 10 LTS memiliki salah satu model pemrograman asinkronus terbaik di dunia industri: **Task-based Asynchronous Pattern (TAP)** dengan kata kunci **`async`** dan **`await`**. 

Modul penutup pilar C# ini mengupas tuntas cara kerja asinkronus non-blocking, perbedaan krusial `Task` vs `ValueTask`, standar pembatalan operasi via `CancellationToken`, stream data asinkronus `IAsyncEnumerable<T>`, hingga sinkronisasi multithreading modern menggunakan fitur C# 13/14: **`System.Threading.Lock`** dan **`SemaphoreSlim`**.

---

## Cara Belajar

1. Pahami mental model perbedaan mendasar antara I/O-Bound (menunggu jaringan/disk) dan CPU-Bound (kalkulasi komputasi).
2. Kuasai mekanisme kerja non-blocking dari kata kunci `async` dan `await`.
3. Pahami bahaya maut `async void` dan mengapa Anda harus selalu mengembalikan `Task` atau `Task<T>`.
4. Pelajari optimasi alokasi heap menggunakan `ValueTask<T>`.
5. Terapkan standar industri pembatalan operasi menggunakan `CancellationToken`.
6. Kuasai teknik streaming data hemat memori menggunakan `IAsyncEnumerable<T>` dan `await foreach`.
7. Pahami cara melindungi data bersama (*shared mutable state*) menggunakan primitif sinkronisasi modern: `System.Threading.Lock`, `SemaphoreSlim`, dan operasi atomik `Interlocked`.
8. Terapkan seluruh materi ke dalam Mini Project mesin penarik kurs valuta asing berkecepatan tinggi dengan batas konkurensi terkontrol.

---

## Daftar Isi

### 🟢 Fundamental

1. [Mental Model: Synchronous vs Asynchronous vs Parallelism](#1--mental-model-synchronous-vs-asynchronous-vs-parallelism)
2. [I/O-Bound vs CPU-Bound: Menunggu vs Menghitung](#2--io-bound-vs-cpu-bound-menunggu-vs-menghitung)
3. [Task-based Asynchronous Pattern (TAP): async dan await](#3--task-based-asynchronous-pattern-tap-async-dan-await)
4. [Tipe Kembalian Async: Task, Task<T>, dan Bahaya Fatal async void](#4--tipe-kembalian-async-task-taskt-dan-bahaya-fatal-async-void)

### 🟡 Intermediate

5. [Optimasi Alokasi Memori: Task vs ValueTask](#5--optimasi-alokasi-memori-task-vs-valuetask)
6. [Standar Pembatalan Operasi: CancellationToken dan Timeout](#6--standar-pembatalan-operasi-cancellationtoken-dan-timeout)
7. [Asynchronous Streaming: IAsyncEnumerable dan await foreach](#7--asynchronous-streaming-iasyncenumerable-dan-await-foreach)
8. [Koordinasi Task Jamak: Task.WhenAll dan Task.WhenAny](#8--koordinasi-task-jamak-taskwhenall-dan-taskwhenany)

### 🔴 Advanced

9. [Cara Kerja Internal: Compiler State Machine dan Non-Blocking Thread](#9--cara-kerja-internal-compiler-state-machine-dan-non-blocking-thread)
10. [Sinkronisasi Modern: System.Threading.Lock (C# 13/14)](#10--sinkronisasi-modern-systemthreadinglock-c-1314)
11. [Sinkronisasi Asinkronus: SemaphoreSlim vs lock](#11--sinkronisasi-asinkronus-semaphoreslim-vs-lock)
12. [Batching Terkendali: Parallel.ForEachAsync](#12--batching-terkendali-parallelforeachasync)

### 🛠️ Praktik

13. [Best Practice & Anti-Pattern Concurrency](#13-️-best-practice--anti-pattern-concurrency)
14. [Kesalahan Umum Pemula](#14-️-kesalahan-umum-pemula)
15. [Mini Project: High-Throughput Currency Rate Ingestion Engine](#15-️-mini-project-high-throughput-currency-rate-ingestion-engine)

### 📚 Referensi

16. [Peta Ingatan](#16--peta-ingatan)
17. [Cheat Code 10 Detik](#17--cheat-code-10-detik)
18. [Urutan Belajar Berikutnya](#18--urutan-belajar-berikutnya)
19. [Referensi Resmi](#19--referensi-resmi)

---

## 1. 🟢 Mental Model: Synchronous vs Asynchronous vs Parallelism

### Konsep

Banyak pengembang pemula menyamakan istilah *Asynchronous*, *Multithreading*, dan *Parallelism*. Ketiganya memiliki makna arsitektur yang sangat berbeda:

1. **Synchronous (Sinkron / Blocking):** Setiap baris kode dieksekusi secara berurutan. Jika baris ke-2 membutuhkan waktu 5 detik untuk menunggu respon database, baris ke-3 tidak akan dieksekusi dan thread sistem akan **membeku (terkunci)** menunggu respon tersebut.
2. **Asynchronous (Asinkron / Non-Blocking):** Jika suatu baris kode memulai operasi berdurasi lama (misal I/O jaringan), thread yang sedang berjalan **dilepaskan kembali ke Thread Pool** untuk melayani pengguna lain! Ketika respon jaringan tiba beberapa detik kemudian, sistem mengambil thread sembarang dari pool untuk melanjutkan baris kode berikutnya.
3. **Parallelism (Paralelisme):** Membagi komputasi berat menjadi beberapa bagian yang dieksekusi secara bersamaan pada **beberapa core CPU fisik yang berbeda**.

### Mental Model Restoran

```text
SINKRON (Blocking):
Pelayan mencatat pesanan ──> Pelayan berdiri diam di dapur menunggu koki memasak ──> Pelayan mengantar makanan
(Pelayan tidak bisa melayani pelanggan lain selama menunggu masakan matang!)

ASINKRON (Non-Blocking):
Pelayan mencatat pesanan ──> Menyerahkan tiket ke dapur ──> Pelayan melayani meja tamu lain
                                                                  │
                                            Koki memencet bel (Masakan matang)
                                                                  │
                                            Pelayan mengantar makanan ke meja pertama
```

Dengan pola asinkron, 1 pelayan (thread) dapat menangani puluhan meja secara simultan tanpa ada waktu terbuang untuk menunggu pasif!

---

## 2. 🟢 I/O-Bound vs CPU-Bound: Menunggu vs Menghitung

### Konsep

Kapan Anda harus menggunakan `async`/`await`? Jawabannya bergantung pada jenis beban kerja (*workload*):

```text
                             Jenis Beban Kerja
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
             I/O-BOUND                               CPU-BOUND
     (Menunggu di Luar CPU)                   (Kerja Keras di Dalam CPU)
                 │                                       │
  Contoh:                                 Contoh:
  - Kueri Database PostgreSQL             - Enkripsi Password / Hashing
  - HTTP Request ke API Eksternal         - Kompresi Video / Gambar
  - Membaca File dari Disk                - Kalkulasi Model Machine Learning
                 │                                       │
           SOLUSI C#:                              SOLUSI C#:
  async / await murni                     Task.Run(() => KalkulasiBerat())
  (TIDAK membutuhkan thread ekstra)       (Menjalankan di worker thread lain)
```

> [!IMPORTANT]
> Jangan membungkus panggilan operasi I/O dengan `Task.Run`! Menjalankan operasi I/O asinkron di dalam `Task.Run` adalah anti-pattern yang membuang-buang thread (*thread waste*).

---

## 3. 🟢 Task-based Asynchronous Pattern (TAP): async dan await

### Konsep

Di C#, operasi asinkron ditulis menggunakan pola **TAP** dengan dua kata kunci berpasangan:
* **`async`:** Ditambahkan pada deklarasi method untuk memberi tahu compiler bahwa method ini berisi operasi asinkron dan akan diubah menjadi *State Machine*.
* **`await`:** Diletakkan di depan ekspresi yang mengembalikan `Task` atau `ValueTask`. Kata kunci ini menunda kelanjutan method sampai operasi selesai, **tanpa memblokir thread pemanggil**.

### Contoh Kode Dasar

```csharp
using System;
using System.Net.Http;
using System.Threading.Tasks;

public static class DemoAsinkron
{
    private static readonly HttpClient _httpClient = new();

    public static async Task Main()
    {
        Console.WriteLine("[1] Memulai panggilan web...");

        // Memanggil method asinkron non-blocking
        string konten = await AmbilDataWebsiteAsync("https://httpbin.org/get");

        Console.WriteLine($"[3] Selesai! Ukuran data diterima: {konten.Length} karakter.");
    }

    public static async Task<string> AmbilDataWebsiteAsync(string url)
    {
        Console.WriteLine("[2] Mengirim HTTP request (Thread dilepas ke ThreadPool)...");
        
        // Thread dilepas di sini saat menunggu paket jaringan tiba
        HttpResponseMessage respon = await _httpClient.GetAsync(url);
        
        // Membaca konten respon sebagai string secara asinkron
        string hasil = await respon.Content.ReadAsStringAsync();
        
        return hasil;
    }
}
```

Output:
```text
[1] Memulai panggilan web...
[2] Mengirim HTTP request (Thread dilepas ke ThreadPool)...
[3] Selesai! Ukuran data diterima: 308 karakter.
```

---

## 4. 🟢 Tipe Kembalian Async: Task, Task<T>, dan Bahaya Fatal async void

### Konsep

Method yang diberi modifier `async` memiliki tiga opsi tipe nilai kembalian:

1. **`Task<TResult>`:** Digunakan ketika operasi asinkron mengembalikan nilai data bertipe `TResult`.
2. **`Task`:** Digunakan ketika operasi asinkron tidak mengembalikan nilai data apapun (ekuivalen dengan `void` pada method sinkron).
3. **`void` (`async void`):** **SANGAT BERBAHAYA!**

### Mengapa `async void` Dilarang Keras?

Kecuali untuk *Event Handler* pada aplikasi GUI (WPF/WinUI), **JANGAN PERNAH** menulis `async void`:
1. **Tidak Dapat di-`await`:** Pemanggil tidak memiliki cara untuk mengetahui kapan method selesai dijalankan.
2. **Uncaught Exception Crash:** Jika terjadi exception di dalam method `async void`, exception tersebut **tidak dapat ditangkap oleh blok `try-catch` pemanggil**. Exception akan langsung melompat ke thread pool unhandled exception dan membunuh (*crash*) seluruh aplikasi backend server Anda!

```csharp
// ❌ SANGAT SALAH & BERBAHAYA
public static async void SimpanDataAsync()
{
    throw new InvalidOperationException("Koneksi putus!"); // CRASH SELURUH APLIKASI!
}

// ✅ BENAR & AMAN
public static async Task SimpanDataAmanAsync()
{
    await Task.Delay(100);
    // Exception di sini dapat ditangkap oleh try-catch pemanggil secara normal
}
```

---

## 5. 🟡 Optimasi Alokasi Memori: Task vs ValueTask

### Konsep

Tipe `Task` dan `Task<T>` adalah **Reference Type (`class`)**. Artinya, setiap kali sebuah method asinkron dipanggil dan mengembalikan `Task`, sebuah objek baru akan dialokasikan di Managed Heap.

Dalam aplikasi microservices dengan beban 100.000 request per detik, alokasi jutaan objek `Task` kecil di heap dapat membebani Garbage Collector.

Untuk mengatasi ini, .NET menyediakan **`ValueTask`** dan **`ValueTask<T>`** yang bertipe **Value Type (`struct`)**.

### Kapan Menggunakan ValueTask?

Gunakan `ValueTask<T>` ketika method asinkron Anda sering kali dapat diselesaikan **secara sinkron seketika** (misal: data sudah tersedia di dalam cache memori lokal), dan hanya sesekali melakukan operasi I/O asinkron yang sebenarnya.

```text
                     Method AmbilPenggunaAsync(id)
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
            Data Ada di Cache?            Data Tidak Ada di Cache?
           (Synchronous Path)                (Asynchronous Path)
                    │                             │
         Kembalikan nilai instan         Kueri Database via Task
                    │                             │
    ValueTask<User>: 0 ALOKASI HEAP!     Alokasi Task normal
```

### Contoh Penggunaan ValueTask

```csharp
using System.Collections.Generic;
using System.Threading.Tasks;

public class LayananPengguna
{
    private readonly Dictionary<int, string> _cacheLokal = new() { [1] = "Admin Budi" };

    public ValueTask<string> AmbilNamaPenggunaAsync(int id)
    {
        // Jalur 1: Data ada di cache lokal -> Selesai sinkron tanpa alokasi memori heap baru!
        if (_cacheLokal.TryGetValue(id, out string? nama))
        {
            return new ValueTask<string>(nama);
        }

        // Jalur 2: Data tidak ada -> Lakukan panggilan database asinkron sesungguhnya
        return new ValueTask<string>(AmbilDariDatabaseAsync(id));
    }

    private async Task<string> AmbilDariDatabaseAsync(int id)
    {
        await Task.Delay(500); // Simulasi kueri database
        return $"User-{id}";
    }
}
```

> [!WARNING]
> **Aturan Mutlak ValueTask:** Jangan pernah meng-`await` sebuah instance `ValueTask` lebih dari satu kali (`await vt; await vt;`). Jangan memanggil `.Result` sebelum operasi selesai. Jika Anda perlu memanipulasi task berkali-kali, konversikan ke `Task` biasa terlebih dahulu via `.AsTask()`.

---

## 6. 🟡 Standar Pembatalan Operasi: CancellationToken dan Timeout

### Konsep

Dalam arsitektur enterprise, setiap operasi asinkron yang berpotensi memakan waktu lama (kueri database, request HTTP, baca file) **WAJIB** mendukung pembatalan melalui **`CancellationToken`**.

Contoh kasus nyata: Pengguna web menutup tab browser sebelum halaman selesai dimuat. Jika server tidak membatalkan kueri database yang sedang berjalan, server akan terus membuang-buang sumber daya komputasi untuk memproses data yang tidak lagi dibutuhkan oleh siapa pun!

### Pola CancellationTokenSource (CTS)

```csharp
using System;
using System.Threading;
using System.Threading.Tasks;

public static class DemoPembatalan
{
    public static async Task Main()
    {
        // Membuat sumber token pembatalan dengan batas waktu timeout otomatis 2 detik
        using CancellationTokenSource cts = new();
        cts.CancelAfter(TimeSpan.FromSeconds(2));

        try
        {
            Console.WriteLine("Memulai sinkronisasi data besar (Batas timeout: 2 detik)...");
            await UnduhBatchDataAsync(cts.Token);
            Console.WriteLine("Proses berhasil diselesaikan.");
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine("[BATAL] Operasi dihentikan karena melebihi batas waktu (Timeout)!");
        }
    }

    public static async Task UnduhBatchDataAsync(CancellationToken cancellationToken)
    {
        for (int i = 1; i <= 5; i++)
        {
            // Memeriksa apakah permintaan pembatalan telah dipicu
            cancellationToken.ThrowIfCancellationRequested();

            Console.WriteLine($"Memproses bagian #{i}...");
            await Task.Delay(1000, cancellationToken); // Meneruskan token ke API asinkron bawaan
        }
    }
}
```

Output:
```text
Memulai sinkronisasi data besar (Batas timeout: 2 detik)...
Memproses bagian #1...
Memproses bagian #2...
[BATAL] Operasi dihentikan karena melebihi batas waktu (Timeout)!
```

---

## 7. 🟡 Asynchronous Streaming: IAsyncEnumerable dan await foreach

### Konsep

Sebelum .NET Core 3.0 / C# 8, jika Anda ingin mengembalikan sekumpulan data secara asinkron, Anda harus menunggu **seluruh data selesai dikumpulkan** ke dalam `List<T>` sebelum mengembalikannya:

```csharp
Task<List<Transaksi>> // Seluruh 1.000.000 transaksi harus ditarik ke RAM dulu!
```

**`IAsyncEnumerable<T>`** menggabungkan kekuatan `yield return` dengan `async`/`await`. Anda dapat **mengalirkan (*stream*) data satu demi satu secara bertahap begitu data tersebut tersedia**, dan konsumen dapat memprosesnya seketika menggunakan perulangan **`await foreach`** tanpa menunggu seluruh batch selesai ditarik!

### Contoh Asynchronous Stream

```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public static class DemoAsyncStream
{
    public static async IAsyncEnumerable<int> GenerateDataSensorAsync()
    {
        for (int i = 1; i <= 3; i++)
        {
            await Task.Delay(500); // Simulasi jeda pembacaan sensor fisik
            yield return i * 10;   // Mengalirkan data seketika saat didapat!
        }
    }

    public static async Task Main()
    {
        Console.WriteLine("Mulai mendengarkan stream sensor:");
        
        // Konsumen mengonsumsi stream secara non-blocking
        await foreach (int suhu in GenerateDataSensorAsync())
        {
            Console.WriteLine($"[STREAM] Suhu terbaca: {suhu}°C pada {DateTime.Now:T}");
        }
        
        Console.WriteLine("Stream selesai.");
    }
}
```

Output:
```text
Mulai mendengarkan stream sensor:
[STREAM] Suhu terbaca: 10°C pada 23:25:01
[STREAM] Suhu terbaca: 20°C pada 23:25:02
[STREAM] Suhu terbaca: 30°C pada 23:25:02
Stream selesai.
```

---

## 8. 🟡 Koordinasi Task Jamak: Task.WhenAll dan Task.WhenAny

### Konsep

Ketika Anda perlu memanggil beberapa API independen secara bersamaan:

1. **`Task.WhenAll(tasks)`:** Menjalankan beberapa task secara konkuren dan menunggu **seluruh task selesai**. Sangat ideal untuk *fan-out/fan-in aggregation* (misal memanggil 3 microservice harga, stok, dan profil pengguna secara paralel).
2. **`Task.WhenAny(tasks)`:** Berjalan sampai **satu task pertama selesai**. Sangat ideal untuk skenario balapan (*racing pattern*), seperti menghubungi beberapa server cermin (*mirror server*) dan mengambil data dari server yang merespon paling cepat.

### Contoh Task.WhenAll

```csharp
using System;
using System.Threading.Tasks;

public static class DemoKoordinasi
{
    public static async Task Main()
    {
        Console.WriteLine("Memulai panggilan microservices secara paralel...");
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();

        Task<string> taskProfil = AmbilProfilAsync();
        Task<string> taskStok   = AmbilStokAsync();
        Task<string> taskDiskon = AmbilDiskonAsync();

        // Menunggu ketiga task selesai secara simultan
        string[] hasil = await Task.WhenAll(taskProfil, taskStok, taskDiskon);

        stopwatch.Stop();
        Console.WriteLine($"\nHasil Diterima dalam {stopwatch.ElapsedMilliseconds} ms:");
        foreach (var data in hasil)
        {
            Console.WriteLine($"- {data}");
        }
    }

    private static async Task<string> AmbilProfilAsync() { await Task.Delay(400); return "Profil: User VIP"; }
    private static async Task<string> AmbilStokAsync()   { await Task.Delay(300); return "Stok: 45 Unit"; }
    private static async Task<string> AmbilDiskonAsync() { await Task.Delay(500); return "Diskon: 15%"; }
}
```

Output:
```text
Memulai panggilan microservices secara paralel...

Hasil Diterima dalam 512 ms:
- Profil: User VIP
- Stok: 45 Unit
- Diskon: 15%
```

Perhatikan bahwa total waktu eksekusi adalah **~500 ms** (waktu task terlama), bukan penjumlahan berurutan $400 + 300 + 500 = 1200	ext{ ms}$!

---

## 9. 🔴 Cara Kerja Internal: Compiler State Machine dan Non-Blocking Thread

### Konsep

Bagaimana C# dapat melepaskan thread saat menemukan `await` dan kembali melanjutkan eksekusi setelah operasi I/O selesai?

Saat mengompilasi method `async`, compiler C# membedah kode Anda menjadi sebuah struct internal yang mengimplementasikan antarmuka **`IAsyncStateMachine`**:

```text
                 EKSEKUSI METHOD ASYNC
                           │
                 Kode sebelum await
                           │
                           ▼
                     Titik await
                           │
       ┌───────────────────┴───────────────────┐
       ▼                                       ▼
Operasi Sudah Selesai?               Operasi Masih Berjalan?
       │                                       │
Lanjut eksekusi sinkron              1. Tangkap Eksekusi State Machine
                                     2. Daftarkan Callback (OnCompleted)
                                     3. LEPASKAN THREAD KEMBALI KE POOL!
                                               │
                                     [Operasi I/O Selesai di Kernel OS]
                                               │
                                     4. Ambil sembarang worker thread
                                     5. Lompat ke State berikutnya
                                     6. Lanjutkan kode setelah await!
```

Runtime .NET menggunakan antarmuka I/O Completion Ports (IOCP) pada tingkat kernel OS untuk mendengarkan sinyal dari perangkat keras jaringan atau disk tanpa perlu mendedikasikan satu thread CPU pun untuk menunggu pasif!

---

## 10. 🔴 Sinkronisasi Modern: System.Threading.Lock (C# 13/14)

### Evolusi Lock di C# Modern

Ketika beberapa thread memodifikasi variabel bersama (*shared mutable state*) secara bersamaan, terjadi *race condition* yang merusak integritas data.

Selama lebih dari 20 tahun, pengembang C# menggunakan sintaksis penguncian konvensional dengan mengunci objek `new object()`:

```csharp
// CARA LAMA (Sebelum C# 13)
private readonly object _syncRoot = new();

lock (_syncRoot)
{
    _saldo += nominal;
}
```

Mulai C# 13 dan disempurnakan di C# 14 / .NET 10 LTS, .NET memperkenalkan tipe dedicated baru: **`System.Threading.Lock`**.

### Keunggulan `System.Threading.Lock`

1. **Performa Lebih Tinggi:** Menggunakan instruksi prosesor yang lebih teroptimasi dibandingkan monitor lock objek biasa.
2. **Sintaksis Scope Modern (`EnterScope`):** Terintegrasi langsung dengan pola `using` berbasis `ref struct` yang menjamin pelepasan kunci tanpa alokasi memori heap tambahan.

```csharp
using System.Threading;

public class RekeningBankModern
{
    // C# 13 / C# 14 (.NET 10 LTS): Gunakan tipe System.Threading.Lock
    private readonly Lock _kunciBank = new();
    private decimal _saldo;

    public void SetorUang(decimal nominal)
    {
        // Cara 1: Menggunakan keyword lock bawaan yang sekarang otomatis mendeteksi Lock type
        lock (_kunciBank)
        {
            _saldo += nominal;
        }

        // Cara 2: Menggunakan scope pattern eksplisit
        using (_kunciBank.EnterScope())
        {
            // Area kritis terlindungi di sini
        }
    }
}
```

---

## 11. 🔴 Sinkronisasi Asinkronus: SemaphoreSlim vs lock

### Jebakan Maut: Mengapa `lock` Tidak Boleh Digunakan dengan `await`?

Compiler C# akan langsung **menolak (error kompilasi)** jika Anda mencoba meletakkan `await` di dalam blok `lock`:

```csharp
// ❌ ERROR KOMPILASI C#: Cannot await in the body of a lock statement
lock (_syncRoot)
{
    await SimpanDatabaseAsync(); 
}
```

**Alasan Teknis:** Kata kunci `lock` mengunci kepemilikan thread berdasarkan Thread ID tertentu (*thread affinity*). Ketika titik `await` melepaskan thread ke pool, kelanjutan kode setelah `await` kemungkinan besar akan dijalankan oleh **Thread ID yang berbeda**. Thread baru tersebut tidak akan memiliki izin untuk melepaskan kunci yang dipegang oleh thread sebelumnya, menyebabkan *deadlock* permanen!

### Solusi: `SemaphoreSlim`

Untuk sinkronisasi pada alur kerja asinkronus, gunakan **`SemaphoreSlim`**. `SemaphoreSlim` mendukung method **`WaitAsync()`** yang sepenuhnya non-blocking:

```csharp
using System.Threading;
using System.Threading.Tasks;

public class AntreanKritisAsinkron
{
    // SemaphoreSlim(1, 1) bertindak sebagai Async Mutex (hanya 1 yang boleh masuk)
    private readonly SemaphoreSlim _semaphore = new(1, 1);

    public async Task ProsesKritisAsync()
    {
        // Menunggu izin secara asinkron tanpa mengunci thread!
        await _semaphore.WaitAsync();
        try
        {
            // Bebas melakukan await di dalam area kritis ini dengan aman!
            await Task.Delay(100);
        }
        finally
        {
            // Selalu lepaskan semaphore di blok finally!
            _semaphore.Release();
        }
    }
}
```

---

## 12. 🔴 Batching Terkendali: Parallel.ForEachAsync

### Konsep

Jika Anda memiliki daftar 50.000 URL yang harus diunduh secara asinkron, Anda **TIDAK BOLEH** langsung memanggil:
```csharp
await Task.WhenAll(urls.Select(UnduhUrlAsync)); // 50.000 request bersamaan akan membunuh server Anda!
```

Anda membutuhkan pembatasan konkurensi (*throttling*). Diperkenalkan sejak .NET 6 dan dioptimalkan di .NET 10 LTS, **`Parallel.ForEachAsync`** memungkinkan pemrosesan koleksi secara paralel dengan batas maksimal konkurensi (*degree of parallelism*) yang terkontrol ketat.

### Contoh Pembatasan Konkurensi

```csharp
using System;
using System.Threading.Tasks;

public static class DemoParallelBatching
{
    public static async Task Main()
    {
        int[] itemIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        // Konfigurasi: Maksimal hanya 3 tugas asinkron yang boleh berjalan bersamaan
        var options = new ParallelOptions
        {
            MaxDegreeOfParallelism = 3
        };

        Console.WriteLine("Memulai pemrosesan dengan batas maksimal 3 tugas bersamaan:");

        await Parallel.ForEachAsync(itemIds, options, async (id, cancellationToken) =>
        {
            Console.WriteLine($"-> [Mulai] Item #{id} diproses oleh Thread #{Environment.CurrentManagedThreadId}");
            await Task.Delay(800, cancellationToken); // Simulasi kerja asinkron
            Console.WriteLine($"<- [Selesai] Item #{id}");
        });

        Console.WriteLine("Seluruh 10 item selesai diproses terkontrol.");
    }
}
```

---

## 13. 🛠️ Best Practice & Anti-Pattern Concurrency

### 1. Jangan Pernah Menggunakan Sync-over-Async (`.Result` / `.Wait()`)
```csharp
// ❌ ANTI-PATTERN SANGAT FATAL: Sync-over-Async
string data = AmbilDataAsync().Result; // Berpotensi deadlock fatal pada ASP.NET / UI context!

// ✅ BAIK: Gunakan async/await sepanjang alur pipa (Async all the way)
string data = await AmbilDataAsync();
```

### 2. Selalu Berikan `CancellationToken` Bernilai Default pada Method Publik
```csharp
public async Task<Order> CariOrderAsync(int id, CancellationToken cancellationToken = default)
{
    return await _db.Orders.FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
}
```

### 3. Gunakan `ConfigureAwait(false)` pada Library Non-UI
Pada penulisan library infrastruktur umum atau paket NuGet, selalu tambahkan `.ConfigureAwait(false)` pada setiap titik `await` untuk mencegah *deadlock* dan menghindari pemaksaan kembali ke *SynchronizationContext* pemanggil.

> [!NOTE]
> **Mengapa di ASP.NET Core tidak diperlukan?**  
> ASP.NET Core (sejak versi 1.0 hingga .NET 10 LTS) sengaja **tidak memiliki SynchronizationContext** bawaan. Seluruh kelanjutan (*continuation*) task langsung dijalankan oleh thread manapun yang tersedia di Thread Pool. Namun, jika Anda menulis *class library* yang berpotensi dikonsumsi oleh aplikasi berbasis UI (WPF, WinForms, .NET MAUI), `.ConfigureAwait(false)` tetap merupakan best practice wajib.

---

## 14. 🛠️ Kesalahan Umum Pemula

### 1. Mengabaikan Nilai Task Tanpa `await` (*Fire-and-Forget Unhandled*)

❌ **Salah:**
```csharp
public void ProsesOrder()
{
    KirimEmailNotifikasiAsync(); // Ditinggalkan begitu saja tanpa await!
}
```
Jika `KirimEmailNotifikasiAsync` melempar exception jaringan, exception tersebut hilang tertelan atau memicu unobserved task exception yang sulit didiagnosis.

✅ **Benar:**
Jadikan method pemanggil bertipe `async Task` dan selalu lakukan `await`.

---

### 2. Berpikir `Task.Run` Otomatis Membuat Kode Menjadi Asinkron

❌ **Salah:**
Membungkus `File.ReadAllText` (sinkron) ke dalam `Task.Run` di dalam server ASP.NET Core. Ini tidak membuat I/O menjadi non-blocking, melainkan justru membebani thread pool server dengan mengorbankan 1 thread penuh untuk menunggu disk!

✅ **Benar:**
Gunakan API asinkron non-blocking bawaan: `await File.ReadAllTextAsync(path)`.

---

## 15. 🛠️ Mini Project: High-Throughput Currency Rate Ingestion Engine

### Tujuan

Membangun mesin penarik dan agregasi nilai tukar valuta asing (*Forex Rate Ingestion Engine*) berkinerja tinggi yang menggabungkan:
1. Panggilan asinkron non-blocking (`async`/`await`).
2. Pembatasan konkurensi menggunakan `Parallel.ForEachAsync` agar tidak membebani server penyedia API.
3. Dukungan pembatalan timeout menyeluruh via `CancellationTokenSource`.
4. Streaming data asinkron berbasis `IAsyncEnumerable`.
5. Sinkronisasi thread-safe mutakhir menggunakan **`System.Threading.Lock`** (C# 14).

### Implementasi Lengkap (C# 14 / .NET 10 LTS)

```csharp
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CurrencyIngestionSystem;

// Model Data Nilai Tukar
public readonly record struct KursMataUang(string Simbol, decimal NilaiTukarIdr, DateTime WaktuUpdate);

// Engine Penarikan Data Valas Berkecepatan Tinggi
public sealed class MesinPenarikValas
{
    // Menggunakan System.Threading.Lock modern C# 13/14 (.NET 10 LTS)
    private readonly Lock _lockPenyimpanan = new();
    private readonly Dictionary<string, KursMataUang> _bukuBesarKurs = [];

    // 1. ASYNCHRONOUS STREAM: Mengalirkan data kurs secara bertahap
    public async IAsyncEnumerable<KursMataUang> AlirkanKursSecaraBertahapAsync(
        string[] simbolList, 
        [System.Runtime.CompilerServices.EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        foreach (var simbol in simbolList)
        {
            cancellationToken.ThrowIfCancellationRequested();

            // Simulasi latensi jaringan asinkron non-blocking
            await Task.Delay(250, cancellationToken);

            decimal nilaiSimulasi = simbol switch
            {
                "USD" => 16250.50m,
                "EUR" => 17620.00m,
                "SGD" => 12150.25m,
                "JPY" => 105.40m,
                _     => 10000.00m
            };

            yield return new KursMataUang(simbol, nilaiSimulasi, DateTime.UtcNow);
        }
    }

    // 2. BATCH INGESTION TERBATAS: Mengambil banyak simbol valas secara paralel terkontrol
    public async Task ProsesBatchValasParalelAsync(string[] daftarSimbol, int maxKonkurensi, CancellationToken cancellationToken)
    {
        var options = new ParallelOptions
        {
            MaxDegreeOfParallelism = maxKonkurensi,
            CancellationToken = cancellationToken
        };

        Console.WriteLine($"[INGESTION] Memulai pengambilan {daftarSimbol.Length} mata uang (Maks konkurensi: {maxKonkurensi})...
");

        await Parallel.ForEachAsync(daftarSimbol, options, async (simbol, ct) =>
        {
            // Ambil data kurs asinkron
            KursMataUang data = await TarikKursTunggalAsync(simbol, ct);

            // Simpan ke buku besar menggunakan System.Threading.Lock modern (C# 14)
            lock (_lockPenyimpanan)
            {
                _bukuBesarKurs[data.Simbol] = data;
                Console.WriteLine($"✓ [TEREKAM] {data.Simbol} = Rp{data.NilaiTukarIdr:N2} (Thread #{Environment.CurrentManagedThreadId})");
            }
        });
    }

    private static async Task<KursMataUang> TarikKursTunggalAsync(string simbol, CancellationToken cancellationToken)
    {
        // Simulasi latensi acak antara 200ms - 500ms
        await Task.Delay(300, cancellationToken);

        decimal tarif = simbol switch
        {
            "GBP" => 20850.75m,
            "AUD" => 10420.30m,
            "CHF" => 18310.00m,
            "CNY" => 2240.15m,
            _     => 15000.00m
        };

        return new KursMataUang(simbol, tarif, DateTime.UtcNow);
    }

    public void CetakBukuBesar()
    {
        Console.WriteLine("
=== BUKU BESAR KURS MATA UANG TERKINI ===");
        lock (_lockPenyimpanan)
        {
            foreach (var (simbol, kurs) in _bukuBesarKurs)
            {
                Console.WriteLine($"* {simbol,-5} : Rp{kurs.NilaiTukarIdr,12:N2} (Update: {kurs.WaktuUpdate:HH:mm:ss})");
            }
        }
    }
}

public static class Program
{
    public static async Task Main()
    {
        Console.WriteLine("=== SISTEM AGREGASI KURS VALAS (C# 14 & .NET 10 LTS) ===
");

        MesinPenarikValas mesin = new();
        using CancellationTokenSource cts = new();
        cts.CancelAfter(TimeSpan.FromSeconds(5)); // Timeout keamanan 5 detik

        try
        {
            // DEMO 1: Asynchronous Streaming via IAsyncEnumerable
            Console.WriteLine("--- 1. UJI ASYNCHRONOUS STREAMING (IAsyncEnumerable) ---");
            string[] simbolAsia = ["USD", "SGD", "JPY"];
            
            await foreach (var item in mesin.AlirkanKursSecaraBertahapAsync(simbolAsia, cts.Token))
            {
                Console.WriteLine($"[STREAM DITERIMA] {item.Simbol} -> Rp{item.NilaiTukarIdr:N2}");
            }

            // DEMO 2: Controlled Parallel Ingestion dengan System.Threading.Lock
            Console.WriteLine("
--- 2. UJI BATCH PARALEL TERKONTROL (Parallel.ForEachAsync) ---");
            string[] simbolEropa = ["GBP", "AUD", "CHF", "CNY"];
            
            // Dijalankan maksimal 2 thread bersamaan untuk rate-limiting
            await mesin.ProsesBatchValasParalelAsync(simbolEropa, maxKonkurensi: 2, cts.Token);

            // Cetak rekapitulasi data
            mesin.CetakBukuBesar();
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine("[TIMEOUT] Operasi dibatalkan oleh batas waktu CancellationToken!");
        }

        Console.WriteLine("
Program asinkron selesai dengan sukses.");
    }
}
```

### Hasil Eksekusi

```text
=== SISTEM AGREGASI KURS VALAS (C# 14 & .NET 10 LTS) ===

--- 1. UJI ASYNCHRONOUS STREAMING (IAsyncEnumerable) ---
[STREAM DITERIMA] USD -> Rp16,250.50
[STREAM DITERIMA] SGD -> Rp12,150.25
[STREAM DITERIMA] JPY -> Rp105.40

--- 2. UJI BATCH PARALEL TERKONTROL (Parallel.ForEachAsync) ---
[INGESTION] Memulai pengambilan 4 mata uang (Maks konkurensi: 2)...

✓ [TEREKAM] GBP = Rp20,850.75 (Thread #8)
✓ [TEREKAM] AUD = Rp10,420.30 (Thread #12)
✓ [TEREKAM] CHF = Rp18,310.00 (Thread #8)
✓ [TEREKAM] CNY = Rp2,240.15 (Thread #12)

=== BUKU BESAR KURS MATA UANG TERKINI ===
* GBP   : Rp   20,850.75 (Update: 23:28:15)
* AUD   : Rp   10,420.30 (Update: 23:28:15)
* CHF   : Rp   18,310.00 (Update: 23:28:15)
* CNY   : Rp    2,240.15 (Update: 23:28:15)

Program asinkron selesai dengan sukses.
```

---

## 16. 📚 Peta Ingatan

```text
C# Asynchronous & Concurrency Framework
├── Task-based Asynchronous Pattern (TAP)
│   ├── async / await               -> Compiler state machine non-blocking
│   ├── Task / Task<T>              -> Reference-type async promise
│   └── ValueTask / ValueTask<T>   -> Zero-allocation struct untuk synchronous hot path
├── Cancellation & Streaming
│   ├── CancellationToken           -> Standar industri pembatalan & timeout
│   └── IAsyncEnumerable<T>         -> await foreach data streaming hemat RAM
├── Multitask Coordination
│   ├── Task.WhenAll                -> Menunggu semua selesai (Fan-out / Fan-in)
│   ├── Task.WhenAny                -> Mengambil hasil pertama tercepat (Racing)
│   └── Parallel.ForEachAsync       -> Throttling batching dengan MaxDegreeOfParallelism
└── Threading Synchronization
    ├── System.Threading.Lock       -> Fitur C# 13/14 penguncian memori modern
    ├── SemaphoreSlim               -> Async-compatible WaitAsync lock
    └── Interlocked                 -> Operasi atomik lock-free pada tingkat hardware
```

---

## 17. 📚 Cheat Code 10 Detik

```text
async Task<T>              -> deklarasi fungsi asinkron dengan return value T
await task                 -> jeda eksekusi secara non-blocking hingga selesai
ValueTask<T>               -> alternatif Task bebas alokasi heap untuk hot-path
CancellationToken          -> token pembatalan timeout operasi
ct.ThrowIfCancellationRequested() -> melempar exception jika pembatalan dipicu
await foreach (var item in stream) -> mengonsumsi IAsyncEnumerable
await Task.WhenAll(t1, t2) -> menjalankan banyak task bersamaan
lock (new Lock())          -> penguncian modern C# 13/14 System.Threading.Lock
await sem.WaitAsync()      -> area kritis aman yang kompatibel dengan await
Parallel.ForEachAsync      -> batching asinkron dengan batas konkurensi terkontrol
```

---

## 18. 🧭 Urutan Belajar Berikutnya

Selamat! Anda telah menuntaskan seluruh 6 modul fondasi bahasa C# 14 modern secara lengkap dari fundamental hingga arsitektur konkurensi tingkat lanjut.

Sekarang Anda memiliki fondasi rekayasa perangkat lunak yang sangat kokoh untuk melangkah ke pilar pengembangan web backend enterprise:

1. **Lanjutkan ke Jalur Web Development Backend: [[dotnet-dasar|ASP.NET Core .NET 10 LTS Dasar]]**
   * Pahami arsitektur internal runtime Kestrel Web Server.
   * Kuasai *Dependency Injection (DI)* container bawaan .NET (Transient, Scoped, Singleton).
   * Pelajari *Middleware Pipeline* pemrosesan request dan response HTTP.
   * Bangun RESTful API berkinerja tinggi menggunakan **Minimal APIs** dan **Controllers**.
2. **Lanjutkan ke [[dotnet-efcore|Entity Framework Core .NET 10 LTS]]**
   * Pelajari Database First vs Code First Migrations.
   * Kuasai relasi entitas, query tuning dengan `IQueryable`, dan deteksi N+1 problem.

---

## 19. 🔗 Referensi Resmi

* [Asynchronous programming with async and await - Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/)
* [Task-based Asynchronous Pattern (TAP) - .NET Guide](https://learn.microsoft.com/en-us/dotnet/standard/asynchronous-programming-patterns/task-based-asynchronous-pattern-tap)
* [System.Threading.Lock Class (.NET 9 / .NET 10) - Microsoft API Reference](https://learn.microsoft.com/en-us/dotnet/api/system.threading.lock)
* [Parallel.ForEachAsync Documentation - Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/api/system.threading.tasks.parallel.foreachasync)
