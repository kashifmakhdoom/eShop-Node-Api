const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

const logConfig = {
  format: winston.format.json(),
  transports: [
      new winston.transports.Console({
          level: 'error'
      }),
      new winston.transports.File({
          level: 'error',
          filename: 'logs/errorLog.log'
      }),
      new winston.transports.MongoDB({
          db: process.env.LOCAL_MONGODB_URI,
          options: {useUnifiedTopology: true},
          collection:'logs',
          capped:true,
          metaKey:'meta'
      })
  ]
};
const logger = winston.createLogger(logConfig);

module.exports = function (err, req, res, next) {
  // winston: error, warn, info, verbose, debug, silly
  logger.error({message: err.message, level: err.level, stack: err.stack, meta: err});
  return res.status(500).json({message: err.message});

  /*
  if(err.name === 'UnauthorizedError') {
    
    return res.status(401).json({message: err.code})
  }
  else if(err.name === 'ValidationError') {
    return res.status(401).json({message: err.code})
  }
  else
    return res.status(500).json({message: err})
  */
}
