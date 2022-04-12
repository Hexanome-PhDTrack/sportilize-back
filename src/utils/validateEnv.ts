import { cleanEnv, port } from 'envalid';
import dotenv from 'dotenv';
dotenv.config();

function validateEnv() {
  cleanEnv(process.env, {
    PORT: port(),
  });
}

export default validateEnv;
