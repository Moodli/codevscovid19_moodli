'use strict';
/*eslint-env node*/

//Dependencies
const standardLex = require('apos-to-lex-form');
const natural = require('natural');
const stWord = require('stopword');
const strSim = require('string-similarity');
const localtionDB = require('all-the-cities');
const cL = require('country-list');
const { overwrite } = require('country-list');
overwrite([{
    code: 'US',
    name: 'USA'
}])
const { WordTokenizer } = natural;
const tokenizer = new WordTokenizer;
//Load dictionary file
const dict = require('../config/dict.js').data;

//BestMatch
// const bestMatch = (array) => {

//     let finalArray = []
//     for (let index = 0; index < array.length; index++) {
//         const element = array[index];
//         const a = strSim.findBestMatch(element, dict)
//         finalArray.push(a.bestMatch.target)
//     }
//     return finalArray
// };

//Data pre-processing
const dataPrep = (text) => {
    //Convert string to standard lexicons
    const toLex = standardLex(text);
    //Convert all to lower case
    const toLow = toLex.toLowerCase();
    //Normalize (remove accent)
    const normalized = toLow.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    //Remove numbers and punctuations
    const alphaOnly = normalized.replace(/[^a-zA-Z\s]+/g, '');
    //Convert string to lexicons again
    const toLex2 = standardLex(alphaOnly);
    //Tokenize strings
    const tokenized = tokenizer.tokenize(toLex2);
    return tokenized

    // //Remove stopwords
    // const remSw = stWord.removeStopwords(tokenized);
    // // Return the final result
    // return bestMatch(remSw);
};


//Location Format Processing
const locationFilter = (location) => {

    //Return arrays with 2 elements
    const filter = () => {
        if (location != null) {
            //Normalize (remove accent)
            const normalized = location.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            //Remove numbers and punctuations
            const alphaOnly = normalized.replace(/[^a-zA-Z\s]+/g, '');
            //Take in value that's not null after normalization
            if (alphaOnly.match(/[^ ,]+/g) != null) {
                //Replace space with comma than turn the string into array using comma as a separator
                const locality = alphaOnly.match(/[^ ,]+/g).join(',').split(',');

                // Take in array with the length of 1
                if (locality.length === 1) {
                    //Check fo corresponding country code
                    const countryCode = cL.getCode(locality[0]);
                    if (countryCode != undefined) {
                        return localtionDB.filter(data => data.country.match(countryCode))[0].loc.coordinates
                        //Otherwise check for the city
                    } else {
                        //If the city is not found
                        if (localtionDB.filter(data => data.name.match(locality[0]))[0] === undefined) {
                            return undefined
                            //Otherwise return the coordinate
                        } else {
                            return localtionDB.filter(data => data.name.match(locality[0]))[0].loc.coordinates
                        }

                    }

                }

                // Take in array with the length of 2 
                if (locality.length === 2) {
                    //Check both elements of the array for country code
                    const countryCode = cL.getCode(locality[1]);
                    //Country code found for the 1 element
                    if (countryCode != undefined) {

                        //Search locality DB for country[1] and city [0]
                        //If the result is not undefined return the exact coordinate
                        if (localtionDB.filter(data => data.country.match(countryCode) && data.name.match(locality[0]))[0] != undefined) {

                            return localtionDB.filter(data => data.country.match(countryCode) && data.name.match(locality[0]))[0].loc.coordinates
                            //otherwise just return the country's coordinate
                        } else {

                            return localtionDB.filter(data => data.country.match(countryCode))[0].loc.coordinates
                        }
                        //Check for the 2 element
                    } else {

                        return undefined
                    }

                }
            }
        }
    }

    //Remove undefined
    if (filter() === undefined) {
        return 'fup'
    } else {
        return filter()
    }
};





module.exports = { dataPrep, locationFilter, standardLex };





// var filtered = array.filter((el)=> {
//   return el != null;
// });

// console.log(filtered);

        //  //Search locality DB for country[0] and city [1]
        //                     //If the result is not undefined return the exact coordinate
        //                     if (localtionDB.filter(data => data.country.match(countryCode) && data.name.match(locality[1]))[0] != undefined) {

        //                         return [countryCode, locality]
        //                         // return [localtionDB.filter(data => data.country.match(countryCode) && data.name.match(locality[1]))[0], locality]
        //                         //otherwise just return the country's coordinate
        //                     } else {
        //                         return [countryCode, locality]
        //                         // return [localtionDB.filter(data => data.country.match(countryCode))[0], locality]
        //                     }