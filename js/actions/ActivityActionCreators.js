var dispatcher = require('../dispatcher/CRMAppDispatcher');
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;
var ActivityWebAPI = require('../api/ActivityWebAPI');
var SalesCycleWebAPI = require('../api/SalesCycleWebAPI');

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

        // @Rustem, is it correct way of implementing in terms of Flux Architecture? 
        // activity creation affects on two stores, so in this ActionCreator produces two actions: for Activity and SalesCycle
        dispatcher.handleViewAction({
          type: ActionTypes.SALES_CYCLE_SET_PENDING,
          object: object
        });
        SalesCycleWebAPI.set_pending(object, function(sales_cycle){
            dispatcher.handleServerAction({
                type: ActionTypes.SALES_CYCLE_SET_PENDING_SUCCESS,
                object: sales_cycle
            });
        }.bind(this), function(error){
            dispatcher.handleServerAction({
                type: ActionTypes.SALES_CYCLE_SET_PENDING_FAIL,
                error: error
            });
        });
    }
}
