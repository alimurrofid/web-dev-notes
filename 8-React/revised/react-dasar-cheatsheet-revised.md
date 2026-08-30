# React Dasar Cheatsheet Revised

> **Target:** Pemula yang telah memahami JavaScript dasar, DOM, dan ES6+ (Arrow Functions, Destructuring, Spread Operator, Modules), serta ingin menguasai **arsitektur antarmuka pengguna modern berbasis komponen menggunakan React 18 / 19 & Vite**.
>
> Fokus cheatsheet ini: **mental model deklaratif vs imperatif → Virtual DOM & Reconciliation → Tooling Vite → Aturan Emas JSX → Functional Components → Props & `children` → `useState` & State Immutability (Array & Object) → Synthetic Events → Conditional Rendering → List Rendering & `key` prop → Controlled Forms → `useEffect` Lifecycle & Cleanup Function → `useRef` → Lifting State Up → Custom Hooks → React Strict Mode → mini project Interactive Task & Expense Manager**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami: Mental Model Virtual DOM, JSX, Props, State (useState), dan Event Handling

🟡 Lanjutan
→ pelajari setelah memahami State dasar: List & Key, Controlled Forms, useEffect & Cleanup, useRef, dan Lifting State Up

🔴 Advanced / Operasional
→ penting untuk arsitektur scalable: Custom Hooks, React Strict Mode, dan Immutability Patterns
```

Mental model alur siklus kerja Re-render dan Virtual DOM di React:

```text
                    1. STATE / PROPS BERUBAH
                               │
                               ▼
                    2. RE-RENDER COMPONENT
             (Menghasilkan Virtual DOM Tree Baru)
                               │
                               ▼
                  3. RECONCILIATION & DIFFING
            (Bandingkan Virtual DOM Lama vs Baru)
                               │
                               ▼
                     4. COMMIT KE REAL DOM
         (Hanya mengupdate elemen HTML yang berubah saja)
                               │
                               ▼
                  5. BROWSER TAMPILKAN UI BARU
```

**Hafalan:**

```text
JSX (JavaScript XML) → ekstensi sintaksis JavaScript yang memungkinkan penulisan struktur mirip HTML di dalam file JS/JSX
Virtual DOM          → representasi ringan struktur DOM nyata dalam memori yang digunakan React untuk mengoptimasi render
Reconciliation       → proses komparasi (diffing) antar Virtual DOM untuk memperbarui DOM riil secara efisien dan minimal
Component            → fungsi JavaScript independen dan reusable yang menerima masukan (Props) dan mengembalikan tampilan (JSX)
Props (Properties)   → data masukan searah (Read-Only) yang dioper dari komponen induk (Parent) ke komponen anak (Child)
State                → data internal reaktif milik komponen yang ketika nilainya berubah akan memicu render ulang (Re-render)
Hook                 → fungsi khusus berawalan 'use' yang memungkinkan komponen fungsional mengakses state dan fitur lifecycle React
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan React JS & Mental Model Deklaratif](#bagian-1)
2. [Tooling Modern dengan Vite & Struktur Folder Proyek](#bagian-2)
3. [Anatomi Component & Aturan Emas JSX](#bagian-3)
4. [Menyematkan JavaScript di Dalam JSX](#bagian-4)
5. [Mengirim & Menerima Data via Props](#bagian-5)
6. [State Management Lokal dengan `useState`](#bagian-6)
7. [Mengelola State Objek & Array yang Kompleks](#bagian-7)
8. [Handling Events di React](#bagian-8)

### 🟡 Lanjutan

9. [Conditional Rendering](#bagian-9)
10. [Rendering List Data & Aturan Wajib `key` Prop](#bagian-10)
11. [Form Handling: Controlled Components vs Uncontrolled Components](#bagian-11)
12. [Menangani Multiple Form Inputs dengan Satu Handler Terpadu](#bagian-12)
13. [Lifecycle & Side Effects dengan `useEffect`](#bagian-13)
14. [Cleanup Function pada `useEffect`](#bagian-14)
15. [Mengakses DOM Langsung & Mutable Reference dengan `useRef`](#bagian-15)
16. [Mengangkat State ke Atas (*Lifting State Up*)](#bagian-16)

### 🔴 Advanced / Operasional

17. [Membangun Custom Hooks](#bagian-17)
18. [React Strict Mode & Cara Kerjanya](#bagian-18)

### 🛠️ Referensi & Praktik

19. [Peta Ingatan Cepat](#bagian-19)
20. [Tabel Ringkasan](#bagian-20)
21. [Cheat Code React Dasar 10 Detik](#bagian-21)
22. [Urutan Belajar yang Disarankan](#bagian-22)
23. [Mini Project: Production-Ready Interactive Task & Expense Manager Web App](#bagian-23)
24. [Referensi Resmi](#bagian-24)

---

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan React JS & Mental Model Deklaratif

## Konsep

Pada JavaScript murni (DOM Manipulation), kita memprogram secara **imperatif** (menginstruksikan langkah demi langkah teknis ke browser: `document.getElementById()`, `element.innerHTML = ...`, `btn.addEventListener()`). Cara ini sangat lambat dan rawan bug sinkronisasi data saat UI semakin kompleks.

**React bekerja secara Deklaratif**:
- Anda cukup mendeklarasikan: *"Tampilan UI harus seperti apa untuk data State tertentu"*.
- Saat data State berubah, **React yang secara otomatis dan cerdas memperbarui tampilan browser** menggunakan **Virtual DOM & Reconciliation Diffing Algorithm**.

Perbandingan Mental Model:
- **Imperatif (Vanilla JS):** Ubah data $\rightarrow$ Cari elemen DOM $\rightarrow$ Ubah teks elemen manual.
- **Deklaratif (React):** Ubah data State $\rightarrow$ UI otomatis menyesuaikan seketika.

## Cara Kerja

```text
Vanilla JS (Imperatif):
Developer ──(Perintah Mikro)──> Manipulasi Real DOM Manual (Lambat & Berat)

React JS (Deklaratif):
State Berubah ──> Virtual DOM (Cepat di Memori) ──(Diffing)──> Update Real DOM Parsial
```

**Hafalan:**

```text
Declarative UI → kita mendeskripsikan "apa tampilan yang diinginkan", React mengurus "bagaimana cara merendernya"
```

---

<a id="bagian-2"></a>

# 2. 🟢 Tooling Modern dengan Vite & Struktur Folder Proyek

## Konsep

Standar industri modern untuk membuat proyek React adalah **Vite** (bukan Create-React-App yang sudah usang). Vite menggunakan arsitektur *Native ES Modules* di browser yang memberikan kecepatan startup server lokal instan dan *Hot Module Replacement (HMR)* super kilat.

Perintah Pembuatan Proyek Baru:
```bash
npm create vite@latest nama-proyek -- --template react
cd nama-proyek
npm install
npm run dev
```

Struktur Folder Standar:
```text
nama-proyek/
├── public/          (Aset statis publik)
├── src/
│   ├── assets/      (Gambar, ikon, CSS global)
│   ├── components/  (Komponen-komponen UI reusable)
│   ├── App.jsx      (Komponen root utama aplikasi)
│   ├── main.jsx     (Entry point: me-render App ke DOM #root)
│   └── index.css    (Global style styling)
├── index.html       (File HTML tunggal berisi <div id="root"></div>)
├── package.json     (Daftar dependensi & scripts)
└── vite.config.js   (Konfigurasi bundler Vite)
```

**Hafalan:**

```text
main.jsx  → entry point JavaScript yang menyambungkan komponen <App /> ke elemen HTML <div id="root">
App.jsx   → komponen induk utama penampung seluruh antarmuka aplikasi React
```

---

<a id="bagian-3"></a>

# 3. 🟢 Anatomi Component & Aturan Emas JSX

## Konsep

**Component** di React adalah fungsi JavaScript murni yang mengembalikan elemen **JSX (JavaScript XML)**.

Aturan Emas Penulisan JSX:
1. **Nama Komponen Wajib Huruf Besar (*PascalCase*):** `function HeaderNav() {}` (Jika diawali huruf kecil seperti `headerNav`, React menganggapnya sebagai tag HTML biasa).
2. **Single Root Element:** JSX wajib memiliki tepat **satu elemen pembungkus utama**. Jika tidak ingin menambah elemen `<div>` ekstra di DOM, gunakan **React Fragment (`<>...</>`)**.
3. **Atribut `class` menjadi `className`:** Karena `class` adalah reserved keyword di JavaScript.
4. **Atribut `for` pada label menjadi `htmlFor`**.
5. **Semua Tag Wajib Ditutup (*Self-Closing*):** `<img />`, `<input />`, `<br />`, `<hr />`.

## Contoh

```jsx
// Komponen Kartu Profil (PascalCase)
export default function UserCard() {
  return (
    // React Fragment pembungkus
    <>
      <div className="card-container">
        <img src="https://via.placeholder.com/100" alt="Avatar User" className="avatar-img" />
        <h2 className="user-title">Alimur Rofid</h2>
        <p className="user-role">Full-Stack Engineer</p>
      </div>
      <hr />
    </>
  );
}
```

**Hafalan:**

```text
PascalCase Komponen  → nama fungsi komponen wajib berawalan huruf kapital (Header, UserCard)
<> ... </> (Fragment) → pembungkus JSX tanpa menambahkan elemen DOM HTML ekstra yang tidak perlu
className             → atribut penentu CSS class pada elemen JSX
```

---

<a id="bagian-4"></a>

# 4. 🟢 Menyematkan JavaScript di Dalam JSX

## Konsep

Di dalam JSX, Anda dapat mengeksekusi ekspresi JavaScript dinamis apapun (seperti variabel, pemanggilan fungsi, operasi matematika, ternary operator) dengan membungkusnya di dalam **tanda kurung kurawal tunggal `{ }`**.

Aturan Styling Inline:
- Atribut `style` menerima objek JavaScript, sehingga ditulis dengan **kurung kurawal ganda `style={{ ... }}`**.
- Properti CSS yang memiliki tanda strip diubah menjadi **camelCase** (misal: `background-color` $\rightarrow$ `backgroundColor`, `font-size` $\rightarrow$ `fontSize`).

## Contoh

```jsx
export default function ProductDisplay() {
  const productName = "Mechanical Keyboard";
  const price = 850000;
  const isAvailable = true;

  return (
    <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h3>{productName.toUpperCase()}</h3>
      <p>Harga: Rp {price.toLocaleString("id-ID")}</p>
      <p style={{ color: isAvailable ? "green" : "red", fontWeight: "bold" }}>
        Status: {isAvailable ? "TERSEDIA" : "HABIS"}
      </p>
    </div>
  );
}
```

## Output

```text
MECHANICAL KEYBOARD
Harga: Rp 850.000
Status: TERSEDIA (Teks Berwarna Hijau)
```

**Hafalan:**

```text
{ javascriptExpression }           → menyematkan nilai atau ekspresi JS dinamis di dalam JSX
style={{ backgroundColor: "blue" }} → penulisan inline styling objek berformat camelCase di JSX
```

---

<a id="bagian-5"></a>

# 5. 🟢 Mengirim & Menerima Data via Props

## Konsep

**Props (Properties)** adalah mekanisme utama untuk mengalirkan data dari **Komponen Induk (*Parent*) ke Komponen Anak (*Child*)** secara satu arah (*One-Way Data Flow*).

Karakteristik Props:
- **Read-Only / Immutable:** Komponen anak **dilarang memodifikasi nilai props** yang diterimanya secara langsung.
- **Destructuring:** Cara paling bersih menerima props adalah mendestrukturisasinya langsung di parameter fungsi.
- **Default Props:** Memberikan nilai cadangan jika prop tidak dikirim oleh parent.
- **`children` Prop:** Properti khusus untuk menangkap seluruh elemen JSX yang disisipkan di antara tag pembuka dan penutup komponen (`<Modal>Isi Konten</Modal>`).

## Contoh

Komponen Anak (Child):
```jsx
// Destructuring Props dengan Default Value & children
export function Badge({ text, color = "blue", children }) {
  return (
    <div style={{ backgroundColor: color, color: "#fff", padding: "8px", borderRadius: "4px" }}>
      <span>{text}</span>
      {children && <div className="badge-details">{children}</div>}
    </div>
  );
}
```

Komponen Induk (Parent):
```jsx
export default function App() {
  return (
    <div>
      {/* Mengirim Props Biasa */}
      <Badge text="Admin" color="crimson" />

      {/* Mengirim Props beserta Children Content */}
      <Badge text="Promo Spesial" color="darkgreen">
        <small>Diskon 50% hingga akhir bulan!</small>
      </Badge>
    </div>
  );
}
```

## Cara Kerja

```text
Parent Component (<Badge text="Admin" color="red" />)
                       │
                       ▼ Props (Data Alir ke Bawah)
Child Component (function Badge({ text, color }))
```

**Hafalan:**

```text
function Child({ propA, propB = defaultValue }) → destructuring props dengan nilai default
children                                        → prop bawaan penampung konten yang diapit di dalam tag komponen
```

---

<a id="bagian-6"></a>

# 6. 🟢 State Management Lokal dengan `useState`

## Konsep

**State** adalah data internal yang dimiliki komponen dan **dapat berubah seiring waktu** (misal: input form, toggle popup, counter). Ketika state diperbarui, **React akan otomatis me-render ulang (*Re-render*) komponen tersebut** agar tampilan UI selalu sinkron dengan data terbaru.

Hook **`useState`**:
- Menerima nilai awal: `const [state, setState] = useState(initialValue)`.
- Mengembalikan array berisi 2 elemen:
  1. `state`: Nilai data saat ini.
  2. `setState`: Fungsi untuk memperbarui nilai state.

Aturan Penting Pembaruan State:
- **Dilarang Mutasi Langsung:** ❌ `count = count + 1` (Tidak memicu re-render!).
- **Gunakan Setter:** ✅ `setCount(count + 1)`.
- **Gunakan Functional Updater jika Bergantung pada State Sebelumnya:** ✅ `setCount(prev => prev + 1)` (Mencegah bug *Stale State Closure* saat pemanggilan berulang).

## Contoh

```jsx
import { useState } from 'react';

export default function CounterApp() {
  const [count, setCount] = useState(0);

  const increment = () => {
    // Functional state update (Aman & Best Practice)
    setCount(prevCount => prevCount + 1);
  };

  const decrement = () => {
    setCount(prevCount => (prevCount > 0 ? prevCount - 1 : 0));
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Nilai Counter: {count}</h2>
      <button onClick={decrement}>- Kurang</button>
      <button onClick={reset} style={{ margin: "0 8px" }}>Reset</button>
      <button onClick={increment}>+ Tambah</button>
    </div>
  );
}
```

**Hafalan:**

```text
const [state, setState] = useState(initialValue); → mendefinisikan variabel state reaktif lokal
setState(prevState => newState)                  → memperbarui state secara aman berbasis nilai sebelumnya
```

---

<a id="bagian-7"></a>

# 7. 🟢 Mengelola State Objek & Array yang Kompleks

## Konsep

Di React, State harus diperlakukan sebagai **Immutable (Tidak Boleh Dimutasi Langsung)**.

1. **State Berupa Objek:**
   - Gunakan **Spread Operator (`...prev`)** untuk menyalin atribut lama sebelum menimpa atribut yang berubah.
2. **State Berupa Array:**
   - **Menambah Elemen:** Gunakan `[...prev, newItem]` (Bukan `prev.push()`).
   - **Menghapus Elemen:** Gunakan `prev.filter(item => item.id !== targetId)` (Bukan `prev.splice()`).
   - **Memperbarui Elemen:** Gunakan `prev.map(item => item.id === targetId ? { ...item, updated } : item)`.

## Contoh

```jsx
import { useState } from 'react';

export default function UserProfileManager() {
  // 1. State Objek
  const [profile, setProfile] = useState({ name: "Budi", role: "Developer", age: 25 });

  // 2. State Array
  const [skills, setSkills] = useState(["JavaScript", "React"]);

  // Update State Objek
  const updateAge = () => {
    setProfile(prev => ({ ...prev, age: prev.age + 1 })); // Salin data lama, timpa age
  };

  // Tambah Elemen Array
  const addSkill = (newSkill) => {
    setSkills(prevSkills => [...prevSkills, newSkill]); // Array baru bebas mutasi
  };

  // Hapus Elemen Array
  const removeSkill = (skillToRemove) => {
    setSkills(prevSkills => prevSkills.filter(s => s !== skillToRemove));
  };

  return (
    <div>
      <h3>Profil: {profile.name} ({profile.role}) - Usia: {profile.age}</h3>
      <button onClick={updateAge}>Tambah Usia</button>

      <h4>Daftar Skills:</h4>
      <ul>
        {skills.map(skill => (
          <li key={skill}>
            {skill} <button onClick={() => removeSkill(skill)}>x</button>
          </li>
        ))}
      </ul>
      <button onClick={() => addSkill("TypeScript")}>+ Tambah TypeScript</button>
    </div>
  );
}
```

**Hafalan:**

```text
setObj(prev => ({ ...prev, updatedKey: val }))        → memperbarui field objek tanpa menghapus field lainnya
setArr(prev => [...prev, newItem])                    → menambah item array tanpa mutasi push
setArr(prev => prev.filter(item => item.id !== id))  → menghapus item array tanpa mutasi splice
```

---

<a id="bagian-8"></a>

# 8. 🟢 Handling Events di React

## Konsep

React membungkus event bawaan browser ke dalam **SyntheticEvent** untuk memastikan perilaku event konsisten di semua jenis browser (*Cross-Browser Consistency*).

Aturan Event di React:
1. Penamaan event menggunakan **camelCase**: `onClick`, `onChange`, `onSubmit`, `onKeyDown`.
2. Anda mengoper **referensi fungsi (*Function Reference*)**, bukan memanggil fungsinya secara langsung:
   - ✅ Benar: `onClick={handleClick}` atau `onClick={() => handleClick(id)}`
   - ❌ Salah: `onClick={handleClick()}` (Fungsi akan langsung tereksekusi saat render, memicu loop tak terbatas!).
3. Mencegah aksi default browser (seperti reload halaman pada submit form): **`e.preventDefault()`**.

## Contoh

```jsx
export default function ActionButtons() {
  const handleDelete = (itemId, event) => {
    event.preventDefault();
    console.log("Menghapus item dengan ID:", itemId);
  };

  return (
    <div>
      {/* Mengoper argumen ke event handler via Arrow Function */}
      <button onClick={(e) => handleDelete(101, e)}>
        Hapus Item #101
      </button>
    </div>
  );
}
```

**Hafalan:**

```text
onClick={(e) => handleAction(param, e)} → pola mengirimkan parameter ke event handler secara aman
e.preventDefault()                      → menghentikan perilaku reload form atau link default browser
```

---

<a id="bagian-9"></a>

# 9. 🟡 Conditional Rendering

## Konsep

Teknik menampilkan elemen UI yang berbeda berdasarkan kondisi tertentu:

1. **Ternary Operator (`cond ? <CompA /> : <CompB />`):** Menampilkan komponen A jika `true`, atau komponen B jika `false` (*If-Else*).
2. **Logical AND (`cond && <Comp />`):** Menampilkan komponen hanya jika kondisi `true`. Jika `false`, tidak me-render apapun (*If Only*).
3. **Early Return:** Mengembalikan JSX lain di awal fungsi komponen (misal: menampilkan `<LoadingSpinner />` saat data belum siap).

## Contoh

```jsx
export default function AuthDashboard({ user, isLoading }) {
  // 1. Early Return saat Loading
  if (isLoading) {
    return <div className="spinner">Memuat data pengguna...</div>;
  }

  // 2. Conditional Rendering di dalam JSX
  return (
    <div className="dashboard">
      {user ? (
        <div>
          <h2>Selamat Datang Kembali, {user.name}!</h2>
          {/* Logical AND: Hanya tampil jika role admin */}
          {user.role === "ADMIN" && <button>Buka Panel Admin</button>}
        </div>
      ) : (
        <div>
          <h2>Silakan Login Terlebih Dahulu</h2>
          <button>Masuk Akun</button>
        </div>
      )}
    </div>
  );
}
```

**Hafalan:**

```text
condition ? <ComponentIfTrue /> : <ComponentIfFalse /> → conditional rendering if-else
condition && <ComponentIfTrue />                       → conditional rendering if-only
```

---

<a id="bagian-10"></a>

# 10. 🟡 Rendering List Data & Aturan Wajib `key` Prop

## Konsep

Untuk me-render kumpulan data array menjadi elemen JSX, kita menggunakan fungsi JavaScript standar **`.map()`**.

Aturan Wajib `key` Prop:
- Setiap elemen JSX yang dihasilkan di dalam `.map()` **WAJIB memiliki atribut `key` dengan nilai unik yang stabil** (biasanya ID database `item.id`).
- Mengapa `key` sangat penting? React menggunakan `key` untuk melacak elemen mana yang ditambah, diubah, atau dihapus saat proses Reconciliation.

> [!WARNING]
> **DILARANG MENGGUNAKAN INDEX ARRAY SEBAGAI `key` (`key={index}`) pada daftar yang elemennya dapat diurutkan, disaring, atau dihapus!** Menggunakan index array dapat menyebabkan bug tampilan form salah input dan penurunan drastis performa diffing.

## Contoh

```jsx
export default function ProductList() {
  const products = [
    { id: "P-01", name: "Monitor 27 Inch", price: 3500000 },
    { id: "P-02", name: "Mouse Wireless", price: 250000 },
    { id: "P-03", name: "Mechanical Keyboard", price: 950000 }
  ];

  return (
    <div className="catalog">
      <h2>Katalog Produk</h2>
      <ul>
        {products.map(product => (
          // Selalu gunakan ID unik sebagai key
          <li key={product.id} style={{ marginBottom: "8px" }}>
            <strong>{product.name}</strong> — Rp {product.price.toLocaleString("id-ID")}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Hafalan:**

```text
array.map(item => <Element key={item.id}>{item.name}</Element>) → me-render daftar array ke elemen JSX ber-key unik
```

---

<a id="bagian-11"></a>

# 11. 🟡 Form Handling: Controlled Components vs Uncontrolled Components

## Konsep

1. **Controlled Components (STANDAR UTAMA REACT):**
   - Nilai input HTML dikendalikan sepenuhnya oleh **React State**.
   - Input memiliki `value={state}` dan `onChange={(e) => setState(e.target.value)}`.
   - Sumber kebenaran tunggal (*Single Source of Truth*) selalu berada di React State.
2. **Uncontrolled Components:**
   - Nilai input disimpan oleh DOM browser sendiri, dan dibaca saat dibutuhkan menggunakan `useRef()`.

## Contoh (Controlled Component)

```jsx
import { useState } from 'react';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    alert(`Mencari data: ${searchTerm}`);
  };

  return (
    <form onSubmit={handleSearchSubmit}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Ketik kata kunci pencarian..."
      />
      <button type="submit">Cari</button>
      <p>Preview Realtime: {searchTerm}</p>
    </form>
  );
}
```

**Hafalan:**

```text
value={state} onChange={(e) => setState(e.target.value)} → pola Controlled Component mengikat input ke state
```

---

<a id="bagian-12"></a>

# 12. 🟡 Menangani Multiple Form Inputs dengan Satu Handler Terpadu

## Konsep

Jika sebuah form registrasi memiliki 10 input field, membuat 10 fungsi `useState` terpisah akan membuat kode sangat panjang dan kotor.

**Pola Multi-Input Terpadu**:
1. Gunakan 1 state objek untuk menampung seluruh data form.
2. Berikan atribut **`name`** pada setiap tag `<input>` yang nilainya sama persis dengan nama property di state.
3. Buat 1 fungsi `handleChange` yang menggunakan sintaks **ES6 Computed Property Names: `[e.target.name]: e.target.value`**.

## Contoh

```jsx
import { useState } from 'react';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "STAFF",
    newsletter: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Jika checkbox gunakan 'checked', jika teks biasa gunakan 'value'
    const inputValue = type === "checkbox" ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: inputValue // Dinamis sesuai atribut name input!
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data Terkirim:", formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", width: "300px" }}>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="STAFF">Staff</option>
        <option value="MANAGER">Manager</option>
      </select>
      <label>
        <input
          type="checkbox"
          name="newsletter"
          checked={formData.newsletter}
          onChange={handleChange}
        /> Langganan Info
      </label>
      <button type="submit">Daftar Sekarang</button>
    </form>
  );
}
```

**Hafalan:**

```text
setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })) → satu handler untuk puluhan input form dinamis
```

---

<a id="bagian-13"></a>

# 13. 🟡 Lifecycle & Side Effects dengan `useEffect`

## Konsep

Komponen React harus murni (*Pure Function*) saat me-render UI. Segala operasi yang berinteraksi dengan dunia luar (seperti memanggil API fetch, mengubah judul dokumen `document.title`, memasang timer, atau membaca localStorage) disebut **Side Effects**.

Hook **`useEffect(callback, dependencyArray)`** mengatur kapan efek tersebut dieksekusi:

| Dependency Array | Kapan Efek Dijalankan? | Contoh Kasus Penggunaan |
|---|---|---|
| **`[dep1, dep2]`** | Dijalankan saat mount awal + setiap kali nilai `dep1` atau `dep2` berubah | Fetch detail data saat `userId` berubah |
| **`[]` (Array Kosong)** | Dijalankan **tepat 1x saat komponen pertama kali dipasang (*Mount*)** | Fetch daftar data awal aplikasi |
| **Tanpa Array** | ⚠️ Dijalankan **pada setiap kali re-render terjadi** | Logging siklus render (Jarang dipakai) |

## Contoh

```jsx
import { useState, useEffect } from 'react';

export default function UserProfile({ userId }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Efek berjalan saat komponen mount DAN setiap kali 'userId' berganti
  useEffect(() => {
    setLoading(true);
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUserData(data);
        setLoading(false);
      });
  }, [userId]); // Dependency Array mengawasi perubahan userId

  if (loading) return <p>Memuat profil user #{userId}...</p>;

  return (
    <div>
      <h3>Nama: {userData?.name}</h3>
      <p>Email: {userData?.email}</p>
    </div>
  );
}
```

**Hafalan:**

```text
useEffect(() => { /* side effect logic */ }, [dependencies]); → sinkronisasi efek samping dengan dependensi data
```

---

<a id="bagian-14"></a>

# 14. 🟡 Cleanup Function pada `useEffect`

## Konsep

Jika efek samping Anda membuat langganan (*subscription*), event listener window, timer `setInterval`, atau request jaringan yang sedang berjalan, Anda **WAJIB mengembalikan sebuah fungsi pembersih (*Cleanup Function*)**.

Kapan Cleanup Function Dieksekusi?
1. Tepat sebelum efek dijalankan kembali pada render berikutnya.
2. Tepat saat komponen **dilepas dari DOM (*Unmount*)**.

Jika tidak dibersihkan, aplikasi akan mengalami **Memory Leak** dan error mencoba mengubah state pada komponen yang sudah mati (*Can't perform a React state update on an unmounted component*).

## Contoh

```jsx
import { useState, useEffect } from 'react';

export default function WindowSizeTracker() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    // 1. Pasang Event Listener saat Mount
    window.addEventListener("resize", handleResize);

    // 2. Wajib Cleanup Function saat Unmount (Mencegah Memory Leak)
    return () => {
      window.removeEventListener("resize", handleResize);
      console.log("Cleanup: Event listener resize berhasil dicopot aman!");
    };
  }, []); // [] = Setup saat mount, Cleanup saat unmount

  return <div>Lebar Layar Browser: {windowWidth}px</div>;
}
```

**Hafalan:**

```text
useEffect(() => { setup(); return () => cleanup(); }, [dep]); → struktur lifecycle setup dan teardown aman di React
```

---

<a id="bagian-15"></a>

# 15. 🟡 Mengakses DOM Langsung & Mutable Reference dengan `useRef`

## Konsep

Hook **`useRef(initialValue)`** mengembalikan objek JavaScript `{ current: initialValue }` yang memiliki 2 fungsi utama:

1. **Mengakses Elemen DOM Nyata:** Mengarahkan referensi ke elemen HTML fisik (misal: memberikan auto-focus ke kotak input teks, memutar video `<video>.play()`, atau scroll otomatis).
2. **Menyimpan Nilai Mutable yang Persisten:** Menyimpan data (seperti ID timer `setInterval`) yang nilainya tetap bertahan antar re-render, **tetapi mengubah `.current` TIDAK memicu re-render UI** (berbeda dengan `useState`).

## Contoh

```jsx
import { useRef, useEffect } from 'react';

export default function AutoFocusInput() {
  // 1. Buat Referensi
  const inputElementRef = useRef(null);
  const clickCountRef = useRef(0); // Nilai mutable tanpa re-render

  useEffect(() => {
    // 2. Fokuskan input secara otomatis saat pertama kali halaman terbuka
    inputElementRef.current.focus();
  }, []);

  const handleSilentLog = () => {
    clickCountRef.current += 1;
    console.log("Tombol diklik tanpa me-render ulang UI:", clickCountRef.current);
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* 3. Tautkan ref ke atribut JSX */}
      <input ref={inputElementRef} type="text" placeholder="Input ini otomatis fokus..." />
      <button onClick={handleSilentLog} style={{ marginLeft: "8px" }}>Klik Silent</button>
    </div>
  );
}
```

**Hafalan:**

```text
const myRef = useRef(initialVal); → membuat referensi mutable yang tidak memicu re-render tampilan saat diubah
<input ref={myRef} />             → menghubungkan referensi langsung ke elemen DOM nyata
```

---

<a id="bagian-16"></a>

# 16. 🟡 Mengangkat State ke Atas (*Lifting State Up*)

## Konsep

Di React, data mengalir satu arah dari atas ke bawah. Dua komponen saudara (*Sibling Components*) tidak dapat berbagi state secara langsung satu sama lain.

Untuk menyinkronkan data antar komponen saudara:
1. **Pindahkan State ke Komponen Induk Bersama (*Common Parent*)**.
2. Kirim nilai State ke komponen anak A via **Props**.
3. Kirim fungsi Updater (`setState`) ke komponen anak B via **Props Callback**.

## Contoh

```jsx
import { useState } from 'react';

// Komponen Anak 1: Input Kotak Teks
function SearchInput({ query, onQueryChange }) {
  return (
    <input 
      type="text" 
      value={query} 
      onChange={(e) => onQueryChange(e.target.value)} 
      placeholder="Ketik filter..." 
    />
  );
}

// Komponen Anak 2: Tampilan Hasil
function SearchResults({ query }) {
  const allItems = ["React", "Vue", "Angular", "Svelte", "Next.js"];
  const filtered = allItems.filter(item => item.toLowerCase().includes(query.toLowerCase()));

  return (
    <ul>
      {filtered.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
}

// Komponen Induk (State Diangkat ke Sini)
export default function FilterableApp() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pencarian Framework</h2>
      <SearchInput query={searchQuery} onQueryChange={setSearchQuery} />
      <SearchResults query={searchQuery} />
    </div>
  );
}
```

## Cara Kerja

```text
                    Parent: FilterableApp
                     [State: searchQuery]
                              │
               ┌──────────────┴──────────────┐
               ▼ (Props Callback: onQueryChange) ▼ (Props Data: query)
          SearchInput                  SearchResults
```

**Hafalan:**

```text
Lifting State Up → memindahkan state ke komponen induk terdekat agar dapat dibagikan ke beberapa komponen anak
```

---

<a id="bagian-17"></a>

# 17. 🔴 Membangun Custom Hooks

## Konsep

Jika Anda memiliki logika stateful yang berulang di beberapa komponen (misal: logika menyimpan data ke `localStorage`, mendeteksi status koneksi internet, atau fetching API), Anda dapat mengekstraknya menjadi **Custom Hook**.

Aturan Pembuatan Custom Hook:
1. Nama fungsi **WAJIB diawali dengan kata `use`** (misal: `useLocalStorage`, `useToggle`, `useFetch`). Aturan ini wajib agar React Linter dapat memverifikasi aturan Hooks.
2. Di dalam Custom Hook, Anda bebas memanggil hook React standar lain (`useState`, `useEffect`, `useRef`).

## Contoh (`useLocalStorage` Custom Hook)

```jsx
import { useState, useEffect } from 'react';

// Custom Hook untuk menyimpan & memuat state ke localStorage otomatis
export function useLocalStorage(key, initialValue) {
  // 1. Baca nilai awal dari localStorage (Lazy Initialization)
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // 2. Simpan ke localStorage setiap kali state berubah
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
```

Penggunaan di Komponen:
```jsx
export default function ThemeToggle() {
  // Menggunakan custom hook layaknya useState biasa!
  const [theme, setTheme] = useLocalStorage("app_theme", "light");

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Tema Saat Ini: {theme.toUpperCase()} (Tersimpan di LocalStorage)
    </button>
  );
}
```

**Hafalan:**

```text
useCustomHookName → fungsi kustom berawalan 'use' untuk mendaur ulang logika stateful antar komponen
```

---

<a id="bagian-18"></a>

# 18. 🔴 React Strict Mode & Cara Kerjanya

## Konsep

Di dalam `main.jsx`, Anda akan melihat komponen dibungkus oleh `<React.StrictMode>`.

Apa Fungsi Strict Mode?
- Membantu developer mendeteksi efek samping yang tidak bersih (*Impure Side Effects*) dan library usang.
- **Di Lingkungan Development:** React sengaja **menjalankan setiap komponen dan `useEffect` sebanyak 2 kali (Double Invocation)** saat mount awal.
- Tujuannya adalah memastikan bahwa **Cleanup Function Anda bekerja 100% sempurna** dan tidak meninggalkan memory leak saat komponen di-remount.
- Pada versi Production build (`npm run build`), perilaku render ganda ini otomatis dinonaktifkan.

**Hafalan:**

```text
<React.StrictMode> → alat bantu development untuk memvalidasi idempotensi komponen dan kebersihan cleanup efek
```

---

<a id="bagian-19"></a>

# 19. 🛠️ Peta Ingatan Cepat

```text
                         PETA ARSITEKTUR REACT DASAR
                                      │
       ┌──────────────────────────────┼──────────────────────────────┐
       ▼                              ▼                              ▼
KOMPONEN & JSX                STATE & IMMUTABILITY           EFFECTS & DOM
├─ Functional Components      ├─ useState (Re-render)        ├─ useEffect (Side Effects)
├─ Props & Children           ├─ Immutability (...spread)    ├─ Cleanup Function (Teardown)
├─ JSX Expressions { }        ├─ Controlled Forms            ├─ useRef (DOM & Mutable ref)
└─ Conditional Rendering      └─ Lifting State Up            └─ Custom Hooks (useXxx)
```

---

<a id="bagian-20"></a>

# 20. 📚 Tabel Ringkasan

| Hook / Konsep | Tipe | Fungsi & Karakteristik Utama |
|---|---|---|
| `useState` | Hook | Menyimpan data reaktif lokal komponen yang memicu re-render saat diubah |
| `useEffect` | Hook | Mengeksekusi efek samping (API, timers, DOM sync) dan cleanup teardown |
| `useRef` | Hook | Menyimpan referensi DOM fisik atau nilai mutable tanpa memicu re-render |
| `Props` | Konsep | Aliran data searah read-only dari parent ke child |
| `children` | Prop | Menampung konten JSX yang disematkan di dalam tag pembuka/penutup komponen |
| `key` | Prop | Pengenal unik stabil wajib untuk setiap elemen di dalam list `.map()` |
| `Controlled Form` | Pola | Mengikat nilai input HTML secara langsung ke React State via `value` & `onChange` |
| `Lifting State Up`| Pola | Mengangkat state ke parent bersama untuk sinkronisasi antar komponen saudara |
| `Custom Hook` | Pola | Fungsi modular berawalan `use` untuk mengekstrak logika stateful yang reusable |

---

<a id="bagian-21"></a>

# 21. ⚡ Cheat Code React Dasar 10 Detik

```jsx
// 1. Template Functional Component dengan Props & State
import { useState, useEffect } from 'react';

export default function MyCard({ title, onAction }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    console.log("Komponen dipasang!");
    return () => console.log("Komponen dilepas!");
  }, []);

  return (
    <div className={`card ${active ? "active" : ""}`}>
      <h3>{title}</h3>
      <button onClick={() => setActive(prev => !prev)}>Toggle</button>
    </div>
  );
}

// 2. Template Multi-Input Controlled Form
const [form, setForm] = useState({ title: "", amount: 0 });
const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
```

---

<a id="bagian-22"></a>

# 22. 🧭 Urutan Belajar yang Disarankan

```text
Langkah 1: Kuasai Mental Model Deklaratif & JSX
├── Pahami perbedaan manipulasi DOM manual vs Virtual DOM
└── Tulis komponen PascalCase dengan aturan JSX (className, Fragment, {})
       │
       ▼
Langkah 2: Kuasai Props & useState Immutability
├── Oper data via props dan tangkap via children
└── Kelola state array & object menggunakan spread operator (...prev)
       │
       ▼
Langkah 3: Kuasai Controlled Forms & List Rendering
├── Render array via .map() dengan key prop unik (ID)
└── Ikat form input ke state dengan pola multi-input terpadu
       │
       ▼
Langkah 4: Kuasai useEffect & Custom Hooks
├── Pahami 3 variasi dependency array dan wajibkan Cleanup Function
├── Akses DOM fisik via useRef
└── Ekstrak logika reusable ke Custom Hooks (useLocalStorage)
       │
       ▼
Langkah 5: Siap Melangkah ke React Router (SPA) & Global State Management (Zustand)!
```

---

<a id="bagian-23"></a>

# 23. 🏗️ Mini Project: Production-Ready Interactive Task & Expense Manager Web App

Aplikasi web interaktif lengkap dan runnable yang mengintegrasikan: **Functional Components, Props, `useState` Immutability (Array & Object), Controlled Forms, `useEffect` dengan LocalStorage Persistence, Custom Hook `useLocalStorage`, Filter Search, dan Summary Statistics**.

```jsx
import React, { useState, useEffect } from 'react';

// ==========================================
// 1. CUSTOM HOOK: useLocalStorage
// ==========================================
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

// ==========================================
// 2. KOMPONEN HEADER & STATS (CHILD COMPONENT)
// ==========================================
function StatsHeader({ expenses }) {
  const totalNominal = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalItem = expenses.length;

  return (
    <header style={{ background: "#2563eb", color: "#fff", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
      <h1 style={{ margin: "0 0 10px 0", fontSize: "24px" }}>💰 Task & Expense Tracker</h1>
      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <small>Total Pengeluaran:</small>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>
            Rp {totalNominal.toLocaleString("id-ID")}
          </div>
        </div>
        <div>
          <small>Jumlah Catatan:</small>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>{totalItem} Transaksi</div>
        </div>
      </div>
    </header>
  );
}

// ==========================================
// 3. KOMPONEN FORM INPUT (CONTROLLED COMPONENT)
// ==========================================
function ExpenseForm({ onAddExpense }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "MAKANAN"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.amount) {
      alert("Mohon isi judul dan nominal pengeluaran!");
      return;
    }

    // Mengoper data baru ke parent
    onAddExpense({
      id: "EXP-" + Date.now(),
      title: formData.title.trim(),
      amount: Number(formData.amount),
      category: formData.category,
      createdAt: new Date().toLocaleDateString("id-ID")
    });

    // Reset Form
    setFormData({ title: "", amount: "", category: "MAKANAN" });
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", marginBottom: "20px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "10px" }}>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Nama Pengeluaran (mis. Makan Siang)"
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
      />
      <input
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        placeholder="Nominal (Rp)"
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
      />
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
      >
        <option value="MAKANAN">Makanan</option>
        <option value="TRANSPORT">Transport</option>
        <option value="TAGIHAN">Tagihan</option>
        <option value="HIBURAN">Hiburan</option>
      </select>
      <button type="submit" style={{ background: "#10b981", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
        + Tambah
      </button>
    </form>
  );
}

// ==========================================
// 4. KOMPONEN DAFTAR LIST (LIST & KEYS)
// ==========================================
function ExpenseList({ expenses, onDeleteExpense }) {
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExpenses = expenses.filter(item => {
    const matchCategory = filterCategory === "ALL" || item.category === filterCategory;
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div>
      {/* Filter Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", gap: "10px" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari pengeluaran..."
          style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", flex: 1 }}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
        >
          <option value="ALL">Semua Kategori</option>
          <option value="MAKANAN">Makanan</option>
          <option value="TRANSPORT">Transport</option>
          <option value="TAGIHAN">Tagihan</option>
          <option value="HIBURAN">Hiburan</option>
        </select>
      </div>

      {/* Render List Elemen */}
      {filteredExpenses.length === 0 ? (
        <p style={{ textAlign: "center", color: "#64748b", padding: "20px" }}>Tidak ada catatan pengeluaran.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {filteredExpenses.map(item => (
            <li
              key={item.id}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderBottom: "1px solid #e2e8f0" }}
            >
              <div>
                <strong>{item.title}</strong>
                <span style={{ marginLeft: "8px", fontSize: "12px", background: "#e2e8f0", padding: "2px 6px", borderRadius: "4px" }}>
                  {item.category}
                </span>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>{item.createdAt}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontWeight: "bold", color: "#ef4444" }}>
                  - Rp {item.amount.toLocaleString("id-ID")}
                </span>
                <button
                  onClick={() => onDeleteExpense(item.id)}
                  style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ==========================================
// 5. MAIN APP COMPONENT (PARENT CONTAINER)
// ==========================================
export default function App() {
  // Menggunakan Custom Hook untuk state persisten di LocalStorage
  const [expenses, setExpenses] = useLocalStorage("user_expenses", [
    { id: "EXP-1", title: "Makan Siang Nasi Padang", amount: 25000, category: "MAKANAN", createdAt: "29/08/2026" },
    { id: "EXP-2", title: "Bensin Motor Pertamax", amount: 50000, category: "TRANSPORT", createdAt: "29/08/2026" }
  ]);

  // Handler Tambah Data (Immutability Pattern)
  const handleAddExpense = (newExpense) => {
    setExpenses(prev => [newExpense, ...prev]);
  };

  // Handler Hapus Data
  const handleDeleteExpense = (idToDelete) => {
    setExpenses(prev => prev.filter(item => item.id !== idToDelete));
  };

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", fontFamily: "Segoe UI, sans-serif", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
      <StatsHeader expenses={expenses} />
      <ExpenseForm onAddExpense={handleAddExpense} />
      <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
    </div>
  );
}
```

## Hasil Output Tampilan Aplikasi

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 💰 Task & Expense Tracker                                              │
│ Total Pengeluaran: Rp 75.000             Jumlah Catatan: 2 Transaksi   │
├────────────────────────────────────────────────────────────────────────┤
│ [ Makan Siang         ] [ 25000     ] [ Makanan  ▼ ] [ + Tambah ]     │
├────────────────────────────────────────────────────────────────────────┤
│ [ Cari pengeluaran...               ] [ Semua Kategori ▼ ]             │
│                                                                        │
│ • Makan Siang Nasi Padang   [MAKANAN]   - Rp 25.000   [ Hapus ]        │
│   29/08/2026                                                           │
│                                                                        │
│ • Bensin Motor Pertamax     [TRANSPORT] - Rp 50.000   [ Hapus ]        │
│   29/08/2026                                                           │
└────────────────────────────────────────────────────────────────────────┘
```

---

<a id="bagian-24"></a>

# 24. 🔗 Referensi Resmi

- [React Official Documentation (react.dev)](https://react.dev/)
- [Vite Official Documentation](https://vitejs.dev/)
- [React Hooks Reference Guide](https://react.dev/reference/react)
- [MDN Web Docs: JavaScript ES6+](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
