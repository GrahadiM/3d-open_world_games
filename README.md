# 3D Open World Game Engine & Prototype

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-active--development-green.svg)
![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)

Proyek game *3D Open World* berbasis web yang dikembangkan menggunakan arsitektur modular. Proyek ini memuat komponen inti (*engine*) untuk pembuatan lingkungan 3D interaktif, kontrol karakter perspektif orang ketiga (*third-person*), serta sistem pertarungan (*combat*).

---

## 📑 Daftar Isi
- [Fitur Utama](#-fitur-utama)
- [Struktur Proyek](#-struktur-proyek)
- [Prasyarat & Penggunaan](#-prasyarat--penggunaan)
- [Detail Arsitektur](#-detail-arsitektur)
- [Catatan Rilis (Changelog)](#-catatan-rilis-changelog)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## 🚀 Fitur Utama

- **Rendering 3D Real-time**: Mengelola alur render visual, pencahayaan (*lighting*), dan bayangan (*shadows*).
- **Generasi Lingkungan Prosedural**: Pembuatan pepohonan, pulau, dan lanskap laut secara otomatis.
- **Kamera Perspektif 3D**: *Third-Person Camera* yang dinamis mengikuti gerakan karakter.
- **Sistem Input Multi-Platform**: Mendukung skenario input keyboard (PC) dan *touch control* (Perangkat Seluler).
- **Modul Combat & Entities**: Entitas target interaktif (*Training Dummy*) dan sistem manajemen pertempuran.
- **Antarmuka Pengguna (HUD)**: Overlay HUD terintegrasi untuk status game dan antarmuka pemain.

---

## 📁 Struktur Proyek

Berikut adalah tata letak direktori utama proyek:

```bash
project-root/
│
├── index.html                # Entry point HTML utama
├── README.md                 # Dokumentasi proyek
│
└── src/                      # Source code aplikasi
    ├── main.js               # Entry point aplikasi JavaScript
    ├── style.css             # Styling global dan tata letak UI/HUD
    │
    ├── core/                 # Komponen utama sistem
    │   └── GameLoop.js       # Manajemen siklus perbarui (update) dan rendering
    │
    ├── engine/               # Grafik & Rendering Engine
    │   ├── SceneManager.js   # Pengelolaan objek scene 3D
    │   └── Renderer.js       # Setup WebGL / Three.js Renderer
    │
    ├── character/            # Logika dan Model Karakter
    │   ├── Player.js         # Entitas pemain utama
    │   └── CharacterController.js # Logika pergerakan dan fisik karakter
    │
    ├── camera/               # Sistem Kamera
    │   └── ThirdPersonCamera.js # Kamera perspektif orang ketiga
    │
    ├── combat/               # Logika Pertarungan
    │   └── CombatManager.js  # Manajemen status pertempuran & hit detection
    │
    ├── entities/             # Objek & NPC di dalam Game
    │   └── TrainingDummy.js  # Entitas latihan / objek target
    │
    ├── input/                # Event Handling Input
    │   ├── KeyboardInput.js  # Penanganan input dari keyboard
    │   └── TouchInput.js     # Penanganan input dari layar sentuh
    │
    └── ui/                   # Antarmuka Pengguna (User Interface)
        └── HUD.js            # Komponen Head-Up Display (Healthbar, Minimap, dll.)
```

---

## 💻 Prasyarat & Penggunaan

### Prasyarat
- Browser modern yang mendukung WebGL (Google Chrome, Mozilla Firefox, Edge, Safari).
- Web Server Lokal (seperti [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) VS Code, `http-server`, atau Node.js development server).

### Cara Menjalankan

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/username/3d-open-world-game.git
   cd 3d-open-world-game
   ```

2. **Jalankan melalui Local Web Server:**
   - Menggunakan `npx`:
     ```bash
     npx http-server .
     ```
   - Atau buka `index.html` menggunakan ekstensi **Live Server** di VS Code.

3. Buka browser dan akses alamat yang ditampilkan (misal: `http://localhost:8080`).

---

## 📦 Catatan Rilis (Changelog)

### Version `1.0.4`
- ✅ Animasi pukulan dan tendangan.
- ✅ Efek visual Super Punch.
- ✅ Efek gelombang Knock Back.
- ✅ Projectile Fire Ball.
- ✅ Efek ledakan dan damage indicator.
- ✅ Floating damage numbers.
- ✅ Efek visual ketika musuh mati.
- ✅ Optimalisasi particle effects untuk mobile.

---

## 🤝 Kontribusi

Kontribusi selalu terbuka! Jika Anda ingin berkontribusi:
1. Fork repository ini.
2. Buat branch fitur baru (`git checkout -b feature/FiturBaru`).
3. Commit perubahan Anda (`git commit -m 'Menambahkan FiturBaru'`).
4. Push ke branch (`git push origin feature/FiturBaru`).
5. Buat **Pull Request**.

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah [Lisensi MIT](LICENSE).