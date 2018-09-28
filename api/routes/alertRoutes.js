"use strict";
module.exports = function(app) {
  var alert = require("../controllers/alertController");

  app.get("/test", async (req, res, next) => {
    try {
      const newAlert = await alert.callGetRecentEmailId();
      res.json(newAlert);
    } catch (e) {
      next(e);
    }
  });
};
