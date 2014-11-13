var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var CRMConstants = require('../constants/CRMConstants');
var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');
var ContactActionCreators = require('../actions/ContactActionCreators');
var ContactStore = require('./ContactStore');
var ActionTypes = CRMConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var _shares = {};

var ShareStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    get: function(id) {
        return _shares[id];
    },

    getAll: function() {
        return _shares;
    },

    getAllNew: function() {
        var shares = this.getAll();
        return _.filter(shares, function(share) { return share.isNew });
    },

    getAllButNew: function() {
        var shares = this.getAll();
        return _.filter(shares, function(share) { return !share.isNew });
    },

    size: function() {
        return _.size(this.getAll());
    },

    hasNew: function() {
        var shares = this.getAll();
        return _.any(shares, function(share){ return share.isNew });
    },

    getCreatedContact: function(obj) {
        return obj;
    }

});


ShareStore.dispatchToken = CRMAppDispatcher.register(function(payload) {

    var action = payload.action;
    switch(action.type) {
        case ActionTypes.RECEIVE_CREATED_CONTACT:
            CRMAppDispatcher.waitFor([ContactStore.dispatchToken]);
            var contact = action.object;
            _shares[contact.share.id] = contact.share;
            ShareStore.emitChange();
            break;
        case ActionTypes.CREATE_SHARE:
            var contact = ShareStore.getCreatedContact(action.object);
            ShareStore.emitChange();
            break;
        case ActionTypes.RECEIVE_CREATED_SHARE:
            var share_object = ShareStore.getCreatedContact(action.object);
            _shares[share_object.id] = share_object;
            ShareStore.emitChange();
            break;
        default:
            // do nothing
    }

});

module.exports = ShareStore;
