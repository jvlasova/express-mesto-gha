const express = require('express');
const { celebrate, Joi } = require('celebrate');

const users = express.Router();
const {
  getUsers,
  getMe,
  getUsersById,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

users.get('/', express.json(), getUsers);

users.get('/me', express.json(), getMe);

users.get(
  '/:userId',
  express.json(),
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().pattern(/[\da-f]{24}/),
    }),
  }),
  getUsersById,
);

users.patch(
  '/me',
  express.json(),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUserInfo,
);

users.patch(
  '/me/avatar',
  express.json(),
  celebrate({
    body: Joi.object().keys({
      // eslint-disable-next-line no-useless-escape
      avatar: Joi.string().min(2).pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?#?$/),
    }),
  }),
  updateAvatar,
);

module.exports = users;
