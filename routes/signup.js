var express = require('express');
var router = express.Router();
require('dotenv').config();
var crypto = require('crypto');
var mysql = require('mysql');
const {
  Client
} = require('pg');
var nodemailer = require('nodemailer');

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
router.get('/', function (req, res, next) {
  res.render('signup', {
    error: ''
  });
});



//function to insert users into database
async function insertUser(username, email, hash, salt, iterations) {

  const query = `INSERT INTO users (username, email, hash, salt, iterations) VALUES (` + mysql.escape(username) + `, ` + mysql.escape(email) + `, ` + mysql.escape(hash) + `, ` + mysql.escape(salt) + `, ` + mysql.escape(iterations) + `);`;

  try {
    const result = await client.query(query);
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }

}

async function createCollection(username) {
  const query = `INSERT INTO collections (username) VALUES (` + mysql.escape(username) + `);`;

  return await client.query(query);

}

//function to get user from database if it exists
async function getUser(username) {
  const query = "SELECT * FROM users WHERE username = " + mysql.escape(username);

  return await client.query(query);
}

// Post request to create a new user
router.post('/', function (req, res, next) {

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
    if (username != '' && password != '' && confirmPassword != '' && email != '') {
      //Check if username already exists
      const user = getUser(username);
      user.then(result => {
        if (result.rows[0] == undefined) { //if username doesn't exist
          if (password === confirmPassword) { //check if passwords match

            //insert user into database
            insertUser(username, email, hash, salt, iterations);

            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
              user: 'deckboss06@gmail.com',
              pass: process.env.EMAILPASSWORD
              }
            });
            
            const mailOptions = {
              from: 'DeckBoss',
              to: email,
              subject: 'Thank you for registering with DeckBoss!',
              text: "Welcome to DeckBoss! We hope you enjoy using our service. If you have any questions, please contact us at deckboss06@gmail.com."
              };

            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });

            createCollection(username);
            //Set session variables
            req.session.username = username;
            req.session.admin = false;
            req.session.email = email;
            //Redirect to profile page
            res.redirect('/profile-form');
          } else { //if passwords don't match
            res.render('signup', {
              error: 'Passwords do not match'
            });
          }
        } else { //if username already exists
          res.render('signup', {
            error: 'Username already exists'
          });
        }

      })
    } else {
      res.render('signup', {
        error: 'Please fill out all fields'
      });
    }

  } catch (error) {
    console.log(error);
  }


});


module.exports = router;