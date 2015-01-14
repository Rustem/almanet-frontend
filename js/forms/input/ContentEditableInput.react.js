/**
 * @jsx React.DOM
 */
var _ = require('lodash');
var React = require('react');
var FormElementMixin = require('../FormElementMixin.react');
var cx        = React.addons.classSet;

var ContentEditableInput = React.createClass({
    mixins : [FormElementMixin],
    lastHtml : null,
    propTypes: {
        isStrong: React.PropTypes.bool,
        Component: React.PropTypes.constructor
    },

    componentWillMount: function() {
        this.isOnceFocused = false;
        this.isOnceTyped = false;
        this.defaultValue = this.value() || this.props.placeholder;
        this.is_placeholder = !this.value();
    },

    getDefaultProps: function() {
        return {
            Component: 'div'
        }
    },

    resetInput: function() {
        this.isOnceFocused = false;
        this.isOnceTyped = false;
        this.onChange({
            target: {value: this.defaultValue}
        });
    },

    getCurrentValue: function() {
        try{
            var val = this.getDOMNode().innerText;
        } catch(e) {
            var val = ''
        }
        return val;
    },

    emitChange: function() {
        // sends a change to parent form
        var val = this.getCurrentValue();
        if(val !== this.lastHtml){
            this.onChange({
                target: {value: val}
            });
        }
    },

    onChange: function(e) {
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        var value = getValueFromEvent(e);
        this.setInnerText(value);
        this.updateValue(this.prepValue(this.props.name, value));
    },

    onFocus: function(e) {
        if(!this.is_placeholder)
            return;
        this.isOnceFocused = true;
        if(!this.isOnceTyped) {
            this.onChange({
                target: {value: ''}
            });
        }
    },

    onBlur: function(e) {
        if(!this.is_placeholder)
            return;
        if(this.getCurrentValue() == '')
            this.resetInput();
    },

    onInput: function(e) {
        this.isOnceTyped = true;
        this.emitChange();
    },

    render: function() {
        var Component = React.createFactory(this.props.Component);
        var raw_classNames = this.props.className ? this.props.className.split(" ") : [];
        var classNames = {}
        _.forEach(raw_classNames, function(cn){
            classNames[cn] = true;
        });
        var className = cx(classNames);
        var props = _.extend({}, this.props, {
            onInput: this.onInput,
            onBlur: this.onBlur,
            onFocus: this.onFocus,
            contentEditable: true,
            className: className
        });
        var value = this.defaultValue;
        return Component(props, value);

    },
});

function getValueFromEvent(e) {
  return e && e.target && e.target.value !== undefined ?
    e.target.value : e;
}


module.exports = ContentEditableInput;
