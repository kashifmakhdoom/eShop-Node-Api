const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const {requireAuth, requireAdmin} = require('../middleware/auth-handler');

// model
const { User, validate } = require('../models/user');

// object id validator
const validateObjectId = require("../middleware/validate-objectId-handler");

// GET: All objects
// ROUTE: /api/v1/users
// ACCESS: Public
router.get(`/`, [requireAuth, requireAdmin], async(req, res) => {
  const userList = await User.find().select('name email phone');

  if(userList) 
    return res.status(200).send(userList);

  return res.status(500).json({status: false, message: 'Users can not be found!'});
});

// GET: Single object by id
// ROUTE: /api/v1/users/:id
// ACCESS: Public
router.get(`/:id`, [requireAuth, requireAdmin], validateObjectId, async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if(user) 
    return res.status(200).send(user);
  
  return  res.status(500).json({status: false, message: 'User can not be found!'});
});

// GET: Logged in user profile
// ROUTE: /api/v1/users
// ACCESS: Private/User
router.get(`/me`, requireAuth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if(user) 
    return res.status(200).send(user);
  
  return  res.status(500).json({status: false, message: 'User can not be found!'});
});

// PUT: Update a single object
// ROUTE: /api/v1/users/:id
// ACCESS: Private/Admin
router.put('/:id', [requireAuth, requireAdmin], validateObjectId, async (req, res) => {
  // validate object
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findByIdAndUpdate(req.params.id, {
    name: req.body.name
    
  }, {new: true});

  if(user) {
    return res.status(200).send(user);
  } 
  
  return  res.status(500).json({status: false, message: 'User can not be found!'})
})

// POST: Create a single object
// ROUTE: /api/v1/users
// ACCESS: Private/Admin
router.post(`/register`, async (req, res) => { 
  // validate input
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // validate duplication
  let user = await User.findOne({email: req.body.email});
  if(user) return res.status(400).send(`User ${req.body.email} already registerd!`);

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync()),
    phone: req.body.phone,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
    isAdmin: req.body.isAdmin
  });

  user = await user.save();

  if(!user)
    return res.status(404).send('The user can not be created!');

  //return res.status(201).json(user);
  return res.status(201).json(_.pick(user, [user, '_id', 'name', 'email']));
});

router.post('/login', async(req, res) => {
  const user = await User.findOne({email: req.body.email});

  if(!user)
    return res.status(400).send('Invalid user or email!');

  if(user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = user.generateAuthToken();
    return res.status(200).json({user: user.email, token});
  } else
    return res.status(400).json({status: false, message: "Invalid password!"});
});

// DELETE: Single object by id
// ROUTE: /api/v1/users/:id
// ACCESS: Private/Admin
router.delete('/:id', [requireAuth, requireAdmin], validateObjectId, async (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(deletedUser => {
      if(deletedUser)
        return res.status(200).json({status: true, message: 'The user has been removed!'});
      else 
        return res.status(404).json({status: false, message: 'The user can not be removed!'});
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        status: false
      });
    }) 
});

module.exports = router;