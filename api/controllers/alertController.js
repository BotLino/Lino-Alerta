"use strict";
const fs = require("mz/fs");
const readline = require("readline");
const { google } = require("googleapis");
global.atob = require("atob");
var htmlToText = require("html-to-text");
var AlertModel = require("../models/alertModel");

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
const TOKEN_PATH = "./api/resources/token.json";
const CREDENTIALS_PATH = "./api/resources/credentials.json";

function readCredentials(path) {
  try {
    var content = fs.readFileSync(path, err => {
      if (err) return console.log("Error loading client secret file:", err);
    });
    return JSON.parse(content);
  } catch (e) {
    return console.log(e);
  }
}

function readToken() {
  try {
    var token = fs.readFileSync(TOKEN_PATH, err => {
      if (err) return getNewToken(oAuth2Client);
    });
    return JSON.parse(token);
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

function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("Enter the code from that page here: ", code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
    });
  });
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

        if (!response.data) {
          return reject("no data");
        }

        if (!response.data.messages && !response.data.messages.length) {
          return reject("no messages");
        }
        resolve(response["data"]["messages"][0]["id"]);
        // console.log(response["data"]["messages"][0]["id"]);
      }
    );
  });
}

function getRecentEmail(message_id, auth) {
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
    const alert = await getRecentEmail(emailId, auth);
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
    var path = "./api/resources/credentials.json";
    var credentials = readCredentials(path);
    var token = readToken();
    var auth = authorize(credentials, token);
    const alert = await readMessage(auth);
    const result = await parseEmail(alert);
    // await console.log(result);
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
  getRecentEmail: getRecentEmail,
  getRecentEmailId: getRecentEmailId,
  getNewToken: getNewToken,
  authorize: authorize,
  readCredentials: readCredentials
};
