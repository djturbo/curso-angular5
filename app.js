'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const log4js = require('log4js');
/* log4js */
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
// rutas
const userRoutes = require('./router/user.router');
const animalRoutes = require('./router/animal.router');

// middleware de body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Configuar Headers y CORS
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Allow', 'GET, OPTIONS, PUT, POST, DELETE');
    
    next();
});

// rutas
/** Ruta para indicar que la app de angular está bajo la carpeta client bajo el mismo directorio 
 * donde se encuentra la app server
 */
app.use('/', express.static('client', {redirect: false}));
/** api/user */
app.use('/api/user', userRoutes);
/** api/animal */
app.use('/api/animal', animalRoutes)

/** Router dentro de la app de angular */
app.get('*', function(req, res, next){
    /** rutas dentro de la app */
    res.sendFile(path.resolve('client/index.html'));
    next();
});

module.exports = app;
