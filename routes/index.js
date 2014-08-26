var checkNotLogin = require('./middlewares').checkNotLogin;
var checkLogin = require('./middlewares').checkLogin;
var controllers = require('../controllers');
var user = require('../controllers/user');
var post = require('../controllers/post');

module.exports = function (app) {
  app.get('/', controllers.index);

  app.get('/reg', checkNotLogin, user.showReg);

  app.post('/reg', checkNotLogin, user.reg);

  app.get('/login', checkNotLogin, user.showLogin);

  app.post('/login', checkNotLogin, user.login);

  app.get('/post', checkLogin, post.showPost);

  app.post('/post', checkLogin, post.post);

  app.get('/logout', checkLogin, user.logout);

  app.get('/upload', checkLogin, user.showUpload);

  app.post('/upload', checkLogin, user.upload);

  app.get('/u/:name', controllers.getOnesPosts);

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
    var options = {
      content: req.body.content
    };
    postModel.update(query, options, function (error, post) {
      var url = '/u/' + req.params.name + '/' + req.params.day
          + '/' + req.params.title;
      if (error) {
        req.flash('error', error);
        return res.redirect(url);
      }
      req.flash('success', '修改成功！');
      return res.redirect(url);
    });
  });
};