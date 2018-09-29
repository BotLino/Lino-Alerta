"use strict";
module.exports = function(app) {
  var alert = require("../controllers/alertController");
  var notifierController = require("../controllers/notifierController");
  var NotifierModel = require("../models/notifierModel");
  var AlertModel = require("../models/alertModel");

  var email = "icarooliv@gmail.com";

  app.get("/test", async (req, res, next) => {
    try {
      var newAlert = new AlertModel();
      newAlert = await alert.callGetRecentEmailId();
      await console.log("newalert:------------", newAlert.from);
      res.json(newAlert);
    } catch (e) {
      next(e);
    }
  });

  app.post("/new", (req, res) => {
    if (!req.body) {
      return res.status(400).send("Request body is missing");
    }

    if (!req.body.email) {
      return res.status(400).send("Request body is missing");
    }

    // let user = {
    //   name: 'firstname lastname',
    //   email: 'email@gmail.com'
    // }
    console.log(req.body);
    let model = new NotifierModel(req.body);
    model
      .save()
      .then(doc => {
        if (!doc || doc.length === 0) {
          return res.status(500).send(doc);
        }
        res.status(201).send(doc);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

  app.get("/getUser", (req, res) => {
    if (!req.query.email) {
      return res.status(400).send("Missing URL parameter: email");
    }

    NotifierModel.findOne({
      email: req.query.email
    })
      .then(doc => {
        res.json(doc);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });
};
