var ftdriver = require('./ftdriver'),
    By = require('selenium-webdriver').By,
    util = require('util'),
    until = require('selenium-webdriver').until,
    CONFIG = require('./config'),
    driver = require('../init.js').driver;

var onOrderSubmitionFailed = function(resolve) {
  return function(reason) {
    console.log('Failed to submit order.');
    driver.sleep(1000)
      .then(function() {
        console.log('Retrying.');
        submitOrder()
          .then(function() {
            resolve(true);
          })
      });
  }
}

var submitOrder = function() {
  return new Promise(function(resolve, reject) {
    console.log('--- submitting order ----');
    var csc = driver.findElement(By.id('payMethodPaneStoredCCCVV'));
    csc.sendKeys(CONFIG.csc);
    var orderSubmit = driver.findElement(By.id('orderSubmit'));

    orderSubmit
      .then(function() {
        orderSubmit.click();
        driver.wait(until.elementLocated(By.id('orderReceipt')), 5000)
          .then(function() {
            console.log('Order submitted!!!!!!');
            resolve(true);
          })
          .catch(onOrderSubmitionFailed(resolve));
      })
      .catch(onOrderSubmitionFailed(resolve))
  });
}

var selectCsc = function() {
  return new Promise(function(resolve, reject) {
    var csc = driver.findElement(By.id('payMethodPaneStoredCCCVV'));
    csc.click()
      .then(function() {
        resolve(true);
      })
      .catch(function() {
        driver.sleep(300)
          .then(selectCsc()
              .then(function() {
                resolve(true);
              }));
      });
  });
}

var onClickCheckoutFailed = function(resolve) {
  console.log('Clicking checkout button failed. Try to merge session.');
  return function(reason) {
    // Click continue to merge with previous order.
    driver.executeScript('sharedCart_panel.close()')
      .catch(function(){});
    console.log('goToCheckout failed: ' + reason);
    driver.sleep(200)
      .then(function() {
        clickCheckout()
          .then(function() {
            resolve(true);
          });
      });
  }
}

var clickCheckout = function() {
  var checkoutButton = driver.findElement(By.id('cart_checkout_button'));
  return new Promise(function(resolve, reject) {
    console.log('Clicking checkout button.');
    checkoutButton.click()
      .then(function() {
        resolve(true);
      })
      .catch(onClickCheckoutFailed(resolve));
  });
}

var checkout = function() {
  console.log('---- start checking out ---');
  ftdriver.get('http://www.footlocker.com/shoppingcart/default.cfm?sku=');
  return new Promise(function(resolve, reject) {
    clickCheckout()
      .then(function() {
        selectCsc()
          .then(function() {
            submitOrder()
              .then(function() {
                resolve(true);
              })});
          });
      });
}

module.exports = checkout;
