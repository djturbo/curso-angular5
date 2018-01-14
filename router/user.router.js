'use strict'

const express = require('express');
const userController = require('../controller/user.controller');

const multiPart = require('connect-multiparty');
const uploadMidleware = multiPart({uploadDir: './uploads/users'});

const api = express.Router();

const authMidleware = require('../midleware/authenticate.midleware');

api.post('/', userController.save);
api.post('/login', userController.login);
api.put('/update/:id', authMidleware.ensureAuth, userController.update);
api.post('/image/:id', [authMidleware.ensureAuth, uploadMidleware], userController.uploadImage);
api.get('/image/:id', userController.getUserImage);
api.get('/keepers', userController.getKeepers);
module.exports = api;
