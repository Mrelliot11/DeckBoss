var express = require('express');
var router = express.Router();
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

//Render the login page
router.get('/', function(req, res, next) {
  res.render('login', {error: ''});
});


module.exports = router;