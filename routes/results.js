var express = require('express');
var router = express.Router();
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
  var name = req.body.name;
  var image = req.body.image;
  var url = req.body.url;
  var value = parseFloat(req.body.value);

  console.log(typeof(value));

  var query = `UPDATE collections SET cards = array_append(cards, '${id}'), urls = array_append(urls, '${url}'), card_name = array_append(card_name, '${name}'), card_image = array_append(card_image, '${image}'), collection_value = array_append(collection_value, ${value}) WHERE username = '${req.session.username}'`;

  client.query(query).then(function () {
    res.redirect('/results');
  }
  ).catch(function (err) {
    console.log(err);
  }
  );


}
);

module.exports = router;