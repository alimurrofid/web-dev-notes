# React Router Cheatsheet — Mudah Dipahami & Diingat

> **Target:** React Router v6.20+ (React 18/19 & Vite) untuk pemula yang ingin membangun aplikasi Single Page Application (SPA) dengan navigasi dinamis, nested layouts, query params, dan protected routes. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> React Router adalah library perutean standar untuk React yang memungkinkan navigasi antar tampilan tanpa memuat ulang seluruh halaman browser.

## Daftar Isi

1. [Setup BrowserRouter](#1-setup-browserrouter)
2. [Link dan NavLink](#2-link-dan-navlink)
3. [Dynamic Route & useParams](#3-dynamic-route--useparams)
4. [Search Params & useSearchParams](#4-search-params--usesearchparams)
5. [Programmatic Navigation & useNavigate](#5-programmatic-navigation--usenavigate)
6. [Nested Routes & Outlet](#6-nested-routes--outlet)
7. [Protected Routes](#7-protected-routes)
8. [Error Page 404](#8-error-page-404)
9. [Lazy Loading](#9-lazy-loading)

---

# 1. Setup BrowserRouter

Membungkus aplikasi dengan `BrowserRouter`, `Routes`, dan `Route`.

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

# 2. Link dan NavLink

- `<Link to="/path">` : Navigasi SPA tanpa reload.
- `<NavLink to="/path">` : Menambahkan styling kelas aktif otomatis via `isActive`.

```jsx
import { Link, NavLink } from 'react-router-dom';

<NavLink to="/dashboard" className={({ isActive }) => isActive ? "active-menu" : ""}>
  Dashboard
</NavLink>
```

---

# 3. Dynamic Route & useParams

Menangkap parameter ID dinamis dari segmen URL.

```jsx
// Route: <Route path="/products/:id" element={<ProductDetail />} />

import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  return <h2>Detail Produk ID: {id}</h2>;
}
```

---

# 4. Search Params & useSearchParams

Membaca dan memodifikasi query string URL (`/search?q=laptop`).

```jsx
import { useSearchParams } from 'react-router-dom';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('q') || '';

  return (
    <input 
      value={keyword} 
      onChange={(e) => setSearchParams({ q: e.target.value })} 
    />
  );
}
```

---

# 5. Programmatic Navigation & useNavigate

Navigasi antar halaman melalui kode JavaScript.

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Navigasi ke dashboard setelah login
    navigate('/dashboard', { replace: true });
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

---

# 6. Nested Routes & Outlet

Membuat layout bersama (Navbar/Sidebar) di mana hanya konten tengah yang berubah via `<Outlet />`.

```jsx
import { Outlet } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div>
      <Sidebar />
      <main>
        <Outlet /> {/* Konten route anak dirender di sini */}
      </main>
    </div>
  );
}

// Route Setup:
// <Route path="/dashboard" element={<DashboardLayout />}>
//   <Route index element={<DashboardHome />} />
//   <Route path="settings" element={<Settings />} />
// </Route>
```

---

# 7. Protected Routes

Membatasi akses halaman khusus user yang sudah terotentikasi.

```jsx
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ isAuth }) {
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
```

---

# 8. Error Page 404

Catch-all route untuk menangkap seluruh URL yang tidak valid.

```jsx
<Route path="*" element={<h2>404 - Halaman Tidak Ditemukan</h2>} />
```

---

# 9. Lazy Loading

Memuat komponen halaman secara on-demand untuk menghemat ukuran bundle awal.

```jsx
import { lazy, Suspense } from 'react';

const AdminPanel = lazy(() => import('./pages/AdminPanel'));

<Suspense fallback={<div>Loading...</div>}>
  <AdminPanel />
</Suspense>
```
