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
      res.render('index', {
        newCodeSnippet: index
      })
    })
    .catch(function(error) {
      console.log('error ' + JSON.stringify(error))
      res.redirect('/');
    })
});

app.get('/update/:id', function(req, res) {
  let id = req.params.id;
  snippet.findOne({
      _id: new ObjectId(id)
    })
    .then(function(update) {
      res.render('update', {
      updateCodeSnippet: update
      })
    })
    .catch(function(error) {
      console.log('error ' + JSON.stringify(error));
      res.redirect('/')
    })
})
app.post("/searchlanguage", function(req, res) {
  let searchlanguage = req.body.searchlanguage;
  console.log(req.body.searchlanguage);
  snippet.find({
    language: searchlanguage
  }).then(function(snippets) {
    res.render('searchlanguage', {
      snippets: snippets
    });
  })
  .catch(function(error) {
    console.log('error ' + JSON.stringify(error));
    res.redirect('/')
  })
})
  app.post("/searchtags", function(req, res) {
    let searchtags = req.body.searchtags;
    snippet.find({
      tags: searchtags
    }).then(function(snippets) {
      res.render('searchtags', {
        snippets: snippets
      });
      console.log(snippet.find);
    })

});
app.post('/update/:id', function(req, res) {
  let id = req.params.id
  let newCode = req.body.code
  let newTitle = req.body.title
  let tags = req.body.tags
  const newTags = tags.split(' ');
  let newLanguage = req.body.language
  let newNotes = req.body.notes

  snippet.updateOne({
      _id: new ObjectId(id)
    }, {
      code: newCode,
      title: newTitle,
      notes: newNotes,
      language: newLanguage,
      tags: newTags
    })

    .then(function() {
      res.redirect('/')
    })
});

app.post('/', function(req, res) {
  let newCode = req.body.code
  let newTitle = req.body.title
  let tags = req.body.tags
  const newTags = tags.split(' ');
  let newLanguage = req.body.language
  let newNotes = req.body.notes
  const snip = new snippet({
    code: newCode,
    title: newTitle,
    notes: newNotes,
    language: newLanguage,
    tags: newTags
  })

  snip.save()
    .then(function(results) {
      console.log("saved " + results);
      return snippet.find()
    })
    .then(function(snips) {
      console.log(snips);
      res.render('index', {
        newCodeSnippet: snips
      })
    })
    .catch(function(error, index) {
      console.log('catch from snip save');
      console.log('error ' + JSON.stringify(error));
      res.redirect('/')
    })
});

app.post('/delete/:id', function(req, res) {
  let id = req.params.id;
  snippet.deleteOne({
      _id: new ObjectId(id)
    })
    .then(function() {
      res.redirect('/')
    })
    .catch(function(error, index) {
      console.log('error ' + JSON.stringify(error));
      res.redirect('/')
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
