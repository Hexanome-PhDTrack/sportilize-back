import fetch, { RequestInit } from 'node-fetch-commonjs';
import fs from 'fs';
import { Point } from 'geojson';
import crypto from 'crypto';
import { Repository } from 'typeorm';

import { InfrastructureEntity } from '../src/databaseEntities/InfrastructureEntity';
import { SportEntity } from '../src/databaseEntities/SportEntity';
import { AppDataSource } from '../src/data-source';

// global variables
let infrastructureRepository: undefined | Repository<InfrastructureEntity> =
  undefined;
let sportRepository: undefined | Repository<SportEntity> = undefined;

// get data from Grand Lyon API
const urlGrandLyonTest: string =
  'https://download.data.grandlyon.com/ws/grandlyon/adr_voie_lieu.adrequipsportpct/all.json?maxfeatures=100&start=1';
const urlGrandLyonFull: string =
  'https://download.data.grandlyon.com/ws/grandlyon/adr_voie_lieu.adrequipsportpct/all.json?maxfeatures=-1&start=1';

async function getGrandLyonData() {
  try {
    const response = await fetch(urlGrandLyonFull);
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

function saveJSONFile(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function generateIDFromString(str: string) {
  let idString: string = '0x';
  idString += crypto.createHash('sha1').update(str, 'binary').digest('hex');
  return Number(idString);
}

async function AddNewSport(name: string): Promise<SportEntity> {
  // check if sport already exists
  const sport = await sportRepository.findOne({
    where: {
      name: name,
    },
  });
  if (sport) {
    return sport;
  }

  // create new object
  const sportEntity = new SportEntity();
  sportEntity.id = generateIDFromString(name);
  sportEntity.name = name;

  // save to database
  sportRepository.save(sportEntity);
  return sportEntity;
}

async function main() {
  // connect to database
  await AppDataSource.initialize();
  infrastructureRepository = AppDataSource.getRepository(InfrastructureEntity);
  sportRepository = AppDataSource.getRepository(SportEntity);

  // get data from Grand Lyon API (from json file)
  const dataGrandLyon = await loadJSONFile(
    `${__dirname}/data/api_grand_lyon_2022.json`,
  );

  // get data from Data Sports 2016 (from json file)
  const dataSports2016 = await loadJSONFile(
    `${__dirname}/data/Data_sport_2016.json`,
  );
  //console.log(dataSports2016[0]);

  // log size of data
  console.log(`Grand Lyon data size: ${dataGrandLyon.nb_results}`);
  console.log(`Data Sports 2016 data size: ${dataSports2016.length}`);

  // select data with matching id
  for (let i = 0; i < dataGrandLyon.nb_results; i++) {
    const dataSports2016Item = dataSports2016[i];

    // refine id
    const id = dataSports2016Item.InsNumeroInstall;
    const idRefined = id.substring(0, id.indexOf('_'));

    const dataGrandLyonItem = dataGrandLyon.values.find(
      item => item.idexterne === idRefined,
    );
    if (dataGrandLyonItem) {
      // create new object
      const infrastructure = new InfrastructureEntity();
      infrastructure.id = dataGrandLyonItem.idexterne;
      infrastructure.coordinates = new Point(
        dataSports2016Item.EquGpsX,
        dataSports2016Item.EquGpsY,
      );
      infrastructure.creator = 'sportilize';
      infrastructure.name = dataGrandLyonItem.nom;
      infrastructure.occupiedHours = '';

      // address
      let address: string = '';
      if (dataSports2016.InsNoVoie !== '' || dataSports2016.InsNoVoie !== 0) {
        address += dataSports2016.InsNoVoie + ' ';
      }
      address += dataSports2016Item.InsLibelleVoie + ', ';
      address += dataSports2016Item.InsCodePostal + ' ';
      address += dataSports2016Item.ComLib;
      infrastructure.address = address;

      // handle sports
      const sports: SportEntity[] = [];
      const sportsGrandLyon: string = dataGrandLyonItem.ActLib;
      // TODO: finish sport handling
    }
  }
}
main();
