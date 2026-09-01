---
title: "Spring Boot Web & REST API"
description: "Membangun RESTful API dengan Spring Boot Web: @RestController, Request Mapping, DTO validation, ResponseEntity, Global Exception Handling, dan Content Negotiation."
order: 2
tags:
  - web-development
  - backend
  - spring-boot
  - rest-api
  - web
---

# Spring Boot Web & REST API

> **Target:** Pemula yang telah memahami dasar Spring Boot Core (IoC, DI, Bean, Configuration), serta ingin membangun **RESTful API backend kelas industri** yang cepat, aman, terstruktur, dan tervalidasi menggunakan **Spring Boot 3.3+ (Spring Web MVC & Java 21 LTS)**.
>
> Fokus cheatsheet ini: **DispatcherServlet mental model → `@RestController` vs `@Controller` → Request Mapping (`@GetMapping`, `@PostMapping`, `@PutMapping`, `@PatchMapping`, `@DeleteMapping`) → `@PathVariable` & `@RequestParam` → `@RequestBody` & Java Record DTO → `ResponseEntity<T>` & Standar Envelope `ApiResponse<T>` → Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@Size`, `@Email`) → Custom Validator → Global Exception Handling (`@RestControllerAdvice`, RFC 7807 Problem Details) → CORS Configuration → Multipart File Upload → HandlerInterceptor → Jackson Customization → mini project e-commerce RESTful API**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: DispatcherServlet, @RestController, Request Mapping, @PathVariable, @RequestParam, @RequestBody, dan ResponseEntity

🟡 Lanjutan
→ pelajari setelah request handling dasar: Standard ApiResponse Envelope, Jakarta Validation (@Valid), @RestControllerAdvice, RFC 7807, dan CORS

🔴 Advanced / Operasional
→ penting untuk arsitektur production: Custom Interceptors, Multipart File Upload, dan kustomisasi JSON Jackson
```

Mental model alur pemrosesan HTTP Request di Spring Web MVC:

```text
               Browser / Mobile App / Frontend (Postman)
                                │
                                ▼  HTTP Request (JSON / Params)
                     Tomcat Embedded Server
                                │
                                ▼
                       DispatcherServlet
                        (Front Controller)
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
          HandlerMapping                HandlerAdapter
        (Cari Controller)            (Validasi @Valid & DTO)
                 │                             │
                 └──────────────┬──────────────┘
                                │
                                ▼
                      @RestController Method
                                │
                                ▼  Return Data Object
                      HttpMessageConverter
                   (Jackson: Java Object ──> JSON)
                                │
                                ▼  HTTP 200 / 201 Response JSON
                            Frontend
```

**Hafalan:**

```text
DispatcherServlet     → Front Controller sentral Spring Web yang menerima semua HTTP request dan meneruskannya ke controller yang tepat
@RestController       → penanda controller REST API yang otomatis mengubah return value Java Object menjadi JSON Response via Jackson
@RequestBody          → mengambil payload JSON dari body request dan mengubahnya menjadi objek/record DTO
ResponseEntity<T>     → wrapper lengkap response HTTP yang mencakup status code, header, dan body
@Valid                → memicu validasi otomatis Jakarta Bean Validation pada payload DTO sebelum method controller dieksekusi
@RestControllerAdvice → penangkap error dan exception global terpusat dari seluruh controller di aplikasi
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Spring Web MVC & Mental Model `DispatcherServlet`](#bagian-1)
2. [`@Controller` vs `@RestController`](#bagian-2)
3. [HTTP Request Mapping Modern (`@GetMapping`, `@PostMapping`, dll.)](#bagian-3)
4. [Menangkap Path Parameter dengan `@PathVariable`](#bagian-4)
5. [Menangkap Query Parameter dengan `@RequestParam`](#bagian-5)
6. [Menerima Payload JSON dengan `@RequestBody` & Java Record DTO](#bagian-6)
7. [Membaca Request Headers & Cookies](#bagian-7)
8. [Response Formatting dengan `ResponseEntity<T>` & HTTP Status](#bagian-8)

### 🟡 Lanjutan

9. [Standar Envelope API Response Wrapper (`ApiResponse<T>`)](#bagian-9)
10. [Validasi Request Otomatis dengan Jakarta Bean Validation](#bagian-10)
11. [Custom Validator Anotasi (`@Constraint` & `ConstraintValidator`)](#bagian-11)
12. [Global Exception Handling dengan `@RestControllerAdvice` & `@ExceptionHandler`](#bagian-12)
13. [Standar Error Modern RFC 7807 (Problem Details for HTTP APIs)](#bagian-13)
14. [Validasi Error Handler: Menangkap `MethodArgumentNotValidException`](#bagian-14)
15. [CORS Configuration (Cross-Origin Resource Sharing)](#bagian-15)
16. [File Upload & Download (`MultipartFile`)](#bagian-16)

### 🔴 Advanced / Operasional

17. [Custom HTTP Interceptor (`HandlerInterceptor`)](#bagian-17)
18. [Kustomisasi Serialisasi JSON Jackson (`@JsonProperty`, `@JsonIgnore`)](#bagian-18)

### 🛠️ Referensi & Praktik

19. [Peta Ingatan Cepat](#bagian-19)
20. [Tabel Ringkasan](#bagian-20)
21. [Cheat Code Spring Boot Web 10 Detik](#bagian-21)
22. [Urutan Belajar yang Disarankan](#bagian-22)
23. [Mini Project: Production-Ready E-Commerce Product & Order RESTful API](#bagian-23)
24. [Referensi Resmi](#bagian-24)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan Spring Web MVC & Mental Model `DispatcherServlet`

#### Konsep

Spring Web MVC dibangun di atas pola desain **Front Controller**, di mana satu servlet utama bernama **`DispatcherServlet`** menerima seluruh lalu lintas HTTP request yang masuk ke aplikasi.

Tahapan Siklus Request di Spring Web:
1. Client mengirim HTTP Request ke server.
2. `DispatcherServlet` menerima request dan berkonsultasi ke `HandlerMapping` untuk menemukan Controller dan Method mana yang cocok dengan URL dan HTTP Method tersebut.
3. `HandlerAdapter` mengeksekusi method controller (sambil melakukan parsing parameter, deserialisasi JSON, dan validasi data).
4. Method Controller memproses request melalui Service Layer dan mengembalikan data (Model / DTO).
5. `HttpMessageConverter` (Jackson) mengubah Objek Java menjadi teks JSON dan mengirimkannya kembali ke Client.

#### Cara Kerja

```text
HTTP GET /api/users/10
          │
          ▼
   DispatcherServlet
          │
          ├──> HandlerMapping (Cocokkan ke UserController.getById)
          ├──> Deserializer (Konversi ID ke Long)
          │
          ▼
   UserController.getById(10) ──> Return UserDTO
          │
          ▼
   Jackson JSON Converter ──> {"id": 10, "name": "Budi"} ──> HTTP 200 OK
```

**Hafalan:**

```text
DispatcherServlet → gerbang utama penerima seluruh HTTP request yang mengoordinasikan mapping, validasi, dan rendering response
```

---

<a id="bagian-2"></a>

## 2. 🟢 `@Controller` vs `@RestController`

#### Konsep

Terdapat dua anotasi utama untuk mendefinisikan controller di Spring Web:

1. **`@Controller` (Monolith Web / Server-Side Rendering):**
   - Mengembalikan nama view template HTML (misal: Thymeleaf `index.html` atau JSP).
   - Jika ingin mengembalikan data JSON mentah, setiap method wajib diberi anotasi tambahan `@ResponseBody`.
2. **`@RestController` (Modern RESTful API / Headless Backend):**
   - Gabungan dari `@Controller` + `@ResponseBody`.
   - Seluruh method otomatis mengembalikan data mentah (Java Object yang langsung diserialisasikan ke format JSON oleh Jackson).

#### Contoh

```java
package com.belajar.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/status")
public class SystemStatusController {

    @GetMapping
    public Map<String, Object> checkStatus() {
        // Otomatis diserialisasi menjadi JSON oleh Spring Boot
        return Map.of(
            "app", "Store API Server",
            "version", "3.3.0",
            "status", "UP",
            "timestamp", System.currentTimeMillis()
        );
    }
}
```

#### Output

```json
{
  "app": "Store API Server",
  "version": "3.3.0",
  "status": "UP",
  "timestamp": 1724936000000
}
```

**Hafalan:**

```text
@RestController = @Controller + @ResponseBody → menandai class sebagai REST Controller yang selalu mengembalikan JSON
```

---

<a id="bagian-3"></a>

## 3. 🟢 HTTP Request Mapping Modern (`@GetMapping`, `@PostMapping`, dll.)

#### Konsep

RESTful API menggunakan kata kerja HTTP standar (*HTTP Verbs*) untuk menentukan aksi yang dilakukan pada resource:

| HTTP Method | Spring Anotasi | Kegunaan RESTful Standar | Contoh Endpoint |
|---|---|---|---|
| **GET** | `@GetMapping` | Mengambil / membaca data (*Read*) | `GET /api/products` |
| **POST** | `@PostMapping` | Membuat resource baru (*Create*) | `POST /api/products` |
| **PUT** | `@PutMapping` | Mengganti seluruh data resource (*Full Replace*) | `PUT /api/products/1` |
| **PATCH** | `@PatchMapping` | Mengubah sebagian atribut (*Partial Update*) | `PATCH /api/products/1` |
| **DELETE** | `@DeleteMapping` | Menghapus data resource (*Delete*) | `DELETE /api/products/1` |

Anotasi **`@RequestMapping("/base-path")`** di level class digunakan untuk menetapkan prefix URL bersama untuk seluruh method di dalam controller tersebut.

#### Contoh

```java
package com.belajar.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products") // Base URL: /api/products
public class ProductCrudController {

    @GetMapping // GET /api/products
    public List<String> getAll() { return List.of("Laptop", "Mouse"); }

    @GetMapping("/{id}") // GET /api/products/{id}
    public String getById(@PathVariable Long id) { return "Produk #" + id; }

    @PostMapping // POST /api/products
    public String create() { return "Produk Berhasil Dibuat"; }

    @PutMapping("/{id}") // PUT /api/products/{id}
    public String updateFull(@PathVariable Long id) { return "Produk #" + id + " Diganti Total"; }

    @DeleteMapping("/{id}") // DELETE /api/products/{id}
    public String delete(@PathVariable Long id) { return "Produk #" + id + " Dihapus"; }
}
```

**Hafalan:**

```text
@RequestMapping(path)  → menetapkan base URL path di level class controller
@GetMapping(path)      → menangani HTTP request GET
@PostMapping(path)     → menangani HTTP request POST
@PutMapping(path)      → menangani HTTP request PUT
@DeleteMapping(path)   → menangani HTTP request DELETE
```

---

<a id="bagian-4"></a>

## 4. 🟢 Menangkap Path Parameter dengan `@PathVariable`

#### Konsep

**Path Variable** digunakan untuk menangkap nilai dinamis yang disematkan langsung di dalam segmen URL path (biasanya berupa ID unik resource atau slug).

Format segmen URL diapit kurung kurawal: `{namaVariable}`.

Parameter method controller ditandai dengan **`@PathVariable("namaVariable") T param`**. Jika nama parameter Java sama persis dengan nama di URL, atribut string di dalam anotasi boleh dihilangkan.

#### Contoh

```java
package com.belajar.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    // Contoh URL: /api/categories/elektronik/items/105
    @GetMapping("/{categorySlug}/items/{itemId}")
    public Map<String, Object> getItemByCategory(
        @PathVariable String categorySlug,
        @PathVariable Long itemId
    ) {
        return Map.of(
            "category", categorySlug,
            "itemId", itemId,
            "status", "Ditemukan"
        );
    }
}
```

#### Output

Request: `GET /api/categories/elektronik/items/105`
```json
{
  "category": "elektronik",
  "itemId": 105,
  "status": "Ditemukan"
}
```

**Hafalan:**

```text
@PathVariable(name) → mengekstrak parameter nilai dinamis dari segmen URL path
```

---

<a id="bagian-5"></a>

## 5. 🟢 Menangkap Query Parameter dengan `@RequestParam`

#### Konsep

**Query Parameter** digunakan untuk menyaring (*filter*), mengurutkan (*sort*), mencari (*search*), atau membagi halaman (*pagination*) data. Parameter ini berada di akhir URL setelah tanda tanya `?key=value&key2=value2`.

Atribut penting `@RequestParam`:
- `name` / `value` : Nama query parameter di URL.
- `required` : Menentukan apakah parameter wajib ada (default: `true`).
- `defaultValue` : Nilai cadangan jika client tidak mengirim query parameter tersebut.

#### Contoh

```java
package com.belajar.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    // Contoh URL: /api/search?keyword=laptop&page=2&limit=20
    @GetMapping
    public Map<String, Object> searchProducts(
        @RequestParam(name = "keyword", required = false) String keyword,
        @RequestParam(name = "page", defaultValue = "1") int page,
        @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        return Map.of(
            "keyword", (keyword != null ? keyword : "SEMUA"),
            "page", page,
            "limit", limit
        );
    }
}
```

#### Output

Request: `GET /api/search?keyword=laptop&page=2`
```json
{
  "keyword": "laptop",
  "page": 2,
  "limit": 10
}
```

**Hafalan:**

```text
@RequestParam(name = "key", defaultValue = "val") → mengambil query string parameter dari URL
```

---

<a id="bagian-6"></a>

## 6. 🟢 Menerima Payload JSON dengan `@RequestBody` & Java Record DTO

#### Konsep

Pada request `POST`, `PUT`, atau `PATCH`, client biasanya mengirimkan data berstruktur kompleks di dalam **HTTP Request Body** berformat JSON.

Anotasi **`@RequestBody`** menginstruksikan Spring untuk membaca data JSON body dan melakukan deserialisasi otomatis menjadi objek Java.

Di era Java Modern (Java 21 LTS), **Java Record** adalah standar terbaik untuk **Data Transfer Object (DTO)** karena:
1. **Immutable:** Bebas dari efek mutasi data liar.
2. **Ringkas:** Bebas boilerplate getter, setter, `equals`, dan `hashCode`.

#### Contoh

```java
package com.belajar.dto;

import java.util.List;

// Definisi DTO menggunakan Java Record
public record CreateOrderRequest(
    String customerId,
    List<String> itemSkus,
    String paymentMethod
) {}
```

Controller:
```java
package com.belajar.controller;

import com.belajar.dto.CreateOrderRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @PostMapping
    public Map<String, Object> createOrder(@RequestBody CreateOrderRequest request) {
        return Map.of(
            "orderId", "ORD-" + System.currentTimeMillis(),
            "customer", request.customerId(),
            "itemCount", request.itemSkus().size(),
            "status", "PENDING_PAYMENT"
        );
    }
}
```

#### Output

Request: `POST /api/orders`
```json
{
  "customerId": "CUST-001",
  "itemSkus": ["SKU-A", "SKU-B"],
  "paymentMethod": "QRIS"
}
```
Response:
```json
{
  "orderId": "ORD-1724936500000",
  "customer": "CUST-001",
  "itemCount": 2,
  "status": "PENDING_PAYMENT"
}
```

**Hafalan:**

```text
@RequestBody TargetRecordDTO request → membaca dan memetakan JSON request body ke objek DTO
```

---

<a id="bagian-7"></a>

## 7. 🟢 Membaca Request Headers & Cookies

#### Konsep

Seringkali kita perlu membaca metadata request seperti token otorisasi, API key, atau tracking cookie:
- **`@RequestHeader("Header-Name")`:** Membaca header HTTP (misal: `Authorization`, `X-Api-Key`).
- **`@CookieValue("cookieName")`:** Membaca cookie HTTP tertentu dari browser.

#### Contoh

```java
package com.belajar.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/secure")
public class SecureHeaderController {

    @GetMapping("/profile")
    public Map<String, String> getProfile(
        @RequestHeader("Authorization") String authHeader,
        @RequestHeader(name = "X-Client-Version", defaultValue = "1.0.0") String clientVersion,
        @CookieValue(name = "sessionId", defaultValue = "ANONYMOUS") String sessionId
    ) {
        return Map.of(
            "auth", authHeader,
            "version", clientVersion,
            "session", sessionId
        );
    }
}
```

**Hafalan:**

```text
@RequestHeader("Header-Name") → mengekstrak nilai header HTTP request tertentu
@CookieValue("cookieName")    → mengekstrak nilai cookie HTTP tertentu
```

---

<a id="bagian-8"></a>

## 8. 🟢 Response Formatting dengan `ResponseEntity<T>` & HTTP Status

#### Konsep

Secara default, jika method controller mengembalikan objek langsung, Spring akan merespons dengan HTTP Status `200 OK`.

Namun, RESTful API yang baik harus mengembalikan **HTTP Status Code yang akurat**:
- `200 OK` : Permintaan berhasil (GET, PUT, PATCH).
- `201 CREATED` : Resource baru berhasil diciptakan (POST).
- `204 NO CONTENT` : Berhasil tanpa return body (DELETE).
- `400 BAD REQUEST` : Request client tidak valid atau gagal validasi.
- `404 NOT FOUND` : Resource tidak ditemukan.

Gunakan **`ResponseEntity<T>`** untuk mengontrol status code, custom headers, dan response body secara fleksibel.

#### Contoh

```java
package com.belajar.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
public class ItemResponseController {

    @PostMapping
    public ResponseEntity<Map<String, Object>> createItem(@RequestBody Map<String, String> payload) {
        Map<String, Object> data = Map.of("id", 101, "name", payload.get("name"));

        // Mengembalikan HTTP Status 201 CREATED dengan Header Custom
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Custom-Header", "ItemCreatedSuccess");

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .headers(headers)
            .body(data);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        // Mengembalikan HTTP Status 204 NO CONTENT
        return ResponseEntity.noContent().build();
    }
}
```

**Hafalan:**

```text
ResponseEntity.ok(body)                  → menghasilkan response HTTP 200 OK dengan body
ResponseEntity.status(HttpStatus.CREATED)→ menghasilkan response HTTP 201 Created
ResponseEntity.noContent().build()       → menghasilkan response HTTP 204 No Content tanpa body
```

---

<a id="bagian-9"></a>

## 9. 🟡 Standar Envelope API Response Wrapper (`ApiResponse<T>`)

#### Konsep

Dalam standar API enterprise, response JSON selalu dibungkus ke dalam format terstandarisasi (**API Envelope Pattern**) agar tim frontend (Vue, React, Flutter) memiliki struktur seragam untuk memproses data maupun error.

Struktur standar ApiResponse:
```json
{
  "code": 200,
  "status": "SUCCESS",
  "message": "Data produk berhasil diambil",
  "data": { ... },
  "errors": null
}
```

#### Contoh

Definisi Generic Record Wrapper:
```java
package com.belajar.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL) // Sembunyikan field null di JSON output
public record ApiResponse<T>(
    int code,
    String status,
    String message,
    T data,
    Object errors
) {
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(200, "SUCCESS", message, data, null);
    }

    public static <T> ApiResponse<T> created(T data, String message) {
        return new ApiResponse<>(201, "CREATED", message, data, null);
    }

    public static <T> ApiResponse<T> error(int code, String message, Object errors) {
        return new ApiResponse<>(code, "ERROR", message, null, errors);
    }
}
```

Penggunaan di Controller:
```java
@GetMapping("/products/{id}")
public ResponseEntity<ApiResponse<ProductDto>> getProduct(@PathVariable Long id) {
    ProductDto product = productService.findById(id);
    return ResponseEntity.ok(ApiResponse.success(product, "Data produk berhasil ditemukan"));
}
```

**Hafalan:**

```text
ApiResponse<T> → pola wrapper seragam untuk struktur response JSON di seluruh endpoint aplikasi
```

---

<a id="bagian-10"></a>

## 10. 🟡 Validasi Request Otomatis dengan Jakarta Bean Validation

#### Konsep

Alih-alih menulis `if (name == null || name.isBlank())` manual di Controller/Service, gunakan **Jakarta Bean Validation** (starter `spring-boot-starter-validation`).

Anotasi Validasi Populer:
- `@NotNull` : Nilai tidak boleh `null`.
- `@NotEmpty` : String/Collection tidak boleh null dan tidak boleh kosong (size > 0).
- `@NotBlank` : String tidak boleh null dan tidak boleh hanya berisi spasi kosong (`"   "`).
- `@Size(min = 3, max = 50)` : Membatasi panjang teks atau ukuran koleksi.
- `@Min(1)` / `@Max(100)` : Batas angka minimum dan maksimum.
- `@Email` : Memvalidasi format alamat email standar.
- `@Pattern(regexp = "...")` : Memvalidasi pola Regex (misal: nomor telepon).

Tambahkan anotasi **`@Valid`** pada parameter `@RequestBody` di Controller untuk memicu validasi. Jika validasi gagal, Spring akan otomatis melempar **`MethodArgumentNotValidException`**.

#### Contoh

```java
package com.belajar.dto;

import jakarta.validation.constraints.*;

public record CreateCustomerRequest(
    @NotBlank(message = "Nama customer wajib diisi")
    @Size(min = 3, max = 100, message = "Nama harus antara 3 hingga 100 karakter")
    String name,

    @NotBlank(message = "Email wajib diisi")
    @Email(message = "Format email tidak valid")
    String email,

    @NotNull(message = "Umur wajib diisi")
    @Min(value = 17, message = "Umur minimal 17 tahun")
    @Max(value = 100, message = "Umur maksimal 100 tahun")
    Integer age
) {}
```

Controller:
```java
@PostMapping("/customers")
public ResponseEntity<ApiResponse<String>> createCustomer(@Valid @RequestBody CreateCustomerRequest req) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.created(req.name(), "Customer berhasil didaftarkan"));
}
```

**Hafalan:**

```text
@Valid @RequestBody TargetDTO request → mengaktifkan validasi otomatis sebelum masuk ke badan controller
@NotBlank(message = "...")            → validasi teks tidak boleh kosong atau spasi
```

---

<a id="bagian-11"></a>

## 11. 🟡 Custom Validator Anotasi (`@Constraint` & `ConstraintValidator`)

#### Konsep

Jika aturan validasi bisnis Anda tidak tersedia di Jakarta Validation bawaan (misal: memvalidasi nomor plat kendaraan Indonesia atau format kode voucher promo khusus), Anda dapat membuat **Custom Validation Annotation**.

Langkah Pembuatan:
1. Buat anotasi dengan target `FIELD` dan referensikan class validator via `@Constraint(validatedBy = ...)`.
2. Buat class implementasi yang mengimplementasikan `ConstraintValidator<Annotation, T>`.

#### Contoh

```java
package com.belajar.validation;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import java.lang.annotation.*;

// 1. Deklarasi Anotasi
@Documented
@Constraint(validatedBy = VoucherCodeValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidVoucherCode {
    String message() default "Kode voucher harus berawalan 'PROMO-' diikuti huruf besar";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

// 2. Class Logika Validator
class VoucherCodeValidator implements ConstraintValidator<ValidVoucherCode, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true; // Biarkan @NotBlank yang menangani jika wajib diisi
        }
        return value.startsWith("PROMO-") && value.toUpperCase().equals(value);
    }
}
```

**Hafalan:**

```text
@Constraint(validatedBy = CustomValidator.class) → menghubungkan anotasi kustom dengan logika validatornya
```

---

<a id="bagian-12"></a>

## 12. 🟡 Global Exception Handling dengan `@RestControllerAdvice` & `@ExceptionHandler`

#### Konsep

Tanpa penanganan error global, jika terjadi exception yang tidak tertangkap di Service, Spring Boot akan mengembalikan *Whitelabel Error Page* HTML atau stack trace acak yang berbahaya bagi keamanan.

**`@RestControllerAdvice`**:
- Bekerja sebagai interceptor penangkap exception global untuk seluruh Controller di aplikasi.
- Menggunakan method beranotasi **`@ExceptionHandler(ExceptionClass.class)`** untuk menangkap jenis error spesifik dan mengubahnya menjadi format JSON yang rapi.

#### Contoh

Custom Business Exception:
```java
package com.belajar.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) { super(message); }
}
```

Global Advice:
```java
package com.belajar.exception;

import com.belajar.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalErrorAdvice {

    // 1. Menangkap ResourceNotFoundException (HTTP 404)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ApiResponse.error(404, ex.getMessage(), null));
    }

    // 2. Menangkap Exception Umum Tak Terduga (HTTP 500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error(500, "Terjadi kesalahan internal pada server", ex.getMessage()));
    }
}
```

**Hafalan:**

```text
@RestControllerAdvice                → class sentral penangan error global untuk seluruh REST Controller
@ExceptionHandler(TargetError.class) → method penangkap tipe exception spesifik
```

---

<a id="bagian-13"></a>

## 13. 🟡 Standar Error Modern RFC 7807 (Problem Details for HTTP APIs)

#### Konsep

Sejak Spring Boot 3 / Spring Framework 6, diadopsi standar resmi IETF **RFC 7807 (Problem Details for HTTP APIs)** untuk menyeragamkan format error REST API di seluruh industri.

Class **`org.springframework.http.ProblemDetail`** bawaan Spring Boot 3 memiliki atribut terstandarisasi:
- `type` : URI dokumentasi jenis error.
- `title` : Judul singkat jenis error HTTP.
- `status` : Status code HTTP numerik (400, 404, 500).
- `detail` : Penjelasan rinci masalah spesifik yang terjadi.
- `instance` : URI endpoint yang memicu error.

#### Contoh

```java
package com.belajar.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.net.URI;
import java.time.Instant;

@RestControllerAdvice
public class ProblemDetailsHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ProblemDetail handleIllegalArgument(IllegalArgumentException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
        problem.setTitle("Invalid Argument Error");
        problem.setType(URI.create("https://api.toko.com/errors/invalid-argument"));
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }
}
```

#### Output

```json
{
  "type": "https://api.toko.com/errors/invalid-argument",
  "title": "Invalid Argument Error",
  "status": 400,
  "detail": "Kuantitas pembelian tidak boleh bernilai negatif!",
  "timestamp": "2026-08-29T12:30:00Z"
}
```

**Hafalan:**

```text
ProblemDetail.forStatusAndDetail(status, detail) → membuat format error standar industri RFC 7807
```

---

<a id="bagian-14"></a>

## 14. 🟡 Validasi Error Handler: Menangkap `MethodArgumentNotValidException`

#### Konsep

Ketika payload request gagal memenuhi aturan Jakarta Validation (`@Valid`), Spring melempar exception **`MethodArgumentNotValidException`**.

Kita harus mengekstrak pesan kesalahan dari setiap field yang bermasalah dan merangkumnya menjadi format `Map<String, String>` (Key: Nama Field, Value: Pesan Kesalahan) agar frontend dapat menampilkan error langsung di bawah kotak input form yang bersangkutan.

#### Contoh

```java
package com.belajar.exception;

import com.belajar.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ValidationExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();

        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.error(400, "Validasi data request gagal", fieldErrors));
    }
}
```

#### Output

Request tidak valid ke endpoint:
```json
{
  "code": 400,
  "status": "ERROR",
  "message": "Validasi data request gagal",
  "errors": {
    "name": "Nama customer wajib diisi",
    "email": "Format email tidak valid",
    "age": "Umur minimal 17 tahun"
  }
}
```

**Hafalan:**

```text
ex.getBindingResult().getFieldErrors() → mengekstrak daftar field-field yang melanggar aturan validasi
```

---

<a id="bagian-15"></a>

## 15. 🟡 CORS Configuration (Cross-Origin Resource Sharing)

#### Konsep

Ketika aplikasi frontend (misal: Vue.js di `http://localhost:5173`) mencoba memanggil REST API Spring Boot di `http://localhost:8080`, browser akan memblokir request karena kebijakan keamanan **CORS (*Cross-Origin Resource Sharing*)**.

Dua cara mengonfigurasi CORS di Spring Boot:
1. **Lokal di Level Controller:** `@CrossOrigin(origins = "http://localhost:5173")` di atas class Controller.
2. **Global (Standar Rekomendasi):** Mengimplementasikan interface **`WebMvcConfigurer`**.

#### Contoh

```java
package com.belajar.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebCorsConfiguration implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Terapkan pada semua path /api
            .allowedOrigins("http://localhost:5173", "https://toko-frontend.com")
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600); // Cache preflight response selama 1 jam
    }
}
```

**Hafalan:**

```text
WebMvcConfigurer.addCorsMappings(registry) → konfigurasi global izin domain frontend mengakses REST API
```

---

<a id="bagian-16"></a>

## 16. 🟡 File Upload & Download (`MultipartFile`)

#### Konsep

Untuk menerima file dari client (gambar profil, dokumen PDF, spreadsheet Excel):
1. Endpoint menggunakan method `POST` dengan `consumes = MediaType.MULTIPART_FORM_DATA_VALUE`.
2. Tangkap file menggunakan tipe parameter **`@RequestParam("file") MultipartFile file`**.
3. Gunakan method: `file.getOriginalFilename()`, `file.getSize()`, `file.getContentType()`, dan `file.transferTo(Path)`.

#### Contoh

```java
package com.belajar.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File tidak boleh kosong!"));
        }

        String originalName = file.getOriginalFilename();
        Path targetPath = Path.of("uploads", System.currentTimeMillis() + "_" + originalName);
        Files.createDirectories(targetPath.getParent());

        // Simpan file ke direktori disk lokal
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        return ResponseEntity.ok(Map.of(
            "fileName", originalName,
            "sizeBytes", file.getSize(),
            "contentType", file.getContentType(),
            "savedPath", targetPath.toString()
        ));
    }
}
```

**Hafalan:**

```text
@RequestParam("file") MultipartFile file → menangkap berkas biner yang diunggah via multipart form-data
```

---

<a id="bagian-17"></a>

## 17. 🔴 Custom HTTP Interceptor (`HandlerInterceptor`)

#### Konsep

**`HandlerInterceptor`** memungkinkan kita mencegat (*intercept*) HTTP Request sebelum sampai ke Controller atau setelah Controller selesai dieksekusi.

Tiga lifecycle method:
1. **`preHandle(request, response, handler)`:** Dijalankan **sebelum** controller dieksekusi. Jika return `false`, request langsung dihentikan.
2. **`postHandle(request, response, handler, modelAndView)`:** Dijalankan **setelah** controller selesai (sebelum response dikirim ke client).
3. **`afterCompletion(request, response, handler, ex)`:** Dijalankan **setelah seluruh request selesai** (sangat berguna untuk logging audit dan menghitung total latensi waktu eksekusi).

#### Contoh

```java
package com.belajar.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class ExecutionTimeInterceptor implements HandlerInterceptor {
    private static final Logger log = LoggerFactory.getLogger(ExecutionTimeInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        request.setAttribute("startTime", System.currentTimeMillis());
        return true; // Lanjutkan request ke Controller
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        long startTime = (Long) request.getAttribute("startTime");
        long duration = System.currentTimeMillis() - startTime;
        log.info("⏱️ [{}] {} selesai dalam {} ms (Status: {})", 
            request.getMethod(), request.getRequestURI(), duration, response.getStatus());
    }
}
```

Mendaftarkan Interceptor:
```java
@Configuration
public class InterceptorConfig implements WebMvcConfigurer {
    private final ExecutionTimeInterceptor timeInterceptor;

    public InterceptorConfig(ExecutionTimeInterceptor timeInterceptor) {
        this.timeInterceptor = timeInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(timeInterceptor).addPathPatterns("/api/**");
    }
}
```

**Hafalan:**

```text
HandlerInterceptor.preHandle()       → mencegat request sebelum mencapai controller
WebMvcConfigurer.addInterceptors()  → mendaftarkan interceptor ke pipeline Spring Web
```

---

<a id="bagian-18"></a>

## 18. 🔴 Kustomisasi Serialisasi JSON Jackson (`@JsonProperty`, `@JsonIgnore`)

#### Konsep

Spring Boot menggunakan engine **Jackson** untuk mengubah objek Java menjadi string JSON dan sebaliknya.

Anotasi Jackson penting:
- **`@JsonProperty("custom_name")`:** Mengubah nama key JSON di output (misal: mengubah camelCase Java ke snake_case JSON).
- **`@JsonIgnore`:** Menyembunyikan field rahasia agar **tidak pernah muncul di JSON output** (misal: `password`, `secretKey`).
- **`@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")`:** Memformat tampilan tanggal dan waktu.
- **`@JsonInclude(Include.NON_NULL)`:** Menyembunyikan atribut yang bernilai null dari JSON payload.

#### Contoh

```java
package com.belajar.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

public record UserProfileResponse(
    Long id,

    @JsonProperty("full_name")
    String fullName,

    String email,

    @JsonIgnore // Password tidak akan pernah ikut terkirim ke frontend
    String passwordHash,

    @JsonProperty("registered_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    LocalDateTime registeredAt
) {}
```

#### Output

```json
{
  "id": 1,
  "full_name": "Budi Santoso",
  "email": "budi@mail.com",
  "registered_at": "2026-08-29 19:30:00"
}
```

**Hafalan:**

```text
@JsonProperty("snake_name") → mengubah nama properti key JSON output
@JsonIgnore                 → menyembunyikan field sensitif dari serialisasi JSON response
```

---

<a id="bagian-19"></a>

## 19. 🛠️ Peta Ingatan Cepat

```text
                      PETA ARSITEKTUR SPRING BOOT WEB
                                     │
       ┌─────────────────────────────┼─────────────────────────────┐
       ▼                             ▼                             ▼
REQUEST CONTROLLERS           DATA VALIDATION               ERROR & EXCEPTIONS
├─ @RestController            ├─ @Valid (Active trigger)    ├─ @RestControllerAdvice
├─ @GetMapping / @PostMapping ├─ @NotBlank / @NotNull       ├─ @ExceptionHandler
├─ @PathVariable / @RequestParam ├─ @Size / @Min / @Max     ├─ RFC 7807 ProblemDetail
└─ @RequestBody (Record DTO)  └─ Custom @Constraint        └─ MethodArgumentNotValid
```

---

<a id="bagian-20"></a>

## 20. 📚 Tabel Ringkasan

| Anotasi / Komponen | Lokasi Penggunaan | Fungsi & Karakteristik Utama |
|---|---|---|
| `@RestController` | Class | Menandai REST Controller yang mengembalikan response JSON |
| `@RequestMapping` | Class / Method | Menetapkan base URL endpoint |
| `@GetMapping` | Method | Menangani HTTP GET request (Read) |
| `@PostMapping` | Method | Menangani HTTP POST request (Create) |
| `@PutMapping` | Method | Menangani HTTP PUT request (Full Replace) |
| `@DeleteMapping` | Method | Menangani HTTP DELETE request (Delete) |
| `@PathVariable` | Parameter | Mengekstrak parameter dari URL path segment |
| `@RequestParam` | Parameter | Mengekstrak query string parameter (`?key=val`) |
| `@RequestBody` | Parameter | Membaca dan memetakan JSON body ke objek/record DTO |
| `ResponseEntity<T>` | Return Type | Mengatur status HTTP, header, dan response body |
| `@Valid` | Parameter | Memicu validasi otomatis Jakarta Bean Validation |
| `@RestControllerAdvice`| Class | Menangani seluruh exception global terpusat |
| `MultipartFile` | Parameter | Menampung file upload binary dari form-data |

---

<a id="bagian-21"></a>

## 21. ⚡ Cheat Code Spring Boot Web 10 Detik

```java
// 1. Template Standard REST Controller dengan ResponseEntity
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> create(@Valid @RequestBody CreateUserRequest req) {
        UserResponse created = userService.create(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created(created, "User dibuat"));
    }
}

// 2. Template Global Error Advice
@RestControllerAdvice
public class GlobalAdvice {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> notFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(404, ex.getMessage(), null));
    }
}
```

---

<a id="bagian-22"></a>

## 22. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Fundamental Request Mapping & Controller
├── Kuasai @RestController, @GetMapping, @PostMapping, @PutMapping, @DeleteMapping
└── Pahami cara menangkap input via @PathVariable, @RequestParam, dan @RequestBody DTO Record
       │
       ▼
Langkah 2: Standarisasi Response & Validation
├── Gunakan ResponseEntity<T> dengan status code HTTP yang benar
├── Bungkus output dengan Standard ApiResponse Envelope
└── Terapkan Jakarta Validation (@Valid, @NotBlank, @Size, @Email)
       │
       ▼
Langkah 3: Global Error Handling & CORS
├── Buat @RestControllerAdvice terpusat
├── Tangkap MethodArgumentNotValidException untuk error form field
└── Konfigurasikan WebMvcConfigurer CORS untuk integrasi frontend
       │
       ▼
Langkah 4: Advanced Features (Interceptors & Files)
├── Pasang HandlerInterceptor untuk logging audit & latensi
└── Kelola upload berkas via MultipartFile
       │
       ▼
Langkah 5: Siap Melangkah ke Database ORM dengan Spring Data JPA & Hibernate!
```

---

<a id="bagian-23"></a>

## 23. 🏗️ Mini Project: Production-Ready E-Commerce Product & Order RESTful API

RESTful API backend e-commerce lengkap dan terstruktur yang mengintegrasikan: **`@RestController` CRUD, Record DTO, Jakarta Validation (`@Valid`), Custom Validation, Standard `ApiResponse<T>` Envelope Wrapper, Global Exception Handling (`@RestControllerAdvice`), dan CORS Configuration**.

```java
package com.belajar.store;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

// ==========================================
// 1. STANDARD API RESPONSE ENVELOPE
// ==========================================
@JsonInclude(JsonInclude.Include.NON_NULL)
record ApiResponse<T>(int code, String status, String message, T data, Object errors) {
    public static <T> ApiResponse<T> success(T data, String msg) {
        return new ApiResponse<>(200, "SUCCESS", msg, data, null);
    }
    public static <T> ApiResponse<T> created(T data, String msg) {
        return new ApiResponse<>(201, "CREATED", msg, data, null);
    }
    public static <T> ApiResponse<T> error(int code, String msg, Object errors) {
        return new ApiResponse<>(code, "ERROR", msg, null, errors);
    }
}

// ==========================================
// 2. DTO & MODEL RECORDS
// ==========================================
record ProductResponse(Long id, String sku, String name, double price, int stock) {}

record CreateProductRequest(
    @NotBlank(message = "SKU produk tidak boleh kosong")
    @Size(min = 3, max = 20, message = "SKU harus antara 3 hingga 20 karakter")
    String sku,

    @NotBlank(message = "Nama produk tidak boleh kosong")
    @Size(min = 3, max = 100, message = "Nama produk harus 3 hingga 100 karakter")
    String name,

    @NotNull(message = "Harga wajib diisi")
    @DecimalMin(value = "1000.0", message = "Harga minimal Rp 1.000,00")
    Double price,

    @NotNull(message = "Stok wajib diisi")
    @Min(value = 0, message = "Stok tidak boleh negatif")
    Integer stock
) {}

// ==========================================
// 3. CUSTOM EXCEPTIONS
// ==========================================
class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String msg) { super(msg); }
}

class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String msg) { super(msg); }
}

// ==========================================
// 4. SERVICE LAYER (IN-MEMORY REPOSITORY)
// ==========================================
@Service
class ProductService {
    private final Map<Long, ProductResponse> storage = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public ProductService() {
        // Seeding Data Awal
        saveInitial(new CreateProductRequest("SKU-01", "MacBook Pro M3", 24_000_000.0, 5));
        saveInitial(new CreateProductRequest("SKU-02", "Logitech MX Master", 1_500_000.0, 10));
    }

    private void saveInitial(CreateProductRequest req) {
        Long id = idGenerator.getAndIncrement();
        storage.put(id, new ProductResponse(id, req.sku(), req.name(), req.price(), req.stock()));
    }

    public List<ProductResponse> findAll(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return new ArrayList<>(storage.values());
        }
        return storage.values().stream()
            .filter(p -> p.name().toLowerCase().contains(keyword.toLowerCase()))
            .toList();
    }

    public ProductResponse findById(Long id) {
        ProductResponse p = storage.get(id);
        if (p == null) {
            throw new ResourceNotFoundException("Produk dengan ID #" + id + " tidak ditemukan!");
        }
        return p;
    }

    public ProductResponse create(CreateProductRequest req) {
        boolean duplicate = storage.values().stream().anyMatch(p -> p.sku().equalsIgnoreCase(req.sku()));
        if (duplicate) {
            throw new DuplicateResourceException("SKU " + req.sku() + " sudah digunakan produk lain!");
        }

        Long id = idGenerator.getAndIncrement();
        ProductResponse product = new ProductResponse(id, req.sku().toUpperCase(), req.name(), req.price(), req.stock());
        storage.put(id, product);
        return product;
    }

    public void delete(Long id) {
        if (!storage.containsKey(id)) {
            throw new ResourceNotFoundException("Produk dengan ID #" + id + " tidak ditemukan untuk dihapus!");
        }
        storage.remove(id);
    }
}

// ==========================================
// 5. REST CONTROLLER LAYER
// ==========================================
@RestController
@RequestMapping("/api/v1/products")
class ProductRestController {
    private final ProductService productService;

    public ProductRestController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAll(
        @RequestParam(name = "search", required = false) String search
    ) {
        List<ProductResponse> products = productService.findAll(search);
        return ResponseEntity.ok(ApiResponse.success(products, "Berhasil mengambil data produk"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getById(@PathVariable Long id) {
        ProductResponse product = productService.findById(id);
        return ResponseEntity.ok(ApiResponse.success(product, "Detail produk ditemukan"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> create(@Valid @RequestBody CreateProductRequest req) {
        ProductResponse created = productService.create(req);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created(created, "Produk baru berhasil ditambahkan"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Produk #" + id + " berhasil dihapus"));
    }
}

// ==========================================
// 6. GLOBAL EXCEPTION ADVICE
// ==========================================
@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ApiResponse.error(404, ex.getMessage(), null));
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicate(DuplicateResourceException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(ApiResponse.error(409, ex.getMessage(), null));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.error(400, "Validasi input request gagal", errors));
    }
}

// ==========================================
// 7. CORS CONFIGURATION
// ==========================================
@Configuration
class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173", "http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}

// ==========================================
// 8. MAIN ENTRY POINT
// ==========================================
@SpringBootApplication
public class StoreApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(StoreApiApplication.class, args);
    }
}
```

#### Contoh Demonstrasi Endpoint & JSON Output

1. **Request Sukses `POST /api/v1/products` (Status 201 Created):**
```json
{
  "code": 201,
  "status": "CREATED",
  "message": "Produk baru berhasil ditambahkan",
  "data": {
    "id": 3,
    "sku": "SKU-03",
    "name": "Keychron K2 Keyboard",
    "price": 1200000.0,
    "stock": 8
  }
}
```

2. **Request Gagal Validasi `POST /api/v1/products` (Status 400 Bad Request):**
Payload Body Salah: `{"sku": "", "name": "A", "price": 500, "stock": -1}`
```json
{
  "code": 400,
  "status": "ERROR",
  "message": "Validasi input request gagal",
  "errors": {
    "sku": "SKU produk tidak boleh kosong",
    "name": "Nama produk harus 3 hingga 100 karakter",
    "price": "Harga minimal Rp 1.000,00",
    "stock": "Stok tidak boleh negatif"
  }
}
```

3. **Request Not Found `GET /api/v1/products/999` (Status 404 Not Found):**
```json
{
  "code": 404,
  "status": "ERROR",
  "message": "Produk dengan ID #999 tidak ditemukan!",
  "errors": null
}
```

---

<a id="bagian-24"></a>

## 24. 🔗 Referensi Resmi

- [Spring Boot Web MVC Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/web.html)
- [Jakarta Bean Validation 3.0 Specification](https://beanvalidation.org/)
- [RFC 7807: Problem Details for HTTP APIs](https://datatracker.ietf.org/doc/html/rfc7807)
- [Baeldung Spring REST Tutorials](https://www.baeldung.com/rest-with-spring-series)
