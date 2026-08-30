# Spring Data JPA & Hibernate Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Spring Boot 3.3+ (Java 21 LTS) untuk pemula yang ingin memahami Object-Relational Mapping (ORM), Hibernate, JpaRepository, Relasi Tabel, dan Query JPQL. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> Spring Data JPA menyederhanakan akses database dengan mengabstraksi Hibernate ORM dan menyediakan antarmuka generic repository siap pakai.

## Daftar Isi

1. [Pengenalan Entity](#1-pengenalan-entity)
2. [JpaRepository](#2-jparepository)
3. [Derived Query Methods](#3-derived-query-methods)
4. [Custom Query JPQL](#4-custom-query-jpql)
5. [Paging dan Sorting](#5-paging-dan-sorting)
6. [Relasi ManyToOne dan OneToMany](#6-relasi-manytoone-dan-onetomany)
7. [Lazy vs Eager Fetching](#7-lazy-vs-eager-fetching)
8. [N+1 Problem & JOIN FETCH](#8-n1-problem--join-fetch)
9. [@Transactional](#9-transactional)
10. [Flyway Migration](#10-flyway-migration)

---

# 1. Pengenalan Entity

Class Java yang dipetakan ke tabel basis data relasional.

```java
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String sku;

    private String name;
    private Double price;

    // Getters & Setters
}
```

---

# 2. JpaRepository

Interface penyedia operasi CRUD bawaan tanpa perlu menulis SQL.

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    // save(), findById(), findAll(), deleteById(), count()
}
```

---

# 3. Derived Query Methods

Pencarian otomatis berdasarkan nama method interface.

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContaining(String keyword);
    Optional<Product> findBySku(String sku);
    boolean existsBySku(String sku);
}
```

---

# 4. Custom Query JPQL

Query berbasis nama class Entity dan atribut Java (bukan nama tabel fisik).

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p WHERE p.price >= :minPrice")
    List<Product> findExpensiveProducts(@Param("minPrice") Double minPrice);
}
```

---

# 5. Paging dan Sorting

Mengambil data bertahap menggunakan objek `Pageable`.

```java
Pageable pageable = PageRequest.of(0, 10, Sort.by("price").descending());
Page<Product> page = productRepository.findAll(pageable);
```

---

# 6. Relasi ManyToOne dan OneToMany

```java
@Entity
public class OrderItem {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;
}

@Entity
public class Order {
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
}
```

---

# 7. Lazy vs Eager Fetching

- `FetchType.LAZY` (Default Rekomendasi): Relasi data hanya dimuat saat diakses (`order.getItems()`).
- `FetchType.EAGER` : Relasi data selalu dimuat otomatis sejak awal.

---

# 8. N+1 Problem & JOIN FETCH

Mengatasi ledakan query saat meload data berelasi dengan `JOIN FETCH`.

```java
@Query("SELECT o FROM Order o JOIN FETCH o.items")
List<Order> findAllOrdersWithItems();
```

---

# 9. @Transactional

Mengelola transaksi database secara otomatis (Commit saat sukses, Rollback saat RuntimeException).

```java
@Service
public class OrderService {
    @Transactional
    public void createOrder(Order order) {
        // Simpan header & potong stok
    }
}
```

---

# 10. Flyway Migration

Manajemen versi skema database via file SQL di folder `src/main/resources/db/migration/V1__init.sql`.
