---
title: "Linux Administrasi Sistem"
description: "Administrasi sistem operasi Linux Ubuntu Server: Manajemen proses, runtime daemon dengan Systemd, analisis log journalctl, penjadwalan tugas Cron, dan monitoring sumber daya."
order: 2
tags:
  - devops
  - linux
  - ubuntu
  - sysadmin
  - systemd
---

# Linux Administrasi Sistem

> **Target:** Web Developer & DevOps Engineer yang ingin mengoperasikan backend web application (Node.js, Python, Go, atau Laravel worker) secara berkelanjutan, memantau penggunaan resource server (CPU, RAM, Disk), membuat daemon service tahan crash, dan mengotomasi tugas rutin.
> **Versi:** Ubuntu Server 24.04 LTS / 22.04 LTS (Systemd v255 / v249).
> Fokus modul ini: **Mental model proses Linux → Monitoring utilisasi (`top`, `htop`, `ps`) → Sinyal terminasi (`SIGTERM` vs `SIGKILL`) → Arsitektur Systemd Init (PID 1) → Pembuatan Custom Service Unit (`/etc/systemd/system/`) → Analisis log sistem (`journalctl` & `logrotate`) → Otomasi tugas terjadwal (Cron) → Manajemen storage & Symbolic Links (`ln -s`) → Mini project Background Worker Daemon**.

---

## Cara Belajar

```text
🟢 Fundamental (Wajib Dipahami)
├── Mental Model Proses Linux (PID, PPID, Foreground vs Background)
├── Sinyal Terminasi Terstruktur (SIGTERM 15 vs SIGKILL 9)
├── Monitoring Sumber Daya Sistem (ps, top, htop, free, df)
└── Manajemen Service Dasar (systemctl status/start/stop/restart)

🟡 Intermediate (Pemahaman Operasional)
├── Arsitektur Unit File Systemd (/etc/systemd/system/nama.service)
├── Pembuatan Background Worker Service dengan Auto-Restart
├── Investigasi Error & Live Log Stream via journalctl
└── Penjadwalan Otomasi Tugas via Crontab (* * * * *)

🔴 Advanced / Stabilitas Server
├── Penanganan Out-Of-Memory (OOM Killer) & Konfigurasi Swap
├── Pemeliharaan Ruang Disk (Log Rotation & Log Retention)
└── Deployment Tanpa Downtime menggunakan Symbolic Links (ln -s)
```

---

## Mental Model: Dari Terminal Sesi ke Systemd Daemon

Ketika Anda menjalankan aplikasi melalui SSH terminal biasa (misal: `node server.js` atau `python app.py`), aplikasi tersebut berjalan sebagai **child process** dari sesi SSH Anda. Begitu koneksi internet terputus atau Anda menutup jendela terminal, sesi SSH akan mati dan mengirimkan sinyal `SIGHUP` yang **ikut mematikan seluruh aplikasi Anda**:

```text
       Skenario Berisiko: Menjalankan Langsung di Terminal Sesi
       ┌─────────────────────────────────────────────────────┐
       │                 Terminal SSH Client                 │
       └──────────────────────────┬──────────────────────────┘
                                  │ (Mati saat koneksi putus)
                                  ▼
       ┌─────────────────────────────────────────────────────┐
       │                Sesi Shell User (Bash)               │
       └──────────────────────────┬──────────────────────────┘
                                  │ Mengirim sinyal SIGHUP
                                  ▼
       ┌─────────────────────────────────────────────────────┐
       │         Aplikasi Web Anda (TERBUNUH / MATI!)         │
       └─────────────────────────────────────────────────────┘

       Solusi Produksi: Dikelola oleh Systemd Supervisor (PID 1)
       ┌─────────────────────────────────────────────────────┐
       │                    KERNEL LINUX                     │
       └──────────────────────────┬──────────────────────────┘
                                  │ Meluncurkan init system
                                  ▼
       ┌─────────────────────────────────────────────────────┐
       │              SYSTEMD SUPERVISOR (PID 1)             │
       │    Menjamin aplikasi tetap hidup, me-restart jika   │
       │     crash, dan otomatis menyala saat server reboot  │
       └──────────────────────────┬──────────────────────────┘
                                  │
                                  ▼
       ┌─────────────────────────────────────────────────────┐
       │       Aplikasi Web / Background Worker Daemon       │
       │                  (SELALU BERJALAN)                  │
       └─────────────────────────────────────────────────────┘
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Mental Model & Manajemen Proses Linux](#1--mental-model--manajemen-proses-linux)
2. [Monitoring Resource Sistem (CPU, RAM, & Disk)](#2--monitoring-resource-sistem-cpu-ram--disk)
3. [Service Management Modern dengan Systemd](#3--service-management-modern-dengan-systemd)

### 🟡 Intermediate

4. [Membuat Custom Systemd Service Unit](#4--membuat-custom-systemd-service-unit)
5. [Analisis Log dengan Journalctl & Logrotate](#5--analisis-log-dengan-journalctl--logrotate)
6. [Penjadwalan Tugas Terjadwal (Cron Jobs)](#6--penjadwalan-tugas-terjadwal-cron-jobs)
7. [Storage, Kapasitas Disk, dan Symbolic Links](#7--storage-kapasitas-disk-dan-symbolic-links)

### 🛠️ Praktik

8. [Mini Project: Mengonfigurasi Daemon Service & Cron Backup](#8-️-mini-project-mengonfigurasi-daemon-service--cron-backup)

### 📚 Referensi

9. [Ringkasan & Peta Ingatan](#9--ringkasan--peta-ingatan)
10. [Urutan Belajar Berikutnya](#10--urutan-belajar-berikutnya)
11. [Referensi Resmi](#11--referensi-resmi)

---

## 1. 🟢 Mental Model & Manajemen Proses Linux

### Konsep

Setiap program atau perintah yang sedang berjalan di Linux disebut **Proses**. Sistem operasi mengenali setiap proses menggunakan identitas angka unik yang disebut **PID (Process ID)**.

- **PID 1:** Proses pertama yang diluncurkan oleh Linux Kernel saat komputer menyala (pada Ubuntu modern adalah `systemd`). Semua proses lainnya adalah anak (*child*) dari PID 1.
- **PPID (Parent Process ID):** ID dari proses induk yang melahirkan proses terkait.

### Menampilkan Daftar Proses

```bash
# Menampilkan seluruh proses yang berjalan di sistem
ps aux

# Mencari proses tertentu menggunakan pipeline grep
ps aux | grep "node"
ps aux | grep "nginx"
```

Kolom penting pada output `ps aux`:
* `USER`: User yang menjalankan proses tersebut.
* `PID`: ID proses unik.
* `%CPU` & `%MEM`: Persentase utilisasi processor dan RAM.
* `VSZ` & `RSS`: Virtual memory size dan memori fisik asli (*Resident Set Size*) dalam kilobyte.
* `STAT`: Status proses (`R` untuk Running, `S` untuk Sleeping/Idle, `Z` untuk Zombie).
* `COMMAND`: Perintah biner yang mengeksekusi proses.

### Foreground vs Background Process

Ketika perintah memakan waktu lama, Anda dapat memindahkannya ke latar belakang (*background*):

```bash
# Menjalankan perintah langsung di background dengan simbol '&' di akhir
php artisan queue:work &

# Jika perintah sedang berjalan di foreground terminal:
# 1. Tekan 'Ctrl + Z' untuk men-suspend proses sementara
# 2. Ketik 'bg' untuk melanjutkan proses tersebut di background
bg

# Menampilkan daftar proses background dalam sesi terminal saat ini
jobs

# Mengembalikan proses background ke foreground terminal
fg %1
```

### Menghentikan Proses dengan Sinyal Linux (Signals)

Proses di Linux berkomunikasi melalui sistem sinyal (*Signals*). Ketika Anda ingin mematikan sebuah proses, kirimkan sinyal menggunakan utilitas `kill`:

```text
                      Daftar Sinyal Penting Linux
                      
 ┌─────────┬──────────────┬──────────────────────────────────────────┐
 │ Sinyal  │ Nama         │ Penjelasan & Perilaku                    │
 ├─────────┼──────────────┼──────────────────────────────────────────┤
 │   15    │ SIGTERM      │ Standard Graceful Shutdown (Default).    │
 │         │              │ Meminta aplikasi menutup koneksi database│
 │         │              │ dan menyelesaikan request sebelum mati.  │
 ├─────────┼──────────────┼──────────────────────────────────────────┤
 │    9    │ SIGKILL      │ Force Kill (Pembunuhan Paksa).          │
 │         │              │ Kernel langsung menghentikan proses tanpa│
 │         │              │ ampun. Aplikasi tidak bisa intercept ini.│
 ├─────────┼──────────────┼──────────────────────────────────────────┤
 │    1    │ SIGHUP       │ Hangup Signal. Sering digunakan untuk    │
 │         │              │ meminta aplikasi reload file konfigurasi.│
 └─────────┴──────────────┴──────────────────────────────────────────┘
```

Contoh Perintah Penghentian Proses:

```bash
# Menghentikan secara baik-baik (SIGTERM - Rekomendasi Utama)
kill -15 14205
# atau cukup:
kill 14205

# Mematikan secara paksa hanya jika aplikasi macet/unresponsive total (SIGKILL)
kill -9 14205

# Menghentikan berdasarkan nama program (menggunakan pkill atau killall)
pkill -f "python3 worker.py"
```

> [!CAUTION]
> **Hindari membiasakan diri langsung menggunakan `kill -9`!**
> Membunuh proses database (PostgreSQL/MySQL) atau aplikasi backend dengan `kill -9` dapat menyebabkan file lock tertinggal atau korupsi data transaksi yang sedang ditulis ke disk. Selalu coba `kill -15` terlebih dahulu.

---

## 2. 🟢 Monitoring Resource Sistem (CPU, RAM, & Disk)

### Konsep

Sebagai pengelola server, Anda harus mampu mendeteksi penyebab sistem melambat (*bottleneck*), apakah karena kehabisan RAM, CPU tersaturasi 100%, atau disk penyimpanan penuh.

### A. Monitoring Real-Time dengan `htop`

Meskipun `top` sudah terpasang secara bawaan, utilitas **`htop`** menyediakan antarmuka visual berwarna yang jauh lebih intuitif.

```bash
# Pasang jika belum ada
sudo apt install -y htop

# Jalankan monitoring interaktif
htop
```

Cara membaca metrik penting di `htop`:
1. **CPU Bars:** Menunjukkan persentase beban setiap core CPU.
2. **Mem Bar:** Menunjukkan pemakaian memori fisik. Jika bar mendekati batas kanan dan Swap mulai terisi tinggi, server mengalami krisis memori.
3. **Load Average (1, 5, 15 menit):** Rasio antrean tugas CPU. Jika angka load average melebihi jumlah core CPU fisik server Anda, artinya terjadi antrean proses (*CPU bottleneck*).
4. **Navigasi Tombol F:**
   * `F3`: Mencari nama proses.
   * `F4`: Memfilter daftar tampilan proses.
   * `F6`: Mengurutkan daftar (misal berdasarkan `%CPU` atau `%MEM`).
   * `F9`: Mengirim sinyal `kill` langsung dari dashboard.
   * `F10`: Keluar dari `htop`.

### B. Memeriksa Pemakaian RAM dengan `free`

```bash
# Menampilkan statistik RAM dalam megabyte (-m) atau gigabyte (-g)
free -m
```

Output:

```text
               total        used        free      shared  buff/cache   available
Mem:            3919        1240         412          24        2267        2395
Swap:           2048          64        1984
```

> [!NOTE]
> **Jangan panik jika kolom `free` terlihat kecil!**
> Linux secara cerdas memanfaatkan sisa RAM yang tidak terpakai sebagai **`buff/cache`** untuk mempercepat pembacaan disk. Nilai kapasitas RAM sebenarnya yang siap digunakan oleh aplikasi baru tercermin pada kolom **`available`**.

---

## 3. 🟡 Service Management Modern dengan Systemd

### Konsep

**Systemd** adalah sistem inisialisasi (*Init System*) dan pengelola layanan (*Service Manager*) standar pada distribusi Linux Ubuntu modern. Semua background service (seperti NGINX, PostgreSQL, Docker, SSH) didaftarkan sebagai **Unit** di bawah supervisi Systemd.

### Operasi Service dengan Perintah `systemctl`

```bash
# 1. Memeriksa status terkini sebuah layanan
sudo systemctl status nginx

# 2. Menjalankan layanan
sudo systemctl start nginx

# 3. Menghentikan layanan
sudo systemctl stop nginx

# 4. Merestart layanan (mematikan lalu menyalakan ulang)
sudo systemctl restart nginx

# 5. Me-reload konfigurasi baru tanpa memutus koneksi aktif (Zero Downtime)
sudo systemctl reload nginx

# 6. Mengaktifkan layanan agar otomatis menyala saat server booting
sudo systemctl enable nginx

# 7. Menonaktifkan layanan dari auto-start booting
sudo systemctl disable nginx

# 8. Mengetahui apakah layanan aktif berjalan (berguna untuk conditional script)
systemctl is-active --quiet nginx && echo "Layanan Sedang Berjalan"
```

---

## 4. 🟡 Membuat Custom Systemd Service Unit

### Konsep

Untuk menjalankan aplikasi web Anda (misal: Express.js, FastAPI, Go binary, atau Laravel Queue Worker) sebagai background daemon permanen di Ubuntu, buatlah berkas **Unit Service** berekstensi `.service` di direktori:

```text
/etc/systemd/system/nama-aplikasi.service
```

### Anatomi Berkas Unit Service

Contoh konfigurasi untuk aplikasi Node.js/Express:

```ini
[Unit]
Description=Backend REST API Service
After=network.target mysql.service
Wants=mysql.service

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/my-api
EnvironmentFile=/var/www/my-api/.env
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5s
StandardOutput=journal
StandardError=journal
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
```

Penjelasan Bagian-Bagian Penting:
- **`[Unit]`**:
  * `Description`: Deskripsi manusiawi mengenai fungsi service.
  * `After`: Menentukan urutan start. Service ini baru akan dinyalakan setelah jaringan (`network.target`) dan database siap.
- **`[Service]`**:
  * `User` & `Group`: Menjalankan aplikasi di bawah user aman non-root (`www-data`).
  * `WorkingDirectory`: Direktori absolut tempat aplikasi berada.
  * `EnvironmentFile`: File path yang memuat pasangan key-value konfigurasi rahasia.
  * `ExecStart`: Perintah absolut lengkap yang digunakan untuk menyalakan aplikasi.
  * `Restart=always`: Jika aplikasi mengalami error fatal (*crash*), Systemd akan otomatis menyalakannya kembali.
  * `RestartSec=5s`: Jeda waktu tunggu 5 detik sebelum mencoba menyalakan kembali (mencegah *restart loop flooding*).
  * `LimitNOFILE`: Meningkatkan batas kapasitas file descriptor (koneksi socket terbuka).
- **`[Install]`**:
  * `WantedBy=multi-user.target`: Menjadikan service ini menyala saat sistem masuk ke runlevel multi-user (kondisi normal server).

### Prosedur Mendaftarkan Service Baru

Setiap kali Anda membuat atau mengubah file unit di `/etc/systemd/system/`, lakukan tahapan berikut:

```bash
# 1. Beritahu Systemd untuk me-refresh dan membaca ulang seluruh file konfigurasi
sudo systemctl daemon-reload

# 2. Nyalakan service baru tersebut
sudo systemctl start my-api

# 3. Aktifkan auto-start saat server dinyalakan
sudo systemctl enable my-api

# 4. Verifikasi status berjalan
sudo systemctl status my-api
```

---

## 5. 🟡 Analisis Log dengan Journalctl & Logrotate

### Konsep

Ketika aplikasi berjalan sebagai daemon di Systemd, seluruh output teks (`stdout` dan `stderr`) secara otomatis ditangkap oleh sub-sistem **Systemd Journal (systemd-journald)**.

### Perintah Esensial `journalctl`

```bash
# 1. Memantau log service secara real-time (mirip tail -f)
sudo journalctl -u my-api -f

# 2. Menampilkan 100 baris log terakhir dari service tertentu
sudo journalctl -u my-api -n 100

# 3. Menampilkan log yang tercatat sejak waktu tertentu
sudo journalctl -u my-api --since "2026-09-16 08:00:00"
sudo journalctl -u my-api --since "1 hour ago"

# 4. Memfilter hanya log yang berkategori Error (priority level 3 / err)
sudo journalctl -u my-api -p err

# 5. Membersihkan arsip log lama jika menghabiskan kapasitas disk
sudo journalctl --vacuum-size=500M
```

### Rotasi Berkas Log Tradisional (`logrotate`)

Untuk log yang ditulis langsung ke file berkas di `/var/log/`, Linux menyediakan utilitas **`logrotate`**. Utilitas ini secara berkala mengompres log lama menjadi file `.gz`, memotong file yang terlalu besar, dan menghapus log yang usang.

Contoh konfigurasi di `/etc/logrotate.d/my-api`:

```text
/var/www/my-api/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
}
```

* `daily`: Log dirotasi setiap hari sekali.
* `rotate 14`: Sistem hanya menyimpan arsip log selama 14 hari terakhir. File log hari ke-15 akan dihapus otomatis.
* `compress`: Berkas log lama dikompresi menggunakan gzip untuk menghemat 80-90% ruang disk.

---

## 6. 🟡 Penjadwalan Tugas Terjadwal (Cron Jobs)

### Konsep

**Cron** adalah daemon Linux yang bertugas mengeksekusi script atau perintah secara otomatis pada jadwal waktu yang ditentukan (menit, jam, hari, atau bulan).

### Format Sintaks Crontab

Jadwal cron didefinisikan dengan **5 bintang** penanda waktu:

```text
 *  *  *  *  *  /path/to/command
 │  │  │  │  │
 │  │  │  │  └───── Hari dalam seminggu (0 - 6) (0 = Minggu)
 │  │  │  └──────── Bulan (1 - 12)
 │  │  └─────────── Tanggal / Hari dalam sebulan (1 - 31)
 │  └────────────── Jam (0 - 23)
 └───────────────── Menit (0 - 59)
```

### Contoh Pola Jadwal Populer

| Jadwal Cron | Waktu Eksekusi |
|---|---|
| `* * * * *` | Setiap menit tanpa henti |
| `*/5 * * * *` | Setiap 5 menit sekali |
| `0 * * * *` | Setiap jam tepat di menit ke-00 |
| `0 2 * * *` | Setiap hari pukul 02:00 dini hari (Jadwal favorit backup) |
| `0 0 * * 0` | Setiap pekan pada hari Minggu tengah malam (00:00) |

### Mengelola Berkas Crontab

```bash
# Membuka editor crontab untuk user yang sedang aktif
crontab -e

# Melihat daftar jadwal cron aktif
crontab -l

# Mengelola crontab untuk user tertentu (misal www-data)
sudo crontab -u www-data -e
```

Contoh Baris Crontab Server Produksi:

```bash
# Menjalankan scheduler Laravel setiap menit
* * * * * /usr/bin/php /var/www/my-api/artisan schedule:run >> /var/log/laravel-cron.log 2>&1

# Menjalankan backup database PostgreSQL setiap hari pukul 03:00 pagi
0 3 * * * /usr/local/bin/backup-database.sh > /dev/null 2>&1
```

> [!TIP]
> **Gunakan Path Absolut di Cron!**
> Environment `PATH` di dalam daemon Cron sangat terbatas (biasanya hanya `/usr/bin:/bin`). Selalu gunakan absolute path untuk program (misal `/usr/bin/node` alih-alih `node`, atau `/usr/bin/php` alih-alih `php`).

---

## 7. 🟡 Storage, Kapasitas Disk, dan Symbolic Links

### Memantau Penggunaan Kapasitas Penyimpanan

```bash
# 1. df: Disk Free (Memeriksa sisa kapasitas seluruh partisi/mount point)
df -h
```

Output:

```text
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        40G   14G   25G  36% /
tmpfs           1.9G     0  1.9G   0% /dev/shm
```

```bash
# 2. du: Disk Usage (Mengukur ukuran spesifik direktori dan subfoldernya)
# Menemukan folder mana di dalam /var yang paling boros tempat
sudo du -sh /var/* | sort -h
```

### Symbolic Links (`ln -s`)

**Symbolic Link (Symlink)** adalah jalan pintas (*shortcut*) di level filesystem yang merujuk ke file atau direktori lain. Jika file sumber diubah, isi symlink otomatis ikut terperbarui.

```bash
# Sintaks: ln -s <path_target_asli> <path_link_baru>
ln -s /var/www/releases/v2.1.0 /var/www/current
```

### Pola Industri: Zero-Downtime Deployment Menggunakan Symlink

Framework deployment modern (seperti Envoy, Deployer, Capistrano) menggunakan struktur direktori berikut untuk merilis versi baru aplikasi tanpa memicu downtime:

```text
/var/www/my-app/
├── releases/
│   ├── v1.0.0/
│   └── v2.0.0/ (Versi Baru)
├── shared/
│   └── .env    (File konfigurasi bersama)
└── current ───> Merujuk ke /var/www/my-app/releases/v2.0.0 via Symlink
```

Ketika deploy rilis baru selesai diuji, Anda cukup mengalihkan link `current`:

```bash
ln -sfn /var/www/my-app/releases/v2.0.0 /var/www/my-app/current
```

Perubahan rute ini berlangsung secara instan (*atomic operation*) di tingkat kernel Linux!

---

## 8. 🛠️ Mini Project: Mengonfigurasi Daemon Service & Cron Backup

### Tujuan

Membangun background worker Node.js sederhana, membungkusnya menjadi unit service Systemd yang tahan banting (auto-restart saat crash), dan menjadwalkan tugas cron job harian.

### Langkah Implementasi

#### Langkah 1: Menyiapkan Program Background Worker

Buat direktori proyek dan script worker sederhana:

```bash
sudo mkdir -p /opt/app-worker
sudo chown -R $USER:$USER /opt/app-worker

cat << 'EOF' > /opt/app-worker/worker.js
const fs = require('fs');

console.log('Worker daemon started with PID:', process.pid);

setInterval(() => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] Worker aktif memproses antrean tugas...\n`;
    fs.appendFileSync('/opt/app-worker/activity.log', logMessage);
    console.log(logMessage.trim());
}, 5000);
EOF
```

#### Langkah 2: Membuat File Systemd Unit

Buat berkas service di direktori `/etc/systemd/system/`:

```bash
sudo bash -c "cat << 'EOF' > /etc/systemd/system/app-worker.service
[Unit]
Description=Background Worker Application
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=/opt/app-worker
ExecStart=/usr/bin/node /opt/app-worker/worker.js
Restart=always
RestartSec=3s
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF"
```

#### Langkah 3: Mengaktifkan dan Menguji Ketahanan Service

```bash
# Reload Systemd
sudo systemctl daemon-reload

# Nyalakan dan aktifkan auto-start
sudo systemctl start app-worker
sudo systemctl enable app-worker

# Cek status
sudo systemctl status app-worker
```

**Uji Ketahanan (Simulasi Crash):**
Ambil PID worker dari `systemctl status` atau `pgrep`, lalu matikan secara paksa:

```bash
sudo pkill -9 -f "worker.js"
```

Periksa kembali status service setelah jeda 3 detik:

```bash
sudo systemctl status app-worker
```

*Hasil:* Systemd secara otomatis membangkitkan kembali proses baru dengan PID yang berbeda! Layanan Anda tidak pernah mati permanen.

#### Langkah 4: Menjadwalkan Cron Backup Harian

Tambahkan jadwal backup ke crontab user:

```bash
crontab -l 2>/dev/null; echo "0 2 * * * cp /opt/app-worker/activity.log /opt/app-worker/activity-\$(date +\%Y\%m\%d).log.bak" | crontab -
```

---

## 9. 📚 Ringkasan & Peta Ingatan

### Peta Ingatan Konsep

```text
Administrasi Sistem Linux
├── Manajemen Proses
│   ├── ps aux / htop      → Melihat utilisasi & daftar proses
│   ├── kill -15 (SIGTERM) → Penghentian normal (Graceful)
│   └── kill -9 (SIGKILL)  → Penghentian paksa darurat
├── Systemd Supervisor
│   ├── systemctl          → start, stop, restart, reload, enable
│   ├── daemon-reload      → Refresh definisi file service
│   └── myapp.service      → Definisi [Unit], [Service], [Install]
├── Logging & Audit
│   ├── journalctl -u app -f → Live streaming log service
│   └── logrotate          → Rotasi dan kompresi log berkala
├── Penjadwalan Tugas
│   └── crontab -e         → Format (* * * * *) menit, jam, hari, bln, pek
└── Kapasitas & Storage
    ├── df -h              → Kapasitas sisa partisi disk
    ├── du -sh *           → Pengukuran ukuran folder
    └── ln -s              → Symbolic link untuk rilis versi
```

### Cheat Code 10 Detik

```text
htop                           → monitor interaktif CPU/RAM/Load
free -m                        → cek ketersediaan sisa RAM
kill -15 <PID>                 → matikan proses secara aman
systemctl restart <app>        → restart service aplikasi
journalctl -u <app> -f         → tonton log service secara live
systemctl daemon-reload        → wajib setelah edit file .service
df -h                          → cek sisa kapasitas harddisk
ln -sfn <target> <link>        → update symlink secara aman
```

---

## 10. 🧭 Urutan Belajar Berikutnya

1. **Lanjut ke Modul 3:** [[linux-networking-security|Linux Networking & Server Hardening]] untuk memproteksi server publik Anda via firewall **UFW**, mengamankan remote access dengan **SSH Keypair**, mitigasi brute-force via **Fail2ban**, dan sinkronisasi file deployment dengan **Rsync**.
2. **Kombinasikan dengan NGINX:** Konfigurasikan NGINX sebagai reverse proxy di depan Systemd custom service Anda dengan panduan [[nginx-reverse-proxy|NGINX Reverse Proxy]].
3. **Kombinasikan dengan Docker:** Pelajari bagaimana Systemd mengelola Docker daemon pada modul [[docker-dasar|Docker Dasar]].

---

## 11. 🔗 Referensi Resmi

- [Systemd System and Service Manager Documentation](https://systemd.io/)
- [Ubuntu Server System Monitoring Guide](https://ubuntu.com/server/docs/monitoring)
- [Linux Man Pages: systemctl(1)](https://man7.org/linux/man-pages/man1/systemctl.1.html)
- [Linux Man Pages: crontab(5)](https://man7.org/linux/man-pages/man5/crontab.5.html)
