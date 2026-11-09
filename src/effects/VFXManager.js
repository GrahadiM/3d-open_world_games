
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export class VFXManager {
  constructor(scene) {
    this.scene = scene;
    this.effects = [];
    this.geometry = new THREE.SphereGeometry(1, 8, 6);
  }

  createImpact(position, color = 0x55ccff, size = 1) {
    if (this.effects.length >= 30) return;

    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.9,
      depthWrite: false
    });

    const mesh = new THREE.Mesh(this.geometry, material);
    mesh.position.copy(position);
    mesh.scale.setScalar(0.2);

    this.scene.add(mesh);

    this.effects.push({
      mesh,
      life: 0.25,
      maxLife: 0.25,
      size
    });
  }

  createShockwave(position, color = 0x55ccff) {
    if (this.effects.length >= 30) return;
    
    const geometry = new THREE.RingGeometry(0.7, 1, 24);

    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.copy(position);
    mesh.position.y += 0.08;
    mesh.scale.setScalar(0.3);

    this.scene.add(mesh);

    this.effects.push({
      mesh,
      life: 0.5,
      maxLife: 0.5,
      size: 2.8
    });
  }

  createExplosion(position, color = 0xff8b25) {
    this.createShockwave(position, color);
    this.createImpact(position, color, 2);
  }

  update(delta) {
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const effect = this.effects[i];

      effect.life -= delta;

      const progress = 1 - Math.max(
        0,
        effect.life / effect.maxLife
      );

      const scale = 0.2 + progress * effect.size;

      effect.mesh.scale.setScalar(scale);
      effect.mesh.material.opacity = Math.max(
        0,
        1 - progress
      );

      if (effect.life <= 0) {
        this.scene.remove(effect.mesh);
        effect.mesh.material.dispose();
        if (effect.mesh.geometry !== this.geometry) {
          effect.mesh.geometry.dispose();
        }
        this.effects.splice(i, 1);
      }
    }
  }

  clear() {
    for (const effect of this.effects) {
      this.scene.remove(effect.mesh);
      effect.mesh.material.dispose();
      if (effect.mesh.geometry !== this.geometry) {
        effect.mesh.geometry.dispose();
      }
    }

    this.effects.length = 0;
  }
}
