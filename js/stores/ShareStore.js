var _ = require('lodash');
var Fuse = require('../libs/fuse');
var assign = require('object-assign');
var moment = require('moment');
var EventEmitter = require('events').EventEmitter;
var CRMConstants = require('../constants/CRMConstants');
var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');
var ContactActionCreators = require('../actions/ContactActionCreators');
var ContactStore = require('./ContactStore');
var SessionStore = require('./SessionStore');
var utils = require('../utils');
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

    getNew: function() {
        return _.filter(this.getAll(), function(share){ return !share.is_read })
    },

    hasNew: function() {
        return _.any(this.getAll(), function(share){ return !share.is_read })
    },

    sortedByDate: function() {
        var shares = this.getAll();
        shares = _.sortBy(shares, function(share){ return moment(share.date_created) });
        return shares.reverse();
    },

    getAll: function() {
        return _.map(_shares, function(share) {return share});
    },

    size: function() {
        return _.size(this.getAll());
    },

    getCreatedContact: function(obj) {
        return obj;
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
            keys: ['note']
        }, shares = this.getAll();

        var f = new Fuse(shares, searchOptions);
        shares = f.search(search_str);
        shares = _(shares)
            .sortBy(function(share){ return share[options['order_by']] });
        if (!options['asc']) {
            return shares.reverse().value();
        }
        return shares.value();
    },

    markSharesAsRead: function(shares) {
        for(var i = 0; i < shares.length; i++) {
            var share = shares[i];
            _shares[share.id] = share;
        }
        return true;
    },

    setAll: function(obj) {
        _.forEach(obj.shares, function(share){
            _shares[share.id] = share;
        });
        this.emitChange();
    }

});


ShareStore.dispatchToken = CRMAppDispatcher.register(function(payload) {

    var action = payload.action;
    switch(action.type) {
        case ActionTypes.APP_LOAD_SUCCESS:
            CRMAppDispatcher.waitFor([ContactStore.dispatchToken]);
            if(action.object.shares !== undefined)
                ShareStore.setAll(action.object);
            break;
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
            var share_objects = action.object;
            _.forEach(share_objects.objects, function(share){
                if(SessionStore.current_user().crm_user_id == share.share_to)
                    _shares[share.id] = share;
            });
            ShareStore.emitChange();
            break;
        case ActionTypes.MARK_SHARES_READ_SUCCESS:
            ShareStore.markSharesAsRead(action.object.objects);
            ShareStore.emitChange();
            break;
        default:
            // do nothing
    }

});

module.exports = ShareStore;
