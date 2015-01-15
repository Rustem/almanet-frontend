var _ = require('lodash');
var request = require('../utils').request;
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
        var data = {
            'real_value': salesCycleObject.real_value,
            'closing_stats': salesCycleObject.closing_stats};
        request('put', '/api/v1/sales_cycle/'+salesCycleObject.id+'/close/')
            .send(data)
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
        var object = _.assign(salesCycleObject, {
            status: SALES_CYCLE_STATUS.NEW, // TODO: use AppState constants
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
