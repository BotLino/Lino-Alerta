var express = require("express"),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require("mongoose"),
  Alert = require("./api/models/alertModel"), //created model loading here
  bodyParser = require("body-parser");

const server = "ds261332.mlab.com:61332";
const database = "lino_database";
const user = "linobot";
const password = "bggil-lino2018";

console.log(
  `mongodb://${user}:${password}@${server}/${database}?authMechanism=MONGODB-CR`
);

// mongoose instance connection url connection
mongoose.Promise = global.Promise;

mongoose.connect(
  `mongodb://${user}:${password}@${server}/${database}`,
  { useNewUrlParser: true }
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// var routes = require("./api/routes/todoListRoutes"); //importing route
// routes(app); //register the route

app.listen(port);

console.log("Server started on: " + port);
