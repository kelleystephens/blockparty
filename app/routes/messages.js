/* jshint unused:false */

'use strict';

var traceur = require('traceur');
var Message = traceur.require(__dirname + '/../models/message.js');
var User = traceur.require(__dirname + '/../models/user.js');

exports.new = (req, res)=>{
  console.log('user**********************');
  console.log(req.user);
  var fromUser = req.user;
  User.findById(req.params.toId, toUser=>{
    res.render('messages/new', {user: req.user, fromUser: fromUser, toUser: toUser, title: 'Write a Message'});
  });
};

exports.create = (req, res)=>{
  Message.create(req.body, msg=>{
    res.redirect('/dashboard');
  });
};

exports.show = (req, res)=>{
  console.log('user**********************');
  Message.findById(req.params.mId, msg=>{
    msg.read(msg=>{
      User.findById(msg.toUserId, toUser=>{
        User.findById(msg.fromUserId, fromUser=>{
          res.render('messages/show', {user: req.user, fromUser:fromUser, toUser:toUser, message:msg, title: 'Message'});
        });
      });
    });
  });
};
