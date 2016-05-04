var app = angular.module('myApp', [
  "checklist-model", 
  "ui.multiselect",
  "underscore",
  "smart-table"
]);

app.config( [
    '$compileProvider',
    function( $compileProvider ) {
        var currentImgSrcSanitizationWhitelist = $compileProvider.imgSrcSanitizationWhitelist();
        var newImgSrcSanitizationWhiteList = currentImgSrcSanitizationWhitelist.toString().slice(0,-1)
        + '|chrome-extension:'
        +currentImgSrcSanitizationWhitelist.toString().slice(-1);

        console.log("Changing imgSrcSanitizationWhiteList from "+currentImgSrcSanitizationWhitelist+" to "+newImgSrcSanitizationWhiteList);
        $compileProvider.imgSrcSanitizationWhitelist(newImgSrcSanitizationWhiteList);
    }
]);

app.run(function($rootScope, LoadGW2) {
  $rootScope.gw2 = {};
  $rootScope.gw2.items = [];
  $rootScope.gw2.itemIds = [];
  $rootScope.gw2.recipes = [];
  $rootScope.gw2.recipeIds = [];

  LoadGW2.fetchIcons();
  chrome.storage.local.get("recipes", function(recipes) {
    chrome.storage.local.get("items", function(items) {
      if ((items["items"] === undefined) || (recipes["recipes"] === undefined)) {
        chrome.storage.local.set({
          "recipes": [],
          "items": []
        }, () => {
          LoadGW2.fetchRecipesAndItems();
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

app.service('LoadGW2', function($rootScope, endpoints, crafting, RenderIds, ReverseRenderIds, _) {
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

  var fetchItemsById = function(itemIds) {
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

  this.fetchIcons = function() {
      var query = endpoints.v2Url + endpoints.files + endpoints.idsParam;
      var iconInfos = {};
      $rootScope.gw2.icons = {};

      query = query + crafting.crafts.filter((craft) => {
        var discipline = craft["discipline"];
        return !!RenderIds[discipline];
      }).map((craft) => {
        var discipline = craft["discipline"];
        return RenderIds[discipline];
      }).join();

      httpGetAsync(query, (res) => {
        var iconInfoArr = $.parseJSON(res);
        iconInfoArr.forEach((iconInfo) => {
          httpGetBlobAsync(iconInfo["icon"], (res) => {
            var img = document.createElement('img');
            img.src = window.URL.createObjectURL(res);
            $rootScope.gw2.icons[iconInfo["id"]] = window.URL.createObjectURL(res);
          });
        });
      });
  };
});

app.service('utilities', function ($rootScope, RenderIds) {
  var apiKey = "";

  this.getApiKey = function() {
    return apiKey;
  };

  this.setApiKey = function(value) {
    apiKey = value;
  };

  this.getIcon = function(iconId) {
    if (!!RenderIds[iconId]) {
      // console.log($rootScope.gw2.icons);
      return $rootScope.gw2.icons[RenderIds[iconId]];
    } else {
      return null;
    }
  };
});

app.factory("ItemCollection", function() {
  var ItemCollection = function() {
    this.items = [];
  };

  ItemCollection.prototype.getItems = function() {
    return this.items;
  };
  ItemCollection.prototype.addItems = function(items) {
    this.items = _.union(this.items, items);
  };
  ItemCollection.prototype.addItem = function(item) {
    this.items.push(item);
  };
  ItemCollection.prototype.getItemById = function() {

  };

  return ItemCollection;
});

app.factory("Inventory", function(ItemCollection) {
  var Inventory = function() {
    this.inventory = {};
  };

  Inventory.prototype.addCharacter = function(characterId) {
    this.inventory[characterId] = new ItemCollection();
  };
  Inventory.prototype.addItemByCharacter = function(characterId, item) {
    this.inventory[characterId].addItem(item);
  };
  Inventory.prototype.addItemsByCharacter = function(characterId, items) {
    this.inventory[characterId].addItems(items);
  };
  Inventory.prototype.getItemsByCharacter = function(characterId) {
    return this.inventory[characterId].getItems();
  };
  Inventory.prototype.clearCharacters = function() {
    this.inventory = {};
  };
  Inventory.prototype.getInventories = function() {
    return this.inventory;
  };
  Inventory.prototype.getItems = function() {
    var result = [];
    Object.keys(this.inventory).forEach((characterId) => {
      result = _.union(result, this.getItemsByCharacter(characterId));
    });

    return result;
  }

  return Inventory;
});

app.service("UserItems", function(ItemCollection, Inventory) {
  var bank = new ItemCollection();
  var materialStorage = new ItemCollection();
  var inventory = new Inventory();
  var accountStorage = new ItemCollection();

  this.Bank = bank;
  this.MaterialStorage = materialStorage;
  this.Inventory = inventory;
  this.AccountStorage = accountStorage;

  this.getItemsInfo = function() {
    var result = {};
    var storageIds = {
      "Bank": bank,
      "Material": materialStorage,
      "Acount": accountStorage
    };
    var inventories = inventory.getInventories();

    Object.keys(inventories).forEach((characterId) => {
      storageIds[characterId] = inventories[characterId];
    });

    Object.keys(storageIds).forEach((storageId) => {
      storageIds[storageId].getItems().forEach((item) => {
        if (!!result[item["id"]]) {
          result[item["id"]]["count"] = result[item["id"]]["count"] + item["count"];
          result[item["id"]]["location"][storageId] = item["count"];
        } else {
          result[item["id"]] = {};
          result[item["id"]]["count"] = item["count"];
          result[item["id"]]["location"] = {}
          result[item["id"]]["location"][storageId] = item["count"];
        }
      });
    });

    return result;
  };

  this.getItems = function() {
    var itemInfo = this.getItemsInfo();
    var result = [];

    Object.keys(itemInfo).forEach((itemId) => {
      result.push({
        "id": itemId,
        "count": itemInfo[itemId]["count"]
      });
    });

    return result;
  };
});

app.service("LoadAccount", function($rootScope, utilities, endpoints, UserItems) {
  this.updateCharacters = function() {
    var query = endpoints.v2Url + endpoints.characters 
      + endpoints.authParam 
      + utilities.getApiKey()
      + "&" + endpoints.pageParam + "0";
    UserItems.Inventory.clearCharacters();

    httpGetAsync(query, (res) => {
      console.log(query);
      characters = $.parseJSON(res);
      characters.forEach((character) => {
        UserItems.Inventory.addCharacter(character["name"])
      });

      updateBags(characters);
    });
  };

  var updateBags = function(characters) {
    characters.forEach((character) => {
      character["bags"].forEach((bag) => {
        if (!!bag) {
          var inventory = bag["inventory"];
          UserItems.Inventory.addItemsByCharacter(character["name"], inventory.filter((item) => {
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

  this.updateMaterialStorage = function() {
    var query = endpoints.v2Url + endpoints.accountMaterials 
      + endpoints.authParam 
      + utilities.getApiKey();
    httpGetAsync(query, (res) => {
      var craftingItems = $.parseJSON(res);
      UserItems.MaterialStorage.addItems(craftingItems.filter((item) => {
        return item["count"] > 0;
      }).map((item) => {
        return {
          "id": item["id"],
          "count": item["count"]
        };
      }));
    });
  };

  this.updateAccountStorage = function() {
    var query = endpoints.v2Url + endpoints.accountInventory 
      + endpoints.authParam 
      + utilities.getApiKey();
    httpGetAsync(query, (res) => {
      var craftingItems = $.parseJSON(res);
      UserItems.MaterialStorage.addItems(craftingItems.map((item) => {
        return {
          "id": item["id"],
          "count": item["count"]
        };
      }));
    });
  };

  this.updateBank = function() {
    var query = endpoints.v2Url + endpoints.accountBank 
      + endpoints.authParam 
      + utilities.getApiKey();
    httpGetAsync(query, (res) => {
      var bankItems = $.parseJSON(res);
      UserItems.Bank.addItems(bankItems.filter((item) => {
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
app.controller('MainCtrl', function($scope, $rootScope, endpoints, utilities, LoadAccount) {
  var temp_key = "7B3452F9-F497-6A46-B8DF-FB0C0126853E6C9B3BB0-8788-484D-B465-A4FF112F9789";
  $scope.utils = {};
  $scope.items = [];
  $scope.apiKey = temp_key;

  $scope.updateUser = function() {
    console.log($scope.apiKey);
    utilities.setApiKey($scope.apiKey);

    var query = endpoints.v2Url + endpoints.characters + endpoints.authParam + $scope.apiKey;
    LoadAccount.updateBank();
    LoadAccount.updateCharacters();
    LoadAccount.updateMaterialStorage();
  };

  $scope.saveLocal = function() {
    chrome.storage.local.clear(() => {
      chrome.storage.local.set({
        "recipes": $rootScope.gw2.recipes,
        "items": $rootScope.gw2.items
      }, () => {
        console.log("save successful")
      });
    });
  }

  $scope.clearLocal = function() {
    chrome.storage.local.clear(() => {
      console.log("Clear successful");
    });
  }

  $scope.$watch('apiKey', $scope.updateUser);
});

/************************Filter Controller*************************************/
app.controller('FilterCtrl', function($scope, $sce, $rootScope, $compile, crafting, endpoints, utilities, _, UserItems) {
  var apiKey = utilities.getApiKey();
  $scope.CONST = crafting;
  $scope.selectedTypes = [];
  $scope.selectedTypeModels = {};
  $scope.selectedDisciplinesModel = [];
  $scope.recipes = $rootScope.gw2.recipes;

  $scope.craftingDetails = [];
  $scope.count = 0;

  $scope.idsToHtmlImgs = function(ids) {
    var html = "<div>";

    ids.forEach((id) => {
      var img = utilities.getIcon(id);
      if (!!img) {
        html = html + "<img class=\"icons\" src=" + img + " ng-mouseover=\"count = count + 1\">";
      }
    });

    html = html + "</div>"

    console.log(html);

    return $sce.trustAsHtml(html);
  };


  function hoverDetails() {
    console.log("Hello World");
  }

  $scope.hoverDetails = function() {
    console.log(id);
  };

  var updatedCraftingDetails = function() {
    var result = {};

    $scope.recipes.forEach((recipe) => {
      result[recipe["id"]] = {
        "craftable": false,
        "min_rating": recipe["min_rating"],
        "type": recipe["type"],
        "craftedItem": {},
        "disciplines": recipe["disciplines"],
        "ingredients": [],
        "craftCost": 0,
        "sellPrice": 0,
        "profit": 0
      }
    });

    $scope.craftingDetails = Object.keys(result).map((recipeId) => {
      return result[recipeId];
    });

    document.addEventListener('DOMContentLoaded', function() {
      document.querySelector('img').addEventListener('click', hoverDetails);
    });
  };

  var filterCraftables = function() {
    var items = UserItems.getItems();


  };

  $scope.updateSelectedTypes = function () {
    $scope.selectedTypes.length = 0;
    $scope.CONST.craftClass.forEach((cls) => {
      $scope.selectedTypes = 
        _.union($scope.selectedTypes, $scope.selectedTypeModels[cls]);
    });
  };

  $scope.refresh = function() {
    $scope.recipes = $rootScope.gw2.recipes;
    // $scope.items = UserItems.Inventory.getItemsByCharacter("Sylvar");
    $scope.items = UserItems.getItems();
    updatedCraftingDetails();
  };

  $scope.test1 = function() {
    console.log($scope.selectedDisciplinesModel);
    console.log($scope.selectedTypes);
    console.log(UserItems.Bank.getItems());
    console.log(UserItems.Inventory.getItems());
    console.log(UserItems.MaterialStorage.getItems());
  };

  $scope.updateAllDisciplines = function($event) {
    if ($event.target.checked) {
      $scope.CONST.crafts.forEach((craft) => {
        if ($scope.selectedDisciplinesModel.indexOf(craft.discipline) < 0) {
          $scope.selectedDisciplinesModel.push(craft.discipline);
        }
      });
    } else {
      $scope.selectedDisciplinesModel.length = 0;
    }
  };

  $scope.isAllSelected = function() {
    return $scope.CONST.crafts.length === $scope.selectedDisciplinesModel.length;
  };
});

