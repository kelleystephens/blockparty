/* jshint unused:false */

'use strict';

var messageCollection = global.nss.db.collection('messages');
var Mongo = require('mongodb');
var _ = require('lodash');

class Message {
  static create(obj, fn){
    var message = new Message();
    message.toUserId = Mongo.ObjectID(obj.toUserId);
    message.fromUserId = Mongo.ObjectID(obj.fromUserId);
    message.isRead = false;
    message.subject = obj.subject;
    message.body = obj.body;
    message.sentDate = new Date();
    messageCollection.save(message, ()=>fn(message));
  }

  static findByToUserId(toUserId, fn){
    toUserId = Mongo.ObjectID(toUserId);
    messageCollection.find({toUserId:toUserId}).sort({sentDate: -1}).toArray((e,objs)=>{
      objs = objs.map(o=>_.create(Message.prototype, o));
      fn(objs);
    });
  }

  static findById(id, fn){
    if(typeof id === 'string'){
      if(id.length !== 24){fn(null); return;}
      id = Mongo.ObjectID(id);
    }

    if(!(id instanceof Mongo.ObjectID)){fn(null); return;}

    messageCollection.findOne({_id:id}, (e,o)=>{
      if(o){
        o = _.create(Message.prototype, o);
        fn(o);
      }else{
        fn(null);
      }
    });
  }

  read(fn){
    this.isRead = true;
    messageCollection.save(this, ()=>fn(this));
  }

  get klass(){
    if(!this.isRead){
      return 'unread';
    }else{
      return 'read';
    }
  }

}

module.exports = Message;
