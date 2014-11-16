/**
 * @jsx React.DOM
 */
'use strict';

var React            = require('react');
var FormMixin = require('./FormMixin.react');
/**
 * Mixin for components which serve as form elements.
 *
 * Form elements can get their values being in the context of a form or via
 * props.
 *
 * See <Field />, <Fieldset /> and <RepeatingFieldset /> components for the
 * examples.
 */

var FormElementMixin = {

  propTypes: {
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.bool]),
    onValueUpdate: React.PropTypes.func,
    name: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ])
  },

  contextTypes: FormMixin.ContextTypes,

  /**
   * Get the form value corresponding to an element.
   *
   * @returns {Value}
   */
  value: function() {
    if (this.props.value !== undefined && this.props.value !== null) {
      return this.props.value;
    }
    var value = this.context.value;
    if(this.props.name !== undefined) {
      value = value[this.props.name];
    }
    return value;
  },

  /**
   * Notify form controller of the changed form value.
   *
   * @param {Value} value
   */
  updateValue: function(value) {
    if (this.props.onValueUpdate) {
      this.props.onValueUpdate(value);
    } else {
      this.context.onValueUpdate(value);
    }
  },

  /**
   * Called when the form value is being updated.
   *
   * This method intercepts updated value and perform its own local validation
   * and deserialization. Then passes everything up to the form controller.
   *
   * @param {Any} value
   */
  onValueUpdate: function(value) {
    this.updateValue(value);
  },

  /**
  * Called when new state must be created for some form element.

  * @param {string} name
  * @param {Any} value
  */

  prepValue: function(name, value) {
    var rv = {};
    rv[name] = value;
    return rv;
  },

  getValueFromEvent: function(e) {
      return e && e.target && e.target.value !== undefined ?
        e.target.value : e;
  }
};

module.exports = FormElementMixin;
