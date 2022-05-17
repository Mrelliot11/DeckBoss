var express = require('express');
var router = express.Router();
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


async function deleteUser(userName) {
  const query = `DELETE FROM users WHERE username = '${userName}';`;

  return await client.query(query);
}

async function banUser(userName) {
  const query = `UPDATE users SET created_at = '1973-01-01 01:01:01+00:00' WHERE username = '${userName}';`;

  return await client.query(query);
}

async function checkForUser(userName) {
  const query = `SELECT * FROM users WHERE username = '${userName}';`;

  return await client.query(query);
}

router.get('/', function (req, res, next) {

  displayUserCount().then(result => {
    req.session.usercount = result.rows.length;
    res.render('admin', {
      title: 'Admin',
      message: '',
      name: req.session.username,
      userCount: req.session.usercount,
      users: result.rows
    });
  });
});


router.post('/delete', function (req, res, next) {
  //User ID
  const deleteInput = req.body.deleteInput;

  if (deleteInput != '') {
    checkForUser(deleteInput).then(result => {
      if (result.rows.length > 0) {


        deleteUser(deleteInput).then(function () {
          displayUserCount().then(result => {
            req.session.usercount = result.rows.length;
            res.render('admin', {
              name: req.session.username,
              userCount: req.session.usercount,
              message: `User ${deleteInput} has been deleted`,
              users: result.rows
            })
          });
        });
      } else {
        displayUserCount().then(result => {
          req.session.usercount = result.rows.length;
          res.render('admin', {
            name: req.session.username,
            userCount: req.session.usercount,
            message: `User ${deleteInput} does not exist`,
            users: result.rows
          })
        });
      }
    });
  } else {
    res.render('admin', {
      name: req.session.username,
      userCount: req.session.usercount,
      message: `Please enter a username`,
      users: result.rows
    });
  }
})

router.post('/ban', function (req, res, next) {

  const banInput = req.body.banInput;

  if (banInput != '') {
    checkForUser(banInput).then(result => {
      if (result.rows.length > 0) {

        banUser(banInput).then(function () {
          displayUserCount().then(result => {
            req.session.usercount = result.rows.length;
            res.render('admin', {
              name: req.session.username,
              userCount: req.session.usercount,
              message: `User ${banInput} has been banned`,
              users: result.rows
            })
          });
        });
      } else {
        displayUserCount().then(result => {
          req.session.usercount = result.rows.length;
          res.render('admin', {
            name: req.session.username,
            userCount: req.session.usercount,
            message: `User ${banInput} does not exist`,
            users: result.rows
          });
        });
      }
    });
  }


});

module.exports = router;