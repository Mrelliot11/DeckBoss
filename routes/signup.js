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


// Render the login page
router.get('/', function(req, res, next) {
  res.render('signup');
});


//function to insert users into database
async function insertUser(username, email, hash, salt, iterations) {
  
  const query = `INSERT INTO users (username, email, hash, salt, iterations) VALUES ('${username}', '${email}', '${hash}', '${salt}', ${iterations})`;

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




router.post('/', function(req, res, next) {
  //get username, email, and password from form
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.password_confirmation;
  const email = req.body.email;
  //Creates 32 byte salt in hexadecimal
  const salt = crypto.randomBytes(32).toString('hex');
  const iterations = 10000;
  //Hashes password with salt and iterations
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
  try {
    //Check if username already exists
    const user = getUser(username);
    user.then(result => {
      if (result.rows[0] == undefined) { //if username doesn't exist
        if (password === confirmPassword) { //check if passwords match
        
        //insert user into database
        insertUser(username, email, hash, salt, iterations);
        //redirect to login page
        res.redirect('/login');
        } else { //if passwords don't match
          res.render('signup', {error: 'Passwords do not match'});
        }
      } else { //if username already exists
        console.log("Found user: ", result.rows[0]);
        res.render('signup', {error: 'Username already exists'});
      }

    })


  } catch (error) {
    console.log(error);
  }


});


module.exports = router;