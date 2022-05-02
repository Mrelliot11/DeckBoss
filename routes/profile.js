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


async function checkUserData(username){
  const query = `SELECT * FROM users WHERE username = '${username}'`;

  return await client.query(query);
}

router.get('/', function (req, res, next) {
  checkUserData(req.session.username).then(function (result){
    if (result.rows.length > 0) {
      //Get user data
      const userName = req.session.username;
      const nickName = result.rows[0].nickname;
      const aboutMe = result.rows[0].about_me;
      const otherMedia = result.rows[0].other_media;
      const pokemonTag = result.rows[0].pokemon_tag;
      const profilePic = result.rows[0].profile_pic;

      console.log(userName, nickName, aboutMe, otherMedia, pokemonTag, profilePic);

      res.render('profile', {username: userName, nickname: nickName, aboutme: aboutMe, othermedia: otherMedia, pokemontag: pokemonTag, profilepic: profilePic});
    }
  });
});

module.exports = router;