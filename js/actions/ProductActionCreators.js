var dispatcher = require('../dispatcher/CRMAppDispatcher');
var CRMConstants = require('../constants/CRMConstants');
var ActionTypes = CRMConstants.ActionTypes;
var ProductWebAPI = require('../api/ProductWebAPI');

module.exports = {
    editProduct: function(product_id, product) {
        var details = {product_id: product_id, product: product};
        dispatcher.handleViewAction({
          type: ActionTypes.EDIT_PRODUCT,
          object: details
        });
        ProductWebAPI.editProduct(details, function(object){
          dispatcher.handleServerAction({
            type: ActionTypes.EDIT_PRODUCT_SUCCESS,
            object: object
          });
        }.bind(this), function(error){
          dispatcher.handleServerAction({
            type: ActionTypes.EDIT_PRODUCT_FAIL,
            error: error
          });
        }.bind(this));
    },

    createProduct: function(product) {
      dispatcher.handleViewAction({
        type: ActionTypes.CREATE_PRODUCT,
        object: product
      });
      ProductWebAPI.createProduct(product, function(createdProduct){
        dispatcher.handleServerAction({
          type: ActionTypes.CREATE_PRODUCT_SUCCESS,
          object: createdProduct
        });
      }.bind(this), function(error){
        dispatcher.handleServerAction({
          type: ActionTypes.CREATE_PRODUCT_FAIL,
          error: error
        });
      }.bind(this));
    }
}
