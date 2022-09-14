const { ObjectId } = require('mongoose').Types;
const { celebrate, Joi } = require('celebrate');

const validateAnyId = (valua, helpes) => {
  if (!ObjectId.isValid(valua)) {
    return helpes.error('any.invalid');
  }
  return valua;
};

module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().string().required().custom(validateAnyId),
  }),
});
