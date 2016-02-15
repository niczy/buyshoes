var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    util = require('util'),
    driver = require('./lib/init.js').driver,
    CONFIG = require('./lib/footlocker/config'),
    ftdriver = require('./lib/footlocker/ftdriver'),
    login = require('./lib/footlocker/login');

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
          console.log('Order submitted!!!!!!');
        })
        .catch(function() {
          console.log('Failed to submit order.');
        });
    })
    .catch(function(){
      console.log('Failed to select csv element.');
      driver.sleep(1000)
        .then(function() {
          console.log('Try again.');
          submitOrder();
        });
    });
}

var payment = function() {
  console.log('---- start payment ---');
  submitOrder();
}

var startCheckout = function() {
  ftdriver.get('http://www.footlocker.com/shoppingcart/default.cfm?sku=');
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
  ftdriver.get(CONFIG.productUrl);
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

console.log(orderSubmit.getText());
console.log("didn't submit");
driver.quit();
*/

