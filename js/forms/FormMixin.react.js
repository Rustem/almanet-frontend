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
        return this.state;
    },

    validate: function() {
        return null;
    },

    updateValue: function(value) {
        this.setState(this._getFormState(value));
    },

    onValueUpdate: function(value) {
        var newState = React.addons.update(this.state, {$merge: value});
        this.setState(newState, function() {
            if (typeof this.valueUpdated === 'function') {
                this.valueUpdated(this.state)
            }
        }.bind(this));
    },

    _getFormState: function(updValue) {
        return updValue;
    },

    getValueFromEvent: function(e) {
      return e && e.target && e.target.value !== undefined ?
        e.target.value : e;
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


module.exports = FormMixin;
module.exports.ContextTypes = ContextTypes;
module.exports.FormContextMixin = FormContextMixin;
