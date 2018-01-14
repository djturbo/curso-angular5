'user strict'
const TAG = 'animal.controller.js :: ';
const USERS_IMAGE_DIR = './uploads/users/';
const ANIMAL_IMAGE_DIR = './uploads/animals/';
/* MODULOS */
const bcrypt = require('bcrypt-nodejs');

/** File System */
const fs = require('fs');
const path = require('path');

/* MODEL */
const User = require('../model/user');
const Animal = require('../model/animal');

/* Servicios */


/* ACTIONS */
function pruebas(req, res){
	res.status(200).send({message: 'probando el controlador de animales'});
}

function save(req, res){
    var params = req.body;

    if(params.name){
        var animal = new Animal();
            animal.name =           params.name;
            animal.description =    params.description;
            animal.year =           params.year;
            animal.image =          null;
            animal.user =           req.user.sub;        
        animal.save((err, success)=>{
            if(err){
                res.status(500).send({message: 'Error guardando al animal', error: err});
            }else{
                if(success !== null){
                    res.status(200).send({message: 'Animal guardado correctamente', animal: success});
                }else{
                    res.status(200).send({message: 'No se guardó al animal debido a un error inesperado.'});
                }
            }
        });
    }
}

function findAll(req, res){
    Animal.find().populate({path: 'user'}).exec(
        (err, success) =>{
            if(err){
                res.status(500).send({message: 'Error al obtener animales', error: err});
            }else{
                if(success){
                    res.status(200).send({message: 'Animales encontrados', animales: success});
                }else{
                    res.status(500).send({message: 'Error al obtener animales', error: err});
                }
            }
        }
    );
}

function findById(req, res){
    
    Animal.findById(req.params['id']).populate({path: 'user'}).exec(
        (err, success) =>{
            if(err){
                res.status(500).send({message: 'Error al obtener al animal', error: err});
            }else{
                if(success){
                    res.status(200).send({message: 'Animal encontrad', animal: success});
                }else{
                    res.status(500).send({message: 'El animal no existe', error: err});
                }
            }
        }
    );
}

function update(req, res){
    var animalId = req.params['id'];
    var body = req.body;
    console.log('animalId: ', animalId);
    if(animalId){
        Animal.findByIdAndUpdate(animalId, body, {new: true}, (err, success)=>{
            if(err){
                res.status(500).send({message: 'Error actualizando animal'});
            }else{
                if(success){
                    res.status(200).send({message: 'Animal actualizado correctamente.', animal: success});
                }else{
                    res.status(500).send({message: 'No se actualizó el animal.'});
                }
            }
        });
    }else{
        res.status(400).send({message: 'Id de animal no válido'});
    }
}

function uploadImage(req, res){
	var animalId = req.params['id'];
	var fileName = 'No subido';

	if(req.files && req.files.image){
		console.log('req.files: ', req.files, ' req: ', req);
		var filePath = req.files.image.path;
		var fileSplit = '';
		var fileType = req.files.image.type;
		if(filePath){
			fileSplit = filePath.split('/');
		}
		if(	fileType === 'image/jpeg' ||
			fileType === 'image/png' || 
			fileType === 'image/gif'){
					Animal.findByIdAndUpdate(animalId, {image: fileSplit[2] }, {new: true}, (err, success)=>{
						if(err){
							res.status(500).send({message: 'Error al actualizar la imagen del animal', error: err});
						}else{
							if(success !== null){
								res.status(200).send({message: 'Imagen actualizada correctamente', success: success});
							}else{
								res.status(501).send({message: 'Error al actualizar la imagen del animal', error: err});
							}
						}
					});
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
		return res.status(400).send({message: 'No file received', files: req.files});
	}
}

function getAnimalImage(req, res){
	var animalId = req.params['id'];
		Animal.findById(animalId, (err, success) =>{
			if(err){
				res.status(500).send({message: 'Error obteniendo imagen', error: err});
			}else{
				// res.status(200).send({message: 'Imagen Obtenida Correctamente.', image: success.image});
				res.sendFile(path.resolve(ANIMAL_IMAGE_DIR + success.image));
			}
		});
}

function remove(req, res){
    var animalId = req.params['id'];

    if(animalId){
        Animal.findByIdAndRemove(animalId, (err, success) =>{
            if(err){
                res.status(500).send({message: 'Error al intentar borrar el animal'});
            }else{
                if(success){
                    res.status(200).send({message: 'Animal Borrado correctamente', success});
                }else{
                    res.status(400).send({message: 'Error al intentar borrar el anmial'});
                }
            }
        });
    }else{
        res.status(400).send({message: 'Error al intentar borrar el anmial'});
    }
}

module.exports = {
    pruebas,
    save,
    findAll,
    findById,
    update,
    uploadImage,
    getAnimalImage,
    remove
}