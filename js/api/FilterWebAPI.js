var _ = require('lodash');
var CRMConstants = require('../constants/CRMConstants');
var requestPost = require('../utils').requestPost;
var requestPatch = require('../utils').requestPatch;
var requestDelete = require('../utils').requestDelete;
var SignalManager = require('./utils');
var ActionTypes = CRMConstants.ActionTypes;

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
            .on('error', failure.bind(null, obj))
            .end(function(res) {
                if (res.ok) {
                    obj = _.assign(obj, res.body);
                    success(obj);

                    // notification
                    var author_id = obj.author_id,
                        extra = {'filter_title': obj.title};
                    SignalManager.send(ActionTypes.CREATE_FILTER_SUCCESS, author_id, extra);
                } else {
                    failure(obj);
                }
            });
    },
    edit: function(obj, success, failure) {
        requestPatch('/api/v1/filter/'+obj.id + '/')
            .send(obj)
            .on('error', failure.bind(null, obj))
            .end(function(res) {
                if (res.ok) {
                    obj = _.assign(obj, res.body);
                    success(obj);

                    // notification
                    var author_id = obj.author_id,
                        extra = {'filter_title': obj.title};
                    SignalManager.send(ActionTypes.EDIT_FILTER_SUCCESS, author_id, extra);
                } else {
                    failure(obj);
                }
            });
    },
    delete: function(id, success, failure) {
        requestDelete('/api/v1/filter/'+id + '/')
            .on('error', failure.bind(null, id))
            .end(function(res) {
                if (res.ok) {
                    success(id);
                    SignalManager.send(ActionTypes.DELETE_FILTER_SUCCESS, null, null);
                } else {
                    failure(id);
                }
            });
    },
};
