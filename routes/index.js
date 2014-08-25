var crypto = require('crypto');
var formidable = require('formidable');
var fs = require('fs');
var userModel = require('../models/user');
var postModel = require('../models/post');
var checkNotLogin = require('../middlewares').checkNotLogin;
var checkLogin = require('../middlewares').checkLogin;
var path = require("path");

module.exports = function (app) {
  app.get('/', function (req, res, next) {
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

  app.post('/upload', checkLogin, function (req, res, next) {
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
  });

  app.get('/u/:name', function (req, res, next) {
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
  });

  app.get('/u/:name/:day/:title', function (req, res, next) {
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
  });

  app.get('/edit/:name/:day/:title', checkLogin, function (req, res) {
    var currentUser = req.session.user;
    var query = {
      name: currentUser.name,
      'createTime.day': req.params.day,
      title: req.params.title
    };
    postModel.edit(query, function (error, post) {
      if (error) {
        req.flash('error', error);
        return res.redirect('/');
      }
      res.render('edit', {
        title: '编辑',
        post: post,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });
};