const mongoose = require('mongoose');

const { Schema } = mongoose;

const NotifierSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model('Notifier', NotifierSchema);
