const express = require('express');

const users = express.Router();
const {
  createUser,
  getUsers,
  getUsersById,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

users.post('/', express.json(), createUser);
users.get('/', express.json(), getUsers);
users.get('/:userId', express.json(), getUsersById);
users.patch('/me', express.json(), updateUserInfo);
users.patch('/me/avatar', express.json(), updateAvatar);

module.exports = users;
