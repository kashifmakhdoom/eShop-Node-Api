const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orderItems',
        required:true
    }],
    shippingAddress: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'Pending',
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    dateOrdered: {
        type: Date,
        default: Date.now,
    },
})

/*
orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});
*/

function validateOrder(order) {
    const schema = {
      orderItems: Joi.array().required(),
      shippingAddress: Joi.string().required(),
      city: Joi.string().required(),
      country: Joi.string().required(),
      zip: Joi.string().required(),
      phone: Joi.number().required(),
      status: Joi.string().optional(),
      user: Joi.objectId().required()
    };
  
    return Joi.validate(order, schema);
}

exports.Order = mongoose.model('orders', orderSchema);
exports.validateOrder = validateOrder;

/**
Order Example:

{
    "orderItems" : [
        {
            "quantity": 3,
            "product" : "5fcfc406ae79b0a6a90d2585"
        },
        {
            "quantity": 2,
            "product" : "5fd293c7d3abe7295b1403c4"
        }
    ],
    "shippingAddress1" : "Flowers Street , 45",
    "shippingAddress2" : "1-B",
    "city": "Prague",
    "zip": "00000",
    "country": "Czech Republic",
    "phone": "+420702241333",
    "user": "5fd51bc7e39ba856244a3b44"
}

 */