var _ = require('lodash');
var request = require('../utils').request;
var CRMConstants = require('../constants/CRMConstants');

module.exports = {
    getAll: function(success, failure) {
        var rawComments = JSON.parse(localStorage.getItem('comments'));
        setTimeout(function(){
            success(rawComments);
        }, 0);
    },

    getByActivityID: function(activity_id, success, failure) {
        request('GET', '/api/v1/activity/'+activity_id+'/comments/')
            .on('error', failure.bind(null, activity_id))
            .end(function(res) {
                if (res.ok) {
                    success({'comments': res.body.objects});
                } else
                    failure(res);
            });
    },

    create: function(commentObject, success, failure) {
        request('POST', '/api/v1/comment/')
            .on('error', failure.bind(null, commentObject))
            .send(commentObject)
            .end(function(res) {
                if (res.ok) {
                    success(res.body);
                } else
                    failure(res);
            });
    },
};
