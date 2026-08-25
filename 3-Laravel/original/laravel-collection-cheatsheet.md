# Laravel Collection Cheatsheet — Mudah Dipahami & Diingat

> **Target:** memahami `Illuminate\Support\Collection` untuk mengolah data array/object secara ekspresif, dari membuat collection sampai filtering, mapping, grouping, aggregate, reduce, dan `LazyCollection`.
>
> Pola: **konsep → syntax → contoh → hasil → hafalan**.
>
> Contoh menggunakan API Collection Laravel modern. Detail tertentu dapat berbeda antar versi Laravel.

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Laravel Collection](#2-laravel-collection)
3. [Membuat Project](#3-membuat-project)
4. [Membuat Collection](#4-membuat-collection)
5. [For Each](#5-for-each)
6. [Manipulasi Collection](#6-manipulasi-collection)
7. [Mapping](#7-mapping)
8. [Zipping](#8-zipping)
9. [Flattening](#9-flattening)
10. [String Representation](#10-string-representation)
11. [Filtering](#11-filtering)
12. [Partitioning](#12-partitioning)
13. [Testing](#13-testing)
14. [Grouping](#14-grouping)
15. [Slicing](#15-slicing)
16. [Take dan Skip](#16-take-dan-skip)
17. [Chunked](#17-chunked)
18. [Retrieve](#18-retrieve)
19. [Random](#19-random)
20. [Checking Existence](#20-checking-existence)
21. [Ordering](#21-ordering)
22. [Aggregate](#22-aggregate)
23. [Reduce](#23-reduce)
24. [Method Lainnya](#24-method-lainnya)
25. [Lazy Collection](#25-lazy-collection)
26. [Cheat Flow Collection](#26-cheat-flow-collection)
27. [Tabel Ringkasan](#27-tabel-ringkasan)
28. [Cheat Code Collection 10 Detik](#28-cheat-code-collection-10-detik)
29. [Referensi Resmi](#29-referensi-resmi)

---

# 1. Pendahuluan

Laravel Collection adalah wrapper untuk bekerja dengan data array secara lebih nyaman dan ekspresif.

Daripada:

```php
foreach ($users as $user) {
    // ...
}
```

Collection memungkinkan:

```php
$users
    ->filter(...)
    ->map(...)
    ->sortBy(...)
    ->values();
```

Konsep umum:

```text
Data
 ↓
Collection
 ↓
Transform
 ↓
Filter
 ↓
Sort
 ↓
Aggregate
 ↓
Result
```

Collection sangat berguna ketika data perlu diproses dengan beberapa operasi berantai.

**Hafalan:**

```text
Collection
→ array + banyak helper
→ method chaining
→ data processing
```

---

# 2. Laravel Collection

Class utama:

```php
Illuminate\Support\Collection
```

Import:

```php
use Illuminate\Support\Collection;
```

Contoh:

```php
$users = collect([
    'Budi',
    'Andi',
    'Citra',
]);
```

Collection bisa diakses seperti array:

```php
echo $users[0];
```

Hasil:

```text
Budi
```

Jumlah data:

```php
$users->count();
```

Hasil:

```text
3
```

Collection mendukung method chaining:

```php
$result = collect([1, 2, 3, 4])
    ->map(fn ($value) => $value * 2)
    ->filter(fn ($value) => $value > 4)
    ->values();
```

Hasil:

```php
[6, 8]
```

**Hafalan:**

```text
collect()
→ ubah array menjadi Collection
```

---

# 3. Membuat Project

Jika ingin belajar Collection melalui project Laravel:

```bash
composer create-project laravel/laravel belajar-collection
```

Masuk:

```bash
cd belajar-collection
```

Jalankan:

```bash
php artisan serve
```

Atau jika project menyediakan script development:

```bash
composer run dev
```

Test cepat:

```php
use Illuminate\Support\Collection;

$numbers = collect([
    1, 2, 3, 4, 5
]);

dd($numbers);
```

`dd()` berarti:

```text
dump + die
```

Untuk hanya melihat data:

```php
dump($numbers);
```

**Hafalan:**

```text
collect()
→ buat Collection

dump()
→ tampilkan data

dd()
→ tampilkan + hentikan eksekusi
```

---

# 4. Membuat Collection

## `collect()`

Cara paling umum:

```php
$numbers = collect([
    1,
    2,
    3,
]);
```

## Empty Collection

```php
$items = collect();
```

## Dari array associative

```php
$user = collect([
    'name' => 'Budi',
    'age' => 20,
]);
```

Ambil value:

```php
$user->get('name');
```

## `range()`

```php
$numbers = collect(
    range(1, 5)
);
```

Hasil:

```text
[1, 2, 3, 4, 5]
```

## `times()`

Membuat collection berdasarkan jumlah iterasi:

```php
$numbers = Collection::times(
    5,
    fn ($number) => $number
);
```

Hasil:

```text
[1, 2, 3, 4, 5]
```

**Hafalan:**

```text
collect([...])
→ Collection biasa
```

---

# 5. For Each

## `each()`

Menjalankan callback untuk setiap item:

```php
collect([1, 2, 3])
    ->each(function ($number) {
        echo $number;
    });
```

Output:

```text
123
```

Dengan arrow function:

```php
collect([1, 2, 3])
    ->each(
        fn ($number) => print($number)
    );
```

`each()` mengembalikan Collection sehingga bisa dilanjutkan.

## `eachSpread()`

Untuk item yang berupa array:

```php
collect([
    ['Budi', 20],
    ['Andi', 25],
])->eachSpread(
    function ($name, $age) {
        echo "$name: $age";
    }
);
```

**Hafalan:**

```text
each()
→ lakukan sesuatu untuk setiap item

map()
→ ubah setiap item
```

Perbedaan penting:

```text
each
→ side effect

map
→ transform data
```

---

# 6. Manipulasi Collection

## `push()`

Tambah di akhir:

```php
$items = collect([
    'A',
    'B'
]);

$items->push('C');
```

Hasil:

```text
A B C
```

## `prepend()`

Tambah di awal:

```php
$items->prepend('Z');
```

## `put()`

Set berdasarkan key:

```php
$items->put(
    'name',
    'Budi'
);
```

## `push()` banyak item

```php
$items->push(
    'C',
    'D'
);
```

## `merge()`

```php
$a = collect([1, 2]);
$b = collect([3, 4]);

$result = $a->merge($b);
```

Hasil:

```text
[1, 2, 3, 4]
```

Untuk associative key:

```php
$a = collect([
    'name' => 'Budi',
]);

$b = collect([
    'age' => 20,
]);

$result = $a->merge($b);
```

## `concat()`

Menambahkan value dari iterable tanpa mempertahankan key source:

```php
$result = collect([1, 2])
    ->concat([3, 4]);
```

## `combine()`

Membuat key-value dari dua collection:

```php
$keys = collect([
    'name',
    'age'
]);

$values = collect([
    'Budi',
    20
]);

$result =
    $keys->combine($values);
```

Hasil:

```php
[
    'name' => 'Budi',
    'age' => 20,
]
```

## `reverse()`

```php
$result =
    collect([1, 2, 3])
        ->reverse();
```

## `shuffle()`

```php
$result =
    collect([1, 2, 3])
        ->shuffle();
```

**Hafalan:**

```text
push
→ tambah belakang

prepend
→ tambah depan

put
→ set key

merge
→ gabungkan

concat
→ tambahkan item

reverse
→ balik urutan

shuffle
→ acak
```

---

# 7. Mapping

Mapping berarti mengubah setiap item.

## `map()`

```php
$numbers = collect([
    1, 2, 3
]);

$result =
    $numbers->map(
        fn ($number) => $number * 2
    );
```

Hasil:

```text
[2, 4, 6]
```

## `mapWithKeys()`

Membuat key baru:

```php
$users = collect([
    [
        'id' => 1,
        'name' => 'Budi'
    ],
    [
        'id' => 2,
        'name' => 'Andi'
    ],
]);

$result =
    $users->mapWithKeys(
        fn ($user) => [
            $user['id'] =>
                $user['name']
        ]
    );
```

Hasil:

```php
[
    1 => 'Budi',
    2 => 'Andi',
]
```

## `mapInto()`

Mengubah setiap item menjadi object tertentu:

```php
$result =
    collect([
        'Budi',
        'Andi',
    ])->mapInto(User::class);
```

## `mapSpread()`

Untuk item yang merupakan array:

```php
$result = collect([
    [1, 2],
    [3, 4],
])->mapSpread(
    fn ($a, $b) => $a + $b
);
```

Hasil:

```text
[3, 7]
```

## `mapToGroups()`

Mengelompokkan hasil callback menjadi group.

```php
$result = collect([
    [
        'name' => 'Budi',
        'department' => 'IT',
    ],
    [
        'name' => 'Andi',
        'department' => 'HR',
    ],
])->mapToGroups(
    fn ($user) => [
        $user['department'] =>
            $user['name']
    ]
);
```

**Hafalan:**

```text
map
→ ubah value

mapWithKeys
→ ubah value + key

mapInto
→ ubah menjadi object

mapSpread
→ callback menerima item yang di-spread
```

---

# 8. Zipping

`zip()` menggabungkan beberapa collection berdasarkan posisi.

```php
$names = collect([
    'Budi',
    'Andi',
    'Citra'
]);

$ages = collect([
    20,
    25,
    22
]);

$result =
    $names->zip($ages);
```

Hasil:

```php
[
    ['Budi', 20],
    ['Andi', 25],
    ['Citra', 22],
]
```

Contoh:

```php
$names = collect([
    'Budi',
    'Andi'
]);

$ages = collect([
    20,
    25
]);

$cities = collect([
    'Bandung',
    'Jakarta'
]);

$result =
    $names->zip(
        $ages,
        $cities
    );
```

Hasil:

```php
[
    ['Budi', 20, 'Bandung'],
    ['Andi', 25, 'Jakarta'],
]
```

**Hafalan:**

```text
zip
→ gabungkan berdasarkan index
```

---

# 9. Flattening

Flattening berarti meratakan nested collection.

## `flatten()`

```php
$collection = collect([
    [1, 2],
    [3, 4],
]);

$result =
    $collection->flatten();
```

Hasil:

```text
[1, 2, 3, 4]
```

Nested:

```php
$collection = collect([
    [
        [1, 2],
        [3, 4]
    ],
    [
        [5, 6]
    ]
]);
```

```php
$result =
    $collection->flatten();
```

Hasil:

```text
[1, 2, 3, 4, 5, 6]
```

## Depth

```php
$result =
    $collection->flatten(1);
```

`flatten(1)` hanya meratakan satu level.

## `flatMap()`

```php
$result =
    collect([
        ['a', 'b'],
        ['c', 'd'],
    ])->flatMap(
        fn ($items) =>
            $items
    );
```

Hasil:

```text
[a, b, c, d]
```

**Hafalan:**

```text
flatten
→ ratakan nested

flatten(1)
→ ratakan satu level

flatMap
→ map + flatten
```

---

# 10. String Representation

Collection dapat diubah menjadi string.

## `implode()`

```php
$result =
    collect([
        'Budi',
        'Andi',
        'Citra'
    ])->implode(', ');
```

Hasil:

```text
Budi, Andi, Citra
```

Untuk collection object/array:

```php
$users = collect([
    ['name' => 'Budi'],
    ['name' => 'Andi'],
]);

$result =
    $users->implode(
        'name',
        ', '
    );
```

Hasil:

```text
Budi, Andi
```

## `join()`

```php
$result =
    collect([
        'A',
        'B',
        'C'
    ])->join(
        ', ',
        ' dan '
    );
```

Hasil:

```text
A, B dan C
```

**Hafalan:**

```text
implode
→ gabungkan value menjadi string

join
→ gabungkan dengan separator + final separator
```

---

# 11. Filtering

Filtering digunakan untuk mengambil item yang memenuhi kondisi.

## `filter()`

```php
$numbers =
    collect([
        1, 2, 3, 4, 5
    ]);

$result =
    $numbers->filter(
        fn ($number) =>
            $number % 2 === 0
    );
```

Hasil:

```text
[2, 4]
```

Tanpa callback:

```php
collect([
    0,
    1,
    false,
    true,
    null,
    'Hello'
])->filter();
```

Akan menghapus nilai falsy.

## `reject()`

Kebalikan dari `filter()`:

```php
$result =
    collect([
        1, 2, 3, 4
    ])->reject(
        fn ($number) =>
            $number % 2 === 0
    );
```

Hasil:

```text
[1, 3]
```

## `where()`

```php
$users = collect([
    ['name' => 'Budi', 'age' => 20],
    ['name' => 'Andi', 'age' => 17],
]);

$result =
    $users->where(
        'age',
        20
    );
```

## `whereIn()`

```php
$result =
    $users->whereIn(
        'age',
        [17, 20]
    );
```

## `whereNotNull()`

```php
$result =
    $users->whereNotNull(
        'email'
    );
```

## `unique()`

Menghapus duplikat:

```php
$result =
    collect([
        1, 1, 2, 2, 3
    ])->unique();
```

Hasil:

```text
[1, 2, 3]
```

**Hafalan:**

```text
filter
→ ambil yang cocok

reject
→ buang yang cocok

where
→ filter berdasarkan key

unique
→ hapus duplikat
```

---

# 12. Partitioning

`partition()` membagi collection menjadi dua bagian berdasarkan kondisi.

```php
$numbers =
    collect([
        1, 2, 3, 4, 5
    ]);

[$even, $odd] =
    $numbers->partition(
        fn ($number) =>
            $number % 2 === 0
    );
```

Hasil:

```text
$even
→ [2, 4]

$odd
→ [1, 3, 5]
```

Contoh user:

```php
[$active, $inactive] =
    $users->partition(
        fn ($user) =>
            $user['active']
    );
```

**Hafalan:**

```text
partition
→ satu collection
→ jadi dua collection
→ true / false
```

---

# 13. Testing

Collection memiliki method untuk mengecek kondisi.

## `contains()`

```php
$hasTwo =
    collect([1, 2, 3])
        ->contains(2);
```

Hasil:

```text
true
```

## `contains()` callback

```php
$result =
    collect([1, 2, 3])
        ->contains(
            fn ($number) =>
                $number > 2
        );
```

## `every()`

Semua item harus memenuhi kondisi:

```php
$result =
    collect([2, 4, 6])
        ->every(
            fn ($number) =>
                $number % 2 === 0
        );
```

Hasil:

```text
true
```

## `some()`

Minimal ada item yang memenuhi kondisi:

```php
$result =
    collect([1, 2, 3])
        ->some(
            fn ($number) =>
                $number > 2
        );
```

## `doesntContain()`

```php
$result =
    collect([1, 2, 3])
        ->doesntContain(5);
```

## `containsStrict()`

Mengecek menggunakan strict comparison:

```php
$result =
    collect([1, 2, 3])
        ->containsStrict(2);
```

**Hafalan:**

```text
contains
→ ada?

every
→ semuanya?

some
→ ada minimal satu?

doesntContain
→ tidak ada?
```

---

# 14. Grouping

## `groupBy()`

```php
$users = collect([
    [
        'name' => 'Budi',
        'department' => 'IT'
    ],
    [
        'name' => 'Andi',
        'department' => 'HR'
    ],
    [
        'name' => 'Citra',
        'department' => 'IT'
    ],
]);

$result =
    $users->groupBy(
        'department'
    );
```

Hasil konsep:

```text
IT
→ Budi
→ Citra

HR
→ Andi
```

## Callback

```php
$result =
    $users->groupBy(
        fn ($user) =>
            $user['department']
    );
```

## `keyBy()`

Berbeda dengan `groupBy()`.

```php
$result =
    $users->keyBy('name');
```

Hasil:

```php
[
    'Budi' => [...],
    'Andi' => [...],
    'Citra' => [...],
]
```

Perbedaan:

```text
groupBy
→ satu key dapat memiliki banyak item

keyBy
→ satu key mewakili satu item
```

**Hafalan:**

```text
groupBy
→ kelompokkan

keyBy
→ jadikan key
```

---

# 15. Slicing

Slicing mengambil sebagian collection.

## `slice()`

```php
$result =
    collect([
        'A',
        'B',
        'C',
        'D'
    ])->slice(1);
```

Hasil:

```text
[B, C, D]
```

Dengan length:

```php
$result =
    collect([
        'A',
        'B',
        'C',
        'D'
    ])->slice(1, 2);
```

Hasil:

```text
[B, C]
```

## `splice()`

Berbeda dengan `slice()`, `splice()` menghapus bagian yang diambil dari collection asli.

```php
$items = collect([
    'A',
    'B',
    'C',
    'D'
]);

$result =
    $items->splice(1, 2);
```

`$result`:

```text
[B, C]
```

`$items` sekarang:

```text
[A, D]
```

**Hafalan:**

```text
slice
→ ambil bagian

splice
→ ambil + hapus dari collection asli
```

---

# 16. Take dan Skip

## `take()`

Ambil sejumlah item dari depan:

```php
$result =
    collect([
        1, 2, 3, 4, 5
    ])->take(3);
```

Hasil:

```text
[1, 2, 3]
```

## `take(-2)`

Ambil dari belakang:

```php
$result =
    collect([
        1, 2, 3, 4, 5
    ])->take(-2);
```

Hasil:

```text
[4, 5]
```

## `skip()`

Lewati sejumlah item dari depan:

```php
$result =
    collect([
        1, 2, 3, 4, 5
    ])->skip(2);
```

Hasil:

```text
[3, 4, 5]
```

## `skipUntil()`

```php
$result =
    collect([
        1, 2, 3, 4
    ])->skipUntil(
        fn ($number) =>
            $number >= 3
    );
```

Hasil:

```text
[3, 4]
```

## `skipWhile()`

```php
$result =
    collect([
        1, 2, 3, 4
    ])->skipWhile(
        fn ($number) =>
            $number < 3
    );
```

Hasil:

```text
[3, 4]
```

**Hafalan:**

```text
take
→ ambil

skip
→ lewati

takeUntil
→ ambil sampai kondisi

skipUntil
→ lewati sampai kondisi

skipWhile
→ lewati selama kondisi benar
```

---

# 17. Chunked

## `chunk()`

Membagi collection menjadi beberapa kelompok dengan ukuran tertentu.

```php
$result =
    collect([
        1, 2, 3, 4, 5
    ])->chunk(2);
```

Hasil konsep:

```text
[
    [1, 2],
    [3, 4],
    [5]
]
```

Sangat berguna untuk:

```text
pagination-like processing
batch processing
grid UI
pemrosesan data bertahap
```

Contoh:

```php
collect($users)
    ->chunk(100)
    ->each(
        function ($users) {
            // proses maksimal 100 user
        }
    );
```

**Hafalan:**

```text
chunk(100)
→ pecah menjadi kelompok berisi maksimal 100 item
```

---

# 18. Retrieve

Method retrieve digunakan untuk mengambil data dari collection.

## `first()`

```php
$result =
    collect([
        1, 2, 3
    ])->first();
```

Hasil:

```text
1
```

## `last()`

```php
$result =
    collect([
        1, 2, 3
    ])->last();
```

Hasil:

```text
3
```

## `firstWhere()`

```php
$user =
    collect([
        [
            'name' => 'Budi',
            'active' => true
        ],
        [
            'name' => 'Andi',
            'active' => false
        ],
    ])->firstWhere(
        'active',
        true
    );
```

## `get()`

```php
$result =
    collect([
        'name' => 'Budi'
    ])->get('name');
```

Default:

```php
$result =
    collect([])
        ->get(
            'name',
            'Guest'
        );
```

## `value()`

```php
$name =
    collect([
        [
            'name' => 'Budi',
            'age' => 20
        ]
    ])->value('name');
```

## `pluck()`

```php
$names =
    collect([
        ['name' => 'Budi'],
        ['name' => 'Andi'],
    ])->pluck('name');
```

Hasil:

```text
[Budi, Andi]
```

Dengan key:

```php
$result =
    $users->pluck(
        'name',
        'id'
    );
```

**Hafalan:**

```text
first
→ item pertama

last
→ item terakhir

get
→ ambil berdasarkan key

value
→ satu value berdasarkan key

pluck
→ ambil field tertentu
```

---

# 19. Random

Mengambil item secara acak:

```php
$item =
    collect([
        'A',
        'B',
        'C'
    ])->random();
```

Mengambil beberapa:

```php
$items =
    collect([
        'A',
        'B',
        'C',
        'D'
    ])->random(2);
```

Callback:

```php
$item =
    collect([
        1, 2, 3, 4
    ])->random(
        fn ($collection) =>
            $collection->count() >= 2
                ? 2
                : 1
    );
```

> `random()` memilih secara acak; jangan gunakan untuk kebutuhan keamanan/cryptographic randomness.

**Hafalan:**

```text
random()
→ ambil item acak
```

---

# 20. Checking Existence

## `isEmpty()`

```php
collect([])->isEmpty();
```

Hasil:

```text
true
```

## `isNotEmpty()`

```php
collect([1])->isNotEmpty();
```

Hasil:

```text
true
```

## `contains()`

```php
collect([1, 2, 3])
    ->contains(2);
```

## `has()`

Mengecek key:

```php
collect([
    'name' => 'Budi'
])->has('name');
```

## `hasAny()`

```php
collect([
    'name' => 'Budi'
])->hasAny([
    'name',
    'email'
]);
```

## `missing()`

```php
collect([
    'name' => 'Budi'
])->missing('email');
```

## `containsStrict()`

```php
collect([1, 2, 3])
    ->containsStrict(2);
```

**Hafalan:**

```text
isEmpty
→ kosong?

isNotEmpty
→ tidak kosong?

has
→ punya key?

missing
→ key tidak ada?

contains
→ punya value?
```

---

# 21. Ordering

## `sort()`

```php
$result =
    collect([3, 1, 2])
        ->sort();
```

Hasil:

```text
[1, 2, 3]
```

## `sortDesc()`

```php
$result =
    collect([3, 1, 2])
        ->sortDesc();
```

Hasil:

```text
[3, 2, 1]
```

## `sortBy()`

```php
$users =
    collect([
        ['name' => 'Budi', 'age' => 30],
        ['name' => 'Andi', 'age' => 20],
    ]);

$result =
    $users->sortBy('age');
```

## `sortByDesc()`

```php
$result =
    $users->sortByDesc('age');
```

## `sortBy()` callback

```php
$result =
    $users->sortBy(
        fn ($user) =>
            $user['age']
    );
```

## `reverse()`

```php
$result =
    collect([1, 2, 3])
        ->reverse();
```

## `sortKeys()`

```php
$result =
    collect([
        'b' => 2,
        'a' => 1,
    ])->sortKeys();
```

**Catatan penting:**

Method sorting dapat mempertahankan key. Jika ingin index numerik berurutan:

```php
$result =
    $collection
        ->sort()
        ->values();
```

**Hafalan:**

```text
sort
→ sort value ascending

sortDesc
→ descending

sortBy
→ sort berdasarkan field/callback

sortByDesc
→ descending berdasarkan field/callback

values
→ reset key/index
```

---

# 22. Aggregate

Aggregate berarti menghitung atau merangkum banyak data menjadi hasil.

## `count()`

```php
$count =
    collect([1, 2, 3])
        ->count();
```

## `sum()`

```php
$total =
    collect([10, 20, 30])
        ->sum();
```

Hasil:

```text
60
```

Dengan key:

```php
$total =
    $users->sum('salary');
```

## `avg()`

```php
$average =
    collect([10, 20, 30])
        ->avg();
```

Hasil:

```text
20
```

## `min()`

```php
$min =
    collect([10, 20, 30])
        ->min();
```

## `max()`

```php
$max =
    collect([10, 20, 30])
        ->max();
```

## `median()`

```php
$median =
    collect([10, 20, 30])
        ->median();
```

## `mode()`

```php
$mode =
    collect([1, 1, 2, 3])
        ->mode();
```

**Hafalan:**

```text
count
→ jumlah

sum
→ total

avg
→ rata-rata

min
→ terkecil

max
→ terbesar

median
→ nilai tengah

mode
→ nilai paling sering muncul
```

---

# 23. Reduce

`reduce()` digunakan untuk mengubah banyak item menjadi satu nilai menggunakan accumulator.

Contoh jumlah:

```php
$total =
    collect([
        1, 2, 3, 4
    ])->reduce(
        function (
            $carry,
            $number
        ) {
            return $carry + $number;
        },
        0
    );
```

Hasil:

```text
10
```

Arrow function:

```php
$total =
    collect([
        1, 2, 3, 4
    ])->reduce(
        fn ($carry, $number) =>
            $carry + $number,
        0
    );
```

## Contoh perkalian

```php
$result =
    collect([
        2, 3, 4
    ])->reduce(
        fn ($carry, $number) =>
            $carry * $number,
        1
    );
```

Hasil:

```text
24
```

## Konsep

```text
[1, 2, 3, 4]

carry = 0

0 + 1 = 1
1 + 2 = 3
3 + 3 = 6
6 + 4 = 10
```

**Hafalan:**

```text
reduce
→ banyak item
→ satu hasil
→ carry/accumulator
```

---

# 24. Method Lainnya

Berikut beberapa method Collection yang sangat berguna.

## `values()`

Reset key:

```php
$result =
    collect([
        2 => 'B',
        5 => 'C'
    ])->values();
```

Hasil:

```php
[
    0 => 'B',
    1 => 'C',
]
```

## `keys()`

```php
$keys =
    collect([
        'name' => 'Budi',
        'age' => 20
    ])->keys();
```

## `flip()`

Key menjadi value dan value menjadi key:

```php
$result =
    collect([
        'a' => 1,
        'b' => 2
    ])->flip();
```

## `except()`

```php
$result =
    collect([
        'name' => 'Budi',
        'age' => 20
    ])->except([
        'age'
    ]);
```

## `only()`

```php
$result =
    collect([
        'name' => 'Budi',
        'age' => 20
    ])->only([
        'name'
    ]);
```

## `collapse()`

Menggabungkan array level pertama:

```php
$result =
    collect([
        [1, 2],
        [3, 4],
    ])->collapse();
```

Hasil:

```text
[1, 2, 3, 4]
```

## `crossJoin()`

Membuat kombinasi:

```php
$result =
    collect([
        1, 2
    ])->crossJoin([
        'a', 'b'
    ]);
```

Hasil konsep:

```text
[
    [1, a],
    [1, b],
    [2, a],
    [2, b]
]
```

## `diff()`

```php
$result =
    collect([1, 2, 3])
        ->diff([2, 3]);
```

Hasil:

```text
[1]
```

## `intersect()`

```php
$result =
    collect([1, 2, 3])
        ->intersect([2, 3, 4]);
```

Hasil:

```text
[2, 3]
```

## `except()`

Menghapus berdasarkan key:

```php
collect([
    'name' => 'Budi',
    'age' => 20,
])->except('age');
```

## `tap()`

Melakukan sesuatu tanpa mengubah alur collection:

```php
$result =
    collect([1, 2, 3])
        ->tap(
            function ($collection) {
                logger(
                    $collection->all()
                );
            }
        )
        ->map(
            fn ($number) =>
                $number * 2
        );
```

## `pipe()`

Mengirim collection ke callback dan mengembalikan hasil callback:

```php
$result =
    collect([1, 2, 3])
        ->pipe(
            fn ($collection) =>
                $collection->sum()
        );
```

Hasil:

```text
6
```

## `when()`

Jalankan callback jika kondisi benar:

```php
$result =
    collect([1, 2, 3])
        ->when(
            $isAdmin,
            fn ($collection) =>
                $collection->push(4)
        );
```

## `unless()`

Kebalikan konsep `when()`:

```php
$result =
    collect([1, 2, 3])
        ->unless(
            $isAdmin,
            fn ($collection) =>
                $collection->filter(
                    fn ($number) =>
                        $number > 1
                )
        );
```

## `unlessEmpty()`

Jalankan callback jika collection tidak kosong:

```php
collect([1, 2, 3])
    ->unlessEmpty(
        fn ($collection) => dump(
            $collection->all()
        )
    );
```

## `whenEmpty()`

Jalankan callback jika kosong:

```php
collect([])
    ->whenEmpty(
        fn ($collection) =>
            $collection->push('Default')
    );
```

**Hafalan:**

```text
values
→ reset key

keys
→ ambil key

only
→ pilih key

except
→ kecualikan key

tap
→ inspeksi tanpa mengubah alur

pipe
→ ubah collection menjadi hasil callback

when
→ kondisi true

unless
→ kondisi false
```

---

# 25. Lazy Collection

`LazyCollection` digunakan untuk memproses data secara lazy sehingga tidak perlu memuat seluruh data ke memory sekaligus.

Class:

```php
Illuminate\Support\LazyCollection
```

Import:

```php
use Illuminate\Support\LazyCollection;
```

## `lazy()`

Collection biasa dapat diubah menjadi lazy:

```php
$lazy =
    collect(range(1, 1000000))
        ->lazy();
```

Namun perlu diingat: `range()` sendiri sudah membuat array besar terlebih dahulu.

## `LazyCollection::make()`

Lebih tepat untuk sumber data generator:

```php
$lazy =
    LazyCollection::make(
        function () {
            for (
                $i = 1;
                $i <= 1000000;
                $i++
            ) {
                yield $i;
            }
        }
    );
```

Data diproses ketika diperlukan.

Contoh:

```php
$result =
    LazyCollection::make(
        function () {
            for (
                $i = 1;
                $i <= 1000000;
                $i++
            ) {
                yield $i;
            }
        }
    )
    ->filter(
        fn ($number) =>
            $number % 2 === 0
    )
    ->take(5)
    ->all();
```

Hasil:

```text
[2, 4, 6, 8, 10]
```

## `cursor()`

Pada Eloquent, `cursor()` dapat digunakan untuk memproses hasil query secara lazy.

Contoh:

```php
foreach (
    User::cursor()
    as $user
) {
    // proses satu per satu
}
```

Konsep:

```text
Collection
→ data sudah tersedia di memory

LazyCollection
→ data dihasilkan saat diperlukan
```

## Kapan menggunakan Lazy Collection?

Gunakan ketika:

```text
data sangat besar
file besar
jutaan record
streaming data
memory harus hemat
```

**Hafalan:**

```text
Collection
→ eager

LazyCollection
→ lazy / on demand
```

---

# 26. Cheat Flow Collection

Saat mendapatkan array/data, pikirkan:

```text
DATA
 ↓
collect()
 ↓
FILTER?
 ↓
MAP?
 ↓
GROUP?
 ↓
SORT?
 ↓
TAKE / SKIP?
 ↓
AGGREGATE?
 ↓
RESULT
```

Contoh:

```php
$result =
    collect($users)
        ->filter(
            fn ($user) =>
                $user['active']
        )
        ->map(
            fn ($user) => [
                'name' =>
                    $user['name']
            ]
        )
        ->sortBy('name')
        ->values();
```

Alurnya:

```text
users
 ↓
filter active
 ↓
ambil/transform name
 ↓
sort name
 ↓
reset index
```

---

# 27. Tabel Ringkasan

| Materi | Method | Fungsi |
|---|---|---|
| Membuat | `collect()` | Membuat Collection |
| Iterasi | `each()` | Menjalankan callback |
| Manipulasi | `push()` | Tambah item di akhir |
| Manipulasi | `prepend()` | Tambah item di awal |
| Manipulasi | `put()` | Set key/value |
| Manipulasi | `merge()` | Menggabungkan collection |
| Manipulasi | `concat()` | Menambahkan item |
| Mapping | `map()` | Transform setiap item |
| Mapping | `mapWithKeys()` | Transform key/value |
| Mapping | `mapInto()` | Transform menjadi object |
| Mapping | `mapSpread()` | Callback menerima item ter-spread |
| Zipping | `zip()` | Gabung berdasarkan posisi |
| Flatten | `flatten()` | Ratakan nested collection |
| Flatten | `flatMap()` | Map + flatten |
| String | `implode()` | Gabungkan menjadi string |
| String | `join()` | Gabungkan dengan separator |
| Filter | `filter()` | Ambil yang cocok |
| Filter | `reject()` | Buang yang cocok |
| Filter | `where()` | Filter berdasarkan key |
| Filter | `unique()` | Hapus duplikat |
| Partition | `partition()` | Bagi menjadi true/false |
| Testing | `contains()` | Cek value |
| Testing | `every()` | Semua memenuhi kondisi |
| Testing | `some()` | Minimal satu memenuhi |
| Grouping | `groupBy()` | Kelompokkan |
| Grouping | `keyBy()` | Jadikan field sebagai key |
| Slicing | `slice()` | Ambil sebagian |
| Slicing | `splice()` | Ambil + hapus |
| Take | `take()` | Ambil sejumlah item |
| Skip | `skip()` | Lewati sejumlah item |
| Chunk | `chunk()` | Bagi menjadi batch |
| Retrieve | `first()` | Item pertama |
| Retrieve | `last()` | Item terakhir |
| Retrieve | `get()` | Ambil berdasarkan key |
| Retrieve | `value()` | Ambil satu value |
| Retrieve | `pluck()` | Ambil field |
| Random | `random()` | Item acak |
| Existence | `isEmpty()` | Cek kosong |
| Existence | `isNotEmpty()` | Cek tidak kosong |
| Existence | `has()` | Cek key |
| Ordering | `sort()` | Sort value |
| Ordering | `sortDesc()` | Sort descending |
| Ordering | `sortBy()` | Sort berdasarkan key/callback |
| Ordering | `sortByDesc()` | Sort descending berdasarkan key/callback |
| Ordering | `values()` | Reset index |
| Aggregate | `count()` | Jumlah item |
| Aggregate | `sum()` | Total |
| Aggregate | `avg()` | Rata-rata |
| Aggregate | `min()` | Minimum |
| Aggregate | `max()` | Maximum |
| Aggregate | `median()` | Median |
| Aggregate | `mode()` | Mode |
| Reduce | `reduce()` | Banyak item → satu hasil |
| Utility | `keys()` | Ambil key |
| Utility | `flip()` | Tukar key/value |
| Utility | `collapse()` | Gabungkan nested array |
| Utility | `diff()` | Perbedaan |
| Utility | `intersect()` | Irisan |
| Utility | `tap()` | Side effect/inspeksi |
| Utility | `pipe()` | Kirim collection ke callback |
| Utility | `when()` | Kondisional |
| Utility | `unless()` | Kondisional kebalikan |
| Lazy | `lazy()` | Menjadi LazyCollection |
| Lazy | `cursor()` | Iterasi database secara lazy |

---

# 28. Cheat Code Collection 10 Detik

## Buat

```php
collect([
    1, 2, 3
]);
```

## Loop

```php
->each(
    fn ($item) => ...
)
```

## Transform

```php
->map(
    fn ($item) => ...
)
```

## Filter

```php
->filter(
    fn ($item) => ...
)
```

## Reject

```php
->reject(
    fn ($item) => ...
)
```

## Group

```php
->groupBy('category')
```

## Sort

```php
->sortBy('name')
```

## Sort Desc

```php
->sortByDesc('age')
```

## Unique

```php
->unique()
```

## Ambil Field

```php
->pluck('name')
```

## Ambil Pertama

```php
->first()
```

## Ambil Terakhir

```php
->last()
```

## Ambil N

```php
->take(5)
```

## Lewati N

```php
->skip(5)
```

## Pecah Batch

```php
->chunk(100)
```

## Jumlah

```php
->count()
```

## Total

```php
->sum()
```

## Rata-rata

```php
->avg()
```

## Minimum

```php
->min()
```

## Maximum

```php
->max()
```

## Ada?

```php
->contains($value)
```

## Kosong?

```php
->isEmpty()
```

## Tidak Kosong?

```php
->isNotEmpty()
```

## Reset Index

```php
->values()
```

## Gabungkan

```php
->merge($other)
```

## Ratakan

```php
->flatten()
```

## String

```php
->implode(', ')
```

## Reduce

```php
->reduce(
    fn ($carry, $item) =>
        $carry + $item,
    0
)
```

## Lazy

```php
LazyCollection::make(
    function () {
        yield ...;
    }
);
```

---

# 29. Referensi Resmi

- Laravel Collections  
  https://laravel.com/docs/collections

- Lazy Collections  
  https://laravel.com/docs/collections#lazy-collections

---

# Pola Belajar Collection

Urutan belajar yang disarankan:

```text
collect()
    ↓
each()
    ↓
map()
    ↓
filter()
    ↓
reject()
    ↓
pluck()
    ↓
groupBy()
    ↓
sortBy()
    ↓
take() / skip()
    ↓
chunk()
    ↓
first() / last()
    ↓
contains()
    ↓
count() / sum() / avg()
    ↓
reduce()
    ↓
method utility
    ↓
LazyCollection
```

## 5 Method yang Wajib Dihafal Dulu

Jika baru belajar Collection, fokus pertama pada:

```php
collect()
map()
filter()
pluck()
groupBy()
```

Kemudian:

```php
sortBy()
unique()
first()
count()
sum()
```

Lalu lanjut:

```php
reduce()
chunk()
partition()
flatten()
LazyCollection
```

## Mental Model Utama

Ingat pola:

```text
COLLECT
   ↓
MAP
   ↓
FILTER
   ↓
GROUP / SORT
   ↓
TAKE / SKIP
   ↓
AGGREGATE
   ↓
RESULT
```

Contoh lengkap:

```php
$total =
    collect($users)
        ->filter(
            fn ($user) =>
                $user['active']
        )
        ->map(
            fn ($user) =>
                $user['salary']
        )
        ->filter(
            fn ($salary) =>
                $salary > 5000000
        )
        ->sum();
```

Baca dari atas ke bawah:

```text
users
 ↓
hanya active
 ↓
ambil salary
 ↓
salary > 5 juta
 ↓
jumlahkan
 ↓
$total
```

> **Kunci Collection:** jangan menghafal semua method sekaligus. Pahami dulu pola **collect → transform → filter → organize → retrieve → aggregate**. Setelah pola ini kuat, method Collection lainnya akan jauh lebih mudah dipahami.
