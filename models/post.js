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

Post.get = function (name, callback) {
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