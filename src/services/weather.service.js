const { Weather } = require("../models");
/**
 * Create new weather element
 * @param {Object} weatherBody
 * @returns {Promise<Weather>}
 */
const createWeather = async (weatherBody) => {
  return await Weather.create(weatherBody);
};

/**
 * Query for all weather
 * @returns {Promise<QueryResult>}
 */
const getAllWeather = async () => {
  const weather = await Weather.find();
  return weather;
};

/**
 * Query for all weather with filters
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWeather = async (filter, options) => {
  const weather = await Weather.paginate(filter, options);
  return weather;
};

/**
 * Remove all weather
 * @returns {void}
 */
const deleteAllWeather = async () => {
  await Weather.deleteMany({});
  return true;
};

module.exports = {
  getAllWeather,
  createWeather,
  queryWeather,
  deleteAllWeather,
};
