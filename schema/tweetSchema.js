//Dependencies
const mongoose = require('mongoose');

//Global Constant
const Schema = mongoose.Schema;

// Create Schema
const tweetSchema = new Schema({
    date: {
        type: String,

    },
    text: {
        type: Array,
    },
    location: {

    }

}, {
    collection: 'Tweets'
});

mongoose.model('tweet', tweetSchema);