---
title: "Linux"
description: "Jalur belajar sistem operasi Linux distro Ubuntu Server LTS: navigasi CLI, manajemen berkas & hak akses, administrasi proses Systemd, hardening SSH & firewall UFW, serta otomasi Bash scripting."
order: 2
tags:
  - devops
  - linux
  - ubuntu
  - sysadmin
  - infrastructure
---

# Linux (Ubuntu Server LTS)

> Linux adalah sistem operasi inti yang menopang lebih dari 90% infrastruktur cloud, kontainer, dan web server di dunia. Di ekosistem DevOps, distribusi **Ubuntu Server LTS (Long Term Support)** menjadi standar de facto berkat stabilitasnya, siklus pembaruan keamanan terjamin hingga 5 tahun, ketersediaan paket software yang luas, serta dukungan penuh dari seluruh penyedia cloud utama (AWS, GCP, DigitalOcean, Hetzner, dll.).

---

## Mental Model: Posisi Linux di DevOps

Linux berperan sebagai landasan utama (*bedrock*) tempat seluruh pilar teknologi web berjalan:

```text
               ┌──────────────────────────────────────────────┐
               │         APLIKASI WEB & BACKEND API           │
               │   (Laravel, Node.js, Spring Boot, Go, dll.)  │
               └──────────────────────┬───────────────────────┘
                                      │
               ┌──────────────────────▼───────────────────────┐
               │      WEB SERVER & REVERSE PROXY (NGINX)      │
               │         Routing, SSL/TLS, Caching            │
               └──────────────────────┬───────────────────────┘
                                      │
               ┌──────────────────────▼───────────────────────┐
               │    CONTAINER & WORKFLOW (Docker & Git)       │
               │         Packaging, Image, CI/CD              │
               └──────────────────────┬───────────────────────┘
                                      │
 ═════════════════════════════════════▼═════════════════════════════════════
   SISTEM OPERASI LINUX (Ubuntu Server LTS: Kernel, Systemd, UFW, Network)
 ════════════════════════════════════════════════════════════════════════════
                                      │
                                      ▼
                        HARDWARE / CLOUD VPS / VM
```

---

## Jalur Pembelajaran Terstruktur

Materi Linux ini disusun secara bertahap, mulai dari penguasaan antarmuka teks murni (CLI) hingga pengamanan server produksi yang siap menerima trafik publik:

1. 🟢 [[linux-dasar|Linux Dasar & CLI Ubuntu]] (Modul 1)
   → Filesystem Hierarchy Standard (FHS), navigasi berkas, text streams & I/O redirection, user privilege (`sudo`), perizinan hak akses (`chmod`/`chown`), dan package management APT.
2. 🟡 [[linux-administrasi-sistem|Linux Administrasi Sistem]] (Modul 2)
   → Manajemen proses (`ps`, `htop`, signal `kill`), runtime supervisor dengan Systemd (`systemctl`), pembuatan unit service custom, pembacaan log `journalctl`, task scheduling Cron, dan pemantauan resource server.
3. 🔴 [[linux-networking-security|Linux Networking & Server Hardening]] (Modul 3)
   → Diagnostik jaringan (`ip`, `ss`, `curl`), remote access aman via SSH Keypair, SSH hardening (mematikan root & password auth), UFW Firewall, mitigasi brute-force Fail2ban, dan sinkronisasi berkas `rsync`.
4. 🛠️ [[linux-bash-scripting|Linux Bash Scripting untuk DevOps]] (Modul 4)
   → Fondasi Bash scripting defensif (`set -euo pipefail`), penanganan argumen CLI, kondisional & looping, error handling, serta pembuatan script otomasi backup dan pemeliharaan server.
