const catcher = require('../middleware/error-handler');

module.exports = function(app) {
  process.on('uncaughtException', (ex) => {
    logger.error({message: ex.message, level: ex.level, stack: ex.stack, meta: ex});
    process.exit(1);
  });
  
  process.on('unhandledException', (ex) => {
    logger.error({message: ex.message, level: ex.level, stack: ex.stack, meta: ex});
    process.exit(1);
  });

  // catcher
  app.use(catcher);
}
