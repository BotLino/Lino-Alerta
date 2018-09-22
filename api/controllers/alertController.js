const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
global.atob = require("atob");
var htmlToText = require("html-to-text");

/*
* Estamos pegando apenas a utima mensagem. Porem, ele só é disparado uma vez.
* TODO:Utilizar o Express <- Icaro
* TODO: Criar um objeto "FilteredEmail" (criar uma modelzinha)
* TODO: Retornar esse objeto na requisição
* TODO: Criar ou utilizar algum metodo da API que faça um "push notification" 
*/

// - chegou uma msg!! toma aqui os ids!!
// - vou pegar  o id e pesquisar no meu metodo getMessage para saber qual é a mensagem

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
const TOKEN_PATH = "./api/resources/token.json";

// Load client secrets from a local file.
fs.readFile("./api/resources/credentials.json", (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  // Authorize a client with credentials, then call the Gmail API.
  authorize(JSON.parse(content), getRecentEmail);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
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
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
  const gmail = google.gmail({ version: "v1", auth });
  gmail.users.labels.list(
    {
      userId: "me"
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const labels = res.data.labels;
      if (labels.length) {
        console.log("Labels:");
        labels.forEach(label => {
          console.log(`- ${label.name}`);
        });
      } else {
        console.log("No labels found.");
      }
    }
  );
}
/**
 * Get the recent email from your Gmail account
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

function getRecentEmail(auth) {
  // Only get the recent email - 'maxResults' parameter
  const gmail = google.gmail({ version: "v1", auth });
  gmail.users.messages.list(
    { auth: auth, userId: "me", maxResults: 1 },
    function(err, response) {
      if (err) {
        console.log("The API returned an error: " + err);
        return;
      }

      // Get the message id which we will need to retreive tha actual message next.
      var message_id = response["data"]["messages"][0]["id"];
      //console.log(message_id);
      // Retreive the actual message using the message id
      gmail.users.messages.get(
        { auth: auth, userId: "me", id: message_id, format: "full" },
        function(err, response) {
          if (err) {
            console.log("The API returned an error: " + err);
            return;
          }
          // console.log(response.data.payload);

          var parts = [response.data.payload];

          while (parts.length) {
            var part = parts.shift();
            if (part.parts) {
              parts = parts.concat(part.parts);
            }

            if (part.mimeType === "text/html") {
              var decodedPart = decodeURIComponent(
                escape(
                  atob(part.body.data.replace(/\-/g, "+").replace(/\_/g, "/"))
                )
              );

              var text = htmlToText.fromString(decodedPart, {
                wordwrap: 130
              });
              console.log(text);

              // console.log(decodedPart);
            }
          }

          // var extractField = function(json, fieldName) {
          //   return response["data"].payload.headers.filter(function(header) {

          //     return header.name === fieldName;
          //   })[0].value;
          // };
          // var date = extractField(response, "Date");
          // var from = extractField(response, "From");
          // var subject = extractField(response, "Subject");

          // console.log(date);
          // console.log(from);
          // console.log(subject);
        }
      );
    }
  );
}
