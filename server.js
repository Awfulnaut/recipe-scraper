var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = 4000;
var app = express();
var exphbs = require("express-handlebars");

// Configure middleware
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/recipe_scraper_db";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.set('debug', true);

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Start the server
app.listen(process.env.PORT || PORT, function() {
  console.log("App running on port " + PORT + "!");
});

// Routes
require('./routes/apiRoutes')(app, cheerio, axios);
require('./routes/htmlRoutes')(app, cheerio, axios);

module.exports = app;