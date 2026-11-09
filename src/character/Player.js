import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export class Player {
  constructor(scene) {
    this.group = new THREE.Group();
    this.group.position.set(0, 0, 0);

    const skin = new THREE.MeshStandardMaterial({ color: 0xffc89c });
    const hair = new THREE.MeshStandardMaterial({ color: 0x25213d });
    const outfit = new THREE.MeshStandardMaterial({ color: 0x2865c7 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x252b3a });

    // Badan
    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.42, 0.65, 4, 8),
      outfit
    );
    body.position.y = 1.05;
    body.castShadow = true;
    this.group.add(body);

    // Kepala
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 12, 10),
      skin
    );
    head.position.y = 1.85;
    head.castShadow = true;
    this.group.add(head);

    // Rambut
    const hairMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.55),
      hair
    );
    hairMesh.position.y = 2.02;
    hairMesh.castShadow = true;
    this.group.add(hairMesh);

    // Kaki
    this.leftLeg = this.createLimb(dark, 0.16, 0.55);
    this.leftLeg.position.set(-0.2, 0.35, 0);
    this.group.add(this.leftLeg);

    this.rightLeg = this.createLimb(dark, 0.16, 0.55);
    this.rightLeg.position.set(0.2, 0.35, 0);
    this.group.add(this.rightLeg);

    // Tangan
    this.leftArm = this.createLimb(skin, 0.13, 0.55);
    this.leftArm.position.set(-0.52, 1.12, 0);
    this.leftArm.rotation.z = 0.15;
    this.group.add(this.leftArm);

    this.rightArm = this.createLimb(skin, 0.13, 0.55);
    this.rightArm.position.set(0.52, 1.12, 0);
    this.rightArm.rotation.z = -0.15;
    this.group.add(this.rightArm);

    scene.add(this.group);

    this.isMoving = false;
    this.walkTime = 0;
  }

  createLimb(material, radius, length) {
    const limb = new THREE.Mesh(
      new THREE.CapsuleGeometry(radius, length, 3, 6),
      material
    );
    limb.castShadow = true;
    return limb;
  }

  updateAnimation(delta, moving) {
    this.isMoving = moving;

    if (moving) {
      this.walkTime += delta * 9;
      const swing = Math.sin(this.walkTime) * 0.55;

      this.leftLeg.rotation.x = swing;
      this.rightLeg.rotation.x = -swing;
      this.leftArm.rotation.x = -swing * 0.7;
      this.rightArm.rotation.x = swing * 0.7;
    } else {
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
      this.leftArm.rotation.x = 0;
      this.rightArm.rotation.x = 0;
    }
  }
}