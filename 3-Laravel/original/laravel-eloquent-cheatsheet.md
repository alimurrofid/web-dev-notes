# Laravel Eloquent Cheatsheet Revised

> **Target:** developer yang sudah memahami Laravel Dasar,
> database/migration, dan konsep Collection.
>
> Tujuan: memahami **Model → Query → CRUD → Mass Assignment →
> Relationships → Loading → Scopes → Casts → Serialization → Factory**.
>
> Eloquent bukan sekadar "SQL versi PHP". Eloquent memetakan record
> database menjadi object model dan menyediakan relationship serta
> behavior model.

## Mental Model

```text
Eloquent Model
      ↓
Query Builder
      ↓
SQL
      ↓
Database
```

Ketika query menghasilkan banyak model:

```text
get()
 ↓
Eloquent Collection
 ↓
map / filter / sort / ...
```

## Cara Belajar
```text
🟢 Fundamental
Model, CRUD, query, mass assignment, timestamps

🟡 Core Eloquent
Relationships, eager loading, scopes, soft delete, casts

🔴 Advanced
Polymorphic relationships, custom casts, advanced relationship patterns
```

### Prasyarat

Sebelum belajar Eloquent, sebaiknya sudah paham:

```text
Laravel Route / Controller
Database & Migration
PHP Class / Object
Array & Collection
Basic SQL: SELECT / INSERT / UPDATE / DELETE
```

## Daftar Isi

### 🟢 Fundamental

1. [Model & Migration](#bagian-1)
2. [Insert](#bagian-2)
3. [Find / Select](#bagian-3)
4. [Update](#bagian-4)
5. [Delete](#bagian-5)
6. [Delete Many](#bagian-6)
7. [Fillable Attributes](#bagian-7)
8. [Timestamps](#bagian-8)
9. [Default Attribute Values](#bagian-9)
10. [Query Builder dari Model](#bagian-10)

### 🟡 Core Eloquent

11. [Soft Delete](#bagian-11)
12. [Query Scope](#bagian-12)
13. [Query Global Scope](#bagian-13)
14. [Query Local Scope](#bagian-14)
15. [Relationships](#bagian-15)
16. [One to One](#bagian-16)
17. [One to Many](#bagian-17)
18. [Many to Many](#bagian-18)
19. [Intermediate Table](#bagian-19)
20. [Pivot Model](#bagian-20)
21. [Querying Relations](#bagian-21)
22. [Aggregating Relations](#bagian-22)
23. [Lazy dan Eager Loading](#bagian-23)
24. [Eloquent Collection](#bagian-24)
25. [UUID](#bagian-25)
26. [Attribute Casting](#bagian-26)
27. [Accessors dan Mutators](#bagian-27)
28. [Serialization](#bagian-28)
29. [Factory](#bagian-29)

### 🔴 Advanced Relationships

30. [Has One of Many](#bagian-30)
31. [Has One Through](#bagian-31)
32. [Has Many Through](#bagian-32)
33. [Polymorphic Relationships](#bagian-33)
34. [One to One Polymorphic](#bagian-34)
35. [One to Many Polymorphic](#bagian-35)
36. [One of Many Polymorphic](#bagian-36)
37. [Many to Many Polymorphic](#bagian-37)
38. [Polymorphic Types](#bagian-38)
39. [Custom Casts](#bagian-39)

### 🛠️ Praktik & Ringkasan

40. [Mini Project](#bagian-40)
41. [Peta Ingatan Eloquent](#bagian-41)
42. [Tabel Ringkasan](#bagian-42)
43. [Cheat Code Eloquent 10 Detik](#bagian-43)
44. [Urutan Belajar yang Disarankan](#bagian-44)
45. [Referensi Resmi](#bagian-45)
<a id="bagian-1"></a>

# 1. 🟢 Model & Migration

Buat model:

```bash
php artisan make:model Product
```

Model sederhana:

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    // ...
}
```

Jika model `Product` digunakan tanpa konfigurasi tambahan, Eloquent
secara konvensi akan mencari tabel `products`.

Custom table:

```php
class Product extends Model
{
    protected $table = 'barang';
}
```

Custom primary key:

```php
protected $primaryKey = 'product_code';
```

**Hafalan:**

```text
Product model → products table
snake_case + plural → convention table
```

------------------------------------------------------------------------

<a id="bagian-2"></a>

# 2. 🟢 Insert

Ada beberapa cara umum untuk memasukkan data.

## `create()`

```php
$product = Product::create([
    'name' => 'Keyboard',
    'price' => 500000,
]);
```

Model harus mengizinkan attribute tersebut melalui mass assignment
configuration seperti `$fillable` atau `$guarded`.

## `save()`

```php
$product = new Product();
$product->name = 'Mouse';
$product->price = 200000;
$product->save();
```

## `forceCreate()`

```php
$product = Product::forceCreate([
    'name' => 'Monitor',
    'price' => 2500000,
]);
```

`forceCreate()` melewati perlindungan mass assignment, sehingga gunakan
dengan hati-hati.

**Hafalan:**

```text
new Model + save() → object dulu
Model::create()    → array langsung
```

------------------------------------------------------------------------

<a id="bagian-3"></a>

# 3. 🟢 Find / Select

## `find()`

```php
$product = Product::find(1);
```

Jika tidak ditemukan:

```php
$product = Product::find(999);

// null
```

## `findOrFail()`

```php
$product = Product::findOrFail(1);
```

Jika tidak ditemukan, Laravel melempar `ModelNotFoundException` yang
biasanya diterjemahkan menjadi response 404 oleh framework.

## `findMany()`

```php
$products = Product::findMany([1, 2, 3]);
```

**Hafalan:**

```text
find       → bisa null
findOrFail → gagal jika tidak ada
findMany   → banyak ID
```

------------------------------------------------------------------------

<a id="bagian-4"></a>

# 4. 🟢 Update

## Update object

```php
$product = Product::find(1);
$product->price = 750000;
$product->save();
```

## `update()`

```php
$product->update([
    'price' => 750000,
]);
```

## `increment()` / `decrement()`

```php
$product->increment('stock');
$product->decrement('stock', 2);
```

**Hafalan:**

```text
ambil model → ubah → save()
atau
model->update([...])
```

------------------------------------------------------------------------

<a id="bagian-5"></a>

# 5. 🟢 Delete

## Hapus model

```php
$product = Product::find(1);
$product->delete();
```

## Hapus berdasarkan ID

```php
Product::destroy(1);
```

Banyak ID:

```php
Product::destroy([1, 2, 3]);
```

**Hafalan:**

```text
delete()  → dari object
 destroy() → berdasarkan ID
```

------------------------------------------------------------------------

<a id="bagian-6"></a>

# 6. 🟢 Delete Many

Hapus banyak row berdasarkan kondisi:

```php
$count = Product::where('status', 'inactive')->delete();
```

Hapus semua:

```php
Product::query()->delete();
```

**Catatan:** jika model menggunakan Soft Delete, `delete()` biasanya
melakukan soft delete, bukan menghapus row secara permanen.

**Hafalan:**

```text
where(...) -> delete()
= delete banyak row
```

------------------------------------------------------------------------

<a id="bagian-7"></a>

# 7. 🟢 Fillable Attributes

Mass assignment terjadi ketika array attribute dimasukkan sekaligus:

```php
Product::create([
    'name' => 'Mouse',
    'price' => 200000,
]);
```

Izinkan field tertentu dengan `$fillable`:

```php
class Product extends Model
{
    protected $fillable = [
        'name',
        'price',
    ];
}
```

Alternatif `$guarded`:

```php
protected $guarded = [
    'id',
];
```

**Hafalan:**

```text
fillable = field yang BOLEH di-mass assign
```

------------------------------------------------------------------------

<a id="bagian-8"></a>

# 8. 🟢 Timestamps

Secara default Eloquent mengelola:

```text
created_at
updated_at
```

Contoh:

```php
$product = Product::create([
    'name' => 'Keyboard',
]);
```

Eloquent akan mengisi timestamp jika fitur timestamps aktif.

Nonaktifkan:

```php
class Product extends Model
{
    public $timestamps = false;
}
```

Custom nama timestamp:

```php
const CREATED_AT = 'created_on';
const UPDATED_AT = 'updated_on';
```

**Hafalan:**

```text
created_at → kapan dibuat
updated_at → kapan terakhir diubah
```

------------------------------------------------------------------------

<a id="bagian-9"></a>

# 9. 🟢 Default Attribute Values

Gunakan `$attributes` untuk nilai default model.

```php
class Product extends Model
{
    protected $attributes = [
        'status' => 'draft',
        'stock' => 0,
    ];
}
```

Contoh:

```php
$product = new Product();

echo $product->status;
```

Output:

```text
draft
```

**Hafalan:**

```text
$attributes = default value model
```

------------------------------------------------------------------------

<a id="bagian-10"></a>

# 10. 🟢 Query Builder dari Model

Eloquent menyediakan query builder melalui model.

```php
$products = Product::query()
    ->where('price', '>', 100000)
    ->orderBy('name')
    ->get();
```

Beberapa method penting:

```php
Product::query()->where(...)->get();
Product::query()->first();
Product::query()->count();
Product::query()->exists();
Product::query()->latest()->get();
```

Query builder menggunakan pola method chaining.

```text
query()
  ↓
where()
  ↓
orderBy()
  ↓
get()
```

**Hafalan:**

```text
query = susun query
get   = eksekusi dan ambil collection
first = ambil satu model
```

------------------------------------------------------------------------

<a id="bagian-11"></a>

# 11. 🟡 Soft Delete

Soft delete tidak menghapus row secara fisik. Laravel mengisi
`deleted_at`.

Migration:

```php
$table->softDeletes();
```

Model:

```php
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;
}
```

Delete:

```php
$product->delete();
```

Data soft deleted otomatis tidak muncul pada query Eloquent biasa.

Ambil termasuk deleted:

```php
Product::withTrashed()->get();
```

Hanya deleted:

```php
Product::onlyTrashed()->get();
```

Restore:

```php
$product->restore();
```

Hapus permanen:

```php
$product->forceDelete();
```

**Hafalan:**

```text
delete()      → tandai deleted_at
withTrashed() → termasuk deleted
onlyTrashed() → hanya deleted
restore()     → pulihkan
forceDelete() → hapus permanen
```

------------------------------------------------------------------------

<a id="bagian-12"></a>

# 12. 🟡 Query Scope

Scope adalah cara membuat query reusable.

Contoh tujuan:

```text
Product::active()
Product::expensive()
Product::published()
```

Laravel menyediakan **global scope** dan **local scope**. Local scope
digunakan untuk query yang ingin dipanggil secara eksplisit, sedangkan
global scope diterapkan ke query model secara otomatis.

**Hafalan:**

```text
Scope = query yang bisa dipakai ulang
```

------------------------------------------------------------------------

<a id="bagian-13"></a>

# 13. 🟡 Query Global Scope

Global scope otomatis ditambahkan ke query model.

Contoh:

```php
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class ActiveScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $builder->where('status', 'active');
    }
}
```

Daftarkan di model:

```php
protected static function booted(): void
{
    static::addGlobalScope(new ActiveScope);
}
```

Sekarang:

```php
Product::all();
```

secara konsep menjadi:

```sql
select * from products where status = 'active'
```

Hapus global scope tertentu:

```php
Product::withoutGlobalScope(ActiveScope::class)->get();
```

**Hafalan:**

```text
Global Scope = selalu ikut query
withoutGlobalScope() = matikan scope tertentu
```

------------------------------------------------------------------------

<a id="bagian-14"></a>

# 14. 🟡 Query Local Scope

Local scope dipanggil secara eksplisit.

Laravel modern menggunakan method dengan prefix `scope`.

```php
use Illuminate\Database\Eloquent\Builder;

public function scopeActive(Builder $query): void
{
    $query->where('status', 'active');
}
```

Gunakan:

```php
$products = Product::active()->get();
```

Dengan parameter:

```php
public function scopePriceAbove(Builder $query, int $price): void
{
    $query->where('price', '>', $price);
}
```

Gunakan:

```php
Product::priceAbove(500000)->get();
```

**Hafalan:**

```text
scopeActive() → dipanggil sebagai active()
scopePriceAbove($x) → priceAbove($x)
```

------------------------------------------------------------------------

<a id="bagian-15"></a>

# 15. 🟡 Relationships

Relationship menghubungkan model berdasarkan foreign key.

Jenis penting:

```text
One to One
One to Many
Many to Many
Has One Through
Has Many Through
Polymorphic
```

Relationship didefinisikan sebagai method pada model dan relationship
tersebut juga dapat digunakan sebagai query builder.

Diagram:

```text
User
 │
 ├── hasOne → Phone
 ├── hasMany → Post
 └── belongsToMany → Role
```

**Hafalan:**

```text
hasOne        → punya satu
hasMany       → punya banyak
belongsTo     → dimiliki oleh
belongsToMany → punya banyak lewat pivot
```

------------------------------------------------------------------------

<a id="bagian-16"></a>

# 16. 🟡 One to One

Contoh:

```text
users
phones
```

`phones.user_id` mengarah ke `users.id`.

Model `User`:

```php
use Illuminate\Database\Eloquent\Relations\HasOne;

public function phone(): HasOne
{
    return $this->hasOne(Phone::class);
}
```

Model `Phone`:

```php
use Illuminate\Database\Eloquent\Relations\BelongsTo;

public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}
```

Gunakan:

```php
$user = User::find(1);

echo $user->phone->number;
```

**Hafalan:**

```text
User → hasOne Phone
Phone → belongsTo User
```

------------------------------------------------------------------------

<a id="bagian-17"></a>

# 17. 🟡 One to Many

Contoh:

```text
users
posts
```

`posts.user_id` mengarah ke `users.id`.

User:

```php
use Illuminate\Database\Eloquent\Relations\HasMany;

public function posts(): HasMany
{
    return $this->hasMany(Post::class);
}
```

Post:

```php
use Illuminate\Database\Eloquent\Relations\BelongsTo;

public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}
```

Gunakan:

```php
$user = User::find(1);

foreach ($user->posts as $post) {
    echo $post->title;
}
```

**Hafalan:**

```text
User 1 → banyak Post
Post   → belongsTo User
```

------------------------------------------------------------------------

<a id="bagian-18"></a>

# 18. 🟡 Many to Many

Contoh:

```text
users
roles
role_user
```

User:

```php
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

public function roles(): BelongsToMany
{
    return $this->belongsToMany(Role::class);
}
```

Role:

```php
public function users(): BelongsToMany
{
    return $this->belongsToMany(User::class);
}
```

Gunakan:

```php
$user->roles;
```

Tambahkan role:

```php
$user->roles()->attach($roleId);
```

Lepas role:

```php
$user->roles()->detach($roleId);
```

Sinkronisasi:

```php
$user->roles()->sync([1, 2, 3]);
```

Laravel mendefinisikan many-to-many melalui tabel intermediate/pivot.

**Hafalan:**

```text
User ↔ Role
     │
   pivot
```

------------------------------------------------------------------------

<a id="bagian-19"></a>

# 19. 🟡 Intermediate Table

Intermediate table untuk many-to-many biasanya disebut **pivot table**.

Contoh:

```text
users
roles
role_user
```

Isi `role_user`:

```text
user_id
role_id
```

Ambil kolom pivot:

```php
$user->roles()->withPivot('expires_at')->get();
```

Akses:

```php
echo $role->pivot->expires_at;
```

Tambahkan data pivot saat attach:

```php
$user->roles()->attach($roleId, [
    'expires_at' => now()->addMonth(),
]);
```

**Hafalan:**

```text
pivot = data penghubung many-to-many
```

------------------------------------------------------------------------

<a id="bagian-20"></a>

# 20. 🟡 Pivot Model

Jika pivot membutuhkan behavior sendiri, gunakan custom pivot model.

```php
use Illuminate\Database\Eloquent\Relations\Pivot;

class RoleUser extends Pivot
{
    protected $table = 'role_user';
}
```

Gunakan pada relationship:

```php
public function roles(): BelongsToMany
{
    return $this->belongsToMany(Role::class)
        ->using(RoleUser::class);
}
```

Custom pivot model dapat memiliki behavior tambahan dan casts. Laravel
mendokumentasikan custom intermediate table models dengan `Pivot` atau
`MorphPivot` untuk polymorphic many-to-many.

**Hafalan:**

```text
pivot sederhana → pivot property
pivot kompleks  → Pivot model
```

------------------------------------------------------------------------

<a id="bagian-21"></a>

# 21. 🟡 Querying Relations

## `has()`

Cari user yang punya post:

```php
$users = User::has('posts')->get();
```

## `whereHas()`

Cari user yang punya post dengan kondisi:

```php
$users = User::whereHas('posts', function ($query) {
    $query->where('published', true);
})->get();
```

## `doesntHave()`

```php
$users = User::doesntHave('posts')->get();
```

## `withWhereHas()`

Gabungkan filtering relation dan eager loading:

```php
$users = User::withWhereHas('posts', function ($query) {
    $query->where('published', true);
})->get();
```

## `whereRelation()`

```php
$users = User::whereRelation('posts', 'published', true)->get();
```

Relationship methods juga dapat dipakai sebagai query builder dengan
method chaining.

**Hafalan:**

```text
has         → punya relation
whereHas    → punya relation + kondisi
doesntHave  → tidak punya relation
```

------------------------------------------------------------------------

<a id="bagian-22"></a>

# 22. 🟡 Aggregating Relations

## `withCount()`

```php
$posts = Post::withCount('comments')->get();
```

Akses:

```php
echo $post->comments_count;
```

## `withSum()`

```php
$users = User::withSum('orders', 'amount')->get();
```

Akses:

```php
echo $user->orders_sum_amount;
```

## `withAvg()`

```php
Product::withAvg('reviews', 'rating')->get();
```

## `withExists()`

```php
Post::withExists('comments')->get();
```

## Alias

```php
Post::withCount([
    'comments as approved_comments_count' => function ($query) {
        $query->where('approved', true);
    },
])->get();
```

**Hafalan:**

```text
withCount → jumlah
withSum   → total
withAvg   → rata-rata
withExists → ada/tidak
```

------------------------------------------------------------------------

<a id="bagian-23"></a>

# 23. 🟡 Lazy dan Eager Loading

## Lazy Loading

Relationship baru diambil ketika diakses.

```php
$user = User::find(1);

foreach ($user->posts as $post) {
    echo $post->title;
}
```

Jika banyak user dan setiap loop mengakses `posts`, bisa muncul masalah
**N+1 query**.

## Eager Loading

Gunakan `with()`:

```php
$users = User::with('posts')->get();
```

Multiple:

```php
User::with(['posts', 'roles'])->get();
```

Nested:

```php
Book::with('author.contacts')->get();
```

Eager loading dapat mengurangi N+1 dengan memuat relationship secara
lebih efisien.

## Lazy Eager Loading

```php
$users = User::all();

$users->load('posts');
```

**Hafalan:**

```text
lazy  → saat diakses
with  → eager dari awal
load  → eager setelah model sudah diambil
```

------------------------------------------------------------------------

<a id="bagian-24"></a>

# 24. 🟡 Eloquent Collection

Hasil `get()` biasanya berupa `Illuminate\Database\Eloquent\Collection`.

```php
$products = Product::where('status', 'active')->get();
```

Beberapa operasi:

```php
$products->count();
$products->first();
$products->last();
$products->find(1);
$products->filter(...);
$products->map(...);
$products->pluck('name');
$products->sortBy('price');
```

Contoh:

```php
$names = Product::all()
    ->pluck('name');
```

`Eloquent Collection` memperluas collection Laravel dengan behavior yang
berkaitan dengan model Eloquent.

**Hafalan:**

```text
get() → Eloquent Collection
first() → satu model
pluck() → kumpulan satu attribute
```

------------------------------------------------------------------------

<a id="bagian-25"></a>

# 25. 🟡 UUID

UUID dapat digunakan sebagai primary key model.

Contoh migration:

```php
$table->uuid('id')->primary();
```

Model:

```php
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Product extends Model
{
    use HasUuids;
}
```

Dengan trait tersebut, Eloquent dapat menghasilkan UUID untuk model yang
menggunakannya.

Jika memakai ULID:

```php
use Illuminate\Database\Eloquent\Concerns\HasUlids;

class Product extends Model
{
    use HasUlids;
}
```

**Hafalan:**

```text
UUID → identifier unik berbentuk string
HasUuids → generate UUID untuk model
```

------------------------------------------------------------------------

<a id="bagian-26"></a>

# 26. 🟡 Attribute Casting

Casting mengubah attribute ke tipe tertentu ketika dibaca/ditulis.

Contoh:

```php
protected function casts(): array
{
    return [
        'is_active' => 'boolean',
        'stock' => 'integer',
        'price' => 'decimal:2',
        'published_at' => 'datetime',
        'options' => 'array',
    ];
}
```

Kemudian:

```php
$product->is_active;      // bool
$product->stock;          // int
$product->price;          // decimal string representation
$product->published_at;   // datetime object
$product->options;        // array
```

Contoh enum:

```php
protected function casts(): array
{
    return [
        'status' => ProductStatus::class,
    ];
}
```

**Hafalan:**

```text
casts = ubah bentuk attribute saat digunakan
```

------------------------------------------------------------------------

<a id="bagian-27"></a>

# 27. 🟡 Accessors dan Mutators

Cara modern menggunakan `Attribute`.

## Accessor

Accessor mengubah nilai ketika dibaca.

```php
use Illuminate\Database\Eloquent\Casts\Attribute;

protected function name(): Attribute
{
    return Attribute::make(
        get: fn (string $value) => strtoupper($value),
    );
}
```

Ketika:

```php
echo $product->name;
```

nilai akan diproses oleh accessor.

## Mutator

Mutator mengubah nilai ketika di-set.

```php
protected function name(): Attribute
{
    return Attribute::make(
        set: fn (string $value) => strtolower($value),
    );
}
```

**Hafalan:**

```text
get → baca → accessor
set → simpan → mutator
```

------------------------------------------------------------------------

<a id="bagian-28"></a>

# 28. 🟡 Serialization

Model Eloquent dapat diubah menjadi array atau JSON.

## `toArray()`

```php
$user = User::with('posts')->find(1);

$array = $user->toArray();
```

## `toJson()`

```php
$json = $user->toJson();
```

## Response JSON

Controller:

```php
return response()->json($user);
```

## Hide attribute

```php
protected $hidden = [
    'password',
    'remember_token',
];
```

## Visible attribute

```php
protected $visible = [
    'id',
    'name',
    'email',
];
```

## Append accessor

```php
protected $appends = [
    'full_name',
];
```

**Hafalan:**

```text
toArray() → array
toJson()  → JSON
hidden    → sembunyikan
visible   → tampilkan yang dipilih
appends   → tambahkan accessor
```

------------------------------------------------------------------------

<a id="bagian-29"></a>

# 29. 🟡 Factory

Factory digunakan untuk membuat data dummy/model dengan mudah.

Buat factory:

```bash
php artisan make:factory ProductFactory
```

Contoh:

```php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'price' => fake()->numberBetween(10000, 1000000),
            'status' => 'active',
        ];
    }
}
```

Pastikan model menggunakan factory trait:

```php
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;
}
```

Buat satu:

```php
$product = Product::factory()->create();
```

Buat banyak:

```php
Product::factory()->count(10)->create();
```

Buat tanpa menyimpan:

```php
$product = Product::factory()->make();
```

Factory juga dapat digunakan di seeder.

**Hafalan:**

```text
factory()->make()   → object, belum disimpan
factory()->create() → disimpan ke DB
count(10)           → 10 model
```

------------------------------------------------------------------------

<a id="bagian-30"></a>

# 30. 🔴 Has One of Many

Jika parent memiliki banyak record tetapi kita hanya ingin satu record
terbaik/terbaru.

Contoh `User` memiliki banyak `Order`, tetapi ingin order terbaru.

```php
use Illuminate\Database\Eloquent\Relations\HasOne;

public function latestOrder(): HasOne
{
    return $this->hasOne(Order::class)->latestOfMany();
}
```

Gunakan:

```php
$user->latestOrder;
```

Atau berdasarkan aggregate tertentu:

```php
public function largestOrder(): HasOne
{
    return $this->orders()->one()->ofMany('price', 'max');
}
```

**Hafalan:**

```text
hasMany + pilih satu
→ latestOfMany()
→ oldestOfMany()
→ ofMany()
```

------------------------------------------------------------------------

<a id="bagian-31"></a>

# 31. 🔴 Has One Through

Relasi satu melalui model perantara.

Contoh:

```text
Mechanic → Car → Owner
```

Mechanic:

```php
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

public function carOwner(): HasOneThrough
{
    return $this->hasOneThrough(Owner::class, Car::class);
}
```

Secara konsep:

```text
Mechanic
   │
   ▼
  Car
   │
   ▼
 Owner
```

**Hafalan:**

```text
hasOneThrough = satu model lewat satu model perantara
```

------------------------------------------------------------------------

<a id="bagian-32"></a>

# 32. 🔴 Has Many Through

Relasi banyak melalui model perantara.

Contoh:

```text
Country → User → Post
```

Country:

```php
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

public function posts(): HasManyThrough
{
    return $this->hasManyThrough(Post::class, User::class);
}
```

Gunakan:

```php
$country->posts;
```

**Hafalan:**

```text
hasManyThrough = banyak model lewat model perantara
```

------------------------------------------------------------------------

<a id="bagian-33"></a>

# 33. 🔴 Polymorphic Relationships

Polymorphic relation memungkinkan satu model dimiliki oleh beberapa tipe
model.

Contoh:

```text
Comment
 ├── Post
 └── Video
```

Tabel `comments`:

```text
id
commentable_id
commentable_type
body
```

Diagram:

```text
comments
   │
   ├── commentable_id
   └── commentable_type
             │
       ┌─────┴─────┐
       ▼           ▼
      Post        Video
```

**Hafalan:**

```text
polymorphic = satu relation → banyak jenis model
```

------------------------------------------------------------------------

<a id="bagian-34"></a>

# 34. 🔴 One to One Polymorphic

Contoh `Image` dapat dimiliki `User` atau `Post`.

Tabel `images`:

```text
imageable_id
imageable_type
```

User:

```php
public function image(): MorphOne
{
    return $this->morphOne(Image::class, 'imageable');
}
```

Image:

```php
public function imageable(): MorphTo
{
    return $this->morphTo();
}
```

Gunakan:

```php
$user->image;
$post->image;
$image->imageable;
```

**Hafalan:**

```text
morphOne() ↔ morphTo()
```

------------------------------------------------------------------------

<a id="bagian-35"></a>

# 35. 🔴 One to Many Polymorphic

Contoh `Comment` dapat dimiliki `Post` atau `Video`.

Post:

```php
public function comments(): MorphMany
{
    return $this->morphMany(Comment::class, 'commentable');
}
```

Comment:

```php
public function commentable(): MorphTo
{
    return $this->morphTo();
}
```

Gunakan:

```php
$post->comments;
$video->comments;
$comment->commentable;
```

**Hafalan:**

```text
morphMany() ↔ morphTo()
```

------------------------------------------------------------------------

<a id="bagian-36"></a>

# 36. 🔴 One of Many Polymorphic

Jika model polymorphic memiliki banyak related model tetapi ingin satu
yang terbaru:

```php
public function latestImage(): MorphOne
{
    return $this->morphOne(Image::class, 'imageable')
        ->latestOfMany();
}
```

Gunakan:

```php
$user->latestImage;
```

**Hafalan:**

```text
morphOne() + latestOfMany()
```

------------------------------------------------------------------------

<a id="bagian-37"></a>

# 37. 🔴 Many to Many Polymorphic

Contoh `Post` dan `Video` sama-sama dapat memiliki banyak `Tag`.

Tabel:

```text
posts
videos
tags
tagables
```

`tagables`:

```text
tag_id
tagable_id
tagable_type
```

Post:

```php
public function tags(): MorphToMany
{
    return $this->morphToMany(Tag::class, 'taggable');
}
```

Tag:

```php
public function posts(): MorphToMany
{
    return $this->morphedByMany(Post::class, 'taggable');
}
```

Video dapat memakai relationship yang sama dengan `morphToMany()`.

**Hafalan:**

```text
morphToMany()   → dari model ke tag
morphedByMany() → dari tag ke model tertentu
```

------------------------------------------------------------------------

<a id="bagian-38"></a>

# 38. 🔴 Polymorphic Types

Secara default, polymorphic type dapat menyimpan fully-qualified class
name.

Contoh:

```text
App\Models\Post
App\Models\Video
```

Agar database lebih stabil terhadap perubahan namespace/model, gunakan
morph map.

```php
use Illuminate\Database\Eloquent\Relations\Relation;

Relation::enforceMorphMap([
    'post' => Post::class,
    'video' => Video::class,
]);
```

Maka type yang disimpan dapat berupa:

```text
post
video
```

Laravel mendukung custom polymorphic types melalui morph map.

**Hafalan:**

```text
Morph Map
post  → Post::class
video → Video::class
```

------------------------------------------------------------------------

<a id="bagian-39"></a>

# 39. 🔴 Custom Casts

Custom cast digunakan ketika konversi attribute membutuhkan logic
sendiri.

Buat:

```bash
php artisan make:cast MoneyCast
```

Contoh sederhana:

```php
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class MoneyCast implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        return (int) $value;
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        return [$key => (int) $value];
    }
}
```

Daftarkan:

```php
protected function casts(): array
{
    return [
        'price' => MoneyCast::class,
    ];
}
```

**Hafalan:**

```text
Built-in cast → 'boolean', 'array', 'datetime', dll.
Custom cast   → class CastsAttributes
```

------------------------------------------------------------------------

<a id="bagian-40"></a>

# 40. 🛠️ Mini Project

## Product + Category + Order Item

Gunakan tiga level relationship:

```text
Category
   │
   └── hasMany
          ↓
       Product
          │
          └── belongsTo
                 ↓
              Category
```

Lalu:

```text
Order
  │
  └── hasMany
         ↓
      OrderItem
         │
         └── belongsTo
                ↓
             Product
```

Latihan bertahap:

```text
1. Buat migration
2. Buat model
3. Buat relationship
4. Insert data
5. Query Product
6. Query Category -> products
7. Eager load relationship
8. Filter / sort dengan Eloquent Collection
9. Tambahkan validation di controller
10. Buat feature test
```

**Tujuan:** bukan menghafal semua relationship, tetapi mampu menjawab:

```text
Data ini milik siapa?
Data ini mempunyai banyak apa?
Apakah query dilakukan di database atau di Collection?
Apakah relationship sudah di-load?
```

<a id="bagian-41"></a>

# 41. 🧠 Peta Ingatan Eloquent

```text
Model
→ representasi tabel

create()
→ insert dengan mass assignment

find()
→ ambil berdasarkan primary key

where()
→ filter query

get()
→ banyak model

first()
→ satu model / null

findOrFail()
→ satu model / 404 exception

update()
→ ubah

delete()
→ hapus / soft delete

belongsTo()
→ model ini milik parent

hasMany()
→ parent punya banyak child

belongsToMany()
→ many-to-many

with()
→ eager loading

whereHas()
→ filter berdasarkan relationship

withCount()
→ hitung relationship

scope...
→ reusable query

casts
→ ubah representasi attribute

toArray()/toJson()
→ serialization
```

<a id="bagian-42"></a>

# 42. 📚 Tabel Ringkasan

  Kebutuhan            API
  -------------------- -----------------------------
  Buat model           `make:model`
  Insert               `create()` / `save()`
  Find                 `find()` / `findOrFail()`
  Filter               `where()`
  Banyak model         `get()`
  Satu model           `first()`
  Update               `update()` / `save()`
  Delete               `delete()` / `destroy()`
  Mass assignment      `$fillable` / `$guarded`
  Soft delete          `SoftDeletes`
  One-to-one           `hasOne()` / `belongsTo()`
  One-to-many          `hasMany()` / `belongsTo()`
  Many-to-many         `belongsToMany()`
  Eager loading        `with()`
  Filter by relation   `whereHas()`
  Aggregate relation   `withCount()` / `withSum()`
  Scope                `scope...()`
  Cast                 `casts()`
  Serialize            `toArray()` / `toJson()`
  Test data            Factory

<a id="bagian-43"></a>

# 43. ⚡ Cheat Code Eloquent 10 Detik

```text
Model::query()
    ->where(...)
    ->with(...)
    ->get();

create()
→ insert

find()
→ primary key

where()
→ filter

get()
→ banyak model

first()
→ satu

with()
→ eager load

whereHas()
→ filter berdasarkan relation

withCount()
→ count relation

belongsTo()
→ child → parent

hasMany()
→ parent → children

belongsToMany()
→ many ↔ many

Collection
→ data sudah ada di memory

Query
→ data masih diproses database
```

### Rule paling penting

```text
Filter data
→ sebisa mungkin di database

Manipulasi hasil query
→ Collection

Relationship
→ Eloquent

Schema
→ Migration
```

<a id="bagian-44"></a>

# 44. 🧭 Urutan Belajar yang Disarankan

```text
1. Model & Migration
       ↓
2. CRUD dasar (insert, find, update, delete)
       ↓
3. Mass assignment & timestamps
       ↓
4. Query Builder dari Model
       ↓
5. Relationships (one-to-one, one-to-many, many-to-many)
       ↓
6. Lazy vs Eager loading
       ↓
7. Scopes & soft delete
       ↓
8. Casting & accessors/mutators
       ↓
9. Serialization & factory
       ↓
10. Advanced relationships (polymorphic)
        ↓
11. Mini project
```

Prinsip: kuasai dulu Model + CRUD, lalu relationships, baru
polymorphic dan custom casts.

------------------------------------------------------------------------

<a id="bagian-45"></a>

# 45. 🔗 Referensi Resmi

- [Laravel Eloquent ORM](https://laravel.com/docs/13.x/eloquent)
- [Eloquent Relationships](https://laravel.com/docs/13.x/eloquent-relationships)
- [Eloquent Mutators / Casting](https://laravel.com/docs/13.x/eloquent-mutators)
- [Eloquent Serialization](https://laravel.com/docs/13.x/eloquent-serialization)
- [Factories](https://laravel.com/docs/13.x/eloquent-factories)
