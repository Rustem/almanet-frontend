var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');
var CRMConstants = require('../constants/CRMConstants');
var ContactWebAPI = require('../api/ContactWebAPI');
var ContactStore = require('../stores/ContactStore');

var ActionTypes = CRMConstants.ActionTypes;
module.exports = {

  receiveCreatedContact: function(object) {
    CRMAppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_CREATED_CONTACT,
      object: object
    });
  }

};
