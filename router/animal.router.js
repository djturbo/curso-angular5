'use strict'

const express = require('express');
const animalController = require('../controller/animal.controller');

const multiPart = require('connect-multiparty');
const uploadMidleware = multiPart({uploadDir: './uploads/animals'});

const api = express.Router();

const authMidleware = require('../midleware/authenticate.midleware');
const isAdminMidleware = require('../midleware/is-admin.midleware');

api.post('/', [authMidleware.ensureAuth, isAdminMidleware.isAdmin], animalController.save);
api.get('/', animalController.findAll);
api.get('/:id', animalController.findById);
api.put('/:id', [authMidleware.ensureAuth, isAdminMidleware.isAdmin], animalController.update);
api.post('/image/:id', [authMidleware.ensureAuth, uploadMidleware, isAdminMidleware.isAdmin], animalController.uploadImage);
api.get('/image/:id', animalController.getAnimalImage);
api.delete('/:id', [authMidleware.ensureAuth, isAdminMidleware.isAdmin], animalController.remove);
module.exports = api;