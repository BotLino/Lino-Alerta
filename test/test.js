var chai = require("chai");
var assert = require("chai").assert;
var chaiHttp = require("chai-http");
var should = chai.should();
var AlertController = require("../api/controllers/alertController");

chai.use(chaiHttp);

describe("Blobs", function() {
  it("should return a JSON credentials file", function() {
    var credentials = AlertController.readCredentials();
    console.log(credentials);
    assert.exists(credentials);
  });
  it("should return a JSON token file", function() {
    var token = AlertController.readToken();
    console.log(token);

    assert.exists(token);
  });
  it("should return an authorized Oauth2Client object", async function() {
    var credentials = await AlertController.readCredentials();
    var token = await AlertController.readToken();
    var oAuth2Client = await AlertController.authorize(credentials, token);
    await assert.exists(oAuth2Client);
  });
});
