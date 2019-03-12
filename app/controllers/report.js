'use strict'

var Report = require('../models/report');

var ResCompare = require('./resemble-compare');

var bcrypt = require('bcrypt-nodejs');

var path = require('path');

var fs = require('fs');

const { exec } = require('child_process');

const cy = require('cypress');

var mongoosePaginate = require('mongoose-pagination');

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
    var report = new Report();
    report.image1 = nameFile(req.files.image1);
    report.image2 = nameFile(req.files.image2);
    let name = new Date().getTime() + '-diff.png';
    console.log('este es el nombre: ' + name);
    let imageWithDiff = 'app/uploads/reports/' + name;
    ResCompare.getDiff(req.files.image1.path, req.files.image2.path, imageWithDiff);
    report.imageDiff = name;
    report.date = Date.now();
    report.create_at = Date.now(); //moment().unix();

    report.save((error, reportStored) => {
        if (error) return res.status(500).send({ message: 'Error al guardar el reporte' });

        if (!reportStored) return res.status(404).send({ message: 'El reporte no ha sido guardado' });

        return res.status(200).send({ report: reportStored });
    });
}

function autoSaveReport(req, res) {
    exec('npx cypress run', (err, stdout, stderr) => {
        if (err) {
            console.log(error);
            return;
        }

        let longTime = new Date().getTime();
        var report = new Report();
        let path_cypress = 'cypress/screenshots/palette/collors_palette_spec.js/';
        let path_imgs = 'app/uploads/reports/';
        let img1 = 'palette-1.png';
        let img2 = 'palette-2.png';
        let imgDiff = longTime + '_diff.png';

        fs.rename(path.join(path_cypress, img1), path.join(path_imgs, longTime + img1), (err) => {
            if (err) throw err;
            console.log('Se renombra imagen 1');
        });

        fs.rename(path.join(path_cypress, img2), path.join(path_imgs, longTime + img2), (err) => {
            if (err) throw err;
            console.log('Se renombra imagen 2');
        });

        ResCompare.getDiff(path_imgs + longTime + img1, path_imgs + longTime + img2, path_imgs + imgDiff);

        report.image1 = longTime + img1;
        report.image2 = longTime + img2;
        report.imageDiff = imgDiff;
        report.date = Date.now();
        report.create_at = Date.now(); //moment().unix();

        report.save((error, reportStored) => {
            if (error) return res.status(500).send({ message: 'Error al guardar el reporte' });

            if (!reportStored) return res.status(404).send({ message: 'El reporte no ha sido guardado' });

            return res.status(200).send({ report: reportStored });
        });
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
        //console.log(pathImage);
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
    getImageFile,
    autoSaveReport
}