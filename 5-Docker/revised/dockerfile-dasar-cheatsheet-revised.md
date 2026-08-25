# Dockerfile Dasar Cheatsheet Revised

> **Target:** pemula yang sudah memahami dasar Docker (image,
> container, CLI `docker run`), lalu ingin menulis Dockerfile untuk
> membangun image sendiri.
>
> Fokus cheatsheet ini: **pengenalan → format → FROM → RUN → CMD →
> LABEL → ADD/COPY → .dockerignore → EXPOSE → ENV → VOLUME → WORKDIR
> → USER → ARG → HEALTHCHECK → ENTRYPOINT → multi-stage build →
> registry → mini project**.
>
> **Batasan penting:** Dockerfile adalah file teks berisi instruksi
> untuk membangun Docker image. Cheatsheet ini menggunakan syntax
> Dockerfile modern dan Docker CLI saat ini; beberapa opsi instruction
> dan perilaku dapat bergantung pada versi Docker/BuildKit.

## Cara Belajar

```text
🟢 Fundamental
→ wajib untuk mulai menulis Dockerfile

🟡 Lanjutan
→ pelajari setelah fundamental nyaman

🔴 Advanced / Reference
→ penting ketika kebutuhan aplikasi meningkat
```

Mental model:

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

**Hafalan:**

```text
Dockerfile → build → Image → run → Container
```

Dockerfile adalah **resep**, image adalah **hasil build**, dan
container adalah **instance yang dijalankan dari image**.

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Dockerfile](#bagian-1)
2. [Dockerfile Format](#bagian-2)
3. [FROM Instruction](#bagian-3)
4. [RUN Instruction](#bagian-4)
5. [CMD Instruction](#bagian-5)
6. [LABEL Instruction](#bagian-6)
7. [ADD Instruction](#bagian-7)
8. [COPY Instruction](#bagian-8)
9. [.dockerignore File](#bagian-9)
10. [EXPOSE Instruction](#bagian-10)
11. [Environment Variable Instruction](#bagian-11)

### 🟡 Lanjutan

12. [VOLUME Instruction](#bagian-12)
13. [Working Directory Instruction](#bagian-13)
14. [USER Instruction](#bagian-14)
15. [ARG Instruction](#bagian-15)
16. [HEALTHCHECK Instruction](#bagian-16)
17. [ENTRYPOINT Instruction](#bagian-17)

### 🔴 Advanced / Reference

18. [Multi Stage Build](#bagian-18)
19. [Docker Hub Registry](#bagian-19)
20. [DigitalOcean Container Registry](#bagian-20)
21. [Peta Ingatan Cepat](#bagian-21)
22. [Tabel Ringkasan](#bagian-22)
23. [Cheat Code Dockerfile 10 Detik](#bagian-23)
24. [Urutan Belajar yang Disarankan](#bagian-24)
25. [Mini Project](#bagian-25)
26. [Referensi Resmi](#bagian-26)

------------------------------------------------------------------------

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan Dockerfile

## Konsep

Dockerfile adalah file teks yang berisi instruksi untuk membangun
Docker image.

## Contoh sederhana

```dockerfile
FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
```

## Build

```bash
docker build -t my-nginx:1.0 .
```

## Jalankan

```bash
docker run -d \
  --name web \
  -p 8080:80 \
  my-nginx:1.0
```

## Diagram

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

Dockerfile adalah **resep**, image adalah **hasil build**, dan
container adalah **instance yang dijalankan dari image**.

## Kunci

> Dockerfile → build → Image → run → Container.

## Best Practice

- Mulai dari image base resmi yang sesuai bahasa/framework aplikasi
  (misal `php`, `node`, `nginx`).

------------------------------------------------------------------------

<a id="bagian-2"></a>

# 2. 🟢 Dockerfile Format

## Konsep

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

Instruction tidak membedakan huruf besar/kecil, tetapi convention-nya
ditulis uppercase agar mudah dibaca.

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

## Shell form dan Exec form

```dockerfile
RUN echo "Hello"
```

```dockerfile
RUN ["echo", "Hello"]
```

Bentuk exec menggunakan JSON array sehingga harus menggunakan double
quote. `RUN`, `CMD`, dan `ENTRYPOINT` mendukung shell form dan exec
form.

## Build context

Saat:

```bash
docker build -t my-app .
```

`.` berarti current directory menjadi **build context**:

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

## Kunci

> `INSTRUCTION arguments`, dan `docker build ... .` — titik adalah
> build context.

## Kesalahan Umum

❌ Melakukan operasi `RUN` yang membutuhkan file di luar build context
— file tersebut tidak tersedia.

✅ Pastikan semua file yang dibutuhkan berada di dalam build context.

------------------------------------------------------------------------

<a id="bagian-3"></a>

# 3. 🟢 FROM Instruction

## Konsep

`FROM` menentukan base image yang digunakan untuk build stage.

## Contoh

```dockerfile
FROM nginx
FROM nginx:alpine
FROM php:8.4-cli
```

Dengan platform:

```dockerfile
FROM --platform=linux/amd64 nginx:alpine
```

## `FROM scratch`

`FROM scratch` berarti mulai dari image kosong:

```dockerfile
FROM scratch
```

Biasanya digunakan untuk image yang sangat minimal, terutama ketika
binary sudah self-contained.

## Alias stage

```dockerfile
FROM golang:1.24 AS build
```

`AS build` memberi nama stage. Nanti dapat digunakan:

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

## Kunci

> `FROM` = mulai dari image apa?

## Best Practice

- Gunakan base image resmi dan pin tag versi (`php:8.4-cli`), bukan
  `latest` yang berubah-ubah.

------------------------------------------------------------------------

<a id="bagian-4"></a>

# 4. 🟢 RUN Instruction

## Konsep

`RUN` menjalankan command **saat image sedang di-build**.

## Contoh

```dockerfile
FROM alpine

RUN apk add --no-cache curl
```

Command dijalankan saat build, bukan ketika container baru dijalankan.

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
RUN → saat docker build
CMD → default command saat container run
```

Contoh:

```dockerfile
FROM alpine

RUN echo "BUILD TIME"

CMD ["echo", "RUNTIME"]
```

```bash
docker build -t demo .
docker run --rm demo
```

Output:

```text
RUNTIME
```

## Kunci

> RUN = jalankan command saat BUILD.

## Best Practice

- Menggabungkan command yang berkaitan dan membersihkan cache/package
  metadata dalam layer yang sama sering membantu menjaga image tetap
  kecil.

------------------------------------------------------------------------

<a id="bagian-5"></a>

# 5. 🟢 CMD Instruction

## Konsep

`CMD` menentukan default command atau default argument ketika
container dijalankan.

## Contoh

```dockerfile
FROM alpine

CMD ["echo", "Hello Docker"]
```

```bash
docker build -t hello .
docker run --rm hello
```

Output:

```text
Hello Docker
```

## Shell form dan Exec form

```dockerfile
CMD echo "Hello Docker"
```

```dockerfile
CMD ["echo", "Hello Docker"]
```

Exec form sering lebih jelas untuk command container.

## CMD dapat di-override

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

Docker mendokumentasikan bahwa satu Dockerfile sebaiknya hanya memiliki
satu `CMD`; jika ada beberapa, hanya instruction terakhir yang berlaku.

## Kunci

> CMD = default command saat container dijalankan.

## Kesalahan Umum

❌ Menulis lebih dari satu `CMD` — hanya yang terakhir berlaku.

✅ Tulis satu `CMD` (atau gabung dengan `ENTRYPOINT`, section 17).

------------------------------------------------------------------------

<a id="bagian-6"></a>

# 6. 🟢 LABEL Instruction

## Konsep

`LABEL` menambahkan metadata ke image.

## Contoh

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

## Lihat label

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

## Kunci

> LABEL = metadata image.

## Best Practice

- Gunakan label standar OCI (`org.opencontainers.image.*`) agar
  metadata konsisten antar tool.

------------------------------------------------------------------------

<a id="bagian-7"></a>

# 7. 🟢 ADD Instruction

## Konsep

`ADD` digunakan untuk menambahkan file/directory ke image, dengan
kemampuan tambahan tertentu.

## Contoh

```dockerfile
FROM nginx:alpine

ADD index.html /usr/share/nginx/html/
```

## ADD directory dan archive

```dockerfile
ADD html/ /usr/share/nginx/html/
```

Salah satu fitur khusus `ADD` adalah kemampuan tertentu untuk menangani
local tar archive:

```dockerfile
ADD app.tar.gz /app/
```

## ADD remote URL

```dockerfile
ADD https://example.com/file.txt /app/file.txt
```

Namun untuk kebanyakan file dari build context, `COPY` biasanya lebih
eksplisit.

## ADD vs COPY

```text
COPY → copy file/directory
ADD  → copy + kemampuan tambahan tertentu
```

## Kunci

> ADD = copy + fitur tambahan.

## Best Practice

- Gunakan `COPY` untuk menyalin file dari build context, dan `ADD`
  hanya jika benar-benar membutuhkan fitur khususnya (archive/URL).

------------------------------------------------------------------------

<a id="bagian-8"></a>

# 8. 🟢 COPY Instruction

## Konsep

`COPY` digunakan untuk menyalin file atau directory dari build context
ke image.

## Contoh

```dockerfile
FROM nginx:alpine

COPY index.html /usr/share/nginx/html/
```

Directory dan multiple files:

```dockerfile
COPY html/ /usr/share/nginx/html/
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

`COPY --from` sangat penting dalam multi-stage build karena dapat
mengambil file dari build stage lain.

## ADD vs COPY

```text
COPY → pilihan default untuk menyalin file
ADD  → gunakan jika memang membutuhkan fitur khusus ADD
```

## Kunci

> COPY = salin file/directory.

## Best Practice

- Gunakan `COPY` sebagai pilihan default untuk menyalin file.

------------------------------------------------------------------------

<a id="bagian-9"></a>

# 9. 🟢 .dockerignore File

## Konsep

`.dockerignore` digunakan untuk mengecualikan file/directory dari
build context.

## Contoh

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

File yang cocok dengan `.dockerignore` tidak dikirim sebagai bagian
dari build context.

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

## Diagram

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

## Kunci

> `.dockerignore` = filter build context.

## Kesalahan Umum

❌ Memasukkan secret seperti `.env` ke build context — berisiko bocor
selama proses build.

✅ Masukkan `.env` ke `.dockerignore` dan gunakan mekanisme secret yang
aman.

------------------------------------------------------------------------

<a id="bagian-10"></a>

# 10. 🟢 EXPOSE Instruction

## Konsep

`EXPOSE` mendokumentasikan port yang digunakan aplikasi di dalam
container.

## Contoh

```dockerfile
FROM nginx:alpine

EXPOSE 80
```

Untuk beberapa port:

```dockerfile
EXPOSE 80
EXPOSE 443
```

Atau dengan protokol:

```dockerfile
EXPOSE 80/tcp
EXPOSE 53/udp
```

## Penting

`EXPOSE` **tidak otomatis membuat port dapat diakses dari host**.
Tetap perlu publish port saat run:

```bash
docker run -d \
  -p 8080:80 \
  nginx
```

## Diagram

```text
EXPOSE 80
   │
   ▼
Dokumentasi metadata
   │
   └── tidak otomatis publish

Publish:
Host 8080 ─────> Container 80
```

## Kunci

> EXPOSE = dokumentasikan port, `-p` = publish port.

## Kesalahan Umum

❌ Mengira `EXPOSE` sudah membuat port bisa diakses dari host.

✅ Gunakan `-p host:container` saat `docker run` untuk publish.

------------------------------------------------------------------------

<a id="bagian-11"></a>

# 11. 🟢 Environment Variable Instruction

## Konsep

Gunakan `ENV` untuk menetapkan environment variable di image (tersedia
saat container runtime).

## Contoh

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
ENV → tersimpan di image → tersedia saat container runtime
ARG → build-time variable → tidak menjadi environment runtime
```

## Kunci

> ENV = environment untuk image/container.

## Kesalahan Umum

❌ Menaruh secret di `ENV` dalam image — ikut terbawa ke image dan
history.

✅ Gunakan mekanisme secret/`--env-file` yang sesuai saat runtime.

------------------------------------------------------------------------

<a id="bagian-12"></a>

# 12. 🟡 VOLUME Instruction

## Konsep

`VOLUME` membuat mount point untuk persistent data.

## Contoh

```dockerfile
FROM alpine

VOLUME ["/data"]
```

Saat container dijalankan, `/data` diperlakukan sebagai lokasi volume.

## Dengan aplikasi

```dockerfile
FROM mysql:8.4

VOLUME ["/var/lib/mysql"]
```

Data database sebaiknya dikelola dengan storage yang sesuai, bukan
dianggap bagian dari writable layer container.

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

## Kunci

> VOLUME = deklarasi lokasi data persistent.

## Best Practice

- Deklarasikan `VOLUME` untuk path yang memang menyimpan data
  persistent (misal data database).

------------------------------------------------------------------------

<a id="bagian-13"></a>

# 13. 🟡 Working Directory Instruction

## Konsep

`WORKDIR` menentukan working directory untuk instruction berikutnya
dan default working directory saat container berjalan.

## Contoh

```dockerfile
FROM alpine

WORKDIR /app

COPY . .

RUN ls
```

Setelah `WORKDIR /app`, command berikutnya berjalan dari `/app`.

## CMD

```dockerfile
FROM alpine

WORKDIR /app

CMD ["pwd"]
```

```bash
docker run --rm my-app
```

Output:

```text
/app
```

## WORKDIR membuat directory

Jika directory belum ada, Docker akan membuatnya sesuai kebutuhan
instruction tersebut.

## Relative WORKDIR

```dockerfile
WORKDIR /app
WORKDIR src
```

Hasil:

```text
/app/src
```

## Kunci

> WORKDIR = cd default untuk Dockerfile/container.

## Best Practice

- Tetapkan `WORKDIR` secara eksplisit agar tidak bergantung pada
  working directory yang mungkin diwarisi dari base image.

------------------------------------------------------------------------

<a id="bagian-14"></a>

# 14. 🟡 USER Instruction

## Konsep

`USER` menentukan user/group yang digunakan untuk instruction
berikutnya dan default runtime container.

## Contoh

```dockerfile
FROM alpine

RUN adduser -D appuser

USER appuser

WORKDIR /app

CMD ["id"]
```

Saat container berjalan, proses utama menggunakan `appuser`.

## Menggunakan UID

```dockerfile
USER 1000
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

## Root vs non-root

```text
root     → hak akses sangat tinggi
non-root → hak akses lebih terbatas
```

## Kunci

> USER = siapa yang menjalankan proses?

## Best Practice

- Untuk aplikasi yang tidak membutuhkan root, menggunakan user
  non-root umumnya merupakan praktik keamanan yang lebih baik.

------------------------------------------------------------------------

<a id="bagian-15"></a>

# 15. 🟡 ARG Instruction

## Konsep

`ARG` digunakan untuk variable saat image sedang di-build
(build-time variable).

## Contoh

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

`ARG` dapat dideklarasikan sebelum `FROM` untuk digunakan dalam
pemilihan image:

```dockerfile
ARG PHP_VERSION=8.4

FROM php:${PHP_VERSION}-cli
```

```bash
docker build \
  --build-arg PHP_VERSION=8.4 \
  -t my-php .
```

## ARG vs ENV

```text
ARG → build time
ENV → image + runtime
```

Contoh:

```dockerfile
FROM alpine

ARG BUILD_VERSION=1.0
ENV APP_VERSION=$BUILD_VERSION

RUN echo "Build: $BUILD_VERSION"
```

## Kunci

> ARG = variable saat build.

## Kesalahan Umum

❌ Menggunakan `ARG` untuk password, API token, atau secret — nilai
build argument dapat terlihat dalam metadata/history.

✅ Gunakan mekanisme secret build yang sesuai untuk data sensitif.

------------------------------------------------------------------------

<a id="bagian-16"></a>

# 16. 🟡 HEALTHCHECK Instruction

## Konsep

`HEALTHCHECK` menentukan cara Docker mengecek apakah container masih
sehat.

## Contoh

```dockerfile
FROM nginx:alpine

HEALTHCHECK --interval=30s \
  --timeout=3s \
  --start-period=5s \
  --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1
```

## Konsep

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
docker inspect -f '{{.State.Health.Status}}' web
```

Contoh:

```text
healthy
```

## Parameter penting

```text
--interval     → jarak antar health check
--timeout      → batas waktu satu check
--start-period → waktu awal untuk bootstrap
--retries      → jumlah kegagalan sebelum unhealthy
```

## Kunci

> HEALTHCHECK = apakah aplikasi sehat? `0` → healthy, `1` →
> unhealthy.

## Best Practice

- Health check harus memeriksa kondisi aplikasi yang bermakna (HTTP
  endpoint, bukan sekadar proses hidup).

------------------------------------------------------------------------

<a id="bagian-17"></a>

# 17. 🟡 ENTRYPOINT Instruction

## Konsep

`ENTRYPOINT` menentukan executable utama container, sedangkan `CMD`
menyediakan default argument.

## Contoh

```dockerfile
FROM alpine

ENTRYPOINT ["echo"]

CMD ["Hello Docker"]
```

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

Karena dapat dibayangkan sebagai:

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

```bash
docker run --rm my-ping
docker run --rm my-ping 8.8.8.8
```

## Exec form dan Shell form

```dockerfile
ENTRYPOINT ["php", "artisan"]
```

```dockerfile
ENTRYPOINT php artisan
```

Exec form dan shell form memiliki perilaku berbeda terhadap shell,
signal, dan argument.

## ENTRYPOINT vs CMD

```text
ENTRYPOINT → program utama
CMD        → default argument / default command
```

## Kunci

> ENTRYPOINT = "siapa program utamanya?", CMD = "argument default-nya
> apa?"

## Best Practice

- Gunakan exec form (`["executable", "arg"]`) untuk `ENTRYPOINT` agar
  menerima signal dengan benar.

------------------------------------------------------------------------

<a id="bagian-18"></a>

# 18. 🔴 Multi Stage Build

## Konsep

Multi-stage build menggunakan beberapa `FROM` dalam satu Dockerfile
untuk memisahkan proses build dan runtime.

Tujuannya:

```text
build tools
   ↓
compile/build
   ↓
ambil hasil
   ↓
runtime image kecil
```

## Contoh Go

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

## Diagram

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

Hasilnya dapat mengurangi ukuran image final dan mengurangi tool yang
tidak diperlukan saat runtime.

## Contoh frontend

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

## Kunci

> Stage build → hasil, Stage runtime → hanya hasil yang dibutuhkan.

## Best Practice

- Gunakan multi-stage untuk bahasa yang membutuhkan toolchain build
  (Go, Node, dll.) agar image final tetap kecil.

------------------------------------------------------------------------

<a id="bagian-19"></a>

# 19. 🔴 Docker Hub Registry

## Konsep

Docker Hub adalah registry yang umum digunakan untuk menyimpan dan
mendistribusikan Docker image.

## Alur

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

## Login dan build

```bash
docker login
```

```bash
docker build \
  -t username/my-app:1.0 .
```

## Push dan pull

```bash
docker push username/my-app:1.0
```

Di machine lain:

```bash
docker pull username/my-app:1.0
docker run --rm username/my-app:1.0
```

## Tag existing image

```bash
docker tag \
  my-app:latest \
  username/my-app:1.0

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

## Kunci

> `docker login` → `docker tag` → `docker push` → `docker pull`.

## Best Practice

- Beri tag versi yang jelas (`1.0`), jangan hanya `latest` untuk
  rilis.

------------------------------------------------------------------------

<a id="bagian-20"></a>

# 20. 🔴 DigitalOcean Container Registry

## Konsep

DigitalOcean Container Registry (DOCR) adalah private Docker image
registry milik DigitalOcean untuk menyimpan dan mengelola container
image secara private. DOCR terintegrasi dengan Docker dan DigitalOcean
Kubernetes.

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

## Login

```bash
doctl registries login
```

Command tersebut mengonfigurasi autentikasi Docker agar dapat
melakukan push/pull ke registry DigitalOcean.

## Build, tag, push, pull

```bash
docker build \
  -t my-app:1.0 .
```

```bash
docker tag \
  my-app:1.0 \
  registry.digitalocean.com/my-registry/my-app:1.0
```

```bash
docker push \
  registry.digitalocean.com/my-registry/my-app:1.0
```

```bash
docker pull \
  registry.digitalocean.com/my-registry/my-app:1.0
```

## Diagram

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

## Kunci

> `doctl registries login` → `docker tag` →
> `registry.digitalocean.com/registry/image:tag` → `docker push`.

## Best Practice

- Nama registry DOCR harus unik, maksimal 63 karakter, huruf kecil,
  angka, dan/atau tanda hubung, dimulai dengan huruf, serta diakhiri
  huruf atau angka.

------------------------------------------------------------------------

<a id="bagian-21"></a>

# 21. 🧠 Peta Ingatan Cepat

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

## B. Instruction Utama

```text
FROM        → base image
RUN         → build command
COPY / ADD  → masukkan file
WORKDIR     → working directory
ENV         → runtime environment
ARG         → build-time variable
EXPOSE      → dokumentasi port
VOLUME      → lokasi persistent data
USER        → user proses
HEALTHCHECK → status kesehatan
ENTRYPOINT  → program utama
CMD         → default command / argument
```

## C. RUN vs CMD vs ENTRYPOINT

```text
RUN         → BUILD TIME
CMD         → DEFAULT RUNTIME COMMAND / ARGUMENT
ENTRYPOINT  → MAIN RUNTIME EXECUTABLE
```

## D. COPY vs ADD

```text
COPY → copy file/directory
ADD  → copy + fitur tambahan

Best practice: gunakan COPY jika hanya perlu copy
```

## E. ENV vs ARG

```text
ARG → build time
ENV → image + runtime
```

## F. Port

```text
EXPOSE 80 → dokumentasikan port container

docker run -p 8080:80 image
localhost:8080 → container:80
```

## G. Storage

```text
VOLUME       → persistent data location
COPY         → masukkan file ke image
.dockerignore→ keluarkan file dari build context
```

## H. Health

```text
HEALTHCHECK
     │
     ├── exit 0 → healthy
     └── exit 1 → unhealthy
```

## I. Multi Stage

```text
Build Stage
   │
   │ COPY --from
   ▼
Runtime Stage

build besar → runtime kecil
```

## J. Registry

```text
Docker Hub
username/image:tag

DigitalOcean
registry.digitalocean.com/registry/image:tag
```

------------------------------------------------------------------------

<a id="bagian-22"></a>

# 22. 📚 Tabel Ringkasan

  Materi                 Fungsi                                Kata Kunci
  ---------------------- ------------------------------------- ----------------------------
  Pengenalan Dockerfile  Mengenal file build image              `Dockerfile`
  Dockerfile Format      Memahami syntax                        `INSTRUCTION arguments`
  FROM                   Menentukan base image                  `FROM nginx:alpine`
  RUN                    Menjalankan command saat build         `RUN`
  CMD                    Default command runtime                `CMD`
  LABEL                  Metadata image                         `LABEL key=value`
  ADD                    Menambahkan file dengan fitur tambahan `ADD`
  COPY                   Menyalin file/directory                `COPY`
  .dockerignore          Mengecualikan build context            `.dockerignore`
  EXPOSE                 Mendokumentasikan port                 `EXPOSE 80`
  ENV                    Environment variable image/runtime     `ENV`
  VOLUME                 Deklarasi persistent data              `VOLUME`
  WORKDIR                Working directory                      `WORKDIR /app`
  USER                   User/group proses                      `USER`
  ARG                    Variable saat build                    `ARG`
  HEALTHCHECK            Mengecek kesehatan container           `HEALTHCHECK`
  ENTRYPOINT             Executable utama container             `ENTRYPOINT`
  Multi Stage Build      Memisahkan build dan runtime           `FROM ... AS`, `COPY --from`
  Docker Hub Registry    Registry image publik/private          `docker push/pull`
  DigitalOcean Registry  Private registry DigitalOcean          `registry.digitalocean.com`

------------------------------------------------------------------------

<a id="bagian-23"></a>

# 23. ⚡ Cheat Code Dockerfile 10 Detik

```text
FROM         → base image
RUN          → command saat build
COPY / ADD   → masukkan file
.dockerignore→ filter build context
WORKDIR      → directory kerja
ENV          → environment runtime
ARG          → variable build
EXPOSE       → dokumentasi port
VOLUME       → lokasi data persistent
USER         → user proses
HEALTHCHECK  → cek kesehatan
ENTRYPOINT   → executable utama
CMD          → default command/argument

Multi-stage  → FROM ... AS build + COPY --from
Registry     → docker tag + docker push
```

## Dockerfile dasar

```dockerfile
FROM php:8.4-cli

WORKDIR /app

ENV APP_ENV=development

COPY index.php .

EXPOSE 8000

CMD ["php", "-S", "0.0.0.0:8000", "-t", "/app"]
```

## Multi-stage

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

## Build dan run

```bash
docker build -t my-app:1.0 .
docker run -d -p 8080:80 my-app:1.0
```

------------------------------------------------------------------------

<a id="bagian-24"></a>

# 24. 🧭 Urutan Belajar yang Disarankan

```text
1. Pengenalan & format Dockerfile
       ↓
2. FROM (base image)
       ↓
3. RUN vs CMD vs ENTRYPOINT
       ↓
4. COPY / ADD & .dockerignore
       ↓
5. WORKDIR & ENV & ARG
       ↓
6. EXPOSE & VOLUME & USER
       ↓
7. HEALTHCHECK
       ↓
8. Multi-stage build
       ↓
9. Registry (Docker Hub / DOCR)
       ↓
10. Mini project
```

Prinsip: kuasai dulu FROM → RUN → COPY → CMD untuk image sederhana,
lalu tambahkan ENV/ARG, HEALTHCHECK, dan multi-stage.

------------------------------------------------------------------------

<a id="bagian-25"></a>

# 25. 🏗️ Mini Project

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

## Struktur

```text
php-app/
├── Dockerfile
├── .dockerignore
└── index.php
```

## `index.php`

```php
<?php

echo "Hello Dockerfile!";
```

## `Dockerfile`

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

## `.dockerignore`

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

Buka `http://localhost:8000`:

```text
Hello Dockerfile!
```

## Cek environment dan user

```bash
docker exec php-app printenv APP_ENV
```

Output:

```text
development
```

```bash
docker exec php-app whoami
```

Output:

```text
appuser
```

## Cek log dan image

```bash
docker logs php-app
docker image inspect php-app:1.0
```

## Stop dan hapus

```bash
docker stop php-app
docker rm php-app
```

## Diagram

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

------------------------------------------------------------------------

<a id="bagian-26"></a>

# 26. 🔗 Referensi Resmi

## Docker

- [Dockerfile Reference](https://docs.docker.com/reference/dockerfile/)
- [Dockerfile Overview](https://docs.docker.com/build/concepts/dockerfile/)
- [Build Context](https://docs.docker.com/build/concepts/context/)
- [Docker Build](https://docs.docker.com/reference/cli/docker/buildx/build/)
- [Docker Image](https://docs.docker.com/reference/cli/docker/image/)

## Docker Hub

- [Docker Hub](https://hub.docker.com/)
- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)

## DigitalOcean

- [DigitalOcean Container Registry](https://docs.digitalocean.com/products/container-registry/)
- [Container Registry Quickstart](https://docs.digitalocean.com/products/container-registry/getting-started/quickstart/)
- [Create a Container Registry](https://docs.digitalocean.com/products/container-registry/how-to/create-registry/)
- [Use Container Registry with Docker/Kubernetes](https://docs.digitalocean.com/products/container-registry/how-to/use-registry/)

> **Format tautan:** Semua tautan di cheatsheet ini menggunakan format
> Markdown standar (`[teks](https://...)`) agar tetap terbaca dengan
> baik di GitHub, GitLab, VS Code, Obsidian, dan Markdown renderer
> lainnya.
>
> **Catatan versi:** Cheatsheet ini menggunakan syntax Dockerfile
> modern dan Docker CLI saat ini. Beberapa opsi instruction dan
> perilaku dapat bergantung pada versi Docker/BuildKit. Untuk command
> production, selalu cek Dockerfile Reference dan dokumentasi registry
> yang digunakan.
