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
        _.forEach(rawSalesCycles, function(sc){
            if(sc.id == salesCycleObject.sales_cycle_id) {
                console.log(sc);
                sc.status = true;
                sc.value = salesCycleObject.sales_cycle_close_value;
            }
        });
        console.log(rawSalesCycles);
        localStorage.setItem('salescycles', JSON.stringify(rawSalesCycles));

        // simulate success callback
        setTimeout(function() {
            success(salesCycleObject);
        }, 0);
    },
};
