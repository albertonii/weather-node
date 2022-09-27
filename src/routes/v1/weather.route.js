const express = require("express");
const validate = require("../../middlewares/validate");
const { weatherValidation } = require("../../validations");
const { weatherController } = require("../../controllers");

const router = express.Router();

router
  .get(
    "/",
    validate(weatherValidation.getAllWeather),
    weatherController.getAllWeather
  )
  .post(
    "/",
    validate(weatherValidation.createWeather),
    weatherController.createWeather
  )
  .delete(
    "/",
    validate(weatherValidation.removeAllWeather),
    weatherController.removeAllWeather
  );

router.get(
  "/:query",
  validate(weatherValidation.getWeatherByDateAndLocation),
  weatherController.getWeatherByDateAndLocation
);

// router
//   .route("/")
//   .get(
//     "allWeather",
//     validate(weatherValidation.getAllWeather),
//     weatherController.getAllWeather
//   )
//   .post(
//     "manageWeather",
//     validate(weatherValidation.createWeather),
//     weatherController.createWeather
//   )
//   .delete(
//     "deleteAllWeather",
//     validate(weatherValidation.removeAllWeather),
//     weatherController.removeAllWeather
//   );

// router
//   .route("/:data/:location")
//   .get(
//     auth("getWeatherByDateAndLocation"),
//     validate(weatherValidation.getWeatherByDateAndLocation),
//     weatherController.getWeatherByDateAndLocation
//   );

module.exports = router;
