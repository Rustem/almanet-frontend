var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var CRMConstants = require('../constants/CRMConstants');
var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');
var SessionStore = require('./SessionStore');
var ActivityStore = require('./ActivityStore');

var ActionTypes = CRMConstants.ActionTypes;
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

    getCreatedSalesCycle: function(obj) {
        return obj;
    }

});


SalesCycleStore.dispatchToken = CRMAppDispatcher.register(function(payload) {

    var action = payload.action;
    switch(action.type) {
        case ActionTypes.APP_LOAD_SUCCESS:
            _.forEach(action.object.salescycles, function(salescycle){
                _salescycles[salescycle.id] = salescycle;
                _salescycles[salescycle.id].activities = [];
                _salescycles[salescycle.id].products = [];
            });
            _.forEach(action.object.activities, function(actv){
                if(actv.salescycle_id in _salescycles)
                    _salescycles[actv.salescycle_id].activities.push(actv.id);
            });
            SalesCycleStore.emitChange();
            break;
        case ActionTypes.CREATE_ACTIVITY_SUCCESS:
            CRMAppDispatcher.waitFor([ActivityStore.dispatchToken]);
            var salescycle_id = action.object.salescycle_id;
            console.log(_salescycles, "cycles", action.object);
            _salescycles[salescycle_id].activities.push(action.object.id);
            SalesCycleStore.emitChange();
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
            _salescycles[action.object.id].products.push(action.object.product_id);
            SalesCycleStore.emitChange();
            break;
        default:
            // do nothing
    }

});

module.exports = SalesCycleStore;
