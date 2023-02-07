import Redis from 'ioredis'
import _debug from "debug";
const debug = _debug("@ngochipx:chatbot");

import Logger from '@core/Logger'
const logger = Logger('Redis');


const redis = new Redis({
  port: Number(process.env.REDIS_PORT) || 6379, // Redis port
  host: process.env.REDIS_HOST || "127.0.0.1", // Redis host
  password: process.env.REDIS_PASS,
  db: Number(process.env.REDIS_DB) || 0,
});

redis.on('error', (e) => {
  logger.error(`Critical: ${e}`);
  debug(`Critical: Redis ERR: ${e}`);
  throw e;
})

export default redis
