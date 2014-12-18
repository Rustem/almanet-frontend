var React = require('react/addons');
var cx = React.addons.classSet;
var renderNotification = require('./NotificationView.react').renderNotification;
var NotificationStore = require('../../stores/NotificationStore');


var NotificationCenterView = React.createClass({

    propTypes: {
        isActive: React.PropTypes.bool.isRequired,
        paginate_by: React.PropTypes.number
    },

    getDefaultProps: function() {
        return {paginate_by: 3}
    },

    getInitialState: function() {
        return {
            limit: this.props.paginate_by
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

    onAddMore: function(evt) {
        evt.preventDefault();
        var newState = React.addons.update(this.state, {
            limit: {$set: this.state.limit + this.props.paginate_by}
        });
        this.setState(newState);
    },

    render: function() {
        var className = cx({
            'notificationCenter': true,
            'active': this.props.isActive
        });
        var notifs = NotificationStore.getByDate({
            limit: this.state.limit})
        return (
            <div className={className}>
                <div className="notificationCenter-label">
                    Уведомления
                </div>
                {notifs.map(renderNotification)}

                <div className="notificationCenter-showMore">
                    <button onClick={this.onAddMore} type="button" className="notificationCenter-showMore-btn">Показать ещё</button>
                </div>
            </div>
        );
    }

});

module.exports = NotificationCenterView;
