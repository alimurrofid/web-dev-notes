# JavaScript DOM Cheatsheet Revised

> **Target:** Pemula yang sudah memahami dasar JavaScript (variabel, fungsi, array, dan object) serta ingin menguasai manipulasi halaman web secara dinamis menggunakan Document Object Model (DOM API).
>
> Fokus cheatsheet ini: **mental model DOM tree → document & node → modern selectors → manipulasi teks, atribut, & style → event handling & bubbling → event delegation → form & table manipulation → performa DocumentFragment → keamanan XSS → mini project**.
>
> **Pola belajar:** setiap konsep dibaca dengan urutan **Konsep → Contoh Modern → Output / Hasil → Cara Kerja (Diagram Alur) → Hafalan (Non-Blockquote) → Best Practice & Kesalahan Umum**.

---

## Cara Belajar

```text
🟢 Fundamental
→ wajib dipahami untuk mencari elemen, mengubah teks, atribut, style, dan penanganan dasar

🟡 Lanjutan
→ pelajari setelah fundamental nyaman: event delegation, form/table handling, template, & window

🔴 Advanced / Operasional
→ penting untuk optimasi performa rendering batching dan keamanan proteksi serangan XSS
```

Mental model interaksi JavaScript terhadap DOM Tree di Browser:

```text
         Dokumen HTML mentah (File .html)
                         │
                         ▼
             Browser Parsing Engine
                         │
                         ▼
        Pohon Objek di Memori (DOM Tree)
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
     Selectors       Mutations         Events
  (querySelector) (append/remove)  (addEventListener)
         │               │               │
         └───────────────┼───────────────┘
                         │
                         ▼
       Tampilan Layar Ter-update Dinamis (Repaint)
```

**Hafalan:**

```text
DOM          → Struktur data pohon objek di browser yang mewakili dokumen HTML
Node         → Entitas dasar dalam pohon DOM (Element, Text, Comment, Document)
Element      → Node khusus yang berbentuk tag HTML (<tag>)
Selector     → Perintah pencarian elemen DOM menggunakan aturan CSS Selector
Event        → Sinyal kejadian interaksi pengguna (klik, ketik, submit, scroll)
```

---

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan DOM & Mental Model Pohon Dokumen](#bagian-1)
2. [Menyiapkan Struktur HTML & File Script](#bagian-2)
3. [Tipe Data DOM (Document, Element, Node, NodeList, Event)](#bagian-3)
4. [Document Object (Pintu Masuk Utama DOM)](#bagian-4)
5. [Node & Hubungan Keluarga Node (Parent, Child, Sibling)](#bagian-5)
6. [Node Type & Node Constants](#bagian-6)
7. [Element vs Node & Membuat Elemen (createElement, append)](#bagian-7)
8. [Text Node & Text Content](#bagian-8)
9. [Selector Modern (querySelector & querySelectorAll)](#bagian-9)
10. [Selector Klasik (getElementById, getElementsByClassName, getElementsByTagName)](#bagian-10)
11. [NodeList vs HTMLCollection (Live vs Static Collection)](#bagian-11)
12. [Modifikasi Teks & Konten (textContent, innerText, innerHTML)](#bagian-12)
13. [Manipulasi Atribut (getAttribute, setAttribute, dataset)](#bagian-13)
14. [NamedNodeMap & Attr Object](#bagian-14)
15. [Manipulasi Style & Class CSS (style, classList)](#bagian-15)

### 🟡 Lanjutan

16. [Event Listener & Handler (addEventListener, removeEventListener)](#bagian-16)
17. [Event Object & Event Flow (Capturing, Bubbling, stopPropagation, preventDefault)](#bagian-17)
18. [Event Delegation (Pola Penanganan Event Skalabel)](#bagian-18)
19. [Window Object (Global Browser Context, innerHeight, scrollY, Dialogs)](#bagian-19)
20. [HTML Element & DOM Lifecycle (DOMContentLoaded vs load)](#bagian-20)
21. [HTML Form Element (Input, Select, Checkbox, Radio, FormData, Validation)](#bagian-21)
22. [HTML Table Element & Dinamis Table Manipulation (insertRow, insertCell)](#bagian-22)
23. [HTML Custom Elements & Template Element (<template>, cloneNode)](#bagian-23)

### 🔴 Advanced / Operasional

24. [DOM Mutation & Fragment Performance (DocumentFragment Batching)](#bagian-24)
25. [DOM Security (Pencegahan XSS / Cross-Site Scripting pada innerHTML)](#bagian-25)

### 🛠️ Referensi & Praktik

26. [Peta Ingatan Cepat](#bagian-26)
27. [Tabel Ringkasan](#bagian-27)
28. [Cheat Code JavaScript DOM 10 Detik](#bagian-28)
29. [Urutan Belajar yang Disarankan](#bagian-29)
30. [Mini Project: Aplikasi Todo List & Data Manager Interaktif (DOM Full-Feature)](#bagian-30)
31. [Referensi Resmi](#bagian-31)

---

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan DOM & Mental Model Pohon Dokumen

## Konsep

**DOM (Document Object Model)** adalah antarmuka pemrograman (*API*) standar yang disediakan oleh browser untuk merepresentasikan dokumen HTML sebagai struktur pohon objek (*Tree Structure*).

Melalui DOM, bahasa pemrograman JavaScript dapat:
- Menemukan (*query*) elemen di halaman web.
- Mengubah teks, atribut HTML, dan styling CSS secara dinamis.
- Menambah atau menghapus elemen (*nodes*) dari dokumen secara real-time.
- Merespons aksi interaksi dari pengguna (*User Events* seperti klik, scroll, ketikan keyboard).

### Mental Model Pohon DOM (DOM Tree):
Ketika browser membaca file HTML, browser tidak sekadar menampilkan teks mentah, melainkan mengonversinya menjadi pohon node bertingkat di memori:

```text
                      Document (Root)
                             │
                             ▼
                    <html> (Root Element)
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
           <head>                        <body>
              │                             │
              ▼                      ┌──────┴──────┐
           <title>                   ▼             ▼
              │                    <h1>           <p>
              ▼                      │             │
        "Belajar DOM"           "Judul Web"   "Paragraf..."
```

## Contoh

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Belajar DOM</title>
</head>
<body>
    <h1 id="main-heading">Teks Asli Sebelum Diubah</h1>
    <button id="btn-change">Ubah Judul</button>

    <script>
        // 1. Menemukan elemen berdasarkan ID
        const heading = document.getElementById("main-heading");
        const button = document.getElementById("btn-change");

        // 2. Memanipulasi teks saat tombol diklik
        button.addEventListener("click", () => {
            heading.textContent = "Teks Berhasil Diubah oleh JavaScript!";
            heading.style.color = "#2563eb";
        });
    </script>
</body>
</html>
```

## Output

Setelah tombol "Ubah Judul" diklik oleh user di browser:
```text
[Tampilan Web]: Teks Berhasil Diubah oleh JavaScript! (Warna Biru)
```

## Cara Kerja

```text
       Browser mem-parsing HTML ──► Membangun DOM Tree di RAM
                                          │
                                          ▼
       JavaScript membaca elemen ──► document.getElementById()
                                          │
                                          ▼
       Mutasi DOM secara real-time ──► Tampilan Browser me-render ulang (Repaint)
```

**Hafalan:**

```text
DOM      → Representasi dokumen HTML dalam bentuk pohon objek JavaScript
Node     → Titik entitas penyusun DOM (Elemen, Teks, Atribut, Komentar)
document → Objek akar (root entry point) untuk mengakses seluruh halaman web
```

## Best Practice & Kesalahan Umum

- ✅ Pahami bahwa DOM adalah Web API browser, bukan bagian dari inti bahasa ECMAScript (Node.js murni tidak memiliki DOM bawaan).
- ❌ Jangan mencoba mengakses elemen DOM sebelum dokumen selesai dimuat (gunakan tag `<script>` di akhir body atau gunakan atribut `defer`).

---

<a id="bagian-2"></a>

# 2. 🟢 Menyiapkan Struktur HTML & File Script

## Konsep

Untuk menghubungkan kode JavaScript dengan dokumen HTML, kita memiliki beberapa strategi penempatan script:

1. **Tag `<script>` di Akhir `<body>` (Tradisional):** Memastikan seluruh elemen HTML telah di-parse oleh browser sebelum script dieksekusi.
2. **Tag `<script src="..." defer>` di dalam `<head>` (Standar Modern / Best Practice):** Browser mengunduh file JavaScript di latar belakang tanpa menghambat rendering HTML, dan baru mengeksekusi script setelah seluruh DOM selesai dibangun.
3. **Tag `<script src="..." async>`:** Mengunduh dan mengeksekusi script secepat mungkin (cocok untuk skrip analitik independen seperti Google Analytics).

## Contoh

**Struktur Proyek Standar Modern:**
```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proyek DOM Modern</title>
    <!-- Best Practice: defer di dalam head -->
    <script src="app.js" defer></script>
</head>
<body>
    <header>
        <h1 id="app-title">Dashboard Aplikasi</h1>
    </header>
    <main>
        <p id="status-text">Memuat status sistem...</p>
    </main>
</body>
</html>
```

File `app.js`:
```javascript
// Script langsung bisa mengakses DOM secara aman karena atribut 'defer'
const appTitle = document.getElementById("app-title");
const statusText = document.getElementById("status-text");

statusText.textContent = "Sistem Online & Siap Digunakan!";
console.log("DOM Berhasil Dimanipulasi dari file app.js eksternal");
```

## Output

Di jendela browser & Console:
```text
[Status]: Sistem Online & Siap Digunakan!
[Console]: DOM Berhasil Dimanipulasi dari file app.js eksternal
```

## Cara Kerja

```text
         Browser membaca <head>
                   │
                   ▼
         Menemukan <script defer> -> Download file di latar belakang
                   │
                   ▼
         Selesaikan parsing HTML (Render Tampilan)
                   │
                   ▼
         Eksekusi app.js (Aman, seluruh elemen sudah ada di memori)
```

**Hafalan:**

```text
<script src="app.js" defer> → Mengunduh JS paralel dan mengeksekusi tepat setelah DOM siap
<script src="app.js" async> → Mengunduh JS paralel dan langsung mengeksekusi seketika
```

## Best Practice & Kesalahan Umum

- ✅ Selalu gunakan `defer` untuk skrip aplikasi utama yang perlu berinteraksi dengan elemen DOM.
- ❌ Jangan meletakkan script tanpa `defer` di dalam `<head>`, karena akan menghentikan parsing HTML dan menyebabkan elemen bernilai `null`.

---

<a id="bagian-3"></a>

# 3. 🟢 Tipe Data DOM (Document, Element, Node, NodeList, Event)

## Konsep

Di dalam DOM, setiap bagian dari halaman web diwakili oleh tipe objek (*Interface*) tertentu yang saling mewarisi hierarki:

### Hierarki Pewarisan Tipe Data DOM:
```text
                 EventTarget (Mewarisi addEventListener)
                       │
                       ▼
                     Node (Akar seluruh tipe node)
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
     Document       Element      CharacterData (Text Node)
                       │
                       ▼
                  HTMLElement (Tag HTML seperti <div>, <button>)
```

Penjelasan Tipe Data Utama:
1. **`Document`:** Merepresentasikan keseluruhan halaman web (`document`).
2. **`Node`:** Tipe dasar untuk setiap titik di pohon DOM (termasuk tag elemen, teks, komentar).
3. **`Element`:** Node yang khusus berupa tag HTML (seperti `<div>`, `<p>`, `<input>`).
4. **`NodeList`:** Kumpulan koleksi node (hasil dari `document.querySelectorAll()`).
5. **`HTMLCollection`:** Kumpulan elemen HTML yang bersifat *live* (hasil dari `getElementsByClassName()`).
6. **`Event`:** Objek yang membawa informasi ketika interaksi terjadi (klik mouse, input keyboard).

## Contoh

```javascript
// Memeriksa tipe data interface objek DOM
const heading = document.createElement("h1");
const textNode = document.createTextNode("Halo Dunia");

console.log("Apakah heading adalah instance of Element?", heading instanceof Element); // true
console.log("Apakah heading adalah instance of Node?", heading instanceof Node);       // true
console.log("Apakah heading adalah instance of EventTarget?", heading instanceof EventTarget); // true

console.log("Apakah textNode adalah Element?", textNode instanceof Element); // false
console.log("Apakah textNode adalah Node?", textNode instanceof Node);       // true
console.log("Apakah document adalah Node?", document instanceof Node);       // true
```

## Output

```text
Apakah heading adalah instance of Element? true
Apakah heading adalah instance of Node? true
Apakah heading adalah instance of EventTarget? true
Apakah textNode adalah Element? false
Apakah textNode adalah Node? true
Apakah document adalah Node? true
```

## Cara Kerja

```text
     HTMLElement ──► Mewarisi Element ──► Mewarisi Node ──► Mewarisi EventTarget
     (Mewarisi semua kemampuan method dari kakek buyutnya)
```

**Hafalan:**

```text
Node        → Satuan terkecil penyusun DOM (Elemen, Teks, Komentar)
Element     → Node khusus yang berbentuk tag HTML (<tag>)
NodeList    → Deret koleksi beberapa Node
HTMLCollection → Deret koleksi beberapa Element HTML aktif
```

## Best Practice & Kesalahan Umum

- ✅ Pahami bahwa semua `Element` adalah `Node`, tetapi tidak semua `Node` adalah `Element` (teks dan spasi enter adalah Node, bukan Element).
- ❌ Jangan tertukar antara `NodeList` dan `HTMLCollection` saat melakukan perulangan (*looping*).

---

<a id="bagian-4"></a>

# 4. 🟢 Document Object (Pintu Masuk Utama DOM)

## Konsep

Objek global **`document`** adalah representasi dari halaman web yang sedang dimuat di browser dan menjadi **pintu masuk utama (*root gateway*)** bagi JavaScript untuk mengakses seluruh node dan elemen di halaman tersebut.

Properti Penting Objek `document`:
- `document.title`: Membaca atau mengubah judul tab browser.
- `document.body`: Mengakses elemen `<body>`.
- `document.head`: Mengakses elemen `<head>`.
- `document.documentElement`: Mengakses elemen akar `<html>`.
- `document.URL`: Mengambil alamat URL halaman saat ini.
- `document.cookie`: Membaca atau menulis cookie browser.

Method Pembuat Node:
- `document.createElement(tagName)`: Membuat tag elemen baru di memori.
- `document.createTextNode(text)`: Membuat node teks baru.
- `document.createDocumentFragment()`: Membuat wadah penampung node sementara yang sangat efisien.

## Contoh

```javascript
// 1. Membaca dan Mengubah Properti Dokumen
console.log("Judul Dokumen Awal:", document.title);
console.log("URL Dokumen:", document.URL);

// Mengubah judul tab browser secara dinamis
document.title = "Notifikasi Baru (1) - Belajar DOM";
console.log("Judul Dokumen Baru:", document.title);

// 2. Mengakses Elemen Kunci Dokumen
console.log("Tag Root:", document.documentElement.nodeName); // "HTML"
console.log("Tag Body:", document.body.nodeName);            // "BODY"

// 3. Mengubah Background Body Langsung via document.body
document.body.style.backgroundColor = "#f8fafc";
document.body.style.fontFamily = "sans-serif";
```

## Output

```text
Judul Dokumen Awal: Proyek DOM Modern
URL Dokumen: http://localhost:3000/index.html
Judul Dokumen Baru: Notifikasi Baru (1) - Belajar DOM
Tag Root: HTML
Tag Body: BODY
```

## Cara Kerja

```text
          window (Browser Context)
             │
             ▼
          document (Halaman Dokumen)
             │
      ┌──────┴──────┐
      ▼             ▼
document.head  document.body
```

**Hafalan:**

```text
document.title                   → Membaca atau mengubah teks judul pada tab browser
document.body                    → Referensi langsung ke tag <body>
document.createElement(tagName)  → Menciptakan elemen HTML baru di memori
```

## Best Practice & Kesalahan Umum

- ✅ Manfaatkan `document.title` untuk memberikan notifikasi visual dinamis pada tab browser pengguna.
- ❌ Jangan mencoba memanipulasi `document.body` sebelum tag `<body>` selesai di-parse oleh browser.

---

<a id="bagian-5"></a>

# 5. 🟢 Node & Hubungan Keluarga Node (Parent, Child, Sibling)

## Konsep

Setiap elemen dan teks di dalam DOM memiliki hubungan kekeluargaan (*Node Relationships*) yang memungkinkan kita menelusuri (*traverse*) pohon DOM ke atas, ke bawah, maupun ke samping.

Dua Cara Navigasi DOM:
1. **Navigasi Berbasis Node (Termasuk Teks & Spasi Enter):**
   - `.parentNode` / `.parentElement`: Node induk ke atas.
   - `.childNodes`: Seluruh node anak (termasuk spasi teks).
   - `.firstChild` & `.lastChild`: Anak pertama & terakhir (bisa berupa spasi).
   - `.nextSibling` & `.previousSibling`: Saudara kandung (bisa berupa teks).

2. **Navigasi Berbasis Element (Hanya Tag HTML - JAUH LEBIH DIREKOMENDASIKAN):**
   - `.children`: Seluruh tag elemen anak saja.
   - `.firstElementChild` & `.lastElementChild`: Tag elemen anak pertama & terakhir.
   - `.nextElementSibling` & `.previousElementSibling`: Tag elemen saudara berikutnya & sebelumnya.

## Contoh

```html
<ul id="menu-list">
    <li>Home</li>
    <li id="active-item">Products</li>
    <li>About</li>
</ul>

<script>
    const activeItem = document.getElementById("active-item");

    // Navigasi Berbasis Element (Aman & Bersih)
    const parentList = activeItem.parentElement;
    const nextItem = activeItem.nextElementSibling;
    const prevItem = activeItem.previousElementSibling;

    console.log("Parent Tag:", parentList.tagName);           // "UL"
    console.log("Item Sebelumnya:", prevItem.textContent);    // "Home"
    console.log("Item Saat Ini:", activeItem.textContent);    // "Products"
    console.log("Item Berikutnya:", nextItem.textContent);    // "About"
    console.log("Total Tag Anak di UL:", parentList.children.length); // 3
</script>
```

## Output

```text
Parent Tag: UL
Item Sebelumnya: Home
Item Saat Ini: Products
Item Berikutnya: About
Total Tag Anak di UL: 3
```

## Cara Kerja

```text
                             parentElement (<ul>)
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
   previousElementSibling     activeItem (<li>)         nextElementSibling
       <li>Home</li>           <li>Products</li>           <li>About</li>
```

**Hafalan:**

```text
node.parentElement          → Mengambil elemen induk satu tingkat ke atas
element.children            → Mengambil seluruh elemen anak (hanya tag HTML)
element.firstElementChild   → Mengambil elemen anak pertama
element.nextElementSibling  → Mengambil elemen saudara kandung berikutnya
```

## Best Practice & Kesalahan Umum

- ✅ Selalu gunakan properti berakhiran `ElementSibling` (`children`, `nextElementSibling`, dll.) untuk menghindari kesalahan membaca spasi enter (*whitespace text node*).
- ❌ Hindari penggunaan `childNodes` atau `nextSibling` jika Anda hanya berniat memanipulasi tag HTML.

---

<a id="bagian-6"></a>

# 6. 🟢 Node Type & Node Constants

## Konsep

Setiap node di dalam pohon DOM memiliki tipe yang dapat diidentifikasi melalui properti numerik **`node.nodeType`**.

Konstanta Tipe Node yang Paling Sering Dijumpai:
- **`Node.ELEMENT_NODE` (Nilai `1`):** Tag elemen HTML biasa (seperti `<div>`, `<p>`, `<span>`).
- **`Node.TEXT_NODE` (Nilai `3`):** Teks sebenarnya yang berada di dalam elemen atau spasi putih antar tag.
- **`Node.COMMENT_NODE` (Nilai `8`):** Baris komentar HTML (`<!-- komentar -->`).
- **`Node.DOCUMENT_NODE` (Nilai `9`):** Objek akar dokumen utama (`document`).

Properti Identifikasi Lainnya:
- `node.nodeName`: Nama tag dalam huruf kapital (misal: `"DIV"`, `"#text"`, `"#comment"`).
- `node.nodeValue`: Isi teks dari text node atau komentar (bernilai `null` pada element node).

## Contoh

```html
<div id="box"><!-- Ini komentar -->Halo DOM</div>

<script>
    const box = document.getElementById("box");

    console.log("=== Memeriksa Tipe Node ===");
    console.log("Box nodeType:", box.nodeType, "(ELEMENT_NODE =", Node.ELEMENT_NODE, ")");
    console.log("Box nodeName:", box.nodeName); // "DIV"

    // Memeriksa anak-anak di dalam box (Komentar & Teks)
    box.childNodes.forEach((childNode, index) => {
        if (childNode.nodeType === Node.COMMENT_NODE) {
            console.log(`Child #${index} adalah KOMENTAR: "${childNode.nodeValue}"`);
        } else if (childNode.nodeType === Node.TEXT_NODE) {
            console.log(`Child #${index} adalah TEXT NODE: "${childNode.nodeValue}"`);
        }
    });
</script>
```

## Output

```text
=== Memeriksa Tipe Node ===
Box nodeType: 1 (ELEMENT_NODE = 1 )
Box nodeName: DIV
Child #0 adalah KOMENTAR: " Ini komentar "
Child #1 adalah TEXT NODE: "Halo DOM"
```

## Cara Kerja

```text
                 Pemeriksaan: node.nodeType
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
      Nilai 1             Nilai 3             Nilai 8
   (ELEMENT_NODE)       (TEXT_NODE)       (COMMENT_NODE)
    Tag <div>, <p>      Konten Teks        <!-- ... -->
```

**Hafalan:**

```text
node.nodeType === Node.ELEMENT_NODE (1) → Memastikan apakah node merupakan tag HTML
node.nodeType === Node.TEXT_NODE (3)    → Memastikan apakah node merupakan teks
node.nodeName                           → Mengembalikan nama tag (DIV, P, #text)
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan konstanta bernama `Node.ELEMENT_NODE` atau `Node.TEXT_NODE` daripada angka *magic number* `1` atau `3` agar kode lebih deskriptif.
- ❌ Jangan mencoba membaca `node.nodeValue` pada Element node karena akan menghasilkan `null` (gunakan `.textContent` untuk Element).

---

<a id="bagian-7"></a>

# 7. 🟢 Element vs Node & Membuat Elemen (createElement, append)

## Konsep

Untuk menambahkan elemen baru ke dalam halaman web secara dinamis, kita melakukan 3 langkah utama:
1. **Membuat Elemen (`document.createElement(tagName)`):** Menciptakan elemen baru di memori browser (belum menempel di halaman).
2. **Mengisi Konten & Atribut:** Mengisi teks, kelas CSS, atau ID pada elemen baru tersebut.
3. **Menempelkan ke DOM Tree:**
   - `parent.append(...nodesOrStrings)`: Menambahkan satu atau lebih elemen/string di posisi paling akhir (ES6 modern).
   - `parent.prepend(...nodesOrStrings)`: Menambahkan di posisi paling depan.
   - `parent.appendChild(node)`: Cara klasik menambahkan 1 node di akhir.
   - `element.remove()`: Menghapus elemen langsung dari DOM.

## Contoh

```html
<div id="card-container">
    <h2>Daftar Pengguna Aktif</h2>
    <ul id="user-list"></ul>
</div>

<script>
    const userList = document.getElementById("user-list");

    function addUserCard(userName, role) {
        // 1. Buat elemen <li> baru di memori
        const listItem = document.createElement("li");
        listItem.className = "user-item";

        // 2. Buat elemen badge <span> untuk role
        const badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = ` [${role}]`;
        badge.style.color = role === "Admin" ? "red" : "green";

        // 3. Isi teks dan gabungkan elemen
        listItem.textContent = userName;
        listItem.append(badge); // Menempelkan badge ke dalam li

        // 4. Tempelkan listItem ke dalam <ul> di halaman
        userList.append(listItem);
    }

    addUserCard("Budi Santoso", "Admin");
    addUserCard("Siti Rahmawati", "User");
    addUserCard("Andi Pratama", "User");
</script>
```

## Output

Tampilan list HTML yang dirender:
```text
Daftar Pengguna Aktif
• Budi Santoso [Admin] (Merah)
• Siti Rahmawati [User] (Hijau)
• Andi Pratama [User] (Hijau)
```

## Cara Kerja

```text
   document.createElement("li") -> Objek <li> ada di Memori RAM
                                            │
                                            ▼
   listItem.append(badge)       -> Rakit struktur elemen
                                            │
                                            ▼
   userList.append(listItem)    -> Tempelkan ke DOM Tree (Muncul di Layar Browser)
```

**Hafalan:**

```text
document.createElement(tagName) → Membuat tag HTML baru di memori
parentElement.append(...items)  → Menempelkan elemen baru di posisi paling akhir
parentElement.prepend(...items) → Menempelkan elemen baru di posisi paling depan
targetElement.remove()          → Menghapus elemen dari dokumen secara permanen
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan method modern `parentElement.append()` karena bisa menerima banyak node sekaligus dan string teks secara langsung.
- ❌ Jangan membuat elemen HTML berulang-ulang menggunakan penggabungan string `innerHTML += ...` di dalam perulangan loop, karena akan me-render ulang seluruh elemen lama dan merusak event listener yang sudah terpasang.

---

<a id="bagian-8"></a>

# 8. 🟢 Text Node & Text Content

## Konsep

Di dalam DOM, teks yang berada di dalam tag HTML sebenarnya dibungkus di dalam sebuah **Text Node** tersendiri.

Dua Cara Mengelola Teks:
1. **`element.textContent` (Sangat Direkomendasikan):**
   - Mengambil atau menetapkan seluruh teks murni di dalam elemen beserta seluruh anak-anaknya.
   - **Aman dari serangan XSS (*Cross-Site Scripting*)**, karena karakter tag HTML (seperti `<b>`, `<script>`) akan dirender sebagai teks biasa, bukan kode aktif.
2. **`document.createTextNode(textString)`:**
   - Membuat node teks secara manual untuk ditempelkan dengan method `.append()`.

## Contoh

```html
<div id="content-box">
    <p id="info-text">Teks Awal</p>
</div>

<script>
    const infoText = document.getElementById("info-text");

    // 1. Membaca teks
    console.log("Teks saat ini:", infoText.textContent);

    // 2. Mengubah teks secara aman dengan textContent
    infoText.textContent = "Teks ini telah diperbarui secara aman!";

    // 3. Keamanan XSS pada textContent (Tag HTML tidak akan dieksekusi)
    const userUntrustedInput = "<script>alert('HACKED!')</script><b>Teks Tebal</b>";
    infoText.textContent = userUntrustedInput;

    console.log("Hasil di DOM (Teks Murni):", infoText.textContent);
</script>
```

## Output

Tampilan teks di browser:
```text
<script>alert('HACKED!')</script><b>Teks Tebal</b>
(Tag tidak dieksekusi sebagai kode HTML/script, melainkan tampil sebagai teks polos yang aman)
```

## Cara Kerja

```text
         infoText.textContent = "<b>Teks</b>"
                         │
                         ▼
         Browser me-render string sebagai teks literal murni
         (Karakter < dan > otomatis di-escape menjadi &lt; dan &gt;)
```

**Hafalan:**

```text
element.textContent = newText → Mengubah isi teks elemen secara aman (100% kebal XSS)
document.createTextNode(text) → Membuat objek Text Node baru di memori
```

## Best Practice & Kesalahan Umum

- ✅ Selalu jadikan `element.textContent` sebagai pilihan default untuk menampilkan teks masukan dari pengguna (*user inputs*).
- ❌ Jangan gunakan `innerHTML` jika Anda hanya ingin mengubah teks biasa tanpa tag HTML.

---

<a id="bagian-9"></a>

# 9. 🟢 Selector Modern (querySelector & querySelectorAll)

## Konsep

Method **`querySelector`** dan **`querySelectorAll`** adalah API selector modern standar (W3C) yang memungkinkan kita mencari elemen DOM menggunakan seluruh kekuatan **CSS Selectors** (tag, class, id, atribut, pseudo-class, kombinator).

1. **`document.querySelector(selectors)`:**
   - Mengembalikan **1 elemen pertama** yang cocok dengan CSS selector.
   - Mengembalikan **`null`** jika tidak ada elemen yang cocok.
2. **`document.querySelectorAll(selectors)`:**
   - Mengembalikan seluruh elemen yang cocok dalam bentuk **`NodeList`** statis (*snapshot*).
   - Mendukung method perulangan langsung `.forEach()`.

## Contoh

```html
<div class="product-card" data-category="tech">
    <h3 class="product-title">Mouse Gaming</h3>
    <span class="price">Rp 250.000</span>
    <button class="btn btn-buy">Beli</button>
</div>
<div class="product-card" data-category="books">
    <h3 class="product-title">Buku JavaScript</h3>
    <span class="price">Rp 120.000</span>
    <button class="btn btn-buy" disabled>Habis</button>
</div>

<script>
    // 1. querySelector (Mengambil satu elemen pertama)
    const firstTitle = document.querySelector(".product-card .product-title");
    console.log("Judul Produk Pertama:", firstTitle.textContent);

    const techCard = document.querySelector('.product-card[data-category="tech"]');
    console.log("Tech Card Ditemukan:", techCard !== null);

    // 2. querySelectorAll (Mengambil semua elemen yang cocok)
    const allBuyButtons = document.querySelectorAll(".product-card button.btn-buy");
    console.log("Total Tombol Beli:", allBuyButtons.length); // 2

    // Iterasi langsung menggunakan .forEach()
    allBuyButtons.forEach((btn, index) => {
        console.log(`Tombol #${index + 1}: ${btn.textContent} (Status Disabled: ${btn.disabled})`);
    });
</script>
```

## Output

```text
Judul Produk Pertama: Mouse Gaming
Tech Card Ditemukan: true
Total Tombol Beli: 2
Tombol #1: Beli (Status Disabled: false)
Tombol #2: Habis (Status Disabled: true)
```

## Cara Kerja

```text
         document.querySelectorAll(".product-card .price")
                                │
                                ▼
         Engine CSS Selector Matching pada DOM Tree
                                │
                                ▼
         Mengembalikan NodeList Statis berisi seluruh elemen cocok
```

**Hafalan:**

```text
document.querySelector(cssSelector)    → Mengambil 1 elemen pertama yang cocok (atau null)
document.querySelectorAll(cssSelector) → Mengambil seluruh elemen yang cocok sebagai NodeList
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan selector spesifik yang jelas (misal: `.form-group > input[type="email"]`).
- ❌ Jangan lupa menambahkan tanda titik `.` untuk class (`.my-class`) dan tanda pagar `#` untuk id (`#my-id`) di dalam querySelector.

---

<a id="bagian-10"></a>

# 10. 🟢 Selector Klasik (getElementById, getElementsByClassName, getElementsByTagName)

## Konsep

Sebelum adanya `querySelector`, JavaScript menyediakan method selector klasik yang mencari elemen secara langsung berdasarkan atribut spesifik.

Method Selector Klasik:
1. **`document.getElementById(idString)`:**
   - Mengambil 1 elemen berdasarkan atribut `id` unik (tanpa tanda `#`).
   - Sangat cepat (*high performance*). Mengembalikan `null` jika tidak ditemukan.
2. **`document.getElementsByClassName(className)`:**
   - Mengambil seluruh elemen berdasarkan nama class (tanpa tanda `.`).
   - Mengembalikan **`HTMLCollection`** yang bersifat **Live** (otomatis ter-update jika DOM berubah).
3. **`document.getElementsByTagName(tagName)`:**
   - Mengambil seluruh elemen berdasarkan nama tag (misal: `"p"`, `"li"`, `"div"`).
   - Mengembalikan **`HTMLCollection`** yang bersifat Live.

## Contoh

```html
<div id="container">
    <p class="text-desc">Paragraf 1</p>
    <p class="text-desc">Paragraf 2</p>
</div>

<script>
    // 1. getElementById (Tanpa tanda '#')
    const mainContainer = document.getElementById("container");
    console.log("Container ID:", mainContainer.id);

    // 2. getElementsByClassName (Tanpa tanda '.')
    const descElements = document.getElementsByClassName("text-desc");
    console.log("Jumlah Elemen Class 'text-desc':", descElements.length); // 2

    // 3. getElementsByTagName
    const allParagraphs = document.getElementsByTagName("p");
    console.log("Total Tag <p>:", allParagraphs.length); // 2

    // Mengonversi HTMLCollection menjadi Array murni agar bisa di-map
    const paragraphTexts = Array.from(allParagraphs).map(p => p.textContent);
    console.log("Array Teks Paragraf:", paragraphTexts);
</script>
```

## Output

```text
Container ID: container
Jumlah Elemen Class 'text-desc': 2
Total Tag <p>: 2
Array Teks Paragraf: [ 'Paragraf 1', 'Paragraf 2' ]
```

## Cara Kerja

```text
         document.getElementById("container")
                         │
                         ▼
         Pencarian langsung pada tabel ID hash map browser (Sangat Cepat)
```

**Hafalan:**

```text
document.getElementById('idName')             → Mengambil elemen via ID tanpa simbol #
document.getElementsByClassName('className')  → Mengambil elemen via Class (HTMLCollection)
document.getElementsByTagName('tagName')      → Mengambil elemen via Tag Name (HTMLCollection)
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan `document.getElementById()` jika Anda mencari satu elemen tunggal dengan ID karena performanya paling cepat.
- ❌ Jangan menyertakan simbol `#` pada `getElementById("header")` atau simbol `.` pada `getElementsByClassName("btn")`.

---

<a id="bagian-11"></a>

# 11. 🟢 NodeList vs HTMLCollection (Live vs Static Collection)

## Konsep

Ketika kita mengambil banyak elemen DOM sekaligus, JavaScript mengembalikan salah satu dari dua jenis koleksi berikut:

1. **`HTMLCollection` (Live Collection):**
   - Dihasilkan oleh: `getElementsByClassName()`, `getElementsByTagName()`, `element.children`.
   - **Bersifat LIVE:** Jika elemen baru ditambahkan atau dihapus dari DOM, `HTMLCollection` akan **otomatis ter-update secara instan** di memori.
   - Tidak memiliki method bawaan `.forEach()` (harus diubah via `Array.from()`).

2. **`NodeList` (Umumnya Static Snapshot):**
   - Dihasilkan oleh: `document.querySelectorAll()`.
   - **Bersifat STATIC:** Menyimpan potret (*snapshot*) elemen saat pemanggilan dilakukan. Jika ada penambahan elemen baru di DOM setelahnya, `NodeList` statis **tidak akan berubah**.
   - Memiliki method perulangan bawaan `.forEach()`.

## Contoh

```html
<ul id="list-demo">
    <li class="item">Item 1</li>
    <li class="item">Item 2</li>
</ul>

<script>
    const listParent = document.getElementById("list-demo");

    // HTMLCollection (LIVE) vs NodeList (STATIC)
    const liveCollection = document.getElementsByClassName("item"); // HTMLCollection
    const staticNodeList = document.querySelectorAll(".item");       // NodeList

    console.log("Panjang Awal Live Collection:", liveCollection.length); // 2
    console.log("Panjang Awal Static NodeList:", staticNodeList.length); // 2

    // Menambahkan elemen baru ke dalam DOM
    const newItem = document.createElement("li");
    newItem.className = "item";
    newItem.textContent = "Item 3 (Baru)";
    listParent.append(newItem);

    console.log("\n=== Setelah Penambahan Elemen Baru di DOM ===");
    console.log("Panjang Live Collection (Otomatis Update!):", liveCollection.length); // 3
    console.log("Panjang Static NodeList (Tetap Snapshot):", staticNodeList.length);   // 2
</script>
```

## Output

```text
Panjang Awal Live Collection: 2
Panjang Awal Static NodeList: 2

=== Setelah Penambahan Elemen Baru di DOM ===
Panjang Live Collection (Otomatis Update!): 3
Panjang Static NodeList (Tetap Snapshot): 2
```

## Cara Kerja

```text
                 Penambahan Elemen Baru ke DOM
                              │
         ┌────────────────────┴────────────────────┐
         ▼                                         ▼
   HTMLCollection (Live)                   NodeList (Static)
   Otomatis bertambah 2 -> 3              Tetap 2 (Snapshot lama)
```

**Hafalan:**

```text
HTMLCollection → Koleksi Live (otomatis tersinkronisasi jika DOM berubah)
NodeList       → Koleksi Static Snapshot (dihasilkan oleh querySelectorAll)
Array.from(collection) → Mengonversi koleksi DOM menjadi Array murni JavaScript
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan `Array.from(collection)` atau spread operator `[...collection]` jika ingin menggunakan method array modern seperti `.map()`, `.filter()`, atau `.reduce()`.
- ❌ Hati-hati saat melakukan perulangan pada *Live HTMLCollection* sambil menghapus elemen di dalamnya, karena panjang koleksi akan menyusut di tengah perulangan dan menyebabkan loncatan indeks (*index skip bug*).

---

<a id="bagian-12"></a>

# 12. 🟢 Modifikasi Teks & Konten (textContent, innerText, innerHTML)

## Konsep

JavaScript menyediakan 3 properti utama untuk membaca dan mengubah isi konten suatu elemen:

1. **`element.textContent` (Direkomendasikan untuk Teks):**
   - Mengambil seluruh teks murni apa adanya (termasuk teks di dalam elemen tersembunyi `display: none`).
   - Sangat cepat dan **kebal terhadap serangan XSS**.
2. **`element.innerText` (Text yang Terlihat):**
   - Mengambil teks yang **hanya terlihat di layar (*rendered text*)**. Teks di dalam elemen `display: none` tidak akan terbaca.
   - Lebih lambat karena memicu kalkulasi ulang tata letak (*reflow*).
3. **`element.innerHTML` (Konten HTML):**
   - Membaca atau menulis struktur tag HTML lengkap di dalam elemen.
   - **Hati-hati:** Berisiko celah keamanan fatal XSS jika digunakan untuk memasukkan data yang belum divalidasi dari pengguna.

## Contoh

```html
<div id="preview-box">
    Halo <span style="display: none;">Admin Rahasia</span> <b>Dunia</b>!
</div>

<script>
    const box = document.getElementById("preview-box");

    // Perbedaan Pembacaan Teks
    console.log("textContent:", box.textContent.trim()); // "Halo Admin Rahasia Dunia!"
    console.log("innerText  :", box.innerText.trim());   // "Halo Dunia!" (Menghormati CSS display:none)
    console.log("innerHTML  :", box.innerHTML.trim());   // 'Halo <span style="display: none;">Admin Rahasia</span> <b>Dunia</b>!'

    // Mengubah isi konten menggunakan innerHTML
    const card = document.createElement("div");
    card.innerHTML = `
        <div class="user-card">
            <h3>Budi Santoso</h3>
            <p>Status: <span class="badge">Aktif</span></p>
        </div>
    `;
    console.log("Struktur Card Baru:", card.innerHTML.trim());
</script>
```

## Output

```text
textContent: Halo Admin Rahasia Dunia!
innerText  : Halo Dunia!
innerHTML  : Halo <span style="display: none;">Admin Rahasia</span> <b>Dunia</b>!
Struktur Card Baru: <div class="user-card">
            <h3>Budi Santoso</h3>
            <p>Status: <span class="badge">Aktif</span></p>
        </div>
```

## Cara Kerja

```text
         box.innerHTML = "<h3>Judul</h3>"
                       │
                       ▼
         Browser Parser menguraikan string teks menjadi Node Elemen <h3>
                       │
                       ▼
         Elemen HTML baru dirender ke halaman
```

**Hafalan:**

```text
element.textContent → Mengambil/mengubah teks murni (cepat & aman XSS)
element.innerText   → Mengambil teks yang tampak di layar (menghormati styling CSS)
element.innerHTML   → Membaca atau merender tag HTML dinamis
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan `textContent` untuk mengisi teks variabel dinamis dari pengguna.
- ❌ Jangan pernah memasukkan input pengguna langsung ke dalam `innerHTML` tanpa proses sanitasi (*Sanitization*).

---

<a id="bagian-13"></a>

# 13. 🟢 Manipulasi Atribut (getAttribute, setAttribute, dataset)

## Konsep

Elemen HTML memiliki **Atribut** (seperti `src`, `href`, `id`, `class`, `title`, `disabled`, dan atribut kustom `data-*`).

Method Manipulasi Atribut:
- `element.getAttribute(name)`: Membaca nilai atribut.
- `element.setAttribute(name, value)`: Menetapkan atau mengubah nilai atribut.
- `element.hasAttribute(name)`: Mengecek apakah atribut tersedia (return boolean).
- `element.removeAttribute(name)`: Menghapus atribut dari elemen.

### Custom Data Attributes (`data-*` & `element.dataset`):
Atribut dengan awalan `data-` dapat dibaca dan dimanipulasi secara mudah dan elegan melalui properti **`element.dataset`** menggunakan format penamaan *camelCase*.

## Contoh

```html
<img id="avatar-img" src="placeholder.png" alt="Avatar Pengguna" data-user-id="101" data-user-role="admin">

<script>
    const avatar = document.getElementById("avatar-img");

    // 1. Manipulasi Atribut Standar
    console.log("Src Awal:", avatar.getAttribute("src")); // "placeholder.png"
    console.log("Alt Awal:", avatar.getAttribute("alt")); // "Avatar Pengguna"

    // Mengubah atribut src
    avatar.setAttribute("src", "profile-budi.jpg");
    avatar.setAttribute("title", "Foto Profil Budi Santoso");

    console.log("Src Baru:", avatar.getAttribute("src"));
    console.log("Apakah punya title?", avatar.hasAttribute("title")); // true

    // 2. Manipulasi Custom Data Attributes via dataset
    console.log("User ID (dataset):", avatar.dataset.userId);       // "101"
    console.log("User Role (dataset):", avatar.dataset.userRole);   // "admin"

    // Mengubah nilai dataset secara langsung
    avatar.dataset.userRole = "super_admin";
    avatar.dataset.lastLogin = "2026-08-29"; // Otomatis menjadi atribut data-last-login

    console.log("Role Baru:", avatar.dataset.userRole);
</script>
```

## Output

```text
Src Awal: placeholder.png
Alt Awal: Avatar Pengguna
Src Baru: profile-budi.jpg
Apakah punya title? true
User ID (dataset): 101
User Role (dataset): admin
Role Baru: super_admin
```

## Cara Kerja

```text
   HTML: data-user-id="101" ──► JS: element.dataset.userId
   (Format kebab-case pada HTML otomatis diubah menjadi camelCase pada dataset JS)
```

**Hafalan:**

```text
element.getAttribute('attrName')         → Membaca nilai string dari atribut
element.setAttribute('attrName', value)  → Menetapkan nilai baru pada atribut
element.removeAttribute('attrName')      → Menghapus atribut dari elemen
element.dataset.customProperty           → Mengakses atribut kustom data-* (camelCase)
```

## Best Practice & Kesalahan Umum

- ✅ Manfaatkan `data-*` attribute dan `element.dataset` untuk menyimpan ID atau metadata backend yang terikat pada elemen UI.
- ❌ Jangan menyimpan data rahasia/sensitif (seperti token otentikasi) di dalam dataset HTML karena dapat diintip oleh siapa saja melalui *Inspect Element*.

---

<a id="bagian-14"></a>

# 14. 🟢 NamedNodeMap & Attr Object

## Konsep

Setiap elemen DOM memiliki properti **`element.attributes`** yang mengembalikan koleksi seluruh atribut elemen tersebut dalam bentuk objek **`NamedNodeMap`**.

Karakteristik:
- Setiap item di dalam `NamedNodeMap` adalah objek bertipe **`Attr`**.
- Objek `Attr` memiliki properti `.name` (nama atribut) dan `.value` (isi atribut).
- Sangat berguna saat kita ingin menginspeksi atau menyalin seluruh atribut dari satu elemen ke elemen lainnya secara dinamis.

## Contoh

```html
<input id="username" type="text" name="user_login" class="form-control" required placeholder="Masukkan Username">

<script>
    const input = document.getElementById("username");

    // Mengakses NamedNodeMap
    const attrMap = input.attributes;
    console.log("Total Atribut:", attrMap.length);

    console.log("\n=== Daftar Seluruh Atribut pada Input ===");
    for (let i = 0; i < attrMap.length; i++) {
        const attr = attrMap[i]; // Objek Attr
        console.log(`Atribut #${i + 1}: ${attr.name} = "${attr.value}"`);
    }

    // Mengakses atribut spesifik berdasarkan nama dari map
    const typeAttr = attrMap.getNamedItem("type");
    console.log("\nType Attribute Value:", typeAttr.value);
</script>
```

## Output

```text
Total Atribut: 6

=== Daftar Seluruh Atribut pada Input ===
Atribut #1: id = "username"
Atribut #2: type = "text"
Atribut #3: name = "user_login"
Atribut #4: class = "form-control"
Atribut #5: required = ""
Atribut #6: placeholder = "Masukkan Username"

Type Attribute Value: text
```

## Cara Kerja

```text
         <input type="text" id="username">
                        │
                        ▼
         input.attributes (NamedNodeMap)
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
   Attr { name: "type",          Attr { name: "id",
          value: "text" }               value: "username" }
```

**Hafalan:**

```text
element.attributes                  → Mengambil seluruh atribut elemen sebagai NamedNodeMap
element.attributes.getNamedItem(n)  → Mengambil objek Attr tertentu berdasarkan nama
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan `element.attributes` saat Anda membangun library utilitas yang perlu menginspeksi atau mengkloning semua atribut elemen secara dinamis.
- ❌ Untuk pembacaan atribut umum harian, tetap prioritaskan method standar `element.getAttribute("name")`.

---

<a id="bagian-15"></a>

# 15. 🟢 Manipulasi Style & Class CSS (style, classList)

## Konsep

JavaScript menyediakan 2 cara utama untuk mengontrol tampilan visual elemen:

1. **Inline Style (`element.style`):**
   - Menetapkan style langsung pada atribut `style="..."`.
   - Menggunakan penamaan properti **camelCase** (misal: `backgroundColor`, `fontSize`, `zIndex`).
2. **Class Manipulation (`element.classList` - SANGAT DIREKOMENDASIKAN):**
   - Memisahkan kode styling (CSS) dari logika interaksi (JS).
   - Method Utama `classList`:
     - `.add(...classNames)`: Menambahkan satu atau lebih class CSS.
     - `.remove(...classNames)`: Menghapus class CSS.
     - `.toggle(className)`: Menambah class jika belum ada, atau menghapusnya jika sudah ada (sangat cocok untuk menu dropdown / dark mode).
     - `.contains(className)`: Mengecek apakah class aktif pada elemen (return boolean).
     - `.replace(oldClass, newClass)`: Mengganti class lama dengan yang baru.

## Contoh

```html
<style>
    .card { padding: 16px; border: 1px solid #ccc; border-radius: 8px; }
    .card-dark { background-color: #1e293b; color: white; border-color: #334155; }
    .card-highlight { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
</style>

<div id="my-card" class="card">
    <h3>Kartu Interaktif</h3>
    <p>Ini adalah konten kartu demo.</p>
</div>
<button id="btn-toggle">Toggle Dark Mode</button>

<script>
    const card = document.getElementById("my-card");
    const btnToggle = document.getElementById("btn-toggle");

    // 1. Manipulasi Inline Style
    card.style.marginTop = "20px";
    card.style.fontSize = "16px";

    // 2. Manipulasi Class CSS via classList
    btnToggle.addEventListener("click", () => {
        // Toggle class 'card-dark'
        card.classList.toggle("card-dark");
        card.classList.toggle("card-highlight");

        const isDark = card.classList.contains("card-dark");
        console.log("Status Dark Mode Aktif?", isDark);
    });
</script>
```

## Output

Setelah tombol diklik:
```text
Status Dark Mode Aktif? true
(Tampilan kartu berubah menjadi latar belakang gelap dan memiliki bayangan shadow)
```

## Cara Kerja

```text
         btnToggle.click
               │
               ▼
         card.classList.toggle("card-dark")
               │
         ┌─────┴─────┐
       [Ada]       [Tidak]
         │           │
         ▼           ▼
       Hapus       Tambah
```

**Hafalan:**

```text
element.style.camelCaseProperty = 'value' → Mengubah inline style CSS secara langsung
element.classList.add('className')        → Menambahkan class CSS baru
element.classList.remove('className')     → Menghapus class CSS
element.classList.toggle('className')     → Menghidup-matikan (toggle) class CSS
element.classList.contains('className')   → Mengecek apakah class sedang aktif (boolean)
```

## Best Practice & Kesalahan Umum

- ✅ Prioritaskan manipulasi class (`element.classList.add/toggle`) daripada mengubah banyak inline style secara manual, agar aturan CSS tetap terpusat di file stylesheet.
- ❌ Jangan menulis `card.style.background-color` (menggunakan tanda minus); selalu gunakan format camelCase seperti `card.style.backgroundColor`.

---

<a id="bagian-16"></a>

# 16. 🟡 Event Listener & Handler (addEventListener, removeEventListener)

## Konsep

**Event** adalah sinyal atau kejadian yang dipicu saat terjadi interaksi pada halaman web (seperti klik mouse, tombol keyboard ditekan, form dikirim, atau halaman selesai dimuat).

### 3 Cara Menangani Event di JavaScript:
1. **Inline HTML Attribute (Jadul / Hindari):** `<button onclick="handleClick()` (mencampur HTML dan JS).
2. **DOM Property Handler (Klasik):** `button.onclick = handleClick` (hanya bisa memasang 1 fungsi handler; handler lama akan tertimpa).
3. **`addEventListener()` (Standar Modern / W3C Best Practice):**
   - Bisa memasang banyak fungsi listener independen pada satu elemen yang sama.
   - Mendukung opsi konfigurasi (*options*) seperti `{ once: true }`, `{ capture: true }`, `{ passive: true }`.
   - Listener dapat dicopot kapan saja menggunakan **`removeEventListener()`**.

## Contoh

```html
<button id="btn-action">Klik Saya</button>
<button id="btn-remove">Matikan Listener</button>

<script>
    const btnAction = document.getElementById("btn-action");
    const btnRemove = document.getElementById("btn-remove");

    // Fungsi Handler Bernama (Named Function)
    function handleButtonClick(event) {
        console.log("Tombol berhasil diklik pada koordinat:", event.clientX, event.clientY);
    }

    // 1. Memasang Event Listener
    btnAction.addEventListener("click", handleButtonClick);

    // 2. Memasang Event Listener Tambahan (Tidak menimpa listener pertama!)
    btnAction.addEventListener("click", () => {
        console.log("[Analitik]: Event klik tercatat ke server log.");
    });

    // 3. Listener Sekali Pakai ({ once: true })
    btnAction.addEventListener("click", () => {
        console.log("Pesan ini hanya muncul 1x seumur hidup!");
    }, { once: true });

    // 4. Mencopot Listener
    btnRemove.addEventListener("click", () => {
        btnAction.removeEventListener("click", handleButtonClick);
        console.log("Listener handleButtonClick berhasil dicopot.");
    });
</script>
```

## Output

Saat tombol diklik pertama kali:
```text
Tombol berhasil diklik pada koordinat: 120 45
[Analitik]: Event klik tercatat ke server log.
Pesan ini hanya muncul 1x seumur hidup!
```

## Cara Kerja

```text
         User Mengklik Tombol (Hardware Event)
                         │
                         ▼
         Browser Dispatching "click" Event ke Button
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
   Jalankan Listener 1             Jalankan Listener 2
 (handleButtonClick)               (Analitik Log)
```

**Hafalan:**

```text
element.addEventListener(type, listener, options)  → Memasang pendengar event modern
element.removeEventListener(type, listener)        → Mencopot pendengar event (wajib named function)
```

## Best Practice & Kesalahan Umum

- ✅ Gunakan fungsi bernama (*named function*) jika listener tersebut nantinya perlu dicopot dengan `removeEventListener()`.
- ❌ Jangan menggunakan fungsi anonim jika berniat mencopotnya dengan `removeEventListener()` (karena referensi memori fungsi anonim tidak sama).

---

<a id="bagian-17"></a>

# 17. 🟡 Event Object & Event Flow (Capturing, Bubbling, stopPropagation, preventDefault)

## Konsep

Setiap kali event dipicu, browser secara otomatis mengirimkan objek **`Event`** sebagai parameter pertama ke fungsi callback listener.

Properti & Method Esensial Objek `Event`:
- `event.target`: Elemen asli terdalam yang memicu event tersebut (*the actual clicked element*).
- `event.currentTarget`: Elemen pemilik yang saat ini sedang menangani listener (`this`).
- `event.preventDefault()`: Membatalkan aksi bawaan browser (misal: mencegah submit form me-reload halaman, mencegah link `<a>` berpindah halaman).
- `event.stopPropagation()`: Menghentikan perambatan event ke elemen induk di atasnya (*stop bubbling*).

### Fase Alur Event (Event Flow):
1. **Capturing Phase:** Event bergerak turun dari `window` menuju elemen target.
2. **Target Phase:** Event sampai dan dieksekusi pada elemen target.
3. **Bubbling Phase (Default):** Event menggelembung naik ke atas dari elemen target menuju `body` dan `window`.

## Contoh

```html
<div id="parent-box" style="padding: 20px; background: #e2e8f0;">
    Parent Box
    <button id="child-btn">Tombol Anak</button>
</div>

<form id="login-form" style="margin-top: 15px;">
    <input type="text" placeholder="Username" required>
    <button type="submit">Login</button>
</form>

<script>
    const parentBox = document.getElementById("parent-box");
    const childBtn = document.getElementById("child-btn");
    const loginForm = document.getElementById("login-form");

    // 1. Contoh Event Bubbling & stopPropagation
    parentBox.addEventListener("click", () => {
        console.log("Parent Box menerima event klik (Bubbling)");
    });

    childBtn.addEventListener("click", (event) => {
        console.log("Tombol Anak diklik!");
        // Hentikan gelembung event agar tidak tembus ke Parent Box
        event.stopPropagation();
    });

    // 2. Contoh preventDefault pada Form Submit
    loginForm.addEventListener("submit", (event) => {
        // Mencegah halaman me-refresh otomatis
        event.preventDefault();
        console.log("Form submit dicegah! Memproses data secara Asynchronous via AJAX/Fetch...");
    });
</script>
```

## Output

Saat Tombol Anak diklik:
```text
Tombol Anak diklik!
(Parent Box TIDAK menerima klik karena stopPropagation aktif)
```

Saat Form Login di-submit:
```text
Form submit dicegah! Memproses data secara Asynchronous via AJAX/Fetch...
```

## Cara Kerja

```text
                       Alur Event Bubbling (Default)
                                  window
                                    ▲
                                    │
                                 <body>
                                    ▲
                                    │
                              <div id="parent">
                                    ▲
                                    │ (stopPropagation memutus alur di sini)
                              <button id="child"> ──► [KLIK USER]
```

**Hafalan:**

```text
event.target            → Elemen paling dasar tempat interaksi user terjadi
event.preventDefault()  → Mencegah perilaku default bawaan browser (misal reload form)
event.stopPropagation() → Menghentikan perambatan event ke elemen parent di atasnya
```

## Best Practice & Kesalahan Umum

- ✅ Selalu panggil `event.preventDefault()` saat menangani submit formulir secara single-page application (SPA).
- ❌ Jangan menggunakan `event.stopPropagation()` secara sembarangan tanpa alasan kuat karena dapat merusak event listener global (seperti analitik atau modal overlay).

---

<a id="bagian-18"></a>

# 18. 🟡 Event Delegation (Pola Penanganan Event Skalabel)

## Konsep

**Event Delegation** adalah pola desain (*design pattern*) penanganan event yang sangat populer di mana kita **hanya memasang 1 event listener pada elemen induk (*parent element*)** untuk menangani seluruh aksi dari anak-anak elemennya (*child elements*), memanfaatkan mekanisme alami **Event Bubbling**.

Keuntungan Event Delegation:
1. **Sangat Hemat Memori:** Daripada memasang 1.000 listener pada 1.000 elemen `<li>`, kita cukup memasang 1 listener saja pada tag `<ul>` induknya.
2. **Dinamis Otomatis:** Elemen anak baru yang ditambahkan ke DOM di masa depan akan **langsung otomatis memiliki fungsi listener** tanpa perlu memasang event handler baru.

Kunci Implementasi:
Menggunakan method **`event.target.closest(selector)`** atau `event.target.matches(selector)`.

## Contoh

```html
<div id="todo-container">
    <button id="btn-add">Tambah Todo Baru</button>
    <ul id="todo-list" style="margin-top: 10px;">
        <li data-id="1">Belajar DOM Dasar <button class="btn-delete">Hapus</button></li>
        <li data-id="2">Membaca Dokumentasi Event <button class="btn-delete">Hapus</button></li>
    </ul>
</div>

<script>
    const todoList = document.getElementById("todo-list");
    const btnAdd = document.getElementById("btn-add");
    let nextId = 3;

    // 1. POLA EVENT DELEGATION (Hanya 1 listener pada parent <ul>)
    todoList.addEventListener("click", (event) => {
        // Cek apakah yang diklik adalah tombol dengan class .btn-delete
        const deleteButton = event.target.closest(".btn-delete");

        if (deleteButton) {
            const listItem = deleteButton.closest("li");
            console.log(`Menghapus item ID: ${listItem.dataset.id} ("${listItem.firstChild.textContent.trim()}")`);
            listItem.remove();
        }
    });

    // 2. Menambah elemen baru secara dinamis
    btnAdd.addEventListener("click", () => {
        const newLi = document.createElement("li");
        newLi.dataset.id = String(nextId);
        newLi.innerHTML = `Tugas Baru #${nextId} <button class="btn-delete">Hapus</button>`;
        todoList.append(newLi);
        nextId++;
    });
</script>
```

## Output

Saat item baru ditambahkan lalu tombol "Hapus" pada item baru tersebut diklik:
```text
Menghapus item ID: 3 ("Tugas Baru #3")
(Elemen baru langsung bisa dihapus tanpa perlu inisialisasi listener baru!)
```

## Cara Kerja

```text
   User klik tombol .btn-delete
                 │
                 ▼
   Event 'click' menggelembung (Bubbling) ke atas hingga sampai ke <ul>
                 │
                 ▼
   Listener pada <ul> mengecek: event.target.closest(".btn-delete")
                 │
                 ▼
   Target Cocok -> Hapus elemen <li> terkait
```

**Hafalan:**

```text
event.target.closest(cssSelector) → Mencari elemen terdekat yang cocok ke arah atas
Event Delegation                  → Pola 1 listener pada parent untuk menangani seluruh anak dinamis
```

## Best Practice & Kesalahan Umum

- ✅ Selalu gunakan pola Event Delegation untuk daftar koleksi dinamis (tabel data, chat list, feed card, keranjang belanja).
- ❌ Hindari menggunakan `event.target.classList.contains()` murni jika tombol memiliki ikon/span di dalamnya; gunakan `event.target.closest()` agar tetap akurat.

---

<a id="bagian-19"></a>

# 19. 🟡 Window Object (Global Browser Context, innerHeight, scrollY, Dialogs)

## Konsep

Objek **`window`** merepresentasikan jendela browser (*Browser Window / Global Execution Context*) tempat dokumen web ditampilkan. Objek `window` adalah objek teratas dalam hierarki JavaScript di browser (seluruh variabel global dan `document` berada di bawah `window`).

Fitur & Properti Utama Objek `window`:
- **Dimensi Jendela:** `window.innerWidth`, `window.innerHeight` (ukuran viewport aktif).
- **Posisi Scroll:** `window.scrollX`, `window.scrollY` (posisi scroll saat ini).
- **Operasi Scroll:** `window.scrollTo({ top: 0, behavior: "smooth" })`.
- **Browser History & Location:** `window.location` (URL dan navigasi), `window.history` (riwayat tab).
- **Storage:** `window.localStorage`, `window.sessionStorage`.
- **Timers:** `window.setTimeout()`, `window.setInterval()`.

## Contoh

```javascript
// 1. Memeriksa Dimensi Jendela Browser (Viewport)
console.log("Lebar Layar Viewport:", window.innerWidth, "px");
console.log("Tinggi Layar Viewport:", window.innerHeight, "px");

// 2. Memantau Event Scroll pada Window
window.addEventListener("scroll", () => {
    const scrolledDistance = window.scrollY;
    console.log("Posisi Scroll Vertikal:", scrolledDistance, "px");

    if (scrolledDistance > 300) {
        // Tampilkan tombol 'Scroll to Top'
    }
});

// 3. Scroll Halus ke Bagian Paling Atas (Scroll to Top)
function smoothScrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// 4. Membaca Informasi Alamat Halaman (Location)
console.log("Origin:", window.location.origin);
console.log("Pathname:", window.location.pathname);
```

## Output

```text
Lebar Layar Viewport: 1920 px
Tinggi Layar Viewport: 960 px
Origin: http://localhost:3000
Pathname: /dashboard
```

## Cara Kerja

```text
         window (Browser Root Context)
            │
            ├──────► document (DOM Tree & HTML)
            ├──────► location (URL & Routing)
            ├──────► localStorage (Penyimpanan Offline)
            └──────► innerWidth / scrollY (Ukuran & Scroll Viewport)
```

**Hafalan:**

```text
window.innerWidth / innerHeight → Mengambil lebar & tinggi area tampilan viewport
window.scrollY                  → Mengambil jarak scroll vertikal dari paling atas
window.scrollTo({ top, behavior: 'smooth' }) → Menggulung halaman dengan animasi halus
```

## Best Practice & Kesalahan Umum

- ✅ Karena `window` adalah scope global, Anda bisa langsung memanggil `scrollY` tanpa menuliskan kata `window.`, namun menulis `window.scrollY` membuat kode lebih eksplisit.
- ❌ Hati-hati saat memasang event listener `window.addEventListener("scroll")`; gunakan teknik *throttling / debounce* jika ada komputasi berat di dalamnya.

---

<a id="bagian-20"></a>

# 20. 🟡 HTML Element & DOM Lifecycle (DOMContentLoaded vs load)

## Konsep

Siklus hidup pemuatan halaman web (*DOM Lifecycle*) memiliki tahapan penting yang perlu dipahami agar script kita berjalan pada waktu yang tepat:

1. **`DOMContentLoaded` Event (Pada Objek `document`):**
   - Dipicu saat browser telah **selesai mem-parsing seluruh struktur HTML dan DOM Tree telah siap di memori**.
   - Terjadi **LEBIH CEPAT** karena tidak perlu menunggu gambar (*images*), stylesheet CSS, atau iframe selesai diunduh.
   - **Waktu paling ideal** untuk menginisialisasi kode JavaScript aplikasi!
2. **`load` Event (Pada Objek `window`):**
   - Dipicu saat **seluruh sumber daya eksternal** (seluruh file gambar, CSS, font, iframe) telah 100% selesai diunduh.
3. **`beforeunload` Event (Pada Objek `window`):**
   - Dipicu saat user hendak menutup tab atau meninggalkan halaman (berguna untuk konfirmasi *"Data formulir Anda belum tersimpan"*).

## Contoh

```javascript
// 1. Inisialisasi Aplikasi Saat DOM Siap (Best Practice)
document.addEventListener("DOMContentLoaded", () => {
    console.log("1. [DOMContentLoaded]: Struktur DOM siap! Tombol & elemen bisa diakses.");
    
    const startButton = document.querySelector("#btn-start");
    if (startButton) {
        startButton.addEventListener("click", () => console.log("Aplikasi Dimulai!"));
    }
});

// 2. Menunggu Seluruh Gambar & Aset Selesai Diunduh
window.addEventListener("load", () => {
    console.log("2. [Window Load]: Seluruh gambar & CSS selesai dimuat 100%. Hilangkan skeleton loader.");
});

// 3. Konfirmasi Sebelum Meninggalkan Halaman
window.addEventListener("beforeunload", (event) => {
    const hasUnsavedChanges = true;
    if (hasUnsavedChanges) {
        event.preventDefault(); // Menampilkan dialog standar browser
    }
});
```

## Output

Urutan log eksekusi di browser:
```text
1. [DOMContentLoaded]: Struktur DOM siap! Tombol & elemen bisa diakses.
2. [Window Load]: Seluruh gambar & CSS selesai dimuat 100%. Hilangkan skeleton loader.
```

## Cara Kerja

```text
       Mulai Unduh HTML
              │
              ▼
       DOM Selesai di-parse ──► Pemicu: DOMContentLoaded (JS Aktif!)
              │
              ▼
       Gambar & CSS Selesai ──► Pemicu: window.load (Halaman 100% Siap)
```

**Hafalan:**

```text
document.addEventListener('DOMContentLoaded', fn) → Waktu terbaik inisialisasi JS saat DOM siap
window.addEventListener('load', fn)               → Waktu ketika semua gambar/CSS selesai dimuat
```

## Best Practice & Kesalahan Umum

- ✅ Bungkus kode inisialisasi DOM di dalam listener `DOMContentLoaded` jika tidak menggunakan atribut `defer` pada tag script.
- ❌ Jangan menunda interaktivitas UI hingga event `window.load` karena user akan merasa aplikasi lambat merespons sementara gambar besar masih diunduh.

---

<a id="bagian-21"></a>

# 21. 🟡 HTML Form Element (Input, Select, Checkbox, Radio, FormData, Validation)

## Konsep

Formulir HTML (`<form>`) adalah komponen interaktif utama untuk mengumpulkan data dari pengguna.

Properti & Event Elemen Form:
- **Event Penting:**
  - `submit`: Dipicu saat form dikirimkan (tekan Enter atau klik tombol submit).
  - `input`: Dipicu secara *real-time* setiap kali karakter teks berubah.
  - `change`: Dipicu saat nilai berubah dan elemen kehilangan fokus (atau pada select/checkbox).
- **Membaca Nilai:**
  - Teks / Number / Select: `inputElement.value`.
  - Checkbox / Radio: `checkboxElement.checked` (mengembalikan boolean `true`/`false`).
- **`FormData` Object:** Objek standar untuk mengekstrak seluruh pasangan nama dan nilai dari sebuah formulir secara otomatis.

## Contoh

```html
<form id="registration-form">
    <div>
        <label>Nama Lengkap:</label>
        <input type="text" name="full_name" id="full-name" required minlength="3">
    </div>
    <div>
        <label>Paket Layanan:</label>
        <select name="plan" id="plan-select">
            <option value="free">Gratis (Free)</option>
            <option value="pro">Profesional (Pro)</option>
        </select>
    </div>
    <div>
        <label>
            <input type="checkbox" name="agree_terms" id="agree-terms"> Setuju Syarat & Ketentuan
        </label>
    </div>
    <button type="submit">Daftar Sekarang</button>
</form>

<script>
    const form = document.getElementById("registration-form");
    const nameInput = document.getElementById("full-name");

    // 1. Realtime Input Validation & Feedback
    nameInput.addEventListener("input", (e) => {
        console.log("Karakter diketik:", e.target.value);
    });

    // 2. Menangani Submit Form & Ekstraksi Data via FormData
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Mencegah reload halaman

        // Ekstraksi data otomatis menggunakan FormData
        const formData = new FormData(form);

        const payload = {
            fullName: formData.get("full_name"),
            plan: formData.get("plan"),
            agreeTerms: formData.get("agree_terms") === "on"
        };

        if (!payload.agreeTerms) {
            alert("Anda wajib menyetujui syarat & ketentuan!");
            return;
        }

        console.log("Payload Form Siap Dikirim ke API:", payload);
        form.reset(); // Mengosongkan form kembali
    });
</script>
```

## Output

Setelah user mengisi form dan menekan tombol "Daftar Sekarang":
```text
Karakter diketik: Budi Santoso
Payload Form Siap Dikirim ke API: { fullName: 'Budi Santoso', plan: 'pro', agreeTerms: true }
```

## Cara Kerja

```text
         User klik tombol Submit
                   │
                   ▼
         form.addEventListener("submit")
                   │
                   ▼
         event.preventDefault() -> Hentikan reload
                   │
                   ▼
         const data = new FormData(form) -> Ekstraksi seluruh nilai
```

**Hafalan:**

```text
input.value             → Membaca isi teks atau angka dari input
checkbox.checked        → Membaca status centang boolean (true / false)
new FormData(form)      → Mengekstrak seluruh data input form secara otomatis
form.reset()            → Mengosongkan kembali seluruh kolom isian formulir
```

## Best Practice & Kesalahan Umum

- ✅ Manfaatkan atribut validasi HTML5 bawaan (`required`, `minlength`, `type="email"`) bersamaan dengan validasi JavaScript kustom.
- ❌ Jangan membaca nilai checkbox menggunakan `.value` (karena `.value` selalu menghasilkan `"on"`); selalu periksa properti `.checked`.

---

<a id="bagian-22"></a>

# 22. 🟡 HTML Table Element & Dinamis Table Manipulation (insertRow, insertCell)

## Konsep

Elemen tabel HTML (`<table>`) memiliki sekumpulan method dan properti khusus (*HTMLTableElement API*) yang dirancang khusus untuk memanipulasi baris dan kolom tabel secara cepat tanpa perlu membuat tag `<tr>` dan `<td>` manual.

Method Khusus Tabel:
- `table.insertRow(index)`: Menyisipkan baris `<tr>` baru pada posisi indeks tertentu (`-1` berarti di posisi paling bawah).
- `row.insertCell(index)`: Menyisipkan sel `<td>` baru pada baris tersebut.
- `table.deleteRow(index)`: Menghapus baris pada indeks tertentu.
- `table.rows`: Koleksi seluruh elemen baris di dalam tabel.

## Contoh

```html
<table id="employee-table" border="1" style="border-collapse: collapse; width: 100%;">
    <thead>
        <tr style="background: #f1f5f9;">
            <th>No</th>
            <th>Nama Karyawan</th>
            <th>Jabatan</th>
            <th>Aksi</th>
        </tr>
    </thead>
    <tbody id="employee-tbody">
        <!-- Baris dinamis akan disisipkan di sini -->
    </tbody>
</table>
<button id="btn-add-row" style="margin-top: 10px;">Tambah Baris</button>

<script>
    const tbody = document.getElementById("employee-tbody");
    const btnAddRow = document.getElementById("btn-add-row");

    let counter = 1;

    function appendEmployeeRow(name, position) {
        // 1. Sisipkan baris <tr> baru di akhir tbody (-1)
        const newRow = tbody.insertRow(-1);

        // 2. Sisipkan 4 kolom <td>
        const cellNo = newRow.insertCell(0);
        const cellName = newRow.insertCell(1);
        const cellPosition = newRow.insertCell(2);
        const cellAction = newRow.insertCell(3);

        // 3. Isi konten kolom
        cellNo.textContent = counter++;
        cellName.textContent = name;
        cellPosition.textContent = position;

        // 4. Buat tombol hapus baris
        const btnDelete = document.createElement("button");
        btnDelete.textContent = "Hapus";
        btnDelete.addEventListener("click", () => {
            newRow.remove(); // Hapus baris ini
        });
        cellAction.append(btnDelete);
    }

    // Inisialisasi data awal
    appendEmployeeRow("Ahmad Dahlan", "Software Engineer");
    appendEmployeeRow("Siti Aminah", "Product Designer");

    btnAddRow.addEventListener("click", () => {
        appendEmployeeRow("Karyawan Baru", "Staff");
    });
</script>
```

## Output

Tampilan tabel HTML yang ter-render:
```text
No  Nama Karyawan    Jabatan             Aksi
1   Ahmad Dahlan     Software Engineer   [Hapus]
2   Siti Aminah      Product Designer    [Hapus]
```

## Cara Kerja

```text
       tbody.insertRow(-1) ──► Menghasilkan <tr> baru di posisi paling bawah
                                      │
                                      ▼
       row.insertCell(0)   ──► Menghasilkan <td> baru di dalam <tr> tersebut
```

**Hafalan:**

```text
table.insertRow(index) → Menyisipkan baris <tr> baru (gunakan -1 untuk append di akhir)
row.insertCell(index)  → Menyisipkan kolom <td> baru di dalam baris
table.deleteRow(index) → Menghapus baris pada indeks tertentu
```

## Best Practice & Kesalahan Umum

- ✅ Sisipkan baris baru ke dalam elemen `<tbody>`, bukan langsung ke tag `<table>` utama, agar struktur semantik tabel tetap valid.
- ❌ Gunakan parameter indeks `-1` pada `insertRow(-1)` untuk memastikan baris selalu disisipkan di posisi paling akhir secara konsisten.

---

<a id="bagian-23"></a>

# 23. 🟡 HTML Custom Elements & Template Element (<template>, cloneNode)

## Konsep

1. **Tag `<template>`:**
   Elemen HTML khusus yang digunakan untuk menyimpan markup kerangka (*blueprint*) yang **tidak dirender dan tidak dieksekusi oleh browser saat halaman dimuat**. Konten di dalamnya hanya menjadi cetak biru yang siap dikloning (*cloned*) kapan pun dibutuhkan.
2. **`node.cloneNode(deep)`:**
   Method untuk menduplikasi suatu node:
   - `cloneNode(true)` (*Deep Clone*): Menyalin elemen beserta seluruh anak-anak dan teks di dalamnya.
   - `cloneNode(false)` (*Shallow Clone*): Hanya menyalin tag luarnya saja tanpa isi.

Pola `<template>` + `cloneNode(true)` adalah cara paling bersih dan berperforma tinggi untuk membuat komponen UI berulang tanpa menulis string HTML mentah di JavaScript.

## Contoh

```html
<!-- Template Blueprint (Tidak tampil di layar) -->
<template id="product-item-template">
    <div class="product-item" style="border: 1px solid #ddd; padding: 10px; margin-bottom: 8px;">
        <h4 class="title">Nama Produk</h4>
        <p class="price">Harga</p>
        <button class="btn-select">Pilih Produk</button>
    </div>
</template>

<div id="product-container">
    <h3>Katalog Produk</h3>
</div>

<script>
    const template = document.getElementById("product-item-template");
    const container = document.getElementById("product-container");

    const productCatalog = [
        { name: "Kopi Arabika 250g", price: "Rp 65.000" },
        { name: "Teh Hijau Organik", price: "Rp 40.000" },
        { name: "Cokelat Bubuk Premium", price: "Rp 55.000" }
    ];

    productCatalog.forEach(prod => {
        // 1. Kloning konten template secara mendalam (Deep Clone)
        const clone = template.content.cloneNode(true);

        // 2. Isi data ke dalam elemen kloning
        clone.querySelector(".title").textContent = prod.name;
        clone.querySelector(".price").textContent = prod.price;

        clone.querySelector(".btn-select").addEventListener("click", () => {
            console.log(`Produk terpilih: ${prod.name}`);
        });

        // 3. Tempelkan klon ke dalam container di layar
        container.append(clone);
    });
</script>
```

## Output

Tampilan komponen yang dirender dari template:
```text
Katalog Produk
┌─────────────────────────────────┐
│ Kopi Arabika 250g               │
│ Rp 65.000                       │
│ [Pilih Produk]                  │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ Teh Hijau Organik               │
│ Rp 40.000                       │
│ [Pilih Produk]                  │
└─────────────────────────────────┘
```

## Cara Kerja

```text
         <template id="..."> (Blueprint Tersembunyi di DOM)
                        │
                        ▼
         template.content.cloneNode(true)
                        │
                        ▼
         Salinan Node Independen (Isi Teks & Pasang Event)
                        │
                        ▼
         container.append(clone) -> Muncul di Tampilan Layar
```

**Hafalan:**

```text
<template> ... </template>             → Tag penampung markup cetak biru yang tidak dirender
template.content.cloneNode(true)       → Menduplikasi isi template secara mendalam (deep copy)
```

## Best Practice & Kesalahan Umum

- ✅ Selalu gunakan properti `template.content.cloneNode(true)` dengan argumen `true` agar seluruh elemen anak di dalam template ikut disalin.
- ❌ Jangan menaruh data sensitif atau id duplikat di dalam template cetak biru tanpa dimodifikasi saat dikloning.

---

<a id="bagian-24"></a>

# 24. 🔴 DOM Mutation & Fragment Performance (DocumentFragment Batching)

## Konsep

Setiap kali JavaScript memanipulasi elemen yang sudah menempel di dokumen nyata (misal memanggil `parent.append(child)` ribuan kali di dalam perulangan), browser dipaksa melakukan kalkulasi ulang posisi dan tata letak (*Reflow / Layout*) serta menggambar ulang tampilan (*Repaint*). Hal ini menyebabkan penurunan performa rendering yang sangat drastis (*Jank / UI Lag*).

### Solusi: `DocumentFragment` Batching
**`DocumentFragment`** adalah objek DOM ringan yang bertindak seperti dokumen mini sementara di memori RAM (*in-memory container*):
- Tidak memiliki elemen induk (*parentless*).
- Kita bisa memasukkan ribuan elemen ke dalam fragment di memori tanpa memicu Reflow sama sekali.
- Saat fragment ditempelkan ke DOM nyata (`parent.append(fragment)`), **hanya anak-anak elemen di dalam fragment yang dipindahkan ke halaman**, sedangkan wadah fragment-nya sendiri lenyap seketika.
- **Hanya memicu 1x Reflow tunggal untuk ribuan elemen!**

## Contoh

```html
<ul id="massive-list"></ul>

<script>
    const massiveList = document.getElementById("massive-list");
    const TOTAL_ITEMS = 5000;

    // 1. CARA LAMBAT & BURUK (Memicu 5000x Reflow di DOM aktif)
    // for (let i = 0; i < TOTAL_ITEMS; i++) {
    //     const li = document.createElement("li");
    //     li.textContent = "Item #" + i;
    //     massiveList.append(li); // Lambat!
    // }

    // 2. CARA CEPAT & BERPERFORMA TINGGI (DocumentFragment Batching)
    console.time("DocumentFragmentBenchmark");

    // Buat wadah fragment di memori
    const fragment = document.createDocumentFragment();

    for (let i = 1; i <= TOTAL_ITEMS; i++) {
        const li = document.createElement("li");
        li.className = "item-row";
        li.textContent = `Data Baris #${i}`;
        
        // Tempelkan ke fragment di memori (Nol Reflow!)
        fragment.append(li);
    }

    // Tempelkan seluruh 5000 elemen ke DOM nyata dalam SATU operasi tunggal!
    massiveList.append(fragment);

    console.timeEnd("DocumentFragmentBenchmark");
    console.log("Total elemen terpasang di DOM:", massiveList.children.length);
</script>
```

## Output

```text
DocumentFragmentBenchmark: 3.420ms
Total elemen terpasang di DOM: 5000
(5.000 elemen berhasil dirender dalam hitungan milidetik secara instan tanpa lag!)
```

## Cara Kerja

```text
         Loop 5000x di Memori: fragment.append(li)
                          │
                          ▼
            DocumentFragment (5000 Elemen Siap)
                          │
                          ▼
         massiveList.append(fragment) (Hanya 1x Reflow!)
                          │
                          ▼
         Seluruh 5000 elemen tampil instan di layar
```

**Hafalan:**

```text
document.createDocumentFragment() → Membuat wadah penampung node di memori tanpa memicu reflow
parentElement.append(fragment)    → Memindahkan seluruh isi fragment ke halaman dalam 1 operasi
```

## Best Practice & Kesalahan Umum

- ✅ Selalu gunakan `DocumentFragment` saat me-render data tabel besar, daftar produk, atau hasil pencarian API.
- ❌ Jangan menempelkan elemen ke DOM nyata satu per satu di dalam perulangan loop.

---

<a id="bagian-25"></a>

# 25. 🔴 DOM Security (Pencegahan XSS / Cross-Site Scripting pada innerHTML)

## Konsep

**Cross-Site Scripting (XSS)** adalah salah satu kerentanan keamanan web paling berbahaya di mana penyerang (*hacker*) berhasil menyisipkan skrip berbahaya ke dalam halaman web yang dilihat oleh pengguna lain.

Pintu Masuk Utama XSS di DOM:
Penggunaan **`element.innerHTML`** yang sembarangan untuk menampilkan data yang berasal dari input pengguna (*untrusted user data*, input form, URL parameter, komentar).

### Contoh Serangan XSS:
Jika kita menulis:
```javascript
box.innerHTML = userInput; // Jika userInput = "<img src=x onerror='stealCookies()'>"
```
Browser akan mengeksekusi method `onerror` pada tag img palsu dan mencuri token sesi pengguna!

### 3 Prinsip Pencegahan XSS di DOM:
1. **Gunakan `textContent`:** Secara otomatis memperlakukan input sebagai teks biasa tanpa mengeksekusi tag.
2. **Sanitasi Data:** Jika memang wajib menggunakan HTML dinamis, gunakan pustaka sanitasi resmi seperti **DOMPurify** (`DOMPurify.sanitize(dirtyHtml)`).
3. **Hindari URL Dinamis Berbahaya pada `href`:** Waspadai skema `javascript:alert(1)`.

## Contoh

```html
<div id="comment-section">
    <h3>Komentar Pengguna</h3>
    <div id="safe-comments"></div>
</div>

<script>
    const safeContainer = document.getElementById("safe-comments");

    // Simulasi input berbahaya dari penyerang
    const maliciousInput = '<img src="invalid-url" onerror="console.error('XSS ATTACK! Cookie Dicuri!')">';

    // 1. CARA SALAH & RENTAN KEBOBOLAN (JANGAN LAKUKAN!)
    // safeContainer.innerHTML = maliciousInput; // Skrip jahat langsung dieksekusi!

    // 2. CARA BENAR: Menggunakan textContent (Aman & Tahan XSS)
    const commentCard = document.createElement("div");
    commentCard.className = "comment-bubble";
    commentCard.textContent = maliciousInput; // 100% AMAN!
    safeContainer.append(commentCard);

    // 3. Sanitasi Manual Karakter Berbahaya jika terpaksa
    function escapeHtml(rawString) {
        return rawString
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    console.log("String Terescape:", escapeHtml(maliciousInput));
</script>
```

## Output

Tampilan di layar:
```text
<img src="invalid-url" onerror="console.error('XSS ATTACK! Cookie Dicuri!')">
(Teks tampil sebagai karakter biasa tanpa ada script berbahaya yang terpicu!)
String Terescape: &lt;img src=&quot;invalid-url&quot; onerror=&quot;console.error(&#039;XSS ATTACK! Cookie Dicuri!&#039;)&quot;&gt;
```

## Cara Kerja

```text
         Input Jahat: <img src=x onerror=...>
                        │
                        ▼
         element.textContent = input
                        │
                        ▼
         Browser mengubah < dan > menjadi entitas teks aman
                        │
                        ▼
         Serangan XSS 100% GAGAL & TANGKAS
```

**Hafalan:**

```text
textContent > innerHTML → Aturan emas keamanan DOM: gunakan textContent untuk data dari luar
Sanitize Before Render  → Bersihkan string HTML menggunakan DOMPurify jika wajib memakai innerHTML
```

## Best Practice & Kesalahan Umum

- ✅ Jadikan `element.textContent` sebagai standar utama penulisan konten.
- ❌ Jangan pernah merender input dari user atau URL query string langsung ke dalam `innerHTML` tanpa sanitasi ketat.

---

<a id="bagian-26"></a>

# 26. 🛠️ Peta Ingatan Cepat

## Mental Model Pohon Navigasi & Alur Manipulasi DOM

```text
                      ┌───────────────────────────────┐
                      │      DOM Tree Navigation      │
                      └───────────────┬───────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        ▼                             ▼                             ▼
   Pencarian Elemen              Manipulasi Node              Event & Interaksi
   - querySelector(css)          - createElement('tag')       - addEventListener(type)
   - querySelectorAll(css)       - parent.append(child)       - event.target.closest()
   - getElementById('id')        - element.remove()           - event.preventDefault()
   - parentElement / children    - DocumentFragment           - event.stopPropagation()
        │                             │                             │
        └─────────────────────────────┼─────────────────────────────┘
                                      │
                                      ▼
                           Konten, Atribut & Style
                        - textContent (Aman XSS)
                        - classList.add / toggle
                        - element.dataset.customProp
                        - setAttribute / getAttribute
                        - template.content.cloneNode()
```

## Pola Keputusan Manipulasi DOM

```text
                                Kebutuhan Manipulasi DOM
                                           │
                   ┌───────────────────────┴───────────────────────┐
                   ▼                                               ▼
            Mencari Elemen?                                Merender Konten?
                   │                                               │
         ┌─────────┴─────────┐                           ┌─────────┴─────────┐
         ▼                   ▼                           ▼                   ▼
    1 Elemen Saja?     Banyak Elemen?               Hanya Teks?         Struktur HTML?
         │                   │                           │                   │
         ▼                   ▼                           ▼                   ▼
   querySelector       querySelectorAll             textContent          <template> /
   / getElementById    (NodeList)                                       createElement
```

---

<a id="bagian-27"></a>

# 27. 📚 Tabel Ringkasan

| Kategori | API / Method | Contoh Kode | Penjelasan & Kegunaan |
|---|---|---|---|
| **Selector** | `querySelector` | `document.querySelector('.card')` | Mengambil 1 elemen pertama yang cocok CSS selector |
| **Selector** | `querySelectorAll` | `document.querySelectorAll('li')` | Mengambil seluruh elemen cocok sebagai NodeList |
| **Selector** | `getElementById` | `document.getElementById('app')` | Mengambil 1 elemen berdasarkan ID (sangat cepat) |
| **Penciptaan** | `createElement` | `document.createElement('div')` | Membuat tag elemen HTML baru di memori |
| **Penciptaan** | `cloneNode` | `template.content.cloneNode(true)` | Menduplikasi cetak biru template secara mendalam |
| **Penempatan** | `append` | `parent.append(el1, el2)` | Menempelkan elemen di posisi akhir anak |
| **Penempatan** | `prepend` | `parent.prepend(el)` | Menempelkan elemen di posisi awal anak |
| **Penghapusan** | `remove` | `element.remove()` | Menghapus elemen dari dokumen secara langsung |
| **Konten** | `textContent` | `el.textContent = 'Halo';` | Mengubah teks murni secara aman (kebal XSS) |
| **Konten** | `innerHTML` | `el.innerHTML = '<b>Bold</b>';` | Membaca / merender tag HTML dinamis |
| **Atribut** | `setAttribute` | `el.setAttribute('src', 'img.png')` | Menetapkan nilai atribut HTML |
| **Atribut** | `dataset` | `el.dataset.userId = '101';` | Membaca / menulis atribut kustom `data-*` |
| **Styling** | `classList.toggle` | `el.classList.toggle('active')` | Menghidup-matikan class CSS secara dinamis |
| **Styling** | `classList.add` | `el.classList.add('dark', 'p-4')` | Menambahkan class CSS |
| **Event** | `addEventListener` | `el.addEventListener('click', fn)` | Memasang pendengar aksi interaksi pengguna |
| **Event** | `preventDefault` | `event.preventDefault()` | Mencegah aksi bawaan browser (misal reload form) |
| **Event** | `closest` | `event.target.closest('.item')` | Mencari elemen induk terdekat (Event Delegation) |
| **Performa** | `Fragment` | `document.createDocumentFragment()` | Wadah batching di memori untuk mencegah reflow |

---

<a id="bagian-28"></a>

# 28. ⚡ Cheat Code JavaScript DOM 10 Detik

## 1. Seleksi & Event Listener Ringkas
```javascript
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

$("#btn-submit").addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Input:", $("#username").value);
});
```

## 2. Dynamic Element Creation & Append
```javascript
function createBadge(text, colorClass = "bg-blue") {
    const span = document.createElement("span");
    span.className = `badge ${colorClass}`;
    span.textContent = text;
    return span;
}
$("#container").append(createBadge("Aktif"));
```

## 3. Event Delegation Pola Standar
```javascript
$("#item-list").addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-remove");
    if (btn) btn.closest("li").remove();
});
```

## 4. Toggle Class & Dataset
```javascript
$("#theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const userId = $("#user-card").dataset.userId;
});
```

---

<a id="bagian-29"></a>

# 29. 🧭 Urutan Belajar yang Disarankan

Untuk menguasai manipulasi DOM dari tingkat dasar hingga membangun aplikasi web interaktif berperforma tinggi, ikuti 4 fase berikut:

```text
                   FASE 1: Fondasi Pohon Dokumen & Selector (Minggu 1)
       ┌─────────────────────────────────────────────────────────────┐
       │ 1. Mental model DOM Tree, document, element, & node         │
       │ 2. Selector modern: querySelector & querySelectorAll        │
       │ 3. Membaca & mengubah teks aman: textContent & innerText    │
       │ 4. Navigasi keluarga: parentElement, children, nextSibling  │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
                   FASE 2: Mutasi Elemen, Atribut & Style (Minggu 2)
       ┌─────────────────────────────────────────────────────────────┐
       │ 5. Membuat & menempel elemen: createElement, append, remove │
       │ 6. Mengelola atribut & custom data-*: dataset               │
       │ 7. Mengontrol tampilan visual: classList (add/toggle)       │
       │ 8. Template blueprint: <template> & cloneNode(true)         │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
                   FASE 3: Event Interaksi & Form Management (Minggu 3)
       ┌─────────────────────────────────────────────────────────────┐
       │ 9. addEventListener & Event Object (target, currentTarget)  │
       │ 10. Event Flow (Bubbling vs Capturing) & preventDefault     │
       │ 11. Pola Event Delegation menggunakan closest()             │
       │ 12. Form handling: submit event, FormData, form validation  │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
                                      ▼
                   FASE 4: Performa, Keamanan & Proyek (Minggu 4)
       ┌─────────────────────────────────────────────────────────────┐
       │ 13. Optimasi DOM Batching via DocumentFragment              │
       │ 14. Keamanan DOM: Pencegahan celah XSS pada innerHTML       │
       │ 15. Tabel Dinamis & DOM Lifecycle (DOMContentLoaded)        │
       │ 16. Mengerjakan Mini Project Aplikasi Todo Interaktif       │
       └─────────────────────────────────────────────────────────────┘
```

---

<a id="bagian-30"></a>

# 30. 🏗️ Mini Project: Aplikasi Todo List & Data Manager Interaktif (DOM Full-Feature)

## Konsep Project

Project ini menyatukan seluruh fitur dan teknik manipulasi DOM modern ke dalam sebuah aplikasi manajemen tugas (*Todo List App*) yang lengkap dan interaktif:
- **Selector & Event Listener:** `querySelector` dan event `submit`.
- **Event Delegation:** Menangani tombol centang selesai (*complete*) dan tombol hapus (*delete*) melalui satu listener pada elemen induk `<ul>`.
- **ClassList & Styling:** Toggle class `completed` secara dinamis.
- **Form Handling & Validation:** Validasi input, `event.preventDefault()`, dan `form.reset()`.
- **DOM Creation & Text Security:** `document.createElement` dan `textContent` untuk mencegah XSS.
- **DocumentFragment & Empty State:** Manajemen antarmuka dinamis saat daftar tugas kosong atau terisi.

## Kode Lengkap

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mini Project: Todo Manager DOM</title>
    <style>
        body { font-family: sans-serif; background: #f8fafc; padding: 30px; display: flex; justify-content: center; }
        .todo-app { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); width: 100%; max-width: 450px; }
        .form-row { display: flex; gap: 8px; margin-bottom: 16px; }
        input[type="text"] { flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; }
        button { padding: 10px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
        .btn-add { background: #2563eb; color: white; }
        .todo-list { list-style: none; padding: 0; margin: 0; }
        .todo-item { display: flex; align-items: center; justify-content: space-between; padding: 12px; border-bottom: 1px solid #f1f5f9; }
        .todo-item.completed .todo-text { text-decoration: line-through; color: #94a3b8; }
        .todo-actions { display: flex; gap: 6px; }
        .btn-toggle { background: #10b981; color: white; font-size: 12px; }
        .btn-delete { background: #ef4444; color: white; font-size: 12px; }
        .empty-state { text-align: center; color: #94a3b8; padding: 20px; font-style: italic; }
        .stats-bar { margin-top: 16px; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px; display: flex; justify-content: space-between; }
    </style>
</head>
<body>

<div class="todo-app">
    <h2>Daftar Tugas Harian</h2>

    <form id="todo-form" class="form-row">
        <input type="text" id="todo-input" placeholder="Tulis tugas baru..." required>
        <button type="submit" class="btn-add">Tambah</button>
    </form>

    <ul id="todo-list" class="todo-list">
        <li class="empty-state">Belum ada tugas. Tambahkan tugas pertama Anda!</li>
    </ul>

    <div class="stats-bar">
        <span>Total: <b id="total-count">0</b></span>
        <span>Selesai: <b id="completed-count">0</b></span>
    </div>
</div>

<script>
    // Inisialisasi Selector DOM
    const todoForm = document.querySelector("#todo-form");
    const todoInput = document.querySelector("#todo-input");
    const todoList = document.querySelector("#todo-list");
    const totalCountEl = document.querySelector("#total-count");
    const completedCountEl = document.querySelector("#completed-count");

    let todos = [];

    // Fungsi Update Statistik
    function updateStats() {
        const total = todos.length;
        const completed = todos.filter(t => t.isCompleted).length;

        totalCountEl.textContent = String(total);
        completedCountEl.textContent = String(completed);

        // Tampilkan empty state jika kosong
        if (total === 0) {
            todoList.innerHTML = '<li class="empty-state">Belum ada tugas. Tambahkan tugas pertama Anda!</li>';
        }
    }

    // Fungsi Render Elemen Todo ke DOM
    function renderTodoItem(todo) {
        // Hapus empty state jika ada
        const emptyState = todoList.querySelector(".empty-state");
        if (emptyState) emptyState.remove();

        const li = document.createElement("li");
        li.className = "todo-item";
        li.dataset.id = String(todo.id);

        const spanText = document.createElement("span");
        spanText.className = "todo-text";
        spanText.textContent = todo.text; // Aman dari XSS!

        const actionsDiv = document.createElement("div");
        actionsDiv.className = "todo-actions";

        const btnToggle = document.createElement("button");
        btnToggle.className = "btn-toggle";
        btnToggle.textContent = "Selesai";

        const btnDelete = document.createElement("button");
        btnDelete.className = "btn-delete";
        btnDelete.textContent = "Hapus";

        actionsDiv.append(btnToggle, btnDelete);
        li.append(spanText, actionsDiv);
        todoList.append(li);
    }

    // 1. Event Submit Form (Tambah Tugas)
    todoForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Mencegah reload halaman

        const taskText = todoInput.value.trim();
        if (!taskText) return;

        const newTodo = {
            id: Date.now(),
            text: taskText,
            isCompleted: false
        };

        todos.push(newTodo);
        renderTodoItem(newTodo);
        updateStats();

        todoForm.reset();
        todoInput.focus();
    });

    // 2. POLA EVENT DELEGATION pada Parent <ul>
    todoList.addEventListener("click", (event) => {
        const toggleBtn = event.target.closest(".btn-toggle");
        const deleteBtn = event.target.closest(".btn-delete");

        if (toggleBtn) {
            const listItem = toggleBtn.closest(".todo-item");
            const todoId = Number(listItem.dataset.id);
            const todo = todos.find(t => t.id === todoId);

            if (todo) {
                todo.isCompleted = !todo.isCompleted;
                listItem.classList.toggle("completed");
                toggleBtn.textContent = todo.isCompleted ? "Batal" : "Selesai";
                updateStats();
            }
        }

        if (deleteBtn) {
            const listItem = deleteBtn.closest(".todo-item");
            const todoId = Number(listItem.dataset.id);

            todos = todos.filter(t => t.id !== todoId);
            listItem.remove();
            updateStats();
        }
    });
</script>

</body>
</html>
```

## Output

Tampilan Interaktif di Browser:
```text
┌────────────────────────────────────────────────────────┐
│ Daftar Tugas Harian                                    │
│ [ Belajar DOM Modern... ] [ Tambah ]                   │
│                                                        │
│ • Belajar DOM Modern                  [Selesai] [Hapus]│
│ • Membaca Panduan Event Delegation    [Batal]   [Hapus]│
│                                                        │
│ Total: 2 | Selesai: 1                                  │
└────────────────────────────────────────────────────────┘
```

## Cara Kerja

```text
     Submit Form ──► todos.push() ──► renderTodoItem() (createElement + append)
                                                │
                                                ▼
     Klik Tombol pada <ul> ──► Event Delegation (.btn-toggle / .btn-delete)
                                                │
                                                ▼
     classList.toggle("completed") ──► updateStats() re-render counter
```

**Hafalan:**

```text
Todo App Architecture → Gabungan Form Submit + createElement + Event Delegation + classList
```

---

<a id="bagian-31"></a>

# 31. 🔗 Referensi Resmi

Untuk memperdalam dokumentasi standar dan spesifikasi resmi Document Object Model:

- [MDN Web Docs — Introduction to the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)
- [MDN Web Docs — Document Interface](https://developer.mozilla.org/en-US/docs/Web/API/Document)
- [MDN Web Docs — Element Interface](https://developer.mozilla.org/en-US/docs/Web/API/Element)
- [MDN Web Docs — EventTarget & Events](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)
- [WHATWG DOM Living Standard (Spesifikasi Resmi Dunia)](https://dom.spec.whatwg.org/)

> **Catatan Versi:** Cheatsheet ini disusun mengacu pada spesifikasi **WHATWG DOM Living Standard** dan didukung penuh oleh seluruh peramban web modern (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
