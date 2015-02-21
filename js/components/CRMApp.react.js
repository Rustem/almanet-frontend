/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var cx = React.addons.classSet;
var RouteHandler = require('react-router').RouteHandler;
var SessionStore = require('../stores/SessionStore');
var RequestStore = require('../stores/RequestStore');
var n = require('./notifications');
var NotificationCenterView = n.NotificationCenterView;
var RecentNotificationListView = n.RecentNotificationListView;
var Shutter = require('./common/Shutter.react');
var utils = require('../utils');


function getAppState() {
    return {
        current_user: SessionStore.current_user(),
        isAuth: SessionStore.loggedIn(),
        notif_center_is_active: false,
        appStateLoaded: RequestStore.is_app_state_loaded()
    }
};

var Preloader = React.createClass({
    getInitialState: function() {
        return {
            'is_loading': RequestStore.is_loading(),
        }
    },

    componentDidMount: function() {
        RequestStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        RequestStore.removeChangeListener(this._onChange);
    },

    render: function() {
        var classes = cx({
            'preloader': true,
            'is-loading': this.state.is_loading,
        });
        return (
            <div className={classes}>
                <div className="preloader-bar"></div>
            </div>
        );
    },

    _onChange: function() {
        this.setState(this.getInitialState());
    }
});


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
        utils.initial_load(function() {
            this.appStateLoaded = true;
            this.forceUpdate();
        }.bind(this));

        RequestStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        RequestStore.removeChangeListener(this._onChange);
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
        var classes = cx({
            'body-container': true,
            'display-shutter': !this.appStateLoaded,
        });
        return (
            <div className={classes}>
                <Preloader />
                <RouteHandler />
                <RecentNotificationListView />
                <NotificationCenterView isActive={this.state.notif_center_is_active} />
                <Shutter />
            </div>
        )
    }
});

module.exports = CRMApp;
