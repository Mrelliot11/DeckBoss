var express = require('express');
var router = express.Router();
var pokemon = require('pokemontcgsdk');
require('dotenv').config();
const {
  Client
} = require('pg');


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
  res.render('results', {
    error: '',
    name: req.session.username,
    results: req.session.data
  }
  );
}
);

router.post('/addToCollection', function (req, res, next) {
  var id = req.body.id;

  var query = `UPDATE collections SET cards = array_append(cards, '${id}') WHERE username = '${req.session.username}'`;

  client.query(query).then(function (result) {
    res.redirect('/results');
  }
  ).catch(function (err) {
    console.log(err);
  }
  );


}
);

module.exports = router;