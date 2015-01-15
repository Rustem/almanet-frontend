var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var CRMConstants = require('../constants/CRMConstants');
var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');
var SessionStore = require('./SessionStore');
var ContactStore = require('./ContactStore');
var ActionTypes = CRMConstants.ActionTypes;
var utils = require('../utils');

var CHANGE_EVENT = 'change';
var _constants = {};

var AppCommonStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    get_constants: function(object_name) {
        return _constants[object_name];
    },

    getAll: function() {
        return _constants;
    },

    genSalesCycleStatusesHash: function() {
        var sc_const = {};
        for(var i = 0; i<_constants['salescycle']['statuses'].length; i++) {
            for(var key in _constants['salescycle']['statuses'][i]) {
                sc_const[key.toUpperCase()] = _constants['salescycle']['statuses'][i][key]
            }
        }
        _constants['sales_cycle'] = {'statuses_hash': sc_const};
    },

    setAll: function(obj) {
        _constants = obj;

        this.genSalesCycleStatusesHash();

        this.emitChange();
    }

});


AppCommonStore.dispatchToken = CRMAppDispatcher.register(function(payload) {

    var action = payload.action;
    switch(action.type) {
        case ActionTypes.APP_LOAD_SUCCESS:
            console.log(action.object.constants, 'hi')
            AppCommonStore.setAll(action.object.constants);
            break;
        default:
            // do nothing
    }

});

module.exports = AppCommonStore;
