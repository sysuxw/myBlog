exports.index = function (req, res, next) {
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