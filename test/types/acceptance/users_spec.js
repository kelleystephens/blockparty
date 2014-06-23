/* global describe, before, beforeEach, it */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'blueprint-test';

var expect = require('chai').expect;
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');
var app = require('../../../app/app');
var request = require('supertest');

var User;

describe('users', function(){

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

  describe('GET /login', function(){
    it('should show the login page', function(done){
      request(app)
      .get('/login')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('GET /signup', function(){
    it('should show the signup page', function(done){
      request(app)
      .get('/signup')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  // describe('GET /profile', function(){
  //   it('should show the profile edit page', function(done){
  //     request(app)
  //     .get('/profile')
  //     .end(function(err, res){
  //       expect(res.status).to.equal(200);
  //       done();
  //     });
  //   });
  // });
  //
  // describe('POST /profile', function(){
  //   it('should save the profile info', function(done){
  //     request(app)
  //     .post('/profile')
  //     .end(function(err, res){
  //       console.log('***************');
  //       console.log(res.headers);
  //       expect(res.status).to.equal(302);
  //       expect(res.headers.location).to.equal('/location');
  //       done();
  //     });
  //   });
  // });

  // describe('POST /logout', function(){
  //   it('should logout an existing user', function(done){
  //     request(app)
  //     .post('/logout')
  //     .end(function(err, res){
  //       expect(res.status).to.equal(302);
  //       expect(res.headers.location).to.equal('/');
  //       expect(res.headers['set-cookie']).to.be.ok;
  //       done();
  //     });
  //   });
  // });

});
