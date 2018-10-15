"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

let AlertSchema = new Schema({
  idEmail: {
    type: String,
    unique: true,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Alert", AlertSchema);
