var checkout = require('./checkout'),
    login = require('./login');

login()
  .then(function() {
    console.log('Login Success!');
    checkout()
      .then(function(success) {
        console.log('Checkout result: ' + success);
      })
      .catch(function(reason) {
        console.log('Checkout failed: ' + reason);
      });
  })
  .catch(function(reason) {
    console.log('Login failed:' + reason);
  });
