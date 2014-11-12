var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var CRMConstants = require('../constants/CRMConstants');
var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');

var ActionTypes = CRMConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var _shares = {};

var ShareStore = _.extend(EventEmitter.prototype, {
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
        console.log(obj, "in store");
        return obj;
    }

});


ShareStore.dispatchToken = CRMAppDispatcher.register(function(payload) {

    var action = payload.action;
    switch(action.type) {
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
