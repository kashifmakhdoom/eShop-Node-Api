const mongoose = require('mongoose');

module.exports = function(dbUrl) {
  mongoose.connect(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: true })
  .then(() => {
    console.log(`Connected to the database: ${dbUrl}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
}