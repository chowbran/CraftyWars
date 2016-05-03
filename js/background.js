/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function(launchData) {
  var windowWidth = 800;
  var windowHeight = 1000;
  chrome.app.window.create(
    '../index.html', {
      id: 'mainWindow',
      outerBounds: {
      	width: windowWidth, 
      	height: windowHeight,
        left: screen.availWidth - windowWidth,
      	top: screen.availHeight - windowHeight,
  	  },
      // resizable: false,
      // frame: 'none'
    }
  );
});
