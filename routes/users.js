const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { validateUserId } = require('../validation/validation');
const { validateUrl } = require('../validation/validation');

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

users.get('/:userId', express.json(), validateUserId, getUsersById);

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
