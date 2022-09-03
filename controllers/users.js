const User = require("../models/users");
const { ERROR_BAD_REQ, ERROR_NOT_FOUND, ERROR_SERVER } = require("../utils/constants");

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err =>
      res.status(ERROR_SERVER).send({ message: `Произошла ошибка: ${err}` })
    );
};

const getUsersById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if (user) {
        res.send(user);
      } else {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
    })
    .catch(err => {
      if (err.name === "CastError") {
        res.status(ERROR_BAD_REQ).send({ message: "Передан некорректный _id" });
      } else {
        res.status(ERROR_SERVER).send({ message: `Произошла ошибка: ${err}` });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send(user))
    .catch(err => {
      if (err.name === "ValidationError") {
        res
          .status(ERROR_BAD_REQ)
          .send({
            message: "Переданы некорректные данные при обновлении профиля"
          });
      } else {
        res.status(ERROR_SERVER).send({ message: `Произошла ошибка: ${err}` });
      }
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true , runValidators: true}).orFail()
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: "Пользователь с указанным _id не найден" });
      }
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        res
          .status(ERROR_BAD_REQ)
          .send({
            message: "Переданы некорректные данные при обновлении профиля"
          });
      } else {
        res.status(ERROR_SERVER).send({ message: `Произошла ошибка: ${err}` });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then(user => {
      if (user) {
        res.send(user);
      } else {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: "Пользователь с указанным _id не найден" });
      }
    })
    .catch(err => {
      if (err.name === "CastError") {
        res
          .status(ERROR_BAD_REQ)
          .send({
            message: "Переданы некорректные данные при обновлении аватара"
          });
      } else {
        res.status(ERROR_SERVER).send({ message: `Произошла ошибка: ${err}` });
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUsersById,
  updateUserInfo,
  updateAvatar
};
