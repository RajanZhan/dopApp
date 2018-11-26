const log4js = require("log4js");
const path = require('path');

log4js.configure({
    appenders: {
        everything: {
            type: 'dateFile',
            filename: process.cwd() + '/logs/all-the-logs.log',
            maxLogSize: 1048576,
            backups: 3,
            compress: true
        }
    },
    categories: {
        default: {
            appenders: ['everything'],
            level: 'debug'
        }
    }
});

const logger = log4js.getLogger('log4jslog');

module.exports = {
    error: (msg) => {
        logger.error(msg);
    },
    trace: (msg) => {
        logger.trace(msg);
    },
    info: (msg) => {
        logger.info(msg);
    },
    trace: (msg) => {
        logger.trace(msg);
    },
    debug: (msg) => {
        logger.debug(msg);
    },
    warn: (msg) => {
        logger.warn(msg);
    },
    fatal: (msg) => {
        logger.fatal(msg);
    },
}
