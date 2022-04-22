var express = require('express');
var router = express.Router();
require('dotenv').config();
var crypto = require('crypto');
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
client.connect();


//function to insert users into database
async function insertUser(username, hash, salt, iterations) {
  
  const query = `INSERT INTO users (username, hash, salt, iterations) VALUES ('${username}', '${hash}', '${salt}', ${iterations})`;

  try {
    const result = await client.query(query);
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }

}

//function to get user from database if it exists
function getUser(username) {
  const query = `SELECT * FROM users WHERE username = '${username}'`;

  return client.query(query);
}


function verifyPassword(username, password) {

  const query = `SELECT * FROM users WHERE username = '${username}'`;

  return hash;
}


router.get('/', function(req, res, next) {
  res.render('login', {error: ''});
});

router.post('/', function(req, res, next) { 
  const username = req.body.username;
  const password = req.body.password;
  //Creates 64 byte salt
  const salt = crypto.randomBytes(64).toString('hex');
  const iterations = 10000;
  //Hashes password with salt and iterations
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');

  try {
    insertUser(username, hash, salt, iterations);
    console.log(username, hash, salt, iterations);
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }


});

router.post('/verify', function(req, res, next) {
  const username = req.body.checkname;

  try {
    const user = getUser(username);
    user.then(result => {
      console.log("Found user: ", result.rows[0]);
    })
  } catch (error) {
    console.log(error);
  }
});


module.exports = router;