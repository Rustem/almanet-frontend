var _ = require('lodash');

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
        curCycle.status = true;
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
            status: false,
            activities:[],
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
};
