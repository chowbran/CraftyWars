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

function test3(arr) {
  chrome.storage.sync.get("recipes", function(result) {
    chrome.storage.local.set({"recipes": _.union(result["recipes"], arr)});
  });
}