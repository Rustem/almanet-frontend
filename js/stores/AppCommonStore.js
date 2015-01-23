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

    genContactStatusesHash: function() {
        var statuses_hash = this._genHash(_constants['contact']['statuses']);
        _constants['contact']['statuses_hash'] = statuses_hash;
    },

    filterActivityFeedbackOptions: function() {
        var options = _constants['activity']['feedback_options'];
        _constants['activity']['feedback_options'] = _.filter(options, function(o) {
                return (o[0] == '$') ? null : o;
            });
    },

    setAll: function(obj) {
        _constants = obj;

        this.filterActivityFeedbackOptions();
        this.genSalesCycleStatusesHash();
        this.genContactStatusesHash();

        this.emitChange();
    }

});


AppCommonStore.dispatchToken = CRMAppDispatcher.register(function(payload) {

    var action = payload.action;
    switch(action.type) {
        case ActionTypes.APP_LOAD_SUCCESS:
            AppCommonStore.setAll(action.object.constants);
            break;
        default:
            // do nothing
    }

});

module.exports = AppCommonStore;
