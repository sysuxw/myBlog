var getMongoConn = require('./mongodb').getMongoConn;
var markdown = require('markdown').markdown;

function Post (post) {
  this.name = post.name;
  this.title = post.title;
  this.content = post.content;
};

module.exports = Post;

Post.prototype.save = function(callback) {
  var date = new Date();
  var year = date.getFullYear();
  var month = year + '-' + (date.getMonth() + 1);
  var day = month + '-' + date.getDate();
  var minute = day + ' ' + date.getHours() + ':' +
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());

  var time = {
    date: date,
    year: year,
    month: month,
    day: day,
    minute: minute
  };
  console.log('time:', time);

  var post = {
    name: this.name,
    title: this.title,
    content: this.content,
    createTime: time
  };

  getMongoConn(function (error, db) {
    if (error) return callback(error);
    db.collection('posts', function (error, collection) {
      if (error) return callback(error);
      collection.insert(post, function (error, post) {
        if (error) return callback(error);
        callback(null, post);
      });
    });
  });
};

Post.getAll = function (name, callback) {
  getMongoConn(function (error, db) {
    if (error) return callback(error);

    db.collection('posts', function (error, collection) {
      if (error) return callback(error);

      var query = {};
      if (name) query.name = name;

      collection.find(query).sort({
        createTime: -1
      }).toArray(function (error, docs) {
        if (error) return callback(error);
        docs.forEach(function (doc) {
          doc.content = markdown.toHTML(doc.content);
        });
        callback(null, docs);
      });
    });
  });
};

Post.getOne = function (query, callback) {
  getMongoConn(function (error, db) {
    if (error) return callback(error);
    db.collection('posts', function (error, collection) {
      if (error) return callback(error);
      collection.findOne(query, function (error, doc) {
        if (error) return callback(error);
        doc.content = markdown.toHTML(doc.content);
        callback(null, doc);
      });
    });
  });
};

// 返回原始的markdown格式
Post.edit = function (query, callback) {
  getMongoConn(function (error, db) {
    if (error) return callback(error);
    db.collection('posts', function (error, collection) {
      if (error) return callback(error);
      collection.findOne(query, function (error, doc) {
        if (error) return callback(error);
        callback(null, doc);
      });
    });
  });
};

Post.update = function (query, option, callback) {
  getMongoConn(function (error, db) {
    if (error) return callback(error);
    db.collection('posts', function (error, collection) {
      if (error) return callback(error);
      collection.update(query, option, function (error) {
        if (error) return callback(error);
        callback(null);
      });
    });
  });
};