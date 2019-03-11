'use strict'

var Report = require('../models/report');

var bcrypt = require('bcrypt-nodejs');

var path = require('path');

var fs = require('fs');

//var jwt = require('../services/jwt');

var mongoosePaginate = require('mongoose-pagination');

//var fs = require('fs');  // Libreria de file systemn de Node

//var path = require('path');  //Libreria para el manejo de rutas

function home(req, res) {
    res.status(200).send({
        message: 'Hola mundo desde el servidor de NodeJS'
    });
}

function nameFile(file) {
    var filePath = file.path;
    var fileSplit = filePath.split(/[\\/]/);
    var fileName = fileSplit.pop();
    return fileName;
}


// Registro de reporte
function saveReport(req, res) {
    var params = req.body;
    var report = new Report();

    console.log('estoy aca!!!!!!!!!!!!!!!!!!');

    console.log(req.body);
    console.log(req.files);



    report.image1 = nameFile(req.files.image1);
    report.image2 = nameFile(req.files.image2);
    report.imageDiff = nameFile(req.files.imageDiff);
    report.date = Date.now();
    report.create_at = Date.now(); //moment().unix();

    report.save((error, reportStored) => {
        if (error) return res.status(500).send({ message: 'Error al guardar el reporte' });

        if (!reportStored) return res.status(404).send({ message: 'El reporte no ha sido guardado' });

        return res.status(200).send({ report: reportStored });
    });
}

function getReports(req, res) {
    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 20;

    Report.find().sort([
            ['created_at', -1]
        ])
        .paginate(page, itemsPerPage, (error, reports, total) => {
            if (error) return res.status(500).send({ message: 'Error obteniendo los reportes' });

            if (!reports) return res.status(404).send({ message: 'No hay reportes' });

            return res.status(200).send({
                reports,
                totalItems: total,
                page: page,
                pages: Math.ceil(total / itemsPerPage),
                itemsPerPage: itemsPerPage
            });
        });
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var pathImage = 'app/uploads/reports/' + imageFile;
    fs.exists(pathImage, (exists) => {
        console.log(pathImage);
        if (exists) {
            return res.sendFile(path.resolve(pathImage));
        } else {
            return res.status(404).send({ message: 'No existe la imagen ...' });
        }
    });
}

module.exports = {
    saveReport,
    getReports,
    getImageFile
}