var db = require('../models');

module.exports = function (app, cheerio, axios) {
  app.get("/", function (req, res) {
    res.render("index");
  });
}