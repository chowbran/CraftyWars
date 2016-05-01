var app = angular.module('myApp', [
  "checklist-model", 
  "ui.multiselect",
  "underscore",
  "smart-table"
  ]);

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

app.service('account', function () {
  var items = [];
  var bankItems = [];

  var characters = {};
  var arrayOfCharacters = [];

  return {
      getItems: function() {
          return items;
      },
      setItems: function(item) {
          items = item;
      },
      getBankItems: function() {
          return items;
      },
      setBankItems: function(item) {
          bankItems = item;
      },
      getArrayOfCharacters: function() {
        return arrayOfCharacters;
      },
      getCharacters: function() {
        return characters;
      },
      addCharacter: function(character) {
        characters[character] = null;
        if (arrayOfCharacters.indexOf(character)) {
          arrayOfCharacters.push(character);
        }
      },
      clearCharacters: function() {
        characters = {};
        arrayOfCharacters = [];
      }
  };
});

/***********************************************Main Controller****************************************/
app.controller('MainCtrl', function($scope, endpoints, utilities, account) {
  var temp_key = "7B3452F9-F497-6A46-B8DF-FB0C0126853E6C9B3BB0-8788-484D-B465-A4FF112F9789";
  $scope.utils = {};
  $scope.utils.items = [];
  $scope.utils.apiKey = temp_key;
  // utilities.setUtils({'apiKey': $scope.utils.apiKey});
  utilities.getUtils()['apiKey'] = $scope.utils.apiKey;

  $scope.utils.updateView = function() {
    console.log($scope.utils.apiKey);
    var query = endpoints.v2Url + endpoints.characters + endpoints.authParam + $scope.utils.apiKey;
    // httpGetAsync(query, (res) => {
    //   $scope.utils.items = $.parseJSON(res);
    //   console.log($scope.utils.items);
    // });
    updateBank();
    updateCharacters();
  };

  var updateCharacters = function() {
    var query = endpoints.v2Url + endpoints.characters + endpoints.authParam + $scope.utils.apiKey;
    account.clearCharacters();

    httpGetAsync(query, (res) => {
      $.parseJSON(res).forEach((character) => {
        account.addCharacter(character);
      });
      console.log(account.getCharacters());
    });
  }

  var updateBank = function() {
    var query = endpoints.v2Url + endpoints.accountBank + endpoints.authParam + $scope.utils.apiKey;
    httpGetAsync(query, (res) => {
      var bankItems = $.parseJSON(res);
      account.setItems(bankItems.filter((item) => {
        return !!item && (!item.hasOwnProperty("binding") || item["binding"] === "Account");
      }).map((item) => {
        return {
          "id": item["id"],
          "count": item["count"]
        };
      }));
    });
  }

  $scope.$watch('apiKey', $scope.utils.updateView);
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
app.controller('FilterCtrl', function($scope, crafting, endpoints, utilities, account, _) {
  var apiKey = utilities.getUtils()["apiKey"];
  console.log(apiKey);
  $scope.crafting = crafting;
  $scope.crafting.selectedTypes = [];
  $scope.crafting.selectedTypeModels = {};
  $scope.crafting.selectedDisciplinesModel = [];
  $scope.crafting.recipeIds = [];

  $scope.crafting.updateSelectedTypes = function () {
    $scope.crafting.selectedTypes.length = 0;
    $scope.crafting.craftClass.forEach((cls) => {
      $scope.crafting.selectedTypes = 
        _.union($scope.crafting.selectedTypes, $scope.crafting.selectedTypeModels[cls]);
    });
  };

  var fetchCrafts = function() {
    var queryString = endpoints.v2Url + endpoints.accountMaterials + endpoints.authParam + apiKey;
    httpGetAsync(queryString, (res) => {
      $scope.crafting.items = $.parseJSON(res);
    });
  };

  var fetchRecipes = function() {
    var recipeQueryString = endpoints.v2Url + endpoints.recipes;
    var queryString = recipeQueryString;
    httpGetAsync(queryString, (res) => {
      $scope.crafting.recipeIds = $.parseJSON(res);
      console.log($scope.crafting.recipeIds)
    });
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

  fetchRecipes();
  fetchCrafts();

  // console.log($scope.crafting.recipeIds)
  // console.log($scope.crafting.recipeIds)
});

