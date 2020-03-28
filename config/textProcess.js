'use strict';
/*eslint-env node*/

//Dependencies
const standardLex = require('apos-to-lex-form');
const natural = require('natural');
const stWord = require('stopword');
const strSim=require('string-similarity');

const { WordTokenizer } = natural;
const tokenizer = new WordTokenizer;

//Load dictionary file
const dict= require('../config/dict.js').data;
// const ye=strSim.findBestMatch('love',dict)
// const ye = strSim.findBestMatch('love',dict)
// console.log(ye.bestMatch)

// for (let index = 0; index < dict.length; index++) {
//     const element = dict[index];
//     console.log(element)
// }

//Define the function
const dataPrep = (text) => {
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
    // return the final result
    return remSw
}


module.exports={dataPrep}
// let ab=[]

// const preA=dataPrep("some apples please sx asd ");

// for (let index = 0; index < preA.length; index++) {
//     const element = preA[index];
//     const a =strSim.findBestMatch(element,dict)
//    ab.push(a.bestMatch.target) 

// }
// console.log(preA)
// console.log(ab)



// var filtered = array.filter((el)=> {
//   return el != null;
// });

// console.log(filtered);