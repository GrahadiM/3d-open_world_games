
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import { SceneManager } from "./engine/SceneManager.js";
import { GameRenderer } from "./engine/Renderer.js";

import { Player } from "./character/Player.js";
import { CharacterController } from "./character/CharacterController.js";
import { ThirdPersonCamera } from "./camera/ThirdPersonCamera.js";

import { TrainingDummy } from "./entities/TrainingDummy.js";
import { HUD } from "./ui/HUD.js";
import { AbilityUI } from "./ui/AbilityUI.js";

import { InventoryManager } from "./inventory/InventoryManager.js";
import { DropManager } from "./progression/DropManager.js";
import { AbilityManager } from "./abilities/AbilityManager.js";

import { VFXManager } from "./effects/VFXManager.js";
import { DamageNumber } from "./effects/DamageNumber.js";
import { ProjectileManager } from "./effects/Projectile.js";
import { CombatAnimation } from "./animation/CombatAnimation.js";

// =====================================
// INITIALIZATION
// =====================================

const sceneManager = new SceneManager();
const scene = sceneManager.scene;

const gameRenderer = new GameRenderer(
  document.getElementById("game-canvas")
);

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
// VISUAL EFFECTS
// =====================================

const vfx = new VFXManager(scene);

const damageNumbers = new DamageNumber(scene);

const projectileManager = new ProjectileManager(
  scene,
  vfx,
  damageNumbers
);

const combatAnimation = new CombatAnimation(player);

// =====================================
// HUD
// =====================================

const hud = new HUD();

hud.updatePlayerHP(100, 100);
hud.updateEnergy(100, 100);
hud.updateEnemy(100, 100, true);
hud.updateKills(0);

// =====================================
// INVENTORY
// =====================================

const inventory = new InventoryManager();

// =====================================
// DROP SYSTEM
// =====================================

const dropManager = new DropManager(
  inventory,
  hud
);

// =====================================
// ABILITY SYSTEM
// =====================================

const abilityManager = new AbilityManager(
  player,
  enemy,
  inventory,
  hud,
  vfx,
  damageNumbers,
  projectileManager,
  combatAnimation
);

// =====================================
// ABILITY UI
// =====================================

const abilityUI = new AbilityUI(
  inventory,
  abilityManager,
  hud
);

// =====================================
// KILL EVENT
// =====================================

abilityManager.onKill = () => {

  const droppedItem = dropManager.onEnemyKilled();

  hud.updateKills(
    dropManager.getProgress().current
  );

  if (droppedItem) {
    abilityUI.unlockRefresh();
  }

};

// =====================================
// KEYBOARD SKILL INPUT
// =====================================

window.addEventListener("keydown", (event) => {

  if (event.repeat || paused) return;

  const category = inventory.activeAbility;

  if (!category) return;

  const config = {
    combat: [
      { key: "KeyF", index: 0 },
      { key: "KeyZ", index: 1 },
      { key: "KeyX", index: 2 }
    ],

    melee: [
      { key: "KeyF", index: 0 },
      { key: "KeyZ", index: 1 }
    ],

    ranged: [
      { key: "KeyF", index: 0 },
      { key: "KeyZ", index: 1 }
    ],

    fruit: [
      { key: "KeyF", index: 0 },
      { key: "KeyZ", index: 1 },
      { key: "KeyX", index: 2 }
    ]
  };

  const skill = config[category]?.find(
    item => item.key === event.code
  );

  if (skill) {
    abilityManager.useSkill(
      category,
      skill.index
    );
  }

});

// =====================================
// PAUSE
// =====================================

let paused = false;

const pauseScreen = document.getElementById("pause-screen");

function togglePause(value) {
  paused = value;
  pauseScreen?.classList.toggle("hidden", !paused);
}

document.getElementById("pause-button")
  ?.addEventListener("click", () => {
    togglePause(!paused);
  });

document.getElementById("resume-button")
  ?.addEventListener("click", () => {
    togglePause(false);
  });

window.addEventListener("keydown", (event) => {
  if (event.code === "Escape") {
    togglePause(!paused);
  }
});

// =====================================
// DASH
// =====================================

document.getElementById("dash-button")
  ?.addEventListener("click", () => {

    if (paused) return;

    const forward = new THREE.Vector3(0, 0, -1);

    forward.applyQuaternion(
      player.group.quaternion
    );

    player.group.position.addScaledVector(
      forward,
      2.5
    );

  });

// =====================================
// RESET
// =====================================

document.getElementById("reset-button")
  ?.addEventListener("click", () => {

    player.group.position.set(0, 0, 0);

    controller.verticalVelocity = 0;
    controller.grounded = true;

    enemy.hp = enemy.maxHP;
    enemy.alive = true;
    enemy.group.visible = true;
    enemy.group.position.copy(enemy.spawnPosition);

    abilityManager.energy = 100;
    dropManager.killCount = 0;

    hud.updateEnemy(100, 100, true);
    hud.updateEnergy(100, 100);
    hud.updateKills(0);

    togglePause(false);

  });

// =====================================
// RESIZE
// =====================================

window.addEventListener("resize", () => {

  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  gameRenderer.resize();

});

// =====================================
// GAME LOOP
// =====================================

const clock = new THREE.Clock();

function animate() {

  requestAnimationFrame(animate);

  const delta = Math.min(
    clock.getDelta(),
    0.05
  );

  if (!paused) {
    controller.update(delta);
    followCamera.update(delta);

    enemy.update(delta, player.group.position);

    abilityManager.update(delta);

    vfx.update(delta);
    damageNumbers.update(delta);
    projectileManager.update(delta);
    combatAnimation.update(delta);
  }

  gameRenderer.render(scene, camera);

}

animate();

console.log("PROJECT AETHER BATCH 4 READY");
