# Docker Compose Dasar Cheatsheet Revised

> **Target:** Pemula yang sudah memahami dasar Docker (image, container, volume, network) dan ingin menguasai Docker Compose untuk mendefinisikan, mengonfigurasi, dan menjalankan aplikasi multi-kontainer secara deklaratif dan terorkestrasi.
>
> Fokus cheatsheet ini: **konsep orkestrasi multi-kontainer → Compose V2 (`docker compose`) → compose.yaml & sintaks YAML → siklus hidup (up/down/stop/start/restart) → pemantauan (ps/logs/top) → exec & run → project name & isolasi → services & ports → environment & env_file → persistent volumes & bind mounts → custom networks & DNS → depends_on & healthcheck sync → restart policy & resource limits → build Dockerfile → extends & overrides → variable interpolation → service scaling → mini project microservices**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Konfigurasi YAML & CLI Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami untuk menjalankan stack: compose.yaml, up -d, down, ps, logs, services, ports, & env

🟡 Lanjutan
→ pelajari setelah fundamental nyaman: named volumes, networks, depends_on + healthcheck, & build

🔴 Advanced / Operasional
→ penting untuk arsitektur microservices: override files, variable interpolation, & scaling
```

Mental model orkestrasi di Docker Compose:

```text
                 compose.yaml File (Definisi Blueprint)
                             │
                             ▼ docker compose up -d
                Project (Namespace Terisolasi)
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
    Services (Apps)     Networks (Bridge)   Volumes (Storage)
    - Web / API / DB    - Automatic DNS     - Persistent Data
    - Ports & Env       - Dual Isolation    - Bind Mounts Dev
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                             ▼
       Seluruh Sistem Berjalan Serempak dalam 1 Perintah!
```

**Hafalan:**

```text
Docker Compose   → Tool orkestrasi multi-kontainer berbasis satu file deklaratif YAML
compose.yaml     → Nama file standar resmi Compose Specification (tanpa tag version:)
docker compose up -d → Menyalakan seluruh service, network, dan volume di background
docker compose down  → Mematikan dan membersihkan seluruh kontainer dan network project
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Docker Compose & Orkestrasi Multi-Container](#bagian-1)
2. [Menginstall & Memverifikasi Docker Compose (Compose V2)](#bagian-2)
3. [Format File Konfigurasi (compose.yaml vs docker-compose.yml)](#bagian-3)
4. [Sintaks Dasar YAML untuk Docker Compose](#bagian-4)
5. [Siklus Hidup Compose (docker compose up, start, stop, restart, & down)](#bagian-5)
6. [Pemantauan Service & Log (docker compose ps, logs, & top)](#bagian-6)
7. [Menjalankan Perintah di Service (docker compose exec & run)](#bagian-7)
8. [Project Name & Isolasi Lingkungan (-p / COMPOSE_PROJECT_NAME)](#bagian-8)
9. [Deklarasi Service & Image (services: & image:)](#bagian-9)
10. [Port Mapping (ports:)](#bagian-10)
11. [Environment Variables (environment: & env_file:)](#bagian-11)

### 🟡 Lanjutan

12. [Penyimpanan Persistent: Volumes (volumes:)](#bagian-12)
13. [Bind Mounts untuk Development (volumes: host:container)](#bagian-13)
14. [Jaringan Antar Service: Networks (networks:)](#bagian-14)
15. [Dependensi Urutan Booting: Depends On (depends_on & service_healthy)](#bagian-15)
16. [Restart Policy (restart: always, unless-stopped)](#bagian-16)
17. [Resource Limits (deploy.resources.limits)](#bagian-17)
18. [Custom Dockerfile Build (build: & dockerfile:)](#bagian-18)
19. [Health Check (healthcheck:)](#bagian-19)

### 🔴 Advanced / Operasional

20. [Extend Service & Overrides (extends: & docker-compose.override.yml)](#bagian-20)
21. [Compose File Interpolation & .env Variables (${VAR:-default})](#bagian-21)
22. [Scaling Services (docker compose up --scale)](#bagian-22)

### 🛠️ Referensi & Praktik

23. [Peta Ingatan Cepat](#bagian-23)
24. [Tabel Ringkasan](#bagian-24)
25. [Cheat Code Docker Compose 10 Detik](#bagian-25)
26. [Urutan Belajar yang Disarankan](#bagian-26)
27. [Mini Project: Stack Microservices Lengkap (Nginx Proxy + Node.js API + Redis Cache + MySQL Database)](#bagian-27)
28. [Referensi Resmi](#bagian-28)

---

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan Docker Compose & Orkestrasi Multi-Container

## Konsep

**Docker Compose** adalah sebuah tool orkestrasi deklaratif resmi dari Docker yang digunakan untuk mendefinisikan, mengonfigurasi, dan menjalankan aplikasi multi-kontainer (*Multi-Container Applications*) menggunakan sebuah file konfigurasi berbasis **YAML**.

### Mengapa Membutuhkan Docker Compose?
Aplikasi web modern di dunia nyata hampir tidak pernah berdiri sendiri hanya dengan 1 kontainer tunggal. Sebuah sistem biasanya terdiri dari kombinasi:
- Kontainer Web Server (Nginx / Apache)
- Kontainer Backend API (Node.js / Laravel / Go / Python)
- Kontainer Database (MySQL / PostgreSQL)
- Kontainer In-Memory Cache (Redis)
- Kontainer Message Queue (RabbitMQ / Kafka)

**Tanpa Compose:** Developer harus mengetikkan puluhan perintah `docker network create`, `docker volume create`, dan `docker run -d --network ... -p ... -v ... -e ...` secara manual dengan urutan yang rawan salah.
**Dengan Compose:** Seluruh konfigurasi jaringan, volume, variabel environment, dan kontainer didefinisikan secara rapi di dalam file **`compose.yaml`**, dan seluruh sistem dapat dinyalakan hanya dengan **1 perintah tunggal: `docker compose up -d`**.

## Contoh

Contoh file `compose.yaml` sederhana yang menghubungkan Web Server Nginx dan Database MySQL:

```yaml
# compose.yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secret_root_password
      MYSQL_DATABASE: app_db
```

Perintah Menjalankan Seluruh Aplikasi:
```bash
# Menyalakan seluruh service di latar belakang
docker compose up -d
```

## Output

```text
[+] Running 3/3
 ✔ Network myproject_default  Created                                      0.0s
 ✔ Container myproject-db-1   Started                                      0.4s
 ✔ Container myproject-web-1  Started                                      0.4s
```

## Cara Kerja

```text
                 File Definisi: compose.yaml
                             │
                             ▼
                 Command: docker compose up -d
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
    Buat Network       Nyalakan Service     Nyalakan Service
   (Virtual Bridge)       Database (db)        Web Server (web)
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                             ▼
       Seluruh Service Saling Terhubung via DNS Otomatis!
```

**Hafalan:**

```text
Docker Compose      → Tool manajemen aplikasi multi-kontainer menggunakan file YAML
docker compose up -d→ Membuat network, volume, dan menyalakan seluruh service otomatis
docker compose down → Mematikan dan membersihkan seluruh kontainer & network project
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan Docker Compose untuk seluruh kebutuhan development lokal agar setiap anggota tim dapat menjalankan seluruh stack aplikasi dalam 1 kali klik.
- ❌ Jangan menjalankan banyak perintah `docker run` terpisah satu per satu di terminal jika aplikasi Anda terdiri dari lebih dari 1 kontainer.

---

<a id="bagian-2"></a>

# 2. 🟢 Menginstall & Memverifikasi Docker Compose (Compose V2)

## Konsep

Pada ekosistem Docker modern, Docker Compose telah berevolusi menjadi **Compose V2**:
- **Compose V1 (Jadul / Usang):** Ditulis dalam bahasa Python dengan perintah CLI bertanda minus (`docker-compose`). Versi ini sudah resmi *Deprecated* dan dihentikan.
- **Compose V2 (Standar Modern Resmi):** Ditulis ulang dalam bahasa Go dan diintegrasikan langsung sebagai plugin resmi Docker CLI dengan perintah berspasi (**`docker compose`**).

Status Instalasi:
- **Docker Desktop (Windows & macOS):** Compose V2 sudah terinstal secara otomatis dan langsung siap digunakan.
- **Linux Server:** Terinstal sebagai paket `docker-compose-plugin`.

## Contoh

```bash
# 1. Memeriksa versi Docker Compose V2 yang terpasang
docker compose version

# 2. Memeriksa daftar sub-perintah bantuan
docker compose --help
```

## Output

```text
Docker Compose version v2.27.0

Usage:  docker compose [OPTIONS] COMMAND

Define and run multi-container applications with Docker.
```

## Cara Kerja

```text
       Terminal CLI: docker compose ...
                          │
                          ▼
       Docker CLI Engine mengeksekusi plugin "compose" berbasis Go
                          │
                          ▼
       Berkomunikasi langsung dengan Docker Daemon Host
```

**Hafalan:**

```text
docker compose version → Memverifikasi instalasi Compose V2 (Gunakan SPASI, bukan minus '-')
docker compose         → Sintaks resmi Compose V2 modern
docker-compose         → Sintaks usang Compose V1 (TIDAK LAGI DIGUNAKAN)
```

## Best Practice & Kesalahan Umum

- ✅ Selalu gunakan sintaks modern `docker compose` (dengan spasi) di seluruh dokumentasi dan skrip CI/CD baru.
- ❌ Hindari menggunakan sintaks jadul `docker-compose` (dengan tanda minus) karena sudah tidak menerima pembaruan fitur keamanan.

---

<a id="bagian-3"></a>

# 3. 🟢 Format File Konfigurasi (compose.yaml vs docker-compose.yml)

## Konsep

Docker Compose membaca konfigurasi deklaratif dari sebuah file di folder direktori aktif.

Urutan Prioritas Penamaan File Resmi (*Compose Specification*):
1. **`compose.yaml`** (**Standar Rekomendasi Resmi Utama saat ini**).
2. **`compose.yml`**
3. **`docker-compose.yaml`**
4. **`docker-compose.yml`** (Format warisan/legacy yang tetap didukung untuk backward compatibility).

### Catatan Penting Tentang `version:` Tag:
Pada spesifikasi Compose Specification modern (Compose V2), **baris deklarasi `version: '3.8'` SUDAH TIDAK DIPERLUKAN LAGI (Obsolete)**. Docker Compose modern akan secara otomatis menggunakan spesifikasi fitur terbaru tanpa perlu menuliskan tag `version` di baris pertama.

## Contoh

Struktur File `compose.yaml` Modern yang Bersih:

```yaml
# compose.yaml (Standar Modern - Tanpa tag 'version:')
services:
  frontend:
    image: nginx:alpine
    ports:
      - "80:80"

  backend:
    image: node:20-alpine
    environment:
      - NODE_ENV=production
```

## Output

```bash
# Docker otomatis mendeteksi file compose.yaml di direktori saat ini
docker compose config
```

```text
name: my-app
services:
  backend:
    environment:
      NODE_ENV: production
    image: node:20-alpine
    networks:
      default: null
  frontend:
    image: nginx:alpine
    networks:
      default: null
    ports:
      - mode: ingress
        target: 80
        published: "80"
        protocol: tcp
networks:
  default:
    name: my-app_default
```

## Cara Kerja

```text
         Perintah: docker compose up
                       │
                       ▼
         Cari file di folder: compose.yaml ──► Ditemukan!
                       │
                       ▼
         Validasi skema struktur YAML & terjemahkan ke instruksi container
```

**Hafalan:**

```text
compose.yaml          → Nama file standar resmi yang paling direkomendasikan saat ini
docker-compose.yml    → Nama file alternatif lama yang masih kompatibel
Tag 'version:'        → Sudah usang (obsolete) dan tidak wajib ditulis lagi di Compose V2
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan nama file `compose.yaml` untuk proyek-proyek baru.
- ❌ Jangan khawatir jika tidak menuliskan `version: '3.8'`; Compose Specification modern sengaja menghapusnya agar konfigurasi lebih simpel.

---

<a id="bagian-4"></a>

# 4. 🟢 Sintaks Dasar YAML untuk Docker Compose

## Konsep

**YAML (YAML Ain't Markup Language)** adalah format serialisasi data yang mengandalkan **Indentasi Spasi (*Whitespace Indentation*)** untuk menentukan struktur hierarki data.

Aturan Emas Sintaks YAML:
1. **DILARANG MENGGUNAKAN TAB:** Selalu gunakan **2 Karakter Spasi** untuk setiap tingkatan indentasi. Menggunakan tombol Tab akan menyebabkan error fatal *YAML Syntax Error*.
2. **Key-Value Pairs:** Ditulis dengan format `key: value` (wajib ada 1 spasi setelah tanda titik dua `:`).
3. **List / Array (Daftar Item):** Ditulis dengan tanda strip minus (`- `) diikuti 1 spasi.
4. **Komentar:** Ditulis dengan awalan tanda pagar (`#`).
5. **String Khusus (Port & Boolean):** Selalu bungkus nomor port dengan tanda kutip (misal `"8080:80"`) agar tidak dianggap sebagai bilangan basis-60 oleh parser YAML.

## Contoh

```yaml
# Contoh Struktur YAML yang Valid & Rapi
services:
  # Service 1: Web App
  web-app:
    image: nginx:alpine
    container_name: production-web
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    environment:
      APP_NAME: "Toko Online"
      DEBUG_MODE: "false"

  # Service 2: Redis Cache
  cache-service:
    image: redis:alpine
    command: ["redis-server", "--appendonly", "yes"]
```

## Output

Memvalidasi sintaks YAML sebelum dijalankan:
```bash
docker compose config --quiet && echo "Sintaks YAML 100% VALID!"
```

```text
Sintaks YAML 100% VALID!
```

## Cara Kerja

```text
     services:              (Tingkat 0: Induk Service)
       web-app:             (Tingkat 1: 2 Spasi - Nama Service)
         image: nginx       (Tingkat 2: 4 Spasi - Atribut Service)
         ports:             (Tingkat 2: 4 Spasi - List Port)
           - "80:80"        (Tingkat 3: 6 Spasi - Item List)
```

**Hafalan:**

```text
Indentasi YAML → Gunakan 2 spasi konsisten (DILARANG menggunakan tombol TAB)
List / Array   → Awali baris dengan '- ' (strip spasi)
Quotes Port    → Selalu beri tanda kutip pada port "- "8080:80""
```

## Best Practice & Kesalahan Umum

- ✅ Aktifkan ekstensi *YAML linter* di editor kode (seperti VS Code) untuk mendeteksi spasi yang tidak sejajar secara otomatis.
- ❌ Jangan pernah menggunakan tombol Tab di dalam file `compose.yaml`.

---

<a id="bagian-5"></a>

# 5. 🟢 Siklus Hidup Compose (docker compose up, start, stop, restart, & down)

## Konsep

Docker Compose mengelola seluruh siklus hidup (*Lifecycle*) kumpulan kontainer secara serentak sebagai satu kesatuan proyek (*Project*).

Perintah Siklus Hidup Utama:
- **`docker compose up`:** Membangun image (jika belum ada), membuat network & volume, lalu menyalakan seluruh kontainer.
  - Opsi **`-d` (*detached*):** Menjalankan di latar belakang (*background*).
  - Opsi **`--build`:** Memaksa proses build ulang image sebelum kontainer dinyalakan.
- **`docker compose down`:** Menghentikan dan **MENGHAPUS** seluruh kontainer dan network yang dibuat oleh file compose.
  - Opsi **`-v` (*volumes*):** Ikut menghapus named volume yang terdaftar (Hati-hati: data database akan terhapus!).
- **`docker compose stop`:** Menghentikan kontainer sementara tanpa menghapusnya.
- **`docker compose start`:** Menyalakan kembali kontainer yang sedang stop.
- **`docker compose restart`:** Memuat ulang seluruh service.

## Contoh

```bash
# 1. Menyalakan seluruh stack aplikasi di background
docker compose up -d

# 2. Menghentikan service sementara (data kontainer tetap ada)
docker compose stop

# 3. Menyalakan kembali service
docker compose start

# 4. Mematikan dan membersihkan seluruh kontainer & network project
docker compose down

# 5. Membersihkan total beserta Volume database-nya
docker compose down -v
```

## Output

Saat `docker compose up -d`:
```text
[+] Running 2/2
 ✔ Container myapp-db-1   Started                                          0.3s
 ✔ Container myapp-web-1  Started                                          0.3s
```

Saat `docker compose down`:
```text
[+] Running 3/3
 ✔ Container myapp-web-1  Removed                                          0.2s
 ✔ Container myapp-db-1   Removed                                          0.2s
 ✔ Network myapp_default  Removed                                          0.1s
```

## Cara Kerja

```text
                     docker compose up -d
                              │
                              ▼
                     [ Running Services ]
                              │
               ┌──────────────┴──────────────┐
  docker stop  │                             │ docker down
               ▼                             ▼
       [ Stopped State ]              [ Containers & ]
               │                      [ Network DIHAPUS ]
  docker start │
               ▼
     [ Back to Running ]
```

**Hafalan:**

```text
docker compose up -d      → Menyalakan seluruh stack kontainer di background
docker compose down       → Mematikan dan menghapus kontainer serta virtual network project
docker compose down -v    → Menghapus kontainer + network + VOLUME PERSISTEN
docker compose restart    → Memuat ulang seluruh service
```

## Best Practice & Kesalahan Umum

- ✅ Selalu gunakan `docker compose down` saat selesai bekerja untuk menjaga laptop tetap bersih dari kontainer dan network yang menggantung.
- ❌ Hati-hati jangan menambahkan flag `-v` pada `docker compose down -v` jika Anda tidak berniat menghapus isi database lokal Anda.

---

<a id="bagian-6"></a>

# 6. 🟢 Pemantauan Service & Log (docker compose ps, logs, & top)

## Konsep

Ketika mengelola banyak kontainer yang berjalan bersamaan, kita membutuhkan perintah pemantauan terpusat untuk melihat status kesehatan, proses yang berjalan, dan log keluaran dari seluruh service.

Perintah Pemantauan:
- **`docker compose ps`:** Menampilkan daftar service, status running, dan pemetaan port.
- **`docker compose logs`:** Menggabungkan dan menampilkan rekaman log dari seluruh service dalam satu layar.
  - Opsi **`-f` (*follow*):** Memantau stream log secara live real-time.
  - Opsi **`--tail N`:** Menampilkan `N` baris terakhir saja.
  - Argumen **`[service_name]`:** Hanya memantau log service tertentu (misal: `docker compose logs -f web`).
- **`docker compose top`:** Menampilkan daftar proses sistem (*PID*) yang sedang aktif berjalan di dalam setiap kontainer.

## Contoh

```bash
# 1. Melihat status seluruh service yang dikelola compose
docker compose ps

# 2. Memantau log gabungan secara live real-time (Ctrl+C untuk keluar)
# docker compose logs -f

# 3. Melihat 20 baris log terakhir hanya dari service database 'db'
docker compose logs --tail 20 db

# 4. Melihat proses PID yang aktif di setiap kontainer
docker compose top
```

## Output

```text
NAME                IMAGE          COMMAND                  SERVICE   CREATED         STATUS         PORTS
myapp-db-1          mysql:8.0      "docker-entrypoint.s…"   db        2 minutes ago   Up 2 minutes   3306/tcp
myapp-web-1         nginx:alpine   "/docker-entrypoint.…"   web       2 minutes ago   Up 2 minutes   0.0.0.0:8080->80/tcp

myapp-db-1   | 2026-08-29T10:46:01.123456Z 0 [System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections.
myapp-db-1   | Version: '8.0.36'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306
```

## Cara Kerja

```text
       Container 'web' (stdout) ──┐
                                  ├──► docker compose logs (Menggabungkan log dengan warna berbeda)
       Container 'db'  (stdout) ──┘
```

**Hafalan:**

```text
docker compose ps              → Menampilkan status seluruh service dalam project aktif
docker compose logs -f [srv]   → Memantau rekaman log service secara live real-time
docker compose top             → Menampilkan daftar proses aktif di dalam kontainer
```

## Best Practice & Kesalahan Umum

- ✅ Sertakan nama service spesifik (misal: `docker compose logs -f backend`) agar terminal tidak dipenuhi log dari service lain yang tidak relevan saat debugging.
- ❌ Jangan menjalankan `docker compose logs` tanpa parameter pada sistem yang sudah berjalan lama tanpa batas baris (`--tail`).

---

<a id="bagian-7"></a>

# 7. 🟢 Menjalankan Perintah di Service (docker compose exec & run)

## Konsep

Docker Compose menyediakan dua perintah untuk mengeksekusi instruksi di dalam lingkungan service:

1. **`docker compose exec <service> <command>`:**
   - Mengeksekusi perintah ke dalam service yang **SUDAH AKTIF BERJALAN** (mirip `docker exec`).
   - Sangat ideal untuk: membuka shell terminal (`sh`/`bash`), menjalankan migrasi database, atau menjalankan command CLI aplikasi (misal: `php artisan migrate`, `npm run seed`).
2. **`docker compose run <service> <command>`:**
   - Membuat dan menyalakan **KONTAINER BARU SEMENTARA** dari definisi service tersebut, mengeksekusi perintah satu kali, lalu berhenti (*one-off task*).
   - Sangat ideal untuk: inisialisasi awal proyek atau backup data.

## Contoh

```bash
# 1. Membuka terminal shell interaktif ke dalam service 'web' yang sedang aktif
docker compose exec web sh

# 2. Menjalankan perintah artisan/npm di service backend yang sedang berjalan
docker compose exec backend npm run test

# 3. Menjalankan task satu kali (one-off) dengan kontainer baru sementara
docker compose run --rm backend npm install axios
```

## Output

Saat membuka shell `docker compose exec web sh`:
```text
/ # ls -la
total 64
drwxr-xr-x    1 root     root          4096 Aug 29 10:46 .
drwxr-xr-x    1 root     root          4096 Aug 29 10:46 etc
drwxr-xr-x    1 root     root          4096 Aug 29 10:46 usr
/ # exit
```

## Cara Kerja

```text
   docker compose exec backend npm test ──► Masuk ke Kontainer 'backend' yang Sedang Berjalan
                                                     │
   docker compose run --rm backend npm install ──► Buat Kontainer Baru -> Jalankan -> Hapus
```

**Hafalan:**

```text
docker compose exec <service> <cmd>  → Menjalankan perintah di dalam kontainer yang SEDANG BERJALAN
docker compose run --rm <service> <cmd> → Menjalankan perintah di dalam kontainer BARU SATU KALI
```

## Best Practice & Kesalahan Umum

- ✅ Selalu sertakan flag `--rm` saat menggunakan `docker compose run --rm` agar kontainer sementara tidak menumpuk sebagai sampah disk.
- ❌ Jangan gunakan `docker compose exec` pada service yang statusnya sedang mati/stopped (service wajib berstatus *Up*).

---

<a id="bagian-8"></a>

# 8. 🟢 Project Name & Isolasi Lingkungan (-p / COMPOSE_PROJECT_NAME)

## Konsep

Secara default, Docker Compose menggunakan **nama folder tempat file `compose.yaml` berada** sebagai **Project Name**.

Nama project ini digunakan oleh Docker Compose sebagai awalan (*prefix*) penamaan seluruh entitas yang dibuat:
- **Nama Kontainer:** `<project_name>-<service_name>-1` (misal: `myproject-web-1`).
- **Nama Network:** `<project_name>_default` (misal: `myproject_default`).
- **Nama Volume:** `<project_name>_<volume_name>` (misal: `myproject_db_data`).

### Cara Mengubah Project Name:
1. **Atribut `name:` di dalam `compose.yaml`:** Mendefinisikan nama proyek secara eksplisit.
2. **Flag `-p / --project-name`:** `docker compose -p staging up -d`.
3. **Environment Variable `COMPOSE_PROJECT_NAME`:** Di dalam file `.env`.

Keuntungan: Memungkinkan kita menjalankan **beberapa instance lingkungan yang berbeda (Development, Staging, Feature-Branch)** dari file konfigurasi yang sama di satu mesin server tanpa bentrok nama!

## Contoh

```yaml
# compose.yaml
name: toko-online-app

services:
  web:
    image: nginx:alpine
```

Menjalankan dengan Project Name Khusus via CLI:
```bash
# Menjalankan instance versi feature-staging
docker compose -p toko-staging up -d
```

## Output

```text
[+] Running 2/2
 ✔ Network toko-staging_default  Created                                   0.0s
 ✔ Container toko-staging-web-1  Started                                   0.3s
```

## Cara Kerja

```text
                     Project Name: toko-staging
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
   Nama Kontainer          Nama Network             Nama Volume
 toko-staging-web-1     toko-staging_default    toko-staging_db_data
```

**Hafalan:**

```text
Project Name                 → Awalan (prefix) penamaan seluruh kontainer, network, & volume
name: custom_name di YAML    → Menetapkan nama proyek di dalam compose.yaml
docker compose -p name up -d → Menjalankan stack dengan namespace project terpisah
```

## Best Practice & Kesalahan Umum

- ✅ Tetapkan atribut `name: nama-proyek` di baris atas `compose.yaml` agar penamaan kontainer tetap konsisten meskipun nama folder proyek di-rename oleh developer lain.
- ❌ Hati-hati jika menjalankan perintah `docker compose -p nama_a down`, jangan sampai tertukar dengan project `nama_b`.

---

<a id="bagian-9"></a>

# 9. 🟢 Deklarasi Service & Image (services: & image:)

## Konsep

Blok utama di dalam `compose.yaml` adalah **`services:`**. Setiap item di bawah `services:` merepresentasikan satu komponen aplikasi atau satu kontainer yang akan dijalankan.

Kunci Properti Service:
- **`image:`:** Menentukan nama Docker Image resmi dari registry (misal: `image: postgres:16-alpine`).
- **`container_name:` (Opsional):** Memberi nama kustom statis pada kontainer (jika tidak diisi, Docker Compose akan memberi nama otomatis `<project>-<service>-1`).
- **`command:` (Opsional):** Menimpa default `CMD` bawaan image (misal: `command: ["npm", "run", "dev"]`).

## Contoh

```yaml
# compose.yaml
services:
  # Service Backend
  api-service:
    image: node:20-alpine
    working_dir: /app
    command: ["node", "server.js"]

  # Service Database
  database:
    image: postgres:16-alpine
    container_name: custom-postgres-db
    environment:
      POSTGRES_PASSWORD: supersecretpassword
```

## Output

```bash
docker compose up -d
docker compose ps
```

```text
NAME                  IMAGE                STATUS         PORTS
custom-postgres-db    postgres:16-alpine   Up 2 seconds   5432/tcp
toko-api-service-1    node:20-alpine       Up 2 seconds   
```

## Cara Kerja

```text
    services:
      api-service: ──► Tarik Image node:20-alpine  ──► Nyalakan kontainer toko-api-service-1
      database:    ──► Tarik Image postgres:alpine ──► Nyalakan kontainer custom-postgres-db
```

**Hafalan:**

```text
services:                  → Blok penampung seluruh kontainer dalam aplikasi
image: <name>:<tag>        → Menentukan image yang ditarik dari Docker Hub
container_name: <name>     → Memberikan nama statis pada kontainer
command: ["cmd", "arg"]    → Menimpa perintah default startup kontainer
```

## Best Practice & Kesalahan Umum

- ✅ Berikan nama service yang ringkas dan deskriptif (`web`, `api`, `db`, `cache`) karena nama service ini otomatis menjadi **Hostname DNS internal**.
- ❌ Hindari menggunakan `container_name:` statis jika Anda berencana melakukan *scaling* kontainer menjadi banyak instance (`--scale`), karena nama kontainer akan bentrok.

---

<a id="bagian-10"></a>

# 10. 🟢 Port Mapping (ports:)

## Konsep

Secara default, seluruh port antar service di dalam file Compose saling terhubung secara internal melalui private network. Namun port tersebut **belum dapat diakses oleh browser dari komputer Host**.

Blok **`ports:`** digunakan untuk memetakan (*publishing / forwarding*) port di komputer Host ke port di dalam kontainer.

Format Sintaks:
```yaml
ports:
  - "PortHost:PortContainer"
```
- Selalu gunakan tanda kutip ganda (`"8080:80"`).
- Jika Anda hanya ingin mengekspos port ke localhost mesin lokal saja (keamanan), tulis: `"127.0.0.1:8080:80"`.

## Contoh

```yaml
# compose.yaml
services:
  # Web Nginx dapat diakses di laptop via http://localhost:8080
  web:
    image: nginx:alpine
    ports:
      - "8080:80"

  # Database MySQL dibuka ke port 3306 host untuk akses via DBeaver/TablePlus
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secret
    ports:
      - "127.0.0.1:3306:3306"
```

## Output

```bash
docker compose up -d
```

```text
[+] Running 2/2
 ✔ Container myapp-db-1   Started                                          0.4s
 ✔ Container myapp-web-1  Started                                          0.4s
```

Akses di browser: `http://localhost:8080` -> Tampil halaman Nginx.

## Cara Kerja

```text
       Browser di Laptop Host ──► Request ke localhost:8080
                                         │
                                         ▼
       Port Forwarding Compose ──► Diteruskan ke Port 80 di Container 'web'
```

**Hafalan:**

```text
ports:
  - "HOST:CONTAINER"  → Membuka akses dari laptop host ke dalam service kontainer
  - "127.0.0.1:p1:p2" → Membatasi akses port hanya untuk mesin lokal (keamanan)
```

## Best Practice & Kesalahan Umum

- ✅ Hanya buka port yang benar-benar membutuhkan akses dari luar (misal web server `80/443`). Jangan membuka port database ke internet publik di server produksi.
- ❌ Jangan lupa membungkus pasangan port dengan tanda kutip (tulis `"8080:80"`, bukan `8080:80`).

---

<a id="bagian-11"></a>

# 11. 🟢 Environment Variables (environment: & env_file:)

## Konsep

Untuk menyuntikkan konfigurasi dinamis dan kredensial ke dalam kontainer, Docker Compose menyediakan dua pendekatan:

1. **Atribut `environment:` (Inline):** Menuliskan variabel langsung di dalam file `compose.yaml`.
2. **Atribut `env_file:` (File Konfigurasi Eksternal):** Membaca variabel dari file konfigurasi rahasia (seperti `.env` atau `.env.production`).

Dua Format Penulisan `environment:`:
- **Format Array:** `- KEY=VALUE`
- **Format Map (Key-Value):** `KEY: VALUE`

## Contoh

```yaml
# compose.yaml
services:
  app-service:
    image: node:20-alpine
    # 1. Membaca variabel dari file eksternal .env
    env_file:
      - .env
    # 2. Menetapkan / menimpa variabel secara langsung
    environment:
      NODE_ENV: production
      APP_PORT: 3000
      DB_HOST: db-service

  db-service:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: admin_toko
      POSTGRES_PASSWORD: password_rahasia_123
      POSTGRES_DB: toko_db
```

File `.env` Pendukung:
```text
# .env (Dikecualikan dari Git via .gitignore)
JWT_SECRET=super_secret_jwt_key_2026
API_KEY=xyz987654321
```

## Output

Memeriksa environment variable di dalam kontainer yang sedang berjalan:
```bash
docker compose exec app-service env | grep -E "NODE_ENV|DB_HOST"
```

```text
NODE_ENV=production
DB_HOST=db-service
```

## Cara Kerja

```text
         File .env (JWT_SECRET) + compose.yaml (NODE_ENV)
                               │
                               ▼
         Docker Compose menggabungkan seluruh variabel
                               │
                               ▼
         Disuntikkan ke lingkungan eksekusi Container saat booting
```

**Hafalan:**

```text
environment:          → Mendefinisikan variabel lingkungan langsung di file compose
env_file:             → Membaca variabel rahasia dari file eksternal (.env)
```

## Best Practice & Kesalahan Umum

- ✅ Pisahkan password dan API key rahasia ke dalam file `.env` dan masukkan file `.env` ke dalam `.gitignore`.
- ❌ Jangan pernah meng-hardcode password produksi di dalam blok `environment:` file `compose.yaml` yang di-push ke repositori publik.

---

<a id="bagian-12"></a>

# 12. 🟡 Penyimpanan Persistent: Volumes (volumes:)

## Konsep

Untuk menyimpan data yang bersifat permanen (*Persistent Data*) seperti file database atau file upload user agar tidak hilang saat kontainer dimatikan (`docker compose down`), kita menggunakan **Named Volumes** yang dikelola langsung oleh Docker Engine.

Dua Bagian Deklarasi Volume di Compose:
1. **Blok Level Service (`services.<name>.volumes`):** Menghubungkan named volume ke path direktori di dalam kontainer (`<volume_name>:<container_path>`).
2. **Blok Top-Level (`volumes:` di baris paling bawah):** Mendeklarasikan volume tersebut secara resmi di level proyek.

## Contoh

```yaml
# compose.yaml
services:
  database:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secretpassword
    # 1. Pasang named volume 'pg_data' ke folder data postgres
    volumes:
      - pg_data:/var/lib/postgresql/data

# 2. Deklarasikan named volume di level paling bawah (Wajib!)
volumes:
  pg_data:
```

## Output

Memeriksa volume yang otomatis dibuat dengan prefix nama proyek:
```bash
docker compose up -d
docker volume ls
```

```text
DRIVER    VOLUME NAME
local     myproject_pg_data
```

## Cara Kerja

```text
   Kontainer 'database' (/var/lib/postgresql/data)
                         │
                         ▼ (Mount Tautan)
   Named Volume Host: myproject_pg_data (Data Aman Selamanya)
```

**Hafalan:**

```text
services:
  db:
    volumes:
      - named_vol:/path/in/container
volumes:
  named_vol:                     → Wajib didaftarkan di root top-level volumes:
```

## Best Practice & Kesalahan Umum

- ✅ Selalu daftarkan nama volume di blok top-level `volumes:` di akhir file `compose.yaml`.
- ❌ Jangan lupa bahwa menjalankan `docker compose down -v` akan menghapus seluruh named volume proyek Anda beserta isinya.

---

<a id="bagian-13"></a>

# 13. 🟡 Bind Mounts untuk Development (volumes: host:container)

## Konsep

Dalam lingkungan pengembangan (*Local Development*), developer ingin mengedit file source code di laptop (komputer Host) dan melihat perubahannya **langsung terjadi secara instan di dalam kontainer tanpa perlu build ulang image (*Hot-Reloading*)**.

Kita menggunakan **Bind Mounts** pada sintaks `volumes:` dengan format:
```yaml
volumes:
  - "./path/di/host:/path/di/container"
```
- Jalur host diawali dengan titik slash (`./`) yang menandakan folder relatif dari lokasi file `compose.yaml`.
- **Tidak perlu** mendaftarkan folder bind mount di blok top-level `volumes:`.

## Contoh

```yaml
# compose.yaml
services:
  web-dev:
    image: node:20-alpine
    working_dir: /app
    ports:
      - "3000:3000"
    # Menghubungkan folder ./src di laptop ke /app/src di kontainer
    volumes:
      - ./src:/app/src:ro # Read-Only (Aman)
      - ./package.json:/app/package.json
    command: ["npm", "run", "dev"]
```

## Output

```bash
docker compose up -d
```

Edit file `src/App.js` di VS Code laptop Anda -> Browser di `http://localhost:3000` akan me-reload perubahan secara instan!

## Cara Kerja

```text
    Folder Laptop Developer (./src)
    ┌─────────────────────────────┐
    │ index.js                    │
    └──────────────┬──────────────┘
                   │  Tautan Langsung (Bind Mount)
                   ▼
    Folder di dalam Kontainer (/app/src)
    ┌─────────────────────────────┐
    │ index.js                    │
    └─────────────────────────────┘
```

**Hafalan:**

```text
- ./local_folder:/container_folder → Bind mount relatif folder lokal ke kontainer (Hot-Reload)
:ro                                → Opsi Read-Only agar kontainer tidak mengubah file lokal host
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan Bind Mounts untuk lingkungan development lokal (*hot reload*).
- ❌ Jangan gunakan Bind Mounts untuk database di server produksi; selalu gunakan Named Volume resmi.

---

<a id="bagian-14"></a>

# 14. 🟡 Jaringan Antar Service: Networks (networks:)

## Konsep

Secara default, Docker Compose **secara otomatis membuat 1 jaringan Virtual Bridge bersama (`<project>_default`)** dan menghubungkan seluruh service yang ada di dalam file ke jaringan tersebut.

Semua service di dalam file yang sama **langsung dapat saling memanggil menggunakan NAMA SERVICE-nya sebagai Hostname DNS** (misal: service `web` memanggil `http://api:3000` atau backend memanggil database via `db:5432`).

Kustomisasi Multi-Network (Isolasi Bertingkat):
Kita bisa membuat beberapa jaringan terpisah untuk meningkatkan keamanan (misal: jaringan publik `frontend-net` dan jaringan privat `backend-net`).

## Contoh

```yaml
# compose.yaml
services:
  # Web publik hanya terhubung ke frontend-net
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    networks:
      - frontend-net

  # API backend terhubung ke KEDUA jaringan (jembatan antara web dan db)
  api:
    image: node:20-alpine
    networks:
      - frontend-net
      - backend-net

  # Database terisolasi di backend-net (TIDAK BISA diakses langsung oleh web!)
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret
    networks:
      - backend-net

# Deklarasi Networks Top-Level
networks:
  frontend-net:
  backend-net:
```

## Output

```text
[+] Running 5/5
 ✔ Network myapp_frontend-net  Created                                     0.0s
 ✔ Network myapp_backend-net   Created                                     0.0s
 ✔ Container myapp-db-1        Started                                     0.3s
 ✔ Container myapp-api-1       Started                                     0.3s
 ✔ Container myapp-web-1       Started                                     0.3s
```

## Cara Kerja

```text
   [web] ◄──(frontend-net)──► [api] ◄──(backend-net)──► [db]
     ▲                                                    │
     │                                                    │
     └────────── ISOLASI TOTAL: web TIDAK BISA ───────────┘
                 berkomunikasi langsung ke db
```

**Hafalan:**

```text
Automatic DNS  → Service 'web' memanggil service 'db' cukup dengan nama hostname "db"
networks:      → Membuat jaringan terisolasi untuk memisahkan service publik & database privat
```

## Best Practice & Kesalahan Umum

- ✅ Manfaatkan Embedded DNS bawaan Compose: gunakan nama service (`db`, `cache`) sebagai konfigurasi `DB_HOST` aplikasi Anda.
- ❌ Jangan pernah menghubungkan kontainer menggunakan IP address yang di-hardcode.

---

<a id="bagian-15"></a>

# 15. 🟡 Dependensi Urutan Booting: Depends On (depends_on & service_healthy)

## Konsep

Dalam aplikasi nyata, backend tidak boleh menyala sebelum database siap melayani koneksi. Jika backend menyala lebih cepat dari database, backend akan langsung crash (*Database Connection Refused*).

Atribut **`depends_on`** digunakan untuk mengatur urutan prioritas pembuatan dan penyalaan service.

### 2 Tingkatan `depends_on`:
1. **Level Sederhana (Hanya Urutan Start):**
   `depends_on: [db]` -> Hanya memastikan kontainer `db` dinyalakan terlebih dahulu, **TIDAK MENJAMIN** database di dalamnya sudah siap menerima query.
2. **Level Lanjutan (Menunggu Status Sehat / SANGAT DIREKOMENDASIKAN):**
   Menggunakan kombinasi **`condition: service_healthy`** bersamaan dengan blok `healthcheck:`. Backend **HANYA AKAN MENYALA setelah Database berstatus benar-benar Sehat (*Healthy*)**.

## Contoh

```yaml
# compose.yaml
services:
  # 1. Service Database MySQL dengan Healthcheck Aktif
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secret_password
      MYSQL_DATABASE: toko_db
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-psecret_password"]
      interval: 5s
      timeout: 3s
      retries: 5

  # 2. Service Backend Menunggu Database Benar-benar Siap (Healthy)
  backend:
    image: node:20-alpine
    depends_on:
      db:
        condition: service_healthy
    environment:
      DB_HOST: db
    command: ["npm", "start"]
```

## Output

```text
[+] Running 2/2
 ✔ Container myapp-db-1       Healthy                                     12.4s
 ✔ Container myapp-backend-1  Started                                     12.6s
```

(Perhatikan: `backend` menunggu dengan sabar hingga `db` berstatus **Healthy** sebelum menyala!).

## Cara Kerja

```text
         docker compose up
                 │
                 ▼
         Nyalakan Service 'db' (Status: starting)
                 │
                 ▼ (MySQL inisialisasi database di background...)
         Healthcheck Berhasil! (Status: healthy)
                 │
                 ▼
         Nyalakan Service 'backend' (Aman 100% dari Crash!)
```

**Hafalan:**

```text
depends_on:
  service_name:
    condition: service_healthy → Menunggu service dependensi berstatus Healthy sebelum start
```

## Best Practice & Kesalahan Umum

- ✅ Selalu gunakan pola `condition: service_healthy` untuk dependensi database agar backend tidak mengalami crash saat booting.
- ❌ Jangan hanya menggunakan `depends_on: [db]` sederhana jika aplikasi backend Anda tidak memiliki logika *auto-reconnect retry* bawaan.

---

<a id="bagian-16"></a>

# 16. 🟡 Restart Policy (restart: always, unless-stopped)

## Konsep

Atribut **`restart:`** menentukan kebijakan Docker Engine saat kontainer mengalami crash (*abnormal exit*) atau saat mesin server host dinyalakan ulang (*server reboot*).

Pilihan Nilai:
- **`no` (Default):** Jangan me-restart kontainer secara otomatis.
- **`always`:** Selalu me-restart kontainer dalam kondisi apa pun.
- **`on-failure`:** Me-restart kontainer hanya jika proses aplikasi di dalamnya crash (*exit code* non-nol).
- **`unless-stopped` (Sangat Direkomendasikan):** Selalu me-restart kontainer, KECUALI jika kontainer dihentikan secara sengaja melalui perintah `docker compose stop`.

## Contoh

```yaml
# compose.yaml
services:
  web:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"

  worker:
    image: node:20-alpine
    restart: on-failure
    command: ["node", "worker.js"]
```

## Output

```bash
docker compose up -d
docker compose ps
```

```text
NAME              IMAGE          STATUS         PORTS
myapp-web-1       nginx:alpine   Up 5 seconds   0.0.0.0:80->80/tcp
myapp-worker-1    node:20-alpine Up 5 seconds   
```

(Jika server host di-reboot, service `web` akan otomatis langsung menyala kembali!).

## Cara Kerja

```text
         Server Host Reboot
                 │
                 ▼
         Docker Engine membaca konfigurasi compose: restart: unless-stopped
                 │
                 ▼
         Kontainer otomatis di-boot ulang ke memori
```

**Hafalan:**

```text
restart: unless-stopped → Kebijakan terbaik: otomatis menyala kembali kecuali dihentikan manual
restart: on-failure     → Restart otomatis hanya jika aplikasi mengalami crash
```

## Best Practice & Kesalahan Umum

- ✅ Pasang `restart: unless-stopped` pada seluruh service backend dan database yang berjalan di server produksi.
- ❌ Hindari menggunakan `restart: always` pada script migrasi atau seeder yang tugasnya hanya berjalan satu kali (*one-off tasks*).

---

<a id="bagian-17"></a>

# 17. 🟡 Resource Limits (deploy.resources.limits)

## Konsep

Untuk mencegah satu kontainer yang mengalami kebocoran memori (*memory leak*) atau lonjakan komputasi memonopoli seluruh sumber daya CPU dan RAM server, kita wajib membatasi kapasitas maksimum sumber daya menggunakan blok **`deploy.resources.limits`**.

Parameter Pembatasan:
- **`cpus:`:** Batas alokasi core CPU (misal: `'0.5'` untuk 50% core CPU, `'2.0'` untuk 2 core penuh).
- **`memory:`:** Batas alokasi RAM maksimal (misal: `512M`, `1G`, `2G`).

## Contoh

```yaml
# compose.yaml
services:
  api-service:
    image: node:20-alpine
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 128M

  cache:
    image: redis:alpine
    deploy:
      resources:
        limits:
          memory: 256M
```

## Output

Memverifikasi batas memori via `docker stats`:
```bash
docker stats --no-stream
```

```text
CONTAINER ID   NAME                  CPU %     MEM USAGE / LIMIT     MEM %
1a2b3c4d5e6f   myapp-api-service-1   0.12%     35.4MiB / 512MiB      6.91%
8a9b0c1d2e3f   myapp-cache-1         0.04%     8.21MiB / 256MiB      3.21%
```

## Cara Kerja

```text
         Compose menyetel parameter cgroups ke Docker Daemon
                               │
                               ▼
         Kontainer dibatasi maksimal 512MB RAM & 1 Core CPU
```

**Hafalan:**

```text
deploy:
  resources:
    limits:
      cpus: '0.5'     → Batas maksimal CPU 0.5 Core
      memory: 512M    → Batas maksimal RAM 512 Megabyte
```

## Best Practice & Kesalahan Umum

- ✅ Selalu tetapkan batas `limits.memory` pada seluruh service di file compose staging dan produksi.
- ❌ Jangan menyetel nilai batas memori terlalu kecil di bawah kapasitas minimal startup runtime aplikasi Anda.

---

<a id="bagian-18"></a>

# 18. 🟡 Custom Dockerfile Build (build: & dockerfile:)

## Konsep

Selain menarik image jadi dari Docker Hub (`image:`), Docker Compose dapat mengompilasi dan membangun Dockerfile lokal milik kita sendiri secara otomatis menggunakan atribut **`build:`**.

Atribut Konfigurasi Build:
- **`context:`:** Direktori root build context tempat file aplikasi berada (misal: `./backend` atau `.`).
- **`dockerfile:`:** Nama file Dockerfile jika menggunakan nama kustom (misal: `Dockerfile.dev` atau `Dockerfile.prod`).
- **`args:`:** Mengirimkan argumen build (*build arguments* `ARG`) ke dalam Dockerfile.
- **`image:` (Opsional):** Memberikan nama tag pada image yang dihasilkan dari proses build lokal tersebut.

Perintah Rebuild:
```bash
docker compose up -d --build
```

## Contoh

```yaml
# compose.yaml
services:
  # Membangun image kustom dari folder ./backend
  backend-api:
    build:
      context: ./backend
      dockerfile: Dockerfile
      args:
        NODE_ENV: development
    image: my-company/backend-api:local
    ports:
      - "3000:3000"

  # Database menggunakan image publik resmi
  database:
    image: postgres:16-alpine
```

Struktur Folder:
```text
project-root/
├── compose.yaml
└── backend/
    ├── Dockerfile
    ├── package.json
    └── src/
```

## Output

```bash
docker compose up -d --build
```

```text
[+] Building 3.2s (10/10) FINISHED
 => => naming to docker.io/my-company/backend-api:local
[+] Running 2/2
 ✔ Container project-database-1     Started                                0.3s
 ✔ Container project-backend-api-1  Started                                0.3s
```

## Cara Kerja

```text
         docker compose up -d --build
                      │
                      ▼
         Eksekusi build pada ./backend/Dockerfile
                      │
                      ▼
         Beri tag: my-company/backend-api:local
                      │
                      ▼
         Nyalakan kontainer dari image hasil build tersebut!
```

**Hafalan:**

```text
build:
  context: ./path     → Direktori tempat Dockerfile dan source code berada
  dockerfile: file    → Nama file Dockerfile (default: Dockerfile)
docker compose up --build → Memaksa kompilasi ulang image lokal saat menyalakan service
```

## Best Practice & Kesalahan Umum

- ✅ Selalu sertakan flag `--build` (`docker compose up -d --build`) saat Anda baru saja mengubah isi kode program atau dependensi di Dockerfile lokal.
- ❌ Jangan lupa membuat file `.dockerignore` di dalam folder context agar proses build lokal tetap cepat.

---

<a id="bagian-19"></a>

# 19. 🟡 Health Check (healthcheck:)

## Konsep

Blok **`healthcheck:`** di dalam Docker Compose memungkinkan kita mendefinisikan pengujian kesehatan service secara periodik langsung dari file `compose.yaml` tanpa perlu mengubah isi file Dockerfile asli.

Parameter Konfigurasi:
- **`test:`:** Perintah pengujian (misal: `["CMD", "curl", "-f", "http://localhost:3000/health"]` atau `["CMD-SHELL", "pg_isready -U postgres"]`).
- **`interval:`:** Jarak waktu antar pengujian (misal: `10s`).
- **`timeout:`:** Batas waktu respons perintah (misal: `5s`).
- **`retries:`:** Toleransi jumlah kegagalan (misal: `3`).
- **`start_period:`:** Waktu jeda inisialisasi awal saat booting (misal: `15s`).

## Contoh

```yaml
# compose.yaml
services:
  web-service:
    image: nginx:alpine
    ports:
      - "80:80"
    healthcheck:
      test: ["CMD-SHELL", "wget -q --spider http://localhost/ || exit 1"]
      interval: 10s
      timeout: 3s
      retries: 3
      start_period: 5s

  postgres-db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 5
```

## Output

Memeriksa status kesehatan seluruh service:
```bash
docker compose ps
```

```text
NAME                     IMAGE                STATUS                    PORTS
myapp-postgres-db-1      postgres:16-alpine   Up 20 seconds (healthy)   5432/tcp
myapp-web-service-1      nginx:alpine         Up 20 seconds (healthy)   0.0.0.0:80->80/tcp
```

## Cara Kerja

```text
         Setiap 10 Detik: Eksekusi test di dalam kontainer
                                │
                 ┌──────────────┴──────────────┐
           [Exit Code 0]                 [Exit Code 1]
                 │                             │
                 ▼                             ▼
          Status: (healthy)             Status: (unhealthy)
```

**Hafalan:**

```text
healthcheck:
  test: ["CMD", "curl", "-f", "url"] → Perintah pengujian kesehatan kontainer
  interval: 10s                      → Frekuensi pengujian berkala
```

## Best Practice & Kesalahan Umum

- ✅ Pasang Healthcheck pada seluruh service kunci (Database, Redis, API) agar service lain yang bergantung via `depends_on` dapat sinkron secara presisi.
- ❌ Pastikan tool utilitas uji (seperti `wget`, `curl`, atau `pg_isready`) tersedia di dalam image yang digunakan.

---

<a id="bagian-20"></a>

# 20. 🔴 Extend Service & Overrides (extends: & docker-compose.override.yml)

## Konsep

Dalam proyek profesional, kita sering membutuhkan **konfigurasi yang berbeda antara lingkungan Development dan Production** (misal: di dev kita butuh bind mounts hot-reload dan debug port, sedangkan di prod kita butuh image build statis dan restart policy ketat).

Docker Compose menyediakan 2 mekanisme pewarisan konfigurasi:
1. **Pewarisan Otomatis File Override (`docker-compose.override.yml`):**
   Secara default, jika file `docker-compose.override.yml` ada di folder proyek, Docker Compose akan **secara otomatis menggabungkan (*merge*) isinya** di atas file `compose.yaml` utama.
2. **Multiple Compose Files (`-f / --file`):**
   Menggabungkan beberapa file secara manual:
   `docker compose -f compose.yaml -f compose.prod.yaml up -d`
3. **Instruksi `extends:`:** Mewarisi konfigurasi dari service lain yang ada di file yang sama atau file berbeda.

## Contoh

File Konfigurasi Utama (`compose.yaml`):
```yaml
# compose.yaml (Konfigurasi Dasar Bersama)
services:
  app:
    image: node:20-alpine
    environment:
      APP_NAME: "Toko App"
```

File Konfigurasi Override Development (`compose.override.yaml`):
```yaml
# compose.override.yaml (Khusus Development Lokal)
services:
  app:
    ports:
      - "3000:3000"
    volumes:
      - ./src:/app/src
    command: ["npm", "run", "dev"]
```

File Konfigurasi Produksi (`compose.prod.yaml`):
```yaml
# compose.prod.yaml (Khusus Server Produksi)
services:
  app:
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 1G
```

Eksekusi CLI di Server Produksi:
```bash
# Menggabungkan konfigurasi dasar + produksi (override dev otomatis diabaikan jika nama file eksplisit)
docker compose -f compose.yaml -f compose.prod.yaml up -d
```

## Output

Memeriksa hasil penggabungan (*Merged Config*):
```bash
docker compose -f compose.yaml -f compose.prod.yaml config
```

```text
name: myapp
services:
  app:
    environment:
      APP_NAME: Toko App
    image: node:20-alpine
    restart: unless-stopped
```

## Cara Kerja

```text
   compose.yaml (Base)  +  compose.prod.yaml (Production)
            │                         │
            └────────────┬────────────┘
                         │ (Deep Merge)
                         ▼
             Merged Config Siap Dijalankan!
```

**Hafalan:**

```text
compose.override.yaml        → Otomatis digabung saat 'docker compose up' (khusus dev)
docker compose -f f1 -f f2   → Menggabungkan beberapa file compose secara eksplisit
```

## Best Practice & Kesalahan Umum

- ✅ Pisahkan konfigurasi sensitif development ke dalam `compose.override.yaml` dan masukkan ke dalam `.gitignore`.
- ❌ Jangan menaruh konfigurasi port development yang terbuka lebar di dalam file `compose.yaml` dasar.

---

<a id="bagian-21"></a>

# 21. 🔴 Compose File Interpolation & .env Variables (${VAR:-default})

## Konsep

Docker Compose mendukung fitur **Interpolasi Variabel (*Variable Interpolation*)**, yaitu menyuntikkan nilai dari file `.env` atau environment host langsung ke dalam teks file `compose.yaml` menggunakan sintaks **`${VARIABLE_NAME}`**.

Format Sintaks Interpolasi:
- **`${VAR}`:** Mengambil nilai variabel `VAR`.
- **`${VAR:-default_value}` (Fallback Default):** Jika `VAR` belum disetel atau kosong, gunakan nilai `default_value`.
- **`${VAR:?error_message}` (Wajib Ada):** Jika `VAR` belum disetel, hentikan proses build dan tampilkan pesan error.

## Contoh

File `compose.yaml`:
```yaml
# compose.yaml
services:
  web:
    # Menggunakan tag image dinamis (default: latest jika tidak diisi)
    image: nginx:${NGINX_VERSION:-alpine}
    # Menggunakan port dinamis (default: 8080)
    ports:
      - "${APP_PORT:-8080}:80"
    environment:
      # Wajib ada DB_PASSWORD, jika tidak ada proses berhenti dengan pesan error
      DB_PASS: ${DB_PASSWORD:?Error: DB_PASSWORD wajib disetel di file .env!}
```

File `.env`:
```text
# .env
NGINX_VERSION=1.25-alpine
APP_PORT=9000
DB_PASSWORD=secret_database_password_2026
```

## Output

Memeriksa hasil interpolasi variabel via `docker compose config`:
```bash
docker compose config
```

```text
name: myapp
services:
  web:
    environment:
      DB_PASS: secret_database_password_2026
    image: nginx:1.25-alpine
    ports:
      - mode: ingress
        target: 80
        published: "9000"
        protocol: tcp
```

## Cara Kerja

```text
         File .env (APP_PORT=9000)
                     │
                     ▼
         compose.yaml: ports: ["${APP_PORT:-8080}:80"]
                     │
                     ▼
         Hasil Evaluasi Nyata: ports: ["9000:80"]
```

**Hafalan:**

```text
${VAR}             → Mengambil nilai variabel dari .env
${VAR:-default}    → Menggunakan nilai fallback 'default' jika variabel belum disetel
${VAR:?error_msg}  → Menolak berjalan & menampilkan pesan error jika variabel kosong
```

## Best Practice & Kesalahan Umum

- ✅ Selalu sediakan nilai fallback default (`${PORT:-3000}`) agar file compose tetap bisa berjalan normal meskipun developer baru lupa membuat file `.env`.
- ❌ Jangan mengabaikan pesan error `${VAR:?error}` pada variabel kredensial penting.

---

<a id="bagian-22"></a>

# 22. 🔴 Scaling Services (docker compose up --scale)

## Konsep

**Scaling Services** adalah kemampuan Docker Compose untuk menduplikasi dan menjalankan **banyak instance kontainer sekaligus dari satu definisi service yang sama** (*Horizontal Scaling*) untuk mendistribusikan beban kerja (*Load Balancing*).

Format Sintaks CLI:
```bash
docker compose up -d --scale <service_name>=<number_of_instances>
```

Syarat Penting Service yang Bisa Di-Scale:
- Service **TIDAK BOLEH** memiliki binding port host statis (misal `ports: - "80:80"`) karena port 80 di host akan bentrok. Gunakan port acak (misal `ports: - "80"`) atau letakkan di belakang Reverse Proxy (seperti Nginx / Traefik).
- Service **TIDAK BOLEH** memiliki atribut `container_name:` statis.

## Contoh

```yaml
# compose.yaml
services:
  # Reverse Proxy Load Balancer Publik
  nginx-lb:
    image: nginx:alpine
    ports:
      - "80:80"
    depends_on:
      - worker

  # Service Worker Backend yang Siap Di-Scale (Tanpa static port & container_name)
  worker:
    image: node:20-alpine
    command: ["node", "-e", "console.log('Worker aktif ID:', process.env.HOSTNAME); setInterval(()=>{}, 1000)"]
```

Menjalankan 3 Instance Worker Sekaligus:
```bash
# Menyalakan 3 kontainer worker bersamaan
docker compose up -d --scale worker=3
```

## Output

```text
[+] Running 4/4
 ✔ Container myapp-worker-1    Started                                     0.3s
 ✔ Container myapp-worker-2    Started                                     0.3s
 ✔ Container myapp-worker-3    Started                                     0.3s
 ✔ Container myapp-nginx-lb-1  Started                                     0.4s
```

Melihat daftar kontainer hasil scaling:
```bash
docker compose ps
```

```text
NAME                IMAGE          STATUS         PORTS
myapp-nginx-lb-1    nginx:alpine   Up 5 seconds   0.0.0.0:80->80/tcp
myapp-worker-1      node:20-alpine Up 5 seconds   
myapp-worker-2      node:20-alpine Up 5 seconds   
myapp-worker-3      node:20-alpine Up 5 seconds   
```

## Cara Kerja

```text
                       Trafik Masuk (Port 80)
                                 │
                                 ▼
                     [ Nginx Load Balancer ]
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
   [ worker-1 ]            [ worker-2 ]            [ worker-3 ]
 (Kontainer #1)          (Kontainer #2)          (Kontainer #3)
```

**Hafalan:**

```text
docker compose up -d --scale service=N → Menjalankan N instance kontainer dari satu service
Hindari Static Port & container_name   → Syarat mutlak agar service bisa di-scale tanpa error
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan scaling untuk kontainer antrean tugas (*background queue workers*) atau microservices API tanpa status (*stateless*).
- ❌ Jangan mencoba men-scale database berstatus tunggal (*single-instance stateful database*) dengan `--scale db=3` karena data storage akan bertabrakan.

---

<a id="bagian-23"></a>

# 23. 🛠️ Peta Ingatan Cepat

## Mental Model Hubungan Entitas di Docker Compose

```text
                      ┌───────────────────────────────┐
                      │     compose.yaml Project      │
                      └───────────────┬───────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        ▼                             ▼                             ▼
   Services (Kontainer)          Networks (Jaringan)           Volumes (Data)
   - image / build               - Default Virtual Bridge      - Named Volumes (Persist)
   - ports ("8080:80")           - Custom Network DNS          - Bind Mounts (./src)
   - environment / env_file      - Automatic Service Hostname  - db_data:/var/lib/mysql
   - depends_on (Healthcheck)    - Isolated Backend Net        - Top-Level Declaration
        │                             │                             │
        └─────────────────────────────┼─────────────────────────────┘
                                      │
                                      ▼
                        Siklus Hidup & Eksekusi CLI
                        - docker compose up -d
                        - docker compose down -v
                        - docker compose exec <srv> sh
                        - docker compose logs -f
```

## Pohon Keputusan Fitur Docker Compose

```text
                                Kebutuhan Arsitektur Compose
                                              │
                   ┌──────────────────────────┴──────────────────────────┐
                   ▼                                                     ▼
         Kontainer Butuh Tunggu DB?                            File Kode Butuh Edit Live?
                   │                                                     │
                   ▼                                                     ▼
              depends_on:                                           Bind Mounts
        condition: service_healthy                               volumes: - ./src:/app
                   │
                   ▼
                               Kebutuhan Multi-Environment?
                                              │
                   ┌──────────────────────────┴──────────────────────────┐
                   ▼                                                     ▼
           Ganti Variabel Saja?                                Ganti Struktur Service?
                   │                                                     │
                   ▼                                                     ▼
        Interpolasi: ${PORT:-8080}                              Multiple Compose Files
             (via file .env)                                   -f compose.yaml -f prod.yaml
```

---

<a id="bagian-24"></a>

# 24. 📚 Tabel Ringkasan

| Perintah / Atribut | Kategori | Contoh Penggunaan | Penjelasan & Kegunaan |
|---|---|---|---|
| **`docker compose up -d`** | CLI | `docker compose up -d --build` | Membangun & menyalakan seluruh service di background |
| **`docker compose down`** | CLI | `docker compose down -v` | Mematikan & membersihkan seluruh kontainer, network, & volume |
| **`docker compose ps`** | CLI | `docker compose ps` | Melihat status running & mapping port seluruh service |
| **`docker compose logs`** | CLI | `docker compose logs -f app` | Memantau log keluaran service secara live real-time |
| **`docker compose exec`** | CLI | `docker compose exec app sh` | Masuk ke terminal shell kontainer yang sedang berjalan |
| **`services:`** | YAML | `services: app:` | Blok utama pendefinisian seluruh kontainer aplikasi |
| **`image:`** | YAML | `image: redis:alpine` | Menentukan image resmi dari Docker Hub |
| **`build:`** | YAML | `build: ./backend` | Mengompilasi image lokal dari Dockerfile |
| **`ports:`** | YAML | `ports: ["8080:80"]` | Forwarding port host laptop ke port container |
| **`environment:`** | YAML | `environment: [NODE_ENV=prod]`| Menyuntikkan variabel environment ke kontainer |
| **`env_file:`** | YAML | `env_file: [.env]` | Membaca variabel dari file konfigurasi eksternal |
| **`volumes:`** | YAML | `volumes: [db_data:/data]` | Memasang persistent named volume atau bind mount |
| **`networks:`** | YAML | `networks: [app-net]` | Menghubungkan service ke virtual bridge network |
| **`depends_on:`** | YAML | `condition: service_healthy` | Mengatur urutan booting menunggu service dependensi sehat |
| **`restart:`** | YAML | `restart: unless-stopped` | Menyalakan kembali kontainer otomatis saat reboot |
| **`healthcheck:`** | YAML | `test: ["CMD", "curl", "-f"]`| Mendefinisikan tes kesehatan internal service |

---

<a id="bagian-25"></a>

# 25. ⚡ Cheat Code Docker Compose 10 Detik

## 1. Template Stack Lengkap Web + Database + Volume
```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    depends_on:
      db:
        condition: service_healthy

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secret
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-psecret"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  db_data:
```

## 2. Perintah Penting Harian
```bash
docker compose up -d --build     # Nyalakan & build ulang
docker compose logs -f --tail 50 # Pantau log 50 baris live
docker compose exec web sh       # Masuk shell
docker compose down -v           # Hapus bersih total
```

---

<a id="bagian-26"></a>

# 26. 🧭 Urutan Belajar yang Disarankan

Untuk menguasai orkestrasi Docker Compose dari tingkat pemula hingga tingkat lanjut, ikuti 4 fase bertahap berikut:

```text
                   FASE 1: Fondasi File Compose & CLI Dasar (Minggu 1)
       ┌─────────────────────────────────────────────────────────────┐
       │ 1. Menguasai sintaks YAML (2 spasi) & nama file compose.yaml│
       │ 2. Memahami blok services:, image:, dan ports: ["8080:80"]  │
       │ 3. Perintah siklus hidup: up -d, down, stop, start, ps      │
       │ 4. Pemantauan log gabungan: docker compose logs -f          │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
                   FASE 2: Konfigurasi, Storage & Jaringan (Minggu 2)
       ┌─────────────────────────────────────────────────────────────┐
       │ 5. Mengelola variabel: environment: dan file rahasia env_file│
       │ 6. Bind mounts (./src:/app) untuk hot-reload development     │
       │ 7. Named Volume persisten untuk database + deklarasi root   │
       │ 8. Custom bridge networks & DNS hostname resolution         │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
                   FASE 3: Keandalan & Sinkronisasi Booting (Minggu 3)
       ┌─────────────────────────────────────────────────────────────┐
       │ 9. Mengonfigurasi healthcheck: pada database & cache        │
       │ 10. Mengatur dependensi ketat: depends_on + service_healthy  │
       │ 11. Memasang kebijakan restart: unless-stopped & limit RAM  │
       │ 12. Mengompilasi Dockerfile lokal via blok build:           │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
                   FASE 4: Operasional Lanjutan & Mini Project (Minggu 4)
       ┌─────────────────────────────────────────────────────────────┐
       │ 13. Interpolasi variabel: ${PORT:-8080} via file .env        │
       │ 14. Multiple compose files & compose.override.yaml          │
       │ 15. Scaling service stateless: docker compose up --scale    │
       │ 16. Mengerjakan Mini Project Stack Microservices Lengkap    │
       └─────────────────────────────────────────────────────────────┘
```

---

<a id="bagian-27"></a>

# 27. 🏗️ Mini Project: Stack Microservices Lengkap (Nginx Proxy + Node.js API + Redis Cache + MySQL Database)

## Konsep Project

Project ini membangun satu kesatuan sistem aplikasi web berskala enterprise (*Production-Ready Microservices Architecture*) menggunakan 4 service yang saling terintegrasi penuh di dalam satu file `compose.yaml`:
1. **Service `proxy` (Nginx Reverse Proxy):** Pintu gerbang publik (*Port 80*) yang meneruskan trafik HTTP ke backend API.
2. **Service `api` (Node.js REST API):** Backend service yang terhubung ke database dan in-memory cache.
3. **Service `cache` (Redis):** Menyimpan session dan query cache sementara.
4. **Service `database` (MySQL 8.0):** Database utama persisten dengan named volume dan healthcheck ketat.
5. **Fitur Keamanan & Keandalan:**
   - `depends_on: condition: service_healthy` menjamin backend API hanya menyala saat database & Redis sudah 100% siap.
   - Dual Network: `public-net` untuk proxy dan `internal-net` untuk database/cache.
   - Named Volume `db_data` untuk persistensi.
   - Variable Interpolation via file `.env`.

## File Konfigurasi: compose.yaml

```yaml
name: ecommerce-microservices

services:
  # 1. Reverse Proxy Publik
  proxy:
    image: nginx:alpine
    ports:
      - "${PUBLIC_PORT:-8080}:80"
    depends_on:
      api:
        condition: service_started
    networks:
      - public-net
    restart: unless-stopped

  # 2. Backend REST API
  api:
    image: node:20-alpine
    working_dir: /app
    environment:
      NODE_ENV: production
      PORT: 3000
      DB_HOST: database
      DB_NAME: ${DB_NAME:-toko_db}
      DB_USER: ${DB_USER:-app_user}
      DB_PASS: ${DB_PASSWORD:-password_aman}
      REDIS_HOST: cache
    depends_on:
      database:
        condition: service_healthy
      cache:
        condition: service_healthy
    networks:
      - public-net
      - internal-net
    restart: unless-stopped
    command: ["node", "-e", "console.log('Backend API Sukses Terhubung ke Database & Cache!'); setInterval(()=>{}, 1000)"]

  # 3. Redis In-Memory Cache
  cache:
    image: redis:alpine
    networks:
      - internal-net
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    restart: unless-stopped

  # 4. Database MySQL Persisten
  database:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD:-supersecretroot}
      MYSQL_DATABASE: ${DB_NAME:-toko_db}
      MYSQL_USER: ${DB_USER:-app_user}
      MYSQL_PASSWORD: ${DB_PASSWORD:-password_aman}
    volumes:
      - mysql_storage:/var/lib/mysql
    networks:
      - internal-net
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p${DB_ROOT_PASSWORD:-supersecretroot}"]
      interval: 5s
      timeout: 3s
      retries: 5
    restart: unless-stopped

# Jaringan Terisolasi
networks:
  public-net:
  internal-net:

# Volume Persisten
volumes:
  mysql_storage:
```

## File Pendukung: .env

```text
PUBLIC_PORT=80
DB_NAME=toko_online_db
DB_USER=toko_user
DB_PASSWORD=PasswordRahasia2026
DB_ROOT_PASSWORD=SuperSecretRootPassword2026
```

## Langkah Eksekusi CLI

```bash
# 1. Menyalakan seluruh stack sistem multi-kontainer
docker compose up -d

# 2. Memeriksa status kesehatan seluruh service
docker compose ps
```

## Output

```text
[+] Running 7/7
 ✔ Network ecommerce-microservices_public-net    Created                   0.0s
 ✔ Network ecommerce-microservices_internal-net  Created                   0.0s
 ✔ Volume ecommerce-microservices_mysql_storage  Created                   0.0s
 ✔ Container ecommerce-microservices-cache-1     Healthy                   6.2s
 ✔ Container ecommerce-microservices-database-1  Healthy                  14.5s
 ✔ Container ecommerce-microservices-api-1       Started                  14.7s
 ✔ Container ecommerce-microservices-proxy-1     Started                  15.1s

NAME                                  IMAGE          STATUS                    PORTS
ecommerce-microservices-api-1         node:20-alpine Up 2 seconds              
ecommerce-microservices-cache-1       redis:alpine   Up 15 seconds (healthy)   6379/tcp
ecommerce-microservices-database-1    mysql:8.0      Up 15 seconds (healthy)   3306/tcp
ecommerce-microservices-proxy-1       nginx:alpine   Up 1 second               0.0.0.0:80->80/tcp
```

## Cara Kerja

```text
       Browser User (Port 80)
                 │
                 ▼ (public-net)
       [ proxy: Nginx Reverse Proxy ]
                 │
                 ▼ (public-net)
       [ api: Node.js Backend ]
                 │
        ┌────────┴────────────────────────┐
        │                                 │
        ▼ (internal-net)                  ▼ (internal-net)
   [ cache: Redis ]              [ database: MySQL 8.0 ]
                                          │
                                          ▼
                                 [ Volume: mysql_storage ]
```

**Hafalan:**

```text
Enterprise Microservices Pattern = Dual Networks (Public/Internal) + Healthcheck Sync + Named Volumes + .env
```

---

<a id="bagian-28"></a>

# 28. 🔗 Referensi Resmi

Untuk mempelajari dokumentasi resmi, spesifikasi teknis, dan praktik terbaik Docker Compose:

- [Docker Official Documentation — Docker Compose](https://docs.docker.com/compose/)
- [Compose Specification (Official Standard Spec)](https://compose-spec.io/)
- [Compose File Reference (YAML Attributes & Syntax)](https://docs.docker.com/compose/compose-file/)
- [Docker Compose CLI Command Reference](https://docs.docker.com/compose/reference/)
- [Sample Apps with Docker Compose (GitHub Official Samples)](https://github.com/docker/awesome-compose)

> **Catatan Versi:** Cheatsheet ini disusun mengacu pada spesifikasi **Compose Specification / Compose V2 (Docker Engine v26+)**. Seluruh sintaks perintah CLI yang dibahas menggunakan format standar resmi `docker compose` (dengan spasi).
