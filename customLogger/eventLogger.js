'use strict';

var Helper = require('../logger/helper');
var winston = require('winston');
var winstonRotate = require('winston-daily-rotate-file');
var _ = require('lodash');
var util = require('../common/util');

var exports = {};
const LOG_LEVEL = {
  ProduceFailedRetryQueue: 'produce_event_failed_retry_queue',
  ProduceFailedDLQ: 'produce_event_failed_dlq',
  ConsumedFailedDLQ: 'consume_event_failed_dlq'
}

const MAX_FILE_SIZE = 1024 * 1024 * 200;
const MAX_FILES = 10;
const LOG_PATH = process.env.LOG_PATH || './event_logs';

const produceEventLogger = new(winston.Logger)({
  levels: {'produceFailedEvent': 0},
  transports: [
      new (winston.transports.DailyRotateFile)({
          level: 'produceFailedEvent',
          filename: LOG_PATH + '/produceFailedEvent-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH-mm',
          zippedArchive: true,
          maxSize: util.getMaxFileSize(),
          maxFiles: util.getMaxFiles(),
          json: true,
          frequency: '15m'
      })
  ]

});

const produceFailedRetryQueueLogger = new(winston.Logger)({
    levels: {[LOG_LEVEL.ProduceFailedRetryQueue]: 0},
    transports: [
      new (winston.transports.File)({
        level: LOG_LEVEL.ProduceFailedRetryQueue,
        filename: LOG_PATH + '/event_failed_retry_queue.log',
        maxSize: util.getMaxFileSize(),
        maxFiles: util.getMaxFiles(),
        json: true,
      })
    ]
});

const produceFailedDLQLogger = new(winston.Logger)({
  levels: {[LOG_LEVEL.ProduceFailedDLQ]: 0},
  transports: [
    new (winston.transports.File)({
      level: LOG_LEVEL.ProduceFailedDLQ,
      filename: LOG_PATH + '/event_failed_dlq.log',
      maxSize: util.getMaxFileSize(),
      maxFiles: util.getMaxFiles(),
      json: true,
    })
  ]
});

const consumeFailedDLQLogger = new(winston.Logger)({
    levels: {[LOG_LEVEL.ConsumedFailedDLQ]: 0},
    transports: [
      new (winston.transports.File)({
        level: LOG_LEVEL.ConsumedFailedDLQ,
        filename: LOG_PATH + '/event_failed_dlq.log',
        maxSize: util.getMaxFileSize(),
        maxFiles: util.getMaxFiles(),
        json: true,
      })
    ]
});

const eventInfoLogger = new(winston.Logger)({
  levels: {'info': 0},
  transports: [
    new (winston.transports.DailyRotateFile)({
      level: 'info',
      filename: LOG_PATH + '/event_info-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: util.getMaxFileSize(),
      maxFiles: util.getMaxFiles(),
      json: true
    })
  ]
});

const eventErrorLogger = new(winston.Logger)({
  levels: {'error': 0},
  transports: [
    new (winston.transports.DailyRotateFile)({
      level: 'error',
      filename: LOG_PATH + '/event_error-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: util.getMaxFileSize(),
      maxFiles: util.getMaxFiles(),
      json: true
    })
  ]
  
});

const eventDebugLogger = new(winston.Logger)({
  levels: {'debug': 0},
  transports: [
    new (winston.transports.DailyRotateFile)({
      level: 'debug',
      filename: LOG_PATH + '/event_debug-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: util.getMaxFileSize(),
      maxFiles: util.getMaxFiles(),
      json: true
    })
  ]
  
});

exports.produceFailedEvent = function (indexName, data) {
  if (_.isEmpty(data) || typeof data !== 'object') return;
  let log = Helper.getLogInstance(indexName);
  log.data = data;
  produceEventLogger.produceFailedEvent(log);
};

exports.consumeFailedDLQ = function (indexName, data) {
    if (_.isEmpty(data) || typeof data !== 'object') return;
    let log = Helper.getLogInstance(indexName);
    log.data = data;
    consumeFailedDLQLogger[LOG_LEVEL.ConsumedFailedDLQ](log);
};

exports.produceFailedRetryQueue = function (indexName, data) {
    if (_.isEmpty(data) || typeof data !== 'object') return;
    let log = Helper.getLogInstance(indexName);
    log.data = data;
    produceFailedRetryQueueLogger[LOG_LEVEL.ProduceFailedRetryQueue](log);
};

exports.produceFailedDLQ = function (indexName, data) {
  if (_.isEmpty(data) || typeof data !== 'object') return;
  let log = Helper.getLogInstance(indexName);
  log.data = data;
  produceFailedDLQLogger[LOG_LEVEL.ProduceFailedDLQ](log);
};

exports.event_info = function (indexName, data) {
  if (_.isEmpty(data) || typeof data !== 'object') return;
  let log = Helper.getLogInstance(indexName);
  log.data = data;
  eventInfoLogger.info(log);
};

exports.event_error = function (indexName, data) {
  if (_.isEmpty(data) || typeof data !== 'object') return;
  let log = Helper.getLogInstance(indexName);
  log.data = data;
  eventErrorLogger.error(log);
};

exports.event_debug = function (indexName, options, data) {
  if (_.isEmpty(data) || typeof data !== 'object') return;
  let log = Helper.getLogInstance(indexName);
  log.data = data;
  if(options && _.isObject(options) && options.debug_mode) {
    eventDebugLogger.debug(log);
  }
};

module.exports = exports;
