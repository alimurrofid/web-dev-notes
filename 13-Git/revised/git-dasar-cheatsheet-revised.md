# Git Dasar Cheatsheet Revised

> **Target:** Pemula yang ingin menguasai **Sistem Kontrol Versi Terdistribusi Git 2.40+ (Mental Model Distributed VCS, Arsitektur 3 Pohon Git *Working Tree / Staging Area / Repository*, Konfigurasi `git config`, Inisialisasi `git init` & `git clone`, Status Berkas `git status`, Staging `git add` & patch `add -p`, Snapshot Commit `git commit` & `--amend`, Aturan `.gitignore` & `.gitkeep`, Visualisasi Riwayat `git log --oneline --graph`, Inspeksi `git diff`, Branching Modern `git switch` & `git switch -c`, Fast-Forward Merge `git merge`, Pembersihan `git rm --cached` & `git mv`, Integrasi Remote GitHub/GitLab `git remote`, `git push -u`, `git fetch` vs `git pull`, serta Pembatalan Aman via `git restore`)**.
>
> Fokus cheatsheet ini: **mental model Distributed Snapshots vs Centralized Deltas → Arsitektur 3 Pohon Git → Setup Identitas & Config → Inisialisasi & Kloning → Status Berkas & Staging Area → Commit & Hash SHA → Konfigurasi `.gitignore` Bersih → Visualisasi Riwayat Log → Inspeksi Diff Kode → Branching Ringan & Pointer HEAD → Perintah Modern `git switch` → Fast-Forward Merge → Remote Repositories GitHub → Push Upstream `-u` → Fetch vs Pull → Pembatalan Aman dengan `git restore` → mini project Full-Cycle Git Workflow Simulation**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: Arsitektur 3 Pohon Git, Setup Identitas (git config), git init vs clone, Staging (add), dan Snapshot Commit

🟡 Lanjutan
→ pelajari setelah commit lancar: .gitignore rules, Visualisasi log grafis, git diff, Branching modern (git switch), dan Fast-Forward Merge

🔴 Advanced / Operasional
→ penting untuk kolaborasi: Remote GitHub/GitLab, Push Upstream (-u), Fetch vs Pull, git rm --cached, dan Safe Undo (git restore)
```

Mental model alur pergerakan file antar 3 Pohon Git (*Three-Tree Architecture*):

```text
               1. WORKING TREE (Direktori Kerja di Komputer)
            File diedit/diubah secara fisik di text editor (VS Code)
                               │
                               ▼  git add <file>
               2. STAGING AREA / INDEX (Daftar Persiapan)
            File disiapkan & ditandai untuk masuk ke snapshot berikutnya
                               │
                               ▼  git commit -m "pesan"
               3. GIT REPOSITORY / .git (Riwayat Permanen Lokal)
            Snapshot kode dikunci secara kriptografis (SHA-1/256) di riwayat
                               │
                               ▼  git push -u origin main
               4. REMOTE REPOSITORY (GitHub / GitLab Cloud)
            Kode disinkronkan ke server cloud untuk kolaborasi tim
```

**Hafalan:**

```text
Working Tree        → direktori file nyata di disk tempat Anda menulis dan mengedit kode aplikasi
Staging Area        → area persiapan (draft index) penampung perubahan yang siap dikunci ke commit berikutnya
Git Repository      → basis data lokal di folder tersembunyi .git yang menyimpan seluruh snapshot riwayat commit
git config --global → perintah pengaturan konfigurasi identitas nama, email, dan default branch pengguna
git init vs clone   → git init membuat repositori kosong baru di lokal; git clone mengunduh repo yang sudah ada di remote
git status          → memeriksa kondisi berkas di working tree dan berkas yang sudah ada di staging area
git add .           → memindahkan seluruh file yang diubah di folder saat ini ke staging area
git commit -m       → menyimpan snapshot permanen dari seluruh file di staging area ke basis data repositori
.gitignore          → file konfigurasi khusus untuk mencegah file rahasia/sampah/dependensi masuk ke tracking Git
git switch          → perintah modern yang bersih untuk berpindah cabang branch (menggantikan fungsi ambigu checkout)
git merge           → menggabungkan riwayat commit dari satu branch ke branch aktif saat ini
git fetch vs pull   → git fetch mengunduh metadata terbaru tanpa mengubah file lokal; git pull = fetch + merge otomatis
git restore         → membatalkan perubahan file lokal di working tree atau mengembalikan file dari staging area
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Version Control System (VCS) & Mental Model Terdistribusi Git](#bagian-1)
2. [Arsitektur Internal 3 Pohon Git: Working Tree, Staging Area (Index), dan Git Repository (`.git`)](#bagian-2)
3. [Konfigurasi Awal Identitas & Preferensi Pengguna](#bagian-3)
4. [Inisialisasi Repositori Lokal (`git init`) vs Kloning Repositori Remote (`git clone`)](#bagian-4)
5. [Siklus Hidup Status Berkas di Git: Untracked, Unmodified, Modified, dan Staged](#bagian-5)
6. [Menambahkan Perubahan ke Staging Area](#bagian-6)
7. [Menyimpan Snapshot Permanen (`git commit -m`) & Mengubah Commit Terakhir (`git commit --amend`)](#bagian-7)
8. [Mengabaikan Berkas dengan `.gitignore` & Menjaga Direktori Kosong dengan `.gitkeep`](#bagian-8)

### 🟡 Lanjutan

9. [Memeriksa Riwayat Perubahan: `git log` Visual & Ringkas](#bagian-9)
10. [Inspeksi Perbedaan Kode Secara Mendalam: `git diff`](#bagian-10)
11. [Konsep Percabangan (Branching) & Pointer HEAD di Git](#bagian-11)
12. [Membuat, Melihat, dan Mengganti Branch Modern](#bagian-12)
13. [Membuat dan Langsung Beralih ke Branch Baru](#bagian-13)
14. [Penggabungan Cabang Dasar: Fast-Forward Merge](#bagian-14)
15. [Menghapus Branch yang Sudah Selesai Digabung](#bagian-15)
16. [Menghapus & Memindahkan File dari Tracking Git](#bagian-16)

### 🔴 Advanced / Operasional

17. [Menghubungkan Repositori Lokal ke Remote Server GitHub / GitLab](#bagian-17)
18. [Mengunggah Kode ke Remote Server](#bagian-18)
19. [Sinkronisasi Remote: `git fetch` vs `git pull`](#bagian-19)
20. [Membatalkan Perubahan Lokal Aman dengan `git restore`](#bagian-20)

### 🛠️ Referensi & Praktik

21. [Peta Ingatan Cepat](#bagian-21)
22. [Tabel Ringkasan](#bagian-22)
23. [Cheat Code Git Dasar 10 Detik](#bagian-23)
24. [Urutan Belajar yang Disarankan](#bagian-24)
25. [Mini Project: Production-Ready Full-Cycle Git Workflow Simulation](#bagian-25)
26. [Referensi Resmi](#bagian-26)

---

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan Version Control System (VCS) & Mental Model Terdistribusi Git

## Konsep

Sebelum ada Version Control, developer menyimpan riwayat kode secara manual: `project-final.zip`, `project-final-v2.zip`, `project-beneran-final.zip` $\rightarrow$ sangat rentan tertimpa dan mustahil melacak siapa yang mengubah baris kode tertentu.

**Mengapa Git Berbeda dari VCS Lain (Seperti SVN / CVS)?**:
1. **Model Snapshot, Bukan Delta:** Git memperlakukan data sebagai serangkaian foto/snapshot utuh dari seluruh proyek pada waktu tertentu.
2. **Arsitektur Terdistribusi (Distributed):** Setiap developer yang melakukan `clone` memiliki **salinan repositori dan riwayat penuh 100% di komputer lokalnya**. Anda bisa melakukan commit, branching, dan inspeksi log secara offline tanpa koneksi internet.

## Cara Kerja

```text
VCS Tradisional (Delta-Based):
Versi 1 ──> Simpan Perubahan File A ──> Simpan Perubahan File B (Jika server pusat mati, kerja terhenti) ❌

Git (Distributed Snapshot-Based):
Commit 1 (Snapshot Utuh Proyek) ──> Commit 2 (Snapshot Utuh Proyek) (100% mandiri di setiap laptop dev) ✅
```

**Hafalan:**

```text
Git = Distributed Version Control System yang menyimpan snapshot proyek secara terdistribusi di komputer lokal
```

---

<a id="bagian-2"></a>

# 2. 🟢 Arsitektur Internal 3 Pohon Git: Working Tree, Staging Area (Index), dan Git Repository (`.git`)

## Konsep

Git mengelola berkas Anda melalui **3 Wilayah Kerja (*The Three Trees*)**:

1. **Working Tree (Working Directory):**
   - File fisik yang terlihat di folder komputer Anda (tempat Anda mengetik kode di editor).
2. **Staging Area (Index):**
   - Area penampung persiapan. File yang sudah ditandai via `git add` siap dimasukkan ke dalam commit berikutnya.
3. **Git Repository (Folder `.git`):**
   - Basis data permanen Git tempat seluruh snapshot commit, pointer branch, dan konfigurasi tersimpan secara aman.

**Hafalan:**

```text
Working Tree (Edit) -> Staging Area (Siapkan via add) -> Repository (Kunci via commit)
```

---

<a id="bagian-3"></a>

# 3. 🟢 Konfigurasi Awal Identitas & Preferensi Pengguna

## Konsep

Saat pertama kali menginstal Git di komputer baru, Anda **WAJIB** mengatur identitas nama dan email. Identitas ini akan tersemat secara permanen pada setiap commit yang Anda buat.

Gunakan flag **`--global`** agar berlaku untuk seluruh repositori di komputer Anda.

## Perintah CLI

```bash
# [1] Set Nama Lengkap & Email (Gunakan email yang sama dengan akun GitHub Anda)
git config --global user.name "Alimur Rofid"
git config --global user.email "alimur@dev.com"

# [2] Set Nama Default Branch Utama Menjadi 'main' (Standar Industri Modern)
git config --global init.defaultBranch main

# [3] Set Text Editor Default (Misal: VS Code)
git config --global core.editor "code --wait"

# [4] Periksa Seluruh Konfigurasi Aktif
git config --list --show-origin
```

**Hafalan:**

```text
git config --global user.name "Nama" && git config --global user.email "email" → inisialisasi identitas pembuat commit
```

---

<a id="bagian-4"></a>

# 4. 🟢 Inisialisasi Repositori Lokal (`git init`) vs Kloning Repositori Remote (`git clone`)

## Konsep

Dua Cara Memulai Repositori Git:
- **`git init`** : Digunakan saat memulai proyek baru dari folder kosong di komputer lokal (membuat folder tersembunyi `.git`).
- **`git clone <url>`** : Digunakan saat Anda ingin mengunduh seluruh proyek dan riwayat commit yang sudah ada di server remote (GitHub / GitLab).

## Contoh

```bash
# [1] Membuat Proyek Baru Lokal
mkdir toko-online
cd toko-online
git init

# [2] Mengunduh Proyek Tim dari GitHub
git clone https://github.com/perusahaan/backend-api.git
```

## Output `git init`

```text
Initialized empty Git repository in /Users/alimur/toko-online/.git/
```

**Hafalan:**

```text
git init (buat repo baru di folder lokal) | git clone <url> (unduh repo yang sudah ada dari GitHub)
```

---

<a id="bagian-5"></a>

# 5. 🟢 Siklus Hidup Status Berkas di Git: Untracked, Unmodified, Modified, dan Staged

## Konsep

Setiap file di dalam folder proyek Anda selalu berada di salah satu dari **4 Status Siklus Hidup**:

| Status Berkas | Deskripsi | Tampilan `git status -s` |
|---|---|---|
| **`Untracked`** | File baru dibuat di disk yang belum pernah dipantau oleh Git. | `?? nama_file` |
| **`Modified`** | File yang sudah pernah di-commit sebelumnya, lalu isinya diubah di text editor. | ` M nama_file` (Merah) |
| **`Staged`** | File yang sudah ditandai via `git add` dan siap dimasukkan ke commit. | `M  nama_file` (Hijau) |
| **`Unmodified`** | File sudah tersimpan di commit terakhir dan belum disentuh lagi. | *(Tidak muncul)* |

## Contoh

```bash
git status       # Status lengkap dan deskriptif
git status -s    # Status ringkas (Short format)
```

**Hafalan:**

```text
Untracked (Belum dilacak) -> Modified (Telah diedit) -> Staged (Siap dicommit) -> Unmodified (Tersimpan aman)
```

---

<a id="bagian-6"></a>

# 6. 🟢 Menambahkan Perubahan ke Staging Area

## Konsep

Untuk memasukkan perubahan file ke dalam Staging Area:
- **`git add <file>`** : Menambahkan satu file spesifik.
- **`git add .`** : Menambahkan seluruh file baru dan file yang dimodifikasi di direktori saat ini.
- **`git add -p` (Interactive Patch):** Menyeleksi potongan baris kode tertentu (*Hunks*) dari satu file untuk dimasukkan ke staging secara presisi.

## Contoh

```bash
# [1] Tambah File Spesifik
git add index.html style.css

# [2] Tambah Seluruh Perubahan di Folder Proyek
git add .
```

**Hafalan:**

```text
git add filename → memindahkan perubahan file dari Working Tree ke Staging Area
```

---

<a id="bagian-7"></a>

# 7. 🟢 Menyimpan Snapshot Permanen (`git commit -m`) & Mengubah Commit Terakhir (`git commit --amend`)

## Konsep

1. **`git commit -m "pesan"`**:
   - Mengambil seluruh file yang sedang ada di **Staging Area** dan membungkusnya menjadi satu **Snapshot Commit Permanen**.
   - Setiap commit memiliki nomor identitas unik berupa **40-karakter SHA-1 Hash** (misal: `7f8a9b2...`).
2. **`git commit --amend`**:
   - Menggabungkan perubahan baru ke dalam commit terakhir tanpa membuat commit baru (sangat berguna jika ada file yang tertinggal atau pesan typo).

## Contoh

```bash
# [1] Membuat Commit Bersih
git commit -m "feat: tambahkan form registrasi pelanggan dan validasi email"

# [2] Kasus Tertinggal File / Typo Pesan:
git add lupa_dimasukkan.css
git commit --amend -m "feat: tambahkan form registrasi pelanggan lengkap dengan styling"
```

## Output

```text
[main 7f8a9b2] feat: tambahkan form registrasi pelanggan lengkap dengan styling
 2 files changed, 45 insertions(+), 0 deletions(-)
 create mode 100644 index.html
 create mode 100644 lupa_dimasukkan.css
```

**Hafalan:**

```text
git commit -m "pesan" → mengunci staging area menjadi snapshot permanen | git commit --amend → perbaiki commit terakhir
```

---

<a id="bagian-8"></a>

# 8. 🟢 Mengabaikan Berkas dengan `.gitignore` & Menjaga Direktori Kosong dengan `.gitkeep`

## Konsep

1. **Berkas `.gitignore`**:
   - File teks khusus di root proyek yang berisi daftar file, direktori, atau pola ekstensi yang **TIDAK BOLEH dipantau oleh Git** (file konfigurasi kredensial `.env`, folder dependensi raksasa `node_modules/`, `vendor/`, atau file build `dist/`).
2. **Konvensi `.gitkeep`**:
   - Secara default, Git **mengabaikan folder kosong**.
   - Jika Anda ingin menjaga struktur folder kosong di repositori (misal: `storage/logs/`), buat file kosong bernama `.gitkeep` di dalam folder tersebut.

## Contoh Berkas `.gitignore`

```text
# [1] Dependensi & Package Manager
node_modules/
vendor/

# [2] Environment Secrets (JANGAN PERNAH DI-COMMIT!)
.env
.env.local
*.pem

# [3] Build Output & Temporary Cache
dist/
build/
*.log
.DS_Store
```

**Hafalan:**

```text
.gitignore → mencegah file rahasia/sampah masuk ke repo | .gitkeep → menjaga folder kosong tetap terlacak di Git
```

---

<a id="bagian-9"></a>

# 9. 🟡 Memeriksa Riwayat Perubahan: `git log` Visual & Ringkas

## Konsep

Perintah **`git log`** digunakan untuk menelusuri riwayat seluruh commit yang pernah dibuat.

Parameter Visual Populer:
- **`--oneline`** : Menampilkan setiap commit dalam 1 baris ringkas (7-karakter short hash + pesan commit).
- **`--graph`** : Menggambar diagram cabang ASCII pohon percabangan di terminal.
- **`--decorate`** : Menampilkan nama branch dan pointer `HEAD`.
- **`--all`** : Menampilkan seluruh commit dari semua branch (bukan hanya branch aktif).
- **`-n <angka>`** : Membatasi jumlah commit yang ditampilkan.

## Contoh

```bash
git log --oneline --graph --decorate --all -n 5
```

## Output

```text
* 7f8a9b2 (HEAD -> main, origin/main) feat: inisialisasi modul autentikasi
* 3b1c4e5 feat: buat struktur layout dashboard admin
* a8d2f10 chore: setup konfigurasi tailwind dan typescript
* 19e0a81 initial commit
```

**Hafalan:**

```text
git log --oneline --graph --all → visualisasi riwayat commit proyek dalam format grafik ringkas satu baris
```

---

<a id="bagian-10"></a>

# 10. 🟡 Inspeksi Perbedaan Kode Secara Mendalam: `git diff`

## Konsep

Dua Perintah Diff Penting:
1. **`git diff`** : Menampilkan perbedaan antara **Working Tree (kode yang baru diketik) vs Staging Area**.
2. **`git diff --staged` (atau `git diff --cached`)** : Menampilkan perbedaan antara **Staging Area (file yang sudah di-add) vs Commit Terakhir**.

## Output

```diff
diff --git a/app.js b/app.js
index 1234567..89abcdef 100644
--- a/app.js
+++ b/app.js
@@ -10,4 +10,6 @@ function renderNavbar() {
-    console.log("Navbar Lama");
+    console.log("Navbar Baru Modern");
+    initMobileDrawer();
 }
```

**Hafalan:**

```text
git diff (bandingkan working tree vs staging) | git diff --staged (bandingkan staging vs commit terakhir)
```

---

<a id="bagian-11"></a>

# 11. 🟡 Konsep Percabangan (Branching) & Pointer HEAD di Git

## Konsep

**Mengapa Branch di Git Sangat Ringan dan Cepat?**:
- Di VCS lain, membuat branch berarti menyalin seluruh folder proyek (berat dan lambat).
- Di Git, sebuah **Branch hanyalah sebuah pointer (file teks 41-byte)** yang menunjuk ke nomor SHA commit tertentu!
- **Pointer `HEAD`**: Pointer penanda yang memberi tahu Git: *"Di branch/commit mana posisi Anda saat ini?"*.

## Cara Kerja

```text
                  HEAD -> feature/login (Branch Aktif)
                             │
                             ▼
Commit 1 ──> Commit 2 ──> Commit 3
                             ▲
                             │
                            main (Branch Utama)
```

**Hafalan:**

```text
Branch di Git hanyalah sebuah pointer penunjuk commit yang sangat ringan | HEAD adalah pointer lokasi kerja saat ini
```

---

<a id="bagian-12"></a>

# 12. 🟡 Membuat, Melihat, dan Mengganti Branch Modern

## Konsep

Perintah Manajemen Branch Modern (Git 2.23+):
- **`git branch`** : Melihat daftar seluruh branch lokal (tanda `*` menunjukkan branch aktif).
- **`git branch <nama-branch>`** : Membuat branch baru tanpa langsung berpindah.
- **`git switch <nama-branch>`** : Beralih ke branch yang sudah ada (**Rekomendasi Modern menggantikan `git checkout`**).

## Contoh

```bash
# [1] Lihat Daftar Branch
git branch

# [2] Buat Branch Baru
git branch feature/payment

# [3] Beralih ke Branch Tersebut
git switch feature/payment
```

**Hafalan:**

```text
git branch (lihat cabang) | git switch branch_name (beralih ke cabang yang dituju secara aman)
```

---

<a id="bagian-13"></a>

# 13. 🟡 Membuat dan Langsung Beralih ke Branch Baru

## Konsep

Daripada menjalankan dua perintah (`git branch` lalu `git switch`), gunakan shorthand flag **`-c` (Create)**:

**`git switch -c <nama-branch-baru>`**

## Contoh

```bash
# Buat dan langsung beralih ke branch fitur baru
git switch -c feature/user-profile
```

## Output

```text
Switched to a new branch 'feature/user-profile'
```

**Hafalan:**

```text
git switch -c feature/nama-fitur → membuat branch baru dan langsung beralih seketika
```

---

<a id="bagian-14"></a>

# 14. 🟡 Penggabungan Cabang Dasar: Fast-Forward Merge

## Konsep

**Fast-Forward Merge**:
Ketika Anda menggabungkan branch fitur ke branch `main`, dan **tidak ada commit baru di branch `main` semenjak branch fitur dibuat**:
- Git tidak perlu membuat commit gabungan baru (*Merge Commit*).
- Git hanya perlu **menggeser pointer branch `main` maju ke depan** mengikuti commit terakhir branch fitur (*Fast-Forward*).

## Contoh

```bash
# [1] Pindah ke branch tujuan penggabungan (main)
git switch main

# [2] Gabungkan branch fitur ke main
git merge feature/user-profile
```

## Output

```text
Updating 7f8a9b2..3c4d5e6
Fast-forward
 profile.html | 25 +++++++++++++++++++++++++
 1 file changed, 25 insertions(+)
```

**Hafalan:**

```text
git switch main && git merge feature-branch → menggabungkan perubahan branch fitur ke branch utama
```

---

<a id="bagian-15"></a>

# 15. 🟡 Menghapus Branch yang Sudah Selesai Digabung

## Konsep

Setelah branch fitur berhasil digabungkan (*merged*) ke branch utama, branch fitur tersebut sebaiknya dihapus agar daftar branch repositori tetap bersih:
- **`git branch -d <nama-branch>` (Safe Delete):** Menghapus branch hanya jika seluruh commit-nya sudah digabungkan.
- **`git branch -D <nama-branch>` (Force Delete):** Memaksa menghapus branch meskipun commit-nya belum digabungkan.

## Contoh

```bash
git branch -d feature/user-profile
```

**Hafalan:**

```text
git branch -d branch_name (hapus aman branch yang sudah dimerge) | git branch -D branch_name (hapus paksa)
```

---

<a id="bagian-16"></a>

# 16. 🟡 Menghapus & Memindahkan File dari Tracking Git

## Konsep

1. **`git rm <file>`** : Menghapus file dari repositori Git DAN menghapus file fisik di disk.
2. **`git rm --cached <file>` (Sangat Sering Digunakan):**
   - Menghapus file dari tracking Git **tetapi MEMBIARKAN file fisik tetap ada di disk komputer lokal Anda**.
   - Ideal saat Anda tidak sengaja meng-commit file rahasia `.env` dan ingin menghapusnya dari Git tanpa menghapus file di laptop.
3. **`git mv <old_path> <new_path>`** : Mengubah nama atau memindahkan file secara resmi di Git.

## Contoh

```bash
# Hapus .env dari Git tanpa menghapus file asli di disk:
git rm --cached .env
git commit -m "chore: remove .env from git tracking"
```

**Hafalan:**

```text
git rm --cached file_name → menghapus file dari pelacakan Git tanpa menghapus file fisik di disk lokal
```

---

<a id="bagian-17"></a>

# 17. 🔴 Menghubungkan Repositori Lokal ke Remote Server GitHub / GitLab

## Konsep

**Remote Repository**:
Repositori Git yang di-hosting di server cloud (seperti GitHub, GitLab, atau Bitbucket) untuk kolaborasi tim dan backup terpusat.

Perintah Kunci:
- **`git remote add <nama_alias> <url_repo>`** : Menghubungkan repo lokal ke URL remote (konvensi alias default: **`origin`**).
- **`git remote -v`** : Melihat daftar URL remote aktif.

## Contoh

```bash
# Hubungkan ke repositori GitHub Anda
git remote add origin https://github.com/alimur-dev/ecommerce-app.git

# Periksa status remote
git remote -v
```

## Output

```text
origin  https://github.com/alimur-dev/ecommerce-app.git (fetch)
origin  https://github.com/alimur-dev/ecommerce-app.git (push)
```

**Hafalan:**

```text
git remote add origin <url> → menghubungkan repositori lokal ke server cloud GitHub
```

---

<a id="bagian-18"></a>

# 18. 🔴 Mengunggah Kode ke Remote Server

## Konsep

Perintah **`git push <remote> <branch>`** digunakan untuk mengunggah commit lokal Anda ke server cloud remote.

Flag **`-u` (atau `--set-upstream`)**:
Menghubungkan branch lokal dengan branch remote target, sehingga untuk push berikutnya Anda **cukup mengetik `git push` saja tanpa argumen tambahan**.

## Contoh

```bash
# Push Pertama Kali (Gunakan flag -u):
git push -u origin main

# Push Berikutnya di Masa Depan (Cukup singkat):
git push
```

**Hafalan:**

```text
git push -u origin main → mengunggah commit lokal ke branch main di server remote GitHub
```

---

<a id="bagian-19"></a>

# 19. 🔴 Sinkronisasi Remote: `git fetch` vs `git pull`

## Konsep

Perbedaan Krusial yang Wajib Dipahami Developer:

| Perintah | Cara Kerja | Karakteristik |
|---|---|---|
| **`git fetch origin`** | Mengunduh seluruh commit & branch terbaru dari server remote **tanpa mengubah file di working tree lokal Anda**. | **100% Aman:** Memberi kesempatan untuk menginspeksi perubahan sebelum digabungkan. |
| **`git pull origin main`** | Menjalankan **`git fetch`** lalu **langsung otomatis menjalankan `git merge`** ke branch aktif Anda. | Cepat dan praktis, namun bisa memicu merge conflict mendadak jika ada baris bertabrakan. |

## Rumus Baku

```text
git pull = git fetch + git merge FETCH_HEAD
```

**Hafalan:**

```text
git fetch (unduh data remote tanpa ubah kode lokal) | git pull (unduh dan langsung gabungkan otomatis ke kode lokal)
```

---

<a id="bagian-20"></a>

# 20. 🔴 Membatalkan Perubahan Lokal Aman dengan `git restore`

## Konsep

Perintah **`git restore` (Git 2.23+)** adalah cara modern dan aman untuk membatalkan perubahan file lokal tanpa risiko menghapus branch:

1. **`git restore <file>`**:
   - Membatalkan perubahan yang belum di-stage di Working Tree (mengembalikan isi file persis seperti commit terakhir).
2. **`git restore --staged <file>`**:
   - Mengeluarkan file dari Staging Area (*Unstage*) kembali ke Working Tree tanpa merusak isi kode.

## Contoh

```bash
# [1] Salah ketik kode di index.html tapi belum di-add:
git restore index.html

# [2] Tidak sengaja 'git add secret.txt', ingin dibatalkan dari staging:
git restore --staged secret.txt
```

**Hafalan:**

```text
git restore file (batalkan edit di working tree) | git restore --staged file (keluarkan file dari staging area)
```

---

<a id="bagian-21"></a>

# 21. 🛠️ Peta Ingatan Cepat

```text
                       PETA ARSITEKTUR GIT DASAR
                                   │
       ┌───────────────────────────┼───────────────────────────┐
       ▼                           ▼                           ▼
LOCAL THREE-TREE WORKFLOW     BRANCHING & MERGING         REMOTE CLOUD SYNCHRONIZATION
├─ Working Tree (Edit)        ├─ git branch (Pointer)     ├─ git remote add origin
├─ Staging Area (git add)     ├─ git switch -c feature    ├─ git push -u origin main
├─ Repository (git commit)    ├─ git merge (Fast-Forward) ├─ git fetch vs git pull
└─ .gitignore & git restore   └─ git branch -d (Cleanup)  └─ git clone <url>
```

---

<a id="bagian-22"></a>

# 22. 📚 Tabel Ringkasan

| Perintah Git | Kategori | Fungsi & Kegunaan Utama |
|---|---|---|
| `git init` | Setup | Menginisialisasi repositori Git baru di folder lokal |
| `git clone <url>` | Setup | Mengunduh repositori remote lengkap beserta riwayatnya |
| `git config --global`| Config | Mengatur identitas nama, email, dan konfigurasi global |
| `git status -s` | Status | Menampilkan status berkas secara ringkas (`??`, `M `, ` M`) |
| `git add .` | Staging | Memindahkan seluruh perubahan file ke Staging Area |
| `git commit -m` | Snapshot | Menyimpan perubahan di staging menjadi snapshot permanen |
| `git commit --amend`| Snapshot | Memperbaiki pesan atau file pada commit terakhir |
| `git log --oneline` | History | Melihat riwayat commit ringkas satu baris per commit |
| `git diff` | Diff | Memeriksa perubahan kode di working tree vs staging area |
| `git switch -c <name>`| Branching | Membuat branch baru dan langsung beralih seketika |
| `git merge <name>` | Branching | Menggabungkan commit branch target ke branch aktif saat ini |
| `git remote add` | Remote | Menghubungkan repositori lokal ke server remote GitHub |
| `git push -u` | Remote | Mengunggah commit lokal dan menyetel upstream tracking |
| `git pull` | Remote | Mengunduh dan menggabungkan perubahan remote ke lokal |
| `git restore` | Undo | Membatalkan perubahan lokal atau mengeluarkan dari staging |

---

<a id="bagian-23"></a>

# 23. ⚡ Cheat Code Git Dasar 10 Detik

```bash
# [1] Siklus Rutin Harian: Edit -> Add -> Commit -> Push
git add .
git commit -m "feat: tambahkan fitur checkout keranjang"
git push

# [2] Siklus Branching Fitur Baru:
git switch -c feature/checkout
# ... coding & add & commit ...
git switch main
git merge feature/checkout
git branch -d feature/checkout
```

---

<a id="bagian-24"></a>

# 24. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Setup Identitas & Inisialisasi Proyek
├── Konfigurasi user.name, user.email, dan init.defaultBranch main
└── Pahami arsitektur 3 Wilayah Kerja (Working Tree -> Staging -> Repository)
       │
       ▼
Langkah 2: Kuasai Siklus Staging & Commits
├── Lacak status file via git status -s dan tambahkan via git add .
├── Buat snapshot rapi via git commit -m
└── Lindungi file rahasia dengan setup .gitignore sejak awal
       │
       ▼
Langkah 3: Terapkan Branching Modern & Merging
├── Buat branch fitur terisolasi via git switch -c feature/nama
├── Gabungkan kembali ke main via git merge (Fast-Forward)
└── Bersihkan branch selesai via git branch -d
       │
       ▼
Langkah 4: Sinkronisasi ke Cloud (GitHub / GitLab)
├── Hubungkan remote origin dan lakukan git push -u origin main
└── Pahami perbedaan krusial git fetch vs git pull
       │
       ▼
Langkah 5: Siap Melangkah ke Git Lanjutan, Rebase & Resolusi Konflik!
```

---

<a id="bagian-25"></a>

# 25. 🏗️ Mini Project: Production-Ready Full-Cycle Git Workflow Simulation

Simulasi terminal nyata lengkap dari awal sampai akhir: **Inisialisasi repositori, konfigurasi `.gitignore`, commit baseline, pembuatan branch fitur baru, inspeksi diff, fast-forward merge, dan push ke remote GitHub**.

```bash
# =========================================================================
# [1] SETUP PROYEK & INISIALISASI REPOSITORI
# =========================================================================
mkdir portal-berita
cd portal-berita
git init

# =========================================================================
# [2] BUAT .GITIGNORE & BERKAS AWAL
# =========================================================================
cat << 'EOF' > .gitignore
node_modules/
.env
*.log
.DS_Store
EOF

cat << 'EOF' > index.html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Portal Berita Indonesia</title>
</head>
<body>
    <h1>Selamat Datang di Portal Berita</h1>
</body>
</html>
EOF

# =========================================================================
# [3] COMMIT BASELINE PERTAMA DI BRANCH MAIN
# =========================================================================
git add .
git commit -m "chore: inisialisasi struktur proyek dan .gitignore"

# =========================================================================
# [4] BUAT BRANCH FITUR BARU & LAKUKAN PENGEMBANGAN
# =========================================================================
git switch -c feature/berita-populer

cat << 'EOF' >> index.html
    <section id="populer">
        <h2>Berita Populer Hari Ini</h2>
        <article>Teknologi AI Terbaru Membantu Developer Indonesia</article>
    </section>
EOF

# =========================================================================
# [5] INSPEKSI PERUBAHAN & COMMIT FITUR
# =========================================================================
git status -s
git diff
git add index.html
git commit -m "feat(news): tambahkan section berita populer hari ini"

# =========================================================================
# [6] GABUNGKAN BRANCH FITUR KE MAIN (FAST-FORWARD MERGE)
# =========================================================================
git switch main
git merge feature/berita-populer

# Hapus branch fitur yang sudah selesai
git branch -d feature/berita-populer

# =========================================================================
# [7] INSPEKSI RIWAYAT LOG GRAFIS & SINKRONISASI REMOTE GITHUB
# =========================================================================
git log --oneline --graph --decorate

# (Simulasi Push ke Remote GitHub)
# git remote add origin https://github.com/alimur-dev/portal-berita.git
# git push -u origin main
```

## Hasil Output Eksekusi Terminal

```text
Initialized empty Git repository in /Users/alimur/portal-berita/.git/
[main (root-commit) a1b2c3d] chore: inisialisasi struktur proyek dan .gitignore
 2 files changed, 12 insertions(+)
 create mode 100644 .gitignore
 create mode 100644 index.html
Switched to a new branch 'feature/berita-populer'
 M index.html
[feature/berita-populer e4f5a6b] feat(news): tambahkan section berita populer hari ini
 1 file changed, 4 insertions(+)
Switched to branch 'main'
Updating a1b2c3d..e4f5a6b
Fast-forward
 index.html | 4 ++++
 1 file changed, 4 insertions(+)
Deleted branch feature/berita-populer (was e4f5a6b).
* e4f5a6b (HEAD -> main) feat(news): tambahkan section berita populer hari ini
* a1b2c3d chore: inisialisasi struktur proyek dan .gitignore
```

---

<a id="bagian-26"></a>

# 26. 🔗 Referensi Resmi

- [Official Git Documentation](https://git-scm.com/doc)
- [Pro Git Book (Buku Resmi Gratis oleh Scott Chacon & Ben Straub)](https://git-scm.com/book/en/v2)
- [Git Reference Manual](https://git-scm.com/docs)
- [GitHub Documentation: Getting Started with Git](https://docs.github.com/en/get-started)
