var postModel = require('../models/post');

exports.getAllPosts = function (req, res, next) {
  postModel.getAll(null, function (error, posts) {
    if (error) posts = [];
    res.render('index', {
      title: '主页',
      user: req.session.user,
      posts: posts,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
};

exports.getPostsByName = function (req, res, next) {
  postModel.getAll(req.user.name, function (error, posts) {
    if (error) {
      req.flash('error', error);
      return res.redirect('/');
    }
    res.render('user', {
      title: req.params.name,
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
};

exports.getPostByInfo = function (req, res, next) {
  var query = {
    name: req.params.name,
    "createTime.day": req.params.day,
    title: req.params.title
  };
  postModel.getOne(query, function (error, post) {
    if (error) {
      req.flash('error', error);
      return res.redirect('/');
    }
    res.render('article', {
      title: req.params.title,
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
};

exports.getOriginalPost = function (req, res, next) {
  var currentUser = req.session.user;
  var query = {
    name: currentUser.name,
    "createTime.day": req.params.day,
    title: req.params.title
  };
  postModel.edit(query, function (error, post) {
    if (error) {
      req.flash('error', error);
      res.redirect('back');
    }
    res.render('edit', {
      title: '编辑',
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
};

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

exports.update = function (req, res) {
  var currentUser = req.session.user;
  var query = {
    "name": currentUser.name,
    "createTime.day": req.params.day,
    "title": req.params.title
  };
  var options = {
    $set: { content: req.body.content }
  };
  postModel.update(query, options, function (error, post) {
    var url = '/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title;
    if (error) {
      req.flash('error', error);
      return res.redirect(url);
    }
    req.flash('success', '修改成功！');
    return res.redirect(url);
  });
}