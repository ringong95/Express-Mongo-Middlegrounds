const express = require("express");
const bodyParser = require('body-parser')
const helmet = require('helmet')

const app = express();
const MongoClient = require('mongodb').MongoClient




var db;

// Set up mongo clinet to allow me to connect to a mongoDB
MongoClient.connect(
  "mongodb://ringo:r2d253@ds235461.mlab.com:35461/user_tracker", {
    useNewUrlParser: true
  },
  (err, client) => {
    //
    app.use(helmet())
    // App Parse JSON in respondses bodies
    app.use(bodyParser.json())

    if (err) return console.log(err);
    db = client.db("user_tracker"); // whatever your database name is

    // Load routes
    require('./routes')(app, db);
  }
);

module.exports = app