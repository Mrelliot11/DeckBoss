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
async function checkIfAdmin(username) {
  const query = `SELECT * FROM adminUsers WHERE username = '${username}'`;

  return await client.query(query);
}

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
}
);

//Render the login page
router.get('/', function(req, res, next) {
  res.render('login', {error: ''});
});

  router.post('/', function(req, res, next) {
    //get username, email, and password from form
  var username = req.body.username;
  var password = req.body.password;
  
  
  //Check if the user is an admin
  checkIfAdmin(username).then(function(result) {
    if (result.rows.length > 0) {
      const hash = result.rows[0].hash;
      const salt = result.rows[0].salt;
      const iterations = result.rows[0].iterations;
      const hashPassword = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');

      var bufferHash1 = Buffer.from(hashPassword, 'hex');
      var bufferHash2 = Buffer.from(hash, 'hex');

      //Check if the password is correct
      if (crypto.timingSafeEqual(bufferHash1, bufferHash2)) {
        req.session.username = username;

        res.redirect('/admin'); } //If the password is correct, redirect to the admin page
      else {
        res.render('login', {error: 'Incorrect username or password'});
      }

      //If the user is an admin, redirect to the admin page
    } else {
      //If the user is not an admin, check if the user exists
      getUser(username).then(function(result) {
        if (result.rows.length > 0) {
          //If the user exists, check if the password is correct
          const hash = result.rows[0].hash;
          const salt = result.rows[0].salt;
          const iterations = result.rows[0].iterations;
          const hashPassword = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');

          var bufferHash1 = Buffer.from(hashPassword, 'hex');
          var bufferHash2 = Buffer.from(hash, 'hex');


          if (crypto.timingSafeEqual(bufferHash1, bufferHash2)) {
            //If the password is correct, set the session variables
            req.session.username = username;
            req.session.email = result.rows[0].email;
            res.redirect('/profile');
          } else {
            //If the password is incorrect, redirect to the login page with an error
            res.render('login', {error: 'Incorrect Username or Password'});
          }
        } else {
          //If the user doesn't exist, redirect to the login page with an error
          res.render('login', {error: 'Incorrect Username or Password'});
        }
      }
      );
    }
  }
  );
  });

module.exports = router;