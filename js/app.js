/**
 * @jsx React.DOM
 */

// This file bootstraps the entire application.
var RSVP = require('rsvp');
var React = require('react');
var routes = require('./router');
var Routes = require('react-router').Routes;
var AppActionCreators = require('./actions/AppActionCreators');
var CRMContactsApp = require('./components/CRMContactsApp.react');
var ContactWebApi = require('./api/ContactWebAPI');
var AuthWebAPI = require('./api/AuthWebAPI');

// TODO: use promises
// load initial data to services
AuthWebAPI.loadCurrentUser(function(user){
    ContactWebApi.getAllContacts(function(contacts){
        ContactWebApi.getAllShares(function(shares){
            var appState = {
                user: user,
                contacts: contacts,
                shares: shares};
            console.log(appState);
            AppActionCreators.load(appState);
            // render app
            React.render(
              <Routes children={routes}/>,
              document.getElementById('js-crm-app')
            );
        });
    });

});
