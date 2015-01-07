var _ = require('lodash');
var CRMConstants = require('../constants/CRMConstants');

module.exports = {
    getAll: function(success, failure) {
        var rawFilters = JSON.parse(localStorage.getItem('filters'));
        setTimeout(function(){
            success(rawFilters);
        }, 0);
    },
    create: function(filterObject, success, failure) {
        var timeNow = Date.now();
        var obj = _.extend({}, {
            id: 'f_' + timeNow,
            at: timeNow}, filterObject);

        // set filter to local storage
        var rawFilters = JSON.parse(localStorage.getItem('filters')) || [];
        rawFilters.push(obj);
        localStorage.setItem('filters', JSON.stringify(rawFilters));

        // simulate success callback
        setTimeout(function() {
            success(obj);
        }, 0);
    },
    edit: function(filterObject, success, failure) {
        // set filter to local storage
        var rawFilters = JSON.parse(localStorage.getItem('filters')) || [];
        for(var i = 0; i<rawFilters.length; i++) {
            var cur = rawFilters[i];
            if(cur.id === filterObject.id) {
                rawFilters[i] = filterObject;
                break;
            }
        }
        localStorage.setItem('filters', JSON.stringify(rawFilters));

        // simulate success callback
        setTimeout(function() {
            success(filterObject);
        }, 0);
    },
};
