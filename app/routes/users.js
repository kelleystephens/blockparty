/* jshint unused:false */

'use strict';

var multiparty = require('multiparty');
var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Post = traceur.require(__dirname + '/../models/post.js');
var Message = traceur.require(__dirname + '/../models/message.js');

exports.signup = (req, res)=>{
  res.render('users/register', {message: req.flash('signupMessage'), title: 'Register'});
};

exports.login = (req, res)=>{
  res.render('users/login', {message: req.flash('loginMessage'), title: 'Login'});
};

exports.profile = (req, res)=>{
  res.render('users/profile', {user: req.user, title: 'Profile'});
};

exports.updateProfile = (req, res)=>{
  User.findById(req.user._id, (e,u)=>{
    var form = new multiparty.Form();  //this is just how you use multiparty to pull pics
    form.parse(req, (err, fields, files)=>{
      fields.photo = files.photo;
      u.update(fields, u=>{
        if(u.address){
          res.redirect('/dashboard');
        }else{
          res.redirect('/location');
        }
      });
    });
  });
};

exports.location = (req, res)=>{
  res.render('users/location', {user: req.user, title: 'Location'});
};

exports.addCoords = (req, res)=>{
  User.findById(req.user._id, (e,u)=>{
    u.addCoords(req.body, user=>{
      res.send(user);
    });
  });
};

exports.dashboard = (req, res)=>{
  User.findByLocation(req.user, users=>{
    var userId = [];
    users.forEach(u=>{
      userId.push(u._id);
    });
    Post.findByUserId(userId, posts=>{
      Message.findByToUserId(req.user._id, msgs=>{
        res.render('users/dashboard', {user:req.user, posts:posts, messages:msgs, title: 'Dashboard'});
      });
    });
  });
};

exports.neighbors = (req, res)=>{
  var user = req.user;
  User.findByLocation(user, neighbors=>{
    res.render('users/neighbors', {user:user, neighbors:neighbors, title: 'Neighbors'});
  });
};

exports.show = (req, res)=>{
  var user = req.user;
  User.findById(req.params.id, (err, user2)=>{
    res.render('users/show', {user:user, user2:user2, title: `${user2.name}`});
  });
};

exports.neighborhood = (req, res)=>{
  var user = req.user;
  res.render('users/neighborhood', {user:user, title: 'Neighborhood'});
};

exports.logout = (req, res)=>{
  req.logout();
  res.redirect('/');
};
