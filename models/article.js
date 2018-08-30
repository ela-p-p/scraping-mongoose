var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  heading: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  url: {
    type: String,
    required: true
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});


var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
