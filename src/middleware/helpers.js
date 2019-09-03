'use strict';

module.exports = {};

module.exports.modelLoader = ( request, response, next ) => {
  let model = request.params.model;
  let schema = require(`../models/${model}/${model}-schema.js`);
  let Model = require('../models/crudModel');
  request.model = new Model( schema );
  next();
};
