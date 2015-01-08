/**
 * @jsx React.DOM
 */

var React = require('react');
var FormElementMixin = require('../FormElementMixin.react');


var SimpleSelect = React.createClass({
    mixins : [FormElementMixin],

    propTypes: {
        options: React.PropTypes.array,
        Component: React.PropTypes.constructor,
    },

    renderOption: function(value) {
        return (
            <option key={value[0]} value={value[0]}>{value[1]}</option>
        )
    },

    componentDidMount: function() {
        var value = this.value() || this.props.value || this.props.options.length>0 && this.props.options[0][0];
        this.updateValue(this.prepValue(this.props.name, value));
    },

    render: function() {
        var children = this.props.options.map(this.renderOption);
        var Component = this.props.Component;
        var value = this.value() || this.props.value || this.props.options.length>0 && this.props.options[0][0];
        return (
            <Component {...this.props} className="select">
                <select value={value} onChange={this.onChange}>{children}</select>
            </Component>
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
