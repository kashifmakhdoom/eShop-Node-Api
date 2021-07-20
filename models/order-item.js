const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    }
});

function validateOrderItem(orderItem) {
    const schema = {
      quantity: Joi.number().required(),
      product: Joi.objectId().required()
    };
  
    return Joi.validate(order, schema);
}

exports.OrderItem = mongoose.model('orderItems', orderItemSchema);
exports.validateOrderItem = validateOrderItem;

