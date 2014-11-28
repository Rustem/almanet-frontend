/**
 * @jsx React.DOM
 */

// This file bootstraps the entire application.
var RSVP = require('rsvp');
var React = require('react');
var Router = require('react-router');
var AppActionCreators = require('./actions/AppActionCreators');
var ContactWebAPI = require('./api/ContactWebAPI');
var AuthWebAPI = require('./api/AuthWebAPI');
var UserWebAPI = require('./api/UserWebAPI');
var ActivityWebAPI = require("./api/ActivityWebAPI");
var SalesCycleWebAPI = require("./api/SalesCycleWebAPI");
var BreadcrumbStore = require('./stores/BreadcrumbStore');
var routes = require('./router').routes;
var NODES = require('./router').NODES;
var relationships = require('./router').relationships;
var Fixtures = require('./fixtures');

Fixtures.init();
// TODO: use promises
// load initial data to services
AuthWebAPI.loadCurrentUser(function(user){
    ContactWebAPI.getAllContacts(function(contacts){
        ContactWebAPI.getAllShares(function(shares){
            UserWebAPI.getAll(function(users){
                ActivityWebAPI.getAll(function(activities){
                    SalesCycleWebAPI.getAll(function(salescycles){
                        var appState = {
                            user: user,
                            contacts: contacts,
                            shares: shares,
                            users: users,
                            activities: activities,
                            salescycles: salescycles
                        };
                        AppActionCreators.load(appState);
                        // breadcrumb store is mutable store but the logic remaining as flux
                        BreadcrumbStore.initialize(NODES, relationships);
                        // render app
                        Router.run(routes, function(Handler, state){
                            BreadcrumbStore.update(state.routes, state.params, state.query);
                            React.render(<Handler />, document.getElementById('js-crm-app'));
                        })
                    });
                });
            });
        });
    });

});
