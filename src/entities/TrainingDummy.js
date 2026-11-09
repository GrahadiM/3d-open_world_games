
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export class TrainingDummy {
  constructor(scene, position = new THREE.Vector3(0, 0, -5)) {
    this.scene = scene;

    this.maxHP = 100;
    this.hp = this.maxHP;

    this.alive = true;
    this.speed = 1.8;
    this.attackRange = 1.8;

    this.lastDamageTime = 0;
    this.regenAccumulator = 0;

    this.respawnTime = 0;
    this.respawnAt = 0;

    this.group = new THREE.Group();
    this.group.position.copy(position);

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xa34f48
    });

    const headMaterial = new THREE.MeshStandardMaterial({
      color: 0xd5a27f
    });

    this.body = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 1.5, 0.65),
      bodyMaterial
    );

    this.body.position.y = 0.85;
    this.body.castShadow = true;

    this.group.add(this.body);

    this.head = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 12, 10),
      headMaterial
    );

    this.head.position.y = 1.85;
    this.head.castShadow = true;

    this.group.add(this.head);

    this.scene.add(this.group);

    this.spawnPosition = position.clone();
  }

  takeDamage(amount) {
    if (!this.alive) return false;

    this.hp = Math.max(0, this.hp - amount);

    this.lastDamageTime = performance.now();
    this.regenAccumulator = 0;

    if (this.hp <= 0) {
      this.die();
      return true;
    }

    return false;
  }

  die() {
    if (!this.alive) return;

    this.alive = false;

    this.respawnTime = 3 + Math.random() * 2;
    this.respawnAt =
      performance.now() + this.respawnTime * 1000;

    this.group.visible = false;
  }

  respawn() {
    this.hp = this.maxHP;
    this.alive = true;

    this.group.position.copy(this.spawnPosition);

    this.group.visible = true;

    this.lastDamageTime = performance.now();
    this.regenAccumulator = 0;
  }

  update(delta, playerPosition) {
    const now = performance.now();

    // Automatic respawn
    if (!this.alive) {
      if (now >= this.respawnAt) {
        this.respawn();
      }

      return;
    }

    // Regeneration after 10 seconds without damage
    if (
      this.hp < this.maxHP &&
      now - this.lastDamageTime >= 10000
    ) {
      this.regenAccumulator += delta;

      if (this.regenAccumulator >= 0.5) {
        this.hp = Math.min(
          this.maxHP,
          this.hp + 2
        );

        this.regenAccumulator = 0;
      }
    }

    // Simple enemy movement
    const direction = new THREE.Vector3()
      .subVectors(playerPosition, this.group.position);

    direction.y = 0;

    const distance = direction.length();

    if (distance > this.attackRange && distance > 0.01) {
      direction.normalize();

      this.group.position.addScaledVector(
        direction,
        this.speed * delta
      );

      this.group.rotation.y = Math.atan2(
        direction.x,
        direction.z
      );
    }
  }
}
