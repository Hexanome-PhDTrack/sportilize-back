// convert csv to json file
const fs = require('fs');
const csvParser = require('csv-parser');

const result = [];

function csv2json(csvFilePath: String, outputJsonFilePath: String) {
  fs.createReadStream(csvFilePath)
    .pipe(csvParser({ separator: ';' }))
    .on('data', data => {
      result.push(data);
    })
    .on('end', () => {
      //console.log(result);
      // write to file
      fs.writeFileSync(
        outputJsonFilePath,
        JSON.stringify(result, null, 2),
        'utf8',
      );
    });
}

csv2json(
  `${__dirname}/data/Data_sport_2016_utf8.csv`,
  `${__dirname}/data/Data_sport_2016_utf8.json`,
);
