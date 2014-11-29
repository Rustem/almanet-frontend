var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var CRMConstants = require('../constants/CRMConstants');
var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');
var SessionStore = require('./SessionStore');

var ActionTypes = CRMConstants.ActionTypes;
var CHANGE_EVENT = 'change';
var _users = {};

var UserStore = assign({}, EventEmitter.prototype, {
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
        return _users[id];
    },

    getAll: function() {
        return _.map(_users, function(c) { return c });
    },

    getByIds: function(ids) {
        var users = this.getAll();
        return _.filter(users, function(c){ return _.indexOf(ids, c.id) !== -1 });
    },

    getCreateduser: function(obj) {
        return obj;
    }

});


UserStore.dispatchToken = CRMAppDispatcher.register(function(payload) {

    var action = payload.action;
    switch(action.type) {
        case ActionTypes.APP_LOAD_SUCCESS:
            _.forEach(action.object.users, function(user){
                _users[user.id] = user;
            });
            UserStore.emitChange();
            break;
        case ActionTypes.CREATE_USER:
            var user = UserStore.getCreateduser(action.object);
            UserStore.emitChange();
            break;
        case ActionTypes.CREATE_USER_SUCCESS:
            var user_with_id = UserStore.getCreateduser(action.object);
            _users[user_with_id.id] = user_with_id;
            UserStore.emitChange();
            break;
        case ActionTypes.EDIT_USER_SUCCESS:
            var user_id = action.object['user_id'],
                user = action.object['user'];
            _users[user_id] = user;
            UserStore.emitChange();
        default:
            // do nothing
    }

});

module.exports = UserStore;
