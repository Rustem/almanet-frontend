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
        n: React.PropTypes.object
    },

    render: function() {
        var n = this.props.n,
            fn = n.extra.fn;
        return (
            <div className="notificationCenter-item">
                <div className="notificationCenter-item-meta">
                    {moment(n.date_created).fromNow()}
                </div>
                Новый контакт {fn} успешно создан.
            </div>
        );
    }

});

var NotificationContactUpdateView = React.createClass({

    mixins : [AppContextMixin],

    propTypes: {
        n: React.PropTypes.object
    },

    render: function() {
        var n = this.props.n,
            fn = n.extra.fn;
        return (
            <div key={n.id} className="notificationCenter-item">
                <div className="notificationCenter-item-meta">
                    {moment(n.date_created).fromNow()}
                </div>
                Контакт {fn} успешно изменён.
            </div>
        );
    }

});

var NotificationContactShareView = React.createClass({

    mixins : [AppContextMixin],

    propTypes: {
        n: React.PropTypes.object
    },

    render: function() {
        var n = this.props.n,
            contacts = n.extra.contacts;

        return (
            <div key={n.id} className="notificationCenter-item">
                <div className="notificationCenter-item-meta">
                    {moment(n.date_created).fromNow()}
                </div>
                Вы успешно поделились {contacts} {contacts == 1 ? 'контактом' : 'контактами'}.
            </div>
        );
    }

});

var NotificationActivityCreateView = React.createClass({

    mixins : [AppContextMixin],

    propTypes: {
        n: React.PropTypes.object
    },

    render: function() {
        var n = this.props.n;

        return (
            <div key={n.id} className="notificationCenter-item">
                <div className="notificationCenter-item-meta">
                    {moment(n.date_created).fromNow()}
                </div>
                Новое взаимодействие успешно добавлено.
            </div>
        );
    }

});

var NotificationFilterCreateView = React.createClass({

    mixins : [AppContextMixin],

    propTypes: {
        n: React.PropTypes.object
    },

    render: function() {
        var n = this.props.n,
            filter_title = n.extra.filter_title;

        return (
            <div key={n.id} className="notificationCenter-item">
                <div className="notificationCenter-item-meta">
                    {moment(n.date_created).fromNow()}
                </div>
                Новый фильтр {filter_title} успешно добавлен
            </div>
        );
    }

});

var NotificationFilterEditView = React.createClass({

    mixins : [AppContextMixin],

    propTypes: {
        n: React.PropTypes.object
    },

    render: function() {
        var n = this.props.n,
            filter_title = n.extra.filter_title;

        return (
            <div key={n.id} className="notificationCenter-item">
                <div className="notificationCenter-item-meta">
                    {moment(n.date_created).fromNow()}
                </div>
                Фильтр {filter_title} успешно изменён.
            </div>
        );
    }

});

var NotificationFilterDeleteView = React.createClass({

    mixins : [AppContextMixin],

    propTypes: {
        n: React.PropTypes.object
    },

    render: function() {
        var n = this.props.n;

        return (
            <div key={n.id} className="notificationCenter-item">
                <div className="notificationCenter-item-meta">
                    {moment(n.date_created).fromNow()}
                </div>
                Фильтр успешно удален.
            </div>
        );
    }

});

var NotificationImportContactsView = React.createClass({

    mixins : [AppContextMixin],

    propTypes: {
        n: React.PropTypes.object
    },

    render: function() {
        var n = this.props.n,
            count = n.extra.count;

        return (
            <div key={n.id} className="notificationCenter-item">
                <div className="notificationCenter-item-meta">
                    {moment(n.date_created).fromNow()}
                </div>
                Успешно импортировано: {count} {count == 1 ? 'контакт' : 'контактов'}.
            </div>
        );
    }

});

var NotificationSalesCycleCloseView = React.createClass({

    mixins : [AppContextMixin],

    propTypes: {
        n: React.PropTypes.object
    },

    render: function() {
        var n = this.props.n,
            sales_cycle_title = n.extra.sales_cycle_title;

        return (
            <div key={n.id} className="notificationCenter-item">
                <div className="notificationCenter-item-meta">
                    {moment(n.date_created).fromNow()}
                </div>
                Цикл {sales_cycle_title} успешно закрыт.
            </div>
        );
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
        case NotifTypes.FILTER_DELETE:
            TPL = NotificationFilterDeleteView;
            break;
        case NotifTypes.IMPORT_CONTACTS:
            TPL = NotificationImportContactsView;
            break;
        case NotifTypes.SALES_CYCLE_CLOSE:
            TPL = NotificationSalesCycleCloseView;
            break;
        default:
            // do nothing
            true;
    };
    return <TPL key={n.id} n={n} />
};

module.exports = {
    renderNotification: renderNotification
}
