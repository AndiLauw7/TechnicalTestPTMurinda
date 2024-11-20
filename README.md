1.Untuk Menjalankan langkah pertama clone project ke folder.
2.lalu buka folder technical test dan ada 2 folder client dan server lalu buka keduanya ke visual studio code.
3.buka client lalu jalankan pnpm install.
4.buka server lalu jalankan npm install.
5.setelah terinstall client sudah dapat dijalankan menggunakan pnpm run dev.
6.lalu pada server jalankan perintah npx sequelize-cli db:create untuk membuat database setelah db dibuat, 
jalankan perintah npx sequelize-cli db:migrate untuk migrasi database,
sebelum melakukan create dan migrasi database pastikan local server XAMPP Apache & mySql sudah di aktifkan.
7.setelah selesai membuat db dan migrasi db jalankan server.
8.jalankan server menggunkan npm start.
9.Aplikasi sudah dapat berjalan.
https://vite.dev/guide/
https://sequelize.org/v5/manual/migrations
