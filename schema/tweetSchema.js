
/*eslint-env node*/

//Dependencies
const mongoose = require('mongoose');

//Global Constant
const Schema = mongoose.Schema;

// Create Schema
const tweetSchema = new Schema({
    date: {
        type: Date,
        default: Date.now(),
    },
    // },
    text: {
        type: Array,
    },
    textHuman: {
    },
    location: {
        type: Array,
    },

}, {
    collection: 'Tweets',
});

mongoose.model('tweet', tweetSchema);