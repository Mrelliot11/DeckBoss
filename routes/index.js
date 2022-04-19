var express = require('express');
var router = express.Router();
require('dotenv').config();

const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

const client = new Client({
  user: process.env.DB_USER,
  connectionString: connectionString,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
})
client.connect()
client.query('SELECT * FROM users', (err, res) => {
  console.log(err, res);
})

// Postgres query to get all the data from the database

const getAllData = 'SELECT * FROM users';
let cardName = '';

client.query(getAllData, (err, result) => {
  if (err) {
    console.log(err);
  } else {
    console.log(result.rows[0]);
    cardName = result.rows[0]['name'];
  }
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "DeckBoss", name: 'Elliot', card: cardName });
});

/* post to card info page */ 
router.post('/', function(req, res, next) {
  console.log(req.body);
  res.redirect('/card-info');
});

module.exports = router;
