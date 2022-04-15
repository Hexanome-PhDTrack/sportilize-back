import fetch, { RequestInit } from 'node-fetch-commonjs';
import fs from 'fs';

// get data from Grand Lyon API
const urlGrandLyonTest: string =
  'https://download.data.grandlyon.com/ws/grandlyon/adr_voie_lieu.adrequipsportpct/all.json?maxfeatures=100&start=1';

async function getGrandLyonData() {
  try {
    const response = await fetch(urlGrandLyonTest);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function printGrandLyonData(data) {
  console.log('### Print Grand Lyon data');
  console.log(data);
}

async function loadJSONFile(filePath: string) {
  try {
    const data = await fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  // get data from Grand Lyon API
  //const dataGrandLyon = await getGrandLyonData();
  //await printGrandLyonData(dataGrandLyon);

  // get data from JSON file
  const dataJSON = await loadJSONFile(`${__dirname}/data/Data_sport_2016.json`);
  console.log(dataJSON[0]);
}
main();
