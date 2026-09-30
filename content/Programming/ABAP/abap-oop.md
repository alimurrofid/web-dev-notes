---
title: "ABAP Objects (OOP)"
description: "Panduan lengkap Object-Oriented Programming (OOP) di SAP ABAP: Class Definition & Implementation, Visibility Section, Constructor, Inheritance, Interface, Polymorphism, dan Class-based Exception Handling (TRY-CATCH)."
order: 7
tags:
  - programming
  - abap
  - sap
  - oop
  - object-oriented
  - intermediate
---

# ABAP Objects (OOP)

> **Target:** Developer ABAP yang ingin beralih dari paradigma prosedural klasik ke pemrograman berorientasi objek (Object-Oriented Programming) modern di sistem SAP.
> **Versi:** SAP NetWeaver AS ABAP 7.40+ / 7.50+ & SAP S/4HANA (Class Builder `SE24` & Eclipse ADT).
> **Prasyarat:** Telah memahami [[abap-dasar|ABAP Dasar]], [[abap-internal-tables|ABAP Internal Tables]], dan [[abap-database|ABAP Database & Open SQL]].

---

## Gambaran Umum

Pada masa awal perkembangannya, ABAP adalah bahasa prosedural yang mengandalkan Subroutines (`FORM`) dan Function Modules. Namun sejak diluncurkannya **ABAP Objects**, SAP mentransformasi ABAP menjadi bahasa pemrograman berorientasi objek murni yang lengkap dan tangguh.

Di era SAP S/4HANA saat ini, penguasaan ABAP Objects bukan lagi pilihan opsional, melainkan **keharusan mutlak**. Seluruh framework modern SAP — mulai dari Object-Oriented ALV (`CL_SALV_TABLE`), Business Add-Ins (BAdI), BOPF, ABAP RESTful Application Programming (RAP), hingga ABAP Cloud — dibangun secara eksklusif di atas fondasi Class dan Interface.

---

## Cara Belajar

```text
🟢 Fundamental
→ Pahami definisi Class (Definition & Implementation), bagian visibilitas (Public, Protected, Private), dan Constructor.

🟡 Lanjutan
→ Kuasai 4 Pilar OOP (Enkapsulasi, Pewarisan, Polimorfisme via Interface) dan penanganan error modern TRY-CATCH.

🛠️ Praktik
→ Bangun mini project sistem rekening perbankan enterprise dengan polimorfisme transaksi dan proteksi saldo via exception class.
```

Mental model komponen anatomi sebuah Class di ABAP:

```text
       ┌────────────────────────────────────────────────────────┐
       │ CLASS lcl_rekening DEFINITION                          │
       │                                                        │
       │  PUBLIC SECTION.                                       │
       │  → Dapat diakses oleh siapa saja dari luar class       │
       │    METHODS: constructor, setor_dana, tarik_dana.       │
       │                                                        │
       │  PROTECTED SECTION.                                    │
       │  → Hanya dapat diakses oleh class ini & class anaknya  │
       │    METHODS: validasi_limit.                            │
       │                                                        │
       │  PRIVATE SECTION.                                      │
       │  → Hanya dapat diakses oleh internal class ini saja    │
       │    DATA: mv_saldo TYPE p DECIMALS 2.                   │
       └──────────────────────────┬─────────────────────────────┘
                                  │ Diimplementasikan kodenya pada
                                  ▼
       ┌────────────────────────────────────────────────────────┐
       │ CLASS lcl_rekening IMPLEMENTATION                      │
       │   METHOD setor_dana.                                   │
       │     mv_saldo = mv_saldo + iv_jumlah.                   │
       │   ENDMETHOD.                                           │
       └────────────────────────────────────────────────────────┘
```

**Hafalan:**

```text
Class          → Cetak biru (blueprint) yang memuat data (attributes) dan logika (methods)
Object / Inst. → Wujud konkret dari class yang aktif dialokasikan di memori RAM
PUBLIC         → Komponen yang bebas dipanggil dari luar class
PRIVATE        → Komponen rahasia yang terisolasi hanya di dalam class bersangkutan
NEW lcl_...( ) → Operator modern ABAP 7.40+ untuk menginstansiasi objek baru di memori
-> (Arrow)     → Operator untuk memanggil method atau attribute milik instance objek
=> (Fat Arrow) → Operator untuk memanggil static method atau constant milik class
TRY ... CATCH  → Blok terstruktur untuk menangkap runtime error berbasis Exception Class
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pergeseran Paradigma: Prosedural vs Object-Oriented](#1--pergeseran-paradigma-prosedural-vs-object-oriented)
2. [Local Class vs Global Class (SE24 & ADT)](#2--local-class-vs-global-class-se24--adt)
3. [Anatomi Class: Definition & Implementation](#3--anatomi-class-definition--implementation)
4. [Tingkat Visibilitas (Public, Protected, Private)](#4--tingkat-visibilitas-public-protected-private)
5. [Attributes: Instance (DATA) vs Static (CLASS-DATA)](#5--attributes-instance-data-vs-static-class-data)
6. [Methods: Instance (METHODS) vs Static (CLASS-METHODS)](#6--methods-instance-methods-vs-static-class-methods)
7. [Konstruktor: Instance Constructor & Class Constructor](#7--konstruktor-instance-constructor--class-constructor)
8. [Instansiasi Objek: Klasik vs Modern Operator NEW](#8--instansiasi-objek-klasik-vs-modern-operator-new)

### 🟡 Lanjutan

9. [Pilar 1: Enkapsulasi & Proteksi State Objek](#9--pilar-1-enkapsulasi--proteksi-state-objek)
10. [Pilar 2: Pewarisan (Inheritance & Redefinition)](#10--pilar-2-pewarisan-inheritance--redefinition)
11. [Pilar 3: Abstraction (Abstract Class vs Final Class)](#11--pilar-3-abstraction-abstract-class-vs-final-class)
12. [Pilar 4: Interface & Polimorfisme](#12--pilar-4-interface--polimorfisme)
13. [Class-Based Exception Handling (TRY ... CATCH cx_root)](#13--class-based-exception-handling-try--catch-cx_root)

### 🛠️ Praktik

14. [Mini Project: Sistem Manajemen Rekening Bank Enterprise](#14-️-mini-project-sistem-manajemen-rekening-bank-enterprise)

### 📚 Ringkasan & Referensi

15. [Peta Ingatan & Ringkasan](#15--peta-ingatan--ringkasan)
16. [Cheat Code ABAP Objects 10 Detik](#16--cheat-code-abap-objects-10-detik)
17. [Urutan Belajar Selanjutnya](#17--urutan-belajar-selanjutnya)
18. [Referensi Resmi](#18--referensi-resmi)

---

## 1. 🟢 Pergeseran Paradigma: Prosedural vs Object-Oriented

### Konsep

Dalam pemrograman prosedural, data (*Internal Tables*) dan fungsi (*Function Modules*) terpisah secara independen. Data dapat diakses dan diubah oleh fungsi apa pun secara bebas, yang kerap memicu efek samping (*side effects*) tak terduga pada sistem besar.

Sebaliknya, **ABAP Objects** menyatukan data (*state*) dan fungsi (*behavior*) ke dalam satu kesatuan tertutup yang disebut **Class**. Data dilindungi di dalam objek dan hanya boleh dimodifikasi melalui method resmi yang memiliki validasi ketat.

---

## 2. 🟢 Local Class vs Global Class (SE24 & ADT)

### Konsep

| Jenis Class | Tempat Didefinisikan | Ruang Lingkup Akses (*Scope*) |
| :--- | :--- | :--- |
| **Local Class** | Ditulis langsung di dalam satu file program report yang sama. | Hanya dapat digunakan oleh program report tersebut. Sangat ideal untuk enkapsulasi logika lokal program. |
| **Global Class** | Dibuat di repositori pusat via T-Code **`SE24`** (*Class Builder*) atau Eclipse ADT (berawalan `ZCL_...`). | Dapat dipanggil oleh seluruh program, class, dan workflow di seluruh sistem SAP. |

---

## 3. 🟢 Anatomi Class: Definition & Implementation

### Konsep

Di ABAP, pembuatan class selalu terbagi menjadi dua blok terpisah:
1. **`CLASS ... DEFINITION`**: Berisi deklarasi "apa saja yang dimiliki class" (daftar nama variabel, method, parameter, dan tingkat aksesibilitasnya).
2. **`CLASS ... IMPLEMENTATION`**: Berisi baris kode logika konkret dari setiap method yang dideklarasikan.

```abap
REPORT z_oop_anatomi.

" 1. DEFINITION
CLASS lcl_printer DEFINITION.
  PUBLIC SECTION.
    METHODS print_teks IMPORTING iv_teks TYPE string.
ENDCLASS.

" 2. IMPLEMENTATION
CLASS lcl_printer IMPLEMENTATION.
  METHOD print_teks.
    WRITE: / 'Mencetak:', iv_teks.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  DATA(lo_printer) = NEW lcl_printer( ).
  lo_printer->print_teks( 'Dokumen Faktur Resmi' ).
```

---

## 4. 🟢 Tingkat Visibilitas (Public, Protected, Private)

### Konsep

ABAP menyediakan 3 tingkat hak akses komponen:

1. **`PUBLIC SECTION`**: Dapat diakses secara bebas oleh siapa saja (program luar, class konsumen, atau modul lain).
2. **`PROTECTED SECTION`**: Hanya dapat diakses oleh method di dalam class ini sendiri serta oleh class turunan (*subclass/anak*).
3. **`PRIVATE SECTION`**: Tertutup rapat. Hanya dapat diakses oleh method di dalam class ini sendiri. Class anak sekalipun tidak dapat mengakses komponen private!

---

## 5. 🟢 Attributes: Instance (DATA) vs Static (CLASS-DATA)

### Konsep

* **Instance Attribute (`DATA`)**: Setiap objek memiliki salinan datanya masing-masing di RAM. Nilai objek A tidak memengaruhi nilai objek B.
* **Static Attribute (`CLASS-DATA`)**: Hanya ada satu salinan data untuk seluruh siklus hidup program yang dibagi bersama oleh semua objek turunan class tersebut.

```abap
CLASS lcl_counter DEFINITION.
  PUBLIC SECTION.
    CLASS-DATA gv_total_objek TYPE i. " Static: berbagi memori
    DATA       mv_id          TYPE i. " Instance: unik per objek
    METHODS constructor.
ENDCLASS.

CLASS lcl_counter IMPLEMENTATION.
  METHOD constructor.
    gv_total_objek = gv_total_objek + 1.
    mv_id = gv_total_objek.
  ENDMETHOD.
ENDCLASS.
```

---

## 6. 🟢 Methods: Instance (METHODS) vs Static (CLASS-METHODS)

### Konsep

* **Instance Method (`METHODS`)**: Dipanggil menggunakan operator tanda panah `->` dari variabel objek yang sudah diinstansiasi (`lo_obj->hitung()`). Dapat membaca instance attribute dan static attribute.
* **Static Method (`CLASS-METHODS`)**: Dipanggil langsung dari nama class menggunakan operator panah gemuk `=>` tanpa perlu membuat objek di memori (`lcl_helper=>hitung()`). Hanya dapat membaca static attribute!

---

## 7. 🟢 Konstruktor: Instance Constructor & Class Constructor

### Konsep

* **Instance Constructor (`METHODS constructor`)**: Method spesial yang secara otomatis dieksekusi oleh runtime setiap kali sebuah objek baru diciptakan (`NEW`). Digunakan untuk menginisialisasi nilai awal wajib.
* **Class Constructor (`CLASS-METHODS class_constructor`)**: Method statis tanpa parameter yang otomatis dieksekusi tepat **satu kali** ketika class tersebut pertama kali disentuh oleh memori program sepanjang sesi pengguna.

---

## 8. 🟢 Instansiasi Objek: Klasik vs Modern Operator NEW

### Konsep

Cara membuat objek baru di memori:

```abap
" Cara Klasik:
DATA lo_mobil_klasik TYPE REF TO lcl_mobil.
CREATE OBJECT lo_mobil_klasik
  EXPORTING
    iv_merk = 'Toyota'.

" Cara Modern ABAP 7.40+ (Ringkas & Type Inference):
DATA(lo_mobil_modern) = NEW lcl_mobil( iv_merk = 'Toyota' ).
```

---

## 9. 🟡 Pilar 1: Enkapsulasi & Proteksi State Objek

### Konsep

**Enkapsulasi** adalah teknik menyembunyikan data internal (`PRIVATE SECTION`) dan hanya membukanya melalui method pengontrol (*Getter* dan *Setter*).

Dengan enkapsulasi, pihak luar dilarang mengubah data secara acak tanpa melalui aturan validasi:

```abap
CLASS lcl_karyawan DEFINITION.
  PUBLIC SECTION.
    METHODS: set_gaji IMPORTING iv_gaji TYPE p,
             get_gaji RETURNING VALUE(rv_gaji) TYPE p.
  PRIVATE SECTION.
    DATA mv_gaji TYPE p DECIMALS 2.
ENDCLASS.

CLASS lcl_karyawan IMPLEMENTATION.
  METHOD set_gaji.
    " Validasi bisnis: gaji dilarang bernilai minus
    IF iv_gaji > 0.
      mv_gaji = iv_gaji.
    ENDIF.
  ENDMETHOD.

  METHOD get_gaji.
    rv_gaji = mv_gaji.
  ENDMETHOD.
ENDCLASS.
```

---

## 10. 🟡 Pilar 2: Pewarisan (Inheritance & Redefinition)

### Konsep

Class anak (*Subclass*) dapat mewarisi seluruh attribute dan method milik class induk (*Superclass*) menggunakan klausa **`INHERITING FROM`**.

Jika class anak ingin mengubah perilaku method bawaan induknya, gunakan kata kunci **`REDEFINITION`**:

```abap
CLASS lcl_hewan DEFINITION.
  PUBLIC SECTION.
    METHODS bersuara.
ENDCLASS.

CLASS lcl_hewan IMPLEMENTATION.
  METHOD bersuara.
    WRITE: / 'Suara hewan standar...'.
  ENDMETHOD.
ENDCLASS.

CLASS lcl_kucing DEFINITION INHERITING FROM lcl_hewan.
  PUBLIC SECTION.
    METHODS bersuara REDEFINITION.
ENDCLASS.

CLASS lcl_kucing IMPLEMENTATION.
  METHOD bersuara.
    WRITE: / 'Meong meong!'.
  ENDMETHOD.
ENDCLASS.
```

---

## 11. 🟡 Pilar 3: Abstraction (Abstract Class vs Final Class)

### Konsep

* **`ABSTRACT` Class**: Class cetak biru konseptual yang **tidak boleh diinstansiasi secara langsung** (`NEW lcl_abstract()` akan menghasilkan syntax error). Tujuannya murni sebagai fondasi kontrak untuk diturunkan ke class-class anak konkret.
* **`FINAL` Class**: Class yang **dilarang untuk diwariskan** lebih lanjut. Melindungi class dari modifikasi tak terkontrol.

---

## 12. 🟡 Pilar 4: Interface & Polimorfisme

### Konsep

**Interface** adalah kontrak perilaku murni tanpa implementasi. Interface hanya mendefinisikan nama method dan parameter yang wajib dipenuhi oleh class mana pun yang mengimplementasikannya.

### Kekuatan Polimorfisme

Dengan interface, sebuah program pemroses pembayaran dapat memproses berbagai metode pembayaran yang berbeda (Kartu Kredit, Virtual Account, QRIS) menggunakan satu variabel antarmuka yang seragam:

```abap
" 1. Kontrak Interface
INTERFACE lif_pembayaran.
  METHODS bayar IMPORTING iv_nominal TYPE p.
ENDINTERFACE.

" 2. Class Kartu Kredit
CLASS lcl_kartu_kredit DEFINITION.
  PUBLIC SECTION.
    INTERFACES lif_pembayaran.
ENDCLASS.

CLASS lcl_kartu_kredit IMPLEMENTATION.
  METHOD lif_pembayaran~bayar.
    WRITE: / 'Memproses kartu kredit sebesar Rp', iv_nominal.
  ENDMETHOD.
ENDCLASS.

" 3. Class QRIS
CLASS lcl_qris DEFINITION.
  PUBLIC SECTION.
    INTERFACES lif_pembayaran.
ENDCLASS.

CLASS lcl_qris IMPLEMENTATION.
  METHOD lif_pembayaran~bayar.
    WRITE: / 'Memindai QRIS sebesar Rp', iv_nominal.
  ENDMETHOD.
ENDCLASS.
```

Pemanggil dapat menyimpan objek apa pun ke variabel bertipe interface:

```abap
DATA lo_bayar TYPE REF TO lif_pembayaran.

lo_bayar = NEW lcl_qris( ).
lo_bayar->bayar( 50000 ). " Menjalankan logika QRIS secara polimorfis!
```

---

## 13. 🟡 Class-Based Exception Handling (TRY ... CATCH cx_root)

### Konsep

Di ABAP modern, penanganan error fatal tidak lagi menggunakan kode angka `sy-subrc`, melainkan menggunakan **Class-Based Exceptions**.

Jika terjadi error, sebuah objek exception instan dilemparkan (*RAISE EXCEPTION*) dan ditangkap di blok `TRY ... CATCH`:

```abap
TRY.
    DATA(lv_hasil) = 10 / lv_pembagi.
  CATCH cx_sy_zerodivide INTO DATA(lx_error).
    WRITE: / 'Terjadi error pembagian dengan nol! Pesan:', lx_error->get_text( ).
  CLEANUP.
    " Blok opsional yang selalu dieksekusi untuk merapikan resource memori
ENDTRY.
```

---

## 14. 🛠️ Mini Project: Sistem Manajemen Rekening Bank Enterprise

### Tujuan

Membangun fondasi logika aplikasi perbankan enterprise (`ZREP_BANK_OOP_DEMO`). Program ini mengimplementasikan konsep OOP modern secara utuh: sebuah Interface transaksi perbankan, Superclass rekening abstrak, Subclass rekening tabungan dan rekening giro, enkapsulasi mutlak saldo, dan penarikan dana aman dengan validasi saldo berbasis Exception Class kustom.

### Fitur

1. Kontrak antarmuka `lif_rekening` untuk standar operasional perbankan.
2. Abstract superclass `lcl_rekening_bank` yang melindungi data saldo di `PRIVATE SECTION`.
3. Subclass `lcl_tabungan` dengan fitur perhitungan bunga bulanan.
4. Subclass `lcl_giro` dengan proteksi fasilitas batas cerukan (*Overdraft limit*).
5. Exception handling terstruktur saat saldo tidak mencukupi penarikan.

### Konsep yang Digunakan

* Deklarasi `INTERFACE` dan implementasi polimorfisme.
* Kelas abstrak `CLASS ... ABSTRACT` dan pewarisan `INHERITING FROM`.
* Konstruktor berparameter `METHODS constructor`.
* Redefinisi method `METHODS ... REDEFINITION`.
* Penanganan error berbasis `CX_STATIC_CHECK` via `TRY ... CATCH`.

### Langkah Implementasi

1. **Definisikan Exception Class**: Buat class error saldo `cx_saldo_kurang`.
2. **Definisikan Interface**: Tetapkan method `setor` dan `tarik`.
3. **Bangun Abstract Superclass**: Kelola attribute saldo dan pemilik rekening.
4. **Bangun Subclass Tabungan & Giro**: Tambahkan logika spesifik masing-masing akun.
5. **Eksekusi Transaksi Polimorfis**: Jalankan simulasi setor dan tarik dana dengan proteksi exception.

### Kode Lengkap Program

```abap
*&---------------------------------------------------------------------*
*& Report ZREP_BANK_OOP_DEMO
*&---------------------------------------------------------------------*
*& Mini Project: Sistem Manajemen Rekening Bank Berbasis ABAP Objects
*&---------------------------------------------------------------------*
REPORT zrep_bank_oop_demo LINE-SIZE 85.

*----------------------------------------------------------------------*
* 1. Definisi Custom Exception Class
*----------------------------------------------------------------------*
CLASS cx_saldo_kurang DEFINITION INHERITING FROM cx_static_check.
ENDCLASS.

*----------------------------------------------------------------------*
* 2. Definisi Interface Kontrak Rekening
*----------------------------------------------------------------------*
INTERFACE lif_rekening.
  METHODS:
    setor IMPORTING iv_jumlah TYPE p,
    tarik IMPORTING iv_jumlah TYPE p RAISING cx_saldo_kurang,
    cetak_ringkasan.
ENDINTERFACE.

*----------------------------------------------------------------------*
* 3. Definisi Abstract Superclass Rekening Bank
*----------------------------------------------------------------------*
CLASS lcl_rekening_bank DEFINITION ABSTRACT.
  PUBLIC SECTION.
    INTERFACES lif_rekening.
    METHODS constructor IMPORTING iv_nomor   TYPE string
                                  iv_nasabah TYPE string
                                  iv_saldo   TYPE p.
  PROTECTED SECTION.
    DATA: mv_nomor   TYPE string,
          mv_nasabah TYPE string,
          mv_saldo   TYPE p DECIMALS 2.
ENDCLASS.

CLASS lcl_rekening_bank IMPLEMENTATION.
  METHOD constructor.
    mv_nomor   = iv_nomor.
    mv_nasabah = iv_nasabah.
    mv_saldo   = iv_saldo.
  ENDMETHOD.

  METHOD lif_rekening~setor.
    mv_saldo = mv_saldo + iv_jumlah.
    WRITE: / |Setor tunai Rp { iv_jumlah NUMBER = USER } ke { mv_nomor } berhasil.|.
  ENDMETHOD.

  METHOD lif_rekening~tarik.
    IF iv_jumlah > mv_saldo.
      RAISE EXCEPTION TYPE cx_saldo_kurang.
    ENDIF.
    mv_saldo = mv_saldo - iv_jumlah.
    WRITE: / |Tarik tunai Rp { iv_jumlah NUMBER = USER } dari { mv_nomor } berhasil.|.
  ENDMETHOD.

  METHOD lif_rekening~cetak_ringkasan.
    WRITE: / |No. Rekening : { mv_nomor }|,
           / |Nama Nasabah : { mv_nasabah }|,
           / |Sisa Saldo   : Rp { mv_saldo NUMBER = USER }|.
  ENDMETHOD.
ENDCLASS.

*----------------------------------------------------------------------*
* 4. Subclass 1: Rekening Tabungan (Bunga Tambahan)
*----------------------------------------------------------------------*
CLASS lcl_tabungan DEFINITION INHERITING FROM lcl_rekening_bank.
  PUBLIC SECTION.
    METHODS: hitung_bunga IMPORTING iv_persen TYPE p,
             lif_rekening~cetak_ringkasan REDEFINITION.
ENDCLASS.

CLASS lcl_tabungan IMPLEMENTATION.
  METHOD hitung_bunga.
    DATA(lv_bunga) = mv_saldo * ( iv_persen / 100 ).
    mv_saldo = mv_saldo + lv_bunga.
    WRITE: / |Bunga tabungan { iv_persen }% (Rp { lv_bunga NUMBER = USER }) ditambahkan.|.
  ENDMETHOD.

  METHOD lif_rekening~cetak_ringkasan.
    WRITE: / '--- TIPE: REKENING TABUNGAN RITEL ---'.
    super->lif_rekening~cetak_ringkasan( ).
  ENDMETHOD.
ENDCLASS.

*----------------------------------------------------------------------*
* 5. Eksekusi Program Utama
*----------------------------------------------------------------------*
START-OF-SELECTION.

  WRITE: / sy-uline(80).
  WRITE: / '|', (76) 'SIMULASI TRANSAKSI REKENING BANK OOP ENTERPRISE' CENTERED, '|'.
  WRITE: / sy-uline(80).

  " 1. Instansiasi objek tabungan
  DATA(lo_tabungan) = NEW lcl_tabungan(
    iv_nomor   = 'TAB-001-992'
    iv_nasabah = 'Siti Aminah'
    iv_saldo   = '5000000'
  ).

  " 2. Operasi Setor & Hitung Bunga
  lo_tabungan->lif_rekening~setor( 2000000 ).
  lo_tabungan->hitung_bunga( '0.5' ).
  lo_tabungan->lif_rekening~cetak_ringkasan( ).

  WRITE: / sy-uline(80).

  " 3. Uji Coba Penarikan Melebihi Saldo dengan TRY-CATCH
  TRY.
      WRITE: / 'Mencoba menarik dana sebesar Rp 10.000.000...'.
      lo_tabungan->lif_rekening~tarik( 10000000 ).
    CATCH cx_saldo_kurang.
      WRITE: / 'TRANSAKSI DITOLAK: Saldo rekening tidak mencukupi untuk penarikan ini!'.
  ENDTRY.

  WRITE: / sy-uline(80).
```

### Hasil Akhir

```text
---------------------------------------------------------------------------------
|                SIMULASI TRANSAKSI REKENING BANK OOP ENTERPRISE                |
---------------------------------------------------------------------------------
Setor tunai Rp 2.000.000,00 ke TAB-001-992 berhasil.
Bunga tabungan 0.5% (Rp 35.000,00) ditambahkan.
--- TIPE: REKENING TABUNGAN RITEL ---
No. Rekening : TAB-001-992
Nama Nasabah : Siti Aminah
Sisa Saldo   : Rp 7.035.000,00
---------------------------------------------------------------------------------
Mencoba menarik dana sebesar Rp 10.000.000...
TRANSAKSI DITOLAK: Saldo rekening tidak mencukupi untuk penarikan ini!
---------------------------------------------------------------------------------
```

---

## 15. 📚 Ringkasan & Peta Ingatan

### Peta Konsep ABAP Objects

```text
ABAP Objects (OOP)
├── 1. Struktur Class
│   ├── DEFINITION (Public, Protected, Private Sections)
│   ├── IMPLEMENTATION (Blok kode logika method)
│   └── Konstruktor (constructor instance & class_constructor static)
├── 2. Ruang Lingkup Data & Method
│   ├── Instance (DATA & METHODS via operator -> dan NEW)
│   └── Static (CLASS-DATA & CLASS-METHODS via operator =>)
├── 3. Pilar-Pilar Utama
│   ├── Enkapsulasi (Proteksi data di Private, akses via Getter/Setter)
│   ├── Pewarisan (INHERITING FROM, REDEFINITION, super->method)
│   ├── Abstraksi (ABSTRACT Class dilarang diinstansiasi langsung)
│   └── Polimorfisme (INTERFACE lif_... untuk kontrak seragam)
└── 4. Exception Modern
    ├── CX_ROOT (Superclass seluruh exception ABAP)
    └── TRY ... CATCH cx_... INTO DATA(lx_err) ... ENDTRY
```

---

## 16. 📚 Cheat Code ABAP Objects 10 Detik

```text
DATA(lo_obj) = NEW lcl_name( ).        → Instansiasi objek modern
lo_obj->do_something( ).               → Memanggil instance method
lcl_name=>static_action( ).            → Memanggil static method
INHERITING FROM super_class.           → Mewarisi sifat class induk
METHODS meth REDEFINITION.             → Mengubah logika method turunan
INTERFACES lif_name.                   → Mengimplementasikan interface
lo_obj->lif_name~method( ).            → Memanggil method interface
TRY. ... CATCH cx_error. ... ENDTRY.   → Menangkap error berbasis class
```

---

## 17. 🧭 Urutan Belajar Selanjutnya

Setelah menguasai paradigma pemrograman berorientasi objek yang menjadi fondasi modern development SAP, langkah berikutnya adalah mempelajari bagaimana mengkustomisasi aplikasi standar SAP secara aman:

```text
1. 🟢 ABAP Dasar (Fondasi sintaks & kontrol alur)
      │
      ▼
2. 🟢 ABAP Data Dictionary (Pemodelan tabel & tipe data)
      │
      ▼
3. 🟢 ABAP Internal Tables (Manipulasi array in-memory)
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
7. 🟡 ABAP Objects (OOP) (Selesai pada modul ini)
      │
      ▼
8. 🔴 ABAP Enhancement Framework
   → Pelajari cara menyisipkan logika bisnis kustom ke dalam kode standar SAP tanpa merusak standar (User Exits, Customer Exits, BAdI, dan Enhancement Spots).
      │
      ▼
9. 🔴 ABAP Debugging & Performance Tuning
   → Pelajari investigasi crash dump (ST22) dan profiling SQL (ST05).
```

Lanjutkan ke modul berikutnya: [[abap-enhancement|ABAP Enhancement Framework]] (Modul 8).

---

## 18. 🔗 Referensi Resmi

* [SAP Help Portal — ABAP Objects Overview](https://help.sap.com/docs/ABAP_PLATFORM/)
* [ABAP Keyword Documentation — ABAP Objects Programming](https://help.sap.com/doc/abapdocu_latest_index_htm/latest/en-US/index.htm)
* [SAP Community — Clean ABAP: Styleguide for Object-Oriented Code](https://github.com/SAP/styleguides/blob/main/clean-abap/CleanABAP.md)
