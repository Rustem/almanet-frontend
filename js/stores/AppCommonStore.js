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

    _genHash: function(optionsList) {
        return _.reduce(optionsList, function(acc, x) { acc[x[1].toUpperCase()] = x[0]; return acc; }, {});
    },

    genSalesCycleStatusesHash: function() {
        var statuses_hash = this._genHash(_constants['sales_cycle']['statuses']);
        _constants['sales_cycle']['statuses_hash'] = statuses_hash;
    },

    genActivityFeedbackHash: function() {
        var statuses_hash = this._genHash(_constants['activity']['feedback']);
        _constants['activity']['feedback_hash'] = statuses_hash;
    },

    genContactStatusesHash: function() {
        var statuses_hash = this._genHash(_constants['contact']['statuses']);
        _constants['contact']['statuses_hash'] = statuses_hash;
    },

    setAll: function(obj) {
        _constants = obj;

        this.genSalesCycleStatusesHash();
        this.genActivityFeedbackHash();
        this.genContactStatusesHash();

        this.emitChange();
    }

});


AppCommonStore.dispatchToken = CRMAppDispatcher.register(function(payload) {

    var action = payload.action;
    switch(action.type) {
        case ActionTypes.APP_LOAD_SUCCESS:
            if(action.object.constants !== undefined)
                AppCommonStore.setAll(action.object.constants);
            break;
        default:
            // do nothing
    }

});

module.exports = AppCommonStore;
