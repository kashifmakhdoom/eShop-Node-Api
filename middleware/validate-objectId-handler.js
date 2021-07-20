const mongoose = require('mongoose');

module.exports = function(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).json({status: false, message: "Please provide valid object id"});
  
  next();
}