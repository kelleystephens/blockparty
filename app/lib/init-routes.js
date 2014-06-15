'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;
var app, passport;

module.exports = (a, p)=>{
  app = a;
  passport = p;

  return main;
};

function main(req, res, next){
  if(!initialized){
    initialized = true;
    load(next);
  }else{
    next();
  }
}

function load(fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var users = traceur.require(__dirname + '/../routes/users.js');

  app.get('/', dbg, home.index);
  app.get('/login', dbg, users.login);
  app.post('/login', dbg, users.authenticate);
  app.get('/signup', dbg, users.signup);
  app.post('/signup', dbg, passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
  app.get('/dashboard', dbg, users.dashboard);
  app.get('/logout', dbg, users.logout);

  console.log('Routes Loaded');
  fn();
}
