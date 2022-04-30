var express = require('express');
var router = express.Router();
require('dotenv').config();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "DeckBoss", name: req.session.username });
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
}
);



module.exports = router;
