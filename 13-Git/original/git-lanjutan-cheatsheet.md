# Git Lanjutan & Resolusi Konflik Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Git 2.40+ untuk pemula yang ingin memahami Merge vs Rebase, Interactive Rebase (`git rebase -i`), Resolusi Merge Conflict, Draft Stashing (`git stash`), Time Travel & Undo (`git reset --soft/--mixed/--hard`, `git revert`), Pemindahan Commit (`git cherry-pick`), Penyelamat Commit Hilang (`git reflog`), Debugging Otomatis (`git bisect`), dan Tagging Versi Rilis. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> Git Lanjutan memberikan kontrol presisi terhadap manipulasi riwayat commit, penyelesaian konflik kode saat kolaborasi tim, dan penyelamatan file atau branch yang tidak sengaja terhapus.

## Daftar Isi

1. [Merge vs Rebase](#1-merge-vs-rebase)
2. [Interactive Rebase (Squash)](#2-interactive-rebase-squash)
3. [Resolusi Merge Conflict](#3-resolusi-merge-conflict)
4. [Menyimpan Draft (git stash)](#4-menyimpan-draft-git-stash)
5. [Undo Aman dengan git revert](#5-undo-aman-dengan-git-revert)
6. [Time Travel dengan git reset](#6-time-travel-dengan-git-reset)
7. [Pindah Commit (git cherry-pick)](#7-pindah-commit-git-cherry-pick)
8. [Penyelamat Hilang (git reflog)](#8-penyelamat-hilang-git-reflog)
9. [Debugging Bug (git bisect) & Tagging](#9-debugging-bug-git-bisect--tagging)

---

# 1. Merge vs Rebase

- `git merge feature` : Menggabungkan branch dengan membuat 1 *Merge Commit* baru (mempertahankan riwayat bercabang).
- `git rebase main` : Memindahkan titik pangkal branch fitur ke ujung commit `main` (menghasilkan riwayat lurus / *Linear History*).

```bash
git switch feature
git rebase main
```

---

# 2. Interactive Rebase (Squash)

Menggabungkan 3 commit terakhir menjadi 1 commit rapi:

```bash
git rebase -i HEAD~3
```

Di text editor:
```text
pick 7f8a9b2 feat: tambah tabel database
squash 3b1c4e5 fix: perbaiki typo kolom
squash a8d2f10 style: rapikan spasi
```

---

# 3. Resolusi Merge Conflict

Jika terjadi konflik saat merge/rebase:

```text
<<<<<<< HEAD
const API_URL = "https://api.v2.perusahaan.com";
=======
const API_URL = "https://api.prod.perusahaan.com";
>>>>>>> feature/new-api
```

Langkah:
1. Edit file dan hapus marker `<<<<<<<`, `=======`, `>>>>>>>`.
2. Jalankan `git add <file>`.
3. Jalankan `git merge --continue` atau `git rebase --continue`.
4. Jika ingin membatalkan: `git merge --abort` atau `git rebase --abort`.

---

# 4. Menyimpan Draft (git stash)

- `git stash push -m "pesan"` : Menyimpan draft perubahan lokal ke memory stash.
- `git stash pop` : Mengembalikan draft terakhir dan menghapusnya dari stash.
- `git stash list` : Melihat daftar draft yang tersimpan.

```bash
git stash push -m "wip: fitur keranjang belum selesai"
git switch main
git switch feature/keranjang
git stash pop
```

---

# 5. Undo Aman dengan git revert

Membatalkan commit di branch publik tanpa merusak riwayat masa lalu (membuat commit pembalik baru):

```bash
git revert 7f8a9b2
```

---

# 6. Time Travel dengan git reset

- `git reset --soft HEAD~1` : Batalkan commit, simpan perubahan di **Staging Area**.
- `git reset --mixed HEAD~1` : Batalkan commit, simpan perubahan di **Working Tree** (Default).
- `git reset --hard HEAD~1` : **HAPUS TOTAL** commit dan seluruh perubahan file fisik di disk.

```bash
git reset --soft HEAD~1
```

---

# 7. Pindah Commit (git cherry-pick)

Mengambil 1 commit spesifik dari branch lain ke branch aktif:

```bash
git cherry-pick 3b1c4e5
```

---

# 8. Penyelamat Hilang (git reflog)

Melihat setiap pergerakan pointer `HEAD` untuk memulihkan commit/branch yang terhapus akibat `reset --hard`:

```bash
git reflog
git branch recovered-branch HEAD@{2}
```

---

# 9. Debugging Bug (git bisect) & Tagging

1. **Git Bisect:**
```bash
git bisect start
git bisect bad                 # Commit saat ini ada bug
git bisect good 19e0a81        # Commit masa lalu yang masih aman
# Git otomatis menguji commit tengah (Binary Search)
git bisect reset
```

2. **Git Tagging Versi Rilis:**
```bash
git tag -a v1.0.0 -m "Release Version 1.0.0"
git push origin --tags
```
