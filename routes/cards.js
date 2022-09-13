const express = require('express');
const { celebrate, Joi } = require('celebrate');

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
      // eslint-disable-next-line no-useless-escape
      link: Joi.string().required().min(2).pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?#?$/),
    }),
  }),
  createCard,
);

cards.delete(
  '/:cardId',
  express.json(),
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().pattern(/[\da-f]{24}/),
    }),
  }),
  deleteCard,
);

cards.put(
  '/:cardId/likes',
  express.json(),
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().pattern(/[\da-f]{24}/),
    }),
  }),
  likeCard,
);

cards.delete(
  '/:cardId/likes',
  express.json(),
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().pattern(/[\da-f]{24}/),
    }),
  }),
  dislikeCard,
);

module.exports = cards;
