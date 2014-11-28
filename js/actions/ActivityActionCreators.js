var dispatcher = require('../dispatcher/CRMAppDispatcher');
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;
var ActivityWebAPI = require('../api/ActivityWebAPI');

module.exports = {
    createActivity: function(object) {
        dispatcher.handleViewAction({
          type: ActionTypes.CREATE_ACTIVITY,
          object: object
        });
        ActivityWebAPI.create(object, function(activity){
            dispatcher.handleServerAction({
                type: ActionTypes.CREATE_ACTIVITY_SUCCESS,
                object: activity
            });
        }.bind(this), function(error){
            dispatcher.handleServerAction({
                type: ActionTypes.CREATE_ACTIVITY_FAIL,
                error: error
            });
        });
    }
}
