"use strict";
var dotenv = require("dotenv");
dotenv.load();
const fs = require("mz/fs");
const { google } = require("googleapis");
global.atob = require("atob");
var htmlToText = require("html-to-text");
var AlertModel = require("../models/alertModel");
var CREDENTIALS_PATH = require("../../resources/credentials.js");
var TOKEN_PATH = require("../../resources/token.js");

function readCredentials(path) {
  try {
    return (path);
  } catch (e) {
    return console.log(e);
  }
}

function readToken(path) {
  try {
    return (path);
  } catch (e) {
    return console.log(e);
  }
}

function authorize(credentials, token) {
  try {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
  } catch (e) {
    return console.log(e);
  }
}

function getRecentEmailId(auth) {
  const gmail = google.gmail({ version: "v1", auth });
  return new Promise((resolve, reject) => {
    gmail.users.messages.list(
      { auth: auth, userId: "me", maxResults: 1 },
      (err, response) => {
        if (err) {
          console.log("The API returned an error: " + err);
          return reject(err);
        }
        resolve(response["data"]["messages"][0]["id"]);
        // console.log(response["data"]["messages"][0]["id"]);
      }
    );
  });
}

function getRecentEmailData(message_id, auth) {
  const gmail = google.gmail({ version: "v1", auth });

  return new Promise((resolve, reject) => {
    gmail.users.messages.get(
      { auth: auth, userId: "me", id: message_id, format: "full" },
      (err, response) => {
        if (err) {
          console.log("The API returned an error: " + err);
          return reject(err);
        }
        if (!response.data) {
          return reject("no data");
        }
        resolve(response);
        // parseEmail(response);
      }
    );
  });
}

async function readMessage(auth) {
  try {
    const emailId = await getRecentEmailId(auth);
    // console.log("emailId: ", emailId);
    const alert = await getRecentEmailData(emailId, auth);
    // console.log("ALERT AWAIT: ------", alert);
    return await alert;
  } catch (e) {
    console.error(e);
  }
}

function parseEmail(response) {
  var extractField = function(json, fieldName) {
    return response["data"].payload.headers.filter(function(header) {
      return header.name === fieldName;
    })[0].value;
  };

  var date = extractField(response, "Date");
  var from = extractField(response, "From");
  var regExp = /<(.*?)>/;
  var matches = regExp.exec(from);
  var email = matches[1];

  var subject = extractField(response, "Subject");

  var parts = [response.data.payload];

  while (parts.length) {
    var part = parts.shift();
    if (part.parts) {
      parts = parts.concat(part.parts);
    }

    if (part.mimeType === "text/html") {
      var decodedPart = decodeURIComponent(
        escape(atob(part.body.data.replace(/\-/g, "+").replace(/\_/g, "/")))
      );
      var message = htmlToText.fromString(decodedPart, {
        wordwrap: 130
      });

      var alert = new AlertModel({
        idEmail: response["data"]["id"],
        date: date,
        email: email,
        subject: subject,
        message: message
      });
      return alert;
    }
  }
}

async function callGetRecentEmailId() {
  try {
    var credentials = readCredentials(CREDENTIALS_PATH);
    var token = readToken(TOKEN_PATH);
    var auth = authorize(credentials, token);
    const alert = await readMessage(auth);
    const result = await parseEmail(alert);
    await console.log(result);
    return await result;
  } catch (e) {
    console.log(e);
  }
}

callGetRecentEmailId();

module.exports = {
  readToken: readToken,
  callGetRecentEmailId: callGetRecentEmailId,
  readCredentials: readCredentials,
  parseEmail: parseEmail,
  readMessage: readMessage,
  getRecentEmailData: getRecentEmailData,
  getRecentEmailId: getRecentEmailId,
  authorize: authorize,
  readCredentials: readCredentials
};
