
export class InventoryManager {
  constructor() {
    this.items = {
      combat: true,
      melee: false,
      ranged: false,
      fruit: false
    };

    this.activeAbility = "combat";
  }

  owns(category) {
    return this.items[category] === true;
  }

  unlock(category) {
    if (!(category in this.items)) return false;

    if (this.items[category]) return false;

    this.items[category] = true;
    return true;
  }

  select(category) {
    if (!this.owns(category)) {
      return false;
    }

    this.activeAbility = category;
    return true;
  }

  getOwnedItems() {
    return Object.keys(this.items).filter(
      key => this.items[key]
    );
  }
}
