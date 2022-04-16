import fetch, { RequestInit } from 'node-fetch-commonjs';
import fs from 'fs';
import { Point } from 'geojson';
import crypto from 'crypto';
import { Repository } from 'typeorm';
import { json } from 'body-parser';

import { InfrastructureEntity } from '../src/databaseEntities/InfrastructureEntity';
import { SportEntity } from '../src/databaseEntities/SportEntity';
import { AppDataSource } from '../src/data-source';

// global variables
let infrastructureRepository: undefined | Repository<InfrastructureEntity> =
  undefined;
let sportRepository: undefined | Repository<SportEntity> = undefined;
let allSports: SportEntity[] = [];
let allInfrastructures: InfrastructureEntity[] = [];

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

function generateCryptoIDFromString(str: string): BigInt {
  let idString: string = '0x';
  idString += crypto.createHash('sha1').update(str, 'binary').digest('hex');
  return BigInt(idString);
}

function sumAscii(str: string): number {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    // add the ASCII value of the
    // character at the current position
    sum += str.charCodeAt(i);
  }
  return sum;
}

function INTmoduloMariaDB(nb: number): number {
  // MariaDB INT: range is -2147483648 to 2147483647
  // modulo by 2147483648
  return nb % 2147483648;
}

function generateSimpleIDFromString(str: string): number {
  let id = sumAscii(str);
  return INTmoduloMariaDB(id);
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
  sportEntity.id = generateSimpleIDFromString(name);
  sportEntity.name = name;

  // save to database
  sportRepository.save(sportEntity);
  return sportEntity;
}

function AddNewSportInArray(name: string): SportEntity {
  // check if sport already exists
  const sport = allSports.find(item => item.name === name);
  if (sport) {
    return sport;
  }

  // create new object
  const sportEntity = new SportEntity();
  sportEntity.id = generateSimpleIDFromString(name);
  sportEntity.name = name;

  // add sport to array
  allSports.push(sportEntity);
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
  let counter = 0;
  for (let i = 0; i < dataGrandLyon.nb_results; i++) {
    const dataGrandLyonItem = dataGrandLyon.values[i];

    // refine id
    const id = dataGrandLyonItem.idexterne;
    if (!id) continue;
    //const idRefined = id.substring(0, id.indexOf('_'));
    const dataSports2016Item = dataSports2016.find(
      item => item.InsNumeroInstall + '_' + item.EquipementId === id,
    );

    if (dataSports2016Item) {
      counter++;
      // create new object
      const infrastructure = new InfrastructureEntity();
      infrastructure.creator = 'sportilize';
      infrastructure.name = dataGrandLyonItem.nom;
      infrastructure.occupiedHours = '';

      // id manipulation
      const idStringConcat: string =
        dataSports2016Item.InsNumeroInstall + dataSports2016Item.EquipementId;
      infrastructure.id = INTmoduloMariaDB(parseInt(idStringConcat));

      // new geojson Point
      const point: Point = {
        type: 'Point',
        coordinates: [dataSports2016Item.EquGpsX, dataSports2016Item.EquGpsY],
      };
      infrastructure.point = JSON.stringify(point);

      // address
      let address: string = '';
      if (
        dataSports2016Item.InsNoVoie !== '' ||
        dataSports2016Item.InsNoVoie !== 0
      ) {
        address += dataSports2016Item.InsNoVoie + ' ';
      }
      address += dataSports2016Item.InsLibelleVoie + ', ';
      address += dataSports2016Item.InsCodePostal + ' ';
      address += dataSports2016Item.ComLib;
      infrastructure.address = address;

      // handle sports
      const sports: SportEntity[] = [];
      const sportsString: string = dataSports2016Item.ActLib;

      // separate string by ',' or '/', and add to database
      const sportsArray: string[] = sportsString.split(/[,\/]/);
      for (let j = 0; j < sportsArray.length; j++) {
        const sportName = sportsArray[j];
        if (sportName !== '') {
          const sport = AddNewSportInArray(sportName);
          sports.push(sport);
        }
      }
      infrastructure.sports = sports;

      // keep track of added data for stats
      allInfrastructures.push(infrastructure);

      // log
      //console.log(JSON.stringify(infrastructure, null, 2), 'utf8');
    }
  }

  // save allSports to database
  let counterSportsSaved = 0;
  for (let i = 0; i < allSports.length; i++) {
    try {
      await sportRepository.save(allSports[i]);
      counterSportsSaved++;
    } catch (error) {
      if (error.name === 'ER_DUP_ENTRY') {
        console.log(`${allSports[i].name} already exists in database`);
      } else {
        console.log(error);
      }
    }
  }

  // save allInfrastructures to database
  let counterInfrastructuresSaved = 0;
  for (let i = 0; i < allInfrastructures.length; i++) {
    try {
      await infrastructureRepository.save(allInfrastructures[i]);
      counterInfrastructuresSaved++;
    } catch (error) {
      console.log(error);
    }
  }

  // log stats
  console.log(`########## STATS ##########`);
  console.log(`+++ ${counterSportsSaved} sports added`);
  console.log(`+++ ${counterInfrastructuresSaved} infrastructures added`);
  console.log(`>>> ${counter} items matched`);
  console.log(`>>> Infrastructures: ${allInfrastructures.length}`);
  console.log(`>>> Sports: ${allSports.length}`);

  // exit
  process.exit(0);
}
main();
