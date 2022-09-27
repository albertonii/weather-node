const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
// const logger = require('../config/logger');

const tempEnum = Object.freeze({
  kelvin: 0,
  celsius: 1,
  fahrenheit: 2,
});

const currentSchema = mongoose.Schema(
  {
    dt: { type: Date, default: null },
    sunrise: { type: Date, default: null },
    sunset: { type: Date, default: null },
    temp: { type: String, default: tempEnum.kelvin },
  },
  { _id: false }
);

const weatherSchema = mongoose.Schema({
  lat: { type: String, required: false },
  lon: { type: String, required: false },
  location: { city: { type: String }, country: { type: String } },
  current: currentSchema,
  hourly_temperature: [
    {
      type: Number,
      required: true,
      validate: {
        validator: function () {
          return !(this.hourly_temperature.length > 24);
        },
        message: (props) => `${props.value} exceeds maximum array size {24}`,
      },
    },
  ],
});

// add plugin that converts mongoose to json
weatherSchema.plugin(toJSON);
weatherSchema.plugin(paginate);

/**
 * @typedef Weather
 */
const Weather = mongoose.model("Weather", weatherSchema);

module.exports = Weather;
