var config = require('../settings').mongodb;
var MongoClient = require('mongodb').MongoClient;

exports.getMongoConn = function (callback) {
  var url = 'mongodb://' + config.host + ':' + config.port + '/' + config.dbname;
  MongoClient.connect(url, function (error, db) {
    if (error) return callback(error);
    callback(null, db);
  });
};