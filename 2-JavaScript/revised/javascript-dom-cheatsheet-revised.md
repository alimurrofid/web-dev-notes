# JavaScript DOM Cheatsheet Revised

> **Target:** pemula yang sudah memahami dasar JavaScript (variable,
> function, event handler sederhana), lalu ingin mengenal DOM untuk
> memanipulasi halaman web.
>
> Fokus cheatsheet ini: **pengenalan DOM → document → node → element →
> mencari element → mengubah teks/HTML/style → event → form/table →
> element khusus → mini project**.
>
> **Batasan penting:** DOM adalah API yang disediakan environment
> browser untuk merepresentasikan dokumen HTML sebagai struktur
> node/object yang dapat dibaca dan dimanipulasi menggunakan
> JavaScript. Ini berbeda dengan JavaScript language core.

## Cara Belajar

``` text
🟢 Fundamental
→ wajib untuk mulai memanipulasi halaman web

🟡 Lanjutan
→ pelajari setelah fundamental nyaman

🔴 Advanced / Reference
→ penting ketika kebutuhan aplikasi meningkat
```

Mental model:

``` text
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

``` text
mencari element
mengubah teks
mengubah HTML
mengubah attribute
mengubah CSS
membuat element
menghapus element
menangani event
```

**Penting:** DOM berbeda dengan JavaScript language core.

``` text
JavaScript (language core)
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

## Daftar Isi

### 🟢 Fundamental

1. [Pengenalan DOM](#bagian-1)
2. [Membuat Project](#bagian-2)
3. [Tipe Data](#bagian-3)
4. [Document](#bagian-4)
5. [Node](#bagian-5)
6. [Element](#bagian-6)
7. [NodeList](#bagian-7)
8. [Query Selector](#bagian-8)
9. [Text Node](#bagian-9)
10. [Inner Text dan Inner HTML](#bagian-10)
11. [Style](#bagian-11)
12. [Event Handler](#bagian-12)

### 🟡 Lanjutan

13. [Event](#bagian-13)
14. [Window](#bagian-14)
15. [Attr](#bagian-15)
16. [NamedNodeMap](#bagian-16)
17. [Node Type](#bagian-17)
18. [HTML Element](#bagian-18)
19. [HTML Form Element](#bagian-19)
20. [HTML Table Element](#bagian-20)
21. [HTML Element Lainnya](#bagian-21)

### 🔴 Advanced / Reference

22. [Mini Flow DOM](#bagian-22)
23. [Tabel Ringkasan](#bagian-23)
24. [Cheat Code DOM 10 Detik](#bagian-24)
25. [Urutan Belajar yang Disarankan](#bagian-25)
26. [Mini Project](#bagian-26)
27. [Referensi Resmi](#bagian-27)

------------------------------------------------------------------------

<a id="bagian-1"></a>

# 1. 🟢 Pengenalan DOM

## Konsep

**DOM (Document Object Model)** adalah representasi dokumen HTML dalam
bentuk object/node yang dapat diakses dan dimanipulasi menggunakan
JavaScript.

Contoh HTML:

``` html
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

``` text
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

``` javascript
const title = document.getElementById("title");

title.textContent = "Hello JavaScript!";
```

## Hasil

``` text
Hello JavaScript!
```

## Cara Kerja

``` text
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

## Kunci

> DOM = HTML yang sudah menjadi object. `document` adalah pintu utama.

------------------------------------------------------------------------

<a id="bagian-2"></a>

# 2. 🟢 Membuat Project

## Konsep

Project DOM paling sederhana terdiri dari satu file HTML dan satu file
JavaScript.

## Struktur project

``` text
belajar-dom/
├── index.html
└── script.js
```

## `index.html`

``` html
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

``` javascript
const title = document.getElementById("title");

const button = document.getElementById("button");

button.addEventListener("click", () => {
    title.textContent = "Hello JavaScript DOM!";
});
```

## Hasil

Ketika tombol diklik:

``` text
Belajar DOM
     ↓
klik tombol
     ↓
Hello JavaScript DOM!
```

## Cara menjalankan

Buka `index.html` di browser. Untuk project yang lebih nyaman,
gunakan local development server.

## Kunci

> ``` html
> <script src="script.js"></script>
> ```

JavaScript dijalankan setelah elemen tersedia jika script diletakkan
sebelum `</body>`.

Alternatif:

``` html
<script src="script.js" defer></script>
```

`defer` membuat script dieksekusi setelah HTML selesai diparse.

## Best Practice

- Letakkan `<script>` sebelum `</body>`, atau gunakan atribut `defer`
  agar element sudah tersedia saat JavaScript dijalankan.

------------------------------------------------------------------------

<a id="bagian-3"></a>

# 3. 🟢 Tipe Data

## Konsep

DOM menggunakan object dan tipe data JavaScript biasa.

## Contoh

``` javascript
const title = document.getElementById("title");

console.log(typeof title);
```

## Output

``` text
object
```

Beberapa nilai DOM:

``` javascript
console.log(typeof document);
console.log(typeof document.body);
console.log(typeof document.title);
```

Umumnya:

``` text
object
object
string
```

## Value dari input

``` html
<input id="name" value="Budi">
```

``` javascript
const input = document.getElementById("name");

console.log(input.value);
console.log(typeof input.value);
```

## Output

``` text
Budi
string
```

Angka dari input tetap berupa string:

``` javascript
input.value = "100";

console.log(typeof input.value);
```

## Output

``` text
string
```

Jika membutuhkan Number:

``` javascript
const number = Number(input.value);

console.log(number);
```

## Kunci

> DOM Element → object, `input.value` → biasanya string.

## Kesalahan Umum

❌ Langsung melakukan operasi matematika pada `input.value` — hasilnya
gabungan string.

✅ Konversi dulu dengan `Number(input.value)`.

------------------------------------------------------------------------

<a id="bagian-4"></a>

# 4. 🟢 Document

## Konsep

`document` adalah object utama yang merepresentasikan dokumen HTML saat
ini.

## Contoh

``` javascript
console.log(document);
```

## Title

``` javascript
console.log(document.title);

document.title = "Belajar JavaScript DOM";
```

## Body dan Head

``` javascript
console.log(document.body);
console.log(document.head);
```

## URL dan Domain

``` javascript
console.log(document.URL);
console.log(document.domain);
```

> `document.domain` adalah API lama/deprecated dalam banyak penggunaan
> modern. Jangan jadikan pilihan utama untuk komunikasi antar-origin.

## Mencari element

``` javascript
document.getElementById("title");
document.getElementsByClassName("item");
document.getElementsByTagName("p");
document.querySelector(".item");
document.querySelectorAll(".item");
```

## Kunci

> `document` → object utama dokumen: `title`, `head`, `body`, `URL`,
> `getElementById()`, `querySelector()`, `querySelectorAll()`.

## Best Practice

- Gunakan `querySelector()` / `querySelectorAll()` sebagai cara utama
  mencari element karena mendukung CSS selector lengkap.

------------------------------------------------------------------------

<a id="bagian-5"></a>

# 5. 🟢 Node

## Konsep

`Node` adalah konsep dasar DOM. Banyak object DOM merupakan turunan
dari `Node`.

## Contoh

``` html
<div id="container">
    Hello
</div>
```

``` javascript
const container = document.getElementById("container");

console.log(container instanceof Node);
```

## Output

``` text
true
```

Jenis node:

``` text
Document
Element
Text
Comment
DocumentFragment
dan lainnya
```

``` javascript
console.log(document instanceof Node);
console.log(document.body instanceof Node);
```

## Output

``` text
true
true
```

## Parent dan child

``` javascript
const body = document.body;

console.log(body.parentNode);
console.log(body.childNodes);
```

Hubungan:

``` text
parent
  │
  ├── child
  ├── child
  └── child
```

## `childNodes`

Perhatikan bahwa `childNodes` dapat berisi **text node whitespace**:

``` javascript
console.log(document.body.childNodes);
```

## `firstChild` dan `lastChild`

``` javascript
console.log(document.body.firstChild);
console.log(document.body.lastChild);
```

## Kunci

> Node → dasar struktur DOM: `parentNode`, `childNodes`, `firstChild`,
> `lastChild`.

## Kesalahan Umum

❌ Mengira `childNodes` hanya berisi element.

✅ `childNodes` berisi semua jenis Node (termasuk text whitespace).
Gunakan `children` (section 6) jika hanya ingin element.

------------------------------------------------------------------------

<a id="bagian-6"></a>

# 6. 🟢 Element

## Konsep

`Element` adalah node yang merepresentasikan elemen HTML/XML.

## Contoh

``` html
<h1 id="title">Hello</h1>
```

``` javascript
const title = document.getElementById("title");

console.log(title instanceof Element);
```

## Output

``` text
true
```

## `tagName` dan `id`

``` javascript
console.log(title.tagName);
console.log(title.id);
```

## Output

``` text
H1
title
```

## `classList`

``` javascript
title.classList.add("active");
title.classList.remove("hidden");

console.log(title.classList.contains("active"));
```

## Output

``` text
true
```

## Attribute

``` javascript
title.setAttribute("data-id", "10");

console.log(title.getAttribute("data-id"));
```

## Output

``` text
10
```

## `children`

Berbeda dengan `childNodes`, `children` hanya berisi **element
children**:

``` javascript
console.log(document.body.children);
```

## Perbedaan penting

``` text
childNodes
→ semua jenis Node

children
→ hanya Element
```

## Kunci

> Element → node elemen HTML: `tagName`, `id`, `classList`,
> `setAttribute()` / `getAttribute()`, `children`.

------------------------------------------------------------------------

<a id="bagian-7"></a>

# 7. 🟢 NodeList

## Konsep

`NodeList` adalah kumpulan node yang dikembalikan oleh beberapa API
DOM, misalnya `querySelectorAll()`.

## Contoh

``` html
<p class="item">A</p>
<p class="item">B</p>
<p class="item">C</p>
```

``` javascript
const items = document.querySelectorAll(".item");

console.log(items);
console.log(items.length);
```

## Output

``` text
NodeList(3)
3
```

## Akses index dan `forEach()`

``` javascript
console.log(items[0]);
console.log(items[1]);

items.forEach(item => {
    console.log(item.textContent);
});
```

## Output

``` text
A
B
C
```

## NodeList bukan Array

``` javascript
console.log(Array.isArray(items));
```

## Output

``` text
false
```

Tetapi bisa diubah menjadi Array:

``` javascript
const array = Array.from(items);

console.log(Array.isArray(array));
```

## Output

``` text
true
```

## Kunci

> `querySelectorAll()` → NodeList: punya `length` dan `forEach()`,
> tapi bukan Array.

## Best Practice

- Gunakan `Array.from(items)` jika ingin memakai method array seperti
  `map()` / `filter()`.

------------------------------------------------------------------------

<a id="bagian-8"></a>

# 8. 🟢 Query Selector

## Konsep

Query selector adalah cara modern untuk mencari element menggunakan
CSS selector.

## `querySelector()`

Mengambil **element pertama** yang cocok:

``` html
<p class="item">A</p>
<p class="item">B</p>
```

``` javascript
const item = document.querySelector(".item");

console.log(item.textContent);
```

## Output

``` text
A
```

## `querySelectorAll()`

Mengambil semua element yang cocok:

``` javascript
const items = document.querySelectorAll(".item");

console.log(items.length);
```

## Output

``` text
2
```

## Jenis selector

``` javascript
document.querySelector("#title");          // ID
document.querySelector(".item");           // class
document.querySelector("p");               // tag
document.querySelector("input[type='email']"); // attribute
document.querySelector(".container .item");// descendant
document.querySelector(".container > .item"); // child
document.querySelector("h1, h2, h3");      // multiple
```

## Kunci

> `querySelector()` → element pertama, `querySelectorAll()` → semua.

## Best Practice

- Gunakan CSS selector yang spesifik untuk menghindari mengambil
  element yang salah.

------------------------------------------------------------------------

<a id="bagian-9"></a>

# 9. 🟢 Text Node

## Konsep

Text node adalah node yang menyimpan teks di dalam DOM.

## Contoh

``` html
<h1>Hello</h1>
```

Strukturnya:

``` text
H1 Element
   │
   └── Text Node
       "Hello"
```

``` javascript
const title = document.querySelector("h1");

console.log(title.firstChild.nodeType);
```

## Output

``` text
3
```

`3` berarti `TEXT_NODE`.

## `createTextNode()`

``` javascript
const text = document.createTextNode("Hello JavaScript");

document.body.appendChild(text);
```

## `textContent`

Cara yang lebih umum:

``` javascript
title.textContent = "Hello JavaScript";
```

## Kunci

> Text Node → node yang berisi teks, `Node.TEXT_NODE` → `3`.

## Best Practice

- Gunakan `textContent` untuk mengubah teks — lebih sederhana daripada
  membuat text node manual.

------------------------------------------------------------------------

<a id="bagian-10"></a>

# 10. 🟢 Inner Text dan Inner HTML

## Konsep

`textContent`, `innerText`, dan `innerHTML` adalah tiga cara berbeda
untuk membaca/mengubah isi element.

## `textContent`

Mengambil atau mengubah teks mentah:

``` html
<div id="content">
    Hello
</div>
```

``` javascript
const content = document.getElementById("content");

content.textContent = "<strong>Hello</strong>";
```

Yang tampil:

``` text
<strong>Hello</strong>
```

HTML tidak diproses.

## `innerText`

``` javascript
console.log(content.innerText);
```

`innerText` lebih berhubungan dengan teks yang terlihat/rendered dan
dapat dipengaruhi CSS/layout.

## `innerHTML`

``` javascript
content.innerHTML = "<strong>Hello</strong>";
```

Browser akan membuat:

``` html
<strong>Hello</strong>
```

Hasil tampilan:

``` text
Hello
```

## Perbedaan

``` text
textContent
→ teks mentah dalam node

innerText
→ teks yang direpresentasikan sebagai rendered/visible text

innerHTML
→ HTML di dalam element
```

## Keamanan

Hindari:

``` javascript
element.innerHTML = userInput;
```

jika `userInput` tidak dipercaya. Untuk teks dari user:

``` javascript
element.textContent = userInput;
```

lebih aman karena string diperlakukan sebagai teks, bukan HTML.

## Kunci

> `textContent` → teks, `innerText` → teks terlihat/rendered,
> `innerHTML` → HTML.

## Kesalahan Umum

❌ Memasukkan input user ke `innerHTML` — berisiko XSS.

✅ Gunakan `textContent` untuk teks dari user.

------------------------------------------------------------------------

<a id="bagian-11"></a>

# 11. 🟢 Style

## Konsep

JavaScript dapat mengubah CSS element melalui `style` (inline style)
atau `classList` (kelola class CSS).

## Contoh

``` html
<h1 id="title">
    Hello
</h1>
```

``` javascript
const title = document.getElementById("title");

title.style.color = "red";
title.style.fontSize = "30px";
title.style.backgroundColor = "yellow";
```

Perhatikan CSS:

``` css
background-color
```

menjadi:

``` javascript
backgroundColor
```

## `style.cssText`

``` javascript
title.style.cssText = `
    color: red;
    font-size: 30px;
`;
```

## `classList`

Untuk perubahan style yang lebih terstruktur, sering lebih baik
menggunakan class:

``` css
.active {
    color: red;
    font-size: 30px;
}
```

``` javascript
title.classList.add("active");
```

## Kunci

> `style.property` → ubah inline style, `classList` → kelola class CSS.

## Best Practice

- Untuk perubahan style yang kompleks, gunakan class CSS + `classList`
  daripada inline style — lebih mudah dikelola.

------------------------------------------------------------------------

<a id="bagian-12"></a>

# 12. 🟢 Event Handler

## Konsep

Event handler digunakan untuk menjalankan kode ketika sesuatu terjadi,
misalnya klik.

## Contoh

``` html
<button id="button">
    Klik
</button>
```

## `onclick`

``` javascript
const button = document.getElementById("button");

button.onclick = function () {
    console.log("Button diklik");
};
```

## `addEventListener()`

Cara yang umumnya lebih fleksibel:

``` javascript
button.addEventListener("click", () => {
    console.log("Button diklik");
});
```

## Event listener dengan function bernama

``` javascript
function handleClick() {
    console.log("Klik");
}

button.addEventListener("click", handleClick);
```

Menghapus listener:

``` javascript
button.removeEventListener("click", handleClick);
```

> Untuk `removeEventListener()`, function yang diberikan harus
> merupakan referensi function yang sama.

## Kunci

> `addEventListener()` → pasang event, `removeEventListener()` → lepas
> event.

## Best Practice

- Gunakan `addEventListener()` daripada `onclick` — bisa memasang
  banyak listener dan mudah dilepas.

------------------------------------------------------------------------

<a id="bagian-13"></a>

# 13. 🟡 Event

## Konsep

`Event` adalah object yang berisi informasi tentang kejadian yang
terjadi.

## Contoh

``` javascript
button.addEventListener("click", event => {
    console.log(event);
});
```

## `target` dan `currentTarget`

``` javascript
button.addEventListener("click", event => {
    console.log(event.target);
    console.log(event.currentTarget);
});
```

- `target` → element yang memicu event.
- `currentTarget` → element tempat listener sedang dijalankan.

## `preventDefault()`

``` javascript
form.addEventListener("submit", event => {
    event.preventDefault();

    console.log("Form tidak melakukan submit default");
});
```

## `stopPropagation()`

``` javascript
button.addEventListener("click", event => {
    event.stopPropagation();
});
```

Digunakan untuk menghentikan propagasi event.

## Event bubbling

``` text
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

``` javascript
list.addEventListener("click", event => {
    if (event.target.matches(".item")) {
        console.log(event.target.textContent);
    }
});
```

## Kunci

> `target` → siapa yang memicu, `currentTarget` → tempat listener.
>
> `preventDefault()` → batalkan default action, `stopPropagation()` →
> hentikan propagasi.

## Best Practice

- Gunakan event delegation untuk daftar item yang banyak atau
  dinamis — cukup satu listener di parent.

------------------------------------------------------------------------

<a id="bagian-14"></a>

# 14. 🟡 Window

## Konsep

`window` adalah global object utama pada browser. Banyak API browser
tersedia melalui `window`.

## Contoh

``` javascript
console.log(window);
```

## `window.document`

``` javascript
console.log(window.document === document);
```

## Output

``` text
true
```

## `alert()`, `confirm()`, `prompt()`

``` javascript
window.alert("Hello");

const result = window.confirm("Lanjut?");

const name = window.prompt("Nama?");
```

## `setTimeout()`

``` javascript
setTimeout(() => {
    console.log("Selesai");
}, 1000);
```

## `location` dan `history`

``` javascript
console.log(window.location.href);
console.log(window.history);
```

## Kunci

> `window` → global browser: `document`, `alert()`, `confirm()`,
> `prompt()`, `location`, `history`, `setTimeout()`.

## Best Practice

- Untuk kode yang juga berjalan di luar browser (Node.js), jangan
  langsung memakai `window` — cek keberadaannya atau gunakan pola
  yang aman.

------------------------------------------------------------------------

<a id="bagian-15"></a>

# 15. 🟡 Attr

## Konsep

`Attr` adalah object yang merepresentasikan attribute pada element.

## Contoh

``` html
<input id="name" type="text">
```

``` javascript
const input = document.getElementById("name");

const attr = input.getAttributeNode("type");

console.log(attr.name);
console.log(attr.value);
```

## Output

``` text
type
text
```

## Membuat Attr

``` javascript
const dataId = document.createAttribute("data-id");

dataId.value = "123";

input.setAttributeNode(dataId);
```

Sekarang:

``` html
<input id="name" type="text" data-id="123">
```

Dalam penggunaan sehari-hari, API yang lebih sederhana biasanya:

``` javascript
input.setAttribute("data-id", "123");
```

## Kunci

> Attr → representasi satu attribute.

## Best Practice

- Gunakan `setAttribute()` / `getAttribute()` daripada
  `createAttribute()` / `setAttributeNode()` untuk kebutuhan umum.

------------------------------------------------------------------------

<a id="bagian-16"></a>

# 16. 🟡 NamedNodeMap

## Konsep

`NamedNodeMap` adalah kumpulan `Attr` yang dimiliki sebuah element.

## Contoh

``` html
<input
    id="name"
    class="form-control"
    type="text"
>
```

``` javascript
const input = document.getElementById("name");

console.log(input.attributes);
```

`attributes` menghasilkan:

``` text
NamedNodeMap
```

## `length` dan akses index

``` javascript
console.log(input.attributes.length);

const attr = input.attributes[0];

console.log(attr.name);
console.log(attr.value);
```

## Iterasi

``` javascript
for (const attr of input.attributes) {
    console.log(attr.name, attr.value);
}
```

Output kira-kira:

``` text
id name
class form-control
type text
```

## Kunci

> Element → `attributes` → NamedNodeMap → Attr.

## Best Practice

- Untuk membaca satu attribute, gunakan `getAttribute()` — lebih
  sederhana daripada mengiterasi `attributes`.

------------------------------------------------------------------------

<a id="bagian-17"></a>

# 17. 🟡 Node Type

## Konsep

Setiap node memiliki `nodeType` yang menunjukkan jenis node tersebut.

## Contoh

``` javascript
console.log(document.nodeType);
```

## Output

``` text
9
```

## Jenis penting

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

## Contoh

``` javascript
const title = document.querySelector("h1");

console.log(title.nodeType);
```

## Output

``` text
1
```

Lebih mudah dibaca:

``` javascript
console.log(title.nodeType === Node.ELEMENT_NODE);
```

## Output

``` text
true
```

## Kunci

> `1` → Element, `3` → Text, `8` → Comment, `9` → Document, `11` →
> DocumentFragment.

## Best Practice

- Bandingkan `nodeType` dengan constant (`Node.ELEMENT_NODE`) daripada
  angka mentah agar lebih mudah dibaca.

------------------------------------------------------------------------

<a id="bagian-18"></a>

# 18. 🟡 HTML Element

## Konsep

HTML element memiliki banyak API khusus yang sering dipakai:
`classList`, `dataset`, attribute, `matches()`, dan `closest()`.

## `id` dan `className`

``` javascript
const box = document.getElementById("box");

box.id = "new-box";
box.className = "container active";
```

## `classList`

``` javascript
box.classList.add("visible");
box.classList.remove("hidden");

box.classList.toggle("active");

console.log(box.classList.contains("visible"));
```

## `dataset`

HTML:

``` html
<div
    id="product"
    data-id="100"
    data-category="book"
>
    Buku
</div>
```

JavaScript:

``` javascript
const product = document.getElementById("product");

console.log(product.dataset.id);
console.log(product.dataset.category);
```

## Output

``` text
100
book
```

Menambah:

``` javascript
product.dataset.price = "50000";
```

Menjadi:

``` html
data-price="50000"
```

## Attribute

``` javascript
product.setAttribute("title", "Produk Buku");

console.log(product.getAttribute("title"));

product.removeAttribute("title");

console.log(product.hasAttribute("data-id"));
```

## `matches()` dan `closest()`

``` javascript
console.log(product.matches("#product"));
```

`closest()` mencari ancestor terdekat yang cocok:

``` javascript
const item = document.querySelector(".item");

const container = item.closest(".container");
```

## Kunci

> `classList` → class, `dataset` → data-*, `setAttribute` /
> `getAttribute` → attribute, `matches` → cocok dengan selector,
> `closest` → ancestor terdekat.

## Best Practice

- Gunakan `data-*` + `dataset` untuk menyimpan data kecil pada
  element.

------------------------------------------------------------------------

<a id="bagian-19"></a>

# 19. 🟡 HTML Form Element

## Konsep

DOM menyediakan API khusus untuk form: mengambil input, validasi,
checkbox, select, dan `FormData`.

## Contoh

``` html
<form id="register">
    <input id="name" name="name" type="text">

    <input id="email" name="email" type="email">

    <button type="submit">
        Daftar
    </button>
</form>
```

## Mengambil form dan input

``` javascript
const form = document.getElementById("register");
const name = document.getElementById("name");

console.log(name.value);
```

## `form.elements`

``` javascript
console.log(form.elements);

console.log(form.elements.name);
```

## Submit event

``` javascript
form.addEventListener("submit", event => {
    event.preventDefault();

    console.log(name.value);
});
```

## Validasi

HTML:

``` html
<input id="email" type="email" required>
```

JavaScript:

``` javascript
const email = document.getElementById("email");

console.log(email.validity.valid);
console.log(form.checkValidity());
```

`reportValidity()` menampilkan pesan validasi browser:

``` javascript
form.reportValidity();
```

## Checkbox

``` javascript
const agree = document.getElementById("agree");

console.log(agree.checked);

agree.checked = true;
```

## Select

``` html
<select id="country">
    <option value="id">Indonesia</option>
    <option value="my">Malaysia</option>
</select>
```

``` javascript
const country = document.getElementById("country");

console.log(country.value);
console.log(country.selectedOptions[0].textContent);
```

## FormData

Cara praktis mengambil data form:

``` javascript
form.addEventListener("submit", event => {
    event.preventDefault();

    const data = new FormData(form);

    console.log(data.get("name"));
    console.log(data.get("email"));
});
```

## Kunci

> `input.value`, `checkbox.checked`, `form.elements`, submit event,
> `FormData(form)`, `checkValidity()`.

## Best Practice

- Gunakan `FormData(form)` untuk mengambil seluruh data form secara
  praktis.

------------------------------------------------------------------------

<a id="bagian-20"></a>

# 20. 🟡 HTML Table Element

## Konsep

DOM menyediakan API khusus untuk table: `rows`, `tHead`, `tBodies`,
`tFoot`, `insertRow()`, dan `insertCell()`.

## Contoh

``` html
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

``` javascript
const table = document.getElementById("users");
```

## `rows`

``` javascript
console.log(table.rows.length);
```

`table.rows` berisi row dari table, termasuk row dalam `thead`,
`tbody`, dan `tfoot`.

## `tHead`, `tBodies`, `tFoot`

``` javascript
console.log(table.tHead);
console.log(table.tBodies);
console.log(table.tFoot);
```

## `insertRow()` dan `insertCell()`

``` javascript
const row = table.tBodies[0].insertRow();

const cell1 = row.insertCell();
const cell2 = row.insertCell();

cell1.textContent = "Andi";
cell2.textContent = "25";
```

## Hasil

``` text
Nama   Umur
Budi   20
Andi   25
```

## Mengakses cell

``` javascript
const firstRow = table.tBodies[0].rows[0];

console.log(firstRow.cells[0].textContent);
```

## Output

``` text
Budi
```

## Kunci

> `table.rows`, `table.tHead`, `table.tBodies`, `table.tFoot`,
> `row.cells`, `row.insertCell()`, `table body.insertRow()`.

## Best Practice

- Gunakan `createElement()` + `appendChild()` jika butuh kontrol
  penuh, atau API table (`insertRow()` / `insertCell()`) untuk
  kemudahan.

------------------------------------------------------------------------

<a id="bagian-21"></a>

# 21. 🟡 HTML Element Lainnya

## Konsep

Beberapa element HTML sering digunakan dalam JavaScript DOM: image,
link, button, checkbox, radio, select, details, dialog, audio, video,
canvas, dan template.

## Image

``` html
<img id="photo" src="old.jpg" alt="Foto">
```

``` javascript
const photo = document.getElementById("photo");

photo.src = "new.jpg";
photo.alt = "Foto Baru";
```

## Link

``` javascript
const link = document.getElementById("link");

link.href = "https://example.com";
link.target = "_blank";
```

## Button

``` javascript
const button = document.querySelector("button");

button.disabled = true;
button.disabled = false;
```

## Checkbox dan Radio

``` javascript
const checkbox = document.querySelector("input[type='checkbox']");

checkbox.checked = true;
```

``` javascript
const radio = document.getElementById("male");

console.log(radio.checked);
```

## Select dan Option

``` javascript
const select = document.querySelector("select");

console.log(select.value);

const option = select.options[0];

console.log(option.value);
console.log(option.text);
```

## Details dan Dialog

``` javascript
const details = document.getElementById("details");

details.open = true;
```

``` javascript
const dialog = document.getElementById("dialog");

dialog.showModal();
dialog.close();
```

## Audio dan Video

``` javascript
const audio = document.getElementById("audio");

audio.play();
audio.pause();
audio.currentTime = 0;
```

``` javascript
const video = document.querySelector("video");

video.play();
video.pause();
```

## Canvas

``` html
<canvas id="canvas" width="400" height="200"></canvas>
```

``` javascript
const canvas = document.getElementById("canvas");

const context = canvas.getContext("2d");

context.fillRect(10, 10, 100, 50);
```

## Template

``` html
<template id="user-template">
    <div class="user">
        <span class="name"></span>
    </div>
</template>
```

``` javascript
const template = document.getElementById("user-template");

const clone = template.content.cloneNode(true);

clone.querySelector(".name").textContent = "Budi";

document.body.appendChild(clone);
```

## Kunci

> `img` → src, alt; `a` → href, target; `button` → disabled;
> `checkbox` → checked; `select` → value, options; `details` → open;
> `dialog` → showModal(), close(); `audio`/`video` → play(), pause();
> `canvas` → getContext(); `template` → content.cloneNode().

## Best Practice

- Gunakan `<template>` untuk menyimpan struktur HTML yang akan
  di-clone berulang kali.

------------------------------------------------------------------------

<a id="bagian-22"></a>

# 22. 🛠️ Mini Flow DOM

Gunakan alur ini ketika memanipulasi DOM:

``` text
1. Cari element
        ↓
2. Baca / ubah isi (textContent, innerHTML)
        ↓
3. Ubah style / class
        ↓
4. Pasang event listener
        ↓
5. Buat / hapus element sesuai kebutuhan
        ↓
6. Test di browser
```

### Pola DOM yang wajib diingat

#### 1. Cari

``` javascript
const element = document.querySelector("#title");
```

#### 2. Baca

``` javascript
console.log(element.textContent);
```

#### 3. Ubah

``` javascript
element.textContent = "Hello";
```

#### 4. Style

``` javascript
element.classList.add("active");
```

#### 5. Event

``` javascript
element.addEventListener("click", () => {
    console.log("Klik");
});
```

#### 6. Buat

``` javascript
const div = document.createElement("div");
```

#### 7. Masukkan

``` javascript
document.body.append(div);
```

#### 8. Hapus

``` javascript
div.remove();
```

### Kapan memakai apa?

  Kebutuhan                    Pilihan
  ----------------------------- ----------------------------
  Cari satu element            `querySelector()`
  Cari banyak element          `querySelectorAll()`
  Ubah teks                    `textContent`
  Ubah HTML                    `innerHTML`
  Ubah inline CSS              `style`
  Ubah class CSS               `classList`
  Tangani event                `addEventListener()`
  Buat element                 `createElement()`
  Masukkan element             `append()` / `appendChild()`
  Hapus element                `remove()`
  Ambil data form              `FormData`

> **Best practice:** untuk teks dari user, selalu gunakan
> `textContent`, bukan `innerHTML`, agar aman dari XSS.

------------------------------------------------------------------------

<a id="bagian-23"></a>

# 23. 📚 Tabel Ringkasan

  Materi          API Penting                            Tujuan
  --------------- -------------------------------------- -----------------------------
  DOM             `document`                             Representasi HTML
  Document        `document.body`, `document.title`      Dokumen HTML
  Node            `parentNode`, `childNodes`             Dasar struktur DOM
  Element         `id`, `classList`, `children`          Elemen HTML
  NodeList        `length`, `forEach()`                  Kumpulan Node
  Query Selector  `querySelector()` / `querySelectorAll()` Mencari element
  Text Node       `textContent`, `createTextNode()`      Node teks
  Inner Text      `innerText`                            Teks rendered
  Inner HTML      `innerHTML`                            HTML di dalam element
  Style           `element.style`                        Mengubah inline CSS
  Event Handler   `addEventListener()`                   Menangani event
  Event           `target`, `currentTarget`              Informasi event
  Window          `location`, `history`, `alert()`       Global browser object
  Attr            `name`, `value`                        Satu attribute
  NamedNodeMap    `element.attributes`                   Kumpulan Attr
  Node Type       `nodeType`                             Jenis node
  HTML Element    `classList`, `dataset`, `matches()`    API umum element
  Form            `value`, `checked`, `FormData`         Manipulasi form
  Table           `rows`, `insertRow()`, `insertCell()`  Manipulasi table
  HTML lain       `src`, `href`, `disabled`, `play()`    API khusus element

------------------------------------------------------------------------

<a id="bagian-24"></a>

# 24. ⚡ Cheat Code DOM 10 Detik

``` text
document
→ akses DOM

querySelector()
→ cari 1

querySelectorAll()
→ cari semua

textContent
→ ubah teks

innerHTML
→ ubah HTML

style / classList
→ ubah CSS

getAttribute() / setAttribute()
→ attribute

addEventListener()
→ event

createElement()
→ buat element

append() / appendChild()
→ tambahkan node

remove()
→ hapus element

dataset
→ data-*

FormData
→ ambil data form

preventDefault()
→ batalkan default action
```

> **DOM = HTML yang sudah menjadi object. `document` adalah pintu
> utama.**

------------------------------------------------------------------------

<a id="bagian-25"></a>

# 25. 🧭 Urutan Belajar yang Disarankan

``` text
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

Prinsip: setiap konsep langsung dipraktikkan dengan contoh kecil di
browser.

------------------------------------------------------------------------

<a id="bagian-26"></a>

# 26. 🏗️ Mini Project

## Todo List dengan DOM

Project ini menggabungkan:

``` text
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

``` html
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

``` javascript
const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");

form.addEventListener("submit", event => {
    event.preventDefault();

    const text = input.value.trim();

    if (!text) {
        return;
    }

    const item = document.createElement("li");

    item.textContent = text;

    item.addEventListener("click", () => {
        item.classList.toggle("done");
    });

    list.appendChild(item);

    input.value = "";
    input.focus();
});
```

## Alur

``` text
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

------------------------------------------------------------------------

<a id="bagian-27"></a>

# 27. 🔗 Referensi Resmi

- [MDN — Document Object Model (DOM)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [MDN — Document](https://developer.mozilla.org/en-US/docs/Web/API/Document)
- [MDN — Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
- [MDN — Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)
- [MDN — NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList)
- [MDN — Attr](https://developer.mozilla.org/en-US/docs/Web/API/Attr)
- [MDN — NamedNodeMap](https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap)
- [MDN — Text](https://developer.mozilla.org/en-US/docs/Web/API/Text)
- [MDN — EventTarget / addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [MDN — Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)
- [MDN — HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)
- [MDN — Window](https://developer.mozilla.org/en-US/docs/Web/API/Window)
- [MDN — querySelector()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)
- [MDN — querySelectorAll()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)
- [MDN — HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)
- [MDN — HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement)
- [MDN — HTMLTableElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement)
- [MDN — HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)
- [MDN — HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement)
- [WHATWG — DOM Standard](https://dom.spec.whatwg.org/)
