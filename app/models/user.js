/* jshint unused:false */

'use strict';

var userCollection = global.nss.db.collection('users');
var Mongo = require('mongodb');
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
      user = _.create(User.prototype, user);
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
    this.coordinates = obj.coordinates.map(n=>n*1);
    userCollection.save(this, ()=>fn(this));
  }

  update(obj, fn){
    this.name = obj.name[0].toLowerCase().charAt(0).toUpperCase() + obj.name[0].slice(1);
    this.about = obj.about[0];
    var spouseType = obj.spouse[0].toLowerCase().charAt(0).toUpperCase() + obj.spouse[0].slice(1);
    var spouseName = obj.spouseName[0].toLowerCase().charAt(0).toUpperCase() + obj.spouseName[0].slice(1);
    this.spouse = {type:'', name:''};
    this.spouse.type = spouseType;
    this.spouse.name = spouseName;
    this.kids = [];
    this.pets = [];
    var filename = obj.photo[0].originalFilename.replace(/\s/g,'-');
    this.photo = `/img/${this._id.toString()}/${filename}`;

    //gets props and values for kids
    for(var i = 0; i < obj.kids.length; i++){
      var kid = {type:'', name:''};
      kid.type = obj.kids[i].charAt(0).toUpperCase() + obj.kids[i].slice(1).toLowerCase();
      kid.name = obj.kidName[i].charAt(0).toUpperCase() + obj.kidName[i].slice(1).toLowerCase();
      this.kids.push(kid);
    }

    //gets props and values for pets
    for(var j = 0; j < obj.pets.length; j++){
      var pet = {type:'', name:''};
      pet.type = obj.pets[j].charAt(0).toUpperCase() + obj.pets[j].slice(1).toLowerCase();
      pet.name = obj.petName[j].charAt(0).toUpperCase() + obj.petName[j].slice(1).toLowerCase();
      this.pets.push(pet);
    }
    //create folder for pic and saves it
    var path = obj.photo[0].path;
    if(path[0] !== '/'){path = __dirname + '/' + path;}
    var userDir = `${__dirname}/../static/img/${this._id.toString()}`;
    var fileDir =  `${userDir}/${filename}`;
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

  //find all users within a half mile
  static findByLocation(obj, fn){
    var lat = obj.coordinates[0] * 1;
    var lng = obj.coordinates[1] * 1;
    var oneMile = 0.000250;
    var maxdistance = 0.25 * oneMile;
    userCollection.find({coordinates:{$nearSphere:[lat, lng],$maxDistance:maxdistance}}).toArray(function(err, records){
      records = records.map(r=>_.create(User.prototype, r));
      fn(records);
    });
  }
}

module.exports = User;
