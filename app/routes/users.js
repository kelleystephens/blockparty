'use strict';

// var traceur = require('traceur');
// var User = traceur.require(__dirname + '/../models/user.js');
// var LocalStrategy   = require('passport-local').Strategy;

exports.login = (req, res)=>{
  res.render('users/login', {message: req.flash('loginMessage'), title: 'Login'});
};

exports.authenticate = (req, res)=>{

};

exports.signup = (req, res)=>{
  res.render('users/register', {message: req.flash('signupMessage'), title: 'Register'});
};

exports.dashboard = (req, res)=>{
  //User.findById()
  res.render('users/dashboard', {title: 'Dashboard'});
};

exports.logout = (req, res)=>{
  req.logout();
  res.redirect('/');
};
