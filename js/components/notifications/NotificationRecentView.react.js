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
            fn = n.extra.fn;
        return (
            <div className="notification active">
              <div className="notification-body">
                <div className="notification-message">
                  Новый контакт {fn} успешно создан.
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
            fn = n.extra.fn;

        return (
            <div className="notification active">
              <div className="notification-body">
                <div className="notification-message">
                  Контакт {fn} успешно изменён.
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
            contacts = n.extra.contacts;

        return (
            <div className="notification active">
              <div className="notification-body">
                <div className="notification-message">
                  Вы успешно поделились {contacts} {contacts == 1 ? 'контактом' : 'контактами'}.
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
        var n = this.props.n;

        return (
            <div className="notification active">
              <div className="notification-body">
                <div className="notification-message">
                  Новое взаимодействие успешно добавлено.
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
            filter_title = n.extra.filter_title;

        return (
            <div className="notification active">
              <div className="notification-body">
                <div className="notification-message">
                  Новый фильтр {filter_title} успешно добавлен.
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
            filter_title = n.extra.filter_title;

        return (
            <div className="notification active">
              <div className="notification-body">
                <div className="notification-message">
                  Фильтр {filter_title} успешно изменён.
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

var NotificationFilterDeleteView = React.createClass({

    mixins : [AppContextMixin],

    propTypes: {
        n: React.PropTypes.object
    },

    render: function() {
        var n = this.props.n;

        return (
            <div className="notification active">
              <div className="notification-body">
                <div className="notification-message">
                  Фильтр успешно удален.
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

var NotificationImportContactsView = React.createClass({

    mixins : [AppContextMixin],

    propTypes: {
        n: React.PropTypes.object
    },

    render: function() {
        var n = this.props.n,
            count = n.extra.count;

        return (
            <div className="notification active">
              <div className="notification-body">
                <div className="notification-message">
                  Успешно импортировано: {count} {count == 1 ? 'контакт' : 'контактов'}.
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

var NotificationSalesCycleCloseView = React.createClass({

    mixins : [AppContextMixin],

    propTypes: {
        n: React.PropTypes.object
    },

    render: function() {
        var n = this.props.n,
            sales_cycle_title = n.extra.sales_cycle_title;

        return (
            <div className="notification active">
              <div className="notification-body">
                <div className="notification-message">
                  Цикл {sales_cycle_title} успешно закрыт.
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
    return <TPL key={n.id} n={n} onClose={this.onNotifRead} />
};

module.exports = {
    renderNotification: renderNotification
}
