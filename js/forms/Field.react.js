/**
 * @jsx React.DOM
 */
'use strict';

var _ = require('lodash');
var React       = require('react/addons');
var mergeInto = require('../utils').mergeInto;
var cx          = React.addons.classSet;
var cloneWithProps   = React.addons.cloneWithProps;
var FormElementMixin  = require('./FormElementMixin.react');



/**
 * Field component represents values which correspond to Property schema nodes
 * and so received PropetyValue as value.
 *
 * It provides basic markup which include <input /> component (can be customized
 * via schema) and <label /> (label text and hint text).
 */
var Field = React.createClass({
  mixins: [FormElementMixin],

  propTypes: {
    isStrong: React.PropTypes.bool,
    label: React.PropTypes.string,
    input: React.PropTypes.component
  },

  onChange: function(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    var value = getValueFromEvent(e);
    this.onValueUpdate(value);
  },

  render: function() {
    var value = this.value();
    var className = cx({
      'input-div': true,
      'input-div--strong': this.props.isStrong,
    });
    var id = 'js-id--' + this.props.name;
    var input = this.renderInputComponent({
        id: id,
        onBlur: this.onBlur,
        name: this.props.name,});
    return (
      <div contentEditable={true} className={cx(className, this.props.className)}>
        {value}
        {this.renderLabel(id)}
        {this.transferPropsTo(input)}
      </div>
    );
  },

  renderLabel: function(htmlFor) {
    return null;
  },

  /**
   * Render input component.
   *
   * @returns {ReactComponent}
   */
  renderInputComponent: function(props) {
    var value = this.value();

    var input = this.props.input || null;
    var inputProps = {
        value: value,
        onChange: this.onChange};
    if (props) {
      inputProps = mergeInto(inputProps, props);
    }
    if (input) {
      return cloneWithProps(input, inputProps);
    } else {
      inputProps.type = 'text';
      return React.DOM.input(inputProps);
    }
  },

  onBlur: function() {
    var value = this.value();
    if (value.isUndefined) {
      this.onValueUpdate(value.update({value: value}));
    }
  }
});


function getValueFromEvent(e) {
  return e && e.target && e.target.value !== undefined ?
    e.target.value : e;
}

module.exports = Field;
