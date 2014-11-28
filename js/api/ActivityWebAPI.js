var _ = require('lodash');

module.exports = {
    getAll: function(success, failure) {
        var activities = JSON.parse(localStorage.getItem('activities'));
        setTimeout(function(){
            success(activities);
        }, 0);
    },

    create: function(activityObject, success, failure) {
        var timeNow = Date.now();
        var object = _.extend({}, {
            id: 'act_' + timeNow,
            at: timeNow
        }, activityObject);

        var rawActivities = JSON.parse(localStorage.getItem('activities')) || [];
        rawActivities.push(object);
        localStorage.setItem('activities', JSON.stringify(rawActivities));

        setTimeout(function() {
            success(object);
        }, 0);
    }
};
