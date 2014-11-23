/**
 * @jsx React.DOM
 */

var React = require('react');
var RouteHandler = require('react-router').RouteHandler;

var CRMApp = React.createClass({
    render: function() {
        return (
            <div className="body-container">
                <RouteHandler />
            </div>
        )
    }
});

module.exports = CRMApp;
