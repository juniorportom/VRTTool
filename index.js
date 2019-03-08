'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = 8080;


//Conexion DataBase
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/VRTTool', { /*useMongoClient: true*/ })
    .then(() => {
        console.log('La conexion de la base de datos VRTTool se realizo de forma correcta.')

        //Crear servidor
        app.listen(port, () => {
            console.log('Servidor corriendo en http://localhost:' + port);
        });
    }).catch(err => console.log(err));