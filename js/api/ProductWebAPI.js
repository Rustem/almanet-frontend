var _ = require('lodash');
var request = require('../utils').request;
var SignalManager = require('./utils');
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;

module.exports = {
    createProduct: function(product, success, failure) {
        var product = _.assign(product, {'price': 0});

        request('POST', '/api/v1/product/')
            .send(product)
            .on('error', failure.bind(null, product))
            .end(function(res) {
                if (res.ok)
                    success(res.body)
                else
                    failure(res);
            });
    },

    editProduct: function(edit_details, success, failure) {
        request('PUT', '/api/v1/product/'+edit_details.product_id+'/')
            .send(edit_details.product)
            .on('error', failure.bind(null, edit_details))
            .end(function(res) {
                if (res.ok)
                    success(res.body)
                else
                    failure(res);
            });
    }
};


// TODO
function update_current_value(cycle) {
    if(!cycle.products || !cycle.closing_stats) { return; }
    var products = JSON.parse(localStorage.getItem('products'));
    for(var product_id in cycle.closing_stats){
        _.forEach(products, function(product) {
            if(product.id === product_id) {
                product.current_value += cycle.closing_stats[product_id];
            }
        });
    }
    localStorage.setItem('products', JSON.stringify(products));
};

SignalManager.connect(ActionTypes.CLOSE_SALES_CYCLE_SUCCESS, update_current_value);
