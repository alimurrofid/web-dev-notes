---
title: "Spring Boot Dasar"
description: "Fundamental Spring Boot: Inversion of Control (IoC), Dependency Injection (DI), Bean lifecycle, Component Scanning, dan Application Properties."
order: 1
tags:
  - web-development
  - backend
  - spring-boot
  - java
  - fundamental
---

# Spring Boot Dasar

> **Target:** Pemula yang telah memahami Java dasar, OOP, Generic, Collection, dan Database (JDBC), serta ingin menguasai fondasi arsitektur enterprise modern menggunakan **Spring Boot 3.3+ (Spring Framework 6.x & Java 21 LTS)**.
>
> Fokus cheatsheet ini: **Inversion of Control (IoC) mental model → `@SpringBootApplication` & Component Scanning → IoC Container & ApplicationContext → Stereotypes (`@Component`, `@Service`, `@Repository`) → `@Configuration` & `@Bean` → Constructor Dependency Injection (Best Practice) → `@Primary` & `@Qualifier` → Bean Lifecycle (`@PostConstruct`, `@PreDestroy`) → Scopes & `@Lazy` → `@Value` & `@ConfigurationProperties` → Multi-Environment Profiles → Event Listener → Logging SLF4J → mini project engine notifikasi & diskon modular CLI**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: Inversion of Control, ApplicationContext, Stereotype Beans, dan Constructor Injection

🟡 Lanjutan
→ pelajari setelah memahami DI: Bean Lifecycle, Scopes, @ConfigurationProperties, Profiles, dan Event Listener

🔴 Advanced / Operasional
→ penting untuk arsitektur production: Logging SLF4J/Logback, Conditional Beans, dan Runner Interfaces
```

Mental model alur siklus hidup Spring Boot Application & IoC Container:

```text
               Entry Point: main()
                       │
                       ▼
       SpringApplication.run(App.class, args)
                       │
                       ▼
       ┌───────────────────────────────────────┐
       │     INISIALISASI APPLICATIONCONTEXT   │
       │  1. Scan Packages (@ComponentScan)    │
       │  2. Instansiasi Beans (@Component)    │
       │  3. Suntik Ketergantungan (DI)        │
       │  4. Jalankan @PostConstruct           │
       └───────────────────┬───────────────────┘
                           │
                           ▼
       ┌───────────────────────────────────────┐
       │   APLIKASI SIAP / RUNNERS BERJALAN    │
       │   (CommandLineRunner / Dev Services)  │
       └───────────────────┬───────────────────┘
                           │
                           ▼  Aplikasi Dimatikan (Shutdown)
       ┌───────────────────────────────────────┐
       │   PEMBERSIHAN BEAN (@PreDestroy)      │
       └───────────────────────────────────────┘
```

**Hafalan:**

```text
IoC Container      → wadah sentral Spring yang membuat, mengonfigurasi, dan merangkai siklus hidup objek (Beans)
Spring Bean        → objek Java biasa (POJO) yang diinstansiasi dan dikelola penuh oleh Spring IoC Container
Dependency Injection (DI) → pola di mana objek menerima dependensi dari luar (disediakan Container), bukan membuat sendiri via new
Constructor Injection → cara penyuntikan dependensi melalui constructor class (standar emas industri, immutable & testable)
@SpringBootApplication → anotasi gabungan pembuka yang mengaktifkan auto-configuration dan component scanning
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Spring Boot & Mental Model Inversion of Control (IoC)](#bagian-1)
2. [Struktur Proyek Spring Boot & Anatomi `@SpringBootApplication`](#bagian-2)
3. [Spring IoC Container & `ApplicationContext`](#bagian-3)
4. [Mendefinisikan Bean dengan Stereotype Annotations](#bagian-4)
5. [Mendefinisikan Custom Bean dengan `@Configuration` & `@Bean`](#bagian-5)
6. [Dependency Injection (DI) & Constructor Injection](#bagian-6)
7. [Mengatasi Ambiguitas Bean: `@Primary` & `@Qualifier`](#bagian-7)
8. [Bean Lifecycle: `@PostConstruct` & `@PreDestroy`](#bagian-8)

### 🟡 Lanjutan

9. [Bean Scopes (`singleton` vs `prototype`)](#bagian-9)
10. [Lazy Initialization Bean (`@Lazy`)](#bagian-10)
11. [Mengambil Nilai Konfigurasi dengan `@Value`](#bagian-11)
12. [Type-Safe Configuration dengan `@ConfigurationProperties`](#bagian-12)
13. [Format Konfigurasi: `application.properties` vs `application.yaml`](#bagian-13)
14. [Spring Profiles & Multi-Environment Setup](#bagian-14)
15. [Conditional Beans (`@ConditionalOnProperty`, `@ConditionalOnMissingBean`)](#bagian-15)
16. [Event Handling di Spring Boot (`@EventListener`)](#bagian-16)

### 🔴 Advanced / Operasional

17. [Spring Boot Logging dengan SLF4J & Logback](#bagian-17)
18. [Runner Interfaces (`CommandLineRunner` & `ApplicationRunner`)](#bagian-18)

### 🛠️ Referensi & Praktik

19. [Peta Ingatan Cepat](#bagian-19)
20. [Tabel Ringkasan](#bagian-20)
21. [Cheat Code Spring Boot Dasar 10 Detik](#bagian-21)
22. [Urutan Belajar yang Disarankan](#bagian-22)
23. [Mini Project: Production-Ready Modular Order Notification & Discount Engine CLI](#bagian-23)
24. [Referensi Resmi](#bagian-24)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan Spring Boot & Mental Model Inversion of Control (IoC)

#### Konsep

Dalam pemrograman tradisional (tanpa framework), class Anda bertanggung jawab penuh untuk menginstansiasi seluruh objek yang dibutuhkannya secara manual menggunakan kata kunci `new`. Ini menyebabkan kode saling mengunci rapat (*tightly coupled*), sulit di-unit test, dan rawan kesalahan manajemen memori.

**Inversion of Control (IoC)** membalikkan kendali tersebut:
- Anda tidak lagi memanggil `new Service()` atau `new Repository()`.
- **Spring IoC Container** yang bertugas membuat objek, mengonfigurasinya, dan menyuntikkannya ke class yang membutuhkan saat aplikasi dimulai.
- Objek yang dikelola oleh Spring IoC Container disebut **Spring Bean**.

#### Contoh

```java
// 1. CARA LAMA (Tightly Coupled - Hindari di Spring)
class OldOrderService {
    private EmailNotification emailNotification = new EmailNotification(); // Membuat sendiri via 'new'
}

// 2. CARA SPRING BOOT (Inversion of Control - Loose Coupling)
@Service
public class ModernOrderService {
    private final NotificationService notificationService;

    // Spring yang secara otomatis menyuntikkan implementasi NotificationService yang tepat
    public ModernOrderService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    public void processOrder(String orderId) {
        notificationService.sendNotification("Pesanan #" + orderId + " berhasil diproses!");
    }
}
```

#### Cara Kerja

```text
Pendekatan Tradisional:
OrderService ──(new)──> EmailNotification (Tergantung Kaku)

Pendekatan Spring IoC:
┌───────────────────────────────────────────────┐
│              SPRING IOC CONTAINER             │
│  [NotificationService] ──(Inject)──> [OrderService]
└───────────────────────────────────────────────┘
```

**Hafalan:**

```text
Inversion of Control (IoC) → prinsip pemindahan tanggung jawab penciptaan objek dari programmer ke Spring Container
Loose Coupling             → kondisi di mana antar komponen aplikasi tidak saling bergantung secara kaku
```

---

<a id="bagian-2"></a>

## 2. 🟢 Struktur Proyek Spring Boot & Anatomi `@SpringBootApplication`

#### Konsep

Setiap aplikasi Spring Boot memiliki satu class utama (*Entry Point*) yang ditandai dengan anotasi **`@SpringBootApplication`**.

Anotasi ini adalah anotasi komposit (gabungan dari 3 anotasi penting):
1. **`@SpringBootConfiguration`:** Menandai class sebagai sumber konfigurasi bean Spring.
2. **`@EnableAutoConfiguration`:** Menginstruksikan Spring Boot untuk secara cerdas mengonfigurasi komponen database, server, dan security secara otomatis berdasarkan dependensi *starter* yang ada di `pom.xml` / `build.gradle`.
3. **`@ComponentScan`:** Menginstruksikan Spring untuk memindai (*scan*) seluruh class, package, dan sub-package di bawah lokasi class utama untuk mencari anotasi stereotype (`@Component`, `@Service`, `@Repository`, `@Controller`).

#### Contoh

```java
package com.belajar.springboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BelajarSpringBootApplication {
    public static void main(String[] args) {
        // Memulai dan menginisialisasi seluruh ekosistem Spring Boot
        SpringApplication.run(BelajarSpringBootApplication.class, args);
    }
}
```

#### Cara Kerja

```text
com.belajar.springboot (Root Package - Lokasi @SpringBootApplication)
  │
  ├──> com.belajar.springboot.service    (Otomatis Ter-scan)
  ├──> com.belajar.springboot.repository (Otomatis Ter-scan)
  └──> com.belajar.springboot.controller (Otomatis Ter-scan)
```

**Hafalan:**

```text
@SpringBootApplication      → anotasi pembuka entry point yang mengaktifkan auto-configuration dan component scanning
SpringApplication.run(Class, args) → memicu proses booting container, web server, dan context Spring
```

#### Kesalahan Umum

❌ Meletakkan class `@Service` atau `@Repository` di luar root package `@SpringBootApplication` (misal: class utama di `com.belajar.app`, tetapi service di `com.lain.service`), sehingga service tidak pernah ter-scan dan memicu error `NoSuchBeanDefinitionException`.

✅ Selalu letakkan class `@SpringBootApplication` di root package teratas proyek Anda.

---

<a id="bagian-3"></a>

## 3. 🟢 Spring IoC Container & `ApplicationContext`

#### Konsep

**`ApplicationContext`** adalah antarmuka utama yang merepresentasikan **Spring IoC Container**.

Melalui `ApplicationContext`, kita dapat:
- Mengambil objek Bean berdasarkan tipe class atau nama bean: `context.getBean(Class)`
- Memeriksa ketersediaan bean: `context.containsBean(String)`
- Memeriksa total jumlah bean yang terdaftar di aplikasi.

#### Contoh

```java
package com.belajar.springboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

@Component
class SystemClock {
    public void printCurrentTime() {
        System.out.println("⏰ Waktu Sistem: " + System.currentTimeMillis());
    }
}

@SpringBootApplication
public class ApplicationContextDemo {
    public static void main(String[] args) {
        // Mengambil referensi ApplicationContext saat booting
        ApplicationContext context = SpringApplication.run(ApplicationContextDemo.class, args);

        // Mengambil Bean dari Container secara manual
        SystemClock clock = context.getBean(SystemClock.class);
        clock.printCurrentTime();

        System.out.println("Total Bean Terdaftar: " + context.getBeanDefinitionCount());
    }
}
```

#### Output

```text
⏰ Waktu Sistem: 1724935000000
Total Bean Terdaftar: 78
```

**Hafalan:**

```text
ApplicationContext context = SpringApplication.run(...) → mengakses wadah penampung bean Spring
context.getBean(TargetClass.class)                     → mengambil instance bean yang dikelola container
```

---

<a id="bagian-4"></a>

## 4. 🟢 Mendefinisikan Bean dengan Stereotype Annotations

#### Konsep

Cara paling umum mendaftarkan class kita sendiri agar menjadi Spring Bean adalah dengan menambahkan salah satu **Stereotype Annotation** di atas deklarasi class:

| Anotasi | Lapisan Arsitektur | Tujuan & Kegunaan |
|---|---|---|
| **`@Component`** | Umum / Utility | Anotasi dasar untuk class pembantu (*helper*), generator, listener. |
| **`@Service`** | Business Logic | Menampung aturan bisnis (*Service Layer*), transaksi, kalkulasi. |
| **`@Repository`** | Data Access (DAO) | Menangani query database, otomatis menerjemahkan vendor SQLException. |
| **`@Controller`** | Presentation | Menangani request HTTP berbasis Web HTML / MVC. |
| **`@RestController`** | RESTful API | Menangani request HTTP yang mengembalikan format JSON / XML. |

#### Contoh

```java
package com.belajar.springboot.service;

import org.springframework.stereotype.Service;

@Service
public class DiskonService {
    public double hitungDiskon(double totalBelanja) {
        if (totalBelanja >= 500_000) {
            return totalBelanja * 0.10; // Diskon 10%
        }
        return 0.0;
    }
}
```

**Hafalan:**

```text
@Component  → penanda umum bean Spring
@Service    → penanda bean khusus logika bisnis aplikasi
@Repository → penanda bean khusus akses data dan database
```

---

<a id="bagian-5"></a>

## 5. 🟢 Mendefinisikan Custom Bean dengan `@Configuration` & `@Bean`

#### Konsep

Jika Anda ingin mendaftarkan class pihak ketiga (*Third-Party Libraries* seperti `ObjectMapper` Jackson, Redis Template, atau `RestTemplate` yang kodenya tidak bisa Anda beri anotasi `@Component` langsung), gunakan kombinasi:
1. **`@Configuration`:** Menandai class Java murni sebagai pabrik konfigurasi bean.
2. **`@Bean`:** Diletakkan di atas method. Nilai kembalian (*return value*) dari method tersebut akan otomatis didaftarkan menjadi Spring Bean di dalam IoC Container.

Secara default, nama Bean adalah **nama method-nya**.

#### Contoh

```java
package com.belajar.springboot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.text.SimpleDateFormat;

@Configuration
public class ThirdPartyConfig {

    // Mendaftarkan SimpleDateFormat dari library Java standar sebagai Spring Bean
    @Bean
    public SimpleDateFormat standardDateFormat() {
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    }

    // Memberi nama kustom pada bean
    @Bean(name = "indonesianDateFormat")
    public SimpleDateFormat indonesianDateFormat() {
        return new SimpleDateFormat("dd MMMM yyyy");
    }
}
```

#### Cara Kerja

```text
Spring Boot Startup ──> Scan @Configuration ──> Jalankan method @Bean ──> Simpan objek di Container
```

**Hafalan:**

```text
@Configuration → menandai class sebagai konfigurasi pabrik pembuatan bean
@Bean          → mendaftarkan return value sebuah method menjadi objek Spring Bean
```

---

<a id="bagian-6"></a>

## 6. 🟢 Dependency Injection (DI) & Constructor Injection

#### Konsep

Dependency Injection adalah mekanisme di mana Spring menyuntikkan (*inject*) bean A ke dalam bean B yang membutuhkannya.

Tiga cara melakukan DI di Spring:
1. **Field Injection (`@Autowired private Service s;`):** ❌ **SANGAT TIDAK DISARANKAN**. Sulit di-unit test (karena private), menyembunyikan dependensi, dan rawan NullPointer di luar Spring context.
2. **Setter Injection:** ⚠️ Digunakan hanya jika dependensi bersifat opsional (*nullable*).
3. **Constructor Injection (STANDAR EMAS INDUSTRI / REKOMENDASI UTAMA):**
   - Mendeklarasikan field sebagai `private final` (**Immutability**).
   - Mudah di-unit test murni tanpa perlu menyalakan Spring Context (`new Service(mockDep)`).
   - Sejak Spring 4.3+, jika class hanya memiliki **1 constructor**, anotasi `@Autowired` **tidak wajib ditulis lagi**.

#### Contoh

```java
package com.belajar.springboot.service;

import org.springframework.stereotype.Service;

@Service
public class CheckoutService {
    // 1. Deklarasi field immutable (final)
    private final DiskonService diskonService;

    // 2. Constructor Injection (Aman, Bersih, dan Standard Modern)
    public CheckoutService(DiskonService diskonService) {
        this.diskonService = diskonService;
    }

    public double hitungTotalAkhir(double totalBelanja) {
        double diskon = diskonService.hitungDiskon(totalBelanja);
        return totalBelanja - diskon;
    }
}
```

#### Cara Kerja

```text
1. Container membuat Bean DiskonService
2. Container membuat Bean CheckoutService sambil menyuapkan DiskonService ke Constructor
```

**Hafalan:**

```text
public TargetService(DependencyService dependency) { this.dependency = dependency; } → pola Constructor Injection resmi
```

---

<a id="bagian-7"></a>

## 7. 🟢 Mengatasi Ambiguitas Bean: `@Primary` & `@Qualifier`

#### Konsep

Jika Anda memiliki sebuah Interface (misal: `PaymentGateway`) dan memiliki **lebih dari satu class implementasi** yang sama-sama terdaftar sebagai Bean (`GopayService` dan `OvoService`), Spring akan bingung memilih dan melempar error **`NoUniqueBeanDefinitionException`**.

Dua cara menyelesaikannya:
1. **`@Primary`:** Menandai salah satu implementasi sebagai *default bean* utama jika tidak ada instruksi spesifik.
2. **`@Qualifier("beanName")`:** Memilih secara eksplisit bean mana yang ingin disuntikkan berdasarkan nama bean-nya (secara default nama bean adalah nama class berhuruf kecil di awal, misal: `gopayService`).

#### Contoh

```java
package com.belajar.springboot.payment;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

// Interface Bersama
interface PaymentGateway {
    String prosesBayar(double nominal);
}

// Implementasi 1 (Sebagai Pilihan Utama Default via @Primary)
@Component
@Primary
class GopayGateway implements PaymentGateway {
    @Override
    public String prosesBayar(double nominal) {
        return "Pembayaran GoPay Rp " + nominal + " Berhasil";
    }
}

// Implementasi 2
@Component("ovoGateway")
class OvoGateway implements PaymentGateway {
    @Override
    public String prosesBayar(double nominal) {
        return "Pembayaran OVO Rp " + nominal + " Berhasil";
    }
}

// Service yang memilih Gateway spesifik via @Qualifier
@Service
class OrderPaymentProcessor {
    private final PaymentGateway paymentGateway;

    // Memilih OvoGateway secara spesifik
    public OrderPaymentProcessor(@Qualifier("ovoGateway") PaymentGateway paymentGateway) {
        this.paymentGateway = paymentGateway;
    }

    public void bayar(double total) {
        System.out.println(paymentGateway.prosesBayar(total));
    }
}
```

**Hafalan:**

```text
@Primary                   → menjadikan bean sebagai prioritas default saat terjadi ambiguitas
@Qualifier("beanName")     → menentukan secara spesifik bean mana yang di-inject berdasarkan nama
```

---

<a id="bagian-8"></a>

## 8. 🟢 Bean Lifecycle: `@PostConstruct` & `@PreDestroy`

#### Konsep

Seringkali sebuah Bean membutuhkan persiapan awal (misal: membuka socket koneksi, menghangatkan cache data) tepat setelah dependensinya di-inject, dan pembersihan resource saat aplikasi dimatikan.

Anotasi Lifecycle Standar (Jakarta Annotation):
- **`@PostConstruct`:** Dijalankan tepat **satu kali** segera setelah Bean selesai diinstansiasi dan seluruh Constructor Injection selesai.
- **`@PreDestroy`:** Dijalankan tepat **satu kali** sesaat sebelum Bean dihancurkan dan aplikasi dimatikan (*Graceful Shutdown*).

#### Contoh

```java
package com.belajar.springboot.lifecycle;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Component;

@Component
public class CacheService {

    @PostConstruct
    public void inisialisasiCache() {
        System.out.println("🟢 [LIFECYCLE] @PostConstruct: Memuat data master ke memory cache...");
    }

    public void layaniRequest() {
        System.out.println("⚡ Melayani request dari cache.");
    }

    @PreDestroy
    public void bersihkanCache() {
        System.out.println("🔴 [LIFECYCLE] @PreDestroy: Menutup koneksi & membersihkan cache memori...");
    }
}
```

#### Cara Kerja

```text
Instansiasi Objek ──> Constructor Injection ──> @PostConstruct ──> [Bean Siap Pakai] ──> Shutdown ──> @PreDestroy
```

**Hafalan:**

```text
@PostConstruct → method inisialisasi awal setelah dependensi bean lengkap terpasang
@PreDestroy    → method pembersihan resource sebelum bean dimusnahkan saat aplikasi berhenti
```

---

<a id="bagian-9"></a>

## 9. 🟡 Bean Scopes (`singleton` vs `prototype`)

#### Konsep

Scope menentukan bagaimana Spring membuat instance dari sebuah Bean:

1. **`singleton` (DEFAULT):**
   - Hanya dibuat **tepat 1 instance** di seluruh aplikasi.
   - Instance yang sama akan di-share dan disuntikkan ke seluruh komponen lain (Hemat memori).
   - **Wajib bersifat *Stateless*** (jangan menyimpan state data user di dalam instance variable).
2. **`prototype` (`@Scope("prototype")`):**
   - Dibuat **instance objek baru** setiap kali bean tersebut diminta atau di-inject ke komponen lain.
3. **Web Scopes:** `request` (1 instance per HTTP request), `session` (1 instance per HTTP session).

#### Contoh

```java
package com.belajar.springboot.scope;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import java.util.UUID;

// Prototype: Instance baru dengan ID unik setiap kali dipanggil
@Component
@Scope("prototype")
public class RequestIdGenerator {
    private final String id = UUID.randomUUID().toString();

    public String getId() { return id; }
}
```

**Hafalan:**

```text
@Scope("singleton") → 1 instance tunggal untuk seluruh aplikasi (default)
@Scope("prototype") → instance baru selalu diciptakan setiap kali di-inject atau dipanggil
```

---

<a id="bagian-10"></a>

## 10. 🟡 Lazy Initialization Bean (`@Lazy`)

#### Konsep

Secara default, Spring menganut prinsip **Eager Initialization** (seluruh singleton bean diinstansiasi di awal saat booting aplikasi agar kesalahan dependensi langsung terdeteksi seketika).

Jika Anda memiliki Bean yang memakan resource berat dan jarang dipakai (misal: Report Heavy Engine), tambahkan anotasi **`@Lazy`**:
- Bean tersebut **tidak akan dibuat saat booting awal**.
- Bean baru dibuat pertama kali saat ada komponen yang benar-benar memanggil atau menggunakannya.

#### Contoh

```java
package com.belajar.springboot.service;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Service
@Lazy
public class HeavyReportService {
    public HeavyReportService() {
        System.out.println("🐢 [LAZY] HeavyReportService baru diinstansiasi saat dibutuhkan!");
    }

    public void generatePdf() {
        System.out.println("Menghasilkan laporan PDF kompleks...");
    }
}
```

**Hafalan:**

```text
@Lazy → menunda pembuatan objek bean sampai pertama kali dipanggil untuk mempercepat startup
```

---

<a id="bagian-11"></a>

## 11. 🟡 Mengambil Nilai Konfigurasi dengan `@Value`

#### Konsep

Anotasi **`@Value`** digunakan untuk menyuntikkan nilai konfigurasi individual dari file `application.properties` atau `application.yaml` langsung ke field atau parameter constructor class.

Sintaks Format:
- `${nama.property:nilaiDefault}` : Mengambil nilai, dan menggunakan `nilaiDefault` jika key tidak ditemukan di properties.
- `#{systemProperties['user.home']}` : Menggunakan SpEL (*Spring Expression Language*).

#### Contoh

Isi `application.properties`:
```properties
app.name=Toko Berkah API
app.version=2.1.0
app.max-upload-size=50
```

Class Java:
```java
package com.belajar.springboot.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AppMetadata {
    private final String appName;
    private final String appVersion;
    private final int timeoutSeconds;

    public AppMetadata(
        @Value("${app.name}") String appName,
        @Value("${app.version:1.0.0}") String appVersion,
        @Value("${app.timeout:30}") int timeoutSeconds // 30 adalah default value jika key tidak ada
    ) {
        this.appName = appName;
        this.appVersion = appVersion;
        this.timeoutSeconds = timeoutSeconds;
    }

    public void printInfo() {
        System.out.printf("App: %s (v%s) | Timeout: %ds%n", appName, appVersion, timeoutSeconds);
    }
}
```

**Hafalan:**

```text
@Value("${property.key:defaultValue}") → menyuntikkan nilai konfigurasi individual ke variabel
```

---

<a id="bagian-12"></a>

## 12. 🟡 Type-Safe Configuration dengan `@ConfigurationProperties`

#### Konsep

Untuk konfigurasi yang kompleks dan memiliki banyak properti bertingkat (misal: konfigurasi database, payment gateway, mail server), penggunaan `@Value` satu per satu menjadi tidak praktis dan rawan typo.

**`@ConfigurationProperties` (Standar Modern)**:
1. Memetakan (*bind*) seluruh grup properti hierarkis langsung ke dalam Java Class atau **Java Record**.
2. **Type-Safe:** Otomatis mengonversi tipe data String ke `int`, `Duration`, `boolean`, `List<String>`, dll.
3. Mendukung validasi otomatis dengan Jakarta Validation (`@Validated`).

#### Contoh

Isi `application.yaml`:
```yaml
app:
  payment:
    merchant-id: "MID-9921"
    secret-key: "SuperSecretKey123"
    sandbox-mode: true
    allowed-banks:
      - BCA
      - BNI
      - MANDIRI
```

Deklarasi Record Properties (Java 21):
```java
package com.belajar.springboot.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import java.util.List;

@ConfigurationProperties(prefix = "app.payment")
public record PaymentGatewayProperties(
    String merchantId,
    String secretKey,
    boolean sandboxMode,
    List<String> allowedBanks
) {}
```

Mengaktifkan di Configuration:
```java
@Configuration
@EnableConfigurationProperties(PaymentGatewayProperties.class)
public class PaymentConfig {}
```

**Hafalan:**

```text
@ConfigurationProperties(prefix = "app.section") → mapping kelompok konfigurasi hierarki ke objek/record Java
```

---

<a id="bagian-13"></a>

## 13. 🟡 Format Konfigurasi: `application.properties` vs `application.yaml`

#### Konsep

Spring Boot mendukung dua format konfigurasi utama yang terletak di folder `src/main/resources/`:

1. **`application.properties` (Format Key-Value Datar):**
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/db_toko
spring.datasource.username=root
spring.datasource.password=rahasia
```

2. **`application.yaml` / `application.yml` (Format Hierarkis Berindentasi - Sangat Direkomendasikan):**
```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/db_toko
    username: root
    password: rahasia
```

**Hafalan:**

```text
application.yaml → format konfigurasi modern hierarkis yang lebih bersih, mudah dibaca, dan bebas pengulangan prefix
```

---

<a id="bagian-14"></a>

## 14. 🟡 Spring Profiles & Multi-Environment Setup

#### Konsep

Aplikasi backend biasanya berjalan di beberapa lingkungan (*environments*): `local`, `dev`, `staging`, dan `prod`. Setiap environment membutuhkan konfigurasi berbeda (misal: database lokal vs database cloud production).

**Spring Profiles** memungkinkan kita:
1. Memisahkan file konfigurasi:
   - `application.yaml` (Konfigurasi umum dasar).
   - `application-dev.yaml` (Konfigurasi khusus development).
   - `application-prod.yaml` (Konfigurasi khusus production).
2. Membatasi Bean agar hanya aktif di profile tertentu: **`@Profile("dev")`** atau **`@Profile("!prod")`**.
3. Mengaktifkan profile aktif:
   - Di file: `spring.profiles.active: dev`
   - Di terminal saat menjalankan jar: `java -jar app.jar --spring.profiles.active=prod`

#### Contoh

```java
package com.belajar.springboot.mail;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

interface EmailSender {
    void kirimEmail(String tujuan, String pesan);
}

// Hanya aktif saat profile 'dev' aktif (Hanya cetak konsol, tidak kirim email sungguhan)
@Service
@Profile("dev")
class FakeEmailSender implements EmailSender {
    @Override
    public void kirimEmail(String tujuan, String pesan) {
        System.out.printf("📧 [DEV FAKE EMAIL] Ke: %s | Pesan: %s%n", tujuan, pesan);
    }
}

// Hanya aktif saat profile 'prod' aktif
@Service
@Profile("prod")
class SmtpRealEmailSender implements EmailSender {
    @Override
    public void kirimEmail(String tujuan, String pesan) {
        System.out.printf("🚀 [PROD REAL SMTP] Mengirim email jaringan ke: %s%n", tujuan);
    }
}
```

**Hafalan:**

```text
@Profile("profileName")       → mengaktifkan bean hanya pada profile tertentu yang sedang aktif
spring.profiles.active=prod   → memilih environment profile yang aktif
```

---

<a id="bagian-15"></a>

## 15. 🟡 Conditional Beans (`@ConditionalOnProperty`, `@ConditionalOnMissingBean`)

#### Konsep

Spring Boot memiliki fitur **Conditional Beans** yang memungkinkan pembuatan Bean secara kondisional berdasarkan ketersediaan properti konfigurasi atau ketersediaan bean lain:

- **`@ConditionalOnProperty(name = "fitur.ai.enabled", havingValue = "true")`:** Bean hanya dibuat jika properti tersebut bernilai `true`.
- **`@ConditionalOnMissingBean(Interface.class)`:** Bean hanya dibuat jika pengguna **belum mendefinisikan custom bean** untuk interface tersebut (pola dasar pembuatan Spring Boot Auto-Configuration).
- **`@ConditionalOnClass(ClassName.class)`:** Bean hanya aktif jika library jar tertentu ada di classpath.

#### Contoh

```java
package com.belajar.springboot.feature;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "app.feature.cashback.enabled", havingValue = "true")
public class CashbackFeatureService {
    public CashbackFeatureService() {
        System.out.println("🎁 Fitur Cashback AKTIF berdasarkan konfigurasi application.yaml!");
    }
}
```

**Hafalan:**

```text
@ConditionalOnProperty(name = "key", havingValue = "val") → mendaftarkan bean hanya jika property sesuai
@ConditionalOnMissingBean(Class.class)                    → mendaftarkan bean fallback jika belum ada bean sejenis
```

---

<a id="bagian-16"></a>

## 16. 🟡 Event Handling di Spring Boot (`@EventListener`)

#### Konsep

Untuk menjaga antar modul aplikasi tetap terpisah bebas (*Decoupled*), Spring menyediakan sistem **Event Handling internal**:
1. **Event Object:** Class POJO / Record yang membawa data kejadian (misal: `OrderCreatedEvent`).
2. **Event Publisher:** Komponen yang memicu kejadian menggunakan **`ApplicationEventPublisher.publishEvent(event)`**.
3. **Event Listener:** Komponen yang mendengarkan dan merespons kejadian secara otomatis menggunakan anotasi **`@EventListener`**.

#### Contoh

```java
package com.belajar.springboot.events;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

// 1. Data Event
record OrderSuccessEvent(String orderId, double totalAmount) {}

// 2. Publisher
@Service
class OrderPlacementService {
    private final ApplicationEventPublisher eventPublisher;

    public OrderPlacementService(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    public void placeOrder(String orderId, double amount) {
        System.out.println("🛒 Pesanan #" + orderId + " berhasil dibuat.");
        // Menerbitkan Event ke seluruh Listener yang terdaftar
        eventPublisher.publishEvent(new OrderSuccessEvent(orderId, amount));
    }
}

// 3. Listener (Modul Notifikasi)
@Component
class OrderNotificationListener {
    @EventListener
    public void onOrderSuccess(OrderSuccessEvent event) {
        System.out.printf("🔔 [EVENT LISTENER] Mengirim struk notifikasi untuk Order #%s senilai Rp %,.2f%n", 
            event.orderId(), event.totalAmount());
    }
}
```

#### Cara Kerja

```text
OrderPlacementService ──(publishEvent)──> Spring Event Bus ──> OrderNotificationListener (@EventListener)
```

**Hafalan:**

```text
eventPublisher.publishEvent(eventObject) → memicu publikasi event internal ke dalam Spring Container
@EventListener                           → menandai method penerima yang otomatis menangkap event
```

---

<a id="bagian-17"></a>

## 17. 🔴 Spring Boot Logging dengan SLF4J & Logback

#### Konsep

Dalam aplikasi enterprise, **DILARANG MENGGUNAKAN `System.out.println()`** karena tidak memiliki level keparahan (*log levels*), tidak memiliki timestamp, dan tidak dapat dialihkan ke file log / cloud monitoring (ELK Stack).

Spring Boot menggunakan **SLF4J (*Simple Logging Facade for Java*)** dengan implementasi default **Logback**.

Tingkat Keparahan Log (dari terendah ke tertinggi):
`TRACE` $\rightarrow$ `DEBUG` $\rightarrow$ `INFO` (Default) $\rightarrow$ `WARN` $\rightarrow$ `ERROR`.

#### Contoh

```java
package com.belajar.springboot.logging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class LogDemoService {
    // Inisialisasi Logger SLF4J
    private static final Logger log = LoggerFactory.getLogger(LogDemoService.class);

    public void prosesData(String input) {
        log.debug("Memulai proses input dengan nilai: {}", input); // Hanya tampil jika log level DEBUG aktif

        if (input == null || input.isBlank()) {
            log.warn("Peringatan: Input kosong diterima!");
            return;
        }

        try {
            log.info("Memproses transaksi untuk user: {}", input);
        } catch (Exception e) {
            log.error("Terjadi kegagalan fatal saat memproses: {}", e.getMessage(), e);
        }
    }
}
```

#### Cara Kerja

Pengaturan Log Level di `application.yaml`:
```yaml
logging:
  level:
    root: INFO
    com.belajar.springboot: DEBUG # Aktifkan DEBUG khusus untuk package aplikasi kita
```

**Hafalan:**

```text
private static final Logger log = LoggerFactory.getLogger(Class.class); → inisialisasi standard logger SLF4J
log.info("Pesan: {}", param);                                           → mencetak log dengan parameter placeholder {}
```

---

<a id="bagian-18"></a>

## 18. 🔴 Runner Interfaces (`CommandLineRunner` & `ApplicationRunner`)

#### Konsep

Seringkali kita perlu menjalankan perintah atau seeding data otomatis **tepat setelah Spring Boot Context selesai dimuat dan seluruh Bean siap**:

1. **`CommandLineRunner`:** Menerima argumen terminal mentah bertipe `String... args`.
2. **`ApplicationRunner`:** Menerima argumen terminal bertipe `ApplicationArguments` (mempermudah pemecahan opsi flag `--nama=nilai`).

Kedua interface ini otomatis dideteksi dan dieksekusi oleh Spring Boot saat aplikasi baru menyala.

#### Contoh

```java
package com.belajar.springboot.runner;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(1) // Urutan eksekusi prioritas pertama
public class StartupSeederRunner implements CommandLineRunner {
    @Override
    public void run(String... args) {
        System.out.println("🚀 [RUNNER] Aplikasi Spring Boot Siap! Menjalankan startup health check...");
    }
}
```

**Hafalan:**

```text
CommandLineRunner  → interface eksekutor logika otomatis saat aplikasi pertama kali selesai booting
@Order(priority)   → mengatur urutan prioritas eksekusi antar Runner (angka terkecil = jalan duluan)
```

---

<a id="bagian-19"></a>

## 19. 🛠️ Peta Ingatan Cepat

```text
                       PETA ARSITEKTUR SPRING BOOT CORE
                                      │
       ┌──────────────────────────────┼──────────────────────────────┐
       ▼                              ▼                              ▼
INVERSION OF CONTROL (IoC)    DEPENDENCY INJECTION (DI)      CONFIG & PROFILES
├─ @SpringBootApplication     ├─ Constructor Injection (Best)├─ application.yaml
├─ ApplicationContext         ├─ @Primary (Default Priority) ├─ @Value ("${key}")
├─ @Component / @Service      ├─ @Qualifier ("beanName")     ├─ @ConfigurationProperties
└─ @Configuration + @Bean     └─ Lifecycle: @PostConstruct   └─ @Profile ("dev"/"prod")
```

---

<a id="bagian-20"></a>

## 20. 📚 Tabel Ringkasan

| Anotasi / Interface | Lokasi Target | Fungsi & Karakteristik Utama |
|---|---|---|
| `@SpringBootApplication` | Main Class | Mengaktifkan Auto-Configuration, Component Scanning, dan Config |
| `@Component` | Class | Mendaftarkan class umum menjadi Spring Bean di Container |
| `@Service` | Class | Mendaftarkan class logika bisnis (*Service Layer*) |
| `@Repository` | Class | Mendaftarkan class akses data/database (*DAO Layer*) |
| `@Configuration` | Class | Class pabrik pembuatan custom bean |
| `@Bean` | Method | Mendaftarkan return value method menjadi Spring Bean |
| `@Primary` | Class / Bean | Menjadikan bean prioritas utama jika ada banyak pilihan |
| `@Qualifier` | Constructor / Param | Memilih bean spesifik berdasarkan nama bean |
| `@PostConstruct` | Method | Dieksekusi otomatis tepat setelah constructor & DI selesai |
| `@PreDestroy` | Method | Dieksekusi otomatis sesaat sebelum aplikasi dimatikan |
| `@ConfigurationProperties`| Class / Record | Mapping grup konfigurasi hierarkis secara type-safe |
| `@Profile` | Class / Bean | Membatasi bean hanya aktif di environment profile tertentu |
| `CommandLineRunner` | Interface Class | Menjalankan logika konsol otomatis saat startup selesai |

---

<a id="bagian-21"></a>

## 21. ⚡ Cheat Code Spring Boot Dasar 10 Detik

```java
// 1. Template Standard Service dengan Constructor Injection
@Service
public class OrderService {
    private final PaymentGateway paymentGateway;
    private final NotificationService notificationService;

    public OrderService(PaymentGateway paymentGateway, NotificationService notificationService) {
        this.paymentGateway = paymentGateway;
        this.notificationService = notificationService;
    }
}

// 2. Template Custom Third-Party Bean
@Configuration
public class JacksonConfig {
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}

// 3. Template ConfigurationProperties Record (Java 21)
@ConfigurationProperties(prefix = "app.security")
public record SecurityProperties(String jwtSecret, long expirationMs) {}
```

---

<a id="bagian-22"></a>

## 22. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Pahami Mental Model IoC & Stereotypes
├── Pahami mengapa tidak boleh menggunakan 'new' manual
└── Kuasai perbedaan @Component, @Service, @Repository, dan @Configuration
       │
       ▼
Langkah 2: Kuasai Constructor-based Dependency Injection
├── Deklarasikan field sebagai 'private final'
└── Pelajari cara mengatasi ambiguitas bean dengan @Primary dan @Qualifier
       │
       ▼
Langkah 3: Kuasai Manajemen Konfigurasi
├── Gunakan application.yaml
├── Hindari @Value berlebihan, gunakan @ConfigurationProperties (Type-Safe)
└── Kuasai multi-environment dengan Spring Profiles (@Profile)
       │
       ▼
Langkah 4: Kuasai Observability & Event Decoupling
├── Ganti System.out dengan Logger SLF4J
└── Manfaatkan ApplicationEventPublisher & @EventListener
       │
       ▼
Langkah 5: Siap Melangkah ke Spring Boot Web (REST API) & Spring Data JPA!
```

---

<a id="bagian-23"></a>

## 23. 🏗️ Mini Project: Production-Ready Modular Order Notification & Discount Engine CLI

Aplikasi Spring Boot Core lengkap dan runnable yang mengintegrasikan: **Constructor Injection, Multiple Profiles, `@ConfigurationProperties`, Event Listener, Custom Third-Party Bean, SLF4J Logging, dan `CommandLineRunner`**.

```java
package com.belajar.store;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.List;

// 1. Type-Safe Configuration Properties (Record)
@ConfigurationProperties(prefix = "store.discount")
record DiscountProperties(double minOrderAmount, double discountPercentage, boolean promoActive) {}

// 2. Third-Party Utility Configuration
@Configuration
@EnableConfigurationProperties(DiscountProperties.class)
class StoreAppConfig {
    @Bean
    public DecimalFormat rupiahFormatter() {
        return new DecimalFormat("Rp #,##0.00");
    }
}

// 3. Domain Event
record OrderCompletedEvent(String orderId, String customer, double finalAmount) {}

// 4. Notification Channel Interface
interface NotificationService {
    void notifyCustomer(String customer, String message);
}

// Implementasi Dev Profile (Mock Console)
@Service
@Profile("dev")
class DevNotificationService implements NotificationService {
    private static final Logger log = LoggerFactory.getLogger(DevNotificationService.class);

    @Override
    public void notifyCustomer(String customer, String message) {
        log.info("🧪 [DEV NOTIFICATION] Kepada: {} | Isi: {}", customer, message);
    }
}

// Implementasi Prod Profile (Simulasi Gateway Nyata)
@Service
@Profile("prod")
class ProdNotificationService implements NotificationService {
    private static final Logger log = LoggerFactory.getLogger(ProdNotificationService.class);

    @Override
    public void notifyCustomer(String customer, String message) {
        log.info("🚀 [PROD SMS GATEWAY] Mengirim SMS ke: {} | {}", customer, message);
    }
}

// 5. Discount Engine Service (Constructor Injection)
@Service
class DiscountEngineService {
    private final DiscountProperties discountProps;

    public DiscountEngineService(DiscountProperties discountProps) {
        this.discountProps = discountProps;
    }

    public double calculateDiscount(double subtotal) {
        if (discountProps.promoActive() && subtotal >= discountProps.minOrderAmount()) {
            return subtotal * (discountProps.discountPercentage() / 100.0);
        }
        return 0.0;
    }
}

// 6. Order Processing Service (Event Publisher)
@Service
class OrderEngineService {
    private static final Logger log = LoggerFactory.getLogger(OrderEngineService.class);

    private final DiscountEngineService discountEngine;
    private final ApplicationEventPublisher eventPublisher;
    private final DecimalFormat rupiahFormatter;

    public OrderEngineService(
        DiscountEngineService discountEngine,
        ApplicationEventPublisher eventPublisher,
        DecimalFormat rupiahFormatter
    ) {
        this.discountEngine = discountEngine;
        this.eventPublisher = eventPublisher;
        this.rupiahFormatter = rupiahFormatter;
    }

    public void checkout(String orderId, String customer, double subtotal) {
        log.info("Memproses checkout pesanan: {} untuk {}", orderId, customer);

        double diskon = discountEngine.calculateDiscount(subtotal);
        double totalAkhir = subtotal - diskon;

        log.info("Subtotal: {} | Diskon: {} | Total Akhir: {}", 
            rupiahFormatter.format(subtotal), 
            rupiahFormatter.format(diskon), 
            rupiahFormatter.format(totalAkhir));

        // Menerbitkan Event
        eventPublisher.publishEvent(new OrderCompletedEvent(orderId, customer, totalAkhir));
    }
}

// 7. Event Listener (Decoupled Notification Handler)
@Component
class OrderEventListener {
    private final NotificationService notificationService;
    private final DecimalFormat rupiahFormatter;

    public OrderEventListener(NotificationService notificationService, DecimalFormat rupiahFormatter) {
        this.notificationService = notificationService;
        this.rupiahFormatter = rupiahFormatter;
    }

    @EventListener
    public void onOrderCompleted(OrderCompletedEvent event) {
        String pesan = String.format("Pesanan Anda #%s sebesar %s telah berhasil diproses!", 
            event.orderId(), rupiahFormatter.format(event.finalAmount()));
        notificationService.notifyCustomer(event.customer(), pesan);
    }
}

// 8. Main Application & Startup Runner
@SpringBootApplication
public class StoreApplication {
    public static void main(String[] args) {
        SpringApplication.run(StoreApplication.class, args);
    }

    @Bean
    public CommandLineRunner demoRunner(OrderEngineService orderService) {
        return args -> {
            System.out.println("\n==================================================");
            System.out.println("   MODULAR ORDER & DISCOUNT ENGINE SPRING BOOT    ");
            System.out.println("==================================================");

            // Simulasi Order 1 (Dapat Diskon)
            orderService.checkout("ORD-001", "Budi Santoso", 750_000.0);

            // Simulasi Order 2 (Tanpa Diskon)
            orderService.checkout("ORD-002", "Siti Nurhaliza", 200_000.0);

            System.out.println("==================================================\n");
        };
    }
}
```

#### Output Demonstrasi (Profile `dev`)

```text
2026-08-29T19:30:00.120+07:00  INFO 12345 --- [main] c.b.s.StoreApplication: Starting StoreApplication using Java 21

==================================================
   MODULAR ORDER & DISCOUNT ENGINE SPRING BOOT    
==================================================
2026-08-29T19:30:00.450+07:00  INFO 12345 --- [main] c.b.s.OrderEngineService: Memproses checkout pesanan: ORD-001 untuk Budi Santoso
2026-08-29T19:30:00.452+07:00  INFO 12345 --- [main] c.b.s.OrderEngineService: Subtotal: Rp 750,000.00 | Diskon: Rp 75,000.00 | Total Akhir: Rp 675,000.00
2026-08-29T19:30:00.455+07:00  INFO 12345 --- [main] c.b.s.DevNotificationService: 🧪 [DEV NOTIFICATION] Kepada: Budi Santoso | Isi: Pesanan Anda #ORD-001 sebesar Rp 675,000.00 telah berhasil diproses!

2026-08-29T19:30:00.458+07:00  INFO 12345 --- [main] c.b.s.OrderEngineService: Memproses checkout pesanan: ORD-002 untuk Siti Nurhaliza
2026-08-29T19:30:00.459+07:00  INFO 12345 --- [main] c.b.s.OrderEngineService: Subtotal: Rp 200,000.00 | Diskon: Rp 0.00 | Total Akhir: Rp 200,000.00
2026-08-29T19:30:00.460+07:00  INFO 12345 --- [main] c.b.s.DevNotificationService: 🧪 [DEV NOTIFICATION] Kepada: Siti Nurhaliza | Isi: Pesanan Anda #ORD-002 sebesar Rp 200,000.00 telah berhasil diproses!
==================================================
```

---

<a id="bagian-24"></a>

## 24. 🔗 Referensi Resmi

- [Spring Initializr (Project Generator)](https://start.spring.io)
- [Spring Boot 3.3 Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Framework Core Technologies (IoC Container)](https://docs.spring.io/spring-framework/reference/core.html)
- [Baeldung Spring Boot Tutorials](https://www.baeldung.com/spring-boot)
