/**
 * @jsx React.DOM
 */
var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var DefaultRoute = Router.DefaultRoute;
var Redirect = Router.Redirect;

var CRMApp = React.createFactory(require('./components/CRMApp.react'));
var Contacts = React.createFactory(require('./components/CRMContacts.react'));
var ContactsSelectedView = require('./components/ContactsSelected.react');
var ContactSelectedView = require('./components/ContactSelected.react');
var ContactProfileView = require('./components/ContactProfileView.react');
var master_views = require('./components/master_views');


var routes = (
    <Route name="main" path="/" handler={CRMApp}>
        <Route name="contacts" path="/contacts" handler={Contacts}>
            <DefaultRoute name='shared_default' handler={master_views.Shared.DetailView} />
            <Route name='shared' handler={master_views.Shared.DetailView} />
            <Route name='coldbase' handler={master_views.ColdBase.DetailView} />
        </Route>
        <Route name="contact_selected" path="/contact/:id" handler={ContactSelectedView} />
        <Route name="contacts_selected" path="/contacts/:ids" handler={ContactsSelectedView} />
        <Route name="contact_profile" path="/contact/:id/detail" handler={ContactProfileView} />
        <Redirect from="/" to="contacts" />
    </Route>
);

var Node = function(name, alt) {
    this.name = name;
    this.alt = alt;
}

Node.prototype.getName = function() {
    if(_.isFunction(this.alt)) {
        return this.alt.apply(this, arguments);
    }
    return this.alt;
}

module.exports.NODES = {
    'contact_selected': new Node('contact_selected', "Выбранные контакты"),
    'contacts_selected': new Node('contacts_selected', "Выбранные контакты"),
    'contact_profile': new Node('contact_profile', function(params){
        return this.get(params.id).fn
    }.bind(require('./stores/ContactStore'))),
    'contacts': new Node('contacts', 'Контакты'),
    'shared': new Node('shared', 'Входящие'),
    'coldbase': new Node('coldbase', 'Холодная база'),
    'shared_default': new Node('shared_default', 'Входящие'),
    'main': new Node('main', 'главная')
}

module.exports.relationships = {
    'contacts_selected': ['contacts', 'shared', 'shared_default'],
    'contact_selected': ['contacts', 'shared', 'shared_default'],
    'contact_profile': ['contact_selected', 'contacts_selected', 'coldbase']
}
module.exports.routes = routes

