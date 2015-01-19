var _ = require('lodash');
var SignalManager = require('./utils');
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;
var requestPost = require('../utils').requestPost;
var requestPatch = require('../utils').requestPatch;

module.exports = {
    getAll: function(success, failure) {
        var users = JSON.parse(localStorage.getItem('users'));
        setTimeout(function(){
            success(users);
        }, 0);
    },

    toggleFollowing: function(object, success, failure) {
        obj = _.extend({}, {
            contact_ids: [object.id]});
        requestPost('/api/v1/crmuser/follow_unfollow/')
            .send(obj)
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
        requestPatch('/api/v1/user/'+user_id)
            .send(object)
            .end(function(res) {
                if (res.ok) {
                    success(res.body);
                } else {
                    failure(res.body);
                }
            });
        // var rawUsers = JSON.parse(localStorage.getItem('users')) || [],
        //     user = null;
        // for(var i = 0; i<rawUsers.length; i++) {
        //     var cur = rawUsers[i];
        //     if(cur.id === user_id) {
        //         rawUsers[i] = object;
        //         user = rawUsers[i];
        //         break;
        //     }
        // }
        // localStorage.setItem('users', JSON.stringify(rawUsers));
    },
};
