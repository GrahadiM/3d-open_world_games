
export class HUD {
  constructor() {
    this.hpBar = document.getElementById("player-hp");
    this.hpText = document.getElementById("player-hp-text");

    this.energyBar = document.getElementById("player-energy");
    this.energyText = document.getElementById("player-energy-text");

    this.enemyBar = document.getElementById("enemy-hp");
    this.enemyText = document.getElementById("enemy-hp-text");
    this.enemyStatus = document.getElementById("enemy-status");

    this.killCounter = document.getElementById("kill-count");
    this.message = document.getElementById("game-message");
  }

  updatePlayerHP(hp, maxHP) {
    const percentage = (hp / maxHP) * 100;

    this.hpBar.style.width = `${percentage}%`;
    this.hpText.textContent = `${Math.ceil(hp)}/${maxHP}`;
  }

  updateEnergy(energy, maxEnergy) {
    const percentage = (energy / maxEnergy) * 100;

    this.energyBar.style.width = `${percentage}%`;
    this.energyText.textContent =
      `${Math.ceil(energy)}/${maxEnergy}`;
  }

  updateEnemy(hp, maxHP, alive) {
    const percentage = (hp / maxHP) * 100;

    this.enemyBar.style.width = `${percentage}%`;
    this.enemyText.textContent =
      `${Math.ceil(hp)}/${maxHP} HP`;

    this.enemyStatus.textContent =
      alive ? "TRAINING DUMMY" : "RESPAWNING";
  }

  updateKills(kills) {
    this.killCounter.textContent = kills;
  }

  showMessage(message) {
    this.message.textContent = message;
  }
}
