var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;

var CHANGE_EVENT = 'change';
var ANONYMOUS_USER_ID = -1;

var _anonymous_user = {
    id: -1,
    email: '',
    first_name: '',
    last_name: ''
};

var _current_user = _.cloneDeep(_anonymous_user);

var SessionStore = _.extend(EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    current_user: function() {
        return _current_user;
    },

    getAnonymous: function() {
        return _.cloneDeep(_anonymous_user);
    },

    setCurrent: function(user) {
        return _current_user = user;
    },

    reset_current: function() {
        return _.cloneDeep(_anonymous_user);
    },

    loggedIn: function() {
        var user = this.current_user();
        return user.id !== ANONYMOUS_USER_ID;
    },
});

SessionStore.dispatchToken = CRMAppDispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.type) {
        case ActionTypes.CURRENT_USER_LOADED:
            SessionStore.setCurrent(action.object);
            SessionStore.emitChange();
            break;
        case ActionTypes.LOGOUT:
            SessionStore.reset_current(user_id);
            SessionStore.emitChange();
            break;

    }
});

module.exports = SessionStore;
