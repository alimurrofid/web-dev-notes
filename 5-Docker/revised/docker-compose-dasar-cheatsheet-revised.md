# Docker Compose Dasar Cheatsheet Revised

> **Target:** pemula yang sudah memahami dasar Docker (image,
> container, volume, network), lalu ingin mengenal Docker Compose
> untuk menjalankan aplikasi multi-container.
>
> Fokus cheatsheet ini: **pengenalan → install → config file → YAML →
> lifecycle container → service → port → environment → storage →
> network → dependency → restart → resource → build → healthcheck →
> extends → mini project**.
>
> **Batasan penting:** Docker Compose digunakan untuk mendefinisikan
> dan menjalankan aplikasi multi-container menggunakan satu file
> konfigurasi YAML. Cheatsheet ini mengikuti Compose Specification
> modern dengan command `docker compose` (bukan `docker-compose`).

## Cara Belajar

```text
🟢 Fundamental
→ wajib untuk mulai menggunakan Docker Compose

🟡 Lanjutan
→ pelajari setelah fundamental nyaman

🔴 Advanced / Reference
→ penting ketika kebutuhan aplikasi meningkat
```

Mental model:

```text
compose.yaml
     │
     ▼
docker compose
     │
     ▼
Project
     │
     ├── Service app
     ├── Service db
     ├── Network
     └── Volume
```

**Hafalan:**

```text
Docker Compose = definisi + konfigurasi + menjalankan banyak container
```

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Docker Compose](#bagian-1)
2. [Menginstall Docker Compose](#bagian-2)
3. [Configuration File](#bagian-3)
4. [YAML](#bagian-4)
5. [Membuat Container](#bagian-5)
6. [Menjalankan Container](#bagian-6)
7. [Melihat Container](#bagian-7)
8. [Menghentikan Container](#bagian-8)
9. [Menghapus Container](#bagian-9)
10. [Project Name](#bagian-10)
11. [Service](#bagian-11)
12. [Komentar](#bagian-12)
13. [Port](#bagian-13)

### 🟡 Lanjutan

14. [Environment Variable](#bagian-14)
15. [Bind Mount](#bagian-15)
16. [Volume](#bagian-16)
17. [Network](#bagian-17)
18. [Depends On](#bagian-18)
19. [Restart](#bagian-19)
20. [Resource Limit](#bagian-20)
21. [Dockerfile](#bagian-21)
22. [Health Check](#bagian-22)
23. [Extend Service](#bagian-23)

### 🔴 Advanced / Reference

24. [Peta Ingatan Cepat](#bagian-24)
25. [Tabel Ringkasan](#bagian-25)
26. [Cheat Code Docker Compose 10 Detik](#bagian-26)
27. [Urutan Belajar yang Disarankan](#bagian-27)
28. [Mini Project](#bagian-28)
29. [Referensi Resmi](#bagian-29)

------------------------------------------------------------------------

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan Docker Compose

## Konsep

Docker Compose adalah tool untuk mendefinisikan dan menjalankan
aplikasi yang terdiri dari satu atau beberapa container menggunakan
satu file YAML.

## Contoh aplikasi

```text
                 Docker Compose
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
        nginx        php-fpm       mysql
          │            │            │
          └────────────┴────────────┘
                   Network
```

## Tanpa Compose

Kita mungkin perlu menjalankan banyak command:

```bash
docker network create app-network

docker run -d \
  --name app-db \
  --network app-network \
  mysql:8.4

docker run -d \
  --name app \
  --network app-network \
  my-app
```

## Dengan Compose

```bash
docker compose up -d
```

Konfigurasi:

```yaml
services:
  app:
    image: nginx:alpine

  db:
    image: mysql:8.4
```

## Kunci

> Docker Compose = definisi + konfigurasi + menjalankan banyak
> container dalam satu file.

## Best Practice

- Gunakan Compose ketika aplikasi terdiri dari beberapa service
  (app + database + cache, dst.).

------------------------------------------------------------------------

<a id="bagian-2"></a>

# 2. 🟢 Menginstall Docker Compose

## Konsep

Pada Docker Desktop, Docker Compose sudah tersedia sebagai bagian dari
instalasi Docker Desktop.

## Cek versi

```bash
docker compose version
```

Contoh output:

```text
Docker Compose version v2.x.x
```

Pada Linux, Docker Compose modern digunakan sebagai Docker CLI plugin
sehingga command-nya:

```bash
docker compose
```

Bukan command lama:

```bash
docker-compose
```

## Perbedaan

```text
Modern
docker compose up

Legacy
docker-compose up
```

Cek Docker dan Compose:

```bash
docker version
docker compose version
```

## Kunci

> `docker compose` = Compose modern.

## Best Practice

- Untuk Linux, ikuti panduan instalasi resmi Docker sesuai distribusi
  yang digunakan.

------------------------------------------------------------------------

<a id="bagian-3"></a>

# 3. 🟢 Configuration File

## Konsep

Docker Compose menggunakan file konfigurasi YAML.

Nama yang umum:

```text
compose.yaml
compose.yml
```

Nama lama yang juga masih umum ditemukan:

```text
docker-compose.yml
```

## Struktur

```text
my-project/
├── compose.yaml
├── Dockerfile
├── app/
└── ...
```

Isi:

```yaml
services:
  app:
    image: nginx:alpine
```

Jalankan:

```bash
docker compose up -d
```

## Menentukan file sendiri

```bash
docker compose -f compose.dev.yaml up -d
```

Beberapa file:

```bash
docker compose \
  -f compose.yaml \
  -f compose.dev.yaml \
  up -d
```

## Config

Untuk memeriksa hasil konfigurasi setelah interpolasi dan merge:

```bash
docker compose config
```

Command ini sangat berguna untuk debugging YAML dan environment
variable.

## Kunci

> `compose.yaml` → `docker compose` → `services` → `containers`.

## Best Practice

- Gunakan `docker compose config` untuk memverifikasi hasil akhir
  konfigurasi sebelum `up`.

------------------------------------------------------------------------

<a id="bagian-4"></a>

# 4. 🟢 YAML

## Konsep

YAML adalah format data berbasis indentation yang digunakan oleh
Compose.

## Contoh

```yaml
name: my-project

services:
  app:
    image: nginx:alpine
    ports:
      - "8080:80"
```

## Indentation

Benar:

```yaml
services:
  app:
    image: nginx:alpine
```

Salah:

```yaml
services:
app:
image: nginx:alpine
```

Gunakan spasi, bukan tab.

## Key, value, list, object

```yaml
name: Budi
age: 20
```

```yaml
ports:
  - "8080:80"
  - "8443:443"
```

```yaml
environment:
  APP_ENV: development
  APP_DEBUG: "true"
```

## Boolean dan string

Untuk nilai yang ingin diperlakukan sebagai string, gunakan quote:

```yaml
environment:
  APP_PORT: "8080"
```

## String port

Sebaiknya tulis port mapping sebagai string:

```yaml
ports:
  - "8080:80"
```

## YAML vs Docker Compose

```text
YAML
↓
format penulisan

Compose Specification
↓
aturan konfigurasi Docker Compose
```

## Kunci

> `indentation` = struktur, `-` = list, `key: value` = data.

## Kesalahan Umum

❌ Menggunakan tab untuk indentation — YAML menolaknya.

✅ Gunakan spasi secara konsisten.

------------------------------------------------------------------------

<a id="bagian-5"></a>

# 5. 🟢 Membuat Container

## Konsep

Docker Compose mendefinisikan container melalui `services`.

## Contoh

```yaml
services:
  app:
    image: nginx:alpine
```

## Perintah

```bash
docker compose create
```

Perintah tersebut membuat container dari konfigurasi tanpa
menjalankannya.

Lihat:

```bash
docker compose ps -a
```

Contoh:

```text
NAME            IMAGE          SERVICE   STATUS
my-project-app  nginx:alpine   app       Created
```

## Membuat beberapa container

```yaml
services:
  app:
    image: nginx:alpine

  db:
    image: mysql:8.4
```

```bash
docker compose create
```

Hasil:

```text
app container
db container
```

## Kunci

> `docker compose create` → buat container, belum start.

------------------------------------------------------------------------

<a id="bagian-6"></a>

# 6. 🟢 Menjalankan Container

## Konsep

Command utama Compose adalah `up` — membuat dan menjalankan container.

## Contoh

```bash
docker compose up
```

Untuk background:

```bash
docker compose up -d
```

```yaml
services:
  app:
    image: nginx:alpine
    ports:
      - "8080:80"
```

Cek:

```bash
docker compose ps
```

Output kira-kira:

```text
NAME            SERVICE   STATUS
my-project-app  app       Up
```

## Build lalu run

Jika service menggunakan Dockerfile:

```bash
docker compose up -d --build
```

## Jalankan service tertentu dan force recreate

```bash
docker compose up -d app
docker compose up -d --force-recreate
```

## Kunci

> `docker compose up` → create + start.

## Best Practice

- Gunakan `-d` untuk menjalankan di background, dan `--build` setelah
  mengubah Dockerfile.

------------------------------------------------------------------------

<a id="bagian-7"></a>

# 7. 🟢 Melihat Container

## Konsep

Gunakan `ps` untuk melihat container, `logs` untuk log, `top` untuk
proses, dan `images` untuk image.

## Contoh

```bash
docker compose ps
docker compose ps -a
```

Contoh:

```text
NAME            IMAGE          SERVICE   STATUS
my-project-app  nginx:alpine   app       Up
my-project-db   mysql:8.4      db        Up
```

## Melihat log

```bash
docker compose logs
docker compose logs app
docker compose logs -f app
```

## Melihat proses dan image

```bash
docker compose top
docker compose images
```

## Kunci

> `ps` = container, `logs` = log, `top` = process, `images` = image.

------------------------------------------------------------------------

<a id="bagian-8"></a>

# 8. 🟢 Menghentikan Container

## Konsep

`stop` menghentikan container tanpa menghapusnya.

## Contoh

```bash
docker compose stop
```

Cek:

```bash
docker compose ps -a
```

Status:

```text
Exited
```

## Stop service tertentu dan start kembali

```bash
docker compose stop app
docker compose start
```

## Diagram

```text
Running
   │
   │ stop
   ▼
Stopped
   │
   │ start
   ▼
Running
```

## Kunci

> `stop` = berhenti, `start` = jalan lagi.

------------------------------------------------------------------------

<a id="bagian-9"></a>

# 9. 🟢 Menghapus Container

## Konsep

`rm` menghapus container, sedangkan `down` menurunkan project sekaligus
menghapus resource Compose.

## `rm`

```bash
docker compose rm
docker compose rm -f
```

## `down`

```bash
docker compose down
```

Biasanya:

```text
down
↓
stop
↓
remove container
↓
remove network yang dikelola project
```

## Down + volume

```bash
docker compose down -v
```

**HATI-HATI:** `down -v` dapat menghapus named volume yang dikelola
project dan data di dalamnya.

## Down + image

```bash
docker compose down --rmi local
```

## Kunci

> `stop` → berhenti saja, `rm` → hapus container tertentu, `down` →
> turunkan project + hapus resource project.

## Kesalahan Umum

❌ Menjalankan `docker compose down -v` sembarangan — menghapus data
volume.

✅ Periksa dulu volume yang dimiliki project sebelum memakai `-v`.

------------------------------------------------------------------------

<a id="bagian-10"></a>

# 10. 🟢 Project Name

## Konsep

Docker Compose menggunakan **project name** untuk mengelompokkan
resource yang berasal dari satu aplikasi Compose.

## Contoh

```text
Project: toko

Service: app, db

Nama resource:
toko-app-1
toko-db-1
```

## Default project name

Biasanya berasal dari nama directory project:

```text
my-app/
└── compose.yaml
```

Project name:

```text
my-app
```

## Atur project name

```bash
docker compose -p toko up -d
```

Hasil:

```text
toko-app-1
toko-db-1
```

Atau di dalam Compose file:

```yaml
name: toko

services:
  app:
    image: nginx:alpine
```

Atau environment variable:

```bash
COMPOSE_PROJECT_NAME=toko docker compose up -d
```

## Kunci

> project name = nama kelompok aplikasi Compose.

## Best Practice

- Gunakan `-p` untuk menentukan project name secara eksplisit ketika
  perlu memisahkan environment (dev/staging/prod).

------------------------------------------------------------------------

<a id="bagian-11"></a>

# 11. 🟢 Service

## Konsep

`services` adalah bagian utama file Compose — setiap service
mendefinisikan container template/configuration.

## Contoh

```yaml
services:
  app:
    image: nginx:alpine

  db:
    image: mysql:8.4
```

Di sini terdapat dua service: `app` dan `db`.

## Service name sebagai hostname

Service name dapat digunakan untuk komunikasi antar-container pada
network Compose:

```text
app
 ↓
db:3306
```

Tidak perlu `localhost:3306` dari dalam container `app`.

## Jalankan dan scale service

```bash
docker compose up -d app
docker compose up -d --scale app=3
```

## Kunci

> service = definisi satu jenis container. Service name = hostname di
> network Compose.

------------------------------------------------------------------------

<a id="bagian-12"></a>

# 12. 🟢 Komentar

## Konsep

Komentar YAML dimulai dengan `#` dan tidak diproses sebagai
konfigurasi.

## Contoh

```yaml
# Application service
services:
  app:
    image: nginx:alpine

    # Publish HTTP port
    ports:
      - "8080:80"
```

## Kunci

> `#` = komentar YAML.

## Best Practice

- Gunakan komentar untuk menjelaskan bagian konfigurasi yang tidak
  jelas, bukan mengulang yang sudah terbaca.

------------------------------------------------------------------------

<a id="bagian-13"></a>

# 13. 🟢 Port

## Konsep

`ports` mem-publish port container ke host dengan format
`"HOST:CONTAINER"`.

## Contoh

```yaml
services:
  app:
    image: nginx:alpine
    ports:
      - "8080:80"
```

Artinya:

```text
localhost:8080
      │
      ▼
container:80
```

## Beberapa port dan bind ke localhost

```yaml
ports:
  - "8080:80"
  - "8443:443"
```

```yaml
ports:
  - "127.0.0.1:8080:80"
```

## UDP

```yaml
ports:
  - "5353:5353/udp"
```

## EXPOSE vs ports

```dockerfile
EXPOSE 80
```

```yaml
ports:
  - "8080:80"
```

```text
EXPOSE → dokumentasi port image
ports  → publish port ke host
```

## Kunci

> `"8080:80"` → host:container.

## Kesalahan Umum

❌ Mengira `EXPOSE` di Dockerfile sudah mem-publish port.

✅ `EXPOSE` hanya dokumentasi; publish port dilakukan dengan `ports`
di Compose.

------------------------------------------------------------------------

<a id="bagian-14"></a>

# 14. 🟡 Environment Variable

## Konsep

Gunakan `environment` untuk mengatur environment variable pada
service, dan `env_file` untuk membaca dari file.

## Mapping dan list

```yaml
services:
  app:
    image: nginx:alpine
    environment:
      APP_ENV: production
      APP_DEBUG: "false"
```

```yaml
    environment:
      - APP_ENV=production
      - APP_DEBUG=false
```

## Dari `.env` (interpolasi)

File `.env`:

```text
APP_ENV=production
APP_PORT=8080
```

Compose:

```yaml
services:
  app:
    image: nginx:alpine
    environment:
      APP_ENV: ${APP_ENV}
    ports:
      - "${APP_PORT}:80"
```

## `env_file`

```yaml
services:
  app:
    image: nginx:alpine
    env_file:
      - .env
```

## Bedakan `.env` dan `env_file`

```text
.env
↓
sering digunakan untuk interpolation Compose

env_file
↓
memasukkan variable ke environment container
```

## Kunci

> `environment` = environment container.

## Kesalahan Umum

❌ Menyimpan password atau secret sensitif di repository.

✅ Untuk secret, gunakan mekanisme secret yang sesuai dengan deployment
Anda.

------------------------------------------------------------------------

<a id="bagian-15"></a>

# 15. 🟡 Bind Mount

## Konsep

Bind mount menghubungkan path host ke path container dengan format
`./host-path:/container-path`.

## Contoh

```yaml
services:
  app:
    image: nginx:alpine
    volumes:
      - ./html:/usr/share/nginx/html
```

Mapping:

```text
./html
   │
   ▼
/usr/share/nginx/html
```

## Read-only

```yaml
volumes:
  - ./config:/app/config:ro
```

Artinya container hanya dapat membaca mount tersebut.

## Bind mount vs volume

```text
Bind Mount → host path
Volume     → dikelola Docker
```

## Kunci

> `./folder:/container/folder` → bind mount.

## Best Practice

- Gunakan bind mount untuk development (sinkron dengan folder host),
  dan named volume untuk data production.

------------------------------------------------------------------------

<a id="bagian-16"></a>

# 16. 🟡 Volume

## Konsep

Named volume dikelola oleh Docker dan dideklarasikan di bawah kunci
`volumes:` level atas.

## Contoh

```yaml
services:
  db:
    image: mysql:8.4
    volumes:
      - db-data:/var/lib/mysql

volumes:
  db-data:
```

## Diagram

```text
Named Volume
db-data
   │
   ▼
/var/lib/mysql
```

## Cek volume

```bash
docker volume ls
docker volume inspect my-project_db-data
```

## Named volume vs bind mount

```yaml
volumes:
  - db-data:/data    # named volume
```

```yaml
volumes:
  - ./data:/data     # bind mount
```

## Kunci

> `./data:/data` → bind mount, `db-data:/data` → named volume.

## Best Practice

- Selalu deklarasikan named volume di kunci `volumes:` level atas
  agar Compose mengelolanya.

------------------------------------------------------------------------

<a id="bagian-17"></a>

# 17. 🟡 Network

## Konsep

Compose secara default membuat network untuk project, dan service
dapat berkomunikasi menggunakan service name.

## Default network

```yaml
services:
  app:
    image: nginx:alpine

  db:
    image: mysql:8.4
```

```text
my-project
    │
    ▼
default network
   ┌───────┐
   │       │
  app     db
```

Service dapat berkomunikasi:

```text
app → db:3306
```

## Custom network

```yaml
services:
  app:
    image: nginx:alpine
    networks:
      - frontend

  db:
    image: mysql:8.4
    networks:
      - backend

networks:
  frontend:
  backend:
```

Sekarang `app` dan `db` tidak otomatis berada pada network yang sama.

## Dua network

```yaml
services:
  app:
    image: nginx:alpine
    networks:
      - frontend
      - backend

  db:
    image: mysql:8.4
    networks:
      - backend

networks:
  frontend:
  backend:
```

## Kunci

> service name = hostname di network Compose.

## Best Practice

- Gunakan network terpisah untuk memisahkan layer (frontend/backend)
  sesuai kebutuhan keamanan.

------------------------------------------------------------------------

<a id="bagian-18"></a>

# 18. 🟡 Depends On

## Konsep

`depends_on` menentukan dependency antar-service (urutan start).

## Contoh

```yaml
services:
  app:
    image: nginx:alpine
    depends_on:
      - db

  db:
    image: mysql:8.4
```

Artinya service `db` dibuat/dijalankan sebelum `app`.

## Depends On + Healthcheck

```yaml
services:
  app:
    image: my-app
    depends_on:
      db:
        condition: service_healthy

  db:
    image: mysql:8.4
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
```

Konsep:

```text
db start
  │
  ▼
healthcheck
  │
  ├── unhealthy → tunggu
  │
  └── healthy → app boleh start
```

## Penting

```text
depends_on
≠
menjamin aplikasi siap menerima request
```

Untuk readiness yang lebih bermakna, gunakan `healthcheck` dengan
`condition: service_healthy`.

## Kunci

> `depends_on` = dependency order.

## Kesalahan Umum

❌ Mengira `depends_on` menjamin aplikasi dependency sudah siap
menerima request.

✅ Gunakan `healthcheck` + `condition: service_healthy` untuk
readiness.

------------------------------------------------------------------------

<a id="bagian-19"></a>

# 19. 🟡 Restart

## Konsep

`restart` menentukan kebijakan restart container setelah berhenti.

## Contoh

```yaml
services:
  app:
    image: nginx:alpine
    restart: unless-stopped
```

## Pilihan umum

```text
no
always
on-failure
unless-stopped
```

## `no` dan `always`

```yaml
restart: "no"
```

Container tidak otomatis di-restart.

```yaml
restart: always
```

Docker akan selalu mencoba menjalankan kembali container sesuai
kebijakan restart.

## `on-failure` dan `unless-stopped`

```yaml
restart: on-failure
restart: on-failure:5
```

Restart ketika container berhenti dengan error/non-zero exit.

```yaml
restart: unless-stopped
```

Restart kecuali container memang dihentikan.

## Kunci

> restart = apa yang dilakukan setelah container berhenti?

## Best Practice

- Gunakan `unless-stopped` untuk service aplikasi pada umumnya agar
  ikut hidup kembali setelah daemon restart.

------------------------------------------------------------------------

<a id="bagian-20"></a>

# 20. 🟡 Resource Limit

## Konsep

Resource limit digunakan untuk membatasi penggunaan resource
container.

## CPU dan memory

```yaml
services:
  app:
    image: nginx:alpine
    cpus: 0.5
    mem_limit: 512m
```

Artinya service dibatasi sekitar 0.5 CPU dan 512 MB memory.

## Kombinasi

```yaml
services:
  app:
    image: nginx:alpine
    cpus: 1.0
    mem_limit: 512m
```

## CPU + memory di deploy

```yaml
services:
  app:
    image: nginx:alpine
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 512M
```

Untuk penggunaan lokal dengan Docker Compose, perhatikan field
resource yang didukung oleh versi Compose/engine yang digunakan.

## Kunci

> `cpus` = batas CPU, `mem_limit` = batas memory.

## Best Practice

- Tentukan limit berdasarkan kebutuhan aplikasi dan pengujian, bukan
  angka acak.

------------------------------------------------------------------------

<a id="bagian-21"></a>

# 21. 🟡 Dockerfile

## Konsep

Compose dapat membangun image dari Dockerfile menggunakan `build`.

## Struktur

```text
project/
├── compose.yaml
├── Dockerfile
└── app/
```

Dockerfile:

```dockerfile
FROM nginx:alpine

COPY app/ /usr/share/nginx/html/
```

Compose:

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:80"
```

## Build

```bash
docker compose build
docker compose up -d --build
```

## Context dan Dockerfile custom

```yaml
build:
  context: .
```

```yaml
build:
  context: .
  dockerfile: Dockerfile.dev
```

## Build arguments

```yaml
services:
  app:
    build:
      context: .
      args:
        APP_VERSION: "1.0"
```

Dockerfile:

```dockerfile
FROM alpine

ARG APP_VERSION

RUN echo "Building $APP_VERSION"
```

## Kunci

> `build: { context: ., dockerfile: Dockerfile }` → bangun image dari
> Dockerfile.

## Best Practice

- Gunakan `docker compose up -d --build` setelah mengubah Dockerfile
  agar image dibangun ulang.

------------------------------------------------------------------------

<a id="bagian-22"></a>

# 22. 🟡 Health Check

## Konsep

Health check di Compose ditulis pada service menggunakan
`healthcheck`.

## Contoh

```yaml
services:
  app:
    image: nginx:alpine
    healthcheck:
      test:
        - CMD
        - wget
        - -qO-
        - http://localhost/
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 5s
```

## Cek status

```bash
docker compose ps
```

Atau:

```bash
docker inspect \
  my-project-app-1 \
  -f '{{.State.Health.Status}}'
```

Hasil:

```text
healthy
```

## CMD-SHELL dan disable

```yaml
healthcheck:
  test: ["CMD-SHELL", "wget -qO- http://localhost/ || exit 1"]
  interval: 10s
  timeout: 5s
  retries: 3
```

Jika image sudah memiliki healthcheck dan ingin menonaktifkannya:

```yaml
healthcheck:
  disable: true
```

## Digabung dengan depends_on

```yaml
services:
  app:
    image: my-app
    depends_on:
      db:
        condition: service_healthy

  db:
    image: mysql:8.4
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
```

## Kunci

> `healthcheck` = apakah service sehat? `depends_on` +
> `service_healthy` = tunggu dependency sehat.

------------------------------------------------------------------------

<a id="bagian-23"></a>

# 23. 🟡 Extend Service

## Konsep

`extends` memungkinkan sebuah service mewarisi konfigurasi dari
service lain (reuse configuration).

## Contoh

```yaml
services:
  base:
    image: nginx:alpine
    environment:
      APP_ENV: production
    restart: unless-stopped

  app:
    extends:
      service: base
    ports:
      - "8080:80"
```

Konsep:

```text
base
 │
 │ extends
 ▼
app
```

## File berbeda

`compose.base.yaml`:

```yaml
services:
  base:
    image: nginx:alpine
    restart: unless-stopped
```

`compose.yaml`:

```yaml
services:
  app:
    extends:
      file: compose.base.yaml
      service: base

    ports:
      - "8080:80"
```

## Kapan digunakan?

Berguna ketika beberapa service memiliki konfigurasi yang ingin
digunakan kembali:

```text
base service
   │
   ├── app-dev
   ├── app-staging
   └── app-prod
```

## Kunci

> `extends` = gunakan ulang konfigurasi service.

## Kesalahan Umum

❌ Mengira `extends` otomatis menjalankan service yang di-extend
sebagai dependency.

✅ `extends` hanya reuse konfigurasi, bukan dependency.

------------------------------------------------------------------------

<a id="bagian-24"></a>

# 24. 🧠 Peta Ingatan Cepat

## A. Alur Compose

```text
compose.yaml
     │
     ▼
docker compose
     │
     ▼
Project
     │
     ├── Service app
     ├── Service db
     ├── Network
     └── Volume
```

## B. Command Utama

```text
docker compose up    → buat + jalankan
docker compose ps    → lihat
docker compose logs  → lihat log
docker compose stop  → hentikan
docker compose start → jalankan kembali
docker compose rm    → hapus container
docker compose down  → turunkan project + hapus resource
```

## C. Service

```yaml
services:
  app:
    image: nginx:alpine
```

Hafalan:

```text
services = kumpulan service
app      = nama service
image    = image yang digunakan
```

## D. Port

```yaml
ports:
  - "8080:80"
```

```text
HOST       CONTAINER
8080   →   80
```

## E. Environment

```yaml
environment:
  APP_ENV: production
```

atau:

```yaml
env_file:
  - .env
```

## F. Storage

```text
./html:/usr/share/nginx/html  → bind mount
html-data:/usr/share/nginx/html → named volume
```

## G. Network

```yaml
services:
  app:
    networks:
      - backend

  db:
    networks:
      - backend

networks:
  backend:
```

Hafalan: service name = hostname. Contoh: `app → db:3306`.

## H. Dependency

```yaml
depends_on:
  db:
    condition: service_healthy
```

Alur:

```text
db
↓
healthcheck
↓
healthy
↓
app
```

## I. Restart

```text
no
always
on-failure
unless-stopped
```

## J. Resource

```yaml
cpus: 0.5
mem_limit: 512m
```

## K. Build

```yaml
build:
  context: .
  dockerfile: Dockerfile
```

Hafalan:

```text
Compose → Dockerfile → Image → Container
```

## L. Health

```yaml
healthcheck:
  test: ["CMD", "wget", "-qO-", "http://localhost/"]
```

## M. Extend

```yaml
extends:
  service: base
```

------------------------------------------------------------------------

<a id="bagian-25"></a>

# 25. 📚 Tabel Ringkasan

  Materi                 Fungsi                               Kata Kunci
  ---------------------- ------------------------------------ ----------------------------
  Pengenalan Compose     Mengelola aplikasi multi-container   `compose.yaml`
  Install Compose        Menyiapkan Compose                   `docker compose version`
  Configuration File     File konfigurasi Compose             `compose.yaml`
  YAML                   Format konfigurasi                   `key: value`
  Membuat Container      Membuat container dari service       `docker compose create`
  Menjalankan Container  Menjalankan project                  `docker compose up`
  Melihat Container      Melihat service/container            `docker compose ps`
  Menghentikan Container Menghentikan container               `docker compose stop`
  Menghapus Container    Menghapus container/resource         `docker compose rm`, `down`
  Project Name           Nama project Compose                 `-p`, `name`
  Service                Definisi aplikasi/container          `services:`
  Komentar               Catatan YAML                         `#`
  Port                   Publish port                         `ports:`
  Environment Variable   Variable container                   `environment:`
  Bind Mount             Mount host path                      `./src:/app`
  Volume                 Persistent storage Docker            `volume:/data`
  Network                Komunikasi service                   `networks:`
  Depends On             Dependency service                   `depends_on:`
  Restart                Kebijakan restart                    `restart:`
  Resource Limit         Membatasi resource                   `cpus`, `mem_limit`
  Dockerfile             Build image                          `build:`
  Health Check           Cek kesehatan service                `healthcheck:`
  Extend Service         Reuse konfigurasi                    `extends:`

------------------------------------------------------------------------

<a id="bagian-26"></a>

# 26. ⚡ Cheat Code Docker Compose 10 Detik

```text
docker compose up    → buat + jalankan
docker compose ps    → lihat container
docker compose logs  → lihat log
docker compose stop  → hentikan
docker compose start → jalankan kembali
docker compose down  → hapus resource project

services:   → definisi service
image:      → image yang dipakai
build:      → bangun dari Dockerfile
ports:      → "host:container"
environment → environment variable
./src:/app  → bind mount
db-data:/data → named volume
networks:   → komunikasi service
depends_on  → dependency order
restart:    → kebijakan restart
healthcheck → cek kesehatan
extends:    → reuse konfigurasi
```

## Compose dasar

```yaml
services:
  app:
    image: nginx:alpine
    ports:
      - "8080:80"
```

## Dengan build

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:80"
```

## Jalankan

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f
docker compose down
```

------------------------------------------------------------------------

<a id="bagian-27"></a>

# 27. 🧭 Urutan Belajar yang Disarankan

```text
1. Pengenalan Docker Compose
       ↓
2. Install & Configuration File
       ↓
3. YAML
       ↓
4. Service & Lifecycle (up, ps, stop, down)
       ↓
5. Port & Environment Variable
       ↓
6. Storage (bind mount, volume)
       ↓
7. Network
       ↓
8. Depends On & Health Check
       ↓
9. Restart & Resource Limit
       ↓
10. Build (Dockerfile)
        ↓
11. Extend Service
        ↓
12. Mini project
```

Prinsip: kuasai dulu `up` / `ps` / `down` dengan service sederhana,
lalu tambahkan storage, network, dan dependency.

------------------------------------------------------------------------

<a id="bagian-28"></a>

# 28. 🏗️ Mini Project

## PHP + MySQL dengan Docker Compose

Project:

```text
php-compose/
├── compose.yaml
├── Dockerfile
├── .dockerignore
└── app/
    └── index.php
```

## `app/index.php`

```php
<?php

echo "Hello Docker Compose!";
```

## `Dockerfile`

```dockerfile
FROM php:8.4-cli

WORKDIR /app

COPY app/ .

EXPOSE 8000

CMD ["php", "-S", "0.0.0.0:8000", "-t", "/app"]
```

## `.dockerignore`

```text
.git
.env
*.log
```

## `compose.yaml`

```yaml
name: php-compose

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile

    ports:
      - "8000:8000"

    environment:
      APP_ENV: development
      DB_HOST: db
      DB_PORT: "3306"
      DB_DATABASE: app
      DB_USERNAME: app
      DB_PASSWORD: secret

    depends_on:
      db:
        condition: service_healthy

    restart: unless-stopped

    healthcheck:
      test:
        - CMD-SHELL
        - php -r "exit(@fsockopen('127.0.0.1', 8000) ? 0 : 1);"
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 5s

  db:
    image: mysql:8.4

    environment:
      MYSQL_DATABASE: app
      MYSQL_USER: app
      MYSQL_PASSWORD: secret
      MYSQL_ROOT_PASSWORD: root-secret

    volumes:
      - db-data:/var/lib/mysql

    restart: unless-stopped

    healthcheck:
      test:
        - CMD
        - mysqladmin
        - ping
        - -h
        - localhost
        - -uapp
        - -psecret
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 20s

volumes:
  db-data:
```

## Build dan jalankan

```bash
docker compose up -d --build
```

## Lihat container

```bash
docker compose ps
```

Output kira-kira:

```text
NAME                  SERVICE   STATUS
php-compose-app-1     app       Up
php-compose-db-1      db        Up
```

## Lihat log dan buka aplikasi

```bash
docker compose logs -f
```

```text
http://localhost:8000
```

Output:

```text
Hello Docker Compose!
```

## Cek health dan masuk container

```bash
docker compose ps
docker compose exec app sh
```

Service yang sehat akan menunjukkan status health, misalnya
`Up (healthy)`.

## Cek environment

```bash
docker compose exec app printenv DB_HOST
```

Output:

```text
db
```

Perhatikan bahwa aplikasi menggunakan `DB_HOST=db` — bukan
`DB_HOST=localhost` — karena `db` adalah **service name** yang dapat
digunakan sebagai hostname di network Compose.

## Stop, start, down

```bash
docker compose stop
docker compose start
docker compose down
```

## Down + volume

```bash
docker compose down -v
```

**HATI-HATI:** command terakhir menghapus named volume project sehingga
data MySQL dapat ikut hilang.

------------------------------------------------------------------------

<a id="bagian-29"></a>

# 29. 🔗 Referensi Resmi

## Docker Compose

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Compose File Reference](https://docs.docker.com/reference/compose-file/)
- [Docker Compose CLI Reference](https://docs.docker.com/reference/cli/docker/compose/)
- [Compose Getting Started](https://docs.docker.com/compose/gettingstarted/)
- [Compose Installation](https://docs.docker.com/compose/install/)
- [Compose Environment Variables](https://docs.docker.com/compose/how-tos/environment-variables/)
- [Compose Networking](https://docs.docker.com/compose/how-tos/networking/)
- [Compose Volumes](https://docs.docker.com/compose/how-tos/volumes/)

## YAML

- [YAML Specification](https://yaml.org/spec/)

## Docker

- [Docker Documentation](https://docs.docker.com/)
- [Dockerfile Reference](https://docs.docker.com/reference/dockerfile/)

> **Format tautan:** Semua tautan di cheatsheet ini menggunakan format
> Markdown standar (`[teks](https://...)`) agar tetap terbaca dengan
> baik di GitHub, GitLab, VS Code, Obsidian, dan Markdown renderer
> lainnya.
>
> **Catatan versi:** Docker Compose modern menggunakan Compose
> Specification dan command `docker compose`. Detail field tertentu,
> terutama resource/deployment configuration, dapat bergantung pada
> versi Docker Compose dan target deployment. Untuk penggunaan
> production, selalu cek dokumentasi Compose Reference sesuai versi
> yang digunakan.
