# Dockerfile Dasar Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Dockerfile untuk pemula. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> Dockerfile adalah file teks berisi instruksi untuk membangun Docker image. Cheatsheet ini fokus pada instruction dasar, build context, konfigurasi container, health check, entrypoint, multi-stage build, serta registry Docker Hub dan DigitalOcean Container Registry.

## Daftar Isi

1. [Pengenalan Dockerfile](#1-pengenalan-dockerfile)
2. [Dockerfile Format](#2-dockerfile-format)
3. [FROM Instruction](#3-from-instruction)
4. [RUN Instruction](#4-run-instruction)
5. [CMD Instruction](#5-cmd-instruction)
6. [LABEL Instruction](#6-label-instruction)
7. [ADD Instruction](#7-add-instruction)
8. [COPY Instruction](#8-copy-instruction)
9. [.dockerignore File](#9-dockerignore-file)
10. [EXPOSE Instruction](#10-expose-instruction)
11. [Environment Variable Instruction](#11-environment-variable-instruction)
12. [VOLUME Instruction](#12-volume-instruction)
13. [Working Directory Instruction](#13-working-directory-instruction)
14. [USER Instruction](#14-user-instruction)
15. [ARG Instruction](#15-arg-instruction)
16. [HEALTHCHECK Instruction](#16-healthcheck-instruction)
17. [ENTRYPOINT Instruction](#17-entrypoint-instruction)
18. [Multi Stage Build](#18-multi-stage-build)
19. [Docker Hub Registry](#19-docker-hub-registry)
20. [DigitalOcean Container Registry](#20-digitalocean-container-registry)
21. [Peta Ingatan Cepat](#21-peta-ingatan-cepat)
22. [Tabel Ringkasan](#22-tabel-ringkasan)
23. [Mini Project](#23-mini-project)
24. [Cheat Code Dockerfile 10 Detik](#24-cheat-code-dockerfile-10-detik)
25. [Referensi Resmi](#25-referensi-resmi)

---

# 1. Pengenalan Dockerfile

Dockerfile adalah file teks yang berisi instruksi untuk membangun Docker image.

Contoh sederhana:

```dockerfile
FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
```

Build:

```bash
docker build -t my-nginx:1.0 .
```

Jalankan:

```bash
docker run -d \
  --name web \
  -p 8080:80 \
  my-nginx:1.0
```

Diagram:

```text
Dockerfile
    │
    │ docker build
    ▼
Docker Image
    │
    │ docker run
    ▼
Docker Container
```

## Dockerfile vs Docker Image

```text
Dockerfile
   │
   │ build
   ▼
Image
   │
   │ run
   ▼
Container
```

Dockerfile adalah **resep**, image adalah **hasil build**, dan container adalah **instance yang dijalankan dari image**.

**Hafalan:**

```text
Dockerfile → build → Image → run → Container
```

---

# 2. Dockerfile Format

Dockerfile terdiri dari instruction dan argument.

Format umum:

```dockerfile
INSTRUCTION arguments
```

Contoh:

```dockerfile
FROM nginx:alpine
RUN echo "Hello"
COPY index.html /usr/share/nginx/html/
EXPOSE 80
```

Instruction tidak membedakan huruf besar/kecil, tetapi convention-nya ditulis uppercase agar mudah dibaca. Dockerfile mendukung instruction seperti `FROM`, `RUN`, `CMD`, `LABEL`, `EXPOSE`, `ENV`, `ADD`, `COPY`, `ENTRYPOINT`, `VOLUME`, `USER`, `WORKDIR`, `ARG`, dan `HEALTHCHECK`. [Dockerfile Reference — Docker Docs](https://docs.docker.com/reference/dockerfile/)

## Komentar

```dockerfile
# Ini komentar

FROM nginx:alpine
```

## Multi-line

Gunakan `\` untuk melanjutkan instruction:

```dockerfile
RUN apk add --no-cache \
    curl \
    git
```

## Shell form

```dockerfile
RUN echo "Hello"
```

## Exec form

```dockerfile
RUN ["echo", "Hello"]
```

Bentuk exec menggunakan JSON array sehingga harus menggunakan double quote. `RUN`, `CMD`, dan `ENTRYPOINT` mendukung shell form dan exec form. [Dockerfile Reference — Docker Docs](https://docs.docker.com/reference/dockerfile/)

## Build context

Saat:

```bash
docker build -t my-app .
```

`.` berarti current directory menjadi **build context**.

```text
project/
├── Dockerfile
├── index.php
├── composer.json
└── ...
      │
      │ docker build .
      ▼
Build Context
```

**Hafalan:**

```text
INSTRUCTION arguments
```

dan:

```text
docker build ... .
                  ↑
             build context
```

---

# 3. FROM Instruction

`FROM` menentukan base image yang digunakan untuk build stage.

Format:

```dockerfile
FROM image
```

Contoh:

```dockerfile
FROM nginx
```

Dengan tag:

```dockerfile
FROM nginx:alpine
```

Dengan versi PHP:

```dockerfile
FROM php:8.4-cli
```

Dengan platform:

```dockerfile
FROM --platform=linux/amd64 nginx:alpine
```

## `FROM scratch`

`FROM scratch` berarti mulai dari image kosong.

```dockerfile
FROM scratch
```

Biasanya digunakan untuk image yang sangat minimal, terutama ketika binary sudah self-contained.

## Alias stage

```dockerfile
FROM golang:1.24 AS build
```

`AS build` memberi nama stage.

Nanti dapat digunakan:

```dockerfile
COPY --from=build /app/myapp /usr/local/bin/myapp
```

## Beberapa FROM

```dockerfile
FROM node:alpine AS build

# ...

FROM nginx:alpine

# ...
```

Ini merupakan dasar multi-stage build.

**Hafalan:**

```text
FROM = mulai dari image apa?
```

---

# 4. RUN Instruction

`RUN` menjalankan command **saat image sedang di-build**.

Contoh:

```dockerfile
FROM alpine

RUN apk add --no-cache curl
```

Build:

```bash
docker build -t my-alpine .
```

Command:

```text
apk add --no-cache curl
```

dijalankan saat build, bukan ketika container baru dijalankan.

## Beberapa command

```dockerfile
RUN apt-get update && \
    apt-get install -y curl
```

## Contoh PHP

```dockerfile
FROM php:8.4-cli

RUN docker-php-ext-install pdo_mysql
```

## RUN vs CMD

```text
RUN
↓
saat docker build

CMD
↓
default command saat container run
```

Contoh:

```dockerfile
FROM alpine

RUN echo "BUILD TIME"

CMD ["echo", "RUNTIME"]
```

Build:

```bash
docker build -t demo .
```

Run:

```bash
docker run --rm demo
```

Output:

```text
RUNTIME
```

**Hafalan:**

```text
RUN = jalankan command saat BUILD
```

> Menggabungkan command yang berkaitan dan membersihkan cache/package metadata dalam layer yang sama sering membantu menjaga image tetap kecil.

---

# 5. CMD Instruction

`CMD` menentukan default command atau default argument ketika container dijalankan.

Contoh:

```dockerfile
FROM alpine

CMD ["echo", "Hello Docker"]
```

Build:

```bash
docker build -t hello .
```

Run:

```bash
docker run --rm hello
```

Output:

```text
Hello Docker
```

## Shell form

```dockerfile
CMD echo "Hello Docker"
```

## Exec form

```dockerfile
CMD ["echo", "Hello Docker"]
```

Exec form sering lebih jelas untuk command container.

## CMD dapat di-override

Dockerfile:

```dockerfile
FROM alpine

CMD ["echo", "Hello"]
```

Run:

```bash
docker run --rm hello echo "Hai"
```

Output:

```text
Hai
```

## Hanya CMD terakhir yang berlaku

```dockerfile
FROM alpine

CMD ["echo", "A"]
CMD ["echo", "B"]
```

Yang digunakan:

```text
B
```

Docker mendokumentasikan bahwa satu Dockerfile sebaiknya hanya memiliki satu `CMD`; jika ada beberapa, hanya instruction terakhir yang berlaku. [Dockerfile Reference — Docker Docs](https://docs.docker.com/reference/dockerfile/)

**Hafalan:**

```text
CMD = default command saat container dijalankan
```

---

# 6. LABEL Instruction

`LABEL` menambahkan metadata ke image.

Format:

```dockerfile
LABEL key="value"
```

Contoh:

```dockerfile
FROM nginx:alpine

LABEL maintainer="Budi"
LABEL version="1.0"
LABEL description="Nginx application"
```

Bisa digabung:

```dockerfile
LABEL version="1.0" \
      maintainer="Budi" \
      description="Nginx application"
```

Lihat label:

```bash
docker image inspect my-nginx
```

Atau format tertentu:

```bash
docker image inspect \
  -f '{{json .Config.Labels}}' \
  my-nginx
```

Contoh metadata:

```text
version
maintainer
description
org.opencontainers.image.version
```

**Hafalan:**

```text
LABEL = metadata image
```

---

# 7. ADD Instruction

`ADD` digunakan untuk menambahkan file/directory ke image.

Contoh:

```dockerfile
FROM nginx:alpine

ADD index.html /usr/share/nginx/html/
```

Build context:

```text
project/
├── Dockerfile
└── index.html
```

## ADD directory

```dockerfile
ADD html/ /usr/share/nginx/html/
```

## ADD archive

Salah satu fitur khusus `ADD` adalah kemampuan tertentu untuk menangani local tar archive dan source lain yang didukung.

Contoh:

```dockerfile
ADD app.tar.gz /app/
```

## ADD remote URL

`ADD` juga mendukung source remote URL:

```dockerfile
ADD https://example.com/file.txt /app/file.txt
```

Namun untuk kebanyakan file dari build context, `COPY` biasanya lebih eksplisit.

## ADD vs COPY

```text
COPY
↓
copy file/directory

ADD
↓
copy + kemampuan tambahan tertentu
```

Docker mendokumentasikan bahwa `ADD` dapat mengambil file dari build context, URL remote, atau Git repository, sedangkan `COPY` berfokus pada copy file/directory dan juga mendukung `--from` untuk multi-stage. [Dockerfile Reference — Docker Docs](https://docs.docker.com/reference/dockerfile/)

**Hafalan:**

```text
ADD = copy + fitur tambahan
```

---

# 8. COPY Instruction

`COPY` digunakan untuk menyalin file atau directory dari build context ke image.

Contoh:

```dockerfile
FROM nginx:alpine

COPY index.html /usr/share/nginx/html/
```

Directory:

```dockerfile
COPY html/ /usr/share/nginx/html/
```

Multiple files:

```dockerfile
COPY index.html style.css /usr/share/nginx/html/
```

## Copy dengan permission

```dockerfile
COPY --chmod=644 index.html /usr/share/nginx/html/
```

## Copy dari stage lain

```dockerfile
FROM golang:alpine AS build

WORKDIR /app

COPY . .

RUN go build -o app .


FROM alpine

COPY --from=build /app/app /app

CMD ["/app"]
```

`COPY --from` sangat penting dalam multi-stage build karena dapat mengambil file dari build stage lain. [Dockerfile Reference — Docker Docs](https://docs.docker.com/reference/dockerfile/)

## ADD vs COPY

Umumnya:

```text
COPY → pilihan default untuk menyalin file
ADD  → gunakan jika memang membutuhkan fitur khusus ADD
```

**Hafalan:**

```text
COPY = salin file/directory
```

---

# 9. .dockerignore File

`.dockerignore` digunakan untuk mengecualikan file/directory dari build context.

Contoh:

```text
.git
.gitignore
node_modules
vendor
.env
*.log
Dockerfile*
README.md
```

Struktur:

```text
project/
├── Dockerfile
├── .dockerignore
├── src/
├── node_modules/
├── .git/
└── .env
```

Docker build:

```bash
docker build -t my-app .
```

File yang cocok dengan `.dockerignore` tidak dikirim sebagai bagian dari build context.

## Contoh untuk project PHP

```text
.git
.env
vendor
node_modules
*.log
storage/logs
```

## Contoh untuk Node.js

```text
.git
.env
node_modules
npm-debug.log
coverage
```

Diagram:

```text
Project
   │
   ├── source
   ├── Dockerfile
   └── .dockerignore
          │
          ▼
     Build Context
          │
          └── file yang tidak di-ignore
```

**Hafalan:**

```text
.dockerignore = filter build context
```

> Jangan memasukkan secret seperti `.env` ke build context jika tidak dibutuhkan. Selain mengurangi ukuran context, ini membantu mencegah file sensitif ikut tersedia selama proses build.

---

# 10. EXPOSE Instruction

`EXPOSE` mendokumentasikan port yang digunakan aplikasi di dalam container.

Contoh:

```dockerfile
FROM nginx:alpine

EXPOSE 80
```

Untuk beberapa port:

```dockerfile
EXPOSE 80
EXPOSE 443
```

Atau:

```dockerfile
EXPOSE 80/tcp
EXPOSE 53/udp
```

## Penting

`EXPOSE` **tidak otomatis membuat port dapat diakses dari host**.

Dockerfile:

```dockerfile
EXPOSE 80
```

Tetap perlu publish port saat run:

```bash
docker run -d \
  -p 8080:80 \
  nginx
```

Diagram:

```text
EXPOSE 80
   │
   ▼
Dokumentasi metadata
   │
   │
   └── tidak otomatis publish
```

Publish:

```text
Host 8080 ─────> Container 80
```

**Hafalan:**

```text
EXPOSE = dokumentasikan port
-p      = publish port
```

---

# 11. Environment Variable Instruction

Gunakan `ENV` untuk menetapkan environment variable di image.

Format:

```dockerfile
ENV KEY=value
```

Contoh:

```dockerfile
FROM alpine

ENV APP_ENV=production
ENV APP_NAME=my-app
```

Bisa juga:

```dockerfile
ENV APP_ENV=production \
    APP_NAME=my-app
```

Cek saat container berjalan:

```bash
docker run --rm my-app env
```

Atau:

```bash
docker run --rm my-app printenv APP_ENV
```

Output:

```text
production
```

## ENV digunakan instruction lain

```dockerfile
FROM alpine

ENV APP_DIR=/app

WORKDIR $APP_DIR

RUN echo "Working directory: $APP_DIR"
```

## ENV vs ARG

```text
ENV
↓
tersimpan di image
↓
tersedia saat container runtime

ARG
↓
build-time variable
↓
tidak menjadi environment variable runtime
```

Docker mendokumentasikan bahwa `ENV` menetapkan environment variable yang tetap tersedia pada container dari image tersebut, sedangkan `ARG` adalah variable untuk build time. [Dockerfile Reference — Docker Docs](https://docs.docker.com/reference/dockerfile/)

**Hafalan:**

```text
ENV = environment untuk image/container
```

---

# 12. VOLUME Instruction

`VOLUME` membuat mount point untuk persistent data.

Contoh:

```dockerfile
FROM alpine

VOLUME ["/data"]
```

Saat container dijalankan, `/data` diperlakukan sebagai lokasi volume.

Contoh:

```bash
docker run -d \
  --name app \
  my-app
```

Lihat mount:

```bash
docker inspect app
```

## Dengan aplikasi

```dockerfile
FROM mysql:8.4

VOLUME ["/var/lib/mysql"]
```

Data database sebaiknya dikelola dengan storage yang sesuai, bukan dianggap bagian dari writable layer container.

## VOLUME vs `-v`

Dockerfile:

```dockerfile
VOLUME ["/data"]
```

Saat runtime, Anda juga dapat menentukan volume:

```bash
docker run -d \
  -v app-data:/data \
  my-app
```

**Hafalan:**

```text
VOLUME = deklarasi lokasi data persistent
```

---

# 13. Working Directory Instruction

`WORKDIR` menentukan working directory untuk instruction berikutnya dan default working directory saat container berjalan.

Contoh:

```dockerfile
FROM alpine

WORKDIR /app

COPY . .

RUN ls
```

Setelah:

```dockerfile
WORKDIR /app
```

command berikutnya berjalan dari:

```text
/app
```

## CMD

```dockerfile
FROM alpine

WORKDIR /app

CMD ["pwd"]
```

Run:

```bash
docker run --rm my-app
```

Output:

```text
/app
```

## WORKDIR membuat directory

Jika directory belum ada, Docker akan membuatnya sesuai kebutuhan instruction tersebut. Docker juga merekomendasikan menetapkan `WORKDIR` secara eksplisit agar tidak bergantung pada working directory yang mungkin diwarisi dari base image. [Dockerfile Reference — Docker Docs](https://docs.docker.com/reference/dockerfile/)

## Relative WORKDIR

```dockerfile
WORKDIR /app
WORKDIR src
```

Hasil:

```text
/app/src
```

**Hafalan:**

```text
WORKDIR = cd default untuk Dockerfile/container
```

---

# 14. USER Instruction

`USER` menentukan user/group yang digunakan untuk instruction berikutnya dan default runtime container.

Contoh:

```dockerfile
FROM alpine

RUN adduser -D appuser

USER appuser

WORKDIR /app

CMD ["id"]
```

Saat container berjalan, proses utama menggunakan:

```text
appuser
```

## Menggunakan UID

```dockerfile
USER 1000
```

Atau:

```dockerfile
USER 1000:1000
```

## USER dan RUN

```dockerfile
FROM alpine

RUN adduser -D appuser

USER appuser

RUN whoami
```

Output build:

```text
appuser
```

`USER` berlaku untuk `RUN`, serta default user ketika `ENTRYPOINT` atau `CMD` dijalankan. [Dockerfile Reference — Docker Docs](https://docs.docker.com/reference/dockerfile/)

## Root vs non-root

```text
root
↓
hak akses sangat tinggi

non-root
↓
hak akses lebih terbatas
```

Untuk aplikasi yang tidak membutuhkan root, menggunakan user non-root umumnya merupakan praktik keamanan yang lebih baik.

**Hafalan:**

```text
USER = siapa yang menjalankan proses?
```

---

# 15. ARG Instruction

`ARG` digunakan untuk variable saat image sedang di-build.

Contoh:

```dockerfile
FROM alpine

ARG APP_VERSION=1.0

RUN echo "Building version $APP_VERSION"
```

Build default:

```bash
docker build -t my-app .
```

Output build:

```text
Building version 1.0
```

## Override

```bash
docker build \
  --build-arg APP_VERSION=2.0 \
  -t my-app:2.0 .
```

## ARG untuk FROM

`ARG` dapat dideklarasikan sebelum `FROM` untuk digunakan dalam pemilihan image:

```dockerfile
ARG PHP_VERSION=8.4

FROM php:${PHP_VERSION}-cli
```

Build:

```bash
docker build \
  --build-arg PHP_VERSION=8.4 \
  -t my-php .
```

## ARG vs ENV

```text
ARG
↓
build time

ENV
↓
image + runtime
```

Contoh:

```dockerfile
FROM alpine

ARG BUILD_VERSION=1.0
ENV APP_VERSION=$BUILD_VERSION

RUN echo "Build: $BUILD_VERSION"
```

`ARG` tidak otomatis menjadi environment variable final container. [Dockerfile Reference — Docker Docs](https://docs.docker.com/reference/dockerfile/)

**Catatan keamanan:** jangan gunakan `ARG` untuk password, API token, atau secret. Nilai build argument dapat terlihat dalam metadata/history tertentu. Docker merekomendasikan mekanisme secret build yang sesuai untuk data sensitif. [Dockerfile Reference — Docker Docs](https://docs.docker.com/reference/dockerfile/)

**Hafalan:**

```text
ARG = variable saat build
```

---

# 16. HEALTHCHECK Instruction

`HEALTHCHECK` menentukan cara Docker mengecek apakah container masih sehat.

Contoh:

```dockerfile
FROM nginx:alpine

HEALTHCHECK --interval=30s \
  --timeout=3s \
  --start-period=5s \
  --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1
```

Konsep:

```text
Container
   │
   ▼
HEALTHCHECK
   │
   ├── exit 0 → healthy
   └── exit 1 → unhealthy
```

Status dapat dilihat:

```bash
docker ps
```

Atau:

```bash
docker inspect \
  -f '{{.State.Health.Status}}' \
  web
```

Contoh:

```text
healthy
```

## Parameter penting

```text
--interval
```

Jarak antar health check.

```text
--timeout
```

Batas waktu satu check.

```text
--start-period
```

Waktu awal untuk aplikasi melakukan bootstrap.

```text
--retries
```

Jumlah kegagalan berturut-turut sebelum dianggap unhealthy.

Contoh:

```dockerfile
HEALTHCHECK \
  --interval=30s \
  --timeout=5s \
  --retries=3 \
  CMD curl -f http://localhost/ || exit 1
```

Docker mendokumentasikan bahwa exit code `0` berarti sukses/healthy dan `1` berarti unhealthy. Hanya satu `HEALTHCHECK` yang berlaku; jika ditulis beberapa kali, yang terakhir digunakan. [Dockerfile Reference — Docker Docs](https://docs.docker.com/reference/dockerfile/)

**Hafalan:**

```text
HEALTHCHECK = apakah aplikasi sehat?
0 → healthy
1 → unhealthy
```

---

# 17. ENTRYPOINT Instruction

`ENTRYPOINT` menentukan executable utama container.

Contoh:

```dockerfile
FROM alpine

ENTRYPOINT ["echo"]

CMD ["Hello Docker"]
```

Run:

```bash
docker run --rm my-app
```

Output:

```text
Hello Docker
```

Run dengan argument:

```bash
docker run --rm my-app "Halo Dunia"
```

Output:

```text
Halo Dunia
```

Karena:

```dockerfile
ENTRYPOINT ["echo"]
CMD ["Hello Docker"]
```

dapat dibayangkan sebagai:

```text
echo + argument dari CMD
```

## ENTRYPOINT + CMD

Pola yang umum:

```dockerfile
ENTRYPOINT ["executable"]
CMD ["default", "arguments"]
```

Contoh:

```dockerfile
FROM alpine

ENTRYPOINT ["ping"]

CMD ["localhost"]
```

Run:

```bash
docker run --rm my-ping
```

Kurang lebih menjalankan:

```bash
ping localhost
```

Override argument:

```bash
docker run --rm my-ping 8.8.8.8
```

## Exec form

Direkomendasikan untuk executable:

```dockerfile
ENTRYPOINT ["php", "artisan"]
```

## Shell form

```dockerfile
ENTRYPOINT php artisan
```

Exec form dan shell form memiliki perilaku berbeda terhadap shell, signal, dan argument. Docker merekomendasikan memahami interaksi `ENTRYPOINT` dan `CMD`, terutama ketika container dipakai sebagai executable. [Dockerfile Reference — Docker Docs](https://docs.docker.com/reference/dockerfile/)

## ENTRYPOINT vs CMD

```text
ENTRYPOINT
↓
program utama

CMD
↓
default argument / default command
```

**Hafalan:**

```text
ENTRYPOINT = "siapa program utamanya?"
CMD        = "argument default-nya apa?"
```

---

# 18. Multi Stage Build

Multi-stage build menggunakan beberapa `FROM` dalam satu Dockerfile.

Tujuannya biasanya:

```text
build tools
   ↓
compile/build
   ↓
ambil hasil
   ↓
runtime image kecil
```

Contoh Go:

```dockerfile
FROM golang:1.24-alpine AS build

WORKDIR /app

COPY . .

RUN go build -o app .


FROM alpine

WORKDIR /app

COPY --from=build /app/app .

CMD ["./app"]
```

Build:

```bash
docker build -t my-go-app .
```

Diagram:

```text
Stage 1: build
┌─────────────────────┐
│ Go compiler         │
│ source code         │
│ dependency          │
│ binary              │
└──────────┬──────────┘
           │
           │ COPY --from=build
           ▼
Stage 2: runtime
┌─────────────────────┐
│ Alpine              │
│ binary              │
└─────────────────────┘
```

## Mengapa multi-stage?

Tanpa multi-stage:

```text
Image
├── compiler
├── source
├── dependency build
└── binary
```

Dengan multi-stage:

```text
Final Image
├── runtime
└── binary
```

Hasilnya dapat mengurangi ukuran image final dan mengurangi tool yang tidak diperlukan saat runtime.

## Nama stage

```dockerfile
FROM node:alpine AS build
```

Copy:

```dockerfile
COPY --from=build /app/dist /usr/share/nginx/html
```

Contoh frontend:

```dockerfile
FROM node:alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

**Hafalan:**

```text
Stage build → hasil
Stage runtime → hanya hasil yang dibutuhkan
```

---

# 19. Docker Hub Registry

Docker Hub adalah registry yang umum digunakan untuk menyimpan dan mendistribusikan Docker image.

Alur:

```text
Dockerfile
    │
    │ docker build
    ▼
Local Image
    │
    │ docker tag
    ▼
Docker Hub Name
    │
    │ docker push
    ▼
Docker Hub
```

## Login

```bash
docker login
```

## Build image

Misalnya username:

```text
username
```

Build:

```bash
docker build \
  -t username/my-app:1.0 .
```

## Push

```bash
docker push username/my-app:1.0
```

## Pull

Di machine lain:

```bash
docker pull username/my-app:1.0
```

## Run

```bash
docker run --rm username/my-app:1.0
```

## Tag existing image

Misalnya:

```bash
docker images
```

Image:

```text
my-app:latest
```

Tag:

```bash
docker tag \
  my-app:latest \
  username/my-app:1.0
```

Push:

```bash
docker push username/my-app:1.0
```

## Naming

Format umum:

```text
username/repository:tag
```

Contoh:

```text
budi/my-app:1.0
budi/my-app:latest
```

**Hafalan:**

```text
docker login
docker tag
docker push
docker pull
```

---

# 20. DigitalOcean Container Registry

DigitalOcean Container Registry (DOCR) adalah private Docker image registry milik DigitalOcean untuk menyimpan dan mengelola container image secara private. DOCR terintegrasi dengan Docker dan DigitalOcean Kubernetes. [DigitalOcean Container Registry — DigitalOcean Docs](https://docs.digitalocean.com/products/container-registry/)

Format image:

```text
registry.digitalocean.com/<registry>/<image>:<tag>
```

Contoh:

```text
registry.digitalocean.com/my-registry/my-app:1.0
```

## Membuat registry

Dengan `doctl`:

```bash
doctl registries create my-registry --region=nyc3
```

DigitalOcean mendokumentasikan pembuatan registry melalui Control Panel, API, atau CLI `doctl`. [Docker Documentation](https://docs.docker.com/)

## Login

Autentikasi Docker melalui:

```bash
doctl registries login
```

Command tersebut mengonfigurasi autentikasi Docker agar dapat melakukan push/pull ke registry DigitalOcean. [Container Registry Quickstart — DigitalOcean Docs](https://docs.digitalocean.com/products/container-registry/getting-started/quickstart/)

## Build image

```bash
docker build \
  -t my-app:1.0 .
```

## Tag untuk DOCR

```bash
docker tag \
  my-app:1.0 \
  registry.digitalocean.com/my-registry/my-app:1.0
```

## Push

```bash
docker push \
  registry.digitalocean.com/my-registry/my-app:1.0
```

## Pull

```bash
docker pull \
  registry.digitalocean.com/my-registry/my-app:1.0
```

## Run

```bash
docker run --rm \
  registry.digitalocean.com/my-registry/my-app:1.0
```

Diagram:

```text
Dockerfile
    │
    ▼
Local Image
    │
    │ docker tag
    ▼
registry.digitalocean.com
    │
    │ docker push
    ▼
DigitalOcean Container Registry
    │
    │ docker pull
    ▼
Server / Kubernetes
```

**Hafalan:**

```text
doctl registries login

docker tag
     ↓
registry.digitalocean.com/registry/image:tag

docker push
```

> Nama registry DOCR harus mengikuti aturan penamaan DigitalOcean. Dokumentasi DigitalOcean saat ini menyatakan nama registry harus unik, maksimal 63 karakter, menggunakan huruf kecil, angka, dan/atau tanda hubung, dimulai dengan huruf, serta diakhiri huruf atau angka. [Docker Documentation](https://docs.docker.com/)

---

# 21. Peta Ingatan Cepat

## A. Alur Dockerfile

```text
Dockerfile
    │
    ▼
docker build
    │
    ▼
Image
    │
    ▼
docker run
    │
    ▼
Container
```

---

## B. Instruction Utama

```text
FROM
↓
base image

RUN
↓
build command

COPY / ADD
↓
masukkan file

WORKDIR
↓
working directory

ENV
↓
runtime environment

ARG
↓
build-time variable

EXPOSE
↓
dokumentasi port

VOLUME
↓
lokasi persistent data

USER
↓
user proses

HEALTHCHECK
↓
status kesehatan

ENTRYPOINT
↓
program utama

CMD
↓
default command / argument
```

---

## C. FROM

```text
FROM nginx:alpine
```

Hafalan:

```text
FROM = base image
```

---

## D. RUN vs CMD vs ENTRYPOINT

```text
RUN
↓
BUILD TIME

CMD
↓
DEFAULT RUNTIME COMMAND / ARGUMENT

ENTRYPOINT
↓
MAIN RUNTIME EXECUTABLE
```

---

## E. COPY vs ADD

```text
COPY
↓
copy file/directory

ADD
↓
copy + fitur tambahan
```

Best practice sederhana:

```text
gunakan COPY jika hanya perlu copy
```

---

## F. ENV vs ARG

```text
ARG
↓
build time

ENV
↓
image + runtime
```

Hafalan:

```text
ARG = build
ENV = runtime
```

---

## G. Port

```text
EXPOSE 80
```

Artinya:

```text
dokumentasikan port container
```

Publish:

```bash
docker run -p 8080:80 image
```

Artinya:

```text
localhost:8080
       │
       ▼
container:80
```

---

## H. Storage

```text
VOLUME
↓
persistent data location

COPY
↓
masukkan file ke image

.dockerignore
↓
keluarkan file dari build context
```

---

## I. User

```text
USER root
```

atau:

```text
USER 1000:1000
```

Hafalan:

```text
USER = siapa yang menjalankan proses?
```

---

## J. Health

```text
HEALTHCHECK
     │
     ├── exit 0 → healthy
     └── exit 1 → unhealthy
```

---

## K. Multi Stage

```text
Build Stage
   │
   │ COPY --from
   ▼
Runtime Stage
```

Hafalan:

```text
build besar
↓
runtime kecil
```

---

## L. Registry

```text
Docker Hub
username/image:tag

DigitalOcean
registry.digitalocean.com/registry/image:tag
```

---

# 22. Tabel Ringkasan

| Materi | Fungsi | Kata Kunci |
| --- | --- | --- |
| Pengenalan Dockerfile | Mengenal file build image | `Dockerfile` |
| Dockerfile Format | Memahami syntax | `INSTRUCTION arguments` |
| FROM | Menentukan base image | `FROM nginx:alpine` |
| RUN | Menjalankan command saat build | `RUN` |
| CMD | Default command runtime | `CMD` |
| LABEL | Metadata image | `LABEL key=value` |
| ADD | Menambahkan file dengan fitur tambahan | `ADD` |
| COPY | Menyalin file/directory | `COPY` |
| .dockerignore | Mengecualikan build context | `.dockerignore` |
| EXPOSE | Mendokumentasikan port | `EXPOSE 80` |
| ENV | Environment variable image/runtime | `ENV` |
| VOLUME | Deklarasi persistent data | `VOLUME` |
| WORKDIR | Working directory | `WORKDIR /app` |
| USER | User/group proses | `USER` |
| ARG | Variable saat build | `ARG` |
| HEALTHCHECK | Mengecek kesehatan container | `HEALTHCHECK` |
| ENTRYPOINT | Executable utama container | `ENTRYPOINT` |
| Multi Stage Build | Memisahkan build dan runtime | `FROM ... AS`, `COPY --from` |
| Docker Hub Registry | Registry image publik/private | `docker push/pull` |
| DigitalOcean Registry | Private registry DigitalOcean | `registry.digitalocean.com` |

---

# 23. Mini Project

## Dockerfile PHP Sederhana

Project ini menggabungkan:

```text
FROM
WORKDIR
COPY
RUN
ENV
EXPOSE
USER
CMD
```

Struktur:

```text
php-app/
├── Dockerfile
├── .dockerignore
└── index.php
```

### `index.php`

```php
<?php

echo "Hello Dockerfile!";
```

### `Dockerfile`

```dockerfile
FROM php:8.4-cli

LABEL org.opencontainers.image.title="PHP Docker App"
LABEL org.opencontainers.image.version="1.0"

WORKDIR /app

ENV APP_ENV=development

COPY index.php .

RUN addgroup --system appgroup && \
    adduser --system --ingroup appgroup appuser && \
    chown -R appuser:appgroup /app

USER appuser

EXPOSE 8000

CMD ["php", "-S", "0.0.0.0:8000", "-t", "/app"]
```

### `.dockerignore`

```text
.git
.gitignore
.env
*.log
```

## Build

```bash
docker build \
  -t php-app:1.0 .
```

## Run

```bash
docker run -d \
  --name php-app \
  -p 8000:8000 \
  php-app:1.0
```

Buka:

```text
http://localhost:8000
```

Output:

```text
Hello Dockerfile!
```

## Cek environment

```bash
docker exec php-app printenv APP_ENV
```

Output:

```text
development
```

## Cek user

```bash
docker exec php-app whoami
```

Output:

```text
appuser
```

## Cek log

```bash
docker logs php-app
```

## Cek image

```bash
docker image inspect php-app:1.0
```

## Stop

```bash
docker stop php-app
```

## Hapus

```bash
docker rm php-app
```

Diagram:

```text
                Dockerfile
                    │
                    │ docker build
                    ▼
              php-app:1.0
                    │
                    │ docker run
                    ▼
              PHP Container
              │     │     │
              │     │     └── Port 8000
              │     │
              │     └──────── ENV
              │
              └────────────── /app
```

---

# 24. Cheat Code Dockerfile 10 Detik

> **Dockerfile adalah resep untuk membangun image. `FROM` memilih base image, `RUN` menjalankan command saat build, `COPY`/`ADD` memasukkan file, `.dockerignore` mengecualikan build context, `WORKDIR` menentukan directory kerja, `ENV` menetapkan environment runtime, `ARG` menyediakan variable saat build, `EXPOSE` mendokumentasikan port, `VOLUME` mendeklarasikan lokasi data, `USER` menentukan user proses, `HEALTHCHECK` mengecek kesehatan container, `ENTRYPOINT` menentukan executable utama, dan `CMD` menentukan default command/argument. Multi-stage build menggunakan beberapa `FROM` untuk memisahkan proses build dan runtime. Setelah image dibuat, image dapat diberi tag lalu di-push ke Docker Hub atau DigitalOcean Container Registry.**

---

# 25. Referensi Resmi

## Docker

- **Dockerfile Reference**  
  https://docs.docker.com/reference/dockerfile/

- **Dockerfile Overview**  
  https://docs.docker.com/build/concepts/dockerfile/

- **Build Context**  
  https://docs.docker.com/build/concepts/context/

- **Docker Build**  
  https://docs.docker.com/reference/cli/docker/buildx/build/

- **Docker Image**  
  https://docs.docker.com/reference/cli/docker/image/

## Docker Hub

- **Docker Hub**  
  https://hub.docker.com/

- **Docker Hub Documentation**  
  https://docs.docker.com/docker-hub/

## DigitalOcean

- **DigitalOcean Container Registry**  
  https://docs.digitalocean.com/products/container-registry/

- **Container Registry Quickstart**  
  https://docs.digitalocean.com/products/container-registry/getting-started/quickstart/

- **Create a Container Registry**  
  https://docs.digitalocean.com/products/container-registry/how-to/create-registry/

- **Use Container Registry with Docker/Kubernetes**  
  https://docs.digitalocean.com/products/container-registry/how-to/use-registry/

> **Format tautan:** Semua tautan di cheatsheet ini menggunakan format Markdown standar (`[teks](https://...)`) agar tetap terbaca dengan baik di GitHub, GitLab, VS Code, Obsidian, dan Markdown renderer lainnya.
>
> **Catatan versi:** Cheatsheet ini menggunakan syntax Dockerfile modern dan Docker CLI saat ini. Beberapa opsi instruction dan perilaku dapat bergantung pada versi Docker/BuildKit. Untuk command production, selalu cek Dockerfile Reference dan dokumentasi registry yang digunakan. Dokumentasi Docker saat ini mencantumkan instruction seperti `FROM`, `RUN`, `CMD`, `LABEL`, `ADD`, `COPY`, `EXPOSE`, `ENV`, `VOLUME`, `WORKDIR`, `USER`, `ARG`, `HEALTHCHECK`, dan `ENTRYPOINT`. [Dockerfile Reference — Docker Docs](https://docs.docker.com/reference/dockerfile/)
