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

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    get: function(id) {
        return _shares[id];
    },

    sortedByDate: function(reversed) {
        var reversed = reversed && true || false;
        var shares = this.getAll();
        shares = _.sortBy(shares, function(share){ return share.at });
        if(reversed) {
            shares = shares.reverse();
        }
        return shares;
    },

    getAll: function() {
        return _.map(_shares, function(share) {return share});
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
    },

    markSharesAsRead: function(share_ids) {
        for(var i = 0; i < share_ids.length; i++) {
            var share_id = share_ids[i];
            _shares[share_id].isNew = false;
        }
        return true;
    }

});


ShareStore.dispatchToken = CRMAppDispatcher.register(function(payload) {

    var action = payload.action;
    switch(action.type) {
        case ActionTypes.CREATE_CONTACT_SUCCESS:
            CRMAppDispatcher.waitFor([ContactStore.dispatchToken]);
            var contact = action.object;
            _shares[contact.share.id] = contact.share;
            ShareStore.emitChange();
            break;
        case ActionTypes.CREATE_SHARE:
            var contact = ShareStore.getCreatedContact(action.object);
            ShareStore.emitChange();
            break;
        case ActionTypes.CREATE_SHARE_SUCCESS:
            var share_object = ShareStore.getCreatedContact(action.object);
            _shares[share_object.id] = share_object;
            ShareStore.emitChange();
            break;
        case ActionTypes.MARK_SHARES_READ_SUCCESS:
            ShareStore.markSharesAsRead(action.object);
            ShareStore.emitChange();
            break;
        default:
            // do nothing
    }

});

module.exports = ShareStore;
