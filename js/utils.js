/**
 * @jsx React.DOM
 */
'use strict';

var _ = require('lodash');
var Fuse = require('./libs/fuse');
var CREATION_STATUS = require('./constants/CRMConstants').CREATION_STATUS;
var cookie_tool = require('cookie');
var superagent = require('superagent');

var CONTACT_TYPES   = require('./constants/CRMConstants').CONTACT_TYPES;

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

_.mixin({'capitalize': capitalize});


function timeToSeconds(time) {
  var parts = time.split(':');
  return (+parts[0]) * 3600 + (+parts[1]) * 60;
}

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

function isNewObject(object) {
  // determines whether object is new using duck typing
  return CREATION_STATUS.HOT === object.new_status;
};

function isCompany(object) {
  return (object.tp == CONTACT_TYPES.CO);
}


function buildPost(url) {
  return superagent.post(url)
      .set('X-CSRFToken', cookie_tool.parse(document.cookie).csrftoken);
};
function buildGet(url) {
  return superagent.get(url)
      .set('X-CSRFToken', cookie_tool.parse(document.cookie).csrftoken);
};

function request(method, url) {
  return superagent(method.toUpperCase(), url)
    .type('json')
    .set('X-CSRFToken', cookie_tool.parse(document.cookie).csrftoken);
};

function requestPost(url) {
  return request('POST', url);
};

function requestPatch(url) {
  return request('PATCH', url);
};

module.exports = {
  extractIds: extractIds,
  mergeInto: mergeInto,
  merge: merge,
  invariant: invariant,
  emptyFunction: emptyFunction,
  isString: isString,
  capitalize: capitalize,
  timeToSeconds: timeToSeconds,
  fuzzySearch: fuzzySearch,
  isNewObject: isNewObject,
  request: request,
  requestPost: requestPost,
  requestPatch: requestPatch,
  buildPost: buildPost,
  buildGet: buildGet,
  isCompany: isCompany,
};
