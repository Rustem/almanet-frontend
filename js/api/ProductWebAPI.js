var SignalManager = require('./utils');
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;

module.exports = {
    getAll: function(success, failure) {
        var products = JSON.parse(localStorage.getItem('products'));
        setTimeout(function(){
            success(products);
        }, 0);
    },

    editProduct: function(edit_details, success, failure) {
        var rawProducts = JSON.parse(localStorage.getItem('products')) || [],
            product = null;
        for(var i = 0; i<rawProducts.length; i++) {
            var cur = rawProducts[i];
            if(cur.id === edit_details.product_id) {
                rawProducts[i] = edit_details.product;
                product = cur;
                break;
            }
        }
        localStorage.setItem('products', JSON.stringify(rawProducts));
        setTimeout(function() {
            success(edit_details);

            var author_id = product.user_id,
                extra = {'product_id': product.id};
            SignalManager.send(ActionTypes.EDIT_PRODUCT_SUCCESS, author_id, extra);
        }, 0);
    }
};
