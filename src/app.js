'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

app.use(cors);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

module.exports = {
  server : app,
  start : ( port ) => {
    app.listen( port, () => {
      console.log('BATTLECRUISER OPERATIONAL o7');
    });
  },
};

