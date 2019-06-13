const dotenv = require('dotenv');

dotenv.load();
// const fs = require('mz/fs');
const { google } = require('googleapis');
const atob = require('atob');
const htmlToText = require('html-to-text');
const AlertModel = require('../models/alertModel');
const CREDENTIALS_PATH = require('../../resources/credentials.js');
const TOKEN_PATH = require('../../resources/token.js');

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
    const { clientSecret, clientId, redirectUris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUris[0],
    );
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
  } catch (e) {
    return console.log(e);
  }
}

function getRecentEmailId(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
  return new Promise((resolve, reject) => {
    gmail.users.messages.list(
      { auth, userId: 'me', maxResults: 1 },
      (err, response) => {
        if (err) {
          console.log(`The API returned an error: ${err}`);
          return reject(err);
        }
        resolve(response.data.messages[0].id);
        return (console.log(response));
        // console.log(response["data"]["messages"][0]["id"]);
      },
    );
  });
}

function getRecentEmailData(messageId, auth) {
  const gmail = google.gmail({ version: 'v1', auth });

  return new Promise((resolve, reject) => {
    gmail.users.messages.get(
      {
        auth, userId: 'me', id: messageId, format: 'full',
      },
      (err, response) => {
        if (err) {
          console.log(`The API returned an error: ${err}`);
          return reject(err);
        }
        if (!response.data) {
          return reject(err);
        }
        resolve(response);
        return (console.log(response));
        // parseEmail(response);
      },
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
    return (console.error(e));
  }
}

function parseEmail(response) {
  const extractField = (json, fieldName) => (
    response.data.payload.headers.filter(header => header.name === fieldName)[0].value
  );

  const date = extractField(response, 'Date');
  const from = extractField(response, 'From');
  const regExp = /<(.*?)>/;
  const matches = regExp.exec(from);
  const email = matches[1];

  const subject = extractField(response, 'Subject');

  let parts = [response.data.payload];

  while (parts.length) {
    const part = parts.shift();
    if (part.parts) {
      parts = parts.concat(part.parts);
    }

    if (part.mimeType === 'text/html') {
      const decodedPart = decodeURIComponent(
        escape(atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'))),
      );
      const message = htmlToText.fromString(decodedPart, {
        wordwrap: 130,
      });

      const alert = new AlertModel({
        idEmail: response.data.id,
        date,
        email,
        subject,
        message,
      });
      return alert;
    }
  }
  return (console.log('alert'));
}

async function callGetRecentEmailId() {
  try {
    const credentials = readCredentials(CREDENTIALS_PATH);
    const token = readToken(TOKEN_PATH);
    const auth = authorize(credentials, token);
    const alert = await readMessage(auth);
    const result = await parseEmail(alert);
    await console.log(result);
    return await result;
  } catch (e) {
    return (console.log(e));
  }
}

callGetRecentEmailId();

module.exports = {
  readToken,
  callGetRecentEmailId,
  readCredentials,
  parseEmail,
  readMessage,
  getRecentEmailData,
  getRecentEmailId,
  authorize,
};
