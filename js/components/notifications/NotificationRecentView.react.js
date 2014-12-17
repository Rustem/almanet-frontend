/**
 * @jsx React.DOM
 */
var moment = require('moment');
var React = require('react');
var AppContextMixin = require('../../mixins/AppContextMixin');
var ContactStore = require('../../stores/ContactStore');
var UserStore = require('../../stores/UserStore');
var NotifTypes = require('../../constants/CRMConstants').NotifTypes;
var utils = require('../../utils');

var NotificationContactCreateView = React.createClass({

    mixins : [AppContextMixin],

    propTypes: {
        n: React.PropTypes.object,
        onClose: React.PropTypes.func
    },

    render: function() {
        var n = this.props.n,
            author = UserStore.get(n.author_id),
            createdContact = ContactStore.get(n.extra.contact_id);
        return (
            <div className="notification active">
              <div className="notification-body">
                <div className="notification-message">
                  Пользователь {utils.capitalize(author.first_name)} создал новый контакт - {createdContact.fn}.
                </div>
              </div>
              <button onClick={this.onClick} className="notification-toggle" type="button">
                Закрыть
              </button>
            </div>
        );
    },

    onClick: function(evt) {
        this.props.onClose(this.props.n.id)
    }

});

var NotificationContactUpdateView = React.createClass({

    mixins : [AppContextMixin],

    propTypes: {
        n: React.PropTypes.object,
        onClose: React.PropTypes.func
    },

    render: function() {
        var n = this.props.n,
            author = UserStore.get(n.author_id),
            createdContact = ContactStore.get(n.extra.contact_id);

        return (
            <div className="notification active">
              <div className="notification-body">
                <div className="notification-message">
                  Пользователь {utils.capitalize(author.first_name)} изменил контакт {createdContact.fn}.
                </div>
              </div>
              <button onClick={this.onClick} className="notification-toggle" type="button">
                Закрыть
              </button>
            </div>
        );
    },

    onClick: function(evt) {
        this.props.onClose(this.props.n.id);
    }

});

var NotificationContactShareView = React.createClass({

    mixins : [AppContextMixin],

    propTypes: {
        n: React.PropTypes.object,
        onClose: React.PropTypes.func
    },

    render: function() {
        var n = this.props.n,
            author = UserStore.get(n.author_id),
            receiver = UserStore.get(n.extra.receiver_id),
            sharedContact = ContactStore.get(n.extra.contact_id);
        return (
            <div className="notification active">
              <div className="notification-body">
                <div className="notification-message">
                  Пользователь {utils.capitalize(author.first_name)} поделился контактом {sharedContact.fn} с пользователем {utils.capitalize(receiver.first_name)}.
                </div>
              </div>
              <button onClick={this.onClick} className="notification-toggle" type="button">
                Закрыть
              </button>
            </div>
        );
    },

    onClick: function(evt) {
        this.props.onClose(this.props.n.id);
    }

});

var NotificationActivityCreateView = React.createClass({

    mixins : [AppContextMixin],

    propTypes: {
        n: React.PropTypes.object,
        onClose: React.PropTypes.func
    },

    render: function() {
        var n = this.props.n,
            author = UserStore.get(n.author_id);

        return (
            <div className="notification active">
              <div className="notification-body">
                <div className="notification-message">
                  Пользователь {utils.capitalize(author.first_name)} добавил новое взаимодействие.
                </div>
              </div>
              <button onClick={this.onClick} className="notification-toggle" type="button">
                Закрыть
              </button>
            </div>
        );
    },

    onClick: function(evt) {
        this.props.onClose(this.props.n.id);
    }

});


function renderNotification(n) {
    var tp = n.type, TPL = null;
    switch(tp) {
        case NotifTypes.CONTACT_CREATE:
            TPL = NotificationContactCreateView;
            break;
        case NotifTypes.CONTACT_UPDATE:
            TPL = NotificationContactUpdateView;
            break;
        case NotifTypes.CONTACT_SHARE:
            TPL = NotificationContactShareView;
            break;
        case NotifTypes.ACTIVITY_CREATE:
            TPL = NotificationActivityCreateView;
        default:
            // do nothing
            true;
    };
    return <TPL key={n.id} n={n} onClose={this.onNotifRead} />
};

module.exports = {
    renderNotification: renderNotification
}
