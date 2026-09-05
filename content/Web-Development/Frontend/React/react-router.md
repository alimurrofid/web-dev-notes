---
title: "React Router"
description: "Routing modern dengan React Router (v6+): createBrowserRouter, RouterProvider, Outlet, Loaders, Actions, Nested Routes, dan Protected Routes."
order: 2
tags:
  - web-development
  - frontend
  - react
  - router
  - spa
---

# React Router

> **Target:** Pemula yang telah memahami dasar React (Components, JSX, Props, State, Effects), serta ingin membangun **Single Page Application (SPA) multi-halaman berkinerja tinggi menggunakan React Router v6.20+ / v7** (React 18 / 19 & Vite).
> **Versi:** React Router v6+ / Data API
> **Prasyarat:** [[react-dasar|React Dasar]]
> Fokus modul pembelajaran ini: **Client-Side Routing mental model → `<BrowserRouter>`, `<Routes>`, `<Route>` → `<Link>` vs `<NavLink>` (active class styling) → Dynamic Routes & `useParams()` → Query Search Params (`useSearchParams()`) → Programmatic Navigation (`useNavigate()`) → `useLocation` & state passing → Nested Routes & `<Outlet>` Layouts → Protected Routes (Auth Guards) → Multi-Layouts → Data Loaders & Actions (v6.4+) → Route Error Handling (`errorElement`) → Code Splitting (`React.lazy` & `<Suspense>`) → mini project E-Commerce & Dashboard SPA**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: Client-Side Routing, BrowserRouter, Routes, Link, NavLink, 404 Catch-All, useParams, useSearchParams, dan useNavigate

🟡 Lanjutan
→ pelajari setelah routing dasar: Nested Routes & <Outlet>, Index Route, Protected Routes (Auth Guards), Multiple Layouts, dan Data Loaders

🔴 Advanced / Operasional
→ penting untuk arsitektur production: Code Splitting (React.lazy & Suspense), Route Error Boundary, dan Scroll Restoration
```

Mental model alur navigasi Client-Side Routing pada Single Page Application (SPA):

```text
                 PENGGUNA KLIK LINK (<Link to="/products">)
                                │
                                ▼
                 INTERCEPT OLEH REACT ROUTER
        (Mencegah browser melakukan Full Page Reload HTTP)
                                │
                                ▼
             UPDATE URL BROWSER (HTML5 History API)
                   window.history.pushState()
                                │
                                ▼
            MATCHING ROUTE (<Routes> / <Route path>)
                                │
                                ▼
           RENDER KOMPONEN BARU (<ProductList />)
         (Hanya komponen konten yang di-mount ulang,
          Navbar/Sidebar tetap utuh tanpa flicker!)
```

**Hafalan:**

```text
Client-Side Routing → mekanisme pergantian tampilan halaman di browser via JavaScript tanpa request halaman HTML baru ke server
BrowserRouter       → komponen konteks pembungkus utama yang menghubungkan React Router dengan HTML5 History API browser
<Routes>            → container selektor yang mengevaluasi seluruh child <Route> dan memilih satu rute yang paling cocok dengan URL
<Route>             → deklarasi pemetaan antara path URL (path) dengan komponen UI yang ditampilkan (element)
<Link>              → komponen navigasi pengganti tag <a> standar untuk mencegah reload browser saat berpindah halaman
<NavLink>           → komponen navigasi pintar yang mengetahui apakah dirinya sedang aktif sesuai URL saat ini (isActive)
<Outlet>            → placeholder penampung tempat komponen child route dirender di dalam komponen parent layout
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan Client-Side Routing & Mental Model SPA](#bagian-1)
2. [Instalasi & Setup Dasar `react-router-dom`](#bagian-2)
3. [Navigasi Antar Halaman: Komponen `<Link>` vs Tag `<a>` Standar](#bagian-3)
4. [Navigasi Aktif dengan `<NavLink>`](#bagian-4)
5. [Halaman Not Found (404 Page) dengan Catch-All Route](#bagian-5)
6. [Dynamic Routing & URL Params dengan `useParams()`](#bagian-6)
7. [Query String & Search Params dengan `useSearchParams()`](#bagian-7)
8. [Navigasi Terprogram (*Programmatic Navigation*) dengan `useNavigate()`](#bagian-8)

### 🟡 Lanjutan

9. [Mengoper State Antar Halaman dengan `useLocation()`](#bagian-9)
10. [Nested Routes & Komponen `<Outlet>`](#bagian-10)
11. [Index Route (`<Route index />`)](#bagian-11)
12. [Protected Routes / Route Guards](#bagian-12)
13. [Multiple Layouts (Layout Publik vs Layout Admin Berbeda)](#bagian-13)
14. [Data Fetching Modern dengan Router Loaders (v6.4+)](#bagian-14)
15. [Form Actions & Mutasi Data (v6.4+)](#bagian-15)
16. [Error Handling Terisolasi pada Route (`errorElement` & `useRouteError`)](#bagian-16)

### 🔴 Advanced / Operasional

17. [Code Splitting & Lazy Loading Halaman](#bagian-17)
18. [Scroll Restoration Otomatis](#bagian-18)

### 🛠️ Referensi & Praktik

19. [Peta Ingatan Cepat](#bagian-19)
20. [Tabel Ringkasan](#bagian-20)
21. [Cheat Code React Router 10 Detik](#bagian-21)
22. [Urutan Belajar yang Disarankan](#bagian-22)
23. [Mini Project: Production-Ready E-Commerce & Admin Dashboard SPA Web App](#bagian-23)
24. [Referensi Resmi](#bagian-24)

---

<a id="bagian-1"></a>

## 1. 🟢 Pengenalan Client-Side Routing & Mental Model SPA

#### Konsep

Pada website tradisional (Multi-Page Application / MPA), setiap kali pengguna mengklik menu navigasi, browser mengirimkan HTTP request baru ke server, layar berkedip putih (*Full Page Reload*), dan server mengirim ulang file HTML lengkap.

Pada **Single Page Application (SPA)** dengan **React Router**:
- Server hanya mengirimkan satu file `index.html` dan bundle JavaScript di awal.
- Saat pengguna berpindah halaman, **React Router mengubah URL browser menggunakan HTML5 History API** dan **langsung menukar komponen tampilan di layar secara instan tanpa reload browser sama sekali**.

#### Cara Kerja

```text
Website Tradisional (MPA):
Klik Menu ──(HTTP Request)──> Server Render HTML Baru ──(Layar Berkedip Putih)──> Tampil

React Router (SPA):
Klik Menu ──(Client Routing)──> JS Tukar Komponen Instan ──(0ms Flicker / Smooth)──> Tampil
```

**Hafalan:**

```text
SPA (Single Page Application) → arsitektur web modern yang memuat satu halaman dan memperbarui konten secara dinamis via JS
```

---

<a id="bagian-2"></a>

## 2. 🟢 Instalasi & Setup Dasar `react-router-dom`

#### Konsep

Untuk menggunakan React Router di aplikasi web React (Vite):
```bash
npm install react-router-dom
```

Tiga Komponen Fundamental:
1. **`<BrowserRouter>`:** Wajib membungkus seluruh hierarki komponen routing di `App.jsx` atau `main.jsx`.
2. **`<Routes>`:** Mengevaluasi path URL saat ini dan memilih satu `<Route>` yang paling spesifik.
3. **`<Route path="..." element={<Component />} />`:** Memetakan URL path ke komponen JSX.

#### Contoh

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Halaman-halaman
function HomePage() { return <h2>🏠 Halaman Utama (Home)</h2>; }
function AboutPage() { return <h2>ℹ️ Tentang Kami (About)</h2>; }
function ContactPage() { return <h2>📞 Kontak Kami (Contact)</h2>; }

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        <h1>Toko Modern App</h1>
        <hr />
        
        {/* Deklarasi Peta Rute */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
```

**Hafalan:**

```text
<BrowserRouter> <Routes> <Route path="/url" element={<Component />} /> </Routes> </BrowserRouter>
```

---

<a id="bagian-3"></a>

## 3. 🟢 Navigasi Antar Halaman: Komponen `<Link>` vs Tag `<a>` Standar

#### Konsep

> [!WARNING]
> **DILARANG MENGGUNAKAN TAG `<a href="/about">` UNTUK NAVIGASI INTERNAL DI REACT!** Tag `<a>` standar akan memaksa browser melakukan refresh halaman penuh, yang merusak state aplikasi React di memori.

Gunakan komponen **`<Link to="/about">`**:
- Mencegah browser melakukan reload halaman.
- Mengubah URL secara mulus dan memicu pembaruan komponen secara instan (*Client-Side Navigation*).

#### Contoh

```jsx
import { Link } from 'react-router-dom';

export function NavigationBar() {
  return (
    <nav style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
      {/* Link SPA Tanpa Reload */}
      <Link to="/">Beranda</Link>
      <Link to="/about">Tentang Kami</Link>
      <Link to="/contact">Kontak</Link>

      {/* Link Eksternal Boleh Tetap Menggunakan <a> */}
      <a href="https://google.com" target="_blank" rel="noreferrer">
        Google (Eksternal)
      </a>
    </nav>
  );
}
```

**Hafalan:**

```text
<Link to="/target-path">Label</Link> → komponen navigasi internal SPA tanpa memicu reload browser
```

---

<a id="bagian-4"></a>

## 4. 🟢 Navigasi Aktif dengan `<NavLink>`

#### Konsep

Komponen **`<NavLink>`** adalah versi pintar dari `<Link>` yang dirancang khusus untuk **Menu Navigasi (Navbar / Sidebar)**.

`<NavLink>` otomatis mengetahui apakah URL saat ini sedang aktif dan menyediakan parameter boolean **`isActive`** untuk memberikan styling CSS class atau inline style khusus (misal: menebalkan teks menu yang sedang aktif).

#### Contoh

```jsx
import { NavLink } from 'react-router-dom';

export function ActiveNavbar() {
  return (
    <nav style={{ display: "flex", gap: "20px", padding: "10px", background: "#f1f5f9" }}>
      {/* 1. Menggunakan Dynamic ClassName */}
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "nav-link active-menu" : "nav-link")}
      >
        Home
      </NavLink>

      {/* 2. Menggunakan Dynamic Inline Style */}
      <NavLink
        to="/products"
        style={({ isActive }) => ({
          color: isActive ? "#2563eb" : "#475569",
          fontWeight: isActive ? "bold" : "normal",
          textDecoration: isActive ? "underline" : "none"
        })}
      >
        Katalog Produk
      </NavLink>
    </nav>
  );
}
```

**Hafalan:**

```text
<NavLink to="/url" className={({ isActive }) => isActive ? "active" : ""}>
```

---

<a id="bagian-5"></a>

## 5. 🟢 Halaman Not Found (404 Page) dengan Catch-All Route

#### Konsep

Jika pengguna mengetik URL yang tidak terdaftar di aplikasi (misal: `/halaman-acak-123`), kita harus menampilkan **Halaman 404 (Not Found)** yang informatif dan ramah.

Gunakan **Catch-All Route: `path="*"`** yang diletakkan di **paling bawah** deklarasi `<Routes>`. Rute ini akan menangkap seluruh URL yang tidak cocok dengan rute di atasnya.

#### Contoh

```jsx
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>404</h1>
      <h2>Halaman Tidak Ditemukan</h2>
      <p>Maaf, alamat URL yang Anda tuju tidak tersedia.</p>
      <Link to="/" style={{ color: "#2563eb", fontWeight: "bold" }}>
        ⬅ Kembali ke Halaman Utama
      </Link>
    </div>
  );
}

// Di dalam App.jsx:
// <Routes>
//   <Route path="/" element={<Home />} />
//   <Route path="/about" element={<About />} />
//   <Route path="*" element={<NotFoundPage />} /> {/* Menangkap seluruh 404 */}
// </Routes>
```

**Hafalan:**

```text
<Route path="*" element={<NotFoundPage />} /> → menangkap seluruh URL tidak valid sebagai halaman 404
```

---

<a id="bagian-6"></a>

## 6. 🟢 Dynamic Routing & URL Params dengan `useParams()`

#### Konsep

Ketika membuat halaman detail (misal: detail produk `/products/101` atau profil user `/users/budi`), kita tidak mungkin membuat ratusan tag `<Route>` satu per satu.

Kita menggunakan **Dynamic Route** dengan menyematkan titik dua (`:`) pada segmen path:
`<Route path="/products/:productId" element={<ProductDetailPage />} />`

Di dalam komponen target, kita mengekstrak nilai parameter dinamis tersebut menggunakan Hook **`useParams()`**.

#### Contoh

Deklarasi Route:
```jsx
<Route path="/products/:productId" element={<ProductDetail />} />
```

Komponen Target (ProductDetail):
```jsx
import { useParams, Link } from 'react-router-dom';

export default function ProductDetail() {
  // Mengekstrak parameter 'productId' dari URL
  const { productId } = useParams();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Detail Produk</h2>
      <p>Sedang menampilkan informasi untuk Produk ID: <strong>{productId}</strong></p>
      <Link to="/products">⬅ Kembali ke Daftar Produk</Link>
    </div>
  );
}
```

#### Output

Navigasi URL: `http://localhost:5173/products/PROD-99`
```text
Detail Produk
Sedang menampilkan informasi untuk Produk ID: PROD-99
```

**Hafalan:**

```text
path="/resource/:paramName"   → mendefinisikan rute dinamis dengan parameter URL
const { paramName } = useParams() → mengekstrak nilai parameter dinamis dari URL
```

---

<a id="bagian-7"></a>

## 7. 🟢 Query String & Search Params dengan `useSearchParams()`

#### Konsep

Query parameters berada di ujung URL setelah tanda tanya (contoh: `/search?keyword=laptop&sort=asc`).

Hook **`useSearchParams()`** bekerja sangat mirip dengan `useState`:
- Mengembalikan array `[searchParams, setSearchParams]`.
- `searchParams.get("keyword")` : Membaca nilai query parameter.
- `setSearchParams({ keyword: "mouse" })` : Memperbarui query parameter di URL secara reaktif.

#### Contoh

```jsx
import { useSearchParams } from 'react-router-dom';

export default function SearchCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Membaca nilai dari URL (misal: ?keyword=buku&category=it)
  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "ALL";

  const handleKeywordChange = (e) => {
    const newKeyword = e.target.value;
    if (newKeyword) {
      setSearchParams({ keyword: newKeyword, category });
    } else {
      setSearchParams({ category }); // Hapus keyword jika kosong
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pencarian Katalog</h2>
      <input
        type="text"
        value={keyword}
        onChange={handleKeywordChange}
        placeholder="Ketik pencarian..."
        style={{ padding: "8px", width: "250px" }}
      />
      <p>Parameter Aktif: Keyword = <strong>{keyword || "(Kosong)"}</strong> | Kategori = <strong>{category}</strong></p>
    </div>
  );
}
```

**Hafalan:**

```text
const [searchParams, setSearchParams] = useSearchParams(); → mengelola query string URL (?key=val)
searchParams.get("keyName")                                → membaca nilai query param dari URL
```

---

<a id="bagian-8"></a>

## 8. 🟢 Navigasi Terprogram (*Programmatic Navigation*) dengan `useNavigate()`

#### Konsep

Seringkali kita perlu memindahkan halaman **secara otomatis melalui kode JavaScript** (misal: setelah user berhasil submit form login, setelah timer countdown selesai, atau tombol "Kembali ke Halaman Sebelumnya").

Gunakan Hook **`useNavigate()`**:
- `navigate("/dashboard")` : Pindah ke halaman `/dashboard`.
- `navigate("/dashboard", { replace: true })` : Pindah halaman sambil mengganti riwayat history saat ini (mencegah user menekan tombol Back kembali ke form login).
- `navigate(-1)` : Mundur 1 langkah ke halaman sebelumnya (*Browser Back Button*).
- `navigate(1)` : Maju 1 langkah ke halaman berikutnya (*Browser Forward Button*).

#### Contoh

```jsx
import { useNavigate } from 'react-router-dom';

export default function CheckoutForm() {
  const navigate = useNavigate();

  const handleProcessOrder = () => {
    console.log("Memproses pembayaran...");

    // Simulasi sukses bayar -> Redirect ke halaman sukses
    navigate("/order-success", { replace: true });
  };

  return (
    <div>
      <h2>Konfirmasi Checkout</h2>
      <button onClick={() => navigate(-1)}>⬅ Batal & Kembali</button>
      <button onClick={handleProcessOrder} style={{ marginLeft: "10px" }}>Bayar Sekarang ➡</button>
    </div>
  );
}
```

**Hafalan:**

```text
const navigate = useNavigate();           → inisialisasi fungsi navigasi terprogram
navigate("/path", { replace: true })     → pindah ke URL tujuan tanpa menambah entry history baru
navigate(-1)                              → kembali ke halaman sebelumnya (Back)
```

---

<a id="bagian-9"></a>

## 9. 🟡 Mengoper State Antar Halaman dengan `useLocation()`

#### Konsep

Terkadang kita ingin mengirim data sementara dari Halaman A ke Halaman B **tanpa menampilkan data tersebut di URL bar** (misal: mengirim pesan notifikasi sukses *"Registrasi berhasil, silakan login"* atau data checkout sementara).

Caranya:
1. Saat navigasi, sertakan opsi `state`: `navigate("/login", { state: { flashMessage: "Akun siap!" } })`.
2. Di halaman tujuan, baca data via Hook **`useLocation().state`**.

#### Contoh

Halaman Pengirim (RegisterPage):
```jsx
const handleRegisterSuccess = () => {
  navigate("/login", { 
    state: { successNotice: "Pendaftaran sukses! Silakan masukkan password Anda." } 
  });
};
```

Halaman Penerima (LoginPage):
```jsx
import { useLocation } from 'react-router-dom';

export default function LoginPage() {
  const location = useLocation();
  // Membaca state yang dikirim saat navigasi
  const message = location.state?.successNotice;

  return (
    <div>
      <h2>Halaman Login</h2>
      {message && (
        <div style={{ background: "#dcfce7", color: "#166534", padding: "10px", marginBottom: "15px", borderRadius: "4px" }}>
          ✅ {message}
        </div>
      )}
      <input type="text" placeholder="Email" /><br />
      <input type="password" placeholder="Password" />
    </div>
  );
}
```

**Hafalan:**

```text
navigate("/url", { state: { data: value } }) → mengirim payload data terselubung saat navigasi
const { state } = useLocation()             → membaca payload state di halaman tujuan
```

---

<a id="bagian-10"></a>

## 10. 🟡 Nested Routes & Komponen `<Outlet>`

#### Konsep

Dalam aplikasi profesional, banyak halaman berbagi tata letak yang sama (misal: Header Navbar di atas, Sidebar di kiri, dan Footer di bawah). Hanya area konten tengah yang berganti-ganti.

**Nested Routes & `<Outlet>` (Arsitektur Layout Bersama)**:
1. Buat Komponen Layout yang meletakkan tag **`<Outlet />`** di area konten dinamisnya.
2. Di deklarasi route, bungkus rute-rute anak (*Child Routes*) di dalam rute induk (*Parent Layout Route*).

#### Contoh

1. Komponen Layout Bersama (RootLayout):
```jsx
import { NavLink, Outlet } from 'react-router-dom';

export function RootLayout() {
  return (
    <div className="layout-container">
      {/* Navbar Statis Tetap Terpasang */}
      <header style={{ background: "#1e293b", color: "#fff", padding: "15px 20px" }}>
        <h3>Dashboard E-Commerce</h3>
        <nav style={{ display: "flex", gap: "15px" }}>
          <NavLink to="/dashboard" end style={{ color: "#fff" }}>Ringkasan</NavLink>
          <NavLink to="/dashboard/orders" style={{ color: "#fff" }}>Pesanan</NavLink>
          <NavLink to="/dashboard/settings" style={{ color: "#fff" }}>Pengaturan</NavLink>
        </nav>
      </header>

      {/* Konten Halaman Anak Dirender di Sini */}
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>

      {/* Footer Statis */}
      <footer style={{ textAlign: "center", padding: "10px", color: "#94a3b8" }}>
        © 2026 Toko Modern. All rights reserved.
      </footer>
    </div>
  );
}
```

2. Konfigurasi Rute Bersarang di `App.jsx`:
```jsx
<Routes>
  {/* Parent Layout Route */}
  <Route path="/dashboard" element={<RootLayout />}>
    <Route index element={<DashboardSummary />} /> {/* URL: /dashboard */}
    <Route path="orders" element={<OrderList />} />   {/* URL: /dashboard/orders */}
    <Route path="settings" element={<SettingsPage />} /> {/* URL: /dashboard/settings */}
  </Route>
</Routes>
```

#### Cara Kerja

```text
                        RootLayout
         ┌──────────────────────────────────────┐
         │ Header & Navigation Menu (Statis)    │
         ├──────────────────────────────────────┤
         │                                      │
         │             <Outlet />               │
         │  (Diisi oleh Dashboard / Orders /    │
         │   Settings secara dinamis)           │
         │                                      │
         ├──────────────────────────────────────┤
         │ Footer (Statis)                      │
         └──────────────────────────────────────┘
```

**Hafalan:**

```text
<Outlet /> → gerbang placeholder di dalam layout tempat komponen child route dirender otomatis
```

---

<a id="bagian-11"></a>

## 11. 🟡 Index Route (`<Route index />`)

#### Konsep

Ketika kita memiliki Nested Route (misal: parent path `/dashboard`), rute apa yang harus ditampilkan jika pengguna membuka URL tepat di `/dashboard` (tanpa sub-path tambahan)?

Gunakan **Index Route: `<Route index element={<DefaultComponent />} />`**:
- Tidak memerlukan atribut `path`.
- Otomatis menjadi tampilan default untuk URL induknya.

**Hafalan:**

```text
<Route index element={<Home />} /> → rute default yang otomatis tampil saat path induk diakses
```

---

<a id="bagian-12"></a>

## 12. 🟡 Protected Routes / Route Guards

#### Konsep

Halaman sensitif (seperti Dashboard Pengguna atau Panel Admin) **tidak boleh dapat diakses oleh pengunjung yang belum login**.

**Pola Protected Route (Route Guard)**:
1. Buat komponen pembungkus `ProtectedRoute`.
2. Periksa status otentikasi (misal: dari state/token).
3. Jika belum login $\rightarrow$ redirect paksa menggunakan **`<Navigate to="/login" replace />`**.
4. Jika sudah login $\rightarrow$ render konten menggunakan **`<Outlet />`** atau `{children}`.

#### Contoh

```jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// Komponen Guard Pelindung
export function ProtectedRoute({ isAuthenticated }) {
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect ke login sambil menyimpan lokasi asal agar bisa redirect balik setelah login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika sudah terotentikasi, izinkan akses ke halaman anak
  return <Outlet />;
}
```

Penerapan di Deklarasi Routes:
```jsx
<Routes>
  {/* Rute Publik */}
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />

  {/* Rute Terproteksi (Wajib Login) */}
  <Route element={<ProtectedRoute isAuthenticated={isUserLoggedIn} />}>
    <Route path="/profile" element={<UserProfilePage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/orders" element={<OrdersPage />} />
  </Route>
</Routes>
```

**Hafalan:**

```text
<Navigate to="/login" replace /> → komponen redirect otomatis ke rute lain secara deklaratif
```

---

<a id="bagian-13"></a>

## 13. 🟡 Multiple Layouts (Layout Publik vs Layout Admin Berbeda)

#### Konsep

Aplikasi nyata seringkali membutuhkan tata letak yang berbeda drastis:
- **Halaman Publik:** Memiliki Navbar umum dan Footer besar.
- **Halaman Admin / Dashboard:** Memiliki Sidebar kiri gelap dan tanpa Footer publik.
- **Halaman Auth (Login/Register):** Halaman bersih kotak di tengah layar (*Blank Canvas*).

Kita dapat membuat banyak layout bersarang di dalam `<Routes>` secara modular.

#### Contoh

```jsx
<Routes>
  {/* 1. Kelompok Layout Publik */}
  <Route element={<PublicLayout />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/catalog" element={<CatalogPage />} />
  </Route>

  {/* 2. Kelompok Layout Auth (Tanpa Navbar) */}
  <Route element={<AuthLayout />}>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
  </Route>

  {/* 3. Kelompok Layout Admin (Dengan Sidebar) */}
  <Route path="/admin" element={<AdminSidebarLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="users" element={<AdminUserList />} />
  </Route>
</Routes>
```

**Hafalan:**

```text
Multiple Layouts → mengelompokkan rute-rute ke dalam parent layout wrapper yang berbeda
```

---

<a id="bagian-14"></a>

## 14. 🟡 Data Fetching Modern dengan Router Loaders (v6.4+)

#### Konsep

Di React Router v6.4+, diperkenalkan arsitektur **Data Routers (`createBrowserRouter`)**.

Alih-alih melakukan fetching data di dalam `useEffect` di dalam komponen (yang menyebabkan loading bertingkat / *Waterfall Loading*), kita dapat mendefinisikan fungsi **`loader`**:
- React Router akan **memulai fetching data secara paralel sebelum komponen dirender**.
- Komponen membaca data hasil fetch menggunakan Hook **`useLoaderData()`**.

#### Contoh

```jsx
import { createBrowserRouter, RouterProvider, useLoaderData } from 'react-router-dom';

// 1. Fungsi Loader (Data Fetcher)
export async function productsLoader() {
  const response = await fetch("https://fakestoreapi.com/products");
  if (!response.ok) throw new Error("Gagal memuat produk");
  return response.json();
}

// 2. Komponen Halaman
function ProductCatalogPage() {
  const products = useLoaderData(); // Membaca data langsung dari loader!

  return (
    <div>
      <h2>Katalog Produk (via Loader)</h2>
      <ul>
        {products.map(p => <li key={p.id}>{p.title} - ${p.price}</li>)}
      </ul>
    </div>
  );
}

// 3. Router Setup
const router = createBrowserRouter([
  {
    path: "/products",
    element: <ProductCatalogPage />,
    loader: productsLoader // Daftarkan loader di sini
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
```

**Hafalan:**

```text
loader: fetchFunction         → memicu fetching data paralel sebelum komponen dirender
const data = useLoaderData() → membaca data hasil loader di dalam komponen
```

---

<a id="bagian-15"></a>

## 15. 🟡 Form Actions & Mutasi Data (v6.4+)

#### Konsep

React Router v6.4+ menyediakan komponen **`<Form method="post">`** dan fungsi **`action`** untuk menyederhanakan pengiriman form data (mutasi data) ala framework web modern:
- Saat form disubmit, React Router otomatis memanggil fungsi `action`.
- Anda membaca form data via `await request.formData()`.
- Setelah mutasi sukses, router otomatis melakukan revalidasi dan memuat ulang seluruh data `loader` yang aktif secara otomatis.

#### Contoh

```jsx
import { Form, redirect } from 'react-router-dom';

// Fungsi Action (Penangan Submit)
export async function createProductAction({ request }) {
  const formData = await request.formData();
  const title = formData.get("title");
  const price = formData.get("price");

  await fetch("/api/products", {
    method: "POST",
    body: JSON.stringify({ title, price })
  });

  return redirect("/products"); // Redirect otomatis setelah simpan
}

// Komponen Form
export function NewProductForm() {
  return (
    <Form method="post">
      <input type="text" name="title" placeholder="Nama Produk" />
      <input type="number" name="price" placeholder="Harga" />
      <button type="submit">Simpan Produk</button>
    </Form>
  );
}
```

**Hafalan:**

```text
<Form method="post"> → form deklaratif React Router yang otomatis memicu eksekusi fungsi action
```

---

<a id="bagian-16"></a>

## 16. 🟡 Error Handling Terisolasi pada Route (`errorElement` & `useRouteError`)

#### Konsep

Jika terjadi error saat fetching API di fungsi `loader` atau error crash JavaScript pada halaman tertentu, secara default seluruh aplikasi React akan crash dan menampilkan layar kosong (*White Screen of Death*).

Properti **`errorElement`**:
- Mengisolasi crash hanya pada rute yang bermasalah.
- Navbar dan bagian lain aplikasi tetap utuh dan berfungsi.
- Hook **`useRouteError()`** dapat digunakan untuk membaca detail pesan error.

#### Contoh

```jsx
import { useRouteError, Link } from 'react-router-dom';

export function RouteErrorFallback() {
  const error = useRouteError();

  return (
    <div style={{ background: "#fee2e2", color: "#991b1b", padding: "20px", borderRadius: "8px" }}>
      <h3>Terjadi Kesalahan pada Halaman Ini!</h3>
      <p>{error.message || "Gagal memuat data dari server."}</p>
      <Link to="/" style={{ color: "#991b1b", fontWeight: "bold" }}>Kembali ke Beranda</Link>
    </div>
  );
}

// Di Router:
// {
//   path: "/products",
//   element: <ProductCatalog />,
//   loader: productsLoader,
//   errorElement: <RouteErrorFallback /> // Penangkal Crash Terisolasi!
// }
```

**Hafalan:**

```text
errorElement={<ErrorComponent />} → menangkap runtime error terisolasi pada level rute tertentu
```

---

<a id="bagian-17"></a>

## 17. 🔴 Code Splitting & Lazy Loading Halaman

#### Konsep

Pada aplikasi besar dengan puluhan halaman, mendownload seluruh kode halaman di awal membuat loading pertama aplikasi menjadi lambat (*Bundle Size Bengkak*).

**Code Splitting / Lazy Loading**:
- Halaman hanya didownload dari server saat pengguna benar-benar menavigasi ke halaman tersebut.
- Menggunakan kombinasi **`React.lazy()`** dan **`<Suspense fallback={<Loading />}>`**.

#### Contoh

```jsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. Lazy Import Komponen Halaman
const HomePage = lazy(() => import('./pages/HomePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));

export default function App() {
  return (
    <BrowserRouter>
      {/* 2. Bungkus Routes dengan Suspense dan Loading Fallback */}
      <Suspense fallback={<div style={{ padding: "30px", textAlign: "center" }}>⏳ Memuat Halaman...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

**Hafalan:**

```text
const Page = lazy(() => import('./Page')); <Suspense fallback={<Loader />}> ... </Suspense>
```

---

<a id="bagian-18"></a>

## 18. 🔴 Scroll Restoration Otomatis

#### Konsep

Pada navigasi Single Page Application, saat pengguna scroll ke bawah di Halaman A lalu mengklik link ke Halaman B, browser terkadang mempertahankan posisi scroll di tengah halaman.

Komponen **`<ScrollRestoration />`** di Data Routers (`createBrowserRouter`) otomatis mengembalikan posisi scroll ke **paling atas (`0, 0`)** setiap kali berpindah halaman, serta mengembalikan posisi scroll yang tepat saat user menekan tombol Back.

**Hafalan:**

```text
<ScrollRestoration /> → mengotomatisasi scroll ke atas saat navigasi halaman baru di React Router
```

---

<a id="bagian-19"></a>

## 19. 🛠️ Peta Ingatan Cepat

```text
                        PETA ARSITEKTUR REACT ROUTER
                                      │
       ┌──────────────────────────────┼──────────────────────────────┐
       ▼                              ▼                              ▼
SETUP & NAVIGASI              DYNAMIC & QUERY PARAMS         LAYOUTS & GUARDS
├─ BrowserRouter & Routes     ├─ Dynamic: /items/:id         ├─ Nested Routes
├─ Route (path, element)      ├─ useParams()                 ├─ <Outlet /> (Placeholder)
├─ <Link to="...">            ├─ Query: ?q=val&page=1        ├─ <Route index />
└─ <NavLink> (isActive)       ├─ useSearchParams()           ├─ ProtectedRoute (Guard)
                              └─ useNavigate() (Programmatic)└─ <Navigate to="..." replace/>
```

---

<a id="bagian-20"></a>

## 20. 📚 Tabel Ringkasan

| Komponen / Hook | Tipe | Fungsi & Karakteristik Utama |
|---|---|---|
| `<BrowserRouter>` | Komponen | Pembungkus utama router berbasis HTML5 History API |
| `<Routes>` | Komponen | Kontainer penyeleksi rute yang cocok dengan URL |
| `<Route>` | Komponen | Pemetaan antara path URL dan komponen element |
| `<Link>` | Komponen | Navigasi internal SPA bebas reload |
| `<NavLink>` | Komponen | Navigasi menu pintar dengan status `isActive` |
| `<Outlet>` | Komponen | Placeholder render komponen anak di dalam parent layout |
| `<Navigate>` | Komponen | Melakukan pengalihan rute (redirect) deklaratif |
| `useParams()` | Hook | Mengekstrak parameter dinamis dari segmen path URL |
| `useSearchParams()`| Hook | Membaca & memanipulasi query parameters (`?key=val`) |
| `useNavigate()` | Hook | Navigasi halaman terprogram via kode JavaScript |
| `useLocation()` | Hook | Membaca informasi URL saat ini dan state payload |

---

<a id="bagian-21"></a>

## 21. ⚡ Cheat Code React Router 10 Detik

```jsx
// 1. Template Rute Dinamis & Parameter
// <Route path="/users/:id" element={<UserProfile />} />
const { id } = useParams();

// 2. Template Navigasi Terprogram
const navigate = useNavigate();
navigate("/dashboard", { replace: true });

// 3. Template Protected Route Sederhana
function ProtectedGuard({ isAuth }) {
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}
```

---

<a id="bagian-22"></a>

## 22. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Setup Routing Dasar & Navigasi
├── Kuasai BrowserRouter, Routes, Route, dan Catch-All 404 (*)
└── Biasakan menggunakan <Link> dan <NavLink> (isActive styling)
       │
       ▼
Langkah 2: Kuasai Dynamic Routing & URL Params
├── Terapkan rute dinamis /items/:id dengan useParams()
└── Kelola filter pencarian URL dengan useSearchParams()
       │
       ▼
Langkah 3: Kuasai Nested Layouts & Route Guards
├── Bangun layout bersama menggunakan <Outlet /> dan <Route index />
└── Lindungi halaman rahasia menggunakan ProtectedRoute (<Navigate replace />)
       │
       ▼
Langkah 4: Fitur Lanjutan & Optimasi
├── Pisahkan bundle halaman menggunakan React.lazy & Suspense
└── Pelajari Data Loaders & Actions (v6.4+)
       │
       ▼
Langkah 5: Siap Mengintegrasikan Global State Management dengan Zustand!
```

---

<a id="bagian-23"></a>

## 23. 🏗️ Mini Project: Production-Ready E-Commerce & Admin Dashboard SPA Web App

Aplikasi SPA e-commerce lengkap dan runnable yang mengintegrasikan: **`BrowserRouter`, Nested Layouts dengan `<Outlet>`, Dynamic Routes (`/products/:productId`), Query Search Params (`useSearchParams`), Programmatic Navigation (`useNavigate`), Protected Route Guard, Auth State, dan 404 Catch-All Page**.

```jsx
import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Link,
  Outlet,
  useParams,
  useSearchParams,
  useNavigate,
  Navigate,
  useLocation
} from 'react-router-dom';

// ==========================================
// 1. DUMMY DATABASE DATA
// ==========================================
const PRODUCT_DATA = [
  { id: "P1", name: "MacBook Pro M3", price: 25000000, category: "LAPTOP", desc: "Laptop kencang untuk developer profesional." },
  { id: "P2", name: "Keychron K2 Wireless", price: 1200000, category: "KEYBOARD", desc: "Keyboard mekanik 75% tactile." },
  { id: "P3", name: "Logitech MX Master 3S", price: 1500000, category: "MOUSE", desc: "Mouse ergonomis produktivitas tinggi." },
  { id: "P4", name: "Dell UltraSharp 27", price: 6500000, category: "MONITOR", desc: "Monitor 4K IPS akurasi warna 99% sRGB." }
];

// ==========================================
// 2. MAIN LAYOUT (WITH NAVBAR & OUTLET)
// ==========================================
function MainLayout({ user, onLogout }) {
  return (
    <div style={{ fontFamily: "Segoe UI, sans-serif", maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      {/* Top Navbar */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #e2e8f0", paddingBottom: "15px", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, color: "#2563eb" }}>🛍️ TechStore SPA</h2>
        <nav style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <NavLink to="/" end style={({ isActive }) => ({ color: isActive ? "#2563eb" : "#475569", fontWeight: isActive ? "bold" : "normal" })}>
            Beranda
          </NavLink>
          <NavLink to="/catalog" style={({ isActive }) => ({ color: isActive ? "#2563eb" : "#475569", fontWeight: isActive ? "bold" : "normal" })}>
            Katalog
          </NavLink>
          <NavLink to="/admin" style={({ isActive }) => ({ color: isActive ? "#2563eb" : "#475569", fontWeight: isActive ? "bold" : "normal" })}>
            Panel Admin 🔒
          </NavLink>
          {user ? (
            <button onClick={onLogout} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>
              Keluar ({user.name})
            </button>
          ) : (
            <Link to="/login" style={{ background: "#10b981", color: "#fff", padding: "6px 12px", borderRadius: "4px", textDecoration: "none" }}>
              Masuk
            </Link>
          )}
        </nav>
      </header>

      {/* Konten Halaman Aktif Dirender di Sini */}
      <main style={{ minHeight: "400px" }}>
        <Outlet />
      </main>

      <footer style={{ borderTop: "1px solid #e2e8f0", paddingTop: "15px", marginTop: "30px", textAlign: "center", color: "#94a3b8" }}>
        React Router v6 SPA Enterprise Demo © 2026
      </footer>
    </div>
  );
}

// ==========================================
// 3. PAGES (HOME, CATALOG, DETAIL, LOGIN, ADMIN)
// ==========================================
function HomePage() {
  return (
    <div>
      <h3>Selamat Datang di TechStore!</h3>
      <p>Aplikasi Single Page Application modern tanpa reload halaman.</p>
      <Link to="/catalog" style={{ display: "inline-block", background: "#2563eb", color: "#fff", padding: "10px 18px", borderRadius: "6px", textDecoration: "none", fontWeight: "bold" }}>
        Jelajahi Katalog Produk ➡
      </Link>
    </div>
  );
}

function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("q") || "";

  const filtered = PRODUCT_DATA.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()));

  return (
    <div>
      <h3>Katalog Produk</h3>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setSearchParams(e.target.value ? { q: e.target.value } : {})}
        placeholder="Cari produk (query params)..."
        style={{ padding: "8px 12px", width: "300px", borderRadius: "6px", border: "1px solid #cbd5e1", marginBottom: "20px" }}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        {filtered.map(p => (
          <div key={p.id} style={{ border: "1px solid #e2e8f0", padding: "16px", borderRadius: "8px", background: "#f8fafc" }}>
            <h4 style={{ margin: "0 0 8px 0" }}>{p.name}</h4>
            <div style={{ color: "#16a34a", fontWeight: "bold", marginBottom: "10px" }}>
              Rp {p.price.toLocaleString("id-ID")}
            </div>
            <Link to={`/catalog/${p.id}`} style={{ color: "#2563eb", textDecoration: "none", fontWeight: "bold" }}>
              Lihat Detail 🔎
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductDetailPage() {
  const { productId } = useParams(); // Dynamic URL Params
  const navigate = useNavigate();

  const product = PRODUCT_DATA.find(p => p.id === productId);

  if (!product) {
    return (
      <div>
        <h3>Produk tidak ditemukan!</h3>
        <button onClick={() => navigate("/catalog")}>Kembali ke Katalog</button>
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #e2e8f0", padding: "24px", borderRadius: "8px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "15px", cursor: "pointer" }}>⬅ Kembali</button>
      <h2>{product.name}</h2>
      <p style={{ color: "#64748b" }}>Kategori: <strong>{product.category}</strong></p>
      <h3 style={{ color: "#16a34a" }}>Rp {product.price.toLocaleString("id-ID")}</h3>
      <p>{product.desc}</p>
      <button onClick={() => alert("Pesanan ditambahkan ke keranjang!")} style={{ background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer" }}>
        Beli Sekarang
      </button>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = location.state?.from?.pathname || "/admin";

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ name: "Admin Utama", role: "ADMIN" });
    navigate(fromPath, { replace: true });
  };

  return (
    <div style={{ maxWidth: "350px", margin: "40px auto", border: "1px solid #e2e8f0", padding: "24px", borderRadius: "8px", textAlign: "center" }}>
      <h3>Masuk Akun</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input type="text" defaultValue="admin@techstore.com" readOnly style={{ padding: "8px" }} />
        <input type="password" defaultValue="password" readOnly style={{ padding: "8px" }} />
        <button type="submit" style={{ background: "#10b981", color: "#fff", border: "none", padding: "10px", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>
          Login Sekarang
        </button>
      </form>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div style={{ background: "#f1f5f9", padding: "20px", borderRadius: "8px" }}>
      <h3>🔒 Panel Dashboard Admin Terproteksi</h3>
      <p>Hanya pengguna terotentikasi yang dapat melihat halaman ini.</p>
      <ul>
        <li>Total Transaksi Hari Ini: 42 Pesanan</li>
        <li>Omset Harian: Rp 64.500.000,00</li>
      </ul>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>404</h1>
      <h2>Halaman Tidak Ditemukan</h2>
      <Link to="/">⬅ Kembali ke Beranda</Link>
    </div>
  );
}

// ==========================================
// 4. PROTECTED ROUTE GUARD COMPONENT
// ==========================================
function ProtectedRoute({ user }) {
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

// ==========================================
// 5. MAIN APP COMPONENT WITH ROUTES
// ==========================================
export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

  return (
    <BrowserRouter>
      <Routes>
        {/* Parent Layout */}
        <Route element={<MainLayout user={user} onLogout={handleLogout} />}>
          <Route index element={<HomePage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="catalog/:productId" element={<ProductDetailPage />} />
          <Route path="login" element={<LoginPage onLogin={handleLogin} />} />

          {/* Protected Routes Sub-Tree */}
          <Route element={<ProtectedRoute user={user} />}>
            <Route path="admin" element={<AdminDashboard />} />
          </Route>

          {/* Catch-All 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

#### Hasil Output Alur Demonstrasi SPA

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 🛍️ TechStore SPA        Beranda   Katalog   Panel Admin 🔒   [ Masuk ] │
├────────────────────────────────────────────────────────────────────────┤
│ URL: /catalog                                                          │
│                                                                        │
│ [ Cari produk (query params)...       ]                                │
│                                                                        │
│ ┌───────────────────────────┐      ┌───────────────────────────┐       │
│ │ MacBook Pro M3            │      │ Keychron K2 Wireless      │       │
│ │ Rp 25.000.000             │      │ Rp 1.200.000              │       │
│ │ [Lihat Detail 🔎]         │      │ [Lihat Detail 🔎]         │       │
│ └───────────────────────────┘      └───────────────────────────┘       │
├────────────────────────────────────────────────────────────────────────┤
│ (Klik [Lihat Detail] ──> URL: /catalog/P1 tanpa reload browser!)       │
└────────────────────────────────────────────────────────────────────────┘
```

---

<a id="bagian-24"></a>

## 24. 🔗 Referensi Resmi

- [React Router Official Documentation (reactrouter.com)](https://reactrouter.com/)
- [React Router GitHub Repository](https://github.com/remix-run/react-router)
- [MDN Web Docs: History API (pushState & popstate)](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
