/**
 * @jsx React.DOM
 */

var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var SessionStore = require('../stores/SessionStore');
var n = require('./notifications');
var NotificationCenterView = n.NotificationCenterView;
var RecentNotificationView = n.RecentNotificationView;


function getAppState() {
    return {
        current_user: SessionStore.current_user(),
        isAuth: SessionStore.loggedIn(),
        notif_center_is_active: false
    }
};


var CRMApp = React.createClass({
    getInitialState: function() {
        return getAppState();
    },

    childContextTypes: {
        user: React.PropTypes.object,
        isAuth: React.PropTypes.bool,
        toggleNotifCenter: React.PropTypes.func
    },

    getChildContext: function() {
        return {
            user: this.state.current_user,
            isAuth: this.state.isAuth,
            toggleNotifCenter: this.toggleNotifCenter
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

    toggleNotifCenter: function() {
        var newState = React.addons.update(this.state, {
            notif_center_is_active: {$set: !this.state.notif_center_is_active}
        });
        this.setState(newState);
    },

    render: function() {
        return (
            <div className="body-container">
                <RouteHandler />
                <RecentNotificationView />
                <NotificationCenterView isActive={this.state.notif_center_is_active} />
            </div>
        )
    }
});

module.exports = CRMApp;
