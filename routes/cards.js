const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { validateUserId } = require('../validation/validation');

const cards = express.Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// eslint-disable-next-line no-useless-escape
const validateUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?#?$/;

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

cards.delete(
  '/:cardId',
  express.json(),
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().pattern(validateUserId),
    }),
  }),
  deleteCard,
);

cards.put(
  '/:cardId/likes',
  express.json(),
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().pattern(validateUserId),
    }),
  }),
  likeCard,
);

cards.delete(
  '/:cardId/likes',
  express.json(),
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().pattern(validateUserId),
    }),
  }),
  dislikeCard,
);

module.exports = cards;
