const express = require('express');

// routers
const productRouter = require('../routes/productRouter');
const orderRouter = require('../routes/orderRouter');
const categoryRouter = require('../routes/categoryRouter');
const userRouter = require('../routes/userRouter');

module.exports = function (app, apiUrl) {
  app.use(express.json());
  // routes
  app.use(`${apiUrl}/products`, productRouter);
  app.use(`${apiUrl}/orders`, orderRouter);
  app.use(`${apiUrl}/categories`, categoryRouter);
  app.use(`${apiUrl}/users`, userRouter);
}