var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until;
var CONFIG = require('./config');
var util = require('util');


console.log('-- starting buing product with config: ' + util.inspect(CONFIG));
var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();
driver.manage().window().maximize();

module.exports.driver = driver;


