const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
    // TODO change name to be unique
    title: String,
    code: { type: String, required: true},
    notes: [String],
    language: [String],
    tags: [String]
})

const codeSnippet = mongoose.model('codeSnippet', snippetSchema);

module.exports = codeSnippet;
