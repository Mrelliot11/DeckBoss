var express = require('express');
var router = express.Router();
var crypto = require('crypto');
require('dotenv').config();
const { Client } = require('pg');
//Needed so we can connect to the heroku database
const connectionString = process.env.DATABASE_URL;

const client = new Client({
  user: process.env.DB_USER,
  connectionString: connectionString,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
})
client.connect(); //Connect to the database

async function getUser(username) {
  const query = `SELECT * FROM users WHERE username = '${username}'`;

  return await client.query(query);
}

//Render the login page
router.get('/', function(req, res, next) {
  res.render('login', {error: ''});
});

router.post('/', function(req, res, next) {

  var username = req.body.username;
  var password = req.body.password;

  getUser(username).then(function(result) {
    if (result.rows.length > 0) {
      var user = result.rows[0];
      var hash = user.hash;
      var salt = user.salt;
      var iterations = user.iterations;
      var hash2 = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
      if (hash === hash2) {
        res.redirect('/?username=' + username);
      } else {
        res.render('login', {error: 'Incorrect username or password'});
      }
    } else {
      res.render('login', {error: 'Incorrect username or password'});
    }
  });
});

module.exports = router;