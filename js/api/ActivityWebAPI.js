var _ = require('lodash');
var request = require('superagent');
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
        var object = _.pick(activityObject,
                            ['author_id', 'salescycle_id', 'description']);
        // object['feedback'] = activityObject.feedback;
        request
            .post('/api/v1/activity/')
            .type('json')
            .send(object)
            .end(function (res) {
                if (res.ok) {
                    object = _.assign(object, res.body);
                    success(object);
                } else {}
            });
    },
    updateNewStatus: function(success) {
        var rawActivities = JSON.parse(localStorage.getItem('activities')) || [],
            updated_cids = [];
        _.forEach(rawActivities, function(activity){
            var updated = null;
            if(activity.new_status === CREATION_STATUS.COLD){
                activity.new_status = CREATION_STATUS.WARM;
                updated = [activity.id, activity.new_status];
            } else if(activity.new_status === CREATION_STATUS.WARM) {
                activity.new_status = CREATION_STATUS.HOT;
                updated = [activity.id, activity.new_status];
            }
            if(updated) updated_cids.push(updated);
        });
        localStorage.setItem('activities', JSON.stringify(rawActivities));

        setTimeout(function() { success(updated_cids) }, 0);
    }
};
