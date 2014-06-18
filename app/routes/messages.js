/* jshint unused:false */

'use strict';

var traceur = require('traceur');
var Message = traceur.require(__dirname + '/../models/message.js');
var User = traceur.require(__dirname + '/../models/user.js');

exports.new = (req, res)=>{
  User.findById(req.user._id, fromUser=>{
    User.findById(req.params.toId, toUser=>{
      res.render('message/new', {fromUser: fromUser, toUser: toUser, title: 'Write a Post'});
    });
  });
};

exports.create = (req, res)=>{
  Message.create(req.body, msg=>{
    res.redirect(`/meet/${msg.toUserId}`);
  });
};

exports.show = (req, res)=>{
  Message.findById(req.params.mId, msg=>{

  });
};
