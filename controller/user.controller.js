'user strict'
const TAG = 'user.controller.js :: ';
const USERS_IMAGE_DIR = './uploads/users/';
const logger = require('./log4js.config');

/* MODULOS */
const bcrypt = require('bcrypt-nodejs');

/** File System */
const fs = require('fs');
const path = require('path');

/* MODEL */
const User = require('../model/user');

/* Servicios */
const jwt = require('../service/jwt.service');


/* ACTIONS */
function pruebas(req, res){
	res.status(200).send({message: 'probando el controlador de usuarios'});
}

function save(req, res){
	
	var params = req.body;
	logger.debug('user.controller :: save() params: ', params);
	if(params.password && params.name && params.surname && params.email){
		var user = new User();
		user.name = params.name;
		user.surname = params.surname;
		user.email = params.email.toLowerCase();
		user.role = 'ROLE_USER';
		user.image = null;

		/* Check if user exist */
		User.findOne({email: user.email.toLowerCase()}, (err, userExist) =>{
			logger.info(TAG, 'saved user: ', userExist);
			if(err){
				res.status(403).send({message: 'Error guardando el usuario.', error: err});
			}else{
				if(userExist === null){
					/** CIFRADO PASSWORD */
					bcrypt.hash(params.password, null, null, function(err, hash){
						user.password = hash;
						user.save((err, userStored) =>{
							if(err){
								logger.error(this.TAG, 'save() error: ', err);
								res.status(500).send({message: 'Error al guardar al usuario'});
							}else{
								if(!userStored){
									res.status(501).send({message: 'No se ha registrado el usuario'});
								}else{
									res.status(200).send({message: 'Usuario registrado correctamente', user: userStored});
								}
							}
						});
					});
				}else{
					res.status(403).send({message: 'Usuario ya existente.'});
				}
			}
		});
	}else{
		res.status(403).send({message: 'Por favor introduzca los datos correctos.'});
	}

	console.log('parametros: ', params);
	
	//res.status(200).send({message: 'save user method'});
}


function update(req, res) {
	var body = req.body;
	delete body.password;
	var userId = req.params['id'];
	console.log('body: ', body, ' userId: ', userId, ' req.user: ', req.user);
	if(userId !== req.user.sub){
		res.status(403).send('Operation not alowed.');
	}else{		
		User.findByIdAndUpdate(userId, body, {new: true}, (err, success) =>{
			if(err){
				res.status(500).send({message: 'Error al actualizar el usuario', error: err});
			}else{
				if(success !== null){
					res.status(200).send({message: 'Usuario actualizado.', user: success});
				}else{
					res.status(500).send({message: 'Error al actualizar el usuario', error: err});
				}
			}
		});	
	}
}

function uploadImage(req, res){
	var userId = req.params['id'];
	var fileName = 'No subido';

	if(req.files && req.files.image){
		console.log('req.files: ', req.files);
		var filePath = req.files.image.path;
		var fileSplit = '';
		var fileType = req.files.image.type;
		if(filePath){
			fileSplit = filePath.split('/');
		}
		if(	fileType === 'image/jpeg' ||
			fileType === 'image/png' || 
			fileType === 'image/gif'){
				if(userId !== req.user.sub){
					res.status(403).send('Operation not alowed.');
				}else{
					User.findByIdAndUpdate(userId, {image: fileSplit[2] }, {new: true}, (err, success)=>{
						if(err){
							res.status(500).send({message: 'Error al actualizar la imagen del usuario', error: err});
						}else{
							if(success !== null){
								res.status(200).send({message: 'Imagen actualizada correctamente', success: success});
							}else{
								res.status(501).send({message: 'Error al actualizar la imagen del usuario', error: err});
							}
						}
					});
				}
			}else{
				fs.unlink(filePath, (err, success) =>{
					if(err){
						res.status(400).send({message: 'Error eliminando el fichero no válido.', error: err});
					}else{
						res.status(400).send({message: 'Fichero eliminado, el fichero que intenta subir, no es válido'});
					}
				});
			}
	}else{
		 res.status(400).send({message: 'No file received', files: req.files});
	}
}

function getUserImage(req, res){
	var userId = req.params['id'];
	//if(userId === req.user.sub){
		User.findById(userId, (err, success) =>{
			if(err){
				res.status(500).send({message: 'Error obteniendo imagen', error: err});
			}else{
				// res.status(200).send({message: 'Imagen Obtenida Correctamente.', image: success.image});
				res.sendFile(path.resolve(USERS_IMAGE_DIR + success.image));
			}
		});
	//}else{
	//	res.status(403).send({message: 'Not Allowed Action.'});
	//}	
}

function login(req, res) {
	var params = req.body;
	console.log(TAG, 'login() params: ', params);
	User.findOne({email: params.email.toLowerCase()}, (err, success) =>{
		if(err){
			res.status(500).send({message: 'Error not user found', error: err});
		}else{
			if(success === null){
				res.status(401).send({message: 'Usuario no encontrado'});
			}else{
				bcrypt.compare(params.password.trim(),success.password, (err, check) =>{
					if(err){
						res.status(500).send({message: 'Error al comparar contraseñas', error: err});
					}else{
						console.log(TAG, 'login :: check: ', check);
						if(check){
							var userNoPassword = success;
							userNoPassword.password = '';
							res.status(200).send({message: 'Usuario encontrado', token: jwt.createToken(success), user: userNoPassword});
						}else{
							res.status(401).send({message: 'Contraseña inválida'});
						}
					}
				});
			}
		}
	});
}

function getKeepers(req, res){
	User.find({role: 'ROLE_ADMIN'}).exec((err, success)=>{
		if(err){
			res.status(500).send({message: 'Error al buscar Cuidadores'});
		}else{
			if(success){
				res.status(200).send({message: 'Lista de cuidadores', users: success});
			}else{
				res.status(200).send({message: 'No hay cuidadores'});
			}
		}
	});
	
}

module.exports = {
		pruebas,
		save,
		login,
		update,
		uploadImage,
		getUserImage,
		getKeepers
};