const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { requireAuth, requireAdmin } = require('../middleware/auth-handler');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-').substr(0, file.originalname.indexOf('.'));
    const extension = file.mimetype.substr(file.mimetype.indexOf('/') + 1);
    cb(null, fileName + '-' + Date.now() + '.' + extension);
  }
});
const uploadOptions = multer({storage: storage});

// model
const { Product, validate } = require('../models/product');
const { Category } = require('../models/category');

// object id validator
const validateObjectId = require("../middleware/validate-objectId-handler");

// GET: All objects
// ROUTE: /api/v1/products
// ACCESS: Public
router.get(`/`, async (req, res) => {
  //throw new Error('Could not get the product list');
  
  const productList = await Product.find();

  if(productList) 
    return res.status(200).send(productList);

  return res.status(500).json({status: false, message: 'Products can not be found!'})
});

// GET: Single object by id
// ROUTE: /api/v1/products/:id
// ACCESS: Public
router.get(`/:id`, validateObjectId, async (req, res) => {
  //if(!mongoose.isValidObjectId(id)) return res.status(400).json({status: false, message: "Please provide valid product id"})
  
  const product = await Product.findById(req.params.id);

  if(product) 
    return res.status(200).send(product);
  
  return  res.status(500).json({status: false, message: 'Product can not be found!'})
});

// PUT: Update a single object
// ROUTE: /api/v1/products/:id
// ACCESS: Private/Admin
router.put('/:id', [requireAuth, requireAdmin], validateObjectId, async (req, res) => {
  // validate object
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // validate category id for the product
  const category = await Category.findById(req.body.category)
  if(!category) return res.status(400).json({status: false, message: "Please provide valid cateogry id"})
  
  let product = await Product.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    textDescription: req.body.textDescription,
    richDescription: req.body.richDescription,
    brand: req.body.brand,
    category: req.body.category,
    price: req.body.price,
    stock: req.body.stock,
    rating: req.body.rating,
    reviews: req.body.reviews,
    imageUrl: req.body.imageUrl,
    imageUrls: req.body.imageUrls,
    isFeatured: req.body.isFeatured
  }, {new: true});

  if(product) {
    return res.status(200).send(product);
  } 
  
  return  res.status(500).json({status: false, message: 'Product can not be found!'})
})

// POST: Create a single object
// ROUTE: /api/v1/products
// ACCESS: Private/Admin
router.post(`/`, [requireAuth, requireAdmin], uploadOptions.single('imageUrl'), async (req, res) => { 
  // validate object
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  const fileName = req.file.filename;
  const uploadPath = `${req.protocol}://${req.get('host')}/public/uploads`;

  // validate category id for the product
  const category = await Category.findById(req.body.category)
  if(!category) return res.status(400).json({status: false, message: "Please provide valid cateogry id"})
  
  let product = new Product({
    name: req.body.name,
    textDescription: req.body.textDescription,
    richDescription: req.body.richDescription,
    brand: req.body.brand,
    category: req.body.category,
    price: req.body.price,
    stock: req.body.stock,
    rating: req.body.rating,
    reviews: req.body.reviews,
    imageUrl: `${uploadPath}/${fileName}`,
    imageUrls: req.body.imageUrls,
    isFeatured: req.body.isFeatured
  })

  product = await product.save();

  if(!product)
    return res.status(404).send('The product can not be created!');

  return res.status(201).json(product);
});

// DELETE: Single object by id
// ROUTE: /api/v1/products/:id
// ACCESS: Private/Admin
router.delete('/:id', [requireAuth, requireAdmin], validateObjectId, async (req, res) => {
  Product.findByIdAndRemove(req.params.id)
  .then(deletedProduct => {
    if(deletedProduct)
      return res.status(200).json({status: true, message: 'The product has been removed!'})
    else 
      return res.status(404).json({status: false, message: 'The product can not be removed!'})
  })
  .catch((err) => {
     res.status(500).json({
       error: err,
       status: false
     })
  }) 
});

// PUT: Update product gallery
// ROUTE: /api/v1/products/gallery/:id
// ACCESS: Private/Admin
router.put('/gallery/:id', [requireAuth, requireAdmin],
  validateObjectId, 
  uploadOptions.array('imageUrls', 10), 
  async (req, res) => {
  
  let imageUrls = [];
  const files = req.files;
  const uploadPath = `${req.protocol}://${req.get('host')}/public/uploads`;

  if(files) {
    file.map(file => {
      imageUrls.push(`${uploadPath}/${file.filename}`)
    })
  }

  let product = await Product.findByIdAndUpdate(req.params.id, {
    imageUrls: imageUrls
  }, {new: true});u

  if(product) {
    return res.status(200).send(product);
  } 
  
  return  res.status(500).json({status: false, message: 'Product can not be found!'})
})

// GET: Total product count
// ROUTE: /api/v1/products/get/count
// ACCESS: Public
router.get(`/get/count`, async (req, res) => {
  
  const productCount = await Product.countDocuments((count) => count);

  if(productCount) 
    return res.status(200).send({count: productCount});
  
  return  res.status(500).json({status: false, message: 'No products found yet!'})
  
});

// GET: Featured products
// ROUTE: /api/v1/products/get/featured
// ACCESS: Public
router.get(`/get/featured`, async (req, res) => {
  
  const products = await Product.find({isFeatured: true});

  if(products) 
    return res.status(200).send(products);
  
  return  res.status(500).json({status: false, message: 'No featured products found yet!'})
  
});

module.exports = router;