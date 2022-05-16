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


async function checkUserData(username){
  const query = `SELECT * FROM users WHERE username = '${username}'`;

  return await client.query(query);
}

async function checkCollection(username){
  const query = `SELECT * FROM collections WHERE username = '${username}'`;

  return await client.query(query);
}

function removeCard(username, cardID, cardName, cardUrl, cardImage) {
  console.log("Removing card: " + cardID);
  console.log(username, cardID, cardName, cardUrl, cardImage);
  console.log(`UPDATE collections SET cards = array_remove(cards, '${cardID}') urls = array_remove(urls, '${cardUrl}') card_image = array_remove(card_image, '${cardImage}') card_name = array_remove(card_name, '${cardName}') WHERE username = '${username}'`);
  var query = `UPDATE collections SET cards = array_remove(cards, '${cardID}'), urls = array_remove(urls, '${cardUrl}'), card_image = array_remove(card_image, '${cardImage}'), card_name = array_remove(card_name, '${cardName}') WHERE username = '${username}'`;

  client.query(query).then(function () {
    console.log("Card removed");
  }
  ).catch(function (err) {
    console.log(err);
  }
  );
  

}

router.post('/remove', function(req, res, next) {
  var username = req.session.username;
  var cardID = req.body.card_id;
  var cardName = req.body.card_name;
  var card_url = req.body.urls;
  var card_image = req.body.card_image;
  removeCard(username, cardID, cardName, card_url, card_image);
  res.redirect('/profile');
  });



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

      //Get user collection
      checkCollection(req.session.username).then(function (result){
        if (result.rows.length > 0) {

        req.session.card_id = result.rows[0].cards;
        req.session.urls = result.rows[0].urls;
        req.session.card_name = result.rows[0].card_name;
        req.session.card_image = result.rows[0].card_image;


        res.render('profile', {
          title: 'DeckBoss',
          name: req.session.username,
          username: userName, 
          nickname: nickName,
          aboutme: aboutMe,
          othermedia: otherMedia,
          pokemontag: pokemonTag,
          profilepic: profilePic,
          card_id:  req.session.card_id,
          urls: req.session.urls,
          card_name: req.session.card_name,
          card_image: req.session.card_image
        });
      } else {
        res.render('profile', {
          title: 'DeckBoss',
          name: req.session.username,
          username: userName, 
          nickname: nickName,
          aboutme: aboutMe,
          othermedia: otherMedia,
          pokemontag: pokemonTag,
          profilepic: profilePic,
          card_id:  [],
          urls: [],
          card_name: [],
          card_image: []
        });
      }
      }).catch(function (err){
        console.log(err);
      }
      );
    }
  });
});

module.exports = router;