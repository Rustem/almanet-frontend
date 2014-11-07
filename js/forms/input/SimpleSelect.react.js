/**
 * @jsx React.DOM
 */

var React = require('react');
var FormElementMixin = require('../FormElementMixin.react');


var SimpleSelect = React.createClass({
    mixins : [FormElementMixin],

    propTypes: {
        options: React.PropTypes.array,
        component: React.PropTypes.constructor,
    },

    renderOption: function(value) {
        return (
            <option value={value[0]}>{value[1]}</option>
        )
    },

    render: function() {
        var children = this.props.options.map(this.renderOption);
        var component = this.props.component;
        return this.transferPropsTo(
            <component className="select">
                <select value={this.props.value} onChange={this.onChange}>{children}</select>
            </component>
        );
    },

    onChange: function(e) {
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        var value = this.getValueFromEvent(e);
        this.updateValue(this.prepValue(this.props.name, value));
    },

});

module.exports = SimpleSelect;
