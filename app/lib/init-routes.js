'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;
var passport = require('passport');

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var users = traceur.require(__dirname + '/../routes/users.js');
  var posts = traceur.require(__dirname + '/../routes/posts.js');
  var messages = traceur.require(__dirname + '/../routes/messages.js');

  require('../config/passport')(passport);

  app.get('/', dbg, home.index);

  app.get('/login', dbg, users.login);
  app.get('/signup', dbg, users.signup);
  app.get('/profile', dbg, isLoggedIn, users.profile);
  app.post('/profile', dbg, users.updateProfile);
  app.get('/location', dbg, isLoggedIn, users.location);
  app.post('/location', dbg, users.addCoords);
  app.get('/dashboard', dbg, isLoggedIn, users.dashboard);
  app.get('/neighbors', dbg, isLoggedIn, users.neighbors);
  app.get('/neighborhood', dbg, isLoggedIn, users.neighborhood);
  app.get('/meet/:id', dbg, isLoggedIn, users.show);
  app.get('/logout', dbg, isLoggedIn, users.logout);

  app.get('/post', dbg, isLoggedIn, posts.new);
  app.post('/post', dbg, posts.create);

  app.get('/message/:toId', dbg, isLoggedIn, messages.new);
  app.post('/message/:toId', dbg, messages.create);
  app.get('/show/:mId', isLoggedIn, messages.show);
  app.get('/reply/:toId', dbg, isLoggedIn, messages.new);

  app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash : true
	}));

  app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/dashboard',
		failureRedirect : '/login',
		failureFlash : true
	}));

	// FACEBOOK ROUTES
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {successRedirect : '/profile', failureRedirect : '/'})
  );

  console.log('Routes Loaded');
  fn();
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
