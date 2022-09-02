const Card = require("../models/cards");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send(cards))
    .catch(err =>
      res.status(500).send({ message: `Произошла ошибка: ${err}` })
    );
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then(card => res.send(card))
    .catch(err => {
      if (err.name === "CastError") {
        res.status(400).send({
          message: "Переданы некорректные данные при создании карточки"
        });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err}` });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => {
      if (card) {
        res.send(card);
      } else {
        res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
    })
    .catch(err => {
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.likeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
      .then(card => {
        if (card) {
          res.send(card);
        } else {
          res
            .status(404)
            .send({ message: "Передан несуществующий _id карточки." });
        }
      })
      .catch(err => {
        if (err.name === "CastError") {
          res.status(400).send({
            message: "Переданы некорректные данные при обновлении профиля"
          });
        } else {
          res.status(500).send({ message: `Произошла ошибка: ${err}` });
        }
      })
  );

module.exports.dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
    .then(card => {
      if (card) {
        res.send(card);
      } else {
        res
          .status(404)
          .send({ message: "Передан несуществующий _id карточки." });
      }
    })
    .catch(err => {
      if (err.name === "CastError") {
        res
          .status(400)
          .send({
            message: "Переданы некорректные данные при обновлении профиля"
          });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err}` });
      }
    })
  );
