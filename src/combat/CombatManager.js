
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export class CombatManager {
  constructor(player, enemy, hud) {
    this.player = player;
    this.enemy = enemy;
    this.hud = hud;

    this.energy = 100;
    this.maxEnergy = 100;

    this.cooldowns = {
      basic: 0.35,
      super: 2,
      knockback: 4
    };

    this.lastUsed = {
      basic: 0,
      super: 0,
      knockback: 0
    };

    this.damage = {
      basic: 12,
      super: 25,
      knockback: 35
    };

    this.energyCost = {
      basic: 0,
      super: 12,
      knockback: 20
    };

    this.kills = 0;
    this.knockbackVelocity = new THREE.Vector3();
  }

  useSkill(type) {
    const now = performance.now() / 1000;

    if (!this.cooldowns[type]) return;

    if (
      now - this.lastUsed[type] <
      this.cooldowns[type]
    ) {
      this.hud.showMessage("Skill masih cooldown!");
      return;
    }

    const cost = this.energyCost[type];

    if (this.energy < cost) {
      this.hud.showMessage("Energy tidak cukup!");
      return;
    }

    this.energy -= cost;
    this.lastUsed[type] = now;

    this.attack(type);

    this.hud.updateEnergy(
      this.energy,
      this.maxEnergy
    );
  }

  attack(type) {
    if (!this.enemy.alive) return;

    const playerPosition = this.player.group.position;
    const enemyPosition = this.enemy.group.position;

    const distance = playerPosition.distanceTo(
      enemyPosition
    );

    const maxRange = type === "basic" ? 3 : 5;

    if (distance > maxRange) {
      this.hud.showMessage("Musuh terlalu jauh!");
      return;
    }

    const damage = this.damage[type];

    const killed = this.enemy.takeDamage(damage);

    if (type === "knockback" && this.enemy.alive) {
      const direction = new THREE.Vector3()
        .subVectors(enemyPosition, playerPosition);

      direction.y = 0;
      direction.normalize();

      this.enemy.group.position.addScaledVector(
        direction,
        2.5
      );
    }

    this.hud.showMessage(
      `${type.toUpperCase()} HIT: ${damage} DAMAGE`
    );

    this.hud.updateEnemy(
      this.enemy.hp,
      this.enemy.maxHP,
      this.enemy.alive
    );

    if (killed) {
      this.kills++;

      this.hud.updateKills(this.kills);
      this.hud.showMessage("ENEMY DEFEATED!");
    }
  }

  update(delta) {
    this.energy = Math.min(
      this.maxEnergy,
      this.energy + delta * 5
    );

    this.hud.updateEnergy(
      this.energy,
      this.maxEnergy
    );

    this.hud.updateEnemy(
      this.enemy.hp,
      this.enemy.maxHP,
      this.enemy.alive
    );
  }
}
