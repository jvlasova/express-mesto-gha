const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { validateCardId } = require('../validation/validation');
const { validateUrl } = require('../validation/validation');

const cards = express.Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cards.get('/', express.json(), getCards);

cards.post(
  '/',
  express.json(),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(validateUrl),
    }),
  }),
  createCard,
);

cards.delete('/:cardId', express.json(), validateCardId, deleteCard);

cards.put('/:cardId/likes', express.json(), validateCardId, likeCard);

cards.delete('/:cardId/likes', express.json(), validateCardId, dislikeCard);

module.exports = cards;
