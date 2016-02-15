var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    util = require('util'),
    driver = require('./lib/init.js').driver,
    CONFIG = require('./lib/footlocker/config'),
    login = require('./lib/footlocker/login');

var submitOrder = function(csc) {
  ccv.sendKeys(CONFIG.csc);
}

var payment = function() {
  console.log('---- start payment ---');
  driver.wait(until.elementLocated(By.id('sharedCart_panel_overlayBG')));
  var overLayEl = driver.findElement(By.id('sharedCart_panel_overlayBG'));


  driver.wait(until.elementIsNotVisible(overLayEl));
  var csc = driver.findElement(By.id('payMethodPaneStoredCCCVV'));
  csc.click();
  driver.wait(until.elementIsSelected(ccv))
    .then(function() {
      console.log('found csc element');
      submitOrder(csc);
    })
    .catch(function() {
      console.log('faild to submit order');
    });
}

var startCheckout = function() {
  driver.get('http://www.footlocker.com/shoppingcart/default.cfm?sku=');
  var checkoutButton = driver.findElement(By.id('cart_checkout_button'));
  var goToCheckout = checkoutButton.click();
  goToCheckout
    .then(function() {
            payment();
    })
    .catch(function(reason) {
      // Click continue to merge with previous order.
      driver.executeScript('sharedCart_panel.close()')
        .catch(function(){});
      console.log('goToCheckout failed: ' + reason);
      // start checkout again.
      startCheckout();
    });
}

var buyshoes = function() {
  login();
  driver.get(CONFIG.productUrl);
  driver.wait(until.elementLocated(By.id('product_sizes')));
  driver.findElement(By.id('product_sizes')).sendKeys(CONFIG.size);
  driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
  var addToCartEle = driver.findElement(By.css('.add_to_cart input'));
  driver.wait(until.elementIsEnabled(addToCartEle));
  addToCartEle.click();

  startCheckout();
}

buyshoes();

setTimeout(function() {}, 100000);

/*

var orderSubmit = driver.findElement(By.id('orderSubmit'));
console.log(orderSubmit.getText());
console.log("didn't submit");
driver.quit();
*/

