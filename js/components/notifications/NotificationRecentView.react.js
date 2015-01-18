/**
 * @jsx React.DOM
 */
var _ = require('lodash');
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
                  Пользователь {utils.capitalize(author.vcard.fn)} создал новый контакт - {createdContact.vcard.fn}.
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
                  Пользователь {utils.capitalize(author.vcard.fn)} изменил контакт {createdContact.vcard.fn}.
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
            receivers = _.uniq(_.map(n.extra.receivers, function(id){ return UserStore.get(id)})),
            sharedContacts = _.uniq(_.map(n.extra.contacts, function(id){ return ContactStore.get(id)}));
        return (
            <div className="notification active">
              <div className="notification-body">
                <div className="notification-message">
                  Пользователь {utils.capitalize(author.vcard.fn)} поделился {sharedContacts.length == 1 ? 'контактом' : 'контактами'} {_.map(sharedContacts, function(c) { return c.vcard.fn}).join(', ')} с {receivers.length == 1 ? 'пользователем' : 'пользователями'} {_.map(receivers, function(r) { return r.vcard.fn}).join(', ')}.
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
                  Пользователь {utils.capitalize(author.vcard.fn)} добавил новое взаимодействие.
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


var NotificationFilterCreateView = React.createClass({

    mixins : [AppContextMixin],

    propTypes: {
        n: React.PropTypes.object
    },

    render: function() {
        var n = this.props.n,
            author = UserStore.get(n.author_id),
            filter_title = n.extra.filter_title;

        return (
            <div className="notification active">
              <div className="notification-body">
                <div className="notification-message">
                  Пользователь {utils.capitalize(author.vcard.fn)} добавил новый фильтр - {filter_title}.
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

var NotificationFilterEditView = React.createClass({

    mixins : [AppContextMixin],

    propTypes: {
        n: React.PropTypes.object
    },

    render: function() {
        var n = this.props.n,
            author = UserStore.get(n.author_id),
            filter_title = n.extra.filter_title;

        return (
            <div className="notification active">
              <div className="notification-body">
                <div className="notification-message">
                  Пользователь {utils.capitalize(author.vcard.fn)} изменил фильтр - {filter_title}.
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
        case NotifTypes.CONTACT_EDIT:
            TPL = NotificationContactUpdateView;
            break;
        case NotifTypes.CONTACT_SHARE:
            TPL = NotificationContactShareView;
            break;
        case NotifTypes.ACTIVITY_CREATE:
            TPL = NotificationActivityCreateView;
            break;
        case NotifTypes.FILTER_CREATE:
            TPL = NotificationFilterCreateView;
            break;
        case NotifTypes.FILTER_EDIT:
            TPL = NotificationFilterEditView;
            break;
        default:
            // do nothing
            true;
    };
    return <TPL key={n.id} n={n} onClose={this.onNotifRead} />
};

module.exports = {
    renderNotification: renderNotification
}
