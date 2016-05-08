app.constant('crafting', {
  disciplines: [
    "Armorsmith",
    "Artificer",
    "Chef",
    "Huntsman",
    "Jeweler",
    "Leatherworker",
    "Scribe",
    "Tailor",
    "Weaponsmith"
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

app.constant('scribeBase64', {
  "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAMHSURBVDiNndRPSBRRHAfw7/zb2d3aXcf956YVWFqaEBVR2aFC3AorCBIRguoQQR2i6A8dgi7doktdgi4dwyiK/lChhSWFHRIsSbOWddd2151cx52d2Zmd96ZLRqml+T394L3fhx/vPR6DBecSG4j0rvd4vPvB2Mtjg7cPAgD/v4w/0lJX5vOeZPnhltqaRmdNwzZ/d+f9ROzn+rzB0NK9UY/XdzkSWbJsR1NzsLamjvmc0DGSNmCamjW1b04wVLlni8fru1Hf0FC1c9ceSZLKYdvA54SGkbQBgacwdKV7TtC3rEVyM8yJ6upVp9sPHpYkqRwsYwOwEUsZSGRMAED66ztVlnNX/wn6K3c1eV2e65Pq5IrWtjYhFCwDyxA4BIp4ykLqewmU2hB50x768KIrl3nc/1cwHI6GKMN3hELBEmwby5eGwLIUbqeFcYViVLahFSlE3kJv161UJq8e+r1/BugNBC+IDt4ZCvvNrY0bBNFhwyVa0IsEH4YU8vzhXSud+MJQ2+wjtnVqIv5o4vd+dprHCBxz4Py5E65I2B+INjdikduCwFMMjjhQQhm3dvN+sXr1Rs7Bc2QsXuidPtAfYDgcDYYrAlxVlYSd0U3cYjfg5C0MxJxQdYqCTqCMjxE5O0r1onkPeGn9EywxXEAq93CiQFFZ4cVit4VYygNVJzAMA8TMEo6OaRzyfQZr35yOzThD1hISmXSWiAKBKBAMJXxQChQFnaJk5jHwvtsa7H+raKbZpmSe5WYD/5hQlh/kJ/NqyS0SjOVc0AwOBZ2AEg0DfT0T6cTAHaNA1iiZZ7HZsBkTAq2cYZhsTikimQaSo1+Mrq5X+W/JWE9Wls9kk0+H/wbNCtbWMxd3N68vP3LsSrxolq6pBa1PcjGvh4efGHNBM8AlK/ZtragoO84yIGpBPzsae9ABAN/nK01P3dr2T71veuyGde1JYPt/f2tT+XUpgsAJnS/7i5ZBbs72vuYbZqqoqW/NcBwrf6J0HT52mAsFualCdK90quPWUS1+T18oBgA/ALikUiwR/hAeAAAAAElFTkSuQmCC"
});

app.constant('RenderIds', {
    "Armorsmith": "map_crafting_armorsmith",
    "Artificer": "map_crafting_artificer",
    "Chef": "map_crafting_cook",
    "Huntsman": "map_crafting_huntsman",
    "Jeweler": "map_crafting_jeweler",
    "Leatherworker": "map_crafting_leatherworker",
    "Scribe": "map_crafting_scribe",
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

app.constant('RarityColourCode', {
    "Junk": "#AAA",
    "Basic": "#FFFFFF",
    "Fine": "#62A4DA",
    "Masterwork": "#1a9306",
    "Rare": "#fcd00b",
    "Exotic": "#ffa405",
    "Ascended": "#fb3e8d", 
    "Legendary": "#4C139D"
});

app.constant('endpoints', {
  v1Url: "https://api.guildwars2.com/v1/",
  v2Url: "https://api.guildwars2.com/v2/",
  account: "account",
  accountMaterials: "account/materials",
  accountBank: "account/bank",
  accountInventory: "account/inventory",
  accountWallet: "account/wallet",
  tokenInfo: "tokeninfo",
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

app.constant("AppProperties", {
  requiredPermissions: ["account", "characters", "inventories", "tradingpost"]
});