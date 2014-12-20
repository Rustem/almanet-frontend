var _ = require('lodash');
var CRMConstants = require('../constants/CRMConstants');

module.exports = {
    getAll: function(success, failure) {
        var rawComments = JSON.parse(localStorage.getItem('comments'));
        setTimeout(function(){
            success(rawComments);
        }, 0);
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
