// configuration
require('dotenv/config');

// environment
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV;
const apiUrl = process.env.API_BASE_URL;
const dbUrl = process.env.LOCAL_MONGODB_URI;
const secretKey = process.env.SECRET_KEY;

module.exports = {
  port,
  environment,
  apiUrl,
  dbUrl,
  secretKey
}
