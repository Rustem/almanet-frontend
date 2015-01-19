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

    // TODO: delete this
    fakeGet: function(id) {
        return _products['prod_1'];
    }

});


ProductStore.dispatchToken = CRMAppDispatcher.register(function(payload) {

    var action = payload.action;
    switch(action.type) {
        case ActionTypes.APP_LOAD_SUCCESS:
            CRMAppDispatcher.waitFor([SessionStore.dispatchToken]);
            _.forEach(action.object.products, function(product){
                _products[product.id] = product;
            });
            ProductStore.emitChange();
            break;
        case ActionTypes.CREATE_PRODUCT_SUCCESS:
            var product = action.object;
            _products[product.id] = product;
            ProductStore.emitChange();
            break;
        case ActionTypes.EDIT_PRODUCT_SUCCESS:
            var product = action.object;
            _products[product.id] = product;
            ProductStore.emitChange();
            break;
        case ActionTypes.CLOSE_SALES_CYCLE:
            CRMAppDispatcher.waitFor([SalesCycleStore.dispatchToken]);
            var value = action.object.real_value,
                prod_ids = action.object.product_ids;
            if(!prod_ids) break;

            // TODO

            for(var i=0; i<prod_ids.length; i++) {
                _products[prod_ids[i]].current_value += (value * 1. / prod_ids.length);
            }
            ProductStore.emitChange();
            break;
        default:
            // do nothing
    }

});

module.exports = ProductStore;
