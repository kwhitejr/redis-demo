var express = require('express');
var redis = require('redis');

var app = express();

var client = redis.createClient();

app.use(function (req, res, next) {
  // TODO: incr counter in redis
  client.incr('counter', function (err, counter) {
    if (err) {
      return next(err);
    }
    res.locals.counter = counter;
    next();
  });
});

app.use(function (err, req, res, next) {
  if (err) {
    res.status(500).send('Somthing bad happened...');
    console.log(err);
  }
});

app.get('/', function (req, res) {
  res.send('Hello muggle. You are muggle number ' + res.locals.counter);
});

client.on('connect', function () {
  console.log('Connected to Redis');
  initializeCounter(connectToServer);
});

client.on('end', function () {
  console.log('disconnect from redis');
});

function initializeCounter(callback) {
  client.get('counter', function (err, counter) {
    if (err) { throw err; }
    if (!counter) {
      client.set('counter', 0);
    }
  });
  return callback(); // Connect to the server
}

function connectToServer() {
  var server = app.listen(3000, function () {
    console.log('listening on', server.address().port);
  });
}