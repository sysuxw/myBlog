var getMongoConn = require('./mongodb').getMongoConn;

function User (user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
};

module.exports = User;

User.prototype.save = function(callback) {
  var user = {
    name: this.name,
    password: this.password,
    email: this.email
  };

  getMongoConn(function (error, db) {
    if (error) return callback(error);

    db.collection('users', function (error, collection) {
      if (error) {
        return callback(error);
      }

      collection.insert(user, { safe: true }, function (error, user) {
        if (error) return callback(error);
        callback(null, user[0]);
      });
    });
  });
};

Uesr.get = function (name, callback) {
  getMongoConn(function (error, db) {
    if (error) return callback(error);
    db.collection('users', function (error, collection) {

    });
  });
};