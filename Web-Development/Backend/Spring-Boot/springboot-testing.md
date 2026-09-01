---
title: "Spring Boot Testing"
description: "Pengujian aplikasi Spring Boot: Unit testing dengan JUnit 5 & Mockito, Slice testing (@WebMvcTest, @DataJpaTest), dan Integration testing (@SpringBootTest)."
order: 5
tags:
  - web-development
  - backend
  - spring-boot
  - testing
  - junit
---

# Spring Boot Testing

> **Target:** Pemula yang telah memahami Java dasar, OOP, Spring Boot Core, Web RESTful API, JPA, dan Security, serta ingin menguasai **pengujian otomatis perangkat lunak (Automated Software Testing), Unit Testing dengan Mockito, Web Slice Testing dengan MockMvc, Database Testing dengan `@DataJpaTest`, Security Testing dengan `@WithMockUser`, dan End-to-End Testing** (Spring Boot 3.3+ & Java 21 LTS).
>
> Fokus cheatsheet ini: **Piramida Testing mental model → JUnit 5 lifecycle & AssertJ fluent assertions → Unit Testing murni Service Layer via Mockito (`@Mock`, `@InjectMocks`, `when().thenReturn()`, `verify()`) → Parameterized Tests (`@CsvSource`) → Web Slice Testing (`@WebMvcTest` + `MockMvc` + `jsonPath`) → `@MockBean` injection → testing validasi `@Valid` & Exception Advice → Repository Testing (`@DataJpaTest` & auto-rollback) → testing Spring Security (`@WithMockUser`) → full E2E (`@SpringBootTest`) → Testcontainers overview → mini project e-commerce test suite**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: Piramida Testing, JUnit 5 Lifecycle, AssertJ, dan Unit Testing Service dengan Mockito

🟡 Lanjutan
→ pelajari setelah memahami unit test: MockMvc Controller Slice Test, @MockBean, @DataJpaTest, @WithMockUser, dan @SpringBootTest

🔴 Advanced / Operasional
→ penting untuk arsitektur production: @ActiveProfiles("test"), Testcontainers (Docker DB Test), dan ArgumentCaptor
```

Mental model Piramida Testing pada aplikasi Spring Boot:

```text
                         /\
                        /  \     End-to-End (E2E) Tests
                       / E2E\    (@SpringBootTest + TestRestTemplate)
                      /------\   -> Lambat, load seluruh konteks aplikasi
                     /        \
                    /  SLICE   \  Slice Tests (@WebMvcTest / @DataJpaTest)
                   /   TESTS    \ -> Sedang, hanya load layer tertentu
                  /--------------\
                 /                \
                /   UNIT TESTS     \ Unit Tests Murni (JUnit 5 + Mockito)
               /   (SERVICE LAYER)  \ -> Super Cepat (Milidetik), 100% Terisolasi
              /----------------------\
```

**Hafalan:**

```text
Unit Test            → pengujian unit terkecil kode (1 method/class) secara terisolasi murni tanpa menyalakan Spring Context
Slice Test           → pengujian terfokus pada 1 lapisan arsitektur spesifik (@WebMvcTest untuk Controller, @DataJpaTest untuk Repo)
Integration Test     → pengujian yang memverifikasi integrasi antar beberapa komponen atau dengan database nyata
Mockito              → framework mocking paling populer di Java untuk memalsukan behavior objek dependensi
MockMvc              → utilitas resmi Spring untuk mensimulasikan HTTP Request dan memvalidasi JSON Response tanpa menyalakan web server riil
AssertJ              → library assertion yang menyediakan method chaining ekspresif dan mudah dibaca (assertThat)
@MockBean            → anotasi Spring Boot untuk menyuntikkan mock Mockito ke dalam ApplicationContext Spring
@WithMockUser        → anotasi pengujian keamanan untuk mensimulasikan pengguna yang terotentikasi dengan role tertentu
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Testing di Spring Boot & Mental Model Piramida Testing](#bagian-1)
2. [Bedah Dependensi `spring-boot-starter-test`](#bagian-2)
3. [Siklus Hidup & Anotasi Inti JUnit 5](#bagian-3)
4. [Fluent Assertion Modern dengan AssertJ (`assertThat`)](#bagian-4)
5. [Unit Testing Murni Service Layer dengan Mockito](#bagian-5)
6. [Mendefinisikan Mock Behavior & Stubbing (`when().thenReturn()`)](#bagian-6)
7. [Verifikasi Eksekusi Mock (`verify()`)](#bagian-7)
8. [Parameterized Tests di JUnit 5 (`@CsvSource`)](#bagian-8)

### 🟡 Lanjutan

9. [Slice Testing Controller Layer dengan `@WebMvcTest` & `MockMvc`](#bagian-9)
10. [Simulasi HTTP Request & Assertion dengan `MockMvc` (`jsonPath`)](#bagian-10)
11. [Menyuntikkan Mock Bean ke Spring Context dengan `@MockBean`](#bagian-11)
12. [Testing Request Body JSON & Multipart File Upload](#bagian-12)
13. [Testing Validasi Jakarta (`@Valid`) & Global Exception Handler](#bagian-13)
14. [Slice Testing Database Layer dengan `@DataJpaTest`](#bagian-14)
15. [Testing Security & Autentikasi dengan `@WithMockUser`](#bagian-15)
16. [Full End-to-End (E2E) Testing dengan `@SpringBootTest`](#bagian-16)

### 🔴 Advanced / Operasional

17. [Konfigurasi Lingkungan Pengujian dengan `@ActiveProfiles("test")`](#bagian-17)
18. [Pengenalan Integration Testing dengan Testcontainers](#bagian-18)

### 🛠️ Referensi & Praktik

19. [Peta Ingatan Cepat](#bagian-19)
20. [Tabel Ringkasan](#bagian-20)
21. [Cheat Code Spring Boot Testing 10 Detik](#bagian-21)
22. [Urutan Belajar yang Disarankan](#bagian-22)
23. [Mini Project: Production-Ready E-Commerce Test Suite](#bagian-23)
24. [Referensi Resmi](#bagian-24)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan Testing di Spring Boot & Mental Model Piramida Testing

#### Konsep

Pengujian otomatis (*Automated Testing*) adalah jaminan utama bahwa aplikasi Anda tidak rusak saat ada penambahan fitur baru (*Regression Protection*).

Piramida Testing Standar Industri:
1. **Unit Tests (70-80% dari total tes):**
   - Menguji logika bisnis di `Service Layer`.
   - **Super Cepat (milidetik):** Menggunakan JUnit 5 + Mockito murni tanpa menyalakan Spring Container.
2. **Slice / Integration Tests (15-20% dari total tes):**
   - Menguji interaksi Controller (`@WebMvcTest`) atau Query Repository (`@DataJpaTest`) secara terisolasi.
3. **End-to-End (E2E) Tests (5-10% dari total tes):**
   - Menyalakan seluruh konteks Spring Boot pada port acak (`@SpringBootTest`) untuk menguji alur menyeluruh dari HTTP Request sampai penyimpanan database.

#### Cara Kerja

```text
Jenis Test:       Target Layer:              Tools / Anotasi:
Unit Test    ──>  Service / Business Logic ──> JUnit 5 + Mockito (@ExtendWith)
Slice Test   ──>  Controller / Endpoints   ──> @WebMvcTest + MockMvc
Slice Test   ──>  Database / Repositories  ──> @DataJpaTest + H2 / Testcontainers
E2E Test     ──>  Seluruh Ekosistem App    ──> @SpringBootTest + TestRestTemplate
```

**Hafalan:**

```text
Piramida Testing → komposisi pengujian: perbanyak Unit Test cepat di dasar, batasi E2E test lambat di puncak
```

---

<a id="bagian-2"></a>

## 2. 🟢 Bedah Dependensi `spring-boot-starter-test`

#### Konsep

Saat membuat proyek di Spring Initializr, dependensi `spring-boot-starter-test` otomatis disertakan. Starter ini membundel seluruh library pengujian terbaik di dunia Java tanpa perlu konfigurasi manual:

1. **JUnit 5 (Jupiter):** Framework eksekusi pengujian standar.
2. **Mockito:** Framework mocking dan stubbing objek.
3. **AssertJ:** Library assertion berantai yang sangat ekspresif (*fluent assertions*).
4. **Hamcrest:** Library matcher pencocok nilai.
5. **JSONassert & JsonPath:** Parser dan validator struktur respons JSON.
6. **Spring Test & Spring Boot Test:** Anotasi integrasi dan utilitas `MockMvc`.

**Hafalan:**

```text
spring-boot-starter-test → starter tunggal yang menyertakan JUnit 5, Mockito, AssertJ, dan MockMvc
```

---

<a id="bagian-3"></a>

## 3. 🟢 Siklus Hidup & Anotasi Inti JUnit 5

#### Konsep

JUnit 5 (Jupiter) menyediakan serangkaian anotasi untuk mengatur siklus hidup eksekusi metode pengujian:

| Anotasi JUnit 5 | Waktu Eksekusi | Kegunaan Utama |
|---|---|---|
| **`@Test`** | Tiap unit test | Menandai method sebagai sebuah kasus pengujian. |
| **`@DisplayName("...")`** | - | Memberikan nama deskriptif manusia untuk laporan pengujian. |
| **`@BeforeEach`** | Sebelum setiap `@Test` | Menyiapkan data awal (*setup fixture*) sebelum tiap test jalan. |
| **`@AfterEach`** | Setelah setiap `@Test` | Membersihkan resource (*teardown*) setelah tiap test selesai. |
| **`@BeforeAll`** | 1x sebelum semua test | Setup statis awal tingkat class (wajib method `static`). |
| **`@AfterAll`** | 1x setelah semua test | Cleanup statis akhir tingkat class (wajib method `static`). |
| **`@Disabled("alasan")`** | - | Menonaktifkan sementara sebuah test yang belum siap. |

#### Contoh

```java
package com.belajar.test;

import org.junit.jupiter.api.*;

import static org.assertj.core.api.Assertions.assertThat;

class LifecycleTest {

    @BeforeAll
    static void initGlobal() {
        System.out.println("1. @BeforeAll: Dijalankan 1x di awal class");
    }

    @BeforeEach
    void initMethod() {
        System.out.println("2. @BeforeEach: Setup sebelum test");
    }

    @Test
    @DisplayName("Kalkulasi Penjumlahan Sederhana")
    void testPenjumlahan() {
        int hasil = 10 + 20;
        assertThat(hasil).isEqualTo(30);
    }

    @AfterEach
    void tearDownMethod() {
        System.out.println("3. @AfterEach: Cleanup setelah test");
    }

    @AfterAll
    static void tearDownGlobal() {
        System.out.println("4. @AfterAll: Dijalankan 1x di akhir class");
    }
}
```

**Hafalan:**

```text
@BeforeEach → dijalankan sebelum setiap method @Test untuk mereset state data pengujian
@DisplayName("deskripsi") → memberi label deskriptif yang rapi pada laporan test
```

---

<a id="bagian-4"></a>

## 4. 🟢 Fluent Assertion Modern dengan AssertJ (`assertThat`)

#### Konsep

AssertJ adalah standar emas assertion di Spring Boot. AssertJ menggunakan pendekatan method chaining (`assertThat(actual)...`) yang jauh lebih mudah dibaca dan memberikan pesan error yang sangat detail saat pengujian gagal.

Metode Assertion Populer AssertJ:
- **Objek & Kesamaan:** `isEqualTo(expected)`, `isNotEqualTo()`, `isNull()`, `isNotNull()`.
- **Boolean:** `isTrue()`, `isFalse()`.
- **String:** `isNotEmpty()`, `isNotBlank()`, `startsWith("A")`, `containsIgnoringCase("java")`.
- **Koleksi / List:** `hasSize(3)`, `contains("Budi")`, `containsExactly("A", "B")`, `isEmpty()`.
- **Angka:** `isGreaterThan(10)`, `isPositive()`, `isBetween(1, 100)`.

#### Contoh

```java
package com.belajar.test;

import org.junit.jupiter.api.Test;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class AssertJDemoTest {

    @Test
    void testFluentAssertions() {
        String nama = "Budi Santoso";
        List<String> hobi = List.of("Coding", "Gaming", "Membaca");
        double saldo = 1_500_000.0;

        // Assertion String
        assertThat(nama)
            .isNotBlank()
            .startsWith("Budi")
            .endsWith("Santoso");

        // Assertion Koleksi List
        assertThat(hobi)
            .hasSize(3)
            .contains("Coding")
            .doesNotContain("Memancing");

        // Assertion Angka
        assertThat(saldo)
            .isPositive()
            .isGreaterThan(1_000_000.0);
    }
}
```

**Hafalan:**

```text
assertThat(actual).isEqualTo(expected) → memvalidasi kesetaraan nilai dengan gaya fluent AssertJ
assertThat(list).hasSize(count)        → memvalidasi jumlah elemen di dalam koleksi
```

---

<a id="bagian-5"></a>

## 5. 🟢 Unit Testing Murni Service Layer dengan Mockito

#### Konsep

Unit Testing Service Layer **TIDAK MEMERLUKAN `@SpringBootTest`** (karena menyalakan Spring Context membutuhkan waktu beberapa detik).

Gunakan **`@ExtendWith(MockitoExtension.class)`**:
- **`@Mock`:** Membuat objek tiruan (*dummy mock*) untuk dependensi (seperti Repository atau MailSender).
- **`@InjectMocks`:** Menginstansiasi class Service asli dan secara otomatis menyuntikkan seluruh objek `@Mock` ke dalamnya via Constructor.
- Pengujian dieksekusi dalam hitungan **milidetik**!

#### Contoh

Class yang Diuji (ProductService):
```java
public class ProductService {
    private final ProductRepository productRepo;

    public ProductService(ProductRepository productRepo) {
        this.productRepo = productRepo;
    }

    public Product getById(Long id) {
        return productRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Produk #" + id + " tidak ditemukan!"));
    }
}
```

Unit Test (ProductServiceTest):
```java
package com.belajar.service;

import com.belajar.entity.Product;
import com.belajar.exception.ResourceNotFoundException;
import com.belajar.repository.ProductRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // Unit Test Cepat Murni Mockito
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository; // Objek Tiruan Mock

    @InjectMocks
    private ProductService productService; // Service Asli yang Disuntik Mock

    @Test
    @DisplayName("Harus sukses mengembalikan produk jika ID ditemukan")
    void getById_Success() {
        // 1. Arrange (Persiapan data mock)
        Product mockProduct = new Product(1L, "SKU-01", "Laptop Gaming", 15_000_000.0);
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));

        // 2. Act (Eksekusi method)
        Product actual = productService.getById(1L);

        // 3. Assert (Verifikasi hasil)
        assertThat(actual).isNotNull();
        assertThat(actual.getName()).isEqualTo("Laptop Gaming");
        assertThat(actual.getPrice()).isEqualTo(15_000_000.0);

        // 4. Verify (Pastikan repo dipanggil tepat 1x)
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Harus melempar ResourceNotFoundException jika ID tidak ada")
    void getById_NotFound() {
        // Arrange: Mock mengembalikan kosong
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert: Memastikan exception dilempar
        assertThatThrownBy(() -> productService.getById(99L))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("Produk #99 tidak ditemukan!");

        verify(productRepository, times(1)).findById(99L);
    }
}
```

**Hafalan:**

```text
@ExtendWith(MockitoExtension.class) → mengaktifkan Mockito untuk unit test murni berkecepatan tinggi
@Mock                               → mendefinisikan objek tiruan
@InjectMocks                        → menginstansiasi class target dan menyuntikkan seluruh @Mock ke dalamnya
```

---

<a id="bagian-6"></a>

## 6. 🟢 Mendefinisikan Mock Behavior & Stubbing (`when().thenReturn()`)

#### Konsep

**Stubbing** adalah proses mengatur perilaku (*behavior*) yang harus dikembalikan oleh objek mock saat method-nya dipanggil:

- **Mengembalikan Nilai:** `when(mock.method(args)).thenReturn(returnValue)`
- **Melempar Exception:** `when(mock.method(args)).thenThrow(new CustomException())`
- **Method `void`:** `doNothing().when(mock).voidMethod()` atau `doThrow(new Exception()).when(mock).voidMethod()`
- **Argumen Dinamis (*Argument Matchers*):** `anyLong()`, `anyString()`, `any(Product.class)`, `eq("spesifik")`.

#### Contoh

```java
// Stubbing pencarian dengan argumen ID apapun
when(productRepository.findById(anyLong()))
    .thenReturn(Optional.of(new Product(1L, "SKU", "Sample", 10000.0)));

// Stubbing penyimpanan entity
when(productRepository.save(any(Product.class)))
    .thenAnswer(invocation -> invocation.getArgument(0)); // Kembalikan objek yang di-save
```

**Hafalan:**

```text
when(mock.method(any())).thenReturn(val) → mengatur nilai return tiruan dari objek mock
```

---

<a id="bagian-7"></a>

## 7. 🟢 Verifikasi Eksekusi Mock (`verify()`)

#### Konsep

Selain memeriksa nilai kembalian, pengujian yang baik harus memverifikasi **apakah method pada dependensi mock benar-benar dipanggil dengan benar**:

- `verify(mock, times(1)).method()` : Dipanggil tepat 1 kali.
- `verify(mock, never()).deleteById(any())` : Memastikan method **tidak pernah dipanggil sama sekali**.
- `verifyNoInteractions(mock)` : Memastikan tidak ada interaksi apapun pada objek mock tersebut.
- **`ArgumentCaptor<T>`:** Menangkap argumen yang dioper ke mock untuk di-assert secara mendalam.

#### Contoh

```java
@Test
void testCreateProduct() {
    CreateProductRequest req = new CreateProductRequest("SKU-01", "Mouse", 150000.0);
    productService.create(req);

    // Menangkap entity Product yang dioper ke repo.save()
    ArgumentCaptor<Product> captor = ArgumentCaptor.forClass(Product.class);
    verify(productRepository, times(1)).save(captor.capture());

    Product savedEntity = captor.getValue();
    assertThat(savedEntity.getSku()).isEqualTo("SKU-01");
    assertThat(savedEntity.getName()).isEqualTo("Mouse");
}
```

**Hafalan:**

```text
verify(mock, times(n)).method()     → memvalidasi bahwa method mock dipanggil sebanyak n kali
verify(mock, never()).method()       → memvalidasi bahwa method mock tidak pernah dipanggil
```

---

<a id="bagian-8"></a>

## 8. 🟢 Parameterized Tests di JUnit 5 (`@CsvSource`)

#### Konsep

Alih-alih menulis 5 method `@Test` duplikat untuk menguji berbagai variasi input validasi, gunakan **`@ParameterizedTest`**:
- **`@ValueSource(strings = {"a", "b", "c"})`:** Menguji kumpulan data 1 dimensi.
- **`@CsvSource`:** Menguji tabel baris kolom masukan dan ekspektasi keluaran (*Comma-Separated Values*).

#### Contoh

```java
package com.belajar.test;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;

class ParameterizedDemoTest {

    @ParameterizedTest
    @ValueSource(strings = {"admin@mail.com", "user.test@domain.co.id", "support@toko.com"})
    void testFormatEmailValid(String email) {
        assertThat(email).contains("@").contains(".");
    }

    @ParameterizedTest(name = "Diskon untuk Belanja Rp {0} harus Rp {1}")
    @CsvSource({
        "100000, 0.0",
        "500000, 50000.0",
        "1000000, 100000.0"
    })
    void testHitungDiskon(double totalBelanja, double diskonEkspektasi) {
        double diskon = (totalBelanja >= 500_000) ? totalBelanja * 0.10 : 0.0;
        assertThat(diskon).isEqualTo(diskonEkspektasi);
    }
}
```

**Hafalan:**

```text
@ParameterizedTest + @CsvSource({"input1, expected1", "input2, expected2"}) → eksekusi test berulang dengan variasi data tabel
```

---

<a id="bagian-9"></a>

## 9. 🟡 Slice Testing Controller Layer dengan `@WebMvcTest` & `MockMvc`

#### Konsep

Untuk menguji Controller Layer, kita tidak perlu menyalakan database atau service sungguhan.

Gunakan **`@WebMvcTest(TargetController.class)`**:
- Hanya memuat komponen web (`@Controller`, `@RestControllerAdvice`, `Converter`, `Filter`, Spring Security).
- **Service Layer diganti menjadi `@MockBean`**.
- Menggunakan **`MockMvc`** untuk mengirim request HTTP palsu secara lokal tanpa membuka port jaringan TCP.

#### Cara Kerja

```text
MockMvc.perform(get("/api/products/1"))
          │
          ▼
   DispatcherServlet (In-Memory)
          │
          ▼
   ProductController ──> Panggil Service (@MockBean) ──> Return Stubbed Data
          │
          ▼
   Jackson JSON Converter ──> Assert Status 200 & Body JSON via jsonPath
```

**Hafalan:**

```text
@WebMvcTest(Controller.class) → slice test terisolasi khusus Controller Layer dan komponen web
```

---

<a id="bagian-10"></a>

## 10. 🟡 Simulasi HTTP Request & Assertion dengan `MockMvc` (`jsonPath`)

#### Konsep

Sintaks pengujian `MockMvc`:
1. `mockMvc.perform(builder)` : Mengirim request HTTP (`get()`, `post()`, `put()`, `delete()`).
2. `.andExpect(status().isOk())` : Memverifikasi HTTP status code (`isCreated()`, `isNotFound()`, `isBadRequest()`).
3. `.andExpect(jsonPath("$.field").value(expected))` : Memvalidasi struktur dan nilai field di dalam response JSON menggunakan sintaks **JsonPath**.

Format Ekspresi JsonPath:
- `$.code` : Mengambil field `code` di root JSON.
- `$.data.name` : Mengambil field `name` di dalam objek `data`.
- `$.data[0].sku` : Mengambil field `sku` dari elemen array pertama.
- `$.data.length()` : Menghitung panjang array JSON.

#### Contoh

```java
package com.belajar.controller;

import com.belajar.dto.ProductResponse;
import com.belajar.service.ProductService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductRestController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService; // Disuntikkan ke Spring Context WebMvc

    @Test
    @DisplayName("GET /api/v1/products/{id} harus mengembalikan 200 OK dan JSON Product")
    void getById_Success() throws Exception {
        ProductResponse mockResponse = new ProductResponse(1L, "SKU-01", "MacBook Pro", 25_000_000.0, 5);
        when(productService.findById(1L)).thenReturn(mockResponse);

        mockMvc.perform(get("/api/v1/products/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.code").value(200))
            .andExpect(jsonPath("$.data.id").value(1))
            .andExpect(jsonPath("$.data.name").value("MacBook Pro"))
            .andExpect(jsonPath("$.data.price").value(25000000.0));
    }
}
```

**Hafalan:**

```text
mockMvc.perform(get(url)).andExpect(status().isOk()).andExpect(jsonPath("$.path").value(val))
```

---

<a id="bagian-11"></a>

## 11. 🟡 Menyuntikkan Mock Bean ke Spring Context dengan `@MockBean`

#### Konsep

Ketika menggunakan `@WebMvcTest`, Spring mencari bean dependency yang dibutuhkan oleh Controller (misal: `ProductService`). Jika tidak disediakan, konteks test akan gagal menyala (*NoSuchBeanDefinitionException*).

Anotasi **`@MockBean`**:
- Membuat mock Mockito dan **mendaftarkannya ke dalam ApplicationContext Spring**.
- Otomatis menggantikan bean asli di seluruh komponen yang membutuhkan.

**Hafalan:**

```text
@MockBean TargetService mockService → mendaftarkan mock Mockito ke dalam ApplicationContext Spring
```

---

<a id="bagian-12"></a>

## 12. 🟡 Testing Request Body JSON & Multipart File Upload

#### Konsep

- **Testing JSON Payload (`POST`/`PUT`):** Gunakan `content(objectMapper.writeValueAsString(dto))` dan `contentType(MediaType.APPLICATION_JSON)`.
- **Testing File Upload:** Gunakan `MockMultipartHttpServletRequestBuilder` via `multipart("/api/upload")` dan `MockMultipartFile`.

#### Contoh

```java
@Test
void testCreateProductJson() throws Exception {
    CreateProductRequest req = new CreateProductRequest("SKU-09", "Keychron K2", 1200000.0, 10);
    String jsonPayload = new ObjectMapper().writeValueAsString(req);

    mockMvc.perform(post("/api/v1/products")
            .contentType(MediaType.APPLICATION_JSON)
            .content(jsonPayload))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.data.sku").value("SKU-09"));
}

@Test
void testUploadFile() throws Exception {
    MockMultipartFile fakeFile = new MockMultipartFile(
        "file", "avatar.png", "image/png", "isi file dummy".getBytes()
    );

    mockMvc.perform(multipart("/api/v1/files/upload").file(fakeFile))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.fileName").value("avatar.png"));
}
```

**Hafalan:**

```text
mockMvc.perform(post(url).contentType(APPLICATION_JSON).content(jsonString)) → menguji endpoint JSON request body
```

---

<a id="bagian-13"></a>

## 13. 🟡 Testing Validasi Jakarta (`@Valid`) & Global Exception Handler

#### Konsep

Kita harus menguji apakah Controller dan `@RestControllerAdvice` bekerja sama menolak payload yang melanggar aturan validasi (`@NotBlank`, `@Size`, dll.) dengan mengembalikan status `400 Bad Request` beserta detail field error.

#### Contoh

```java
@Test
@DisplayName("POST /products dengan input kosong harus mengembalikan 400 Bad Request")
void create_InvalidPayload_Returns400() throws Exception {
    // Payload Kosong yang Melanggar Aturan @NotBlank
    String invalidJson = """
        {
          "sku": "",
          "name": "",
          "price": -500,
          "stock": -1
        }
    """;

    mockMvc.perform(post("/api/v1/products")
            .contentType(MediaType.APPLICATION_JSON)
            .content(invalidJson))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value(400))
        .andExpect(jsonPath("$.status").value("ERROR"))
        .andExpect(jsonPath("$.errors.sku").exists())
        .andExpect(jsonPath("$.errors.name").exists());
}
```

---

<a id="bagian-14"></a>

## 14. 🟡 Slice Testing Database Layer dengan `@DataJpaTest`

#### Konsep

**`@DataJpaTest`** digunakan khusus untuk menguji Repository JPA dan Entity Mapping:
1. Hanya mengonfigurasi komponen JPA (`@Entity`, `JpaRepository`, `EntityManager`).
2. Otomatis menggunakan database **In-Memory (H2 Database)** secara terisolasi.
3. **Auto-Rollback:** Setiap method `@Test` otomatis dibungkus transaksi yang **selalu di-rollback di akhir test**, sehingga database tetap bersih dan tidak mencemari test lain.

#### Contoh

```java
package com.belajar.repository;

import com.belajar.entity.Product;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest // Khusus pengujian Data Access Layer
class ProductRepositoryTest {

    @Autowired
    private ProductRepository productRepository;

    @Test
    @DisplayName("Pencarian findBySku harus berhasil mengambil entity yang tepat")
    void findBySku_Found() {
        // 1. Simpan Data ke In-Memory DB
        Product p = new Product(null, "SKU-TEST", "Monitor 4K", 5_000_000.0, 3);
        productRepository.save(p);

        // 2. Query Data
        Optional<Product> found = productRepository.findBySku("SKU-TEST");

        // 3. Assert
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Monitor 4K");
        assertThat(found.get().getId()).isNotNull();
    }
}
```

**Hafalan:**

```text
@DataJpaTest → slice test terisolasi untuk Repository JPA dengan database in-memory dan transaksi auto-rollback
```

---

<a id="bagian-15"></a>

## 15. 🟡 Testing Security & Autentikasi dengan `@WithMockUser`

#### Konsep

Ketika menguji Controller yang diamankan oleh Spring Security (`@PreAuthorize("hasRole('ADMIN')")`), kita dapat mensimulasikan login pengguna menggunakan dependensi `spring-security-test`:
- **`@WithMockUser(username = "admin", roles = {"ADMIN"})`:** Mensimulasikan request dari pengguna dengan role ADMIN.
- **`@WithMockUser(username = "user", roles = {"USER"})`:** Mensimulasikan request dari pengguna biasa.
- **`@WithAnonymousUser`:** Mensimulasikan pengunjung umum tanpa login (memvalidasi respons `401 Unauthorized`).

#### Contoh

```java
@Test
@DisplayName("DELETE /products/{id} dengan Role USER harus ditolak 403 Forbidden")
@WithMockUser(username = "budi", roles = {"USER"}) // Login sebagai USER biasa
void deleteProduct_AsUser_Forbidden() throws Exception {
    mockMvc.perform(delete("/api/v1/products/1"))
        .andExpect(status().isForbidden());
}

@Test
@DisplayName("DELETE /products/{id} dengan Role ADMIN harus berhasil 200 OK")
@WithMockUser(username = "admin", roles = {"ADMIN"}) // Login sebagai ADMIN
void deleteProduct_AsAdmin_Success() throws Exception {
    mockMvc.perform(delete("/api/v1/products/1"))
        .andExpect(status().isOk());
}
```

**Hafalan:**

```text
@WithMockUser(roles = {"ADMIN"}) → mensimulasikan request dari user dengan role tertentu pada pengujian MockMvc
```

---

<a id="bagian-16"></a>

## 16. 🟡 Full End-to-End (E2E) Testing dengan `@SpringBootTest`

#### Konsep

**`@SpringBootTest`** memuat **seluruh ApplicationContext Spring Boot secara penuh** (termasuk seluruh Service, Repository, Web Controller, dan Security).

Gunakan opsi `webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT`:
- Spring Boot akan menyalakan server Tomcat riil pada port acak yang tidak bentrok.
- Gunakan **`TestRestTemplate`** untuk mengirimkan request HTTP jaringan nyata ke server lokal tersebut.

#### Contoh

```java
package com.belajar.e2e;

import com.belajar.dto.ApiResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class FullApplicationE2ETest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    @DisplayName("E2E Test: Panggil GET /api/v1/products harus return 200 OK")
    void testGetProductsE2E() {
        ResponseEntity<ApiResponse> response = restTemplate.getForEntity("/api/v1/products", ApiResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().code()).isEqualTo(200);
    }
}
```

**Hafalan:**

```text
@SpringBootTest(webEnvironment = RANDOM_PORT) → pengujian integrasi E2E menyeluruh dengan web server riil
```

---

<a id="bagian-17"></a>

## 17. 🔴 Konfigurasi Lingkungan Pengujian dengan `@ActiveProfiles("test")`

#### Konsep

Saat menjalankan tes otomatis, kita tidak ingin pengujian mencemari database production atau menggunakan kredensial API eksternal asli.

Gunakan **`@ActiveProfiles("test")`**:
- Spring Boot akan memuat file konfigurasi khusus `src/test/resources/application-test.yaml`.
- Konfigurasi ini biasanya mengarahkan database ke H2 In-Memory atau database test terisolasi.

#### Contoh

```java
@SpringBootTest
@ActiveProfiles("test") // Memuat application-test.yaml
class ServiceIntegrationTest { ... }
```

**Hafalan:**

```text
@ActiveProfiles("test") → mengaktifkan environment profile khusus pengujian (application-test.yaml)
```

---

<a id="bagian-18"></a>

## 18. 🔴 Pengenalan Integration Testing dengan Testcontainers

#### Konsep

Meskipun database in-memory H2 sangat cepat, H2 memiliki dialek SQL yang berbeda dengan database produksi (seperti fitur JSONB PostgreSQL, stored procedure, atau trigger).

**Testcontainers** adalah library Java yang memungkinkan kita **menyalakan container Docker resmi (misal: PostgreSQL / MySQL / Redis asli) secara otomatis saat pengujian dijalankan**, dan mematikannya kembali saat pengujian selesai.

Ini memberikan jaminan 100% bahwa query database Anda bekerja sempurna di lingkungan produksi yang identik.

**Hafalan:**

```text
Testcontainers → library pengujian integrasi yang memutar container Docker database nyata selama masa pengujian
```

---

<a id="bagian-19"></a>

## 19. 🛠️ Peta Ingatan Cepat

```text
                     PETA ARSITEKTUR TESTING SPRING BOOT
                                      │
       ┌──────────────────────────────┼──────────────────────────────┐
       ▼                              ▼                              ▼
UNIT TESTS (SERVICE)          SLICE TESTS (WEB / DB)         INTEGRATION & E2E
├─ @ExtendWith(Mockito)       ├─ @WebMvcTest + MockMvc       ├─ @SpringBootTest
├─ @Mock & @InjectMocks       ├─ @MockBean (Service Mock)    ├─ @ActiveProfiles("test")
├─ when().thenReturn()        ├─ jsonPath("$.data.field")    ├─ TestRestTemplate
└─ verify(mock, times(1))     ├─ @DataJpaTest (H2 Rollback)  └─ Testcontainers (Docker)
                              └─ @WithMockUser (Security)
```

---

<a id="bagian-20"></a>

## 20. 📚 Tabel Ringkasan

| Anotasi Testing | Lapisan Target | Kecepatan | Karakteristik & Kegunaan Utama |
|---|---|---|---|
| `@Test` (JUnit 5) | Semua | - | Menandai method sebagai kasus uji pengujian |
| `@ExtendWith(MockitoExtension.class)` | Unit (Service) | **Ekstrem (< 50ms)** | Unit test murni tanpa memuat Spring Context |
| `@Mock` / `@InjectMocks` | Unit Test | Ekstrem | Membuat mock dan menyuntikkannya ke class target |
| `@WebMvcTest(Controller.class)` | Web Slice | **Cepat (~1-2s)** | Menguji Controller, Validation & Exception Advice |
| `@MockBean` | Spring Context | Cepat | Memasukkan mock Mockito ke dalam Spring Context |
| `MockMvc` | Web Slice | Cepat | Utilitas simulasi HTTP request & jsonPath assertion |
| `@DataJpaTest` | Database Slice| **Cepat (~1-2s)** | Menguji JPA Repository dengan DB in-memory terisolasi |
| `@WithMockUser` | Security Web | Cepat | Mensimulasikan pengguna terotentikasi dengan role |
| `@SpringBootTest` | Full App (E2E)| **Sedang (~3-8s)** | Menyalakan seluruh konteks aplikasi dan server |

---

<a id="bagian-21"></a>

## 21. ⚡ Cheat Code Spring Boot Testing 10 Detik

```java
// 1. Template Unit Test Service (Mockito)
@ExtendWith(MockitoExtension.class)
class ServiceTest {
    @Mock private Repo repo;
    @InjectMocks private Service service;

    @Test void test() {
        when(repo.findById(1L)).thenReturn(Optional.of(new Entity(1L)));
        assertThat(service.get(1L)).isNotNull();
        verify(repo).findById(1L);
    }
}

// 2. Template Controller Slice Test (MockMvc)
@WebMvcTest(TargetController.class)
class ControllerTest {
    @Autowired private MockMvc mockMvc;
    @MockBean private TargetService service;

    @Test void testGet() throws Exception {
        when(service.get(1L)).thenReturn(new Dto("Data"));
        mockMvc.perform(get("/api/data/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Data"));
    }
}
```

---

<a id="bagian-22"></a>

## 22. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Kuasai JUnit 5 & AssertJ
├── Pahami siklus @Test, @BeforeEach, dan @DisplayName
└── Kuasai method chaining assertion AssertJ (assertThat)
       │
       ▼
Langkah 2: Kuasai Unit Testing Service dengan Mockito
├── Gunakan @ExtendWith(MockitoExtension.class) untuk pengujian kilat
└── Kuasai stubbing when().thenReturn() dan verifikasi verify()
       │
       ▼
Langkah 3: Kuasai Web Slice Testing dengan MockMvc
├── Uji Controller secara terisolasi via @WebMvcTest & @MockBean
├── Validasi response JSON menggunakan jsonPath()
└── Uji validasi input gagal @Valid dan Exception Handler (400 Bad Request)
       │
       ▼
Langkah 4: Kuasai Repository Testing & Security Testing
├── Uji query custom JPA dengan @DataJpaTest (Auto-Rollback)
└── Simulasikan hak akses RBAC menggunakan @WithMockUser
       │
       ▼
Langkah 5: Siap Menerapkan CI/CD Automated Test Pipeline di Industri!
```

---

<a id="bagian-23"></a>

## 23. 🏗️ Mini Project: Production-Ready E-Commerce Test Suite

Suite pengujian komprehensif yang menguji seluruh lapisan aplikasi e-commerce: **Unit Test Service dengan Mockito, Controller Slice Test dengan MockMvc + JsonPath + `@WithMockUser`, dan Repository Slice Test dengan `@DataJpaTest`**.

```java
package com.belajar.store.test;

import com.belajar.dto.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// =========================================================================
// 1. UNIT TEST SERVICE LAYER (MURNI MOCKITO - SUPER CEPAT)
// =========================================================================
@ExtendWith(MockitoExtension.class)
class ProductServiceUnitTest {

    @Mock
    private DummyProductRepository productRepository;

    @InjectMocks
    private DummyProductService productService;

    @Test
    @DisplayName("Unit Test: Mencari produk berdasarkan ID yang valid harus sukses")
    void findById_Success() {
        DummyProduct mockProduct = new DummyProduct(1L, "SKU-01", "Laptop ASUS ROG", 20_000_000.0);
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));

        DummyProduct result = productService.findById(1L);

        assertThat(result).isNotNull();
        assertThat(result.name()).isEqualTo("Laptop ASUS ROG");
        verify(productRepository, times(1)).findById(1L);
    }
}

// =========================================================================
// 2. SLICE TEST CONTROLLER LAYER (MOCKMVC + SECURITY + JSONPATH)
// =========================================================================
@WebMvcTest(DummyProductController.class)
class ProductControllerSliceTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private DummyProductService productService;

    @Test
    @DisplayName("Web Test: GET /api/v1/products/{id} harus return 200 OK & JSON Body")
    @WithMockUser(username = "user", roles = {"USER"})
    void getById_Returns200() throws Exception {
        DummyProduct mockProduct = new DummyProduct(1L, "SKU-01", "Laptop ASUS ROG", 20_000_000.0);
        when(productService.findById(1L)).thenReturn(mockProduct);

        mockMvc.perform(get("/api/v1/products/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value(200))
            .andExpect(jsonPath("$.data.name").value("Laptop ASUS ROG"));
    }

    @Test
    @DisplayName("Security Test: DELETE /api/v1/products/{id} sebagai USER biasa harus 403 Forbidden")
    @WithMockUser(username = "budi", roles = {"USER"})
    void deleteProduct_AsUser_Forbidden() throws Exception {
        mockMvc.perform(delete("/api/v1/products/1").with(csrf()))
            .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Security Test: DELETE /api/v1/products/{id} sebagai ADMIN harus 200 OK")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void deleteProduct_AsAdmin_Success() throws Exception {
        mockMvc.perform(delete("/api/v1/products/1").with(csrf()))
            .andExpect(status().isOk());
    }
}

// =========================================================================
// 3. DUMMY CLASSES UNTUK DEMO RUNNABLE
// =========================================================================
record DummyProduct(Long id, String sku, String name, Double price) {}

interface DummyProductRepository {
    Optional<DummyProduct> findById(Long id);
}

class DummyProductService {
    private final DummyProductRepository repo;
    public DummyProductService(DummyProductRepository repo) { this.repo = repo; }
    public DummyProduct findById(Long id) { return repo.findById(id).orElseThrow(); }
}

@org.springframework.web.bind.annotation.RestController
@org.springframework.web.bind.annotation.RequestMapping("/api/v1/products")
class DummyProductController {
    private final DummyProductService service;
    public DummyProductController(DummyProductService service) { this.service = service; }

    @org.springframework.web.bind.annotation.GetMapping("/{id}")
    public ApiResponse<DummyProduct> getById(@org.springframework.web.bind.annotation.PathVariable Long id) {
        return ApiResponse.success(service.findById(id), "Sukses");
    }

    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    public ApiResponse<Void> deleteById(@org.springframework.web.bind.annotation.PathVariable Long id) {
        return ApiResponse.success(null, "Dihapus");
    }
}
```

#### Hasil Output Eksekusi Pengujian (Maven / Gradle Test Runner)

```text
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.belajar.store.test.ProductServiceUnitTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.045 s - in ProductServiceUnitTest
[INFO] Running com.belajar.store.test.ProductControllerSliceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.420 s - in ProductControllerSliceTest
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS (Seluruh Test Suite PASSED 100%)
[INFO] ------------------------------------------------------------------------
```

---

<a id="bagian-24"></a>

## 24. 🔗 Referensi Resmi

- [Spring Boot Testing Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.testing)
- [JUnit 5 (Jupiter) Official User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [Mockito Framework Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- [AssertJ Fluent Assertions Guide](https://assertj.github.io/doc/)
- [Testcontainers Official Documentation](https://testcontainers.com/)
