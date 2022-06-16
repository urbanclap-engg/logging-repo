'use strict';

var Helper = require('./helper');
var winston = require('winston');
var _ = require('lodash');
var util = require('../common/util');

var exports = {};
const LOG_LEVEL = {
    INFO: 'info',
    ERROR: 'error',
    WARNING: 'warning',
    DEBUG: 'debug',
    SYSTEM: 'system',
    APP_INFO: 'app_info',
    APP_ERROR: 'app_error'
};

const MAX_FILE_SIZE = 1024 * 1024 * 50;
const MAX_FILES = 10;
const LOG_PATH = process.env.LOG_PATH || '.';

const infoLogger = new (winston.Logger)({
    levels: {'info': 0},
    transports: [
        new (winston.transports.File)({
            level: 'info',
            filename: LOG_PATH + '/info.log',
            maxsize: util.getMaxFileSize(),
            maxFiles: util.getMaxFiles(),
            json: true,
        })
    ]
});

const debugLogger = new (winston.Logger)({
    levels: {'debug': 0},
    transports: [
        new (winston.transports.File)({
            level: 'debug',
            filename: LOG_PATH + '/debug.log',
            maxsize: util.getMaxFileSize(),
            maxFiles: util.getMaxFiles(),
            json: true,
        })
    ]
});


const errorLogger = new (winston.Logger)({
    levels: {'error': 0},
    transports: [
        new (winston.transports.File)({
            level: 'error',
            filename: LOG_PATH + '/error.log',
            maxsize: util.getMaxFileSize(),
            maxFiles: util.getMaxFiles(),
            json: true,
        }),
        new (winston.transports.Console)({level: 'error'})
    ]
});


exports.info = function (indexName, data) {
    if (_.isEmpty(data)) return;
    if (typeof data === 'string') data = {message: data};
    let log = Helper.getLogInstance(indexName);
    log.data = data;
    infoLogger.info(log);
};

exports.debug = function (indexName, options, data) {
    if (_.isEmpty(data)) return;
    if (typeof data === 'string') data = {message: data};
    let log = Helper.getLogInstance(indexName);
    log.data = data;
    if(options && _.isObject(options) && options.debug_mode) {
        debugLogger.debug(log);
    }
};

exports.error = function (indexName, data) {
    if (_.isEmpty(data)) return;
    if (typeof data !== 'object') data = {message: data};
    let log = Helper.getLogInstance(indexName);
    log.data = data;
    errorLogger.error(log);
};

exports.exitAfterFlush = function() {
    errorLogger.transports.file.on('flush', function () {
        errorLogger.error('flushing error logs');
    });
    infoLogger.transports.file.on('flush', function () {
        infoLogger.info('flushing info logs');
    });
    debugLogger.transports.file.on('flush', function () {
        debugLogger.debug('flushing debug logs');
    });


};

module.exports = exports;
