const Joi = require("joi");

module.exports.getNewAccessTokenValidation = (data) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports.createUserValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(25).required(),
  });
  return schema.validate(data);
};

module.exports.loginUserValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports.updateUserValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(15),
    email: Joi.string().email(),
    password: Joi.string().min(6).max(25),
  });
  return schema.validate(data);
};

module.exports.createTaskValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().max(140).required(),
    date: Joi.date(),
    categories: Joi.array().max(10),
  });
  return schema.validate(data);
};

module.exports.updateTaskValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().max(140),
    date: Joi.date(),
    completed: Joi.bool(),
    categories: Joi.array().max(10),
  });
  return schema.validate(data);
};

module.exports.createCategoryValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().max(25).required(),
  });
  return schema.validate(data);
};

module.exports.updateCategoryValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().max(25).required(),
  });
  return schema.validate(data);
};

module.exports.createCommentValidation = (data) => {
  const schema = Joi.object({
    text: Joi.string().max(280).required(),
  });
  return schema.validate(data);
};

module.exports.updateCommentValidation = (data) => {
  const schema = Joi.object({
    text: Joi.string().max(280).required(),
  });
  return schema.validate(data);
};
