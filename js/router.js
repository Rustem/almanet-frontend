/**
 * @jsx React.DOM
 */
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var DefaultRoute = Router.DefaultRoute;
var ContactViews = require('./constants/CRMConstants').ContactViews;

var CRMContactsApp = require('./components/CRMContactsApp.react')
var master_views = require('./components/master_views');


var shared_view = ContactViews.SHARED_CONTACT_VIEW;
var coldbase_view = ContactViews.COLD_BASE_CONTACT_VIEW;

var routes = (
    <Route name="contacts" path="/" handler={CRMContactsApp} alt="контакты">
        <DefaultRoute handler={master_views.Shared.DetailView} alt="Входящие" />
        <Route
            name='shared'
            handler={master_views.Shared.DetailView}
            alt="Входящие" />
        <Route
            name='coldbase'
            handler={master_views.ColdBase.DetailView}
            alt="Холодная база"/>
    </Route>
);

module.exports = routes
