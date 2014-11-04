/**
 * @jsx React.DOM
 */

'use strict'

var React = require('react/addons');
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
        console.log(value);
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

var ContextTypes = {
    value: React.PropTypes.object,
    onValueUpdate: React.PropTypes.func
};

/**
 * Mixin for components which exposes form context.
 *
 * See <Form />, <Fieldset /> and <RepeatingFieldset /> for components which
 * expose form context.
 */
var FormContextMixin = {

    childContextTypes: ContextTypes,

    getChildContext: function() {
        return {
          value: this.value(),
          onValueUpdate: this.onValueUpdate
        };
    }
};

var FormMixin = {
    mixins: [FormStateMixin, FormContextMixin],
};

// console.log(FormMixin.getContextTypes());

module.exports = FormMixin;
module.exports.ContextTypes = ContextTypes;
module.exports.FormContextMixin = FormContextMixin;
