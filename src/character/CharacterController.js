import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export class CharacterController {
  constructor(player, camera, joystick, joystickStick) {
    this.player = player;
    this.camera = camera;

    this.speed = 7;
    this.jumpForce = 8;
    this.gravity = 22;
    this.verticalVelocity = 0;
    this.grounded = true;

    this.keys = {};
    this.joystick = joystick;
    this.joystickStick = joystickStick;
    this.joystickInput = new THREE.Vector2();

    this.boundary = 22;

    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
    });

    this.bindJoystick();

    document.getElementById("jump-button")?.addEventListener("click", () => {
      this.jump();
    });
  }

  bindJoystick() {
    if (!this.joystick || !this.joystickStick) return;

    let active = false;
    const maxDistance = 42;

    const moveStick = (clientX, clientY) => {
      const rect = this.joystick.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let dx = clientX - centerX;
      let dy = clientY - centerY;

      const length = Math.hypot(dx, dy);
      if (length > maxDistance) {
        dx = (dx / length) * maxDistance;
        dy = (dy / length) * maxDistance;
      }

      this.joystickInput.set(dx / maxDistance, -dy / maxDistance);
      this.joystickStick.style.transform =
        `translate(${dx}px, ${dy}px)`;
    };

    const stopStick = () => {
      active = false;
      this.joystickInput.set(0, 0);
      this.joystickStick.style.transform = "translate(0px, 0px)";
    };

    this.joystick.addEventListener("pointerdown", (e) => {
      active = true;
      this.joystick.setPointerCapture(e.pointerId);
      moveStick(e.clientX, e.clientY);
    });

    this.joystick.addEventListener("pointermove", (e) => {
      if (active) moveStick(e.clientX, e.clientY);
    });

    this.joystick.addEventListener("pointerup", stopStick);
    this.joystick.addEventListener("pointercancel", stopStick);
    this.joystick.addEventListener("lostpointercapture", stopStick);
  }

  jump() {
    if (!this.grounded) return;

    this.verticalVelocity = this.jumpForce;
    this.grounded = false;
  }

  update(delta) {
    const inputX =
      (this.keys["KeyD"] || this.keys["ArrowRight"] ? 1 : 0) -
      (this.keys["KeyA"] || this.keys["ArrowLeft"] ? 1 : 0) +
      this.joystickInput.x;

    const inputZ =
      (this.keys["KeyS"] || this.keys["ArrowDown"] ? 1 : 0) -
      (this.keys["KeyW"] || this.keys["ArrowUp"] ? 1 : 0) -
      this.joystickInput.y;

    const input = new THREE.Vector3(inputX, 0, inputZ);
    const moving = input.lengthSq() > 0.01;

    if (moving) {
      input.normalize();

      // Gerakan mengikuti arah kamera, tetapi tetap pada bidang horizontal.
      const forward = new THREE.Vector3();
      this.camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();

      const right = new THREE.Vector3()
        .crossVectors(forward, new THREE.Vector3(0, 1, 0))
        .normalize();

      const direction = new THREE.Vector3()
        .addScaledVector(right, input.x)
        .addScaledVector(forward, -input.z)
        .normalize();

      this.player.group.position.addScaledVector(
        direction,
        this.speed * delta
      );

      const targetAngle = Math.atan2(direction.x, direction.z);
      this.player.group.rotation.y = THREE.MathUtils.lerp(
        this.player.group.rotation.y,
        targetAngle,
        Math.min(1, delta * 12)
      );
    }

    // Batas area pulau.
    this.player.group.position.x = THREE.MathUtils.clamp(
      this.player.group.position.x,
      -this.boundary,
      this.boundary
    );

    this.player.group.position.z = THREE.MathUtils.clamp(
      this.player.group.position.z,
      -this.boundary,
      this.boundary
    );

    // Gravitasi dan lompat.
    this.verticalVelocity -= this.gravity * delta;
    this.player.group.position.y += this.verticalVelocity * delta;

    if (this.player.group.position.y <= 0) {
      this.player.group.position.y = 0;
      this.verticalVelocity = 0;
      this.grounded = true;
    }

    this.player.updateAnimation(delta, moving);
  }
}