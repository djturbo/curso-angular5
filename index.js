'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 1111;

mongoose.connect('mongodb://localhost:27017/zoo', (err, res) =>{
	if(err){
		throw err;
	}else{
		console.log('conexión realizado correctamente');
		app.listen(port, () =>{
			console.log('Server running at port: ', port);
		});
	}
});