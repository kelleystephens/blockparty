/* jshint unused:false */

'use strict';

var traceur = require('traceur');
var Post = traceur.require(__dirname + '/../models/post.js');
var User = traceur.require(__dirname + '/../models/user.js');

exports.new = (req, res)=>{
  res.render('posts/new', {user: req.user, title: 'Write a Post'});
};

exports.create = (req, res)=>{
  User.findById(req.user._id, u=>{
    u.addStar(user=>{
      Post.create(req.body, user, p=>{
        res.redirect('/dashboard');
      });
    });
  });
};

exports.comment = (req, res)=>{
  User.findById(req.user._id, u=>{
    u.addStar(user=>{
      Post.findById(req.params.pId, p=>{
        p.addComment(req.body, user.name, p=>{
          res.redirect('/dashboard');
        });
      });
    });
  });
};

exports.rsvp = (req, res)=>{
  var postId = req.params.pId;
  Post.findById(postId, post=>{
    post.reply(req.body, req.user, post=>{
      res.redirect('/dashboard');
    });
  });
};
