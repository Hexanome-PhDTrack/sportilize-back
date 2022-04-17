import fetch, { RequestInit } from 'node-fetch-commonjs';
import fs from 'fs';

// get data from Grand Lyon API
const urlGrandLyonTest: string =
  'https://download.data.grandlyon.com/ws/grandlyon/adr_voie_lieu.adrequipsportpct/all.json?maxfeatures=100&start=1';
const urlGrandLyonFull: string =
  'https://download.data.grandlyon.com/ws/grandlyon/adr_voie_lieu.adrequipsportpct/all.json?maxfeatures=-1&start=1';

async function api2json(url: string, outputFilePath: string) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    // write to file
    fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.log(error);
  }
}

api2json(urlGrandLyonFull, `${__dirname}/data/api_grand_lyon_2022.json`);
