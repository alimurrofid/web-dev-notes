---
title: "NGINX"
description: "Jalur belajar web server NGINX: konfigurasi server block, reverse proxy performan, load balancing cerdas, dan keamanan enkripsi SSL/TLS."
order: 3
tags:
  - devops
  - nginx
  - web-server
---

# NGINX

> NGINX adalah server HTTP dan reverse proxy berbasis event-driven asinkron yang dirancang khusus untuk menangani ribuan koneksi bersamaan (_high concurrency_) dengan jejak memori yang sangat hemat.

---

## Jalur Pembelajaran Terstruktur

1. 🟢 [[nginx-dasar|NGINX Dasar]] (Modul 1)
   → Arsitektur Master-Worker process, konfigurasi dasar, Server Blocks (Virtual Host), dan penyajian file statis berkecepatan tinggi.
2. 🟡 [[nginx-reverse-proxy|NGINX Reverse Proxy & Load Balancing]] (Modul 2)
   → Direktif proxy_pass, penerusan HTTP header asli pembaca, upstream grouping, dan algoritma load balancing (Round Robin, Least Connections, IP Hash).
3. 🔴 [[nginx-security-ssl|NGINX Security & SSL]] (Modul 3)
   → Instalasi sertifikat HTTPS TLS/SSL via Let's Encrypt / Certbot, mitigasi DoS via Rate Limiting, hardening HTTP security headers, dan proteksi reverse proxy.
