var addtocart = require('./lib/footlocker/addtocart'),
    checkout = require('./lib/footlocker/checkout');
    login = require('./lib/footlocker/login');

var main = function() {
  login();
  addtocart();
  checkout();
}

main();

setTimeout(function() {}, 100000);

