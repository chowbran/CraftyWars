var app = angular.module('myApp', [
  "checklist-model", 
  "ui.multiselect",
  "underscore"
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

/***********************************************Main Controller****************************************/
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

/***********************************************Filter Controller****************************************/
app.controller('FilterCtrl', function($scope, crafting, _) {
  $scope.crafting = crafting;
  $scope.crafting.selectedTypes = [];
  $scope.crafting.selectedTypeModels = {};
  $scope.crafting.selectedDisciplinesModel = [];
  $scope.crafting.recipeIds = [];
  

  $scope.crafting.craftClass.forEach((cls) => {
    $scope.crafting.selectedTypeModels[cls] = [];
  });

  // $scope.crafting.selectedTypeModel = [];
  $scope.crafting.updateSelectedTypes = function () {
    $scope.crafting.selectedTypes.length = 0;
    $scope.crafting.craftClass.forEach((cls) => {
      $scope.crafting.selectedTypes = _.union($scope.crafting.selectedTypes, $scope.crafting.selectedTypeModels[cls]);
    });
  };

  $scope.crafting.example2model = []; 
  $scope.crafting.example2data = [
    {id: 1, label: "David"},
    {id: 2, label: "Jhon"}];

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
});

