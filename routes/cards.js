const express = require('express');

const cards = express.Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cards.post('/', express.json(), createCard);
cards.get('/', express.json(), getCards);
cards.delete('/:cardId', express.json(), deleteCard);
cards.put('/:cardId/likes', express.json(), likeCard);
cards.delete('/:cardId/likes', express.json(), dislikeCard);

module.exports = cards;
