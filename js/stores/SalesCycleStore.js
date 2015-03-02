var _ = require('lodash');
var assign = require('object-assign');
var moment = require('moment');
var EventEmitter = require('events').EventEmitter;
var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');
var SessionStore = require('./SessionStore');
var ActivityStore = require('./ActivityStore');
var utils = require('../utils');

var CRMConstants = require('../constants/CRMConstants');
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
            moment(sc.date_created)
        }.bind(this)).reverse();
        if(!scycles) return null;
        return scycles[0];
    },

    byContact: function(contact_id) {
        return _.filter(this.getAll(), function(sc){
            return sc.contact_id == contact_id;
        });
    },

    openedByContact: function(contact_id) {
        var SALES_CYCLE_STATUS = utils.get_constants('sales_cycle').statuses_hash,
            sales_cycles = this.byContact(contact_id);
        return _.filter(sales_cycles, function(c){ return c.status !== SALES_CYCLE_STATUS.COMPLETED })
    },

    getAll: function() {
        return _.map(_salescycles, function(c) { return c });
    },

    getByIds: function(ids) {
        var sales_cycles = this.getAll();
        return _.filter(sales_cycles, function(c){ return _.indexOf(ids, c.id) !== -1 });
    },

    getGlobalForContact: function(contact_id) {
        var sales_cycles = this.byContact(contact_id);
        return _.find(sales_cycles, function(sc) { return sc.is_global })
    },

    getCyclesForContact: function(contact_id) {
        var ContactStore = require('./ContactStore');
        var contact = ContactStore.get(contact_id);
        var cycles = this.byContact(contact_id);
        if (!contact || !utils.isCompany(contact))
            return _.compact(cycles);
        _.forEach(contact.children, function(c_id){
            cycles.push(this.byContact(c_id));
        }.bind(this));
        return _.flatten(cycles);
    },

    getCreatedSalesCycle: function(obj) {
        return obj;
    },

    // getClosed: function() {
    //     var SALES_CYCLE_STATUS = utils.get_constants('sales_cycle').statuses_hash,
    //         sales_cycles = this.getAll();
    //     return _.filter(sales_cycles, function(c){ return c.status === SALES_CYCLE_STATUS.COMPLETED })
    // },

    getNonClosed: function() {
        var SALES_CYCLE_STATUS = utils.get_constants('sales_cycle').statuses_hash,
            sales_cycles = this.getAll();
        return _.filter(sales_cycles, function(c){ return c.status !== SALES_CYCLE_STATUS.COMPLETED })
    },

    getClosedCyclesNumber: function(user) {
        // TODO maybe use there this.getClosed()

        // by Askhat:
        // this function is used in profile view
        // here we should consider only cycles closed by this person
        // on cycle we do not mark who closed it and the only way is to find Activities with status = OUTCOME
        // by this information we could determine who closed the cycle
        // that's why user cannot manually create activity with status = OUTCOME
        var FEEDBACK_STATUSES = utils.get_constants('activity').feedback_hash;
        var closing_actvs = _.filter(ActivityStore.byUser(user),
            function(a){ return a.feedback_status == FEEDBACK_STATUSES.OUTCOME });
        var sales_cycles = _.map(closing_actvs, function(a){ return this.get(a.sales_cycle_id)}.bind(this));
        var rv = {
            'number': sales_cycles.length,
            'money': _.reduce(sales_cycles, function(sum, s) {
                        return sum + _.reduce(s.stat, function(s1, prod) {
                            return s1 + parseInt(prod.value)
                        }, 0);
                    }, 0)
        }
        return rv;
    },

    getOpenedCyclesNumber: function(user) {
        var sales_cycles = this.getNonClosed();
        return (_.filter(sales_cycles, function(c){ return c.author_id == user.id })).length;
    },

    setAll: function(obj) {
        _.forEach(obj.sales_cycles, function (sc){
            _salescycles[sc.id] = sc;
            _salescycles[sc.id].activities = [];
            _salescycles[sc.id].product_ids = obj.sales_cycles_to_products_map !== undefined && obj.sales_cycles_to_products_map[sc.id] || [];
        });
        _.forEach(obj.activities, function (actv){
            if(actv.sales_cycle_id in _salescycles)
                _salescycles[actv.sales_cycle_id].activities.push(actv.id);
        });
        this.emitChange();
    },

    set: function(sales_cycle) {
        _salescycles[sales_cycle.id] = this.getCreatedSalesCycle(sales_cycle);
        _salescycles[sales_cycle.id].activities = [];
        _salescycles[sales_cycle.id].product_ids = [];
    },

    updateStatusToPending: function(sales_cycle_id) {
        var SALES_CYCLE_STATUS = utils.get_constants('sales_cycle').statuses_hash;
        sc = _salescycles[sales_cycle_id];
        if (sc.status == SALES_CYCLE_STATUS.NEW)
            sc.status = SALES_CYCLE_STATUS.PENDING;
    }
});


SalesCycleStore.dispatchToken = CRMAppDispatcher.register(function(payload) {
    var ProductStore = require('./ProductStore');
    var action = payload.action;

    switch(action.type) {
        case ActionTypes.APP_LOAD_SUCCESS:
            var ContactStore = require('./ContactStore');
            CRMAppDispatcher.waitFor([ContactStore.dispatchToken]);
            if(action.object.sales_cycles !== undefined)
                SalesCycleStore.setAll(action.object);
            break;
        case ActionTypes.CREATE_ACTIVITY_SUCCESS:
            CRMAppDispatcher.waitFor([ActivityStore.dispatchToken]);
            var sales_cycle_id = action.object.sales_cycle_id,
                current_cycle = _salescycles[sales_cycle_id];

            current_cycle.activities.push(action.object.id);
            SalesCycleStore.updateStatusToPending(sales_cycle_id);
            SalesCycleStore.emitChange();
            break;
        case ActionTypes.CLOSE_SALES_CYCLE:
            var salesCycle = SalesCycleStore.getCreatedSalesCycle(action.object);
            SalesCycleStore.emitChange();
            break;
        case ActionTypes.CLOSE_SALES_CYCLE_SUCCESS:
            sales_cycle = action.object.sales_cycle;
            _salescycles[sales_cycle.id] = sales_cycle;
            SalesCycleStore.emitChange();
            break;
        case ActionTypes.CREATE_SALES_CYCLE:
            var salesCycle = SalesCycleStore.getCreatedSalesCycle(action.object);
            SalesCycleStore.emitChange();
            break;
        case ActionTypes.CREATE_SALES_CYCLE_SUCCESS:
            SalesCycleStore.set(SalesCycleStore.getCreatedSalesCycle(action.object));
            SalesCycleStore.emitChange();
            break;
        case ActionTypes.ADD_PRODUCT_TO_SALES_CYCLE:
            var salesCycle = SalesCycleStore.getCreatedSalesCycle(action.object);
            SalesCycleStore.emitChange();
            break;
        case ActionTypes.ADD_PRODUCT_TO_SALES_CYCLE_SUCCESS:
            _salescycles[action.object.sales_cycle_id].product_ids = action.object.product_ids;
            SalesCycleStore.emitChange();
            break;
        case ActionTypes.DELETE_PRODUCT_SUCCESS:
            CRMAppDispatcher.waitFor([ProductStore.dispatchToken]);
            var deleted_product = action.object;
            _(_salescycles).forEach(function(val, key) { _salescycles[key].product_ids = _.pull(val.product_ids, deleted_product.id); }).value();
            SalesCycleStore.emitChange();
        case ActionTypes.CREATE_CONTACT_SUCCESS:
            var ContactStore = require('./ContactStore');
            CRMAppDispatcher.waitFor([ContactStore.dispatchToken]);
            if( _.isObject(action.object.global_sales_cycle) ) {
                var sc = SalesCycleStore.getCreatedSalesCycle(action.object.global_sales_cycle);
                SalesCycleStore.set(sc);
                SalesCycleStore.emitChange();
            }
            break;
        case ActionTypes.IMPORT_CONTACTS_SUCCESS:
            var ContactStore = require('./ContactStore');
            CRMAppDispatcher.waitFor([ContactStore.dispatchToken]);
            _.forEach(action.object, function(c) {
                if( _.isObject(c.global_sales_cycle) ) {
                    var sc = SalesCycleStore.getCreatedSalesCycle(c.global_sales_cycle);
                    SalesCycleStore.set(sc);
                    SalesCycleStore.emitChange();
                }
            });
        default:
            // do nothing
    }

});

module.exports = SalesCycleStore;
