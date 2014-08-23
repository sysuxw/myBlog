var crypto = require('crypto');
var userModel = require('../models/user');

exports.index = function (req, res) {
  res.render('index', { title: '主页' });
};