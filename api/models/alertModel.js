"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var AlertSchema = new Schema({
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

var Alert = mongoose.model("Alert", AlertSchema);

module.exports = {
  Alert: Alert
};
