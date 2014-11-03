/**
 * @jsx React.DOM
 */

var React = require('react');

var InputDiv = React.createClass({
    propTypes: {
        value: React.PropTypes.string,
        onChange: React.PropTypes.func
    },
    render: function() {
        console.log(this.props);
        return (
            <input {...this.props} type='hidden' />
        );
    }

});

function getValueFromEvent(e) {
  return e && e.target && e.target.value !== undefined ?
    e.target.value : e;
}

module.exports = InputDiv;
