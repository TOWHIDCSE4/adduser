const winston = require('winston');
//const { createLogger, format, transports }
const { combine, timestamp, printf, prettyPrint, splat, simple } = winston.format;
require('winston-daily-rotate-file');
const logConfig = require("@config/logger").default;
const myFormat = printf(info => {
  // you can get splat attribue here as info[Symbol.for("splat")]
  // if you custome splat please rem splat() into createLogger()
  return `${info.timestamp} ${info.level}: ${JSON.stringify(info.message, null)}`;
});

const Logger = (folderName, options = {}) => {
  let path = logConfig.DIRNAME
  if (folderName) path += `${folderName}/`

  let transportOptions = {
    dirname: path,
    datePattern: logConfig.DATE_PATTERN,
    zippedArchive: false,
    maxSize: logConfig.MAXSIZE,
    maxFiles: logConfig.MAXFILES
  }

  const logger = winston.createLogger({
    level: 'info',
    //format: winston.format.json(),
    format: combine(
      timestamp(),
      splat(),
      //prettyPrint(),
      myFormat
    ),
    transports: [
      new (winston.transports.DailyRotateFile)({ filename: `%DATE%-error.log`, level: 'error', ...transportOptions }),
      new (winston.transports.DailyRotateFile)({ filename: `%DATE%-info.log`, level: 'info', ...transportOptions }),
    ],
    ...options
  });

  return logger
}

export default Logger
