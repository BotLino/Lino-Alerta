var chai = require("chai");
var assert = require("chai").assert;
var chaiHttp = require("chai-http");
var should = chai.should();
var AlertController = require("../api/controllers/alertController");

chai.use(chaiHttp);

describe("Alert Controller", function() {
  it("should return a JSON credentials file", function() {
    var path = "./api/resources/credentials.json";
    var credentials = AlertController.readCredentials(path);
    assert.exists(credentials);
  });
  it("should return a JSON token file", function() {
    var token = AlertController.readToken();
    assert.exists(token);
  });
  it("should return an authorized Oauth2Client object", async function() {
    var path = "./api/resources/credentials.json";
    var credentials = await AlertController.readCredentials(path);
    var token = await AlertController.readToken();
    var oAuth2Client = await AlertController.authorize(credentials, token);
    await assert.exists(oAuth2Client);
  });
  it("should return last email id from inbox", async function() {
    var path = "./api/resources/credentials.json";
    var credentials = await AlertController.readCredentials(path);
    var token = await AlertController.readToken();
    var oAuth2Client = await AlertController.authorize(credentials, token);
    var lastEmailId = await AlertController.getRecentEmailId(oAuth2Client);
    await assert.exists(lastEmailId);
  });
  it("should return a full JSON with last email", async function() {
    var path = "./api/resources/credentials.json";
    var credentials = await AlertController.readCredentials(path);
    var token = await AlertController.readToken();
    var oAuth2Client = await AlertController.authorize(credentials, token);
    var lastEmailId = await AlertController.getRecentEmailId(oAuth2Client);
    var lastEmail = await AlertController.getRecentEmail(
      lastEmailId,
      oAuth2Client
    );
    await assert.exists(lastEmail);
  });
  it("should return a custom JSON with last email", async function() {
    var path = "./api/resources/credentials.json";
    var credentials = await AlertController.readCredentials(path);
    var token = await AlertController.readToken();
    var oAuth2Client = await AlertController.authorize(credentials, token);
    var lastEmailId = await AlertController.getRecentEmailId(oAuth2Client);
    var lastEmail = await AlertController.getRecentEmail(
      lastEmailId,
      oAuth2Client
    );
    var parsedEmail = await AlertController.parseEmail(lastEmail);
    await assert.exists(parsedEmail);
  });
  it("should return a error message when trying to read credentials file", function() {
    var wrongPath = "./unexists_path";
    var credentials = AlertController.readCredentials(wrongPath);
    assert.exists(credentials);
  });
});
