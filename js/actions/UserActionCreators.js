var AuthWebAPI = require('../api/AuthWebAPI');
var dispatcher = require('../dispatcher/CRMAppDispatcher');
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;

module.exports = {
  loadCurrentUser: function() {
    dispatcher.handleViewAction({
        type: ActionTypes.LOAD_CURRENT_USER
    });
    AuthWebAPI.loadCurrentUser(function(user){
        dispatcher.handleServerAction({
            type: ActionTypes.LOAD_CURRENT_USER_SUCCESS,
            object: user
        });
    }.bind(this), function(error){
        dispatcher.handleServerAction({
            type: ActionTypes.LOAD_CURRENT_USER_FAIL,
            object: user
        });
    }.bind(this));
  },
};
