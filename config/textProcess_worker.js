
/*eslint-env node*/

//Dependencies
const standardLex = require('apos-to-lex-form');
const natural = require('natural');
// const stWord = require('stopword');
// const strSim = require('string-similarity');
const localtionDB = require('all-the-cities');
const cL = require('country-list');
const { overwrite, } = require('country-list');
overwrite([{
    code: 'US',
    name: 'USA',
}]);
const { WordTokenizer, } = natural;
const tokenizer = new WordTokenizer;

//DB Connection
const { DB_Connection: dbConnection, } = require('./dbConnection');
require('../schema/tweetSchema');
const tweetDB = dbConnection.model('tweet');
const changeStream = tweetDB.watch();

//Internal dependencies
const { parentPort, threadId, } = require('worker_threads');

//Winston Loggers
const logger = require('./logs');
const dblog = logger.get('dbCon');
const workerLog = logger.get('workerLog');
const statsLog = logger.get('statsLog');


//Data pre-processing
const dataPrep = (text) => {

    //Convert string to standard lexicons
    const toLex = standardLex(text);

    //Convert all to lower case
    const toLow = toLex.toLowerCase();

    //Normalize (remove accent)
    const normalized = toLow.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    //Remove numbers and punctuations
    const alphaOnly = normalized.replace(/[^a-zA-Z\s]+/g, '');

    //Convert string to lexicons again
    const toLex2 = standardLex(alphaOnly);

    //Tokenize strings
    const tokenized = tokenizer.tokenize(toLex2);
    return tokenized;

    // //Remove stopwords
    // const remSw = stWord.removeStopwords(tokenized);
    // // Return the final result
    // return bestMatch(remSw);
};

//Location Format Processing
const locationFilter = (location) => {

    //Check for empty location
    if (!location) {
        return;
    }

    //Normalize (remove accent)
    let normalized = location.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (normalized.match(/[,\/]/g)) {
        normalized = normalized.replace(/[,\/]/g, ' ');
    }

    //Remove numbers and punctuations
    let alphaOnly = normalized.replace(/[^a-zA-Z\s]+/g, '');

    //Check for falsy values after normalization
    if (!alphaOnly) {
        return;
    }

    let locality = alphaOnly.split(' ');

    //Split the location string into an array base on space


    //Check for falsy values after splitting
    if (!locality) {
        return;
    }

    //Special Handling for Countries with Long Names
    if (locality[0] === 'United' && locality[1] === 'States') {
        locality = ['United States of America'];
    }

    if (
        (locality[0] === 'United' && locality[1] == 'Kingdom') ||
        (locality[0] === 'Great' && locality[1] == 'Britain')
    ) {

        locality = ['United Kingdom of Great Britain and Northern Ireland'];
    }

    if (locality[0] === 'South' && locality[1] === 'Africa') {
        locality = ['South Africa'];
    }

    if (locality[0] === 'UK') {
        locality = ['GB'];
    }

    if (locality[0] === 'Brasil' || locality[1] === 'Brasil') {
        locality = ['Brazil'];
    }
    
    if (locality[0]==='New'&&locality[1]==='Zealand') {
      locality=['New Zealand']
      
    }
    
    if (
      (locality[0] === 'South' && locality[1] === 'Korea')
      ||(locality[0]==='Korea'||
      locality[1]==='Korea')
      ) {
      locality = ['KR']
    
    }

    //If the location has only one string
    if (locality.length === 1 && locality[0]) {

        //Matching Countries (Full Form)
        let code = cL.getCode(locality[0].toUpperCase());

        //Matching Countries (Country Code)
        let code1 = localtionDB.filter(data => data.country === locality[0].toUpperCase());

        //Matching Cities
        //Capitalize the First Letter
        let transform = locality[0][0].toUpperCase();
        locality[0] = transform + locality[0].slice(1);
        let code2 = localtionDB.filter(data => data.name === locality[0]);

        //Check for the 1st element and randomly pick a city for it then return the coordinate
        if (code) {
            let countryMatched = localtionDB.filter(data => data.country.match(code));
            let ran = Math.floor(Math.random() * countryMatched.length);
            let coordinates = countryMatched[ran].loc.coordinates;
            return coordinates;
        }

        //Randomly pick a city from the Matches then return the coordinates | 1st element of the array
        if (code1 && code1.length) {
            let ran = Math.floor(Math.random() * code1.length);
            let coordinates = code1[ran].loc.coordinates;
            return coordinates;
        }

        //Randomly pick a city from the Matches then return the coordinates | 2nd element of the array
        if (code2 && code2.length) {
            let ran = Math.floor(Math.random() * code2.length);
            let coordinates = code2[ran].loc.coordinates;
            return coordinates;
        }

    }

    //If the location has 2 separate strings
    if (locality.length === 2) {

        //Remove false positives
        if (!locality[1] && !locality[2]) {
            return;
        }

        //Matching Countries (Full Form)
        let code = cL.getCode(locality[0].toUpperCase());
        let code1 = cL.getCode(locality[1].toUpperCase());

        //Matching Countries (Country Code)
        let code2 = localtionDB.filter(data => data.country === locality[0].toUpperCase());
        let code3 = localtionDB.filter(data => data.country === locality[1].toUpperCase());

        //Matching Cities
        //Capitalize the First Letter
        if (locality[0]) {
            let transform = locality[0][0].toUpperCase();
            locality[0] = transform + locality[0].slice(1);
        }
        let code4 = localtionDB.filter(data => data.name === locality[0]);

        //Capitalize the First Letter
        if (locality[1]) {
            let transform1 = locality[1][0].toUpperCase();
            locality[1] = transform1 + locality[1].slice(1);
        }
        let code5 = localtionDB.filter(data => data.name === locality[1]);

        //Check for the 1st element and randomly pick a city for it then return the coordinates
        if (code) {
            let countryMatched = localtionDB.filter(data => data.country.match(code));
            let ran = Math.floor(Math.random() * countryMatched.length);
            let coordinates = countryMatched[ran].loc.coordinates;
            return coordinates;
        }

        //Check for the 2nd element and randomly pick a city for it then return the coordinates
        if (code1) {
            let countryMatched = localtionDB.filter(data => data.country.match(code1));
            let ran = Math.floor(Math.random() * countryMatched.length);
            let coordinates = countryMatched[ran].loc.coordinates;
            return coordinates;
        }

        //Randomly pick a city from the Matches then return the coordinates | 1st element of the array
        if (code2 && code2.length) {
            let ran = Math.floor(Math.random() * code2.length);
            let coordinates = code2[ran].loc.coordinates;
            return coordinates;

        }

        //Randomly pick a city from the Matches then return the coordinates | 2nd element of the array
        if (code3 && code3.length) {
            let ran = Math.floor(Math.random() * code3.length);
            let coordinates = code3[ran].loc.coordinates;
            return coordinates;
        }

        //Randomly pick a city from the Matches then return the coordinates | 1st element of the array
        if (code4 && code4.length) {
            let ran = Math.floor(Math.random() * code4.length);
            let coordinates = code4[ran].loc.coordinates;
            return coordinates;
        }

        //Randomly pick a city from the Matches then return the coordinates | 2nd element of the array
        if (code5 && code5.length) {
            let ran = Math.floor(Math.random() * code5.length);
            let coordinates = code5[ran].loc.coordinates;
            return coordinates;
        }

    }

    //Remove Arrays that are too Long
    if (locality.length >= 3) {
        return;
    }
    statsLog.error(locality, location);
    return;
};



//Initialize Porcessing Coverage Counter
let inp = 0;
let out = 0;

//Run Task
// parentPort.on('message', x => {
//     if (locationFilter(x.user.location)) {
//         if (x.text) {

//             //Tweet Object to be stored in the db
//             let twitObj = {
//                 // date: twt.created_at,
//                 text: dataPrep(x.text),
//                 textHuman: x.text.replace('RT', ''),
//                 location: locationFilter(x.user.location),
//             };
//             console.log(threadId, twitObj.location);
//         }
//     }

// });
workerLog.info(`${threadId} started`);
parentPort.on('message', (twt) => {
    inp += 1;
    //Get rid of all the undefs
    if (locationFilter(twt.user.location)) {
        out += 1;
        //Get rid of all the empty tweets
        if (twt.text) {

            //Tweet Object to be stored in the db
            let twitObj = {
                // date: twt.created_at,
                text: dataPrep(twt.text),
                textHuman: twt.text.replace('RT', ''),
                location: locationFilter(twt.user.location),
            };

            //Save the object into the db
            new tweetDB(twitObj)
                .save()
                .catch(err => dblog.error(err));
        }
    }
});

//Monitoring
let dbStats = 0;
changeStream.on('change', () => {
    dbStats += 1;
    // parentPort.postMessage(`${threadId} -> Tweet Analyzed Since Started: ${dbStats}`);
});

// Return Stats every 10 sec	
setInterval(() => {
    parentPort.postMessage(`${threadId} -> Tweet Analyzed Since Started: ${dbStats}`);
}, 10 * 1000);

//Porcessing Coverage Counter
setInterval(() => {
    statsLog.info(`In: ${inp} | Out: ${out}`);
}, 1000 * 60);




//Load dictionary file
// const dict = require('../config/dict.js').data;

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



// //Execution time measurement
// let hrstarts = process.hrtime()
// let hrends = process.hrtime(hrstarts)
// simcompLog.info('Execution time[L]: ' + hrends[0] + 's ' + hrends[1] / 1000000 + 'ms')




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

