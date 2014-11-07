/**
 * @jsx React.DOM
 */
'use strict';

var React         = require('react/addons');
var cx            = React.addons.classSet;
var cloneWithProps    = React.addons.cloneWithProps;
var FieldsetMixin = require('./FieldsetMixin.react');

/**
 * A component which renders a set of fields.
 *
 * It is used by <Form /> component at top level to render its fields.
 */
var Fieldset = React.createClass({
  mixins: [FieldsetMixin],

  propTypes: {
    component: React.PropTypes.constructor
  },

  getDefaultProps: function() {
    return {
      component: React.DOM.div
    }
  },

  render: function() {
    var component = this.props.component;
    return (
      <component {...this.props}>
        {React.Children.map(this.props.children, this.renderChild)}
      </component>
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
