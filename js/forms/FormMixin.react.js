/**
 * @jsx React.DOM
 */

'use strict'

var React = require('react');
var cloneWithProps   = React.addons.cloneWithProps;
var _ = require('lodash');
var FormStateMixin = {
    propTypes: {
        defaultValue: React.PropTypes.any,
        value: React.PropTypes.any,
    },

    getInitialState: function() {
        var value = (
            this.props.value
            || this.props.defaultValue
            || {}
        );
        return this._getFormState(value);
    },

    componentWillReceiveProps: function(nextProps) {
        var value = nextProps.value;
        // if new value is available we need to update it
        if(value !== undefined){
            this.setState(this._getFormState(value));
        }
    },

    shareValue: function(child) {
        if (child.props.children) {
            return React.Children.map(child.props.children, this.shareValue);
        } else{
            if('name' in child.props && child.props.name in this.value()) {
                var newProps = _.extend({}, {value: this.value()}, child.props)
                var obj = cloneWithProps(child, newProps);
                return obj;
            } else {
                return child;
            }

        }
    },

    /**
       * Return current form value.
       *
       * @returns {Value}
    */

    value: function() {
        return this.props.value;
    },

    updateValue: function(value) {
        this.setState(this._getFormState(value));
    },

    onValueUpdate: function(value) {
        this.setState(this._getFormState(value), function() {
            if (typeof this.valueUpdated === 'function') {
                this.valueUpdated(this.state.value)
            }
        });
    },

    _getFormState: function(value) {
        return value;
    }
};

var FormMixin = {
    mixins: [FormStateMixin]
};

module.exports = FormMixin;
