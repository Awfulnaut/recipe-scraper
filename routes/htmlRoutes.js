var db = require('../models');

module.exports = function (app, cheerio, axios) {
  app.get("/", function (req, res) {
    db.Article.find({}).then(function(allArticles) {
      // res.send(allArticles)
      var articles = {
        articles: allArticles
      }
      res.render("index", articles);
    })
  });
}