/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'blockparty-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');

var User;

describe('User', function(){
  before(function(done){
    db(function(){
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('users').drop(function(){
      factory('user', function(users){
        done();
      });
    });
  });

  describe('.create', function(){
    it('should create a new user', function(done){
      User.create({firstName:'jane', lastName:'doe', email:'jane@doe.com', password:'jane'}, function(user){
        expect(user).to.be.ok;
        expect(user).to.be.an.instanceof(User);
        expect(user._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(user.firstName).to.equal('jane');
        expect(user.lastName).to.equal('doe');
        expect(user.password).to.have.length(60);
        done();
      });
    });

    it('should not create a new user - already exists', function(done){
      User.create({firstName:'sue', lastName:'blah', email:'sue@aol.com', password:'doesnt matter'}, function(user){
        expect(user).to.be.null;
        done();
      });
    });
  });

  describe('.login', function(){
    it('should login a user', function(done){
      User.login({email:'sue@aol.com', password:'5678'}, function(u){
        expect(u).to.be.ok;
        done();
      });
    });

    it('should NOT login user - bad password', function(done){
      User.login({email:'sue@aol.com', password:'wrong'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should successfully find a user - String', function(done){
      User.findById('0123456789abcdef01234568', function(u){
        expect(u).to.be.instanceof(User);
        expect(u.email).to.equal('sue@aol.com');
        done();
      });
    });

    it('should successfully find a user - object id', function(done){
      User.findById(Mongo.ObjectID('0123456789abcdef01234568'), function(u){
        expect(u).to.be.instanceof(User);
        expect(u.email).to.equal('sue@aol.com');
        done();
      });
    });

    it('should NOT successfully find a user - Bad Id', function(done){
      User.findById('not an id', function(u){
        expect(u).to.be.null;
        done();
      });
    });

    it('should NOT successfully find a user - NULL', function(done){
      User.findById(null, function(u){
        expect(u).to.be.null;
        done();
      });
    });
  });

});
