var db = require('../models');

module.exports = function (app, cheerio, axios) {
    
  // A GET route for scraping the echoJS website
  app.get("/scrape", function(req, res) {
    axios.get("http://www.allrecipes.com/").then(function(response) {
      var $ = cheerio.load(response.data);

      $(".fixed-recipe-card").each(function(i, element) {
        var result = {};

        // Add the text, href, and descruption to the result object
        result.title = $(this)
          .find(".fixed-recipe-card__h3")
          .text()
          .trim()
        result.link = $(this)
          .find(".fixed-recipe-card__info > a")
          .attr("href")
        result.description = $(this)
          .find(".fixed-recipe-card__description")
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
        console.log(result)
      });

      // Send a message to the client
      res.json("Scrape Complete");
      location.reload();
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
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated Article -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
}