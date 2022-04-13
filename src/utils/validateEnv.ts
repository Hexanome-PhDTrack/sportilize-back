import { cleanEnv, port, str } from 'envalid';
import dotenv from 'dotenv';
dotenv.config();

function validateEnv() {
  cleanEnv(process.env, {
    PORT: port(),

    //database
    DATABASE_HOST: str(),
    DATABASE_PORT: port(),
    DATABASE_USERNAME: str(),
    DATABASE_PASSWORD: str(),
    DATABASE_NAME: str(),
  });
}

export default validateEnv;
