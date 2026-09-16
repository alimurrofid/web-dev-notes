---
title: "Linux Dasar"
description: "Fundamental sistem operasi Linux Ubuntu Server: Arsitektur FHS, navigasi terminal CLI, I/O redirection, user privilege sudo, hak akses chmod & chown, dan manajemen paket APT."
order: 1
tags:
  - devops
  - linux
  - ubuntu
  - fundamental
  - cli
---

# Linux Dasar

> **Target:** Pemula & Web Developer yang ingin menguasai sistem operasi **Linux Ubuntu Server 24.04 LTS / 22.04 LTS** melalui antarmuka baris perintah (*Command Line Interface* / CLI).
> **Versi:** Ubuntu Server 24.04 LTS (Noble Numbat) / 22.04 LTS (Jammy Jellyfish).
> Fokus modul ini: **Mental model Linux vs Windows/macOS → Filesystem Hierarchy Standard (FHS) → Perintah navigasi & manipulasi berkas → Terminal text editor (`nano` & `vim`) → Standard streams & I/O redirection (`|`, `>`, `>>`, `2>&1`) → User, Group, & Hak Akses (`chmod`, `chown`, `sudo`) → Manajemen paket APT → Mini project struktur web app deployment**.

---

## Cara Belajar

```text
🟢 Fundamental (Wajib Dipahami)
├── Mental Model Sistem Operasi & Shell Linux
├── Struktur Hirarki Direktori (FHS: /, /etc, /var/www, /home)
├── Navigasi & Operasi Berkas Dasar (ls, cd, mkdir, cp, mv, rm)
└── Manajemen Paket APT (update, upgrade, install, purge)

🟡 Intermediate (Pemahaman Alur Kerja)
├── Standard I/O Streams & Pipeline (| , > , >> , grep, find)
├── Text Editing Cepat di Terminal (Nano & Vim dasar)
└── User Privilege & Sudoers Security

🔴 Advanced / Operasional Server
├── Sistem Perizinan Berkas (Notasi Oktal 755/644 vs Simbolik)
├── Manajemen Kepemilikan (chown www-data)
└── Konfigurasi Repositori Eksternal & PPA Keyring Modern
```

---

## Mental Model: Arsitektur Sistem Linux

Di sistem operasi desktop seperti Windows atau macOS, pengguna banyak berinteraksi lewat Graphical User Interface (GUI). Namun pada server produksi, antarmuka grafis sengaja ditiadakan untuk menghemat penggunaan RAM dan CPU. Semua operasi dilakukan melalui antarmuka teks murni:

```text
 ┌─────────────────────────────────────────────────────────────┐
 │                       USER / DEVELOPER                      │
 └──────────────────────────────┬──────────────────────────────┘
                                │ Mengetik perintah teks
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                     SHELL (Bash / Zsh)                      │
 │    Menerjemahkan perintah teks menjadi instruksi sistem    │
 └──────────────────────────────┬──────────────────────────────┘
                                │ System Calls (sys_read, sys_write, dll.)
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                        KERNEL LINUX                         │
 │     Mengelola Hardware, Memori, CPU, Jaringan, dan Disk     │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                    HARDWARE / CPU / RAM                     │
 └─────────────────────────────────────────────────────────────┘
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Linux & Ubuntu Server](#1--pengenalan-linux--ubuntu-server)
2. [Filesystem Hierarchy Standard (FHS)](#2--filesystem-hierarchy-standard-fhs)
3. [Navigasi & Manipulasi Berkas CLI](#3--navigasi--manipulasi-berkas-cli)
4. [Editor Teks Terminal (Nano & Vim)](#4--editor-teks-terminal-nano--vim)

### 🟡 Intermediate

5. [Standard Streams, Piping, & I/O Redirection](#5--standard-streams-piping--io-redirection)
6. [User, Group, dan Hak Akses Berkas (Permissions)](#6--user-group-dan-hak-akses-berkas-permissions)
7. [Manajemen Paket Aplikasi dengan APT](#7--manajemen-paket-aplikasi-dengan-apt)

### 🛠️ Praktik

8. [Mini Project: Menyiapkan Direktori Web Application](#8-️-mini-project-menyiapkan-direktori-web-application)

### 📚 Referensi

9. [Ringkasan & Peta Ingatan](#9--ringkasan--peta-ingatan)
10. [Urutan Belajar Berikutnya](#10--urutan-belajar-berikutnya)
11. [Referensi Resmi](#11--referensi-resmi)

---

## 1. 🟢 Pengenalan Linux & Ubuntu Server

### Konsep

Linux sebenarnya merujuk pada **Kernel**—inti sistem operasi yang diciptakan oleh Linus Torvalds pada tahun 1991. Ketika Kernel digabungkan dengan kumpulan utilitas GNU, package manager, compiler, dan system service, terbentuklah sebuah **Distribusi Linux (Distro)**.

**Ubuntu** adalah distribusi Linux turunan Debian yang disponsori oleh Canonical. Terdapat dua edisi rilis Ubuntu:
1. **Interim Release:** Dirilis setiap 6 bulan, dengan masa dukungan 9 bulan. Digunakan untuk eksperimen fitur terkini.
2. **LTS (Long Term Support):** Dirilis setiap 2 tahun sekali (tahun genap bulan April, misal 20.04, 22.04, 24.04). Memiliki jaminan pembaruan stabilitas dan patch keamanan selama **5 tahun penuh** (dapat diperpanjang hingga 10-12 tahun dengan Ubuntu Pro).

> [!IMPORTANT]
> Untuk server web dan infrastruktur DevOps, **selalu gunakan rilis Ubuntu Server LTS**. Jangan gunakan rilis non-LTS di server produksi.

### Perbedaan Mental Model: Linux vs Windows

| Karakteristik | Windows | Linux (Ubuntu Server) |
|---|---|---|
| **Root Path** | Partisi drive terpisah (`C:\`, `D:\`) | Satu pohon direktori tunggal (`/`) |
| **Pemisah Path** | Backslash (`\`) | Forward slash (`/`) |
| **Sensitivitas Huruf** | Case-insensitive (`File.txt` == `file.txt`) | **Strictly Case-sensitive** (`File.txt` != `file.txt`) |
| **Ekstensi Berkas** | Menentukan eksekusi (`.exe`, `.bat`) | Ditentukan oleh izin eksekusi (`x`) & shebang |
| **Konfigurasi** | GUI & Windows Registry biner | File teks polos (*plain-text*) di direktori `/etc` |

---

## 2. 🟢 Filesystem Hierarchy Standard (FHS)

### Konsep

Di Linux, seluruh perangkat keras, partisi disk, dan layanan diabstraksikan sebagai berkas (*"Everything is a file"*). Seluruh struktur sistem berakar dari direktori root (`/`). 

### Struktur Direktori Kunci Server

```text
/ (Root Directory)
├── etc/          → File konfigurasi sistem & aplikasi (nginx, ssh, ufw, hosts)
├── var/          → Berkas yang sering berubah secara dinamis
│   ├── log/      → File catatan aktivitas / system logs (syslog, auth.log, nginx/)
│   └── www/      → Direktori standar penyimpanan source code website & web app
├── home/         → Direktori kerja masing-masing user biasa (misal: /home/budi)
├── root/         → Direktori home khusus milik superuser 'root'
├── usr/          → Program biner, pustaka (libraries), dan dokumentasi publik
│   └── bin/      → Perintah CLI standar yang dapat dieksekusi semua user
├── opt/          → Software mandiri pihak ketiga (misal: docker, datadog-agent)
├── tmp/          → Berkas temporer yang otomatis dibersihkan saat server reboot
└── dev/          → Abstraksi perangkat keras (disk, mouse, null stream: /dev/null)
```

### Jalur Berkas: Absolut vs Relatif

- **Absolute Path:** Jalur lengkap yang selalu diawali dengan slash root (`/`). Bersifat independen dari lokasi Anda saat ini.
  * Contoh: `/var/www/html/index.html`
- **Relative Path:** Jalur yang dihitung dari direktori kerja Anda saat ini (*Current Working Directory*).
  * `.` (titik satu): Merujuk ke direktori saat ini.
  * `..` (titik dua): Merujuk ke direktori satu tingkat di atasnya (parent).
  * `~` (tilde): Jalan pintas menuju direktori home user yang sedang aktif (`/home/username`).

---

## 3. 🟢 Navigasi & Manipulasi Berkas CLI

### Konsep

Operasi dasar di terminal memungkinkan developer berpindah direktori, menginspeksi isi folder, serta membuat, menduplikasi, dan memindahkan berkas tanpa mouse.

### Sintaks & Perintah Esensial

```bash
# Mengetahui direktori aktif saat ini (Print Working Directory)
pwd

# Berpindah direktori (Change Directory)
cd /var/www            # Pindah ke path absolut
cd ..                  # Naik satu level ke direktori induk
cd ~                   # Kembali ke home directory user aktif

# Menampilkan isi direktori (List)
ls -lah
```

Opsi flag `ls` yang paling sering digunakan:
* `-l`: Menampilkan rincian lengkap (permission, pemilik, ukuran, tanggal modifikasi).
* `-a`: Menampilkan seluruh berkas, termasuk file tersembunyi (*hidden files* yang diawali titik `.`).
* `-h`: Mengubah ukuran berkas menjadi format yang mudah dibaca manusia (*human-readable*: KB, MB, GB).

### Manipulasi File & Folder

```bash
# 1. Membuat file kosong baru
touch server.js

# 2. Membuat direktori baru (flag -p membuat parent folder jika belum ada)
mkdir -p my-app/backend/config

# 3. Menyalin file & folder
cp config.example.json config.json        # Salin file tunggal
cp -r my-app my-app-backup               # Salin seluruh folder secara rekursif (-r)

# 4. Memindahkan atau mengganti nama file/folder
mv old-name.txt new-name.txt             # Rename berkas
mv config.json my-app/backend/config/     # Pindah lokasi

# 5. Menghapus file & folder
rm unwanted.txt                          # Hapus file
rm -rf temporary-folder/                 # Hapus folder beserta isinya secara rekursif & paksa
```

> [!WARNING]
> Perintah `rm -rf` di Linux tidak memindahkan file ke "Recycle Bin". File akan langsung dihapus permanen dari sistem file. Berhati-hatilah saat menggunakan wildcards `*` bersama flag `-rf`.

### Melihat Isi Berkas Teks

```bash
# Menampilkan seluruh isi file ke layar terminal
cat /etc/os-release

# Membaca file baris demi baris secara interaktif (tekan 'q' untuk keluar)
less /var/log/syslog

# Melihat 10 baris pertama file
head -n 10 /etc/passwd

# Melihat 15 baris terakhir file
tail -n 15 /var/log/nginx/access.log

# Memantau perubahan file secara real-time (sangat berguna untuk live log monitoring)
tail -f /var/log/nginx/error.log
```

---

## 4. 🟢 Editor Teks Terminal (Nano & Vim)

### Konsep

Karena server produksi tidak memiliki GUI seperti VS Code, Anda harus menguasai minimal satu editor teks berbasis terminal untuk mengubah konfigurasi server atau berkas environment (`.env`).

### A. Nano (Pilihan Terbaik untuk Pemula)

Nano adalah editor sederhana yang menyertakan bantuan navigasi di bagian bawah layar.

```bash
# Membuka atau membuat file baru dengan nano
nano .env
```

Navigasi Shortcut Nano:
- `Ctrl + O` lalu tekan `Enter`: Menyimpan perubahan (*Write Out*).
- `Ctrl + W`: Mencari kata (*Where Is*).
- `Ctrl + K`: Memotong satu baris teks (*Cut*).
- `Ctrl + U`: Menempel baris teks (*Paste / Uncut*).
- `Ctrl + X`: Keluar dari editor.

### B. Vim (Standar Industri & Kecepatan Tinggi)

Vim adalah editor modal (*modal editor*). Huruf yang Anda ketik memiliki fungsi perintah (*Command Mode*), kecuali Anda masuk ke mode pengetikan (*Insert Mode*).

```bash
# Membuka file dengan vim
vim /etc/nginx/nginx.conf
```

Mental Model 3 Mode Dasar Vim:

```text
 ┌─────────────────────────────────────────────────────────────┐
 │                NORMAL / COMMAND MODE (Default)              │
 │          Navigasi kursor, hapus baris, cari kata            │
 └──────────────┬───────────────────────────────▲──────────────┘
   Tekan 'i'    │                               │ Tekan 'Esc'
   (Insert)     ▼                               │
 ┌─────────────────────────────┐  ┌─────────────┴──────────────┐
 │         INSERT MODE         │  │       LAST-LINE MODE       │
 │   Mengetik teks seperti     │  │ Diawali titik dua (:)      │
 │       editor biasa          │  │ :w (simpan), :q (keluar)   │
 └─────────────────────────────┘  └────────────────────────────┘
```

**Cheatsheet Cepat Vim:**
1. Tekan `i` untuk mulai mengetik (masuk Insert Mode).
2. Tekan tombol `Esc` di keyboard untuk kembali ke Normal Mode.
3. Ketik `:w` lalu `Enter` untuk menyimpan.
4. Ketik `:q` lalu `Enter` untuk keluar (atau `:q!` untuk keluar tanpa menyimpan perubahan).
5. Ketik `:wq` lalu `Enter` untuk menyimpan dan keluar sekaligus.
6. Pada Normal Mode, tekan `dd` dua kali untuk menghapus 1 baris penuh.

---

## 5. 🟡 Standard Streams, Piping, & I/O Redirection

### Konsep

Setiap perintah yang dijalankan di terminal Linux memiliki 3 aliran data (*standard streams*) bawaan:

```text
               ┌──────────────────────────────────────────────┐
               │              STANDARD STREAMS                │
               │                                              │
               │  0 : stdin  (Standard Input)   < Keyboard    │
               │  1 : stdout (Standard Output)  > Terminal    │
               │  2 : stderr (Standard Error)   > Terminal    │
               └──────────────────────────────────────────────┘
```

Secara default, `stdout` dan `stderr` dicetak ke layar monitor terminal Anda. Dengan **I/O Redirection**, kita dapat mengalihkan aliran ini ke file atau perintah lain.

### Operator Redirection

```bash
# '>' : Menimpa isi file (Overwrite)
echo "APP_ENV=production" > .env

# '>>' : Menambahkan teks ke akhir file tanpa menghapus isi lama (Append)
echo "PORT=3000" >> .env

# '2>' : Mengarahkan pesan error saja ke file terpisah
node app.js 2> error.log

# '&>' atau '2>&1' : Menggabungkan stdout dan stderr ke dalam satu file
npm run build > build.log 2>&1

# Menghilangkan output (membuang teks ke lubang hitam /dev/null)
apt-get update > /dev/null 2>&1
```

### Heredoc (Menulis Blok Konfigurasi Multi-Baris)

Heredoc (`<< 'EOF'`) sangat bermanfaat untuk membuat file konfigurasi panjang secara instan tanpa perlu membuka editor interaktif:

```bash
cat << 'EOF' > /etc/nginx/conf.d/api.conf
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}
EOF
```

### Piping (`|`) & Filter Teks

Piping mengambil `stdout` dari perintah di sebelah kiri dan menjadikannya `stdin` bagi perintah di sebelah kanan:

```bash
perintah_1 | perintah_2 | perintah_3
```

Contoh Utilitas Filter Teks:

```bash
# 1. grep: Mencari baris teks yang cocok dengan pola tertentu
cat /var/log/nginx/access.log | grep "404"
grep -rn "DB_PASSWORD" /var/www/my-app/     # Cari rekursif (-r) beserta nomor baris (-n)

# 2. wc: Menghitung jumlah kata, karakter, dan baris (-l)
# Menghitung berapa kali IP 192.168.1.50 mengakses server
cat /var/log/nginx/access.log | grep "192.168.1.50" | wc -l

# 3. sort & uniq: Mengurutkan dan menghitung data unik
# Mengetahui daftar IP pengakses teratas
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -n 5

# 4. find: Mencari lokasi berkas di dalam sistem
find /var/www/ -type f -name "*.env"         # Mencari file .env di folder web
find /var/log/ -type f -size +100M           # Mencari file log yang ukurannya lebih dari 100MB
```

---

## 6. 🟡 User, Group, dan Hak Akses Berkas (Permissions)

### Konsep

Linux adalah sistem operasi multi-user. Setiap file dan folder memiliki batasan ketat tentang siapa yang boleh membaca, mengubah, atau mengeksekusinya.

### Anatomi String Permission

Saat menjalankan perintah `ls -l`, Anda akan melihat kolom string permission seperti berikut:

```text
-  r w x  r - x  r - -    1  budi  developers   4096  Sep 16 10:00  deploy.sh
│  └──┬──┘ └──┬──┘ └──┬──┘
│     │      │      │
│     │      │      └─ [Others/World]: Orang lain di luar grup (read only)
│     │      └──────── [Group]: Anggota grup 'developers' (read & execute)
│     └─────────────── [User/Owner]: Pemilik berkas 'budi' (read, write, execute)
└───────────────────── Tipe Berkas: '-' (file biasa), 'd' (direktori), 'l' (symlink)
```

Tiga Komponen Hak Akses:
- **`r` (Read - Nilai 4):** Izin membaca isi file, atau izin melihat daftar file di dalam direktori.
- **`w` (Write - Nilai 2):** Izin mengedit/menghapus file, atau izin membuat/menghapus file di dalam direktori.
- **`x` (Execute - Nilai 1):** Izin menjalankan file sebagai program/script, atau izin membuka (*entering/traversing*) direktori via `cd`.

### Notasi Oktal vs Simbolik

| Nilai Oktal | Huruf | Arti |
|---|---|---|
| `7` (`4+2+1`) | `rwx` | Read, Write, Execute (Akses Penuh) |
| `6` (`4+2+0`) | `rw-` | Read, Write (Standar Berkas Konfigurasi/Kode) |
| `5` (`4+0+1`) | `r-x` | Read, Execute (Standar Masuk Folder / Eksekusi Script) |
| `4` (`4+0+0`) | `r--` | Read Only (Hanya Baca) |
| `0` (`0+0+0`) | `---` | No Permission (Akses Diblokir Total) |

### Mengubah Hak Akses dengan `chmod`

```bash
# Menjadikan script deployment dapat dieksekusi oleh owner (Simbolik)
chmod +x deploy.sh
chmod u=rwx,go=rx deploy.sh

# Standar Industri Keamanan Web (Oktal):
# 644 untuk File biasa: Owner bisa read/write, orang lain hanya bisa read
chmod 644 /var/www/html/index.php

# 755 untuk Direktori: Owner bisa baca/tulis/masuk, orang lain bisa baca/masuk
chmod 755 /var/www/html/public

# 600 untuk Berkas Kunci Rahasia / Private Key SSH
chmod 600 ~/.ssh/id_ed25519
chmod 700 ~/.ssh
```

> [!CAUTION]
> **JANGAN PERNAH MENGGUNAKAN `chmod 777`!**
> Perintah `chmod 777` membuka celah fatal di mana user mana pun (termasuk hacker yang mengeksploitasi bug form upload website) dapat mengunggah file berbahaya dan mengeksekusinya langsung di server Anda.

### Mengubah Kepemilikan dengan `chown`

```bash
# chown <user>:<group> <file_atau_folder>
chown budi:developers deploy.sh

# Menyerahkan kepemilikan folder web ke user web server (Ubuntu: www-data)
# Flag -R mengubah seluruh subfolder & file di dalamnya secara rekursif
chown -R www-data:www-data /var/www/my-app
```

### Superuser Privilege (`sudo` & `visudo`)

Akun `root` adalah administrator tertinggi sistem yang memiliki izin tak terbatas. Untuk alasan keamanan, developer disarankan login menggunakan user biasa dan menggunakan perintah `sudo` (*SuperUser DO*) hanya saat menjalankan perintah administratif.

```bash
# Menjalankan perintah dengan privilege root
sudo apt update

# Mengedit konfigurasi sudoers secara aman (mencegah syntax error yang mengunci akses)
sudo visudo
```

---

## 7. 🟡 Manajemen Paket Aplikasi dengan APT

### Konsep

Ubuntu menggunakan sistem manajemen paket **APT (Advanced Package Tool)** dengan format berkas `.deb`. Anda tidak perlu mengunduh file `.exe` dari browser; sistem mengunduh paket resmi yang sudah terverifikasi dari server repositori.

### Alur Kerja APT

```text
 ┌──────────────────────┐                     ┌──────────────────────┐
 │  DAFTAR REPOSISTORI  │    'apt update'     │     INDEX LOKAL      │
 │   Ubuntu Official    │ ─────────────────>  │ /var/lib/apt/lists/  │
 └──────────────────────┘                     └──────────┬───────────┘
                                                         │
                                                         │ 'apt install nginx'
                                                         ▼
                                              ┌──────────────────────┐
                                              │ SISTEM SERVER TERKINI│
                                              │ Mengunduh .deb & pasang│
                                              └──────────────────────┘
```

### Perintah Pokok APT

```bash
# 1. Memperbarui daftar katalog paket terbaru dari internet (Wajib sebelum install)
sudo apt update

# 2. Meng-upgrade seluruh paket software lama yang sudah terpasang
sudo apt upgrade -y

# 3. Memasang paket baru (misal: curl, git, htop, nginx)
sudo apt install -y curl git htop nginx

# 4. Menghapus paket software tetapi tetap mempertahankan file konfigurasi
sudo apt remove nginx

# 5. Menghapus paket secara total beserta seluruh file konfigurasi sistemnya
sudo apt purge nginx

# 6. Membersihkan dependensi lama yang sudah tidak dibutuhkan lagi oleh paket manapun
sudo apt autoremove -y

# 7. Mencari ketersediaan paket di repository
apt search postgresql
```

### Menambahkan PPA & Repositori Modern (Ubuntu 24.04/22.04)

Pola lama penambahan repo menggunakan `apt-key add` sudah usang (*deprecated*) karena dinilai tidak aman. Standar modern mewajibkan penyimpanan public key kriptografi di folder `/etc/apt/keyrings/`:

```bash
# Contoh standard pola penambahan repository resmi pihak ketiga (misal: Node.js / Docker)
# 1. Buat folder keyring khusus jika belum ada
sudo mkdir -p /etc/apt/keyrings

# 2. Unduh GPG key dan simpan dalam format de-armored binary
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 3. Daftarkan sumber repository ke /etc/apt/sources.list.d/
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. Sinkronisasi katalog paket baru
sudo apt update
```

---

## 8. 🛠️ Mini Project: Menyiapkan Direktori Web Application

### Tujuan

Mempraktikkan navigasi direktori, pembuatan struktur folder aplikasi web, teknik stream redirection, serta penerapan hak akses permission dan kepemilikan user `www-data` yang aman.

### Langkah Implementasi

#### Langkah 1: Membuat Struktur Direktori Aplikasi

Jalankan perintah berikut di terminal server:

```bash
# Buat folder aplikasi baru di /var/www
sudo mkdir -p /var/www/simple-web/{public,logs,config}

# Periksa struktur folder yang baru dibuat
ls -la /var/www/simple-web
```

#### Langkah 2: Membuat Berkas HTML & Konfigurasi via Redirection

Buat halaman index sederhana menggunakan Heredoc:

```bash
sudo bash -c "cat << 'EOF' > /var/www/simple-web/public/index.html
<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\">
    <title>Server Linux Siap</title>
</head>
<body>
    <h1>Server Ubuntu Berhasil Dikonfigurasi!</h1>
    <p>Aplikasi web berjalan dengan hak akses www-data yang aman.</p>
</body>
</html>
EOF"
```

Buat berkas konfigurasi simulasi environment:

```bash
sudo bash -c "cat << 'EOF' > /var/www/simple-web/config/app.env
APP_NAME=SimpleWeb
APP_ENV=production
APP_PORT=8080
EOF"
```

#### Langkah 3: Mengatur Hak Akses & Kepemilikan Berkas

Terapkan standar perizinan Linux server:

```bash
# 1. Ubah pemilik menjadi user web server standar Ubuntu (www-data)
sudo chown -R www-data:www-data /var/www/simple-web

# 2. Atur izin direktori menjadi 755 (bisa diakses dan dibaca)
sudo find /var/www/simple-web -type d -exec chmod 755 {} \;

# 3. Atur izin file umum menjadi 644 (hanya bisa dibaca oleh web server)
sudo find /var/www/simple-web -type f -exec chmod 644 {} \;

# 4. Amankan berkas konfigurasi sensitif menjadi 600 (hanya pemilik www-data yang bisa baca)
sudo chmod 600 /var/www/simple-web/config/app.env
```

#### Langkah 4: Verifikasi Hasil Akhir

```bash
ls -lah /var/www/simple-web/public
ls -lah /var/www/simple-web/config
```

Hasil verifikasi di terminal:

```text
total 12K
drwxr-xr-x 2 www-data www-data 4.0K Sep 16 12:00 .
drwxr-xr-x 5 www-data www-data 4.0K Sep 16 12:00 ..
-rw-r--r-- 1 www-data www-data  275 Sep 16 12:00 index.html
-rw------- 1 www-data www-data   58 Sep 16 12:00 app.env
```

---

## 9. 📚 Ringkasan & Peta Ingatan

### Peta Ingatan Konsep

```text
Linux Fundamental
├── Filesystem Hierarchy (FHS)
│   ├── /etc       → Konfigurasi sistem (nginx, ssh, hosts)
│   ├── /var/www   → Direktori source code web
│   └── /var/log   → Berkas catatan aktivitas log
├── Navigasi & File
│   ├── pwd, cd    → Berpindah direktori
│   ├── ls -lah    → Inspeksi isi folder & metadata
│   └── mkdir, cp, mv, rm
├── Standard Streams
│   ├── stdin (0), stdout (1), stderr (2)
│   ├── '>' (overwrite) vs '>>' (append)
│   └── '|' (piping output ke input perintah berikutnya)
├── Permissions & User
│   ├── chmod      → 755 (folder), 644 (file), 600 (secret)
│   ├── chown      → Mengubah pemilik (user:group)
│   └── sudo       → Menjalankan perintah dengan hak root
└── Package Manager
    ├── apt update   → Unduh index metadata terbaru
    └── apt install  → Pasang paket aplikasi
```

### Cheat Code 10 Detik

```text
ls -lah                     → melihat detail file & hidden files
cd /var/www                 → navigasi ke folder web
grep -rn "pattern" .        → mencari kata di seluruh sub-berkas
chmod 644 <file>            → permission aman file standar
chmod 755 <dir>             → permission aman direktori
chown -R www-data:www-data  → serahkan kepemilikan ke web server
sudo apt update && upgrade  → pembaruan berkala sistem
tail -f /var/log/syslog     → live monitor log aktivitas
```

---

## 10. 🧭 Urutan Belajar Berikutnya

1. **Lanjut ke Modul 2:** [[linux-administrasi-sistem|Linux Administrasi Sistem]] untuk mempelajari manajemen proses (`ps`, `htop`, `kill`), pembuatan daemon background service via **Systemd**, automasi tugas terjadwal **Cron**, dan monitoring utilisasi kapasitas disk/RAM.
2. **Kombinasikan dengan NGINX:** Hubungkan direktori web yang telah Anda buat di `/var/www/` dengan web server pada modul [[nginx-dasar|NGINX Dasar]].
3. **Pahami Kontainer:** Pelajari bagaimana konsep isolasi Linux process dan filesystem FHS membentuk dasar dari [[docker-dasar|Docker Dasar]].

---

## 11. 🔗 Referensi Resmi

- [Ubuntu Server Official Documentation](https://ubuntu.com/server/docs)
- [Filesystem Hierarchy Standard (FHS 3.0 Specification)](https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html)
- [Debian & Ubuntu APT User Guide](https://wiki.debian.org/Apt)
- [GNU Coreutils Manual](https://www.gnu.org/software/coreutils/manual/)
