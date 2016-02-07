var redis = require('redis');

// Connect to redis (default configurations redis://127.0.0.1:6379)
var client = redis.createClient();

client.on('ready', function () {
  console.log('ready to go');
});

client.on('connect', function () {
  runExample();
});

client.on('end', function () {
  console.log('godbye redis!');
  client.end();
});

client.on('error', function (error) {
  console.log(error);
});

function runExample() {
  client.set('name', 'Kevin');
  client.get('secret', function (err, secret) {
    if (err)
      return;
    console.log('the secret is... ', secret);
  });
}