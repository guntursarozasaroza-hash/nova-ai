# Nova AI — versi API

Versi ini mempertahankan antarmuka Nova AI dan mengirim pesan ke backend Node.js. API key hanya dibaca oleh server dari environment variable; jangan taruh key di `public/index.html`.

## Yang diperlukan
- Akun penyedia API dan API key yang aktif.
- Hosting/server yang mendukung Node.js (misalnya server pribadi atau platform hosting Node.js).
- Node.js 20+ untuk menjalankan secara lokal.

## Jalankan di komputer
1. Ekstrak ZIP.
2. Pasang Node.js.
3. Di folder proyek jalankan `npm install`.
4. Atur `OPENAI_API_KEY` sebagai environment variable di server/terminal.
   - macOS/Linux: `export OPENAI_API_KEY="API_KEY_KAMU"`
   - PowerShell: `$env:OPENAI_API_KEY="API_KEY_KAMU"`
5. Opsional: atur `OPENAI_MODEL` ke model yang tersedia di akun API kamu. Default di proyek ini `gpt-4.1-mini`; ubah bila model tersebut tidak tersedia di akunmu.
6. Jalankan `npm start`.
7. Buka `http://localhost:3000`.

## Hosting dari HP Android
File HTML yang dibuka langsung dengan `content://` tidak bisa menjalankan backend server. Kamu perlu deploy folder proyek ini ke layanan hosting yang mendukung Node.js:
1. Buat akun di penyedia hosting Node.js.
2. Unggah/repository-kan isi folder proyek ini.
3. Atur build/install command `npm install` dan start command `npm start`.
4. Tambahkan environment variable `OPENAI_API_KEY` pada dashboard hosting. Jangan memasukkannya ke HTML, screenshot, atau repository.
5. Set `OPENAI_MODEL` bila perlu.
6. Deploy, lalu buka URL HTTPS hasil hosting di Chrome Android.

Nama menu pada layanan hosting bisa berbeda. Paket gratis, jika tersedia, bisa memiliki batas penggunaan atau batas tidur server.

## Catatan keamanan dan biaya
- API key harus disimpan sebagai secret/environment variable di server.
- Batasi pengeluaran/usage di dashboard penyedia API dan jangan membagikan URL endpoint secara publik tanpa perlindungan tambahan.
- Rate limit dasar sudah dipasang, tetapi aplikasi publik sebaiknya ditambah autentikasi, limit per pengguna, dan monitoring.
- Penggunaan API dapat dikenai biaya terpisah dari langganan ChatGPT. Periksa harga dan saldo/billing penyedia.
- Fitur Penulis/Ringkas/Penerjemah/Ide pada menu tetap berupa demo lokal sederhana. Chat utama terhubung ke API AI.
- API model dan ketersediaan model tergantung akun penyedia. Ubah `OPENAI_MODEL` ke model yang memang tersedia bila perlu.

## Struktur
- `public/index.html` — tampilan Nova AI
- `server.js` — backend API
- `package.json` — dependensi dan perintah
- `.env.example` — contoh variabel konfigurasi; bukan tempat menyimpan key sungguhan
