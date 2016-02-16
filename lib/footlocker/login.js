var until = require('selenium-webdriver').until,
    By = require('selenium-webdriver').By,
    CONFIG = require('./config'),
    util = require('util'),
    driver = require('../init.js').driver,
    ftdriver = require('./ftdriver');

var checkLoginSuccess = function() {
  return driver.wait(until.elementLocated(By.id('member_welcome')), 10000);
}

var login = function() {
  ftdriver.get('http://www.footlocker.com/');
  driver.findElement(By.id('guest_welcome_login')).click();
  driver.wait(until.elementLocated(By.id('loginIFrame')))
  var loginIFrame = driver.findElement(By.id('loginIFrame'));
  driver.switchTo().frame('loginIFrame')

  driver.findElement(By.id('login_email')).sendKeys(CONFIG.email);
  driver.findElement(By.id('login_password')).sendKeys(CONFIG.password);
  driver.findElement(By.css('.submit button')).click();

  driver.switchTo().defaultContent();
  return checkLoginSuccess();
}

module.exports = login;

driver.session_.then(function(sessionData) {
  console.log('---session id is : ' + util.inspect(sessionData));
});

