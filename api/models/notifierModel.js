var mongoose = require("mongoose");
var Schema = mongoose.Schema;

let NotifierSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String
  }
});

module.exports = mongoose.model("Notifier", NotifierSchema);
