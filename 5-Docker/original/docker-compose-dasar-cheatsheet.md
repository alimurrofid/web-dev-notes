# Docker Compose Dasar Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Docker Compose untuk pemula. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> Docker Compose digunakan untuk mendefinisikan dan menjalankan aplikasi multi-container menggunakan satu file konfigurasi YAML.

## Daftar Isi

1. [Pengenalan Docker Compose](#1-pengenalan-docker-compose)
2. [Menginstall Docker Compose](#2-menginstall-docker-compose)
3. [Configuration File](#3-configuration-file)
4. [YAML](#4-yaml)
5. [Membuat Container](#5-membuat-container)
6. [Menjalankan Container](#6-menjalankan-container)
7. [Melihat Container](#7-melihat-container)
8. [Menghentikan Container](#8-menghentikan-container)
9. [Menghapus Container](#9-menghapus-container)
10. [Project Name](#10-project-name)
11. [Service](#11-service)
12. [Komentar](#12-komentar)
13. [Port](#13-port)
14. [Environment Variable](#14-environment-variable)
15. [Bind Mount](#15-bind-mount)
16. [Volume](#16-volume)
17. [Network](#17-network)
18. [Depends On](#18-depends-on)
19. [Restart](#19-restart)
20. [Resource Limit](#20-resource-limit)
21. [Dockerfile](#21-dockerfile)
22. [Health Check](#22-health-check)
23. [Extend Service](#23-extend-service)
24. [Peta Ingatan Cepat](#24-peta-ingatan-cepat)
25. [Tabel Ringkasan](#25-tabel-ringkasan)
26. [Mini Project](#26-mini-project)
27. [Cheat Code Docker Compose 10 Detik](#27-cheat-code-docker-compose-10-detik)
28. [Referensi Resmi](#28-referensi-resmi)

---

# 1. Pengenalan Docker Compose

Docker Compose adalah tool untuk mendefinisikan dan menjalankan aplikasi yang terdiri dari satu atau beberapa container menggunakan satu file YAML.

Contoh aplikasi:

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

Tanpa Compose, kita mungkin perlu menjalankan banyak command:

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

Dengan Compose:

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

**Hafalan:**

```text
Docker Compose = definisi + konfigurasi + menjalankan banyak container
```

---

# 2. Menginstall Docker Compose

Pada Docker Desktop, Docker Compose sudah tersedia sebagai bagian dari instalasi Docker Desktop.

Cek:

```bash
docker compose version
```

Contoh output:

```text
Docker Compose version v2.x.x
```

Pada Linux, Docker Compose modern digunakan sebagai Docker CLI plugin sehingga command-nya:

```bash
docker compose
```

Bukan command lama:

```bash
docker-compose
```

Perbedaan:

```text
Modern
docker compose up

Legacy
docker-compose up
```

Untuk Linux, ikuti panduan instalasi resmi Docker sesuai distribusi yang digunakan.

Cek Docker:

```bash
docker version
```

Cek Compose:

```bash
docker compose version
```

**Hafalan:**

```text
docker compose = Compose modern
```

---

# 3. Configuration File

Docker Compose menggunakan file konfigurasi YAML.

Nama yang umum:

```text
compose.yaml
```

atau:

```text
compose.yml
```

Nama lama yang juga masih umum ditemukan:

```text
docker-compose.yml
```

Contoh struktur:

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

Docker Compose akan mencari file Compose yang sesuai pada project directory/current directory.

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

Command ini sangat berguna untuk debugging YAML dan environment variable.

**Hafalan:**

```text
compose.yaml
      ↓
docker compose
      ↓
services
      ↓
containers
```

---

# 4. YAML

YAML adalah format data berbasis indentation.

Contoh:

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

## Key dan value

```yaml
name: Budi
age: 20
```

## List

```yaml
ports:
  - "8080:80"
  - "8443:443"
```

## Object

```yaml
environment:
  APP_ENV: development
  APP_DEBUG: "true"
```

## Boolean

```yaml
restart: true
```

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

bukan:

```yaml
ports:
  - 8080:80
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

**Hafalan:**

```text
indentation = struktur
-           = list
key: value  = data
```

---

# 5. Membuat Container

Docker Compose mendefinisikan container melalui `services`.

Contoh:

```yaml
services:
  app:
    image: nginx:alpine
```

Perintah:

```bash
docker compose create
```

Perintah tersebut membuat container dari konfigurasi tanpa menjalankannya.

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

Create:

```bash
docker compose create
```

Hasil:

```text
app container
db container
```

**Hafalan:**

```text
docker compose create
↓
buat container
↓
belum start
```

---

# 6. Menjalankan Container

Command utama:

```bash
docker compose up
```

Untuk background:

```bash
docker compose up -d
```

Contoh:

```yaml
services:
  app:
    image: nginx:alpine
    ports:
      - "8080:80"
```

Jalankan:

```bash
docker compose up -d
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

## Jalankan service tertentu

```bash
docker compose up -d app
```

## Force recreate

```bash
docker compose up -d --force-recreate
```

**Hafalan:**

```text
docker compose up
↓
create + start
```

---

# 7. Melihat Container

Gunakan:

```bash
docker compose ps
```

Untuk termasuk container yang berhenti:

```bash
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
```

Service tertentu:

```bash
docker compose logs app
```

Follow:

```bash
docker compose logs -f app
```

## Melihat proses

```bash
docker compose top
```

## Melihat image/config

```bash
docker compose images
```

**Hafalan:**

```text
ps     = container
logs   = log
top    = process
images = image
```

---

# 8. Menghentikan Container

Gunakan:

```bash
docker compose stop
```

Ini menghentikan container tanpa menghapusnya.

Contoh:

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

## Stop service tertentu

```bash
docker compose stop app
```

## Start kembali

```bash
docker compose start
```

Diagram:

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

**Hafalan:**

```text
stop = berhenti
start = jalan lagi
```

---

# 9. Menghapus Container

Command:

```bash
docker compose rm
```

Untuk menghapus container yang sudah berhenti:

```bash
docker compose rm
```

Force:

```bash
docker compose rm -f
```

## Down

Untuk menghentikan sekaligus menghapus resource yang dibuat Compose:

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

**HATI-HATI:**

```text
down -v
```

dapat menghapus named volume yang dikelola project dan data di dalamnya.

## Down + image

```bash
docker compose down --rmi local
```

**Hafalan:**

```text
stop
↓
berhenti saja

rm
↓
hapus container tertentu

down
↓
turunkan project + hapus resource project
```

---

# 10. Project Name

Docker Compose menggunakan **project name** untuk mengelompokkan resource yang berasal dari satu aplikasi Compose.

Contoh:

```text
Project: toko
```

Service:

```text
app
db
```

Nama resource dapat memiliki prefix:

```text
toko-app-1
toko-db-1
```

## Default project name

Biasanya berasal dari nama directory project.

Contoh:

```text
my-app/
└── compose.yaml
```

Project name:

```text
my-app
```

## `-p`

Atur project name:

```bash
docker compose -p toko up -d
```

Hasil:

```text
toko-app-1
toko-db-1
```

## `name`

Project name juga dapat ditentukan dalam Compose file:

```yaml
name: toko

services:
  app:
    image: nginx:alpine
```

## Environment variable

```bash
COMPOSE_PROJECT_NAME=toko docker compose up -d
```

Prioritas project name mengikuti aturan Compose, sehingga `-p` merupakan cara yang praktis ketika ingin menentukan project name secara eksplisit.

**Hafalan:**

```text
project name = nama kelompok aplikasi Compose
```

---

# 11. Service

`services` adalah bagian utama file Compose.

Contoh:

```yaml
services:
  app:
    image: nginx:alpine

  db:
    image: mysql:8.4
```

Di sini terdapat dua service:

```text
app
db
```

Setiap service mendefinisikan container template/configuration.

## Service name

```yaml
services:
  app:
    image: nginx:alpine
```

Nama:

```text
app
```

Service name dapat digunakan untuk komunikasi antar-container pada network Compose.

Contoh aplikasi:

```text
app
 ↓
db:3306
```

Tidak perlu:

```text
localhost:3306
```

dari dalam container `app`.

## Jalankan service tertentu

```bash
docker compose up -d app
```

## Scale service

```bash
docker compose up -d --scale app=3
```

**Hafalan:**

```text
service = definisi satu jenis container
```

---

# 12. Komentar

Komentar YAML dimulai dengan:

```yaml
#
```

Contoh:

```yaml
# Application service
services:
  app:
    image: nginx:alpine

    # Publish HTTP port
    ports:
      - "8080:80"
```

Komentar tidak diproses sebagai konfigurasi.

**Hafalan:**

```text
# = komentar YAML
```

---

# 13. Port

Format:

```yaml
ports:
  - "HOST:CONTAINER"
```

Contoh:

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

## Beberapa port

```yaml
ports:
  - "8080:80"
  - "8443:443"
```

## Bind ke localhost

```yaml
ports:
  - "127.0.0.1:8080:80"
```

Port container hanya dipublish ke localhost host.

## UDP

```yaml
ports:
  - "5353:5353/udp"
```

## EXPOSE vs ports

Dockerfile:

```dockerfile
EXPOSE 80
```

Compose:

```yaml
ports:
  - "8080:80"
```

Perbedaannya:

```text
EXPOSE
↓
dokumentasi port image

ports
↓
publish port ke host
```

**Hafalan:**

```text
"8080:80"
   │    │
   │    └── container
   └─────── host
```

---

# 14. Environment Variable

Gunakan `environment` untuk mengatur environment variable pada service.

## Mapping

```yaml
services:
  app:
    image: nginx:alpine
    environment:
      APP_ENV: production
      APP_DEBUG: "false"
```

## List

```yaml
services:
  app:
    image: nginx:alpine
    environment:
      - APP_ENV=production
      - APP_DEBUG=false
```

## Dari `.env`

File:

```text
.env
```

Isi:

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
```

Atau langsung interpolasi:

```yaml
services:
  app:
    image: nginx:alpine
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

**Catatan keamanan:** jangan menyimpan password atau secret sensitif di repository. Untuk secret, gunakan mekanisme secret yang sesuai dengan deployment Anda.

**Hafalan:**

```text
environment = environment container
```

---

# 15. Bind Mount

Bind mount menghubungkan path host ke path container.

Format:

```yaml
volumes:
  - ./host-path:/container-path
```

Contoh:

```yaml
services:
  app:
    image: nginx:alpine
    volumes:
      - ./html:/usr/share/nginx/html
```

Struktur:

```text
project/
├── compose.yaml
└── html/
    └── index.html
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
Bind Mount
↓
host path

Volume
↓
dikelola Docker
```

**Hafalan:**

```text
./folder:/container/folder
```

---

# 16. Volume

Named volume dikelola oleh Docker.

Contoh:

```yaml
services:
  db:
    image: mysql:8.4
    volumes:
      - db-data:/var/lib/mysql

volumes:
  db-data:
```

Diagram:

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
```

Inspect:

```bash
docker volume inspect my-project_db-data
```

## Volume read-only

```yaml
volumes:
  - db-data:/data:ro
```

## Named volume vs bind mount

Named volume:

```yaml
volumes:
  - db-data:/data
```

Bind mount:

```yaml
volumes:
  - ./data:/data
```

**Hafalan:**

```text
./data:/data
↓
bind mount

db-data:/data
↓
named volume
```

---

# 17. Network

Compose secara default membuat network untuk project.

Contoh:

```yaml
services:
  app:
    image: nginx:alpine

  db:
    image: mysql:8.4
```

Secara konsep:

```text
my-project
    │
    ▼
default network
   ┌───────┐
   │       │
  app     db
```

Service dapat berkomunikasi menggunakan service name.

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

Sekarang:

```text
frontend
   │
  app

backend
   │
  db
```

`app` dan `db` tidak otomatis berada pada network yang sama.

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

Diagram:

```text
frontend
   │
   ▼
  app
   │
   ▼
backend
   │
   ▼
  db
```

**Hafalan:**

```text
service name = hostname di network Compose
```

---

# 18. Depends On

`depends_on` menentukan dependency antar-service.

Contoh:

```yaml
services:
  app:
    image: nginx:alpine
    depends_on:
      - db

  db:
    image: mysql:8.4
```

Artinya Compose mengetahui:

```text
db
↓
app
```

Service `db` dibuat/dijalankan sebelum `app` sesuai dependency yang didefinisikan.

## Depends On + Healthcheck

Contoh yang lebih kuat:

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

**Penting:**

```text
depends_on
≠
menjamin aplikasi siap menerima request
```

Untuk readiness yang lebih bermakna, gunakan `healthcheck` dengan `condition: service_healthy`.

**Hafalan:**

```text
depends_on = dependency order
```

---

# 19. Restart

`restart` menentukan kebijakan restart container.

Contoh:

```yaml
services:
  app:
    image: nginx:alpine
    restart: unless-stopped
```

Pilihan umum:

```text
no
always
on-failure
unless-stopped
```

## no

Default:

```yaml
restart: "no"
```

Container tidak otomatis di-restart.

## always

```yaml
restart: always
```

Docker akan selalu mencoba menjalankan kembali container sesuai kebijakan restart.

## on-failure

```yaml
restart: on-failure
```

Restart ketika container berhenti dengan error/non-zero exit.

Dengan batas:

```yaml
restart: on-failure:5
```

## unless-stopped

```yaml
restart: unless-stopped
```

Restart kecuali container memang dihentikan dan kebijakan tersebut mempertahankan keadaan stopped.

**Hafalan:**

```text
restart = apa yang dilakukan setelah container berhenti?
```

---

# 20. Resource Limit

Resource limit digunakan untuk membatasi penggunaan resource container.

## CPU

Pada Compose modern, `cpus` dapat digunakan:

```yaml
services:
  app:
    image: nginx:alpine
    cpus: 0.5
```

Artinya service dibatasi sekitar:

```text
0.5 CPU
```

## Memory

```yaml
services:
  app:
    image: nginx:alpine
    mem_limit: 512m
```

Artinya memory limit:

```text
512 MB
```

## Kombinasi

```yaml
services:
  app:
    image: nginx:alpine
    cpus: 1.0
    mem_limit: 512m
```

## CPU + memory di deploy

Compose juga memiliki bagian `deploy.resources` untuk skenario deployment yang mendukung resource model tersebut:

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

Untuk penggunaan lokal dengan Docker Compose, perhatikan field resource yang didukung oleh versi Compose/engine yang digunakan.

**Hafalan:**

```text
cpus      = batas CPU
mem_limit = batas memory
```

---

# 21. Dockerfile

Compose dapat membangun image dari Dockerfile menggunakan `build`.

Struktur:

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

Build:

```bash
docker compose build
```

Atau:

```bash
docker compose up -d --build
```

## Context

```yaml
build:
  context: .
```

Artinya:

```text
. = build context
```

## Dockerfile custom

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

**Hafalan:**

```text
build:
  context: .
  dockerfile: Dockerfile
```

---

# 22. Health Check

Health check di Compose dapat ditulis pada service menggunakan `healthcheck`.

Contoh:

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

Status:

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

## CMD-SHELL

```yaml
healthcheck:
  test: ["CMD-SHELL", "wget -qO- http://localhost/ || exit 1"]
  interval: 10s
  timeout: 5s
  retries: 3
```

## Disable inherited healthcheck

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

**Hafalan:**

```text
healthcheck = apakah service sehat?
depends_on + service_healthy
= tunggu dependency sehat
```

---

# 23. Extend Service

`extends` memungkinkan sebuah service mewarisi konfigurasi dari service lain.

Contoh:

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

Service `app` mendapatkan konfigurasi dari `base` lalu dapat menambahkan atau mengubah konfigurasi tertentu.

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

Berguna ketika beberapa service memiliki konfigurasi yang ingin digunakan kembali.

Contoh:

```text
base service
   │
   ├── app-dev
   ├── app-staging
   └── app-prod
```

**Catatan:** `extends` adalah fitur reuse configuration. Ia tidak otomatis berarti service yang di-extend akan dijalankan sebagai dependency.

**Hafalan:**

```text
extends = gunakan ulang konfigurasi service
```

---

# 24. Peta Ingatan Cepat

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

---

## B. Command Utama

```text
docker compose up
↓
buat + jalankan

docker compose ps
↓
lihat

docker compose logs
↓
lihat log

docker compose stop
↓
hentikan

docker compose start
↓
jalankan kembali

docker compose rm
↓
hapus container

docker compose down
↓
turunkan project + hapus resource project
```

---

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

---

## D. Port

```yaml
ports:
  - "8080:80"
```

```text
HOST       CONTAINER
8080   →   80
```

---

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

---

## F. Storage

```text
./html:/usr/share/nginx/html
```

```text
bind mount
```

Sedangkan:

```text
html-data:/usr/share/nginx/html
```

```text
named volume
```

---

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

Hafalan:

```text
service name = hostname
```

Contoh:

```text
app → db:3306
```

---

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

---

## I. Restart

```text
no
always
on-failure
unless-stopped
```

Hafalan:

```text
restart = kebijakan setelah container berhenti
```

---

## J. Resource

```yaml
cpus: 0.5
mem_limit: 512m
```

Hafalan:

```text
cpus      = CPU
mem_limit = memory
```

---

## K. Build

```yaml
build:
  context: .
  dockerfile: Dockerfile
```

Hafalan:

```text
Compose
↓
Dockerfile
↓
Image
↓
Container
```

---

## L. Health

```yaml
healthcheck:
  test: ["CMD", "wget", "-qO-", "http://localhost/"]
```

Hafalan:

```text
healthcheck = kondisi service
```

---

## M. Extend

```yaml
extends:
  service: base
```

Hafalan:

```text
extends = reuse konfigurasi
```

---

# 25. Tabel Ringkasan

| Materi | Fungsi | Kata Kunci |
| --- | --- | --- |
| Pengenalan Docker Compose | Mengelola aplikasi multi-container | `compose.yaml` |
| Menginstall Docker Compose | Menyiapkan Compose | `docker compose version` |
| Configuration File | File konfigurasi Compose | `compose.yaml` |
| YAML | Format konfigurasi | `key: value` |
| Membuat Container | Membuat container dari service | `docker compose create` |
| Menjalankan Container | Menjalankan project | `docker compose up` |
| Melihat Container | Melihat service/container | `docker compose ps` |
| Menghentikan Container | Menghentikan container | `docker compose stop` |
| Menghapus Container | Menghapus container/resource | `docker compose rm`, `down` |
| Project Name | Nama project Compose | `-p`, `name` |
| Service | Definisi aplikasi/container | `services:` |
| Komentar | Catatan YAML | `#` |
| Port | Publish port | `ports:` |
| Environment Variable | Variable container | `environment:` |
| Bind Mount | Mount host path | `./src:/app` |
| Volume | Persistent storage Docker | `volume:/data` |
| Network | Komunikasi service | `networks:` |
| Depends On | Dependency service | `depends_on:` |
| Restart | Kebijakan restart | `restart:` |
| Resource Limit | Membatasi resource | `cpus`, `mem_limit` |
| Dockerfile | Build image | `build:` |
| Health Check | Cek kesehatan service | `healthcheck:` |
| Extend Service | Reuse konfigurasi | `extends:` |

---

# 26. Mini Project

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

## Lihat log

```bash
docker compose logs -f
```

## Buka aplikasi

```text
http://localhost:8000
```

Output:

```text
Hello Docker Compose!
```

## Cek health

```bash
docker compose ps
```

Service yang sehat akan menunjukkan status health yang sesuai, misalnya:

```text
Up (healthy)
```

## Masuk ke container

```bash
docker compose exec app sh
```

## Cek environment

```bash
docker compose exec app printenv DB_HOST
```

Output:

```text
db
```

Perhatikan bahwa aplikasi menggunakan:

```text
DB_HOST=db
```

bukan:

```text
DB_HOST=localhost
```

Karena `db` adalah **service name** yang dapat digunakan sebagai hostname di network Compose.

## Stop

```bash
docker compose stop
```

## Start

```bash
docker compose start
```

## Down

```bash
docker compose down
```

## Down + volume

```bash
docker compose down -v
```

**HATI-HATI:** command terakhir menghapus named volume project sehingga data MySQL dapat ikut hilang.

---

# 27. Cheat Code Docker Compose 10 Detik

> **Docker Compose adalah cara mendefinisikan dan menjalankan aplikasi multi-container menggunakan file YAML. `services` mendefinisikan service, `image` menentukan image, `build` menggunakan Dockerfile, `ports` mem-publish port, `environment` mengatur environment variable, bind mount menggunakan host path seperti `./src:/app`, named volume menggunakan nama volume seperti `db-data:/data`, `networks` mengatur komunikasi, `depends_on` mengatur dependency, `restart` menentukan kebijakan restart, resource limit membatasi CPU/memory, `healthcheck` mengecek kesehatan service, dan `extends` digunakan untuk reuse konfigurasi. Command paling penting: `docker compose up`, `ps`, `logs`, `stop`, `start`, `rm`, dan `down`.**

---

# 28. Referensi Resmi

## Docker Compose

- **Docker Compose Documentation**  
  https://docs.docker.com/compose/

- **Compose File Reference**  
  https://docs.docker.com/reference/compose-file/

- **Docker Compose CLI Reference**  
  https://docs.docker.com/reference/cli/docker/compose/

- **Compose Getting Started**  
  https://docs.docker.com/compose/gettingstarted/

- **Compose Installation**  
  https://docs.docker.com/compose/install/

- **Compose Environment Variables**  
  https://docs.docker.com/compose/how-tos/environment-variables/

- **Compose Networking**  
  https://docs.docker.com/compose/how-tos/networking/

- **Compose Volumes**  
  https://docs.docker.com/compose/how-tos/volumes/

## YAML

- **YAML Specification**  
  https://yaml.org/spec/

## Docker

- **Docker Documentation**  
  https://docs.docker.com/

- **Dockerfile Reference**  
  https://docs.docker.com/reference/dockerfile/

> **Format tautan:** Semua tautan di cheatsheet ini menggunakan format Markdown standar (`[teks](https://...)`) agar tetap terbaca dengan baik di GitHub, GitLab, VS Code, Obsidian, dan Markdown renderer lainnya.
>
> **Catatan versi:** Docker Compose modern menggunakan Compose Specification dan command `docker compose`. Detail field tertentu, terutama resource/deployment configuration, dapat bergantung pada versi Docker Compose dan target deployment. Untuk penggunaan production, selalu cek dokumentasi Compose Reference sesuai versi yang digunakan.
