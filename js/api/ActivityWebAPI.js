var _ = require('lodash');
var requestPost = require('../utils').requestPost;
var SignalManager = require('./utils');
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;
var CREATION_STATUS = CRMConstants.CREATION_STATUS;

module.exports = {
    getAll: function(success, failure) {
        var activities = JSON.parse(localStorage.getItem('activities'));
        setTimeout(function(){
            success(activities);
        }, 0);
    },

    create: function(activityObject, success, failure) {
        var object = _.omit(activityObject, 'contact_id');
        requestPost('/api/v1/activity/')
            .send(object)
            .end(function(res) {
                if (res.ok) {
                    success(res.body);
                    var author_id = res.body.author_id,
                        extra = {};
                    SignalManager.send(ActionTypes.CREATE_ACTIVITY_SUCCESS, author_id, extra);
                } else {
                    failure(res);
                }
            });
    },
    updateNewStatus: function(ids, success) {
        var rawActivities = JSON.parse(localStorage.getItem('activities')) || [],
            updated_cids = [];
        _.forEach(rawActivities, function(activity){
            var updated = null;
            if(ids) {
                if(_.contains(ids, activity.id) && activity.new_status === CREATION_STATUS.HOT){
                    activity.new_status = CREATION_STATUS.COLD;
                    updated = [activity.id, activity.new_status];
                }
            } else {
                if(activity.new_status === CREATION_STATUS.HOT){
                    activity.new_status = CREATION_STATUS.COLD;
                    updated = [activity.id, activity.new_status];
                }
            }
            if(updated) updated_cids.push(updated);
        });
        localStorage.setItem('activities', JSON.stringify(rawActivities));

        setTimeout(function() { success(updated_cids) }, 0);
    }
};
