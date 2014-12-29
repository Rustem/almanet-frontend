var _ = require('lodash');
var $ = require('jquery');
var SignalManager = require('./utils');
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;

module.exports = {
    getSubscriptions: function(userObject, success, failure) {
        $.get('api/v1/user/'+userObject.id+'/subscriptions/')
            .then(success, failure);
    },
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
};
