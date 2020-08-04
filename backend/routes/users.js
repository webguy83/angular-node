const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(password => {
      return new User({
        email: req.body.email,
        password
      })
        .save()
    })
    .then(result => {
      res.status(201).json({
        message: "User created",
        result
      })
    })
    .catch(error => {
      res.status(500).json({
        error
      })
    })
})

router.post('/login', (req, res, next) => {
  let verifiedUser;

  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (!user) {
        res.status(401).json({
          message: 'Auth Failed!'
        })
      }
      verifiedUser = user;
      return bcrypt.compare(req.body.password, verifiedUser.password);
    })
    .then(matched => {
      if (!matched) {
        return res.status(401).json({
          message: 'Passwords don\'t match!'
        })
      }
      const token = jwt.sign({
        email: verifiedUser.email,
        userId: verifiedUser._id
      }, process.env.JWT_WEB_TOKEN_SECRET, {
        expiresIn: '1hr'
      })
      res.status(200).json({
        token,
        tokenExpiresIn: 3600,
        userId: verifiedUser._id
      })
    })
    .catch(err => {
      res.status(401).json({
        message: 'Auth Failed!'
      })
    })
})

module.exports = router;
