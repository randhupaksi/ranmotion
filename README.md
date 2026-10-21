# RanMotion

Fondasi proyek RanMotion. Fase ini menyiapkan stack dan route placeholder saja; konten belajar, editor, playground GSAP, dan penyimpanan progres belum diimplementasikan.

## Menjalankan secara lokal

Gunakan Node.js 24 LTS (lihat `.nvmrc`) dan npm.
Konfigurasi npm proyek mencatat workaround peer-resolution untuk npm 11.1.0; tinjau kembali saat memperbarui npm.

```sh
npm install
npm run dev
```

## Perintah yang tersedia

- `npm run typecheck` — pemeriksaan TypeScript
- `npm run lint` — lint dengan oxlint
- `npm test` — menjalankan Vitest
- `npm run test:e2e` — menjalankan Playwright
- `npm run test:e2e:install` — memasang Chromium Playwright secara lokal
- `npm run build` — typecheck dan build Vite
