# Docker Dasar Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Docker Engine untuk pemula. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> Docker digunakan untuk menjalankan aplikasi di dalam **container** yang terisolasi dan dapat dipindahkan antar environment. Cheatsheet ini fokus pada perintah Docker CLI yang paling sering digunakan untuk memahami container, image, volume, network, resource, dan maintenance dasar.

## Daftar Isi

1. [Pengenalan Container](#1-pengenalan-container)
2. [Pengenalan Docker](#2-pengenalan-docker)
3. [Arsitektur Docker](#3-arsitektur-docker)
4. [Menginstall Docker](#4-menginstall-docker)
5. [Docker Registry](#5-docker-registry)
6. [Docker Image](#6-docker-image)
7. [Docker Container](#7-docker-container)
8. [Container Log](#8-container-log)
9. [Container Exec](#9-container-exec)
10. [Container Port](#10-container-port)
11. [Container Environment Variable](#11-container-environment-variable)
12. [Container Stats](#12-container-stats)
13. [Container Resource Limit](#13-container-resource-limit)
14. [Bind Mounts](#14-bind-mounts)
15. [Docker Volume](#15-docker-volume)
16. [Container Volume](#16-container-volume)
17. [Backup Volume](#17-backup-volume)
18. [Restore Volume](#18-restore-volume)
19. [Docker Network](#19-docker-network)
20. [Container Network](#20-container-network)
21. [Inspect](#21-inspect)
22. [Prune](#22-prune)
23. [Peta Ingatan Cepat](#23-peta-ingatan-cepat)
24. [Tabel Ringkasan](#24-tabel-ringkasan)
25. [Mini Project](#25-mini-project)
26. [Cheat Code Docker 10 Detik](#26-cheat-code-docker-10-detik)
27. [Referensi Resmi](#27-referensi-resmi)

---

# 1. Pengenalan Container

Container adalah lingkungan terisolasi untuk menjalankan aplikasi beserta dependency yang dibutuhkan.

Berbeda dengan virtual machine, container biasanya berbagi kernel host sehingga lebih ringan.

Diagram sederhana:

```text
Host
│
├── Container A
│    └── App + Dependency
│
├── Container B
│    └── App + Dependency
│
└── Container C
     └── App + Dependency
```

Contoh penggunaan:

```text
PHP Application
     │
     ▼
PHP Container
     │
     ├── PHP
     ├── Extension
     └── Dependency
```

## Container vs Virtual Machine

```text
Virtual Machine
Host
 │
 └── Hypervisor
      ├── VM
      │    ├── Guest OS
      │    └── App
      └── VM
           ├── Guest OS
           └── App
```

```text
Container
Host
 │
 └── Container Runtime
      ├── Container
      │    └── App
      └── Container
           └── App
```

**Hafalan:**

```text
Container = aplikasi + environment terisolasi
```

---

# 2. Pengenalan Docker

Docker adalah platform untuk membangun, menjalankan, dan mendistribusikan aplikasi menggunakan container.

Konsep utama:

```text
Docker
│
├── Image
│
├── Container
│
├── Registry
│
├── Volume
│
└── Network
```

Alur paling penting:

```text
Dockerfile
    │
    ▼
 Docker Image
    │
    ▼
Docker Container
    │
    ├── Volume
    └── Network
```

Contoh command:

```bash
docker run hello-world
```

Docker akan:

```text
docker run
   │
   ├── cari image hello-world
   │
   ├── pull jika belum ada
   │
   ├── buat container
   │
   └── jalankan container
```

**Hafalan:**

```text
Image = template
Container = instance yang berjalan
Registry = tempat menyimpan image
```

---

# 3. Arsitektur Docker

Arsitektur Docker menggunakan pola **client-server**.

```text
Docker CLI
   │
   │ Docker API
   ▼
Docker Daemon
   │
   ├── Images
   ├── Containers
   ├── Networks
   └── Volumes
```

## Docker Client

Command:

```bash
docker ps
docker images
docker run nginx
```

Docker CLI mengirim request ke Docker daemon.

## Docker Daemon

Docker daemon bertugas mengelola:

```text
container
image
network
volume
```

## Registry

Registry menyimpan image.

```text
Docker Client
     │
     ▼
Docker Daemon
     │
     │ pull
     ▼
Registry
```

Contoh registry publik:

```text
Docker Hub
```

## Alur `docker run`

```text
docker run nginx
      │
      ▼
Docker Client
      │
      ▼
Docker Daemon
      │
      ├── Image ada?
      │      │
      │      ├── ya → buat container
      │      │
      │      └── tidak
      │             ↓
      │          pull image
      │
      ▼
Container
```

**Hafalan:**

```text
CLI → Daemon → Image/Container
              ↕
           Registry
```

---

# 4. Menginstall Docker

Docker tersedia untuk Linux, macOS, dan Windows melalui produk/distribusi Docker yang sesuai.

Setelah instalasi, cek:

```bash
docker --version
```

Contoh:

```text
Docker version 28.x.x
```

Cek detail:

```bash
docker info
```

Tes:

```bash
docker run hello-world
```

Jika berhasil, Docker dapat membuat dan menjalankan container.

## Cek command

```bash
docker help
```

Bantuan command tertentu:

```bash
docker run --help
```

**Hafalan:**

```text
docker --version → cek versi
docker info      → cek daemon
docker help      → bantuan
```

> Untuk instalasi, ikuti dokumentasi Docker sesuai sistem operasi karena metode dan paket dapat berubah antar versi.

---

# 5. Docker Registry

Registry adalah tempat untuk menyimpan dan mendistribusikan Docker image.

Contoh:

```text
Docker Hub
GitHub Container Registry
Google Artifact Registry
Amazon ECR
GitLab Container Registry
Private Registry
```

Konsep:

```text
Local Machine
     │
     │ docker pull
     ▼
Registry
     │
     ▼
  Image
```

## Login registry

```bash
docker login
```

Logout:

```bash
docker logout
```

## Pull image

```bash
docker pull nginx
```

Dengan tag:

```bash
docker pull nginx:alpine
```

## Push image

Misalnya image:

```text
username/myapp:1.0
```

Push:

```bash
docker push username/myapp:1.0
```

## Tag image

```bash
docker tag myapp:latest username/myapp:1.0
```

Lalu:

```bash
docker push username/myapp:1.0
```

Diagram:

```text
Local Image
    │
    │ docker push
    ▼
Registry
    │
    │ docker pull
    ▼
Machine lain
```

**Hafalan:**

```text
pull → ambil image
push → kirim image
login → autentikasi
tag → beri nama/tag image
```

---

# 6. Docker Image

Image adalah template immutable yang digunakan untuk membuat container.

Contoh image:

```text
nginx
mysql
redis
php
ubuntu
alpine
```

Lihat image lokal:

```bash
docker images
```

Atau:

```bash
docker image ls
```

Output sederhana:

```text
REPOSITORY   TAG       IMAGE ID
nginx        latest    abc123
```

## Pull image

```bash
docker pull nginx
```

Dengan tag:

```bash
docker pull nginx:1.27
```

## Menjalankan image

```bash
docker run nginx
```

## Menghapus image

```bash
docker image rm nginx
```

atau:

```bash
docker rmi nginx
```

## Inspect image

```bash
docker image inspect nginx
```

## Tag image

```bash
docker tag nginx my-nginx:1.0
```

## Image ID

Lihat image ID:

```bash
docker images
```

Diagram:

```text
Image
 │
 ├── layer 1
 ├── layer 2
 ├── layer 3
 └── metadata
       │
       ▼
   Container
```

**Hafalan:**

```text
Image = blueprint/template
```

---

# 7. Docker Container

Container adalah instance dari image yang dibuat dan dijalankan oleh Docker.

## Membuat dan menjalankan

```bash
docker run nginx
```

Biasanya container akan berjalan di foreground.

Gunakan `-d` untuk background:

```bash
docker run -d nginx
```

`-d` = detached mode.

## Beri nama container

```bash
docker run -d --name web nginx
```

Sekarang container bernama:

```text
web
```

## Lihat container aktif

```bash
docker ps
```

## Lihat semua container

```bash
docker ps -a
```

## Stop

```bash
docker stop web
```

## Start

```bash
docker start web
```

## Restart

```bash
docker restart web
```

## Hapus

```bash
docker rm web
```

Jika container masih berjalan:

```bash
docker rm -f web
```

## Rename

```bash
docker rename web web-server
```

Diagram lifecycle:

```text
Image
  │
  │ docker run
  ▼
Created → Running → Stopped
             │
             ├── restart → Running
             │
             └── rm → Deleted
```

**Hafalan:**

```text
run     → buat + jalankan
start   → jalankan container yang sudah ada
stop    → hentikan
restart → stop + start
rm      → hapus container
```

---

# 8. Container Log

Log digunakan untuk melihat output aplikasi di dalam container.

Lihat log:

```bash
docker logs web
```

Follow log:

```bash
docker logs -f web
```

`-f` = follow.

Batasi jumlah baris:

```bash
docker logs --tail 50 web
```

Tambahkan timestamp:

```bash
docker logs -t web
```

Gabungkan:

```bash
docker logs -f --tail 50 web
```

Diagram:

```text
Application
    │
    ▼
stdout / stderr
    │
    ▼
Docker logging
    │
    ▼
docker logs
```

**Hafalan:**

```text
docker logs <container>
```

Untuk debugging cepat:

```bash
docker logs -f --tail 100 web
```

---

# 9. Container Exec

`docker exec` digunakan untuk menjalankan command di dalam container yang sedang berjalan.

Contoh:

```bash
docker exec web ls
```

Masuk ke shell:

```bash
docker exec -it web bash
```

Jika image tidak memiliki `bash`, coba:

```bash
docker exec -it web sh
```

Penjelasan:

```text
-i → interactive
-t → pseudo-TTY
```

Contoh:

```bash
docker exec -it web sh
```

Di dalam container:

```bash
pwd
ls
env
```

Keluar:

```bash
exit
```

Menjalankan command tanpa masuk shell:

```bash
docker exec web cat /etc/hostname
```

**Hafalan:**

```text
exec = jalankan command ke container yang sedang running
```

---

# 10. Container Port

Container memiliki network namespace sendiri. Port di dalam container tidak otomatis dapat diakses melalui host.

Misalnya Nginx mendengarkan:

```text
container:80
```

Expose ke host:

```bash
docker run -d \
  --name web \
  -p 8080:80 \
  nginx
```

Artinya:

```text
Host             Container
8080  ─────────> 80
```

Buka:

```text
http://localhost:8080
```

## Format

```text
-p HOST_PORT:CONTAINER_PORT
```

Contoh:

```bash
-p 8080:80
-p 3000:3000
-p 5432:5432
```

## Bind ke localhost

```bash
docker run -d \
  --name web \
  -p 127.0.0.1:8080:80 \
  nginx
```

Port hanya tersedia dari host lokal.

## Lihat port container

```bash
docker port web
```

**Hafalan:**

```text
-p host:container
```

Contoh:

```text
-p 8080:80
     │   │
     │   └── port container
     └────── port host
```

---

# 11. Container Environment Variable

Environment variable digunakan untuk mengirim konfigurasi ke container.

Gunakan `-e`:

```bash
docker run -d \
  --name app \
  -e APP_ENV=production \
  nginx
```

Lihat environment dari container:

```bash
docker exec app env
```

Atau:

```bash
docker exec app printenv APP_ENV
```

Output:

```text
production
```

## Beberapa variable

```bash
docker run -d \
  --name app \
  -e APP_ENV=production \
  -e APP_DEBUG=false \
  nginx
```

## File `.env`

Docker juga dapat membaca variable dari file menggunakan `--env-file`.

Buat:

```text
.env
```

Isi:

```text
APP_ENV=production
APP_DEBUG=false
APP_NAME=my-app
```

Jalankan:

```bash
docker run -d \
  --name app \
  --env-file .env \
  nginx
```

**Hafalan:**

```text
-e KEY=VALUE
```

atau:

```text
--env-file .env
```

> Jangan memasukkan password, API key, atau secret sensitif ke image maupun repository secara sembarangan. Untuk kebutuhan production, gunakan mekanisme secret/configuration yang sesuai platform.

---

# 12. Container Stats

`docker stats` digunakan untuk melihat penggunaan resource container secara real-time.

```bash
docker stats
```

Untuk container tertentu:

```bash
docker stats web
```

Contoh informasi:

```text
CONTAINER
CPU %
MEM USAGE / LIMIT
MEM %
NET I/O
BLOCK I/O
PIDS
```

Diagram:

```text
Container
   │
   ├── CPU
   ├── Memory
   ├── Network
   ├── Block I/O
   └── Processes
          │
          ▼
     docker stats
```

Sekali saja tanpa live update:

```bash
docker stats --no-stream
```

**Hafalan:**

```text
docker stats = monitor resource container
```

---

# 13. Container Resource Limit

Tanpa limit, container dapat menggunakan resource host sesuai kondisi dan konfigurasi runtime.

## Memory limit

```bash
docker run -d \
  --name app \
  --memory 512m \
  nginx
```

Artinya memory container dibatasi sekitar:

```text
512 MB
```

## CPU limit

Contoh:

```bash
docker run -d \
  --name app \
  --cpus 1 \
  nginx
```

Container dibatasi sekitar satu CPU.

## CPU dan memory

```bash
docker run -d \
  --name app \
  --memory 512m \
  --cpus 1 \
  nginx
```

Cek:

```bash
docker stats app
```

Beberapa opsi umum:

```text
--memory
--cpus
--cpu-shares
--pids-limit
```

**Hafalan:**

```text
--memory → batas RAM
--cpus   → batas CPU
```

> Nilai resource limit sebaiknya ditentukan berdasarkan kebutuhan aplikasi dan pengujian, bukan sekadar angka acak.

---

# 14. Bind Mounts

Bind mount menghubungkan folder/file di host langsung ke path di container.

Format:

```text
-v HOST_PATH:CONTAINER_PATH
```

Contoh:

```bash
docker run -d \
  --name web \
  -p 8080:80 \
  -v "$PWD/html:/usr/share/nginx/html" \
  nginx
```

Diagram:

```text
Host
./html
  │
  │ bind mount
  ▼
Container
/usr/share/nginx/html
```

Jika host memiliki:

```text
html/
└── index.html
```

Maka container akan melihat file:

```text
/usr/share/nginx/html/index.html
```

## Read-only

```bash
docker run -d \
  --name web \
  -v "$PWD/html:/usr/share/nginx/html:ro" \
  nginx
```

`ro` = read-only.

## `--mount`

Bentuk yang lebih eksplisit:

```bash
docker run -d \
  --name web \
  --mount type=bind,source="$PWD/html",target=/usr/share/nginx/html \
  nginx
```

Perbandingan:

```text
Bind Mount
Host path
    │
    ▼
Container path
```

**Hafalan:**

```text
Bind mount = host folder ↔ container folder
```

---

# 15. Docker Volume

Docker volume adalah storage yang dikelola Docker.

Buat volume:

```bash
docker volume create app-data
```

Lihat volume:

```bash
docker volume ls
```

Inspect:

```bash
docker volume inspect app-data
```

Hapus:

```bash
docker volume rm app-data
```

Gunakan volume:

```bash
docker run -d \
  --name app \
  -v app-data:/data \
  nginx
```

Diagram:

```text
Docker
 │
 ├── Container
 │      │
 │      ▼
 │    /data
 │      │
 │      ▼
 └── Volume
      app-data
```

## `--mount`

```bash
docker run -d \
  --name app \
  --mount type=volume,source=app-data,target=/data \
  nginx
```

**Hafalan:**

```text
Volume = storage yang dikelola Docker
```

---

# 16. Container Volume

Istilah "container volume" biasanya merujuk pada penggunaan volume sebagai storage container.

Contoh:

```bash
docker volume create app-data
```

Jalankan container:

```bash
docker run -d \
  --name app \
  -v app-data:/data \
  nginx
```

Tulis data:

```bash
docker exec app sh -c 'echo "Halo Docker" > /data/hello.txt'
```

Cek:

```bash
docker exec app cat /data/hello.txt
```

Output:

```text
Halo Docker
```

Hapus container:

```bash
docker rm -f app
```

Buat container baru menggunakan volume yang sama:

```bash
docker run -d \
  --name app2 \
  -v app-data:/data \
  nginx
```

Cek:

```bash
docker exec app2 cat /data/hello.txt
```

Output tetap:

```text
Halo Docker
```

Diagram:

```text
Container A
    │
    ▼
 app-data
    ▲
    │
Container B
```

**Hafalan:**

```text
Container bisa dihapus
Volume tetap ada
```

---

# 17. Backup Volume

Volume dapat di-backup menggunakan container sementara.

Misalnya volume:

```text
app-data
```

Backup ke host:

```bash
docker run --rm \
  -v app-data:/data:ro \
  -v "$PWD:/backup" \
  alpine \
  tar czf /backup/app-data.tar.gz -C /data .
```

Penjelasan:

```text
-v app-data:/data:ro
```

Volume dipasang ke:

```text
/data
```

Lalu:

```text
-v "$PWD:/backup"
```

Folder current directory host dipasang ke:

```text
/backup
```

Command:

```bash
tar czf /backup/app-data.tar.gz -C /data .
```

Artinya:

```text
/data
  │
  │ tar
  ▼
/backup/app-data.tar.gz
```

Cek file:

```bash
ls -lh app-data.tar.gz
```

**Hafalan:**

```text
Volume → tar.gz → host
```

> Backup yang baik juga perlu diuji dengan proses restore. File backup yang berhasil dibuat belum tentu berarti proses pemulihan sudah tervalidasi.

---

# 18. Restore Volume

Misalnya sudah memiliki:

```text
app-data.tar.gz
```

Buat volume baru:

```bash
docker volume create restored-data
```

Restore:

```bash
docker run --rm \
  -v restored-data:/data \
  -v "$PWD:/backup" \
  alpine \
  sh -c 'tar xzf /backup/app-data.tar.gz -C /data'
```

Cek volume:

```bash
docker run --rm \
  -v restored-data:/data:ro \
  alpine \
  ls -la /data
```

Diagram:

```text
app-data.tar.gz
      │
      │ tar extract
      ▼
restored-data
      │
      ▼
Container baru
```

Restore ke container:

```bash
docker run -d \
  --name restored-app \
  -v restored-data:/data \
  nginx
```

**Hafalan:**

```text
Backup  → tar czf
Restore → tar xzf
```

---

# 19. Docker Network

Docker network digunakan untuk menghubungkan container.

Lihat network:

```bash
docker network ls
```

Default network biasanya mencakup:

```text
bridge
host
none
```

Buat network:

```bash
docker network create app-net
```

Inspect:

```bash
docker network inspect app-net
```

Hapus:

```bash
docker network rm app-net
```

Diagram:

```text
app-net
  │
  ├── web
  │
  ├── api
  │
  └── db
```

## Jalankan container di network

```bash
docker run -d \
  --name web \
  --network app-net \
  nginx
```

Container lain:

```bash
docker run -d \
  --name api \
  --network app-net \
  nginx
```

**Hafalan:**

```text
Network = jalur komunikasi antar container
```

---

# 20. Container Network

Container yang berada pada user-defined bridge network dapat berkomunikasi menggunakan nama container sebagai hostname.

Buat network:

```bash
docker network create app-net
```

Jalankan server:

```bash
docker run -d \
  --name web \
  --network app-net \
  nginx
```

Jalankan client:

```bash
docker run --rm \
  --network app-net \
  alpine \
  wget -qO- http://web
```

Hasilnya adalah response HTML dari Nginx.

Diagram:

```text
Client Container
      │
      │ http://web
      ▼
app-net
      │
      ▼
web Container
```

## Connect container ke network

```bash
docker network connect app-net web
```

## Disconnect

```bash
docker network disconnect app-net web
```

## Lihat network container

```bash
docker inspect web
```

Atau:

```bash
docker network inspect app-net
```

## Host vs container port

Jika API container mendengarkan:

```text
3000
```

Container lain pada network yang sama dapat mengakses:

```text
http://api:3000
```

Tidak perlu publish port ke host hanya agar container lain di network yang sama dapat berkomunikasi.

```text
Container → Container
api:3000

Host → Container
localhost:8080 → container:3000
```

**Hafalan:**

```text
antar-container → nama container:port
host ke container → localhost:host-port
```

---

# 21. Inspect

`docker inspect` digunakan untuk melihat informasi detail object Docker.

## Inspect container

```bash
docker inspect web
```

Informasi dapat mencakup:

```text
ID
Name
Image
State
Network
Mounts
Environment
Port bindings
```

## Inspect image

```bash
docker image inspect nginx
```

## Inspect volume

```bash
docker volume inspect app-data
```

## Inspect network

```bash
docker network inspect app-net
```

## Format output tertentu

Docker menggunakan JSON sebagai format data inspect.

Contoh mengambil IP:

```bash
docker inspect \
  -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' \
  web
```

Contoh mengambil status:

```bash
docker inspect \
  -f '{{.State.Status}}' \
  web
```

Contoh mengambil nama image:

```bash
docker inspect \
  -f '{{.Config.Image}}' \
  web
```

Diagram:

```text
Docker Object
     │
     ▼
docker inspect
     │
     ├── Config
     ├── State
     ├── Network
     └── Mounts
```

**Hafalan:**

```text
inspect = lihat detail internal object Docker
```

---

# 22. Prune

`prune` digunakan untuk membersihkan object Docker yang tidak digunakan.

## Container yang stopped

```bash
docker container prune
```

Docker akan meminta konfirmasi.

## Image yang tidak digunakan

```bash
docker image prune
```

Lebih agresif:

```bash
docker image prune -a
```

## Network yang tidak digunakan

```bash
docker network prune
```

## Volume yang tidak digunakan

```bash
docker volume prune
```

## Semua resource yang tidak digunakan

```bash
docker system prune
```

Lebih agresif:

```bash
docker system prune -a
```

Untuk volume juga:

```bash
docker system prune -a --volumes
```

Perhatikan bahwa command prune dapat menghapus data yang tidak sedang digunakan.

Cek penggunaan disk sebelum membersihkan:

```bash
docker system df
```

Diagram:

```text
Docker Host
│
├── used objects
│
└── unused objects
        │
        ▼
      prune
        │
        ▼
      deleted
```

**Hafalan:**

```text
prune = bersihkan yang tidak digunakan
```

> Hati-hati dengan `docker system prune -a --volumes`. Jangan menjalankannya pada environment penting tanpa memahami object apa yang akan dihapus.

---

# 23. Peta Ingatan Cepat

## A. Konsep utama

```text
Docker
│
├── Registry
│     └── tempat image
│
├── Image
│     └── template
│
├── Container
│     └── instance image
│
├── Volume
│     └── persistent data
│
└── Network
      └── komunikasi
```

---

## B. Image

```text
docker pull
docker images
docker image ls
docker image inspect
docker image rm
docker tag
docker push
```

Hafalan:

```text
pull → ambil
push → kirim
tag  → beri nama
rm   → hapus
```

---

## C. Container

```text
docker run
docker ps
docker ps -a
docker start
docker stop
docker restart
docker rm
docker rename
```

Hafalan:

```text
run → buat + jalan
start → jalan
stop → berhenti
rm → hapus
```

---

## D. Debugging

```text
docker logs
docker exec
docker inspect
docker stats
```

Hafalan:

```text
logs    → lihat output
exec    → masuk/jalankan command
inspect → lihat detail
stats   → lihat resource
```

---

## E. Storage

```text
Bind Mount
Host path ↔ Container path

Volume
Docker-managed storage
```

Backup:

```text
volume → tar.gz
```

Restore:

```text
tar.gz → volume
```

---

## F. Network

```text
docker network ls
docker network create
docker network inspect
docker network connect
docker network disconnect
docker network rm
```

Komunikasi:

```text
container → container
http://nama-container:port
```

---

## G. Resource

```text
docker stats
```

Limit:

```text
--memory
--cpus
```

---

## H. Cleanup

```text
docker container prune
docker image prune
docker network prune
docker volume prune
docker system prune
```

Hafalan:

```text
prune = hapus object yang tidak digunakan
```

---

# 24. Tabel Ringkasan

| Materi | Fungsi | Kata Kunci |
| --- | --- | --- |
| Pengenalan Container | Mengenal container | isolated environment |
| Pengenalan Docker | Memahami Docker | image, container |
| Arsitektur Docker | Memahami komponen Docker | CLI, daemon, registry |
| Menginstall Docker | Menyiapkan Docker | `docker --version` |
| Docker Registry | Menyimpan/distribusi image | `pull`, `push`, `login` |
| Docker Image | Template container | `docker image` |
| Docker Container | Instance image | `run`, `ps`, `stop`, `rm` |
| Container Log | Melihat output aplikasi | `docker logs` |
| Container Exec | Menjalankan command | `docker exec` |
| Container Port | Mapping port | `-p host:container` |
| Environment Variable | Mengirim konfigurasi | `-e`, `--env-file` |
| Container Stats | Monitor resource | `docker stats` |
| Resource Limit | Membatasi resource | `--memory`, `--cpus` |
| Bind Mounts | Mount path host | `-v host:container` |
| Docker Volume | Storage Docker | `docker volume` |
| Container Volume | Memakai volume di container | `-v volume:path` |
| Backup Volume | Backup volume | `tar czf` |
| Restore Volume | Restore volume | `tar xzf` |
| Docker Network | Mengelola jaringan | `docker network` |
| Container Network | Komunikasi antar container | `--network` |
| Inspect | Melihat detail object | `docker inspect` |
| Prune | Membersihkan object | `docker * prune` |

---

# 25. Mini Project

## Web + API + Volume + Network

Project ini menggabungkan:

```text
container
image
port
environment variable
volume
network
logs
exec
inspect
```

Buat network:

```bash
docker network create app-net
```

Buat volume:

```bash
docker volume create app-data
```

Jalankan web:

```bash
docker run -d \
  --name web \
  --network app-net \
  -p 8080:80 \
  nginx
```

Jalankan container data:

```bash
docker run -d \
  --name app \
  --network app-net \
  -e APP_ENV=development \
  -v app-data:/data \
  nginx
```

Diagram:

```text
                         Host
                          │
                   localhost:8080
                          │
                          ▼
                    ┌───────────┐
                    │    web    │
                    │  nginx    │
                    └─────┬─────┘
                          │
                       app-net
                          │
                    ┌─────▼─────┐
                    │    app    │
                    │  nginx    │
                    └─────┬─────┘
                          │
                          ▼
                     app-data
                       volume
```

Cek:

```bash
docker ps
```

Lihat log:

```bash
docker logs web
```

Masuk container:

```bash
docker exec -it web sh
```

Cek environment:

```bash
docker exec app printenv APP_ENV
```

Output:

```text
development
```

Cek volume:

```bash
docker volume inspect app-data
```

Cek network:

```bash
docker network inspect app-net
```

Cek resource:

```bash
docker stats --no-stream
```

Cek detail:

```bash
docker inspect web
```

Cleanup:

```bash
docker rm -f web app
docker network rm app-net
docker volume rm app-data
```

---

# 26. Cheat Code Docker 10 Detik

> **Container adalah instance dari image. `docker run` membuat dan menjalankan container, `docker ps` melihat container, `docker stop` menghentikan, dan `docker rm` menghapus. `docker pull` mengambil image dari registry, sedangkan `docker push` mengirim image. `docker logs` melihat output, `docker exec -it` menjalankan shell/command di container, `-p host:container` mem-publish port, `-e` mengirim environment variable, `docker stats` memonitor resource, `--memory` dan `--cpus` membatasi resource. Bind mount memakai path host, sedangkan volume dikelola Docker. Network menghubungkan container, `docker inspect` melihat detail, dan `prune` membersihkan object yang tidak digunakan.**

---

# 27. Referensi Resmi

- **Docker Documentation**  
  https://docs.docker.com/

- **Docker Engine**  
  https://docs.docker.com/engine/

- **Docker CLI Reference**  
  https://docs.docker.com/reference/cli/docker/

- **Docker Run Reference**  
  https://docs.docker.com/reference/cli/docker/container/run/

- **Docker Image Reference**  
  https://docs.docker.com/reference/cli/docker/image/

- **Docker Container Reference**  
  https://docs.docker.com/reference/cli/docker/container/

- **Docker Volume Reference**  
  https://docs.docker.com/reference/cli/docker/volume/

- **Docker Network Reference**  
  https://docs.docker.com/reference/cli/docker/network/

- **Docker Storage**  
  https://docs.docker.com/engine/storage/

- **Docker Networking**  
  https://docs.docker.com/engine/network/

- **Docker Registry**  
  https://docs.docker.com/docker-hub/

> **Catatan versi:** Cheatsheet ini menggunakan Docker CLI modern dan berfokus pada konsep dasar yang umum digunakan. Detail default, opsi command, dan cara instalasi dapat berubah antar versi Docker dan sistem operasi, jadi gunakan dokumentasi resmi Docker sebagai rujukan ketika menjalankan command di environment nyata.
