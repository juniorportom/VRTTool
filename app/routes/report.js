'use strict'

var express = require('express');

var ReportController = require('../controllers/report');

var multipart = require('connect-multiparty');

var mdUpload = multipart({ uploadDir: 'app/uploads/reports' });

var api = express.Router();

api.post('/report', mdUpload, ReportController.saveReport);
api.post('/auto-report', ReportController.autoSaveReport);
api.get('/reports/:page?', ReportController.getReports);
api.get('/get-image/:imageFile', ReportController.getImageFile);

module.exports = api;