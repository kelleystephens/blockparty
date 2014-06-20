/* jshint unused:false */

'use strict';

var postCollection = global.nss.db.collection('posts');
var Mongo = require('mongodb');
var _ = require('lodash');

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

  static findById(pId, fn){
    var id = Mongo.ObjectID(pId);
    postCollection.findOne({_id: id}, (err, post)=>{
      post = _.create(Post.prototype, post);
      fn(null, post);
    });
  }

  addComment(obj, name, fn){
    var comment = {content:obj.content, name:name};
    this.comments.push(comment);
    postCollection.save(this, ()=>fn(this));
  }
}

module.exports = Post;
