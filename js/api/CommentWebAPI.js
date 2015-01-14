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
            .end(function(res) {
                if (res.ok) {
                    success({'comments': res.body.objects});
                } else
                    failure(res);
            });
    },

    create: function(commentObject, success, failure) {
        var timeNow = Date.now();
        var obj = _.extend({}, {
            id: 'com_' + timeNow,
            at: timeNow}, commentObject);

        // set contact to local storage
        var rawComments = JSON.parse(localStorage.getItem('comments')) || [];
        rawComments.push(obj);
        localStorage.setItem('comments', JSON.stringify(rawComments));

        // simulate success callback
        setTimeout(function() {
            success(obj);
        }, 0);
    },
};
