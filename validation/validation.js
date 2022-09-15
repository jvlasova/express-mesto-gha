const { ObjectId } = require('mongoose').Types;
const { celebrate, Joi } = require('celebrate');

// eslint-disable-next-line no-useless-escape
module.exports.validateUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?#?$/;

const validateAnyId = (valua, helpes) => {
  if (!ObjectId.isValid(valua)) {
    return helpes.error('any.invalid');
  }
  return valua;
};

module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().custom(validateAnyId),
  }),
});

module.exports.validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(validateAnyId),
  }),
});
