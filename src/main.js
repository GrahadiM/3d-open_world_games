
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import { SceneManager } from "./engine/SceneManager.js";
import { GameRenderer } from "./engine/Renderer.js";

import { Player } from "./character/Player.js";
import { CharacterController } from "./character/CharacterController.js";
import { ThirdPersonCamera } from "./camera/ThirdPersonCamera.js";

import { TrainingDummy } from "./entities/TrainingDummy.js";
import { CombatManager } from "./combat/CombatManager.js";
import { HUD } from "./ui/HUD.js";

// =====================================
// INITIALIZATION
// =====================================

const sceneManager = new SceneManager();
const scene = sceneManager.scene;

const canvas = document.getElementById("game-canvas");
const gameRenderer = new GameRenderer(canvas);

const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  300
);

// =====================================
// PLAYER
// =====================================

const player = new Player(scene);

const controller = new CharacterController(
  player,
  camera,
  document.getElementById("joystick"),
  document.getElementById("joystick-stick")
);

// =====================================
// CAMERA
// =====================================

const followCamera = new ThirdPersonCamera(
  camera,
  player
);

// =====================================
// ENEMY
// =====================================

const enemy = new TrainingDummy(
  scene,
  new THREE.Vector3(0, 0, -5)
);

// =====================================
// HUD
// =====================================

const hud = new HUD();

hud.updatePlayerHP(100, 100);
hud.updateEnergy(100, 100);
hud.updateEnemy(100, 100, true);
hud.updateKills(0);

// =====================================
// COMBAT
// =====================================

const combat = new CombatManager(
  player,
  enemy,
  hud
);

// Keyboard controls
window.addEventListener("keydown", (event) => {
  if (event.repeat) return;

  switch (event.code) {
    case "KeyF":
      combat.useSkill("basic");
      break;

    case "KeyZ":
      combat.useSkill("super");
      break;

    case "KeyX":
      combat.useSkill("knockback");
      break;
  }
});

// Mobile attack
document
  .getElementById("attack-button")
  ?.addEventListener("click", () => {
    combat.useSkill("basic");
  });

// =====================================
// PAUSE SYSTEM
// =====================================

let paused = false;

const pauseButton = document.getElementById("pause-button");
const resumeButton = document.getElementById("resume-button");
const pauseScreen = document.getElementById("pause-screen");

function togglePause(value) {
  paused = value;
  pauseScreen?.classList.toggle("hidden", !paused);
}

pauseButton?.addEventListener("click", () => {
  togglePause(!paused);
});

resumeButton?.addEventListener("click", () => {
  togglePause(false);
});

window.addEventListener("keydown", (event) => {
  if (event.code === "Escape") {
    togglePause(!paused);
  }
});

// Reset
document.getElementById("reset-button")
  ?.addEventListener("click", () => {
    player.group.position.set(0, 0, 0);
    player.group.rotation.set(0, 0, 0);

    controller.verticalVelocity = 0;
    controller.grounded = true;

    if (!enemy.alive) {
      enemy.respawn();
    } else {
      enemy.hp = enemy.maxHP;
      enemy.group.position.copy(enemy.spawnPosition);
    }

    combat.energy = combat.maxEnergy;
    combat.kills = 0;

    hud.updateKills(0);
    hud.updateEnergy(100, 100);
    hud.updateEnemy(100, 100, true);

    togglePause(false);
  });

// =====================================
// DASH SYSTEM
// =====================================

document.getElementById("dash-button")
  ?.addEventListener("click", () => {

    const forward = new THREE.Vector3(0, 0, -1);

    forward.applyQuaternion(player.group.quaternion);

    player.group.position.addScaledVector(
      forward,
      2.5
    );

  });

// =====================================
// RESIZE
// =====================================

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  gameRenderer.resize();
});

// =====================================
// GAME LOOP
// =====================================

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);

  if (!paused) {

    // Player movement
    controller.update(delta);

    // Camera follow
    followCamera.update(delta);

    // Enemy AI and regeneration
    enemy.update(
      delta,
      player.group.position
    );

    // Combat energy and HUD
    combat.update(delta);

  }

  gameRenderer.render(scene, camera);
}

animate();