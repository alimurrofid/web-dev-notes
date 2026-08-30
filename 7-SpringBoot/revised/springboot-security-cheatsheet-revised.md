# Spring Security & JWT Cheatsheet Revised

> **Target:** Pemula yang telah memahami dasar Spring Boot Core, Web RESTful API, dan Spring Data JPA, serta ingin menguasai **arsitektur keamanan enterprise, autentikasi stateless berbasis JSON Web Token (JWT), password hashing BCrypt, dan Role-Based Access Control (RBAC)** menggunakan **Spring Boot 3.3+ (Spring Security 6.x & Java 21 LTS)**.
>
> Fokus cheatsheet ini: **Security Filter Chain mental model → Lambda DSL di Spring Security 6 → `BCryptPasswordEncoder` → `UserDetails` & `UserDetailsService` → `AuthenticationManager` → anatomi JWT (JJWT 0.12+) → `JwtService` → `JwtAuthenticationFilter` (`OncePerRequestFilter`) → `SessionCreationPolicy.STATELESS` → RBAC URL Mappings (`hasRole`, `hasAuthority`) → Method Security (`@PreAuthorize`) → `SecurityContextHolder` → custom 401 & 403 JSON handlers → Refresh Token → CSRF vs CORS → mini project Auth & RBAC API**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: Arsitektur Filter Chain, SecurityFilterChain Bean, BCrypt, UserDetails, AuthenticationManager, dan dasar JWT

🟡 Lanjutan
→ pelajari setelah memahami otentikasi dasar: JwtAuthenticationFilter, Stateless Session, RBAC, @PreAuthorize, Custom 401/403, dan Refresh Token

🔴 Advanced / Operasional
→ penting untuk arsitektur production: CSRF disable rationale pada API, CORS integration, dan SecurityContextHolder
```

Mental model alur request HTTP melalui Spring Security Filter Chain:

```text
               Client Request (Header: Authorization: Bearer <token>)
                                │
                                ▼
                   CorsFilter (CORS Header Check)
                                │
                                ▼
                   CsrfFilter (Disabled pada Stateless)
                                │
                                ▼
            JwtAuthenticationFilter (OncePerRequestFilter)
            ├─ 1. Ekstrak Header Bearer Token
            ├─ 2. Validasi Signature & Expired via JwtService
            ├─ 3. Load UserDetails dari Database
            └─ 4. Set Authentication ke SecurityContextHolder
                                │
                                ▼
     AuthorizationFilter (Pemeriksaan Role: hasRole('ADMIN')?)
                                │
                 ┌──────────────┴──────────────┐
                 ▼ (Lolos Otorisasi)           ▼ (Gagal: 401 / 403)
         @RestController Action       Custom AuthenticationEntryPoint /
                                      Custom AccessDeniedHandler
```

**Hafalan:**

```text
SecurityFilterChain   → rantai filter keamanan terurut yang mencegat setiap HTTP request sebelum sampai ke Controller
BCryptPasswordEncoder → algoritma hashing satu arah standar industri dengan salt otomatis untuk mengamankan password
UserDetails           → antarmuka inti Spring Security yang menyimpan data kredensial, role, dan status aktif akun pengguna
SecurityContextHolder → tempat penyimpanan identitas pengguna yang sedang login aktif dalam thread saat ini
JWT (JSON Web Token)  → format token ringkas mandiri (self-contained) untuk autentikasi stateless tanpa penyimpanan sesi di server
OncePerRequestFilter  → base class filter yang menjamin eksekusi tepat satu kali per siklus HTTP request
@PreAuthorize         → anotasi pengamanan method-level berbasis ekspresi SpEL untuk mengecek izin role sebelum method dieksekusi
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Spring Security 6 & Mental Model Security Filter Chain](#bagian-1)
2. [Perubahan Fundamental di Spring Security 6](#bagian-2)
3. [Anatomi `SecurityFilterChain` Bean Dasar](#bagian-3)
4. [Password Hashing Aman dengan `BCryptPasswordEncoder`](#bagian-4)
5. [Implementasi `UserDetails` & `UserDetailsService`](#bagian-5)
6. [Mekanisme Otentikasi: `AuthenticationManager` & `DaoAuthenticationProvider`](#bagian-6)
7. [Pengenalan JSON Web Token (JWT) & Mental Model Stateless Auth](#bagian-7)
8. [Membangun `JwtService` Utility (JJWT 0.12+)](#bagian-8)

### 🟡 Lanjutan

9. [Membangun `JwtAuthenticationFilter` (`OncePerRequestFilter`)](#bagian-9)
10. [Menghubungkan JWT Filter ke Security Filter Chain](#bagian-10)
11. [Konfigurasi Stateless Session Management](#bagian-11)
12. [Role-Based Access Control (RBAC) pada URL Mappings](#bagian-12)
13. [Method-Level Security dengan `@PreAuthorize`](#bagian-13)
14. [Mendapatkan User yang Sedang Login](#bagian-14)
15. [Custom Error Handlers (401 Unauthorized & 403 Forbidden)](#bagian-15)
16. [Refresh Token Mechanism](#bagian-16)

### 🔴 Advanced / Operasional

17. [Mengapa CSRF Dinonaktifkan pada REST API Stateless](#bagian-17)
18. [Integrasi CORS dengan Spring Security](#bagian-18)

### 🛠️ Referensi & Praktik

19. [Peta Ingatan Cepat](#bagian-19)
20. [Tabel Ringkasan](#bagian-20)
21. [Cheat Code Spring Security & JWT 10 Detik](#bagian-21)
22. [Urutan Belajar yang Disarankan](#bagian-22)
23. [Mini Project: Production-Ready Auth & Role-Based Access Control (RBAC) RESTful API](#bagian-23)
24. [Referensi Resmi](#bagian-24)

---

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan Spring Security 6 & Mental Model Security Filter Chain

## Konsep

Spring Security bekerja sebagai **lapisan dinding pertahanan (*Security Filter Chain*)** yang berdiri di depan `DispatcherServlet`. Sebelum sebuah HTTP request mencapai Controller Anda, request tersebut harus melewati serangkaian filter keamanan yang memeriksa:
1. **Autentikasi (*Who are you?*):** Memvalidasi apakah kredensial (username/password atau token JWT) valid.
2. **Otorisasi (*What are you allowed to do?*):** Memeriksa apakah user yang telah terautentikasi memiliki hak akses (*Role / Authority*) untuk endpoint tertentu.

Jika salah satu filter menolak, request langsung diputus seketika dan mengembalikan status HTTP `401 Unauthorized` atau `403 Forbidden`.

## Cara Kerja

```text
HTTP Request
     │
     ▼
[Filter 1: CORS Check]
     │
     ▼
[Filter 2: CSRF Check]
     │
     ▼
[Filter 3: JWT Token Validation] ──> Valid? Set User di SecurityContext
     │
     ▼
[Filter 4: Authorization Check]   ──> Punya Role "ADMIN"?
     │
     ├──> YA  ──> Lanjut ke @RestController Action
     └──> TDK ──> Stop! Return 403 Forbidden
```

**Hafalan:**

```text
Filter Chain   → deretan filter yang menguji keabsahan token dan hak akses sebelum request masuk ke controller
Authentication → proses pembuktian identitas pengguna (Login)
Authorization  → proses pengecekan izin akses pengguna ke resource tertentu (Hak Akses)
```

---

<a id="bagian-2"></a>

# 2. 🟢 Perubahan Fundamental di Spring Security 6

## Konsep

Di Spring Security 6 (Spring Boot 3+), seluruh pendekatan konfigurasi lama telah **DIROMBAK TOTAL**:

1. **`WebSecurityConfigurerAdapter` DIHAPUS PERMANEN:** Anda tidak lagi meng-extends class ini.
2. **Lambda DSL (Wajib):** Seluruh konfigurasi menggunakan method chaining berbasis ekspresi lambda `http -> http...` untuk menghindari method chaining kaku lama.
3. **`authorizeRequests()` digantikan oleh `authorizeHttpRequests()`**.
4. **`antMatchers()` digantikan oleh `requestMatchers()`**.

## Perbandingan Sintaks Lama vs Modern

```java
// ❌ SINTAKS LAMA (SPRING SECURITY 5 - JANGAN DIGUNAKAN DI SPRING BOOT 3)
public class OldSecurityConfig extends WebSecurityConfigurerAdapter {
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeRequests()
            .antMatchers("/api/auth/**").permitAll();
    }
}

// ✅ SINTAKS MODERN (SPRING SECURITY 6 / SPRING BOOT 3+)
@Configuration
@EnableWebSecurity
public class ModernSecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
```

**Hafalan:**

```text
SecurityFilterChain Bean → pola modern mendefinisikan konfigurasi keamanan menggunakan Lambda DSL
```

---

<a id="bagian-3"></a>

# 3. 🟢 Anatomi `SecurityFilterChain` Bean Dasar

## Konsep

Class konfigurasi keamanan ditandai dengan **`@Configuration`** dan **`@EnableWebSecurity`**.

Di dalamnya, kita mendefinisikan sebuah `@Bean` bertipe **`SecurityFilterChain`** yang menerima parameter `HttpSecurity`.

Aturan Dasar Konfigurasi REST API:
1. `csrf(AbstractHttpConfigurer::disable)` : Matikan CSRF untuk REST API stateless.
2. `sessionManagement(...)` : Ubah menjadi stateless.
3. `authorizeHttpRequests(...)` : Tentukan endpoint publik (`permitAll()`) dan endpoint terkunci (`authenticated()`).

## Contoh

```java
package com.belajar.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**", "/api/v1/public/**").permitAll() // Bebas Diakses
                .anyRequest().authenticated() // Wajib Login
            );

        return http.build();
    }
}
```

**Hafalan:**

```text
http.authorizeHttpRequests(auth -> auth.requestMatchers("/public/**").permitAll().anyRequest().authenticated())
```

---

<a id="bagian-4"></a>

# 4. 🟢 Password Hashing Aman dengan `BCryptPasswordEncoder`

## Konsep

Menyimpan password pengguna dalam bentuk teks mentah (*Plain Text*) atau algoritma hashing usang (seperti MD5 / SHA-1) adalah pelanggaran fatal keamanan.

**`BCryptPasswordEncoder`** adalah standar industri:
1. Menggunakan algoritma hashing satu arah berbasis *Blowfish*.
2. Mengikutsertakan **Salt Acak Unik** secara otomatis pada setiap hasil hash, sehingga 2 password yang sama persis ("rahasia") akan menghasilkan string hash yang sama sekali berbeda (kebal terhadap serangan *Rainbow Table Attack*).
3. Mendukung komputasi *Work Factor* yang dapat ditingkatkan seiring bertambahnya kecepatan hardware CPU peretas.

## Contoh

Konfigurasi Bean:
```java
@Configuration
public class PasswordEncoderConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Default strength: 10
    }
}
```

Penggunaan di Service:
```java
package com.belajar.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final PasswordEncoder passwordEncoder;

    public UserService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public void register(String rawPassword) {
        // 1. Hashing Password saat Registrasi
        String encodedHash = passwordEncoder.encode(rawPassword);
        System.out.println("Hasil Hash BCrypt: " + encodedHash);

        // 2. Verifikasi Password saat Login
        boolean isMatch = passwordEncoder.matches(rawPassword, encodedHash);
        System.out.println("Password Valid? " + isMatch); // true
    }
}
```

## Output

```text
Hasil Hash BCrypt: $2a$10$wN9cZ6v1Y8M3G... (60 Karakter Acak)
Password Valid? true
```

**Hafalan:**

```text
passwordEncoder.encode(rawPassword)       → meng-hash password mentah dengan salt acak baru
passwordEncoder.matches(rawPassword, hash)→ memverifikasi apakah password mentah cocok dengan hash di database
```

---

<a id="bagian-5"></a>

# 5. 🟢 Implementasi `UserDetails` & `UserDetailsService`

## Konsep

Spring Security tidak mengetahui struktur tabel user spesifik Anda. Oleh karena itu, kita harus menyediakan adapter jembatan:

1. **`UserDetails`:** Antarmuka yang merepresentasikan profil user untuk Spring Security (mengembalikan `getUsername()`, `getPassword()`, dan daftar role `getAuthorities()`).
2. **`UserDetailsService`:** Antarmuka dengan tepat 1 method: `UserDetails loadUserByUsername(String username)`. Method ini bertugas mengambil data user dari database melalui Repository Anda.

## Contoh

1. Implementasi `UserDetails`:
```java
package com.belajar.security;

import com.belajar.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

public class SecurityUserDetails implements UserDetails {
    private final User user;

    public SecurityUserDetails(User user) { this.user = user; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Standar Spring Security: Prefix "ROLE_" untuk role
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    @Override
    public String getPassword() { return user.getPassword(); }

    @Override
    public String getUsername() { return user.getEmail(); }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return user.isActive(); }
}
```

2. Implementasi `UserDetailsService`:
```java
package com.belajar.security;

import com.belajar.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
            .map(SecurityUserDetails::new)
            .orElseThrow(() -> new UsernameNotFoundException("User dengan email " + email + " tidak ditemukan!"));
    }
}
```

**Hafalan:**

```text
UserDetailsService.loadUserByUsername(username) → method jembatan mengambil akun user dari database untuk Spring Security
```

---

<a id="bagian-6"></a>

# 6. 🟢 Mekanisme Otentikasi: `AuthenticationManager` & `DaoAuthenticationProvider`

## Konsep

Saat user mengirim request login berisi username dan password mentah, kita menggunakan **`AuthenticationManager`** untuk memvalidasi kredensial tersebut secara otomatis:
1. `AuthenticationManager` memanggil `DaoAuthenticationProvider`.
2. Provider memuat akun user via `UserDetailsService.loadUserByUsername()`.
3. Provider mencocokkan password mentah dengan password hash di database via `PasswordEncoder.matches()`.
4. Jika cocok $\rightarrow$ mengembalikan objek `Authentication` yang terverifikasi.
5. Jika salah $\rightarrow$ melempar `BadCredentialsException`.

## Contoh

Mendaftarkan Bean AuthenticationManager:
```java
@Configuration
public class AuthManagerConfig {
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

Penggunaan saat Endpoint Login:
```java
@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;

    public AuthService(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    public void authenticate(String email, String password) {
        // Otomatis memeriksa kecocokan password BCrypt di database
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, password)
        );
        // Jika sampai baris ini -> Kredensial 100% Valid!
    }
}
```

**Hafalan:**

```text
authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user, pass)) → memverifikasi kredensial login
```

---

<a id="bagian-7"></a>

# 7. 🟢 Pengenalan JSON Web Token (JWT) & Mental Model Stateless Auth

## Konsep

Pada aplikasi monolitik tradisional, server menyimpan sesi user di memori RAM (*Stateful Session via JSESSIONID Cookie*). Ini tidak dapat diskalakan (*not scalable*) di arsitektur microservices atau multi-instance server.

**JSON Web Token (JWT)** adalah mekanisme **Stateless**:
- Server tidak menyimpan status login apapun di database/memori.
- Setelah login berhasil, server menerbitkan sebuah string token JWT yang ditandatangani secara kriptografis (*Digitally Signed*).
- Client menyimpan token ini (di localStorage/secure cookie) dan menyertakannya di setiap request pada header:
  `Authorization: Bearer <token_jwt>`

## Anatomi String JWT

String JWT terdiri dari 3 bagian yang dipisahkan oleh tanda titik (`.`):
`xxxxx.yyyyy.zzzzz`

1. **Header:** Menyimpan algoritma enkripsi (misal: `{"alg": "HS256", "typ": "JWT"}`).
2. **Payload (Claims):** Data identitas pengguna (Subject: `user_id`, `email`, `role`, `exp` / expiration time).
3. **Signature:** Tanda tangan digital hasil kalkulasi `HMACSHA256(Base64(Header) + "." + Base64(Payload), SecretKey)` yang memastikan isi token tidak bisa dipalsukan oleh peretas.

**Hafalan:**

```text
Header.Payload.Signature → 3 bagian penyusun string token JWT yang dipisahkan oleh tanda titik (.)
```

---

<a id="bagian-8"></a>

# 8. 🟢 Membangun `JwtService` Utility (JJWT 0.12+)

## Konsep

Kita membuat class **`JwtService`** menggunakan library standar **JJWT (`io.jsonwebtoken`)**:
1. Menghasilkan Access Token baru (`generateToken`).
2. Mengekstrak username / claims dari token (`extractUsername`).
3. Memeriksa apakah token sudah kadaluarsa (`isTokenExpired`).
4. Memvalidasi tanda tangan kriptografi token.

## Contoh

```java
package com.belajar.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long jwtExpirationMs = 1000 * 60 * 60 * 24; // 24 Jam

    public JwtService(@Value("${app.jwt.secret:SuperSecretKeyMin32CharactersLongForHS256Safety!}") String secret) {
        // Minimal 256-bit (32 karakter) untuk algoritma HS256
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // 1. Generate Token
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
            .claims(extraClaims)
            .subject(userDetails.getUsername())
            .issuedAt(new Date(System.currentTimeMillis()))
            .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
            .signWith(signingKey)
            .compact();
    }

    // 2. Ekstraksi Username (Subject)
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    // 3. Validasi Token
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }
}
```

**Hafalan:**

```text
jwtService.generateToken(userDetails)           → menerbitkan token JWT baru dengan masa berlaku tertentu
jwtService.extractUsername(token)              → membaca identitas subjek username dari token JWT
jwtService.isTokenValid(token, userDetails)    → memvalidasi integritas tanda tangan dan masa berlaku token
```

---

<a id="bagian-9"></a>

# 9. 🟡 Membangun `JwtAuthenticationFilter` (`OncePerRequestFilter`)

## Konsep

Filter ini adalah **jantung keamanan JWT di Spring Security**.

Tugas `JwtAuthenticationFilter`:
1. Mencegat setiap request HTTP yang masuk.
2. Memeriksa keberadaan header `Authorization: Bearer <token>`.
3. Jika token ada $\rightarrow$ ekstrak username dan validasi token via `JwtService`.
4. Jika valid $\rightarrow$ buat objek `UsernamePasswordAuthenticationToken` dan daftarkan ke **`SecurityContextHolder`**.
5. Meneruskan request ke filter berikutnya (`filterChain.doFilter()`).

## Contoh

```java
package com.belajar.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // 1. Cek apakah ada header Bearer Token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7); // Ambil string token setelah "Bearer "
        final String userEmail = jwtService.extractUsername(jwt);

        // 2. Jika email ada dan user belum terautentikasi di context thread ini
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // 3. Validasi keabsahan token
            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 4. Set Authentication ke SecurityContextHolder (User Resmi Terotentikasi!)
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
```

**Hafalan:**

```text
SecurityContextHolder.getContext().setAuthentication(authToken) → mendaftarkan identitas user aktif ke context Spring
```

---

<a id="bagian-10"></a>

# 10. 🟡 Menghubungkan JWT Filter ke Security Filter Chain

## Konsep

Setelah membuat `JwtAuthenticationFilter`, kita harus memasangkannya ke dalam urutan rantai filter Spring Security:
- Pasang filter JWT **tepat sebelum** filter login form bawaan Spring menggunakan:
  **`http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)`**.

## Contoh

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            // Memasang JWT Filter di urutan yang tepat
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

**Hafalan:**

```text
http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class) → mendaftarkan filter JWT ke chain
```

---

<a id="bagian-11"></a>

# 11. 🟡 Konfigurasi Stateless Session Management

## Konsep

Secara default, Spring Security akan membuat `HttpSession` di memori server.

Untuk arsitektur REST API murni berbasis JWT, kita **WAJIB menonaktifkan pembuatan session** dengan mengatur kebijakan menjadi **`SessionCreationPolicy.STATELESS`**:
- Spring Security tidak akan pernah membuat atau menggunakan session HTTP.
- Setiap request diperlakukan independen dan wajib membawa token JWT sendiri.

## Contoh

```java
http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
```

**Hafalan:**

```text
SessionCreationPolicy.STATELESS → memastikan server tidak menyimpan state sesi apapun di memori
```

---

<a id="bagian-12"></a>

# 12. 🟡 Role-Based Access Control (RBAC) pada URL Mappings

## Konsep

Kita dapat membatasi akses endpoint berdasarkan Role atau Authority pengguna:
- **`hasRole("ADMIN")`:** Memeriksa apakah user memiliki authority `ROLE_ADMIN` (Spring otomatis menambahkan prefix `ROLE_`).
- **`hasAnyRole("ADMIN", "MANAGER")`:** Mengizinkan salah satu dari beberapa role.
- **`hasAuthority("product:write")`:** Memeriksa hak akses granular tanpa prefix `ROLE_`.

## Contoh

```java
http.authorizeHttpRequests(auth -> auth
    // Endpoint Publik
    .requestMatchers("/api/v1/auth/**", "/api/v1/products/public/**").permitAll()

    // Khusus Role ADMIN
    .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")

    // Khusus Role ADMIN atau STAFF
    .requestMatchers("/api/v1/orders/manage/**").hasAnyRole("ADMIN", "STAFF")

    // Granular Permission Authority
    .requestMatchers(HttpMethod.DELETE, "/api/v1/products/**").hasAuthority("product:delete")

    // Seluruh endpoint lainnya wajib login
    .anyRequest().authenticated()
);
```

**Hafalan:**

```text
.requestMatchers("/admin/**").hasRole("ADMIN") → membatasi URL hanya untuk pengguna dengan peran ADMIN
```

---

<a id="bagian-13"></a>

# 13. 🟡 Method-Level Security dengan `@PreAuthorize`

## Konsep

Selain mengamankan URL di level konfigurasi, kita dapat mengamankan method secara presisi langsung di level Controller atau Service menggunakan anotasi **`@PreAuthorize`**.

Aktifkan terlebih dahulu dengan menambahkan **`@EnableMethodSecurity`** di class konfigurasi.

Ekspresi SpEL (*Spring Expression Language*) Populer:
- `@PreAuthorize("hasRole('ADMIN')")`
- `@PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")`
- `@PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')")` (User hanya boleh mengedit profil miliknya sendiri, kecuali Admin).

## Contoh

Aktifkan Fitur:
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Wajib untuk mengaktifkan @PreAuthorize
public class SecurityConfig { ... }
```

Penggunaan di Controller / Service:
```java
package com.belajar.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
public class ProductSecurityController {

    @GetMapping
    public String listProducts() {
        return "Daftar Produk Publik";
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // Hanya Admin yang boleh menambah produk
    public String addProduct() {
        return "Produk Baru Berhasil Ditambahkan oleh Admin";
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public String deleteProduct(@PathVariable Long id) {
        return "Produk #" + id + " Dihapus";
    }
}
```

**Hafalan:**

```text
@EnableMethodSecurity            → mengaktifkan pengamanan berbasis anotasi method di Spring
@PreAuthorize("hasRole('ADMIN')") → mengevaluasi izin hak akses sebelum method target dijalankan
```

---

<a id="bagian-14"></a>

# 14. 🟡 Mendapatkan User yang Sedang Login

## Konsep

Dua cara mudah mengambil data user yang sedang aktif melakukan request di dalam Controller / Service:

1. **Menggunakan Anotasi `@AuthenticationPrincipal`:** Menyuntikkan objek `UserDetails` langsung ke parameter method Controller.
2. **Menggunakan `SecurityContextHolder`:** Mengambil context dari mana saja di kode program.

## Contoh

```java
package com.belajar.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/user")
public class UserProfileController {

    // CARA 1: @AuthenticationPrincipal (Paling Bersih)
    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return Map.of(
            "email", userDetails.getUsername(),
            "roles", userDetails.getAuthorities()
        );
    }

    // CARA 2: SecurityContextHolder Manual
    @GetMapping("/info")
    public String getInfo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return "Sedang login sebagai: " + auth.getName();
    }
}
```

**Hafalan:**

```text
@AuthenticationPrincipal UserDetails userDetails → cara instan menangkap data user yang sedang login di controller
```

---

<a id="bagian-15"></a>

# 15. 🟡 Custom Error Handlers (401 Unauthorized & 403 Forbidden)

## Konsep

Secara default, jika request tidak terotentikasi atau ditolak izinnya, Spring Security akan mengembalikan halaman HTML kosong atau respons teks mentah.

Untuk RESTful API, kita **wajib mengembalikan response JSON seragam**:
1. **`AuthenticationEntryPoint` (HTTP 401 Unauthorized):** Dipanggil saat request tidak menyertakan token atau token tidak valid.
2. **`AccessDeniedHandler` (HTTP 403 Forbidden):** Dipanggil saat user sudah login, tetapi tidak memiliki Role yang cukup untuk mengakses endpoint.

## Contoh

1. Custom AuthenticationEntryPoint (401):
```java
package com.belajar.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest req, HttpServletResponse res, AuthenticationException ex) throws IOException {
        res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        res.setContentType("application/json");
        res.getWriter().write("""
            {
              "code": 401,
              "status": "UNAUTHORIZED",
              "message": "Akses ditolak: Token autentikasi tidak valid atau tidak disertakan."
            }
        """);
    }
}
```

2. Custom AccessDeniedHandler (403):
```java
package com.belajar.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest req, HttpServletResponse res, AccessDeniedException ex) throws IOException {
        res.setStatus(HttpServletResponse.SC_FORBIDDEN);
        res.setContentType("application/json");
        res.getWriter().write("""
            {
              "code": 403,
              "status": "FORBIDDEN",
              "message": "Akses terlarang: Anda tidak memiliki izin hak akses untuk resource ini."
            }
        """);
    }
}
```

Mendaftarkan ke SecurityFilterChain:
```java
http.exceptionHandling(ex -> ex
    .authenticationEntryPoint(customAuthEntryPoint)
    .accessDeniedHandler(customAccessDeniedHandler)
);
```

**Hafalan:**

```text
AuthenticationEntryPoint → menangani respons error 401 Unauthorized dalam format JSON
AccessDeniedHandler      → menangani respons error 403 Forbidden dalam format JSON
```

---

<a id="bagian-16"></a>

# 16. 🟡 Refresh Token Mechanism

## Konsep

Jika Access Token memiliki masa berlaku terlalu panjang (misal: 30 hari), peretas yang berhasil mencuri token dapat menyalahgunakannya dalam waktu lama.

**Praktik Terbaik Industri (Dual-Token Architecture)**:
1. **Access Token:** Masa berlaku sangat singkat (**15 menit s.d. 1 jam**) untuk mengakses resource API.
2. **Refresh Token:** Masa berlaku panjang (**7 s.d. 30 hari**), disimpan di database.
3. Saat Access Token expired, frontend memanggil endpoint `POST /api/auth/refresh-token` membawa Refresh Token untuk mendapatkan Access Token baru tanpa memaksa user login ulang.

## Cara Kerja

```text
Frontend                        Backend
   │                               │
   ├── POST /api/auth/login ──────>│ ──> Valid! Return Access Token (15m) + Refresh Token (7d)
   │                               │
   ├── GET /api/data (Expired!) ──>│ ──> Return 401 Unauthorized
   │                               │
   ├── POST /api/auth/refresh ────>│ ──> Validasi Refresh Token di DB ──> Return Access Token Baru
```

**Hafalan:**

```text
Refresh Token → token berumur panjang untuk memperbarui Access Token tanpa meminta user mengetik password lagi
```

---

<a id="bagian-17"></a>

# 17. 🔴 Mengapa CSRF Dinonaktifkan pada REST API Stateless

## Konsep

**Cross-Site Request Forgery (CSRF)** adalah serangan di mana situs jahat memanfaatkan cookie sesi browser yang otomatis terkirim untuk mengeksekusi aksi ilegal atas nama korban.

Mengapa kita **menonaktifkan CSRF (`csrf.disable()`)** pada RESTful API berbasis JWT?
- JWT dikirimkan secara manual oleh client melalui header `Authorization: Bearer <token>`, bukan otomatis oleh mekanisme cookie browser.
- Browser tidak pernah melampirkan header `Authorization` secara otomatis saat pengguna mengklik link jebakan di situs lain, sehingga REST API stateless secara alami **100% kebal terhadap serangan CSRF**.

**Hafalan:**

```text
http.csrf(AbstractHttpConfigurer::disable) → menonaktifkan proteksi CSRF karena REST API JWT bersifat stateless
```

---

<a id="bagian-18"></a>

# 18. 🔴 Integrasi CORS dengan Spring Security

## Konsep

Jika aplikasi Anda menggunakan CORS (misal: Frontend Vue/React di port berbeda), browser akan mengirimkan request uji coba bernama **`OPTIONS Preflight Request`** sebelum request utama dikirim.

Jika Spring Security tidak dikonfigurasi untuk CORS, filter keamanan akan memblokir request `OPTIONS` tersebut dengan status `403 Forbidden`.

Solusi:
Tambahkan **`http.cors(Customizer.withDefaults())`** di dalam `SecurityFilterChain` agar Spring Security menggunakan aturan `CorsConfigurationSource` yang telah Anda definisikan.

## Contoh

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(Customizer.withDefaults()) // Integrasikan CORS dengan Spring Security
        .csrf(AbstractHttpConfigurer::disable)
        // ... konfigurasi lainnya ...
    return http.build();
}
```

**Hafalan:**

```text
http.cors(Customizer.withDefaults()) → mengintegrasikan izin CORS ke dalam Security Filter Chain
```

---

<a id="bagian-19"></a>

# 19. 🛠️ Peta Ingatan Cepat

```text
                     PETA ARSITEKTUR SPRING SECURITY & JWT
                                       │
       ┌───────────────────────────────┼───────────────────────────────┐
       ▼                               ▼                               ▼
AUTENTIKASI & PASSWORD         JWT FILTER PIPELINE             OTORISASI & RBAC
├─ BCryptPasswordEncoder       ├─ OncePerRequestFilter         ├─ hasRole("ADMIN")
├─ UserDetails & Service       ├─ Header "Bearer <token>"      ├─ hasAuthority("write")
├─ AuthenticationManager       ├─ JwtService (Validate/Parse)  ├─ @PreAuthorize
└─ UsernamePasswordAuthToken   └─ SecurityContextHolder        └─ Custom 401 & 403 JSON
```

---

<a id="bagian-20"></a>

# 20. 📚 Tabel Ringkasan

| Komponen / Anotasi | Tipe | Fungsi & Karakteristik Utama |
|---|---|---|
| `SecurityFilterChain` | Bean | Mendefinisikan rantai filter keamanan aplikasi |
| `BCryptPasswordEncoder` | Class | Hashing password satu arah dengan salt dinamis |
| `UserDetails` | Interface | Representasi profil dan hak akses user di Spring |
| `UserDetailsService` | Interface | Mengambil data akun user dari database |
| `AuthenticationManager` | Interface | Memverifikasi kecocokan username dan password |
| `OncePerRequestFilter` | Abstract Class | Base class filter yang dieksekusi 1x per request |
| `SecurityContextHolder` | Static Class | Tempat penyimpanan identitas user yang aktif |
| `@EnableMethodSecurity` | Anotasi Class | Mengaktifkan proteksi method-level (@PreAuthorize) |
| `@PreAuthorize` | Anotasi Method | Memeriksa ekspresi hak akses sebelum method jalan |
| `@AuthenticationPrincipal`| Anotasi Param | Mengambil objek UserDetails yang sedang login |
| `AuthenticationEntryPoint`| Interface | Menangani respons error 401 Unauthorized |
| `AccessDeniedHandler` | Interface | Menangani respons error 403 Forbidden |

---

<a id="bagian-21"></a>

# 21. ⚡ Cheat Code Spring Security & JWT 10 Detik

```java
// 1. Template SecurityFilterChain Lengkap
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
        .cors(Customizer.withDefaults())
        .csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
        .build();
}

// 2. Template Method Security di Controller
@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/users/{id}")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) { ... }
```

---

<a id="bagian-22"></a>

# 22. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Fundamental Password & UserDetails
├── Pahami cara kerja hashing BCrypt
└── Implementasikan UserDetails & UserDetailsService dengan database
       │
       ▼
Langkah 2: Kuasai JWT Engine & Filter
├── Bangun JwtService untuk generate & parse token JJWT
└── Buat JwtAuthenticationFilter (OncePerRequestFilter) dan set SecurityContext
       │
       ▼
Langkah 3: Konfigurasi SecurityFilterChain & RBAC
├── Pasang filter di SecurityFilterChain dengan SessionCreationPolicy.STATELESS
└── Terapkan aturan akses hasRole() dan hasAuthority()
       │
       ▼
Langkah 4: Custom Error Handlers & Method Security
├── Buat Custom 401 AuthenticationEntryPoint & 403 AccessDeniedHandler JSON
└── Terapkan @PreAuthorize pada Service dan Controller Layer
       │
       ▼
Langkah 5: Siap Melangkah ke Automated Testing (MockMvc & Mockito)!
```

---

<a id="bagian-23"></a>

# 23. 🏗️ Mini Project: Production-Ready Auth & Role-Based Access Control (RBAC) RESTful API

Aplikasi backend lengkap dan runnable yang mengintegrasikan: **Registrasi User, Hashing BCrypt, Login Otentikasi, Penerbitan JWT Token, Custom `JwtAuthenticationFilter`, Role-Based Access Control (Public vs User vs Admin), `@PreAuthorize`, dan Custom 401/403 JSON Handlers**.

```java
package com.belajar.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

// ==========================================
// 1. DOMAIN MODEL & ENUM
// ==========================================
enum Role { USER, ADMIN }

record AppUser(String email, String passwordHash, String fullName, Role role) {}
record AuthRequest(String email, String password) {}
record AuthResponse(String accessToken, String tokenType, String email, String role) {}

// ==========================================
// 2. JWT SERVICE
// ==========================================
@Service
class JwtService {
    private final SecretKey key = Keys.hmacShaKeyFor(
        "SuperSecretKeyForDemonstrationJWTMustBeLongerThan32Bytes!".getBytes(StandardCharsets.UTF_8)
    );

    public String generateToken(String username, String role) {
        return Jwts.builder()
            .subject(username)
            .claim("role", role)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 Jam
            .signWith(key)
            .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser().verifyWith(key).build()
            .parseSignedClaims(token).getPayload().getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        return extractUsername(token).equals(userDetails.getUsername());
    }
}

// ==========================================
// 3. USER DETAILS SERVICE & IN-MEMORY REPO
// ==========================================
@Service
class InMemoryUserDetailsService implements UserDetailsService {
    private final Map<String, AppUser> users = new ConcurrentHashMap<>();

    public void saveUser(AppUser user) { users.put(user.email(), user); }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AppUser user = users.get(email);
        if (user == null) throw new UsernameNotFoundException("User tidak ditemukan: " + email);

        return new org.springframework.security.core.userdetails.User(
            user.email(),
            user.passwordHash(),
            List.of(new SimpleGrantedAuthority("ROLE_" + user.role().name()))
        );
    }
}

// ==========================================
// 4. JWT AUTHENTICATION FILTER
// ==========================================
@Component
class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final InMemoryUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, InMemoryUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        try {
            String username = jwtService.extractUsername(token);
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (jwtService.isTokenValid(token, userDetails)) {
                    var authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception ignored) {}

        filterChain.doFilter(request, response);
    }
}

// ==========================================
// 5. SECURITY CONFIGURATION
// ==========================================
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfig {
    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, err) -> {
                    res.setStatus(401);
                    res.setContentType("application/json");
                    res.getWriter().write("{\"code\":401,\"status\":\"UNAUTHORIZED\",\"message\":\"Token tidak valid atau tidak disertakan\"}");
                })
                .accessDeniedHandler((req, res, err) -> {
                    res.setStatus(403);
                    res.setContentType("application/json");
                    res.getWriter().write("{\"code\":403,\"status\":\"FORBIDDEN\",\"message\":\"Akses ditolak: Anda tidak memiliki role yang sesuai\"}");
                })
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}

// ==========================================
// 6. REST CONTROLLERS
// ==========================================
@RestController
@RequestMapping("/api/v1/auth")
class AuthController {
    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final InMemoryUserDetailsService userDetailsService;

    public AuthController(AuthenticationManager authManager, JwtService jwtService, InMemoryUserDetailsService userDetailsService) {
        this.authManager = authManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest req) {
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.email(), req.password())
        );

        UserDetails user = (UserDetails) auth.getPrincipal();
        String role = user.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        String token = jwtService.generateToken(user.getUsername(), role);

        return new AuthResponse(token, "Bearer", user.getUsername(), role);
    }
}

@RestController
@RequestMapping("/api/v1")
class ResourceController {

    // Akses untuk semua user yang sudah login (USER atau ADMIN)
    @GetMapping("/profile")
    public Map<String, Object> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return Map.of(
            "message", "Akses profil berhasil",
            "email", userDetails.getUsername(),
            "roles", userDetails.getAuthorities()
        );
    }

    // Khusus Role ADMIN (Dilindungi via URL Mapping & @PreAuthorize)
    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, String> getAdminDashboard() {
        return Map.of("data", "Selamat Datang di Rahasia Admin Dashboard!");
    }
}

// ==========================================
// 7. MAIN APPLICATION & SEEDER
// ==========================================
@SpringBootApplication
public class SecurityApplication {
    public static void main(String[] args) {
        SpringApplication.run(SecurityApplication.class, args);
    }

    @Bean
    public CommandLineRunner seeder(InMemoryUserDetailsService userService, PasswordEncoder encoder) {
        return args -> {
            // Seed User Biasa
            userService.saveUser(new AppUser("budi@mail.com", encoder.encode("user123"), "Budi Santoso", Role.USER));
            // Seed Admin
            userService.saveUser(new AppUser("admin@mail.com", encoder.encode("admin123"), "Super Admin", Role.ADMIN));
            System.out.println("✅ Seeder Security Berhasil: User & Admin siap digunakan untuk login!");
        };
    }
}
```

## Contoh Demonstrasi Endpoint & JSON Output

1. **Request Login Sukses `POST /api/v1/auth/login` (Status 200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBtYWlsLmNvbSIs...",
  "tokenType": "Bearer",
  "email": "admin@mail.com",
  "role": "ADMIN"
}
```

2. **Request Profile Terotentikasi `GET /api/v1/profile` (Header `Authorization: Bearer <token>`):**
```json
{
  "message": "Akses profil berhasil",
  "email": "admin@mail.com",
  "roles": [{ "authority": "ROLE_ADMIN" }]
}
```

3. **Request Ditolak 403 Forbidden saat User Biasa Membuka Endpoint Admin:**
```json
{
  "code": 403,
  "status": "FORBIDDEN",
  "message": "Akses ditolak: Anda tidak memiliki role yang sesuai"
}
```

---

<a id="bagian-24"></a>

# 24. 🔗 Referensi Resmi

- [Spring Security 6 Reference Documentation](https://docs.spring.io/spring-security/reference/index.html)
- [Spring Security Architecture Guide](https://spring.io/guides/topicals/spring-security-architecture)
- [JJWT (Java JWT) Official GitHub & Documentation](https://github.com/jwtk/jjwt)
- [OWASP JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
