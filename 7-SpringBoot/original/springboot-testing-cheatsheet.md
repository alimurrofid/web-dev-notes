# Spring Boot Testing Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Spring Boot 3.3+ (Java 21 LTS) untuk pemula yang ingin memahami pengujian otomatis (Unit Testing, Mockito, Slice Testing dengan MockMvc, dan DataJpaTest). Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> Pengujian di Spring Boot menggunakan dependensi `spring-boot-starter-test` yang menyertakan JUnit 5, Mockito, AssertJ, dan MockMvc secara bawaan.

## Daftar Isi

1. [Piramida Testing](#1-piramida-testing)
2. [JUnit 5 Dasar & AssertJ](#2-junit-5-dasar--assertj)
3. [Unit Test Service dengan Mockito](#3-unit-test-service-dengan-mockito)
4. [Controller Slice Test dengan @WebMvcTest & MockMvc](#4-controller-slice-test-dengan-webmvctest--mockmvc)
5. [@MockBean](#5-mockbean)
6. [Repository Test dengan @DataJpaTest](#6-repository-test-dengan-datajpatest)
7. [Testing Security dengan @WithMockUser](#7-testing-security-dengan-withmockuser)
8. [End-to-End Test dengan @SpringBootTest](#8-end-to-end-test-dengan-springboottest)

---

# 1. Piramida Testing

Piramida testing membagi jenis pengujian menjadi 3 tingkat:
- **Unit Test (Dasar):** Cepat, menguji 1 class terisolasi (Service/Utility) dengan mock.
- **Integration / Slice Test (Tengah):** Menguji 1 layer tertentu (@WebMvcTest, @DataJpaTest).
- **End-to-End Test (Puncak):** Lambat, menyalakan seluruh aplikasi (@SpringBootTest).

---

# 2. JUnit 5 Dasar & AssertJ

```java
class CalculatorTest {
    @Test
    @DisplayName("Harus menjumlahkan dua angka dengan benar")
    void testTambah() {
        int hasil = 10 + 5;
        assertThat(hasil).isEqualTo(15);
    }
}
```

---

# 3. Unit Test Service dengan Mockito

Menguji Service Layer tanpa menyalakan Spring Context (`@ExtendWith(MockitoExtension.class)`).

```java
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {
    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void testFindById() {
        Product mockProduct = new Product(1L, "Laptop", 15000000.0);
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));

        Product result = productService.getById(1L);

        assertThat(result.getName()).isEqualTo("Laptop");
        verify(productRepository, times(1)).findById(1L);
    }
}
```

---

# 4. Controller Slice Test dengan @WebMvcTest & MockMvc

Menguji Controller Layer secara terisolasi dengan simulasi HTTP request.

```java
@WebMvcTest(ProductController.class)
class ProductControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Test
    void testGetProduct() throws Exception {
        when(productService.getById(1L)).thenReturn(new Product(1L, "Mouse", 150000.0));

        mockMvc.perform(get("/api/products/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Mouse"));
    }
}
```

---

# 5. @MockBean

Menyuntikkan mock object ke dalam ApplicationContext Spring untuk menggantikan bean asli selama pengujian.

---

# 6. Repository Test dengan @DataJpaTest

Menguji custom query JPA pada database in-memory H2 yang otomatis di-rollback setelah setiap test.

```java
@DataJpaTest
class ProductRepositoryTest {
    @Autowired
    private ProductRepository productRepository;

    @Test
    void testFindBySku() {
        productRepository.save(new Product(null, "SKU-01", "Keyboard", 500000.0));
        Optional<Product> found = productRepository.findBySku("SKU-01");
        assertThat(found).isPresent();
    }
}
```

---

# 7. Testing Security dengan @WithMockUser

Mensimulasikan user terotentikasi dengan role tertentu saat menguji endpoint terproteksi.

```java
@Test
@WithMockUser(username = "admin", roles = {"ADMIN"})
void testDeleteProductAsAdmin() throws Exception {
    mockMvc.perform(delete("/api/products/1"))
        .andExpect(status().isOk());
}
```

---

# 8. End-to-End Test dengan @SpringBootTest

Menyalakan seluruh aplikasi Spring Boot pada port acak untuk pengujian integrasi penuh.

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class FullIntegrationTest {
    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void testFullFlow() {
        ResponseEntity<String> res = restTemplate.getForEntity("/api/products", String.class);
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}
```
