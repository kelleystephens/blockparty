/* jshint unused:false */

'use strict';

var traceur = require('traceur');
var Message = traceur.require(__dirname + '/../models/message.js');
var User = traceur.require(__dirname + '/../models/user.js');

exports.new = (req, res)=>{
  var fromUser = req.user;
  User.findById(req.params.toId, (err, toUser)=>{
    res.render('messages/new', {fromUser: fromUser, toUser: toUser, title: 'Write a Post'});
  });
};

exports.create = (req, res)=>{
  Message.create(req.body, msg=>{
    res.redirect('/dashboard');
  });
};

exports.show = (req, res)=>{
  Message.findById(req.params.mId, msg=>{
    User.findById(msg.toUserId, (err, toUser)=>{
      User.findById(msg.fromUserId, (err, fromUser)=>{
        res.render('messages/show', {fromUser:fromUser, toUser:toUser, message:msg, title: 'Message'});
      });
    });
  });
};
