var express = require('express');
var router = express.Router();
require('dotenv').config();

/* GET profile form page */
router.get('/', function(req, res, next) {
  res.render('profile-form', {name: req.session.username, email: req.session.email, error: ''});
});
router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
}
);



module.exports = router;

