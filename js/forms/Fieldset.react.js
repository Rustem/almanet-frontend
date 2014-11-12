/**
 * @jsx React.DOM
 */
'use strict';

var React         = require('react/addons');
var cx            = React.addons.classSet;
var cloneWithProps    = React.addons.cloneWithProps;
var FieldsetMixin = require('./FieldsetMixin.react');

/**
 * A Component which renders a set of fields.
 *
 * It is used by <Form /> Component at top level to render its fields.
 */
var Fieldset = React.createClass({
  mixins: [FieldsetMixin],

  propTypes: {
    Component: React.PropTypes.constructor
  },

  getDefaultProps: function() {
    return {
      Component: 'div'
    }
  },

  render: function() {
    var Component = this.props.Component;
    return (
      <Component {...this.props}>
        {React.Children.map(this.props.children, this.renderChild)}
      </Component>
    );
  },
  renderChild: function(child) {
    return cloneWithProps(child, {});
  },


  renderLabel: function() {
    var schema = this.value().schema;
    return (
      <Label
        className="rf-Fieldset__label"
        schema={schema}
        label={this.props.label}
        hint={this.props.hint}
        />
    );
  }
});

module.exports = Fieldset;
