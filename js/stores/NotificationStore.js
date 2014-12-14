var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var dispatcher = require('../dispatcher/CRMAppDispatcher');
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;
var SessionStore = require('./SessionStore');

CHANGE_EVENT = 'change-notif'

var _notifications = {};

var NotificationStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getByDate: function(){
        return _(_notifications)
            .map(function(n){ return n })
            .sortBy(function(n){ return n.at })
            .reverse()
            .value();
    },

    getNewByDate: function() {
        return _(_notifications)
            .map(function(n) { return n })
            .filter(function(n) { return n.is_new })
            .sortBy(function(n) { return n.at })
            .reverse()
            .value();
    }

});


NotificationStore.dispatchToken = dispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.type) {
        case ActionTypes.APP_LOAD_SUCCESS:
            dispatcher.waitFor([SessionStore.dispatchToken]);
            _.forEach(action.object.notifications, function(notification){
                _notifications[notification.id] = notification;
            });
            NotificationStore.emitChange();
            break;
        case ActionTypes.CREATE_NOTIFICATION_SUCCESS:
            _notifications[action.object.id] = action.object;
            NotificationStore.emitChange();
            break;
        case ActionTypes.USER_READ_NOTIFICATION_SUCCESS:
            _notifications[action.object.id] = action.object;
            NotificationStore.emitChange();
            break;
        default:
            // do nothing
    }
});

module.exports = NotificationStore;
