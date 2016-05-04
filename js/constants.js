app.constant('crafting', {
  crafts: [
    {"discipline": "Armorsmith"},
    {"discipline": "Artificer"},
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

app.constant('RenderIds', {
    "Armorsmith": "map_crafting_armorsmith",
    "Artificer": "map_crafting_artificer",
    "Chef": "map_crafting_cook",
    "Huntsman": "map_crafting_huntsman",
    "Jeweler": "map_crafting_jeweler",
    "Leatherworker": "map_crafting_leatherworker",
    // "Scribe": "map_crafting_scribe",
    "Tailor": "map_crafting_tailor",
    "Weaponsmith": "map_crafting_weaponsmith",
});

app.constant('ReverseRenderIds', {
    "map_crafting_armorsmith": "Armorsmith",
    "map_crafting_artificer": "Artificer",
    "map_crafting_cook": "Chef",
    "map_crafting_huntsman": "Huntsman",
    "map_crafting_jeweler": "Jeweler",
    "map_crafting_leatherworker": "Leatherworker",
    // "map_crafting_scribe": "Scribe",
    "map_crafting_tailor": "Tailor",
    "map_crafting_weaponsmith": "Weaponsmith"
});

app.constant('endpoints', {
  v1Url: "https://api.guildwars2.com/v1/",
  v2Url: "https://api.guildwars2.com/v2/",
  accountMaterials: "account/materials",
  accountBank: "account/bank",
  accountInventory: "account/inventory",
  accountWallet: "account/wallet",
  characters: "characters",
  items: "items",
  recipes: "recipes",
  recipesSearch: "recipes/search",
  authParam: "?access_token=", 
  idsParam: "?ids=",
  pageParam: "page=",
  files: "files",
  renderService: "https://render.guildwars2.com/file/signature/file_id.png",
  idsParamLimit: 200
});