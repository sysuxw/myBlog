var crypto = require('crypto');
var userModel = require('../models/user');
var postModel = require('../models/post');
var checkNotLogin = require('../middlewares').checkNotLogin;
var checkLogin = require('../middlewares').checkLogin;

module.exports = function (app) {
  app.get('/', function (req, res, next) {
    postModel.get(null, function (error, posts) {
      if (error) posts = [];
      res.render('index', {
        title: '主页',
        user: req.session.user,
        posts: posts,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });

  app.get('/reg', checkNotLogin, function (req, res, next) {
    res.render('reg', {
      title: '注册',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.post('/reg', checkNotLogin, function (req, res, next) {
    var name = req.body.name;
    var password = req.body.password;
    var password_re = req.body['password-repeat'];

    if (password_re !== password) {
      req.flash('error', '两次输入的密码不一致！');
      return res.redirect('/reg');
    }
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');

    var newUser = new userModel({
      name: req.body.name,
      password: password,
      email: req.body.email
    });

    userModel.get(newUser.name, function (error, user) {
      if (error) {
        req.flash('error', error);
        return res.redirect('/reg');
      }
      if (user) {
        req.flash('error', '用户已存在！');
        return res.redirect('/reg');
      }

      newUser.save(function (error, user) {
        if (error) {
          req.flash('error', error);
          return res.redirect('/reg');
        }
        req.session.user = user;
        req.flash('success', '注册成功！');
        res.redirect('/');
      });
    });
  });

  app.get('/login', checkNotLogin, function (req, res, next) {
    res.render('login', { title: '登陆' });
  });

  app.post('/login', checkNotLogin, function (req, res, next) {
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');

    userModel.get(req.body.name, function (error, user) {
      if (error) {
        req.flash('error', error);
        return res.redirect('/login');
      }
      if (!user) {
        req.flash('error', '用户不存在！');
        return res.redirect('/login');
      }
      if (password !== user.password) {
        req.flash('error', '密码错误！');
        return res.redirect('/login');
      }
      req.session.user = user;
      req.flash('success', '登陆成功！');
      res.redirect('/');
    });
  });

  app.get('/post', checkLogin, function (req, res, next) {
    res.render('post', {
      title: '发表',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.post('/post', checkLogin, function (req, res, next) {
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
  });

  app.get('/logout', checkLogin, function (req, res, next) {
    req.session.user = null;
    req.flash('success', '登出成功！');
    res.redirect('/');
  });

  app.get('/upload', checkLogin, function (req, res, next) {
    res.render('upload', {
      title: '文件上传',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });


};