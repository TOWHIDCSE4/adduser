import Redis from 'ioredis'
import _debug from "debug";
const debug = _debug("@ngochipx:chatbot");

import Logger from '@core/Logger'
const logger = Logger('Redis');


const Pub = new Redis({
  port: Number(process.env.REDIS_PORT) || 6379, // Redis port
  host: process.env.REDIS_HOST || "127.0.0.1", // Redis host
  password: process.env.REDIS_PASS,
  db: Number(process.env.REDIS_DB) || 0,
});

const Sub = new Redis({
  port: Number(process.env.REDIS_PORT) || 6379, // Redis port
  host: process.env.REDIS_HOST || "127.0.0.1", // Redis host
  password: process.env.REDIS_PASS,
  db: Number(process.env.REDIS_DB) || 0,
});

Pub.on('error', (e) => {
  logger.error(`Critical: ${e}`);
  debug(`Critical: Redis ERR: ${e}`);
  throw e;
})

Sub.on('error', (e) => {
  logger.error(`Critical: Redis ERR: ${e}`);
  debug(`Critical: ${e}`);
  throw e;
})

export {
  Pub,
  Sub
}
