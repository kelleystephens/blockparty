/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'blockparty-test';

var expect = require('chai').expect;
// var Mongo = require('mongodb');
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');

var Post;

describe('Post', function(){
  before(function(done){
    db(function(){
      Post = traceur.require(__dirname + '/../../../app/models/post.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('posts').drop(function(){
      Post.create({'_id':'1a23456789abcdef01234568', 'subject':'hey you', 'body': 'hope you are well'}, {'_id':'0a23456789abcdef01234568'}, function(post){
        done();
      });
    });
  });

  describe('.create', function(){
    it('should successfully create a post', function(done){
      Post.create({'subject':'hey you', 'body': 'hope you are well'}, {'_id':'0123456789abcdef01234568'}, function(post){
        expect(post).to.be.ok;
        expect(post).to.be.instanceof(Post);
        expect(post.userId).to.equal('0123456789abcdef01234568');
        expect(post.subject).to.equal('hey you');
        expect(post.body).to.equal('hope you are well');
        done();
      });
    });
  });

  describe('.findById', function () {
    it('should return a post with matching credentials', function (done) {
      Post.findById('1a23456789abcdef01234568', function (post) {
        expect(post).to.be.ok;
        expect(post).to.be.instanceof(Post);
        expect(post.subject).to.equal('hey you');
        done();
      });
    });
    it('should return null - no such id', function(done){
      Post.findById('abc3456789abcdef01234568', function(post){
        expect(post).to.be.null;
        done();
      });
    });
  });

  // describe('.findByUserId', function(){
  //   it('should find a post by the userId', function(done){
  //     var id = Mongo.ObjectID('0a23456789abcdef01234568');
  //     Post.findByUserId([{'userId':id, 'rsvp':[{'id':'0a23456789abcdef01234561', 'attend':'yes'}], 'date':'2014-06-20'}], '0a23456789abcdef01234568', function(posts){
  //       expect(posts).to.be.an('array');
  //       expect(posts).to.not.be.empty;
  //       expect(posts[0].userId).to.equal('0a23456789abcdef01234568');
  //       done();
  //     });
  //   });
  // });

  describe('#reply', function(){
    it('should add an RSVP to the post', function(done){
      Post.findById('1a23456789abcdef01234568', function(post){
        post.reply({'attend':'yes'}, {_id:'1a23456789abcdef01234569', name:'Jane'}, function(post){
          expect(post).to.be.ok;
          expect(post.rsvp).to.not.be.empty;
          expect(post.rsvp[0].attend).to.deep.equal('yes');
          expect(post.rsvp[0].name).to.deep.equal('Jane');
          done();
        });
      });
    });
  });

  describe('#addComment', function(){
    it('should add a comment to the post', function(done){
      Post.findById('1a23456789abcdef01234568', function(post){
        post.addComment({'content':'great post'}, {'name':'Sally'}, function(post){
          expect(post).to.be.ok;
          expect(post.comments).to.not.be.empty;
          expect(post.comments[0].content).to.deep.equal('great post');
          expect(post.comments[0].name).to.deep.equal({name:'Sally'});
          done();
        });
      });
    });
  });
});
