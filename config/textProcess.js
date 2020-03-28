'use strict';
/*eslint-env node*/

//Dependencies
const standardLex = require('apos-to-lex-form');
const natural = require('natural');
const stWord = require('stopword');
const strSim = require('string-similarity');

const { WordTokenizer } = natural;
const tokenizer = new WordTokenizer;

//Load dictionary file
const dict = require('../config/dict.js').data;

//BestMatch
const bestMatch = (array) => {

    let finalArray = []
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        const a = strSim.findBestMatch(element, dict)
        finalArray.push(a.bestMatch.target)

    }
    return finalArray
};

//Data pre-processing
const dataPrep = (text) => {
    //Convert string to standard lexicons
    const toLex = standardLex(text);
    //Convert all to lower case
    const toLow = toLex.toLowerCase();
    //Normalize
    const normalized = toLow.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    //remove numbers and punctuations
    const alphaOnly = normalized.replace(/[^a-zA-Z\s]+/g, '');
    //convert string to lexicons again
    const toLex2 = standardLex(alphaOnly);
    //Tokenize strings
    const tokenized = tokenizer.tokenize(toLex2);
    //Remove stopwords
    const remSw = stWord.removeStopwords(tokenized);
    // return the final result
    return bestMatch(remSw);
};

//Normalization
const countryNormalization = (countryName) => {
    return countryName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

module.exports = { dataPrep, countryNormalization };





// var filtered = array.filter((el)=> {
//   return el != null;
// });

// console.log(filtered);