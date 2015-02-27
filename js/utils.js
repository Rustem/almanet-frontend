/**
 * @jsx React.DOM
 */
'use strict';

var _ = require('lodash');
var Fuse = require('./libs/fuse');
var cookie_tool = require('cookie');
var superagent = require('superagent');
var moment = require('moment-timezone');

var SA_URL_PREFIX   = require('./constants/CRMConstants').SA_URL_PREFIX;


function get_constants(object_name) {
  var AppCommonStore = require('./stores/AppCommonStore');
  return AppCommonStore.get_constants(object_name);
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

_.mixin({'capitalize': capitalize});


function timeToSeconds(time) {
  var parts = time.split(':');
  return (+parts[0]) * 3600 + (+parts[1]) * 60;
}

function formatTime(object) {
  // TODO get tz from AppCommonStore
  return moment(object.date_created).tz('Asia/Almaty').format('h:mm, D MMM YY');
};

function extractIds(object_list) {

    function __g(object) {
        return object.id
    }

    return _.map(object_list, __g);
};

function mergeInto(dst, src) {
  if (src != null) {
    for (var k in src) {
      if (!src.hasOwnProperty(k)) {
        continue;
      }
      dst[k] = src[k];
    }
  }
}

function merge(a, b) {
  var result = {};
  if (a) {
    mergeInto(result, a);
  }
  if (b) {
    mergeInto(result, b);
  }
  return result;
}

function invariant(condition, message) {
  if (!condition) {

    throw new Error(message || 'invariant violation');
  }
}

function emptyFunction() {

}

emptyFunction.thatReturnsTrue = function() {
  return true;
};

emptyFunction.thatReturnsArgument = function(arg) {
  return arg;
};

var toString = Object.prototype.toString;

function isString(o) {
  return toString.call(o) === '[object String]';
}

String.prototype.interpolate = function(props) {
    return this.replace(/\{(\w+)\}/g, function(match, expr) {
        return (props || window)[expr];
    });
};

function fuzzySearch(collection, search_str, options) {
  if(options === undefined) {
      options = {};
  }
  options = _.extend({}, {
      'keys': []
  }, options);
  var searchOptions = {
      keys: options['keys']
  };

  var f = new Fuse(collection, searchOptions);
  collection = f.search(search_str);
  return collection;
};

function isCompany(object) {
  var AppCommonStore = require('./stores/AppCommonStore'),
      CONTACT_TYPES = AppCommonStore.get_constants('contact').tp_hash;
  return (object.tp == CONTACT_TYPES.COMPANY);
};

function isCold(contact) {
  var AppCommonStore = require('./stores/AppCommonStore'),
      CONTACT_STATUSES = AppCommonStore.get_constants('contact').statuses_hash;
  return (contact.status == CONTACT_STATUSES.NEW);
};

function request(method, url) {
  var _request = superagent(method.toUpperCase(), url)
      .use(SA_URL_PREFIX)
      .type('json')
      .withCredentials();

  if ('POST PUT DELETE PATCH'.indexOf(method.toUpperCase()) != -1)
    return _request
      .set('X-CSRFToken', cookie_tool.parse(document.cookie).csrftoken);
  else
    return _request;
};

function requestGet(url) {
  return request('GET', url);
};

function requestPost(url) {
  return request('POST', url);
};

function requestPatch(url) {
  return request('PATCH', url);
};

function requestPut(url) {
  return request('PUT', url);
};

function requestDelete(url) {
  return request('DELETE', url);
};


module.exports = {
  get_constants: get_constants,
  extractIds: extractIds,
  mergeInto: mergeInto,
  merge: merge,
  invariant: invariant,
  emptyFunction: emptyFunction,
  isString: isString,
  capitalize: capitalize,
  timeToSeconds: timeToSeconds,
  formatTime: formatTime,
  fuzzySearch: fuzzySearch,
  request: request,
  requestPost: requestPost,
  requestPatch: requestPatch,
  requestPut: requestPut,
  requestGet: requestGet,
  requestDelete: requestDelete,
  isCompany: isCompany,
  isCold: isCold,
};
