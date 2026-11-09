import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export class ThirdPersonCamera {
  constructor(camera, player) {
    this.camera = camera;
    this.player = player;

    this.offset = new THREE.Vector3(0, 5, 8);
    this.lookOffset = new THREE.Vector3(0, 1.3, 0);
    this.followSpeed = 7;

    this.targetPosition = new THREE.Vector3();
    this.lookTarget = new THREE.Vector3();
  }

  update(delta) {
    this.targetPosition
      .copy(this.player.group.position)
      .add(this.offset);

    this.camera.position.lerp(
      this.targetPosition,
      Math.min(1, this.followSpeed * delta)
    );

    this.lookTarget
      .copy(this.player.group.position)
      .add(this.lookOffset);

    this.camera.lookAt(this.lookTarget);
  }
}