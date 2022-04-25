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
    //get username, email, and password from form
  var username = req.body.username;
  var password = req.body.password;

  getUser(username).then(function(result) {
    if (result.rows.length > 0) { //If the user exists
      var user = result.rows[0]; //Get the user from the database
      var hash = user.hash; //Get the hash from the database
      var salt = user.salt; //Get the salt from the database
      var iterations = user.iterations; //Get the iterations from the database
      var hash2 = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex'); //Hash the password with the salt and iterations
      var bufferhash1 = Buffer.from(hash, 'hex'); //Convert the first hash from hex to binary
      var bufferhash2 = Buffer.from(hash2, 'hex'); //Convert the second hash from hex to binary
      if (crypto.timingSafeEqual(bufferhash1, bufferhash2)) { //If the hashes match (using time safe comparison)
        res.redirect('/?username=' + username); //Redirect to the index page with the username
      } else { //If the hashes don't match
        res.render('login', {error: 'Incorrect username or password'}); //Render the login page with an error
      }
    } else { //If the user doesn't exist
      res.render('login', {error: 'Incorrect username or password'}); //Render the login page with an error
    }
  });
});

module.exports = router;