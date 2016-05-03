var app = angular.module('myApp', [
  "checklist-model", 
  "ui.multiselect",
  "underscore",
  "smart-table"
]);

app.run(function($rootScope, LoadService) {
  $rootScope.gw2 = {};
  $rootScope.gw2.items = [];
  $rootScope.gw2.itemIds = [];
  $rootScope.gw2.recipes = [];
  $rootScope.gw2.recipeIds = [];

  chrome.storage.local.get("recipes", function(recipes) {
    chrome.storage.local.get("items", function(items) {
      if ((items["items"] === undefined) || (recipes["recipes"] === undefined)) {
        chrome.storage.local.set({
          "recipes": [],
          "items": []
        }, () => {
          LoadService.fetchRecipesAndItems();
        });
        console.log("Fetched from server");
      } else {
        $rootScope.gw2.recipes = recipes["recipes"];
        $rootScope.gw2.items = items["items"];
        $rootScope.gw2.recipesIds = $rootScope.gw2.recipes.map((recipe) => {
          return recipes["id"];
        });
        $rootScope.gw2.itemIds = $rootScope.gw2.items.map((item) => {
          return item["id"];
        });
        console.log("Loaded from local storage");    
      }
    });
  });
});

app.service('LoadService', function($rootScope, endpoints, _) {
  this.fetchRecipesAndItems = function() {
    var query = endpoints.v2Url + endpoints.recipes;
    httpGetAsync(query, (res) => {
      $rootScope.gw2.recipes = [];
      $rootScope.gw2.recipeIds = $.parseJSON(res);

      var idsPerChunk = endpoints.idsParamLimit;
      var chunks = Math.ceil($rootScope.gw2.recipeIds.length / idsPerChunk);
      var chunkArrays = [];
      var i, j;
      for (i = 0, j = $rootScope.gw2.recipeIds.length; i<j; i+=idsPerChunk) {
        chunkArrays.push($rootScope.gw2.recipeIds.slice(i,i+idsPerChunk));
      }

      chunkArrays.forEach((chunkArray) => {
        var newQuery = query + endpoints.idsParam + chunkArray.join();
        httpGetAsync(newQuery, (res) => {
          var arr = $.parseJSON(res);
          var recipeItemIds = [];
          var diffRecipes = _.difference(arr, $rootScope.gw2.recipes);
          $rootScope.gw2.recipes = _.union($rootScope.gw2.recipes, arr);

          recipeItemIds = arr.map((recipe) => {
            return recipe["ingredients"].map((ingredient) => {
              return ingredient["item_id"];
            });
          });

          // Flatten array
          recipeItemIds = [].concat.apply([], recipeItemIds);

          recipeItemIds = _.union(arr.map((recipe) => {
            return recipe["output_item_id"];
          }), recipeItemIds);

          this.fetchItemsById(recipeItemIds);
        });
      });
    });
  };

  this.fetchItemsById = function(itemIds) {
    var baseQuery = endpoints.v2Url + endpoints.items;
    var diffItemIds = _.difference(itemIds, $rootScope.gw2.itemIds);
    $rootScope.gw2.itemIds = _.union($rootScope.gw2.itemIds, diffItemIds);

    var idsPerChunk = endpoints.idsParamLimit;
    var chunks = Math.ceil(diffItemIds.length / idsPerChunk);
    var chunkArrays = [];
    var i, j;
    for (i = 0, j = diffItemIds.length; i<j; i+=idsPerChunk) {
      chunkArrays.push(diffItemIds.slice(i,i+idsPerChunk));
    }

    chunkArrays.forEach((chunkArray) => {
      var query = baseQuery + endpoints.idsParam + chunkArray.join();

      httpGetAsync(query, (res) => {
        var itemArr = $.parseJSON(res);
        $rootScope.gw2.items = _.union($rootScope.gw2.items, itemArr);
      });
    });
  };
});

app.service('utilities', function () {
  var utils = {
    'apiKey': ""
  };

  return {
      getUtils: function () {
          return utils;
      },
      setUtils: function(value) {
          utils = value;
      }
  };
});

app.factory("Inventory", function() {
  var inventory = {};

  return {
    addCharacter: function(characterId) {
      inventory[characterId] = {};
    },
    setInventoryByCharacter: function(characterId, inventory) {
      inventory[characterId] = inventory;
    },
    getInventoryByCharacter: function(characterId) {
      return inventory[characterId];
    }
  }
});

app.factory("Account", function(_) {
  var items = [];
  var bankItems = [];
  var materialStorage = [];
  var characterIds = [];

  return {
      getItems: function() {
          return items;
      },
      addItems: function(_items) {
        items = _.union(items, _items);
      },
      addItem: function(item) {
        items.push(item);
      },
      getBankItems: function() {
          return bankItems;
      },
      addBankItems: function(items) {
        bankItems = _.union(bankItems, items);
      },
      addBankItem: function(item) {
        bankItems.push(item);
      },
      getMaterialStorage: function() {
        return materialStorage;
      },
      addMaterials: function(items) {
        materialStorage = _.union(materialStorage, items);
      },
      addMaterial: function(item) {
        materialStorage.push(item);
      },
      getCharacterIds: function() {
        return charactersIds;
      },
      addCharacterId: function(characterId) {
        characterIds.push(characterId);
      },
      clearCharacterIds: function() {
        characterIds.length = 0;
      }
  };
});

app.service("LoadAccountService", function($rootScope, utilities, endpoints, Account, Inventory) {
  this.updateCharacters = function() {
    var query = endpoints.v2Url + endpoints.characters 
      + endpoints.authParam 
      + utilities.getUtils()['apiKey']
      + "&" + endpoints.pageParam + "0";
    Account.clearCharacterIds();

    httpGetAsync(query, (res) => {
      console.log(query);
      characters = $.parseJSON(res);
      characters.forEach((character) => {
        Account.addCharacterId(character["name"]);
        Inventory.addCharacter(character["name"])
      });

      updateBags(characters);
    });
  };

  var updateBags = function(characters) {
    characters.forEach((character) => {
      character["bags"].forEach((bag) => {
        if (!!bag) {
          var inventory = bag["inventory"];
          Inventory.setInventoryByCharacter(character["name"], inventory.filter((item) => {
            return !!item && (!item.hasOwnProperty("binding") || item["binding"] === "Account");
          }).map((item) => {
            return {
              "id": item["id"],
              "count": item["count"]
            };
          }));
        }
      });
    });
  };

  this.updateBank = function() {
    var query = endpoints.v2Url + endpoints.accountBank 
      + endpoints.authParam 
      + utilities.getUtils()['apiKey'];
    httpGetAsync(query, (res) => {
      var bankItems = $.parseJSON(res);
      Account.addItems(bankItems.filter((item) => {
        return !!item && (!item.hasOwnProperty("binding") || item["binding"] === "Account");
      }).map((item) => {
        return {
          "id": item["id"],
          "count": item["count"]
        };
      }));
    });
  };
});

/***********************************************Main Controller****************************************/
app.controller('MainCtrl', function($scope, $rootScope, endpoints, utilities, LoadAccountService) {
  var temp_key = "7B3452F9-F497-6A46-B8DF-FB0C0126853E6C9B3BB0-8788-484D-B465-A4FF112F9789";
  $scope.utils = {};
  $scope.utils.items = [];
  $scope.utils.apiKey = temp_key;
  // utilities.setUtils({'apiKey': $scope.utils.apiKey});
  utilities.getUtils()['apiKey'] = $scope.utils.apiKey;

  $scope.utils.updateView = function() {
    console.log($scope.utils.apiKey);
    utilities.getUtils()['apiKey'] = $scope.utils.apiKey;

    var query = endpoints.v2Url + endpoints.characters + endpoints.authParam + $scope.utils.apiKey;
    // httpGetAsync(query, (res) => {
    //   $scope.utils.items = $.parseJSON(res);
    //   console.log($scope.utils.items);
    // });
    LoadAccountService.updateBank();
    LoadAccountService.updateCharacters();
  };

  $scope.utils.saveLocal = function() {
    chrome.storage.local.clear(() => {
      chrome.storage.local.set({
        "recipes": $rootScope.gw2.recipes,
        "items": $rootScope.gw2.items
      }, () => {
        console.log("save successful")
      });
    });
  }

  $scope.utils.clearLocal = function() {
    chrome.storage.local.clear(() => {
      console.log("Clear successful");
    });
  }

  $scope.$watch('utils.apiKey', $scope.utils.updateView);
});

/***********************************************Timer Controller****************************************/
app.controller('TimerCtrl', function($scope, $timeout) {
  $scope.date = {};
  // Update function
  var updateTime = function() {
    $scope.date.raw = new Date();
    $timeout(updateTime, 1000);
  }
  // Kick off the update function
  updateTime();
});

/************************Filter Controller*************************************/
app.controller('FilterCtrl', function($scope, $rootScope, crafting, endpoints, utilities, _) {
  var apiKey = utilities.getUtils()["apiKey"];
  $scope.crafting = crafting;
  $scope.crafting.selectedTypes = [];
  $scope.crafting.selectedTypeModels = {};
  $scope.crafting.selectedDisciplinesModel = [];
  $scope.crafting.recipes = $rootScope.gw2.recipes;

  $scope.crafting.updateSelectedTypes = function () {
    $scope.crafting.selectedTypes.length = 0;
    $scope.crafting.craftClass.forEach((cls) => {
      $scope.crafting.selectedTypes = 
        _.union($scope.crafting.selectedTypes, $scope.crafting.selectedTypeModels[cls]);
    });
  };

  var fetchMaterialsBank = function() {
    var query = endpoints.v2Url + endpoints.accountMaterials + endpoints.authParam + apiKey;
    httpGetAsync(query, (res) => {
      $scope.crafting.items = $.parseJSON(res);
    });
  };

  $scope.refresh = function() {
    $scope.crafting.recipes = $rootScope.gw2.recipes;
  };

  $scope.test1 = function() {
    console.log($scope.crafting.selectedDisciplinesModel);
    $scope.crafting.updateSelectedTypes();
    console.log($scope.crafting.selectedTypes);
  };

  $scope.crafting.updateAllDisciplines = function($event) {
    if ($event.target.checked) {
      $scope.crafting.crafts.forEach((craft) => {
        if ($scope.crafting.selectedDisciplinesModel.indexOf(craft.discipline) < 0) {
          $scope.crafting.selectedDisciplinesModel.push(craft.discipline);
        }
      });
    } else {
      $scope.crafting.selectedDisciplinesModel.length = 0;
    }
  };

  $scope.crafting.isAllSelected = function() {
    return $scope.crafting.crafts.length === $scope.crafting.selectedDisciplinesModel.length;
  };

  fetchMaterialsBank();
});

