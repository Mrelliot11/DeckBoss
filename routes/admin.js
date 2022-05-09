var express = require('express');
var router = express.Router();
var crypto = require('crypto');
require('dotenv').config();
const {
  Client
} = require('pg');
//Heroku db connection string
const connectionString = process.env.DATABASE_URL;

const client = new Client({
  user: process.env.DB_USER,
  connectionString: connectionString,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
}) //Connect to the database
client.connect();

function displayUserCount() {
  const query = `SELECT * FROM users;`;

  return client.query(query);
}

function deleteUser(userName) {
  const query = `DELETE FROM users WHERE username = '${userName}';`;

  return client.query(query);
}

function banUser(userName) {
  const query = `UPDATE users SET created_at = '1973-01-01 01:01:01+00:00' WHERE username = '${userName}';`;

  return client.query(query);
}

router.get('/', function (req, res, next) {

  displayUserCount().then(function (result) {

  req.session.usercount = result.rows.length;

  res.render('admin', {
    name: req.session.username,
    userCount: req.session.usercount,
    message: ``
  });
});
});

router.post('/delete', function(req, res, next){
  //User ID
  const deleteInput = req.body.deleteInput;

  if (deleteInput != '') {
    deleteUser(deleteInput);
    res.render('admin', {
      name: req.session.username,
      userCount: req.session.usercount,
      message: `User ${deleteInput} has been deleted`
    } 
    );
  }
})

router.post('/ban', function(req, res, next) {

  const banInput = req.body.banInput;
  if (banInput != '') {
    if (banInput == NaN) {
      banUser(banInput);
      res.render('admin', {
        name: req.session.username,
        userCount: req.session.usercount,
        message: `User ${banInput} has been banned`
      })
    } else {
      const stringInput = banInput.toString();
      banUser(stringInput);
      res.render('admin', {
        name: req.session.username,
        userCount: req.session.usercount,
        message: `User ${stringInput} has been banned`
      } )
    }
  } else {
    res.render('admin', {
      name: req.session.username,
      userCount: req.session.usercount,
      message: `Please enter a user`
    } )
  }
})

module.exports = router;