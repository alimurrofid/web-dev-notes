# NGINX Dasar Cheatsheet — Mudah Dipahami & Diingat

> **Target:** NGINX 1.24+ untuk pemula yang ingin memahami Web Server, Event-Driven Architecture, Perintah CLI (`nginx -t`, `nginx -s reload`), Hierarki Context (`main`, `events`, `http`, `server`, `location`), Serving File Statis (`root` vs `alias`), SPA Routing (`try_files`), Aturan Pencocokan `location` (`=`, `^~`, `~`, `~*`), Custom Error Pages, Logging, dan Variabel Bawaan. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> NGINX adalah web server berkinerja tinggi, reverse proxy, dan load balancer berbasis event-driven non-blocking yang dirancang untuk menangani puluhan ribu koneksi konkuren dengan konsumsi memori minimal.

## Daftar Isi

1. [Perintah CLI NGINX](#1-perintah-cli-nginx)
2. [Anatomi Context nginx.conf](#2-anatomi-context-nginxconf)
3. [Server Block (Virtual Host)](#3-server-block-virtual-host)
4. [Serving File Statis (root vs alias)](#4-serving-file-statis-root-vs-alias)
5. [SPA Routing dengan try_files](#5-spa-routing-dengan-try_files)
6. [Location Matching Modifiers](#6-location-matching-modifiers)
7. [Custom Error Pages](#7-custom-error-pages)
8. [Access & Error Logs](#8-access--error-logs)
9. [Variabel Bawaan Inti](#9-variabel-bawaan-inti)

---

# 1. Perintah CLI NGINX

- `nginx -t` : Menguji kebenaran sintaks file konfigurasi.
- `nginx -s reload` : Me-reload konfigurasi tanpa mematikan server (*Zero Downtime*).
- `nginx -s stop` : Mematikan NGINX secara instan.
- `nginx -s quit` : Mematikan NGINX secara aman (*Graceful Shutdown*).

---

# 2. Anatomi Context nginx.conf

```nginx
# Context Main (Global)
user nginx;
worker_processes auto;

events {
    # Context Events
    worker_connections 1024;
}

http {
    # Context HTTP
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    sendfile on;

    server {
        # Context Server (Virtual Host)
        listen 80;
        server_name example.com;

        location / {
            # Context Location
            root /var/www/html;
            index index.html;
        }
    }
}
```

---

# 3. Server Block (Virtual Host)

Mendefinisikan domain dan port:

```nginx
server {
    listen 80;
    server_name mywebsite.com www.mywebsite.com;

    root /var/www/mywebsite;
    index index.html;
}
```

---

# 4. Serving File Statis (root vs alias)

- `root` : Menggabungkan `root + location + URI`.
- `alias` : Mengganti `location` dengan direktori target.

```nginx
# Request /images/logo.png -> dicari di: /var/www/html/images/logo.png
location /images/ {
    root /var/www/html;
}

# Request /assets/logo.png -> dicari di: /var/www/static/logo.png
location /assets/ {
    alias /var/www/static/;
}
```

---

# 5. SPA Routing dengan try_files

Mengatasi error 404 saat refresh URL pada aplikasi React/Vue:

```nginx
server {
    listen 80;
    server_name spa.example.com;
    root /var/www/spa-app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

# 6. Location Matching Modifiers

- `=` : Exact match (prioritas tertinggi).
- `^~` : Prefix match prioritas (mengabaikan regex).
- `~` : Regex match (Case-Sensitive).
- `~*` : Regex match (Case-Insensitive).
- `/` : Standard prefix match (prioritas terendah).

```nginx
location = /favicon.ico { log_not_found off; }
location ^~ /images/ { root /var/www; }
location ~* \.(jpg|jpeg|png|webp|css|js)$ { expires 30d; }
```

---

# 7. Custom Error Pages

```nginx
error_page 404 /custom_404.html;
location = /custom_404.html {
    root /usr/share/nginx/html;
    internal;
}
```

---

# 8. Access & Error Logs

```nginx
access_log /var/log/nginx/access.log combined;
error_log /var/log/nginx/error.log warn;
```

---

# 9. Variabel Bawaan Inti

- `$host` : Nama hostname/domain request.
- `$uri` : Path URI request saat ini (tanpa query string).
- `$request_uri` : Path URI lengkap beserta query string (`/search?q=1`).
- `$remote_addr` : Alamat IP client pengirim request.
- `$scheme` : Protokol request (`http` atau `https`).
