/* jshint unused:false */

'use strict';

var userCollection = global.nss.db.collection('users');
var Mongo = require('mongodb');
var traceur = require('traceur');
// var Base = traceur.require(__dirname + '/base.js');
var bcrypt = require('bcrypt');
var fs = require('fs');
var rimraf = require('rimraf');
var _ = require('lodash');

class User {
  constructor(){

    this.local = {
      email:    String,
      password: String
    };

    this.facebook = {
      id:       String,
      token:    String,
      email:    String,
      name:     String
    };
  }

  save(fn){
    userCollection.save(this, ()=>fn());
  }

  // generating a hash
  generateHash(password) {
    return bcrypt.hashSync(password, 8);
  }

  // checking if password is valid
  validPassword(password) {
    return bcrypt.compareSync(password, this.local.password);
  }

  static findById(id, fn){
    id = Mongo.ObjectID(id);
    userCollection.findOne({_id: id}, (err, user)=>{
      fn(null, user);
    });
  }

  //for testing purposes only
  static create(obj, fn){
    userCollection.findOne({email:obj.email}, (e,u)=>{
      if(u){
        fn(null);
      }else{
        var user = new User();
        user._id = Mongo.ObjectID(obj._id);
        user.email = obj.email;
        user.password = bcrypt.hashSync(obj.password, 8);
        user.coordinates = obj.coordinates.map(n=>n*1);
        userCollection.save(user, ()=>fn(user));
      }
    });
  }

  addCoords(obj, fn){
    this.address = obj.address;
    this.city = obj.city.toLowerCase().charAt(0).toUpperCase() + obj.city.slice(1);
    this.state = obj.state.toLowerCase().charAt(0).toUpperCase() + obj.state.slice(1);
    this.zip = obj.zip;
    this.coordinates = obj.coordinates.map(n=>n*1);
    userCollection.save(this, ()=>fn(this));
  }

  update(obj, fn){
    this.name = obj.name[0].toLowerCase().charAt(0).toUpperCase() + obj.name[0].slice(1);
    this.description = obj.description[0];
    this.photo = `/img/${this._id.toString()}/${obj.photo[0].originalFilename}`;

    var path = obj.photo[0].path;
    if(path[0] !== '/'){path = __dirname + '/' + path;}
    var userDir = `${__dirname}/../static/img/${this._id.toString()}`;
    var fileDir =  `${userDir}/${obj.photo[0].originalFilename}`;
    if(!fs.existsSync(userDir)){
      fs.mkdirSync(userDir);
      fs.renameSync(path, fileDir);
      userCollection.save(this, ()=>fn(this));
    }else{
      rimraf(userDir, ()=>{
        fs.mkdirSync(userDir);
        fs.renameSync(path, fileDir);
        userCollection.save(this, ()=>fn(this));
      });
    }
  }

  static findByLocation(obj, fn){
    var lat = obj.coordinates[0] * 1;
    var lng = obj.coordinates[1] * 1;
    var oneMile = 0.000250;
    var maxdistance = 0.5 * oneMile;
    userCollection.find({coordinates:{$nearSphere:[lat, lng],$maxDistance:maxdistance}}).toArray(function(err, records){
      records = records.map(r=>_.create(User.prototype, r));
      fn(records);
    });
  }
}

module.exports = User;
