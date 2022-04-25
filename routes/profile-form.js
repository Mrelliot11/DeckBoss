var express = require('express');
var router = express.Router();
require('dotenv').config();

/* GET profile form page */
router.get('/', function(req, res, next) {
  res.render('profile-form');
});


module.exports = router;

