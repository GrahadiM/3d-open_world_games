
export class DropManager {
  constructor(inventory, hud) {
    this.inventory = inventory;
    this.hud = hud;

    this.killCount = 0;
    this.nextThreshold = this.randomWeaponThreshold();

    this.weaponOrder = ["melee", "ranged"];
    this.weaponIndex = 0;

    this.fruitThreshold = this.randomFruitThreshold();
    this.fruitDropAvailable = false;
  }

  randomWeaponThreshold() {
    return Math.floor(Math.random() * 3) + 3;
  }

  randomFruitThreshold() {
    return Math.floor(Math.random() * 6) + 5;
  }

  onEnemyKilled() {
    this.killCount++;

    this.hud.showMessage(
      `KILL PROGRESS: ${this.killCount}`
    );

    // Weapon drops
    if (this.weaponIndex < this.weaponOrder.length) {
      if (this.killCount >= this.nextThreshold) {
        const item = this.weaponOrder[this.weaponIndex];

        if (this.inventory.unlock(item)) {
          this.weaponIndex++;

          this.killCount = 0;
          this.nextThreshold = this.randomWeaponThreshold();

          this.hud.showMessage(
            `WEAPON OBTAINED: ${item.toUpperCase()}!`
          );

          this.checkFruitUnlock();
          return item;
        }
      }
    }

    // Fruit drops after both weapons obtained
    if (
      this.inventory.owns("melee") &&
      this.inventory.owns("ranged") &&
      !this.inventory.owns("fruit")
    ) {
      if (this.killCount >= this.fruitThreshold) {
        this.inventory.unlock("fruit");

        this.killCount = 0;
        this.fruitThreshold = this.randomFruitThreshold();

        this.hud.showMessage(
          "RARE DROP: FRUIT POWER OBTAINED!"
        );

        return "fruit";
      }
    }

    return null;
  }

  checkFruitUnlock() {
    if (
      this.inventory.owns("melee") &&
      this.inventory.owns("ranged")
    ) {
      this.killCount = 0;
      this.fruitThreshold = this.randomFruitThreshold();

      this.hud.showMessage(
        "ALL WEAPONS COLLECTED! FRUIT DROP ACTIVATED!"
      );
    }
  }

  getProgress() {
    if (!this.inventory.owns("melee") ||
        !this.inventory.owns("ranged")) {
      return {
        current: this.killCount,
        target: this.nextThreshold,
        type: "WEAPON"
      };
    }

    if (!this.inventory.owns("fruit")) {
      return {
        current: this.killCount,
        target: this.fruitThreshold,
        type: "FRUIT"
      };
    }

    return {
      current: 0,
      target: 0,
      type: "COMPLETE"
    };
  }
}
