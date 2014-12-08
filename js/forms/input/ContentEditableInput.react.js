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

    getDefaultProps: function() {
        return {
            Component: 'div'
        }
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
        console.log(value, "hi", "extract");
        this.updateValue(this.prepValue(this.props.name, value));
    },

    render: function() {
        var raw_classNames = this.props.className ? this.props.className.split(" ") : [];
        var classNames = {}
        _.forEach(raw_classNames, function(cn){
            classNames[cn] = true;
        });
        var value = this.value();
        var className = cx(_.merge({
          'input-div': true,
          'input-div--strong': this.props.isStrong,
        },classNames));
        var Component = React.createFactory(this.props.Component);
        var props = _.extend({}, this.props, {
            onInput: this.emitChange,
            onBlur: this.emitChange,
            contentEditable: true,
            className: className
        });
        return Component(props, value);

    },
});

function getValueFromEvent(e) {
  return e && e.target && e.target.value !== undefined ?
    e.target.value : e;
}


module.exports = ContentEditableInput;
