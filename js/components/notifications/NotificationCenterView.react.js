var React = require('react/addons');
var cx = React.addons.classSet;
var renderNotification = require('./NotificationView.react').renderNotification;
var NotificationStore = require('../../stores/NotificationStore');


var NotificationCenterView = React.createClass({

    propTypes: {
        isActive: React.PropTypes.bool.isRequired
    },

    getInitialState: function() {
        return {
            notifications: NotificationStore.getByDate()
        }
    },

    componentDidMount: function() {
        NotificationStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function(nextProps, nextState) {
        NotificationStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({notifications: NotificationStore.getByDate()});
    },

    render: function() {
        var className = cx({
            'notificationCenter': true,
            'active': this.props.isActive
        });
        return (
            <div className={className}>
                <div className="notificationCenter-label">
                    Уведомления
                </div>
                {this.state.notifications.map(renderNotification)}
            </div>
        );
    }

});

module.exports = NotificationCenterView;
