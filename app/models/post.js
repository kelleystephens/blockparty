/* jshint unused:false */

'use strict';

var postCollection = global.nss.db.collection('posts');
// var Mongo = require('mongodb');
// var _ = require('lodash');

class Post {
  static create(obj, user, fn){
    var post = new Post();
    post.userId = user._id;
    post.subject = obj.subject;
    post.body = obj.body;
    post.date = new Date();
    post.comments = [];
    postCollection.save(post, ()=>fn(post));
  }

  static findByUserId(arr, fn){
    postCollection.find({userId: {$in: arr}}).sort({date: -1}).toArray((err, posts)=>{
      fn(posts);
    });
  }

  // static findById(id, fn){
  //   id = Mongo.ObjectID(id);
  //   userCollection.findOne({_id: id}, (err, user)=>{
  //     user = _.create(User.prototype, user);
  //     fn(null, user);
  //   });
  // }

  // static findByLocation(obj, fn){
  //   var lat = obj.coordinates[0] * 1;
  //   var lng = obj.coordinates[1] * 1;
  //   var oneMile = 0.000250;
  //   var maxdistance = 0.5 * oneMile;
  //   userCollection.find({coordinates:{$nearSphere:[lat, lng],$maxDistance:maxdistance}}).toArray(function(err, records){
  //     records = records.map(r=>_.create(User.prototype, r));
  //     fn(records);
  //   });
  // }
}

module.exports = Post;
