
module.exports = {
    getAll: function(success, failure) {
        var products = JSON.parse(localStorage.getItem('products'));
        setTimeout(function(){
            success(products);
        }, 0);
    },
};
