var _ = require('lodash');
var CRMConstants = require('../constants/CRMConstants');
var requestPost = require('../utils').requestPost;
var requestPatch = require('../utils').requestPatch;

module.exports = {
    getAll: function(success, failure) {
        var rawFilters = JSON.parse(localStorage.getItem('filters'));
        setTimeout(function(){
            success(rawFilters);
        }, 0);
    },
    create: function(obj, success, failure) {
        requestPost('/api/v1/filter/')
            .send(obj)
            .end(function(res) {
                console.log(res);
                return;
                if (res.ok) {
                    obj = _.assign(obj, res.body);
                    success(obj);
                } else {
                    failure(obj);
                }
            });
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
