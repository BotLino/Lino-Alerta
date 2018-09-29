var mongoose = require("mongoose");
var Schema = mongoose.Schema;

let NotifierSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true
  }
});

module.exports = mongoose.model("Notifier", NotifierSchema);
