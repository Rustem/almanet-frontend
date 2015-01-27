var React = require('react');
var Form = require('./Form.react');
var inputs = require('./input');
var ContentEditableInput = inputs.ContentEditableInput;
var Fieldset = require('./Fieldset.react');
var AppContextMixin = require('../mixins/AppContextMixin');

var ProductCreateForm = React.createClass({
    mixins : [AppContextMixin],

    propTypes: {
        onHandleSubmit: React.PropTypes.func,
    },

    render: function() {
        return (
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

module.exports = ProductCreateForm;
