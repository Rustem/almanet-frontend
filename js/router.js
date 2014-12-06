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
var ContactProfileView = require('./components/ContactProfileView.react');
var ActivityListView = require('./components/ActivityListView.react');
var master_views = require('./components/master_views');


var routes = (
    <Route name="main" path="/" handler={CRMApp}>
        <Route name="contacts" path="/contacts" handler={Contacts}>
            <DefaultRoute name='shared_default' handler={master_views.Shared.DetailView} />
            <Route name='shared' handler={master_views.Shared.DetailView} />
            <Route name='allbase' handler={master_views.AllBase.DetailView} />
            <Route name='recent' handler={master_views.Recent.DetailView} />
            <Route name='coldbase' handler={master_views.ColdBase.DetailView} />
            <Route name='leadbase' handler={master_views.LeadBase.DetailView} />
        </Route>
        <Route name="contacts_selected" path="/contacts/selected/" handler={ContactsSelectedView} />
        <Route name="contact_profile" path="/contact/:id/detail" handler={ContactProfileView}>
            <DefaultRoute name="activities_by_default" handler={ActivityListView} />
            <Route name="activities_by" path="actvs/by/:salescycle_id?" handler={ActivityListView} />
        </Route>
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
    'contacts_selected': new Node('contacts_selected', "Выбранные контакты"),
    'contact_profile': new Node('contact_profile', function(params){
        return this.get(params.id).fn
    }.bind(require('./stores/ContactStore'))),
    'activities_by': new Node('activities_by', 'события'),
    'activities_by_default': new Node('activities_by_default', 'события'),
    'contacts': new Node('contacts', 'Контакты'),
    'shared': new Node('shared', 'Входящие'),
    'allbase': new Node('allbase', 'Все'),
    'recent': new Node('recent', 'Недавние'),
    'leadbase': new Node('leadbase', 'Контакты в обработке'),
    'coldbase': new Node('coldbase', 'Холодная база'),
    'shared_default': new Node('shared_default', 'Входящие'),
    'main': new Node('main', 'главная')
}

module.exports.relationships = {
    'contacts_selected': ['contacts', 'shared', 'shared_default', 'coldbase', 'allbase', 'leadbase', 'recent'],
    'contact_profile': ['contact_selected', 'contacts_selected'],
    'activities_by': ['contact_selected', 'contacts_selected'],
    'activities_by_default': ['contact_selected', 'contacts_selected'],
}
module.exports.routes = routes

