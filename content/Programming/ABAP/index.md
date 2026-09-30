---
title: "ABAP"
description: "Kurikulum bahasa pemrograman SAP ABAP komprehensif: sintaksis dasar, ABAP Data Dictionary (DDIC), Internal Tables, Open SQL, ALV Reports, ABAP Objects (OOP), hingga paradigma modern S/4HANA (CDS Views & RAP)."
order: 5
tags:
  - programming
  - abap
  - sap
  - enterprise
  - backend
---

# ABAP

> **ABAP (Advanced Business Application Programming)** adalah bahasa pemrograman tingkat tinggi multi-paradigma yang dikembangkan oleh SAP. Digunakan untuk membangun, memodifikasi, dan mengoptimalkan logika proses bisnis pada sistem enterprise berskala global (SAP ECC dan SAP S/4HANA).

---

## Jalur Pembelajaran Terstruktur

Kurikulum dibagi menjadi dua jalur terintegrasi: **Track 1** untuk penguasaan alur pengembangan inti dari fundamental hingga arsitektur modern SAP S/4HANA (Fiori/RAP), dan **Track 2** sebagai ensiklopedia referensi operasional, pengujian mutu, integrasi, dan tata kelola enterprise:

---

## Track 1: Core ABAP Developer (Modul 1–11)

### 🟢 Fundamental (Fondasi Bahasa & Arsitektur)

1. 🟢 [[abap-dasar|ABAP Dasar]] (Modul 1)
   → Arsitektur 3-tier SAP, Transaction Codes (T-Code), aturan sintaks, tipe data bawaan, control flow, input `PARAMETERS`, dan system variables (`sy-subrc`).
2. 🟢 [[abap-dictionary|ABAP Data Dictionary (DDIC)]] (Modul 2)
   → Data modeling level database: Domain, Data Element, Transparent Table, Structures, Table Types, Search Help, Lock Objects, dan Table Maintenance Generator (TMG).
3. 🟢 [[abap-internal-tables|ABAP Internal Tables]] (Modul 3)
   → Struktur data in-memory: Standard Table, Sorted Table, Hashed Table, Work Area, Field Symbols, hingga ekspresi tabel modern ABAP 7.40+ (`VALUE`, `FOR`, table expressions).

---

### 🟡 Intermediate (Logika Bisnis & Pelaporan)

4. 🟡 [[abap-database|ABAP Database Access & Open SQL]] (Modul 4)
   → Interaksi database Open SQL, sintaks modern 7.40+, operasi CRUD, optimasi performa (`FOR ALL ENTRIES` vs `JOIN`), dan SAP LUW (`COMMIT WORK`).
5. 🟡 [[abap-modularization|ABAP Modularization & Integration]] (Modul 5)
   → Pengorganisasian kode dengan Function Groups, Function Modules, Remote Function Call (RFC), dan Business Application Programming Interface (BAPI).
6. 🟡 [[abap-reports-alv|ABAP Reports & ALV Grid]] (Modul 6)
   → Siklus hidup pelaporan interaktif (Selection Screen events) dan visualisasi data tabel menggunakan Object-Oriented ALV (`CL_SALV_TABLE`).
7. 🟡 [[abap-oop|ABAP Objects (OOP)]] (Modul 7)
   → Pemrograman berorientasi objek di ABAP: Definition & Implementation Class, Encapsulation, Inheritance, Interface, Constructor, dan Class-based Exception Handling.

---

### 🔴 Advanced (Kustomisasi, Optimasi, & S/4HANA)

8. 🔴 [[abap-enhancement|ABAP Enhancement Framework]] (Modul 8)
   → Kustomisasi standar SAP tanpa merusak standard code: User Exits, Customer Exits, BAdI (Business Add-Ins), serta Explicit & Implicit Enhancement Points.
9. 🔴 [[abap-debugging-performance|ABAP Debugging & Performance Tuning]] (Modul 9)
   → Investigasi program dengan New ABAP Debugger, analisis dump runtime (`ST22`), SQL Trace (`ST05`), dan Runtime Profiling (`SAT`).
10. 🔴 [[abap-cds-s4hana|ABAP Core Data Services (CDS Views) & AMDP]] (Modul 10)
    → Paradigma *Code-to-Data* di S/4HANA: CDS Views di Eclipse ADT, Associations, Annotations, dan ABAP Managed Database Procedures (AMDP).
11. 🔴 [[abap-rap-odata|ABAP RESTful Application Programming (RAP)]] (Modul 11)
    → Arsitektur aplikasi modern S/4HANA untuk frontend SAP Fiori: Behavior Definition, Service Definition, dan eksposur OData Service (V2/V4).

---

## Track 2: Enterprise Operations & Quality Reference (Modul 12–18)

Kumpulan modul referensi praktis yang dirancang untuk kebutuhan kerja operasional, penjaminan mutu (*quality gates*), integrasi asinkron, dan tata kelola rilis enterprise:

### 🛡️ Quality & Testing

12. 🛡️ [[abap-unit-testing|ABAP Unit & Automated Testing]] (Modul 12)
    → Pengujian otomatis bawaan: Test Class (`FOR TESTING`), Test Fixtures (`SETUP`/`TEARDOWN`), Assertion (`CL_ABAP_UNIT_ASSERT`), dan integrasi di Eclipse ADT.
13. 🛡️ [[abap-atc-clean|ABAP Test Cockpit (ATC) & Clean ABAP]] (Modul 13)
    → Pemeriksaan statis kode otomatis: Hubungan engine SCI dan ATC, Check Variants, gerbang rilis TR (*Quality Gate*), Exemption Workflow, dan kaidah gaya penulisan Clean ABAP.

---

### 🌐 Integrasi & Operasional Batch

14. 🌐 [[abap-idoc-ale|IDoc & ALE Asynchronous Integration]] (Modul 14)
    → Integrasi asinkron enterprise: Arsitektur 3 lapis IDoc (`EDIDC`, `EDIDD`, `EDIDS`), Message Types, Partner Profile (`WE20`), monitoring di `WE02`, dan pemrosesan ulang error di `BD87`.
15. 🌐 [[abap-background-jobs|Background Jobs & Batch Processing]] (Modul 15)
    → Pemrosesan data massal latar belakang: Menghindari timeout dialog (`rdisp/max_wprun_time`), penjadwalan di `SM36`, monitoring di `SM37`, Spool (`SP01`), dan debugging via `JDBG`.
16. 🌐 [[abap-tms-transport|TMS & Transport Management System]] (Modul 16)
    → Tata kelola pemindahan kode berjenjang (DEV $\rightarrow$ QAS $\rightarrow$ PRD): Workbench vs Customizing Request, alur rilis di `SE09`/`SE10`, Import Queue `STMS`, dan analisis Return Codes.

---

### ⚙️ Komponen Fondasi Enterprise

17. ⚙️ [[abap-number-range|Number Range Management (SNRO & Modern APIs)]] (Modul 17)
    → Penomoran dokumen transaksi bebas tabrakan (*concurrency-safe*): Pencegahan bahaya `SELECT MAX + 1`, konfigurasi `SNRO`, buffering memori vs no-buffering, dan API modern `cl_numberrange_runtime`.
18. ⚙️ [[abap-application-log|Application Log (SLG0 / SLG1 & BALI Framework)]] (Modul 18)
    → Pencatatan jejak audit proses bisnis tanpa dialog: Konfigurasi Object/Subobject di `SLG0`, monitoring forensik di `SLG1`, API Function Module `BAL_*`, dan framework modern BALI (`CL_BALI_LOG`).
