const log4js = require('log4js');

log4js.configure(require('./log4js.config.json'));
const log = log4js.getLogger("server");

module.exports = log;