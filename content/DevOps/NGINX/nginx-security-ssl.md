---
title: "NGINX Security & SSL"
description: "Pengamanan & optimasi performa NGINX: SSL/TLS configuration (HTTPS, Let's Encrypt), Security headers (HSTS, CSP), Rate limiting, Gzip/Brotli compression, dan Caching."
order: 3
tags:
  - devops
  - nginx
  - security
  - ssl
  - performance
---

# NGINX Security & SSL

> **Target:** Pemula yang ingin menguasai **Hardening Keamanan Server Web NGINX 1.24+ / 1.26+ (Enkripsi HTTPS, SSL/TLS 1.2 & TLS 1.3, SSL Session Cache, Certbot Let's Encrypt, HTTP $\rightarrow$ HTTPS 301 Redirect, Strict HSTS Preload, Essential Security Headers `CSP`/`X-Frame-Options`, `server_tokens off`, Proteksi File `.env`/`.git`, Rate Limiting Leaky Bucket `limit_req_zone`, Connection Limiting `limit_conn_zone`, Kompresi Gzip & Brotli, Kernel Zero-Copy `sendfile`/`tcp_nopush`/`tcp_nodelay`, Worker Tuning, dan Audit Keamanan Skor A+ Qualys SSL Labs)**.
> **Versi:** NGINX 1.24+ / 1.26+ / OpenSSL 3.x
> **Prasyarat:** [[nginx-reverse-proxy|NGINX Reverse Proxy]]
> Fokus modul pembelajaran ini: **mental model Defense in Depth → Konfigurasi HTTPS Dasar → 301 HTTPS Redirect → TLS 1.3 & Modern Ciphers → SSL Session Caching → Certbot ACME Challenges → Strict-Transport-Security (HSTS) → Anti-Clickjacking & Anti-XSS Headers → Menyembunyikan Identitas NGINX → Memblokir File Rahasia (`.env`) → Rate Limiting Leaky Bucket (`burst`, `nodelay`, HTTP 429) → Connection Limiting (Anti-Slowloris) → Gzip & Brotli Compression → Kernel Zero-Copy File Transfer → Worker Limits & Timeouts → mini project Bank-Grade Hardened NGINX Security Gateway**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: Konfigurasi HTTPS/SSL, HTTP to HTTPS 301 Redirect, TLS 1.3 Hardening, dan Certbot Automation

🟡 Lanjutan
→ pelajari setelah SSL aktif: Strict HSTS, Essential Security Headers, Proteksi File Sensitif, dan Rate Limiting (limit_req)

🔴 Advanced / Operasional
→ penting untuk skala produksi: Kompresi Gzip/Brotli, Kernel Zero-Copy (sendfile), Worker Tuning, dan Audit Skor A+
```

Mental model alur filter keamanan berlapis (_Defense-in-Depth Pipeline_) di NGINX Gateway:

```text
                     HTTP/HTTPS REQUEST MASUK DARI INTERNET
                                       │
                                       ▼
                       1. PORT 80 REDIRECT LAYER
               Apakah request datang via HTTP Port 80?
                ├── YA  ──> Redirect 301 ke HTTPS (Port 443) Instan! 🔒
                └── TIDAK (Sudah HTTPS)
                     │
                     ▼
                       2. TLS 1.3 & SSL SESSION LAYER
               Verifikasi Sertifikat & Cipher Suite Modern
               (Resume via SSL Session Cache shared:SSL:10m)
                     │
                     ▼
                       3. SENSITIVE FILE BLOCKER LAYER
               Apakah URI meminta '/.env' atau '/.git'?
                ├── YA  ──> Blokir & Kembalikan HTTP 404/403 Seketika! 🚫
                └── TIDAK
                     │
                     ▼
                       4. LEAKY BUCKET RATE LIMITING
               Apakah IP client melebihi batas (misal: > 5 req/detik)?
                ├── YA  ──> Tolak dengan HTTP 429 Too Many Requests! ⚠️
                └── TIDAK
                     │
                     ▼
                       5. SECURITY HEADERS & GZIP COMPRESSION
               Sematkan HSTS, CSP, X-Frame-Options & Kompres Gzip/Brotli
                                       │
                                       ▼
                     TERUSKAN KE BACKEND SERVER (100% AMAN)
```

**Hafalan:**

```text
Defense in Depth      → pendekatan keamanan berlapis di level web server sebelum request menyentuh kode aplikasi backend
listen 443 ssl        → mengaktifkan port HTTPS terenkripsi SSL/TLS pada server block NGINX
ssl_protocols TLSv1.3 → membatasi protokol enkripsi hanya pada versi terbaru yang aman (TLS 1.2 dan TLS 1.3)
HSTS                  → header yang memaksa browser hanya berkomunikasi via HTTPS selama periode tertentu (misal: 1 tahun)
server_tokens off     → menyembunyikan nomor versi NGINX pada header respons dan halaman error sistem
limit_req_zone        → membuat zona memori pembatas laju request per IP client menggunakan algoritma Leaky Bucket
burst & nodelay       → mengizinkan lonjakan request singkat yang langsung diproses tanpa membuat koneksi antre
limit_conn_zone       → membatasi jumlah koneksi TCP simultan per alamat IP untuk menangkal serangan Slowloris
gzip on               → mengaktifkan kompresi data teks (HTML, CSS, JS, JSON) untuk menghemat 70% bandwidth
sendfile on           → mengaktifkan transfer file langsung dari disk ke network socket di level kernel OS (Zero-Copy)
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Keamanan & Hardening Server Web NGINX](#bagian-1)
2. [Konfigurasi HTTPS & SSL/TLS Dasar](#bagian-2)
3. [Pengalihan Otomatis HTTP ke HTTPS (301 Permanent Redirect)](#bagian-3)
4. [SSL Hardening: Protokol Aman `TLSv1.2 TLSv1.3` & Modern Cipher Suites](#bagian-4)
5. [Optimasi Kinerja SSL: SSL Session Cache & Session Tickets](#bagian-5)
6. [Integrasi Otomatis Let's Encrypt dengan Certbot](#bagian-6)

### 🟡 Lanjutan

7. [HTTP Strict Transport Security (HSTS)](#bagian-7)
8. [Security Headers Esensial: Anti-Clickjacking & Anti-XSS](#bagian-8)
9. [Menyembunyikan Versi NGINX & Header Sensitif](#bagian-9)
10. [Proteksi File Sensitif & Direktori Tersembunyi](#bagian-10)
11. [Rate Limiting Dasar dengan `limit_req_zone` (Algoritma Leaky Bucket)](#bagian-11)
12. [Parameter Rate Limiting Lanjutan: `burst=N` dan `nodelay`](#bagian-12)
13. [Connection Limiting dengan `limit_conn_zone`](#bagian-13)
14. [Kustomisasi Status HTTP & Logging Rate Limiting](#bagian-14)

### 🔴 Advanced / Operasional

15. [Kompresi HTTP Berkecepatan Tinggi dengan Gzip](#bagian-15)
16. [Kompresi Modern Brotli](#bagian-16)
17. [Optimasi Transfer File Kernel OS (Zero-Copy Transfer)](#bagian-17)
18. [Tuning Worker Processes & File Descriptors Sistem](#bagian-18)
19. [Tuning Buffer Klien & Timeouts Mitigasi Serangan DoS](#bagian-19)
20. [Audit Keamanan & Verifikasi Skor A+](#bagian-20)

### 🛠️ Referensi & Praktik

21. [Peta Ingatan Cepat](#bagian-21)
22. [Tabel Ringkasan](#bagian-22)
23. [Cheat Code NGINX Security & SSL 10 Detik](#bagian-23)
24. [Urutan Belajar yang Disarankan](#bagian-24)
25. [Mini Project: Production-Ready Bank-Grade NGINX Security Gateway with TLS 1.3, Strict HSTS, Leaky Bucket Rate Limiting, Gzip Compression, and Kernel Tuning](#bagian-25)
26. [Referensi Resmi](#bagian-26)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan Keamanan & Hardening Server Web NGINX

#### Konsep

Sebagai gerbang terdepan (_Frontend Web Server / Ingress Gateway_), NGINX adalah benteng pertama yang menghadapi jutaan botnet, web scraper, dan serangan siber di internet publik.

Prinsip **Defense in Depth**:
Jika keamanan hanya dipasang di kode aplikasi (Node.js/PHP/Java), server tetap rentan kehabisan RAM atau CPU saat diserang banjir traffic.
Dengan memasang filter keamanan di **NGINX level**:

- Request berbahaya diblokir di level gerbang jaringan sebelum sempat menyentuh memori aplikasi backend.

**Hafalan:**

```text
Defense in Depth → memfilter serangan di level web server sebelum membebani aplikasi backend
```

---

<a id="bagian-2"></a>

## 2. 🟢 Konfigurasi HTTPS & SSL/TLS Dasar

#### Konsep

Untuk mengaktifkan HTTPS, sebuah server block memerlukan:

1. Port **`listen 443 ssl;`** (dan `http2` untuk NGINX modern).
2. **`ssl_certificate`** : Path ke file public certificate chain (`fullchain.pem`).
3. **`ssl_certificate_key`** : Path ke file private key (`privkey.pem`).

#### Contoh

```nginx
server {
    listen 443 ssl http2;
    server_name tokokita.com www.tokokita.com;

    # Berkas Sertifikat SSL
    ssl_certificate /etc/ssl/certs/tokokita_fullchain.pem;
    ssl_certificate_key /etc/ssl/private/tokokita_privkey.pem;

    root /var/www/tokokita/public;
    index index.html;
}
```

**Hafalan:**

```text
listen 443 ssl; ssl_certificate /path/fullchain.pem; ssl_certificate_key /path/privkey.pem;
```

---

<a id="bagian-3"></a>

## 3. 🟢 Pengalihan Otomatis HTTP ke HTTPS (301 Permanent Redirect)

#### Konsep

Jangan biarkan pengunjung mengakses website melalui koneksi HTTP polos yang tidak terenkripsi.

Buat **Server Block Port 80 khusus** yang tugas satu-satunya adalah me-redirect seluruh request ke URL HTTPS yang setara menggunakan status **HTTP 301 Moved Permanently**.

#### Contoh

```nginx
# Server Block Port 80 (HTTP -> HTTPS Redirector)
server {
    listen 80;
    server_name tokokita.com www.tokokita.com;

    # 301 Permanent Redirect
    return 301 https://$host$request_uri;
}
```

**Hafalan:**

```text
server { listen 80; server_name domain.com; return 301 https://$host$request_uri; } → rumus redirect HTTPS wajib
```

---

<a id="bagian-4"></a>

## 4. 🟢 SSL Hardening: Protokol Aman `TLSv1.2 TLSv1.3` & Modern Cipher Suites

#### Konsep

Protokol SSL versi lama (`SSLv2`, `SSLv3`, `TLSv1.0`, `TLSv1.1`) memiliki kerentanan kriptografi fatal (seperti _POODLE_, _BEAST_, _Heartbleed_).

**Standar Hardening SSL Modern**:

- Batasi protokol hanya pada **`TLSv1.2 TLSv1.3`**.
- Gunakan Cipher Suites modern berbasis Elliptic Curve (ECDHE) dan AES-GCM / CHACHA20.

#### Contoh

```nginx
# Nonaktifkan Protokol Jadul yang Rentan
ssl_protocols TLSv1.2 TLSv1.3;

# Cipher Suites Standar Mozilla Modern / Intermediate
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256;
ssl_prefer_server_ciphers on;
```

**Hafalan:**

```text
ssl_protocols TLSv1.2 TLSv1.3; → membuang protokol usang dan hanya mengizinkan standar enkripsi terkuat
```

---

<a id="bagian-5"></a>

## 5. 🟢 Optimasi Kinerja SSL: SSL Session Cache & Session Tickets

#### Konsep

Proses negosiasi awal SSL/TLS (_TLS Handshake_) membutuhkan beberapa putaran pertukaran data (RTT) dan komputasi CPU yang berat.

Dengan mengaktifkan **SSL Session Caching**:
Ketika pengguna yang sama membuka halaman kedua atau kembali beberapa menit kemudian, sesi SSL di-_resume_ seketika **tanpa kalkulasi ulang handshake (menghemat ~100ms latency)**.

#### Contoh

```nginx
# Alokasikan 10MB RAM untuk Cache Sesi SSL (~40.000 Sesi)
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1d;

# Matikan Session Tickets untuk Keamanan Forward Secrecy yang Lebih Kuat
ssl_session_tickets off;
```

**Hafalan:**

```text
ssl_session_cache shared:SSL:10m; ssl_session_timeout 1d; → menghemat 100ms latency koneksi SSL berulang
```

---

<a id="bagian-6"></a>

## 6. 🟢 Integrasi Otomatis Let's Encrypt dengan Certbot

#### Konsep

**Let's Encrypt** menyediakan sertifikat SSL/TLS gratis yang diakui oleh seluruh browser dunia dengan masa aktif 90 hari.

**Certbot** adalah agen otomatis untuk menerbitkan dan memperbarui (_Auto-Renewal_) sertifikat via tantangan ACME HTTP-01.

#### Perintah CLI di Server Ubuntu/Debian

```bash
# [1] Install Certbot NGINX Plugin
sudo apt install certbot python3-certbot-nginx -y

# [2] Terbitkan & Konfigurasikan SSL Otomatis
sudo certbot --nginx -d tokokita.com -d www.tokokita.com

# [3] Uji Coba Auto-Renewal Otomatis
sudo certbot renew --dry-run
```

**Hafalan:**

```text
certbot --nginx -d example.com → menerbitkan dan memasang sertifikat SSL Let's Encrypt secara otomatis
```

---

<a id="bagian-7"></a>

## 7. 🟡 HTTP Strict Transport Security (HSTS)

#### Konsep

**HSTS (`Strict-Transport-Security`)** adalah header HTTP yang memberitahu browser pengguna:
_"Jangan pernah mencoba menghubungi website ini via HTTP biasa selama X detik ke depan. Selalu ubah `http://` menjadi `https://` langsung di level browser!"_

Mencegah serangan **Man-in-the-Middle (MITM) SSL Stripping**.

#### Contoh

```nginx
# Aktifkan HSTS selama 1 Tahun (31536000 detik) untuk Domain & Seluruh Subdomain
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

**Hafalan:**

```text
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

---

<a id="bagian-8"></a>

## 8. 🟡 Security Headers Esensial: Anti-Clickjacking & Anti-XSS

#### Konsep

Paket HTTP Security Headers Standar Industri untuk Memperoleh Nilai A+ di SecurityHeaders.com:

1. **`X-Frame-Options "SAMEORIGIN"`** : Mencegah website Anda di-embed ke dalam `<iframe>` situs jahat (**Anti-Clickjacking**).
2. **`X-Content-Type-Options "nosniff"`** : Mencegah browser menebak (_MIME sniffing_) tipe file executable sebagai script.
3. **`Referrer-Policy "strict-origin-when-cross-origin"`** : Menjaga kerahasiaan URL referrer saat berpindah ke situs eksternal.
4. **`Permissions-Policy`** : Menonaktifkan akses sensor perangkat (kamera, mikrofon, geolokasi) yang tidak dibutuhkan.

#### Contoh

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

**Hafalan:**

```text
X-Frame-Options SAMEORIGIN + X-Content-Type-Options nosniff → fondasi wajib security headers di web server
```

---

<a id="bagian-9"></a>

## 9. 🟡 Menyembunyikan Versi NGINX & Header Sensitif

#### Konsep

Secara default, NGINX menyematkan versinya pada header HTTP (`Server: nginx/1.24.0`) dan pada halaman error bawaan. Hacker menggunakan informasi versi ini untuk mencari celah eksploitasi (_CVE Fingerprinting_).

Gunakan direktif:
**`server_tokens off;`** (Wajib di blok `http {}`).

#### Contoh

```nginx
http {
    # Sembunyikan Versi NGINX (Hanya akan menampilkan 'Server: nginx')
    server_tokens off;

    # Sembunyikan Header Bahasa Backend
    fastcgi_hide_header X-Powered-By;
    proxy_hide_header X-Powered-By;
}
```

**Hafalan:**

```text
server_tokens off; → menyembunyikan versi NGINX untuk mencegah information disclosure
```

---

<a id="bagian-10"></a>

## 10. 🟡 Proteksi File Sensitif & Direktori Tersembunyi

#### Konsep

Sering kali developer tidak sengaja mengekspos folder repositori git (`.git/`) atau file konfigurasi rahasia database (`.env`, `.htaccess`, `.DS_Store`) ke direktori public web root.

Blokir seluruh akses ke file/folder berawalan titik menggunakan Regex Matcher:

#### Contoh

```nginx
# Blokir File Rahasia (.env, .git, .yaml, .config) dengan Return 404
location ~ /\.(env|git|svn|htaccess|htpasswd|DS_Store|bak|config) {
    deny all;
    return 404; # Kembalikan 404 agar penyerang mengira file tidak ada
}
```

**Hafalan:**

```text
location ~ /\.(env|git) { deny all; return 404; } → mengamankan file rahasia agar tidak bisa diunduh dari browser
```

---

<a id="bagian-11"></a>

## 11. 🟡 Rate Limiting Dasar dengan `limit_req_zone` (Algoritma Leaky Bucket)

#### Konsep

**Rate Limiting**:
Membatasi jumlah request yang boleh dikirim oleh satu alamat IP dalam satu satuan waktu untuk menangkal **Serangan Brute Force Login, Web Scraping Agresif, dan DoS**.

Dua Langkah Konfigurasi:

1. **Definisikan Zona Memori (Di Blok `http {}`):**
   `limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/s;`
   - `$binary_remote_addr` : Menyimpan IP client dalam bentuk biner (hanya 4 byte per IP / sangat hemat RAM).
   - `zone=login_limit:10m` : 10MB RAM dapat menyimpan ~160.000 IP aktif.
   - `rate=5r/s` : Batas maksimal 5 request per detik.
2. **Terapkan pada Endpoint (Di Blok `location`):**
   `limit_req zone=login_limit;`

**Hafalan:**

```text
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s; → zona memori rate limit IP client
```

---

<a id="bagian-12"></a>

## 12. 🟡 Parameter Rate Limiting Lanjutan: `burst=N` dan `nodelay`

#### Konsep

Jika rate diatur `5r/s`, browser yang mengunduh 6 file CSS/JS secara paralel akan langsung diblokir (_False Positive_).

Solusi:

- **`burst=10`** : Mengizinkan lonjakan mendadak hingga 10 request tambahan dalam ember penampung (_Leaky Bucket_).
- **`nodelay`** : Memproses request di dalam burst **secara instan tanpa penundaan**, selama ember belum meluap penuh.

#### Contoh

```nginx
location /api/auth/login {
    proxy_pass http://backend_cluster;

    # Maksimal 5 req/s dengan toleransi burst 10 request seketika
    limit_req zone=login_limit burst=10 nodelay;
}
```

**Hafalan:**

```text
limit_req zone=login_limit burst=10 nodelay; → mengakomodasi lonjakan request sesaat secara instan
```

---

<a id="bagian-13"></a>

## 13. 🟡 Connection Limiting dengan `limit_conn_zone`

#### Konsep

Berbeda dengan `limit_req` yang membatasi _laju request per detik_, **`limit_conn` membatasi _jumlah koneksi TCP simultan yang sedang terbuka_**.

Sangat efektif untuk menangkal **Serangan Slowloris DoS** (penyerang membuka ribuan koneksi lambat untuk menghabiskan worker server).

#### Contoh

```nginx
# Di http context:
limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

server {
    listen 443 ssl;

    # Batasi maksimal 20 koneksi TCP simultan per IP
    limit_conn conn_limit 20;

    location /downloads/ {
        # Batasi maksimal 2 koneksi unduhan bersamaan per IP
        limit_conn conn_limit 2;
    }
}
```

**Hafalan:**

```text
limit_conn conn_limit 20; → membatasi jumlah koneksi TCP simultan per IP pengunjung
```

---

<a id="bagian-14"></a>

## 14. 🟡 Kustomisasi Status HTTP & Logging Rate Limiting

#### Konsep

Secara default, NGINX mengembalikan status **503 Service Unavailable** saat rate limit terlampaui. Standar industri modern merekomendasikan status **`429 Too Many Requests`**.

Gunakan direktif:

- **`limit_req_status 429;`**
- **`limit_req_log_level warn;`**

#### Contoh

```nginx
http {
    limit_req_status 429;
    limit_req_log_level warn;
}
```

**Hafalan:**

```text
limit_req_status 429; → mengembalikan status standar RFC 6585 'Too Many Requests' saat rate limit terlewati
```

---

<a id="bagian-15"></a>

## 15. 🔴 Kompresi HTTP Berkecepatan Tinggi dengan Gzip

#### Konsep

Kompresi **Gzip** mengecilkan ukuran file teks (HTML, CSS, JavaScript, JSON, SVG) hingga **70%–80%** sebelum dikirim ke browser.

Aturan Kinerja:

- Jangan mengompres file yang ukurannya sudah terlalu kecil (`gzip_min_length 256;` / kompresi file < 256 byte justru memperbesar ukuran).
- Jangan mengompres file gambar biner (`.jpg`, `.png`) karena format gambar sudah terkompresi.

#### Contoh

```nginx
http {
    # Aktifkan Kompresi Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 5; # Level 5: Keseimbangan optimal rasio kompresi vs beban CPU
    gzip_min_length 256;

    # Daftar MIME Types yang Dikompresi
    gzip_types
        text/plain
        text/css
        text/javascript
        application/javascript
        application/json
        application/x-javascript
        text/xml
        application/xml
        application/xml+rss
        image/svg+xml;
}
```

**Hafalan:**

```text
gzip on; gzip_comp_level 5; gzip_types application/json text/css; → menghemat 70% bandwidth transfer file teks
```

---

<a id="bagian-16"></a>

## 16. 🔴 Kompresi Modern Brotli

#### Konsep

**Brotli (`ngx_brotli`)** adalah algoritma kompresi generasi terbaru buatan Google yang menghasilkan ukuran file **20% lebih kecil dibanding Gzip** dengan kecepatan dekompresi lebih cepat di browser.

#### Contoh (Jika Modul Brotli Terpasang)

```nginx
http {
    brotli on;
    brotli_comp_level 6;
    brotli_types text/plain text/css application/json application/javascript image/svg+xml;
}
```

**Hafalan:**

```text
Brotli Compression → algoritma kompresi modern yang 20% lebih hemat bandwidth dibanding Gzip
```

---

<a id="bagian-17"></a>

## 17. 🔴 Optimasi Transfer File Kernel OS (Zero-Copy Transfer)

#### Konsep

Tiga Direktif Kernel Tuning Inti di Blok `http {}`:

1. **`sendfile on;`** : Menginstruksikan kernel OS untuk langsung memindahkan file dari disk cache ke TCP Socket tanpa menyalinnya ke user memory buffer (**Zero-Copy**).
2. **`tcp_nopush on;`** : Memaksa NGINX mengirim header HTTP dan isi file dalam 1 paket TCP utuh (hanya aktif jika `sendfile on`).
3. **`tcp_nodelay on;`** : Menonaktifkan algoritma Nagle pada koneksi keepalive untuk meminimalkan latency respons API kecil.

**Hafalan:**

```text
sendfile on; tcp_nopush on; tcp_nodelay on; → trio direktif optimasi throughput kernel jaringan Linux
```

---

<a id="bagian-18"></a>

## 18. 🔴 Tuning Worker Processes & File Descriptors Sistem

#### Konsep

Konfigurasi Tingkat Sistem di `nginx.conf` (Context `main` & `events`):

- **`worker_processes auto;`** : Menjalankan 1 worker per core CPU fisik/virtual.
- **`worker_rlimit_nofile 65535;`** : Menaikkan batas maksimal File Descriptors yang boleh dibuka NGINX di level OS.
- **`worker_connections 4096;`** : Setiap worker sanggup melayani 4096 koneksi simultan.
- **`multi_accept on;`** : Worker menerima seluruh koneksi baru di antrean sekaligus.

#### Contoh

```nginx
user www-data;
worker_processes auto;
worker_rlimit_nofile 65535; # Batas File Descriptors OS

events {
    worker_connections 4096;
    multi_accept on;
    use epoll; # Mekanisme I/O tercepat di Linux
}
```

**Hafalan:**

```text
worker_processes auto; worker_connections 4096; worker_rlimit_nofile 65535;
```

---

<a id="bagian-19"></a>

## 19. 🔴 Tuning Buffer Klien & Timeouts Mitigasi Serangan DoS

#### Konsep

Jika penyerang mengirimkan header HTTP dengan sangat lambat (_Slow Client Attack_), worker NGINX bisa tertahan lama.

Kunci Timeouts yang Ketat:

- **`client_body_timeout 10s;`** : Waktu maksimal menunggu client mengirim body payload.
- **`client_header_timeout 10s;`** : Waktu maksimal menunggu client mengirim header HTTP.
- **`keepalive_timeout 30s;`** : Menutup koneksi idle setelah 30 detik untuk membebaskan memory.

**Hafalan:**

```text
client_body_timeout 10s; client_header_timeout 10s; → mencegah koneksi lambat menahan resource server
```

---

<a id="bagian-20"></a>

## 20. 🔴 Audit Keamanan & Verifikasi Skor A+

#### Konsep

Alat Verifikasi & Audit Keamanan Standar Industri Gratis:

1. **Qualys SSL Labs (ssllabs.com/ssltest):** Menguji keamanan SSL/TLS, sertifikat, dan cipher suites (Target: **Nilai A+**).
2. **SecurityHeaders.com:** Menguji kelengkapan HTTP Security Headers (Target: **Nilai A+**).
3. **Mozilla Observatory (observatory.mozilla.org):** Audit menyeluruh standar kepatuhan web security.

**Hafalan:**

```text
Audit A+ SSL Labs & SecurityHeaders → verifikasi kepatuhan standar keamanan web server global
```

---

<a id="bagian-21"></a>

## 21. 🛠️ Peta Ingatan Cepat

```text
               PETA ARSITEKTUR NGINX Security, SSL & OPTIMASI
                                      │
       ┌──────────────────────────────┼──────────────────────────────┐
       ▼                              ▼                              ▼
HTTPS & SSL/TLS HARDENING      SECURITY HEADERS & LIMITING    PERFORMANCE & KERNEL TUNING
├─ listen 443 ssl http2        ├─ Strict HSTS Preload         ├─ gzip on (Comp level 5)
├─ 301 HTTP -> HTTPS           ├─ X-Frame-Options SAMEORIGIN  ├─ sendfile & tcp_nopush
├─ TLS 1.2 & TLS 1.3 only      ├─ limit_req_zone (Rate Limit) ├─ worker_processes auto
└─ ssl_session_cache 10m       └─ Block sensitive (/.env)     └─ worker_rlimit_nofile 65k
```

---

<a id="bagian-22"></a>

## 22. 📚 Tabel Ringkasan

| Direktif / Parameter        | Context                | Fungsi & Karakteristik Utama                                     |
| --------------------------- | ---------------------- | ---------------------------------------------------------------- |
| `listen 443 ssl`            | `server`               | Mengaktifkan port HTTPS terenkripsi SSL/TLS                      |
| `ssl_protocols`             | `http/server`          | Menentukan versi protokol SSL yang diizinkan (`TLSv1.2 TLSv1.3`) |
| `ssl_session_cache`         | `http/server`          | Menyimpan cache sesi SSL di RAM untuk menghemat handshake CPU    |
| `Strict-Transport-Security` | `http/server`          | Memaksa browser selalu berkomunikasi via HTTPS (HSTS)            |
| `server_tokens off`         | `http/server`          | Menyembunyikan informasi versi NGINX dari publik                 |
| `limit_req_zone`            | `http`                 | Membuat zona memori pelacak laju request per IP client           |
| `limit_req`                 | `server/location`      | Menerapkan batas laju request (`burst=N nodelay`)                |
| `limit_conn`                | `server/location`      | Membatasi jumlah koneksi TCP simultan per alamat IP              |
| `gzip on`                   | `http/server/location` | Mengaktifkan kompresi data teks untuk efisiensi bandwidth        |
| `sendfile on`               | `http/server/location` | Mengaktifkan transfer file langsung di kernel OS (Zero-Copy)     |
| `worker_rlimit_nofile`      | `main`                 | Menaikkan batas file descriptor maksimal di sistem operasi       |

---

<a id="bagian-23"></a>

## 23. ⚡ Cheat Code NGINX Security & SSL 10 Detik

```nginx
# [1] Template Hardened SSL & Security Headers
ssl_protocols TLSv1.2 TLSv1.3;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1d;
ssl_session_tickets off;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
server_tokens off;

# [2] Template Leaky Bucket Rate Limiting (HTTP 429)
limit_req_zone $binary_remote_addr zone=api_gate:10m rate=10r/s;
limit_req_status 429;
```

---

<a id="bagian-24"></a>

## 24. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Aktifkan HTTPS & Otomatisasi Certbot
├── Pasang sertifikat SSL/TLS dan kunci port 443
└── Buat server block port 80 untuk 301 redirect permanen
       │
       ▼
Langkah 2: Terapkan SSL Hardening & Security Headers
├── Batasi hanya ke TLSv1.2 & TLSv1.3 dan aktifkan SSL session cache
└── Pasang HSTS preload, X-Frame-Options, dan matikan server_tokens
       │
       ▼
Langkah 3: Proteksi File Rahasia & Pasang Rate Limiting
├── Blokir akses ke /.env dan /.git dengan return 404
└── Lindungi endpoint login/API dengan limit_req_zone burst nodelay
       │
       ▼
Langkah 4: Optimasi Kecepatan dengan Gzip & Kernel Zero-Copy
├── Aktifkan gzip compression level 5 pada file JSON/CSS/JS
└── Terapkan sendfile on, tcp_nopush on, dan tuning worker_connections
       │
       ▼
Langkah 5: Selamat! Server NGINX Anda Siap Produksi dengan Standar Bank-Grade A+!
```

---

<a id="bagian-25"></a>

## 25. 🏗️ Mini Project: Production-Ready Bank-Grade NGINX Security Gateway with TLS 1.3, Strict HSTS, Leaky Bucket Rate Limiting, Gzip Compression, and Kernel Tuning

Berkas konfigurasi NGINX enterprise lengkap, modular, dan runnable: **SSL Termination TLS 1.2/1.3, HSTS Preload, Full Security Headers, Rate Limiting per IP pada Endpoint Login & API, Gzip Compression, Penolakan File Rahasia, dan Kernel Zero-Copy**.

```nginx
# =========================================================================
# /etc/nginx/nginx.conf (Tingkat Sistem Global)
# =========================================================================
user www-data;
worker_processes auto;
worker_rlimit_nofile 65535;
pid /run/nginx.pid;

events {
    worker_connections 4096;
    multi_accept on;
    use epoll;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # [1] Sembunyikan Versi & Header Sensitif
    server_tokens off;
    proxy_hide_header X-Powered-By;
    fastcgi_hide_header X-Powered-By;

    # [2] Optimasi Kernel Jaringan Linux (Zero-Copy)
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;

    # [3] Timeouts Ketat (Mitigasi Serangan DoS)
    client_body_timeout 10s;
    client_header_timeout 10s;
    keepalive_timeout 30s;
    send_timeout 10s;

    # [4] Kompresi Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 5;
    gzip_min_length 256;
    gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;

    # [5] SSL Session Caching Global
    ssl_session_cache shared:SSL_GLOBAL:20m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # [6] Zona Rate Limiting (Leaky Bucket)
    limit_req_zone $binary_remote_addr zone=GENERAL_API:10m rate=20r/s;
    limit_req_zone $binary_remote_addr zone=AUTH_LIMIT:10m rate=5r/s;
    limit_req_status 429;
    limit_req_log_level warn;

    # [7] Zona Connection Limiting
    limit_conn_zone $binary_remote_addr zone=ADDR_CONN_LIMIT:10m;

    include /etc/nginx/conf.d/*.conf;
}
```

```nginx
# =========================================================================
# /etc/nginx/conf.d/bank_grade_secure_site.conf
# =========================================================================

# -------------------------------------------------------------------------
# [1] HTTP PORT 80 REDIRECTOR (ALWAYS FORCE HTTPS)
# -------------------------------------------------------------------------
server {
    listen 80;
    server_name portal.perusahaan.com;
    return 301 https://$host$request_uri;
}

# -------------------------------------------------------------------------
# [2] HTTPS PORT 443 PRODUCTION HARDENED GATEWAY
# -------------------------------------------------------------------------
server {
    listen 443 ssl http2;
    server_name portal.perusahaan.com;

    root /var/www/portal/dist;
    index index.html;

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/portal.perusahaan.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/portal.perusahaan.com/privkey.pem;

    # TLS Protocols & Ciphers Hardening
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers on;

    # Bank-Grade Security Headers (Qualys A+ Rating)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # Batasi Koneksi TCP Simultan per IP
    limit_conn ADDR_CONN_LIMIT 20;

    # ---------------------------------------------------------------------
    # PROTEKSI FILE SENSITIF (.env, .git, .yaml, .config)
    # ---------------------------------------------------------------------
    location ~ /\.(env|git|svn|htaccess|htpasswd|DS_Store|bak|config) {
        deny all;
        return 404;
    }

    # ---------------------------------------------------------------------
    # RUTE 1: FRONTEND SPA (VUE/REACT)
    # ---------------------------------------------------------------------
    location / {
        try_files $uri $uri/ /index.html;
    }

    # ---------------------------------------------------------------------
    # RUTE 2: AUTHENTICATION API (RATE LIMIT KETAT 5 REQ/S)
    # ---------------------------------------------------------------------
    location /api/v1/auth/ {
        limit_req zone=AUTH_LIMIT burst=5 nodelay;

        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ---------------------------------------------------------------------
    # RUTE 3: GENERAL RESOURCE API (RATE LIMIT 20 REQ/S)
    # ---------------------------------------------------------------------
    location /api/ {
        limit_req zone=GENERAL_API burst=20 nodelay;

        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
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

- [NGINX SSL Module Documentation](https://nginx.org/en/docs/http/ngx_http_ssl_module.html)
- [NGINX Rate Limiting Module (limit_req)](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html)
- [NGINX Gzip Module Reference](https://nginx.org/en/docs/http/ngx_http_gzip_module.html)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)
- [Qualys SSL Labs Server Test](https://www.ssllabs.com/ssltest/)
