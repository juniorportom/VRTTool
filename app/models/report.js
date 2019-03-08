'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var reportSchema = Schema({
    image1: String,
    image2: String,
    imageDiff: String,
    date: Date,
    create_at: String
});

module.exports = mongoose.model('Report', reportSchema);