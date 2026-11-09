
export class CharacterController {
  constructor(player) {
    this.player = player;

    this.keys = {};
    this.joystick = { x: 0, y: 0 };

    this.speed = 7;
    this.gravity = 20;
    this.jumpPower = 8;
    this.dashTime = 0;

    this.bindKeyboard();
    this.bindJoystick();
    this.bindButtons();
  }

  bindKeyboard() {
    window.addEventListener('keydown', (event) => {
      this.keys[event.code] = true;

      if (event.code === 'Space') {
        this.jump();
      }

      if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
        this.dash();
      }
    });

    window.addEventListener('keyup', (event) => {
      this.keys[event.code] = false;
    });
  }

  bindJoystick() {
    const base = document.getElementById('joystick');
    const stick = document.getElementById('joystick-stick');

    if (!base || !stick) return;

    let active = false;
    let pointerId = null;

    const update = (event) => {
      const rect = base.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let dx = event.clientX - centerX;
      let dy = event.clientY - centerY;

      const max = rect.width * 0.32;
      const length = Math.hypot(dx, dy);

      if (length > max) {
        dx = (dx / length) * max;
        dy = (dy / length) * max;
      }

      this.joystick.x = dx / max;
      this.joystick.y = dy / max;

      stick.style.transform =
        `translate(${dx}px, ${dy}px)`;
    };

    base.addEventListener('pointerdown', (event) => {
      active = true;
      pointerId = event.pointerId;
      base.setPointerCapture(pointerId);
      update(event);
    });

    base.addEventListener('pointermove', (event) => {
      if (active && event.pointerId === pointerId) {
        update(event);
      }
    });

    const release = (event) => {
      if (!active || event.pointerId !== pointerId) return;

      active = false;
      pointerId = null;
      this.joystick.x = 0;
      this.joystick.y = 0;
      stick.style.transform = 'translate(0px, 0px)';
    };

    base.addEventListener('pointerup', release);
    base.addEventListener('pointercancel', release);
  }

  bindButtons() {
    document.getElementById('jump-button')
      ?.addEventListener('click', () => this.jump());

    document.getElementById('dash-button')
      ?.addEventListener('click', () => this.dash());
  }

  jump() {
    if (!this.player.isGrounded) return;

    this.player.velocityY = this.jumpPower;
    this.player.isGrounded = false;
  }

  dash() {
    if (this.dashTime > 0) return;

    this.dashTime = 0.18;
  }

  update(delta) {
    const forward =
      (this.keys.KeyW || this.keys.ArrowUp ? 1 : 0) -
      (this.keys.KeyS || this.keys.ArrowDown ? 1 : 0) -
      this.joystick.y;

    const right =
      (this.keys.KeyD || this.keys.ArrowRight ? 1 : 0) -
      (this.keys.KeyA || this.keys.ArrowLeft ? 1 : 0) +
      this.joystick.x;

    const direction = { x: right, z: -forward };
    const length = Math.hypot(direction.x, direction.z);

    this.player.isMoving = length > 0.08;

    if (length > 1) {
      direction.x /= length;
      direction.z /= length;
    }

    let moveSpeed = this.speed;

    if (this.dashTime > 0) {
      moveSpeed *= 2.5;
      this.dashTime -= delta;
    }

    const position = this.player.group.position;

    if (length > 0.08) {
      position.x += direction.x * moveSpeed * delta;
      position.z += direction.z * moveSpeed * delta;

      // Karakter menghadap arah gerakan
      const targetRotation = Math.atan2(
        direction.x,
        direction.z
      );

      let difference =
        targetRotation - this.player.group.rotation.y;

      difference = Math.atan2(
        Math.sin(difference),
        Math.cos(difference)
      );

      this.player.group.rotation.y += difference *
        Math.min(1, delta * 12);
    }

    // Gravitasi dan lompat
    this.player.velocityY -= this.gravity * delta;
    position.y += this.player.velocityY * delta;

    if (position.y <= 0) {
      position.y = 0;
      this.player.velocityY = 0;
      this.player.isGrounded = true;
    }

    // Batas area pulau
    const maxRadius = 25;
    const radius = Math.hypot(position.x, position.z);

    if (radius > maxRadius) {
      position.x *= maxRadius / radius;
      position.z *= maxRadius / radius;
    }
  }
}
