var app = angular.module('myApp', ["checklist-model", "ui.multiselect"]);

window.onload = function() {
  var searchButton = document.getElementById('btnSearch');
  var searchText = document.getElementById('txtSearch');
  
  document.querySelector('#greeting').innerText =
    'Crafty Wars - A Guild Wars 2 Crafting Calculator';

};

function httpGetAsync(url, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200)
            callback(req.responseText);
    };
    req.open("GET", url, true); // true for asynchronous
    req.send(null);
}

app.controller('MainCtrl', function($scope) {
  $scope.utils = {};
  var temp_key = "7B3452F9-F497-6A46-B8DF-FB0C0126853E6C9B3BB0-8788-484D-B465-A4FF112F9789";
  var materialQueryString = "https://api.guildwars2.com/v2/account/materials";
  $scope.utils.items = [];
  $scope.utils.apiKey = "";

  $scope.utils.updateView = function() {
    var apikey = temp_key;//document.getElementById('txtApiKey').value;
    console.log(apikey);
    var queryString = materialQueryString + "?access_token=" + apikey;
    httpGetAsync(queryString, (res) => {
      $scope.utils.items = $.parseJSON(res);
      console.log($scope.utils.items[0]);
    });
  };
  
  $scope.$watch('apiKey', $scope.utils.updateView);
});

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

app.controller('FilterCtrl', function($scope) {
  $scope.crafting = {};
  $scope.crafting.selectModel = [];
  $scope.crafting.selectedDisciplines = [];
  $scope.crafting.recipeIds = [];
  $scope.crafting.crafts = [
    {"discipline": "Armorsmith"},
    {"discipline": "Artificier"},
    {"discipline": "Chef"},
    {"discipline": "Huntsman"},
    {"discipline": "Jeweler"},
    {"discipline": "Leatherworker"},
    {"discipline": "Scribe"},
    {"discipline": "Tailor"},
    {"discipline": "Weaponsmith"}
  ];
  $scope.crafting.craftClass = ["weapon", "armor", "trinket", "food", "component", "refinement", "guild", "other"];
  $scope.crafting.craftType = {
    "weapon": ["axe", "Dagger", "Focus", "Greatsword", "Hammer", "Harpoon", "LongBow", "Mace", "Pistol", 
               "Rifle", "Scepter", "Shield", "ShortBow", "Speargun", "Staff", "Sword", "Torch", "Trident", "Warhorn"
              ],
    "armor": ["Boots", "Coat", "Gloves", "Helm", "Leggings", "Shoulders"],
    "trinket": ["Amulet", "Earring", "Ring"],
    "food": ["Dessert", "Feast", "IngredientCooking", "Meal", "Seasoning", "Snack", "Soup", "Food"],
    "component": ["Component", "Inscription", "Insignia", "LegendaryComponent"],
    "refinement": ["Refinement", "RefinementEctoplasm", "RefinementObsidian"],
    "guild": ["GuildConsumable", "GuildDecoration", "GuildConsumableWvw"],
    "other": ["Backpack", "Bag", "Bulk", "Consumable", "Dye", "Potion", "UpgradeComponent"]
  };

  var fetchCrafts = function() {
    var craftQueryString = "https://api.guildwars2.com/v2/account/materials";
    var queryString = craftQueryString + "?access_token=" + apikey;
    httpGetAsync(queryString, (res) => {
      $scope.items = $.parseJSON(res);
      console.log($scope.items[0]);
    });
  };

  var fetchRecipes = function() {
    var recipeQueryString = "https://api.guildwars2.com/v2/recipes";
    var queryString = recipeQueryString;
    httpGetAsync(queryString, (res) => {
      $scope.recipeIds = $.parseJSON(res);
    });
  };

  fetchRecipes();

  $scope.test1 = function() {
    console.log($scope.crafting.selectedDisciplines);
  };

  $scope.crafting.updateAllDisciplines = function($event) {
    if ($event.target.checked) {
      $scope.crafting.crafts.forEach((craft) => {
        if ($scope.crafting.selectedDisciplines.indexOf(craft.discipline) < 0) {
          $scope.crafting.selectedDisciplines.push(craft.discipline);
        }
      });
    } else {
      $scope.crafting.selectedDisciplines.length = 0;
    }
  };

  $scope.crafting.isAllSelected = function() {
    if ($scope.crafting.crafts.length === $scope.crafting.selectedDisciplines.length) {
      return true;
    } else {
      return false;
    }
  };
});

// Filter to capitalize the first character
app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

// Filter to convert CamelCase to Camel Case (ie Normal Case)
app.filter('stringify', function() {
    return function(input) {
      return input
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, function(str){ return str.toUpperCase(); });
      
    }
});