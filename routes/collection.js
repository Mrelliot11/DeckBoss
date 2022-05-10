const {
  Client
} = require('pg');
var pokemon = require('pokemontcgsdk');

// db connection
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


// TODO create a collection
module.exports.createCollection = async function (username) {
  const query = `INSERT INTO collections (username, cards, collection_value, total_cards) 
    VALUES (${username}, '{}', 0, 0)`;

    return await client.query(query);
}

// TODO get current value of the collection
module.exports.valueCollection = function (coll) {
  let value = 0;

  coll.forEach(cardId => {
    pokemon.card.find(cardId).then(card => {
      value += card.cardmarket.prices.avg1;
    });
  });

  return value;
}

// TODO update the collection
module.exports.updateCollection = async function (collId, coll){
  let totalCards = coll.length;
  let collValue = valueCollection(coll);

  const query = `INSERT INTO collections (cards, collection_value, total_cards) 
  VALUES ('${coll}', ${collValue}, ${totalCards})
  WHERE collection_id = '${collId}'`;

  return await client.query(query);
}

// TODO pull user collection from database
module.exports.checkCollectionData = async function (username) {
  const query = `SELECT * FROM collections WHERE username = '${username}'`;

  return await client.query(query);
}


module.exports.getCollection = function (collectionId) {

  // gets id numbers of cards in current user's collection as well as the value of their collection
  this.checkCollectionData(collectionId).then(function(result){
    let coll = [];

    if (result.rows.length > 0) {
      coll = result.rows[0].cards;
      let value = result.rows[0].value; //not sure how i'm going to return this at the moment

      console.log(coll);
    } else {
      createCollection(collectionId);
    }
  });

  return coll;
}


// TODO add card to collection and save to database
module.exports.addCards = function (coll, cardId) {
  pokemon.card.find(cardId).then(card => {
    coll.push(card.id);
  });

  updateCollection(collectionId, coll);
}

// TODO remove card from collection and save to database
module.exports.removeCard = function (coll, cardId) {
  for(let i = 0; i < coll.length; i++) {
    if (coll[i] === cardId) {
      coll.splice(i, 1);
    }
  }

  updateCollection(collectionId, coll);
}

// TODO push JSON data from API to passed collection for template
module.exports.getCardInfo = function (coll) {
  var cards = [];

  for (let i = 0; i < coll.length; i++) {
    pokemon.card.find(coll[i])
    .then(card => {
      console.log(card);
      
      // cardArr.push(card);
      cards.push(card);
      console.log('cards: ' + cards);
    });
  }

  console.log('cards: ' + cards);
  return cards;
}
