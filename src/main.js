import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import { SceneManager } from "./engine/SceneManager.js";
import { GameRenderer } from "./engine/Renderer.js";
import { Player } from "./character/Player.js";
import { CharacterController } from "./character/CharacterController.js";
import { ThirdPersonCamera } from "./camera/ThirdPersonCamera.js";

// Scene dan renderer
const sceneManager = new SceneManager();
const scene = sceneManager.scene;

const canvas = document.getElementById("game-canvas");
const gameRenderer = new GameRenderer(canvas);

// Kamera
const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  300
);

camera.position.set(0, 5, 8);

// Pemain
const player = new Player(scene);

// Kontrol pemain
const controller = new CharacterController(
  player,
  camera,
  document.getElementById("joystick"),
  document.getElementById("joystick-stick")
);

// Kamera third-person
const followCamera = new ThirdPersonCamera(camera, player);

// Pengaturan pause
let paused = false;

const pauseButton = document.getElementById("pause-button");
const pauseScreen = document.getElementById("pause-screen");
const resumeButton = document.getElementById("resume-button");
const resetButton = document.getElementById("reset-button");

function togglePause(value) {
  paused = value;

  if (pauseScreen) {
    pauseScreen.classList.toggle("hidden", !paused);
  }
}

pauseButton?.addEventListener("click", () => {
  togglePause(!paused);
});

resumeButton?.addEventListener("click", () => {
  togglePause(false);
});

resetButton?.addEventListener("click", () => {
  player.group.position.set(0, 0, 0);
  player.group.rotation.set(0, 0, 0);
  controller.verticalVelocity = 0;
  controller.grounded = true;
  togglePause(false);
});

window.addEventListener("keydown", (e) => {
  if (e.code === "Escape") {
    togglePause(!paused);
  }
});

// Resize layar
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  gameRenderer.resize();
});

// Game loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);

  if (!paused) {
    controller.update(delta);
    followCamera.update(delta);
  }

  gameRenderer.render(scene, camera);
}

animate();