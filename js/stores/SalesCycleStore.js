var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var CRMConstants = require('../constants/CRMConstants');
var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');
var SessionStore = require('./SessionStore');
var ActivityStore = require('./ActivityStore');
var ContactStore = require('./ContactStore');
var utils = require('../utils');

var SALES_CYCLE_STATUS = CRMConstants.SALES_CYCLE_STATUS;
var ActionTypes = CRMConstants.ActionTypes;
var GLOBAL_SALES_CYCLE_ID = CRMConstants.GLOBAL_SALES_CYCLE_ID;

var CHANGE_EVENT = 'change';

var _salescycles = {};

var SalesCycleStore = assign({}, EventEmitter.prototype, {
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
        return _salescycles[id];
    },

    getLatestOne: function() {
        var scycles = _.sortBy(this.getAll(), function(sc) {
            sc.at
        }.bind(this)).reverse();
        if(!scycles) return null;
        return scycles[0];
    },

    byContact: function(contact_id) {
        return _.filter(this.getAll(), function(sc){
            return sc.contact_id == contact_id;
        });
    },

    getAll: function() {
        return _.map(_salescycles, function(c) { return c });
    },

    getByIds: function(ids) {
        var salescycles = this.getAll();
        return _.filter(salescycles, function(c){ return _.indexOf(ids, c.id) !== -1 });
    },

    getGlobal: function() {
        return _salescycles[GLOBAL_SALES_CYCLE_ID];
    },

    getCyclesForCurrentContact: function(contact_id) {
        // strange: without this ContactStore is empty object and .get function is undefined
        var ContactStore = require('./ContactStore');
        var contact = ContactStore.get(contact_id);
        var cycles = [this.getGlobal()].concat(this.byContact(contact_id));
        if (!contact || !utils.isCompany(contact))
            return cycles;
        _.forEach(contact.contacts, function(c_id){
            cycles.push(this.byContact(c_id));
        }.bind(this));
        return _.flatten(cycles);
    },

    getCreatedSalesCycle: function(obj) {
        return obj;
    },

    getClosedCyclesNumber: function(user) {
        var closing_actvs = _.filter(ActivityStore.byUser(user), function(a){ return a.feedback == "outcome" });
        var salescycles = _.map(closing_actvs, function(a){ return this.get(a.salescycle_id)}.bind(this));
        var rv = {
            'number': salescycles.length,
            'money': _.reduce(salescycles, function(sum, s) {
                      return sum + parseInt(s.real_value);
                    }, 0)
        }
        return rv;
    },

    getOpenedCyclesNumber: function(user) {
        var salescycles = this.getAll();
        return (_.filter(salescycles, function(c){ return c.author_id == user.id && c.status != "FINISHED" })).length;
    },

});


SalesCycleStore.dispatchToken = CRMAppDispatcher.register(function(payload) {

    var action = payload.action;
    switch(action.type) {
        case ActionTypes.APP_LOAD_SUCCESS:
            _.forEach(action.object.salescycles, function(salescycle){
                _salescycles[salescycle.id] = salescycle;
                _salescycles[salescycle.id].activities = [];
                _salescycles[salescycle.id].products = salescycle.products;
            });
            _.forEach(action.object.activities, function(actv){
                if(actv.salescycle_id in _salescycles)
                    _salescycles[actv.salescycle_id].activities.push(actv.id);
            });
            SalesCycleStore.emitChange();
            break;
        case ActionTypes.CREATE_ACTIVITY_SUCCESS:
            CRMAppDispatcher.waitFor([ActivityStore.dispatchToken]);
            var salescycle_id = action.object.salescycle_id,
                current_cycle = _salescycles[salescycle_id];
            current_cycle.activities.push(action.object.id);
            if (current_cycle.status == SALES_CYCLE_STATUS.NEW)
                current_cycle.status = SALES_CYCLE_STATUS.PENDING;
            SalesCycleStore.emitChange();
            break;
        case ActionTypes.CLOSE_SALES_CYCLE:
            var salesCycle = SalesCycleStore.getCreatedSalesCycle(action.object);
            SalesCycleStore.emitChange();
            break;
        case ActionTypes.CLOSE_SALES_CYCLE_SUCCESS:
            _salescycles[action.object.id] = action.object;
            SalesCycleStore.emitChange();
            break;
        case ActionTypes.CREATE_SALES_CYCLE:
            var salesCycle = SalesCycleStore.getCreatedSalesCycle(action.object);
            SalesCycleStore.emitChange();
            break;
        case ActionTypes.CREATE_SALES_CYCLE_SUCCESS:
            var salesCycle_with_id = SalesCycleStore.getCreatedSalesCycle(action.object);
            _salescycles[salesCycle_with_id.id] = salesCycle_with_id;
            SalesCycleStore.emitChange();
            break;
        case ActionTypes.ADD_PRODUCT_TO_SALES_CYCLE:
            var salesCycle = SalesCycleStore.getCreatedSalesCycle(action.object);
            SalesCycleStore.emitChange();
            break;
        case ActionTypes.ADD_PRODUCT_TO_SALES_CYCLE_SUCCESS:
            _salescycles[action.object.id].products = action.object.products;
            SalesCycleStore.emitChange();
            break;
        default:
            // do nothing
    }

});

module.exports = SalesCycleStore;
