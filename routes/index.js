var crypto = require('crypto');
var User = require('../models/user');

module.exports = function (app) {
  app.get('/', function (req, res) {
    res.render('index', { title: '主页' });
  });

  app.get('/reg', function (req, res) {
    res.render('reg', { title: '注册'});
  });

  app.post('/reg', function (req, res) {
    var name = req.body.name;
    var password = req.body.password;
    var password_re = req.body['password-repeat'];

    if (password_re !== password) {
      req.flash('error', '两次输入的密码不一致！');
      return res.redirect('/reg');
    }
  });

  app.get('/login', function (req, res) {
    res.render('login', { title: '登陆' });
  });

  app.post('/login', function (req, res) {
  });

  app.get('/post', function (req, res) {
    res.render('post', { title: '发表' });
  });

  app.post('/post', function (req, res) {
  });

  app.get('/login', function (req, res) {
  });
};