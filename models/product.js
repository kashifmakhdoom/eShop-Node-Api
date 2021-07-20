const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  textDescription: {
    type: String,
    required: true,
    trim: true
  },
  richDescription : {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String
  },
  imageUrls: [
    {
      type: String
    }
  ],
  brand: {
    type: String,
    required: true,
    trim: true
  },
  category : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
    required: true
  },
  price :  {
    type: Number,
    required: true,
    min: 1,
    max: 1000,
    get: v => Math.round(v),
    set: v => Math.round(v)
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    max: 1000,
    set: v => Math.round(v)
  },
  rating :  {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews :  {
    type: Number,
    default: 0
  },
  isFeatured :  {
    type: Boolean,
    default: false
  },
  dateCreated :  {
    type: Date,
    default: Date.now
  }
})

// utility methods
productSchema.statics.lookupById = function(id) {
  return this.findOne({
    _id: id
  });
}

productSchema.statics.lookupByCategoryId = function(categoryId) {
  return this.findOne({
    categoryId: categoryId
  });
}

function validateProduct(product) {
  const schema = {
    name: Joi.string().required(),
    textDescription: Joi.string().required(),
    richDescription: Joi.string().optional(),
    brand: Joi.string().required(),
    price: Joi.number().required(),
    rating: Joi.number().required(),
    category: Joi.objectId().required(),
    stock: Joi.number().min(0).max(255).required(),
    imageUrl: Joi.string().optional(),
    imageUrls: Joi.array().optional(),
    isFeatured: Joi.boolean().optional()
  };

  return Joi.validate(product, schema);
}


exports.Product = mongoose.model('products', productSchema);
exports.validate = validateProduct;