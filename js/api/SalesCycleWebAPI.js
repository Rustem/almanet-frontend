var _ = require('lodash');
var request = require('../utils').request;
var AppCommonStore = require('../stores/AppCommonStore');

module.exports = api = {
    getAll: function(success, failure) {
        var salescycles = JSON.parse(localStorage.getItem('salescycles'));
        setTimeout(function(){
            success(salescycles);
        }, 0);
    },
    close: function(salesCycleObject, success, failure) {
        request('put', '/api/v1/sales_cycle/'+salesCycleObject.id+'/close/')
            .send(salesCycleObject.real_value)
            .end(function(res) {
                if (res.ok) {
                    success(res.body);
                } else {
                    failure(res);
                }
            });

    },
    create: function(salesCycleObject, success, failure) {
        var SALES_CYCLE_STATUS = AppCommonStore.get_constants('sales_cycle').statuses_hash,
            object = _.assign(salesCycleObject, {
                status: SALES_CYCLE_STATUS.NEW,
                product_ids: []
            });
        request('post', '/api/v1/sales_cycle/')
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
        var patch_object = {
            product_ids: salesCycleObject.product_ids
        };

        request('patch', '/api/v1/sales_cycle/'+salesCycleObject.salescycle_id+'/')
            .send(patch_object)
            .end(function(res) {
                if (res.ok) {
                    success(res.body);
                } else {
                    failure(res);
                }
            });
    }
};
