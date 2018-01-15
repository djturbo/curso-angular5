const log4js = require('log4js');
log4js.configure({
	appenders: { zoo: { type: 'file', filename: 'zoo.log' } },
	categories: { default: { appenders: ['zoo'], level: 'error' } },
	disableClustering: true
});
   
const logger = log4js.getLogger('zoo');
logger.level = 'debug';
module.exports = logger;