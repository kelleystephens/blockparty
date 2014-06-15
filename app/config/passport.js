'use strict';

var LocalStrategy = require('passport-local').Strategy;
// var bcrypt = require('bcrypt');

// load up the user model
// var traceur = require('traceur');
var User = require('../models/user.js');
var userCollection = global.nss.db.collection('users');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
          done(err, user);
      });
    });

    passport.use('local-signup', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
      process.nextTick(function() {
        userCollection.findOne({ 'local.email' :  email }, function(err, user) {
          if (err){
            return done(err);
          }
          if (user) {
              return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
          } else {
            User.createLocal(email, password, function(user){
              return done(null, user);
            });

        //         var newUser = new User();
        //
        //         newUser.local.email    = email;
        //         newUser.local.password = bcrypt.hashSync(password, 8);
        //
        //         newUser.save(function(err) {
        //             if (err){
        //               throw err;
        //             }
        //             return done(null, user);
        //         });
            }

        });

        });

    }));

};
