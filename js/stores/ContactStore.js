var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var CRMConstants = require('../constants/CRMConstants');
var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');


var ActionTypes = CRMConstants.ActionTypes;
var CHANGE_EVENT = 'change';
var _contacts = {};

var ContactStore = assign({}, EventEmitter.prototype, {
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
        return _contacts[id];
    },

    getByDate: function(reversed) {
        var contacts = this.getAll();
        contacts = _.sortBy(contacts, function(contact){ return contact.at });
        if(reversed) {
            contacts = contacts.reverse();
        }
        return contacts;
    },

    getColdByDate: function(reversed) {
        return _.filter(this.getByDate(true), function(c){
            return c.is_cold;
        });
    },

    getAll: function() {
        return _.map(_contacts, function(c) { return c });
    },

    getByIds: function(ids) {
        var contacts = this.getAll();
        return _.filter(contacts, function(c){ return _.indexOf(ids, c.id) !== -1 });
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
            break;
        case ActionTypes.CREATE_CONTACT_SUCCESS:
            var contact_with_id = ContactStore.getCreatedContact(action.object);
            _contacts[contact_with_id.id] = contact_with_id;
            ContactStore.emitChange();
            break;
        default:
            // do nothing
    }

});

module.exports = ContactStore;
