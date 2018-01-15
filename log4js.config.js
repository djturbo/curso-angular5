const log4js = require('log4js');
log4js.configure({
	appenders: { zoo: { type: 'file', filename: 'zoo.log' } },
	categories: { default: { appenders: ['zoo'], level: 'error' } }
  });
   
const logger = log4js.getLogger('zoo');
module.exports = logger;