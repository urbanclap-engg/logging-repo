'use strict';

var Constants = require('./constants');

let Util = {};

Util.getMaxFileSize = function () {
  return process.env.MAX_FILE_SIZE || Constants.MAX_FILE_SIZE;
};

Util.getMaxFiles = function () {
  return process.env.MAX_FILES || Constants.MAX_FILES;
};

module.exports = Util;