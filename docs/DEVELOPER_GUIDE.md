# Panduan developer UrbanLens

## Struktur folder

```text
urbanlens-vercel/
├── README.md
├── vercel.json
├── package.json
├── package-lock.json
├── docs/
│   ├── DEVELOPER_GUIDE.md
│   └── FONT_LICENSES.txt
├── scripts/
│   ├── serve.mjs
│   └── check.mjs
└── public/
    ├── index.html
    ├── kredit/
    │   └── index.html
    ├── config/
    │   └── site-config.js
    ├── data/
    │   └── dashboard-modules.js
    └── assets/
        ├── css/
        │   ├── fonts.css
        │   └── styles.css
        ├── js/
        │   ├── site.js
        │   ├── shared.js
        │   └── app.js
        ├── fonts/
        └── images/
            ├── brand/
            ├── hero/
            ├── android/
            ├── recommendations/
            ├── dashboard/
            └── team/
```

Vercel hanya menyajikan isi `public/`. Panduan, script lokal, dan file proyek berada di luar folder tersebut.

## Mengganti URL tombol

Buka `public/config/site-config.js`. Edit dua nilai di bagian `links`:

```js
"links": {
  "downloadApp": "https://alamat-download-aplikasi-anda",
  "dashboard": "https://alamat-dashboard-anda/#dashboard"
}
```

Perubahan berlaku untuk tombol di header, menu seluler, hero, bagian Android, ajakan terakhir, serta header halaman Kredit. Download App dapat diarahkan ke Play Store, file APK, atau halaman download Anda.

Link menu dashboard dibentuk dari alamat `links.dashboard` dengan mengganti hash sesuai `slug` pada `data/dashboard-modules.js`. Contoh: menu `export-data` menuju `#export-data`.

Jika dashboard produksi menggunakan path atau URL berbeda untuk suatu menu, gunakan override:

```js
"dashboardMenuUrls": {
  "executive-report": "https://dashboard.example.id/reports",
  "export-data": "https://dashboard.example.id/datasets/export",
  "credits": "https://dashboard.example.id/team"
}
```

Alamat default tetap memakai dashboard referensi yang diberikan pada proses desain. Ganti `links.dashboard` ketika alamat produksi sudah ditentukan.

## Mengganti gambar

Cara paling cepat: timpa file pada folder yang sesuai dengan nama file yang sama. Jika nama atau ekstensi berubah, edit path pada `config/site-config.js`.

Semua path konfigurasi dihitung dari **public/**, bukan dari lokasi file konfigurasi. Contoh yang benar: `assets/images/dashboard/admin-dashboard.jpg`. Path yang sama berlaku untuk beranda dan `/kredit/`; tidak perlu menambahkan `../`. URL HTTPS juga dapat digunakan, tetapi file lokal lebih mudah dipindahkan.

| Penggunaan | Lokasi file | Pengaturan pada config |
| --- | --- | --- |
| Simbol logo header/footer | `assets/images/brand/logo.webp` | `images.logo` |
| Favicon | `assets/images/brand/favicon.png` | `images.favicon` |
| Enam gambar hero | `assets/images/hero/hero-segmentation-01.png` sampai `06.png` | `hero.slides[].src` |
| Contoh segmentasi Android | `assets/images/android/segmentation-preview.jpeg` | `images.androidPreview` |
| Foto sebelum/sesudah | `assets/images/recommendations/ai-comparison.png` | `comparison.before`, `comparison.after` |
| Dashboard asli | `assets/images/dashboard/admin-dashboard.jpg` | `images.dashboard` |
| Foto Herry, Adipandang, Herman, Jenny, Agung, Anna, Adryan | `assets/images/team/` | `images.team` |

Screenshot dashboard saat ini berukuran **1348 × 846 px**. Gunakan screenshot dengan rasio yang mendekati ukuran tersebut untuk mempertahankan tampilan. Jika rasionya berubah, perbarui juga atribut `width` dan `height` pada gambar dashboard di `index.html`. Ganti teks `alt` bila isi gambar berubah.

Logo saat ini menggunakan file logo resmi yang lebar, dengan CSS menampilkan bagian simbolnya. Nama UrbanLens AI di sampingnya berupa teks. Bila mengganti dengan simbol mandiri atau logo lengkap, sesuaikan `.official-mark` pada `styles.css` agar ukurannya tepat.

## Slider utama

Pengaturan berada pada `hero`. Ubah `intervalMs` untuk durasi tiap slide dalam milidetik. Default **5000** = 5 detik.

Setiap objek pada `hero.slides` memiliki `src`, `title`, `alt`, `values`, dan `crop`. Urutan array menentukan urutan slide. Jumlah titik navigasi mengikuti jumlah objek secara otomatis.

**Urutan angka `values` wajib tetap:** Vegetasi, Langit, Kendaraan, Bangunan, Trotoar, Jalan. Masukkan angka persen, bukan string dengan simbol `%`. Gunakan titik untuk desimal.

Foto awal berasal dari screenshot yang menyertakan kartu hasil segmentasi. `crop` membingkai hanya area fotonya dengan CSS dan tidak mengubah file sumber. Ukuran viewport acuannya **976 × 630 px**; `sourceWidth`, `left`, dan `top` dihitung dalam piksel pada screenshot sumber.

Untuk mengganti dengan **foto biasa tanpa bingkai**, gunakan `crop: null`:

```js
{
  "src": "assets/images/hero/foto-koridor-baru.jpg",
  "title": "Koridor baru",
  "alt": "Deskripsi foto koridor baru dan overlay segmentasinya",
  "values": [30.8, 14.6, 1.1, 12.7, 4.5, 28.6],
  "crop": null
}
```

Contoh angka di atas hanya menunjukkan format. Isi dengan hasil analisis foto pengganti yang sebenarnya. Foto dengan rasio mendekati **976:630** akan paling sesuai; mode `cover` dapat memotong tepi foto untuk mengisi frame.

Kontrol pause/play, sebelumnya/berikutnya, titik navigasi, keyboard, dan swipe tetap berfungsi. Autoplay berhenti sementara saat gambar di-hover, kontrol mendapat fokus, halaman tersembunyi, atau slider keluar dari viewport. Pengaturan reduced motion dari browser juga dihormati.

## Foto sebelum dan sesudah

Versi awal memakai dua bagian dari satu screenshot, sehingga `size` dan `position` sudah diatur untuk membingkai fotonya. Untuk memakai **dua foto terpisah**, simpan file baru pada `assets/images/recommendations/`, lalu gunakan:

```js
"comparison": {
  "before": {
    "src": "assets/images/recommendations/before.jpg",
    "size": "cover",
    "position": "center"
  },
  "after": {
    "src": "assets/images/recommendations/after.jpg",
    "size": "cover",
    "position": "center"
  }
}
```

Gunakan foto dengan sudut pandang serta rasio yang sama. Frame perbandingan memakai rasio **488:406**. Gambar sesudah juga digunakan dalam ilustrasi layar Android untuk rekomendasi AI.

## Konten dan data

Beranda berada pada `public/index.html`; halaman Kredit berada pada `public/kredit/index.html`. Foto tim dikendalikan oleh `images.team`, sedangkan nama, afiliasi, gelar, dan kontribusinya diedit langsung di HTML Kredit.

Menu dashboard berada pada `public/data/dashboard-modules.js`. Setiap objek memiliki:

| Properti | Fungsi |
| --- | --- |
| `name` | Nama menu yang ditampilkan |
| `group` | Kelompok menu |
| `icon` | Nama ikon dari peta ikon pada `shared.js` |
| `slug` | Hash menu / kunci override URL |
| `description` | Penjelasan saat menu dipilih |

Ekspor PDF dan CSV tercantum bersama menu lain. Tidak ada section ekspor terpisah. Screenshot dashboard merupakan gambar produk; tombol menu pada landing page menampilkan penjelasan dan link ke dashboard.

Nilai Original UVI **5,8** pada contoh berasal dari materi yang diberikan; Predicted UVI **7,2** merupakan ilustrasi yang sudah diberi keterangan. Jika menggunakan prediksi nyata, perbarui angka dan keterangannya di beranda serta ilustrasi Android pada `app.js` secara bersamaan. Peta landing page juga merupakan demo visual; tidak terhubung ke data survei aktif.

## CSS, font, dan JavaScript

`assets/css/styles.css` menyimpan layout dan responsive styles. Variabel warna berada pada `:root`. Aturan ukuran paragraf terbaru berada pada bagian komentar **Reading sizes for marketing copy**; pertahankan urutan media query ketika mengubahnya.

Font lokal DM Sans dan Manrope berada pada `assets/fonts/`, dengan nama file berdasarkan bobot. Definisi `@font-face` berada pada `assets/css/fonts.css`. Informasi lisensinya disertakan pada `docs/FONT_LICENSES.txt`.

| Script | Tanggung jawab |
| --- | --- |
| `site.js` | Menerapkan config URL/gambar dan membentuk slide |
| `shared.js` | Ikon dan navigasi seluler di kedua halaman |
| `app.js` | Interaksi Android, perbandingan foto, peta demo, menu, autoplay |

Urutan script pada beranda: **config → site → shared → data menu → app**. Halaman Kredit memuat **config → site → shared**. Pertahankan atribut `defer` dan urutan tersebut.

URL tombol awal tetap ada dalam HTML sebagai fallback sebelum JavaScript berjalan. Pada browser dengan JavaScript aktif, config menjadi sumber utama. Bila membutuhkan URL fallback tanpa JavaScript yang sama setelah perubahan, samakan juga atribut awal `href` di HTML. Gambar dan fitur interaktif dimuat melalui JavaScript; mengganti path gambar pada config tidak memerlukan perubahan path di HTML/CSS.

## Pemeriksaan dan deploy

Jalankan `npm run build` dari root proyek. Perintah ini memeriksa kedua halaman, file aset, font, anchor, sintaks JS, konfigurasi gambar/URL, dan data menu. Jalankan `npm run dev` untuk preview lokal, lalu buka `/` dan `/kredit/`.

Periksa slider, navigasi seluler, foto tim, gambar dashboard, serta tujuan kedua tombol setelah mengubah config. Tidak ada rewrite SPA; Kredit adalah halaman HTML sendiri sehingga URL `/kredit/` dapat dibuka langsung.

Untuk Vercel, pilih **Other**, build `npm run build`, output `public`, dan root proyek yang berisi `vercel.json`. Tidak perlu environment variable. Semua config dalam `public/` dapat dibaca pengunjung; gunakan hanya URL dan aset publik di sana.
