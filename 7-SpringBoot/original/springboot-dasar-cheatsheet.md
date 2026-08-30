# Spring Boot Dasar Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Spring Boot 3.3+ (Java 21 LTS) untuk pemula yang ingin memahami konsep dasar Inversion of Control (IoC), Dependency Injection (DI), Spring Beans, ApplicationContext, dan Configuration Properties. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> Spring Boot adalah framework Java berbasis enterprise yang mempermudah pembuatan aplikasi siap produksi (*production-ready*) dengan pendekatan *convention-over-configuration* dan server embedded bawaan (Tomcat).

## Daftar Isi

1. [Pengenalan Spring Boot & IoC](#1-pengenalan-spring-boot--ioc)
2. [Anotasi @SpringBootApplication](#2-anotasi-springbootapplication)
3. [Spring Bean & Stereotype](#3-spring-bean--stereotype)
4. [Configuration & @Bean](#4-configuration--bean)
5. [Dependency Injection](#5-dependency-injection)
6. [Primary & Qualifier](#6-primary--qualifier)
7. [Bean Lifecycle](#7-bean-lifecycle)
8. [Bean Scopes](#8-bean-scopes)
9. [@Value](#9-value)
10. [ConfigurationProperties](#10-configurationproperties)
11. [Spring Profiles](#11-spring-profiles)
12. [CommandLineRunner](#12-commandlinerunner)

---

# 1. Pengenalan Spring Boot & IoC

Inversion of Control (IoC) memindahkan kendali pembuatan objek dari programmer ke Spring IoC Container.

```text
Programmer tidak lagi memanggil 'new ServiceImpl()', Spring yang membuat dan mengelolanya.
```

---

# 2. Anotasi @SpringBootApplication

Entry point aplikasi Spring Boot yang menggabungkan `@SpringBootConfiguration`, `@EnableAutoConfiguration`, dan `@ComponentScan`.

```java
@SpringBootApplication
public class BelajarSpringBootApplication {
    public static void main(String[] args) {
        SpringApplication.run(BelajarSpringBootApplication.class, args);
    }
}
```

---

# 3. Spring Bean & Stereotype

Class yang ditandai agar otomatis diinstansiasi dan dikelola oleh Spring Container.

- `@Component` : Komponen umum.
- `@Service` : Menampung business logic.
- `@Repository` : Mengakses database.
- `@Controller` / `@RestController` : Menangani HTTP request.

```java
@Service
public class OrderService {
    public String getInfo() { return "Order Service Aktif"; }
}
```

---

# 4. Configuration & @Bean

Digunakan untuk mendaftarkan instance class eksternal atau custom library ke dalam IoC container.

```java
@Configuration
public class AppConfig {
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
```

---

# 5. Dependency Injection

Cara Spring menyuntikkan ketergantungan bean ke bean lain. **Constructor Injection adalah best practice resmi**.

```java
@Service
public class PaymentService {
    private final OrderService orderService;

    // Constructor Injection (Tanpa perlu @Autowired eksplisit jika constructor cuma 1)
    public PaymentService(OrderService orderService) {
        this.orderService = orderService;
    }
}
```

---

# 6. Primary & Qualifier

- `@Primary` : Menentukan bean utama saat ada beberapa pilihan interface yang sama.
- `@Qualifier("beanName")` : Memilih bean spesifik berdasarkan nama.

```java
@Service
public class NotificationService {
    private final MessageSender sender;

    public NotificationService(@Qualifier("emailSender") MessageSender sender) {
        this.sender = sender;
    }
}
```

---

# 7. Bean Lifecycle

- `@PostConstruct` : Dieksekusi otomatis setelah bean selesai diinstansiasi dan di-inject.
- `@PreDestroy` : Dieksekusi otomatis sesaat sebelum aplikasi dimatikan.

```java
@Component
public class CacheManager {
    @PostConstruct
    public void init() { System.out.println("Cache dihangatkan..."); }

    @PreDestroy
    public void cleanup() { System.out.println("Cache dibersihkan."); }
}
```

---

# 8. Bean Scopes

- `singleton` (Default): Hanya ada tepat 1 instance di seluruh aplikasi.
- `prototype` : Instance baru selalu dibuat setiap kali di-inject.

```java
@Component
@Scope("prototype")
public class TokenGenerator {}
```

---

# 9. @Value

Mengambil nilai konfigurasi dari `application.properties` / `application.yaml`.

```java
@Component
public class AppInfo {
    @Value("${app.name:DefaultApp}")
    private String appName;
}
```

---

# 10. ConfigurationProperties

Mapping konfigurasi hierarkis ke dalam POJO / Record Java secara type-safe.

```java
@ConfigurationProperties(prefix = "app.mail")
public record MailProperties(String host, int port, String username) {}
```

---

# 11. Spring Profiles

Mengatur konfigurasi berbeda untuk setiap environment (`dev`, `staging`, `prod`).

```java
@Service
@Profile("dev")
public class DevPaymentService implements PaymentService {}
```

---

# 12. CommandLineRunner

Interface untuk mengeksekusi kode konsol otomatis tepat saat Spring Boot selesai menyala.

```java
@Component
public class AppRunner implements CommandLineRunner {
    @Override
    public void run(String... args) {
        System.out.println("Aplikasi Spring Boot Berhasil Berjalan!");
    }
}
```
