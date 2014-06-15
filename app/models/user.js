/* jshint unused:false */

var userCollection = global.nss.db.collection('users');
var bcrypt = require('bcrypt');

class User{
  static createLocal(req, email, password, fn){
    var user = new User();
    user.local.email = email;
    user.local.password = bcrypt.hashSync(password, 8);
    userCollection.save(user, ()=>fn(user));
  }
  // local{
  //   email        : String,
  //   password     : String,
  //   },
  //   facebook{
  //     id           : String,
  //     token        : String,
  //     email        : String,
  //     name         : String
  //   },
  //   twitter{
  //     id           : String,
  //     token        : String,
  //     displayName  : String,
  //     username     : String
  //   },
  //   google{
  //     id           : String,
  //     token        : String,
  //     email        : String,
  //     name         : String
  //   }

  validPassword(password){
    return bcrypt.compareSync(password, this.local.password);
  }
}

module.exports = User;

//CREATING USER THE ORIGINAL WAY

// var bcrypt = require('bcrypt');
// var userCollection = global.nss.db.collection('users');
// var Mongo = require('mongodb');
// var traceur = require('traceur');
// var Base = traceur.require(__dirname + '/base.js');
//
// class User{
//   static create(obj, fn){
//     userCollection.findOne({email:obj.email}, (e,u)=>{
//       if(!u){
//         var user = new User();
//         user._id = Mongo.ObjectID(obj._id);
//         user.email = obj.email;
//         user.password = bcrypt.hashSync(obj.password, 8);
//         user.firstName = obj.firstName;
//         user.lastName = obj.lastName;
//         userCollection.save(user, ()=>fn(user));
//       }else{
//         fn(null);
//       }
//     });
//   }
//
//   static login(obj, fn){
//     userCollection.findOne({email:obj.email}, (e,u)=>{
//       if(u){
//         var isMatch = bcrypt.compareSync(obj.password, u.password);
//         if(isMatch){
//           fn(u);
//         }else{
//           fn(null);
//         }
//       }else{
//         fn(null);
//       }
//     });
//   }
//
//   static findById(id, fn){
//     Base.findById(id, userCollection, User, fn);
//   }
// }
//
// module.exports = User;
