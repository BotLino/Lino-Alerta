var chai = require("chai");
var assert = require("chai").assert;
var chaiHttp = require("chai-http");
var expect = require("chai").expect;
var AlertController = require("../api/controllers/alertController");

chai.use(chaiHttp);

var TOKEN_PATH = require("../resources/token.js");
var CREDENTIALS_PATH = require("../resources/credentials.js");

console.log = function() {};

describe("Alert Controller", () => {
  it("should return a JSON credentials file", () => {
    console.log = function() {};
    var credentials = AlertController.readCredentials(CREDENTIALS_PATH);
    assert.exists(credentials);
    delete console.log;
  });
  it("should return a JSON token file", function() {
    var token = AlertController.readToken(TOKEN_PATH);
    assert.exists(token);
  });
  it("should return an authorized Oauth2Client object", async () => {
    var credentials = await AlertController.readCredentials(CREDENTIALS_PATH);
    await console.log("**************************************************" + credentials)
    var token = await AlertController.readToken(TOKEN_PATH);
    await console.log("**************************************************" + token)
    var oAuth2Client = await AlertController.authorize(credentials, token);
    await assert.exists(oAuth2Client);
  });
  it("should return last email id from inbox", async () => {
    var credentials = await AlertController.readCredentials(CREDENTIALS_PATH);
    var token = await AlertController.readToken(TOKEN_PATH);
    var oAuth2Client = await AlertController.authorize(credentials, token);
    var lastEmailId = await AlertController.getRecentEmailId(oAuth2Client);
    expect(lastEmailId).to.exist;
  });
  it("should return a full JSON with last email", async () => {
    var credentials = await AlertController.readCredentials(CREDENTIALS_PATH);
    var token = await AlertController.readToken(TOKEN_PATH);
    var oAuth2Client = await AlertController.authorize(credentials, token);
    var lastEmailId = await AlertController.getRecentEmailId(oAuth2Client);
    var lastEmail = await AlertController.getRecentEmailData(
      lastEmailId,
      oAuth2Client
    );
    await assert.exists(lastEmail);
  });
  it("should return a custom JSON with last email", async () => {
    var credentials = await AlertController.readCredentials(CREDENTIALS_PATH);
    var token = await AlertController.readToken(TOKEN_PATH);
    var oAuth2Client = await AlertController.authorize(credentials, token);
    var lastEmailId = await AlertController.getRecentEmailId(oAuth2Client);
    var lastEmail = await AlertController.getRecentEmailData(
      lastEmailId,
      oAuth2Client
    );
    var parsedEmail = await AlertController.parseEmail(lastEmail);
    await assert.exists(parsedEmail);
  });
  it("should return a error message when trying to read credentials file", done => {
    var wrongPath = "./unexists_path";
    try {
      AlertController.readCredentials(wrongPath);
    } catch (e) {
      delete console.log;
      done(e);
    }
    done();
  });
  it("should return a error message when trying to read token file", done => {
    var wrongPath = "./unexists_path";
    try {
      AlertController.readToken(wrongPath);
    } catch (e) {
      done(e);
    }
    done();
  });
  it("should return a error message when trying to authorize user", done => {
    var wrongPath = "./unexists_path";
    try {
      AlertController.authorize(wrongPath, wrongPath);
    } catch (e) {
      done(e);
    }
    done();
  });
  it("should return a error message when trying to get recent email id", done => {
    var wrongPath = "./unexists_path";
    try {
      AlertController.getRecentEmailId(wrongPath);
    } catch (e) {
      done(e);
    }
    done();
  });
  it("should return a error message when trying to get recent email data", done => {
    var wrongPath = "";
    try {
      AlertController.getRecentEmailData(wrongPath);
    } catch (e) {
      done(e);
    }
    done();
  });
  it("should return a error message when trying to read a new message ", done => {
    var wrongPath = "";
    try {
      AlertController.readMessage(wrongPath);
    } catch (e) {
      done(e);
    }
    done();
  });
  it("should return a error message when trying to get a new Email", done => {
    var wrongPath = "";
    try {
      AlertController.callGetRecentEmailId(wrongPath);
    } catch (e) {
      done(e);
    }
    done();
  });
  // it("should return a error message when trying to get a new Token", done => {
  //   var wrongPath = "";
  //   try {
  //     AlertController.getNewToken(wrongPath);
  //   } catch (e) {
  //     done();
  //   }
  // });
});
