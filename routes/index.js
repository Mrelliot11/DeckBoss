var express = require('express');
var router = express.Router();
require('dotenv').config();

const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "DeckBoss", name: 'Elliot'});
});


module.exports = router;
