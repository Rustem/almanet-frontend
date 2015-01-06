var _ = require('lodash');
var React = require('react/addons');
var Form = require('./Form.react');
var FormMixin = require('./FormMixin.react');
var elements = require('./elements');
var ProductRemoveableDropDownList = elements.ProductRemoveableDropDownList;

var AddProductMiniForm = React.createClass({
    mixins: [FormMixin],
    propTypes: {
        onHandleSubmit: React.PropTypes.func,
        onCancel: React.PropTypes.func,
        salescycle_id: React.PropTypes.number,
        // products: React.PropTypes.list,
    },

    render: function() {
        var form_value = _.extend({}, {
            'products': this.props.products
        });
        return (
            <Form ref="add_product_form" value={form_value}
                                  onSubmit={this.onHandleSubmit}>
                <ProductRemoveableDropDownList
                    name="products"
                    title=""
                    filter_placeholder="Добавьте продукт" />
                <div className="space-vertical--compact"></div>
                <div className="inputLine">
                    <button type="submit" className="btn btn--save">Сохранить</button>
                </div>
            </Form>
        );
    },

    onHandleSubmit: function(e) {
        e.preventDefault();
        var form = this.refs.add_product_form;
        var errors = form.validate();
        if(!errors) {
            var object = {}, formValue = form.value();
            object.salescycle_id = this.props.salescycle_id;
            object.products = formValue.products;
          this.props.onHandleSubmit(object);
        } else{
            alert(errors);
        }
        return false;
    }

});

module.exports = AddProductMiniForm;
