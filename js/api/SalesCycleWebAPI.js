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
            .send(salesCycleObject.closing_stats)
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
    add_products: function(salesCycleData, success, failure) {
        var put_object = {
            object_ids: salesCycleData.product_ids
        };

        request('put', '/api/v1/sales_cycle/'+salesCycleData.salescycle_id+'/products/')
            .send(put_object)
            .end(function(res) {
                if (res.ok) {
                    salesCycleData.product_ids = res.body.object_ids;
                    success(salesCycleData);
                } else {
                    failure(res);
                }
            });
    }
};
