var ftdriver = require('./ftdriver'),
    By = require('selenium-webdriver').By,
    util = require('util'),
    until = require('selenium-webdriver').until,
    CONFIG = require('./config'),
    driver = require('../init.js').driver;

var submitOrder = function() {
  console.log('--- submitting order ----');
  var csc = driver.findElement(By.id('payMethodPaneStoredCCCVV'));
  csc.click()
    .then(function() {
      csc.sendKeys(CONFIG.csc);
      var orderSubmit = driver.findElement(By.id('orderSubmit'));
      orderSubmit
        .then(function() {
          orderSubmit.click();
          driver.wait(until.elementLocated(By.id('orderReceipt')))
            .then(function() {
              console.log('Order submitted!!!!!!');
            });
        })
        .catch(function() {
          console.log('Failed to submit order.');
        });
    })
    .catch(function(){
      console.log('Failed to select csv element.');
      driver.sleep(300)
        .then(function() {
          console.log('Try again.');
          submitOrder();
        });
    });
}

var checkout = function() {
  console.log('---- start checking out ---');
  ftdriver.get('http://www.footlocker.com/shoppingcart/default.cfm?sku=');
  var checkoutButton = driver.findElement(By.id('cart_checkout_button'));
  var goToCheckout = checkoutButton.click();
  goToCheckout
    .then(function() {
      submitOrder();
    })
    .catch(function(reason) {
      // Click continue to merge with previous order.
      driver.executeScript('sharedCart_panel.close()')
        .catch(function(){});
      console.log('goToCheckout failed: ' + reason);
      // start checkout again.
      checkout();
    });
}

module.exports = checkout;
