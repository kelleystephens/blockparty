'use strict';

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var userCollection = global.nss.db.collection('users');
var _ = require('lodash');

var configAuth = require('./auth');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // LOCAL SIGNUP

  passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },

  function(req, email, password, done) {

    req.flash('signupMessage', '');
    process.nextTick(function() {

      userCollection.findOne({ 'local.email' :  email }, function(err, user) {
        if (err){
          return done(err);
        }

        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {

          var newUser            = new User();

          newUser.local.email    = email;
          newUser.local.password = newUser.generateHash(password);

          newUser.save(function(err) {
            if (err){
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));

  // LOCAL LOGIN

  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {

    userCollection.findOne({ 'email' :  email }, function(err, user) {

      user = _.create(User.prototype, user);

      if (err){
        return done(err);
      }

      if (!user){
        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
      }

      if (!user.validPassword(password)){
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
      }

      return done(null, user);
    });
  }));

  // FACEBOOK
  passport.use(new FacebookStrategy({

      clientID        : configAuth.facebookAuth.clientID,
      clientSecret    : configAuth.facebookAuth.clientSecret,
      callbackURL     : configAuth.facebookAuth.callbackURL,
      passReqToCallback : true

  },

  function(req, token, refreshToken, profile, done) {

    process.nextTick(function() {

    	if (!req.user) {

        userCollection.findOne({ 'facebook.id' : profile.id }, function(err, user) {
          if (err){
            return done(err);
          }
          if (user) {
              return done(null, user);
          } else {
            var newUser            = new User();

            newUser.name = profile.name.givenName + ' ' + profile.name.familyName;
            newUser.facebook.id    = profile.id;
            newUser.facebook.token = token;
            newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
            newUser.facebook.email = profile.emails[0].value;

            newUser.save(function(err) {
                if (err){
                  throw err;
                }
                return done(null, newUser);
            });
          }
        });
      } else {
        var user            = req.user;

        user.name = profile.name.givenName + ' ' + profile.name.familyName;
        user.facebook.id    = profile.id;
        user.facebook.token = token;
        user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
        user.facebook.email = profile.emails[0].value;
        user.facebook.photos = profile.photos;

        user.save(function(err) {
          if (err){
            throw err;
          }
          return done(null, user);
        });
      }
    });
  }));
};
