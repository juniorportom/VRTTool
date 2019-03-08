'use strict'

var express = require('express');

var ReportController = require('../controllers/report');

var api = express.Router();

api.post('/report', ReportController.saveReport);
api.get('/reports/:page?', ReportController.getReports);
api.get('/get-image/:imageFile', ReportController.getImageFile);

module.exports = api;