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
        Component: React.PropTypes.constructor,
        onUpdate: React.PropTypes.func
    },

    render: function() {
        var Component = this.props.Component;
        var className = cx({

        });
        return (
          <Component {...this.props} className={className}>
            {React.Children.map(this.props.children, this.renderChild)}
          </Component>
        );
    },
    renderChild: function(child) {
        return cloneWithProps(child, {});
    },

    getDefaultProps: function() {
        return {Component: 'form'};
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
