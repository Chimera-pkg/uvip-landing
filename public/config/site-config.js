// PUSAT PENGATURAN: URL tombol, semua gambar, slider, dan foto sebelum/sesudah.
// Semua path gambar relatif terhadap folder public/. URL https:// juga didukung.
// values pada slide: [Vegetasi, Langit, Kendaraan, Bangunan, Trotoar, Jalan].
// Untuk foto biasa tanpa bingkai screenshot, gunakan crop: null.
// comparison foto biasa: size: "cover", position: "center".
// dashboardMenuUrls dapat diisi dengan pasangan "slug-menu": "https://...".
window.URBANLENS_CONFIG = {
  "links": {
    "downloadApp": "https://drive.google.com/drive/folders/1FSBcG9zNrkvDQb3eBO2O8fhRd2ZQLeds",
    "dashboard": "http://80.241.214.39:3000/"
  },
  "dashboardMenuUrls": {},
  "images": {
    "logo": "assets/images/brand/logo.webp",
    "favicon": "assets/images/brand/favicon.png",
    "androidPreview": "assets/images/android/segmentation-preview.jpeg",
    "dashboard": "assets/images/dashboard/admin-dashboard.jpg",
    "team": {
      "adryan": "assets/images/team/adryan.png",
      "herman": "assets/images/team/herman.png",
      "herry": "assets/images/team/herry.jpg",
      "anna": "assets/images/team/anna.png",
      "agung": "assets/images/team/agung.jpg",
      "jenny": "assets/images/team/jenny.jpg",
      "adipandang": "assets/images/team/adipandang.png"
    }
  },
  "hero": {
    "intervalMs": 5000,
    "slides": [
      {
        "src": "assets/images/hero/hero-segmentation-01.png",
        "title": "Koridor dengan kanopi pohon",
        "alt": "Overlay segmentasi pada trotoar koridor perkotaan dengan kanopi pepohonan yang lebat",
        "values": [
          50.2,
          1.9,
          2.6,
          11.8,
          13.2,
          15.9
        ],
        "crop": {
          "sourceWidth": 1106,
          "left": 64,
          "top": 164
        }
      },
      {
        "src": "assets/images/hero/hero-segmentation-02.png",
        "title": "Koridor komersial",
        "alt": "Overlay segmentasi pada koridor pertokoan dengan jalan dan trotoar di sisi bangunan",
        "values": [
          6.5,
          14.4,
          0.3,
          42.6,
          2.7,
          32.0
        ],
        "crop": {
          "sourceWidth": 1112,
          "left": 64,
          "top": 178
        }
      },
      {
        "src": "assets/images/hero/hero-segmentation-03.png",
        "title": "Ruang pejalan kaki",
        "alt": "Overlay segmentasi ruang pejalan kaki, pepohonan, dan bangunan gereja di Malang",
        "values": [
          30.8,
          14.6,
          1.1,
          12.7,
          4.5,
          28.6
        ],
        "crop": {
          "sourceWidth": 1118,
          "left": 70,
          "top": 174
        }
      },
      {
        "src": "assets/images/hero/hero-segmentation-04.png",
        "title": "Koridor bangunan institusi",
        "alt": "Overlay segmentasi pada koridor jalan di depan bangunan institusi dengan atap merah",
        "values": [
          23.0,
          26.4,
          1.7,
          18.3,
          1.0,
          27.3
        ],
        "crop": {
          "sourceWidth": 1104,
          "left": 62,
          "top": 167
        }
      },
      {
        "src": "assets/images/hero/hero-segmentation-05.png",
        "title": "Trotoar di koridor hijau",
        "alt": "Overlay segmentasi trotoar berpagar dan pepohonan di koridor dengan menara masjid",
        "values": [
          40.0,
          8.7,
          1.0,
          26.4,
          4.9,
          17.0
        ],
        "crop": {
          "sourceWidth": 1104,
          "left": 61,
          "top": 166
        }
      },
      {
        "src": "assets/images/hero/hero-segmentation-06.png",
        "title": "Aktivitas di koridor pertokoan",
        "alt": "Overlay segmentasi pada trotoar koridor pertokoan, kursi jalan, kendaraan, dan pejalan kaki",
        "values": [
          19.6,
          15.6,
          11.5,
          26.6,
          6.7,
          11.9
        ],
        "crop": {
          "sourceWidth": 1088,
          "left": 54,
          "top": 148
        }
      }
    ]
  },
  "comparison": {
    "before": {
      "src": "assets/images/recommendations/ai-comparison.png",
      "size": "419.672% auto",
      "position": "33.3333% 48.97%"
    },
    "after": {
      "src": "assets/images/recommendations/ai-comparison.png",
      "size": "419.672% auto",
      "position": "66.2821% 49.3135%"
    }
  }
};
