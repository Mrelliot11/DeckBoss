var collection = require('./collection.js');

var express = require('express');
var router = express.Router();
require('dotenv').config();
const {
  Client
} = require('pg');
var pokemon = require('pokemontcgsdk');

pokemon.configure({
  api_key: process.env.API_KEY
});

// variables
const user = {};

var userName;
var nickName;
var aboutMe;
var otherMedia;
var pokemonTag;
var profilePic;
var userCollection = [];
var value;
var collectionId;

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

// TODO display collection on profile page --> this will happen on the profile.ejs

function getCardInfo(arr) {
  var cards = [];

  for (let i = 0; i < arr.length; i++) {
    pokemon.card.find(arr[i])
    .then(card => {
      cards.push(card);
    });
  }

  return cards;
}


router.get('/', function (req, res, next) {
  checkUserData(req.session.username).then(function (result){
    if (result.rows.length > 0) {
      //Get user data
      userName = req.session.username;
      nickName = result.rows[0].nickname;
      aboutMe = result.rows[0].about_me;
      otherMedia = result.rows[0].other_media;
      pokemonTag = result.rows[0].pokemon_tag;
      profilePic = result.rows[0].profile_pic;
      collectionId = result.rows[0].collection_id;

      console.log(userName, nickName, aboutMe, otherMedia, pokemonTag, profilePic, collectionId);

    }
  });

  collection.checkCollectionData(req.session.username).then(function(result){
    if (result.rows.length > 0) {
      let collArr = result.rows[0].cards;
      console.log('Collection found: ' + collArr);

      let userCollection = collection.getCardInfo(collArr);
      console.log('userCollection: ' + userCollection);

    } else {
      collection.createCollection(req.session.username);
      console.log('No collection found');
    }
  });

  res.render('profile', {
    username: userName, 
    nickname: nickName, 
    aboutme: aboutMe, 
    othermedia: otherMedia, 
    pokemontag: pokemonTag, 
    profilepic: profilePic, 
    collection: userCollection});
});

module.exports = router;