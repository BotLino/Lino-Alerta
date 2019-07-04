const dotenv = require('dotenv');

dotenv.load();

module.exports = {
  installed: {
    client_id: process.env.CLIENT_ID,
    project_id: process.env.PROJECT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uris: [process.env.REDIRECT_URIS_ZERO, process.env.REDIRECT_URIS_ONE],
  },
};
