"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

let AlertSchema = new Schema({
  date: {
    type: String
  },
  from: {
    type: String
  },
  subject: {
    type: String
  },
  message: {
    type: String
  }
});

module.exports = mongoose.model("Alert", AlertSchema);
