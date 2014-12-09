/**
 * @jsx React.DOM
 */

var React = require('react');
var inputs = require('./input');
var Input = inputs.Input;
var ContentEditableInput = inputs.ContentEditableInput;
var FormMixin = require('./FormMixin.react');
var SalesCycleStore = require('../stores/SalesCycleStore');

var _ = require('lodash');
var keyMirror = require('react/lib/keyMirror');
Object.assign = _.extend;

var ENTER_KEY_CODE = 13;
var ACTIONS = keyMirror({
    NO_ACTION: null,
});

require('../utils');

var SalesCycleCreateForm = React.createClass({
  mixins: [FormMixin],

  render: function() {
    return (
      <div className="inputLine inputLine--newCycle">
        <ContentEditableInput ref='sales_cycle_name' onFocus={this.onFocus} name="sales_cycle_name" className='input-div input-div--newCycle' onKeyDown={this.onKeyDown} />
        <div className="inputLine-caption">
          Type a name for cycle and press enter.
        </div>
      </div>
    )
  },

  prepare_object: function() {
    var title = this.refs.sales_cycle_name.value();
    return {'title': title};
  },

  onKeyDown: function(evt) {
    if(evt.keyCode == ENTER_KEY_CODE) {
      evt.preventDefault();
      salesCycleObject = this.prepare_object();
      this.handleSubmit(salesCycleObject);
    }
    return;
  },

  handleSubmit: function(salesCycleObject) {
    this.props.onCycleCreated(salesCycleObject);
    return;
  },

});

module.exports = SalesCycleCreateForm;
