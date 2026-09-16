---
title: "Linux Networking & Server Hardening"
description: "Keamanan dan jaringan server Linux Ubuntu: Diagnostik konektivitas, otentikasi SSH Keypair Ed25519, hardening sshd_config, firewall UFW, proteksi brute-force Fail2ban, dan sinkronisasi berkas Rsync."
order: 3
tags:
  - devops
  - linux
  - ubuntu
  - security
  - networking
  - ssh
  - ufw
---

# Linux Networking & Server Hardening

> **Target:** Web Developer, DevOps Engineer, dan Sysadmin yang bertanggung jawab menyiapkan server VPS Ubuntu (AWS EC2, DigitalOcean, Hetzner, GCP, dll.) dari kondisi mentah (*fresh install*) menjadi lingkungan produksi yang tangguh, aman dari serangan brute-force, dan siap melayani trafik publik.
> **Versi:** Ubuntu Server 24.04 LTS / 22.04 LTS (OpenSSH 9.x, UFW, Fail2ban 1.0+).
> Fokus modul ini: **Inspeksi jaringan & socket listening (`ss -tulpn`, `ip a`) → Kriptografi SSH Keypair (`Ed25519`) → Hardening SSH Daemon (`sshd_config`) → Kebijakan Firewall UFW (*Default Deny*) → Mitigasi Brute-Force dengan Fail2ban → Transfer file rilis performan via `rsync` → Pengamanan Environment Variables → Mini Project: Zero-to-Hero Production Server Hardening Checklist**.

---

## Cara Belajar

```text
🟢 Fundamental (Wajib Dipahami)
├── Diagnostik Jaringan & Pengecekan Socket Terbuka (ip, ping, curl, ss -tulpn)
├── Remote Access Aman via Kriptografi SSH Keypair (Ed25519)
└── Pengiriman File Efisien Antar-Server Menggunakan Rsync

🟡 Intermediate (Konfigurasi Keamanan)
├── Pengelolaan Firewall Server dengan UFW (Uncomplicated Firewall)
├── Isolasi Port Database & Layanan Internal dari Akses Publik
└── Manajemen Environment Variables & Secrets Persisten

🔴 Advanced / Hardening Produksi
├── SSH Server Hardening (Mematikan Password Auth & Root Login)
├── Mitigasi Serangan Kamus / Brute-Force Otomatis dengan Fail2ban
└── Strategi Zero-Lockout saat Mengubah Konfigurasi Keamanan
```

---

## Mental Model: Lapisan Pertahanan Server (Defense in Depth)

Jangan pernah membiarkan server Linux produksi Anda langsung terekspos ke internet publik hanya dengan perlindungan kata sandi biasa. Di internet, bot scanner menguji ribuan kata sandi root setiap detiknya.

Terapkan arsitektur pertahanan berlapis:

```text
       TRAFIK DARI INTERNET PUBLIK (User Valid & Bot Attacker)
                               │
                               ▼
 ═════════════════════════════════════════════════════════════════
   1. LAPISAN FIREWALL KERNEL (UFW / Netfilter)
      Menutup SEMUA port secara default (Default Deny).
      Hanya membuka port yang wajib (misal: 22, 80, 443).
      Port sensitif (3306 MySQL / 5432 Postgres) DIBLOKIR TOTAL!
 ═════════════════════════════════════════════════════════════════
                               │
                               ▼
 ═════════════════════════════════════════════════════════════════
   2. LAPISAN INTRUSION PREVENTION (Fail2ban)
      Memantau log autentikasi gagal (/var/log/auth.log).
      Jika ada IP yang salah sandi/key > 3 kali,
      IP penyerang otomatis DI-BAN selama 24 jam!
 ═════════════════════════════════════════════════════════════════
                               │
                               ▼
 ═════════════════════════════════════════════════════════════════
   3. LAPISAN AKSES SSH HARDENING (OpenSSH Daemon)
      - Root login DILARANG (PermitRootLogin no).
      - Login password DIMATIKAN TOTAL (PasswordAuthentication no).
      - Hanya menerima Kunci Kriptografi Modern (Ed25519).
 ═════════════════════════════════════════════════════════════════
                               │
                               ▼
                 AKSES SERVER AMAN DIBERIKAN ✅
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Diagnostik Jaringan & Socket Listening](#1--diagnostik-jaringan--socket-listening)
2. [Otentikasi Remote Akses dengan SSH Keypair](#2--otentikasi-remote-akses-dengan-ssh-keypair)
3. [Transfer Berkas & Deployment Aman dengan Rsync](#3--transfer-berkas--deployment-aman-dengan-rsync)

### 🟡 Intermediate

4. [Mengamankan Server dengan UFW Firewall](#4--mengamankan-server-dengan-ufw-firewall)
5. [Manajemen Environment Variables & Secret di Server](#5--manajemen-environment-variables--secret-di-server)

### 🔴 Advanced

6. [SSH Server Hardening & Anti-Lockout Strategy](#6--ssh-server-hardening--anti-lockout-strategy)
7. [Proteksi Serangan Brute-Force dengan Fail2ban](#7--proteksi-serangan-brute-force-dengan-fail2ban)

### 🛠️ Praktik

8. [Mini Project: Zero-to-Hero VPS Production Hardening](#8-️-mini-project-zero-to-hero-vps-production-hardening)

### 📚 Referensi

9. [Ringkasan & Peta Ingatan](#9--ringkasan--peta-ingatan)
10. [Urutan Belajar Berikutnya](#10--urutan-belajar-berikutnya)
11. [Referensi Resmi](#11--referensi-resmi)

---

## 1. 🟢 Diagnostik Jaringan & Socket Listening

### Konsep

Sebelum mengamankan sistem, Anda harus mampu memeriksa status konektivitas kartu jaringan (*network interface*) dan mengetahui program apa saja yang sedang membuka pintu komunikasi (*listening port*).

### Memeriksa IP & Interface Jaringan

```bash
# Menampilkan seluruh antarmuka jaringan dan alamat IP server
ip a

# Menampilkan tabel routing default gateway
ip route
```

### Menemukan Port yang Terbuka dengan `ss`

Di sistem Linux modern, utilitas `netstat` telah digantikan oleh **`ss` (Socket Statistics)** yang jauh lebih cepat dan akurat:

```bash
# Menampilkan port TCP & UDP yang sedang listening beserta nama prosesnya
sudo ss -tulpn
```

Arti Opsi Flag:
- `-t`: Menampilkan socket TCP.
- `-u`: Menampilkan socket UDP.
- `-l`: Hanya tampilkan socket yang berstatus `LISTEN` (membuka port penerima).
- `-p`: Tampilkan nama Program dan PID yang memiliki port tersebut.
- `-n`: Tampilkan alamat dan nomor port dalam bentuk Angka numerik murni (jangan ubah `80` menjadi teks `http`).

Contoh Hasil Output:

```text
Netid  State   Recv-Q  Send-Q   Local Address:Port   Peer Address:Port  Process
tcp    LISTEN  0       128            0.0.0.0:22          0.0.0.0:*      users:(("sshd",pid=850,fd=3))
tcp    LISTEN  0       511            0.0.0.0:80          0.0.0.0:*      users:(("nginx",pid=1200,fd=6))
tcp    LISTEN  0       128          127.0.0.1:5432        0.0.0.0:*      users:(("postgres",pid=910,fd=7))
```

> [!TIP]
> **Perhatikan Alamat Binding (Local Address)!**
> - `0.0.0.0:80` $\to$ Layanan terbuka dan dapat diakses oleh **seluruh antarmuka jaringan / internet publik**.
> - `127.0.0.1:5432` $\to$ Layanan diikat secara privat ke **localhost**. Database aman karena hanya dapat dihubungi oleh aplikasi yang berjalan di dalam server yang sama.

### Menguji Konektivitas Jaringan

```bash
# 1. ping: Menguji latensi ICMP ke server tujuan
ping -c 4 1.1.1.1

# 2. curl: Memeriksa header respon HTTP dari command line
curl -I https://example.com

# 3. nc (netcat): Mengetes apakah port tertentu di server tujuan terbuka (Port Checking)
# Sintaks: nc -zv <ip_target> <port>
nc -zv 192.168.1.10 3306
```

---

## 2. 🟢 Otentikasi Remote Akses dengan SSH Keypair

### Konsep

**SSH (Secure Shell)** adalah protokol standar terenkripsi untuk mengendalikan server dari jarak jauh. Menggunakan kata sandi biasa (*password authentication*) memiliki risiko besar terhadap serangan tebak sandi (*brute-force*). 

Metode otentikasi standar industri yang aman adalah **Kunci Kriptografi Asimetris (Public/Private Keypair)**:
- **Private Key (Kunci Privat):** Disimpan secara rahasia di komputer lokal Anda. **Jangan pernah dikirim atau dibagikan kepada siapapun!**
- **Public Key (Kunci Publik):** Diunggah ke server target di dalam berkas `~/.ssh/authorized_keys`.

```text
 ┌───────────────────────────────────┐               ┌───────────────────────────────────┐
 │          KOMPUTER LOKAL           │               │           SERVER UBUNTU           │
 │                                   │               │                                   │
 │  Private Key: id_ed25519 (RAHASIA)│ ── Challenge ─> Kunci Publik Terpasang di:        │
 │  Hanya dipegang pemilik laptop    │ <── Response ── ~/.ssh/authorized_keys            │
 └───────────────────────────────────┘               └───────────────────────────────────┘
```

### Langkah 1: Membuat SSH Keypair di Komputer Lokal

Gunakan algoritma **Ed25519** (algoritma kriptografi kurva eliptis modern yang jauh lebih cepat dan aman dibandingkan RSA):

```bash
# Jalankan di terminal laptop Anda (Linux/macOS/Git Bash Windows)
ssh-keygen -t ed25519 -C "budi@perusahaan.com"
```

* Sistem akan menanyakan lokasi penyimpanan (tekan `Enter` untuk default `~/.ssh/id_ed25519`).
* Masukkan passphrase pengaman jika diinginkan.

### Langkah 2: Mengunggah Kunci Publik ke Server

```bash
# Cara Otomatis: Menggunakan utilitas ssh-copy-id
ssh-copy-id -i ~/.ssh/id_ed25519.pub username@IP_SERVER_ANDA
```

Jika utilitas `ssh-copy-id` tidak tersedia, lakukan secara manual:

```bash
# 1. Cetak kunci publik di laptop Anda
cat ~/.ssh/id_ed25519.pub

# 2. Di terminal server, tambahkan teks kunci publik tersebut ke:
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA... budi@perusahaan.com" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

> [!IMPORTANT]
> SSH sangat ketat terhadap hak akses file. Jika folder `~/.ssh` memiliki izin selain `700` atau `authorized_keys` selain `600`, SSH daemon akan **menolak login** demi alasan keamanan!

---

## 3. 🟡 Transfer Berkas & Deployment Aman dengan Rsync

### Konsep

Untuk mengirim berkas source code, build asset, atau file backup dari komputer lokal ke remote server, **`rsync`** jauh lebih unggul dibandingkan `scp` atau `ftp`. 

Kelebihan Utama Rsync:
* **Delta-Transfer Algorithm:** Hanya mengirimkan bagian file yang mengalami perubahan (menghemat bandwidth hingga 95%).
* Mendukung kompresi data saat pengiriman (`-z`).
* Mampu melanjutkan proses transfer yang terputus (*resume*).
* Menjaga atribut metadata file (permission, timestamp, ownership).

### Perintah Praktik Rsync untuk Deployment

```bash
# Mengirimkan folder 'dist/' lokal ke direktori web server
rsync -avzP --delete --exclude='.git' --exclude='node_modules' ./dist/ deployer@192.168.1.50:/var/www/my-app/public/
```

Arti Opsi Flag:
- `-a` (*archive*): Menjaga timestamp, hak akses berkas, symlink, dan mode rekursif.
- `-v` (*verbose*): Menampilkan rincian berkas yang sedang disinkronkan.
- `-z` (*compress*): Mengompres data saat proses transfer jaringan berlangsung.
- `-P` (*progress & partial*): Menampilkan progress bar dan menyimpan transfer parsial jika jaringan putus.
- `--delete`: Menghapus berkas di server target jika file tersebut sudah dihapus di komputer lokal.
- `--exclude`: Melewati folder raksasa yang tidak diperlukan saat rilis (seperti `.git` atau cache).

> [!WARNING]
> **Perhatikan Karakter Garis Miring di Akhir Path!**
> - `rsync -a ./dist/ server:/var/www/` $\to$ Menyalin **isi** dari folder dist ke dalam `/var/www/`.
> - `rsync -a ./dist server:/var/www/` $\to$ Membuat folder `dist` di dalam `/var/www/dist/`.

---

## 4. 🟡 Mengamankan Server dengan UFW Firewall

### Konsep

**UFW (Uncomplicated Firewall)** adalah antarmuka manajemen firewall bawaan Ubuntu yang memudahkan kita mengelola subsistem packet filtering Linux Kernel (*Netfilter / iptables*).

Filosofi Utama Firewall Produksi:
> **Tutup semua pintu masuk secara default (*Default Deny*), dan hanya buka port yang benar-benar esensial untuk melayani publik.**

### Konfigurasi Dasar UFW

```bash
# 1. Tetapkan kebijakan dasar (Default Policies)
sudo ufw default deny incoming
sudo ufw default allow outgoing

# 2. Buka port SSH TERLEBIH DAHULU agar Anda tidak terkunci dari server!
sudo ufw allow 22/tcp

# 3. Buka port HTTP dan HTTPS untuk lalu lintas Web
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
# Atau bisa menggunakan profil aplikasi bawaan NGINX:
sudo ufw allow "Nginx Full"

# 4. Aktifkan firewall
sudo ufw enable

# 5. Periksa status aturan firewall secara detail
sudo ufw status verbose
```

Contoh Tampilan `ufw status verbose`:

```text
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW IN    Anywhere                  
80/tcp                     ALLOW IN    Anywhere                  
443/tcp                    ALLOW IN    Anywhere                  
22/tcp (v6)                ALLOW IN    Anywhere (v6)             
80/tcp (v6)                ALLOW IN    Anywhere (v6)             
443/tcp (v6)               ALLOW IN    Anywhere (v6)             
```

### Membatasi Akses Port Database Hanya untuk IP Tertentu

Jika Anda memiliki server database (misal PostgreSQL port 5432) dan ingin agar database tersebut hanya bisa dihubungi oleh IP server backend (`10.0.1.50`):

```bash
# Mengizinkan hanya IP 10.0.1.50 untuk mengakses port PostgreSQL 5432
sudo ufw allow from 10.0.1.50 to any port 5432 proto tcp

# Menghapus aturan yang sudah tidak digunakan
sudo ufw delete allow 80/tcp
```

---

## 5. 🟡 Manajemen Environment Variables & Secret di Server

### Konsep

Jangan pernah menyimpan credential sensitif (seperti token API pihak ketiga, secret key enkripsi, atau kata sandi database) secara hardcoded di dalam file repository Git publik. Di server Ubuntu, simpan environment variables di tempat yang terisolasi.

### Tingkatan Environment Variables di Linux

1. **System-Wide Persisten (`/etc/environment`):**
   * Berlaku global untuk seluruh user di sistem.
   * Format pasangan murni: `KEY="VALUE"` (tanpa perintah `export`).
2. **User Profile Persisten (`~/.bashrc`):**
   * Hanya dieksekusi saat user terkait login ke sesi shell interaktif.
   * Menggunakan format: `export KEY="value"`.
3. **Application-Specific (`.env` terisolasi):**
   * Pendekatan terbaik untuk web app: diletakkan di direktori kerja aplikasi dan dibaca oleh Systemd service via opsi `EnvironmentFile=/var/www/my-app/.env`.

```bash
# Praktik Keamanan: Pastikan berkas .env aplikasi HANYA bisa dibaca oleh pemiliknya
chmod 600 /var/www/my-app/.env
chown www-data:www-data /var/www/my-app/.env
```

---

## 6. 🔴 SSH Server Hardening & Anti-Lockout Strategy

### Konsep

Setelah Anda berhasil memasang SSH Public Key dan mengujinya, saatnya mengunci pintu server secara permanen dengan mematikan login user `root` dan menonaktifkan otentikasi kata sandi.

### Prosedur Hardening `/etc/ssh/sshd_config`

Buka file konfigurasi SSH daemon:

```bash
sudo nano /etc/ssh/sshd_config
```

Sesuaikan direktif berikut:

```text
# 1. Larang superuser 'root' login langsung via SSH
PermitRootLogin no

# 2. Matikan total login berbasis kata sandi (Wajib punya SSH Key!)
PasswordAuthentication no

# 3. Matikan autentikasi kosong
PermitEmptyPasswords no

# 4. Batasi percobaan autentikasi maksimal
MaxAuthTries 3

# 5. Nonaktifkan forwarding grafis yang tidak terpakai
X11Forwarding no

# 6. (Opsional tapi direkomendasikan) Batasi hanya user tertentu yang boleh login
AllowUsers deployer
```

### Strategi Anti-Lockout (PENTING!)

> [!CAUTION]
> **JANGAN PERNAH MENUTUP TERMINAL SSH LAMA ANDA SEBELUM MENGUJI!**
> Jika Anda salah mengetik konfigurasi SSH dan langsung keluar, Anda berisiko terkunci dari server selamanya.

**Langkah Pengujian Aman:**
1. Uji keabsahan sintaks konfigurasi terlebih dahulu:
   ```bash
   sudo sshd -t
   ```
   *(Jika output kosong, berarti konfigurasi valid).*
2. Restart daemon SSH:
   ```bash
   sudo systemctl restart ssh
   # (atau 'sudo systemctl restart sshd')
   ```
3. **BIARKAN TERMINAL LAMA ANDA TETAP TERBUKA.**
4. Buka **jendela terminal baru di laptop Anda**, lalu coba login:
   ```bash
   ssh -i ~/.ssh/id_ed25519 deployer@IP_SERVER_ANDA
   ```
5. Jika jendela baru berhasil login tanpa meminta kata sandi, konfigurasi aman dan Anda boleh menutup terminal lama.

---

## 7. 🔴 Proteksi Serangan Brute-Force dengan Fail2ban

### Konsep

Meskipun Anda sudah mematikan login password, bot scanner internet akan terus membombardir port SSH Anda ribuan kali per hari, menghabiskan bandwidth dan mencemari file log sistem.

**Fail2ban** adalah daemon yang bertugas membaca log sistem (seperti `/var/log/auth.log`) secara real-time. Jika sebuah IP gagal login beberapa kali dalam kurun waktu tertentu, Fail2ban akan otomatis **menulis aturan blokir IP tersebut ke dalam firewall UFW/iptables** untuk jangka waktu tertentu.

### Instalasi & Konfigurasi Fail2ban

```bash
# 1. Pasang paket fail2ban
sudo apt install -y fail2ban

# 2. Buat salinan konfigurasi lokal (jangan ubah file jail.conf bawaan)
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# 3. Edit file konfigurasi lokal
sudo nano /etc/fail2ban/jail.local
```

Tambahkan / sesuaikan konfigurasi parameter proteksi:

```ini
[DEFAULT]
# Waktu durasi IP diblokir (misal: 1 jam / 3600 detik atau 1 hari / 86400 detik)
bantime  = 1d

# Jendela waktu pemantauan kegagalan (10 menit)
findtime  = 10m

# Batas toleransi percobaan gagal sebelum di-ban
maxretry = 3

# Jangan pernah memblokir IP lokal dan IP kantor Anda sendiri
ignoreip = 127.0.0.1/8 ::1

[sshd]
enabled = true
port    = 22
mode    = aggressive
```

### Mengaktifkan Layanan & Memeriksa Status Ban

```bash
# Jalankan dan aktifkan fail2ban service
sudo systemctl enable --now fail2ban

# Memeriksa status pengawasan jail SSH
sudo fail2ban-client status sshd
```

Contoh Output Saat Penyerang Tertangkap:

```text
Status for the jail: sshd
|- Filter
|  |- Currently failed: 2
|  |- Total failed:     45
`- Actions
   |- Currently banned: 3
   |- Total banned:     12
   `- Banned IP list:   185.220.101.5 194.26.29.112 45.154.255.88
```

Jika Anda tidak sengaja memblokir IP Anda sendiri, lepaskan blokir (*unban*) dengan perintah:

```bash
sudo fail2ban-client set sshd unbanip ALAMAT_IP_ANDA
```

---

## 8. 🛠️ Mini Project: Zero-to-Hero VPS Production Hardening

### Tujuan

Mempraktikkan seluruh rangkaian prosedur pengamanan server VPS Ubuntu baru (*checklist checklist hardening*) agar siap menjadi host server web yang aman.

### Langkah demi Langkah Eksekusi

```text
               Alur Eksekusi VPS Production Hardening
               
  1. Login Root Awal & Update Sistem (apt update && upgrade)
                          │
                          ▼
  2. Buat User Dedicated Non-Root (adduser deployer & usermod -aG sudo)
                          │
                          ▼
  3. Daftarkan SSH Keypair Ed25519 ke User Baru (~/.ssh/authorized_keys)
                          │
                          ▼
  4. Nyalakan UFW Firewall (Deny Default, Allow 22, 80, 443)
                          │
                          ▼
  5. Kunci SSH Daemon (PermitRootLogin no, PasswordAuthentication no)
                          │
                          ▼
  6. Pasang & Aktifkan Fail2ban (Auto-ban Brute-Force Bot)
                          │
                          ▼
  7. Uji Koneksi dari Terminal Baru (Anti-Lockout Validation) ✅
```

#### Langkah 1: Buat User Baru Non-Root dengan Hak Sudo

```bash
# Tambahkan user baru khusus deployment
sudo adduser deployer

# Berikan hak sudo administratif
sudo usermod -aG sudo deployer
```

#### Langkah 2: Salin SSH Key ke User Baru

```bash
# Beralih ke user deployer
sudo -u deployer mkdir -p /home/deployer/.ssh
sudo -u deployer chmod 700 /home/deployer/.ssh

# Salin public key Anda ke authorized_keys deployer
sudo cp /root/.ssh/authorized_keys /home/deployer/.ssh/
sudo chown deployer:deployer /home/deployer/.ssh/authorized_keys
sudo chmod 600 /home/deployer/.ssh/authorized_keys
```

#### Langkah 3: Konfigurasi UFW Firewall

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

#### Langkah 4: Kunci Konfigurasi SSH

Tambahkan file override di `/etc/ssh/sshd_config.d/99-hardening.conf`:

```bash
sudo bash -c "cat << 'EOF' > /etc/ssh/sshd_config.d/99-hardening.conf
PermitRootLogin no
PasswordAuthentication no
PermitEmptyPasswords no
MaxAuthTries 3
AllowUsers deployer
EOF"

# Uji konfigurasi
sudo sshd -t && sudo systemctl restart ssh
```

#### Langkah 5: Pasang dan Aktifkan Fail2ban

```bash
sudo apt install -y fail2ban
sudo bash -c "cat << 'EOF' > /etc/fail2ban/jail.local
[DEFAULT]
bantime = 1d
findtime = 10m
maxretry = 3

[sshd]
enabled = true
port = 22
EOF"

sudo systemctl restart fail2ban
```

#### Langkah 6: Validasi Akhir

Dari komputer lokal Anda, lakukan login menggunakan user baru:

```bash
ssh deployer@IP_SERVER_ANDA
```

Jika berhasil masuk dengan SSH key tanpa ditanya password, dan user `root` ditolak, selamat! Server Ubuntu produksi Anda telah berhasil diamankan sesuai standar industri.

---

## 9. 📚 Ringkasan & Peta Ingatan

### Peta Ingatan Konsep

```text
Linux Networking & Hardening
├── Inspeksi Jaringan
│   ├── ip a               → Cek alokasi IP & interface
│   └── ss -tulpn          → Daftar port listening aktif
├── Otentikasi SSH Key
│   ├── ssh-keygen         → Buat pair Ed25519 di client
│   └── authorized_keys    → Public key di server (600/700)
├── Hardening SSH Daemon
│   ├── PermitRootLogin no
│   └── PasswordAuth no
├── Firewall (UFW)
│   ├── default deny       → Blokir semua port masuk
│   └── allow 22, 80, 443  → Hanya buka port layanan web
├── Intrusion Prevention
│   └── Fail2ban           → Auto ban IP penyerang via auth.log
└── File Transfer
    └── rsync -avzP        → Sinkronisasi delta hemat bandwidth
```

### Cheat Code 10 Detik

```text
ss -tulpn                      → periksa port mana saja yang terbuka
ufw status                     → lihat status aturan firewall aktif
ufw allow 22/tcp               → buka akses port SSH
fail2ban-client status sshd    → cek daftar IP hacker yang ter-ban
rsync -avzP ./dist/ user@ip:/  → sinkronisasi deployment cepat
sudo sshd -t                   → tes keabsahan syntax SSH sebelum reload
```

---

## 10. 🧭 Urutan Belajar Berikutnya

1. **Lanjut ke Modul 4:** [[linux-bash-scripting|Linux Bash Scripting untuk DevOps]] untuk mempelajari penulisan script otomasi server defensif, backup otomatis, dan monitoring kesehatan sistem.
2. **Kombinasikan dengan NGINX:** Pasang sertifikat SSL gratis Let's Encrypt / Certbot pada port 80 dan 443 yang telah dibuka via panduan [[nginx-security-ssl|NGINX Security & SSL]].
3. **Kombinasikan dengan Git:** Bangun alur push deployment otomatis menggunakan SSH key dengan panduan [[git-workflow-kolaborasi|Git Workflow & Kolaborasi]].

---

## 11. 🔗 Referensi Resmi

- [OpenSSH Official Manual & Security Practices](https://www.openssh.com/manual.html)
- [Ubuntu Server Firewall with UFW Guide](https://ubuntu.com/server/docs/security-firewall)
- [Fail2ban Official Documentation](https://www.fail2ban.org/)
- [rsync(1) - Linux Man Pages](https://linux.die.net/man/1/rsync)
