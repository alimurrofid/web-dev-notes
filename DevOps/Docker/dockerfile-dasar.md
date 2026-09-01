# Dockerfile Dasar Cheatsheet Revised

> **Target:** Pemula yang sudah memahami dasar Docker (image, container, CLI `docker run`) dan ingin menguasai penulisan Dockerfile untuk merakit custom Docker Image yang optimal, aman, dan berstandar industri.
>
> Fokus cheatsheet ini: **analogi resep & blueprint → format sintaks → FROM → RUN & layer caching → CMD vs ENTRYPOINT → LABEL & metadata → COPY vs ADD → .dockerignore → EXPOSE & ENV → WORKDIR & USER non-root → ARG vs ENV → VOLUME → HEALTHCHECK → Multi-Stage Build → BuildKit optimization → Registry publishing → mini project**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Kode Dockerfile Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami untuk mulai menulis instruksi dasar: FROM, RUN, CMD, COPY, .dockerignore, EXPOSE, ENV

🟡 Lanjutan
→ pelajari setelah fundamental nyaman: WORKDIR, USER non-root, ARG, VOLUME, ENTRYPOINT, & HEALTHCHECK

🔴 Advanced / Operasional
→ penting untuk optimasi produksi: Multi-Stage Build, BuildKit caching, Docker Hub, & Private Registry
```

Mental model siklus hidup dari Dockerfile hingga Container berjalan:

```text
                 Dockerfile (Naskah Instruksi)
                             │
                             ▼ docker build
             Layered Read-Only Image (Artefak)
                             │
                             ▼ docker run
           Active Running Container (Instance RAM)
```

**Hafalan:**

```text
Dockerfile  → Naskah resep instruksi perakitan image
Image       → Hasil kompilasi/build permanen yang tersusun dari lapisan-lapisan read-only
Container   → Instance hidup yang berjalan di memori dari sebuah image (Writable layer)
Build Context → Direktori file host yang dikirimkan ke Docker Daemon untuk proses build
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Dockerfile & Alur Build Image](#bagian-1)
2. [Format & Struktur Penulisan Dockerfile](#bagian-2)
3. [Instruksi FROM (Base Image & Tagging)](#bagian-3)
4. [Instruksi RUN (Eksekusi Perintah Build & Layer Caching)](#bagian-4)
5. [Instruksi CMD (Default Runtime Command & Exec Form)](#bagian-5)
6. [Instruksi LABEL (Metadata Penulis, Versi, & Deskripsi)](#bagian-6)
7. [Instruksi COPY (Menyalin File dari Build Context)](#bagian-7)
8. [Instruksi ADD (Menyalin dengan Auto-Extract Tar & Remote URL)](#bagian-8)
9. [File .dockerignore (Mengabaikan File Sampah & Mengoptimalkan Build Context)](#bagian-9)
10. [Instruksi EXPOSE (Dokumentasi Port Jaringan Kontainer)](#bagian-10)
11. [Instruksi ENV (Menetapkan Default Environment Variable)](#bagian-11)

### 🟡 Lanjutan

12. [Instruksi WORKDIR (Menentukan Direktori Kerja Default)](#bagian-12)
13. [Instruksi USER (Keamanan Non-Root User Execution)](#bagian-13)
14. [Instruksi ARG (Build-Time Variables & Dynamic Arguments)](#bagian-14)
15. [Instruksi VOLUME (Mendeklarasikan Mount Point Anonim)](#bagian-15)
16. [Instruksi ENTRYPOINT (Executable Utama Kontainer)](#bagian-16)
17. [Perbedaan CMD vs ENTRYPOINT & Pola Kombinasi Terbaik](#bagian-17)
18. [Instruksi HEALTHCHECK (Monitoring Kesehatan Internal Image)](#bagian-18)

### 🔴 Advanced / Operasional

19. [Multi-Stage Build (Mereduksi Ukuran Image Drastis)](#bagian-19)
20. [Docker BuildKit & Optimasi Cache Layer](#bagian-20)
21. [Docker Hub Registry (Tagging & Pushing Image Resmi)](#bagian-21)
22. [Private Container Registry (DigitalOcean & GitHub Packages ghcr.io)](#bagian-22)

### 🛠️ Referensi & Praktik

23. [Peta Ingatan Cepat](#bagian-23)
24. [Tabel Ringkasan](#bagian-24)
25. [Cheat Code Dockerfile 10 Detik](#bagian-25)
26. [Urutan Belajar yang Disarankan](#bagian-26)
27. [Mini Project: Membangun Image Production-Ready Node.js / Go REST API Multi-Stage](#bagian-27)
28. [Referensi Resmi](#bagian-28)

---

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan Dockerfile & Alur Build Image

## Konsep

**Dockerfile** adalah sebuah dokumen teks biasa (tanpa ekstensi file) yang berisi serangkaian instruksi dan perintah baris demi baris yang akan dieksekusi secara otomatis oleh Docker Engine untuk merakit dan membangun sebuah **Docker Image** kustom.

### Analogi Memahami Dockerfile:
- **Dockerfile** = *Resep Masakan / Blueprint Cetak Biru*.
- **Docker Image** = *Kue Jadi / Paket Binari Hasil Build (Read-Only)*.
- **Docker Container** = *Sepotong Kue yang Sedang Dimakan / Instance yang Berjalan di Memori*.

### Alur Eksekusi:
```text
       [ Dockerfile ] ──► docker build ──► [ Docker Image ] ──► docker run ──► [ Container Aktif ]
```

## Contoh

Contoh sebuah Dockerfile sederhana untuk menyajikan file HTML statis menggunakan web server Nginx:

```dockerfile
# 1. Gunakan base image resmi Nginx versi Alpine yang ringan
FROM nginx:alpine

# 2. Salin file HTML lokal ke direktori web root Nginx di dalam image
COPY index.html /usr/share/nginx/html/index.html

# 3. Informasikan bahwa kontainer ini mendengarkan port 80
EXPOSE 80
```

Perintah Build & Run di Terminal:
```bash
# Membangun image dengan nama tag 'my-web:v1.0' dari direktori saat ini (.)
docker build -t my-web:v1.0 .

# Menjalankan kontainer dari image hasil build
docker run -d --name web-app -p 8080:80 my-web:v1.0
```

## Output

Hasil proses `docker build`:
```text
[+] Building 1.2s (7/7) FINISHED
 => [internal] load build definition from Dockerfile
 => [internal] load .dockerignore
 => [internal] load metadata for docker.io/library/nginx:alpine
 => [1/2] FROM docker.io/library/nginx:alpine
 => [2/2] COPY index.html /usr/share/nginx/html/index.html
 => exporting to image
 => => naming to docker.io/library/my-web:v1.0
```

## Cara Kerja

```text
       Developer menulis instruksi di file "Dockerfile"
                              │
                              ▼
       docker build -t my-web:v1.0 .
                              │
       ┌──────────────────────┴──────────────────────┐
       ▼                                             ▼
  Layer 1: Base Nginx (Read-Only)          Layer 2: COPY index.html
       │                                             │
       └──────────────────────┬──────────────────────┘
                              │
                              ▼
       Docker Image Baru Berhasil Terbentuk di Storage Host
```

**Hafalan:**

```text
Dockerfile   → Naskah instruksi langkah perakitan Docker image
docker build -t name:tag path → Perintah mengompilasi Dockerfile menjadi image
Build Context → Folder path (titik '.') yang dikirimkan ke Docker Daemon saat proses build
```

## Best Practice & Kesalahan Umum

- ✅ Beri nama file tepat `Dockerfile` dengan huruf besar 'D' tanpa ekstensi (bukan `Dockerfile.txt` atau `dockerfile.yaml`).
- ❌ Jangan menaruh file-file berukuran gigabyte yang tidak relevan di dalam folder *build context* karena akan memperlambat pengiriman data ke Docker Daemon.

---

<a id="bagian-2"></a>

# 2. 🟢 Format & Struktur Penulisan Dockerfile

## Konsep

Format dasar Dockerfile terdiri dari dua komponen utama: **`INSTRUCTION`** (kata kunci instruksi) dan **`arguments`** (argumen/parameter).

Aturan Sintaks Dockerfile:
1. **Instruksi Tidak Case-Sensitive, TETAPI Wajib Huruf Kapital (Konvensi Resmi):** Selalu tulis instruksi menggunakan huruf kapital penuh (seperti `FROM`, `RUN`, `COPY`, `CMD`) untuk membedakannya secara visual dari argumen perintah.
2. **Komentar:** Baris yang diawali dengan tanda pagar (`#`) dianggap sebagai komentar dan diabaikan oleh parser Docker.
3. **Urutan Instruksi Sangat Penting:** Docker mengeksekusi instruksi dari atas ke bawah secara sekuensial. Setiap instruksi yang memodifikasi sistem file akan menghasilkan satu lapisan (*Layer*) baru.
4. **Instruksi Wajib Pertama:** Baris instruksi bukan-komentar pertama **WAJIB berupa instruksi `FROM`** (kecuali ada deklarasi global `ARG` sebelum FROM).

## Contoh

```dockerfile
# =========================================================================
# Contoh Format Standar Dockerfile
# =========================================================================

# 1. Base Image (Wajib Pertama)
FROM alpine:3.19

# 2. Metadata Pembuat
LABEL maintainer="budi@example.com"
LABEL version="1.0"

# 3. Direktori Kerja
WORKDIR /app

# 4. Instalasi Paket Tambahan
RUN apk add --no-cache curl bash

# 5. Default Runtime Command
CMD ["bash"]
```

## Output

```text
[+] Building 2.1s (8/8) FINISHED
 => [internal] load build definition from Dockerfile
 => [1/4] FROM docker.io/library/alpine:3.19
 => [2/4] WORKDIR /app
 => [3/4] RUN apk add --no-cache curl bash
 => exporting to image
```

## Cara Kerja

```text
         Baris 1: FROM alpine:3.19   ──► Unduh Base OS
                     │
                     ▼
         Baris 2: WORKDIR /app       ──► Buat & Pindah Folder
                     │
                     ▼
         Baris 3: RUN apk add ...    ──► Pasang Binary Paket
                     │
                     ▼
         Baris 4: CMD ["bash"]       ──► Simpan Default Command
```

**Hafalan:**

```text
INSTRUCTION arguments → Format baku baris Dockerfile (Instruksi selalu HURUF BESAR)
# komentar             → Baris dokumentasi yang diabaikan saat build
```

## Best Practice & Kesalahan Umum

- ✅ Tulis instruksi dalam huruf besar (`FROM`, `RUN`, `COPY`) untuk meningkatkan keterbacaan kode (*readability*).
- ❌ Jangan meletakkan instruksi seperti `RUN` atau `COPY` sebelum instruksi `FROM`.

---

<a id="bagian-3"></a>

# 3. 🟢 Instruksi FROM (Base Image & Tagging)

## Konsep

Instruksi **`FROM`** menginisialisasi proses build baru dan menentukan **Base Image** (Fondasi Sistem Operasi / Runtime awal) yang akan digunakan sebagai titik awal penumpukan layer.

Aturan Penting `FROM`:
- Setiap Dockerfile yang valid **wajib memiliki instruksi `FROM`**.
- Base image biasanya ditarik dari Docker Hub (seperti `ubuntu`, `alpine`, `node`, `php`, `golang`, `python`).
- Selalu gunakan **Tag Versi Spesifik** (misal: `FROM node:20-alpine`), hindari menggunakan `node:latest` agar hasil build stabil dan tidak berubah mendadak saat ada rilis versi baru.
- **Image Kosong (`FROM scratch`):** Digunakan untuk aplikasi yang dikompilasi statis (seperti binary Go atau Rust) yang tidak membutuhkan sistem operasi sama sekali (ukuran image bisa sekecil 5MB!).

## Contoh

```dockerfile
# Menggunakan Node.js versi 20 berbasis distribusi Alpine Linux yang ramping
FROM node:20-alpine

# Menampilkan informasi versi runtime saat build
RUN node -v && npm -v
```

## Output

```text
Step 1/2 : FROM node:20-alpine
 ---> 8f2a1b3c4d5e
Step 2/2 : RUN node -v && npm -v
 ---> Running in a1b2c3d4e5f6
v20.12.2
10.5.0
 ---> e9d8c7b6a5f4
Successfully built e9d8c7b6a5f4
```

## Cara Kerja

```text
         Instruksi: FROM node:20-alpine
                       │
                       ▼
         Cari di cache lokal host?
         [Tidak Ada] ──► Tarik Layer resmi dari Docker Hub
                       │
                       ▼
         Jadikan layer fondasi paling dasar bagi instruksi berikutnya
```

**Hafalan:**

```text
FROM <image>[:<tag>] [AS <name>] → Menentukan base image fondasi awal untuk proses build
FROM scratch                    → Base image kosong murni (ukuran 0 byte)
```

## Best Practice & Kesalahan Umum

- ✅ Prioritaskan base image berbasis `alpine` atau `distroless` untuk meminimalkan ukuran image dan mengurangi celah keamanan (*vulnerabilities*).
- ❌ Jangan pernah menggunakan tag `latest` di lingkungan produksi karena dapat merusak kompatibilitas dependensi sewaktu-waktu.

---

<a id="bagian-4"></a>

# 4. 🟢 Instruksi RUN (Eksekusi Perintah Build & Layer Caching)

## Konsep

Instruksi **`RUN`** digunakan untuk mengeksekusi perintah shell (seperti menginstal paket, membuat direktori, mengunduh file, atau mengompilasi kode) **selama proses pembuatan image (*Build-Time*)**.

Hasil dari instruksi `RUN` akan disimpan sebagai lapisan permanen (*Committed Layer*) baru di dalam image.

### 2 Format Penulisan RUN:
1. **Shell Form:** `RUN apt-get update && apt-get install -y curl` (dieksekusi melalui shell `/bin/sh -c`).
2. **Exec Form:** `RUN ["apt-get", "install", "-y", "curl"]`.

### Kunci Optimasi: Penggabungan Perintah (*Chaining with &&*):
Setiap baris instruksi `RUN` menciptakan 1 layer baru. Jika kita menulis 5 baris `RUN` terpisah, ukuran image akan membengkak.
**Best Practice:** Gabungkan perintah instalasi dan pembersihan cache paket dalam **SATU baris `RUN` tunggal** menggunakan operator `&&`.

## Contoh

```dockerfile
FROM alpine:3.19

# CARA TERBAIK: Menggabungkan instalasi paket & pembersihan cache dalam 1 RUN
RUN apk update && \
    apk add --no-cache \
        curl \
        git \
        tzdata && \
    rm -rf /var/cache/apk/*
```

## Output

```text
Step 1/2 : FROM alpine:3.19
 ---> 05455a08881e
Step 2/2 : RUN apk update && apk add --no-cache curl git tzdata && rm -rf /var/cache/apk/*
 ---> Running in d3e4f5a6b7c8
fetch https://dl-cdn.alpinelinux.org/alpine/v3.19/main/x86_64/APKINDEX.tar.gz
(1/5) Installing curl (8.5.0-r0)
(2/5) Installing git (2.43.0-r0)
(3/5) Installing tzdata (2024a-r0)
OK: 28 MiB in 20 packages
Removing intermediate container d3e4f5a6b7c8
 ---> 4a3b2c1d0e9f
Successfully built 4a3b2c1d0e9f
```

## Cara Kerja

```text
         Dockerfile: RUN apk add ...
                         │
                         ▼
         Docker membuat kontainer sementara (intermediate container)
                         │
                         ▼
         Eksekusi perintah di dalam kontainer sementara
                         │
                         ▼
         Simpan perubahan sistem file menjadi Layer Image Baru
                         │
                         ▼
         Hapus kontainer sementara (Hemat RAM)
```

**Hafalan:**

```text
RUN <command> && <command> → Menjalankan perintah di masa BUILD dan menyimpan hasilnya ke layer
--no-cache / rm -rf cache  → Wajib menghapus file installer sementara agar image tetap ramping
```

## Best Practice & Kesalahan Umum

- ✅ Selalu gabungkan `apt-get update && apt-get install -y ... && rm -rf /var/lib/apt/lists/*` dalam satu instruksi `RUN` agar file index apt tidak tertinggal di layer image.
- ❌ Jangan memisahkan `RUN apt-get update` di baris 1 dan `RUN apt-get install` di baris 2, karena layer cache Docker akan menyebabkan instalasi paket gagal mengambil versi terbaru.

---

<a id="bagian-5"></a>

# 5. 🟢 Instruksi CMD (Default Runtime Command & Exec Form)

## Konsep

Instruksi **`CMD`** menentukan perintah default yang akan dieksekusi **saat kontainer pertama kali dinyalakan (*Container Runtime*)**, bukan saat image sedang di-build.

Karakteristik Kunci `CMD`:
- Hanya boleh ada **SATU instruksi `CMD` yang aktif** di dalam sebuah Dockerfile. Jika Anda menulis beberapa `CMD`, hanya `CMD` yang paling terakhir yang akan berlaku.
- Perintah `CMD` **dapat ditimpa (*overridden*) dengan sangat mudah** melalui argumen baris perintah `docker run image [command]`.

### 2 Format Penulisan CMD:
1. **Exec Form (SANGAT DIREKOMENDASIKAN / STANDAR INDUSTRI):**
   `CMD ["executable", "param1", "param2"]`
   *Alasan:* Menjalankan proses secara langsung sebagai **PID 1** tanpa melalui sub-shell, sehingga kontainer dapat menerima sinyal stop (*SIGTERM*) secara instan (*Graceful Shutdown*).
2. **Shell Form (Kurang Disarankan):**
   `CMD node server.js` (proses dijalankan di bawah subshell `/bin/sh -c`, sehingga tidak menerima sinyal SIGTERM langsung).

## Contoh

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY app.js .

# Exec Form: Menjalankan "node app.js" saat kontainer start
CMD ["node", "app.js"]
```

Menjalankan dan Menimpa CMD:
```bash
# 1. Menjalankan default CMD (akan menjalankan "node app.js")
docker run --name my-app my-node-image

# 2. Menimpa CMD saat runtime (menjalankan "node -v" alih-alih "node app.js")
docker run --rm my-node-image node -v
```

## Output

Eksekusi ke-2 (CMD tertimpa):
```text
v20.12.2
```

## Cara Kerja

```text
     Build Time: CMD ["node", "app.js"] ──► Disimpan sebagai metadata "Entrypoint/Cmd"
                                                   │
                                                   ▼
     Runtime (docker run)               ──► Eksekusi proses 'node app.js' sebagai PID 1
```

**Hafalan:**

```text
CMD ["executable", "param1", "param2"] → Menentukan perintah eksekusi default saat kontainer menyala
Overridable                            → Argumen di 'docker run' akan menggantikan perintah CMD
```

## Best Practice & Kesalahan Umum

- ✅ Selalu gunakan format JSON Array (*Exec Form*) dengan tanda kutip ganda (`["node", "server.js"]`), bukan kutip tunggal (`['node']`).
- ❌ Jangan gunakan `CMD` untuk proses kompilasi atau instalasi dependensi (gunakan `RUN` untuk kebutuhan build).

---

<a id="bagian-6"></a>

# 6. 🟢 Instruksi LABEL (Metadata Penulis, Versi, & Deskripsi)

## Konsep

Instruksi **`LABEL`** digunakan untuk menyematkan informasi metadata terstruktur (*key-value pairs*) ke dalam image Docker.

Metadata ini tidak mempengaruhi proses eksekusi kode aplikasi, namun sangat penting untuk:
- Dokumentasi tim (nama maintainer, email, URL dokumentasi).
- Informasi versi aplikasi dan commit hash Git.
- Lisensi perangkat lunak.
- Standar konvensi OCI (*Open Container Initiative Image Format Specification*).

Perintah Melihat Label:
- `docker image inspect --format '{{json .Config.Labels}}' image_name`

## Contoh

```dockerfile
FROM alpine:3.19

# Mendefinisikan metadata resmi berbasis standar OCI
LABEL org.opencontainers.image.title="Aplikasi Inventaris Toko"
LABEL org.opencontainers.image.description="REST API Microservice untuk Manajemen Stok"
LABEL org.opencontainers.image.version="1.4.2"
LABEL org.opencontainers.image.authors="Tim DevOps <devops@toko.com>"
LABEL org.opencontainers.image.licenses="MIT"

CMD ["sh"]
```

## Output

Memeriksa label image via CLI:
```bash
docker inspect --format '{{ json .Config.Labels }}' my-inventory-image
```

```text
{
  "org.opencontainers.image.authors": "Tim DevOps <devops@toko.com>",
  "org.opencontainers.image.description": "REST API Microservice untuk Manajemen Stok",
  "org.opencontainers.image.licenses": "MIT",
  "org.opencontainers.image.title": "Aplikasi Inventaris Toko",
  "org.opencontainers.image.version": "1.4.2"
}
```

## Cara Kerja

```text
         Instruksi: LABEL version="1.0"
                         │
                         ▼
         Docker menyisipkan pasangan Key-Value ke Header Manifest Image
                         │
                         ▼
         Dapat diinspeksi oleh orchestrator (Kubernetes / CI-CD pipeline)
```

**Hafalan:**

```text
LABEL <key>="<value>" → Menyematkan metadata dokumentasi & informasi versi ke dalam image
docker inspect        → Melihat seluruh metadata label yang terpasang pada image
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan namespace standar OCI (`org.opencontainers.image.*`) agar kompatibel dengan scanner keamanan dan tool CI/CD modern.
- ❌ Jangan menyematkan informasi sensitif (seperti password atau private key) di dalam `LABEL` karena metadata ini bersifat publik.

---

<a id="bagian-7"></a>

# 7. 🟢 Instruksi COPY (Menyalin File dari Build Context)

## Konsep

Instruksi **`COPY`** digunakan untuk menyalin file atau folder dari komputer Host (**Build Context**) ke dalam sistem file di dalam Docker Image.

Format Sintaks:
```text
COPY [--chown=<user>:<group>] <source_path_host> <destination_path_image>
```

Fitur Penting `COPY`:
- Mendukung pencocokan pola wildcard (misal: `COPY package*.json ./`).
- Opsi **`--chown=user:group`**: Langsung menetapkan kepemilikan permission user Linux pada file saat disalin (tanpa perlu menjalankan `RUN chown` tambahan yang memboroskan layer!).

## Contoh

```dockerfile
FROM node:20-alpine

WORKDIR /app

# 1. Salin package.json terlebih dahulu untuk memanfaatkan Layer Caching
COPY package.json package-lock.json ./

# 2. Instal dependensi
RUN npm ci --only=production

# 3. Salin seluruh sisa source code aplikasi
COPY --chown=node:node . .

CMD ["node", "src/index.js"]
```

## Output

```text
Step 1/5 : WORKDIR /app
 ---> Using cache
Step 2/5 : COPY package.json package-lock.json ./
 ---> 3b4c5d6e7f8a
Step 3/5 : RUN npm ci --only=production
 ---> Running in b1c2d3e4f5a6
added 52 packages in 1.4s
 ---> 9a8b7c6d5e4f
Step 4/5 : COPY --chown=node:node . .
 ---> 1f2e3d4c5b6a
```

## Cara Kerja

```text
    Folder Laptop Developer (Host)             Sistem File Docker Image
    ┌────────────────────────────┐             ┌────────────────────────────┐
    │ src/index.js               ├─ COPY . . ─►│ /app/src/index.js          │
    │ package.json               │             │ /app/package.json          │
    └────────────────────────────┘             └────────────────────────────┘
```

**Hafalan:**

```text
COPY <src> <dest>                  → Menyalin file/folder lokal ke dalam Docker image
COPY --chown=user:group <src> <dst>→ Menyalin sekaligus menetapkan hak milik user Linux
```

## Best Practice & Kesalahan Umum

- ✅ Pisahkan penyalinan file manifes dependensi (`package.json`, `composer.json`, `go.mod`) sebelum menyalin sisa kode program untuk memaksimalkan **Docker Layer Caching**.
- ❌ Jangan menyalin folder `node_modules` atau `.git` dari lokal host ke dalam image (selalu gunakan file `.dockerignore`).

---

<a id="bagian-8"></a>

# 8. 🟢 Instruksi ADD (Menyalin dengan Auto-Extract Tar & Remote URL)

## Konsep

Instruksi **`ADD`** memiliki fungsi serupa dengan `COPY`, namun dilengkapi dengan dua fitur tambahan khusus:
1. **Ekstraksi Otomatis Arsip Lokal (*Auto-Extraction*):** Jika file sumber adalah arsip terkompresi lokal yang dikenali (seperti `.tar`, `.tar.gz`, `.tgz`, `.tar.bz2`), Docker akan **otomatis mengekstraknya sebagai folder** ke direktori tujuan.
2. **Pengunduhan dari URL Remote:** Dapat mengunduh file langsung dari internet (misal: `ADD https://example.com/app.zip /tmp/`).

### Kapan Menggunakan ADD vs COPY?
- **Gunakan `COPY` (Pilihan Utama 95% Kasus):** Jauh lebih transparan, aman, dan dapat diprediksi.
- **Gunakan `ADD` (Khusus):** HANYA jika Anda sengaja ingin mengekstrak file arsip tarball lokal ke dalam image.

## Contoh

```dockerfile
FROM alpine:3.19

WORKDIR /app

# Contoh 1: Auto-ekstraksi arsip tar lokal (file 'bundle.tar.gz' otomatis diekstrak)
ADD assets-bundle.tar.gz /app/assets/

# Contoh 2: Praktik terbaik untuk file biasa tetap gunakan COPY
COPY package.json .

CMD ["sh"]
```

## Output

```text
Step 1/3 : WORKDIR /app
 ---> Using cache
Step 2/3 : ADD assets-bundle.tar.gz /app/assets/
 ---> 7a8b9c0d1e2f
(Isi file di dalam tar.gz langsung tersebar rapi di folder /app/assets/)
```

## Cara Kerja

```text
    File Lokal: assets-bundle.tar.gz
                     │
                     ▼ (Instruksi ADD)
    Docker Engine otomatis mem-parsing & dekompresi
                     │
                     ▼
    Target Image: /app/assets/ (Folder hasil ekstrak)
```

**Hafalan:**

```text
ADD source.tar.gz /target/ → Menyalin sekaligus otomatis mengekstrak arsip tar lokal
Aturan Emas               → Gunakan COPY sebagai default, gunakan ADD hanya untuk ekstraksi .tar
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan `ADD` khusus untuk menyalin arsip root filesystem (*rootfs.tar.gz*) pada pembuatan base image.
- ❌ Jangan gunakan `ADD` untuk mengunduh paket dari URL internet jika file tersebut berukuran besar, karena file arsip installer akan tersimpan permanen di layer image (lebih baik gunakan `RUN curl ... && tar ... && rm ...`).

---

<a id="bagian-9"></a>

# 9. 🟢 File .dockerignore (Mengabaikan File Sampah & Mengoptimalkan Build Context)

## Konsep

Sebelum Docker CLI memulai proses build, Docker akan mengirimkan seluruh isi folder proyek di Host (**Build Context**) ke Docker Daemon.

File **`.dockerignore`** diletakkan di folder akar proyek untuk memberitahu Docker file dan direktori apa saja yang **HARUS DIABAIKAN dan TIDAK BOLEH DIKIRIMKAN ke Build Context**.

Keuntungan Memakai `.dockerignore`:
1. **Kecepatan Build Naik Drastis:** Menghindari pengiriman ratusan megabyte file sampah ke daemon.
2. **Ukuran Image Lebih Ramping:** Mencegah file temporer masuk ke layer image.
3. **Keamanan Maksimal:** Mencegah file rahasia (seperti `.env`, kredensial AWS, private key SSH) tersalin tanpa sengaja ke dalam image publik.

## Contoh

Contoh isi file `.dockerignore` standar industri:

```text
# 1. Direktori Dependensi Lokal
node_modules
vendor
.venv

# 2. File Rahasia & Kredensial
.env
.env.*
*.pem
*.key
id_rsa

# 3. Kontrol Versi & Editor
.git
.gitignore
.github
.vscode
.idea

# 4. Log & File Sementara
*.log
npm-debug.log*
yarn-debug.log*
.DS_Store
Thumbs.db
coverage
dist
```

## Output

Saat menjalankan `docker build`:
```text
[+] Building 0.1s (2/2) FINISHED
 => [internal] load .dockerignore                                          0.0s
 => => transferring context: 380B                                          0.0s
 => [internal] load build definition from Dockerfile                       0.0s
```

(Perhatikan: transfer build context hanya memakan waktu **0.0 detik (380 Bytes)** karena folder `node_modules` dan `.git` diabaikan!).

## Cara Kerja

```text
         Folder Proyek Host (Berisi node_modules 500MB + .env)
                                 │
                                 ▼
                     Evaluasi .dockerignore
                                 │
                 ┌───────────────┴───────────────┐
                 ▼ [Cocok diabaikan]             ▼ [Lolos filter]
           node_modules, .git, .env        src/, package.json
                 │                               │
                 ▼ (Dibuang)                     ▼
           [ TIDAK DIKIRIM ]          Kirim ke Docker Daemon (380KB)
```

**Hafalan:**

```text
.dockerignore → File penyaring untuk mencegah file rahasia/sampah masuk ke proses build
Wajib Diabaikan → node_modules, .git, .env, *.log, *.key
```

## Best Practice & Kesalahan Umum

- ✅ Selalu buat file `.dockerignore` pertama kali sebelum menulis baris pertama Dockerfile.
- ❌ Jangan biarkan file `.env` yang berisi kredensial database terkirim ke Docker Daemon tanpa disaring oleh `.dockerignore`.

---

<a id="bagian-10"></a>

# 10. 🟢 Instruksi EXPOSE (Dokumentasi Port Jaringan Kontainer)

## Konsep

Instruksi **`EXPOSE`** berfungsi sebagai bentuk **dokumentasi deklaratif** yang menginformasikan kepada pengguna image dan Docker Engine bahwa kontainer mendengarkan (*listening*) lalu lintas jaringan pada nomor port dan protokol tertentu saat runtime.

PENTING DIPAHAMI:
- Instruksi `EXPOSE` **TIDAK SECARA OTOMATIS membuka port tersebut ke komputer Host!**
- Untuk menghubungkan port kontainer ke host laptop, developer **tetap wajib menyertakan flag `-p host_port:container_port`** saat mengeksekusi perintah `docker run`.

Format Sintaks:
```text
EXPOSE <port>[/<protocol>]
```
Default protokol jika tidak ditulis adalah `tcp` (misal: `EXPOSE 80` sama dengan `EXPOSE 80/tcp`).

## Contoh

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY . .

# Dokumentasikan bahwa aplikasi Node.js berjalan di port 3000 TCP
EXPOSE 3000

CMD ["node", "server.js"]
```

Menjalankan Kontainer dengan Port Forwarding:
```bash
# -p 8080:3000 menghubungkan port 8080 di laptop host ke port 3000 yang di-expose
docker run -d --name api-service -p 8080:3000 my-node-image
```

## Output

```text
CONTAINER ID   IMAGE           PORTS                    NAMES
a1b2c3d4e5f6   my-node-image   0.0.0.0:8080->3000/tcp   api-service
```

## Cara Kerja

```text
         Dockerfile: EXPOSE 3000
                       │
                       ▼
         Disimpan sebagai Metadata Dokumentasi di Manifest Image
                       │
                       ▼
         docker run -p 8080:3000 (Membuka jalur nyata di firewall host)
```

**Hafalan:**

```text
EXPOSE <port>[/tcp|udp] → Mendeklarasikan port listener kontainer sebagai dokumentasi
docker run -p host:cont → Membuka dan memetakan port nyata dari host ke kontainer
```

## Best Practice & Kesalahan Umum

- ✅ Selalu tulis instruksi `EXPOSE` agar tim pengembang lain langsung mengetahui port internal yang digunakan oleh aplikasi di dalam image.
- ❌ Jangan mengira menulis `EXPOSE 80` sudah membuat aplikasi bisa diakses di browser tanpa menyertakan opsi `-p` pada `docker run`.

---

<a id="bagian-11"></a>

# 11. 🟢 Instruksi ENV (Menetapkan Default Environment Variable)

## Konsep

Instruksi **`ENV`** digunakan untuk menetapkan nilai **Environment Variables** (Variabel Lingkungan) yang akan:
1. Tersedia selama proses pembuatan image (**Build-Time**).
2. **Tetap tersimpan dan aktif di dalam kontainer** saat aplikasi dijalankan (**Runtime**).

Format Sintaks:
```text
ENV <key>=<value> ...
```

Penggunaan Variabel di Dalam Dockerfile:
Setelah dideklarasikan, variabel dapat dipanggil di instruksi berikutnya menggunakan sintaks `${KEY}` atau `$KEY`.

## Contoh

```dockerfile
FROM alpine:3.19

# Menetapkan environment variables bawaan
ENV APP_ENV=production \
    APP_PORT=8080 \
    APP_DIR=/var/www/my-app

# Menggunakan variabel $APP_DIR pada instruksi WORKDIR
WORKDIR ${APP_DIR}

# Menampilkan nilai environment variable
CMD ["sh", "-c", "echo Aplikasi berjalan di mode ${APP_ENV} pada port ${APP_PORT}"]
```

Menjalankan Kontainer:
```bash
# 1. Menjalankan dengan nilai default ENV
docker run --rm my-env-app

# 2. Menimpa nilai ENV saat runtime menggunakan flag -e
docker run --rm -e APP_ENV=staging my-env-app
```

## Output

Eksekusi 1 (Default):
```text
Aplikasi berjalan di mode production pada port 8080
```

Eksekusi 2 (Overridden via CLI `-e`):
```text
Aplikasi berjalan di mode staging pada port 8080
```

## Cara Kerja

```text
         Dockerfile: ENV APP_PORT=8080
                          │
                          ▼
         Tersimpan permanen di layer image & tabel Environment OS Kontainer
                          │
                          ▼
         Dapat dibaca oleh process.env di Node.js / $_ENV di PHP / os.Getenv di Go
```

**Hafalan:**

```text
ENV <key>=<value> → Menetapkan environment variable permanen untuk build-time & runtime
docker run -e     → Menimpa nilai default ENV saat kontainer dinyalakan
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan `ENV` untuk menetapkan nilai default yang wajar (seperti `NODE_ENV=production`, `PORT=3000`, `TZ=Asia/Jakarta`).
- ❌ Jangan pernah menulis data rahasia seperti API token atau password database produksi di dalam `ENV` Dockerfile karena nilainya dapat diintip via `docker inspect`.

---

<a id="bagian-12"></a>

# 12. 🟡 Instruksi WORKDIR (Menentukan Direktori Kerja Default)

## Konsep

Instruksi **`WORKDIR`** menetapkan direktori kerja aktif (*Working Directory*) untuk setiap instruksi `RUN`, `CMD`, `ENTRYPOINT`, `COPY`, dan `ADD` yang ditulis setelahnya di dalam Dockerfile.

Karakteristik Kunci `WORKDIR`:
- **Membuat Otomatis Direktori:** Jika direktori yang ditentukan belum ada di dalam sistem file image, Docker akan **otomatis membuatkannya** (seperti `mkdir -p`).
- **Menggantikan Perintah `RUN cd /path`:** Menulis `RUN cd /path` TIDAK AKAN mengubah direktori kerja untuk baris instruksi berikutnya (karena setiap `RUN` dieksekusi di sub-shell terpisah). Oleh karena itu, **`WORKDIR` adalah satu-satunya cara yang benar** untuk berpindah folder di Dockerfile.

## Contoh

```dockerfile
FROM node:20-alpine

# Menetapkan folder /usr/src/app sebagai direktori kerja aktif
WORKDIR /usr/src/app

# File package.json akan disalin langsung ke /usr/src/app/package.json
COPY package.json .

# npm install dijalankan di dalam /usr/src/app
RUN npm install --production

COPY . .

# Node server akan dieksekusi dengan working directory /usr/src/app
CMD ["node", "index.js"]
```

## Output

```text
Step 1/5 : WORKDIR /usr/src/app
 ---> Running in a2b3c4d5e6f7
Removing intermediate container a2b3c4d5e6f7
 ---> 8a9b0c1d2e3f
Step 2/5 : COPY package.json .
 ---> 9b0c1d2e3f4a
```

## Cara Kerja

```text
         WORKDIR /usr/src/app
                  │
                  ▼
         Docker Engine menyetel "Current Working Directory" (cwd)
                  │
         ┌────────┴────────┐
         ▼                 ▼
     COPY . .          CMD ["node", "index.js"]
   (ke /usr/src/app)   (jalan di /usr/src/app)
```

**Hafalan:**

```text
WORKDIR /absolute/path → Menentukan direktori kerja aktif (otomatis dibuat jika belum ada)
Hindari                → RUN cd /path (tidak berpengaruh ke baris berikutnya)
```

## Best Practice & Kesalahan Umum

- ✅ Selalu gunakan absolute path (misal: `WORKDIR /app` atau `WORKDIR /var/www/html`), hindari relative path yang membingungkan.
- ❌ Jangan menaruh file kode program langsung di direktori root (`/`); selalu buat direktori aplikasi terpisah menggunakan `WORKDIR`.

---

<a id="bagian-13"></a>

# 13. 🟡 Instruksi USER (Keamanan Non-Root User Execution)

## Konsep

Secara default, seluruh proses di dalam container dijalankan menggunakan user **`root`** (Superuser dengan UID 0). Jika aplikasi Anda memiliki kerentanan (*security vulnerability*) dan diretas oleh penyerang, penyerang tersebut bisa berpotensi membahayakan sistem operasi Host (*Container Escape Attack*).

Instruksi **`USER`** digunakan untuk mengubah identitas user (dan grup) yang mengeksekusi instruksi `RUN`, `CMD`, dan `ENTRYPOINT` berikutnya menjadi **Non-Root User yang memiliki hak akses terbatas (*Principle of Least Privilege*)**.

Langkah Standar:
1. Buat grup dan user baru (misal: user `appuser`).
2. Ubah hak milik direktori aplikasi menggunakan `chown`.
3. Beralih ke user tersebut menggunakan instruksi `USER appuser`.

## Contoh

```dockerfile
FROM alpine:3.19

WORKDIR /app

# 1. Buat grup 'appgroup' dan user 'appuser' non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 2. Salin file aplikasi dan ubah kepemilikannya ke appuser
COPY --chown=appuser:appgroup . /app

# 3. Beralih eksekusi ke user non-root
USER appuser

# 4. Verifikasi bahwa yang menjalankan aplikasi bukan root (akan mencetak UID != 0)
CMD ["whoami"]
```

Menjalankan Kontainer:
```bash
docker run --rm my-secure-image
```

## Output

```text
appuser
```

## Cara Kerja

```text
       Instruksi: USER appuser
                     │
                     ▼
       Docker Engine menurunkan privilege proses dari UID 0 (root) ke UID 1000 (appuser)
                     │
                     ▼
       Aplikasi berjalan di sandbox terbatas (Sangat Aman di Produksi)
```

**Hafalan:**

```text
USER <user>[:<group>] → Beralih ke user non-root untuk keamanan eksekusi runtime
Principle of Least Privilege → Jangan pernah menjalankan aplikasi produksi sebagai root
```

## Best Practice & Kesalahan Umum

- ✅ Pada image resmi seperti `node:alpine`, user non-root bawaan bernama `node` sudah disediakan (cukup tulis `USER node`).
- ❌ Jangan lupa memberikan hak akses kepemilikan folder (`chown`) sebelum beralih ke user non-root, agar aplikasi tidak error saat ingin membuat file log atau cache lokal (*Permission Denied*).

---

<a id="bagian-14"></a>

# 14. 🟡 Instruksi ARG (Build-Time Variables & Dynamic Arguments)

## Konsep

Instruksi **`ARG`** mendefinisikan variabel yang **HANYA TERSEDIA selama proses pembuatan image (*Build-Time*)**, dan **TIDAK AKAN TERSIMPAN** saat kontainer dijalankan di runtime.

Kegunaan Utama `ARG`:
- Mengirimkan versi paket atau base image secara dinamis saat build.
- Mengatur konfigurasi build spesifik (seperti flag kompilasi).

Format Sintaks:
```text
ARG <name>[=<default_value>]
```

Mengirimkan Nilai ARG via Terminal CLI:
```bash
docker build --build-arg VERSION=2.0.1 -t my-app:v2.0 .
```

### Perbedaan Mendasar ARG vs ENV:
- **`ARG`:** Hanya hidup di masa `docker build` (hilang saat kontainer menyala).
- **`ENV`:** Hidup di masa `docker build` DAN tetap hidup di masa `docker run` (tersimpan di container).

## Contoh

```dockerfile
# Mendefinisikan argumen build dengan nilai default 3.19
ARG ALPINE_VERSION=3.19

FROM alpine:${ALPINE_VERSION}

# Mendefinisikan argumen versi aplikasi
ARG APP_VERSION=1.0.0
ARG BUILD_ENV=production

# Menyimpan nilai ARG ke dalam ENV jika ingin diakses di runtime
ENV APP_VERSION=${APP_VERSION}

RUN echo "Membangun versi: ${APP_VERSION} untuk lingkungan: ${BUILD_ENV}"

CMD ["sh", "-c", "echo Versi aplikasi di runtime: ${APP_VERSION}"]
```

Menjalankan Build dengan Custom Argument:
```bash
# Build dengan menimpa nilai default APP_VERSION
docker build --build-arg APP_VERSION=2.5.0 -t dynamic-app .

# Jalankan kontainer
docker run --rm dynamic-app
```

## Output

Hasil saat `docker build`:
```text
Step 5/6 : RUN echo "Membangun versi: ${APP_VERSION} untuk lingkungan: ${BUILD_ENV}"
 ---> Running in c1d2e3f4a5b6
Membangun versi: 2.5.0 untuk lingkungan: production
```

Hasil saat `docker run`:
```text
Versi aplikasi di runtime: 2.5.0
```

## Cara Kerja

```text
       CLI: docker build --build-arg APP_VERSION=2.5.0 .
                               │
                               ▼
       Dockerfile: ARG APP_VERSION
                               │
                               ▼
       Variabel digunakan untuk compile / download paket (Build-Time Only)
```

**Hafalan:**

```text
ARG <name>[=<default>]      → Variabel sementara hanya untuk proses docker build
docker build --build-arg k=v → Mengirimkan nilai variabel build dari terminal
ARG vs ENV                  → ARG = Build-Time Saja, ENV = Build-Time + Runtime
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan `ARG` untuk menentukan versi base image atau download URL tool di masa kompilasi.
- ❌ Jangan mengirimkan secret key atau password database via `ARG`, karena nilai argumen build masih dapat terlacak di riwayat history layer image (`docker history`).

---

<a id="bagian-15"></a>

# 15. 🟡 Instruksi VOLUME (Mendeklarasikan Mount Point Anonim)

## Konsep

Instruksi **`VOLUME`** digunakan untuk membuat sebuah titik pemasangan (*Mount Point*) dengan path direktori yang ditentukan di dalam container dan menandainya sebagai penampung **data persisten eksternal**.

Karakteristik Instruksi `VOLUME`:
- Saat kontainer dijalankan dari image ini, Docker Engine akan **secara otomatis membuatkan sebuah Anonymous Volume (Volume Anonim)** di komputer host jika user tidak secara eksplisit menyertakan flag `-v` pada `docker run`.
- Segala perubahan file yang ditulis ke dalam path direktori `VOLUME` akan langsung dialihkan ke luar container layer, sehingga data tidak akan hilang saat container dimatikan.

Format Sintaks:
```text
VOLUME ["/var/log/app", "/data"]
```

## Contoh

```dockerfile
FROM alpine:3.19

WORKDIR /app

# Menandai folder /app/data dan /var/log/my-app sebagai persistent volume
VOLUME ["/app/data", "/var/log/my-app"]

# Perintah membuat file log contoh
CMD ["sh", "-c", "echo Log tersimpan pada $(date) >> /var/log/my-app/app.log && cat /var/log/my-app/app.log"]
```

## Output

Saat kontainer dijalankan:
```bash
docker run --name log-app my-volume-image
```

```text
Log tersimpan pada Sat Aug 29 10:44:00 UTC 2026
```

Cek volume anonim yang otomatis dibuat oleh Docker:
```bash
docker inspect --format '{{ json .Mounts }}' log-app
```

```text
[{"Type":"volume","Name":"3f8a9b2c...","Source":"/var/lib/docker/volumes/3f8a9b2c.../_data","Destination":"/var/log/my-app"}]
```

## Cara Kerja

```text
         Dockerfile: VOLUME ["/var/log/my-app"]
                              │
                              ▼
         docker run my-image (Tanpa flag -v manual)
                              │
                              ▼
         Docker Engine otomatis membuat Anonymous Volume di Host Disk
```

**Hafalan:**

```text
VOLUME ["/path/dir"] → Mendeklarasikan direktori kontainer sebagai mountpoint volume persisten
Anonymous Volume    → Dibuat otomatis oleh Docker jika user tidak menyediakan named volume
```

## Best Practice & Kesalahan Umum

- ✅ Deklarasikan `VOLUME` pada image database atau image pencatat log untuk mencegah kehilangan data akibat keteledoran user yang lupa menyertakan flag `-v`.
- ❌ Jangan mencoba memodifikasi isi file di dalam direktori `VOLUME` pada instruksi `RUN` setelah deklarasi `VOLUME` ditulis, karena perubahan tersebut tidak akan tersimpan ke layer image.

---

<a id="bagian-16"></a>

# 16. 🟡 Instruksi ENTRYPOINT (Executable Utama Kontainer)

## Konsep

Instruksi **`ENTRYPOINT`** digunakan untuk mengonfigurasi kontainer agar berfungsi layaknya **sebuah file program binari (*Executable CLI Tool*)**.

Karakteristik Utama `ENTRYPOINT`:
- Menetapkan proses inti yang **pasti dijalankan** saat kontainer menyala.
- Tidak dapat ditimpa dengan mudah seperti `CMD`.
- Seluruh argumen yang dituliskan pada perintah terminal `docker run image [arg1 arg2]` akan **diteruskan dan ditambahkan (*appended*) sebagai parameter** ke instruksi `ENTRYPOINT`.

Format Sintaks (Exec Form Wajib):
```text
ENTRYPOINT ["executable", "param1"]
```

## Contoh

Contoh membuat image utilitas pengecekan jaringan (*Network Ping Tool*):

```dockerfile
FROM alpine:3.19

# Mengatur 'ping' sebagai executable utama kontainer
ENTRYPOINT ["ping"]

# Menetapkan parameter default jika user tidak memberikan argumen
CMD ["-c", "3", "localhost"]
```

Menjalankan Kontainer Sebagai CLI Tool:
```bash
# 1. Menjalankan dengan default CMD (ping ke localhost)
docker run --rm my-ping-tool

# 2. Meneruskan argumen baru: ping ke google.com sebanyak 2 kali
# "google.com -c 2" otomatis diteruskan ke 'ping'
docker run --rm my-ping-tool google.com -c 2
```

## Output

Eksekusi ke-2:
```text
PING google.com (142.250.190.46): 56 data bytes
64 bytes from 142.250.190.46: seq=0 ttl=115 time=12.450 ms
64 bytes from 142.250.190.46: seq=1 ttl=115 time=11.890 ms

--- google.com ping statistics ---
2 packets transmitted, 2 packets received, 0% packet loss
```

## Cara Kerja

```text
    Dockerfile:
    ENTRYPOINT ["ping"]
    CMD ["localhost"]
           │
           ▼
    CLI: docker run my-ping-tool google.com
           │
           ▼
    Hasil Perintah Nyata yang Dieksekusi: ping google.com
```

**Hafalan:**

```text
ENTRYPOINT ["executable"] → Menetapkan proses binari permanen kontainer (sulit ditimpa)
Parameter Passthrough    → Seluruh argumen di 'docker run' otomatis diteruskan ke ENTRYPOINT
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan `ENTRYPOINT` ketika ingin membuat kontainer utilitas mandiri (*CLI Tools / Microservice daemons*).
- ❌ Jangan gunakan Shell form pada `ENTRYPOINT ping` karena shell form akan memblokir argumen tambahan dari perintah `docker run`.

---

<a id="bagian-17"></a>

# 17. 🟡 Perbedaan CMD vs ENTRYPOINT & Pola Kombinasi Terbaik

## Konsep

Memahami perbedaan dan cara mengombinasikan **`ENTRYPOINT`** dan **`CMD`** adalah salah satu keterampilan paling esensial dalam menyusun Dockerfile profesional.

### Tabel Perbandingan Mendasar:
| Kriteria | `CMD` | `ENTRYPOINT` |
|---|---|---|
| **Tujuan** | Perintah default yang fleksibel | Program binari tetap (*executable*) |
| **Kemudahan Overwrite** | Sangat mudah (tertimpa argumen `docker run`) | Sulit (butuh flag khusus `--entrypoint`) |
| **Perilaku Argumen CLI** | Menggantikan seluruh isi `CMD` | Diteruskan sebagai parameter ke `ENTRYPOINT` |

### Pola Kombinasi Terbaik (*Best Practice Pattern*):
Gunakan **`ENTRYPOINT`** untuk menentukan binari aplikasi tetap, dan gunakan **`CMD`** untuk menyediakan parameter default yang fleksibel!

## Contoh

```dockerfile
FROM alpine:3.19

# 1. ENTRYPOINT menentukan program utama
ENTRYPOINT ["curl"]

# 2. CMD menyediakan parameter default (URL default)
CMD ["--silent", "https://httpbin.org/ip"]
```

Pengujian Kombinasi di CLI:
```bash
# Kasus A: Menggunakan default CMD
docker run --rm my-curl-image

# Kasus B: Mengganti URL dengan mudah tanpa mengubah binary curl
docker run --rm my-curl-image https://httpbin.org/user-agent
```

## Output

Hasil Kasus A:
```text
{
  "origin": "180.252.120.45"
}
```

Hasil Kasus B:
```text
{
  "user-agent": "curl/8.5.0"
}
```

## Cara Kerja

```text
                     Kombinasi ENTRYPOINT + CMD
                                 │
     ENTRYPOINT: ["curl"]   +   CMD: ["https://default.com"]
                                 │
                                 ▼
                     Eksekusi: curl https://default.com
                                 │
     User mengetik: docker run image https://custom.com
                                 │
                                 ▼
                     Eksekusi: curl https://custom.com
```

**Hafalan:**

```text
ENTRYPOINT = Program Eksekutor Tetap
CMD        = Parameter Default yang Fleksibel Ditimpa
Rumus      = Executable (ENTRYPOINT) + Default Arguments (CMD)
```

## Best Practice & Kesalahan Umum

- ✅ Terapkan rumus kombinasi `ENTRYPOINT ["binary"]` + `CMD ["default_arg"]` untuk fleksibilitas maksimal.
- ❌ Jangan mencampuradukkan Exec Form dan Shell Form pada kombinasi ENTRYPOINT dan CMD karena dapat menghasilkan perintah string yang kacau (*malformed command*).

---

<a id="bagian-18"></a>

# 18. 🟡 Instruksi HEALTHCHECK (Monitoring Kesehatan Internal Image)

## Konsep

Instruksi **`HEALTHCHECK`** memberitahu Docker bagaimana cara menguji dan memverifikasi bahwa aplikasi di dalam container **benar-benar berfungsi secara sehat dan melayani request**, bukan sekadar prosesnya hidup.

Parameter Konfigurasi:
- **`--interval=DURATION`:** Jarak waktu antar pengujian (default: `30s`).
- **`--timeout=DURATION`:** Batas waktu tunggu respons perintah (default: `30s`).
- **`--start-period=DURATION`:** Waktu jeda inisialisasi awal saat aplikasi booting sebelum kegagalan dihitung (default: `0s`).
- **`--retries=N`:** Jumlah toleransi kegagalan berturut-turut sebelum kontainer dilabeli **`unhealthy`** (default: `3`).

Format Sintaks:
```text
HEALTHCHECK [options] CMD <command>
HEALTHCHECK NONE (untuk mematikan healthcheck dari base image)
```

## Contoh

```dockerfile
FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html

# Uji kesehatan web server setiap 15 detik dengan curl
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Output

Memeriksa status container via `docker ps`:
```text
CONTAINER ID   IMAGE          STATUS                    PORTS                NAMES
4a5b6c7d8e9f   my-nginx-app   Up 30 seconds (healthy)   0.0.0.0:80->80/tcp   web-prod
```

## Cara Kerja

```text
         Tiap 15 Detik: Docker menjalankan "curl -f http://localhost/"
                                      │
                      ┌───────────────┴───────────────┐
                 [Exit Code 0]                   [Exit Code 1]
                      │                               │
                      ▼                               ▼
               Status: (healthy)              Status: (unhealthy)
```

**Hafalan:**

```text
HEALTHCHECK [options] CMD <command> → Mengonfigurasi tes kesehatan internal di dalam Dockerfile
Status Lifecycle: starting ──► healthy / unhealthy
```

## Best Practice & Kesalahan Umum

- ✅ Selalu sediakan parameter `--start-period` yang cukup bagi aplikasi backend yang membutuhkan waktu *booting / warming up* (seperti koneksi ke database atau migrasi skema).
- ❌ Jangan menulis perintah health check yang memakan beban CPU tinggi atau memicu penulisan data berat ke database.

---

<a id="bagian-19"></a>

# 19. 🔴 Multi-Stage Build (Mereduksi Ukuran Image Drastis)

## Konsep

Dalam pengembangan aplikasi modern (seperti Go, Rust, React, Vue, atau TypeScript), kita membutuhkan kompiler, SDK, dan dependensi build yang berukuran sangat besar (ratusan megabyte hingga gigabyte). Namun saat aplikasi dijalankan di server produksi, kita **HANYA MEMBUTUHKAN file binari atau file bundle statisnya saja**.

**Multi-Stage Build** adalah fitur canggih Docker yang memungkinkan kita mendefinisikan beberapa instruksi `FROM` di dalam satu file Dockerfile tunggal:
1. **Stage 1 (Builder / Kompiler):** Menggunakan image lengkap dengan seluruh SDK untuk mengompilasi kode program.
2. **Stage 2 (Production Runtime):** Menggunakan base image super minimalis (seperti `alpine` atau `scratch`), lalu **HANYA menyalin file artefak jadi** dari Stage 1 menggunakan instruksi `COPY --from=builder`.
3. Seluruh compiler, source code mentah, dan SDK build di Stage 1 **DIBUANG SEPENUHNYA**.

Hasil: Ukuran image berkurang drastis dari **~1.2 GB menjadi hanya ~15 MB!**

## Contoh

Contoh Multi-Stage Build untuk aplikasi kompilasi Go (Golang):

```dockerfile
# =========================================================================
# STAGE 1: Tahap Kompilasi (Builder Stage)
# =========================================================================
FROM golang:1.22-alpine AS builder

WORKDIR /build

# Salin modul dan unduh dependensi
COPY go.mod go.sum ./
RUN go mod download

# Salin seluruh source code dan kompilasi binari statis
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /build/api-server .

# =========================================================================
# STAGE 2: Tahap Produksi Akhir (Final Production Stage)
# =========================================================================
FROM alpine:3.19

WORKDIR /app

# Buat user non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# HANYA salin file binari yang sudah jadi dari stage 'builder'!
COPY --from=builder /build/api-server /app/api-server

USER appuser
EXPOSE 8080

CMD ["/app/api-server"]
```

## Output

Perbandingan Hasil Build:
```text
REPOSITORY         TAG        IMAGE ID       CREATED         SIZE
go-single-stage    latest     8a1b2c3d4e5f   1 minute ago    850MB (Tanpa Multi-Stage)
go-multi-stage     latest     f4a8b9c1d2e3   5 seconds ago   18.5MB (Dengan Multi-Stage!)
```

## Cara Kerja

```text
   STAGE 1: golang:alpine (850MB) ──► Kompilasi: /build/api-server (15MB)
                                                      │
                                                      ▼ (COPY --from=builder)
   STAGE 2: alpine:3.19   (5MB)   ──► Image Akhir = 5MB + 15MB = 20MB!
   (Seluruh Go SDK & Source Code 850MB Dibuang dari Image Produksi)
```

**Hafalan:**

```text
FROM <image> AS <stage_name>     → Menamai stage build pertama (misal: AS builder)
COPY --from=<stage_name> src dst → Menyalin artefak binari jadi dari stage sebelumnya
Hasil                            → Image produksi super ramping, cepat di-deploy, & aman
```

## Best Practice & Kesalahan Umum

- ✅ Terapkan Multi-Stage Build pada semua proyek front-end (React/Vue/Angular build ke Nginx) dan bahasa kompilasi (Go/Rust/Java/C#).
- ❌ Jangan biarkan development tools (seperti `gcc`, `npm`, `git`) tertinggal di dalam image produksi final.

---

<a id="bagian-20"></a>

# 20. 🔴 Docker BuildKit & Optimasi Cache Layer

## Konsep

**Docker BuildKit** adalah backend mesin build generasi terbaru dari Docker yang menyediakan peningkatan performa drastis:
- **Parallel Build Execution:** Mengeksekusi stage build independen secara paralel bersamaan.
- **Advanced Layer Caching:** Mendukung *cache mounts* (`--mount=type=cache`) untuk mempercepat instalasi paket npm, pip, go, atau apt tanpa mengulang download dari nol.
- **Secret Mounts (`--mount=type=secret`):** Mengirimkan kredensial rahasia (seperti SSH Key atau token API privat) di masa build tanpa meninggalkan jejak di layer image.

### Urutan Layer Caching yang Optimal:
Docker mengecek cache dari atas ke bawah. Jika satu layer berubah (*cache invalidated*), seluruh layer di bawahnya **terpaksa di-build ulang**.

Susunan Urutan Terbaik Dockerfile:
1. `FROM`
2. Instalasi dependensi sistem (`RUN apk add ...`) -> *Jarang Berubah*
3. Salin manifest dependensi (`COPY package*.json .`) -> *Jarang Berubah*
4. Instal dependensi aplikasi (`RUN npm install`) -> *Jarang Berubah*
5. Salin source code aplikasi (`COPY . .`) -> **PALING SERING BERUBAH (Ditaruh Paling Bawah)**
6. `CMD / ENTRYPOINT`

## Contoh

```dockerfile
# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app

# 1. Manfaatkan Cache Mount npm via BuildKit (Instalasi super cepat!)
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline

# 2. Source code ditaruh di akhir agar tidak merusak cache npm di atasnya
COPY . .

EXPOSE 3000
CMD ["node", "src/index.js"]
```

Membangun dengan BuildKit Aktif:
```bash
# BuildKit aktif secara default di Docker modern
docker build -t cached-app .
```

## Output

Saat mengedit file kode program dan me-rebuild:
```text
[+] Building 0.4s (8/8) FINISHED
 => [internal] load build definition from Dockerfile                       0.0s
 => [2/4] WORKDIR /app                                                     0.0s
 => CACHED [3/4] COPY package*.json ./                                     0.0s
 => CACHED [4/4] RUN --mount=type=cache,target=/root/.npm npm ci           0.0s
 => [5/5] COPY . .                                                         0.1s
 => exporting to image                                                     0.0s
```

(Build selesai hanya dalam **0.4 detik** karena dependensi npm menggunakan **CACHED**!).

## Cara Kerja

```text
         Ubah file src/index.js di Host
                       │
                       ▼
         Layer 1 (WORKDIR)     ──► [ CACHED - Instan ]
         Layer 2 (npm install) ──► [ CACHED - Instan ]
         Layer 3 (COPY . .)    ──► [ Rebuild - 0.1s ]
```

**Hafalan:**

```text
Prinsip Cache Hierarchy → Letakkan instruksi yang jarang berubah di ATAS, yang sering berubah di BAWAH
--mount=type=cache     → Mempertahankan cache package manager antar build
```

## Best Practice & Kesalahan Umum

- ✅ Selalu salin file dependensi (`package.json` / `composer.json`) secara terpisah sebelum menyalin seluruh source code (`COPY . .`).
- ❌ Jangan menulis `COPY . .` sebelum `RUN npm install`, karena setiap kali Anda mengedit satu baris kode, Docker akan mengulang download seluruh paket dependensi dari awal.

---

<a id="bagian-21"></a>

# 21. 🔴 Docker Hub Registry (Tagging & Pushing Image Resmi)

## Konsep

Setelah berhasil membangun Docker Image kustom di komputer lokal, langkah selanjutnya adalah mendistribusikan image tersebut ke **Docker Hub** agar dapat ditarik (*pulled*) dan dijalankan di server pengujian (Staging) atau server produksi (Production).

Konvensi Format Nama Tag Registry:
```text
<dockerhub_username>/<repository_name>:<version_tag>
```

Langkah Publikasi Image ke Docker Hub:
1. Login ke akun Docker: `docker login`.
2. Beri nama tag image lokal sesuai format namespace akun Docker Hub.
3. Unggah image ke registry: `docker push`.

## Contoh

```bash
# 1. Login ke akun Docker Hub
docker login -u myusername

# 2. Membangun image lokal langsung dengan tag namespace Docker Hub
docker build -t myusername/toko-api:1.0.0 .

# 3. Memberi alias tag 'latest' untuk versi rilis terbaru
docker tag myusername/toko-api:1.0.0 myusername/toko-api:latest

# 4. Mengunggah seluruh tag ke Docker Hub
docker push myusername/toko-api:1.0.0
docker push myusername/toko-api:latest
```

## Output

```text
The push refers to repository [docker.io/myusername/toko-api]
7a8b9c0d1e2f: Pushed
3b4c5d6e7f8a: Pushed
1.0.0: digest: sha256:4a3b2c1d0e9f... size: 1782
latest: digest: sha256:4a3b2c1d0e9f... size: 1782
```

Di Server Produksi:
```bash
# Tarik dan jalankan langsung di server cloud mana pun
docker run -d -p 80:3000 --name api-prod myusername/toko-api:1.0.0
```

## Cara Kerja

```text
    Laptop Developer (Lokal)                   Docker Hub Cloud Registry
    ┌──────────────────────────┐               ┌──────────────────────────┐
    │ myusername/toko-api:1.0  ├─ docker push ─►│ myusername/toko-api:1.0  │
    └──────────────────────────┘               └────────────┬─────────────┘
                                                            │
    Server VPS Produksi                                     │
    ┌──────────────────────────┐                            │
    │ myusername/toko-api:1.0  │◄─────── docker run ────────┘
    └──────────────────────────┘
```

**Hafalan:**

```text
docker tag local_image user/repo:tag → Memberi format namespace registry resmi pada image
docker push user/repo:tag           → Mengunggah image lokal ke cloud registry Docker Hub
```

## Best Practice & Kesalahan Umum

- ✅ Terapkan penomoran versi SemVer (*Semantic Versioning*, misal: `v1.2.0`) dan commit hash Git pendek pada tag image.
- ❌ Jangan hanya mengunggah tag `latest` tanpa versi numerik, karena Anda akan kesulitan melakukan rollback jika rilis terbaru mengalami kegagalan.

---

<a id="bagian-22"></a>

# 22. 🔴 Private Container Registry (DigitalOcean & GitHub Packages ghcr.io)

## Konsep

Untuk proyek komersial dan kode milik perusahaan (*Proprietary Code*), kita tidak boleh mengunggah image ke repositori publik Docker Hub. Kita menggunakan **Private Container Registry**.

Dua Layanan Private Registry Populer:
1. **GitHub Packages Container Registry (`ghcr.io`):** Sangat ideal jika kode proyek Anda disimpan di GitHub dan menggunakan GitHub Actions CI/CD.
2. **DigitalOcean Container Registry (`registry.digitalocean.com`):** Terintegrasi langsung dengan DigitalOcean Droplets & Kubernetes (DOKS).

Pola Penamaan Private Registry:
```text
<domain_registry>/<organization_atau_username>/<app_name>:<tag>
```

## Contoh

Alur Kerja Publikasi ke GitHub Container Registry (`ghcr.io`):

```bash
# 1. Login ke GHCR menggunakan Personal Access Token (PAT dengan izin write:packages)
export CR_PAT=ghp_TokenRahasiaGitHub123
echo $CR_PAT | docker login ghcr.io -u github_username --password-stdin

# 2. Beri nama tag sesuai format domain GHCR
docker tag my-app:v1.0 ghcr.io/my-org/my-app:v1.0.0

# 3. Unggah ke Private Registry GHCR
docker push ghcr.io/my-org/my-app:v1.0.0
```

Alur Kerja Publikasi ke DigitalOcean Container Registry (DOCR):

```bash
# 1. Login menggunakan DigitalOcean CLI (doctl)
# doctl registry login

# 2. Tag dan Push ke domain DigitalOcean
docker tag my-app:v1.0 registry.digitalocean.com/my-registry-space/my-app:v1.0.0
docker push registry.digitalocean.com/my-registry-space/my-app:v1.0.0
```

## Output

```text
Login Succeeded
The push refers to repository [ghcr.io/my-org/my-app]
4f5e6d7c8b9a: Pushed
v1.0.0: digest: sha256:9a8b7c6d5e4f... size: 1420
```

## Cara Kerja

```text
       CI/CD Runner (GitHub Actions)
                    │
                    ▼ docker build & tag
       ghcr.io/company/app:v1.0.0
                    │
                    ▼ docker push (Private & Encrypted)
       GitHub Packages Private Storage
                    │
                    ▼ docker pull (Hanya server berlisensi yang bisa akses)
       Server Produksi Perusahaan
```

**Hafalan:**

```text
ghcr.io/username/repo:tag        → Format URL image resmi di GitHub Container Registry
registry.digitalocean.com/...    → Format URL image resmi di DigitalOcean Container Registry
--password-stdin                 → Cara paling aman login registry via token di CI/CD
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan Personal Access Token (PAT) atau Service Account dengan hak akses terbatas (*Read-Only*) untuk server produksi yang bertugas menarik image.
- ❌ Jangan pernah mengetikkan password akun utama langsung di terminal tanpa enkripsi (gunakan pipa `echo $TOKEN | docker login ... --password-stdin`).

---

<a id="bagian-23"></a>

# 23. 🛠️ Peta Ingatan Cepat

## Mental Model Tahapan Instruksi Dockerfile

```text
                      ┌───────────────────────────────┐
                      │    Dockerfile Architecture    │
                      └───────────────┬───────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        ▼                             ▼                             ▼
   Fase Fondasi (Base)          Fase Build & Dependensi       Fase Runtime & Keamanan
   - FROM image:tag             - COPY package*.json .        - WORKDIR /app
   - ARG BUILD_VAR              - RUN npm install / apk add   - USER non-root
   - LABEL metadata             - COPY --chown=... . .        - EXPOSE port
   - .dockerignore              - Multi-Stage (AS builder)    - ENV / VOLUME
        │                             │                             │
        └─────────────────────────────┼─────────────────────────────┘
                                      │
                                      ▼
                        Eksekusi & Monitoring Kontainer
                        - ENTRYPOINT ["binary"]
                        - CMD ["default_arg"]
                        - HEALTHCHECK --interval=...
```

## Pohon Keputusan Instruksi Dockerfile

```text
                                Masalah Pembuatan Image
                                           │
                   ┌───────────────────────┴───────────────────────┐
                   ▼                                               ▼
         Terjadi di Build-Time?                          Terjadi di Runtime?
                   │                                               │
         ┌─────────┴─────────┐                           ┌─────────┴─────────┐
         ▼                   ▼                           ▼                   ▼
    Eksekusi Command?    Salin File?                Eksekusi Utama?      Keamanan User?
         │                   │                           │                   │
         ▼                   ▼                           ▼                   ▼
        RUN             COPY / ADD                  ENTRYPOINT /            USER
                                                        CMD               (Non-Root)
```

---

<a id="bagian-24"></a>

# 24. 📚 Tabel Ringkasan

| Instruksi | Tahapan | Contoh Sintaks | Penjelasan & Kegunaan |
|---|---|---|---|
| **`FROM`** | Build | `FROM node:20-alpine AS builder` | Menentukan base image fondasi awal |
| **`RUN`** | Build | `RUN apk add --no-cache curl` | Mengeksekusi perintah shell saat build image |
| **`COPY`** | Build | `COPY --chown=node:node . .` | Menyalin file dari host ke dalam image |
| **`ADD`** | Build | `ADD archive.tar.gz /app/` | Menyalin dengan auto-ekstrak arsip tar |
| **`WORKDIR`** | Build/Run | `WORKDIR /usr/src/app` | Menetapkan direktori kerja aktif |
| **`ENV`** | Build/Run | `ENV NODE_ENV=production` | Menetapkan environment variable permanen |
| **`ARG`** | Build | `ARG VERSION=1.0.0` | Menetapkan variabel sementara masa build |
| **`EXPOSE`** | Dokumentasi | `EXPOSE 3000/tcp` | Mendokumentasikan nomor port aplikasi |
| **`VOLUME`** | Runtime | `VOLUME ["/var/log/app"]` | Mendeklarasikan mount point persisten |
| **`USER`** | Runtime | `USER appuser` | Beralih ke user non-root demi keamanan |
| **`ENTRYPOINT`**| Runtime | `ENTRYPOINT ["node"]` | Menetapkan proses program binari tetap |
| **`CMD`** | Runtime | `CMD ["server.js"]` | Menetapkan parameter default yang bisa ditimpa |
| **`HEALTHCHECK`**| Runtime | `HEALTHCHECK CMD curl -f ...` | Memantau status kesehatan aplikasi berkala |
| **`LABEL`** | Metadata | `LABEL version="1.0"` | Menyematkan metadata dokumentasi OCI |

---

<a id="bagian-25"></a>

# 25. ⚡ Cheat Code Dockerfile 10 Detik

## 1. Template Produksi Node.js (Ramping & Aman)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --chown=node:node . .
USER node
EXPOSE 3000
CMD ["node", "src/index.js"]
```

## 2. Template Multi-Stage Golang (Ukuran < 20MB)
```dockerfile
FROM golang:1.22-alpine AS builder
WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o /bin/app .

FROM alpine:3.19
COPY --from=builder /bin/app /app
EXPOSE 8080
CMD ["/app"]
```

## 3. Template Web Server Statis Nginx + Custom HTML
```dockerfile
FROM nginx:alpine
COPY ./dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK CMD curl -f http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
```

---

<a id="bagian-26"></a>

# 26. 🧭 Urutan Belajar yang Disarankan

Untuk menguasai penulisan Dockerfile dari tingkat dasar hingga standar arsitektur microservices tingkat lanjut, ikuti 4 fase bertahap berikut:

```text
                   FASE 1: Fondasi Instruksi Dasar (Minggu 1)
       ┌─────────────────────────────────────────────────────────────┐
       │ 1. Memahami analogi Dockerfile -> Image -> Container        │
       │ 2. Menguasai FROM, RUN (chaining &&), dan CMD (Exec form)   │
       │ 3. Menyalin file aman: COPY dan menyaring via .dockerignore │
       │ 4. Menentukan WORKDIR & mendokumentasikan via EXPOSE        │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
                   FASE 2: Konfigurasi, User & Entrypoint (Minggu 2)
       ┌─────────────────────────────────────────────────────────────┐
       │ 5. Perbedaan mendasar ARG (build-time) vs ENV (runtime)     │
       │ 6. Keamanan produksi: Menjalankan USER Non-Root             │
       │ 7. Memahami perbedaan & kombinasi ENTRYPOINT + CMD          │
       │ 8. Menandai volume persisten dengan instruksi VOLUME        │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
                   FASE 3: Optimasi Tingkat Lanjut (Minggu 3)
       ┌─────────────────────────────────────────────────────────────┐
       │ 9. Arsitektur Multi-Stage Build untuk merampingkan image    │
       │ 10. Strategi penataan urutan instruksi agar Layer Caching OK│
       │ 11. Mengonfigurasi tes kesehatan internal: HEALTHCHECK      │
       │ 12. BuildKit Cache Mounts (--mount=type=cache)              │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
                   FASE 4: Distribusi Registry & Mini Project (Minggu 4)
       ┌─────────────────────────────────────────────────────────────┐
       │ 13. Tagging & Publikasi image resmi ke Docker Hub           │
       │ 14. Publikasi image ke Private Registry (GHCR / DigitalOcean│
       │ 15. Mengerjakan Mini Project Multi-Stage REST API Lengkap   │
       └─────────────────────────────────────────────────────────────┘
```

---

<a id="bagian-27"></a>

# 27. 🏗️ Mini Project: Membangun Image Production-Ready Node.js / Go REST API Multi-Stage

## Konsep Project

Project ini mempraktikkan pembuatan **Production-Ready Dockerfile** bertaraf enterprise untuk sebuah aplikasi REST API:
1. **Multi-Stage Build:**
   - **Stage 1 (`builder`):** Menggunakan image lengkap untuk mengompilasi TypeScript / mengunduh dependensi build.
   - **Stage 2 (`runner`):** Menggunakan base image Alpine minimalis yang hanya membawa dependensi runtime produksi.
2. **Layer Caching Optimization:** Menyalin `package.json` terpisah dari source code.
3. **Security Hardening:** Menjalankan aplikasi di bawah user non-root bawaan (`USER node`).
4. **Resiliency:** Memasang pengujian status berkala via `HEALTHCHECK`.
5. **Konfigurasi Fleksibel:** Menggunakan kombinasi `ENTRYPOINT` + `CMD` dan `ENV`.

## Kode Lengkap: Dockerfile

```dockerfile
# =========================================================================
# STAGE 1: Build Dependencies & Source Compilation
# =========================================================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Salin manifes dependensi terlebih dahulu
COPY package*.json ./

# Instal seluruh dependensi (termasuk devDependencies untuk build)
RUN npm ci

# Salin source code aplikasi
COPY . .

# Simulasikan kompilasi (misal build TypeScript atau bundler)
RUN npm run build --if-present

# =========================================================================
# STAGE 2: Lightweight Production Runtime Environment
# =========================================================================
FROM node:20-alpine AS runner

# Metadata Label Standar OCI
LABEL org.opencontainers.image.title="User Management REST API"
LABEL org.opencontainers.image.version="1.0.0"
LABEL maintainer="DevOps Team <devops@company.com>"

WORKDIR /app

# Menetapkan environment variabel runtime
ENV NODE_ENV=production \
    PORT=3000 \
    TZ=Asia/Jakarta

# Instal paket wget/curl untuk healthcheck & instal dependensi prod murni
COPY package*.json ./
RUN apk add --no-cache curl tzdata && \
    npm ci --only=production && \
    npm cache clean --force

# Salin artefak hasil build dari Stage 1 dengan hak akses user 'node'
COPY --from=builder --chown=node:node /usr/src/app/src ./src

# Pasang pemeriksaan kesehatan berkala internal
HEALTHCHECK --interval=20s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

# Turunkan privilege ke user non-root
USER node

# Dokumentasikan port listener
EXPOSE ${PORT}

# Kombinasi Entrypoint + CMD
ENTRYPOINT ["node"]
CMD ["src/index.js"]
```

## File Pendukung: .dockerignore

```text
node_modules
npm-debug.log
.git
.gitignore
.env
.env.*
README.md
coverage
Dockerfile
```

## Langkah Eksekusi CLI

```bash
# 1. Membangun Docker Image Multi-Stage
docker build -t user-api:v1.0.0 .

# 2. Menjalankan Kontainer
docker run -d \
  --name api-service \
  -p 8080:3000 \
  --restart=unless-stopped \
  user-api:v1.0.0

# 3. Memeriksa Status Kesehatan Kontainer
docker ps --filter "name=api-service"
```

## Output

```text
[+] Building 2.8s (15/15) FINISHED
 => [internal] load build definition from Dockerfile
 => [internal] load .dockerignore
 => [builder 1/5] FROM docker.io/library/node:20-alpine
 => [runner 1/4] WORKDIR /app
 => CACHED [runner 2/4] COPY package*.json ./
 => [runner 3/4] RUN apk add --no-cache curl tzdata && npm ci --only=production
 => [runner 4/4] COPY --from=builder --chown=node:node /usr/src/app/src ./src
 => exporting to image
 => => naming to docker.io/library/user-api:v1.0.0

CONTAINER ID   IMAGE              STATUS                    PORTS                    NAMES
8a9b0c1d2e3f   user-api:v1.0.0    Up 25 seconds (healthy)   0.0.0.0:8080->3000/tcp   api-service
```

## Cara Kerja

```text
       STAGE 1 (Builder): Node.js + devDependencies (350MB)
                                  │
                                  ▼ (npm run build)
                         /usr/src/app/src
                                  │
                                  ▼ (COPY --from=builder --chown=node:node)
       STAGE 2 (Runner) : Alpine + Production deps saja (65MB!)
                                  │
                                  ▼ (USER node & HEALTHCHECK)
       Kontainer Produksi: Super Ringan, Kebal Celah Root, & Terpantau Sehat
```

**Hafalan:**

```text
Enterprise Dockerfile Pattern = Multi-Stage + Layer Caching + USER Non-Root + HEALTHCHECK + Exec Form
```

---

<a id="bagian-28"></a>

# 28. 🔗 Referensi Resmi

Untuk mempelajari dokumentasi resmi, spesifikasi sintaks, dan praktik terbaik penulisan Dockerfile:

- [Docker Official Documentation — Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
- [Docker Best Practices for Writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker BuildKit Reference & Syntax](https://docs.docker.com/build/buildkit/)
- [Open Container Initiative (OCI) Image Specification](https://github.com/opencontainers/image-spec)
- [GitHub Container Registry (GHCR) Documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

> **Catatan Versi:** Cheatsheet ini disusun mengacu pada spesifikasi **Dockerfile Syntax v1.7+ / Docker Engine v26+**. Seluruh instruksi kompatibel penuh dengan Docker BuildKit dan seluruh platform container modern.
