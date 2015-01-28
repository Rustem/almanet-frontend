var _ = require('lodash');
var request = require('../utils').request;
var SignalManager = require('./utils');
var CRMConstants = require('../constants/CRMConstants');
var utils = require('../utils');

var ActionTypes = CRMConstants.ActionTypes;

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
                    SignalManager.send(ActionTypes.CLOSE_SALES_CYCLE_SUCCESS, salesCycleObject);
                    success(res.body);
                } else {
                    failure(res);
                }
            });
    },
    create: function(salesCycleObject, success, failure) {
        var SALES_CYCLE_STATUS = utils.get_constants('sales_cycle').statuses_hash;
            object = _.assign(salesCycleObject, {
                status: SALES_CYCLE_STATUS.NEW
            });

        request('POST', '/api/v1/sales_cycle/')
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

        request('put', '/api/v1/sales_cycle/'+salesCycleData.sales_cycle_id+'/products/')
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

// function update_state(author_id, extra) {
//     var rawSalesCycles = JSON.parse(localStorage.getItem('salescycles')) || [],
//         current_cycle = _.find(rawSalesCycles, function(sc){
//             return sc.id === extra.salescycle_id });
//     if(current_cycle.status == SALES_CYCLE_STATUS.NEW) {
//         current_cycle.status = SALES_CYCLE_STATUS.PENDING;
//         localStorage.setItem('salescycles', JSON.stringify(rawSalesCycles));
//     }
// }
// SignalManager.connect(ActionTypes.CREATE_ACTIVITY_SUCCESS, update_state);
