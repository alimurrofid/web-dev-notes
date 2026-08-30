# NGINX Reverse Proxy & Load Balancing Cheatsheet — Mudah Dipahami & Diingat

> **Target:** NGINX 1.24+ untuk pemula yang ingin memahami Reverse Proxy (`proxy_pass`), Proxy Headers (`Host`, `X-Real-IP`, `X-Forwarded-For`), WebSocket Proxying, Upstream Load Balancing (`round-robin`, `least_conn`, `ip_hash`, `weight`), FastCGI PHP-FPM, dan Proxy Caching. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> NGINX bertindak sebagai gerbang terdepan (Reverse Proxy) yang menerima koneksi publik dan mendistribusikannya ke cluster server backend (Node.js, Go, Python, Java, PHP) secara transparan, aman, dan berkecepatan tinggi.

## Daftar Isi

1. [Reverse Proxy Dasar](#1-reverse-proxy-dasar)
2. [Proxy Headers Wajib](#2-proxy-headers-wajib)
3. [WebSocket Proxying](#3-websocket-proxying)
4. [FastCGI PHP-FPM](#4-fastcgi-php-fpm)
5. [Upstream Load Balancing](#5-upstream-load-balancing)
6. [Algoritma Load Balancing](#6-algoritma-load-balancing)
7. [Upstream Weight & Failover](#7-upstream-weight--failover)
8. [Proxy Timeouts](#8-proxy-timeouts)
9. [Proxy Caching](#9-proxy-caching)

---

# 1. Reverse Proxy Dasar

Meneruskan request ke backend application server:

```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}
```

---

# 2. Proxy Headers Wajib

Meneruskan data asli client ke backend:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

# 3. WebSocket Proxying

Mendukung koneksi real-time (Socket.io / ws):

```nginx
location /socket.io/ {
    proxy_pass http://127.0.0.1:4000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

---

# 4. FastCGI PHP-FPM

Meneruskan request file `.php` ke PHP-FPM Socket:

```nginx
location ~ \.php$ {
    include fastcgi_params;
    fastcgi_pass unix:/run/php/php8.3-fpm.sock;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
}
```

---

# 5. Upstream Load Balancing

Mendefinisikan cluster server di context `http`:

```nginx
upstream nodejs_cluster {
    server 10.0.0.1:3000;
    server 10.0.0.2:3000;
}

server {
    listen 80;
    location / {
        proxy_pass http://nodejs_cluster;
    }
}
```

---

# 6. Algoritma Load Balancing

- **Round-Robin** (Default): Bergantian merata.
- **`least_conn;`** : Mengarahkan ke server dengan koneksi paling sedikit.
- **`ip_hash;`** : Mengikat client IP ke server yang sama (Sticky Session).

```nginx
upstream api_cluster {
    least_conn;
    server 10.0.0.1:3000;
    server 10.0.0.2:3000;
}
```

---

# 7. Upstream Weight & Failover

```nginx
upstream app_cluster {
    server 10.0.0.1:3000 weight=3; # Menerima 75% trafik
    server 10.0.0.2:3000 weight=1; # Menerima 25% trafik
    server 10.0.0.3:3000 backup;   # Aktif hanya jika 1 & 2 mati
}
```

---

# 8. Proxy Timeouts

Mencegah error 504 Gateway Timeout:

```nginx
proxy_connect_timeout 60s;
proxy_send_timeout 60s;
proxy_read_timeout 60s;
```

---

# 9. Proxy Caching

Menyimpan respons API di disk NGINX:

```nginx
# Di http context:
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;

# Di server/location context:
location /api/ {
    proxy_pass http://nodejs_cluster;
    proxy_cache api_cache;
    proxy_cache_valid 200 10m;
    add_header X-Cache-Status $upstream_cache_status;
}
```
