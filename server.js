var dotenv = require("dotenv");
dotenv.load();

var express = require("express"),
  app = express(),
  port = process.env.PORT,
  mongoose = require("mongoose"),
  Alert = require("./api/models/alertModel"), //created model loading here
  bodyParser = require("body-parser");

const server = process.env.DBSERVER;
const database = process.env.DB;
const user = process.env.DBUSER;
const password = process.env.DBPASSWORD;

const { error } = dotenv.config();
if (error) {
  throw error;
}
// mongodb://<dbuser>:<dbpassword>@ds041831.mlab.com:41831/api-alertas
console.log(user);
console.log(database);

// mongoose instance connection url connection
mongoose.Promise = global.Promise;

mongoose.connect(
  `mongodb://${user}:${password}@${server}/${database}?authSource=${database}&w=1`,
  { useNewUrlParser: true }
);

var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require("./api/routes/alertRoutes"); //importing route
routes(app); //register the route

app.listen(port);

console.log("Server started on: " + port);
