---
title: "Docker Dasar"
description: "Fundamental containerization Docker: Mental model container vs VM, Docker architecture, CLI commands (run, ps, stop, rm, exec), Image management, dan Docker Hub."
order: 1
tags:
  - devops
  - docker
  - containers
  - fundamental
---

# Docker Dasar

> **Target:** Pemula yang baru mengenal Docker dan container, serta ingin menguasai perintah Docker CLI untuk deployment dan operasional kontainer aplikasi.
> **Versi:** Docker Engine 24+ / 26+
> Fokus modul pembelajaran ini: **konsep container vs VM → arsitektur Docker → image & container lifecycle → logs & exec → port mapping & env → stats & resource limit → bind mounts & volume → backup/restore volume → custom bridge network & DNS → inspect & prune → restart policy & health check → mini project multi-container**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami untuk mengunduh image, menjalankan container, port forwarding, dan membaca log

🟡 Lanjutan
→ pelajari setelah fundamental nyaman: persistent volume, backup/restore, custom network DNS, & limit

🔴 Advanced / Operasional
→ penting untuk keandalan server produksi: restart policy, health check, & garbage collection
```

Mental model ekosistem kontainerisasi di Docker Engine:

```text
                 Docker Engine (Host Server)
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
    Docker Images     Running Containers   Storage & Networks
    - pull / rmi      - run / start / stop - Named Volumes (-v)
    - Layered storage - logs / exec        - Custom Bridge (--network)
    - Hub Registry    - Resource Limits    - Port Publishing (-p)
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                             ▼
         Aplikasi Terisolasi, Cepat, & Portabel di Mana Saja
```

**Hafalan:**

```text
Image     → Template cetak biru read-only yang berisi OS mini + aplikasi + dependensi
Container → Instance aktif yang berjalan di memori dari sebuah image (Writable layer)
Registry  → Gudang cloud pusat penyimpanan dan distribusi image (Docker Hub)
Volume    → Media penyimpanan data permanen di luar siklus hidup kontainer
Network   → Jembatan virtual komunikasi antar kontainer menggunakan DNS name
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Container & Isolasi Proses](#bagian-1)
2. [Pengenalan Docker & Nilai Tambah Kontainerisasi](#bagian-2)
3. [Arsitektur Docker (Client, Docker Daemon, Host, Registry)](#bagian-3)
4. [Menginstall & Verifikasi Docker Engine](#bagian-4)
5. [Docker Registry & Docker Hub](#bagian-5)
6. [Docker Image (Pull, List, Tag, & Remove)](#bagian-6)
7. [Docker Container Lifecycle (Run, Start, Stop, Restart, & Remove)](#bagian-7)
8. [Container Log & Monitoring Output (docker logs)](#bagian-8)
9. [Container Exec & Akses Shell Interaktif (docker exec)](#bagian-9)
10. [Container Port Publishing (-p host:container)](#bagian-10)
11. [Container Environment Variable (-e KEY=VAL & --env-file)](#bagian-11)

### 🟡 Lanjutan

12. [Container Stats & Pemantauan Resource Real-time (docker stats)](#bagian-12)
13. [Container Resource Limit (Memory --memory & CPU --cpus)](#bagian-13)
14. [Bind Mounts (Menghubungkan Folder Host Langsung)](#bagian-14)
15. [Docker Volume (Persistent Data Terisolasi)](#bagian-15)
16. [Container Volume (Memasang Named Volume ke Container)](#bagian-16)
17. [Backup Volume (Ekspor Data Volume ke File Tar)](#bagian-17)
18. [Restore Volume (Impor Data Tar ke Volume Baru)](#bagian-18)
19. [Docker Network (Bridge, Host, None)](#bagian-19)
20. [Container Network (Komunikasi Antar Container via DNS Name)](#bagian-20)
21. [Docker Inspect (Inspeksi Konfigurasi JSON & IP Address)](#bagian-21)
22. [Docker Prune & Garbage Collection (Membersihkan Sampah Disk)](#bagian-22)

### 🔴 Advanced / Operasional

23. [Container Restart Policy (--restart=always, unless-stopped, on-failure)](#bagian-23)
24. [Container Health Check (--health-cmd & Status Kesehatan Kontainer)](#bagian-24)

### 🛠️ Referensi & Praktik

25. [Peta Ingatan Cepat](#bagian-25)
26. [Tabel Ringkasan](#bagian-26)
27. [Cheat Code Docker CLI 10 Detik](#bagian-27)
28. [Urutan Belajar yang Disarankan](#bagian-28)
29. [Mini Project: Menjalankan Stack Web Server Nginx + Node.js + Database MySQL Terisolasi](#bagian-29)
30. [Referensi Resmi](#bagian-30)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan Container & Isolasi Proses

#### Konsep

**Container** adalah unit standar perangkat lunak yang mengemas kode aplikasi beserta seluruh dependensi (*runtime*, pustaka, konfigurasi sistem, dan file binari) ke dalam satu wadah terisolasi yang dapat berjalan secara konsisten di lingkungan komputasi apa pun (laptop developer, server staging, hingga cloud production).

##### Mengapa Kita Membutuhkan Container?
Masalah klasik programmer adalah *"It works on my machine"* (program berjalan normal di laptop developer, tetapi crash/rusak saat di-deploy ke server produksi akibat perbedaan versi OS, modul, atau dependensi sistem). Container menyelesaikan masalah ini secara tuntas dengan menjamin lingkungan eksekusi yang identik 100%.

##### Perbedaan Mendasar Container vs Virtual Machine (VM):
- **Virtual Machine (VM):** Mengemulasi perangkat keras lengkap (*hardware level*) dan mewajibkan instalasi Sistem Operasi Tamu (*Guest OS*) penuh yang memakan ruang gigabyte dan booting dalam hitungan menit.
- **Container:** Berjalan di level sistem operasi (*OS level virtualization*). Seluruh container **berbagi Kernel Host yang sama** dan hanya mengemas aplikasi + dependensinya saja, sehingga berukuran sangat kecil (megabyte) dan menyala (*start*) dalam hitungan milidetik.

#### Contoh

```bash
# Menjalankan kontainer Linux Ubuntu terisolasi hanya dalam 1 detik
docker run -it --rm ubuntu:22.04 bash

# Di dalam terminal kontainer:
cat /etc/os-release
exit
```

#### Output

```text
root@a1b2c3d4e5f6:/# cat /etc/os-release
NAME="Ubuntu"
VERSION="22.04.4 LTS (Jammy Jellyfish)"
ID=ubuntu
PRETTY_NAME="Ubuntu 22.04.4 LTS"
root@a1b2c3d4e5f6:/# exit
```

#### Cara Kerja

```text
         Virtual Machine Architecture            Container Architecture
       ┌──────────────────────────────┐        ┌──────────────────────────────┐
       │ App A  │ App B  │ App C      │        │ App A  │ App B  │ App C      │
       ├────────┼────────┼────────────┤        ├────────┼────────┼────────────┤
       │ Guest  │ Guest  │ Guest      │        │ Bins & │ Bins & │ Bins &     │
       │ OS 1   │ OS 2   │ OS 3       │        │ Libs   │ Libs   │ Libs       │
       ├──────────────────────────────┤        ├──────────────────────────────┤
       │ Hypervisor (VMware/VirtualBox│        │ Container Engine (Docker)    │
       ├──────────────────────────────┤        ├──────────────────────────────┤
       │ Host Operating System        │        │ Host Operating System Kernel │
       ├──────────────────────────────┤        ├──────────────────────────────┤
       │ Server Hardware (CPU/RAM)    │        │ Server Hardware (CPU/RAM)    │
       └──────────────────────────────┘        └──────────────────────────────┘
```

**Hafalan:**

```text
Container → Proses aplikasi terisolasi yang berbagi Kernel Host (ringan, cepat, portabel)
VM        → Emulasi komputer penuh dengan Guest OS mandiri (berat, butuh hypervisor)
```

#### Best Practice & Kesalahan Umum

- ✅ Perlakukan container sebagai entitas sementara (*ephemeral / stateless*); simpan data penting di Volume eksternal.
- ❌ Jangan menganggap container sebagai Virtual Machine penuh yang diisi banyak layanan (database, web server, ssh) dalam 1 container (*One Process Per Container Rule*).

---

<a id="bagian-2"></a>

## 2. 🟢 Pengenalan Docker & Nilai Tambah Kontainerisasi

#### Konsep

**Docker** adalah platform sumber terbuka (*open-source platform*) paling populer di dunia yang mempermudah proses pembuatan (*build*), pengiriman (*ship*), dan eksekusi (*run*) aplikasi di dalam container.

Nilai Tambah Utama Docker:
1. **Konsistensi Lingkungan:** Tidak ada lagi perbedaan konfigurasi antara laptop development, server testing, dan server produksi.
2. **Efisiensi Sumber Daya:** Satu server fisik dapat menjalankan puluhan hingga ratusan container secara bersamaan tanpa overhead OS yang berat.
3. **Isolasi Total:** Jika satu container crash atau terinfeksi bug, container lain dan OS host tetap aman terlindungi.
4. **Kecepatan Deployment:** Menyalakan atau mematikan layanan aplikasi terjadi secara instan dalam hitungan detik (*instant startup*).

#### Contoh

```bash
# Menjalankan web server Nginx secara instan tanpa perlu install Nginx di laptop
docker run -d -p 8080:80 --name web-testing nginx:alpine

# Memeriksa status kontainer yang sedang berjalan
docker ps
```

#### Output

```text
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                  NAMES
f4a8b9c1d2e3   nginx:alpine   "/docker-entrypoint.…"   2 seconds ago   Up 1 second    0.0.0.0:8080->80/tcp   web-testing
```

Buka browser di `http://localhost:8080` -> Tampilan *"Welcome to nginx!"* langsung muncul.

#### Cara Kerja

```text
           Developer Command: docker run ...
                         │
                         ▼
           Docker Engine mengunduh image Nginx
                         │
                         ▼
           Membuat sandbox kontainer terisolasi
                         │
                         ▼
           Web server Nginx aktif di port 8080
```

**Hafalan:**

```text
Docker       → Platform untuk mengotomatisasi deployment aplikasi dalam container
docker run   → Perintah membuat dan langsung menjalankan container baru
docker ps    → Menampilkan daftar kontainer yang sedang aktif berjalan
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan varian image berbasis `alpine` (misal: `nginx:alpine`, `node:alpine`) karena ukurannya sangat ramping (hanya ~5-30MB) dibanding image standar.
- ❌ Jangan mengedit file kode secara manual langsung di dalam container produksi tanpa sinkronisasi volume atau image build baru.

---

<a id="bagian-3"></a>

## 3. 🟢 Arsitektur Docker (Client, Docker Daemon, Host, Registry)

#### Konsep

Docker menggunakan arsitektur **Client-Server**:

Komponen Utama Arsitektur Docker:
1. **Docker Client (`docker` CLI):** Antarmuka baris perintah tempat pengguna mengetikkan instruksi (seperti `docker build`, `docker run`, `docker pull`). Client berkomunikasi dengan Daemon melalui *REST API*.
2. **Docker Daemon (`dockerd` / Docker Host):** Proses server latar belakang yang bertugas berat mengelola seluruh siklus hidup container, image, volume, dan jaringan (*network*).
3. **Docker Registry:** Tempat penyimpanan dan distribusi Docker Image publik/privat (default utama adalah **Docker Hub**).
4. **Docker Objects:** Entitas yang dibuat oleh Docker (Image, Container, Volume, Network).

#### Contoh

```bash
# Memeriksa informasi arsitektur Docker Client dan Server Engine
docker version

# Memeriksa detail status sistem Docker Host
docker info
```

#### Output

```text
Client: Docker Engine - Community
 Version:           26.1.0
 OS/Arch:           linux/amd64

Server: Docker Engine - Community
 Engine:
  Version:          26.1.0
  OS/Arch:          linux/amd64
  Storage Driver:   overlay2
  Cgroup Driver:    systemd
  Runtimes:         runc io.containerd.runc.v2
```

#### Cara Kerja

```text
       Docker Client (CLI)
              │
              │ REST API (Unix Socket / TCP)
              ▼
       Docker Daemon (Host Server)
              │
        ┌─────┴─────────────────────────┐
        ▼                               ▼
  Docker Hub (Registry)          Lokal Docker Engine
  (Tarik / Unduh Image)          ┌─────────────────────┐
                                 │ - Images            │
                                 │ - Running Containers│
                                 │ - Networks & Volumes│
                                 └─────────────────────┘
```

**Hafalan:**

```text
Docker Client → Aplikasi terminal tempat kita mengetikkan perintah 'docker ...'
Docker Daemon → Server engine di background yang memproses instruksi & memutar kontainer
Docker Hub    → Gudang cloud pusat penyimpanan image resmi di seluruh dunia
```

#### Best Practice & Kesalahan Umum

- ✅ Pahami bahwa perintah `docker` yang Anda ketikkan di terminal sebenarnya mengirimkan instruksi HTTP REST API ke Docker Daemon di background.
- ❌ Jika muncul error `Cannot connect to the Docker daemon`, itu artinya service background Docker Engine belum dinyalakan di OS Host.

---

<a id="bagian-4"></a>

## 4. 🟢 Menginstall & Verifikasi Docker Engine

#### Konsep

Untuk mulai menggunakan Docker, kita menginstal **Docker Desktop** (untuk Windows & macOS dengan GUI dashboard terintegrasi) atau **Docker Engine** (untuk server Linux via apt/yum).

Langkah Verifikasi Instalasi:
1. Mengecek ketersediaan perintah `docker --version`.
2. Menjalankan container uji coba resmi **`hello-world`** untuk memastikan Client berhasil berkomunikasi dengan Daemon dan Docker Hub.

#### Contoh

```bash
# 1. Cek versi CLI
docker --version

# 2. Menjalankan kontainer verifikasi resmi
docker run hello-world
```

#### Output

```text
Docker version 26.1.0, build 9714adc

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
 3. The Docker daemon created a new container from that image which runs the executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it to your terminal.
```

#### Cara Kerja

```text
         docker run hello-world
                   │
                   ▼
         Cari image di lokal -> Tidak Ada!
                   │
                   ▼
         Download dari Docker Hub
                   │
                   ▼
         Jalankan container -> Cetak Teks -> Container Selesai (Exited)
```

**Hafalan:**

```text
docker --version     → Memeriksa versi Docker yang terpasang
docker run hello-world → Menjalankan kontainer uji verifikasi koneksi engine
```

#### Best Practice & Kesalahan Umum

- ✅ Pada Windows / macOS, pastikan fitur virtualisasi hardware (VT-x / AMD-V) dan WSL 2 (Windows Subsystem for Linux) sudah aktif di BIOS.
- ❌ Di Linux, tambahkan user Anda ke grup docker (`sudo usermod -aG docker $USER`) agar tidak perlu mengetikkan `sudo` setiap kali menjalankan perintah docker.

---

<a id="bagian-5"></a>

## 5. 🟢 Docker Registry & Docker Hub

#### Konsep

**Docker Registry** adalah sistem penyimpanan terpusat yang bertanggung jawab untuk mengelola dan mendistribusikan Docker Images.

Jenis Registry:
1. **Public Registry (Docker Hub - `hub.docker.com`):** Registry bawaan resmi tempat jutaan open-source image (Node.js, PHP, MySQL, Redis, Python, Nginx) dapat diunduh gratis.
2. **Private Registry:** Registry berbayar atau internal perusahaan (seperti GitHub Container Registry `ghcr.io`, AWS ECR, Google Artifact Registry).

Perintah Autentikasi Registry:
- `docker login`: Masuk ke akun Docker Registry.
- `docker logout`: Keluar dari sesi registry.
- `docker search keyword`: Mencari image publik langsung dari terminal.

#### Contoh

```bash
# 1. Mencari image resmi Redis di Docker Hub
docker search redis --filter "is-official=true"

# 2. Login ke akun Docker Hub
docker login

# 3. Memberi nama tag image sebelum diunggah ke registry
# Format: username/repository:tag
docker tag local-app:latest myusername/my-awesome-app:v1.0.0

# 4. Mengunggah image ke Docker Hub
docker push myusername/my-awesome-app:v1.0.0
```

#### Output

```text
NAME      DESCRIPTION                                     STARS     OFFICIAL
redis     Redis is an open source key-value store that…   13150     [OK]

Login Succeeded
The push refers to repository [docker.io/myusername/my-awesome-app]
v1.0.0: digest: sha256:7f8a9b... size: 1420
```

#### Cara Kerja

```text
   Lokal Mesin Developer                     Docker Hub Cloud Registry
   ┌──────────────────────┐                  ┌──────────────────────┐
   │ my-awesome-app:v1.0  ├──── docker push ─►│ myusername/my-app:v1 │
   └──────────────────────┘                  └──────────┬───────────┘
                                                        │
   Server Produksi (AWS/VPS)                            │
   ┌──────────────────────┐                             │
   │ myusername/my-app:v1 │◄─── docker pull ────────────┘
   └──────────────────────┘
```

**Hafalan:**

```text
docker login              → Masuk ke akun registry untuk akses push/pull privat
docker push image_name:tag → Mengunggah image lokal ke cloud registry
docker pull image_name:tag → Mengunduh image dari registry ke komputer lokal
```

#### Best Practice & Kesalahan Umum

- ✅ Selalu pilih image yang bertanda **OFFICIAL** di Docker Hub untuk menjamin stabilitas dan keamanan dari celah malware.
- ❌ Jangan pernah mengunggah image ke public registry jika di dalamnya berisi password, API key, atau file `.env` rahasia.

---

<a id="bagian-6"></a>

## 6. 🟢 Docker Image (Pull, List, Tag, & Remove)

#### Konsep

**Docker Image** adalah paket *read-only* (template cetak biru) yang berisi kode program, library, dependensi sistem, dan konfigurasi yang dibutuhkan untuk menjalankan aplikasi.

Karakteristik Docker Image:
- **Layered Architecture:** Tersusun dari lapisan-lapisan (*read-only layers*) yang ditumpuk. Lapisan yang sama digunakan bersama (*shared layers*) sehingga sangat hemat ruang disk.
- **Image Tagging:** Menggunakan format `repository:tag` (misal: `node:20-alpine`, `postgres:16`). Tag `latest` adalah tag default jika versi tidak ditulis secara spesifik.

Perintah Manajemen Image:
- `docker pull image:tag`: Mengunduh image dari registry.
- `docker images` / `docker image ls`: Menampilkan seluruh image yang tersimpan di lokal.
- `docker image tag source:tag target:tag`: Memberi alias/tag baru.
- `docker rmi image_id` / `docker image rm`: Menghapus image dari lokal.

#### Contoh

```bash
# 1. Mengunduh image Redis versi alpine
docker pull redis:alpine

# 2. Melihat daftar image yang ada di komputer
docker images

# 3. Memberi tag kustom
docker tag redis:alpine my-redis-cache:v1

# 4. Menghapus image
docker rmi my-redis-cache:v1
```

#### Output

```text
alpine: Pulling from library/redis
Digest: sha256:5a9d8e...
Status: Downloaded newer image for redis:alpine

REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
redis        alpine    8a1b2c3d4e5f   3 days ago     32.4MB
nginx        alpine    f9e8d7c6b5a4   1 week ago     23.5MB

Untagged: my-redis-cache:v1
```

#### Cara Kerja

```text
         docker pull redis:alpine
                   │
                   ▼
         Download Layer 1: Base Alpine OS (5MB)
         Download Layer 2: Redis Binaries (27MB)
                   │
                   ▼
         Tersimpan di Penyimpanan Lokal Docker Host (/var/lib/docker)
```

**Hafalan:**

```text
docker pull image_name:tag → Mengunduh template image ke komputer lokal
docker images              → Melihat seluruh image yang tersimpan di lokal
docker rmi image_name      → Menghapus image dari memori penyimpanan lokal
```

#### Best Practice & Kesalahan Umum

- ✅ Selalu sertakan tag versi eksplisit (misal `node:20.12-alpine`), hindari menggunakan tag `latest` di produksi agar versi tidak berubah mendadak saat server di-deploy ulang.
- ❌ Anda tidak bisa menghapus image (`docker rmi`) jika image tersebut masih digunakan oleh container yang ada (hentikan dan hapus kontainernya terlebih dahulu).

---

<a id="bagian-7"></a>

## 7. 🟢 Docker Container Lifecycle (Run, Start, Stop, Restart, & Remove)

#### Konsep

**Docker Container** adalah instance aktif yang berjalan (*running instance*) dari sebuah Docker Image.

Jika Image adalah *Class / Blueprint* (cetak biru), maka Container adalah *Object / Instance* nyata yang sedang dieksekusi di memori. Di atas lapisan *read-only image*, container menambahkan satu lapisan tipis **Writable Layer (Container Layer)** tempat file dapat dibuat dan dimutasi saat runtime.

Siklus Hidup (*Lifecycle*) Container:
```text
       [ Docker Image ]
              │
              ▼ (docker create / run)
       ┌──────────────┐
       │   Created    │
       └──────┬───────┘
              │ (docker start)
              ▼
       ┌──────────────┐  (docker stop)   ┌──────────────┐
       │   Running    ├─────────────────►│   Stopped    │
       └──────┬───────┘                  └──────┬───────┘
              │ (docker restart)                │ (docker rm)
              ▼                                 ▼
       (Siklus Ulang)                    [ Dihapus / Hilang ]
```

Perintah Siklus Hidup:
- `docker run [options] image`: Mengunduh (jika belum ada) + membuat + langsung menyalakan container.
  - `-d` (*detached*): Berjalan di latar belakang (*background*).
  - `--name custom_name`: Memberi nama khusus pada container.
  - `--rm`: Otomatis menghapus container saat container berhenti.
- `docker ps`: Melihat container yang sedang aktif berjalan.
- `docker ps -a`: Melihat seluruh container (termasuk yang sudah mati/stopped).
- `docker stop container_name`: Menghentikan container secara halus (*graceful shutdown SIGTERM*).
- `docker start container_name`: Menyalakan kembali container yang sudah berhenti.
- `docker restart container_name`: Memuat ulang container.
- `docker rm container_name`: Menghapus container.

#### Contoh

```bash
# 1. Membuat dan menjalankan kontainer Nginx di background dengan nama 'my-web'
docker run -d --name my-web nginx:alpine

# 2. Melihat kontainer aktif
docker ps

# 3. Menghentikan kontainer
docker stop my-web

# 4. Melihat seluruh kontainer termasuk yang mati (status Exited)
docker ps -a

# 5. Menyalakan kembali
docker start my-web

# 6. Menghentikan dan menghapus kontainer
docker stop my-web
docker rm my-web
```

#### Output

```text
9a8b7c6d5e4f... (Container ID)

CONTAINER ID   IMAGE          STATUS         NAMES
9a8b7c6d5e4f   nginx:alpine   Up 3 seconds   my-web

my-web (Stopped)

CONTAINER ID   IMAGE          STATUS                      NAMES
9a8b7c6d5e4f   nginx:alpine   Exited (0) 2 seconds ago    my-web

my-web (Started)
my-web (Removed)
```

#### Cara Kerja

```text
         docker run -d --name my-web nginx:alpine
                           │
                           ▼
         1. Alokasikan Writable Layer
         2. Pasang Namespace Isolasi (PID, Network, Mount)
         3. Jalankan Entrypoint Command di Background
```

**Hafalan:**

```text
docker run -d --name name image → Menjalankan container di background dengan nama kustom
docker ps -a                    → Melihat seluruh daftar container (aktif maupun stopped)
docker stop container_name      → Menghentikan container yang sedang berjalan
docker rm container_name        → Menghapus container dari sistem
```

#### Best Practice & Kesalahan Umum

- ✅ Selalu beri nama container menggunakan opsi `--name` yang deskriptif agar mudah diidentifikasi (jangan biarkan Docker memberi nama acak seperti `flamboyant_morse`).
- ❌ Jangan membuat puluhan container baru dengan `docker run` jika hanya ingin menyalakan container lama yang sudah ada (gunakan `docker start`).

---

<a id="bagian-8"></a>

## 8. 🟢 Container Log & Monitoring Output (docker logs)

#### Konsep

Setiap aplikasi yang berjalan di dalam container biasanya mencetak informasi log ke keluaran standar (**`stdout`**) dan kesalahan standar (**`stderr`**).

Perintah **`docker logs`** digunakan untuk menginspeksi, membaca, dan memantau rekaman log keluaran dari sebuah container tanpa perlu masuk ke dalam sistem file container tersebut.

Opsi Esensial `docker logs`:
- `docker logs container_name`: Menampilkan seluruh riwayat log dari awal.
- `docker logs -f container_name` (*follow*): Memantau log secara langsung dan real-time (*live stream tailing*).
- `docker logs --tail N container_name`: Hanya menampilkan `N` baris terakhir.
- `docker logs -t container_name` (*timestamps*): Menyertakan waktu tanggal pada setiap baris log.

#### Contoh

```bash
# 1. Menjalankan kontainer Redis di background
docker run -d --name cache-db redis:alpine

# 2. Melihat 5 baris log terakhir beserta timestamp
docker logs --tail 5 -t cache-db

# 3. Memantau log secara live (Tekan Ctrl+C untuk keluar)
# docker logs -f cache-db
```

#### Output

```text
2026-08-29T10:42:01.123456789Z 1:M 29 Aug 2026 10:42:01.123 * Running mode=standalone, port=6379.
2026-08-29T10:42:01.123890123Z 1:M 29 Aug 2026 10:42:01.123 # Server initialized
2026-08-29T10:42:01.124123456Z 1:M 29 Aug 2026 10:42:01.124 * Ready to accept connections tcp
```

#### Cara Kerja

```text
         Proses di dalam Container mencetak output ke stdout / stderr
                                    │
                                    ▼
         Docker Logging Driver menangkap stream output ke file JSON
                                    │
                                    ▼
         docker logs -f membaca dan meneruskan output ke terminal host
```

**Hafalan:**

```text
docker logs container_name            → Membaca riwayat seluruh log kontainer
docker logs -f --tail 50 name         → Memantau 50 baris log terakhir secara live real-time
```

#### Best Practice & Kesalahan Umum

- ✅ Desain aplikasi Anda agar menulis log langsung ke `stdout` / `stderr` (bukan ke file log tersembunyi di dalam folder) agar kompatibel dengan standar Docker Logging.
- ❌ Jangan menjalankan `docker logs` tanpa opsi `--tail` pada container produksi yang sudah berjalan berbulan-bulan karena terminal akan dibanjiri jutaan baris log.

---

<a id="bagian-9"></a>

## 9. 🟢 Container Exec & Akses Shell Interaktif (docker exec)

#### Konsep

Perintah **`docker exec`** memungkinkan kita mengeksekusi perintah tambahan atau membuka sesi terminal shell interaktif (**bash / sh**) di dalam container yang **sedang aktif berjalan**.

Kombinasi Flag Paling Penting:
- **`-i` (*interactive*):** Menjaga input standar (*STDIN*) tetap terbuka.
- **`-t` (*tty*):** Mengalokasikan terminal semu (*pseudo-TTY*).
- **`-it` (Kombinasi Wajib):** Membuka sesi shell terminal interaktif dua arah.

Perbedaan dengan `docker run`:
- `docker run`: Membuat container **BARU** dari image.
- `docker exec`: Masuk / mengeksekusi perintah ke dalam container yang **SUDAH ADA & SEDANG BERJALAN**.

#### Contoh

```bash
# 1. Menjalankan web server Nginx
docker run -d --name my-server nginx:alpine

# 2. Menjalankan perintah tunggal di dalam kontainer tanpa membuka terminal penuh
docker exec my-server nginx -v

# 3. Masuk ke dalam terminal interaktif kontainer (menggunakan sh untuk Alpine)
docker exec -it my-server sh

# Di dalam sesi shell kontainer:
# ls -la
# cat /etc/nginx/nginx.conf
# exit
```

#### Output

```text
nginx version: nginx/1.25.5

/ # ls -la
total 64
drwxr-xr-x    1 root     root          4096 Aug 29 10:42 .
drwxr-xr-x    1 root     root          4096 Aug 29 10:42 etc
drwxr-xr-x    1 root     root          4096 Aug 29 10:42 usr
/ # exit
```

#### Cara Kerja

```text
       Terminal Komputer Host (Developer)
                     │
                     │ docker exec -it my-server sh
                     ▼
       Docker Daemon menghubungkan TTY Host ke Shell Kontainer
                     │
                     ▼
       Developer dapat menginspeksi file langsung di dalam sandbox
```

**Hafalan:**

```text
docker exec -it container_name sh   → Masuk ke terminal interaktif kontainer (Alpine)
docker exec -it container_name bash → Masuk ke terminal interaktif kontainer (Ubuntu/Debian)
docker exec container_name command  → Menjalankan perintah satu kali tanpa membuka terminal
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan `sh` jika image menggunakan distribusi Alpine Linux, dan gunakan `bash` untuk distribusi Ubuntu/Debian.
- ❌ Jangan gunakan `docker exec` untuk mengubah konfigurasi permanen aplikasi; jadikan `docker exec` hanya sebagai sarana investigasi dan debugging sementara.

---

<a id="bagian-10"></a>

## 10. 🟢 Container Port Publishing (-p host:container)

#### Konsep

Secara default, seluruh port jaringan di dalam container terisolasi dan **tidak dapat diakses langsung dari luar mesin Host**.

Untuk menghubungkan port di komputer Host ke port di dalam container, kita menggunakan fitur **Port Publishing / Port Forwarding** dengan flag **`-p`**.

Format Sintaks Port Mapping:
```text
-p PortHost:PortContainer
```
- **`PortHost`:** Nomor port di laptop/server host tempat Anda mengakses aplikasi via browser (misal `http://localhost:8080`).
- **`PortContainer`:** Nomor port internal tempat aplikasi di dalam container mendengarkan (*listen*) trafik (misal port `80` untuk Nginx, port `3000` untuk Node.js, port `3306` untuk MySQL).

#### Contoh

```bash
# Menjalankan 2 kontainer Nginx berbeda pada port host yang berbeda
# Kontainer 1: diakses via localhost:8080
docker run -d --name web-satu -p 8080:80 nginx:alpine

# Kontainer 2: diakses via localhost:8081
docker run -d --name web-dua -p 8081:80 nginx:alpine

# Memeriksa mapping port aktif
docker ps --format "table {{.Names}}	{{.Ports}}"
```

#### Output

```text
NAMES      PORTS
web-satu   0.0.0.0:8080->80/tcp
web-dua    0.0.0.0:8081->80/tcp
```

Akses browser:
- `http://localhost:8080` -> Masuk ke web-satu.
- `http://localhost:8081` -> Masuk ke web-dua.

#### Cara Kerja

```text
       Browser User (Host Laptop)
                   │
                   ▼ (Request ke localhost:8080)
       Port 8080 pada OS Host (Docker Proxy)
                   │
                   ▼ (Diteruskan melalui Virtual Bridge Network)
       Port 80 di dalam Container Nginx (web-satu)
```

**Hafalan:**

```text
-p host_port:container_port → Membuka jalur akses dari port laptop host ke port kontainer
Rumus Hafalan               → -p LUAR:DALAM (Luar = Laptop Host, Dalam = Kontainer)
```

#### Best Practice & Kesalahan Umum

- ✅ Selalu ingat rumus **LUAR:DALAM** (*Host:Container*).
- ❌ Hati-hati terhadap error `Bind for 0.0.0.0:8080 failed: port is already allocated`; itu artinya port `8080` di laptop host sedang dipakai oleh aplikasi lain (ganti ke port lain seperti `8082:80`).

---

<a id="bagian-11"></a>

## 11. 🟢 Container Environment Variable (-e KEY=VAL & --env-file)

#### Konsep

Aplikasi modern (*12-Factor App methodology*) memisahkan kode program dari konfigurasi menggunakan **Environment Variables** (Variabel Lingkungan).

Cara Mengirimkan Variabel Lingkungan ke Container:
1. **Flag `-e KEY=VALUE` (Inline):** Menetapkan satu per satu variabel langsung di terminal.
2. **Flag `--env-file filename` (File Konfigurasi):** Membaca puluhan variabel sekaligus dari file konfigurasi (seperti `.env`).

Sangat esensial untuk mengonfigurasi kredensial database, port aplikasi, secret key, atau mode environment (`NODE_ENV=production`).

#### Contoh

```bash
# 1. Menjalankan kontainer Database MySQL dengan Environment Variables
docker run -d --name db-app   -e MYSQL_ROOT_PASSWORD=rahasia_root_123   -e MYSQL_DATABASE=toko_db   -e MYSQL_USER=budi_user   -e MYSQL_PASSWORD=password_budi   -p 3306:3306   mysql:8.0

# 2. Menggunakan File .env
# Buat file my-config.env:
# APP_PORT=3000
# DB_HOST=db-app

# Menjalankan kontainer dengan file env:
# docker run -d --name my-app --env-file my-config.env -p 3000:3000 my-node-app

# 3. Memeriksa isi variabel di dalam kontainer yang sedang berjalan
docker exec db-app env | grep MYSQL
```

#### Output

```text
MYSQL_DATABASE=toko_db
MYSQL_ROOT_PASSWORD=rahasia_root_123
MYSQL_USER=budi_user
MYSQL_PASSWORD=password_budi
```

#### Cara Kerja

```text
         Perintah: docker run -e MYSQL_DATABASE=toko_db mysql
                              │
                              ▼
         Docker Engine menyuntikkan variabel ke environment OS Kontainer
                              │
                              ▼
         Database MySQL membaca variabel saat proses inisialisasi awal
```

**Hafalan:**

```text
-e KEY=VALUE          → Menyuntikkan satu variabel environment ke dalam container
--env-file path/file  → Menyuntikkan seluruh variabel dari file konfigurasi .env
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan `--env-file .env` untuk proyek yang memiliki banyak variabel konfigurasi agar perintah `docker run` tidak terlalu panjang.
- ❌ Jangan pernah meng-commit file `.env` yang berisi password produksi ke repositori publik Git (masukkan `.env` ke file `.gitignore`).

---

<a id="bagian-12"></a>

## 12. 🟡 Container Stats & Pemantauan Resource Real-time (docker stats)

#### Konsep

Perintah **`docker stats`** menyediakan tampilan langsung (*live stream monitoring*) dari penggunaan sumber daya perangkat keras (CPU, RAM, Network I/O, Disk I/O) dari seluruh kontainer yang sedang aktif berjalan.

Informasi Metrik yang Ditampilkan:
- **`CPU %`:** Persentase beban kerja prosesor yang dikonsumsi container.
- **`MEM USAGE / LIMIT`:** Jumlah memori RAM yang digunakan saat ini dibanding batas maksimum.
- **`MEM %`:** Persentase pemakaian RAM.
- **`NET I/O`:** Total data jaringan yang diterima dan dikirim (*Network in/out*).
- **`BLOCK I/O`:** Total data baca/tulis ke media penyimpanan disk.
- **`PIDS`:** Jumlah proses / thread yang sedang aktif di dalam container.

#### Contoh

```bash
# 1. Menjalankan kontainer beban uji
docker run -d --name redis-server redis:alpine
docker run -d --name web-server nginx:alpine

# 2. Menampilkan pemantauan live stream seluruh kontainer aktif
# docker stats

# 3. Menampilkan snapshot metrik saat ini saja tanpa live stream (--no-stream)
docker stats --no-stream
```

#### Output

```text
CONTAINER ID   NAME           CPU %     MEM USAGE / LIMIT     MEM %     NET I/O          BLOCK I/O   PIDS
f4a8b9c1d2e3   redis-server   0.15%     3.45MiB / 7.65GiB     0.04%     1.2kB / 0B       0B / 0B     5
9a8b7c6d5e4f   web-server     0.00%     4.12MiB / 7.65GiB     0.05%     850B / 650B      0B / 0B     2
```

#### Cara Kerja

```text
         Docker Engine membaca metrik dari Linux Control Groups (cgroups)
                                     │
                                     ▼
         docker stats merender tabel metrik secara live ke terminal
```

**Hafalan:**

```text
docker stats             → Memantau konsumsi CPU, RAM, & Network container secara live
docker stats --no-stream → Menampilkan snapshot metrik resource satu kali
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan `docker stats` saat melakukan pengujian beban (*load testing*) untuk mengetahui titik jenuh pemakaian RAM aplikasi.
- ❌ Jangan biarkan container berjalan di server produksi tanpa batasan memori (*Resource Limits*), karena satu container yang bocor memori (*memory leak*) dapat menghabiskan seluruh RAM server (*OOM Crash*).

---

<a id="bagian-13"></a>

## 13. 🟡 Container Resource Limit (Memory --memory & CPU --cpus)

#### Konsep

Secara default, sebuah container diizinkan menggunakan **seluruh kapasitas CPU dan RAM yang tersedia di server Host**. Jika sebuah aplikasi mengalami *memory leak*, container tersebut dapat membekukan seluruh sistem operasi server.

Untuk mengamankan stabilitas server, kita wajib membatasi batas maksimum sumber daya (*Resource Limits*) yang boleh digunakan oleh container menggunakan subsistem **Linux cgroups**.

Flag Pembatas Sumber Daya:
- **`--memory=size` (Batas RAM):** Batas maksimum memori RAM (misal: `512m`, `1g`, `2g`). Jika container melebihi batas ini, proses di dalamnya akan dimatikan secara aman oleh mekanisme *OOM (Out Of Memory) Killer*.
- **`--cpus=number` (Batas CPU):** Jumlah core CPU yang dialokasikan (misal: `0.5` untuk setengah core, `2.0` untuk 2 core penuh).

#### Contoh

```bash
# Menjalankan kontainer Nginx dengan batas RAM 256MB dan maksimal 1.5 Core CPU
docker run -d --name secure-web   --memory=256m   --cpus=1.5   -p 8080:80   nginx:alpine

# Memeriksa apakah limit berhasil diterapkan
docker stats --no-stream secure-web
```

#### Output

```text
CONTAINER ID   NAME         CPU %     MEM USAGE / LIMIT   MEM %     NET I/O      BLOCK I/O   PIDS
1a2b3c4d5e6f   secure-web   0.00%     4.21MiB / 256MiB    1.64%     648B / 0B    0B / 0B     2
```

(Perhatikan kolom `MEM LIMIT` terkunci tepat di angka **256MiB**).

#### Cara Kerja

```text
         Perintah: docker run --memory=256m --cpus=1.5 ...
                                │
                                ▼
         Docker mendaftarkan aturan ke Kernel cgroups
                                │
                                ▼
         Container diisolasi: Tidak akan pernah bisa memakai >256MB RAM
```

**Hafalan:**

```text
--memory=512m → Membatasi penggunaan RAM maksimal 512 Megabyte
--cpus=1.0    → Membatasi penggunaan CPU maksimal 1 Core Processor
```

#### Best Practice & Kesalahan Umum

- ✅ Selalu tetapkan batas `--memory` pada container database dan backend di server produksi.
- ❌ Jangan menyetel batas memori yang terlalu sempit di bawah kebutuhan minimal startup aplikasi (misal memberi 32MB untuk aplikasi Java/Spring Boot yang butuh 256MB), karena container akan langsung crash (*Exit code 137 OOMKilled*).

---

<a id="bagian-14"></a>

## 14. 🟡 Bind Mounts (Menghubungkan Folder Host Langsung)

#### Konsep

Secara alami, sistem file di dalam container bersifat sementara (*ephemeral*). Saat container dihapus, seluruh data di dalamnya akan lenyap.

**Bind Mounts** adalah teknik menghubungkan sebuah folder atau file yang ada di **komputer Host langsung ke dalam folder di dalam Container**.

Keunggulan Bind Mounts:
- **Hot-Reloading & Live Development:** Developer dapat mengedit file kode program di VS Code (di laptop Host), dan perubahannya **langsung terdeteksi seketika di dalam container** tanpa perlu build ulang image!
- Performa sangat cepat untuk lingkungan pengembangan (*development*).

Format Flag:
```text
-v /path/di/host:/path/di/container:options
--mount type=bind,source=/path/di/host,target=/path/di/container
```

#### Contoh

```bash
# 1. Buat folder dan file HTML di komputer host
mkdir -p my-html
echo "<h1>Hello from Local Host File!</h1>" > my-html/index.html

# 2. Jalankan Nginx dengan menghubungkan folder my-html ke root web Nginx
# Windows PowerShell: ${PWD}/my-html
# Linux/macOS: $(pwd)/my-html
docker run -d --name dev-web   -v $(pwd)/my-html:/usr/share/nginx/html:ro   -p 8080:80   nginx:alpine

# 3. Tes akses di terminal host
curl http://localhost:8080
```

#### Output

```text
<h1>Hello from Local Host File!</h1>
```

(Jika file `my-html/index.html` diubah menggunakan text editor di host, refresh browser akan langsung menampilkan perubahan tersebut secara instan!).

#### Cara Kerja

```text
    Folder di Laptop Host (my-html)
    ┌─────────────────────────────┐
    │ index.html                  │
    └──────────────┬──────────────┘
                   │  -v $(pwd)/my-html:/usr/share/nginx/html
                   ▼  (Mount Tautan Langsung)
    Folder di dalam Container Nginx
    ┌─────────────────────────────┐
    │ /usr/share/nginx/html       │
    └─────────────────────────────┘
```

**Hafalan:**

```text
-v $(pwd)/src:/app        → Bind mount: menghubungkan folder proyek lokal ke dalam container
:ro (Read-Only)           → Opsi keamanan agar container tidak bisa mengubah file di host
```

#### Best Practice & Kesalahan Umum

- ✅ Selalu gunakan absolute path (`$(pwd)` di Linux/macOS atau `${PWD}` di PowerShell) untuk sumber path host pada flag `-v`.
- ❌ Jangan gunakan Bind Mounts untuk database skala besar di server produksi; gunakan **Named Volume** yang dikelola langsung oleh Docker Engine.

---

<a id="bagian-15"></a>

## 15. 🟡 Docker Volume (Persistent Data Terisolasi)

#### Konsep

**Docker Volume** adalah mekanisme standar resmi yang dikelola sepenuhnya oleh Docker Engine untuk menyimpan data yang bersifat permanen (**Persistent Data**), terisolasi dari sistem file host, dan tidak akan hilang meskipun container dimatikan atau dihapus.

Mengapa Memilih Named Volume daripada Bind Mounts untuk Database?
1. **Dikelola Sepenuhnya oleh Docker:** Tersimpan di lokasi aman yang dikelola engine (misal: `/var/lib/docker/volumes/`).
2. **Kinerja I/O Lebih Tinggi:** Tidak terikat pada permission dan struktur direktori host.
3. **Mudah di-Backup & Migrasi:** Dapat dipindahkan antar container dengan aman.

Perintah Manajemen Volume:
- `docker volume create volume_name`: Membuat volume baru.
- `docker volume ls`: Melihat daftar volume yang ada.
- `docker volume inspect volume_name`: Melihat detail lokasi fisik volume.
- `docker volume rm volume_name`: Menghapus volume.
- `docker volume prune`: Menghapus seluruh volume yang sudah tidak digunakan.

#### Contoh

```bash
# 1. Membuat Named Volume baru untuk database
docker volume create db_data_production

# 2. Melihat daftar volume
docker volume ls

# 3. Melihat detail informasi volume
docker volume inspect db_data_production
```

#### Output

```text
db_data_production

DRIVER    VOLUME NAME
local     db_data_production

[
    {
        "CreatedAt": "2026-08-29T10:43:00Z",
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/db_data_production/_data",
        "Name": "db_data_production",
        "Scope": "local"
    }
]
```

#### Cara Kerja

```text
              Docker Engine Storage Area (/var/lib/docker/volumes)
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │      db_data_production       │
                       │    (Data Database Permanen)   │
                       └───────────────┬───────────────┘
                                       │
                        Dihubungkan ke Container
```

**Hafalan:**

```text
docker volume create name  → Membuat named volume baru
docker volume ls           → Melihat daftar seluruh volume aktif
docker volume inspect name → Melihat lokasi fisik mountpoint volume di host
docker volume rm name      → Menghapus volume
```

#### Best Practice & Kesalahan Umum

- ✅ Berikan nama yang jelas pada volume (misal: `mysql_data`, `postgres_db`, `redis_cache`).
- ❌ Jangan menghapus volume yang sedang aktif digunakan oleh container yang berjalan (hapus kontainernya terlebih dahulu).

---

<a id="bagian-16"></a>

## 16. 🟡 Container Volume (Memasang Named Volume ke Container)

#### Konsep

Setelah sebuah Named Volume dibuat, kita memasangkannya (*mount*) ke dalam folder target di dalam container menggunakan flag **`-v volume_name:/path/di/container`**.

Bahkan jika Named Volume belum dibuat sebelumnya, Docker akan **otomatis membuatkannya** saat perintah `docker run -v nama_volume:/path` pertama kali dieksekusi.

Uji Coba Ketahanan Data (*Data Persistence Test*):
1. Jalankan container dengan volume.
2. Tulis data ke dalam volume.
3. Hapus container tersebut (`docker rm -f`).
4. Jalankan container baru yang berbeda dengan memasang volume yang sama.
5. **Data tetap utuh 100%!**

#### Contoh

```bash
# 1. Jalankan kontainer database MySQL dengan named volume 'mysql_storage'
docker run -d --name db-utama   -e MYSQL_ROOT_PASSWORD=rahasia   -e MYSQL_DATABASE=app_db   -v mysql_storage:/var/lib/mysql   mysql:8.0

# 2. Simulasikan kontainer rusak / dihapus permanen
docker stop db-utama
docker rm db-utama

# 3. Nyalakan kontainer baru dengan nama berbeda tetapi MEMASANG VOLUME YANG SAMA
docker run -d --name db-baru   -e MYSQL_ROOT_PASSWORD=rahasia   -v mysql_storage:/var/lib/mysql   mysql:8.0

# 4. Bukti data aman: database 'app_db' tetap ada di db-baru!
docker exec db-baru mysql -u root -prahasia -e "SHOW DATABASES;"
```

#### Output

```text
Database
information_schema
app_db
mysql
performance_schema
sys
```

#### Cara Kerja

```text
   Container 1 (db-utama)                    Container 2 (db-baru)
   ┌────────────────────┐                    ┌────────────────────┐
   │ /var/lib/mysql     │                    │ /var/lib/mysql     │
   └─────────┬──────────┘                    └─────────┬──────────┘
             │                                         │
             └───────────────┐         ┌───────────────┘
                             ▼         ▼
                    ┌───────────────────────────────┐
                    │     Volume: mysql_storage     │
                    │   (Data Tetap Utuh Selamanya) │
                    └───────────────────────────────┘
```

**Hafalan:**

```text
-v volume_name:/container/path → Menghubungkan named volume ke path penyimpanan container
Data Persistence               → Data tetap aman meskipun container dimatikan dan dihapus
```

#### Best Practice & Kesalahan Umum

- ✅ Selalu ketahui letak folder penyimpanan data resmi dari image yang digunakan (misal MySQL: `/var/lib/mysql`, PostgreSQL: `/var/lib/postgresql/data`, MongoDB: `/data/db`).
- ❌ Jangan pernah menjalankan container database di server produksi tanpa memasang Volume.

---

<a id="bagian-17"></a>

## 17. 🟡 Backup Volume (Ekspor Data Volume ke File Tar)

#### Konsep

Karena Named Volume dikelola langsung oleh Docker Daemon di direktori terisolasi, kita dapat membuat salinan cadangan (**Backup**) dengan cara menjalankan sebuah **Container Sementara (*Temporary Helper Container*)** yang menghubungkan dua hal sekaligus:
1. **Named Volume** yang ingin di-backup (dipasang ke `/volume-data`).
2. **Folder Komputer Host** tempat file backup akan disimpan (dipasang via *Bind Mount* ke `/backup-dir`).

Kemudian, container sementara tersebut mengeksekusi perintah pengarsipan **`tar -czvf`** lalu otomatis menghapus dirinya sendiri (`--rm`).

#### Contoh

```bash
# 1. Menyiapkan folder penyimpanan backup di host
mkdir -p ~/docker-backups

# 2. Menjalankan kontainer sementara untuk mem-backup volume 'mysql_storage'
# ke file arsip 'mysql_backup.tar.gz'
docker run --rm   -v mysql_storage:/volume-data:ro   -v ~/docker-backups:/backup-dir   alpine:latest   tar -czvf /backup-dir/mysql_backup_2026.tar.gz -C /volume-data .

# 3. Memeriksa file backup yang berhasil dibuat di host
ls -lh ~/docker-backups
```

#### Output

```text
./
./app_db/
./app_db/users.ibd
./ibdata1
./mysql.ibd

-rw-r--r-- 1 root root 18.4M Aug 29 10:43 mysql_backup_2026.tar.gz
```

#### Cara Kerja

```text
   Named Volume (mysql_storage)             Folder Host (~/docker-backups)
   ┌──────────────────────────┐             ┌──────────────────────────┐
   │ /volume-data             │             │ /backup-dir              │
   └────────────┬─────────────┘             └────────────▲─────────────┘
                │                                        │
                └───────────────┐        ┌───────────────┘
                                ▼        │
                     ┌───────────────────────────────┐
                     │ Kontainer Sementara (alpine)  │
                     │ tar -czvf /backup-dir/file... │
                     └───────────────────────────────┘
```

**Hafalan:**

```text
tar -czvf /backup/file.tar.gz -C /data . → Mengompresi seluruh isi folder menjadi arsip tar.gz
docker run --rm -v vol:/data -v host:/backup alpine tar... → Pola standar backup Docker Volume
```

#### Best Practice & Kesalahan Umum

- ✅ Pasang volume target dengan mode *Read-Only* (`:ro`) saat backup agar proses pengarsipan tidak memodifikasi data asli.
- ❌ Hentikan sementara container database utama sebelum melakukan backup volume skala besar untuk menghindari data terpotong di tengah penulisan (*data inconsistency*).

---

<a id="bagian-18"></a>

## 18. 🟡 Restore Volume (Impor Data Tar ke Volume Baru)

#### Konsep

**Restore Volume** adalah proses pemulihan data dari file arsip backup (`.tar.gz`) kembali ke dalam sebuah Docker Volume baru.

Langkah Proses Restore:
1. Buat Named Volume baru yang masih kosong (`docker volume create volume_baru`).
2. Jalankan container pembantu sementara yang memasang volume baru dan folder backup host.
3. Ekstrak isi file tar ke dalam volume menggunakan perintah **`tar -xzvf`**.

#### Contoh

```bash
# 1. Buat volume baru sebagai target restore
docker volume create mysql_restored_storage

# 2. Ekstrak data dari file backup host ke volume baru
docker run --rm   -v mysql_restored_storage:/volume-target   -v ~/docker-backups:/backup-dir:ro   alpine:latest   tar -xzvf /backup-dir/mysql_backup_2026.tar.gz -C /volume-target

# 3. Jalankan MySQL menggunakan volume yang baru saja di-restore
docker run -d --name db-restored   -e MYSQL_ROOT_PASSWORD=rahasia   -v mysql_restored_storage:/var/lib/mysql   mysql:8.0

# 4. Verifikasi bahwa database berhasil dipulihkan
docker exec db-restored mysql -u root -prahasia -e "SHOW DATABASES;"
```

#### Output

```text
./
./app_db/
./app_db/users.ibd
./ibdata1

Database
information_schema
app_db
mysql
performance_schema
sys
```

#### Cara Kerja

```text
   File Backup Host (mysql_backup.tar.gz)
                    │
                    ▼
   Kontainer Sementara (tar -xzvf)
                    │
                    ▼
   Volume Baru (mysql_restored_storage)
                    │
                    ▼
   Database Siap Dijalankan di Container Baru!
```

**Hafalan:**

```text
tar -xzvf /backup/file.tar.gz -C /target → Mengekstrak file arsip backup ke dalam direktori target
```

#### Best Practice & Kesalahan Umum

- ✅ Lakukan uji coba restore secara berkala (*Disaster Recovery Drill*) ke volume testing untuk memastikan file backup tidak rusak (*corrupt*).
- ❌ Jangan mengekstrak file backup ke dalam volume yang sudah berisi database aktif tanpa membersihkannya terlebih dahulu, karena data lama dan baru akan bertabrakan.

---

<a id="bagian-19"></a>

## 19. 🟡 Docker Network (Bridge, Host, None)

#### Konsep

Docker menyediakan subsistem jaringan (**Docker Network**) untuk mengatur bagaimana container saling berkomunikasi satu sama lain dan dengan dunia luar.

3 Driver Jaringan Bawaan Utama:
1. **`bridge` (Default):** Membuat jaringan virtual privat terisolasi di dalam host. Setiap container mendapatkan IP privat lokal (misal `172.17.0.X`).
2. **`host`:** Menghilangkan isolasi jaringan. Container langsung menggunakan antarmuka jaringan dan port komputer Host secara langsung (sangat cepat, cocok untuk streaming/kinerja tinggi).
3. **`none`:** Menonaktifkan seluruh akses jaringan. Container benar-benar terisolasi tanpa koneksi internet atau container lain.

Perintah Manajemen Network:
- `docker network create network_name`: Membuat jaringan kustom baru.
- `docker network ls`: Melihat daftar jaringan yang ada.
- `docker network inspect network_name`: Memeriksa detail subnet, gateway, dan kontainer yang terhubung.
- `docker network rm network_name`: Menghapus jaringan.

#### Contoh

```bash
# 1. Melihat daftar network bawaan Docker
docker network ls

# 2. Membuat Custom Bridge Network baru
docker network create my-app-network

# 3. Memeriksa detail konfigurasi network
docker network inspect my-app-network --format 'Subnet: {{range .IPAM.Config}}{{.Subnet}}{{end}}'
```

#### Output

```text
NETWORK ID     NAME             DRIVER    SCOPE
1a2b3c4d5e6f   bridge           bridge    local
8a9b0c1d2e3f   host             host      local
7f8e9d0c1b2a   none             null      local
4f5e6d7c8b9a   my-app-network   bridge    local

Subnet: 172.20.0.0/16
```

#### Cara Kerja

```text
                 Komputer Host (Docker Daemon)
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
      Bridge Network      Host Network       None Network
    (Virtual Isolated)   (Shared Host IP)    (No Network)
```

**Hafalan:**

```text
docker network create name → Membuat virtual network bridge baru
docker network ls          → Melihat daftar seluruh network yang terdaftar
docker network inspect name→ Melihat detail subnet IP dan daftar container terhubung
```

#### Best Practice & Kesalahan Umum

- ✅ Selalu buat **User-Defined Custom Bridge Network** (`docker network create`) untuk setiap aplikasi multi-kontainer Anda.
- ❌ Jangan mengandalkan *Default Bridge Network* bawaan untuk komunikasi antar kontainer, karena default bridge tidak mendukung fitur *Automatic DNS Name Resolution*.

---

<a id="bagian-20"></a>

## 20. 🟡 Container Network (Komunikasi Antar Container via DNS Name)

#### Konsep

Ketika beberapa container terhubung ke dalam **User-Defined Custom Bridge Network** yang sama, Docker secara otomatis mengaktifkan fitur **Embedded DNS Server**.

Keunggulan Embedded DNS:
- Container dapat saling memanggil dan berkomunikasi satu sama lain **cukup dengan menggunakan NAMA KONTAINER-nya sebagai Hostname** (misal: `curl http://web-api:3000` atau koneksi database ke host `database-server`).
- Developer **TIDAK PERLU** lagi menghafal atau mengandalkan alamat IP container yang dinamis dan mudah berubah!

#### Contoh

```bash
# 1. Buat custom network
docker network create internal-network

# 2. Jalankan kontainer database MySQL di dalam network tersebut
docker run -d --name mysql-db   --network internal-network   -e MYSQL_ROOT_PASSWORD=secret   mysql:8.0

# 3. Jalankan kontainer backend Node.js / Nginx di network yang SAMA
docker run -d --name api-service   --network internal-network   -p 8080:80   nginx:alpine

# 4. Tes komunikasi: Ping mysql-db langsung dari api-service menggunakan NAMA KONTAINER
docker exec api-service ping -c 3 mysql-db
```

#### Output

```text
PING mysql-db (172.20.0.2): 56 data bytes
64 bytes from 172.20.0.2: seq=0 ttl=64 time=0.085 ms
64 bytes from 172.20.0.2: seq=1 ttl=64 time=0.065 ms
64 bytes from 172.20.0.2: seq=2 ttl=64 time=0.071 ms

--- mysql-db ping statistics ---
3 packets transmitted, 3 packets received, 0% packet loss
```

#### Cara Kerja

```text
             User-Defined Bridge Network (internal-network)
       ┌─────────────────────────────────────────────────────────┐
       │                                                         │
       │   Container: api-service       Container: mysql-db      │
       │   IP: 172.20.0.3               IP: 172.20.0.2           │
       │         │                             ▲                 │
       │         │ ping mysql-db               │                 │
       │         ▼                             │                 │
       │   Docker Embedded DNS ────────────────┘                 │
       │   (mysql-db -> 172.20.0.2)                              │
       └─────────────────────────────────────────────────────────┘
```

**Hafalan:**

```text
--network network_name → Menghubungkan container ke virtual network kustom
Automatic DNS          → Container bisa memanggil container lain via namanya (nama = domain)
```

#### Best Practice & Kesalahan Umum

- ✅ Gunakan nama container sebagai nama host koneksi database (misal di file konfigurasi: `DB_HOST=mysql-db`).
- ❌ Jangan pernah melakukan hardcode alamat IP (seperti `172.17.0.2`) di kode aplikasi karena alamat IP kontainer akan berubah setiap kali kontainer di-restart.

---

<a id="bagian-21"></a>

## 21. 🟡 Docker Inspect (Inspeksi Konfigurasi JSON & IP Address)

#### Konsep

Perintah **`docker inspect`** mengembalikan informasi metadata teknis tingkat rendah (*low-level technical metadata*) dari sebuah container, image, volume, atau network dalam format **JSON** lengkap.

Informasi yang Bisa Diinspeksi:
- Alamat IP internal container (`IPAddress`).
- Status kesehatan (*Health status*) dan waktu booting.
- Mapping volume dan bind mounts aktif.
- Environment variables yang sedang terpasang.
- Pengaturan batas sumber daya (*cgroups limits*).

Format Filter Output (`--format` / Go Template):
Daripada membaca ribuan baris JSON, gunakan flag `--format` untuk mengambil satu nilai spesifik secara instan.

#### Contoh

```bash
# 1. Jalankan kontainer Nginx
docker run -d --name web-target -p 8080:80 nginx:alpine

# 2. Mengambil Alamat IP Container
docker inspect --format '{{ .NetworkSettings.IPAddress }}' web-target

# 3. Mengambil Status Running Container
docker inspect --format '{{ .State.Status }} (PID: {{ .State.Pid }})' web-target

# 4. Mengambil Mapping Port
docker inspect --format '{{ json .NetworkSettings.Ports }}' web-target
```

#### Output

```text
172.17.0.2
running (PID: 14520)
{"80/tcp":[{"HostIp":"0.0.0.0","HostPort":"8080"}]}
```

#### Cara Kerja

```text
         Perintah: docker inspect --format '{{ .NetworkSettings.IPAddress }}'
                                   │
                                   ▼
         Docker Engine membaca file state runtime di /var/run/docker
                                   │
                                   ▼
         Filter template mengekstrak nilai string: "172.17.0.2"
```

**Hafalan:**

```text
docker inspect target_name                         → Menampilkan seluruh konfigurasi JSON objek
docker inspect --format '{{.NetworkSettings.IPAddress}}' name → Mengambil IP container seketika
```

#### Best Practice & Kesalahan Umum

- ✅ Manfaatkan `docker inspect --format` dalam skrip otomatisasi bash/CI-CD untuk memverifikasi status container.
- ❌ Jangan membaca JSON manual secara visual jika hanya membutuhkan 1 informasi spesifik; manfaatkan flag `--format`.

---

<a id="bagian-22"></a>

## 22. 🟡 Docker Prune & Garbage Collection (Membersihkan Sampah Disk)

#### Konsep

Seiring berjalannya waktu, Docker akan menumpuk container yang sudah berhenti (*stopped containers*), image lama yang tidak terpakai (*dangling images*), volume yatim (*orphan volumes*), dan build cache yang dapat memakan puluhan gigabyte ruang hard disk.

Perintah **`docker system prune`** adalah mekanisme pembersihan sampah otomatis (*Garbage Collection*) untuk membebaskan ruang disk yang terbuang.

Varian Perintah Prune:
- `docker container prune`: Menghapus seluruh container yang berstatus stopped (*Exited*).
- `docker image prune`: Menghapus image yang tidak bertuan (*dangling images* bertanda `<none>`).
- `docker volume prune`: Menghapus seluruh volume yang tidak terikat pada container aktif mana pun.
- `docker system prune`: Membersihkan container mati, network tak terpakai, dan dangling images sekaligus.
- `docker system prune -a --volumes` (**Pembersihan Total**): Menghapus SEMUA image yang tidak dipakai dan seluruh volume yatim.

#### Contoh

```bash
# 1. Memeriksa total ruang disk yang digunakan oleh Docker
docker system df

# 2. Membersihkan seluruh container mati dan image sampah
docker system prune -f

# 3. Memeriksa kembali ruang disk yang berhasil dihemat
docker system df
```

#### Output

```text
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          12        2         3.45GB    2.85GB (82%)
Containers      8         2         450MB     320MB (71%)
Local Volumes   5         1         1.2GB     850MB (70%)
Build Cache     45        0         2.1GB     2.1GB

Deleted Containers:
9a8b7c6d5e4f
f4a8b9c1d2e3

Total reclaimed space: 3.17GB
```

#### Cara Kerja

```text
         docker system prune
                  │
                  ▼
         Deteksi: Kontainer Stopped + Image <none> + Network Tak Terpakai
                  │
                  ▼
         Hapus permanen dari storage driver -> Bebaskan ruang disk
```

**Hafalan:**

```text
docker system df         → Melihat ringkasan konsumsi kapasitas hard disk Docker
docker system prune -f   → Membersihkan seluruh kontainer mati dan image sampah
docker volume prune -f   → Membersihkan volume yatim yang sudah tidak terpakai
```

#### Best Practice & Kesalahan Umum

- ✅ Jalankan `docker system df` secara berkala untuk memantau kapasitas penyimpanan server.
- ❌ **HATI-HATI** saat menggunakan opsi `--volumes` pada `docker system prune --volumes` di server produksi, karena volume database yang sedang sengaja dimatikan sementara bisa ikut terhapus permanen!

---

<a id="bagian-23"></a>

## 23. 🔴 Container Restart Policy (--restart=always, unless-stopped, on-failure)

#### Konsep

Dalam lingkungan server produksi, sebuah server sewaktu-waktu dapat mengalami *reboot* (karena pemadaman listrik, maintenance OS, atau update kernel) atau aplikasi di dalam container dapat mengalami *crash*.

Fitur **Restart Policy (`--restart`)** menentukan bagaimana Docker Daemon harus bersikap ketika sebuah container berhenti atau saat Docker Daemon dinyalakan ulang.

Pilihan Nilai Restart Policy:
1. **`no` (Default):** Jangan pernah me-restart container secara otomatis.
2. **`on-failure[:max-retries]`:** Me-restart container hanya jika proses aplikasi di dalamnya crash (*exit code* bukan 0).
3. **`always`:** Selalu me-restart container dalam kondisi apa pun (termasuk jika server host di-reboot atau container dihentikan paksa).
4. **`unless-stopped` (Sangat Direkomendasikan untuk Server):** Selalu me-restart container saat server reboot, KECUALI jika developer secara sengaja menghentikannya manual menggunakan perintah `docker stop`.

#### Contoh

```bash
# 1. Menjalankan Database dengan kebijakan restart 'unless-stopped'
docker run -d --name prod-mysql   --restart=unless-stopped   -e MYSQL_ROOT_PASSWORD=secret   -v mysql_prod_data:/var/lib/mysql   mysql:8.0

# 2. Mengubah restart policy pada kontainer yang SUDAH BERJALAN tanpa perlu menghapusnya
docker update --restart=unless-stopped prod-mysql

# 3. Memeriksa restart policy yang sedang aktif
docker inspect --format 'Restart Policy: {{ .HostConfig.RestartPolicy.Name }}' prod-mysql
```

#### Output

```text
prod-mysql
Restart Policy: unless-stopped
```

(Jika server Linux di-reboot, kontainer `prod-mysql` akan otomatis langsung menyala kembali tanpa perlu intervensi manusia!).

#### Cara Kerja

```text
                 Server Host Reboot / Kontainer Crash
                                  │
                                  ▼
                     Docker Daemon Booting
                                  │
                   ┌──────────────┴──────────────┐
     --restart=no? │                             │ --restart=unless-stopped?
                   ▼                             ▼
       Container tetap mati              Container otomatis dinyalakan kembali!
```

**Hafalan:**

```text
--restart=unless-stopped → Menjamin kontainer otomatis menyala kembali setelah server host reboot
docker update --restart=always name → Mengubah restart policy kontainer tanpa menghapusnya
```

#### Best Practice & Kesalahan Umum

- ✅ Selalu pasang `--restart=unless-stopped` pada seluruh layanan backend dan database di server produksi.
- ❌ Hati-hati dengan `--restart=always` pada container yang memiliki bug fatal di startup, karena container akan terjebak dalam *crash-looping* tanpa henti.

---

<a id="bagian-24"></a>

## 24. 🔴 Container Health Check (--health-cmd & Status Kesehatan Kontainer)

#### Konsep

Secara default, Docker menganggap sebuah container berstatus sehat (**`healthy`**) hanya berdasarkan fakta bahwa proses utama (*PID 1*) di dalamnya masih aktif berjalan.

Namun, dalam dunia nyata, sebuah proses backend bisa saja macet (*frozen / deadlock*), database mengalami koneksi putus, atau web server merespons kode `500 Internal Server Error` meskipun prosesnya belum mati.

Fitur **Container Health Check** memungkinkan kita mendefinisikan perintah pengujian berkala untuk memverifikasi apakah aplikasi di dalam container benar-benar bekerja normal dan melayani permintaan.

Parameter Health Check:
- **`--health-cmd`:** Perintah pengujian (misal: `curl -f http://localhost/ || exit 1`).
- **`--health-interval`:** Interval waktu antar pengujian (default: `30s`).
- **`--health-timeout`:** Batas waktu tunggu respons perintah (default: `30s`).
- **`--health-retries`:** Jumlah toleransi kegagalan berturut-turut sebelum dinyatakan **`unhealthy`** (default: `3`).

Status Kesehatan Kontainer:
1. `starting`: Kontainer baru menyala dan sedang dalam masa inisialisasi awal.
2. `healthy`: Perintah health check berhasil me-return exit code `0`.
3. `unhealthy`: Perintah health check gagal berturut-turut melebihi batas toleransi (*retries*).

#### Contoh

```bash
# Menjalankan Nginx dengan Health Check aktif setiap 10 detik
docker run -d --name monitored-web   -p 8080:80   --health-cmd="curl -f http://localhost/ || exit 1"   --health-interval=10s   --health-timeout=3s   --health-retries=3   nginx:alpine

# Menunggu beberapa detik lalu memeriksa status kesehatan di docker ps
docker ps --format "table {{.Names}}	{{.Status}}"
```

#### Output

```text
NAMES           STATUS
monitored-web   Up 15 seconds (healthy)
```

#### Cara Kerja

```text
         Tiap 10 Detik: Docker mengeksekusi --health-cmd di dalam kontainer
                                      │
                      ┌───────────────┴───────────────┐
                    [Exit 0: Sukses]                [Exit 1: Gagal]
                      │                               │
                      ▼                               ▼
               Status: healthy                 Status: unhealthy
                                            (Load Balancer bisa mengalihkan trafik)
```

**Hafalan:**

```text
--health-cmd="command"     → Perintah pengujian kesehatan aplikasi (exit 0 = sehat, 1 = sakit)
--health-interval=10s      → Jarak waktu pengujian berkala
Status: (healthy)          → Aplikasi dipastikan benar-benar siap melayani trafik
```

#### Best Practice & Kesalahan Umum

- ✅ Pasang Health Check pada container backend agar load balancer atau orkestrator (seperti Docker Swarm / Kubernetes) tidak mengirimkan trafik ke kontainer yang sedang *starting* atau *unhealthy*.
- ❌ Pastikan perintah yang digunakan di `--health-cmd` (seperti `curl` atau `wget`) tersedia di dalam image yang bersangkutan.

---

<a id="bagian-25"></a>

## 25. 🛠️ Peta Ingatan Cepat

#### Mental Model Hubungan Objek Docker

```text
                      ┌───────────────────────────────┐
                      │    Docker Ecosystem Engine    │
                      └───────────────┬───────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        ▼                             ▼                             ▼
  Docker Hub Registry           Docker Image                  Docker Container
  - docker push                 - Template Read-Only          - Instance Runtime Aktif
  - docker pull                 - Layered storage             - Writable layer
  - Public/Private repos        - Repository:Tag              - docker run / start / stop
        │                             │                             │
        └─────────────────────────────┼─────────────────────────────┘
                                      │
                                      ▼
                        Penyimpanan & Jaringan Kontainer
                        - Volume (-v named_vol:/data)
                        - Bind Mounts (-v $(pwd):/app)
                        - Network Bridge (--network)
                        - Port Forwarding (-p host:cont)
                        - DNS Name Resolution
```

#### Pohon Keputusan Penyimpanan & Jaringan Docker

```text
                                Kebutuhan Penyimpanan Data
                                             │
                   ┌─────────────────────────┴─────────────────────────┐
                   ▼                                                   ▼
         Development / Hot-Reload?                           Production / Database?
                   │                                                   │
                   ▼                                                   ▼
              Bind Mounts                                         Named Volume
          -v $(pwd)/src:/app                               -v db_data:/var/lib/mysql
                   │
                   ▼
                                 Kebutuhan Komunikasi
                                             │
                   ┌─────────────────────────┴─────────────────────────┐
                   ▼                                                   ▼
          Akses dari Browser Luar?                         Komunikasi Antar Kontainer?
                   │                                                   │
                   ▼                                                   ▼
            Port Forwarding                                    Custom Network
            -p 8080:80                                         --network my-net (DNS)
```

---

<a id="bagian-26"></a>

## 26. 📚 Tabel Ringkasan

| Kategori | Perintah Docker CLI | Contoh Penggunaan | Penjelasan & Kegunaan |
|---|---|---|---|
| **Image** | `docker pull` | `docker pull nginx:alpine` | Mengunduh template image dari Docker Hub |
| **Image** | `docker images` | `docker images` | Menampilkan daftar seluruh image di lokal |
| **Image** | `docker rmi` | `docker rmi node:20` | Menghapus image dari penyimpanan lokal |
| **Container** | `docker run` | `docker run -d --name web nginx` | Membuat & langsung menjalankan kontainer |
| **Container** | `docker ps` | `docker ps -a` | Melihat kontainer aktif & status stopped |
| **Container** | `docker stop` | `docker stop web` | Menghentikan kontainer yang sedang berjalan |
| **Container** | `docker rm` | `docker rm -f web` | Menghapus kontainer dari sistem |
| **Operasional** | `docker logs` | `docker logs -f --tail 50 web` | Memantau keluaran log kontainer secara live |
| **Operasional** | `docker exec` | `docker exec -it web sh` | Masuk ke terminal shell interaktif kontainer |
| **Jaringan** | `-p (Publish)` | `-p 8080:80` | Forwarding port host laptop ke port container |
| **Jaringan** | `docker network` | `docker network create app-net` | Membuat virtual bridge network kustom |
| **Storage** | `-v (Volume)` | `-v db_data:/var/lib/mysql` | Memasang persistent named volume |
| **Storage** | `-v (Bind)` | `-v $(pwd):/app` | Menghubungkan folder lokal host ke container |
| **Config** | `-e (Env)` | `-e NODE_ENV=production` | Menyuntikkan variabel environment |
| **Resource** | `--memory` | `--memory=512m` | Membatasi pemakaian RAM maksimal |
| **Safety** | `--restart` | `--restart=unless-stopped` | Menyalakan kembali kontainer otomatis saat reboot |
| **Maintenance** | `docker system prune` | `docker system prune -f` | Membersihkan kontainer mati & sampah disk |

---

<a id="bagian-27"></a>

## 27. ⚡ Cheat Code Docker CLI 10 Detik

### 1. Menjalankan Web Server Cepat (Port + Detached)
```bash
docker run -d --name my-web -p 8080:80 nginx:alpine
```

### 2. Menjalankan Database Lengkap (Volume + Env + Network)
```bash
docker run -d --name my-mysql   --network app-network   -e MYSQL_ROOT_PASSWORD=secret   -v mysql_data:/var/lib/mysql   --restart=unless-stopped   mysql:8.0
```

### 3. Investigasi & Debugging Cepat
```bash
docker logs -f --tail 100 my-web
docker exec -it my-web sh
docker inspect --format '{{.NetworkSettings.IPAddress}}' my-web
```

### 4. Bersihkan Seluruh Sampah Docker
```bash
docker system prune -f
docker volume prune -f
```

---

<a id="bagian-28"></a>

## 28. 🧭 Urutan Belajar yang Disarankan

Untuk menguasai Docker dari nol hingga siap mengelola container di level produksi, ikuti 4 fase bertahap berikut:

```text
                   FASE 1: Fondasi Container & CLI Dasar (Minggu 1)
       ┌─────────────────────────────────────────────────────────────┐
       │ 1. Mental model Container vs VM & Arsitektur Docker Engine  │
       │ 2. Menginstall Docker & verifikasi image hello-world        │
       │ 3. Image management: pull, images, tag, rmi                 │
       │ 4. Container lifecycle: run, ps, stop, start, restart, rm   │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
                   FASE 2: Aksesibilitas, Log & Konfigurasi (Minggu 2)
       ┌─────────────────────────────────────────────────────────────┐
       │ 5. Port Publishing: -p host_port:container_port             │
       │ 6. Environment Variables: -e & --env-file                   │
       │ 7. Container Logs monitoring (-f) & Interactive Exec (-it)  │
       │ 8. Resource Limit: --memory & --cpus                        │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
                   FASE 3: Penyimpanan Data & Jaringan (Minggu 3)
       ┌─────────────────────────────────────────────────────────────┐
       │ 9. Bind Mounts untuk development lokal hot-reload           │
       │ 10. Docker Volume management & Data Persistence             │
       │ 11. Backup & Restore volume via temporary helper container  │
       │ 12. User-Defined Bridge Network & Automatic DNS Resolution  │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
                   FASE 4: Operasional Produksi & Mini Project (Minggu 4)
       ┌─────────────────────────────────────────────────────────────┐
       │ 13. Restart Policies (--restart=unless-stopped)             │
       │ 14. Container Health Checks (--health-cmd)                  │
       │ 15. Maintenance & Garbage collection: docker system prune   │
       │ 16. Mengerjakan Mini Project Multi-Container Stack          │
       └─────────────────────────────────────────────────────────────┘
```

---

<a id="bagian-29"></a>

## 29. 🏗️ Mini Project: Menjalankan Stack Web Server Nginx + Node.js + Database MySQL Terisolasi

#### Konsep Project

Project ini mensimulasikan lingkungan produksi nyata (*Multi-Container Production-Ready Stack*) yang menggabungkan seluruh fitur Docker CLI yang telah dipelajari:
1. **User-Defined Bridge Network (`toko-network`):** Agar ketiga layanan bisa saling berkomunikasi via DNS name tanpa membuka port database ke internet publik.
2. **Named Volume (`mysql_toko_data`):** Menjamin data database toko aman selamanya.
3. **Database Container (`db-toko`):** MySQL 8.0 dengan environment variables dan volume.
4. **Backend Container (`backend-toko`):** Terhubung ke database via hostname `db-toko`.
5. **Reverse Proxy Container (`web-proxy`):** Nginx yang bertindak sebagai pintu gerbang publik (*Port 80*) yang meneruskan trafik ke backend.
6. **Resource Limits & Restart Policies:** Membatasi RAM 512MB dan auto-restart.

#### Langkah Eksekusi CLI Lengkap

```bash
# =========================================================================
# STEP 1: Buat Virtual Bridge Network & Named Volume
# =========================================================================
docker network create toko-network
docker volume create mysql_toko_data

# =========================================================================
# STEP 2: Jalankan Database MySQL (Port 3306 Terkunci di Internal Network)
# =========================================================================
docker run -d --name db-toko   --network toko-network   --restart=unless-stopped   --memory=512m   -e MYSQL_ROOT_PASSWORD=rahasia_root   -e MYSQL_DATABASE=toko_online   -e MYSQL_USER=app_user   -e MYSQL_PASSWORD=password_aman   -v mysql_toko_data:/var/lib/mysql   mysql:8.0

# =========================================================================
# STEP 3: Jalankan Backend Web Server (Simulasi Backend di Port 80 internal)
# =========================================================================
docker run -d --name backend-toko   --network toko-network   --restart=unless-stopped   --memory=256m   -e DB_HOST=db-toko   -e DB_NAME=toko_online   nginx:alpine

# =========================================================================
# STEP 4: Jalankan Public Reverse Proxy (Membuka Port 8080 ke Laptop Host)
# =========================================================================
docker run -d --name web-proxy   --network toko-network   --restart=unless-stopped   -p 8080:80   nginx:alpine

# =========================================================================
# STEP 5: Verifikasi Status Seluruh Stack
# =========================================================================
docker ps --format "table {{.Names}}	{{.Status}}	{{.Ports}}"
```

#### Output

```text
NAMES          STATUS         PORTS
web-proxy      Up 5 seconds   0.0.0.0:8080->80/tcp
backend-toko   Up 8 seconds   80/tcp
db-toko        Up 12 seconds  3306/tcp, 33060/tcp
```

#### Uji Komunikasi Antar Kontainer (DNS Resolusi)

```bash
# Tes koneksi dari web-proxy ke backend-toko melalui NAMA KONTAINER
docker exec web-proxy ping -c 2 backend-toko

# Tes koneksi dari backend-toko ke database db-toko
docker exec backend-toko ping -c 2 db-toko
```

#### Output Ping DNS

```text
PING backend-toko (172.25.0.3): 56 data bytes
64 bytes from 172.25.0.3: seq=0 ttl=64 time=0.072 ms
64 bytes from 172.25.0.3: seq=1 ttl=64 time=0.068 ms

PING db-toko (172.25.0.2): 56 data bytes
64 bytes from 172.25.0.2: seq=0 ttl=64 time=0.081 ms
64 bytes from 172.25.0.2: seq=1 ttl=64 time=0.075 ms
```

#### Cara Kerja

```text
       Browser Pengunjung (Laptop Host)
                     │
                     ▼ http://localhost:8080
       ┌─────────────────────────────────────────────────────────┐
       │             User-Defined Network (toko-network)         │
       │                                                         │
       │   [web-proxy] (Port 8080:80)                            │
       │        │                                                │
       │        ▼ (HTTP Proxy via DNS 'backend-toko')            │
       │   [backend-toko]                                        │
       │        │                                                │
       │        ▼ (Koneksi Database via DNS 'db-toko:3306')      │
       │   [db-toko] ──► [Volume: mysql_toko_data (Persistent)]  │
       └─────────────────────────────────────────────────────────┘
```

**Hafalan:**

```text
Production Multi-Container Pattern → Custom Network (DNS) + Named Volume (Data) + Internal Port Security
```

---

<a id="bagian-30"></a>

## 30. 🔗 Referensi Resmi

Untuk mempelajari dokumentasi resmi, panduan teknis, dan spesifikasi Docker Engine:

- [Docker Official Documentation](https://docs.docker.com/)
- [Docker CLI Command Reference](https://docs.docker.com/engine/reference/commandline/cli/)
- [Docker Hub Official Image Registry](https://hub.docker.com/)
- [Open Container Initiative (OCI) Specifications](https://opencontainers.org/)
- [Docker Security & Best Practices Guide](https://docs.docker.com/engine/security/)

> **Catatan Versi:** Cheatsheet ini disusun mengacu pada spesifikasi **Docker Engine v26+ / v27+**. Seluruh sintaks perintah CLI yang dibahas kompatibel penuh dengan Docker Desktop di Windows (WSL 2), macOS, dan Linux Server.
