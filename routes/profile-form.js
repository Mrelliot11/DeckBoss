var express = require('express');
var router = express.Router();
require('dotenv').config();
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
  const query = `UPDATE users SET nickname = '${nickname}', about_me = '${aboutMe}', other_media = '${otherMedia}', pokemon_tag = '${pokemonTag}', profile_pic = '${profilePic}' WHERE username = '${username}'`;

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

  res.render('profile',{username: username, nickname: nickName, aboutme: bioProfile, othermedia: otherSocialMedia, pokemontag: pokemonTag, profilepic: pfpSelect});
});

module.exports = router;