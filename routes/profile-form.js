var express = require('express');
var router = express.Router();
require('dotenv').config();
var mysql = require('mysql');
const {
  Client
} = require('pg');
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

/* GET profile form page */
router.get('/', function (req, res, next) {
  res.render('profile-form', {
    name: req.session.username,
    email: req.session.email,
    error: '',
    message: ''
  });
});
router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
});

/* Update Profile*/
async function updateProfile(username, nickname, aboutMe, otherMedia, pokemonTag, profilePic) {
  aboutMe = aboutMe.replace(/'/, "''");


  const query = `UPDATE users SET nickname = ` + mysql.escape(nickname) + ',' +  ` about_me = '${aboutMe}', other_media = ` + mysql.escape(otherMedia) + "," + ` pokemon_tag = '${pokemonTag}', profile_pic = '${profilePic}' WHERE username = ` + mysql.escape(username);

  console.log(query);
  return await client.query(query);

}
async function checkCollection(username){
  const query = `SELECT * FROM collections WHERE username = '${username}'`;

  return await client.query(query);
}

router.post('/', function (req, res, next) {
  //Get variables from profile form
  var username = req.session.username;
  var nickName = req.body.nickName;
  var bioProfile = req.body.bioProfile;
  var otherSocialMedia = req.body.otherSocialMedia;
  var pokemonTag = req.body.pokemonTag;
  var pfpSelect = req.body.pfpSelect;

  updateProfile(username, nickName, bioProfile, otherSocialMedia, pokemonTag, pfpSelect);
  checkCollection(req.session.username).then(function (result){
    req.session.card_image = result.rows[0].card_image;
    req.session.urls = result.rows[0].urls;
    req.session.card_name = result.rows[0].card_name;
    if (result.rows[0].cards != null) {
      req.session.card_id = result.rows[0].cards;
    } else {
      req.session.card_id = [];
    }


    res.render('profile',{username: username, nickname: nickName, aboutme: bioProfile, othermedia: otherSocialMedia, pokemontag: pokemonTag, profilepic: pfpSelect, card_id: req.session.card_id, urls: req.session.urls, card_name: req.session.card_name, card_image: req.session.card_image, card_value: req.session.card_value});
  });
});

module.exports = router;