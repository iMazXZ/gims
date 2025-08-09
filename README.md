# gims

Platform web untuk menemukan dan menonton film & serial TV. Dibangun menggunakan Vite, React, TypeScript, dan Tailwind CSS.

## Fitur
- Jelajahi judul tren, film, dan serial TV terbaru.
- Temukan konten berdasarkan kategori atau negara.
- Detail lengkap film/TV dan aktor.
- Pencarian, riwayat tontonan, dan daftar tontonan pribadi.

## Prasyarat
- Node.js >= 18
- API key dari [The Movie Database](https://www.themoviedb.org/) (TMDB)

## Instalasi
1. Clone repo dan masuk ke folder proyek.
2. Install dependensi:

```bash
npm install
```

3. Buat file `.env.local` di root proyek dan masukkan:

```
VITE_TMDB_API_KEY=apikey_anda
```

## Pengembangan
Jalankan server pengembangan:

```bash
npm run dev
```

## Build
Membangun aplikasi untuk produksi:

```bash
npm run build
```

Melihat hasil build:

```bash
npm run preview
```

## Lint
Memeriksa kode:

```bash
npm run lint
```

## Teknologi
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

