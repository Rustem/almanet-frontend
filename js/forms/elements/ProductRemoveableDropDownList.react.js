var _ = require('lodash');

var React = require('react/addons');
var inputs = require('../input');
var RemoveableDropDownListWidget = inputs.RemoveableDropDownListWidget;

var FormElementMixin = require('../FormElementMixin.react');
var ProductStore = require('../../stores/ProductStore');

var ProductRemoveableDropDownList = React.createClass({
    mixins : [FormElementMixin],

    renderProduct: function(p) {
        return p.name;
    },

    buildProps: function() {
        return {
            object_list: ProductStore.getAll(),
            object_key: 'id',
            selected_object_keys: this.value() || [],
            object_val: this.renderProduct,
            renderSelectedItem: this.renderSelectedItem
        }
    },

    renderSelectedItem: function(object){
        return (
            <div className="row-body">
                {object.name}
            </div>
        )
    },

    findByKey: function(key) {
        return ProductStore.get(key);
    },

    onAdd: function(product_id) {
        var selected_products = this.value() || [];
        selected_products.push(product_id);
        var updValue = this.prepValue(this.props.name, _.unique(selected_products));
        return this.updateValue(updValue);
    },

    onRemove: function(product_id) {
        var selected_products = this.value();
        _.pull(selected_products, product_id);
        return this.updateValue(selected_products);
    },

    render: function() {
        var props = _.extend({}, this.buildProps(), this.props);
        return <RemoveableDropDownListWidget {...props}
                    onAdd={this.onAdd} onRemove={this.onRemove} />
    }

});

module.exports = ProductRemoveableDropDownList;