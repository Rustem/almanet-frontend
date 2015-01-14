var _ = require('lodash');
var SignalManager = require('./utils');
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;

module.exports = {
    getAll: function(success, failure) {
        var users = JSON.parse(localStorage.getItem('users'));
        setTimeout(function(){
            success(users);
        }, 0);
    },

    toggleFollowing: function(object, success, failure) {
        var users = JSON.parse(localStorage.getItem('users'));
        var user = _.find(users, function(u){ return u.id === object.user.id });
        if(_.contains(user.unfollow_list, object.contact.id))
        	user.unfollow_list = _.without(user.unfollow_list, object.contact.id);
        else
        	user.unfollow_list.push(object.contact.id);
        localStorage.setItem('users', JSON.stringify(users));
        SignalManager.send(ActionTypes.TOGGLE_FOLLOWING_SUCCESS, user);
        
        setTimeout(function(){
            success(user);
        }, 0);
    },

    editUser: function(user_id, object, success, failure) {
        var rawUsers = JSON.parse(localStorage.getItem('users')) || [],
            user = null;
        for(var i = 0; i<rawUsers.length; i++) {
            var cur = rawUsers[i];
            if(cur.id === user_id) {
                rawUsers[i] = object;
                user = rawUsers[i];
                break;
            }
        }
        localStorage.setItem('users', JSON.stringify(rawUsers));
        setTimeout(function() {
            console.log(user);
            success(user);
        }, 0);
    },
};
