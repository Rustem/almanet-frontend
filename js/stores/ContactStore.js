var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var CRMConstants = require('../constants/CRMConstants');
var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');


var ActionTypes = CRMConstants.ActionTypes;
var CHANGE_EVENT = 'change';
var CREATE_EVENT = 'create'
var _contacts = {};

var ContactStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    emitCreate: function(contact_id, note) {
        this.emit(CREATE_EVENT, contact_id, note);
    },
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    addCreateListener: function(callback) {
        this.on(CREATE_EVENT, callback);
    },
    removeCreateListener: function(callback) {
        this.removeListener(CREATE_EVENT, callback);
    },

    get: function(id) {
        return _contacts[id];
    },

    getAll: function() {
        return _contacts
    },

    getCreatedContact: function(obj) {
        return obj;
    }

});


ContactStore.dispatchToken = CRMAppDispatcher.register(function(payload) {

    var action = payload.action;
    switch(action.type) {
        case ActionTypes.CREATE_CONTACT:
            var contact = ContactStore.getCreatedContact(action.object);
            ContactStore.emitChange();
            ContactStore.emitCreate(contact.id, contact.note);
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
