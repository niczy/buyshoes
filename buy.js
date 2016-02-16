var addtocart = require('./lib/footlocker/addtocart'),
    checkout = require('./lib/footlocker/checkout');
    login = require('./lib/footlocker/login');

var main = function() {
  login()
    .then(function() {
      addtocart()
        .then(function() {
          checkout();
        });
  });
}

main();
