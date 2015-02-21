var _ = require('lodash');
var assign = require('object-assign');
var moment = require('moment');
var EventEmitter = require('events').EventEmitter;
var CRMConstants = require('../constants/CRMConstants');
var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');

var ActionTypes = CRMConstants.ActionTypes;
var CHANGE_EVENT = 'change';
var _filters = {};

var FilterStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    get: function(id) {
        return _filters[id];
    },

    getAll: function() {
        return _.map(_filters, function(f) { return f });
    },

    getLatestOne: function() {
        var filters = _.sortBy(this.getAll(), function(f) {
            return moment(f.date_created);
        }.bind(this)).reverse();
        if(filters.length == 0) return null;
        return filters[0];
    },

    getByUser: function(user_id) {
        var filters = this.getAll();
        return _.filter(filters, function(f) { return f.author_id == user_id });
    },

    getCreatedFilter: function(obj) {
        return obj;
    },

    setAll: function(obj) {
        _.forEach(obj.filters, function(filter){
            _filters[filter.id] = filter;
        });
        this.emitChange();
    },

});


FilterStore.dispatchToken = CRMAppDispatcher.register(function(payload) {

    var action = payload.action;
    switch(action.type) {
        case ActionTypes.APP_LOAD_SUCCESS:
            var ContactStore = require('./ContactStore');
            CRMAppDispatcher.waitFor([ContactStore.dispatchToken]);
            if(action.object.filters !== undefined)
                FilterStore.setAll(action.object)
            break;
        case ActionTypes.CREATE_FILTER:
            // var filter = FilterStore.getCreatedfilter(action.object);
            FilterStore.emitChange();
            break;
        case ActionTypes.CREATE_FILTER_SUCCESS:
            var filter_with_id = action.object;
            _filters[filter_with_id.id] = filter_with_id;
            FilterStore.emitChange();
            break;
        case ActionTypes.EDIT_FILTER_SUCCESS:
            var filter = action.object;
            _filters[filter.id] = filter;
            FilterStore.emitChange();
            break;
        case ActionTypes.DELETE_FILTER_SUCCESS:
            var id = action.object;
            delete _filters[id];
            FilterStore.emitChange();
            break;
        default:
            // do nothing
    }

});

module.exports = FilterStore;
