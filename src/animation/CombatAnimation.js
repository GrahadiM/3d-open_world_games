
export class CombatAnimation {
  constructor(player) {
    this.player = player;
    this.active = null;
    this.time = 0;
    this.duration = 0.25;
    this.originalRotation = 0;
  }

  play(type = "punch") {
    this.active = type;
    this.time = 0;

    this.originalRotation =
      this.player.rightArm.rotation.x;
  }

  update(delta) {
    if (!this.active) return;

    this.time += delta;

    const progress = Math.min(
      this.time / this.duration,
      1
    );

    // Gerakan cepat maju kemudian kembali.
    const swing = Math.sin(progress * Math.PI);

    if (this.active === "punch") {
      this.player.rightArm.rotation.x =
        this.originalRotation - swing * 1.5;
    }

    if (this.active === "heavy") {
      this.player.rightArm.rotation.x =
        this.originalRotation - swing * 2;
    }

    if (this.time >= this.duration) {
      this.player.rightArm.rotation.x =
        this.originalRotation;

      this.active = null;
    }
  }
}
