var dispatcher = require('../dispatcher/CRMAppDispatcher');
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;
module.exports = {

  load: function(object) {
    dispatcher.handleServerAction({
      type: ActionTypes.APP_LOAD_SUCCESS,
      object: object
    });
  },

};
