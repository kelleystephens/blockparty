/* jshint unused:false */

'use strict';

var traceur = require('traceur');
var Message = traceur.require(__dirname + '/../models/message.js');
var User = traceur.require(__dirname + '/../models/user.js');

exports.new = (req, res)=>{
  var fromUser = req.user;
  User.findById(req.params.toId, toUser=>{
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
    msg.read(msg=>{
      User.findById(msg.toUserId, toUser=>{
        User.findById(msg.fromUserId, fromUser=>{
          res.render('messages/show', {fromUser:fromUser, toUser:toUser, message:msg, title: 'Message'});
        });
      });
    });
  });
};
