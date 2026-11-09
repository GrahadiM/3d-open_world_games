
export const ABILITY_CONFIG = {
  combat: {
    name: "COMBAT",
    icon: "🥊",
    skills: [
      {
        id: "basic",
        name: "Basic Punch",
        key: "F",
        damage: 12,
        energy: 0,
        cooldown: 0.35,
        range: 3
      },
      {
        id: "super",
        name: "Super Punch",
        key: "Z",
        damage: 25,
        energy: 12,
        cooldown: 2,
        range: 5
      },
      {
        id: "knockback",
        name: "Knock Back",
        key: "X",
        damage: 35,
        energy: 20,
        cooldown: 4,
        range: 5,
        knockback: 2.5
      }
    ]
  },

  melee: {
    name: "MELEE",
    icon: "⚔️",
    skills: [
      {
        id: "slash",
        name: "Quick Slash",
        key: "F",
        damage: 20,
        energy: 5,
        cooldown: 1,
        range: 3.5
      },
      {
        id: "heavy",
        name: "Heavy Strike",
        key: "Z",
        damage: 40,
        energy: 15,
        cooldown: 3,
        range: 4
      }
    ]
  },

  ranged: {
    name: "RANGED",
    icon: "🏹",
    skills: [
      {
        id: "shot",
        name: "Quick Shot",
        key: "F",
        damage: 18,
        energy: 8,
        cooldown: 1,
        range: 12
      },
      {
        id: "burst",
        name: "Burst Shot",
        key: "Z",
        damage: 35,
        energy: 20,
        cooldown: 3,
        range: 15
      }
    ]
  },

  fruit: {
    name: "FRUIT",
    icon: "🔥",
    skills: [
      {
        id: "fireball",
        name: "Fire Ball",
        key: "F",
        damage: 30,
        energy: 15,
        cooldown: 2,
        range: 12,
        projectile: true
      },
      {
        id: "flamewave",
        name: "Flame Wave",
        key: "Z",
        damage: 45,
        energy: 25,
        cooldown: 4,
        range: 7
      },
      {
        id: "inferno",
        name: "Inferno",
        key: "X",
        damage: 65,
        energy: 40,
        cooldown: 8,
        range: 10
      }
    ]
  }
};
