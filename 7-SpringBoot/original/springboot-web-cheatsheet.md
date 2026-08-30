# Spring Boot Web (RESTful API) Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Spring Boot 3.3+ (Java 21 LTS) untuk pemula yang ingin membangun RESTful API menggunakan Spring Web MVC, Jakarta Validation, dan Global Exception Handling. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> Spring Boot Web menggunakan arsitektur DispatcherServlet untuk menangani HTTP request dan meresponsnya dalam format JSON secara efisien.

## Daftar Isi

1. [Pengenalan @RestController](#1-pengenalan-restcontroller)
2. [Request Mapping HTTP](#2-request-mapping-http)
3. [Path Variable](#3-path-variable)
4. [Request Param](#4-request-param)
5. [Request Body](#5-request-body)
6. [ResponseEntity](#6-responseentity)
7. [Jakarta Validation](#7-jakarta-validation)
8. [Global Exception Handler](#8-global-exception-handler)
9. [CORS Configuration](#9-cors-configuration)
10. [File Upload](#10-file-upload)

---

# 1. Pengenalan @RestController

`@RestController` menggabungkan `@Controller` dan `@ResponseBody`, sehingga seluruh return value method otomatis diserialisasi ke JSON.

```java
@RestController
@RequestMapping("/api/hello")
public class HelloController {
    @GetMapping
    public Map<String, String> sayHello() {
        return Map.of("message", "Halo Dunia dari Spring Web!");
    }
}
```

---

# 2. Request Mapping HTTP

- `@GetMapping` : Mengambil data (Read).
- `@PostMapping` : Membuat data baru (Create).
- `@PutMapping` : Mengganti seluruh data (Replace).
- `@PatchMapping` : Mengubah sebagian data (Partial Update).
- `@DeleteMapping` : Menghapus data (Delete).

---

# 3. Path Variable

Mengambil parameter dari path URL dinamis.

```java
@GetMapping("/users/{id}")
public UserResponse getUserById(@PathVariable("id") Long id) {
    return userService.findById(id);
}
```

---

# 4. Request Param

Mengambil query string parameter dari URL (`/api/items?page=1&size=10`).

```java
@GetMapping("/items")
public List<Item> searchItems(
    @RequestParam(name = "keyword", required = false) String keyword,
    @RequestParam(name = "page", defaultValue = "1") int page
) {
    return itemService.search(keyword, page);
}
```

---

# 5. Request Body

Menerima JSON payload dari client dan memetakannya ke Java Record DTO.

```java
public record CreateUserRequest(String name, String email) {}

@PostMapping("/users")
public UserResponse createUser(@RequestBody CreateUserRequest request) {
    return userService.create(request);
}
```

---

# 6. ResponseEntity

Mengatur status code HTTP, headers, dan body response secara eksplisit.

```java
@PostMapping("/products")
public ResponseEntity<ProductResponse> createProduct(@RequestBody CreateProductRequest req) {
    ProductResponse created = productService.create(req);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
}
```

---

# 7. Jakarta Validation

Memvalidasi data request masuk otomatis menggunakan anotasi `@Valid`.

```java
public record RegisterRequest(
    @NotBlank(message = "Username tidak boleh kosong")
    @Size(min = 4, max = 20)
    String username,

    @NotBlank
    @Email(message = "Format email tidak valid")
    String email
) {}

@PostMapping("/register")
public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest req) {
    return ResponseEntity.ok("Registrasi Berhasil");
}
```

---

# 8. Global Exception Handler

Menangani seluruh error dan exception terpusat menggunakan `@RestControllerAdvice`.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
            "status", 404,
            "error", ex.getMessage()
        ));
    }
}
```

---

# 9. CORS Configuration

Mengizinkan request dari domain frontend yang berbeda (misal: Vue/React di port 5173).

```java
@Configuration
public class WebCorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173")
            .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

---

# 10. File Upload

Menangani upload file multipart form-data.

```java
@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
    String filename = file.getOriginalFilename();
    long size = file.getSize();
    return ResponseEntity.ok("File " + filename + " (" + size + " bytes) berhasil diunggah.");
}
```
