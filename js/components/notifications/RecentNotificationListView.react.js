var React = require('react');
var NotificationActionCreators = require('../../actions/NotificationActionCreators');
var NotificationStore = require('../../stores/NotificationStore');
var renderNotification = require('./NotificationRecentView.react').renderNotification;
var AppContextMixin = require('../../mixins/AppContextMixin');
var RecentNotificationListView = React.createClass({

    mixins : [AppContextMixin],

    getInitialState: function() {
        return {
            notifications: NotificationStore.getNewByDate()
        }
    },

    componentDidMount: function() {
        NotificationStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function(nextProps, nextState) {
        NotificationStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({notifications: NotificationStore.getNewByDate()});
    },

    onNotifRead: function(n_id) {
        // @askhat note that in future when we plug our backend,
        // we should mark only current user copy of notification
        NotificationActionCreators.userRead(n_id, this.getUser().id);
    },

    render: function() {
        return (
            <div className="js-recentNotifs">
                {this.state.notifications.map(renderNotification.bind(this))}
            </div>
        );
    }

});

module.exports = RecentNotificationListView;
