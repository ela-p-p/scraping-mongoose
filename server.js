var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");
var db = require("./models");

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

var PORT = 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapingMongoose";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.get("/scrape", function (req, res) {
    request("https://www.bbc.com/news/technology/", function (error, response, html) {
        var $ = cheerio.load(html);
        var results = [];
        $("div.column--primary").each(function (i, element) {

            var heading = $(element).find("h3").text().split(",")
            var summary = $(element).find("p").map(function (x, el) {
                return $(this).text()
            }).get()
            var url = $(element).find("a").attr("href")

            results.push({
                heading: heading,
                summary: summary,
                url: url
            });
            console.log(results)
            // Create a new Article using the `result` object built from scraping
            db.Article.insertMany(results)
                .then(function (dbArticle) {
                    res.json(dbArticle);
                })
                .catch(function (err) {
                    return res.json(err);
                });

        });

    });
});



app.get("/article", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// // Route for grabbing a specific Article by id, populate it with it's note
// app.get("/article/:id", function (req, res) {
//     // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//     db.Article.findOne({ _id: req.params.id })
//         // ..and populate all of the notes associated with it
//         .populate("commetn")
//         .then(function (dbArticle) {
//             // If we were able to successfully find an Article with the given id, send it back to the client
//             res.json(dbArticle);
//         })
//         .catch(function (err) {
//             // If an error occurred, send it to the client
//             res.json(err);
//         });
// });

// // Route for saving/updating an Article's associated Note
// app.post("/article/:id", function (req, res) {
//     // Create a new note and pass the req.body to the entry
//     db.Note.create(req.body)
//         .then(function (dbCommetn) {
//             // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//             // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//             // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//             return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbComment._id }, { new: true });
//         })
//         .then(function (dbArticle) {
//             // If we were able to successfully update an Article, send it back to the client
//             res.json(dbArticle);
//         })
//         .catch(function (err) {
//             // If an error occurred, send it to the client
//             res.json(err);
//         });
// });

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
