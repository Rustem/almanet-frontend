var AuthWebAPI = require('../api/AuthWebAPI');
var UserWebAPI = require('../api/UserWebAPI');
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

  toggleFollowing: function(object) {
    dispatcher.handleViewAction({
        type: ActionTypes.TOGGLE_FOLLOWING
    });
    UserWebAPI.toggleFollowing(object, function(object){
        dispatcher.handleServerAction({
            type: ActionTypes.TOGGLE_FOLLOWING_SUCCESS,
            object: object
        });
    }.bind(this), function(error){
        dispatcher.handleServerAction({
            type: ActionTypes.TOGGLE_FOLLOWING_FAIL,
            object: error
        });
    }.bind(this));
  },

  editUser: function(user_id, object) {
    dispatcher.handleViewAction({
        type: ActionTypes.EDIT_USER
    });
    UserWebAPI.editUser(user_id, object, function(object){
        dispatcher.handleServerAction({
            type: ActionTypes.EDIT_USER_SUCCESS,
            object: object
        });
    }.bind(this), function(error){
        dispatcher.handleServerAction({
            type: ActionTypes.EDIT_USER_FAIL,
            object: error
        });
    }.bind(this));
  },

  uploadUserpic: function(object) {
    dispatcher.handleViewAction({
        type: ActionTypes.UPLOAD_USERPIC
    });
    UserWebAPI.uploadUserpic(object, function(object){
        dispatcher.handleServerAction({
            type: ActionTypes.UPLOAD_USERPIC_SUCCESS,
            object: object
        });
    }.bind(this), function(error){
        dispatcher.handleServerAction({
            type: ActionTypes.UPLOAD_USERPIC_FAIL,
            object: error
        });
    }.bind(this));
  },
};
