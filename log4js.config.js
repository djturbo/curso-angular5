const log4js = require('log4js');

const log = log4js.getLogger("server");

log4js.configure(require('./log4js.config.json'));
   

module.exports = log;