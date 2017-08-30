const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
    // TODO change name to be unique
    title: { type: String, required: true},
    code: { type: String, required: true},
    notes: [String],
    language: [String],
    tags: [String]
})

const codeSnippet = mongoose.model('snippet', snippetSchema);

module.exports = codeSnippet;
