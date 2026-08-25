# Docker Dasar Cheatsheet Revised

> **Target:** pemula yang baru mengenal Docker dan container, belum
> pernah atau baru sedikit menggunakan Docker CLI.
>
> Fokus cheatsheet ini: **konsep container → arsitektur Docker →
> image → container → log/exec → port/env → resource → volume →
> network → inspect/prune → mini project**.
>
> **Batasan penting:** Docker digunakan untuk menjalankan aplikasi di
> dalam **container** yang terisolasi dan dapat dipindahkan antar
> environment. Cheatsheet ini fokus pada perintah Docker CLI yang
> paling sering digunakan, bukan Dockerfile (topik terpisah).

## Cara Belajar

``` text
🟢 Fundamental
→ wajib untuk mulai menggunakan Docker

🟡 Lanjutan
→ pelajari setelah fundamental nyaman

🔴 Advanced / Reference
→ penting ketika kebutuhan aplikasi meningkat
```

Mental model:

``` text
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

Alur paling penting:

``` text
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

**Hafalan:**

``` text
Image = template
Container = instance yang berjalan
Registry = tempat menyimpan image
```

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Container](#bagian-1)
2. [Pengenalan Docker](#bagian-2)
3. [Arsitektur Docker](#bagian-3)
4. [Menginstall Docker](#bagian-4)
5. [Docker Registry](#bagian-5)
6. [Docker Image](#bagian-6)
7. [Docker Container](#bagian-7)
8. [Container Log](#bagian-8)
9. [Container Exec](#bagian-9)
10. [Container Port](#bagian-10)
11. [Container Environment Variable](#bagian-11)

### 🟡 Lanjutan

12. [Container Stats](#bagian-12)
13. [Container Resource Limit](#bagian-13)
14. [Bind Mounts](#bagian-14)
15. [Docker Volume](#bagian-15)
16. [Container Volume](#bagian-16)
17. [Backup Volume](#bagian-17)
18. [Restore Volume](#bagian-18)
19. [Docker Network](#bagian-19)
20. [Container Network](#bagian-20)
21. [Inspect](#bagian-21)
22. [Prune](#bagian-22)

### 🔴 Advanced / Reference

23. [Peta Ingatan Cepat](#bagian-23)
24. [Tabel Ringkasan](#bagian-24)
25. [Cheat Code Docker 10 Detik](#bagian-25)
26. [Urutan Belajar yang Disarankan](#bagian-26)
27. [Mini Project](#bagian-27)
28. [Referensi Resmi](#bagian-28)

------------------------------------------------------------------------

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan Container

## Konsep

Container adalah lingkungan terisolasi untuk menjalankan aplikasi
beserta dependency yang dibutuhkan.

Berbeda dengan virtual machine, container biasanya berbagi kernel host
sehingga lebih ringan.

## Diagram

``` text
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

``` text
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

``` text
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

``` text
Container
Host
 │
 └── Container Runtime
      ├── Container
      │    └── App
      └── Container
           └── App
```

## Kunci

> Container = aplikasi + environment terisolasi.

## Best Practice

- Anggap container sebagai proses terisolasi yang ringan, bukan
  mesin virtual penuh.

------------------------------------------------------------------------

<a id="bagian-2"></a>

# 2. 🟢 Pengenalan Docker

## Konsep

Docker adalah platform untuk membangun, menjalankan, dan
mendistribusikan aplikasi menggunakan container.

## Konsep utama

``` text
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

## Contoh command

``` bash
docker run hello-world
```

Docker akan:

``` text
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

## Kunci

> Image = template, Container = instance yang berjalan, Registry =
> tempat menyimpan image.

## Best Practice

- Mulai dari `docker run` dengan image sederhana (`nginx`, `alpine`)
  untuk memahami alur image → container.

------------------------------------------------------------------------

<a id="bagian-3"></a>

# 3. 🟢 Arsitektur Docker

## Konsep

Arsitektur Docker menggunakan pola **client-server**: Docker CLI
(client) berbicara dengan Docker daemon melalui Docker API.

## Diagram

``` text
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

``` bash
docker ps
docker images
docker run nginx
```

Docker CLI mengirim request ke Docker daemon.

## Docker Daemon

Docker daemon bertugas mengelola:

``` text
container
image
network
volume
```

## Registry

Registry menyimpan image:

``` text
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

``` text
Docker Hub
```

## Alur `docker run`

``` text
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

## Kunci

> CLI → Daemon → Image/Container, dan Daemon ↔ Registry.

------------------------------------------------------------------------

<a id="bagian-4"></a>

# 4. 🟢 Menginstall Docker

## Konsep

Docker tersedia untuk Linux, macOS, dan Windows melalui
produk/distribusi Docker yang sesuai.

## Cek instalasi

``` bash
docker --version
```

Contoh:

``` text
Docker version 28.x.x
```

Cek detail daemon:

``` bash
docker info
```

Tes:

``` bash
docker run hello-world
```

Jika berhasil, Docker dapat membuat dan menjalankan container.

## Bantuan command

``` bash
docker help
docker run --help
```

## Kunci

> `docker --version` → cek versi, `docker info` → cek daemon,
> `docker help` → bantuan.

## Best Practice

- Untuk instalasi, ikuti dokumentasi Docker sesuai sistem operasi
  karena metode dan paket dapat berubah antar versi.

------------------------------------------------------------------------

<a id="bagian-5"></a>

# 5. 🟢 Docker Registry

## Konsep

Registry adalah tempat untuk menyimpan dan mendistribusikan Docker
image.

Contoh:

``` text
Docker Hub
GitHub Container Registry
Google Artifact Registry
Amazon ECR
GitLab Container Registry
Private Registry
```

## Login dan logout

``` bash
docker login
docker logout
```

## Pull image

``` bash
docker pull nginx
```

Dengan tag:

``` bash
docker pull nginx:alpine
```

## Push image

Misalnya image `username/myapp:1.0`:

``` bash
docker push username/myapp:1.0
```

## Tag image

``` bash
docker tag myapp:latest username/myapp:1.0

docker push username/myapp:1.0
```

## Diagram

``` text
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

## Kunci

> `pull` → ambil image, `push` → kirim image, `login` → autentikasi,
> `tag` → beri nama/tag image.

## Kesalahan Umum

❌ Mendorong image tanpa tag version — gunakan tag yang jelas
(`myapp:1.0`, bukan hanya `latest`).

✅ Beri tag yang deskriptif sebelum push.

------------------------------------------------------------------------

<a id="bagian-6"></a>

# 6. 🟢 Docker Image

## Konsep

Image adalah template immutable yang digunakan untuk membuat
container.

Contoh image:

``` text
nginx
mysql
redis
php
ubuntu
alpine
```

## Lihat image lokal

``` bash
docker images
```

Atau:

``` bash
docker image ls
```

Output sederhana:

``` text
REPOSITORY   TAG       IMAGE ID
nginx        latest    abc123
```

## Pull image

``` bash
docker pull nginx
docker pull nginx:1.27
```

## Menjalankan image

``` bash
docker run nginx
```

## Menghapus image

``` bash
docker image rm nginx
```

atau:

``` bash
docker rmi nginx
```

## Inspect dan tag

``` bash
docker image inspect nginx
docker tag nginx my-nginx:1.0
```

## Diagram

``` text
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

## Kunci

> Image = blueprint/template.

## Kesalahan Umum

❌ Mencoba menghapus image yang sedang dipakai container — Docker akan
menolak.

✅ Hapus/stop container dulu, baru hapus image.

------------------------------------------------------------------------

<a id="bagian-7"></a>

# 7. 🟢 Docker Container

## Konsep

Container adalah instance dari image yang dibuat dan dijalankan oleh
Docker.

## Membuat dan menjalankan

``` bash
docker run nginx
```

Biasanya container akan berjalan di foreground. Gunakan `-d` untuk
background (detached mode):

``` bash
docker run -d nginx
```

## Beri nama container

``` bash
docker run -d --name web nginx
```

## Lihat container

``` bash
docker ps      # aktif
docker ps -a   # semua
```

## Stop, start, restart

``` bash
docker stop web
docker start web
docker restart web
```

## Hapus dan rename

``` bash
docker rm web
docker rm -f web       # force, walau masih running
docker rename web web-server
```

## Diagram lifecycle

``` text
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

## Kunci

> `run` → buat + jalankan, `start` → jalankan container yang sudah
> ada, `stop` → hentikan, `restart` → stop + start, `rm` → hapus
> container.

## Best Practice

- Selalu beri nama container (`--name`) agar mudah dirujuk.

------------------------------------------------------------------------

<a id="bagian-8"></a>

# 8. 🟢 Container Log

## Konsep

Log digunakan untuk melihat output aplikasi di dalam container
(debugging).

## Contoh

``` bash
docker logs web
```

Follow log (`-f`):

``` bash
docker logs -f web
```

Batasi jumlah baris dan tambahkan timestamp:

``` bash
docker logs --tail 50 web
docker logs -t web
```

Gabungkan:

``` bash
docker logs -f --tail 50 web
```

## Diagram

``` text
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

## Kunci

> `docker logs <container>` → lihat output.

Untuk debugging cepat:

``` bash
docker logs -f --tail 100 web
```

## Best Practice

- Gunakan `-f --tail N` saat debugging agar langsung melihat baris
  terbaru secara live.

------------------------------------------------------------------------

<a id="bagian-9"></a>

# 9. 🟢 Container Exec

## Konsep

`docker exec` digunakan untuk menjalankan command di dalam container
yang sedang berjalan.

## Contoh

``` bash
docker exec web ls
```

Masuk ke shell:

``` bash
docker exec -it web bash
```

Jika image tidak memiliki `bash`, coba:

``` bash
docker exec -it web sh
```

Penjelasan:

``` text
-i → interactive
-t → pseudo-TTY
```

Di dalam container:

``` bash
pwd
ls
env
```

Keluar:

``` bash
exit
```

Menjalankan command tanpa masuk shell:

``` bash
docker exec web cat /etc/hostname
```

## Kunci

> `exec` = jalankan command ke container yang sedang running.

## Kesalahan Umum

❌ Menjalankan `docker exec` pada container yang sudah `stopped`.

✅ `docker exec` hanya bekerja pada container yang berjalan; gunakan
`docker start` dulu jika perlu.

------------------------------------------------------------------------

<a id="bagian-10"></a>

# 10. 🟢 Container Port

## Konsep

Container memiliki network namespace sendiri. Port di dalam container
tidak otomatis dapat diakses melalui host — perlu di-publish dengan
`-p`.

## Contoh

Misalnya Nginx mendengarkan di `container:80`. Expose ke host:

``` bash
docker run -d \
  --name web \
  -p 8080:80 \
  nginx
```

Artinya:

``` text
Host             Container
8080  ─────────> 80
```

Buka:

``` text
http://localhost:8080
```

## Format

``` text
-p HOST_PORT:CONTAINER_PORT
```

Contoh:

``` bash
-p 8080:80
-p 3000:3000
-p 5432:5432
```

## Bind ke localhost

``` bash
docker run -d \
  --name web \
  -p 127.0.0.1:8080:80 \
  nginx
```

Port hanya tersedia dari host lokal.

## Lihat port container

``` bash
docker port web
```

## Kunci

> `-p host:container`:

``` text
-p 8080:80
     │   │
     │   └── port container
     └────── port host
```

## Kesalahan Umum

❌ Lupa mem-publish port — container berjalan, tapi tidak bisa diakses
dari host.

✅ Gunakan `-p host:container` jika aplikasi perlu diakses dari luar
container.

------------------------------------------------------------------------

<a id="bagian-11"></a>

# 11. 🟢 Container Environment Variable

## Konsep

Environment variable digunakan untuk mengirim konfigurasi ke
container.

## Contoh

``` bash
docker run -d \
  --name app \
  -e APP_ENV=production \
  nginx
```

Lihat environment dari container:

``` bash
docker exec app env
docker exec app printenv APP_ENV
```

Output:

``` text
production
```

## Beberapa variable

``` bash
docker run -d \
  --name app \
  -e APP_ENV=production \
  -e APP_DEBUG=false \
  nginx
```

## File `.env`

Docker juga dapat membaca variable dari file menggunakan `--env-file`.

Buat `.env`:

``` text
APP_ENV=production
APP_DEBUG=false
APP_NAME=my-app
```

Jalankan:

``` bash
docker run -d \
  --name app \
  --env-file .env \
  nginx
```

## Kunci

> `-e KEY=VALUE` atau `--env-file .env`.

## Kesalahan Umum

❌ Memasukkan password/API key ke image atau repository secara
sembarangan.

✅ Untuk secret production, gunakan mekanisme secret/configuration
yang sesuai platform.

------------------------------------------------------------------------

<a id="bagian-12"></a>

# 12. 🟡 Container Stats

## Konsep

`docker stats` digunakan untuk melihat penggunaan resource container
secara real-time.

## Contoh

``` bash
docker stats
docker stats web
```

Contoh informasi:

``` text
CONTAINER
CPU %
MEM USAGE / LIMIT
MEM %
NET I/O
BLOCK I/O
PIDS
```

Sekali saja tanpa live update:

``` bash
docker stats --no-stream
```

## Diagram

``` text
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

## Kunci

> `docker stats` = monitor resource container.

## Best Practice

- Gunakan `docker stats --no-stream` di script/CI agar tidak
  menggantung pada mode live.

------------------------------------------------------------------------

<a id="bagian-13"></a>

# 13. 🟡 Container Resource Limit

## Konsep

Tanpa limit, container dapat menggunakan resource host sesuai kondisi
dan konfigurasi runtime. Batasi dengan `--memory` dan `--cpus`.

## Memory limit

``` bash
docker run -d \
  --name app \
  --memory 512m \
  nginx
```

Artinya memory container dibatasi sekitar 512 MB.

## CPU limit

``` bash
docker run -d \
  --name app \
  --cpus 1 \
  nginx
```

Container dibatasi sekitar satu CPU.

## CPU dan memory

``` bash
docker run -d \
  --name app \
  --memory 512m \
  --cpus 1 \
  nginx
```

Cek:

``` bash
docker stats app
```

Beberapa opsi umum:

``` text
--memory
--cpus
--cpu-shares
--pids-limit
```

## Kunci

> `--memory` → batas RAM, `--cpus` → batas CPU.

## Best Practice

- Nilai resource limit sebaiknya ditentukan berdasarkan kebutuhan
  aplikasi dan pengujian, bukan sekadar angka acak.

------------------------------------------------------------------------

<a id="bagian-14"></a>

# 14. 🟡 Bind Mounts

## Konsep

Bind mount menghubungkan folder/file di host langsung ke path di
container.

## Format

``` text
-v HOST_PATH:CONTAINER_PATH
```

## Contoh

``` bash
docker run -d \
  --name web \
  -p 8080:80 \
  -v "$PWD/html:/usr/share/nginx/html" \
  nginx
```

## Diagram

``` text
Host
./html
  │
  │ bind mount
  ▼
Container
/usr/share/nginx/html
```

Jika host memiliki `html/index.html`, maka container akan melihat file
`/usr/share/nginx/html/index.html`.

## Read-only

``` bash
docker run -d \
  --name web \
  -v "$PWD/html:/usr/share/nginx/html:ro" \
  nginx
```

`ro` = read-only.

## `--mount`

Bentuk yang lebih eksplisit:

``` bash
docker run -d \
  --name web \
  --mount type=bind,source="$PWD/html",target=/usr/share/nginx/html \
  nginx
```

## Kunci

> Bind mount = host folder ↔ container folder.

## Kesalahan Umum

❌ Menggunakan bind mount untuk data yang harus bertahan di server
produksi.

✅ Untuk persistent storage yang dikelola Docker, gunakan volume
(section 15).

------------------------------------------------------------------------

<a id="bagian-15"></a>

# 15. 🟡 Docker Volume

## Konsep

Docker volume adalah storage yang dikelola Docker.

## Perintah dasar

``` bash
docker volume create app-data
docker volume ls
docker volume inspect app-data
docker volume rm app-data
```

## Gunakan volume

``` bash
docker run -d \
  --name app \
  -v app-data:/data \
  nginx
```

## Diagram

``` text
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

``` bash
docker run -d \
  --name app \
  --mount type=volume,source=app-data,target=/data \
  nginx
```

## Kunci

> Volume = storage yang dikelola Docker.

## Best Practice

- Gunakan volume untuk data yang harus bertahan (database, upload,
  log), bukan bind mount ke folder host.

------------------------------------------------------------------------

<a id="bagian-16"></a>

# 16. 🟡 Container Volume

## Konsep

Istilah "container volume" biasanya merujuk pada penggunaan volume
sebagai storage container — data bertahan meski container dihapus.

## Contoh

``` bash
docker volume create app-data

docker run -d \
  --name app \
  -v app-data:/data \
  nginx
```

Tulis data:

``` bash
docker exec app sh -c 'echo "Halo Docker" > /data/hello.txt'
docker exec app cat /data/hello.txt
```

Output:

``` text
Halo Docker
```

Hapus container:

``` bash
docker rm -f app
```

Buat container baru menggunakan volume yang sama:

``` bash
docker run -d \
  --name app2 \
  -v app-data:/data \
  nginx
```

Cek:

``` bash
docker exec app2 cat /data/hello.txt
```

Output tetap:

``` text
Halo Docker
```

## Diagram

``` text
Container A
    │
    ▼
 app-data
    ▲
    │
Container B
```

## Kunci

> Container bisa dihapus, Volume tetap ada.

## Best Practice

- Pisahkan data yang perlu bertahan ke volume agar tidak hilang saat
  container dihapus.

------------------------------------------------------------------------

<a id="bagian-17"></a>

# 17. 🟡 Backup Volume

## Konsep

Volume dapat di-backup menggunakan container sementara.

## Contoh

Misalnya volume `app-data`. Backup ke host:

``` bash
docker run --rm \
  -v app-data:/data:ro \
  -v "$PWD:/backup" \
  alpine \
  tar czf /backup/app-data.tar.gz -C /data .
```

Penjelasan:

``` text
-v app-data:/data:ro
→ volume dipasang ke /data (read-only)

-v "$PWD:/backup"
→ folder current directory host dipasang ke /backup

tar czf /backup/app-data.tar.gz -C /data .
→ arsipkan isi /data ke /backup/app-data.tar.gz
```

## Diagram

``` text
/data
  │
  │ tar
  ▼
/backup/app-data.tar.gz
```

Cek file:

``` bash
ls -lh app-data.tar.gz
```

## Kunci

> Volume → tar.gz → host.

## Best Practice

- Backup yang baik juga perlu diuji dengan proses restore. File backup
  yang berhasil dibuat belum tentu berarti proses pemulihan sudah
  tervalidasi.

------------------------------------------------------------------------

<a id="bagian-18"></a>

# 18. 🟡 Restore Volume

## Konsep

Restore mengembalikan isi backup `tar.gz` ke dalam volume.

## Contoh

Misalnya sudah memiliki `app-data.tar.gz`. Buat volume baru:

``` bash
docker volume create restored-data
```

Restore:

``` bash
docker run --rm \
  -v restored-data:/data \
  -v "$PWD:/backup" \
  alpine \
  sh -c 'tar xzf /backup/app-data.tar.gz -C /data'
```

Cek volume:

``` bash
docker run --rm \
  -v restored-data:/data:ro \
  alpine \
  ls -la /data
```

## Diagram

``` text
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

``` bash
docker run -d \
  --name restored-app \
  -v restored-data:/data \
  nginx
```

## Kunci

> Backup → `tar czf`, Restore → `tar xzf`.

## Best Practice

- Selalu uji restore pada environment terpisah sebelum mengandalkannya
  di production.

------------------------------------------------------------------------

<a id="bagian-19"></a>

# 19. 🟡 Docker Network

## Konsep

Docker network digunakan untuk menghubungkan container.

## Perintah dasar

``` bash
docker network ls
docker network create app-net
docker network inspect app-net
docker network rm app-net
```

Default network biasanya mencakup:

``` text
bridge
host
none
```

## Diagram

``` text
app-net
  │
  ├── web
  │
  ├── api
  │
  └── db
```

## Jalankan container di network

``` bash
docker run -d \
  --name web \
  --network app-net \
  nginx
```

Container lain:

``` bash
docker run -d \
  --name api \
  --network app-net \
  nginx
```

## Kunci

> Network = jalur komunikasi antar container.

## Best Practice

- Buat network khusus (user-defined bridge) agar container dapat
  saling berkomunikasi dengan nama container.

------------------------------------------------------------------------

<a id="bagian-20"></a>

# 20. 🟡 Container Network

## Konsep

Container yang berada pada user-defined bridge network dapat
berkomunikasi menggunakan nama container sebagai hostname.

## Contoh

Buat network dan jalankan server:

``` bash
docker network create app-net

docker run -d \
  --name web \
  --network app-net \
  nginx
```

Jalankan client:

``` bash
docker run --rm \
  --network app-net \
  alpine \
  wget -qO- http://web
```

Hasilnya adalah response HTML dari Nginx.

## Diagram

``` text
Client Container
      │
      │ http://web
      ▼
app-net
      │
      ▼
web Container
```

## Connect dan disconnect

``` bash
docker network connect app-net web
docker network disconnect app-net web
```

## Lihat network container

``` bash
docker inspect web
docker network inspect app-net
```

## Host vs container port

``` text
Container → Container
api:3000

Host → Container
localhost:8080 → container:3000
```

Jika API container mendengarkan di `3000`, container lain pada network
yang sama dapat mengakses `http://api:3000` — tidak perlu publish port
ke host hanya agar container lain di network yang sama dapat
berkomunikasi.

## Kunci

> antar-container → `nama container:port`, host ke container →
> `localhost:host-port`.

## Kesalahan Umum

❌ Mem-publish port ke host padahal hanya container lain yang
membutuhkan akses.

✅ Container pada network yang sama cukup pakai
`http://nama-container:port`.

------------------------------------------------------------------------

<a id="bagian-21"></a>

# 21. 🟡 Inspect

## Konsep

`docker inspect` digunakan untuk melihat informasi detail object
Docker.

## Inspect container

``` bash
docker inspect web
```

Informasi dapat mencakup:

``` text
ID
Name
Image
State
Network
Mounts
Environment
Port bindings
```

## Inspect image, volume, network

``` bash
docker image inspect nginx
docker volume inspect app-data
docker network inspect app-net
```

## Format output tertentu

Docker menggunakan JSON sebagai format data inspect.

Contoh mengambil IP:

``` bash
docker inspect \
  -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' \
  web
```

Contoh mengambil status:

``` bash
docker inspect \
  -f '{{.State.Status}}' \
  web
```

Contoh mengambil nama image:

``` bash
docker inspect \
  -f '{{.Config.Image}}' \
  web
```

## Diagram

``` text
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

## Kunci

> inspect = lihat detail internal object Docker.

## Best Practice

- Gunakan `-f '{{...}}'` untuk mengambil satu field tertentu tanpa
  menampilkan seluruh JSON.

------------------------------------------------------------------------

<a id="bagian-22"></a>

# 22. 🟡 Prune

## Konsep

`prune` digunakan untuk membersihkan object Docker yang tidak
digunakan.

## Container yang stopped

``` bash
docker container prune
```

Docker akan meminta konfirmasi.

## Image yang tidak digunakan

``` bash
docker image prune
docker image prune -a
```

## Network dan volume yang tidak digunakan

``` bash
docker network prune
docker volume prune
```

## Semua resource yang tidak digunakan

``` bash
docker system prune
docker system prune -a
docker system prune -a --volumes
```

Cek penggunaan disk sebelum membersihkan:

``` bash
docker system df
```

## Diagram

``` text
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

## Kunci

> prune = bersihkan yang tidak digunakan.

## Kesalahan Umum

❌ Menjalankan `docker system prune -a --volumes` sembarangan — dapat
menghapus data volume yang tidak terpakai.

✅ Periksa dulu dengan `docker system df`, dan pahami object apa yang
akan dihapus.

------------------------------------------------------------------------

<a id="bagian-23"></a>

# 23. 🧠 Peta Ingatan Cepat

## A. Konsep utama

``` text
Docker
│
├── Registry → tempat image
├── Image    → template
├── Container→ instance image
├── Volume   → persistent data
└── Network  → komunikasi
```

## B. Image

``` text
docker pull          → ambil
docker images / ls   → lihat
docker image inspect → detail
docker image rm      → hapus
docker tag           → beri nama
docker push          → kirim
```

## C. Container

``` text
docker run     → buat + jalan
docker ps      → lihat
docker start   → jalan
docker stop    → berhenti
docker restart → stop + start
docker rm      → hapus
docker rename  → ganti nama
```

## D. Debugging

``` text
docker logs    → lihat output
docker exec    → masuk/jalankan command
docker inspect → lihat detail
docker stats   → lihat resource
```

## E. Storage

``` text
Bind Mount → host path ↔ container path
Volume     → Docker-managed storage

Backup:  volume → tar.gz
Restore: tar.gz → volume
```

## F. Network

``` text
docker network ls / create / inspect
docker network connect / disconnect / rm

Komunikasi antar container:
http://nama-container:port
```

## G. Resource

``` text
docker stats
--memory
--cpus
```

## H. Cleanup

``` text
docker container prune
docker image prune
docker network prune
docker volume prune
docker system prune
```

------------------------------------------------------------------------

<a id="bagian-24"></a>

# 24. 📚 Tabel Ringkasan

  Materi              Fungsi                            Kata Kunci
  ------------------- --------------------------------- ----------------------------
  Pengenalan Container Mengenal container               isolated environment
  Pengenalan Docker   Memahami Docker                  image, container
  Arsitektur Docker   Memahami komponen Docker         CLI, daemon, registry
  Menginstall Docker  Menyiapkan Docker                `docker --version`
  Docker Registry     Menyimpan/distribusi image       `pull`, `push`, `login`
  Docker Image        Template container               `docker image`
  Docker Container    Instance image                   `run`, `ps`, `stop`, `rm`
  Container Log       Melihat output aplikasi          `docker logs`
  Container Exec      Menjalankan command              `docker exec`
  Container Port      Mapping port                     `-p host:container`
  Environment Var     Mengirim konfigurasi             `-e`, `--env-file`
  Container Stats     Monitor resource                 `docker stats`
  Resource Limit      Membatasi resource               `--memory`, `--cpus`
  Bind Mounts         Mount path host                  `-v host:container`
  Docker Volume       Storage Docker                   `docker volume`
  Container Volume    Memakai volume di container      `-v volume:path`
  Backup Volume       Backup volume                    `tar czf`
  Restore Volume      Restore volume                   `tar xzf`
  Docker Network      Mengelola jaringan               `docker network`
  Container Network   Komunikasi antar container       `--network`
  Inspect             Melihat detail object            `docker inspect`
  Prune               Membersihkan object              `docker * prune`

------------------------------------------------------------------------

<a id="bagian-25"></a>

# 25. ⚡ Cheat Code Docker 10 Detik

``` text
docker run    → buat + jalankan container
docker ps     → lihat container
docker stop   → hentikan
docker rm     → hapus container

docker pull   → ambil image dari registry
docker push   → kirim image
docker images → lihat image

docker logs   → lihat output
docker exec -it → masuk shell container
-p host:container → publish port
-e KEY=VALUE → environment variable
docker stats → monitor resource
--memory / --cpus → batasi resource

Bind mount → -v host:container
Volume     → -v volume:path
Network    → --network, nama-container:port
docker inspect → lihat detail
prune      → bersihkan yang tidak dipakai
```

## Jalankan container

``` bash
docker run -d \
  --name web \
  -p 8080:80 \
  nginx
```

## Debugging

``` bash
docker logs -f --tail 100 web
docker exec -it web sh
```

## Volume dan network

``` bash
docker volume create app-data
docker network create app-net

docker run -d \
  --name app \
  --network app-net \
  -v app-data:/data \
  nginx
```

------------------------------------------------------------------------

<a id="bagian-26"></a>

# 26. 🧭 Urutan Belajar yang Disarankan

``` text
1. Konsep container & Docker
       ↓
2. Arsitektur Docker
       ↓
3. Docker Image
       ↓
4. Docker Container (run, ps, stop, rm)
       ↓
5. Log & Exec
       ↓
6. Port & Environment Variable
       ↓
7. Resource (stats, limit)
       ↓
8. Volume (persistent data)
       ↓
9. Network (komunikasi antar container)
       ↓
10. Inspect & Prune
        ↓
11. Mini project
```

Prinsip: kuasai alur image → container terlebih dahulu, lalu storage,
network, dan maintenance.

------------------------------------------------------------------------

<a id="bagian-27"></a>

# 27. 🏗️ Mini Project

## Web + API + Volume + Network

Project ini menggabungkan:

``` text
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

## Langkah

Buat network dan volume:

``` bash
docker network create app-net
docker volume create app-data
```

Jalankan web:

``` bash
docker run -d \
  --name web \
  --network app-net \
  -p 8080:80 \
  nginx
```

Jalankan container data:

``` bash
docker run -d \
  --name app \
  --network app-net \
  -e APP_ENV=development \
  -v app-data:/data \
  nginx
```

## Diagram

``` text
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

## Verifikasi

``` bash
docker ps

docker logs web

docker exec -it web sh

docker exec app printenv APP_ENV
```

Output:

``` text
development
```

``` bash
docker volume inspect app-data
docker network inspect app-net
docker stats --no-stream
docker inspect web
```

## Cleanup

``` bash
docker rm -f web app
docker network rm app-net
docker volume rm app-data
```

------------------------------------------------------------------------

<a id="bagian-28"></a>

# 28. 🔗 Referensi Resmi

- [Docker Documentation](https://docs.docker.com/)
- [Docker Engine](https://docs.docker.com/engine/)
- [Docker CLI Reference](https://docs.docker.com/reference/cli/docker/)
- [Docker Run Reference](https://docs.docker.com/reference/cli/docker/container/run/)
- [Docker Image Reference](https://docs.docker.com/reference/cli/docker/image/)
- [Docker Container Reference](https://docs.docker.com/reference/cli/docker/container/)
- [Docker Volume Reference](https://docs.docker.com/reference/cli/docker/volume/)
- [Docker Network Reference](https://docs.docker.com/reference/cli/docker/network/)
- [Docker Storage](https://docs.docker.com/engine/storage/)
- [Docker Networking](https://docs.docker.com/engine/network/)
- [Docker Registry](https://docs.docker.com/docker-hub/)

> **Catatan versi:** Cheatsheet ini menggunakan Docker CLI modern dan
> berfokus pada konsep dasar yang umum digunakan. Detail default, opsi
> command, dan cara instalasi dapat berubah antar versi Docker dan
> sistem operasi, jadi gunakan dokumentasi resmi Docker sebagai rujukan
> ketika menjalankan command di environment nyata.
