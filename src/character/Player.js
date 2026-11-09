
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class Player {
  constructor(scene) {
    this.group = new THREE.Group();

    const skin = new THREE.MeshStandardMaterial({
      color: 0xffc99b
    });

    const clothes = new THREE.MeshStandardMaterial({
      color: 0x2875cf
    });

    const dark = new THREE.MeshStandardMaterial({
      color: 0x25202c
    });

    // Badan
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 1.1, 0.45),
      clothes
    );
    body.position.y = 1.25;

    // Kepala
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 16, 16),
      skin
    );
    head.position.y = 2.1;

    // Rambut
    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 12, 10),
      dark
    );
    hair.scale.set(1, 0.65, 1);
    hair.position.set(0, 2.32, -0.04);

    // Mata sederhana
    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0x171717
    });

    for (const x of [-0.13, 0.13]) {
      const eye = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 8, 8),
        eyeMaterial
      );
      eye.position.set(x, 2.12, 0.345);
      this.group.add(eye);
    }

    // Tangan
    this.arms = [];

    for (const x of [-0.53, 0.53]) {
      const arm = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.85, 0.25),
        skin
      );
      arm.position.set(x, 1.3, 0);
      this.group.add(arm);
      this.arms.push(arm);
    }

    // Kaki
    this.legs = [];

    for (const x of [-0.22, 0.22]) {
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.27, 0.75, 0.3),
        dark
      );
      leg.position.set(x, 0.38, 0);
      this.group.add(leg);
      this.legs.push(leg);
    }

    this.group.add(body, head, hair);

    this.group.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    this.group.position.set(0, 0, 0);
    scene.add(this.group);

    this.velocityY = 0;
    this.isGrounded = true;
    this.isMoving = false;
  }

  updateAnimation(time) {
    if (this.isMoving) {
      const swing = Math.sin(time * 12) * 0.5;
      this.legs[0].rotation.x = swing;
      this.legs[1].rotation.x = -swing;
      this.arms[0].rotation.x = -swing * 0.6;
      this.arms[1].rotation.x = swing * 0.6;
    } else {
      this.legs.forEach((leg) => {
        leg.rotation.x = 0;
      });
      this.arms.forEach((arm) => {
        arm.rotation.x = 0;
      });
    }
  }
}
