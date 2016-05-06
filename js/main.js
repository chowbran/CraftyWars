var requests = 0;

window.onload = function() {
  var searchButton = document.getElementById('btnSearch');
  var searchText = document.getElementById('txtSearch');
  
  document.querySelector('#greeting').innerText =
    'Crafty Wars - A Guild Wars 2 Crafting Calculator';

  // chrome.commands.onCommand.addListener((command) => {
  //   if (command === "pageLeft") {
  //     selectPage(currentPage - 1);
  //   } else if (command === "pageRight") {
  //     selectPage(currentPage - 1);
  //   }
  // });
};


function requestsAlive() {
  return requests;
}

function httpGetAsync(url, callback) {
  requests = requests + 1;
  var req = new XMLHttpRequest();
        
  req.onreadystatechange = function() {
    if (req.readyState == 4 && req.status == 200) {
      // console.log(req.responseText);
      callback(req.responseText);
      requests = requests - 1;
    } else if (req.readyState == 4 && req.status == 206) {
      callback(req.responseText);
      requests = requests - 1;
      // console.log(req.responseText);
    }
  };
  req.open("GET", url, true); // true for asynchronous
  // req.setRequestHeader("Range", "bytes=0-");
  req.send(null);
}

function httpGetBlobAsync(url, callback) {
  requests = requests + 1;
  var req = new XMLHttpRequest();
  req.open("GET", url, true); // true for asynchronous
  req.responseType = 'blob';
  req.onload = function(e) {
    requests = requests - 1;
    callback(req.response);
  }
// req.onload = function(e) {
//   var img = document.createElement('img');
//   img.src = window.URL.createObjectURL(this.response);
//   document.body.appendChild(img);
// };

  req.send(null);
}

function test3(arr) {
  chrome.storage.sync.get("recipes", function(result) {
    chrome.storage.local.set({"recipes": _.union(result["recipes"], arr)});
  });
}
