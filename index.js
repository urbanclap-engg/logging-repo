'use strict';
let LogHelper = require('./logger');
let CustomLogger = require('./customLogger');
let Logger = {};
Logger.initLogger = function (indexName) {
    return {
        info: function (data) {
            LogHelper.info(indexName, data);
        },
        error: function (data) {
            LogHelper.error(indexName, data);
        },
        debug: function (options, data) {
            LogHelper.debug(indexName, options, data);
        },
        exitAfterFlush:function () {
            LogHelper.exitAfterFlush()
        }
    }
};

Logger.initEventCustomLogger = function(indexName) {
  return {
      produceFailedEvent: function(data) {
        CustomLogger.eventLogger.produceFailedEvent(indexName, data);
      },
      produceFailedRetryQueue: function(data) {
          CustomLogger.eventLogger.produceFailedRetryQueue(indexName, data);
      },
      produceFailedDLQ: function(data) {
        CustomLogger.eventLogger.produceFailedDLQ(indexName, data);
      },
      consumeFailedDLQ: function(data) {
          CustomLogger.eventLogger.consumeFailedDLQ(indexName, data);
      },
      info: function (data) {
          CustomLogger.eventLogger.event_info(indexName, data);
      },
      error: function (data) {
          CustomLogger.eventLogger.event_error(indexName, data);
      },
      debug: function (data, options) {
          CustomLogger.eventLogger.event_debug(indexName, options, data);
      }
  }
};
module.exports = Logger;
