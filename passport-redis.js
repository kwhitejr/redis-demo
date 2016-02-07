var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var morgan = require('morgan');

var CONFIG = require('./config');

var app = express();

// View Engine
app.set('views', 'views');
app.set('view engine', 'jade');

// Middleware
// 1.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(CONFIG.SESSION));
app.use(morgan('dev'));

passport.use(new LocalStrategy(
  { // secret unlocked!
    passReqToCallback: true
  },
  function (req, username, password, done) {
    var body = req.body;
    var info = Object.keys(body)
      .filter(function (property) {
        return ['username', 'password'].indexOf(property) < 0;
      })
      // (previous, current, index, array)
      .reduce(function (info, property) {
        info[property] = body[property];
        return info;
      }, {}); // empty object is given previous
    return done(null, info);
  }
));

passport.serializeUser(function (user, done) {
  return done(null, user);
});

passport.deserializeUser(function (user, done) {
  return done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
  var user = req.user;
  if (!user) {
    return res.redirect('/info');
  }
  return res.render('profile', {user: user});
});

app.route('/info')
  .get(function (req, res) {
    res.render('get-info');
  })
  .post(
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/info'
    })
  );

var server = app.listen(3000, function () {
  console.log('server listening on', server.address().port);
});