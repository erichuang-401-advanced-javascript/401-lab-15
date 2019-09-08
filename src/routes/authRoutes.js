'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const authRoutes = express.Router();
const User = require('../models/auth/userModel');
const helper = require('../middleware/helpers');
const authenticate = helper.authenticate;

/**
 * Sign up route
 * @route POST /signup
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
authRoutes.post('/signup', signup);

/**
 * Sign in route
 * @route POST /signin
 * @returns {object} 200 - Token
 * @returns {Error}  default - Unexpected error
 */
authRoutes.post('/signin', authenticate, signin);

function signup ( request, response, next ) {
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
