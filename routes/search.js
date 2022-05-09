var express = require('express');
var router = express.Router();
var pokemon = require('pokemontcgsdk');
require('dotenv').config();
const {
  Client
} = require('pg');

pokemon.configure({
  api_key: process.env.API_KEY
});

const connectionString = process.env.DATABASE_URL;

const client = new Client({
  user: process.env.DB_USER,
  connectionString: connectionString,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
})
client.connect();

router.get('/', function (req, res, next) {
  res.render('search', {
    error: '',
  });
});

router.post('/', function (req, res, next) {
  var name = req.body.name;
  if (name === '') {
    res.render('search', {
      error: 'Please enter a name.'
    });
  } else {

    pokemon.card.where({
        q: 'name:' + name,
        pageSize: 10,
        page: 1
      })
      .then(function (data) {
        console.log(data);
        req.session.data = data;
        if (data.count === 0 || data.data === undefined) {
          res.render('search', {
            error: 'No cards found with that name.',
          });
        } else {

          res.redirect('results');
        }
      })
  }
});
module.exports = router;