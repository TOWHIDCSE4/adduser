import Queue from 'bull'
import _ from 'lodash'
import Oraq from 'oraq'
import _debug from "debug";
const debug = _debug("@ngochipx:bull");

import Logger from '@core/Logger'
const logger = Logger('Bull');


const defaultOptions = {
  redis: {
    port: Number(process.env.REDIS_PORT) || 6379, // Redis port
    host: process.env.REDIS_HOST || "127.0.0.1", // Redis host
    password: process.env.REDIS_PASS,
    db: Number(process.env.REDIS_DB) || 0,
  }
}

class Bull {
  static queues = {}
  static createQueue(name, options = {}) {
    this.queues[name] = new Queue(name, _.merge({}, defaultOptions, options));
    this.queues[name].on("error", (e) => {
      logger.error("Critical:", e)
      debug(`Critical: Bull ERR:  ${e}`)
    });
    return this.queues[name];
  }

  static getQueue(name) {
    return this.queues[name]
  }

  static createLimiter(name, concurrency = 1) {
    return new Oraq({
      id: name,
      connection: defaultOptions.redis,
      concurrency: concurrency,
    });
  }
}

export default Bull
