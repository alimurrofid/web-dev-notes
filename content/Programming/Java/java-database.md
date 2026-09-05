---
title: "Java Database (JDBC)"
description: "Konektivitas database Java via JDBC: DriverManager, DataSource, Connection, Statement, PreparedStatement, ResultSet, Transaction, dan Connection Pooling (HikariCP)."
order: 6
tags:
  - programming
  - java
  - jdbc
  - database
---

# Java Database (JDBC)

> **Target:** Pemula yang telah memahami Java dasar, OOP, Generic, dan Collection, serta ingin menguasai koneksi dan transaksi database relasional (**RDBMS**) menggunakan **Java Database Connectivity (JDBC 4.3+)** dan **HikariCP Connection Pool** (Java 21 LTS).
> **Versi:** JDBC 4.x / Java 17+
> **Prasyarat:** [[java-oop|Java OOP]]
> Fokus modul pembelajaran ini: **arsitektur driver JDBC → DriverManager vs DataSource → Try-with-Resources resource safety → PreparedStatement & SQL Injection → ResultSet mapping ke Records → Auto-Generated Keys → Batch Updates → ACID Transactions & Savepoints → Isolation Levels → HikariCP Connection Pooling → Repository Pattern DAO → mini project sistem reservasi & transaksi**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami untuk membuka koneksi, mengeksekusi query aman via PreparedStatement, dan mapping ResultSet

🟡 Lanjutan
→ pelajari setelah memahami query dasar: auto-generated keys, batch processing, transaksi ACID, dan savepoint

🔴 Advanced / Operasional
→ penting untuk arsitektur production: HikariCP Connection Pooling, Repository DAO Pattern, dan error codes
```

Mental model alur komunikasi data antara Aplikasi Java dan Database Server:

```text
               Aplikasi Java (Domain / Service Layer)
                                │
                                ▼
                   JDBC API (java.sql.* / javax.sql.*)
                                │
                                ▼
                HikariCP Pool / DriverManager
                                │
                                ▼
            JDBC Driver (mysql-connector / postgresql)
                                │
                                ▼  TCP Network Socket
       ┌─────────────────────────────────────────────────┐
       │                 DATABASE SERVER                 │
       │    SQL Parser ──> Query Engine ──> Storage      │
       └─────────────────────────────────────────────────┘
```

**Hafalan:**

```text
JDBC         → Java Database Connectivity: spesifikasi API standar Java untuk mengakses RDBMS
Driver       → library jembatan yang menerjemahkan panggilan JDBC ke protokol binary spesifik vendor database
Connection   → sesi saluran komunikasi aktif antara aplikasi Java dan server database
Statement    → objek eksekutor query SQL statis tanpa parameterisasi (rentan SQL Injection)
PreparedStatement → objek eksekutor query SQL ter-pra-kompilasi dan berparameter aman
ResultSet    → representasi tabel hasil query SELECT dengan kursor baris data
Transaction  → rangkaian operasi SQL yang dieksekusi sebagai satu kesatuan atomik (Commit / Rollback)
HikariCP     → library connection pooling modern berkecepatan tinggi standar Spring Boot
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan JDBC & Mental Model Arsitektur Driver](#bagian-1)
2. [Struktur Interface Inti JDBC](#bagian-2)
3. [Membuat Koneksi Database via `DriverManager`](#bagian-3)
4. [Manajemen Resource Otomatis dengan *Try-with-Resources*](#bagian-4)
5. [`Statement` vs `PreparedStatement` & Bahaya Fatal SQL Injection](#bagian-5)
6. [Eksekusi Query DML (`INSERT`, `UPDATE`, `DELETE`) & `executeUpdate()`](#bagian-6)
7. [Eksekusi Query DQL (`SELECT`) & Navigasi `ResultSet`](#bagian-7)
8. [Mapping `ResultSet` ke Java Model / Record Entity](#bagian-8)

### 🟡 Lanjutan

9. [Menangani Nilai NULL pada `ResultSet` (`wasNull()` & Wrapper Class)](#bagian-9)
10. [Mengambil Auto-Generated Keys (Primary Key Auto-Increment ID)](#bagian-10)
11. [Batch Processing untuk Efisiensi Masif (`addBatch` & `executeBatch`)](#bagian-11)
12. [Database Transactions Dasar (ACID, `setAutoCommit`, `commit`, `rollback`)](#bagian-12)
13. [Savepoint pada Transaksi Bertingkat](#bagian-13)
14. [Transaction Isolation Levels (`READ_COMMITTED`, `REPEATABLE_READ`, `SERIALIZABLE`)](#bagian-14)
15. [Metadata Database & ResultSet (`DatabaseMetaData` & `ResultSetMetaData`)](#bagian-15)
16. [`CallableStatement` (Stored Procedure & Parameter `OUT`)](#bagian-16)

### 🔴 Advanced / Operasional

17. [Masalah Koneksi Konvensional & Konsep Connection Pooling](#bagian-17)
18. [Connection Pooling Modern dengan HikariCP](#bagian-18)
19. [Repository Pattern / DAO (Data Access Object) Murni](#bagian-19)
20. [SQLException Handling & Error Codes](#bagian-20)

### 🛠️ Referensi & Praktik

21. [Peta Ingatan Cepat](#bagian-21)
22. [Tabel Ringkasan](#bagian-22)
23. [Cheat Code Java JDBC 10 Detik](#bagian-23)
24. [Urutan Belajar yang Disarankan](#bagian-24)
25. [Mini Project: Production-Ready Store Repository & Order Transaction Manager CLI dengan HikariCP](#bagian-25)
26. [Referensi Resmi](#bagian-26)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan JDBC & Mental Model Arsitektur Driver

#### Konsep

**Java Database Connectivity (JDBC)** adalah API standar di Java (`java.sql` dan `javax.sql`) yang mendefinisikan antarmuka universal bagi aplikasi Java untuk berinteraksi dengan berbagai jenis sistem basis data relasional (*Relational Database Management System / RDBMS*).

Komponen pembentuk arsitektur JDBC:
1. **JDBC API:** Kumpulan antarmuka standar yang disediakan oleh JDK (`Connection`, `Statement`, `ResultSet`).
2. **JDBC Driver Manager:** Pemandu yang memuat dan memilih driver database yang sesuai.
3. **JDBC Driver:** Driver pihak ketiga (*library jar*) yang disediakan oleh vendor database (misal: MySQL Connector/J, PostgreSQL JDBC Driver) untuk menerjemahkan instruksi JDBC ke protokol jaringan spesifik database tersebut.
4. **Database Server:** Server target (MySQL, PostgreSQL, Oracle, SQLite, H2).

#### Contoh

Contoh menambahkan dependensi JDBC Driver pada build tool modern (Gradle / Maven):

```xml
<!-- Maven Dependency Contoh: MySQL Connector / PostgreSQL -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.3.0</version>
</dependency>
```

#### Cara Kerja

```text
               Aplikasi Java Developer
                          │
                          ▼
             Panggil java.sql.Connection
                          │
                          ▼
            JDBC Driver (Vendor Implementation)
                          │
             ┌────────────┴────────────┐
             ▼                         ▼
      MySQL Protocol           PostgreSQL Protocol
      (Port 3306)              (Port 5432)
```

**Hafalan:**

```text
JDBC API    → antarmuka standar JDK untuk operasi database
JDBC Driver → implementasi konkrit dari vendor database untuk berkomunikasi via socket network
```

---

<a id="bagian-2"></a>

## 2. 🟢 Struktur Interface Inti JDBC

#### Konsep

Terdapat 7 antarmuka dan class fundamental yang membentuk alur kerja utama di JDBC:

1. **`Driver`:** Antarmuka dasar yang diimplementasikan oleh vendor driver database.
2. **`DriverManager`:** Class pengelola daftar driver dan pembuat koneksi database.
3. **`DataSource`:** Antarmuka tingkat lanjut pengganti `DriverManager` yang mendukung *Connection Pooling* dan *Distributed Transactions*.
4. **`Connection`:** Representasi sesi koneksi aktif dengan server database.
5. **`Statement` & `PreparedStatement`:** Objek untuk mengeksekusi instruksi query SQL.
6. **`ResultSet`:** Tabel virtual penampung data hasil query `SELECT`.
7. **`SQLException`:** Exception khusus yang dilempar saat terjadi kesalahan akses database atau query error.

#### Cara Kerja

```text
DriverManager / DataSource
           │
           ▼ .getConnection()
       Connection
           │
           ▼ .prepareStatement(sql)
    PreparedStatement
           │
     ┌─────┴────────────────────────┐
     ▼ .executeUpdate()             ▼ .executeQuery()
Affected Rows Count             ResultSet (Data Rows)
```

**Hafalan:**

```text
Connection.prepareStatement(sql) → membuat objek query berparameter aman
PreparedStatement.executeUpdate() → mengeksekusi perintah DML (INSERT, UPDATE, DELETE)
PreparedStatement.executeQuery()  → mengeksekusi perintah DQL (SELECT) menghasilkan ResultSet
```

---

<a id="bagian-3"></a>

## 3. 🟢 Membuat Koneksi Database via `DriverManager`

#### Konsep

Untuk membuka koneksi database langsung, kita menggunakan method `DriverManager.getConnection(url, username, password)`.

Format standar **JDBC URL**:
`jdbc:<subprotocol>://<host>:<port>/<databaseName>?<parameters>`

Contoh Format URL Populer:
- **MySQL:** `jdbc:mysql://localhost:3306/nama_database?serverTimezone=Asia/Jakarta`
- **PostgreSQL:** `jdbc:postgresql://localhost:5432/nama_database`
- **SQLite (File Lokal):** `jdbc:sqlite:app_database.db`
- **H2 (In-Memory Testing):** `jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1`

#### Contoh

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectionDemo {
    public static void main(String[] args) {
        String jdbcUrl = "jdbc:h2:mem:tokodb;DB_CLOSE_DELAY=-1"; // Menggunakan H2 In-Memory
        String username = "sa";
        String password = "";

        try {
            System.out.println("Menghubungkan ke database...");
            Connection connection = DriverManager.getConnection(jdbcUrl, username, password);
            
            System.out.println("✅ Koneksi Berhasil Terbuka!");
            System.out.println("Katalog Aktif : " + connection.getCatalog());
            System.out.println("Status Closed : " + connection.isClosed());

            connection.close(); // Menutup koneksi
            System.out.println("Koneksi berhasil ditutup.");
        } catch (SQLException e) {
            System.err.println("❌ Gagal Terhubung ke Database: " + e.getMessage());
        }
    }
}
```

#### Output

```text
Menghubungkan ke database...
✅ Koneksi Berhasil Terbuka!
Katalog Aktif : TOKODB
Status Closed : false
Koneksi berhasil ditutup.
```

**Hafalan:**

```text
DriverManager.getConnection(url, user, pass) → membuka koneksi fisik ke server database
connection.close()                           → menutup sesi koneksi dan melepaskan socket
```

---

<a id="bagian-4"></a>

## 4. 🟢 Manajemen Resource Otomatis dengan *Try-with-Resources*

#### Konsep

Koneksi database, statement, dan result set adalah **sumber daya sistem eksternal (*unmanaged OS resources*)** yang memakan socket jaringan dan memori database. Jika tidak ditutup dengan benar saat terjadi error, aplikasi akan mengalami **Resource / Memory Leak** dan database akan kehabisan batas koneksi (*Connection Pool Exhaustion*).

Seluruh antarmuka inti JDBC mengimplementasikan `java.lang.AutoCloseable`. Oleh karena itu, **WAJIB menggunakan konstruksi *Try-with-Resources*** agar koneksi dan statement otomatis ditutup saat blok selesai.

#### Contoh

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class TryWithResourcesDemo {
    public static void main(String[] args) {
        String url = "jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1";

        // Connection dan PreparedStatement otomatis ditutup saat keluar dari blok kurung
        try (Connection conn = DriverManager.getConnection(url, "sa", "");
             PreparedStatement pstmt = conn.prepareStatement("CREATE TABLE IF NOT EXISTS dummy (id INT)")) {

            pstmt.executeUpdate();
            System.out.println("✅ Tabel berhasil dibuat & Resource otomatis dibersihkan aman!");

        } catch (SQLException e) {
            System.err.println("Database Error: " + e.getMessage());
        }
    }
}
```

#### Output

```text
✅ Tabel berhasil dibuat & Resource otomatis dibersihkan aman!
```

#### Cara Kerja

```text
try (Resource A; Resource B) {
     Operasi Query
} ──> Selesai / Error Terjadi ──> Otomatis: B.close() lalu A.close()
```

**Hafalan:**

```text
try (Connection conn = ...; PreparedStatement pstmt = ...) { ... } → pola aman pembersihan koneksi otomatis
```

---

<a id="bagian-5"></a>

## 5. 🟢 `Statement` vs `PreparedStatement` & Bahaya Fatal SQL Injection

#### Konsep

- **`Statement` (Rentan & Usang):** Mengeksekusi string SQL mentah. Jika menggabungkan input pengguna menggunakan konkatenasi string biasa (`"WHERE user = '" + input + "'"`), peretas dapat menyuntikkan perintah SQL jahat (**SQL Injection**).
- **`PreparedStatement` (Wajib & Aman):**
  1. Menggunakan placeholder tanda tanya (`?`) untuk parameter nilai.
  2. SQL dikirim terlebih dahulu ke database untuk di-*pre-compile*.
  3. Nilai parameter dikirim terpisah dan diperlakukan murni sebagai data literal teks/angka, **sehingga 100% kebal terhadap serangan SQL Injection**.
  4. Database dapat meng-cache *Execution Plan* untuk performa berulang yang lebih kencang.

#### Contoh

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class PreparedStatementSecurityDemo {
    public static void main(String[] args) {
        String url = "jdbc:h2:mem:securitydb;DB_CLOSE_DELAY=-1";

        try (Connection conn = DriverManager.getConnection(url, "sa", "")) {
            // Setup Tabel
            conn.createStatement().execute("CREATE TABLE users (username VARCHAR(50), password VARCHAR(50))");
            conn.createStatement().execute("INSERT INTO users VALUES ('admin', 'rahasia123')");

            // Simulasi Input Jahat Hacker
            String hackerInputUser = "' OR '1'='1";
            String hackerInputPass = "' OR '1'='1";

            // AMAN DENGAN PREPAREDSTATEMENT (Parameter Index dimulai dari angka 1)
            String secureSql = "SELECT * FROM users WHERE username = ? AND password = ?";
            try (PreparedStatement pstmt = conn.prepareStatement(secureSql)) {
                pstmt.setString(1, hackerInputUser);
                pstmt.setString(2, hackerInputPass);

                var rs = pstmt.executeQuery();
                if (rs.next()) {
                    System.out.println("Login Berhasil");
                } else {
                    System.out.println("✅ Serangan SQL Injection DITANGKAL! Login ditolak karena input dianggap teks biasa.");
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

#### Output

```text
✅ Serangan SQL Injection DITANGKAL! Login ditolak karena input dianggap teks biasa.
```

#### Cara Kerja

```text
Input Hacker: ' OR '1'='1
       │
       ▼
PreparedStatement memperlakukan sebagai literal teks:
WHERE username = '\' OR \'1\'=\'1' ──> Tidak ada manipulasi struktur syntax SQL!
```

**Hafalan:**

```text
pstmt.setString(parameterIndex, value) → mengisi parameter ke-parameterIndex (mulai dari 1) secara aman
```

#### Kesalahan Umum

❌ Menggunakan indeks berbasis 0 pada PreparedStatement: `pstmt.setString(0, "val")` (JDBC menggunakan indeks berbasis 1).

✅ Selalu mulai indeks parameter dari angka **1**: `pstmt.setString(1, "val")`.

---

<a id="bagian-6"></a>

## 6. 🟢 Eksekusi Query DML (`INSERT`, `UPDATE`, `DELETE`) & `executeUpdate()`

#### Konsep

Untuk seluruh instruksi SQL yang memanipulasi data (*Data Manipulation Language / DML*) atau skema tabel (*DDL*):
- Gunakan method **`pstmt.executeUpdate()`**.
- Method ini mengembalikan bilangan bulat `int` yang merepresentasikan **jumlah baris data yang terpengaruh (*Affected Rows Count*)**.
- Jika mengembalikan `0` pada perintah `UPDATE`/`DELETE`, berarti tidak ada satupun baris data yang cocok dengan kriteria `WHERE`.

#### Contoh

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class ExecuteUpdateDemo {
    public static void main(String[] args) {
        String url = "jdbc:h2:mem:dmldb;DB_CLOSE_DELAY=-1";

        try (Connection conn = DriverManager.getConnection(url, "sa", "")) {
            conn.createStatement().execute("CREATE TABLE produk (id INT PRIMARY KEY, nama VARCHAR(100), harga DOUBLE)");

            // 1. Eksekusi INSERT
            String insertSql = "INSERT INTO produk (id, nama, harga) VALUES (?, ?, ?)";
            try (PreparedStatement insertStmt = conn.prepareStatement(insertSql)) {
                insertStmt.setInt(1, 101);
                insertStmt.setString(2, "Mouse Wireless");
                insertStmt.setDouble(3, 150_000.0);
                int rowsInserted = insertStmt.executeUpdate();
                System.out.println("Baris Tersimpan (INSERT): " + rowsInserted);
            }

            // 2. Eksekusi UPDATE
            String updateSql = "UPDATE produk SET harga = ? WHERE id = ?";
            try (PreparedStatement updateStmt = conn.prepareStatement(updateSql)) {
                updateStmt.setDouble(1, 175_000.0);
                updateStmt.setInt(2, 101);
                int rowsUpdated = updateStmt.executeUpdate();
                System.out.println("Baris Terupdate (UPDATE): " + rowsUpdated);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

#### Output

```text
Baris Tersimpan (INSERT): 1
Baris Terupdate (UPDATE): 1
```

**Hafalan:**

```text
int affectedRows = pstmt.executeUpdate(); → mengeksekusi INSERT/UPDATE/DELETE dan mengembalikan jumlah baris terubah
```

---

<a id="bagian-7"></a>

## 7. 🟢 Eksekusi Query DQL (`SELECT`) & Navigasi `ResultSet`

#### Konsep

Untuk instruksi pembacaan data (`SELECT`):
- Gunakan method **`pstmt.executeQuery()`** yang menghasilkan objek **`ResultSet`**.
- Objek `ResultSet` mempertahankan **Kursor Baris Data (*Cursor Pointer*)** yang awalnya berada tepat **sebelum baris pertama**.
- Method **`rs.next()`** memajukan kursor ke baris berikutnya dan mengembalikan `true` jika baris tersebut ada, atau `false` jika data sudah habis.
- Ambil data kolom menggunakan method getter bertipe: `rs.getInt("column")`, `rs.getString("column")`, `rs.getDouble("column")`, `rs.getTimestamp("column")`.

#### Contoh

```java
import java.sql.*;

public class ExecuteQueryDemo {
    public static void main(String[] args) {
        String url = "jdbc:h2:mem:dqldb;DB_CLOSE_DELAY=-1";

        try (Connection conn = DriverManager.getConnection(url, "sa", "")) {
            conn.createStatement().execute("CREATE TABLE pelanggan (id INT, nama VARCHAR(50), saldo DOUBLE)");
            conn.createStatement().execute("INSERT INTO pelanggan VALUES (1, 'Ahmad', 500000), (2, 'Budi', 750000)");

            String querySql = "SELECT id, nama, saldo FROM pelanggan WHERE saldo >= ?";
            try (PreparedStatement pstmt = conn.prepareStatement(querySql)) {
                pstmt.setDouble(1, 600_000.0);

                try (ResultSet rs = pstmt.executeQuery()) {
                    System.out.println("Hasil Query SELECT:");
                    while (rs.next()) {
                        int id = rs.getInt("id");
                        String nama = rs.getString("nama");
                        double saldo = rs.getDouble("saldo");

                        System.out.printf("- ID: %d | Nama: %-10s | Saldo: Rp %,.2f%n", id, nama, saldo);
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

#### Output

```text
Hasil Query SELECT:
- ID: 2 | Nama: Budi       | Saldo: Rp 750,000.00
```

#### Cara Kerja

```text
ResultSet Pointer Awal (Before First Row)
           │
           ├──> rs.next() == true  ──> Baca Baris 1: ID 2, Budi, 750000
           └──> rs.next() == false ──> Selesai Loop
```

**Hafalan:**

```text
ResultSet rs = pstmt.executeQuery(); → mengeksekusi query SELECT menghasilkan kumpulan baris data
rs.next()                            → menggeser kursor ke baris data berikutnya (return true jika ada)
rs.getString(columnLabel)            → mengambil nilai kolom sebagai String
```

---

<a id="bagian-8"></a>

## 8. 🟢 Mapping `ResultSet` ke Java Model / Record Entity

#### Konsep

Dalam arsitektur aplikasi backend profesional, kode database tidak boleh mengekspos objek mentah `ResultSet` ke luar layer database.

Setiap baris data pada `ResultSet` harus **di-mapping menjadi Objek Java / Record Entity** mandiri (*Data Transfer Object*).

#### Contoh

```java
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

// Record Model Representasi Baris Database
record MahasiswaEntity(int id, String nim, String nama, double ipk) {}

public class ResultSetMappingDemo {
    public static List<MahasiswaEntity> findAll(Connection conn) throws SQLException {
        List<MahasiswaEntity> list = new ArrayList<>();
        String sql = "SELECT id, nim, nama, ipk FROM mahasiswa";

        try (PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                // Mapping eksplisit setiap baris ke Record Entity
                MahasiswaEntity mhs = new MahasiswaEntity(
                    rs.getInt("id"),
                    rs.getString("nim"),
                    rs.getString("nama"),
                    rs.getDouble("ipk")
                );
                list.add(mhs);
            }
        }
        return list;
    }

    public static void main(String[] args) {
        String url = "jdbc:h2:mem:mappingdb;DB_CLOSE_DELAY=-1";
        try (Connection conn = DriverManager.getConnection(url, "sa", "")) {
            conn.createStatement().execute("CREATE TABLE mahasiswa (id INT, nim VARCHAR(20), nama VARCHAR(50), ipk DOUBLE)");
            conn.createStatement().execute("INSERT INTO mahasiswa VALUES (1, '101', 'Citra', 3.85), (2, '102', 'Doni', 3.65)");

            List<MahasiswaEntity> data = findAll(conn);
            data.forEach(m -> System.out.println("Mapped Entity: " + m));
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

#### Output

```text
Mapped Entity: MahasiswaEntity[id=1, nim=101, nama=Citra, ipk=3.85]
Mapped Entity: MahasiswaEntity[id=2, nim=102, nama=Doni, ipk=3.65]
```

**Hafalan:**

```text
Row Mapping → pola transformasi baris relasional ResultSet menjadi objek Java yang bersih dan decoupled
```

---

<a id="bagian-9"></a>

## 9. 🟡 Menangani Nilai NULL pada `ResultSet` (`wasNull()` & Wrapper Class)

#### Konsep

Ketika kolom database berisi nilai `NULL`:
- Jika dibaca dengan method primitif (seperti `rs.getInt("age")` atau `rs.getDouble("discount")`), Java akan **mengembalikan nilai `0` atau `0.0`**, bukan `null`! Ini bisa menimbulkan bug fatal jika nilai 0 memiliki arti bisnis yang berbeda dari data kosong.
- Untuk memeriksa apakah nilai kolom yang baru dibaca sebenarnya bernilai `NULL` di database, gunakan method **`rs.wasNull()`**.

#### Contoh

```java
import java.sql.*;

public class NullHandlingDemo {
    public static void main(String[] args) {
        String url = "jdbc:h2:mem:nulldb;DB_CLOSE_DELAY=-1";

        try (Connection conn = DriverManager.getConnection(url, "sa", "")) {
            conn.createStatement().execute("CREATE TABLE pegawai (id INT, nama VARCHAR(50), bonus DOUBLE)");
            conn.createStatement().execute("INSERT INTO pegawai VALUES (1, 'Eko', NULL)"); // Bonus NULL

            try (PreparedStatement pstmt = conn.prepareStatement("SELECT nama, bonus FROM pegawai");
                 ResultSet rs = pstmt.executeQuery()) {

                if (rs.next()) {
                    String nama = rs.getString("nama");
                    double bonusPrimitif = rs.getDouble("bonus"); // Mengembalikan 0.0

                    Double bonusWrapper;
                    if (rs.wasNull()) {
                        bonusWrapper = null; // Kolom asli bernilai NULL di database!
                    } else {
                        bonusWrapper = bonusPrimitif;
                    }

                    System.out.println("Pegawai      : " + nama);
                    System.out.println("Bonus Primitif: " + bonusPrimitif); // 0.0 (Salah kaprah)
                    System.out.println("Bonus Asli    : " + bonusWrapper);   // null (Akurat)
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

#### Output

```text
Pegawai      : Eko
Bonus Primitif: 0.0
Bonus Asli    : null
```

**Hafalan:**

```text
rs.wasNull() → memeriksa apakah kolom yang baru saja dibaca bernilai NULL di database (true/false)
```

---

<a id="bagian-10"></a>

## 10. 🟡 Mengambil Auto-Generated Keys (Primary Key Auto-Increment ID)

#### Konsep

Ketika melakukan `INSERT` ke tabel yang memiliki kolom Primary Key auto-increment (*Identity / Serial*), database yang menghasilkan nomor ID tersebut.

Untuk mengambil nilai ID yang baru saja digenerate tanpa perlu melakukan query `SELECT` kedua:
1. Sertakan flag **`Statement.RETURN_GENERATED_KEYS`** saat membuat PreparedStatement.
2. Panggil method **`pstmt.getGeneratedKeys()`** setelah `executeUpdate()`.

#### Contoh

```java
import java.sql.*;

public class AutoGeneratedKeysDemo {
    public static void main(String[] args) {
        String url = "jdbc:h2:mem:keysdb;DB_CLOSE_DELAY=-1";

        try (Connection conn = DriverManager.getConnection(url, "sa", "")) {
            conn.createStatement().execute("CREATE TABLE kategori (id INT AUTO_INCREMENT PRIMARY KEY, nama VARCHAR(50))");

            String sql = "INSERT INTO kategori (nama) VALUES (?)";
            // 1. Mendaftarkan RETURN_GENERATED_KEYS
            try (PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                pstmt.setString(1, "Peralatan Dapur");
                pstmt.executeUpdate();

                // 2. Mengambil ID yang dihasilkan database
                try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        long generatedId = generatedKeys.getLong(1);
                        System.out.println("✅ Data tersimpan dengan Auto-Increment ID: " + generatedId);
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

#### Output

```text
✅ Data tersimpan dengan Auto-Increment ID: 1
```

**Hafalan:**

```text
conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS) → menginstruksikan database mengembalikan ID baru
pstmt.getGeneratedKeys()                                    → mengambil ResultSet berisi auto-increment ID
```

---

<a id="bagian-11"></a>

## 11. 🟡 Batch Processing untuk Efisiensi Masif (`addBatch` & `executeBatch`)

#### Konsep

Jika Anda perlu mengeksekusi 1.000 perintah `INSERT` berturut-turut, mengeksekusinya satu per satu akan sangat lambat karena terjadi 1.000 kali pengiriman paket jaringan (*Network Round-Trips*).

**Batch Processing** mengumpulkan ratusan/ribuan query di sisi aplikasi (`addBatch()`), lalu mengirimkannya **sekaligus dalam satu kali perjalanan jaringan (`executeBatch()`)**, meningkatkan performa hingga puluhan kali lipat.

#### Contoh

```java
import java.sql.*;

public class BatchProcessingDemo {
    public static void main(String[] args) {
        String url = "jdbc:h2:mem:batchdb;DB_CLOSE_DELAY=-1";

        try (Connection conn = DriverManager.getConnection(url, "sa", "")) {
            conn.createStatement().execute("CREATE TABLE sensor_logs (id INT, suhu DOUBLE, status VARCHAR(20))");

            String sql = "INSERT INTO sensor_logs VALUES (?, ?, ?)";
            try (PreparedStatement pstmt = conn.prepareStatement(sql)) {

                for (int i = 1; i <= 5; i++) {
                    pstmt.setInt(1, i);
                    pstmt.setDouble(2, 25.0 + i);
                    pstmt.setString(3, "NORMAL");

                    pstmt.addBatch(); // Masukkan query ke buffer batch
                }

                // Kirim seluruh batch sekaligus ke database
                int[] batchResults = pstmt.executeBatch();
                System.out.printf("✅ Berhasil mengeksekusi batch (%d perintah DML sekaligus)!%n", batchResults.length);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

#### Output

```text
✅ Berhasil mengeksekusi batch (5 perintah DML sekaligus)!
```

#### Cara Kerja

```text
addBatch() -> addBatch() -> addBatch() ──[Buffer Aplikasi]──> executeBatch() ──(1 Paket TCP)──> Database
```

**Hafalan:**

```text
pstmt.addBatch()     → menambahkan parameter query saat ini ke antrian batch buffer
pstmt.executeBatch() → mengirim dan mengeksekusi seluruh antrian batch query secara serentak
```

---

<a id="bagian-12"></a>

## 12. 🟡 Database Transactions Dasar (ACID, `setAutoCommit`, `commit`, `rollback`)

#### Konsep

Secara default, JDBC beroperasi dalam mode **Auto-Commit** (setiap satu eksekusi SQL langsung disimpan permanen seketika).

Dalam transaksi perbankan atau e-commerce, serangkaian operasi (misal: potong saldo pengirim + tambah saldo penerima) **wajib memenuhi prinsip ACID (*Atomic, Consistent, Isolated, Durable*)**:
1. Matikan auto-commit: `conn.setAutoCommit(false)`.
2. Eksekusi seluruh rangkaian query SQL.
3. Jika seluruh operasi sukses tanpa error $\rightarrow$ simpan permanen: **`conn.commit()`**.
4. Jika terjadi error di salah satu langkah $\rightarrow$ batalkan seluruh perubahan: **`conn.rollback()`**.

#### Contoh

```java
import java.sql.*;

public class TransactionDemo {
    public static void transferSaldo(Connection conn, int dariAkun, int keAkun, double jumlah) throws SQLException {
        String potongSql = "UPDATE rekening SET saldo = saldo - ? WHERE id = ?";
        String tambahSql = "UPDATE rekening SET saldo = saldo + ? WHERE id = ?";

        try {
            // 1. Matikan Auto-Commit untuk memulai transaksi manual
            conn.setAutoCommit(false);

            // Langkah A: Potong Saldo Pengirim
            try (PreparedStatement pstmt1 = conn.prepareStatement(potongSql)) {
                pstmt1.setDouble(1, jumlah);
                pstmt1.setInt(2, dariAkun);
                pstmt1.executeUpdate();
            }

            // Simulasi kegagalan sistem di tengah jalan
            if (jumlah > 1_000_000) {
                throw new SQLException("Simulasi Error: Batas transfer harian terlampaui!");
            }

            // Langkah B: Tambah Saldo Penerima
            try (PreparedStatement pstmt2 = conn.prepareStatement(tambahSql)) {
                pstmt2.setDouble(1, jumlah);
                pstmt2.setInt(2, keAkun);
                pstmt2.executeUpdate();
            }

            // 2. Commit jika seluruh langkah sukses
            conn.commit();
            System.out.println("✅ Transaksi Transfer Sukses (COMMITTED)!");

        } catch (SQLException e) {
            // 3. Rollback membatalkan langkah A jika langkah B gagal
            conn.rollback();
            System.err.println("❌ Transaksi Gagal! Seluruh perubahan DIBATALKAN (ROLLED BACK): " + e.getMessage());
        } finally {
            conn.setAutoCommit(true); // Kembalikan ke mode normal
        }
    }

    public static void main(String[] args) {
        String url = "jdbc:h2:mem:txdb;DB_CLOSE_DELAY=-1";
        try (Connection conn = DriverManager.getConnection(url, "sa", "")) {
            conn.createStatement().execute("CREATE TABLE rekening (id INT PRIMARY KEY, nama VARCHAR(50), saldo DOUBLE)");
            conn.createStatement().execute("INSERT INTO rekening VALUES (1, 'Ali', 2000000), (2, 'Budi', 500000)");

            // Percobaan transfer yang memicu error dan rollback
            transferSaldo(conn, 1, 2, 1_500_000);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

#### Output

```text
❌ Transaksi Gagal! Seluruh perubahan DIBATALKAN (ROLLED BACK): Simulasi Error: Batas transfer harian terlampaui!
```

#### Cara Kerja

```text
setAutoCommit(false)
        │
        ├──> Potong Saldo Ali (1.5 Juta) ──> [Sukses di Staging Buffer]
        ├──> Tambah Saldo Budi           ──> [ERROR TERJADI!]
        │
        ▼ catch
conn.rollback() ──> Saldo Ali dikembalikan utuh seperti semula!
```

**Hafalan:**

```text
conn.setAutoCommit(false) → menonaktifkan mode auto-commit untuk memulai transaksi manual
conn.commit()             → menyimpan seluruh rangkaian perubahan transaksi secara permanen ke disk
conn.rollback()           → membatalkan seluruh perubahan transaksi yang belum di-commit
```

---

<a id="bagian-13"></a>

## 13. 🟡 Savepoint pada Transaksi Bertingkat

#### Konsep

**Savepoint** memungkinkan kita membuat titik pemeriksaan (*checkpoint*) di tengah-tengah transaksi yang sedang berjalan.

Jika terjadi kegagalan pada operasi tahap akhir, kita dapat melakukan **Rollback Parsial** kembali ke titik Savepoint tertentu (`conn.rollback(savepoint)`) tanpa membatalkan operasi tahap awal yang sudah berhasil.

#### Contoh

```java
import java.sql.*;

public class SavepointDemo {
    public static void main(String[] args) {
        String url = "jdbc:h2:mem:spdb;DB_CLOSE_DELAY=-1";

        try (Connection conn = DriverManager.getConnection(url, "sa", "")) {
            conn.createStatement().execute("CREATE TABLE pesanan (id INT, status VARCHAR(50))");
            conn.setAutoCommit(false);

            // Tahap 1: Simpan Pesanan Pokok
            conn.createStatement().execute("INSERT INTO pesanan VALUES (1, 'DIBUAT')");
            Savepoint savepoint1 = conn.setSavepoint("SavepointPesananPokok");
            System.out.println("Tahap 1 Sukses -> Savepoint 1 Dibuat.");

            // Tahap 2: Tambah Voucher Opsional (Gagal)
            try {
                conn.createStatement().execute("INSERT INTO pesanan VALUES (1, 'DUPLIKAT_ERROR')"); // Error
            } catch (SQLException ex) {
                System.out.println("Tahap 2 Gagal -> Melakukan Rollback Parsial ke Savepoint 1.");
                conn.rollback(savepoint1); // Hanya batalkan Tahap 2
            }

            conn.commit(); // Simpan Tahap 1 yang valid
            conn.setAutoCommit(true);
            System.out.println("✅ Transaksi Final Berhasil Disimpan.");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

#### Output

```text
Tahap 1 Sukses -> Savepoint 1 Dibuat.
Tahap 2 Gagal -> Melakukan Rollback Parsial ke Savepoint 1.
✅ Transaksi Final Berhasil Disimpan.
```

**Hafalan:**

```text
Savepoint sp = conn.setSavepoint("name") → membuat titik checkpoint transaksi
conn.rollback(sp)                        → membatalkan transaksi hanya sampai titik checkpoint sp
```

---

<a id="bagian-14"></a>

## 14. 🟡 Transaction Isolation Levels (`READ_COMMITTED`, `REPEATABLE_READ`, `SERIALIZABLE`)

#### Konsep

Ketika banyak pengguna mengakses database secara bersamaan (*concurrency*), dapat terjadi anomali data:
1. **Dirty Read:** Membaca data transaksi lain yang belum di-commit (dan mungkin di-rollback).
2. **Non-Repeatable Read:** Membaca baris yang sama dua kali, tetapi nilainya berubah karena transaksi lain melakukan UPDATE.
3. **Phantom Read:** Query kedua menghasilkan jumlah baris yang bertambah karena transaksi lain melakukan INSERT.

Tingkat Isolasi Transaksi di JDBC (`conn.setTransactionIsolation(level)`):

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read | Performa |
|---|---|---|---|---|
| `TRANSACTION_READ_UNCOMMITTED` | Terjadi | Terjadi | Terjadi | Paling Cepat |
| `TRANSACTION_READ_COMMITTED` (Default PG/Oracle) | **Dicegah** | Terjadi | Terjadi | Cepat |
| `TRANSACTION_REPEATABLE_READ` (Default MySQL) | **Dicegah** | **Dicegah** | Terjadi | Sedang |
| `TRANSACTION_SERIALIZABLE` | **Dicegah** | **Dicegah** | **Dicegah**| Paling Lambat |

**Hafalan:**

```text
conn.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED) → mengatur level isolasi transaksi database
```

---

<a id="bagian-15"></a>

## 15. 🟡 Metadata Database & ResultSet (`DatabaseMetaData` & `ResultSetMetaData`)

#### Konsep

- **`DatabaseMetaData`:** Menyediakan informasi komprehensif tentang server RDBMS (nama produk database, versi driver, daftar tabel, dukungan fitur transaksi).
- **`ResultSetMetaData`:** Menyediakan informasi tentang skema kolom hasil query yang sedang aktif (jumlah kolom, nama kolom, tipe data SQL).

#### Contoh

```java
import java.sql.*;

public class MetadataDemo {
    public static void main(String[] args) {
        String url = "jdbc:h2:mem:metadb;DB_CLOSE_DELAY=-1";

        try (Connection conn = DriverManager.getConnection(url, "sa", "")) {
            // 1. DatabaseMetaData
            DatabaseMetaData dbMeta = conn.getMetaData();
            System.out.println("RDBMS Name   : " + dbMeta.getDatabaseProductName());
            System.out.println("Driver Version: " + dbMeta.getDriverVersion());

            // 2. ResultSetMetaData
            conn.createStatement().execute("CREATE TABLE barang (sku VARCHAR(20), harga DOUBLE, stok INT)");
            try (Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery("SELECT * FROM barang")) {

                ResultSetMetaData rsMeta = rs.getMetaData();
                int columnCount = rsMeta.getColumnCount();
                System.out.println("\nStruktur Kolom Tabel Barang (Total: " + columnCount + "):");
                for (int i = 1; i <= columnCount; i++) {
                    System.out.printf("Kolom %d: %-10s (Tipe SQL: %s)%n", 
                        i, rsMeta.getColumnName(i), rsMeta.getColumnTypeName(i));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

#### Output

```text
RDBMS Name   : H2
Driver Version: 2.2.224 (2023-09-17)

Struktur Kolom Tabel Barang (Total: 3):
Kolom 1: SKU        (Tipe SQL: CHARACTER VARYING)
Kolom 2: HARGA      (Tipe SQL: DOUBLE PRECISION)
Kolom 3: STOK       (Tipe SQL: INTEGER)
```

**Hafalan:**

```text
conn.getMetaData()       → mengambil informasi kapabilitas server RDBMS
rs.getMetaData()         → mengambil informasi struktur kolom data hasil query
rsMeta.getColumnCount()  → menghitung total jumlah kolom pada ResultSet
```

---

<a id="bagian-16"></a>

## 16. 🟡 `CallableStatement` (Stored Procedure & Parameter `OUT`)

#### Konsep

`CallableStatement` digunakan untuk mengeksekusi **Stored Procedure** atau **Function** yang tersimpan di dalam database server.

Sintaks pemanggilan standar JDBC:
`{ call nama_procedure(?, ?, ?) }`

Untuk membaca nilai kembalian dari parameter `OUT`, daftarkan tipe datanya terlebih dahulu menggunakan `registerOutParameter(index, Types.VARCHAR)`.

#### Contoh

```java
import java.sql.*;

public class CallableStatementDemo {
    public static void main(String[] args) {
        String url = "jdbc:h2:mem:sproc;DB_CLOSE_DELAY=-1";

        try (Connection conn = DriverManager.getConnection(url, "sa", "")) {
            // Membuat Stored Procedure sederhana di database
            conn.createStatement().execute("""
                CREATE ALIAS HITUNG_DISKON AS '
                    double hitung(double harga, double rate) {
                        return harga - (harga * rate);
                    }
                ';
            """);

            // Memanggil Stored Procedure via CallableStatement
            String callSql = "{ ? = call HITUNG_DISKON(?, ?) }";
            try (CallableStatement cstmt = conn.prepareCall(callSql)) {
                // Parameter 1 adalah Return Value (OUT)
                cstmt.registerOutParameter(1, Types.DOUBLE);
                cstmt.setDouble(2, 500_000.0); // Parameter IN 1: Harga
                cstmt.setDouble(3, 0.20);      // Parameter IN 2: Diskon 20%

                cstmt.execute();

                double hargaAkhir = cstmt.getDouble(1);
                System.out.printf("Hasil Stored Procedure Diskon: Rp %,.2f%n", hargaAkhir);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

#### Output

```text
Hasil Stored Procedure Diskon: Rp 400,000.00
```

**Hafalan:**

```text
conn.prepareCall("{ call procName(?, ?) }") → membuat objek pemanggil stored procedure
cstmt.registerOutParameter(index, Types.SQL) → mendaftarkan tipe data parameter output dari procedure
```

---

<a id="bagian-17"></a>

## 17. 🔴 Masalah Koneksi Konvensional & Konsep Connection Pooling

#### Konsep

Setiap kali Anda memanggil `DriverManager.getConnection()`:
1. Terjadi proses **TCP 3-Way Handshake** melalui jaringan.
2. Proses otentikasi username dan password ke server RDBMS.
3. Alokasi thread baru di database server.

Proses ini sangat lambat (**memakan waktu puluhan milidetik per request**). Jika ada 1.000 request bersamaan, server database akan crash karena kehabisan koneksi.

**Connection Pooling** menyelesaikan masalah ini dengan **membuat sekumpulan koneksi di awal (*Pool*)** yang tetap terbuka. Saat aplikasi membutuhkan koneksi, aplikasi cukup *meminjam* dari Pool, dan setelah selesai `close()`, koneksi tidak diputus melainkan *dikembalikan* ke Pool untuk dipakai request berikutnya.

#### Cara Kerja

```text
                  Aplikasi Java
             (Borrow Connection)
                        │
                        ▼
┌───────────────────────────────────────────────┐
│            HIKARICP CONNECTION POOL           │
│  [Conn 1: Idle] [Conn 2: Busy] [Conn 3: Idle] │
└───────────────────────┬───────────────────────┘
                        │ (Reuse Persistent Socket)
                        ▼
                 Database Server
```

---

<a id="bagian-18"></a>

## 18. 🔴 Connection Pooling Modern dengan HikariCP

#### Konsep

**HikariCP** adalah library Connection Pool pihak ketiga tercepat dan paling ringan di dunia Java, serta menjadi **default connection pool resmi di Spring Boot**.

Konfigurasi penting HikariCP:
- `maximumPoolSize`: Jumlah maksimal koneksi fisik yang dibuka (default: 10).
- `minimumIdle`: Jumlah koneksi siaga minimal.
- `connectionTimeout`: Batas waktu tunggu maksimal saat meminjam koneksi sebelum melempar exception (default: 30.000 ms).
- `maxLifetime`: Umur maksimal sebuah koneksi sebelum disegarkan (default: 1.800.000 ms / 30 menit).

#### Contoh

```java
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class HikariCPDemo {
    private static HikariDataSource dataSource;

    static {
        // Konfigurasi Pool HikariCP
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:h2:mem:hikaridb;DB_CLOSE_DELAY=-1");
        config.setUsername("sa");
        config.setPassword("");
        config.setMaximumPoolSize(10);
        config.setConnectionTimeout(10_000); // 10 Detik
        config.setPoolName("Production-HikariPool");

        dataSource = new HikariDataSource(config);
    }

    public static Connection getConnection() throws SQLException {
        return dataSource.getConnection(); // Meminjam koneksi dari pool (Sangat Instan!)
    }

    public static void main(String[] args) {
        try (Connection conn = getConnection()) {
            System.out.println("✅ Berhasil meminjam koneksi dari HikariCP Pool!");
            System.out.println("Pool Active Connections: " + dataSource.getHikariPoolMXBean().getActiveConnections());
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            dataSource.close(); // Menutup pool saat aplikasi shutdown
        }
    }
}
```

#### Output

```text
✅ Berhasil meminjam koneksi dari HikariCP Pool!
Pool Active Connections: 1
```

**Hafalan:**

```text
HikariDataSource ds = new HikariDataSource(config); → inisialisasi pool koneksi database berkecepatan tinggi
ds.getConnection()                                 → meminjam koneksi dari pool secara instan
```

---

<a id="bagian-19"></a>

## 19. 🔴 Repository Pattern / DAO (Data Access Object) Murni

#### Konsep

**Data Access Object (DAO) / Repository Pattern** memisahkan secara tegas antara **logika query SQL tingkat rendah** dengan **logika bisnis (*Service Layer*)**.

Keuntungan:
- Kode bisnis tidak tercemar oleh sintaks SQL atau `SQLException`.
- Mudah dilakukan penggantian database atau pembuatan unit test (*Mocking*).

#### Contoh

```java
import java.sql.*;
import java.util.Optional;

// 1. Entity Record
record Customer(Long id, String name, String email) {}

// 2. Interface DAO Kontrak
interface CustomerDao {
    void save(Customer customer);
    Optional<Customer> findById(Long id);
}

// 3. Implementasi DAO Berbasis JDBC
class CustomerDaoJdbc implements CustomerDao {
    private final Connection connection;

    public CustomerDaoJdbc(Connection connection) {
        this.connection = connection;
    }

    @Override
    public void save(Customer customer) {
        String sql = "INSERT INTO customers (id, name, email) VALUES (?, ?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setLong(1, customer.id());
            pstmt.setString(2, customer.name());
            pstmt.setString(3, customer.email());
            pstmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Gagal menyimpan customer", e);
        }
    }

    @Override
    public Optional<Customer> findById(Long id) {
        String sql = "SELECT id, name, email FROM customers WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setLong(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(new Customer(rs.getLong("id"), rs.getString("name"), rs.getString("email")));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Gagal mencari customer", e);
        }
        return Optional.empty();
    }
}
```

**Hafalan:**

```text
Repository / DAO Pattern → pola arsitektur pemisahan query database dari domain business logic aplikasi
```

---

<a id="bagian-20"></a>

## 20. 🔴 SQLException Handling & Error Codes

#### Konsep

Saat `SQLException` terjadi, kita dapat mengekstrak informasi detail error dari database engine:
- `e.getMessage()` : Pesan deskripsi error manusia.
- `e.getSQLState()` : Kode status error terstandarisasi X/Open atau SQL:2003 (5 karakter).
- `e.getErrorCode()` : Kode error numerik spesifik vendor (misal: MySQL Error 1062 = Duplicate Key).

#### Contoh

```java
try {
    // Eksekusi query duplikat
} catch (SQLException e) {
    System.err.println("SQL State  : " + e.getSQLState());
    System.err.println("Vendor Code: " + e.getErrorCode());
    if ("23505".equals(e.getSQLState()) || e.getErrorCode() == 1062) {
        System.err.println("❌ Terjadi pelanggaran data unik (Duplicate Entry)!");
    }
}
```

---

<a id="bagian-21"></a>

## 21. 🛠️ Peta Ingatan Cepat

```text
                            PETA ARSITEKTUR JAVA JDBC
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        ▼                               ▼                               ▼
KONEKSI & RESOURCING            QUERY & TYPE SAFETY             TRANSAKSI & POOLING
├─ DriverManager.getConnection  ├─ PreparedStatement (?)        ├─ setAutoCommit(false)
├─ Try-with-Resources           ├─ executeUpdate (DML)          ├─ commit() & rollback()
├─ AutoCloseable                ├─ executeQuery -> ResultSet    ├─ Savepoint (Partial)
└─ DataSource Interface         └─ Row Mapping ke Record        └─ HikariCP (Connection Pool)
```

---

<a id="bagian-22"></a>

## 22. 📚 Tabel Ringkasan

| Komponen / Method | Fungsi & Karakteristik | Return Type |
|---|---|---|
| `DriverManager.getConnection()` | Membuka koneksi database langsung | `Connection` |
| `conn.prepareStatement(sql)` | Menyiapkan query berparameter aman SQL Injection | `PreparedStatement` |
| `pstmt.executeUpdate()` | Eksekusi perintah `INSERT`, `UPDATE`, `DELETE` | `int` (affected rows) |
| `pstmt.executeQuery()` | Eksekusi perintah `SELECT` | `ResultSet` |
| `rs.next()` | Memajukan kursor baris data | `boolean` |
| `rs.wasNull()` | Memeriksa apakah kolom bernilai database NULL | `boolean` |
| `pstmt.addBatch()` | Memasukkan query ke antrian batch | `void` |
| `pstmt.executeBatch()` | Eksekusi seluruh batch serentak | `int[]` |
| `conn.setAutoCommit(false)` | Memulai mode transaksi manual | `void` |
| `conn.commit()` / `rollback()` | Menyimpan / membatalkan transaksi | `void` |
| `HikariDataSource` | Pool koneksi berkecepatan tinggi production | `DataSource` |

---

<a id="bagian-23"></a>

## 23. ⚡ Cheat Code Java JDBC 10 Detik

```java
// 1. Template PreparedStatement SELECT Aman
String sql = "SELECT * FROM users WHERE id = ?";
try (Connection conn = dataSource.getConnection();
     PreparedStatement pstmt = conn.prepareStatement(sql)) {
    pstmt.setLong(1, 100L);
    try (ResultSet rs = pstmt.executeQuery()) {
        if (rs.next()) {
            System.out.println(rs.getString("username"));
        }
    }
}

// 2. Template Transaction Atomic
conn.setAutoCommit(false);
try {
    // step 1 & step 2
    conn.commit();
} catch (SQLException e) {
    conn.rollback();
} finally {
    conn.setAutoCommit(true);
}
```

---

<a id="bagian-24"></a>

## 24. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Fundamental Koneksi & PreparedStatement
├── Pahami siklus Connection, PreparedStatement, dan ResultSet
├── Gunakan Try-with-Resources untuk mencegah memory leak
└── Hindari SQL Injection dengan parameterisasi tanda tanya (?)
       │
       ▼
Langkah 2: Mapping Entity & Auto-Increment
├── Mapping baris ResultSet ke Java Record Entity
└── Ambil ID baru via Statement.RETURN_GENERATED_KEYS
       │
       ▼
Langkah 3: Transaksi ACID & Batch Updates
├── Kuasai setAutoCommit(false), commit(), dan rollback()
└── Optimasi performa masif dengan addBatch() dan executeBatch()
       │
       ▼
Langkah 4: Connection Pooling & Arsitektur Production
├── Terapkan HikariCP Connection Pool
└── Strukturkan kode ke dalam DAO / Repository Pattern
       │
       ▼
Langkah 5: Siap Melangkah ke Spring Data JPA, Hibernate, & Spring Boot!
```

---

<a id="bagian-25"></a>

## 25. 🏗️ Mini Project: Production-Ready Store Repository & Order Transaction Manager CLI dengan HikariCP

Aplikasi backend transaksi e-commerce lengkap yang mengintegrasikan: **HikariCP Connection Pool, Repository Pattern (DAO), Auto-Generated Keys, Batch Seeding, dan Transaksi Multi-Tabel Atomic dengan Rollback**.

```java
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

// 1. Model Record Domain
record ProdukItem(Long id, String sku, String nama, double harga, int stok) {}
record PesananHeader(Long id, String customerName, double totalBayar, String status) {}

// 2. Database Manager dengan HikariCP
class DatabaseManager {
    private static final HikariDataSource dataSource;

    static {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:h2:mem:tokoberkah_db;DB_CLOSE_DELAY=-1");
        config.setUsername("sa");
        config.setPassword("");
        config.setMaximumPoolSize(5);
        config.setPoolName("StorePool");
        dataSource = new HikariDataSource(config);

        initSchema();
    }

    public static Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

    private static void initSchema() {
        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement()) {
            // Tabel Produk
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS produk (
                    id BIGINT AUTO_INCREMENT PRIMARY KEY,
                    sku VARCHAR(20) UNIQUE NOT NULL,
                    nama VARCHAR(100) NOT NULL,
                    harga DOUBLE NOT NULL,
                    stok INT NOT NULL
                );
            """);

            // Tabel Pesanan
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS pesanan (
                    id BIGINT AUTO_INCREMENT PRIMARY KEY,
                    customer_name VARCHAR(100) NOT NULL,
                    total_bayar DOUBLE NOT NULL,
                    status VARCHAR(30) NOT NULL
                );
            """);
        } catch (SQLException e) {
            throw new RuntimeException("Gagal inisialisasi skema database", e);
        }
    }
}

// 3. Produk Repository (DAO)
class ProdukRepository {
    public void batchInsert(List<ProdukItem> items) throws SQLException {
        String sql = "INSERT INTO produk (sku, nama, harga, stok) VALUES (?, ?, ?, ?)";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            for (ProdukItem p : items) {
                pstmt.setString(1, p.sku());
                pstmt.setString(2, p.nama());
                pstmt.setDouble(3, p.harga());
                pstmt.setInt(4, p.stok());
                pstmt.addBatch();
            }
            pstmt.executeBatch();
        }
    }

    public Optional<ProdukItem> findBySku(String sku) throws SQLException {
        String sql = "SELECT id, sku, nama, harga, stok FROM produk WHERE sku = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, sku);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(new ProdukItem(
                        rs.getLong("id"),
                        rs.getString("sku"),
                        rs.getString("nama"),
                        rs.getDouble("harga"),
                        rs.getInt("stok")
                    ));
                }
            }
        }
        return Optional.empty();
    }

    public List<ProdukItem> findAll() throws SQLException {
        List<ProdukItem> list = new ArrayList<>();
        String sql = "SELECT id, sku, nama, harga, stok FROM produk";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            while (rs.next()) {
                list.add(new ProdukItem(
                    rs.getLong("id"),
                    rs.getString("sku"),
                    rs.getString("nama"),
                    rs.getDouble("harga"),
                    rs.getInt("stok")
                ));
            }
        }
        return list;
    }
}

// 4. Order Service dengan ACID Transaction Management
class OrderService {
    public Long createOrderTransaction(String customer, String sku, int qty) throws SQLException {
        String potongStokSql = "UPDATE produk SET stok = stok - ? WHERE sku = ? AND stok >= ?";
        String insertPesananSql = "INSERT INTO pesanan (customer_name, total_bayar, status) VALUES (?, ?, ?)";

        // Mengambil satu koneksi yang sama untuk transaksi atomic
        try (Connection conn = DatabaseManager.getConnection()) {
            try {
                conn.setAutoCommit(false); // 1. Mulai Transaksi

                // Cek data produk
                ProdukRepository repo = new ProdukRepository();
                ProdukItem produk = repo.findBySku(sku)
                    .orElseThrow(() -> new SQLException("Produk dengan SKU " + sku + " tidak ditemukan!"));

                double totalBayar = produk.harga() * qty;

                // Langkah A: Potong Stok Produk
                try (PreparedStatement potongStmt = conn.prepareStatement(potongStokSql)) {
                    potongStmt.setInt(1, qty);
                    potongStmt.setString(2, sku);
                    potongStmt.setInt(3, qty); // Syarat stok cukup
                    int updated = potongStmt.executeUpdate();
                    if (updated == 0) {
                        throw new SQLException("Stok tidak mencukupi untuk pembelian " + qty + " unit!");
                    }
                }

                // Langkah B: Simpan Header Pesanan & Ambil Generated Key
                Long generatedOrderId;
                try (PreparedStatement pesananStmt = conn.prepareStatement(insertPesananSql, Statement.RETURN_GENERATED_KEYS)) {
                    pesananStmt.setString(1, customer);
                    pesananStmt.setDouble(2, totalBayar);
                    pesananStmt.setString(3, "LUNAS");
                    pesananStmt.executeUpdate();

                    try (ResultSet keys = pesananStmt.getGeneratedKeys()) {
                        if (keys.next()) {
                            generatedOrderId = keys.getLong(1);
                        } else {
                            throw new SQLException("Gagal mendapatkan Order ID!");
                        }
                    }
                }

                conn.commit(); // 2. Commit Transaksi
                System.out.printf("✅ TRANSAKSI SUKSES: Order ID #%d (Total: Rp %,.2f)%n", generatedOrderId, totalBayar);
                return generatedOrderId;

            } catch (SQLException e) {
                conn.rollback(); // 3. Rollback jika ada langkah yang gagal
                System.err.println("❌ TRANSAKSI GAGAL & ROLLBACK: " + e.getMessage());
                throw e;
            } finally {
                conn.setAutoCommit(true);
            }
        }
    }
}

// 5. Main Application Demo
public class StoreJdbcApp {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("   STORE REPOSITORY & TRANSACTION MANAGER JDBC    ");
        System.out.println("==================================================");

        ProdukRepository produkRepo = new ProdukRepository();
        OrderService orderService = new OrderService();

        try {
            // 1. Batch Seeding Data Produk
            System.out.println("\n--- 1. BATCH INSERT PRODUK AWAL ---");
            produkRepo.batchInsert(List.of(
                new ProdukItem(null, "SKU-01", "Laptop ThinkPad", 18_000_000, 5),
                new ProdukItem(null, "SKU-02", "Logitech Mouse", 250_000, 2)
            ));
            System.out.println("Katalog Produk Saat Ini:");
            produkRepo.findAll().forEach(p -> 
                System.out.printf("[%s] %-18s | Rp %,12.2f | Stok: %d%n", p.sku(), p.nama(), p.harga(), p.stok()));

            // 2. Transaksi Sukses
            System.out.println("\n--- 2. TRANSAKSI SUKSES (Beli 1 Unit Laptop) ---");
            orderService.createOrderTransaction("Ahmad Farhan", "SKU-01", 1);

            // 3. Transaksi Gagal & Rollback (Stok tidak cukup: minta 5 padahal sisa 2)
            System.out.println("\n--- 3. TRANSAKSI GAGAL & ROLLBACK (Beli 5 Unit Mouse) ---");
            try {
                orderService.createOrderTransaction("Siti Nurhaliza", "SKU-02", 5);
            } catch (SQLException ignored) {}

            // 4. Periksa Integritas Stok Akhir
            System.out.println("\n--- 4. STATUS STOK AKHIR DI DATABASE ---");
            produkRepo.findAll().forEach(p -> 
                System.out.printf("[%s] %-18s | Stok Sisa: %d%n", p.sku(), p.nama(), p.stok()));

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

#### Output Demonstrasi

```text
==================================================
   STORE REPOSITORY & TRANSACTION MANAGER JDBC    
==================================================

--- 1. BATCH INSERT PRODUK AWAL ---
Katalog Produk Saat Ini:
[SKU-01] Laptop ThinkPad    | Rp 18,000,000.00 | Stok: 5
[SKU-02] Logitech Mouse     | Rp    250,000.00 | Stok: 2

--- 2. TRANSAKSI SUKSES (Beli 1 Unit Laptop) ---
✅ TRANSAKSI SUKSES: Order ID #1 (Total: Rp 18,000,000.00)

--- 3. TRANSAKSI GAGAL & ROLLBACK (Beli 5 Unit Mouse) ---
❌ TRANSAKSI GAGAL & ROLLBACK: Stok tidak mencukupi untuk pembelian 5 unit!

--- 4. STATUS STOK AKHIR DI DATABASE ---
[SKU-01] Laptop ThinkPad    | Stok Sisa: 4
[SKU-02] Logitech Mouse     | Stok Sisa: 2
```

---

<a id="bagian-26"></a>

## 26. 🔗 Referensi Resmi

- [Oracle Java JDBC Basics Tutorial](https://docs.oracle.com/javase/tutorial/jdbc/basics/)
- [Java SE 21 java.sql Package Specification](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/package-summary.html)
- [HikariCP Official GitHub Repository & Configuration Wiki](https://github.com/brettwooldridge/HikariCP)
- [PostgreSQL JDBC Driver Documentation](https://jdbc.postgresql.org/documentation/)
