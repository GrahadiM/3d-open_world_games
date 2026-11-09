
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class ThirdPersonCamera {
  constructor(camera, player) {
    this.camera = camera;
    this.player = player;

    this.offset = new THREE.Vector3(0, 5, -8);
    this.lookOffset = new THREE.Vector3(0, 1.4, 0);

    this.camera.position.set(0, 5, 8);
    this.camera.lookAt(0, 1, 0);
  }

  update(delta) {
    const targetPosition = this.player.group.position;

    const rotatedOffset = this.offset.clone()
      .applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        this.player.group.rotation.y
      );

    const desiredPosition = targetPosition.clone()
      .add(rotatedOffset);

    const smoothing = 1 - Math.exp(-6 * delta);

    this.camera.position.lerp(
      desiredPosition,
      smoothing
    );

    const lookTarget = targetPosition.clone()
      .add(this.lookOffset);

    this.camera.lookAt(lookTarget);
  }
}
