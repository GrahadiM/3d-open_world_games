
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export class ProjectileManager {
  constructor(scene, vfx, damageNumbers) {
    this.scene = scene;
    this.vfx = vfx;
    this.damageNumbers = damageNumbers;
    this.projectiles = [];
  }

  fire(origin, target, damage) {
    if (this.projectiles.length >= 10) return;
    
    const geometry = new THREE.SphereGeometry(0.3, 8, 8);

    const material = new THREE.MeshBasicMaterial({
      color: 0xff721e
    });

    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.copy(origin);
    mesh.position.y += 1.4;

    this.scene.add(mesh);

    const targetPosition = target.group.position.clone();
    targetPosition.y += 1;

    const direction = new THREE.Vector3()
      .subVectors(targetPosition, mesh.position)
      .normalize();

    this.projectiles.push({
      mesh,
      target,
      direction,
      damage,
      speed: 18,
      life: 3
    });
  }

  update(delta) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];

      projectile.life -= delta;

      projectile.mesh.position.addScaledVector(
        projectile.direction,
        projectile.speed * delta
      );

      const targetPosition = projectile.target.group.position.clone();
      targetPosition.y += 1;

      const distance = projectile.mesh.position.distanceTo(
        targetPosition
      );

      if (
        projectile.target.alive &&
        distance < 0.8
      ) {
        const killed = projectile.target.takeDamage(
          projectile.damage
        );

        this.vfx.createExplosion(
          targetPosition,
          0xff721e
        );

        this.damageNumbers.show(
          targetPosition,
          projectile.damage,
          "#ffb347"
        );

        if (killed && projectile.onKill) {
          projectile.onKill();
        }

        this.remove(i);
        continue;
      }

      if (projectile.life <= 0) {
        this.remove(i);
      }
    }
  }

  remove(index) {
    const projectile = this.projectiles[index];

    this.scene.remove(projectile.mesh);
    projectile.mesh.geometry.dispose();
    projectile.mesh.material.dispose();

    this.projectiles.splice(index, 1);
  }

  clear() {
    while (this.projectiles.length > 0) {
      this.remove(this.projectiles.length - 1);
    }
  }
}
