'use strict';

const express = require('express');
const app = express();
const expressSwagger = require('express-swagger-generator')(app);
const cors = require('cors');
const morgan = require('morgan');

let options = {
  swaggerDefinition: {
    info: {
      description: 'This is a sample server',
      title: 'Swagger',
      version: '1.0.0',
    },
    host: 'localhost:3000',
    basePath: '/',
    produces: [
      'application/json',
    ],
    schemes: ['http', 'https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description:'',
      },
    },
  },
  basedir: __dirname, //app absolute path
  files: ['./routes/*.js'], //Path to the API handle folder
};

const contentRoute = require('./routes/contentRoute');
const authRoutes = require('./routes/authRoutes');
const error404 = require('./middleware/404');
const errorHandler = require('./middleware/500');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//routes
app.use( authRoutes );
app.use( contentRoute );
expressSwagger( options );

// Static Routes
app.use('/docs', express.static('docs'));

//all errors down here
app.use( error404 );
app.use( errorHandler );

module.exports = {
  server : app,
  start : ( port ) => {
    app.listen( port, () => {
      console.log('BATTLECRUISER OPERATIONAL:', port);
    });
  },
};

