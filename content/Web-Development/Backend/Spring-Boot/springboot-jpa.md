---
title: "Spring Data JPA & Hibernate"
description: "Persistensi data Spring Boot: JPA Entities, Spring Data Repositories, Derived Queries, @Query (JPQL & Native), Relationships, dan Transaction Management."
order: 3
tags:
  - web-development
  - backend
  - spring-boot
  - jpa
  - database
---

# Spring Data JPA & Hibernate

> **Target:** Pemula yang telah memahami Java dasar, OOP, Generic, Database (JDBC), dan Spring Boot Core/Web, serta ingin menguasai **Object-Relational Mapping (ORM), Hibernate 6.x, Spring Data JPA, Relasi Antar Tabel, Optimasi Kinerja Query, dan Database Transactions** (Spring Boot 3.3+ & Java 21 LTS).
> **Versi:** Spring Data JPA 3.x / Hibernate 6.x
> **Prasyarat:** [[springboot-dasar|Spring Boot Dasar]]
> Fokus modul pembelajaran ini: **mental model ORM & Hibernate → Entity Mapping (`@Entity`, `@Table`, `@Id`) → `JpaRepository<T, ID>` → Derived Queries → JPQL & Native Query → Paging & Sorting (`Pageable`) → Relasi Tabel (`@ManyToOne`, `@OneToMany`, `@ManyToMany`) → FetchType LAZY vs EAGER → Solusi N+1 Problem (`JOIN FETCH`, `@EntityGraph`) → `@Transactional` & ACID → Flyway Migrations → Soft Delete (`@SQLRestriction`) → Optimistic Locking (`@Version`) → mini project e-commerce data layer**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: Konsep ORM, Entity Mapping, JpaRepository, Derived Queries, JPQL, dan Paging & Sorting

🟡 Lanjutan
→ pelajari setelah memahami CRUD dasar: Relasi @ManyToOne & @OneToMany, FetchType LAZY, Solusi N+1 Problem, @Transactional, dan Flyway

🔴 Advanced / Operasional
→ penting untuk arsitektur production: Entity Lifecycle Callbacks, Optimistic Locking (@Version), dan Projections
```

Mental model alur arsitektur layer akses data Spring Data JPA:

```text
                     Service Layer (@Service)
                                │
                                ▼  Panggil Method Repository
              Spring Data JPA Interface (JpaRepository)
                                │
                                ▼  Dynamic Proxy Generation
                     Hibernate ORM Engine
          (Session / EntityManager / Entity State Tracker)
                                │
                                ▼  Generate SQL Dialect
                   HikariCP Connection Pool
                                │
                                ▼  PreparedStatement via JDBC Driver
              Database Relasional (PostgreSQL / MySQL)
```

**Hafalan:**

```text
ORM (Object-Relational Mapping) → teknik memetakan class & objek Java ke tabel & baris database relasional
Hibernate            → engine implementasi JPA paling populer di Java yang mengotomatisasi konversi Java Object <-> SQL
Spring Data JPA      → lapisan abstraksi tingkat tinggi di atas JPA/Hibernate yang menyediakan generic repository CRUD instan
Entity               → class Java representasi baris tabel database relasional yang dikelola oleh EntityManager
JpaRepository<T, ID> → interface sakti yang menyediakan operasi CRUD, sorting, dan pagination tanpa perlu menulis SQL
JPQL                 → Java Persistence Query Language: sintaks query berorientasi objek (berbasis nama Class Entity, bukan nama tabel SQL)
FetchType.LAZY       → strategi penundaan pemuatan data relasi sampai data tersebut benar-benar diakses di kode
N+1 Query Problem    → bug performa fatal di mana pemanggilan 1 query induk memicu eksekusi N query anak tambahan secara terpisah
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan ORM, Hibernate & Arsitektur Spring Data JPA](#bagian-1)
2. [Anatomi Entity Dasar (`@Entity`, `@Table`, `@Id`, `@Column`)](#bagian-2)
3. [Tipe Data Khusus, Enum & Auditing Otomatis](#bagian-3)
4. [`JpaRepository<T, ID>` & CRUD Bawaan](#bagian-4)
5. [Derived Query Methods (Pencarian Otomatis dari Nama Method)](#bagian-5)
6. [Custom Query dengan JPQL & Native SQL](#bagian-6)
7. [Paging & Sorting Data Skala Besar (`Pageable`)](#bagian-7)
8. [Projections (Pengambilan Data Parsial Hemat Memori)](#bagian-8)

### 🟡 Lanjutan

9. [Relasi Many-to-One (`@ManyToOne` & `@JoinColumn`)](#bagian-9)
10. [Relasi One-to-Many (`@OneToMany`, `mappedBy`, `CascadeType.ALL`)](#bagian-10)
11. [Relasi One-to-One (`@OneToOne`) & Many-to-Many (`@ManyToMany`)](#bagian-11)
12. [Strategi Fetching: `FetchType.LAZY` vs `FetchType.EAGER`](#bagian-12)
13. [Bahaya Fatal *N+1 Query Problem* & Solusinya (`JOIN FETCH` & `@EntityGraph`)](#bagian-13)
14. [Database Transactions di Spring: `@Transactional`](#bagian-14)
15. [Pola Soft Delete Modern (`@SQLDelete` & `@SQLRestriction`)](#bagian-15)
16. [Database Migration dengan Flyway](#bagian-16)

### 🔴 Advanced / Operasional

17. [Entity Lifecycle Callbacks (`@PrePersist`, `@PreUpdate`)](#bagian-17)
18. [Optimistic Locking untuk Mencegah Race Condition (`@Version`)](#bagian-18)

### 🛠️ Referensi & Praktik

19. [Peta Ingatan Cepat](#bagian-19)
20. [Tabel Ringkasan](#bagian-20)
21. [Cheat Code Spring Data JPA 10 Detik](#bagian-21)
22. [Urutan Belajar yang Disarankan](#bagian-22)
23. [Mini Project: Production-Ready E-Commerce Store & Order Management Data Layer](#bagian-23)
24. [Referensi Resmi](#bagian-24)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan ORM, Hibernate & Arsitektur Spring Data JPA

#### Konsep

Pada JDBC murni, developer harus menulis query SQL mentah manual, mengekstrak kolom via `rs.getString()` satu per satu, dan mengonversinya secara repetitif.

**Object-Relational Mapping (ORM)** menyelesaikan masalah ini dengan **menjembatani paradigma Object-Oriented (Java) dengan Relational Model (SQL Database)**:
1. **Jakarta Persistence API (JPA):** Spesifikasi standar antarmuka (*Interface*) resmi di Java untuk ORM.
2. **Hibernate:** Engine implementasi konkrit (*Library*) yang menjalankan aturan spesifikasi JPA.
3. **Spring Data JPA:** Abstraksi tingkat tinggi dari Spring yang membungkus Hibernate dan `EntityManager`, sehingga kita cukup mendeklarasikan antarmuka `interface ProductRepository extends JpaRepository<Product, Long>` untuk mendapatkan seluruh operasi database.

#### Cara Kerja

```text
Developer Java ──> JpaRepository.save(entity)
                         │
                         ▼
                  Spring Data JPA
                         │
                         ▼
                  Hibernate Engine ──(Translate to SQL)──> INSERT INTO table (...) VALUES (...)
                         │
                         ▼
                  Database Server
```

**Hafalan:**

```text
Spring Data JPA → library Spring yang mengotomatisasi interaksi dengan database melalui Hibernate ORM
```

---

<a id="bagian-2"></a>

## 2. 🟢 Anatomi Entity Dasar (`@Entity`, `@Table`, `@Id`, `@Column`)

#### Konsep

Sebuah class Java yang dipetakan ke tabel database disebut **Entity**.

Anotasi Dasar Entity:
- **`@Entity`:** Menandai class sebagai tabel database relasional.
- **`@Table(name = "nama_tabel")`:** Menentukan nama tabel di database (jika tidak ditulis, default menggunakan nama class).
- **`@Id`:** Menandai atribut Primary Key unik.
- **`@GeneratedValue(strategy = GenerationType.IDENTITY)`:** Menentukan strategi pembuatan ID otomatis oleh database (*Auto-Increment / Serial*).
- **`@Column(name = "kolom_db", nullable = false, length = 100)`:** Menyesuaikan konfigurasi kolom.

#### Contoh

```java
package com.belajar.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sku_code", nullable = false, unique = true, length = 30)
    private String sku;

    @Column(name = "product_name", nullable = false, length = 150)
    private String name;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "stock_qty", nullable = false)
    private Integer stock;

    // No-Args Constructor (Wajib untuk Hibernate Reflection)
    public Product() {}

    public Product(String sku, String name, Double price, Integer stock) {
        this.sku = sku;
        this.name = name;
        this.price = price;
        this.stock = stock;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
}
```

**Hafalan:**

```text
@Entity                                       → menandai class Java sebagai representasi tabel database
@Id @GeneratedValue(strategy = IDENTITY)      → mendefinisikan Primary Key auto-increment
@Column(nullable = false, unique = true)      → mengatur constraint kolom tabel database
```

---

<a id="bagian-3"></a>

## 3. 🟢 Tipe Data Khusus, Enum & Auditing Otomatis

#### Konsep

1. **Mapping Enum:** Secara default, JPA menyimpan ordinal angka (`0, 1, 2`) yang sangat rawan bug jika urutan enum berubah. **WAJIB gunakan `@Enumerated(EnumType.STRING)`** untuk menyimpan teks nama enumnya.
2. **JPA Auditing Otomatis:** Mengotomatisasi pengisian tanggal pembuatan (*Created Date*) dan tanggal pembaruan (*Last Modified Date*) tanpa perlu diisi manual di kode Service.

#### Contoh

Enum Status:
```java
public enum OrderStatus {
    PENDING, PROCESSING, COMPLETED, CANCELLED
}
```

Entity dengan JPA Auditing:
```java
package com.belajar.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;

@MappedSuperclass // Menurunkan atribut ke class turunan
@EntityListeners(AuditingEntityListener.class) // Aktifkan listener auditing
public abstract class BaseAuditEntity {

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
```

Aktifkan di Main Application:
```java
@SpringBootApplication
@EnableJpaAuditing // Wajib ditambahkan
public class Application {}
```

**Hafalan:**

```text
@Enumerated(EnumType.STRING) → menyimpan nilai enum sebagai teks literal di kolom database
@EnableJpaAuditing           → mengaktifkan pengisian otomatis field @CreatedDate dan @LastModifiedDate
```

---

<a id="bagian-4"></a>

## 4. 🟢 `JpaRepository<T, ID>` & CRUD Bawaan

#### Konsep

Untuk melakukan operasi database pada Entity, kita cukup membuat sebuah Interface yang meng-extends **`JpaRepository<EntityType, IdType>`**.

Spring Data JPA secara otomatis menyediakan implementasi runtime untuk seluruh method standar berikut:

| Method JpaRepository | Aksi SQL yang Dihasilkan | Keterangan |
|---|---|---|
| `save(entity)` | `INSERT` / `UPDATE` | Menyimpan entity baru atau mengupdate jika ID sudah ada |
| `saveAll(entities)` | Batch `INSERT` / `UPDATE` | Menyimpan banyak entity sekaligus |
| `findById(id)` | `SELECT ... WHERE id = ?` | Mengembalikan `Optional<Entity>` |
| `findAll()` | `SELECT ... FROM table` | Mengambil seluruh baris data |
| `existsById(id)` | `SELECT COUNT(1) ...` | Memeriksa apakah data ada (`boolean`) |
| `count()` | `SELECT COUNT(*) ...` | Menghitung total jumlah baris |
| `deleteById(id)` | `DELETE ... WHERE id = ?` | Menghapus data berdasarkan ID |

#### Contoh

```java
package com.belajar.repository;

import com.belajar.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Seluruh operasi CRUD sudah siap dipakai otomatis tanpa menulis 1 baris kode pun!
}
```

Penggunaan di Service Layer:
```java
@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product create(Product p) {
        return productRepository.save(p); // Auto INSERT
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Produk #" + id + " tidak ditemukan!"));
    }
}
```

**Hafalan:**

```text
public interface TargetRepo extends JpaRepository<Entity, IdType> {} → deklarasi instant CRUD repository
repo.save(entity)                                                    → menyimpan entity ke database
repo.findById(id)                                                    → mencari data berdasarkan ID (Optional<T>)
```

---

<a id="bagian-5"></a>

## 5. 🟢 Derived Query Methods (Pencarian Otomatis dari Nama Method)

#### Konsep

Spring Data JPA memiliki mesin parser canggih yang dapat **menerjemahkan nama method Java langsung menjadi query SQL `SELECT` secara otomatis**.

Kata Kunci Pola Penamaan (*Method Naming Conventions*):
- `findBy[Property]` : `findByEmail(String email)`
- `findBy[PropA]And[PropB]` : `findByCategoryAndStatus(String cat, String status)`
- `findBy[Prop]Containing` : `findByNameContaining(String keyword)` (Pencarian `LIKE %keyword%`)
- `findBy[Prop]IgnoreCase` : `findBySkuIgnoreCase(String sku)`
- `findBy[Prop]GreaterThan` / `Between` : `findByPriceBetween(Double min, Double max)`
- `countBy[Property]` : `countByStatus(String status)`
- `existsBy[Property]` : `existsByEmail(String email)`

#### Contoh

```java
package com.belajar.repository;

import com.belajar.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // SELECT * FROM products WHERE sku_code = ?
    Optional<Product> findBySku(String sku);

    // SELECT * FROM products WHERE LOWER(product_name) LIKE LOWER('%' || ? || '%')
    List<Product> findByNameContainingIgnoreCase(String keyword);

    // SELECT * FROM products WHERE price >= ? AND stock_qty > ?
    List<Product> findByPriceGreaterThanEqualAndStockGreaterThan(Double minPrice, Integer minStock);

    // SELECT COUNT(1) > 0 FROM products WHERE sku_code = ?
    boolean existsBySku(String sku);
}
```

**Hafalan:**

```text
findByProperty(val)              → menghasilkan query SELECT ... WHERE property = val secara otomatis
findByPropertyContaining(str)    → menghasilkan query SELECT ... WHERE property LIKE '%str%'
existsByProperty(val)            → menghasilkan query pengecekan keberadaan data (return boolean)
```

---

<a id="bagian-6"></a>

## 6. 🟢 Custom Query dengan JPQL & Native SQL

#### Konsep

Jika query terlalu rumit untuk dinyatakan dengan nama method panjang (*Derived Query*), gunakan anotasi **`@Query`**:

1. **JPQL (Java Persistence Query Language - DEFAULT & REKOMENDASI):**
   - Query ditulis berdasarkan **Nama Class Entity dan Nama Atribut Java**, bukan nama tabel fisik SQL.
   - Bersifat *database-agnostic* (query yang sama bisa jalan di PostgreSQL, MySQL, Oracle).
2. **Native SQL (`nativeQuery = true`):**
   - Query ditulis dalam sintaks SQL mentah spesifik database engine.
3. **Modifying Queries (`@Modifying` + `@Transactional`):**
   - Wajib ditambahkan jika query bertipe `UPDATE` atau `DELETE` kustom.

#### Contoh

```java
package com.belajar.repository;

import com.belajar.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // 1. JPQL Query (Menggunakan Nama Entity 'Product' dan Atribut 'price')
    @Query("SELECT p FROM Product p WHERE p.price >= :minPrice AND p.stock > 0 ORDER BY p.price DESC")
    List<Product> findAvailableExpensiveProducts(@Param("minPrice") Double minPrice);

    // 2. Modifying Query (Custom UPDATE)
    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.stock = p.stock - :qty WHERE p.id = :id AND p.stock >= :qty")
    int deductStock(@Param("id") Long id, @Param("qty") Integer qty);

    // 3. Native SQL Query
    @Query(value = "SELECT * FROM products WHERE price > 1000000 LIMIT 5", nativeQuery = true)
    List<Product> findTop5ExpensiveNative();
}
```

**Hafalan:**

```text
@Query("SELECT e FROM Entity e WHERE e.field = :param") → menulis custom query berbasis objek (JPQL)
@Param("param")                                        → memetakan parameter method ke placeholder named parameter di query
@Modifying @Transactional                              → wajib untuk custom query UPDATE dan DELETE
```

---

<a id="bagian-7"></a>

## 7. 🟢 Paging & Sorting Data Skala Besar (`Pageable`)

#### Konsep

Mengambil ribuan atau jutaan data sekaligus (`findAll()`) akan menghabiskan memori RAM aplikasi (*OutOfMemoryError*).

Gunakan abstraksi **`Pageable`** untuk melakukan paginasi data dan pengurutan secara efisien di level database (`LIMIT` & `OFFSET` otomatis):
- **`PageRequest.of(page, size, Sort)`:** Membuat objek Pageable (indeks halaman `page` dimulai dari angka 0).
- **`Page<T>`:** Menampung baris data beserta metadata pagination lengkap (`getTotalElements()`, `getTotalPages()`, `hasNext()`).
- **`Slice<T>`:** Menampung data tanpa menghitung total count keseluruhan (sangat cepat untuk *Infinite Scroll*).

#### Contoh

Repository:
```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByNameContaining(String keyword, Pageable pageable);
}
```

Service Layer:
```java
package com.belajar.service;

import com.belajar.entity.Product;
import com.belajar.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class ProductPaginationService {
    private final ProductRepository productRepository;

    public ProductPaginationService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Page<Product> getProductsPaged(int pageNumber, int pageSize) {
        // Halaman 0, Ukuran 10, Urutkan berdasarkan harga termurah
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("price").ascending());

        Page<Product> productPage = productRepository.findAll(pageable);

        System.out.println("Total Baris Data : " + productPage.getTotalElements());
        System.out.println("Total Halaman    : " + productPage.getTotalPages());
        System.out.println("Nomor Halaman Ini: " + productPage.getNumber());

        return productPage;
    }
}
```

**Hafalan:**

```text
PageRequest.of(page, size, Sort.by(column)) → membuat parameter paginasi (page dimulai dari 0)
Page<Entity> result = repo.findAll(pageable) → mengambil data terpangkas halaman beserta total count metadata
```

---

<a id="bagian-8"></a>

## 8. 🟢 Projections (Pengambilan Data Parsial Hemat Memori)

#### Konsep

Jika sebuah Entity memiliki 30 kolom, tetapi Anda hanya membutuhkan 2 kolom (misal: `id` dan `name` untuk dropdown list), meload seluruh Entity akan membuang memori dan bandwidth database.

**Projections** memungkinkan kita mengambil subset kolom spesifik:
1. **Interface-based Projection (Closed Projection):** Mendefinisikan antarmuka getter.
2. **DTO Projection:** Menggunakan JPQL Constructor Expression (`SELECT new com.dto.ItemSummary(p.id, p.name) FROM Product p`).

#### Contoh

Interface Projection:
```java
package com.belajar.dto;

public interface ProductSummaryProjection {
    Long getId();
    String getName();
    Double getPrice();
}
```

Repository:
```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<ProductSummaryProjection> findAllProjectedBy();
}
```

**Hafalan:**

```text
Projections → teknik mengambil sebagian kolom spesifik untuk optimasi performa dan memori
```

---

<a id="bagian-9"></a>

## 9. 🟡 Relasi Many-to-One (`@ManyToOne` & `@JoinColumn`)

#### Konsep

Relasi **Many-to-One** adalah relasi di mana **banyak baris di tabel anak terhubung ke satu baris di tabel induk** (contoh: Banyak Produk dimiliki oleh 1 Kategori).

Anotasi Penting:
- **`@ManyToOne(fetch = FetchType.LAZY)`:** Menandai relasi Many-to-One (Wajib sertakan `FetchType.LAZY`).
- **`@JoinColumn(name = "category_id", nullable = false)`:** Menentukan nama kolom Foreign Key di tabel anak.

#### Contoh

Entity Induk (Category):
```java
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    // Getters & Setters
}
```

Entity Anak (Product):
```java
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // Relasi Many-to-One ke Kategori
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    // Getters & Setters
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
}
```

#### Cara Kerja

```text
Tabel products                Tabel categories
┌────┬─────────┬─────────────┐     ┌────┬─────────────┐
│ id │ name    │ category_id │ ──> │ id │ name        │
├────┼─────────┼─────────────┤     ├────┼─────────────┤
│ 1  │ Laptop  │ 10 (FK)     │     │ 10 │ Elektronik  │
│ 2  │ Mouse   │ 10 (FK)     │     └────┴─────────────┘
└────┴─────────┴─────────────┘
```

**Hafalan:**

```text
@ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "foreign_key_id") → memetakan Foreign Key dari tabel anak ke induk
```

---

<a id="bagian-10"></a>

## 10. 🟡 Relasi One-to-Many (`@OneToMany`, `mappedBy`, `CascadeType.ALL`)

#### Konsep

Relasi **One-to-Many** adalah kebalikan dari Many-to-One (satu induk memiliki daftar koleksi anak, misal: 1 Order memiliki banyak OrderItem).

Atribut Krusial:
- **`mappedBy = "order"`:** Menandakan bahwa sisi `OrderItem` yang menjadi pemilik Foreign Key (*Owner of Relationship*).
- **`cascade = CascadeType.ALL`:** Operasi `save()` atau `delete()` pada induk otomatis diterapkan ke seluruh item anaknya.
- **`orphanRemoval = true`:** Jika anak dihapus dari list koleksi Java (`items.remove(0)`), baris data anak tersebut otomatis dihapus dari database (`DELETE`).

#### Contoh

```java
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;

    // Relasi One-to-Many Dua Arah (Bidirectional)
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrderItem> items = new ArrayList<>();

    // Helper Method untuk menjaga konsistensi relasi dua arah
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }

    // Getters & Setters
}
```

**Hafalan:**

```text
@OneToMany(mappedBy = "parentField", cascade = CascadeType.ALL, orphanRemoval = true) → relasi 1 induk ke banyak anak
```

---

<a id="bagian-11"></a>

## 11. 🟡 Relasi One-to-One (`@OneToOne`) & Many-to-Many (`@ManyToMany`)

#### Konsep

- **`@OneToOne`:** Tepat satu induk terhubung ke tepat satu anak (misal: `User` memiliki 1 `UserProfile`).
- **`@ManyToMany`:** Banyak entitas A terhubung ke banyak entitas B (misal: `Mahasiswa` dan `MataKuliah`). Menggunakan tabel perantara (*Junction Table*) via **`@JoinTable`**.

#### Contoh Many-to-Many

```java
@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "student_courses",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> courses = new HashSet<>();
}
```

**Hafalan:**

```text
@ManyToMany + @JoinTable(name = "junction_table") → memetakan relasi banyak-ke-banyak melalui tabel perantara
```

---

<a id="bagian-12"></a>

## 12. 🟡 Strategi Fetching: `FetchType.LAZY` vs `FetchType.EAGER`

#### Konsep

- **`FetchType.EAGER` (HINDARI / BAHAYA BESAR):**
  - Data relasi anak **selalu di-load seketika** saat entity induk diambil dari database, meskipun Anda tidak membutuhkannya.
  - Memicu query `JOIN` raksasa yang lambat atau ratusan query tersembunyi.
- **`FetchType.LAZY` (STANDAR EMAS INDUSTRI / REKOMENDASI MUTLAK):**
  - Data relasi anak **tidak di-load ke memori** sampai method getter-nya dipanggil (`order.getItems()`).
  - Hibernate memasang objek bayangan (*Hibernate Proxy*) di field tersebut.

> [!IMPORTANT]
> Secara default:
> - `@OneToMany` dan `@ManyToMany` adalah **LAZY** (Bagus).
> - `@ManyToOne` dan `@OneToOne` adalah **EAGER** (Bahaya!). **Anda WAJIB mengubahnya secara eksplisit menjadi `(fetch = FetchType.LAZY)`**.

**Hafalan:**

```text
fetch = FetchType.LAZY → memuat data relasi hanya saat dibutuhkan untuk menghemat CPU, RAM, dan I/O
```

---

<a id="bagian-13"></a>

## 13. 🟡 Bahaya Fatal *N+1 Query Problem* & Solusinya (`JOIN FETCH` & `@EntityGraph`)

#### Konsep

**N+1 Query Problem** terjadi ketika Anda mengambil daftar $N$ baris data induk (misal: 100 Produk), lalu saat melakukan loop untuk mengakses nama Kategori produk tersebut, Hibernate mengeksekusi **100 query tambahan secara terpisah** ke database. Total query: $1 + 100 = 101$ query! Ini membuat database overload dan response aplikasi sangat lambat.

Dua Solusi Resmi Mengatasi N+1 Problem:
1. **`JOIN FETCH` pada JPQL:** Memerintahkan Hibernate meload induk dan relasi anak sekaligus dalam **1 kali query SQL JOIN tunggal**.
2. **`@EntityGraph(attributePaths = {"..."})`:** Solusi deklaratif modern tanpa perlu menulis query JPQL manual.

#### Contoh

```java
package com.belajar.repository;

import com.belajar.entity.Product;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // SOLUSI 1: JPQL JOIN FETCH (Load Product beserta Category dalam 1 Query Bersih)
    @Query("SELECT p FROM Product p JOIN FETCH p.category")
    List<Product> findAllWithCategoryViaJoinFetch();

    // SOLUSI 2: @EntityGraph (Elegan & Deklaratif)
    @EntityGraph(attributePaths = {"category"})
    @Query("SELECT p FROM Product p")
    List<Product> findAllWithCategoryViaEntityGraph();
}
```

#### Cara Kerja

```text
Tanpa JOIN FETCH (N+1 Query):
Query 1: SELECT * FROM products (Dapat 100 baris)
Query 2: SELECT * FROM categories WHERE id = 1
Query 3: SELECT * FROM categories WHERE id = 2
... (100 kali query database berulang!)

Dengan JOIN FETCH (1 Single Query):
Query 1: SELECT p.*, c.* FROM products p INNER JOIN categories c ON p.category_id = c.id
(Selesai dalam 1 Network Round-Trip!)
```

**Hafalan:**

```text
@Query("SELECT p FROM Product p JOIN FETCH p.relation") → meload data relasi dalam 1 query JOIN (Solusi N+1)
@EntityGraph(attributePaths = {"relationName"})         → instruksi deklaratif Spring untuk fetch join otomatis
```

---

<a id="bagian-14"></a>

## 14. 🟡 Database Transactions di Spring: `@Transactional`

#### Konsep

Anotasi **`@Transactional`** di level class Service atau method memastikan seluruh operasi database di dalamnya berjalan secara **ACID**:
1. **Commit Otomatis:** Jika method selesai dieksekusi tanpa error $\rightarrow$ seluruh perubahan disimpan permanen ke database.
2. **Rollback Otomatis:** Jika terjadi **`RuntimeException` (Unchecked Exception)** $\rightarrow$ seluruh perubahan otomatis dibatalkan.
3. **`readOnly = true`:** Optimasi performa untuk query `SELECT` (Hibernate menonaktifkan *Dirty Checking Snapshot* sehingga hemat memori).

#### Contoh

```java
package com.belajar.service;

import com.belajar.entity.Order;
import com.belajar.repository.OrderRepository;
import com.belajar.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderTransactionService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderTransactionService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    // Transaksi Modifikasi Data
    @Transactional(rollbackFor = Exception.class)
    public void processOrder(Order order, Long productId, int qty) {
        // 1. Potong Stok Produk
        int updated = productRepository.deductStock(productId, qty);
        if (updated == 0) {
            throw new IllegalStateException("Stok produk tidak mencukupi!"); // Memicu Rollback Otomatis!
        }

        // 2. Simpan Pesanan
        orderRepository.save(order);
    }

    // Transaksi Khusus Pembacaan Data (Optimasi Performa)
    @Transactional(readOnly = true)
    public Order getOrderDetails(Long id) {
        return orderRepository.findById(id).orElseThrow();
    }
}
```

**Hafalan:**

```text
@Transactional                          → mengelola batas transaksi database secara otomatis (Commit/Rollback)
@Transactional(readOnly = true)         → optimasi transaksi khusus baca tanpa overhead dirty checking
@Transactional(rollbackFor = Exception) → memastikan rollback terjadi untuk semua jenis exception
```

---

<a id="bagian-15"></a>

## 15. 🟡 Pola Soft Delete Modern (`@SQLDelete` & `@SQLRestriction`)

#### Konsep

Dalam aplikasi bisnis, data penting (seperti Produk, User, Transaksi) **tidak boleh benar-benar dihapus permanen dari harddisk (`HARD DELETE`)**. Kita menggunakan **Soft Delete** (mengubah kolom `deleted_at` atau `is_deleted = true`).

Di Hibernate 6 / Spring Boot 3, Soft Delete diimplementasikan sangat elegan:
- **`@SQLDelete(sql = "UPDATE products SET is_deleted = true WHERE id = ?")`:** Mengubah perilaku method bawaan `repo.deleteById()` menjadi UPDATE.
- **`@SQLRestriction("is_deleted = false")`:** Otomatis menyuntikkan filter `WHERE is_deleted = false` pada seluruh operasi `SELECT`, `findAll()`, dan relasi tanpa perlu ditulis manual.

#### Contoh

```java
package com.belajar.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "products")
@SQLDelete(sql = "UPDATE products SET is_deleted = true WHERE id = ?") // Override deleteById
@SQLRestriction("is_deleted = false") // Otomatis filter query SELECT
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "is_deleted", nullable = false)
    private boolean deleted = false;

    // Getters & Setters
}
```

**Hafalan:**

```text
@SQLDelete(sql = "UPDATE ...")   → mengalihkan instruksi DELETE menjadi query soft delete
@SQLRestriction("condition")     → menyaring query SELECT secara global hanya untuk data aktif
```

---

<a id="bagian-16"></a>

## 16. 🟡 Database Migration dengan Flyway

#### Konsep

Dalam lingkungan production, kita **DILARANG menggunakan `spring.jpa.hibernate.ddl-auto=update`** karena rawan merusak data.

Standar industri mewajibkan penggunaan alat migrasi basis data seperti **Flyway**:
1. Seluruh perubahan skema tabel ditulis dalam file script SQL berversi di folder `src/main/resources/db/migration/`.
2. Format penamaan file: **`V1__init_schema.sql`**, **`V2__add_index_to_users.sql`** (Huruf `V`, nomor versi, dua garis bawah `__`, lalu deskripsi).
3. Saat aplikasi menyala, Flyway otomatis mendeteksi dan mengeksekusi script SQL yang belum pernah dijalankan secara berurutan.

#### Contoh Script SQL (`V1__init_schema.sql`)

```sql
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES categories(id),
    sku_code VARCHAR(30) NOT NULL UNIQUE,
    product_name VARCHAR(150) NOT NULL,
    price NUMERIC(15, 2) NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Hafalan:**

```text
Flyway Migration → alat version control skema database otomatis menggunakan file script SQL terstruktur
```

---

<a id="bagian-17"></a>

## 17. 🔴 Entity Lifecycle Callbacks (`@PrePersist`, `@PreUpdate`)

#### Konsep

JPA menyediakan anotasi callback untuk menyisipkan logika bisnis tepat sebelum data disimpan atau diupdate ke database:
- **`@PrePersist`:** Dijalankan sesaat sebelum entity pertama kali di-INSERT.
- **`@PreUpdate`:** Dijalankan sesaat sebelum entity di-UPDATE.
- **`@PostLoad`:** Dijalankan sesaat setelah data selesai di-SELECT dari database.

#### Contoh

```java
@PrePersist
public void onBeforeInsert() {
    if (this.sku != null) {
        this.sku = this.sku.toUpperCase().trim();
    }
}
```

**Hafalan:**

```text
@PrePersist → method callback yang otomatis dieksekusi sebelum perintah INSERT dijalankan
```

---

<a id="bagian-18"></a>

## 18. 🔴 Optimistic Locking untuk Mencegah Race Condition (`@Version`)

#### Konsep

Ketika dua pengguna membuka halaman edit produk yang sama secara bersamaan dan sama-sama menekan tombol "Simpan", pengguna kedua dapat menimpa perubahan pengguna pertama tanpa sadar (*Lost Update Anomaly*).

**Optimistic Locking** menyelesaikan masalah ini menggunakan kolom versi angka:
- Tambahkan field **`@Version private Long version;`** di Entity.
- Hibernate otomatis memeriksa versi saat `UPDATE`. Jika versi di database sudah berubah lebih tinggi, Hibernate membatalkan update dan melempar **`ObjectOptimisticLockingFailureException`**.

#### Contoh

```java
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version // Kolom pelindung concurrency race condition
    private Long version;

    private String name;
    private Double price;
}
```

**Hafalan:**

```text
@Version → mengaktifkan mekanisme Optimistic Locking untuk mencegah anomali data tertimpa bersamaan
```

---

<a id="bagian-19"></a>

## 19. 🛠️ Peta Ingatan Cepat

```text
                       PETA ARSITEKTUR SPRING DATA JPA
                                      │
       ┌──────────────────────────────┼──────────────────────────────┐
       ▼                              ▼                              ▼
ENTITY & MAPPING              QUERY & REPOSITORY             RELASI & OPTIMASI
├─ @Entity & @Table           ├─ JpaRepository<T, ID>        ├─ @ManyToOne (LAZY)
├─ @Id & @GeneratedValue      ├─ Derived Query (findBy...)   ├─ @OneToMany (mappedBy)
├─ @Column & @Enumerated      ├─ @Query (JPQL & Native)      ├─ Solusi N+1: JOIN FETCH
└─ @CreatedDate / Auditing    └─ Pageable & Sort             └─ @Transactional (ACID)
```

---

<a id="bagian-20"></a>

## 20. 📚 Tabel Ringkasan

| Anotasi / Interface | Lokasi Target | Fungsi & Karakteristik Utama |
|---|---|---|
| `@Entity` | Class | Menandai class sebagai representasi tabel database relasional |
| `@Table(name = "...")` | Class | Menyesuaikan nama tabel fisik database |
| `@Id` | Field | Menandai atribut Primary Key |
| `@GeneratedValue` | Field | Mengatur strategi auto-increment ID (`IDENTITY`) |
| `@Enumerated(STRING)` | Field | Menyimpan nilai Enum sebagai teks string di database |
| `JpaRepository<T, ID>`| Interface | Menyediakan operasi CRUD, paging, dan sorting bawaan |
| `@Query` | Method Repo | Menulis custom query JPQL atau Native SQL |
| `@ManyToOne` | Field | Relasi banyak anak ke satu induk (Wajib `FetchType.LAZY`) |
| `@OneToMany` | Field | Relasi satu induk ke banyak anak (Atribut `mappedBy`) |
| `@Transactional` | Class / Method | Mengelola transaksi ACID otomatis (Commit / Rollback) |
| `@SQLRestriction` | Class | Menambahkan klausa filter WHERE otomatis (Soft Delete) |
| `@Version` | Field | Mengaktifkan perlindungan Optimistic Locking |

---

<a id="bagian-21"></a>

## 21. ⚡ Cheat Code Spring Data JPA 10 Detik

```java
// 1. Template Entity Standar dengan Auditing & Soft Delete
@Entity
@Table(name = "products")
@SQLRestriction("is_deleted = false")
public class Product extends BaseAuditEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, unique = true)
    private String sku;
}

// 2. Template Repository dengan Derived & JOIN FETCH
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);

    @Query("SELECT p FROM Product p JOIN FETCH p.category WHERE p.price >= :min")
    List<Product> findExpensive(@Param("min") Double min);
}
```

---

<a id="bagian-22"></a>

## 22. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Kuasai Entity Mapping & CRUD Dasar
├── Pahami @Entity, @Table, @Id, dan @Column
└── Gunakan JpaRepository<T, ID> untuk operasi CRUD tanpa SQL
       │
       ▼
Langkah 2: Kuasai Query Methods & Pagination
├── Biasakan penamaan Derived Query Methods (findBy...)
├── Kuasai sintaks JPQL berbasis class objek
└── Terapkan Pageable dan Page<T> untuk data besar
       │
       ▼
Langkah 3: Kuasai Relasi Antar Tabel & Kinerja
├── Gunakan @ManyToOne dan @OneToMany(mappedBy)
├── Selalu gunakan FetchType.LAZY
└── Tuntaskan bahaya N+1 Query Problem dengan JOIN FETCH
       │
       ▼
Langkah 4: Manajemen Transaksi & Migrasi Production
├── Terapkan @Transactional pada Service Layer
└── Kelola skema tabel database menggunakan Flyway Migration
       │
       ▼
Langkah 5: Siap Melangkah ke Keamanan API dengan Spring Security & JWT!
```

---

<a id="bagian-23"></a>

## 23. 🏗️ Mini Project: Production-Ready E-Commerce Store & Order Management Data Layer

Lapisan data persistence lengkap yang mengintegrasikan: **Entity Kategori, Produk, Pesanan, dan ItemPesanan dengan Relasi `@ManyToOne` & `@OneToMany`, JpaRepository, Derived Queries, Pagination, Solusi N+1 `JOIN FETCH`, Soft Delete `@SQLRestriction`, dan `@Transactional` Service**.

```java
package com.belajar.store;

import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

// ==========================================
// 1. ENTITY CATEGORY (INDUK)
// ==========================================
@Entity
@Table(name = "categories")
class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    public Category() {}
    public Category(String name) { this.name = name; }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}

// ==========================================
// 2. ENTITY PRODUCT (MANY-TO-ONE DENGAN SOFT DELETE)
// ==========================================
@Entity
@Table(name = "products")
@SQLDelete(sql = "UPDATE products SET is_deleted = true WHERE id = ?")
@SQLRestriction("is_deleted = false")
class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String sku;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer stock;

    @Column(name = "is_deleted", nullable = false)
    private boolean deleted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    public Product() {}
    public Product(String sku, String name, Double price, Integer stock, Category category) {
        this.sku = sku;
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.category = category;
    }

    public Long getId() { return id; }
    public String getSku() { return sku; }
    public String getName() { return name; }
    public Double getPrice() { return price; }
    public Integer getStock() { return stock; }
    public Category getCategory() { return category; }
}

// ==========================================
// 3. REPOSITORY INTERFACES
// ==========================================
@Repository
interface CategoryRepository extends JpaRepository<Category, Long> {}

@Repository
interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);

    // Mencegah N+1 Problem dengan JOIN FETCH
    @Query("SELECT p FROM Product p JOIN FETCH p.category WHERE p.price >= :minPrice")
    List<Product> findExpensiveProductsWithCategory(@Param("minPrice") Double minPrice);

    @Modifying
    @Query("UPDATE Product p SET p.stock = p.stock - :qty WHERE p.id = :id AND p.stock >= :qty")
    int deductStock(@Param("id") Long id, @Param("qty") Integer qty);
}

// ==========================================
// 4. TRANSACTIONAL SERVICE LAYER
// ==========================================
@Service
class StoreCatalogService {
    private final CategoryRepository categoryRepo;
    private final ProductRepository productRepo;

    public StoreCatalogService(CategoryRepository categoryRepo, ProductRepository productRepo) {
        this.categoryRepo = categoryRepo;
        this.productRepo = productRepo;
    }

    @Transactional
    public void seedInitialData() {
        Category gadget = categoryRepo.save(new Category("Gadget & Komputer"));
        Category fashion = categoryRepo.save(new Category("Fashion Pria"));

        productRepo.saveAll(List.of(
            new Product("SKU-LAPTOP", "MacBook Pro M3", 26_000_000.0, 5, gadget),
            new Product("SKU-MOUSE", "Logitech MX Master", 1_500_000.0, 12, gadget),
            new Product("SKU-JAKET", "Jaket Denim Vintage", 450_000.0, 20, fashion)
        ));
    }

    @Transactional(readOnly = true)
    public void demonstrasiQueryDanJoinFetch() {
        System.out.println("\n--- 1. DEMO JOIN FETCH (Bebas N+1 Problem) ---");
        List<Product> products = productRepo.findExpensiveProductsWithCategory(1_000_000.0);
        products.forEach(p -> 
            System.out.printf("📦 [%s] %-20s | Kategori: %-18s | Harga: Rp %,.2f%n", 
                p.getSku(), p.getName(), p.getCategory().getName(), p.getPrice()));

        System.out.println("\n--- 2. DEMO PAGINATION ---");
        Page<Product> page = productRepo.findAll(PageRequest.of(0, 2, Sort.by("price").descending()));
        System.out.printf("Halaman 1 dari %d Halaman (Total: %d Produk):%n", page.getTotalPages(), page.getTotalElements());
        page.getContent().forEach(p -> System.out.printf("- %s (Rp %,.2f)%n", p.getName(), p.getPrice()));
    }

    @Transactional
    public void demoSoftDelete(Long productId) {
        System.out.println("\n--- 3. DEMO SOFT DELETE ---");
        productRepo.deleteById(productId); // Menjalankan UPDATE is_deleted = true
        System.out.println("✅ Produk ID #" + productId + " berhasil di-soft delete.");
        System.out.println("Total Produk Aktif Sekarang: " + productRepo.count());
    }
}

// ==========================================
// 5. MAIN ENTRY POINT & RUNNER
// ==========================================
@SpringBootApplication
public class JpaStoreApplication {
    public static void main(String[] args) {
        SpringApplication.run(JpaStoreApplication.class, args);
    }

    @Bean
    public CommandLineRunner runDemo(StoreCatalogService catalogService) {
        return args -> {
            System.out.println("==================================================");
            System.out.println("   SPRING DATA JPA & HIBERNATE ENTERPRISE DATA    ");
            System.out.println("==================================================");

            catalogService.seedInitialData();
            catalogService.demonstrasiQueryDanJoinFetch();
            catalogService.demoSoftDelete(2L); // Soft delete mouse

            System.out.println("==================================================");
        };
    }
}
```

#### Output Demonstrasi

```text
==================================================
   SPRING DATA JPA & HIBERNATE ENTERPRISE DATA    
==================================================

--- 1. DEMO JOIN FETCH (Bebas N+1 Problem) ---
📦 [SKU-LAPTOP] MacBook Pro M3       | Kategori: Gadget & Komputer  | Harga: Rp 26,000,000.00
📦 [SKU-MOUSE] Logitech MX Master    | Kategori: Gadget & Komputer  | Harga: Rp 1,500,000.00

--- 2. DEMO PAGINATION ---
Halaman 1 dari 2 Halaman (Total: 3 Produk):
- MacBook Pro M3 (Rp 26,000,000.00)
- Logitech MX Master (Rp 1,500,000.00)

--- 3. DEMO SOFT DELETE ---
✅ Produk ID #2 berhasil di-soft delete.
Total Produk Aktif Sekarang: 2
==================================================
```

---

<a id="bagian-24"></a>

## 24. 🔗 Referensi Resmi

- [Spring Data JPA Reference Documentation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [Hibernate ORM 6.x User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html)
- [Jakarta Persistence (JPA) Specification](https://jakarta.ee/specifications/persistence/)
- [Flyway Database Migrations Guide](https://documentation.red-gate.com/fd/quickstart-how-flyway-works-184127223.html)
