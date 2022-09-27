const express = require("express");
const weatherRoute = require("./weather.route");
const config = require("../../config/config");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/weather",
    route: weatherRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
