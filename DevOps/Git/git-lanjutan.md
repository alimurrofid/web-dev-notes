---
title: "Git Lanjutan"
description: "Fitur lanjutan Git: Branching strategies, Merge vs Rebase, Conflict Resolution, Stash, Reset (soft/mixed/hard), Revert, Cherry-pick, dan Bisect."
order: 2
tags:
  - devops
  - git
  - branching
  - intermediate
---

# Git Lanjutan

> **Target:** Pemula yang telah menguasai dasar-dasar Git dan ingin melangkah ke tingkat mahir (**Mental Model Directed Acyclic Graph (DAG), Three-Way Merge vs Rebase, The Golden Rule of Rebase, Interactive Rebase `git rebase -i` (Squashing, Rewording, Dropping), Anatomi & Resolusi Manual Merge Conflict, Manajemen Draft Stashing `git stash`, Strategi Undo Aman `git revert`, Time Travel `git reset` 3 Mode (`--soft`, `--mixed`, `--hard`), Pemindahan Commit Spesifik `git cherry-pick`, Penyelamat Commit Terhapus `git reflog`, Pelacak Bug Otomatis `git bisect` Binary Search, dan Release Tagging `git tag -a`**) menggunakan **Git 2.40+**.
> **Versi:** Git 2.40+
> **Prasyarat:** [[git-dasar|Git Dasar]]
> Fokus modul pembelajaran ini: **mental model Graph DAG & Immutability → Three-Way Merge vs Rebase → The Golden Rule of Rebase → Interactive Rebase (`rebase -i`) → Resolusi Merge Conflict (`<<<<<<< HEAD`) → Abort Trapped Merges → Stash Management (`push`, `pop`, `apply`, `-u`) → Undo Aman `git revert` di branch bersama → Time Travel `git reset` (Soft vs Mixed vs Hard) → Pemindahan `git cherry-pick` → Penyelamat Terakhir `git reflog` → Debugging Otomatis `git bisect` → Release Tagging → mini project Advanced Git Scenario Simulation**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: Mental model DAG Graph, Three-Way Merge, Rebase dasar, dan The Golden Rule of Rebase

🟡 Lanjutan
→ pelajari setelah Rebase lancar: Interactive Rebase (Squash/Reword), Resolusi Merge Conflict, Stashing draft, dan Undo aman via git revert

🔴 Advanced / Operasional
→ penting untuk arsitektur tingkat lanjut: git reset 3 mode (--soft/--mixed/--hard), cherry-pick, penyelamatan via git reflog, dan git bisect
```

Mental model perbandingan alur riwayat *Merge Commit* vs *Linear Rebase*:

```text
                             MERGE COMMIT STRATEGY
                     (Mempertahankan percabangan historis)
        main:    ─── C1 ────── C2 ─────────────── C5 (Merge Commit) ───
                      \                          /
        feature:       └── C3 ─────────── C4 ───┘
                                   │
                                   ▼
                             REBASE STRATEGY
                      (Riwayat lurus & bersih 100%)
        main:    ─── C1 ────── C2 ──────────────────────────────────────
                                \
        feature:                 └── C3' ──────── C4' (Diputar ulang di atas C2)
```

**Hafalan:**

```text
DAG (Directed Acyclic Graph) → struktur grafik berarah satu arah penampung rantai commit Git yang tidak dapat diubah isinya
Three-Way Merge              → penggabungan dua branch yang divergen dengan mencari titik temu leluhur bersama (Common Ancestor)
git rebase                   → memindahkan titik pangkal branch fitur ke ujung commit terbaru branch target (Linear History)
Golden Rule of Rebase        → DILARANG KERAS melakukan rebase pada branch publik bersama yang sedang dikerjakan orang lain
git rebase -i                → interactive rebase untuk merapikan, menggabungkan (squash), atau menghapus commit sebelum push
Merge Conflict               → kondisi tabrakan ketika dua branch mengedit baris kode yang sama persis pada waktu bersamaan
git stash                    → menyimpan perubahan lokal yang belum selesai ke memory sementara agar bisa beralih branch
git revert                   → membatalkan efek commit dengan membuat commit pembalik baru tanpa merusak riwayat masa lalu
git reset --soft             → membatalkan commit dan menyimpan seluruh perubahan di Staging Area
git reset --hard             → membatalkan commit dan MENGHAPUS PERMANEN seluruh perubahan fisik di disk (Gunakan hati-hati!)
git cherry-pick              → mengambil dan menerapkan satu commit spesifik dari branch lain ke branch aktif
git reflog                   → buku catatan riwayat pergerakan pointer HEAD lokal untuk memulihkan commit/branch yang hilang
git bisect                   → pencarian biner otomatis untuk menemukan commit mana yang pertama kali menyebabkan bug
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Git Lanjutan: Mental Model Directed Acyclic Graph (DAG) & Immutability Commit](#bagian-1)
2. [Three-Way Merge vs Fast-Forward Merge](#bagian-2)
3. [Pengenalan `git rebase`: Menjaga Riwayat Commit Tetap Lurus (Linear History)](#bagian-3)
4. [Perbandingan Mendalam: `git merge` vs `git rebase` & The Golden Rule of Rebase](#bagian-4)

### 🟡 Lanjutan

5. [Interactive Rebase (`git rebase -i`): Merapikan Riwayat Commit Sebelum Push](#bagian-5)
6. [Anatomi Merge Conflict: Membaca Marker `<<<<<<< HEAD`, `=======`, `>>>>>>>`](#bagian-6)
7. [Langkah Demi Langkah Resolusi Merge Conflict Manual](#bagian-7)
8. [Membatalkan Proses Merge atau Rebase yang Macet](#bagian-8)
9. [Menyimpan Perubahan Sementara dengan `git stash`](#bagian-9)
10. [Mengembalikan dan Mengelola Antrean Stash](#bagian-10)
11. [Mengambil Perubahan Sebagian ke Stash](#bagian-11)
12. [Membatalkan Perubahan dengan `git revert`](#bagian-12)

### 🔴 Advanced / Operasional

13. [Time Travel dengan `git reset`: Memahami 3 Mode Inti](#bagian-13)
14. [Analisis Efek `git reset` pada 3 Pohon Git](#bagian-14)
15. [Memindahkan Commit Tertentu Lintas Cabang dengan `git cherry-pick`](#bagian-15)
16. [Cherry-Pick Rentang Commit & Penanganan Konflik](#bagian-16)
17. [Jaring Pengaman Terakhir: `git reflog`](#bagian-17)
18. [Memulihkan Branch Terhapus Menggunakan `git reflog`](#bagian-18)
19. [Debugging Bug Otomatis dengan `git bisect`](#bagian-19)
20. [Menandai Versi Rilis Perangkat Lunak: Git Tagging](#bagian-20)

### 🛠️ Referensi & Praktik

21. [Peta Ingatan Cepat](#bagian-21)
22. [Tabel Ringkasan](#bagian-22)
23. [Cheat Code Git Lanjutan 10 Detik](#bagian-23)
24. [Urutan Belajar yang Disarankan](#bagian-24)
25. [Mini Project: Production-Ready Advanced Git Scenario Simulation](#bagian-25)
26. [Referensi Resmi](#bagian-26)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan Git Lanjutan: Mental Model Directed Acyclic Graph (DAG) & Immutability Commit

#### Konsep

Di level internal, Git bukanlah sekadar tumpukan file (*Folder*), melainkan sebuah **Directed Acyclic Graph (DAG)**:
- Setiap **Commit adalah sebuah simpul (*Node*)** yang merujuk (*Pointer*) ke commit induknya (*Parent*).
- **Immutability (Kekekalan):** Isi sebuah commit tidak pernah bisa diubah! Ketika Anda melakukan *amend*, *rebase*, atau *squash*, Git sebenarnya **membuat commit-commit baru dengan hash baru**, lalu memindahkan pointer branch ke commit baru tersebut.

#### Cara Kerja

```text
[Commit A] <─── [Commit B] <─── [Commit C] <─── HEAD (Branch main)
(Hash: a1b2)     (Hash: c3d4)     (Hash: e5f6)
```

**Hafalan:**

```text
Commit di Git bersifat Immutable (Kekal) | Manipulasi riwayat selalu menghasilkan node commit baru di grafik DAG
```

---

<a id="bagian-2"></a>

## 2. 🟢 Three-Way Merge vs Fast-Forward Merge

#### Konsep

1. **Fast-Forward Merge:**
   - Terjadi jika branch `main` tidak memiliki commit baru semenjak branch fitur dibuat. Git hanya menggeser pointer `main` maju ke depan.
2. **Three-Way Merge:**
   - Terjadi ketika **kedua branch telah berkembang secara divergen** (ada commit baru di `main` DAN ada commit baru di `feature`).
   - Git menggunakan 3 snapshot:
     1. Titik Temu Leluhur Bersama (*Common Ancestor*).
     2. Ujung Commit Branch Target (`main`).
     3. Ujung Commit Branch Sumber (`feature`).
   - Menghasilkan satu **Merge Commit khusus** yang memiliki 2 commit parent.

#### Contoh

```bash
git switch main
git merge feature/pembayaran
```

#### Output

```text
Merge made by the 'ort' strategy.
 payment.js | 45 +++++++++++++++++++++++++++++++++++++++
 1 file changed, 45 insertions(+)
```

**Hafalan:**

```text
Three-Way Merge → penggabungan dua branch divergen yang menghasilkan satu Merge Commit khusus dengan 2 parent
```

---

<a id="bagian-3"></a>

## 3. 🟢 Pengenalan `git rebase`: Menjaga Riwayat Commit Tetap Lurus (Linear History)

#### Konsep

**`git rebase <base-branch>`**:
- Alih-alih membuat Merge Commit bercabang, Rebase **mencopot commit-commit branch fitur Anda**, lalu **memasang dan memutarnya ulang satu per satu di atas ujung commit terbaru branch target**.
- **Hasil:** Riwayat proyek menjadi **satu garis lurus bersih (*Linear History*)**, sangat mudah dibaca via `git log`, dan mempermudah fitur *Bisect*.

#### Contoh

```bash
# [1] Pindah ke branch fitur Anda
git switch feature/auth

# [2] Rebase di atas branch main terbaru
git rebase main
```

**Hafalan:**

```text
git rebase main → memindahkan titik pangkal branch fitur ke ujung commit main untuk menghasilkan riwayat lurus linear
```

---

<a id="bagian-4"></a>

## 4. 🟢 Perbandingan Mendalam: `git merge` vs `git rebase` & The Golden Rule of Rebase

#### Konsep

| Parameter | `git merge` | `git rebase` |
|---|---|---|
| **Struktur Riwayat** | Riwayat bercabang (*Non-linear*) | Riwayat garis lurus (*Linear*) |
| **Keaslian Sejarah** | Mempertahankan konteks waktu asli | Menulis ulang riwayat (*Rewrite history*) |
| **Merge Commit** | Menghasilkan Merge Commit baru | **Tidak** menghasilkan Merge Commit |
| **Kemudahan Revert** | Mudah membatalkan seluruh fitur (1 commit) | Harus revert commit satu per satu |

> [!CAUTION]
> **The Golden Rule of Rebase:**
> **DILARANG KERAS melakukan rebase pada Public Shared Branch (seperti `main` atau `develop`) yang sedang digunakan bersama oleh developer lain!**
> Hanya lakukan rebase pada **Private Feature Branch lokal milik Anda sendiri** sebelum di-merge ke branch utama.

**Hafalan:**

```text
Golden Rule of Rebase → rebase hanya untuk branch fitur lokal pribadi; dilarang rebase branch publik bersama
```

---

<a id="bagian-5"></a>

## 5. 🟡 Interactive Rebase (`git rebase -i`): Merapikan Riwayat Commit Sebelum Push

#### Konsep

**`git rebase -i HEAD~N`**:
Membuka editor interaktif untuk memanipulasi $N$ commit terakhir sebelum kode di-push ke GitHub.

Perintah Interaktif:
- **`pick`** : Gunakan commit apa adanya.
- **`reword`** : Ubah pesan commit (memperbaiki typo deskripsi).
- **`squash` (atau `s`)** : **Gabungkan commit ini ke commit sebelumnya** dan gabungkan kedua pesan commit.
- **`fixup` (atau `f`)** : Gabungkan commit ini ke commit sebelumnya, tetapi **buang pesan commit ini** (gunakan pesan commit induk).
- **`drop` (atau `d`)** : Hapus commit ini secara permanen dari riwayat.

#### Contoh

```bash
# Rapikan 3 commit terakhir di branch fitur Anda
git rebase -i HEAD~3
```

Di dalam editor text terminal:
```text
pick 7f8a9b2 feat: tambah tabel produk
squash 3b1c4e5 fix: perbaiki typo nama kolom
squash a8d2f10 style: rapikan format file
```

**Hafalan:**

```text
git rebase -i HEAD~N → interactive rebase untuk menyatukan (squash) commit berantakan menjadi satu commit bersih
```

---

<a id="bagian-6"></a>

## 6. 🟡 Anatomi Merge Conflict: Membaca Marker `<<<<<<< HEAD`, `=======`, `>>>>>>>`

#### Konsep

**Merge Conflict** terjadi ketika Git tidak dapat memutuskan secara otomatis baris kode mana yang benar karena **dua commit mengubah baris file yang sama dengan konten berbeda**.

Git akan menghentikan proses dan menyisipkan **Conflict Markers**:

```text
<<<<<<< HEAD (Branch aktif saat ini, misal: main)
const API_BASE_URL = "https://api.v2.perusahaan.com";
======= (Garis pemisah konflik)
const API_BASE_URL = "https://api.prod.perusahaan.com";
>>>>>>> feature/new-api (Branch yang sedang digabungkan)
```

**Hafalan:**

```text
<<<<<<< HEAD (kode branch aktif) ======= (pemisah) >>>>>>> branch_sumber (kode branch yang masuk)
```

---

<a id="bagian-7"></a>

## 7. 🟡 Langkah Demi Langkah Resolusi Merge Conflict Manual

#### Konsep

Prosedur Baku Menyelesaikan Konflik:
1. Buka file yang berstatus konflik di text editor.
2. Diskusikan dengan rekan tim / tentukan kode mana yang benar.
3. Hapus seluruh marker (`<<<<<<<`, `=======`, `>>>>>>>`) dan sisakan kode yang valid.
4. Tandai file sudah selesai diselesaikan via **`git add <file>`**.
5. Lanjutkan proses via **`git merge --continue`** (atau `git rebase --continue`).

#### Contoh

```bash
# [1] Periksa file mana saja yang konflik
git status

# [2] Setelah mengedit file dan menghapus marker konflik:
git add config/api.js

# [3] Selesaikan proses merge
git merge --continue
```

**Hafalan:**

```text
Edit file -> Hapus marker konflik -> git add file -> git merge --continue
```

---

<a id="bagian-8"></a>

## 8. 🟡 Membatalkan Proses Merge atau Rebase yang Macet

#### Konsep

Jika saat menyelesaikan konflik Anda merasa bingung atau ingin kembali ke kondisi awal sebelum proses merge/rebase dimulai:

Gunakan flag **`--abort`**:
- **`git merge --abort`** : Membatalkan merge dan mengembalikan branch ke posisi persis sebelum perintah `git merge` dijalankan.
- **`git rebase --abort`** : Membatalkan rebase dan mengembalikan commit ke titik awal.

**Hafalan:**

```text
git merge --abort || git rebase --abort → membatalkan proses dan mengembalikan kondisi repo ke sebelum konflik terjadi
```

---

<a id="bagian-9"></a>

## 9. 🟡 Menyimpan Perubahan Sementara dengan `git stash`

#### Konsep

Bayangkan Anda sedang coding fitur baru di branch `feature/keranjang` (kode masih error/setengah jalan), tiba-tiba ada bug darurat di branch `main` yang harus segera diperbaiki!

Git menolak berpindah branch jika ada file modified yang belum di-commit.

**Solusi: `git stash`**:
- Menyimpan seluruh perubahan yang belum selesai ke dalam rak penyimpanan memori sementara (*Stash Stack*).
- Membersihkan working tree Anda kembali ke kondisi commit terakhir, sehingga Anda **bebas berpindah branch dengan aman**.

#### Contoh

```bash
# Simpan pekerjaan yang belum selesai dengan label deskriptif
git stash push -m "WIP: logika diskon voucher belum tuntas"
```

**Hafalan:**

```text
git stash push -m "pesan" → menyimpan draft perubahan lokal sementara agar bisa berpindah branch dengan aman
```

---

<a id="bagian-10"></a>

## 10. 🟡 Mengembalikan dan Mengelola Antrean Stash

#### Konsep

Perintah Manajemen Stash:
- **`git stash list`** : Melihat daftar seluruh draft yang tersimpan di rak.
- **`git stash pop`** : Mengembalikan perubahan draft paling atas (`stash@{0}`) dan **langsung menghapusnya dari rak**.
- **`git stash apply`** : Mengembalikan perubahan draft tetapi **tetap menyimpannya di rak**.
- **`git stash drop stash@{N}`** : Menghapus draft tertentu dari rak.
- **`git stash clear`** : Menghapus seluruh draft di rak stash.

#### Contoh

```bash
# [1] Lihat daftar stash
git stash list

# [2] Kembalikan draft terakhir setelah selesai memperbaiki bug di main
git switch feature/keranjang
git stash pop
```

**Hafalan:**

```text
git stash pop (kembalikan dan hapus dari rak) | git stash apply (kembalikan tanpa menghapus dari rak)
```

---

<a id="bagian-11"></a>

## 11. 🟡 Mengambil Perubahan Sebagian ke Stash

#### Konsep

1. **`git stash -u` (atau `--include-untracked`):**
   - Menyimpan file modified DAN file baru (*Untracked*) yang belum di-stage ke dalam stash.
2. **`git stash -p` (Interactive Patch):**
   - Memilih potongan baris tertentu (*Hunks*) dari satu file untuk dimasukkan ke stash.

#### Contoh

```bash
git stash -u -m "simpan termasuk file konfigurasi baru"
```

**Hafalan:**

```text
git stash -u → menyertakan file untracked yang baru dibuat ke dalam simpanan stash
```

---

<a id="bagian-12"></a>

## 12. 🟡 Membatalkan Perubahan dengan `git revert`

#### Konsep

**`git revert <commit-hash>`**:
- Cara **Paling Aman** untuk membatalkan efek dari suatu commit di branch bersama (*Public Shared Branch*).
- Git **TIDAK menghapus** commit buruk dari riwayat masa lalu, melainkan **membuat Commit Baru yang berisi kebalikan (*Inverse Delta*) dari commit tersebut**.

#### Contoh

```bash
# Batalkan commit yang menyebabkan bug di server production
git revert 7f8a9b2 -m "Revert 'feat: integrasi payment gateway baru'"
```

**Hafalan:**

```text
git revert commit_hash → membatalkan efek commit secara aman di branch bersama dengan membuat commit pembalik baru
```

---

<a id="bagian-13"></a>

## 13. 🔴 Time Travel dengan `git reset`: Memahami 3 Mode Inti

#### Konsep

**`git reset <mode> <target-commit>`**:
Memundurkan pointer branch ke commit masa lalu. Memiliki **3 Mode dengan tingkat keparahan berbeda**:

1. **`--soft` (Paling Lembut):**
   - Memundurkan riwayat commit, tetapi **seluruh perubahan file tetap berada di STAGING AREA**.
2. **`--mixed` (Default):**
   - Memundurkan commit dan mengeluarkan file dari staging, tetapi **perubahan file tetap berada di WORKING TREE** (Anda tidak kehilangan kode).
3. **`--hard` (Paling Berbahaya):**
   - Memundurkan commit dan **MENGHAPUS PERMANEN seluruh perubahan kode di disk fisik**!

**Hafalan:**

```text
--soft (simpan di Staging) | --mixed (simpan di Working Tree) | --hard (Hapus fisik total di disk)
```

---

<a id="bagian-14"></a>

## 14. 🔴 Analisis Efek `git reset` pada 3 Pohon Git

#### Konsep

Visualisasi Perbandingan Dampak 3 Mode Reset:

```text
Kondisi Awal: Anda membuat Commit C3 yang salah, ingin mundur ke Commit C2.

1. git reset --soft C2:
   Repository: Mundur ke C2
   Staging:    Memuat seluruh perubahan C3 (Siap di-commit ulang)
   Working:    Kode C3 utuh

2. git reset --mixed C2 (Default):
   Repository: Mundur ke C2
   Staging:    Kosong
   Working:    Kode C3 masih ada sebagai file Modified (Tinggal diedit/add)

3. git reset --hard C2:
   Repository: Mundur ke C2
   Staging:    Kosong
   Working:    Kode C3 DIHAPUS TOTAL dari laptop Anda! ⚠️
```

**Hafalan:**

```text
Gunakan --soft jika ingin menyatukan commit; gunakan --hard hanya jika Anda 100% yakin ingin membuang seluruh kode
```

---

<a id="bagian-15"></a>

## 15. 🔴 Memindahkan Commit Tertentu Lintas Cabang dengan `git cherry-pick`

#### Konsep

**`git cherry-pick <commit-hash>`**:
Mengambil **satu commit spesifik** dari branch lain dan langsung menerapkannya di atas branch aktif saat ini tanpa perlu melakukan merge seluruh branch.

Skenario Nyata:
Rekan Anda memperbaiki hotfix bug di branch `develop` (Commit `3b1c4e5`), dan Anda butuh perbaikan tersebut segera di branch `feature/auth` Anda.

#### Contoh

```bash
git switch feature/auth
git cherry-pick 3b1c4e5
```

**Hafalan:**

```text
git cherry-pick commit_hash → menduplikasi satu commit spesifik dari branch lain ke branch aktif saat ini
```

---

<a id="bagian-16"></a>

## 16. 🔴 Cherry-Pick Rentang Commit & Penanganan Konflik

#### Konsep

1. **Rentang Commit:** `git cherry-pick A..B` (Menerapkan rentang commit dari setelah A sampai B).
2. **Jika Terjadi Konflik saat Cherry-Pick:**
   - Selesaikan konflik manual $\rightarrow$ `git add <file>` $\rightarrow$ **`git cherry-pick --continue`**.
   - Jika ingin membatalkan: **`git cherry-pick --abort`**.

**Hafalan:**

```text
git cherry-pick --continue || git cherry-pick --abort
```

---

<a id="bagian-17"></a>

## 17. 🔴 Jaring Pengaman Terakhir: `git reflog`

#### Konsep

Pernahkah Anda panik karena tidak sengaja menjalankan `git reset --hard HEAD~5` dan mengira 5 commit penting Anda hilang selamanya?

**`git reflog` (Reference Log)**:
- Git mencatat **setiap pergerakan pointer `HEAD`** (commit, checkout, switch, rebase, reset, merge) di komputer lokal selama 30–90 hari terakhir.
- Selama belum dibersihkan oleh garbage collector, **tidak ada commit yang benar-benar hilang di Git**!

#### Contoh

```bash
git reflog
```

#### Output

```text
7f8a9b2 (HEAD -> main) HEAD@{0}: reset: moving to HEAD~1
3b1c4e5 HEAD@{1}: commit: feat: fitur penting yang tidak sengaja terhapus
a8d2f10 HEAD@{2}: commit: chore: setup awal
```

**Hafalan:**

```text
git reflog → buku hitam pelacak seluruh pergerakan HEAD lokal untuk menyelamatkan commit yang terhapus
```

---

<a id="bagian-18"></a>

## 18. 🔴 Memulihkan Branch Terhapus Menggunakan `git reflog`

#### Konsep

Untuk menyelamatkan commit atau branch yang hilang setelah menemukan hash-nya di `git reflog`:

Buat branch baru yang langsung menunjuk ke hash reflog tersebut:
**`git branch <nama-branch-pemulihan> HEAD@{N}`** (atau gunakan hash commit-nya).

#### Contoh

```bash
# Bangkitkan kembali commit 3b1c4e5 yang terhapus ke branch baru
git branch rescued-feature HEAD@{1}
git switch rescued-feature
```

**Hafalan:**

```text
git branch recovery-branch HEAD@{N} → membangkitkan kembali commit yang terhapus menjadi branch baru
```

---

<a id="bagian-19"></a>

## 19. 🔴 Debugging Bug Otomatis dengan `git bisect`

#### Konsep

Ketika ada bug muncul di production dan Anda tidak tahu commit mana di antara 500 commit terakhir yang memperkenalkannya:

**`git bisect`**:
Menggunakan algoritma **Pencarian Biner (*Binary Search*)** untuk menemukan commit penyebab bug dalam waktu $\approx \log_2(500) \approx 9$ langkah pengujian!

Langkah Penggunaan:
1. `git bisect start`
2. `git bisect bad` (Tandai commit saat ini rusak).
3. `git bisect good <commit-lama>` (Tandai commit versi lama yang masih berfungsi normal).
4. Git otomatis checkout ke commit tengah $\rightarrow$ Uji aplikasi Anda.
5. Ketik `git bisect good` jika commit tengah normal, atau `git bisect bad` jika commit tengah rusak.
6. Ulangi hingga Git menunjukkan commit perusak pertama!
7. `git bisect reset` (Kembali ke branch kerja awal).

**Hafalan:**

```text
git bisect start -> git bisect bad -> git bisect good hash -> uji -> git bisect reset (binary search bug finder)
```

---

<a id="bagian-20"></a>

## 20. 🔴 Menandai Versi Rilis Perangkat Lunak: Git Tagging

#### Konsep

**Git Tags**:
Pointer permanen yang menunjuk ke commit tertentu untuk menandai tonggak versi rilis perangkat lunak (misal: `v1.0.0`, `v2.1.0`).

Dua Jenis Tag:
1. **Lightweight Tag:** Hanya penanda nama sederhana.
2. **Annotated Tag (Standar Rilis):** Menyimpan nama pembuat, email, tanggal, dan pesan rilis lengkap (`git tag -a`).

#### Contoh

```bash
# [1] Buat Annotated Tag Versi Rilis
git tag -a v1.0.0 -m "Release Version 1.0.0 Production Ready"

# [2] Lihat Daftar Tag
git tag -l

# [3] Upload Tag ke GitHub Remote
git push origin v1.0.0
# Atau push seluruh tags sekaligus:
git push origin --tags
```

**Hafalan:**

```text
git tag -a v1.0.0 -m "Release" && git push origin --tags → menandai dan mempublikasikan versi rilis resmi
```

---

<a id="bagian-21"></a>

## 21. 🛠️ Peta Ingatan Cepat

```text
                   PETA ARSITEKTUR GIT LANJUTAN & RECOVERY
                                      │
       ┌──────────────────────────────┼──────────────────────────────┐
       ▼                              ▼                              ▼
HISTORY REWRITING & MERGE      STASH & TIME TRAVEL           DIAGNOSTICS & RESCUE
├─ Three-Way Merge vs Rebase   ├─ git stash (push/pop/-u)    ├─ git reflog (Penyelamat)
├─ Golden Rule of Rebase       ├─ git revert (Safe Public)   ├─ git bisect (Binary Search)
├─ git rebase -i (Squash)      ├─ git reset (--soft/--hard)  ├─ git cherry-pick (Pindah)
└─ Resolusi Conflict (<<<<<<<) └─ Staging Area vs Working    └─ git tag -a (Release Version)
```

---

<a id="bagian-22"></a>

## 22. 📚 Tabel Ringkasan

| Perintah Git | Kategori | Fungsi & Karakteristik Utama |
|---|---|---|
| `git rebase <base>` | History | Memindahkan titik pangkal branch ke ujung branch target (Linear) |
| `git rebase -i` | History | Merapikan, menggabungkan (squash), atau menghapus commit |
| `git merge --abort` | Conflict | Membatalkan proses merge dan kembali ke kondisi sebelum konflik |
| `git stash push -m` | Draft | Menyimpan perubahan sementara ke memory stack lokal |
| `git stash pop` | Draft | Mengembalikan draft terakhir dan menghapusnya dari stash |
| `git revert <hash>` | Undo | Membatalkan efek commit dengan membuat commit baru (Aman publik) |
| `git reset --soft` | Time Travel | Memundurkan commit, perubahan tetap di Staging Area |
| `git reset --hard` | Time Travel | Memundurkan commit dan MENGHAPUS seluruh file di disk |
| `git cherry-pick` | Transfer | Menduplikasi satu commit spesifik ke branch aktif |
| `git reflog` | Recovery | Melacak riwayat pergerakan HEAD untuk menyelamatkan data |
| `git bisect` | Debugging | Menemukan commit penyebab bug via algoritma binary search |
| `git tag -a` | Release | Membuat annotated tag penanda versi rilis resmi |

---

<a id="bagian-23"></a>

## 23. ⚡ Cheat Code Git Lanjutan 10 Detik

```bash
# [1] Squash 3 Commit Fitur Sebelum Pull Request:
git rebase -i HEAD~3

# [2] Simpan Draft Cepat & Pulihkan:
git stash -u -m "draft" && git stash pop

# [3] Undo Commit Terakhir Tapi Simpan Kodenya:
git reset --soft HEAD~1

# [4] Selamatkan Commit Terhapus dari Reflog:
git reflog && git branch rescue HEAD@{1}
```

---

<a id="bagian-24"></a>

## 24. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Kuasai Perbedaan Merge vs Rebase
├── Pahami kapan harus Three-Way Merge dan kapan harus Rebase
└── Terapkan The Golden Rule of Rebase pada branch lokal
       │
       ▼
Langkah 2: Bersihkan Riwayat via Interactive Rebase & Stash
├── Gunakan git rebase -i untuk squash commit berantakan
└── Simpan kode setengah matang via git stash push dan git stash pop
       │
       ▼
Langkah 3: Selesaikan Merge Conflicts dengan Percaya Diri
├── Pahami marker <<<<<<< HEAD, =======, >>>>>>>
└── Gunakan git add dan git merge/rebase --continue atau --abort
       │
       ▼
Langkah 4: Kuasai Time Travel, Cherry-Pick & Reflog Recovery
├── Batalkan perubahan via git revert (publik) atau git reset (lokal)
├── Pindahkan commit spesifik via git cherry-pick
└── Gunakan git reflog sebagai jaring pengaman terakhir
       │
       ▼
Langkah 5: Siap Melangkah ke Git Workflow Kolaborasi Tim (Git Flow & Conventional Commits)!
```

---

<a id="bagian-25"></a>

## 25. 🏗️ Mini Project: Production-Ready Advanced Git Scenario Simulation

Simulasi skenario lanjutan nyata di terminal: **Interactive Rebase Squashing, Stashing Drafts, Memicu dan Menyelesaikan Merge Conflict secara Manual, serta Memulihkan Commit Terhapus via `git reflog`**.

```bash
# =========================================================================
# [1] SETUP REPOSITORI DUMMY
# =========================================================================
mkdir advanced-git-demo
cd advanced-git-demo
git init

cat << 'EOF' > server.js
const PORT = 3000;
console.log(`Server berjalan di port ${PORT}`);
EOF

git add server.js
git commit -m "chore: initial server configuration"

# =========================================================================
# [2] SIMULASI BRANCHING & PERUBAHAN DIVERGEN (MEMICU KONFLIK)
# =========================================================================

# Branch A: Mengubah PORT menjadi 8080 di main
cat << 'EOF' > server.js
const PORT = 8080;
console.log(`Server Production berjalan di port ${PORT}`);
EOF
git commit -am "feat: update server port to 8080 for production"

# Buat Branch B dari commit pertama untuk mengubah PORT menjadi 5000
git switch -c feature/custom-port HEAD~1

cat << 'EOF' > server.js
const PORT = 5000;
console.log(`Server Microservice berjalan di port ${PORT}`);
EOF
git commit -am "feat: update server port to 5000 for microservices"

# =========================================================================
# [3] SIMULASI MERGE CONFLICT & RESOLUSI MANUAL
# =========================================================================
git switch main
# Coba merge branch feature/custom-port (Pasti Konflik!)
git merge feature/custom-port || true

# (File server.js sekarang memiliki marker <<<<<<< HEAD)
# Selesaikan konflik dengan memilih port 8080 dan logging microservice:
cat << 'EOF' > server.js
const PORT = 8080;
console.log(`Server Microservice Production berjalan di port ${PORT}`);
EOF

# Tandai selesai & tuntaskan merge commit
git add server.js
git merge --continue --no-edit

# =========================================================================
# [4] SIMULASI STASH MANAGEMENT
# =========================================================================
echo "console.log('Fitur monitoring WIP');" >> server.js
git stash push -m "WIP: monitoring logger"
git stash list
git stash pop

# =========================================================================
# [5] SIMULASI RESCUE DENGAN REFLOG (MEMULIHKAN KARENA SALAH RESET --HARD)
# =========================================================================
git commit -am "feat: commit berharga yang akan tidak sengaja dihapus"

# Bencana: Developer tidak sengaja melakukan reset --hard!
git reset --hard HEAD~1

# Penyelamatan: Periksa reflog dan bangkitkan kembali commit yang hilang
# git reflog
# git branch recovered-commit HEAD@{1}
```

#### Hasil Output Eksekusi Terminal

```text
[main e7f8a9b] feat: update server port to 8080 for production
Switched to a new branch 'feature/custom-port'
[feature/custom-port 1a2b3c4] feat: update server port to 5000 for microservices
Switched to branch 'main'
Auto-merging server.js
CONFLICT (content): Merge conflict in server.js
Automatic merge failed; fix conflicts and then commit the result.
[main 9d8e7f6] Merge branch 'feature/custom-port'
Saved working directory and index state On main: WIP: monitoring logger
stash@{0}: On main: WIP: monitoring logger
Dropped refs/stash@{0} (a1b2c3d4e5f6)
HEAD is now at 9d8e7f6 Merge branch 'feature/custom-port'
```

---

<a id="bagian-26"></a>

## 26. 🔗 Referensi Resmi

- [Git Documentation: Rewriting History](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)
- [Git Documentation: Reset Demystified](https://git-scm.com/blog/2011/07/11/reset.html)
- [Git Documentation: Advanced Merging](https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging)
- [Git Documentation: Debugging with Bisect](https://git-scm.com/docs/git-bisect)
- [Pro Git Book: Git Branching - Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)
