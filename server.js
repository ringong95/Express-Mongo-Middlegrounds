const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient

var db;

MongoClient.connect(
  "mongodb://ringo:r2d253@ds235461.mlab.com:35461/user_tracker",
  (err, client) => {
    app.use(bodyParser.urlencoded({
      extended: true
    }));

    if (err) return console.log(err);
    db = client.db("user_tracker"); // whatever your database name is
    app.listen(3001, () => {
      console.log("listening on 3001");
    });

    app .get("/", (req, res) => {
      console.log(__dirname);
      res.sendFile(__dirname + "/index.html");
      // Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
      // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
    });

    app.post("/export", (req, res) => {
      console.log( 'test' ,req.body)
      // db.collection('users').save({
      //   email: req.body[1]
      // }, (err, result) => {
      //   if (err) return console.log(err)

      //   console.log('saved to database')
      // })
    });
  }
);
