var express = require('express');
var router = express.Router();
require('dotenv').config();

router.get('/', function (req, res, next) {
  res.render('admin', {
    name: req.session.username
  });
});

module.exports = router;