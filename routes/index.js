var checkNotLogin = require('./middlewares').checkNotLogin;
var checkLogin = require('./middlewares').checkLogin;
var controllers = require('../controllers');
var user = require('../controllers/user');
var post = require('../controllers/post');

module.exports = function (app) {
  app.get('/', post.getAllPosts);

  app.get('/reg', checkNotLogin, user.showReg);
  app.post('/reg', checkNotLogin, user.reg);

  app.get('/login', checkNotLogin, user.showLogin);
  app.post('/login', checkNotLogin, user.login);

  app.get('/post', checkLogin, post.showPost);
  app.post('/post', checkLogin, post.post);

  app.get('/logout', checkLogin, user.logout);

  app.get('/upload', checkLogin, user.showUpload);
  app.post('/upload', checkLogin, user.upload);

  app.get('/u/:name', post.getPostsByName);
  app.get('/u/:name/:day/:title', post.getPostByInfo);

  app.get('/edit/:name/:day/:title', checkLogin, post.getOriginalPost);
  app.post('/edit/:name/:day/:title', checkLogin, post.update);

  app.param('name', user.parseName);
};
