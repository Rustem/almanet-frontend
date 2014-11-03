/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var cx        = React.addons.classSet;
var _ = require('lodash');
var FormMixin = require('./FormMixin.react');
var cloneWithProps    = React.addons.cloneWithProps;

var Form = React.createClass({
    mixins: [FormMixin],

    propTypes: {
        component: React.PropTypes.constructor,
        onUpdate: React.PropTypes.func
    },

    render: function() {
        var component = this.props.component;
        var className = cx({

        });
        return this.transferPropsTo(
          <component className={className}>
            {React.Children.map(this.props.children, this.renderChild)}
          </component>
        );
    },
    renderChild: function(child) {
        return cloneWithProps(child, {});
    },

    getDefaultProps: function() {
        return {component: React.DOM.form};
    },

    valueUpdated: function(value) {
        // validation in future
        var isSuccess = true;
        if (this.props.onUpdate && isSuccess) {
          this.props.onUpdate(value);
        }
    }

});

module.exports = Form;
