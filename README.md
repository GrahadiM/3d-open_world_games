# 3D Open World Games

## Structure files

```bash
project-root/
│
├── index.html
├── README.md
│
└── src/
    ├── main.js
    ├── style.css
    │
    ├── core/
    │   └── GameLoop.js
    │
    ├── engine/
    │   ├── SceneManager.js
    │   └── Renderer.js
    │
    ├── character/
    │   ├── Player.js
    │   └── CharacterController.js
    │
    ├── camera/
    │   └── ThirdPersonCamera.js
    │
    ├── combat/
    │   └── CombatManager.js
    │
    ├── entities/
    │   └── TrainingDummy.js
    │
    ├── input/
    │   ├── KeyboardInput.js
    │   └── TouchInput.js
    │
    └── ui/
        └── HUD.js
```

## Versi

```bash
1.0.0
```

## Catatan Fitur

- Scene 3D berhasil dirender.
- Pulau dan laut tampil.
- Pepohonan dibuat secara prosedural.
- Kamera menggunakan perspektif 3D.
- Pencahayaan dan bayangan aktif.
- Layout HUD dan landscape sudah tersedia.