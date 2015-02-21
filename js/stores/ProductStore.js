var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var CRMConstants = require('../constants/CRMConstants');
var CRMAppDispatcher = require('../dispatcher/CRMAppDispatcher');
var SessionStore = require('./SessionStore');
var SalesCycleStore = require('./SalesCycleStore');

var ActionTypes = CRMConstants.ActionTypes;
var CHANGE_EVENT = 'change';
var _products = {};

var ProductStore = assign({}, EventEmitter.prototype, {
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
        return _products[id];
    },

    getLatest: function() {
        var products = this.getAll();
        if(!products) return null;
        return _.sortBy(products, function(p){
            return p.date_created
        }).reverse()[0];
    },

    getAll: function() {
        return _.map(_products, function(c) { return c });
    },

    getByIds: function(ids) {
        var products = this.getAll();
        return _.filter(products, function(p){ return _.indexOf(ids, p.id) !== -1 });
    },

    updateStatValue: function(id) {
        var inStat = function(stat, product_id) {
                return _.filter(stat, function(st){ return st.product_id === product_id; });
            },
            stats = _.pluck(SalesCycleStore.getAll(), 'stat'),
            stat_value = _.reduce(stats, function(acc, stat) {
                var t = inStat(stat, id);
                return acc + (t.length>0 ? t[0].value : 0);
            }, 0);

        _products[id].stat_value = stat_value;
    },

    delete: function(product) {
        delete _products[product.id];
        this.emitChange();
    },

    setAll: function(obj) {
        _.forEach(obj.products, function(product){
            _products[product.id] = product;
            this.updateStatValue(product.id);
        }.bind(this));
        this.emitChange();
    },

});


ProductStore.dispatchToken = CRMAppDispatcher.register(function(payload) {

    var action = payload.action;
    switch(action.type) {
        case ActionTypes.APP_LOAD_SUCCESS:
            CRMAppDispatcher.waitFor([SessionStore.dispatchToken, SalesCycleStore.dispatchToken]);
            if(action.object.products !== undefined)
                ProductStore.setAll(action.object)
            break;
        case ActionTypes.CREATE_PRODUCT_SUCCESS:
            var product = action.object;
            _products[product.id] = product;
            _products[product.id].stat_value = 0;
            ProductStore.emitChange();
            break;
        case ActionTypes.EDIT_PRODUCT_SUCCESS:
            var product = action.object;
            _products[product.id] = product;
            ProductStore.emitChange();
            break;
        case ActionTypes.CLOSE_SALES_CYCLE_SUCCESS:
            CRMAppDispatcher.waitFor([SalesCycleStore.dispatchToken]);

            _(ProductStore.getAll()).forEach(function (product) {
                ProductStore.updateStatValue(product.id);
            });
            ProductStore.emitChange();
            break;
        case ActionTypes.DELETE_PRODUCT_SUCCESS:
            ProductStore.delete(action.object);
            break;
        default:
            // do nothing
    }

});

module.exports = ProductStore;
