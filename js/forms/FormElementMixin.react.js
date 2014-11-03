/**
 * @jsx React.DOM
 */
'use strict';

var React            = require('react');

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
    value: React.PropTypes.object,
    onValueUpdate: React.PropTypes.func,
    name: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ])
  },
  /**
   * Get the form value corresponding to an element.
   *
   * @returns {Value}
   */
  value: function() {
    if (this.props.value) {
      var value = this.props.value;
      return value[this.props.name];
    }
    return null;
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
  }
};

module.exports = FormElementMixin;
