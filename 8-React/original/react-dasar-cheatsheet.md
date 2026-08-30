# React Dasar Cheatsheet — Mudah Dipahami & Diingat

> **Target:** React 18/19 & Vite untuk pemula yang ingin memahami konsep dasar Virtual DOM, JSX, Functional Components, Props, useState, useEffect, Forms, dan Custom Hooks. Contoh dibuat sesingkat mungkin, dengan pola **materi → konsep → kode → output → hafalan**.
>
> React adalah library JavaScript deklaratif berbasis komponen untuk membangun antarmuka pengguna (User Interface / UI) interaktif.

## Daftar Isi

1. [Pengenalan Komponen & JSX](#1-pengenalan-komponen--jsx)
2. [Props](#2-props)
3. [State dengan useState](#3-state-dengan-usestate)
4. [Handling Events](#4-handling-events)
5. [Conditional Rendering](#5-conditional-rendering)
6. [Rendering Lists & Keys](#6-rendering-lists--keys)
7. [Controlled Forms](#7-controlled-forms)
8. [Side Effects dengan useEffect](#8-side-effects-dengan-useeffect)
9. [useRef](#9-useref)
10. [Custom Hooks](#10-custom-hooks)

---

# 1. Pengenalan Komponen & JSX

Komponen React adalah fungsi JavaScript yang mengembalikan elemen JSX (tampilan HTML di dalam JavaScript).

```jsx
export default function Header() {
  return (
    <header className="header">
      <h1>Selamat Datang di React</h1>
    </header>
  );
}
```

---

# 2. Props

Props digunakan untuk mengirimkan data dari komponen induk (*parent*) ke komponen anak (*child*).

```jsx
function Greeting({ name, role = "User" }) {
  return <h2>Halo, {name}! Role: {role}</h2>;
}

// Penggunaan: <Greeting name="Budi" role="Admin" />
```

---

# 3. State dengan useState

Menyimpan data lokal komponen yang ketika nilainya berubah akan memicu render ulang tampilan (*re-render*).

```jsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(prev => prev + 1)}>
      Klik: {count}
    </button>
  );
}
```

---

# 4. Handling Events

Menggunakan penamaan camelCase (`onClick`, `onChange`, `onSubmit`).

```jsx
function Button() {
  function handleClick(e) {
    e.preventDefault();
    alert("Tombol ditekan!");
  }

  return <button onClick={handleClick}>Submit</button>;
}
```

---

# 5. Conditional Rendering

- Ternary Operator: `isLoggedIn ? <Dashboard /> : <Login />`
- Logical AND: `unreadCount > 0 && <span>Ada pesan baru!</span>`

---

# 6. Rendering Lists & Keys

Menggunakan method `.map()` untuk me-render array data ke JSX. **Wajib menyertakan `key` prop unik**.

```jsx
const items = [{ id: 1, name: "Buku" }, { id: 2, name: "Pena" }];

function ItemList() {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

---

# 7. Controlled Forms

Nilai input HTML diikat langsung ke React State.

```jsx
function SimpleForm() {
  const [name, setName] = useState("");

  return (
    <input 
      type="text" 
      value={name} 
      onChange={(e) => setName(e.target.value)} 
      placeholder="Ketik nama..."
    />
  );
}
```

---

# 8. Side Effects dengan useEffect

Digunakan untuk sinkronisasi data eksternal, fetching API, atau timer.

```jsx
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []); // [] = dijalankan 1x saat komponen dipasang (mount)
}
```

---

# 9. useRef

Menyimpan referensi elemen DOM atau nilai mutable tanpa memicu re-render tampilan.

```jsx
import { useRef } from 'react';

function AutoFocusInput() {
  const inputRef = useRef(null);

  const focusInput = () => inputRef.current.focus();

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Fokuskan</button>
    </>
  );
}
```

---

# 10. Custom Hooks

Mengekstrak logika stateful yang dapat digunakan ulang antar komponen (diawali kata `use`).

```jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(prev => !prev);
  return [value, toggle];
}
```
