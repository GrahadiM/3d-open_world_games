
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

import { SceneManager } from './engine/SceneManager.js';
import { GameRenderer } from './engine/Renderer.js';
import { Player } from './character/Player.js';
import { CharacterController } from './character/CharacterController.js';
import { ThirdPersonCamera } from './camera/ThirdPersonCamera.js';

// Inisialisasi dunia
const world = new SceneManager();

// Kamera
const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);

// Renderer
const canvas = document.getElementById('game-canvas');
const gameRenderer = new GameRenderer(
  canvas,
  world.scene,
  camera
);

// Pemain dan kontrol
const player = new Player(world.scene);
const controller = new CharacterController(player);
const followCamera = new ThirdPersonCamera(camera, player);

// Clock untuk delta time
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.elapsedTime;

  controller.update(delta);
  player.updateAnimation(elapsed);
  followCamera.update(delta);

  gameRenderer.render();
}

animate();

// Tombol pause sederhana
let paused = false;

document.getElementById('pause-button')
  ?.addEventListener('click', () => {
    paused = !paused;

    const overlay = document.getElementById('pause-screen');
    if (overlay) {
      overlay.classList.toggle('hidden', !paused);
    }
  });

// Reset posisi pemain
document.getElementById('reset-button')
  ?.addEventListener('click', () => {
    player.group.position.set(0, 0, 0);
    player.group.rotation.set(0, 0, 0);
    player.velocityY = 0;
    player.isGrounded = true;
  });

// Menghentikan simulasi saat pause
const originalUpdate = controller.update.bind(controller);

controller.update = (delta) => {
  if (paused) return;
  originalUpdate(delta);
};
