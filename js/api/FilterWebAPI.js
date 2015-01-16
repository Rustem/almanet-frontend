var _ = require('lodash');
var CRMConstants = require('../constants/CRMConstants');
var requestPost = require('../utils').requestPost;
var requestPatch = require('../utils').requestPatch;
var requestDelete = require('../utils').requestDelete;

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
                if (res.ok) {
                    obj = _.assign(obj, res.body);
                    success(obj);
                } else {
                    failure(obj);
                }
            });
    },
    edit: function(obj, success, failure) {
        requestPatch('/api/v1/filter/'+obj.id)
            .send(obj)
            .end(function(res) {
                if (res.ok) {
                    obj = _.assign(obj, res.body);
                    success(obj);
                } else {
                    failure(obj);
                }
            });
    },
    delete: function(id, success, failure) {
        requestDelete('/api/v1/filter/'+id)
            .end(function(res) {
                if (res.ok) {
                    success(id);
                } else {
                    failure(id);
                }
            });
    },
};
