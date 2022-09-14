const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { validateUserId } = require('../validation/validation');

const users = express.Router();
const {
  getUsers,
  getMe,
  getUsersById,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

// eslint-disable-next-line no-useless-escape
const validateUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?#?$/;

users.get('/', express.json(), getUsers);

users.get('/me', express.json(), getMe);

users.get('/:userId', validateUserId, getUsersById);

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
      avatar: Joi.string().min(2).pattern(validateUrl),
    }),
  }),
  updateAvatar,
);

module.exports = users;
