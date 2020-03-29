'use strict';
/*eslint-env node*/

//Dependencies
const standardLex = require('apos-to-lex-form');
const natural = require('natural');
const stWord = require('stopword');
const strSim = require('string-similarity');
const cL = require('country-list');
const localtionDB = require('all-the-cities');
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
    //Normalize (remove accent)
    const normalized = toLow.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    //Remove numbers and punctuations
    const alphaOnly = normalized.replace(/[^a-zA-Z\s]+/g, '');
    //Convert string to lexicons again
    const toLex2 = standardLex(alphaOnly);
    //Tokenize strings
    const tokenized = tokenizer.tokenize(toLex2);
    //Remove stopwords
    const remSw = stWord.removeStopwords(tokenized);
    // Return the final result
    return bestMatch(remSw);
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
                const locality = alphaOnly.match(/[^ ,]+/g).join(',').split(',')

                // Take in array with the length of 1
                if (locality.length === 1) {
                    //Check fo corresponding country code
                    const countryCode = cL.getCode(locality[0])
                    if (countryCode != undefined) {
                        // return [localtionDB.filter(city => city.country.match(countryCode))[0].loc, countryCode, 'Country']
                        return localtionDB.filter(data => data.country.match(countryCode))[0].loc
                        //Otherwise check for the city
                    } else {
                        //If the city is not found
                        if (localtionDB.filter(data => data.name.match(locality))[0] === undefined) {
                            return undefined
                            //Otherwise return the coordinat
                        } else {
                            // return [ localtionDB.filter(city => city.name.match(locality))[0].loc, locality, "City"]
                            localtionDB.filter(data => data.name.match(locality))[0].loc
                        }

                    }

                }

                // Take in array with the length of 2 
                // if (locality.length === 2) {
                //     //Check both elements of the array for country code
                //     const countryCode = cL.getCode(locality[0])
                //     const countryCode2 = cL.getCode(locality[1])
                //     //Country code found for the 1 element
                //     if (countryCode != undefined) {
                //         //Search locality DB for country[0] and city [1]
                //         // return localtionDB.filter(data => data.country.match(countryCode) && data.name.match(countryCode2))[0].loc
                //         return [localtionDB.filter(data => data.country.match(countryCode) && data.name.match(countryCode2))[0].loc, locality]

                //         //Check for the 2 element
                //     } else {
                //         //Search locality DB for country[1] and city [0]
                //         // return localtionDB.filter(data => data.country.match(countryCode2) && data.name.match(countryCode))[0].loc

                //         return [localtionDB.filter(data => data.country.match(countryCode2) && data.name.match(countryCode))[0].loc, locality]
                //     }
                // }
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





module.exports = { dataPrep, locationFilter };





// var filtered = array.filter((el)=> {
//   return el != null;
// });

// console.log(filtered);