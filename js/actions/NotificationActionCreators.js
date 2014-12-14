var dispatcher = require('../dispatcher/CRMAppDispatcher');
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;
var NotificationWebAPI = require('../api/NotificationWebAPI');

module.exports = {
    userRead: function(notif_id, user_id){
        var object = {notification_id: notif_id, recipient_id: user_id};
        dispatcher.handleViewAction({
            type: ActionTypes.USER_READ_NOTIFICATION,
            object: object
        });
        NotificationWebAPI.userHasRead(object, function(n){
            dispatcher.handleServerAction({
                type: ActionTypes.USER_READ_NOTIFICATION_SUCCESS,
                object: n
            });
        }.bind(this), function(error){
            dispatcher.handleServerAction({
                type: ActionTypes.USER_READ_NOTIFICATION_FAIL,
                error: error
            });
        });
    }
};
