# UrbanLens AI — Paket deploy Vercel

Website marketing versi terakhir, dengan beranda dan halaman **Kredit** terpisah. Semua gambar dan font sudah disertakan secara lokal. HTML, CSS, JavaScript, data menu, dan konfigurasi dipisahkan agar mudah dirawat.

## Mulai dari sini

| Yang ingin diubah | File atau folder |
| --- | --- |
| URL **Download App** dan **Lihat Dashboard** | `public/config/site-config.js` → `links` |
| Gambar, urutan slide, judul, persentase, dan durasi slider | `public/config/site-config.js` → `images`, `hero`, `comparison` |
| File gambar | `public/assets/images/` — dikelompokkan berdasarkan penggunaan |
| Konten beranda | `public/index.html` |
| Nama, afiliasi, dan kontribusi tim | `public/kredit/index.html` |
| Menu dan deskripsi dashboard, termasuk PDF/CSV | `public/data/dashboard-modules.js` |
| Warna, ukuran huruf, dan layout | `public/assets/css/styles.css` |
| Langkah penggantian aset dan konfigurasi | `docs/DEVELOPER_GUIDE.md` |

## Deploy ke Vercel melalui Git

1. Ekstrak ZIP. Buka folder **urbanlens-vercel** yang berisi `vercel.json` dan `package.json`.
2. Upload **isi folder tersebut** ke repository Git, lalu import repository di Vercel.
3. Gunakan pengaturan berikut; `vercel.json` sudah menyediakannya.

| Pengaturan | Nilai |
| --- | --- |
| Framework Preset | **Other** |
| Root Directory | Folder yang berisi `vercel.json`; `./` jika isi paket diletakkan di root repository |
| Build Command | `npm run build` |
| Output Directory | `public` |
| Environment Variables | Tidak diperlukan |

4. Klik **Deploy**. Beranda tersedia pada `/`, dan Kredit pada `/kredit/`.

Jika repository berisi folder pembungkus `urbanlens-vercel/`, pilih folder tersebut sebagai **Root Directory**, bukan `public/`.

## Deploy melalui Vercel CLI

Dari folder `urbanlens-vercel`, jalankan:

```sh
npm run build
npx vercel
```

Ikuti pengaturan akun dan proyek di CLI. Setelah preview diperiksa, jalankan `npx vercel --prod` untuk production. Tidak ada API key atau konfigurasi akun Vercel yang disertakan dalam paket.

## Preview lokal

Memerlukan Node.js 20 atau lebih baru. Tidak ada dependency npm tambahan.

```sh
cd urbanlens-vercel
npm run dev
```

Buka `http://localhost:3000/`. Gunakan `Ctrl+C` untuk menghentikan server. Untuk memeriksa file sebelum deploy:

```sh
npm run build
```

Perintah build memvalidasi konfigurasi, referensi aset, anchor, dan sintaks JavaScript. Folder `public/` sudah berisi file siap tayang sehingga tidak memerlukan proses kompilasi.

## Isi versi ini

- Identitas visual cyan, navy, dan putih; paragraf diperbesar dan visual utama tegak.
- Enam gambar segmentasi pada slider otomatis, lengkap dengan kontrol navigasi dan angka komposisi masing-masing.
- Lima fitur Android serta perbandingan visual rekomendasi AI.
- Screenshot dashboard asli dan daftar 15 menu; PDF dan CSV berada dalam daftar fitur.
- Kredit terpisah dengan lima peneliti dan dua mitra industri/pengembang.
- URL tombol di kedua halaman dikendalikan oleh satu file konfigurasi.

Paket ini adalah website marketing. Analisis AI, pengunduhan aplikasi, dashboard, dan ekspor dataset/laporan tetap melalui aplikasi tujuan. Angka Predicted UVI **7,2** dan peta pada landing page tetap ditandai sebagai ilustrasi, sesuai versi preview.

Konfigurasi Vercel mengacu pada dokumentasi resminya: [Project configuration](https://vercel.com/docs/project-configuration/vercel-json) dan [Configure a build](https://vercel.com/docs/builds/configure-a-build).
