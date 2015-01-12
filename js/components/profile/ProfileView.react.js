/**
 * @jsx React.DOM
 */

var React = require('react');
var RouteHandler = require('react-router').RouteHandler;

var ProfileView = React.createClass({
    getInitialState: function() {
        return getAppState();
    },

    render: function() {
        return (
            <div className="body-container">
                <RouteHandler />
                <RecentNotificationListView />
                <NotificationCenterView isActive={this.state.notif_center_is_active} />
            </div>
        )
    }
});

module.exports = ProfileView;
