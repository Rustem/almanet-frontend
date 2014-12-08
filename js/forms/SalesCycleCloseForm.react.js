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
    value: React.PropTypes.object.isRequired,
  },

  getFormAsHtml: function() {
    return this.refs.sales_cycle_close_form.getDOMNode();
  },

  render: function() {
    return (
      <Form {...this.props}
            ref='sales_cycle_close_form'
            onSubmit={this.onHandleSubmit}
            onKeyDown={this.props.onKeyDown}>
        <ContentEditableInput className='input-div input-div--closeCycle' name='real_value' placeholder='Enter monetary value'/>
        <div className='space-horizontal'></div>
        <button className='btn btn--save' type='submit'>Закрыть</button>
      </Form>
    )
  },

  onHandleSubmit: function(e) {
    e.preventDefault();
    var form = this.refs.sales_cycle_close_form;
    var errors = form.validate();
    if(!errors) {
      this.props.handleSubmit(form.value());
    } else{
        alert(errors);
    }
    return false;
  },

});

module.exports = SalesCycleCloseForm;
