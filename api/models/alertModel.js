"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var AlertModel = new Schema({
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

module.exports = mongoose.model("Alert", AlertModel);
