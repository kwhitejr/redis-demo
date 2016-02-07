var express = require('express');

var app = express();

app.set('views', 'views');
app.set('view engine', 'jade');

app.route('/info')
  .get(function (req, res) {
    res.render('get-info');
  })
  .post(function (req, res) {
    res.send('Thank you!');
  });

var server = app.listen(3000, function () {
  console.log('server listening on', server.address().port);
});