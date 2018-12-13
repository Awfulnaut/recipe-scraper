var db = require('../models');

module.exports = function (app, cheerio, axios) {
    
  // A GET route for scraping the echoJS website
  // TODO figure out how to deal with duplicate scraped data
  app.get("/scrape", function(req, res) {
    axios.get("https://www.delish.com/cooking/recipe-ideas/").then(function(response) {
      var $ = cheerio.load(response.data);

      $(".full-item").each(function(i, element) {
        var result = {};

        // Add the text, href, and descruption to the result object
        result.title = $(this)
          .find("a.full-item-title.item-title")
          .text()
          .trim();
        result.link = $(this)
          .find("a.full-item-title.item-title")
          .attr("href");
        result.description = $(this)
          .find(".full-item-dek p")
          .text()
          .trim();
        // TODO fix occasional repeated bylines
        result.byline = $(this)
          .find(".byline-name")
          .text()
          .trim();

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            console.log(err);
          });
      });

      res.json("Scrape Complete");
    });
  });

  // Get all Articles from the db
  app.get("/articles", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // Get a specific Article by id and populate it with its note
  app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  //TODO Delete route
}