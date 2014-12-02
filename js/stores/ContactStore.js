var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var ContactWebAPI = require('../api/ContactWebAPI');


var CRMConstants = require('../constants/CRMConstants');
var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');
var SessionStore = require('./SessionStore');
var ActivityStore = require('./ActivityStore');
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

    getLeads: function(reversed) {
        return _.filter(this.getByDate(true), function(c){
            return !c.is_cold;
        });
    },

    getRecent: function() {
        var recent_acts = ActivityStore.getByDate(true)
        return _.chain(recent_acts)
                .map(function(act){ return act.contact_ids; })
                .reduce(function(acc, contact_ids){
                    return _.union(acc, contact_ids);
                }, [])
                .map(this.get).reverse().value();

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
        case ActionTypes.APP_LOAD_SUCCESS:
            _.forEach(action.object.contacts, function(contact){
                _contacts[contact.id] = contact;
            });
            ContactStore.emitChange();
            break;
        case ActionTypes.CREATE_CONTACT:
            var contact = ContactStore.getCreatedContact(action.object);
            ContactStore.emitChange();
            break;
        case ActionTypes.CREATE_CONTACT_SUCCESS:
            var contact_with_id = ContactStore.getCreatedContact(action.object);
            _contacts[contact_with_id.id] = contact_with_id;
            ContactStore.emitChange();
            break;
        case ActionTypes.EDIT_CONTACT_SUCCESS:
            var contact_id = action.object['contact_id'],
                contact = action.object['contact'];
            _contacts[contact_id] = contact;
            ContactStore.emitChange();
        case ActionTypes.CREATE_ACTIVITY_SUCCESS:
            CRMAppDispatcher.waitFor([ActivityStore.dispatchToken]);
            var contact_ids = action.object.contact_ids;
            contact_ids = _.filter(contact_ids, function(cid){
                return _contacts[cid].is_cold;
            });
            ContactWebAPI.setLeads(contact_ids, function(result){
                _.forEach(result, function(cid){
                    _contacts[cid].is_cold = false;
                });
                ContactStore.emitChange();
            });
        default:
            // do nothing
    }

});

module.exports = ContactStore;
