const dotenv = require('dotenv');

dotenv.load();

const express = require('express');

const app = express();
const port = 5014;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { URI } = process.env;

const result = require('dotenv').config({ silent: true });

if (result.error) {
  if (result.error.code === 'ENOENT') {
    console.info('expected this error because we are in production without a .env file');
  } else {
    throw result.error;
  }
}

mongoose.Promise = global.Promise;

mongoose.connect(
  URI,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
  },
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routes = require('./api/routes/routes');
// importing route
routes(app); // register the route

app.listen(port);

console.log(`Server started on: ${port}`);
