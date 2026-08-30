# Git Workflow & Kolaborasi Tim Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Git 2.40+ untuk pemula yang ingin memahami Branching Models (Git Flow, GitHub Flow, Trunk-Based), Conventional Commits, Semantic Versioning (SemVer), Pull Request / Code Review, Forking Workflow & Upstream Sync, Git Hooks (Husky), Protected Branches, Git Submodules, Git LFS, dan Forensik Kode (`git blame`). Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> Git Workflow mengatur standar bagaimana tim engineer bekerja sama secara serentak tanpa saling merusak kode, menjaga kualitas codebase melalui Pull Request review, dan mengotomatiskan validasi via Git Hooks.

## Daftar Isi

1. [Branching Models (Git Flow vs GitHub Flow)](#1-branching-models-git-flow-vs-github-flow)
2. [Conventional Commits](#2-conventional-commits)
3. [Semantic Versioning (SemVer)](#3-semantic-versioning-semver)
4. [Pull Request (PR) & Merge Strategies](#4-pull-request-pr--merge-strategies)
5. [Forking Workflow & Upstream Sync](#5-forking-workflow--upstream-sync)
6. [Git Hooks & Husky](#6-git-hooks--husky)
7. [Protected Branches & Branch Rules](#7-protected-branches--branch-rules)
8. [Git Submodules & Git LFS](#8-git-submodules--git-lfs)
9. [Forensik Kode (git blame)](#9-forensik-kode-git-blame)

---

# 1. Branching Models (Git Flow vs GitHub Flow)

- **Git Flow:** `main` (Production) $\leftarrow$ `develop` (Staging) $\leftarrow$ `feature/*`, `release/*`, `hotfix/*`.
- **GitHub Flow:** Sederhana, buat branch langsung dari `main` $\rightarrow$ buat PR $\rightarrow$ review & merge $\rightarrow$ auto deploy ke production.
- **Trunk-Based:** Developer commit sering (1-2x sehari) ke branch `main` dibantu *Feature Flags*.

---

# 2. Conventional Commits

Format standar pesan commit:

```text
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Tipe utama:
- `feat:` Fitur baru untuk pengguna.
- `fix:` Perbaikan bug.
- `chore:` Perubahan build/tooling tanpa mengubah kode aplikasi.
- `refactor:` Restrukturisasi kode tanpa mengubah fungsionalitas.
- `docs:` Perubahan dokumentasi.
- `test:` Menambah atau mengubah unit test.
- `BREAKING CHANGE:` Perubahan yang merusak kompatibilitas mundur.

---

# 3. Semantic Versioning (SemVer)

Format versi: **`MAJOR.MINOR.PATCH`** (Contoh: `v2.4.1`)
- **`MAJOR` (2):** Perubahan dengan Breaking Changes (tidak kompatibel ke belakang).
- **`MINOR` (4):** Menambah fitur baru yang kompatibel ke belakang.
- **`PATCH` (1):** Perbaikan bug kecil (*bugfix*) yang kompatibel ke belakang.

---

# 4. Pull Request (PR) & Merge Strategies

Strategi Penggabungan di GitHub:
1. **Create a Merge Commit:** Mempertahankan riwayat seluruh commit individu + 1 merge commit.
2. **Squash and Merge:** Menyatukan seluruh commit di PR menjadi 1 commit rapi di `main`.
3. **Rebase and Merge:** Menerapkan commit PR satu per satu di atas `main` secara linear tanpa merge commit.

---

# 5. Forking Workflow & Upstream Sync

Digunakan saat berkontribusi di open source atau antar organisasi:

```bash
# 1. Clone fork Anda
git clone https://github.com/akun-anda/open-source-project.git
cd open-source-project

# 2. Hubungkan ke repositori utama (Upstream)
git remote add upstream https://github.com/organisasi-asli/open-source-project.git

# 3. Sinkronkan fork lokal dengan upstream terbaru
git fetch upstream
git switch main
git merge upstream/main
git push origin main
```

---

# 6. Git Hooks & Husky

Menjalankan validasi script otomatis sebelum commit (`pre-commit`) atau saat push (`pre-push`):

```bash
# Setup Husky di proyek Node.js
npx husky-init && npm install
npx husky add .husky/pre-commit "npm run lint && npm test"
```

---

# 7. Protected Branches & Branch Rules

Aturan keamanan branch `main` di GitHub Settings:
- Wajib melalui Pull Request (Disable direct push).
- Wajib minimal 1-2 Reviewer Approval.
- Wajib lolos seluruh status checks CI/CD (GitHub Actions pass).
- Require linear history (Disallow merge commits).

---

# 8. Git Submodules & Git LFS

- **Git Submodule:** Menyematkan repositori Git lain di dalam subfolder proyek.
```bash
git submodule add https://github.com/org/shared-ui-lib.git libs/ui
git submodule update --init --recursive
```
- **Git LFS (Large File Storage):** Menyimpan file binary besar (video, AI weights) di luar database `.git`.
```bash
git lfs install
git lfs track "*.psd"
git lfs track "*.mp4"
```

---

# 9. Forensik Kode (git blame)

Melihat siapa yang menulis setiap baris kode, kapan diubah, dan nomor commit-nya:

```bash
git blame -L 10,25 auth.js
git log -S "generateJwtToken" --oneline
```
