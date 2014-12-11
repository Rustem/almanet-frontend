'use strict';
/**
 * @jsx React.DOM
 */
var React = require('react');
var FormElementMixin = require('../FormElementMixin.react');

var Input = React.createClass({
    mixins : [FormElementMixin],

    onChange: function(e) {
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        var value = this.getValueFromEvent(e);
        this.updateValue(this.prepValue(this.props.name, value));
    },

    render: function() {
        return (
            <input {...this.props} onChange={this.onChange} />
        )
    }
});
module.exports = {
  Input: Input,
  ContentEditableInput: require('./ContentEditableInput.react'),
  SimpleSelect: require('./SimpleSelect.react'),
  SVGCheckbox: require('./SVGCheckbox.react'),
  RemoveableDropDownListWidget: require('./RemoveableDropDownWidget.react'),
  DescriptionDropDownWidget: require('./DescriptionDropDownWidget.react'),
  FeedbackDropDownWidget: require('./FeedbackDropDownWidget.react'),
  FeedbackDropDownWidgetSimple: require('./FeedbackDropDownWidgetSimple.react'),
};
