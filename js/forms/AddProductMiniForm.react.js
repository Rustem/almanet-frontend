var _ = require('lodash');
var React = require('react/addons');
var Form = require('./Form.react');
var FormMixin = require('./FormMixin.react');
var elements = require('./elements');
var ProductRemoveableDropDownList = elements.ProductRemoveableDropDownList;

var DEFAULT_PRODUCT = {
    'feedback': null,
};

var AddProductMiniForm = React.createClass({
    mixins: [FormMixin],
    // propTypes: {
    //     onHandleSubmit: React.PropTypes.func,
    //     onCancel: React.PropTypes.func,
    //     current_user: React.PropTypes.object,
    //     salescycle: React.PropTypes.string
    // },

    render: function() {
        return (
            <Form ref="add_product_form" value={DEFAULT_PRODUCT}
                                  onSubmit={this.onHandleSubmit}>
                <div className="inputLine">
                    <ProductRemoveableDropDownList
                        name="products"
                        title=""
                        filter_placeholder="Добавитьте продукт" />

                </div>
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
            object.author_id = this.props.current_user.id;
            object.description = formValue.description;
            object.feedback = formValue.feedback;
          this.props.onHandleSubmit(object);
        } else{
            alert(errors);
        }
        return false;
    }

});

module.exports = AddProductMiniForm;
