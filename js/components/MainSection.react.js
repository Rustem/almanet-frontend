/**
 * @jsx React.DOM
 */

var React = require('react');

var MainSection = React.createClass({

    render: function() {
        return (
            <div className="body-master">{this.props.children}</div>
        );
    }

});

module.exports = MainSection;
