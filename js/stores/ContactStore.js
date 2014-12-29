var _ = require('lodash');
var Fuse = require('../libs/fuse');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var ContactWebAPI = require('../api/ContactWebAPI');

var CRMConstants = require('../constants/CRMConstants');
var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');
var SessionStore = require('./SessionStore');
var ActivityStore = require('./ActivityStore');
var SalesCycleStore = require('./SalesCycleStore');
var ActionTypes = CRMConstants.ActionTypes;
var utils = require('../utils');
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
        var recent_acts = ActivityStore.getByDate(true);
        return _.chain(recent_acts)
                .map(function(act){ return act.contact_id; })
                .compact()
                .uniq()
                .map(this.get)
                .value();
    },

    getNew: function() {
        return _.filter(this.getAll(), utils.isNewObject)
    },

    hasJustCreated: function() {
        var contacts = this.getAll();
        return _.any(contacts, function(contact){ return utils.isJustCreatedObject(contact) });
    },

    getAll: function() {
        return _.map(_contacts, function(c) { return c });
    },

    fuzzySearch: function(search_str, options) {
        if(options === undefined) {
            options = {};
        }
        options = _.extend({}, {
            'order_by': 'at',
            'asc': true
        }, options);
        var searchOptions = {
            keys: ['fn']
        }, contacts = this.getAll();

        var f = new Fuse(contacts, searchOptions);
        contacts = f.search(search_str);
        contacts = _(contacts)
            .sortBy(function(contact){ return contact[options['order_by']] });
        if (!options['asc']) {
            return contacts.reverse().value();
        }
        return contacts.value();
    },

    getByIds: function(ids) {
        var contacts = this.getAll();
        return _.filter(contacts, function(c){ return _.indexOf(ids, c.id) !== -1 });
    },

    inCompany: function(id) {
        var contacts = this.getAll();
        cs = _.filter(contacts, function(c){ return c.contacts && _.indexOf(c.contacts, id) !== -1 });
        if(cs)
            return cs[0];
        return null;
    },

    byActivity: function(a) {
        if(a.salescycle_id == CRMConstants.GLOBAL_SALES_CYCLE_ID)
            return null;
        return this.get(SalesCycleStore.get(a.salescycle_id).contact_id);
    },

    getCreatedContact: function(obj) {
        return obj;
    },

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
            // if contact is not company it cannot contain other contacts
            if(!contact.is_company)
                _.pick(contact, function(value, key) {
                  return key != 'contacts';
                });
            _contacts[contact_id] = contact;
            ContactStore.emitChange();
        case ActionTypes.CONTACT_UPDATE_NEW_STATUS:
            var update_info = action.object['update_info'];
            for(var i = 0; i<update_info.length; i++) {
                var cid = update_info[i][0], newStatus = update_info[i][1];
                _contacts[cid].new_status = newStatus;
            }
            ContactStore.emitChange();
        case ActionTypes.CREATE_ACTIVITY_SUCCESS:
            CRMAppDispatcher.waitFor([ActivityStore.dispatchToken]);
            var contact_id = action.object.contact_id;
            if(contact_id) {
                _contacts[contact_id].is_cold = false;
                ContactWebAPI.setLeads([contact_id], function(result){
                    _.forEach(result, function(cid){
                        _contacts[cid].is_cold = false;
                    });
                    ContactStore.emitChange();
                });
            }
        default:
            // do nothing
    }

});

module.exports = ContactStore;
