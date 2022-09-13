const Card = require('../models/cards');
const BadReqError = require('../errors/bad_req_error');
const NotFoundError = require('../errors/not_found_error');
const NoAuthError = require('../errors/no_auth_error');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (e) {
    next(e);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    res.send(card);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const err = new BadReqError('Переданы некорректные данные при создании карточки');
      next(err);
    } else {
      next(e);
    }
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      throw new NotFoundError('Карточка по указанному _id не найдена.');
    } if (card.owner.toString() !== owner) {
      throw new NoAuthError('У Вас нет прав на удаление карточки.');
    }
    await Card.findByIdAndRemove(req.params.cardId);
    res.send({ message: 'Карточка удалена.' });
  } catch (e) {
    if (e.name === 'CastError') {
      const err = new BadReqError('Переданы некорректные _id карточки.');
      next(err);
    } else {
      next(e);
    }
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      res.send(card);
    } else {
      throw new NotFoundError('Передан несуществующий _id карточки.');
    }
  } catch (e) {
    if (e.name === 'CastError') {
      const err = new BadReqError('Передан некорректный _id карточки.');
      next(err);
    } else {
      next(e);
    }
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      res.send(card);
    } else {
      throw new NotFoundError('Передан несуществующий _id карточки.');
    }
  } catch (e) {
    if (e.name === 'CastError') {
      const err = new BadReqError('Передан некорректный _id карточки.');
      next(err);
    } else {
      next(e);
    }
  }
};
