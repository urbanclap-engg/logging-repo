'use strict';
var uuidV1 = require('uuid/v1');
var _ = require('lodash');

var logPath = process.env.LOG_PATH || process.cwd();
var environment = process.env.SERVER_ENV;
var deploymentTag = process.env.LOGGER_DEPLOYMENT_TAG || 'NA';
var instanceTag = process.env.LOGGER_INSTANCE_TAG || 'NA';
var machineIp = process.env.LOGGER_MACHINE_IP || 'NA';

var Helper = {};

Helper.getLogInstance = function(indexName) {
    let data = {};
    data.index_name = indexName;
    data.uuid = uuidV1();
    data.deployment_tag = deploymentTag;
    data.instance_tag = instanceTag;
    data.machine_ip = machineIp;
    return data;
}

Helper.createApiSuccessLog = function (response, extra) {
	var request = response.req;
  if (!request) {
  	return null;
  }
  if (!_.isEmpty(request.headers)) {
    extra.device = request.headers['x-device-os'] || 'none';
  }
	return _.extend({}, getApiRequestData(request), getApiResponseData(extra));
}

Helper.createApiErrorLog = function (response, extra, error) {
	var request = response.req;
  if (!request) {
  	return null;
  }
	if (!_.isEmpty(request.headers)) {
    extra.device = request.headers['x-device-os'] || 'none';
  }
	return _.extend({}, getApiRequestData(request), getApiResponseData(extra), getApiErrorData(error));
}

function getApiRequestData (request) {
	let data = {};

  if (!_.isUndefined(request._startTime)) {
    data.api_time = Number(new Date() - request._startTime);
  }

  if (!_.isUndefined(request.originalUrl)) {
    data.api_name = request.originalUrl;
  }

  if (!_.isEmpty(request.headers)) {
    data.user_agent = request.headers['user-agent'];
    data.version_name = request.headers['x-version-name'];
    data.version_code = request.headers['x-version-code'];
  }

  if (!_.isUndefined(request.baseUrl) && !_.isUndefined(_.get(request, 'route.path'))) {
    data.api_path_route = request.baseUrl + request.route.path;
  }

  if (!_.isUndefined(request.method)) {
    data.method = request.method;
  }
  return data;
}

function getApiResponseData(extra) {
	let data = {};
	
	if (!extra) {
    return data;
	}

  if (!_.isUndefined(extra.statusCode)) {
    data.status_code = extra.statusCode;
  }

  if (!_.isUndefined(extra.apiDeprecate)) {
    data.api_deprecate = extra.apiDeprecate;
  }

  if (!_.isUndefined(extra.logType)) {
    data.log_type = extra.log_type;
  }

  if (!_.isUndefined(extra.device)) {
    data.device = extra.device;
  }

  return data;
}

function getApiErrorData(error) {
	let data = {};
	
	if (_.isEmpty(error)) {
    return data;
  }

  if (!_.isUndefined(error.message)) {
    data.err_message = error.message;
  }

  if (!_.isUndefined(error.stack)) {
    data.err_stack = error.stack;
  }

  return data;
}
module.exports = Helper;
