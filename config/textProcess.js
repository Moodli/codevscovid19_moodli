'use strict';
/*eslint-env node*/

//Dependencies
const standardLex = require('apos-to-lex-form');
const natural = require('natural');
const stWord = require('stopword');
const { WordTokenizer } = natural;
const tokenizer = new WordTokenizer;
const toLexlow = (text) => {
    //Convert string to standard lexicons
    const toLex = standardLex(text);
    //Convert all to lower case
    const toLow = toLex.toLowerCase();
    //remove numbers and punctuations
    const alphaOnly = toLow.replace(/[^a-zA-Z\s]+/g, '');
    //convert string to lexicons again
    const toLex2 = standardLex(alphaOnly)
    //Tokenize strings
    const tokenized = tokenizer.tokenize(toLex2)
    //Remove stopwords
    const remSw = stWord.removeStopwords(tokenized);
    //return the final result
    return remSw
}

console.log(toLexlow("some apples please"))