---
title: "NGINX Dasar"
description: "Fundamental web server NGINX: Architecture, Directives (main, events, http, server, location), Static file serving, MIME types, Logging, dan Virtual Hosts."
order: 1
tags:
  - devops
  - nginx
  - web-server
  - fundamental
---

# NGINX Dasar

> **Target:** Pemula yang ingin menguasai **Web Server NGINX 1.24+ / 1.26+ (Arsitektur Event-Driven Asynchronous, Master & Worker Processes, CLI `nginx -t` & `nginx -s reload`, Hierarki Context `main`/`events`/`http`/`server`/`location`, Server Blocks Virtual Hosts Multi-Domain, Serving Static Files `root` vs `alias`, SPA Client Routing `try_files`, Location Matching Priority Rules `=`/`^~`/`~`/`~*`, Custom Error Pages, Logging `access_log`/`error_log`, IP Access Control, dan Variabel Bawaan NGINX)**.
>
> Fokus cheatsheet ini: **mental model Event-Driven vs Process-Based → Master & Worker Processes → CLI Syntax Testing & Zero-Downtime Reload → Anatomi `nginx.conf` & Context Hierarchies → `conf.d/` vs `sites-available/` → Direktif HTTP Core → Server Blocks (Virtual Hosts) → Serving Static Files (`root` vs `alias`) → SPA Vue/React Routing (`try_files`) → Location Priority Flowchart → Regex Matching → Custom Error Pages & Internal Locations → Logging & Format → Access Control `allow`/`deny` → Headers & 301 Redirects → Upload Limits → Variabel Bawaan → mini project Multi-Site Static & SPA Web Server**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: Arsitektur Event-Driven, CLI (nginx -t / reload), Context Hierarki, Server Blocks, dan Serving Static Files

🟡 Lanjutan
→ pelajari setelah Server Block lancar: SPA Routing (try_files), Location Matching Priorities, Custom Error Pages, dan Logging

🔴 Advanced / Operasional
→ penting untuk konfigurasi production: Custom Response Headers, HTTP Redirect 301, Upload Limits, dan Variabel Sistem NGINX
```

Mental model alur evaluasi pencocokan rute (*Location Matching Pipeline*) di NGINX Engine:

```text
                     HTTP REQUEST MASUK (URI: /images/logo.png)
                                      │
                                      ▼
                      1. DIRECTIVE EXACT MATCH (=)
            Apakah ada 'location = /images/logo.png'?
             ├── YA  ──> Eksekusi & STOP PENCARIAN! ✅
             └── TIDAK
                  │
                  ▼
              2. PREFIX MATCH PRIORITAS (^~)
            Apakah ada 'location ^~ /images/'?
             ├── YA  ──> Eksekusi & STOP PENCARIAN (Bypass Regex)! ✅
             └── TIDAK
                  │
                  ▼
              3. REGULAR EXPRESSION MATCH (~ / ~*)
            Apakah ada regex cocok (misal: 'location ~* \.(png|jpg)$')?
             ├── YA  ──> Eksekusi Regex Pertama yang Cocok & STOP! ✅
             └── TIDAK
                  │
                  ▼
              4. LONGEST STANDARD PREFIX MATCH (/)
            Eksekusi prefix standar terpanjang (misal: 'location /') ✅
```

**Hafalan:**

```text
Event-Driven Architecture → arsitektur non-blocking asynchronous yang memungkinkan 1 worker menangani ribuan koneksi konkuren
Master Process            → proses utama NGINX yang membaca konfigurasi, mengikat port, dan mengontrol worker processes
Worker Process            → proses anak NGINX yang mengeksekusi koneksi jaringan, pembacaan disk, dan pemrosesan HTTP
nginx -t                  → perintah wajib untuk menguji keabsahan sintaks seluruh file konfigurasi sebelum di-reload
nginx -s reload           → memuat ulang konfigurasi baru tanpa memutus koneksi aktif pengguna (Zero Downtime)
Server Block              → blok konfigurasi virtual host penampung pengaturan domain (server_name) dan port (listen)
root vs alias             → root menggabungkan path direktori + URI; alias menggantikan path location dengan direktori target
try_files                 → direktif pemeriksa keberadaan file fisik di disk sebelum melempar fallback ke /index.html (SPA)
location = /uri           → exact match: pencocokan URL identik dengan prioritas mutlak tertinggi
location ^~ /uri          → preferential prefix: pencocokan awalan rute yang langsung mem-bypass evaluasi regular expression
location ~* regex         → regular expression match case-insensitive (tidak membedakan huruf besar/kecil)
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan NGINX & Mental Model Arsitektur Event-Driven Non-Blocking](#bagian-1)
2. [Struktur Proses NGINX: Master Process vs Worker Processes](#bagian-2)
3. [Manajemen Perintah CLI NGINX & Service Control](#bagian-3)
4. [Anatomi Berkas `nginx.conf` & Konsep Hierarki Context](#bagian-4)
5. [Struktur Organisasi File Konfigurasi di Server Linux](#bagian-5)
6. [Direktif Inti Context HTTP](#bagian-6)
7. [Server Blocks Dasar (Virtual Hosts)](#bagian-7)
8. [Multi-Domain, Subdomain & Catch-All Server Block](#bagian-8)

### 🟡 Lanjutan

9. [Serving File Statis: Perbedaan Krusial `root` vs `alias`](#bagian-9)
10. [Konfigurasi Single Page Application (SPA Vue/React/Nuxt)](#bagian-10)
11. [Klausul `location`: Urutan Prioritas & Aturan Pencocokan URL](#bagian-11)
12. [Location Modifier 1: Exact Match (`=`) & Prefix Prioritas (`^~`)](#bagian-12)
13. [Location Modifier 2: Regular Expression (`~` vs `~*`)](#bagian-13)
14. [Custom Error Pages](#bagian-14)
15. [Konfigurasi Logging: Access Log & Error Log](#bagian-15)
16. [Pembatasan Akses IP Dasar (Access Control)](#bagian-16)

### 🔴 Advanced / Operasional

17. [Menambahkan Custom Response Headers](#bagian-17)
18. [HTTP Redirects: `return` vs `rewrite`](#bagian-18)
19. [Handling File Upload & Ukuran Request Body](#bagian-19)
20. [Daftar Variabel Bawaan Inti NGINX](#bagian-20)

### 🛠️ Referensi & Praktik

21. [Peta Ingatan Cepat](#bagian-21)
22. [Tabel Ringkasan](#bagian-22)
23. [Cheat Code NGINX Dasar 10 Detik](#bagian-23)
24. [Urutan Belajar yang Disarankan](#bagian-24)
25. [Mini Project: Production-Ready Multi-Site Static & SPA Web Server Configuration with Custom Errors, Static Asset Caching, and Secure IP Restrictions](#bagian-25)
26. [Referensi Resmi](#bagian-26)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan NGINX & Mental Model Arsitektur Event-Driven Non-Blocking

#### Konsep

Pada web server tradisional (seperti Apache versi lama / *prefork*):
- Setiap koneksi browser baru akan membuat **1 thread / proses baru di sistem operasi**.
- Ketika ada 10.000 pengunjung bersamaan, server membutuhkan 10.000 thread $\rightarrow$ RAM server langsung habis karena overhead *Context Switching* CPU (**The C10K Problem**).

**Solusi NGINX: Event-Driven & Asynchronous Non-Blocking**:
- NGINX hanya menjalankan sedikit proses worker (biasanya 1 worker per core CPU).
- Setiap worker menggunakan **Event Loop berbasis kernel (`epoll` di Linux / `kqueue` di BSD)**.
- **Satu worker process sanggup menangani puluhan ribu koneksi sekaligus** dengan konsumsi RAM yang sangat kecil (~beberapa puluh Megabyte).

#### Cara Kerja

```text
Apache Prefork (Thread-Based):
10.000 Koneksi ──> 10.000 Process Thread di OS ──> RAM Habis & Server Hang ❌

NGINX (Event-Driven Non-Blocking):
10.000 Koneksi ──> 1 Worker Process (Event Loop epoll) ──> RAM Hanya ~30MB & CPU Ringan ✅
```

**Hafalan:**

```text
Event-Driven Architecture → arsitektur non-blocking asynchronous yang memungkinkan 1 worker menangani ribuan koneksi konkuren
```

---

<a id="bagian-2"></a>

## 2. 🟢 Struktur Proses NGINX: Master Process vs Worker Processes

#### Konsep

NGINX beroperasi menggunakan **Two-Tier Process Architecture**:

1. **Master Process (Berjalan sebagai `root`):**
   - Bertanggung jawab membaca dan memvalidasi berkas konfigurasi.
   - Mengikat port jaringan *privileged* (seperti port 80 dan 443).
   - Mengontrol siklus hidup, spawning, dan reload worker processes tanpa menghentikan layanan.
2. **Worker Processes (Berjalan sebagai user unprivileged `nginx` atau `www-data`):**
   - Melakukan pekerjaan nyata: menerima koneksi TCP, membaca file dari disk, dan mengirimkan respons HTTP ke browser.

#### Contoh Melihat Proses di Terminal Linux

```bash
ps aux | grep nginx
```

#### Output

```text
root       1234  0.0  0.1  25400  4200 ?  Ss   20:00   0:00 nginx: master process /usr/sbin/nginx
www-data   1235  0.0  0.2  26100  8400 ?  S    20:00   0:00 nginx: worker process
www-data   1236  0.0  0.2  26100  8400 ?  S    20:00   0:00 nginx: worker process
```

**Hafalan:**

```text
Master Process → mengelola konfigurasi dan worker | Worker Process → melayani request client di network
```

---

<a id="bagian-3"></a>

## 3. 🟢 Manajemen Perintah CLI NGINX & Service Control

#### Konsep

Perintah baris perintah resmi NGINX:

| Perintah CLI | Fungsi & Karakteristik |
|---|---|
| **`nginx -t`** | **WAJIB:** Menguji keabsahan sintaks seluruh file konfigurasi (*Test Config*). |
| **`nginx -s reload`** | Memuat konfigurasi baru **tanpa memutus koneksi aktif** (*Zero-Downtime Graceful Reload*). |
| **`nginx -s stop`** | Menghentikan proses NGINX seketika (*Fast Shutdown*). |
| **`nginx -s quit`** | Menghentikan NGINX setelah seluruh request selesai (*Graceful Shutdown*). |
| **`nginx -v` / `nginx -V`** | Melihat versi NGINX dan daftar modul yang ter-compile. |

Service Manager Linux (Systemd):
```bash
sudo systemctl status nginx     # Cek status aktif
sudo systemctl restart nginx    # Restart total
sudo systemctl enable nginx     # Auto-start saat server reboot
```

**Hafalan:**

```text
nginx -t && nginx -s reload → rumus wajib: uji sintaks terlebih dahulu, baru reload konfigurasi
```

---

<a id="bagian-4"></a>

## 4. 🟢 Anatomi Berkas `nginx.conf` & Konsep Hierarki Context

#### Konsep

Konfigurasi NGINX disusun secara modular di dalam **Contexts (Blok Berkurung Kurawal `{}`)**:

1. **`main` (Global):** Konfigurasi tingkat sistem di luar kurung kurawal (user, worker process, PID).
2. **`events`:** Konfigurasi koneksi jaringan per worker (`worker_connections`).
3. **`http`:** Konfigurasi protokol web HTTP global (MIME types, caching, logging, compression).
4. **`server`:** Konfigurasi Virtual Host untuk satu domain/IP tertentu.
5. **`location`:** Konfigurasi perutean URL path spesifik di dalam suatu server.

#### Contoh Berkas `nginx.conf`

```nginx
# [1] Main Context (Global)
user www-data;
worker_processes auto;
pid /run/nginx.pid;

# [2] Events Context
events {
    worker_connections 1024;
}

# [3] HTTP Context
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    sendfile on;

    # 4. Server Context (Virtual Host)
    server {
        listen 80;
        server_name localhost;

        # 5. Location Context (URL Path)
        location / {
            root /usr/share/nginx/html;
            index index.html;
        }
    }
}
```

**Hafalan:**

```text
main -> events -> http -> server -> location (urutan hierarki context NGINX dari luar ke dalam)
```

---

<a id="bagian-5"></a>

## 5. 🟢 Struktur Organisasi File Konfigurasi di Server Linux

#### Konsep

Dalam implementasi server produksi, jangan menumpuk seluruh domain di satu file `nginx.conf`.

Dua Standar Organisasi File:
1. **Pola Modern / RedHat / Docker (`/etc/nginx/conf.d/*.conf`):**
   - Setiap domain memiliki file sendiri (misal: `/etc/nginx/conf.d/toko.conf`).
   - Otomatis di-load via direktif `include /etc/nginx/conf.d/*.conf;`.
2. **Pola Debian / Ubuntu (`sites-available/` & `sites-enabled/`):**
   - File dibuat di `sites-available/` dan diaktifkan via Symlink ke `sites-enabled/`.

**Hafalan:**

```text
include /etc/nginx/conf.d/*.conf; → memuat seluruh file server block secara modular dan terpisah
```

---

<a id="bagian-6"></a>

## 6. 🟢 Direktif Inti Context HTTP

#### Konsep

Direktif penting yang wajib ada di dalam blok `http {}`:
- **`include mime.types;`:** Memetakan ekstensi file (`.css`, `.js`, `.png`) ke HTTP Content-Type yang tepat.
- **`default_type application/octet-stream;`:** Content-Type fallback untuk file biner tidak dikenal.
- **`sendfile on;`:** Mengaktifkan transfer file langsung dari Disk ke Network Socket di level Kernel Linux (**Zero-Copy Transfer**).
- **`tcp_nopush on;`:** Mengirimkan paket HTTP header dan isi file dalam 1 paket TCP utuh.
- **`keepalive_timeout 65;`:** Durasi koneksi TCP tetap terbuka untuk request berulang.

**Hafalan:**

```text
sendfile on; tcp_nopush on; → optimasi transfer file statis berkecepatan tinggi langsung di level kernel OS
```

---

<a id="bagian-7"></a>

## 7. 🟢 Server Blocks Dasar (Virtual Hosts)

#### Konsep

**Server Block** adalah unit konfigurasi yang mendefinisikan satu website / domain.

Direktif Kunci:
- **`listen 80;`:** Port TCP tempat NGINX menerima request.
- **`server_name domain.com www.domain.com;`:** Domain yang dicocokkan dengan HTTP Header `Host`.

#### Contoh

```nginx
server {
    listen 80;
    server_name tokokita.com www.tokokita.com;

    root /var/www/tokokita/public;
    index index.html index.htm;
}
```

**Hafalan:**

```text
server { listen 80; server_name example.com; root /var/www/html; } → deklarasi virtual host standar
```

---

<a id="bagian-8"></a>

## 8. 🟢 Multi-Domain, Subdomain & Catch-All Server Block

#### Konsep

1. **Subdomain:** `server_name api.example.com admin.example.com;`
2. **Wildcard Subdomain:** `server_name *.example.com;`
3. **Catch-All Default Server (`server_name _;`):** Menangani request yang mengakses IP langsung atau domain yang tidak terdaftar.

#### Contoh

```nginx
# Server Block Catch-All (Tolak akses via IP mentah tanpa domain)
server {
    listen 80 default_server;
    server_name _;
    return 444; # Kode NGINX khusus: Tutup koneksi seketika tanpa respon
}
```

**Hafalan:**

```text
server_name _ default_server; → menangkap seluruh trafik yang tidak memiliki domain terdaftar
```

---

<a id="bagian-9"></a>

## 9. 🟡 Serving File Statis: Perbedaan Krusial `root` vs `alias`

#### Konsep

Perbedaan yang paling sering membingungkan developer:

| Direktif | Rumus Penentuan Lokasi File di Disk | Contoh Kasus |
|---|---|---|
| **`root /path/to/dir;`** | **`root + URI Lengkap`** | Request `/images/logo.png` $\rightarrow$ dicari di `/var/www/html/images/logo.png` |
| **`alias /path/to/dir/;`** | **`alias saja (Membuang location path)`** | Request `/static/logo.png` $\rightarrow$ dicari di `/var/www/assets/logo.png` |

> [!WARNING]
> Saat menggunakan `alias`, selalu akhiri path dengan garis miring `/` jika location-nya diakhiri `/`!

#### Contoh

```nginx
# [1] Menggunakan root
location /media/ {
    root /var/www/storage; 
    # File dicari di: /var/www/storage/media/file.jpg
}

# [2] Menggunakan alias
location /download/ {
    alias /var/www/public_files/; 
    # File dicari di: /var/www/public_files/file.jpg (/download/ dibuang!)
}
```

**Hafalan:**

```text
root  → path_disk = root + uri
alias → path_disk = alias + sisa_uri_setelah_location
```

---

<a id="bagian-10"></a>

## 10. 🟡 Konfigurasi Single Page Application (SPA Vue/React/Nuxt)

#### Konsep

Pada aplikasi SPA (React Router, Vue Router), rute seperti `/dashboard` atau `/products/123` **bukanlah file fisik di disk server**, melainkan rute virtual JavaScript di browser.

Jika user me-refresh halaman `/dashboard`, NGINX akan mencari file `/var/www/html/dashboard` $\rightarrow$ Tidak ada $\rightarrow$ Menghasilkan **Error 404 Not Found**.

**Solusi: Direktif `try_files`**:
`try_files $uri $uri/ /index.html;`
1. Cek apakah ada file fisik persis `$uri`.
2. Jika tidak ada, cek apakah ada folder `$uri/`.
3. Jika tidak ada, **kembalikan file `/index.html`** agar router JavaScript di browser yang menangani rute tersebut!

#### Contoh

```nginx
server {
    listen 80;
    server_name app.tokokita.com;
    root /var/www/spa-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Hafalan:**

```text
try_files $uri $uri/ /index.html; → solusi wajib NGINX untuk routing SPA React / Vue agar tidak error 404 saat refresh
```

---

<a id="bagian-11"></a>

## 11. 🟡 Klausul `location`: Urutan Prioritas & Aturan Pencocokan URL

#### Konsep

NGINX **tidak mengevaluasi blok `location` berdasarkan urutan baris atas ke bawah**, melainkan berdasarkan **Tingkat Prioritas Modifier**:

| Prioritas | Modifier | Deskripsi & Makna | Contoh |
|---|---|---|---|
| **1 (Tertinggi)** | **`=`** | **Exact Match:** URL harus identik 100%. | `location = /favicon.ico` |
| **2** | **`^~`** | **Preferential Prefix:** Awalan cocok $\rightarrow$ Langsung eksekusi dan **Bypass Regex**. | `location ^~ /images/` |
| **3** | **`~`** | **Regex Case-Sensitive:** Ekspresi reguler peka huruf besar/kecil. | `location ~ \.php$` |
| **3** | **`~*`** | **Regex Case-Insensitive:** Ekspresi reguler bebas huruf besar/kecil. | `location ~* \.(jpg\|png)$` |
| **4 (Terendah)** | *(None)* | **Generic Prefix Match:** Pencocokan awalan rute standar terpanjang. | `location /` |

**Hafalan:**

```text
= (Exact) > ^~ (Prefix Prioritas) > ~ / ~* (Regex) > / (Prefix Biasa)
```

---

<a id="bagian-12"></a>

## 12. 🟡 Location Modifier 1: Exact Match (`=`) & Prefix Prioritas (`^~`)

#### Konsep

1. **Exact Match (`=`):**
   - Sangat cepat karena NGINX langsung berhenti mencari jika URL cocok persis.
   - Ideal untuk `/favicon.ico` atau `/robots.txt`.
2. **Preferential Prefix (`^~`):**
   - Jika awalan URL cocok, NGINX **tidak akan memeriksa blok regex `~` atau `~*` di bawahnya**.
   - Ideal untuk folder aset statis `/assets/` atau `/static/`.

#### Contoh

```nginx
# [1] Exact Match untuk Favicon
location = /favicon.ico {
    log_not_found off;
    access_log off;
}

# [2] Prefix Prioritas: Langsung sajikan folder images tanpa cek regex PHP
location ^~ /images/ {
    root /var/www/media;
    expires 30d;
}
```

**Hafalan:**

```text
location = /path   → exact match instan
location ^~ /path/ → prefix prioritas pembungkam evaluasi regex
```

---

<a id="bagian-13"></a>

## 13. 🟡 Location Modifier 2: Regular Expression (`~` vs `~*`)

#### Konsep

- **`~` (Regex Case-Sensitive):** Cocok untuk file PHP `.php` (bukan `.PHP`).
- **`~*` (Regex Case-Insensitive):** Sangat ideal untuk media dan aset statis (`.JPG`, `.jpg`, `.PNG`, `.png`, `.css`, `.js`).

#### Contoh

```nginx
# Menambahkan Header Caching Panjang untuk Seluruh File Gambar & Aset
location ~* \.(jpg|jpeg|png|gif|ico|webp|svg|css|js|woff2)$ {
    root /var/www/tokokita/public;
    expires 365d;
    add_header Cache-Control "public, no-transform";
    access_log off;
}
```

**Hafalan:**

```text
location ~* \.(jpg|png|css|js)$ → regex case-insensitive untuk static asset caching
```

---

<a id="bagian-14"></a>

## 14. 🟡 Custom Error Pages

#### Konsep

Gunakan direktif **`error_page`** untuk menampilkan halaman HTML ramah pengguna saat terjadi HTTP Error (404 Not Found, 500 Internal Error, 502 Bad Gateway).

Direktif **`internal;`**:
Menandai lokasi rute agar **hanya bisa diakses secara internal oleh NGINX** (pengunjung tidak bisa mengakses URL `/404.html` secara langsung).

#### Contoh

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/html;

    # Tangani Error 404 & 50x
    error_page 404 /custom_404.html;
    error_page 500 502 503 504 /custom_50x.html;

    location = /custom_404.html {
        root /var/www/errors;
        internal;
    }

    location = /custom_50x.html {
        root /var/www/errors;
        internal;
    }
}
```

**Hafalan:**

```text
error_page 404 /404.html; location = /404.html { internal; } → custom error page terproteksi
```

---

<a id="bagian-15"></a>

## 15. 🟡 Konfigurasi Logging: Access Log & Error Log

#### Konsep

1. **`access_log path [format];`:** Mencatat setiap request HTTP yang masuk (IP client, status code, response time).
2. **`error_log path [level];`:** Mencatat pesan diagnostik dan error sistem.
   - Tingkat Keparahan (*Log Levels*): `debug`, `info`, `notice`, `warn`, `error`, `crit`, `alert`, `emerg`.
3. **`log_format`:** Mendefinisikan format string log kustom di context `http`.

#### Contoh

```nginx
http {
    # Definisi Format Log dengan JSON
    log_format json_analytics escape=json
        '{"time":"$time_iso8601","ip":"$remote_addr","status":$status,'
        '"uri":"$uri","bytes":$body_bytes_sent,"ua":"$http_user_agent"}';

    server {
        listen 80;
        server_name example.com;

        access_log /var/log/nginx/example_access.log json_analytics;
        error_log /var/log/nginx/example_error.log warn;
    }
}
```

**Hafalan:**

```text
access_log /var/log/nginx/access.log; error_log /var/log/nginx/error.log warn;
```

---

<a id="bagian-16"></a>

## 16. 🟡 Pembatasan Akses IP Dasar (Access Control)

#### Konsep

Modul `ngx_http_access_module` menyediakan kontrol akses berbasis IP address atau subnet CIDR:
- **`allow ip/subnet;`** : Mengizinkan akses.
- **`deny all;`** : Menolak seluruh IP lainnya (HTTP 403 Forbidden).

Evaluasi dilakukan dari atas ke bawah.

#### Contoh

```nginx
# Kunci Halaman Administrator Hanya untuk IP Kantor / VPN
location /admin/ {
    allow 192.168.1.50;      # IP Spesifik
    allow 10.0.0.0/24;        # Subnet VPN Kantor
    deny all;                 # Tolak selain IP di atas!
}
```

**Hafalan:**

```text
allow 192.168.1.0/24; deny all; → membatasi akses endpoint hanya untuk IP atau subnet tertentu
```

---

<a id="bagian-17"></a>

## 17. 🔴 Menambahkan Custom Response Headers

#### Konsep

Direktif **`add_header Header-Name "Value" [always];`**:
Digunakan untuk menambahkan HTTP Header keamanan dan instruksi cache ke browser.

Keyword **`always`**:
Memastikan header tetap dikirim **bahkan jika respons berupa HTTP Error (404, 500)**.

#### Contoh

```nginx
# Security Headers Standar Industri
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

**Hafalan:**

```text
add_header X-Frame-Options "SAMEORIGIN" always; → menyematkan header respons HTTP kustom
```

---

<a id="bagian-18"></a>

## 18. 🔴 HTTP Redirects: `return` vs `rewrite`

#### Konsep

1. **`return code URL;` (Sangat Disarankan):**
   - Sangat cepat dan efisien. NGINX langsung menghentikan evaluasi dan mengirim status HTTP redirect (301 Permanent atau 302 Temporary).
2. **`rewrite regex replacement [flag];`:**
   - Mengubah struktur URL menggunakan Regular Expression.

#### Contoh

```nginx
# [1] Redirect HTTP ke HTTPS (301 Permanent - Best Practice)
server {
    listen 80;
    server_name tokokita.com www.tokokita.com;
    return 301 https://$host$request_uri;
}

# [2] Redirect Domain Lama ke Domain Baru
server {
    listen 80;
    server_name oldsite.com;
    return 301 https://newsite.com$request_uri;
}
```

**Hafalan:**

```text
return 301 https://$host$request_uri; → pengalihan URL permanen paling cepat dan efisien di NGINX
```

---

<a id="bagian-19"></a>

## 19. 🔴 Handling File Upload & Ukuran Request Body

#### Konsep

Secara default, NGINX membatasi ukuran body upload request sebesar **`1M` (1 Megabyte)**. Jika client mengunggah file foto/video > 1MB, NGINX akan mengembalikan error **`413 Request Entity Too Large`**.

Gunakan direktif:
- **`client_max_body_size 50M;`** (Sesuaikan batas upload).
- **`client_body_buffer_size 128k;`** (Ukuran buffer memori sebelum ditulis ke file temporary di disk).

#### Contoh

```nginx
server {
    listen 80;
    server_name upload.tokokita.com;

    # Izinkan Upload File hingga 50 Megabytes
    client_max_body_size 50M;
    client_body_buffer_size 256k;
}
```

**Hafalan:**

```text
client_max_body_size 50M; → mengatur batas maksimal ukuran payload request/upload file di NGINX
```

---

<a id="bagian-20"></a>

## 20. 🔴 Daftar Variabel Bawaan Inti NGINX

#### Konsep

NGINX menyediakan puluhan variabel bawaan untuk inspeksi request:

| Variabel | Penjelasan & Contoh Nilai |
|---|---|
| **`$host`** | Hostname domain yang diminta (`tokokita.com`). |
| **`$uri`** | Path URI yang telah dinormalisasi tanpa query string (`/products/detail`). |
| **`$request_uri`** | Path URI asli persis seperti yang dikirim browser beserta query (`/search?q=laptop`). |
| **`$args` / `$query_string`** | Parameter query string saja (`q=laptop&limit=10`). |
| **`$remote_addr`** | Alamat IP asli dari client pengunjung (`202.152.1.10`). |
| **`$scheme`** | Skema protokol yang digunakan (`http` atau `https`). |
| **`$http_user_agent`** | Header User-Agent browser client. |

**Hafalan:**

```text
$host, $uri, $request_uri, $remote_addr, $scheme, $args → variabel bawaan paling sering digunakan di NGINX
```

---

<a id="bagian-21"></a>

## 21. 🛠️ Peta Ingatan Cepat

```text
                     PETA ARSITEKTUR NGINX DASAR
                                  │
       ┌──────────────────────────┼──────────────────────────┐
       ▼                          ▼                          ▼
PROCESS & CONTEXT HIERARCHY   SERVER BLOCKS & ROUTING    LOGGING & ACCESS SECURITY
├─ Master (root) & Workers    ├─ listen 80 & server_name ├─ access_log & error_log
├─ main -> events -> http     ├─ root vs alias           ├─ allow & deny all (IP)
├─ server -> location         ├─ try_files (SPA Routing) ├─ add_header Security
└─ nginx -t & nginx -s reload └─ Location (=, ^~, ~*, /) └─ return 301 Redirects
```

---

<a id="bagian-22"></a>

## 22. 📚 Tabel Ringkasan

| Direktif / Modifier | Context | Fungsi & Karakteristik Utama |
|---|---|---|
| `worker_processes` | `main` | Jumlah proses worker NGINX (rekomendasi: `auto`) |
| `worker_connections` | `events` | Jumlah maksimal koneksi simultan per worker |
| `sendfile on` | `http/server` | Mengaktifkan transfer file disk-to-network kernel zero-copy |
| `server_name` | `server` | Menentukan domain virtual host penampung request |
| `root` | `server/location`| Menentukan direktori root penyimpanan file di disk |
| `alias` | `location` | Mengganti location path dengan path folder target |
| `try_files` | `server/location`| Mencari file fisik berurutan dan fallback ke `/index.html` |
| `location =` | `server` | Pencocokan URL identik (Exact Match prioritas #1) |
| `location ^~` | `server` | Pencocokan awalan rute yang mem-bypass regular expression |
| `location ~*` | `server` | Pencocokan URL dengan Regular Expression Case-Insensitive |
| `client_max_body_size` | `http/server` | Menentukan batas ukuran maksimal upload file HTTP |

---

<a id="bagian-23"></a>

## 23. ⚡ Cheat Code NGINX Dasar 10 Detik

```nginx
# [1] Template SPA React / Vue Server Block
server {
    listen 80;
    server_name myapp.com;
    root /var/www/myapp/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(css|js|png|jpg|webp|svg|ico)$ {
        expires 30d;
        access_log off;
    }
}

# [2] Template HTTP -> HTTPS Redirect
server {
    listen 80;
    server_name example.com;
    return 301 https://$host$request_uri;
}
```

---

<a id="bagian-24"></a>

## 24. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Pahami Arsitektur & Manajemen CLI
├── Pelajari peran Master vs Worker processes
└── Selalu uji konfigurasi via nginx -t sebelum reload via nginx -s reload
       │
       ▼
Langkah 2: Bangun Virtual Hosts & Serving Static Files
├── Definisikan server_name dan listen di server blocks
└── Pahami perbedaan krusial direktif root vs alias
       │
       ▼
Langkah 3: Kuasai Routing SPA & Prioritas Location
├── Pasang try_files $uri $uri/ /index.html untuk React/Vue Router
└── Terapkan modifier location (=, ^~, ~*) untuk optimasi aset statis
       │
       ▼
Langkah 4: Standar Produksi, Logging & Keamanan Dasar
├── Pasang Custom Error Pages 404/50x dengan internal location
└── Konfigurasi access_log, allow/deny IP, dan add_header security
       │
       ▼
Langkah 5: Siap Melangkah ke NGINX Reverse Proxy & Load Balancing!
```

---

<a id="bagian-25"></a>

## 25. 🏗️ Mini Project: Production-Ready Multi-Site Static & SPA Web Server Configuration with Custom Errors, Static Asset Caching, and Secure IP Restrictions

Berkas konfigurasi NGINX enterprise lengkap, modular, dan runnable: **Server Block Multi-Domain (Landing Page Statis & Dashboard SPA React/Vue), Routing `try_files`, Optimasi Caching Aset Statis via Regex, Custom Error Pages Terproteksi `internal`, dan Pembatasan IP pada Panel Admin**.

```nginx
# =========================================================================
# /etc/nginx/conf.d/enterprise_multisite.conf
# =========================================================================

# -------------------------------------------------------------------------
# [1] SITE 1: MARKETING LANDING PAGE STATIS (tokokita.com)
# -------------------------------------------------------------------------
server {
    listen 80;
    server_name tokokita.com www.tokokita.com;

    # Dokumen Root & File Index
    root /var/www/tokokita_marketing/public;
    index index.html index.htm;

    # Batas Ukuran Upload
    client_max_body_size 10M;

    # Logging Khusus Domain Marketing
    access_log /var/log/nginx/marketing_access.log combined;
    error_log /var/log/nginx/marketing_error.log warn;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Rute Utama
    location / {
        try_files $uri $uri/ =404;
    }

    # Optimasi Caching Aset Statis (Regex Case-Insensitive)
    location ~* \.(jpg|jpeg|png|gif|webp|svg|ico|css|js|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
        access_log off;
    }

    # Custom Error Pages
    error_page 404 /custom_404.html;
    error_page 500 502 503 504 /custom_50x.html;

    location = /custom_404.html {
        root /var/www/tokokita_marketing/errors;
        internal;
    }

    location = /custom_50x.html {
        root /var/www/tokokita_marketing/errors;
        internal;
    }
}

# -------------------------------------------------------------------------
# [2] SITE 2: DASHBOARD SPA REACT / VUE (app.tokokita.com)
# -------------------------------------------------------------------------
server {
    listen 80;
    server_name app.tokokita.com;

    root /var/www/tokokita_spa/dist;
    index index.html;

    access_log /var/log/nginx/spa_access.log combined;
    error_log /var/log/nginx/spa_error.log warn;

    # SPA Routing: Fallback ke /index.html untuk React/Vue Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proteksi Area Administrator Berbasis IP Whitelist
    location ^~ /admin/ {
        # Hanya izinkan IP Internal Kantor & VPN
        allow 192.168.1.0/24;
        allow 10.8.0.0/24;
        deny all;

        try_files $uri $uri/ /index.html;
    }

    # Aset Statis Bundle Vite / Webpack (Immutable Hash Caching 1 Tahun)
    location ^~ /assets/ {
        expires 365d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
}

# -------------------------------------------------------------------------
# [3] CATCH-ALL SERVER BLOCK (MENOLAK AKSES IP MENTAH)
# -------------------------------------------------------------------------
server {
    listen 80 default_server;
    server_name _;
    return 444; # Putus koneksi seketika tanpa overhead respons
}
```

#### Hasil Validasi Sintaks & Pengujian Terminal

```bash
sudo nginx -t
```

#### Output

```text
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

---

<a id="bagian-26"></a>

## 26. 🔗 Referensi Resmi

- [NGINX Official Documentation](https://nginx.org/en/docs/)
- [NGINX Beginner's Guide](https://nginx.org/en/docs/beginners_guide.html)
- [NGINX Core Module Directives Reference](https://nginx.org/en/docs/ngx_core_module.html)
- [NGINX HTTP Core Module Directives](https://nginx.org/en/docs/http/ngx_http_core_module.html)
