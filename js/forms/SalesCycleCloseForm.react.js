/**
 * @jsx React.DOM
 */

var React = require('react');
var inputs = require('./input');
var Input = inputs.Input;
var ContentEditableInput = inputs.ContentEditableInput;
var Form = require('./Form.react');
var FormMixin = require('./FormMixin.react');
var Fieldset = require('./Fieldset.react');

var _ = require('lodash');
Object.assign = _.extend;

require('../utils');


var SalesCycleCloseForm = React.createClass({

  propTypes: {
    onHandleSubmit: React.PropTypes.func,
    salesCycleID: React.PropTypes.number.isRequired,
    products: React.PropTypes.object.isRequired,
  },

  getFormAsHtml: function() {
    return this.refs.sales_cycle_close_form.getDOMNode();
  },

  renderClosingItem: function(product, idx){
    return (
      <Fieldset className="text-center inputLine">
        <span>{product.name}</span>
        <ContentEditableInput className='input-div input-div--closeCycle' name={'real_value__' + product.id} placeholder='Enter monetary value'/>
      </Fieldset>
    )
  },

  render: function() {
    return (
      <Form {...this.props}
            ref='sales_cycle_close_form'
            value={{}}
            onSubmit={this.onHandleSubmit}
            onKeyDown={this.props.onKeyDown}>
          {this.props.products.map(this.renderClosingItem)}

        <div className="space-vertical--compact text-center">
          <button className="btn btn--save" type="submit">Закрыть цикл</button>
        </div>
      </Form>
    )
  },

  onHandleSubmit: function(e) {
    e.preventDefault();
    var form = this.refs.sales_cycle_close_form,
        errors = form.validate(),
        form_value = form.value(),
        stats = {}, real_value = 0;
    if(!errors) {
      for(var k in form_value){
        if(k.indexOf('real_value') === -1)
          continue;
        var product_id = k.split('__')[1]
        stats[product_id] = parseInt(form_value[k]);
        real_value += parseInt(form_value[k]);
      }
      this.props.handleSubmit({id: this.props.salesCycleID,
                               closing_stats: stats,
                               real_value: real_value});
    } else{
      alert(errors);
    }
    return false;
  },

});

module.exports = SalesCycleCloseForm;
