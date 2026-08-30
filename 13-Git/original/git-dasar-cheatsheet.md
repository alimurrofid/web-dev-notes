# Git Dasar Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Git 2.40+ untuk pemula yang ingin memahami Version Control System terdistribusi, 3 States (Working Tree, Staging Area, Repository), `git init`, `git clone`, `git config`, `git add`, `git commit`, `git status`, `git diff`, `git log`, Branching (`git branch`, `git switch`), Fast-Forward Merge, Remote GitHub/GitLab (`git remote`, `git push`, `git fetch`, `git pull`), `.gitignore`, dan `.gitkeep`. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> Git adalah sistem kontrol versi terdistribusi (Distributed VCS) yang mencatat riwayat perubahan kode sebagai snapshot permanen, memungkinkan kolaborasi tim tanpa konflik yang merusak kode utama.

## Daftar Isi

1. [Konfigurasi Identitas](#1-konfigurasi-identitas)
2. [Inisialisasi & Kloning](#2-inisialisasi--kloning)
3. [Siklus Status Berkas (Status & Add)](#3-siklus-status-berkas-status--add)
4. [Menyimpan Snapshot (Commit)](#4-menyimpan-snapshot-commit)
5. [Mengabaikan File (.gitignore)](#5-mengabaikan-file-gitignore)
6. [Inspeksi Riwayat & Perbedaan (Log & Diff)](#6-inspeksi-riwayat--perbedaan-log--diff)
7. [Branching & Switch](#7-branching--switch)
8. [Menggabungkan Cabang (Merge)](#8-menggabungkan-cabang-merge)
9. [Remote Repository (Push & Pull)](#9-remote-repository-push--pull)

---

# 1. Konfigurasi Identitas

```bash
git config --global user.name "Alimur Rofid"
git config --global user.email "alimur@dev.com"
git config --global init.defaultBranch main
```

---

# 2. Inisialisasi & Kloning

- `git init` : Membuat repositori Git baru di folder lokal saat ini.
- `git clone <url>` : Mengunduh seluruh repositori remote dari GitHub/GitLab ke komputer lokal.

```bash
git init
git clone https://github.com/user/repo-anda.git
```

---

# 3. Siklus Status Berkas (Status & Add)

- `git status` : Memeriksa status file di Working Tree dan Staging Area.
- `git add <file>` : Memindahkan file dari Working Tree ke Staging Area.
- `git add .` : Memasukkan seluruh perubahan file di direktori saat ini ke Staging Area.

```bash
git status -s
git add index.html style.css
git add .
```

---

# 4. Menyimpan Snapshot (Commit)

- `git commit -m "pesan"` : Menyimpan snapshot permanen dari seluruh file di Staging Area ke repositori.
- `git commit --amend -m "pesan baru"` : Memperbaiki pesan commit terakhir.

```bash
git commit -m "feat: inisialisasi struktur navbar dan homepage"
```

---

# 5. Mengabaikan File (.gitignore)

File `.gitignore` digunakan untuk mengabaikan file/folder rahasia, temporary, atau dependensi:

```text
node_modules/
.env
*.log
dist/
.DS_Store
```

---

# 6. Inspeksi Riwayat & Perbedaan (Log & Diff)

- `git log --oneline --graph` : Melihat riwayat commit secara ringkas dan berbentuk grafik.
- `git diff` : Melihat perbedaan baris kode di Working Tree vs Staging Area.
- `git diff --staged` : Melihat perbedaan baris kode di Staging Area vs Commit terakhir.

```bash
git log --oneline -n 5
git diff
```

---

# 7. Branching & Switch

- `git branch` : Melihat daftar branch lokal.
- `git switch <nama-branch>` : Beralih ke branch yang sudah ada.
- `git switch -c <nama-branch>` : Membuat branch baru dan langsung beralih ke branch tersebut.

```bash
git switch -c feature/login-page
```

---

# 8. Menggabungkan Cabang (Merge)

Menggabungkan commit dari branch fitur ke branch `main`:

```bash
git switch main
git merge feature/login-page
git branch -d feature/login-page
```

---

# 9. Remote Repository (Push & Pull)

- `git remote add origin <url>` : Menghubungkan repo lokal ke server GitHub remote.
- `git push -u origin main` : Mengunggah branch `main` ke remote `origin`.
- `git pull origin main` : Mengambil dan menggabungkan perubahan terbaru dari remote ke lokal.

```bash
git remote add origin https://github.com/user/web-project.git
git push -u origin main
git pull
```
