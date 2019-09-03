'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const authRoutes = express.Router();
const User = require('../models/auth/userModel');
const helper = require('../middleware/helpers');
const authenticate = helper.authenticate;

authRoutes.post('/signup', signup);
authRoutes.post('/signin', authenticate, signin); //basic auth only, reject tokens

function signup ( request, response, next ) {
//take request.body, make new User, .save, return user
  let newUser = new User ( request.body );
  newUser.save()
    .then( user => {
      response.status(200).json( user );
    })
    .catch( error => next( error ) );
}

function signin ( request, response ) {
  response.status(200).json( request.token );
}

module.exports = authRoutes;
