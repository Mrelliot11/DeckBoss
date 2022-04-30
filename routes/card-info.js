var express = require('express');
var router = express.Router();
var pokemon = require('pokemontcgsdk');

var cardName = '';
var imgUrl = '';
var cardPrices = {};
var setName = {};

//Finding card data from the API
pokemon.card.find('base1-4')
  .then(card => {
    //console.log(card); // testing to see returned json object
    cardName = card.name;
    setName = card.set.name;
    imgUrl = card.images.small;
    cardPrices = card.cardmarket.prices;
    console.log(cardPrices);
  });

router.get('/', function (req, res, next) {
  res.render('card-info', {
    title: 'DeckBoss',
    name: req.session.username,
    card: cardName,
    cardImg: imgUrl,
    prices: cardPrices,
    set: setName
  });
});

module.exports = router;