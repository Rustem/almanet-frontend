var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;
var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');

var CHANGE_EVENT = 'change';
var _is_loading = false;

LOADING_ACTIONS = [
    ActionTypes.CREATE_CONTACT,
    ActionTypes.EDIT_CONTACT,
    ActionTypes.IMPORT_CONTACTS,
    ActionTypes.CREATE_SHARE,
    ActionTypes.CREATE_ACTIVITY,
    ActionTypes.MARK_SHARES_READ,
    ActionTypes.LOAD_CURRENT_USER,
    ActionTypes.CLOSE_SALES_CYCLE,
    ActionTypes.ADD_PRODUCT_TO_SALES_CYCLE,
    ActionTypes.CREATE_PRODUCT,
    ActionTypes.EDIT_PRODUCT,
    ActionTypes.TOGGLE_FOLLOWING,
    ActionTypes.CREATE_COMMENT,
    ActionTypes.LOAD_ACTIVITY_COMMENTS,
    ActionTypes.CREATE_FILTER,
    ActionTypes.EDIT_FILTER,
    ActionTypes.DELETE_FILTER,
    ActionTypes.EDIT_USER,
]

UNLOADING_ACTIONS = [
    ActionTypes.APP_LOAD_SUCCESS,
    ActionTypes.CREATE_CONTACT_SUCCESS,
    ActionTypes.CREATE_CONTACT_FAIL,
    ActionTypes.EDIT_CONTACT_SUCCESS,
    ActionTypes.EDIT_CONTACT_FAIL,
    ActionTypes.IMPORT_CONTACTS_SUCCESS,
    ActionTypes.IMPORT_CONTACTS_FAIL,
    ActionTypes.CREATE_SHARE_SUCCESS,
    ActionTypes.CREATE_SHARE_FAIL,
    ActionTypes.CREATE_ACTIVITY_SUCCESS,
    ActionTypes.CREATE_ACTIVITY_FAIL,
    ActionTypes.MARK_SHARES_READ_SUCCESS,
    ActionTypes.MARK_SHARES_READ_FAIL,
    ActionTypes.LOAD_CURRENT_USER_SUCCESS,
    ActionTypes.LOAD_CURRENT_USER_FAIL,
    ActionTypes.CLOSE_SALES_CYCLE_SUCCESS,
    ActionTypes.CLOSE_SALES_CYCLE_FAIL,
    ActionTypes.ADD_PRODUCT_TO_SALES_CYCLE_SUCCESS,
    ActionTypes.ADD_PRODUCT_TO_SALES_CYCLE_FAIL,
    ActionTypes.CREATE_PRODUCT_SUCCESS,
    ActionTypes.CREATE_PRODUCT_FAIL,
    ActionTypes.EDIT_PRODUCT_SUCCESS,
    ActionTypes.EDIT_PRODUCT_FAIL,
    ActionTypes.TOGGLE_FOLLOWING_SUCCESS,
    ActionTypes.TOGGLE_FOLLOWING_FAIL,
    ActionTypes.CREATE_COMMENT_SUCCESS,
    ActionTypes.CREATE_COMMENT_FAIL,
    ActionTypes.LOAD_ACTIVITY_COMMENTS_SUCCESS,
    ActionTypes.LOAD_ACTIVITY_COMMENTS_FAIL,
    ActionTypes.CREATE_FILTER_SUCCESS,
    ActionTypes.CREATE_FILTER_FAIL,
    ActionTypes.EDIT_FILTER_SUCCESS,
    ActionTypes.EDIT_FILTER_FAIL,
    ActionTypes.DELETE_FILTER_SUCCESS,
    ActionTypes.DELETE_FILTER_FAIL,
    ActionTypes.EDIT_USER_SUCCESS,
    ActionTypes.EDIT_USER_FAIL,
]

var RequestStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    is_loading: function() {
        return _is_loading;
    },

    set_loading: function() {
        _is_loading = true;
        this.emitChange();
    },  

    unset_loading: function() {
        _is_loading = false;
        this.emitChange();
    },
});


RequestStore.dispatchToken = CRMAppDispatcher.register(function(payload) {

    var action = payload.action;
    if(_.contains(LOADING_ACTIONS, action.type)) {
        console.log(1)
        RequestStore.set_loading();
    }
    if(_.contains(UNLOADING_ACTIONS, action.type)) {
        console.log(2)
        RequestStore.unset_loading();
    }

});

module.exports = RequestStore;
