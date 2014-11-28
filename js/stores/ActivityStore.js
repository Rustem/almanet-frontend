var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var CRMConstants = require('../constants/CRMConstants');
var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');
var SessionStore = require('./SessionStore');

var ActionTypes = CRMConstants.ActionTypes;
var CHANGE_EVENT = 'change';
var _activities = {};

var ActivityStore = assign({}, EventEmitter.prototype, {
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
        return _activities[id];
    },

    bySalesCycle: function(salescycle_id) {
        return _.filter(this.getAll(), function(actv){
            return actv.salescycle_id === salescycle_id;
        })
    },

    getAll: function() {
        return _.map(_activities, function(c) { return c });
    },

    getByIds: function(ids) {
        var activities = this.getAll();
        return _.filter(activities, function(c){ return _.indexOf(ids, c.id) !== -1 });
    },

    getCreatedActivity: function(obj) {
        return obj;
    }

});


ActivityStore.dispatchToken = CRMAppDispatcher.register(function(payload) {

    var action = payload.action;
    switch(action.type) {
        case ActionTypes.APP_LOAD_SUCCESS:
            CRMAppDispatcher.waitFor([SessionStore.dispatchToken]);
            _.forEach(action.object.activities, function(activity){
                _activities[activity.id] = activity;
            });
            ActivityStore.emitChange();
            break;
        case ActionTypes.CREATE_ACTIVITY_SUCCESS:
            var a = ActivityStore.getCreatedActivity(action.object);
            _activities[a.id] = a;
            ActivityStore.emitChange();
            break;
        default:
            // do nothing
    }

});

module.exports = ActivityStore;
