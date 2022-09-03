const Card = require("../models/cards");
const { ERROR_BAD_REQ, ERROR_NOT_FOUND, ERROR_SERVER } = require("../utils/constants");

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    res.status(ERROR_SERVER).send({ message: `Произошла ошибка: ${err}` });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({  name, link, owner });
    res.send(card);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(ERROR_BAD_REQ).send({
        message: "Переданы некорректные данные при создании карточки"
      });
    } else {
      res.status(ERROR_SERVER).send({ message: `Произошла ошибка: ${err}` });
    }
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (card) {
      res.send({ message: "Карточка удалена" });
    } else {
      res
        .status(ERROR_NOT_FOUND)
        .send({ message: "Карточка по указанному _id не найдена." });
    }
  } catch (err) {
    if (err.name === "CastError") {
      res.status(ERROR_BAD_REQ).send({
        message: "Переданы некорректные данные при создании карточки."
      });
    } else {
      res.status(ERROR_SERVER).send({ message: `Произошла ошибка: ${err}` });
    }
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (card) {
      res.send(card);
    } else {
      res
        .status(ERROR_NOT_FOUND)
        .send({ message: "Передан несуществующий _id карточки." });
    }
  } catch (err) {
    if (err.name === "CastError") {
      res.status(ERROR_BAD_REQ).send({
        message: "Передан некорректный _id карточки"
      });
    } else {
      res.status(ERROR_SERVER).send({ message: `Произошла ошибка: ${err}` });
    }
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (card) {
      res.send(card);
    } else {
      res
        .status(ERROR_NOT_FOUND)
        .send({ message: "Передан несуществующий _id карточки." });
    }
  } catch (err) {
    if (err.name === "CastError") {
      res.status(ERROR_BAD_REQ).send({
        message: "Передан некорректный _id карточки"
      });
    } else {
      res.status(ERROR_SERVER).send({ message: `Произошла ошибка: ${err}` });
    }
  }
};
