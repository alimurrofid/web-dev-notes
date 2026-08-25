# JavaScript DOM Cheatsheet — Mudah Dipahami & Diingat

> **Target:** JavaScript DOM dasar sampai menengah.
>
> Pola pembahasan: **materi → konsep → syntax → contoh → output → hafalan**.
>
> Catatan: DOM adalah API yang disediakan environment browser untuk merepresentasikan dokumen HTML sebagai struktur node/object yang dapat dibaca dan dimanipulasi menggunakan JavaScript.

## Daftar Isi

1. [Pengenalan DOM](#1-pengenalan-dom)
2. [Membuat Project](#2-membuat-project)
3. [Tipe Data](#3-tipe-data)
4. [Document](#4-document)
5. [Node](#5-node)
6. [Element](#6-element)
7. [NodeList](#7-nodelist)
8. [Attr](#8-attr)
9. [NamedNodeMap](#9-namednodemap)
10. [Text Node](#10-text-node)
11. [Event Handler](#11-event-handler)
12. [Event](#12-event)
13. [Style](#13-style)
14. [Inner Text dan Inner HTML](#14-inner-text-dan-inner-html)
15. [Window](#15-window)
16. [Query Selector](#16-query-selector)
17. [Node Type](#17-node-type)
18. [HTML Element](#18-html-element)
19. [HTML Form Element](#19-html-form-element)
20. [HTML Table Element](#20-html-table-element)
21. [HTML Element Lainnya](#21-html-element-lainnya)
22. [Mini Project](#22-mini-project)
23. [Tabel Ringkasan](#23-tabel-ringkasan)
24. [Cheat Code DOM 10 Detik](#24-cheat-code-dom-10-detik)
25. [Referensi Resmi](#25-referensi-resmi)

---

# 1. Pengenalan DOM

**DOM (Document Object Model)** adalah representasi dokumen HTML dalam bentuk object/node yang dapat diakses dan dimanipulasi menggunakan JavaScript.

Contoh HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Belajar DOM</title>
</head>
<body>
    <h1 id="title">Hello</h1>
</body>
</html>
```

Browser membuat struktur seperti:

```text
Document
│
└── html
    ├── head
    │   └── title
    │       └── "Belajar DOM"
    │
    └── body
        └── h1
            └── "Hello"
```

JavaScript dapat mengubah struktur tersebut:

```javascript
const title = document.getElementById("title");

title.textContent = "Hello JavaScript!";
```

Hasil di browser:

```text
Hello JavaScript!
```

**Hafalan:**

```text
HTML
 ↓
Browser
 ↓
DOM Tree
 ↓
JavaScript
 ↓
Manipulasi DOM
```

DOM memungkinkan kita:

```text
mencari element
mengubah teks
mengubah HTML
mengubah attribute
mengubah CSS
membuat element
menghapus element
menangani event
```

---

# 2. Membuat Project

Struktur project sederhana:

```text
belajar-dom/
├── index.html
└── script.js
```

## `index.html`

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Belajar DOM</title>
</head>
<body>

    <h1 id="title">Belajar DOM</h1>

    <button id="button">
        Klik Saya
    </button>

    <script src="script.js"></script>
</body>
</html>
```

## `script.js`

```javascript
const title =
    document.getElementById("title");

const button =
    document.getElementById("button");

button.addEventListener("click", () => {
    title.textContent =
        "Hello JavaScript DOM!";
});
```

Ketika tombol diklik:

```text
Belajar DOM
     ↓
klik tombol
     ↓
Hello JavaScript DOM!
```

## Cara menjalankan

Buka:

```text
index.html
```

di browser.

Untuk project yang lebih nyaman, gunakan local development server.

**Hafalan:**

```html
<script src="script.js"></script>
```

JavaScript dijalankan setelah elemen tersedia jika script diletakkan sebelum `</body>`.

Alternatif:

```html
<script src="script.js" defer></script>
```

`defer` membuat script dieksekusi setelah HTML selesai diparse.

---

# 3. Tipe Data

DOM menggunakan object dan tipe data JavaScript biasa.

Contoh:

```javascript
const title =
    document.getElementById("title");

console.log(typeof title);
```

Output:

```text
object
```

Beberapa nilai DOM:

```javascript
console.log(typeof document);
console.log(typeof document.body);
console.log(typeof document.title);
```

Umumnya:

```text
object
object
string
```

## Value dari input

```html
<input id="name" value="Budi">
```

```javascript
const input =
    document.getElementById("name");

console.log(input.value);
console.log(typeof input.value);
```

Output:

```text
Budi
string
```

Angka dari input tetap berupa string:

```javascript
input.value = "100";

console.log(typeof input.value);
```

Output:

```text
string
```

Jika membutuhkan Number:

```javascript
const number =
    Number(input.value);

console.log(number);
```

**Hafalan:**

```text
DOM Element → object
input.value → biasanya string
```

---

# 4. Document

`document` adalah object utama yang merepresentasikan dokumen HTML saat ini.

Contoh:

```javascript
console.log(document);
```

## Title

```javascript
console.log(document.title);
```

Mengubah title:

```javascript
document.title =
    "Belajar JavaScript DOM";
```

## Body

```javascript
console.log(document.body);
```

## Head

```javascript
console.log(document.head);
```

## URL

```javascript
console.log(document.URL);
```

## Domain

```javascript
console.log(document.domain);
```

> `document.domain` adalah API lama/deprecated dalam banyak penggunaan modern. Jangan jadikan pilihan utama untuk komunikasi antar-origin.

## Mencari element

```javascript
document.getElementById("title");
```

```javascript
document.getElementsByClassName("item");
```

```javascript
document.getElementsByTagName("p");
```

```javascript
document.querySelector(".item");
```

```javascript
document.querySelectorAll(".item");
```

**Hafalan:**

```text
document
├── title
├── head
├── body
├── URL
├── getElementById()
├── querySelector()
└── querySelectorAll()
```

---

# 5. Node

`Node` adalah konsep dasar DOM. Banyak object DOM merupakan turunan dari `Node`.

Contoh:

```html
<div id="container">
    Hello
</div>
```

JavaScript:

```javascript
const container =
    document.getElementById("container");

console.log(container instanceof Node);
```

Output:

```text
true
```

Jenis node:

```text
Document
Element
Text
Comment
DocumentFragment
dan lainnya
```

Contoh:

```javascript
console.log(document instanceof Node);
console.log(document.body instanceof Node);
```

Output:

```text
true
true
```

## Parent dan child

```javascript
const body = document.body;

console.log(body.parentNode);
console.log(body.childNodes);
```

Hubungan:

```text
parent
  │
  ├── child
  ├── child
  └── child
```

## `parentNode`

```javascript
const title =
    document.getElementById("title");

console.log(title.parentNode);
```

## `childNodes`

```javascript
console.log(
    document.body.childNodes
);
```

Perhatikan bahwa `childNodes` dapat berisi **text node whitespace**.

## `firstChild`

```javascript
console.log(
    document.body.firstChild
);
```

## `lastChild`

```javascript
console.log(
    document.body.lastChild
);
```

**Hafalan:**

```text
Node
├── parentNode
├── childNodes
├── firstChild
└── lastChild
```

---

# 6. Element

`Element` adalah node yang merepresentasikan elemen HTML/XML.

Contoh:

```html
<h1 id="title">Hello</h1>
```

```javascript
const title =
    document.getElementById("title");

console.log(title instanceof Element);
```

Output:

```text
true
```

## `tagName`

```javascript
console.log(title.tagName);
```

Output:

```text
H1
```

## `id`

```javascript
console.log(title.id);
```

## `className`

```javascript
console.log(title.className);
```

## `classList`

```javascript
title.classList.add("active");

title.classList.remove("hidden");

console.log(
    title.classList.contains("active")
);
```

Output:

```text
true
```

## Attribute

```javascript
title.setAttribute(
    "data-id",
    "10"
);

console.log(
    title.getAttribute("data-id")
);
```

Output:

```text
10
```

## `children`

Berbeda dengan `childNodes`, `children` hanya berisi **element children**.

```javascript
console.log(
    document.body.children
);
```

**Perbedaan penting:**

```text
childNodes
→ semua jenis Node

children
→ hanya Element
```

---

# 7. NodeList

`NodeList` adalah kumpulan node yang dikembalikan oleh beberapa API DOM.

Contoh:

```html
<p class="item">A</p>
<p class="item">B</p>
<p class="item">C</p>
```

```javascript
const items =
    document.querySelectorAll(".item");

console.log(items);
console.log(items.length);
```

Output:

```text
NodeList(3)
3
```

## Akses index

```javascript
console.log(items[0]);
console.log(items[1]);
```

## `forEach()`

```javascript
items.forEach(item => {
    console.log(item.textContent);
});
```

Output:

```text
A
B
C
```

## NodeList bukan Array

```javascript
console.log(
    Array.isArray(items)
);
```

Output:

```text
false
```

Tetapi bisa diubah menjadi Array:

```javascript
const array =
    Array.from(items);

console.log(
    Array.isArray(array)
);
```

Output:

```text
true
```

**Hafalan:**

```text
querySelectorAll()
→ NodeList
```

---

# 8. Attr

`Attr` adalah object yang merepresentasikan attribute pada element.

Contoh:

```html
<input id="name" type="text">
```

```javascript
const input =
    document.getElementById("name");

const attr =
    input.getAttributeNode("type");

console.log(attr);
```

Beberapa property:

```javascript
console.log(attr.name);
console.log(attr.value);
```

Output:

```text
type
text
```

## Membuat Attr

```javascript
const dataId =
    document.createAttribute("data-id");

dataId.value = "123";

input.setAttributeNode(dataId);
```

Sekarang:

```html
<input id="name" type="text" data-id="123">
```

Dalam penggunaan sehari-hari, API yang lebih sederhana biasanya:

```javascript
input.setAttribute(
    "data-id",
    "123"
);
```

**Hafalan:**

```text
Attr
→ representasi satu attribute
```

---

# 9. NamedNodeMap

`NamedNodeMap` adalah kumpulan `Attr` yang dimiliki sebuah element.

Contoh:

```html
<input
    id="name"
    class="form-control"
    type="text"
>
```

```javascript
const input =
    document.getElementById("name");

console.log(input.attributes);
```

`attributes` menghasilkan:

```text
NamedNodeMap
```

## `length`

```javascript
console.log(
    input.attributes.length
);
```

## Akses index

```javascript
const attr =
    input.attributes[0];

console.log(attr.name);
console.log(attr.value);
```

## Iterasi

```javascript
for (const attr of input.attributes) {
    console.log(
        attr.name,
        attr.value
    );
}
```

Output kira-kira:

```text
id name
class form-control
type text
```

**Hafalan:**

```text
Element
  ↓
attributes
  ↓
NamedNodeMap
  ↓
Attr
```

---

# 10. Text Node

Text node adalah node yang menyimpan teks di dalam DOM.

Contoh:

```html
<h1>Hello</h1>
```

Strukturnya:

```text
H1 Element
   │
   └── Text Node
       "Hello"
```

JavaScript:

```javascript
const title =
    document.querySelector("h1");

console.log(
    title.firstChild.nodeType
);
```

Output:

```text
3
```

`3` berarti `TEXT_NODE`.

## `createTextNode()`

```javascript
const text =
    document.createTextNode(
        "Hello JavaScript"
    );

document.body.appendChild(text);
```

## `textContent`

Cara yang lebih umum:

```javascript
title.textContent =
    "Hello JavaScript";
```

**Hafalan:**

```text
Text Node
→ node yang berisi teks

Node.TEXT_NODE
→ 3
```

---

# 11. Event Handler

Event handler digunakan untuk menjalankan kode ketika sesuatu terjadi.

Contoh HTML:

```html
<button id="button">
    Klik
</button>
```

## `onclick`

```javascript
const button =
    document.getElementById("button");

button.onclick = function () {
    console.log("Button diklik");
};
```

## `addEventListener()`

Cara yang umumnya lebih fleksibel:

```javascript
button.addEventListener(
    "click",
    function () {
        console.log("Button diklik");
    }
);
```

Dengan arrow function:

```javascript
button.addEventListener(
    "click",
    () => {
        console.log("Button diklik");
    }
);
```

## Event listener dengan function bernama

```javascript
function handleClick() {
    console.log("Klik");
}

button.addEventListener(
    "click",
    handleClick
);
```

Menghapus listener:

```javascript
button.removeEventListener(
    "click",
    handleClick
);
```

> Untuk `removeEventListener()`, function yang diberikan harus merupakan referensi function yang sama.

**Hafalan:**

```text
addEventListener()
→ pasang event

removeEventListener()
→ lepas event
```

---

# 12. Event

`Event` adalah object yang berisi informasi tentang kejadian yang terjadi.

Contoh:

```javascript
button.addEventListener(
    "click",
    event => {
        console.log(event);
    }
);
```

## `target`

```javascript
button.addEventListener(
    "click",
    event => {
        console.log(event.target);
    }
);
```

`target` adalah element yang memicu event.

## `currentTarget`

```javascript
button.addEventListener(
    "click",
    event => {
        console.log(event.currentTarget);
    }
);
```

`currentTarget` adalah element tempat listener sedang dijalankan.

## `preventDefault()`

Contoh form:

```javascript
form.addEventListener(
    "submit",
    event => {
        event.preventDefault();

        console.log(
            "Form tidak melakukan submit default"
        );
    }
);
```

## `stopPropagation()`

```javascript
button.addEventListener(
    "click",
    event => {
        event.stopPropagation();
    }
);
```

Digunakan untuk menghentikan propagasi event.

## Event bubbling

```text
button
  ↑
div
  ↑
body
  ↑
document
```

Event biasanya melakukan bubbling dari target menuju ancestor.

## Event delegation

Daripada memasang listener pada banyak child:

```javascript
list.addEventListener(
    "click",
    event => {
        if (
            event.target.matches(".item")
        ) {
            console.log(
                event.target.textContent
            );
        }
    }
);
```

**Hafalan:**

```text
target
→ siapa yang memicu

currentTarget
→ tempat listener

preventDefault()
→ batalkan default action

stopPropagation()
→ hentikan propagasi
```

---

# 13. Style

JavaScript dapat mengubah CSS element melalui `style`.

Contoh:

```html
<h1 id="title">
    Hello
</h1>
```

```javascript
const title =
    document.getElementById("title");

title.style.color = "red";
title.style.fontSize = "30px";
title.style.backgroundColor = "yellow";
```

Perhatikan CSS:

```css
background-color
```

menjadi:

```javascript
backgroundColor
```

## `style.cssText`

```javascript
title.style.cssText = `
    color: red;
    font-size: 30px;
`;
```

## `classList`

Untuk perubahan style yang lebih terstruktur, sering lebih baik menggunakan class:

```css
.active {
    color: red;
    font-size: 30px;
}
```

```javascript
title.classList.add("active");
```

**Hafalan:**

```text
style.property
→ ubah inline style

classList
→ kelola class CSS
```

---

# 14. Inner Text dan Inner HTML

## `textContent`

Mengambil atau mengubah teks.

```html
<div id="content">
    Hello
</div>
```

```javascript
const content =
    document.getElementById("content");

console.log(content.textContent);
```

Mengubah:

```javascript
content.textContent =
    "<strong>Hello</strong>";
```

Yang tampil:

```text
<strong>Hello</strong>
```

HTML tidak diproses.

## `innerText`

```javascript
console.log(content.innerText);
```

`innerText` lebih berhubungan dengan teks yang terlihat/rendered dan dapat dipengaruhi CSS/layout.

## `innerHTML`

```javascript
content.innerHTML =
    "<strong>Hello</strong>";
```

Browser akan membuat:

```html
<strong>Hello</strong>
```

Hasil tampilan:

```text
Hello
```

## Perbedaan

```text
textContent
→ teks mentah dalam node

innerText
→ teks yang direpresentasikan sebagai rendered/visible text

innerHTML
→ HTML di dalam element
```

## Keamanan

Hindari:

```javascript
element.innerHTML = userInput;
```

jika `userInput` tidak dipercaya.

Untuk teks dari user:

```javascript
element.textContent = userInput;
```

lebih aman karena string diperlakukan sebagai teks, bukan HTML.

**Hafalan:**

```text
textContent → teks
innerText   → teks terlihat/rendered
innerHTML   → HTML
```

---

# 15. Window

`window` adalah global object utama pada browser.

Contoh:

```javascript
console.log(window);
```

Banyak API browser tersedia melalui `window`.

## `window.document`

```javascript
console.log(
    window.document === document
);
```

Output:

```text
true
```

## `alert()`

```javascript
window.alert("Hello");
```

Bisa ditulis:

```javascript
alert("Hello");
```

## `confirm()`

```javascript
const result =
    window.confirm("Lanjut?");

console.log(result);
```

## `prompt()`

```javascript
const name =
    window.prompt("Nama?");

console.log(name);
```

## `setTimeout()`

```javascript
window.setTimeout(() => {
    console.log("Selesai");
}, 1000);
```

Biasanya cukup:

```javascript
setTimeout(() => {
    console.log("Selesai");
}, 1000);
```

## `location`

```javascript
console.log(
    window.location.href
);
```

## `history`

```javascript
console.log(
    window.history
);
```

**Hafalan:**

```text
window
├── document
├── alert()
├── confirm()
├── prompt()
├── location
├── history
└── setTimeout()
```

---

# 16. Query Selector

Query selector adalah cara modern untuk mencari element menggunakan CSS selector.

## `querySelector()`

Mengambil **element pertama** yang cocok.

HTML:

```html
<p class="item">A</p>
<p class="item">B</p>
```

JavaScript:

```javascript
const item =
    document.querySelector(".item");

console.log(item.textContent);
```

Output:

```text
A
```

## `querySelectorAll()`

Mengambil semua element yang cocok.

```javascript
const items =
    document.querySelectorAll(".item");

console.log(items.length);
```

Output:

```text
2
```

## Selector ID

```javascript
document.querySelector("#title");
```

## Selector class

```javascript
document.querySelector(".item");
```

## Selector tag

```javascript
document.querySelector("p");
```

## Selector attribute

```javascript
document.querySelector(
    "input[type='email']"
);
```

## Selector descendant

```javascript
document.querySelector(
    ".container .item"
);
```

## Selector child

```javascript
document.querySelector(
    ".container > .item"
);
```

## Selector multiple

```javascript
document.querySelector(
    "h1, h2, h3"
);
```

**Hafalan:**

```text
querySelector()
→ pertama

querySelectorAll()
→ semua
```

---

# 17. Node Type

Setiap node memiliki `nodeType`.

Contoh:

```javascript
console.log(
    document.nodeType
);
```

Output:

```text
9
```

Jenis penting:

| Constant | Nilai | Keterangan |
|---|---:|---|
| `Node.ELEMENT_NODE` | `1` | Element |
| `Node.ATTRIBUTE_NODE` | `2` | Attr |
| `Node.TEXT_NODE` | `3` | Text |
| `Node.CDATA_SECTION_NODE` | `4` | CDATA |
| `Node.PROCESSING_INSTRUCTION_NODE` | `7` | Processing instruction |
| `Node.COMMENT_NODE` | `8` | Comment |
| `Node.DOCUMENT_NODE` | `9` | Document |
| `Node.DOCUMENT_TYPE_NODE` | `10` | DocumentType |
| `Node.DOCUMENT_FRAGMENT_NODE` | `11` | DocumentFragment |

Contoh:

```javascript
const title =
    document.querySelector("h1");

console.log(
    title.nodeType
);
```

Output:

```text
1
```

Lebih mudah:

```javascript
console.log(
    title.nodeType === Node.ELEMENT_NODE
);
```

Output:

```text
true
```

**Hafalan:**

```text
1  → Element
3  → Text
8  → Comment
9  → Document
11 → DocumentFragment
```

---

# 18. HTML Element

HTML element memiliki banyak API khusus.

Contoh:

```html
<div id="box">
    Hello
</div>
```

```javascript
const box =
    document.getElementById("box");
```

## `id`

```javascript
box.id = "new-box";
```

## `className`

```javascript
box.className =
    "container active";
```

## `classList`

```javascript
box.classList.add("visible");
box.classList.remove("hidden");

box.classList.toggle("active");

console.log(
    box.classList.contains("visible")
);
```

## `dataset`

HTML:

```html
<div
    id="product"
    data-id="100"
    data-category="book"
>
    Buku
</div>
```

JavaScript:

```javascript
const product =
    document.getElementById("product");

console.log(product.dataset.id);
console.log(product.dataset.category);
```

Output:

```text
100
book
```

Menambah:

```javascript
product.dataset.price = "50000";
```

Menjadi:

```html
data-price="50000"
```

## Attribute

```javascript
product.setAttribute(
    "title",
    "Produk Buku"
);

console.log(
    product.getAttribute("title")
);
```

## `removeAttribute()`

```javascript
product.removeAttribute("title");
```

## `hasAttribute()`

```javascript
console.log(
    product.hasAttribute("data-id")
);
```

## `matches()`

```javascript
console.log(
    product.matches("#product")
);
```

## `closest()`

Mencari ancestor terdekat yang cocok.

```javascript
const item =
    document.querySelector(".item");

const container =
    item.closest(".container");
```

**Hafalan:**

```text
classList → class
dataset   → data-*
setAttribute/getAttribute
matches   → cocok dengan selector
closest   → ancestor terdekat
```

---

# 19. HTML Form Element

DOM menyediakan API khusus untuk form.

HTML:

```html
<form id="register">
    <input
        id="name"
        name="name"
        type="text"
    >

    <input
        id="email"
        name="email"
        type="email"
    >

    <button type="submit">
        Daftar
    </button>
</form>
```

## Mengambil form

```javascript
const form =
    document.getElementById("register");
```

## Mengambil input

```javascript
const name =
    document.getElementById("name");

console.log(name.value);
```

## `form.elements`

```javascript
console.log(form.elements);
```

Mengakses berdasarkan name:

```javascript
console.log(
    form.elements.name
);
```

## Submit event

```javascript
form.addEventListener(
    "submit",
    event => {
        event.preventDefault();

        console.log(
            name.value
        );
    }
);
```

## Validasi

HTML:

```html
<input
    id="email"
    type="email"
    required
>
```

JavaScript:

```javascript
const email =
    document.getElementById("email");

console.log(
    email.validity.valid
);
```

## `checkValidity()`

```javascript
console.log(
    form.checkValidity()
);
```

## `reportValidity()`

```javascript
form.reportValidity();
```

## Checkbox

```html
<input
    id="agree"
    type="checkbox"
>
```

```javascript
const agree =
    document.getElementById("agree");

console.log(agree.checked);
```

Mengubah:

```javascript
agree.checked = true;
```

## Select

```html
<select id="country">
    <option value="id">
        Indonesia
    </option>
    <option value="my">
        Malaysia
    </option>
</select>
```

```javascript
const country =
    document.getElementById("country");

console.log(country.value);
console.log(
    country.selectedOptions[0].textContent
);
```

## FormData

Cara praktis mengambil data form:

```javascript
form.addEventListener(
    "submit",
    event => {
        event.preventDefault();

        const data =
            new FormData(form);

        console.log(
            data.get("name")
        );

        console.log(
            data.get("email")
        );
    }
);
```

**Hafalan:**

```text
input.value
checkbox.checked
form.elements
form.submit event
FormData(form)
checkValidity()
```

---

# 20. HTML Table Element

DOM menyediakan API khusus untuk table.

HTML:

```html
<table id="users">
    <thead>
        <tr>
            <th>Nama</th>
            <th>Umur</th>
        </tr>
    </thead>

    <tbody>
        <tr>
            <td>Budi</td>
            <td>20</td>
        </tr>
    </tbody>
</table>
```

## Mengambil table

```javascript
const table =
    document.getElementById("users");
```

## `rows`

```javascript
console.log(
    table.rows.length
);
```

`table.rows` berisi row dari table, termasuk row dalam `thead`, `tbody`, dan `tfoot`.

## `tHead`

```javascript
console.log(
    table.tHead
);
```

## `tBodies`

```javascript
console.log(
    table.tBodies
);
```

## `tFoot`

```javascript
console.log(
    table.tFoot
);
```

## `insertRow()`

```javascript
const row =
    table.tBodies[0].insertRow();

const cell1 =
    row.insertCell();

const cell2 =
    row.insertCell();

cell1.textContent = "Andi";
cell2.textContent = "25";
```

Hasil:

```text
Nama   Umur
Budi   20
Andi   25
```

## Mengakses cell

```javascript
const firstRow =
    table.tBodies[0].rows[0];

console.log(
    firstRow.cells[0].textContent
);
```

Output:

```text
Budi
```

**Hafalan:**

```text
table.rows
table.tHead
table.tBodies
table.tFoot

row.cells
row.insertCell()

table body.insertRow()
```

---

# 21. HTML Element Lainnya

Bagian ini berisi beberapa element HTML yang sering digunakan dalam JavaScript DOM.

## Heading

```javascript
const title =
    document.querySelector("h1");

title.textContent =
    "Judul Baru";
```

## Image

HTML:

```html
<img id="photo" src="old.jpg" alt="Foto">
```

JavaScript:

```javascript
const photo =
    document.getElementById("photo");

photo.src = "new.jpg";
photo.alt = "Foto Baru";
```

## Link

```html
<a id="link" href="#">
    Website
</a>
```

```javascript
const link =
    document.getElementById("link");

link.href =
    "https://example.com";

link.target = "_blank";
```

## Button

```javascript
const button =
    document.querySelector("button");

button.disabled = true;
```

Mengaktifkan:

```javascript
button.disabled = false;
```

## Checkbox

```javascript
const checkbox =
    document.querySelector(
        "input[type='checkbox']"
    );

checkbox.checked = true;
```

## Radio

```html
<input
    type="radio"
    name="gender"
    value="male"
    id="male"
>
```

```javascript
const radio =
    document.getElementById("male");

console.log(radio.checked);
```

## Select

```javascript
const select =
    document.querySelector("select");

console.log(select.value);
```

## Option

```javascript
const option =
    select.options[0];

console.log(option.value);
console.log(option.text);
```

## Details

HTML:

```html
<details id="details">
    <summary>Informasi</summary>
    Isi informasi.
</details>
```

JavaScript:

```javascript
const details =
    document.getElementById("details");

details.open = true;
```

## Dialog

HTML:

```html
<dialog id="dialog">
    <p>Hello Dialog</p>
</dialog>
```

JavaScript:

```javascript
const dialog =
    document.getElementById("dialog");

dialog.showModal();
```

Tutup:

```javascript
dialog.close();
```

## Audio

```html
<audio id="audio" src="music.mp3"></audio>
```

```javascript
const audio =
    document.getElementById("audio");

audio.play();
```

Stop:

```javascript
audio.pause();
audio.currentTime = 0;
```

## Video

```javascript
const video =
    document.querySelector("video");

video.play();
video.pause();
```

## Canvas

HTML:

```html
<canvas
    id="canvas"
    width="400"
    height="200"
></canvas>
```

JavaScript:

```javascript
const canvas =
    document.getElementById("canvas");

const context =
    canvas.getContext("2d");

context.fillRect(
    10,
    10,
    100,
    50
);
```

## Template

HTML:

```html
<template id="user-template">
    <div class="user">
        <span class="name"></span>
    </div>
</template>
```

JavaScript:

```javascript
const template =
    document.getElementById(
        "user-template"
    );

const clone =
    template.content.cloneNode(true);

clone.querySelector(".name")
    .textContent = "Budi";

document.body.appendChild(clone);
```

**Hafalan:**

```text
img      → src, alt
a        → href, target
button   → disabled
checkbox → checked
select   → value, options
details  → open
dialog   → showModal(), close()
audio    → play(), pause()
video    → play(), pause()
canvas   → getContext()
template → content.cloneNode()
```

---

# 22. Mini Project

## Todo List dengan DOM

Project ini menggabungkan:

```text
Document
Element
Query Selector
Event
Event Handler
Style
classList
textContent
Array
```

## `index.html`

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">

    <title>Todo List</title>

    <style>
        .done {
            text-decoration: line-through;
            opacity: 0.5;
        }

        li {
            cursor: pointer;
            margin: 8px 0;
        }
    </style>
</head>

<body>

    <h1>Todo List</h1>

    <form id="todo-form">
        <input
            id="todo-input"
            type="text"
            placeholder="Todo..."
            required
        >

        <button type="submit">
            Tambah
        </button>
    </form>

    <ul id="todo-list"></ul>

    <script src="script.js"></script>
</body>
</html>
```

## `script.js`

```javascript
const form =
    document.querySelector("#todo-form");

const input =
    document.querySelector("#todo-input");

const list =
    document.querySelector("#todo-list");

form.addEventListener(
    "submit",
    event => {
        event.preventDefault();

        const text =
            input.value.trim();

        if (!text) {
            return;
        }

        const item =
            document.createElement("li");

        item.textContent = text;

        item.addEventListener(
            "click",
            () => {
                item.classList.toggle("done");
            }
        );

        list.appendChild(item);

        input.value = "";
        input.focus();
    }
);
```

Alurnya:

```text
User mengetik
     ↓
Submit form
     ↓
preventDefault()
     ↓
Ambil input.value
     ↓
createElement("li")
     ↓
textContent
     ↓
appendChild()
     ↓
Todo tampil
     ↓
Klik todo
     ↓
classList.toggle()
     ↓
Todo selesai
```

---

# 23. Tabel Ringkasan

| Materi | Fungsi | API Penting |
|---|---|---|
| DOM | Representasi HTML | `document` |
| Document | Dokumen HTML | `document.body`, `document.title` |
| Node | Dasar struktur DOM | `parentNode`, `childNodes` |
| Element | Elemen HTML | `id`, `classList`, `children` |
| NodeList | Kumpulan Node | `length`, `forEach()` |
| Attr | Satu attribute | `name`, `value` |
| NamedNodeMap | Kumpulan Attr | `element.attributes` |
| Text Node | Node teks | `textContent`, `createTextNode()` |
| Event Handler | Menangani event | `addEventListener()` |
| Event | Informasi event | `target`, `currentTarget` |
| Style | Mengubah inline CSS | `element.style` |
| Inner Text | Teks rendered | `innerText` |
| Inner HTML | HTML di dalam element | `innerHTML` |
| Window | Global browser object | `location`, `history`, `alert()` |
| Query Selector | Mencari element | `querySelector()`, `querySelectorAll()` |
| Node Type | Jenis node | `nodeType` |
| HTML Element | API umum element | `classList`, `dataset`, `matches()` |
| Form | Manipulasi form | `value`, `checked`, `FormData` |
| Table | Manipulasi table | `rows`, `insertRow()`, `insertCell()` |
| HTML lain | API khusus element | `src`, `href`, `disabled`, `play()` |

---

# 24. Cheat Code DOM 10 Detik

> **DOM = HTML yang sudah menjadi object. `document` adalah pintu utama. Cari element dengan `querySelector()`, ubah teks dengan `textContent`, ubah HTML dengan `innerHTML`, ubah CSS dengan `style` atau `classList`, ubah attribute dengan `getAttribute()`/`setAttribute()`, tangani event dengan `addEventListener()`, buat element dengan `createElement()`, masukkan dengan `append()`/`appendChild()`, dan hapus dengan `remove()`.**

Versi super singkat:

```text
document
→ akses DOM

querySelector()
→ cari 1

querySelectorAll()
→ cari semua

textContent
→ ubah teks

innerText
→ teks rendered

innerHTML
→ ubah HTML

style
→ ubah inline CSS

classList
→ kelola class

getAttribute()
→ baca attribute

setAttribute()
→ ubah/tambah attribute

addEventListener()
→ event

createElement()
→ buat element

append()
→ tambahkan node

remove()
→ hapus element

parentNode
→ parent

children
→ element children

childNodes
→ semua node children

dataset
→ data-*

FormData
→ ambil data form

preventDefault()
→ batalkan default action
```

## Pola DOM yang wajib diingat

### 1. Cari

```javascript
const element =
    document.querySelector("#title");
```

### 2. Baca

```javascript
console.log(
    element.textContent
);
```

### 3. Ubah

```javascript
element.textContent =
    "Hello";
```

### 4. Style

```javascript
element.classList.add("active");
```

### 5. Event

```javascript
element.addEventListener(
    "click",
    () => {
        console.log("Klik");
    }
);
```

### 6. Buat

```javascript
const div =
    document.createElement("div");
```

### 7. Masukkan

```javascript
document.body.append(div);
```

### 8. Hapus

```javascript
div.remove();
```

---

# 25. Referensi Resmi

- **MDN — Document Object Model (DOM)**  
  https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model

- **MDN — Document**  
  https://developer.mozilla.org/en-US/docs/Web/API/Document

- **MDN — Node**  
  https://developer.mozilla.org/en-US/docs/Web/API/Node

- **MDN — Element**  
  https://developer.mozilla.org/en-US/docs/Web/API/Element

- **MDN — NodeList**  
  https://developer.mozilla.org/en-US/docs/Web/API/NodeList

- **MDN — Attr**  
  https://developer.mozilla.org/en-US/docs/Web/API/Attr

- **MDN — NamedNodeMap**  
  https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap

- **MDN — Text**  
  https://developer.mozilla.org/en-US/docs/Web/API/Text

- **MDN — EventTarget / addEventListener**  
  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

- **MDN — Event**  
  https://developer.mozilla.org/en-US/docs/Web/API/Event

- **MDN — HTMLElement**  
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement

- **MDN — Window**  
  https://developer.mozilla.org/en-US/docs/Web/API/Window

- **MDN — querySelector()**  
  https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector

- **MDN — querySelectorAll()**  
  https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll

- **MDN — HTMLInputElement**  
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement

- **MDN — HTMLFormElement**  
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement

- **MDN — HTMLTableElement**  
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement

- **MDN — HTMLMediaElement**  
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement

- **MDN — HTMLCanvasElement**  
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement

- **WHATWG — DOM Standard**  
  https://dom.spec.whatwg.org/

---

## Catatan Penting

DOM berbeda dengan JavaScript language core.

```text
JavaScript
├── Number
├── String
├── Array
├── Object
├── Map
├── Set
└── ...

Browser Web APIs
├── DOM
├── Window
├── Event
├── Fetch
├── Storage
└── ...
```

Jadi:

```javascript
const array = [];
```

adalah JavaScript language feature.

Sedangkan:

```javascript
document.querySelector("div");
```

adalah penggunaan **DOM Web API** di browser.

### Urutan belajar DOM yang disarankan

```text
Pengenalan DOM
      ↓
Document
      ↓
Node
      ↓
Element
      ↓
Query Selector
      ↓
NodeList
      ↓
Text + innerHTML
      ↓
Attribute
      ↓
Style + classList
      ↓
Event
      ↓
Form
      ↓
Table
      ↓
Element lainnya
      ↓
Mini Project
```
