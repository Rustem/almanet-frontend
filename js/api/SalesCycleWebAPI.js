var _ = require('lodash');
var CRMConstants = require('../constants/CRMConstants');

var SALES_CYCLE_STATUS = CRMConstants.SALES_CYCLE_STATUS;

module.exports = {
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
        }, 0);
    },
    create: function(salesCycleObject, success, failure) {
        var timeNow = Date.now();
        var obj = _.extend({}, {
            id: 'sales_' + timeNow,
            at: timeNow,
            status: SALES_CYCLE_STATUS.NEW,
            activities:[],
            products:[],
            user_ids:[]}, salesCycleObject);
        // set contact to local storage
        var rawSalesCycles = JSON.parse(localStorage.getItem('salescycles')) || [];
        rawSalesCycles.push(obj);
        localStorage.setItem('salescycles', JSON.stringify(rawSalesCycles));

        // simulate success callback
        setTimeout(function() {
            success(obj);
        }, 0);
    },
    add_product: function(salesCycleObject, success, failure) {
        var rawSalesCycles = JSON.parse(localStorage.getItem('salescycles')) || [];
        var curCycle = _.find(rawSalesCycles, function(sc){ return sc.id === salesCycleObject.id });
        curCycle.products.push(salesCycleObject.product_id);
        localStorage.setItem('salescycles', JSON.stringify(rawSalesCycles));

        // simulate success callback
        setTimeout(function() {
            success(salesCycleObject);
        }, 0);
    },
};
