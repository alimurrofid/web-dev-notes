# Spring Security & JWT Cheatsheet — Mudah Dipahami & Diingat

> **Target:** Spring Boot 3.3+ (Spring Security 6.x & Java 21 LTS) untuk pemula yang ingin memahami arsitektur keamanan, otentikasi stateless menggunakan JSON Web Token (JWT), password hashing BCrypt, dan Role-Based Access Control (RBAC). Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> Spring Security 6 menggunakan pendekatan Lambda DSL berbasis Bean SecurityFilterChain untuk mengamankan endpoint API secara modular.

## Daftar Isi

1. [SecurityFilterChain Bean](#1-securityfilterchain-bean)
2. [BCrypt PasswordEncoder](#2-bcrypt-passwordencoder)
3. [UserDetails & UserDetailsService](#3-userdetails--userdetailsservice)
4. [Anatomi JWT](#4-anatomi-jwt)
5. [JwtService Utility](#5-jwtservice-utility)
6. [JwtAuthenticationFilter](#6-jwtauthenticationfilter)
7. [Stateless Session](#7-stateless-session)
8. [Role-Based Access Control](#8-role-based-access-control)
9. [Method-Level Security (@PreAuthorize)](#9-method-level-security-preauthorize)
10. [AuthenticationEntryPoint](#10-authenticationentrypoint)

---

# 1. SecurityFilterChain Bean

Mengonfigurasi rantai filter keamanan menggunakan Lambda DSL modern di Spring Security 6.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
```

---

# 2. BCrypt PasswordEncoder

Meng-hash password pengguna dengan algoritma BCrypt yang aman dari serangan Rainbow Table.

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

// Penggunaan
String hashed = passwordEncoder.encode("rahasia123");
boolean valid = passwordEncoder.matches("rahasia123", hashed);
```

---

# 3. UserDetails & UserDetailsService

Memetakan entity akun pengguna ke model resmi Spring Security.

```java
public class CustomUserDetails implements UserDetails {
    private final User user;

    public CustomUserDetails(User user) { this.user = user; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
    }

    @Override
    public String getPassword() { return user.getPassword(); }

    @Override
    public String getUsername() { return user.getEmail(); }
}
```

---

# 4. Anatomi JWT

JWT terdiri dari 3 bagian yang dipisahkan oleh titik (`.`):
`Header.Payload(Claims).Signature`

---

# 5. JwtService Utility

Membuat dan memvalidasi token JWT menggunakan library JJWT.

```java
@Service
public class JwtService {
    private final SecretKey key = Jwts.SIG.HS256.key().build();

    public String generateToken(String username) {
        return Jwts.builder()
            .subject(username)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 86400000)) // 1 Hari
            .signWith(key)
            .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser().verifyWith(key).build()
            .parseSignedClaims(token).getPayload().getSubject();
    }
}
```

---

# 6. JwtAuthenticationFilter

Filter yang mencegat setiap request HTTP untuk mengekstrak dan memvalidasi header `Authorization: Bearer <token>`.

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            // Validasi dan set authentication ke SecurityContextHolder
        }
        filterChain.doFilter(request, response);
    }
}
```

---

# 7. Stateless Session

Menonaktifkan sesi berbasis cookie di server agar REST API bersifat stateless murni.

```java
http.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
```

---

# 8. Role-Based Access Control

Membatasi akses endpoint berdasarkan Role atau Authority.

```java
http.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/admin/**").hasRole("ADMIN")
    .requestMatchers("/api/products/**").hasAnyRole("USER", "ADMIN")
    .anyRequest().authenticated()
);
```

---

# 9. Method-Level Security (@PreAuthorize)

Mengamankan method service atau controller secara presisi.

```java
@EnableMethodSecurity
@Configuration
public class MethodSecurityConfig {}

@Service
public class ProductService {
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteProduct(Long id) {}
}
```

---

# 10. AuthenticationEntryPoint

Menangani response saat client tidak mengirimkan token atau token tidak valid (`401 Unauthorized`).

```java
@Component
public class CustomAuthEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest req, HttpServletResponse res, AuthenticationException ex) throws IOException {
        res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        res.setContentType("application/json");
        res.getWriter().write("{\"error\": \"Unauthorized: Token tidak valid atau tidak disertakan\"}");
    }
}
```
