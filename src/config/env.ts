import { config } from "dotenv";

config();

const env = {
  SERVER_PORT: Number(process.env.SERVER_PORT),
  DB: {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASS,
    NAME: process.env.DB_NAME,
    PORT: Number(process.env.DB_PORT),
    TEST: {
      HOST: process.env.DB_HOST_TEST,
      USER: process.env.DB_USER_TEST,
      PASSWORD: process.env.DB_PASS_TEST,
      NAME: process.env.DB_NAME_TEST,
      PORT: Number(process.env.DB_PORT_TEST),
    },
  },
  LOG_FILE: process.env.LOG_FILE
};

export default env;
