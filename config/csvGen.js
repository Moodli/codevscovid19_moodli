const fs = require('fs');
const path = require('path');

const csvLocation = path.join(__dirname, '../mlModel/tweets.csv');
const writeSt = fs.createWriteStream(csvLocation, { flags: 'a', });

//CSV Column names
writeSt.write('text,location,textHuman');

const csvFunc = (twt) => {

    const keys = [];
    const vals = [];
    const vals1 = [];
    const vals2 = [];
    for (const key in twt) {

        //Add double quotes to escape the string
        if (key === 'text') {
            //Get the column name
            let element = twt[key];
            element = element.map(x => `""${x}""`);
            vals1.push(`"[${element}]"`);
        }

        if (key === 'location') {
            //Get the column name
            let element = twt[key];
            vals2.push(`"[${element}]"`);
        }

        if (key === 'textHuman') {
            //Get the column name
            // let elementx = twt[key];
            // let element = elementx.toString();
            // let elementClean = element.replace(/[^a-zA-Z\s]+/g, ' ')
            // vals.push(`"${elementClean}"`);
            let elementx = twt[key];
            let elementy = elementx.replace(/\n/g, ' ').replace(/,/g, ' ').replace(/"/g, ' ');

            vals.push(`"${elementy}"`);



        }
        keys.push(key);

    }

    //Join the the rows
    // const csv = `${keys.join(',')}${'\n'}${vals}`;
    // const csv = `text,textHuman,location${'\n'}${vals}`;
    // const csv = `${'\n'}${vals1},${vals2}`;
    const csv = `${'\n'}${vals1},${vals2},${vals}`;


    // //Write to the disk
    // fs.writeFileSync('./x.csv', csv);
    writeSt.write(csv);
    // return csv

};

module.exports = { csvFunc, };


