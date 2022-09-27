const httpStatus = require("http-status");
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");

const { weatherService } = require("../services");

const createWeather = catchAsync(async (req, res) => {
  const weather = await weatherService.createWeather(req.body);
  res.status(httpStatus.CREATED).send(weather);
});

const getAllWeather = catchAsync(async (req, res) => {
  const result = await weatherService.getAllWeather();
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Weather not found");
  }
  res.send(result);
});

const getWeatherByDate = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["date"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await weatherService.queryWeather(filter, options);
  res.send(result);
});

const getWeatherByLocation = catchAsync(async (req, res) => {
  let filter = pick(req.query, ["country", "city"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);

  if (filter.country && filter.city) {
    filter = {
      $and: [
        { "location.country": filter.country?.trim() },
        { "location.city": filter.city?.trim() },
      ],
    };
  } else {
    filter = {
      $or: [
        { "location.country": filter.country?.trim() },
        { "location.city": filter.city?.trim() },
      ],
    };
  }

  const result = await weatherService.queryWeather(filter, options);
  res.send(result);
});

const getWeatherByDateAndLocation = catchAsync(async (req, res) => {
  let filter = pick(req.query, ["date", "country", "city"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);

  if (filter.date) {
    if (filter.country && filter.city) {
      filter = {
        $and: [
          { "current.dt": filter.date },
          { "location.country": filter.country?.trim() },
          { "location.city": filter.city?.trim() },
        ],
      };
    } else {
      filter = {
        $or: [
          { "current.dt": filter.date },
          { "location.country": filter.country?.trim() },
          { "location.city": filter.city?.trim() },
        ],
      };
    }
  } else {
    if (filter.country && filter.city) {
      filter = {
        $and: [
          { "location.country": filter.country?.trim() },
          { "location.city": filter.city?.trim() },
        ],
      };
    } else {
      filter = {
        $or: [
          { "location.country": filter.country?.trim() },
          { "location.city": filter.city?.trim() },
        ],
      };
    }
  }

  const result = await weatherService.queryWeather(filter, options);
  res.send(result);
});

const removeAllWeather = catchAsync(async (req, res) => {
  await weatherService.deleteAllWeather();
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createWeather,
  getAllWeather,
  getWeatherByDate,
  getWeatherByLocation,
  getWeatherByDateAndLocation,
  removeAllWeather,
};
