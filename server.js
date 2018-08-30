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
        $("a.title-link").each(function (i, element) {

            var heading = $(element).children("h3").text().trim();
            var summary = $(element).next("p").text();
            var url = "https://www.bbc.com" + $(element).attr("href");

            results.push({
                heading: heading,
                summary: summary,
                url: url
            });
            console.log(results)
   
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
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});


app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
