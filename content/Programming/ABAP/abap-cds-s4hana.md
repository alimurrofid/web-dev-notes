---
title: "ABAP Core Data Services (CDS Views) & AMDP"
description: "Panduan lengkap paradigma modern S/4HANA di SAP ABAP: Paradigma Code-to-Data, Eclipse ADT, ABAP Core Data Services (CDS Views), Associations, Annotations, Virtual Data Model (VDM), dan ABAP Managed Database Procedures (AMDP)."
order: 10
tags:
  - programming
  - abap
  - sap
  - s4hana
  - cds
  - amdp
  - advanced
---

# ABAP Core Data Services (CDS Views) & AMDP

> **Target:** Advanced ABAP Developer yang ingin bertransisi ke era modern SAP S/4HANA dan memanfaatkan kapabilitas penuh basis data in-memory SAP HANA.
> **Versi:** SAP S/4HANA (On-Premise & Cloud) & SAP NetWeaver AS ABAP 7.50+ (Eclipse ADT).
> **Prasyarat:** Telah memahami [[abap-dictionary|ABAP Data Dictionary (DDIC)]], [[abap-database|ABAP Database & Open SQL]], dan [[abap-oop|ABAP Objects (OOP)]].

---

## Gambaran Umum

Ketika SAP merilis platform **SAP HANA** — basis data relasional berbasis *in-memory* yang memproses data di RAM dengan kecepatan komputasi jutaan baris per detik — paradigma arsitektur pemrograman ABAP mengalami perubahan paling dramatis dalam sejarahnya.

Pada sistem SAP klasik, developer menggunakan prinsip **Data-to-Code**: jutaan data mentah ditarik dari database ke Application Server, lalu diproses menggunakan perulangan `LOOP AT` internal table. Di era S/4HANA, pendekatan ini digantikan oleh **Code-to-Data (Code Pushdown)**: seluruh kalkulasi rumit, agregasi, pemfilteran, dan logika bisnis didorong langsung ke mesin database SAP HANA.

Dua pilar utama yang mewujudkan paradigma *Code Pushdown* ini adalah **ABAP Core Data Services (CDS Views)** dan **ABAP Managed Database Procedures (AMDP)**.

---

## Cara Belajar

```text
🟢 Fundamental
→ Pahami pergeseran paradigma Code-to-Data, konfigurasi Eclipse ADT, sintaks dasar DDL CDS View, dan Anotasi (@).

🟡 Lanjutan
→ Kuasai Associations (Join-on-demand), Virtual Data Model (VDM), dan penulisan SQLScript HANA via AMDP Class.

🛠️ Praktik
→ Bangun mini project model data analitik penjualan S/4HANA menggabungkan Header, Item, Asosiasi, dan konsumsi via Open SQL.
```

Mental model perbandingan paradigma Klasik vs Paradigma Modern S/4HANA:

```text
PARADIGMA KLASIK (DATA-TO-CODE) - LAMBAT:
Database Disk ──(Kirim 1 Juta Baris Data Mentah)──> Application Server RAM
                                                          │
                                                          ▼
                                            CPU ABAP memproses via LOOP AT
                                            (Boros Network & RAM Server)

PARADIGMA MODERN S/4HANA (CODE-TO-DATA) - SANGAT CEPAT:
Program ABAP ──(Kirim Logika Bisnis CDS/AMDP)──> SAP HANA In-Memory Engine
                                                          │
                                                          ▼
                                            HANA memproses 1 juta baris di RAM
                                                          │
Database HANA <──(Hanya Kirim 10 Baris Hasil Akhir)───────┘
```

**Hafalan:**

```text
Code Pushdown  → Mendorong eksekusi kalkulasi dan filter dari server ABAP langsung ke SAP HANA
Eclipse ADT    → ABAP Development Tools: IDE wajib untuk membuat CDS Views dan AMDP
CDS View       → Core Data Services: definisi model data semantik tingkat tinggi di DB layer
Association    → Relasi antar entitas cerdas (Join-on-demand) yang hanya dieksekusi saat diminta
Annotation (@) → Metadata instruksi untuk mengonfigurasi UI, otorisasi, dan analitik di CDS
AMDP           → ABAP Managed Database Procedures: menulis SQLScript HANA di dalam Class ABAP
VDM            → Virtual Data Model: standar arsitektur view SAP S/4HANA (Interface & Consumption)
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Revolusi S/4HANA: Paradigma Code-to-Data](#1--revolusi-s4hana-paradigma-code-to-data)
2. [Lingkungan Pengembangan Wajib: Eclipse ADT](#2--lingkungan-pengembangan-wajib-eclipse-adt)
3. [Pengenalan ABAP Core Data Services (CDS Views)](#3--pengenalan-abap-core-data-services-cds-views)
4. [Anatomi Sintaks DDL CDS View & Anotasi (@)](#4--anatomi-sintaks-ddl-cds-view--anotasi-)
5. [Ekspresi Logika di CDS: CASE & Built-in Functions](#5--ekspresi-logika-di-cds-case--built-in-functions)

### 🟡 Lanjutan

6. [Asosiasi (Associations) vs Joins Tradisional](#6--asosiasi-associations-vs-joins-tradisional)
7. [Virtual Data Model (VDM): Interface vs Consumption Views](#7--virtual-data-model-vdm-interface-vs-consumption-views)
8. [Pengenalan AMDP (ABAP Managed Database Procedures)](#8--pengenalan-amdp-abap-managed-database-procedures)
9. [Anatomi Class AMDP & Bahasa SQLScript](#9--anatomi-class-amdp--bahasa-sqlscript)
10. [Kapan Menggunakan CDS View vs AMDP?](#10--kapan-menggunakan-cds-view-vs-amdp)

### 🛠️ Praktik

11. [Mini Project: Membangun Model Analitik Penjualan S/4HANA](#11-️-mini-project-membangun-model-analitik-penjualan-s4hana)

### 📚 Ringkasan & Referensi

12. [Peta Ingatan & Ringkasan](#12--peta-ingatan--ringkasan)
13. [Cheat Code CDS & AMDP 10 Detik](#13--cheat-code-cds--amdp-10-detik)
14. [Urutan Belajar Selanjutnya](#14--urutan-belajar-selanjutnya)
15. [Referensi Resmi](#15--referensi-resmi)

---

## 1. 🟢 Revolusi S/4HANA: Paradigma Code-to-Data

### Konsep

Dalam sistem tradisional, kapasitas komputasi terbesar berada di Application Server, sementara database bertindak pasif hanya sebagai gudang penyimpanan data disk.

Dengan kehadiran **SAP HANA**, database bukan lagi sekadar gudang penyimpanan pasif. SAP HANA memiliki ribuan core prosesor paralel dan mesin kalkulasi in-memory super cepat.

Prinsip **Code-to-Data**:
1. Lakukan kalkulasi agregasi (`SUM`, `AVG`), transformasi teks, dan pemfilteran sedekat mungkin dengan data fisik (di level database).
2. Hanya transfer baris hasil akhir yang telah disaring melalui jaringan ke Application Server.

---

## 2. 🟢 Lingkungan Pengembangan Wajib: Eclipse ADT

### Konsep

> [!IMPORTANT]
> **Eclipse ADT adalah Wajib:** Objek ABAP Core Data Services (CDS) dan kode AMDP **TIDAK BISA dibuat atau diedit menggunakan SAP GUI (`SE38` atau `SE11`)**. Anda wajib menggunakan **Eclipse IDE** dengan plugin resmi **ABAP Development Tools (ADT)**.

Kelebihan Eclipse ADT:
* Syntax highlighting cerdas dan auto-completion modern (*Content Assist* via Ctrl+Space).
* Pemeriksaan kesalahan penulisan (*On-the-fly syntax checking*).
* Kemudahan pemodelan grafis dependensi data antar view.

---

## 3. 🟢 Pengenalan ABAP Core Data Services (CDS Views)

### Konsep

**CDS (Core Data Services)** adalah bahasa definisi data (DDL) deklaratif generasi baru milik SAP.

Perbedaan Database View Klasik (`SE11`) vs CDS View:

| Parameter | Database View Klasik (`SE11`) | ABAP CDS View (Eclipse ADT) |
| :--- | :--- | :--- |
| **Tempat Dibuat** | SAP GUI `SE11`. | Eclipse ADT (File teks DDL). |
| **Kapabilitas Relasi** | Hanya `INNER JOIN` sederhana. | Mendukung `LEFT OUTER JOIN`, `UNION`, dan **Associations** *on-demand*. |
| **Logika Bisnis** | Tidak mendukung kalkulasi logika. | Mendukung `CASE-WHEN`, fungsi aritmatika, manipulasi string, konversi kurs mata uang. |
| **Semantik & UI** | Murni kolom tabel teknis. | Memiliki Anotasi kaya metadata yang dapat langsung membuat layar antarmuka **SAP Fiori** otomatis! |

---

## 4. 🟢 Anatomi Sintaks DDL CDS View & Anotasi (@)

### Konsep

Setiap dokumen CDS View diawali dengan sekumpulan metadata yang disebut **Anotasi** (diawali simbol `@`), diikuti deklarasi perintah `DEFINE VIEW`:

```cds
@AbapCatalog.sqlViewName: 'ZSQL_V_CUST'
@AbapCatalog.compiler.compareFilter: true
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'CDS View Master Pelanggan'

define view ZI_CustomerMaster
  as select from ztclient_master
{
  key client_id   as CustomerID,
      client_name as CustomerName,
      status      as AccountStatus,
      country     as CountryCode
}
```

### Anotasi Utama yang Wajib Dipahami

* `@AbapCatalog.sqlViewName`: Nama view fisik 16 karakter yang dibuat di database dictionary (misal: `ZSQL_V_CUST`).
* `@AccessControl.authorizationCheck`: Menentukan apakah query tunduk pada kontrol otorisasi baris data pengguna (*DCL / Data Control Language*).
* `@EndUserText.label`: Deskripsi teks ramah pengguna yang menjelaskan kegunaan view.

---

## 5. 🟢 Ekspresi Logika di CDS: CASE & Built-in Functions

### Konsep

CDS View memungkinkan Anda menyematkan logika transformasi data secara langsung:

```cds
define view ZI_SalesItemAnalytics
  as select from vbap
{
  key vbeln,
  key posnr,
      matnr,
      kwmeng,
      netwr,
      
      // 1. Ekspresi Logika CASE
      case
        when kwmeng > 100 then 'Pesanan Skala Besar'
        when kwmeng > 20  then 'Pesanan Menengah'
        else                   'Pesanan Reguler'
      end as OrderCategory,
      
      // 2. Fungsi String Bawaan
      concat( vbeln, posnr ) as UniqueItemKey
}
```

---

## 6. 🟡 Asosiasi (Associations) vs Joins Tradisional

### Konsep

Salah satu inovasi terhebat pada CDS View adalah **Association**.

Pada perintah `JOIN` tradisional, database dipaksa menggabungkan seluruh tabel di awal query meskipun pengguna hanya membutuhkan kolom dari tabel pertama. Hal ini memboroskan memori dan waktu CPU.

**Association** mendefinisikan relasi kardinalitas semantik secara "pasif" (*Join-on-demand*). Database **hanya akan menjalankan operasi JOIN jika dan hanya jika pengguna secara spesifik meminta kolom dari tabel relasi tersebut!**

```cds
define view ZI_OrderHeader
  as select from vbak
  // Mendefinisikan asosiasi ke data rincian item (Kardinalitas 1 ke banyak)
  association [1..*] to ZI_OrderItem as _Items
    on $projection.OrderID = _Items.OrderID
{
  key vbeln  as OrderID,
      kunnr  as CustomerID,
      
      // Mengekspos asosiasi agar dapat diakses oleh konsumen luar
      _Items
}
```

Jika konsumen luar hanya menulis:
`SELECT OrderID FROM ZI_OrderHeader`, database **tidak pernah menyentuh tabel item**. Namun jika konsumen menulis: `SELECT OrderID, _Items.MaterialName FROM ZI_OrderHeader`, asosiasi langsung dieksekusi secara instan!

---

## 7. 🟡 Virtual Data Model (VDM): Interface vs Consumption Views

### Konsep

Dalam arsitektur enterprise SAP S/4HANA, ribuan CDS Views disusun mengikuti standar hierarki **Virtual Data Model (VDM)**:

```text
Struktur Arsitektur VDM S/4HANA:
┌────────────────────────────────────────────────────────┐
│ 1. Consumption Views (Awalan ZC_... / C_...)           │
│    - Dibuat khusus untuk konsumsi aplikasi spesifik   │
│    - Terhubung ke SAP Fiori Elements / OData Service   │
└───────────────────────────┬────────────────────────────┘
                            │ Mengambil data dari
                            ▼
┌────────────────────────────────────────────────────────┐
│ 2. Composite Views (Awalan ZI_... / I_...)             │
│    - Menggabungkan beberapa Interface Views            │
│    - Melakukan kalkulasi metrik agregasi bisnis        │
└───────────────────────────┬────────────────────────────┘
                            │ Mengambil data dari
                            ▼
┌────────────────────────────────────────────────────────┐
│ 3. Basic / Interface Views (Awalan ZI_... / I_...)     │
│    - Tepat di atas tabel fisik database                │
│    - Menstandarisasi penamaan field (CamelCase)        │
└────────────────────────────────────────────────────────┘
```

---

## 8. 🟡 Pengenalan AMDP (ABAP Managed Database Procedures)

### Konsep

Meskipun CDS Views sangat kuat, ada situasi tertentu di mana logika bisnis memerlukan algoritma matematis yang amat kompleks, pemrosesan perulangan dinamis (*looping*), atau algoritma kecerdasan buatan (*Machine Learning PAL*) yang hanya tersedia di mesin SAP HANA.

Untuk skenario ini, SAP menyediakan **AMDP (ABAP Managed Database Procedures)**.

AMDP memungkinkan developer menuliskan kode dalam bahasa **SQLScript** (bahasa pemrograman prosedural asli milik database SAP HANA) langsung di dalam Class ABAP biasa!

---

## 9. 🟡 Anatomi Class AMDP & Bahasa SQLScript

### Konsep

Sebuah Class ABAP diakui sebagai AMDP jika mengimplementasikan marker interface **`IF_AMDP_MARKER_HDB`**.

```abap
CLASS zcl_amdp_demo DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES if_amdp_marker_hdb. " <-- Marker Wajib AMDP

    TYPES: BEGIN OF ty_result,
             material TYPE c LENGTH 10,
             total    TYPE p LENGTH 9 DECIMALS 2,
           END OF ty_result,
           tt_result TYPE STANDARD TABLE OF ty_result WITH EMPTY KEY.

    METHODS hitung_agregasi_rumit
      IMPORTING VALUE(iv_cutoff) TYPE d
      EXPORTING VALUE(et_result) TYPE tt_result.
ENDCLASS.

CLASS zcl_amdp_demo IMPLEMENTATION.
  " Deklarasi implementasi database procedure
  METHOD hitung_agregasi_rumit BY DATABASE PROCEDURE
                               FOR HDB
                               LANGUAGE SQLSCRIPT
                               OPTIONS READ-ONLY
                               USING ztorder_items.
    -- KODE DI BAWAH INI ADALAH MURNI BAHASA SQLSCRIPT (BUKAN ABAP!):
    et_result = SELECT material, SUM( netwr ) AS total
                  FROM ztorder_items
                  WHERE order_date >= :iv_cutoff
                  GROUP BY material;
  ENDMETHOD.
ENDCLASS.
```

> [!NOTE]
> **Client Handling di SQLScript / AMDP:**
> Berbeda dengan ABAP Open SQL yang otomatis memfilter klien aktif (`MANDT = sy-mandt`), native SQLScript pada tabel *client-dependent* tidak melakukan filter otomatis secara default. Developer dapat mengelola isolasi klien dengan menambahkan filter `WHERE mandt = session_context('CLIENT')`, meneruskan parameter klien `:iv_client`, atau menyematkan opsi `AMDP OPTIONS CDS SESSION CLIENT CURRENT` (sejak ABAP 7.52).

---

## 10. 🟡 Kapan Menggunakan CDS View vs AMDP?

| Kriteria Kebutuhan | Solusi Rekomendasi Utama |
| :--- | :---: |
| Pemodelan data relasional, join, filter, agregasi standar | **CDS View** |
| Menjadi sumber data untuk SAP Fiori UI / OData Service | **CDS View** |
| Algoritma rekursif matematika kompleks, loop kalkulasi baris | **AMDP** |
| Pembacaan data analitik murni berskala ratusan juta baris | **CDS View** |
| Memerlukan transformasi tabel bertahap (*Temporary Table*) | **AMDP** |

---

## 11. 🛠️ Mini Project: Membangun Model Analitik Penjualan S/4HANA

### Tujuan

Membangun solusi pelaporan analitik penjualan modern di SAP S/4HANA: mendefinisikan CDS View Interface item pesanan, mendefinisikan CDS View konsumsi analitik dengan asosiasi on-demand dan perhitungan kategori nilai transaksi, serta mengonsumsi CDS View tersebut dari dalam program laporan ABAP menggunakan Open SQL modern.

### Fitur

1. Definisi model data semantik CDS View `ZI_SalesOrderAnalytics`.
2. Pengelompokan status pesanan secara dinamis di level database menggunakan `CASE-WHEN`.
3. Penanganan asosiasi *join-on-demand*.
4. Program konsumsi ABAP yang menarik hasil kalkulasi langsung dari SAP HANA in-memory.

### Konsep yang Digunakan

* Definisi DDL CDS View berbasis Eclipse ADT.
* Penggunaan anotasi `@AbapCatalog` dan `@EndUserText`.
* Operasi query Open SQL modern terhadap CDS View.

### Langkah Implementasi

#### Langkah 1: Buat CDS View di Eclipse ADT (`ZI_SalesOrderAnalytics`)
* Buka Eclipse ADT $\rightarrow$ Klik kanan Package `Z_SALES` $\rightarrow$ **New** $\rightarrow$ **Other ABAP Repository Object** $\rightarrow$ **Core Data Services** $\rightarrow$ **Data Definition**.
* Name: `ZI_SalesOrderAnalytics`.
* Tulis kode DDL berikut:

```cds
@AbapCatalog.sqlViewName: 'ZSQL_V_SO_ANL'
@AbapCatalog.compiler.compareFilter: true
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Analitik Penjualan Modern S4HANA'

define view ZI_SalesOrderAnalytics
  as select from ztsales_order
{
  key order_id                               as OrderID,
      customer                               as CustomerName,
      gross_amount                           as GrossAmount,
      order_status                           as OrderStatus,
      
      case 
        when gross_amount >= 50000000 then 'Tier 1 - Enterprise'
        when gross_amount >= 15000000 then 'Tier 2 - Mid-Market'
        else                               'Tier 3 - Small Business'
      end                                    as CustomerTier
}
```

#### Langkah 2: Konsumsi CDS View dari Program ABAP

```abap
*&---------------------------------------------------------------------*
*& Report ZREP_CONSUME_CDS_DEMO
*&---------------------------------------------------------------------*
*& Mini Project: Mengonsumsi Model Data CDS View dari ABAP Open SQL
*&---------------------------------------------------------------------*
REPORT zrep_consume_cds_demo LINE-SIZE 85.

START-OF-SELECTION.

  WRITE: / sy-uline(80).
  WRITE: / '|', (76) 'KONSUMSI CDS VIEW S/4HANA VIA MODERN ABAP SQL' CENTERED, '|'.
  WRITE: / sy-uline(80).

  " Menarik data langsung dari CDS View (Bukan dari tabel fisik mentah!)
  SELECT OrderID,
         CustomerName,
         GrossAmount,
         OrderStatus,
         CustomerTier
    FROM ZI_SalesOrderAnalytics
    ORDER BY GrossAmount DESCENDING
    INTO TABLE @DATA(lt_analytics)
    UP TO 10 ROWS.

  WRITE: / '| No. Pesanan | Nama Pelanggan         | Total Bruto (Rp)    | Kategori Tier    |'.
  WRITE: / sy-uline(80).

  LOOP AT lt_analytics INTO DATA(ls_row).
    WRITE: / '|', (11) ls_row-OrderID,
             '|', (22) ls_row-CustomerName,
             '|', (19) ls_row-GrossAmount,
             '|', (18) ls_row-CustomerTier, '|'.
  ENDLOOP.

  WRITE: / sy-uline(80).
```

### Hasil Akhir

```text
---------------------------------------------------------------------------------
|                 KONSUMSI CDS VIEW S/4HANA VIA MODERN ABAP SQL                 |
---------------------------------------------------------------------------------
| No. Pesanan | Nama Pelanggan         | Total Bruto (Rp)    | Kategori Tier    |
---------------------------------------------------------------------------------
| SO-00103    | PT Harapan Bangsa      |       85.000.000,00 | Tier 1 - Enterprise|
| SO-00101    | PT Surya Kencana       |       45.000.000,00 | Tier 2 - Mid-Market|
| SO-00102    | CV Bintang Timur       |       12.000.000,00 | Tier 3 - Small Bus.|
---------------------------------------------------------------------------------
```

---

## 12. 📚 Ringkasan & Peta Ingatan

### Peta Konsep S/4HANA CDS & AMDP

```text
S/4HANA Modern Programming (Code-to-Data)
├── 1. Paradigma Code Pushdown
│   ├── Eliminasi pemrosesan berat di Application Server RAM
│   └── Mendorong komputasi langsung ke SAP HANA In-Memory Engine
├── 2. Core Data Services (CDS Views)
│   ├── Definisi DDL di Eclipse ADT (Bukan di SE11)
│   ├── Anotasi (@) untuk kontrol metadata UI, analitik, dan keamanan
│   └── Associations (Mekanisme relasi cerdas Join-on-demand)
├── 3. Virtual Data Model (VDM)
│   ├── Interface Views (ZI_... standarisasi entitas basis)
│   └── Consumption Views (ZC_... untuk konsumsi Fiori Elements)
└── 4. ABAP Managed Database Procedures (AMDP)
    ├── IF_AMDP_MARKER_HDB (Marker class procedural)
    └── Bahasa SQLScript (Eksekusi logika matematis kompleks di HANA)
```

---

## 13. 📚 Cheat Code CDS & AMDP 10 Detik

```text
define view ZI_Name as select from tab ...   → Definisi dasar CDS View
@AbapCatalog.sqlViewName: 'ZSQL_NAME'         → Anotasi nama SQL view fisik
association [0..1] to ZI_Target as _Target    → Asosiasi join-on-demand
$projection.Field                             → Mereferensikan kolom di view saat ini
INTERFACES if_amdp_marker_hdb.                → Mengaktifkan class sebagai AMDP
METHOD meth BY DATABASE PROCEDURE FOR HDB     → Definisi method SQLScript
USING tablename                               → Mendaftarkan dependensi tabel di AMDP
```

---

## 14. 🧭 Urutan Belajar Selanjutnya

Setelah menguasai pemodelan data semantik di level database SAP HANA menggunakan CDS Views, materi pamungkas dalam kurikulum ini adalah membangun aplikasi bisnis lengkap untuk frontend SAP Fiori menggunakan framework generasi terbaru:

```text
1. 🟢 ABAP Dasar (Fondasi sintaks & kontrol alur)
      │
      ▼
2. 🟢 ABAP Data Dictionary (Struktur tabel & metadata)
      │
      ▼
3. 🟢 ABAP Internal Tables (Manipulasi data array di RAM)
      │
      ▼
4. 🟡 ABAP Database & Open SQL (Akses data database)
      │
      ▼
5. 🟡 ABAP Modularization & Integration (Function modules & BAPI)
      │
      ▼
6. 🟡 ABAP Reports & ALV Grid (Visualisasi data pelaporan)
      │
      ▼
7. 🟡 ABAP Objects (OOP) (Paradigma berorientasi objek)
      │
      ▼
8. 🔴 ABAP Enhancement Framework (Kustomisasi Clean Core)
      │
      ▼
9. 🔴 ABAP Debugging & Performance Tuning (Diagnostik & optimasi)
      │
      ▼
10. 🔴 ABAP Core Data Services & AMDP (Selesai pada modul ini)
      │
      ▼
11. 🔴 ABAP RESTful Application Programming (RAP)
    → Puncak arsitektur modern S/4HANA: Behavior Definitions, OData Services (V2/V4), dan pembuatan aplikasi web SAP Fiori.
```

Lanjutkan ke modul penutup kurikulum: [[abap-rap-odata|ABAP RESTful Application Programming (RAP)]] (Modul 11).

---

## 15. 🔗 Referensi Resmi

* [SAP Help Portal — ABAP Core Data Services (CDS)](https://help.sap.com/docs/ABAP_PLATFORM/)
* [SAP Community — ABAP Managed Database Procedures (AMDP) Guide](https://community.sap.com/)
* [openSAP — Building Data Models with ABAP Core Data Services](https://open.sap.com/)
