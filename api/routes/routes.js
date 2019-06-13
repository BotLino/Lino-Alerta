
module.exports = function routes(app) {
  const alert = require('../controllers/alertController');
  const NotifierModel = require('../models/notifierModel');
  const AlertModel = require('../models/alertModel');
  const NotifierController = require('../controllers/notifierController');

  app.get('/newAlert', async (req, res, next) => {
    try {
      let newAlert = new AlertModel();
      newAlert = await alert.callGetRecentEmailId();
      let result = '';
      let name = '';
      await NotifierModel.findOne({
        email: newAlert.email,
      })
        .then((doc) => {
          result = doc;
        })
        .catch((err) => {
          res.status(500).json(err);
        });
      try {
        if (result) {
          name = { result: name };
          newAlert.name = name;
          await newAlert
            .save()
            .then(async (doc) => {
              if (!doc || doc.length === 0) {
                return res.status(500).send(doc);
              }
              await console.log('New Message sent: \n', newAlert);
              await res.json(newAlert);
              res.status(200).send(doc);
              return (console.log(res.status(200).send(doc)));
            })
            .catch((err) => {
              res.status(404).json('No new messages found');
              return (console.log(err));
            });
        } else {
          res.status(401).json('Forbidden');
        }
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      next(e);
    }
  });

  app.post('/newUser', (req, res) => {
    if (!req.body) {
      return res.status(400).send('Request body is missing');
    }

    if (!req.body.email) {
      return res.status(400).send('Request body is missing');
    }

    console.log(req.body);

    const model = new NotifierModel(req.body);
    model
      .save()
      .then((doc) => {
        if (!doc || doc.length === 0) {
          return res.status(500).send(doc);
        }
        res.status(201).send(doc);
        return (console.log('error 201'));
      })
      .catch((err) => {
        res.status(500).json(err);
      });

    return (console.log(res));
  });

  app.get('/getUser', (req, res) => {
    if (!req.query.email) {
      return res.status(400).send('Missing URL parameter: email');
    }
    NotifierController.getUserByEmail(req.query.email, res);
    return (console.log(res));
  });
};
