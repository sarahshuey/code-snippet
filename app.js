const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const app = express();
const snippet = require('./models/list.js')
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let url = 'mongodb://localhost:27017/list';
mongoose.connect(url);
const ObjectId = require('mongodb').ObjectID;
app.engine('mustache', mustacheExpress());
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(bodyParser.urlencoded({
  extended: false
}))

app.get('/', function(req, res) {
  console.log('root path hit');
  snippet.find()
    .then(function(index) {
      console.log(index);
      res.render('index')
      // res.render('index', {
      //   newcode: index
      // })
    })
    .catch(function(error) {
      console.log('error ' + JSON.stringify(error));
    })
});

app.listen(3000, function() {
  console.log('Successfully started express appslication!');
});

process.on('SIGINT', function() {
  console.log("\nshutting down");
  mongoose.connection.close(function() {
    console.log('Mongoose default connection disconnected on app termination');
    process.exit(0);
  });
});
