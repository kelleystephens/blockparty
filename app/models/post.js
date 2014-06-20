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
    post.type = obj.type;
    post.date = new Date();
    post.comments = [];
    post.rsvp = [];
    postCollection.save(post, ()=>fn(post));
  }

  static findByUserId(arr, userId, fn){
    var id = Mongo.ObjectID(userId);
    postCollection.find({userId: {$in: arr}, rsvp: {$not: {$elemMatch: {id:id, attend:'no'}}}}).sort({date: -1}).toArray((err, posts)=>{
      posts = posts.map(post=> _.create(Post.prototype, post));
      fn(posts);
    });
  }

  static findById(pId, fn){
    var id = Mongo.ObjectID(pId);
    postCollection.findOne({_id: id}, (err, post)=>{
      if(post){
        post = _.create(Post.prototype, post);
        fn(post);
      }else{
        fn(null);
      }
    });
  }



  reply(obj, user, fn){
    var response = {id:user._id, name:user.name, attend:obj.attend};
    this.rsvp.push(response);
    postCollection.save(this, ()=>fn(this));
  }

  addComment(obj, name, fn){
    var comment = {content:obj.content, name:name};
    this.comments.push(comment);
    postCollection.save(this, ()=>fn(this));
  }

  get klass(){
    if(this.type === 'urgent'){
      return 'urgent';
    }else if(this.type === 'event'){
      return 'event';
    }else if(this.type === 'update'){
      return 'update';
    }else{
      return 'general';
    }
  }
}

module.exports = Post;
