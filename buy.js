var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    CONFIG = require('./config'),
    util = require('util'),
    driver = require('./lib/init.js').driver,
    login = require('./lib/footlocker/login');


console.log('-- starting buing product with config: ' + util.inspect(CONFIG));

var payment = function() {
  console.log('---- start payment ---');
  driver.wait(until.elementLocated(By.id('sharedCart_panel_overlayBG')));
  var overLayEl = driver.findElement(By.id('sharedCart_panel_overlayBG'));


  driver.wait(until.elementIsNotVisible(overLayEl));
  var ccv = driver.findElement(By.id('payMethodPaneStoredCCCVV'));
  ccv.click();
  driver.wait(until.elementIsSelected(ccv));
  console.log('found ccv element');
  ccv.sendKeys(CCV);
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

