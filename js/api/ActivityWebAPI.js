var _ = require('lodash');
var $ = require('jquery');
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
/*
        $.ajax({
            url: '/api/v1/activity/',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(object)
        }).done(function (data, textStatus, xhr) {
                console.log('done')
                object = _.assign(object, data);
                success(object);

                console.log(object, data, 'Hi!');
            });
*/
        console.log(activityObject, object)

        // var rawActivities = JSON.parse(localStorage.getItem('activities')) || [];
        // rawActivities.push(object);
        // localStorage.setItem('activities', JSON.stringify(rawActivities));
        // setTimeout(function() {
        //     success(object);
        //     var author_id = object.author_id,
        //         extra = {'activity_id': object.id, 'salescycle_id': object.salescycle_id}
        //     SignalManager.send(ActionTypes.CREATE_ACTIVITY_SUCCESS, author_id, extra);
        // }, 0);
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
