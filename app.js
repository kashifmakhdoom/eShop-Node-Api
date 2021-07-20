require('express-async-errors');
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const express = require('express');
const app = express();

const { port, apiUrl, dbUrl, environment } = require('./startup/config');
require('./startup/logging')(app);
require('./startup/routes')(app, apiUrl);
require('./startup/dbconnect')(dbUrl);

// middleware
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

if(environment === 'development')
  app.use(morgan('tiny'));
app.use('public/uploads', express.static(__dirname + '/public/uploads'));

const server = app.listen(port, () => {
  console.log(`Server is running at: http://localhost:${port}`);
})

module.exports = server;