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
        n: React.PropTypes.object
    },

    render: function() {
        var n = this.props.n,
            author = UserStore.get(n.author_id),
            createdContact = ContactStore.get(n.extra.contact_id);
        return (
            <div className="notificationCenter-item">
                <div className="notificationCenter-item-meta">
                    {moment(n.at).fromNow()}
                </div>
                Пользователь {utils.capitalize(author.first_name)} создал новый контакт. Имя контакта - {createdContact.fn}.
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
            author = UserStore.get(n.author_id),
            createdContact = ContactStore.get(n.extra.contact_id);
        return (
            <div key={n.id} className="notificationCenter-item">
                <div className="notificationCenter-item-meta">
                    {moment(n.at).fromNow()}
                </div>
                Пользователь {utils.capitalize(author.first_name)} изменил контакт {createdContact.fn}.
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
        case NotifTypes.CONTACT_UPDATE:
            TPL = NotificationContactUpdateView;
            break;
        default:
            // do nothing
            true;
    };
    return <TPL n={n} />
};

module.exports = {
    renderNotification: renderNotification
}
