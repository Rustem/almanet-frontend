var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var CRMConstants = require('../constants/CRMConstants');
var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');
var SessionStore = require('./SessionStore');
var ContactStore = require('./ContactStore');
var ActionTypes = CRMConstants.ActionTypes;
var utils = require('../utils');

var CHANGE_EVENT = 'change';
var _activities = {};

var ActivityStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    get: function(id) {
        return _activities[id];
    },

    getByDate: function(reversed) {
        var activities = this.getAll();
        activities = _.sortBy(activities, function(activity){ return activity.at });
        return activities.reverse();
    },

    byUser: function(user) {
        return _.filter(this.getByDate(true), function(actv){
            return actv.author_id === user.id;
        })
    },

    bySalesCycle: function(salescycle_id) {
        return _.filter(this.getByDate(true), function(actv){
            return actv.salescycle_id === salescycle_id;
        })
    },

    bySalesCycles: function(ids) {
        rv = _.map(ids, function(id){
            return this.bySalesCycle(id);
        }.bind(this));
        return _.sortBy(_.flatten(rv), 'at').reverse();
    },

    getNew: function(user) {
        return _.filter(this.myFeed(user), utils.isNewObject)
    },

    hasNew: function(user) {
        // default value (http://stackoverflow.com/questions/148901/is-there-a-better-way-to-do-optional-function-parameters-in-javascript)
        user = (typeof user === "undefined") ? false : user;
        // if user is passed so it implies that we need only activities in myFeed
        if(user)
            return _.any(this.myFeed(user), function(activity){ return utils.isNewObject(activity) })
        return _.any(this.getAll(), function(activity){ return utils.isNewObject(activity) })
    },

    getAll: function() {
        return _.map(_activities, function(a) { return a });
    },

    getByIds: function(ids) {
        var activities = this.getAll();
        return _.filter(activities, function(a){ return _.indexOf(ids, a.id) !== -1 });
    },

    myFeed: function(user) {
        // strange 2
        var ContactStore = require('./ContactStore');
        var activities = this.getByDate();
        return _.filter(activities, function(a){ return !(ContactStore.byActivity(a) && _.contains(user.unfollow_list, ContactStore.byActivity(a).id)) });
    },

    profileFeed: function(user) {
        var activities = this.getByDate();
        return _.filter(activities, function(a){ return a.author_id == user.id });
    },

    getMentions: function(user) {
        return [];
    },

    getCreatedActivity: function(obj) {
        return obj;
    }

});


ActivityStore.dispatchToken = CRMAppDispatcher.register(function(payload) {

    var action = payload.action;
    switch(action.type) {
        case ActionTypes.APP_LOAD_SUCCESS:
            CRMAppDispatcher.waitFor([SessionStore.dispatchToken]);
            _.forEach(action.object.activities, function(activity){
                _activities[activity.id] = activity;
            });
            ActivityStore.emitChange();
            break;
        case ActionTypes.CREATE_ACTIVITY_SUCCESS:
            var a = ActivityStore.getCreatedActivity(action.object);
            _activities[a.id] = a;
            ActivityStore.emitChange();
            break;
        case ActionTypes.ACTIVITY_UPDATE_NEW_STATUS:
            var update_info = action.object['update_info'];
            for(var i = 0; i<update_info.length; i++) {
                var act_id = update_info[i][0], newStatus = update_info[i][1];
                _activities[act_id].new_status = newStatus;
            }
            ActivityStore.emitChange();
            break;
        default:
            // do nothing
    }

});

module.exports = ActivityStore;
