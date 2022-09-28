const Joi = require("joi");

const createWeather = {
  body: Joi.object().keys({
    current: {
      dt: Joi.date(),
      sunrise: Joi.date(),
      sunset: Joi.date(),
      temp: Joi.string(),
    },
    location: { city: Joi.string(), country: Joi.string() },
    daily: Joi.array().items(
      Joi.object().keys({
        day: Joi.date().required(),
        hourly_temperature: Joi.array().items(Joi.number().required()),
      })
    ),
  }),
};

const getAllWeather = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getWeatherByDate = {
  query: Joi.object().keys({
    date: Joi.date(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getWeatherByLocation = {
  query: Joi.object().keys({
    country: Joi.string(),
    city: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getWeatherByDateAndLocation = {
  query: Joi.object().keys({
    date: Joi.date(),
    city: Joi.string(),
    country: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const removeAllWeather = {};

module.exports = {
  createWeather,
  getAllWeather,
  getWeatherByDate,
  getWeatherByLocation,
  getWeatherByDateAndLocation,
  removeAllWeather,
};
