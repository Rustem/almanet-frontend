/**
 * @jsx React.DOM
 */

var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var SessionStore = require('../stores/SessionStore');

function getAppState() {
    return {
        current_user: SessionStore.current_user(),
        isAuth: SessionStore.loggedIn()
    }
};


var CRMApp = React.createClass({
    getInitialState: function() {
        return getAppState();
    },

    childContextTypes: {
        user: React.PropTypes.object,
        isAuth: React.PropTypes.bool
    },

    getChildContext: function() {
        return {
            user: this.state.current_user,
            isAuth: this.state.isAuth
        };
    },

    componentDidMount: function() {
        SessionStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        SessionStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState(getAppState());
    },

    render: function() {
        return (
            <div className="body-container">
                <RouteHandler />
            </div>
        )
    }
});

module.exports = CRMApp;
