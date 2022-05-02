var express = require('express');
var router = express.Router();
var pokemon = require('pokemontcgsdk');


let cardsToAdd = ['base1-4', 'neo1-1', 'dp6-3', 'ex1-1'];

var userCollection = [];

// add cards to userCollection
function addCards(arr) {
  for (let i = 0; i < arr.length; i++) {
    pokemon.card.find(arr[i])
    .then(card => {
      userCollection.push(card);
    });
  }
}

addCards(cardsToAdd);

router.get('/', function (req, res, next) {
  res.render('card-info', {
    title: 'DeckBoss',
    name: req.session.username,
    collection: userCollection
  });
});


module.exports = router;