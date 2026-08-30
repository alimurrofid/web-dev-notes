# Java Database (JDBC) Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Java Modern (Java 21 LTS) untuk pemula yang ingin memahami koneksi database menggunakan Java Database Connectivity (JDBC). Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> JDBC (Java Database Connectivity) adalah API standar Java yang menghubungkan aplikasi Java dengan berbagai sistem basis data relasional (RDBMS seperti MySQL, PostgreSQL, Oracle, SQLite).

## Daftar Isi

1. [Pengenalan JDBC](#1-pengenalan-jdbc)
2. [Koneksi Database](#2-koneksi-database)
3. [Try-with-Resources](#3-try-with-resources)
4. [Statement](#4-statement)
5. [PreparedStatement](#5-preparedstatement)
6. [Eksekusi Query DML](#6-eksekusi-query-dml)
7. [Eksekusi Query SELECT](#7-eksekusi-query-select)
8. [Auto-Generated Keys](#8-auto-generated-keys)
9. [Batch Processing](#9-batch-processing)
10. [Database Transaction](#10-database-transaction)
11. [Savepoint](#11-savepoint)
12. [Metadata](#12-metadata)
13. [Connection Pool HikariCP](#13-connection-pool-hikaricp)

---

# 1. Pengenalan JDBC

Arsitektur JDBC menghubungkan kode Java ke database melalui JDBC Driver yang disediakan oleh vendor database.

```text
Aplikasi Java -> JDBC API (java.sql) -> JDBC Driver -> Database Server (MySQL/PostgreSQL)
```

---

# 2. Koneksi Database

Menggunakan `DriverManager.getConnection(url, user, password)`.

```java
String url = "jdbc:mysql://localhost:3306/belajar_db";
String user = "root";
String pass = "secret";

Connection connection = DriverManager.getConnection(url, user, pass);
```

---

# 3. Try-with-Resources

Memastikan `Connection`, `Statement`, dan `ResultSet` tertutup otomatis setelah blok selesai.

```java
try (Connection conn = DriverManager.getConnection(url, user, pass);
     Statement stmt = conn.createStatement()) {
    // eksekusi query
}
```

---

# 4. Statement

Digunakan untuk query statis tanpa parameter. Rentan terhadap serangan **SQL Injection** jika menggabungkan input string langsung.

```java
Statement stmt = connection.createStatement();
stmt.executeUpdate("DELETE FROM users WHERE id = 10");
```

---

# 5. PreparedStatement

Menggunakan placeholder tanda tanya (`?`) untuk parameterisasi query secara aman dari SQL Injection dan di-compile terlebih dahulu oleh database.

```java
String sql = "INSERT INTO users(name, email) VALUES (?, ?)";
try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
    pstmt.setString(1, "Budi");
    pstmt.setString(2, "budi@mail.com");
    pstmt.executeUpdate();
}
```

---

# 6. Eksekusi Query DML

`executeUpdate()` digunakan untuk query `INSERT`, `UPDATE`, dan `DELETE`, mengembalikan jumlah baris yang terpengaruh (*affected rows*).

```java
int rowsAffected = pstmt.executeUpdate();
```

---

# 7. Eksekusi Query SELECT

`executeQuery()` mengembalikan objek `ResultSet` yang berisi baris data hasil query.

```java
String sql = "SELECT id, name, balance FROM accounts WHERE balance > ?";
try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
    pstmt.setDouble(1, 100000.0);
    try (ResultSet rs = pstmt.executeQuery()) {
        while (rs.next()) {
            int id = rs.getInt("id");
            String name = rs.getString("name");
            double balance = rs.getDouble("balance");
            System.out.println(id + " - " + name + " - " + balance);
        }
    }
}
```

---

# 8. Auto-Generated Keys

Mengambil ID Primary Key auto-increment yang baru saja dibuat oleh database.

```java
String sql = "INSERT INTO categories(name) VALUES (?)";
try (PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
    pstmt.setString(1, "Gadget");
    pstmt.executeUpdate();

    try (ResultSet rs = pstmt.getGeneratedKeys()) {
        if (rs.next()) {
            long generatedId = rs.getLong(1);
            System.out.println("ID Baru: " + generatedId);
        }
    }
}
```

---

# 9. Batch Processing

Mengirim banyak query DML sekaligus dalam satu kali perjalanan jaringan (*network round-trip*).

```java
String sql = "INSERT INTO logs(message) VALUES (?)";
try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
    for (int i = 1; i <= 1000; i++) {
        pstmt.setString(1, "Log ke-" + i);
        pstmt.addBatch();
    }
    int[] results = pstmt.executeBatch();
}
```

---

# 10. Database Transaction

Mengelompokkan serangkaian query menjadi satu kesatuan atomik (*All or Nothing*).

```java
try {
    conn.setAutoCommit(false); // Memulai transaksi manual

    // 1. Potong saldo pengirim
    // 2. Tambah saldo penerima

    conn.commit(); // Simpan permanen
} catch (SQLException e) {
    conn.rollback(); // Batalkan semua perubahan jika terjadi error
} finally {
    conn.setAutoCommit(true);
}
```

---

# 11. Savepoint

Membuat checkpoint di tengah-tengah transaksi untuk rollback sebagian.

```java
Savepoint sp1 = conn.setSavepoint("Point1");
// ... query lanjutan ...
conn.rollback(sp1); // Kembali ke checkpoint Point1
```

---

# 12. Metadata

Mendapatkan informasi skema database dan struktur kolom tabel.

```java
DatabaseMetaData dbMeta = conn.getMetaData();
ResultSetMetaData rsMeta = rs.getMetaData();
int totalKolom = rsMeta.getColumnCount();
```

---

# 13. Connection Pool HikariCP

Connection pool mengelola kumpulan koneksi yang siap pakai untuk di-reuse agar aplikasi tidak lambat karena membuat koneksi TCP berulang kali.

```java
HikariConfig config = new HikariConfig();
config.setJdbcUrl("jdbc:mysql://localhost:3306/db_app");
config.setUsername("root");
config.setPassword("secret");
config.setMaximumPoolSize(10);

HikariDataSource dataSource = new HikariDataSource(config);
Connection conn = dataSource.getConnection();
```
