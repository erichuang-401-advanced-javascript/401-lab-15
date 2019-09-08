'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const contentRoute = express.Router();
const helper = require('../middleware/helpers');
const modelLoader = helper.modelLoader;
const authenticate = helper.authenticate;

contentRoute.param('model', modelLoader);
/**
 * Routes for categories / products
 * @route GET /content/:model
 * @param {string} Bearer Token
 * @param {string} Query: product or category ID
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
contentRoute.get('/content/:model', authenticate, get);
/**
 * Routes for categories / products
 * @route POST /content/:model
 * @param {string} Bearer Token
 * @param {object} New category or product schema
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
contentRoute.post('/content/:model', authenticate, create);
/**
 * Routes for categories / products
 * @route PUT /content/:model
 * @param {string} Bearer Token
 * @param {string} Query: product or category IDEdit content
 * @param {object} Edit content
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
contentRoute.put('/content/:model', authenticate, update);
/**
 * Routes for categories / products
 * @route DELETE /content/:model
 * @param {string} Bearer Token
 * @param {string} Query: product or category ID
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
contentRoute.delete('/content/:model', authenticate, remove);

function get ( request, response, next ) {
  if ( request.query.id ) {
    return request.model.read( request.query.id )
      .then( results => response.status(200).json( results ) )
      .catch( error => next( error ) );
  } else {
    return request.model.read()
      .then( results => response.status(200).json( results ) )
      .catch( error => next( error ) );
  }
}

function create ( request, response, next ) {
  if ( request.body ) {
    return request.model.create( request.body )
      .then( results => response.status(200).json( results ) )
      .catch( error => next( error ) );
  } else response.send('Could not create.');
}

function update ( request, response, next ) {
  if ( request.query.id && request.body ) {
    return request.model.update( request.query.id, request.body )
      .then( results => response.status(200).json( results ) )
      .catch( error => next( error ) );
  } else response.send('Could not update.');
}

function remove ( request, response, next ) {
  if ( request.query.id ) {
    return request.model.remove( request.query.id )
      .then( results => response.status(200).json( results ) )
      .catch( error => next( error ) );
  } else response.send('Could not delete.');
}

module.exports = contentRoute;
