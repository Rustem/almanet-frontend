var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;

module.exports = {
  receiveCreatedContact: function(user) {
    CRMAppDispatcher.handleServerAction({
      type: ActionTypes.CURRENT_USER_LOADED,
      object: user
    });
  },
};
