var fs = require('fs');
var path = require("path");
var crypto = require('crypto');
var formidable = require('formidable');
var userModel = require('../models/user');

exports.showReg = function (req, res, next) {
  res.render('reg', {
    title: '注册',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
};

exports.reg = function (req, res, next) {
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
};

exports.showLogin = function (req, res, next) {
  res.render('login', { title: '登陆' });
};

exports.login = function (req, res, next) {
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
};

exports.logout = function (req, res, next) {
  req.session.user = null;
  req.flash('success', '登出成功！');
  res.redirect('/');
};

exports.showUpload = function (req, res, next) {
  res.render('upload', {
    title: '文件上传',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
};

exports.upload = function (req, res, next) {
  var form = new formidable.IncomingForm({
    keepExtensions: true,
    upload: '../public/images'
  });
  form.parse(req, function (error, fileds, files) {
    for (var i in files) {
      if (files[i].size === 0) {
        fs.unlinkSync(files[i].path);
        console.log('Successfully removed an empty file!');
      } else {
        var target_path = path.normalize(__dirname + '/../public/images/' + files[i].name);
        fs.renameSync(files[i].path, target_path);
        console.log('Successfully renamed a file!');
      }
    }
    req.flash('success', '文件上传成功！');
    res.redirect('/upload');
  });
};

exports.parseName = function (req, res, next, name) {
  userModel.get(name, function (error, user) {
    if (error) return next(error);
    if (!user) res.status(404).send('用户不存在');
    req.user = user;
    next();
  });
};