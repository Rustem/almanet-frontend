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
