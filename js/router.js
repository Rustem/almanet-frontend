/**
 * @jsx React.DOM
 */
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var ContactViews = require('./constants/CRMConstants').ContactViews;

var CRMContactsApp = require('./components/CRMContactsApp.react')
var master_views = require('./components/master_views');


var shared_view = ContactViews.SHARED_CONTACT_VIEW;
var coldbase_view = ContactViews.COLD_BASE_CONTACT_VIEW;

var routes = (
    <Route handler={CRMContactsApp}>
        <Route
            name={ContactViews.get(shared_view)}
            path={shared_view}
            handler={master_views.Shared.DetailView}/>
        <Route
            name={ContactViews.get(coldbase_view)}
            params={coldbase_view}
            handler={master_views.ColdBase.DetailView}/>
    </Route>
);

module.exports = routes
