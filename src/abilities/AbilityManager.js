
import { ABILITY_CONFIG } from "./AbilityConfig.js";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export class AbilityManager {
  constructor(player, enemy, inventory, hud) {
    this.player = player;
    this.enemy = enemy;
    this.inventory = inventory;
    this.hud = hud;

    this.energy = 100;
    this.maxEnergy = 100;

    this.lastUsed = {};

    this.knockbackVelocity = new THREE.Vector3();
  }

  useSkill(category, skillIndex) {
    if (!this.inventory.owns(category)) {
      this.hud.showMessage("Kekuatan belum dimiliki!");
      return false;
    }

    const config = ABILITY_CONFIG[category];
    const skill = config?.skills[skillIndex];

    if (!skill) return false;

    const now = performance.now() / 1000;
    const cooldownKey = `${category}_${skill.id}`;

    if (
      now - (this.lastUsed[cooldownKey] ?? -Infinity)
      < skill.cooldown
    ) {
      this.hud.showMessage("Skill masih cooldown!");
      return false;
    }

    if (this.energy < skill.energy) {
      this.hud.showMessage("Energy tidak cukup!");
      return false;
    }

    this.energy -= skill.energy;
    this.lastUsed[cooldownKey] = now;

    this.attack(skill);

    this.hud.updateEnergy(this.energy, this.maxEnergy);

    return true;
  }

  attack(skill) {
    if (!this.enemy.alive) return;

    const playerPosition = this.player.group.position;
    const enemyPosition = this.enemy.group.position;

    const distance = playerPosition.distanceTo(enemyPosition);

    if (distance > skill.range) {
      this.hud.showMessage("Musuh terlalu jauh!");
      return;
    }

    const killed = this.enemy.takeDamage(skill.damage);

    if (skill.knockback && this.enemy.alive) {
      const direction = new THREE.Vector3()
        .subVectors(enemyPosition, playerPosition);

      direction.y = 0;
      direction.normalize();

      this.enemy.group.position.addScaledVector(
        direction,
        skill.knockback
      );
    }

    this.hud.showMessage(
      `${skill.name}: ${skill.damage} DAMAGE`
    );

    this.hud.updateEnemy(
      this.enemy.hp,
      this.enemy.maxHP,
      this.enemy.alive
    );

    if (killed && this.onKill) {
      this.onKill();
    }
  }

  onKill = null;

  update(delta) {
    this.energy = Math.min(
      this.maxEnergy,
      this.energy + delta * 5
    );

    this.hud.updateEnergy(
      this.energy,
      this.maxEnergy
    );
  }
}
