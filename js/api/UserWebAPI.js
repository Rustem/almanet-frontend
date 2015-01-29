var _ = require('lodash');
var SignalManager = require('./utils');
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;
var requestPost = require('../utils').requestPost;
var requestPatch = require('../utils').requestPatch;

module.exports = {

    toggleFollowing: function(object, success, failure) {
        obj = _.extend({}, {
            contact_ids: [object.id]});
        requestPost('/api/v1/crmuser/follow_unfollow/')
            .send(obj)
            .on('error', failure.bind(null, object))
            .end(function(res) {
                if (res.ok) {
                    success(res.body);
                } else {
                    failure(res.body);
                }
            });
        // var users = JSON.parse(localStorage.getItem('users'));
        // var user = _.find(users, function(u){ return u.id === object.user.id });
        // if(_.contains(user.unfollow_list, object.contact.id))
        // 	user.unfollow_list = _.without(user.unfollow_list, object.contact.id);
        // else
        // 	user.unfollow_list.push(object.contact.id);
        // localStorage.setItem('users', JSON.stringify(users));

    },

    editUser: function(user_id, object, success, failure) {
        requestPatch('/api/v1/user/'+ user_id + '/')
            .send(object)
            .on('error', failure.bind(null, user_id))
            .end(function(res) {
                if (res.ok) {
                    success(res.body);
                } else {
                    failure(res.body);
                }
            });
    },

    uploadUserpic: function(object, success, failure) {
        requestPost('/api/v1/user/upload_userpic/')
            .send(object)
            .on('error', failure.bind(null, object))
            .end(function(res) {
                if (res.ok) {
                    success(res.body);
                } else {
                    failure(res.body);
                }
            });
    },
};
