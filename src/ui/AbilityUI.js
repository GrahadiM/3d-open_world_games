
import { ABILITY_CONFIG } from "../abilities/AbilityConfig.js";

export class AbilityUI {
  constructor(inventory, abilityManager, hud) {
    this.inventory = inventory;
    this.abilityManager = abilityManager;
    this.hud = hud;

    this.activeCategory = null;

    this.selector = document.getElementById("ability-selector");
    this.skillPanel = document.getElementById("skill-panel");

    this.renderSelector();
  }

  renderSelector() {
    this.selector.innerHTML = "";

    for (const [category, config] of Object.entries(ABILITY_CONFIG)) {
      const owned = this.inventory.owns(category);

      const button = document.createElement("button");

      button.className = "ability-category";
      button.dataset.category = category;
      button.disabled = !owned;

      button.innerHTML = `
        <span class="ability-icon">${config.icon}</span>
        <span class="ability-name">${config.name}</span>
        ${owned ? "" : '<span class="locked-label">LOCKED</span>'}
      `;

      button.addEventListener("click", () => {
        this.selectCategory(category);
      });

      this.selector.appendChild(button);
    }

    this.updateSelector();
  }

  selectCategory(category) {
    if (!this.inventory.owns(category)) {
      this.hud.showMessage("Kekuatan belum diperoleh!");
      return;
    }

    // Klik kategori aktif kembali = OFF
    if (this.activeCategory === category) {
      this.activeCategory = null;
      this.inventory.activeAbility = null;

      this.skillPanel.classList.add("hidden");
      this.updateSelector();

      return;
    }

    this.activeCategory = category;
    this.inventory.select(category);

    this.renderSkills(category);
    this.skillPanel.classList.remove("hidden");

    this.updateSelector();
  }

  renderSkills(category) {
    const config = ABILITY_CONFIG[category];

    this.skillPanel.innerHTML = `
      <div class="skill-heading">
        ${config.icon} ${config.name}
      </div>
      <div class="skill-list"></div>
    `;

    const list = this.skillPanel.querySelector(".skill-list");

    config.skills.forEach((skill, index) => {
      const button = document.createElement("button");

      button.className = "skill-button";

      button.innerHTML = `
        <span>${skill.name}</span>
        <kbd>${skill.key}</kbd>
        <small>${skill.energy} ENERGY</small>
      `;

      button.addEventListener("click", () => {
        this.abilityManager.useSkill(category, index);
      });

      list.appendChild(button);
    });
  }

  updateSelector() {
    this.selector.querySelectorAll("button").forEach(button => {
      const selected =
        button.dataset.category === this.activeCategory;

      button.classList.toggle("selected", selected);
    });
  }

  unlockRefresh() {
    this.renderSelector();

    if (this.activeCategory &&
        !this.inventory.owns(this.activeCategory)) {
      this.activeCategory = null;
      this.skillPanel.classList.add("hidden");
    }
  }
}
