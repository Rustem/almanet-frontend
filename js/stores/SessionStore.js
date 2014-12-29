var _ = require('lodash');
var assign = require('object-assign');
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
        last_name: '',
        userpic: 'sanzhar.png',
        unfollow_list: []
    },
    _empty_session = {
        id: null,
        expire_date: '',
        resource_uri: 'api/v1/'
    };

var _current_user = _.cloneDeep(_anonymous_user),
    _current_session = _.cloneDeep(_empty_session);

var SessionStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    current_user: function() {
        return _current_user;
    },

    current_session: function() {
        return _current_session;
    },

    getAnonymous: function() {
        return _.cloneDeep(_anonymous_user);
    },

    setCurrent: function(user) {
        return _current_user = user;
    },

    setSession: function(session) {
        return _current_session = session;
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
        case ActionTypes.APP_LOAD_SUCCESS:
            SessionStore.setCurrent(action.object.user);
            SessionStore.setSession(action.object.session);
            SessionStore.emitChange();
            break;
        case ActionTypes.LOAD_CURRENT_USER_SUCCESS:
            SessionStore.setCurrent(action.object);
            SessionStore.emitChange();
            break;
        case ActionTypes.LOGOUT:
            SessionStore.reset_current(user_id);
            SessionStore.emitChange();
            break;
        case ActionTypes.TOGGLE_FOLLOWING_SUCCESS:
            SessionStore.setCurrent(action.object);
            SessionStore.emitChange();
            break;

    }
});

module.exports = SessionStore;
