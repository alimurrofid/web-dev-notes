---
title: "ABAP Unit & Automated Testing"
description: "Panduan lengkap pengujian otomatis di SAP ABAP: konsep ABAP Unit, unit vs integration testing, anatomi local test class (FOR TESTING), test fixture (SETUP & TEARDOWN), assertions (CL_ABAP_UNIT_ASSERT), eksekusi di Eclipse ADT & SAP GUI, serta perbandingan konteks Classic ABAP dan ABAP Cloud."
order: 12
tags:
  - sap
  - abap
  - testing
  - quality-assurance
  - enterprise
---

# ABAP Unit & Automated Testing

> Target: ABAP Developer (Lanjutan)  
> Prasyarat: [[abap-oop|Modul 7: ABAP Objects]]  
> Lingkungan: SAP NetWeaver, SAP S/4HANA, SAP BTP ABAP Environment

---

## Gambaran Umum

Dalam pengembangan perangkat lunak enterprise, pengujian manual (*manual testing*) melalui layar antarmuka memakan waktu lama, rawan kelalaian manusia (*human error*), dan sulit diulang secara konsisten saat terjadi perubahan kode (*regression*). 

**ABAP Unit** adalah framework pengujian otomatis bawaan (*built-in xUnit testing framework*) yang tertanam langsung di dalam arsitektur bahasa pemrograman ABAP. Dengan ABAP Unit, developer menulis kode pengujian yang dapat dieksekusi secara instan dalam hitungan detik untuk memverifikasi kebenaran unit terkecil dari logika bisnis (method class atau function module) tanpa perlu menyentuh antarmuka pengguna.

---

## Daftar Isi

### 🟢 Fundamental

1. [Mengapa Automated Testing Diperlukan di SAP Enterprise](#1--mengapa-automated-testing-diperlukan-di-sap-enterprise)
2. [Konsep Dasar ABAP Unit: Unit Test vs Integration Test](#2--konsep-dasar-abap-unit-unit-test-vs-integration-test)
3. [Anatomi Local Test Class](#3--anatomi-local-test-class)
4. [Konfigurasi Atribut: RISK LEVEL & DURATION](#4--konfigurasi-atribut-risk-level--duration)
5. [Test Fixture: Siklus Hidup SETUP & TEARDOWN](#5--test-fixture-siklus-hidup-setup--teardown)

### 🟡 Lanjutan

6. [Assertions dengan CL_ABAP_UNIT_ASSERT](#6--assertions-dengan-cl_abap_unit_assert)
7. [Test Isolation & Dependency Handling](#7--test-isolation--dependency-handling)
8. [Menjalankan Pengujian di Eclipse ADT & SAP GUI](#8--menjalankan-pengujian-di-eclipse-adt--sap-gui)
9. [Integrasi ABAP Unit dalam Quality Assurance & CI/CD](#9--integrasi-abap-unit-dalam-quality-assurance--cicd)
10. [Perbandingan Konteks: Classic ABAP vs ABAP Cloud](#10--perbandingan-konteks-classic-abap-vs-abap-cloud)

### 🛠️ Praktik & Rujukan

11. [Praktik: Menguji Kelas Kalkulasi Pajak & Diskon](#11-️-praktik-menguji-kelas-kalkulasi-pajak--diskon)
12. [Ringkasan & Cheat Code ABAP Unit](#12--ringkasan--cheat-code-abap-unit)
13. [Referensi Resmi](#13--referensi-resmi)

---

## 1. 🟢 Mengapa Automated Testing Diperlukan di SAP Enterprise

### Masalah Pengujian Manual
Pada alur kerja tradisional, seorang pengembang yang selesai menulis program akan meminta konsultan fungsional untuk menguji melalui GUI atau aplikasi Fiori. Pendekatan ini memiliki sejumlah kelemahan fatal:
* **Lambat**: Memerlukan persiapan data transaksi manual (Order, Delivery, Invoice).
* **Biaya Regresi Tinggi**: Setiap kali ada penambahan fitur baru, developer tidak dapat memastikan apakah logika lama rusak tanpa mengulang seluruh skenario pengujian manual dari awal.
* **Umpan Balik Terlambat**: Bug sering kali baru ditemukan di sistem Quality Assurance (`QAS`) atau bahkan sistem Production (`PRD`).

### Solusi: ABAP Unit
Dengan ABAP Unit, kode pengujian ditulis berdampingan dengan kode produksi. Developer dapat menekan tombol pintas sekali untuk menjalankan ratusan skenario validasi dalam hitungan milidetik sebelum kode disimpan atau dirilis ke sistem berikutnya.

```text
Alur Pengujian Tradisional (Manual):
Edit Kode ──> Buka SAP GUI / Fiori ──> Input Data Manual ──> Periksa Output (15-30 Menit)

Alur ABAP Unit (Automated):
Edit Kode ──> Tekan Ctrl+Shift+F10 ──> 50 Test Cases Selesai dalam 0.8 Detik (Hijau / Merah)
```

---

## 2. 🟢 Konsep Dasar ABAP Unit: Unit Test vs Integration Test

Penting untuk membedakan tingkatan pengujian dalam arsitektur SAP:

| Aspek | Unit Test (ABAP Unit) | Integration Test |
| :--- | :--- | :--- |
| **Ruang Lingkup** | Menguji satu method/fungsi terkecil secara terisolasi. | Menguji alur menyeluruh antar-modul (misal: SD $\rightarrow$ MM $\rightarrow$ FI). |
| **Ketergantungan Data** | Tidak bergantung pada data fisik database (menggunakan data mock/in-memory). | Membutuhkan data transaksi nyata di database. |
| **Kecepatan** | Sangat cepat (milidetik). | Lambat (beberapa detik hingga hitungan menit). |
| **Eksekusi** | Dijalankan oleh developer selama proses penulisan kode (*inner loop*). | Dijalankan di sistem testing (QAS) oleh QA atau konsultan fungsional. |

---

## 3. 🟢 Anatomi Local Test Class

Dalam [[abap-oop|ABAP Objects]], test class umumnya didefinisikan sebagai **Local Class** di dalam tab *Test Classes* pada Global Class (`SE24` atau Eclipse ADT).

### Struktur Dasar
Deklarasi test class ditandai dengan penambahan klausa `FOR TESTING`:

```abap
CLASS ltc_sales_calculator DEFINITION FINAL
  FOR TESTING
  DURATION SHORT
  RISK LEVEL HARMLESS.

  PRIVATE SECTION.
    DATA: mo_cut TYPE REF TO zcl_sales_calculator. " CUT = Class Under Test

    METHODS: setup.
    METHODS: teardown.
    METHODS: test_discount_vip FOR TESTING.
    METHODS: test_discount_regular FOR TESTING.
ENDCLASS.
```

Karakteristik penting:
* Kata kunci `FOR TESTING` pada level class memberi tahu kompiler bahwa kelas ini hanya dikompilasi pada environment testing dan tidak akan disertakan pada artefak produksi yang membebani memori sistem.
* Kata kunci `FOR TESTING` pada deklarasi method menandai method tersebut sebagai test case yang dapat dipanggil secara otomatis oleh test runner.

---

## 4. 🟢 Konfigurasi Atribut: RISK LEVEL & DURATION

Setiap test class wajib mendeklarasikan dua atribut untuk mengendalikan eksekusi pengujian:

### 1. RISK LEVEL (Tingkat Risiko)
Mengatur apakah pengujian aman dijalankan tanpa merusak data sistem:
* **`HARMLESS`**: Pengujian tidak mengubah data sistem, tidak menulis ke database, dan tidak memanggil sistem eksternal. Ini adalah standar utama untuk unit test murni.
* **`DANGEROUS`**: Pengujian melakukan modifikasi data sistem atau tabel kustom.
* **`CRITICAL`**: Pengujian dapat mengubah konfigurasi sistem (*Customizing*) atau data transaksi sensitif.

### 2. DURATION (Perkiraan Waktu Eksekusi)
Memberi petunjuk alokasi timeout bagi test runner:
* **`SHORT`**: Eksekusi instan (biasanya di bawah 1 detik). Standar untuk unit test murni.
* **`MEDIUM`**: Pengujian membutuhkan waktu beberapa detik (misal membaca tabel dalam jumlah sedang).
* **`LONG`**: Pengujian memakan waktu lebih lama (biasanya untuk pengujian integrasi kompleks).

---

## 5. 🟢 Test Fixture: Siklus Hidup SETUP & TEARDOWN

**Test Fixture** adalah serangkaian operasi untuk mempersiapkan kondisi lingkungan (*state*) sebelum pengujian dimulai dan membersihkannya kembali setelah selesai:

```text
Eksekusi Test Runner:
        │
        ▼
   [ SETUP ]          --> Menyiapkan instance objek baru & data in-memory
        │
        ▼
[ Test Method 1 ]     --> Mengeksekusi pengujian pertama & assertions
        │
        ▼
  [ TEARDOWN ]        --> Membersihkan resource memori / reset state
        │
        ▼
   [ SETUP ]          --> Reset kondisi awal kembali
        │
        ▼
[ Test Method 2 ]     --> Mengeksekusi pengujian kedua
        │
        ▼
  [ TEARDOWN ]        --> Bersih
```

* **`SETUP`**: Dijalankan secara otomatis **sebelum setiap test method** dieksekusi. Digunakan untuk membuat instance baru dari *Class Under Test* (CUT).
* **`TEARDOWN`**: Dijalankan secara otomatis **setelah setiap test method** selesai dieksekusi. Digunakan untuk mereset memori atau rollback perubahan.

---

## 6. 🟡 Assertions dengan CL_ABAP_UNIT_ASSERT

Untuk memvalidasi apakah hasil komputasi sesuai dengan ekspektasi, ABAP menyediakan class utilitas statis **`CL_ABAP_UNIT_ASSERT`**.

### Daftar Assertion yang Sering Digunakan

| Method Assertion | Kegunaan |
| :--- | :--- |
| `assert_equals( act = ... exp = ... )` | Memastikan nilai aktual (`act`) sama persis dengan nilai yang diharapkan (`exp`). |
| `assert_differs( act = ... exp = ... )`| Memastikan nilai aktual berbeda dari nilai acuan. |
| `assert_true( act = ... )` | Memastikan ekspresi bernilai benar (`abap_true`). |
| `assert_false( act = ... )` | Memastikan ekspresi bernilai salah (`abap_false`). |
| `assert_initial( act = ... )` | Memastikan variabel atau tabel dalam keadaan kosong (*initial value*). |
| `assert_not_initial( act = ... )` | Memastikan variabel atau tabel telah terisi data. |
| `fail( msg = ... )` | Menggagalkan pengujian secara sengaja (misal saat exception wajib tidak terpancing). |

### Contoh Penggunaan Assertion
```abap
cl_abap_unit_assert=>assert_equals(
  act = lv_actual_discount
  exp = 15
  msg = 'Diskon pelanggan VIP harus tepat 15%!'
).
```

---

## 7. 🟡 Test Isolation & Dependency Handling

Tantangan terbesar dalam pengujian ABAP enterprise adalah ketergantungan kode terhadap database atau sistem eksternal (misal instruksi `SELECT FROM vbak` di dalam method bisnis).

### Prinsip Test Isolation
Sebuah unit test yang baik **tidak boleh bergantung pada isi data fisik tabel database**, karena:
1. Jika data fisik dihapus oleh user lain di sistem pengembangan, unit test akan gagal (*flaky test*).
2. Membaca database memperlambat durasi eksekusi pengujian.

### Teknik Penanganan Ketergantungan
1. **Interface Injection**: Pisahkan logika akses data ke dalam Interface terpisah (misal `ZIF_SALES_DAO`), lalu oper implementasi mock (*Test Double*) saat pengujian.
2. **ABAP Test Double Framework**: Pada sistem modern (NetWeaver 7.40 SP09+ dan S/4HANA), SAP menyediakan framework pembuatan mock otomatis menggunakan class `CL_ABAP_TESTDOUBLE`.

---

## 8. 🟡 Menjalankan Pengujian di Eclipse ADT & SAP GUI

### Melalui Eclipse ADT (Rekomendasi Modern)
1. Buka Class atau Program yang ingin diuji.
2. Tekan tombol pintas **Ctrl + Shift + F10** (atau klik kanan pada editor $\rightarrow$ **Run As** $\rightarrow$ **ABAP Unit Test**).
3. Panel **ABAP Unit** akan muncul di bagian bawah:
   * **Bilah Hijau (Green Bar)**: Seluruh test cases sukses 100%.
   * **Bilah Merah (Red Bar)**: Terdapat assertion yang gagal atau terjadi unhandled exception, lengkap dengan lokasi baris kode dan pesan kegagalannya.

### Melalui SAP GUI Klasik (`SE24` / `SE80`)
1. Buka Class di `SE24`.
2. Klik menu: **Class** $\rightarrow$ **Test** $\rightarrow$ **Execute** $\rightarrow$ **Unit Tests** (atau tekan **Ctrl + F10**).
3. Hasil evaluasi akan ditampilkan dalam laporan pohon hierarki.

---

## 9. 🟡 Integrasi ABAP Unit dalam Quality Assurance & CI/CD

Dalam tata kelola pengembangan modern:
* **ABAP Test Cockpit (ATC)**: Pengecekan kualitas otomatis dapat dikonfigurasi untuk mengevaluasi apakah sebuah kelas memiliki unit test dan apakah seluruh unit test tersebut lulus tanpa kegagalan sebelum kode diizinkan masuk ke Transport Request.
* **abapGit & Pipeline CI/CD**: Pada repositori yang terhubung dengan Git, eksekusi unit test dijalankan secara otomatis pada server build setiap kali developer melakukan *commit* atau *pull request*.

---

## 10. 🟡 Perbandingan Konteks: Classic ABAP vs ABAP Cloud

| Fitur / Karakteristik | Classic ABAP (NetWeaver On-Premise) | SAP S/4HANA (On-Premise / Private) | SAP ABAP Cloud (BTP / Public Edition) |
| :--- | :--- | :--- | :--- |
| **Status API Assert** | `CL_ABAP_UNIT_ASSERT` | `CL_ABAP_UNIT_ASSERT` | `CL_ABAP_UNIT_ASSERT` (Released C1) |
| **Tool Runner Utama** | SAP GUI (`SE24` / `SE80`) & ADT | Eclipse ADT & SAP GUI | **Wajib Eclipse ADT** (Tidak ada SAP GUI) |
| **Kewajiban Pengujian** | Sering kali bersifat opsional / rekomendasi kebijakan perusahaan. | Standar best practice utama enterprise. | **Pilar Utama Clean Core** (Sangat ditekankan pada pipeline rilis). |
| **Test Double Engine**| Manual Mock / `CL_ABAP_TESTDOUBLE` (7.40+) | `CL_ABAP_TESTDOUBLE` & CDS Test Doubles | `CL_ABAP_TESTDOUBLE` (Released API) |

---

## 11. 🛠️ Praktik: Menguji Kelas Kalkulasi Pajak & Diskon

### Skenario Bisnis
Kita memiliki sebuah kelas kalkulasi penjualan `ZCL_SALES_ENGINE` yang memiliki fungsi menghitung nilai diskon bertingkat:
* Pelanggan Reguler: Diskon 0%.
* Pelanggan Member: Diskon 5%.
* Pelanggan VIP: Diskon 10% (jika belanja $\ge$ Rp 1.000.000, diskon menjadi 15%).

Kita akan menulis kode unit test untuk memverifikasi logika ini secara otomatis.

### Langkah 1: Kode Kelas Produksi (`ZCL_SALES_ENGINE`)

```abap
CLASS zcl_sales_engine DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    TYPES: ty_amount TYPE p LENGTH 9 DECIMALS 2.

    METHODS calculate_discount
      IMPORTING iv_customer_tier TYPE string
                iv_total_amount  TYPE ty_amount
      RETURNING VALUE(rv_discount_pct) TYPE i.
ENDCLASS.

CLASS zcl_sales_engine IMPLEMENTATION.
  METHOD calculate_discount.
    CASE iv_customer_tier.
      WHEN 'REGULAR'.
        rv_discount_pct = 0.
      WHEN 'MEMBER'.
        rv_discount_pct = 5.
      WHEN 'VIP'.
        IF iv_total_amount >= '1000000'.
          rv_discount_pct = 15.
        ELSE.
          rv_discount_pct = 10.
        ENDIF.
      WHEN OTHERS.
        rv_discount_pct = 0.
    ENDCASE.
  ENDMETHOD.
ENDCLASS.
```

### Langkah 2: Kode Local Test Class (`LTC_SALES_ENGINE`)

Tuliskan kode berikut pada tab *Test Classes* di Eclipse ADT atau `SE24`:

```abap
*"* use this source file for your ABAP unit test classes
CLASS ltc_sales_engine DEFINITION FINAL
  FOR TESTING
  DURATION SHORT
  RISK LEVEL HARMLESS.

  PRIVATE SECTION.
    DATA mo_cut TYPE REF TO zcl_sales_engine. " Class Under Test

    METHODS setup.
    METHODS teardown.

    " Daftar Skenario Pengujian:
    METHODS test_regular_customer FOR TESTING.
    METHODS test_vip_standard FOR TESTING.
    METHODS test_vip_wholesale_bonus FOR TESTING.
ENDCLASS.

CLASS ltc_sales_engine IMPLEMENTATION.

  METHOD setup.
    " Dijalankan sebelum setiap test case: siapkan instance baru
    mo_cut = NEW zcl_sales_engine( ).
  ENDMETHOD.

  METHOD teardown.
    " Dijalankan setelah setiap test case: bersihkan instance
    CLEAR mo_cut.
  ENDMETHOD.

  METHOD test_regular_customer.
    DATA(lv_discount) = mo_cut->calculate_discount(
      iv_customer_tier = 'REGULAR'
      iv_total_amount  = '500000'
    ).

    cl_abap_unit_assert=>assert_equals(
      act = lv_discount
      exp = 0
      msg = 'Pelanggan Reguler seharusnya mendapat diskon 0%'
    ).
  ENDMETHOD.

  METHOD test_vip_standard.
    DATA(lv_discount) = mo_cut->calculate_discount(
      iv_customer_tier = 'VIP'
      iv_total_amount  = '500000'
    ).

    cl_abap_unit_assert=>assert_equals(
      act = lv_discount
      exp = 10
      msg = 'Pelanggan VIP di bawah batas belanja seharusnya mendapat diskon standar 10%'
    ).
  ENDMETHOD.

  METHOD test_vip_wholesale_bonus.
    DATA(lv_discount) = mo_cut->calculate_discount(
      iv_customer_tier = 'VIP'
      iv_total_amount  = '1500000'
    ).

    cl_abap_unit_assert=>assert_equals(
      act = lv_discount
      exp = 15
      msg = 'Pelanggan VIP dengan belanja >= 1 juta harus mendapat bonus diskon 15%'
    ).
  ENDMETHOD.

ENDCLASS.
```

### Hasil Pengujian di Eclipse ADT
Saat Anda menekan **Ctrl + Shift + F10**, panel test runner menampilkan:

```text
ABAP Unit: 3/3 Tests Passed (0.012 s)
[√] ltc_sales_engine
    ├── [√] test_regular_customer (0.003 s)
    ├── [√] test_vip_standard (0.004 s)
    └── [√] test_vip_wholesale_bonus (0.005 s)

Status: GREEN BAR (No Failures, No Errors)
```

---

## 12. 📚 Ringkasan & Cheat Code ABAP Unit

### Peta Konsep
```text
ABAP Unit Testing
├── 1. Deklarasi Class
│   └── CLASS ... DEFINITION FOR TESTING DURATION SHORT RISK LEVEL HARMLESS
├── 2. Siklus Hidup Fixture
│   ├── SETUP (Inisialisasi objek sebelum tiap test)
│   └── TEARDOWN (Pembersihan state sesudah tiap test)
├── 3. Assertions (CL_ABAP_UNIT_ASSERT)
│   ├── assert_equals (Membandingkan nilai actual vs expected)
│   ├── assert_true / assert_false (Evaluasi boolean flag)
│   └── assert_initial / assert_not_initial (Evaluasi keberadaan data)
└── 4. Eksekusi
    ├── Eclipse ADT: Ctrl + Shift + F10
    └── SAP GUI: Ctrl + F10
```

### Cheat Code ABAP Unit

```abap
" Deklarasi test class
CLASS ltc_demo DEFINITION FOR TESTING DURATION SHORT RISK LEVEL HARMLESS.
  PRIVATE SECTION.
    METHODS: setup, teardown.
    METHODS: test_method FOR TESTING.
ENDCLASS.

" Validasi kesamaan nilai
cl_abap_unit_assert=>assert_equals( act = lv_actual exp = lv_expected ).

" Validasi kondisi benar
cl_abap_unit_assert=>assert_true( act = lv_flag ).

" Validasi tabel tidak kosong
cl_abap_unit_assert=>assert_not_initial( act = lt_data ).
```

---

## 13. 🔗 Referensi Resmi

* [SAP Help Portal: ABAP Unit - Test Class Architecture](https://help.sap.com/docs/ABAP_PLATFORM_NEW/c238d694b825421f940829322fed326f/491e847c21351d8de10000000a42189c.html)
* [SAP Help Portal: Class CL_ABAP_UNIT_ASSERT](https://help.sap.com/docs/ABAP_PLATFORM_NEW/c238d694b825421f940829322fed326f/491e860921351d8de10000000a42189c.html)
* [Clean ABAP Styleguide: Automated Testing & ABAP Unit](https://github.com/SAP/styleguides/blob/main/clean-abap/CleanABAP.md#automated-tests)
