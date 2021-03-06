'use strict';

const User = require('../models/auth/userModel');

module.exports = {};

/**
 * Loads model based on url path and attaches it to request object.
 * @param request
 * @param response
 * @param next
 */
module.exports.modelLoader = ( request, response, next ) => {
  let model = request.params.model;
  let schema = require(`../models/content/${model}/${model}-schema.js`);
  let Model = require('../models/content/crudModel');
  request.model = new Model( schema );
  next();
};

/**
 * Determines authorization type and passes the authorization credentials along to the next auth functions
 * @param request
 * @param response
 * @param next
 */
module.exports.authenticate = ( request, response, next ) => {

  try {
    let path = request.originalUrl.split( '/' )[1];
    let [ authType, authString ] = request.headers.authorization.split(' ');
    if ( authType.toLowerCase() === 'basic' && path === 'signin' ) {
      return basic( authString );
    } else if ( authType.toLowerCase() === 'bearer' && [ 'products', 'categories' ].includes( request.params.model ) ) {
      return token( authString );
    } else response.send( 'Could not authenticate.' );
  } catch( error ){
    next( error);
  }

  /**
   * Basic Authorization handler. Queries DB for user and generates a token to be used for protected routes.
   * @param basicAuthString
   * @returns {Promise<T>}
   */
  function basic ( basicAuthString ) {
    let credentials = decode( basicAuthString );
    return User.basicAuth( credentials )
      .then( user => {
        if ( user ) {
          request.user = user.username;
          request.token = user.generateToken();
          next();
        }
      })
      .catch( error => next( error ) );
  }

  /**
   * Helper function for basic auth. Converts the authorization credentials to string and returns user name and password.
   * @param authString
   * @returns {{password: *, username: *}}
   */
  function decode ( authString ) {
    let buffer = Buffer.from( authString, 'base64' ).toString();
    let [ username, password ] = buffer.split(':');
    return { username, password };
  }

  /**
   * Handles token authorization. Passes the token to a user function to be verified and then uses the returned user to verify role.
   * @param tokenAuthString
   * @returns {Promise<T>}
   */
  function token ( tokenAuthString ) {
    return User.tokenAuth( tokenAuthString )
      .then( user => {
        if ( user ) {
          if ( roleCheck( user.role, request.method.toLowerCase())) {
            next();
          } else response.send( 'Invalid access credentials' );
        } else response.send( 'Bad token' );
      })
      .catch( error => next( error ) );
  }

  /**
   * Checks user's role against the method they are using to request and returns true or false.
   * @param role
   * @param method
   * @returns {boolean}
   */
  function roleCheck ( role, method ) {
    const key = {
      user : [ 'get', 'put' ],
      admin : [ 'get', 'post', 'put', 'delete' ],
    };
    return key[role].includes(method) ? true : false;
  }

};

