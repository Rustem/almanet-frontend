var _ = require('lodash');
var SignalManager = require('./utils');
var dispatcher = require('../dispatcher/CRMAppDispatcher');
var ContactWebAPI = require('../api/ContactWebAPI');
var CRMConstants = require('../constants/CRMConstants');
var NotifTypes = CRMConstants.NotifTypes;
var ActionTypes = CRMConstants.ActionTypes;

module.exports = api = {
    getAll: function(success, failure) {
        var notifications = JSON.parse(localStorage.getItem('notifications'));
        setTimeout(function(){
            success(notifications);
        }, 0);
    },

    create: function(details, success, failure) {
        var timeNow = Date.now();
        var obj = _.extend({}, details, {
            id: 'n_' + timeNow,
            date_created: timeNow,
            is_new: true
        });
        var rawNotifs = JSON.parse(localStorage.getItem('notifications')) || [];
        rawNotifs.push(obj);
        localStorage.setItem('notifications', JSON.stringify(rawNotifs));
        setTimeout(function() {
            success(obj);
        }, 0);
    },

    userHasRead: function(details, success, failure) {
        var rawNotifs = JSON.parse(localStorage.getItem('notifications')) || [],
            notif = null;
        for(var i = 0; i<rawNotifs.length; i++) {
            var cur = rawNotifs[i];
            if(cur.id === details.notification_id) {
                cur.is_new = false;
                notif = cur;
                break;
            }
        }
        localStorage.setItem('notifications', JSON.stringify(rawNotifs));
        setTimeout(function() {
            success(notif);
        }, 0);
    },
};


// @askhat, right now I am just take into account notifications that triggered
// by contact module. However, in future, second argument must be extra params.

function new_notification(notif_tp, extra) {
    var details = {
        type: notif_tp,
        extra: extra
    };
    dispatcher.handleViewAction({
        type: ActionTypes.CREATE_NOTIFICATION,
        object: details
    });
    api.create(details, function(n){
        dispatcher.handleServerAction({
            type: ActionTypes.CREATE_NOTIFICATION_SUCCESS,
            object: n
        });
    }.bind(null), function(error){
        dispatcher.handleServerAction({
            type: ActionTypes.CREATE_NOTIFICATION_FAIL,
            error: error
        });
    }.bind(null));
};
SignalManager.connect(ActionTypes.CREATE_CONTACT_SUCCESS,
                      new_notification.bind(null, NotifTypes.CONTACT_CREATE));

SignalManager.connect(ActionTypes.EDIT_CONTACT_SUCCESS,
                      new_notification.bind(null, NotifTypes.CONTACT_EDIT));

SignalManager.connect(ActionTypes.CREATE_SHARE_SUCCESS,
                      new_notification.bind(null, NotifTypes.CONTACT_SHARE));

SignalManager.connect(ActionTypes.CREATE_ACTIVITY_SUCCESS,
                      new_notification.bind(null, NotifTypes.ACTIVITY_CREATE));

SignalManager.connect(ActionTypes.CREATE_FILTER_SUCCESS,
                      new_notification.bind(null, NotifTypes.FILTER_CREATE));

SignalManager.connect(ActionTypes.EDIT_FILTER_SUCCESS,
                      new_notification.bind(null, NotifTypes.FILTER_EDIT));

SignalManager.connect(ActionTypes.DELETE_FILTER_SUCCESS,
                      new_notification.bind(null, NotifTypes.FILTER_DELETE));

SignalManager.connect(ActionTypes.IMPORT_CONTACTS_SUCCESS,
                      new_notification.bind(null, NotifTypes.IMPORT_CONTACTS));

SignalManager.connect(ActionTypes.CLOSE_SALES_CYCLE_SUCCESS,
                      new_notification.bind(null, NotifTypes.SALES_CYCLE_CLOSE));