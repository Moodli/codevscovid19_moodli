const fs = require('fs');
const path = require('path');

const csvLocation = path.join(__dirname, '../mlModel/tweets.csv');
const writeSt = fs.createWriteStream(csvLocation, { flags: 'a', });

//CSV Column names
writeSt.write('text,location,textHuman');

const csvFunc = (twt) => {

    //Create arrays to hold processed texts
    const textHumanArray = [];
    const textArray = [];
    const locationArray = [];

    //Iterate through the twitObject
    for (const key in twt) {

        if (key === 'text') {

            //Get the column name
            let element = twt[key];

            //Add double quotes to escape the string
            element = element.map(x => `""${x}""`);

            //Push the processed text to the array
            textArray.push(`"[${element}]"`);
        }

        //Get the coordinates
        if (key === 'location') {

            //Get the column name
            let element = twt[key];

            //Push the processed text to the array
            locationArray.push(`"[${element}]"`);
        }


        if (key === 'textHuman') {

            //Get the column name
            let elementx = twt[key];

            //Remove csv sensitive characters
            let elementy = elementx.replace(/\n/g, ' ').replace(/,/g, ' ').replace(/"/g, ' ');

            //Push the processed text to the array
            textHumanArray.push(`"${elementy}"`);

        }
    }

    //Join the the rows
    const csv = `${'\n'}${textArray},${locationArray},${textHumanArray}`;

    //Write to the file
    writeSt.write(csv);
    return;

};

//Export the Module
module.exports = { csvFunc, };


 // //Write to the disk
    // fs.writeFileSync('./x.csv', csv);
    // return csv

     // const csv = `${keys.join(',')}${'\n'}${textHumanArray}`;
    // const csv = `text,textHuman,location${'\n'}${textHumanArray}`;
    // const csv = `${'\n'}${textArray},${locationArray}`;

    // let elementx = twt[key];
            // let element = elementx.toString();
            // let elementClean = element.replace(/[^a-zA-Z\s]+/g, ' ')
            // textHumanArray.push(`"${elementClean}"`);