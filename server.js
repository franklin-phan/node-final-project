// library requirements
const dotenv = require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// dotenv.config();

// Use Database
require('./data/todo-db');

// Create app
const app = express();

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

// cookie parser
app.use(cookieParser());

var checkAuth = (req, res, next) => {
    console.log("Checking authentication");
    if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
      req.user = null;
    } else {
      var token = req.cookies.nToken;
      var decodedToken = jwt.decode(token, { complete: true }) || {};
      req.user = decodedToken.payload;
    }
  
    next();
  };
  app.use(checkAuth);

// controllers
require('./controllers/auth.js')(app);
require('./controllers/todo.js')(app);

// Start Server
app.listen(3000, () => {
    console.log('listening on port localhost:3000!');
  });
  
  module.exports = app;
  