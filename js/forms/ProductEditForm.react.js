var React = require('react');
var Router = require('react-router');
var Form = require('./Form.react');
var inputs = require('./input');
var ContentEditableInput = inputs.ContentEditableInput;
var Fieldset = require('./Fieldset.react');
var AppContextMixin = require('../mixins/AppContextMixin');
var ProductActionCreators = require('../actions/ProductActionCreators');


var ProductDeleteBtn = React.createClass({
    mixins: [Router.Navigation],
    propTypes: {
        product_id: React.PropTypes.number.isRequired
    },

    onClick: function(evt) {
        ProductActionCreators.deleteProduct(this.props.product_id);
        this.transitionTo('products');
    },

    render: function() {
        return (
            <div className="inputLine text-left">
                <button onClick={this.onClick} className="btn btn--save">Удалить</button>
            </div>
        )
    }
});


var ProductEditForm = React.createClass({
    mixins : [AppContextMixin],

    propTypes: {
        onHandleSubmit: React.PropTypes.func,
    },

    render: function() {
        return (
            <div>
                <Form {...this.props} className="row-body" ref="product_form" onSubmit={this.onHandleSubmit}>
                    <Fieldset className="inputLine-negativeTrail">
                      <ContentEditableInput className="input-div input-div--strong"
                            name='name'
                            placeholder='Введите название продукта' />
                    </Fieldset>
                    <Fieldset className="inputLine-negativeTrail">
                      <ContentEditableInput className='input-div text-secondary'
                            name='description'
                            placeholder='Описание продукта ..' />
                    </Fieldset>
                    <div className="inputLine text-left">
                        <button className="btn btn--save" type="submit">Сохранить</button>
                    </div>
                </Form>
                <ProductDeleteBtn product_id={this.props.value.id} />
            </div>
        );
    },
    onHandleSubmit: function(e) {
        e.preventDefault();
        var form = this.refs.product_form;
        var errors = form.validate();
        if(!errors) {
          var value = form.value();
          value.author_id = this.getUser().crm_user_id;
          this.props.onHandleSubmit(value);
        } else{
            alert(errors);
        }
        return false;
    },

});

module.exports = ProductEditForm;
