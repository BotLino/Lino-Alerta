var NotifierModel = require("../models/notifierModel");

async function getUserByEmail(email, res) {
  try {
    await NotifierModel.findOne({
      email: email
    })
      .then(doc => {
        console.log("DOC:", doc);
        res.json(doc);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  getUserByEmail: getUserByEmail
};
