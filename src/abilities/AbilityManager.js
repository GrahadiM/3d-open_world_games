
import { ABILITY_CONFIG } from "./AbilityConfig.js";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export class AbilityManager {
  constructor(
    player,
    enemy,
    inventory,
    hud,
    vfx,
    damageNumbers,
    projectileManager,
    combatAnimation
  ) {
    this.player = player;
    this.enemy = enemy;
    this.inventory = inventory;
    this.hud = hud;

    this.vfx = vfx;
    this.damageNumbers = damageNumbers;
    this.projectileManager = projectileManager;
    this.combatAnimation = combatAnimation;

    this.energy = 100;
    this.maxEnergy = 100;
    this.lastUsed = {};
    this.onKill = null;
  }

  useSkill(category, skillIndex) {
    if (!this.inventory.owns(category)) {
      this.hud.showMessage("Kekuatan belum dimiliki!");
      return false;
    }

    const skill = ABILITY_CONFIG[category]?.skills[skillIndex];

    if (!skill) return false;

    const now = performance.now() / 1000;
    const key = `${category}_${skill.id}`;

    if (now - (this.lastUsed[key] ?? -Infinity) < skill.cooldown) {
      this.hud.showMessage("Skill masih cooldown!");
      return false;
    }

    if (this.energy < skill.energy) {
      this.hud.showMessage("Energy tidak cukup!");
      return false;
    }

    this.energy -= skill.energy;
    this.lastUsed[key] = now;

    this.attack(skill);

    this.hud.updateEnergy(this.energy, this.maxEnergy);

    return true;
  }

  attack(skill) {
    if (!this.enemy.alive) return;

    const origin = this.player.group.position;
    const target = this.enemy.group.position;

    const distance = origin.distanceTo(target);

    if (distance > skill.range) {
      this.hud.showMessage("Musuh terlalu jauh!");
      return;
    }

    // Projectile attack
    if (skill.projectile) {
      this.combatAnimation.play("punch");

      this.projectileManager.fire(
        origin,
        this.enemy,
        skill.damage
      );

      const projectile =
        this.projectileManager.projectiles.at(-1);

      projectile.onKill = () => this.onKill?.();

      this.hud.showMessage(`${skill.name} RELEASED!`);
      return;
    }

    const killed = this.enemy.takeDamage(skill.damage);

    this.damageNumbers.show(
      target.clone().add(new THREE.Vector3(0, 1, 0)),
      skill.damage,
      skill.knockback ? "#70d9ff" : "#ffffff"
    );

    if (skill.knockback && this.enemy.alive) {
      const direction = new THREE.Vector3()
        .subVectors(target, origin);

      direction.y = 0;
      direction.normalize();

      this.enemy.group.position.addScaledVector(
        direction,
        skill.knockback
      );

      this.vfx.createShockwave(target, 0x58caff);
    } else if (categoryIsFruit(skill)) {
      this.vfx.createExplosion(target, 0xff8b25);
    } else {
      this.vfx.createImpact(target, 0x70cfff);
    }

    this.combatAnimation.play(
      skill.damage >= 35 ? "heavy" : "punch"
    );

    this.hud.showMessage(
      `${skill.name}: ${skill.damage} DAMAGE`
    );

    this.hud.updateEnemy(
      this.enemy.hp,
      this.enemy.maxHP,
      this.enemy.alive
    );

    if (killed) this.onKill?.();
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
  }
}

function categoryIsFruit(skill) {
  return skill.projectile ||
    skill.id === "flamewave" ||
    skill.id === "inferno";
}
