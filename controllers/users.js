const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const BadReqError = require('../errors/bad_req_error');
const NotFoundError = require('../errors/not_found_error');
const EmailError = require('../errors/email_error');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        const err = new BadReqError('Передан некорректный _id');
        next(err);
      } else {
        next(e);
      }
    });
};

const getUsersById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        const err = new BadReqError('Передан некорректный _id');
        next(err);
      } else {
        next(e);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash, name, about, avatar,
      })
        .then((user) => {
          const userInfo = user.toObject();
          delete userInfo.password;
          res.send(userInfo);
        })
        .catch((e) => {
          if (e.code === 11000) {
            const err = new EmailError('Пользователь с таким email уже зарегистрирован');
            next(err);
            return;
          }
          if (e.name === 'ValidationError') {
            const err = new BadReqError('Переданы некорректные данные при создании профиля');
            next(err);
          } else {
            next(e);
          }
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'SECRET',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .send({ token });
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь с указанным _id не найден')();
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        const err = new BadReqError('Переданы некорректные данные при обновлении пользователя');
        next(err);
        return;
      }
      if (e.name === 'CastError') {
        const err = new BadReqError('Передан некорректный _id пользователя');
        next(err);
      } else {
        next(e);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError(`${req.user._id}Пользователь с указанным _id не найден`);
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        const err = new BadReqError('Переданы некорректные данные. Введите ссылку на изображение');
        next(err);
        return;
      }
      if (e.name === 'CastError') {
        const err = new BadReqError('Переданы некорректные данные при обновлении аватара');
        next(err);
      } else {
        next(e);
      }
    });
};

module.exports = {
  getUsers,
  getMe,
  createUser,
  login,
  getUsersById,
  updateUserInfo,
  updateAvatar,
};
