var driver = require('../init.js').driver;

exports = {};

var check500 = function() {
  return driver.getCurrentUrl()
    .then(function(url) {
      console.log('Current url is: ' + url);
      return url.search('/ns/error/500.html') >= 0;
    })
    .catch(function(reason) {
      console.log('Failed to load url: ' + reason);
      return false;
    });
}

exports.get = function(url) {
  return new Promise(
      function(resolve, reject) {
        driver.get(url)
          .then(function(resp) {
            check500()
              .then(function(isError) {
                if (isError) {
                  exports.get(url)
                    .then(function(resp) {
                      resolve(resp);
                    });
                } else {
                  resolve(resp);
                }
              });
            });
        });
}

module.exports = exports;

