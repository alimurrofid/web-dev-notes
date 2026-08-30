# NGINX Keamanan, SSL & Optimasi Performa Cheatsheet — Mudah Dipahami & Diingat

> **Target:** NGINX 1.24+ untuk pemula yang ingin memahami Keamanan HTTPS (SSL/TLS, Certbot, TLS 1.3), HSTS, Security Headers, Menyembunyikan Identitas (`server_tokens off`), Memblokir File Rahasia (`.env`), Rate Limiting (`limit_req_zone`), Connection Limiting (`limit_conn_zone`), Kompresi Gzip/Brotli, dan Tuning Kernel (`sendfile`, `tcp_nopush`). Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> NGINX adalah lapisan gerbang pertahanan pertama (*First Line of Defense*) yang melindungi infrastruktur backend dari serangan siber, brute-force, DDoS, dan kebocoran data, sekaligus memaksimalkan kecepatan transfer melalui kompresi dan optimasi kernel.

## Daftar Isi

1. [Konfigurasi HTTPS & SSL/TLS](#1-konfigurasi-https--ssltls)
2. [Redirect HTTP ke HTTPS](#2-redirect-http-ke-https)
3. [SSL Hardening & TLS 1.3](#3-ssl-hardening--tls-13)
4. [HSTS & Security Headers](#4-hsts--security-headers)
5. [Hide Version & Block Sensitive Files](#5-hide-version--block-sensitive-files)
6. [Rate Limiting (limit_req)](#6-rate-limiting-limit_req)
7. [Connection Limiting (limit_conn)](#7-connection-limiting-limit_conn)
8. [Kompresi Gzip](#8-kompresi-gzip)
9. [Kernel & Performance Tuning](#9-kernel--performance-tuning)

---

# 1. Konfigurasi HTTPS & SSL/TLS

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
}
```

---

# 2. Redirect HTTP ke HTTPS

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri;
}
```

---

# 3. SSL Hardening & TLS 1.3

```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1d;
ssl_session_tickets off;
```

---

# 4. HSTS & Security Headers

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

---

# 5. Hide Version & Block Sensitive Files

```nginx
server_tokens off;

location ~ /\.(env|git|htaccess|DS_Store) {
    deny all;
    return 404;
}
```

---

# 6. Rate Limiting (limit_req)

```nginx
# Di http context:
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=5r/s;

# Di server/location:
location /api/ {
    limit_req zone=api_limit burst=10 nodelay;
    limit_req_status 429;
}
```

---

# 7. Connection Limiting (limit_conn)

```nginx
limit_conn_zone $binary_remote_addr zone=addr_limit:10m;

location /download/ {
    limit_conn addr_limit 5; # Maksimal 5 koneksi simultan per IP
}
```

---

# 8. Kompresi Gzip

```nginx
gzip on;
gzip_comp_level 5;
gzip_min_length 256;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

---

# 9. Kernel & Performance Tuning

```nginx
sendfile on;
tcp_nopush on;
tcp_nodelay on;
keepalive_timeout 30s;
```
