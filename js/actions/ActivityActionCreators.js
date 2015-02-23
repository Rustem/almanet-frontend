var dispatcher = require('../dispatcher/CRMAppDispatcher');
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;
var ActivityWebAPI = require('../api/ActivityWebAPI');
// var SalesCycleWebAPI = require('../api/SalesCycleWebAPI');

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

        // @askhat no, its incorrect. But that's ok of course. :)
        /*
        Remember, all this logic will be dictated by backend since it is
        business tier, yeaaah, tier. So, let's imagine that some fucking user
        created an activity. Our backend will check if this is first activity
        or if current salescycle still new, then update cycle to new status. At the time
        CREATE_ACTIVITY_SUCCESS action happened we have already a salescycle with that
        activity. What should we do then ? SalesCycle store must subscribe
        to this even ActionTypes.CREATE_ACTIVITY_SUCCESS and update itself. Yeaaah
        we have logic duplicating, but remember it is dictated by our backend.
        Since Http is request/response protocol, then we will be anyway consistent.
        Another way is to bring salescycle of activity and just replace the current
        one. But it's later, unless we start crafting backend.
        */
        // @Rustem, is it correct way of implementing in terms of Flux Architecture?
        // activity creation affects on two stores, so in this ActionCreator produces two actions: for Activity and SalesCycle
    },
    mark_as_read: function(ids) {
        dispatcher.handleViewAction({
          type: ActionTypes.ACTIVITY_MARK_AS_READ,
          object: ids
        });
        ActivityWebAPI.mark_as_read(ids, function(ids){
          dispatcher.handleViewAction({
            type: ActionTypes.ACTIVITY_MARK_AS_READ_SUCCESS,
            object: ids
          });
        }.bind(this), function(ids){
          dispatcher.handleServerAction({
            type: ActionTypes.ACTIVITY_MARK_AS_READ_FAIL,
            object: ids
          });
        }.bind(this));
    },
}
