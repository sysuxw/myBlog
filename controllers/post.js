var postModel = require('../models/post');

exports.showPost = function (req, res, next) {
  res.render('post', {
    title: '发表',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
};

exports.post = function (req, res, next) {
  var currentUser = req.session.user;
  var newPost = new postModel({
    name: currentUser.name,
    title: req.body.title,
    content: req.body.content
  });
  newPost.save(function (error) {
    if (error) {
      req.flash('error', error);
      return res.redirect('/');
    }
    req.flash('success', '发布成功！');
    res.redirect('/');
  });
};