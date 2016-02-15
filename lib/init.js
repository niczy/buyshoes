var webdriver = require('selenium-webdriver'),
    util = require('util');


var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();
driver.manage().window().maximize();

module.exports.driver = driver;


