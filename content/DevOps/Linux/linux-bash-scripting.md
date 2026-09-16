---
title: "Linux Bash Scripting untuk DevOps"
description: "Panduan praktis Bash scripting untuk DevOps: Mode defensif set -euo pipefail, penanganan argumen & variabel, kontrol alur if/loop/functions, logging, dan otomasi backup database server."
order: 4
tags:
  - devops
  - linux
  - ubuntu
  - bash
  - scripting
  - automation
---

# Linux Bash Scripting untuk DevOps

> **Target:** Web Developer & DevOps Engineer yang ingin mengotomasi tugas rutin server (seperti backup database, rotasi arsip, auto-deploy kode via Git, dan health-check sistem) menggunakan script shell Bash yang kuat, aman, dan tahan terhadap error.
> **Versi:** GNU Bash 5.1+ / 5.2+ (Ubuntu 22.04 LTS / 24.04 LTS).
> Fokus modul ini: **Shebang portabel (`#!/usr/bin/env bash`) → Strict Mode Defensif (`set -euo pipefail`) → Variabel, kutipan (`"..."`), dan argumen CLI (`$1`, `$@`, `$#`) → Kondisional modern (`[[ ... ]]`) & pengujian berkas (`-f`, `-d`, `-z`) → Looping & Fungsi → Logging terstruktur dengan timestamp → Penanganan error & sinyal trap (`trap cleanup EXIT`) → Mini project: Automated Database & Asset Backup Script**.

---

## Cara Belajar

```text
🟢 Fundamental (Wajib Dipahami)
├── Anatomi Script Bash & Shebang Portabel (#!/usr/bin/env bash)
├── Hak Akses Eksekusi (chmod +x)
├── Variabel, Scope, dan Aturan Kutipan Ganda ("$VAR")
└── Argumen Baris Perintah ($1, $2, $@, $#) & Exit Status ($?)

🟡 Intermediate (Struktur Logika)
├── Strict Mode Defensif: set -euo pipefail (Mencegah Bug Bencana)
├── Evaluasi Kondisional Modern ([[ ... ]] vs [ ... ])
├── Operator Pengujian Berkas (-f file ada, -d folder ada, -z string kosong)
└── Looping Terstruktur & Pembuatan Fungsi Modular

🔴 Advanced / Otomasi Produksi
├── Exception Handling dengan Sinyal Trap (Pembersihan File Temp Otomatis)
├── Standardisasi Logging dengan Format Timestamp
└── Otomasi Skrip Mandiri yang Kompatibel dengan Cron Daemon
```

---

## Mental Model: Mengapa Harus Defensive Bash?

Secara default, Bash memiliki perilaku yang sangat toleran terhadap kegagalan: **jika sebuah baris perintah error, Bash akan tetap nekat mengeksekusi baris-baris berikutnya**.

Perhatikan skenario bencana nyata berikut:

```bash
#!/bin/bash
# Skenario Bencana Tanpa Mode Defensif:
TARGET_DIR="/tmp/cache-lama"

# Misal terjadi typo pada nama variabel atau direktori target gagal di-set:
cd "$TARGET_DIRR"   # Gagal berpindah direktori! Bash tetap lanjut mengeksekusi baris bawah!
rm -rf *            # BENCANA BESAR: Menghapus seluruh isi direktori saat ini (misal /var/www)!
```

Dengan mengaktifkan **Bash Strict Mode (`set -euo pipefail`)**, Bash akan langsung menghentikan eksekusi script begitu mendeteksi variabel yang belum terdefinisi atau perintah yang menghasilkan status error.

```text
       Skenario Script Biasa                     Skenario Script Defensif (set -euo)
       ┌────────────────────────┐                ┌────────────────────────┐
       │   Perintah 1 (Sukses)  │                │   Perintah 1 (Sukses)  │
       └───────────┬────────────┘                └───────────┬────────────┘
                   │                                         │
                   ▼                                         ▼
       ┌────────────────────────┐                ┌────────────────────────┐
       │   Perintah 2 (ERROR!)  │                │   Perintah 2 (ERROR!)  │
       └───────────┬────────────┘                └───────────┬────────────┘
                   │ Bash tetap lanjut!                      │
                   ▼                                         ▼
       ┌────────────────────────┐                ┌────────────────────────┐
       │  Perintah 3 (BENCANA)  │                │  EKSEKUSI DIHENTIKAN!  │
       │   Data Rusak / Terhapus│                │ Sistem Aman & Terlindungi
       └────────────────────────┘                └────────────────────────┘
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Anatomi Script Bash & Shebang](#1--anatomi-script-bash--shebang)
2. [Defensive Bash Mode (set -euo pipefail)](#2--defensive-bash-mode-set--euo-pipefail)
3. [Variabel, Parameter CLI, & Exit Status](#3--variabel-parameter-cli--exit-status)

### 🟡 Intermediate

4. [Evaluasi Kondisional Modern & Uji Berkas](#4--evaluasi-kondisional-modern--uji-berkas)
5. [Looping, List Data, dan Fungsi](#5--looping-list-data-dan-fungsi)

### 🔴 Advanced

6. [Error Handling, Traps, dan Logging Produksi](#6--error-handling-traps-dan-logging-produksi)

### 🛠️ Praktik

7. [Mini Project: Script Otomasi Backup Database & Web Asset](#7-️-mini-project-script-otomasi-backup-database--web-asset)

### 📚 Referensi

8. [Ringkasan & Peta Ingatan](#8--ringkasan--peta-ingatan)
9. [Urutan Belajar Berikutnya](#9--urutan-belajar-berikutnya)
10. [Referensi Resmi](#10--referensi-resmi)

---

## 1. 🟢 Anatomi Script Bash & Shebang

### Konsep

Script Bash adalah berkas teks polos berisi rangkaian perintah shell yang dieksekusi secara berurutan. Baris pertama script harus selalu memuat **Shebang (`#!`)** yang memberi tahu kernel Linux interpreter mana yang harus digunakan.

### Penulisan Shebang yang Portabel

```bash
#!/usr/bin/env bash
```

> [!TIP]
> **Gunakan `#!/usr/bin/env bash`, BUKAN `#!/bin/bash`!**
> Di beberapa sistem operasi (seperti FreeBSD, macOS dengan Homebrew, atau container Alpine), biner Bash mungkin berada di `/usr/local/bin/bash`. Memanggil `/usr/bin/env bash` menjamin script mencari biner Bash yang sesuai di environment `PATH` sistem manapun.

### Menjalankan Script

```bash
# 1. Berikan izin eksekusi pada file script
chmod +x deploy.sh

# 2. Eksekusi script secara langsung
./deploy.sh
```

---

## 2. 🟢 Defensive Bash Mode (`set -euo pipefail`)

### Konsep

Tambahkan baris berikut tepat di bawah Shebang di setiap script otomasi yang Anda buat:

```bash
#!/usr/bin/env bash
set -euo pipefail
```

### Penjelasan Rinci Setiap Flag

1. **`-e` (`errexit`):**
   * Menghentikan eksekusi script dengan segera jika ada satu perintah yang menghasilkan status keluar (*exit status code*) selain `0` (gagal).
2. **`-u` (`nounset`):**
   * Menganggap pemanggilan variabel yang belum dideklarasikan sebagai error fatal dan langsung menghentikan script (mencegah typo nama variabel seperti `$DIRR`).
3. **`-o pipefail`:**
   * Secara bawaan, pada perintah pipeline `cmd1 | cmd2`, Bash hanya mengecek status keluar dari perintah terakhir (`cmd2`). Opsi `pipefail` memastikan jika `cmd1` gagal, seluruh pipeline dianggap gagal.

Jika Anda sengaja ingin menjalankan perintah yang diperbolehkan gagal tanpa menghentikan script, tambahkan `|| true`:

```bash
# Perintah ini tidak akan memicu 'set -e' meskipun file tidak ditemukan
rm temporary-cache.tmp || true
```

---

## 3. 🟢 Variabel, Parameter CLI, & Exit Status

### Mendeklarasikan Variabel

```bash
#!/usr/bin/env bash
set -euo pipefail

# 1. Deklarasi (DILARANG memberi spasi di sekitar tanda sama dengan '=')
APP_NAME="Portal-Berita"
DEPLOY_PORT=8080
CURRENT_DATE=$(date +"%Y-%m-%d")

# 2. Mengakses nilai variabel (Selalu gunakan kurung kurawal & tanda kutip ganda)
echo "Deploying ${APP_NAME} pada tanggal: ${CURRENT_DATE}"
```

> [!IMPORTANT]
> **Selalu Bungkus Variabel dengan Tanda Kutip Ganda (`"${VAR}"`)!**
> Jika isi variabel memuat spasi (misal `FILE_NAME="My Document.txt"`), memanggil `rm $FILE_NAME` tanpa kutip akan menyebabkan Bash memecahnya menjadi dua argumen: `rm My` dan `Document.txt` (*Word Splitting Bug*).

### Parameter Argumen Baris Perintah (CLI Arguments)

Saat menjalankan script dengan parameter (`./backup.sh production database`):

```text
 $0     → Nama berkas script itu sendiri (./backup.sh)
 $1     → Argumen pertama ('production')
 $2     → Argumen kedua ('database')
 $#     → Jumlah total argumen yang dikirim (2)
 $@     → Seluruh argumen sebagai daftar terpisah ("production" "database")
 $$     → Process ID (PID) dari script yang sedang berjalan
 $?     → Exit status code dari perintah terakhir (0 = Sukses, selain 0 = Error)
```

Contoh Validasi Parameter Masukan:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Periksa apakah argumen pertama diberikan
if [[ $# -lt 1 ]]; then
    echo "Penggunaan: $0 <target-environment>"
    echo "Contoh: $0 production"
    exit 1
fi

ENVIRONMENT="$1"
echo "Target deploy: ${ENVIRONMENT}"
```

---

## 4. 🟡 Evaluasi Kondisional Modern & Uji Berkas

### Sintaks `[[ ... ]]` vs `[ ... ]`

Gunakan tanda kurung siku ganda **`[[ ... ]]`** (standar bawaan Bash modern) daripada tanda kurung tunggal `[ ... ]` (standar POSIX lawas). Kurung ganda lebih aman dari error sintaks, mendukung operator logika `&&` / `||`, dan mendukung pencocokan regex.

### Operator Pengujian Berkas & Folder

| Operator | Arti Evaluasi (True jika...) |
|---|---|
| `-f "$FILE"` | File tersebut benar-benar ada dan merupakan file reguler |
| `-d "$DIR"` | Direktori/folder tersebut benar-benar ada |
| `-z "$STR"` | String bernilai kosong (*Zero length*) |
| `-n "$STR"` | String memiliki isi (*Not empty*) |
| `-r "$FILE"` | File dapat dibaca (*Readable*) |
| `-w "$FILE"` | File dapat ditulis/diubah (*Writable*) |
| `-x "$FILE"` | File dapat dieksekusi (*Executable*) |

Contoh Penggunaan:

```bash
CONFIG_FILE="/etc/nginx/nginx.conf"

if [[ -f "${CONFIG_FILE}" ]]; then
    echo "Berkas konfigurasi ditemukan, melanjutkan pengujian..."
elif [[ -d "/etc/nginx" ]]; then
    echo "Direktori nginx ada, tetapi file nginx.conf tidak ditemukan!"
    exit 1
else
    echo "NGINX belum terpasang di sistem!"
    exit 1
fi
```

### Perbandingan Angka vs String

- **String:** Gunakan `==` dan `!=`
  * `if [[ "${ROLE}" == "admin" ]]; then`
- **Angka (Numerik):** Gunakan `-eq`, `-ne`, `-lt`, `-gt`, `-le`, `-ge`
  * `if [[ "${PORT}" -eq 80 ]]; then`

---

## 5. 🟡 Looping, List Data, dan Fungsi

### A. Looping Menggunakan Array / List

```bash
#!/usr/bin/env bash
set -euo pipefail

# Mendefinisikan array daftar nama service
SERVICES=("nginx" "mysql" "redis-server")

echo "=== Memeriksa Status Layanan ==="
for service in "${SERVICES[@]}"; do
    if systemctl is-active --quiet "${service}"; then
        echo "✅ Service ${service} sedang berjalan normal."
    else
        echo "❌ Service ${service} DALAM KONDISI MATI!"
    fi
done
```

### B. Membaca Berkas Baris Demi Baris

Gunakan konstruksi `while IFS= read -r line` (cara teraman membaca file teks tanpa merusak whitespace):

```bash
INPUT_FILE="/var/www/users.txt"

while IFS= read -r user || [[ -n "${user}" ]]; do
    echo "Memproses user: ${user}"
done < "${INPUT_FILE}"
```

### C. Membuat Fungsi Modular

Fungsi di Bash membantu memecah script panjang menjadi bagian-bagian logis yang mudah dirawat.

```bash
#!/usr/bin/env bash
set -euo pipefail

# Mendefinisikan fungsi logging berstempel waktu
log_info() {
    local message="$1"
    echo "[INFO] [$(date +'%Y-%m-%d %H:%M:%S')] ${message}"
}

log_error() {
    local message="$1"
    # Cetak pesan error ke stderr (stream 2)
    echo "[ERROR] [$(date +'%Y-%m-%d %H:%M:%S')] ${message}" >&2
}

# Memanggil fungsi
log_info "Memulai inisialisasi lingkungan aplikasi..."
log_error "Koneksi ke database gagal!"
```

> [!TIP]
> **Selalu Gunakan Kata Kunci `local` di Dalam Fungsi!**
> Secara default, seluruh variabel di Bash bersifat global. Mendeklarasikan `local message="$1"` mencegah fungsi mengubah nilai variabel di luar dirinya secara tidak sengaja.

---

## 6. 🔴 Error Handling, Traps, dan Logging Produksi

### Konsep Pembersihan Otomatis dengan `trap`

Seringkali script otomasi membuat file temporer di `/tmp`. Jika script terhenti di tengah jalan karena error atau dihentikan paksa pengguna (`Ctrl + C`), file temporer tersebut akan tertinggal dan mengotori disk.

Dengan utilitas **`trap`**, kita dapat mendaftarkan fungsi pembersih (*cleanup*) yang **dijamin akan dieksekusi saat script berhenti**, baik saat selesai normal, terkena sinyal `SIGINT`, ataupun crash:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Buat file kerja temporer
TEMP_FILE=$(mktemp /tmp/deploy-payload.XXXXXX)

# Fungsi pembersihan
cleanup() {
    local exit_code=$?
    echo "Membersihkan berkas temporer: ${TEMP_FILE}..."
    rm -f "${TEMP_FILE}"
    exit "${exit_code}"
}

# Daftarkan trap pada sinyal EXIT, SIGINT, dan SIGTERM
trap cleanup EXIT SIGINT SIGTERM

echo "Menulis data rahasia ke: ${TEMP_FILE}"
echo "Payload deployment aktif" > "${TEMP_FILE}"

# Lakukan proses kerja di sini...
```

---

## 7. 🛠️ Mini Project: Script Otomasi Backup Database & Web Asset

### Tujuan

Membangun script backup mandiri yang memenuhi standar produksi:
1. Memakai strict mode `set -euo pipefail`.
2. Melakukan dump database (simulasi SQLite/MySQL/PostgreSQL) dan arsip berkas web ke format `.tar.gz`.
3. Menyimpan hasil backup dengan penamaan tanggal yang rapi.
4. Menghapus backup lama yang berusia lebih dari 7 hari (rotasi disk otomatis).
5. Menyediakan logging waktu dan pembersihan file temporer via `trap`.

### Implementasi Lengkap

Simpan script berikut di `/usr/local/bin/auto-backup.sh`:

```bash
#!/usr/bin/env bash
# ==============================================================================
# Script Otomasi Backup Harian Web Assets & Database
# ==============================================================================
set -euo pipefail

# ----------------- KONFIGURASI -----------------
SOURCE_DIR="/var/www/my-app/public"
BACKUP_ROOT="/var/backups/web-app"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
RETENTION_DAYS=7
BACKUP_ARCHIVE="${BACKUP_ROOT}/backup_${TIMESTAMP}.tar.gz"
TEMP_DIR=$(mktemp -d /tmp/backup-working.XXXXXX)

# ----------------- FUNGSI LOGGING -----------------
log() {
    local level="$1"
    local msg="$2"
    echo "[${level}] [$(date +'%Y-%m-%d %H:%M:%S')] ${msg}"
}

# ----------------- TRAP CLEANUP -----------------
cleanup() {
    local exit_status=$?
    if [[ -d "${TEMP_DIR}" ]]; then
        log "INFO" "Membersihkan folder temporer: ${TEMP_DIR}"
        rm -rf "${TEMP_DIR}"
    fi
    if [[ ${exit_status} -eq 0 ]]; then
        log "INFO" "=== Seluruh Operasi Backup Selesai dengan Sukses ==="
    else
        log "ERROR" "=== Backup GAGAL! Exit status: ${exit_status} ==="
    fi
    exit "${exit_status}"
}
trap cleanup EXIT SIGINT SIGTERM

# ----------------- PROSES UTAMA -----------------
log "INFO" "=== Memulai Alur Backup Harian ==="

# 1. Validasi keberadaan direktori sumber
if [[ ! -d "${SOURCE_DIR}" ]]; then
    log "ERROR" "Direktori sumber ${SOURCE_DIR} tidak ditemukan!"
    exit 1
fi

# 2. Buat direktori tujuan backup jika belum ada
mkdir -p "${BACKUP_ROOT}"

# 3. Simulasi dump data ke folder temporer
log "INFO" "Mengekstrak metadata database ke folder kerja..."
echo "Database dump exported at ${TIMESTAMP}" > "${TEMP_DIR}/db_dump.sql"

# 4. Menyalin aset statis ke folder kerja
log "INFO" "Menyalin berkas web dari ${SOURCE_DIR}..."
cp -r "${SOURCE_DIR}" "${TEMP_DIR}/assets"

# 5. Mengompresi hasil ke dalam arsip tar.gz
log "INFO" "Mengompresi data backup ke ${BACKUP_ARCHIVE}..."
tar -czf "${BACKUP_ARCHIVE}" -C "${TEMP_DIR}" .

# 6. Menampilkan ukuran arsip akhir
ARCHIVE_SIZE=$(du -h "${BACKUP_ARCHIVE}" | awk '{print $1}')
log "INFO" "Arsip backup berhasil dibuat! Ukuran berkas: ${ARCHIVE_SIZE}"

# 7. Rotasi Otomatis: Hapus backup yang lebih tua dari batas retensi
log "INFO" "Memeriksa dan menghapus backup yang berumur > ${RETENTION_DAYS} hari..."
find "${BACKUP_ROOT}" -type f -name "backup_*.tar.gz" -mtime +"${RETENTION_DAYS}" -exec rm -f {} \; -print
```

### Menguji dan Mengintegrasikan dengan Cron

```bash
# 1. Berikan hak eksekusi pada script
sudo chmod +x /usr/local/bin/auto-backup.sh

# 2. Uji jalankan langsung secara manual
sudo /usr/local/bin/auto-backup.sh

# 3. Daftarkan ke Crontab root agar berjalan otomatis setiap hari pukul 02.00 pagi
# Buka editor crontab
sudo crontab -e

# Tambahkan baris:
0 2 * * * /usr/local/bin/auto-backup.sh >> /var/log/backup-cron.log 2>&1
```

---

## 8. 📚 Ringkasan & Peta Ingatan

### Peta Ingatan Konsep

```text
Bash Scripting untuk DevOps
├── Fondasi Defensif
│   ├── Shebang portabel   → #!/usr/bin/env bash
│   └── set -euo pipefail  → Error exit, unset check, pipefail
├── Variabel & Argumen
│   ├── Double Quotes      → "${VAR}" (cegah word splitting)
│   ├── $1, $2, $@, $#     → Argumen baris perintah
│   └── Exit Code ($?)     → 0 sukses, selain 0 error
├── Kontrol Alur
│   ├── [[ ... ]]          → Evaluasi kondisional modern
│   ├── -f, -d, -z         → Uji file, folder, dan string kosong
│   └── for & while read   → Iterasi list dan membaca berkas
└── Operasional Produksi
    ├── Functions          → local var="$1"
    ├── trap cleanup EXIT  → Bersihkan file temp otomatis
    └── Cron integration  → Eksekusi berkala tanpa pengawasan
```

### Cheat Code 10 Detik

```text
set -euo pipefail              → aktifkan strict mode anti-bug
chmod +x script.sh             → jadikan script executable
if [[ -f "$FILE" ]]; then      → periksa apakah file ada
trap "rm -f $TMP" EXIT         → pembersihan file otomatis saat script selesai
TIMESTAMP=$(date +"%Y%m%d")    → generate string stempel tanggal
for item in "${ARR[@]}"; do    → looping seluruh elemen array
```

---

## 9. 🧭 Urutan Belajar Berikutnya

1. **Otomasi CI/CD:** Terapkan pemahaman Bash script ini pada workflow otomatisasi pengujian kode di [[git-workflow-kolaborasi|Git Workflow & Kolaborasi]].
2. **Container Entrypoint:** Tulis skrip `entrypoint.sh` kustom untuk menginisialisasi environment container di [[dockerfile-dasar|Dockerfile Dasar]].
3. **Penyempurnaan Server:** Pelajari bagaimana memadukan script backup dengan basis data skala besar di [[postgresql-fungsi-administrasi|PostgreSQL Fungsi & Administrasi]].

---

## 10. 🔗 Referensi Resmi

- [GNU Bash Reference Manual](https://www.gnu.org/software/bash/manual/bash.html)
- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
- [Bash Hackers Wiki](https://wiki.bash-hackers.org/)
- [ShellCheck (Linter Otomatis Analisis Kode Shell)](https://www.shellcheck.net/)
