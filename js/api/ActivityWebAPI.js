var _ = require('lodash');
var request = require('../utils').request;
var SignalManager = require('./utils');
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;

module.exports = {
    create: function(activityObject, success, failure) {
        var object = _.omit(activityObject, 'contact_id');
        request('POST','/api/v1/activity/')
            .send(object)
            .on('error', failure.bind(null, object))
            .end(function(res) {
                if (res.ok) {
                    success(res.body);
                    var extra = {};
                    SignalManager.send(ActionTypes.CREATE_ACTIVITY_SUCCESS, extra);
                } else {
                    failure(res);
                }
            });
    },
    mark_as_read: function(ids, success, failure) {
        request('POST','/api/v1/activity/read/')
            .send(ids)
            .on('error', failure.bind(null, ids))
            .end(function(res) {
                if (res.ok) {
                    success(ids);
                } else {
                    failure(res);
                }
            });
    }
};
