/**
 * @jsx React.DOM
 */

// This file bootstraps the entire application.
var RSVP = require('rsvp');
var React = require('react');
var Router = require('react-router');
var AppActionCreators = require('./actions/AppActionCreators');
var ContactWebApi = require('./api/ContactWebAPI');
var AuthWebAPI = require('./api/AuthWebAPI');
var BreadcrumbStore = require('./stores/BreadcrumbStore');
var routes = require('./router').routes;
var NODES = require('./router').NODES;
var relationships = require('./router').relationships;
// TODO: use promises
// load initial data to services
AuthWebAPI.loadCurrentUser(function(user){
    ContactWebApi.getAllContacts(function(contacts){
        ContactWebApi.getAllShares(function(shares){
            var appState = {
                user: user,
                contacts: contacts,
                shares: shares};
            AppActionCreators.load(appState);
            // breadcrumb store is mutable store but the logic remaining as flux
            BreadcrumbStore.initialize(NODES, relationships)
            // render app
            Router.run(routes, function(Handler, state){
                BreadcrumbStore.update(state.routes, state.params, state.query);
                React.render(<Handler />, document.getElementById('js-crm-app'));
            });
        });
    });

});
