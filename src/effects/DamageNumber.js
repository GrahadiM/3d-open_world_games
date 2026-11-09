
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export class DamageNumber {
  constructor(scene) {
    this.scene = scene;
    this.items = [];
  }

  show(position, damage, color = "#ffffff") {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 96;

    const context = canvas.getContext("2d");

    context.font = "bold 52px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";

    context.lineWidth = 8;
    context.strokeStyle = "#172235";
    context.strokeText(String(damage), 128, 48);

    context.fillStyle = color;
    context.fillText(String(damage), 128, 48);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    });

    const sprite = new THREE.Sprite(material);

    sprite.position.copy(position);
    sprite.position.y += 2.8;
    sprite.scale.set(1.7, 0.65, 1);

    this.scene.add(sprite);

    this.items.push({
      sprite,
      life: 0.9,
      velocity: 1.2
    });
  }

  update(delta) {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];

      item.life -= delta;
      item.sprite.position.y += item.velocity * delta;

      item.sprite.material.opacity = Math.max(
        0,
        item.life / 0.9
      );

      if (item.life <= 0) {
        this.scene.remove(item.sprite);

        item.sprite.material.map.dispose();
        item.sprite.material.dispose();

        this.items.splice(i, 1);
      }
    }
  }
}
