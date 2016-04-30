app.constant('crafting', {
  crafts: [
    {"discipline": "Armorsmith"},
    {"discipline": "Artificier"},
    {"discipline": "Chef"},
    {"discipline": "Huntsman"},
    {"discipline": "Jeweler"},
    {"discipline": "Leatherworker"},
    {"discipline": "Scribe"},
    {"discipline": "Tailor"},
    {"discipline": "Weaponsmith"}
  ],
  craftClass: ["weapon", "armor", "trinket", "food", "component", "refinement", "guild", "other"],
  craftType: {
    "weapon": ["Axe", "Dagger", "Focus", "Greatsword", "Hammer", "Harpoon", "LongBow", "Mace", "Pistol", 
               "Rifle", "Scepter", "Shield", "ShortBow", "Speargun", "Staff", "Sword", "Torch", "Trident", "Warhorn"
              ],
    "armor": ["Boots", "Coat", "Gloves", "Helm", "Leggings", "Shoulders"],
    "trinket": ["Amulet", "Earring", "Ring"],
    "food": ["Dessert", "Feast", "IngredientCooking", "Meal", "Seasoning", "Snack", "Soup", "Food"],
    "component": ["Component", "Inscription", "Insignia", "LegendaryComponent"],
    "refinement": ["Refinement", "RefinementEctoplasm", "RefinementObsidian"],
    "guild": ["GuildConsumable", "GuildDecoration", "GuildConsumableWvw"],
    "other": ["Backpack", "Bag", "Bulk", "Consumable", "Dye", "Potion", "UpgradeComponent"]
  }
});