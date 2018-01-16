'use strict'

// const logger = require('./log4js.configuration');

var mongoose = require('mongoose');
var app = require('./app');

var port = process.env.PORT || 1111;
// logger.debug('puerto: ', port);
// logger.debug('conectando con la base de datos mongodb');
mongoose.connect('mongodb://localhost:27017/zoo', (err, res) =>{
	if(err){
		console.log('Error al conectar con la base de datos: ', err);
	}else{
		console.log('conexión realizado correctamente');
		app.listen(port, () =>{
			console.log('Server running at port: ', port);
		});
	}
});