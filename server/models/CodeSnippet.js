const mongoose = require('mongoose');

const codeSnippetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    output: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: 'Untitled Snippet'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CodeSnippet', codeSnippetSchema);
