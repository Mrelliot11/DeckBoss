var express = require('express');
var router = express.Router();
require('dotenv').config();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "DeckBoss", name: req.query.username });
});


module.exports = router;
