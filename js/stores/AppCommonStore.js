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
var _constants = {};

var AppCommonStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    get_constants: function(object_name) {
        return _constants[object_name];
    },

    // getByDate: function(reversed) {
    //     var activities = this.getAll();
    //     activities = _.sortBy(activities, function(activity){ return activity.at });
    //     return activities.reverse();
    // },

    // bySalesCycle: function(salescycle_id) {
    //     return _.filter(this.getByDate(true), function(actv){
    //         // TODO was '===', salescycle_id in DB - int, in Routes - string
    //         return actv.salescycle_id == salescycle_id;
    //     })
    // },

    // bySalesCycles: function(ids) {
    //     rv = _.map(ids, function(id){
    //         return this.bySalesCycle(id);
    //     }.bind(this));
    //     return _.sortBy(_.flatten(rv), 'at').reverse();
    // },

    // getNew: function(user) {
    //     return _.filter(this.myFeed(user), utils.isNewObject)
    // },

    // hasNew: function(user) {
    //     // default value (http://stackoverflow.com/questions/148901/is-there-a-better-way-to-do-optional-function-parameters-in-javascript)
    //     user = (typeof user === "undefined") ? false : user;
    //     // if user is passed so it implies that we need only activities in myFeed
    //     if(user)
    //         return _.any(this.myFeed(user), function(activity){ return utils.isNewObject(activity) })
    //     return _.any(this.getAll(), function(activity){ return utils.isNewObject(activity) })
    // },

    // getByIds: function(ids) {
    //     var activities = this.getAll();
    //     return _.filter(activities, function(a){ return _.indexOf(ids, a.id) !== -1 });
    // },

    getAll: function() {
        return _constants;
    },

    genSalesCycleStatusesHash: function() {
        var statuses_hash = _.reduce(_constants['sales_cycle']['statuses'], function(acc, x) { acc[x[1].toUpperCase()] = x[0]; return acc; }, {});
        _constants['sales_cycle']['statuses_hash'] = statuses_hash
    },

    setAll: function(obj) {
        _constants = obj;

        this.genSalesCycleStatusesHash();

        this.emitChange();
    }

});


AppCommonStore.dispatchToken = CRMAppDispatcher.register(function(payload) {

    var action = payload.action;
    switch(action.type) {
        case ActionTypes.APP_LOAD_SUCCESS:
            AppCommonStore.setAll(action.object.constants);
            break;
        default:
            // do nothing
    }

});

module.exports = AppCommonStore;
