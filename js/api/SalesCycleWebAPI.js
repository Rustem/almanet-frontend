var _ = require('lodash');
var requestPost = require('../utils').requestPost;
var CRMConstants = require('../constants/CRMConstants');
var SignalManager = require('./utils');
var SALES_CYCLE_STATUS = CRMConstants.SALES_CYCLE_STATUS;
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;

module.exports = api = {
    getAll: function(success, failure) {
        var salescycles = JSON.parse(localStorage.getItem('salescycles'));
        setTimeout(function(){
            success(salescycles);
        }, 0);
    },
    close: function(salesCycleObject, success, failure) {
        // set salesCycle to local storage
        var rawSalesCycles = JSON.parse(localStorage.getItem('salescycles')) || [];
        var curCycle = _.find(rawSalesCycles, function(sc){ return sc.id === salesCycleObject.id });
        curCycle.status = SALES_CYCLE_STATUS.FINISHED;
        curCycle.real_value = salesCycleObject.real_value;
        localStorage.setItem('salescycles', JSON.stringify(rawSalesCycles));

        // simulate success callback
        setTimeout(function() {
            success(curCycle);
            SignalManager.send(ActionTypes.CLOSE_SALES_CYCLE_SUCCESS, curCycle);
        }, 0);
    },
    create: function(salesCycleObject, success, failure) {
        var object = _.assign(salesCycleObject, {
            status: SALES_CYCLE_STATUS.NEW, // TODO: use AppState constants
            product_ids: []
        });
        requestPost('/api/v1/sales_cycle/')
            .send(object)
            .end(function(res) {
                if (res.ok) {
                    object = _.assign(object, res.body);
                    success(object);
                } else {
                    failure(res);
                }
            });
    },
    add_products: function(salesCycleObject, success, failure) {
        var rawSalesCycles = JSON.parse(localStorage.getItem('salescycles')) || [];
        var curCycle = _.find(rawSalesCycles, function(sc){ return sc.id === salesCycleObject.salescycle_id });
        curCycle.products = salesCycleObject.products;
        localStorage.setItem('salescycles', JSON.stringify(rawSalesCycles));

        // simulate success callback
        setTimeout(function() {
            success(curCycle);
        }, 0);
    }
};

function update_state(author_id, extra) {
    var rawSalesCycles = JSON.parse(localStorage.getItem('salescycles')) || [],
        current_cycle = _.find(rawSalesCycles, function(sc){
            return sc.id === extra.salescycle_id });
    if(current_cycle.status == SALES_CYCLE_STATUS.NEW) {
        current_cycle.status = SALES_CYCLE_STATUS.PENDING;
        localStorage.setItem('salescycles', JSON.stringify(rawSalesCycles));
    }
}
SignalManager.connect(ActionTypes.CREATE_ACTIVITY_SUCCESS, update_state);
