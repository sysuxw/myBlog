var postModel = require('../models/post');
var userModel = require('../models/user');
exports.checkLogin = function (req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登录！');
    res.redirect('/login');
  }
  next();
};

exports.checkNotLogin = function (req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登录！');
    res.redirect('back');
  }
  next();
};

exports.getOnesPosts = function (req, res, next) {
userModel.get(req.params.name, function (error, user) {
  if (!user) {
    req.flash('error', error);
    return res.redirect('/');
    }
    postModel.getAll(user.name, function (error, posts) {
      if (error) {
        req.flash('error', error);
        return res.redirect('/');
      }
      res.render('user', {
        title: user.name,
        posts: posts,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });
};