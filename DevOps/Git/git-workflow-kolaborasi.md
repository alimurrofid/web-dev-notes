# Git Workflow & Kolaborasi Tim Cheatsheet Revised

> **Target:** Pemula yang ingin menguasai **Standar Rekayasa Perangkat Lunak & Kolaborasi Tim Skala Enterprise (Branching Strategies *Git Flow vs GitHub Flow vs Trunk-Based*, Standar Pesan *Conventional Commits*, *Semantic Versioning SemVer 2.0.0*, Siklus Hidup *Pull Request (PR) & Code Review Best Practices*, Strategi Merge *Create Merge Commit vs Squash and Merge vs Rebase and Merge*, *Forking Workflow & Upstream Sync*, Otomatisasi *Git Hooks Native & Husky / lint-staged / commitlint*, Keamanan *GitHub Protected Branches & Rule Sets*, Manajemen Multi-Repo *Git Submodules*, Penyimpanan Aset Biner *Git LFS*, serta Forensik Kode *`git blame` & `git log -S`*)** menggunakan **Git 2.40+**.
>
> Fokus cheatsheet ini: **mental model Enterprise Team Collaboration → Git Flow vs GitHub Flow vs Trunk-Based → Conventional Commits Specification → SemVer Versioning (MAJOR.MINOR.PATCH) → PR Lifecycle & Review Guidelines → Merge Strategies Matrix → Forking & Upstream Synchronization → Git Hooks Automation (Husky + lint-staged) → Commit Linting Validation → Branch Protection Rules → Multi-Repository Git Submodules → Git LFS Large Binary Storage → Audit Forensik Kode (`git blame`, `git log -S`) → mini project Enterprise Team Git Workflow Simulation**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: Model Branching (Git Flow / GitHub Flow / Trunk-Based), Conventional Commits, dan SemVer 2.0.0

🟡 Lanjutan
→ pelajari setelah konvensi lancar: Pull Request Lifecycle, Strategi Merge (Squash vs Rebase), Code Review, dan Forking Workflow

🔴 Advanced / Operasional
→ penting untuk arsitektur tim enterprise: Git Hooks & Husky, commitlint, Protected Branches, Git Submodules, Git LFS, dan git blame
```

Mental model perbandingan alur 3 Model Percabangan (*Branching Strategies*):

```text
                               1. GIT FLOW (Terstruktur Rilis Terjadwal)
        main:    ─── V1.0 ───────────────────────────────────────── V2.0 ───
                      \                                             /
        develop: ──────*───────*────────*────────*────────*────────*────────
                        \     /          \      /
        feature:         └───┘            └────┘
                                   │
                                   ▼
                               2. GITHUB FLOW (Agile & Continuous Deployment)
        main:    ───────*───────────────*───────────────*───────────────*───
                         \             / (PR Merge)      \             /
        feature:          └─ Commit ──┘                   └─ Commit ──┘
                                   │
                                   ▼
                               3. TRUNK-BASED (DevOps Modern + Feature Flags)
        main (Trunk): ──*──*──*──*──*──*──*──*──*──*──*──*──*──*──*──*──*───
                        (Developer commit harian dengan branch pendek < 1 hari)
```

**Hafalan:**

```text
Git Flow             → model percabangan formal dengan branch main, develop, feature, release, dan hotfix
GitHub Flow          → model percabangan gesit berbasis main branch dan Pull Request langsung untuk Continuous Deployment
Trunk-Based          → strategi integrasi sering langsung ke branch utama (trunk) dibantu sistem Feature Flags
Conventional Commits → standar baku format penulisan pesan commit (type(scope): description) yang mudah dibaca mesin
SemVer 2.0.0         → format versi software MAJOR.MINOR.PATCH penanda breaking changes, fitur baru, atau bugfix
Pull Request (PR)    → mekanisme peninjauan dan pengujian kode oleh rekan tim sebelum digabungkan ke branch utama
Squash and Merge     → strategi penggabungan yang menyatukan seluruh commit di PR menjadi 1 commit rapi di branch utama
Forking Workflow     → model kolaborasi open source di mana developer bekerja pada salinan repo milik sendiri di GitHub
Git Hooks            → skrip otomatis yang dipicu pada event siklus Git (pre-commit, commit-msg, pre-push)
Husky & lint-staged  → tooling otomatisasi Git Hooks di ekosistem modern untuk menjalankan linter dan test sebelum commit
Protected Branches   → aturan keamanan repositori yang memblokir direct push ke main dan mewajibkan approval PR
Git Submodule        → integrasi repositori Git eksternal sebagai sub-folder independen di dalam repositori utama
Git LFS              → ekstensi Git untuk menyimpan file biner raksasa (video, model AI) di server storage terpisah
git blame            → utilitas forensik untuk melihat nama penulis, tanggal, dan hash commit pada setiap baris kode
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Git Workflow & Mental Model Kolaborasi Tim Modern](#bagian-1)
2. [Branching Strategy 1: Git Flow](#bagian-2)
3. [Branching Strategy 2: GitHub Flow](#bagian-3)
4. [Branching Strategy 3: Trunk-Based Development](#bagian-4)
5. [Standar Format Pesan Commit: Conventional Commits](#bagian-5)
6. [Breaking Changes & Semantic Commit Scope](#bagian-6)
7. [Semantic Versioning (SemVer 2.0.0)](#bagian-7)

### 🟡 Lanjutan

8. [Siklus Hidup Pull Request (PR) & Merge Request (MR)](#bagian-8)
9. [Strategi Penggabungan PR: Create a Merge Commit vs Squash vs Rebase](#bagian-9)
10. [Etika & Best Practice Code Review untuk Software Engineer](#bagian-10)
11. [Menghubungkan Commit dengan Issues & Auto-Closing Keywords](#bagian-11)
12. [Model Kolaborasi Forking Workflow untuk Proyek Open Source](#bagian-12)
13. [Mengelola Remote Upstream & Sinkronisasi Fork](#bagian-13)

### 🔴 Advanced / Operasional

14. [Git Hooks Native: Otomatisasi Skrip di Direktori `.git/hooks/`](#bagian-14)
15. [Otomatisasi Git Hooks Modern dengan Husky & lint-staged](#bagian-15)
16. [Menjaga Standar Format Commit dengan `commitlint`](#bagian-16)
17. [Mengamankan Cabang Kritis: GitHub Protected Branches & Rule Sets](#bagian-17)
18. [Mengelola Proyek Multi-Repositori dengan `git submodule`](#bagian-18)
19. [Mengelola File Binary Raksasa dengan Git LFS (Large File Storage)](#bagian-19)
20. [Audit Keamanan & Investigasi Pembuat Baris Kode: `git blame` dan `git log -S`](#bagian-20)

### 🛠️ Referensi & Praktik

21. [Peta Ingatan Cepat](#bagian-21)
22. [Tabel Ringkasan](#bagian-22)
23. [Cheat Code Git Workflow & Kolaborasi 10 Detik](#bagian-23)
24. [Urutan Belajar yang Disarankan](#bagian-24)
25. [Mini Project: Production-Ready Enterprise Team Git Workflow Simulation](#bagian-25)
26. [Referensi Resmi](#bagian-26)

---

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan Git Workflow & Mental Model Kolaborasi Tim Modern

## Konsep

Ketika puluhan hingga ratusan software engineer bekerja pada satu repositori aplikasi:
- Tanpa aturan workflow: Semua orang push langsung ke `main`, kode sering rusak di production, dan riwayat commit menjadi berantakan (*Spaghetti History*).
- **Dengan Git Workflow Terstandar:**
  1. Setiap fitur baru dikerjakan di branch terisolasi.
  2. Kualitas kode diverifikasi otomatis via CI/CD and Git Hooks sebelum commit/push.
  3. Kode wajib ditinjau (*Code Review*) via Pull Request sebelum digabungkan.

**Hafalan:**

```text
Git Workflow → seperangkat aturan baku percabangan, format commit, dan review untuk menjaga stabilitas codebase tim
```

---

<a id="bagian-2"></a>

# 2. 🟢 Branching Strategy 1: Git Flow

## Konsep

**Git Flow (Vincent Driessen Model)**:
Model percabangan formal yang sangat cocok untuk aplikasi dengan **Jadwal Rilis Terencana (Scheduled Release Cycles)** (misal: rilis versi sebulan sekali).

5 Cabang Utama:
1. **`main`** : Berisi kode produksi yang stabil 100% dan selalu diberi tag rilis (`v1.0.0`).
2. **`develop`** : Branch integrasi utama seluruh fitur baru.
3. **`feature/*`** : Dibuat dari `develop` untuk membuat fitur baru, dimerge kembali ke `develop`.
4. **`release/*`** : Dibuat dari `develop` saat mendekati tanggal rilis untuk bugfix minor & bump version, lalu dimerge ke `main` DAN `develop`.
5. **`hotfix/*`** : Dibuat langsung dari `main` untuk menambal bug darurat di server production, lalu dimerge ke `main` DAN `develop`.

**Hafalan:**

```text
Git Flow -> main (prod) | develop (staging) | feature/* (fitur) | release/* (persiapan rilis) | hotfix/* (bug darurat)
```

---

<a id="bagian-3"></a>

# 3. 🟢 Branching Strategy 2: GitHub Flow

## Konsep

**GitHub Flow (Rekomendasi Startup & SaaS Modern)**:
Model percabangan yang sangat ringan, gesit, dan ideal untuk **Continuous Deployment (Deploy berkali-kali setiap hari)**.

Prinsip Inti:
1. Segala sesuatu yang ada di branch **`main` selalu siap dideploy**.
2. Buat branch baru dari `main` dengan nama deskriptif (`feature/login`, `fix/header`).
3. Kirim Pull Request (PR) secara berkala untuk diskusi dan code review.
4. Setelah PR di-approve dan lulus tes CI, **merge ke `main` dan langsung otomatis deploy ke server**.

**Hafalan:**

```text
GitHub Flow → branch dari main -> buka Pull Request -> review & test -> merge ke main -> auto deploy
```

---

<a id="bagian-4"></a>

# 4. 🟢 Branching Strategy 3: Trunk-Based Development

## Konsep

**Trunk-Based Development (Standar Tim DevOps & Big Tech: Google / Meta)**:
- Developer menggabungkan perubahan kecil (*Small Batches*) langsung ke satu branch utama (**`trunk` / `main`**) **setiap hari (1–2x per hari)**.
- Umur branch fitur sangat pendek (maksimal beberapa jam hingga 1 hari).
- **Bagaimana jika fitur belum selesai 100%?**
  Menggunakan **Feature Flags (Toggles)** di dalam kode aplikasi agar fitur baru tetap tersembunyi dari pengguna hingga siap diaktifkan.

**Hafalan:**

```text
Trunk-Based Development → branch pendek berumur < 1 hari yang sering dimerge ke main dibantu Feature Flags
```

---

<a id="bagian-5"></a>

# 5. 🟢 Standar Format Pesan Commit: Conventional Commits

## Konsep

**Conventional Commits Specification (v1.0.0)**:
Format baku penulisan pesan commit terstruktur yang mudah dibaca oleh manusia dan dapat diproses otomatis oleh mesin untuk men-generate Changelog & SemVer.

Format Baku:
```text
<type>(<scope opsional>): <description ringkas>

[body penjelasan opsional]

[footer referensi issue opsional]
```

Daftar Tipe Standar Industri:
- **`feat:`** Menambahkan fitur baru bagi pengguna.
- **`fix:`** Memperbaiki bug pada aplikasi.
- **`chore:`** Perubahan konfigurasi tooling, build script, atau update dependencies tanpa mengubah kode aplikasi.
- **`refactor:`** Mengubah struktur kode tanpa mengubah fungsi atau memperbaiki bug.
- **`docs:`** Menambah atau memperbarui dokumentasi.
- **`style:`** Perubahan format kode (spasi, titik koma) tanpa memengaruhi logika kode.
- **`test:`** Menambahkan atau memperbaiki unit/integration tests.
- **`perf:`** Optimasi performa kode.

## Contoh

```bash
git commit -m "feat(auth): tambahkan verifikasi 2FA via SMS OTP"
git commit -m "fix(payment): cegah transaksi ganda saat koneksi timeout"
git commit -m "chore(deps): update dependency axios ke versi 1.6.0"
```

**Hafalan:**

```text
feat: (fitur baru) | fix: (perbaikan bug) | chore: (tooling/deps) | refactor: (restrukturisasi) | docs: (dokumentasi)
```

---

<a id="bagian-6"></a>

# 6. 🟢 Breaking Changes & Semantic Commit Scope

## Konsep

Jika sebuah commit memperkenalkan perubahan yang merusak kompatibilitas mundur (*Breaking Changes*):
1. Tambahkan tanda seru **`!`** setelah tipe/scope: `feat(api)!: ganti format response JSON`.
2. Cantumkan footer **`BREAKING CHANGE: <penjelasan>`** di bagian bawah pesan commit.

## Contoh

```bash
git commit -m "feat(api)!: ubah endpoint /v1/users menjadi /v2/customers

BREAKING CHANGE: Parameter user_id kini wajib dikirim sebagai UUID string bukan integer."
```

**Hafalan:**

```text
type(scope)!: deskripsi -> tanda seru (!) menandai adanya Breaking Change yang memicu kenaikan versi MAJOR
```

---

<a id="bagian-7"></a>

# 7. 🟢 Semantic Versioning (SemVer 2.0.0)

## Konsep

Sistem penomoran rilis resmi perangkat lunak menggunakan format 3 digit:

**`MAJOR . MINOR . PATCH`** (Contoh: `v2.4.1`)

Kaidah Penaikan Angka:
1. **`MAJOR` (2 $\rightarrow$ 3):** Naik ketika Anda merilis API yang memiliki **Breaking Changes** (tidak kompatibel ke belakang).
2. **`MINOR` (4 $\rightarrow$ 5):** Naik ketika Anda menambahkan **Fitur Baru (`feat:`)** yang tetap kompatibel ke belakang.
3. **`PATCH` (1 $\rightarrow$ 2):** Naik ketika Anda merilis **Perbaikan Bug (`fix:`)** yang tetap kompatibel ke belakang.

**Hafalan:**

```text
MAJOR (Breaking Changes) . MINOR (Fitur Baru Kompatibel) . PATCH (Perbaikan Bug Kompatibel)
```

---

<a id="bagian-8"></a>

# 8. 🟡 Siklus Hidup Pull Request (PR) & Merge Request (MR)

## Konsep

**Pull Request (GitHub) / Merge Request (GitLab)**:
Mekanisme resmi bagi developer untuk meminta tim meninjau (*Review*), mendiskusikan, dan menguji kode di branch fitur sebelum digabungkan ke `main`.

Tahapan Siklus Hidup PR:
```text
1. Buka Draft/WIP PR ──> 2. Automated CI Checks Lolos (Tests & Linters)
                                    │
                                    ▼
4. Merged & Auto-Deployed <── 3. Code Review & Approval oleh Reviewer
```

**Hafalan:**

```text
Pull Request = gerbang pengujian otomatis dan review manual rekan tim sebelum kode diizinkan masuk ke branch utama
```

---

<a id="bagian-9"></a>

# 9. 🟡 Strategi Penggabungan PR: Create a Merge Commit vs Squash vs Rebase

## Konsep

Saat tombol merge ditekan di GitHub, ada 3 pilihan strategi:

| Opsi Merge di GitHub | Cara Kerja | Karakteristik Riwayat |
|---|---|---|
| **1. Create a Merge Commit** | Menggabungkan seluruh commit individu branch fitur + 1 Merge Commit. | Riwayat bercabang asli dipertahankan. |
| **2. Squash and Merge (Favorit Industri)** | **Menyatukan 10 commit berantakan di PR menjadi 1 commit bersih** di `main`. | **Riwayat `main` sangat bersih dan mudah di-revert**. |
| **3. Rebase and Merge** | Memutar ulang commit satu per satu di atas `main` tanpa merge commit. | Riwayat linear, tetapi setiap commit individu tetap terpisah. |

**Hafalan:**

```text
Squash and Merge → menggabungkan seluruh commit di PR menjadi 1 commit rapi di branch utama (Best Practice SaaS)
```

---

<a id="bagian-10"></a>

# 10. 🟡 Etika & Best Practice Code Review untuk Software Engineer

## Konsep

Panduan Memberikan Feedback Review Berkualitas:
1. **Fokus pada Kode, Bukan Pribadi:** Katakan *"Fungsi ini berisiko memory leak..."*, bukan *"Kamu membuat kode lambat"*.
2. **Gunakan Prefix Konvensi:**
   - **`[blocking]` / `[must-fix]`** : Bug fatal atau celah keamanan yang wajib diperbaiki sebelum PR di-merge.
   - **`[nitpick]` / `[nit]`** : Saran perbaikan kecil (format penamaan, spasi) yang opsional dan tidak menahan merge.
   - **`[praise]`** : Pujian untuk solusi kode yang sangat elegan.
3. **Jelaskan Alasan (*Why*):** Sertakan alasan mengapa saran Anda lebih baik (link dokumentasi atau potensi bug).

**Hafalan:**

```text
Code Review Etiquette → kritik kode bukan personal; pisahkan saran wajib [blocking] dengan saran opsional [nitpick]
```

---

<a id="bagian-11"></a>

# 11. 🟡 Menghubungkan Commit dengan Issues & Auto-Closing Keywords

## Konsep

GitHub dan GitLab otomatis menutup Issue pelacakan bug ketika PR digabungkan jika Anda menuliskan **Closing Keywords** di dalam deskripsi commit atau PR:

Keywords Resmi:
- **`Fixes #123`**
- **`Closes #456`**
- **`Resolves #789`**

## Contoh

```bash
git commit -m "fix(cart): perbaiki perhitungan pajak diskon ganda

Closes #104"
```

**Hafalan:**

```text
Fixes #id | Closes #id | Resolves #id → otomatis menutup tiket issue GitHub ketika commit/PR berhasil di-merge
```

---

<a id="bagian-12"></a>

# 12. 🟡 Model Kolaborasi Forking Workflow untuk Proyek Open Source

## Konsep

Pada proyek publik atau Open Source, developer luar **TIDAK memiliki hak akses langsung (*Write Permission*)** ke repositori utama.

**Forking Workflow**:
1. Developer membuat salinan repositori (*Fork*) ke akun GitHub pribadinya.
2. Melakukan clone dan pengembangan di branch lokal repo hasil fork.
3. Melakukan push ke repo fork pribadi miliknya (`origin`).
4. Mengirimkan Pull Request lintas repositori dari fork pribadi ke repositori utama (*Upstream*).

**Hafalan:**

```text
Fork (Salin repo ke akun sendiri) -> Edit & Push ke fork -> Buka Pull Request ke repo asli (Upstream)
```

---

<a id="bagian-13"></a>

# 13. 🟡 Mengelola Remote Upstream & Sinkronisasi Fork

## Konsep

Agar repositori fork Anda di laptop tidak ketinggalan dengan perubahan terbaru di repositori utama (*Upstream*):

Atur remote kedua bernama **`upstream`**.

## Contoh

```bash
# [1] Daftarkan Repositori Utama Asli sebagai 'upstream'
git remote add upstream https://github.com/perusahaan/framework-core.git

# [2] Periksa Daftar Remote (Sekarang ada origin dan upstream)
git remote -v

# [3] Sinkronkan Branch main Lokal dengan upstream Terbaru
git fetch upstream
git switch main
git merge upstream/main

# [4] Unggah Hasil Sinkronisasi ke Fork GitHub Pribadi
git push origin main
```

**Hafalan:**

```text
git remote add upstream <url> && git fetch upstream && git merge upstream/main → menyinkronkan repo fork
```

---

<a id="bagian-14"></a>

# 14. 🔴 Git Hooks Native: Otomatisasi Skrip di Direktori `.git/hooks/`

## Konsep

**Git Hooks**:
Skrip bash yang dieksekusi otomatis oleh Git saat terjadi aksi tertentu di komputer lokal Anda:
- **`pre-commit`** : Berjalan sebelum commit disimpan (ideal untuk linter & formatting). Jika script exit code $\neq 0$, commit dibatalkan!
- **`commit-msg`** : Berjalan untuk memvalidasi format teks pesan commit.
- **`pre-push`** : Berjalan sebelum perintah push dieksekusi (ideal untuk unit test).

**Hafalan:**

```text
.git/hooks/pre-commit → skrip otomatis lokal pencegah commit kode error atau belum lulus linter
```

---

<a id="bagian-15"></a>

# 15. 🔴 Otomatisasi Git Hooks Modern dengan Husky & lint-staged

## Konsep

Folder `.git/hooks/` tidak ikut ter-commit ke GitHub, sehingga sulit dibagikan ke rekan tim.

**Solusi Modern: Husky + lint-staged**:
- **Husky:** Mengelola Git Hooks secara otomatis di dalam folder `.husky/` yang ikut ter-commit di repositori.
- **lint-staged:** Menjalankan linter/formatter **HANYA pada file yang sedang ada di Staging Area** (sehingga proses commit tetap super cepat dalam hitungan detik).

## Contoh Setup di Proyek

```bash
# [1] Inisialisasi Husky
npx husky init

# [2] Tambahkan Hook pre-commit untuk Menjalankan lint-staged
echo "npx lint-staged" > .husky/pre-commit
```

Di `package.json`:
```json
"lint-staged": {
  "*.{js,ts,vue}": [
    "eslint --fix",
    "prettier --write"
  ]
}
```

**Hafalan:**

```text
Husky + lint-staged → otomatis memformat dan mengecek error file staging sebelum commit diizinkan tersimpan
```

---

<a id="bagian-16"></a>

# 16. 🔴 Menjaga Standar Format Commit dengan `commitlint`

## Konsep

**`commitlint`**:
Tool yang memeriksa pesan commit Anda terhadap aturan Conventional Commits. Jika pesan commit tidak sesuai (misal: hanya menulis `"update"`, `"fix bug"`, atau `"coba coba"`), **commit otomatis DITOLAK seketika**.

## Contoh Setup

```bash
# [1] Pasang commitlint
npm install --save-dev @commitlint/config-conventional @commitlint/cli

# [2] Buat Konfigurasi
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js

# [3] Pasang Hook commit-msg di Husky
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

## Output Ketika Pesan Salah

```text
⧗   input: update navbar
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
✖   found 2 errors, 0 warnings
husky - commit-msg script failed (code 1)
```

**Hafalan:**

```text
commitlint → memblokir pesan commit yang tidak mematuhi standar Conventional Commits
```

---

<a id="bagian-17"></a>

# 17. 🔴 Mengamankan Cabang Kritis: GitHub Protected Branches & Rule Sets

## Konsep

**Branch Protection Rules (GitHub Repository Settings)**:
Aturan keamanan wajib untuk branch `main` di lingkungan tim produksi:
1. **Require a pull request before merging:** Memblokir seluruh perintah `git push origin main` langsung dari terminal!
2. **Require approvals (1–2 reviewers):** PR tidak bisa di-merge tanpa persetujuan rekan senior.
3. **Require status checks to pass:** PR hanya bisa di-merge jika pipeline GitHub Actions (Build & Test) berstatus hijau (pass).
4. **Require linear history:** Menolak merge commits untuk menjaga riwayat lurus.

**Hafalan:**

```text
Protected Branches → memblokir direct push ke main dan mewajibkan lolos CI/CD serta approval reviewer
```

---

<a id="bagian-18"></a>

# 18. 🔴 Mengelola Proyek Multi-Repositori dengan `git submodule`

## Konsep

**Git Submodule**:
Memungkinkan Anda menyematkan repositori Git lain (misal: Design System UI Component Library atau Shared Core Backend) sebagai sub-folder di dalam repositori utama.

## Contoh

```bash
# [1] Tambahkan Submodule ke Folder 'libs/shared-ui'
git submodule add https://github.com/perusahaan/shared-ui.git libs/shared-ui

# [2] Meng-clone Repositori yang Memiliki Submodule
git clone --recurse-submodules https://github.com/perusahaan/main-app.git

# [3] Memperbarui Submodule yang Sudah Ada di Lokal
git submodule update --init --recursive
```

**Hafalan:**

```text
git submodule add <url> <path> → menyematkan repositori Git eksternal sebagai sub-folder di dalam proyek
```

---

<a id="bagian-19"></a>

# 19. 🔴 Mengelola File Binary Raksasa dengan Git LFS (Large File Storage)

## Konsep

Git standar tidak efisien menyimpan file biner besar (video 4K, model AI `.bin`/`.onnx`, aset grafis `.psd`/`.zip`) karena setiap perubahan kecil akan melipatgandakan ukuran folder `.git`.

**Git LFS**:
- Menggantikan file biner di repositori Git dengan **Pointer Teks Kecil**.
- File biner fisik yang sesungguhnya disimpan di server storage LFS terpisah.

## Contoh

```bash
# [1] Inisialisasi Git LFS
git lfs install

# [2] Daftarkan Pola File yang Akan Dikelola LFS
git lfs track "*.psd"
git lfs track "*.mp4"
git lfs track "models/*.onnx"

# [3] Simpan Konfigurasi Tracking LFS ke Git
git add .gitattributes
git commit -m "chore: track large binary assets with git-lfs"
```

**Hafalan:**

```text
git lfs track "*.ext" → mengelola file biner besar di luar basis data internal .git agar repositori tetap ringan
```

---

<a id="bagian-20"></a>

# 20. 🔴 Audit Keamanan & Investigasi Pembuat Baris Kode: `git blame` dan `git log -S`

## Konsep

Dua Alat Forensik Kode Terpenting:
1. **`git blame <file>`** : Menampilkan siapa yang menulis setiap baris kode, kapan diubah, dan hash commit-nya (sangat berguna untuk investigasi bug warisan).
2. **`git log -S "nama_fungsi"` (Pickaxe Search):** Mencari commit mana dalam sejarah proyek yang **pertama kali menambahkan atau menghapus kata kunci tertentu**.

## Contoh

```bash
# [1] Periksa Siapa yang Mengubah Baris 15 sampai 30 di auth.js
git blame -L 15,30 src/auth.js

# [2] Cari Kapan Fungsi 'calculateTaxDiscount' Pernah Ditambahkan ke Proyek
git log -S "calculateTaxDiscount" --oneline
```

**Hafalan:**

```text
git blame -L min,max file (investigasi baris kode) | git log -S "string" (mencari commit pembuat/penghapus kode)
```

---

<a id="bagian-21"></a>

# 21. 🛠️ Peta Ingatan Cepat

```text
                   PETA ARSITEKTUR GIT WORKFLOW & KOLABORASI
                                      │
       ┌──────────────────────────────┼──────────────────────────────┐
       ▼                              ▼                              ▼
BRANCHING & COMMIT CONVENTIONS    PR & FORKING PIPELINE          AUTOMATION & INTEGRITY
├─ Git Flow vs GitHub Flow        ├─ Pull Request Lifecycle      ├─ Git Hooks & Husky
├─ Trunk-Based Development        ├─ Squash vs Rebase Merge      ├─ commitlint Validation
├─ Conventional Commits (feat:)   ├─ Code Review Guidelines      ├─ Protected Branches (main)
└─ SemVer (MAJOR.MINOR.PATCH)     └─ Forking & Upstream Sync     └─ Git Submodule & Git LFS
```

---

<a id="bagian-22"></a>

# 22. 📚 Tabel Ringkasan

| Konsep / Perintah | Kategori | Fungsi & Karakteristik Utama |
|---|---|---|
| `GitHub Flow` | Branching | Model branching agile berbasis PR langsung untuk continuous deployment |
| `Conventional Commits`| Format | Konvensi penulisan commit `type(scope): description` standar industri |
| `SemVer 2.0.0` | Rilis | Penomoran versi resmi `MAJOR.MINOR.PATCH` penanda level perubahan |
| `Squash and Merge` | PR Merge | Menyatukan seluruh commit di PR menjadi 1 commit rapi di `main` |
| `git remote add upstream`| Forking | Menghubungkan repo fork lokal ke repositori utama upstream |
| `Husky` | Tooling | Tool otomatisasi Git Hooks di folder `.husky/` untuk ekosistem Node.js |
| `lint-staged` | Tooling | Menjalankan linter & formatting hanya pada file yang ada di staging |
| `commitlint` | Tooling | Memvalidasi kepatuhan pesan commit terhadap format Conventional Commits |
| `Protected Branch` | Security | Memblokir direct push ke `main` dan mewajibkan review PR serta CI pass |
| `git submodule` | Multi-Repo | Menyematkan repo Git eksternal sebagai sub-folder proyek |
| `git lfs` | Storage | Mengelola file biner raksasa di luar basis data `.git` lokal |
| `git blame` | Forensik | Melacak siapa dan kapan setiap baris file terakhir kali diubah |

---

<a id="bagian-23"></a>

# 23. ⚡ Cheat Code Git Workflow & Kolaborasi 10 Detik

```bash
# [1] Template Pesan Conventional Commit Standar:
git commit -m "feat(checkout): integrasikan pembayaran QRIS dinamis"
git commit -m "fix(auth): cegah token expired saat refresh background"

# [2] Sinkronisasi Fork Upstream Cepat:
git fetch upstream && git merge upstream/main && git push origin main

# [3] Clone Repo Bersama Seluruh Submodule:
git clone --recurse-submodules <url-repo>

# [4] Forensik Pembuat Baris Tertentu:
git blame -L 1,20 config/database.js
```

---

<a id="bagian-24"></a>

# 24. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Terapkan Standar Branching & Conventional Commits
├── Pilih model branching tim (GitHub Flow atau Trunk-Based)
└── Terapkan format pesan commit terstruktur (feat:, fix:, chore:)
       │
       ▼
Langkah 2: Kuasai Kolaborasi Pull Request & Code Review
├── Buka Pull Request terstruktur dan tautkan issue (Closes #123)
├── Terapkan etika code review konstruktif ([blocking], [nitpick])
└── Pilih strategi Squash and Merge untuk riwayat main yang bersih
       │
       ▼
Langkah 3: Kuasai Model Forking & Upstream Sync
├── Fork proyek open source ke akun pribadi
└── Daftarkan remote upstream dan sinkronkan secara berkala
       │
       ▼
Langkah 4: Otomatisasi Standar Tim via Git Hooks & Protection
├── Pasang Husky + lint-staged + commitlint di repositori
├── Aktifkan Protected Branches di GitHub Settings
└── Kelola file biner via Git LFS dan dependensi via Submodules
       │
       ▼
Langkah 5: Selamat! Anda Telah Menguasai Seluruh Ekosistem Git Enterprise!
```

---

<a id="bagian-25"></a>

# 25. 🏗️ Mini Project: Production-Ready Enterprise Team Git Workflow Simulation

Simulasi lengkap skenario kolaborasi tim di terminal: **Setup repositori tim, konfigurasi aturan Git Hooks pre-commit via script bash, pembuatan branch fitur dengan format Conventional Commits, penautan issue, hingga simulasi Pull Request merge**.

```bash
# =========================================================================
# [1] SETUP REPOSITORI UTAMA DENGAN GIT HOOK VALIDASI
# =========================================================================
mkdir enterprise-app
cd enterprise-app
git init

# Buat berkas README & package dummy
cat << 'EOF' > package.json
{
  "name": "enterprise-app",
  "version": "1.0.0",
  "private": true
}
EOF

# =========================================================================
# [2] BUAT NATIVE GIT HOOK PRE-COMMIT UNTUK CEK SYNTAX
# =========================================================================
cat << 'EOF' > .git/hooks/pre-commit
#!/bin/sh
echo "🔍 [Git Hook] Menjalankan validasi syntax sebelum commit..."
# Periksa apakah ada file console.log yang tertinggal di staging
if git diff --cached | grep -q "console.log"; then
    echo "⚠️  [Peringatan] Ditemukan console.log pada staging area!"
fi
exit 0
EOF
chmod +x .git/hooks/pre-commit

git add .
git commit -m "chore: initial project structure and baseline configuration"

# =========================================================================
# [3] SIMULASI FITUR DEVELOPER (CONVENTIONAL COMMITS & CLOSING ISSUE)
# =========================================================================
git switch -c feature/jwt-authentication

cat << 'EOF' > auth.js
function authenticateUser(token) {
    if (!token) throw new Error("Unauthorized");
    return { userId: 101, role: "admin" };
}
module.exports = { authenticateUser };
EOF

git add auth.js
git commit -m "feat(auth): tambahkan modul autentikasi JWT token

Memvalidasi access token pengguna dan mengembalikan payload user.
Closes #42"

# =========================================================================
# [4] SIMULASI SQUASH AND MERGE KE MAIN
# =========================================================================
git switch main
# Simulasi Squash PR Merge di terminal:
git merge --squash feature/jwt-authentication
git commit -m "feat(auth): implementasi autentikasi JWT token (#42)"

# Bersihkan branch fitur yang sudah selesai
git branch -d feature/jwt-authentication

# =========================================================================
# [5] FORENSIK KODE (GIT BLAME)
# =========================================================================
git blame auth.js
```

## Hasil Output Eksekusi Terminal

```text
🔍 [Git Hook] Menjalankan validasi syntax sebelum commit...
[main (root-commit) 1a2b3c4] chore: initial project structure and baseline configuration
 1 file changed, 5 insertions(+)
 create mode 100644 package.json
Switched to a new branch 'feature/jwt-authentication'
🔍 [Git Hook] Menjalankan validasi syntax sebelum commit...
[feature/jwt-authentication 5e6f7a8] feat(auth): tambahkan modul autentikasi JWT token
 1 file changed, 5 insertions(+)
 create mode 100644 auth.js
Switched to branch 'main'
Squash commit -- not updating HEAD
Automatic merge went well; stopped before committing as requested
🔍 [Git Hook] Menjalankan validasi syntax sebelum commit...
[main 9b0c1d2] feat(auth): implementasi autentikasi JWT token (#42)
 1 file changed, 5 insertions(+)
 create mode 100644 auth.js
Deleted branch feature/jwt-authentication (was 5e6f7a8).
9b0c1d2 (Alimur Rofid 2026-08-29) 1) function authenticateUser(token) {
9b0c1d2 (Alimur Rofid 2026-08-29) 2)     if (!token) throw new Error("Unauthorized");
9b0c1d2 (Alimur Rofid 2026-08-29) 3)     return { userId: 101, role: "admin" };
9b0c1d2 (Alimur Rofid 2026-08-29) 4) }
9b0c1d2 (Alimur Rofid 2026-08-29) 5) module.exports = { authenticateUser };
```

---

<a id="bagian-26"></a>

# 26. 🔗 Referensi Resmi

- [Conventional Commits v1.0.0 Specification](https://www.conventionalcommits.org/)
- [Semantic Versioning 2.0.0 Specification](https://semver.org/)
- [GitHub Flow Official Guide](https://docs.github.com/en/get-started/using-github/github-flow)
- [Trunk-Based Development Guide](https://trunkbaseddevelopment.com/)
- [Husky Official Documentation](https://typicode.github.io/husky/)
- [Commitlint Documentation](https://commitlint.js.org/)
- [Git Large File Storage (Git LFS)](https://git-lfs.com/)
