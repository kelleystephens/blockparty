/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'blockparty-test';

var expect = require('chai').expect;
// var Mongo = require('mongodb');
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');

var Message;

describe('Message', function(){
  before(function(done){
    db(function(){
      Message = traceur.require(__dirname + '/../../../app/models/message.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('messages').drop(function(){
      Message.create({'_id':'1a23456789abcdef01234568', 'toUser':'1b23456789abcdef01234568', 'fromUser':'1acb456789abcdef01234568', 'subject':'hey you', 'body': 'hope you are well'}, function(message){
        done();
      });
    });
  });

  describe('.create', function(){
    it('should successfully create a message', function(done){
      Message.create({'_id':'1a23456789abcdef01234568', 'toUserId':'1b23456789abcdef01234568', 'fromUserId':'1acb456789abcdef01234568', 'subject':'hey you', 'body': 'hope you are well'}, function(message){
        expect(message).to.be.ok;
        expect(message).to.be.instanceof(Message);
        expect(message.toUserId.toString()).to.equal('1b23456789abcdef01234568');
        expect(message.fromUserId.toString()).to.equal('1acb456789abcdef01234568');
        expect(message.subject).to.equal('hey you');
        expect(message.body).to.equal('hope you are well');
        done();
      });
    });
  });

  describe('.findByToUserId', function(){
    it('should return a message with matching toUserId', function (done){
      Message.findByToUserId('1b23456789abcdef01234568', function(message){
        expect(message).to.be.ok;
        expect(message).to.be.an('array');
        done();
      });
    });
  });

  describe('.findById', function (){
    it('should return a message with matching id', function (done){
      Message.findById('1a23456789abcdef01234568', function (message){
        expect(message).to.be.ok;
        expect(message).to.be.instanceof(Message);
        expect(message.subject).to.equal('hey you');
        done();
      });
    });
    it('should return null - no such id', function(done){
      Message.findById('abc3456789abcdef01234568', function(message){
        expect(message).to.be.null;
        done();
      });
    });
  });

  describe('#read', function (){
    it('should change read status to true', function (done){
      Message.findById('1a23456789abcdef01234568', function(message){
        message.read(function (message){
          expect(message.isRead).to.be.true;
          done();
        });
      });
    });
  });
});
