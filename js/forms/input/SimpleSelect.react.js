/**
 * @jsx React.DOM
 */

var React = require('react');

var SimpleSelect = React.createClass({

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
                <select value={this.props.value} onChange={this.props.onChange}>{children}</select>
            </component>
        );
    },

});

module.exports = SimpleSelect;
