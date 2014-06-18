/* jshint unused:false */

'use strict';

var traceur = require('traceur');
var Post = traceur.require(__dirname + '/../models/post.js');

exports.new = (req, res)=>{
  res.render('posts/new', {user: req.user, title: 'Write a Post'});
};

exports.create = (req, res)=>{
  Post.create(req.body, req.user, p=>{
    res.redirect(`/dashboard/${req.user._id}`);
  });
};
