var bcrypt = require('bcryptjs');
var Q = require('q');

// MongoDB connection information
var mongodbUrl = 'mongodb://nhatanh285:hna2851992@ds113835.mlab.com:13835/nhatanh_test';
var MongoClient = require('mongodb').MongoClient
//used in local-signup strategy
exports.localReg = function (username, password) {
  var deferred = Q.defer();
  
  MongoClient.connect(mongodbUrl, function (err, db) {
    var collection = db.collection('users');

    //check if username is already assigned in our database
    collection.findOne({'user_name' : username})
      .then(function (result) {
        if (null != result) {
          console.log("USERNAME ALREADY EXISTS:", result.username);
          deferred.resolve(false); // username exists
        }
        else  {
          var hash = bcrypt.hashSync(password, 8);
          var user = {
            "user_name": username,
            "password": hash,
            "avatar": "http://placepuppy.it/images/homepage/Beagle_puppy_6_weeks.JPG"
          }

          console.log("CREATING USER:", username);
        
          collection.insert(user)
            .then(function () {
              db.close();
              deferred.resolve(user);
            });
        }
      });
  });

  return deferred.promise;
};

exports.localAuth = function (username, password) {
  var deferred = Q.defer();

  MongoClient.connect(mongodbUrl, function (err, db) {
    var collection = db.collection('users');

    collection.findOne({'user_name' : username})
      .then(function (result) {
        if (null == result) {
          console.log("USERNAME NOT FOUND:", username);

          deferred.resolve(false);
        }
        else {
          var hash = result.password;

          console.log("FOUND USER: " + result.username);

          if (bcrypt.compareSync(password, hash)) {
            deferred.resolve(result);
          } else {
            console.log("AUTHENTICATION FAILED");
            deferred.resolve(false);
          }
        }

        db.close();
      });
  });

  return deferred.promise;
}
