# AGENTS.md

# 1. Tujuan Repository

Repository ini adalah **knowledge base pembelajaran teknologi pemrograman** dalam Bahasa Indonesia.

Materi ditulis sebagai **learning notes yang terstruktur, mudah dipahami pemula, praktis, dan siap dipublikasikan sebagai website menggunakan Obsidian + Quartz**.

Tujuan utama repository:

* membantu pembaca belajar dari fundamental hingga advanced
* menjelaskan konsep dengan bahasa yang sederhana
* memberikan contoh kode yang relevan dan modern
* menjelaskan alasan dan cara kerja suatu konsep
* memberikan best practice dan kesalahan umum
* menyediakan jalur belajar yang jelas
* dapat dibaca langsung sebagai Markdown di Obsidian
* dapat dipublikasikan sebagai dokumentasi/website menggunakan Quartz
* dapat dibagikan kepada orang lain sebagai referensi belajar

Repository **bukan sekadar kumpulan cheatsheet**.

Prioritas penulisan:

```text
Akurasi
  ↓
Kelengkapan
  ↓
Kejelasan
  ↓
Logical Flow
  ↓
Praktikalitas
  ↓
Best Practice
  ↓
Konsistensi
```

---

# 2. Struktur Repository

Struktur repository menggunakan kategori teknologi di dalam direktori `content/` (sebagai satu-satunya Obsidian Vault).

Contoh:

```text
root/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── content/              ← Obsidian Vault
│   ├── .obsidian/
│   ├── index.md
│   │
│   ├── Programming/
│   │   ├── PHP/
│   │   ├── JavaScript/
│   │   ├── TypeScript/
│   │   └── Java/
│   │
│   ├── Web-Development/
│   │   ├── Backend/
│   │   │   ├── Laravel/
│   │   │   └── Spring-Boot/
│   │   │
│   │   └── Frontend/
│   │       ├── Vue/
│   │       ├── React/
│   │       └── Nuxt/
│   │
│   ├── Database/
│   │   ├── Database-Fundamental/
│   │   ├── PostgreSQL/
│   │   ├── MySQL/
│   │   └── PostGIS/
│   │
│   └── DevOps/
│       ├── Git/
│       ├── Linux/
│       ├── Docker/
│       └── NGINX/
├── quartz/
├── quartz.config.ts
├── quartz.layout.ts
├── package.json
├── tsconfig.json
├── .gitignore
└── AGENTS.md
```

Tidak ada lagi struktur:

```text
original/
revised/
```

Tidak ada konsep:

```text
-original.md
-revised.md
```

File yang dibuat agent adalah **file final** di dalam `content/`.

Contoh:

```text
content/Web-Development/Backend/Laravel/
├── laravel-dasar.md
├── laravel-database.md
├── laravel-eloquent.md
└── laravel-collection.md
```

Jika materi perlu diperbaiki, agent memperbarui file yang sama.

Jangan membuat:

```text
laravel-dasar-revised.md
laravel-dasar-v2.md
laravel-dasar-final.md
laravel-dasar-new.md
laravel-dasar-backup.md
```

Gunakan satu sumber kebenaran untuk setiap materi.

---

# 3. Peran AI Agent

AI Agent bertindak sebagai:

1. **Researcher**
2. **Technical Writer**
3. **Teacher**
4. **Reviewer**
5. **Editor**
6. **Documentation Engineer**

Agent tidak hanya mengubah teks menjadi lebih rapi.

Jika user meminta membuat materi baru, agent harus:

```text
Memahami topik
      ↓
Menentukan scope
      ↓
Menyusun learning path
      ↓
Melakukan research
      ↓
Memverifikasi informasi
      ↓
Menulis materi
      ↓
Review teknis
      ↓
Review pedagogis
      ↓
Review Markdown
      ↓
Hasil akhir
```

---

# 4. Prinsip Utama: Jangan Mengarang

Akurasi lebih penting daripada terlihat pintar.

Agent DILARANG:

* mengarang API
* mengarang syntax
* mengarang behavior framework
* mengarang output kode
* mengarang konfigurasi
* mengarang versi
* mengarang best practice
* mengarang URL dokumentasi
* menyatakan sesuatu sebagai fakta jika tidak yakin

Jika informasi tidak diketahui dengan cukup yakin:

```text
Jangan menebak.
Lakukan research atau nyatakan bahwa informasi tersebut perlu diverifikasi.
```

Untuk teknologi yang terus berkembang, prioritaskan dokumentasi resmi.

Urutan sumber:

```text
1. Official Documentation
2. Official Repository
3. Official RFC / Specification
4. Dokumentasi resmi vendor
5. Sumber teknis terpercaya
6. Community discussion sebagai pelengkap
```

Blog, forum, dan AI-generated content **tidak boleh menjadi sumber utama untuk klaim teknis penting**.

---

# 5. Version Awareness

Teknologi memiliki versi yang berbeda.

Jika materi berkaitan dengan framework, library, runtime, database, atau tool yang memiliki perubahan antar versi:

* identifikasi versi yang digunakan
* gunakan syntax yang sesuai dengan versi tersebut
* jangan mencampurkan API antar versi
* jelaskan jika terdapat perbedaan versi yang signifikan

Contoh:

```markdown
> Materi ini menggunakan Laravel 12.
```

atau:

```markdown
> Contoh pada materi ini menggunakan Vue 3 dengan Composition API.
```

Jika user tidak menentukan versi dan versi sangat memengaruhi materi, agent harus melakukan research terhadap versi terbaru/stabil yang relevan atau meminta klarifikasi jika keputusan versi akan mengubah struktur materi secara signifikan.

---

# 6. Target Pembaca

Target utama adalah:

**Pemula yang ingin memahami teknologi dari dasar.**

Jangan mengasumsikan pembaca sudah memahami konsep advanced.

Jika konsep membutuhkan pengetahuan sebelumnya:

```text
Konsep dasar
    ↓
Contoh sederhana
    ↓
Cara kerja
    ↓
Contoh nyata
    ↓
Variasi
    ↓
Best Practice
    ↓
Advanced
```

Hindari langsung memberikan syntax tanpa menjelaskan konsep.

---

# 7. Prinsip Pengajaran

Setiap konsep penting sebisa mungkin menjawab:

1. Apa itu?
2. Mengapa diperlukan?
3. Untuk apa digunakan?
4. Bagaimana cara menggunakannya?
5. Bagaimana cara kerjanya?
6. Kapan digunakan?
7. Kapan tidak sebaiknya digunakan?
8. Apa kesalahan umum?
9. Apa best practice?
10. Apa hubungan konsep ini dengan konsep lain?

Tidak semua pertanyaan harus dibuat sebagai heading terpisah.

Gunakan hanya bagian yang memang membantu pemahaman.

---

# 8. Learning Path

Materi harus memiliki alur pembelajaran.

Gunakan tiga level:

```text
🟢 Fundamental
Konsep yang wajib dipahami.

🟡 Intermediate
Konsep yang membutuhkan pemahaman fundamental.

🔴 Advanced
Konsep kompleks, edge case, optimasi,
arsitektur, keamanan, dan operasional.
```

Gunakan marker secara konsisten.

Jangan memasukkan konsep advanced terlalu awal hanya karena konsep tersebut penting.

---

# 9. Struktur Materi

Setiap materi sebaiknya memiliki struktur standar:

```markdown
---
title: "Nama Materi"
description: "Penjelasan ringkas materi untuk preview, search, dan SEO Quartz."
order: 1
tags:
  - kategori
  - teknologi
---

# [Nama Materi]

> Target: Pemula
> Versi: [versi jika relevan]

## Gambaran Umum

Penjelasan singkat tentang materi.

## Cara Belajar

Penjelasan urutan pembelajaran.

## Daftar Isi

...

---

## 1. 🟢 Konsep Fundamental

### Konsep

...

### Contoh

...

### Cara Kerja

...

### Hasil

...

### Best Practice

...

### Kesalahan Umum

...

---

## 2. 🟢 Konsep Berikutnya

...

---

## N. 🟡 Konsep Intermediate

...

---

## N. 🔴 Konsep Advanced

...

---

## N. 🛠️ Praktik

...

---

## N. 📚 Ringkasan

...

---

## N. 🧭 Urutan Belajar

...

---

## N. 🏗️ Mini Project

...

---

## N. 🔗 Referensi

...
```

Struktur boleh disesuaikan dengan topik.

**Jangan memaksakan section yang tidak relevan.**

---

# 10. Heading

Setiap dokumen hanya memiliki **satu H1** (`# [Nama Materi]`) sebagai judul dokumen.

Heading bab utama materi menggunakan H2 (`##`) dengan nomor sequential.

Contoh:

```markdown
# [Nama Materi]

## 1. 🟢 Pengenalan
## 2. 🟢 Konsep Dasar
## 3. 🟢 Syntax Dasar
## 4. 🟡 Konsep Intermediate
## 5. 🔴 Konsep Advanced
## 6. 🛠️ Mini Project
## 7. 📚 Ringkasan
## 8. 🔗 Referensi
```

Nomor harus:

```text
1
2
3
4
5
...
N
```

Tidak boleh:

```text
1
2
5
8
```

Sub-bab di bawah bab utama menggunakan H3 (`###`), dan rincian di bawahnya menggunakan H4 (`####`).

Heading harus konsisten dengan Daftar Isi.

---

# 11. Daftar Isi

Setiap materi panjang WAJIB memiliki Daftar Isi.

Contoh:

```markdown
## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan](#bagian-1)
2. [Konsep Dasar](#bagian-2)
3. [Syntax Dasar](#bagian-3)

### 🟡 Intermediate

4. [Konsep Intermediate](#bagian-4)

### 🔴 Advanced

5. [Konsep Advanced](#bagian-5)

### 🛠️ Praktik

6. [Mini Project](#bagian-6)

### 📚 Referensi

7. [Ringkasan](#bagian-7)
8. [Referensi Resmi](#bagian-8)
```

Gunakan explicit anchor jika renderer membutuhkan anchor yang stabil:

```markdown
<a id="bagian-1"></a>

## 1. 🟢 Pengenalan
```

---

# 12. Obsidian Compatibility

Materi harus nyaman dibaca di Obsidian.

Gunakan Markdown standar sebanyak mungkin.

Diperbolehkan menggunakan fitur Obsidian yang memang membantu knowledge base, seperti:

```markdown
[[php-dasar|PHP Dasar]]
[[laravel-dasar|Laravel Dasar]]
[[postgresql-dasar|PostgreSQL Dasar]]
```

Gunakan internal links jika file tujuan memang tersedia.

Jangan membuat link ke file yang belum ada hanya untuk terlihat lengkap.

Gunakan callout Obsidian jika memang memberikan nilai tambah.

Contoh:

```markdown
> [!TIP]
> Gunakan `first()` ketika hanya membutuhkan satu record.

> [!WARNING]
> Jangan menyimpan secret langsung di source code.

> [!IMPORTANT]
> Migration digunakan untuk mendefinisikan perubahan struktur database.
```

Jangan menggunakan callout secara berlebihan.

---

# 13. Quartz Compatibility

Materi harus dapat diproses oleh Quartz.

Hindari:

* HTML yang tidak diperlukan
* Markdown non-standard tanpa alasan
* syntax yang bergantung pada renderer tertentu
* link yang rusak
* anchor yang tidak valid
* code fence yang tidak tertutup
* struktur heading yang kacau

Prioritaskan:

```text
Markdown standar
+
Obsidian-compatible Markdown
+
Quartz-compatible structure
```

---

# 14. Internal Linking

Knowledge base harus membentuk hubungan antar materi.

Jika konsep memiliki hubungan langsung dengan materi lain dan file tersebut tersedia, gunakan format wikilink dengan slug file target:

```markdown
[[php-dasar|PHP Dasar]]
[[javascript-dasar|JavaScript Dasar]]
[[laravel-database|Laravel Database]]
[[postgresql-dasar|PostgreSQL Dasar]]
```

Gunakan format `[[nama-file-kebab-case|Display Text]]` atau `[[nama-file-kebab-case]]` agar Quartz dapat me-resolve slug halaman dengan tepat tanpa menghasilkan broken links.

Gunakan internal link secara natural.

Jangan membuat link untuk setiap istilah teknis.

Tujuannya adalah membangun **knowledge graph**, bukan memenuhi dokumen dengan hyperlink.

---

# 15. Contoh Kode

Contoh kode harus:

* sederhana
* runnable secara konsep
* modern
* relevan dengan versi teknologi
* fokus pada satu konsep
* mudah dipahami pemula

Hindari contoh yang terlalu kompleks ketika menjelaskan konsep dasar.

Contoh buruk:

```text
Menjelaskan variable tetapi contoh menggunakan
authentication + database + API + dependency injection.
```

Contoh baik:

```text
Konsep
↓
Kode minimal
↓
Output
↓
Penjelasan
↓
Contoh penggunaan nyata
```

---

# 16. Output Kode

Jika kode memiliki output yang jelas, tampilkan output.

Contoh:

```php
$name = "Budi";

echo $name;
```

Output:

```text
Budi
```

Jika tidak ada output literal, gunakan:

```markdown
## Hasil

Kode tersebut menghasilkan ...
```

Jangan mengklaim output tertentu jika kode belum diverifikasi secara logis.

Jika memungkinkan, lakukan validasi terhadap contoh kode.

---

# 17. Cara Kerja

Untuk konsep yang memiliki alur internal, gunakan diagram.

Gunakan alur vertikal:

```text
Input
  │
  ▼
Process
  │
  ▼
Validation
  │
  ▼
Output
```

Untuk percabangan gunakan boxed flow:

```text
              Request
                 │
                 ▼
        ┌─────────────────┐
        │    Validation   │
        └────────┬────────┘
                 │
          ┌──────┴──────┐
          ▼             ▼
        Valid         Invalid
          │             │
          ▼             ▼
       Process         Error
```

Jangan menggunakan diagram tree folder untuk menjelaskan execution flow.

Diagram folder hanya untuk struktur direktori.

---

# 18. Hafalan / Kunci

Gunakan bagian Hafalan untuk hal yang memang penting diingat.

Format:

````markdown
**Hafalan:**

```text
where('column', 'operator', 'value')
→ filter data berdasarkan kondisi

first()
→ mengambil satu record pertama

count()
→ menghitung jumlah record
```
````

Parameter dalam contoh hafalan harus menggunakan nama yang jelas:

```text
key
value
column
operator
condition
relation
attributes
options
````

Hindari:

```text
k
v
x
a
b
```

kecuali memang konteks matematis atau algoritmik membutuhkan nama tersebut.

---

# 19. Best Practice

Setiap konsep penting harus memiliki best practice jika memang relevan.

Format:

```markdown
## Best Practice

- Gunakan ...
- Hindari ...
- Pisahkan ...
- Validasi ...
```

Jangan membuat best practice hanya untuk memenuhi struktur.

Best practice harus mempunyai alasan teknis yang jelas.

---

# 20. Kesalahan Umum

Jelaskan kesalahan yang kemungkinan dilakukan pemula.

Contoh:

```markdown
## Kesalahan Umum

❌ Menggunakan ...

Karena ...

✅ Gunakan ...

Alasannya ...
```

Fokus pada kesalahan yang benar-benar umum dan relevan.

---

# 21. Perbandingan

Jika terdapat beberapa konsep yang sering membingungkan, gunakan tabel.

Contoh:

| Konsep    | Digunakan Untuk         | Hasil        |
| --------- | ----------------------- | ------------ |
| `first()` | Mengambil satu record   | Model / null |
| `get()`   | Mengambil banyak record | Collection   |
| `count()` | Menghitung record       | Integer      |

Gunakan tabel untuk perbandingan yang memang lebih mudah dipahami dalam bentuk tabel.

Jangan memaksakan semua informasi menjadi tabel.

---

# 22. Mental Model

Materi yang kompleks sebaiknya memiliki mental model.

Contoh:

```text
Database
    ↓
Query
    ↓
Model
    ↓
Business Logic
    ↓
Response
```

Tujuannya agar pembaca memahami hubungan antar konsep, bukan hanya menghafal API.

---

# 23. Mini Project

Materi utama sebaiknya memiliki mini project jika konsep memungkinkan untuk dipraktikkan.

Mini project harus:

* sederhana
* realistis
* menggabungkan konsep yang telah dipelajari
* memiliki tujuan jelas
* dapat dikerjakan pemula
* tidak memperkenalkan terlalu banyak konsep baru
* menyediakan kode yang lengkap, valid, dan dapat dijalankan (hindari pseudocode kosong)

Format:

```markdown
## Mini Project

### Tujuan

...

### Fitur

...

### Konsep yang Digunakan

...

### Langkah Implementasi

...

### Hasil Akhir

...
```

Mini project tidak harus selalu berupa aplikasi besar.

---

# 24. Ringkasan

Setiap materi harus memiliki ringkasan yang membantu pembaca mengingat kembali materi.

Gunakan:

````markdown
## Peta Ingatan

```text
Topik
├── Fundamental
│   ├── Konsep A
│   └── Konsep B
├── Intermediate
│   └── Konsep C
└── Advanced
    └── Konsep D
```
````

Struktur tree diperbolehkan pada **mental map / struktur konsep**.

Larangan penggunaan tree hanya berlaku untuk **alur proses/execution flow**.

---

# 25. Cheat Code

Jika topik memiliki syntax/API yang sering digunakan, sediakan bagian quick reference.

Contoh:

````markdown
### Cheat Code 10 Detik

```text
create()   → membuat data
find()     → mencari berdasarkan ID
where()    → filtering
first()    → satu record pertama
get()      → banyak record
count()    → jumlah record
exists()   → mengecek keberadaan
```
````

Cheat Code tidak menggantikan penjelasan utama.

---

# 26. Urutan Belajar

Materi harus memberikan arahan:

```markdown
## Urutan Belajar

1. Pahami konsep A
2. Pelajari konsep B
3. Praktikkan konsep C
4. Lanjut ke konsep D
5. Kerjakan mini project
6. Pelajari advanced topic
````

Tujuannya agar pembaca mengetahui:

> "Setelah membaca ini, saya harus belajar apa?"

---

# 27. Referensi

Setiap materi teknis sebaiknya memiliki referensi.

Prioritaskan dokumentasi resmi.

Contoh:

```markdown
## Referensi

- Dokumentasi resmi
- Official Repository
- Specification / RFC jika relevan
```

Jangan memasukkan referensi yang tidak benar-benar digunakan.

Jangan membuat URL secara tebakan.

Jika URL resmi tidak diketahui, lakukan research terlebih dahulu.

---

# 28. Bahasa

Semua penjelasan menggunakan Bahasa Indonesia.

Technical terms tetap menggunakan istilah English yang umum.

Contoh:

```text
request
response
middleware
component
state
props
event
query
migration
database
dependency injection
reactive
computed
watcher
```

Jangan menerjemahkan technical term menjadi istilah Indonesia yang tidak lazim.

Gunakan bahasa yang:

* natural
* jelas
* tidak terlalu formal
* tidak terlalu conversational
* mudah dipahami mahasiswa/pemula
* tidak bertele-tele

Hindari kalimat seperti:

```text
Pada era digital yang semakin berkembang...
```

Langsung masuk ke konsep.

---

# 29. Kedalaman Materi

Tidak ada target jumlah baris wajib.

Gunakan prinsip:

> **Cukup lengkap untuk memahami konsep, tetapi jangan menambahkan informasi hanya untuk membuat dokumen panjang.**

Materi harus berhenti ketika scope sudah tercakup dengan baik.

Prioritas:

```text
Completeness
>
Clarity
>
Accuracy
>
Practicality
>
Length
```

---

# 30. Research Sebelum Menulis

Untuk materi baru, agent harus melakukan research jika:

* teknologi memiliki versi aktif
* API dapat berubah
* informasi tidak cukup diketahui
* terdapat beberapa pendekatan
* terdapat potensi perbedaan versi
* user meminta best practice
* user meminta rekomendasi teknis

Research minimal harus memverifikasi:

```text
Nama API
Syntax
Behavior
Version
Best Practice
Official Documentation
```

Jangan melakukan research hanya untuk menambahkan informasi yang tidak diperlukan.

---

# 31. Pisahkan Fakta dan Opini

Bedakan:

```text
Fakta teknis
```

dengan:

```text
Rekomendasi / opinionated practice
```

Contoh:

```markdown
Laravel menyediakan ...

```

berbeda dengan:

```markdown
Untuk project baru, pendekatan yang saya rekomendasikan adalah ...
```

Jangan menyampaikan preference sebagai fakta resmi.

---

# 32. Jangan Overengineering Materi

Materi untuk pemula tidak boleh dibuat terlalu kompleks.

Jika ada 3 cara melakukan sesuatu:

```text
Cara paling sederhana
      ↓
Cara yang umum digunakan
      ↓
Cara advanced
```

Jangan langsung menggunakan pendekatan advanced jika tidak diperlukan.

---

# 33. Konsistensi Antar Materi

Semua notes harus terasa dibuat oleh satu penulis.

Pertahankan konsistensi:

* gaya bahasa
* level marker
* format heading
* format code block
* diagram
* tabel
* Hafalan
* Best Practice
* Kesalahan Umum
* Mini Project
* Referensi

Namun:

> Konsistensi tidak boleh mengalahkan relevansi.

Tidak semua materi harus memiliki struktur yang identik.

---

# 34. Naming Convention

### Konvensi Nama File
Nama file materi menggunakan nama bersih (*clean kebab-case*) tanpa awalan nomor:

```text
lowercase-kebab-case.md
```

Urutan pembelajaran diatur melalui atribut `order: N` di dalam YAML Frontmatter, bukan melalui nama file.

Contoh:

```text
php-dasar.md
php-oop.md
laravel-database.md
vue-router.md
postgresql-lanjutan.md
```

Jangan menggunakan:

```text
01-php-dasar.md
PHP Dasar.md
php_dasar.md
phpDasar.md
php-dasar-final.md
```

### Konvensi Nama Folder
Folder kategori dan topik menggunakan format PascalCase / kebab-case yang bersih tanpa awalan nomor:

```text
root/
├── Programming/
│   ├── PHP/
│   └── JavaScript/
├── Web-Development/
│   ├── Backend/
│   │   └── Laravel/
│   └── Frontend/
│       └── Vue/
├── Database/
│   ├── PostgreSQL/
│   └── MySQL/
└── DevOps/
    ├── Git/
    └── Docker/
```

---

# 35. Satu File = Satu Materi

Satu file harus memiliki scope yang jelas.

Contoh:

```text
laravel-database.md
```

berisi materi database Laravel secara terstruktur.

Jangan membuat satu file berisi seluruh Laravel jika topiknya sudah terlalu besar.

Sebaliknya, jangan memecah materi terlalu kecil hanya menjadi satu konsep sederhana kecuali memang berguna sebagai atomic note.

---

# 36. Atomic Knowledge

Jika sebuah konsep cukup besar dan dapat berdiri sendiri, pertimbangkan untuk membuat note terpisah.

Contoh:

```text
Laravel
├── laravel-dasar.md
├── laravel-database.md
├── laravel-eloquent.md
└── laravel-collection.md
```

Hubungkan menggunakan internal links:

```markdown
Untuk memahami Eloquent lebih lanjut, lihat [[laravel-eloquent|Laravel Eloquent]].
```

Tujuan akhirnya adalah membangun **knowledge base yang saling terhubung**.

---

# 37. Update Existing Notes

Ketika user meminta memperbaiki materi yang sudah ada:

1. baca materi saat ini
2. identifikasi kekurangan
3. verifikasi informasi
4. perbaiki langsung file tersebut
5. pertahankan informasi yang masih valid
6. hapus informasi yang terbukti salah
7. tambahkan informasi yang diperlukan
8. pastikan struktur tetap konsisten

Tidak perlu membuat file:

```text
-revised
-v2
-final
-backup
```

---

# 38. Prosedur Membuat Materi Baru

Ketika user meminta:

> "Buat materi tentang X"

ikuti workflow:

### Step 1 — Understand

Tentukan:

* target pembaca
* scope
* prerequisite
* teknologi/versi
* konsep fundamental
* konsep intermediate
* konsep advanced
* praktik

### Step 2 — Plan

Buat outline internal:

```text
Fundamental
↓
Intermediate
↓
Advanced
↓
Practice
↓
Summary
```

### Step 3 — Research

Verifikasi informasi penting menggunakan sumber terpercaya, terutama dokumentasi resmi.

### Step 4 — Write

Tulis langsung ke file final:

```text
<topic>.md
```

### Step 5 — Review Technical

Periksa:

* syntax
* API
* behavior
* terminology
* version
* example
* output
* best practice

### Step 6 — Review Pedagogical

Tanyakan:

```text
Apakah pemula dapat memahami materi ini
tanpa harus menebak konteks?
```

Periksa:

* logical flow
* prerequisite
* contoh
* penjelasan
* transisi antar konsep

### Step 7 — Review Markdown

Periksa:

* heading
* TOC
* anchor
* code fence
* tabel
* internal link
* callout
* Quartz compatibility

### Step 8 — Final Check

Pastikan tidak ada:

* placeholder
* TODO
* syntax yang meragukan
* link rusak
* section kosong
* duplicate section
* file backup
* informasi yang dibuat-buat

---

# 39. Prosedur Revisi Existing Note

Ketika user meminta:

> "Perbaiki materi X"

jangan hanya melakukan proofreading.

Lakukan:

```text
Existing Note
     ↓
Technical Audit
     ↓
Content Gap Analysis
     ↓
Research
     ↓
Structural Improvement
     ↓
Rewrite
     ↓
Technical Review
     ↓
Final Validation
```

Tujuan revisi:

> Membuat note lebih baik sebagai materi pembelajaran, bukan hanya memperbaiki grammar.

---

# 40. Verifikasi Otomatis

Sebelum menyelesaikan pekerjaan, lakukan pemeriksaan jika tooling memungkinkan.

Minimal periksa:

```text
[ ] YAML Frontmatter lengkap (title, description, tags, order)
[ ] File menggunakan ekstensi .md
[ ] Tepat 1 H1 (judul dokumen) & bab utama sequential H2
[ ] TOC sesuai dengan heading
[ ] Anchor tidak duplicate
[ ] Code fence berpasangan & valid
[ ] Wikilinks menggunakan format slug [[nama-file|Label]]
[ ] Tidak ada broken Markdown
[ ] Tidak ada placeholder TODO
[ ] Tidak ada file -revised / -v2 / -backup
[ ] Internal link mengarah ke note yang tersedia
[ ] Tabel valid
[ ] Tidak ada blockquote yang tidak diperlukan
```

Jika terdapat script lint/validation di repository, gunakan script tersebut.

Jika tidak ada script, lakukan pemeriksaan manual.

---

# 41. Larangan

AI Agent DILARANG:

* mengarang informasi teknis
* mengarang API
* mengarang URL
* mencampur syntax antar versi tanpa penjelasan
* membuat file `-revised.md`
* membuat file `-final.md`
* membuat file `-v2.md`
* membuat backup file tanpa diminta
* membuat materi panjang hanya demi jumlah baris
* menghapus informasi valid hanya demi memperpendek materi
* menggunakan jargon tanpa penjelasan
* menggunakan technical term yang tidak umum tanpa konteks
* membuat diagram hanya sebagai dekorasi
* memasukkan referensi yang tidak digunakan
* membuat internal link ke file yang tidak tersedia
* menyampaikan opini sebagai fakta
* memberikan best practice tanpa alasan teknis

---

# 42. Definition of Done

Sebuah materi dianggap selesai jika:

```text
✓ YAML Frontmatter lengkap dan valid (title, description, tags, order)
✓ Scope jelas
✓ Learning path jelas
✓ Hirarki heading semantik (1 H1, bab H2, sub H3)
✓ Fundamental dijelaskan
✓ Konsep penting tercakup
✓ Contoh kode relevan
✓ Cara kerja dijelaskan
✓ Best practice tersedia jika relevan
✓ Kesalahan umum tersedia jika relevan
✓ Ada ringkasan & peta ingatan
✓ Ada quick reference jika relevan
✓ Ada mini project jika relevan
✓ Referensi resmi tersedia
✓ Wikilinks valid dan mengarah ke file yang ada
✓ Informasi teknis telah diverifikasi
✓ Markdown valid
✓ Obsidian-friendly
✓ Quartz-compatible
✓ Tidak ada placeholder
✓ Tidak ada informasi yang sengaja dibuat-buat
```

---

# 43. Filosofi Repository

Repository ini bukan bertujuan menjadi:

```text
Dump informasi
```

tetapi menjadi:

```text
Knowledge Base
     ↓
Learning Path
     ↓
Practical Examples
     ↓
Mental Model
     ↓
Best Practice
     ↓
Practical Reference
```

Pembaca harus dapat:

```text
Belum tahu
    ↓
Memahami konsep
    ↓
Mengikuti contoh
    ↓
Mencoba sendiri
    ↓
Memahami kapan digunakan
    ↓
Mampu menggunakannya dalam project
```

Target akhirnya adalah:

> **Orang lain dapat belajar dari repository ini tanpa membutuhkan penjelasan tambahan dari penulis.**
