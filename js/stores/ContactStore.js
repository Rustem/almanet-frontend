var EventEmitter = require('events').EventEmitter;
var CRMConstants = require('../constants/CRMConstants');
var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');
var merge = require('react/lib/merge');

var ActionTypes = CRMConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var _contacts = {};

var ContactStore = merge(EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    get: function(id) {
        return _contacts[id];
    },

    getAll: function() {
        return _contacts
    },

    getCreatedContact: function(obj) {
        console.log(obj, "in store");
        return obj;
    }

});


ContactStore.dispatchToken = CRMAppDispatcher.register(function(payload) {

    var action = payload.action;
    switch(action.type) {
        case ActionTypes.CREATE_CONTACT:
            var contact = ContactStore.getCreatedContact(action.object);
            ContactStore.emitChange();
            break;
        case ActionTypes.RECEIVE_CREATED_CONTACT:
            var contact_with_id = ContactStore.getCreatedContact(action.object);
            _contacts[contact_with_id.id] = contact_with_id;
            ContactStore.emitChange();
            break;
        default:
            // do nothing
    }

});

module.exports = ContactStore;
