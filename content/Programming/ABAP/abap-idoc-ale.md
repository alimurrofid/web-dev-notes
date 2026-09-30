---
title: "IDoc & ALE Asynchronous Integration"
description: "Panduan komprehensif teknologi integrasi asinkron IDoc dan ALE di SAP: arsitektur 3 lapis IDoc (Control, Data, Status Records), Message Types, Basic Types, Partner Profile (WE20), alur Inbound dan Outbound, monitoring via WE02/WE05, pemrosesan ulang error di BD87, serta batasan kontekstual antara S/4HANA On-Premise dan ABAP Cloud."
order: 14
tags:
  - sap
  - abap
  - integration
  - idoc
  - ale
---

# IDoc & ALE Asynchronous Integration

> Target: ABAP Developer (Lanjutan)  
> Prasyarat: [[abap-modularization|Modul 5: Modularization (RFC & BAPI)]]  
> Lingkungan: SAP NetWeaver, SAP S/4HANA (On-Premise / Private Cloud)

---

## Gambaran Umum

Dalam lanskap korporasi global, sistem SAP jarang berdiri sendiri. SAP harus berkomunikasi dengan ribuan sistem eksternal: sistem gudang otomatis (*Warehouse Management System / WMS*), mesin kasir (*Point of Sale / POS*), platform e-commerce, perbankan, dan mitra logistik pihak ketiga melalui pertukaran data elektronik (*Electronic Data Interchange / EDI*).

Meskipun komunikasi sinkron langsung seperti [[abap-modularization|RFC atau REST API]] populer untuk interaksi real-time, komunikasi tersebut memiliki risiko: jika sistem penerima sedang *down* atau mengalami gangguan jaringan, transaksi pengirim akan langsung gagal dan terhenti.

**ALE (Application Link Enabling)** dan **IDoc (Intermediate Document)** adalah teknologi integrasi **asinkron berstandar industri** milik SAP. IDoc bertindak sebagai "amplop data elektronik" terstruktur yang menjamin pesan transaksi dapat dikirim, diantrekan, dilacak, dan diproses ulang secara andal tanpa risiko kehilangan data bisnis.

---

## Daftar Isi

### 🟢 Fundamental

1. [Apa itu IDoc dan ALE?](#1--apa-itu-idoc-dan-ale)
2. [Kasus Penggunaan: Mengapa Integrasi Asinkron Diperlukan](#2--kasus-penggunaan-mengapa-integrasi-asinkron-diperlukan)
3. [Arsitektur 3 Lapis IDoc (Control, Data, Status Records)](#3--arsitektur-3-lapis-idoc-control-data-status-records)
4. [Anatomi Objek: Message Type, Basic Type, & Segmen](#4--anatomi-objek-message-type-basic-type--segmen)

### 🟡 Lanjutan

5. [Konfigurasi Komunikasi: Partner Profile (WE20) & Port (WE21)](#5--konfigurasi-komunikasi-partner-profile-we20--port-we21)
6. [Alur Pemrosesan Dokumen: Outbound vs Inbound](#6--alur-pemrosesan-dokumen-outbound-vs-inbound)
7. [Kode Status Kritis IDoc (Status 51, 53, 03, 12)](#7--kode-status-kritis-idoc-status-51-53-03-12)
8. [Alat Monitoring & Investigasi: T-Code WE02 / WE05](#8--alat-monitoring--investigasi-t-code-we02--we05)
9. [Pemrosesan Ulang Error Massal via T-Code BD87](#9--pemrosesan-ulang-error-massal-via-t-code-bd87)
10. [Perbandingan Konteks: S/4HANA On-Premise vs ABAP Cloud](#10--perbandingan-konteks-s4hana-on-premise-vs-abap-cloud)

### 🛠️ Praktik & Rujukan

11. [Praktik: Investigasi & Pemulihan IDoc Gagal (Status 51)](#11-️-praktik-investigasi--pemulihan-idoc-gagal-status-51)
12. [Ringkasan & Cheat Code IDoc](#12--ringkasan--cheat-code-idoc)
13. [Referensi Resmi](#13--referensi-resmi)

---

## 1. 🟢 Apa itu IDoc dan ALE?

* **ALE (Application Link Enabling)**: Adalah kerangka kerja arsitektur SAP untuk membangun dan mengoperasikan proses bisnis terdistribusi antar-sistem SAP atau antara SAP dengan sistem non-SAP.
* **IDoc (Intermediate Document)**: Adalah wadah format data standar (*data container*) berbasis teks terstruktur yang digunakan oleh ALE sebagai media pertukaran informasi bisnis (mirip dokumen XML atau payload JSON terstandarisasi di dunia web).

---

## 2. 🟢 Kasus Penggunaan: Mengapa Integrasi Asinkron Diperlukan

Bandingkan dua skenario integrasi berikut:

```text
Skenario Sinkron (RFC / API Langsung):
SAP ERP ────────(Kirim Pesanan Langsung)───────> Sistem Gudang WMS
[Jika server WMS sedang maintenance, transaksi di SAP gagal seketika!]

Skenario Asinkron (IDoc / ALE):
SAP ERP ───(Terbitkan IDoc)───> Outbound Queue ───(Kirim Berkala)───> Server WMS
                                      │
                                      ▼
             [Jika WMS mati, IDoc tersimpan aman di antrean SAP
              dan akan otomatis dikirim saat koneksi pulih kembali]
```

Karakteristik integrasi IDoc:
1. **Decoupled**: Sistem pengirim tidak perlu menunggu respon sistem penerima untuk menyelesaikan transaksinya.
2. **Audit Trail Lengkap**: Setiap tahapan transmisi dan pemrosesan dicatat permanen dalam riwayat nomor status.
3. **Dukungan Reprocessing**: Dokumen yang gagal diproses akibat salah konfigurasi master data dapat dipicu ulang tanpa perlu mengirim ulang dokumen dari sistem hulu.

---

## 3. 🟢 Arsitektur 3 Lapis IDoc (Control, Data, Status Records)

Setiap dokumen IDoc di dalam database SAP tersusun atas tepat tiga struktur tabel fisik:

```text
Struktur Fisik IDoc:
┌─────────────────────────────────────────────────────────────┐
│ 1. Control Record (Tabel EDIDC)                             │
│    "Kepala Surat": Pengirim, Penerima, Tipe Pesan, Port     │
├─────────────────────────────────────────────────────────────┤
│ 2. Data Records (Tabel EDIDD)                               │
│    "Isi Dokumen": Segmen Header, Baris Item, Angka Nominal │
│    ├── Segmen E1EDK01 (Header Order)                        │
│    ├── Segmen E1EDP01 (Item 10: Material A, Qty 5)          │
│    └── Segmen E1EDP01 (Item 20: Material B, Qty 2)          │
├─────────────────────────────────────────────────────────────┤
│ 3. Status Records (Tabel EDIDS)                             │
│    "Riwayat Perjalanan": Jejak status penanganan dokumen    │
│    ├── Status 01: IDoc berhasil dibuat                      │
│    ├── Status 30: Siap dikirim ke port                      │
│    └── Status 03: Data sukses diteruskan ke sistem partner  │
└─────────────────────────────────────────────────────────────┘
```

1. **Control Record (`EDIDC`)**: Memuat informasi metadata perutean persis seperti amplop surat pos (Nomor IDoc, *Sender Partner*, *Receiver Partner*, *Message Type*, tanggal pembuatan).
2. **Data Records (`EDIDD`)**: Memuat isi data transaksi bisnis aktual yang dipecah ke dalam baris-baris segmen data string berpanjang tetap (maksimal 1000 karakter per segmen).
3. **Status Records (`EDIDS`)**: Memuat catatan log waktu nyata (*audit log*) mengenai apa yang terjadi pada IDoc tersebut sejak pertama kali diciptakan hingga selesai diproses.

> [!NOTE]
> **Karakteristik Infrastruktur Classic:**
> Tabel fisik `EDIDC`, `EDIDD`, dan `EDIDS` merupakan fondasi arsitektur *classic SAP IDoc processing* pada SAP NetWeaver dan SAP S/4HANA (On-Premise / Private Edition). Pada model pengembangan ABAP Cloud, tabel-tabel database fisik ini berstatus *unreleased*, sehingga tidak dapat diakses secara langsung melalui custom code ABAP Cloud.

---

## 4. 🟢 Anatomi Objek: Message Type, Basic Type, & Segmen

Untuk memahami komunikasi IDoc, Anda harus menguasai hierarki pembentuknya di Data Dictionary:

```text
Message Type: ORDERS (Makna Semantik Bisnis: Pesanan Pembelian)
      │
      ▼
Basic Type: ORDERS05 (Struktur Teknis Skema Data di T-Code WE30)
      │
      ├── Segmen: E1EDK01 (Data Umum Header)
      │     ├── Field: ACTION
      │     ├── Field: CURCY (Mata Uang)
      │     └── Field: WKURS (Nilai Tukar Kurs)
      │
      └── Segmen: E1EDP01 (Data Rincian Baris Barang)
            ├── Field: POSEX (Nomor Item Dokumen)
            ├── Field: MENGE (Kuantitas Barang)
            └── Field: MENGE_UNIT (Satuan Ukur / UoM)
```

* **Segment (T-Code `WE31`)**: Struktur field individual yang menampung atribut data tertentu (mirip baris struktur DDIC).
* **Basic Type (T-Code `WE30`)**: Definisi skema gabungan segmen-segmen secara hierarkis yang menentukan tata letak format IDoc secara teknis.
* **Message Type (T-Code `WE81`)**: Nama arti bisnis dari pesan yang dipertukarkan (contoh: `ORDERS` untuk pesanan, `INVOIC` untuk faktur penagihan, `MATMAS` untuk master data material).
* **Hubungan Message Type ke Basic Type**: Dihubungkan di T-Code **`WE82`**.

---

## 5. 🟡 Konfigurasi Komunikasi: Partner Profile (WE20) & Port (WE21)

Sebelum sistem SAP dapat mengirim atau menerima IDoc dari partner bisnis, administrator/developer wajib mengonfigurasi dua objek komunikasi melalui transaksi SAP GUI classic:

### 1. Port Definition (T-Code `WE21`)
Menentukan media transmisi fisik keluarnya data:
* **tRFC Port**: Mengirim data langsung ke sistem SAP/eksternal lain via koneksi RFC (`SM59`).
* **File Port**: Menuliskan data IDoc menjadi file flat teks (`.txt` / `.dat`) di direktori storage server OS (`AL11`).
* **XML Port**: Mengirimkan data dalam format terstruktur XML via web service.

### 2. Partner Profile (T-Code `WE20`)
Buku telepon yang menentukan aturan pertukaran pesan dengan mitra tertentu (Vendor `LI`, Customer `KU`, atau Logical System `LS`):
* **Outbound Parameters**: Menentukan *Message Type* apa saja yang boleh dikirim ke partner tersebut, port yang digunakan, dan mode pengiriman (*Pass IDoc Immediately* vs *Collect IDocs*).
* **Inbound Parameters**: Menentukan *Message Type* apa saja yang diizinkan masuk dari partner tersebut dan Process Code (yang mengarahkan ke Function Module inbound classic) mana yang bertugas memprosesnya menjadi transaksi SAP.

> [!NOTE]
> **Tooling Lanskap Classic:**
> Transaksi `WE20`, `WE21`, dan mekanisme *Process Code* berbasis Function Module classic (seperti `IDOC_INPUT_*` dan `MASTER_IDOC_DISTRIBUTE`) dirancang untuk operasional lanskap on-premise dan private cloud. Transaksi dan API classic ini bukan merupakan *Released APIs* dalam model pengembangan ABAP Cloud.

---

## 6. 🟡 Alur Pemrosesan Dokumen: Outbound vs Inbound

### Alur Outbound (Keluar dari SAP)
```text
Transaksi Bisnis (VA01 / ME21N) Dibuat
                 │
                 ▼
Kondisi Output Terpemicu (NAST / Message Control)
                 │
                 ▼
IDoc Terbentuk di Database (Status 01)
                 │
                 ▼
Diteruskan ke Port Komunikasi (Status 30)
                 │
                 ▼
Terkirim Sukses ke Partner Luar (Status 03 / 12)
```

### Alur Inbound (Masuk ke SAP)
```text
Sistem Eksternal Mengirim IDoc ke SAP via RFC / File
                 │
                 ▼
IDoc Diterima & Disimpan di Database SAP (Status 50)
                 │
                 ▼
Process Code Mengidentifikasi Function Module Inbound
                 │
                 ▼
Eksekusi Pembuatan Dokumen Transaksi (BAPI / Call Transaction)
                 │
         ┌───────┴───────┐
         ▼               ▼
     Berhasil          Gagal
  (Status 53)       (Status 51)
```

---

## 7. 🟡 Kode Status Kritis IDoc (Status 51, 53, 03, 12)

Mengetahui arti nomor status adalah kunci utama pemecahan masalah operasional IDoc:

### Status Penting Pemrosesan Outbound (Keluar)

| Kode Status | Arti Status | Makna Operasional |
| :---: | :--- | :--- |
| **`01`** | *IDoc generated* | Dokumen IDoc sukses dibuat di SAP. |
| **`30`** | *IDoc ready for dispatch* | Dokumen siap dikirim, menunggu jadwal batch job `RSEOUT00`. |
| **`03`** | *Data passed to port* | Data sukses diserahkan ke layer komunikasi/port (Status Sukses Standar Outbound). |
| **`12`** | *Dispatch OK* | Sistem partner eksternal telah mengonfirmasi penerimaan paket data. |
| **`02`** | *Error passing data to port* | Terjadi kesalahan teknis koneksi/port saat pengiriman. |

### Status Penting Pemrosesan Inbound (Masuk)

| Kode Status | Arti Status | Makna Operasional |
| :---: | :--- | :--- |
| **`50`** | *IDoc added to database* | Data paket masuk sukses diterima oleh SAP. |
| **`64`** | *IDoc ready to be passed to app* | Data siap dieksekusi, menunggu antrean job `RBDAPP01`. |
| **`53`** | 🟢 *Application document posted* | **SUKSES PENUH!** Dokumen bisnis (PO/SO/Billing) berhasil tercipta di SAP. |
| **`51`** | 🔴 *Application document not posted* | **ERROR BISNIS!** Gagal membuat dokumen akibat validasi data salah. |

---

## 8. 🟡 Alat Monitoring & Investigasi: T-Code WE02 / WE05

**`WE02`** dan **`WE05`** adalah transaksi SAP GUI classic yang menjadi instrumen utama developer dan tim support di lingkungan on-premise untuk melakukan investigasi forensik dokumen IDoc:

```text
Tampilan Layar WE02:
┌─────────────────────────────────────────────────────────────┐
│ IDoc: 0000000001234567 | Msg: ORDERS | Status: 51 (Error)   │
├─────────────────────────────────────────────────────────────┤
│ ├── Control Record                                          │
│ │   └── Sender: WMS_SYSTEM  Receiver: SAP_PRD               │
│ ├── Data Records                                            │
│ │   ├── E1EDK01 (Header: Doc Date 2026-09-30)               │
│ │   └── E1EDP01 (Item 10: Material MAT-X9, Qty 100 PC)      │
│ └── Status Records                                          │
│     ├── Status 50 (10:14:02) - IDoc received successfully   │
│     ├── Status 64 (10:14:03) - Ready for application        │
│     └── Status 51 (10:14:05) - Material MAT-X9 does not     │
│                                exist in plant 1000!         │
└─────────────────────────────────────────────────────────────┘
```

Dengan mengklik node **Status Records**, Anda dapat membaca pesan kesalahan spesifik persis seperti pesan validasi transaksi di layar dialog biasa.

---

## 9. 🟡 Pemrosesan Ulang Error Massal via T-Code BD87

Pada lingkungan SAP GUI classic (On-Premise dan Private Edition), jika terjadi insiden operasional di mana 200 IDoc gagal masuk (Status 51) karena master data pelanggan belum diaktifkan oleh tim Master Data:
1. Tim Master Data memperbaiki master data di `BP` / `XD01`.
2. Developer **tidak perlu meminta partner mengirim ulang data**.
3. Buka T-Code **`BD87`** (*Status Monitor for ALE Messages*).
4. Masukkan kriteria filter (Nomor IDoc atau rentang tanggal).
5. Buka kelompok status **Inbound $\rightarrow$ Status 51**.
6. Pilih node pesan yang gagal $\rightarrow$ Klik tombol **Process** (F8).
7. Sistem akan mengeksekusi ulang seluruh antrean IDoc tersebut secara batch dan mengubah statusnya menjadi **Status 53 (Sukses)** seketika!

> [!NOTE]
> **Operasional Lingkungan Classic:**
> Transaksi `BD87`, `WE02`, dan `WE05` beroperasi secara native di SAP GUI pada lingkungan on-premise dan private cloud. Di lingkungan cloud murni tanpa SAP GUI (seperti SAP S/4HANA Cloud Public Edition), pemantauan integrasi dilakukan melalui aplikasi Fiori resmi (*Message Monitoring*) sesuai kontrak antarmuka yang dirilis.

---

## 10. 🟡 Perbandingan Konteks: S/4HANA On-Premise vs ABAP Cloud

Untuk memahami penerapan integrasi secara tepat, penting membedakan antara **arsitektur integrasi classic**, **model pengembangan ABAP Cloud**, dan **ketersediaan antarmuka pada berbagai model deployment SAP**:

| Aspek Integrasi | SAP S/4HANA (On-Premise / Private Cloud) | Model Pengembangan ABAP Cloud (BTP / Public Edition) |
| :--- | :--- | :--- |
| **Relevansi Classic IDoc & ALE** | **Didukung Penuh & Sangat Aktif** (Pilar utama integrasi pertukaran dokumen antar-sistem enterprise) | ⚠️ **Akses API Classic Dibatasi** (Tabel dan function module classic IDoc berstatus *unreleased*) |
| **Akses Data & Objek (`EDIDC`, FMs)** | Akses langsung via Open SQL, SE11, dan function module classic (`IDOC_INPUT_*`, `MASTER_IDOC_DISTRIBUTE`) | Hanya diizinkan menggunakan **Released APIs** dan protokol terstandarisasi cloud |
| **Alat Monitoring & Operasional** | Transaksi SAP GUI classic (`WE02`, `WE05`, `WE20`, `WE21`, `BD87`) | SAP Fiori Apps (*Message Monitoring*, *Communication Management*) |
| **Mekanisme Integrasi yang Digunakan** | Classic IDoc/ALE, BAPI/RFC, Web Services SOAP, dan OData | Menggunakan **Released APIs & Services** sesuai skenario: OData Services, SOAP Web Services, HTTP Services, RFC (via Communication Arrangement), serta integrasi berbasis event (*SAP Event Mesh*) |

> [!IMPORTANT]
> **Konteks Environment & Model Pengembangan:**
> - **Bukan Penggantian Universal:** Teknologi IDoc dan ALE tidak secara universal "digantikan" di seluruh lanskap SAP. Pada instalasi SAP S/4HANA On-Premise dan Private Edition, IDoc tetap menjadi tulang punggung integrasi EDI dan pertukaran dokumen asinkron yang sangat stabil dan terus dipelihara.
> - **Aturan Clean Core di ABAP Cloud:** Pada model pengembangan ABAP Cloud (seperti di SAP S/4HANA Cloud Public Edition atau SAP BTP ABAP Environment), sistem memberlakukan batasan ketat terhadap penggunaan API dan tabel internal unreleased (`EDIDC`, `EDIDD`, function module classic IDoc). Oleh karena itu, skenario integrasi baru pada lingkungan tersebut dibangun memanfaatkan antarmuka modern yang berstatus *Released API* (seperti OData, SOAP web services, HTTP services, atau event-based architecture) sesuai ketersediaan pada rilis yang bersangkutan.

---

## 11. 🛠️ Praktik: Investigasi & Pemulihan IDoc Gagal (Status 51)

### Skenario Insiden
Sebuah pesanan penjualan dari portal web e-commerce masuk ke SAP melalui IDoc Inbound dengan Message Type `ORDERS`, namun tersangkut dengan **Status 51**.

### Langkah 1: Investigasi di T-Code `WE02`
1. Buka `WE02`, masukkan tanggal hari ini dan Message Type `ORDERS`.
2. Temukan baris IDoc dengan ikon lampu merah bertanda status `51`.
3. Buka pohon **Status Records** $\rightarrow$ Klik dua kali pada status `51` paling akhir:
   * **Pesan Error**: `"Material MAT-Z99 is not maintained in Sales Organization 1000"` (Nomor Pesan: `V1 311`).
4. Buka pohon **Data Records** $\rightarrow$ Segmen `E1EDP01`:
   * Field `KTEXT`: Mengonfirmasi nama barang pesanan terkait.

### Langkah 2: Remediasi Data di Sistem SAP
1. Buka T-Code `MM01` / `MM02`.
2. Perluas pandangan (*views*) Sales Data untuk material `MAT-Z99` pada Sales Org `1000` dan Dist. Channel `10`.
3. Simpan perubahan.

### Langkah 3: Eksekusi Ulang Melalui T-Code `BD87`
1. Buka T-Code `BD87`.
2. Masukkan IDoc number `0000000099887766` pada layar seleksi $\rightarrow$ Eksekusi (F8).
3. Letakkan kursor pada baris Message Type `ORDERS` bertanda merah $\rightarrow$ Klik tombol **Process** di toolbar atas.
4. Sistem memproses ulang data payload segmen IDoc tersebut ke fungsi `BAPI_SALESORDER_CREATEFROMDAT2`.
5. Layar memunculkan laporan sukses:
   ```text
   IDoc 0000000099887766: Status changed from 51 to 53.
   Standard Order 140029 berhasil dibuat di database!
   ```

---

## 12. 📚 Ringkasan & Cheat Code IDoc

### Peta Konsep
```text
Arsitektur Integrasi IDoc & ALE
├── 1. Tiga Lapis Struktur Dokumen
│   ├── Control Record (EDIDC - Metadata amplop & partner)
│   ├── Data Records (EDIDD - Nilai payload di segmen)
│   └── Status Records (EDIDS - Riwayat status penanganan)
├── 2. Konfigurasi Komunikasi
│   ├── WE21 (Port Definition - tRFC, File, XML)
│   └── WE20 (Partner Profile - Penentu aturan Inbound/Outbound)
├── 3. Status-Status Kunci
│   ├── Outbound: 01 (Created) ──> 30 (Ready) ──> 03 (Passed to Port)
│   └── Inbound:  50 (Received) ──> 64 (Ready) ──> 53 (Sukses) / 51 (Gagal)
└── 4. Tool Operasional Harian
    ├── WE02 / WE05: Monitoring & audit log forensik
    └── BD87: Pemrosesan ulang massal IDoc gagal
```

### Cheat Code T-Code IDoc 10 Detik
```text
WE02 / WE05  → Display & investigasi dokumen IDoc
WE20         → Konfigurasi Partner Profile (Inbound/Outbound)
WE21         → Konfigurasi Port komunikasi fisik
WE30 / WE31  → Desain skema struktur Basic Type & Segmen
BD87         → Eksekusi ulang (Reprocessing) antrean IDoc gagal
```

---

## 13. 🔗 Referensi Resmi

* [SAP Help Portal: IDoc Interface / Electronic Data Interchange (EDI)](https://help.sap.com/docs/SAP_NETWEAVER_700/c238d694b825421f940829322fed326f/491e847c21351d8de10000000a42189c.html)
* [SAP Help Portal: Application Link Enabling (ALE) Architecture](https://help.sap.com/docs/SAP_NETWEAVER_700/c238d694b825421f940829322fed326f/491e847c21351d8de10000000a42189c.html)
* [SAP Community: Troubleshooting Inbound and Outbound IDocs Guide](https://community.sap.com/t5/technology-blogs-by-sap/idoc-troubleshooting-for-beginners/ba-p/13289012)
