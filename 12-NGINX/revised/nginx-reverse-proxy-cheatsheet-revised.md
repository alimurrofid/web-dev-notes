# NGINX Reverse Proxy & Load Balancing Cheatsheet Revised

> **Target:** Pemula yang telah memahami NGINX Dasar dan ingin menguasai **Reverse Proxy (`proxy_pass`), Preserving Client Headers (`Host`, `X-Real-IP`, `X-Forwarded-*`), WebSocket Real-Time Proxying, FastCGI PHP-FPM, Upstream Load Balancing (`round-robin`, `least_conn`, `ip_hash`, `weight`, `backup`, `down`), Passive Health Checks & Failover (`proxy_next_upstream`), Proxy Timeouts & Buffering, serta High-Performance Proxy Caching (`proxy_cache_path`, `proxy_cache_valid`, `$upstream_cache_status`)** menggunakan **NGINX 1.24+ / 1.26+**.
>
> Fokus cheatsheet ini: **mental model Reverse Proxy vs Forward Proxy → `proxy_pass` & Trailing Slash gotcha → Client Identity Headers → WebSocket & Socket.io Upgrade → FastCGI PHP-FPM → Upstream Cluster & Load Balancing Algorithms → Weight & Server Parameters → Failover & Timeouts (504 Prevention) → Buffering → Proxy Caching Path & Memory Zones → Cache Bypass & Revalidation → Cache HIT/MISS Tracking → HTTP/1.1 Upstream Keepalive → mini project High-Availability Microservices API Gateway**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: Reverse Proxy mental model, proxy_pass, Trailing Slash, Proxy Headers wajib, dan WebSocket proxying

🟡 Lanjutan
→ pelajari setelah proxy lancar: FastCGI PHP, Upstream Clusters, Algoritma Load Balancing (least_conn, ip_hash), Weight, dan Timeouts

🔴 Advanced / Operasional
→ penting untuk arsitektur skala besar: Proxy Caching (proxy_cache_path), Cache Bypass, Upstream Keepalive, dan Microservices Gateway
```

Mental model alur request Reverse Proxy & Upstream Load Balancer di NGINX:

```text
                  PENGUNJUNG PUBLIK (Browser / Mobile App)
                                     │
                                     ▼ Port 80 / 443
                     NGINX REVERSE PROXY & API GATEWAY
               (SSL Termination, Rate Limiting & Proxy Cache)
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼ (Cache HIT: ~1ms)         ▼ (Cache MISS: Rute API)    ▼ (Rute WebSocket)
    Disk Proxy Cache          Upstream Load Balancer       Chat WebSocket Server
   (Sajikan dari Memory)   (Round-Robin / Least-Conn)     (proxy_http_version 1.1)
                                     │                               │
                      ┌──────────────┴──────────────┐                │
                      ▼                             ▼                ▼
             Backend Node.js #1            Backend Node.js #2   Socket.io Cluster
              (Port 3001)                   (Port 3002)          (Port 4000)
```

**Hafalan:**

```text
Reverse Proxy           → server perantara yang menerima request publik lalu meneruskannya ke backend internal privat
proxy_pass              → direktif inti NGINX untuk meneruskan request HTTP ke server aplikasi backend
proxy_set_header        → menyematkan data identitas asli client (Host, IP asli, Protokol) ke header request backend
Upgrade & Connection    → dua header wajib untuk mengaktifkan koneksi dua arah real-time WebSocket
upstream                → blok context penampung sekumpulan server backend untuk didistribusikan bebannya (Load Balancing)
least_conn              → algoritma penyeimbang beban yang mengarahkan request ke server dengan koneksi aktif paling sedikit
ip_hash                 → algoritma load balancing yang mengunci IP client ke server backend tertentu (Sticky Session)
proxy_cache_path        → mendefinisikan lokasi direktori disk dan ukuran memory zone untuk menyimpan cache respons backend
$upstream_cache_status  → variabel pemantau status cache (HIT, MISS, BYPASS, EXPIRED, UPDATING)
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Reverse Proxy di NGINX & Perbedaannya dengan Forward Proxy](#bagian-1)
2. [Direktif Dasar `proxy_pass`](#bagian-2)
3. [Perilaku Krusial Trailing Slash pada `proxy_pass`](#bagian-3)
4. [Proxy Headers Wajib: Menjaga Identitas Asli Client](#bagian-4)
5. [Reverse Proxy untuk WebSocket & Real-Time Connection](#bagian-5)
6. [FastCGI Proxying untuk Aplikasi PHP (Laravel & WordPress)](#bagian-6)

### 🟡 Lanjutan

7. [Upstream Context Dasar & Algoritma Default Round-Robin](#bagian-7)
8. [Load Balancing Algoritma 2: Least Connections (`least_conn;`)](#bagian-8)
9. [Load Balancing Algoritma 3: IP Hash (`ip_hash;`) untuk Sticky Sessions](#bagian-9)
10. [Parameter Server Upstream: `weight`](#bagian-10)
11. [Parameter Server Upstream: `max_fails`, `fail_timeout`, `backup`, dan `down`](#bagian-11)
12. [Mekanisme Health Checks Pasif & Automatic Failover](#bagian-12)
13. [Proxy Buffering: Menjaga Kestabilan Komunikasi Backend](#bagian-13)
14. [Proxy Timeouts: Menghindari Error 504 Gateway Timeout](#bagian-14)

### 🔴 Advanced / Operasional

15. [Pengenalan NGINX Proxy Caching & Konfigurasi `proxy_cache_path`](#bagian-15)
16. [Mengaktifkan dan Mengatur Cache Respons API](#bagian-16)
17. [Cache Bypass & No-Cache Conditions](#bagian-17)
18. [Status Header Cache: Memeriksa Cache HIT / MISS / EXPIRED](#bagian-18)
19. [Optimasi Upstream HTTP/1.1 Keepalive & Gzip](#bagian-19)
20. [Best Practice & Pola Arsitektur API Gateway Microservices](#bagian-20)

### 🛠️ Referensi & Praktik

21. [Peta Ingatan Cepat](#bagian-21)
22. [Tabel Ringkasan](#bagian-22)
23. [Cheat Code NGINX Reverse Proxy 10 Detik](#bagian-23)
24. [Urutan Belajar yang Disarankan](#bagian-24)
25. [Mini Project: Production-Ready High-Availability Microservices API Gateway with Upstream Load Balancer, WebSocket Support, and Dynamic Proxy Caching](#bagian-25)
26. [Referensi Resmi](#bagian-26)

---

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan Reverse Proxy di NGINX & Perbedaannya dengan Forward Proxy

## Konsep

1. **Forward Proxy (Proxy Biasa):**
   - Bertindak atas nama **Client (Pengguna)** untuk mengakses internet luar (misal: VPN atau proxy sensor kantor).
   - Server tujuan tidak tahu IP asli pengguna.
2. **Reverse Proxy (NGINX):**
   - Bertindak atas nama **Server (Backend)**.
   - Klien luar hanya tahu domain publik (`api.perusahaan.com`), tanpa tahu bahwa di belakang NGINX terdapat puluhan server Node.js, Spring Boot, atau Python yang berjalan di port internal (`127.0.0.1:3000`).

## Keuntungan Menggunakan NGINX sebagai Reverse Proxy

1. **Keamanan & Isolasi:** Port aplikasi internal tidak perlu dibuka ke internet publik.
2. **SSL Termination:** NGINX menangani enkripsi HTTPS, backend internal cukup memproses HTTP polos yang ringan.
3. **Pusat Caching & Kompresi:** Menghemat komputasi backend hingga 80%.

**Hafalan:**

```text
Forward Proxy melindungi Client | Reverse Proxy melindungi dan membagi beban Server Backend
```

---

<a id="bagian-2"></a>

# 2. 🟢 Direktif Dasar `proxy_pass`

## Konsep

Direktif **`proxy_pass URL;`** digunakan di dalam blok `location` untuk meneruskan request masuk ke alamat backend tujuan (protokol `http://` atau `https://`).

## Contoh

```nginx
server {
    listen 80;
    server_name api.tokokita.com;

    # Teruskan seluruh request ke aplikasi Node.js/Express di port 3000
    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}
```

## Output

```text
Browser: GET http://api.tokokita.com/users
NGINX   ──> Meneruskan request ke http://127.0.0.1:3000/users
Node.js ──> Merespons JSON ──> NGINX ──> Browser Pengguna
```

**Hafalan:**

```text
location / { proxy_pass http://127.0.0.1:3000; } → meneruskan request ke backend application server
```

---

<a id="bagian-3"></a>

# 3. 🟢 Perilaku Krusial Trailing Slash pada `proxy_pass`

## Konsep

Perbedaan paling penting dan sering menjadi jebakan developer di NGINX:

| Konfigurasi `proxy_pass` | URI yang Dikirim ke Backend | Karakteristik |
|---|---|---|
| **Tanpa Slash:** `http://127.0.0.1:3000` | `/api/v1/users` $\rightarrow$ **`/api/v1/users`** | **Preserve URI:** Path asli dipertahankan apa adanya. |
| **Dengan Slash:** `http://127.0.0.1:3000/` | `/api/v1/users` $\rightarrow$ **`/users`** | **Strip Location:** Bagian `/api/v1` dipotong dan diganti `/`. |

## Contoh

```nginx
# [1] Kasus Mempertahankan Path Lengkap (Standard Microservices):
location /api/ {
    proxy_pass http://127.0.0.1:3000; 
    # Request /api/products -> diteruskan ke http://127.0.0.1:3000/api/products
}

# [2] Kasus Memotong Prefix URL:
location /v1/ {
    proxy_pass http://127.0.0.1:4000/; 
    # Request /v1/orders -> diteruskan ke http://127.0.0.1:4000/orders (/v1/ dibuang!)
}
```

**Hafalan:**

```text
proxy_pass tanpa slash di akhir -> URI utuh | proxy_pass dengan slash di akhir -> location dipotong
```

---

<a id="bagian-4"></a>

# 4. 🟢 Proxy Headers Wajib: Menjaga Identitas Asli Client

## Konsep

Saat NGINX meneruskan request ke backend, backend akan melihat bahwa request berasal dari `127.0.0.1` (IP NGINX sendiri), bukan IP asli pengunjung!

**4 Proxy Headers Wajib Standar Industri**:
1. **`proxy_set_header Host $host;`** : Meneruskan nama domain asli yang diminta client.
2. **`proxy_set_header X-Real-IP $remote_addr;`** : Meneruskan alamat IP publik asli client.
3. **`proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`** : Menyusun rantai IP jika melewati banyak proxy.
4. **`proxy_set_header X-Forwarded-Proto $scheme;`** : Memberi tahu backend apakah client menggunakan `http` atau `https`.

## Contoh

```nginx
server {
    listen 80;
    server_name api.tokokita.com;

    location / {
        proxy_pass http://127.0.0.1:3000;

        # 4 Header Wajib
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Hafalan:**

```text
proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; → menjaga data asli client sampai ke backend
```

---

<a id="bagian-5"></a>

# 5. 🟢 Reverse Proxy untuk WebSocket & Real-Time Connection

## Konsep

Protokol WebSocket bekerja dengan melakukan **HTTP Handshake Upgrade** dari HTTP/1.1 biasa menjadi koneksi dua arah persisten (*Full-Duplex TCP*).

Secara default, NGINX menggunakan HTTP/1.0 untuk proxy pass dan menutup koneksi persisten.

Untuk mengaktifkan WebSocket:
1. `proxy_http_version 1.1;`
2. `proxy_set_header Upgrade $http_upgrade;`
3. `proxy_set_header Connection "upgrade";`

## Contoh (Socket.io / ws)

```nginx
server {
    listen 80;
    server_name chat.tokokita.com;

    location /socket.io/ {
        proxy_pass http://127.0.0.1:4000;

        # Konfigurasi Wajib WebSocket
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;

        # Timeout koneksi panjang untuk websocket (misal 24 jam)
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
```

**Hafalan:**

```text
proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade";
```

---

<a id="bagian-6"></a>

# 6. 🟢 FastCGI Proxying untuk Aplikasi PHP (Laravel & WordPress)

## Konsep

Aplikasi PHP dieksekusi via proses terpisah bernama **PHP-FPM (FastCGI Process Manager)**.

NGINX berkomunikasi dengan PHP-FPM menggunakan protokol biner FastCGI (biasanya via UNIX Socket di `/run/php/php8.x-fpm.sock` atau TCP port `127.0.0.1:9000`).

## Contoh (Laravel NGINX Block)

```nginx
server {
    listen 80;
    server_name laravel.tokokita.com;
    root /var/www/laravel-app/public;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Eksekusi File PHP via FastCGI Socket
    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;
        fastcgi_hide_header X-Powered-By;
    }
}
```

**Hafalan:**

```text
fastcgi_pass unix:/run/php/php-fpm.sock; fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
```

---

<a id="bagian-7"></a>

# 7. 🟡 Upstream Context Dasar & Algoritma Default Round-Robin

## Konsep

Blok **`upstream name { ... }`** didefinisikan di dalam context `http` untuk mengelompokkan sekumpulan server backend (*Cluster*).

**Algoritma Default: Round-Robin**:
- Request pertama dikirim ke Server 1, request kedua ke Server 2, request ketiga ke Server 3, lalu kembali ke Server 1 secara bergiliran merata.

## Contoh

```nginx
http {
    # Definisi Cluster Backend
    upstream backend_nodes {
        server 10.0.0.1:3000;
        server 10.0.0.2:3000;
        server 10.0.0.3:3000;
    }

    server {
        listen 80;
        server_name api.tokokita.com;

        location / {
            # Teruskan ke nama cluster upstream
            proxy_pass http://backend_nodes;
        }
    }
}
```

**Hafalan:**

```text
upstream my_cluster { server srv1:3000; server srv2:3000; } → grup server load balancing round-robin
```

---

<a id="bagian-8"></a>

# 8. 🟡 Load Balancing Algoritma 2: Least Connections (`least_conn;`)

## Konsep

Algoritma **`least_conn;`**:
- NGINX memeriksa jumlah koneksi aktif pada setiap backend server.
- Request baru **selalu diarahkan ke server yang saat itu sedang menangani koneksi paling sedikit**.
- Sangat ideal untuk API yang durasi prosesnya bervariasi (misal: query database berat atau pemrosesan video).

## Contoh

```nginx
upstream dynamic_api_cluster {
    least_conn; # Aktifkan Least Connections

    server 10.0.0.1:3000;
    server 10.0.0.2:3000;
    server 10.0.0.3:3000;
}
```

**Hafalan:**

```text
least_conn; → mendistribusikan request ke backend yang beban koneksi aktifnya paling rendah
```

---

<a id="bagian-9"></a>

# 9. 🟡 Load Balancing Algoritma 3: IP Hash (`ip_hash;`) untuk Sticky Sessions

## Konsep

Algoritma **`ip_hash;`**:
- Menggunakan 3 oktet pertama alamat IPv4 client sebagai kunci hash untuk menentukan server backend.
- **Menjamin bahwa pengunjung dengan IP yang sama akan selalu diarahkan ke backend server yang sama** (*Session Stickiness*).
- Berguna untuk aplikasi monolitik lama yang menyimpan session di memory server lokal.

## Contoh

```nginx
upstream stateful_app_cluster {
    ip_hash; # Kunci IP client ke server tertentu

    server 10.0.0.1:3000;
    server 10.0.0.2:3000;
}
```

**Hafalan:**

```text
ip_hash; → mengunci client IP ke server yang sama untuk menjaga sticky session
```

---

<a id="bagian-10"></a>

# 10. 🟡 Parameter Server Upstream: `weight`

## Konsep

Jika Anda memiliki server dengan spesifikasi hardware berbeda (misal: Server A memiliki 16 Core CPU dan Server B hanya 4 Core CPU):

Gunakan parameter **`weight=N`**:
- Menentukan bobot pembagian trafik secara proporsional.

## Contoh

```nginx
upstream weighted_cluster {
    # Server A menerima 3 dari setiap 4 request (75% trafik)
    server 10.0.0.1:3000 weight=3;

    # Server B menerima 1 dari setiap 4 request (25% trafik)
    server 10.0.0.2:3000 weight=1;
}
```

**Hafalan:**

```text
server 10.0.0.1:3000 weight=3; → mengatur porsi pembagian beban trafik sesuai kapasitas server
```

---

<a id="bagian-11"></a>

# 11. 🟡 Parameter Server Upstream: `max_fails`, `fail_timeout`, `backup`, dan `down`

## Konsep

Parameter manajemen keandalan server:
1. **`max_fails=3 fail_timeout=30s;`** : Jika server gagal merespons 3 kali dalam 30 detik, NGINX akan menganggap server mati selama 30 detik berikutnya.
2. **`backup;`** : Server cadangan yang **HANYA menerima trafik jika seluruh server utama mati total**.
3. **`down;`** : Menandai server sedang offline/maintenance tanpa perlu menghapus baris konfigurasi.

## Contoh

```nginx
upstream resilient_cluster {
    server 10.0.0.1:3000 max_fails=3 fail_timeout=10s;
    server 10.0.0.2:3000 max_fails=3 fail_timeout=10s;
    
    # Server Cadangan Darurat (Disaster Recovery):
    server 10.0.0.3:3000 backup;

    # Server Sedang Maintenance:
    server 10.0.0.4:3000 down;
}
```

**Hafalan:**

```text
backup -> aktif saat semua server mati | down -> tandai offline maintenance
```

---

<a id="bagian-12"></a>

# 12. 🟡 Mekanisme Health Checks Pasif & Automatic Failover

## Konsep

Direktif **`proxy_next_upstream`**:
Memberitahu NGINX: jika backend server pertama mengembalikan error atau timeout, **segera oper request tersebut ke backend server berikutnya di cluster sebelum mengirim error ke browser pengguna**.

## Contoh

```nginx
location / {
    proxy_pass http://resilient_cluster;

    # Failover otomatis jika server pertama error 502, 503, atau timeout
    proxy_next_upstream error timeout http_502 http_503 http_504;
    proxy_next_upstream_tries 3;
    proxy_next_upstream_timeout 10s;
}
```

**Hafalan:**

```text
proxy_next_upstream error timeout http_502; → otomatis mengoper request ke server cadangan jika server utama gagal
```

---

<a id="bagian-13"></a>

# 13. 🟡 Proxy Buffering: Menjaga Kestabilan Komunikasi Backend

## Konsep

**`proxy_buffering on;` (Default Aktif)**:
- NGINX membaca seluruh respon dari backend ke dalam memory buffer secepat mungkin, sehingga proses worker backend segera bebas melayani request lain.
- Respon kemudian dikirimkan secara bertahap ke client (meskipun koneksi internet client lambat).

Direktif Buffer:
- `proxy_buffer_size 128k;` : Buffer untuk HTTP headers respon backend.
- `proxy_buffers 4 256k;` : 4 alokasi buffer berukuran 256k untuk body respon.

**Hafalan:**

```text
proxy_buffering on; proxy_buffers 4 256k; → mengisolasi backend dari koneksi internet client yang lambat
```

---

<a id="bagian-14"></a>

# 14. 🟡 Proxy Timeouts: Menghindari Error 504 Gateway Timeout

## Konsep

Tiga Direktif Timeout Inti:
1. **`proxy_connect_timeout 60s;`** : Waktu maksimal membangun handshake koneksi TCP ke backend.
2. **`proxy_send_timeout 60s;`** : Waktu maksimal mengirim data request ke backend.
3. **`proxy_read_timeout 60s;`** : Waktu maksimal NGINX menunggu balasan respon dari backend sebelum memunculkan **504 Gateway Timeout**.

## Contoh

```nginx
location /api/heavy-export/ {
    proxy_pass http://backend_nodes;

    # Naikkan timeout menjadi 300 detik untuk ekspor laporan data besar
    proxy_connect_timeout 10s;
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;
}
```

**Hafalan:**

```text
proxy_read_timeout 300s; → durasi maksimal menunggu respon pemrosesan data dari server backend
```

---

<a id="bagian-15"></a>

# 15. 🔴 Pengenalan NGINX Proxy Caching & Konfigurasi `proxy_cache_path`

## Konsep

**NGINX Proxy Caching**:
Menyimpan salinan respons HTTP dari backend server ke disk lokal NGINX. Request berikutnya untuk URL yang sama akan **disajikan langsung oleh NGINX dalam ~1 milidetik tanpa menyentuh database backend**.

Konfigurasi Direktori Cache (Wajib di Blok `http {}`):
`proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache_zone:10m max_size=2g inactive=60m use_temp_path=off;`

- **`levels=1:2`** : Struktur hierarki subfolder penyimpanan cache di disk.
- **`keys_zone=my_cache_zone:10m`** : Alokasi 10MB RAM untuk menyimpan metadata index kunci cache (~80.000 URL).
- **`max_size=2g`** : Batas maksimal ukuran disk untuk cache (2 Gigabyte).
- **`inactive=60m`** : File cache yang tidak diakses selama 60 menit akan dihapus otomatis.

**Hafalan:**

```text
proxy_cache_path /var/cache/nginx keys_zone=api_cache:10m max_size=1g; → membuat storage cache respon API
```

---

<a id="bagian-16"></a>

# 16. 🔴 Mengaktifkan dan Mengatur Cache Respons API

## Konsep

Di dalam blok `server` atau `location`:
1. **`proxy_cache cache_zone_name;`** : Mengaktifkan cache menggunakan zone yang telah didefinisikan.
2. **`proxy_cache_valid 200 302 10m;`** : Menyimpan respon status 200/302 selama 10 menit.
3. **`proxy_cache_valid 404 1m;`** : Menyimpan respon 404 selama 1 menit.

## Contoh

```nginx
location /api/public/products {
    proxy_pass http://backend_nodes;

    proxy_cache api_cache;
    proxy_cache_valid 200 15m;
    proxy_cache_valid 404 1m;
}
```

**Hafalan:**

```text
proxy_cache api_cache; proxy_cache_valid 200 10m; → mengaktifkan cache respons sukses HTTP 200 selama 10 menit
```

---

<a id="bagian-17"></a>

# 17. 🔴 Cache Bypass & No-Cache Conditions

## Konsep

Tidak semua request boleh di-cache (misal: request pengguna yang sudah login atau request yang menyertakan header `Cache-Control: no-cache`).

Direktif:
- **`proxy_cache_bypass $variable;`** : Jika variabel bernilai tidak nol/tidak kosong, NGINX akan mengambil data segar langsung dari backend.
- **`proxy_no_cache $variable;`** : Respons yang diterima tidak akan disimpan ke cache.

## Contoh

```nginx
location /api/ {
    proxy_pass http://backend_nodes;
    proxy_cache api_cache;
    proxy_cache_valid 200 10m;

    # Bypass cache jika client mengirim header 'Pragma: no-cache' atau cookie session
    proxy_cache_bypass $http_pragma $cookie_session_id;
    proxy_no_cache $cookie_session_id;
}
```

**Hafalan:**

```text
proxy_cache_bypass $cookie_auth; → melewati cache jika request memiliki cookie otentikasi
```

---

<a id="bagian-18"></a>

# 18. 🔴 Status Header Cache: Memeriksa Cache HIT / MISS / EXPIRED

## Konsep

Untuk memeriksa apakah request dilayani dari memory cache NGINX atau dari backend server:
Gunakan variabel **`$upstream_cache_status`** dan kirimkan via header HTTP:
- **`HIT`** : Data disajikan langsung dari cache NGINX (Ultra Fast).
- **`MISS`** : Data belum ada di cache, diambil dari backend lalu disimpan ke cache.
- **`BYPASS`** : Cache dilewati secara sengaja.
- **`EXPIRED`** : Cache sudah kadaluwarsa, data baru sedang diambil dari backend.

## Contoh

```nginx
location /api/ {
    proxy_pass http://backend_nodes;
    proxy_cache api_cache;
    proxy_cache_valid 200 10m;

    # Sematkan status cache ke browser
    add_header X-Cache-Status $upstream_cache_status always;
}
```

## Hasil Header di Browser Developer Tools

```text
HTTP/1.1 200 OK
Content-Type: application/json
X-Cache-Status: HIT
```

**Hafalan:**

```text
add_header X-Cache-Status $upstream_cache_status always; → memantau efektivitas caching NGINX (HIT/MISS)
```

---

<a id="bagian-19"></a>

# 19. 🔴 Optimasi Upstream HTTP/1.1 Keepalive & Gzip

## Konsep

Secara default, NGINX membuka dan menutup koneksi TCP baru untuk setiap request ke upstream backend (`Connection: close`).

Dengan mengaktifkan **Upstream Keepalive Connection Pools**:
Koneksi TCP antara NGINX dan backend server tetap terbuka (*Reused*), memangkas *TCP 3-way handshake overhead* hingga 50%.

## Contoh

```nginx
upstream optimized_backend {
    server 10.0.0.1:3000;
    server 10.0.0.2:3000;

    # Pertahankan 32 koneksi TCP idle tetap hidup ke setiap backend
    keepalive 32;
}

server {
    listen 80;
    location / {
        proxy_pass http://optimized_backend;

        # Konfigurasi Wajib untuk Mengaktifkan Keepalive ke Upstream
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }
}
```

**Hafalan:**

```text
keepalive 32; proxy_http_version 1.1; proxy_set_header Connection ""; → mengaktifkan connection pooling ke backend
```

---

<a id="bagian-20"></a>

# 20. 🔴 Best Practice & Pola Arsitektur API Gateway Microservices

## Konsep

Dalam arsitektur Microservices, NGINX bertindak sebagai **Unified API Gateway**:
- Domain Publik Tunggal: `https://api.perusahaan.com`
- Routing Berbasis Path:
  - `/api/v1/auth/` $\rightarrow$ Auth Service (Node.js)
  - `/api/v1/users/` $\rightarrow$ User Service (Spring Boot)
  - `/api/v1/orders/` $\rightarrow$ Order Service (Go)
  - `/api/v1/analytics/` $\rightarrow$ Analytics Service (Python)

**Hafalan:**

```text
Pola API Gateway Microservices → rute URL publik tunggal yang memetakan path ke cluster microservice internal
```

---

<a id="bagian-21"></a>

# 21. 🛠️ Peta Ingatan Cepat

```text
               PETA ARSITEKTUR NGINX REVERSE PROXY & LOAD BALANCER
                                        │
       ┌────────────────────────────────┼────────────────────────────────┐
       ▼                                ▼                                ▼
REVERSE PROXY & HEADERS       UPSTREAM LOAD BALANCING         PROXY CACHING & PERFORMANCE
├─ proxy_pass (Trailing Slash) ├─ round-robin (Default)        ├─ proxy_cache_path (Disk/RAM)
├─ 4 Proxy Headers Wajib       ├─ least_conn & ip_hash         ├─ proxy_cache_valid 200 10m
├─ WebSocket (Upgrade/1.1)     ├─ weight, backup & down        ├─ proxy_cache_bypass
└─ FastCGI unix:/php.sock      └─ proxy_next_upstream failover └─ X-Cache-Status ($upstream)
```

---

<a id="bagian-22"></a>

# 22. 📚 Tabel Ringkasan

| Direktif / Parameter | Context | Fungsi & Karakteristik Utama |
|---|---|---|
| `proxy_pass` | `location` | Meneruskan request HTTP ke backend internal |
| `proxy_set_header` | `http/server/location` | Menyematkan header identitas client (`Host`, `X-Real-IP`) |
| `proxy_http_version 1.1`| `http/server/location` | Wajib untuk WebSocket dan Upstream Keepalive Connection |
| `fastcgi_pass` | `location` | Meneruskan request ke socket proses PHP-FPM |
| `upstream` | `http` | Mendefinisikan kelompok cluster server backend |
| `least_conn` | `upstream` | Algoritma penyeimbang ke server dengan koneksi terendah |
| `ip_hash` | `upstream` | Algoritma pengunci IP ke server tertentu (Sticky Session) |
| `weight=N` | `upstream server` | Menentukan porsi bobot pembagian beban trafik |
| `backup` | `upstream server` | Menandai server cadangan darurat |
| `proxy_cache_path` | `http` | Menentukan lokasi direktori disk dan RAM key zone cache |
| `proxy_cache_valid` | `http/server/location` | Menentukan durasi masa aktif cache per status HTTP |
| `proxy_read_timeout` | `http/server/location` | Batas waktu menunggu respon backend (Mencegah 504) |

---

<a id="bagian-23"></a>

# 23. ⚡ Cheat Code NGINX Reverse Proxy 10 Detik

```nginx
# [1] Template Universal Reverse Proxy Node.js / Nuxt / Go
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# [2] Template Upstream Weighted Cluster
upstream app_cluster {
    least_conn;
    server 10.0.0.1:3000 weight=3 max_fails=3 fail_timeout=10s;
    server 10.0.0.2:3000 weight=1 max_fails=3 fail_timeout=10s;
    server 10.0.0.3:3000 backup;
}
```

---

<a id="bagian-24"></a>

# 24. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Kuasai Dasar Reverse Proxy & 4 Header Wajib
├── Konfigurasi proxy_pass ke aplikasi Node.js / Python lokal
└── Pasang proxy_set_header Host, X-Real-IP, dan X-Forwarded-*
       │
       ▼
Langkah 2: Terapkan Upstream Load Balancing & Failover
├── Definisikan cluster upstream dengan algoritma round-robin / least_conn
└── Pasang parameter weight, backup, dan proxy_next_upstream failover
       │
       ▼
Langkah 3: Konfigurasi WebSocket & FastCGI PHP-FPM
├── Pasang header Upgrade & Connection "upgrade" untuk real-time chat
└── Integrasikan fastcgi_pass socket untuk aplikasi Laravel / PHP
       │
       ▼
Langkah 4: Optimasi Performa dengan Proxy Caching & Keepalive
├── Buat direktori proxy_cache_path dan pasang proxy_cache_valid
└── Pantau efisiensi cache via header X-Cache-Status ($upstream_cache_status)
       │
       ▼
Langkah 5: Siap Melangkah ke NGINX Keamanan, SSL/TLS & Performance Tuning!
```

---

<a id="bagian-25"></a>

# 25. 🏗️ Mini Project: Production-Ready High-Availability Microservices API Gateway with Upstream Load Balancer, WebSocket Support, and Dynamic Proxy Caching

Berkas konfigurasi NGINX enterprise lengkap, modular, dan runnable: **Pola API Gateway Microservices (Upstream Cluster Node.js dengan Weight, Layanan Chat WebSocket Real-Time, Backend Monolith Laravel FastCGI, API Public Proxy Caching dengan Header Status, dan Keepalive Pooling)**.

```nginx
# =========================================================================
# /etc/nginx/conf.d/microservices_gateway.conf
# =========================================================================

# -------------------------------------------------------------------------
# [1] PROXY CACHE PATH DEFINITION (DILETAKKAN DI HTTP CONTEXT)
# -------------------------------------------------------------------------
# proxy_cache_path /var/cache/nginx/api_cache 
#     levels=1:2 
#     keys_zone=GATEWAY_CACHE:20m 
#     max_size=2g 
#     inactive=60m 
#     use_temp_path=off;

# -------------------------------------------------------------------------
# [2] UPSTREAM CLUSTERS & LOAD BALANCERS
# -------------------------------------------------------------------------

# Cluster API Produk (Weighted Least Connections)
upstream product_service_cluster {
    least_conn;
    server 10.0.1.10:3000 weight=3 max_fails=2 fail_timeout=5s;
    server 10.0.1.11:3000 weight=2 max_fails=2 fail_timeout=5s;
    server 10.0.1.12:3000 backup; # Server Cadangan
    keepalive 32;
}

# Cluster Layanan Chat Real-Time (IP Hash Sticky Session)
upstream chat_service_cluster {
    ip_hash;
    server 10.0.2.10:4000;
    server 10.0.2.11:4000;
}

# -------------------------------------------------------------------------
# [3] API GATEWAY VIRTUAL HOST
# -------------------------------------------------------------------------
server {
    listen 80;
    server_name api.tokokita.com;

    # Batas Request Body
    client_max_body_size 20M;

    # Logging Gateway
    access_log /var/log/nginx/gateway_access.log combined;
    error_log /var/log/nginx/gateway_error.log warn;

    # ---------------------------------------------------------------------
    # RUTE 1: PUBLIC PRODUCTS API (DENGAN NGINX PROXY CACHE)
    # ---------------------------------------------------------------------
    location /api/v1/products/ {
        proxy_pass http://product_service_cluster;

        # Keepalive Upstream
        proxy_http_version 1.1;
        proxy_set_header Connection "";

        # Client Identity Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Konfigurasi Cache Respons API
        proxy_cache GATEWAY_CACHE;
        proxy_cache_valid 200 10m;
        proxy_cache_valid 404 1m;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503;

        # Bypass Cache untuk Request Khusus
        proxy_cache_bypass $http_cache_control $cookie_auth_token;
        proxy_no_cache $cookie_auth_token;

        # Header Status Cache untuk Debugging
        add_header X-Cache-Status $upstream_cache_status always;

        # Timeouts & Automatic Failover
        proxy_connect_timeout 5s;
        proxy_read_timeout 30s;
        proxy_next_upstream error timeout http_502 http_503;
    }

    # ---------------------------------------------------------------------
    # RUTE 2: REAL-TIME WEBSOCKET CHAT GATEWAY
    # ---------------------------------------------------------------------
    location /socket.io/ {
        proxy_pass http://chat_service_cluster;

        # Protokol WebSocket Upgrade
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        # Durasi Koneksi Persisten Panjang (24 Jam)
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

    # ---------------------------------------------------------------------
    # RUTE 3: MONOLITH LARAVEL BACKOFFICE (FASTCGI PHP-FPM)
    # ---------------------------------------------------------------------
    location /admin/ {
        root /var/www/tokokita_admin/public;
        try_files $uri $uri/ /admin/index.php?$query_string;

        location ~ \.php$ {
            include fastcgi_params;
            fastcgi_pass unix:/run/php/php8.3-fpm.sock;
            fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
            fastcgi_param DOCUMENT_ROOT $realpath_root;
        }
    }
}
```

## Hasil Validasi Sintaks & Pengujian Terminal

```bash
sudo nginx -t
```

## Output

```text
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

---

<a id="bagian-26"></a>

# 26. 🔗 Referensi Resmi

- [NGINX HTTP Proxy Module Reference](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [NGINX HTTP Upstream Module Reference](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)
- [NGINX HTTP FastCGI Module Reference](https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html)
- [NGINX WebSocket Proxying Guide](https://nginx.org/en/docs/http/websocket.html)
