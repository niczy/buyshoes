var ftdriver = require('./ftdriver'),
    By = require('selenium-webdriver').By,
    util = require('util'),
    until = require('selenium-webdriver').until,
    CONFIG = require('./config'),
    driver = require('../init.js').driver;

module.exports = function() {
  ftdriver.get(CONFIG.productUrl);
  driver.wait(until.elementLocated(By.id('product_sizes')));
  driver.findElement(By.id('product_sizes')).sendKeys(CONFIG.size);
  driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
  var addToCartEle = driver.findElement(By.css('.add_to_cart input'));
  driver.wait(until.elementIsEnabled(addToCartEle));
  addToCartEle.click();
}
