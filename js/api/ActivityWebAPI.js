var _ = require('lodash');
var request = require('../utils').request;
var SignalManager = require('./utils');
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;

module.exports = {
    getAll: function(success, failure) {
        var activities = JSON.parse(localStorage.getItem('activities'));
        setTimeout(function(){
            success(activities);
        }, 0);
    },

    create: function(activityObject, success, failure) {
        var object = _.omit(activityObject, 'contact_id');
        request('POST','/api/v1/activity/')
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
    mark_as_read: function(ids, success) {
        request('POST','/api/v1/activity/read/')
            .send(ids)
            .end(function(res) {
                if (res.ok) {
                    success(ids);
                } else {
                    failure(res);
                }
            });
    }
};
