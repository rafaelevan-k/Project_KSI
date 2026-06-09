# Evaluasi Penerapan Keamanan OWASP Level 1

Dokumen ini merangkum 10 poin panduan keamanan **OWASP Application Security Verification Standard (ASVS) Level 1** yang telah diterapkan secara spesifik pada arsitektur proyek ini (Backend Laravel & Frontend ReactJS), beserta cara pengujian (verifikasi) yang mendetail untuk setiap penerapannya.

---

### 1. V2.2: Field Password Disembunyikan

**Konteks:** Menjaga kerahasiaan input _password_ dari _shoulder surfing_ (orang yang mengintip layar) dengan menyembunyikan teks yang diketik.

- **Implementasi:** Pada halaman `/login` (`LoginPage.tsx`), `/reset-password` (`ResetPasswordPage.tsx`), dan `/settings` (`SettingsPage.tsx`), semua elemen `<input>` yang menerima sandi menggunakan atribut `type="password"`.
- **Cara Mengecek:**
  1. Buka halaman Login, Reset Password, atau Settings di _browser_.
  2. Ketikkan sembarang karakter ke dalam _field_ sandi.
  3. Pastikan karakter yang muncul berupa titik-titik (••••) atau asteris (\*\*\*\*), bukan teks polos (huruf yang dapat dibaca).
  4. (Opsional) Klik kanan _field_ tersebut, pilih **Inspect Element**, dan pastikan di dalam DOM tertera `<input type="password">`.

### 2. V3.2: Sesi Dibatalkan Saat Logout

**Konteks:** Menghindari ancaman _Session Fixation_ dan penggunaan kembali token oleh penyerang dengan memusnahkan jejak otentikasi di sisi _server_.

- **Implementasi:** Metode `logout` pada `AuthController.php` di Laravel telah diperbarui untuk mengeksekusi penghapusan token (`currentAccessToken()->delete()`), membatalkan status web auth (`Auth::guard('web')->logout()`), membersihkan sesi (`$request->session()->invalidate()`), dan me-regenerasi token CSRF (`$request->session()->regenerateToken()`).
- **Cara Mengecek:**
  1. Login ke dalam sistem.
  2. Klik tombol **Sign Out** / **Logout**.
  3. Tekan tombol _Back_ pada browser atau coba navigasikan kembali secara manual ke URL dasbor (misal `http://localhost:5173/dashboard`).
  4. Pastikan Anda langsung ditendang (_redirect_) kembali ke halaman `/login`.
  5. Jika Anda memeriksa _database_ di tabel `personal_access_tokens` (jika menggunakan database token), pastikan token pengguna Anda tadi sudah terhapus.

### 3. V3.12: Atribut Cookie Sesi yang Ketat

**Konteks:** Mengamankan cookie sesi agar hanya dikirim lewat jalur aman (HTTPS) dan mencegah pencurian via skrip klien (XSS).

- **Implementasi:** Pada `config/session.php`, kami telah memodifikasi nilai `secure => env('APP_ENV') === 'production'` dan `http_only => true`.
- **Cara Mengecek:**
  1. Login ke aplikasi, buka **Developer Tools (F12)** di _browser_.
  2. Pindah ke tab **Application** (Chrome/Edge) atau **Storage** (Firefox).
  3. Pilih **Cookies** di _sidebar_ kiri, lalu pilih nama _domain_ aplikasi Anda.
  4. Cari cookie sesi aplikasi Anda (biasanya `laravel_session`).
  5. Cek kolom **HttpOnly**: Pastikan memiliki tanda centang (✅). Ini membuktikan bahwa skrip JavaScript (seperti `document.cookie`) tidak bisa membaca _cookie_ tersebut.
  6. Jika Anda mengubah `.env` menjadi `APP_ENV=production` dan merestart server Laravel, pastikan cookie juga memiliki tanda centang (✅) di kolom **Secure**.

### 4. V3.5: Menampilkan Link Logout

**Konteks:** Memberikan kejelasan status otentikasi dan jalan keluar yang mudah bagi pengguna.

- **Implementasi:** Pada tata letak utama (`UserNavbar.tsx` dan `UserSidebar.tsx`), terdapat tombol / tautan berlabel "Sign Out" lengkap dengan ikon _LogOut_ berwarna merah yang mudah dikenali, serta dilindungi modal konfirmasi (agar tidak terpencet tak sengaja).
- **Cara Mengecek:**
  1. Login ke dalam aplikasi.
  2. Perhatikan menu navigasi atas (Navbar) dan navigasi samping (Sidebar).
  3. Pastikan tautan/tombol untuk keluar (Sign Out) terpampang nyata di setiap halaman terproteksi.
  4. Coba klik dan pastikan ada dialog "Apakah Anda yakin ingin keluar?".

### 5. V2.16: Transportasi Dienkripsi dengan Kuat

**Konteks:** Memastikan bahwa pada saat rilis (Production), data kredensial tidak pernah dikirim dalam teks biasa via HTTP, melainkan dienkripsi dengan HTTPS.

- **Implementasi:** Di `AppServiceProvider.php` Laravel, terdapat logika `URL::forceScheme('https')` yang akan terpicu manakala server mendeteksi _environment_ `production`.
- **Cara Mengecek:**
  1. Di _backend_, ubah file `.env` dengan mengatur `APP_ENV=production`.
  2. Jalankan perintah `php artisan config:clear`.
  3. Coba _request_ / akses URL _backend_ yang di-generate oleh sistem (misalnya email verifikasi atau tautan lupa password).
  4. Pastikan URL yang terbentuk secara otomatis diawali dengan `https://` bukan `http://`. (Catatan: Untuk mengujinya 100% Anda membutuhkan sertifikat SSL di server Production).

### 6. V2.19: Tidak Ada Password Default

**Konteks:** Mencegah celah _backdoor_ melalui _password_ akun _testing_/admin bawaan yang ditulis di _source code_ secara _hardcoded_ (teks terang).

- **Implementasi:** Kelas `UserFactory.php` (di folder `database/factories/`) tidak lagi meng-hash kata sandi `password`, melainkan menggunakan string acak `Str::random(12)` untuk meng-_generate_ sandinya.
- **Cara Mengecek:**
  1. Buka terminal _backend_, jalankan `php artisan migrate:fresh --seed`.
  2. Coba login di halaman web menggunakan email sembarang akun _dummy_ (`test@example.com`) dengan password `password`.
  3. Pastikan login **gagal**. Akun tersebut kini memiliki sandi acak yang tidak Anda ketahui, sehingga mustahil ditebak penyerang.

### 7. V2.9: Semua Perubahan Kredensial Aman

**Konteks:** Saat mengganti kata sandi, sistem harus mewajibkan otentikasi ulang dari kata sandi lama (agar sesi yang ditinggalkan tidak disalahgunakan orang lain untuk mengganti kata sandinya).

- **Implementasi:** Halaman `/settings` di ReactJS memiliki tiga input wajib: _Current Password_, _New Password_, dan _Confirm Password_. Di backend, `AuthController::changePassword` memeriksa `Hash::check` antara _Current Password_ dan sandi asli di DB.
- **Cara Mengecek:**
  1. Login ke dalam sistem.
  2. Navigasi ke halaman **Settings** -> bagian **Change Password**.
  3. Masukkan "Current Password" yang **salah**, dan isi _password_ baru dengan format yang benar.
  4. Klik **Save Password**. Pastikan ada pesan error seperti "The provided password does not match our records" (Gagal karena sandi saat ini salah).
  5. Ulangi proses, kali ini masukkan "Current Password" yang **benar**. Pastikan muncul pesan sukses bahwa sandi telah diubah.

### 8. V3.3: Sesi Berakhir Setelah Ketidakaktifan

**Konteks:** Mengurangi jendela waktu dimana penyerang dapat membajak sesi pengguna (jika pengguna lupa _logout_ atau meninggalkan komputernya menyala).

- **Implementasi:** Batas waktu sesi diatur menjadi `30` menit (pada `config/session.php`). Di _frontend_, **Axios Interceptor** mencegat respons `401 Unauthorized` atau `419 Page Expired` dari server untuk menendang (_kick_) pengguna secara otomatis.
- **Cara Mengecek:**
  1. Login ke dalam aplikasi.
  2. Hapus token otentikasi (secara buatan) dengan membuka Developer Tools -> Tab **Application/Storage** -> Local Storage. Hapus variabel `auth_token`. (Atau ubah durasi di `session.php` menjadi `1` menit dan diamkan komputer Anda).
  3. Setelah token dihapus (mewakili skenario masa kadaluarsa), coba klik sembarang tombol atau muat ulang (_refresh_) halaman (atau klik menu apapun yang memanggil API).
  4. Pastikan sistem seketika memusnahkan semua sisa penyimpanan lokal dan Anda dilemparkan kembali ke halaman `/login`.

### 9. V2.1: Prinsip Mediasi Penuh (Principle of Complete Mediation)

**Konteks:** Setiap akses sumber daya (kecuali halaman murni publik) wajib diverifikasi (_default deny_).

- **Implementasi:** Di `App.tsx` ReactJS, rute privat telah dibungkus oleh komponen `<ProtectedRoute>` yang melarang akses jika _state auth_ (token) kosong. Di Laravel, rute sensitif diletakkan di dalam fungsi grup `Route::middleware('auth:sanctum')`.
- **Cara Mengecek:**
  1. Buka mode **Incognito/Private Window** baru di _browser_ (agar dipastikan tidak ada sesi login yang tersimpan).
  2. Di _address bar_, ketik paksa URL terproteksi, seperti `http://localhost:5173/dashboard` atau `http://localhost:5173/settings`.
  3. Tekan Enter.
  4. Pastikan Anda tidak pernah diperlihatkan layar Dasbor atau Pengaturan walau sekejap, dan _router_ langsung meredirect/memaksa Anda kembali ke halaman `/login`.

### 10. V2.17: Tidak Ada Password dalam Teks Terang (Clear Text)

**Konteks:** Mencegah peretasan kredensial melalui email pemulihan/dukungan dengan memastikan _password_ lama maupun baru tidak pernah ditulis terang dalam email.

- **Implementasi:** Fitur _Forgot Password_ menggunakan kelas bawaan Laravel `Password::sendResetLink()` yang mengirimkan URL unik ber-_hash_ token satu arah (_One-Time-Token_ / OTP), berbatas waktu. Tidak ada pengiriman kembali kredensial asli pengguna dalam _email_ tersebut.
- **Cara Mengecek:**
  1. Buka halaman Lupa Sandi (`/forgot-password`).
  2. Masukkan email pengguna yang valid.
  3. Periksa layanan _email logging_ lokal (seperti **Mailtrap**, file `laravel.log`, atau _tab output console_ Anda).
  4. Lihat isi email yang terkirim.
  5. Pastikan isi pesannya **bukan** berupa tulisan seperti _"Kata sandi Anda adalah: password123"_, melainkan berupa tautan URL acak seperti `http://localhost:5173/reset-password?token=2a0f8b...`. Tautan inilah yang digunakan untuk mengatur ulang (_reset_) sandi dengan aman.
