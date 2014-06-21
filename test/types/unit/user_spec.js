/* global describe, it, before, beforeEach, afterEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'blockparty-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');
var cp = require('child_process');

var User;

describe('User', function(){
  before(function(done){
    db(function(){
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('users').remove(function(){
      cp.execFile(__dirname + '/../../fixtures/before.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
        factory('user', function(users){
          done();
        });
      });
    });
  });

  afterEach(function(done){
    cp.execFile(__dirname + '/../../fixtures/after.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('.findById', function(){
    it('should return a user with a matching id', function(done){
      User.findById('0123456789abcdef01234568', function(user){
        expect(user).to.be.ok;
        expect(user).to.be.instanceof(User);
        expect(user.email).to.equal('sue@aol.com');
        done();
      });
    });
    it('should return null - no such id', function(done){
      User.findById('abc3456789abcdef01234568', function(user){
        expect(user).to.be.null;
        done();
      });
    });
  });

  describe('findByLocation', function(){
    it('should find users by their location', function(done){
      var obj = {coordinates: ['36.168987', '-86.79953799999998']};
      User.findByLocation(obj, function(users){
        expect(users).to.be.an('array');
        expect(users[0]).to.be.ok;
        expect(users[0]).to.be.instanceof(User);
        expect(users[0]._id).to.be.instanceof(Mongo.ObjectID);
        expect(users[0].email).to.equal('sue@aol.com');
        done();
      });
    });
  });

  describe('#addCoords', function(){
    it('should add lat and lng to user', function(done){
      User.findById('0123456789abcdef01234568', function(u){
        u.addCoords({address: '123 Main Street, Nashville, TN 37208', coordinates:['36.16958', '-86.798264']}, function(user){
          expect(user.coordinates).to.be.an('array');
          expect(user.coordinates[0]).to.equal(36.16958);
          expect(user.coordinates[1]).to.equal(-86.798264);
          expect(user.address).to.equal('123 Main Street, Nashville, TN 37208');
          done();
        });
      });
    });
  });

  describe('#addStar', function(){
    it('should add 1 star to the user', function(done){
      User.findById('0123456789abcdef01234568', function(u){
        u.addStar(function(user){
          expect(user.stars).to.equal(2);
          done();
        });
      });
    });
  });

  describe('#update', function(){
    it('should update a user', function(done){
      User.findById('0123456789abcdef01234568', function(u){
        var obj = {name: ['Sue Smith'], about:['I am signing up for your app'], spouse:['husband'], spouseName:['John'], kids:['son', 'son'], kidName:['Bob', 'Tom'], pets:['cat'], petName:['fluffy'], photo: [{originalFilename: 'pic.jpg', path: '../../test/fixtures/copy/pic.jpg', size: 10}]};
        u.update(obj, function(user){
          expect(user).to.be.ok;
          expect(user).to.be.instanceof(User);
          expect(user._id.toString()).to.deep.equal('0123456789abcdef01234568');
          expect(user.name).to.equal('Sue Smith');
          expect(user.about).to.equal('I am signing up for your app');
          done();
        });
      });
    });
  });

});
