var express = require('express');
var router = express.Router();
var pokemon = require('pokemontcgsdk');

var cardName = '';
var imgUrl = '';
var cardPrice = 0;

pokemon.card.find('base1-4')
.then(card => {
  //console.log(card); // testing to see returned json object
  cardName = card.name;
  imgUrl = card.images.small;
  cardPrice = card.cardmarket.prices.averageSellPrice;
  });

router.get('/', function(req, res, next) {
  res.render('card-info', { title: 'Deckboss', name: req.body.username , card: cardName, cardImg: imgUrl, price: cardPrice});
});

module.exports = router;