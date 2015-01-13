var _ = require('lodash');
var SignalManager = require('./utils');
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;
var requestPost = require('../utils').requestPost;

module.exports = {
    getAll: function(success, failure) {
        var users = JSON.parse(localStorage.getItem('users'));
        setTimeout(function(){
            success(users);
        }, 0);
    },

    toggleFollowing: function(object, success, failure) {
        console.log(object);
        obj = _.extend({}, {
            contact_ids: [object.id]});
        requestPost('/api/v1/crmuser/follow_unfollow/')
            .send(obj)
            .end(function(res) {
                console.log(res);
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
};
