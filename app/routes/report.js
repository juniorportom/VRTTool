'use strict'

var express = require('express');

var ReportController = require('../controllers/report');

var api = express.Router();

api.post('/report', ReportController.saveReport);
api.get('/reports/:page?', ReportController.getReports);

module.exports = api;