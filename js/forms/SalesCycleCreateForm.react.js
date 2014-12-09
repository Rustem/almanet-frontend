/**
 * @jsx React.DOM
 */

var React = require('react');
var inputs = require('./input');
var Input = inputs.Input;
var ContentEditableInput = inputs.ContentEditableInput;
var Form = require('./Form.react');
var FormMixin = require('./FormMixin.react');
var SalesCycleStore = require('../stores/SalesCycleStore');

var _ = require('lodash');
var keyMirror = require('react/lib/keyMirror');
Object.assign = _.extend;

var ENTER_KEY_CODE = 13;
var CYCLE_NAME_PLACEHOLDER = 'Создать новый цикл';

require('../utils');

var default_form_state = {
  'sales_cycle_name': CYCLE_NAME_PLACEHOLDER
};

var SalesCycleCreateForm = React.createClass({
  mixins: [FormMixin],

  render: function() {
    return (
      <Form {...this.props}
            ref='sales_cycle_create_form'
            onSubmit={this.handleSubmit}
            onBlur={this.onBlur}
            onKeyDown={this.onKeyDown}
            value={default_form_state} >
          <ContentEditableInput ref='sales_cycle_name' 
                                name='sales_cycle_name' 
                                className='input-div input-div--newCycle' 
                                onFocus={this.onFocus} />
          
      </Form>
    )
  },

  prepare_object: function() {
    var title = this.refs.sales_cycle_create_form.value().sales_cycle_name;
    return {'title': title};
  },

  onKeyDown: function(evt) {
    if(evt.keyCode == ENTER_KEY_CODE) {
      evt.preventDefault();
      this.handleSubmit();
    }
    return;
  },

  onFocus: function(evt) {
    if(this.refs.sales_cycle_create_form.value().sales_cycle_name == CYCLE_NAME_PLACEHOLDER)
      this.refs.sales_cycle_create_form.updateValue({'sales_cycle_name': ''});
  },

  onBlur: function(evt) {
    if(this.refs.sales_cycle_create_form.value().sales_cycle_name == '')
      this.refs.sales_cycle_create_form.updateValue({'sales_cycle_name': CYCLE_NAME_PLACEHOLDER});
  },

  handleSubmit: function() {
    var salesCycleObject = this.prepare_object();
    this.props.onCycleCreated(salesCycleObject);
    return;
  },

});

module.exports = SalesCycleCreateForm;
