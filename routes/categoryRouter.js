const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

// model
const { Category } = require('../models/category');

// GET: All categories
// ROUTE: /api/v1/categories
// ACCESS: Public
router.get(`/`, async (req, res) => {
  const categoryList = await Category.find();

  if(categoryList) 
    return res.status(200).send(categoryList);
  

  return res.status(500).json({status: false, message: 'Categories can not be found!'})
  
});

// GET: Single category by id
// ROUTE: /api/v1/categories
// ACCESS: Public
router.get(`/:id`, async (req, res) => {
  if(!mongoose.isValidObjectId(id)) return res.status(400).json({status: false, message: "Please provide valid category id"});

  const category= await Category.findById(req.param.id);

  if(category) {
    return res.status(200).send(category);
  } 
  
  return  res.status(500).json({status: false, message: 'Category can not be found!'})
  
});

router.put('/:id', async (req, res) => {
  if(!mongoose.isValidObjectId(id)) return res.status(400).json({status: false, message: "Please provide valid category id"});

  const category = await Category.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color
  }, {new: true});

  if(category) {
    return res.status(200).send(category);
  } 
  
  return  res.status(500).json({status: false, message: 'Category can not be found!'})

});

// POST: Create a new category
// ROUTE: /api/v1/categories
// ACCESS: Private
router.post(`/`, async (req, res) => {  
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color
  });

  category = await category.save();

  if(!category)
    return res.status(404).send('The category can not be created!');

  return res.status(201).json(category);
    
});

// DELETE
router.delete('/:id', async (req, res) => {
  if(!mongoose.isValidObjectId(id)) return res.status(400).json({status: false, message: "Please provide valid category id"});

  Category.findByIdAndRemove(req.params.id)
  .then(deletedCategory => {
    if(deletedCategory)
      return res.status(200).json({status: true, message: 'The category has been removed!'})
    else 
      return res.status(404).json({status: false, message: 'The category can not be removed!'})
  })
  .catch((err) => {
     res.status(500).json({
       error: err,
       status: false
     })
  }) 
});

module.exports = router;